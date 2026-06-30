import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Clock, Mail, MapPin, Phone, Ticket } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import {
  FARM,
  FARM_ID,
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

/* ── Warm earthy palette (the brief) ───────────────────────────────── */
const CREAM = '#f4ede0' // milk cream ground
const STRAW = '#d9b779' // hay / straw
const GREEN = '#5f7138' // pasture green (accent)
const BARN = '#9a4730' // barn red (secondary warm)
const EARTH = '#6b4a2f' // earth
const INK = '#2b2419' // text

const Q = '&auto=format&fit=crop'

/** Pick the active language string from a bilingual pair. */
const L = (p: LocPair, lang: Lang) => p[lang]

/* ────────────────────────────────────────────────────────────────────
   Motion language — "the herd settles". Everything rises a touch and
   eases in; nothing slides or springs harshly. The SIGNATURE is the
   lineage line (see <LineageLine/>), a single continuous path that
   draws as you scroll: steady for centuries, a frightening near-flat
   crash, then a hopeful climb back. Reduced motion shows it complete.
   ──────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 0.78, 0.3, 1] as const

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
  /** Above-the-fold content: animate on mount and never gate opacity on rAF
      (a stalled background tab would otherwise leave the hero invisible). */
  onMount?: boolean
}) {
  const reduce = useReducedMotion()
  const trigger = onMount
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-10% 0px -8% 0px' } }
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1, y: 0 } : onMount ? { opacity: 1, y } : { opacity: 0, y }}
      {...trigger}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ── A small friendly goat that gently peeks / bobs (decorative) ───── */

function GoatPeek({ flip = false, color = GREEN, className = 'h-12 w-12' }: { flip?: boolean; color?: string; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      initial={reduce ? false : { y: 0, rotate: 0 }}
      animate={reduce ? undefined : { y: [0, -3, 0], rotate: [0, -2, 0] }}
      transition={reduce ? undefined : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* head */}
      <path
        d="M20 30c0-9 5-15 12-15s12 6 12 15c0 8-5 14-12 14s-12-6-12-14z"
        fill={CREAM}
        stroke={color}
        strokeWidth="2.4"
      />
      {/* ears */}
      <path d="M20 28c-6-2-9 0-10 4 4 2 8 1 11-1z" fill={CREAM} stroke={color} strokeWidth="2.2" />
      <path d="M44 28c6-2 9 0 10 4-4 2-8 1-11-1z" fill={CREAM} stroke={color} strokeWidth="2.2" />
      {/* horns */}
      <path d="M26 16c-2-5-1-9 1-11M38 16c2-5 1-9-1-11" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="27" cy="31" r="2.1" fill={INK} />
      <circle cx="37" cy="31" r="2.1" fill={INK} />
      {/* nose + smile */}
      <path d="M29 39h6" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M28 36q4 3 8 0" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* beard */}
      <path d="M32 43c0 4-1 7-2 9 2-1 3-3 4-5 0 2 0 3-1 5 2-2 3-5 3-9z" fill={STRAW} />
    </motion.svg>
  )
}

/* ── Product glyphs (no stock food photos — warm SVG marks) ────────── */

function ProductGlyph({ kind }: { kind: Product['glyph'] }) {
  const common = { fill: 'none', stroke: EARTH, strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 56 56" className="h-11 w-11" aria-hidden="true">
      {kind === 'cheese' && (
        <>
          <path d="M8 38l34-16 6 10-34 16z" fill={STRAW} stroke={EARTH} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M8 38l34-16" {...common} />
          <circle cx="20" cy="32" r="2.2" fill={CREAM} />
          <circle cx="30" cy="30" r="1.8" fill={CREAM} />
          <circle cx="26" cy="37" r="1.6" fill={CREAM} />
        </>
      )}
      {kind === 'wheel' && (
        <>
          <ellipse cx="28" cy="22" rx="18" ry="7" fill={STRAW} stroke={EARTH} strokeWidth="2.2" />
          <path d="M10 22v10c0 3.9 8 7 18 7s18-3.1 18-7V22" {...common} />
          <path d="M22 26l4 4 4-6 4 5" {...common} />
        </>
      )}
      {kind === 'soap' && (
        <>
          <rect x="12" y="18" width="32" height="22" rx="6" fill={CREAM} stroke={EARTH} strokeWidth="2.2" />
          <path d="M18 24q10-4 20 0" {...common} />
          <circle cx="24" cy="14" r="2.2" fill={CREAM} stroke={EARTH} strokeWidth="1.8" />
          <circle cx="34" cy="12" r="1.8" fill={CREAM} stroke={EARTH} strokeWidth="1.8" />
        </>
      )}
      {kind === 'sausage' && (
        <>
          <path d="M14 16c12-2 26 12 24 24-2 8-10 4-16-2S6 18 14 16z" fill={BARN} stroke={EARTH} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M12 14l-3-3M44 44l3 3" {...common} />
        </>
      )}
    </svg>
  )
}

/* ── SIGNATURE: the lineage / survival line ────────────────────────────
   The emotional centerpiece. A single continuous SVG path plotted like a
   population chart: a long steady plateau across the centuries, a sharp
   crash into a barn-red "near extinction" danger band, then a hopeful
   climb back. The draw (stroke-dashoffset) is driven by a MANUAL passive
   scroll listener tracking the figure's travel through the viewport,
   remapped so the line completes while the chart is comfortably in view
   (not only after scrolling past). Reduced motion renders it fully drawn,
   static, with both captions visible.

   Geometry: viewBox 0..1000 (x = time) by 0..300 (y; lower y = higher
   population). Plot area is inset by PAD on every side so axis labels,
   gridlines and the danger band have room.
   ──────────────────────────────────────────────────────────────────── */

const VB_W = 1000
const VB_H = 300
const PAD = { l: 92, r: 28, t: 26, b: 30 }
const PLOT_W = VB_W - PAD.l - PAD.r
const PLOT_H = VB_H - PAD.t - PAD.b

// Helpers map a 0..1 time / population value into plot coordinates.
const px = (t: number) => PAD.l + t * PLOT_W
const py = (pop: number) => PAD.t + (1 - pop) * PLOT_H

// Era anchors as {time 0..1, population 0..1}. The crash bottoms out in the
// danger band (~0.14) then recovers to a hopeful but honest mid level.
const ERA_X = [0.0, 0.46, 0.64, 0.78, 1.0]
const ERA_POP = [0.8, 0.82, 0.14, 0.3, 0.62]

// Smooth path through the era anchors (gentle Catmull-Rom-ish curve, hand
// tuned so the plateau reads flat, the crash reads sharp and the rise reads
// hopeful). Built once at module scope.
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

// Danger band spans the dip around the trough era.
const DANGER_X0 = px(0.55)
const DANGER_X1 = px(0.72)
const DANGER_TOP = py(0.26) // threshold line — below this = danger

function LineageLine({ lang }: { lang: Lang }) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [len, setLen] = useState(0)
  const [progress, setProgress] = useState(reduce ? 1 : 0)
  const ticking = useRef(false)

  // Measure the path once it mounts (and if the language flip remounts text
  // around it, the length is stable so this stays correct).
  useEffect(() => {
    const p = pathRef.current
    if (p) setLen(p.getTotalLength())
  }, [])

  // Manual passive scroll listener. raw = how far the figure has travelled
  // from first entering the viewport bottom to leaving the top. We remap a
  // comfortable middle window [0.18 .. 0.72] to [0 .. 1] so the line finishes
  // drawing while it sits centred on screen, then holds.
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
  // Marker rides the tip of the drawn line.
  const tip = pathRef.current && len ? pathRef.current.getPointAtLength(len * progress) : null

  // Captions fade in as the draw passes their time position.
  const troughIn = reduce || progress > 0.62
  const riseIn = reduce || progress > 0.9

  return (
    <div ref={wrapRef} className="relative mt-10 md:mt-14">
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
            <stop offset="0%" stopColor={GREEN} stopOpacity="0.20" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={PAD.l} x2={VB_W - PAD.r} y1={py(g)} y2={py(g)} stroke={EARTH} strokeOpacity="0.1" strokeWidth="1" />
        ))}

        {/* population axis hint (vertical) */}
        <text x={26} y={py(0.5)} fill={EARTH} fillOpacity="0.8" fontSize="15" fontWeight="600"
          transform={`rotate(-90 26 ${py(0.5)})`} textAnchor="middle" style={{ fontFamily: 'inherit' }}>
          {L(STORY.axisLabel, lang)}
        </text>
        <text x={PAD.l - 12} y={py(0.96)} fill={EARTH} fillOpacity="0.55" fontSize="13" textAnchor="end">
          {L(STORY.axisHigh, lang)}
        </text>
        <text x={PAD.l - 12} y={py(0.06) + 4} fill={EARTH} fillOpacity="0.55" fontSize="13" textAnchor="end">
          {L(STORY.axisLow, lang)}
        </text>

        {/* near-extinction danger band */}
        <rect x={DANGER_X0} y={DANGER_TOP} width={DANGER_X1 - DANGER_X0} height={VB_H - PAD.b - DANGER_TOP} fill={BARN} opacity="0.07" />
        <line x1={DANGER_X0} x2={DANGER_X1} y1={DANGER_TOP} y2={DANGER_TOP} stroke={BARN} strokeOpacity="0.45" strokeWidth="1.4" strokeDasharray="4 5" />
        <text x={(DANGER_X0 + DANGER_X1) / 2} y={DANGER_TOP - 8} fill={BARN} fontSize="13" fontWeight="700" textAnchor="middle" letterSpacing="0.04em">
          {L(STORY.dangerLabel, lang)}
        </text>

        {/* faint full guide so the line has a ghost before it draws */}
        <path d={LINE_D} fill="none" stroke={EARTH} strokeOpacity="0.12" strokeWidth="2.5" strokeLinecap="round" />

        {/* soft area fill under the drawn portion (clipped to the dash draw via opacity on progress) */}
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
          stroke={GREEN}
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: len || undefined,
            strokeDashoffset: len ? dashOffset : undefined,
          }}
        />

        {/* era anchor dots (always present, subtle) */}
        {ERA_X.map((t, i) => (
          <circle key={t} cx={px(t)} cy={py(ERA_POP[i])} r="3.4" fill={CREAM} stroke={EARTH} strokeOpacity="0.4" strokeWidth="1.4" />
        ))}

        {/* moving tip dot with a soft halo while drawing */}
        {tip && progress > 0.01 && progress < 0.999 && (
          <>
            {!reduce && <circle cx={tip.x} cy={tip.y} r="11" fill={GREEN} opacity="0.18" />}
            <circle cx={tip.x} cy={tip.y} r="6.5" fill={GREEN} stroke={CREAM} strokeWidth="2.6" />
          </>
        )}

        {/* floating caption near the trough */}
        <g style={{ opacity: troughIn ? 1 : 0, transition: 'opacity .5s ease' }}>
          <text x={px(0.635)} y={py(0.14) + 30} fill={BARN} fontSize="14" fontWeight="600" textAnchor="middle">
            {L(STORY.troughNote, lang)}
          </text>
        </g>
        {/* floating caption near the rise — anchored to the right edge so the
            longer English string grows leftward into the plot, never past it. */}
        <g style={{ opacity: riseIn ? 1 : 0, transition: 'opacity .5s ease' }}>
          <text x={px(0.99)} y={py(0.62) - 16} fill={GREEN} fontSize="14" fontWeight="600" textAnchor="end">
            {L(STORY.riseNote, lang)}
          </text>
        </g>
      </svg>

      {/* era marks under the line, aligned to their x-position on the curve.
          First/last anchor to the edge (not centred) so labels never clip.
          On narrow screens odd-index marks (1700, 1989) drop to a second row. */}
      <style>{`
        .haafell-mark-stagger { top: 0; }
        @media (max-width: 639px) {
          .haafell-mark-stagger { top: 1.75rem; }
          .haafell-marks-wrap { height: 5rem !important; }
        }
      `}</style>
      <div className="haafell-marks-wrap relative mt-2 h-12 sm:h-11" aria-hidden="true">
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
              <span className="block font-mono text-[10px] tracking-wide" style={{ color: EARTH }}>
                {m.year}
              </span>
              <span className="mt-0.5 block max-w-[5.5rem] text-[10px] leading-tight font-medium sm:text-[11px]" style={{ color: INK }}>
                {L(m.t, lang)}
              </span>
            </div>
          )
        })}
      </div>
      {/* screen-reader era list (the absolute layout above is decorative) */}
      <ul className="sr-only" lang={lang}>
        {STORY.marks.map((m) => (
          <li key={m.year}>
            {m.year}: {L(m.t, lang)}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Language toggle (real accessible control) ─────────────────────── */

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div
      role="group"
      aria-label={L(UI.toggleLabel, lang)}
      className="inline-flex items-center rounded-full p-0.5 text-xs font-semibold"
      style={{ background: '#ffffffcc', boxShadow: `inset 0 0 0 1px ${EARTH}33` }}
    >
      {(['is', 'en'] as const).map((code) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className="min-h-[36px] rounded-full px-3 py-1.5 uppercase tracking-wide transition-colors focus-visible:outline-2"
            style={{
              background: active ? GREEN : 'transparent',
              color: active ? '#fff' : EARTH,
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

  // Reflect the active language on <html lang> for AT, restore on unmount.
  useEffect(() => {
    const prev = document.documentElement.lang
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = prev
    }
  }, [lang])

  // Mobile sticky CTA + a gentle transform-only hero parallax — both from a
  // single manual passive scroll listener (no Framer scroll values for
  // load-bearing UI; parallax is purely decorative and skipped when reduced).
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setShowBar(y > 640)
        if (!reduce) setHeroShift(Math.min(48, y * 0.06))
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

  return (
    <div
      id="top"
      lang={lang}
      className="min-h-screen font-sans antialiased"
      style={{ background: CREAM, color: INK }}
    >
      <PreviewChrome company={company} />

      {/* skip link */}
      <a
        href="#story"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[70] focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        style={{ background: GREEN }}
      >
        {L(UI.skipToContent, lang)}
      </a>

      {/* paper grain + warm vignette ground */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(120% 80% at 50% -10%, ${STRAW}22, transparent 55%), radial-gradient(100% 60% at 100% 100%, ${GREEN}14, transparent 60%)`,
        }}
      />

      {/* ── Header / nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ borderColor: `${EARTH}1f`, background: `${CREAM}d9` }}>
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 md:px-8">
          <a href="#top" className="flex items-baseline gap-2 rounded focus-visible:outline-2">
            <span className="font-bricolage text-lg font-bold tracking-tight" style={{ color: INK }}>
              Háafell
            </span>
            <span className="hidden font-mono text-[10px] tracking-[0.18em] uppercase sm:inline" style={{ color: GREEN }} lang="is">
              · Geitfjársetur
            </span>
          </a>
          <div className="hidden items-center gap-6 md:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="rounded text-sm font-medium transition-colors hover:opacity-70 focus-visible:outline-2" style={{ color: INK }}>
                {L(n.label, lang)}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <LangToggle lang={lang} setLang={setLang} />
            <a
              href="#visit"
              className="hidden min-h-[40px] items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 sm:inline-flex"
              style={{ background: GREEN }}
            >
              {L(UI.planVisit, lang)}
            </a>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 pt-12 pb-10 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:px-8 md:pt-20 md:pb-16">
            <div>
              <Rise onMount>
                <p className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide" style={{ background: `${GREEN}1a`, color: GREEN }}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} aria-hidden="true" />
                  {L(HERO.eyebrow, lang)}
                </p>
              </Rise>
              <Rise delay={0.06} onMount>
                <h1 className="mt-5 font-bricolage font-bold leading-[0.98] tracking-tight" style={{ color: INK, fontSize: 'clamp(2.6rem, 9vw, 4.6rem)' }}>
                  Háafell
                  <span className="block" style={{ color: GREEN }}>
                    Geitfjársetur
                  </span>
                </h1>
              </Rise>
              <Rise delay={0.12} onMount>
                <p className="mt-5 max-w-md font-bricolage font-medium leading-snug" style={{ color: BARN, fontSize: 'clamp(1.25rem, 4.5vw, 1.5rem)' }}>
                  {L(HERO.tagline, lang)}
                </p>
              </Rise>
              <Rise delay={0.18} onMount>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: `${INK}cc` }}>
                  {L(HERO.lede, lang)}
                </p>
              </Rise>
              <Rise delay={0.24} onMount>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href="#visit"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2"
                    style={{ background: GREEN }}
                  >
                    {L(UI.planVisit, lang)}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#story"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors hover:opacity-70 focus-visible:outline-2"
                    style={{ color: EARTH, boxShadow: `inset 0 0 0 1.5px ${EARTH}40` }}
                  >
                    {L(UI.nav.story, lang)}
                  </a>
                </div>
              </Rise>
              <Rise delay={0.3} onMount>
                <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium" style={{ color: `${INK}b3` }}>
                  {HERO.facts.map((f) => (
                    <li key={f.en} className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: STRAW }} aria-hidden="true" />
                      {L(f, lang)}
                    </li>
                  ))}
                </ul>
              </Rise>
            </div>

            {/* hero image — atmospheric goat in pasture (gentle transform-only parallax) */}
            <Rise delay={0.12} y={26} onMount>
              <div className="relative">
                <div
                  className="overflow-hidden rounded-[26px] shadow-xl"
                  style={{ boxShadow: `0 24px 60px -28px ${EARTH}99`, transform: `translate3d(0, ${-heroShift}px, 0)`, willChange: 'transform' }}
                >
                  <Img
                    src={`https://images.unsplash.com/${HERO_ID}?w=1100&q=80${Q}`}
                    alt={L(HERO.imageAlt, lang)}
                    className="aspect-[4/5] w-full object-cover"
                    fetchpriority="high"
                    fallbackClassName="bg-gradient-to-br from-[#d9b779] to-[#5f7138]"
                  />
                </div>
                {/* friendly peeking goat badge — nudges on hover (decorative) */}
                <motion.div
                  className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 shadow-lg"
                  style={{ boxShadow: `0 12px 30px -16px ${EARTH}` }}
                  whileHover={reduce ? undefined : { y: -3, rotate: -1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  <GoatPeek />
                  <span className="pr-1 text-xs font-semibold leading-tight" style={{ color: INK }}>
                    {L(HERO.badge, lang)}
                  </span>
                </motion.div>
              </div>
            </Rise>
          </div>

          {/* scroll hint */}
          <div className="mx-auto max-w-6xl px-5 pb-6 md:px-8" aria-hidden="true">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: `${EARTH}99` }}>
              ↓ {L(HERO.scrollHint, lang)}
            </p>
          </div>
        </section>

        {/* ── STORY + LINEAGE LINE ──────────────────────────────── */}
        <section id="story" className="scroll-mt-20 border-y" style={{ borderColor: `${EARTH}1a`, background: `${STRAW}1f` }}>
          <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
            <Rise>
              <p className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: GREEN }}>
                {L(STORY.kicker, lang)}
              </p>
              <h2 className="mt-3 max-w-2xl font-bricolage font-bold leading-[1.04] tracking-tight" style={{ color: INK, fontSize: 'clamp(1.85rem, 6vw, 3rem)' }}>
                {L(STORY.heading, lang)}
              </h2>
            </Rise>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {STORY.paras.map((p, i) => (
                <Rise key={i} delay={i * 0.08}>
                  <p className="text-[15px] leading-relaxed" style={{ color: `${INK}d9` }}>
                    {L(p, lang)}
                  </p>
                </Rise>
              ))}
            </div>

            {/* the signature line */}
            <Rise delay={0.1}>
              <div className="mt-10 flex items-center gap-2 md:mt-12">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: GREEN }} aria-hidden="true" />
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: `${EARTH}b3` }}>
                  {L(STORY.timelineLabel, lang)}
                </span>
              </div>
            </Rise>
            <LineageLine lang={lang} />
          </div>
        </section>

        {/* ── MEET THE FARM ─────────────────────────────────────── */}
        <section id="farm" className="scroll-mt-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-14 md:px-8 md:py-24">
            <Rise y={24}>
              <div className="grid grid-cols-5 grid-rows-5 gap-3">
                <div className="col-span-3 row-span-5 overflow-hidden rounded-[22px] shadow-lg" style={{ boxShadow: `0 18px 44px -24px ${EARTH}` }}>
                  <Img
                    src={`https://images.unsplash.com/${KID_ID}?w=800&q=80${Q}`}
                    alt={L(FARM_SECTION.imageAlt, lang)}
                    className="h-full min-h-[280px] w-full object-cover"
                    fallbackClassName="bg-gradient-to-br from-[#d9b779] to-[#6b4a2f]"
                  />
                </div>
                <div className="col-span-2 row-span-5 overflow-hidden rounded-[22px] shadow-lg" style={{ boxShadow: `0 18px 44px -24px ${EARTH}` }}>
                  <Img
                    src={`https://images.unsplash.com/${FARM_ID}?w=700&q=80${Q}`}
                    alt={L(FARM_SECTION.imageAlt2, lang)}
                    className="h-full min-h-[280px] w-full object-cover"
                    fallbackClassName="bg-gradient-to-br from-[#9a4730] to-[#6b4a2f]"
                  />
                </div>
              </div>
            </Rise>

            <div>
              <Rise>
                <p className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: GREEN }}>
                  {L(FARM_SECTION.kicker, lang)}
                </p>
                <h2 className="mt-3 font-bricolage font-bold leading-[1.05] tracking-tight" style={{ color: INK, fontSize: 'clamp(1.85rem, 5vw, 2.25rem)' }}>
                  {L(FARM_SECTION.heading, lang)}
                </h2>
              </Rise>
              {FARM_SECTION.body.map((p, i) => (
                <Rise key={i} delay={0.06 + i * 0.06}>
                  <p className="mt-4 text-[15px] leading-relaxed" style={{ color: `${INK}d9` }}>
                    {L(p, lang)}
                  </p>
                </Rise>
              ))}
              <Rise delay={0.2}>
                <p className="mt-5 text-sm">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: `${EARTH}99` }}>
                    {L(FARM_SECTION.ownersLabel, lang)}
                  </span>
                  <span className="mt-0.5 block font-semibold" style={{ color: EARTH }} lang="is">
                    {FARM.owners}
                  </span>
                </p>
              </Rise>
              <Rise delay={0.26}>
                <dl className="mt-7 grid grid-cols-3 gap-3">
                  {FARM_SECTION.stats.map((s) => (
                    <div key={s.v} className="rounded-2xl bg-white/70 px-3 py-4 text-center" style={{ boxShadow: `inset 0 0 0 1px ${EARTH}1f` }}>
                      <dt className="font-bricolage text-2xl font-bold" style={{ color: GREEN }}>
                        {s.v}
                      </dt>
                      <dd className="mt-1 text-[11px] leading-tight font-medium" style={{ color: `${INK}b3` }}>
                        {L(s.t, lang)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Rise>
            </div>
          </div>
        </section>

        {/* ── VISIT PLANNER ─────────────────────────────────────── */}
        <section
          id="visit"
          className="scroll-mt-20 border-y"
          style={{ borderColor: `${EARTH}1a`, background: `${GREEN}10` }}
        >
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <Rise>
              <p className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: GREEN }}>
                {L(VISIT.kicker, lang)}
              </p>
              <h2 className="mt-3 font-bricolage font-bold leading-[1.05] tracking-tight" style={{ color: INK, fontSize: 'clamp(1.85rem, 6vw, 3rem)' }}>
                {L(VISIT.heading, lang)}
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed" style={{ color: `${INK}cc` }}>
                {L(VISIT.intro, lang)}
              </p>
            </Rise>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {/* Hours */}
              <Rise>
                <div className="flex h-full flex-col rounded-3xl bg-white/80 p-6 shadow-sm" style={{ boxShadow: `inset 0 0 0 1px ${EARTH}1a` }}>
                  <Clock className="h-6 w-6" style={{ color: GREEN }} aria-hidden="true" />
                  <h3 className="mt-4 font-bricolage text-lg font-bold" style={{ color: INK }}>
                    {L(VISIT.hoursTitle, lang)}
                  </h3>
                  <p className="mt-2 font-semibold" style={{ color: EARTH }}>
                    {L(VISIT.hoursMain, lang)}
                  </p>
                  <p className="text-[15px]" style={{ color: `${INK}cc` }}>
                    {L(VISIT.hoursTime, lang)}
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed" style={{ color: `${INK}99` }}>
                    {L(VISIT.hoursNote, lang)}
                  </p>
                </div>
              </Rise>

              {/* Admission */}
              <Rise delay={0.08}>
                <div className="flex h-full flex-col rounded-3xl bg-white/80 p-6 shadow-sm" style={{ boxShadow: `inset 0 0 0 1px ${EARTH}1a` }}>
                  <Ticket className="h-6 w-6" style={{ color: GREEN }} aria-hidden="true" />
                  <h3 className="mt-4 font-bricolage text-lg font-bold" style={{ color: INK }}>
                    {L(VISIT.priceTitle, lang)}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {VISIT.prices.map((p) => (
                      <li key={p.amount} className="flex items-baseline justify-between gap-3 border-b pb-2 last:border-0" style={{ borderColor: `${EARTH}1a` }}>
                        <span className="text-[15px]" style={{ color: `${INK}cc` }}>
                          {L(p.who, lang)}
                        </span>
                        <span className="font-bricolage text-lg font-bold" style={{ color: INK }}>
                          {p.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[12px] leading-relaxed" style={{ color: `${INK}99` }}>
                    {L(VISIT.priceFoot, lang)}
                  </p>
                </div>
              </Rise>

              {/* Get there */}
              <Rise delay={0.16}>
                <div className="flex h-full flex-col rounded-3xl bg-white/80 p-6 shadow-sm" style={{ boxShadow: `inset 0 0 0 1px ${EARTH}1a` }}>
                  <MapPin className="h-6 w-6" style={{ color: GREEN }} aria-hidden="true" />
                  <h3 className="mt-4 font-bricolage text-lg font-bold" style={{ color: INK }}>
                    {L(VISIT.getThereTitle, lang)}
                  </h3>
                  <address className="mt-2 text-[15px] leading-snug not-italic" style={{ color: `${INK}cc` }} lang="is">
                    {FARM.addressLines.join(', ')}
                  </address>
                  <p className="mt-2 text-[13px] leading-relaxed" style={{ color: `${INK}99` }}>
                    {L(VISIT.getThereBody, lang)}
                  </p>
                </div>
              </Rise>
            </div>

            {/* designed route map — origin → via towns → Háafell pin */}
            <Rise delay={0.1}>
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="group mt-5 block overflow-hidden rounded-3xl focus-visible:outline-2"
                style={{ boxShadow: `inset 0 0 0 1px ${EARTH}1a` }}
                aria-label={`${L(VISIT.openInMaps, lang)}: ${FARM.addressLines.join(', ')}`}
              >
                <div className="relative h-52 w-full sm:h-60" style={{ background: `${STRAW}33` }}>
                  {/* Markers live INSIDE the SVG so they track the road exactly
                      at every width (the container is sliced to cover). */}
                  <svg viewBox="0 0 1000 240" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
                    <rect width="1000" height="240" fill={`${GREEN}12`} />
                    {/* terrain contours */}
                    {[44, 92, 140, 188].map((y, i) => (
                      <path
                        key={y}
                        d={`M0 ${y} C 220 ${y - 20 - i * 3}, 460 ${y + 18}, 680 ${y - 12}, 1000 ${y + 8}`}
                        fill="none"
                        stroke={EARTH}
                        strokeOpacity="0.14"
                        strokeWidth="1.4"
                      />
                    ))}
                    {/* a river hint */}
                    <path d="M-20 210 C 200 200, 320 220, 520 196 C 700 176, 820 188, 1020 168" fill="none" stroke={GREEN} strokeOpacity="0.2" strokeWidth="5" strokeLinecap="round" />
                    {/* the route: Reykjavík (left) → Háafell (right) */}
                    <path d="M120 196 C 320 176, 430 150, 560 120 C 680 92, 770 78, 856 64" fill="none" stroke={STRAW} strokeWidth="7" strokeLinecap="round" />
                    <path d="M120 196 C 320 176, 430 150, 560 120 C 680 92, 770 78, 856 64" fill="none" stroke={EARTH} strokeOpacity="0.45" strokeWidth="1.6" strokeDasharray="2 8" strokeLinecap="round" />

                    {/* origin marker + label (Reykjavík) */}
                    <circle cx="120" cy="196" r="6" fill={CREAM} stroke={EARTH} strokeWidth="2.4" />
                    <g transform="translate(120 196)">
                      <rect x="14" y="-13" rx="11" ry="11" width="96" height="26" fill="#ffffffe6" />
                      <text x="26" y="4" fill={EARTH} fontSize="13" fontWeight="700">{L(VISIT.routeFrom, lang)}</text>
                    </g>

                    {/* via waypoint + label (Borgarnes / Reykholt) */}
                    <circle cx="560" cy="120" r="4.5" fill={CREAM} stroke={EARTH} strokeWidth="2" />
                    <text x="560" y="104" fill={`${INK}b3`} fontSize="12" fontWeight="500" textAnchor="middle">
                      {L(VISIT.routeVia, lang)}
                    </text>

                    {/* destination pin (Háafell) — anchored at the road end.
                        Outer <g> positions via attribute; inner <g> does the
                        hover lift via CSS so the two transforms don't clash. */}
                    <g transform="translate(856 64)">
                      <g className="origin-center transition-transform duration-300 group-hover:[transform:translateY(-3px)]">
                        <circle cx="0" cy="0" r="15" fill={BARN} />
                        <circle cx="0" cy="0" r="15" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" />
                        <circle cx="0" cy="0" r="4.5" fill="#fff" />
                        <rect x="-30" y="20" rx="9" ry="9" width="60" height="22" fill="#ffffffe6" />
                        <text x="0" y="35" fill={INK} fontSize="13" fontWeight="700" textAnchor="middle">Háafell</text>
                      </g>
                    </g>
                  </svg>

                  {/* legend / open-in-maps affordance */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold" style={{ color: EARTH }}>
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {L(VISIT.mapNote, lang)} · {L(FARM.driveFromReykjavik, lang)}
                  </div>
                  <div className="absolute bottom-3 right-3 hidden items-center gap-1 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold transition-colors group-hover:bg-white sm:flex" style={{ color: GREEN }}>
                    {L(VISIT.openInMaps, lang)}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                </div>
              </a>
            </Rise>

            {/* contact actions */}
            <Rise delay={0.12}>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${FARM.phoneTel}`}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2"
                  style={{ background: GREEN }}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {L(VISIT.callLabel, lang)} · {FARM.phoneHuman}
                </a>
                <a
                  href={`mailto:${FARM.email}`}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors hover:opacity-70 focus-visible:outline-2"
                  style={{ color: EARTH, boxShadow: `inset 0 0 0 1.5px ${EARTH}40` }}
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {L(VISIT.emailLabel, lang)} · {FARM.email}
                </a>
              </div>
            </Rise>
          </div>
        </section>

        {/* ── SHOP ──────────────────────────────────────────────── */}
        <section id="shop" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <Rise>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: GREEN }}>
                    {L(SHOP.kicker, lang)}
                  </p>
                  <h2 className="mt-3 font-bricolage font-bold leading-[1.05] tracking-tight" style={{ color: INK, fontSize: 'clamp(1.85rem, 6vw, 3rem)' }}>
                    {L(SHOP.heading, lang)}
                  </h2>
                </div>
                <p className="max-w-sm text-[15px] leading-relaxed" style={{ color: BARN }}>
                  {L(SHOP.mission, lang)}
                </p>
              </div>
            </Rise>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SHOP.products.map((p, i) => (
                <Rise key={p.name} delay={i * 0.06} y={22}>
                  <article className="flex h-full flex-col rounded-3xl bg-white/80 p-5 shadow-sm transition-transform hover:-translate-y-1" style={{ boxShadow: `inset 0 0 0 1px ${EARTH}1a` }}>
                    <div className="relative flex items-center justify-center rounded-2xl py-6" style={{ background: `${STRAW}2e` }}>
                      <ProductGlyph kind={p.glyph} />
                      <span className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide" style={{ background: `${GREEN}1f`, color: GREEN }}>
                        {L(SHOP.supportsTag, lang)}
                      </span>
                    </div>
                    <h3 className="mt-4 font-bricolage text-lg leading-tight font-bold" style={{ color: INK }} lang="is">
                      {p.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium tracking-wide uppercase" style={{ color: GREEN }}>
                      {L(p.gloss, lang)}
                    </p>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed" style={{ color: `${INK}b3` }}>
                      {L(p.desc, lang)}
                    </p>
                    <p className="mt-3 font-bricolage text-xl font-bold" style={{ color: BARN }}>
                      {p.price}
                    </p>
                  </article>
                </Rise>
              ))}
            </div>

            {/* order intent — replaces the broken third-party link */}
            <Rise delay={0.1}>
              <div className="mt-8 flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between" style={{ background: `${GREEN}12`, boxShadow: `inset 0 0 0 1px ${GREEN}33` }}>
                <p className="max-w-md text-[14px] leading-relaxed" style={{ color: `${INK}cc` }}>
                  <span className="font-semibold" style={{ color: EARTH }}>{L(SHOP.priceNote, lang)}.</span>{' '}
                  {L(SHOP.orderNote, lang)}
                </p>
                <a
                  href={`mailto:${FARM.email}?subject=${encodeURIComponent(L(SHOP.orderSubject, lang))}`}
                  className="inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2"
                  style={{ background: GREEN }}
                >
                  {L(SHOP.orderCta, lang)}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </Rise>
          </div>
        </section>

        {/* ── TRUST / CLOSING BAND ──────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ background: INK }}>
          <Img
            src={`https://images.unsplash.com/${LAND_ID}?w=1400&q=70${Q}`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            fallbackClassName="bg-gradient-to-br from-[#2b2419] to-[#5f7138]"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}cc, ${INK}f2)` }} aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-5 py-20 text-center md:px-8 md:py-28">
            <Rise>
              <div className="mx-auto mb-6 flex w-fit items-center gap-1">
                <GoatPeek color={STRAW} />
                <GoatPeek flip color={STRAW} />
              </div>
              <h2 className="mx-auto max-w-2xl font-bricolage font-bold leading-[1.08] tracking-tight text-white" style={{ fontSize: 'clamp(1.85rem, 6vw, 3rem)' }}>
                {L(TRUST.line, lang)}
              </h2>
              <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: '#ffffffcc' }}>
                {L(TRUST.sub, lang)}
              </p>
              <a
                href="#visit"
                className="mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-full px-7 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-2"
                style={{ background: STRAW, color: INK }}
              >
                {L(UI.planVisit, lang)}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
          href="#visit"
          tabIndex={showBar ? 0 : -1}
          className="mr-[5.5rem] flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-white shadow-xl focus-visible:outline-2"
          style={{ background: GREEN, boxShadow: `0 12px 30px -10px ${EARTH}` }}
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {L(UI.planVisit, lang)}
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
