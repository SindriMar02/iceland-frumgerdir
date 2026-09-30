import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setMetaDescription, setThemeColor } from '../../lib/preview'
import { setCss } from './styles'
import { fitDisplay, initSetMotion, reducedMotion, resetScrollForRoute, scrollToEl } from './motion'
import { CONTACT, FAMILIES, JSON_LD, T, companyEntry, familyBySlug, parseRoute, path, type Lang, type Route } from './data'
import { FamilyPage, ProductPage, useCatalog } from './Catalog'
import { Home } from './Home'
import { ListDrawer, ListPage, ReviewPage } from './List'
import { seedOnce, useList } from './store'
import { SetLogo } from './Logo'

const B = import.meta.env.BASE_URL
const LOADER_KEY = 'set-loader-seen'
const LOADER_MS = 1500   // contour draw 1.1s + fill, then the 1.2s shutter

function otherLangPath(r: Route): string {
  const to: Lang = r.lang === 'is' ? 'en' : 'is'
  return path(to, r.view, r.param)
}

/* ------------------------------------------------------------------ header: constant bar + awning (mobile-chrome standard) */
function Header({ route, onList, menu, setMenu, spy, logoIn }: { route: Route; onList: () => void; menu: boolean; setMenu: (v: boolean) => void; spy: string; logoIn: boolean }) {
  const t = T[route.lang].nav
  const { list } = useList()
  const home = path(route.lang, 'home')
  const n = list.lines.length
  const links: [string, string, string][] = [
    ['vorur', t.products, `${home}#vorur`],
    ['thjonusta', t.how, `${home}#thjonusta`],
    ['framleidsla', t.production, `${home}#framleidsla`],
  ]
  return (
    <>
      <div className="set-awning" aria-hidden="true" />
      <header className="set-bar">
        <div className="set-bar__in">
          <Link className={`set-bar__logo${logoIn || menu ? ' is-in' : ''}`} to={home} aria-label={route.lang === 'is' ? 'Set, forsíða' : 'Set, home'} onClick={() => setMenu(false)}><SetLogo /></Link>
          <nav className="set-nav" aria-label={route.lang === 'is' ? 'Aðalvalmynd' : 'Main'}>
            {links.map(([id, l, h]) => <Link key={id} to={h} aria-current={route.view === 'home' && spy === id ? 'true' : undefined}>{l}</Link>)}
          </nav>
          <Link className="set-lang" to={otherLangPath(route)} hrefLang={route.lang === 'is' ? 'en' : 'is'} lang={route.lang === 'is' ? 'en' : 'is'} aria-label={t.lang}>{t.langShort}</Link>
          <button type="button" className="set-listbtn" onClick={onList} aria-label={`${t.list}, ${n}`}>
            <span className="set-listbtn__t">{t.list}</span>
            <span className="set-count set-tnum" aria-hidden="true"><span key={n}>{n}</span></span>
          </button>
          <button type="button" className="set-burger" aria-expanded={menu} aria-controls="set-menu" aria-label={menu ? t.close : t.menu} onClick={() => setMenu(!menu)}><i /></button>
        </div>
      </header>
      <nav id="set-menu" className={`set-menu${menu ? ' is-open' : ''}`} aria-label={t.menu} aria-hidden={!menu} data-lenis-prevent="">
        {[...links, ['list', t.list, path(route.lang, 'list')] as [string, string, string]].map(([id, l, h], i) => (
          <Link key={id} to={h} onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1}><small className="set-tnum">0{i + 1}</small>{l}</Link>
        ))}
        <Link to={otherLangPath(route)} onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1} lang={route.lang === 'is' ? 'en' : 'is'}><small>↗</small>{t.lang}</Link>
      </nav>
    </>
  )
}

/* ------------------------------------------------------------------ footer: their real addresses, hours and contacts */
function Footer({ lang }: { lang: Lang }) {
  const f = T[lang].foot
  return (
    <footer className="set-foot set-dark">
      <div className="set-foot__logo"><SetLogo title="Set" /></div>
      <div className="set-foot__grid">
        <div className="set-foot__col">
          <h3>{f.selfoss}</h3>
          <p>{f.selfossNote}</p>
          <p>{CONTACT.selfoss.street}<br />{CONTACT.selfoss.town}</p>
        </div>
        <div className="set-foot__col">
          <h3>{f.rvk}</h3>
          <p>{f.rvkNote}</p>
          <p>{CONTACT.reykjavik.street}<br />{CONTACT.reykjavik.town}</p>
        </div>
        <div className="set-foot__col">
          <h3>{lang === 'is' ? 'Sala' : 'Sales'}</h3>
          <p>{f.phone}: <a href={`tel:${CONTACT.tel}`}>{lang === 'is' ? CONTACT.phone : `+354 ${CONTACT.phone}`}</a></p>
          <p>{f.email}: <a href={`mailto:${CONTACT.sales}`}>{CONTACT.sales}</a></p>
          <p style={{ opacity: .8 }}>{f.hours}</p>
        </div>
        <div className="set-foot__col">
          <h3>{f.europe}</h3>
          {CONTACT.europe.map(([l, h]) => <a key={h} href={h} target="_blank" rel="noopener">{l}</a>)}
          <h3 style={{ marginTop: 18 }}>{lang === 'is' ? 'Vöruflokkar' : 'Families'}</h3>
          {FAMILIES.map((x) => <Link key={x.n} to={path(lang, 'family', x.slug)}>{lang === 'is' ? x.is : x.en}</Link>)}
        </div>
      </div>
      <div className="set-foot__small">
        <span>© Set ehf. · kt. 610278-0359</span>
        <span>{f.names}</span>
        <a href="https://set.is/" target="_blank" rel="noopener">{f.orig}</a>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ page */
export default function SetPage() {
  const { pathname, hash } = useLocation()
  const route = useMemo(() => parseRoute(pathname), [pathname])
  const { lang, view } = route
  const t = T[lang]
  const rootRef = useRef<HTMLDivElement>(null)
  const css = useMemo(() => setCss(B), [])
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
  useEffect(() => {
    if (loader !== 'on') return
    try { sessionStorage.setItem(LOADER_KEY, '1') } catch { /* private mode */ }
    const a = window.setTimeout(() => setLoader('leaving'), LOADER_MS)
    const b = window.setTimeout(() => setLoader('off'), LOADER_MS + 1250)
    return () => { window.clearTimeout(a); window.clearTimeout(b) }
  }, [loader])
  const [ringOn, setRingOn] = useState(false)
  useEffect(() => {
    if (view !== 'home') return
    const id = window.setTimeout(() => setRingOn(true), Math.max(0, loaderEnd.current - performance.now()) + 700)
    return () => window.clearTimeout(id)
  }, [view])

  /* the demonstration list starts from 2.18020, once per browser */
  useEffect(() => { if (cat) seedOnce(cat.products, lang === 'is' ? 'Dæmi: PE-vatnslögn SDR11' : 'Example: PE water line SDR11') }, [cat, lang])

  /* title, lang, description, theme colour per route */
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const fam = view === 'family' ? familyBySlug(route.param ?? '') : undefined
    const prod = view === 'product' ? cat?.products.find((p) => p.slug === route.param) : undefined
    document.title =
      view === 'family' && fam ? `${lang === 'is' ? fam.is : fam.en} | Set` :
      view === 'product' && prod ? `${prod.name} (${prod.sku}) | Set` :
      view === 'list' ? `${t.list.h1} | Set` :
      view === 'review' ? `${t.review.h1} | Set` : t.title
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

  /* motion: one engine per route; display fitting runs with or without it */
  const heroDelay = useCallback(() => Math.max(0, loaderEnd.current - performance.now()) + 250, [])
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const off = initSetMotion(root, { heroDelay })
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
    const ids = ['vorur', 'thjonusta', 'framleidsla']
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
    const mark = document.querySelector('.set-hero__mark')
    if (!mark || !('IntersectionObserver' in window)) { setLogoIn(true); return }
    const io = new IntersectionObserver(([e]) => setLogoIn(!e.isIntersecting), { rootMargin: '-64px 0px 0px 0px', threshold: 0 })
    io.observe(mark)
    return () => io.disconnect()
  }, [view, pathname])

  const chromeCompany = useMemo(() => ({ ...companyEntry, english: lang === 'en' }), [lang])

  return (
    <div className="set" lang={t.htmlLang}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <link rel="preload" as="font" type="font/woff2" href={`${B}fonts/set/StrichpunktSans-Variable.woff2`} crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href={`${B}fonts/set/Switzer-Variable.woff2`} crossOrigin="" />
      <PreviewChrome company={companyEntry} />
      <a className="set-sr set-skip" href="#set-main">{t.skip}</a>
      {loader !== 'off' && (
        <div className={`set-load${loader === 'leaving' ? ' is-leaving' : ''}`} aria-hidden="true">
          <div className="set-load__field" />
          <div className="set-load__mark"><SetLogo draw /></div>
        </div>
      )}
      <Header route={route} onList={() => setDrawer(true)} menu={menu} setMenu={setMenu} spy={spy} logoIn={logoIn} />
      <div ref={rootRef} key={pathname}>
        <main id="set-main" tabIndex={-1}>
          {view === 'home' && <Home lang={lang} ringOn={ringOn} />}
          {view === 'family' && <FamilyPage lang={lang} slug={route.param ?? ''} />}
          {view === 'product' && <ProductPage lang={lang} slug={route.param ?? ''} />}
          {view === 'list' && <ListPage lang={lang} />}
          {view === 'review' && <ReviewPage lang={lang} />}
        </main>
        <Footer lang={lang} />
      </div>
      <ListDrawer lang={lang} open={drawer} onClose={() => setDrawer(false)} />
      <div className="set-pf"><PreviewFooter company={{ ...chromeCompany, dark: false }} verifiedContent /></div>
    </div>
  )
}
