# otter-grader-web

Browser-only Otter grader for the adoption site. Instructors upload an `autograder.zip`
plus notebooks (loose `.ipynb` files or a zip), optionally add more batches, click
**Grade all batches**, and download one grades CSV (plus a log) per batch. Nothing is sent
to a server.

## How it works

- `src/main.js` is the UI controller (batch cards, progress, results tables, downloads).
- `src/grader.worker.js` is a module Web Worker that loads
  [Pyodide](https://pyodide.org) from jsDelivr, installs `otter-grader` (the version pinned
  in the autograder zip, minimum 6.0, default 6.1.6) and the zip's requirements with
  micropip, then grades notebooks one at a time. One worker per batch.
- `src/runner.py` runs inside Pyodide. It executes each notebook's code cells with an
  IPython `InteractiveShell` (WebAssembly cannot spawn the kernel subprocess `otter run`
  needs) and reuses otter's own classes for everything else: `Notebook.init_grading_mode`,
  `Checker.check_if_not_already_checked` for tests the notebook never called, and
  `GradingResults` for scores. Errors in cells are logged and execution continues, like
  `otter grade`.
- `src/csv.js` writes the CSV in the layout of otter's `final_grades.csv`
  (`points-per-question` row, one column per question, `total_points_earned`,
  `percent_correct`, `grading_status`, plus a `path` column for the zip entry).
- `src/zip.js`, `src/autograder.js`, `src/batches.js`, `src/versions.js`, `src/log.js`
  are pure helpers covered by `npm test`.

Timeouts: the main thread terminates the worker when a notebook exceeds the per-notebook
limit, records a "Timed out" row, restarts the runtime (fast, thanks to a micropip lockfile
captured after the first install), and continues.

## Development

```bash
npm ci
npm run dev     # standalone page at http://localhost:5173
npm test        # node --test for the pure modules
npm run build   # dist/grader.js + dist/grader.worker.js (copied into the site by main.py)
```

`spike/spike.mjs` grades notebooks under Pyodide in Node for quick regression checks:

```bash
npm i --no-save pyodide@0.28.3
node spike/spike.mjs 6.1.6 path/to/autograder.zip path/to/*.ipynb
```

Parity was checked against local `otter run` (same otter version) on a small generated
assignment: identical per-question scores for correct, blank, wrong, erroring, and
syntax-error submissions, including a seeded hidden test.

## Limits

Python assignments only (no R, no PDF export, no plugins). Packages must have WebAssembly
builds or be pure Python; failures show as warnings. Interrupting a hung notebook requires
a worker restart because GitHub Pages cannot set the headers SharedArrayBuffer needs.
