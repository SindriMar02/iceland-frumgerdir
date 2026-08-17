/**
 * Reynir bakarí — standalone entry point.
 *
 * The client's own deployment mounts ONLY the four Reynir routes, at clean
 * root paths, from its own shell (reynir.html). No catalogue router, no other
 * clients' chunks, no preview chrome — the separation is structural: this
 * entry simply never imports any of it, so none of it can leak into the
 * bundle a customer downloads from reynirbakari.is.
 *
 * Built with `npm run build:reynir` (vite.reynir.config.ts) → dist-reynir/.
 */
import { StrictMode, Suspense, lazy, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import { HOME_PATH, ORDER_PATH, STORY_PATH, LEGAL_PATH } from './preview/reynir/paths'

const Page = lazy(() => import('./preview/reynir/Page'))
const OrderPage = lazy(() => import('./preview/reynir/OrderPage'))
const StoryPage = lazy(() => import('./preview/reynir/StoryPage'))
const LegalPage = lazy(() => import('./preview/reynir/LegalPage'))

/** Same guarded scroll reset as the catalogue's App.tsx — the hash guard
 *  matters: an arbitrary #hash that is not a valid selector makes
 *  querySelector THROW, which once white-screened a whole preview. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      try {
        document.querySelector(hash)?.scrollIntoView()
      } catch {
        /* not a selector, so not an anchor */
      }
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path={HOME_PATH} element={<Page />} />
          <Route path={ORDER_PATH} element={<OrderPage />} />
          <Route path={STORY_PATH} element={<StoryPage />} />
          <Route path={LEGAL_PATH} element={<LegalPage />} />
          {/* anything else goes home — a bakery site has no useful 404 */}
          <Route path="*" element={<Page />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
