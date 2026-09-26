/**
 * Hótel Bjarkalundur — standalone entry point (hotelbjarkalundur.is).
 *
 * HYDRATE, don't render: every route is prerendered to real HTML
 * (tools/bjarkalundur-standalone-post.mjs), because AI crawlers do not run
 * JavaScript and an empty #root is a blank page to them. React adopts the
 * markup. The createRoot fallback turns a broken prerender into a normal client
 * render instead of a white screen.
 */
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { BjarkalundurApp } from './bjarkalundur-app'

const el = document.getElementById('root')!
const tree = (
  <StrictMode>
    <BrowserRouter>
      <BjarkalundurApp />
    </BrowserRouter>
  </StrictMode>
)

if (el.childElementCount > 0) hydrateRoot(el, tree)
else createRoot(el).render(tree)
