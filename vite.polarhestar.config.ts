/**
 * Standalone build for Pólar Hestar (polarhestar.is): the client-kit pattern.
 *
 *   npm run build:polarhestar   →  dist-polarhestar/
 *
 * The client build has its own entry (polarhestar.html → src/polarhestar-
 * main.tsx), which only imports the client's own pages, so the catalogue cannot
 * be present in the output rather than being present and hopefully stripped.
 * base is '/' because the deployment lives at its own domain root (Cloudflare
 * Pages). The GitHub Pages preview keeps using the normal build and BASE_PATH;
 * the two builds do not share an output.
 *
 * Defined at build time:
 *   VITE_POLARHESTAR_STANDALONE  makes paths.ts's STANDALONE a compile-time
 *                                constant, so Rollup drops the preview chrome and
 *                                the private company brief as dead code.
 *   VITE_POLARHESTAR_SITE_URL    the production origin canonicals are built on
 *   VITE_POLARHESTAR_NOINDEX     '1' for a staging copy (robots noindex)
 *   __PH_SNAPSHOT__              the published CMS content frozen by
 *                                tools/polarhestar-standalone-snapshot.mjs, so the
 *                                prerendered HTML and the hydrating bundle are made
 *                                from the same content.
 */
import { defineConfig } from 'vite'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const SNAPSHOT = '.cache/polarhestar-cms.json'
if (!existsSync(SNAPSHOT)) {
  throw new Error(`${SNAPSHOT} is missing; run: node tools/polarhestar-standalone-snapshot.mjs`)
}
const snap = JSON.parse(readFileSync(SNAPSHOT, 'utf8')) as { builtAt: string; raw: unknown }

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'import.meta.env.VITE_POLARHESTAR_STANDALONE': JSON.stringify('1'),
    'import.meta.env.VITE_POLARHESTAR_SITE_URL': JSON.stringify(process.env.POLARHESTAR_SITE_URL || 'https://polarhestar.is'),
    'import.meta.env.VITE_POLARHESTAR_NOINDEX': JSON.stringify(process.env.POLARHESTAR_NOINDEX === '1' ? '1' : '0'),
    __PH_SNAPSHOT__: JSON.stringify({ builtAt: snap.builtAt, raw: snap.raw }),
  },
  build: {
    outDir: 'dist-polarhestar',
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./polarhestar.html', import.meta.url)),
    },
  },
})
