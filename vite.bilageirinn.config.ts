import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
const routes: Record<string, string> = JSON.parse(readFileSync(new URL('./bilageirinn/routes.json', import.meta.url), 'utf8'))
const input = Object.fromEntries(Object.entries(routes).map(([k, f]) => [k, fileURLToPath(new URL(`./bilageirinn/${f}`, import.meta.url))]))
/* Bílageirinn production site on the True Line design (Sindri 2026-11-11: keep True Line, add pages/form/facts).
   Multi-page: one HTML entry per route under ./bilageirinn. BG_BASE is the deploy base (/bilageirinn-preview/). */
export default defineConfig({
  root: fileURLToPath(new URL('./bilageirinn', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public/bilageirinn-pub', import.meta.url)),
  plugins: [react(), tailwindcss()],
  base: process.env.BG_BASE ?? '/',
  server: { host: '127.0.0.1', port: 5311, strictPort: true },
  build: { outDir: '../dist-bilageirinn', emptyOutDir: true, rollupOptions: { input } },
})
