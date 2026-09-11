var T = `"""Grading runtime executed inside Pyodide.

Loaded once per batch by grader.worker.js. It executes each submitted notebook with an
IPython InteractiveShell (no kernel subprocess, which WebAssembly cannot spawn) and
reuses otter-grader's own test-file and scoring classes so results match \`\`otter grade\`\`.
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
        # GUI event loops do not exist in a worker; \`\`%matplotlib\`\` must not try one.
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
        return f"{var} = {seed!r}\\n"
    return (
        "import numpy as __otter_np, random as __otter_random\\n"
        f"__otter_np.random.seed({seed!r}); __otter_random.seed({seed!r})\\n"
        "del __otter_np, __otter_random\\n"
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
            captured = captured[:_output_limit] + f"\\n... [truncated {len(captured) - _output_limit} chars]"
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
`;
const P = /^(otter[-_]grader|ipykernel|jupyter[-_]?.*|nbclient|nbconvert|nbformat|notebook|traitlets|ipython[-_]genutils|nest[-_]asyncio|debugpy|gspread|pypdf|rpy2|google[-_].*|tornado|pyzmq|psutil|pexpect|pip|setuptools|wheel|pyodide[-_]http)$/i, q = ["pyodide-http"];
function x(n) {
  return String(n || "").trim().toLowerCase().replace(/[-_.]+/g, "-");
}
function B(n) {
  const r = String(n || "").replace(/;.*$/, "").trim(), t = /^([A-Za-z0-9][A-Za-z0-9._-]*)\s*(\[[^\]]*\])?\s*(.*)$/.exec(r);
  if (!t) return { name: x(r), extras: "", pin: null, spec: r };
  const o = (t[3] || "").trim(), a = /^==\s*([0-9][0-9A-Za-z.+!]*)$/.exec(o);
  return { name: x(t[1]), extras: t[2] || "", pin: a ? a[1] : null, constraint: o, spec: r };
}
function y(n) {
  return parseInt(String(n || "").split(".")[0], 10) || 0;
}
function D(n) {
  const r = /* @__PURE__ */ new Map();
  for (const [t, o] of Object.entries(n && n.packages || {}))
    r.set(x(t), { version: o.version, pure: /py3-none-any\.whl$/.test(o.file_name || "") || !/\.whl$/.test(o.file_name || "") });
  return r;
}
async function A({ micropip: n, lock: r, otterVersion: t, requirements: o = [], extraPackages: a = [], onPhase: _ = () => {
}, onNote: c = () => {
}, onWarning: m = () => {
} }) {
  const b = (e) => {
    const s = String(e && e.message || e).split(`
`).map((i) => i.trim()).filter(Boolean);
    return s[s.length - 1] || "unknown error";
  }, u = async (e, s = {}) => {
    try {
      return await n.install(e, s), null;
    } catch (i) {
      return b(i);
    }
  }, f = (e) => {
    try {
      const s = n.list(), i = s.get ? s.get(e) : null;
      return i ? i.version : null;
    } catch {
      return null;
    }
  }, j = [], S = /* @__PURE__ */ new Set();
  for (const [e, s] of [["extra", a], ["autograder", o]])
    for (const i of s) {
      const p = B(i);
      !p.name || P.test(p.name) || S.has(p.name) || (S.add(p.name), j.push({ ...p, source: e }));
    }
  const O = [];
  for (const e of j) {
    const s = r.get(e.name);
    if (s && !s.pure) {
      const i = e.pin ? ` (autograder pins ${e.pin})` : e.constraint ? ` (autograder asks for ${e.constraint})` : "", p = `${e.name}: using ${s.version} bundled with the browser runtime${i}`;
      e.pin && y(e.pin) !== y(s.version) ? m(`${p}; the major version differs, so results may not match the container grader`) : c(p);
      continue;
    }
    if (e.source === "extra") {
      O.push(e);
      continue;
    }
    await $(e);
  }
  _(`Installing otter-grader ${t}`), await u(["fica", "python-on-whales"], { deps: !1 });
  const I = await u(`otter-grader==${t}`);
  if (I) throw new Error(`otter-grader ${t} could not be installed in the browser runtime: ${I}`);
  for (const e of q) {
    const s = await u(e);
    s && m(`could not install ${e}: ${s}`);
  }
  for (const e of O) await $(e, !0);
  async function $(e, s = !1) {
    _(`Installing ${e.name}`);
    const i = f(e.name);
    if (i && !s) {
      if (!e.pin || i === e.pin) return;
      const w = `${e.name}: using ${i}, already installed as a dependency (autograder pins ${e.pin})`;
      y(e.pin) !== y(i) ? m(w) : c(w);
      return;
    }
    const p = s && i ? { reinstall: !0 } : {};
    e.name === "datascience" && (await u(["numpy", "pandas", "matplotlib", "scipy", "folium", "branca"]), p.deps = !1);
    let h = await u(e.spec, p);
    h && (e.pin || e.constraint) && (await u(e.name + e.extras, p) || (c(`${e.name}: no browser build for "${e.spec}", installed ${f(e.name) || "a compatible version"} instead`), h = null)), h && m(`could not install ${e.spec}: ${h}`);
  }
  const N = {};
  try {
    const e = n.list();
    for (const s of e.keys()) N[s] = e.get(s).version;
  } catch {
  }
  return { installed: N };
}
const C = "0.28.3", k = `https://cdn.jsdelivr.net/pyodide/v${C}/full/`;
let l = null, E = null, v = null, g = [];
const d = (n, r = {}) => self.postMessage({ type: n, ...r }), R = (n) => d("phase", { text: n }), F = (n) => d("warning", { text: n }), G = (n) => d("note", { text: n });
async function K({ lockFile: n = null } = {}) {
  R("Loading Python runtime (first load can take a minute)");
  const { loadPyodide: r } = await import(
    /* @vite-ignore */
    `${k}pyodide.mjs`
  ), t = {
    indexURL: k,
    stdout: (o) => g.push(o),
    stderr: (o) => g.push(o)
  };
  n && (t.lockFileURL = URL.createObjectURL(new Blob([n], { type: "application/json" }))), l = await r(t), l.setEnv?.("MPLBACKEND", "module://matplotlib_inline.backend_inline"), l.runPython('import os; os.environ["MPLBACKEND"] = "module://matplotlib_inline.backend_inline"'), await l.loadPackage(["micropip", "sqlite3"]), E = l.pyimport("micropip");
  try {
    v = D(await (await fetch(`${k}pyodide-lock.json`)).json());
  } catch {
    v = /* @__PURE__ */ new Map();
  }
  d("ready", { pyodideVersion: l.version });
}
function L(n, r) {
  const t = l.FS, o = (a) => {
    let _ = "";
    for (const c of a.split("/").filter(Boolean)) {
      _ += "/" + c;
      try {
        t.mkdir(_);
      } catch {
      }
    }
  };
  o(n);
  for (const { path: a, data: _ } of r) {
    const c = `${n}/${a}`;
    o(c.slice(0, c.lastIndexOf("/"))), t.writeFile(c, _);
  }
}
async function z({ otterVersion: n, requirements: r = [], extraPackages: t = [], tests: o, files: a, config: _ }) {
  const c = [], { installed: m } = await A({
    micropip: E,
    lock: v,
    otterVersion: n,
    requirements: r,
    extraPackages: t,
    onPhase: R,
    onNote: G,
    onWarning: F
  });
  R("Preparing tests and data files"), L("/ag/tests", o.map((f) => ({ path: `${f.name}.py`, data: f.source }))), L("/ag/files", a), l.runPython(T);
  const b = l.runPython(`prepare_batch(${JSON.stringify(JSON.stringify(_ || {}))})`), u = JSON.parse(b);
  for (const f of u.warmup_warnings || []) /datascience/.test(f) || c.push(f);
  d("prepared", { otterVersion: u.otter_version, notes: c, installed: m });
}
async function M({ file: n, path: r, text: t }) {
  d("started", { file: n }), g = [];
  try {
    await l.loadPackagesFromImports(U(t));
  } catch {
  }
  l.globals.set("__nb_name", n), l.globals.set("__nb_json", t);
  const o = await l.runPythonAsync("await grade_one(__nb_name, __nb_json)"), a = JSON.parse(o);
  a.path = r, g.length && !a.output && (a.output = g.join(`
`)), d("result", { result: a });
}
function U(n) {
  try {
    return (JSON.parse(n).cells || []).filter((t) => t.cell_type === "code").map((t) => Array.isArray(t.source) ? t.source.join("") : t.source || "").join(`
`).split(`
`).filter((t) => !/^\s*[%!]/.test(t)).join(`
`);
  } catch {
    return "";
  }
}
self.onmessage = async (n) => {
  const { type: r, id: t, ...o } = n.data || {};
  try {
    r === "init" ? await K(o) : r === "prepareBatch" ? await z(o) : r === "gradeNotebook" ? await M(o) : r === "freeze" ? d("frozen", { lockFile: E.freeze() }) : r === "dispose" && self.close(), d("done", { id: t, request: r });
  } catch (a) {
    d("error", { id: t, request: r, message: a && a.message || String(a) });
  }
};
