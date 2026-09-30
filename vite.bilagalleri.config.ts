import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
export default defineConfig({
  root: fileURLToPath(new URL('./bilagalleri', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public/bilagalleri', import.meta.url)),
  plugins: [react(), { name: 'bilagalleri-build-artifact', generateBundle() { this.emitFile({ type: 'asset', fileName: '.gitignore', source: '*\n' }) } }],
  base: './',
  server: { host: '0.0.0.0', port: 5274, strictPort: true },
  build: { outDir: '../dist-bilagalleri', emptyOutDir: true },
})
