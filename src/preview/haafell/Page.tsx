import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import { ArrowRight, Clock, MapPin, Ticket } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import {
  BOOKING,
  BOOKING_PRICES,
  FARM,
  FARM_SECTION,
  HERO,
  HERO_ID,
  KID_ID,
  LAND_ID,
  SHOP,
  STORY,
  TRUST,
  UI,
  VISIT,
} from './data'
import type { Lang, LocPair, Product } from './data'

const company = getPreviewCompany('haafell')

/* ────────────────────────────────────────────────────────────────────
   FARM ALMANAC design system.
   Type: Telma (warm flare serif, display) + Cabinet Grotesk (body/UI) —
   self-hosted kits under public/fonts. Surfaces follow a color-block
   chapter rhythm: oat-paper canvas → deep spruce story band → paper →
   meadow wash → paper → spruce closing bookend. Key imagery sits in
   softly rounded frames; buttons are
   full pills. The lineage line is the page's centerpiece, drawn in hay
   gold on the dark band.
   ──────────────────────────────────────────────────────────────────── */

const PAPER = '#f4f0e6' // oat paper canvas
const SPRUCE = '#22372b' // deep spruce (story band)
const SPRUCE_DEEP = '#182a1f' // closing bookend
const PASTURE = '#5f7138' // pasture green accent (CTAs, links)
const MEADOW = '#e7ebd9' // pale meadow wash surface
const STRAW = '#d9b779' // hay gold (chart line, dark-band CTA)
const BARN = '#9a4730' // barn red (tagline, warm moments)
const BARN_SOFT = '#e0906d' // danger notes on dark ground
const INK = '#20281e' // green-black ink
const CREAM = '#f6f2e7' // text on dark ground

const FONTS = `${import.meta.env.BASE_URL}fonts`
/** Telma is a calligraphic script serif — reserved for BRAND VOICE moments
 *  only (masthead, nav mark, the farmers' signature, closing line). All
 *  structural headings run Cabinet Grotesk Extrabold. */
const SCRIPT = "'Telma-Bold', 'Bricolage Grotesque', serif"
const SCRIPT_BLACK = "'Telma-Black', 'Bricolage Grotesque', serif"
const HEADING = "'CabinetGrotesk-Extrabold', 'Hanken Grotesk', system-ui, sans-serif"
const BODY = "'CabinetGrotesk-Regular', 'Hanken Grotesk', system-ui, sans-serif"
const BODY_MED = "'CabinetGrotesk-Medium', 'Hanken Grotesk', system-ui, sans-serif"
const BODY_BOLD = "'CabinetGrotesk-Bold', 'Hanken Grotesk', system-ui, sans-serif"

const Q = '&auto=format&fit=crop'

/** Pick the active language string from a bilingual pair. */
const L = (p: LocPair, lang: Lang) => p[lang]

const PAGE_CSS = `
@import url('${FONTS}/telma/css/telma.css');
@import url('${FONTS}/cabinet-grotesk/css/cabinet-grotesk.css');

.haafell-page { font-family: ${BODY}; }
.haafell-pill { transition: transform .22s cubic-bezier(.22,.9,.28,1), box-shadow .22s cubic-bezier(.22,.9,.28,1), background-color .22s ease, color .22s ease; }
.haafell-pill:hover { transform: translateY(-2px); }
.haafell-pill:active { transform: scale(.97); }
.haafell-cta-primary:hover { background: ${SPRUCE} !important; box-shadow: 0 14px 30px -14px ${SPRUCE}; }
.haafell-cta-straw:hover { background: ${CREAM} !important; }
.haafell-navlink { position: relative; transition: color .2s ease; }
.haafell-navlink::after { content: ''; position: absolute; left: 0; right: 100%; bottom: -3px; height: 2px; background: ${PASTURE}; transition: right .25s cubic-bezier(.22,.9,.28,1); }
.haafell-navlink:hover::after { right: 0; }
.haafell-frame img { transition: transform .8s cubic-bezier(.22,.9,.28,1); }
.haafell-dot { animation: haafell-pulse 2.4s ease-in-out infinite; }
@keyframes haafell-pulse { 0%, 100% { box-shadow: 0 0 0 0 ${PASTURE}52; } 50% { box-shadow: 0 0 0 7px transparent; } }
.haafell-step { width: 34px; height: 34px; border-radius: 999px; background: ${PASTURE}1f; color: ${INK}; font-size: 19px; line-height: 1; font-family: ${BODY_BOLD}; transition: background-color .15s ease, transform .15s ease; }
.haafell-step:hover:not(:disabled) { background: ${PASTURE}38; }
.haafell-step:active:not(:disabled) { transform: scale(.92); }
.haafell-step:disabled { opacity: .35; }
.haafell-input { background: #fff; box-shadow: inset 0 0 0 1.5px ${INK}26; color: ${INK}; font-family: ${BODY_MED}; }
.haafell-input:focus-visible, .haafell-step:focus-visible { outline: 2px solid ${PASTURE}; outline-offset: 2px; }
@media (hover: hover) and (pointer: fine) {
  .haafell-frame:hover img { transform: scale(1.04); }
}
/* Rise reveal — CSS transitions sample by wall-clock time, so a throttled
   or frame-starved renderer can never freeze content mid-fade. */
.haafell-rise { opacity: 0; transform: translateY(var(--rise-y, 18px)); transition: opacity .75s cubic-bezier(.22,.9,.28,1), transform .75s cubic-bezier(.22,.9,.28,1); }
.haafell-rise.is-in { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .haafell-pill, .haafell-pill:hover, .haafell-pill:active { transform: none; transition: none; }
  .haafell-frame img, .haafell-frame:hover img { transform: none; transition: none; }
  .haafell-dot { animation: none; }
  .haafell-step, .haafell-step:active:not(:disabled) { transform: none; transition: none; }
  .haafell-navlink::after { transition: none; }
  .haafell-rise { opacity: 1; transform: none; transition: none; }
}
`

/* ── Reduced-motion preference (no framer dependency) ──────────────── */

function useReducedMotion() {
  const [reduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  return reduce
}

/* ── Gentle rise-in — IntersectionObserver toggles a class; the actual
      motion is a pure CSS transition (see .haafell-rise) so content can
      never be stuck invisible by a frame-starved renderer. ───────────── */

function Rise({
  children,
  delay = 0,
  y = 18,
  className,
  onMount = false,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  /** Above-the-fold content: reveal on mount, not on scroll. */
  onMount?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (onMount) {
      // setTimeout (not rAF) so the flip happens even when frames stall.
      const t = window.setTimeout(() => setInView(true), 30)
      return () => window.clearTimeout(t)
    }
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '-8% 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [onMount])

  return (
    <div
      ref={ref}
      className={`haafell-rise${inView ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--rise-y': `${y}px`, transitionDelay: delay ? `${delay}s` : undefined } as CSSProperties}
    >
      {children}
    </div>
  )
}

/* ── SIGNATURE: the lineage / survival line ────────────────────────────
   A population curve drawn as you scroll: a long steady plateau, a crash
   into the near-extinction band, then the climb back. Staged on the dark
   spruce band and drawn in hay gold. The draw is driven by a manual
   passive scroll listener (rAF-throttled); reduced motion renders it
   fully drawn and static. Labelled as illustrative in the UI (honesty).
   ──────────────────────────────────────────────────────────────────── */

const VB_W = 1000
const VB_H = 300
const PAD = { l: 92, r: 28, t: 26, b: 30 }
const PLOT_W = VB_W - PAD.l - PAD.r
const PLOT_H = VB_H - PAD.t - PAD.b

const px = (t: number) => PAD.l + t * PLOT_W
const py = (pop: number) => PAD.t + (1 - pop) * PLOT_H

const ERA_X = [0.0, 0.46, 0.64, 0.78, 1.0]
const ERA_POP = [0.8, 0.82, 0.14, 0.3, 0.62]

// Smooth Catmull-Rom-ish path through the era anchors, built once.
const LINE_D = (() => {
  const pts = ERA_X.map((t, i) => [px(t), py(ERA_POP[i])] as const)
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2 >= pts.length ? pts.length - 1 : i + 2]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
})()

const DANGER_X0 = px(0.55)
const DANGER_X1 = px(0.72)
const DANGER_TOP = py(0.26)

function LineageLine({ lang }: { lang: Lang }) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [len, setLen] = useState(0)
  const [progress, setProgress] = useState(reduce ? 1 : 0)
  const ticking = useRef(false)

  useEffect(() => {
    const p = pathRef.current
    if (p) setLen(p.getTotalLength())
  }, [])

  // Remap the figure's viewport travel [0.18 .. 0.72] → [0 .. 1] so the
  // line completes while the chart sits comfortably in view, then holds.
  useEffect(() => {
    if (reduce) {
      setProgress(1)
      return
    }
    const el = wrapRef.current
    if (!el) return
    const compute = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const raw = (vh - r.top) / (vh + r.height)
      const mapped = (raw - 0.18) / (0.72 - 0.18)
      setProgress(Math.min(1, Math.max(0, mapped)))
    }
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        compute()
        ticking.current = false
      })
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduce])

  const dashOffset = len ? len * (1 - progress) : 0
  const tip = pathRef.current && len ? pathRef.current.getPointAtLength(len * progress) : null
  const troughIn = reduce || progress > 0.62
  const riseIn = reduce || progress > 0.9

  return (
    <div ref={wrapRef} className="relative mt-12 md:mt-16">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="block w-full overflow-visible"
        role="img"
        aria-label={
          lang === 'is'
            ? 'Skýringarmynd: stofninn hélst stöðugur í aldir, hrundi nær útrýmingu á 20. öld og rís nú aftur.'
            : 'Illustrative timeline: the breed held steady for centuries, crashed near extinction in the 20th century, and is now rising again.'
        }
      >
        <defs>
          <linearGradient id="haafell-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={STRAW} stopOpacity="0.22" />
            <stop offset="100%" stopColor={STRAW} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={PAD.l} x2={VB_W - PAD.r} y1={py(g)} y2={py(g)} stroke={CREAM} strokeOpacity="0.09" strokeWidth="1" />
        ))}

        <text x={26} y={py(0.5)} fill={CREAM} fillOpacity="0.72" fontSize="15" fontFamily={BODY_MED}
          transform={`rotate(-90 26 ${py(0.5)})`} textAnchor="middle">
          {L(STORY.axisLabel, lang)}
        </text>
        <text x={PAD.l - 12} y={py(0.96)} fill={CREAM} fillOpacity="0.5" fontSize="13" fontFamily={BODY} textAnchor="end">
          {L(STORY.axisHigh, lang)}
        </text>
        <text x={PAD.l - 12} y={py(0.06) + 4} fill={CREAM} fillOpacity="0.5" fontSize="13" fontFamily={BODY} textAnchor="end">
          {L(STORY.axisLow, lang)}
        </text>

        {/* near-extinction danger band */}
        <rect x={DANGER_X0} y={DANGER_TOP} width={DANGER_X1 - DANGER_X0} height={VB_H - PAD.b - DANGER_TOP} fill={BARN_SOFT} opacity="0.08" />
        <line x1={DANGER_X0} x2={DANGER_X1} y1={DANGER_TOP} y2={DANGER_TOP} stroke={BARN_SOFT} strokeOpacity="0.55" strokeWidth="1.4" strokeDasharray="4 5" />
        <text x={(DANGER_X0 + DANGER_X1) / 2} y={DANGER_TOP - 8} fill={BARN_SOFT} fontSize="13" fontFamily={BODY_BOLD} textAnchor="middle" letterSpacing="0.02em">
          {L(STORY.dangerLabel, lang)}
        </text>

        {/* faint full guide so the line has a ghost before it draws */}
        <path d={LINE_D} fill="none" stroke={CREAM} strokeOpacity="0.14" strokeWidth="2.5" strokeLinecap="round" />

        <path
          d={`${LINE_D} L ${px(1)} ${py(0)} L ${px(0)} ${py(0)} Z`}
          fill="url(#haafell-fill)"
          style={{ opacity: reduce ? 1 : Math.min(1, progress * 1.4) }}
        />

        {/* the survival line itself */}
        <path
          ref={pathRef}
          d={LINE_D}
          fill="none"
          stroke={STRAW}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: len || undefined,
            strokeDashoffset: len ? dashOffset : undefined,
          }}
        />

        {ERA_X.map((t, i) => (
          <circle key={t} cx={px(t)} cy={py(ERA_POP[i])} r="3.6" fill={SPRUCE} stroke={CREAM} strokeOpacity="0.55" strokeWidth="1.6" />
        ))}

        {tip && progress > 0.01 && progress < 0.999 && (
          <>
            {!reduce && <circle cx={tip.x} cy={tip.y} r="11" fill={STRAW} opacity="0.22" />}
            <circle cx={tip.x} cy={tip.y} r="6.5" fill={STRAW} stroke={SPRUCE} strokeWidth="2.6" />
          </>
        )}

        <g style={{ opacity: troughIn ? 1 : 0, transition: 'opacity .5s ease' }}>
          <text x={px(0.635)} y={py(0.14) + 30} fill={BARN_SOFT} fontSize="14" fontFamily={BODY_MED} textAnchor="middle">
            {L(STORY.troughNote, lang)}
          </text>
        </g>
        <g style={{ opacity: riseIn ? 1 : 0, transition: 'opacity .5s ease' }}>
          <text x={px(0.99)} y={py(0.62) - 16} fill={STRAW} fontSize="14" fontFamily={BODY_MED} textAnchor="end">
            {L(STORY.riseNote, lang)}
          </text>
        </g>
      </svg>

      {/* era marks under the line, aligned to their x-position on the curve */}
      <style>{`
        .haafell-mark-stagger { top: 0; }
        @media (max-width: 639px) {
          .haafell-mark-stagger { top: 1.75rem; }
          .haafell-marks-wrap { height: 5rem !important; }
        }
      `}</style>
      <div className="haafell-marks-wrap relative mt-3 h-12 sm:h-11" aria-hidden="true">
        {STORY.marks.map((m, i) => {
          const first = i === 0
          const last = i === STORY.marks.length - 1
          const stagger = !first && !last && i % 2 === 1
          const leftPct = (PAD.l + ERA_X[i] * PLOT_W) / VB_W * 100
          return (
            <div
              key={m.year}
              className={`absolute ${stagger ? 'haafell-mark-stagger' : 'top-0'} ${first ? 'text-left' : last ? '-translate-x-full text-right' : '-translate-x-1/2 text-center'}`}
              style={{ left: `${leftPct}%` }}
            >
              <span className="block text-[11px]" style={{ color: STRAW, fontFamily: BODY_BOLD }}>
                {m.year}
              </span>
              <span className="mt-0.5 block max-w-[5.5rem] text-[10px] leading-tight sm:text-[11px]" style={{ color: `${CREAM}b8`, fontFamily: BODY_MED }}>
                {L(m.t, lang)}
              </span>
            </div>
          )
        })}
      </div>
      <ul className="sr-only" lang={lang}>
        {STORY.marks.map((m) => (
          <li key={m.year}>
            {m.year}: {L(m.t, lang)}
          </li>
        ))}
      </ul>

      {/* honesty caption — the chart is illustrative, not exact figures */}
      <p className="mt-6 text-center text-[12px]" style={{ color: `${CREAM}80` }}>
        {L(STORY.timelineLabel, lang)}
      </p>
    </div>
  )
}

/* ── Language toggle ───────────────────────────────────────────────── */

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div
      role="group"
      aria-label={L(UI.toggleLabel, lang)}
      className="inline-flex items-center rounded-full p-0.5 text-xs"
      style={{ background: '#ffffffb8', boxShadow: `inset 0 0 0 1px ${INK}26`, fontFamily: BODY_BOLD }}
    >
      {(['is', 'en'] as const).map((code) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className="haafell-pill min-h-[36px] rounded-full px-3 py-1.5 uppercase tracking-wide focus-visible:outline-2"
            style={{
              background: active ? PASTURE : 'transparent',
              color: active ? '#fff' : INK,
            }}
            lang={code}
          >
            {code === 'is' ? 'IS' : 'EN'}
            <span className="sr-only">: {L(UI.langName, code)}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ── Product card (typographic, honest — no fake product photos) ───── */

const TINTS: Record<Product['tint'], { bg: string; name: string; body: string; price: string }> = {
  meadow: { bg: MEADOW, name: INK, body: `${INK}b8`, price: PASTURE },
  straw: { bg: '#efe3c6', name: INK, body: `${INK}b8`, price: BARN },
  ceramic: { bg: '#ece7db', name: INK, body: `${INK}b8`, price: PASTURE },
  spruce: { bg: SPRUCE, name: CREAM, body: `${CREAM}b8`, price: STRAW },
}

/* ── Live open-status chip ──────────────────────────────────────────
   Season: 1 June – 31 August, 11:00–18:00 daily, computed in farm time
   (Atlantic/Reykjavik). Off-season shows "by arrangement" — matching
   VISIT.hoursNote — rather than a cold "closed". ───────────────────── */

type OpenState = 'open' | 'today' | 'tomorrow' | 'off'

function stateFor(month: number, hour: number): OpenState {
  if (month < 6 || month > 8) return 'off'
  if (hour >= 11 && hour < 18) return 'open'
  return hour < 11 ? 'today' : 'tomorrow'
}

function getOpenState(): OpenState {
  const now = new Date()
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Atlantic/Reykjavik',
      month: 'numeric',
      hour: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(now)
    const month = Number(parts.find((p) => p.type === 'month')?.value)
    const hour = Number(parts.find((p) => p.type === 'hour')?.value)
    if (Number.isNaN(month) || Number.isNaN(hour)) throw new Error('parts')
    return stateFor(month, hour)
  } catch {
    // visitor-local time as a fallback — close enough for a status hint
    return stateFor(now.getMonth() + 1, now.getHours())
  }
}

function OpenChip({ lang }: { lang: Lang }) {
  const [state] = useState<OpenState>(getOpenState)
  const label =
    state === 'open'
      ? BOOKING.status.open
      : state === 'today'
        ? BOOKING.status.opensToday
        : state === 'tomorrow'
          ? BOOKING.status.opensTomorrow
          : BOOKING.status.offSeason
  const dot = state === 'open' ? PASTURE : state === 'off' ? BARN : STRAW
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px]"
      style={{ background: '#ffffffcc', boxShadow: `inset 0 0 0 1px ${INK}21`, color: INK, fontFamily: BODY_MED }}
    >
      <span
        aria-hidden="true"
        className={state === 'open' ? 'haafell-dot' : undefined}
        style={{ width: 8, height: 8, borderRadius: 999, background: dot, flexShrink: 0 }}
      />
      {L(label, lang)}
    </span>
  )
}

/* ── Booking request card ───────────────────────────────────────────
   Date + party-size steppers with a live price total; submit opens a
   pre-filled email to the farm (no backend in the prototype, and the
   card says so honestly). Admission stays paid-on-site. ────────────── */

function Stepper({
  label,
  value,
  setValue,
  min,
  lang,
}: {
  label: string
  value: number
  setValue: (n: number) => void
  min: number
  lang: Lang
}) {
  return (
    <div
      className="flex min-h-[52px] items-center justify-between gap-3 rounded-[14px] py-2 pl-4 pr-2"
      style={{ background: '#fff', boxShadow: `inset 0 0 0 1.5px ${INK}26` }}
    >
      <span className="text-[14.5px] leading-tight" style={{ fontFamily: BODY_MED, color: INK }}>
        {label}
      </span>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          className="haafell-step"
          aria-label={`${L(BOOKING.decrease, lang)}: ${label}`}
          onClick={() => setValue(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          −
        </button>
        <span className="w-8 text-center text-[17px]" style={{ fontFamily: HEADING, color: INK }}>
          {value}
        </span>
        <button
          type="button"
          className="haafell-step"
          aria-label={`${L(BOOKING.increase, lang)}: ${label}`}
          onClick={() => setValue(Math.min(30, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  )
}

function BookingCard({ lang }: { lang: Lang }) {
  const [date, setDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')

  const total = adults * BOOKING_PRICES.adult + children * BOOKING_PRICES.child
  // manual grouping — is-IS locale data is missing in some environments
  const fmt = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'is' ? '.' : ',')} kr`
  const today = new Date().toISOString().slice(0, 10)

  const labelStyle: CSSProperties = { fontFamily: BODY_BOLD, color: `${INK}99` }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const M = BOOKING.mailLines
    const body = [
      `${L(M.date, lang)}: ${date}`,
      `${L(M.adults, lang)}: ${adults}`,
      `${L(M.children, lang)}: ${children}`,
      `${L(M.name, lang)}: ${name}`,
      `${L(M.contact, lang)}: ${contact}`,
      `${L(M.total, lang)}: ${fmt(total)}`,
    ].join('\n')
    window.location.href = `mailto:${FARM.email}?subject=${encodeURIComponent(L(BOOKING.subject, lang))}&body=${encodeURIComponent(body)}`
  }

  return (
    <div
      id="boka"
      className="mt-14 scroll-mt-24 overflow-hidden rounded-[26px]"
      style={{ background: PAPER, boxShadow: `0 26px 64px -38px ${SPRUCE}bb` }}
    >
      <form onSubmit={onSubmit} className="grid md:grid-cols-[1.05fr_0.95fr]">
        {/* left: the request */}
        <div className="p-6 sm:p-8 md:p-10">
          <h3 className="text-[26px]" style={{ fontFamily: HEADING, color: INK }}>
            {L(BOOKING.title, lang)}
          </h3>
          <p className="mt-2 max-w-md text-[14.5px] leading-relaxed" style={{ color: `${INK}b3` }}>
            {L(BOOKING.intro, lang)}
          </p>

          <div className="mt-7 space-y-4">
            <div>
              <label htmlFor="boka-date" className="mb-1.5 block text-[13px]" style={labelStyle}>
                {L(BOOKING.dateLabel, lang)}
              </label>
              <input
                id="boka-date"
                type="date"
                required
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="haafell-input min-h-[52px] w-full appearance-none rounded-[14px] px-4 text-[15px]"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Stepper label={L(BOOKING.adultsLabel, lang)} value={adults} setValue={setAdults} min={1} lang={lang} />
              <Stepper label={L(BOOKING.childrenLabel, lang)} value={children} setValue={setChildren} min={0} lang={lang} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="boka-name" className="mb-1.5 block text-[13px]" style={labelStyle}>
                  {L(BOOKING.nameLabel, lang)}
                </label>
                <input
                  id="boka-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="haafell-input min-h-[52px] w-full rounded-[14px] px-4 text-[15px]"
                />
              </div>
              <div>
                <label htmlFor="boka-contact" className="mb-1.5 block text-[13px]" style={labelStyle}>
                  {L(BOOKING.contactLabel, lang)}
                </label>
                <input
                  id="boka-contact"
                  type="text"
                  required
                  autoComplete="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="haafell-input min-h-[52px] w-full rounded-[14px] px-4 text-[15px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* right: live summary + submit, on the dark spruce ground */}
        <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10" style={{ background: SPRUCE }}>
          <div>
            <p className="text-[13px] uppercase tracking-[0.12em]" style={{ color: `${CREAM}8c`, fontFamily: BODY_BOLD }}>
              {L(BOOKING.summaryTitle, lang)}
            </p>
            <dl className="mt-5 space-y-3" aria-live="polite">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[15px]" style={{ color: `${CREAM}cc` }}>
                  {adults} × {L(BOOKING.adultsLabel, lang)}
                </dt>
                <dd className="text-[16px]" style={{ fontFamily: HEADING, color: CREAM }}>
                  {fmt(adults * BOOKING_PRICES.adult)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[15px]" style={{ color: `${CREAM}cc` }}>
                  {children} × {L(BOOKING.childrenLabel, lang)}
                </dt>
                <dd className="text-[16px]" style={{ fontFamily: HEADING, color: CREAM }}>
                  {fmt(children * BOOKING_PRICES.child)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t pt-4" style={{ borderColor: `${CREAM}26` }}>
                <dt className="text-[15px]" style={{ color: CREAM, fontFamily: BODY_BOLD }}>
                  {L(BOOKING.totalLabel, lang)}
                </dt>
                <dd className="text-[26px] leading-none" style={{ fontFamily: HEADING, color: STRAW }}>
                  {fmt(total)}
                </dd>
              </div>
            </dl>
            <p className="mt-2 text-right text-[12.5px]" style={{ color: `${CREAM}8c` }}>
              {L(BOOKING.totalNote, lang)}
            </p>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="haafell-pill haafell-cta-straw inline-flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-full px-7 text-[15px] focus-visible:outline-2"
              style={{ background: STRAW, color: INK, fontFamily: BODY_BOLD }}
            >
              {L(BOOKING.submit, lang)}
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
            <p className="mt-3 text-center text-[12.5px] leading-relaxed" style={{ color: `${CREAM}8c` }}>
              {L(BOOKING.mailNote, lang)}
            </p>
            <p className="mt-5 text-center text-[13.5px]" style={{ color: `${CREAM}b8` }}>
              {L(BOOKING.altContact, lang)}{' '}
              <a href={`tel:${FARM.phoneTel}`} className="rounded underline underline-offset-4 focus-visible:outline-2" style={{ color: CREAM, fontFamily: BODY_BOLD }}>
                {L(VISIT.callLabel, lang)}
              </a>
              {' · '}
              <a href={`mailto:${FARM.email}`} className="rounded underline underline-offset-4 focus-visible:outline-2" style={{ color: CREAM, fontFamily: BODY_BOLD }}>
                {L(VISIT.emailLabel, lang)}
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────────────────────────────── */

export default function Page() {
  const reduce = useReducedMotion()
  const [lang, setLang] = useState<Lang>('is')
  const [showBar, setShowBar] = useState(false)
  const [heroShift, setHeroShift] = useState(0)
  const ticking = useRef(false)

  useEffect(() => {
    document.title = 'Háafell Geitfjársetur'
  }, [])

  useEffect(() => {
    const prev = document.documentElement.lang
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = prev
    }
  }, [lang])

  // Mobile sticky CTA + transform-only hero drift from one rAF-throttled
  // passive listener (decorative; skipped when reduced).
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setShowBar(y > 640)
        if (!reduce) setHeroShift(Math.min(44, y * 0.05))
        ticking.current = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduce])

  const nav = [
    { href: '#story', label: UI.nav.story },
    { href: '#farm', label: UI.nav.farm },
    { href: '#visit', label: UI.nav.visit },
    { href: '#shop', label: UI.nav.shop },
  ]

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Háafell Geitfjársetur, Hvítársíða')}`

  const h2Style: CSSProperties = {
    fontFamily: HEADING,
    color: INK,
    fontSize: 'clamp(2.1rem, 5vw, 3.3rem)',
    lineHeight: 1.06,
    letterSpacing: '-0.01em',
  }

  return (
    <div
      id="top"
      lang={lang}
      className="haafell-page min-h-screen antialiased"
      style={{ background: PAPER, color: INK }}
    >
      <PreviewChrome company={company} />
      <style>{PAGE_CSS}</style>

      {/* skip link */}
      <a
        href="#story"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[70] focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        style={{ background: PASTURE, fontFamily: BODY_BOLD }}
      >
        {L(UI.skipToContent, lang)}
      </a>

      {/* ── Header / nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ borderColor: `${INK}1c`, background: `${PAPER}e0` }}>
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-3 md:px-8">
          <a href="#top" className="flex items-baseline gap-2 rounded focus-visible:outline-2">
            <span className="text-[22px]" style={{ fontFamily: SCRIPT, color: INK }}>
              Háafell
            </span>
            <span className="hidden text-[11px] tracking-[0.14em] uppercase sm:inline" style={{ color: PASTURE, fontFamily: BODY_BOLD }} lang="is">
              Geitfjársetur
            </span>
          </a>
          {/* on mobile the links drop to a second, full-width centered row */}
          <div className="order-3 flex w-full items-center justify-center gap-6 md:order-none md:w-auto md:justify-start md:gap-7">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="haafell-navlink rounded text-[14px] focus-visible:outline-2 md:text-[15px]" style={{ color: INK, fontFamily: BODY_MED }}>
                {L(n.label, lang)}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <LangToggle lang={lang} setLang={setLang} />
            <a
              href="#visit"
              className="haafell-pill haafell-cta-primary hidden min-h-[40px] items-center gap-1.5 rounded-full px-4 text-sm text-white focus-visible:outline-2 sm:inline-flex"
              style={{ background: PASTURE, fontFamily: BODY_BOLD }}
            >
              {L(UI.planVisit, lang)}
            </a>
          </div>
        </nav>
      </header>

      <main className="relative z-10 overflow-x-clip">
        {/* ── HERO — editorial split, rounded portrait ───────────── */}
        <section className="relative">
          <div className="mx-auto grid max-w-6xl items-end gap-10 px-5 pt-10 pb-14 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:px-8 md:pt-16 md:pb-20">
            <div className="pb-2 md:pb-10">
              <Rise onMount>
                <p className="text-[15px]" style={{ color: PASTURE, fontFamily: BODY_BOLD }}>
                  {L(HERO.eyebrow, lang)}
                </p>
              </Rise>
              <Rise delay={0.06} onMount>
                <h1
                  className="mt-4"
                  style={{
                    fontFamily: SCRIPT_BLACK,
                    color: INK,
                    fontSize: 'clamp(2.6rem, 8.5vw, 5.6rem)',
                    lineHeight: 1.02,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Háafell
                  <span className="block" style={{ color: PASTURE }}>
                    Geitfjársetur
                  </span>
                </h1>
              </Rise>
              <Rise delay={0.12} onMount>
                <p className="mt-6 max-w-md" style={{ color: BARN, fontFamily: HEADING, fontSize: 'clamp(1.3rem, 3.6vw, 1.6rem)', lineHeight: 1.25 }}>
                  {L(HERO.tagline, lang)}
                </p>
              </Rise>
              <Rise delay={0.18} onMount>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed" style={{ color: `${INK}d0` }}>
                  {L(HERO.lede, lang)}
                </p>
              </Rise>
              <Rise delay={0.24} onMount>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#visit"
                    className="haafell-pill haafell-cta-primary inline-flex min-h-[52px] items-center gap-2.5 rounded-full px-7 text-[15px] text-white focus-visible:outline-2"
                    style={{ background: PASTURE, fontFamily: BODY_BOLD, boxShadow: `0 12px 26px -14px ${SPRUCE}` }}
                  >
                    {L(UI.planVisit, lang)}
                    <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </a>
                  <a
                    href="#story"
                    className="haafell-navlink rounded text-[15px] focus-visible:outline-2"
                    style={{ color: INK, fontFamily: BODY_BOLD }}
                  >
                    {L(UI.nav.story, lang)}
                  </a>
                </div>
                <div className="mt-5">
                  <OpenChip lang={lang} />
                </div>
              </Rise>
            </div>

            {/* rounded hero portrait with a gentle upward drift */}
            <Rise delay={0.1} y={30} onMount>
              <div
                className="haafell-frame relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[22px]"
                style={{
                  boxShadow: `0 30px 70px -34px ${SPRUCE}cc`,
                  transform: `translate3d(0, ${-heroShift}px, 0)`,
                  willChange: 'transform',
                }}
              >
                <Img
                  src={`https://images.unsplash.com/${HERO_ID}?w=880&q=75${Q}`}
                  alt={L(HERO.imageAlt, lang)}
                  className="aspect-[3/4] w-full object-cover"
                  fetchpriority="high"
                  fallbackClassName="bg-gradient-to-b from-[#d9b779] to-[#5f7138]"
                />
              </div>
            </Rise>
          </div>
        </section>

        {/* ── STORY — the dark spruce chapter with the lineage line ── */}
        <section id="story" className="scroll-mt-20" style={{ background: SPRUCE }}>
          <div className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-32">
            <Rise>
              <h2
                className="max-w-3xl"
                style={{
                  fontFamily: HEADING,
                  color: CREAM,
                  fontSize: 'clamp(2.3rem, 6vw, 3.8rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.01em',
                }}
              >
                {L(STORY.heading, lang)}
              </h2>
            </Rise>

            <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-14">
              <Rise delay={0.06}>
                <p className="text-[17px] leading-relaxed" style={{ color: `${CREAM}e6` }}>
                  {L(STORY.paras[0], lang)}
                </p>
              </Rise>
              <div className="space-y-6">
                {STORY.paras.slice(1).map((p, i) => (
                  <Rise key={i} delay={0.12 + i * 0.06}>
                    <p className="text-[15px] leading-relaxed" style={{ color: `${CREAM}bf` }}>
                      {L(p, lang)}
                    </p>
                  </Rise>
                ))}
              </div>
            </div>

            <LineageLine lang={lang} />
          </div>
        </section>

        {/* ── FARM — the people, asymmetric composition ────────────── */}
        <section id="farm" className="scroll-mt-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:px-8 md:py-32">
            <Rise y={26}>
              <div className="haafell-frame mx-auto max-w-[420px] overflow-hidden rounded-[22px]" style={{ boxShadow: `0 26px 60px -30px ${SPRUCE}bb` }}>
                <Img
                  src={`https://images.unsplash.com/${KID_ID}?w=800&q=80${Q}`}
                  alt={L(FARM_SECTION.imageAlt, lang)}
                  className="aspect-[3/4] w-full object-cover"
                  fallbackClassName="bg-gradient-to-b from-[#d9b779] to-[#5f7138]"
                />
              </div>
            </Rise>

            <div>
              <Rise>
                <h2 style={h2Style}>{L(FARM_SECTION.heading, lang)}</h2>
              </Rise>
              {FARM_SECTION.body.map((p, i) => (
                <Rise key={i} delay={0.06 + i * 0.06}>
                  <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed" style={{ color: `${INK}d0` }}>
                    {L(p, lang)}
                  </p>
                </Rise>
              ))}
              <Rise delay={0.2}>
                <p className="mt-6 text-[15px]">
                  <span style={{ color: `${INK}8c`, fontFamily: BODY_MED }}>{L(FARM_SECTION.ownersLabel, lang)}</span>
                  <span className="mt-0.5 block text-[17px]" style={{ color: PASTURE, fontFamily: SCRIPT }} lang="is">
                    {FARM.owners}
                  </span>
                </p>
              </Rise>
              <Rise delay={0.26}>
                <dl className="mt-8 flex divide-x border-t pt-6" style={{ borderColor: `${INK}1f` }}>
                  {FARM_SECTION.stats.map((s) => (
                    <div key={s.v} className="flex-1 px-4 first:pl-0 last:pr-0" style={{ borderColor: `${INK}1f` }}>
                      <dt className="text-[26px] leading-none" style={{ fontFamily: HEADING, color: INK }}>
                        {s.v}
                      </dt>
                      <dd className="mt-1.5 text-[12.5px] leading-snug" style={{ color: `${INK}a6`, fontFamily: BODY_MED }}>
                        {L(s.t, lang)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Rise>
            </div>
          </div>
        </section>

        {/* ── VISIT — almanac spread on the meadow wash ────────────── */}
        <section id="visit" className="scroll-mt-20" style={{ background: MEADOW }}>
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-32">
            <Rise>
              <h2 style={h2Style}>{L(VISIT.heading, lang)}</h2>
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed" style={{ color: `${INK}cc` }}>
                {L(VISIT.intro, lang)}
              </p>
            </Rise>

            <div className="mt-12 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
              {/* the almanac list */}
              <div className="divide-y" style={{ borderColor: `${INK}1f` }}>
                <Rise>
                  <div className="flex gap-4 pb-7">
                    <Clock className="mt-1 h-5 w-5 shrink-0" strokeWidth={1.5} style={{ color: PASTURE }} aria-hidden="true" />
                    <div>
                      <h3 className="text-[19px]" style={{ fontFamily: HEADING, color: INK }}>
                        {L(VISIT.hoursTitle, lang)}
                      </h3>
                      <p className="mt-1.5 text-[15.5px]" style={{ color: INK, fontFamily: BODY_MED }}>
                        {L(VISIT.hoursMain, lang)} · {L(VISIT.hoursTime, lang)}
                      </p>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: `${INK}99` }}>
                        {L(VISIT.hoursNote, lang)}
                      </p>
                      <div className="mt-3">
                        <OpenChip lang={lang} />
                      </div>
                    </div>
                  </div>
                </Rise>
                <Rise delay={0.06}>
                  <div className="flex gap-4 py-7">
                    <Ticket className="mt-1 h-5 w-5 shrink-0" strokeWidth={1.5} style={{ color: PASTURE }} aria-hidden="true" />
                    <div className="flex-1">
                      <h3 className="text-[19px]" style={{ fontFamily: HEADING, color: INK }}>
                        {L(VISIT.priceTitle, lang)}
                      </h3>
                      <ul className="mt-2 max-w-xs space-y-1.5">
                        {VISIT.prices.map((p) => (
                          <li key={p.amount} className="flex items-baseline justify-between gap-4">
                            <span className="text-[15px]" style={{ color: `${INK}cc` }}>
                              {L(p.who, lang)}
                            </span>
                            <span className="text-[17px]" style={{ fontFamily: HEADING, color: INK }}>
                              {p.amount}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2.5 text-[13px] leading-relaxed" style={{ color: `${INK}99` }}>
                        {L(VISIT.priceFoot, lang)}
                      </p>
                    </div>
                  </div>
                </Rise>
                <Rise delay={0.12}>
                  <div className="flex gap-4 pt-7">
                    <MapPin className="mt-1 h-5 w-5 shrink-0" strokeWidth={1.5} style={{ color: PASTURE }} aria-hidden="true" />
                    <div>
                      <h3 className="text-[19px]" style={{ fontFamily: HEADING, color: INK }}>
                        {L(VISIT.getThereTitle, lang)}
                      </h3>
                      <address className="mt-1.5 text-[15.5px] not-italic" style={{ color: INK, fontFamily: BODY_MED }} lang="is">
                        {FARM.addressLines.join(', ')}
                      </address>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: `${INK}99` }}>
                        {L(VISIT.getThereBody, lang)}
                      </p>
                    </div>
                  </div>
                </Rise>
              </div>

              {/* designed route map — origin → via towns → Háafell pin */}
              <Rise delay={0.08}>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="group block h-full overflow-hidden rounded-[22px] focus-visible:outline-2"
                  style={{ boxShadow: `inset 0 0 0 1px ${INK}1f`, background: PAPER }}
                  aria-label={`${L(VISIT.openInMaps, lang)}: ${FARM.addressLines.join(', ')}`}
                >
                  <div className="relative h-full min-h-[340px] w-full">
                    {/* Portrait atlas-page map: the journey reads upward, out of
                        town and into Hvítársíða. viewBox is near-square so the
                        route never crops inside the tall panel. */}
                    <svg viewBox="0 0 1000 950" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
                      <rect width="1000" height="950" fill={`${PASTURE}0f`} />
                      {[140, 300, 460, 620, 780].map((y, i) => (
                        <path
                          key={y}
                          d={`M0 ${y} C 220 ${y - 34 - i * 4}, 460 ${y + 30}, 680 ${y - 22}, 1000 ${y + 14}`}
                          fill="none"
                          stroke={INK}
                          strokeOpacity="0.1"
                          strokeWidth="2"
                        />
                      ))}
                      <path d="M-20 900 C 240 880, 420 910, 640 860 C 800 824, 900 840, 1020 800" fill="none" stroke={PASTURE} strokeOpacity="0.28" strokeWidth="9" strokeLinecap="round" />
                      {/* the route: Reykjavík (bottom left) → Háafell (top right) */}
                      <path d="M150 750 C 300 690, 390 610, 500 520 C 620 410, 700 300, 830 180" fill="none" stroke={STRAW} strokeWidth="11" strokeLinecap="round" />
                      <path d="M150 750 C 300 690, 390 610, 500 520 C 620 410, 700 300, 830 180" fill="none" stroke={INK} strokeOpacity="0.4" strokeWidth="2.4" strokeDasharray="3 14" strokeLinecap="round" />

                      <circle cx="150" cy="750" r="10" fill={PAPER} stroke={INK} strokeWidth="3.5" />
                      <g transform="translate(150 750)">
                        <rect x="22" y="-21" rx="17" ry="17" width="156" height="42" fill="#ffffffe6" />
                        <text x="41" y="7" fill={INK} fontSize="21" fontFamily={BODY_BOLD}>{L(VISIT.routeFrom, lang)}</text>
                      </g>

                      <circle cx="500" cy="520" r="7.5" fill={PAPER} stroke={INK} strokeWidth="3" />
                      <text x="530" y="528" fill={`${INK}b3`} fontSize="19" fontFamily={BODY_MED}>
                        {L(VISIT.routeVia, lang)}
                      </text>

                      {/* destination pin — outer <g> positions, inner <g> lifts on hover */}
                      <g transform="translate(830 180)">
                        <g className="origin-center transition-transform duration-300 group-hover:[transform:translateY(-4px)]">
                          <circle cx="0" cy="0" r="24" fill={SPRUCE} />
                          <circle cx="0" cy="0" r="24" fill="none" stroke={STRAW} strokeOpacity="0.7" strokeWidth="3" />
                          <circle cx="0" cy="0" r="7" fill={STRAW} />
                          <rect x="-52" y="32" rx="15" ry="15" width="104" height="36" fill="#ffffffe6" />
                          <text x="0" y="57" fill={INK} fontSize="21" fontFamily={BODY_BOLD} textAnchor="middle">Háafell</text>
                        </g>
                      </g>
                    </svg>

                    <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11.5px]" style={{ color: INK, fontFamily: BODY_MED }}>
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                      {L(VISIT.mapNote, lang)} · {L(FARM.driveFromReykjavik, lang)}
                    </div>
                    <div className="absolute bottom-3 right-3 hidden items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[11.5px] transition-colors group-hover:bg-white sm:flex" style={{ color: PASTURE, fontFamily: BODY_BOLD }}>
                      {L(VISIT.openInMaps, lang)}
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                </a>
              </Rise>
            </div>

            {/* booking request card (call/email live inside it as the fallback) */}
            <Rise delay={0.12}>
              <BookingCard lang={lang} />
            </Rise>
          </div>
        </section>

        {/* ── SHOP — typographic farm-shop shelf ───────────────────── */}
        <section id="shop" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-32">
            <Rise>
              <h2 style={h2Style}>{L(SHOP.heading, lang)}</h2>
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed" style={{ color: BARN, fontFamily: BODY_MED }}>
                {L(SHOP.mission, lang)}
              </p>
            </Rise>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SHOP.products.map((p, i) => {
                const t = TINTS[p.tint]
                return (
                  <Rise key={p.name} delay={i * 0.06} y={22}>
                    <article
                      className="haafell-pill flex h-full min-h-[240px] flex-col justify-between rounded-[22px] p-6"
                      style={{ background: t.bg }}
                    >
                      <div>
                        <h3 className="text-[24px] leading-[1.1]" style={{ fontFamily: HEADING, color: t.name }} lang="is">
                          {p.name}
                        </h3>
                        <p className="mt-1 text-[12.5px]" style={{ color: t.price, fontFamily: BODY_BOLD }}>
                          {L(p.gloss, lang)}
                        </p>
                        <p className="mt-3 text-[13.5px] leading-relaxed" style={{ color: t.body }}>
                          {L(p.desc, lang)}
                        </p>
                      </div>
                      <p className="mt-5 text-[22px]" style={{ fontFamily: HEADING, color: t.name }}>
                        {p.price}
                      </p>
                    </article>
                  </Rise>
                )
              })}
            </div>

            {/* order intent + sample-price honesty note */}
            <Rise delay={0.1}>
              <div className="mt-8 flex flex-col items-start gap-4 rounded-[22px] p-6 sm:flex-row sm:items-center sm:justify-between" style={{ background: `${PASTURE}14`, boxShadow: `inset 0 0 0 1px ${PASTURE}33` }}>
                <p className="max-w-md text-[14px] leading-relaxed" style={{ color: `${INK}cc` }}>
                  <span style={{ fontFamily: BODY_BOLD, color: INK }}>{L(SHOP.priceNote, lang)}.</span>{' '}
                  {L(SHOP.orderNote, lang)}
                </p>
                <a
                  href={`mailto:${FARM.email}?subject=${encodeURIComponent(L(SHOP.orderSubject, lang))}`}
                  className="haafell-pill haafell-cta-primary inline-flex min-h-[50px] shrink-0 items-center gap-2 rounded-full px-6 text-[15px] text-white focus-visible:outline-2"
                  style={{ background: PASTURE, fontFamily: BODY_BOLD }}
                >
                  {L(SHOP.orderCta, lang)}
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </a>
              </div>
            </Rise>
          </div>
        </section>

        {/* ── CLOSING — the dark bookend ────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ background: SPRUCE_DEEP }}>
          <Img
            src={`https://images.unsplash.com/${LAND_ID}?w=1400&q=70${Q}`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
            fallbackClassName="bg-gradient-to-br from-[#182a1f] to-[#22372b]"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${SPRUCE_DEEP}d9, ${SPRUCE_DEEP}f5)` }} aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-5 py-24 text-center md:px-8 md:py-36">
            <Rise>
              <h2
                className="mx-auto max-w-2xl"
                style={{ fontFamily: SCRIPT, color: CREAM, fontSize: 'clamp(2.1rem, 5.6vw, 3.4rem)', lineHeight: 1.08 }}
              >
                {L(TRUST.line, lang)}
              </h2>
              <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed" style={{ color: `${CREAM}cc` }}>
                {L(TRUST.sub, lang)}
              </p>
              <a
                href="#visit"
                className="haafell-pill haafell-cta-straw mt-9 inline-flex min-h-[54px] items-center gap-2.5 rounded-full px-8 text-[15px] focus-visible:outline-2"
                style={{ background: STRAW, color: INK, fontFamily: BODY_BOLD }}
              >
                {L(UI.planVisit, lang)}
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </a>
            </Rise>
          </div>
        </section>
      </main>

      {/* ── Mobile sticky CTA (clears chrome corner buttons) ────── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 px-4 pb-3 transition-all duration-300 md:hidden ${
          showBar ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
        }`}
        aria-hidden={!showBar}
      >
        <a
          href="#boka"
          tabIndex={showBar ? 0 : -1}
          className="mr-[5.5rem] flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 text-sm text-white shadow-xl focus-visible:outline-2"
          style={{ background: PASTURE, fontFamily: BODY_BOLD, boxShadow: `0 12px 30px -10px ${SPRUCE}` }}
        >
          <Ticket className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          {L(BOOKING.title, lang)}
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
