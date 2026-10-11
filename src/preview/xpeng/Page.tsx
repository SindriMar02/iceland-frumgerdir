import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { ArrowLeft, ArrowUpRight, Mail, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { SndrBadge } from '../SndrBadge'
import { setMetaDescription, setNoindex, setThemeColor } from '../../lib/preview'
import {
  A, CONTACT, DEPTS, IMG, JSON_LD, LIST, MODELS, NEWS, ROUTE, SAMPLE_REQUESTS, SERVICE, SERVICE_INTERVAL, SLOTS, STAFF, WARRANTY,
  kr, loadRequests, modelBySlug, newsUrl, openState, priceLine, saveRequest, trimLabel, type Model, type Photo, type Request, type Trim,
} from './data'
import { answer, CHIPS, GREETING } from './chat'
import { CSS, SLATE } from './styles'
import { RING } from './geo'
import { LIMIT, RESERVE, gapInfo, kwhNum, planRing, sites, type Car, type Plan } from './plan'

/*
 * Bílaumboðið Una (XPENG), "Hringinn á rafmagni". DESIGN.md beside this file.
 *
 * Base: the ÍSBAND/Vatt dealer system (Host Grotesk, Drivehub chrome, Spyker
 * numbers: ease cubic-bezier(.625,.05,0,1), masked characters .8s/.018, clip-scale
 * media, buttons opening from the middle, the statement band's inset clip, the
 * header coloured at the section edge, position-tied reveals; Suðurverk's staged
 * opening and pinned chapter). The new device is the Hringvegurinn chapter: the
 * line is the real OpenStreetMap ring road, the stops are the real fast chargers.
 *
 * Routes live under /preview/xpeng/*; this component reads the sub-path.
 */

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('xg', 'M0,0 C0.625,0.05 0,1 1,1')

const company = getPreviewCompany('xpeng')
let pageLenis: Lenis | null = null
const isTouch = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const to = (p = '') => (p ? `${ROUTE}/${p}` : ROUTE)
const km0 = (n: number) => Math.round(n).toLocaleString('de-DE')

function goTo(id: string) {
  const t = document.getElementById(id)
  if (!t) return
  if (pageLenis) pageLenis.scrollTo(t, { offset: -72 })
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

function Btn({ to: path, href, label, tone = 'deep', icon, onClick, ext, type, className = '' }: {
  to?: string; href?: string; label: string; tone?: 'deep' | 'dark' | 'light' | 'line' | 'ghost' | 'green'; icon?: ReactNode; onClick?: () => void; ext?: boolean; type?: 'submit' | 'button'; className?: string
}) {
  const inner = (
    <>
      <span className="sr">{label}</span>
      <span className="lbl" aria-hidden="true">
        {[...label].map((c, i) => <span key={i} className="c" style={{ '--i': i } as CSSProperties}>{c === ' ' ? ' ' : c}</span>)}
      </span>
      {icon}
    </>
  )
  const cls = `btn btn-${tone} ${className}`
  if (path !== undefined) return <Link className={cls} to={to(path)} data-btn="" onClick={onClick}>{inner}</Link>
  if (href) {
    const internal = href.startsWith('#')
    return (
      <a className={cls} href={href} data-btn="" {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
        onClick={(e) => { if (internal) { e.preventDefault(); onClick?.(); goTo(href.slice(1)) } else onClick?.() }}>{inner}</a>
    )
  }
  return <button className={cls} type={type ?? 'button'} onClick={onClick} data-btn="">{inner}</button>
}

function Eyebrow({ children, dot = true, open }: { children: ReactNode; dot?: boolean; open?: boolean }) {
  return <p className="eyebrow" {...(open ? { 'data-open': '' } : { 'data-fade': '' })}>{dot && <i aria-hidden="true" />}{children}</p>
}

/* heading lines for the staged opening: each line in its own mask */
function Lines({ lines }: { lines: string[] }) {
  return <>{lines.map((l, i) => <span key={i} className="lm"><span data-line="">{l}</span></span>)}</>
}

const NAV = [
  { k: 'gerdir', label: 'Bílar' },
  { k: 'hringvegurinn', label: 'Hringvegurinn' },
  { k: 'thjonusta', label: 'Þjónusta' },
  { k: 'frettir', label: 'Fréttir' },
  { k: 'hafa-samband', label: 'Hafa samband' },
]

function HeaderRow({ layer, focusKey, onFocusKey, onMenu, sub }: { layer: 'base' | 'top'; focusKey: string | null; onFocusKey: (k: string | null) => void; onMenu: () => void; sub: string }) {
  const hidden = layer === 'top'
  const tab = hidden ? -1 : undefined
  const f = (k: string) => (hidden ? {} : { onFocus: () => onFocusKey(k), onBlur: () => onFocusKey(null) })
  const kf = (k: string) => (hidden && focusKey === k ? ' kf' : '')
  return (
    <div className="row">
      <Link className={`logo${kf('logo')}`} to={to()} tabIndex={tab} {...f('logo')} aria-label="Bílaumboðið Una, forsíða">
        <img src={A('una-logo.png')} alt="" width={900} height={220} />
        <span className="xp" aria-hidden="true"><img src={A('xpeng-logo-white.svg')} alt="" width={148} height={20} /></span>
      </Link>
      <nav className="links" aria-label={hidden ? undefined : 'Aðalvalmynd'}>
        {NAV.map((n) => (
          <Link key={n.k} className={`nl${kf(n.k)}`} to={to(n.k)} tabIndex={tab} {...f(n.k)} aria-current={sub.split('/')[0] === n.k ? 'page' : undefined}>{n.label}</Link>
        ))}
      </nav>
      <div className="acts">
        <Link className={`pill${kf('cta')}`} to={to('reynsluakstur')} tabIndex={tab} {...f('cta')}>Bóka reynsluakstur</Link>
        <button className={`burger${kf('menu')}`} type="button" tabIndex={tab} {...f('menu')} onClick={onMenu} aria-label="Opna valmynd">
          <Menu size={22} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

type ChatEl = HTMLElement & { answerer?: typeof answer; open?: () => void }

/* ── the Hringvegurinn map ───────────────────────────────────────────── */

const SHOWN_PLACES = ['Reykjavík', 'Akureyri', 'Egilsstaðir', 'Höfn', 'Vík']

/* Two stacked layers. The still map (coast, road, every site) is painted once; only the thin overlay
   (drawn line, stops, car) changes while the page scrolls, so a frame repaints a few paths and not the island. */
function RingMap({ plan, drawn = false, labels = true, stopLabels = false, useUnk = false, hot = null, onHot }: { plan: Plan; drawn?: boolean; labels?: boolean; stopLabels?: boolean; useUnk?: boolean; hot?: number | null; onHot?: (id: number | null) => void }) {
  const stopIds = new Set(plan.stops.map((s) => s.id))
  const label = `Kort af Íslandi með Hringveginum, ${km0(RING.km)} km. ${plan.ok ? `${plan.stops.length} hraðhleðslustopp: ${plan.stops.map((s) => s.name || s.op).join(', ')}.` : 'Bíllinn nær ekki milli stöðva á kortinu.'}`
  return (
    <div className="rmap-box" data-ringsvg="">
      <svg className="rmap-svg rmap-base" viewBox={`0 0 ${RING.w} ${RING.h}`} aria-hidden="true" focusable="false">
        <path className="land" d={RING.land} />
        <path className="road0" d={RING.road} />
        {RING.chargers.map((c) => c.tier === 'dc' && !stopIds.has(c.id) && <circle key={c.id} className="fast" cx={c.x} cy={c.y} r={3.2} />)}
        {useUnk && RING.chargers.map((c) => c.tier === 'unk' && !stopIds.has(c.id) && <circle key={c.id} className="unk" cx={c.x} cy={c.y} r={4.2} />)}
        {labels && RING.places.filter((p) => SHOWN_PLACES.includes(p.name)).map((p) => (
          <text key={p.name} className="place" x={p.x + (p.name === 'Akureyri' || p.name === 'Egilsstaðir' ? 14 : p.name === 'Reykjavík' ? -14 : 14)} y={p.y + (p.name === 'Reykjavík' ? 18 : p.name === 'Vík' ? 20 : 4)} textAnchor={p.name === 'Reykjavík' ? 'end' : 'start'}>{p.name}</text>
        ))}
      </svg>
      <svg className="rmap-svg rmap-live" viewBox={`0 0 ${RING.w} ${RING.h}`} role="img" aria-label={label}>
        <defs>
          <linearGradient id="xgGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={RING.w} y2="0"><stop offset="0" stopColor="#18ED7F" /><stop offset="1" stopColor="#186DEF" /></linearGradient>
          <radialGradient id="xgGlow"><stop offset="0" stopColor="#18ED7F" stopOpacity=".55" /><stop offset="1" stopColor="#18ED7F" stopOpacity="0" /></radialGradient>
        </defs>
        <path className="road1" d={RING.road} pathLength={1} data-draw="" style={drawn ? { strokeDashoffset: 0 } : undefined} />
        {plan.stops.map((s, i) => (
          <g key={s.id} className={`stop${hot === s.id ? ' hot' : ''}`} data-stop="" data-km={s.km} data-on={drawn ? '1' : '0'} transform={`translate(${s.x} ${s.y})`}
            onPointerEnter={onHot ? () => onHot(s.id) : undefined} onPointerLeave={onHot ? () => onHot(null) : undefined}>
            <circle className="halo" r={13} /><circle className="dot" r={7} />
            <text className="sn" y={4} textAnchor="middle">{i + 1}</text>
            {stopLabels && (() => { const named = RING.places.some((pl) => SHOWN_PLACES.includes(pl.name) && Math.abs(pl.km - s.km) < 20); return <text className="sl" x={s.x > 760 ? -16 : 16} y={named ? 34 : -14} textAnchor={s.x > 760 ? 'end' : 'start'}>{named ? '' : `${placeAt(s.km)} `}{s.minutes} mín.</text> })()}
          </g>
        ))}
        <g className="car" data-car="" style={{ transform: 'translate(0px,0px)' }}><circle className="glow" r={22} fill="url(#xgGlow)" /><circle className="core" r={7} /></g>
      </svg>
    </div>
  )
}

/* battery level along the route: the line that answers "kemstu hringinn?" */
const SOC_W = 1000, SOC_H = 210
const socX = (km: number) => (km / RING.km) * SOC_W
const socY = (s: number) => SOC_H - 14 - (s / 100) * (SOC_H - 30)
function SocChart({ plan, drawn = false }: { plan: Plan; drawn?: boolean }) {
  const pts = plan.ok ? plan.profile : [{ km: 0, soc: 100 }, { km: plan.reach, soc: RESERVE }]
  const d = 'M' + pts.map((p) => `${socX(p.km).toFixed(1)} ${socY(p.soc).toFixed(1)}`).join('L')
  return (
    <svg className="soc" viewBox={`0 0 ${SOC_W} ${SOC_H}`} role="img" aria-label={plan.ok ? `Hleðsla rafhlöðunnar eftir leiðinni: ${plan.stops.length} stopp, aldrei undir ${RESERVE} prósentum, kemur heim með ${plan.endSoc} prósent.` : `Rafhlaðan nær ${km0(plan.reach)} km áður en hún fer undir ${RESERVE} prósent.`}>
      <line className="gl" x1="0" x2={SOC_W} y1={socY(LIMIT)} y2={socY(LIMIT)} />
      <line className="gl res" x1="0" x2={SOC_W} y1={socY(RESERVE)} y2={socY(RESERVE)} />
      <text className="gt" x="4" y={socY(LIMIT) - 6}>{LIMIT} %</text>
      <text className="gt" x="4" y={socY(RESERVE) + 15}>{RESERVE} %</text>
      <path className={`soc1${plan.ok ? '' : ' bad'}`} d={d} pathLength={1} data-soc-draw="" style={drawn ? { strokeDashoffset: 0 } : undefined} />
      {plan.ok && plan.stops.map((s) => <circle key={s.id} className="sd" cx={socX(s.km)} cy={socY(s.to)} r={5} data-soc-stop="" data-km={s.km} data-on={drawn ? '1' : '0'} />)}
      {!plan.ok && <g className="stuck"><circle cx={socX(plan.reach)} cy={socY(RESERVE)} r={6} /><text x={socX(plan.reach) - 8} y={socY(RESERVE) - 12} textAnchor="end">Hér þrýtur</text></g>}
      <g className="sdot" data-soc-dot="" style={{ transform: `translate(0px, ${socY(100)}px)` }}><circle r={6.5} /></g>
    </svg>
  )
}
const socAt = (plan: Plan, km: number) => {
  const p = plan.ok ? plan.profile : [{ km: 0, soc: 100 }, { km: plan.reach, soc: RESERVE }]
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i], b = p[i + 1]
    if (km >= a.km && km <= b.km) { if (b.km === a.km) return b.soc; const t = (km - a.km) / (b.km - a.km); return a.soc + (b.soc - a.soc) * t }
  }
  return p[p.length - 1].soc
}

/* the model and trim the chapter and the planner share */
const bestTrim = (m: Model) => m.trims.reduce((a, t) => (t.range > a.range ? t : a))
const defaultPick = () => { const m = modelBySlug('g6')!; return { slug: m.slug, trim: bestTrim(m).name } }
const carOf = (m: Model, t: Trim): Car => ({ range: t.range, dcMin: m.dcMin, kwh: kwhNum(t.kwh) })
const planFor = (m: Model, t: Trim, frost = 0, useUnk = false) => planRing(carOf(m, t), { frost, useUnk })
const placeAt = (km: number) => { let best = RING.places[0]; for (const p of RING.places) if (Math.abs(p.km - km) < Math.abs(best.km - km)) best = p; return best.name }
/* places in the dative, for "frá X að Y" and "nálægt X" */
const DAT: Record<string, string> = { Borgarnes: 'Borgarnesi', Blönduós: 'Blönduósi', Egilsstaðir: 'Egilsstöðum', Mývatn: 'Mývatni', Kirkjubæjarklaustur: 'Kirkjubæjarklaustri', Selfoss: 'Selfossi' }
const dat = (n: string) => DAT[n] ?? n
const fmtDate = (iso: string) => { const [y, m] = iso.split('-'); const M = ['jan.', 'feb.', 'mars', 'apr.', 'maí', 'júní', 'júlí', 'ág.', 'sept.', 'okt.', 'nóv.', 'des.']; return `${M[Number(m) - 1]} ${y}` }
const dcSites = RING.chargers.filter((c) => c.tier === 'dc')
const staleSites = dcSites.filter((c) => c.ts < '2025-01-01').length
const openSites = dcSites.filter((c) => c.acc === 'yes' || c.acc === 'permissive').length
const oldestSite = [...RING.chargers].filter((c) => c.tier === 'dc').sort((a, b) => a.ts.localeCompare(b.ts))[0]
const newestSite = [...RING.chargers].filter((c) => c.tier === 'dc').sort((a, b) => b.ts.localeCompare(a.ts))[0]

/* ── home sections ──────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="xg-hero" aria-labelledby="h-hero">
      <div className="hfield" aria-hidden="true" />
      <div className="wrap hgrid">
        <div className="hcopy" data-hcopy="">
          <Eyebrow open dot={false}>Umboð XPENG á Íslandi</Eyebrow>
          <h1 id="h-hero"><Lines lines={['Hringinn', 'á rafmagni.']} /></h1>
          <p className="lede" data-open="">Fjórir XPENG rafbílar hjá Unu í Reykjavík. Verðin standa á síðunni, reynsluaksturinn er bókaður hér og hleðsluáætlun fyrir Hringveginn líka.</p>
          <div className="ctas" data-open="">
            <Btn to="gerdir" label="Skoða bílana" tone="deep" />
            <Btn to="reynsluakstur" label="Bóka reynsluakstur" tone="line" />
          </div>
        </div>
        <figure className="hphoto" data-hphoto="">
          <div className="hmask" data-hmask=""><Pic p={IMG.hero} sizes="(min-width: 900px) 46vw, 100vw" eager /></div>
          <figcaption data-open="">XPENG á íslenskum vegi. Mynd frá Unu.</figcaption>
        </figure>
      </div>
    </section>
  )
}

function ModelPlates() {
  const nav = useNavigate()
  const [open, setOpen] = useState(1)
  const fine = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches, [])
  const act = (i: number) => { if (open !== i) { setOpen(i); return } nav(to(`gerdir/${MODELS[i].slug}`)) }
  return (
    <section className="xg-brands" id="bilar" aria-labelledby="h-brands">
      <div className="wrap">
        <div className="head">
          <div>
            <Eyebrow>Fjórar gerðir í sýningarsalnum</Eyebrow>
            <h2 id="h-brands" data-chars="">Veldu bíl</h2>
          </div>
        </div>
        <div className="plates" role="list">
          {MODELS.map((m, i) => (
            <button key={m.slug} type="button" role="listitem" className="plate6" data-open={open === i ? '1' : '0'}
              onPointerEnter={() => { if (fine) setOpen(i) }} onFocus={() => setOpen(i)} onClick={() => act(i)}
              aria-label={`${m.name}: ${m.tagline}. ${priceLine(m)}`} aria-expanded={open === i}>
              <span className="ph" aria-hidden="true"><Pic p={m.img} sizes="(min-width: 900px) 40vw, 100vw" pos={m.slug === 'g6' ? '40% 50%' : '50% 55%'} /></span>
              <span className="word" aria-hidden="true">XPENG</span>
              <span className="pn" aria-hidden="true">{m.name.replace('XPENG ', '')}</span>
              <span className="pl" aria-hidden="true">{priceLine(m)}</span>
              <span className="go" aria-hidden="true"><ArrowUpRight size={17} strokeWidth={1.6} /></span>
            </button>
          ))}
        </div>
        <p className="pnote" data-fade="">Verð af verðlista XPENG hjá Unu, {LIST.month}. „Með styrk“ er verð verðlistans með orkustyrk, með fyrirvara um breytingar á upphæð styrksins.</p>
      </div>
    </section>
  )
}

function PickChips({ pick, onPick }: { pick: { slug: Model['slug']; trim: string }; onPick: (p: { slug: Model['slug']; trim: string }) => void }) {
  const m = modelBySlug(pick.slug)!
  return (
    <div className="rpick" role="group" aria-label="Veldu bíl">
      <div className="fgroup">{MODELS.map((x) => <button key={x.slug} type="button" className="chip" aria-pressed={pick.slug === x.slug} onClick={() => onPick({ slug: x.slug, trim: bestTrim(x).name })}>{x.name.replace('XPENG ', '')}</button>)}</div>
      {m.trims.length > 1 && <div className="fgroup">{m.trims.map((t) => <button key={t.name} type="button" className="chip" aria-pressed={pick.trim === t.name} onClick={() => onPick({ slug: m.slug, trim: t.name })}>{t.name}</button>)}</div>}
    </div>
  )
}

function RingChapter() {
  const [pick, setPick] = useState(defaultPick)
  const m = modelBySlug(pick.slug)!
  const t = m.trims.find((x) => x.name === pick.trim) ?? bestTrim(m)
  const plan = useMemo(() => planFor(m, t), [m, t])
  const withUnk = useMemo(() => (plan.ok ? plan : planFor(m, t, 0, true)), [plan, m, t])
  const planRef = useRef(plan); planRef.current = plan
  /* a new car means new stops: let the chapter re-read its own scroll position (its onRefresh redraws the counters) */
  useEffect(() => { const id = window.setTimeout(() => ScrollTrigger.refresh(), 60); return () => window.clearTimeout(id) }, [plan])
  const gap = gapInfo(false)
  return (
    <section className="xg-ring on-dark" id="hringvegurinn" data-tone="dark" aria-labelledby="h-ring">
      <div className="stage" data-stage="">
        <div className="wrap rgrid">
          <div className="rcopy">
            <Eyebrow>Hringvegurinn</Eyebrow>
            <h2 id="h-ring" data-chars="">Kemstu hringinn?</h2>
            <p data-lines="">Hringvegurinn er um {km0(RING.km)} km á korti OpenStreetMap. Veldu bíl og skrunaðu: línan sýnir hvar hann hleður, á hraðhleðslustöðvum sem eru skráðar á kortið, og grafið hvað er eftir á rafhlöðunni.</p>
            <PickChips pick={pick} onPick={setPick} />
            <dl className="rsum">
              <div><dt>Ekið</dt><dd className="num"><span data-km="">0</span> km</dd></div>
              <div><dt>Hraðhleðslustopp</dt><dd className="num"><span data-stops="">0</span> af {plan.ok ? plan.stops.length : '-'}</dd></div>
              <div><dt>Í hleðslu, í besta falli</dt><dd className="num"><span data-min="">0</span> mín.</dd></div>
            </dl>
            <div className="socbox"><SocChart plan={plan} /><p className="socnote" aria-hidden="true">Hleðsla rafhlöðunnar <span className="num" data-soc="">100</span> %</p></div>
            {!plan.ok && (
              <p className="rwarn" role="status">Með þessari útfærslu nær bíllinn ekki næstu hraðhleðslustöð á kortinu: lengsta bilið er {km0(gap.g)} km, frá {dat(placeAt(gap.a))} að {dat(placeAt(gap.b))}. {withUnk.ok ? 'ON er með stöð við Mývatn sem vantar upplýsingar um; með henni kæmist hann, en það er óstaðfest.' : 'Veldu útfærslu með lengri drægni.'}</p>
            )}
            <p className="rnote">Útreikningur úr uppgefinni WLTP-drægni ({t.range} km) og hraðhleðslustöðvum í OpenStreetMap, ekki mæling. Hleðslutíminn er í besta falli.</p>
            <div className="ctas"><Btn to={`hringvegurinn?bill=${m.slug}&utf=${encodeURIComponent(t.name)}`} label="Skipuleggja ferð" tone="green" /></div>
          </div>
          <figure className="rmap" data-rmap="" ref={(el) => { if (el) (el as HTMLElement & { _plan?: () => Plan })._plan = () => planRef.current }}>
            <RingMap plan={plan} stopLabels />
            <figcaption>Hringvegurinn og hraðhleðslustöðvar eftir OpenStreetMap. Númeruðu hringirnir eru stoppin fyrir valinn bíl, með þeim tíma sem hleðslan tekur í besta falli.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function PriceBand({ full }: { full: boolean }) {
  return (
    <section className="xg-cat" id="verdlisti" aria-labelledby="h-cat">
      <div className="wrap">
        <div className="head">
          <div>
            <h2 id="h-cat" data-chars="">{full ? 'Verðlisti, október 2026' : 'Verðin standa á síðunni'}</h2>
          </div>
          {!full && <Link className="tlink" to={to('gerdir')}>Allar gerðir og verðlisti <ArrowUpRight size={15} aria-hidden="true" /></Link>}
        </div>
        <div className="pgroups">
          {MODELS.map((m) => (
            <article key={m.slug} className="pg" data-items="">
              <div className="pgl">
                <h3 translate="no">{m.name}</h3>
                <p>{m.tagline}</p>
                <Link className="tlink" to={to(`gerdir/${m.slug}`)}>Skoða {m.name.replace('XPENG ', '')} <ArrowUpRight size={15} aria-hidden="true" /></Link>
              </div>
              <table className="ptab">
                <caption className="sr">Útfærslur og verð, {m.name}</caption>
                <thead><tr><th scope="col">Útfærsla</th><th scope="col">Verð</th><th scope="col">Með styrk</th><th scope="col">Drægni</th><th scope="col">0-100</th></tr></thead>
                <tbody>
                  {m.trims.map((t) => (
                    <tr key={t.name}>
                      <th scope="row"><span>{t.name}</span><small>{t.drive}</small></th>
                      <td className="num" data-l="Verð">{kr(t.price)}</td>
                      <td className="num" data-l="Með styrk">{t.priceGrant ? kr(t.priceGrant) : 'Ekki á verðlista'}</td>
                      <td className="num" data-l="Drægni">{t.range} km</td>
                      <td className="num" data-l="0-100">{t.zero100}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))}
        </div>
        <p className="fine">Verðlisti XPENG hjá Unu, {LIST.month}. Verð eru miðuð við útgáfudag verðlistans og geta breyst án fyrirvara vegna gengis ISK/EUR, birgja, vörugjalda og virðisaukaskatts. Drægni er WLTP samkvæmt framleiðanda. Orkustyrkur Orkusjóðs: upphæðin getur breyst. Ábyrgð {WARRANTY}; forsendur ábyrgðar eru reglulegt þjónustueftirlit sem kaupandi ber kostnað af. Myndir eru framleiðendamyndir og geta sýnt aukabúnað.</p>
        {full && <p className="fine"><a className="tlink" href={LIST.url} target="_blank" rel="noopener">Verðlistinn sjálfur hjá Unu <ArrowUpRight size={14} aria-hidden="true" /></a></p>}
      </div>
    </section>
  )
}

function ChargeBand() {
  const p = NEWS[0]
  return (
    <section className="xg-charge on-dark" data-tone="dark" aria-labelledby="h-charge">
      <div className="cbg"><div className="par" data-par=""><Pic p={IMG.orkan} sizes="100vw" /></div></div>
      <div className="cshade" aria-hidden="true" />
      <div className="wrap cgrid2">
        <div className="cnum">
          <p className="big num" aria-hidden="true">12:23</p>
          <p className="small">10-80 % á XPENG G9</p>
        </div>
        <div className="ctext">
          <h2 id="h-charge" data-chars="">Tólf mínútur og 23 sekúndur</h2>
          <p data-lines="">XPENG G9 hlóð úr 10% í 80% á 12 mínútum og 23 sekúndum í hraðhleðslustöð Orkunnar á Lambhagavegi, með 408 kW hámarksafli. Una skrifar að ekki sé vitað um hraðari hleðslu á Íslandi og því sé gert ráð fyrir að um Íslandsmet sé að ræða.</p>
          <div className="ctas"><Btn href={newsUrl(p)} label="Fréttin hjá Unu" tone="ghost" ext icon={<ArrowUpRight size={16} aria-hidden="true" />} /></div>
        </div>
      </div>
    </section>
  )
}

const WAYS = [
  { to: 'reynsluakstur', t: 'Reynsluakstur', d: 'Veldu bíl, dag og tíma. Una staðfestir símleiðis og bíllinn bíður í sýningarsalnum.' },
  { to: 'thjonusta', t: 'Þjónusta og ábyrgð', d: `Una er þjónustuaðili XPENG. Þjónustuskoðun á 20.000 km fresti eða 12 mánaða fresti, ábyrgð ${WARRANTY}.` },
  { to: 'innskipti', t: 'Bíllinn upp í', d: 'Sendu tegund, árgerð og akstur á núverandi bíl og söludeildin svarar með tilboði.' },
]

function WaysBand() {
  return (
    <section className="xg-ways" aria-labelledby="h-ways">
      <div className="wrap">
        <h2 id="h-ways" data-chars="">Frá fyrsta akstri til þjónustu</h2>
        <figure className="wphoto"><Frame p={IMG.showroom} sizes="100vw" ratio="21 / 9" pos="50% 40%" /><figcaption>Sýningarsalur XPENG að Vínlandsleið 6-8.</figcaption></figure>
        <ul className="wrows" data-items="" role="list">
          {WAYS.map((w) => (
            <li key={w.to}>
              <Link to={to(w.to)} className="wrow"><h3>{w.t}</h3><p>{w.d}</p><span className="wgo" aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1.5} /></span></Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function NewsBand({ full }: { full: boolean }) {
  const list = full ? NEWS : NEWS.slice(0, 3)
  return (
    <section className="xg-news" aria-labelledby="h-news">
      <div className="wrap">
        <div className="head">
          <h2 id="h-news" data-chars="">{full ? 'Fréttir frá Unu' : 'Nýjast hjá Unu'}</h2>
          {!full && <Link className="tlink" to={to('frettir')}>Allar fréttir <ArrowUpRight size={15} aria-hidden="true" /></Link>}
        </div>
        <ul className="ngrid" data-items="" role="list">
          {list.map((p) => (
            <li key={p.slug}>
              <a className="npost" href={newsUrl(p)} target="_blank" rel="noopener">
                {p.img ? <div className="ph"><Pic p={p.img} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 46vw, 100vw" /></div> : <div className="ph big"><span className="num" aria-hidden="true">{p.big ?? 'XPENG'}</span></div>}
                <p className="meta"><time dateTime={p.iso}>{p.date}</time></p>
                <h3>{p.title}</h3>
                <p className="ex">{p.lines[0]}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Statement() {
  return (
    <section className="xg-statement" aria-labelledby="h-state">
      <div className="scopy">
        <h2 id="h-state" data-chars=""><span>Heitt á könnunni.</span></h2>
        <p data-lines="">Það er alltaf heitt á könnunni í sýningarsalnum að Vínlandsleið 6-8. Opið virka daga kl. 9-17 og laugardaga kl. 12-16.</p>
        <div className="ctas">
          <Btn to="reynsluakstur" label="Bóka reynsluakstur" tone="dark" />
          <Btn to="hafa-samband" label="Hafa samband" tone="light" />
        </div>
      </div>
    </section>
  )
}

function DriveBand() {
  return (
    <section className="xg-drive on-dark" id="reynsluakstur" data-tone="dark" aria-labelledby="h-drive">
      <div className="dbg"><div className="par" data-par=""><Pic p={IMG.land} sizes="100vw" /></div></div>
      <div className="dshade" aria-hidden="true" />
      <div className="wrap dgrid">
        <div className="dcopy">
          <h2 id="h-drive" data-chars="">Prófaðu bílinn áður en þú velur</h2>
          <p data-lines="">Veldu bíl, dag og tíma. Una staðfestir símleiðis og bíllinn bíður í sýningarsalnum að Vínlandsleið 6-8.</p>
        </div>
        <div className="dcard" data-fade="">
          <p>Reynsluakstur á opnunartíma: virka daga kl. 9-17 og laugardaga kl. 12-16.</p>
          <div className="two">
            <Btn to="reynsluakstur" label="Bóka reynsluakstur" tone="green" />
            <Btn to="thjonusta" label="Biðja um þjónustu" tone="ghost" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <ModelPlates />
      <RingChapter />
      <PriceBand full={false} />
      <ChargeBand />
      <WaysBand />
      <NewsBand full={false} />
      <Statement />
      <DriveBand />
    </>
  )
}

/* ── route pages ────────────────────────────────────────────────────────── */

function Intro({ eyebrow, title, lede, crumb }: { eyebrow?: string; title: string[]; lede?: string; crumb?: { to: string; label: string } }) {
  return (
    <div className="intro">
      {crumb && <Link className="crumb" to={to(crumb.to)}><ArrowLeft size={14} aria-hidden="true" />{crumb.label}</Link>}
      {eyebrow && <Eyebrow open>{eyebrow}</Eyebrow>}
      <h1><Lines lines={title} /></h1>
      {lede && <p className="lede" data-open="">{lede}</p>}
    </div>
  )
}

function ModelsPage() {
  return (
    <div className="xg-page" style={{ paddingBottom: 0 }}>
      <div className="wrap"><Intro eyebrow="XPENG hjá Unu" title={['Fjórar gerðir,', 'ellefu útfærslur.']} lede="Verðlistinn fyrir október 2026 er hér sem tafla, ekki flettibók. Veldu gerð til að sjá liti, innréttingar og tæknitölur." /></div>
      <ul className="wrap mgrid grid" data-items="" role="list" style={{ marginBottom: 'var(--sec)' }}>
        {MODELS.map((m) => (
          <li key={m.slug}>
            <Link className="car" to={to(`gerdir/${m.slug}`)}>
              <div className="ph"><Pic p={m.img} sizes="(min-width: 1100px) 46vw, 100vw" /></div>
              <p className="meta"><span translate="no">XPENG</span><span>{m.trims.length === 1 ? '1 útfærsla' : `${m.trims.length} útfærslur`}</span><span>Hleðsla 10-80 % á {m.dcMin} mín.</span></p>
              <h3 translate="no">{m.name}</h3>
              <p className="pr num">{priceLine(m)}</p>
              <p className="rg">{m.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
      <PriceBand full />
      <DriveBand />
    </div>
  )
}

function DetailPage({ slug }: { slug: string }) {
  const x = modelBySlug(slug)
  const [ti, setTi] = useState(() => (x ? x.trims.indexOf(bestTrim(x)) : 0))
  if (!x) return <NotFound />
  const t = x.trims[ti] ?? x.trims[0]
  const plan = planFor(x, t)
  const specs: [string, string][] = [
    ['Drægni (WLTP)', `${t.range} km`], ['Afl', `${t.kw} kW / ${t.hp} hö`], ['Tog', `${t.nm} Nm`], ['0-100 km/klst', t.zero100], ['Rafhlaða', `${t.kwh} kWh`], ['Eyðsla frá', `${t.kwh100} kWh/100 km`],
    ['Hraðhleðsla 10-80 %', `${x.dcMin} mín.`], ['Hleðslugeta AC/DC', `${t.acKw} / ${t.dcKw} kW`], ['Hleðsla AC 5-100 %', t.acHours], ['Drifrás', t.drive], ['Dráttargeta', `${x.tow} kg`], ['Eigin þyngd', `${t.weight.toLocaleString('de-DE')} kg`],
  ]
  const others = MODELS.filter((m) => m.slug !== x.slug)
  return (
    <div className="xg-page xg-detail">
      <div className="wrap">
        <div className="dhead">
          <div>
            <Link className="crumb" to={to('gerdir')}><ArrowLeft size={14} aria-hidden="true" />Allar gerðir</Link>
            <Eyebrow open dot={false}>{x.tagline}</Eyebrow>
            <h1 translate="no"><Lines lines={[x.name]} /></h1>
            <p className="price num" data-open="">
              {kr(t.priceGrant ?? t.price)}
              <small>{t.priceGrant ? `Með orkustyrk. Listaverð ${kr(t.price)}. ${trimLabel(x, t)}.` : `Listaverð. ${trimLabel(x, t)}. Verðlistinn sýnir ekkert verð með styrk á þessari gerð.`}</small>
            </p>
            {x.trims.length > 1 && <div className="fgroup" role="group" aria-label="Útfærsla" data-open="" style={{ marginTop: 18 }}>{x.trims.map((y, i) => <button key={y.name} type="button" className="chip" aria-pressed={ti === i} onClick={() => setTi(i)}>{y.name}</button>)}</div>}
            <div className="dact" data-open="">
              <Btn to={`reynsluakstur?bill=${x.slug}`} label="Bóka reynsluakstur" tone="deep" />
              <Btn href={x.slug === 'l03' ? CONTACT.brand : `${CONTACT.config}/${x.slug === 'g6' ? 'New_G6' : x.slug === 'g9' ? 'New_G9' : 'X9'}`} label={x.slug === 'l03' ? 'XPENG á Íslandi' : 'Hanna hjá XPENG'} tone="line" ext icon={<ArrowUpRight size={16} aria-hidden="true" />} />
            </div>
          </div>
          <figure className="hphoto" data-hphoto=""><div className="hmask dmain frame" data-hmask="" style={{ aspectRatio: '16 / 9' }}><Pic p={x.img} sizes="(min-width: 900px) 62vw, 100vw" eager className="still" /></div></figure>
        </div>
        <dl className="specs" data-items="">
          {specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <div className="dbody">
          <div>
            <h2 data-chars="">Það sem skiptir máli</h2>
            <ul className="facts" style={{ marginTop: 24 }}>
              <li>{x.line}</li>
              <li>Farangursrými {x.boot}{x.frunk ? `, geymsla að framan ${x.frunk}` : ''}. Veghæð {x.clearance}.</li>
              <li>Lengd, breidd og hæð {x.dims}{x.tyres ? `, dekk ${x.tyres}` : ''}.{x.note ? ` ${x.note}` : ''}</li>
              <li>Ábyrgð {WARRANTY}, þjónustuskoðun {SERVICE_INTERVAL}.</li>
              <li>Hringvegurinn: {plan.ok ? `${plan.stops.length} hraðhleðslustopp, í besta falli ${plan.minutes} mín. í hleðslu` : 'kemst ekki hringinn milli stöðva á kortinu'} ({trimLabel(x, t)}). <Link className="tlink" to={to(`hringvegurinn?bill=${x.slug}&utf=${encodeURIComponent(t.name)}`)}>Skoða leiðina</Link></li>
            </ul>
            <p className="src">Tölur og verð: <a href={LIST.url} target="_blank" rel="noopener">verðlisti XPENG hjá Unu</a>, {LIST.month}.</p>
          </div>
          {x.gallery.length ? (
            <div className="gal">
              {x.gallery.slice(0, 3).map((g, i) => <Frame key={g.src} p={g} sizes="(min-width: 900px) 56vw, 100vw" ratio={i === 0 ? '16 / 9' : '4 / 3'} />)}
            </div>
          ) : (
            <figure className="pmap on-dark" data-tone="dark" style={{ position: 'static' }}>
              <RingMap plan={plan} drawn />
              <figcaption>Hringvegurinn á {trimLabel(x, t)}: {plan.ok ? `${plan.stops.length} hraðhleðslustopp.` : 'kemst ekki hringinn milli stöðva á kortinu.'} Kortið er frá OpenStreetMap.</figcaption>
            </figure>
          )}
        </div>
        <div className="dcol">
          <div>
            <h2 data-chars="">Litir</h2>
            <ul className="clist" data-items="" role="list">{x.colours.map((c) => <li key={c.name}><b>{c.name}</b><span className="num">{c.extra ? `+${kr(c.extra)}` : 'staðalbúnaður'}</span>{c.note && <small>{c.note}</small>}</li>)}</ul>
          </div>
          <div>
            <h2 data-chars="">Innréttingar</h2>
            <ul className="clist" data-items="" role="list">{x.interiors.map((c) => <li key={c}><b>{c}</b></li>)}</ul>
          </div>
        </div>
        <div className="more">
          <h2 data-chars="">Aðrar gerðir</h2>
          <ul className="grid" style={{ marginTop: 32 }} data-items="" role="list">{others.map((m) => (
            <li key={m.slug}><Link className="car" to={to(`gerdir/${m.slug}`)}><div className="ph"><Pic p={m.img} sizes="(min-width: 1100px) 30vw, 46vw" /></div><p className="meta"><span translate="no">XPENG</span></p><h3 translate="no">{m.name}</h3><p className="pr num">{priceLine(m)}</p></Link></li>
          ))}</ul>
        </div>
      </div>
    </div>
  )
}

/* ── the planner ────────────────────────────────────────────────────── */

function RingPage() {
  const loc = useLocation()
  const sp = new URLSearchParams(loc.search)
  const [pick, setPick] = useState(() => {
    const m = modelBySlug(sp.get('bill') ?? '') ?? modelBySlug('g6')!
    const t = m.trims.find((y) => y.name === sp.get('utf')) ?? bestTrim(m)
    return { slug: m.slug, trim: t.name }
  })
  const [frost, setFrost] = useState(0)
  const [useUnk, setUseUnk] = useState(false)
  const [hot, setHot] = useState<number | null>(null)
  const m = modelBySlug(pick.slug)!
  const t = m.trims.find((x) => x.name === pick.trim) ?? bestTrim(m)
  const plan = useMemo(() => planFor(m, t, frost / 100, useUnk), [m, t, frost, useUnk])
  const gap = gapInfo(useUnk)
  const unk = RING.chargers.filter((c) => c.tier === 'unk')
  const eff = Math.round(t.range * (1 - frost / 100))
  return (
    <div className="xg-page xg-planner">
      <div className="wrap">
        <Intro eyebrow="Hringvegurinn" title={['Kemstu hringinn?', 'Reiknaðu það.']} lede={`Veldu bíl og útfærslu. Kortið sýnir um ${km0(RING.km)} km Hringveginn og hraðhleðslustöðvarnar sem bíllinn þarf að nota, og grafið hvað er eftir á rafhlöðunni á leiðinni.`} />
        <div className="pgrid">
          <div className="pctl">
            <PickChips pick={pick} onPick={(p) => setPick(p)} />
            <label className="frost">
              <span>Draga frá drægni vegna vetrar eða vinds: <b className="num">{frost} %</b></span>
              <input type="range" min={0} max={40} step={5} value={frost} onChange={(e) => setFrost(Number(e.target.value))} aria-valuetext={`${frost} prósent`} />
              <small>0 % er uppgefin WLTP-drægni ({t.range} km). Þetta er þín eigin stilling, ekki mæling.</small>
            </label>
            <label className="chk">
              <input type="checkbox" checked={useUnk} onChange={(e) => setUseUnk(e.target.checked)} />
              <span>Telja með {unk.length} stöðvar rekstraraðila sem vantar upplýsingar um tengi og afl (gert ráð fyrir 50 kW)</span>
            </label>
            {plan.ok ? (
              <div className="presult" role="status" aria-live="polite">
                <p className="big num">{plan.stops.length} <span>hraðhleðslustopp</span></p>
                <p className="mins num">Í hleðslu í besta falli {plan.minutes} mín. samtals</p>
                <p className="sub">{trimLabel(m, t)}, {km0(RING.km)} km. Lengsti leggur {km0(Math.max(...plan.legs))} km. Kemur heim með {plan.endSoc} %.</p>
              </div>
            ) : (
              <div className="presult bad" role="status" aria-live="polite">
                <p className="big">Kemst ekki hringinn</p>
                <p className="sub">Með {eff} km drægni og hleðslu í 80 % nær bíllinn {Math.round(eff * 0.7)} km milli stöðva. Lengsta bilið á kortinu er {km0(gap.g)} km, frá {dat(placeAt(gap.a))} að {dat(placeAt(gap.b))}. Bíllinn nær {km0(plan.reach)} km áður en hann fer undir 10 %. Veldu útfærslu með lengri drægni, minnkaðu frádráttinn{unk.length && !useUnk ? ' eða teldu með stöðvarnar sem vantar upplýsingar um' : ''}.</p>
              </div>
            )}
            <ol className="legs" data-items="">
              <li><span className="n">Start</span><span className="w">Reykjavík, fullur geymir<small>100 %</small></span><span className="d num">0 km</span></li>
              {plan.stops.map((s, i) => (
                <li key={s.id} className={hot === s.id ? 'hot' : ''} tabIndex={0} onPointerEnter={() => setHot(s.id)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(s.id)} onBlur={() => setHot(null)}>
                  <span className="n num">{i + 1}</span>
                  <span className="w"><b>{s.name || s.op}</b><small>{s.op && s.name && !/^(orkan|n1|on\b|orka|atlantsol|tesla)/i.test(s.name) ? `${s.op}, ` : ''}{placeAt(s.km)}{s.off >= 0.5 ? `, ${s.off.toFixed(1).replace('.', ',')} km frá veginum` : ''}</small><small>Kort: {fmtDate(s.ts)}{s.tier === 'unk' ? ', engin gögn um afl' : ''}{!s.acc ? ', aðgangur ekki skráður' : ''}</small></span>
                  <span className="d num">{km0(s.km)} km<small>kemur með {s.arrive} %, hleður í {s.to} %</small><small>{s.minutes} mín. á {s.kwUsed} kW{s.tier === 'unk' ? ' (áætlað)' : ''}</small></span>
                </li>
              ))}
              {plan.ok && <li><span className="n">Mark</span><span className="w">Reykjavík<small>{plan.endSoc} % eftir</small></span><span className="d num">{km0(RING.km)} km</span></li>}
            </ol>
          </div>
          <div className="pright">
            <figure className="pmap on-dark" data-tone="dark">
              <RingMap plan={plan} drawn useUnk={useUnk} hot={hot} onHot={setHot} />
              <figcaption>Hringvegurinn og hraðhleðslustöðvar eftir OpenStreetMap (ODbL). Hvítir punktar eru aðrar hraðhleðslustöðvar á leiðinni, númeruðu hringirnir eru stoppin.{useUnk ? ' Hol merki eru stöðvar sem vantar upplýsingar um.' : ''}</figcaption>
            </figure>
            <figure className="pmap psoc on-dark" data-tone="dark">
              <SocChart plan={plan} drawn />
              <figcaption>Hleðsla rafhlöðunnar eftir leiðinni, frá Reykjavík hringinn. Línan fer aldrei undir {RESERVE} % og bíllinn hleður aldrei yfir {LIMIT} %.</figcaption>
            </figure>
          </div>
        </div>
        <div className="pnotes">
          <h2 data-chars="">Hvernig er þetta reiknað</h2>
          <ul className="facts" style={{ marginTop: 24 }}>
            <li>Leiðin er relation „Hringvegur“ í OpenStreetMap og mælist {km0(RING.km)} km eftir vegakerfi kortsins, frá Reykjavík hringinn. Heimildir gefa ekki sömu tölu: Wikipedia nefnir 1.309 km.</li>
            <li>Stöðvarnar eru þær sem OpenStreetMap skráir sem hraðhleðslu (CCS eða CHAdeMO, 50 kW eða meira) innan þriggja km frá veginum: {sites(false).length} stöðvar. Upplýsingarnar eru af kortinu, ekki staðfestar af rekstraraðilum. Hver stöð var síðast uppfærð á kortinu á tímabilinu {fmtDate(oldestSite.ts)} til {fmtDate(newestSite.ts)}, og {staleSites} af {dcSites.length} stöðvum fyrir árið 2025. Aðgangur er skráður opinn á {openSites} af {dcSites.length} stöðvum; á hinum er hann ekki skráður (það er merkt í listanum).</li>
            <li>ON segir á vef sínum að félagið reki 53 hraðhleðslustöðvar „á helstu viðkomustöðum við Hringveginn“ en birtir engan lista, og kortið þeirra krefst innskráningar (on.is, lesið 11. október 2026). Athugaðu stöðvarnar í appi rekstraraðilans áður en þú leggur af stað.</li>
            <li>Bíllinn fer af stað með fullan geymi og kemur heim með að minnsta kosti {RESERVE} %. Hann hleður aldrei yfir {LIMIT} % og aðeins þá orku sem næsti leggur þarf. Eyðsla á km er ein deilt með drægninni, og ferð á stöð sem er ekki við veginn kostar tvöfalda vegalengdina.</li>
            <li>Hleðsluhraði bílsins er leiddur af verðlistanum: 70 % af rafhlöðunni ({(0.7 * kwhNum(t.kwh)).toFixed(1).replace('.', ',')} kWh) á {m.dcMin} mínútum er um {Math.round((0.7 * kwhNum(t.kwh)) / (m.dcMin / 60))} kW að meðaltali. Hægari stöð lengir hleðsluna í hlutfalli. Tíminn er í besta falli: engin lækkun við hita eða kulda, engin röð, enginn deilt afl.</li>
            <li>Stoppin eru valin þannig að samanlagður hleðslutími sé sem stystur, ásamt örlítilli refsingu fyrir hvert stopp svo færri stopp vinni þegar það munar litlu.</li>
            <li>Lengsta bil milli stöðva sem eru taldar með er {km0(gap.g)} km, frá {dat(placeAt(gap.a))} að {dat(placeAt(gap.b))}.</li>
            <li>{RING.stats.teslaTotal} Tesla Supercharger-stöðvar eru innan þriggja km frá veginum í OpenStreetMap: {RING.stats.teslaCustomers} merktar eingöngu fyrir viðskiptavini Tesla, {RING.stats.teslaOpen} merktar opnar öllum og {RING.stats.teslaTotal - RING.stats.teslaCustomers - RING.stats.teslaOpen} án merkingar. Þær eru ekki taldar með, því óvíst er hvort aðrir bílar megi nota þær.</li>
          </ul>
          <h2 data-chars="" style={{ marginTop: 56 }}>Stöðvar sem vantar upplýsingar um</h2>
          <p className="lede" style={{ marginTop: 16 }}>Þessar {unk.length} stöðvar eru skráðar á kortið af þekktum rekstraraðila án þess að tengitegund eða afl sé tilgreint. Þær gætu verið hraðhleðsla eða hæg hleðsla, og eru aðeins taldar með ef þú hakar við það hér fyrir ofan.</p>
          <ul className="clist" style={{ marginTop: 20 }}>
            {unk.map((c) => <li key={c.id}><b>{c.name || c.op || 'Hleðslustöð'}</b><span className="num">{km0(c.km)} km, nálægt {dat(placeAt(c.km))}</span><small>{c.op || 'Rekstraraðili ekki skráður'}. Kort: {fmtDate(c.ts)}.</small></li>)}
          </ul>
        </div>
      </div>
      <DriveBand />
    </div>
  )
}

/* after a failed submit the first invalid field gets focus */
function focusFirst(form: HTMLFormElement, er: Record<string, string>) {
  window.setTimeout(() => {
    const k = Object.keys(er)[0]
    const el = form.querySelector<HTMLElement>(`[name="${k}"], [aria-invalid="true"]`)
    ;(el ?? form.querySelector<HTMLElement>('.err'))?.focus?.()
  }, 0)
}

/* days the forms offer: the next ten opening days from today, UTC like the clock */
function nextDays(): { v: string; label: string; sat: boolean }[] {
  const out: { v: string; label: string; sat: boolean }[] = []
  const d = new Date()
  const days = ['sun.', 'mán.', 'þri.', 'mið.', 'fim.', 'fös.', 'lau.']
  const months = ['jan.', 'feb.', 'mars', 'apr.', 'maí', 'júní', 'júlí', 'ág.', 'sept.', 'okt.', 'nóv.', 'des.']
  for (let i = 1; out.length < 10 && i < 30; i++) {
    const t = new Date(d.getTime() + i * 86_400_000)
    const wd = t.getUTCDay()
    if (wd === 0) continue
    out.push({ v: t.toISOString().slice(0, 10), label: `${days[wd]} ${t.getUTCDate()}. ${months[t.getUTCMonth()]}`, sat: wd === 6 })
  }
  return out
}

function Done({ r, back }: { r: Request; back: ReactNode }) {
  return (
    <div className="done" role="status">
      <h2>Beiðnin er komin til okkar.</h2>
      <dl>
        <div><dt>Númer</dt><dd className="id num">{r.id}</dd></div>
        <div><dt>{r.kind === 'thjonusta' ? 'Verk' : r.kind === 'innskipti' ? 'Bíll' : 'Efni'}</dt><dd>{r.title}</dd></div>
        <div><dt>Hvenær</dt><dd>{r.when}</dd></div>
        <div><dt>Staðfesting</dt><dd>{r.kind === 'innskipti' ? 'Söludeildin svarar með tilboði' : 'Una hringir í þig og staðfestir'}</dd></div>
      </dl>
      <div className="acts">{back}</div>
      <p className="proto-note">Frumgerð: beiðnin er geymd í þessum vafra og birtist á <Link to={to('afgreidsla')} style={{ textDecoration: 'underline' }}>afgreiðslusíðunni</Link>. Ekkert er sent til Unu.</p>
    </div>
  )
}

function Field({ label, name, type = 'text', required, auto, mode, value, onChange, error, placeholder }: { label: string; name: string; type?: string; required?: boolean; auto?: string; mode?: 'tel' | 'email' | 'numeric'; value?: string; onChange?: (v: string) => void; error?: string; placeholder?: string }) {
  return (
    <label>
      <span>{label}</span>
      <input name={name} type={type} required={required} autoComplete={auto} inputMode={mode} spellCheck={type === 'email' || type === 'tel' ? false : undefined} value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} aria-invalid={error ? 'true' : undefined} placeholder={placeholder} />
      {error && <p className="err" role="alert">{error}</p>}
    </label>
  )
}

const telOk = (s: string) => /^\+?[\d\s-]{7,}$/.test(s)

function TestDrivePage() {
  const loc = useLocation()
  const pre = new URLSearchParams(loc.search).get('bill') ?? ''
  const [step, setStep] = useState(pre ? 2 : 1)
  const [car, setCar] = useState(pre)
  const [day, setDay] = useState('')
  const [slot, setSlot] = useState('')
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const days = useMemo(() => nextDays(), [])
  const model = modelBySlug(car)
  const slotsFor = (v: string) => (days.find((d) => d.v === v)?.sat ? SLOTS.filter((s) => ['12:00', '13:00', '14:00', '15:00'].includes(s)) : SLOTS)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('nafn') ?? '').trim(), tel = String(fd.get('simi') ?? '').trim()
    const er: Record<string, string> = {}
    if (name.length < 2) er.nafn = 'Skrifaðu nafnið þitt.'
    if (!telOk(tel)) er.simi = 'Skrifaðu símanúmer, 7 tölustafi.'
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    const d = days.find((x) => x.v === day)
    setDone(saveRequest({ kind: 'reynsluakstur', title: model ? model.name : 'Bíll valinn síðar', when: `${d?.label ?? day} kl. ${slot}`, who: name, contact: tel, detail: String(fd.get('ath') ?? '') }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="xg-page">
      <div className="wrap">
        <Intro eyebrow="Reynsluakstur" title={['Veldu bíl,', 'dag og tíma.']} lede="Una staðfestir símleiðis. Reynsluakstur hefst í sýningarsalnum að Vínlandsleið 6-8 á opnunartíma." />
        <div className="book-grid">
          {done ? <Done r={done} back={<><Btn to="gerdir" label="Skoða fleiri bíla" tone="dark" /><Btn label="Bóka annan tíma" tone="line" onClick={() => { setDone(null); setStep(1); setCar(''); setDay(''); setSlot('') }} /></>} /> : (
            <form className="form" onSubmit={submit} noValidate>
              <div className="steps" aria-label="Skref">
                {['Bíll', 'Tími', 'Þú'].map((s, i) => <span key={s} aria-current={step === i + 1 ? 'step' : undefined}><span className="num">{i + 1}</span> {s}</span>)}
              </div>
              {step === 1 && (
                <>
                  <fieldset>
                    <legend>Hvaða bíl viltu prófa?</legend>
                    <div className="opts">
                      {MODELS.map((x) => <label key={x.slug} className="opt"><input type="radio" name="bill" value={x.slug} checked={car === x.slug} onChange={() => setCar(x.slug)} /><span>{x.name}</span></label>)}
                    </div>
                  </fieldset>
                  <div className="acts"><Btn label="Næsta: tími" tone="deep" onClick={() => { if (car) setStep(2) }} /><span className="note">{car ? `${model!.name} valinn.` : 'Veldu bíl til að halda áfram.'}</span></div>
                </>
              )}
              {step === 2 && (
                <>
                  <p className="note">{model ? `${model.name}.` : ''} <button type="button" style={{ textDecoration: 'underline' }} onClick={() => setStep(1)}>Breyta bíl</button></p>
                  <fieldset>
                    <legend>Dagur</legend>
                    <div className="opts">{days.map((d) => <label key={d.v} className="opt"><input type="radio" name="dagur" value={d.v} checked={day === d.v} onChange={() => { setDay(d.v); setSlot('') }} /><span>{d.label}</span></label>)}</div>
                  </fieldset>
                  <fieldset>
                    <legend>Tími</legend>
                    <div className="opts">{(day ? slotsFor(day) : SLOTS).map((s) => <label key={s} className="opt"><input type="radio" name="timi" value={s} disabled={!day} checked={slot === s} onChange={() => setSlot(s)} /><span className="num">{s}</span></label>)}</div>
                    {!day && <p className="note" style={{ marginTop: 8 }}>Veldu dag fyrst. Á laugardögum er opið kl. 12-16.</p>}
                  </fieldset>
                  <div className="acts"><Btn label="Næsta: þínar upplýsingar" tone="deep" onClick={() => { if (day && slot) setStep(3) }} /><button type="button" className="tlink" onClick={() => setStep(1)}>Til baka</button></div>
                </>
              )}
              {step === 3 && (
                <>
                  <p className="note">{model ? `${model.name}, ` : ''}{days.find((x) => x.v === day)?.label} kl. {slot}. <button type="button" style={{ textDecoration: 'underline' }} onClick={() => setStep(2)}>Breyta</button></p>
                  <div className="two">
                    <Field label="Nafn" name="nafn" required auto="name" error={err.nafn} />
                    <Field label="Sími" name="simi" type="tel" required auto="tel" mode="tel" error={err.simi} />
                  </div>
                  <label><span>Athugasemd (valfrjálst)</span><textarea name="ath" rows={3} placeholder="Til dæmis: vil líka sjá G9, eða þarf að draga hestakerru" /></label>
                  <div className="acts"><Btn type="submit" label="Senda beiðni" tone="deep" /><button type="button" className="tlink" onClick={() => setStep(2)}>Til baka</button></div>
                  <p className="note">Una hringir og staðfestir. Upplýsingarnar eru aðeins notaðar til að bóka þennan tíma.</p>
                </>
              )}
            </form>
          )}
          <aside className="aside">
            <h3>Sýningarsalur, Vínlandsleið 6-8</h3>
            <p>Virka daga kl. 9-17, laugardaga kl. 12-16.</p>
            <p>Frekar hringja? <a href={`tel:${CONTACT.tel}`} className="tlink">{CONTACT.phone}</a></p>
            <Frame p={IMG.showroom} sizes="(min-width: 900px) 36vw, 100vw" ratio="4 / 3" />
          </aside>
        </div>
      </div>
    </div>
  )
}

function ServicePage() {
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const [job, setJob] = useState('')
  const [day, setDay] = useState('')
  const days = useMemo(() => nextDays().filter((d) => !d.sat), [])
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('nafn') ?? '').trim(), tel = String(fd.get('simi') ?? '').trim(), reg = String(fd.get('numer') ?? '').trim().toUpperCase(), bill = String(fd.get('bill') ?? '').trim()
    const er: Record<string, string> = {}
    if (!job) er.job = 'Veldu verk.'
    if (!day) er.dagur = 'Veldu dag.'
    if (!/^[A-ZÞÆÖÐ]{2,3}[- ]?\d{2,3}$/.test(reg)) er.numer = 'Skrifaðu bílnúmer, til dæmis AB-123.'
    if (bill.length < 2) er.bill = 'Hvaða bíll er þetta? Til dæmis G6, 2025.'
    if (name.length < 2) er.nafn = 'Skrifaðu nafnið þitt.'
    if (!telOk(tel)) er.simi = 'Skrifaðu símanúmer, 7 tölustafi.'
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    const d = days.find((x) => x.v === day)
    setDone(saveRequest({ kind: 'thjonusta', title: `${job}, ${bill}`, when: d?.label ?? day, who: name, contact: tel, detail: `Bílnúmer ${reg}. ${String(fd.get('ath') ?? '')}` }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="xg-page">
      <div className="wrap">
        <Intro eyebrow="Þjónusta og ábyrgð" title={['Una þjónustar', 'XPENG.']} lede={`${SERVICE.note} Sendu beiðni hér og Una staðfestir símleiðis hvar og hvenær bíllinn kemur.`} />
        <div className="book-grid">
          {done ? <Done r={done} back={<><Btn to="" label="Á forsíðu" tone="dark" /><Btn label="Önnur beiðni" tone="line" onClick={() => { setDone(null); setJob(''); setDay('') }} /></>} /> : (
            <form className="form" onSubmit={submit} noValidate>
              <fieldset>
                <legend>Verk</legend>
                <div className="opts">{SERVICE.jobs.map((j) => <label key={j} className="opt"><input type="radio" name="verk" value={j} checked={job === j} onChange={() => setJob(j)} /><span>{j}</span></label>)}</div>
                {err.job && <p className="err">{err.job}</p>}
              </fieldset>
              <div className="two">
                <Field label="Bílnúmer" name="numer" required error={err.numer} placeholder="AB-123" />
                <Field label="Bíll og árgerð" name="bill" required error={err.bill} placeholder="G6, 2025" />
              </div>
              <fieldset>
                <legend>Hvaða dag hentar</legend>
                <div className="opts">{days.map((d) => <label key={d.v} className="opt"><input type="radio" name="dagur" value={d.v} checked={day === d.v} onChange={() => setDay(d.v)} /><span>{d.label}</span></label>)}</div>
                {err.dagur && <p className="err">{err.dagur}</p>}
              </fieldset>
              <div className="two">
                <Field label="Nafn" name="nafn" required auto="name" error={err.nafn} />
                <Field label="Sími" name="simi" type="tel" required auto="tel" mode="tel" error={err.simi} />
              </div>
              <label><span>Lýsing (valfrjálst)</span><textarea name="ath" rows={3} placeholder="Hvað er að, hvenær byrjaði það, viðvörunarljós" /></label>
              <div className="acts"><Btn type="submit" label="Senda beiðni" tone="deep" /></div>
              <p className="note">Una staðfestir símleiðis. Hvar þjónustan fer fram er staðfest í símtalinu.</p>
            </form>
          )}
          <aside className="aside">
            <h3>Ábyrgð og þjónusta</h3>
            <p>Ábyrgð {WARRANTY}. Þjónustuskoðun {SERVICE_INTERVAL}. Forsendur ábyrgðar eru reglulegt þjónustueftirlit sem kaupandi ber kostnað af.</p>
            <p><a href={SERVICE.manual} className="tlink" target="_blank" rel="noopener">Viðgerðarhandbók XPENG <ArrowUpRight size={14} aria-hidden="true" /></a></p>
            <p>Síminn: <a href={`tel:${CONTACT.tel}`} className="tlink">{CONTACT.phone}</a></p>
            <Frame p={IMG.winter} sizes="(min-width: 900px) 36vw, 100vw" ratio="4 / 3" />
          </aside>
        </div>
      </div>
    </div>
  )
}

function TradeInPage() {
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const cur = String(fd.get('nuna') ?? '').trim(), yr = String(fd.get('arger') ?? '').trim(), km = String(fd.get('km') ?? '').trim(), want = String(fd.get('xpeng') ?? ''), name = String(fd.get('nafn') ?? '').trim(), tel = String(fd.get('simi') ?? '').trim()
    const er: Record<string, string> = {}
    if (cur.length < 2) er.nuna = 'Hvaða bíll er þetta? Til dæmis Toyota RAV4.'
    if (!/^(19|20)\d{2}$/.test(yr)) er.arger = 'Árgerð, til dæmis 2021.'
    if (!/^\d{1,3}([.\s]?\d{3})?$/.test(km)) er.km = 'Akstur í km, til dæmis 82000.'
    if (name.length < 2) er.nafn = 'Skrifaðu nafnið þitt.'
    if (!telOk(tel)) er.simi = 'Skrifaðu símanúmer, 7 tölustafi.'
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    setDone(saveRequest({ kind: 'innskipti', title: `${cur} upp í ${want}`, when: 'Tilboð frá söludeild', who: name, contact: tel, detail: `${cur}, ${yr}, ${km} km. ${String(fd.get('ath') ?? '')}` }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="xg-page">
      <div className="wrap">
        <Intro eyebrow="Bíllinn upp í" title={['Hvað færðu', 'fyrir bílinn?']} lede="Segðu okkur hvaða bíll þetta er og hvaða XPENG þig langar í. Söludeildin skoðar og svarar með tilboði. Ekkert verð er nefnt hér, því bíll er metinn með því að skoða hann." />
        <div className="book-grid">
          {done ? <Done r={done} back={<><Btn to="gerdir" label="Skoða bílana" tone="dark" /><Btn label="Önnur beiðni" tone="line" onClick={() => setDone(null)} /></>} /> : (
            <form className="form" onSubmit={submit} noValidate>
              <div className="two">
                <Field label="Núverandi bíll" name="nuna" required error={err.nuna} placeholder="Toyota RAV4" />
                <label><span>XPENG sem þig langar í</span><select name="xpeng" defaultValue="XPENG G6">{MODELS.map((m) => <option key={m.slug}>{m.name}</option>)}</select></label>
              </div>
              <div className="two">
                <Field label="Árgerð" name="arger" required mode="numeric" error={err.arger} placeholder="2021" />
                <Field label="Akstur (km)" name="km" required mode="numeric" error={err.km} placeholder="82000" />
              </div>
              <div className="two">
                <Field label="Nafn" name="nafn" required auto="name" error={err.nafn} />
                <Field label="Sími" name="simi" type="tel" required auto="tel" mode="tel" error={err.simi} />
              </div>
              <label><span>Athugasemd (valfrjálst)</span><textarea name="ath" rows={3} placeholder="Ástand, aukabúnaður, lán á bílnum" /></label>
              <div className="acts"><Btn type="submit" label="Senda upplýsingar" tone="deep" /></div>
              <p className="note">Söludeildin svarar með tilboði eftir að hafa skoðað upplýsingarnar.</p>
            </form>
          )}
          <aside className="aside">
            <h3>Sýningarsalur, Vínlandsleið 6-8</h3>
            <p>Þú getur líka komið með bílinn. Virka daga kl. 9-17, laugardaga kl. 12-16.</p>
            <Frame p={IMG.showroom} sizes="(min-width: 900px) 36vw, 100vw" ratio="4 / 3" />
          </aside>
        </div>
      </div>
    </div>
  )
}

function NewsPage() {
  return (
    <div className="xg-page">
      <div className="wrap"><Intro eyebrow="Fréttir" title={['Fréttir frá Unu']} lede="Sjö færslur af bilaumbodiduna.is, með dagsetningum eins og þær eru birtar. Hver færsla opnast á vef Unu." /></div>
      <NewsBand full />
    </div>
  )
}

function ContactPage() {
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const [now] = useState(() => new Date())
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('nafn') ?? '').trim(), email = String(fd.get('netfang') ?? '').trim(), msg = String(fd.get('skilabod') ?? '').trim()
    const er: Record<string, string> = {}
    if (name.length < 2) er.nafn = 'Skrifaðu nafnið þitt.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) er.netfang = 'Netfang sem við svörum á.'
    if (msg.length < 5) er.skilabod = 'Hvað getum við gert fyrir þig?'
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    setDone(saveRequest({ kind: 'fyrirspurn', title: String(fd.get('efni') || 'Fyrirspurn'), when: 'Svar á netfang', who: name, contact: email, detail: msg }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="xg-page xg-contact">
      <div className="wrap">
        <Intro eyebrow="Vínlandsleið 6-8" title={['Hafðu samband.']} lede="Eitt símanúmer, eitt netfang fyrir XPENG og fjórir í söludeildinni sem svara fyrirspurnum um bíla, verð og reynsluakstur." />
        <div className="cgrid">
          <div>
            {done ? <Done r={done} back={<Btn label="Önnur fyrirspurn" tone="line" onClick={() => setDone(null)} />} /> : (
              <form className="form" onSubmit={submit} noValidate>
                <div className="two">
                  <Field label="Nafn" name="nafn" required auto="name" error={err.nafn} />
                  <Field label="Netfang" name="netfang" type="email" required auto="email" mode="email" error={err.netfang} />
                </div>
                <label><span>Efni</span><select name="efni" defaultValue="Fyrirspurn um bíl"><option>Fyrirspurn um bíl</option><option>Verð og útfærslur</option><option>Þjónusta og ábyrgð</option><option>Annað</option></select></label>
                <label><span>Skilaboð</span><textarea name="skilabod" rows={5} aria-invalid={err.skilabod ? 'true' : undefined} />{err.skilabod && <p className="err">{err.skilabod}</p>}</label>
                <div className="acts"><Btn type="submit" label="Senda" tone="deep" /></div>
                <p className="note">Við notum netfangið aðeins til að svara þessari fyrirspurn. <Link to={to('personuvernd')} style={{ textDecoration: 'underline' }}>Persónuvernd</Link>.</p>
              </form>
            )}
            <div className="where" data-fade="">
              <strong>Bílaumboðið Una, Vínlandsleið 6-8, 113 Reykjavík</strong>
              <dl>
                <div><dt>Sími</dt><dd><a href={`tel:${CONTACT.tel}`} className="num">{CONTACT.phone}</a></dd></div>
                <div><dt>Netfang</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
                {DEPTS.map((d) => <div key={d.key}><dt>Sýningarsalur</dt><dd>{openState(d, now).text}</dd></div>)}
                <div><dt>Opnunartími</dt><dd>Virka daga 9-17, laugardaga 12-16</dd></div>
              </dl>
              <a className="tlink" href={CONTACT.map} target="_blank" rel="noopener">Opna í Google Maps <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="people">
            <h3>Söludeild</h3>
            {STAFF.map((p) => (
              <div key={p.email} className="person">
                <b>{p.name}</b>
                <span>{p.role}</span>
                <a href={`mailto:${p.email}`}><Mail size={14} aria-hidden="true" />{p.email}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function InboxPage() {
  const [mine, setMine] = useState<Request[]>(() => loadRequests())
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({})
  const all = [...mine, ...SAMPLE_REQUESTS]
  const KIND: Record<Request['kind'], string> = { reynsluakstur: 'Reynsluakstur', thjonusta: 'Þjónusta', innskipti: 'Bíll upp í', fyrirspurn: 'Fyrirspurn' }
  const fmt = (iso: string) => { const d = new Date(iso); return `${d.getUTCDate()}.${d.getUTCMonth() + 1}. kl. ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}` }
  return (
    <div className="xg-page xg-inbox">
      <div className="wrap">
        <div className="ibar" role="status"><span><b>Afgreiðsla, Vínlandsleið 6-8</b> · innhólf söludeildar</span><span className="num">{all.filter((r) => r.status === 'ný' && !confirmed[r.id]).length} nýjar beiðnir</span></div>
        <Intro title={['Beiðnir dagsins']} lede="Hver beiðni af vefnum lendir hér með númeri, tíma og tengilið. Starfsmaður staðfestir og hringir." />
        <table>
          <thead><tr><th>Númer</th><th>Tegund</th><th>Beiðni</th><th>Hvenær</th><th>Hver</th><th>Barst</th><th>Staða</th><th>Aðgerð</th></tr></thead>
          <tbody>
            {all.map((r) => {
              const ok = r.status === 'staðfest' || confirmed[r.id]
              return (
                <tr key={r.id}>
                  <td className="num">{r.id}</td>
                  <td><span className="kind">{KIND[r.kind]}</span></td>
                  <td>{r.title}{r.detail && <><br /><small style={{ color: 'var(--mute)' }}>{r.detail}</small></>}</td>
                  <td>{r.when}</td>
                  <td>{r.who}<br /><small style={{ color: 'var(--mute)' }}>{r.contact}</small></td>
                  <td className="num">{fmt(r.at)}</td>
                  <td><span className={`st${ok ? '' : ' new'}`}><i aria-hidden="true" />{ok ? 'Staðfest' : 'Ný'}</span></td>
                  <td><div className="ia">{!ok && <button type="button" onClick={() => setConfirmed((c) => ({ ...c, [r.id]: true }))}>Staðfesta</button>}<a href={/@/.test(r.contact) ? `mailto:${r.contact.split(', ').pop()}` : `tel:${r.contact.replace(/\s/g, '')}`} className="btn btn-line" style={{ minHeight: 36, padding: '0 12px', fontSize: 13.5 }}>{/@/.test(r.contact) ? 'Svara' : 'Hringja'}</a></div></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="inote">Frumgerð af starfsmannahlið. Beiðnir merktar U-S eru sýnishorn; hinar eru þær sem þú sendir sjálf(ur) á þessum vef í þessum vafra. Í raunverulegu kerfi fer hver beiðni í tölvupóst á xpeng@bilaumbodiduna.is og í þetta innhólf með innskráningu. {mine.length > 0 && <button type="button" style={{ textDecoration: 'underline' }} onClick={() => { try { sessionStorage.removeItem('xg-requests') } catch { /* */ } setMine([]) }}>Hreinsa mínar beiðnir</button>}</p>
      </div>
    </div>
  )
}

function PrivacyPage() {
  return (
    <div className="xg-page">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <Intro eyebrow="Persónuvernd" title={['Hvað við geymum,', 'og hve lengi.']} />
        <div style={{ display: 'grid', gap: 18, fontSize: 17 }} data-lines="">
          <p>Bílaumboðið Una, kt. {CONTACT.kt}, Vínlandsleið 6-8, er ábyrgðaraðili. Formin á þessum vef safna aðeins því sem þarf til að bóka tíma eða svara fyrirspurn: nafni, símanúmeri eða netfangi, bílnúmeri þegar um þjónustu er að ræða, upplýsingum um bíl sem þú vilt láta taka upp í, og því sem þú skrifar sjálf(ur).</p>
          <p>Upplýsingarnar eru notaðar til að afgreiða beiðnina og ekki í annað. Beiðnum um reynsluakstur og þjónustu er eytt þegar tímanum lýkur; fyrirspurnum þegar þeim hefur verið svarað. Þær eru ekki seldar eða sendar þriðja aðila.</p>
          <p>Þú getur beðið um afrit af gögnum um þig eða látið eyða þeim með því að skrifa á {CONTACT.email}.</p>
          <p style={{ color: 'var(--mute)', fontSize: 14 }}>Frumgerð: þessi texti er tillaga sem Una þarf að yfirfara og bera saman við eigin persónuverndarstefnu. Í frumgerðinni er ekkert sent; formin geyma beiðnir aðeins í þínum vafra.</p>
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="xg-page"><div className="wrap"><Intro title={['Síðan fannst ekki.']} lede="Hlekkurinn er úreltur eða skakkt skrifaður." /><Btn to="" label="Á forsíðu" tone="dark" /></div></div>
  )
}

/* ── the shell ──────────────────────────────────────────────────────────── */

const TITLES: Record<string, [string, string]> = {
  '': ['Una | XPENG á Íslandi: verð, reynsluakstur og Hringvegurinn', 'Bílaumboðið Una í Reykjavík er umboðs- og þjónustuaðili XPENG á Íslandi. Verðlisti október 2026, reynsluakstur, þjónusta og hleðsluáætlun fyrir Hringveginn.'],
  gerdir: ['XPENG bílar og verðlisti | Una', 'XPENG L03, G6, G9 og X9 með verðum af verðlista október 2026, litum, innréttingum og tæknitölum.'],
  hringvegurinn: ['Hringvegurinn á rafmagni | Una', 'Reiknaðu hvort XPENG kemst Hringveginn: hraðhleðslustöðvar á leiðinni eftir OpenStreetMap, stopp og hleðslutími í besta falli.'],
  reynsluakstur: ['Bóka reynsluakstur | Una', 'Veldu XPENG, dag og tíma. Una í Reykjavík staðfestir símleiðis.'],
  thjonusta: ['Þjónusta og ábyrgð | Una', 'Una er þjónustuaðili XPENG. Ábyrgð 7 ár / 160.000 km, þjónustuskoðun á 20.000 km fresti eða 12 mánaða fresti.'],
  innskipti: ['Bíllinn upp í XPENG | Una', 'Sendu upplýsingar um núverandi bíl og fáðu tilboð frá söludeild Unu.'],
  frettir: ['Fréttir | Una', 'Fréttir af XPENG á Íslandi frá Bílaumboðinu Unu.'],
  'hafa-samband': ['Hafa samband | Una', 'Sími 590 2900, netfang og söludeild Unu. Vínlandsleið 6-8, 113 Reykjavík.'],
  afgreidsla: ['Afgreiðsla | Una', 'Starfsmannahlið: beiðnir af vefnum.'],
  personuvernd: ['Persónuvernd | Una', 'Hvaða upplýsingum vefur Unu safnar og hvernig þær eru notaðar.'],
}

export default function XpengPage() {
  const root = useRef<HTMLDivElement>(null)
  const loc = useLocation()
  const sub = loc.pathname.replace(/^.*?\/preview\/xpeng\/?/, '').replace(/\/+$/, '')
  const [menu, setMenu] = useState(false)
  const [focusKey, setFocusKey] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())
  const chat = useRef<ChatEl | null>(null)
  const page = sub.split('/')[0]
  const isHome = sub === ''
  const formPage = useRef(false)
  formPage.current = ['reynsluakstur', 'thjonusta', 'innskipti', 'hafa-samband', 'afgreidsla'].includes(page)

  /* head: title, description, lang, noindex, theme colour, structured data */
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const [t, d] = TITLES[page] ?? TITLES['']
    const car = sub.startsWith('gerdir/') ? modelBySlug(sub.split('/')[1]) : undefined
    document.title = car ? `${car.name} | Una` : t
    document.documentElement.lang = 'is'
    setThemeColor(SLATE)
    const a = setMetaDescription(car ? `${car.name} hjá Unu: verð, drægni, afl, hleðsla og ábyrgð, og reynsluakstur að Vínlandsleið 6-8.` : d)
    const b = setNoindex(true)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => { document.title = prevTitle; document.documentElement.lang = prevLang; a(); b(); ld.remove() }
  }, [sub, page])

  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 60_000); return () => window.clearInterval(t) }, [])

  /* the assistant: our widget, answering only from this page (chat.ts) */
  useEffect(() => {
    let el: ChatEl | null = null
    let alive = true
    import('./vendor/sndr-chat.js').then(() => {
      if (!alive || !root.current) return
      el = document.createElement('sndr-chat') as ChatEl
      el.setAttribute('name', 'Una')
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

  /* route change: top of page, menu closed */
  useEffect(() => {
    setMenu(false)
    if (loc.hash) { window.setTimeout(() => goTo(decodeURIComponent(loc.hash.slice(1))), 80); return }
    if (pageLenis) pageLenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0)
  }, [loc.pathname, loc.hash])

  /* chrome: hide on the way down, show on the way up, colour at the section edge */
  const chromeRef = useRef<HTMLDivElement>(null)
  const topPlate = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const chrome = chromeRef.current!
    let lastY = window.scrollY
    let raf = 0
    const tick = () => {
      raf = 0
      const y = window.scrollY
      chrome.style.setProperty('--bar', `${-Math.min(y, 36)}px`)
      chrome.dataset.solid = y > 40 ? '1' : '0'
      /* the sticky bar is for browsing pages; a form page already has its action on screen */
      if (root.current) root.current.dataset.sticky = !formPage.current && y > window.innerHeight * 0.6 ? '1' : '0'
      if (!document.documentElement.classList.contains('xg-menu')) {
        if (y > 320 && y > lastY + 4) chrome.dataset.hide = '1'
        else if (y < lastY - 4 || y <= 320) chrome.dataset.hide = '0'
      }
      lastY = y
      const plate = topPlate.current
      if (!plate) return
      const band = plate.getBoundingClientRect()
      let a = Infinity, b = -Infinity
      root.current?.querySelectorAll<HTMLElement>('[data-tone="dark"]').forEach((d) => {
        const r = d.getBoundingClientRect()
        const t = Math.max(r.top, band.top), bt = Math.min(r.bottom, band.bottom)
        if (bt > t && r.width > window.innerWidth * 0.6) { a = Math.min(a, t - band.top); b = Math.max(b, bt - band.top) }
      })
      plate.style.clipPath = a === Infinity ? 'inset(0 0 100% 0)' : `inset(${a.toFixed(1)}px 0 ${(band.height - b).toFixed(1)}px 0)`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    const iv = window.setInterval(on, 250)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); window.clearInterval(iv); cancelAnimationFrame(raf) }
  }, [])

  /* menu */
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('xg-menu', menu)
    if (!menu) return
    pageLenis?.stop()
    const opener = document.activeElement as HTMLElement | null
    const bg = root.current ? [...root.current.children].filter((c) => !c.classList.contains('xg-menu-panel') && c.tagName !== 'STYLE') as HTMLElement[] : []
    bg.forEach((c) => c.setAttribute('inert', ''))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('keydown', onKey)
    const panel = menuRef.current
    panel?.querySelector<HTMLElement>('a,button')?.focus()
    if (panel && !still()) {
      gsap.fromTo(panel, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: 'xg' })
      gsap.fromTo(panel.querySelectorAll('[data-mi]'), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.07, delay: 0.3, ease: 'xg' })
    }
    return () => { document.removeEventListener('keydown', onKey); pageLenis?.start(); html.classList.remove('xg-menu'); bg.forEach((c) => c.removeAttribute('inert')); opener?.focus?.() }
  }, [menu])

  /* Lenis, once */
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

  /* motion per route: the staged opening, then the position-tied reveals */
  useLayoutEffect(() => {
    const el = root.current!
    const main = el.querySelector<HTMLElement>('main')!
    const reduce = still()
    let ctx: gsap.Context | null = null
    let alive = true
    const splits: SplitText[] = []
    const build = () => { if (!alive) return; ctx = gsap.context(() => {
      /* the Hringvegurinn chapter runs even under reduced motion: it then just shows the finished route.
         Scrolling drives the line round the island; the counters, the battery chart and the stops all read
         the plan for the chosen car (kept in a ref by the component). Desktop pins the stage; phones tie
         it to the map's own position. Per frame: a handful of attribute/transform writes, no layout reads
         except one getPointAtLength, and a write is skipped when the value did not change. */
      const deskRing = window.matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)').matches
      const ring = main.querySelector<HTMLElement>('.xg-ring')
      if (ring) {
        const mapEl = ring.querySelector<HTMLElement>('[data-rmap]') as (HTMLElement & { _plan?: () => Plan }) | null
        const draw = ring.querySelector<SVGPathElement>('[data-draw]')
        const road = ring.querySelector<SVGPathElement>('.road0')
        const car = ring.querySelector<SVGGElement>('[data-car]')
        const socDraw = ring.querySelector<SVGPathElement>('[data-soc-draw]')
        const socDot = ring.querySelector<SVGGElement>('[data-soc-dot]')
        const out = { km: ring.querySelector<HTMLElement>('[data-km]'), stops: ring.querySelector<HTMLElement>('[data-stops]'), min: ring.querySelector<HTMLElement>('[data-min]'), soc: ring.querySelector<HTMLElement>('[data-soc]') }
        const total = road?.getTotalLength() ?? 0
        let stopEls: SVGElement[] = [], socStopEls: SVGElement[] = [], cached: Plan | undefined
        const last = { km: '', stops: '', min: '', soc: '', on: '' }
        const put = (el: HTMLElement | null, key: keyof typeof last, v: string) => { if (el && last[key] !== v) { last[key] = v; el.textContent = v } }
        const apply = (p: number) => {
          const plan = mapEl?._plan?.()
          if (!plan) return
          if (plan !== cached || (stopEls[0] && !stopEls[0].isConnected)) {
            cached = plan
            stopEls = [...ring.querySelectorAll<SVGElement>('[data-stop]')]
            socStopEls = [...ring.querySelectorAll<SVGElement>('[data-soc-stop]')]
            last.on = ''
          }
          const km = p * RING.km
          if (draw) draw.style.strokeDashoffset = String(1 - p)
          if (socDraw) socDraw.style.strokeDashoffset = String(1 - p)
          if (car && road && total) {
            const pt = road.getPointAtLength(p * total)
            car.style.transform = `translate(${pt.x.toFixed(1)}px,${pt.y.toFixed(1)}px)`
            car.style.opacity = p > 0.002 && p < 0.998 ? '1' : '0'
          }
          const soc = socAt(plan, km)
          if (socDot) socDot.style.transform = `translate(${socX(km).toFixed(1)}px,${socY(soc).toFixed(1)}px)`
          let n = 0, mins = 0
          plan.stops.forEach((s) => { if (s.km <= km) { n++; mins += s.minutes } })
          const onKey = `${n}`
          if (last.on !== onKey) {
            last.on = onKey
            stopEls.forEach((g) => { g.dataset.on = Number(g.dataset.km) <= km ? '1' : '0' })
            socStopEls.forEach((g) => { g.dataset.on = Number(g.dataset.km) <= km ? '1' : '0' })
          }
          put(out.km, 'km', km0(km)); put(out.stops, 'stops', String(n)); put(out.min, 'min', String(mins)); put(out.soc, 'soc', String(Math.round(soc)))
        }
        apply(0)
        if (reduce) { apply(1) } else if (deskRing) {
          ScrollTrigger.create({ trigger: ring, start: 'top top', end: '+=1700', pin: ring.querySelector('[data-stage]') as HTMLElement, scrub: 0.6, anticipatePin: 1, onUpdate: (s) => apply(s.progress), onRefresh: (s) => apply(s.progress) })
        } else {
          ScrollTrigger.create({ trigger: ring.querySelector('.rmap'), start: 'top 85%', end: 'bottom 35%', scrub: true, onUpdate: (s) => apply(s.progress), onRefresh: (s) => apply(s.progress) })
        }
      }
      if (reduce) return
      const desk = window.matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)').matches
      const isHomeRoute = !!main.querySelector('.xg-hero')
      const touch = isTouch()
      const travel = touch ? 12 : 22

      /* the opening (Suðurverk/CargoKite): header, eyebrow, masked lines, masked photo, body, button */
      const open = gsap.timeline({ defaults: { ease: 'power3.out' } })
      const intro = main.querySelector<HTMLElement>('.xg-hero, .intro, .dhead') ?? main
      const lines = intro.querySelectorAll('[data-line]')
      const opens = intro.querySelectorAll('[data-open]:not(.eyebrow)')
      const photo = intro.querySelector('[data-hmask] img')
      open.from(intro.querySelectorAll('.eyebrow'), { y: travel, opacity: 0, duration: 0.45 }, 0.12)
      if (lines.length) open.from(lines, { yPercent: 110, duration: 0.72, stagger: 0.08 }, 0.22)
      if (photo) open.from(photo, { yPercent: 12, opacity: 0, duration: 0.85 }, 0.18)
      if (opens.length) open.from(opens, { y: travel, opacity: 0, duration: 0.55, stagger: 0.08 }, 0.42)
      const finish = (e: KeyboardEvent) => { if (e.key === 'Tab') open.progress(1) }
      document.addEventListener('keydown', finish)

      /* titles: masked characters, .8s, .018, by position (Spyker) */
      main.querySelectorAll<HTMLElement>('[data-chars]').forEach((t) => {
        splits.push(new SplitText(t, { type: 'chars,words', charsClass: 'ch', wordsClass: 'wd', mask: 'chars', autoSplit: true,
          onSplit: (self) => gsap.fromTo(self.chars, { yPercent: 100 }, { yPercent: 0, ease: 'xg', duration: 0.8, stagger: 0.018, scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 86%', scrub: true } }) }))
      })
      main.querySelectorAll<HTMLElement>('[data-lines]').forEach((t) => {
        if (intro.contains(t)) return
        splits.push(new SplitText(t, { type: 'lines', linesClass: 'ln', autoSplit: true,
          onSplit: (self) => gsap.fromTo(self.lines, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, ease: 'xg', duration: 0.8, stagger: 0.05, scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 84%', scrub: true } }) }))
      })
      main.querySelectorAll<HTMLElement>('[data-fade]').forEach((t) => {
        if (intro.contains(t)) return
        gsap.fromTo(t, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, ease: 'none', scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 84%', scrub: true } })
      })
      main.querySelectorAll<HTMLElement>('[data-media]').forEach((f) => {
        if (intro.contains(f)) return
        const img = f.querySelector('img')
        const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 100%', end: 'top 70%', scrub: true } })
        tl.fromTo(f, { clipPath: 'inset(20% 20% 20% 20%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'xg', duration: 0.9 }, 0)
        if (img) tl.fromTo(img, { scale: 1.1 }, { scale: 1, ease: 'xg', duration: 0.9 }, 0)
      })
      main.querySelectorAll<HTMLElement>('[data-par]').forEach((p) => {
        gsap.fromTo(p, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: p.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      main.querySelectorAll<HTMLElement>('[data-items]').forEach((g) => {
        gsap.fromTo(g.children, { scale: 0.94, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: 'xg', duration: 0.8, stagger: 0.06, scrollTrigger: { trigger: g, start: 'top 100%', end: 'top 80%', scrub: true } })
      })
      /* buttons open from the middle on the home page only: on a form page a CTA that sits low in
         the viewport would wait, half clipped, for a scroll that may never come */
      if (isHomeRoute) main.querySelectorAll<HTMLElement>('[data-btn]').forEach((b) => {
        if (intro.contains(b)) return
        gsap.fromTo(b, { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', ease: 'xg', scrollTrigger: { trigger: b, start: 'top 99%', end: 'top 84%', scrub: true } })
      })

      /* a keyboard user never lands on a hidden reveal */
      const revealFocused = (e: FocusEvent) => {
        const t = e.target as HTMLElement
        gsap.getTweensOf(t.querySelectorAll('*')).forEach((tw) => tw.progress(1))
        ScrollTrigger.getAll().forEach((st) => { const tr = st.trigger as HTMLElement | null; if (tr && (tr === t || tr.contains(t) || t.contains(tr))) st.animation?.progress(1) })
      }
      main.addEventListener('focusin', revealFocused)

      /* home only: hero parallax (desktop), the pinned Hringvegurinn chapter, the statement clip */
      const hero = main.querySelector<HTMLElement>('.xg-hero')
      if (hero && desk) {
        gsap.to(hero.querySelector('[data-hcopy]'), { yPercent: -18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '+=700', scrub: true } })
        gsap.to(hero.querySelector('[data-hphoto]'), { yPercent: 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '+=700', scrub: true } })
      }
      const band = main.querySelector<HTMLElement>('.xg-statement')
      if (band) {
        const mInset = 10
        const st = { inset: mInset }
        const set = () => { band.style.clipPath = `inset(${st.inset}% round ${st.inset > 0.5 ? 8 : 0}px)` }
        set()
        const q = gsap.quickTo(st, 'inset', { duration: 0.15, ease: 'none', onUpdate: set })
        ScrollTrigger.create({
          trigger: band, start: 'top bottom', end: 'bottom top',
          onUpdate: (s) => {
            const y = s.scroll(), h = band.offsetHeight
            const a = s.start + 0.4 * window.innerHeight, b = s.end - 0.6 * h
            const v = y <= a ? gsap.utils.mapRange(s.start, a, mInset, 0, y) : y >= b ? gsap.utils.mapRange(b, s.end, 0, mInset, y) : 0
            q(gsap.utils.clamp(0, mInset, v))
          },
        })
      }
      return () => { document.removeEventListener('keydown', finish); main.removeEventListener('focusin', revealFocused) }
    }, el); ScrollTrigger.refresh() }
    /* the real family must be measured, not the fallback: ask for the three weights, then build */
    if (!document.fonts) build()
    else Promise.all(['400', '500', '600'].map((w) => document.fonts.load(`${w} 16px XgF`))).then(() => document.fonts.ready).then(build, build)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { alive = false; window.removeEventListener('load', refresh); ctx?.revert(); splits.forEach((s) => s.revert()) }
  }, [loc.pathname])

  const sala = openState(DEPTS[0], now)
  let body: ReactNode
  if (isHome) body = <Home />
  else if (page === 'gerdir') body = sub.includes('/') ? <DetailPage key={sub} slug={sub.split('/')[1]} /> : <ModelsPage />
  else if (page === 'hringvegurinn') body = <RingPage />
  else if (page === 'reynsluakstur') body = <TestDrivePage />
  else if (page === 'thjonusta') body = <ServicePage />
  else if (page === 'innskipti') body = <TradeInPage />
  else if (page === 'frettir') body = <NewsPage />
  else if (page === 'hafa-samband') body = <ContactPage />
  else if (page === 'afgreidsla') body = <InboxPage />
  else if (page === 'personuvernd') body = <PrivacyPage />
  else body = <NotFound />

  return (
    <div ref={root} className={`xg${menu ? ' menu-open' : ''}`} id="efst" lang="is">
      <style>{CSS}</style>
      <PreviewChrome company={company} />
      <a className="skip" href="#efni">Fara í efni</a>

      <div className="xg-chrome" ref={chromeRef} data-hide="0" data-solid="0">
        <div className="bar">
          <div className="in">
            <a href={`tel:${CONTACT.tel}`}><Phone size={13} aria-hidden="true" />{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`} className="hide-s"><Mail size={13} aria-hidden="true" />{CONTACT.email}</a>
            <a href={CONTACT.map} target="_blank" rel="noopener" className="hide-s"><MapPin size={13} aria-hidden="true" />{CONTACT.street}, {CONTACT.town}</a>
            <span className={`st${sala.open ? ' on' : ''}`}><i aria-hidden="true" />Sýningarsalur: {sala.text.toLowerCase()}</span>
          </div>
        </div>
        <header className="hdr">
          <div className="plate base"><HeaderRow layer="base" focusKey={focusKey} onFocusKey={setFocusKey} onMenu={() => setMenu(true)} sub={sub} /></div>
          <div className="plate top" ref={topPlate} aria-hidden="true"><HeaderRow layer="top" focusKey={focusKey} onFocusKey={setFocusKey} onMenu={() => setMenu(true)} sub={sub} /></div>
        </header>
      </div>

      {menu && (
        <div className="xg-menu-panel" ref={menuRef} role="dialog" aria-modal="true" aria-label="Valmynd" data-lenis-prevent="">
          <div className="mtop">
            <img src={A('una-logo.png')} alt="Bílaumboðið Una" width={900} height={220} />
            <button type="button" className="mx" onClick={() => setMenu(false)} aria-label="Loka valmynd"><X size={24} strokeWidth={1.6} aria-hidden="true" /></button>
          </div>
          <nav aria-label="Valmynd">
            {[{ k: '', label: 'Forsíða' }, ...NAV, { k: 'reynsluakstur', label: 'Reynsluakstur' }, { k: 'innskipti', label: 'Bíllinn upp í' }].map((n) => (
              <Link key={n.k} to={to(n.k)} data-mi="" aria-current={page === n.k ? 'page' : undefined} onClick={() => setMenu(false)}>{n.label}</Link>
            ))}
          </nav>
          <div className="mfoot" data-mi="">
            <a href={`tel:${CONTACT.tel}`}><Phone size={18} aria-hidden="true" />{CONTACT.phone}</a>
            <button type="button" onClick={openChat}><MessageCircle size={16} aria-hidden="true" />Spyrja aðstoðarmanninn</button>
            <p>Sýningarsalur: virka daga kl. 9-17, laugardaga kl. 12-16</p>
          </div>
        </div>
      )}

      <main id="efni" key={loc.pathname}>
        {body}
      </main>

      <footer className="xg-foot on-dark" data-tone="dark">
        <div className="wrap fgrid">
          <div className="fbrand">
            <img src={A('una-logo-inchcape.png')} alt="Bílaumboðið Una, hluti af Inchcape" width={900} height={335} />
            <p>Umboðs- og þjónustuaðili fyrir XPENG á Íslandi. Sýningarsalur að Vínlandsleið 6-8.</p>
          </div>
          <nav className="fnav" aria-label="Neðst á síðu">
            {[...NAV, { k: 'reynsluakstur', label: 'Reynsluakstur' }].map((n) => <Link key={n.k} to={to(n.k)}>{n.label}</Link>)}
          </nav>
          <div className="fside">
            <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={CONTACT.map} target="_blank" rel="noopener">{CONTACT.street}, {CONTACT.town}</a>
            <a href={CONTACT.brand} target="_blank" rel="noopener">XPENG á Íslandi</a>
            <a href={CONTACT.instagram} target="_blank" rel="noopener">Instagram</a>
            <p className="brands">Sýningarsalur: virka daga 9-17, laugardaga 12-16.</p>
          </div>
        </div>
        <div className="wrap flegal">
          <p>{CONTACT.legal} · Kt. {CONTACT.kt} · <Link to={to('personuvernd')}>Persónuvernd</Link> · <Link to={to('afgreidsla')}>Afgreiðsla</Link></p>
          <p className="credit"><span>Hannað af</span><SndrBadge dark /></p>
        </div>
        <p className="wrap proto">Frumgerð: hugmynd að nýjum vef, ekki vefur Unu. Upplýsingar eru af bilaumbodiduna.is, xpeng.com/is og verðlista XPENG hjá Unu fyrir október 2026, sótt 11. október 2026. Verð geta breyst án fyrirvara. Myndir eru frá Unu og framleiðanda XPENG. Hleðsluáætlunin er útreikningur úr uppgefinni drægni og gögnum OpenStreetMap (ODbL), ekki mæling. Formin senda ekkert; beiðnir eru geymdar í þínum vafra. Aðstoðarmaðurinn svarar aðeins út frá því sem stendur á þessum vef.</p>
      </footer>

      <div className="xg-sticky" aria-label="Flýtileiðir">
        <a href={`tel:${CONTACT.tel}`}><Phone size={16} aria-hidden="true" />Hringja</a>
        <Link to={to('reynsluakstur')}>Reynsluakstur</Link>
        <button type="button" onClick={openChat}><MessageCircle size={16} aria-hidden="true" />Spyrja</button>
      </div>
    </div>
  )
}
