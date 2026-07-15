import { useEffect, useRef, useState } from 'react'
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
  PHONE_DISPLAY,
  PHONE_HREF,
  SEO,
  SERVICES,
  STORY,
  TEAM,
  TRUST_STRIP,
} from './data'

const company = getPreviewCompany('bilageirinn')

/* ── TRUE LINE, take two. The founder is a master aircraft mechanic and a
      damaged panel has exactly one correct line — but the page says it with
      the shop itself, not a diagram: night-shift booth photography, the
      real wordmark, and one amber line that keeps getting drawn back into
      place as you scroll. Near-black ground, warm off-white ink, a single
      amber accent borrowed from the booth lights in the photos. ─── */
const BG = '#0D0E10'
const SURFACE = '#15171A'
const INK = '#F3F0EA'
const MUT = '#A9A399' /* 7:1 on BG */
const AMBER = '#E8A23D' /* 7.9:1 on BG */
const DARKINK = '#131313' /* on amber: 7.8:1 */
const HAIR = 'rgba(243,240,234,0.14)'

const DISPLAY = "'CabinetGrotesk-Black', 'Arial Black', sans-serif"
const EBOLD = "'CabinetGrotesk-Extrabold', 'Arial Black', sans-serif"
const BODY = "'Satoshi', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"

const B = import.meta.env.BASE_URL
const EASE = [0.23, 1, 0.32, 1] as const

const CSS = `
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'CabinetGrotesk-Extrabold'; src: url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Extrabold.woff2') format('woff2'), url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Extrabold.woff') format('woff'); font-weight: 800; font-style: normal; font-display: swap; }
@font-face { font-family: 'CabinetGrotesk-Black'; src: url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Black.woff2') format('woff2'), url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Black.woff') format('woff'); font-weight: 900; font-style: normal; font-display: swap; }

.bg-page { background: ${BG}; color: ${INK}; }
.bg-page ::selection { background: ${AMBER}; color: ${DARKINK}; }
.bg-page a, .bg-page button { -webkit-tap-highlight-color: transparent; }
.bg-page :focus-visible { outline: 2px solid ${AMBER}; outline-offset: 3px; border-radius: 2px; }

/* hero photo: slow settle-in on load; scrim keeps the headline zone dark */
@keyframes bg-heroZoom { from { transform: scale(1.12); } to { transform: scale(1); } }
.bg-heroimg { animation: bg-heroZoom 2.6s cubic-bezier(0.23, 1, 0.32, 1) both; }

/* trust marquee — two aria-separated copies, constant speed */
@keyframes bg-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.bg-marquee { animation: bg-marquee 46s linear infinite; }

/* hero scan: one alignment pass over the photo on load, like a laser tool
   finding the line before the headline commits to it */
@keyframes bg-scan {
  0% { transform: translateY(-40%); opacity: 0; }
  12% { opacity: 1; }
  82% { opacity: 1; }
  100% { transform: translateY(1400%); opacity: 0; }
}
.bg-scanline { animation: bg-scan 2.2s cubic-bezier(0.65, 0, 0.35, 1) 0.15s both; }

@media (prefers-reduced-motion: reduce) {
  .bg-heroimg { animation: none; }
  .bg-marquee { animation: none; }
  .bg-scanline { animation: none; display: none; }
}
`

/* ───────────────────────── shared motion helpers ───────────────────────── */

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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Image reveal: clip wipes upward while the photo settles from 1.14 → 1.
    The observer sits on an UNCLIPPED wrapper — IntersectionObserver never
    reports elements that clip/scale themselves to zero as visible. */
function ClipImage({
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
  const inView = useInView(ref, { once: true, margin: '-90px' })
  const reduced = useReducedMotion()
  if (reduced) {
    return (
      <div className={`overflow-hidden ${className ?? ''}`}>
        <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" className={`h-full w-full object-cover ${imgClassName ?? ''}`} />
      </div>
    )
  }
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="h-full w-full"
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: inView ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
        transition={{ duration: 1.15, ease: EASE }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName ?? ''}`}
          initial={{ scale: 1.14 }}
          animate={{ scale: inView ? 1 : 1.14 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
      </motion.div>
    </div>
  )
}

/** Gentle vertical drift for photos while they cross the viewport. */
function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  return (
    /* caller may position this absolutely (hero-band usage) — don't force relative */
    <div ref={ref} className={`overflow-hidden ${className?.includes('absolute') ? '' : 'relative'} ${className ?? ''}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ y: reduced ? 0 : y }}
        className="absolute inset-0 h-[118%] w-full -translate-y-[9%] object-cover"
      />
    </div>
  )
}

/** The amber line, drawn back into place when it enters the viewport.
    Observed on an unscaled wrapper (scaleX(0) has a zero-size rect and
    IntersectionObserver would never fire on it). */
function TrueLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  if (reduced) {
    return <div aria-hidden className={`h-[3px] ${className ?? ''}`} style={{ background: AMBER }} />
  }
  return (
    <div ref={ref} aria-hidden className={`h-[3px] ${className ?? ''}`}>
      <motion.div
        className="h-full w-full origin-left"
        style={{ background: AMBER }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      />
    </div>
  )
}

/** CABAS-style measurement overlay: crosshair points and the lines between
    them draw onto a real photo as it enters view. Labels are generic
    process terms only (no invented numbers/readings) — it visualizes HOW
    a panel gets measured, never claims a specific result. */
function MeasurePoints({ points }: { points: { x: number; y: number; label?: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {points.slice(1).map((p, i) => {
          const prev = points[i]
          return (
            <motion.line
              key={i}
              x1={prev.x}
              y1={prev.y}
              x2={p.x}
              y2={p.y}
              stroke={AMBER}
              strokeWidth={0.15}
              strokeDasharray="1 1.4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: inView ? 1 : 0, opacity: inView ? 0.85 : 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.15 }}
            />
          )
        })}
      </svg>
      {points.map((p, i) => (
        <motion.div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.4 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.15 }}
        >
          <span
            className="block h-2.5 w-2.5 rounded-full border"
            style={{ borderColor: AMBER, background: 'rgba(232,162,61,0.18)' }}
          />
          {p.label && (
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] tracking-[0.14em] uppercase"
              style={{ fontFamily: MONO, color: INK, textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
            >
              {p.label}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

/** Aircraft-placard styled callout — sets the aviation-precision line in
    STORY.lead ("hvert mál er mælt, hvert handtak skráð...") in its own
    mono/hairline system, reusing only words already in the verified copy. */
function SpecPlate() {
  return (
    <Rise delay={0.22}>
      <div
        className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-sm border px-5 py-3.5"
        style={{ borderColor: HAIR, background: 'rgba(232,162,61,0.06)' }}
      >
        {['MÆLT', 'SKRÁÐ', 'STENST KRÖFUR'].map((w, i, arr) => (
          <span key={w} className="flex items-center gap-x-4">
            <span className="text-[12px] tracking-[0.18em]" style={{ fontFamily: MONO, color: AMBER }}>
              {w}
            </span>
            {i < arr.length - 1 && (
              <span aria-hidden className="h-3 w-px" style={{ background: HAIR }} />
            )}
          </span>
        ))}
      </div>
    </Rise>
  )
}

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
      duration: 1.7,
      ease: EASE,
      onUpdate: v => {
        if (ref.current) ref.current.textContent = String(Math.round(v)).padStart(pad, '0') + suffix
      },
    })
    return () => controls.stop()
  }, [inView, reduced, to, pad, suffix, mv, final])
  return (
    <span ref={ref} aria-label={final}>
      {reduced || inView ? final : String(0).padStart(pad, '0') + suffix}
    </span>
  )
}

/* ─────────────────────────────── sections ─────────────────────────────── */

function Nav({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  const [solid, setSolid] = useState(false)
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
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -72 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
  const link = 'hidden items-center min-h-11 px-3 text-[13px] tracking-[0.14em] uppercase md:inline-flex'
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        background: solid ? 'rgba(13,14,16,0.86)' : 'transparent',
        backdropFilter: solid ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(14px)' : 'none',
        borderBottom: solid ? `1px solid ${HAIR}` : '1px solid transparent',
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between px-5 md:px-8">
        <a href="#" onClick={go('#efst')} className="inline-flex min-h-11 items-center" aria-label="Bílageirinn — efst á síðu">
          {/* real wordmark, printed white onto the dark ground */}
          <img src={LOGO} alt="Bílageirinn" className="h-9 w-auto" style={{ filter: 'brightness(0) invert(0.96)' }} />
        </a>
        <nav className="flex items-center gap-1 md:gap-2" style={{ fontFamily: MONO, color: MUT }}>
          <a href="#thjonusta" onClick={go('#thjonusta')} className={link}>Þjónusta</a>
          <a href="#tjon" onClick={go('#tjon')} className={link}>Tjónaviðgerðir</a>
          <a href="#verkstaedid" onClick={go('#verkstaedid')} className={link}>Verkstæðið</a>
          <a
            href={PHONE_HREF}
            className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-sm px-4 text-[14px] font-semibold"
            style={{ background: AMBER, color: DARKINK, fontFamily: BODY }}
          >
            <Phone size={15} strokeWidth={2.2} aria-hidden />
            {PHONE_DISPLAY}
          </a>
        </nav>
      </div>
    </motion.header>
  )
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const words = HERO.headline.split(' ') /* Aftur í rétta línu. */
  return (
    <section ref={ref} id="efst" className="relative flex min-h-[100svh] items-end overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: reduced ? 0 : y }}>
        <img
          src={IMG.hero}
          alt="Neistaflug við málmvinnu á dimmu verkstæði"
          className="bg-heroimg h-full w-full object-cover"
        />
      </motion.div>
      {/* alignment scan: one pass down the photo on load, an instrument
          finding the line before the headline commits to it — not a
          generic wipe, the shop's actual method (measure, then correct) */}
      {!reduced && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="bg-scanline absolute inset-x-0 top-0"
            style={{
              height: '2px',
              background: AMBER,
              boxShadow: `0 0 24px 3px rgba(232,162,61,0.65), 0 0 3px 1px ${AMBER}`,
            }}
          />
        </div>
      )}
      {/* scrim: readable headline zone without flattening the photo */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${BG} 4%, rgba(13,14,16,0.84) 26%, rgba(13,14,16,0.34) 58%, rgba(13,14,16,0.74) 100%)`,
        }}
      />
      <div className="relative mx-auto w-full max-w-[1320px] px-5 pb-16 pt-40 md:px-8 md:pb-24">
        <motion.p
          className="mb-5 text-[12.5px] tracking-[0.22em] uppercase"
          style={{ fontFamily: MONO, color: AMBER, textShadow: '0 1px 14px rgba(0,0,0,0.65)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
        >
          Réttingar · Bílamálun · Bílaþjónusta — Grófin 14a, Reykjanesbær
        </motion.p>
        <h1
          className="max-w-6xl text-balance leading-[0.98]"
          style={{ fontFamily: DISPLAY, fontSize: 'clamp(3rem, 9vw, 6rem)', letterSpacing: '-0.025em' }}
        >
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-top">
              <motion.span
                className="inline-block"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: EASE, delay: 0.35 + i * 0.09 }}
              >
                {w}
                {i < words.length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </h1>
        {/* the true line lands under the headline once the words settle */}
        <motion.div
          aria-hidden
          className="mt-5 h-[3px] max-w-xl origin-left"
          style={{ background: AMBER }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.95 }}
        />
        <motion.p
          className="mt-6 max-w-xl text-[17px] leading-relaxed md:text-lg"
          style={{ fontFamily: BODY, color: INK }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.0 }}
        >
          {HERO.sub}
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.15 }}
        >
          <a
            href={PHONE_HREF}
            className="inline-flex min-h-[52px] items-center gap-2.5 rounded-sm px-7 text-[16px] font-bold transition-transform duration-150 active:scale-[0.97]"
            style={{ background: AMBER, color: DARKINK, fontFamily: BODY }}
          >
            <Phone size={17} strokeWidth={2.4} aria-hidden />
            {HERO.ctaPrimary}
          </a>
          <a
            href="#thjonusta"
            className="inline-flex min-h-[52px] items-center rounded-sm border px-7 text-[16px] font-medium transition-transform duration-150 active:scale-[0.97]"
            style={{ borderColor: 'rgba(243,240,234,0.4)', color: INK, fontFamily: BODY }}
          >
            {HERO.ctaSecondary}
          </a>
        </motion.div>
        <motion.p
          className="mt-8 text-[13px] tracking-[0.08em]"
          style={{ fontFamily: MONO, color: MUT }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.35 }}
        >
          {HERO.cert}
        </motion.p>
      </div>
    </section>
  )
}

function Marquee() {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-12 pr-12 text-[13px] tracking-[0.2em] uppercase"
      style={{ fontFamily: MONO, color: MUT }}
    >
      {TRUST_STRIP.map(t => (
        <li key={t} className="flex items-center gap-12 whitespace-nowrap">
          <span>{t}</span>
          <span aria-hidden style={{ color: AMBER }}>—</span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="overflow-hidden border-y py-5" style={{ borderColor: HAIR }} role="marquee">
      <div className="bg-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

function Story() {
  return (
    <section className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
        <div className="flex flex-col justify-center">
          <Rise>
            <h2
              className="text-balance"
              style={{ fontFamily: EBOLD, fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '-0.02em', lineHeight: 1.04 }}
            >
              {STORY.title}
            </h2>
          </Rise>
          <TrueLine className="mt-6 w-24" delay={0.15} />
          <Rise delay={0.1}>
            <p className="mt-7 max-w-[62ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
              {STORY.lead}
            </p>
            <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
              {STORY.body}
            </p>
          </Rise>
          <SpecPlate />
        </div>
        <ClipImage
          src={IMG.booth}
          alt="Bíll afmarkaður með pappír og grunnaður í sprautuklefa"
          className="aspect-[4/5] rounded-sm md:aspect-auto md:min-h-[540px]"
        />
      </div>

      {/* the shop's own line through time */}
      <div className="mt-20 md:mt-28">
        <TrueLine className="mb-10 w-full opacity-80" />
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {STORY.timeline.map((t, i) => (
            <Rise key={t.year} delay={i * 0.12}>
              <p style={{ fontFamily: MONO, color: AMBER }} className="text-[15px] tracking-[0.14em]">
                {t.year}
              </p>
              <p className="mt-3 max-w-[46ch] text-[15.5px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {t.text}
              </p>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

function Facts() {
  return (
    <section className="border-y" style={{ borderColor: HAIR, background: SURFACE }}>
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-x-6 gap-y-12 px-5 py-16 md:grid-cols-4 md:px-8 md:py-20">
        {FACTS.map((f, i) => (
          <Rise key={f.label} delay={i * 0.08}>
            <p style={{ fontFamily: MONO, color: INK, fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }} className="leading-none tabular-nums">
              {f.num !== null ? <CountUp to={f.num} pad={f.pad} suffix={f.suffix} /> : f.text}
            </p>
            <p className="mt-3 text-[13px] tracking-[0.12em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
              {f.label}
            </p>
          </Rise>
        ))}
      </div>
    </section>
  )
}

/** Editorial service index: type-led rows on the left, one photo panel that
    crossfades per active service. On mobile the panel sits above the list. */
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

function ServiceIndex() {
  const [active, setActive] = useState(0)
  return (
    <section id="thjonusta" className="mx-auto max-w-[1320px] scroll-mt-20 px-5 py-24 md:px-8 md:py-36">
      <Rise>
        <p className="text-[13px] tracking-[0.22em] uppercase" style={{ fontFamily: MONO, color: AMBER }}>
          Þjónustan í Grófinni
        </p>
        <h2
          className="mt-4 max-w-3xl text-balance"
          style={{ fontFamily: EBOLD, fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '-0.02em', lineHeight: 1.04 }}
        >
          Allt undir sama þaki, frá tjóni að lokafrágangi
        </h2>
      </Rise>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.15fr_1fr] md:gap-16">
        {/* photo panel — first on mobile so the tap result is visible */}
        <div className="order-first md:order-last">
          <div className="relative aspect-video overflow-hidden rounded-sm md:sticky md:top-24 md:aspect-[4/5]">
            <AnimatePresence initial={false}>
              <motion.img
                key={active}
                src={SERVICE_IMGS[active]}
                alt={SERVICE_ALTS[active]}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            </AnimatePresence>
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: 'linear-gradient(to top, rgba(13,14,16,0.7), transparent)' }}
            />
            <p
              className="absolute bottom-4 left-5 text-[13px] tracking-[0.16em] uppercase"
              style={{ fontFamily: MONO, color: INK }}
            >
              {SERVICES[active].tag}
            </p>
          </div>
        </div>

        <ul className="border-t" style={{ borderColor: HAIR }}>
          {SERVICES.map((s, i) => {
            const on = i === active
            return (
              <li key={s.name} className="border-b" style={{ borderColor: HAIR }}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={on}
                  className="group flex w-full items-baseline gap-5 py-5 text-left md:py-6"
                >
                  <span
                    className="w-8 shrink-0 text-[13px] tabular-nums transition-colors duration-300"
                    style={{ fontFamily: MONO, color: on ? AMBER : MUT }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="block transition-transform duration-500 group-hover:translate-x-1.5"
                      style={{
                        fontFamily: EBOLD,
                        fontSize: 'clamp(1.35rem, 2.6vw, 2rem)',
                        letterSpacing: '-0.01em',
                        color: on ? INK : MUT,
                        transitionProperty: 'transform, color',
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
                          transition={{ duration: 0.45, ease: EASE }}
                        >
                          <span
                            className="block max-w-[52ch] pt-2.5 text-[15px] leading-relaxed"
                            style={{ fontFamily: BODY, color: MUT }}
                          >
                            {s.desc}
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <Rise delay={0.1}>
        <p className="mt-10 text-[14px]" style={{ fontFamily: BODY, color: MUT }}>
          Smurstöðin svarar beint í{' '}
          <a
            href={LUBE_PHONE_HREF}
            className="inline-flex min-h-11 items-center font-semibold underline decoration-1 underline-offset-4"
            style={{ color: INK }}
          >
            {LUBE_PHONE_DISPLAY}
          </a>
        </p>
      </Rise>
    </section>
  )
}

function Claims() {
  const railRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 0.75', 'end 0.75'] })
  return (
    <section id="tjon" className="scroll-mt-20 border-t" style={{ borderColor: HAIR, background: SURFACE }}>
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-36">
        <div className="grid gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
          <div>
            <Rise>
              <p className="text-[13px] tracking-[0.22em] uppercase" style={{ fontFamily: MONO, color: AMBER }}>
                Tjónaviðgerðir
              </p>
              <h2
                className="mt-4 text-balance"
                style={{ fontFamily: EBOLD, fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '-0.02em', lineHeight: 1.04 }}
              >
                {INSURANCE.title}
              </h2>
              <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {INSURANCE.body}
              </p>
              <p className="mt-7 text-[13px] tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                {INSURANCE.companies.join(' · ')}
              </p>
            </Rise>
            <div className="relative mt-12 hidden md:block">
              <ClipImage src={IMG.malun} alt="Unnið við bíl í málningarklefa" className="aspect-[4/3] rounded-sm" />
              <MeasurePoints
                points={[
                  { x: 22, y: 34, label: 'Mælipunktur' },
                  { x: 58, y: 22, label: 'Viðmiðunarlína' },
                  { x: 74, y: 58, label: 'Mælipunktur' },
                ]}
              />
            </div>
          </div>

          {/* the claim's own line: fills as each step passes */}
          <div ref={railRef} className="relative pl-8 md:pl-10">
            <div aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px md:left-[7px]" style={{ background: HAIR }} />
            <motion.div
              aria-hidden
              className="absolute bottom-2 left-[5px] top-2 w-px origin-top md:left-[7px]"
              style={{ background: AMBER, scaleY: scrollYProgress }}
            />
            <ol className="space-y-12 md:space-y-16">
              {CLAIM_STEPS.map((s, i) => (
                <li key={s.title} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-8 top-2 block h-2.5 w-2.5 rounded-full md:-left-10 md:h-3 md:w-3"
                    style={{ background: s.highlight ? AMBER : BG, border: `2px solid ${s.highlight ? AMBER : MUT}` }}
                  />
                  <Rise delay={i * 0.06}>
                    <div
                      className={s.highlight ? 'rounded-sm border p-5 md:p-6' : undefined}
                      style={s.highlight ? { borderColor: 'rgba(232,162,61,0.4)', background: 'rgba(232,162,61,0.07)' } : undefined}
                    >
                      <p className="text-[13px] tracking-[0.16em]" style={{ fontFamily: MONO, color: AMBER }}>
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <h3
                        className="mt-2"
                        style={{
                          fontFamily: EBOLD,
                          fontSize: s.highlight ? 'clamp(1.6rem, 2.8vw, 2.2rem)' : 'clamp(1.4rem, 2.4vw, 1.9rem)',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {s.title}
                      </h3>
                      <p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                        {s.desc}
                      </p>
                      {s.highlight && (
                        <p
                          className="mt-4 inline-flex items-center rounded-sm px-3.5 py-2 text-[13.5px] font-semibold"
                          style={{ background: AMBER, color: DARKINK, fontFamily: BODY }}
                        >
                          Innifalið hjá Bílageiranum
                        </p>
                      )}
                    </div>
                  </Rise>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

function Craft() {
  return (
    <section className="relative overflow-hidden">
      <ParallaxImage src={IMG.polish} alt="Lakk fægt á dökku húddi með fægivél" className="absolute inset-0" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'rgba(13,14,16,0.78)' }} />
      <div className="relative mx-auto max-w-[1320px] px-5 py-28 md:px-8 md:py-44">
        <div className="max-w-2xl">
          <Rise>
            <h2
              className="text-balance"
              style={{ fontFamily: EBOLD, fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '-0.02em', lineHeight: 1.04 }}
            >
              {CRAFT.title}
            </h2>
          </Rise>
          <TrueLine className="mt-6 w-24" delay={0.15} />
          <Rise delay={0.1}>
            <p className="mt-7 text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
              {CRAFT.body}
            </p>
          </Rise>
          <ul className="mt-9 space-y-3">
            {CRAFT.points.map((p, i) => (
              <Rise key={p} delay={0.15 + i * 0.08}>
                <li className="flex items-center gap-4 text-[15px]" style={{ fontFamily: MONO, color: INK }}>
                  <span aria-hidden className="h-px w-8" style={{ background: AMBER }} />
                  {p}
                </li>
              </Rise>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Brands() {
  return (
    <section className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-36">
      <div className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
        <div>
          <Rise>
            <p className="text-[13px] tracking-[0.22em] uppercase" style={{ fontFamily: MONO, color: AMBER }}>
              Viðurkennt þjónustuverkstæði
            </p>
            <h2
              className="mt-4 text-balance"
              style={{ fontFamily: EBOLD, fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '-0.02em', lineHeight: 1.04 }}
            >
              {BRANDS.title}
            </h2>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
              {BRANDS.body}
            </p>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
              {BRANDS.note}
            </p>
          </Rise>
        </div>
        {/* the marks as workshop signage plates */}
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {[
            { src: IMG.toyota, alt: 'Toyota' },
            { src: IMG.kia, alt: 'Kia' },
          ].map((m, i) => (
            <Rise key={m.alt} delay={i * 0.1}>
              <div
                className="flex aspect-[4/3] items-center justify-center rounded-sm p-8"
                style={{ background: INK }}
              >
                <img src={m.src} alt={m.alt} loading="lazy" decoding="async" className="max-h-16 w-auto max-w-full object-contain md:max-h-20" />
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

function Workshop() {
  return (
    <section id="verkstaedid" className="scroll-mt-20 border-t" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-36">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <ClipImage
            src={IMG.garage}
            alt="Bílar á lyftum á dimmu verkstæðisgólfi"
            className="aspect-[4/3] rounded-sm md:aspect-auto md:min-h-[520px]"
          />
          <div className="flex flex-col justify-center">
            <Rise>
              <h2
                className="text-balance"
                style={{ fontFamily: EBOLD, fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '-0.02em', lineHeight: 1.04 }}
              >
                {FACILITY.title}
              </h2>
              <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {FACILITY.body}
              </p>
            </Rise>

            <div className="mt-10 border-t" style={{ borderColor: HAIR }}>
              {TEAM.map((p, i) => (
                <Rise key={p.name} delay={i * 0.07}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-4" style={{ borderColor: HAIR }}>
                    <p className="text-[16.5px] font-bold" style={{ fontFamily: BODY, color: INK }}>
                      {p.name}
                    </p>
                    <p className="text-[13px] tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                      {p.role}
                      {p.detail ? ` · ${p.detail}` : ''}
                    </p>
                  </div>
                </Rise>
              ))}
            </div>

            <Rise delay={0.2}>
              <div className="mt-9 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-[12.5px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: AMBER }}>
                    Opnunartími
                  </p>
                  <ul className="mt-3 space-y-1.5 text-[15px]" style={{ fontFamily: BODY, color: MUT }}>
                    {HOURS.map(h => (
                      <li key={h.days}>
                        <span style={{ color: INK }}>{h.days}</span>
                        {'  '}
                        {h.close ? `${h.open}–${h.close}` : h.open}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[12.5px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: AMBER }}>
                    Staðsetning
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                    <span style={{ color: INK }}>{ADDRESS.street}</span>
                    <br />
                    {ADDRESS.town}
                  </p>
                  <a
                    href={MAPS}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold underline decoration-1 underline-offset-4"
                    style={{ fontFamily: BODY, color: INK }}
                  >
                    <MapPin size={15} strokeWidth={2.2} aria-hidden />
                    Opna í kortum
                  </a>
                </div>
              </div>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="hafa-samband" className="relative overflow-hidden border-t" style={{ borderColor: HAIR }}>
      <ParallaxImage src={IMG.headlight} alt="Aðalljós á dökkum bíl í myrkri" className="absolute inset-0" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'rgba(13,14,16,0.85)' }} />
      <div className="relative mx-auto max-w-[1320px] px-5 py-28 text-center md:px-8 md:py-44">
        <Rise>
          <h2 className="text-balance" style={{ fontFamily: EBOLD, fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', letterSpacing: '-0.02em' }}>
            {CTA.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
            {CTA.body}
          </p>
        </Rise>
        <Rise delay={0.12}>
          <a
            href={PHONE_HREF}
            className="mt-10 inline-block leading-none transition-transform duration-150 active:scale-[0.98]"
            style={{ fontFamily: DISPLAY, color: AMBER, fontSize: 'clamp(3rem, 11vw, 6rem)', letterSpacing: '-0.02em' }}
          >
            {PHONE_DISPLAY}
          </a>
        </Rise>
        <Rise delay={0.2}>
          <div className="mt-8 flex flex-col items-center gap-1 text-[14px]" style={{ fontFamily: MONO, color: MUT }}>
            <p>
              Smurstöðin:{' '}
              <a href={LUBE_PHONE_HREF} className="inline-flex min-h-11 items-center font-semibold" style={{ color: INK }}>
                {LUBE_PHONE_DISPLAY}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4"
                style={{ color: INK }}
              >
                {EMAIL}
              </a>
            </p>
            <p className="mt-1">Mán–fim 08:00–17:00 · Fös 08:00–15:00 · Lokað um helgar</p>
          </div>
        </Rise>
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
      address: { '@type': 'PostalAddress', streetAddress: ADDRESS.street, addressLocality: 'Reykjanesbær', postalCode: '230', addressCountry: 'IS' },
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
    <div className="bg-page min-h-screen antialiased" style={{ fontFamily: BODY }}>
      <style>{CSS}</style>
      <Nav lenisRef={lenisRef} />
      <main>
        <Hero />
        <Marquee />
        <Story />
        <Facts />
        <ServiceIndex />
        <Claims />
        <Craft />
        <Brands />
        <Workshop />
        <Contact />
      </main>

      <div className="px-5 py-5 text-center text-[11px] tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT, borderTop: `1px solid ${HAIR}` }}>
        FRUMGERÐ · SNDR STUDIO
      </div>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
