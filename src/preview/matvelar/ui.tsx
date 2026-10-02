import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setThemeColor } from '../../lib/preview'
import { CONTACT, FAMILIES, ROUTE, STAGES } from './data'
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
export function useDoc(title: string, description: string, color = '#000000') {
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
  <svg className={`mv-arrow ${className}`} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
)

/** text that rolls on hover: the label slides up and an identical one slides in beneath */
export const Roll = ({ children }: { children: ReactNode }) => <span className="roll"><span>{children}</span></span>

type Tone = 'signal' | 'white' | 'dark' | 'ghost' | 'slate'
export function Btn({ to, href, tone = 'signal', children, arrow, onClick, type = 'button', external }: {
  to?: string; href?: string; tone?: Tone; children: ReactNode; arrow?: boolean; onClick?: () => void; type?: 'button' | 'submit'; external?: boolean
}) {
  const cls = `mv-btn mv-btn--${tone}`
  const inner = <><Roll>{children}</Roll>{arrow && <Arrow />}</>
  if (to) return <Link className={cls} to={to} onClick={onClick}>{inner}</Link>
  if (href) return <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>
  return <button type={type} className={cls} onClick={onClick}>{inner}</button>
}

/** the M of their own logo, as a mark */
export const Mark = ({ className = '' }: { className?: string }) => (
  <svg className={`mv-mark ${className}`} viewBox="0 0 216 216" aria-hidden="true" focusable="false">
    <rect width="216" height="216" fill="currentColor" />
    <g transform="translate(108 108) scale(3.1) translate(-224.5 -318.3)">
      <path d="M212.545,339.606l5.746,0l0,-31.286l0.12,0l5.217,31.286l4.317,0l5.277,-31.286l0.12,0l0,31.286l6.945,0l0,-42.667l-10.123,0l-3.658,21.869l-0.12,0l-3.478,-21.869l-10.363,0l0,42.667Z" fill="#fff" />
    </g>
  </svg>
)

const R = (p: string) => `${ROUTE}${p}`

/* ── banner, nav and menu ──────────────────────────────────────────── */

export function Header() {
  const [banner, setBanner] = useState(() => { try { return sessionStorage.getItem('mv-banner') !== 'closed' } catch { return true } })
  const [stuck, setStuck] = useState(false)
  const [menu, setMenu] = useState(false)
  const [drop, setDrop] = useState(false)
  const loc = useLocation()
  const list = useList()
  const dropRef = useRef<HTMLLIElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

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

  const closeBanner = () => { setBanner(false); try { sessionStorage.setItem('mv-banner', 'closed') } catch { /* ignore */ } }
  const hoverOpen = (v: boolean) => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setDrop(v) }

  return (
    <header className={`mv-top${stuck ? ' is-stuck' : ''}${menu ? ' is-menu' : ''}`}>
      {banner && (
        <div className="mv-banner" role="region" aria-label="Bilun í vél">
          <p>
            <span className="mv-banner__lead">Bilun í vél?</span>{' '}
            <a href={CONTACT.phoneHref}>Páll í Matvélum <b>{CONTACT.phone}</b></a>
            <span className="mv-banner__more"> · <a href={CONTACT.kappHref}>Rúnar í KAPP <b>{CONTACT.kapp}</b></a> · <Link to={R('/thjonusta')}>Þjónustubeiðni <Arrow /></Link></span>
          </p>
          <button type="button" className="mv-banner__x" onClick={closeBanner} aria-label="Loka borðanum">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
          </button>
        </div>
      )}
      <nav className="mv-nav" aria-label="Aðalvalmynd">
        <Link className="mv-nav__brand" to={ROUTE} aria-label="Matvélar og umbúðir, forsíða">
          <Mark /><span>Matvélar<span className="mv-nav__sub"> og umbúðir</span></span>
        </Link>
        <ul className="mv-nav__list">
          <li ref={dropRef} className="mv-nav__drop" onMouseEnter={() => hoverOpen(true)} onMouseLeave={() => hoverOpen(false)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDrop(false) }}>
            <button type="button" aria-expanded={drop} aria-controls="mv-drop" onClick={() => (window.matchMedia('(hover: hover) and (pointer: fine)').matches ? setDrop(true) : setDrop((v) => !v))}>
              <Roll>Vélar</Roll>
              <svg className="mv-caret" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
            <div className="mv-drop" id="mv-drop" hidden={!drop}>
              <div className="mv-drop__cols">
                {STAGES.filter((s) => s.families.length).map((s) => (
                  <div key={s.id}>
                    <p className="mono">{s.n} {s.name}</p>
                    <ul>{s.families.map((f) => { const fam = FAMILIES.find((x) => x.slug === f)!; return <li key={f}><Link to={R(`/velar/${f}`)}>{fam.name}</Link></li> })}</ul>
                  </div>
                ))}
              </div>
              <Link className="mv-drop__all" to={R('/velar')}>Allar vélar og birgjar <Arrow /></Link>
            </div>
          </li>
          <li><Link to={R('/thjonusta')}><Roll>Þjónusta</Roll></Link></li>
          <li><Link to={`${R('')}#um-okkur`}><Roll>Um okkur</Roll></Link></li>
        </ul>
        <a className="mv-nav__tel" href={CONTACT.phoneHref}><span className="mono">Sími</span> {CONTACT.phone}</a>
        <Link className="mv-btn mv-btn--signal mv-nav__cta" to={R('/fyrirspurn')}>
          <Roll>Senda fyrirspurn</Roll>{list.items.length > 0 && <span className="mv-count" aria-label={`${list.items.length} á lista`}>{list.items.length}</span>}
        </Link>
        <button type="button" className="mv-burger" aria-expanded={menu} aria-controls="mv-menu" aria-label={menu ? 'Loka valmynd' : 'Opna valmynd'} onClick={() => setMenu((v) => !v)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className="mv-menu" id="mv-menu" hidden={!menu} role="dialog" aria-modal="true" aria-label="Valmynd">
        <div className="mv-menu__in">
          <button type="button" className="mv-menu__close" ref={closeRef} onClick={() => setMenu(false)}>Loka</button>
          <ul className="mv-menu__list">
            <li>
              <p className="mono">01 Vélar</p>
              <ul className="mv-menu__sub">
                {FAMILIES.map((f) => <li key={f.slug}><Link to={R(`/velar/${f.slug}`)}>{f.name}</Link></li>)}
                <li><Link to={R('/velar')}>Allar vélar og birgjar</Link></li>
              </ul>
            </li>
            <li><p className="mono">02 Þjónusta</p><Link to={R('/thjonusta')}>Þjónusta og varahlutir</Link></li>
            <li><p className="mono">03 Fyrirtækið</p><Link to={`${R('')}#um-okkur`}>Um okkur</Link></li>
            <li><p className="mono">04 Fyrirspurn</p><Link to={R('/fyrirspurn')}>Senda fyrirspurn{list.items.length > 0 ? ` (${list.items.length})` : ''}</Link></li>
          </ul>
          <div className="mv-menu__foot">
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
      <button type="button" className="mv-dock" onClick={() => list.setOpen(true)} aria-haspopup="dialog" aria-expanded={list.open}>
        <span className="mono">Fyrirspurnalisti</span><span className="mv-count">{list.items.length}</span>
      </button>
      {list.open && (
        <div className="mv-drawer" role="dialog" aria-modal="true" aria-label="Fyrirspurnalisti">
          <button type="button" className="mv-drawer__veil" aria-label="Loka lista" tabIndex={-1} onClick={() => list.setOpen(false)} />
          <div className="mv-drawer__panel" ref={panel}>
            <div className="mv-drawer__head">
              <h2>Fyrirspurnalisti</h2>
              <button type="button" onClick={() => list.setOpen(false)}>Loka</button>
            </div>
            {list.items.length ? (
              <ul className="mv-drawer__list">
                {list.items.map((i) => (
                  <li key={i.id}>
                    {i.href ? <Link to={i.href} onClick={() => list.setOpen(false)}>{i.label}</Link> : <span>{i.label}</span>}
                    <button type="button" onClick={() => list.remove(i.id)} aria-label={`Taka ${i.label} af listanum`}>Fjarlægja</button>
                  </li>
                ))}
              </ul>
            ) : <p className="mv-drawer__empty">Listinn er tómur.</p>}
            <div className="mv-drawer__foot">
              <Btn tone="signal" arrow onClick={() => { list.setOpen(false); nav(R('/fyrirspurn')) }}>Halda áfram í fyrirspurn</Btn>
              {list.items.length > 0 && <button type="button" className="mv-link" onClick={() => list.clear()}>Tæma listann</button>}
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
    <footer className="mv-foot">
      <div className="mv-wrap mv-foot__grid">
        <div className="mv-foot__logo"><img src={`${B}matvelar/logo.svg`} alt="Matvélar" width="216" height="216" /></div>
        <nav className="mv-foot__cols" aria-label="Neðri valmynd">
          <div>
            <p className="mono">Vélar</p>
            <ul>{FAMILIES.map((f) => <li key={f.slug}><Link to={R(`/velar/${f.slug}`)}>{f.name}</Link></li>)}<li><Link to={R('/velar')}>Birgjar</Link></li></ul>
          </div>
          <div>
            <p className="mono">Þjónusta</p>
            <ul>
              <li><Link to={R('/thjonusta')}>Þjónustubeiðni</Link></li>
              <li><Link to={R('/fyrirspurn')}>Ný vél eða ráðgjöf</Link></li>
              <li><a href={CONTACT.phoneHref}>Páll í Matvélum {CONTACT.phone}</a></li>
              <li><a href={CONTACT.kappHref}>Rúnar í KAPP {CONTACT.kapp}</a></li>
            </ul>
          </div>
          <div>
            <p className="mono">Fyrirtækið</p>
            <ul>
              <li><Link to={`${R('')}#um-okkur`}>Um okkur</Link></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li>{CONTACT.address}<br />{CONTACT.postcode}</li>
            </ul>
          </div>
        </nav>
      </div>
      <p className="mv-wrap mv-foot__legal mono">{CONTACT.name} · kt. {CONTACT.kt} · VSK-númer {CONTACT.vsk}</p>
    </footer>
  )
}

/** the page frame: skip link, header, main, footer, list dock */
export function Frame({ children }: { children: ReactNode }) {
  useArrive()
  return (
    <>
      <a className="mv-skip" href="#main">Fara beint í efnið</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ListDock />
    </>
  )
}

export const to = R
