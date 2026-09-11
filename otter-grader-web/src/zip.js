// Zip helpers built on fflate (same dependency as the Canvas rewriter).
import { unzip, zipSync } from 'fflate';

/**
 * Unzip a File/Blob into a Map of entry path -> bytes.
 * `filter(path)` may return false to skip an entry without inflating it.
 */
export async function unzipBlob(blob, { filter } = {}) {
  const buf = new Uint8Array(await blob.arrayBuffer());
  const files = await new Promise((resolve, reject) => {
    unzip(
      buf,
      { filter: (info) => (filter ? filter(info.name) !== false : true) },
      (err, out) => (err ? reject(err) : resolve(out)),
    );
  });
  return new Map(Object.entries(files));
}

/** Build a zip Blob from { path: Uint8Array|string }. Text is UTF-8 encoded. */
export function buildZip(entries) {
  const data = {};
  const enc = new TextEncoder();
  for (const [path, value] of Object.entries(entries)) {
    data[path] = typeof value === 'string' ? enc.encode(value) : value;
  }
  return new Blob([zipSync(data, { level: 6 })], { type: 'application/zip' });
}

/** Trigger a browser download for a Blob (object-URL + anchor, as in the rewriter). */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
