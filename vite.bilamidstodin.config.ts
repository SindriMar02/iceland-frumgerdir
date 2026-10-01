import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
export default defineConfig({
  root: fileURLToPath(new URL('./bilamidstodin', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public/bilamidstodin', import.meta.url)),
  plugins: [react(), { name: 'bilamidstodin-build-artifact', generateBundle() { this.emitFile({ type: 'asset', fileName: '.gitignore', source: '*\n' }) } }],
  base: './',
  server: { host: '0.0.0.0', port: 5275, strictPort: true },
  build: { outDir: '../dist-bilamidstodin', emptyOutDir: true },
})
