import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareVersions, extractOtterPin, resolveOtterVersion, DEFAULT_OTTER_VERSION } from '../src/versions.js';
import { parseAutograder, parseEnvironmentYml, parseRequirementsTxt, findRoot, estimatePoints } from '../src/autograder.js';
import { buildCsv, fmtNum } from '../src/csv.js';
import { isSubmissionEntry, deriveBatchName, dedupeSubmissions, sortSubmissions } from '../src/batches.js';
import { buildLog } from '../src/log.js';

const enc = (s) => new TextEncoder().encode(s);

test('version comparison and pins', () => {
  assert.equal(compareVersions('6.1.6', '6.0.0'), 1);
  assert.equal(compareVersions('6.1.6', '6.1.6'), 0);
  assert.equal(compareVersions('4.1.0', '6.0.0'), -1);
  assert.equal(extractOtterPin('otter-grader==4.1.0'), '4.1.0');
  assert.equal(extractOtterPin('otter-grader[grading,plugins]==6.1.6'), '6.1.6');
  assert.equal(extractOtterPin('numpy'), null);
  assert.equal(resolveOtterVersion({ pin: '4.1.0' }).version, DEFAULT_OTTER_VERSION);
  assert.equal(resolveOtterVersion({ pin: '7.0.0' }).version, '7.0.0');
  assert.equal(resolveOtterVersion({ pin: '7.0.0', override: '6.1.6' }).version, '6.1.6');
  assert.equal(resolveOtterVersion({}).version, DEFAULT_OTTER_VERSION);
});

test('environment.yml pip section and requirements.txt', () => {
  const yml = `name: otter-env
channels:
  - defaults
dependencies:
  - python=3.12
  - pip
  - pip:
      - otter-grader[grading,plugins]==6.1.6
      - numpy
  - jupyter_server
`;
  assert.deepEqual(parseEnvironmentYml(yml), ['otter-grader[grading,plugins]==6.1.6', 'numpy']);
  assert.deepEqual(parseRequirementsTxt('numpy # c\n\n-r base.txt\npandas>=2\n'), ['numpy', 'pandas>=2']);
});

test('parseAutograder handles root folder, tests, files, pin, lang', () => {
  const entries = new Map([
    ['ag/otter_config.json', enc('{"points_possible": 10, "seed": 42}')],
    ['ag/tests/q2.py', enc("OK_FORMAT = True\ntest = {'name': 'q2', 'points': 3, 'suites': [{'cases': [{'code': '>>> 1'}]}]}")],
    ['ag/tests/q1.py', enc("OK_FORMAT = True\ntest = {'name': 'q1', 'points': None, 'suites': [{'cases': [{'code': '>>> 1'}, {'code': '>>> 2'}]}]}")],
    ['ag/tests/', enc('')],
    ['ag/files/data/x.csv', enc('a,b')],
    ['ag/requirements.txt', enc('numpy\notter-grader==7.0.0\n')],
    ['__MACOSX/._x', enc('')],
  ]);
  assert.equal(findRoot([...entries.keys()].filter((k) => !k.startsWith('__MACOSX'))), 'ag/');
  const ag = parseAutograder(entries);
  assert.equal(ag.config.seed, 42);
  assert.deepEqual(ag.tests.map((t) => t.name), ['q1', 'q2']);
  assert.deepEqual(ag.files.map((f) => f.path), ['data/x.csv']);
  assert.equal(ag.otterPin, '7.0.0');
  assert.equal(estimatePoints(ag.tests), 5);
  assert.throws(() => parseAutograder(new Map([['otter_config.json', enc('{"lang":"r"}')], ['tests/q1.py', enc('x')]])), /Python/);
  assert.throws(() => parseAutograder(new Map([['otter_config.json', enc('{}')]])), /No tests/);
});

test('csv matches otter final_grades.csv shape', () => {
  const results = [
    { file: 'b.ipynb', path: 'sub/b.ipynb', questions: { q2: { score: 1.5, possible: 3 }, q1: { score: 2, possible: 2 } }, total: 3.5, possible: 5, percent: 0.7, status: 'Completed' },
    { file: 'a.ipynb', path: 'a.ipynb', questions: {}, total: 0, possible: 0, percent: 0, status: 'Timed out after 120s' },
    { file: 'c,d.ipynb', path: 'c,d.ipynb', questions: { q1: { score: 0, possible: 2 }, q2: { score: 3, possible: 3 } }, total: 3, possible: 5, percent: 0.6, status: 'Completed' },
  ];
  const csv = buildCsv(results);
  const lines = csv.trim().split('\n');
  assert.equal(lines[0], 'file,q1,q2,total_points_earned,percent_correct,grading_status,path');
  assert.equal(lines[1], 'points-per-question,2,3,5,1,--,');
  assert.equal(lines[2], 'a.ipynb,0,0,0,0,Timed out after 120s,a.ipynb');
  assert.equal(lines[3], 'b.ipynb,2,1.5,3.5,0.7,Completed,sub/b.ipynb');
  assert.equal(lines[4], '"c,d.ipynb",0,3,3,0.6,Completed,"c,d.ipynb"');
  assert.equal(fmtNum(0.1 + 0.2), '0.3');
  // all failed: no points row, no question columns
  const csv2 = buildCsv([results[1]]);
  assert.equal(csv2.trim().split('\n')[0], 'file,total_points_earned,percent_correct,grading_status,path');
  assert.equal(csv2.trim().split('\n').length, 2);
});

test('submission filtering, naming, dedupe', () => {
  assert.equal(isSubmissionEntry('hw01/alice_hw01.ipynb'), true);
  assert.equal(isSubmissionEntry('__MACOSX/._a.ipynb'), false);
  assert.equal(isSubmissionEntry('x/.ipynb_checkpoints/a-checkpoint.ipynb'), false);
  assert.equal(isSubmissionEntry('a/.hidden.ipynb'), false);
  assert.equal(isSubmissionEntry('notes.txt'), false);
  assert.equal(isSubmissionEntry('dir/'), false);
  const taken = new Set();
  const n1 = deriveBatchName({ assignment_name: 'hw01' }, 'whatever.zip', 0, taken);
  taken.add(n1);
  assert.equal(n1, 'hw01');
  assert.equal(deriveBatchName({}, 'hw01-autograder_2026_09_11T15_04_34_681279.zip', 1, taken), 'hw01-2');
  assert.equal(deriveBatchName({}, 'lab02_autograder.zip', 1, taken), 'lab02');
  assert.equal(deriveBatchName({}, 'autograder.zip', 2, taken), 'batch-3');
  const subs = dedupeSubmissions([{ path: 'a/hw.ipynb' }, { path: 'b/hw.ipynb' }, { path: 'c.ipynb' }]);
  assert.deepEqual(subs.map((s) => s.file), ['hw.ipynb', 'hw-2.ipynb', 'c.ipynb']);
  assert.deepEqual(sortSubmissions(subs).map((s) => s.file), ['c.ipynb', 'hw-2.ipynb', 'hw.ipynb']);
});

test('log builder', () => {
  const log = buildLog({ name: 'hw01', otterVersion: '6.1.6', warnings: ['w1'], results: [{ file: 'a.ipynb', status: 'Completed', total: 1, possible: 2, percent: 0.5, log: ['cell 1: NameError: x'] }] });
  assert.match(log, /batch "hw01"/);
  assert.match(log, /- w1/);
  assert.match(log, /cell 1: NameError/);
});

test('installer policy helpers', async () => {
  const { parseSpec, lockIndex, installEnvironment, SKIP_REQ, canonical } = await import('../src/installer.js');
  assert.deepEqual(parseSpec('otter-grader[grading,plugins]==6.1.6').pin, '6.1.6');
  assert.equal(parseSpec('numpy==2.3.5').name, 'numpy');
  assert.equal(parseSpec('jupyter_client==8.6.3').name, 'jupyter-client');
  assert.equal(parseSpec('pandas>=2').pin, null);
  assert.equal(SKIP_REQ.test(canonical('nbclient')), true);
  assert.equal(SKIP_REQ.test(canonical('jupyter_client')), true);
  assert.equal(SKIP_REQ.test('datascience'), false);
  const lock = lockIndex({ packages: { numpy: { version: '2.2.5', file_name: 'numpy-2.2.5-cp313-cp313-pyodide_2025_0_wasm32.whl' }, traitlets: { version: '5.14.3', file_name: 'traitlets-5.14.3-py3-none-any.whl' } } });
  assert.equal(lock.get('numpy').pure, false);
  assert.equal(lock.get('traitlets').pure, true);

  // Fake micropip: records installs, reports installed versions.
  const calls = [];
  const installed = new Map();
  const fakeMicropip = {
    async install(spec, opts = {}) {
      calls.push([spec, opts]);
      for (const s of [].concat(spec)) {
        const p = parseSpec(s);
        if (p.name === 'nowheel' && p.pin) throw new Error("ValueError: Can't find a pure Python 3 wheel for 'nowheel==9.9.9'");
        installed.set(p.name, { version: p.pin || '1.0.0' });
      }
    },
    list() {
      return { get: (n) => installed.get(n), keys: () => installed.keys() };
    },
  };
  const notes = [], warnings = [];
  const res = await installEnvironment({
    micropip: fakeMicropip, lock, otterVersion: '6.1.6',
    requirements: ['numpy==2.3.5', 'ipykernel==7.1.0', 'ipywidgets==8.1.8', 'nowheel==9.9.9', 'scipy==1.0.0'],
    extraPackages: ['ipywidgets==8.1.7'],
    onNote: (t) => notes.push(t), onWarning: (t) => warnings.push(t),
  });
  assert.ok(notes.some((n) => n.startsWith('numpy: using 2.2.5 bundled')));
  assert.ok(notes.some((n) => n.startsWith('nowheel: no browser build')));
  assert.ok(warnings.length === 0, JSON.stringify(warnings));
  assert.ok(!calls.some(([s]) => String(s).includes('ipykernel')));
  const order = calls.map(([s]) => (Array.isArray(s) ? s.join('+') : s));
  assert.ok(order.indexOf('ipywidgets==8.1.8') < order.indexOf('otter-grader==6.1.6'), order.join(' | '));
  assert.ok(order.indexOf('ipywidgets==8.1.7') > order.indexOf('otter-grader==6.1.6'));
  assert.equal(res.installed['ipywidgets'], '8.1.7');
  assert.equal(res.installed['scipy'], '1.0.0'); // not in this fake lock, so installed as pinned
});
