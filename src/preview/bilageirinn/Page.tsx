import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Check, MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  BRANDS,
  CLAIM_STEPS,
  CRAFT,
  CTA,
  EMAIL,
  FACILITY,
  GAUGES,
  HERO,
  HOURS,
  INSURANCE,
  LOGO,
  LUBE_PHONE_DISPLAY,
  LUBE_PHONE_HREF,
  MAPS,
  PHONE_DISPLAY,
  PHONE_HREF,
  SEO,
  SERVICES,
  STORY,
  TEAM,
  TRUST_STRIP,
} from './data'

const company = getPreviewCompany('bilageirinn')

/* ── TRUE LINE — bodywork is the art of bringing a damaged panel back to
      the one correct line it left the factory with. The founder is a master
      aircraft mechanic, so the visual language is a calibration instrument:
      blueprint linework, gauge sweeps, dimension arrows, mono spec labels.
      Shop-floor white ground, blueprint blue anchor, one amber needle. ─── */
const BASE = '#F2F4F5'
const BLUE = '#14335E'
const BLUE_DEEP = '#0E2647'
const INK = '#23262B'
const STEEL = '#8B95A1'
const AMBER = '#E8A23D'
const GREEN = '#2F7A55'
const MUT = '#49525C' /* 7.2:1 on BASE */
const PAPER_MUT = '#B9C4D1' /* 6.8:1 on BLUE */
const PAPER = '#F4F7FA'
const HAIR = 'rgba(35,38,43,0.14)'
const HAIR_BLUE = 'rgba(244,247,250,0.18)'

const DISPLAY = "'CabinetGrotesk-Black', 'Arial Black', sans-serif"
const EBOLD = "'CabinetGrotesk-Extrabold', 'Arial Black', sans-serif"
const BODY = "'Satoshi', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"

const B = import.meta.env.BASE_URL

const CSS = `
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-SemiBold.woff2') format('woff2'); font-weight: 600; font-style: normal; font-display: swap; }
@font-face { font-family: 'CabinetGrotesk-Extrabold'; src: url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Extrabold.woff2') format('woff2'), url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Extrabold.woff') format('woff'); font-weight: 800; font-style: normal; font-display: swap; }
@font-face { font-family: 'CabinetGrotesk-Black'; src: url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Black.woff2') format('woff2'), url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Black.woff') format('woff'); font-weight: 900; font-style: normal; font-display: swap; }

/* Base state = final state everywhere: content is never gated on a class.
   All motion lives inside the no-preference media query and uses fill-mode
   'both' so delays hold the FROM frame only when animating is allowed. */
@keyframes tlDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes tlFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes tlBelt { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes tlSweep { 0% { transform: rotate(-96deg); } 72% { transform: rotate(calc(var(--a) + 8deg)); } 100% { transform: rotate(var(--a)); } }
@keyframes tlRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes tlGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.tl-draw { stroke-dasharray: 1; stroke-dashoffset: 0; }
.tl-belt { transform-origin: left center; }
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
  .tl-go .tl-draw { animation: tlDraw 1.1s cubic-bezier(.45,.05,.25,1) both; animation-delay: var(--dd, 0s); }
  .tl-go .tl-fade { animation: tlFadeIn .6s ease both; animation-delay: var(--dd, 1.2s); }
  .tl-go .tl-belt { animation: tlBelt 1s cubic-bezier(.3,.9,.25,1) both; animation-delay: .95s; }
  .tl-go .tl-needle { animation: tlSweep 1.4s cubic-bezier(.4,1.2,.4,1) both; animation-delay: var(--dd, 0s); }
  .tl-go .tl-tick { animation: tlFadeIn .35s ease both; animation-delay: calc(var(--dd, 0s) + 1.15s); }
  .tl-go .tl-rise { animation: tlRise .7s cubic-bezier(.22,.8,.3,1) both; animation-delay: var(--rd, 0s); }
  .tl-go .tl-rule-line { animation: tlGrow .8s cubic-bezier(.45,.05,.25,1) both; }
  .tl-go .tl-rule-cap { animation: tlFadeIn .4s ease .65s both; }
}
.tl-btn { transition: background .18s ease, color .18s ease, transform .14s ease, border-color .18s ease; }
.tl-btn:active { transform: translateY(1px); }
.tl-btn:focus-visible, a:focus-visible, button:focus-visible { outline: 2px solid ${BLUE}; outline-offset: 3px; }
.tl-row { transition: background .2s ease; }
.tl-row:hover { background: rgba(20,51,94,0.05); }
.tl-navlink { transition: color .15s ease; }
.tl-navlink:hover { color: ${BLUE}; }
`

/* Adds .tl-go when the wrapper scrolls into view (once). Content is visible
   without it — the class only lets the enhancement animations run. */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setOn(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setOn(true)
            io.disconnect()
          }
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, on }
}

function Reveal({ id, className, style, children }: { id?: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  const { ref, on } = useInView<HTMLDivElement>()
  return (
    <div id={id} ref={ref} className={`${on ? 'tl-go' : ''} ${className ?? ''}`} style={style}>
      {children}
    </div>
  )
}

/* ── Engineering dimension rule: ⟨——— LABEL ———⟩. The section transitions
      "measure" themselves, echoing the CABAS measured assessment. ───────── */
function MeasureRule({ label, dark }: { label: string; dark?: boolean }) {
  const { ref, on } = useInView<HTMLDivElement>(0.6)
  const line = dark ? HAIR_BLUE : 'rgba(35,38,43,0.3)'
  const text = dark ? PAPER_MUT : MUT
  return (
    <div ref={ref} aria-hidden="true" className={`${on ? 'tl-go' : ''} mx-auto flex max-w-6xl items-center gap-3 px-5 md:px-8`}>
      <svg viewBox="0 0 8 10" className="tl-rule-cap h-2.5 w-2 shrink-0"><path d="M7 1 1 5l6 4" fill="none" stroke={line} strokeWidth="1.4" /></svg>
      <span className="tl-rule-line h-px flex-1" style={{ background: line, transformOrigin: 'right center' }} />
      <span className="min-w-0 text-center text-[11px] leading-relaxed font-medium tracking-[0.18em]" style={{ fontFamily: MONO, color: text }}>
        {label}
      </span>
      <span className="tl-rule-line h-px flex-1" style={{ background: line, transformOrigin: 'left center' }} />
      <svg viewBox="0 0 8 10" className="tl-rule-cap h-2.5 w-2 shrink-0"><path d="M1 1l6 4-6 4" fill="none" stroke={line} strokeWidth="1.4" /></svg>
    </div>
  )
}

/* ── Instrument gauge: needle sweeps to its reading, then a green
      in-spec tick settles beside the verified value. ────────────────────── */
function Gauge({ value, unit, label, angle, delay }: { value: string; unit?: string; label: string; angle: number; delay: number }) {
  const ticks = [-90, -60, -30, 0, 30, 60, 90].map((a) => {
    const r = (a * Math.PI) / 180
    const major = a % 90 === 0
    const r1 = major ? 52 : 55
    return { x1: 75 + r1 * Math.sin(r), y1: 80 - r1 * Math.cos(r), x2: 75 + 61 * Math.sin(r), y2: 80 - 61 * Math.cos(r) }
  })
  return (
    <div className="flex flex-col items-center gap-1.5 px-2 py-5">
      <svg viewBox="0 0 150 88" className="w-[120px] md:w-[132px]" aria-hidden="true">
        <path d="M14 80 A61 61 0 0 1 136 80" fill="none" stroke={STEEL} strokeWidth="1.5" />
        {ticks.map((t) => (
          <line key={t.x1} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={STEEL} strokeWidth="1.5" />
        ))}
        <g className="tl-needle" style={{ '--a': `${angle}deg`, '--dd': `${delay + 0.35}s`, transform: `rotate(${angle}deg)`, transformOrigin: '75px 80px', transformBox: 'view-box' } as CSSProperties}>
          <line x1="75" y1="80" x2="75" y2="27" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="75" cy="80" r="4.5" fill={INK} />
      </svg>
      <p className="flex items-baseline gap-1.5">
        <span className="text-[22px] font-semibold tabular-nums" style={{ fontFamily: MONO, color: INK }}>
          {value}
        </span>
        {unit ? (
          <span className="text-[13px]" style={{ fontFamily: MONO, color: MUT }}>
            {unit}
          </span>
        ) : null}
        <Check aria-hidden="true" className="tl-tick h-4 w-4 self-center" style={{ color: GREEN, '--dd': `${delay + 0.35}s` } as CSSProperties} strokeWidth={3} />
      </p>
      <p className="text-center text-[13px]" style={{ color: MUT }}>
        {label}
      </p>
    </div>
  )
}

/* ── The hero drawing: their trade as an annotated technical drawing. A car
      profile draws itself in blueprint linework, the amber TRUE line sweeps
      across the beltline and settles in-spec, and each verified service is
      pinned to the exact panel it belongs to. ─────────────────────────── */
const CAR_INK: string[] = [
  'M96 262 C88 246 92 226 112 216 C144 206 182 200 218 196 C254 172 290 150 334 142 C384 134 452 134 500 142 C542 150 566 170 592 190 C636 198 682 208 708 220 C724 228 728 248 718 262',
  'M100 268 L192 268',
  'M192 268 A58 58 0 1 1 308 268',
  'M308 268 L552 268',
  'M552 268 A58 58 0 1 1 668 268',
  'M668 268 L714 268',
]
const CAR_DETAIL: string[] = [
  'M338 148 L302 194', // A-pillar
  'M506 150 L574 191', // C-pillar
  'M302 194 L574 191', // window sill
  'M414 150 L414 265', // B-pillar / door seam
  'M498 196 L498 264', // rear door seam
  'M430 212 h24 M504 212 h20', // handles
  'M330 152 l-13 -9 h-11', // mirror
  'M100 220 L130 213', // headlight
  'M92 240 h22', // grille
  'M700 222 l16 -6', // tail lamp
]
const WHEELS = [
  { cx: 250, cy: 258 },
  { cx: 610, cy: 258 },
]
const CALLOUTS: { label: string; leader: string; node: [number, number]; x: number; y: number; anchor: 'start' | 'end' | 'middle' }[] = [
  { label: 'LJÓSASTILLING', leader: 'M112 210 L92 132 L36 132', node: [112, 213], x: 36, y: 122, anchor: 'start' },
  { label: 'BÍLAMÁLUN', leader: 'M418 138 L438 66 L494 66', node: [418, 140], x: 498, y: 70, anchor: 'start' },
  { label: 'RÉTTINGAR', leader: 'M688 212 L716 122 L800 122', node: [688, 215], x: 800, y: 112, anchor: 'end' },
  { label: 'HJÓLASTILLING', leader: 'M204 258 L150 258 L150 326', node: [208, 258], x: 150, y: 344, anchor: 'middle' },
  { label: 'BREMSUR · FJÖÐRUN', leader: 'M656 258 L710 258 L710 326', node: [652, 258], x: 710, y: 344, anchor: 'middle' },
]

function CarBlueprint() {
  return (
    <svg viewBox="0 0 840 380" className="w-full" role="img" aria-label="Tæknileg teikning af fólksbíl með þjónustu Bílageirans merkta á réttum stöðum">
      {/* datum ground */}
      <line className="tl-draw" pathLength={1} x1="40" y1="302" x2="800" y2="302" stroke={STEEL} strokeWidth="1.5" style={{ '--dd': '0s' } as CSSProperties} />
      <line className="tl-draw" pathLength={1} x1="40" y1="302" x2="800" y2="302" stroke={STEEL} strokeWidth="6" strokeDasharray="1.5 68" style={{ '--dd': '.1s' } as CSSProperties} />
      {/* body */}
      {CAR_INK.map((d, i) => (
        <path key={d} className="tl-draw" pathLength={1} d={d} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" style={{ '--dd': `${0.12 + i * 0.09}s` } as CSSProperties} />
      ))}
      {CAR_DETAIL.map((d, i) => (
        <path key={d} className="tl-draw" pathLength={1} d={d} fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" style={{ '--dd': `${0.55 + i * 0.05}s` } as CSSProperties} />
      ))}
      {/* calibration-target wheels */}
      {WHEELS.map((w, i) => (
        <g key={w.cx}>
          <circle className="tl-draw" pathLength={1} cx={w.cx} cy={w.cy} r="44" fill="none" stroke={INK} strokeWidth="2.2" style={{ '--dd': `${0.5 + i * 0.12}s` } as CSSProperties} />
          <circle className="tl-draw" pathLength={1} cx={w.cx} cy={w.cy} r="17" fill="none" stroke={INK} strokeWidth="1.6" style={{ '--dd': `${0.62 + i * 0.12}s` } as CSSProperties} />
          <path className="tl-draw" pathLength={1} d={`M${w.cx - 52} ${w.cy} H${w.cx + 52} M${w.cx} ${w.cy - 52} V${w.cy + 52}`} fill="none" stroke={STEEL} strokeWidth="1.3" style={{ '--dd': `${0.7 + i * 0.12}s` } as CSSProperties} />
          <circle cx={w.cx} cy={w.cy} r="3" fill={INK} />
        </g>
      ))}
      {/* THE TRUE LINE — amber beltline sweep, settles in-spec */}
      <g>
        <rect className="tl-belt" x="64" y="192.5" width="692" height="3" rx="1.5" fill={AMBER} />
        <g className="tl-fade max-sm:hidden" style={{ '--dd': '1.9s' } as CSSProperties}>
          <path d="M676 174 l5 5 9 -10" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="696" y="181" fontFamily={MONO} fontSize="13" letterSpacing="0.1em" fill={GREEN}>
            Í LÍNU
          </text>
        </g>
      </g>
      {/* service callouts pinned to their panels (hidden on very small screens) */}
      <g className="max-sm:hidden">
        {CALLOUTS.map((c, i) => (
          <g key={c.label}>
            <path className="tl-draw" pathLength={1} d={c.leader} fill="none" stroke={STEEL} strokeWidth="1.4" style={{ '--dd': `${1.15 + i * 0.12}s` } as CSSProperties} />
            <circle className="tl-fade" cx={c.node[0]} cy={c.node[1]} r="3.5" fill="none" stroke={AMBER} strokeWidth="2" style={{ '--dd': `${1.15 + i * 0.12}s` } as CSSProperties} />
            <text className="tl-fade" x={c.x} y={c.y} textAnchor={c.anchor} fontFamily={MONO} fontSize="13" fontWeight="500" letterSpacing="0.08em" fill={INK} style={{ '--dd': `${1.3 + i * 0.12}s` } as CSSProperties}>
              {c.label}
            </text>
          </g>
        ))}
        {/* wheelbase dimension — measured, like everything here */}
        <g className="tl-fade" style={{ '--dd': '1.8s' } as CSSProperties}>
          <path d="M250 310 V346 M610 310 V346" stroke={STEEL} strokeWidth="1.2" />
          <line x1="250" y1="340" x2="610" y2="340" stroke={STEEL} strokeWidth="1.4" />
          <path d="M250 340 l10 -4 M250 340 l10 4 M610 340 l-10 -4 M610 340 l-10 4" stroke={STEEL} strokeWidth="1.4" fill="none" />
          <text x="430" y="332" textAnchor="middle" fontFamily={MONO} fontSize="12" letterSpacing="0.12em" fill={MUT}>
            MÆLT OG SKRÁÐ Í CABAS
          </text>
        </g>
      </g>
    </svg>
  )
}

function SectionTitle({ children, dark, as: Tag = 'h2' }: { children: ReactNode; dark?: boolean; as?: 'h2' | 'h3' }) {
  return (
    <Tag className="tl-rise text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.04] tracking-tight text-balance" style={{ fontFamily: EBOLD, color: dark ? PAPER : INK }}>
      {children}
    </Tag>
  )
}

export default function BilageirinnPage() {
  useEffect(() => {
    document.title = SEO.title
    setThemeColor(BASE)
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'is'
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prev = meta.content
    meta.content = SEO.description
    return () => {
      document.documentElement.lang = prevLang
      if (created) meta?.remove()
      else if (meta) meta.content = prev
    }
  }, [])

  return (
    <div lang="is" className="min-h-[100svh] overflow-x-hidden antialiased" style={{ background: BASE, color: INK, fontFamily: BODY }}>
      <style>{CSS}</style>

      {/* ── Header — seamless, solid, phone-first ─────────────────────── */}
      <header className="sticky top-0 z-40" style={{ background: BASE, borderBottom: `1px solid ${HAIR}` }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
          <a href="#" className="flex min-h-11 flex-col justify-center leading-none" aria-label="Bílageirinn, efst á síðu">
            <span className="text-[22px] tracking-tight" style={{ fontFamily: DISPLAY, color: INK }}>
              Bílageirinn
            </span>
            <span className="mt-0.5 text-[9.5px] font-medium tracking-[0.32em]" style={{ fontFamily: MONO, color: MUT }}>
              BÍLAÞJÓNUSTA
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-[13px] font-medium lg:flex" aria-label="Aðalvalmynd">
            <a className="tl-navlink flex min-h-11 items-center" href="#thjonusta" style={{ color: MUT }}>Þjónusta</a>
            <a className="tl-navlink flex min-h-11 items-center" href="#tjonaferli" style={{ color: MUT }}>Tjónaferlið</a>
            <a className="tl-navlink flex min-h-11 items-center" href="#verkstaedid" style={{ color: MUT }}>Verkstæðið</a>
            <a className="tl-navlink flex min-h-11 items-center" href="#samband" style={{ color: MUT }}>Hafa samband</a>
          </nav>
          <a
            href={PHONE_HREF}
            className="tl-btn flex min-h-11 items-center gap-2 px-4 text-[14px] font-bold"
            style={{ background: BLUE, color: PAPER }}
            onMouseEnter={(e) => (e.currentTarget.style.background = BLUE_DEEP)}
            onMouseLeave={(e) => (e.currentTarget.style.background = BLUE)}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span style={{ fontFamily: MONO }}>{PHONE_DISPLAY}</span>
          </a>
        </div>
      </header>

      <main>
        {/* ── 1 · Hero — the instrument sweeps in ───────────────────────── */}
        <Reveal className="tl-go">
          <section className="mx-auto max-w-6xl px-5 pt-14 pb-6 md:px-8 md:pt-20" aria-label="Kynning">
            <div className="max-w-3xl">
              <h1 className="tl-rise text-[clamp(2.9rem,8.5vw,5.8rem)] leading-[0.98] tracking-tight text-balance" style={{ fontFamily: DISPLAY }}>
                {HERO.headline}
              </h1>
              <p className="tl-rise mt-5 max-w-[58ch] text-[17px] leading-relaxed md:text-lg" style={{ color: MUT, '--rd': '.12s' } as CSSProperties}>
                {HERO.sub}
              </p>
              <p className="tl-rise mt-5 flex items-center gap-2 text-[15px] font-medium" style={{ color: GREEN, '--rd': '.2s' } as CSSProperties}>
                <Check className="h-4.5 w-4.5 shrink-0" strokeWidth={3} aria-hidden="true" />
                {HERO.cert}
              </p>
              <div className="tl-rise mt-8 flex flex-wrap items-center gap-3" style={{ '--rd': '.28s' } as CSSProperties}>
                <a
                  href={PHONE_HREF}
                  className="tl-btn flex min-h-12 items-center gap-2.5 px-6 text-[15px] font-bold"
                  style={{ background: BLUE, color: PAPER }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = BLUE_DEEP)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = BLUE)}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {HERO.ctaPrimary}
                </a>
                <a
                  href="#thjonusta"
                  className="tl-btn flex min-h-12 items-center px-6 text-[15px] font-bold"
                  style={{ border: `1.5px solid ${INK}`, color: INK }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(35,38,43,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {HERO.ctaSecondary}
                </a>
              </div>
            </div>
            <div className="mt-10 md:mt-6">
              <CarBlueprint />
            </div>
            {/* verified readings */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4" style={{ borderTop: `1px solid ${HAIR}` }}>
              {GAUGES.map((g, i) => (
                <div
                  key={g.label}
                  className={`${i % 2 === 1 ? 'border-l' : ''} ${i === 2 ? 'md:border-l' : ''} ${i > 1 ? 'max-md:border-t' : ''}`}
                  style={{ borderColor: HAIR }}
                >
                  <Gauge value={g.value} unit={g.unit} label={g.label} angle={g.angle} delay={g.delay} />
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 2 · Trust strip ───────────────────────────────────────────── */}
        <section aria-label="Staðreyndir um verkstæðið" style={{ background: BLUE }}>
          <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-0 gap-y-1 px-5 py-4 md:px-8">
            {TRUST_STRIP.map((t, i) => (
              <li key={t} className="flex items-center px-4 py-1 text-[12.5px] font-medium tracking-[0.06em]" style={{ fontFamily: MONO, color: PAPER_MUT, borderLeft: i > 0 ? `1px solid ${HAIR_BLUE}` : 'none' }}>
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* ── 3 · The precision story ───────────────────────────────────── */}
        <Reveal>
          <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28" aria-label="Sagan">
            <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
              <div>
                <SectionTitle>{STORY.title}</SectionTitle>
                <p className="tl-rise mt-6 max-w-[62ch] text-[17px] leading-relaxed" style={{ '--rd': '.1s' } as CSSProperties}>
                  {STORY.lead}
                </p>
                <p className="tl-rise mt-4 max-w-[62ch] text-[17px] leading-relaxed" style={{ color: MUT, '--rd': '.18s' } as CSSProperties}>
                  {STORY.body}
                </p>
              </div>
              {/* vertical dimension timeline */}
              <ol className="tl-rise relative ml-2 flex flex-col gap-9 md:mt-2" style={{ '--rd': '.22s' } as CSSProperties}>
                <span aria-hidden="true" className="absolute top-1 bottom-1 left-0 w-px" style={{ background: 'rgba(35,38,43,0.3)' }} />
                {STORY.timeline.map((t) => (
                  <li key={t.year} className="relative pl-8">
                    <span aria-hidden="true" className="absolute top-[0.62em] left-0 h-px w-5" style={{ background: 'rgba(35,38,43,0.3)' }} />
                    <span aria-hidden="true" className="absolute top-[0.62em] left-0 h-px w-2 -translate-y-[3px] rotate-45" style={{ background: INK }} />
                    <p className="text-[15px] font-semibold tabular-nums" style={{ fontFamily: MONO, color: BLUE }}>
                      {t.year}
                    </p>
                    <p className="mt-1.5 max-w-[46ch] text-[15.5px] leading-relaxed" style={{ color: MUT }}>
                      {t.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </Reveal>

        <MeasureRule label="ÞJÓNUSTAN · 7 LIÐIR" />

        {/* ── 4 · Services as a spec sheet ──────────────────────────────── */}
        <Reveal id="thjonusta" className="scroll-mt-20">
          <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24" aria-label="Þjónusta">
            <SectionTitle>Allt sem bíllinn þarf, undir einu þaki</SectionTitle>
            <div className="tl-rise mt-10" style={{ borderTop: `1.5px solid ${INK}`, '--rd': '.12s' } as CSSProperties}>
              {SERVICES.map((s) => (
                <div key={s.name} className="tl-row grid gap-x-8 gap-y-1.5 py-5 md:grid-cols-[240px_1fr_150px] md:items-baseline md:py-6" style={{ borderBottom: `1px solid ${HAIR}` }}>
                  <h3 className="text-xl tracking-tight md:text-[22px]" style={{ fontFamily: EBOLD }}>
                    {s.name}
                  </h3>
                  <p className="max-w-[58ch] text-[15.5px] leading-relaxed" style={{ color: MUT }}>
                    {s.desc}
                  </p>
                  <p className="text-[11.5px] font-medium tracking-[0.14em] md:text-right" style={{ fontFamily: MONO, color: BLUE }}>
                    {s.tag}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 5 · Toyota + Kia ──────────────────────────────────────────── */}
        <Reveal>
          <section style={{ background: BLUE }} aria-label="Toyota og Kia viðurkenning">
            <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1fr_1fr] md:items-center md:gap-16 md:px-8 md:py-28">
              <div>
                <p className="tl-rise flex flex-col text-[clamp(3.4rem,9vw,6.2rem)] leading-[0.95] tracking-tight" aria-hidden="true" style={{ fontFamily: DISPLAY, color: PAPER }}>
                  <span>TOYOTA</span>
                  <span className="flex items-center gap-4">
                    KIA
                    <svg viewBox="0 0 90 24" className="mt-2 h-5 w-auto shrink-0 md:h-6">
                      <line x1="2" y1="12" x2="88" y2="12" stroke={AMBER} strokeWidth="2" />
                      <path d="M2 12 l10 -5 M2 12 l10 5 M88 12 l-10 -5 M88 12 l-10 5" stroke={AMBER} strokeWidth="2" fill="none" />
                    </svg>
                  </span>
                </p>
                <p className="tl-rise mt-5 inline-flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium tracking-[0.14em]" style={{ fontFamily: MONO, color: '#8FD6B2', border: '1px solid rgba(143,214,178,0.4)', '--rd': '.15s' } as CSSProperties}>
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                  VIÐURKENNT ÞJÓNUSTUVERKSTÆÐI
                </p>
              </div>
              <div>
                <SectionTitle dark>{BRANDS.title}</SectionTitle>
                <p className="tl-rise mt-6 max-w-[56ch] text-[16.5px] leading-relaxed" style={{ color: PAPER_MUT, '--rd': '.1s' } as CSSProperties}>
                  {BRANDS.body}
                </p>
                <p className="tl-rise mt-4 max-w-[56ch] text-[15px] leading-relaxed" style={{ color: PAPER_MUT, '--rd': '.18s' } as CSSProperties}>
                  {BRANDS.note}
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── 6 · The craft / paint booth ───────────────────────────────── */}
        <Reveal>
          <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28" aria-label="Handverkið">
            <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
              {/* spray-fan calibration graphic */}
              <svg viewBox="0 0 300 240" className="tl-rise mx-auto w-full max-w-[300px] md:mt-2" aria-hidden="true">
                <circle className="tl-draw" pathLength={1} cx="60" cy="170" r="14" fill="none" stroke={INK} strokeWidth="2.2" style={{ '--dd': '.1s' } as CSSProperties} />
                <path className="tl-draw" pathLength={1} d="M60 156 V132 M48 170 H24 M60 184 V208" fill="none" stroke={STEEL} strokeWidth="1.4" style={{ '--dd': '.25s' } as CSSProperties} />
                {[-28, -14, 0, 14, 28].map((o, i) => (
                  <line key={o} className="tl-draw" pathLength={1} x1="74" y1={170 + o / 2.4} x2="272" y2={170 + o * 2.6} stroke={i === 2 ? AMBER : STEEL} strokeWidth={i === 2 ? 2.4 : 1.4} style={{ '--dd': `${0.35 + i * 0.09}s` } as CSSProperties} />
                ))}
                <path className="tl-fade" d="M262 30 l5 5 9 -10" fill="none" stroke={GREEN} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ '--dd': '.9s' } as CSSProperties} />
                <text className="tl-fade" x="140" y="36" textAnchor="middle" fontFamily={MONO} fontSize="12" letterSpacing="0.14em" fill={MUT} style={{ '--dd': '.85s' } as CSSProperties}>
                  JÖFN DREIFING · RÉTT ÞYKKT
                </text>
              </svg>
              <div>
                <SectionTitle>{CRAFT.title}</SectionTitle>
                <p className="tl-rise mt-6 max-w-[60ch] text-[17px] leading-relaxed" style={{ color: MUT, '--rd': '.1s' } as CSSProperties}>
                  {CRAFT.body}
                </p>
                <ul className="tl-rise mt-7 flex flex-col gap-3" style={{ '--rd': '.18s' } as CSSProperties}>
                  {CRAFT.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-[15.5px] font-medium">
                      <Check className="h-4.5 w-4.5 shrink-0" style={{ color: GREEN }} strokeWidth={3} aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </Reveal>

        <MeasureRule label="TJÓNAFERLIÐ · FRÁ TJÓNI Í RÉTTA LÍNU" />

        {/* ── 7 · CABAS claims journey ──────────────────────────────────── */}
        <Reveal id="tjonaferli" className="scroll-mt-20">
          <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24" aria-label="Tjónaferlið">
            <SectionTitle>Tjón þarf ekki að vera vesen</SectionTitle>
            <p className="tl-rise mt-5 max-w-[62ch] text-[17px] leading-relaxed" style={{ color: MUT, '--rd': '.08s' } as CSSProperties}>
              Ferlið er alltaf það sama, mælt og skráð frá fyrsta símtali þar til bíllinn fer aftur út í umferð.
            </p>
            <ol className="tl-rise mt-12 grid gap-y-10 md:grid-cols-4 md:gap-x-0" style={{ '--rd': '.15s' } as CSSProperties}>
              {CLAIM_STEPS.map((s, i) => (
                <li key={s.title} className="relative flex flex-col md:px-6 md:first:pl-0 md:last:pr-0">
                  {/* connector: horizontal dimension arrow on desktop */}
                  {i > 0 ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="absolute -top-1 left-0 hidden h-5 w-5 -translate-x-1/2 md:block">
                      <path d="M4 12 h16 M20 12 l-7 -5 M20 12 l-7 5" fill="none" stroke={STEEL} strokeWidth="1.8" />
                    </svg>
                  ) : null}
                  <p className="text-[11.5px] font-medium tracking-[0.18em]" style={{ fontFamily: MONO, color: s.highlight ? '#8A5A10' : MUT }}>
                    SKREF {i + 1} / {CLAIM_STEPS.length}
                  </p>
                  <h3 className="mt-3 text-[21px] leading-tight tracking-tight" style={{ fontFamily: EBOLD, color: s.highlight ? BLUE : INK }}>
                    {s.title}
                  </h3>
                  <p className="mt-2.5 max-w-[38ch] text-[15px] leading-relaxed" style={{ color: MUT }}>
                    {s.desc}
                  </p>
                  {s.highlight ? (
                    <p className="mt-4 inline-flex w-fit items-center gap-2 px-3 py-1.5 text-[11.5px] font-semibold tracking-[0.1em]" style={{ fontFamily: MONO, background: 'rgba(232,162,61,0.16)', color: '#7A5210' }}>
                      ÞÚ VERÐUR EKKI BÍLLAUS
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        </Reveal>

        {/* ── 8 · Insurance partner strip ───────────────────────────────── */}
        <Reveal>
          <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8 md:pb-28" aria-label="Tryggingafélög">
            <div className="grid gap-8 pt-14 md:grid-cols-[1fr_1.3fr] md:gap-16" style={{ borderTop: `1px solid ${HAIR}` }}>
              <div>
                <SectionTitle as="h3">{INSURANCE.title}</SectionTitle>
                <p className="tl-rise mt-5 max-w-[52ch] text-[16px] leading-relaxed" style={{ color: MUT, '--rd': '.1s' } as CSSProperties}>
                  {INSURANCE.body}
                </p>
              </div>
              <ul className="tl-rise flex flex-wrap content-start items-center gap-x-9 gap-y-6 md:justify-end md:pt-3" style={{ '--rd': '.16s' } as CSSProperties}>
                {INSURANCE.companies.map((c) => (
                  <li key={c} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4" style={{ color: GREEN }} strokeWidth={3} aria-hidden="true" />
                    <span className="text-[26px] tracking-tight md:text-[30px]" style={{ fontFamily: EBOLD, color: INK }}>
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>

        <MeasureRule label="FÓLKIÐ Á GÓLFINU" />

        {/* ── 9 · Team ──────────────────────────────────────────────────── */}
        <Reveal>
          <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24" aria-label="Starfsfólk">
            <SectionTitle>Þrjú nöfn sem þú lærir fljótt</SectionTitle>
            <div className="tl-rise mt-10" style={{ borderTop: `1.5px solid ${INK}`, '--rd': '.12s' } as CSSProperties}>
              {TEAM.map((p) => (
                <div key={p.name} className="tl-row grid gap-x-8 gap-y-1 py-6 md:grid-cols-[1.2fr_1fr] md:items-baseline" style={{ borderBottom: `1px solid ${HAIR}` }}>
                  <h3 className="text-[22px] tracking-tight md:text-2xl" style={{ fontFamily: EBOLD }}>
                    {p.name}
                  </h3>
                  <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 md:justify-end">
                    <p className="text-[12px] font-medium tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: BLUE }}>
                      {p.role}
                    </p>
                    {p.detail ? (
                      <p className="flex items-center gap-1.5 text-[14px] font-medium" style={{ color: GREEN }}>
                        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                        {p.detail}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <MeasureRule label="GRÓFIN 14A · 230 REYKJANESBÆR" />

        {/* ── 10 · Facility + data plate ────────────────────────────────── */}
        <Reveal id="verkstaedid" className="scroll-mt-20">
          <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24" aria-label="Verkstæðið og staðsetning">
            <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
              <div>
                <SectionTitle>{FACILITY.title}</SectionTitle>
                <p className="tl-rise mt-6 max-w-[60ch] text-[17px] leading-relaxed" style={{ color: MUT, '--rd': '.1s' } as CSSProperties}>
                  {FACILITY.body}
                </p>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noreferrer"
                  className="tl-btn tl-rise mt-7 inline-flex min-h-12 items-center gap-2.5 px-6 text-[15px] font-bold"
                  style={{ border: `1.5px solid ${INK}`, color: INK, '--rd': '.18s' } as CSSProperties}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(35,38,43,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Sjá á korti
                </a>
                <div className="tl-rise mt-10 flex items-center gap-4" style={{ '--rd': '.24s' } as CSSProperties}>
                  <img src={LOGO} alt="Merki Bílageirans" width={194} height={113} className="h-14 w-auto bg-white p-2" style={{ border: `1px solid ${HAIR}` }} loading="lazy" />
                  <p className="text-[12px] leading-relaxed" style={{ fontFamily: MONO, color: MUT }}>
                    Merki verkstæðisins
                    <br />
                    síðan 2003
                  </p>
                </div>
              </div>
              {/* machine data plate */}
              <div className="tl-rise" style={{ border: `1.5px solid ${INK}`, '--rd': '.2s' } as CSSProperties}>
                <p className="px-5 py-3 text-[11.5px] font-semibold tracking-[0.2em]" style={{ fontFamily: MONO, background: INK, color: PAPER }}>
                  BÍLAGEIRINN EHF · UPPLÝSINGASKILTI
                </p>
                <dl>
                  {[
                    { k: 'Heimilisfang', v: `${ADDRESS.street}, ${ADDRESS.town}` },
                    { k: 'Verkstæði', v: PHONE_DISPLAY, href: PHONE_HREF },
                    { k: 'Smurstöð', v: LUBE_PHONE_DISPLAY, href: LUBE_PHONE_HREF },
                    { k: 'Netfang', v: EMAIL, href: `mailto:${EMAIL}` },
                  ].map((r) => (
                    <div key={r.k} className="flex items-center justify-between gap-4 px-5 py-1.5" style={{ borderBottom: `1px solid ${HAIR}` }}>
                      <dt className="text-[13px] font-medium" style={{ color: MUT }}>
                        {r.k}
                      </dt>
                      <dd className="text-right text-[14px] font-semibold break-words" style={{ fontFamily: MONO, overflowWrap: 'anywhere' }}>
                        {r.href ? (
                          <a href={r.href} className="tl-navlink inline-flex min-h-11 items-center" style={{ color: BLUE }}>
                            {r.v}
                          </a>
                        ) : (
                          r.v
                        )}
                      </dd>
                    </div>
                  ))}
                  {HOURS.map((h) => (
                    <div key={h.days} className="flex items-center justify-between gap-4 px-5 py-3.5" style={{ borderBottom: `1px solid ${HAIR}` }}>
                      <dt className="text-[13px] font-medium" style={{ color: MUT }}>
                        {h.days}
                      </dt>
                      <dd className="text-[14px] font-semibold tabular-nums" style={{ fontFamily: MONO, color: h.close ? INK : MUT }}>
                        {h.close ? `${h.open}–${h.close}` : h.open}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.12em]" style={{ fontFamily: MONO, color: GREEN }}>
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                  AÐILI AÐ BÍLGREINASAMBANDINU
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── 11 · Contact CTA — phone-first ────────────────────────────── */}
        <Reveal id="samband" className="scroll-mt-20">
          <section style={{ background: BLUE }} aria-label="Hafa samband">
            <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center md:px-8 md:py-28">
              <SectionTitle dark>{CTA.title}</SectionTitle>
              <p className="tl-rise mt-4 max-w-[52ch] text-[16.5px] leading-relaxed" style={{ color: PAPER_MUT, '--rd': '.08s' } as CSSProperties}>
                {CTA.body}
              </p>
              <a href={PHONE_HREF} className="tl-rise tl-navlink mt-8 inline-block px-4 py-2 text-[clamp(3rem,11vw,5.6rem)] leading-none tracking-tight tabular-nums" style={{ fontFamily: DISPLAY, color: AMBER, '--rd': '.14s' } as CSSProperties}>
                421 6901
              </a>
              <div className="tl-rise mt-6 flex flex-col items-center gap-2 text-[13.5px]" style={{ fontFamily: MONO, color: PAPER_MUT, '--rd': '.2s' } as CSSProperties}>
                <p>
                  Smurstöðin:{' '}
                  <a href={LUBE_PHONE_HREF} className="tl-navlink inline-flex min-h-11 items-center font-semibold" style={{ color: PAPER }}>
                    436 6901
                  </a>
                </p>
                <p>
                  <a href={`mailto:${EMAIL}`} className="tl-navlink inline-flex min-h-11 items-center underline decoration-1 underline-offset-4" style={{ color: PAPER }}>
                    {EMAIL}
                  </a>
                </p>
                <p className="mt-2">Mán–fim 08:00–17:00 · Fös 08:00–15:00 · Lokað um helgar</p>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      {/* page footer bar + shared prototype disclaimer */}
      <div className="px-5 py-5 text-center text-[11px] tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT, borderTop: `1px solid ${HAIR}` }}>
        FRUMGERÐ · SNDR STUDIO
      </div>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
