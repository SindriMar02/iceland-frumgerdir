/**
 * Pólar Hestar — standalone entry point (polarhestar.is).
 *
 * The client's own deployment mounts ONLY the Pólar Hestar routes, at clean
 * root paths, from its own shell (polarhestar.html). No catalogue router, no
 * other clients' chunks, no preview chrome: the separation is structural, this
 * entry simply never imports any of it.
 *
 * HYDRATE, don't render. The build prerenders every route in every language to
 * real HTML (tools/polarhestar-standalone-prerender.mjs), because AI crawlers
 * do not run JavaScript and an empty #root is a blank page to them. So #root
 * already holds the finished markup; React adopts it instead of rebuilding it.
 * The createRoot fallback covers HTML that somehow arrived without prerendered
 * content, so a broken prerender degrades to a normal client render, not a
 * white screen.
 *
 * "Today" is frozen at the build date for the first render so the schedule in
 * the markup and the schedule React expects agree; each page thaws it right
 * after hydration (now.ts).
 *
 * Built with `npm run build:polarhestar` (vite.polarhestar.config.ts).
 */
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './polarhestar.css'
import { PolarhestarApp } from './polarhestar-app'
import { BUILD_DAY } from './preview/polarhestar/sanity'
import { freezeToday } from './preview/polarhestar/schedule'

const el = document.getElementById('root')!
const prerendered = el.childElementCount > 0
if (BUILD_DAY && prerendered) freezeToday(BUILD_DAY)

const tree = (
  <StrictMode>
    <BrowserRouter>
      <PolarhestarApp />
    </BrowserRouter>
  </StrictMode>
)

if (prerendered) hydrateRoot(el, tree)
else createRoot(el).render(tree)
