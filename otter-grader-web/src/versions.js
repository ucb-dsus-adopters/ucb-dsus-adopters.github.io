// Version helpers for choosing which otter-grader release to install.

export const DEFAULT_OTTER_VERSION = '6.1.6';
export const MIN_OTTER_VERSION = '6.0.0';

/** Compare two dotted version strings numerically. Returns -1, 0, or 1. */
export function compareVersions(a, b) {
  const pa = String(a).split('.').map((x) => parseInt(x, 10) || 0);
  const pb = String(b).split('.').map((x) => parseInt(x, 10) || 0);
  const n = Math.max(pa.length, pb.length);
  for (let i = 0; i < n; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return 0;
}

/** Extract an exact otter-grader pin ("otter-grader[grading]==6.1.6" -> "6.1.6"). */
export function extractOtterPin(spec) {
  const m = /^\s*otter[-_]grader\s*(?:\[[^\]]*\])?\s*==\s*([0-9][0-9A-Za-z.]*)/i.exec(spec || '');
  return m ? m[1] : null;
}

/**
 * Decide which otter version to install.
 * Returns { version, reason } where reason explains the choice for the log.
 */
export function resolveOtterVersion({ pin = null, override = null, fallback = DEFAULT_OTTER_VERSION } = {}) {
  const ov = (override || '').trim();
  if (ov) return { version: ov, reason: `using version override ${ov}` };
  if (pin) {
    if (compareVersions(pin, MIN_OTTER_VERSION) >= 0) {
      return { version: pin, reason: `using otter-grader ${pin} pinned by the autograder zip` };
    }
    return {
      version: fallback,
      reason: `autograder zip pins otter-grader ${pin}, which is older than the minimum ${MIN_OTTER_VERSION}; using ${fallback}`,
    };
  }
  return { version: fallback, reason: `autograder zip does not pin otter-grader; using ${fallback}` };
}
