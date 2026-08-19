import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// Optional single-feature focus mode: `HANDOFF_FEATURE=create-workspace yarn dev`
const focusFeature = process.env.HANDOFF_FEATURE ?? '';

// The handoff runtime is bundler-agnostic EXCEPT the discovery layer, which is
// aliased to the Vite implementation (`import.meta.glob`).
export default defineConfig({
  root: here,
  plugins: [react()],
  define: {
    __HANDOFF_FEATURE__: JSON.stringify(focusFeature),
  },
  resolve: {
    alias: {
      '@handoff/discovery': resolve(here, 'src/discovery/vite.ts'),
      '@handoff': resolve(here, 'src/_lib'),
      '@ds': resolve(here, 'src/ds'),
    },
  },
  server: {
    port: 5180,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
