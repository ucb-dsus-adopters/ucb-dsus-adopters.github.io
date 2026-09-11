// Batch bookkeeping: names, submission filtering, duplicate handling.

/** True for zip entries that should be graded. */
export function isSubmissionEntry(path) {
  if (!path || path.endsWith('/')) return false;
  const parts = path.split('/');
  if (parts.some((p) => p === '__MACOSX' || p === '.ipynb_checkpoints' || p.startsWith('.'))) return false;
  return /\.ipynb$/i.test(parts[parts.length - 1]);
}

/** Batch name from the config or the autograder zip filename. */
export function deriveBatchName(config, zipFileName, index, taken = new Set()) {
  let base = (config && config.assignment_name) || '';
  if (!base && zipFileName) {
    base = zipFileName
      .replace(/\.zip$/i, '')
      .replace(/[-_ ]?autograder(?:[-_ ]?\d{4}_\d{2}_\d{2}T[\d_]+)?$/i, '')
      .replace(/^autograder$/i, '');
  }
  base = base.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || `batch-${index + 1}`;
  let name = base;
  let n = 2;
  while (taken.has(name)) name = `${base}-${n++}`;
  return name;
}

/** Assign unique `file` values (basenames) while keeping the original path. */
export function dedupeSubmissions(subs) {
  const seen = new Map();
  return subs.map((s) => {
    const base = s.path.split('/').pop();
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);
    if (count === 1) return { ...s, file: base };
    const dot = base.lastIndexOf('.');
    const file = dot > 0 ? `${base.slice(0, dot)}-${count}${base.slice(dot)}` : `${base}-${count}`;
    return { ...s, file };
  });
}

/** Sort submissions by their final `file` name (Python string order). */
export function sortSubmissions(subs) {
  return [...subs].sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));
}

/** A filesystem-safe timestamp for download names. */
export function stamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}
