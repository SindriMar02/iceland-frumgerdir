import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Crosshair, MapPin, Move, Phone, ShoppingBag } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import { BUY, COLLECTION, DISTILLERY, PROCESS, SPIRITS } from './data'

const company = getPreviewCompany('reykjavikdistillery')

const U = 'https://images.unsplash.com/'
/** photo-1514218953589-2d7d37efd2dc — moody pour of clear spirit (verified 200). Atmospheric only. */
const POUR = 'photo-1514218953589-2d7d37efd2dc'
/** photo-1469474968028-56623f02e42e — wild northern landscape at dusk (verified 200). */
const WILD = 'photo-1469474968028-56623f02e42e'

const GROUND = '#0b0f0e'
const FROST = '#eef2f0'
const MUTED = '#9fb0a8'

/** Map viewBox — single source of truth so SVG + HTML overlay stay locked. */
const MAP_W = 400
const MAP_H = 520

/** Format an ISK price with the locale thousands separator. */
const kr = (n: number) => `${n.toLocaleString('is-IS')} kr`

/* ---------------------------------------------------------------------------
   One-shot reveal that NEVER traps content invisible. Default state is fully
   visible; if IntersectionObserver + motion are available (and motion is not
   reduced) it starts slightly translated/transparent and settles once. A
   backgrounded tab that never fires the observer simply shows the visible
   fallback — no rAF dependency for legibility.
--------------------------------------------------------------------------- */
function useReveal<T extends HTMLElement = HTMLElement>(reduce: boolean | null) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(true)
  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    setShown(false)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '-60px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])
  return { ref, shown }
}

/* ---------------------------------------------------------------------------
   Rolling Space Mono coordinate readout. Each glyph springs in on change so
   the lock reads like a mechanical counter settling. Tabular figures keep the
   width steady. Degrades to static text under reduced motion.
--------------------------------------------------------------------------- */
function CoordReadout({ value, tint, reduce }: { value: string; tint: string; reduce: boolean | null }) {
  if (reduce) {
    return (
      <span className="font-mono text-sm tabular-nums tracking-tight" style={{ color: tint }}>
        {value}
      </span>
    )
  }
  return (
    <span aria-hidden="true" className="inline-flex font-mono text-sm tabular-nums tracking-tight" style={{ color: tint }}>
      {value.split('').map((ch, i) => (
        <span key={`${i}-${ch}`} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '0.9em', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 520, damping: 30, delay: i * 0.016 }}
            key={`${value}-${i}`}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ---------------------------------------------------------------------------
   The signature: a foraging map. A static graticule grid + abstract Iceland
   coastline with every spirit plotted. A crosshair reticle springs (transform
   only) to the selected botanical's coordinate; a label tag rides with it so
   the map is self-explanatory. Keyboard accessible (radiogroup, roving
   tabindex, Arrow/Home/End, aria-checked). Selecting crossfades the page
   accent + rolls the readout. The grid is drawn at full opacity so it is never
   gated on an animation frame.
--------------------------------------------------------------------------- */
function ForagingMap({
  index,
  setIndex,
  accent,
  tint,
  reduce,
}: {
  index: number
  setIndex: (i: number) => void
  accent: string
  tint: string
  reduce: boolean | null
}) {
  const active = SPIRITS[index]
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Keep the active label tag inside the frame: flip it to the left when the
  // point sits in the right third so it never clips the edge.
  const labelLeft = active.x > MAP_W * 0.62
  const labelHigh = active.y < MAP_H * 0.16

  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    let next = index
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % SPIRITS.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + SPIRITS.length) % SPIRITS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = SPIRITS.length - 1
    else return
    e.preventDefault()
    setIndex(next)
    dotRefs.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label="Veldu eimingu á korti yfir Ísland"
      onKeyDown={onKey}
      className="relative w-full select-none overflow-hidden rounded-2xl border border-white/12 bg-[#080b0a]"
      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
    >
      {/* Corner registration ticks — survey-instrument feel */}
      <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 z-10 h-3 w-3 border-l border-t border-white/30" />
      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 z-10 h-3 w-3 border-r border-t border-white/30" />

      {/* SVG + interactive overlay share ONE box so percentage hit-targets map
          exactly onto the SVG coordinates (the chrome bar is a sibling below). */}
      <div className="relative">
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="block w-full" aria-hidden="true" role="presentation">
        {/* Graticule — STATIC hairlines at full opacity (never animation-gated) */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1={16} x2={384} y1={20 + i * 60} y2={20 + i * 60} stroke="#ffffff" strokeOpacity={0.06} strokeWidth={1} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`v${i}`} y1={16} y2={504} x1={16 + i * 61.3} x2={16 + i * 61.3} stroke="#ffffff" strokeOpacity={0.06} strokeWidth={1} />
        ))}

        {/* The 64° parallel — the brand line, emphasised, crossfades with accent */}
        <line x1={16} x2={384} y1={224} y2={224} stroke={tint} strokeOpacity={0.4} strokeDasharray="2 5" strokeWidth={1} style={{ transition: 'stroke 0.6s ease' }} />
        <text x={20} y={218} fill={tint} fillOpacity={0.75} fontSize={9} fontFamily="'Space Mono', monospace" style={{ transition: 'fill 0.6s ease' }}>
          64°N
        </text>

        {/* Abstract Iceland coastline — illustrative, STATIC, accent-tinted fill */}
        <path
          d="M70 150 C 96 120, 150 116, 184 132 C 214 146, 236 130, 268 140 C 308 152, 332 178, 320 210 C 312 234, 336 250, 330 280 C 322 318, 278 332, 240 326 C 206 320, 178 344, 144 332 C 104 318, 78 286, 84 250 C 88 224, 60 206, 70 178 Z"
          fill={accent}
          fillOpacity={0.08}
          stroke={accent}
          strokeOpacity={0.55}
          strokeWidth={1.5}
          style={{ transition: 'fill 0.6s ease, stroke 0.6s ease' }}
        />

        {/* Quiet survey rings on every plotted point */}
        {SPIRITS.map((s, i) => (
          <circle key={`ring-${s.id}`} cx={s.x} cy={s.y} r={i === index ? 9 : 4} fill="none" stroke="#ffffff" strokeOpacity={0.14} strokeWidth={1} />
        ))}

        {/* Survey line from the 64° origin to the active point */}
        <motion.line
          x1={214}
          y1={224}
          stroke={tint}
          strokeOpacity={0.3}
          strokeWidth={1}
          strokeDasharray="2 4"
          initial={false}
          animate={{ x2: active.x, y2: active.y }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 24, mass: 0.7 }}
          style={{ transition: 'stroke 0.6s ease' }}
        />

        {/* The reticle — springs (transform only) to the active coordinate */}
        <motion.g
          initial={false}
          animate={{ x: active.x, y: active.y }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 22, mass: 0.7 }}
        >
          {!reduce && (
            <motion.circle
              r={16}
              fill="none"
              stroke={tint}
              strokeWidth={1}
              animate={{ r: [16, 22, 16], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <circle r={16} fill="none" stroke={tint} strokeWidth={1.5} strokeOpacity={0.9} style={{ transition: 'stroke 0.6s ease' }} />
          <circle r={3.4} fill={tint} style={{ transition: 'fill 0.6s ease' }} />
          <line x1={-24} x2={-19} y1={0} y2={0} stroke={tint} strokeWidth={1.5} style={{ transition: 'stroke 0.6s ease' }} />
          <line x1={19} x2={24} y1={0} y2={0} stroke={tint} strokeWidth={1.5} style={{ transition: 'stroke 0.6s ease' }} />
          <line x1={0} x2={0} y1={-24} y2={-19} stroke={tint} strokeWidth={1.5} style={{ transition: 'stroke 0.6s ease' }} />
          <line x1={0} x2={0} y1={19} y2={24} stroke={tint} strokeWidth={1.5} style={{ transition: 'stroke 0.6s ease' }} />
          {/* Botanical label rides with the reticle (transform-only, no layout) */}
          <text
            x={labelLeft ? -26 : 26}
            y={labelHigh ? 22 : 4}
            textAnchor={labelLeft ? 'end' : 'start'}
            fontSize={11}
            letterSpacing={0.6}
            fontFamily="'Space Mono', monospace"
            fill={tint}
            style={{ transition: 'fill 0.6s ease', textTransform: 'uppercase' }}
          >
            {active.botanical.toUpperCase()}
          </text>
        </motion.g>
      </svg>

      {/* Interactive plotted points layered over the SVG via percentage positions */}
      <div className="pointer-events-none absolute inset-0">
        {SPIRITS.map((s, i) => {
          const selected = i === index
          return (
            <button
              key={s.id}
              ref={(el) => {
                dotRefs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setIndex(i)}
              aria-label={`${s.name}. ${s.botanical}, ${s.place}. ${s.coord}`}
              className="pointer-events-auto absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b0a]"
              style={{
                left: `${(s.x / MAP_W) * 100}%`,
                top: `${(s.y / MAP_H) * 100}%`,
                // @ts-expect-error CSS var for the focus ring colour
                '--tw-ring-color': s.tint,
              }}
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: selected ? 15 : 9,
                  height: selected ? 15 : 9,
                  background: s.accent,
                  boxShadow: selected ? `0 0 0 4px ${s.accent}33, 0 0 20px ${s.accent}cc` : `0 0 0 1px ${s.accent}55`,
                }}
              />
            </button>
          )
        })}
      </div>
      </div>

      {/* Map chrome: hint + live readout */}
      <div className="relative z-10 flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">
          <Move size={12} aria-hidden="true" /> Veldu punkt
        </span>
        <div aria-live="polite" className="min-w-0 text-right">
          <CoordReadout value={active.coord} tint={tint} reduce={reduce} />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------- */
function MobileCTA({ accent }: { accent: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0b0f0e]/95 px-4 pt-3 pb-[max(0.8rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <a
        href="#kaupa"
        className="flex min-h-[48px] items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-[#0b0f0e] transition-opacity hover:opacity-90"
        style={{ background: accent, transition: 'background-color 0.6s ease' }}
      >
        <ShoppingBag size={17} aria-hidden="true" /> Hvar á að kaupa
      </a>
    </div>
  )
}

/* ------------------------------------------------------------------------- */
export default function Page() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const active = SPIRITS[index]
  const accent = active.accent
  const tint = active.tint

  // Manual passive scroll listener — drives a thin progress hairline + a tiny
  // parallax on the hero coordinate stamp. No framer useScroll (it pins at 0).
  const [scrollY, setScrollY] = useState(0)
  const [docH, setDocH] = useState(1)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    const measure = () => setDocH(Math.max(1, document.documentElement.scrollHeight - window.innerHeight))
    measure()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [])
  const progress = useMemo(() => Math.min(1, Math.max(0, scrollY / docH)), [scrollY, docH])
  const heroShift = reduce ? 0 : Math.min(36, scrollY * 0.05)

  const steps = useReveal<HTMLOListElement>(reduce)

  useEffect(() => {
    document.title = '64° Reykjavik Distillery'
  }, [])

  // Crossfade the mobile browser chrome to match the selected botanical.
  useEffect(() => {
    setThemeColor(accent)
    return () => setThemeColor(GROUND)
  }, [accent])

  const select = useCallback((i: number) => setIndex(i), [])

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{ background: GROUND, color: FROST, transition: 'background-color 0.6s ease' }}
    >
      <PreviewChrome company={company} />
      <MobileCTA accent={accent} />

      {/* Scroll progress hairline */}
      <div className="fixed inset-x-0 top-0 z-40 h-px" aria-hidden="true">
        <div className="h-full origin-left" style={{ background: tint, transform: `scaleX(${progress})`, transition: 'background-color 0.6s ease' }} />
      </div>

      {/* ===== HERO ===== */}
      <header className="relative overflow-hidden px-5 pt-24 pb-16 md:px-10 md:pt-32 md:pb-24">
        {/* faint graticule backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 92% 72% at 50% 32%, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 92% 72% at 50% 32%, black, transparent 80%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex items-center gap-3" style={{ transform: `translateY(${-heroShift}px)` }}>
            <Crosshair size={16} style={{ color: tint, transition: 'color 0.6s ease' }} aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] sm:text-xs" style={{ color: tint, transition: 'color 0.6s ease' }}>
              64°08′N · Breiddargráða
            </span>
          </div>

          <h1 className="mt-6 font-syne text-[clamp(2rem,8.6vw,4.8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.01em]">
            64° Reykjavik
            <br />
            <span style={{ color: tint, transition: 'color 0.6s ease' }}>Distillery</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: MUTED }}>
            Handtínt úr íslenskri náttúru, frá villtu í glas. Hver jurt á sinni breiddargráðu, hver lota eimuð í Hafnarfirði síðan 2009.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#kortid"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-sm font-bold text-[#0b0f0e] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f0e]"
              style={{ background: accent, transition: 'background-color 0.6s ease', ['--tw-ring-color' as string]: tint } as CSSProperties}
            >
              Skoða vörurnar <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a
              href="#kaupa"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-[#eef2f0] outline-none transition-colors hover:border-white/40 focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Hvar á að kaupa
            </a>
          </div>

          {/* Hero composition: a framed coordinate plate beside an atmospheric pour */}
          <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-[1.25fr,1fr] sm:gap-5">
            {/* Stat plate */}
            <dl className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {[
                ['64.1°N', 'Breiddargráða Reykjavíkur'],
                ['2009', 'Fyrsta örbrugghúsið'],
                ['100%', 'Íslenskar jurtir'],
              ].map(([big, small], i) => (
                <div key={small} className={`px-3 py-5 sm:px-4 ${i > 0 ? 'border-l border-white/10' : ''}`}>
                  <dt className="font-mono text-xl font-bold tabular-nums sm:text-2xl" style={{ color: tint, transition: 'color 0.6s ease' }}>
                    {big}
                  </dt>
                  <dd className="mt-1.5 text-[11px] leading-snug" style={{ color: MUTED }}>
                    {small}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Atmospheric pour, framed with a coordinate caption so the panel reads intentional */}
            <figure className="relative overflow-hidden rounded-2xl border border-white/10">
              <div className="aspect-[5/4] sm:aspect-auto sm:h-full">
                <Img
                  src={`${U}${POUR}?q=80&w=900&auto=format&fit=crop`}
                  alt="Tær eiming hellt í glas, andrúmsmynd"
                  className="h-full w-full object-cover opacity-85"
                  fetchpriority="high"
                />
              </div>
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 35%, ${GROUND} 100%)` }} aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 pb-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                <span className="text-white/60">Wild → glass</span>
                <span style={{ color: tint, transition: 'color 0.6s ease' }}>64°N</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      {/* ===== SIGNATURE: FORAGING MAP SELECTOR ===== */}
      <section id="kortid" aria-labelledby="kortid-h" className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em]" style={{ color: tint, transition: 'color 0.6s ease' }}>
            Foraging map
          </span>
          <h2 id="kortid-h" className="mt-2 max-w-2xl font-syne text-[clamp(1.8rem,6vw,3.1rem)] font-bold uppercase leading-[0.95] tracking-tight">
            Plottað á jurtina
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed" style={{ color: MUTED }}>
            Veldu eimingu á kortinu. Krosshárið læsist á breiddargráðu jurtarinnar, hnitin rúlla fram og litur síðunnar tekur lit hennar. Notaðu örvalyklana eða smelltu á punkt.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr,1fr]">
            {/* The map */}
            <ForagingMap index={index} setIndex={select} accent={accent} tint={tint} reduce={reduce} />

            {/* Tasting card — updates on lock */}
            <div className="flex flex-col">
              <AnimatePresence mode="wait">
                <motion.article
                  key={active.id}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.21, 0.65, 0.36, 1] }}
                  className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border p-6 md:p-8"
                  style={{ borderColor: `${accent}55`, background: `linear-gradient(160deg, ${accent}16, transparent 62%)` }}
                >
                  {/* faint plate code top-right */}
                  <span aria-hidden="true" className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                    No. {String(index + 1).padStart(2, '0')} / {String(SPIRITS.length).padStart(2, '0')}
                  </span>

                  <span className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: tint }}>
                    {active.botanical}
                  </span>

                  <h3 className="mt-2 font-syne text-[clamp(1.6rem,7vw,2.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
                    {active.name}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: MUTED }}>
                    {active.type} · {active.size}
                  </p>

                  {/* palate descriptors */}
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Bragðtónar">
                    {active.palate.map((p) => (
                      <li
                        key={p}
                        className="rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide"
                        style={{ borderColor: `${accent}44`, color: tint, background: `${accent}12` }}
                      >
                        {p}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 text-[15px] leading-relaxed text-[#dfe6e2]">{active.notes}</p>

                  <p className="mt-4 flex items-center gap-2 text-[13px]" style={{ color: MUTED }}>
                    <MapPin size={13} style={{ color: tint }} aria-hidden="true" />
                    {active.source}
                  </p>

                  {/* readout block */}
                  <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>
                        Styrkur
                      </dt>
                      <dd className="mt-1 font-mono text-base tabular-nums" style={{ color: tint }}>
                        {active.abv}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>
                        Uppskera
                      </dt>
                      <dd className="mt-1 font-mono text-base" style={{ color: tint }}>
                        {active.season}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>
                        Verð · sýnishorn
                      </dt>
                      <dd className="mt-1 font-mono text-base tabular-nums" style={{ color: tint }}>
                        {kr(active.price)}
                      </dd>
                    </div>
                  </dl>

                  <a
                    href="#kaupa"
                    className="mt-6 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-full px-5 text-sm font-bold text-[#0b0f0e] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f0e]"
                    style={{ background: accent, ['--tw-ring-color' as string]: tint } as CSSProperties}
                  >
                    Hvar á að kaupa <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </motion.article>
              </AnimatePresence>

              {/* Quick-pick chips — mirror the map for mouse/touch (map is the a11y control) */}
              <div className="mt-4 flex flex-wrap gap-2" aria-hidden="true">
                {SPIRITS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    tabIndex={-1}
                    onClick={() => setIndex(i)}
                    className="rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors"
                    style={
                      i === index
                        ? { borderColor: s.accent, color: s.tint, background: `${s.accent}1f` }
                        : { borderColor: 'rgba(255,255,255,0.14)', color: MUTED }
                    }
                  >
                    {s.botanical}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fuller range */}
          <div className="mt-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
              Einnig í úrvalinu
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] sm:grid-cols-3">
              {COLLECTION.map((c) => (
                <li key={c.name} className="bg-[#0b0f0e] px-4 py-4">
                  <p className="font-syne text-sm font-semibold uppercase tracking-tight">{c.name}</p>
                  <p className="mt-1 text-[12px]" style={{ color: MUTED }}>
                    {c.type}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-5 max-w-2xl font-mono text-[11px] leading-relaxed" style={{ color: 'rgba(159,176,168,0.72)' }}>
            Styrkur, verð, flöskustærðir, uppskerutími og hnit eru sýnishorn (sample) og til skýringar. Vörunöfnin eru raunveruleg.
          </p>
        </div>
      </section>

      {/* ===== FROM WILD TO GLASS ===== */}
      <section aria-labelledby="ferli-h" className="relative px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em]" style={{ color: tint, transition: 'color 0.6s ease' }}>
            Frá villtu í glas
          </span>
          <h2 id="ferli-h" className="mt-2 font-syne text-[clamp(1.8rem,6vw,3.1rem)] font-bold uppercase leading-[0.95] tracking-tight">
            Fjögur skref
          </h2>

          <ol ref={steps.ref} className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <li
                key={p.k}
                className="relative bg-[#0b0f0e] px-5 py-7 transition-all duration-700 ease-out"
                style={{
                  opacity: steps.shown ? 1 : 0,
                  transform: steps.shown ? 'none' : 'translateY(16px)',
                  transitionDelay: `${i * 70}ms`,
                }}
              >
                <span className="font-mono text-xs tabular-nums" style={{ color: tint, transition: 'color 0.6s ease' }}>
                  {p.k}
                </span>
                <h3 className="mt-3 font-syne text-xl font-bold uppercase tracking-tight">{p.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: MUTED }}>
                  {p.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== WHERE TO BUY ===== */}
      <section id="kaupa" aria-labelledby="kaupa-h" className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em]" style={{ color: tint, transition: 'color 0.6s ease' }}>
            Hvar á að kaupa
          </span>
          <h2 id="kaupa-h" className="mt-2 font-syne text-[clamp(1.8rem,6vw,3.1rem)] font-bold uppercase leading-[0.95] tracking-tight">
            Versla 64°
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {BUY.map((b) => (
              <div
                key={b.name}
                className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: tint, transition: 'color 0.6s ease' }}>
                    {b.tag}
                  </span>
                  <h3 className="mt-2 font-syne text-xl font-semibold uppercase tracking-tight">{b.name}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed" style={{ color: MUTED }}>
                    {b.detail}
                  </p>
                </div>
                {b.href ? (
                  <a
                    href={b.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-full px-5 text-sm font-bold text-[#0b0f0e] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f0e]"
                    style={{ background: accent, transition: 'background-color 0.6s ease', ['--tw-ring-color' as string]: tint } as CSSProperties}
                  >
                    {b.cta} <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VISIT / TASTING — designed map section ===== */}
      <section aria-labelledby="heimsokn-h" className="px-5 pb-28 pt-4 md:px-10 md:pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10">
          <div className="grid lg:grid-cols-2">
            {/* Left: copy */}
            <div className="relative p-7 md:p-10">
              <span className="font-mono text-xs uppercase tracking-[0.22em]" style={{ color: tint, transition: 'color 0.6s ease' }}>
                Heimsókn og smakk
              </span>
              <h2 id="heimsokn-h" className="mt-2 font-syne text-[clamp(1.7rem,5.4vw,2.6rem)] font-bold uppercase leading-[0.95] tracking-tight">
                Komdu í brugghúsið
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: MUTED }}>
                Brugghúsið stendur við Lónsbraut í Hafnarfirði. Við bjóðum upp á smökkun á jurtaeimingunum eftir samkomulagi (sýnishorn af framboði). Hringdu og við finnum tíma.
              </p>

              <dl className="mt-7 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={18} style={{ color: tint }} aria-hidden="true" className="mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide" style={{ color: MUTED }}>
                      Heimilisfang
                    </dt>
                    <dd className="mt-0.5 text-[15px]">{DISTILLERY.addr}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} style={{ color: tint }} aria-hidden="true" className="mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide" style={{ color: MUTED }}>
                      Sími
                    </dt>
                    <dd className="mt-0.5">
                      <a href={DISTILLERY.telHref} className="font-mono text-[15px] tabular-nums underline-offset-4 hover:underline" style={{ color: tint }}>
                        {DISTILLERY.tel}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>

              <a
                href={DISTILLERY.telHref}
                className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-sm font-bold text-[#0b0f0e] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f0e]"
                style={{ background: accent, transition: 'background-color 0.6s ease', ['--tw-ring-color' as string]: tint } as CSSProperties}
              >
                <Phone size={16} aria-hidden="true" /> Bóka smökkun
              </a>
            </div>

            {/* Right: designed map panel */}
            <div className="relative min-h-[300px] border-t border-white/10 lg:border-l lg:border-t-0">
              <Img
                src={`${U}${WILD}?q=80&w=1100&auto=format&fit=crop`}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
              <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${GROUND}cc, ${accent}22)`, transition: 'background-color 0.6s ease' }} aria-hidden="true" />
              <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true" role="presentation">
                {Array.from({ length: 6 }).map((_, i) => (
                  <line key={`mh${i}`} x1={0} x2={400} y1={i * 60} y2={i * 60} stroke="#ffffff" strokeOpacity={0.07} />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <line key={`mv${i}`} y1={0} y2={300} x1={i * 66.6} x2={i * 66.6} stroke="#ffffff" strokeOpacity={0.07} />
                ))}
                {/* pin */}
                <g transform="translate(206 150)">
                  <circle r={26} fill="none" stroke={tint} strokeWidth={1} strokeOpacity={0.5} style={{ transition: 'stroke 0.6s ease' }} />
                  <circle r={5} fill={accent} style={{ transition: 'fill 0.6s ease' }} />
                  <line x1={-34} x2={-30} y1={0} y2={0} stroke={tint} strokeWidth={1.5} style={{ transition: 'stroke 0.6s ease' }} />
                  <line x1={30} x2={34} y1={0} y2={0} stroke={tint} strokeWidth={1.5} style={{ transition: 'stroke 0.6s ease' }} />
                  <line x1={0} x2={0} y1={-34} y2={-30} stroke={tint} strokeWidth={1.5} style={{ transition: 'stroke 0.6s ease' }} />
                  <line x1={0} x2={0} y1={30} y2={34} stroke={tint} strokeWidth={1.5} style={{ transition: 'stroke 0.6s ease' }} />
                </g>
              </svg>
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">Hafnarfjörður</span>
                <span className="font-mono text-[13px] tabular-nums" style={{ color: tint, transition: 'color 0.6s ease' }}>
                  {DISTILLERY.coord}
                </span>
              </div>
              <span className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                til skýringar
              </span>
            </div>
          </div>
        </div>
      </section>

      <PreviewFooter company={company} />
    </div>
  )
}
