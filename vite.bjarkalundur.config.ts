/**
 * Standalone build for Hótel Bjarkalundur (hotelbjarkalundur.is).
 *
 *   npm run build:bjarkalundur   →  dist-bjarkalundur/
 *
 * Own entry (bjarkalundur.html → src/bjarkalundur-main.tsx) that imports only
 * the hotel's own pages, so the catalogue cannot be in the output. base is '/'
 * because the site lives at its domain root (Cloudflare Pages).
 *
 * VITE_BJARKALUNDUR_STANDALONE makes paths.ts's STANDALONE a compile-time
 * constant, so Rollup drops the preview chrome and the private company brief.
 * VITE_BJARKALUNDUR_SITE_URL is the live origin the canonical, hreflang,
 * og:url and structured data point at. It DEFAULTS to the live domain here, so
 * a plain rebuild can never ship a noindex or relative canonicals to the live
 * site ([[prerender-client-builds]], the 2026-09-19 glacierview.is incident).
 */
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

export const BJARKALUNDUR_SITE = process.env.BJARKALUNDUR_SITE_URL || 'https://www.hotelbjarkalundur.is'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'import.meta.env.VITE_BJARKALUNDUR_STANDALONE': JSON.stringify('1'),
    'import.meta.env.VITE_BJARKALUNDUR_SITE_URL': JSON.stringify(BJARKALUNDUR_SITE),
  },
  build: {
    outDir: 'dist-bjarkalundur',
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./bjarkalundur.html', import.meta.url)),
    },
  },
})
