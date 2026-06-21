import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode, Ref } from 'react'
import { useReducedMotion } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import { BAKES, FRESH_LINE, HERITAGE_STATS, HOURS, REVIEWS, TIMELINE, VISIT } from './data'

const company = getPreviewCompany('saudarkroksbakari')

/* ── Palette (the broadsheet) ─────────────────────────────────────────── */
const CREAM = '#f6efe2' // paper ground
const PAPER2 = '#efe4d0' // toned paper (alternating band)
const INK = '#2a1c12' // deep rye ink (body)
const CRUST_TEXT = '#8a4f1e' // crust colour readable on cream (AA)
const TOASTED = '#7a3d16'
const BUTTER = '#e8b95e'
const EMBER = '#d98b2b' // glowing oven amber (decorative)
const INDIGO = '#2c3550' // pre-dawn (used only in the hero dawn moment)

/* ── Hero imagery (verified Unsplash, HTTP 200) ───────────────────────── */
const HERO_ID = 'photo-1509440159596-0249088772ff' // rustic seeded rye loaves
const HERO = `https://images.unsplash.com/${HERO_ID}?q=80&w=2000&auto=format&fit=crop`
const HERO_SRCSET = [828, 1280, 2000]
  .map((w) => `https://images.unsplash.com/${HERO_ID}?q=80&w=${w}&auto=format&fit=crop ${w}w`)
  .join(', ')

const CASE_IMG =
  'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=1280&auto=format&fit=crop' // bakery display case
const SLICE_IMG =
  'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1280&auto=format&fit=crop' // sliced rustic loaf

/* lerp + clamp for the daybreak warm-up */
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** Smoothstep — gives the dawn an eased, buttery ramp instead of a linear slide. */
const ease = (t: number) => t * t * (3 - 2 * t)
/** Mix two hex colours by t (0..1). */
function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  const c = pa.map((v, i) => Math.round(lerp(v, pb[i], t)))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

/* Live "is it open now" from sample hours (purely for the visit block badge). */
function openNow(): { open: boolean; label: string } {
  const now = new Date()
  const dow = now.getDay()
  const mins = now.getHours() * 60 + now.getMinutes()
  const row = HOURS.find((h) => h.days.includes(dow))
  if (row && row.open != null && row.close != null && mins >= row.open && mins < row.close) {
    return { open: true, label: 'Opið núna' }
  }
  return { open: false, label: 'Lokað núna' }
}

/* ── Small ornaments ──────────────────────────────────────────────────── */

/** Thin warm light-sweep that sits under a section eyebrow. */
function Sweep({ color = BUTTER }: { color?: string }) {
  return (
    <span
      aria-hidden="true"
      className="mt-3 block h-px w-16 rounded-full"
      style={{ background: `linear-gradient(90deg, ${color}, ${color}00)` }}
    />
  )
}

/** A wheat-ear mark drawn in SVG. */
function Wheat({ className = '', stroke = CRUST_TEXT }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 24 48" className={className} aria-hidden="true" fill="none">
      <path d="M12 46V10" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 12 + i * 6
        return (
          <g key={i}>
            <path d={`M12 ${y} C7 ${y - 1} 5 ${y + 3} 4 ${y + 6}`} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
            <path d={`M12 ${y} C17 ${y - 1} 19 ${y + 3} 20 ${y + 6}`} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
          </g>
        )
      })}
      <path d="M12 8 C9 4 12 2 12 0 C12 2 15 4 12 8Z" fill={BUTTER} />
    </svg>
  )
}

/** Steam-rise drawn with three CSS-animated strands (gated by reduce). */
function Steam({ reduce }: { reduce: boolean | null }) {
  if (reduce) return null
  return (
    <span aria-hidden="true" className="sb-steam">
      <i style={{ animationDelay: '0s' }} />
      <i style={{ animationDelay: '1.1s' }} />
      <i style={{ animationDelay: '2.2s' }} />
    </span>
  )
}

/* ── On-counter reveal (set-on-the-tray) — below-the-fold only ───────────
   IntersectionObserver + CSS transition (NOT framer whileInView, whose rAF
   tween stalls in this preview). One-shot; degrades to fully visible when
   reduced-motion is set or IO is unavailable. */
function Counter({
  children,
  reduce,
  delay = 0,
  as = 'div',
  className = '',
  style,
}: {
  children: ReactNode
  reduce: boolean | null
  delay?: number
  as?: 'div' | 'li' | 'section'
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (reduce) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    // Already in (or above) the viewport on mount? Reveal immediately.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    // Safety net: never let content stay hidden if the observer misfires.
    const failsafe = window.setTimeout(() => setShown(true), 1200)
    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [reduce])

  const revealStyle: CSSProperties = reduce
    ? {}
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(26px)',
        transition: `opacity 0.6s cubic-bezier(.16,.84,.3,1) ${delay}s, transform 0.6s cubic-bezier(.16,.84,.3,1) ${delay}s`,
        willChange: 'opacity, transform',
      }

  const Tag = as
  return (
    <Tag ref={ref as Ref<never>} className={className} style={{ ...revealStyle, ...style }}>
      {children}
    </Tag>
  )
}

export default function Page() {
  const reduce = useReducedMotion()
  const [dawn, setDawn] = useState(reduce ? 1 : 0) // 0 = pre-dawn, 1 = full day
  const [showBar, setShowBar] = useState(false)
  const [freshIdx, setFreshIdx] = useState(0)
  const dawnRef = useRef(reduce ? 1 : 0)
  const status = openNow()

  useEffect(() => {
    document.title = 'Sauðárkróksbakarí · bakað síðan 1880'
    setThemeColor(INDIGO)
  }, [])

  /* Daybreak: manual passive scroll listener drives a 0..1 dawn value over
     the first ~70vh of scroll. (framer useScroll pins at 0 in this preview.)
     Smoothstepped so the warm-up reads as a buttery sunrise, not a linear fade. */
  useEffect(() => {
    if (reduce) {
      setDawn(1)
      setThemeColor(CREAM)
      return
    }
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const span = Math.max(420, window.innerHeight * 0.72)
        const d = ease(clamp01(window.scrollY / span))
        // Only push state when it moves meaningfully — keeps the curve smooth & cheap.
        if (Math.abs(d - dawnRef.current) > 0.004 || (d === 1 && dawnRef.current !== 1) || (d === 0 && dawnRef.current !== 0)) {
          dawnRef.current = d
          setDawn(d)
          setThemeColor(d > 0.5 ? CREAM : INDIGO)
        }
        setShowBar(window.scrollY > span * 0.85)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce])

  /* "Still warm" ticker. */
  useEffect(() => {
    if (reduce) return
    const t = window.setInterval(() => setFreshIdx((i) => (i + 1) % FRESH_LINE.length), 2800)
    return () => window.clearInterval(t)
  }, [reduce])

  /* Hero dawn-driven values (all transform/opacity/colour, no layout shift). */
  const skyTop = mix(INDIGO, '#fbe6c2', dawn)
  const skyMid = mix('#353e5e', '#fbd9a6', dawn) // indigo → warm amber mid-stop
  const skyBottom = mix('#1f2740', '#f3d79a', dawn)
  const sunY = lerp(64, 26, dawn) // % from top — the sun climbs
  const sunScale = lerp(0.78, 1.12, dawn)
  const sunGlow = lerp(0.22, 0.96, dawn)
  const scrimAlpha = lerp(0.6, 0.36, dawn) // photo stays readable; lifts as day breaks (floored at AA)
  const warmWash = lerp(0, 0.55, dawn)
  const starOpacity = lerp(0.7, 0, clamp01(dawn * 1.6)) // pre-dawn stars fade out first
  const eyebrow = mix('#cdd4e6', BUTTER, dawn)

  return (
    <div
      className="min-h-screen font-hanken antialiased"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <PreviewChrome company={company} />

      {/* Signature CSS: steam-rise + sun shimmer + ember pulse (gated by reduced-motion). */}
      <style>{`
        .sb-steam { position:absolute; top:-15px; left:50%; width:38px; height:32px; transform:translateX(-50%); pointer-events:none; }
        .sb-steam i { position:absolute; bottom:0; width:5px; height:5px; border-radius:9999px; background:${BUTTER}; opacity:0; filter:blur(0.5px); }
        .sb-steam i:nth-child(1){ left:7px; }
        .sb-steam i:nth-child(2){ left:17px; }
        .sb-steam i:nth-child(3){ left:27px; }
        .sb-steam i { animation: sbRise 3.6s ease-out infinite; }
        @keyframes sbRise {
          0%   { opacity:0; transform:translateY(0) translateX(0) scale(0.7); }
          22%  { opacity:0.7; }
          60%  { transform:translateY(-16px) translateX(2px) scale(1.1); }
          100% { opacity:0; transform:translateY(-30px) translateX(-2px) scale(1.6); }
        }
        @keyframes sbSun { 0%,100%{ transform:translateX(-50%) scale(1); } 50%{ transform:translateX(-50%) scale(1.05); } }
        @keyframes sbEmber { 0%,100%{ opacity:0.55; } 50%{ opacity:1; } }
        @keyframes sbTwinkle { 0%,100%{ opacity:0.25; } 50%{ opacity:0.9; } }
        @keyframes sbTick { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .sb-card { transition: transform .45s cubic-bezier(.16,.84,.3,1), box-shadow .45s ease, background-color .45s ease, border-color .45s ease; }
        .sb-card:hover { transform: translateY(-4px); }
        @media (prefers-reduced-motion: reduce) {
          .sb-steam, .sb-sun, .sb-ember, .sb-star, .sb-card { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Sticky broadsheet masthead */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ borderColor: `${INK}14`, backgroundColor: `${CREAM}d9` }}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <a href="#top" className="flex items-baseline gap-2 leading-none focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm" style={{ outlineColor: CRUST_TEXT }}>
            <span className="font-young text-lg tracking-tight md:text-xl" style={{ color: INK }}>
              Sauðárkróksbakarí
            </span>
            <span className="hidden font-mono text-[10px] tracking-[0.22em] sm:inline" style={{ color: CRUST_TEXT }}>
              SÍÐAN 1880
            </span>
          </a>
          <div className="flex items-center gap-5">
            <a
              href="#bakkelsi"
              className="hidden text-sm font-medium transition-colors hover:opacity-70 sm:inline focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm"
              style={{ color: `${INK}b3`, outlineColor: CRUST_TEXT }}
            >
              Úr ofninum
            </a>
            <a
              href="#finna"
              lang="is"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#f6efe2] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: INK, outlineColor: INK }}
            >
              Finna okkur
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ───────────────── HERO — the daybreak ───────────────── */}
        <section className="relative overflow-hidden" aria-label="Sauðárkróksbakarí, bakað síðan 1880">
          {/* Dawn sky wash (warms with scroll, three-stop for depth) */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${skyTop} 0%, ${skyMid} 46%, ${skyBottom} 100%)` }}
            aria-hidden="true"
          />
          {/* Pre-dawn stars, fading as the sun rises */}
          <svg className="pointer-events-none absolute inset-x-0 top-0 h-[46%] w-full" aria-hidden="true" style={{ opacity: starOpacity }}>
            {[
              [12, 14], [28, 30], [44, 12], [60, 26], [76, 18], [88, 34],
              [20, 48], [52, 44], [70, 52], [36, 60], [84, 56], [8, 38],
            ].map(([x, y], i) => (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r={i % 3 === 0 ? 1.4 : 1}
                fill="#fff"
                className="sb-star"
                style={{ animation: reduce ? 'none' : `sbTwinkle ${3 + (i % 4)}s ease-in-out ${i * 0.4}s infinite` }}
              />
            ))}
          </svg>
          {/* The low sun, climbing as day breaks */}
          <div
            className="sb-sun pointer-events-none absolute left-1/2 rounded-full"
            aria-hidden="true"
            style={{
              top: `${sunY}%`,
              width: 'min(52vh, 60vw)',
              height: 'min(52vh, 60vw)',
              transform: `translateX(-50%) scale(${sunScale})`,
              background: `radial-gradient(circle, rgba(232,185,94,${sunGlow}) 0%, rgba(232,185,94,${sunGlow * 0.42}) 36%, transparent 70%)`,
              filter: 'blur(2px)',
              animation: reduce ? 'none' : 'sbSun 8s ease-in-out infinite',
            }}
          />

          {/* Bread photograph, low, grounding the page */}
          <div className="absolute inset-x-0 bottom-0 h-[60%]">
            <Img
              src={HERO}
              srcSet={HERO_SRCSET}
              sizes="100vw"
              alt="Nýbökuð rúg- og fræbrauð á dökku borði, böðuð morgunljósi"
              className="h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-t from-[#2a1c12] to-[#7a3d16]"
              fetchpriority="high"
              loading="eager"
            />
            {/* scrim that lifts as the day breaks (keeps AA either way) */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${skyBottom} 0%, rgba(42,28,18,${scrimAlpha}) 44%, rgba(42,28,18,${Math.min(0.9, scrimAlpha + 0.2)}) 100%)`,
              }}
              aria-hidden="true"
            />
            {/* warm light sweeping up from the oven */}
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{ background: `linear-gradient(0deg, rgba(232,185,94,${warmWash}) 0%, transparent 56%)` }}
            />
          </div>

          <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-between px-5 pt-24 pb-16 md:px-8 md:pt-28 md:pb-24">
            {/* top line: the quiet "still here" note */}
            <div className="flex items-center gap-3">
              <Wheat className="h-9 w-5 shrink-0" stroke={mix('#aeb6cd', BUTTER, dawn)} />
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase" style={{ color: eyebrow }}>
                Sauðárkrókur · Skagafjörður
              </p>
            </div>

            {/* headline block, bottom-anchored — NOT opacity-gated (hero safety) */}
            <div className="max-w-3xl">
              <p className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: mix('#dfe4f1', BUTTER, dawn) }}>
                Ofninn er kveiktur fyrir allar aldir
              </p>

              <h1
                className="mt-4 font-young leading-[1.08] text-[#f6efe2]"
                style={{ fontSize: 'clamp(2.5rem, 9vw, 4.75rem)', paddingBottom: '0.1em' }}
              >
                Bakað á Sauðárkróki
                <span className="block" style={{ color: BUTTER, textShadow: '0 1px 30px rgba(232,185,94,0.25)' }}>
                  síðan 1880
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#f6efe2]/90 sm:text-lg">
                Eitt elsta bakarí landsins, í hjarta gamla bæjarins. Brauð, kökur og kaffi, nýtt úr
                ofninum á hverjum morgni. Vefurinn rann úr gildi, en bakaríið stendur enn.
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#finna"
                  lang="is"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-sm font-semibold text-[#2a1c12] shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ backgroundColor: BUTTER, outlineColor: CREAM }}
                >
                  Finna okkur
                </a>
                <a
                  href={`tel:${VISIT.tel}`}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-[#f6efe2]/45 px-6 text-sm font-semibold text-[#f6efe2] backdrop-blur-sm transition-colors hover:bg-[#f6efe2]/10 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: CREAM }}
                >
                  Hringja · {VISIT.telLabel}
                </a>
              </div>

              {/* "still warm" ticker */}
              <div
                className="mt-8 flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase"
                style={{ color: '#f6efe2cc' }}
                aria-hidden="true"
              >
                <span
                  className="sb-ember inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: BUTTER, boxShadow: `0 0 8px ${BUTTER}`, animation: reduce ? 'none' : 'sbEmber 2s ease-in-out infinite' }}
                />
                <span className="relative inline-block h-4 overflow-hidden">
                  {/* Keyed remount + pure-CSS slide-in (no framer rAF dependency). */}
                  <span
                    key={freshIdx}
                    className="block whitespace-nowrap"
                    style={{ animation: reduce ? 'none' : 'sbTick 0.45s cubic-bezier(.16,.84,.3,1) both' }}
                  >
                    {FRESH_LINE[freshIdx]}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* dawn-progress scroll cue (decorative, fades as the sun rises) */}
          <div
            className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
            aria-hidden="true"
            style={{ opacity: 1 - dawn }}
          >
            <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-[#f6efe2]/70">Skrunaðu · dagur rennur</span>
            <span className="block h-7 w-px" style={{ background: `linear-gradient(${BUTTER}, transparent)` }} />
          </div>
        </section>

        {/* ───────────────── HEITT ÚR OFNINUM (the daily board) ───────────────── */}
        <section id="bakkelsi" className="relative px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: CRUST_TEXT }}>
                  Heitt úr ofninum
                </p>
                <Sweep />
                <h2 className="mt-4 font-young leading-[1.05]" style={{ color: INK, fontSize: 'clamp(2rem, 6vw, 3.25rem)', paddingBottom: '0.06em' }}>
                  Það sem bakað er í dag
                </h2>
                <p className="mt-4 text-base leading-relaxed" style={{ color: `${INK}cc` }}>
                  Allt hnoðað og bakað á staðnum, eftir gömlum uppskriftum. Tímarnir sýna hvenær hver
                  flokkur kemur úr ofninum á venjulegum morgni.
                </p>
              </div>
              {/* live "úr ofninum núna" chip */}
              <div
                className="flex shrink-0 items-center gap-2.5 self-start rounded-full border px-4 py-2 sm:self-end"
                style={{ borderColor: `${EMBER}55`, backgroundColor: `${BUTTER}1f` }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  {!reduce && (
                    <span className="absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: EMBER, animation: 'sbEmber 1.8s ease-in-out infinite' }} aria-hidden="true" />
                  )}
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: EMBER }} />
                </span>
                <span className="font-mono text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: TOASTED }}>
                  Bakað á morgnana
                </span>
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BAKES.map((b, i) => (
                <Counter
                  key={b.id}
                  as="li"
                  reduce={reduce}
                  delay={(i % 3) * 0.06}
                  className="sb-card group flex flex-col justify-between rounded-2xl border p-6"
                  style={{ borderColor: `${INK}1f`, backgroundColor: CREAM }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative">
                        {b.steams && <Steam reduce={reduce} />}
                        <h3 className="font-young text-2xl leading-snug" style={{ color: TOASTED, paddingBottom: '0.04em' }}>
                          {b.name}
                        </h3>
                        <span className="mt-0.5 block font-mono text-[10px] tracking-[0.14em] uppercase" style={{ color: `${INK}80` }}>
                          {b.en}
                        </span>
                      </div>
                      {/* oven-time stamp */}
                      <span
                        className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.06em]"
                        style={{ backgroundColor: b.steams ? `${EMBER}22` : `${INK}0d`, color: b.steams ? TOASTED : `${INK}99` }}
                      >
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {b.oven}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: `${INK}cc` }}>
                      {b.blurb}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: `${INK}12` }}>
                    <span className="text-sm font-medium" style={{ color: INK }}>
                      {b.pick}
                    </span>
                    <span className="rounded-full px-3 py-1 font-mono text-xs font-semibold" style={{ backgroundColor: `${BUTTER}33`, color: CRUST_TEXT }}>
                      {b.price}
                    </span>
                  </div>
                </Counter>
              ))}
            </ul>

            <p className="mt-6 font-mono text-[11px] tracking-[0.08em]" style={{ color: `${INK}80` }}>
              Verð og tímar eru sýnishorn (sample prices &amp; times).
            </p>
          </div>
        </section>

        {/* ───────────────── HERITAGE — 1880 ───────────────── */}
        <section className="relative overflow-hidden px-5 py-20 md:px-8 md:py-28" style={{ backgroundColor: PAPER2 }}>
          {/* faint oversized ghost year, anchoring the band */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-6 select-none font-young leading-none sm:-right-6"
            style={{ fontSize: 'clamp(9rem, 26vw, 22rem)', color: `${TOASTED}0f` }}
          >
            1880
          </span>

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: CRUST_TEXT }}>
                Sagan · síðan 1880
              </p>
              <Sweep />
              {/* big year device */}
              <div className="mt-6 flex items-end gap-4">
                <span className="font-young leading-none" style={{ color: TOASTED, fontSize: 'clamp(4rem, 14vw, 7rem)' }}>
                  1880
                </span>
                <span className="mb-2 font-mono text-xs tracking-[0.14em] uppercase" style={{ color: `${INK}99` }}>
                  bakað í
                  <br />
                  146 ár
                </span>
              </div>

              <h2 className="mt-6 font-young leading-tight" style={{ color: INK, fontSize: 'clamp(1.85rem, 5vw, 2.6rem)', paddingBottom: '0.06em' }}>
                Sama horn, sami ofn, sama handverk
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed" style={{ color: `${INK}d9` }}>
                <p>
                  Sauðárkróksbakarí hefur staðið við Aðalgötu frá árinu 1880 og er eitt elsta bakarí
                  landsins. Hér er bakað á staðnum, í höndunum, með hráefni úr héraði þar sem það er
                  hægt.
                </p>
                <p>
                  Á bak við búðina er ofninn enn kveiktur fyrir allar aldir. Gestir geta sest niður
                  með kaffi og nýbakað, því hér eru fjörutíu sæti inni og úti.
                </p>
              </div>

              {/* heritage timeline */}
              <ol className="mt-8 space-y-0 border-l-2" style={{ borderColor: `${TOASTED}40` }}>
                {TIMELINE.map((t, i) => (
                  <li key={i} className="relative pl-6 pb-6 last:pb-0">
                    <span
                      className="absolute -left-[7px] top-1 block h-3 w-3 rounded-full border-2"
                      style={{ backgroundColor: i === TIMELINE.length - 1 ? BUTTER : PAPER2, borderColor: TOASTED }}
                      aria-hidden="true"
                    />
                    <span className="font-young text-lg" style={{ color: CRUST_TEXT }}>
                      {t.year}
                    </span>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: `${INK}cc` }}>
                      {t.note}
                    </p>
                  </li>
                ))}
              </ol>

              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl" style={{ backgroundColor: `${INK}14` }}>
                {HERITAGE_STATS.map((s) => (
                  <div key={s.label} className="px-5 py-4" style={{ backgroundColor: PAPER2 }}>
                    <dt className="font-young leading-none" style={{ color: CRUST_TEXT, fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', paddingBottom: '0.04em' }}>
                      {s.value}
                    </dt>
                    <dd className="mt-1 font-mono text-[10px] tracking-[0.1em] uppercase" style={{ color: `${INK}99` }}>
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* photo pair, set on the counter */}
            <Counter reduce={reduce} className="relative">
              <div className="overflow-hidden rounded-3xl shadow-xl">
                <Img
                  src={CASE_IMG}
                  alt="Borðskápur fullur af nýbökuðu brauði og kruðeríi í hlýju ljósi"
                  className="aspect-[4/5] w-full object-cover"
                  fallbackClassName="bg-gradient-to-br from-[#7a3d16] to-[#2a1c12]"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 w-40 overflow-hidden rounded-2xl border-4 shadow-lg sm:w-52" style={{ borderColor: PAPER2 }}>
                <Img
                  src={SLICE_IMG}
                  alt="Sneitt fræbrauð á viðarbretti"
                  className="aspect-[4/3] w-full object-cover"
                  fallbackClassName="bg-gradient-to-br from-[#e8b95e] to-[#7a3d16]"
                />
              </div>
              {/* "frá 1880" wax-seal style stamp */}
              <div
                className="absolute -right-3 -top-3 flex h-20 w-20 rotate-6 flex-col items-center justify-center rounded-full border-2 text-center shadow-md sm:h-24 sm:w-24"
                style={{ backgroundColor: TOASTED, borderColor: BUTTER }}
                aria-hidden="true"
              >
                <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-[#f6efe2]/80">Bakað frá</span>
                <span className="font-young text-xl leading-none text-[#f6efe2] sm:text-2xl">1880</span>
              </div>
            </Counter>
          </div>
        </section>

        {/* ───────────────── TRUST ───────────────── */}
        <section className="relative px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <p className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: CRUST_TEXT }}>
                  Hvað fólk segir
                </p>
                <Sweep />
                <h2 className="mt-4 font-young leading-[1.05]" style={{ color: INK, fontSize: 'clamp(2rem, 6vw, 3.25rem)', paddingBottom: '0.06em' }}>
                  4,7 stjörnur og Travelers&rsquo; Choice
                </h2>
                <p className="mt-4 text-base leading-relaxed" style={{ color: `${INK}cc` }}>
                  Á Tripadvisor hefur bakaríið 4,7 stjörnur og hlaut Travelers&rsquo; Choice
                  viðurkenninguna. Umsagnirnar hér að neðan eru sýnishorn.
                </p>
              </div>
              {/* Travelers' Choice badge — the one real award */}
              <div className="flex shrink-0 items-center gap-3 rounded-2xl border px-5 py-4" style={{ borderColor: `${INK}1a`, backgroundColor: CREAM }}>
                <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
                  <circle cx="24" cy="20" r="13" fill="none" stroke={CRUST_TEXT} strokeWidth="2" />
                  <path d="M24 12l2.6 5.3 5.8.8-4.2 4.1 1 5.8L24 25.3 18.8 28l1-5.8-4.2-4.1 5.8-.8z" fill={BUTTER} />
                  <path d="M17 31l-3 11 10-5 10 5-3-11" fill="none" stroke={CRUST_TEXT} strokeWidth="2" strokeLinejoin="round" />
                </svg>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-young text-3xl leading-none" style={{ color: CRUST_TEXT }}>4,7</span>
                    <div className="flex gap-0.5" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill={i < 4 ? BUTTER : `${BUTTER}66`}>
                          <path d="M10 1.6l2.5 5.1 5.6.8-4 4 1 5.6L10 14.4 4.9 17l1-5.6-4-4 5.6-.8z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.1em] uppercase" style={{ color: `${INK}99` }}>
                    Tripadvisor · raunveruleg viðurkenning
                  </p>
                </div>
              </div>
            </div>

            <ul className="grid gap-4 md:grid-cols-3">
              {REVIEWS.map((r, i) => (
                <Counter
                  key={i}
                  as="li"
                  reduce={reduce}
                  delay={i * 0.07}
                  className="sb-card flex flex-col rounded-2xl border p-6"
                  style={{ borderColor: `${INK}1a`, backgroundColor: CREAM }}
                >
                  <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill={BUTTER}>
                    <path d="M10 7H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2H6v2h4zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2h-2v2h4z" />
                  </svg>
                  <p className="mt-4 flex-1 text-base leading-relaxed" style={{ color: INK }}>
                    {r.quote}
                  </p>
                  <div className="mt-5 flex items-center gap-2 border-t pt-4" style={{ borderColor: `${INK}12` }}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full font-young text-sm" style={{ backgroundColor: `${BUTTER}33`, color: TOASTED }} aria-hidden="true">
                      {r.author.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: INK }}>
                        {r.author}
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.08em] uppercase" style={{ color: `${INK}80` }}>
                        {r.meta}
                      </p>
                    </div>
                  </div>
                </Counter>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────────────── FINNDU OKKUR ───────────────── */}
        <section id="finna" className="relative px-5 py-20 md:px-8 md:py-28" style={{ backgroundColor: INK }}>
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: BUTTER }}>
                Finndu okkur
              </p>
              <Sweep color={BUTTER} />
              <h2 className="mt-4 font-young leading-[1.05] text-[#f6efe2]" style={{ fontSize: 'clamp(2rem, 6vw, 3.25rem)', paddingBottom: '0.06em' }}>
                Aðalgata 5, í hjarta bæjarins
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#f6efe2]/75">
                Gamli bærinn á Sauðárkróki, steinsnar frá höfninni. Hringdu á undan eða líttu bara
                við. Ofninn er heitur frá morgni.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
              {/* practical column */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* address */}
                <div className="rounded-2xl border border-[#f6efe2]/15 p-6" style={{ backgroundColor: '#ffffff06' }}>
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: BUTTER }}>
                    Heimilisfang
                  </p>
                  <p className="mt-3 font-young text-xl text-[#f6efe2]" style={{ paddingBottom: '0.04em' }}>
                    {VISIT.street}
                  </p>
                  <p className="text-[#f6efe2]/80">{VISIT.town}</p>
                  <p className="text-sm text-[#f6efe2]/60">{VISIT.region}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Sauðárkróksbakarí, Aðalgata 5, Sauðárkrókur')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ color: BUTTER, outlineColor: BUTTER }}
                  >
                    Opna í kortum
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>

                {/* hours (sample) — with live open/closed read */}
                <div className="rounded-2xl border border-[#f6efe2]/15 p-6" style={{ backgroundColor: '#ffffff06' }}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: BUTTER }}>
                      Opnunartími
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold tracking-[0.1em] uppercase"
                      style={{
                        backgroundColor: status.open ? '#8fd19e22' : '#f6efe212',
                        color: status.open ? '#a7e3b5' : '#f6efe299',
                      }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.open ? '#7ec98f' : '#f6efe277' }} aria-hidden="true" />
                      {status.label}
                    </span>
                  </div>
                  <dl className="mt-3 space-y-2.5">
                    {HOURS.map((h) => (
                      <div key={h.day} className="flex items-baseline justify-between gap-3">
                        <dt className="text-sm text-[#f6efe2]/85">{h.day}</dt>
                        <dd className="shrink-0 font-mono text-sm text-[#f6efe2]">{h.hours}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 font-mono text-[9px] tracking-[0.1em] uppercase text-[#f6efe2]/45">Sýnishorn</p>
                </div>

                {/* call */}
                <a
                  href={`tel:${VISIT.tel}`}
                  className="group flex min-h-[44px] flex-col justify-center rounded-2xl p-6 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ backgroundColor: BUTTER, color: INK, outlineColor: BUTTER }}
                >
                  <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: TOASTED }}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" strokeLinejoin="round" />
                    </svg>
                    Hringja
                  </span>
                  <span className="mt-2 font-young text-2xl" style={{ paddingBottom: '0.04em' }}>
                    {VISIT.telLabel}
                  </span>
                </a>

                {/* email */}
                <a
                  href={`mailto:${VISIT.email}`}
                  className="flex min-h-[44px] flex-col justify-center rounded-2xl border border-[#f6efe2]/15 p-6 transition-colors hover:bg-[#f6efe2]/5 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ backgroundColor: '#ffffff06', outlineColor: BUTTER }}
                >
                  <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: BUTTER }}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Netfang
                  </span>
                  <span className="mt-2 text-sm break-all text-[#f6efe2]/90">{VISIT.email}</span>
                </a>
              </div>

              {/* bespoke map block (SVG) — Skagafjörður coastline + old-town grid */}
              <Counter reduce={reduce} className="relative">
                <div className="relative h-full min-h-[300px] overflow-hidden rounded-3xl border border-[#f6efe2]/15">
                  <svg viewBox="0 0 400 340" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
                    <defs>
                      <radialGradient id="sbMapGlow" cx="50%" cy="48%" r="42%">
                        <stop offset="0%" stopColor={BUTTER} stopOpacity="0.22" />
                        <stop offset="100%" stopColor={BUTTER} stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="sbMapBg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#27190f" />
                        <stop offset="100%" stopColor="#1c120b" />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="340" fill="url(#sbMapBg)" />
                    {/* the fjord / sea, west side, with a soft shoreline */}
                    <path d="M0 0 L138 0 C128 60 150 120 110 180 C84 230 100 280 64 330 L0 340 Z" fill="#2c3550" opacity="0.62" />
                    <path d="M138 0 C128 60 150 120 110 180 C84 230 100 280 64 330" fill="none" stroke={BUTTER} strokeOpacity="0.4" strokeWidth="1.5" />
                    {/* harbour pier hint */}
                    <path d="M64 250 L98 243" stroke={BUTTER} strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" />
                    {/* street grid (old-town blocks) */}
                    {[64, 116, 168, 220, 272].map((y) => (
                      <line key={`h${y}`} x1="150" y1={y} x2="384" y2={y} stroke={BUTTER} strokeOpacity="0.22" strokeWidth="1.4" />
                    ))}
                    {[200, 268, 336].map((x) => (
                      <line key={`v${x}`} x1={x} y1="24" x2={x} y2="316" stroke={BUTTER} strokeOpacity="0.22" strokeWidth="1.4" />
                    ))}
                    {/* Aðalgata, the main street — soft glow then bright stroke */}
                    <line x1="200" y1="24" x2="200" y2="316" stroke={BUTTER} strokeOpacity="0.18" strokeWidth="9" strokeLinecap="round" />
                    <line x1="200" y1="24" x2="200" y2="316" stroke={BUTTER} strokeOpacity="0.85" strokeWidth="3" />
                    {/* a cross street through the marker */}
                    <line x1="150" y1="168" x2="384" y2="168" stroke={BUTTER} strokeOpacity="0.5" strokeWidth="2" />
                    {/* warm glow under the marker */}
                    <rect width="400" height="340" fill="url(#sbMapGlow)" />
                    {/* the marker pin */}
                    <g transform="translate(200 168)">
                      <circle r="30" fill={BUTTER} opacity="0.18">
                        <animate attributeName="r" values="22;34;22" dur="3.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.26;0.05;0.26" dur="3.2s" repeatCount="indefinite" />
                      </circle>
                      <path d="M0 15 C-10 2 -12 -7 0 -15 C12 -7 10 2 0 15 Z" fill={BUTTER} stroke="#1c120b" strokeWidth="1" />
                      <circle cx="0" cy="-4" r="4.5" fill="#1c120b" />
                    </g>
                    {/* marker label, with a subtle backing for legibility */}
                    <rect x="214" y="150" width="166" height="34" rx="6" fill="#1c120b" opacity="0.55" />
                    <text x="222" y="166" fill="#f6efe2" fontSize="12" fontFamily="ui-monospace, monospace" opacity="0.95">Aðalgata 5</text>
                    <text x="222" y="179" fill={BUTTER} fontSize="8.5" fontFamily="ui-monospace, monospace" opacity="0.9" letterSpacing="0.8">SAUÐÁRKRÓKSBAKARÍ</text>
                    {/* place + cardinal hints */}
                    <text x="156" y="40" fill="#f6efe2" fontSize="9" fontFamily="ui-monospace, monospace" opacity="0.5" letterSpacing="1">SKAGAFJÖRÐUR</text>
                    <text x="100" y="120" fill="#cdd4e6" fontSize="9" fontFamily="ui-monospace, monospace" opacity="0.55" letterSpacing="1" transform="rotate(-58 100 120)">FJÖRÐURINN</text>
                    {/* tiny compass */}
                    <g transform="translate(366 36)" opacity="0.7">
                      <circle r="11" fill="none" stroke={BUTTER} strokeOpacity="0.4" strokeWidth="1" />
                      <path d="M0 -8 L3 1 L0 -1 L-3 1 Z" fill={BUTTER} />
                      <text x="0" y="-12" fill="#f6efe2" fontSize="7" fontFamily="ui-monospace, monospace" textAnchor="middle" opacity="0.8">N</text>
                    </g>
                  </svg>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Sauðárkróksbakarí, Aðalgata 5, Sauðárkrókur')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-4 bottom-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ backgroundColor: BUTTER, color: INK, outlineColor: BUTTER }}
                  >
                    Sjá leiðina
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </Counter>
            </div>
          </div>
        </section>
      </main>

      {/* ── Mobile sticky CTA bar (centered, clears the chrome corners) ── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 transition-transform duration-300 md:hidden ${
          showBar ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div
          className="mx-auto flex max-w-md items-center gap-2 px-3 pt-2 pb-3"
          style={{ background: `linear-gradient(180deg, transparent, ${CREAM} 38%)` }}
        >
          <a
            href={`tel:${VISIT.tel}`}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold text-[#f6efe2] shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: TOASTED, outlineColor: TOASTED }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" strokeLinejoin="round" />
            </svg>
            Hringja
          </a>
          <a
            href="#finna"
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: BUTTER, color: INK, outlineColor: BUTTER }}
          >
            Finna okkur
          </a>
        </div>
      </div>

      {/* bottom padding so content clears the sticky bar + chrome */}
      <div aria-hidden="true" className="h-24 md:h-0" style={{ backgroundColor: INK }} />

      <PreviewFooter company={company} />
    </div>
  )
}
