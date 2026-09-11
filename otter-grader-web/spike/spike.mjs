// Node regression check: grade notebooks under Pyodide with the same install policy as the worker.
// Usage: npm i --no-save pyodide@0.28.3 && node spike/spike.mjs <otter-version|auto> <autograder.zip> <notebook.ipynb>...
import { loadPyodide } from 'pyodide';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { unzipSync } from 'fflate';
import { parseAutograder } from '../src/autograder.js';
import { resolveOtterVersion } from '../src/versions.js';
import { installEnvironment, lockIndex } from '../src/installer.js';
import { buildCsv } from '../src/csv.js';

const [versionArg = 'auto', agZip, ...notebooks] = process.argv.slice(2);
const t0 = Date.now();
const log = (...a) => console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s]`, ...a);

const py = await loadPyodide({ stdout: () => {}, stderr: (s) => process.stderr.write('PY! ' + s + '\n') });
py.runPython('import os; os.environ["MPLBACKEND"]="module://matplotlib_inline.backend_inline"');
await py.loadPackage(['micropip', 'sqlite3']);
const micropip = py.pyimport('micropip');
const lock = lockIndex(JSON.parse(readFileSync(new URL('../node_modules/pyodide/pyodide-lock.json', import.meta.url), 'utf8')));
log('pyodide ready', py.version);

const entries = new Map(Object.entries(unzipSync(new Uint8Array(readFileSync(agZip)))));
const ag = parseAutograder(entries);
const { version, reason } = resolveOtterVersion({ pin: ag.otterPin, override: versionArg === 'auto' ? null : versionArg });
log(reason, '| requirements:', ag.requirements.join(', '));

await installEnvironment({
  micropip, lock, otterVersion: version, requirements: ag.requirements,
  onPhase: (t) => log('phase:', t), onNote: (t) => log('note:', t), onWarning: (t) => log('WARN:', t),
});

const FS = py.FS;
const mkdirp = (d) => { let cur = ''; for (const p of d.split('/').filter(Boolean)) { cur += '/' + p; try { FS.mkdir(cur); } catch {} } };
mkdirp('/ag/tests'); mkdirp('/ag/files');
for (const t of ag.tests) FS.writeFile(`/ag/tests/${t.name}.py`, t.source);
for (const f of ag.files) { mkdirp('/ag/files/' + f.path.split('/').slice(0, -1).join('/')); FS.writeFile('/ag/files/' + f.path, f.data); }

py.runPython(readFileSync(new URL('../src/runner.py', import.meta.url), 'utf8'));
log('prepare_batch', py.runPython(`prepare_batch(${JSON.stringify(JSON.stringify(ag.config))})`));

const results = [];
for (const nbPath of notebooks) {
  py.globals.set('__nb_json', readFileSync(nbPath, 'utf8'));
  py.globals.set('__nb_name', basename(nbPath));
  const t1 = Date.now();
  const res = JSON.parse(await py.runPythonAsync('await grade_one(__nb_name, __nb_json)'));
  res.path = nbPath;
  results.push(res);
  log(`graded ${res.file} in ${((Date.now() - t1) / 1000).toFixed(1)}s -> ${res.total}/${res.possible} (${res.percent}) ${res.status}`);
  console.log('  log:', res.log.slice(0, 6));
}
console.log(buildCsv(results));
