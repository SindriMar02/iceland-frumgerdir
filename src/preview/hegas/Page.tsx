import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setMetaDescription, setThemeColor } from '../../lib/preview'
import { hgCss } from './styles'
import { fitDisplay, initHgMotion, reducedMotion, resetScrollForRoute, scrollToEl } from './motion'
import { CONTACT, FAMILIES, JSON_LD, T, brandSlug, companyEntry, familyBySlug, pad2, parseRoute, path, type Lang, type Route } from './data'
import { BrandPage, FamilyPage, ProductPage, useCatalog } from './Catalog'
import { Home } from './Home'
import { ListDrawer, ListPage, ReviewPage } from './List'
import { seedOnce, useList } from './store'
import { HgLogo } from './Logo'

const B = import.meta.env.BASE_URL
const LOADER_KEY = 'hegas-loader-seen'
const LOADER_MS = 1500   // contour draw 1.1s + fill, then the 1.2s shutter

/* ------------------------------------------------------------------ header: constant bar + awning; three items, two with a dropdown */
type NavItem = { id: string; label: string; to: string; sub?: [string, string][] }
function Header({ route, onList, menu, setMenu, spy, logoIn }: { route: Route; onList: () => void; menu: boolean; setMenu: (v: boolean) => void; spy: string; logoIn: boolean }) {
  const t = T[route.lang].nav
  const { list } = useList()
  const home = path(route.lang, 'home')
  const n = list.lines.length
  const items: NavItem[] = [
    { id: 'vorur', label: t.products, to: `${home}#vorur`, sub: [...FAMILIES.map((f) => [f.is, path('is', 'family', f.slug)] as [string, string]), [t.brands, `${home}#merki`]] },
    { id: 'velar', label: t.machines, to: `${home}#velar` },
    { id: 'um', label: t.about, to: `${home}#starfsfolk`, sub: [[t.how, `${home}#thjonusta`], [t.news, `${home}#frettir`], [t.staff, `${home}#starfsfolk`], [t.story, `${home}#sagan`], [t.contact, `${home}#hafa-samband`]] },
  ]
  const spyOf = (it: NavItem) => route.view === 'home' && (spy === it.id || (it.id === 'vorur' && spy === 'merki') || (it.id === 'um' && ['thjonusta', 'frettir', 'starfsfolk', 'sagan', 'hafa-samband'].includes(spy)))
  const [drop, setDrop] = useState('')
  useEffect(() => { setDrop('') }, [route.view, route.param])
  return (
    <>
      <div className="hg-awning" aria-hidden="true" />
      <header className="hg-bar">
        <div className="hg-bar__in">
          <Link className={`hg-bar__logo${logoIn || menu ? ' is-in' : ''}`} to={home} aria-label="HEGAS, forsíða" onClick={() => setMenu(false)}><HgLogo tagline={false} /></Link>
          <nav className="hg-nav" aria-label="Aðalvalmynd" onKeyDown={(e) => { if (e.key === 'Escape') setDrop('') }}>
            {items.map((it) => it.sub ? (
              <div key={it.id} className={`hg-nav__g${drop === it.id ? ' is-open' : ''}`} onMouseLeave={() => setDrop('')}>
                <button type="button" aria-expanded={drop === it.id} aria-controls={`hg-drop-${it.id}`} aria-current={spyOf(it) ? 'true' : undefined}
                  onClick={() => setDrop(drop === it.id ? '' : it.id)} onMouseEnter={() => setDrop(it.id)}>
                  {it.label}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2.5 4.5 3.5 3.5 3.5-3.5" /></svg>
                </button>
                <div className="hg-drop" id={`hg-drop-${it.id}`} data-cols={it.sub.length > 6 ? '2' : '1'}>
                  {it.sub.map(([l, h]) => <Link key={h} to={h} onClick={() => setDrop('')} tabIndex={drop === it.id ? 0 : -1}>{l}</Link>)}
                </div>
              </div>
            ) : <Link key={it.id} to={it.to} aria-current={spyOf(it) ? 'true' : undefined}>{it.label}</Link>)}
          </nav>
          <a className="hg-shoplink" href={CONTACT.shop} target="_blank" rel="noopener">{t.shop}<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg></a>
          <button type="button" className="hg-listbtn" onClick={onList} aria-label={`${t.list}, ${n}`}>
            <span className="hg-listbtn__t">{t.list}</span>
            <span className="hg-count hg-tnum" aria-hidden="true"><span key={n}>{n}</span></span>
          </button>
          <button type="button" className="hg-burger" aria-expanded={menu} aria-controls="hg-menu" aria-label={menu ? t.close : t.menu} onClick={() => setMenu(!menu)}><i /></button>
        </div>
      </header>
      <nav id="hg-menu" className={`hg-menu${menu ? ' is-open' : ''}`} aria-label={t.menu} aria-hidden={!menu} data-lenis-prevent="">
        {[[t.products, `${home}#vorur`], [t.brands, `${home}#merki`], [t.machines, `${home}#velar`], [t.news, `${home}#frettir`], [t.staff, `${home}#starfsfolk`], [t.contact, `${home}#hafa-samband`], [t.list, path(route.lang, 'list')]].map(([l, h], i) => (
          <Link key={h} to={h} onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1}><small className="hg-tnum">{pad2(i + 1)}</small>{l}</Link>
        ))}
        <a href={CONTACT.shop} target="_blank" rel="noopener" tabIndex={menu ? 0 : -1}><small>↗</small>{t.shop}</a>
        <p className="hg-menu__c"><a href={`tel:${CONTACT.tel}`} tabIndex={menu ? 0 : -1}>{CONTACT.phone}</a><a href={`mailto:${CONTACT.sales}`} tabIndex={menu ? 0 : -1}>{CONTACT.sales}</a></p>
      </nav>
    </>
  )
}

/* ------------------------------------------------------------------ footer: their address, hours and contacts */
function Footer({ lang }: { lang: Lang }) {
  const f = T[lang].foot
  return (
    <footer className="hg-foot hg-dark">
      <div className="hg-foot__logo"><HgLogo title="HEGAS, allt fyrir tréiðnaðinn" mono /></div>
      <div className="hg-foot__grid">
        <div className="hg-foot__col">
          <h3>HEGAS ehf.</h3>
          <p>{CONTACT.street}<br />{CONTACT.town}</p>
          <p>Sími: <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></p>
        </div>
        <div className="hg-foot__col">
          <h3>Netföng</h3>
          <p>Vörur og verð: <a href={`mailto:${CONTACT.sales}`}>{CONTACT.sales}</a></p>
          <p>Almennt: <a href={`mailto:${CONTACT.general}`}>{CONTACT.general}</a></p>
        </div>
        <div className="hg-foot__col">
          <h3>Opnunartími</h3>
          {CONTACT.hours.map(([d, h]) => <p key={d}>{d}: {h}</p>)}
        </div>
        <div className="hg-foot__col">
          <h3>Vöruflokkar</h3>
          {FAMILIES.map((x) => <Link key={x.n} to={path(lang, 'family', x.slug)}>{x.is}</Link>)}
        </div>
      </div>
      <div className="hg-foot__small">
        <span>© HEGAS ehf.</span>
        <span>{f.names}</span>
        <span className="hg-foot__legal">
          <a href={f.privacy[1]} target="_blank" rel="noopener">{f.privacy[0]}</a>
          <a href={f.returns[1]} target="_blank" rel="noopener">{f.returns[0]}</a>
          <a href={CONTACT.shop} target="_blank" rel="noopener">verslun.hegas.is</a>
          <a href="https://hegas.is/" target="_blank" rel="noopener">{f.orig}</a>
        </span>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ page */
export default function HegasPage() {
  const { pathname, hash } = useLocation()
  const route = useMemo(() => parseRoute(pathname), [pathname])
  const { lang, view } = route
  const t = T[lang]
  const rootRef = useRef<HTMLDivElement>(null)
  const css = useMemo(() => hgCss(B), [])
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

  /* the demonstration list (one kitchen across the catalogue), once per browser */
  useEffect(() => { if (cat) seedOnce(cat.products, 'Dæmi: Eldhús, 4 skápar') }, [cat])

  /* title, lang, description, theme colour per route */
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const fam = view === 'family' ? familyBySlug(route.param ?? '') : undefined
    const prod = view === 'product' ? cat?.products.find((p) => p.slug === route.param) : undefined
    const brand = view === 'brand' ? cat?.products.find((p) => brandSlug(p.brand) === route.param)?.brand : undefined
    document.title =
      view === 'family' && fam ? `${fam.is} | HEGAS` :
      view === 'product' && prod ? `${prod.name} | HEGAS` :
      view === 'brand' && brand ? `${brand} | HEGAS` :
      view === 'list' ? `${t.list.h1} | HEGAS` :
      view === 'review' ? `${t.review.h1} | HEGAS` : t.title
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
    const off = initHgMotion(root, { heroDelay })
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

  /* scroll-spy for the home sections (Live-up M3, 42% line) */
  useEffect(() => {
    if (view !== 'home') return
    const ids = ['vorur', 'merki', 'velar', 'thjonusta', 'frettir', 'starfsfolk', 'sagan', 'hafa-samband']
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
     under it (Set build, Sindri 2026-09-30). One observer on the wordmark; other pages and phones (wordmark hidden) show it at once. */
  const [logoIn, setLogoIn] = useState(view !== 'home')
  useEffect(() => {
    if (view !== 'home') { setLogoIn(true); return }
    const mark = document.querySelector('.hg-hero__mark')
    if (!mark || !('IntersectionObserver' in window)) { setLogoIn(true); return }
    const io = new IntersectionObserver(([e]) => setLogoIn(!e.isIntersecting), { rootMargin: '-64px 0px 0px 0px', threshold: 0 })
    io.observe(mark)
    return () => io.disconnect()
  }, [view, pathname])

  const chromeCompany = useMemo(() => ({ ...companyEntry, english: lang === 'en' }), [lang])

  return (
    <div className="hg" lang="is">
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <link rel="preload" as="font" type="font/woff2" href={`${B}fonts/set/StrichpunktSans-Variable.woff2`} crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href={`${B}fonts/set/Switzer-Variable.woff2`} crossOrigin="" />
      <PreviewChrome company={companyEntry} />
      <a className="hg-sr hg-skip" href="#hg-main">{t.skip}</a>
      {loader !== 'off' && (
        <div className={`hg-load${loader === 'leaving' ? ' is-leaving' : ''}`} aria-hidden="true">
          <div className="hg-load__field" />
          <div className="hg-load__mark"><HgLogo draw tagline={false} /></div>
        </div>
      )}
      <Header route={route} onList={() => setDrawer(true)} menu={menu} setMenu={setMenu} spy={spy} logoIn={logoIn} />
      <div ref={rootRef} key={pathname}>
        <main id="hg-main" tabIndex={-1}>
          {view === 'home' && <Home lang={lang} ringOn={ringOn} />}
          {view === 'family' && <FamilyPage lang={lang} slug={route.param ?? ''} />}
          {view === 'product' && <ProductPage lang={lang} slug={route.param ?? ''} />}
          {view === 'brand' && <BrandPage lang={lang} slug={route.param ?? ''} />}
          {view === 'list' && <ListPage lang={lang} />}
          {view === 'review' && <ReviewPage lang={lang} />}
        </main>
        <Footer lang={lang} />
      </div>
      <ListDrawer lang={lang} open={drawer} onClose={() => setDrawer(false)} />
      <div className="hg-pf"><PreviewFooter company={{ ...chromeCompany, dark: false }} verifiedContent /></div>
    </div>
  )
}
