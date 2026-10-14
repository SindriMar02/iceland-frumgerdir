import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setThemeColor } from '../../lib/preview'
import { CONTACT, FAMILIES, GROUP, ON_CALL, ROUTE, SECTORS, SHOP, SHOP_LOGIN } from './data'
import { reducedMotion } from './motion'
import { useList } from './store'

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
export function useDoc(title: string, description: string, color = '#284195') {
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
  <svg className={`sh-arrow ${className}`} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
)

/** text that rolls on hover: the label slides up and an identical one slides in beneath */
export const Roll = ({ children }: { children: ReactNode }) => <span className="roll"><span>{children}</span></span>

type Tone = 'blue' | 'white' | 'ink' | 'ghost' | 'onblue'
export function Btn({ to, href, tone = 'blue', children, arrow, onClick, type = 'button', external }: {
  to?: string; href?: string; tone?: Tone; children: ReactNode; arrow?: boolean; onClick?: () => void; type?: 'button' | 'submit'; external?: boolean
}) {
  const cls = `sh-btn sh-btn--${tone}`
  const inner = <><Roll>{children}</Roll>{arrow && <Arrow />}</>
  if (to) return <Link className={cls} to={to} onClick={onClick}>{inner}</Link>
  if (href) return <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}{external && <span className="sh-sr"> (opnast í nýjum glugga)</span>}</a>
  return <button type={type} className={cls} onClick={onClick}>{inner}</button>
}

/** their own mark: four squares, two of them with the quarter-circle bite (logo-samhentir.svg) */
export const Mark = ({ className = '' }: { className?: string }) => (
  <svg className={`sh-mark ${className}`} viewBox="0 0 50 50" aria-hidden="true" focusable="false">
    <path d="M50 0H26.48v23.37H50z" fill="currentColor" />
    <path d="M26.63 50H50V26.37C37.6 27.14 27.39 37.35 26.63 50z" fill="currentColor" />
    <path d="M23.63 26.37H0V50h23.63z" fill="currentColor" />
    <path d="M23.48 0H0v23.22C12.65 22.61 22.87 12.24 23.48 0z" fill="currentColor" />
  </svg>
)

const R = (p: string) => `${ROUTE}${p}`

/* ── banner, nav and menu ──────────────────────────────────────────── */

export function Header() {
  const [banner, setBanner] = useState(() => { try { return sessionStorage.getItem('sh-banner') !== 'closed' } catch { return true } })
  const [stuck, setStuck] = useState(false)
  const [menu, setMenu] = useState(false)
  const [drop, setDrop] = useState(false)
  const loc = useLocation()
  const list = useList()
  const dropRef = useRef<HTMLLIElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
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
    if (menu) closeRef.current?.focus()
    return () => { document.documentElement.style.overflow = '' }
  }, [menu])
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); setDrop(false) } }
    const out = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDrop(false) }
    document.addEventListener('keydown', key); document.addEventListener('mousedown', out)
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('mousedown', out) }
  }, [])

  const closeBanner = () => { setBanner(false); try { sessionStorage.setItem('sh-banner', 'closed') } catch { /* ignore */ } }
  const hoverOpen = (v: boolean) => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setDrop(v) }

  return (
    <header ref={topRef} className={`sh-top${stuck ? ' is-stuck' : ''}${menu ? ' is-menu' : ''}`}>
      {banner && (
        <div className="sh-banner" ref={bannerRef} role="region" aria-label="Vél stopp" {...(stuck ? ({ inert: "" } as Record<string, string>) : {})}>
          <p>
            <span className="sh-banner__lead">Vél stopp utan opnunartíma?</span>{' '}
            <a href={ON_CALL[0].href}>{ON_CALL[0].name.split(' ')[0]} <b>{ON_CALL[0].phone}</b></a>
            <span className="sh-banner__more"> · <a href={ON_CALL[1].href}>{ON_CALL[1].name.split(' ')[0]} <b>{ON_CALL[1].phone}</b></a> · <Link to={R('/thjonusta')}>Þjónustubeiðni <Arrow /></Link></span>
          </p>
          <button type="button" className="sh-banner__x" onClick={closeBanner} aria-label="Loka borðanum">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
          </button>
        </div>
      )}
      <nav className="sh-nav" aria-label="Aðalvalmynd">
        <Link className="sh-nav__brand" to={ROUTE} aria-label="Samhentir, forsíða">
          <Mark /><span>Samhentir</span>
        </Link>
        <ul className="sh-nav__list">
          <li ref={dropRef} className="sh-nav__drop" onMouseEnter={() => hoverOpen(true)} onMouseLeave={() => hoverOpen(false)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDrop(false) }}>
            <button type="button" aria-expanded={drop} aria-controls="sh-drop" onClick={() => (window.matchMedia('(hover: hover) and (pointer: fine)').matches ? setDrop(true) : setDrop((v) => !v))}>
              <Roll>Lausnir</Roll>
              <svg className="sh-caret" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
            <div className="sh-drop" id="sh-drop" hidden={!drop}>
              <div className="sh-drop__cols">
                <div>
                  <p className="mono">Atvinnugreinar</p>
                  <ul className="sh-drop__two">{SECTORS.map((s) => <li key={s.slug}><Link to={R(`/atvinnugreinar/${s.slug}`)}>{s.name}</Link></li>)}</ul>
                </div>
                <div>
                  <p className="mono">Þjónusta</p>
                  <ul>
                    <li><Link to={R('/velar')}>Vélar og búnaður</Link></li>
                    <li><Link to={R('/merkingar')}>Merkingar og límmiðar</Link></li>
                    <li><Link to={`${R('')}#honnun`}>Ráðgjöf og hönnun</Link></li>
                    <li><Link to={R('/thjonusta')}>Viðgerðir og varahlutir</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li><Link to={R('/velar')}><Roll>Vélar</Roll></Link></li>
          <li><Link to={`${R('')}#samstaedan`}><Roll>Fyrirtækin</Roll></Link></li>
          <li><a href={SHOP} target="_blank" rel="noopener noreferrer"><Roll>Vefverslun</Roll><span className="sh-sr"> (opnast í nýjum glugga)</span></a></li>
        </ul>
        <Link className="sh-btn sh-btn--blue sh-nav__cta" to={R('/fyrirspurn')}>
          <Roll>Senda fyrirspurn</Roll>{list.items.length > 0 && <span className="sh-count" aria-label={`${list.items.length} á lista`}>{list.items.length}</span>}
        </Link>
        <button type="button" className="sh-burger" aria-expanded={menu} aria-controls="sh-menu" aria-label={menu ? 'Loka valmynd' : 'Opna valmynd'} onClick={() => setMenu((v) => !v)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className="sh-menu" id="sh-menu" hidden={!menu} role="dialog" aria-modal="true" aria-label="Valmynd">
        <div className="sh-menu__in">
          <button type="button" className="sh-menu__close" ref={closeRef} onClick={() => setMenu(false)}>Loka</button>
          <ul className="sh-menu__list">
            <li>
              <p className="mono">Atvinnugreinar</p>
              <ul className="sh-menu__sub sh-menu__sub--two">
                {SECTORS.map((s) => <li key={s.slug}><Link to={R(`/atvinnugreinar/${s.slug}`)}>{s.name}</Link></li>)}
              </ul>
            </li>
            <li>
              <p className="mono">Þjónusta</p>
              <ul className="sh-menu__sub">
                <li><Link to={R('/velar')}>Vélar og búnaður</Link></li>
                <li><Link to={R('/merkingar')}>Merkingar og límmiðar</Link></li>
                <li><Link to={R('/thjonusta')}>Viðgerðir og varahlutir</Link></li>
                <li><Link to={`${R('')}#honnun`}>Ráðgjöf og hönnun</Link></li>
              </ul>
            </li>
            <li><Link to={`${R('')}#samstaedan`}>Fyrirtækin</Link></li>
            <li><Link to={R('/fyrirspurn')}>Senda fyrirspurn{list.items.length > 0 ? ` (${list.items.length})` : ''}</Link></li>
            <li><a href={SHOP} target="_blank" rel="noopener noreferrer">Vefverslun<span className="sh-sr"> (opnast í nýjum glugga)</span></a></li>
          </ul>
          <div className="sh-menu__foot">
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <span>{CONTACT.address}, {CONTACT.postcode}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ── the enquiry list: a button, and a drawer ─────────────────────── */

export function ListDock() {
  const list = useList()
  const nav = useNavigate()
  const panel = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!list.open) return
    opener.current = document.activeElement as HTMLElement
    panel.current?.querySelector<HTMLElement>('button, a')?.focus()
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') list.setOpen(false) }
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('keydown', key); opener.current?.focus?.() }
  }, [list.open, list])

  if (!list.items.length && !list.open) return null
  return (
    <>
      <button type="button" className="sh-dock" onClick={() => list.setOpen(true)} aria-haspopup="dialog" aria-expanded={list.open}>
        <span className="mono">Fyrirspurnalisti</span><span className="sh-count">{list.items.length}</span>
      </button>
      {list.open && (
        <div className="sh-drawer" role="dialog" aria-modal="true" aria-label="Fyrirspurnalisti">
          <button type="button" className="sh-drawer__veil" aria-label="Loka lista" tabIndex={-1} onClick={() => list.setOpen(false)} />
          <div className="sh-drawer__panel" ref={panel}>
            <div className="sh-drawer__head">
              <h2>Fyrirspurnalisti</h2>
              <button type="button" onClick={() => list.setOpen(false)}>Loka</button>
            </div>
            {list.items.length ? (
              <ul className="sh-drawer__list">
                {list.items.map((i) => (
                  <li key={i.id}>
                    {i.href ? <Link to={i.href} onClick={() => list.setOpen(false)}>{i.label}</Link> : <span>{i.label}</span>}
                    <button type="button" onClick={() => list.remove(i.id)} aria-label={`Taka ${i.label} af listanum`}>Fjarlægja</button>
                  </li>
                ))}
              </ul>
            ) : <p className="sh-drawer__empty">Listinn er tómur. Bættu vélum eða vörum á hann á síðunum Vélar og Atvinnugreinar.</p>}
            <div className="sh-drawer__foot">
              <Btn tone="blue" arrow onClick={() => { list.setOpen(false); nav(R('/fyrirspurn')) }}>Halda áfram í fyrirspurn</Btn>
              {list.items.length > 0 && <button type="button" className="sh-link" onClick={() => { if (window.confirm('Tæma fyrirspurnalistann?')) list.clear() }}>Tæma listann</button>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ── footer ───────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer className="sh-foot">
      <div className="sh-wrap sh-foot__grid">
        <div className="sh-foot__brand">
          <Mark />
          <p className="sh-foot__name">Samhentir</p>
          <p className="sh-foot__hours">{CONTACT.hours}</p>
        </div>
        <nav className="sh-foot__cols" aria-label="Neðri valmynd">
          <div>
            <p className="mono">Lausnir</p>
            <ul>{SECTORS.map((s) => <li key={s.slug}><Link to={R(`/atvinnugreinar/${s.slug}`)}>{s.name}</Link></li>)}</ul>
          </div>
          <div>
            <p className="mono">Vélar og þjónusta</p>
            <ul>
              {FAMILIES.slice(0, 6).map((f) => <li key={f.slug}><Link to={R(`/velar/${f.slug}`)}>{f.name}</Link></li>)}
              <li><Link to={R('/thjonusta')}>Þjónustubeiðni</Link></li>
              <li><Link to={R('/merkingar')}>Merkingar</Link></li>
            </ul>
          </div>
          <div>
            <p className="mono">Fyrirtækin</p>
            <ul>
              {GROUP.map((g) => <li key={g.id}><a href={g.phoneHref}>{g.name} {g.phone}</a></li>)}
              <li><a href={SHOP_LOGIN} target="_blank" rel="noopener noreferrer">Mínar síður<span className="sh-sr"> (opnast í nýjum glugga)</span></a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <p className="sh-wrap sh-foot__legal mono">{CONTACT.name} · kt. {CONTACT.kt} · {CONTACT.address}, {CONTACT.postcode}</p>
    </footer>
  )
}

/** the page frame: skip link, header, main, footer, list dock */
export function Frame({ children }: { children: ReactNode }) {
  useArrive()
  return (
    <>
      <a className="sh-skip" href="#main">Fara beint í efnið</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ListDock />
    </>
  )
}

export const to = R
