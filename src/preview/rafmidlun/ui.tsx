import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { setThemeColor } from '../../lib/preview'
import { CONTACT, LOGO, ROUTE, SERVICES } from './data'
import { reducedMotion } from './motion'

export const B = import.meta.env.BASE_URL

export function useReducedMotion() {
  const [r, setR] = useState(reducedMotion)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setR(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return r
}

/** a live media query */
export function useMedia(query: string) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const q = window.matchMedia(query)
    const f = () => setM(q.matches)
    f()
    q.addEventListener('change', f)
    return () => q.removeEventListener('change', f)
  }, [query])
  return m
}

/** title, description and language for one route, restored on the way out */
export function useDoc(title: string, description: string, color = '#004d91') {
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    document.title = title
    document.documentElement.lang = 'is'
    meta?.setAttribute('content', description)
    setThemeColor(color)
    return () => {
      document.title = prevTitle
      document.documentElement.lang = prevLang
      meta?.setAttribute('content', prevDesc)
    }
  }, [title, description, color])
}

/** a route change starts at the top, unless it names a section */
export function useArrive() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return }
    const id = window.setTimeout(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start', behavior: 'auto' }), 80)
    return () => window.clearTimeout(id)
  }, [pathname, hash])
}

export const Arrow = ({ className = '' }: { className?: string }) => (
  <svg className={`rm-arrow ${className}`} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
)

/** text that rolls on hover: the label slides up and an identical one slides in beneath */
export const Roll = ({ children }: { children: ReactNode }) => <span className="roll"><span>{children}</span></span>

type Tone = 'blue' | 'white' | 'ink' | 'ghost' | 'onblue'
export function Btn({ to, href, tone = 'blue', children, arrow, onClick, type = 'button', external }: {
  to?: string; href?: string; tone?: Tone; children: ReactNode; arrow?: boolean; onClick?: () => void; type?: 'button' | 'submit'; external?: boolean
}) {
  const cls = `rm-btn rm-btn--${tone}`
  const inner = <><Roll>{children}</Roll>{arrow && <Arrow />}</>
  if (to) return <Link className={cls} to={to} onClick={onClick}>{inner}</Link>
  if (href) return <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}{external && <span className="rm-sr"> (opnast í nýjum glugga)</span>}</a>
  return <button type={type} className={cls} onClick={onClick}>{inner}</button>
}

/** the oval of their logo with the three conductors through it, drawn (the divider and small marks) */
export const Oval = ({ className = '' }: { className?: string }) => (
  <svg className={`rm-oval ${className}`} viewBox="0 0 240 40" aria-hidden="true" focusable="false">
    <g stroke="currentColor" strokeWidth="1.6">
      <path d="M0 13.5h240M0 20h240M0 26.5h240" />
    </g>
    <ellipse cx="120" cy="20" rx="58" ry="17" fill="currentColor" />
    <ellipse cx="120" cy="20" rx="54.5" ry="13.8" fill="none" stroke="#fff" strokeWidth="1.4" />
  </svg>
)

/** their logo, as sent (the PNG from rafmidlun.is) */
export const Logo = ({ className = '' }: { className?: string }) => (
  <img className={`rm-logo ${className}`} src={LOGO.src} alt={LOGO.alt} width={LOGO.w} height={LOGO.h} decoding="async" />
)

const R = (p: string) => `${ROUTE}${p}`

/** open a panel the way focus-guard asks: a tap focuses the panel itself, the keyboard focuses its first item */
const focusOpen = (viaKey: boolean, panel: HTMLElement | null) => {
  if (!panel) return
  const first = [...panel.querySelectorAll<HTMLElement>('a, button')].find((el) => el.offsetParent !== null)
  ;(viaKey && first ? first : panel).focus({ preventScroll: true })
}

/* ── banner, nav and menu ──────────────────────────────────────────── */

export function Header() {
  const [banner, setBanner] = useState(() => { try { return sessionStorage.getItem('rm-banner') !== 'closed' } catch { return true } })
  const [stuck, setStuck] = useState(false)
  const [menu, setMenu] = useState(false)
  const [drop, setDrop] = useState(false)
  const loc = useLocation()
  const dropRef = useRef<HTMLLIElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const viaKey = useRef(false)
  const topRef = useRef<HTMLElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)

  /* the bar follows the banner up by the banner's own height (it wraps on phones), so the collapse is a transform, never a reflow */
  useEffect(() => {
    const top = topRef.current, b = bannerRef.current
    if (!top) return
    if (!b) { top.style.setProperty('--bh', '0px'); return }
    const set = () => top.style.setProperty('--bh', `${b.offsetHeight}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(b)
    return () => ro.disconnect()
  }, [banner])

  useEffect(() => {
    const on = () => setStuck(window.scrollY > 90)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { setMenu(false); setDrop(false) }, [loc.pathname, loc.hash])
  useEffect(() => {
    document.documentElement.style.overflow = menu ? 'hidden' : ''
    if (menu) focusOpen(viaKey.current, menuRef.current)
    return () => { document.documentElement.style.overflow = '' }
  }, [menu])
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setDrop(false)
      setMenu((m) => { if (m) burgerRef.current?.focus(); return false })
    }
    const out = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDrop(false) }
    document.addEventListener('keydown', key); document.addEventListener('mousedown', out)
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('mousedown', out) }
  }, [])

  const closeBanner = () => { setBanner(false); try { sessionStorage.setItem('rm-banner', 'closed') } catch { /* ignore */ } }
  const hoverOpen = (v: boolean) => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setDrop(v) }
  const openMenu = (e: ReactMouseEvent) => { viaKey.current = e.detail === 0; setMenu((v) => !v) }

  return (
    <header ref={topRef} className={`rm-top${stuck ? ' is-stuck' : ''}${menu ? ' is-menu' : ''}`}>
      {banner && (
        <div className="rm-banner" ref={bannerRef} role="region" aria-label="Stóreldhústæki" {...(stuck ? ({ inert: '' } as Record<string, string>) : {})}>
          <p>
            <span className="rm-banner__lead">Bilun í stóreldhústæki?</span>{' '}
            <a href={CONTACT.kitchenHref}>Sími <b>{CONTACT.kitchenPhone}</b></a>
            <span className="rm-banner__more"> · <Link to={`${R('/verkbeidni')}?leid=eldhus`}>Viðgerðarbeiðni <Arrow /></Link></span>
          </p>
          <button type="button" className="rm-banner__x" onClick={closeBanner} aria-label="Loka borðanum">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
          </button>
        </div>
      )}
      <nav className="rm-nav" aria-label="Aðalvalmynd">
        <Link className="rm-nav__brand" to={ROUTE} aria-label="Rafmiðlun, forsíða">
          <Logo />
        </Link>
        <ul className="rm-nav__list">
          <li ref={dropRef} className="rm-nav__drop" onMouseEnter={() => hoverOpen(true)} onMouseLeave={() => hoverOpen(false)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDrop(false) }}>
            <button type="button" aria-expanded={drop} aria-controls="rm-drop" onClick={() => (window.matchMedia('(hover: hover) and (pointer: fine)').matches ? setDrop(true) : setDrop((v) => !v))}>
              <Roll>Þjónusta</Roll>
              <svg className="rm-caret" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
            <div className="rm-drop" id="rm-drop" hidden={!drop}>
              <ul className="rm-drop__list">
                {SERVICES.map((s) => <li key={s.slug}><Link to={R(`/thjonusta/${s.slug}`)}><strong>{s.name}</strong><span>{s.blurb}</span></Link></li>)}
              </ul>
            </div>
          </li>
          <li><Link to={`${R('')}#linan`}><Roll>Heildarlausnir</Roll></Link></li>
          <li><Link to={R('/starfsfolk')}><Roll>Starfsfólk</Roll></Link></li>
          <li><Link to={R('/hafa-samband')}><Roll>Hafa samband</Roll></Link></li>
        </ul>
        <Link className="rm-btn rm-btn--blue rm-nav__cta" to={R('/verkbeidni')}><Roll>Verkbeiðni</Roll></Link>
        <button type="button" ref={burgerRef} className="rm-burger" aria-expanded={menu} aria-controls="rm-menu" aria-label={menu ? 'Loka valmynd' : 'Opna valmynd'} onClick={openMenu}>
          <span /><span /><span />
        </button>
      </nav>

      <div className="rm-menu" id="rm-menu" ref={menuRef} tabIndex={-1} hidden={!menu} role="dialog" aria-modal="true" aria-label="Valmynd">
        <div className="rm-menu__in">
          <button type="button" className="rm-menu__close" onClick={() => { setMenu(false); burgerRef.current?.focus() }}>Loka</button>
          <ul className="rm-menu__list">
            <li>
              <p className="mono">Þjónusta</p>
              <ul className="rm-menu__sub">
                {SERVICES.map((s) => <li key={s.slug}><Link to={R(`/thjonusta/${s.slug}`)}>{s.name}</Link></li>)}
              </ul>
            </li>
            <li><Link to={`${R('')}#linan`}>Heildarlausnir</Link></li>
            <li><Link to={R('/starfsfolk')}>Starfsfólk</Link></li>
            <li><Link to={R('/hafa-samband')}>Hafa samband</Link></li>
            <li><Link to={R('/verkbeidni')}>Verkbeiðni</Link></li>
          </ul>
          <div className="rm-menu__foot">
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <span>{CONTACT.address}, {CONTACT.postcode}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ── footer ───────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer className="rm-foot">
      <div className="rm-wrap rm-foot__grid">
        <div className="rm-foot__brand">
          <span className="rm-foot__chip"><Logo /></span>
          <dl className="rm-foot__hours">
            {CONTACT.hours.map((h) => <div key={h.d}><dt>{h.d}</dt><dd>{h.t}</dd></div>)}
          </dl>
        </div>
        <nav className="rm-foot__cols" aria-label="Neðri valmynd">
          <div>
            <p className="mono">Þjónusta</p>
            <ul>{SERVICES.map((s) => <li key={s.slug}><Link to={R(`/thjonusta/${s.slug}`)}>{s.name}</Link></li>)}</ul>
          </div>
          <div>
            <p className="mono">Fyrirtækið</p>
            <ul>
              <li><Link to={R('/starfsfolk')}>Starfsfólk</Link></li>
              <li><Link to={R('/jafnlaunastefna')}>Jafnlaunastefna</Link></li>
              <li><Link to={`${R('/verkbeidni')}?leid=umsokn`}>Starfsumsókn</Link></li>
              <li><Link to={R('/hafa-samband')}>Hafa samband</Link></li>
            </ul>
          </div>
          <div>
            <p className="mono">Samband</p>
            <ul>
              <li><a href={CONTACT.phoneHref}>Skrifstofa {CONTACT.phone}</a></li>
              <li><a href={CONTACT.kitchenHref}>Stóreldhústæki {CONTACT.kitchenPhone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><a href={`mailto:${CONTACT.service}`}>{CONTACT.service}</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <p className="rm-wrap rm-foot__legal mono">{CONTACT.name} · kt. {CONTACT.kt} · {CONTACT.address}, {CONTACT.postcode}</p>
    </footer>
  )
}

/** the page frame: skip link, header, main, footer */
export function Frame({ children }: { children: ReactNode }) {
  useArrive()
  return (
    <>
      <a className="rm-skip" href="#main">Fara beint í efnið</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}

export const to = R
