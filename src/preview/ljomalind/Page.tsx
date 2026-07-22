import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode, RefObject } from 'react'
import Lenis from 'lenis'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowUpRight, Clock, MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setNoindex, setThemeColor } from '../../lib/preview'
import {
  ACCENT,
  ACCENT_TEXT,
  ADDRESS,
  CARD,
  CATEGORIES,
  CLOSE_MIN,
  CREAM_DIM,
  CREAM_ON_DARK,
  EASE,
  EMAIL,
  GROUND,
  HAIRLINE,
  HAY,
  HOURS,
  HOURS_SHORT,
  IMG,
  INK,
  MAPS_EMBED,
  MAPS_URL,
  MOSS,
  MOSS_TEXT,
  MUTED,
  NAV,
  OPEN_MIN,
  PHONE,
  PHONE_HREF,
  PINE,
  PRODUCERS,
  REVIEWS,
} from './data'

const company = getPreviewCompany('ljomalind')

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const canHoverPointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

const goTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4472A]'

/* Accent-filled CTAs need a ring that stays visible whether the surrounding
 * ground is light or dark (accent-on-accent is invisible) — a double ring
 * (cream inner, ink outer) reads against either. */
const FOCUS_ON_FILL =
  'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_#F6F1E7,0_0_0_4px_#2B241C]'

/* ══════════════════════════════════════════════════════════════════════ */
/*  Motion primitives (IO on an UNTRANSFORMED wrapper — craft ledger #7)     */
/* ══════════════════════════════════════════════════════════════════════ */
function useInViewOnce(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
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
      { threshold, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    const t = window.setTimeout(() => {
      const r2 = el.getBoundingClientRect()
      if (r2.top < window.innerHeight) setShown(true)
    }, 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [threshold])
  return { ref, shown }
}

/* Rise + de-blur reveal — NO overflow clip mask (Icelandic accents safe). */
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
  as?: 'div' | 'figure' | 'li' | 'p' | 'span'
}) {
  const { ref, shown } = useInViewOnce(0.2)
  const reduced = useReducedMotion()
  const Tag = as as 'div'
  const on = shown || !!reduced
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={
        reduced
          ? style
          : {
              ...style,
              opacity: on ? 1 : 0,
              transform: on ? 'none' : `translateY(${y}px)`,
              filter: on ? 'blur(0px)' : 'blur(6px)',
              transition: `opacity .72s ${EASE} ${delay}ms, transform .72s ${EASE} ${delay}ms, filter .72s ${EASE} ${delay}ms`,
            }
      }
    >
      {children}
    </Tag>
  )
}

/* Content photo wipes open from the bottom as it enters (wrapper = IO + aspect,
 * inner layer clips — ledger #7/#12). */
function ClipImg({
  src,
  alt,
  className = '',
  delay = 0,
  fallbackClassName,
  fetchpriority,
}: {
  src: string
  alt: string
  className?: string
  delay?: number
  fallbackClassName?: string
  fetchpriority?: 'high' | 'low' | 'auto'
}) {
  const { ref, shown } = useInViewOnce(0.16)
  const reduced = useReducedMotion()
  const on = shown || !!reduced
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={
          reduced
            ? undefined
            : {
                clipPath: on ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                transition: `clip-path .95s ${EASE} ${delay}ms`,
              }
        }
      >
        <Img
          src={src}
          alt={alt}
          fetchpriority={fetchpriority}
          className="h-full w-full object-cover"
          style={
            reduced
              ? undefined
              : {
                  transform: on ? 'scale(1)' : 'scale(1.08)',
                  transition: `transform 1.25s ${EASE} ${delay}ms`,
                }
          }
          fallbackClassName={fallbackClassName ?? 'bg-gradient-to-br from-[#d8caa6] to-[#8a7f63]'}
        />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  ELEVATION 1 — Vertical Cut Reveal (21st.dev #18595), word-level,         */
/*  mount-triggered, Fraunces, reduced-motion => instant. Accent-safe:       */
/*  plain ease (no overshoot) so á/é never clip the wrapper top edge.        */
/* ══════════════════════════════════════════════════════════════════════ */
function VerticalCutReveal({
  text,
  className = '',
  wordClassName = '',
  baseDelay = 0,
  stagger = 0.05,
}: {
  text: string
  className?: string
  wordClassName?: string
  baseDelay?: number
  stagger?: number
}) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
            // Extra top padding clears tall acutes (é/á in "héraðinu"/"frá")
            // inside this overflow-hidden clip wrapper — verify in-browser at
            // the clamp max; increase further (never reduce line-height) if
            // still clipped.
            style={{ paddingTop: '0.2em', paddingBottom: '0.16em' }}
          >
            <motion.span
              className={`inline-block ${wordClassName}`}
              initial={reduced ? false : { y: '115%' }}
              animate={{ y: 0 }}
              transition={{
                duration: reduced ? 0 : 0.8,
                delay: reduced ? 0 : baseDelay + i * stagger,
                ease: [0.22, 0.61, 0.21, 1],
              }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  )
}

/* Small decorative seed-head mark (aria-hidden, not a reproduction of the
 * real logo — a warm brand flourish only). */
function SeedMark({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
  const spokes = Array.from({ length: 12 })
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none">
      {spokes.map((_, i) => {
        const a = (i / 12) * Math.PI * 2
        const x2 = 12 + Math.cos(a) * 9
        const y2 = 12 + Math.sin(a) * 9
        return (
          <g key={i}>
            <line x1="12" y1="12" x2={x2} y2={y2} stroke={color} strokeWidth="0.9" strokeLinecap="round" />
            <circle cx={x2} cy={y2} r="1" fill={color} />
          </g>
        )
      })}
      <circle cx="12" cy="12" r="1.4" fill={color} />
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Live open / closed against verified daily 10–18 (Iceland time)           */
/* ══════════════════════════════════════════════════════════════════════ */
function isOpenNow(): boolean {
  try {
    const hm = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Atlantic/Reykjavik',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(new Date())
    const [h, m] = hm.split(':').map(Number)
    const mins = h * 60 + m
    return mins >= OPEN_MIN && mins < CLOSE_MIN
  } catch {
    return true
  }
}
function useOpenNow() {
  const [open, setOpen] = useState(isOpenNow)
  useEffect(() => {
    const t = window.setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => window.clearInterval(t)
  }, [])
  return open
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  TOP NAV — transparent over the hero, warm paper once scrolled            */
/* ══════════════════════════════════════════════════════════════════════ */
function TopNav({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* menu open: freeze the page behind it (Lenis + native scroll), Escape closes */
  useEffect(() => {
    if (!open) return
    lenisRef.current?.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      lenisRef.current?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, lenisRef])

  const goMobile = (id: string) => {
    setOpen(false)
    requestAnimationFrame(() => goTo(id))
  }

  const solid = scrolled || open

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
        style={{
          background: solid ? 'rgba(246,241,231,.9)' : 'transparent',
          backdropFilter: solid ? 'blur(10px)' : 'none',
          borderBottom: solid ? `1px solid ${HAIRLINE}` : '1px solid transparent',
        }}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3.5 md:px-8">
          <button
            onClick={() => {
              setOpen(false)
              window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })
            }}
            className={`flex min-h-11 items-center gap-2.5 rounded-full ${FOCUS}`}
            aria-label="Ljómalind, efst á síðu"
          >
            <SeedMark size={22} color={solid ? ACCENT : '#F6F1E7'} />
            <span
              className="font-display text-[19px] font-semibold leading-none"
              style={{ color: solid ? INK : '#F6F1E7' }}
            >
              Ljómalind
            </span>
          </button>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Aðalvalmynd">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goTo(n.id)}
                className={`lj-navlink text-[13.5px] font-medium tracking-wide ${FOCUS}`}
                style={{ color: scrolled ? INK : CREAM_ON_DARK }}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-0">
            <a
              href={PHONE_HREF}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-transform hover:-translate-y-0.5 ${FOCUS_ON_FILL}`}
              style={{ background: ACCENT, color: '#FFF7F0' }}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">{PHONE}</span>
              <span className="sm:hidden">Hringja</span>
            </a>

            {/* hamburger: mobile-only, two lines morphing into an X */}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
              className={`relative ml-1 inline-flex h-11 w-11 shrink-0 items-center justify-center md:hidden ${FOCUS}`}
            >
              <span
                aria-hidden
                className="absolute h-[2px] w-[20px] transition-transform duration-300"
                style={{
                  background: solid ? INK : '#F6F1E7',
                  transform: open ? 'rotate(45deg)' : 'translateY(-4px)',
                  transitionTimingFunction: 'cubic-bezier(.22,.61,.21,1)',
                }}
              />
              <span
                aria-hidden
                className="absolute h-[2px] w-[20px] transition-transform duration-300"
                style={{
                  background: solid ? INK : '#F6F1E7',
                  transform: open ? 'rotate(-45deg)' : 'translateY(4px)',
                  transitionTimingFunction: 'cubic-bezier(.22,.61,.21,1)',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu: full-screen cream overlay, rendered as a SIBLING of the
          header (never inside it — the header's backdrop-filter would become
          the containing block for a fixed descendant and collapse its height).
          Links rise out of masks, Fraunces, staggered. */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="lj-mobile-menu"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-1 px-7 pt-20 md:hidden"
            style={{ background: GROUND }}
          >
            <nav aria-label="Farsímavalmynd" className="flex flex-col gap-1">
              {NAV.map((n, i) => (
                <div key={n.id} className="overflow-hidden py-1.5">
                  <motion.button
                    onClick={() => goMobile(n.id)}
                    className={`block min-h-11 text-left font-display text-[clamp(2rem,9vw,2.8rem)] font-semibold leading-[1.12] ${FOCUS}`}
                    style={{ color: INK }}
                    initial={reduced ? undefined : { y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%', transition: { duration: 0.2, ease: 'easeIn', delay: (NAV.length - 1 - i) * 0.03 } }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.08 + i * 0.06 }}
                  >
                    {n.label}
                  </motion.button>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SIGNATURE — the producer thread rail (one scroll-linked element only)    */
/*  SVG stroke draws down as you scroll the section; category dots light      */
/*  ink -> accent as each is passed. Reduced motion: fully drawn at rest.     */
/* ══════════════════════════════════════════════════════════════════════ */
function ThreadRail({ progress }: { progress: MotionValue<number> }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [h, setH] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setH(el.clientHeight))
    ro.observe(el)
    setH(el.clientHeight)
    return () => ro.disconnect()
  }, [])

  const pathLength = useTransform(progress, [0, 0.92], [0, 1])
  const cx = 11

  return (
    <div ref={trackRef} className="pointer-events-none absolute inset-y-0 left-0 w-[22px]" aria-hidden>
      {h > 0 && (
        <svg width="22" height={h} viewBox={`0 0 22 ${h}`} fill="none" className="overflow-visible">
          {/* faint dashed guide (the "thread outline") */}
          <line
            x1={cx}
            y1={0}
            x2={cx}
            y2={h}
            stroke={ACCENT}
            strokeWidth={1.5}
            strokeDasharray="1 7"
            strokeLinecap="round"
            opacity={0.16}
          />
          {/* drawing accent fill */}
          <motion.line
            x1={cx}
            y1={0}
            x2={cx}
            y2={h}
            stroke={ACCENT}
            strokeWidth={2.5}
            strokeLinecap="round"
            style={{ pathLength: reduced ? 1 : pathLength }}
          />
          {/* category dots */}
          {PRODUCERS.map((_, i) => {
            const f = (i + 0.5) / PRODUCERS.length
            const y = f * h
            return <RailDot key={i} cx={cx} cy={y} progress={progress} f={f} reduced={!!reduced} />
          })}
        </svg>
      )}
    </div>
  )
}

function RailDot({
  cx,
  cy,
  progress,
  f,
  reduced,
}: {
  cx: number
  cy: number
  progress: MotionValue<number>
  f: number
  reduced: boolean
}) {
  const fill = useTransform(progress, [f - 0.05, f + 0.02], [INK, ACCENT])
  const scale = useTransform(progress, [f - 0.05, f + 0.02], [0.7, 1])
  return (
    <>
      <circle cx={cx} cy={cy} r={7} fill={GROUND} />
      <motion.circle
        cx={cx}
        cy={cy}
        r={4}
        style={{
          fill: reduced ? ACCENT : fill,
          scale: reduced ? 1 : scale,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  ELEVATION 2 — Project Showcase (21st.dev #9607) adapted:                  */
/*  desktop hover floats the row's photo toward the cursor (rAF lerp);        */
/*  touch / no-hover renders each photo inline; reduced motion snaps.         */
/* ══════════════════════════════════════════════════════════════════════ */
function ProducerShowcase() {
  const reduced = useReducedMotion()
  const [hoverCapable, setHoverCapable] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)
  const running = useRef(false)

  useEffect(() => {
    setHoverCapable(canHoverPointer())
  }, [])

  /* Idle-cancels once the panel has caught up to the cursor (delta < 0.1px)
   * instead of running forever on top of Lenis's own rAF; onMove restarts it. */
  const startLoop = () => {
    if (running.current) return
    running.current = true
    const loop = () => {
      const k = reduced ? 1 : 0.16
      pos.current.x += (target.current.x - pos.current.x) * k
      pos.current.y += (target.current.y - pos.current.y) * k
      const el = panelRef.current
      if (el) el.style.transform = `translate3d(${pos.current.x + 26}px, ${pos.current.y - 150}px, 0)`
      const dx = Math.abs(target.current.x - pos.current.x)
      const dy = Math.abs(target.current.y - pos.current.y)
      if (dx > 0.1 || dy > 0.1) {
        raf.current = requestAnimationFrame(loop)
      } else {
        running.current = false
      }
    }
    raf.current = requestAnimationFrame(loop)
  }

  useEffect(() => {
    if (!hoverCapable || active === null) return
    startLoop()
    return () => {
      cancelAnimationFrame(raf.current)
      running.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverCapable, active])

  const onMove = (e: ReactMouseEvent) => {
    target.current = { x: e.clientX, y: e.clientY }
    if (reduced) pos.current = { ...target.current }
    startLoop()
  }

  /* ── Touch / no fine-pointer: inline stacked photos ── */
  if (!hoverCapable) {
    return (
      <ul className="flex flex-col">
        {PRODUCERS.map((p, i) => (
          <li
            key={p.key}
            className="border-t py-6 first:border-t-0"
            style={{ borderColor: HAIRLINE }}
          >
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: MOSS_TEXT }}>
                {String(i + 1).padStart(2, '0')} · {p.tag}
              </p>
              <h3 className="mt-2 font-display text-[26px] font-semibold leading-[1.1]" style={{ color: INK }}>
                {p.is}
              </h3>
              <p className="mt-2 max-w-prose text-[15px] leading-relaxed" style={{ color: MUTED }}>
                {p.line}
              </p>
              {p.img ? (
                <ClipImg
                  src={p.img}
                  alt={p.alt ?? ''}
                  className="mt-4 aspect-[16/10] w-full rounded-xl"
                />
              ) : (
                <div
                  className="mt-4 flex aspect-[16/10] w-full items-center justify-center rounded-xl"
                  style={{
                    background: `repeating-linear-gradient(135deg, ${HAY}55, ${HAY}55 10px, transparent 10px, transparent 20px)`,
                    border: `1px solid ${HAIRLINE}`,
                  }}
                >
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                    Engin mynd til af þessari vöru
                  </span>
                </div>
              )}
            </Reveal>
          </li>
        ))}
      </ul>
    )
  }

  /* ── Desktop: text rows + cursor-floating crossfade panel ── */
  return (
    <>
      <ul className="flex flex-col" onMouseLeave={() => setActive(null)}>
        {PRODUCERS.map((p, i) => (
          <li key={p.key} className="border-t first:border-t-0" style={{ borderColor: HAIRLINE }}>
            <div
              onMouseEnter={() => setActive(i)}
              onMouseMove={onMove}
              className="lj-prow group flex cursor-default items-baseline gap-5 py-7"
            >
              <span className="font-mono text-[12px] tabular-nums" style={{ color: MOSS_TEXT }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  className="lj-prow-title font-display text-[clamp(1.7rem,3.2vw,2.6rem)] font-semibold leading-[1.08]"
                  style={{ color: INK }}
                >
                  {p.is}
                </h3>
                <p
                  className="mt-1.5 max-w-xl text-[14.5px] leading-relaxed transition-opacity"
                  style={{ color: MUTED, opacity: active === i ? 1 : 0.72 }}
                >
                  {p.line}
                </p>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: MOSS_TEXT }}>
                {p.tag}
              </span>
              <ArrowUpRight
                className="lj-prow-arrow h-6 w-6 shrink-0 self-center"
                style={{ color: ACCENT }}
                aria-hidden
              />
            </div>
          </li>
        ))}
      </ul>

      {/* floating cursor panel (fixed to viewport, decorative). Omitted
          entirely for rows with no verified photo (e.g. seasonal
          vegetables) rather than showing an empty/broken panel. */}
      <div
        ref={panelRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[260px] w-[210px] md:block"
        style={{
          opacity: active !== null && PRODUCERS[active].img ? 1 : 0,
          transition: `opacity .3s ${EASE}`,
          willChange: 'transform',
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/30 ring-1 ring-white/20">
          {PRODUCERS.filter((p) => p.img).map((p) => {
            const i = PRODUCERS.indexOf(p)
            return (
              <img
                key={p.key}
                src={p.img}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: active === i ? 1 : 0, transition: `opacity .35s ${EASE}` }}
              />
            )
          })}
          <div
            className="absolute inset-x-0 bottom-0 p-3"
            style={{ background: 'linear-gradient(transparent, rgba(43,36,28,.72))' }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/85">
              {active !== null ? PRODUCERS[active].tag : ''}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  MOBILE STICKY CTA — phone + hours, persists across scroll                */
/* ══════════════════════════════════════════════════════════════════════ */
function MobileStickyBar() {
  const open = useOpenNow()
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex items-stretch gap-px md:hidden"
      style={{ borderTop: `1px solid ${HAIRLINE}`, background: GROUND }}
    >
      <button
        onClick={() => goTo('heimsokn')}
        className={`flex flex-1 flex-col items-center justify-center py-2.5 ${FOCUS}`}
      >
        <span className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: INK }}>
          <Clock className="h-3.5 w-3.5" aria-hidden style={{ color: open ? MOSS : ACCENT }} />
          {open ? 'Opið núna' : 'Lokað núna'}
        </span>
        <span className="font-mono text-[10px]" style={{ color: MUTED }}>
          {HOURS_SHORT}
        </span>
      </button>
      <a
        href={PHONE_HREF}
        className={`flex flex-1 items-center justify-center gap-2 py-3 text-[14px] font-semibold ${FOCUS_ON_FILL}`}
        style={{ background: ACCENT, color: '#FFF7F0' }}
      >
        <Phone className="h-4 w-4" aria-hidden />
        {PHONE}
      </a>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  HERO — full-bleed REAL storefront, mount-triggered choreography           */
/* ══════════════════════════════════════════════════════════════════════ */
function Hero() {
  const [mounted, setMounted] = useState(false)
  const reduced = useReducedMotion()
  const open = useOpenNow()
  useEffect(() => {
    const r = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(r)
  }, [])
  const on = mounted || !!reduced

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden" style={{ background: INK }}>
      {/* full-bleed bg — animates on MOUNT (ledger #7/#12), never whileInView */}
      <div className="absolute inset-0">
        <Img
          src={IMG.storefront}
          alt="Verslunin Ljómalind í Borgarnesi, grár verslunarkjarni með merkinu „Local Market, Wool, Handcraft, Food“ og prjónavöru í glugganum"
          fetchpriority="high"
          className="h-full w-full object-cover"
          style={
            reduced
              ? undefined
              : {
                  transform: on ? 'scale(1)' : 'scale(1.08)',
                  transition: `transform 1.6s ${EASE}`,
                }
          }
          fallbackClassName="bg-gradient-to-br from-[#8a7f63] to-[#3a352a]"
        />
        {/* warm bright-overcast grade, not dark/moody */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(43,36,28,.34) 0%, rgba(43,36,28,.12) 34%, rgba(43,36,28,.28) 62%, rgba(43,36,28,.7) 100%)',
          }}
        />
      </div>

      {/* top hours/phone strip — hours + location unmissable in the hero */}
      <div
        className="absolute inset-x-0 top-0 z-10 flex justify-end px-5 pt-16 md:px-8 md:pt-20"
        style={{ opacity: on ? 1 : 0, transition: `opacity .8s ${EASE} .3s` }}
      >
        <div
          className="flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[11px] backdrop-blur-md"
          style={{ background: 'rgba(43,36,28,.4)', color: CREAM_ON_DARK, border: '1px solid rgba(246,241,231,.2)' }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: open ? '#8FBF6B' : ACCENT }}
            aria-hidden
          />
          {open ? 'OPIÐ NÚNA' : 'LOKAÐ NÚNA'} · {HOURS_SHORT.toUpperCase()}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-16 md:px-8 md:pb-24">
        <Reveal delay={0} y={0}>
          <span className="font-mono text-[12px] uppercase tracking-[0.28em]" style={{ color: '#F0C9AE' }}>
            Sveitamarkaður · Borgarnes · Vesturland
          </span>
        </Reveal>

        <h1 className="mt-4 font-display text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[1.02] text-[#F6F1E7]">
          <VerticalCutReveal text="Beint frá" baseDelay={0.15} stagger={0.06} />
          <br />
          <VerticalCutReveal
            text="héraðinu"
            baseDelay={0.32}
            stagger={0.06}
            wordClassName="italic"
          />
        </h1>

        <Reveal delay={620} y={16}>
          <p className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.28rem)] leading-relaxed" style={{ color: CREAM_ON_DARK }}>
            Sveitamarkaður í Borgarnesi. Matur beint af býli og handverk frá heimafólki á
            Vesturlandi, opið alla daga.
          </p>
        </Reveal>

        <Reveal delay={760} y={16}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => goTo('heimsokn')}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-transform hover:-translate-y-0.5 ${FOCUS_ON_FILL}`}
              style={{ background: ACCENT, color: '#FFF7F0' }}
            >
              <Clock className="h-4 w-4" aria-hidden />
              Opnunartími og leiðin
            </button>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold backdrop-blur-md transition-transform hover:-translate-y-0.5 ${FOCUS}`}
              style={{
                background: 'rgba(246,241,231,.12)',
                color: '#F6F1E7',
                border: '1px solid rgba(246,241,231,.3)',
              }}
            >
              <MapPin className="h-4 w-4" aria-hidden />
              {ADDRESS}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SECTION 2 — what/who in 5 seconds                                         */
/* ══════════════════════════════════════════════════════════════════════ */
function Categories() {
  return (
    <section id="vorur" className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal as="span" className="block font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: MOSS_TEXT }}>
            Hvað er á boðstólum
          </Reveal>
          <Reveal>
            <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-[1.1]" style={{ color: INK }}>
              Allt undir einu þaki, frá fólkinu sem gerir það
            </h2>
          </Reveal>
        </div>
        <Reveal delay={80}>
          <p className="max-w-xs text-[14.5px] leading-relaxed" style={{ color: MUTED }}>
            Um 70 framleiðendur af Vesturlandi selja vörur sínar í Ljómalind (skv. umfjöllun DV, 2018).
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.is} delay={i * 80} as="figure" className="group relative overflow-hidden rounded-2xl">
            <ClipImg
              src={c.img}
              alt=""
              delay={i * 60}
              className="aspect-[3/4] w-full"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(43,36,28,.78) 100%)' }}
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-4">
              <span
                className="inline-block h-1 w-8 rounded-full"
                style={{ background: c.tone }}
                aria-hidden
              />
              <p className="mt-2 font-display text-[19px] font-semibold leading-tight text-[#F6F1E7]">{c.is}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug" style={{ color: CREAM_DIM }}>
                {c.sub}
              </p>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SECTION 3 — the shelf (signature REAL interior photo)                     */
/* ══════════════════════════════════════════════════════════════════════ */
function Shelf() {
  const { ref, shown } = useInViewOnce(0.1)
  const reduced = useReducedMotion()
  const on = shown || !!reduced
  return (
    <section className="relative">
      <div ref={ref} className="relative h-[72svh] min-h-[440px] w-full overflow-hidden md:h-[86svh]">
        <Img
          src={IMG.interior}
          alt="Innan úr Ljómalind, veggur af handlituðu bandi á hillum, rekki af Alrún ullarkápum með verðmiða, og gjafavörur á hillum fyrir aftan"
          className="h-full w-full object-cover"
          style={
            reduced
              ? undefined
              : {
                  transform: on ? 'scale(1)' : 'scale(1.1)',
                  transition: `transform 1.6s ${EASE}`,
                }
          }
          fallbackClassName="bg-gradient-to-br from-[#c7b489] to-[#6f6547]"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(43,36,28,.72) 0%, rgba(43,36,28,.15) 45%, transparent 70%)' }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
            <Reveal className="max-w-xl">
              <span className="font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: '#F0C9AE' }}>
                Verslunargólfið
              </span>
              <h2 className="mt-4 font-display text-[clamp(1.6rem,3.6vw,2.7rem)] font-semibold leading-[1.14] text-[#F6F1E7]">
                Hver hilla er lítið kort til baka á býlið eða verkstæðið sem gerði vöruna.
              </h2>
              <p className="mt-4 text-[13px] leading-relaxed" style={{ color: CREAM_DIM }}>
                Raunveruleg mynd af markaðsgólfinu í Ljómalind, ekki sviðsett. Ullarkápurnar frá Alrún
                eru verðmerktar af framleiðandanum sjálfum.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SECTION 4 — Framleiðendur (signature scroll rail + hover showcase)        */
/* ══════════════════════════════════════════════════════════════════════ */
function Framleidendur() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  })
  return (
    <section id="framleidendur" className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
      <div className="max-w-2xl">
        <Reveal as="span" className="block font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: MOSS_TEXT }}>
          Framleiðendur
        </Reveal>
        <Reveal>
          <h2 className="mt-3 font-display text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-[1.1]" style={{ color: INK }}>
            Þráðurinn frá hillu að héraði
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: MUTED }}>
            Flokkarnir hér að neðan eru þeir sem seldir eru í markaðnum (skv. umfjöllun DV, 2018).
            Rennið niður og fylgið þræðinum sem tengir hverja hillu við fólkið á bak við hana.
          </p>
        </Reveal>
      </div>

      <div ref={sectionRef} className="relative mt-12 pl-9 md:pl-12">
        <ThreadRail progress={scrollYProgress} />
        <ProducerShowcase />
        <Reveal>
          <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.16em]" style={{ color: ACCENT_TEXT }}>
            Og um 70 framleiðendur til viðbótar af Vesturlandi
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SECTION 5 — Sagan (dated 17 May 2013)                                     */
/* ══════════════════════════════════════════════════════════════════════ */
function Story() {
  return (
    <section id="saga" className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
        <div className="order-2 md:order-1">
          <Reveal as="span" className="block font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: MOSS_TEXT }}>
            Sagan
          </Reveal>
          <Reveal>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-[1.1]" style={{ color: INK }}>
              Opnaði 17. maí 2013
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-5 text-[15.5px] leading-relaxed" style={{ color: MUTED }}>
              Ljómalind opnaði dyrnar í Borgarnesi 17. maí 2013 og hefur verið opin alla daga síðan.
              Frá fyrsta degi hefur markaðurinn selt vörur frá framleiðendum í héraðinu, einkum úr
              Borgarnesi og nágrenni, en líka úr Dölum, af Akranesi og af Snæfellsnesi.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-4 text-[15.5px] leading-relaxed" style={{ color: MUTED }}>
              Um 70 framleiðendur seldu vörur sínar í gegnum markaðinn þegar DV fjallaði um hann árið
              2018. Þá var einnig starfrækt Matarlind, sameiginlegt eldhús í samstarfi við SSV, þar sem
              matarfrumkvöðlar gátu þróað vörur áður en þær rötuðu á hillurnar (skv. umfjöllun DV, 2018).
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { n: '2013', l: 'Opnaði 17. maí' },
                { n: '~70', l: 'framleiðendur (2018)' },
                { n: 'Alla daga', l: '10:00–18:00, árið um kring' },
              ].map((s) => (
                <div
                  key={s.n}
                  className="rounded-xl px-4 py-3"
                  style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}
                >
                  <p className="font-display text-[22px] font-semibold leading-none" style={{ color: ACCENT }}>
                    {s.n}
                  </p>
                  <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: MUTED }}>
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="order-1 md:order-2">
          <ClipImg
            src={IMG.turf}
            alt="Svarttjörguð, torfþakin íslensk hús, dæmigerð fyrir hefðbundna íslenska byggingararfleifð"
            className="aspect-[4/5] w-full rounded-2xl md:aspect-[4/4.6]"
          />
          <p className="mt-3 text-[12px] leading-relaxed" style={{ color: MUTED }}>
            Torfbæirnir eru andrúmsloftsmynd af íslenskri byggingararfleifð, ekki mynd af Ljómalind sjálfri.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SECTION 6 — Co-op / who runs it (turf-house heritage divider)             */
/* ══════════════════════════════════════════════════════════════════════ */
function CoOp() {
  const { ref, shown } = useInViewOnce(0.12)
  const reduced = useReducedMotion()
  const on = shown || !!reduced
  return (
    <section className="relative overflow-hidden" style={{ background: PINE }}>
      <div ref={ref} className="absolute inset-0 opacity-30">
        <Img
          src={IMG.turf}
          alt=""
          className="h-full w-full object-cover"
          style={
            reduced
              ? undefined
              : { transform: on ? 'scale(1)' : 'scale(1.12)', transition: `transform 1.6s ${EASE}` }
          }
          fallbackClassName="bg-[#2f3a2f]"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(58,74,58,.55), rgba(58,74,58,.85))' }} />
      </div>

      <div className="relative mx-auto max-w-[860px] px-5 py-24 text-center md:px-8 md:py-32">
        <Reveal as="span" className="block font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: '#C9D3B4' }}>
          Hverjir reka markaðinn
        </Reveal>
        <Reveal>
          <h2 className="mt-6 font-display text-[clamp(1.6rem,4vw,2.6rem)] font-semibold leading-[1.2] text-[#F6F1E7]">
            Ljómalind er samvinnufélag, rekið dags daglega af heimakonum úr héraðinu sem skiptast á
            að standa vaktina.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed" style={{ color: CREAM_DIM }}>
            Gestir lýsa markaðnum aftur og aftur á sama veg: lítil samvinnuverslun þar sem vörurnar eru
            gerðar af fólkinu sem stendur vaktina, og hagnaðurinn verður eftir í heimabyggð.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: '#A9B792' }}>
            Torfbæir að ofan eru andrúmsloftsmynd af íslenskri byggingararfleifð, ekki mynd af markaðnum
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SECTION 7 — Reviews (sourced, no star number)                            */
/* ══════════════════════════════════════════════════════════════════════ */
function Reviews() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
      <Reveal as="span" className="block font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: MOSS_TEXT }}>
        Umsagnir gesta
      </Reveal>
      <Reveal>
        <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-[1.1]" style={{ color: INK }}>
          Það sem gestir segja
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <Reveal key={r.href} delay={i * 90} as="figure">
            <blockquote
              className="flex h-full flex-col rounded-2xl p-6"
              style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}
            >
              <SeedMark size={20} color={ACCENT} />
              <p className="mt-4 flex-1 text-[16px] leading-relaxed" style={{ color: INK }} lang={r.lang}>
                {r.quote}
              </p>
              <figcaption className="mt-6 border-t pt-4" style={{ borderColor: HAIRLINE }}>
                <p className="font-display text-[15px] font-semibold" style={{ color: INK }}>
                  {r.title}
                </p>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-1 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] ${FOCUS}`}
                  style={{ color: MUTED }}
                >
                  {r.source}
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                </a>
              </figcaption>
            </blockquote>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="mt-6 text-[12px]" style={{ color: MUTED }}>
          Setningarnar frá TripAdvisor eru upprunalegur enskur texti gesta, en tvær eru settar saman
          úr sömu umsögn. Meðmælin af getlocal.is eru endursögð á íslensku, ekki bein tilvitnun. Tengt
          er á upprunann í öllum tilvikum.
        </p>
      </Reveal>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SECTION 8 — Practical info (huge) + eager map                            */
/* ══════════════════════════════════════════════════════════════════════ */
function Visit() {
  const open = useOpenNow()
  return (
    <section id="heimsokn" className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <Reveal as="span" className="block font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: MOSS_TEXT }}>
            Heimsókn
          </Reveal>
          <Reveal>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.06]" style={{ color: INK }}>
              Kíktu við í Borgarnesi
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div
              className="mt-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2"
              style={{ background: open ? 'rgba(110,122,79,.14)' : 'rgba(196,71,42,.12)' }}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: open ? MOSS : ACCENT }}
                aria-hidden
              />
              <span className="text-[13.5px] font-semibold" style={{ color: open ? MOSS_TEXT : ACCENT_TEXT }}>
                {open ? 'Opið núna' : 'Lokað í augnablikinu'}
              </span>
            </div>
          </Reveal>

          <dl className="mt-8 flex flex-col divide-y" style={{ borderColor: HAIRLINE }}>
            {[
              { icon: Clock, k: 'Opnunartími', v: HOURS, sub: 'Árið um kring' },
              { icon: MapPin, k: 'Heimilisfang', v: ADDRESS, sub: '~75 km / um klukkustund frá Reykjavík' },
              { icon: Phone, k: 'Sími', v: PHONE, href: PHONE_HREF },
            ].map((row) => {
              const RowIcon = row.icon
              return (
                <Reveal key={row.k} as="div" className="flex items-start gap-4 py-5" style={{ borderColor: HAIRLINE }}>
                  <RowIcon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ACCENT }} aria-hidden />
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                      {row.k}
                    </dt>
                    {row.href ? (
                      <a
                        href={row.href}
                        className={`mt-1 block font-display text-[22px] font-semibold ${FOCUS}`}
                        style={{ color: INK }}
                      >
                        {row.v}
                      </a>
                    ) : (
                      <dd className="mt-1 font-display text-[22px] font-semibold" style={{ color: INK }}>
                        {row.v}
                      </dd>
                    )}
                    {row.sub && (
                      <p className="mt-0.5 text-[13px]" style={{ color: MUTED }}>
                        {row.sub}
                      </p>
                    )}
                  </div>
                </Reveal>
              )
            })}
            <Reveal as="div" className="flex items-start gap-4 py-5" style={{ borderColor: HAIRLINE }}>
              <ArrowUpRight className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ACCENT }} aria-hidden />
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                  Fyrirspurnir
                </dt>
                <a
                  href={`mailto:${EMAIL}`}
                  className={`mt-1 block font-display text-[22px] font-semibold ${FOCUS}`}
                  style={{ color: INK }}
                >
                  {EMAIL}
                </a>
                <p className="mt-0.5 text-[13px]" style={{ color: MUTED }}>
                  Heildsölu- og samstarfsfyrirspurnir
                </p>
              </div>
            </Reveal>
          </dl>
        </div>

        <Reveal delay={120} className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${HAIRLINE}`, minHeight: 380 }}>
          <iframe
            title="Kort af Ljómalind, Brúartorg 4, Borgarnes"
            src={MAPS_EMBED}
            loading="eager"
            className="h-full min-h-[380px] w-full"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SECTION 9 — Getting there / West Iceland context                         */
/* ══════════════════════════════════════════════════════════════════════ */
function GettingThere() {
  const { ref, shown } = useInViewOnce(0.12)
  const reduced = useReducedMotion()
  const on = shown || !!reduced
  return (
    <section className="relative overflow-hidden">
      <div ref={ref} className="relative h-[60svh] min-h-[380px] w-full">
        <Img
          src={IMG.hills}
          alt="Grænar hæðir og bóndabær í móðukenndu dalverpi á Vesturlandi"
          className="h-full w-full object-cover"
          style={
            reduced
              ? undefined
              : { transform: on ? 'scale(1)' : 'scale(1.1)', transition: `transform 1.6s ${EASE}` }
          }
          fallbackClassName="bg-gradient-to-br from-[#9aa77e] to-[#3a4a3a]"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(43,36,28,.66), rgba(43,36,28,.12) 60%, transparent)' }} />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
            <Reveal className="max-w-lg">
              <span className="font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: '#F0C9AE' }}>
                Vesturland
              </span>
              <h2 className="mt-4 font-display text-[clamp(1.5rem,3.4vw,2.5rem)] font-semibold leading-[1.16] text-[#F6F1E7]">
                Um klukkustund frá Reykjavík, í hjarta Borgarness.
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed" style={{ color: CREAM_DIM }}>
                Ljómalind stendur við Brúartorg 4, um 75 km frá Reykjavík (skv. west.is). Kjörinn
                áfangastaður á leiðinni vestur, opinn alla daga.
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-transform hover:-translate-y-0.5 ${FOCUS_ON_FILL}`}
                style={{ background: ACCENT, color: '#FFF7F0' }}
              >
                <MapPin className="h-4 w-4" aria-hidden />
                Opna leiðina í kortum
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SECTION 10 — Final CTA band                                               */
/* ══════════════════════════════════════════════════════════════════════ */
function FinalCTA() {
  const open = useOpenNow()
  return (
    <section className="mx-auto max-w-[1200px] px-5 pb-24 pt-20 md:px-8 md:pb-28 md:pt-28">
      <Reveal
        className="relative overflow-hidden rounded-3xl px-6 py-14 text-center md:px-12 md:py-20"
        style={{ background: INK }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <SeedMark size={340} color="#F6F1E7" />
        </div>
        <div className="relative">
          <SeedMark size={28} color="#F0C9AE" />
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-[clamp(1.8rem,4.5vw,3rem)] font-semibold leading-[1.12] text-[#F6F1E7]">
            Sjáumst á markaðnum í Borgarnesi
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: CREAM_DIM }}>
            {open ? 'Opið núna' : 'Opið alla daga'} · {HOURS} · {ADDRESS}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={PHONE_HREF}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-transform hover:-translate-y-0.5 ${FOCUS_ON_FILL}`}
              style={{ background: ACCENT, color: '#FFF7F0' }}
            >
              <Phone className="h-4 w-4" aria-hidden />
              {PHONE}
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-transform hover:-translate-y-0.5 ${FOCUS}`}
              style={{ background: 'rgba(246,241,231,.12)', color: '#F6F1E7', border: '1px solid rgba(246,241,231,.3)' }}
            >
              <MapPin className="h-4 w-4" aria-hidden />
              Leiðin til okkar
            </a>
          </div>
          <p className="mx-auto mt-8 max-w-lg text-[12px] leading-relaxed" style={{ color: 'rgba(246,241,231,.5)' }}>
            Vöruflokkar byggja á umfjöllun DV frá 2018 og skráningum vestlenskra ferðavefja. Verð eru
            ekki birt hér; hver framleiðandi verðmerkir sínar vörur á staðnum.
          </p>
        </div>
      </Reveal>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                      */
/* ══════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    document.title = 'Ljómalind · Sveitamarkaður í Borgarnesi'
    setThemeColor(GROUND)
    return () => setThemeColor('#0a1320')
  }, [])

  // Internal prototype preview route — keep it out of search indexes
  // (preview-link-isolation standing rule).
  useEffect(() => setNoindex(true), [])

  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({
      duration: 1.15,
      easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <div lang="is" className="font-sans overflow-x-clip" style={{ background: GROUND, color: INK }}>
      <style>{`
        #lj-root ::selection { background:${ACCENT}; color:#FFF7F0; }
        .lj-navlink { position:relative; }
        .lj-navlink::after {
          content:''; position:absolute; left:0; right:100%; bottom:-5px; height:2px;
          background:${ACCENT}; transition:right .3s ${EASE};
        }
        .lj-navlink:hover::after { right:0; }
        .lj-prow-title { background-image:linear-gradient(${ACCENT},${ACCENT});
          background-repeat:no-repeat; background-position:0 100%; background-size:0% 2px;
          transition:background-size .4s ${EASE}, color .3s ${EASE}; padding-bottom:2px; }
        .lj-prow:hover .lj-prow-title { background-size:100% 2px; color:${ACCENT}; }
        .lj-prow-arrow { opacity:0; transform:translate(-6px,6px); transition:opacity .3s ${EASE}, transform .3s ${EASE}; }
        .lj-prow:hover .lj-prow-arrow { opacity:1; transform:translate(0,0); }
        @media (prefers-reduced-motion: reduce) {
          .lj-prow-title { background-size:0% 2px !important; }
          .lj-prow-arrow { opacity:1; transform:none; }
        }
      `}</style>

      <div id="lj-root">
        <PreviewChrome company={company} />
        <TopNav lenisRef={lenisRef} />
        <main>
          <Hero />
          <Categories />
          <Shelf />
          <Framleidendur />
          <Story />
          <CoOp />
          <Reviews />
          <Visit />
          <GettingThere />
          <FinalCTA />
        </main>
        <MobileStickyBar />
        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
