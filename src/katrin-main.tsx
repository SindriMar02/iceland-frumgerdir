/**
 * Katrín Ísfeld — standalone entry point.
 *
 * Her own deployment mounts ONLY her routes, at clean root paths, from her
 * own shell (katrin.html). No catalogue router, no other clients' chunks, no
 * preview chrome: this entry simply never imports any of it, so none of it
 * can reach the bundle a visitor downloads from katrinisfeld.is.
 *
 * hydrateRoot, not createRoot. Every route ships prerendered, so #root
 * already holds the finished page when this runs; hydrating adopts that DOM
 * instead of throwing it away and rebuilding it, which is the difference
 * between the page being interactive and the page being repainted.
 *
 *   npm run build:katrin   →  dist-katrin/
 */
import { StrictMode, useEffect } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import Site from './preview/katrinisfeld/Page'

/* NOT './index.css'. That file is the catalogue's: it pulls in Tailwind and
   declares @font-face for about forty families across a hundred prototypes,
   and it compiled to 341 KB of render-blocking CSS on a site that uses no
   Tailwind class and three fonts. Everything this design needs is in the
   scoped stylesheet the pages render inline, and the handful of document-level
   rules live in katrin.html. Removing it took first paint on a throttled
   phone from 4.3s to the figure in KATRIN-SEO.md. */

/** Same guarded scroll reset as the catalogue's App.tsx. The hash guard
 *  matters: an arbitrary #hash that is not a valid selector makes
 *  querySelector THROW, which once white-screened a whole preview. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      try { document.querySelector(hash)?.scrollIntoView() } catch { /* not a selector */ }
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Site />
    </BrowserRouter>
  </StrictMode>
)

const root = document.getElementById('root')!
if (root.firstChild) hydrateRoot(root, app)
else createRoot(root).render(app)
