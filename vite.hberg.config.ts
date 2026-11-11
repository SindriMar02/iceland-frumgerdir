import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
/* H-Berg isolated prototype. */
export default defineConfig({
  root: fileURLToPath(new URL('./hberg', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public/hberg-pub', import.meta.url)),
  plugins: [react()],
  define: { __HB_V__: JSON.stringify(Date.now().toString(36)) },
  base: './',
  server: { host: '0.0.0.0', port: 5299, strictPort: true },
  build: { outDir: '../dist-hberg', emptyOutDir: true, rollupOptions: { input: { home: fileURLToPath(new URL('./hberg/index.html', import.meta.url)), products: fileURLToPath(new URL('./hberg/vorur/index.html', import.meta.url)), nutrition: fileURLToPath(new URL('./hberg/naeringargildi/index.html', import.meta.url)) } } },
})
