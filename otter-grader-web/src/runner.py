"""Grading runtime executed inside Pyodide.

Loaded once per batch by grader.worker.js. It executes each submitted notebook with an
IPython InteractiveShell (no kernel subprocess, which WebAssembly cannot spawn) and
reuses otter-grader's own test-file and scoring classes so results match ``otter grade``.
"""

import asyncio
import glob
import io
import json
import os
import shutil
import sys
import traceback

AG_DIR = "/ag"
TESTS_DIR = os.path.join(AG_DIR, "tests")
FILES_DIR = os.path.join(AG_DIR, "files")
WORK_ROOT = "/work"

_shell = None
_config = {}
_counter = 0
_output_limit = 20000  # characters of captured stdout/stderr kept per notebook


def _make_shell():
    """Create the IPython shell used to run notebook cells."""
    from IPython.core.interactiveshell import InteractiveShell
    from traitlets.config import Config

    class GraderShell(InteractiveShell):
        # GUI event loops do not exist in a worker; ``%matplotlib`` must not try one.
        def enable_gui(self, gui=None):
            pass

    cfg = Config()
    cfg.HistoryManager.enabled = False
    cfg.InteractiveShell.cache_size = 0
    GraderShell.clear_instance()
    shell = GraderShell.instance(config=cfg)
    for value in ("nocolor", "NoColor"):  # IPython 9 vs 8 spellings
        try:
            shell.colors = value
            break
        except Exception:  # noqa: BLE001
            continue
    return shell


def prepare_batch(config_json):
    """Called once per batch after packages are installed."""
    global _shell, _config
    _config = json.loads(config_json) if isinstance(config_json, str) else dict(config_json)
    os.environ.setdefault("MPLBACKEND", "module://matplotlib_inline.backend_inline")
    os.makedirs(WORK_ROOT, exist_ok=True)
    warm = []
    try:
        # Route urllib/requests through the browser so pandas/datascience can read data URLs.
        import pyodide_http

        pyodide_http.patch_all()
    except Exception as e:  # noqa: BLE001
        warm.append(f"pyodide_http: {type(e).__name__}: {e}")
    _shell = _make_shell()
    for mod in ("numpy", "pandas", "matplotlib.pyplot", "datascience", "otter"):
        try:
            __import__(mod)
        except Exception as e:  # noqa: BLE001
            warm.append(f"{mod}: {type(e).__name__}: {e}")
    import otter

    return json.dumps({"otter_version": otter.__version__, "warmup_warnings": warm})


def _reset_between_notebooks(prev_dir):
    from otter import Notebook

    try:
        import matplotlib.pyplot as plt

        plt.close("all")
    except Exception:  # noqa: BLE001
        pass
    for name, mod in list(sys.modules.items()):
        f = getattr(mod, "__file__", None) or ""
        if f.startswith(WORK_ROOT + "/"):
            del sys.modules[name]
    sys.path[:] = [p for p in sys.path if not p.startswith(WORK_ROOT + "/")]
    if prev_dir and os.path.isdir(prev_dir):
        shutil.rmtree(prev_dir, ignore_errors=True)
    _shell.reset(new_session=True)
    Notebook.init_grading_mode(TESTS_DIR)


def _seed_prefix(cfg):
    seed = cfg.get("seed")
    if seed is None:
        return None
    var = cfg.get("seed_variable")
    if var:
        return f"{var} = {seed!r}\n"
    return (
        "import numpy as __otter_np, random as __otter_random\n"
        f"__otter_np.random.seed({seed!r}); __otter_random.seed({seed!r})\n"
        "del __otter_np, __otter_random\n"
    )


def _cell_ignored(cell):
    meta = cell.get("metadata", {}) or {}
    if "otter_ignore" in (meta.get("tags") or []):
        return True
    return bool((meta.get("otter") or {}).get("ignore"))


async def _run_cell(src):
    """Run one cell; returns an error description or None."""
    try:
        transformed = _shell.transform_cell(src)
        preproc_exc = None
    except Exception:  # noqa: BLE001
        transformed = src
        preproc_exc = sys.exc_info()
    result = await _shell.run_cell_async(
        src,
        store_history=False,
        silent=False,
        transformed_cell=transformed,
        preprocessing_exc_tuple=preproc_exc,
    )
    err = result.error_before_exec or result.error_in_exec
    if err is None:
        return None
    return f"{type(err).__name__}: {err}"


async def grade_one(nb_name, nb_json):
    """Grade a single notebook. Returns a JSON string with the outcome."""
    global _counter
    from otter import Notebook
    from otter.execute.checker import Checker
    from otter.test_files import GradingResults

    prev_dir = os.path.join(WORK_ROOT, str(_counter))
    _counter += 1
    work = os.path.join(WORK_ROOT, str(_counter))
    log = []
    out_buf = io.StringIO()

    def finish(results, status):
        questions = {}
        if results is not None and getattr(results, "catastrophic_error", None) is None:
            for name, d in results.to_dict().items():
                questions[name] = {"score": d["score"], "possible": d["possible"]}
            total, possible = results.total, results.possible
        else:
            total, possible = 0, 0
        percent = round(total / possible, 4) if possible else 0
        captured = out_buf.getvalue()
        if len(captured) > _output_limit:
            captured = captured[:_output_limit] + f"\n... [truncated {len(captured) - _output_limit} chars]"
        return json.dumps(
            {
                "file": nb_name,
                "questions": questions,
                "total": total,
                "possible": possible,
                "percent": percent,
                "status": status,
                "log": log,
                "output": captured,
            }
        )

    try:
        _reset_between_notebooks(prev_dir)
        os.makedirs(work, exist_ok=True)
        if os.path.isdir(FILES_DIR):
            shutil.copytree(FILES_DIR, work, dirs_exist_ok=True)
        nb_path = os.path.join(work, os.path.basename(nb_name))
        with open(nb_path, "w", encoding="utf-8") as f:
            f.write(nb_json)
        os.chdir(work)
        sys.path.append(work)

        nb = json.loads(nb_json)
        nb_meta = (nb.get("metadata") or {}).get("otter") or {}
        expected = _config.get("assignment_name")
        if expected:
            got = nb_meta.get("assignment_name")
            if got != expected:
                raise RuntimeError(
                    f"Received submission for assignment '{got}' (this is assignment '{expected}')"
                )

        seed_prefix = _seed_prefix(_config)
        cells = [c for c in nb.get("cells", []) if c.get("cell_type") == "code"]
        real_stdout, real_stderr = sys.stdout, sys.stderr
        sys.stdout = sys.stderr = out_buf
        try:
            for idx, cell in enumerate(cells):
                if _cell_ignored(cell):
                    continue
                src = cell.get("source") or ""
                if isinstance(src, list):
                    src = "".join(src)
                if not src.strip():
                    continue
                if seed_prefix and not src.lstrip().startswith("%%"):
                    src = seed_prefix + src
                err = await _run_cell(src)
                if err:
                    log.append(f"cell {idx}: {err}")
                for test in ((cell.get("metadata") or {}).get("otter") or {}).get("tests") or []:
                    err = await _run_cell(f"__import__('otter').Notebook().check({test!r})")
                    if err:
                        log.append(f"cell {idx} check {test}: {err}")
            for path in sorted(glob.glob(os.path.join(TESTS_DIR, "*.py"))):
                try:
                    Checker.check_if_not_already_checked(path, global_env=_shell.user_ns)
                except Exception as e:  # noqa: BLE001
                    log.append(f"test {os.path.basename(path)}: {type(e).__name__}: {e}")
        finally:
            sys.stdout, sys.stderr = real_stdout, real_stderr
        results = GradingResults(Checker.get_results())
        return finish(results, "Completed")
    except Exception as e:  # noqa: BLE001
        log.append("".join(traceback.format_exception(type(e), e, e.__traceback__))[-4000:])
        return finish(None, f"{type(e).__name__}: {e}")
    finally:
        try:
            os.chdir(WORK_ROOT)
        except Exception:  # noqa: BLE001
            pass
