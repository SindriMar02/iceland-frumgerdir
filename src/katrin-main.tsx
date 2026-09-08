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
/* utilities-only Tailwind, so this page can host the 21st.dev
   components without taking their reset — see katrin-tailwind.css */
import './katrin-tailwind.css'
import { StrictMode, useEffect } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import Site, { loadHome } from './preview/katrinisfeld/Page'

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

/* THE HOME ROUTE IS AWAITED BEFORE HYDRATION, and that is the whole reason
   this split is safe. Its chunk carries GSAP, ScrollTrigger and Lenis — 49 KB
   gzipped that the other thirty-two routes now never fetch — but #root already
   holds the finished, prerendered page, and hydrating against a component that
   is not there yet would blank it for a frame. Resolving the module first
   means React adopts the existing DOM with nothing missing.
   Only the page that needs it waits: on every other route this promise is
   never created and the chunk is never requested. */
const mount = () => {
  if (root.firstChild) hydrateRoot(root, app)
  else createRoot(root).render(app)
}
const onHome = location.pathname === '/' || location.pathname === ''
if (onHome) loadHome().then(mount, mount)
else mount()
