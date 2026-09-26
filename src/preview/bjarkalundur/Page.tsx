import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setThemeColor } from '../../lib/preview'
import { COPY } from './copy'
import { STANDALONE, parsePath } from './paths'
import { applyHead, clearHead, headFor } from './seo'
import { SiteContext } from './site'
import type { Stay } from './site'
import { startOfDay } from './godo'
import { BAND, CSS, Header, Awning, Footer, jump, useMotion } from './shell'
import { Home, HOME_CSS } from './Home'
import { Rooms, ROOMS_CSS } from './Rooms'
import { Reviews, REVIEWS_CSS } from './Reviews'
import { Campsite, CAMPSITE_CSS } from './Campsite'
import { PICKER_CSS } from './StayPicker'

/* Hótel Bjarkalundur v4 (the Edelhaus board × the MRC scroll), in Icelandic at
   the root and English under /en. DESIGN.md beside this file is the locked
   system; copy.ts carries every word, data.ts the facts, seo.ts every head,
   paths.ts every URL. Routes (catalogue prefix /preview/bjarkalundur):
     /  /gisting  /umsagnir  /tjaldsvaedi   ·   /en  /en/rooms  /en/reviews  /en/campsite
   moved between with view transitions; the language switch crossfades in place. */

const ALL_CSS = CSS + HOME_CSS + ROOMS_CSS + REVIEWS_CSS + PICKER_CSS + CAMPSITE_CSS
/* layout effects do nothing on the server and warn there; the prerender renders this tree */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
const PreviewShell = STANDALONE ? null : lazy(() => import('./PreviewShell'))
const SITE_ORIGIN = STANDALONE ? (import.meta.env.VITE_BJARKALUNDUR_SITE_URL as string | undefined ?? '') : ''

/* where each history entry was left, so Back lands where the reader was */
const seen = new Map<string, number>()

export default function Page() {
  const loc = useLocation()
  const nav = useNavigationType()
  const { lang, page } = parsePath(loc.pathname)
  const route = `${lang}-${page}`
  const root = useRef<HTMLDivElement>(null)
  useMotion(root, route)

  /* the stay the calendar and every room link share */
  const [stay, setStayState] = useState<Stay>({ checkin: null, checkout: null, adults: 2, children: 0 })
  const setStay = useCallback((next: Partial<Stay>) => setStayState((p) => ({ ...p, ...next })), [])
  /* the clock arrives after mount: a prerendered page must not bake in the build day */
  const [today, setToday] = useState<Date | null>(null)
  useEffect(() => setToday(startOfDay(new Date())), [])
  const site = useMemo(() => ({ lang, page, t: COPY[lang], stay, setStay, today }), [lang, page, stay, setStay, today])

  const keyRef = useRef(loc.key)
  /* where this navigation must end up, re-read on demand (see the refresh guard below) */
  const hold = useRef<(() => number | null) | null>(null)
  const last = useRef<{ path: string; hash: string } | null>(null)
  const timer = useRef(0)
  const [pop, setPop] = useState(false)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  /* manual restoration is this preview's business only; hand it back on the way out */
  useEffect(() => {
    if (!('scrollRestoration' in history)) return
    const prev = history.scrollRestoration
    history.scrollRestoration = 'manual'
    return () => { history.scrollRestoration = prev }
  }, [])

  useIsoLayoutEffect(() => {
    const had = last.current
    const same = had?.path === loc.pathname && had?.hash === loc.hash
    last.current = { path: loc.pathname, hash: loc.hash }
    keyRef.current = loc.key
    /* a filter (?tegund=) is the same page at another address: the reader stays where they are */
    if (same && nav !== 'POP') { hold.current = null; seen.set(loc.key, window.scrollY); return }
    window.clearTimeout(timer.current)
    setPop(nav === 'POP' && !!had)
    /* the language switch: the same section, at the same height on screen */
    const from = (loc.state as { langFrom?: { key: string; offset: number } | null } | null)?.langFrom
    if (from !== undefined && had) {
      const at = () => {
        const el = from ? document.querySelector<HTMLElement>(`[data-anchor="${from.key}"]`) : null
        return el ? el.getBoundingClientRect().top + window.scrollY - from!.offset : 0
      }
      hold.current = at
      jump(at())
      return
    }
    const back = nav === 'POP' ? seen.get(loc.key) : undefined
    hold.current = back != null ? () => back : null
    if (back != null) jump(back)
    else if (loc.hash) {
      /* arriving from another page: land on the target at once, the view
         transition is the movement; re-land once the transition has ended in
         case the browser moved the page while it held the snapshot */
      const id = decodeURIComponent(loc.hash.slice(1))
      const land = () => {
        const el = document.getElementById(id)
        if (!el) return
        const y = el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0)
        if (Math.abs(window.scrollY - y) > 2) jump(y)
      }
      hold.current = () => {
        const el = document.getElementById(id)
        return el ? el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0) : null
      }
      land()
      requestAnimationFrame(() => requestAnimationFrame(land))
      /* kept across a same-page filter change: Rooms may clear a filter that hid the target */
      timer.current = window.setTimeout(land, 1050)
    } else jump(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.key])
  /* Two things move the page after the layout effect above has landed it:
     - App's ScrollToTop sends every new pathname to the top in a passive effect (it runs
       before this one, so landing again here wins);
     - ScrollTrigger measures the new page on its next refresh and puts the scroll back where
       it found it, which on a phone (no Lenis to re-sync) was before the landing: Back came
       back at 22px instead of 2782 (probe 2026-09-26).
     So land now, and again after every refresh for a short while. */
  useEffect(() => {
    const target = hold.current
    if (!target) return
    const land = () => { const y = target(); if (y != null && Math.abs(window.scrollY - y) > 2) jump(y) }
    land()
    ScrollTrigger.addEventListener('refresh', land)
    const t = window.setTimeout(() => ScrollTrigger.removeEventListener('refresh', land), 1600)
    return () => { window.clearTimeout(t); ScrollTrigger.removeEventListener('refresh', land) }
  }, [loc.key])

  /* recorded as the reader scrolls: by the time a route unmounts, the next page
     is already in the DOM and the old position may have been clamped */
  useEffect(() => {
    const on = () => { seen.set(keyRef.current, window.scrollY) }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  /* the head of this route in this language, the same one the prerender writes */
  useEffect(() => {
    applyHead(headFor(lang, page, SITE_ORIGIN))
    setThemeColor(BAND)
  }, [lang, page])
  useEffect(() => {
    const prev = document.documentElement.lang
    document.documentElement.lang = lang
    return () => { document.documentElement.lang = prev }
  }, [lang])
  useEffect(() => () => { if (!STANDALONE) clearHead() }, [])

  return (
    <SiteContext.Provider value={site}>
      <div ref={root} lang={lang} className="bj3">
        {/* dangerouslySetInnerHTML, not {CSS}: a server render HTML-escapes text in <style> and the prerendered stylesheet breaks */}
        <style dangerouslySetInnerHTML={{ __html: ALL_CSS }} />
        <Header />
        <main key={route} id="efni" tabIndex={-1} style={{ outline: 'none' }} data-pop={pop || undefined}>
          {page === 'rooms' ? <Rooms /> : page === 'reviews' ? <Reviews /> : page === 'campsite' ? <Campsite /> : <Home />}
        </main>
        <Footer />
        <Awning />
        {PreviewShell ? <Suspense fallback={null}><PreviewShell /></Suspense> : null}
      </div>
    </SiteContext.Provider>
  )
}
