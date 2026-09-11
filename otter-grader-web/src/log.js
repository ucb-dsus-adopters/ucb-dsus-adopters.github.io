// Plain-text grading log for a batch.

export function buildLog({ name, otterVersion, pyodideVersion, notes = [], warnings = [], installed = {}, requirements = [], results = [] }) {
  const lines = [];
  lines.push(`Otter grader (in-browser) log for batch "${name}"`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  if (otterVersion) lines.push(`otter-grader: ${otterVersion}`);
  if (pyodideVersion) lines.push(`Pyodide: ${pyodideVersion}`);
  for (const n of notes) lines.push(`Note: ${n}`);
  if (warnings.length) {
    lines.push('', 'Warnings:');
    for (const w of warnings) lines.push(`  - ${w}`);
  }
  if (requirements.length) {
    lines.push('', 'Autograder requirements:');
    for (const r of requirements) lines.push(`  - ${r}`);
  }
  const names = Object.keys(installed).sort();
  if (names.length) {
    lines.push('', 'Installed in the browser runtime:');
    for (const n of names) lines.push(`  - ${n}==${installed[n]}`);
  }
  const done = results.filter((r) => r.status === 'Completed').length;
  lines.push('', `Notebooks: ${results.length} (${done} completed, ${results.length - done} failed)`);
  for (const r of results) {
    lines.push('', `== ${r.file}${r.path && r.path !== r.file ? ` (${r.path})` : ''}`);
    lines.push(`   status: ${r.status}`);
    if (r.status === 'Completed') lines.push(`   score: ${r.total} / ${r.possible} (${r.percent})`);
    if (r.log && r.log.length) {
      lines.push('   execution notes:');
      for (const l of r.log) for (const sub of String(l).split('\n')) lines.push(`     ${sub}`);
    }
    if (r.output && r.output.trim()) {
      lines.push('   captured output (truncated):');
      for (const sub of r.output.trim().split('\n').slice(0, 60)) lines.push(`     ${sub}`);
    }
  }
  return lines.join('\n') + '\n';
}
