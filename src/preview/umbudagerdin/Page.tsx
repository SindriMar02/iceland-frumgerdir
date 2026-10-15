import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useNavigationType, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Mail, MessageCircle, Minus, Phone, Plus, ShoppingBag, SlidersHorizontal, Trash2, X, Menu } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { SndrBadge } from '../SndrBadge'
import { setMetaDescription, setNoindex, setThemeColor } from '../../lib/preview'
import {
  A, BOX_CATS, COLOURS, CONTACT, FAQ, FLUTES, JSON_LD, PHOTOS, PRODUCTS, REQ_LABEL, RHYTHMS, ROUTE, SAMPLE_NOTE, SAMPLE_REQUESTS, SHOP_CATS, SHOP_TOTAL, STYLES, TIERS, TIER_NOTE,
  catLabel, findFits, allFits, MAX_SLACK, kr, loadRequests, mm, productBySlug, routeTo, saveRequest, tierFor, vorur,
  type ColourKey, type FluteKey, type Photo, type Product, type ReqKind, type Request, type StyleKey,
} from './data'
import { STARTERS, clearList, lineTotal, listCount, listTotals, loadStarter, setQty, toggle, useList } from './store'
import { answer, CHIPS, GREETING } from './chat'
import { BROWN, CSS } from './styles'

/*
 * Umbúðagerðin: "Hjá okkur er það stærðin sem skiptir mestu." The Víkurverk round-3 engine
 * (Lightship framing, Mammut shop, Pebble chooser) re-aimed at a corrugated-box factory with a
 * WooCommerce shop. The signature is Kassamál: three measurements redraw the FEFCO 0201 box to
 * scale and list the stock boxes that fit, or become a custom-box request. The shop keeps your
 * place (list state in the URL, scroll restored on Back), shows the SKU on every product, pages
 * with real links, and carries the bulk-tier mechanism their site already owns. DESIGN.md beside.
 *
 * Motion budget (the engine's): one opening per page, reveals that play once, hover feedback,
 * the drawing re-measures with one transition. No pinning, no scrubbed parallax, no lens.
 */

gsap.registerPlugin(ScrollTrigger, CustomEase)
CustomEase.create('ugSmooth', 'M0,0 C0.38,0 0.215,1 1,1')

const company = getPreviewCompany('umbudagerdin')
let pageLenis: Lenis | null = null
let firstLoad = true
const isTouch = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const to = (p = '') => (p ? `${ROUTE}/${p}` : ROUTE)
const mailHref = (e: string) => `mailto:${e}`
const ADDED = 'ug-added'
const SHOP_KEY = 'ug-shop-pos'
const PAGE_SIZE = 24
const LOADER_MS = 1500

/* scroll memory: one position per history entry (location.key), so Back and Forward land exactly where you were */
const POS_KEY = 'ug-scroll-v1'
const readPos = (k: string): number | undefined => { try { const m = JSON.parse(sessionStorage.getItem(POS_KEY) ?? '{}') as Record<string, number>; return m[k] } catch { return undefined } }
const writePos = (k: string, y: number) => { try { const m = JSON.parse(sessionStorage.getItem(POS_KEY) ?? '{}') as Record<string, number>; m[k] = y; const keys = Object.keys(m); if (keys.length > 60) keys.slice(0, keys.length - 60).forEach((x) => delete m[x]); sessionStorage.setItem(POS_KEY, JSON.stringify(m)) } catch { /* private mode */ } }
const jumpTo = (y: number) => { if (pageLenis) pageLenis.scrollTo(y, { immediate: true, force: true }); window.scrollTo(0, y) }

function goTo(id: string) {
  const t = document.getElementById(id)
  if (!t) return
  if (pageLenis) { pageLenis.resize(); pageLenis.scrollTo(t, { offset: -90 }) }
  else t.scrollIntoView({ behavior: still() ? 'auto' : 'smooth', block: 'start' })
}

/* ── small parts ────────────────────────────────────────────────────────── */

function Pic({ p, sizes, eager, className, pos }: { p: Photo; sizes: string; eager?: boolean; className?: string; pos?: string }) {
  return (
    <img className={className} src={p.src} srcSet={p.srcSet} sizes={sizes} alt={p.alt} width={p.w} height={p.h}
      style={pos ? { objectPosition: pos } : undefined}
      loading={eager ? 'eager' : 'lazy'} decoding={eager ? 'sync' : 'async'} {...(eager ? { fetchpriority: 'high' } : {})} />
  )
}

type Tone = '' | 'white' | 'red' | 'grey' | 'sand' | 'line' | 'glass'
function Btn({ to: path, href, label, tone = '', size = '', icon, onClick, ext, type, className = '', disabled }: {
  to?: string; href?: string; label: string; tone?: Tone; size?: '' | 'lg' | 'sm'; icon?: ReactNode; onClick?: () => void; ext?: boolean; type?: 'submit' | 'button'; className?: string; disabled?: boolean
}) {
  const inner = (<><span className="lbl"><span>{label}</span><span aria-hidden="true">{label}</span></span>{icon}</>)
  const cls = `btn ${tone} ${size} ${className}`.replace(/\s+/g, ' ').trim()
  if (path !== undefined) return <Link className={cls} to={to(path)} onClick={onClick}>{inner}</Link>
  if (href) return <a className={cls} href={href} {...(ext ? { target: '_blank', rel: 'noopener' } : {})} onClick={onClick}>{inner}</a>
  return <button className={cls} type={type ?? 'button'} onClick={onClick} disabled={disabled}>{inner}</button>
}

function Lines({ lines }: { lines: ReactNode[] }) {
  return <>{lines.map((l, i) => <span key={i} className="lm"><span data-line="">{l}</span></span>)}</>
}

const ARROW = <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />

function Rail({ children, label, className = '', cw, pr }: { children: ReactNode[]; label: string; className?: string; cw?: string; pr?: boolean }) {
  const ref = useRef<HTMLUListElement>(null)
  const [at, setAt] = useState(0)
  const [end, setEnd] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const on = () => {
      const first = el.children[0] as HTMLElement | undefined
      const step = first ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : 1
      setAt(Math.round(el.scrollLeft / step))
      setEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
    }
    on()
    el.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { el.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
  const go = (d: number) => {
    const el = ref.current
    if (!el) return
    const first = el.children[0] as HTMLElement | undefined
    const step = first ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : el.clientWidth
    el.scrollBy({ left: d * step, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className={className}>
      <ul ref={ref} className={`rail${pr ? ' pr' : ''}`} role="list" aria-label={label} style={cw ? ({ '--cw': cw } as CSSProperties) : undefined}>
        {children.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
      <div className="rail-ft">
        <button type="button" className="ibtn" onClick={() => go(-1)} disabled={at === 0} aria-label={`Fyrri, ${label}`}><ArrowLeft size={15} aria-hidden="true" /></button>
        <button type="button" className="ibtn" onClick={() => go(1)} disabled={end} aria-label={`Næsta, ${label}`}><ArrowRight size={15} aria-hidden="true" /></button>
        <span className="dots" aria-hidden="true">{children.map((_, i) => <i key={i} className={i === at || (end && i === children.length - 1) ? 'on' : ''} />)}</span>
      </div>
    </div>
  )
}

/* ── the box drawing: FEFCO 0201 in the oblique view of their own Kassamál page, drawn to the measurements ── */

function boxPaths(l: number, b: number, h: number) {
  const L = Math.max(l, 1), Bd = Math.max(b, 1), H = Math.max(h, 1)
  const dx = Bd * 0.55, dy = Bd * 0.32
  const flap = Bd / 2
  const W = L + dx, T = H + dy + flap * 0.9
  const s = 100 / Math.max(W, T)
  const ox = (100 - W * s) / 2 + 10, oy = (100 - T * s) / 2 + flap * 0.9 * s + 8
  const X = (x: number) => +(ox + x * s).toFixed(2)
  const Y = (y: number) => +(oy + y * s).toFixed(2)
  const x0 = 0, y0 = H
  const front = `M${X(x0)},${Y(y0)} L${X(L)},${Y(y0)} L${X(L)},${Y(0)} L${X(x0)},${Y(0)} Z`
  const side = `M${X(L)},${Y(y0)} L${X(L + dx)},${Y(y0 - dy)} L${X(L + dx)},${Y(-dy)} L${X(L)},${Y(0)} Z`
  const inner = `M${X(0)},${Y(0)} L${X(L)},${Y(0)} L${X(L + dx)},${Y(-dy)} L${X(dx)},${Y(-dy)} Z`
  const fh = flap * 0.9, skew = flap * 0.12
  const flapF = `M${X(0)},${Y(0)} L${X(L)},${Y(0)} L${X(L + skew)},${Y(-fh)} L${X(skew)},${Y(-fh)} Z`
  const flapB = `M${X(dx)},${Y(-dy)} L${X(L + dx)},${Y(-dy)} L${X(L + dx - skew)},${Y(-dy - fh)} L${X(dx - skew)},${Y(-dy - fh)} Z`
  return { front, side, inner, flapF, flapB, X, Y, L, Bd, H, dx, dy, fh }
}

function BoxDraw({ l, b, h, colour }: { l: number; b: number; h: number; colour: ColourKey }) {
  const g = useMemo(() => boxPaths(l, b, h), [l, b, h])
  const outer = colour === 'hb' ? '#F4F1EC' : '#C9B59B'
  const outerD = colour === 'hb' ? '#E6E1D8' : '#A88F72'
  const inner = '#8E7159'
  const tr = { duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }
  const { X, Y, L, H, dx, dy, fh } = g
  const off = 7
  return (
    <svg viewBox="-12 0 140 125" role="img" aria-label={`Teikning af kassa, ${mm(l)} × ${mm(b)} × ${mm(h)}`}>
      <motion.path initial={false} className="face" d={g.flapB} fill={outerD} stroke="#2A2320" strokeWidth={0.5} animate={{ d: g.flapB }} transition={tr} />
      <motion.path initial={false} className="face" d={g.inner} fill={inner} stroke="#2A2320" strokeWidth={0.5} animate={{ d: g.inner }} transition={tr} />
      <motion.path initial={false} className="face" d={g.side} fill={outerD} stroke="#2A2320" strokeWidth={0.5} animate={{ d: g.side }} transition={tr} />
      <motion.path initial={false} className="face" d={g.front} fill={outer} stroke="#2A2320" strokeWidth={0.5} animate={{ d: g.front }} transition={tr} />
      <motion.path initial={false} className="face" d={g.flapF} fill={outer} stroke="#2A2320" strokeWidth={0.5} animate={{ d: g.flapF }} transition={tr} />
      <g className="dim">
        {/* L: under the front edge */}
        <motion.line initial={false} x1={X(0)} x2={X(L)} y1={Y(H) + off} y2={Y(H) + off} animate={{ x1: X(0), x2: X(L), y1: Y(H) + off, y2: Y(H) + off }} transition={tr} />
        <motion.line initial={false} x1={X(0)} x2={X(0)} y1={Y(H) + off - 2} y2={Y(H) + off + 2} animate={{ x1: X(0), x2: X(0), y1: Y(H) + off - 2, y2: Y(H) + off + 2 }} transition={tr} />
        <motion.line initial={false} x1={X(L)} x2={X(L)} y1={Y(H) + off - 2} y2={Y(H) + off + 2} animate={{ x1: X(L), x2: X(L), y1: Y(H) + off - 2, y2: Y(H) + off + 2 }} transition={tr} />
        <motion.text initial={false} animate={{ attrX: (X(0) + X(L)) / 2, attrY: Y(H) + off + 6 }} transition={tr} textAnchor="middle" fontSize="4.2">L {l.toLocaleString('de-DE')}</motion.text>
        {/* H: left of the front face */}
        <motion.line initial={false} x1={X(0) - off} x2={X(0) - off} y1={Y(0)} y2={Y(H)} animate={{ x1: X(0) - off, x2: X(0) - off, y1: Y(0), y2: Y(H) }} transition={tr} />
        <motion.line initial={false} x1={X(0) - off - 2} x2={X(0) - off + 2} y1={Y(0)} y2={Y(0)} animate={{ x1: X(0) - off - 2, x2: X(0) - off + 2, y1: Y(0), y2: Y(0) }} transition={tr} />
        <motion.line initial={false} x1={X(0) - off - 2} x2={X(0) - off + 2} y1={Y(H)} y2={Y(H)} animate={{ x1: X(0) - off - 2, x2: X(0) - off + 2, y1: Y(H), y2: Y(H) }} transition={tr} />
        <motion.text initial={false} animate={{ attrX: X(0) - off - 2.5, attrY: (Y(0) + Y(H)) / 2 }} transition={tr} textAnchor="end" dominantBaseline="middle" fontSize="4.2">H {h.toLocaleString('de-DE')}</motion.text>
        {/* B: along the right bottom edge */}
        <motion.line initial={false} x1={X(L) + off * 0.6} x2={X(L + dx) + off * 0.6} y1={Y(H) + off * 0.5} y2={Y(H - dy) + off * 0.5} animate={{ x1: X(L) + off * 0.6, x2: X(L + dx) + off * 0.6, y1: Y(H) + off * 0.5, y2: Y(H - dy) + off * 0.5 }} transition={tr} />
        <motion.text initial={false} animate={{ attrX: X(L + dx / 2) + off * 1.3, attrY: Y(H - dy / 2) + off * 0.5 + 4 }} transition={tr} textAnchor="start" fontSize="4.2">B {b.toLocaleString('de-DE')}</motion.text>
        <text x={X(L + dx) + 1} y={Y(-dy) - fh * 1 - 3} fontSize="3.6" fill="#6F655C">FEFCO 0201 · innri mál í mm</text>
      </g>
    </svg>
  )
}
/* the small static drawings on the Kassagerð page (same projection, fixed proportions) */
function MiniBox({ kind, line }: { kind: StyleKey; line?: boolean }) {
  const g = boxPaths(300, 200, kind === '0427' ? 90 : 150)
  const k = line ? 'none' : '#C9B59B', kd = line ? 'none' : '#A88F72', ink = line ? 'currentColor' : '#2A2320'
  return (
    <svg viewBox="8 8 112 112" aria-hidden="true">
      {kind !== '0427' && <path d={g.flapB} fill={kd} stroke={ink} strokeWidth={0.5} />}
      <path d={g.inner} fill={line ? 'none' : '#8E7159'} stroke={ink} strokeWidth={0.5} />
      <path d={g.side} fill={kd} stroke={ink} strokeWidth={0.5} />
      <path d={g.front} fill={k} stroke={ink} strokeWidth={0.5} />
      {kind === '0201' && <path d={g.flapF} fill={k} stroke={ink} strokeWidth={0.5} />}
      {kind === '0203' && <path d={g.flapF} fill={k} stroke={ink} strokeWidth={0.5} transform="translate(0,-4)" />}
      {kind === '0427' && <path d={g.flapB} fill={k} stroke={ink} strokeWidth={0.5} transform="translate(0,-2)" />}
      {kind === 'annad' && <circle cx={g.X(g.L / 2)} cy={g.Y(g.H / 2)} r={g.H * 0.18} fill="#fff" stroke={ink} strokeWidth={0.5} />}
    </svg>
  )
}


/* first visit only: the three faces of their mark fold together, the wordmark settles, the curtain lifts */
function Loader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current!
    const tl = gsap.timeline({ onComplete: onDone, defaults: { ease: 'power3.out' } })
    tl.fromTo(el.querySelector('[data-f="brown"]'), { y: -22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45 }, 0.1)
      .fromTo(el.querySelector('[data-f="red"]'), { x: -26, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45 }, 0.22)
      .fromTo(el.querySelector('[data-f="amber"]'), { x: 26, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45 }, 0.34)
      .fromTo(el.querySelector('[data-w]'), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 0.55)
      .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'ugSmooth' }, 1.0)
    return () => { tl.kill() }
  }, [onDone])
  return (
    <div ref={ref} className="ug-loader" aria-hidden="true" style={{ clipPath: 'inset(0 0 0% 0)' }}>
      <div className="ug-loader__in">
        <svg viewBox="40 50 432 400" width="120" height="111">
          <polygon data-f="brown" points="100,66 254,66 177,150" fill="#4E3D31" />
          <polygon data-f="red" points="52,78 232,232 232,432 52,262" fill="#AC2619" />
          <polygon data-f="amber" points="280,232 460,78 460,262 280,432" fill="#ECB54A" />
        </svg>
        <img data-w="" src={A('brand/logo.png')} alt="" width={856} height={203} />
      </div>
    </div>
  )
}

/* ── navigation ─────────────────────────────────────────────────────────── */

type NavItem = { k: string; label: string; sub: string }
const firstOf = (key: string) => PRODUCTS.find((p) => p.catKey === key) ?? PRODUCTS[0]
const NAV: { key: string; label: string; items: NavItem[]; img: Photo; cap: string; prod?: boolean }[] = [
  { key: 'kassagerd', label: 'Kassagerð', img: PHOTOS.box, cap: 'Framleitt í Hafnarfirði', items: [
    { k: 'kassamal', label: 'Kassamál', sub: 'Þrjú mál inn, kassar sem passa út' },
    { k: 'kassagerd', label: 'Sérframleiðsla', sub: 'Kassagerðir, bylgjur, litir, prentun' },
    { k: 'fyrirspurn?askrift=1', label: 'Kassar í áskrift', sub: 'Minna í senn og oftar' },
    { k: 'fyrirspurn?prent=1', label: 'Prentun á kassa', sub: 'Flexo af PDF-skjali' },
  ] },
  { key: 'verslun', label: 'Vefverslun', img: firstOf('gjafakassar').img, cap: `${SHOP_TOTAL} vörur á lager`, prod: true, items: [
    { k: 'verslun', label: 'Allar vörur', sub: 'Kassar, pokar, bönd, kurl, búnaður' },
    { k: 'verslun?flokkur=sendingarkassar', label: 'Sendingarkassar', sub: 'Bóka-, flutnings- og A4-kassar' },
    { k: 'verslun?flokkur=gjafakassar', label: 'Gjafakassar', sub: '61 gjafakassar, flatir og ósamsettir' },
    { k: 'listinn', label: 'Pöntunarlistinn', sub: 'Magn, afsláttarþrep, afhending' },
  ] },
  { key: 'um', label: 'Um okkur', img: PHOTOS.hands, cap: 'Reykjavíkurvegur 70', items: [
    { k: 'um-okkur', label: 'Um okkur', sub: 'Fjölskyldufyrirtæki síðan 2014' },
    { k: 'um-okkur#umhverfi', label: 'Umhverfisábyrgð', sub: 'RESY-vottun, FSC í vinnslu' },
    { k: 'verslun?flokkur=hringrasarlausnir', label: 'Hringrásarlausnir', sub: 'Orwak baggapressur, Reencle' },
    { k: 'um-okkur#samband', label: 'Hafa samband', sub: `${CONTACT.phone}, ${CONTACT.email}` },
  ] },
]

function Header({ sub, onMenu }: { sub: string; onMenu: () => void }) {
  const [open, setOpen] = useState<string | null>(null)
  const loc = useLocation()
  const ref = useRef<HTMLDivElement>(null)
  const list = useList()
  const n = listCount(list)
  const fine = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches, [])
  useEffect(() => { setOpen(null) }, [loc.pathname, loc.search])
  useEffect(() => {
    if (!open) return
    const onDoc = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(null) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); (ref.current?.querySelector(`[data-dd="${open}"] > button`) as HTMLElement | null)?.focus() } }
    document.addEventListener('pointerdown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])
  const page = sub.split('/')[0]
  return (
    <div className="cap" ref={ref} data-cap="">
      <nav className="nav" aria-label="Aðalvalmynd">
        {NAV.map((g) => (
          <div key={g.key} className="dd" data-dd={g.key} data-open={open === g.key ? '1' : '0'}
            onPointerEnter={() => { if (fine) setOpen(g.key) }} onPointerLeave={() => { if (fine) setOpen(null) }}>
            <button type="button" aria-expanded={open === g.key} aria-controls={`dd-${g.key}`} aria-current={g.items.some((i) => i.k.split(/[/?#]/)[0] === page) ? 'true' : undefined}
              onClick={() => setOpen(open === g.key ? null : g.key)}>
              {g.label}<ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <div className="panel" id={`dd-${g.key}`}>
              <ul>{g.items.map((i) => <li key={i.k}><Link to={to(i.k)} tabIndex={open === g.key ? 0 : -1}><b>{i.label}</b><span>{i.sub}</span></Link></li>)}</ul>
              <figure aria-hidden="true" style={g.prod ? { background: 'var(--grey-l)' } : undefined}><Pic p={g.img} sizes="180px" className={g.prod ? 'prodfig' : ''} /><figcaption style={g.prod ? { color: 'var(--ink)', textShadow: 'none' } : undefined}>{g.cap}</figcaption></figure>
            </div>
          </div>
        ))}
      </nav>
      <Link className="logo" to={to()} aria-label="Umbúðagerðin, forsíða">
        <img src={A('brand/logo.png')} alt="" width={856} height={203} />
      </Link>
      <div className="acts">
        <Link className="bag" to={to('listinn')} aria-label={`Pöntunarlistinn, ${n} stk.`}>
          <ShoppingBag size={19} strokeWidth={1.6} aria-hidden="true" />
          {n > 0 && <span className="n num" aria-hidden="true">{n}</span>}
        </Link>
        <Btn to="kassamal" label="Kassamál" />
        <button className="burger" type="button" onClick={onMenu} aria-label="Opna valmynd">
          <Menu size={20} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

type ChatEl = HTMLElement & { answerer?: typeof answer; open?: () => void }

/* ── cards ──────────────────────────────────────────────────────────────── */

function ProductCard({ p, sizes = '(min-width: 1100px) 22vw, (min-width: 700px) 30vw, 46vw', back }: { p: Product; sizes?: string; back?: string }) {
  const list = useList()
  const on = list.some((l) => l.slug === p.slug)
  const href = to(`verslun/${p.slug}`)
  /* the list the product was opened from, so the crumb can say so (the position itself is restored by history) */
  const remember = () => { if (back !== undefined) { try { sessionStorage.setItem(SHOP_KEY, JSON.stringify({ search: back })) } catch { /* private mode */ } } }
  return (
    <article className="pcard">
      <div className="media">
        <Link to={href} className="ph" aria-label={p.name} onClick={remember}>
          <Pic p={p.img} sizes={sizes} />
          {p.dims && BOX_CATS.has(p.catKey) && <span className="pill sand num">{p.dims.join(' × ')} mm</span>}
        </Link>
        <button type="button" className="add" aria-pressed={on} onClick={() => { const was = on; toggle(p.slug); if (!was) window.dispatchEvent(new CustomEvent(ADDED, { detail: p.slug })) }}
          aria-label={on ? `Taka ${p.name} af listanum` : `Setja ${p.name} á listann`}>
          {on ? <Check size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
        </button>
      </div>
      <div className="bd">
        <p className="br">{p.cat}</p>
        <h3 className="nm"><Link to={href} onClick={remember}>{p.name}</Link></h3>
        <p className="pr num">{kr(p.price)}{p.pack ? <small> · {p.pack} stk.</small> : null}</p>
        {p.sku && <p className="sku">Vnr. {p.sku}</p>}
      </div>
    </article>
  )
}

/* ── home ───────────────────────────────────────────────────────────────── */

function Finder({ size = '' }: { size?: '' | 'lg' }) {
  const nav = useNavigate()
  const [l, setL] = useState('')
  const [b, setB] = useState('')
  const [h, setH] = useState('')
  const ok = Number(l) > 0 && Number(b) > 0 && Number(h) > 0
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (ok) { nav(to(`kassamal?l=${l}&b=${b}&h=${h}`)); return }
    const empty = [...e.currentTarget.querySelectorAll<HTMLInputElement>('input')].find((i) => !(Number(i.value) > 0))
    empty?.focus()
  }
  return (
    <form className="finder" onSubmit={submit} aria-label="Finna kassa eftir málum" data-open="">
      <span>Ég þarf kassa sem er</span>
      <span className="dims">
        <label><span className="sr">Lengd í millimetrum</span><input inputMode="numeric" pattern="[0-9]*" autoComplete="off" placeholder="L" value={l} onChange={(e) => setL(e.target.value.replace(/\D/g, ''))} /></label><i>×</i>
        <label><span className="sr">Breidd í millimetrum</span><input inputMode="numeric" pattern="[0-9]*" autoComplete="off" placeholder="B" value={b} onChange={(e) => setB(e.target.value.replace(/\D/g, ''))} /></label><i>×</i>
        <label><span className="sr">Hæð í millimetrum</span><input inputMode="numeric" pattern="[0-9]*" autoComplete="off" placeholder="H" value={h} onChange={(e) => setH(e.target.value.replace(/\D/g, ''))} /></label>
        <span className="u">mm</span>
      </span>
      <Btn type="submit" label="Finna kassa" size={size} icon={ARROW} />
    </form>
  )
}


/* ── home ───────────────────────────────────────────────────────────────── */

const num = (s: string | null, d: number) => { const n = Number(s); return n > 0 && n < 5000 ? n : d }
const pickKey = <K extends string>(opts: readonly { key: K }[], v: string | null, d: K): K => (opts.some((o) => o.key === v) ? (v as K) : d)

/* the hero IS the instrument: three measurements, the box redraws, the stock boxes that fit appear */
function HeroInstrument() {
  const nav = useNavigate()
  const [l, setL] = useState('')
  const [b, setB] = useState('')
  const [h, setH] = useState('')
  const L = num(l, 0), Bv = num(b, 0), H = num(h, 0)
  const live = L > 0 && Bv > 0 && H > 0
  const fits = useMemo(() => (live ? findFits(L, Bv, H, 3) : []), [live, L, Bv, H])
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (live) { nav(to(`kassamal?l=${L}&b=${Bv}&h=${H}`)); return }
    const empty = [...e.currentTarget.querySelectorAll<HTMLInputElement>('input')].find((i) => !(Number(i.value) > 0))
    empty?.focus()
  }
  const inp = (v: string, set: (s: string) => void, ph: string, label: string) => (
    <label><span className="sr">{label}</span><input inputMode="numeric" pattern="[0-9]*" autoComplete="off" placeholder={ph} value={v} onChange={(e) => set(e.target.value.replace(/\D/g, '').slice(0, 4))} /></label>
  )
  return (
    <section className="hero2" aria-labelledby="h-hero">
      <div className="h2-copy">
        <h1 id="h-hero"><Lines lines={['Kassi í réttri', 'stærð.']} /></h1>
        <p className="sub" data-open="">Við sérframleiðum pappakassa í Hafnarfirði í þeirri stærð sem þú þarft, og vefverslunin er með {SHOP_TOTAL} vörur. Mældu vöruna að utan, lengd × breidd × hæð: það eru innri mál kassans.</p>
        <form className="finder" onSubmit={submit} aria-label="Finna kassa eftir málum" data-open="">
          <span>Ég þarf kassa sem er</span>
          <span className="dims">
            {inp(l, setL, 'L', 'Lengd í millimetrum')}<i>×</i>{inp(b, setB, 'B', 'Breidd í millimetrum')}<i>×</i>{inp(h, setH, 'H', 'Hæð í millimetrum')}
            <span className="u">mm</span>
          </span>
          <Btn type="submit" label={live ? 'Opna í Kassamáli' : 'Finna kassa'} icon={ARROW} />
        </form>
        <p className="h2-meta" data-open="">Framleitt í Hafnarfirði síðan 2021 · Reykjavíkurvegur 70 · {CONTACT.hoursShort}</p>
      </div>
      <div className="h2-draw" data-open="">
        <div className="h2-box">
          <BoxDraw l={L || 300} b={Bv || 200} h={H || 150} colour="bb" />
          <span className="h2-num num">{live ? `${L} × ${Bv} × ${H}` : '300 × 200 × 150'}<small>mm, innri mál</small></span>
        </div>
        <div className="h2-fits" aria-live="polite">
          {!live && <p className="muted small">Sláðu inn þrjú mál og lagerkassarnir sem passa birtast hér með verði. Passi enginn sérframleiðum við stærðina.</p>}
          {live && fits.length === 0 && <p className="muted small">Enginn lagerkassi tekur {L} × {Bv} × {H} mm. <Link className="tlink" to={to(`fyrirspurn?l=${L}&b=${Bv}&h=${H}`)}>Senda í sérframleiðslu</Link></p>}
          {live && fits.map((f, i) => (
            <Link key={f.p.slug} className="h2-fit" to={to(`verslun/${f.p.slug}`)}>
              <img src={f.p.img.src} alt="" width={56} height={56} loading="lazy" />
              <span><b>{f.p.name}</b><small className="num">{f.p.dims!.join(' × ')} mm{i === 0 ? ' · minnst umfram' : ''}</small></span>
              <span className="num pr">{kr(f.p.price)}{f.p.pack ? <small> · {f.p.pack} stk.</small> : null}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* shop first (Lumi: the catalogue is the page; Sum Hing: the product photographed plain) */
const CAT_TILES = ['sendingarkassar', 'gjafakassar', 'pokar', 'vefverslunarpokar-og-umslog', 'kassakurl', 'bordar-og-bond']
function ShopFirst() {
  const picks = [...byCat('sendingarkassar', 3), ...byCat('gjafakassar', 2), ...byCat('kassakurl', 1), ...byCat('limbond', 1), ...byCat('pokkunarbunadur', 1)]
  return (
    <section className="wrap sec" id="verslun" aria-labelledby="h-shop">
      <div className="shead">
        <div className="t"><h2 id="h-shop" className="h-xl" data-rv="">Vefverslun</h2><p data-rv="">{SHOP_TOTAL} vörur með verði og vörunúmeri: kassar, pokar, bönd, kassakurl, límbönd og pökkunarbúnaður. Sótt á Reykjavíkurvegi 70.</p></div>
        <div className="tools" data-rv=""><Btn to="verslun" label="Öll verslunin" tone="grey" icon={ARROW} /></div>
      </div>
      <ul className="cats six" role="list" data-rv-g="">
        {CAT_TILES.map((key) => {
          const c = SHOP_CATS.find((x) => x.key === key)
          if (!c) return null
          const pr = firstOf(key)
          return (
            <li key={key}>
              <Link className="cat" to={to(`verslun?flokkur=${key}`)}>
                <div className="ph zoom"><Pic p={pr.img} sizes="(min-width: 900px) 16vw, 46vw" /></div>
                <b>{c.label}<ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" /></b>
                <small className="num">{vorur(c.full)}</small>
              </Link>
            </li>
          )
        })}
      </ul>
      <div style={{ marginTop: 'var(--sp-lg)' }}>
        <Rail label="Úr versluninni" pr cw="calc((100% - 3 * var(--gutter)) / 4.2)">
          {picks.map((sl) => <ProductCard key={sl} p={productBySlug(sl)!} sizes="(min-width: 1000px) 23vw, 46vw" />)}
        </Rail>
      </div>
    </section>
  )
}

/* the factory, dense: their own words, one photo, the four facts a buyer needs */
function FactoryBand() {
  return (
    <section className="wrap sec" id="kassagerd" aria-labelledby="h-fac">
      <div className="factory">
        <div className="ph f-ph" data-rv-img=""><Pic p={PHOTOS.box} sizes="(min-width: 900px) 42vw, 100vw" pos="50% 45%" /></div>
        <div className="f-txt">
          <h2 id="h-fac" className="h-xl" data-rv="">Framleitt í Hafnarfirði síðan 2021.</h2>
          <p className="f-lead" data-rv="">Þú segir okkur hvernig kassa þig vantar og gefur okkur upp málin og magnið. Við framleiðum hann í þeirri stærð og tegund sem hentar þinni notkun, með stuttum afgreiðslutíma, og pöntum tilsniðið hráefni hverju sinni ef tími og magn leyfa, til að lágmarka afskurð.</p>
          <dl className="f-rows" data-rv-g="">
            <div><dt>Bylgja</dt><dd>{FLUTES.map((f) => <span key={f.key} className="f-flute"><i style={{ '--th': `${Math.max(3, f.thick * 2.2)}px` } as CSSProperties} aria-hidden="true" />{f.key === 'BC' ? 'Tvöföld' : f.key}<small className="num">{f.thick.toLocaleString('de-DE')} mm</small></span>)}</dd></div>
            <div><dt>Litur</dt><dd>Brúnn að utan og innan, eða hvítur að utan og brúnn að innan. Aðrir litir eru sérpöntun.</dd></div>
            <div><dt>Prentun</dt><dd>Flexo af PDF-skjali, litir úr jurtaríkinu, prentklisjan nýtist aftur og aftur.</dd></div>
            <div><dt>Áskrift</dt><dd>Minna í senn og oftar: mánaðarlega, ársfjórðungslega eða eftir þörfum. Áskrifendur eru í forgangi.</dd></div>
          </dl>
          <div className="f-acts" data-rv=""><Btn to="kassamal" label="Opna Kassamál" tone="red" icon={ARROW} /><Btn to="kassagerd" label="Um kassagerðina" tone="line" /></div>
        </div>
      </div>
    </section>
  )
}

/* trust strip: the four things that make a buyer comfortable, on one line */
function TrustStrip() {
  return (
    <section className="wrap sec" aria-label="Um fyrirtækið">
      <ul className="trust" role="list" data-rv-g="">
        <li><b>Fjölskyldufyrirtæki</b><span>Stofnað 2014 af hjónunum Sigrúnu Eddu Eðvarðsdóttur og Eyþóri Páli Haukssyni, út frá Prentmiðlun sem hefur prentað bækur frá 2008.</span></li>
        <li><img src={A('resy-400.webp')} alt="RESY-vottun" width={96} height={95} /><b>RESY-vottun</b><span>Bylgjupappi úr sjálfbærum skógum, allur afskurður flokkaður og endurunninn. FSC-vottun í vinnslu.</span></li>
        <li><b className="num">{CONTACT.phone}</b><span>{CONTACT.hours}. <a className="tlink" href={mailHref(CONTACT.email)} style={{ minHeight: 0 }}>{CONTACT.email}</a></span></li>
        <li><b>{CONTACT.street}</b><span>{CONTACT.town}, þar sem kassagerðin fer fram. <a className="tlink" href="https://www.google.com/maps/search/?api=1&query=Reykjav%C3%ADkurvegur+70%2C+220+Hafnarfj%C3%B6r%C3%B0ur" target="_blank" rel="noopener" style={{ minHeight: 0 }}>Opna í kortum</a></span></li>
      </ul>
    </section>
  )
}

/* the chooser: what are you packing? (Pebble's use-case carousel on native swipe) */
type Intent = { k: string; tab: string; t: string; d: string; img: Photo; prod?: boolean; picks: string[]; cta: [string, string] }
const byCat = (key: string, n: number) => PRODUCTS.filter((p) => p.catKey === key).slice(0, n).map((p) => p.slug)
const INTENTS: Intent[] = [
  { k: 'vefverslun', tab: 'Vefverslun', t: 'Sendingar úr vefverslun', d: 'Vefverslunarpokar, fylgiseðlaumslög og sendingarkassar í búntum. Minna í senn, oftar, ef þú vilt.', img: firstOf('vefverslunarpokar-og-umslog').img, prod: true, picks: [...byCat('vefverslunarpokar-og-umslog', 2), ...byCat('sendingarkassar', 1)], cta: ['Skoða vefverslunarpoka', 'verslun?flokkur=vefverslunarpokar-og-umslog'] },
  { k: 'gjof', tab: 'Gjafir', t: '61 gjafakassar á lager', d: 'Afgreiddir flatir og ósamsettir, brúnir, hvítir eða svartir. Kassakurl og borðar í sömu pöntun.', img: firstOf('gjafakassar').img, prod: true, picks: [...byCat('gjafakassar', 2), ...byCat('bordar-og-bond', 1)], cta: ['Skoða gjafakassa', 'verslun?flokkur=gjafakassar'] },
  { k: 'flutningur', tab: 'Flutningar', t: 'Flutnings- og bókakassar', d: 'Sendingarkassar í búntum, 10 til 20 stk., og honeycomb-arkir, 20 mm þykkar.', img: PHOTOS.box, picks: byCat('sendingarkassar', 3), cta: ['Skoða sendingarkassa', 'verslun?flokkur=sendingarkassar'] },
  { k: 'matur', tab: 'Matur', t: 'Pizzakassar og bakkar', d: 'Kassar og bakkar fyrir mat, take-away pokar með flötu haldi, bréfpokar með snúnu bandi.', img: firstOf('pizzakassar').img, prod: true, picks: [...byCat('pizzakassar', 1), ...byCat('bakkar', 1), ...byCat('pokar', 1)], cta: ['Skoða bakka', 'verslun?flokkur=bakkar'] },
  { k: 'ser', tab: 'Sérframleitt', t: 'Kassi í þinni stærð', d: 'Þegar enginn lagerkassi passar: sláðu inn innri málin, veldu bylgju og lit, og sendu beiðni. Verðtilboð kemur frá framleiðslunni.', img: PHOTOS.hands, picks: [], cta: ['Opna Kassamál', 'kassamal'] },
]
function Intents() {
  const ref = useRef<HTMLUListElement>(null)
  const [at, setAt] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const on = () => {
      const mid = el.scrollLeft + el.clientWidth / 2
      let best = 0, d = 1e9
      ;[...el.children].forEach((c, i) => { const h = c as HTMLElement; const m = h.offsetLeft + h.offsetWidth / 2; if (Math.abs(m - mid) < d) { d = Math.abs(m - mid); best = i } })
      setAt(best)
    }
    on()
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])
  const go = (i: number) => {
    const el = ref.current
    const c = el?.children[i] as HTMLElement | undefined
    if (!el || !c) return
    el.scrollTo({ left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <section className="sec intents" aria-labelledby="h-int">
      <div className="center-head wrap">
        <h2 id="h-int" className="h-2xl" data-rv="">Hvað ertu að pakka?</h2>
        <div className="itabs" role="tablist" aria-label="Hvað er pakkað" data-rv="">
          {INTENTS.map((x, i) => <button key={x.k} type="button" role="tab" aria-selected={at === i} aria-controls={`int-${x.k}`} onClick={() => go(i)}>{x.tab}</button>)}
        </div>
      </div>
      <ul ref={ref} className="itrack">
        {INTENTS.map((x, i) => (
          <li key={x.k} id={`int-${x.k}`} role="tabpanel" aria-label={x.tab} data-on={at === i ? '1' : '0'} {...((at !== i ? { inert: '' } : {}) as Record<string, string>)}>
            <div className="icard">
              <div className="ipanel">
                <p className="eyebrow">{x.tab}</p>
                <h3 className="h-sm">{x.t}</h3>
                <p className="muted">{x.d}</p>
                {x.picks.length > 0 && (
                  <ul className="ifit">
                    {x.picks.map((sl) => { const p = productBySlug(sl)!; return <li key={sl}><Link to={to(`verslun/${sl}`)} tabIndex={at === i ? 0 : -1}><span>{p.name}</span><span className="num">{kr(p.price)}</span></Link></li> })}
                  </ul>
                )}
                {x.picks.length === 0 && <div style={{ margin: 'auto 0 8px' }}><Finder /></div>}
                <Btn to={x.cta[1]} label={x.cta[0]} icon={ARROW} />
              </div>
              <div className={`iimg${x.prod ? ' prod' : ''}`}><Pic p={x.img} sizes="(min-width: 1024px) 50vw, 90vw" /></div>
            </div>
          </li>
        ))}
      </ul>
      <div className="wrap rail-ft" style={{ justifyContent: 'center' }}>
        <button type="button" className="ibtn" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Fyrri"><ArrowLeft size={15} aria-hidden="true" /></button>
        <button type="button" className="ibtn" onClick={() => go(at + 1)} disabled={at === INTENTS.length - 1} aria-label="Næsta"><ArrowRight size={15} aria-hidden="true" /></button>
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="edge" aria-labelledby="h-next">
      <div className="faq">
        <div className="center-head"><h2 id="h-next" className="h-xl" data-rv="">Gott að vita um kassa</h2></div>
        <ul className="acc-list" role="list" data-rv-g="">
          {FAQ.map((n, i) => {
            const on = open === i
            return (
              <li key={n.q} className={`acc${on ? ' is-open' : ''}`}>
                <h3><button type="button" className="acc-b" aria-expanded={on} aria-controls={`acc-${i}`} id={`acc-b-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                  <span>{n.q}</span><span className="pm" aria-hidden="true" />
                </button></h3>
                <div className="acc-p" id={`acc-${i}`} role="region" aria-labelledby={`acc-b-${i}`}>
                  <div><p>{n.a} <Link className="tlink" to={to(n.link[1])} tabIndex={on ? 0 : -1}>{n.link[0]}</Link></p></div>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="more"><Btn href={`tel:${CONTACT.tel}`} label={`Hringja ${CONTACT.phone}`} tone="white" icon={<Phone size={15} aria-hidden="true" />} /></div>
      </div>
    </section>
  )
}

function Tiles({ a, b }: { a?: [string, string, string]; b?: [string, string, string] }) {
  const [at, al, ah] = a ?? ['Hringja í framleiðsluna', `Sími ${CONTACT.phone}`, `tel:${CONTACT.tel}`]
  const [bt, bl, bh] = b ?? ['Finna kassa sem passar', 'Þrjú mál inn', 'kassamal']
  return (
    <div className="edge">
      <div className="tiles">
        {ah.startsWith('tel:') || ah.startsWith('mailto:')
          ? <a className="tile" href={ah}><small>{al}</small><span className="tb"><b>{at}</b><span className="ibtn light" aria-hidden="true"><ArrowRight size={15} /></span></span></a>
          : <Link className="tile" to={to(ah)}><small>{al}</small><span className="tb"><b>{at}</b><span className="ibtn light" aria-hidden="true"><ArrowRight size={15} /></span></span></Link>}
        <Link className="tile red" to={to(bh)}><small>{bl}</small><span className="tb"><b>{bt}</b><span className="ibtn light" aria-hidden="true"><ArrowRight size={15} /></span></span></Link>
      </div>
    </div>
  )
}

function Home() {
  return (
    <>
      <HeroInstrument />
      <ShopFirst />
      <Intents />
      <FactoryBand />
      <TrustStrip />
      <Faq />
    </>
  )
}

/* ── pages: shared ──────────────────────────────────────────────────────── */

function Title({ title, lede, crumb }: { title: ReactNode[]; lede?: ReactNode; crumb?: { to: string; label: string } }) {
  return (
    <div className="ptitle" data-intro="">
      {crumb && <Link className="crumb" to={to(crumb.to)} data-open=""><ArrowLeft size={15} aria-hidden="true" />{crumb.label}</Link>}
      <h1><Lines lines={title} /></h1>
      {lede && <p className="lede" data-open="">{lede}</p>}
    </div>
  )
}

function Field({ label, name, type = 'text', required, auto, mode, error, placeholder, hint, defaultValue }: { label: string; name: string; type?: string; required?: boolean; auto?: string; mode?: 'tel' | 'email' | 'numeric'; error?: string; placeholder?: string; hint?: string; defaultValue?: string }) {
  const id = `f-${name}`
  return (
    <label htmlFor={id}>
      <span>{label}{required ? '' : ' (valfrjálst)'}</span>
      <input id={id} name={name} type={type} required={required} spellCheck={type === 'email' || name === 'kt' ? false : undefined} autoComplete={auto} inputMode={mode} placeholder={placeholder} defaultValue={defaultValue}
        aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined} />
      {hint && !error && <small className="hint" id={`${id}-h`}>{hint}</small>}
      {error && <p className="err" id={`${id}-e`}>{error}</p>}
    </label>
  )
}
function Contact({ err, company = false }: { err: Record<string, string>; company?: boolean }) {
  return (
    <>
      {company && <div className="two"><Field label="Fyrirtæki" name="fyrirtaeki" auto="organization" /><Field label="Kennitala" name="kt" mode="numeric" hint="Fyrir reikning; má bíða." /></div>}
      <Field label="Nafn" name="nafn" required auto="name" error={err.nafn} />
      <div className="two">
        <Field label="Sími" name="simi" type="tel" required auto="tel" mode="tel" error={err.simi} />
        <Field label="Netfang" name="netfang" type="email" required auto="email" mode="email" error={err.netfang} />
      </div>
    </>
  )
}
function readContact(fd: FormData, er: Record<string, string>) {
  const nafn = String(fd.get('nafn') ?? '').trim()
  const simi = String(fd.get('simi') ?? '').trim()
  const netfang = String(fd.get('netfang') ?? '').trim()
  const fyrirtaeki = String(fd.get('fyrirtaeki') ?? '').trim()
  if (!nafn) er.nafn = 'Skrifaðu nafnið þitt.'
  if (simi.replace(/\D/g, '').length < 7) er.simi = 'Símanúmerið þarf að vera sjö tölustafir.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(netfang)) er.netfang = 'Netfangið lítur ekki rétt út.'
  return { nafn, simi, netfang, fyrirtaeki, who: fyrirtaeki ? `${fyrirtaeki} (${nafn})` : nafn, contact: `${simi}, ${netfang}` }
}
function focusFirst(form: HTMLFormElement, er: Record<string, string>) {
  const k = Object.keys(er)[0]
  if (k) (form.querySelector(`[name="${k}"]`) as HTMLElement | null)?.focus()
}

function Done({ r, back }: { r: Request; back: ReactNode }) {
  return (
    <div className="done" role="status">
      <h2>Beiðnin er skráð.</h2>
      <p style={{ marginTop: 10 }} className="muted">{r.kind === 'pontun' ? 'Afgreiðslan staðfestir pöntunina og lætur vita þegar hún er tilbúin til afhendingar.' : 'Framleiðslan fer yfir málin og svarar með verðtilboði í síma eða tölvupósti.'}</p>
      <dl>
        <div><dt>Númer</dt><dd className="num">{r.id}</dd></div>
        <div><dt>Hvað</dt><dd>{r.title}</dd></div>
        <div><dt>Hvenær</dt><dd>{r.when}</dd></div>
        <div><dt>Fer til</dt><dd>{routeTo(r.kind)}</dd></div>
      </dl>
      <div className="acts">{back}<Btn to="afgreidsla" label="Sjá hlið starfsfólks" tone="line" /></div>
      <p className="proto-note">Frumgerð: ekkert var sent. Beiðnin er geymd í þessum vafra og sést í afgreiðslunni.</p>
    </div>
  )
}

function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`page ${className}`}><div className="wrap">{children}</div></div>
}

function Chips({ name, value, opts, onPick }: { name: string; value: string; opts: [string, string, string?][]; onPick: (v: string) => void }) {
  return (
    <div className="chips" role="group" aria-label={name}>
      {opts.map(([v, l, s]) => <button key={v || 'all'} type="button" className="chip" aria-pressed={value === v} onClick={() => onPick(v)}>{l}{s && <small>{s}</small>}</button>)}
    </div>
  )
}

/* ── KASSAMÁL: the instrument ───────────────────────────────────────────── */

function KassamalPage() {
  const [sp, setSp] = useSearchParams()
  const [l, setL] = useState(() => String(num(sp.get('l'), 300)))
  const [b, setB] = useState(() => String(num(sp.get('b'), 200)))
  const [h, setH] = useState(() => String(num(sp.get('h'), 150)))
  const [flute, setFlute] = useState<FluteKey>(() => pickKey(FLUTES, sp.get('bylgja'), 'B'))
  const [colour, setColour] = useState<ColourKey>(() => pickKey(COLOURS, sp.get('litur'), 'bb'))
  const [style, setStyle] = useState<StyleKey>(() => pickKey(STYLES, sp.get('gerd'), '0201'))
  const [qty, setQ] = useState(() => num(sp.get('magn'), 250))
  const list = useList()
  const L = num(l, 0), Bv = num(b, 0), H = num(h, 0)
  const fits = useMemo(() => findFits(L, Bv, H), [L, Bv, H])
  const tooBig = useMemo(() => (L && Bv && H ? allFits(L, Bv, H).filter((f) => f.slack > MAX_SLACK).length : 0), [L, Bv, H])
  /* the measurements live in the URL, so the result is shareable and Back lands on the same numbers */
  useEffect(() => {
    const n = new URLSearchParams(sp)
    const want: Record<string, string> = { l, b, h, bylgja: flute, litur: colour, gerd: style, magn: String(qty) }
    let changed = false
    for (const [k, v] of Object.entries(want)) if ((n.get(k) ?? '') !== v) { n.set(k, v); changed = true }
    if (changed) setSp(n, { replace: true })
  }, [l, b, h, flute, colour, style, qty]) // eslint-disable-line react-hooks/exhaustive-deps
  const reqHref = `fyrirspurn?l=${L}&b=${Bv}&h=${H}&bylgja=${flute}&litur=${colour}&gerd=${style}&magn=${qty}`
  const vol = L && Bv && H ? (L * Bv * H) / 1e6 : 0
  const fl = FLUTES.find((f) => f.key === flute)!
  const dim = (v: string, set: (s: string) => void, label: string, short: string) => (
    <label><span>{label}</span><span className="f"><input inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={v} onChange={(e) => set(e.target.value.replace(/\D/g, '').slice(0, 4))} aria-label={`${label} í millimetrum`} /><i>{short}</i></span></label>
  )
  return (
    <Page>
      <Title title={['Kassamál']} lede="Mældu vöruna að utan, lengd × breidd × hæð í millimetrum: það eru innri mál kassans. Lagerkassar sem passa birtast með verði; annars sérframleiðum við stærðina." />
      <div className="km" data-intro="">
        <div className="km-in" data-open="">
          <h2>Innri mál kassans</h2>
          <div className="dimrow">
            {dim(l, setL, 'Lengd', 'mm')}
            {dim(b, setB, 'Breidd', 'mm')}
            {dim(h, setH, 'Hæð', 'mm')}
          </div>
          <div className="fg"><span>Bylgja</span><Chips name="Bylgja" value={flute} onPick={(v) => setFlute(v as FluteKey)} opts={FLUTES.map((f) => [f.key, f.label, `${f.thick.toLocaleString('de-DE')} mm`] as [string, string, string])} /><p className="small muted">{fl.line}.</p></div>
          <div className="fg"><span>Litur</span><Chips name="Litur" value={colour} onPick={(v) => setColour(v as ColourKey)} opts={COLOURS.map((c) => [c.key, c.label] as [string, string])} /></div>
          <div className="fg"><span>Kassagerð</span><Chips name="Kassagerð" value={style} onPick={(v) => setStyle(v as StyleKey)} opts={STYLES.map((s) => [s.key, s.label] as [string, string])} /><p className="small muted">{STYLES.find((s) => s.key === style)!.line}</p></div>
          <div className="fg"><span>Magn fyrir sérframleiðslu</span>
            <div className="qty" style={{ justifySelf: 'start' }} aria-label="Magn">
              <button type="button" aria-label="Fækka" onClick={() => setQ(Math.max(50, qty - 50))}><Minus size={15} aria-hidden="true" /></button>
              <input inputMode="numeric" value={qty} onChange={(e) => setQ(Math.max(1, Number(e.target.value.replace(/\D/g, '')) || 1))} aria-label="Magn í stykkjum" />
              <button type="button" aria-label="Fjölga" onClick={() => setQ(qty + 50)}><Plus size={15} aria-hidden="true" /></button>
            </div>
          </div>
          <div className="km-sum">
            <span><b>{L && Bv && H ? `${mm(L)} × ${mm(Bv)} × ${mm(H)}` : 'Sláðu inn þrjú mál'}</b></span>
            <span>{fl.label}, {COLOURS.find((c) => c.key === colour)!.label.toLowerCase()}, {STYLES.find((s) => s.key === style)!.label}, {qty.toLocaleString('de-DE')} stk.</span>
            <span>Sérframleiðsla fær verðtilboð frá framleiðslunni; verð lagerkassa standa hér að neðan.</span>
            <div className="acts"><Btn to={reqHref} label="Senda í sérframleiðslu" tone="red" icon={ARROW} /><Btn to="kassagerd" label="Um kassagerðina" tone="line" /></div>
          </div>
        </div>
        <div className="km-draw" data-open="">
          <div className="ttl">
            <b>{style === '0201' ? 'Kassinn þinn, teiknaður í hlutföllum' : `Málin þín, teiknuð sem FEFCO 0201 (${STYLES.find((s) => s.key === style)!.label} er teiknuð í tilboðinu)`}</b>
            <span className="num">{L && Bv && H ? `${L} × ${Bv} × ${H}` : '· × · × ·'}<small>mm</small></span>
          </div>
          <BoxDraw l={L || 1} b={Bv || 1} h={H || 1} colour={colour} />
          <div className="vol">
            <span>Rúmmál {vol ? `${vol.toLocaleString('de-DE', { maximumFractionDigits: 1 })} ${Math.round(vol) === 1 ? 'lítri' : 'lítrar'}` : '·'}</span>
            <span>Ytra mál um {L && Bv && H ? `${L + 2 * fl.thick} × ${Bv + 2 * fl.thick} × ${H + 2 * fl.thick} mm` : '·'} með {fl.label.toLowerCase()}, án flipa</span>
          </div>
        </div>
      </div>
      <section className="km-fits" aria-labelledby="h-fits">
        <div className="shead">
          <div className="t"><h2 id="h-fits" className="h-lg">{!(L && Bv && H) ? 'Sláðu inn þrjú mál' : fits.length ? `${fits.length} lagerkass${fits.length === 1 ? 'i passar' : 'ar passa'}` : 'Enginn lagerkassi passar'}</h2>
            <p>{!(L && Bv && H) ? 'Lengd, breidd og hæð í millimetrum, 1 til 4999. Lagerkassarnir sem passa birtast hér.' : fits.length ? 'Minnsta umframrúmmál fyrst. Kassinn tekur vöruna upprétta; lengd og breidd mega víxlast, hæðin ekki. Lagerkassarnir eru valdir eftir málum einum; bylgja, litur og gerð eiga við sérframleiðsluna.' : tooBig ? `${tooBig} lagerkass${tooBig === 1 ? 'i tekur' : 'ar taka'} vöruna en með meira en fjórföldu rúmmáli, svo sérframleiðsla hentar betur: sendu málin og framleiðslan svarar með verði.` : 'Þá er þetta sérframleiðsla: sendu málin og framleiðslan svarar með verði og afgreiðslutíma.'}</p></div>
          {!fits.length && <div className="tools"><Btn to={reqHref} label="Senda í sérframleiðslu" tone="red" icon={ARROW} /></div>}
        </div>
        {fits.length > 0 && (
          <ul className="fitlist" role="list">
            {fits.map((f, i) => {
              const on = list.some((x) => x.slug === f.p.slug)
              return (
                <li key={f.p.slug} className="fit" data-best={i === 0 ? '1' : '0'}>
                  <Link className="ph" to={to(`verslun/${f.p.slug}`)} aria-label={f.p.name}><Pic p={f.p.img} sizes="96px" /></Link>
                  <div className="bd">
                    {i === 0 && <span className="pill amber best">Passar best</span>}
                    <b>{f.p.name}</b>
                    <span className="sl num">{f.p.dims!.join(' × ')} mm{f.turned ? ', snúið' : ''} · {Math.round((f.slack - 1) * 100)}% umfram{f.p.sku ? ` · vnr. ${f.p.sku}` : ''}</span>
                    <span className="pr num">{kr(f.p.price)}{f.p.pack ? ` · ${f.p.pack} stk.` : ''}</span>
                    <div className="acts">
                      <Btn label={on ? 'Á listanum' : 'Setja á lista'} tone={on ? 'grey' : ''} size="sm" icon={on ? <Check size={14} aria-hidden="true" /> : undefined} onClick={() => { if (!on) { toggle(f.p.slug); window.dispatchEvent(new CustomEvent(ADDED, { detail: f.p.slug })) } }} />
                      <Btn to={`verslun/${f.p.slug}`} label="Skoða" tone="line" size="sm" />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
      <p className="note">{SAMPLE_NOTE} Umframrúmmál er rúmmál kassans umfram rúmmál vörunnar; kassar með meira en fjórfalt rúmmál eru ekki sýndir.</p>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

/* ── Kassagerð: sérframleiðsla ──────────────────────────────────────────── */

function KassagerdPage() {
  return (
    <Page>
      <Title title={['Við sérframleiðum', 'kassa.']} lede="Þú segir okkur hvernig kassa þig vantar og gefur okkur upp málin og magnið. Hjá okkur er pappakassi ekki það sama og pappakassi." />
      <div className="two-col" data-rv-g="">
        <div className="txt">
          <p>Okkar styrkleiki er að geta framleitt pappakassa í þeirri stærð og tegund sem þú óskar og hentar þinni notkun. Við bjóðum stuttan afgreiðslutíma og að þú getir skuldbundið þig í minna magni í senn.</p>
          <p>Í gegnum tíðina hafa kassar verið nefndir eftir þyngdinni sem þeir bera, 5, 10 eða 20 kg, eða eftir notkun: lagerkassar, gjafakassar, geymslukassar, bókakassar, fatakassar, flutningskassar, pizzakassar, póstkassar, harðfiskskassar, brettakassar. Óháð því hvað kassinn er kallaður er það stærðin sem skiptir máli.</p>
          <p>Við gerum svokallaða FEFCO-kassa, þar sem 0201 lagerkassinn er algengastur, og kassa í hinum ýmsu stærðum fyrir netverslanir, iðn-, tækni-, matvæla- og sjávarútvegsfyrirtæki og allt þar á milli.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}><Btn to="kassamal" label="Opna Kassamál" tone="red" icon={ARROW} /><Btn to="fyrirspurn" label="Senda fyrirspurn" tone="line" /></div>
        </div>
        <div className="ph img" data-rv-img=""><Pic p={PHOTOS.box} sizes="(min-width: 900px) 40vw, 100vw" /></div>
      </div>

      <section className="sec" aria-labelledby="h-styles">
        <div className="shead"><div className="t"><h2 id="h-styles" className="h-lg" data-rv="">Kassagerðir</h2><p data-rv="">FEFCO er evrópski hönnunarstaðallinn fyrir umbúðir. Við gerum þessar nánast í þeirri stærð sem óskað er eftir, að því tilskildu að hráefnið sé til í húsi.</p></div></div>
        <ul className="styles" role="list" data-rv-g="">
          {STYLES.map((s) => <li key={s.key} className="style"><MiniBox kind={s.key} /><b>{s.label}</b><p>{s.line}</p></li>)}
        </ul>
      </section>

      <section className="sec" id="bylgja" aria-labelledby="h-flute">
        <div className="shead"><div className="t"><h2 id="h-flute" className="h-lg" data-rv="">Hvað á kassinn að vera sterkur?</h2><p data-rv="">Því þykkari sem bylgjan er, því sterkari og burðugri er kassinn. Hver kassi hefur þrjú lög: ytra lag, bylgjuna sjálfa og innra lag.</p></div></div>
        <ul className="flutes" role="list" data-rv-g="">
          {FLUTES.map((f) => <li key={f.key}><span className="bar" style={{ '--th': `${Math.max(4, f.thick * 3)}px` } as CSSProperties} aria-hidden="true" /><div><b>{f.label}</b><br /><span>{f.line}</span></div><span className="num">um {f.thick.toLocaleString('de-DE')} mm</span></li>)}
        </ul>
        <div className="chips" style={{ marginTop: 20 }}>
          {COLOURS.map((c) => <span key={c.key} className="chip" style={{ cursor: 'default' }}>{c.label}<small style={{ opacity: .7 }}>· {c.line}</small></span>)}
          <span className="chip" style={{ cursor: 'default' }}>Aðrir litir<small style={{ opacity: .7 }}>· sérpöntun</small></span>
        </div>
      </section>

      <div className="two-col flip sec" data-rv-g="">
        <div className="txt">
          <h2 className="h-lg">Við prentum á kassa.</h2>
          <p>Flexo-prentun á bylgjupappaumbúðir: þú sendir prentskjal í PDF og tilgreinir liti, við útbúum prentklisju sem nýtist aftur og aftur sé um endurteknar prentanir að ræða.</p>
          <p>Litirnir eru umhverfisvænir, úr jurtaríkinu, vatns- og rakaþolnir, og hreinsiefnin við prentunina ekki sterkari en vatn.</p>
          <div><Btn to="fyrirspurn?prent=1" label="Biðja um prentun" icon={ARROW} /></div>
        </div>
        <div className="ph img" data-rv-img=""><Pic p={PHOTOS.hands} sizes="(min-width: 900px) 40vw, 100vw" pos="50% 60%" /></div>
      </div>

      <section className="sec" aria-labelledby="h-askrift">
        <div className="shead"><div className="t"><h2 id="h-askrift" className="h-lg" data-rv="">Kassar í áskrift</h2><p data-rv="">Ef þú ert í áskrift ertu í forgangi með þjónustu. Afgreiðslutími, magn, bylgjutegund og afhending eftir þínum þörfum, á ársgrundvelli, mánaðarlega, ársfjórðungslega eða eins og hentar.</p></div><div className="tools" data-rv=""><Btn to="fyrirspurn?askrift=1" label="Setja upp áskrift" tone="red" icon={ARROW} /></div></div>
        <ul className="terms" data-rv-g="">
          <li>Það er stefna fyrirtækisins að lágmarka afskurð og panta tilsniðið hráefni hverju sinni ef tími og magn leyfa.</li>
          <li>Við reynum einnig að redda þeim sem leita til okkar með stuttum fyrirvara í minna magni.</li>
          <li>Fyrirtækið hefur tryggt sér RESY-vottun og vinnur að FSC-vottun; bylgjupappi kemur úr sjálfbærum skógum.</li>
        </ul>
      </section>
      <Tiles a={['Senda okkur málin', 'Sérframleiðsla', 'fyrirspurn']} />
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

/* ── shop (Mammut: filter rail, open grid; URL keeps category, filters, sort and page) ── */

const PRICES: [string, string, (n: number) => boolean][] = [
  ['', 'Öll verð', () => true],
  ['u2', 'Undir 2.000 kr.', (n) => n < 2000],
  ['2-10', '2.000 til 10.000 kr.', (n) => n >= 2000 && n <= 10000],
  ['o10', 'Yfir 10.000 kr.', (n) => n > 10000],
]
const PACKS: [string, string, (p: Product) => boolean][] = [
  ['', 'Allt', () => true],
  ['stakt', 'Stakar vörur', (p) => !p.pack],
  ['bunt', 'Í búnti eða kassa', (p) => !!p.pack],
]
const PSORT: Record<string, { label: string; fn: (a: Product, b: Product) => number }> = {
  flokkur: { label: 'Eftir flokkum', fn: (a, b) => SHOP_CATS.findIndex((c) => c.label === a.cat) - SHOP_CATS.findIndex((c) => c.label === b.cat) },
  'verd-upp': { label: 'Verð: lægst fyrst', fn: (a, b) => a.price - b.price },
  'verd-nidur': { label: 'Verð: hæst fyrst', fn: (a, b) => b.price - a.price },
  staerd: { label: 'Stærð: minnst fyrst', fn: (a, b) => (a.dims ? a.dims[0] * a.dims[1] * a.dims[2] : 9e12) - (b.dims ? b.dims[0] * b.dims[1] * b.dims[2] : 9e12) },
}

function ShopPage() {
  const [sp, setSp] = useSearchParams()
  const loc = useLocation()
  const pop = useNavigationType() === 'POP'
  const [drawer, setDrawer] = useState(false)
  const cat = sp.get('flokkur') ?? ''
  const price = sp.get('verd') ?? ''
  const pack = sp.get('pakki') ?? ''
  const rod = sp.get('rod') ?? 'flokkur'
  const page = Math.max(1, Number(sp.get('sida') ?? 1) || 1)
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); if (k !== 'sida') n.delete('sida'); setSp(n, { replace: false }) }
  const pf = PRICES.find((x) => x[0] === price)?.[2] ?? (() => true)
  const kf = PACKS.find((x) => x[0] === pack)?.[2] ?? (() => true)
  const all = PRODUCTS.filter((p) => (!cat || p.catKey === cat) && pf(p.price) && kf(p)).sort((PSORT[rod] ?? PSORT.flokkur).fn)
  const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE))
  const cur = Math.min(page, pages)
  const items = all.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE)
  const active = [cat && ['flokkur', catLabel(cat)], price && ['verd', PRICES.find((x) => x[0] === price)?.[1] ?? price], pack && ['pakki', PACKS.find((x) => x[0] === pack)?.[1] ?? pack]].filter(Boolean) as [string, string][]
  const pageHref = (n: number) => { const q = new URLSearchParams(sp); if (n > 1) q.set('sida', String(n)); else q.delete('sida'); const s = q.toString(); return to(`verslun${s ? `?${s}` : ''}`) }
  const rail = (
    <>
      <div className="fg"><span>Flokkur</span>
        <ul className="opts-list">{[['', 'Allt', PRODUCTS.length] as [string, string, number], ...SHOP_CATS.map((c) => [c.key, c.label, c.count] as [string, string, number])].map(([k, l, n]) => (
          <li key={k || 'all'}><button type="button" aria-pressed={cat === k} onClick={() => { set('flokkur', k); setDrawer(false) }}><span>{l}</span><small className="num">{n}</small></button></li>
        ))}</ul>
      </div>
      <div className="fg"><span>Pakkning</span><Chips name="Pakkning" value={pack} onPick={(v) => set('pakki', v)} opts={PACKS.map(([k, l]) => [k, l] as [string, string])} /></div>
      <div className="fg"><span>Verð</span><Chips name="Verð" value={price} onPick={(v) => set('verd', v)} opts={PRICES.map(([k, l]) => [k, l] as [string, string])} /></div>
    </>
  )
  useEffect(() => {
    if (!drawer) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(false) }
    document.addEventListener('keydown', onKey)
    pageLenis?.stop()
    const opener = document.activeElement as HTMLElement | null
    window.setTimeout(() => document.querySelector<HTMLElement>('.fdrawer .dtop .ibtn')?.focus(), 30)
    return () => { document.removeEventListener('keydown', onKey); pageLenis?.start(); opener?.focus?.() }
  }, [drawer])
  return (
    <Page>
      <Title title={[cat ? catLabel(cat) : 'Vefverslun']} lede={cat ? `${vorur(SHOP_CATS.find((c) => c.key === cat)?.full ?? 0)} í flokknum á umbudagerdin.is; ${all.length} í úrtakinu hér.` : `${SHOP_TOTAL} vörur með verði og vörunúmeri. Sótt á Reykjavíkurvegi 70; magnafsláttur reiknast á listanum.`} />
      <div className="shop">
        <aside className="frail" aria-label="Síur">{rail}</aside>
        <div className="results">
          <div className="fbar">
            <p className="count" aria-live="polite">{vorur(all.length)}{pages > 1 ? `, síða ${cur} af ${pages}` : ''}</p>
            <button type="button" className="chip only-s" onClick={() => setDrawer(true)} aria-haspopup="dialog"><SlidersHorizontal size={15} aria-hidden="true" />Síur{active.length ? ` (${active.length})` : ''}</button>
            <label><span className="sr">Röðun</span>
              <select value={rod} onChange={(e) => set('rod', e.target.value === 'flokkur' ? '' : e.target.value)}>{Object.entries(PSORT).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}</select>
            </label>
          </div>
          {active.length > 0 && (
            <div className="chips" style={{ marginBottom: 'var(--sp-sm)' }} aria-label="Virkar síur">
              {active.map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed="true" onClick={() => set(k, '')} aria-label={`Fjarlægja síu: ${l}`}>{l}<X size={14} aria-hidden="true" /></button>)}
            </div>
          )}
          {items.length ? (
            <motion.ul className="pgrid" role="list" layout>
              <AnimatePresence mode="popLayout">
                {items.map((p) => (
                  <motion.li key={p.slug} layout initial={pop ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}><ProductCard p={p} back={loc.search} /></motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <div className="empty"><h3>Engin vara passar</h3><p className="muted">Prófaðu að slaka á einni síu.</p><Btn label="Hreinsa síur" onClick={() => setSp(new URLSearchParams(), { replace: true })} /></div>
          )}
          {pages > 1 && (
            <nav className="pager" aria-label="Síður">
              {cur > 1 && <Link className="arrow" to={pageHref(cur - 1)} aria-label="Fyrri síða"><ArrowLeft size={15} aria-hidden="true" /></Link>}
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (n === cur ? <span key={n} aria-current="page" className="num">{n}</span> : <Link key={n} to={pageHref(n)} className="num">{n}</Link>))}
              {cur < pages && <Link className="arrow" to={pageHref(cur + 1)} aria-label="Næsta síða"><ArrowRight size={15} aria-hidden="true" /></Link>}
            </nav>
          )}
          <p className="note">{SAMPLE_NOTE} Síur, röðun og síða standa í slóðinni, svo "til baka" lendir á sama stað.</p>
        </div>
      </div>
      {drawer && (
        <div className="fdrawer" role="dialog" aria-modal="true" aria-label="Síur" data-lenis-prevent="">
          <button type="button" className="scrim" aria-label="Loka síum" onClick={() => setDrawer(false)} />
          <div className="sheet-in">
            <div className="dtop"><b>Síur</b><button type="button" className="ibtn" onClick={() => setDrawer(false)} aria-label="Loka síum"><X size={16} aria-hidden="true" /></button></div>
            <div className="dbody">{rail}</div>
            <div className="dfoot"><Btn label={`Sýna ${vorur(all.length)}`} onClick={() => setDrawer(false)} size="lg" className="w100" /></div>
          </div>
        </div>
      )}
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

function Tiers({ qty, price }: { qty: number; price: number }) {
  const t = tierFor(qty)
  return (
    <div className="tiers" aria-label="Magnafsláttur">
      <span className="lbl">Magnafsláttur, sýnishorn</span>
      {TIERS.map((x, i) => {
        const next = TIERS[i + 1]
        return <div key={x.min} data-on={t.min === x.min ? '1' : '0'}><span className="num">{next ? `${x.min} til ${next.min - 1} stk.` : `${x.min}+ stk.`}</span><span className="num">{x.pct ? `−${x.pct}%` : 'fullt verð'}</span><span className="num">{kr(price * (1 - x.pct / 100))}</span></div>
      })}
    </div>
  )
}

function ProductPage({ slug }: { slug: string }) {
  const p = productBySlug(slug)
  const list = useList()
  const [qty, setQ] = useState(1)
  const [openAcc, setOpenAcc] = useState(0)
  const back = useMemo(() => { try { const s = JSON.parse(sessionStorage.getItem(SHOP_KEY) ?? 'null') as { search: string } | null; return s?.search ?? '' } catch { return '' } }, [])
  if (!p) return <NotFound />
  const line = list.find((l) => l.slug === p.slug)
  const crumbTo = back ? `verslun${back}` : `verslun?flokkur=${p.catKey}`
  const more = PRODUCTS.filter((x) => x.slug !== p.slug && x.catKey === p.catKey).slice(0, 4)
  const fill = more.length < 4 ? [...more, ...PRODUCTS.filter((x) => x.slug !== p.slug && !more.includes(x) && BOX_CATS.has(x.catKey)).slice(0, 4 - more.length)] : more
  const add = () => { setQty(p.slug, (line?.qty ?? 0) + qty); window.dispatchEvent(new CustomEvent(ADDED, { detail: p.slug })) }
  const flute = /E bylgj/i.test(p.desc) ? 'E-bylgja' : /B bylgj/i.test(p.desc) ? 'B-bylgja' : /C bylgj/i.test(p.desc) ? 'C-bylgja' : null
  const parts: [string, string][] = [
    ...(p.dims ? [['Innri mál', `${p.dims.join(' × ')} mm`] as [string, string]] : []),
    ...(flute ? [['Bylgja', flute] as [string, string]] : []),
    ...(p.pack ? [['Pakkning', `${p.pack} stk.`] as [string, string]] : []),
    ['Vörunúmer', p.sku || 'skráð í afgreiðslu'],
    ['Flokkur', p.cats.join(', ')],
  ]
  const ACC: [string, ReactNode][] = [
    ['Um vöruna', <p key="a">{p.desc || p.short || 'Lýsing kemur úr vefversluninni.'}</p>],
    ['Afhending', <p key="b">Sótt á Reykjavíkurvegi 70, {CONTACT.hoursShort.toLowerCase()}, eða sent með flutningsaðila (frumgerð: sendingarkostnaður ekki reiknaður). Kassar afgreiddir flatir, í búntum.</p>],
    ['Magnafsláttur', <p key="c">{TIER_NOTE}</p>],
  ]
  return (
    <Page className="pdp">
      <Link className="crumb tlink" to={to(crumbTo)} style={{ marginBottom: 16, textDecoration: 'none' }}><ArrowLeft size={15} aria-hidden="true" />{back ? 'Aftur í vörulistann' : p.cat}</Link>
      <div className="pdp-grid">
        <div className="gal" data-intro="">
          <div className="stagep" data-open=""><Pic p={p.img} sizes="(min-width: 1024px) 55vw, 100vw" eager /></div>
        </div>
        <div className="buy">
          <div className="buy-in">
            <p className="eyebrow" data-open="">{p.cat}{p.sku ? ` · vnr. ${p.sku}` : ''}</p>
            <h1 className="h-md"><Lines lines={[p.name]} /></h1>
            <p className="pr num" data-open="">{kr(p.price)}{p.pack ? <small>{p.pack} stk. í pakkningu · {kr(p.price / p.pack)} stk.</small> : null}</p>
            {p.short && <p className="muted" data-open="">{p.short}</p>}
            <div className="row-buy" data-open="">
              <div className="qty" aria-label="Magn">
                <button type="button" aria-label="Fækka" onClick={() => setQ(Math.max(1, qty - 1))}><Minus size={15} aria-hidden="true" /></button>
                <span className="num" aria-live="polite">{qty}</span>
                <button type="button" aria-label="Fjölga" onClick={() => setQ(qty + 1)}><Plus size={15} aria-hidden="true" /></button>
              </div>
              <Btn label={line ? `Bæta við (${line.qty} á lista)` : 'Setja á listann'} onClick={add} size="lg" className="grow" tone="red" />
            </div>
            <Tiers qty={(line?.qty ?? 0) + qty} price={p.price} />
            <dl className="parts" data-open="">{parts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="num">{v}</dd></div>)}</dl>
            <ul className="facts" data-open="">
              <li><Check size={15} aria-hidden="true" />Sótt á Reykjavíkurvegi 70</li>
              {p.dims && BOX_CATS.has(p.catKey) && <li><Check size={15} aria-hidden="true" /><Link className="tlink" to={to(`kassamal?l=${p.dims[0]}&b=${p.dims[1]}&h=${p.dims[2]}`)} style={{ minHeight: 0 }}>Sjá þessa stærð undir Kassamál</Link></li>}
            </ul>
            <ul className="pacc" role="list">
              {ACC.map(([t, body], i) => (
                <li key={t} className={`acc${openAcc === i ? ' is-open' : ''}`}>
                  <h2><button type="button" className="acc-b" aria-expanded={openAcc === i} aria-controls={`pa-${i}`} onClick={() => setOpenAcc(openAcc === i ? -1 : i)}><span>{t}</span><span className="pm" aria-hidden="true" /></button></h2>
                  <div className="acc-p" id={`pa-${i}`}><div>{body}</div></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <section className="sec" aria-labelledby="h-fits">
        <div className="shead"><h2 id="h-fits" className="h-lg" data-rv="">Fleira úr flokknum {p.cat}</h2></div>
        <ul className="pgrid" role="list" data-rv-g="">{fill.map((x) => <li key={x.slug}><ProductCard p={x} /></li>)}</ul>
      </section>
      <p className="note">{SAMPLE_NOTE}</p>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

function AddedPanel() {
  const [slug, setSlug] = useState<string | null>(null)
  const list = useList()
  useEffect(() => {
    let t = 0
    const on = (e: Event) => { setSlug((e as CustomEvent<string>).detail); window.clearTimeout(t); t = window.setTimeout(() => setSlug(null), 5000) }
    window.addEventListener(ADDED, on)
    return () => { window.removeEventListener(ADDED, on); window.clearTimeout(t) }
  }, [])
  const p = slug ? productBySlug(slug) : undefined
  return (
    <AnimatePresence>
      {p && (
        <motion.div className="added" role="status" aria-live="polite" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}>
          <div className="atop"><b>Komið á listann</b><button type="button" className="ibtn" aria-label="Loka" onClick={() => setSlug(null)}><X size={15} aria-hidden="true" /></button></div>
          <div className="aitem"><img src={p.img.src} alt="" width={64} height={64} /><span><span className="nm">{p.name}</span><small className="num">{kr(p.price)} · {listCount(list)} stk. á listanum</small></span></div>
          <div className="aacts"><Btn label="Halda áfram" tone="grey" onClick={() => setSlug(null)} /><Btn to="listinn" label="Opna listann" onClick={() => setSlug(null)} /></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── the list ───────────────────────────────────────────────────────────── */

function ListPage() {
  const [sp] = useSearchParams()
  const list = useList()
  const [err, setErr] = useState<Record<string, string>>({})
  const [done, setDone] = useState<Request | null>(null)
  const [starter, setStarter] = useState(sp.get('byrja') ?? '')
  useEffect(() => { const s = sp.get('byrja'); if (s) { loadStarter(s); setStarter(s) } }, [sp])
  /* the phone total bar steps aside once the order panel itself is on screen */
  const [panelSeen, setPanelSeen] = useState(false)
  useEffect(() => {
    const el = document.getElementById('pontun')
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setPanelSeen(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [list.length])
  const tot = listTotals(list)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    if (!list.length) er.listi = 'Listinn er tómur.'
    const c = readContact(fd, er)
    setErr(er)
    if (Object.keys(er).length) return focusFirst(e.currentTarget, er)
    setDone(saveRequest({ kind: 'pontun', title: `${listCount(list)} stk., ${kr(tot.net)}`, when: String(fd.get('afh')), who: c.who, contact: c.contact,
      detail: list.map((l) => { const p = productBySlug(l.slug)!; const t = lineTotal(l); return `${l.qty} × ${p.name}${p.sku ? ` (${p.sku})` : ''}${t.pct ? ` −${t.pct}%` : ''}` }).join('; ') }))
    clearList()
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  if (done) return <Page><Done r={done} back={<Btn to="verslun" label="Aftur í verslun" />} /><div style={{ height: 'var(--sp-xl)' }} /></Page>
  return (
    <Page>
      <Title title={['Pöntunarlistinn']} lede="Safnaðu vörum úr versluninni eða byrjaðu á tilbúnum lista. Magnafsláttur reiknast á hverja línu um leið og þrepi er náð." />
      <div className="tabs" role="group" aria-label="Byrja á lista">
        {STARTERS.map((t) => <button key={t.key} type="button" className="chip" aria-pressed={starter === t.key} onClick={() => { loadStarter(t.key); setStarter(t.key) }}>{t.label}</button>)}
      </div>
      <div className="tl-grid">
        <div>
          {list.length ? (
            <ul className="tl" role="list">
              {list.map((l) => {
                const p = productBySlug(l.slug)!
                const t = lineTotal(l)
                return (
                  <li key={l.slug} className="tli">
                    <Pic p={p.img} sizes="72px" />
                    <div><b>{p.name}</b><small className="num">{kr(p.price)}{p.pack ? ` fyrir ${p.pack} stk.` : ' stk.'}{p.sku ? ` · vnr. ${p.sku}` : ''}{t.pct ? <span className="disc">−{t.pct}%</span> : null}</small></div>
                    <div className="qty"><button type="button" aria-label={`Fækka ${p.name}`} onClick={() => setQty(l.slug, l.qty - 1)}><Minus size={15} aria-hidden="true" /></button><input inputMode="numeric" value={l.qty} onChange={(e) => setQty(l.slug, Math.max(0, Number(e.target.value.replace(/\D/g, '')) || 0))} onBlur={(e) => { if (!(Number(e.target.value) > 0)) setQty(l.slug, 1) }} aria-label={`Magn, ${p.name}`} /><button type="button" aria-label={`Fjölga ${p.name}`} onClick={() => setQty(l.slug, l.qty + 1)}><Plus size={15} aria-hidden="true" /></button></div>
                    <span className="lt num">{kr(t.net)}</span>
                    <button type="button" className="rm" aria-label={`Taka ${p.name} af listanum`} onClick={() => setQty(l.slug, 0)}><Trash2 size={17} aria-hidden="true" /></button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="empty"><h3>Listinn er tómur</h3><p className="muted">Veldu tilbúinn lista hér að ofan eða settu vörur á listann í versluninni.</p><Btn to="verslun" label="Í verslun" /></div>
          )}
          {err.listi && <p className="err" role="alert" style={{ color: 'var(--err)', marginTop: 10 }}>{err.listi}</p>}
          {list.length > 0 && <div className="tl-acts"><Btn to="verslun" label="Bæta við úr versluninni" tone="grey" size="sm" icon={ARROW} /><button type="button" className="tlink" onClick={() => { if (window.confirm('Tæma listann?')) clearList() }}>Tæma listann</button></div>}
          <p className="note">{TIER_NOTE}</p>
        </div>
        <aside className="aside tl-side" aria-label="Pöntun" id="pontun">
          <div className="sumbox">
            <div><span>Stykki</span><span className="num">{listCount(list)}</span></div>
            <div><span>Fullt verð</span><span className="num">{kr(tot.gross)}</span></div>
            <div><span>Magnafsláttur</span><span className="num">{tot.gross - tot.net ? `−${kr(tot.gross - tot.net)}` : '0 kr.'}</span></div>
            <div><span>Samtals</span><span className="num">{kr(tot.net)}</span></div>
          </div>
          <form className="form" onSubmit={submit} noValidate>
            <fieldset><legend>Afhending</legend><div className="opts">{['Sækja á Reykjavíkurveg 70', 'Senda með flutningsaðila'].map((a, i) => <label key={a} className="opt"><input type="radio" name="afh" value={a} defaultChecked={i === 0} /><span>{a}</span></label>)}</div></fieldset>
            <Contact err={err} company />
            <div className="acts"><Btn type="submit" label="Senda pöntun" size="lg" tone="red" className="w100" /></div>
            <p className="proto-note">Á vef Umbúðagerðarinnar færi þetta í körfu WooCommerce og greiðslu; í afgreiðslunni á staðnum má slá sömu pöntun inn með kassakerfi á sömu vörum.</p>
          </form>
        </aside>
      </div>
      {list.length > 0 && (
        <div className="tl-bar" aria-label="Samtals" data-hide={panelSeen ? '1' : '0'}>
          <span><small>{listCount(list)} stk.{tot.gross - tot.net ? ` · −${kr(tot.gross - tot.net)}` : ''}</small><b className="num">{kr(tot.net)}</b></span>
          <Btn label="Senda pöntun" tone="red" onClick={() => goTo('pontun')} />
        </div>
      )}
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

/* ── the custom-box request (prefilled from Kassamál) ───────────────────── */

function RequestPage() {
  const [sp] = useSearchParams()
  const kind: ReqKind = sp.get('askrift') ? 'askrift' : sp.get('prent') ? 'prentun' : 'serframleidsla'
  const [err, setErr] = useState<Record<string, string>>({})
  const [done, setDone] = useState<Request | null>(null)
  const [files, setFiles] = useState<string[]>([])
  const [flute, setFlute] = useState<FluteKey>(() => pickKey(FLUTES, sp.get('bylgja'), 'B'))
  const [colour, setColour] = useState<ColourKey>(() => pickKey(COLOURS, sp.get('litur'), 'bb'))
  const [style, setStyle] = useState<StyleKey>(() => pickKey(STYLES, sp.get('gerd'), '0201'))
  const [rhythm, setRhythm] = useState<string>(() => pickKey(RHYTHMS, sp.get('taktur'), kind === 'askrift' ? 'manadarlega' : 'einu-sinni'))
  const [print, setPrint] = useState(kind === 'prentun' || !!sp.get('prent'))
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = e.currentTarget
    const data = new FormData(fd)
    const er: Record<string, string> = {}
    const l = Number(data.get('l')), b = Number(data.get('b')), h = Number(data.get('h'))
    const magn = Number(String(data.get('magn') ?? '').replace(/\D/g, ''))
    if (!(l > 0 && b > 0 && h > 0)) er.l = 'Sláðu inn lengd, breidd og hæð í millimetrum.'
    if (!(magn > 0)) er.magn = 'Hvað mörg stykki?'
    const c = readContact(data, er)
    setErr(er)
    if (Object.keys(er).length) return focusFirst(fd, er)
    const fl = FLUTES.find((f) => f.key === flute)!
    setDone(saveRequest({ kind, title: `Kassi ${l} × ${b} × ${h} mm, ${fl.label}, ${COLOURS.find((x) => x.key === colour)!.label.toLowerCase()}`, when: rhythm === 'einu-sinni' ? `${magn.toLocaleString('de-DE')} stk., ${String(data.get('hvenaer') || 'sem fyrst')}` : `${magn.toLocaleString('de-DE')} stk. ${RHYTHMS.find((r) => r.key === rhythm)?.label.toLowerCase()}`, who: c.who, contact: c.contact,
      detail: `${STYLES.find((s) => s.key === style)!.label}. ${print ? `Prentun${files.length ? ` (${files.join(', ')})` : ' (PDF kemur)'}. ` : ''}${String(data.get('lysing') || '')}`.trim() }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  if (done) return <Page><Done r={done} back={<Btn to="kassamal" label="Aftur í Kassamál" />} /><div style={{ height: 'var(--sp-xl)' }} /></Page>
  const lede = kind === 'askrift' ? 'Segðu okkur hvaða kassa þú þarft reglulega og hve oft. Framleiðslan svarar með verði og afhendingaráætlun.' : kind === 'prentun' ? 'Málin, magnið og prentskjalið í PDF með upplýsingum um liti. Við útbúum prentklisju og svörum með verði.' : 'Innri mál, bylgja, litur, gerð og magn. Framleiðslan svarar með verðtilboði og afgreiðslutíma.'
  return (
    <Page>
      <Title crumb={{ to: 'kassamal', label: 'Kassamál' }} title={[kind === 'askrift' ? 'Kassar í áskrift' : kind === 'prentun' ? 'Prentun á kassa' : 'Sérframleiðsla']} lede={lede} />
      <div className="book-grid">
        <form className="form" onSubmit={submit} noValidate>
          <fieldset><legend>Innri mál í millimetrum</legend>
            <div className="three">
              <label htmlFor="f-l"><span className="sr">Lengd</span><input id="f-l" name="l" inputMode="numeric" placeholder="Lengd" defaultValue={sp.get('l') ?? ''} aria-invalid={err.l ? true : undefined} /></label>
              <label htmlFor="f-b"><span className="sr">Breidd</span><input id="f-b" name="b" inputMode="numeric" placeholder="Breidd" defaultValue={sp.get('b') ?? ''} /></label>
              <label htmlFor="f-h"><span className="sr">Hæð</span><input id="f-h" name="h" inputMode="numeric" placeholder="Hæð" defaultValue={sp.get('h') ?? ''} /></label>
            </div>
            {err.l && <p className="err">{err.l}</p>}
            <small className="hint">Lengd er lengsta hliðin, breidd sú styttri, hæð frá botni að opnun. Ytra mál vörunnar = innra mál kassans.</small>
          </fieldset>
          <fieldset><legend>Bylgja</legend><Chips name="Bylgja" value={flute} onPick={(v) => setFlute(v as FluteKey)} opts={FLUTES.map((f) => [f.key, f.label] as [string, string])} /></fieldset>
          <div className="two">
            <fieldset><legend>Litur</legend><Chips name="Litur" value={colour} onPick={(v) => setColour(v as ColourKey)} opts={COLOURS.map((c) => [c.key, c.label] as [string, string])} /></fieldset>
            <fieldset><legend>Kassagerð</legend><Chips name="Kassagerð" value={style} onPick={(v) => setStyle(v as StyleKey)} opts={STYLES.map((s) => [s.key, s.label] as [string, string])} /></fieldset>
          </div>
          <div className="two">
            <Field label="Magn, stk." name="magn" required mode="numeric" defaultValue={sp.get('magn') ?? ''} error={err.magn} />
            <label htmlFor="f-taktur"><span>Hve oft</span>
              <select id="f-taktur" value={rhythm} onChange={(e) => setRhythm(e.target.value)}>{RHYTHMS.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}</select>
            </label>
          </div>
          {rhythm === 'einu-sinni' && <Field label="Hvenær þarftu kassana?" name="hvenaer" placeholder="t.d. fyrir 10. nóvember" />}
          <label className="check"><input type="checkbox" checked={print} onChange={(e) => setPrint(e.target.checked)} /><span style={{ margin: 0 }}>Prenta á kassann (flexo, PDF-skjal og litir)</span></label>
          {print && <label htmlFor="f-pdf"><span>Prentskjal (PDF)</span><input id="f-pdf" type="file" accept="application/pdf,image/*" multiple onChange={(e) => setFiles([...(e.target.files ?? [])].map((f) => f.name))} />
            <small className="hint">{files.length ? files.join(', ') : 'Í frumgerðinni fer engin skrá neitt. Litir mega standa í lýsingunni.'}</small></label>}
          <label htmlFor="f-lysing"><span>Hvað fer í kassann? (valfrjálst)</span><textarea id="f-lysing" name="lysing" placeholder="Varan, þyngdin, hvort kassarnir eru staflaðir, sendir eða gefnir." /></label>
          <Contact err={err} company />
          <div className="acts"><Btn type="submit" label={kind === 'askrift' ? 'Senda áskriftarbeiðni' : 'Senda í framleiðsluna'} size="lg" tone="red" /></div>
          <p className="proto-note">Ekkert er rukkað hér; framleiðslan svarar með verðtilboði.</p>
        </form>
        <aside className="aside">
          <h3>Hvað gerist næst</h3>
          <ul className="terms">
            <li>Bjarni Geir fer yfir málin, magnið og hráefnið í húsi.</li>
            <li>Þú færð verðtilboð og afgreiðslutíma í síma eða tölvupósti.</li>
            <li>Áskrifendur fá forgang; kassarnir eru framleiddir eftir taktinum sem þú valdir.</li>
          </ul>
          <div className="spec"><b className="num">{sp.get('l') && sp.get('b') && sp.get('h') ? `${sp.get('l')} × ${sp.get('b')} × ${sp.get('h')}` : '· × · × ·'}</b><span>mm, innri mál · {FLUTES.find((f) => f.key === flute)!.label} · {COLOURS.find((c) => c.key === colour)!.label}</span></div>
          <div className="ph"><Pic p={PHOTOS.box} sizes="(min-width: 900px) 34vw, 100vw" pos="50% 40%" /></div>
          <p>Opið {CONTACT.hours.toLowerCase()}. {CONTACT.street}, {CONTACT.town}.</p>
        </aside>
      </div>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

/* ── about ──────────────────────────────────────────────────────────────── */

function AboutPage() {
  return (
    <Page>
      <Title title={['Um okkur']} lede="Umbúðagerðin framleiðir umbúðir úr bylgjupappa: sérframleidda pappakassa og pappaumbúðir í samræmi við óskir viðskiptavina, sem og prentun sé þess óskað." />
      <div className="two-col" data-rv-g="">
        <div className="txt">
          <h2 className="h-lg">Saga og stefna</h2>
          <p>Umbúðagerðin var stofnuð á vormánuðum 2014 með það að markmiði að bjóða sérsniðnar og prentaðar umbúðalausnir. Fyrst um sinn einskorðaðist starfsemin við innflutning umbúða, þar til í janúar 2021 að fyrirtækið hóf sjálft að framleiða pappaumbúðir á Íslandi.</p>
          <p>Fyrirtækið leggur áherslu á persónulega og góða þjónustu og að mæta viðskiptavinum með sérsniðnum lausnum sem taka tillit til vörunnar, magnsins og afhendingartímans.</p>
          <h2 className="h-md" style={{ marginTop: 10 }}>Fjölskyldufyrirtæki</h2>
          <p>Umbúðagerðin er fjölskyldufyrirtæki stofnað af hjónunum Sigrúnu Eddu Eðvarðsdóttur og Eyþóri Páli Haukssyni, út frá starfsemi Prentmiðlunar sem hefur sérhæft sig í bóka- og tímaritaprentun frá 2008. Daglegur rekstur er í höndum Sigrúnar Eddu framkvæmdastjóra og Bjarna Geirs Eyþórssonar framleiðslustjóra; Eyþór Páll er á kantinum sem ráðgjafi með um fjörutíu ára starfsferil í prentgeiranum.</p>
        </div>
        <div className="ph img" data-rv-img=""><Pic p={PHOTOS.hands} sizes="(min-width: 900px) 40vw, 100vw" pos="50% 60%" /></div>
      </div>
      <section className="sec" id="umhverfi" aria-labelledby="h-env">
        <div className="shead"><div className="t"><h2 id="h-env" className="h-lg" data-rv="">Umhverfisábyrgð</h2><p data-rv="">Bylgjupappi er umhverfisvænt hráefni með hátt endurvinnslu- og endurnýtingarhlutfall og kemur úr sjálfbærum skógum með FSC-vottun.</p></div><div className="tools" data-rv=""><img src={A('resy-400.webp')} alt="RESY-vottun" width={96} height={95} style={{ width: 72, height: 'auto' }} /></div></div>
        <ul className="terms" data-rv-g="">
          <li>Allur úrgangur er flokkaður og honum skilað til ábyrgra endurvinnsluaðila.</li>
          <li>Hráefni er sérpantað fyrir viðskiptavini þegar það er hægt, til að lágmarka afskurð.</li>
          <li>Kassi í réttri stærð notar minna hráefni og tekur minna pláss í flutningi. Það getur verið dýrt að flytja loft.</li>
          <li>Bylgjan er verðmætt hráefni: leitað er leiða til að auka virði afskurðar áður en hann fer í endurvinnslu.</li>
          <li>RESY-vottun er í höfn; FSC-vottun er í vinnslu.</li>
        </ul>
      </section>
      <section className="sec" id="samband" aria-labelledby="h-c">
        <div className="shead"><div className="t"><h2 id="h-c" className="h-lg" data-rv="">Hafa samband</h2></div></div>
        <ul className="ppl" role="list" data-rv-g="">
          <li><b>{CONTACT.street}</b><span>{CONTACT.town}</span><small>Þar sem kassagerðin fer fram</small></li>
          <li><b className="num">{CONTACT.phone}</b><span>{CONTACT.hours}</span><small><a className="tlink" href={`tel:${CONTACT.tel}`}>Hringja</a></small></li>
          <li><b style={{ wordBreak: 'break-all' }}>{CONTACT.email}</b><span>Fyrirspurnir, pantanir, prentskjöl</span><small><a className="tlink" href={mailHref(CONTACT.email)}>Senda póst</a></small></li>
        </ul>
        <div style={{ marginTop: 'var(--sp-sm)' }} data-rv=""><Btn href="https://www.google.com/maps/search/?api=1&query=Reykjav%C3%ADkurvegur+70%2C+220+Hafnarfj%C3%B6r%C3%B0ur" ext label="Opna í kortum" tone="grey" /></div>
      </section>
      <Tiles />
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

/* ── staff side ─────────────────────────────────────────────────────────── */

function InboxPage() {
  const [kind, setKind] = useState<ReqKind | ''>('')
  const [st, setSt] = useState<Record<string, 'ný' | 'staðfest'>>({})
  const all = [...loadRequests(), ...SAMPLE_REQUESTS]
  const rows = all.filter((r) => !kind || r.kind === kind)
  return (
    <Page className="inbox">
      <Title title={['Afgreiðsla']} lede="Hlið starfsfólks: sérframleiðslubeiðnir, áskriftir, prentun og pantanir úr versluninni á einum stað, hver á réttan stað." />
      <div className="ibar"><span>{rows.length} {rows.length % 10 === 1 && rows.length % 100 !== 11 ? 'beiðni' : 'beiðnir'} · {rows.filter((r) => (st[r.id] ?? r.status) === 'ný').length} {rows.filter((r) => (st[r.id] ?? r.status) === 'ný').length % 10 === 1 && rows.filter((r) => (st[r.id] ?? r.status) === 'ný').length % 100 !== 11 ? 'ný' : 'nýjar'}</span><span>Sýnishorn eru merkt; þínar beiðnir eru efst.</span></div>
      <div className="chips" role="group" aria-label="Tegund" style={{ marginBottom: 20 }}>
        <button type="button" className="chip" aria-pressed={kind === ''} onClick={() => setKind('')}>Allt</button>
        {(Object.keys(REQ_LABEL) as ReqKind[]).map((k) => <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>{REQ_LABEL[k]}</button>)}
      </div>
      <table>
        <thead><tr><th>Númer</th><th>Tegund</th><th>Beiðni</th><th>Frá</th><th>Fer til</th><th>Staða</th><th /></tr></thead>
        <tbody>
          {rows.map((r) => {
            const s = st[r.id] ?? r.status
            return (
              <tr key={r.id}>
                <td className="num">{r.id}</td>
                <td><span className="kind">{REQ_LABEL[r.kind]}</span></td>
                <td>{r.title}<br /><small>{r.when} · {r.detail}</small></td>
                <td>{r.who}<br /><small>{r.contact}</small></td>
                <td><small>{routeTo(r.kind)}</small></td>
                <td><span className={`st${s === 'ný' ? ' new' : ''}`}><i aria-hidden="true" />{s === 'ný' ? 'Ný' : 'Staðfest'}</span></td>
                <td><div className="ia">{s === 'ný' && <button type="button" onClick={() => setSt((x) => ({ ...x, [r.id]: 'staðfest' }))}>Staðfesta</button>}<a href={r.contact.includes('@') ? `mailto:${r.contact.split(', ').pop()}` : `tel:${r.contact.split(',')[0].replace(/\s/g, '')}`}>Svara</a></div></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="note">Frumgerð: beiðnir úr formunum eru geymdar í þessum vafra (sessionStorage). Í raunveruleikanum fara þær í tölvupóst á rétta deild og birtast hér; pantanir úr versluninni og af kassakerfinu á staðnum eru sömu WooCommerce-pantanir.</p>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

function PrivacyPage() {
  return (
    <Page>
      <Title title={['Persónuvernd']} lede="Hvaða upplýsingum formin á þessum vef myndu safna og til hvers." />
      <div className="doc">
        <p>Formin biðja um nafn, síma og netfang til að svara beiðninni, auk upplýsinga um kassann (mál, bylgju, lit, magn) og fyrirtækið þegar reikningur á að fylgja. Upplýsingarnar fara aðeins til Umbúðagerðarinnar ehf., kt. {CONTACT.kt}.</p>
        <p>Í þessari frumgerð er ekkert sent: beiðnir eru geymdar í vafranum þínum og hverfa þegar glugganum er lokað. Pöntunarlistinn er geymdur í vafranum þar til þú tæmir hann.</p>
        <p>Umbúðagerðin birtir eigin friðhelgisstefnu á umbudagerdin.is.</p>
      </div>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

function NotFound() {
  return <Page><Title title={['Síðan fannst ekki.']} lede="Hlekkurinn er úreltur eða skakkt skrifaður." /><Btn to="" label="Á forsíðu" /><div style={{ height: 'var(--sp-xl)' }} /></Page>
}

/* ── the shell ──────────────────────────────────────────────────────────── */

const TITLES: Record<string, [string, string]> = {
  '': ['Umbúðagerðin | Kassagerð, sérframleiddir pappakassar og vefverslun', 'Umbúðagerðin framleiðir pappakassa í Hafnarfirði í þeirri stærð sem óskað er, prentar á kassa, býður kassa í áskrift og rekur vefverslun með kassa, poka, bönd og pökkunarbúnað.'],
  kassamal: ['Kassamál | Umbúðagerðin', 'Sláðu inn innri mál vörunnar, lengd × breidd × hæð í mm, og sjáðu lagerkassa sem passa með verði, eða sendu stærðina í sérframleiðslu.'],
  kassagerd: ['Kassagerð | Umbúðagerðin', 'Sérframleiddir FEFCO-kassar í E-, B- eða C-bylgju, brúnir eða hvítir, með prentun ef óskað er. Kassar í áskrift.'],
  verslun: ['Vefverslun | Umbúðagerðin', 'Sendingarkassar, gjafakassar, pokar, borðar, kassakurl, límbönd og pökkunarbúnaður með verði og vörunúmeri.'],
  listinn: ['Pöntunarlistinn | Umbúðagerðin', 'Vörur, magn og magnafsláttur á einum lista; sótt eða sent.'],
  fyrirspurn: ['Sérframleiðsla | Umbúðagerðin', 'Sendu málin, magnið, bylgjuna og litinn; framleiðslan svarar með verðtilboði.'],
  'um-okkur': ['Um okkur | Umbúðagerðin', 'Fjölskyldufyrirtæki í Hafnarfirði, eigin framleiðsla frá 2021, RESY-vottun.'],
  afgreidsla: ['Afgreiðsla | Umbúðagerðin', 'Hlið starfsfólks: beiðnir og pantanir af vefnum.'],
  personuvernd: ['Persónuvernd | Umbúðagerðin', 'Hvaða upplýsingum vefur Umbúðagerðarinnar safnar og hvernig þær eru notaðar.'],
}

export default function UmbudagerdinPage() {
  const root = useRef<HTMLDivElement>(null)
  const loc = useLocation()
  const sub = loc.pathname.replace(/^.*?\/preview\/umbudagerdin\/?/, '').replace(/\/+$/, '')
  const navType = useNavigationType()
  const [menu, setMenu] = useState(false)
  const [loader, setLoader] = useState(() => { try { return !still() && sessionStorage.getItem('ug-loaded') !== '1' } catch { return !still() } })
  const loaderDone = () => { setLoader(false); try { sessionStorage.setItem('ug-loaded', '1') } catch { /* private mode */ } }
  const [banner, setBanner] = useState(() => { try { return sessionStorage.getItem('ug-banner') !== '0' } catch { return true } })
  const chat = useRef<ChatEl | null>(null)
  const page = sub.split('/')[0]
  const seg = sub.split('/')
  const formPage = useRef(false)
  formPage.current = ['listinn', 'fyrirspurn', 'afgreidsla', 'kassamal'].includes(page)

  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const [t, d] = TITLES[page] ?? TITLES['']
    const pr = page === 'verslun' && seg[1] ? productBySlug(seg[1]) : undefined
    const cat = page === 'verslun' && !seg[1] ? new URLSearchParams(loc.search).get('flokkur') : null
    document.title = pr ? `${pr.name} | Umbúðagerðin` : cat ? `${catLabel(cat)} | Umbúðagerðin` : t
    document.documentElement.lang = 'is'
    setThemeColor(banner ? BROWN : '#FFFFFF')
    const a = setMetaDescription(pr ? `${pr.name}: ${kr(pr.price)}. ${pr.short || pr.desc}`.slice(0, 160) : d)
    const nb = setNoindex(true)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => { document.title = prevTitle; document.documentElement.lang = prevLang; a(); nb(); ld.remove() }
  }, [sub, page, banner, loc.search]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let el: ChatEl | null = null
    let alive = true
    import('./vendor/sndr-chat.js').then(() => {
      if (!alive || !root.current) return
      el = document.createElement('sndr-chat') as ChatEl
      el.setAttribute('name', 'Umbúðagerðin')
      el.setAttribute('phone', CONTACT.phone)
      el.setAttribute('lang', 'is')
      el.setAttribute('label', 'Spurðu okkur')
      el.setAttribute('greeting', GREETING)
      el.setAttribute('chips', JSON.stringify(CHIPS))
      el.answerer = answer
      root.current.appendChild(el)
      chat.current = el
    }).catch(() => { /* the page works without it; the phone is everywhere */ })
    return () => { alive = false; el?.remove(); chat.current = null }
  }, [])
  const openChat = () => { setMenu(false); chat.current?.open?.() }

  /* navigation: a new page starts at the top; Back and Forward return to the exact position of that history entry.
     The position is saved for the entry being left, in the effect cleanup, before the next page paints. */
  useLayoutEffect(() => { try { window.history.scrollRestoration = 'manual' } catch { /* old browsers */ } }, [])
  const popRef = useRef(false)
  popRef.current = navType === 'POP'
  useLayoutEffect(() => {
    setMenu(false)
    const key = loc.key
    const pop = navType === 'POP'
    const saved = pop ? readPos(key) : undefined
    let t1 = 0, t2 = 0
    if (loc.hash && !pop) { t1 = window.setTimeout(() => goTo(decodeURIComponent(loc.hash.slice(1))), 120) }
    else if (saved !== undefined) {
      jumpTo(saved)
      /* a second and third pass once fonts and images have settled the layout */
      t1 = window.setTimeout(() => jumpTo(saved), 60)
      t2 = window.setTimeout(() => { jumpTo(saved); ScrollTrigger.refresh() }, 260)
    } else jumpTo(0)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); writePos(key, window.scrollY) }
  }, [loc.key]) // eslint-disable-line react-hooks/exhaustive-deps

  /* chrome state: the quick bar on phones once past the first screen */
  useEffect(() => {
    const el = root.current!
    let raf = 0
    const tick = () => {
      raf = 0
      const v = !formPage.current && window.scrollY > window.innerHeight * 0.6 ? '1' : '0'
      if (el.dataset.sticky !== v) el.dataset.sticky = v
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [loc.pathname])

  /* menu */
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('ug-menu', menu)
    if (!menu) return
    pageLenis?.stop()
    const opener = document.activeElement as HTMLElement | null
    const bg = root.current ? [...root.current.children].filter((c) => !c.classList.contains('ug-menu-panel') && c.tagName !== 'STYLE') as HTMLElement[] : []
    bg.forEach((c) => c.setAttribute('inert', ''))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('keydown', onKey)
    const panel = menuRef.current
    if (!isTouch()) panel?.querySelector<HTMLElement>('a,button')?.focus()
    if (panel && !still()) {
      gsap.fromTo(panel, { clipPath: 'inset(0 0 100% 0 round 12px)' }, { clipPath: 'inset(0 0 0% 0 round 12px)', duration: 0.35, ease: 'power4.out' })
      gsap.fromTo(panel.querySelectorAll('[data-mi]'), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.04, delay: 0.08, ease: 'power3.out' })
    }
    return () => { document.removeEventListener('keydown', onKey); pageLenis?.start(); html.classList.remove('ug-menu'); bg.forEach((c) => c.removeAttribute('inert')); opener?.focus?.() }
  }, [menu])

  /* Lenis, once, fine pointers only */
  useLayoutEffect(() => {
    const reduce = still()
    let lenis: Lenis | null = null
    const onTick = (t: number) => lenis?.raf(t * 1000)
    if (!reduce && window.matchMedia('(pointer: fine)').matches) {
      /* the touch guard sits on the constructor line so tools/mobile-gate.mjs can see it */
      lenis = isTouch() ? null : new Lenis({ lerp: 0.125, anchors: true, smoothWheel: true })
      pageLenis = lenis
      lenis?.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(onTick)
      gsap.ticker.lagSmoothing(0)
    }
    return () => { gsap.ticker.remove(onTick); lenis?.destroy(); pageLenis = null }
  }, [])

  /* motion per route: one opening, then reveals that play once */
  useLayoutEffect(() => {
    const el = root.current!
    const main = el.querySelector<HTMLElement>('main')!
    const reduce = still()
    let ctx: gsap.Context | null = null
    let alive = true
    const pop = popRef.current
    const build = () => { if (!alive) return; ctx = gsap.context(() => {
      if (reduce || pop) return /* coming Back: the page is already known; it appears exactly as it was, no reveals */
      const travel = isTouch() ? 14 : 24
      const open = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: loaderRef.current ? LOADER_MS / 1000 : 0 })
      if (firstLoad) { open.from(el.querySelector('[data-cap]'), { yPercent: -180, duration: 0.9 }, 0.15); firstLoad = false }
      const hmask = main.querySelector<HTMLElement>('[data-hmask]')
      if (hmask) {
        open.fromTo(hmask, { clipPath: 'inset(5% 4% 5% 4% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 1.4, ease: 'ugSmooth' }, 0)
        const img = hmask.querySelector(':scope > img')
        if (img) open.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'ugSmooth' }, 0)
      }
      const lines = main.querySelectorAll('[data-line]')
      if (lines.length) open.from(lines, { yPercent: 110, duration: 0.9, stagger: 0.1 }, hmask ? 0.35 : 0.1)
      const rule = main.querySelector('[data-rule]')
      if (rule) open.from(rule, { scaleX: 0, duration: 0.9, ease: 'ugSmooth' }, 0.5)
      const opens = main.querySelectorAll('[data-open]')
      if (opens.length) open.from(opens, { y: travel * 0.7, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' }, hmask ? 0.6 : 0.3)
      const finish = (e: KeyboardEvent) => { if (e.key === 'Tab') open.progress(1) }
      document.addEventListener('keydown', finish)
      const rvDelay = loaderRef.current ? LOADER_MS / 1000 : 0
      main.querySelectorAll<HTMLElement>('[data-rv]').forEach((t) => {
        gsap.from(t, { y: travel, autoAlpha: 0, duration: 0.8, delay: rvDelay, ease: 'ugSmooth', scrollTrigger: { trigger: t, start: 'top 90%', once: true } })
      })
      main.querySelectorAll<HTMLElement>('[data-rv-g]').forEach((g) => {
        gsap.from(g.children, { y: travel, autoAlpha: 0, duration: 0.8, delay: rvDelay, ease: 'ugSmooth', stagger: 0.07, scrollTrigger: { trigger: g, start: 'top 88%', once: true } })
      })
      main.querySelectorAll<HTMLElement>('[data-rv-img]').forEach((f) => {
        const img = f.querySelector('img')
        if (img) gsap.from(img, { scale: 1.08, duration: 1.4, ease: 'ugSmooth', scrollTrigger: { trigger: f, start: 'top 92%', once: true } })
      })
      const revealFocused = (e: FocusEvent) => {
        const t = e.target as HTMLElement
        ScrollTrigger.getAll().forEach((st) => { const tr = st.trigger as HTMLElement | null; if (tr && (tr === t || tr.contains(t) || t.contains(tr))) st.animation?.progress(1) })
      }
      main.addEventListener('focusin', revealFocused)
      return () => { document.removeEventListener('keydown', finish); main.removeEventListener('focusin', revealFocused) }
    }, el); ScrollTrigger.refresh() }
    if (!document.fonts) build()
    else Promise.all(['400 16px UgS', '500 16px UgD'].map((f) => document.fonts.load(f))).then(() => document.fonts.ready).then(build, build)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { alive = false; window.removeEventListener('load', refresh); ctx?.revert() }
  }, [loc.pathname])

  const loaderRef = useRef(loader)
  loaderRef.current = loader
  const closeBanner = () => { setBanner(false); try { sessionStorage.setItem('ug-banner', '0') } catch { /* private mode */ } }

  let body: ReactNode
  if (sub === '') body = <Home />
  else if (page === 'kassamal') body = <KassamalPage />
  else if (page === 'kassagerd') body = <KassagerdPage />
  else if (page === 'verslun') body = seg[1] ? <ProductPage slug={seg[1]} /> : <ShopPage />
  else if (page === 'listinn') body = <ListPage />
  else if (page === 'fyrirspurn') body = <RequestPage />
  else if (page === 'um-okkur') body = <AboutPage />
  else if (page === 'afgreidsla') body = <InboxPage />
  else if (page === 'personuvernd') body = <PrivacyPage />
  else body = <NotFound />

  return (
    <div ref={root} className={`ug${menu ? ' menu-open' : ''}`} id="efst" lang="is" data-banner={banner ? '1' : '0'} data-sticky="0">
      <style>{CSS}</style>
      <PreviewChrome company={company} />
      <a className="skip" href="#efni">Fara í efni</a>

      <div className="banner" role="region" aria-label="Tilkynning">
        <span>Kassar í áskrift<span className="hide-s">: minna í senn, oftar, og þú ert í forgangi</span>.</span>
        <Link to={to('fyrirspurn?askrift=1')}>Setja upp</Link>
        <button type="button" className="x" onClick={closeBanner} aria-label="Loka tilkynningu"><X size={15} aria-hidden="true" /></button>
      </div>
      <header className="hdr"><Header sub={sub} onMenu={() => setMenu(true)} /></header>

      {menu && (
        <div className="ug-menu-panel" ref={menuRef} role="dialog" aria-modal="true" aria-label="Valmynd" data-lenis-prevent="">
          <div className="mtop">
            <img src={A('brand/logo.png')} alt="Umbúðagerðin" width={856} height={203} />
            <button type="button" className="mx" onClick={() => setMenu(false)} aria-label="Loka valmynd"><X size={20} strokeWidth={1.6} aria-hidden="true" /></button>
          </div>
          <div className="mgroups">
            {NAV.map((g) => (
              <nav key={g.key} className="mg" aria-label={g.label} data-mi="">
                <p>{g.label}</p>
                {g.items.map((i) => <Link key={i.k} to={to(i.k)} aria-current={sub === i.k ? 'page' : undefined} onClick={() => setMenu(false)}>{i.label}</Link>)}
              </nav>
            ))}
          </div>
          <div className="mfoot" data-mi="">
            <a className="big num" href={`tel:${CONTACT.tel}`}><Phone size={20} aria-hidden="true" />{CONTACT.phone}</a>
            <button type="button" onClick={openChat}><MessageCircle size={17} aria-hidden="true" />Spyrja aðstoðarmanninn</button>
            <p>{CONTACT.hoursShort}</p>
          </div>
        </div>
      )}

      <MotionConfig reducedMotion="user"><main id="efni" key={loc.key} className={navType === 'PUSH' && !still() ? 'ug-in' : ''}>{body}</main></MotionConfig>
      {loader && <Loader onDone={loaderDone} />}

      <footer className="ug-foot">
        <div className="wrap">
          <div className="ftop">
            <div className="fbrand">
              <img src={A('brand/logo-white.png')} alt="Umbúðagerðin" width={856} height={203} />
              <b>{CONTACT.slogan}.</b>
              <p>{CONTACT.summary}</p>
            </div>
            <div className="fnav">
              <div>
                <h3>{CONTACT.street}</h3>
                <p>{CONTACT.town}</p>
                <a className="num" href={`tel:${CONTACT.tel}`}>Sími {CONTACT.phone}</a>
                <a href={mailHref(CONTACT.email)}><Mail size={13} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />{CONTACT.email}</a>
              </div>
              <div>
                <h3>Opið</h3>
                <p>Mán. til fim. 8.30 til 16.30</p>
                <p>Fös. 8.30 til 15.00</p>
                <p>VSK-númer {CONTACT.vsk}</p>
              </div>
              <div>
                <h3>Á vefnum</h3>
                {[['kassamal', 'Kassamál'], ['kassagerd', 'Kassagerð'], ['verslun', 'Vefverslun'], ['listinn', 'Pöntunarlistinn'], ['fyrirspurn?askrift=1', 'Kassar í áskrift'], ['um-okkur', 'Um okkur']].map(([k, l]) => <Link key={k} to={to(k)}>{l}</Link>)}
              </div>
            </div>
          </div>
          <div className="fdim" aria-hidden="true"><i /><span className="num">L {CONTACT.street} · B Hafnarfjörður · H síðan 2014</span><i /></div>
          <div className="flegal">
            <p>{CONTACT.legal} · Kt. {CONTACT.kt} · <a href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a> · <Link to={to('personuvernd')}>Persónuvernd</Link> · <Link to={to('afgreidsla')}>Afgreiðsla</Link></p>
            <SndrBadge />
          </div>
          <p className="proto">Frumgerð: hugmynd að nýjum vef, ekki vefur Umbúðagerðarinnar. Texti, verð, vörunúmer og vörumyndir eru af umbudagerdin.is og úr vefverslun hennar, sótt 15. október 2026; {PRODUCTS.length} af {SHOP_TOTAL} vörum eru sýndar og verð geta breyst. Afsláttarþrepin eru sýnishorn. Formin senda ekkert; beiðnir eru geymdar í þínum vafra. Aðstoðarmaðurinn svarar aðeins út frá því sem stendur á þessum vef.</p>
        </div>
      </footer>

      <div className="ug-sticky" aria-label="Flýtileiðir">
        <a href={`tel:${CONTACT.tel}`}><Phone size={15} aria-hidden="true" />Hringja</a>
        <Link to={to('kassamal')}>Kassamál</Link>
        <button type="button" onClick={openChat}><MessageCircle size={15} aria-hidden="true" />Spyrja</button>
      </div>
      <MotionConfig reducedMotion="user"><AddedPanel /></MotionConfig>
    </div>
  )
}
