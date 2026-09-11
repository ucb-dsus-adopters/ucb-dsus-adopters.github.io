// Module Web Worker: boots Pyodide, installs otter-grader and course packages, grades notebooks.
// Protocol (main -> worker): init, prepareBatch, gradeNotebook, freeze, dispose.
// Protocol (worker -> main): ready, phase, warning, started, result, prepared, frozen, error.
import runnerSource from './runner.py?raw';
import { installEnvironment, lockIndex } from './installer.js';

export const PYODIDE_VERSION = '0.28.3';
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodide = null;
let micropip = null;
let lock = null;
let currentStdout = [];

const post = (type, payload = {}) => self.postMessage({ type, ...payload });
const phase = (text) => post('phase', { text });
const warn = (text) => post('warning', { text });
const note = (text) => post('note', { text });

async function init({ lockFile = null } = {}) {
  phase('Loading Python runtime (first load can take a minute)');
  const { loadPyodide } = await import(/* @vite-ignore */ `${PYODIDE_URL}pyodide.mjs`);
  const opts = {
    indexURL: PYODIDE_URL,
    stdout: (s) => currentStdout.push(s),
    stderr: (s) => currentStdout.push(s),
  };
  if (lockFile) opts.lockFileURL = URL.createObjectURL(new Blob([lockFile], { type: 'application/json' }));
  pyodide = await loadPyodide(opts);
  pyodide.setEnv?.('MPLBACKEND', 'module://matplotlib_inline.backend_inline');
  pyodide.runPython('import os; os.environ["MPLBACKEND"] = "module://matplotlib_inline.backend_inline"');
  await pyodide.loadPackage(['micropip', 'sqlite3']);
  micropip = pyodide.pyimport('micropip');
  try {
    lock = lockIndex(await (await fetch(`${PYODIDE_URL}pyodide-lock.json`)).json());
  } catch {
    lock = new Map();
  }
  post('ready', { pyodideVersion: pyodide.version });
}

function writeTree(root, entries) {
  const FS = pyodide.FS;
  const mkdirp = (dir) => {
    let cur = '';
    for (const part of dir.split('/').filter(Boolean)) {
      cur += '/' + part;
      try {
        FS.mkdir(cur);
      } catch {
        /* exists */
      }
    }
  };
  mkdirp(root);
  for (const { path, data } of entries) {
    const full = `${root}/${path}`;
    mkdirp(full.slice(0, full.lastIndexOf('/')));
    FS.writeFile(full, data);
  }
}

async function prepareBatch({ otterVersion, requirements = [], extraPackages = [], tests, files, config }) {
  const notes = [];
  const { installed } = await installEnvironment({
    micropip,
    lock,
    otterVersion,
    requirements,
    extraPackages,
    onPhase: phase,
    onNote: note,
    onWarning: warn,
  });

  phase('Preparing tests and data files');
  writeTree('/ag/tests', tests.map((t) => ({ path: `${t.name}.py`, data: t.source })));
  writeTree('/ag/files', files);
  pyodide.runPython(runnerSource);
  const prep = pyodide.runPython(`prepare_batch(${JSON.stringify(JSON.stringify(config || {}))})`);
  const info = JSON.parse(prep);
  for (const w of info.warmup_warnings || []) if (!/datascience/.test(w)) notes.push(w);
  post('prepared', { otterVersion: info.otter_version, notes, installed });
}

async function gradeNotebook({ file, path, text }) {
  post('started', { file });
  currentStdout = [];
  try {
    await pyodide.loadPackagesFromImports(codeOf(text));
  } catch {
    /* best effort */
  }
  pyodide.globals.set('__nb_name', file);
  pyodide.globals.set('__nb_json', text);
  const raw = await pyodide.runPythonAsync('await grade_one(__nb_name, __nb_json)');
  const res = JSON.parse(raw);
  res.path = path;
  if (currentStdout.length && !res.output) res.output = currentStdout.join('\n');
  post('result', { result: res });
}

function codeOf(nbText) {
  try {
    const nb = JSON.parse(nbText);
    return (nb.cells || [])
      .filter((c) => c.cell_type === 'code')
      .map((c) => (Array.isArray(c.source) ? c.source.join('') : c.source || ''))
      .join('\n')
      .split('\n')
      .filter((line) => !/^\s*[%!]/.test(line))
      .join('\n');
  } catch {
    return '';
  }
}

self.onmessage = async (ev) => {
  const { type, id, ...payload } = ev.data || {};
  try {
    if (type === 'init') await init(payload);
    else if (type === 'prepareBatch') await prepareBatch(payload);
    else if (type === 'gradeNotebook') await gradeNotebook(payload);
    else if (type === 'freeze') post('frozen', { lockFile: micropip.freeze() });
    else if (type === 'dispose') self.close();
    post('done', { id, request: type });
  } catch (e) {
    post('error', { id, request: type, message: (e && e.message) || String(e) });
  }
};
