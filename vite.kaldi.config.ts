import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
/* Bruggsmiðjan Kaldi, standalone: builds one page for SindriMar02/kaldi-frumgerd (GitHub Pages). */
export default defineConfig({
  root: fileURLToPath(new URL('./kaldi', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public/kaldi-pub', import.meta.url)),
  plugins: [react()],
  base: './',
  server: { host: '0.0.0.0', port: 5297, strictPort: true },
  build: { outDir: '../dist-kaldi', emptyOutDir: true },
})
