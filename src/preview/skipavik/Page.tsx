import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setMetaDescription, setThemeColor } from '../../lib/preview'
import { skvCss } from './styles'
import { fitDisplay, initSkvMotion, reducedMotion, resetScrollForRoute, scrollToEl } from './motion'
import { CONTACT, FAMILIES, JSON_LD, T, companyEntry, familyBySlug, parseRoute, path, type Lang, type Route } from './data'
import { FamilyPage, ProductPage, useCatalog } from './Catalog'
import { Home } from './Home'
import { ListDrawer, ListPage, ReviewPage } from './List'
import { seedOnce, useList } from './store'
import { SkvLogo } from './Logo'

const B = import.meta.env.BASE_URL
const LOADER_KEY = 'skv-loader-seen'
const LOADER_MS = 1300   // contour draw + fill, then the 1.2s shutter: about 2.5 s once per session (intro rule)


/* ------------------------------------------------------------------ header: constant bar + awning (mobile-chrome standard) */
function Header({ route, onList, menu, setMenu, spy, logoIn }: { route: Route; onList: () => void; menu: boolean; setMenu: (v: boolean) => void; spy: string; logoIn: boolean }) {
  const t = T[route.lang].nav
  const { list } = useList()
  const home = path(route.lang, 'home')
  const n = list.lines.length
  const links: [string, string, string][] = [
    ['svid', t.products, `${home}#svid`],
    ['spurt', t.how, `${home}#spurt`],
    ['saga', t.production, `${home}#saga`],
  ]
  return (
    <>
      <div className="skv-awning" aria-hidden="true" />
      <header className="skv-bar">
        <div className="skv-bar__in">
          <Link className={`skv-bar__logo${logoIn || menu ? ' is-in' : ''}`} to={home} aria-label="Skipavík, forsíða" onClick={() => setMenu(false)}><SkvLogo /></Link>
          <nav className="skv-nav" aria-label={route.lang === 'is' ? 'Aðalvalmynd' : 'Main'}>
            {links.map(([id, l, h]) => <Link key={id} to={h} aria-current={route.view === 'home' && spy === id ? 'true' : undefined}>{l}</Link>)}
          </nav>
          <button type="button" className="skv-listbtn" onClick={onList} aria-label={`${t.list}, ${n}`}>
            <span className="skv-listbtn__t">{t.list}</span>
            <span className="skv-count skv-tnum" aria-hidden="true"><span key={n}>{n}</span></span>
          </button>
          <button type="button" className="skv-burger" aria-expanded={menu} aria-controls="skv-menu" aria-label={menu ? t.close : t.menu} onClick={() => setMenu(!menu)}><i /></button>
        </div>
      </header>
      <nav id="skv-menu" className={`skv-menu${menu ? ' is-open' : ''}`} aria-label={t.menu} aria-hidden={!menu} data-lenis-prevent="">
        {[...links, ['list', t.list, path(route.lang, 'list')] as [string, string, string]].map(([id, l, h], i) => (
          <Link key={id} to={h} onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1}><small className="skv-tnum">0{i + 1}</small>{l}</Link>
        ))}
        <a href={`tel:${CONTACT.tel}`} onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1}><small aria-hidden="true"><svg className="skv-tel" viewBox="0 0 16 16"><path d="M4.2 1.8 6 4.6 4.8 6c.7 1.6 1.9 2.9 3.5 3.6l1.4-1.2 2.8 1.8-.6 2.4c-.2.6-.8.9-1.4.8C6.4 12.8 3.2 9.6 2.6 5.5c-.1-.6.2-1.2.8-1.4z" /></svg></small>{CONTACT.phone}</a>
      </nav>
    </>
  )
}

/* ------------------------------------------------------------------ footer: their real addresses, hours and contacts */
function Footer({ lang }: { lang: Lang }) {
  const f = T[lang].foot
  return (
    <footer className="skv-foot skv-dark">
      <div className="skv-foot__logo"><SkvLogo title="Skipavík" /></div>
      <div className="skv-foot__grid">
        <div className="skv-foot__col">
          <h3>{f.hq}</h3>
          <p>{f.hqNote}</p>
          <p>{CONTACT.street}<br />{CONTACT.town}</p>
        </div>
        <div className="skv-foot__col">
          <h3>{f.tangi}</h3>
          <p>{f.tangiNote}</p>
          <p>Hallfreður Ragnar Björgvinsson<br /><a href="tel:+3546946747">694 6747</a></p>
        </div>
        <div className="skv-foot__col">
          <h3>Samband</h3>
          <p>{f.phone}: <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></p>
          <p>{f.email}: <a href={`mailto:${CONTACT.sales}`}>{CONTACT.sales}</a></p>
          {CONTACT.hours.map(([k, v]) => <p key={k} style={{ opacity: .8 }}><b style={{ fontWeight: 500 }}>{k}:</b> {v}</p>)}
        </div>
        <div className="skv-foot__col">
          <h3>Svið</h3>
          {FAMILIES.map((x) => <Link key={x.n} to={path(lang, 'family', x.slug)}>{x.is}</Link>)}
        </div>
      </div>
      <div className="skv-foot__small">
        <span>© Skipavík ehf. · kt. 700175-0149</span>
        <span>{f.names}</span>
        <a href="https://www.skipavik.is/" target="_blank" rel="noopener">{f.orig}</a>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ page */
export default function SkipavikPage() {
  const { pathname, hash } = useLocation()
  const route = useMemo(() => parseRoute(pathname), [pathname])
  const { lang, view } = route
  const t = T[lang]
  const rootRef = useRef<HTMLDivElement>(null)
  const css = useMemo(() => skvCss(B), [])
  const [menu, setMenu] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [spy, setSpy] = useState('')
  const { cat } = useCatalog()

  /* loader: once per session, home only, never under reduced motion */
  const [loader, setLoader] = useState<'on' | 'leaving' | 'off'>(() => {
    if (typeof window === 'undefined' || reducedMotion() || parseRoute(window.location.pathname).view !== 'home') return 'off'
    try { return sessionStorage.getItem(LOADER_KEY) ? 'off' : 'on' } catch { return 'off' }
  })
  const loaderEnd = useRef(loader === 'on' ? performance.now() + LOADER_MS + 350 : 0)
  /* one timer per stage: a single effect with both timers cancelled its own removal when the state flipped to
     'leaving', leaving the petrol field fixed above the viewport, which iOS Safari then sampled to tint its chrome */
  useEffect(() => {
    if (loader === 'off') return
    if (loader === 'on') { try { sessionStorage.setItem(LOADER_KEY, '1') } catch { /* private mode */ } }
    const id = window.setTimeout(() => setLoader(loader === 'on' ? 'leaving' : 'off'), loader === 'on' ? LOADER_MS : 1250)
    return () => window.clearTimeout(id)
  }, [loader])
  const [ringOn, setRingOn] = useState(false)
  useEffect(() => {
    if (view !== 'home') return
    const id = window.setTimeout(() => setRingOn(true), Math.max(0, loaderEnd.current - performance.now()) + 700)
    return () => window.clearTimeout(id)
  }, [view])

  /* the demonstration list starts from 2.18020, once per browser */
  useEffect(() => { if (cat) seedOnce(cat.products, '') }, [cat, lang])

  /* title, lang, description, theme colour per route */
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const fam = view === 'family' ? familyBySlug(route.param ?? '') : undefined
    const prod = view === 'product' ? cat?.products.find((p) => p.slug === route.param) : undefined
    document.title =
      view === 'family' && fam ? `${fam.is} | Skipavík` :
      view === 'product' && prod ? `${prod.name} | Skipavík` :
      view === 'list' ? `${t.list.h1} | Skipavík` :
      view === 'review' ? `${t.review.h1} | Skipavík` : t.title
    document.documentElement.lang = t.htmlLang
    setThemeColor('#FFFFFF')
    const off = setMetaDescription(t.description)
    return () => { document.title = prevTitle; document.documentElement.lang = prevLang; off() }
  }, [lang, view, route.param, cat, t])

  /* route change: reset scroll through Lenis first, then honour a hash */
  useLayoutEffect(() => { if (!hash) resetScrollForRoute() }, [pathname, hash])
  /* a hash on arrival jumps once the catalogue (which sets the page height) is in; later hash links ease there */
  const arrived = useRef(false)
  useEffect(() => {
    if (!hash) return
    if (!cat) return
    const first = !arrived.current
    arrived.current = true
    const id = window.setTimeout(() => scrollToEl(document.getElementById(hash.slice(1)), first), first ? 120 : 30)
    return () => window.clearTimeout(id)
  }, [pathname, hash, cat])
  useEffect(() => { if (!hash && cat) arrived.current = true }, [hash, cat])
  useEffect(() => { setMenu(false); setDrawer(false) }, [pathname])

  /* menu: Escape closes; body stays scrollable only behind a closed menu */
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('keydown', onKey)
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); html.style.overflow = prev }
  }, [menu])

  /* focus-guard (_tools/focus-guard/focus-guard.js): remember the last input kind so a tap never paints a ring */
  useEffect(() => {
    const root = document.documentElement
    const set = (v: string) => { if (root.getAttribute('data-input') !== v) root.setAttribute('data-input', v) }
    const onPtr = () => set('pointer')
    const onKey = (e: KeyboardEvent) => { if (!['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) set('key') }
    addEventListener('pointerdown', onPtr, true)
    addEventListener('keydown', onKey, true)
    return () => { removeEventListener('pointerdown', onPtr, true); removeEventListener('keydown', onKey, true) }
  }, [])

  /* motion: one engine per route; display fitting runs with or without it */
  const heroDelay = useCallback(() => Math.max(0, loaderEnd.current - performance.now()) + 250, [])
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const off = initSkvMotion(root, { heroDelay })
    let fitOff = () => {}
    if (reducedMotion()) {
      const fit = () => fitDisplay(root)
      let w = window.innerWidth
      const onR = () => { if (window.innerWidth !== w) { w = window.innerWidth; fit() } }
      document.fonts?.ready.then(fit)
      window.addEventListener('resize', onR)
      fitOff = () => window.removeEventListener('resize', onR)
    }
    return () => { off(); fitOff() }
  }, [pathname, heroDelay])

  /* scroll-spy for the three home sections (Live-up M3, 42% line) */
  useEffect(() => {
    if (view !== 'home') return
    const ids = ['svid', 'spurt', 'saga']
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const line = window.innerHeight * 0.42
        const cur = ids.find((id) => { const r = document.getElementById(id)?.getBoundingClientRect(); return r && r.top <= line && r.bottom > line })
        setSpy(cur ?? '')
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [view])

  /* the bar's logo waits while the hero's big wordmark is on screen, then slides into the bar as the wordmark passes
     under it (Sindri 2026-09-30). One observer on the wordmark; other pages and phones (wordmark hidden) show it at once. */
  const [logoIn, setLogoIn] = useState(view !== 'home')
  useEffect(() => {
    if (view !== 'home') { setLogoIn(true); return }
    const mark = document.querySelector('.skv-hero__mark')
    if (!mark || !('IntersectionObserver' in window)) { setLogoIn(true); return }
    const io = new IntersectionObserver(([e]) => setLogoIn(!e.isIntersecting), { rootMargin: '-64px 0px 0px 0px', threshold: 0 })
    io.observe(mark)
    return () => io.disconnect()
  }, [view, pathname])

  const chromeCompany = useMemo(() => ({ ...companyEntry, english: lang === 'en' }), [lang])

  return (
    <div className="skv" lang={t.htmlLang}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <link rel="preload" as="font" type="font/woff2" href={`${B}fonts/set/StrichpunktSans-Variable.woff2`} crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href={`${B}fonts/set/Switzer-Variable.woff2`} crossOrigin="" />
      <PreviewChrome company={companyEntry} />
      <a className="skv-sr skv-skip" href="#skv-main">{t.skip}</a>
      {loader !== 'off' && (
        <div className={`skv-load${loader === 'leaving' ? ' is-leaving' : ''}`} aria-hidden="true">
          <div className="skv-load__field" />
          <div className="skv-load__mark"><SkvLogo draw /></div>
        </div>
      )}
      <Header route={route} onList={() => setDrawer(true)} menu={menu} setMenu={setMenu} spy={spy} logoIn={logoIn} />
      <div ref={rootRef} key={pathname}>
        <main id="skv-main" tabIndex={-1}>
          {view === 'home' && <Home lang={lang} ringOn={ringOn} />}
          {view === 'family' && <FamilyPage lang={lang} slug={route.param ?? ''} />}
          {view === 'product' && <ProductPage lang={lang} slug={route.param ?? ''} />}
          {view === 'list' && <ListPage lang={lang} />}
          {view === 'review' && <ReviewPage lang={lang} />}
        </main>
        <Footer lang={lang} />
      </div>
      <ListDrawer lang={lang} open={drawer} onClose={() => setDrawer(false)} />
      <div className="skv-pf"><PreviewFooter company={{ ...chromeCompany, dark: false }} verifiedContent /></div>
    </div>
  )
}
