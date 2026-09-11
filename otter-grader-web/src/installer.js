// Package installation policy shared by the Web Worker and the Node spike.
//
// The browser runtime (Pyodide) ships compiled packages (numpy, pandas, matplotlib, scipy,
// scikit-learn, ...) at one fixed version each; no other version has a WebAssembly build.
// An autograder zip's exact pins for those cannot be satisfied, so the policy is:
//   1. skip Jupyter/Gradescope plumbing the browser never needs;
//   2. keep any package the runtime bundles as a compiled wheel, noting the pin it replaces
//      (a warning only when the major version differs);
//   3. install pure-Python pins as requested, before otter-grader so its dependencies
//      resolve against them, and fall back to an unpinned install when a pin has no wheel;
//   4. report the versions that ended up installed.

export const SKIP_REQ =
  /^(otter[-_]grader|ipykernel|jupyter[-_]?.*|nbclient|nbconvert|nbformat|notebook|traitlets|ipython[-_]genutils|nest[-_]asyncio|debugpy|gspread|pypdf|rpy2|google[-_].*|tornado|pyzmq|psutil|pexpect|pip|setuptools|wheel|pyodide[-_]http)$/i;

/** Packages needed at runtime so notebook code can fetch data over HTTPS. */
export const RUNTIME_EXTRAS = ['pyodide-http'];

export function canonical(name) {
  return String(name || '').trim().toLowerCase().replace(/[-_.]+/g, '-');
}

/** Split a pip requirement into { name, extras, pin } (pin is the exact version for ==, else null). */
export function parseSpec(spec) {
  const s = String(spec || '').replace(/;.*$/, '').trim();
  const m = /^([A-Za-z0-9][A-Za-z0-9._-]*)\s*(\[[^\]]*\])?\s*(.*)$/.exec(s);
  if (!m) return { name: canonical(s), extras: '', pin: null, spec: s };
  const constraint = (m[3] || '').trim();
  const eq = /^==\s*([0-9][0-9A-Za-z.+!]*)$/.exec(constraint);
  return { name: canonical(m[1]), extras: m[2] || '', pin: eq ? eq[1] : null, constraint, spec: s };
}

export function major(v) {
  return parseInt(String(v || '').split('.')[0], 10) || 0;
}

/** Build { name -> { version, pure } } from a Pyodide lockfile object. */
export function lockIndex(lock) {
  const out = new Map();
  for (const [name, info] of Object.entries((lock && lock.packages) || {})) {
    out.set(canonical(name), { version: info.version, pure: /py3-none-any\.whl$/.test(info.file_name || '') || !/\.whl$/.test(info.file_name || '') });
  }
  return out;
}

/**
 * Install everything for one batch.
 * @param {object} args
 * @param {object} args.micropip  Pyodide's micropip module (pyimport('micropip'))
 * @param {Map} args.lock         from lockIndex()
 * @param {string} args.otterVersion
 * @param {string[]} args.requirements   specs from the autograder zip
 * @param {string[]} args.extraPackages  specs typed by the user
 * @param {(t:string)=>void} args.onPhase
 * @param {(t:string)=>void} args.onNote
 * @param {(t:string)=>void} args.onWarning
 * @returns {Promise<{installed: Object<string,string>}>}
 */
export async function installEnvironment({ micropip, lock, otterVersion, requirements = [], extraPackages = [], onPhase = () => {}, onNote = () => {}, onWarning = () => {} }) {
  const lastLine = (e) => {
    const lines = String((e && e.message) || e).split('\n').map((l) => l.trim()).filter(Boolean);
    return lines[lines.length - 1] || 'unknown error';
  };
  const tryInstall = async (spec, opts = {}) => {
    try {
      await micropip.install(spec, opts);
      return null;
    } catch (e) {
      return lastLine(e);
    }
  };
  const installedVersion = (name) => {
    try {
      const list = micropip.list();
      const entry = list.get ? list.get(name) : null; // PackageDict is dict-like
      return entry ? entry.version : null;
    } catch {
      return null;
    }
  };

  // User-typed extras take precedence over the zip's spec for the same package.
  const plan = [];
  const seen = new Set();
  for (const [source, specs] of [['extra', extraPackages], ['autograder', requirements]]) {
    for (const raw of specs) {
      const p = parseSpec(raw);
      if (!p.name || SKIP_REQ.test(p.name) || seen.has(p.name)) continue;
      seen.add(p.name);
      plan.push({ ...p, source });
    }
  }

  // Pass 1: pure-Python pins from the zip go in before otter so otter resolves against them.
  const deferred = [];
  for (const p of plan) {
    const bundled = lock.get(p.name);
    if (bundled && !bundled.pure) {
      const pinned = p.pin ? ` (autograder pins ${p.pin})` : p.constraint ? ` (autograder asks for ${p.constraint})` : '';
      const msg = `${p.name}: using ${bundled.version} bundled with the browser runtime${pinned}`;
      if (p.pin && major(p.pin) !== major(bundled.version)) onWarning(`${msg}; the major version differs, so results may not match the container grader`);
      else onNote(msg);
      continue;
    }
    if (p.source === 'extra') {
      deferred.push(p);
      continue;
    }
    await installOne(p);
  }

  onPhase(`Installing otter-grader ${otterVersion}`);
  await tryInstall(['fica', 'python-on-whales'], { deps: false });
  const otterErr = await tryInstall(`otter-grader==${otterVersion}`);
  if (otterErr) throw new Error(`otter-grader ${otterVersion} could not be installed in the browser runtime: ${otterErr}`);
  for (const extra of RUNTIME_EXTRAS) {
    const err = await tryInstall(extra);
    if (err) onWarning(`could not install ${extra}: ${err}`);
  }

  // Pass 2: user-typed extras last, so they can override what the zip asked for.
  for (const p of deferred) await installOne(p, true);

  async function installOne(p, force = false) {
    onPhase(`Installing ${p.name}`);
    const already = installedVersion(p.name);
    if (already && !force) {
      if (!p.pin || already === p.pin) return;
      const msg = `${p.name}: using ${already}, already installed as a dependency (autograder pins ${p.pin})`;
      if (major(p.pin) !== major(already)) onWarning(msg);
      else onNote(msg);
      return;
    }
    const opts = force && already ? { reinstall: true } : {};
    if (p.name === 'datascience') {
      // datascience imports folium/branca eagerly and plotly lazily; skip the 16 MB plotly wheel.
      await tryInstall(['numpy', 'pandas', 'matplotlib', 'scipy', 'folium', 'branca']);
      opts.deps = false;
    }
    let err = await tryInstall(p.spec, opts);
    if (err && (p.pin || p.constraint)) {
      const retryErr = await tryInstall(p.name + p.extras, opts);
      if (!retryErr) {
        onNote(`${p.name}: no browser build for "${p.spec}", installed ${installedVersion(p.name) || 'a compatible version'} instead`);
        err = null;
      }
    }
    if (err) onWarning(`could not install ${p.spec}: ${err}`);
  }

  const installed = {};
  try {
    const list = micropip.list();
    for (const name of list.keys()) installed[name] = list.get(name).version;
  } catch {
    /* optional */
  }
  return { installed };
}
