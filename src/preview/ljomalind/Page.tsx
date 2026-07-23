import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Clock, MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { VerticalCutReveal } from '../../components/ui/vertical-cut-reveal'
import { setNoindex, setThemeColor } from '../../lib/preview'
import type { Category } from './data'
import {
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
  HONEY,
  HOURS,
  HOURS_SHORT,
  IMG,
  INDIGO,
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
  PRODUCERS,
  REVIEWS,
  RUST,
  RUST_TEXT,
} from './data'

const company = getPreviewCompany('ljomalind')

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const goTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B23A1E]'

/* Accent-filled CTAs need a ring that stays visible whether the surrounding
 * ground is light or dark (accent-on-accent is invisible) — a double ring
 * (cream inner, ink outer) reads against either. */
const FOCUS_ON_FILL =
  'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_#ECE6D2,0_0_0_4px_#2A2A1D]'

type FilterKey = Category['key'] | 'allt'

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
          fallbackClassName={fallbackClassName ?? 'bg-gradient-to-br from-[#cabb8a] to-[#7c7358]'}
        />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  HeroCut renders the REAL 21st.dev Vertical Cut Reveal (@danielpetho,      */
/*  id 884), vendored at src/components/ui. Reduced motion => static text;    */
/*  py-[0.2em] on its own clip wrapper clears á/é/ð safely.                   */
/* ══════════════════════════════════════════════════════════════════════ */
function HeroCut({
  text,
  delay = 0,
  italic = false,
}: {
  text: string
  delay?: number
  italic?: boolean
}) {
  const reduced = useReducedMotion()
  if (reduced) return <span className={italic ? 'italic' : undefined}>{text}</span>
  return (
    <VerticalCutReveal
      splitBy="words"
      staggerDuration={0.06}
      staggerFrom="first"
      transition={{ duration: 0.8, ease: [0.22, 0.61, 0.21, 1], delay }}
      containerClassName={italic ? 'italic' : ''}
      wordLevelClassName="py-[0.2em]"
    >
      {text}
    </VerticalCutReveal>
  )
}

/* Small decorative seed-head mark (aria-hidden, not a reproduction of the
 * real logo — a warm brand flourish only). */
function SeedMark({ size = 22, color = RUST }: { size?: number; color?: string }) {
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

/* Four tiny dye-lot dots, standing in for "Allt" — the co-op's whole colour
 * range in one mark. */
function AllDotsMark({ active }: { active: boolean }) {
  const dot = (c: string) => (
    <span
      aria-hidden
      className="h-[5px] w-[5px] rounded-full"
      style={{ background: active ? '#FFF7F0' : c }}
    />
  )
  return (
    <span aria-hidden className="grid grid-cols-2 gap-[3px]">
      {dot(RUST)}
      {dot(MOSS)}
      {dot(HONEY)}
      {dot(INDIGO)}
    </span>
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
          background: solid ? 'rgba(236,230,210,.9)' : 'transparent',
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
            <SeedMark size={22} color={solid ? RUST : '#ECE6D2'} />
            <span
              className="font-display text-[19px] font-semibold leading-none"
              style={{ color: solid ? INK : '#ECE6D2' }}
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
              style={{ background: RUST, color: '#FFF7F0' }}
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
                  background: solid ? INK : '#ECE6D2',
                  transform: open ? 'rotate(45deg)' : 'translateY(-4px)',
                  transitionTimingFunction: 'cubic-bezier(.22,.61,.21,1)',
                }}
              />
              <span
                aria-hidden
                className="absolute h-[2px] w-[20px] transition-transform duration-300"
                style={{
                  background: solid ? INK : '#ECE6D2',
                  transform: open ? 'rotate(-45deg)' : 'translateY(4px)',
                  transitionTimingFunction: 'cubic-bezier(.22,.61,.21,1)',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu: full-screen ground-colour overlay, rendered as a SIBLING
          of the header (never inside it — the header's backdrop-filter would
          become the containing block for a fixed descendant and collapse its
          height). Links rise out of masks, staggered. */}
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
/*  SIGNATURE — "Hillan": a real filterable producer index.                  */
/*  Category chips (built from CATEGORIES + "Allt") filter the PRODUCERS      */
/*  grid; surviving cards animate to their new grid position via Framer's     */
/*  `layout` prop — a genuine FLIP re-sort, not a scroll-drawn line, and a     */
/*  new motion vocabulary vs. Reveal/ClipImg/VerticalCutReveal. No             */
/*  AnimatePresence here: its exit-clone bookkeeping proved to get stuck and   */
/*  never unmount in this app (the same class of unreliable framer-motion      */
/*  animation this codebase's craft ledger already documents for mount        */
/*  reveals) — plain keyed React reconciliation removes filtered-out cards     */
/*  immediately instead, which `layout` alone animates around just fine.       */
/*  Reduced motion: filtering still works, but the re-sort snaps (no layout    */
/*  spring) and every rendered card is opaque at full visibility from the      */
/*  first frame.                                                             */
/* ══════════════════════════════════════════════════════════════════════ */
/* CSS-transition-driven fade for a freshly-mounted card (craft ledger:
 * framer-motion mount/state reveals — initial/animate opacity props — fire
 * unreliably in this app and can get stuck at opacity 0; every reveal this
 * codebase ships (Reveal/ClipImg) drives opacity via a post-mount setState +
 * inline CSS transition instead, which is what this does). The FLIP
 * repositioning itself stays on framer's `layout` prop on the parent
 * motion.button — that is a measurement-driven projection, not a mount
 * reveal, and is unaffected by this issue. */
function CardFade({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    setShown(true)
  }, [])
  const on = shown || !!reduced
  return (
    <div
      style={
        reduced
          ? undefined
          : {
              opacity: on ? 1 : 0,
              transform: on ? 'none' : 'translateY(10px) scale(0.97)',
              transition: `opacity .4s ${EASE}, transform .4s ${EASE}`,
            }
      }
    >
      {children}
    </div>
  )
}

/* Inner content only — kept separate from the outer button/motion.button so
 * that element can be inlined directly where it's rendered (a custom
 * function-component wrapper around motion.button cannot forward a ref,
 * which framer-motion's `layout` measurement needs on its exact host node —
 * wrapping it one level down threw "Function components cannot be given
 * refs" when this card was still rendered inside AnimatePresence). */
function ProducerCardContent({ p, cat }: { p: (typeof PRODUCERS)[number]; cat: Category }) {
  return (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        {p.img ? (
          <img
            src={p.img}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-4 text-center"
            style={{
              background: `repeating-linear-gradient(135deg, ${cat.tone}26 0, ${cat.tone}26 9px, transparent 9px, transparent 18px), ${CARD}`,
              border: `1px solid ${cat.tone}55`,
            }}
          >
            <span className="font-display text-[16px] font-semibold leading-tight" style={{ color: cat.toneText }}>
              {p.is}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
              Engin mynd til af þessari vöru
            </span>
          </div>
        )}
        <span
          className="absolute left-2.5 top-2.5 inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
          style={{ background: 'rgba(42,42,29,.62)', color: '#FFF7F0', backdropFilter: 'blur(3px)' }}
        >
          {p.tag}
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display text-[16.5px] font-semibold leading-tight" style={{ color: INK }}>
            {p.is}
          </h3>
          <p className="mt-1 text-[13px] leading-snug" style={{ color: MUTED }}>
            {p.line}
          </p>
        </div>
        <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: cat.tone }} />
      </div>
    </>
  )
}

function ProducerIndex() {
  const reduced = useReducedMotion()
  const [filter, setFilter] = useState<FilterKey>('allt')

  const chips: { key: FilterKey; label: string; tone: string; toneText: string }[] = [
    { key: 'allt', label: 'Allt', tone: INK, toneText: INK },
    ...CATEGORIES.map((c) => ({ key: c.key, label: c.is, tone: c.tone, toneText: c.toneText })),
  ]

  const filtered = filter === 'allt' ? PRODUCERS : PRODUCERS.filter((p) => p.catKey === filter)
  const activeChip = chips.find((c) => c.key === filter)

  const catByKey = (key: Category['key']) => CATEGORIES.find((c) => c.key === key) as Category

  return (
    <section id="hillan" className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
      <div className="max-w-2xl">
        <Reveal as="span" className="block font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: MOSS_TEXT }}>
          Hillan
        </Reveal>
        <Reveal>
          <h2 className="mt-3 font-display text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-[1.1]" style={{ color: INK }}>
            Sían sem vantaði á markaðinn
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: MUTED }}>
            Um 70 framleiðendur af Vesturlandi eiga vörur á hillunum í Ljómalind (skv. umfjöllun DV,
            2018). Veldu flokk til að sjá hvað er í honum.
          </p>
        </Reveal>
      </div>

      <div
        role="group"
        aria-label="Sía eftir vöruflokki"
        className="mt-10 flex flex-wrap gap-2.5"
      >
        {chips.map((chip) => {
          const active = filter === chip.key
          return (
            <button
              key={chip.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(chip.key)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors duration-200 ${FOCUS}`}
              style={
                active
                  ? { background: chip.tone, color: '#FFF7F0', border: '1px solid transparent' }
                  : { background: CARD, color: chip.toneText, border: `1.5px solid ${chip.tone}55` }
              }
            >
              {chip.key === 'allt' ? (
                <AllDotsMark active={active} />
              ) : (
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: active ? '#FFF7F0' : chip.tone }} />
              )}
              {chip.label}
            </button>
          )
        })}
      </div>

      <p aria-live="polite" className="mt-5 font-mono text-[11.5px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
        {filtered.length} {filtered.length === 1 ? 'vara' : 'vörur'} á hillunum
        {activeChip && filter !== 'allt' ? ` í flokknum ${activeChip.label}` : ''}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reduced ? (
          filtered.map((p) => {
            const cat = catByKey(p.catKey)
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setFilter(p.catKey)}
                aria-label={`${p.is}. Sía eftir ${cat.is}`}
                className={`group block w-full text-left rounded-2xl p-3 ${FOCUS}`}
                style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}
              >
                <ProducerCardContent p={p} cat={cat} />
              </button>
            )
          })
        ) : (
          // Plain keyed map, no AnimatePresence: this codebase's framer-motion
          // exit/enter animations have proven unreliable (craft ledger —
          // reveals get stuck), including AnimatePresence exit clones that
          // never finish and never unmount. `layout` alone (no AnimatePresence
          // wrapper needed for it) still gives every surviving card a genuine
          // FLIP reposition when the filtered set changes; removed cards are
          // dropped immediately via ordinary React reconciliation instead of
          // an exit animation, and CardFade covers the entrance.
          filtered.map((p) => {
            const cat = catByKey(p.catKey)
            return (
              <motion.button
                key={p.key}
                layout
                type="button"
                onClick={() => setFilter(p.catKey)}
                aria-label={`${p.is}. Sía eftir ${cat.is}`}
                className={`group block w-full text-left rounded-2xl p-3 ${FOCUS}`}
                style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}
                transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }}
              >
                <CardFade>
                  <ProducerCardContent p={p} cat={cat} />
                </CardFade>
              </motion.button>
            )
          })
        )}
      </div>
    </section>
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
          <Clock className="h-3.5 w-3.5" aria-hidden style={{ color: open ? MOSS : RUST }} />
          {open ? 'Opið núna' : 'Lokað núna'}
        </span>
        <span className="font-mono text-[10px]" style={{ color: MUTED }}>
          {HOURS_SHORT}
        </span>
      </button>
      <a
        href={PHONE_HREF}
        className={`flex flex-1 items-center justify-center gap-2 py-3 text-[14px] font-semibold ${FOCUS_ON_FILL}`}
        style={{ background: RUST, color: '#FFF7F0' }}
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
          fallbackClassName="bg-gradient-to-br from-[#7c7358] to-[#2a2a1d]"
        />
        {/* warm bright-overcast grade, not dark/moody */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(42,42,29,.34) 0%, rgba(42,42,29,.12) 34%, rgba(42,42,29,.28) 62%, rgba(42,42,29,.7) 100%)',
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
          style={{ background: 'rgba(42,42,29,.4)', color: CREAM_ON_DARK, border: '1px solid rgba(236,230,210,.2)' }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: open ? '#8FBF6B' : RUST }}
            aria-hidden
          />
          {open ? 'OPIÐ NÚNA' : 'LOKAÐ NÚNA'} · {HOURS_SHORT.toUpperCase()}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-16 md:px-8 md:pb-24">
        <Reveal delay={0} y={0}>
          <span className="font-mono text-[12px] uppercase tracking-[0.28em]" style={{ color: CREAM_ON_DARK }}>
            Sveitamarkaður · Borgarnes · Vesturland
          </span>
        </Reveal>

        <h1
          aria-label="Beint frá héraðinu"
          className="mt-4 font-display text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[1.02] text-[#ECE6D2]"
        >
          {/* Decorative per-word/per-character reveal — VerticalCutReveal
              renders its own internal sr-only + aria-hidden split per call,
              so two adjacent calls with no DOM whitespace between them
              produce a duplicated, unspaced accessible/crawlable text
              ("Beint fráBeint fráhéraðinuhéraðinu"). Hiding the whole
              decorative block from the accessibility tree and supplying the
              h1's aria-label + one clean sr-only copy below fixes the
              accessible name and crawlable text without touching the
              animation itself. */}
          <span aria-hidden="true">
            <HeroCut text="Beint frá" delay={0.15} />
            <HeroCut text="héraðinu" delay={0.32} italic />
          </span>
          <span className="sr-only">Beint frá héraðinu</span>
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
              style={{ background: RUST, color: '#FFF7F0' }}
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
                background: 'rgba(236,230,210,.12)',
                color: '#ECE6D2',
                border: '1px solid rgba(236,230,210,.3)',
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
/*  SECTION 2 — what/who in 5 seconds                                        */
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
            <ClipImg src={c.img} alt="" delay={i * 60} className="aspect-[3/4] w-full" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(42,42,29,.78) 100%)' }}
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-4">
              <span className="inline-block h-1 w-8 rounded-full" style={{ background: c.tone }} aria-hidden />
              <p className="mt-2 font-display text-[19px] font-semibold leading-tight text-[#ECE6D2]">{c.is}</p>
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
/*  SECTION — the shelf (signature REAL interior photo)                      */
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
              : { transform: on ? 'scale(1)' : 'scale(1.1)', transition: `transform 1.6s ${EASE}` }
          }
          fallbackClassName="bg-gradient-to-br from-[#c7b990] to-[#726a4d]"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(42,42,29,.72) 0%, rgba(42,42,29,.15) 45%, transparent 70%)' }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
            <Reveal className="max-w-xl">
              <span className="font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: CREAM_ON_DARK }}>
                Verslunargólfið
              </span>
              <h2 className="mt-4 font-display text-[clamp(1.6rem,3.6vw,2.7rem)] font-semibold leading-[1.14] text-[#ECE6D2]">
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
/*  SECTION — Sagan: opened 2013 + who runs it, merged into one section      */
/* ══════════════════════════════════════════════════════════════════════ */
function Story() {
  const { ref, shown } = useInViewOnce(0.12)
  const reduced = useReducedMotion()
  const on = shown || !!reduced
  return (
    <section id="saga" className="relative overflow-hidden" style={{ background: INK }}>
      <div ref={ref} className="absolute inset-0 opacity-25">
        <Img
          src={IMG.turf}
          alt=""
          className="h-full w-full object-cover"
          style={
            reduced
              ? undefined
              : { transform: on ? 'scale(1)' : 'scale(1.12)', transition: `transform 1.6s ${EASE}` }
          }
          fallbackClassName="bg-[#1c1c13]"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(42,42,29,.5), rgba(42,42,29,.93))' }} />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-32">
        <Reveal as="span" className="block font-mono text-[12px] uppercase tracking-[0.24em]" style={{ color: CREAM_DIM }}>
          Sagan
        </Reveal>
        <Reveal>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.9rem,4.5vw,3.1rem)] font-semibold leading-[1.12] text-[#ECE6D2]">
            Opnaði 17. maí 2013 og er enn rekið af heimafólki
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start md:gap-14">
          <div>
            <Reveal delay={80}>
              <p className="text-[15.5px] leading-relaxed" style={{ color: CREAM_ON_DARK }}>
                Ljómalind opnaði dyrnar í Borgarnesi 17. maí 2013 og hefur verið opin alla daga síðan.
                Frá fyrsta degi hefur markaðurinn selt vörur frá framleiðendum í héraðinu, einkum úr
                Borgarnesi og nágrenni, en líka úr Dölum, af Akranesi og af Snæfellsnesi.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 text-[15.5px] leading-relaxed" style={{ color: CREAM_DIM }}>
                Um 70 framleiðendur seldu vörur sínar í gegnum markaðinn þegar DV fjallaði um hann árið
                2018. Þá var einnig starfrækt Matarlind, sameiginlegt eldhús í samstarfi við SSV, þar sem
                matarfrumkvöðlar gátu þróað vörur áður en þær rötuðu á hillurnar (skv. umfjöllun DV, 2018).
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { n: '2013', l: 'Opnaði 17. maí', c: RUST },
                  { n: '~70', l: 'framleiðendur (2018)', c: MOSS },
                  { n: 'Alla daga', l: '10:00–18:00, árið um kring', c: INDIGO },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="rounded-xl px-4 py-3"
                    style={{ background: 'rgba(236,230,210,.08)', border: '1px solid rgba(236,230,210,.16)' }}
                  >
                    <p className="font-display text-[22px] font-semibold leading-none" style={{ color: s.c }}>
                      {s.n}
                    </p>
                    <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: CREAM_DIM }}>
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={100} className="rounded-2xl p-7 md:p-8" style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: MOSS_TEXT }}>
              Hverjir reka markaðinn
            </span>
            <p className="mt-4 font-display text-[19px] font-semibold leading-[1.32]" style={{ color: INK }}>
              Samvinnufélag, rekið dags daglega af heimakonum úr héraðinu sem skiptast á að standa
              vaktina.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed" style={{ color: MUTED }}>
              Gestir lýsa markaðnum aftur og aftur á sama veg: lítil samvinnuverslun þar sem vörurnar
              eru gerðar af fólkinu sem stendur vaktina, og hagnaðurinn verður eftir í heimabyggð.
            </p>
          </Reveal>
        </div>

        <Reveal delay={220}>
          <p className="mt-10 text-[11.5px] leading-relaxed" style={{ color: 'rgba(236,230,210,.5)' }}>
            Torfbæir í bakgrunni eru andrúmsloftsmynd af íslenskri byggingararfleifð, ekki mynd af
            markaðnum sjálfum.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  SECTION — Reviews (sourced, no star number)                              */
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
              <SeedMark size={20} color={RUST} />
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
/*  SECTION — Practical info (huge) + eager map                              */
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
              style={{ background: open ? 'rgba(85,99,47,.14)' : 'rgba(178,58,30,.12)' }}
            >
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: open ? MOSS : RUST }} aria-hidden />
              <span className="text-[13.5px] font-semibold" style={{ color: open ? MOSS_TEXT : RUST_TEXT }}>
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
                  <RowIcon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: RUST }} aria-hidden />
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                      {row.k}
                    </dt>
                    {row.href ? (
                      <a href={row.href} className={`mt-1 block font-display text-[22px] font-semibold ${FOCUS}`} style={{ color: INK }}>
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
              <ArrowUpRight className="mt-0.5 h-5 w-5 shrink-0" style={{ color: RUST }} aria-hidden />
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                  Fyrirspurnir
                </dt>
                <a href={`mailto:${EMAIL}`} className={`mt-1 block font-display text-[22px] font-semibold ${FOCUS}`} style={{ color: INK }}>
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
/*  SECTION — Final CTA band                                                 */
/* ══════════════════════════════════════════════════════════════════════ */
function FinalCTA() {
  const open = useOpenNow()
  return (
    <section className="mx-auto max-w-[1200px] px-5 pb-24 pt-20 md:px-8 md:pb-28 md:pt-28">
      <Reveal className="relative overflow-hidden rounded-3xl px-6 py-14 text-center md:px-12 md:py-20" style={{ background: INK }}>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <SeedMark size={340} color="#ECE6D2" />
        </div>
        <div className="relative">
          <SeedMark size={28} color={HONEY} />
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-[clamp(1.8rem,4.5vw,3rem)] font-semibold leading-[1.12] text-[#ECE6D2]">
            Sjáumst á markaðnum í Borgarnesi
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: CREAM_DIM }}>
            {open ? 'Opið núna' : 'Opið alla daga'} · {HOURS} · {ADDRESS}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={PHONE_HREF}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-transform hover:-translate-y-0.5 ${FOCUS_ON_FILL}`}
              style={{ background: RUST, color: '#FFF7F0' }}
            >
              <Phone className="h-4 w-4" aria-hidden />
              {PHONE}
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-transform hover:-translate-y-0.5 ${FOCUS}`}
              style={{ background: 'rgba(236,230,210,.12)', color: '#ECE6D2', border: '1px solid rgba(236,230,210,.3)' }}
            >
              <MapPin className="h-4 w-4" aria-hidden />
              Leiðin til okkar
            </a>
          </div>
          <p className="mx-auto mt-8 max-w-lg text-[12px] leading-relaxed" style={{ color: 'rgba(236,230,210,.5)' }}>
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
        #lj-root ::selection { background:${RUST}; color:#FFF7F0; }
        .lj-navlink { position:relative; }
        .lj-navlink::after {
          content:''; position:absolute; left:0; right:100%; bottom:-5px; height:2px;
          background:${RUST}; transition:right .3s ${EASE};
        }
        .lj-navlink:hover::after { right:0; }
        @media (prefers-reduced-motion: reduce) {
          .lj-navlink::after { transition-duration: .01ms !important; }
        }
      `}</style>

      <div id="lj-root">
        <PreviewChrome company={company} />
        <TopNav lenisRef={lenisRef} />
        <main>
          <Hero />
          <Categories />
          <ProducerIndex />
          <Shelf />
          <Story />
          <Reviews />
          <Visit />
          <FinalCTA />
        </main>
        <MobileStickyBar />
        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
