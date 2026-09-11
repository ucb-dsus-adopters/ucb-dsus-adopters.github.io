// Parse the contents of an otter autograder.zip (already unzipped to a Map of path -> bytes).
import { extractOtterPin } from './versions.js';

const TEXT = new TextDecoder('utf-8');

/** Strip a single common top-level folder if the zip was built around one. */
export function findRoot(paths) {
  if (paths.some((p) => p === 'otter_config.json' || p.startsWith('tests/'))) return '';
  const firsts = new Set(paths.map((p) => p.split('/')[0]));
  if (firsts.size !== 1) return '';
  const [root] = firsts;
  const inner = paths.map((p) => p.slice(root.length + 1));
  if (inner.some((p) => p === 'otter_config.json' || p.startsWith('tests/'))) return root + '/';
  return '';
}

/** Parse pip-style requirement lines from requirements.txt. */
export function parseRequirementsTxt(text) {
  return (text || '')
    .split(/\r?\n/)
    .map((l) => l.replace(/#.*$/, '').trim())
    .filter((l) => l && !l.startsWith('-'));
}

/** Parse the `pip:` list of a conda environment.yml (otter 6 puts requirements there). */
export function parseEnvironmentYml(text) {
  const out = [];
  let inPip = false;
  let pipIndent = -1;
  for (const raw of (text || '').split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').replace(/\s+$/, '');
    if (!line.trim()) continue;
    const indent = line.length - line.trimStart().length;
    const m = /^\s*-\s*pip\s*:\s*$/.exec(line);
    if (m) {
      inPip = true;
      pipIndent = indent;
      continue;
    }
    if (inPip) {
      if (indent <= pipIndent) {
        inPip = false;
      } else {
        const item = /^\s*-\s*(.+)$/.exec(line);
        if (item) {
          const spec = item[1].trim().replace(/^['"]|['"]$/g, '');
          if (spec && !spec.startsWith('-')) out.push(spec);
        }
        continue;
      }
    }
  }
  return out;
}

/**
 * Build the batch description from the unzipped autograder entries.
 * @param {Map<string, Uint8Array>} entries
 * @returns {{config: object, tests: {name: string, source: string}[], files: {path: string, data: Uint8Array}[],
 *            requirements: string[], otterPin: string|null, warnings: string[]}}
 */
export function parseAutograder(entries) {
  const paths = [...entries.keys()].filter((p) => !p.endsWith('/') && !p.startsWith('__MACOSX/'));
  const root = findRoot(paths);
  const get = (p) => entries.get(root + p);
  const warnings = [];

  let config = {};
  const cfgBytes = get('otter_config.json');
  if (cfgBytes) {
    try {
      config = JSON.parse(TEXT.decode(cfgBytes));
    } catch (e) {
      warnings.push(`otter_config.json could not be parsed (${e.message}); using defaults`);
    }
  } else {
    warnings.push('otter_config.json not found in the autograder zip; using defaults');
  }
  const lang = (config.lang || 'python').toLowerCase();
  if (lang !== 'python') {
    throw new Error(`This autograder is for "${config.lang}" assignments; only Python assignments can be graded in the browser`);
  }

  const tests = [];
  const files = [];
  for (const p of paths) {
    if (!p.startsWith(root)) continue;
    const rel = p.slice(root.length);
    if (rel.startsWith('tests/') && rel.endsWith('.py') && rel.split('/').length === 2) {
      tests.push({ name: rel.slice('tests/'.length, -3), source: TEXT.decode(entries.get(p)) });
    } else if (rel.startsWith('files/') && rel.length > 'files/'.length) {
      files.push({ path: rel.slice('files/'.length), data: entries.get(p) });
    }
  }
  tests.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  if (tests.length === 0) throw new Error('No tests/*.py files found in the autograder zip');

  const requirements = [];
  const reqTxt = get('requirements.txt');
  if (reqTxt) requirements.push(...parseRequirementsTxt(TEXT.decode(reqTxt)));
  const envYml = get('environment.yml');
  if (envYml) {
    for (const r of parseEnvironmentYml(TEXT.decode(envYml))) if (!requirements.includes(r)) requirements.push(r);
  }
  let otterPin = null;
  for (const r of requirements) {
    const pin = extractOtterPin(r);
    if (pin) otterPin = pin;
  }

  return { config, tests, files, requirements, otterPin, warnings };
}

/** Read the point total declared by the tests (sum of `points`, or number of cases when unset). */
export function estimatePoints(tests) {
  let total = 0;
  for (const t of tests) {
    const m = /['"]points['"]\s*:\s*([0-9.]+|None|null)/.exec(t.source);
    if (m && m[1] !== 'None' && m[1] !== 'null') {
      total += parseFloat(m[1]);
    } else {
      const cases = (t.source.match(/['"]code['"]\s*:/g) || []).length;
      total += cases || 1;
    }
  }
  return total;
}
