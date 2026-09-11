// UI controller for the in-browser Otter grader.
import { unzipBlob, buildZip, downloadBlob } from './zip.js';
import { parseAutograder, estimatePoints } from './autograder.js';
import { resolveOtterVersion, DEFAULT_OTTER_VERSION } from './versions.js';
import { isSubmissionEntry, deriveBatchName, dedupeSubmissions, sortSubmissions, stamp } from './batches.js';
import { buildCsv } from './csv.js';
import { buildLog } from './log.js';

const $ = (id) => document.getElementById(id);
const batchesEl = $('batches');
const addBatchBtn = $('addBatch');
const gradeAllBtn = $('gradeAll');
const cancelBtn = $('cancel');
const resetBtn = $('reset');
const statusEl = $('status');
const progressEl = $('progress');
const statusText = $('statusText');
const resultsEl = $('results');
const downloadAllBtn = $('downloadAll');
const overlay = $('loading-overlay');
const overlayText = overlay ? overlay.querySelector('p') : null;
const otterVersionInput = $('otterVersion');
const timeoutInput = $('timeoutSecs');
const extraPackagesInput = $('extraPackages');

const RESTART_EVERY = 40; // notebooks per Pyodide instance before a proactive restart
const TEXT = new TextDecoder('utf-8');

const state = { batches: [], running: false, cancelled: false, nextId: 1 };

// ---------- small DOM helpers ----------
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'hidden') node.hidden = !!v;
    else if (k === 'disabled') node.disabled = !!v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) if (c != null) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  return node;
}

function setOverlay(text) {
  if (!overlay) return;
  overlay.hidden = !text;
  if (overlayText) overlayText.textContent = text || '';
}

function setStatus(text, { done = null, total = null } = {}) {
  statusEl.hidden = false;
  statusText.textContent = text;
  if (total != null) {
    progressEl.max = Math.max(total, 1);
    progressEl.value = done || 0;
  }
}

// ---------- batch cards ----------
function newBatch() {
  return { id: state.nextId++, agFile: null, ag: null, agError: null, subs: [], subsError: null, results: [], warnings: [], notes: [] };
}

function batchMetaText(b) {
  if (b.agError) return `Problem with autograder zip: ${b.agError}`;
  if (!b.ag) return 'No autograder zip selected yet.';
  const { version } = resolveOtterVersion({ pin: b.ag.otterPin, override: otterVersionInput?.value });
  const pts = b.ag.config.points_possible ?? estimatePoints(b.ag.tests);
  const name = b.ag.config.assignment_name ? ` "${b.ag.config.assignment_name}"` : '';
  return `Assignment${name}: ${b.ag.tests.length} test file${b.ag.tests.length === 1 ? '' : 's'}, ${pts} points, otter-grader ${version}.`;
}

function subsMetaText(b) {
  if (b.subsError) return `Problem with notebooks: ${b.subsError}`;
  if (!b.subs.length) return 'No notebooks selected yet.';
  return `${b.subs.length} notebook${b.subs.length === 1 ? '' : 's'} ready to grade.`;
}

function renderBatches() {
  batchesEl.replaceChildren();
  state.batches.forEach((b, i) => {
    const agId = `ag-${b.id}`;
    const nbId = `nb-${b.id}`;
    const card = el('fieldset', { class: 'grader-batch', 'data-batch': String(b.id) }, [
      el('legend', { text: `Batch ${i + 1}` }),
      el('div', { class: 'grader-row' }, [
        el('div', { class: 'grader-col' }, [
          el('label', { for: agId }, ['Autograder zip', el('input', { id: agId, type: 'file', accept: '.zip', disabled: state.running, onchange: (e) => onAutograderChosen(b, e.target.files[0]) })]),
          el('p', { class: 'grader-meta' + (b.agError ? ' grader-meta-error' : ''), id: `${agId}-meta`, text: batchMetaText(b) }),
        ]),
        el('div', { class: 'grader-col' }, [
          el('label', { for: nbId }, ['Notebooks (.ipynb files or a .zip)', el('input', { id: nbId, type: 'file', multiple: '', accept: '.ipynb,.zip', disabled: state.running, onchange: (e) => onNotebooksChosen(b, e.target.files) })]),
          el('p', { class: 'grader-meta' + (b.subsError ? ' grader-meta-error' : ''), id: `${nbId}-meta`, text: subsMetaText(b) }),
        ]),
      ]),
      state.batches.length > 1
        ? el('button', { type: 'button', class: 'btn-secondary btn-small', disabled: state.running, onclick: () => removeBatch(b) }, [`Remove batch ${i + 1}`])
        : null,
    ]);
    batchesEl.appendChild(card);
  });
  updateButtons();
}

function refreshMeta(b) {
  const agMeta = $(`ag-${b.id}-meta`);
  const nbMeta = $(`nb-${b.id}-meta`);
  if (agMeta) {
    agMeta.textContent = batchMetaText(b);
    agMeta.classList.toggle('grader-meta-error', !!b.agError);
  }
  if (nbMeta) {
    nbMeta.textContent = subsMetaText(b);
    nbMeta.classList.toggle('grader-meta-error', !!b.subsError);
  }
  updateButtons();
}

function updateButtons() {
  const ready = state.batches.length > 0 && state.batches.every((b) => b.ag && b.subs.length > 0);
  gradeAllBtn.disabled = state.running || !ready;
  addBatchBtn.disabled = state.running;
  cancelBtn.hidden = !state.running;
  const hasResults = state.batches.some((b) => b.results.length);
  resetBtn.hidden = state.running || !(hasResults || state.batches.some((b) => b.ag || b.subs.length));
  downloadAllBtn.hidden = !hasResults;
  downloadAllBtn.disabled = state.running || !hasResults;
}

function addBatch() {
  state.batches.push(newBatch());
  renderBatches();
}

function removeBatch(b) {
  state.batches = state.batches.filter((x) => x !== b);
  renderBatches();
}

async function onAutograderChosen(b, file) {
  b.agFile = file || null;
  b.ag = null;
  b.agError = null;
  if (!file) return refreshMeta(b);
  const meta = $(`ag-${b.id}-meta`);
  if (meta) meta.textContent = 'Reading autograder zip...';
  try {
    const entries = await unzipBlob(file, {
      filter: (name) => !name.startsWith('__MACOSX/') && !/(^|\/)(setup\.sh|run_autograder|run_otter\.py)$/.test(name),
    });
    b.ag = parseAutograder(entries);
  } catch (e) {
    b.agError = e.message || String(e);
  }
  refreshMeta(b);
}

async function onNotebooksChosen(b, fileList) {
  b.subs = [];
  b.subsError = null;
  const files = [...(fileList || [])];
  if (!files.length) return refreshMeta(b);
  const meta = $(`nb-${b.id}-meta`);
  if (meta) meta.textContent = 'Reading notebooks...';
  try {
    const subs = [];
    for (const f of files) {
      if (/\.zip$/i.test(f.name)) {
        const entries = await unzipBlob(f, { filter: (name) => isSubmissionEntry(name) });
        for (const [path, data] of entries) {
          if (!isSubmissionEntry(path)) continue;
          subs.push({ path, text: TEXT.decode(data) });
        }
      } else if (/\.ipynb$/i.test(f.name)) {
        subs.push({ path: f.name, text: await f.text() });
      }
    }
    for (const s of subs) {
      try {
        JSON.parse(s.text);
      } catch {
        s.invalid = true;
      }
    }
    if (!subs.length) throw new Error('no .ipynb files found in the selection');
    b.subs = sortSubmissions(dedupeSubmissions(subs));
  } catch (e) {
    b.subsError = e.message || String(e);
  }
  refreshMeta(b);
}

// ---------- worker wrapper ----------
class TimeoutError extends Error {}
class CancelledError extends Error {}

class GraderWorker {
  constructor(handlers) {
    this.worker = new Worker(new URL('./grader.worker.js', import.meta.url), { type: 'module' });
    this.handlers = handlers;
    this.pending = new Map();
    this.nextId = 1;
    this.worker.onmessage = (ev) => this.onMessage(ev.data);
    this.worker.onerror = (ev) => {
      const err = new Error(ev.message || 'worker crashed');
      for (const p of this.pending.values()) p.reject(err);
      this.pending.clear();
    };
  }

  onMessage(msg) {
    const h = this.handlers;
    if (msg.type === 'done') {
      const p = this.pending.get(msg.id);
      if (p) {
        this.pending.delete(msg.id);
        p.resolve(p.value);
      }
    } else if (msg.type === 'error') {
      const p = this.pending.get(msg.id);
      if (p) {
        this.pending.delete(msg.id);
        p.reject(new Error(msg.message));
      }
    } else if (msg.type === 'result' || msg.type === 'prepared' || msg.type === 'frozen' || msg.type === 'ready') {
      for (const p of this.pending.values()) p.value = msg;
      h[msg.type]?.(msg);
    } else {
      h[msg.type]?.(msg);
    }
  }

  call(type, payload = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, value: null });
      this.worker.postMessage({ type, id, ...payload });
    });
  }

  terminate() {
    this.worker.terminate();
    const err = new CancelledError('cancelled');
    for (const p of this.pending.values()) p.reject(err);
    this.pending.clear();
  }
}

// ---------- grading run ----------
let activeWorker = null;

async function spawnWorker(b, plan) {
  const w = new GraderWorker({
    phase: (m) => setOverlay(`${b.name}: ${m.text}...`),
    warning: (m) => b.warnings.push(m.text),
    note: (m) => b.notes.push(m.text),
    started: (m) => plan.onStarted?.(m),
  });
  activeWorker = w;
  const ready = await w.call('init', { lockFile: b.lockFile || null });
  b.pyodideVersion = ready?.pyodideVersion;
  const prepared = await w.call('prepareBatch', {
    otterVersion: plan.version,
    requirements: b.ag.requirements,
    extraPackages: plan.extraPackages,
    tests: b.ag.tests,
    files: b.ag.files,
    config: b.ag.config,
  });
  b.otterVersion = prepared?.otterVersion || plan.version;
  b.installed = prepared?.installed || b.installed || {};
  for (const n of prepared?.notes || []) if (!b.notes.includes(n)) b.notes.push(n);
  if (!b.lockFile) {
    try {
      const frozen = await w.call('freeze');
      b.lockFile = frozen?.lockFile || null;
    } catch {
      /* optional */
    }
  }
  setOverlay(null);
  return w;
}

function failedResult(sub, status) {
  return { file: sub.file, path: sub.path, questions: {}, total: 0, possible: 0, percent: 0, status, log: [] };
}

async function gradeBatch(b, counters) {
  const { version, reason } = resolveOtterVersion({ pin: b.ag.otterPin, override: otterVersionInput?.value });
  const extraPackages = (extraPackagesInput?.value || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  const timeoutMs = Math.max(10, parseInt(timeoutInput?.value, 10) || 120) * 1000;
  b.notes.push(reason);
  for (const w of b.ag.warnings) b.warnings.push(w);
  const plan = { version, extraPackages, onStarted: null };

  let worker;
  try {
    worker = await spawnWorker(b, plan);
  } catch (e) {
    if (e instanceof CancelledError) throw e;
    setOverlay(null);
    b.results = b.subs.map((s) => failedResult(s, `Batch setup failed: ${e.message}`));
    b.warnings.push(`batch setup failed: ${e.message}`);
    counters.done += b.subs.length;
    return;
  }

  let sinceRestart = 0;
  for (const sub of b.subs) {
    if (state.cancelled) throw new CancelledError('cancelled');
    if (sinceRestart >= RESTART_EVERY) {
      worker.terminate();
      worker = await spawnWorker(b, plan);
      sinceRestart = 0;
    }
    setStatus(`${b.label}: grading ${counters.batchDone + 1} of ${b.subs.length} (${sub.file})`, counters);
    if (sub.invalid) {
      b.results.push(failedResult(sub, 'Notebook is not valid JSON'));
    } else {
      let timer = null;
      const timeout = new Promise((_, reject) => {
        plan.onStarted = () => {
          timer = setTimeout(() => reject(new TimeoutError(`Timed out after ${timeoutMs / 1000}s`)), timeoutMs);
        };
      });
      try {
        const msg = await Promise.race([worker.call('gradeNotebook', { file: sub.file, path: sub.path, text: sub.text }), timeout]);
        b.results.push(msg.result);
      } catch (e) {
        if (e instanceof CancelledError || state.cancelled) throw new CancelledError('cancelled');
        if (e instanceof TimeoutError) {
          worker.terminate();
          b.results.push(failedResult(sub, e.message));
          b.warnings.push(`${sub.file}: ${e.message}; the Python runtime was restarted`);
          worker = await spawnWorker(b, plan);
          sinceRestart = 0;
        } else {
          b.results.push(failedResult(sub, `Grading error: ${e.message}`));
        }
      } finally {
        clearTimeout(timer);
        plan.onStarted = null;
      }
    }
    sinceRestart++;
    counters.done++;
    counters.batchDone++;
    setStatus(`${b.label}: graded ${counters.batchDone} of ${b.subs.length}`, counters);
    renderResults();
  }
  worker.terminate();
  activeWorker = null;
}

async function gradeAll() {
  if (state.running) return;
  state.running = true;
  state.cancelled = false;
  const taken = new Set();
  state.batches.forEach((b, i) => {
    b.name = deriveBatchName(b.ag.config, b.agFile?.name, i, taken);
    taken.add(b.name);
    b.label = state.batches.length > 1 ? `Batch ${i + 1} of ${state.batches.length} (${b.name})` : b.name;
    b.results = [];
    b.warnings = [];
    b.notes = [];
    b.lockFile = null;
  });
  setInputsDisabled(true);
  resultsEl.replaceChildren();
  const counters = { done: 0, total: state.batches.reduce((n, b) => n + b.subs.length, 0), batchDone: 0 };
  setStatus('Starting...', counters);
  window.addEventListener('beforeunload', beforeUnload);
  try {
    for (const b of state.batches) {
      counters.batchDone = 0;
      await gradeBatch(b, counters);
    }
    setStatus(`Done. Graded ${counters.done} notebook${counters.done === 1 ? '' : 's'} in ${state.batches.length} batch${state.batches.length === 1 ? '' : 'es'}.`, counters);
  } catch (e) {
    if (e instanceof CancelledError) {
      for (const b of state.batches) {
        for (const s of b.subs.slice(b.results.length)) b.results.push(failedResult(s, 'Cancelled'));
      }
      setStatus('Cancelled.', counters);
    } else {
      console.error(e);
      setStatus(`Error: ${e.message}`, counters);
    }
  } finally {
    window.removeEventListener('beforeunload', beforeUnload);
    setOverlay(null);
    if (activeWorker) {
      activeWorker.terminate();
      activeWorker = null;
    }
    state.running = false;
    setInputsDisabled(false);
    renderResults();
  }
}

function setInputsDisabled(disabled) {
  for (const input of batchesEl.querySelectorAll('input, button')) input.disabled = disabled;
  updateButtons();
}

function beforeUnload(e) {
  e.preventDefault();
  e.returnValue = '';
}

function cancelRun() {
  if (!state.running) return;
  state.cancelled = true;
  if (activeWorker) activeWorker.terminate();
}

// ---------- results ----------
function pct(p) {
  return `${Math.round((p || 0) * 1000) / 10}%`;
}

function batchCsv(b) {
  return buildCsv(b.results);
}

function batchLog(b) {
  return buildLog({ name: b.name, otterVersion: b.otterVersion, pyodideVersion: b.pyodideVersion, notes: b.notes, warnings: b.warnings, installed: b.installed, requirements: b.ag?.requirements, results: b.results });
}

function renderResults() {
  resultsEl.replaceChildren();
  for (const b of state.batches) {
    if (!b.results.length) continue;
    const completed = b.results.filter((r) => r.status === 'Completed');
    const mean = completed.length ? completed.reduce((s, r) => s + (r.percent || 0), 0) / completed.length : 0;
    const summary = `${b.results.length} of ${b.subs.length} graded, ${b.results.length - completed.length} failed, mean ${pct(mean)}`;
    const rows = b.results.map((r) => {
      const failed = r.status !== 'Completed';
      const notes = (r.log || []).length ? el('details', {}, [el('summary', { text: `${r.log.length} note${r.log.length === 1 ? '' : 's'}` }), el('pre', { text: r.log.join('\n') })]) : null;
      return el('tr', { class: failed ? 'grader-row-failed' : '' }, [
        el('td', { text: r.file }),
        el('td', { text: failed ? '' : `${r.total} / ${r.possible}` }),
        el('td', { text: failed ? '' : pct(r.percent) }),
        el('td', {}, [r.status, notes]),
      ]);
    });
    const done = b.results.length === b.subs.length;
    const section = el('section', { class: 'grader-result' }, [
      el('h3', {}, [b.name, ' ', el('span', { class: 'grader-summary', text: summary })]),
      b.warnings.length ? el('details', { class: 'grader-warnings' }, [el('summary', { text: `${b.warnings.length} warning${b.warnings.length === 1 ? '' : 's'}` }), el('ul', {}, b.warnings.map((w) => el('li', { text: w })))]) : null,
      el('div', { class: 'grader-table-wrap' }, [
        el('table', {}, [
          el('thead', {}, [el('tr', {}, [el('th', { text: 'Notebook' }), el('th', { text: 'Score' }), el('th', { text: 'Percent' }), el('th', { text: 'Status' })])]),
          el('tbody', {}, rows),
        ]),
      ]),
      el('div', { class: 'grader-actions' }, [
        el('button', { type: 'button', disabled: !done, onclick: () => downloadBlob(new Blob([batchCsv(b)], { type: 'text/csv' }), `${b.name}-grades.csv`) }, [`Download ${b.name}-grades.csv`]),
        el('button', { type: 'button', class: 'btn-secondary', disabled: !done, onclick: () => downloadBlob(new Blob([batchLog(b)], { type: 'text/plain' }), `${b.name}-grading.log`) }, [`Download ${b.name}-grading.log`]),
      ]),
    ]);
    resultsEl.appendChild(section);
  }
  updateButtons();
}

function downloadAll() {
  const entries = {};
  const manifest = { generated: new Date().toISOString(), batches: [] };
  for (const b of state.batches) {
    if (!b.results.length) continue;
    entries[`${b.name}-grades.csv`] = batchCsv(b);
    entries[`${b.name}-grading.log`] = batchLog(b);
    manifest.batches.push({ name: b.name, autograder: b.agFile?.name, notebooks: b.subs.length, otterVersion: b.otterVersion, pyodideVersion: b.pyodideVersion, requirements: b.ag?.requirements || [], installed: b.installed || {} });
    if (b.lockFile) entries[`${b.name}-packages.lock.json`] = b.lockFile;
  }
  entries['manifest.json'] = JSON.stringify(manifest, null, 2);
  downloadBlob(buildZip(entries), `otter-grades-${stamp()}.zip`);
}

function resetAll() {
  if (state.running) return;
  state.batches = [newBatch()];
  resultsEl.replaceChildren();
  statusEl.hidden = true;
  progressEl.value = 0;
  renderBatches();
}

// ---------- wiring ----------
addBatchBtn.addEventListener('click', addBatch);
gradeAllBtn.addEventListener('click', gradeAll);
cancelBtn.addEventListener('click', cancelRun);
resetBtn.addEventListener('click', resetAll);
downloadAllBtn.addEventListener('click', downloadAll);
otterVersionInput?.addEventListener('input', () => state.batches.forEach(refreshMeta));
if (otterVersionInput) otterVersionInput.placeholder = `(from autograder zip, else ${DEFAULT_OTTER_VERSION})`;

state.batches = [newBatch()];
renderBatches();
