import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Lenis from 'lenis'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Phone, MapPin, ArrowUpRight, Menu, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  BOOKING_URL, PHONE_DISPLAY, PHONE_HREF, ADDRESS, MAP_EMBED, MAP_LINK,
  IMG, NAV, HERO, FACTS, VADALFJOLL, ROOMS, RESTAURANT, CHARACTER, STORY, CAMPSITE,
  REVIEWS, PRACTICAL, CLOSING, STICKY, JSON_LD,
} from './data'

const company = getPreviewCompany('bjarkalundur')

/* Module-scoped Lenis handle so anchor nav can route through the same smooth-
   scroll instance the page owns, instead of fighting it with native
   scrollIntoView (review P2/motion). Set/cleared by Page()'s effect. */
let lenisInstance: Lenis | null = null

/* ── „Hliðið að Vestfjörðum" — the arrival read as one continuous line: from
   the road (hero) through the gate (the hero headline literally parting from
   its centre seam) to the twin peaks of Vaðalfjöll (the ONE scroll-linked
   signature: a brass ridge line drawn across the mountain as you pass) and on
   into the real forest-green rooms and the table. Photography leads; the
   effect is seasoning. Palette sampled from the client's own interiors. */

/* Palette (brief C.Palette). PARCH on GROUND ≈ 13:1 (AAA). INK on PARCH high.
   ACCENT brass is display-only on dark grounds, never small body copy. */
const GROUND = '#182319' // near-black pine green (lounge walls)
const GROUND2 = '#20301F' // lifted pine for banded dark sections
const INK = '#1E2B22' // text on light grounds
const ACCENT = '#B08A3E' // warm brass — CTAs, links, the ridge line
const ACCENT_INK = '#6E5420' // darkened brass for small text on light ground (~6.2:1 on PARCH)
const PARCH = '#F3EEE1' // parchment — light ground + text on dark
const STONE = '#8B9A8C' // heath green-gray — dividers, muted labels
const PARCH_SOFT = 'rgba(243,238,225,.80)'
const PARCH_MUTE = 'rgba(243,238,225,.62)'
const INK_SOFT = 'rgba(30,43,34,.78)'
const INK_MUTE = 'rgba(30,43,34,.72)'
const HAIR_D = 'rgba(243,238,225,.15)'
const HAIR_L = 'rgba(30,43,34,.14)'

const EASE = 'cubic-bezier(.22,1,.36,1)'
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08A3E]'
const FOCUS_DARK =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#182319]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ═══════════════════════ Reveal (viewport-gated, reduced-safe) ═════════════ */
function Reveal({
  children, delay = 0, y = 22, className = '', style, as = 'div',
}: {
  children: ReactNode; delay?: number; y?: number; className?: string
  style?: CSSProperties; as?: 'div' | 'figure' | 'li' | 'blockquote'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(() => prefersReduced())
  useEffect(() => {
    if (prefersReduced()) { setShown(true); return }
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) { setShown(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect() }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 })
    io.observe(el)
    let t: number | undefined
    if (r.top < window.innerHeight * 1.3) t = window.setTimeout(() => setShown(true), 1500)
    return () => { io.disconnect(); if (t) window.clearTimeout(t) }
  }, [])
  const Tag = as
  return (
    <Tag ref={ref as never} className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: prefersReduced() ? undefined
          : `opacity .8s ${EASE} ${delay}ms, transform .8s ${EASE} ${delay}ms`,
      }}>
      {children}
    </Tag>
  )
}

/* ═══════════════════════ ClipImg — standalone photo reveal ════════════════ */
function ClipImg({
  src, alt, aspect, className = '', sizes, fallback = 'bg-[#20301F]', priority = false,
}: {
  src: string; alt: string; aspect: string; className?: string
  sizes?: string; fallback?: string; priority?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(() => prefersReduced())
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (prefersReduced()) { setShown(true); return }
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) { setShown(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect() }
    }, { threshold: 0.18 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <figure ref={ref} className={`relative m-0 overflow-hidden ${aspect} ${className}`}>
      {failed ? (
        <div className={`absolute inset-0 ${fallback}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} />
      ) : (
        <img
          src={src} alt={alt} sizes={sizes}
          loading={priority ? 'eager' : 'lazy'} decoding="async"
          {...(priority ? { fetchpriority: 'high' as const } : {})}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={prefersReduced() ? undefined : {
            clipPath: shown ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
            transform: shown ? 'scale(1)' : 'scale(1.06)',
            transition: `clip-path 1s ${EASE}, transform 1.25s ${EASE}`,
          }}
        />
      )}
    </figure>
  )
}

/* ═══════════════════════ Bg — full-bleed background photo (mount, ledger #12) */
function Bg({ src, alt, position = 'center', priority = false }: {
  src: string; alt: string; position?: string; priority?: boolean
}) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className="absolute inset-0 bg-[#20301F]" role="img" aria-label={alt} />
  return (
    <img
      src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async"
      {...(priority ? { fetchpriority: 'high' as const } : {})}
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: position }}
    />
  )
}

/* ═══════════════════════ Label — mono eyebrow ═════════════════════════════ */
function Label({ children, color = ACCENT }: { children: ReactNode; color?: string }) {
  return (
    <p className="m-0 font-mono text-[11.5px] font-bold uppercase tracking-[0.24em]" style={{ color }}>
      {children}
    </p>
  )
}

/* ═══════════════════════ SplitLine — the gate (elevation, 21st.dev #19330) ══
   Ported technique from animbits/text-split-reveal, adapted to Framer's stack
   and this concept: two clip layers of the SAME full text open outward from a
   central seam on mount, reading as a gate. Clip is horizontal only, so the
   Icelandic Ð/Ö/Í accents are never vertically masked (brief D + ledger #23).
   Reduced motion renders the text plainly and immediately. */
function SplitLine({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduced = prefersReduced()
  const [open, setOpen] = useState(reduced)
  useEffect(() => {
    if (reduced) return
    const id = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(id)
  }, [reduced])
  if (reduced) return <span className="block">{text}</span>
  return (
    <span aria-hidden className="relative block">
      <span className="block" style={{
        clipPath: open ? 'inset(0 50% 0 0)' : 'inset(0 50% 0 50%)',
        opacity: open ? 1 : 0,
        transition: `clip-path .95s ${EASE} ${delay}ms, opacity .5s ease ${delay}ms`,
      }}>{text}</span>
      <span className="absolute inset-0 block" style={{
        clipPath: open ? 'inset(0 0 0 50%)' : 'inset(0 50% 0 50%)',
        opacity: open ? 1 : 0,
        transition: `clip-path .95s ${EASE} ${delay + 110}ms, opacity .5s ease ${delay + 110}ms`,
      }}>{text}</span>
    </span>
  )
}

/* ═══════════════════════ CountUp — 1947 (reduced-safe) ════════════════════ */
function CountUp({ to, from, className, style }: {
  to: number; from: number; className?: string; style?: CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(() => (prefersReduced() ? to : from))
  useEffect(() => {
    if (prefersReduced()) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const run = () => {
      const start = performance.now()
      const dur = 900
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(from + (to - from) * eased))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { run(); io.disconnect() }
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [from, to])
  return <span ref={ref} className={className} style={style}>{val}</span>
}

/* ═══════════════════════ NAV ══════════════════════════════════════════════ */
function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body + Lenis scroll while the mobile overlay is open; Escape closes.
  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenisInstance?.stop()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      lenisInstance?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const scrollToTop = () => {
    const reduced = prefersReduced()
    if (lenisInstance) lenisInstance.scrollTo(0, { duration: reduced ? 0 : 1.2 })
    else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }
  const go = (id: string) => {
    setMenuOpen(false)
    const reduced = prefersReduced()
    if (lenisInstance) lenisInstance.scrollTo(`#${id}`, { duration: reduced ? 0 : 1.2 })
    else document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <>
      <nav aria-label="Aðalvalmynd" className="fixed inset-x-0 top-0 z-40"
        style={{
          background: scrolled || menuOpen ? 'rgba(24,35,25,.90)' : 'transparent',
          borderBottom: `1px solid ${scrolled || menuOpen ? HAIR_D : 'transparent'}`,
          backdropFilter: scrolled || menuOpen ? 'blur(10px)' : undefined,
          WebkitBackdropFilter: scrolled || menuOpen ? 'blur(10px)' : undefined,
          transition: 'background .35s ease, border-color .35s ease',
        }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <button onClick={scrollToTop}
            className={`font-display text-[19px] font-semibold leading-none ${FOCUS}`} style={{ color: PARCH }}>
            Bjarkalundur
          </button>
          <div className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)}
                className={`font-sans text-[13.5px] font-medium transition-opacity hover:opacity-70 ${FOCUS}`}
                style={{ color: PARCH_SOFT }}>
                {n.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href={PHONE_HREF}
              className={`hidden font-mono text-[12.5px] tracking-[0.02em] transition-opacity hover:opacity-70 sm:block ${FOCUS}`}
              style={{ color: PARCH_SOFT }}>
              {PHONE_DISPLAY}
            </a>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`inline-flex min-h-[44px] items-center rounded-full px-5 font-sans text-[13px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
              style={{ background: ACCENT, color: GROUND }}>
              Bóka
            </a>
            <button type="button"
              aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
              aria-expanded={menuOpen} aria-controls="bj-mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
              className={`flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${FOCUS}`}
              style={{ color: PARCH }}>
              {menuOpen ? <X size={22} strokeWidth={2} aria-hidden /> : <Menu size={22} strokeWidth={2} aria-hidden />}
            </button>
          </div>
        </div>
      </nav>
      {/* Sibling of <nav>, not nested inside it — nav's own backdrop-filter would
          otherwise become this overlay's containing block (ledger #29 gotcha). */}
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} onGo={go} />
    </>
  )
}

/* ═══════════════════════ MOBILE NAV OVERLAY ═══════════════════════════════ */
function MobileNav({ open, onClose, onGo }: {
  open: boolean; onClose: () => void; onGo: (id: string) => void
}) {
  const reduced = prefersReduced()
  const [shown, setShown] = useState(reduced)
  useEffect(() => {
    if (!open) { setShown(reduced); return }
    if (reduced) { setShown(true); return }
    setShown(false)
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [open, reduced])
  if (!open) return null
  return (
    <div id="bj-mobile-nav" role="dialog" aria-modal="true" aria-label="Valmynd"
      className="fixed inset-0 z-30 flex flex-col pt-[60px] lg:hidden" style={{ background: GROUND }}>
      <ul className="flex flex-1 flex-col items-start justify-center gap-1 px-8">
        {NAV.map((n, i) => (
          <li key={n.id} className="overflow-hidden">
            <button onClick={() => onGo(n.id)}
              className={`font-display text-[2.1rem] font-semibold ${FOCUS}`}
              style={{
                color: PARCH,
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0)' : 'translateY(16px)',
                transition: reduced ? undefined
                  : `opacity .5s ${EASE} ${i * 60 + 80}ms, transform .5s ${EASE} ${i * 60 + 80}ms`,
              }}>
              {n.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-5 px-8 pb-10">
        <a href={PHONE_HREF} onClick={onClose}
          className={`inline-flex items-center gap-2 font-mono text-[13px] tracking-[0.02em] ${FOCUS}`}
          style={{ color: PARCH_SOFT }}>
          <Phone size={16} strokeWidth={2} aria-hidden /> {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  )
}

/* ═══════════════════════ HERO ═════════════════════════════════════════════ */
function Hero() {
  const reduced = prefersReduced()
  return (
    <header className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden" style={{ background: GROUND }}>
      <motion.div className="absolute inset-0"
        initial={reduced ? false : { opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}>
        <Bg src={IMG.hero} alt={HERO.alt} position="center 38%" priority />
      </motion.div>
      {/* AA scrim under lower-left copy */}
      <div aria-hidden className="absolute inset-0" style={{
        background:
          'linear-gradient(180deg, rgba(24,35,25,.42) 0%, rgba(24,35,25,.20) 34%, rgba(24,35,25,.55) 66%, rgba(24,35,25,.92) 100%)',
      }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <Reveal delay={80}>
          <Label color={ACCENT}>{HERO.eyebrow}</Label>
        </Reveal>
        <h1 aria-label="Hliðið að Vestfjörðum"
          className="mt-4 font-display font-semibold text-[#F3EEE1]"
          style={{ fontSize: 'clamp(2.2rem, 9vw, 6.5rem)', lineHeight: 1.06, letterSpacing: '-0.01em' }}>
          <SplitLine text={HERO.line1} delay={220} />
          <SplitLine text={HERO.line2} delay={420} />
        </h1>
        <Reveal delay={760} className="mt-6 max-w-xl">
          <p className="font-sans text-[15px] leading-[1.7] md:text-[17px]" style={{ color: PARCH_SOFT }}>
            {HERO.sub}
          </p>
        </Reveal>
        <Reveal delay={900} className="mt-8 flex flex-wrap items-center gap-3">
          <a href={BOOKING_URL} target="_blank" rel="noreferrer"
            className={`inline-flex min-h-[52px] items-center gap-2 rounded-full px-7 font-sans text-[15px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
            style={{ background: ACCENT, color: GROUND }}>
            Bóka gistingu <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden />
          </a>
          <a href={PHONE_HREF}
            className={`inline-flex min-h-[52px] items-center gap-2 rounded-full border px-6 font-sans text-[15px] font-semibold transition-colors hover:bg-[#F3EEE1]/10 ${FOCUS}`}
            style={{ borderColor: 'rgba(243,238,225,.5)', color: PARCH }}>
            <Phone size={17} strokeWidth={2} aria-hidden /> Hringja
          </a>
        </Reveal>
      </div>
    </header>
  )
}

/* ═══════════════════════ FACTS STRIP — the threshold ══════════════════════ */
function FactsStrip() {
  return (
    <section aria-label="Staðreyndir" style={{ background: PARCH }}>
      <h2 className="sr-only">Staðreyndir um Bjarkalund</h2>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-12 md:grid-cols-4 md:px-8 md:py-14">
        {FACTS.map((f, i) => (
          <Reveal key={f.label} delay={i * 90}
            className="border-l px-5 first:border-l-0 md:px-6" style={{ borderColor: HAIR_L } as CSSProperties}>
            <div className="font-display text-[2rem] font-semibold leading-none md:text-[2.5rem]" style={{ color: INK }}>
              {f.count ? <CountUp from={1900} to={f.count} /> : f.value}
            </div>
            <div className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: INK_MUTE }}>
              {f.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════ VAÐALFJÖLL — signature (scroll-linked ridge) ══════ */
function Vadalfjoll() {
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGGElement>(null)
  const lenRef = useRef(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  useEffect(() => {
    const p = pathRef.current
    if (!p) return
    const len = p.getTotalLength()
    lenRef.current = len
    p.style.strokeDasharray = `${len}`
    if (prefersReduced()) {
      p.style.strokeDashoffset = '0'
      if (dotRef.current) dotRef.current.style.opacity = '1'
    } else {
      p.style.strokeDashoffset = `${len}`
      if (dotRef.current) dotRef.current.style.opacity = '0'
    }
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (prefersReduced()) return
    const p = pathRef.current
    const len = lenRef.current
    if (!p || !len) return
    // Draw between ~15% and ~85% of the section pass so it completes on-screen.
    const t = Math.max(0, Math.min(1, (v - 0.15) / 0.7))
    p.style.strokeDashoffset = `${len * (1 - t)}`
    if (dotRef.current) dotRef.current.style.opacity = `${Math.max(0, Math.min(1, (t - 0.55) / 0.25))}`
  })

  return (
    <section ref={sectionRef} id="vadalfjoll" className="relative flex min-h-[100svh] items-end overflow-hidden"
      style={{ background: GROUND }}>
      <Bg src={IMG.vadalfjoll1} alt={VADALFJOLL.wideAlt} position="center 30%" />
      <div aria-hidden className="absolute inset-0" style={{
        background:
          'linear-gradient(180deg, rgba(24,35,25,.30) 0%, rgba(24,35,25,.10) 40%, rgba(24,35,25,.62) 74%, rgba(24,35,25,.95) 100%)',
      }} />

      {/* The ridge line — decorative wayfinding motif, not a measurement. */}
      <svg aria-hidden viewBox="0 0 1000 260" preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-x-0" style={{ bottom: '34%', height: '30vh' }}>
        <path ref={pathRef}
          d="M 20 236 L 190 232 C 250 230 286 150 330 96 C 356 64 388 48 416 78 C 452 118 486 220 548 230 C 588 236 612 168 664 104 C 690 72 726 60 754 92 C 800 146 838 228 900 232 L 980 234"
          fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 1px 6px rgba(24,35,25,.5))' }} />
        <g ref={dotRef}>
          <circle cx="548" cy="230" r="5.5" fill={ACCENT} />
          <circle cx="548" cy="230" r="11" fill="none" stroke={ACCENT} strokeWidth="1.5" opacity="0.6" />
          <text x="548" y="212" textAnchor="middle" fill={PARCH}
            style={{ font: '600 13px "Space Mono", monospace', letterSpacing: '0.08em' }}>
            {VADALFJOLL.waypoint}
          </text>
        </g>
      </svg>

      <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-5 pb-16 md:grid-cols-[1.4fr_1fr] md:items-end md:px-8 md:pb-20">
        <div>
          <Reveal><Label>{VADALFJOLL.eyebrow}</Label></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 font-display font-semibold text-[#F3EEE1]"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.08 }}>
              {VADALFJOLL.title}
            </h2>
          </Reveal>
          <Reveal delay={160} className="mt-5 max-w-xl">
            <p className="font-sans text-[15px] leading-[1.75] md:text-[16.5px]" style={{ color: PARCH_SOFT }}>
              {VADALFJOLL.body}
            </p>
          </Reveal>
        </div>
        <Reveal delay={120} as="figure" className="m-0">
          <ClipImg src={IMG.vadalfjoll2} alt={VADALFJOLL.detailAlt}
            aspect="aspect-[4/3]" className="rounded-[3px] shadow-2xl" sizes="(min-width:768px) 34vw, 90vw" />
          <figcaption className="mt-2.5 font-mono text-[10.5px] leading-relaxed tracking-[0.03em]" style={{ color: PARCH_MUTE }}>
            {VADALFJOLL.credit}
          </figcaption>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════ ROOMS ════════════════════════════════════════════ */
function Rooms() {
  return (
    <section id="herbergi" style={{ background: PARCH }}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-16 md:px-8 md:py-28">
        <Reveal>
          <ClipImg src={IMG.bedroom} alt={ROOMS.alt} aspect="aspect-[4/3]"
            className="rounded-[3px]" sizes="(min-width:768px) 46vw, 90vw" />
        </Reveal>
        <div>
          <Reveal><Label color={ACCENT_INK}>{ROOMS.eyebrow}</Label></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 font-display font-semibold" style={{ color: INK, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.1 }}>
              {ROOMS.title}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-lg font-sans text-[15.5px] leading-[1.75]" style={{ color: INK_SOFT }}>
              {ROOMS.body}
            </p>
          </Reveal>
          <Reveal delay={200} className="mt-7 flex flex-wrap items-center gap-4">
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`inline-flex min-h-[50px] items-center gap-2 rounded-full px-6 font-sans text-[14.5px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
              style={{ background: INK, color: PARCH }}>
              {ROOMS.cta} <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden />
            </a>
            <span className="font-mono text-[11.5px] tracking-[0.02em]" style={{ color: INK_MUTE }}>
              {ROOMS.note}
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ RESTAURANT ═══════════════════════════════════════ */
function Restaurant() {
  return (
    <section id="veitingar" style={{ background: GROUND }}>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Reveal><Label>{RESTAURANT.eyebrow}</Label></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 font-display font-semibold text-[#F3EEE1]"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.1 }}>
                {RESTAURANT.title}
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 max-w-lg font-sans text-[15.5px] leading-[1.75]" style={{ color: PARCH_SOFT }}>
                {RESTAURANT.body}
              </p>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[12px] tracking-[0.04em]"
              style={{ borderColor: HAIR_D, color: ACCENT }}>
              {RESTAURANT.hours}
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {RESTAURANT.gallery.map((g, i) => (
            <Reveal key={g.key} delay={i * 90} as="figure" className="m-0">
              <ClipImg src={IMG[g.key as keyof typeof IMG]} alt={g.alt}
                aspect="aspect-[4/5] md:aspect-[3/4]"
                className="rounded-[3px]" sizes="(min-width:768px) 30vw, 90vw" />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} as="blockquote"
          className="mx-auto mt-12 max-w-2xl border-l-2 pl-6 text-center md:text-left"
          style={{ borderColor: ACCENT } as CSSProperties}>
          <p className="font-display text-[1.5rem] font-medium leading-snug md:text-[1.9rem]" style={{ color: PARCH }}>
            „{RESTAURANT.quote}“
          </p>
          <cite className="mt-3 block font-mono text-[11.5px] not-italic tracking-[0.04em]" style={{ color: PARCH_MUTE }}>
            {RESTAURANT.quoteBy}
          </cite>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════ CHARACTER — interactive green rooms ══════════════ */
function Character() {
  const [active, setActive] = useState(0)
  const panel = CHARACTER.panels[active]
  return (
    <section style={{ background: GROUND2 }}>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <Reveal><Label>{CHARACTER.eyebrow}</Label></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 font-display font-semibold text-[#F3EEE1]"
              style={{ fontSize: 'clamp(2rem, 4.8vw, 3.4rem)', lineHeight: 1.08 }}>
              {CHARACTER.title}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 font-sans text-[15.5px] leading-[1.75]" style={{ color: PARCH_SOFT }}>
              {CHARACTER.body}
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.5fr] md:items-stretch">
          {/* index — the one allowed asymmetric functional split (ledger #14) */}
          <ul className="order-2 flex flex-col justify-center gap-1 md:order-1">
            {CHARACTER.panels.map((p, i) => {
              const on = i === active
              return (
                <li key={p.title}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className={`group flex w-full items-center justify-between gap-4 border-b py-4 text-left transition-colors ${FOCUS}`}
                    style={{ borderColor: HAIR_D }}>
                    <span className="font-display text-[1.35rem] font-medium transition-colors md:text-[1.6rem]"
                      style={{ color: on ? PARCH : PARCH_MUTE }}>
                      {p.title}
                    </span>
                    <span className="font-mono text-[11px]" style={{ color: on ? ACCENT : 'transparent' }}>
                      0{i + 1}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          {/* active panel */}
          <div className="relative order-1 overflow-hidden rounded-[4px] md:order-2 aspect-[4/3] md:aspect-auto md:min-h-[440px]">
            {CHARACTER.panels.map((p, i) => (
              <img key={p.key} src={IMG[p.key as keyof typeof IMG]} alt={p.alt}
                loading="lazy" decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  opacity: i === active ? 1 : 0,
                  transition: prefersReduced() ? undefined : `opacity .7s ${EASE}`,
                }} />
            ))}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(24,35,25,.6))' }} />
            <div className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: PARCH }}>
              {panel.title}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ STORY — 1947 → 2026 ══════════════════════════════ */
function Story() {
  return (
    <section id="saga" style={{ background: PARCH }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:px-8 md:py-28">
        <div>
          <Reveal><Label color={INK_MUTE}>{STORY.eyebrow}</Label></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 font-display font-semibold" style={{ color: INK, fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.05 }}>
              {STORY.title}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-md font-sans text-[15px] leading-[1.75]" style={{ color: INK_SOFT }}>
              {STORY.intro}
            </p>
          </Reveal>
          <Reveal delay={200} as="figure" className="m-0 mt-8 max-w-sm">
            <ClipImg src={IMG.archival} alt={STORY.archivalAlt} aspect="aspect-[800/564]"
              className="rounded-[3px] shadow-md ring-1 ring-black/5" sizes="(min-width:768px) 34vw, 90vw" />
          </Reveal>
        </div>
        <div className="flex flex-col justify-center">
          {STORY.timeline.map((t, i) => (
            <Reveal key={t.year} delay={i * 120}
              className="relative border-l-2 pb-10 pl-7 last:pb-0" style={{ borderColor: STONE } as CSSProperties}>
              <span aria-hidden className="absolute -left-[7px] top-1 h-3 w-3 rounded-full" style={{ background: ACCENT }} />
              <div className="font-mono text-[13px] font-bold tracking-[0.1em]" style={{ color: ACCENT_INK }}>{t.year}</div>
              <p className="mt-2 font-sans text-[16px] leading-[1.7]" style={{ color: INK }}>{t.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ CAMPSITE ═════════════════════════════════════════ */
function Campsite() {
  return (
    <section id="tjaldsvaedi" className="relative overflow-hidden" style={{ background: GROUND }}>
      <div className="relative min-h-[46vh] w-full">
        <Bg src={IMG.campsiteField} alt={CAMPSITE.fieldAlt} position="center 60%" />
        <div aria-hidden className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(24,35,25,.35), rgba(24,35,25,.15) 40%, rgba(24,35,25,.9))' }} />
        <div className="relative mx-auto flex h-full max-w-6xl items-end px-5 py-14 md:px-8">
          <div>
            <Reveal><Label>{CAMPSITE.eyebrow}</Label></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 font-display font-semibold text-[#F3EEE1]"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.08 }}>
                {CAMPSITE.title}
              </h2>
            </Reveal>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1fr] md:items-center md:px-8">
        <Reveal>
          <p className="max-w-md font-sans text-[15.5px] leading-[1.75]" style={{ color: PARCH_SOFT }}>
            {CAMPSITE.body}
          </p>
        </Reveal>
        <Reveal delay={100}>
          <dl className="divide-y" style={{ borderColor: HAIR_D }}>
            {CAMPSITE.prices.map((p) => (
              <div key={p.label} className="flex items-baseline justify-between gap-4 py-3.5"
                style={{ borderColor: HAIR_D }}>
                <dt className="font-sans text-[14.5px]" style={{ color: PARCH_SOFT }}>{p.label}</dt>
                <dd className="font-mono text-[15px] font-bold tracking-[0.02em]" style={{ color: ACCENT }}>{p.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
      {/* wide heath divider band */}
      <div className="relative h-[24vh] min-h-[150px] w-full">
        <Bg src={IMG.heathPanorama} alt={CAMPSITE.wideAlt} position="center" />
        <div aria-hidden className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(24,35,25,.55), rgba(24,35,25,.35))' }} />
      </div>
    </section>
  )
}

/* ═══════════════════════ REVIEWS ══════════════════════════════════════════ */
function Reviews() {
  return (
    <section style={{ background: PARCH }}>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal><Label color={INK_MUTE}>{REVIEWS.eyebrow}</Label></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 font-display font-semibold" style={{ color: INK, fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', lineHeight: 1.1 }}>
                {REVIEWS.title}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[3rem] font-semibold leading-none" style={{ color: INK }}>{REVIEWS.score}</span>
              <span className="font-mono text-[15px]" style={{ color: INK_MUTE }}>{REVIEWS.scoreScale}</span>
              <span className="ml-2 font-mono text-[11.5px] uppercase tracking-[0.12em]" style={{ color: INK_MUTE }}>
                {REVIEWS.scoreCount}
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {/* VERIFY EXACT QUOTE + NAME + DATE BEFORE LAUNCH — see data.ts */}
          {REVIEWS.items.map((r, i) => (
            <Reveal key={i} delay={i * 90} as="blockquote"
              className="m-0 flex flex-col justify-between rounded-[4px] border p-6"
              style={{ borderColor: HAIR_L, background: '#FBF8F0' } as CSSProperties}>
              <p className="font-display text-[1.15rem] font-medium leading-snug" style={{ color: INK }}>
                „{r.quote}“
              </p>
              <cite className="mt-5 font-mono text-[11px] not-italic uppercase tracking-[0.1em]" style={{ color: INK_MUTE }}>
                {r.by}
              </cite>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 font-sans text-[12px] italic" style={{ color: INK_MUTE }}>
          {REVIEWS.disclaimer}
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════ PRACTICAL / LOCATION ═════════════════════════════ */
function Practical() {
  return (
    <section id="hafa-samband" style={{ background: GROUND }}>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:gap-14 md:px-8 md:py-28">
        <div>
          <Reveal><Label>{PRACTICAL.eyebrow}</Label></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 font-display font-semibold text-[#F3EEE1]"
              style={{ fontSize: 'clamp(2rem, 4.8vw, 3.2rem)', lineHeight: 1.1 }}>
              {PRACTICAL.title}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-md font-sans text-[15.5px] leading-[1.75]" style={{ color: PARCH_SOFT }}>
              {PRACTICAL.gateway}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <dl className="mt-8 divide-y" style={{ borderColor: HAIR_D }}>
              {PRACTICAL.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 py-3.5" style={{ borderColor: HAIR_D }}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: PARCH_MUTE }}>{row.label}</dt>
                  <dd className="text-right font-sans text-[14.5px]" style={{ color: PARCH }}>
                    {row.href ? (
                      <a href={row.href} className={`underline decoration-[#B08A3E]/50 underline-offset-4 hover:decoration-[#B08A3E] ${FOCUS}`}>
                        {row.value}
                      </a>
                    ) : row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={260}>
            <p className="mt-6 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.04em]" style={{ color: ACCENT }}>
              <MapPin size={15} strokeWidth={2} aria-hidden /> {PRACTICAL.season}
            </p>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="h-full min-h-[320px] overflow-hidden rounded-[4px]"
            style={{ border: `1px solid ${HAIR_D}` }}>
            <iframe title={`Kort af Hótel Bjarkalundi, ${ADDRESS}`} src={MAP_EMBED}
              loading="eager" referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[320px] w-full border-0" style={{ filter: 'grayscale(.2) contrast(1.05)' }} />
          </div>
          <a href={MAP_LINK} target="_blank" rel="noreferrer"
            className={`mt-3 inline-flex items-center gap-1.5 font-mono text-[11.5px] tracking-[0.04em] ${FOCUS}`}
            style={{ color: PARCH_MUTE }}>
            Opna í Google kortum <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════ CLOSING CTA ══════════════════════════════════════ */
function Closing() {
  return (
    <section id="boka" className="relative overflow-hidden" style={{ background: GROUND2 }}>
      <div className="mx-auto max-w-4xl px-5 py-24 text-center md:px-8 md:py-32">
        <Reveal><Label>{CLOSING.eyebrow}</Label></Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-4 max-w-2xl font-display font-semibold text-[#F3EEE1]"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.06 }}>
            {CLOSING.title}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-5 max-w-md font-sans text-[15.5px] leading-[1.7]" style={{ color: PARCH_SOFT }}>
            {CLOSING.body}
          </p>
        </Reveal>
        <Reveal delay={200} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href={BOOKING_URL} target="_blank" rel="noreferrer"
            className={`inline-flex min-h-[54px] items-center gap-2 rounded-full px-8 font-sans text-[15px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
            style={{ background: ACCENT, color: GROUND }}>
            {CLOSING.book} <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden />
          </a>
          <a href={PHONE_HREF}
            className={`inline-flex min-h-[54px] items-center gap-2 rounded-full border px-7 font-sans text-[15px] font-semibold ${FOCUS}`}
            style={{ borderColor: 'rgba(243,238,225,.5)', color: PARCH }}>
            <Phone size={17} strokeWidth={2} aria-hidden /> {PHONE_DISPLAY}
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════ STICKY MOBILE CTA ════════════════════════════════ */
function StickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[auto_1fr] md:hidden"
      style={{ background: ACCENT, paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <a href={PHONE_HREF}
        className={`flex min-h-[54px] items-center gap-2 border-r px-5 font-sans text-[13.5px] font-bold ${FOCUS_DARK}`}
        style={{ color: GROUND, borderColor: 'rgba(24,35,25,.28)' }}>
        <Phone size={16} strokeWidth={2.2} aria-hidden /> {STICKY.call}
      </a>
      <a href={BOOKING_URL} target="_blank" rel="noreferrer"
        className={`flex min-h-[54px] items-center justify-center font-sans text-[14.5px] font-bold ${FOCUS_DARK}`}
        style={{ color: GROUND }}>
        {STICKY.book}
      </a>
    </div>
  )
}

/* ═══════════════════════ PAGE ═════════════════════════════════════════════ */
export default function Page() {
  /* Lenis smooth scroll — skipped entirely under reduced motion. */
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({ duration: 1.1 })
    lenisInstance = lenis
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisInstance = null }
  }, [])

  useEffect(() => {
    document.title = 'Hótel Bjarkalundur · Hliðið að Vestfjörðum'
    setThemeColor(GROUND)
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(s)
    return () => { s.remove() }
  }, [])

  const initialVars = useMemo(() => ({ background: GROUND }) as CSSProperties, [])

  return (
    <div lang="is" className="pb-[calc(54px+env(safe-area-inset-bottom))] md:pb-0" style={initialVars}>
      <TopNav />
      <main>
        <Hero />
        <FactsStrip />
        <Vadalfjoll />
        <Rooms />
        <Restaurant />
        <Character />
        <Story />
        <Campsite />
        <Reviews />
        <Practical />
        <Closing />
      </main>
      <StickyBar />
      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
