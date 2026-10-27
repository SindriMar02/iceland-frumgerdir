import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
/* H-Berg isolated prototype. */
export default defineConfig({
  root: fileURLToPath(new URL('./hberg', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public/hberg-pub', import.meta.url)),
  plugins: [react()],
  base: './',
  server: { host: '0.0.0.0', port: 5299, strictPort: true },
  build: { outDir: '../dist-hberg', emptyOutDir: true },
})
