import { defineConfig } from 'vite';
import { resolve } from 'path';

// Library-style build (like canvas-jupyterhub-rewriter) that emits one main ES module plus a
// separate module worker with stable filenames, so main.py can copy dist/ into the site.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      formats: ['es'],
      fileName: () => 'grader.js',
    },
    rollupOptions: {
      external: [/^https:\/\//],
    },
  },
  worker: {
    format: 'es',
    rollupOptions: {
      external: [/^https:\/\//],
      output: {
        entryFileNames: 'grader.worker.js',
        chunkFileNames: 'grader.worker-[name].js',
        assetFileNames: 'grader.worker-[name][extname]',
      },
    },
  },
});
