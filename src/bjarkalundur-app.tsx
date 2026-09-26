/**
 * Hótel Bjarkalundur — the route tree, shared by the browser and the prerender.
 *
 * ONE definition, mounted twice: src/bjarkalundur-main.tsx hydrates it in the
 * browser, src/bjarkalundur-entry-server.tsx renders it to HTML at build time.
 * Two copies that drift apart is how a hydration mismatch ships, so there is one.
 *
 * Page.tsx reads the language and page from the URL (paths.ts): Icelandic at
 * the root, English under /en/. Scrolling on route changes is Page's own job
 * (Back restores the exact place), so there is no global ScrollToTop here.
 * Anything that is not one of the eight routes is a real 404, not a soft one.
 */
import { useLocation } from 'react-router-dom'
import Page from './preview/bjarkalundur/Page'
import { ROUTES, pathFor } from './preview/bjarkalundur/paths'

const KNOWN = new Set(ROUTES.map((r) => pathFor(r.lang, r.page).replace(/\/+$/, '') || '/'))

function NotFound() {
  return (
    <main style={{ padding: '6rem 1.5rem', fontFamily: 'system-ui, sans-serif', color: '#F5F4F1' }}>
      <h1 style={{ fontWeight: 400 }}>Síða fannst ekki · Page not found</h1>
      <p><a href="/" style={{ color: '#F5F4F1' }}>Hótel Bjarkalundur</a> · <a href="/en/" style={{ color: '#F5F4F1' }}>Hotel Bjarkalundur (English)</a></p>
    </main>
  )
}

export function BjarkalundurApp() {
  const { pathname } = useLocation()
  const key = pathname.replace(/\/+$/, '') || '/'
  return KNOWN.has(key) ? <Page /> : <NotFound />
}

/** Every prerendered address, with the trailing slash the host serves. */
export const PRERENDER_ROUTES = ROUTES.map((r) => ({ ...r, path: pathFor(r.lang, r.page) }))
