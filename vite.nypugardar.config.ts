/**
 * Standalone build for Nýpugarðar (glacierview.is): the client-kit pattern.
 *
 *   npm run build:nypugardar   →  dist-nypugardar/
 *
 * The client build has its own entry (nypugardar.html → src/nypugardar-
 * main.tsx), which only imports the client's own pages, so the catalogue
 * cannot be present in the output rather than being present and hopefully
 * stripped. base is '/' because the deployment lives at its own domain root
 * (Cloudflare Pages). The GH Pages preview keeps using the normal build and
 * BASE_PATH; the two builds do not share an output.
 *
 * VITE_NYPUGARDAR_STANDALONE is defined here, at build time, which makes
 * paths.ts's STANDALONE a compile-time constant. That is what lets Rollup
 * drop the preview chrome and the private company brief as dead code.
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
    'import.meta.env.VITE_NYPUGARDAR_STANDALONE': JSON.stringify('1'),
  },
  build: {
    outDir: 'dist-nypugardar',
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./nypugardar.html', import.meta.url)),
    },
  },
})
