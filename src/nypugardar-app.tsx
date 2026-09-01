/**
 * Nýpugarðar — the route tree, shared by the browser and the prerender.
 *
 * ONE definition, mounted twice: src/nypugardar-main.tsx hydrates it in the
 * browser, src/nypugardar-entry-server.tsx renders it to HTML at build time.
 * They must agree exactly; two copies of this tree that drift apart is how a
 * hydration mismatch gets shipped, so there is only one.
 *
 * The language is the URL (see preview/nypugardar/paths.ts): English at the
 * root, Icelandic under /is/. The catalogue's Icelandic slug for the rooms
 * page (/herbergi) is tolerated at the root too, so an old link still lands.
 */
import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

const Page = lazy(() => import('./preview/nypugardar/Page'))
const RoomsPage = lazy(() => import('./preview/nypugardar/RoomsPage'))

/** Same guarded scroll reset as the catalogue's App.tsx. The hash guard
 *  matters: an arbitrary #hash that is not a valid selector makes
 *  querySelector THROW, which once white-screened a whole preview. A hash
 *  target is retried across a few frames, because the lazy page it lives on
 *  may not have mounted yet when the location changes; that is the
 *  "/rooms#room-double does not scroll on a cold load" bug the catalogue
 *  still has. Effect-only, so it is inert during the server render. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      let tries = 0
      const attempt = () => {
        let el: Element | null = null
        try {
          el = document.querySelector(hash)
        } catch {
          return /* not a selector, so not an anchor */
        }
        if (el) {
          el.scrollIntoView()
          return
        }
        if (++tries < 60) requestAnimationFrame(attempt)
      }
      attempt()
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export function NypugardarApp() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/is" element={<Page />} />
          <Route path="/is/herbergi" element={<RoomsPage />} />
          <Route path="/herbergi" element={<RoomsPage />} />
          {/* anything else goes home; a farm site has no useful 404 */}
          <Route path="*" element={<Page />} />
        </Routes>
      </Suspense>
    </>
  )
}

export { PRERENDER_ROUTES } from './preview/nypugardar/paths'
