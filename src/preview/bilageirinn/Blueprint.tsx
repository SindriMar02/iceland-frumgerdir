import { Fragment, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import Lenis from 'lenis'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
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
  FACTS,
  HERO,
  HOURS,
  IMG,
  INSURANCE,
  LOGO,
  LUBE_PHONE_DISPLAY,
  LUBE_PHONE_HREF,
  MAPS,
  NAME,
  PHONE_DISPLAY,
  PHONE_HREF,
  SEO,
  SERVICES,
  STORY,
  TEAM,
  TRUST_STRIP,
} from './data'

const company = getPreviewCompany('bilageirinn')

/* ── GRÓFIN BLUEPRINT. Trust through transparency: the page is laid out
      like the shop's own measurement document, drafted live in front of
      you. A real blueprint is pale linework on a deep cyanotype-blue
      ground — so the dark pass below leans INTO that, not away from it:
      deep blueprint-navy ground, pale-paper ink, hairlines in low-alpha
      pale blue, Geist Mono doing the heavy lifting, and one plotter
      red-orange that is rationed to measurement marks, active states and
      the phone CTA. Every pairing below is contrast-checked against the
      surface it actually sits on (BG / TINT / CARD / PLATE_BG). ─── */
const BG = '#101E30' /* deep blueprint navy-black — page ground */
const INK = '#EFF1EC' /* primary text — 14.6:1 on BG (the old paper color, now the ink) */
const MUT = '#8CA0B3' /* secondary text — 6.2:1 on BG, 5:1 on CARD */
const LINE = '#7E93A6' /* hairlines + rules only (non-text) */
const ACCENT = '#D6491F' /* plotter red: marks, drawn lines, large type — 3.9:1 vs BG, non-text/large-text use only */
const ACCENT_DEEP = '#CC4419' /* accent FILL only — CTA/button backgrounds. White text on it 4.8:1; fill itself 3.5:1 vs BG */
const ACCENT_LIT = '#EE7A4C' /* accent TEXT wherever it sits on the dark ground — 6:1 on BG, 4.9:1 on CARD */
const TINT = '#14253A' /* claims-flow band — one notch up from BG */
const CARD = '#1B2F49' /* elevated card fill (claims cards, work-order card) — one notch up again */
const PANEL_MUT = MUT /* alias kept so existing call sites still resolve */
const HAIR = 'rgba(239,241,236,0.12)'
const HAIR_STRONG = 'rgba(239,241,236,0.28)'
const PANEL_HAIR = HAIR_STRONG /* alias — the old "dark panel" hairline is now the sitewide hairline */
/* a few elements stay printed on paper on purpose — the wordmark, the
   Toyota/Kia certification marks, the INNIFALIÐ ink stamp — echoing real
   title-block nameplates pinned onto a blueprint. Kept independent of the
   tokens above so their own colors stay legible regardless of page theme. */
const PLATE_BG = 'rgba(239,241,236,0.96)'
const PLATE_MUT = '#46586A' /* 6.5:1 on PLATE_BG */
const PLATE_HAIR = 'rgba(27,42,58,0.16)'
const ACCENT_PLATE = '#B23A16' /* 5.3:1 on the INNIFALIÐ stamp's paper-cream */

const DISPLAY = "'CabinetGrotesk-Black', 'Arial Black', sans-serif"
const EBOLD = "'CabinetGrotesk-Extrabold', 'Arial Black', sans-serif"
const BODY = "'Satoshi', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"

const B = import.meta.env.BASE_URL
const EASE = [0.23, 1, 0.32, 1] as const

/* faint drafting grid — minor 28px, major every 140px. Pale lines on the
   dark ground: literally how a real blueprint's grid reads. */
const GRID_BG: CSSProperties = {
  backgroundImage: [
    `linear-gradient(rgba(239,241,236,0.045) 1px, transparent 1px)`,
    `linear-gradient(90deg, rgba(239,241,236,0.045) 1px, transparent 1px)`,
    `linear-gradient(rgba(239,241,236,0.08) 1px, transparent 1px)`,
    `linear-gradient(90deg, rgba(239,241,236,0.08) 1px, transparent 1px)`,
  ].join(', '),
  backgroundSize: '28px 28px, 28px 28px, 140px 140px, 140px 140px',
}

const CSS = `
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'CabinetGrotesk-Extrabold'; src: url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Extrabold.woff2') format('woff2'), url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Extrabold.woff') format('woff'); font-weight: 800; font-style: normal; font-display: swap; }
@font-face { font-family: 'CabinetGrotesk-Black'; src: url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Black.woff2') format('woff2'), url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Black.woff') format('woff'); font-weight: 900; font-style: normal; font-display: swap; }

.bp-page { background: ${BG}; color: ${INK}; }
.bp-page ::selection { background: ${ACCENT}; color: #FFFFFF; }
.bp-page a, .bp-page button { -webkit-tap-highlight-color: transparent; }
.bp-page :focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 3px; }

/* video-wall posters: near-still Ken Burns drift so the slots read as
   waiting instrument feeds, not as fake videos. Negative delays desync
   the six slots; reduced motion parks them completely. */
@keyframes bp-panA { from { transform: scale(1.07) translate3d(-1.1%, -0.7%, 0); } to { transform: scale(1.15) translate3d(1.1%, 0.7%, 0); } }
@keyframes bp-panB { from { transform: scale(1.15) translate3d(1%, 0.6%, 0); } to { transform: scale(1.07) translate3d(-1%, -0.6%, 0); } }
.bp-kenA { animation: bp-panA 44s ease-in-out infinite alternate; will-change: transform; }
.bp-kenB { animation: bp-panB 52s ease-in-out infinite alternate; will-change: transform; }

@media (prefers-reduced-motion: reduce) {
  .bp-kenA, .bp-kenB { animation: none; }
}
`

/* ───────────────────────── shared motion helpers ───────────────────────── */

/** Scroll-entry rise. Translation only — never clips, never scales to zero,
    so the observer can sit on the element itself. */
function Rise({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Mount-time entry for hero elements: already in view at mount, so this
    uses `animate`, never whileInView. */
function Intro({
  children,
  delay = 0,
  y = 14,
  className,
  style,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Mono label that types on, character by character. Only used inside
    aria-hidden overlay layers, so no screen-reader duplication. */
function TypeOn({
  text,
  delay,
  className,
  style,
}: {
  text: string
  delay: number
  className?: string
  style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  if (reduced) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    )
  }
  return (
    <span className={className} style={style}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.02, delay: delay + i * 0.035 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

/** Photo reveal as a horizontal plotter pass: clip-path opens from the left
    while a thin red scan edge travels with the wipe. The observer sits on
    the UNCLIPPED outer wrapper — IntersectionObserver never fires on an
    element that clips itself to zero. */
function ScanImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  priority?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  if (reduced) {
    return (
      <div className={`relative overflow-hidden ${className ?? ''}`}>
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName ?? ''}`}
        />
      </div>
    )
  }
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="h-full w-full"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: inView ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
        transition={{ duration: 1.05, ease: EASE }}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName ?? ''}`}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute inset-y-0 w-[2px]"
        style={{ background: ACCENT, boxShadow: '0 0 14px rgba(214,73,31,0.6)' }}
        initial={{ left: '0%', opacity: 0 }}
        animate={inView ? { left: ['0%', '99%'], opacity: [0, 1, 1, 0] } : {}}
        transition={{
          left: { duration: 1.05, ease: EASE },
          opacity: { duration: 1.05, times: [0, 0.08, 0.88, 1] },
        }}
      />
    </div>
  )
}

/** Mono tabular count-up used inside the spec tables. */
function CountUp({ to, pad, suffix }: { to: number; pad: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const mv = useMotionValue(0)
  const final = String(to).padStart(pad, '0') + suffix
  useEffect(() => {
    if (!inView || !ref.current) return
    if (reduced) {
      ref.current.textContent = final
      return
    }
    const controls = animate(mv, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: v => {
        if (ref.current) ref.current.textContent = String(Math.round(v)).padStart(pad, '0') + suffix
      },
    })
    return () => controls.stop()
  }, [inView, reduced, to, pad, suffix, mv, final])
  return (
    <span ref={ref} className="tabular-nums" aria-label={final}>
      {reduced || inView ? final : String(0).padStart(pad, '0') + suffix}
    </span>
  )
}

/** Red registration ticks on the four corners of a drafting frame. */
function CornerTicks({ color = ACCENT }: { color?: string }) {
  const c: CSSProperties = { borderColor: color }
  return (
    <>
      <span aria-hidden className="absolute -left-px -top-px z-10 h-3 w-3 border-l-2 border-t-2" style={c} />
      <span aria-hidden className="absolute -right-px -top-px z-10 h-3 w-3 border-r-2 border-t-2" style={c} />
      <span aria-hidden className="absolute -bottom-px -left-px z-10 h-3 w-3 border-b-2 border-l-2" style={c} />
      <span aria-hidden className="absolute -bottom-px -right-px z-10 h-3 w-3 border-b-2 border-r-2" style={c} />
    </>
  )
}

/** Drafting frame: hairline border, corner ticks, mono caption rows. */
function DraftFrame({
  children,
  label,
  note,
  className,
}: {
  children: ReactNode
  label?: string
  note?: string
  className?: string
}) {
  return (
    <figure className={className}>
      {label && (
        <figcaption
          className="mb-2 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.2em]"
          style={{ fontFamily: MONO, color: MUT }}
        >
          <span>{label}</span>
          <span aria-hidden style={{ color: ACCENT_LIT }}>
            +
          </span>
        </figcaption>
      )}
      <div className="relative border" style={{ borderColor: HAIR_STRONG }}>
        <CornerTicks />
        {children}
      </div>
      {note && (
        <p className="mt-2 text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUT }}>
          {note}
        </p>
      )}
    </figure>
  )
}

/** Section header set like an engineering drawing title-block:
    sheet number · sheet name — rule — headline. The whole page is one
    dark cyanotype sheet now, so every SheetHead uses the same ink —
    there is no separate "light page" branch left to fork against. */
function SheetHead({ sheet, name, title }: { sheet: string; name: string; title?: string }) {
  return (
    <Rise>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-[12px] uppercase tracking-[0.24em]" style={{ fontFamily: MONO, color: ACCENT_LIT }}>
          Blað {sheet} · {name}
        </p>
        <p className="hidden text-[11px] uppercase tracking-[0.18em] sm:block" style={{ fontFamily: MONO, color: MUT }}>
          Bílageirinn · Grófin 14a · 230 Reykjanesbær
        </p>
      </div>
      <div className="mt-3 h-px" style={{ background: HAIR_STRONG }} />
      {title && (
        <h2
          className="mt-8 max-w-4xl text-balance"
          style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(2.1rem, 4.6vw, 3.6rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.06,
            color: INK,
          }}
        >
          {title}
        </h2>
      )}
    </Rise>
  )
}

/** Desktop-only measurement ruler pinned to the page edge — its ticks fill
    plotter-red as you progress through the document. Scroll-linked, not a
    perpetual mover; hidden entirely under reduced motion and on mobile. */
function RulerStrip() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const clip = useTransform(scrollYProgress, v => `inset(0 0 ${(1 - v) * 100}% 0)`)
  if (reduced) return null
  const ticks: CSSProperties = {
    backgroundImage:
      'repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 8px), repeating-linear-gradient(to bottom, currentColor 0 2px, transparent 2px 40px)',
    backgroundSize: '7px 100%, 13px 100%',
    backgroundPosition: 'right top, right top',
    backgroundRepeat: 'no-repeat, no-repeat',
  }
  return (
    <div aria-hidden className="fixed right-3 top-1/2 z-30 hidden h-[38vh] w-[14px] -translate-y-1/2 lg:block">
      <div className="absolute inset-0" style={{ ...ticks, color: LINE, opacity: 0.7 }} />
      <motion.div className="absolute inset-0" style={{ ...ticks, color: ACCENT, clipPath: clip }} />
      <div className="absolute inset-y-0 right-0 w-px" style={{ background: LINE, opacity: 0.7 }} />
    </div>
  )
}

/* ─────────────────────────────── nav ─────────────────────────────── */

function Nav({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  const [solid, setSolid] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.querySelector(hash)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -76 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
  const link = 'hidden min-h-11 items-center px-3 text-[12.5px] uppercase tracking-[0.14em] md:inline-flex'
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        background: solid ? 'rgba(16,30,48,0.82)' : 'transparent',
        backdropFilter: solid ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(14px)' : 'none',
        borderBottom: solid ? `1px solid ${HAIR}` : '1px solid transparent',
      }}
      initial={reduced ? false : { y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between px-5 md:px-8">
        <a href="#efst" onClick={go('#efst')} className="inline-flex min-h-11 items-center" aria-label={`${NAME} — efst á síðu`}>
          {/* the real wordmark is dark ink on transparent, printed for a
              light ground — mounted on its own small paper nameplate here
              so it stays legible against the new dark cyanotype page */}
          <span className="inline-flex items-center px-3 py-1.5" style={{ background: PLATE_BG }}>
            <img src={LOGO} alt={NAME} className="h-8 w-auto" style={{ filter: 'contrast(1.08)' }} />
          </span>
        </a>
        <nav className="flex items-center gap-1 md:gap-2" style={{ fontFamily: MONO, color: MUT }}>
          <a href="#thjonusta" onClick={go('#thjonusta')} className={link}>
            Þjónusta
          </a>
          <a href="#tjon" onClick={go('#tjon')} className={link}>
            Tjónaviðgerðir
          </a>
          <a href="#verkstaedid" onClick={go('#verkstaedid')} className={link}>
            Verkstæðið
          </a>
          <a
            href={PHONE_HREF}
            className="ml-2 inline-flex min-h-11 items-center gap-2 px-4 text-[14px] font-bold"
            style={{ background: ACCENT_DEEP, color: '#FFFFFF', fontFamily: BODY }}
          >
            <Phone size={15} strokeWidth={2.2} aria-hidden />
            {PHONE_DISPLAY}
          </a>
        </nav>
      </div>
    </motion.header>
  )
}

/* ─────────────────────────────── hero ─────────────────────────────── */

/** Title-block spec panel data — every value verified in data.ts. */
const SPECS: { k: string; v: string; href?: string }[] = [
  { k: 'Stofnár', v: '2003' },
  { k: 'Húsnæði', v: '810 m²' },
  { k: 'Vottun', v: 'TOYOTA · KIA' },
  { k: 'Mat', v: 'CABAS' },
  { k: 'Sími', v: PHONE_DISPLAY, href: PHONE_HREF },
]

/** The live measurement plot over the hero photo: datum lines DRAW in
    (pathLength), crosshairs pop, mono labels type on. Generic process
    terms only — it shows HOW a panel gets measured, it never claims a
    reading. Mount-timed with `animate` (in view at load), and re-keyed
    per carousel slide so the machine visibly re-measures each photo.
    Coordinates sit in the upper-right, clear of the headline column. */
function HeroPlot() {
  const reduced = useReducedMotion()
  if (reduced) return null
  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 0.95 },
    transition: { duration: 0.8, ease: EASE, delay },
  })
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.line x1="40" y1="22" x2="96" y2="22" stroke={ACCENT} strokeWidth="0.28" strokeDasharray="1.7 1.2" {...draw(0.55)} />
        <motion.line x1="82" y1="8" x2="82" y2="46" stroke={ACCENT} strokeWidth="0.28" strokeDasharray="1.7 1.2" {...draw(0.75)} />
        <motion.line x1="82" y1="22" x2="58" y2="40" stroke={INK} strokeWidth="0.2" {...draw(0.95)} />
      </svg>
      <CrossPoint x={82} y={22} label="MÆLIPUNKTUR A" delay={0.95} />
      <CrossPoint x={58} y={40} label="MÆLIPUNKTUR B" delay={1.15} />
      <TypeOn
        text="VIÐMIÐUNARLÍNA"
        delay={1.05}
        className="absolute left-[41%] top-[22%] mt-2 text-[10px] tracking-[0.2em]"
        style={{ fontFamily: MONO, color: INK, textShadow: '0 1px 6px rgba(0,0,0,0.85)' }}
      />
    </div>
  )
}

function CrossPoint({ x, y, label, delay }: { x: number; y: number; label: string; delay: number }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <motion.span
        className="block"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE, delay }}
      >
        <span className="relative block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" style={{ borderColor: ACCENT }}>
          <span className="absolute left-1/2 top-1/2 h-[26px] w-px -translate-x-1/2 -translate-y-1/2" style={{ background: ACCENT }} />
          <span className="absolute left-1/2 top-1/2 h-px w-[26px] -translate-x-1/2 -translate-y-1/2" style={{ background: ACCENT }} />
        </span>
      </motion.span>
      <TypeOn
        text={label}
        delay={delay + 0.3}
        className="absolute left-4 top-2 whitespace-nowrap text-[10px] tracking-[0.2em]"
        style={{ fontFamily: MONO, color: INK, textShadow: '0 1px 6px rgba(0,0,0,0.85)' }}
      />
    </div>
  )
}

/** Which SERVICES entries get a hero slide, in display order, and which
    photo/alt stands in for each — the exact same SERVICE_IMGS / SERVICE_ALTS
    pairing the service index below already uses, so no photo-to-service
    pairing is invented twice. Smurstöð has no photo of its own (its slot
    is already spoken for by IMG.lift in the service index), so it sits
    this carousel out. */
const HERO_SLIDE_IDX = [0, 1, 2, 4, 5, 6]

/** Ruler-tick slide index: a short pale tick per slide, the active one
    tall and plotter-red — literally a ruler graduation used as a tab list. */
function HeroTick({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={label}
      onClick={onClick}
      className="group relative flex h-11 w-6 shrink-0 items-end justify-center"
    >
      <span
        aria-hidden
        className="block w-px transition-all duration-300"
        style={{
          height: active ? '22px' : '11px',
          background: active ? ACCENT : 'rgba(239,241,236,0.45)',
          opacity: active ? 1 : 0.8,
        }}
      />
    </button>
  )
}

function HeroArrow({ dir, onClick, label }: { dir: 'prev' | 'next'; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center border transition-colors duration-200"
      style={{ borderColor: 'rgba(239,241,236,0.35)' }}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
        <path
          d={dir === 'prev' ? 'M9.5 2.5 3.5 7.5l6 5' : 'M5.5 2.5l6 5-6 5'}
          stroke={INK}
          strokeWidth="1.6"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </button>
  )
}

function Hero() {
  const reduced = useReducedMotion()
  const words = HERO.headline.split(' ') /* Aftur í rétta línu. */
  const slides = HERO_SLIDE_IDX.map((idx, i) => ({
    n: i + 1,
    service: SERVICES[idx],
    src: SERVICE_IMGS[idx],
    alt: SERVICE_ALTS[idx],
  }))
  const count = slides.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduced || paused) return
    const id = window.setInterval(() => setActive(a => (a + 1) % count), 5800)
    return () => window.clearInterval(id)
  }, [reduced, paused, count])

  const go = (i: number) => setActive(((i % count) + count) % count)
  const slide = slides[active]
  const SLIDE_LABEL = `Mynd ${String(slide.n).padStart(2, '0')}`

  return (
    <section
      id="efst"
      className="relative min-h-[100svh] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false)
      }}
    >
      {/* full-bleed carousel photo — the shop's own work, cycling */}
      <div aria-hidden className="absolute inset-0">
        {reduced ? (
          <img src={slide.src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
        ) : (
          <AnimatePresence initial={false}>
            <motion.img
              key={active}
              src={slide.src}
              alt=""
              loading={slide.n === 1 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.045 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          </AnimatePresence>
        )}
      </div>
      {/* the same photo, described properly, for screen readers — kept in
          sync with the visible slide without duplicating the crossfade */}
      <img src={slide.src} alt={slide.alt} className="sr-only" />

      {/* scrim: heavier under the text column and along the bottom, so any
          of the six photos stays legible under the overlaid copy */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(16,30,48,0.62) 0%, rgba(16,30,48,0.30) 30%, rgba(16,30,48,0.55) 62%, rgba(16,30,48,0.9) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(100deg, rgba(16,30,48,0.82) 0%, rgba(16,30,48,0.32) 44%, rgba(16,30,48,0) 68%)' }}
      />
      {/* the drafting grid — faint pale lines on the dark ground */}
      {reduced ? (
        <div aria-hidden className="absolute inset-0" style={GRID_BG} />
      ) : (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={GRID_BG}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        />
      )}
      {/* registration ticks at the sheet's own corners */}
      <div aria-hidden className="pointer-events-none absolute inset-4 opacity-60 md:inset-6">
        <CornerTicks color={INK} />
      </div>
      {!reduced && <HeroPlot key={active} />}
      {/* content overlay */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1360px] flex-col justify-end px-5 pb-10 pt-32 md:px-8 md:pb-14 md:pt-36">
        {/* title block: corner label + per-slide caption, in one */}
        <Intro delay={0.15}>
          <div className="inline-flex flex-wrap items-stretch border" style={{ borderColor: 'rgba(239,241,236,0.35)' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex"
              >
                <span
                  className="px-3 py-2 text-[10.5px] uppercase tracking-[0.18em]"
                  style={{ fontFamily: MONO, color: ACCENT_LIT, borderRight: '1px solid rgba(239,241,236,0.35)' }}
                >
                  {SLIDE_LABEL}
                </span>
                <span
                  className="px-3 py-2 text-[10.5px] uppercase tracking-[0.18em]"
                  style={{ fontFamily: MONO, color: INK, borderRight: '1px solid rgba(239,241,236,0.35)' }}
                >
                  {slide.service.name}
                </span>
                <span className="px-3 py-2 text-[10.5px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUT }}>
                  {slide.service.tag}
                </span>
              </motion.span>
            </AnimatePresence>
          </div>
        </Intro>
        {/* accented Icelandic caps: open leading, no clip masks, ever */}
        <h1
              className="mt-8 max-w-2xl text-balance"
              style={{
                fontFamily: DISPLAY,
                fontSize: 'clamp(2.9rem, 8vw, 5.4rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                color: INK,
              }}
            >
              {reduced
                ? HERO.headline
                : words.map((w, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: EASE, delay: 1.5 + i * 0.09 }}
                    >
                      {w}
                      {i < words.length - 1 ? ' ' : ''}
                    </motion.span>
                  ))}
            </h1>
            <Intro delay={1.75}>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed md:text-lg" style={{ fontFamily: BODY, color: MUT }}>
                {HERO.sub}
              </p>
            </Intro>
            <Intro delay={1.9}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href={PHONE_HREF}
                  className="inline-flex min-h-[52px] items-center gap-2.5 px-7 text-[16px] font-bold transition-transform duration-150 active:scale-[0.97]"
                  style={{ background: ACCENT_DEEP, color: '#FFFFFF', fontFamily: BODY }}
                >
                  <Phone size={17} strokeWidth={2.4} aria-hidden />
                  {HERO.ctaPrimary}
                </a>
                <a
                  href="#thjonusta"
                  className="inline-flex min-h-[52px] items-center border px-7 text-[16px] font-medium transition-transform duration-150 active:scale-[0.97]"
                  style={{ borderColor: 'rgba(239,241,236,0.5)', color: INK, fontFamily: BODY }}
                >
                  {HERO.ctaSecondary}
                </a>
              </div>
            </Intro>
            <Intro delay={2.05}>
              <p className="mt-8 text-[12.5px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: MUT }}>
                {HERO.cert}
              </p>
            </Intro>
        {/* bottom bar: spec readout (left) + carousel controls (right) */}
        <Intro
          delay={0.5}
          className="mt-10 flex flex-col gap-6 border-t pt-6 md:mt-12 md:flex-row md:items-end md:justify-between"
          style={{ borderColor: 'rgba(239,241,236,0.22)' }}
        >
          <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:overflow-visible md:px-0">
            <div className="flex w-max">
              {SPECS.map((s, i, arr) => (
                <div
                  key={s.k}
                  className={`min-w-[128px] py-1 pr-5 ${i > 0 ? 'pl-5' : ''}`}
                  style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(239,241,236,0.22)' : 'none' }}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: MUT }}>
                    {s.k}
                  </p>
                  {s.href ? (
                    <a href={s.href} className="mt-1 inline-flex min-h-11 items-center text-[14px] font-medium" style={{ fontFamily: MONO, color: INK }}>
                      {s.v}
                    </a>
                  ) : (
                    <p className="mt-1 text-[14px] font-medium" style={{ fontFamily: MONO, color: INK }}>
                      {s.v}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3" role="tablist" aria-label="Þjónusta í hringrás">
            <HeroArrow dir="prev" onClick={() => go(active - 1)} label="Fyrri þjónusta" />
            <div className="flex items-end gap-1">
              {slides.map((s, i) => (
                <HeroTick key={s.service.name} active={i === active} label={s.service.name} onClick={() => go(i)} />
              ))}
            </div>
            <HeroArrow dir="next" onClick={() => go(active + 1)} label="Næsta þjónusta" />
          </div>
        </Intro>
      </div>
    </section>
  )
}

/* ─────────────────── trust strip + fact sheet (blað 02) ─────────────────── */

function TrustStrip() {
  return (
    <section className="border-y" style={{ borderColor: HAIR }}>
      <ul className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-10 gap-y-3 px-5 py-5 md:px-8">
        {TRUST_STRIP.map(t => (
          <li key={t} className="flex items-center gap-3 text-[12px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT }}>
            <span aria-hidden className="h-1.5 w-1.5" style={{ background: ACCENT }} />
            {t}
          </li>
        ))}
      </ul>
    </section>
  )
}

function FactSheet() {
  return (
    <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28">
      <SheetHead sheet="02" name="Staðreyndir" />
      <div className="mt-6">
        {FACTS.map((f, i) => (
          <Rise key={f.label} delay={i * 0.06}>
            <div
              className="grid grid-cols-[56px_1fr_auto] items-baseline gap-4 border-b py-6 md:grid-cols-[72px_1fr_auto] md:gap-8"
              style={{ borderColor: HAIR }}
            >
              <span className="text-[12px] tabular-nums" style={{ fontFamily: MONO, color: MUT }}>
                F-{String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[13px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: MUT }}>
                {f.label}
              </span>
              <span className="text-right leading-none" style={{ fontFamily: MONO, color: INK, fontSize: 'clamp(1.9rem, 4.5vw, 3rem)' }}>
                {f.num !== null ? <CountUp to={f.num} pad={f.pad} suffix={f.suffix} /> : f.text}
              </span>
            </div>
          </Rise>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────── story as a document (blað 03) ───────────────────── */

/** Margin annotations quote the verified lead copy only. */
const ANNOT = ['HVERT MÁL ER MÆLT', 'HVERT HANDTAK SKRÁÐ', 'VERKINU LÝKUR EKKI FYRR EN ALLT STENST KRÖFUR']

function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  const stops = [0, 33.333, 66.667]
  return (
    <div ref={ref} className="mt-16 md:mt-24">
      <p className="text-[11.5px] uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: ACCENT_LIT }}>
        Mæld lína · 2003–2007
      </p>
      {/* desktop: the company history as a dimensioned drawing line */}
      <div className="mt-8 hidden md:block">
        <div className="relative h-8">
          <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: HAIR_STRONG }} />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
            style={{ background: ACCENT }}
            initial={false}
            animate={{ scaleX: inView || reduced ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 1.2, ease: EASE }}
          />
          {stops.map((x, i) => (
            <motion.span
              key={x}
              className="absolute bottom-0 h-5 w-[2px] -translate-x-1/2"
              style={{ left: `${x}%`, background: INK }}
              initial={false}
              animate={{ opacity: inView || reduced ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.35 + i * 0.35 }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-8 pt-6">
          {STORY.timeline.map((t, i) => (
            <Rise key={t.year} delay={i * 0.12}>
              <p className="text-[16px] tabular-nums tracking-[0.1em]" style={{ fontFamily: MONO, color: ACCENT_LIT }}>
                {t.year}
              </p>
              <p className="mt-2 max-w-[40ch] text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {t.text}
              </p>
            </Rise>
          ))}
        </div>
      </div>
      {/* mobile: same line, set vertically */}
      <div className="mt-8 space-y-10 border-l-2 pl-6 md:hidden" style={{ borderColor: HAIR_STRONG }}>
        {STORY.timeline.map((t, i) => (
          <Rise key={t.year} delay={i * 0.08}>
            <div className="relative">
              <span aria-hidden className="absolute -left-[31px] top-1 block h-3 w-3 border-2" style={{ borderColor: ACCENT, background: BG }} />
              <p className="text-[15px] tabular-nums tracking-[0.1em]" style={{ fontFamily: MONO, color: ACCENT_LIT }}>
                {t.year}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {t.text}
              </p>
            </div>
          </Rise>
        ))}
      </div>
    </div>
  )
}

function Story() {
  return (
    <section className="border-t" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28">
        <SheetHead sheet="03" name="Sagan" title={STORY.title} />
        <div className="mt-12 grid gap-10 md:grid-cols-[220px_1fr] md:gap-12 lg:grid-cols-[220px_1.05fr_0.9fr]">
          {/* mono margin annotations, like a checked-off inspection copy */}
          <aside className="hidden self-start border-r pr-6 md:block md:sticky md:top-28" style={{ borderColor: HAIR }}>
            <div className="space-y-7">
              {ANNOT.map((a, i) => (
                <div key={a}>
                  <p className="text-[10.5px] tracking-[0.22em]" style={{ fontFamily: MONO, color: ACCENT_LIT }}>
                    ATH. {i + 1}
                  </p>
                  <p className="mt-1.5 text-[12px] leading-relaxed tracking-[0.06em]" style={{ fontFamily: MONO, color: MUT }}>
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </aside>
          <div>
            <Rise>
              <p className="max-w-[58ch] text-[17.5px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
                {STORY.lead}
              </p>
              <p className="mt-5 max-w-[58ch] text-[16.5px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {STORY.body}
              </p>
            </Rise>
            {/* the annotations fold into ruled chips on mobile */}
            <div className="mt-8 flex flex-wrap gap-2 md:hidden">
              {ANNOT.map(a => (
                <span key={a} className="border px-3 py-2 text-[10.5px] tracking-[0.14em]" style={{ fontFamily: MONO, color: MUT, borderColor: HAIR_STRONG }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
          <DraftFrame label="MYND 02 · SPRAUTUKLEFI" className="md:col-span-2 lg:col-span-1">
            <ScanImage src={IMG.booth} alt="Bíll afmarkaður með pappír og grunnaður í sprautuklefa" className="aspect-[4/3] lg:aspect-[4/5]" />
          </DraftFrame>
        </div>
        <Timeline />
      </div>
    </section>
  )
}

/* ──────────────── service index as a work order (blað 04) ──────────────── */

const SERVICE_IMGS = [IMG.retting, IMG.malun, IMG.garage, IMG.lift, IMG.wheel, IMG.headlight, IMG.brake]
const SERVICE_ALTS = [
  'Flötur yfirbyggingar varinn og unninn með höndunum',
  'Sprautuvinna í málningarklefa',
  'Verkstæðisgólf með bílum í viðgerð',
  'Unnið undir bíl á lyftu',
  'Fjöðrunar- og hjólabúnaður í nærmynd',
  'Aðalljós á dökkum bíl',
  'Bremsubúnaður skoðaður með hjólið af',
]

function ServiceRow({
  s,
  i,
  on,
  setActive,
  reduced,
}: {
  s: (typeof SERVICES)[number]
  i: number
  on: boolean
  setActive: (i: number) => void
  reduced: boolean
}) {
  return (
    <li className="border-b" style={{ borderColor: HAIR }}>
      <button
        type="button"
        onClick={() => setActive(i)}
        onMouseEnter={() => setActive(i)}
        onFocus={() => setActive(i)}
        aria-expanded={on}
        className="flex w-full items-start gap-4 py-5 text-left md:gap-6 md:py-6"
      >
        <span className="w-11 shrink-0 pt-[7px] text-[12.5px] tabular-nums" style={{ fontFamily: MONO, color: on ? ACCENT_LIT : MUT }}>
          V-{String(i + 1).padStart(2, '0')}
        </span>
        {/* the work-order checkbox: the active row's check draws itself */}
        <span
          aria-hidden
          className="mt-[6px] inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors duration-300"
          style={{ borderColor: on ? ACCENT : HAIR_STRONG }}
        >
          <svg viewBox="0 0 20 20" className="h-[14px] w-[14px]" fill="none">
            <motion.path
              d="M4 10.5 L8.5 15 L16 5.5"
              stroke={ACCENT}
              strokeWidth="2.4"
              strokeLinecap="square"
              initial={false}
              animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
            />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span
            className="block transition-colors duration-300"
            style={{
              fontFamily: EBOLD,
              fontSize: 'clamp(1.3rem, 2.4vw, 1.85rem)',
              letterSpacing: '-0.01em',
              lineHeight: 1.12,
              color: on ? INK : MUT,
            }}
          >
            {s.name}
          </span>
          <AnimatePresence initial={false}>
            {on && (
              <motion.span
                className="block overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
              >
                <span className="block max-w-[54ch] pt-2.5 text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                  {s.desc}
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className="hidden pt-[9px] text-[10.5px] uppercase tracking-[0.16em] sm:block" style={{ fontFamily: MONO, color: MUT }}>
          {s.tag}
        </span>
      </button>
    </li>
  )
}

function ServiceIndex() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion() ?? false
  return (
    <section id="thjonusta" className="scroll-mt-24 border-t" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28">
        <SheetHead sheet="04" name="Þjónusta" title="Þjónustan, lið fyrir lið" />
        {/* functional asymmetry: the checklist drives, the drafting-frame
            panel answers with the matching photo */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="order-first lg:order-last">
            <DraftFrame
              label={`V-${String(active + 1).padStart(2, '0')} · ${SERVICES[active].tag}`}
              className="lg:sticky lg:top-24"
            >
              <div className="relative aspect-video overflow-hidden lg:aspect-[4/3]">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={active}
                    src={SERVICE_IMGS[active]}
                    alt={SERVICE_ALTS[active]}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.65, ease: EASE }}
                  />
                </AnimatePresence>
              </div>
            </DraftFrame>
          </div>
          <ul className="border-t" style={{ borderColor: HAIR_STRONG }}>
            {SERVICES.map((s, i) => (
              <ServiceRow key={s.name} s={s} i={i} on={i === active} setActive={setActive} reduced={reduced} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─────────────── claims process as a flowchart (blað 05) ─────────────── */

function FlowConnector({ i, inView, reduced }: { i: number; inView: boolean; reduced: boolean }) {
  const t = (d: number) => ({
    duration: reduced ? 0 : 0.55,
    ease: EASE,
    delay: reduced ? 0 : 0.35 + d,
  })
  return (
    <>
      {/* desktop: horizontal drawn connector with arrowhead */}
      <svg width="56" height="24" viewBox="0 0 56 24" aria-hidden className="mx-1 hidden shrink-0 self-center md:block">
        <motion.path
          d="M2 12 H46 M40 4 L50 12 L40 20"
          fill="none"
          stroke={ACCENT}
          strokeWidth="2"
          initial={false}
          animate={{ pathLength: inView || reduced ? 1 : 0, opacity: inView || reduced ? 1 : 0 }}
          transition={t(i * 0.28 + 0.16)}
        />
      </svg>
      {/* mobile: same connector, vertical */}
      <svg width="24" height="48" viewBox="0 0 24 48" aria-hidden className="mx-auto block md:hidden">
        <motion.path
          d="M12 2 V38 M4 32 L12 42 L20 32"
          fill="none"
          stroke={ACCENT}
          strokeWidth="2"
          initial={false}
          animate={{ pathLength: inView || reduced ? 1 : 0, opacity: inView || reduced ? 1 : 0 }}
          transition={t(i * 0.28 + 0.16)}
        />
      </svg>
    </>
  )
}

function ClaimsFlow() {
  const flowRef = useRef<HTMLDivElement>(null)
  const inView = useInView(flowRef, { once: true, margin: '-100px' })
  const reduced = useReducedMotion() ?? false
  return (
    <section id="tjon" className="scroll-mt-24 border-t" style={{ borderColor: HAIR, background: TINT }}>
      <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28">
        <SheetHead sheet="05" name="Tjónaferlið" title="Skref fyrir skref, þar til línan er rétt" />
        <div ref={flowRef} className="mt-12 flex flex-col md:flex-row md:items-stretch">
          {CLAIM_STEPS.map((s, i) => {
            const card = (
              <motion.div
                className="relative flex-1 p-6 md:p-7"
                style={{
                  background: CARD,
                  border: s.highlight ? `2px solid ${ACCENT}` : `1px solid ${HAIR_STRONG}`,
                }}
                initial={false}
                animate={{ opacity: inView || reduced ? 1 : 0, y: inView || reduced ? 0 : 20 }}
                transition={{ duration: reduced ? 0 : 0.6, ease: EASE, delay: reduced ? 0 : i * 0.28 }}
              >
                <p className="text-[11.5px] tracking-[0.22em]" style={{ fontFamily: MONO, color: ACCENT_LIT }}>
                  STIG {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  className="mt-3 text-balance"
                  style={{ fontFamily: EBOLD, fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)', letterSpacing: '-0.01em', lineHeight: 1.12 }}
                >
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                  {s.desc}
                </p>
                {/* the loaner car is included — stamped like an approval */}
                {s.highlight && (
                  <motion.span
                    className="absolute -right-2 -top-4 border-2 px-3 py-1.5 text-[13px] tracking-[0.24em] md:-right-3"
                    style={{
                      fontFamily: MONO,
                      color: ACCENT_PLATE,
                      borderColor: ACCENT,
                      background: 'rgba(244,228,220,0.92)',
                      rotate: '-7deg',
                    }}
                    initial={false}
                    animate={
                      inView || reduced
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 1.6 }
                    }
                    transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1], delay: reduced ? 0 : i * 0.28 + 0.45 }}
                  >
                    INNIFALIÐ
                  </motion.span>
                )}
              </motion.div>
            )
            return (
              <Fragment key={s.title}>
                {card}
                {i < CLAIM_STEPS.length - 1 && <FlowConnector i={i} inView={inView} reduced={reduced} />}
              </Fragment>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────── insurance ledger on navy (blað 06) ─────────────── */

function InsuranceBand() {
  return (
    <section className="relative" style={{ background: BG }}>
      <div aria-hidden className="absolute inset-0" style={GRID_BG} />
      <div className="relative mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28">
        <SheetHead sheet="06" name="Tryggingar" title={INSURANCE.title} />
        <Rise delay={0.1}>
          <p className="mt-6 max-w-[62ch] text-[16.5px] leading-relaxed" style={{ fontFamily: BODY, color: PANEL_MUT }}>
            {INSURANCE.body}
          </p>
        </Rise>
        {/* the companies as one ruled ledger row */}
        <div className="mt-12 grid grid-cols-2 border-t sm:grid-cols-3 md:grid-cols-5" style={{ borderColor: PANEL_HAIR }}>
          {INSURANCE.companies.map((c, i) => (
            <Rise key={c} delay={i * 0.07}>
              <div className="border-b py-6 pr-4 md:border-b-0" style={{ borderColor: PANEL_HAIR }}>
                <p className="text-[12px] tabular-nums tracking-[0.2em]" style={{ fontFamily: MONO, color: ACCENT_LIT }}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-2 text-[15px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: INK }}>
                  {c}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────── video wall of shop feeds (blað 07) ──────────────────── */

/** Six planned clips. Real footage doesn't exist yet, so every slot is an
    honest poster: an existing photo drifting near-still, the clip name in
    the corner, and one shared VÆNTANLEG label for the section. No fake
    play buttons — a dead play button is a broken promise. When footage
    lands, a <video> drops into each slot where the comment marks it. */
const CLIPS: { tag: string; src: string; alt: string }[] = [
  { tag: 'SPRAUTUKLEFI', src: IMG.malun, alt: 'Sprautuvinna í málningarklefa' },
  { tag: 'RÉTTIBEKKUR', src: IMG.retting, alt: 'Flötur yfirbyggingar unninn með höndunum' },
  { tag: 'CABAS-SKJÁR', src: IMG.garage, alt: 'Verkstæðisgólf með bílum í viðgerð' },
  { tag: 'HJÓLASTILLING', src: IMG.wheel, alt: 'Fjöðrunar- og hjólabúnaður í nærmynd' },
  { tag: 'LJÓSASTILLING', src: IMG.headlight, alt: 'Aðalljós á dökkum bíl í myrkri' },
  { tag: 'BREMSUPRÓFUN', src: IMG.brake, alt: 'Bremsubúnaður með hjólið tekið af' },
]

function VideoWall() {
  return (
    <section className="border-t" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28">
        <SheetHead sheet="07" name="Myndbönd" />
        <Rise delay={0.08}>
          <p
            className="mt-8 text-[14px] tracking-[0.2em] md:text-[16px]"
            style={{ fontFamily: MONO, color: INK }}
          >
            MYNDBÖND · TEKIN UPP Í GRÓFINNI · VÆNTANLEG
          </p>
        </Rise>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {CLIPS.map((c, i) => (
            <Rise key={c.tag} delay={i * 0.06}>
              <figure className="p-2 md:p-2.5" style={{ background: BG }}>
                <div className="relative aspect-video overflow-hidden">
                  {/* real footage drops in here later:
                      <video src={...} poster={c.src} muted loop playsInline autoPlay /> */}
                  <img
                    src={c.src}
                    alt={c.alt}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover ${i % 2 ? 'bp-kenB' : 'bp-kenA'}`}
                    style={{ animationDelay: `${-i * 9}s` }}
                  />
                  <span
                    className="absolute left-2 top-2 px-2 py-1 text-[10.5px] tracking-[0.18em]"
                    style={{ fontFamily: MONO, color: INK, background: 'rgba(16,30,48,0.78)' }}
                  >
                    KLIPPA {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <figcaption className="flex items-baseline justify-between px-1 pb-1 pt-2.5">
                  <span className="text-[12px] tracking-[0.18em]" style={{ fontFamily: MONO, color: INK }}>
                    {c.tag}
                  </span>
                  <span className="text-[10px] tracking-[0.2em]" style={{ fontFamily: MONO, color: PANEL_MUT }}>
                    VÆNTANLEG
                  </span>
                </figcaption>
              </figure>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── materials + certification spec sheet (blað 08) ─────────── */

function Materials() {
  return (
    <section className="border-t" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28">
        <SheetHead sheet="08" name="Efni og vottun" title={CRAFT.title} />
        <div className="mt-12 grid gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
          <div>
            <Rise>
              <p className="max-w-[58ch] text-[16.5px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {CRAFT.body}
              </p>
            </Rise>
            <div className="mt-8 border-t" style={{ borderColor: HAIR_STRONG }}>
              {CRAFT.points.map((p, i) => (
                <Rise key={p} delay={i * 0.07}>
                  <div className="flex items-baseline gap-5 border-b py-4" style={{ borderColor: HAIR }}>
                    <span className="text-[12px] tabular-nums" style={{ fontFamily: MONO, color: ACCENT_LIT }}>
                      E-{String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[13.5px] uppercase tracking-[0.1em]" style={{ fontFamily: MONO, color: INK }}>
                      {p}
                    </span>
                  </div>
                </Rise>
              ))}
            </div>
            <DraftFrame label="MYND 03 · LAKKVINNA" className="mt-10">
              <ScanImage src={IMG.polish} alt="Lakk fægt á dökku húddi með fægivél" className="aspect-[16/10]" />
            </DraftFrame>
          </div>
          <div className="md:border-l md:pl-12" style={{ borderColor: HAIR }}>
            <Rise>
              <h3
                className="text-balance"
                style={{ fontFamily: EBOLD, fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', letterSpacing: '-0.01em', lineHeight: 1.12 }}
              >
                {BRANDS.title}
              </h3>
              <p className="mt-5 max-w-[54ch] text-[16px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {BRANDS.body}
              </p>
              <p className="mt-4 max-w-[54ch] text-[14.5px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {BRANDS.note}
              </p>
            </Rise>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { src: IMG.toyota, alt: 'Toyota' },
                { src: IMG.kia, alt: 'Kia' },
              ].map((m, i) => (
                <Rise key={m.alt} delay={i * 0.1}>
                  <div className="relative border" style={{ background: PLATE_BG, borderColor: PLATE_HAIR }}>
                    <CornerTicks />
                    <div className="flex aspect-[4/3] items-center justify-center p-8">
                      <img src={m.src} alt={m.alt} loading="lazy" decoding="async" className="max-h-14 w-auto max-w-full object-contain md:max-h-16" />
                    </div>
                    <p
                      className="border-t px-4 py-2.5 text-[10.5px] uppercase tracking-[0.22em]"
                      style={{ fontFamily: MONO, color: PLATE_MUT, borderColor: PLATE_HAIR }}
                    >
                      Vottun · {m.alt}
                    </p>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────── workshop + contact as a work-order card (blað 09) ─────────── */

function Workshop() {
  return (
    <section id="verkstaedid" className="relative scroll-mt-24 border-t" style={{ borderColor: HAIR }}>
      <div aria-hidden className="absolute inset-0" style={GRID_BG} />
      <div className="relative mx-auto max-w-[1360px] px-5 py-20 md:px-8 md:py-28">
        <SheetHead sheet="09" name="Verkstæðið" title={FACILITY.title} />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <Rise>
              <p className="max-w-[58ch] text-[16.5px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {FACILITY.body}
              </p>
            </Rise>
            <DraftFrame label="MYND 04 · VERKSTÆÐISGÓLF" note="RÉTTINGAR · MÁLUN · SMURSTÖÐ · ÞJÓNUSTA" className="mt-10">
              <ScanImage src={IMG.lift} alt="Unnið undir bíl á lyftu" className="aspect-[4/3]" />
            </DraftFrame>
          </div>

          {/* the work order: everything needed to start a job, one card */}
          <Rise delay={0.1}>
            <div className="relative border p-6 md:p-9" style={{ background: CARD, borderColor: HAIR_STRONG }}>
              <CornerTicks />
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <p className="text-[12px] uppercase tracking-[0.24em]" style={{ fontFamily: MONO, color: ACCENT_LIT }}>
                  Verkbeiðni
                </p>
                <p className="text-[11px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT }}>
                  {ADDRESS.street} · {ADDRESS.town}
                </p>
              </div>
              <div className="mt-3 h-px" style={{ background: HAIR_STRONG }} />

              <div className="mt-7 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-[10.5px] uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: MUT }}>
                    Opnunartími
                  </p>
                  <ul className="mt-3 space-y-2 text-[14.5px]" style={{ fontFamily: BODY, color: MUT }}>
                    {HOURS.map(h => (
                      <li key={h.days}>
                        <span className="font-medium" style={{ color: INK }}>
                          {h.days}
                        </span>
                        <br />
                        <span className="tabular-nums" style={{ fontFamily: MONO }}>
                          {h.close ? `${h.open}–${h.close}` : h.open}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10.5px] uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: MUT }}>
                    Starfsfólk
                  </p>
                  <ul className="mt-3 space-y-3 text-[14.5px]" style={{ fontFamily: BODY, color: MUT }}>
                    {TEAM.map(p => (
                      <li key={p.name}>
                        <span className="font-medium" style={{ color: INK }}>
                          {p.name}
                        </span>
                        <br />
                        {p.role}
                        {p.detail ? ` · ${p.detail}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-6" style={{ borderColor: HAIR }}>
                <p className="text-[13.5px]" style={{ fontFamily: BODY, color: MUT }}>
                  Smurstöðin svarar beint í{' '}
                  <a
                    href={LUBE_PHONE_HREF}
                    className="inline-flex min-h-11 items-center font-bold underline decoration-1 underline-offset-4"
                    style={{ color: INK }}
                  >
                    {LUBE_PHONE_DISPLAY}
                  </a>
                </p>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-[13.5px] font-bold underline decoration-1 underline-offset-4"
                  style={{ fontFamily: BODY, color: INK }}
                >
                  <MapPin size={15} strokeWidth={2.2} aria-hidden />
                  Opna í kortum
                </a>
              </div>

              <div className="mt-7 border-t pt-7" style={{ borderColor: HAIR }}>
                <h3
                  className="text-balance"
                  style={{ fontFamily: EBOLD, fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', letterSpacing: '-0.01em', lineHeight: 1.12 }}
                >
                  {CTA.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[15.5px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                  {CTA.body}
                </p>
                <a
                  href={PHONE_HREF}
                  className="mt-6 inline-block leading-none transition-transform duration-150 active:scale-[0.98]"
                  style={{
                    fontFamily: DISPLAY,
                    color: ACCENT_LIT,
                    fontSize: 'clamp(2.6rem, 8vw, 4.6rem)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {PHONE_DISPLAY}
                </a>
                <p className="mt-4 text-[13px]" style={{ fontFamily: MONO, color: MUT }}>
                  <a href={`mailto:${EMAIL}`} className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4" style={{ color: INK }}>
                    {EMAIL}
                  </a>
                </p>
              </div>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────── the page ─────────────────────────────── */

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    document.title = SEO.title
    setThemeColor(BG)
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', SEO.description)

    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AutoBodyShop',
      name: 'Bílageirinn',
      telephone: '+354 421 6901',
      email: EMAIL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: ADDRESS.street,
        addressLocality: 'Reykjanesbær',
        postalCode: '230',
        addressCountry: 'IS',
      },
      foundingDate: '2003',
    })
    document.head.appendChild(ld)

    return () => {
      meta?.setAttribute('content', prev)
      ld.remove()
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1 })
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
    <div className="bp-page min-h-screen antialiased" style={{ fontFamily: BODY, overflowX: 'clip' }}>
      <style>{CSS}</style>
      <Nav lenisRef={lenisRef} />
      <RulerStrip />
      <main>
        <Hero />
        <TrustStrip />
        <FactSheet />
        <Story />
        <ServiceIndex />
        <ClaimsFlow />
        <InsuranceBand />
        <VideoWall />
        <Materials />
        <Workshop />
      </main>

      <div
        className="px-5 py-5 text-center text-[11px] tracking-[0.16em]"
        style={{ fontFamily: MONO, color: MUT, borderTop: `1px solid ${HAIR}` }}
      >
        FRUMGERÐ · SNDR STUDIO
      </div>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
