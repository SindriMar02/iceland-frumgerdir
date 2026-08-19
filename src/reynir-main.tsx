/**
 * Reynir bakarí — standalone entry point.
 *
 * The client's own deployment mounts ONLY the four Reynir routes, at clean
 * root paths, from its own shell (reynir.html). No catalogue router, no other
 * clients' chunks, no preview chrome — the separation is structural: this
 * entry simply never imports any of it, so none of it can leak into the
 * bundle a customer downloads from reynirbakari.is.
 *
 * HYDRATE, don't render. The build prerenders every route to real HTML
 * (tools/reynir-prerender.mjs), because AI crawlers do not run JavaScript and
 * an empty #root is a blank page to them. So #root already holds the finished
 * markup here; React adopts it instead of throwing it away and rebuilding.
 * The createRoot fallback covers the case where the HTML somehow arrived
 * without prerendered content, so a broken prerender degrades to today's
 * behaviour rather than to a white screen.
 *
 * Built with `npm run build:reynir` (vite.reynir.config.ts) → dist-reynir/.
 */
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { ReynirApp } from './reynir-app'

const el = document.getElementById('root')!

const tree = (
  <StrictMode>
    <BrowserRouter>
      <ReynirApp />
    </BrowserRouter>
  </StrictMode>
)

if (el.childElementCount > 0) hydrateRoot(el, tree)
else createRoot(el).render(tree)
