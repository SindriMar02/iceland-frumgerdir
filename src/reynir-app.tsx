/**
 * Reynir bakarí — the route tree, shared by the browser and the prerender.
 *
 * ONE definition, mounted twice: src/reynir-main.tsx hydrates it in the
 * browser, src/reynir-entry-server.tsx renders it to HTML at build time. They
 * must agree exactly — two copies of this tree that drift apart is how a
 * hydration mismatch gets shipped, so there is only one.
 */
import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ROUTES } from './preview/reynir/paths'

const Page = lazy(() => import('./preview/reynir/Page'))
const OrderPage = lazy(() => import('./preview/reynir/OrderPage'))
const StoryPage = lazy(() => import('./preview/reynir/StoryPage'))
const LegalPage = lazy(() => import('./preview/reynir/LegalPage'))

/** Same guarded scroll reset as the catalogue's App.tsx — the hash guard
 *  matters: an arbitrary #hash that is not a valid selector makes
 *  querySelector THROW, which once white-screened a whole preview.
 *  Effect-only, so it is inert during the server render. */
export function ScrollToTop() {
  const { pathname, hash, state } = useLocation()
  const keepScroll = Boolean((state as { keepScroll?: boolean } | null)?.keepScroll)
  useEffect(() => {
    /* a language switch is the same page at a different address */
    if (keepScroll) return
    if (hash) {
      try {
        document.querySelector(hash)?.scrollIntoView()
      } catch {
        /* not a selector, so not an anchor */
      }
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash, keepScroll])
  return null
}

export function ReynirApp() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          {/* Each page twice: the Icelandic path, and the same page under /en.
              The component does not care which — it reads its language from the
              URL — so one element serves both. */}
          <Route path={ROUTES.home.is} element={<Page />} />
          <Route path={ROUTES.home.en} element={<Page />} />
          <Route path={ROUTES.order.is} element={<OrderPage />} />
          <Route path={ROUTES.order.en} element={<OrderPage />} />
          <Route path={ROUTES.story.is} element={<StoryPage />} />
          <Route path={ROUTES.story.en} element={<StoryPage />} />
          <Route path={ROUTES.legal.is} element={<LegalPage />} />
          <Route path={ROUTES.legal.en} element={<LegalPage />} />
          {/* anything else goes home — a bakery site has no useful 404 */}
          <Route path="*" element={<Page />} />
        </Routes>
      </Suspense>
    </>
  )
}

/** The routes the prerender walks. Kept beside the tree that serves them so
 *  adding a route cannot silently ship an unprerendered page. */
export const PRERENDER_ROUTES = Object.values(ROUTES).flatMap((r) => [r.is, r.en])
