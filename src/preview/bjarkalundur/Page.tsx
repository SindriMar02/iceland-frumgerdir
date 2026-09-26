import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { JSON_LD, ROOT } from './data'
import { BAND, CSS, Header, Awning, Footer, jump, useMotion } from './shell'
import { Home, HOME_CSS } from './Home'
import { Rooms, ROOMS_CSS } from './Rooms'
import { Reviews, REVIEWS_CSS } from './Reviews'

/* Hótel Bjarkalundur v4 (the Edelhaus board × the MRC scroll). DESIGN.md
   beside this file is the locked system; data.ts carries every word with its
   source. Three routes under /preview/bjarkalundur/*: home, /gisting,
   /umsagnir, moved between with view transitions. */

const TITLES: Record<string, string> = {
  '': 'Hótel Bjarkalundur · Elsta sumarhótel landsins',
  gisting: 'Gisting · Hótel Bjarkalundur',
  umsagnir: 'Umsagnir gesta · Hótel Bjarkalundur',
}

/* where each history entry was left, so Back lands where the reader was */
const seen = new Map<string, number>()

export default function Page() {
  const loc = useLocation()
  const nav = useNavigationType()
  const sub = loc.pathname.replace(/\/+$/, '').split(ROOT)[1]?.replace(/^\//, '') ?? ''
  const route = sub === 'gisting' || sub === 'umsagnir' ? sub : ''
  const root = useRef<HTMLDivElement>(null)
  useMotion(root, route)
  const keyRef = useRef(loc.key)
  const restore = useRef<number | null>(null)
  const last = useRef<{ path: string; hash: string } | null>(null)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  /* manual restoration is this preview's business only; hand it back on the way out */
  useEffect(() => {
    if (!('scrollRestoration' in history)) return
    const prev = history.scrollRestoration
    history.scrollRestoration = 'manual'
    return () => { history.scrollRestoration = prev }
  }, [])

  useLayoutEffect(() => {
    const same = last.current?.path === loc.pathname && last.current?.hash === loc.hash
    last.current = { path: loc.pathname, hash: loc.hash }
    keyRef.current = loc.key
    /* a filter (?tegund=) is the same page at another address: the reader stays where they are */
    if (same && nav !== 'POP') { restore.current = null; seen.set(loc.key, window.scrollY); return }
    window.clearTimeout(timer.current)
    const back = nav === 'POP' ? seen.get(loc.key) : undefined
    restore.current = back ?? null
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
      land()
      requestAnimationFrame(() => requestAnimationFrame(land))
      /* kept across a same-page filter change: Rooms may clear a filter that hid the target */
      timer.current = window.setTimeout(land, 1050)
    } else jump(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.key])
  /* App's ScrollToTop sends every new pathname to the top in a passive effect,
     after the layout effect above; its effect runs before this one, so Back wins */
  useEffect(() => { if (restore.current != null) jump(restore.current) }, [loc.key])

  /* recorded as the reader scrolls: by the time a route unmounts, the next page
     is already in the DOM and the old position may have been clamped */
  useEffect(() => {
    const on = () => { seen.set(keyRef.current, window.scrollY) }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.title = TITLES[route]
    setThemeColor(BAND)
  }, [route])

  useEffect(() => {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(s)
    return () => { s.remove() }
  }, [])

  return (
    <div ref={root} lang="is" className="bj3">
      <style>{CSS + HOME_CSS + ROOMS_CSS + REVIEWS_CSS}</style>
      <Header />
      <main key={route} id="efni" tabIndex={-1} style={{ outline: 'none' }}>
        {route === 'gisting' ? <Rooms /> : route === 'umsagnir' ? <Reviews /> : <Home />}
      </main>
      <Footer />
      <Awning />
      <PreviewChrome company={companyEntry} />
      <PreviewFooter company={companyEntry} verifiedContent />
    </div>
  )
}
