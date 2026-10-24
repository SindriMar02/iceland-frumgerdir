/**
 * Pólar Hestar — the route tree of the client's own site, shared by the
 * browser (src/polarhestar-main.tsx hydrates it) and the prerender
 * (src/polarhestar-entry-server.tsx renders it to HTML at build time).
 *
 * ONE definition, mounted twice: two copies that drift apart is how a
 * hydration mismatch gets shipped.
 *
 * Every page exists once per language, under its own URL:
 *   Icelandic at the root (/, /dagskra/, /reidtur/:id/, /ferd/:id/),
 *   English under /en/, German under /de/.
 * The language is the URL (see preview/polarhestar/paths.ts); RouteLang hands
 * it to the page, which no longer guesses it from the browser.
 *
 * One SiteContentProvider for the whole app, so moving between pages keeps the
 * content and does not refetch it; the pages' own providers (they wrap
 * themselves for the catalogue) see they are nested and step aside.
 */
import { Suspense, lazy, useEffect, useRef, type ReactNode } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { RouteLang } from './preview/polarhestar/lang'
import { RouteHead } from './preview/polarhestar/RouteHead'
import { SiteContentProvider } from './preview/polarhestar/sanity'
import { LANGS, langPrefix, parsePath, routePath } from './preview/polarhestar/paths'
import type { Lang } from './preview/polarhestar/data'

const Page = lazy(() => import('./preview/polarhestar/Page'))
const SchedulePage = lazy(() => import('./preview/polarhestar/SchedulePage'))
const TourPage = lazy(() => import('./preview/polarhestar/LongTourPage'))
const RidePage = lazy(() => import('./preview/polarhestar/ShortTourPage'))

/** Scroll to the top on a new page, to the #anchor when there is one, and stay put on a language switch.
 *  The hash target is retried across a few frames: the lazy page it lives on may not have mounted yet.
 *  An arbitrary #hash that is not a valid selector makes querySelector THROW, hence the guard.
 *  Effect-only, so it is inert during the server render. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const last = useRef<string | null>(null)
  useEffect(() => {
    const here = parsePath(pathname)
    const page = here ? routePath(here.route, 'is') : pathname
    const first = last.current === null
    const sameRouteOtherLanguage = last.current === page
    last.current = page
    if (hash) {
      let tries = 0
      const attempt = () => {
        let el: Element | null = null
        try {
          el = document.querySelector(hash)
        } catch {
          return
        }
        if (el) {
          el.scrollIntoView({ block: 'start', behavior: 'instant' })
          return
        }
        if (++tries < 60) requestAnimationFrame(attempt)
      }
      attempt()
      return
    }
    // first load: the browser restores its own position; a language switch keeps the reader where they were
    if (first || sameRouteOtherLanguage) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function NotFound() {
  return (
    <main style={{ padding: '6rem 1.5rem', maxWidth: '40rem', margin: '0 auto', fontFamily: 'system-ui', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: '1.75rem' }}>Síða fannst ekki · Page not found · Seite nicht gefunden</h1>
      <p>
        {LANGS.map((l, i) => (
          <span key={l}>
            {i ? ' · ' : ''}
            <Link to={routePath({ kind: 'home' }, l)} hrefLang={l}>Pólar Hestar ({l.toUpperCase()})</Link>
          </span>
        ))}
      </p>
    </main>
  )
}

const inLang = (lang: Lang, el: ReactNode) => <RouteLang lang={lang}>{el}</RouteLang>

export function PolarhestarApp() {
  return (
    <SiteContentProvider>
      <ScrollToTop />
      <RouteHead />
      <Suspense fallback={null}>
        <Routes>
          {LANGS.flatMap((lang) => {
            const p = langPrefix(lang)
            return [
              <Route key={`${lang}-home`} path={p || '/'} element={inLang(lang, <Page />)} />,
              <Route key={`${lang}-schedule`} path={`${p}/dagskra`} element={inLang(lang, <SchedulePage />)} />,
              <Route key={`${lang}-ride`} path={`${p}/reidtur/:id`} element={inLang(lang, <RidePage />)} />,
              <Route key={`${lang}-tour`} path={`${p}/ferd/:id`} element={inLang(lang, <TourPage />)} />,
            ]
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </SiteContentProvider>
  )
}
