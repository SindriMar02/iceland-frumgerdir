/* ── Litla-Hof — „Hjá torfkirkjunni" ─────────────────────────────────────────
 * The page is the slow drive up to the farm: Ring Road → open Öræfi valley →
 * Iceland's youngest turf church → the farm gate. ONE scroll-linked signature:
 * the gate line, a thin ink route that draws itself down the page as you
 * scroll and arrives as a small rust dot beside the phone number.
 *
 * Motion kit: Lenis smooth scroll, mount-triggered hero stagger (rise+blur,
 * no overflow masks near Icelandic accents), clip-path reveals on standalone
 * content photos (IO on an untransformed wrapper), raw per-frame attribute
 * writes for the scroll-scrubbed line (no CSS transition on scrubbed values).
 * prefers-reduced-motion renders everything plainly, line fully drawn.
 * ───────────────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import Lenis from 'lenis'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  APPROACH,
  CHURCH,
  CLOSING,
  COTTAGES,
  DISCLOSURE,
  EMAIL,
  FARM,
  HERO,
  IMG,
  MAP_HREF,
  NEARBY,
  PHONE_1,
  PHONE_1_HREF,
  PHONE_2,
  PHONE_2_HREF,
  PRACTICAL,
  REVIEWS,
  ROOMS,
} from './data'

const company = getPreviewCompany('litlahof')

/* ── Palette (from the brief, AA-checked there) ──────────────────────────── */
const GROUND = '#F4F1E9' // warm overcast-sky paper
const INK = '#20241F' // near-black warm green-black (turf roof / mountain shadow)
const ACCENT = '#8B3A2B' // the church's weathered red timber trim — used sparingly
const GRASS = '#5C6B57' // muted field green, secondary copy
const STONE = '#C9CCC0' // pale stone grey, labels on dark scrims
const HAIRLINE = 'rgba(32,36,31,.16)'

const TALL = "'Cormorant Garamond', Georgia, serif"
const EASE = 'cubic-bezier(.22,.68,.16,1)'
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#20241F]'
const FOCUS_LIGHT =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4F1E9]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── useInView — IO on an untransformed wrapper; failsafe is GATED by
 * viewport position so below-fold reveals still animate (ledger #25). */
function useInView(threshold = 0.16) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) {
      setShown(true)
      return
    }
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
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
      { threshold, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    const t = window.setTimeout(() => {
      const rr = el.getBoundingClientRect()
      if (rr.top < window.innerHeight && rr.bottom > 0) setShown(true)
    }, 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [threshold])
  return { ref, shown }
}

/* ── Reveal — rise + blur entrance (no overflow mask: Icelandic accents). ── */
function Reveal({
  children,
  delay = 0,
  y = 18,
  className = '',
  style,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
  as?: 'div' | 'figure' | 'li' | 'p'
}) {
  const { ref, shown } = useInView()
  const Tag = as
  const reduced = prefersReduced()
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={
        reduced
          ? style
          : {
              ...style,
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : `translateY(${y}px)`,
              filter: shown ? 'blur(0px)' : 'blur(6px)',
              transition: `opacity .7s ${EASE} ${delay}ms, transform .7s ${EASE} ${delay}ms, filter .7s ${EASE} ${delay}ms`,
            }
      }
    >
      {children}
    </Tag>
  )
}

/* ── ClipPhoto — standalone content photo with explicit aspect box; the
 * wrapper holds the IO (untransformed), the inner img clips open. ────────── */
function ClipPhoto({
  src,
  alt,
  className = '',
  imgClassName = '',
  fallbackClassName,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  fallbackClassName?: string
}) {
  const { ref, shown } = useInView(0.14)
  const reduced = prefersReduced()
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <Img
        src={src}
        alt={alt}
        className={`block h-full w-full object-cover ${imgClassName}`}
        style={
          reduced
            ? undefined
            : {
                clipPath: shown ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                transform: shown ? 'scale(1)' : 'scale(1.07)',
                transition: `clip-path .9s ${EASE}, transform 1.15s ${EASE}`,
              }
        }
        fallbackClassName={fallbackClassName ?? 'bg-gradient-to-br from-[#c9ccc0] to-[#5c6b57]'}
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
 * THE GATE LINE — the one scroll-linked signature. A single ink route drawn
 * across the whole page height, scrubbed by document scrollYProgress.
 * Implementation notes (craft ledger): explicit h-full on the SVG (a replaced
 * element ignores top-0/bottom-0 stretching, #26), preserveAspectRatio="none"
 * with vector-effect so the 2px stroke never distorts, attribute writes via
 * useMotionValueEvent (motion.path does not subscribe to attr props, #19),
 * everything derived from the raw progress value in one callback (#26b).
 * ════════════════════════════════════════════════════════════════════════ */
const LINE_DESKTOP =
  'M 66 4.5 C 74 6.5, 92 7.5, 94 11 C 96 15, 92 17, 60 18.5 C 30 20, 8 21, 6 25 ' +
  'C 4.5 29, 5 31.5, 6 34 C 7 37, 5 39, 6 41.5 C 7 44.5, 90 45.5, 94 49 ' +
  'C 96.5 53, 95 57, 94.5 61 C 94 65, 40 66.5, 10 68 C 5 69.5, 5.5 73, 6.5 76 ' +
  'C 7.5 79, 6 81, 7 83.5 C 8 86, 40 86.5, 49 88'
const LINE_MOBILE =
  'M 5 3 C 6.5 15, 3.5 30, 5 45 C 6.5 60, 4 75, 5 88'
const DOT_DESKTOP = 'M 49 88 l 0.01 0'
const DOT_MOBILE = 'M 5 88 l 0.01 0'

function GateLine({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  const reduced = prefersReduced()
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const pathD = useRef<SVGPathElement>(null)
  const pathM = useRef<SVGPathElement>(null)
  const dotD = useRef<SVGPathElement>(null)
  const dotM = useRef<SVGPathElement>(null)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return
    // Everything derives from the raw progress value, written raw per frame.
    const drawn = Math.min(1, 0.05 + 0.96 * v)
    const opacity = 0.28 + 0.5 * Math.min(1, v * 2.2)
    const dotOpacity = v > 0.955 ? Math.min(1, (v - 0.955) / 0.03) : 0
    for (const p of [pathD.current, pathM.current]) {
      if (!p) continue
      p.setAttribute('stroke-dashoffset', String(1 - drawn))
      p.setAttribute('opacity', String(opacity))
    }
    for (const d of [dotD.current, dotM.current]) {
      if (!d) continue
      d.setAttribute('opacity', String(dotOpacity))
    }
  })

  const lineCommon = {
    fill: 'none',
    stroke: INK,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
    pathLength: 1,
    strokeDasharray: '1',
    strokeDashoffset: reduced ? 0 : 0.95,
    opacity: reduced ? 0.42 : 0.28,
  }
  const dotCommon = {
    fill: 'none',
    stroke: ACCENT,
    strokeWidth: 9,
    strokeLinecap: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
    opacity: reduced ? 1 : 0,
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[15]">
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={pathD} d={LINE_DESKTOP} className="hidden md:block" {...lineCommon} />
        <path ref={pathM} d={LINE_MOBILE} className="md:hidden" {...lineCommon} />
        <path ref={dotD} d={DOT_DESKTOP} className="hidden md:block" {...dotCommon} />
        <path ref={dotM} d={DOT_MOBILE} className="md:hidden" {...dotCommon} />
      </svg>
    </div>
  )
}

/* ── Nav — transparent over the hero, paper after scroll. Mobile gets a
 * full-screen overlay menu rendered as a SIBLING of <nav> (not nested inside
 * it): backdrop-filter on the nav makes it a containing block for fixed
 * descendants, which would silently collapse a nested fixed overlay to the
 * nav's own box. ───────────────────────────────────────────────────────── */
const NAV_H = 72 // px — py-3.5 (2×14px) + the 44px mobile tap targets

function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = prefersReduced()
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])
  const navOpaque = scrolled || open
  const ink = navOpaque ? INK : GROUND
  const focusCls = navOpaque ? FOCUS : FOCUS_LIGHT
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
  }
  const links = [
    { id: 'kirkjan', label: 'Kirkjan' },
    { id: 'buid', label: 'Búið' },
    { id: 'gisting', label: 'Gisting' },
    { id: 'umsagnir', label: 'Umsagnir' },
    { id: 'samband', label: 'Hafa samband' },
  ]
  const navigate = (id: string) => {
    setOpen(false)
    requestAnimationFrame(() => go(id))
  }
  return (
    <>
      <nav
        aria-label="Aðalvalmynd"
        className="fixed inset-x-0 top-0 z-40"
        style={{
          background: navOpaque ? 'rgba(244,241,233,.94)' : 'transparent',
          borderBottom: `1px solid ${navOpaque ? HAIRLINE : 'transparent'}`,
          backdropFilter: navOpaque ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: navOpaque ? 'blur(10px)' : 'none',
          transition: 'background .35s ease, border-color .35s ease',
        }}
      >
        {!navOpaque && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24"
            style={{ background: 'linear-gradient(to bottom, rgba(32,36,31,.55), transparent)' }}
          />
        )}
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <button
            onClick={() => {
              setOpen(false)
              window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })
            }}
            className={`text-[19px] leading-none ${focusCls}`}
            style={{ fontFamily: TALL, fontWeight: 500, color: ink, letterSpacing: '.01em' }}
          >
            Litla-Hof
          </button>
          <div className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`font-sans text-[13px] font-medium underline-offset-[5px] hover:underline ${focusCls}`}
                style={{ color: ink }}
              >
                {l.label}
              </button>
            ))}
            <a href={PHONE_1_HREF} className={`font-mono text-[13px] ${focusCls}`} style={{ color: ink }}>
              {PHONE_1}
            </a>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={PHONE_1_HREF}
              className={`inline-flex min-h-[44px] items-center font-mono text-[13px] ${focusCls}`}
              style={{ color: ink }}
            >
              {PHONE_1}
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="litlahof-mobile-menu"
              aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center ${focusCls}`}
            >
              <span aria-hidden className="flex h-4 w-5 flex-col justify-between">
                <span
                  className="block h-[1.5px] w-full"
                  style={{
                    background: ink,
                    transform: open ? 'translateY(7.25px) rotate(45deg)' : 'none',
                    transition: reduced ? 'none' : `transform 300ms ${EASE}`,
                  }}
                />
                <span
                  className="block h-[1.5px] w-full"
                  style={{
                    background: ink,
                    transform: open ? 'translateY(-7.25px) rotate(-45deg)' : 'none',
                    transition: reduced ? 'none' : `transform 300ms ${EASE}`,
                  }}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu — sibling of <nav>, not nested inside it. */}
      <div
        id="litlahof-mobile-menu"
        aria-hidden={!open}
        className="fixed inset-0 z-30 flex flex-col md:hidden"
        style={{
          paddingTop: NAV_H,
          paddingBottom: 'calc(70px + env(safe-area-inset-bottom))',
          background: GROUND,
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          pointerEvents: open ? 'auto' : 'none',
          transition: reduced ? 'none' : `opacity 320ms ${EASE}, visibility 0s linear ${open ? '0s' : '320ms'}`,
        }}
      >
        <div className="flex flex-1 flex-col justify-center gap-1 px-6">
          {links.map((l, i) => (
            <div key={l.id} className="overflow-hidden py-1.5">
              <button
                type="button"
                onClick={() => navigate(l.id)}
                className={`block text-left ${FOCUS}`}
                style={{
                  fontFamily: TALL,
                  fontWeight: 400,
                  fontSize: 'clamp(2rem,9vw,3.1rem)',
                  lineHeight: 1.14,
                  color: INK,
                  transform: reduced ? 'none' : open ? 'translateY(0)' : 'translateY(105%)',
                  transition: reduced ? 'none' : `transform 560ms ${EASE} ${open ? 60 + i * 60 : 0}ms`,
                }}
              >
                {l.label}
              </button>
            </div>
          ))}
        </div>
        <div className="px-6">
          <div
            aria-hidden
            className="h-[2px] w-16"
            style={{
              background: ACCENT,
              transformOrigin: 'left',
              transform: reduced ? 'scaleX(1)' : open ? 'scaleX(1)' : 'scaleX(0)',
              transition: reduced ? 'none' : `transform 550ms ${EASE} ${open ? 320 : 0}ms`,
            }}
          />
          <a
            href={PHONE_1_HREF}
            className={`mt-6 inline-block font-mono text-[clamp(1.35rem,5.5vw,1.9rem)] ${FOCUS}`}
            style={{ color: ACCENT }}
          >
            {PHONE_1}
          </a>
        </div>
      </div>
    </>
  )
}

/* ══ 1 · HERO — mount-triggered stagger, eager full-bleed photo (ledger #12) */
function Hero() {
  const [inn, setInn] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setInn(true))
    return () => cancelAnimationFrame(raf)
  }, [])
  const reduced = prefersReduced()
  const show = reduced || inn
  const step = (i: number): CSSProperties =>
    reduced
      ? {}
      : {
          opacity: show ? 1 : 0,
          transform: show ? 'none' : 'translateY(24px)',
          filter: show ? 'blur(0px)' : 'blur(8px)',
          transition: `opacity .85s ${EASE} ${120 + i * 85}ms, transform .85s ${EASE} ${120 + i * 85}ms, filter .85s ${EASE} ${120 + i * 85}ms`,
        }
  return (
    <header className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <Img
        src={IMG.hero}
        alt={HERO.imageAlt}
        fetchpriority="high"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover"
        style={
          reduced
            ? undefined
            : {
                transform: show ? 'scale(1)' : 'scale(1.09)',
                filter: show ? 'blur(0px)' : 'blur(10px)',
                transition: `transform 1.7s ${EASE}, filter 1.4s ${EASE}`,
              }
        }
        fallbackClassName="bg-gradient-to-br from-[#8a8f7c] to-[#3c4237]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(32,36,31,.78) 0%, rgba(32,36,31,.38) 38%, rgba(32,36,31,.06) 68%)',
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-[clamp(4.5rem,10vh,7.5rem)] pt-32 md:px-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.22em]" style={{ ...step(0), color: STONE }}>
          {HERO.eyebrow}
        </p>
        <h1
          className="mt-5 max-w-[17ch]"
          style={{ fontFamily: TALL, fontWeight: 400, fontSize: 'clamp(2.1rem,5.6vw,4.3rem)', lineHeight: 1.16, color: GROUND }}
        >
          <span className="block" style={step(1)}>
            {HERO.h1a}
          </span>
          <span className="block" style={step(2)}>
            {HERO.h1b}
          </span>
        </h1>
        <p className="mt-5 max-w-[52ch] font-sans text-[15px] leading-[1.65]" style={{ ...step(3), color: 'rgba(244,241,233,.88)' }}>
          {HERO.sub}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" style={step(4)}>
          <a
            href="#samband"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('samband')?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
            }}
            className={`inline-flex min-h-[48px] items-center px-7 font-sans text-[14px] font-semibold tracking-[0.02em] transition-transform duration-200 active:scale-[0.98] ${FOCUS_LIGHT}`}
            style={{ background: ACCENT, color: '#FFFFFF' }}
          >
            {HERO.cta}
          </a>
          <a href={PHONE_1_HREF} className={`inline-flex min-h-[44px] items-center font-mono text-[15px] underline-offset-[6px] hover:underline ${FOCUS_LIGHT}`} style={{ color: GROUND }}>
            {PHONE_1}
          </a>
        </div>
      </div>
    </header>
  )
}

/* ══ 2 · THE APPROACH — full-bleed valley photo, the drive off Route 1 ═════ */
function Approach() {
  return (
    <section aria-label="Aðkoman" className="pt-[clamp(4.5rem,9vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2 style={{ fontFamily: TALL, fontWeight: 400, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.16, color: INK }}>
            {APPROACH.heading}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 max-w-[58ch] font-sans text-[15.5px] leading-[1.7]" style={{ color: GRASS }}>
            {APPROACH.body}
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
            {APPROACH.labels.map((l) => (
              <span key={l} className="font-mono text-[12px] uppercase tracking-[0.14em]" style={{ color: INK }}>
                {l}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="mt-10 md:mt-14">
        <ClipPhoto src={IMG.valley} alt={APPROACH.imageAlt} className="aspect-[16/10] w-full sm:aspect-[21/9]" />
      </div>
    </section>
  )
}

/* ══ 3 · HOFSKIRKJA — the emotional anchor, given real room to breathe ═════ */
function Church() {
  return (
    <section id="kirkjan" aria-label="Hofskirkja" className="py-[clamp(5rem,11vw,10rem)]">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <Reveal>
            <h2 style={{ fontFamily: TALL, fontWeight: 400, fontSize: 'clamp(2.3rem,5.2vw,4rem)', lineHeight: 1.16, color: INK }}>
              {CHURCH.heading}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-4 text-[18px] italic leading-[1.6]" style={{ fontFamily: TALL, color: GRASS }}>
              {CHURCH.lede}
            </p>
          </Reveal>
        </div>
        <Reveal delay={120} as="figure" className="m-0 mt-10 md:mt-14">
          <ClipPhoto src={IMG.church} alt={CHURCH.imageAlt} className="mx-auto aspect-[4/3] w-full max-w-3xl" />
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4">
          {CHURCH.facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 80} className="text-center">
              <div style={{ fontFamily: TALL, fontWeight: 500, fontSize: 'clamp(1.4rem,3vw,2.1rem)', lineHeight: 1.1, color: INK }}>
                {f.value}
              </div>
              <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: GRASS }}>
                {f.label}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={100}>
          <p className="mx-auto mt-10 max-w-[62ch] text-center font-sans text-[15.5px] leading-[1.75]" style={{ color: INK }}>
            {CHURCH.body}
          </p>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2">
          {CHURCH.quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 90} className="border-t pt-6" style={{ borderColor: HAIRLINE }}>
              <p lang="en" className="font-sans text-[14.5px] italic leading-[1.65]" style={{ color: INK }}>
                „{q.text}"
              </p>
              <p className="mt-3 font-sans text-[13px] font-semibold" style={{ color: GRASS }}>
                {q.name} <span className="font-normal">· {q.source}</span>
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══ 4 · THE FARM — full-bleed stone-wall band, scale honesty stated plainly */
function Farm() {
  return (
    <section id="buid" aria-label="Búið" className="relative overflow-hidden">
      {/* Full-bleed background photo: eager plain render (ledger #12), text on scrim. */}
      <Img
        src={IMG.stonewall}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        fallbackClassName="bg-gradient-to-br from-[#5c6b57] to-[#20241f]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(100deg, rgba(32,36,31,.9) 0%, rgba(32,36,31,.74) 55%, rgba(32,36,31,.5) 100%)' }}
      />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-[clamp(5rem,11vw,9.5rem)] md:px-8">
        <div className="max-w-[560px]">
          <Reveal>
            <h2 style={{ fontFamily: TALL, fontWeight: 400, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.16, color: GROUND }}>
              {FARM.heading}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-5 font-sans text-[15.5px] leading-[1.7]" style={{ color: 'rgba(244,241,233,.92)' }}>
              {FARM.body}
            </p>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 font-mono text-[12.5px] leading-[1.7]" style={{ color: STONE }}>
              {FARM.datedNote}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══ 5 · FARMHOUSE ROOMS — the ONE functional asymmetric split:
 * sticky info rail (specs stay readable) beside the photo column. ══════════ */
function Rooms() {
  return (
    <section id="gisting" aria-label="Herbergin í bænum" className="py-[clamp(4.5rem,9vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
          <div className="md:sticky md:top-24 md:self-start">
            <Reveal>
              <h2 style={{ fontFamily: TALL, fontWeight: 400, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.16, color: INK }}>
                {ROOMS.heading}
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-4 font-sans text-[15px] leading-[1.7]" style={{ color: INK }}>
                {ROOMS.body}
              </p>
            </Reveal>
            <Reveal delay={130}>
              <p className="mt-3 font-sans text-[14px] leading-[1.65]" style={{ color: GRASS }}>
                {ROOMS.sleepingBag}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <dl className="mt-7 border-t" style={{ borderColor: HAIRLINE }}>
                {ROOMS.specs.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-4 border-b py-3" style={{ borderColor: HAIRLINE }}>
                    <dt className="font-sans text-[13.5px] font-medium" style={{ color: GRASS }}>
                      {s.label}
                    </dt>
                    <dd className="font-mono text-[14px]" style={{ color: INK }}>
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <div className="flex flex-col gap-5">
            <ClipPhoto src={IMG.room1} alt={ROOMS.photos[0].alt} className="aspect-[4/3] w-full" />
            <div className="grid grid-cols-2 gap-5">
              <ClipPhoto src={IMG.room2} alt={ROOMS.photos[1].alt} className="aspect-[4/5] w-full" />
              <ClipPhoto src={IMG.bathroom} alt={ROOMS.photos[2].alt} className="aspect-[4/5] w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══ 6 · THE COTTAGES — collective photos (no unverified house-to-photo
 * pairing), two named text cards, indicative third-party rate + footnote. ══ */
function Cottages() {
  return (
    <section aria-label="Sumarhúsin" className="pb-[clamp(4.5rem,9vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2 style={{ fontFamily: TALL, fontWeight: 400, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.16, color: INK }}>
            {COTTAGES.heading}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 max-w-[58ch] font-sans text-[15px] leading-[1.7]" style={{ color: GRASS }}>
            {COTTAGES.body}
          </p>
        </Reveal>
        <div className="mt-9 grid gap-5 sm:grid-cols-2">
          <ClipPhoto src={IMG.cottageA} alt={COTTAGES.cards[0].alt} className="aspect-[4/3] w-full" />
          <ClipPhoto src={IMG.cottageWhite} alt={COTTAGES.cards[1].alt} className="aspect-[4/3] w-full" />
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {COTTAGES.cards.map((c, i) => (
            <Reveal key={c.name} delay={i * 90} className="border-t pt-5" style={{ borderColor: HAIRLINE }}>
              <h3 style={{ fontFamily: TALL, fontWeight: 500, fontSize: '1.5rem', lineHeight: 1.2, color: INK }}>{c.name}</h3>
              <p className="mt-2 font-sans text-[14.5px] leading-[1.65]" style={{ color: GRASS }}>
                {c.desc}
              </p>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {COTTAGES.interiors.map((p) => (
            <ClipPhoto key={p.img} src={IMG[p.img]} alt={p.alt} className="aspect-[16/10] w-full" />
          ))}
        </div>
        <Reveal delay={80}>
          <div className="mt-10 max-w-[640px]">
            <p className="font-mono text-[17px]" style={{ color: INK }}>
              {COTTAGES.priceLabel}
            </p>
            <p className="mt-2 font-sans text-[12.5px] leading-[1.65]" style={{ color: GRASS }}>
              {COTTAGES.priceNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ══ 7 · REVIEWS — real scores, real quotes, the doorway photo anchor ══════ */
function Reviews() {
  return (
    <section id="umsagnir" aria-label="Umsagnir gesta" className="pb-[clamp(4.5rem,9vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2 style={{ fontFamily: TALL, fontWeight: 400, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.16, color: INK }}>
            {REVIEWS.heading}
          </h2>
        </Reveal>
        <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {REVIEWS.scores.map((s, i) => (
            <Reveal key={s.note} delay={i * 70}>
              <div className="flex items-baseline gap-1.5">
                <span style={{ fontFamily: TALL, fontWeight: 500, fontSize: 'clamp(2rem,4vw,2.8rem)', lineHeight: 1, color: INK }}>{s.value}</span>
                <span className="font-mono text-[13px]" style={{ color: GRASS }}>
                  {s.of}
                </span>
              </div>
              <p className="mt-2 font-sans text-[12.5px] leading-[1.5]" style={{ color: GRASS }}>
                {s.note}
              </p>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
          <ClipPhoto src={IMG.doorway} alt={REVIEWS.imageAlt} className="aspect-[4/3] w-full" />
          <div className="flex flex-col gap-9">
            {REVIEWS.quotes.map((q) => (
              <Reveal key={q.name} className="border-t pt-6" style={{ borderColor: HAIRLINE }}>
                <p lang="en" className="font-sans text-[15.5px] italic leading-[1.65]" style={{ color: INK }}>
                  „{q.text}"
                </p>
                <p className="mt-3 font-sans text-[13px] font-semibold" style={{ color: GRASS }}>
                  {q.name} <span className="font-normal">· {q.source}</span>
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══ 8 · AROUND HERE — honest distances, the peak photo ═══════════════════ */
function Nearby() {
  return (
    <section aria-label="Í nágrenninu" className="pb-[clamp(4.5rem,9vw,8rem)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
          <ClipPhoto src={IMG.peak} alt={NEARBY.imageAlt} className="aspect-[4/3] w-full md:aspect-[4/5]" />
          <div>
            <Reveal>
              <h2 style={{ fontFamily: TALL, fontWeight: 400, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.16, color: INK }}>
                {NEARBY.heading}
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-4 font-sans text-[15px] leading-[1.7]" style={{ color: GRASS }}>
                {NEARBY.body}
              </p>
            </Reveal>
            <ul className="mt-8">
              {NEARBY.places.map((p, i) => (
                <Reveal key={p.name} as="li" delay={i * 70} className="border-t py-4" style={{ borderColor: HAIRLINE }}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-sans text-[15.5px] font-semibold" style={{ color: INK }}>
                      {p.name}
                    </span>
                    <span className="shrink-0 font-mono text-[13px]" style={{ color: ACCENT }}>
                      {p.dist}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-[13.5px] leading-[1.55]" style={{ color: GRASS }}>
                    {p.desc}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══ 9 · PRACTICAL — phone huge, season honest, where the line arrives ═════ */
function Practical() {
  return (
    <section id="samband" aria-label="Hagnýtar upplýsingar" className="border-t pb-[clamp(4rem,8vw,6.5rem)] pt-[clamp(4.5rem,9vw,8rem)]" style={{ borderColor: HAIRLINE }}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2 style={{ fontFamily: TALL, fontWeight: 400, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.16, color: INK }}>
            {PRACTICAL.heading}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-7 flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <a href={PHONE_1_HREF} className={`underline-offset-[8px] hover:underline ${FOCUS}`} style={{ fontFamily: TALL, fontWeight: 500, fontSize: 'clamp(2.2rem,6vw,4rem)', lineHeight: 1.1, color: INK }}>
              {PHONE_1}
            </a>
            <a href={PHONE_2_HREF} className={`underline-offset-[8px] hover:underline ${FOCUS}`} style={{ fontFamily: TALL, fontWeight: 500, fontSize: 'clamp(2.2rem,6vw,4rem)', lineHeight: 1.1, color: GRASS }}>
              {PHONE_2}
            </a>
          </div>
        </Reveal>
        <Reveal delay={130}>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
            <a href={`mailto:${EMAIL}`} className={`inline-flex min-h-[44px] items-center font-mono text-[15px] underline-offset-[5px] hover:underline ${FOCUS}`} style={{ color: ACCENT }}>
              {EMAIL}
            </a>
            <span className="font-sans text-[14px]" style={{ color: GRASS }}>
              {ADDRESS}
            </span>
            <a href={MAP_HREF} target="_blank" rel="noreferrer" className={`inline-flex min-h-[44px] items-center font-sans text-[14px] underline underline-offset-[4px] ${FOCUS}`} style={{ color: INK }}>
              Sjá á korti
            </a>
          </div>
        </Reveal>
        <Reveal delay={170}>
          <p className="mt-8 inline-block border-b-2 pb-1 font-sans text-[15px] font-medium" style={{ color: INK, borderColor: ACCENT }}>
            {PRACTICAL.season}
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden sm:grid-cols-4" style={{ background: HAIRLINE, border: `1px solid ${HAIRLINE}` }}>
          {PRACTICAL.items.map((it, i) => (
            <Reveal key={it.label} delay={i * 60} className="p-4 sm:p-5" style={{ background: GROUND }}>
              <div className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: GRASS }}>
                {it.label}
              </div>
              <div className="mt-1.5 font-mono text-[14.5px]" style={{ color: INK }}>
                {it.value}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══ 10 · CLOSING — the quiet window, the direct ask ══════════════════════ */
function Closing() {
  return (
    <section aria-label="Fyrirspurn" className="pb-[clamp(5rem,10vw,8.5rem)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <ClipPhoto src={IMG.window} alt={CLOSING.imageAlt} className="aspect-[4/3] w-full" />
          <Reveal delay={60}>
            <h2 className="mt-10" style={{ fontFamily: TALL, fontWeight: 400, fontSize: 'clamp(2rem,4.4vw,3.2rem)', lineHeight: 1.16, color: INK }}>
              {CLOSING.heading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-4 max-w-[46ch] font-sans text-[15px] leading-[1.7]" style={{ color: GRASS }}>
              {CLOSING.body}
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${EMAIL}`}
                className={`inline-flex min-h-[48px] items-center px-7 font-sans text-[14px] font-semibold transition-transform duration-200 active:scale-[0.98] ${FOCUS}`}
                style={{ background: ACCENT, color: '#FFFFFF' }}
              >
                Senda fyrirspurn
              </a>
              <a
                href={PHONE_1_HREF}
                className={`inline-flex min-h-[48px] items-center border px-7 font-mono text-[14px] ${FOCUS}`}
                style={{ borderColor: INK, color: INK }}
              >
                {PHONE_1}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Sticky mobile call bar — a remote farm stay is booked by phone. ─────── */
function StickyCall() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', background: INK }}
    >
      <a
        href={PHONE_1_HREF}
        className={`flex min-h-[54px] items-center justify-center font-sans text-[14px] font-semibold ${FOCUS_LIGHT}`}
        style={{ background: ACCENT, color: '#FFFFFF' }}
      >
        Hringja · {PHONE_1}
      </a>
      <a
        href={`mailto:${EMAIL}`}
        className={`flex min-h-[54px] items-center justify-center font-sans text-[14px] font-semibold ${FOCUS_LIGHT}`}
        style={{ color: GROUND }}
      >
        Fyrirspurn
      </a>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const mainWrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setThemeColor(INK)
    if (prefersReduced()) return
    const lenis = new Lenis({ duration: 1.1 })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <div lang="is" className="font-sans" style={{ background: GROUND, color: INK }}>
      <PreviewChrome company={company} />
      <TopNav />
      <div ref={mainWrapRef} className="relative overflow-x-clip">
        <GateLine containerRef={mainWrapRef} />
        <main>
          <Hero />
          <Approach />
          <Church />
          <Farm />
          <Rooms />
          <Cottages />
          <Reviews />
          <Nearby />
          <Practical />
          <Closing />
        </main>
      </div>

      {/* honesty disclosure — quiet pre-footer line */}
      <section aria-label="Fyrirvari" className="border-t px-5 py-9 md:px-8" style={{ borderColor: HAIRLINE }}>
        <p className="mx-auto max-w-3xl text-center font-sans text-[12px] leading-[1.7]" style={{ color: GRASS }}>
          {DISCLOSURE}
        </p>
      </section>
      <div className="pb-14 md:pb-0">
        <PreviewFooter company={company} />
      </div>
      <StickyCall />
    </div>
  )
}
