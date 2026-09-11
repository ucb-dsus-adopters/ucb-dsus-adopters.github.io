// Build a grades CSV with the same shape and values as otter-grader's final_grades.csv
// (see otter/grade/utils.py: merge_scores_to_df).

export const POINTS_POSSIBLE_LABEL = 'points-per-question';
const FIXED_TAIL = ['total_points_earned', 'percent_correct', 'grading_status', 'path'];

function csvCell(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

/** Format numbers the way pandas writes them (integers without ".0", floats as-is). */
export function fmtNum(v) {
  if (typeof v !== 'number' || Number.isNaN(v)) return v;
  return Number.isInteger(v) ? String(v) : String(Number(v.toFixed(10)));
}

/** Python-style string ordering (code point order), used for the `file` column sort. */
export function pyCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * @param {Array<{file:string, path?:string, questions:Object<string,{score:number,possible:number}>,
 *                total:number, possible:number, percent:number, status:string}>} results
 * @returns {string} CSV text
 */
export function buildCsv(results) {
  const completed = results.filter((r) => r.status === 'Completed');
  // Question columns: union across completed notebooks, sorted (otter sorts question names).
  const qset = new Set();
  for (const r of completed) for (const q of Object.keys(r.questions || {})) qset.add(q);
  const questions = [...qset].sort(pyCompare);
  const header = ['file', ...questions, ...FIXED_TAIL];
  const rows = [];

  if (completed.length) {
    // points-per-question row from the first completed notebook (otter uses the first non-failed one)
    const first = completed[0];
    const pts = questions.map((q) => (first.questions[q] ? first.questions[q].possible : ''));
    const sum = pts.reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
    rows.push([POINTS_POSSIBLE_LABEL, ...pts.map(fmtNum), fmtNum(sum), '1', '--', '']);
  }

  const sorted = [...results].sort((a, b) => pyCompare(a.file, b.file));
  for (const r of sorted) {
    const failed = r.status !== 'Completed';
    const qcols = questions.map((q) => {
      if (failed) return '0';
      const e = r.questions[q];
      return e ? fmtNum(e.score) : '';
    });
    rows.push([
      r.file,
      ...qcols,
      fmtNum(failed ? 0 : r.total),
      fmtNum(failed ? 0 : r.percent),
      r.status,
      r.path || '',
    ]);
  }
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n') + '\n';
}
