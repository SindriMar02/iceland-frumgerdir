/**
 * Standalone build for Katrín Ísfeld — the client-kit pattern.
 *
 *   npm run build:katrin   →  dist-katrin/
 *
 * The client build has its own entry (katrin.html → src/katrin-main.tsx),
 * which imports only her pages, so the catalogue cannot be present in the
 * output rather than being present and hopefully stripped afterwards.
 *
 * base is '/' because the deployment lives at her own domain root. The
 * GitHub Pages preview keeps using the normal build and BASE_PATH; the two
 * builds do not share an output.
 *
 * VITE_KATRIN_STANDALONE is defined here, at build time, which makes
 * STANDALONE in paths.ts a compile-time constant — that is what lets Rollup
 * drop the preview chrome and the private prospect catalogue as dead code.
 * VITE_KATRIN_SITE_URL is the launch-day flip: unset, the build stays
 * noindex with no canonicals, so a deploy to a staging host can never
 * compete with her real site in the index.
 */
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  define: {
    'import.meta.env.VITE_KATRIN_STANDALONE': JSON.stringify('1'),
    'import.meta.env.VITE_KATRIN_SITE_URL': JSON.stringify(process.env.KATRIN_SITE_URL || ''),
  },
  build: {
    outDir: 'dist-katrin',
    emptyOutDir: true,
    rollupOptions: { input: fileURLToPath(new URL('./katrin.html', import.meta.url)) },
  },
})
