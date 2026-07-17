import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Lenis from 'lenis'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  BATH,
  BOOKING,
  BOOKING_URL,
  CONTACT_DIRECT,
  CONTACT_PRIMARY,
  DISCLOSURE,
  DUSK,
  FARM,
  HERO,
  IMG,
  MAPS_URL,
  MIDDAY,
  MORNING,
  NIGHT,
  QUOTES,
  REVIEWS,
  ROOM_AMENITIES,
  ROOM_DETAILS,
  ROOMS,
  ROOMS_INTRO,
} from './data'
import type { Room } from './data'

const company = getPreviewCompany('seljavellir')

/* ── Palette — pulled from the photography (brief section C), not a default ──
 * GROUND #0F1210 near-black warm charcoal (mountain silhouettes)
 * INK    #F3EFE6 warm off-white (their own interior walls)   15.8:1 AAA
 * GOLD   #E8A33D fb-1 sunset / sconce light                   7.9:1 AA on GROUND
 * DAY    #F3EFE6 daylight ground · DAY_INK #151915           14.9:1 AAA
 * BLUE   #3F7CA6 day-sky (midday chapter only)
 * AURORA #5FA88C muted aurora green (night chapter only)      */
const GROUND = '#0F1210'
const DUSK_GROUND = '#191310'
const INK = '#F3EFE6'
const MUTED_DARK = 'rgba(243,239,230,.72)'
const DAY = '#F3EFE6'
const DAY_INK = '#151915'
const DAY_MUTED = '#55524A'
const GOLD = '#E8A33D'
const GOLD_DARK = '#8A5A10' // gold voice on the light daytime ground (5.6:1)
const BLUE = '#3F7CA6'
const AURORA = '#5FA88C'
const HAIR_DARK = 'rgba(243,239,230,.14)'
const HAIR_DAY = 'rgba(21,25,21,.14)'
const EASE = 'cubic-bezier(.22,.68,.2,1)'

const FRAUNCES: CSSProperties['fontFamily'] = "'Fraunces', Georgia, serif"
const MONO: CSSProperties['fontFamily'] = "'Space Mono', ui-monospace, monospace"

const FOCUS_DARK =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A33D]'
const FOCUS_DAY =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#151915]'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* held so every programmatic scroll (nav, CTAs, rail cluster) routes through
 * the active Lenis loop instead of fighting it with native smooth-scroll */
let lenisInstance: Lenis | null = null

const scrollToId = (id: string) => {
  const reduced = prefersReduced()
  if (lenisInstance) {
    lenisInstance.scrollTo(`#${id}`, { immediate: reduced })
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
}

const scrollToTop = () => {
  const reduced = prefersReduced()
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: reduced })
    return
  }
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

/* ── Reveal — IO on the (untransformed until shown) element itself; the
 * failsafe is the initial in-viewport check, per ledger #25 no blanket
 * timeout that would force-show below-fold reveals. Reduced motion renders
 * plainly from the first frame. ─────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  y = 20,
  dur = 0.7,
  className = '',
  style,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  dur?: number
  className?: string
  style?: CSSProperties
  as?: 'div' | 'figure' | 'li' | 'p'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(() => prefersReduced())
  const [settled, setSettled] = useState(() => prefersReduced())
  useEffect(() => {
    if (prefersReduced()) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!shown || settled) return
    const t = window.setTimeout(() => setSettled(true), dur * 1000 + delay + 80)
    return () => window.clearTimeout(t)
  }, [shown, settled, dur, delay])
  const Tag = as
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={
        settled
          ? { ...style, opacity: 1 }
          : {
              ...style,
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : `translateY(${y}px)`,
              transition: `opacity ${dur}s ${EASE} ${delay}ms, transform ${dur}s ${EASE} ${delay}ms`,
            }
      }
    >
      {children}
    </Tag>
  )
}

/* ── ClipPhoto — standalone content image with an explicit aspect box; the
 * wrapper (never transformed) is the observer target, the inner image wipes
 * open. Full-bleed SECTION backgrounds never use this (ledger #7/#12) — they
 * render eagerly below. ─────────────────────────────────────────────────── */
function ClipPhoto({
  src,
  alt,
  className = '',
  hoverZoom = false,
}: {
  src: string
  alt: string
  className?: string
  hoverZoom?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(() => prefersReduced())
  const [settled, setSettled] = useState(() => prefersReduced())
  useEffect(() => {
    if (prefersReduced()) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!shown || settled) return
    const t = window.setTimeout(() => setSettled(true), 1300)
    return () => window.clearTimeout(t)
  }, [shown, settled])
  return (
    <div ref={ref} className={`overflow-hidden ${hoverZoom ? 'sv-zoom' : ''} ${className}`}>
      <Img
        src={src}
        alt={alt}
        className="block h-full w-full object-cover"
        style={
          settled
            ? undefined
            : {
                clipPath: shown ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
                transform: shown ? 'scale(1)' : 'scale(1.07)',
                transition: `clip-path .9s ${EASE}, transform 1.25s ${EASE}`,
              }
        }
        fallbackClassName="bg-gradient-to-br from-[#3a4238] to-[#141814]"
      />
    </div>
  )
}

/* ── TimeMark — the "one day" structural conceit: a Space Mono timestamp +
 * chapter label opens every chapter, like a guestbook entry. ────────────── */
function TimeMark({ time, label, tone }: { time: string; label: string; tone: 'dark' | 'day' }) {
  const accent = tone === 'dark' ? GOLD : GOLD_DARK
  const sub = tone === 'dark' ? MUTED_DARK : DAY_MUTED
  return (
    <div className="flex items-center gap-3">
      <span className="text-[15px] font-bold tabular-nums" style={{ fontFamily: MONO, color: accent }}>
        {time}
      </span>
      <span aria-hidden className="h-px w-9" style={{ background: accent, opacity: 0.6 }} />
      <span
        className="text-[11px] font-bold uppercase tracking-[0.22em]"
        style={{ fontFamily: MONO, color: sub }}
      >
        {label}
      </span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   THE LIGHT RAIL — the ONE scroll-linked signature. A thin fixed rail on the
   left edge runs the whole day: pre-dawn indigo fills to sunrise gold, peaks
   blue-bright at midday (width pulse + glow), deepens to amber at dusk and
   ends aurora-green with a cluster of lit "farmhouse windows" that anchors
   the booking CTA. All values written raw per frame off scrollYProgress —
   no CSS transitions on any scrubbed property. Decorative parts aria-hidden;
   the window cluster is a real button outside the decorative wrapper.
   ══════════════════════════════════════════════════════════════════════════ */
const RAIL_GRADIENT = `linear-gradient(180deg, #2A3557 0%, ${GOLD} 18%, ${BLUE} 50%, #C8722F 75%, ${AURORA} 100%)`
const RAIL_STOPS: Array<[number, string]> = [
  [0, '#2A3557'],
  [0.18, GOLD],
  [0.5, BLUE],
  [0.75, '#C8722F'],
  [1, AURORA],
]
const hexRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
]
function railColor(p: number): string {
  for (let i = 1; i < RAIL_STOPS.length; i++) {
    if (p <= RAIL_STOPS[i][0]) {
      const [p0, c0] = RAIL_STOPS[i - 1]
      const [p1, c1] = RAIL_STOPS[i]
      const t = p1 === p0 ? 0 : (p - p0) / (p1 - p0)
      const a = hexRgb(c0)
      const b = hexRgb(c1)
      const m = a.map((v, k) => Math.round(v + (b[k] - v) * t))
      return `rgb(${m[0]},${m[1]},${m[2]})`
    }
  }
  return RAIL_STOPS[RAIL_STOPS.length - 1][1]
}

function LightRail() {
  const reduced = prefersReduced()
  const { scrollYProgress } = useScroll()
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const clusterRef = useRef<HTMLButtonElement>(null)
  const [clusterOn, setClusterOn] = useState(reduced)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return
    const track = trackRef.current
    const fill = fillRef.current
    const dot = dotRef.current
    const cluster = clusterRef.current
    if (!track || !fill || !dot) return
    fill.style.clipPath = `inset(0 0 ${((1 - v) * 100).toFixed(2)}% 0)`
    const c = railColor(v)
    const midGlow = Math.exp(-((v - 0.5) ** 2) / 0.02) // brightest + widest at midday
    dot.style.top = `${(v * 100).toFixed(2)}%`
    dot.style.background = c
    dot.style.boxShadow = `0 0 ${(5 + 13 * midGlow).toFixed(1)}px ${c}`
    track.style.transform = `scaleX(${(1 + midGlow * 0.9).toFixed(3)})`
    if (cluster) cluster.style.opacity = Math.min(1, Math.max(0, (v - 0.82) / 0.14)).toFixed(2)
    const on = v > 0.85
    setClusterOn((prev) => (prev === on ? prev : on))
  })

  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden w-10 lg:block">
      <div aria-hidden className="absolute bottom-16 left-5 top-24 w-[3px]">
        <div
          ref={trackRef}
          className="absolute inset-0 origin-center overflow-hidden rounded-full"
          style={{ background: 'rgba(243,239,230,.12)' }}
        >
          <div
            ref={fillRef}
            className="absolute inset-0"
            style={{ background: RAIL_GRADIENT, clipPath: reduced ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
          />
        </div>
        <div
          ref={dotRef}
          className="absolute left-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            top: reduced ? '100%' : '0%',
            background: reduced ? AURORA : '#2A3557',
            boxShadow: reduced ? `0 0 6px ${AURORA}` : 'none',
          }}
        />
      </div>
      {/* the lit farmhouse windows — the rail hands off into the booking CTA */}
      <button
        ref={clusterRef}
        type="button"
        aria-label="Fara í bókun"
        tabIndex={clusterOn ? 0 : -1}
        onClick={() => scrollToId('bokun')}
        className={`absolute bottom-4 left-[11px] grid grid-cols-2 gap-[4px] rounded-sm p-1.5 ${
          clusterOn ? 'pointer-events-auto' : ''
        } ${FOCUS_DARK}`}
        style={{ opacity: reduced ? 1 : 0 }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            aria-hidden
            className="h-[5px] w-[5px] rounded-[1px]"
            style={{ background: GOLD, boxShadow: `0 0 7px ${GOLD}` }}
          />
        ))}
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   NAV
   ══════════════════════════════════════════════════════════════════════════ */
const NAV = [
  { id: 'morgunn', label: 'Morgunn' },
  { id: 'herbergi', label: 'Herbergi' },
  { id: 'jokulsarlon', label: 'Jökulsárlón' },
  { id: 'bylid', label: 'Býlið' },
  { id: 'umsagnir', label: 'Umsagnir' },
] as const

function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }
  return (
    <nav
      aria-label="Aðalvalmynd"
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: scrolled || open ? 'rgba(15,18,16,.92)' : 'transparent',
        borderBottom: `1px solid ${scrolled || open ? HAIR_DARK : 'transparent'}`,
        backdropFilter: scrolled || open ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: scrolled || open ? 'blur(10px)' : 'none',
        transition: 'background .3s ease, border-color .3s ease',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8 lg:pl-12">
        <button
          onClick={scrollToTop}
          className={`text-[17px] font-semibold ${FOCUS_DARK}`}
          style={{ fontFamily: FRAUNCES, color: INK }}
        >
          Seljavellir
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`sv-navlink font-sans text-[13.5px] font-medium ${FOCUS_DARK}`}
              style={{ color: INK }}
            >
              {n.label}
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-5 md:flex">
          <a
            href={CONTACT_PRIMARY.phoneHref}
            className={`font-sans text-[13px] font-semibold tabular-nums ${FOCUS_DARK}`}
            style={{ color: MUTED_DARK }}
          >
            {CONTACT_PRIMARY.phone}
          </a>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className={`sv-cta inline-flex min-h-[38px] items-center rounded-full px-5 font-sans text-[13px] font-bold uppercase tracking-[0.08em] ${FOCUS_DARK}`}
            style={{ background: GOLD, color: '#14110B' }}
          >
            Bóka
          </a>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
          className={`grid h-11 w-11 place-items-center md:hidden ${FOCUS_DARK}`}
          style={{ color: INK }}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
            {open ? (
              <path d="M1 1l18 12M19 1 1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t px-5 pb-6 pt-2 md:hidden" style={{ borderColor: HAIR_DARK, background: GROUND }}>
          <div className="flex flex-col">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`border-b py-3.5 text-left font-sans text-[15px] font-medium ${FOCUS_DARK}`}
                style={{ color: INK, borderColor: HAIR_DARK }}
              >
                {n.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={CONTACT_PRIMARY.phoneHref}
              className={`font-sans text-[14px] font-semibold ${FOCUS_DARK}`}
              style={{ color: MUTED_DARK }}
            >
              {CONTACT_PRIMARY.phone}
            </a>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-h-[46px] items-center justify-center rounded-full font-sans text-[14px] font-bold uppercase tracking-[0.08em] ${FOCUS_DARK}`}
              style={{ background: GOLD, color: '#14110B' }}
            >
              Bóka núna
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   1 · HERO — pre-dawn. Mount-choreographed: blue-hour sky grade first, the
   golden panorama clip-reveals from centre, headline and CTAs stagger last.
   ══════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const [mounted, setMounted] = useState(() => prefersReduced())
  useEffect(() => {
    if (prefersReduced()) return
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])
  const reduced = prefersReduced()
  const step = (delay: number): CSSProperties =>
    reduced
      ? {}
      : {
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(16px)',
          transition: `opacity .7s ${EASE} ${delay}ms, transform .7s ${EASE} ${delay}ms`,
        }
  return (
    <header className="relative flex min-h-[100svh] items-end overflow-hidden" style={{ background: GROUND }}>
      {/* full-bleed golden panorama — mount-triggered reveal (ledger #7/#12) */}
      <Img
        src={IMG.hero}
        alt={HERO.alt}
        fetchpriority="high"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover"
        style={
          reduced
            ? undefined
            : {
                clipPath: mounted ? 'inset(0% 0% 0% 0%)' : 'inset(16% 10% 16% 10%)',
                transform: mounted ? 'scale(1)' : 'scale(1.08)',
                transition: `clip-path 1.25s ${EASE} .15s, transform 1.5s ${EASE} .15s`,
              }
        }
        fallbackClassName="bg-gradient-to-b from-[#1B2440] to-[#0F1210]"
      />
      {/* blue-hour grade: cool indigo up top foreshadowing sunrise gold below */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,26,44,.60) 0%, rgba(15,18,16,.32) 42%, rgba(15,18,16,.64) 72%, rgba(15,18,16,.9) 100%)',
          opacity: reduced ? 1 : mounted ? 1 : 0,
          transition: reduced ? undefined : 'opacity .8s ease',
        }}
      />
      {/* text-anchored floor: guarantees legibility over the golden hayfield
          regardless of viewport height, on top of the base blue-hour grade */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          background: 'linear-gradient(180deg, rgba(15,18,16,0) 0%, rgba(15,18,16,.58) 100%)',
          opacity: reduced ? 1 : mounted ? 1 : 0,
          transition: reduced ? undefined : 'opacity .8s ease',
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-[clamp(88px,14vh,140px)] pt-28 md:px-8 lg:pl-12">
        <div
          className="inline-flex rounded-full px-3.5 py-2"
          style={{ ...step(500), background: 'rgba(15,18,16,.55)', backdropFilter: 'blur(4px)' }}
        >
          <TimeMark time={HERO.time} label={HERO.timeLabel} tone="dark" />
        </div>
        <h1
          className="mt-5 max-w-[13ch]"
          style={{
            ...step(620),
            fontFamily: FRAUNCES,
            fontWeight: 560,
            fontSize: 'clamp(2.7rem,7.2vw,5.6rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
            color: INK,
          }}
        >
          {HERO.title}
        </h1>
        <p
          className="mt-5 max-w-[44ch] font-sans text-[15.5px] leading-[1.6] md:text-[17px]"
          style={{ ...step(760), color: 'rgba(243,239,230,.88)' }}
        >
          {HERO.sub}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4" style={step(880)}>
          <button
            onClick={() => scrollToId('herbergi')}
            className={`sv-cta inline-flex min-h-[50px] items-center rounded-full px-7 font-sans text-[14px] font-bold uppercase tracking-[0.08em] ${FOCUS_DARK}`}
            style={{ background: GOLD, color: '#14110B' }}
          >
            {HERO.ctaPrimary}
          </button>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className={`sv-ghost inline-flex min-h-[50px] items-center rounded-full border px-7 font-sans text-[14px] font-bold uppercase tracking-[0.08em] ${FOCUS_DARK}`}
            style={{ borderColor: 'rgba(243,239,230,.4)', color: INK }}
          >
            {HERO.ctaSecondary}
          </a>
        </div>
      </div>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   2 · 06:12 MORGUNMATUR — sunrise; the page turns to daylight. The practical
   facts (check-in/out, breakfast window) live here because no owned website
   existed to answer them.
   ══════════════════════════════════════════════════════════════════════════ */
function Morning() {
  return (
    <section id="morgunn" style={{ background: DAY, color: DAY_INK }} className="py-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:pl-12">
        <div className="grid items-center gap-x-14 gap-y-10 md:grid-cols-2">
          <div>
            <Reveal>
              <TimeMark time={MORNING.time} label={MORNING.timeLabel} tone="day" />
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="mt-5"
                style={{
                  fontFamily: FRAUNCES,
                  fontWeight: 560,
                  fontSize: 'clamp(1.9rem,3.8vw,2.9rem)',
                  lineHeight: 1.12,
                  color: DAY_INK,
                }}
              >
                {MORNING.heading}
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-5 max-w-[52ch] font-sans text-[15.5px] leading-[1.68]" style={{ color: DAY_MUTED }}>
                {MORNING.body}
              </p>
            </Reveal>
            <Reveal delay={210}>
              <a
                href={`mailto:${CONTACT_PRIMARY.email}?subject=${encodeURIComponent('Spurning um morgunmat')}`}
                className={`sv-underline mt-2.5 inline-flex items-center gap-2 py-3.5 font-sans text-[14px] font-bold ${FOCUS_DAY}`}
                style={{ color: GOLD_DARK }}
              >
                <Mail size={15} aria-hidden />
                {MORNING.askLabel}
              </a>
            </Reveal>
            {/* the answers a dead 404 could never give */}
            <Reveal delay={260}>
              <div className="mt-9 rounded-xl border p-5 md:p-6" style={{ borderColor: HAIR_DAY, background: '#FFFFFF' }}>
                <div className="grid grid-cols-3 gap-4">
                  {MORNING.facts.map((f) => (
                    <div key={f.label}>
                      <div
                        className="text-[10.5px] font-bold uppercase tracking-[0.16em]"
                        style={{ fontFamily: MONO, color: GOLD_DARK }}
                      >
                        {f.label}
                      </div>
                      <div className="mt-1.5 font-sans text-[14px] font-semibold leading-snug" style={{ color: DAY_INK }}>
                        {f.value}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 border-t pt-3.5 font-sans text-[12.5px] leading-[1.55]" style={{ borderColor: HAIR_DAY, color: DAY_MUTED }}>
                  {MORNING.factsNote}
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal as="figure" className="m-0" y={26}>
            <ClipPhoto src={IMG.breakfast} alt={MORNING.imageAlt} className="aspect-[4/3] rounded-xl" hoverZoom />
            <figcaption className="mt-2.5 font-sans text-[12px]" style={{ color: DAY_MUTED }}>
              {MORNING.imageNote}
            </figcaption>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   3 · 09:40 HERBERGI OG VERÐ — the booking core: real Booking.com room types,
   the live sample price, honest seasonal framing.
   ══════════════════════════════════════════════════════════════════════════ */
function RoomCard({ room, delay }: { room: Room; delay: number }) {
  return (
    <Reveal
      as="figure"
      delay={delay}
      y={24}
      className="m-0 flex flex-col overflow-hidden rounded-xl border"
      style={{ borderColor: HAIR_DAY, background: '#FFFFFF' }}
    >
      <ClipPhoto src={IMG[room.image]} alt={room.imageAlt} className="aspect-[4/3]" hoverZoom />
      <figcaption className="flex flex-1 flex-col p-5">
        <h3 className="font-sans text-[16px] font-bold leading-snug" style={{ color: DAY_INK }}>
          {room.name}
        </h3>
        <p className="mt-1 font-sans text-[13px]" style={{ color: DAY_MUTED }}>
          {room.beds}
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5">
          {room.specs.map((s) => (
            <li key={s} className="font-sans text-[12.5px] font-medium" style={{ color: DAY_MUTED }}>
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-4">
          <div className="font-sans text-[15px] font-bold tabular-nums" style={{ color: GOLD_DARK }}>
            {room.price}
          </div>
          <div className="mt-0.5 font-sans text-[12px]" style={{ color: DAY_MUTED }}>
            {room.priceNote}
          </div>
        </div>
      </figcaption>
    </Reveal>
  )
}

function Rooms() {
  const featured = ROOMS.find((r) => r.featured) as Room
  const rest = ROOMS.filter((r) => !r.featured)
  return (
    <section id="herbergi" style={{ background: DAY, color: DAY_INK }} className="pb-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:pl-12">
        <Reveal>
          <TimeMark time={ROOMS_INTRO.time} label={ROOMS_INTRO.timeLabel} tone="day" />
        </Reveal>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <Reveal delay={70}>
            <h2
              style={{
                fontFamily: FRAUNCES,
                fontWeight: 560,
                fontSize: 'clamp(1.9rem,3.8vw,2.9rem)',
                lineHeight: 1.12,
                color: DAY_INK,
              }}
            >
              {ROOMS_INTRO.heading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-[30ch] font-sans text-[13.5px] font-semibold leading-snug" style={{ color: GOLD_DARK }}>
              {ROOMS_INTRO.rangeNote}
            </p>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <p className="mt-4 max-w-[62ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: DAY_MUTED }}>
            {ROOMS_INTRO.body}
          </p>
        </Reveal>

        {/* featured: the exact room behind the live sample price */}
        <Reveal delay={120} className="mt-10">
          <div
            className="grid overflow-hidden rounded-xl border md:grid-cols-[3fr_2fr]"
            style={{ borderColor: HAIR_DAY, background: '#FFFFFF' }}
          >
            <ClipPhoto
              src={IMG[featured.image]}
              alt={featured.imageAlt}
              className="aspect-[4/3] md:aspect-auto md:min-h-[340px]"
              hoverZoom
            />
            <div className="flex flex-col p-6 md:p-8">
              <h3 className="font-sans text-[19px] font-bold leading-snug" style={{ color: DAY_INK }}>
                {featured.name}
              </h3>
              <p className="mt-1 font-sans text-[13.5px]" style={{ color: DAY_MUTED }}>
                {featured.beds}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {featured.specs.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border px-3 py-1 font-sans text-[12px] font-semibold"
                    style={{ borderColor: HAIR_DAY, color: DAY_MUTED }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <div className="text-[24px] font-bold tabular-nums" style={{ fontFamily: FRAUNCES, color: DAY_INK }}>
                  {featured.price}
                </div>
                <div className="mt-1 font-sans text-[12.5px]" style={{ color: DAY_MUTED }}>
                  {featured.priceNote}
                </div>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={`sv-cta mt-5 inline-flex min-h-[48px] items-center rounded-full px-7 font-sans text-[13.5px] font-bold uppercase tracking-[0.08em] ${FOCUS_DAY}`}
                  style={{ background: GOLD, color: '#14110B' }}
                >
                  {ROOMS_INTRO.cta}
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((r, i) => (
            <RoomCard key={r.id} room={r} delay={i * 90} />
          ))}
        </div>

        {/* room-detail strip — booking-6 + fb-5, the quiet close-up beat */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4">
          {ROOM_DETAILS.map((d, i) => (
            <Reveal key={d.key} delay={i * 90} y={24}>
              <ClipPhoto src={IMG[d.key]} alt={d.alt} className="aspect-[16/10] rounded-xl" hoverZoom />
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t pt-6" style={{ borderColor: HAIR_DAY }}>
            {ROOM_AMENITIES.map((a) => (
              <li key={a} className="flex items-center gap-2 font-sans text-[13.5px] font-medium" style={{ color: DAY_INK }}>
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-[78ch] font-sans text-[12.5px] leading-[1.6]" style={{ color: DAY_MUTED }}>
            {ROOMS_INTRO.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   4 · 11:05 BAÐHERBERGIN — short trust/detail beat, real photos + Daniel's
   verbatim heated-floors review.
   ══════════════════════════════════════════════════════════════════════════ */
function Bath() {
  return (
    <section style={{ background: DAY, color: DAY_INK }} className="pb-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:pl-12">
        <div className="grid items-start gap-x-14 gap-y-9 md:grid-cols-[2fr_3fr]">
          <div>
            <Reveal>
              <TimeMark time={BATH.time} label={BATH.timeLabel} tone="day" />
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="mt-5"
                style={{
                  fontFamily: FRAUNCES,
                  fontWeight: 560,
                  fontSize: 'clamp(1.7rem,3.2vw,2.4rem)',
                  lineHeight: 1.14,
                  color: DAY_INK,
                }}
              >
                {BATH.heading}
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-4 max-w-[44ch] font-sans text-[15px] leading-[1.65]" style={{ color: DAY_MUTED }}>
                {BATH.body}
              </p>
            </Reveal>
            <Reveal delay={210}>
              <blockquote className="mt-7 rounded-xl border p-5" style={{ borderColor: HAIR_DAY, background: '#FFFFFF' }}>
                <p className="font-sans text-[14px] italic leading-[1.6]" style={{ color: DAY_INK }}>
                  “{BATH.quote}”
                </p>
                <footer className="mt-3 font-sans text-[12.5px]" style={{ color: DAY_MUTED }}>
                  <span className="font-semibold" style={{ color: DAY_INK }}>
                    {BATH.quoteBy}
                  </span>{' '}
                  · {BATH.quoteSource}
                </footer>
              </blockquote>
            </Reveal>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {BATH.images.map((im, i) => (
              <Reveal key={im.key} delay={i * 90} y={24}>
                <ClipPhoto src={IMG[im.key]} alt={im.alt} className="aspect-[3/4] rounded-xl" hoverZoom />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   5 · 12:30 JÖKULSÁRLÓN — midday full-bleed + the "step outside" beat.
   ══════════════════════════════════════════════════════════════════════════ */
function Midday() {
  return (
    <section id="jokulsarlon">
      {/* full-bleed lagoon — section background renders eagerly (ledger #12) */}
      <div className="relative flex min-h-[78svh] items-end overflow-hidden" style={{ background: '#22374A' }}>
        <Img
          src={IMG.jokulsarlon}
          alt={MIDDAY.imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          fallbackClassName="bg-gradient-to-b from-[#3F7CA6] to-[#22374A]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(34,55,74,.06) 30%, rgba(15,22,28,.88) 100%)' }}
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-28 md:px-8 lg:pl-12">
          <Reveal>
            <TimeMark time={MIDDAY.time} label={MIDDAY.timeLabel} tone="dark" />
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="mt-4 max-w-[16ch]"
              style={{
                fontFamily: FRAUNCES,
                fontWeight: 560,
                fontSize: 'clamp(2rem,4.4vw,3.4rem)',
                lineHeight: 1.16,
                color: '#FFFFFF',
              }}
            >
              {MIDDAY.heading}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-4 max-w-[52ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: 'rgba(255,255,255,.9)' }}>
              {MIDDAY.body}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 font-sans text-[11.5px]" style={{ color: 'rgba(255,255,255,.6)' }}>
              {MIDDAY.imageNote}
            </p>
          </Reveal>
        </div>
      </div>
      {/* step outside — real walkway photo carries the transition back home */}
      <div style={{ background: DAY, color: DAY_INK }} className="py-[clamp(64px,9vw,110px)]">
        <div className="mx-auto max-w-6xl px-5 md:px-8 lg:pl-12">
          <div className="grid items-center gap-x-14 gap-y-9 md:grid-cols-2">
            <Reveal as="figure" className="m-0 md:order-2" y={26}>
              <ClipPhoto src={IMG.walkway} alt={MIDDAY.stepOutside.imageAlt} className="aspect-[4/3] rounded-xl" hoverZoom />
            </Reveal>
            <div className="md:order-1">
              <Reveal>
                <h3
                  style={{
                    fontFamily: FRAUNCES,
                    fontWeight: 560,
                    fontSize: 'clamp(1.5rem,2.8vw,2.1rem)',
                    lineHeight: 1.16,
                    color: DAY_INK,
                  }}
                >
                  {MIDDAY.stepOutside.heading}
                </h3>
              </Reveal>
              <Reveal delay={90}>
                <p className="mt-4 max-w-[46ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: DAY_MUTED }}>
                  {MIDDAY.stepOutside.body}
                </p>
              </Reveal>
              <Reveal delay={150}>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={`sv-underline mt-2.5 inline-flex items-center gap-2 py-3.5 font-sans text-[14px] font-bold ${FOCUS_DAY}`}
                  style={{ color: GOLD_DARK }}
                >
                  <MapPin size={15} aria-hidden />
                  Sjá staðsetningu á korti
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   6 · 15:00 UMSAGNIR — real published scores + verbatim quotes.
   ══════════════════════════════════════════════════════════════════════════ */
function Reviews() {
  return (
    <section id="umsagnir" style={{ background: DAY, color: DAY_INK }} className="py-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:pl-12">
        <Reveal>
          <TimeMark time={REVIEWS.time} label={REVIEWS.timeLabel} tone="day" />
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-5"
            style={{
              fontFamily: FRAUNCES,
              fontWeight: 560,
              fontSize: 'clamp(1.9rem,3.8vw,2.9rem)',
              lineHeight: 1.12,
              color: DAY_INK,
            }}
          >
            {REVIEWS.heading}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-4 max-w-[52ch] font-sans text-[14px] leading-[1.6]" style={{ color: DAY_MUTED }}>
            {REVIEWS.body}
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-y py-8 sm:grid-cols-4" style={{ borderColor: HAIR_DAY }}>
          {REVIEWS.scores.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} y={14}>
              <div className="text-[2rem] font-bold leading-none tabular-nums" style={{ fontFamily: FRAUNCES, color: DAY_INK }}>
                {s.value}
              </div>
              <div className="mt-2 font-sans text-[12.5px] font-bold uppercase tracking-[0.06em]" style={{ color: GOLD_DARK }}>
                {s.label}
              </div>
              <div className="mt-0.5 font-sans text-[12px]" style={{ color: DAY_MUTED }}>
                {s.note}
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal
              key={q.by}
              delay={i * 90}
              y={20}
              className="flex flex-col rounded-xl border p-6"
              style={{ borderColor: HAIR_DAY, background: '#FFFFFF' }}
            >
              <p className="font-sans text-[14px] italic leading-[1.62]" style={{ color: DAY_INK }}>
                “{q.text}”
              </p>
              <footer className="mt-4 border-t pt-3 font-sans text-[13px] font-semibold" style={{ borderColor: HAIR_DAY, color: DAY_INK }}>
                {q.by} <span className="font-normal" style={{ color: DAY_MUTED }}>· Booking.com</span>
              </footer>
            </Reveal>
          ))}
        </div>
        <Reveal delay={160}>
          <p className="mt-7 font-sans text-[13px] leading-[1.6]" style={{ color: DAY_MUTED }}>
            {REVIEWS.tripadvisor}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   7 · 16:20 BÝLIÐ — the working farm, verified facts only.
   ══════════════════════════════════════════════════════════════════════════ */
function Farm() {
  return (
    <section id="bylid" style={{ background: DAY, color: DAY_INK }} className="pb-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:pl-12">
        <div className="grid items-center gap-x-14 gap-y-10 md:grid-cols-2">
          <Reveal as="figure" className="m-0" y={26}>
            <ClipPhoto src={IMG.exteriorField} alt={FARM.imageAlt} className="aspect-[3/4] rounded-xl sm:aspect-[4/5]" hoverZoom />
          </Reveal>
          <div>
            <Reveal>
              <TimeMark time={FARM.time} label={FARM.timeLabel} tone="day" />
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="mt-5"
                style={{
                  fontFamily: FRAUNCES,
                  fontWeight: 560,
                  fontSize: 'clamp(1.9rem,3.8vw,2.9rem)',
                  lineHeight: 1.12,
                  color: DAY_INK,
                }}
              >
                {FARM.heading}
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-5 max-w-[50ch] font-sans text-[15.5px] leading-[1.68]" style={{ color: DAY_MUTED }}>
                {FARM.body}
              </p>
            </Reveal>
            <Reveal delay={210}>
              <p className="mt-4 max-w-[50ch] font-sans text-[15px] font-medium leading-[1.6]" style={{ color: DAY_INK }}>
                {FARM.network}
              </p>
            </Reveal>
            <Reveal delay={260}>
              <span
                className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-[12.5px] font-bold uppercase tracking-[0.08em]"
                style={{ borderColor: GOLD_DARK, color: GOLD_DARK }}
              >
                Fjölskyldurekið gistihús
              </span>
            </Reveal>
          </div>
        </div>
        <Reveal className="mt-12" y={26}>
          <ClipPhoto src={IMG.exteriorSky} alt={FARM.image2Alt} className="aspect-[16/9] rounded-xl sm:aspect-[21/9]" />
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   8 · 18:45 KVÖLDIÐ — dusk turns the page warm-dark; terrace, bar, garden.
   ══════════════════════════════════════════════════════════════════════════ */
function Dusk() {
  return (
    <section className="relative flex min-h-[72svh] items-center overflow-hidden" style={{ background: DUSK_GROUND }}>
      <Img
        src={IMG.exteriorAngle}
        alt={DUSK.imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        fallbackClassName="bg-gradient-to-b from-[#3a2c1a] to-[#191310]"
      />
      {/* warm dusk grade over the real exterior photo */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(200,114,47,.26) 0%, rgba(25,19,16,.68) 50%, rgba(25,19,16,.9) 100%)',
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24 md:px-8 lg:pl-12">
        <Reveal>
          <TimeMark time={DUSK.time} label={DUSK.timeLabel} tone="dark" />
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4 max-w-[14ch]"
            style={{
              fontFamily: FRAUNCES,
              fontWeight: 560,
              fontSize: 'clamp(2rem,4.4vw,3.4rem)',
              lineHeight: 1.14,
              color: INK,
            }}
          >
            {DUSK.heading}
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-5 max-w-[48ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: 'rgba(243,239,230,.88)' }}>
            {DUSK.body}
          </p>
        </Reveal>
        <Reveal delay={210}>
          <a
            href={`mailto:${CONTACT_PRIMARY.email}?subject=${encodeURIComponent('Borðapöntun eða fyrirspurn um kvöldmat')}`}
            className={`sv-ghost mt-8 inline-flex min-h-[48px] items-center gap-2.5 rounded-full border px-7 font-sans text-[13.5px] font-bold uppercase tracking-[0.08em] ${FOCUS_DARK}`}
            style={{ borderColor: 'rgba(243,239,230,.45)', color: INK }}
          >
            <Mail size={15} aria-hidden />
            {DUSK.cta}
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   9 · 22:45 NÓTTIN — aurora over Vestrahorn (disclosed stock), Anton's real
   dark-skies quote; the Light Rail terminates in the lit farmhouse windows.
   ══════════════════════════════════════════════════════════════════════════ */
function Night() {
  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden" style={{ background: GROUND }}>
      <Img
        src={IMG.aurora}
        alt={NIGHT.imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        fallbackClassName="bg-gradient-to-b from-[#12241d] to-[#0F1210]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(15,18,16,.12) 30%, rgba(15,18,16,.9) 100%)' }}
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-32 md:px-8 lg:pl-12">
        <Reveal>
          <TimeMark time={NIGHT.time} label={NIGHT.timeLabel} tone="dark" />
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4"
            style={{
              fontFamily: FRAUNCES,
              fontWeight: 560,
              fontSize: 'clamp(2rem,4.4vw,3.4rem)',
              lineHeight: 1.14,
              color: INK,
            }}
          >
            {NIGHT.heading}
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-5 max-w-[50ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: 'rgba(243,239,230,.9)' }}>
            {NIGHT.body}
          </p>
        </Reveal>
        <Reveal delay={210}>
          <blockquote
            className="mt-8 max-w-xl rounded-xl border p-6"
            style={{ borderColor: 'rgba(95,168,140,.35)', background: 'rgba(15,18,16,.7)', backdropFilter: 'blur(6px)' }}
          >
            <p className="font-sans text-[14px] italic leading-[1.62]" style={{ color: INK }}>
              “{NIGHT.quote}”
            </p>
            <footer className="mt-3.5 font-sans text-[12.5px]" style={{ color: 'rgba(243,239,230,.7)' }}>
              <span className="font-semibold" style={{ color: AURORA }}>
                {NIGHT.quoteBy}
              </span>{' '}
              · {NIGHT.quoteSource}
            </footer>
          </blockquote>
        </Reveal>
        <Reveal delay={260}>
          <p className="mt-6 font-sans text-[11.5px]" style={{ color: 'rgba(243,239,230,.55)' }}>
            {NIGHT.imageNote}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   10 · 23:59 BÓKUN — huge final CTA + every practical fact + both public
   contact sets, transparently.
   ══════════════════════════════════════════════════════════════════════════ */
function Booking() {
  return (
    <section id="bokun" style={{ background: GROUND, color: INK }} className="py-[clamp(80px,11vw,144px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:pl-12">
        <Reveal>
          <TimeMark time={BOOKING.time} label={BOOKING.timeLabel} tone="dark" />
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-5 max-w-[16ch]"
            style={{
              fontFamily: FRAUNCES,
              fontWeight: 560,
              fontSize: 'clamp(2.2rem,5.2vw,4rem)',
              lineHeight: 1.1,
              color: INK,
            }}
          >
            {BOOKING.heading}
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-5 max-w-[54ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: MUTED_DARK }}>
            {BOOKING.body}
          </p>
        </Reveal>
        <Reveal delay={210}>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              className={`sv-cta inline-flex min-h-[54px] items-center rounded-full px-8 font-sans text-[14.5px] font-bold uppercase tracking-[0.08em] ${FOCUS_DARK}`}
              style={{ background: GOLD, color: '#14110B' }}
            >
              {BOOKING.cta}
            </a>
            <a
              href={CONTACT_PRIMARY.phoneHref}
              className={`sv-ghost inline-flex min-h-[54px] items-center gap-2.5 rounded-full border px-7 font-sans text-[14px] font-bold tabular-nums ${FOCUS_DARK}`}
              style={{ borderColor: 'rgba(243,239,230,.4)', color: INK }}
            >
              <Phone size={16} aria-hidden />
              {CONTACT_PRIMARY.phone}
            </a>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-x-12 gap-y-10 border-t pt-10 lg:grid-cols-2" style={{ borderColor: HAIR_DARK }}>
          {/* practical facts */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: GOLD }}>
              Hagnýtt
            </h3>
            <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
              {BOOKING.practical.map((p) => (
                <div key={p.label}>
                  <dt className="font-sans text-[11.5px] font-bold uppercase tracking-[0.1em]" style={{ color: MUTED_DARK }}>
                    {p.label}
                  </dt>
                  <dd className="mt-1 font-sans text-[14px] font-medium leading-snug" style={{ color: INK }}>
                    {p.value}
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="mt-7 flex flex-col gap-2">
              {BOOKING.rules.map((r) => (
                <li key={r} className="flex items-start gap-2.5 font-sans text-[13.5px] leading-snug" style={{ color: MUTED_DARK }}>
                  <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ background: GOLD }} />
                  {r}
                </li>
              ))}
            </ul>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className={`sv-underline mt-7 inline-flex items-center gap-2 font-sans text-[14px] font-bold ${FOCUS_DARK}`}
              style={{ color: GOLD }}
            >
              <MapPin size={15} aria-hidden />
              {ADDRESS}
            </a>
          </div>
          {/* both public contact sets, transparently */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: GOLD }}>
              Samband
            </h3>
            <p className="mt-4 font-sans text-[13px] leading-[1.6]" style={{ color: MUTED_DARK }}>
              {BOOKING.contactNote}
            </p>
            {[CONTACT_PRIMARY, CONTACT_DIRECT].map((c) => (
              <div
                key={c.label}
                className="mt-5 rounded-xl border p-5"
                style={{ borderColor: HAIR_DARK, background: 'rgba(243,239,230,.04)' }}
              >
                <div className="font-sans text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: INK }}>
                  {c.label}
                </div>
                <div className="mt-0.5 font-sans text-[11.5px]" style={{ color: MUTED_DARK }}>
                  {c.source}
                </div>
                <div className="mt-3 flex flex-col gap-1.5">
                  <a
                    href={c.phoneHref}
                    className={`inline-flex w-fit items-center gap-2 font-sans text-[15px] font-semibold tabular-nums ${FOCUS_DARK}`}
                    style={{ color: GOLD }}
                  >
                    <Phone size={14} aria-hidden />
                    {c.phone}
                  </a>
                  <a
                    href={`mailto:${c.email}`}
                    className={`inline-flex w-fit items-center gap-2 font-sans text-[14px] ${FOCUS_DARK}`}
                    style={{ color: INK }}
                  >
                    <Mail size={14} aria-hidden />
                    {c.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   STICKY MOBILE CTA — phone + book, with the Light Rail compressed into a
   3px day-gradient progress line (the signature survives on small screens).
   ══════════════════════════════════════════════════════════════════════════ */
function StickyCta() {
  const reduced = prefersReduced()
  const { scrollYProgress } = useScroll()
  const lineRef = useRef<HTMLDivElement>(null)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return
    const el = lineRef.current
    if (el) el.style.transform = `scaleX(${v.toFixed(4)})`
  })
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{ background: 'rgba(15,18,16,.95)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      <div aria-hidden className="h-[3px] w-full overflow-hidden" style={{ background: 'rgba(243,239,230,.1)' }}>
        <div
          ref={lineRef}
          className="h-full w-full origin-left"
          style={{
            transform: reduced ? 'scaleX(1)' : 'scaleX(0)',
            background: `linear-gradient(90deg, #2A3557 0%, ${GOLD} 18%, ${BLUE} 50%, #C8722F 75%, ${AURORA} 100%)`,
          }}
        />
      </div>
      <div
        className="flex items-center gap-3 px-4 pt-2.5"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}
      >
        <a
          href={CONTACT_PRIMARY.phoneHref}
          aria-label={`Hringja í ${CONTACT_PRIMARY.phone}`}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${FOCUS_DARK}`}
          style={{ borderColor: 'rgba(243,239,230,.35)', color: INK }}
        >
          <Phone size={17} aria-hidden />
        </a>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          className={`sv-cta inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full font-sans text-[13.5px] font-bold uppercase tracking-[0.08em] ${FOCUS_DARK}`}
          style={{ background: GOLD, color: '#14110B' }}
        >
          Bóka núna
        </a>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  useEffect(() => {
    document.title = 'Guesthouse Seljavellir · Einn dagur á Seljavöllum'
    setThemeColor(GROUND)
    return () => setThemeColor('#0a1320')
  }, [])

  /* Lenis smooth scroll — skipped entirely under prefers-reduced-motion */
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({ duration: 1.15 })
    lenisInstance = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  return (
    <div className="font-sans overflow-x-clip" style={{ background: GROUND, color: INK }}>
      <style>{`
        #sv-root ::selection { background:${GOLD}; color:#14110B; }

        .sv-navlink { position:relative; }
        .sv-navlink::after {
          content:''; position:absolute; left:0; right:100%; bottom:-4px; height:1.5px;
          background:${GOLD}; transition:right .28s ${EASE};
        }
        .sv-navlink:hover::after { right:0; }

        .sv-cta { transition:filter .25s ease, transform .15s ease; }
        .sv-cta:hover { filter:brightness(1.08); }
        .sv-cta:active { transform:scale(.98); }

        .sv-ghost { transition:background-color .25s ease, transform .15s ease; }
        .sv-ghost:hover { background-color:rgba(243,239,230,.1); }
        .sv-ghost:active { transform:scale(.98); }

        .sv-underline { text-decoration:underline; text-underline-offset:5px; text-decoration-thickness:1px; transition:opacity .2s ease; }
        .sv-underline:hover { opacity:.75; }

        .sv-zoom img { transition:transform .6s ${EASE}; }
        .sv-zoom:hover img { transform:scale(1.05); }

        @media (prefers-reduced-motion: reduce) {
          .sv-zoom img, .sv-cta, .sv-ghost { transition:none !important; transform:none !important; }
        }
      `}</style>
      <div id="sv-root">
        <PreviewChrome company={company} />
        <TopNav />
        <LightRail />
        <main>
          <Hero />
          <Morning />
          <Rooms />
          <Bath />
          <Midday />
          <Reviews />
          <Farm />
          <Dusk />
          <Night />
          <Booking />
        </main>

        {/* honesty disclosure — quiet pre-footer line */}
        <section style={{ background: GROUND }} className="px-5 pb-6 pt-2 md:px-8">
          <p className="mx-auto max-w-3xl text-center font-sans text-[12px] leading-[1.65]" style={{ color: 'rgba(243,239,230,.55)' }}>
            {DISCLOSURE}
          </p>
        </section>
        <div className="pb-28 lg:pb-0" style={{ background: GROUND }}>
          <PreviewFooter company={company} />
        </div>
        <StickyCta />
      </div>
    </div>
  )
}
