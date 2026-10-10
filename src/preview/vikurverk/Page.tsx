import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Download, ExternalLink, Mail, MapPin, Menu, MessageCircle, Minus, Phone, Plus, ShoppingBag, SlidersHorizontal, Trash2, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { SndrBadge } from '../SndrBadge'
import { setMetaDescription, setNoindex, setThemeColor } from '../../lib/preview'
import {
  A, CONTACT, EXTRAS, FREE_SHIPPING, HOURS, JSON_LD, KINDS, PEOPLE, PRODUCTS, RENTALS, RENTAL_TERMS, REQ_LABEL, ROUTE, SAMPLE_BOOKED, SAMPLE_NOTE,
  SAMPLE_REQUESTS, SEASON, SERVICES, SHOP_CATS, SHOP_NOTE, TRIPS, UNITS, WORKSHOP_FACTS,
  fmtDay, kindLabel, kr, loadRequests, openState, photo, productBySlug, routeTo, saveRequest, unitBySlug, unitName,
  type Kind, type Photo, type Product, type Rental, type ReqKind, type Request, type Unit,
} from './data'
import { clearList, listCount, listTotal, loadTrip, setQty, toggle, useList } from './store'
import { answer, CHIPS, GREETING } from './chat'
import { CSS, PINE_INK } from './styles'

/*
 * Víkurverk — "Allt í ferðalagið". Plan: _docs/VIKURVERK-BUILD-2026-10-09.md.
 *
 * A hybrid of two of our systems. From Set: the white page with square grey
 * cards, products (here: the caravans' own floor plans) multiplied onto the
 * grey, big capitals, the catalogue row (3/12 heading, 9/12 cards) and the
 * material list, re-aimed as a trip list. From Vatt/Vélfang: the shell (contact
 * bar, grouped dropdowns, staged opening, masked titles, position-tied reveals),
 * the brand plates, the catalogue with URL filters and an empty state, the
 * detail page, the request forms and the staff inbox, the page-only assistant.
 * New: the rental season calendar and the trade-in request. The one curve is
 * the swoosh from Víkurverk's mark.
 *
 * Routes live under /preview/vikurverk/*; this component reads the sub-path.
 */

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('vv', 'M0,0 C0.625,0.05 0,1 1,1')

const company = getPreviewCompany('vikurverk')
let pageLenis: Lenis | null = null
const isTouch = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const to = (p = '') => (p ? `${ROUTE}/${p}` : ROUTE)
const mailHref = (e: string) => `mailto:${e}`
const ERGO = 'https://ergo.is/bilalan/'

function goTo(id: string) {
  const t = document.getElementById(id)
  if (!t) return
  if (pageLenis) pageLenis.scrollTo(t, { offset: -110 })
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

function Frame({ p, sizes, ratio, className = '', pos, parallax = true }: { p: Photo; sizes: string; ratio?: string; className?: string; pos?: string; parallax?: boolean }) {
  return (
    <div className={`frame ${className}`} style={ratio ? { aspectRatio: ratio } : undefined} data-media="">
      <div className={parallax ? 'par' : 'still-photo'} data-par={parallax ? '' : undefined}>
        <Pic p={p} sizes={sizes} pos={pos} />
      </div>
    </div>
  )
}

type Tone = 'pine' | 'ink' | 'white' | 'line' | 'ghost'
function Btn({ to: path, href, label, tone = 'pine', icon, onClick, ext, type, className = '' }: {
  to?: string; href?: string; label: string; tone?: Tone; icon?: ReactNode; onClick?: () => void; ext?: boolean; type?: 'submit' | 'button'; className?: string
}) {
  const inner = (
    <>
      <span className="sr">{label}</span>
      <span className="lbl" aria-hidden="true">
        {[...label].map((c, i) => <span key={i} className="c" style={{ '--i': i } as CSSProperties}>{c === ' ' ? '\u00a0' : c}</span>)}
      </span>
      {icon}
    </>
  )
  const cls = `btn btn-${tone} ${className}`
  if (path !== undefined) return <Link className={cls} to={to(path)} data-btn="" onClick={onClick}>{inner}</Link>
  if (href) return <a className={cls} href={href} data-btn="" {...(ext ? { target: '_blank', rel: 'noopener' } : {})} onClick={onClick}>{inner}</a>
  return <button className={cls} type={type ?? 'button'} onClick={onClick} data-btn="">{inner}</button>
}

function Lines({ lines }: { lines: ReactNode[] }) {
  return <>{lines.map((l, i) => <span key={i} className="lm"><span data-line="">{l}</span></span>)}</>
}


/* ── navigation: three groups with dropdowns ────────────────────────────── */

type NavItem = { k: string; label: string; sub: string }
const NAV: { key: string; label: string; items: NavItem[] }[] = [
  { key: 'vagnar', label: 'Vagnar', items: [
    { k: 'vagnar', label: 'Allir vagnar', sub: 'Nýir og notaðir, með verði og síum' },
    { k: 'vagnar?astand=notad', label: 'Notaðir vagnar', sub: 'Á sama stað og þeir nýju' },
    { k: 'uppitaka', label: 'Taka upp í', sub: 'Sendu fastanúmerið, fáðu mat' },
    { k: 'skodun', label: 'Bóka skoðun', sub: 'Komdu og skoðaðu í Víkurhvarfi' },
  ] },
  { key: 'leiga', label: 'Leiga', items: [
    { k: 'leiga', label: 'Leiguvagnar', sub: 'Sumarið 2027, vika í senn' },
    ...RENTALS.map((r) => ({ k: `leiga/${r.key}`, label: r.name, sub: `${r.short}, frá ${kr(r.price)} á viku` })),
  ] },
  { key: 'thjonusta', label: 'Þjónusta', items: [
    { k: 'verkstaedi', label: 'Bóka verkstæði', sub: 'Skoðun, vetrarstandsetning, viðgerð' },
    { k: 'verslun', label: 'Verslun', sub: 'Fortjöld, grill, stólar og varahlutir' },
    { k: 'ferdalistinn', label: 'Ferðalistinn', sub: 'Allt sem fer með í ferðina' },
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
    <div className="row" ref={ref}>
      <Link className="logo" to={to()} aria-label="Víkurverk, forsíða">
        <img src={A('logo-t.png')} alt="" width={306} height={200} />
      </Link>
      <nav className="links" aria-label="Aðalvalmynd">
        {NAV.map((g) => (
          <div key={g.key} className="dd" data-dd={g.key} data-open={open === g.key ? '1' : '0'}
            onPointerEnter={() => { if (fine) setOpen(g.key) }} onPointerLeave={() => { if (fine) setOpen(null) }}>
            <button type="button" aria-expanded={open === g.key} aria-controls={`dd-${g.key}`} aria-current={g.items.some((i) => i.k.split(/[/?]/)[0] === page) ? 'true' : undefined}
              onClick={() => setOpen(open === g.key ? null : g.key)}>
              {g.label}<ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </button>
            <div className="panel" id={`dd-${g.key}`}>
              {g.items.map((i) => (
                <Link key={i.k} to={to(i.k)} tabIndex={open === g.key ? 0 : -1}><b>{i.label}</b><span>{i.sub}</span></Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="acts">
        <Link className="cta" to={to('leiga')}>Leigja vagn</Link>
        <Link className="bag" to={to('ferdalistinn')} aria-label={`Ferðalistinn, ${n} ${n === 1 ? 'vara' : 'vörur'}`}>
          <ShoppingBag size={22} strokeWidth={1.8} aria-hidden="true" />
          {n > 0 && <span className="n num" aria-hidden="true">{n}</span>}
        </Link>
        <button className="burger" type="button" onClick={onMenu} aria-label="Opna valmynd">
          <Menu size={24} strokeWidth={1.8} aria-hidden="true" />
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
          <span className={`tag sign ${x.cond === 'ny' ? 'new' : ''}`}>{x.cond === 'ny' ? 'Nýtt' : 'Notað'}</span>
          {x.flott && <span className="tag sign flott">Flott verð</span>}
        </span>
        {x.plan ? (
          <>
            <Pic className="plan" p={x.plan} sizes="(min-width: 1100px) 26vw, (min-width: 600px) 44vw, 80vw" />
            <Pic className="shot" p={shot} sizes="(min-width: 1100px) 26vw, (min-width: 600px) 44vw, 80vw" />
          </>
        ) : <Pic className="shot only" p={shot} sizes="(min-width: 1100px) 26vw, (min-width: 600px) 44vw, 80vw" />}
      </div>
      <div className="bd">
        <p className="br sign">{x.brand} · {kindLabel(x.kind)}</p>
        <h3 className="nm" translate="no">{x.model}</h3>
        <p className="facts num">
          {x.year && <span>Árgerð {x.year}</span>}
          {x.sleeps && <span>Svefnpláss {x.sleeps}</span>}
          {x.weight && <span>{x.weight.toLocaleString('de-DE')} kg</span>}
        </p>
        <p className="pr num">{kr(x.price)}</p>
      </div>
    </Link>
  )
}

function ProductCard({ p }: { p: Product }) {
  const list = useList()
  const on = list.some((l) => l.slug === p.slug)
  return (
    <article className="pcard">
      <div className="ph">
        {p.brand && <span className="sign">{p.brand}</span>}
        <Pic p={p.img} sizes="(min-width: 1100px) 20vw, (min-width: 700px) 30vw, 45vw" />
      </div>
      <div className="bd">
        <h3 className="nm">{p.name}</h3>
        <p className="pr num">{kr(p.price)}</p>
        <button type="button" className="add" aria-pressed={on} onClick={() => toggle(p.slug)} aria-label={on ? `Taka ${p.name} af ferðalistanum` : `Setja ${p.name} á ferðalistann`}>
          {on ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}{on ? 'Á lista' : 'Á lista'}
        </button>
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

/*
 * The home page: the Suðurverk landing's order (03-prototypes/sudurverk/src/pages.js home():
 * hero with a captioned photo, intro statement, featured 2 x 2, numbered rows of what
 * the company does, image + copy split, people, next-step questions) dressed in Set's
 * design (src/preview/set): white paper, ink, square grey cards, display capitals for
 * section titles, the dark uppercase button, ring links, the numbered accordion and
 * the dotted dimension rule. Suðurverk's pinned chapter is left out (no pinned scroll).
 */

const ARROW = <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
function Ring({ dir = 'right' }: { dir?: 'right' | 'left' }) {
  return (
    <span className="vring" aria-hidden="true">
      <svg viewBox="0 0 44 44"><circle className="r-wall" cx="22" cy="22" r="20" /><circle className="r-draw" cx="22" cy="22" r="20" pathLength={1} transform="rotate(-90 22 22)" /></svg>
      <ArrowRight size={15} strokeWidth={1.8} style={dir === 'left' ? { transform: 'rotate(180deg)' } : undefined} />
    </span>
  )
}
const pad2 = (n: number) => String(n).padStart(2, '0')

function Hero() {
  return (
    <section className="ss-hero" aria-labelledby="h-hero">
      <div className="wrap ss-inner">
        <div className="ss-copy">
          <p className="kick" data-open="">Víkurverk · Kópavogi · frá 2006</p>
          <h1 id="h-hero"><Lines lines={['Allt í', 'ferðalagið.']} /></h1>
          <p className="lede" data-open="">Ný og notuð hjólhýsi, húsbílar og sporthýsi. Leiga, verkstæði og verslun í Víkurhvarfi.</p>
          <div className="cta" data-open="">
            <Link className="sbtn" to={to('vagnar')}>Skoða vagnana{ARROW}</Link>
            <Link className="ringlink" to={to('leiga')}><Ring />Leiga sumarið 2027</Link>
          </div>
        </div>
        <figure className="ss-photo">
          <div className="mask" data-hmask=""><div className="hp" data-hp=""><Pic p={photo('showroom', 'Sýningarsalur Víkurverks með Randger húsbíl og hjólhýsum')} sizes="(max-width: 900px) 100vw, 50vw" eager /></div></div>
          <figcaption data-open=""><span>Sýningarsalurinn í Víkurhvarfi</span><span>Randger R560 4x4</span></figcaption>
        </figure>
      </div>
      <div className="wrap"><div className="ss-dots" aria-hidden="true" /></div>
    </section>
  )
}

function HomeIntro() {
  return (
    <section id="intro" className="wrap ss-intro" aria-labelledby="h-intro">
      <h2 id="h-intro" className="sh" data-fade="">Allt sem ferðalagið þarf, á einum stað.</h2>
      <div>
        <p className="lead" data-fade="">Víkurverk selur nýja húsbíla, hjólhýsi, sporthýsi og tjaldvagna, og notaða ferðavagna á sama lista.</p>
        <p data-fade="">Á sumrin leigir Víkurverk út hjólhýsi og Mink. Verkstæðið er opið allt árið og verslunin er með það sem fer með í ferðina.</p>
        <Link className="ringlink" to={to('skodun')} data-fade=""><Ring />Bóka skoðun</Link>
      </div>
    </section>
  )
}

const FEATURED: { slug: string; img: Photo }[] = [
  { slug: 'hobby-prestige-620-cl', img: photo('u-prestige-620-cl-1', 'Hobby Prestige 620 CL í sýningarsal Víkurverks') },
  { slug: 'mink-s', img: photo('mink-life', 'Mink sporthýsi með markísu') },
  { slug: 'adria-aviva-360-dk', img: photo('u-aviva-360-dk-1', 'Adria Aviva 360 DK hjólhýsi') },
  { slug: 'randger-r560', img: photo('u-randger-r560-1', 'Randger R560 4x4 húsbíll í sýningarsal') },
]
function Featured() {
  return (
    <section className="wrap ss-sec" aria-labelledby="h-sel">
      <div className="ss-head">
        <h2 className="sd" id="h-sel" data-chars="">Vagnar</h2>
        <p data-fade="">Á staðnum núna, með verði, svefnplássi og þyngd. Nýir og notaðir á einum lista.</p>
      </div>
      <ul className="ss-feat" role="list" data-items="">
        {FEATURED.map(({ slug, img }) => {
          const x = unitBySlug(slug)!
          return (
            <li key={slug}>
              <Link className="ss-card" to={to(`vagnar/${slug}`)}>
                <p className="leaf"><span>{kindLabel(x.kind)} · {x.brand}</span><span>{x.cond === 'ny' ? 'Nýtt' : 'Notað'}</span></p>
                <div className="ph"><Pic p={img} sizes="(max-width: 900px) 100vw, 46vw" /></div>
                <div className="ft">
                  <div><h3 translate="no">{x.model}</h3><p className="num">{[x.sleeps && `Svefnpláss ${x.sleeps}`, x.weight && `${x.weight.toLocaleString('de-DE')} kg`].filter(Boolean).join(' · ')}</p></div>
                  <p className="pr num">{kr(x.price)}</p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
      <Link className="ringlink" to={to('vagnar')}><Ring />Allir vagnar</Link>
    </section>
  )
}

const DOING: { t: string; d: string; to: string }[] = [
  { t: 'Hjólhýsi', d: 'Hobby, Adria og Fendt. 46 gerðir með verði.', to: 'vagnar?tegund=hjolhysi' },
  { t: 'Húsbílar', d: 'Randger og Benimar, líka með fjórhjóladrifi.', to: 'vagnar?tegund=husbill' },
  { t: 'Sporthýsi og tjaldvagnar', d: 'Mink, hannaður á Íslandi, og Camp-Let.', to: 'vagnar?tegund=sporthysi' },
  { t: 'Notaðir vagnar', d: '24 á söluskrá, á sama lista og þeir nýju.', to: 'vagnar?astand=notad' },
  { t: 'Leiga', d: 'Hjólhýsi og Mink, vika í senn, sumarið 2027.', to: 'leiga' },
  { t: 'Verkstæði', d: 'Skoðanir, vetrarstandsetning og tjónaviðgerðir.', to: 'verkstaedi' },
  { t: 'Verslun', d: '1.635 vörur, frí heimsending yfir 20.000 kr.', to: 'verslun' },
]
function Doing() {
  return (
    <section className="wrap ss-sec" aria-labelledby="h-doing">
      <div className="ss-head">
        <h2 className="sd" id="h-doing" data-chars="">Starfsemin</h2>
        <p data-fade="">Frá fyrsta hjólhýsinu að vetrargeymslunni. Veldu það sem þú ert að leita að.</p>
      </div>
      <div className="ss-rows" data-items="">
        {DOING.map((r, i) => (
          <Link key={r.t} to={to(r.to)}>
            <span className="n num">{pad2(i + 1)}</span>
            <span className="tx"><b>{r.t}</b><small>{r.d}</small></span>
            <Ring />
          </Link>
        ))}
      </div>
    </section>
  )
}

function Split() {
  return (
    <section className="wrap ss-split" aria-labelledby="h-split">
      <figure className="vis" data-media=""><Pic p={photo('workshop', 'Hjólhýsi standsett á verkstæði Víkurverks')} sizes="(max-width: 900px) 100vw, 50vw" /></figure>
      <div className="cp">
        <h2 className="sd" id="h-split" data-chars="">Verkstæði</h2>
        <p data-fade="">Opið allt árið. Stærri tjónaviðgerðir eru unnar frá 1. september til 1. apríl; gefðu upp fastanúmer vagnsins.</p>
        <div className="inl" data-fade="">{SERVICES.map((s) => <Link key={s.key} to={to('verkstaedi')}>{s.label}{ARROW}</Link>)}</div>
        <Link className="sbtn" to={to('verkstaedi')} data-fade="">Bóka verkstæði{ARROW}</Link>
      </div>
    </section>
  )
}

const SHOP_ROWS: { t: string; d: string; cat: string; items: string[] }[] = [
  { t: 'Fortjöld og útilega', d: 'Kampa/Dometic fortjöld, stólar og kælibox frá Brunner.', cat: 'fortjold', items: ['fortjald-club-air-pro-260s-kampa-dometic', 'stoll-aravel-3d-m-svartur-brunner', 'kaelibox-polarys-freeze-sz-30l-brunner'] },
  { t: 'Grill og gas', d: 'O-Grill, borðstandur og þrýstijafnari sem passar.', cat: 'grill', items: ['o-grill-3500-rautt', 'bordstandur-fyrir-o-grill', 'thrystijafnari-29mb-m-2-slongu'] },
  { t: 'Fyrir vagninn', d: 'Tröppur, upphækkun og frostlögur fyrir veturinn.', cat: 'vagninn', items: ['troppur-king', 'level-up-kit-m-tosku', 'neysluvatns-frostlogur-2'] },
]
function Shop() {
  const t = TRIPS.find((x) => x.key === 'sumarfri')!
  const total = t.items.reduce((a, [sl, q]) => a + (productBySlug(sl)?.price ?? 0) * q, 0)
  return (
    <section className="wrap ss-sec ss-shop" id="verslun" aria-labelledby="h-shop">
      <div className="ss-head">
        <h2 className="sd" id="h-shop" data-chars="">Verslun</h2>
        <p data-fade="">1.635 vörur í verslun Víkurverks. Frí heimsending á pöntunum yfir 20.000 kr.</p>
      </div>
      <div className="ss-dots" aria-hidden="true" style={{ width: '100%', marginTop: 0 }} />
      {SHOP_ROWS.map((r, i) => (
        <article className="srow2" key={r.t} aria-labelledby={`shop-${i}`}>
          <div className="txt">
            <p className="n num">{pad2(i + 1)}</p>
            <h3 id={`shop-${i}`}>{r.t}</h3>
            <p className="d">{r.d}</p>
            <Link className="ringlink" to={to(`verslun?flokkur=${r.cat}`)}><Ring />Skoða allt<span className="sr"> {r.t}</span></Link>
          </div>
          <ul className="cards" role="list" data-items="">
            {r.items.map((sl) => <li key={sl}><ProductCard p={productBySlug(sl)!} /></li>)}
          </ul>
        </article>
      ))}
      <div className="vv-steaser ss-teaser">
        <div className="tt">
          <h3 className="sd" data-chars="">Ferðalistinn</h3>
          <p className="lede" data-fade="">Byrjaðu á tilbúnum lista fyrir helgarferð, sumarfríið eða haustið, lagaðu magnið og sendu pöntunina.</p>
          <Link className="sbtn" to={to('ferdalistinn?ferd=sumarfri')}>Opna ferðalistann{ARROW}</Link>
        </div>
        <ul className="tl2" aria-label="Sumarfríið, ferðalisti" data-fade="">
          {t.items.slice(0, 4).map(([sl, q]) => { const pr = productBySlug(sl)!; return <li key={sl}><img src={pr.img.src} alt="" width={56} height={56} loading="lazy" /><b>{pr.name}</b><span className="num">{q} stk. · {kr(pr.price)}</span></li> })}
          <li className="foot on-dark"><span>Sumarfríið · {t.items.length} vörur · <b className="num">{kr(total)}</b></span><img src={A('logo-white.png')} alt="" width={306} height={200} /></li>
        </ul>
      </div>
    </section>
  )
}

function People() {
  return (
    <section className="wrap ss-sec ss-people" aria-labelledby="h-people">
      <div className="ss-head">
        <h2 className="sd" id="h-people" data-chars="">Fólkið</h2>
        <p data-fade="">Söluráðgjafar í Víkurhvarfi. Skoðaðu vagninn með þeim, spurðu um fjármögnun hjá Ergo eða láttu meta vagninn þinn upp í.</p>
      </div>
      <ul className="ppl" role="list" data-items="">
        {PEOPLE.map((p) => <li key={p.email}><a href={mailHref(p.email)}><b>{p.name}</b><span>{p.role}</span><small>{p.email}</small></a></li>)}
      </ul>
    </section>
  )
}

const NEXT: { q: string; a: string; link: [string, string] }[] = [
  { q: 'Get ég tekið vagninn minn upp í?', a: 'Já. Sendu fastanúmer, gerð og árgerð og söluráðgjafi metur vagninn, upp í nýjan eða í umboðssölu.', link: ['Senda vagninn til mats', 'uppitaka'] },
  { q: 'Hvenær er hægt að bóka leigu?', a: 'Sumarið 2027 er opið. Leigan er vika í senn, frá fimmtudegi til miðvikudags, með afhendingu kl. 13-15.', link: ['Sjá lausar vikur', 'leiga'] },
  { q: 'Þarf ég sérstök réttindi til að draga hjólhýsi?', a: 'Ökuréttindi gefin út fyrir 15. ágúst 1997 gilda sjálfkrafa. Yngri réttindum þarf að bæta við. Dráttargeta bílsins þarf að ná leyfilegri heildarþyngd vagnsins.', link: ['Hvað dregur bíllinn?', 'vagnar#drattargeta'] },
]
function NextStep() {
  const [open, setOpen] = useState(0)
  return (
    <section className="wrap vv-show ss-faq" aria-labelledby="h-next">
      <div className="hh">
        <h2 className="sd" id="h-next" data-chars="">Spurt og svarað</h2>
        <a className="sbtn" href={`tel:${CONTACT.tel}`}>Hringja {CONTACT.phone}<Phone size={16} aria-hidden="true" /></a>
      </div>
      <ol className="acc-list">
        {NEXT.map((n, i) => {
          const on = open === i
          return (
            <li key={n.q} className={`acc${on ? ' is-open' : ''}`}>
              <h3><button type="button" className="acc-b" aria-expanded={on} aria-controls={`acc-${i}`} id={`acc-b-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                <span className="an num">{pad2(i + 1)}</span><span className="at">{n.q}</span><span className="pm" aria-hidden="true" />
              </button></h3>
              <div className="acc-p" id={`acc-${i}`} role="region" aria-labelledby={`acc-b-${i}`}>
                <div><p>{n.a} <Link className="tlink" to={to(n.link[1])} tabIndex={on ? 0 : -1}>{n.link[0]}</Link></p></div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <HomeIntro />
      <Featured />
      <Doing />
      <Split />
      <Shop />
      <People />
      <NextStep />
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
    <section className="wrap vv-tow" id="drattargeta" aria-labelledby="h-tow">
      <div className="tow-head">
        <h2 id="h-tow" data-chars="">Hvað dregur bíllinn?</h2>
        <p data-fade="">Dráttargeta bílsins þarf að vera jöfn eða meiri en leyfileg heildarþyngd vagnsins. Hún stendur í skráningarskírteininu. Dragðu sleðann.</p>
      </div>
      <div className="tow-tool">
        <label className="tow-in" htmlFor="tow-kg">
          <span className="sign">Bíllinn má draga</span>
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
      </div>
      <ul className="tow-cards" role="list">
        {TOW.map((u) => {
          const ok = u.maxWeight! <= kg
          return (
            <li key={u.slug} data-ok={ok ? '1' : '0'}>
              <Link to={to(`vagnar/${u.slug}`)} className="tc">
                <div className="ph"><Pic className="plan" p={u.plan ?? u.imgs[0]} sizes="(min-width: 900px) 15vw, 45vw" /></div>
                <span className="sign muted">{u.brand}</span>
                <b translate="no">{u.model}</b>
                <span className="num kg">{u.maxWeight!.toLocaleString('de-DE')} kg leyfileg</span>
                <span className="num pr">{kr(u.price)}</span>
                <span className={`fit sign${ok ? ' ok' : ''}`}>{ok ? 'Passar' : 'Of þungt'}</span>
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

/* the longest word decides the size on phones (Set's per-word fit, approximated from character count) */
const fitw = (t: ReactNode[]) => Math.max(5, ...t.map((x) => (typeof x === 'string' ? Math.max(...x.split(/\s+/).map((w) => w.length)) * 0.72 + 0.3 : 6)))

function Intro({ title, lede, crumb }: { title: ReactNode[]; lede?: ReactNode; crumb?: { to: string; label: string } }) {
  return (
    <div className="intro">
      {crumb && <Link className="crumb" to={to(crumb.to)} data-open=""><ArrowLeft size={16} aria-hidden="true" />{crumb.label}</Link>}
      <h1 style={{ '--fitw': fitw(title) } as CSSProperties}><Lines lines={title} /></h1>
      {lede && <p className="lede" data-open="">{lede}</p>}
    </div>
  )
}

function Field({ label, name, type = 'text', required, auto, mode, error, placeholder, hint, defaultValue }: { label: string; name: string; type?: string; required?: boolean; auto?: string; mode?: 'tel' | 'email' | 'numeric'; error?: string; placeholder?: string; hint?: string; defaultValue?: string }) {
  const id = `f-${name}`
  return (
    <label htmlFor={id}>
      <span>{label}{required ? '' : ' (valfrjálst)'}</span>
      <input id={id} name={name} type={type} required={required} autoComplete={auto} inputMode={mode} placeholder={placeholder} defaultValue={defaultValue}
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
      <p style={{ marginTop: 10 }}>{r.kind === 'leiga' ? 'Víkurverk staðfestir vikuna og sendir greiðsluhlekk. Vikan er frátekin á meðan.' : 'Svar berst í símann eða netfangið sem þú gafst upp.'}</p>
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

/* ── catalogue ──────────────────────────────────────────────────────────── */

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

function CatalogPage() {
  const [sp, setSp] = useSearchParams()
  const [open, setOpen] = useState(false)
  const f = { astand: sp.get('astand') ?? '', tegund: sp.get('tegund') ?? '', merki: sp.get('merki') ?? '', svefn: sp.get('svefn') ?? '', thyngd: sp.get('thyngd') ?? '', rod: sp.get('rod') ?? 'verd-upp' }
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }) }
  const items = UNITS.filter((u) => (!f.astand || u.cond === f.astand) && (!f.tegund || u.kind === f.tegund) && (!f.merki || u.brandKey === f.merki)
    && (!f.svefn || (u.sleepsN ?? 0) >= Number(f.svefn)) && (!f.thyngd || (u.weight ?? 9e9) <= Number(f.thyngd))).sort((SORTS[f.rod] ?? SORTS['verd-upp']).fn)
  const active = ['astand', 'tegund', 'merki', 'svefn', 'thyngd'].filter((k) => sp.get(k)).length
  return (
    <div className="vv-page"><div className="wrap">
      <Intro title={['Vagnar']} lede="Nýir og notaðir vagnar á einum lista, með verði, svefnplássi og eigin þyngd. Síaðu eftir því sem skiptir þig máli." />
      <div className="filters" data-open={open ? '1' : '0'}>
        <button type="button" className="ftoggle" aria-expanded={open} onClick={() => setOpen(!open)}><SlidersHorizontal size={18} aria-hidden="true" />Síur{active ? ` (${active})` : ''}<ChevronDown className="chev" size={18} aria-hidden="true" /></button>
        <div className="fbody">
          <div className="frow"><span className="sign">Ástand</span><Chips name="Ástand" value={f.astand} onPick={(v) => set('astand', v)} opts={[['', 'Allt'], ['ny', 'Nýtt'], ['notad', 'Notað']]} /></div>
          <div className="frow"><span className="sign">Tegund</span><Chips name="Tegund" value={f.tegund} onPick={(v) => set('tegund', v)} opts={[['', 'Allar'], ...KINDS.map((k) => [k.key, k.plural] as [string, string])]} /></div>
          <div className="frow"><span className="sign">Merki</span><Chips name="Merki" value={f.merki} onPick={(v) => set('merki', v)} opts={[['', 'Öll'], ...BRAND_KEYS]} /></div>
          <div className="frow"><span className="sign">Svefnpláss</span><Chips name="Svefnpláss" value={f.svefn} onPick={(v) => set('svefn', v)} opts={[['', 'Skiptir ekki'], ['3', '3 eða fleiri'], ['4', '4 eða fleiri'], ['5', '5 eða fleiri']]} /></div>
          <div className="frow"><span className="sign">Eigin þyngd</span><Chips name="Eigin þyngd" value={f.thyngd} onPick={(v) => set('thyngd', v)} opts={[['', 'Skiptir ekki'], ['750', 'Allt að 750 kg'], ['1300', 'Allt að 1.300 kg'], ['1700', 'Allt að 1.700 kg']]} /></div>
        </div>
      </div>
      <div className="ftools" style={{ marginBottom: 20 }}>
        <p aria-live="polite"><b className="num">{items.length}</b> {items.length === 1 ? 'vagn' : 'vagnar'} í úrtakinu{active ? '' : ''}</p>
        <label>Röðun{' '}
          <select value={f.rod} onChange={(e) => set('rod', e.target.value === 'verd-upp' ? '' : e.target.value)}>
            {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
        </label>
      </div>
      {items.length ? (
        <motion.ul className="ugrid" role="list" layout>
          <AnimatePresence mode="popLayout">
            {items.map((x) => (
              <motion.li key={x.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
                <UnitCard x={x} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="empty">
          <h3>Enginn vagn passar</h3>
          <p>Prófaðu að slaka á einni síu. Allt úrvalið hjá Víkurverki er stærra en úrtakið hér.</p>
          <Btn label="Hreinsa síur" tone="ink" onClick={() => setSp(new URLSearchParams(), { replace: true })} />
        </div>
      )}
      <p className="note">{SAMPLE_NOTE}</p>
    </div><Towing /></div>
  )
}

function DetailPage({ slug }: { slug: string }) {
  const x = unitBySlug(slug)
  if (!x) return <NotFound />
  const keys: [string, string][] = [
    ['Svefnpláss', x.sleeps ?? (x.year ? `Árg. ${x.year.split('/')[1]}` : 'Sjá bækling')],
    ['Eigin þyngd', x.weight ? `${x.weight.toLocaleString('de-DE')} kg` : '-'],
    ['Lengd', x.length ? `${x.length} cm` : x.reg ? `Nr. ${x.reg}` : '-'],
  ]
  return (
    <div className="vv-page vv-detail"><div className="wrap">
      <div className="dgrid">
        <div className="dside">
          <Link className="crumb tlink" to={to('vagnar')} style={{ border: 0, width: 'max-content' }} data-open=""><ArrowLeft size={16} aria-hidden="true" />Allir vagnar</Link>
          <p className="sign muted" data-open="">{x.brand} · {kindLabel(x.kind)} · {x.cond === 'ny' ? 'Nýtt' : `Notað, árgerð ${x.year}`}</p>
          <h1 translate="no"><Lines lines={[x.model]} /></h1>
          <p className="price num" data-open="">{kr(x.price)}{x.flott && <span className="tag sign flott" style={{ marginLeft: 10, verticalAlign: 'middle' }}>Flott verð</span>}</p>
          <div className="keys" data-open="">{keys.map(([k, v]) => <div key={k}><span className="sign">{k}</span><b className="num">{v}</b></div>)}</div>
          <div className="dacts" data-open="">
            <Btn to={`skodun?v=${x.slug}`} label="Bóka skoðun" tone="pine" />
            <Btn to={`uppitaka?v=${x.slug}`} label="Taka minn upp í" tone="line" />
          </div>
          <p className="fin" data-open="">Fjármögnun: Víkurverk vinnur með Ergo. <a href={ERGO} target="_blank" rel="noopener">Reiknaðu lánið</a>.</p>
          <div data-open="">
            <p className="sign muted" style={{ marginBottom: 6 }}>Söluráðgjafar</p>
            <div className="sellers">
              {PEOPLE.slice(0, 3).map((p) => <a key={p.email} href={mailHref(p.email)}>{p.name}<span>{p.email}</span></a>)}
              <a href={`tel:${CONTACT.tel}`}>Sími<span className="num">{CONTACT.phone}</span></a>
            </div>
          </div>
        </div>
        <div>
          {x.plan && <div className="plan" data-media=""><Pic p={x.plan} sizes="(min-width: 900px) 60vw, 100vw" /></div>}
          <div className="gal">{x.imgs.slice(0, 1 + Math.floor((Math.min(x.imgs.length, 5) - 1) / 2) * 2).map((p, i) => <Frame key={i} p={p} sizes={i === 0 ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 30vw, 50vw'} parallax={false} />)}</div>
          <dl className="specs">{x.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="num">{v}</dd></div>)}</dl>
          <div className="dtext">{x.text.map((t) => <p key={t}>{t}</p>)}</div>
          <div className="files">
            {x.pdf && <Btn href={x.pdf} ext label="Bæklingur (PDF)" tone="line" icon={<Download size={17} aria-hidden="true" />} />}
            {x.v360 && <Btn href={x.v360} ext label="360° skoðun" tone="line" icon={<ExternalLink size={17} aria-hidden="true" />} />}
          </div>
          <p className="note">Upplýsingar af {x.cond === 'ny' ? 'vikurverk.is og bæklingi Víkurverks' : 'söluskrá Víkurverks'}, 9. október 2026. Verð geta breyst.</p>
        </div>
      </div>
    </div></div>
  )
}

/* ── rental ─────────────────────────────────────────────────────────────── */

function RentalList() {
  return (
    <div className="vv-page"><div className="wrap">
      <Intro title={['Leiga']} lede="Þrír vagnar til leigu, vika í senn frá fimmtudegi til miðvikudags. Sjáðu lausar vikur sumarsins 2027 og sendu beiðni." />
      <ul className="rlist" role="list">
        {RENTALS.map((r) => {
          const fw = freeWeeks(r.key, 4)
          return (
            <li key={r.key} className="rrow">
              <div className="ph"><Pic p={r.img} sizes="(min-width: 900px) 34vw, 100vw" /></div>
              <div className="bd">
                <span className="sign muted">{r.short} · svefnpláss {r.sleeps}</span>
                <h2 translate="no">{r.name}</h2>
                <p className="num"><b style={{ fontSize: 22 }}>{kr(r.price)}</b> á viku{r.peak ? `, ${kr(r.peak)} vikuna um verslunarmannahelgi` : ''}</p>
                <p className="muted">{r.text}</p>
                <p className="sign" style={{ marginTop: 6 }}>Næstu lausu vikur</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{fw.map((w) => <span key={w.i} className="tag sign num">{w.label}</span>)}</div>
                <div style={{ marginTop: 10 }}><Btn to={`leiga/${r.key}`} label="Velja vikur" tone="pine" icon={<ArrowRight size={18} aria-hidden="true" />} /></div>
              </div>
            </li>
          )
        })}
      </ul>
      <section style={{ marginTop: 'var(--sec)' }} aria-labelledby="h-terms" className="book-grid">
        <div>
          <h2 id="h-terms" data-chars="">Skilmálar í stuttu máli</h2>
          <ul className="terms" style={{ marginTop: 24 }}>{RENTAL_TERMS.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <aside className="aside">
          <h3>Aukalega</h3>
          {Object.values(EXTRAS).map((e) => <p key={e.label}><b style={{ color: 'var(--ink)' }}>{e.label}: {kr(e.price)}.</b> {e.note}</p>)}
        </aside>
      </section>
      <p className="note">Dagatalið sýnir sumarið 2027 sett upp eins og sumarið 2026 á vikurverk.is (fimmtudagur til miðvikudags, 13. maí til 15. sept.) með verðum ársins 2026. Bókaðar vikur eru sýnishorn.</p>
    </div></div>
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
  if (done) return <div className="vv-page"><div className="wrap"><Done r={done} back={<Btn to="leiga" label="Aftur í leigu" tone="pine" />} /></div></div>
  return (
    <div className="vv-page"><div className="wrap">
      <Intro crumb={{ to: 'leiga', label: 'Allir leiguvagnar' }} title={[r.name]} lede={`${r.text} ${kr(r.price)} á viku${r.peak ? `, ${kr(r.peak)} vikuna um verslunarmannahelgi` : ''}.`} />
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
                    <span className="sign num">Vika {w.i + 1}</span>
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
                <span style={{ margin: 0, fontWeight: 500 }}>{EXTRAS[k].label}, {kr(EXTRAS[k].price)}<small className="hint" style={{ marginTop: 2 }}>{EXTRAS[k].note}</small></span>
              </label>
            ))}
          </fieldset>
          <Contact err={err} emailRequired />
          <label htmlFor="f-fjoldi"><span>Hversu mörg verða með? (valfrjálst)</span><input id="f-fjoldi" name="fjoldi" inputMode="numeric" /></label>
          <div className="acts"><Btn type="submit" label="Senda leigubeiðni" tone="pine" /></div>
          <p className="proto-note">Víkurverk staðfestir og sendir greiðsluhlekk; ekkert er rukkað hér.</p>
        </form>
        <aside className="aside" aria-label="Samantekt">
          <div className="sumbox" style={{ '--p': sel.length ? 1 : 0 } as CSSProperties}>
            <span className="sw" aria-hidden="true" />
            <div><span>Vikur</span><span className="num">{sel.length || '-'}</span></div>
            <div><span>Leiga</span><span className="num">{kr(rent)}</span></div>
            <div><span>Aukalega</span><span className="num">{kr(extras)}</span></div>
            <div><span>Samtals</span><span className="num">{kr(rent + extras)}</span></div>
          </div>
          <Frame p={r.imgs[0] ?? r.img} sizes="(min-width: 900px) 34vw, 100vw" parallax={false} />
          <dl className="specs" style={{ marginTop: 0 }}>{r.specs.map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--line)' }}><dt className="muted">{k}</dt><dd className="num" style={{ fontWeight: 600 }}>{v}</dd></div>)}</dl>
          <ul className="terms">{RENTAL_TERMS.slice(0, 3).map((t) => <li key={t}>{t}</li>)}</ul>
        </aside>
      </div>
    </div></div>
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
      <Pic p={x.plan ?? x.imgs[0]} sizes="110px" />
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
  if (done) return <div className="vv-page"><div className="wrap"><Done r={done} back={<Btn to="vagnar" label="Aftur í vagna" tone="pine" />} /></div></div>
  return (
    <div className="vv-page"><div className="wrap">
      <Intro title={['Bóka skoðun']} lede="Veldu vagn, dag og tíma. Söluráðgjafi tekur á móti þér í Víkurhvarfi 6." />
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
          <label className="check"><input type="checkbox" name="fjarmognun" /><span style={{ margin: 0, fontWeight: 500 }}>Ég vil skoða fjármögnun hjá Ergo</span></label>
          <label className="check"><input type="checkbox" name="uppi" /><span style={{ margin: 0, fontWeight: 500 }}>Ég á vagn sem ég vil taka upp í</span></label>
          <div className="acts"><Btn type="submit" label="Bóka skoðun" tone="pine" /></div>
        </form>
        <aside className="aside">
          <h3>Opið til skoðunar</h3>
          <p>{HOURS.shopWinter}.</p>
          <p>{HOURS.shopSummer}.</p>
          <Frame p={photo('showroom', 'Sýningarsalur Víkurverks')} sizes="(min-width: 900px) 34vw, 100vw" parallax={false} />
        </aside>
      </div>
    </div></div>
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
  if (done) return <div className="vv-page"><div className="wrap"><Done r={done} back={<Btn to="vagnar" label="Skoða vagna" tone="pine" />} /></div></div>
  return (
    <div className="vv-page"><div className="wrap">
      <Intro title={['Taka upp í']} lede="Sendu upplýsingar um vagninn þinn. Söluráðgjafi metur hann, upp í nýjan vagn eða í umboðssölu hjá Víkurverki." />
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
          <div className="acts"><Btn type="submit" label="Senda til mats" tone="pine" /></div>
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
    </div></div>
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
  if (done) return <div className="vv-page"><div className="wrap"><Done r={done} back={<Btn to="" label="Á forsíðu" tone="pine" />} /></div></div>
  return (
    <div className="vv-page"><div className="wrap">
      <Intro title={['Bóka verkstæði']} lede="Veldu þjónustu og viku. Verkstæðið staðfestir tímann; móttakan er austan megin við húsið." />
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
          <div className="acts"><Btn type="submit" label="Senda beiðni" tone="pine" /></div>
        </form>
        <aside className="aside">
          <h3>Gott að vita</h3>
          <ul className="terms">{WORKSHOP_FACTS.map((f) => <li key={f}>{f}</li>)}</ul>
          <p><b style={{ color: 'var(--ink)' }}>{HOURS.workshop}.</b> {CONTACT.workshop}, sími {CONTACT.phone}.</p>
          <Frame p={photo('workshop-2', 'Unnið í innréttingu hjólhýsis á verkstæði Víkurverks')} sizes="(min-width: 900px) 34vw, 100vw" parallax={false} />
        </aside>
      </div>
    </div></div>
  )
}

/* ── shop + trip list ───────────────────────────────────────────────────── */

function ShopPage() {
  const [sp, setSp] = useSearchParams()
  const cat = sp.get('flokkur') ?? ''
  const list = useList()
  const items = PRODUCTS.filter((p) => !cat || p.cat === cat)
  return (
    <div className="vv-page"><div className="wrap">
      <Intro title={['Verslun']} lede="Fortjöld, grill, stólar, kælibox og það sem vagninn þarf. Frí heimsending á pöntunum yfir 20.000 kr." />
      <div className="ftools" style={{ marginBottom: 20 }}>
        <Chips name="Flokkur" value={cat} onPick={(v) => { const n = new URLSearchParams(sp); if (v) n.set('flokkur', v); else n.delete('flokkur'); setSp(n, { replace: true }) }}
          opts={[['', 'Allt'], ...SHOP_CATS.map((c) => [c.key, c.label] as [string, string])]} />
        <Link className="tlink" to={to('ferdalistinn')}>Ferðalistinn ({listCount(list)}) <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
      <motion.ul className="pgrid" role="list" layout>
        <AnimatePresence mode="popLayout">
          {items.map((p) => (
            <motion.li key={p.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}><ProductCard p={p} /></motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      <p className="note">{SHOP_NOTE} Flokkarnir eru {SHOP_CATS.map((c) => `${c.label} (${c.count})`).join(', ')} og fleiri.</p>
    </div></div>
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
  if (done) return <div className="vv-page"><div className="wrap"><Done r={done} back={<Btn to="verslun" label="Aftur í verslun" tone="pine" />} /></div></div>
  return (
    <div className="vv-page"><div className="wrap">
      <Intro title={['Ferðalistinn']} lede="Byrjaðu á tilbúnum lista fyrir ferðina, eða safnaðu vörum úr versluninni. Lagaðu magnið og sendu pöntunina." />
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
                    <div className="qty"><button type="button" aria-label={`Fækka ${p.name}`} onClick={() => setQty(l.slug, l.qty - 1)}><Minus size={16} aria-hidden="true" /></button><span className="num" aria-live="polite">{l.qty}</span><button type="button" aria-label={`Fjölga ${p.name}`} onClick={() => setQty(l.slug, l.qty + 1)}><Plus size={16} aria-hidden="true" /></button></div>
                    <button type="button" className="rm" aria-label={`Taka ${p.name} af listanum`} onClick={() => setQty(l.slug, 0)}><Trash2 size={18} aria-hidden="true" /></button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="empty"><h3>Listinn er tómur</h3><p>Veldu ferð hér að ofan eða settu vörur á listann í versluninni.</p><Btn to="verslun" label="Í verslun" tone="ink" /></div>
          )}
          {err.listi && <p className="err" role="alert" style={{ color: '#B00012', marginTop: 10 }}>{err.listi}</p>}
        </div>
        <aside className="aside" aria-label="Pöntun">
          <div className="sumbox">
            <div><span>Vörur</span><span className="num">{listCount(list)}</span></div>
            <div><span>Samtals</span><span className="num">{kr(total)}</span></div>
          </div>
          <div>
            <div className="ship" aria-hidden="true"><i style={{ transform: `scaleX(${Math.min(1, total / FREE_SHIPPING)})` }} /></div>
            <p style={{ fontSize: 14 }}>{toFree ? `${kr(toFree)} upp í fría heimsendingu.` : 'Frí heimsending.'}</p>
          </div>
          <form className="form" onSubmit={submit} noValidate>
            <fieldset><legend>Afhending</legend><div className="opts">{['Senda heim', 'Sækja í Víkurhvarf'].map((a, i) => <label key={a} className="opt"><input type="radio" name="afh" value={a} defaultChecked={i === 0} /><span>{a}</span></label>)}</div></fieldset>
            <Contact err={err} />
            <div className="acts"><Btn type="submit" label="Senda pöntun" tone="pine" /></div>
            <p className="proto-note">Í vef Víkurverks færi þetta beint í körfu vefverslunarinnar.</p>
          </form>
        </aside>
      </div>
    </div></div>
  )
}

/* ── staff side ─────────────────────────────────────────────────────────── */

function InboxPage() {
  const [kind, setKind] = useState<ReqKind | ''>('')
  const [st, setSt] = useState<Record<string, 'ný' | 'staðfest'>>({})
  const all = [...loadRequests(), ...SAMPLE_REQUESTS]
  const rows = all.filter((r) => !kind || r.kind === kind)
  return (
    <div className="vv-page vv-inbox"><div className="wrap">
      <Intro title={['Afgreiðsla']} lede="Hlið starfsfólks: leigubeiðnir, skoðanir, uppítökur, verkstæðistímar og ferðalistar á einum stað, hver á réttan stað." />
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
                <td><span className="kind sign">{REQ_LABEL[r.kind]}</span></td>
                <td><b style={{ fontWeight: 600 }}>{r.title}</b><br /><small>{r.when} · {r.kind === 'leiga' ? r.detail.split(':').slice(2).join(', ') : r.detail}</small></td>
                <td>{r.who}<br /><small>{r.contact}</small></td>
                <td><small>{routeTo(r.kind)}</small></td>
                <td><span className={`st${s === 'ný' ? ' new' : ''}`}><i aria-hidden="true" />{s === 'ný' ? 'Ný' : 'Staðfest'}</span></td>
                <td><div className="ia">{s === 'ný' && <button type="button" onClick={() => setSt((x) => ({ ...x, [r.id]: 'staðfest' }))}>Staðfesta</button>}<a href={r.contact.includes('@') ? `mailto:${r.contact.split(', ').pop()}` : `tel:${r.contact.split(',')[0].replace(/\s/g, '')}`}>Svara</a></div></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="inote">Frumgerð: beiðnir úr formunum eru geymdar í þessum vafra (sessionStorage). Í raunveruleikanum fara þær í tölvupóst á rétta deild og birtast hér.</p>
    </div></div>
  )
}

function PrivacyPage() {
  return (
    <div className="vv-page"><div className="wrap">
      <Intro title={['Persónuvernd']} lede="Hvaða upplýsingum formin á þessum vef myndu safna og til hvers." />
      <div className="doc">
        <p>Formin biðja um nafn, síma og netfang til að svara beiðninni, auk upplýsinga um vagninn (fastanúmer, gerð, árgerð) þegar beiðnin snýst um verkstæði eða uppítöku. Upplýsingarnar fara aðeins til Víkurverks ehf., kt. {CONTACT.kt}.</p>
        <p>Í þessari frumgerð er ekkert sent: beiðnir eru geymdar í vafranum þínum og hverfa þegar glugganum er lokað. Ferðalistinn er geymdur í vafranum þar til þú tæmir hann.</p>
        <p>Víkurverk birtir eigin persónuverndarstefnu á vikurverk.is.</p>
      </div>
    </div></div>
  )
}

function NotFound() {
  return <div className="vv-page"><div className="wrap"><Intro title={['Síðan fannst ekki.']} lede="Hlekkurinn er úreltur eða skakkt skrifaður." /><Btn to="" label="Á forsíðu" tone="ink" /></div></div>
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
  const [now, setNow] = useState(() => new Date())
  const chat = useRef<ChatEl | null>(null)
  const page = sub.split('/')[0]
  const seg = sub.split('/')
  const formPage = useRef(false)
  formPage.current = ['leiga', 'skodun', 'uppitaka', 'verkstaedi', 'ferdalistinn', 'afgreidsla'].includes(page) && (page !== 'leiga' || !!seg[1])

  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const [t, d] = TITLES[page] ?? TITLES['']
    const u = page === 'vagnar' && seg[1] ? unitBySlug(seg[1]) : undefined
    const r = page === 'leiga' && seg[1] ? RENTALS.find((x) => x.key === seg[1]) : undefined
    document.title = u ? `${unitName(u)} | Víkurverk` : r ? `Leiga: ${r.name} | Víkurverk` : t
    document.documentElement.lang = 'is'
    setThemeColor(PINE_INK)
    const a = setMetaDescription(u ? `${unitName(u)} hjá Víkurverki: ${kr(u.price)}${u.sleeps ? `, svefnpláss ${u.sleeps}` : ''}${u.weight ? `, ${u.weight} kg` : ''}.` : r ? `${r.name} til leigu: ${kr(r.price)} á viku.` : d)
    const nb = setNoindex(true)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => { document.title = prevTitle; document.documentElement.lang = prevLang; a(); nb(); ld.remove() }
  }, [sub, page]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 60_000); return () => window.clearInterval(t) }, [])

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
    if (loc.hash) { window.setTimeout(() => goTo(decodeURIComponent(loc.hash.slice(1))), 80); return }
    if (pageLenis) pageLenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0)
  }, [loc.pathname, loc.hash])

  /* chrome: hide on the way down, show on the way up */
  const chromeRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const chrome = chromeRef.current!
    let lastY = window.scrollY
    let raf = 0
    const tick = () => {
      raf = 0
      const y = window.scrollY
      chrome.dataset.solid = y > 20 ? '1' : '0'
      if (root.current) root.current.dataset.sticky = !formPage.current && y > window.innerHeight * 0.6 ? '1' : '0'
      if (!document.documentElement.classList.contains('vv-menu') && !chrome.querySelector('.dd[data-open="1"]')) {
        if (y > 320 && y > lastY + 4) chrome.dataset.hide = '1'
        else if (y < lastY - 4 || y <= 320) chrome.dataset.hide = '0'
      }
      lastY = y
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])

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
      gsap.fromTo(panel, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.32, ease: 'power3.out' })
      gsap.fromTo(panel.querySelectorAll('[data-mi]'), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.04, delay: 0.15, ease: 'vv' })
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

  /* motion per route: the staged opening, then position-tied reveals */
  useLayoutEffect(() => {
    const el = root.current!
    const main = el.querySelector<HTMLElement>('main')!
    const reduce = still()
    let ctx: gsap.Context | null = null
    let alive = true
    const splits: SplitText[] = []
    const build = () => { if (!alive) return; ctx = gsap.context(() => {
      if (reduce) return
      const desk = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches
      const travel = isTouch() ? 12 : 22

      /* the opening: masked lines, the swoosh draws, the photo settles under it, body, buttons */
      const open = gsap.timeline({ defaults: { ease: 'power3.out' } })
      const intro = main.querySelector<HTMLElement>('.ss-hero, .intro, .dside') ?? main
      const lines = intro.querySelectorAll('[data-line]')
      const opens = main.querySelectorAll('[data-open]')
      if (lines.length) open.from(lines, { yPercent: 112, duration: 0.72, stagger: 0.08 }, 0.12)
      const hmask = main.querySelector<HTMLElement>('[data-hmask]')
      const sw = main.querySelector<SVGPathElement>('[data-swoosh]')
      if (hmask) {
        open.fromTo(hmask, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'vv' }, 0.2)
        open.fromTo(hmask.querySelector('img'), { scale: 1.1 }, { scale: 1, duration: 1.5, ease: 'vv' }, 0.2)
      }
      if (sw) open.fromTo(sw, { clipPath: 'inset(-50% 100% -50% 0)' }, { clipPath: 'inset(-50% 0% -50% 0)', duration: 1.1, ease: 'vv' }, 0.75)
      if (opens.length) open.from(opens, { y: travel, opacity: 0, duration: 0.55, stagger: 0.07 }, 0.4)
      const finish = (e: KeyboardEvent) => { if (e.key === 'Tab') open.progress(1) }
      document.addEventListener('keydown', finish)

      /* titles: masked characters by position */
      main.querySelectorAll<HTMLElement>('[data-chars]').forEach((t) => {
        splits.push(new SplitText(t, { type: 'chars,words', charsClass: 'ch', wordsClass: 'wd', mask: 'chars', autoSplit: true,
          onSplit: (self) => gsap.fromTo(self.chars, { yPercent: 105 }, { yPercent: 0, ease: 'vv', duration: 0.8, stagger: 0.016, scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 82%', scrub: true } }) }))
      })
      main.querySelectorAll<HTMLElement>('[data-fade]').forEach((t) => {
        if (intro.contains(t)) return
        gsap.fromTo(t, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, ease: 'none', scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 84%', scrub: true } })
      })
      /* every frame opens upward from its bottom edge, tied to position (reversible) */
      main.querySelectorAll<HTMLElement>('[data-media]').forEach((f) => {
        const img = f.querySelector('img')
        const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 100%', end: 'top 64%', scrub: true } })
        tl.fromTo(f, { clipPath: 'inset(22% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'vv', duration: 1 }, 0)
        if (img) tl.fromTo(img, { scale: 1.1 }, { scale: 1, ease: 'vv', duration: 1 }, 0)
      })
      main.querySelectorAll<HTMLElement>('[data-par]').forEach((p) => {
        gsap.fromTo(p, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: p.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      main.querySelectorAll<HTMLElement>('[data-items]').forEach((g) => {
        gsap.fromTo(g.children, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'vv', duration: 0.8, stagger: 0.06, scrollTrigger: { trigger: g, start: 'top 100%', end: 'top 78%', scrub: true } })
      })
      const plates = main.querySelector<HTMLElement>('.plates')
      if (plates) gsap.fromTo(plates.querySelectorAll('.plate'), { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'vv', stagger: 0.07, scrollTrigger: { trigger: plates, start: 'top 96%', end: 'top 50%', scrub: true } })
      const visit = main.querySelector<HTMLElement>('[data-par-bg]')
      if (visit && desk) gsap.fromTo(visit, { yPercent: -8, scale: 1.1 }, { yPercent: 8, scale: 1.1, ease: 'none', scrollTrigger: { trigger: visit.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      const revealFocused = (e: FocusEvent) => {
        const t = e.target as HTMLElement
        ScrollTrigger.getAll().forEach((st) => { const tr = st.trigger as HTMLElement | null; if (tr && (tr === t || tr.contains(t) || t.contains(tr))) st.animation?.progress(1) })
      }
      main.addEventListener('focusin', revealFocused)

      /* hero: the photo sinks a little as the words lift (desktop) */
      const hp = main.querySelector<HTMLElement>('[data-hp]')
      if (hp && desk) gsap.fromTo(hp, { yPercent: 0 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: hp.parentElement, start: 'top 60%', end: 'bottom top', scrub: true } })
      return () => { document.removeEventListener('keydown', finish); main.removeEventListener('focusin', revealFocused) }
    }, el); ScrollTrigger.refresh() }
    if (!document.fonts) build()
    else Promise.all(['400 16px VvT', '600 16px VvT', 'italic 900 16px VvD'].map((f) => document.fonts.load(f))).then(() => document.fonts.ready).then(build, build)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { alive = false; window.removeEventListener('load', refresh); ctx?.revert(); splits.forEach((s) => s.revert()) }
  }, [loc.pathname])

  const s = openState(now)
  let body: ReactNode
  if (sub === '') body = <Home />
  else if (page === 'vagnar') body = seg[1] ? <DetailPage slug={seg[1]} /> : <CatalogPage />
  else if (page === 'leiga') { const r = seg[1] ? RENTALS.find((x) => x.key === seg[1]) : undefined; body = seg[1] ? (r ? <RentalPage r={r} /> : <NotFound />) : <RentalList /> }
  else if (page === 'skodun') body = <ViewingPage />
  else if (page === 'uppitaka') body = <TradeInPage />
  else if (page === 'verkstaedi') body = <WorkshopPage />
  else if (page === 'verslun') body = <ShopPage />
  else if (page === 'ferdalistinn') body = <TripPage />
  else if (page === 'afgreidsla') body = <InboxPage />
  else if (page === 'personuvernd') body = <PrivacyPage />
  else body = <NotFound />

  return (
    <div ref={root} className={`vv${menu ? ' menu-open' : ''}`} id="efst" lang="is">
      <style>{CSS}</style>
      <PreviewChrome company={company} />
      <a className="skip" href="#efni">Fara í efni</a>

      <div className="vv-chrome" ref={chromeRef} data-hide="0" data-solid="0">
        <div className="bar">
          <div className="in">
            <a href={`tel:${CONTACT.tel}`}><Phone size={13} aria-hidden="true" />{CONTACT.phone}</a>
            <a href={mailHref(CONTACT.email)} className="hide-s"><Mail size={13} aria-hidden="true" />{CONTACT.email}</a>
            <span className={`st${s.open ? ' on' : ''}`}><i aria-hidden="true" />Verslun: {s.text.toLowerCase()}</span>
            <span className="ad"><MapPin size={13} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />{CONTACT.street}, {CONTACT.town}</span>
          </div>
        </div>
        <header className="hdr"><Header sub={sub} onMenu={() => setMenu(true)} /></header>
      </div>

      {menu && (
        <div className="vv-menu-panel" ref={menuRef} role="dialog" aria-modal="true" aria-label="Valmynd" data-lenis-prevent="">
          <div className="mtop">
            <img src={A('logo-white.png')} alt="Víkurverk" width={306} height={200} />
            <button type="button" className="mx" onClick={() => setMenu(false)} aria-label="Loka valmynd"><X size={26} strokeWidth={1.8} aria-hidden="true" /></button>
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

      <main id="efni" key={loc.pathname}>{body}</main>

      <footer className="vv-foot on-dark">
        <div className="wrap">
          <div className="ftop">
            <div className="fbrand">
              <img src={A('logo-white.png')} alt="Víkurverk" width={306} height={200} />
              <p className="sl">{CONTACT.slogan}.</p>
              <p>{CONTACT.summary}</p>
            </div>
            <div className="fcols">
              <div>
                <h3>Víkurhvarf 6</h3>
                <p>{CONTACT.town}</p>
                <a className="num" href={`tel:${CONTACT.tel}`}>Sími {CONTACT.phone}</a>
                <a href={mailHref(CONTACT.email)}>{CONTACT.email}</a>
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
                {[['vagnar', 'Vagnar'], ['leiga', 'Leiga'], ['uppitaka', 'Taka upp í'], ['verkstaedi', 'Verkstæði'], ['verslun', 'Verslun']].map(([k, l]) => <Link key={k} to={to(k)} style={{ display: 'block' }}>{l}</Link>)}
              </div>
            </div>
          </div>
          <div className="flegal">
            <p>{CONTACT.legal} · Kt. {CONTACT.kt} · VSK nr. {CONTACT.vsk} · <a href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a> · <a href={CONTACT.youtube} target="_blank" rel="noopener">YouTube</a> · <Link to={to('personuvernd')}>Persónuvernd</Link> · <Link to={to('afgreidsla')}>Afgreiðsla</Link></p>
            <SndrBadge />
          </div>
          <p className="proto">Frumgerð: hugmynd að nýjum vef, ekki vefur Víkurverks. Upplýsingar, verð og myndir eru af vikurverk.is, notadir.vikurverk.is og bæklingum Víkurverks, sótt 9. október 2026; verð geta breyst. Formin senda ekkert; beiðnir eru geymdar í þínum vafra. Aðstoðarmaðurinn svarar aðeins út frá því sem stendur á þessum vef.</p>
        </div>
      </footer>

      <div className="vv-sticky" aria-label="Flýtileiðir">
        <a href={`tel:${CONTACT.tel}`}><Phone size={16} aria-hidden="true" />Hringja</a>
        <Link to={to('vagnar')}>Vagnar</Link>
        <button type="button" onClick={openChat}><MessageCircle size={16} aria-hidden="true" />Spyrja</button>
      </div>
    </div>
  )
}

export type { Kind }
