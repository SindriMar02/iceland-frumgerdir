import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Download, ExternalLink, Mail, MessageCircle, Minus, Phone, Plus, ShoppingBag, SlidersHorizontal, Trash2, X, Menu } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { SndrBadge } from '../SndrBadge'
import { setMetaDescription, setNoindex, setThemeColor } from '../../lib/preview'
import {
  A, CONTACT, EXTRAS, FREE_SHIPPING, HOURS, JSON_LD, KINDS, PEOPLE, PRODUCTS, RENTALS, RENTAL_TERMS, REQ_LABEL, ROUTE, SAMPLE_BOOKED, SAMPLE_NOTE,
  SAMPLE_REQUESTS, SEASON, SERVICES, SHOP_CATS, SHOP_NOTE, TRIPS, UNITS, WORKSHOP_FACTS,
  fmtDay, kindLabel, kr, loadRequests, photo, productBySlug, routeTo, saveRequest, unitBySlug, unitName,
  type Kind, type Photo, type Product, type Rental, type ReqKind, type Request, type Unit,
} from './data'
import { clearList, listCount, listTotal, loadTrip, setQty, toggle, useList } from './store'
import { answer, CHIPS, GREETING } from './chat'
import { CSS, PINE_INK } from './styles'

/*
 * Víkurverk — "Allt í ferðalagið". Round 3 (2026-10-10): the whole site re-cut in the
 * language of lightshiprv.com (Awwwards SOTD, premium travel trailers): a framed full-height
 * hero, a floating glass header, quiet sentence-case type at one weight, captioned photo
 * cards on native scroll rails, sand spec sheets, a sticky price bar on the vehicle page.
 * The shop follows Mammut's flagship store (filter rail, open product grid, small
 * "added" panel, a product page with fit before price); the questions follow Pebble.
 * Teardowns: 04-platform/sndr-teardowns/teardowns/{lightship,mammut,pebble}-vikurverk-2026-10-10,
 * _docs/vikurverk-reference-hunt-2026-10-10 (Codex REPORT.md for Mammut/Pebble).
 *
 * Motion budget (Sindri: "don't ruin the user friendliness with too much scroll motion"):
 * one opening per page, reveals that play once as content arrives, hover feedback.
 * No pinning, no scrubbed parallax, nothing that holds the scroll.
 *
 * Routes live under /preview/vikurverk/*; this component reads the sub-path.
 */

gsap.registerPlugin(ScrollTrigger, CustomEase)
CustomEase.create('vvSmooth', 'M0,0 C0.38,0 0.215,1 1,1')

const company = getPreviewCompany('vikurverk')
let pageLenis: Lenis | null = null
let firstLoad = true
const isTouch = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const to = (p = '') => (p ? `${ROUTE}/${p}` : ROUTE)
const mailHref = (e: string) => `mailto:${e}`
const ERGO = 'https://ergo.is/bilalan/'
const ADDED = 'vv-added'

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

type Tone = '' | 'white' | 'pine' | 'grey' | 'beige' | 'line' | 'glass' | 'glass-d'
function Btn({ to: path, href, label, tone = '', size = '', icon, onClick, ext, type, className = '' }: {
  to?: string; href?: string; label: string; tone?: Tone; size?: '' | 'lg' | 'sm'; icon?: ReactNode; onClick?: () => void; ext?: boolean; type?: 'submit' | 'button'; className?: string
}) {
  const inner = (
    <>
      <span className="lbl"><span>{label}</span><span aria-hidden="true">{label}</span></span>
      {icon}
    </>
  )
  const cls = `btn ${tone} ${size} ${className}`.replace(/\s+/g, ' ').trim()
  if (path !== undefined) return <Link className={cls} to={to(path)} onClick={onClick}>{inner}</Link>
  if (href) return <a className={cls} href={href} {...(ext ? { target: '_blank', rel: 'noopener' } : {})} onClick={onClick}>{inner}</a>
  return <button className={cls} type={type ?? 'button'} onClick={onClick}>{inner}</button>
}

function Lines({ lines }: { lines: ReactNode[] }) {
  return <>{lines.map((l, i) => <span key={i} className="lm"><span data-line="">{l}</span></span>)}</>
}

const ARROW = <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
const PLUS = <span className="ibtn" aria-hidden="true"><Plus size={16} strokeWidth={1.6} /></span>

/* a native scroll rail with arrows and dots (Lightship's carousels, without hijacking the wheel) */
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

/* ── navigation: three groups with dropdowns ────────────────────────────── */

type NavItem = { k: string; label: string; sub: string }
const NAV: { key: string; label: string; items: NavItem[]; img: Photo; cap: string }[] = [
  { key: 'vagnar', label: 'Vagnar', img: photo('u-prestige-620-cl-2', 'Setustofa í Hobby Prestige 620 CL'), cap: 'Hobby Prestige 620 CL', items: [
    { k: 'vagnar', label: 'Allir vagnar', sub: 'Nýir og notaðir, með verði og síum' },
    { k: 'vagnar?astand=notad', label: 'Notaðir vagnar', sub: 'Á sama lista og þeir nýju' },
    { k: 'uppitaka', label: 'Taka upp í', sub: 'Sendu fastanúmerið, fáðu mat' },
    { k: 'skodun', label: 'Bóka skoðun', sub: 'Komdu í Víkurhvarf 6' },
  ] },
  { key: 'leiga', label: 'Leiga', img: photo('scene-night', 'Hjólhýsi við fjörð á björtu sumarkvöldi'), cap: 'Sumarið 2027 er opið', items: [
    { k: 'leiga', label: 'Leiguvagnar', sub: 'Vika í senn, fimmtudag til miðvikudags' },
    ...RENTALS.map((r) => ({ k: `leiga/${r.key}`, label: r.name, sub: `${r.short}, ${kr(r.price)} á viku` })),
  ] },
  { key: 'thjonusta', label: 'Þjónusta', img: photo('scene-shop', 'Fortjald, stólar og grill við hjólhýsi'), cap: '1.635 vörur í versluninni', items: [
    { k: 'verslun', label: 'Verslun', sub: 'Fortjöld, grill, stólar og varahlutir' },
    { k: 'ferdalistinn', label: 'Ferðalistinn', sub: 'Allt sem fer með í ferðina' },
    { k: 'verkstaedi', label: 'Bóka verkstæði', sub: 'Skoðun, vetrarstandsetning, viðgerð' },
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
            <button type="button" aria-expanded={open === g.key} aria-controls={`dd-${g.key}`} aria-current={g.items.some((i) => i.k.split(/[/?]/)[0] === page) ? 'true' : undefined}
              onClick={() => setOpen(open === g.key ? null : g.key)}>
              {g.label}<ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <div className="panel" id={`dd-${g.key}`}>
              <ul>{g.items.map((i) => <li key={i.k}><Link to={to(i.k)} tabIndex={open === g.key ? 0 : -1}><b>{i.label}</b><span>{i.sub}</span></Link></li>)}</ul>
              <figure aria-hidden="true"><Pic p={g.img} sizes="180px" /><figcaption>{g.cap}</figcaption></figure>
            </div>
          </div>
        ))}
      </nav>
      <Link className="logo" to={to()} aria-label="Víkurverk, forsíða">
        <img className="lc" src={A('logo-t.png')} alt="" width={306} height={200} />
        <img className="lw" src={A('logo-white.png')} alt="" width={306} height={200} />
      </Link>
      <div className="acts">
        <Link className="bag" to={to('ferdalistinn')} aria-label={`Ferðalistinn, ${n} ${n === 1 ? 'vara' : 'vörur'}`}>
          <ShoppingBag size={19} strokeWidth={1.6} aria-hidden="true" />
          {n > 0 && <span className="n num" aria-hidden="true">{n}</span>}
        </Link>
        <Btn to="skodun" label="Bóka skoðun" />
        <button className="burger" type="button" onClick={onMenu} aria-label="Opna valmynd">
          <Menu size={20} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

type ChatEl = HTMLElement & { answerer?: typeof answer; open?: () => void }

/* ── cards ──────────────────────────────────────────────────────────────── */

function UnitCard({ x }: { x: Unit }) {
  const shot = x.imgs[0]
  return (
    <Link className="uc" to={to(`vagnar/${x.slug}`)}>
      <div className="ph">
        <span className="tags">
          <span className={`pill ${x.cond === 'ny' ? 'light' : 'solid'}`}>{x.cond === 'ny' ? 'Nýtt' : `Notað · ${x.year}`}</span>
          {x.flott && <span className="pill pine">Flott verð</span>}
        </span>
        <Pic className={`shot${x.plan ? ' has-plan' : ''}`} p={shot} sizes="(min-width: 1100px) 30vw, (min-width: 600px) 46vw, 92vw" />
        {x.plan && <Pic className="plan" p={x.plan} sizes="(min-width: 1100px) 30vw, (min-width: 600px) 46vw, 92vw" />}
      </div>
      <div className="bd">
        <p className="br">{x.brand} · {kindLabel(x.kind)}</p>
        <h3 className="nm" translate="no">{x.model}</h3>
        <p className="pr num">{kr(x.price)}</p>
        <p className="facts num">
          {x.sleeps && <span>Svefnpláss {x.sleeps}</span>}
          {x.weight && <span>{x.weight.toLocaleString('de-DE')} kg</span>}
          {x.length && <span>{x.length} cm</span>}
        </p>
      </div>
    </Link>
  )
}

function ProductCard({ p, sizes = '(min-width: 1100px) 22vw, (min-width: 700px) 30vw, 46vw' }: { p: Product; sizes?: string }) {
  const list = useList()
  const on = list.some((l) => l.slug === p.slug)
  return (
    <article className="pcard">
      <div className="media">
      <Link to={to(`verslun/${p.slug}`)} className="ph" aria-label={p.name}>
        <Pic p={p.img} sizes={sizes} />
      </Link>
      <button type="button" className="add" aria-pressed={on} onClick={() => { const was = on; toggle(p.slug); if (!was) window.dispatchEvent(new CustomEvent(ADDED, { detail: p.slug })) }}
        aria-label={on ? `Taka ${p.name} af ferðalistanum` : `Setja ${p.name} á ferðalistann`}>
        {on ? <Check size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
      </button>
      </div>
      <div className="bd">
        {p.brand && <p className="br">{p.brand}</p>}
        <h3 className="nm"><Link to={to(`verslun/${p.slug}`)}>{p.name}</Link></h3>
        <p className="pr num">{kr(p.price)}</p>
      </div>
    </article>
  )
}

/* next free weeks of a rental unit (sample bookings + anything requested in this browser) */
function bookedFor(key: string): number[] {
  const mine = loadRequests().filter((r) => r.kind === 'leiga' && r.detail.startsWith(`${key}:`)).flatMap((r) => r.detail.split(':')[1].split(',').map(Number))
  return [...(SAMPLE_BOOKED[key] ?? []), ...mine]
}
function freeWeeks(key: string, n = 3) {
  const b = bookedFor(key)
  return SEASON.filter((w) => !b.includes(w.i)).slice(0, n)
}

/* ── home ───────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="hero" aria-labelledby="h-hero">
      <div className="mask" data-hmask="">
        <Pic p={photo('scene-hero', 'Hjólhýsi og jeppi við vatn á hálendinu í kvöldsól, tvö sitja í stólum undir markísu')} sizes="100vw" eager />
        <div className="inner">
          <div className="copy">
            <h1 id="h-hero"><Lines lines={['Íslenska sumarið,', 'á hjólum.']} /></h1>
            <p className="sub" data-open="">Ný og notuð hjólhýsi, húsbílar og sporthýsi. Leiga á sumrin, verkstæði allt árið og verslun með allt sem fer með í ferðina.</p>
            <div className="cta" data-open="">
              <Btn to="vagnar" label="Skoða vagnana" tone="white" />
              <Btn to="leiga" label="Leiga sumarið 2027" tone="glass" />
            </div>
          </div>
          <div className="bot">
            <span className="rule" aria-hidden="true" data-rule="" />
            <p data-open="">Víkurverk · Víkurhvarfi 6, Kópavogi</p>
            <p data-open="">Opið virka daga, laugardaga á sumrin</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeIntro() {
  return (
    <section className="intro-c" aria-labelledby="h-intro">
      <p className="q" data-rv="">Víkurverk hefur selt hjólhýsi, húsbíla og ferðavagna frá 2006. Nýir og notaðir vagnar á einum lista, leiga á sumrin, verkstæði allt árið og verslun með það sem fer með í ferðina.</p>
      <h2 id="h-intro" className="h-3xl" data-rv="">Vagnar á staðnum.</h2>
    </section>
  )
}

const FEATURED: { slug: string; img: Photo; line: string }[] = [
  { slug: 'hobby-prestige-620-cl', img: photo('u-prestige-620-cl-2', 'Setustofa í Hobby Prestige 620 CL'), line: 'Rúmgóð setustofa fyrir fjóra' },
  { slug: 'randger-r560', img: photo('u-randger-r560-1', 'Randger R560 4x4 húsbíll'), line: 'Húsbíll með fjórhjóladrifi' },
  { slug: 'mink-s', img: photo('mink-life', 'Mink sporthýsi með markísu'), line: 'Hannaður á Íslandi' },
  { slug: 'adria-aviva-360-dk', img: photo('u-aviva-360-dk-1', 'Adria Aviva 360 DK hjólhýsi'), line: 'Létt, 750 kg, kojur fyrir börnin' },
  { slug: 'camp-let-north', img: photo('u-camplet-north-1', 'Camp-Let North tjaldvagn uppsettur'), line: 'Tjaldvagn sem tekur tvær mínútur' },
  { slug: 'hobby-de-luxe-460-ufe', img: photo('u-deluxe-460-ufe-2', 'Innrétting í Hobby De Luxe 460 UFe'), line: 'Hjónarúm og eldhús í fullri stærð' },
]
function Featured() {
  const items = FEATURED.map((f) => ({ ...f, x: unitBySlug(f.slug) })).filter((f) => f.x)
  return (
    <section className="wrap sec" style={{ paddingTop: 'var(--sp-lg)' }} aria-label="Vagnar á staðnum">
      <Rail label="Vagnar á staðnum" cw="calc((100% - 2 * var(--gutter)) / 3.15)">
        {items.map(({ slug, img, line, x }) => (
          <Link key={slug} className="pc" to={to(`vagnar/${slug}`)}>
            <div className="ph zoom"><Pic p={img} sizes="(min-width: 1000px) 32vw, (min-width: 600px) 46vw, 82vw" /></div>
            <div className="top"><span className="pill">{kindLabel(x!.kind)} · {x!.brand}</span><span className="pill">{x!.cond === 'ny' ? 'Nýtt' : 'Notað'}</span></div>
            <div className="bt"><div><h3 translate="no">{x!.model}</h3><p>{line} · <span className="num">{kr(x!.price)}</span></p></div>{PLUS}</div>
          </Link>
        ))}
      </Rail>
      <div style={{ marginTop: 'var(--sp-sm)' }}><Btn to="vagnar" label="Allir vagnar" tone="grey" icon={ARROW} /></div>
    </section>
  )
}

/* choose by the kind of trip (Pebble's use-case carousel: tabs synced to a native swipe track, no autoplay) */
const INTENTS: { k: string; tab: string; t: string; d: string; img: Photo; units: string[]; rent?: string; cta: [string, string] }[] = [
  { k: 'fjolskylda', tab: 'Fjölskyldan', t: 'Sumarfrí með allri fjölskyldunni', d: 'Svefnpláss fyrir fjóra, setustofa sem verður að rúmi og eldhús sem dugar í vikuna.', img: photo('u-prestige-620-cl-3', 'Eldhús í Hobby Prestige 620 CL'), units: ['hobby-prestige-620-cl', 'hobby-de-luxe-460-ufe'], rent: 'adora-593-uk', cta: ['Skoða hjólhýsin', 'vagnar?tegund=hjolhysi'] },
  { k: 'helgi', tab: 'Helgarferðir', t: 'Létt og nett um helgar', d: 'Vagnar sem venjulegur fólksbíll dregur. Mink er hannaður á Íslandi og vegur 520 kg.', img: photo('hero', 'Mink sporthýsi með markísu í kvöldsól'), units: ['mink-s', 'adria-aviva-360-dk'], cta: ['Hvað dregur bíllinn?', 'vagnar#drattargeta'] },
  { k: 'fjoll', tab: 'Allt árið', t: 'Hvert sem vegurinn liggur', d: 'Randger R560 er húsbíll með fjórhjóladrifi, byggður á Ford. Þú keyrir af stað án þess að tengja neitt aftan í.', img: photo('u-randger-r560-4', 'Innrétting í Randger R560 húsbíl'), units: ['randger-r560'], cta: ['Skoða húsbíla', 'vagnar?tegund=husbill'] },
  { k: 'profa', tab: 'Prófa fyrst', t: 'Leigðu viku áður en þú kaupir', d: 'Hjólhýsi eða Mink, vika í senn frá fimmtudegi. Eldhúsáhöld, útiborð og stólar fylgja.', img: photo('u-leiga-522-2', 'Innrétting í Adria Adora 522 UP leiguhjólhýsi'), units: [], rent: 'mink', cta: ['Sjá lausar vikur', 'leiga'] },
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
        <h2 id="h-int" className="h-2xl" data-rv="">Hvernig ferðast þú?</h2>
        <div className="itabs" role="tablist" aria-label="Tegund ferðalags" data-rv="">
          {INTENTS.map((x, i) => <button key={x.k} type="button" role="tab" aria-selected={at === i} aria-controls={`int-${x.k}`} onClick={() => go(i)}>{x.tab}</button>)}
        </div>
      </div>
      <ul ref={ref} className="itrack">
        {INTENTS.map((x, i) => {
          const r = x.rent ? RENTALS.find((y) => y.key === x.rent) : undefined
          return (
            <li key={x.k} id={`int-${x.k}`} role="tabpanel" aria-label={x.tab} data-on={at === i ? '1' : '0'} {...((at !== i ? { inert: '' } : {}) as Record<string, string>)}>
              <div className="icard">
                <div className="ipanel">
                  <p className="eyebrow">{x.tab}</p>
                  <h3 className="h-sm">{x.t}</h3>
                  <p className="muted">{x.d}</p>
                  <ul className="ifit">
                    {x.units.map((sl) => { const u = unitBySlug(sl)!; return <li key={sl}><Link to={to(`vagnar/${sl}`)} tabIndex={at === i ? 0 : -1}><span translate="no">{u.brand} {u.model}</span><span className="num">{kr(u.price)}</span></Link></li> })}
                    {r && <li><Link to={to(`leiga/${r.key}`)} tabIndex={at === i ? 0 : -1}><span translate="no">Leiga: {r.name}</span><span className="num">{kr(r.price)} á viku</span></Link></li>}
                  </ul>
                  <Btn to={x.cta[1]} label={x.cta[0]} icon={ARROW} />
                </div>
                <div className="iimg"><Pic p={x.img} sizes="(min-width: 1024px) 50vw, 90vw" /></div>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="wrap rail-ft" style={{ justifyContent: 'center' }}>
        <button type="button" className="ibtn" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Fyrri ferð"><ArrowLeft size={15} aria-hidden="true" /></button>
        <button type="button" className="ibtn" onClick={() => go(at + 1)} disabled={at === INTENTS.length - 1} aria-label="Næsta ferð"><ArrowRight size={15} aria-hidden="true" /></button>
      </div>
    </section>
  )
}

const WAYS: { t: string; d: string; to: string; img: Photo; tag: string }[] = [
  { t: 'Nýir og notaðir', d: 'Hobby, Adria, Fendt, Randger, Mink og Camp-Let.', to: 'vagnar', img: photo('showroom', 'Sýningarsalur Víkurverks'), tag: 'Sala' },
  { t: 'Taka vagninn upp í', d: 'Sendu fastanúmerið og fáðu mat.', to: 'uppitaka', img: photo('u-randger-r560-3', 'Randger R560 með opna hurð í sýningarsal'), tag: 'Uppítaka' },
  { t: 'Verkstæði allt árið', d: 'Skoðun, vetrarstandsetning og viðgerðir.', to: 'verkstaedi', img: photo('workshop', 'Hjólhýsi standsett á verkstæði Víkurverks'), tag: 'Verkstæði' },
  { t: 'Allt sem fer með', d: 'Fortjöld, grill, stólar og kælibox.', to: 'verslun', img: photo('scene-shop', 'Fortjald, stólar, borð og grill við hjólhýsi'), tag: 'Verslun' },
]
function Ways() {
  return (
    <section className="wrap sec" aria-labelledby="h-ways">
      <div className="center-head">
        <h2 id="h-ways" className="h-2xl" data-rv="">Frá fyrstu ferðinni<br />að vetrargeymslunni.</h2>
        <div data-rv=""><Btn to="skodun" label="Bóka skoðun" tone="grey" size="sm" /></div>
      </div>
      <ul className="ways" role="list" data-rv-g="">
        {WAYS.map((w) => (
          <li key={w.t}>
            <Link className="pc" to={to(w.to)}>
              <div className="ph zoom"><Pic p={w.img} sizes="(min-width: 1000px) 24vw, (min-width: 600px) 46vw, 92vw" /></div>
              <div className="top"><span>{w.tag}</span></div>
              <div className="bt"><div><h3>{w.t}</h3><p>{w.d}</p></div>{PLUS}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Look() {
  return (
    <section className="edge" aria-labelledby="h-look">
      <div className="look">
        <div className="ph" data-rv-img=""><Pic p={photo('u-prestige-620-cl-2', 'Setustofa og eldhús í Hobby Prestige 620 CL')} sizes="100vw" /></div>
        <div className="c">
          <h2 id="h-look" className="h-xl" data-rv="">Ferðalagið byrjar á því að skoða.</h2>
          <div data-rv=""><Btn to="skodun" label="Bóka skoðun" tone="glass" /></div>
        </div>
      </div>
      <div className="wrap" style={{ paddingInline: 'calc(var(--margin) - var(--edge))' }}>
        <div className="stmt">
          <p className="big" data-rv="">Komdu í Víkurhvarf, sestu inn og opnaðu skápana. Söluráðgjafi fer yfir svefnplássið, hvað bíllinn má draga og fjármögnun hjá Ergo, og metur vagninn þinn ef þú vilt taka hann upp í.</p>
          <div className="side" data-rv="">
            <p>{HOURS.shopSummer}.</p>
            <Btn to="uppitaka" label="Taka upp í" tone="line" size="sm" />
          </div>
        </div>
      </div>
    </section>
  )
}

function RentBand() {
  return (
    <section className="edge" aria-labelledby="h-rent">
      <div className="band">
        <div className="ph" data-rv-img=""><Pic p={photo('scene-night', 'Hjólhýsi við fjörð á björtu sumarkvöldi með ljós í gluggum')} sizes="100vw" /></div>
        <div className="in">
          <div className="copy">
            <span className="pill">Leiga · sumarið 2027</span>
            <h2 id="h-rent" className="h-xl" data-rv="">Vika í senn,<br />frá fimmtudegi.</h2>
            <p data-rv="">Hjólhýsi fyrir fjóra eða sjö, eða Mink fyrir tvo. Eldhúsáhöld, útiborð og stólar fylgja. Afhent kl. 13-15.</p>
            <div data-rv=""><Btn to="leiga" label="Sjá lausar vikur" tone="white" icon={ARROW} /></div>
          </div>
          <div className="glass" data-rv="">
            {RENTALS.map((r) => {
              const fw = freeWeeks(r.key, 1)[0]
              return (
                <Link key={r.key} to={to(`leiga/${r.key}`)}>
                  <img src={r.img.src} srcSet={r.img.srcSet} sizes="64px" alt="" width={64} height={48} loading="lazy" />
                  <span><b translate="no">{r.name}</b><small>{r.short} · svefnpláss {r.sleeps}{fw ? ` · laus ${fw.label}` : ''}</small></span>
                  <span className="pr num">{kr(r.price)}<br /><small>á viku</small></span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const CAT_IMG: Record<string, string> = { fortjold: 'fortjald-club-air-pro-260s-kampa-dometic', grill: 'o-grill-3500-rautt', stolar: 'stoll-aravel-3d-m-svartur-brunner', vagninn: 'troppur-king' }
function ShopHome() {
  const t = TRIPS.find((x) => x.key === 'sumarfri')!
  const total = t.items.reduce((a, [sl, q]) => a + (productBySlug(sl)?.price ?? 0) * q, 0)
  const picks = ['fortjald-club-air-pro-260s-kampa-dometic', 'o-grill-3500-rautt', 'stoll-aravel-3d-m-svartur-brunner', 'kaelibox-polarys-freeze-sz-30l-brunner', 'troppur-king', 'level-up-kit-m-tosku', 'gashitari-42-kw-fmt']
  return (
    <section className="wrap sec" id="verslun" aria-labelledby="h-shop">
      <div className="shead">
        <div className="t"><h2 id="h-shop" className="h-xl" data-rv="">Verslun</h2><p data-rv="">1.635 vörur fyrir ferðina og vagninn. Frí heimsending á pöntunum yfir 20.000 kr.</p></div>
        <div className="tools" data-rv=""><Btn to="verslun" label="Öll verslunin" tone="grey" icon={ARROW} /></div>
      </div>
      <ul className="cats" role="list" data-rv-g="">
        {SHOP_CATS.filter((c) => CAT_IMG[c.key]).map((c) => {
          const pr = productBySlug(CAT_IMG[c.key])!
          return (
            <li key={c.key}>
              <Link className="cat" to={to(`verslun?flokkur=${c.key}`)}>
                <div className="ph zoom"><Pic p={pr.img} sizes="(min-width: 900px) 22vw, 46vw" /></div>
                <b>{c.label}<ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" /></b>
                <small className="num">{c.count} vörur</small>
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="editorial">
        <div className="ph" data-rv-img=""><Pic p={photo('scene-shop', 'Uppblásið fortjald með stólum, borði, kæliboxi og grilli við hjólhýsi')} sizes="(min-width: 900px) 58vw, 100vw" /></div>
        <div className="tl2" data-rv="">
          <h3>Ferðalistinn</h3>
          <p>Byrjaðu á tilbúnum lista fyrir helgarferð, sumarfríið eða haustið, lagaðu magnið og sendu pöntunina.</p>
          <ul aria-label="Sumarfríið, ferðalisti">
            {t.items.slice(0, 4).map(([sl, q]) => { const pr = productBySlug(sl)!; return <li key={sl}><img src={pr.img.src} alt="" width={48} height={48} loading="lazy" /><span>{pr.name}</span><span className="num muted">{q} stk.</span></li> })}
          </ul>
          <div className="tot"><span className="small muted">Sumarfríið · {t.items.length} vörur</span><b className="num">{kr(total)}</b></div>
          <div style={{ marginTop: 16 }}><Btn to="ferdalistinn?ferd=sumarfri" label="Opna ferðalistann" icon={ARROW} /></div>
        </div>
      </div>
      <Rail label="Vinsælt í versluninni" pr cw="calc((100% - 3 * var(--gutter)) / 4.2)">
        {picks.map((sl) => <ProductCard key={sl} p={productBySlug(sl)!} sizes="(min-width: 1000px) 23vw, 46vw" />)}
      </Rail>
    </section>
  )
}

function People() {
  return (
    <section className="wrap sec" aria-labelledby="h-people">
      <div className="shead"><div className="t"><h2 id="h-people" className="h-xl" data-rv="">Fólkið í Víkurhvarfi</h2><p data-rv="">Skoðaðu vagninn með söluráðgjafa, spurðu um fjármögnun hjá Ergo eða láttu meta vagninn þinn upp í.</p></div></div>
      <ul className="ppl" role="list" data-rv-g="">
        {PEOPLE.map((p) => <li key={p.email}><a href={mailHref(p.email)}><b>{p.name}</b><span>{p.role}</span><small>{p.email}</small></a></li>)}
      </ul>
    </section>
  )
}

const NEXT: { q: string; a: string; link: [string, string] }[] = [
  { q: 'Get ég tekið vagninn minn upp í?', a: 'Já. Sendu fastanúmer, gerð og árgerð og söluráðgjafi metur vagninn, upp í nýjan eða í umboðssölu.', link: ['Senda vagninn til mats', 'uppitaka'] },
  { q: 'Hvenær er hægt að bóka leigu?', a: 'Sumarið 2027 er opið. Leigan er vika í senn, frá fimmtudegi til miðvikudags, með afhendingu kl. 13-15.', link: ['Sjá lausar vikur', 'leiga'] },
  { q: 'Þarf ég sérstök réttindi til að draga hjólhýsi?', a: 'Ökuréttindi gefin út fyrir 15. ágúst 1997 gilda sjálfkrafa. Yngri réttindum þarf að bæta við. Dráttargeta bílsins þarf að ná leyfilegri heildarþyngd vagnsins.', link: ['Hvað dregur bíllinn?', 'vagnar#drattargeta'] },
  { q: 'Er hægt að fá fjármögnun?', a: 'Víkurverk vinnur með Ergo. Þú getur reiknað lánið á vef Ergo og farið yfir það með söluráðgjafa þegar þú kemur að skoða.', link: ['Bóka skoðun', 'skodun'] },
  { q: 'Hvenær er verkstæðið opið?', a: 'Verkstæðið er opið allt árið, virka daga kl. 8-17. Stærri tjónaviðgerðir eru unnar frá 1. september til 1. apríl.', link: ['Bóka verkstæði', 'verkstaedi'] },
]
function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="edge" aria-labelledby="h-next">
      <div className="faq">
        <div className="center-head"><h2 id="h-next" className="h-xl" data-rv="">Spurt og svarað</h2></div>
        <ul className="acc-list" role="list" data-rv-g="">
          {NEXT.map((n, i) => {
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
  const [at, al, ah] = a ?? ['Talaðu við söluráðgjafa', 'Spurningar um vagnana', `tel:${CONTACT.tel}`]
  const [bt, bl, bh] = b ?? ['Bóka skoðun í Víkurhvarfi', 'Komdu og sjáðu', 'skodun']
  return (
    <div className="edge">
      <div className="tiles">
        {ah.startsWith('tel:') || ah.startsWith('mailto:')
          ? <a className="tile" href={ah}><small>{al}</small><span className="tb"><b>{at}</b><span className="ibtn light" aria-hidden="true"><ArrowRight size={15} /></span></span></a>
          : <Link className="tile" to={to(ah)}><small>{al}</small><span className="tb"><b>{at}</b><span className="ibtn light" aria-hidden="true"><ArrowRight size={15} /></span></span></Link>}
        <Link className="tile pine" to={to(bh)}><small>{bl}</small><span className="tb"><b>{bt}</b><span className="ibtn light" aria-hidden="true"><ArrowRight size={15} /></span></span></Link>
      </div>
    </div>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <HomeIntro />
      <Featured />
      <Intents />
      <Ways />
      <Look />
      <RentBand />
      <ShopHome />
      <People />
      <Faq />
      <Tiles />
    </>
  )
}

/* towing: their own contract rule (the car's towing capacity must be at least the trailer's permitted total weight) */
const TOW = UNITS.filter((u) => u.cond === 'ny' && u.kind !== 'husbill' && u.maxWeight).sort((a, b) => a.maxWeight! - b.maxWeight!)
const TMIN = 500
const TMAX = 2200
const pct = (kg: number) => ((kg - TMIN) / (TMAX - TMIN)) * 100
function Towing() {
  const [kg, setKg] = useState(1300)
  const fits = TOW.filter((u) => u.maxWeight! <= kg)
  return (
    <section className="tow" id="drattargeta" aria-labelledby="h-tow">
      <div className="tow-head">
        <h2 id="h-tow" className="h-lg" data-rv="">Hvað dregur bíllinn?</h2>
        <p data-rv="">Dráttargeta bílsins þarf að vera jöfn eða meiri en leyfileg heildarþyngd vagnsins. Hún stendur í skráningarskírteininu. Dragðu sleðann.</p>
      </div>
      <label className="tow-in" htmlFor="tow-kg">
        <span>Bíllinn má draga</span>
        <output htmlFor="tow-kg" className="num" aria-live="polite">{kg.toLocaleString('de-DE')} kg</output>
        <input id="tow-kg" type="range" min={600} max={2100} step={50} value={kg} onChange={(e) => setKg(Number(e.target.value))}
          aria-valuetext={`${kg} kíló, ${fits.length} af ${TOW.length} vögnum passa`} />
      </label>
      <div className="scale" aria-hidden="true">
        <div className="zone" style={{ width: `${pct(kg)}%` }} />
        {[750, 1000, 1500, 2000].map((t) => <span key={t} className="tick num" style={{ left: `${pct(t)}%` }}>{t.toLocaleString('de-DE')}</span>)}
        {TOW.map((u, i) => (
          <span key={u.slug} className={`pin l${i % 3}${u.maxWeight! <= kg ? ' ok' : ''}`} style={{ left: `${pct(u.maxWeight!)}%` }}>
            <i /><em translate="no">{u.brand === 'Mink' ? u.model : `${u.brand} ${u.model}`}</em>
          </span>
        ))}
      </div>
      <p className="tow-sum"><b className="num">{fits.length} af {TOW.length}</b> nýjum vögnum í úrtakinu passa.{fits.length < TOW.length && ` Þyngri: ${TOW.filter((u) => u.maxWeight! > kg).map((u) => u.model).join(', ')}.`}</p>
      <ul className="tow-cards" role="list">
        {TOW.map((u) => {
          const ok = u.maxWeight! <= kg
          return (
            <li key={u.slug} data-ok={ok ? '1' : '0'}>
              <Link to={to(`vagnar/${u.slug}`)} className="tc">
                <div className="ph"><Pic className="plan" p={u.plan ?? u.imgs[0]} sizes="(min-width: 900px) 15vw, 45vw" /></div>
                <span className="muted">{u.brand}</span>
                <b translate="no">{u.model}</b>
                <span className="num kg">{u.maxWeight!.toLocaleString('de-DE')} kg leyfileg</span>
                <span className={`fit${ok ? ' ok' : ''}`}>{ok ? 'Passar' : 'Of þungt'}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <p className="note">Ökuréttindi gefin út fyrir 15. ágúst 1997 gilda til að draga hjólhýsi; yngri réttindum þarf að bæta við (af leigusíðum Víkurverks). Leyfileg heildarþyngd úr bæklingum Víkurverks.</p>
    </section>
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
      <input id={id} name={name} type={type} required={required} spellCheck={type === 'email' || name === 'fn' || name === 'tjonsnr' ? false : undefined} autoComplete={auto} inputMode={mode} placeholder={placeholder} defaultValue={defaultValue}
        aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined} />
      {hint && !error && <small className="hint" id={`${id}-h`}>{hint}</small>}
      {error && <p className="err" id={`${id}-e`}>{error}</p>}
    </label>
  )
}
function Contact({ err, emailRequired = false }: { err: Record<string, string>; emailRequired?: boolean }) {
  return (
    <>
      <Field label="Nafn" name="nafn" required auto="name" error={err.nafn} />
      <div className="two">
        <Field label="Sími" name="simi" type="tel" required auto="tel" mode="tel" error={err.simi} />
        <Field label="Netfang" name="netfang" type="email" required={emailRequired} auto="email" mode="email" error={err.netfang} />
      </div>
    </>
  )
}
function readContact(fd: FormData, er: Record<string, string>, emailRequired = false) {
  const nafn = String(fd.get('nafn') ?? '').trim()
  const simi = String(fd.get('simi') ?? '').trim()
  const netfang = String(fd.get('netfang') ?? '').trim()
  if (!nafn) er.nafn = 'Skrifaðu nafnið þitt.'
  if (simi.replace(/\D/g, '').length < 7) er.simi = 'Símanúmerið þarf að vera sjö tölustafir.'
  if ((emailRequired || netfang) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(netfang)) er.netfang = 'Netfangið lítur ekki rétt út.'
  return { nafn, simi, netfang }
}
function focusFirst(form: HTMLFormElement, er: Record<string, string>) {
  const k = Object.keys(er)[0]
  if (k) (form.querySelector(`[name="${k}"]`) as HTMLElement | null)?.focus()
}

function Done({ r, back }: { r: Request; back: ReactNode }) {
  return (
    <div className="done" role="status">
      <h2>Beiðnin er komin.</h2>
      <p style={{ marginTop: 10 }} className="muted">{r.kind === 'leiga' ? 'Víkurverk staðfestir vikuna og sendir greiðsluhlekk. Vikan er frátekin á meðan.' : 'Svar berst í símann eða netfangið sem þú gafst upp.'}</p>
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

/* ── catalogue (Mammut's listing: count, filter panel, sort, active chips) ── */

const SORTS: Record<string, { label: string; fn: (a: Unit, b: Unit) => number }> = {
  'verd-upp': { label: 'Verð: lægst fyrst', fn: (a, b) => a.price - b.price },
  'verd-nidur': { label: 'Verð: hæst fyrst', fn: (a, b) => b.price - a.price },
  thyngd: { label: 'Léttast fyrst', fn: (a, b) => (a.weight ?? 9e9) - (b.weight ?? 9e9) },
}
const BRAND_KEYS = [...new Map(UNITS.map((u) => [u.brandKey, u.brand])).entries()]

function Chips({ name, value, opts, onPick }: { name: string; value: string; opts: [string, string][]; onPick: (v: string) => void }) {
  return (
    <div className="chips" role="group" aria-label={name}>
      {opts.map(([v, l]) => <button key={v || 'all'} type="button" className="chip" aria-pressed={value === v} onClick={() => onPick(v)}>{l}</button>)}
    </div>
  )
}

const FLABEL: Record<string, (v: string) => string> = {
  astand: (v) => (v === 'ny' ? 'Nýtt' : 'Notað'),
  tegund: (v) => KINDS.find((k) => k.key === v)?.plural ?? v,
  merki: (v) => BRAND_KEYS.find(([k]) => k === v)?.[1] ?? v,
  svefn: (v) => `${v}+ svefnpláss`,
  thyngd: (v) => `Allt að ${Number(v).toLocaleString('de-DE')} kg`,
}

function CatalogPage() {
  const [sp, setSp] = useSearchParams()
  const [open, setOpen] = useState(false)
  const f = { astand: sp.get('astand') ?? '', tegund: sp.get('tegund') ?? '', merki: sp.get('merki') ?? '', svefn: sp.get('svefn') ?? '', thyngd: sp.get('thyngd') ?? '', rod: sp.get('rod') ?? 'verd-upp' }
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }) }
  const items = UNITS.filter((u) => (!f.astand || u.cond === f.astand) && (!f.tegund || u.kind === f.tegund) && (!f.merki || u.brandKey === f.merki)
    && (!f.svefn || (u.sleepsN ?? 0) >= Number(f.svefn)) && (!f.thyngd || (u.weight ?? 9e9) <= Number(f.thyngd))).sort((SORTS[f.rod] ?? SORTS['verd-upp']).fn)
  const activeKeys = ['astand', 'tegund', 'merki', 'svefn', 'thyngd'].filter((k) => sp.get(k))
  return (
    <div className="page"><div className="wrap">
      <Title title={['Vagnar']} lede="Nýir og notaðir vagnar á einum lista, með verði, svefnplássi og eigin þyngd." />
      <div className="fbar">
        <p className="count" aria-live="polite"><span className="num">{items.length}</span> {items.length === 1 ? 'vagn' : 'vagnar'}</p>
        <button type="button" className="chip" aria-expanded={open} aria-controls="fpanel" onClick={() => setOpen(!open)}><SlidersHorizontal size={15} aria-hidden="true" />{open ? 'Fela síur' : 'Síur'}{activeKeys.length ? ` (${activeKeys.length})` : ''}</button>
        <label><span className="sr">Röðun</span>
          <select value={f.rod} onChange={(e) => set('rod', e.target.value === 'verd-upp' ? '' : e.target.value)}>
            {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
        </label>
      </div>
      {open && (
        <div className="fpanel" id="fpanel">
          <div className="fg"><span>Ástand</span><Chips name="Ástand" value={f.astand} onPick={(v) => set('astand', v)} opts={[['', 'Allt'], ['ny', 'Nýtt'], ['notad', 'Notað']]} /></div>
          <div className="fg"><span>Tegund</span><Chips name="Tegund" value={f.tegund} onPick={(v) => set('tegund', v)} opts={[['', 'Allar'], ...KINDS.map((k) => [k.key, k.plural] as [string, string])]} /></div>
          <div className="fg"><span>Merki</span><Chips name="Merki" value={f.merki} onPick={(v) => set('merki', v)} opts={[['', 'Öll'], ...BRAND_KEYS]} /></div>
          <div className="fg"><span>Svefnpláss</span><Chips name="Svefnpláss" value={f.svefn} onPick={(v) => set('svefn', v)} opts={[['', 'Skiptir ekki'], ['3', '3+'], ['4', '4+'], ['5', '5+']]} /></div>
          <div className="fg"><span>Eigin þyngd</span><Chips name="Eigin þyngd" value={f.thyngd} onPick={(v) => set('thyngd', v)} opts={[['', 'Skiptir ekki'], ['750', 'Allt að 750 kg'], ['1300', 'Allt að 1.300 kg'], ['1700', 'Allt að 1.700 kg']]} /></div>
        </div>
      )}
      {activeKeys.length > 0 && (
        <div className="chips" style={{ marginBottom: 'var(--sp-sm)' }} aria-label="Virkar síur">
          {activeKeys.map((k) => <button key={k} type="button" className="chip" aria-pressed="true" onClick={() => set(k, '')} aria-label={`Fjarlægja síu: ${FLABEL[k](sp.get(k)!)}`}>{FLABEL[k](sp.get(k)!)}<X size={14} aria-hidden="true" /></button>)}
          <button type="button" className="chip" onClick={() => { const n = new URLSearchParams(); if (sp.get('rod')) n.set('rod', sp.get('rod')!); setSp(n, { replace: true }) }}>Hreinsa allt</button>
        </div>
      )}
      {items.length ? (
        <motion.ul className="ugrid" role="list" layout>
          <AnimatePresence mode="popLayout">
            {items.map((x) => (
              <motion.li key={x.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}>
                <UnitCard x={x} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="empty">
          <h3>Enginn vagn passar</h3>
          <p className="muted">Prófaðu að slaka á einni síu. Allt úrvalið hjá Víkurverki er stærra en úrtakið hér.</p>
          <Btn label="Hreinsa síur" onClick={() => setSp(new URLSearchParams(), { replace: true })} />
        </div>
      )}
      <p className="note">{SAMPLE_NOTE}</p>
      <Towing />
    </div><div style={{ height: 'var(--sp-2xl)' }} /></div>
  )
}

/* ── the vehicle page (Lightship's AE.1 page) ───────────────────────────── */

function DetailPage({ slug }: { slug: string }) {
  const x = unitBySlug(slug)
  const [view, setView] = useState(0)
  if (!x) return <NotFound />
  const ext = x.imgs[0]
  const inside = x.imgs.find((_, i) => i > 0) ?? x.imgs[0]
  const views: { k: string; p: Photo; plan?: boolean }[] = [{ k: 'Að utan', p: ext }, { k: 'Að innan', p: inside }, ...(x.plan ? [{ k: 'Grunnmynd', p: x.plan, plan: true }] : [])]
  const figs: [string, string][] = [
    ['Svefnpláss', x.sleeps ?? '-'],
    ['Eigin þyngd', x.weight ? `${x.weight.toLocaleString('de-DE')} kg` : '-'],
    ['Lengd húss', x.length ? `${x.length} cm` : '-'],
    [x.cond === 'ny' ? 'Ástand' : 'Árgerð', x.cond === 'ny' ? 'Nýr' : (x.year ?? '-')],
  ].filter(([, v]) => v !== '-') as [string, string][]
  const rest = x.imgs.slice(1)
  return (
    <>
      <section className="dhero" aria-labelledby="h-unit" data-dhero="">
        <div className="mask" data-hmask="">
          <Pic p={ext} sizes="100vw" eager />
          <Link className="crumb" to={to('vagnar')} data-open=""><ArrowLeft size={15} aria-hidden="true" />Allir vagnar</Link>
          <div className="in">
            <div>
              <div className="meta" data-open=""><span className="pill">{x.brand} · {kindLabel(x.kind)}</span><span className="pill">{x.cond === 'ny' ? 'Nýtt' : `Notað, ${x.year}`}</span>{x.flott && <span className="pill pine">Flott verð</span>}</div>
              <h1 id="h-unit" translate="no"><Lines lines={[x.model]} /></h1>
            </div>
            <p className="pr num" data-open="">{kr(x.price)}</p>
          </div>
        </div>
      </section>
      <div className="edge"><div className="figs" data-rv-g="" style={{ '--n': figs.length } as CSSProperties}>{figs.map(([k, v]) => <div key={k}><b className="num">{v}</b><span>{k}</span></div>)}</div></div>
      <div className="wrap">
        <div className="dgrid">
          <div className="dtext" data-rv="">{x.text.map((t) => <p key={t}>{t}</p>)}</div>
          <aside className="dside" data-rv="">
            <Btn to={`skodun?v=${x.slug}`} label="Bóka skoðun" size="lg" />
            <Btn to={`uppitaka?v=${x.slug}`} label="Taka minn upp í" tone="grey" size="lg" />
            <p className="fin">Fjármögnun: Víkurverk vinnur með Ergo. <a href={ERGO} target="_blank" rel="noopener">Reiknaðu lánið</a>.</p>
            <div className="sellers">
              {PEOPLE.slice(0, 3).map((p) => <a key={p.email} href={mailHref(p.email)}>{p.name}<span>{p.email}</span></a>)}
              <a href={`tel:${CONTACT.tel}`}>Sími<span className="num">{CONTACT.phone}</span></a>
            </div>
          </aside>
        </div>
        <section className="views" aria-labelledby="h-views">
          <div className="shead" style={{ marginBottom: 0 }}>
            <h2 id="h-views" className="h-lg" data-rv="">Skoðaðu {x.model}</h2>
            <div className="seg" role="group" aria-label="Sjónarhorn">{views.map((v, i) => <button key={v.k} type="button" aria-pressed={view === i} onClick={() => setView(i)}>{v.k}</button>)}</div>
          </div>
          <div className="stage" data-rv="">
            {views.map((v, i) => <Pic key={v.k} className={`${v.plan ? 'plan ' : ''}${view === i ? 'on' : ''}`} p={v.p} sizes="(min-width: 1700px) 1600px, 100vw" />)}
          </div>
        </section>
        {rest.length > 1 && (
          <section className="sec" aria-label="Fleiri myndir" style={{ paddingTop: 'var(--sp-lg)' }}>
            <Rail label="Fleiri myndir" cw="calc((100% - 2 * var(--gutter)) / 2.6)">
              {rest.map((p, i) => <div key={i} className="pc" style={{ '--ar': '4 / 3' } as CSSProperties}><div className="ph"><Pic p={p} sizes="(min-width: 1000px) 40vw, 82vw" /></div></div>)}
            </Rail>
          </section>
        )}
        <section className="sheet" aria-labelledby="h-specs">
          <div className="shead"><h2 id="h-specs" className="h-lg" data-rv="">Helstu upplýsingar</h2></div>
          <div className="panel" data-rv=""><dl>{x.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="num">{v}</dd></div>)}</dl></div>
          <div className="files">
            {x.pdf && <Btn href={x.pdf} ext label="Bæklingur (PDF)" tone="grey" icon={<Download size={15} aria-hidden="true" />} />}
            {x.v360 && <Btn href={x.v360} ext label="360° skoðun" tone="grey" icon={<ExternalLink size={15} aria-hidden="true" />} />}
          </div>
          <p className="note">Upplýsingar af {x.cond === 'ny' ? 'vikurverk.is og bæklingi Víkurverks' : 'söluskrá Víkurverks'}, 9. október 2026. Verð geta breyst.</p>
        </section>
      </div>
      <Tiles a={['Spurðu um þennan vagn', 'Söluráðgjafi svarar', `mailto:${CONTACT.email}`]} b={[`Bóka skoðun á ${x.model}`, 'Komdu og sjáðu', `skodun?v=${x.slug}`]} />
      <div className="buybar" aria-label="Verð og skoðun">
        <span className="bn"><b translate="no">{x.brand} {x.model}</b><span className="num">{kr(x.price)}</span></span>
        <Btn href={`tel:${CONTACT.tel}`} label="Hringja" tone="glass" />
        <Btn to={`skodun?v=${x.slug}`} label="Bóka skoðun" tone="white" className="bk" />
      </div>
    </>
  )
}

/* ── rental ─────────────────────────────────────────────────────────────── */

function RentalList() {
  return (
    <Page>
      <Title title={['Leiga']} lede="Þrír vagnar til leigu, vika í senn frá fimmtudegi til miðvikudags. Sjáðu lausar vikur sumarsins 2027 og sendu beiðni." />
      <ul className="rlist" role="list" data-rv-g="">
        {RENTALS.map((r) => {
          const fw = freeWeeks(r.key, 3)
          return (
            <li key={r.key}>
              <Link className="rcard" to={to(`leiga/${r.key}`)}>
                <div className="ph zoom"><Pic p={r.img} sizes="(min-width: 900px) 32vw, 100vw" /></div>
                <div className="bd">
                  <span className="eyebrow">{r.short} · svefnpláss {r.sleeps}</span>
                  <h2 translate="no">{r.name}</h2>
                  <p className="pp num">{kr(r.price)} á viku{r.peak ? <span className="muted">, {kr(r.peak)} um verslunarmannahelgi</span> : ''}</p>
                  <p className="muted small">{r.text}</p>
                  <div className="free">{fw.map((w) => <span key={w.i} className="num">{w.label}</span>)}</div>
                  <span className="btn grey sm" style={{ marginTop: 6 }}><span className="lbl"><span>Velja vikur</span><span aria-hidden="true">Velja vikur</span></span>{ARROW}</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
      <section style={{ marginTop: 'var(--sp-xl)' }} aria-labelledby="h-terms" className="book-grid">
        <div>
          <h2 id="h-terms" className="h-md" data-rv="">Skilmálar í stuttu máli</h2>
          <ul className="terms" style={{ marginTop: 24 }}>{RENTAL_TERMS.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <aside className="sumbox" aria-label="Aukalega">
          {Object.values(EXTRAS).map((e) => <div key={e.label}><span>{e.label}<br /><small className="muted">{e.note}</small></span><span className="num">{kr(e.price)}</span></div>)}
        </aside>
      </section>
      <p className="note">Dagatalið sýnir sumarið 2027 sett upp eins og sumarið 2026 á vikurverk.is (fimmtudagur til miðvikudags, 13. maí til 15. sept.) með verðum ársins 2026. Bókaðar vikur eru sýnishorn.</p>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

function RentalPage({ r }: { r: Rental }) {
  const booked = useMemo(() => bookedFor(r.key), [r.key])
  const [sel, setSel] = useState<number[]>([])
  const [ex, setEx] = useState<string[]>(['trygging'])
  const [err, setErr] = useState<Record<string, string>>({})
  const [done, setDone] = useState<Request | null>(null)
  const weeks = SEASON.filter((w) => sel.includes(w.i))
  const rent = weeks.reduce((a, w) => a + (w.peak && r.peak ? r.peak : r.price), 0)
  const extras = sel.length ? ex.reduce((a, k) => a + EXTRAS[k].price, 0) : 0
  const flip = (i: number) => setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i].sort((a, b) => a - b)))
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    if (!sel.length) er.vikur = 'Veldu að minnsta kosti eina viku.'
    const c = readContact(fd, er, true)
    setErr(er)
    if (Object.keys(er).length) { if (er.vikur) document.getElementById('cal')?.focus(); else focusFirst(e.currentTarget, er); return }
    setDone(saveRequest({ kind: 'leiga', title: `${r.name}, ${weeks.map((w) => w.label).join(' og ')}`, when: 'Sumar 2027', who: c.nafn, contact: `${c.simi}${c.netfang ? `, ${c.netfang}` : ''}`,
      detail: `${r.key}:${sel.join(',')}:${ex.join('+') || 'ekkert aukalega'}:${kr(rent + extras)}` }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  if (done) return <Page><Done r={done} back={<Btn to="leiga" label="Aftur í leigu" />} /><div style={{ height: 'var(--sp-xl)' }} /></Page>
  return (
    <Page>
      <Title crumb={{ to: 'leiga', label: 'Allir leiguvagnar' }} title={[r.name]} lede={`${r.text} ${kr(r.price)} á viku${r.peak ? `, ${kr(r.peak)} vikuna um verslunarmannahelgi` : ''}.`} />
      <div className="book-grid">
        <form className="form" onSubmit={submit} noValidate style={{ maxWidth: 'none' }}>
          <fieldset>
            <legend id="cal-l">Veldu vikur sumarið 2027 (fimmtudagur til miðvikudags)</legend>
            <div className="cal" id="cal" tabIndex={-1} role="group" aria-labelledby="cal-l" aria-describedby={err.vikur ? 'cal-e' : undefined}>
              {SEASON.map((w) => {
                const b = booked.includes(w.i)
                return (
                  <button key={w.i} type="button" className="wk" disabled={b} aria-pressed={sel.includes(w.i)} data-peak={w.peak && r.peak ? '1' : '0'} onClick={() => flip(w.i)}
                    aria-label={`${w.label}${b ? ', bókuð' : `, ${kr(w.peak && r.peak ? r.peak : r.price)}`}${w.peak && r.peak ? ', verslunarmannahelgi' : ''}`}>
                    <span className="s num">Vika {w.i + 1}</span>
                    <span className="d num">{w.label}</span>
                    <span className="p num">{b ? 'Bókuð' : kr(w.peak && r.peak ? r.peak : r.price)}</span>
                  </button>
                )
              })}
            </div>
            {err.vikur && <p className="err" id="cal-e">{err.vikur}</p>}
            <div className="legend"><span><i className="f" />Laus</span><span><i className="b" />Bókuð (sýnishorn)</span><span><i className="s" />Þitt val</span>{r.peak && <span><i className="pk" />Verslunarmannahelgi</span>}</div>
          </fieldset>
          <fieldset>
            <legend>Aukalega</legend>
            {r.extras.map((k) => (
              <label key={k} className="check">
                <input type="checkbox" checked={ex.includes(k)} onChange={() => setEx((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))} />
                <span style={{ margin: 0 }}>{EXTRAS[k].label}, {kr(EXTRAS[k].price)}<small className="hint" style={{ marginTop: 2 }}>{EXTRAS[k].note}</small></span>
              </label>
            ))}
          </fieldset>
          <Contact err={err} emailRequired />
          <label htmlFor="f-fjoldi"><span>Hversu mörg verða með? (valfrjálst)</span><input id="f-fjoldi" name="fjoldi" inputMode="numeric" /></label>
          <div className="acts"><Btn type="submit" label="Senda leigubeiðni" size="lg" /></div>
          <p className="proto-note">Víkurverk staðfestir og sendir greiðsluhlekk; ekkert er rukkað hér.</p>
        </form>
        <aside className="aside" aria-label="Samantekt">
          <div className="sumbox">
            <div><span>Vikur</span><span className="num">{sel.length || '-'}</span></div>
            <div><span>Leiga</span><span className="num">{kr(rent)}</span></div>
            <div><span>Aukalega</span><span className="num">{kr(extras)}</span></div>
            <div><span>Samtals</span><span className="num">{kr(rent + extras)}</span></div>
          </div>
          <div className="ph"><Pic p={r.imgs[0] ?? r.img} sizes="(min-width: 900px) 34vw, 100vw" /></div>
          <dl className="terms">{r.specs.map(([k, v]) => <li key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><dt>{k}</dt><dd className="num" style={{ color: 'var(--ink)' }}>{v}</dd></li>)}</dl>
        </aside>
      </div>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

/* ── forms: viewing, trade-in, workshop ─────────────────────────────────── */

const DAYS = ['sun.', 'mán.', 'þri.', 'mið.', 'fim.', 'fös.', 'lau.']
function openDays(n = 10) {
  const out: { v: string; label: string }[] = []
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + 1)
  while (out.length < n) {
    const wd = d.getUTCDay()
    const m = d.getUTCMonth() + 1
    if ((wd >= 1 && wd <= 5) || (wd === 6 && m >= 3 && m <= 8)) out.push({ v: d.toISOString().slice(0, 10), label: `${DAYS[wd]} ${fmtDay(d)}` })
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}
function weeksAhead(n = 8) {
  const out: { v: string; label: string }[] = []
  const d = new Date()
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() - day + 8)
  for (let i = 0; i < n; i++) {
    const s = new Date(d.getTime() + i * 7 * 864e5)
    const e = new Date(s.getTime() + 4 * 864e5)
    const t = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate() + 3))
    const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 4))
    const wk = 1 + Math.round(((t.getTime() - y0.getTime()) / 864e5 - 3 + ((y0.getUTCDay() + 6) % 7)) / 7)
    out.push({ v: `v${wk}`, label: `Vika ${wk}, ${fmtDay(s)} - ${fmtDay(e)}` })
  }
  return out
}
function Picked({ x }: { x: Unit }) {
  return (
    <div className="picked">
      <Pic p={x.imgs[0]} sizes="110px" />
      <div><b translate="no">{unitName(x)}</b><span className="num">{kr(x.price)} · {x.cond === 'ny' ? 'Nýtt' : `Notað, ${x.year}`}</span></div>
    </div>
  )
}

function ViewingPage() {
  const [sp] = useSearchParams()
  const [slug, setSlug] = useState(sp.get('v') ?? UNITS[1].slug)
  const [err, setErr] = useState<Record<string, string>>({})
  const [done, setDone] = useState<Request | null>(null)
  const days = useMemo(() => openDays(), [])
  const x = unitBySlug(slug) ?? UNITS[1]
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    const dag = String(fd.get('dagur') ?? '')
    const timi = String(fd.get('timi') ?? '')
    if (!dag) er.dagur = 'Veldu dag.'
    if (!timi) er.timi = 'Veldu tíma.'
    const c = readContact(fd, er)
    setErr(er)
    if (Object.keys(er).length) return focusFirst(e.currentTarget, er)
    const extra = [fd.get('fjarmognun') ? 'vill skoða fjármögnun' : '', fd.get('uppi') ? 'á vagn til að taka upp í' : ''].filter(Boolean).join(', ')
    setDone(saveRequest({ kind: 'skodun', title: unitName(x), when: `${days.find((d) => d.v === dag)?.label}, kl. ${timi}`, who: c.nafn, contact: `${c.simi}${c.netfang ? `, ${c.netfang}` : ''}`, detail: extra || 'Skoðun' }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  if (done) return <Page><Done r={done} back={<Btn to="vagnar" label="Aftur í vagna" />} /><div style={{ height: 'var(--sp-xl)' }} /></Page>
  return (
    <Page>
      <Title title={['Bóka skoðun']} lede="Veldu vagn, dag og tíma. Söluráðgjafi tekur á móti þér í Víkurhvarfi 6." />
      <div className="book-grid">
        <form className="form" onSubmit={submit} noValidate>
          <label htmlFor="f-v"><span>Vagn</span>
            <select id="f-v" value={slug} onChange={(e) => setSlug(e.target.value)}>{UNITS.map((u) => <option key={u.slug} value={u.slug}>{unitName(u)}{u.cond === 'notad' ? ` (notaður, ${u.year})` : ''}</option>)}</select>
          </label>
          <Picked x={x} />
          <div className="two">
            <label htmlFor="f-dagur"><span>Dagur</span>
              <select id="f-dagur" name="dagur" defaultValue="" aria-invalid={err.dagur ? true : undefined}><option value="" disabled>Veldu dag</option>{days.map((d) => <option key={d.v} value={d.v}>{d.label}</option>)}</select>
              {err.dagur && <p className="err">{err.dagur}</p>}
            </label>
            <label htmlFor="f-timi"><span>Tími</span>
              <select id="f-timi" name="timi" defaultValue="" aria-invalid={err.timi ? true : undefined}><option value="" disabled>Veldu tíma</option>{['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((t) => <option key={t}>{t}</option>)}</select>
              {err.timi && <p className="err">{err.timi}</p>}
            </label>
          </div>
          <Contact err={err} />
          <label className="check"><input type="checkbox" name="fjarmognun" /><span style={{ margin: 0 }}>Ég vil skoða fjármögnun hjá Ergo</span></label>
          <label className="check"><input type="checkbox" name="uppi" /><span style={{ margin: 0 }}>Ég á vagn sem ég vil taka upp í</span></label>
          <div className="acts"><Btn type="submit" label="Bóka skoðun" size="lg" /></div>
        </form>
        <aside className="aside">
          <h3>Opið til skoðunar</h3>
          <p>{HOURS.shopWinter}.</p>
          <p>{HOURS.shopSummer}.</p>
          <div className="ph"><Pic p={photo('showroom', 'Sýningarsalur Víkurverks')} sizes="(min-width: 900px) 34vw, 100vw" /></div>
        </aside>
      </div>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

function TradeInPage() {
  const [sp] = useSearchParams()
  const [err, setErr] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<string[]>([])
  const [done, setDone] = useState<Request | null>(null)
  const years = Array.from({ length: 27 }, (_, i) => String(2026 - i))
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    const fn = String(fd.get('fn') ?? '').trim().toUpperCase()
    const gerd = String(fd.get('gerd') ?? '').trim()
    if (!/^[A-ZÁÐÉÍÓÚÝÞÆÖ]{2}[A-ZÁÐÉÍÓÚÝÞÆÖ0-9]?\d{2,3}$/.test(fn.replace(/[\s-]/g, ''))) er.fn = 'Fastanúmer er tveir stafir og tölur, t.d. AB123.'
    if (!gerd) er.gerd = 'Skrifaðu tegund og gerð.'
    const c = readContact(fd, er)
    setErr(er)
    if (Object.keys(er).length) return focusFirst(e.currentTarget, er)
    const upp = unitBySlug(String(fd.get('upp') ?? ''))
    setDone(saveRequest({ kind: 'uppitaka', title: `${gerd} (${fd.get('ar')})${upp ? ` upp í ${unitName(upp)}` : ''}`, when: 'Verðmat', who: c.nafn, contact: `${c.simi}${c.netfang ? `, ${c.netfang}` : ''}`,
      detail: `Fastanúmer ${fn}. ${fd.get('leid')}. Ástand: ${fd.get('astand')}.${files.length ? ` Myndir: ${files.join(', ')}.` : ''}` }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  if (done) return <Page><Done r={done} back={<Btn to="vagnar" label="Skoða vagna" />} /><div style={{ height: 'var(--sp-xl)' }} /></Page>
  return (
    <Page>
      <Title title={['Taka upp í']} lede="Sendu upplýsingar um vagninn þinn. Söluráðgjafi metur hann, upp í nýjan vagn eða í umboðssölu hjá Víkurverki." />
      <div className="book-grid">
        <form className="form" onSubmit={submit} noValidate>
          <div className="two">
            <Field label="Fastanúmer" name="fn" required defaultValue={sp.get('fn') ?? ''} error={err.fn} hint="Stendur í skráningarskírteininu." />
            <label htmlFor="f-ar"><span>Árgerð</span><select id="f-ar" name="ar" defaultValue="2018">{years.map((y) => <option key={y}>{y}</option>)}</select></label>
          </div>
          <Field label="Tegund og gerð" name="gerd" required placeholder="t.d. Hobby De Luxe 495 UL" error={err.gerd} />
          <fieldset><legend>Ástand</legend><div className="opts">{['Mjög gott', 'Gott', 'Þarfnast lagfæringar'].map((a, i) => <label key={a} className="opt"><input type="radio" name="astand" value={a} defaultChecked={i === 1} /><span>{a}</span></label>)}</div></fieldset>
          <fieldset><legend>Hvað viltu gera?</legend><div className="opts">{['Taka upp í nýjan', 'Umboðssala hjá Víkurverki', 'Veit ekki enn'].map((a, i) => <label key={a} className="opt"><input type="radio" name="leid" value={a} defaultChecked={i === 0} /><span>{a}</span></label>)}</div></fieldset>
          <label htmlFor="f-upp"><span>Upp í hvaða vagn? (valfrjálst)</span>
            <select id="f-upp" name="upp" defaultValue={sp.get('v') ?? ''}><option value="">Ekki ákveðið</option>{UNITS.filter((u) => u.cond === 'ny').map((u) => <option key={u.slug} value={u.slug}>{unitName(u)}, {kr(u.price)}</option>)}</select>
          </label>
          <label htmlFor="f-myndir"><span>Myndir (valfrjálst)</span><input id="f-myndir" type="file" accept="image/*" multiple onChange={(e) => setFiles([...(e.target.files ?? [])].map((f) => f.name))} />
            <small className="hint">{files.length ? files.join(', ') : 'Að utan, að innan og af aukabúnaði. Í frumgerðinni fer engin mynd neitt.'}</small></label>
          <Contact err={err} />
          <div className="acts"><Btn type="submit" label="Senda til mats" size="lg" /></div>
        </form>
        <aside className="aside">
          <h3>Hvað gerist næst</h3>
          <ul className="terms">
            <li>Söluráðgjafi skoðar upplýsingarnar og hefur samband.</li>
            <li>Þú kemur með vagninn í Víkurhvarf og fær endanlegt mat.</li>
            <li>Matið gengur upp í nýjan vagn, eða vagninn fer á söluskrá Víkurverks.</li>
          </ul>
          <p>Engin skuldbinding. Kílómetrastaða er ekki spurð um; hjólhýsi eru ekki með mæli.</p>
        </aside>
      </div>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

function WorkshopPage() {
  const [svc, setSvc] = useState('thjonusta')
  const [err, setErr] = useState<Record<string, string>>({})
  const [done, setDone] = useState<Request | null>(null)
  const weeks = useMemo(() => weeksAhead(), [])
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    const fn = String(fd.get('fn') ?? '').trim().toUpperCase()
    if (fn.replace(/[\s-]/g, '').length < 4) er.fn = 'Gefðu upp fastanúmer vagnsins.'
    if (svc === 'tjon' && !String(fd.get('tjonsnr') ?? '').trim()) er.tjonsnr = 'Tjónsnúmer frá tryggingafélagi þarf að liggja fyrir.'
    if (!String(fd.get('vika') ?? '')) er.vika = 'Veldu viku.'
    const c = readContact(fd, er)
    setErr(er)
    if (Object.keys(er).length) return focusFirst(e.currentTarget, er)
    const s = SERVICES.find((x) => x.key === svc)!
    setDone(saveRequest({ kind: 'verkstaedi', title: `${s.label}, ${fd.get('gerd') || 'vagn'}`, when: weeks.find((w) => w.v === fd.get('vika'))?.label ?? '', who: c.nafn, contact: `${c.simi}${c.netfang ? `, ${c.netfang}` : ''}`,
      detail: `Fastanúmer ${fn}.${svc === 'tjon' ? ` Tjónsnúmer ${fd.get('tjonsnr')}.` : ''} ${fd.get('lysing') || ''}`.trim() }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  if (done) return <Page><Done r={done} back={<Btn to="" label="Á forsíðu" />} /><div style={{ height: 'var(--sp-xl)' }} /></Page>
  return (
    <Page>
      <Title title={['Bóka verkstæði']} lede="Veldu þjónustu og viku. Verkstæðið staðfestir tímann; móttakan er austan megin við húsið." />
      <div className="book-grid">
        <form className="form" onSubmit={submit} noValidate>
          <fieldset><legend>Þjónusta</legend>
            <div className="opts">{SERVICES.map((s) => <label key={s.key} className="opt bigopt"><input type="radio" name="svc" value={s.key} checked={svc === s.key} onChange={() => setSvc(s.key)} /><span><b>{s.label}</b><small>{s.line}</small></span></label>)}</div>
          </fieldset>
          <div className="two">
            <Field label="Fastanúmer" name="fn" required error={err.fn} hint="Þarf til að panta varahluti." />
            <Field label="Tegund og gerð" name="gerd" placeholder="t.d. Adria Altea 2024" />
          </div>
          {svc === 'tjon' && <Field label="Tjónsnúmer" name="tjonsnr" required error={err.tjonsnr} hint="Frá tryggingafélaginu. Stærri tjónaviðgerðir eru unnar 1. sept. til 1. apríl." />}
          <label htmlFor="f-vika"><span>Hvaða vika hentar?</span>
            <select id="f-vika" name="vika" defaultValue="" aria-invalid={err.vika ? true : undefined}><option value="" disabled>Veldu viku</option>{weeks.map((w) => <option key={w.v} value={w.v}>{w.label}</option>)}</select>
            {err.vika && <p className="err">{err.vika}</p>}
          </label>
          <label htmlFor="f-lysing"><span>Lýsing (valfrjálst)</span><textarea id="f-lysing" name="lysing" placeholder="Hvað á að gera, eða hvað er að?" /></label>
          <Contact err={err} />
          <div className="acts"><Btn type="submit" label="Senda beiðni" size="lg" /></div>
        </form>
        <aside className="aside">
          <h3>Gott að vita</h3>
          <ul className="terms">{WORKSHOP_FACTS.map((f) => <li key={f}>{f}</li>)}</ul>
          <p><span style={{ color: 'var(--ink)' }}>{HOURS.workshop}.</span> {CONTACT.workshop}, sími {CONTACT.phone}.</p>
          <div className="ph"><Pic p={photo('workshop-2', 'Unnið í innréttingu hjólhýsis á verkstæði Víkurverks')} sizes="(min-width: 900px) 34vw, 100vw" /></div>
        </aside>
      </div>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

/* ── shop (Mammut: filter rail, open grid, product page, "added" panel) ── */

const PRICES: [string, string, (n: number) => boolean][] = [
  ['', 'Öll verð', () => true],
  ['u10', 'Undir 10.000 kr.', (n) => n < 10000],
  ['10-50', '10.000-50.000 kr.', (n) => n >= 10000 && n <= 50000],
  ['o50', 'Yfir 50.000 kr.', (n) => n > 50000],
]
const PSORT: Record<string, { label: string; fn: (a: Product, b: Product) => number }> = {
  vinsaelt: { label: 'Vinsælast', fn: () => 0 },
  'verd-upp': { label: 'Verð: lægst fyrst', fn: (a, b) => a.price - b.price },
  'verd-nidur': { label: 'Verð: hæst fyrst', fn: (a, b) => b.price - a.price },
}
const P_BRANDS = [...new Set(PRODUCTS.map((p) => p.brand).filter(Boolean))] as string[]

function ShopPage() {
  const [sp, setSp] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  const cat = sp.get('flokkur') ?? ''
  const brand = sp.get('merki') ?? ''
  const price = sp.get('verd') ?? ''
  const rod = sp.get('rod') ?? 'vinsaelt'
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }) }
  const pf = PRICES.find((x) => x[0] === price)?.[2] ?? (() => true)
  const items = PRODUCTS.filter((p) => (!cat || p.cat === cat) && (!brand || p.brand === brand) && pf(p.price)).sort((PSORT[rod] ?? PSORT.vinsaelt).fn)
  const active = [cat && ['flokkur', SHOP_CATS.find((c) => c.key === cat)?.label ?? cat], brand && ['merki', brand], price && ['verd', PRICES.find((x) => x[0] === price)?.[1] ?? price]].filter(Boolean) as [string, string][]
  const rail = (
    <>
      <div className="fg"><span>Flokkur</span>
        <ul className="opts-list">{[['', 'Allt', PRODUCTS.length] as [string, string, number], ...SHOP_CATS.map((c) => [c.key, c.label, c.count] as [string, string, number])].map(([k, l, n]) => (
          <li key={k || 'all'}><button type="button" aria-pressed={cat === k} onClick={() => set('flokkur', k)}><span>{l}</span><small className="num">{n}</small></button></li>
        ))}</ul>
      </div>
      <div className="fg"><span>Merki</span><Chips name="Merki" value={brand} onPick={(v) => set('merki', v)} opts={[['', 'Öll'], ...P_BRANDS.map((b) => [b, b] as [string, string])]} /></div>
      <div className="fg"><span>Verð</span><Chips name="Verð" value={price} onPick={(v) => set('verd', v)} opts={PRICES.map(([k, l]) => [k, l] as [string, string])} /></div>
    </>
  )
  useEffect(() => {
    if (!drawer) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(false) }
    document.addEventListener('keydown', onKey)
    pageLenis?.stop()
    return () => { document.removeEventListener('keydown', onKey); pageLenis?.start() }
  }, [drawer])
  return (
    <Page>
      <Title title={['Verslun']} lede="Fortjöld, grill, stólar, kælibox og það sem vagninn þarf. Frí heimsending á pöntunum yfir 20.000 kr." />
      <div className="shop">
        <aside className="frail" aria-label="Síur">{rail}</aside>
        <div className="results">
          <div className="fbar">
            <p className="count" aria-live="polite"><span className="num">{items.length}</span> vörur í úrtakinu</p>
            <button type="button" className="chip only-s" onClick={() => setDrawer(true)} aria-haspopup="dialog"><SlidersHorizontal size={15} aria-hidden="true" />Síur{active.length ? ` (${active.length})` : ''}</button>
            <label><span className="sr">Röðun</span>
              <select value={rod} onChange={(e) => set('rod', e.target.value === 'vinsaelt' ? '' : e.target.value)}>{Object.entries(PSORT).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}</select>
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
                  <motion.li key={p.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}><ProductCard p={p} /></motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <div className="empty"><h3>Engin vara passar</h3><p className="muted">Prófaðu að slaka á einni síu.</p><Btn label="Hreinsa síur" onClick={() => setSp(new URLSearchParams(), { replace: true })} /></div>
          )}
          <p className="note">{SHOP_NOTE} Flokkarnir eru {SHOP_CATS.map((c) => `${c.label} (${c.count})`).join(', ')} og fleiri.</p>
        </div>
      </div>
      {drawer && (
        <div className="fdrawer" role="dialog" aria-modal="true" aria-label="Síur" data-lenis-prevent="">
          <button type="button" className="scrim" aria-label="Loka síum" onClick={() => setDrawer(false)} />
          <div className="sheet-in">
            <div className="dtop"><b>Síur</b><button type="button" className="ibtn" onClick={() => setDrawer(false)} aria-label="Loka síum"><X size={16} aria-hidden="true" /></button></div>
            <div className="dbody">{rail}</div>
            <div className="dfoot"><Btn label={`Sýna ${items.length} vörur`} onClick={() => setDrawer(false)} size="lg" className="w100" /></div>
          </div>
        </div>
      )}
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

function ProductPage({ slug }: { slug: string }) {
  const p = productBySlug(slug)
  const list = useList()
  const [qty, setQ] = useState(1)
  const [openAcc, setOpenAcc] = useState(0)
  if (!p) return <NotFound />
  const line = list.find((l) => l.slug === p.slug)
  const catLabel = SHOP_CATS.find((c) => c.key === p.cat)?.label ?? 'Verslun'
  const fits = PRODUCTS.filter((x) => x.slug !== p.slug && (x.cat === p.cat || (p.cat === 'grill' && x.cat === 'grill'))).slice(0, 4)
  const more = fits.length < 4 ? [...fits, ...PRODUCTS.filter((x) => x.slug !== p.slug && !fits.includes(x)).slice(0, 4 - fits.length)] : fits
  const add = () => { setQty(p.slug, (line?.qty ?? 0) + qty); window.dispatchEvent(new CustomEvent(ADDED, { detail: p.slug })) }
  const ACC: [string, ReactNode][] = [
    ['Um vöruna', <p key="a">{p.desc} {p.brand ? `Framleiðandi: ${p.brand}.` : ''}</p>],
    ['Afhending', <p key="b">Send heim eða sótt í Víkurhvarf 6. Frí heimsending á pöntunum yfir {kr(FREE_SHIPPING)}.</p>],
    ['Passar þetta?', <p key="c">Ertu ekki viss um hvort varan passar á vagninn þinn? Hringdu í {CONTACT.phone} eða spurðu í versluninni með gerð og árgerð vagnsins.</p>],
  ]
  return (
    <Page className="pdp">
      <Link className="crumb tlink" to={to(`verslun?flokkur=${p.cat}`)} style={{ marginBottom: 16, textDecoration: 'none' }}><ArrowLeft size={15} aria-hidden="true" />{catLabel}</Link>
      <div className="pdp-grid">
        <div className="gal" data-intro="">
          <div className="stagep" data-open=""><Pic p={p.img} sizes="(min-width: 1024px) 55vw, 100vw" eager /></div>
        </div>
        <div className="buy">
          <div className="buy-in">
            {p.brand && <p className="eyebrow" data-open="">{p.brand}</p>}
            <h1 className="h-md"><Lines lines={[p.name]} /></h1>
            <p className="pr num" data-open="">{kr(p.price)}</p>
            <p className="muted" data-open="">{p.desc}</p>
            <div className="row-buy" data-open="">
              <div className="qty" aria-label="Magn">
                <button type="button" aria-label="Fækka" onClick={() => setQ(Math.max(1, qty - 1))}><Minus size={15} aria-hidden="true" /></button>
                <span className="num" aria-live="polite">{qty}</span>
                <button type="button" aria-label="Fjölga" onClick={() => setQ(qty + 1)}><Plus size={15} aria-hidden="true" /></button>
              </div>
              <Btn label={line ? `Bæta við (${line.qty} á lista)` : 'Setja á ferðalistann'} onClick={add} size="lg" className="grow" />
            </div>
            <ul className="facts" data-open="">
              <li><Check size={15} aria-hidden="true" />Frí heimsending yfir {kr(FREE_SHIPPING)}</li>
              <li><Check size={15} aria-hidden="true" />Sótt í Víkurhvarf 6, {HOURS.shopWinter.split(':')[1]?.trim()}</li>
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
        <div className="shead"><h2 id="h-fits" className="h-lg" data-rv="">Passar með</h2></div>
        <ul className="pgrid" role="list" data-rv-g="">{more.map((x) => <li key={x.slug}><ProductCard p={x} /></li>)}</ul>
      </section>
      <p className="note">{SHOP_NOTE}</p>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

/* the small "added" panel (Mammut: confirm the exact item, keep browsing) */
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
          <div className="atop"><b>Komið á ferðalistann</b><button type="button" className="ibtn" aria-label="Loka" onClick={() => setSlug(null)}><X size={15} aria-hidden="true" /></button></div>
          <div className="aitem"><img src={p.img.src} alt="" width={64} height={64} /><span><span className="nm">{p.name}</span><small className="num">{kr(p.price)} · {listCount(list)} vörur á listanum</small></span></div>
          <div className="aacts"><Btn label="Halda áfram" tone="grey" onClick={() => setSlug(null)} /><Btn to="ferdalistinn" label="Opna listann" onClick={() => setSlug(null)} /></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TripPage() {
  const [sp] = useSearchParams()
  const list = useList()
  const [err, setErr] = useState<Record<string, string>>({})
  const [done, setDone] = useState<Request | null>(null)
  const [trip, setTrip] = useState(sp.get('ferd') ?? '')
  useEffect(() => { const f = sp.get('ferd'); if (f) { loadTrip(f); setTrip(f) } }, [sp])
  const total = listTotal(list)
  const toFree = Math.max(0, FREE_SHIPPING - total)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    if (!list.length) er.listi = 'Listinn er tómur.'
    const c = readContact(fd, er)
    setErr(er)
    if (Object.keys(er).length) return focusFirst(e.currentTarget, er)
    setDone(saveRequest({ kind: 'ferdalisti', title: `${listCount(list)} vörur, ${kr(total)}`, when: String(fd.get('afh')), who: c.nafn, contact: `${c.simi}${c.netfang ? `, ${c.netfang}` : ''}`,
      detail: list.map((l) => `${l.qty} x ${productBySlug(l.slug)?.name}`).join('; ') }))
    clearList()
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  if (done) return <Page><Done r={done} back={<Btn to="verslun" label="Aftur í verslun" />} /><div style={{ height: 'var(--sp-xl)' }} /></Page>
  return (
    <Page>
      <Title title={['Ferðalistinn']} lede="Byrjaðu á tilbúnum lista fyrir ferðina, eða safnaðu vörum úr versluninni. Lagaðu magnið og sendu pöntunina." />
      <div className="tabs" role="group" aria-label="Byrja á lista">
        {TRIPS.map((t) => <button key={t.key} type="button" className="chip" aria-pressed={trip === t.key} onClick={() => { loadTrip(t.key); setTrip(t.key) }}>{t.label}</button>)}
      </div>
      <div className="tl-grid">
        <div>
          {list.length ? (
            <ul className="tl" role="list">
              {list.map((l) => {
                const p = productBySlug(l.slug)!
                return (
                  <li key={l.slug} className="tli">
                    <Pic p={p.img} sizes="72px" />
                    <div><b>{p.name}</b><small className="num">{kr(p.price)} stk.{p.brand ? ` · ${p.brand}` : ''}</small></div>
                    <div className="qty"><button type="button" aria-label={`Fækka ${p.name}`} onClick={() => setQty(l.slug, l.qty - 1)}><Minus size={15} aria-hidden="true" /></button><span className="num" aria-live="polite">{l.qty}</span><button type="button" aria-label={`Fjölga ${p.name}`} onClick={() => setQty(l.slug, l.qty + 1)}><Plus size={15} aria-hidden="true" /></button></div>
                    <button type="button" className="rm" aria-label={`Taka ${p.name} af listanum`} onClick={() => setQty(l.slug, 0)}><Trash2 size={17} aria-hidden="true" /></button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="empty"><h3>Listinn er tómur</h3><p className="muted">Veldu ferð hér að ofan eða settu vörur á listann í versluninni.</p><Btn to="verslun" label="Í verslun" /></div>
          )}
          {err.listi && <p className="err" role="alert" style={{ color: 'var(--err)', marginTop: 10 }}>{err.listi}</p>}
        </div>
        <aside className="aside" aria-label="Pöntun">
          <div className="sumbox">
            <div><span>Vörur</span><span className="num">{listCount(list)}</span></div>
            <div><span>Samtals</span><span className="num">{kr(total)}</span></div>
          </div>
          <div>
            <div className="ship" aria-hidden="true"><i style={{ transform: `scaleX(${Math.min(1, total / FREE_SHIPPING)})` }} /></div>
            <p className="small">{toFree ? `${kr(toFree)} upp í fría heimsendingu.` : 'Frí heimsending.'}</p>
          </div>
          <form className="form" onSubmit={submit} noValidate>
            <fieldset><legend>Afhending</legend><div className="opts">{['Senda heim', 'Sækja í Víkurhvarf'].map((a, i) => <label key={a} className="opt"><input type="radio" name="afh" value={a} defaultChecked={i === 0} /><span>{a}</span></label>)}</div></fieldset>
            <Contact err={err} />
            <div className="acts"><Btn type="submit" label="Senda pöntun" size="lg" /></div>
            <p className="proto-note">Í vef Víkurverks færi þetta beint í körfu vefverslunarinnar.</p>
          </form>
        </aside>
      </div>
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
      <Title title={['Afgreiðsla']} lede="Hlið starfsfólks: leigubeiðnir, skoðanir, uppítökur, verkstæðistímar og ferðalistar á einum stað, hver á réttan stað." />
      <div className="ibar"><span>{rows.length} beiðnir · {rows.filter((r) => (st[r.id] ?? r.status) === 'ný').length} nýjar</span><span>Sýnishorn eru merkt; þínar beiðnir eru efst.</span></div>
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
                <td>{r.title}<br /><small>{r.when} · {r.kind === 'leiga' ? r.detail.split(':').slice(2).join(', ') : r.detail}</small></td>
                <td>{r.who}<br /><small>{r.contact}</small></td>
                <td><small>{routeTo(r.kind)}</small></td>
                <td><span className={`st${s === 'ný' ? ' new' : ''}`}><i aria-hidden="true" />{s === 'ný' ? 'Ný' : 'Staðfest'}</span></td>
                <td><div className="ia">{s === 'ný' && <button type="button" onClick={() => setSt((x) => ({ ...x, [r.id]: 'staðfest' }))}>Staðfesta</button>}<a href={r.contact.includes('@') ? `mailto:${r.contact.split(', ').pop()}` : `tel:${r.contact.split(',')[0].replace(/\s/g, '')}`}>Svara</a></div></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="note">Frumgerð: beiðnir úr formunum eru geymdar í þessum vafra (sessionStorage). Í raunveruleikanum fara þær í tölvupóst á rétta deild og birtast hér.</p>
      <div style={{ height: 'var(--sp-xl)' }} />
    </Page>
  )
}

function PrivacyPage() {
  return (
    <Page>
      <Title title={['Persónuvernd']} lede="Hvaða upplýsingum formin á þessum vef myndu safna og til hvers." />
      <div className="doc">
        <p>Formin biðja um nafn, síma og netfang til að svara beiðninni, auk upplýsinga um vagninn (fastanúmer, gerð, árgerð) þegar beiðnin snýst um verkstæði eða uppítöku. Upplýsingarnar fara aðeins til Víkurverks ehf., kt. {CONTACT.kt}.</p>
        <p>Í þessari frumgerð er ekkert sent: beiðnir eru geymdar í vafranum þínum og hverfa þegar glugganum er lokað. Ferðalistinn er geymdur í vafranum þar til þú tæmir hann.</p>
        <p>Víkurverk birtir eigin persónuverndarstefnu á vikurverk.is.</p>
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
  '': ['Víkurverk | Hjólhýsi, húsbílar, leiga og verkstæði', 'Víkurverk selur ný og notuð hjólhýsi, húsbíla, sporthýsi og tjaldvagna, leigir út hjólhýsi og Mink, rekur verkstæði allt árið og verslun með aukahluti. Víkurhvarfi 6, Kópavogi.'],
  vagnar: ['Vagnar | Víkurverk', 'Nýir og notaðir vagnar hjá Víkurverki með verði, svefnplássi og eigin þyngd. Hobby, Adria, Fendt, Mink, Camp-Let og Randger.'],
  leiga: ['Leiga | Víkurverk', 'Leigðu hjólhýsi eða Mink sporthýsi hjá Víkurverki, vika í senn frá fimmtudegi til miðvikudags.'],
  skodun: ['Bóka skoðun | Víkurverk', 'Bókaðu tíma til að skoða vagn í Víkurhvarfi 6.'],
  uppitaka: ['Taka upp í | Víkurverk', 'Sendu upplýsingar um vagninn þinn og fáðu mat, upp í nýjan eða í umboðssölu.'],
  verkstaedi: ['Bóka verkstæði | Víkurverk', 'Þjónustuskoðun, ábyrgðar- og lekaskoðun, vetrarstandsetning og tjónaviðgerðir á verkstæði Víkurverks.'],
  verslun: ['Verslun | Víkurverk', 'Fortjöld, grill, stólar, kælibox og aukahlutir fyrir ferðavagna.'],
  ferdalistinn: ['Ferðalistinn | Víkurverk', 'Tilbúnir listar fyrir helgarferð, sumarfríið og haustið, úr vörum Víkurverks.'],
  afgreidsla: ['Afgreiðsla | Víkurverk', 'Hlið starfsfólks: beiðnir af vefnum.'],
  personuvernd: ['Persónuvernd | Víkurverk', 'Hvaða upplýsingum vefur Víkurverks safnar og hvernig þær eru notaðar.'],
}

export default function VikurverkPage() {
  const root = useRef<HTMLDivElement>(null)
  const loc = useLocation()
  const sub = loc.pathname.replace(/^.*?\/preview\/vikurverk\/?/, '').replace(/\/+$/, '')
  const [menu, setMenu] = useState(false)
  const [banner, setBanner] = useState(() => { try { return sessionStorage.getItem('vv-banner') !== '0' } catch { return true } })
  const chat = useRef<ChatEl | null>(null)
  const page = sub.split('/')[0]
  const seg = sub.split('/')
  const overHero = sub === '' || (page === 'vagnar' && !!seg[1] && !!unitBySlug(seg[1]))
  const formPage = useRef(false)
  formPage.current = ['leiga', 'skodun', 'uppitaka', 'verkstaedi', 'ferdalistinn', 'afgreidsla'].includes(page) && (page !== 'leiga' || !!seg[1])
  const overRef = useRef(overHero)
  overRef.current = overHero

  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const [t, d] = TITLES[page] ?? TITLES['']
    const u = page === 'vagnar' && seg[1] ? unitBySlug(seg[1]) : undefined
    const r = page === 'leiga' && seg[1] ? RENTALS.find((x) => x.key === seg[1]) : undefined
    const pr = page === 'verslun' && seg[1] ? productBySlug(seg[1]) : undefined
    document.title = u ? `${unitName(u)} | Víkurverk` : r ? `Leiga: ${r.name} | Víkurverk` : pr ? `${pr.name} | Víkurverk` : t
    document.documentElement.lang = 'is'
    setThemeColor(banner ? PINE_INK : '#FFFFFF')
    const a = setMetaDescription(u ? `${unitName(u)} hjá Víkurverki: ${kr(u.price)}${u.sleeps ? `, svefnpláss ${u.sleeps}` : ''}${u.weight ? `, ${u.weight} kg` : ''}.` : r ? `${r.name} til leigu: ${kr(r.price)} á viku.` : pr ? `${pr.name}: ${kr(pr.price)}. ${pr.desc}` : d)
    const nb = setNoindex(true)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => { document.title = prevTitle; document.documentElement.lang = prevLang; a(); nb(); ld.remove() }
  }, [sub, page, banner]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let el: ChatEl | null = null
    let alive = true
    import('./vendor/sndr-chat.js').then(() => {
      if (!alive || !root.current) return
      el = document.createElement('sndr-chat') as ChatEl
      el.setAttribute('name', 'Víkurverk')
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

  useEffect(() => {
    setMenu(false)
    if (loc.hash) { window.setTimeout(() => goTo(decodeURIComponent(loc.hash.slice(1))), 120); return }
    if (pageLenis) pageLenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0)
  }, [loc.pathname, loc.hash])

  /* chrome state: over the hero (white text), quick bar, buy bar */
  useEffect(() => {
    const el = root.current!
    let raf = 0
    const tick = () => {
      raf = 0
      const y = window.scrollY
      const vh = window.innerHeight
      const heroEl = el.querySelector<HTMLElement>('.hero, .dhero')
      const heroBottom = heroEl ? heroEl.offsetTop + heroEl.offsetHeight : 0
      const isDetail = !!el.querySelector('.dhero')
      const next = {
        over: overRef.current && heroEl && y < heroBottom - 80 ? '1' : '0',
        sticky: !formPage.current && !isDetail && y > vh * 0.6 ? '1' : '0',
        buy: isDetail && y > heroBottom - vh * 0.3 ? '1' : '0',
      }
      /* write only on change: these attributes sit on the root, so every write restyles the page */
      for (const [k, v] of Object.entries(next)) if (el.dataset[k] !== v) el.dataset[k] = v
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    const t = window.setTimeout(tick, 50)
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); window.clearTimeout(t) }
  }, [loc.pathname])

  /* menu */
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('vv-menu', menu)
    if (!menu) return
    pageLenis?.stop()
    const opener = document.activeElement as HTMLElement | null
    const bg = root.current ? [...root.current.children].filter((c) => !c.classList.contains('vv-menu-panel') && c.tagName !== 'STYLE') as HTMLElement[] : []
    bg.forEach((c) => c.setAttribute('inert', ''))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('keydown', onKey)
    const panel = menuRef.current
    if (!isTouch()) panel?.querySelector<HTMLElement>('a,button')?.focus()
    if (panel && !still()) {
      gsap.fromTo(panel, { clipPath: 'inset(0 0 100% 0 round 12px)' }, { clipPath: 'inset(0 0 0% 0 round 12px)', duration: 0.35, ease: 'power4.out' })
      gsap.fromTo(panel.querySelectorAll('[data-mi]'), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.04, delay: 0.08, ease: 'power3.out' })
    }
    return () => { document.removeEventListener('keydown', onKey); pageLenis?.start(); html.classList.remove('vv-menu'); bg.forEach((c) => c.removeAttribute('inert')); opener?.focus?.() }
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

  /* motion per route: one opening, then reveals that play once (never tied to the scroll position) */
  useLayoutEffect(() => {
    const el = root.current!
    const main = el.querySelector<HTMLElement>('main')!
    const reduce = still()
    let ctx: gsap.Context | null = null
    let alive = true
    const build = () => { if (!alive) return; ctx = gsap.context(() => {
      if (reduce) return
      const travel = isTouch() ? 14 : 24
      const open = gsap.timeline({ defaults: { ease: 'power4.out' } })

      /* the capsule drops in on the first load only (Lightship: header slides from above the fold) */
      if (firstLoad) { open.from(el.querySelector('[data-cap]'), { yPercent: -180, duration: 0.9 }, 0.15); firstLoad = false }

      const hmask = main.querySelector<HTMLElement>('[data-hmask]')
      if (hmask) {
        open.fromTo(hmask, { clipPath: 'inset(5% 4% 5% 4% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 1.4, ease: 'vvSmooth' }, 0)
        const img = hmask.querySelector(':scope > img')
        if (img) open.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'vvSmooth' }, 0)
      }
      const lines = main.querySelectorAll('[data-line]')
      if (lines.length) open.from(lines, { yPercent: 110, duration: 0.9, stagger: 0.1 }, hmask ? 0.35 : 0.1)
      const rule = main.querySelector('[data-rule]')
      if (rule) open.from(rule, { scaleX: 0, duration: 0.9, ease: 'vvSmooth' }, 0.5)
      const opens = main.querySelectorAll('[data-open]')
      if (opens.length) open.from(opens, { y: travel * 0.7, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' }, hmask ? 0.6 : 0.3)
      const finish = (e: KeyboardEvent) => { if (e.key === 'Tab') open.progress(1) }
      document.addEventListener('keydown', finish)

      /* reveals: play once when the block arrives */
      main.querySelectorAll<HTMLElement>('[data-rv]').forEach((t) => {
        gsap.from(t, { y: travel, autoAlpha: 0, duration: 0.8, ease: 'vvSmooth', scrollTrigger: { trigger: t, start: 'top 90%', once: true } })
      })
      main.querySelectorAll<HTMLElement>('[data-rv-g]').forEach((g) => {
        gsap.from(g.children, { y: travel, autoAlpha: 0, duration: 0.8, ease: 'vvSmooth', stagger: 0.07, scrollTrigger: { trigger: g, start: 'top 88%', once: true } })
      })
      main.querySelectorAll<HTMLElement>('[data-rv-img]').forEach((f) => {
        const img = f.querySelector('img')
        if (img) gsap.from(img, { scale: 1.08, duration: 1.4, ease: 'vvSmooth', scrollTrigger: { trigger: f, start: 'top 92%', once: true } })
      })
      const revealFocused = (e: FocusEvent) => {
        const t = e.target as HTMLElement
        ScrollTrigger.getAll().forEach((st) => { const tr = st.trigger as HTMLElement | null; if (tr && (tr === t || tr.contains(t) || t.contains(tr))) st.animation?.progress(1) })
      }
      main.addEventListener('focusin', revealFocused)
      return () => { document.removeEventListener('keydown', finish); main.removeEventListener('focusin', revealFocused) }
    }, el); ScrollTrigger.refresh() }
    if (!document.fonts) build()
    else Promise.all(['400 16px VvT', '500 16px VvT'].map((f) => document.fonts.load(f))).then(() => document.fonts.ready).then(build, build)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { alive = false; window.removeEventListener('load', refresh); ctx?.revert() }
  }, [loc.pathname])

  const closeBanner = () => { setBanner(false); try { sessionStorage.setItem('vv-banner', '0') } catch { /* private mode */ } }

  let body: ReactNode
  if (sub === '') body = <Home />
  else if (page === 'vagnar') body = seg[1] ? <DetailPage slug={seg[1]} /> : <CatalogPage />
  else if (page === 'leiga') { const r = seg[1] ? RENTALS.find((x) => x.key === seg[1]) : undefined; body = seg[1] ? (r ? <RentalPage r={r} /> : <NotFound />) : <RentalList /> }
  else if (page === 'skodun') body = <ViewingPage />
  else if (page === 'uppitaka') body = <TradeInPage />
  else if (page === 'verkstaedi') body = <WorkshopPage />
  else if (page === 'verslun') body = seg[1] ? <ProductPage slug={seg[1]} /> : <ShopPage />
  else if (page === 'ferdalistinn') body = <TripPage />
  else if (page === 'afgreidsla') body = <InboxPage />
  else if (page === 'personuvernd') body = <PrivacyPage />
  else body = <NotFound />

  return (
    <div ref={root} className={`vv${menu ? ' menu-open' : ''}`} id="efst" lang="is" data-banner={banner ? '1' : '0'} data-over={overHero ? '1' : '0'} data-sticky="0" data-buy="0">
      <style>{CSS}</style>
      <PreviewChrome company={company} />
      <a className="skip" href="#efni">Fara í efni</a>

      <div className="banner" role="region" aria-label="Tilkynning">
        <span>Leiga sumarið 2027 er opin<span className="hide-s">, vika í senn frá fimmtudegi</span>.</span>
        <Link to={to('leiga')}>Sjá lausar vikur</Link>
        <button type="button" className="x" onClick={closeBanner} aria-label="Loka tilkynningu"><X size={15} aria-hidden="true" /></button>
      </div>
      <header className="hdr"><Header sub={sub} onMenu={() => setMenu(true)} /></header>

      {menu && (
        <div className="vv-menu-panel" ref={menuRef} role="dialog" aria-modal="true" aria-label="Valmynd" data-lenis-prevent="">
          <div className="mtop">
            <img src={A('logo-t.png')} alt="Víkurverk" width={306} height={200} />
            <button type="button" className="mx" onClick={() => setMenu(false)} aria-label="Loka valmynd"><X size={20} strokeWidth={1.6} aria-hidden="true" /></button>
          </div>
          <div className="mgroups">
            {NAV.map((g) => (
              <nav key={g.key} className="mg" aria-label={g.label} data-mi="">
                <p>{g.label}</p>
                {g.items.filter((i) => !i.k.startsWith('leiga/')).map((i) => <Link key={i.k} to={to(i.k)} aria-current={sub === i.k ? 'page' : undefined} onClick={() => setMenu(false)}>{i.label}</Link>)}
              </nav>
            ))}
          </div>
          <div className="mfoot" data-mi="">
            <a className="big num" href={`tel:${CONTACT.tel}`}><Phone size={20} aria-hidden="true" />{CONTACT.phone}</a>
            <button type="button" onClick={openChat}><MessageCircle size={17} aria-hidden="true" />Spyrja aðstoðarmanninn</button>
            <p>{HOURS.shopWinter}</p>
          </div>
        </div>
      )}

      <MotionConfig reducedMotion="user"><main id="efni" key={loc.pathname}>{body}</main></MotionConfig>

      <footer className="vv-foot">
        <div className="wrap">
          <div className="mark"><img src={A('logo-t.png')} alt="Víkurverk" width={306} height={200} /></div>
          <div className="ftop">
            <div className="fbrand">
              <b>{CONTACT.slogan}.</b>
              <p>{CONTACT.summary}</p>
            </div>
            <div className="fnav">
              <div>
                <h3>Víkurhvarf 6</h3>
                <p>{CONTACT.town}</p>
                <a className="num" href={`tel:${CONTACT.tel}`}>Sími {CONTACT.phone}</a>
                <a href={mailHref(CONTACT.email)}><Mail size={13} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />{CONTACT.email}</a>
                <a href={mailHref(CONTACT.workshop)}>{CONTACT.workshop}</a>
              </div>
              <div>
                <h3>Opið</h3>
                <p>Sept.-feb.: virka daga 10-17</p>
                <p>Mars-ág.: virka daga 10-18, lau. 11-15</p>
                <p>Verkstæði: virka daga 8-17</p>
              </div>
              <div>
                <h3>Á vefnum</h3>
                {[['vagnar', 'Vagnar'], ['leiga', 'Leiga'], ['uppitaka', 'Taka upp í'], ['verkstaedi', 'Verkstæði'], ['verslun', 'Verslun'], ['ferdalistinn', 'Ferðalistinn']].map(([k, l]) => <Link key={k} to={to(k)}>{l}</Link>)}
              </div>
            </div>
          </div>
          <div className="flegal">
            <p>{CONTACT.legal} · Kt. {CONTACT.kt} · VSK nr. {CONTACT.vsk} · <a href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a> · <a href={CONTACT.youtube} target="_blank" rel="noopener">YouTube</a> · <Link to={to('personuvernd')}>Persónuvernd</Link> · <Link to={to('afgreidsla')}>Afgreiðsla</Link></p>
            <SndrBadge />
          </div>
          <p className="proto">Frumgerð: hugmynd að nýjum vef, ekki vefur Víkurverks. Upplýsingar, verð og vörumyndir eru af vikurverk.is, notadir.vikurverk.is og bæklingum Víkurverks, sótt 9. október 2026; verð geta breyst. Landslagsmyndirnar þrjár (forsíða, leiga, verslun) eru stemningsmyndir búnar til fyrir frumgerðina, ekki myndir af vögnum Víkurverks. Formin senda ekkert; beiðnir eru geymdar í þínum vafra. Aðstoðarmaðurinn svarar aðeins út frá því sem stendur á þessum vef.</p>
        </div>
      </footer>

      <div className="vv-sticky" aria-label="Flýtileiðir">
        <a href={`tel:${CONTACT.tel}`}><Phone size={15} aria-hidden="true" />Hringja</a>
        <Link to={to('vagnar')}>Vagnar</Link>
        <button type="button" onClick={openChat}><MessageCircle size={15} aria-hidden="true" />Spyrja</button>
      </div>
      <MotionConfig reducedMotion="user"><AddedPanel /></MotionConfig>
    </div>
  )
}

export type { Kind }
