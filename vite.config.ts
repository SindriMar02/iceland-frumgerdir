import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages serves project sites under /<repo>/ — CI sets BASE_PATH.
  // Local dev and root-domain hosts (Vercel/Netlify) keep '/'.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
})
