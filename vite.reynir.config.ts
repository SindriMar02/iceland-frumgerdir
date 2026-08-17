/**
 * Standalone build for Reynir bakarí — the client-kit pattern.
 *
 *   npm run build:reynir   →  dist-reynir/
 *
 * One catalogue, many clients, ONE recurring bug family: a client site going
 * live used to be a copy of the catalogue's shell with the wrong bits patched
 * out afterwards (lang, icons, title, fonts — each was its own incident).
 * This config inverts that: the client build has its own entry (reynir.html →
 * src/reynir-main.tsx), which only imports the client's own pages, so the
 * catalogue cannot be present in the output rather than being present and
 * hopefully stripped.
 *
 * base is '/' because the client deployment lives at its own domain root
 * (Cloudflare Pages / any static host). The GH Pages preview keeps using the
 * normal build and BASE_PATH — the two builds do not share an output.
 *
 * VITE_REYNIR_STANDALONE is defined here, at build time, which makes
 * paths.ts's STANDALONE a compile-time constant — that is what lets Rollup
 * drop the preview chrome and the private catalogue as dead code.
 */
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'import.meta.env.VITE_REYNIR_STANDALONE': JSON.stringify('1'),
  },
  build: {
    outDir: 'dist-reynir',
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./reynir.html', import.meta.url)),
    },
  },
})
