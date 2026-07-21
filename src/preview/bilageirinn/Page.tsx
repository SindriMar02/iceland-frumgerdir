import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode, RefObject } from 'react'
import Lenis from 'lenis'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { Car, Check, Copy, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import BilageirinnLoading from './Loading'
import { STRINGS, type Lang, type Review, type Strings } from './translations'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  EMAIL,
  IMG,
  LUBE_PHONE_DISPLAY,
  LUBE_PHONE_HREF,
  MAPS,
  PHONE_DISPLAY,
  PHONE_HREF,
  SEO,
  SERVICES,
} from './data'

const company = getPreviewCompany('bilageirinn')

/* ── TRUE LINE, take two. The founder is a master aircraft mechanic and a
      damaged panel has exactly one correct line — but the page says it with
      the shop itself, not a diagram: night-shift booth photography, the
      real wordmark, and one amber line that keeps getting drawn back into
      place as you scroll. Warm near-black ground, warm off-white
      ink, a single amber accent borrowed from the booth lights. Geometry is
      round throughout (2026-07-21): pill controls, generously radiused media
      and cards — the softer counterpart to the precision the copy claims. ─── */
const BG = '#0F0D0B'
const SURFACE = '#1A1613'
const INK = '#F3F0EA'
const MUT = '#A9A399' /* 7:1 on BG */
const AMBER = '#E8A23D' /* 7.9:1 on BG */
const DARKINK = '#131313' /* on amber: 7.8:1 */
const HAIR = 'rgba(243,240,234,0.14)'

/* Type system v4 (2026-07-21): the SNDR Studio pairing — Projekt Blackbird
   display + Archia body + Geist Mono chrome. Blackbird ships no Icelandic;
   SNDR extended its UPPERCASE set in-house but missed Æ, so this build adds
   Æ composed from the font's own A and E (tools/build-blackbird-ae.py).
   Blackbird still has no lowercase accents, which is why SNDR's rule is
   "display stays UPPERCASE" — every display style here sets text-transform
   accordingly. Earlier: Cabinet Grotesk, Panchang, Clash Display. */
const DISPLAY = "'Projekt Blackbird', 'Arial Black', sans-serif"
const EBOLD = "'Projekt Blackbird', 'Arial Black', sans-serif"
const BODY = "'Archia', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"

const B = import.meta.env.BASE_URL
/* Rebrand-concept icon, previewed on v2 only per Sindri's 2026-07-15 request — NOT
   the real logo.png (used everywhere else: nav on the other 3 concepts, footer).
   Background removed + cropped from a generated still; the wordmark is set as
   real type elsewhere (never baked into the image — the generated art's own
   text had a broken þ). Swap back to LOGO/the real nav markup if this doesn't land. */
const ICON_CONCEPT = `${B}preview/bilageirinn/icon-concept.png`
const EASE = [0.23, 1, 0.32, 1] as const

const CSS = `
@font-face { font-family: 'Archia'; src: url('${B}fonts/archia/Archia-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Projekt Blackbird'; src: url('${B}fonts/blackbird/ProjektBlackbirdIS-ext.otf') format('opentype'); font-weight: 400 700; font-style: normal; font-display: swap; }

.bg-page { background: ${BG}; color: ${INK}; }
.bg-page ::selection { background: ${AMBER}; color: ${DARKINK}; }
.bg-page a, .bg-page button { -webkit-tap-highlight-color: transparent; }
.bg-page :focus-visible { outline: 2px solid ${AMBER}; outline-offset: 3px; border-radius: 9999px; }

/* hero background crossfade: each frame drifts slowly the whole time it's
   visible — a placeholder for real workshop video, not a static photo.
   8.4s covers the 6.5s dwell + 1.6s fade with margin so motion never
   freezes mid-crossfade; consecutive frames drift opposite directions. */
@keyframes bg-hero-kb { from { transform: scale(1.08) translate(0, 0); } to { transform: scale(1.16) translate(-1%, -1%); } }
.bg-hero-kb { animation: bg-hero-kb 8.4s linear both; }
@keyframes bg-hero-kb-alt { from { transform: scale(1.08) translate(0, 0); } to { transform: scale(1.16) translate(1%, -1%); } }
.bg-hero-kb-alt { animation: bg-hero-kb-alt 8.4s linear both; }

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
  .bg-hero-kb { animation: none; }
  .bg-hero-kb-alt { animation: none; }
  .bg-marquee { animation: none; }
  .bg-scanline { animation: none; display: none; }
}

/* hover micro-interactions — quick, restrained, precision-brand easing.
   Kept separate from the entrance-motion system above: these only ever
   run in response to pointer/focus, never delay first paint. */
.bg-navlink { position: relative; transition: color 0.2s cubic-bezier(0.4,0,0.2,1); }
.bg-navlink::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 9px;
  height: 1px;
  background: ${AMBER};
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
}
.bg-navlink:hover, .bg-navlink:focus-visible { color: ${INK}; }
.bg-navlink:hover::after, .bg-navlink:focus-visible::after { transform: scaleX(1); }

/* ── one hover language for every button ──────────────────────────────
   A soft band of light glides across the button on hover — the look of a
   booth light travelling over a freshly painted panel, which is the shop's
   whole promise. It's a background-image gradient animated by
   background-position, so it rides ABOVE the fill but BELOW the label with
   no z-index juggling, follows the pill radius for free (backgrounds clip
   to it), and the travel time is width-relative so it always crosses at the
   same graceful pace. Paired with a feather-light rise + soft shadow.
   (Solid buttons set backgroundColor, not the background shorthand, so this
   image layer survives the inline style.) Earlier tries: radial ink-flood +
   label swap, then a true-line underline — both replaced by this. */
.bg-btn {
  position: relative;
  background-repeat: no-repeat;
  background-size: 220% 100%;
  background-position: 118% 0;
  transition: background-position 0.6s cubic-bezier(0.33,1,0.68,1),
    transform 0.35s cubic-bezier(0.33,1,0.68,1), box-shadow 0.35s cubic-bezier(0.33,1,0.68,1),
    border-color 0.3s cubic-bezier(0.4,0,0.2,1);
}
.bg-btn-solid { background-image: linear-gradient(100deg, transparent 32%, rgba(255,255,255,0.4) 50%, transparent 68%); }
.bg-btn-ghost { background-image: linear-gradient(100deg, transparent 34%, rgba(243,240,234,0.16) 50%, transparent 66%); }
.bg-btn:hover, .bg-btn:focus-visible { background-position: -18% 0; }
.bg-btn-solid:hover, .bg-btn-solid:focus-visible {
  transform: translateY(-1px); box-shadow: 0 10px 26px -12px rgba(232,162,61,0.65);
}
.bg-btn-ghost:hover, .bg-btn-ghost:focus-visible {
  transform: translateY(-1px); border-color: rgba(243,240,234,0.7);
  box-shadow: 0 10px 26px -14px rgba(0,0,0,0.9);
}
.bg-btn:active { transform: translateY(0); transition-duration: 0.08s; }
.bg-btn:disabled { opacity: 0.6; cursor: default; transform: none; box-shadow: none; background-position: 118% 0; }

.bg-cta-display { display: inline-block; transition: filter 0.25s cubic-bezier(0.4,0,0.2,1); }
.bg-cta-display:hover { filter: brightness(1.12); }

.bg-link-hover { transition: color 0.2s cubic-bezier(0.4,0,0.2,1); }
.bg-link-hover:hover, .bg-link-hover:focus-visible { color: ${AMBER} !important; }

/* round cards read flat on a near-black ground; one lit top edge plus a
   deep soft drop gives them a physical lift without a visible box */
.bg-soft {
  box-shadow: inset 0 1px 0 rgba(243,240,234,0.06), 0 22px 44px -30px rgba(0,0,0,0.95);
}

.bg-brand-mark img { opacity: 0.92; transition: opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1); }
.bg-brand-mark:hover img { opacity: 1; transform: scale(1.04); }

/* fake a dark map theme with no API key: invert the light tiles, then
   rotate hue back so roads/water read close to their normal colours */
.bg-map-dark { filter: invert(92%) hue-rotate(180deg) contrast(0.86) brightness(0.94) saturate(0.65); }

/* reviews marquee: two identical rows drift left; the whole strip pauses
   on hover so quotes stay readable the moment the cursor arrives */
@keyframes bgRevScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.bg-rev-track { animation: bgRevScroll 55s linear infinite; }
.bg-rev-marquee:hover .bg-rev-track { animation-play-state: paused; }
.bg-rev-marquee {
  -webkit-mask-image: linear-gradient(to right, transparent, black 7%, black 93%, transparent);
  mask-image: linear-gradient(to right, transparent, black 7%, black 93%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .bg-rev-track { animation: none; }
}

/* contact form: sleek inputs on the dark card, amber focus, no browser chrome */
.bg-field {
  background: rgba(243,240,234,0.05);
  border: 1px solid rgba(243,240,234,0.16);
  color: ${INK};
  transition: border-color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1);
}
.bg-field::placeholder { color: ${MUT}; }
.bg-field:hover { border-color: rgba(243,240,234,0.28); }
.bg-field:focus { outline: none; border-color: ${AMBER}; background: rgba(243,240,234,0.08); }
.bg-field:invalid[data-touched="true"] { border-color: rgba(224,110,110,0.7); }

@media (prefers-reduced-motion: reduce) {
  .bg-navlink::after { transition: none; display: none; }
  .bg-btn { transition: none; }
  .bg-btn:hover, .bg-btn:focus-visible { background-position: 118% 0; transform: none; }
  .bg-btn:active { transform: none; }
}
`

/* ───────────────────────── shared motion helpers ───────────────────────── */

/** Section kicker: mono label with a short amber line segment carrying the
    accent — full-amber text is rationed to the hero eyebrow, the numbers,
    and actual actions so the accent reads as signal, not wallpaper. */
function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[13px] tracking-[0.22em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
      <span aria-hidden className="inline-block h-px w-5 shrink-0" style={{ background: AMBER }} />
      {children}
    </p>
  )
}

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

/** Image reveal: a single clip-path wipe, nothing else moving at the same
    time (the earlier version also scaled the photo 1.14 → 1 underneath the
    wipe — two motions competing on one image — trimmed to just the wipe).
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
        transition={{ duration: 1, ease: EASE }}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName ?? ''}`}
        />
      </motion.div>
    </div>
  )
}

/** True below md. Motion that reads as atmosphere on a large screen reads
    as noise on a phone, so the hero's photo cycling, its Ken Burns drift,
    the alignment scan and the reviews auto-marquee are all gated on this. */
function useNarrow() {
  const q = '(max-width: 767px)'
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
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
  const { t } = useT()
  return (
    <Rise delay={0.22}>
      <div
        className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-full border px-6 py-3.5"
        style={{ borderColor: HAIR, background: 'rgba(232,162,61,0.06)' }}
      >
        {t.ui.specPlate.map((w, i, arr) => (
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

/* ─────────────────────────── language context ─────────────────────────── */

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Strings }>({
  lang: 'is',
  setLang: () => {},
  t: STRINGS.is,
})
const useT = () => useContext(LangCtx)

/* ─────────────────────────────── sections ─────────────────────────────── */

function Nav({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  const { lang, setLang, t } = useT()
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
  /* nav (incl. the phone CTA) renders fully visible from first paint —
     a worried customer must never wait on an entrance animation to find
     the number. Only the scroll-solid background transitions. */
  const link = 'bg-navlink hidden items-center min-h-11 px-3 text-[13px] tracking-[0.14em] uppercase md:inline-flex'
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  /* menu open: freeze the page behind it (Lenis + native scroll) */
  useEffect(() => {
    if (!open) return
    lenisRef.current?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      lenisRef.current?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, lenisRef])
  const goMobile = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    /* wait one frame so the scroll lock is released before Lenis scrolls */
    requestAnimationFrame(() => {
      const el = document.querySelector(hash)
      if (!el) return
      if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -72 })
      else el.scrollIntoView({ behavior: 'smooth' })
    })
  }
  const menuItems = [
    { hash: '#thjonusta', label: t.ui.navServices },
    { hash: '#tjon', label: t.ui.navClaims },
    { hash: '#verkstaedid', label: t.ui.navWorkshop },
    { hash: '#hafa-samband', label: t.ui.contactCta },
  ]
  const langToggle = (large: boolean) => (
    <div
      className={`flex shrink-0 items-center ${large ? 'gap-1 text-[15px]' : 'gap-0.5 text-[12px] md:ml-1'} tracking-[0.1em]`}
      style={{ fontFamily: MONO }}
    >
      {(['is', 'en'] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden style={{ color: MUT, opacity: 0.5 }}>/</span>}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            aria-label={l === 'is' ? 'Íslenska' : 'English'}
            className={`bg-navlink inline-flex min-h-11 items-center uppercase ${large ? 'px-2' : 'px-1 md:px-1.5'}`}
            style={{ color: lang === l ? AMBER : MUT, fontWeight: lang === l ? 600 : 400 }}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  )
  return (
    <>
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        background: solid || open ? 'rgba(15,13,11,0.86)' : 'transparent',
        backdropFilter: solid || open ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: solid || open ? 'blur(14px)' : 'none',
        borderBottom: solid || open ? `1px solid ${HAIR}` : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between gap-3 px-4 md:px-8">
        <a href="#" onClick={go('#efst')} className="inline-flex min-h-11 shrink-0 items-center gap-2 md:gap-2.5" aria-label={t.ui.navTopAria}>
          {/* REBRAND CONCEPT PREVIEW, not the real mark — icon closely matches
              the real logo's own swoosh+headlight shape, previewed here only
              to pitch before touching the real logo.png used everywhere else
              on the site. Wordmark is real type, not baked into the image —
              the generated art's own text had a broken þ. */}
          <img src={ICON_CONCEPT} alt="" className="h-7 w-auto md:h-8" style={{ filter: 'brightness(0) invert(0.96)' }} />
          {/* clamp keeps the wordmark from colliding with the toggle on
              narrow phones — the row is width-critical at 390px */}
          <span style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(16px, 4.4vw, 19px)', fontWeight: 400, color: INK, letterSpacing: '0.02em' }}>
            Bílageirinn
          </span>
        </a>
        <nav className="flex items-center gap-1 md:gap-2" style={{ fontFamily: MONO, color: MUT }}>
          <a href="#thjonusta" onClick={go('#thjonusta')} className={link}>{t.ui.navServices}</a>
          <a href="#tjon" onClick={go('#tjon')} className={link}>{t.ui.navClaims}</a>
          <a href="#verkstaedid" onClick={go('#verkstaedid')} className={link}>{t.ui.navWorkshop}</a>
          {/* language toggle lives in the header on desktop; on mobile it
              moves inside the menu so the row stays three items */}
          <div className="hidden md:block">{langToggle(false)}</div>
          {/* phone CTA is desktop-only in the header — on mobile it lives in
              the hamburger menu's bottom bar, so the header row stays to
              logo + burger and doesn't compete with the menu's own CTA */}
          <a
            href={PHONE_HREF}
            className="bg-btn bg-btn-solid ml-2 hidden min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 text-[14px] font-semibold md:inline-flex"
            style={{ backgroundColor: AMBER, color: DARKINK, fontFamily: BODY }}
          >
            <Phone size={15} strokeWidth={2.2} aria-hidden />
            {PHONE_DISPLAY}
          </a>
          {/* hamburger: two lines that align into an X — the true-line
              vocabulary applied to the one mechanical control on the page */}
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-label={open ? t.ui.menuClose : t.ui.menuOpen}
            className="relative ml-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center md:hidden"
          >
            <span
              aria-hidden
              className="absolute h-[2px] w-[22px] transition-transform duration-300"
              style={{
                background: AMBER,
                transform: open ? 'rotate(45deg)' : 'translateY(-4px)',
                transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
              }}
            />
            <span
              aria-hidden
              className="absolute h-[2px] w-[22px] transition-transform duration-300"
              style={{
                background: INK,
                transform: open ? 'rotate(-45deg)' : 'translateY(4px)',
                transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          </button>
        </nav>
      </div>
    </header>

    {/* mobile menu: full-screen coal overlay, links rise out of masks the
        same way the hero headline does, one true line drawn beneath.
        Rendered as a SIBLING of the header, never inside it: the header's
        backdrop-filter makes it the containing block for fixed
        descendants, which squeezed an in-header overlay to zero height. */}
    <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto pt-[68px] md:hidden"
            style={{ background: BG }}
          >
            <nav className="flex flex-1 flex-col justify-center gap-1 px-6 py-10">
              {menuItems.map((item, i) => (
                <div key={item.hash} className="overflow-hidden py-1">
                  <motion.a
                    href={item.hash}
                    onClick={goMobile(item.hash)}
                    className="block"
                    initial={reduced ? undefined : { y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%', transition: { duration: 0.2, ease: 'easeIn', delay: (menuItems.length - 1 - i) * 0.03 } }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.08 + i * 0.06 }}
                    style={{
                      fontFamily: EBOLD, textTransform: 'uppercase',
                      fontSize: 'clamp(2rem, 9vw, 2.8rem)',
                      letterSpacing: '-0.02em',
                      color: INK,
                      lineHeight: 1.15,
                    }}
                  >
                    {item.label}
                  </motion.a>
                </div>
              ))}
              <motion.div
                aria-hidden
                className="mt-6 h-[3px] w-24 origin-left"
                style={{ background: AMBER }}
                initial={reduced ? undefined : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.32 }}
              />
            </nav>
            <motion.div
              className="flex items-center justify-between gap-4 border-t px-6 py-5"
              style={{ borderColor: HAIR }}
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}
            >
              {langToggle(true)}
              <a
                href={PHONE_HREF}
                className="bg-btn bg-btn-solid inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-5 text-[14px] font-semibold"
                style={{ backgroundColor: AMBER, color: DARKINK, fontFamily: BODY }}
              >
                <Phone size={15} strokeWidth={2.2} aria-hidden />
                {PHONE_DISPLAY}
              </a>
            </motion.div>
          </motion.div>
        )}
    </AnimatePresence>
    </>
  )
}

/** Background "footage" for the hero: a slow crossfade through real vetted
    workshop photos with a continuous drift, standing in for real video of
    the shop until that footage exists — same scrim/shadow system below
    sits on top regardless, so swapping in a real <video> later is a
    one-line change. Freezes on the first frame under reduced motion. */
const HERO_BG_PHOTOS = [IMG.hero, IMG.booth, IMG.garage]
function HeroBackground({ reduced, running }: { reduced: boolean; running: boolean }) {
  const { t } = useT()
  const narrow = useNarrow()
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (reduced || narrow || !running) return
    const id = window.setInterval(() => {
      // don't burn crossfades in a backgrounded tab
      if (document.hidden) return
      setActive(a => (a + 1) % HERO_BG_PHOTOS.length)
    }, 6500)
    return () => window.clearInterval(id)
  }, [reduced, narrow, running])
  if (reduced || narrow) {
    return (
      <div className="absolute inset-0">
        <img src={HERO_BG_PHOTOS[0]} alt={t.ui.heroAlts[0]} className="h-full w-full object-cover" />
      </div>
    )
  }
  return (
    <div className="absolute inset-0">
      <AnimatePresence initial={false}>
        <motion.img
          key={active}
          src={HERO_BG_PHOTOS[active]}
          alt={t.ui.heroAlts[active]}
          className={`${active % 2 ? 'bg-hero-kb-alt' : 'bg-hero-kb'} absolute inset-0 h-full w-full object-cover`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: 'linear' }}
        />
      </AnimatePresence>
    </div>
  )
}

function Hero({ lenisRef, start }: { lenisRef: RefObject<Lenis | null>; start: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const narrow = useNarrow()
  const heroInView = useInView(ref, { amount: 0.1 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  /* Slogan: the collision-repair category's proven promise (CARSTAR
     "where accidents UNHAPPEN", Caliber "restoring the rhythm of your
     life") in native idiom — the accident gets erased. Deliberately NOT
     "eins og nýr", which two competitors (Hjörtur, AutoCenter) already
     lean on. History: "Aftur í rétta línu." -> "Mælt. Rétt. Í lagi."
     (process jargon) -> "Eins og úr verksmiðjunni." (too close to the
     eins-og-nýr cliché family). Local to this page; data.ts's
     HERO.headline stays the source of truth for the other 3 concepts. */
  const { t } = useT()
  const words = t.ui.slogan.split(' ')
  const goTo = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.querySelector(hash)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -72 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
  /* Entrance choreography is gated on `start` (the loading overlay's
     assetsReady handoff) — previously the whole sequence played hidden
     behind the overlay and visitors landed on an already-settled page.
     Reduced motion keeps the plain immediate render. */
  const on = reduced || start
  return (
    <section ref={ref} id="efst" className="relative flex min-h-[100svh] items-end overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: reduced ? 0 : y }}>
        <HeroBackground reduced={!!reduced} running={on && heroInView} />
      </motion.div>
      {/* alignment scan: one pass down the photo, an instrument finding the
          line before the headline commits to it. Mounted only at handoff so
          its animation clock starts when the overlay starts thinning — the
          amber scan emerges through the fading loader. */}
      {!reduced && !narrow && start && (
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
      {/* scrim + a top-down band for the nav — the background now cycles
          through several photos, so legibility can't depend on any one of
          them being conveniently dark exactly where the text sits */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${BG} 4%, rgba(15,13,11,0.88) 24%, rgba(15,13,11,0.42) 56%, rgba(15,13,11,0.8) 100%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40"
        style={{ background: 'linear-gradient(to bottom, rgba(9,10,11,0.7), transparent)' }}
      />
      <div className="relative mx-auto w-full max-w-[1320px] px-5 pb-16 pt-40 md:px-8 md:pb-24">
        <motion.p
          className="mb-5 text-[12.5px] tracking-[0.22em] uppercase"
          style={{ fontFamily: MONO, color: AMBER, textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
        >
          <span className="md:hidden">{t.ui.heroKickerShort}</span>
          <span className="hidden md:inline">{t.ui.heroKicker}</span>
        </motion.p>
        <h1
          className="max-w-6xl text-balance leading-[0.98]"
          style={{
            fontFamily: DISPLAY, textTransform: 'uppercase',
            fontSize: 'clamp(3rem, 9vw, 6rem)',
            letterSpacing: '0.005em',
            filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.6))',
          }}
        >
          {words.map((w, i) => (
            /* pt/-mt pair keeps the mask box tall enough that Í's acute
               never clips against the overflow-hidden edge */
            <span key={i} className="-mt-2 inline-block overflow-hidden pb-1 pt-2 align-top">
              <motion.span
                className="inline-block"
                initial={{ y: '118%' }}
                animate={on ? { y: '0%' } : { y: '118%' }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.05 }}
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
          animate={on ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
        />
        <motion.p
          className="mt-6 max-w-xl text-[17px] leading-relaxed md:text-lg"
          style={{ fontFamily: BODY, color: INK, textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
        >
          {t.hero.sub}
        </motion.p>
        {/* CTA row renders visible immediately (no entrance gating) — a
            worried crash customer must be able to act the instant the page
            paints. The call lives in the nav's persistent phone button, so
            the hero doesn't repeat it: primary routes to the form,
            secondary to the services. */}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#hafa-samband"
            onClick={goTo('#hafa-samband')}
            className="bg-btn bg-btn-solid inline-flex min-h-[52px] items-center gap-2.5 rounded-full px-8 text-[16px] font-bold"
            style={{ backgroundColor: AMBER, color: DARKINK, fontFamily: BODY }}
          >
            <MessageCircle size={17} strokeWidth={2.4} aria-hidden />
            {t.ui.contactCta}
          </a>
          <a
            href="#thjonusta"
            onClick={goTo('#thjonusta')}
            className="bg-btn bg-btn-ghost inline-flex min-h-[52px] items-center gap-2.5 rounded-full border px-8 text-[16px] font-medium"
            style={{ borderColor: 'rgba(243,240,234,0.4)', color: INK, fontFamily: BODY }}
          >
            {t.hero.ctaSecondary}
          </a>
        </div>
        {/* proof row: the three verified differentiators readable before
            the first scroll — text only, amber line-segment bullets, no
            icons, so the hero stays spare */}
        <motion.ul
          className="mt-8 flex flex-col flex-wrap gap-x-7 gap-y-2 sm:flex-row sm:items-center"
          initial={{ opacity: 0 }}
          animate={on ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {t.ui.proofRow.map(item => (
            <li
              key={item}
              className="inline-flex items-center gap-2.5 text-[13px] tracking-[0.08em]"
              style={{ fontFamily: MONO, color: MUT, textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
            >
              <span aria-hidden className="inline-block h-px w-4 shrink-0" style={{ background: AMBER }} />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}


/* The thesis sentence of story.body, lifted out as the page's second
   typographic peak (split locally — data.ts stays canonical for the other
   three concepts). Computed per language: both bodies open with the same
   one-sentence thesis. */
function splitBody(body: string) {
  const at = body.indexOf('. ') + 1
  return { thesis: body.slice(0, at), rest: body.slice(at + 1) }
}

/** Horizontal version of the bent-line vocabulary: bent while the quote
    enters, dead straight by the time it holds center screen — the thesis
    sentence ("your car has one true line") demonstrated by its own
    underline. Same reactive-attribute pattern as ClaimLine. */
function hBendPathD(v: number) {
  /* Same amplitude lesson as bendPathD: the wave must swing tens of px
     (viewBox is 100×44, rendered ~44px tall) or the morph is invisible. */
  const bend = 16 * (1 - Math.max(0, Math.min(1, v)))
  const pts = [
    [0, 22 - bend],
    [34, 22 + bend * 0.8],
    [67, 22 - bend * 0.65],
    [100, 22],
  ]
  const mid = (a: number, b: number) => (a + b) / 2
  return (
    `M${pts[0][0]},${pts[0][1]} ` +
    `C${mid(pts[0][0], pts[1][0])},${pts[0][1]} ${mid(pts[0][0], pts[1][0])},${pts[1][1]} ${pts[1][0]},${pts[1][1]} ` +
    `C${mid(pts[1][0], pts[2][0])},${pts[1][1]} ${mid(pts[1][0], pts[2][0])},${pts[2][1]} ${pts[2][0]},${pts[2][1]} ` +
    `C${mid(pts[2][0], pts[3][0])},${pts[2][1]} ${mid(pts[2][0], pts[3][0])},${pts[3][1]} ${pts[3][0]},${pts[3][1]}`
  )
}

function LineQuote() {
  const { t } = useT()
  const bandRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const reduced = useReducedMotion()
  /* Time-based, triggered on entry — NOT scroll-coupled. The scroll-driven
     version's measured range sat ~400px later than its offset asked for
     (framer's target measurement, verified headless), so the line stayed
     bent the whole time the quote was actually readable and only
     straightened offscreen. A 1.6s straighten as it enters always runs,
     always completes while the reader is looking at it. */
  const inView = useInView(bandRef, { once: true, margin: '-30% 0px -30% 0px' })
  useEffect(() => {
    if (!inView || reduced) return
    const controls = animate(0, 1, {
      duration: 1.6,
      ease: EASE,
      delay: 0.2,
      onUpdate: v => pathRef.current?.setAttribute('d', hBendPathD(v)),
    })
    return () => controls.stop()
  }, [inView, reduced])
  return (
    <div ref={bandRef} className="mt-20 md:mt-28">
      <Rise>
        <p
          className="max-w-5xl text-balance"
          style={{
            fontFamily: DISPLAY, textTransform: 'uppercase',
            fontSize: 'clamp(2.2rem, 6vw, 4.6rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.06,
            color: INK,
          }}
        >
          {splitBody(t.story.body).thesis}
        </p>
      </Rise>
      <svg aria-hidden className="pointer-events-none mt-6 h-[44px] w-full" viewBox="0 0 100 44" preserveAspectRatio="none">
        <path
          ref={pathRef}
          d={reduced ? hBendPathD(1) : hBendPathD(0)}
          fill="none"
          stroke={AMBER}
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

function Story() {
  const { t } = useT()
  return (
    <section className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
        <div className="flex flex-col justify-center">
          <Rise>
            <h2
              className="text-balance"
              style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}
            >
              {t.story.title}
            </h2>
          </Rise>
          <TrueLine className="mt-6 w-24" delay={0.15} />
          <Rise delay={0.1}>
            <p className="mt-7 max-w-[62ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
              {t.story.lead}
            </p>
            <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
              {splitBody(t.story.body).rest}
            </p>
          </Rise>
          <SpecPlate />
        </div>
        <ClipImage
          src={IMG.booth}
          alt={t.ui.boothAlt}
          className="aspect-[4/5] rounded-[26px] md:aspect-auto md:min-h-[540px]"
        />
      </div>

      {/* the thesis, at display scale, proving itself on its own underline */}
      <LineQuote />

      {/* the shop's own line through time — LineQuote already closed with a line, so this needs none */}
      <div className="mt-20 md:mt-28">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {t.story.timeline.map((item, i) => (
            <Rise key={item.year} delay={i * 0.12}>
              <p style={{ fontFamily: MONO, color: AMBER }} className="text-[15px] tracking-[0.14em]">
                {item.year}
              </p>
              <p className="mt-3 max-w-[46ch] text-[15.5px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {item.text}
              </p>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

/** The facts band as an instrument readout hung on the true line: one amber
    baseline drawn across the full width with a major tick above each value —
    the numbers read like calibration marks on the shop's own measuring
    bench instead of generic stat cards. Ticks are plain flex children (one
    per column, centered), so they can't drift out of alignment with the
    grid at any width. */
/** Facts, rebuilt on 21st.dev's "Bold Stats" structure (uilayout.contact):
    one headline figure paired with a real photo of the thing it describes,
    the rest demoted to a quiet row. Replaces the four-across numeral grid
    with its amber tick rail, which read as a generic KPI strip. Same
    verified numbers, same CountUp — only the hierarchy changed. On mobile
    the secondary figures stack as number/label rows instead of squeezing
    three columns of Icelandic labels across 390px. */
function Facts() {
  const { t } = useT()
  const lead = t.facts[1] /* 810 m² — the building the photo actually shows */
  const rest = [t.facts[0], t.facts[2], t.facts[3]]
  return (
    <section className="border-y" style={{ borderColor: HAIR, background: SURFACE }}>
      <div className="mx-auto max-w-[1320px] px-5 py-16 md:px-8 md:py-20">
        <Rise>
          <div
            className="flex flex-col gap-8 border-b pb-10 md:flex-row md:items-center md:justify-between md:gap-14 md:pb-12"
            style={{ borderColor: HAIR }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-6">
              <p
                className="shrink-0 tabular-nums"
                style={{ fontFamily: MONO, color: INK, fontSize: 'clamp(3.2rem, 8vw, 5.2rem)', lineHeight: 0.95 }}
              >
                {lead.num !== null ? <CountUp to={lead.num} pad={lead.pad} suffix={lead.suffix} /> : lead.text}
              </p>
              <p className="max-w-[26ch] text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {lead.label}
              </p>
            </div>
            <ClipImage
              src={IMG.garage}
              alt={t.ui.garageAlt}
              className="h-44 w-full shrink-0 rounded-[26px] md:h-52 md:w-[380px]"
            />
          </div>
        </Rise>
        <div className="mt-2 md:mt-12 md:grid md:grid-cols-3 md:gap-10">
          {rest.map((f, i) => (
            <Rise key={f.label} delay={i * 0.08}>
              <div
                className="flex items-baseline justify-between gap-5 border-b py-4 md:block md:border-0 md:py-0"
                style={{ borderColor: HAIR }}
              >
                <p
                  className="shrink-0 tabular-nums"
                  style={{ fontFamily: MONO, color: INK, fontSize: 'clamp(1.75rem, 4vw, 2.8rem)', lineHeight: 1 }}
                >
                  {f.num !== null ? <CountUp to={f.num} pad={f.pad} suffix={f.suffix} /> : f.text}
                </p>
                <p
                  className="text-right text-[11.5px] tracking-[0.12em] uppercase md:mt-3 md:text-left"
                  style={{ fontFamily: MONO, color: MUT }}
                >
                  {f.label}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Editorial service index: type-led rows on the left, one photo panel that
    crossfades per active service. On mobile the panel sits above the list. */
const SERVICE_IMGS = [IMG.retting, IMG.malun, IMG.garage, IMG.lift, IMG.wheel, IMG.headlight, IMG.brake]

function ServiceIndex() {
  const { t } = useT()
  const [active, setActive] = useState(0)
  /* 90ms hover-intent gate: skimming the cursor down the list no longer
     churns through every row's photo crossfade + accordion — only a real
     pause commits. Touch (click) and keyboard (focus) stay instant. */
  const hoverTimer = useRef<number>(0)
  const hoverTo = (i: number) => {
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => setActive(i), 90)
  }
  useEffect(() => () => window.clearTimeout(hoverTimer.current), [])

  /* Scroll-driven: the row closest to a fixed reading line advances the
     active service (and its photo) as you scroll — this is the primary way
     to browse on mobile, where there's no hover at all, and it also plays
     nicely on desktop as a secondary path alongside hover/click. Distance
     comparison (not IntersectionObserver ratios) because it needs to pick
     the SINGLE closest row, not merely "some row is visible". Frozen
     entirely while the section itself is off-screen so entering/leaving it
     never snaps active back to the first row. */
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const section = sectionRef.current
        if (!section) return
        const sr = section.getBoundingClientRect()
        if (sr.bottom < 0 || sr.top > window.innerHeight) return
        const line = window.innerHeight * 0.42
        let closest = -1
        let closestDist = Infinity
        itemRefs.current.forEach((el, i) => {
          if (!el) return
          const r = el.getBoundingClientRect()
          const dist = Math.abs(r.top + r.height / 2 - line)
          if (dist < closestDist) {
            closestDist = dist
            closest = i
          }
        })
        if (closest !== -1) setActive(closest)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={sectionRef} id="thjonusta" className="mx-auto max-w-[1320px] scroll-mt-20 px-5 py-24 md:px-8 md:py-36">
      <Rise>
        <Kicker>
          {t.ui.servicesKicker}
        </Kicker>
        <h2
          className="mt-4 max-w-3xl text-balance"
          style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}
        >
          {t.ui.servicesTitle}
        </h2>
      </Rise>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.15fr_1fr] md:gap-16">
        {/* photo panel — first on mobile so the tap result is visible */}
        <div className="order-first md:order-last">
          <div className="relative aspect-video overflow-hidden rounded-[26px] md:sticky md:top-24 md:aspect-[4/5]">
            <AnimatePresence initial={false}>
              <motion.img
                key={active}
                src={SERVICE_IMGS[active]}
                alt={t.ui.serviceAlts[active]}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              />
            </AnimatePresence>
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: 'linear-gradient(to top, rgba(15,13,11,0.7), transparent)' }}
            />
            <p
              className="absolute bottom-4 left-5 text-[13px] tracking-[0.16em] uppercase"
              style={{ fontFamily: MONO, color: INK }}
            >
              {t.services[active].tag}
            </p>
          </div>
        </div>

        <ul className="border-t" style={{ borderColor: HAIR }}>
          {t.services.map((s, i) => {
            const on = i === active
            return (
              <li
                key={s.name}
                ref={el => {
                  itemRefs.current[i] = el
                }}
                className="border-b"
                style={{ borderColor: HAIR }}
              >
                <button
                  type="button"
                  onClick={() => {
                    window.clearTimeout(hoverTimer.current)
                    setActive(i)
                  }}
                  onMouseEnter={() => hoverTo(i)}
                  onMouseLeave={() => window.clearTimeout(hoverTimer.current)}
                  onFocus={() => setActive(i)}
                  aria-expanded={on}
                  className="group flex w-full cursor-pointer items-baseline gap-5 py-5 text-left md:py-6"
                >
                  <span
                    className="w-8 shrink-0 text-[13px] tabular-nums transition-colors duration-200"
                    style={{ fontFamily: MONO, color: on ? AMBER : MUT }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="block transition-transform duration-200 group-hover:translate-x-1.5"
                      style={{
                        fontFamily: EBOLD, textTransform: 'uppercase',
                        fontSize: 'clamp(1.35rem, 2.6vw, 2rem)',
                        letterSpacing: '0.02em',
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
                          /* close faster than open so at most one row is
                             ever visibly mid-layout while browsing */
                          exit={{ height: 0, opacity: 0, transition: { duration: 0.22, ease: 'easeOut' } }}
                          transition={{ duration: 0.4, ease: EASE }}
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
        {/* self-pay reassurance where services are browsed — the fixed-quote
            fact otherwise only appears deep in the claims rail */}
        <p className="mt-10 text-[14px]" style={{ fontFamily: BODY, color: MUT }}>
          {t.ui.selfPayPre}
          <span className="font-semibold" style={{ color: INK }}>
            {t.ui.selfPayBold}
          </span>
          {t.ui.selfPayPost}
        </p>
        <p className="mt-2 text-[14px]" style={{ fontFamily: BODY, color: MUT }}>
          {t.ui.lubeAnswers}{' '}
          <a
            href={LUBE_PHONE_HREF}
            className="bg-link-hover inline-flex min-h-11 items-center font-semibold underline decoration-1 underline-offset-4"
            style={{ color: INK }}
          >
            {LUBE_PHONE_DISPLAY}
          </a>
        </p>
      </Rise>
    </section>
  )
}

/** The claim rail's own line: bent at the top, where the process starts
    (tjón — the car is off its line), and it straightens as you scroll past
    each step, landing dead straight — exactly overlaying the thin static
    reference hairline beside it — by "Lánsbíll á meðan" (the repair is
    done). Not a generic progress bar: it's the réttingar concept itself,
    made literal. Dots stay individually positioned inside each <li> as
    before (robust to variable step height); only the connector changes. */
function bendPathD(v: number) {
  /* Amplitude lives in tens of px, not single digits: the first version bowed
     ±7px inside a 16px-wide svg over ~1.5 viewports of scroll and read as a
     static line ("it does nothing, its stale"). The bow leans into the step
     content (rightward), converging back onto the hairline. */
  const bend = 1 - Math.max(0, Math.min(1, v))
  const pts = [
    [8 + 34 * bend, 0],
    [8 - 5 * bend, 34],
    [8 + 18 * bend, 67],
    [8, 100],
  ]
  const mid = (a: number, b: number) => (a + b) / 2
  return (
    `M${pts[0][0]},${pts[0][1]} ` +
    `C${pts[0][0]},${mid(pts[0][1], pts[1][1])} ${pts[1][0]},${mid(pts[0][1], pts[1][1])} ${pts[1][0]},${pts[1][1]} ` +
    `C${pts[1][0]},${mid(pts[1][1], pts[2][1])} ${pts[2][0]},${mid(pts[1][1], pts[2][1])} ${pts[2][0]},${pts[2][1]} ` +
    `C${pts[2][0]},${mid(pts[2][1], pts[3][1])} ${pts[3][0]},${mid(pts[2][1], pts[3][1])} ${pts[3][0]},${pts[3][1]}`
  )
}
function ClaimLine({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const pathRef = useRef<SVGPathElement>(null)
  const reduced = useReducedMotion()
  /* motion.path's `d` prop only picks up a MotionValue once, at mount — it
     doesn't subscribe the way style-based motion values do, so the shape
     rendered once and then never updated again on scroll. Subscribing to
     the raw scroll value and writing the attribute directly is the
     guaranteed-reactive way to animate a computed `d` string. */
  /* The line DRAWS with the scroll — its visible end is the user's own
     position travelling down the rail, while the drawn part simultaneously
     relaxes from bent to true. A full-height line that only changed shape
     read as "already filled out"; the moving endpoint is what makes the
     coupling to scroll unmistakable. The reveal is a userSpace clip rect,
     NOT stroke-dashoffset: with vector-effect:non-scaling-stroke Chrome
     computes dashes in screen space and ignores pathLength normalisation,
     so a dash reveal renders as a repeating segment/gap pattern instead
     of one growing line. Clipping is geometric and immune to that. */
  const clipRef = useRef<SVGRectElement>(null)
  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (reduced) return
    const c = Math.max(0, Math.min(1, v))
    pathRef.current?.setAttribute('d', bendPathD(c))
    clipRef.current?.setAttribute('height', String(100 * c))
  })
  const v0 = reduced ? 1 : Math.max(0, Math.min(1, scrollYProgress.get()))
  return (
    <svg
      aria-hidden
      /* h-[calc(...)] is load-bearing: an abs-positioned SVG is a REPLACED
         element, so `top-2 bottom-2` alone does NOT stretch it — height
         resolves from the viewBox aspect ratio (rendered a 100px sliver at
         the rail top; the line "never animated" because 90% of it didn't
         exist). Explicit height overrides the intrinsic ratio. */
      className="pointer-events-none absolute left-[-3px] top-2 h-[calc(100%-16px)] w-14 md:left-[-1px]"
      viewBox="0 0 56 100"
      preserveAspectRatio="none"
    >
      <defs>
        <clipPath id="bg-claimline-clip" clipPathUnits="userSpaceOnUse">
          <rect ref={clipRef} x="-10" y="0" width="76" height={100 * v0} />
        </clipPath>
      </defs>
      {/* reduced motion: the line renders already-true and fully drawn */}
      <path
        ref={pathRef}
        d={bendPathD(v0)}
        clipPath="url(#bg-claimline-clip)"
        fill="none"
        stroke={AMBER}
        strokeWidth="1.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function Claims() {
  const { t } = useT()
  const railRef = useRef<HTMLDivElement>(null)
  /* Coupled to the user's traversal of the rail itself: bent as the rail
     enters, straightening WITH the scroll through the four steps, dead
     straight exactly when the rail's end (the Lánsbíll card) comes fully
     into view. An earlier version finished within the first 0.6 viewport —
     technically animated, but already over before the user was reading the
     steps, so it looked static again. */
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 0.8', 'end 0.9'] })
  return (
    <section id="tjon" className="scroll-mt-20 border-t" style={{ borderColor: HAIR, background: SURFACE }}>
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-36">
        <div className="grid gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
          <div>
            <Rise>
              <Kicker>
                {t.ui.claimsKicker}
              </Kicker>
              <h2
                className="mt-4 text-balance"
                style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}
              >
                {t.insurance.title}
              </h2>
              <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {t.insurance.body}
              </p>
              <p className="mt-7 text-[13px] tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                {t.insurance.companies.join(' · ')}
              </p>
            </Rise>
            <div className="relative mt-12 hidden md:block">
              <ClipImage src={IMG.malun} alt={t.ui.paintAlt} className="aspect-[4/3] rounded-[26px]" />
              <MeasurePoints
                points={[
                  { x: 22, y: 34, label: t.ui.measurePoint },
                  { x: 58, y: 22, label: t.ui.referenceLine },
                  { x: 74, y: 58, label: t.ui.measurePoint },
                ]}
              />
            </div>
          </div>

          {/* the claim's own line: bent (tjón) -> straight (viðgerð lokið) */}
          <div ref={railRef} className="relative pl-8 md:pl-10">
            <div aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px md:left-[7px]" style={{ background: HAIR }} />
            <ClaimLine scrollYProgress={scrollYProgress} />
            <ol className="space-y-12 md:space-y-16">
              {t.claimSteps.map((s, i) => (
                <li key={s.title} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-8 top-2 block h-2.5 w-2.5 rounded-full md:-left-10 md:h-3 md:w-3"
                    style={{ background: s.highlight ? AMBER : BG, border: `2px solid ${s.highlight ? AMBER : MUT}` }}
                  />
                  <Rise delay={i * 0.06}>
                    <div
                      className={s.highlight ? 'bg-soft rounded-[20px] border p-5 md:p-6' : undefined}
                      style={s.highlight ? { borderColor: 'rgba(232,162,61,0.4)', background: 'rgba(232,162,61,0.07)' } : undefined}
                    >
                      <p className="text-[13px] tracking-[0.16em]" style={{ fontFamily: MONO, color: AMBER }}>
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <h3
                        className="mt-2"
                        style={{
                          fontFamily: EBOLD, textTransform: 'uppercase',
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
                          className="mt-4 inline-flex items-center rounded-full px-4 py-2 text-[13.5px] font-semibold"
                          style={{ backgroundColor: AMBER, color: DARKINK, fontFamily: BODY }}
                        >
                          {t.ui.includedBadge}
                        </p>
                      )}
                    </div>
                  </Rise>
                </li>
              ))}
            </ol>

            {/* mobile: the CABAS measurement demo — the page's best craft
                proof — was desktop-only; here it closes the process as
                evidence. aspect-video keeps the added scroll length modest. */}
            <div className="relative mt-12 md:hidden">
              <ClipImage src={IMG.malun} alt={t.ui.paintAlt} className="aspect-video rounded-[26px]" />
              <MeasurePoints
                points={[
                  { x: 22, y: 34, label: t.ui.measurePoint },
                  { x: 58, y: 22, label: t.ui.referenceLine },
                  { x: 74, y: 58, label: t.ui.measurePoint },
                ]}
              />
            </div>

            {/* the rail's conclusion: peak persuasion (loaner car) gets an
                action — one quiet tel link in the rail's own typography,
                not a second CTA vocabulary */}
            <Rise delay={0.1}>
              <p className="mt-12 text-[16px]" style={{ fontFamily: BODY, color: MUT }}>
                {t.ui.claimsClose}{' '}
                <a
                  href={PHONE_HREF}
                  className="bg-link-hover inline-flex min-h-11 items-center gap-1.5 font-semibold underline decoration-1 underline-offset-4"
                  style={{ color: INK }}
                >
                  <Phone size={14} strokeWidth={2.4} aria-hidden />
                  {PHONE_DISPLAY}
                </a>
              </p>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  )
}

function Craft() {
  const { t } = useT()
  return (
    <section className="relative overflow-hidden">
      <ParallaxImage src={IMG.polish} alt={t.ui.polishAlt} className="absolute inset-0" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'rgba(15,13,11,0.78)' }} />
      <div className="relative mx-auto max-w-[1320px] px-5 py-28 md:px-8 md:py-44">
        <div className="max-w-2xl">
          <Rise>
            <h2
              className="text-balance"
              style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}
            >
              {t.craft.title}
            </h2>
          </Rise>
          <TrueLine className="mt-6 w-24" delay={0.15} />
          <Rise delay={0.1}>
            <p className="mt-7 text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
              {t.craft.body}
            </p>
          </Rise>
          <ul className="mt-9 space-y-3">
            {t.craft.points.map((p, i) => (
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
  const { t } = useT()
  return (
    <section className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-36">
      <div className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
        <div>
          <Rise>
            <Kicker>
              {t.ui.brandsKicker}
            </Kicker>
            <h2
              className="mt-4 text-balance"
              style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}
            >
              {t.brands.title}
            </h2>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
              {t.brands.body}
            </p>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
              {t.brands.note}
            </p>
          </Rise>
        </div>
        {/* The marks float straight on the page ground — no plate, no
            frame. They're the REAL Toyota/Kia alpha PNGs recolored to the
            page ink with a CSS filter (their native red vanished into the
            dark ground); counters are transparent so the silhouettes stay
            true. */}
        <div className="grid grid-cols-2 items-center gap-8 md:gap-10">
          {[
            { src: IMG.toyota, alt: 'Toyota' },
            { src: IMG.kia, alt: 'Kia' },
          ].map((m, i) => (
            <Rise key={m.alt} delay={i * 0.1}>
              <div className="bg-brand-mark flex flex-col items-center gap-5">
                <img
                  src={m.src}
                  alt={m.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-16 w-auto max-w-full object-contain md:h-20"
                  style={{ filter: 'brightness(0) invert(0.94)' }}
                />
                <p className="text-[10.5px] tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                  {t.ui.certLabel} · {m.alt}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

/** One compact review card. Long quotes clamp to four lines with a
    read-more toggle (the marquee already pauses on hover, so expanding in
    place is stable to read); short ones stay small so several cards share
    the viewport instead of two billboards. */
function ReviewCard({ r, hidden }: { r: Review; hidden?: boolean }) {
  const { t } = useT()
  const [open, setOpen] = useState(false)
  const long = r.quote.length > 130
  return (
    <li
      className="bg-soft flex w-[260px] shrink-0 flex-col rounded-[20px] border p-5 md:w-[292px]"
      style={{ borderColor: HAIR, background: SURFACE }}
    >
      <p className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] tracking-[0.2em]" style={{ fontFamily: MONO, color: AMBER }} aria-label="5 stjörnur">
          ★★★★★
        </span>
        <span className="text-[10px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
          {r.source}
        </span>
      </p>
      <p
        className="mt-3 text-[13.5px] leading-relaxed"
        style={{
          fontFamily: BODY,
          color: INK,
          ...(long && !open
            ? { display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }
            : {}),
        }}
      >
        &ldquo;{r.quote}&rdquo;
      </p>
      {long && (
        <button
          type="button"
          tabIndex={hidden ? -1 : 0}
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="bg-link-hover mt-1.5 min-h-8 self-start text-[12px] underline decoration-1 underline-offset-4"
          style={{ fontFamily: BODY, color: MUT }}
        >
          {open ? t.ui.readLess : t.ui.readMore}
        </button>
      )}
      <p className="mt-auto pt-4 text-[10.5px] tracking-[0.12em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
        {r.name}
        {r.translated ? ` · ${t.ui.reviewsTranslatedNote}` : ''}
      </p>
    </li>
  )
}

/** Real, verbatim customer reviews (see translations.ts provenance note) as a
    drifting marquee — the row duplicates once for the seamless loop, the
    second copy aria-hidden. Reduced motion renders a static scrollable row. */
function Reviews() {
  const { t } = useT()
  const reduced = useReducedMotion()
  const narrow = useNarrow()
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-stretch gap-4 pr-4">
      {t.ui.reviews.map(r => (
        <ReviewCard key={r.name} r={r} hidden={hidden} />
      ))}
    </ul>
  )
  return (
    <section className="overflow-hidden border-t py-24 md:py-32" style={{ borderColor: HAIR, background: BG }}>
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <Rise>
          <Kicker>{t.ui.reviewsKicker}</Kicker>
          <h2
            className="mt-4 text-balance"
            style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}
          >
            {t.ui.reviewsTitle}
          </h2>
        </Rise>
        <Rise delay={0.08}>
          <div
            className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 text-[13px] tracking-[0.1em] uppercase"
            style={{ fontFamily: MONO, color: MUT }}
          >
            <span style={{ color: INK }}>{t.ui.reviewsGoogle}</span>
            <span>{t.ui.reviewsFacebook}</span>
            <a
              href="https://www.google.com/maps/search/B%C3%ADlageirinn+ehf+Gr%C3%B3fin+14a+Reykjanesb%C3%A6"
              target="_blank"
              rel="noreferrer"
              className="bg-link-hover inline-flex min-h-11 items-center underline decoration-1 underline-offset-4"
              style={{ color: INK }}
            >
              {t.ui.reviewsOpenGoogle}
            </a>
          </div>
        </Rise>
      </div>
      <Rise delay={0.15}>
        {reduced || narrow ? (
          /* touch can't hover to pause a marquee, so it just moves at you —
             swipe the row by hand instead */
          <div className="mt-10 overflow-x-auto px-5 md:px-8">{row(false)}</div>
        ) : (
          <div className="bg-rev-marquee mt-10 overflow-hidden">
            <div className="bg-rev-track flex w-max">
              {row(false)}
              {row(true)}
            </div>
          </div>
        )}
      </Rise>
    </section>
  )
}

function Workshop() {
  const { t } = useT()
  return (
    <section id="verkstaedid" className="scroll-mt-20 border-t" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-36">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <ClipImage
            src={IMG.garage}
            alt={t.ui.garageAlt}
            className="aspect-[4/3] rounded-[26px] md:aspect-auto md:min-h-[520px]"
          />
          <div className="flex flex-col justify-center">
            <Rise>
              <h2
                className="text-balance"
                style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}
              >
                {t.facility.title}
              </h2>
              <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {t.facility.body}
              </p>
            </Rise>

            <div className="mt-10 border-t" style={{ borderColor: HAIR }}>
              {t.team.map((p, i) => (
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
                    {t.ui.hoursLabel}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-[15px]" style={{ fontFamily: BODY, color: MUT }}>
                    {t.hours.map(h => (
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
                    {t.ui.locationLabel}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                    <span style={{ color: INK }}>{ADDRESS.street}</span>
                    <br />
                    {ADDRESS.town}
                  </p>
                  <p className="mt-3 text-[13px]" style={{ fontFamily: MONO, color: MUT }}>
                    {t.ui.mapNote}
                  </p>
                </div>
              </div>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Large embedded map, dark-mode styled via a CSS filter (no maps API key
    needed for a static prototype — a well-established zero-setup trick:
    invert the light tile colours so it reads as dark instead of a bright
    rectangle punched into an otherwise dark page). Real interactivity
    (pan/zoom/directions) still lives one tap away via the real Google
    Maps link underneath. */
function MapSection() {
  const { t } = useT()
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.town}`)}&z=16&output=embed`
  return (
    <section className="border-t" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1320px] px-5 py-16 md:px-8 md:py-20">
        <Rise>
          <Kicker>
            {t.ui.mapKicker}
          </Kicker>
          <h2
            className="mt-4 text-balance"
            style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)', letterSpacing: '0.005em', lineHeight: 1.08 }}
          >
            {t.ui.mapTitle}
          </h2>
        </Rise>
        <Rise delay={0.1}>
          <div
            className="relative mt-8 overflow-hidden rounded-[26px] border"
            style={{ borderColor: HAIR, height: 'clamp(320px, 44vw, 480px)' }}
          >
            {/* the dark-mode filter lives on this wrapper, not on the iframe
                itself — a defensive habit for cross-origin iframes/video
                (see the mix-blend-mode note elsewhere in this file), kept
                even though it wasn't the actual bug here. */}
            <div className="bg-map-dark absolute inset-0 h-full w-full">
              {/* NOT loading="lazy": this section sits deep in the scroll,
                  so the browser's native lazy-load scheduler defers the
                  fetch until it decides the main thread has room — on this
                  page that decision got starved by Lenis's continuous rAF
                  loop and the other scroll-driven animations, so the map
                  didn't even start loading until 6-10s after it entered
                  view (measured: page.frames() stayed empty that whole
                  time). A visitor never waits that long and just sees a
                  blank box. Eager here trades a few KB of upfront request
                  for the map actually being there when scrolled to. */}
              <iframe
                title={t.ui.mapIframeTitle}
                src={mapSrc}
                className="h-full w-full"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }} />
          </div>
        </Rise>
        <Rise delay={0.18}>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[15px]" style={{ fontFamily: BODY, color: MUT }}>
              <span style={{ color: INK }}>{ADDRESS.street}</span>, {ADDRESS.town}
            </p>
            <a
              href={MAPS}
              target="_blank"
              rel="noreferrer"
              className="bg-link-hover inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold underline decoration-1 underline-offset-4"
              style={{ fontFamily: BODY, color: INK }}
            >
              <MapPin size={15} strokeWidth={2.2} aria-hidden />
              {t.ui.openMaps}
            </a>
          </div>
        </Rise>
      </div>
    </section>
  )
}

/** Quick-message CTA: for anyone who'd rather write than call. Builds a
    real mailto: (no backend to stand up for a prototype, and no third-party
    form service to wire without asking first) so a submission is genuinely
    functional today — opens the visitor's own mail app with everything
    filled in, one tap from actually sending. The inline "sent" state gives
    the instant feedback the interaction should feel like, without
    pretending the message left before it has. */
/** Fields match what the shop actually needs to act on a request — a plate
    number and a service category turn a vague "please contact me" into
    something a work order can start from, the same way the phone call
    already would. Service options reuse SERVICES verbatim, never invented. */
function ContactForm() {
  const { t } = useT()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [plate, setPlate] = useState('')
  const [service, setService] = useState('')
  const [message, setMessage] = useState('')
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [composed, setComposed] = useState('')
  const [copied, setCopied] = useState(false)

  const valid = name.trim().length > 1 && phone.trim().length > 2 && service.length > 0

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!valid || status === 'sending') return
    setStatus('sending')
    const subject = `${t.ui.mailSubject} · ${service} · ${name.trim()}`
    const lines = [
      `${t.ui.mailName}: ${name.trim()}`,
      `${t.ui.mailPhone}: ${phone.trim()}`,
      `${t.ui.mailPlate}: ${plate.trim() || t.ui.mailNotProvided}`,
      `${t.ui.mailService}: ${service}`,
      '',
      message.trim() || t.ui.mailNoMessage,
    ]
    setComposed(`${subject}\n\n${lines.join('\n')}`)
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
    window.setTimeout(() => {
      window.location.href = mailto
      setStatus('sent')
    }, 450)
  }

  const copyComposed = async () => {
    try {
      await navigator.clipboard.writeText(composed)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard denied: the mailto/email links right beside remain */
    }
  }

  const field = 'bg-field min-h-11 w-full px-4 py-2.5 text-[15px]'
  const label = 'mb-1.5 block text-[12px] tracking-[0.1em] uppercase'

  return (
    <div className="bg-soft rounded-[26px] border p-6 text-left md:p-7" style={{ borderColor: HAIR, background: 'rgba(26,22,19,0.72)' }}>
      <p className="text-[12px] tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: AMBER }}>
        {t.ui.formKicker}
      </p>
      <h3 className="mt-2 text-[19px] font-bold" style={{ fontFamily: BODY, color: INK }}>
        {t.ui.formTitle}
      </h3>
      <p className="mt-1.5 text-[14px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
        {t.ui.formIntro}
      </p>

      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-6"
          >
            <div
              className="flex items-start gap-3 rounded-[16px] border py-4 px-4"
              style={{ borderColor: 'rgba(232,162,61,0.35)', background: 'rgba(232,162,61,0.08)' }}
            >
              <Check size={18} strokeWidth={2.4} aria-hidden style={{ color: AMBER, flexShrink: 0, marginTop: 2 }} />
              <p className="text-[14px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
                {t.ui.sentNotice}
              </p>
            </div>
            {/* recovery: on machines without a configured mail client the
                mailto silently does nothing and the visitor would otherwise
                be stranded on a false success */}
            <p className="mt-5 text-[13px]" style={{ fontFamily: BODY, color: MUT }}>
              {t.ui.recoveryQ}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2.5">
              <button
                type="button"
                onClick={copyComposed}
                className="bg-btn bg-btn-ghost inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[13.5px] font-semibold"
                style={{ borderColor: 'rgba(243,240,234,0.3)', color: INK, fontFamily: BODY }}
              >
                {copied ? <Check size={14} strokeWidth={2.4} aria-hidden /> : <Copy size={14} strokeWidth={2.2} aria-hidden />}
                {copied ? t.ui.copied : t.ui.copyMsg}
              </button>
              <a
                href={`mailto:${EMAIL}`}
                className="bg-link-hover inline-flex min-h-11 items-center text-[13.5px] underline decoration-1 underline-offset-4"
                style={{ color: INK, fontFamily: BODY }}
              >
                {EMAIL}
              </a>
              <a
                href={PHONE_HREF}
                className="bg-link-hover inline-flex min-h-11 items-center text-[13.5px] font-semibold"
                style={{ color: INK, fontFamily: BODY }}
              >
                {t.ui.orCall} {PHONE_DISPLAY}
              </a>
            </div>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="bg-link-hover mt-3 inline-flex min-h-11 items-center text-[13px] underline decoration-1 underline-offset-4"
              style={{ color: MUT, fontFamily: BODY }}
            >
              {t.ui.backToForm}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={onSubmit}
            noValidate
            className="mt-6 flex flex-col gap-3.5"
          >
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="bg-name" className={label} style={{ fontFamily: MONO, color: MUT }}>
                  {t.ui.fieldName}
                </label>
                <input
                  id="bg-name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  data-touched={touched}
                  placeholder={t.ui.namePlaceholder}
                  className={`${field} rounded-full`}
                  style={{ fontFamily: BODY }}
                />
              </div>
              <div>
                <label htmlFor="bg-phone" className={label} style={{ fontFamily: MONO, color: MUT }}>
                  {t.ui.fieldPhone}
                </label>
                <input
                  id="bg-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  data-touched={touched}
                  placeholder={t.ui.phonePlaceholder}
                  className={`${field} rounded-full`}
                  style={{ fontFamily: BODY }}
                />
              </div>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="bg-plate" className={label} style={{ fontFamily: MONO, color: MUT }}>
                  {t.ui.fieldPlate} <span style={{ color: MUT, textTransform: 'none', letterSpacing: 0 }}>{t.ui.optional}</span>
                </label>
                <div className="relative">
                  <Car size={15} strokeWidth={2.2} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUT }} />
                  <input
                    id="bg-plate"
                    type="text"
                    value={plate}
                    onChange={e => setPlate(e.target.value.toUpperCase())}
                    placeholder="AB 123"
                    className={`${field} rounded-full pl-10`}
                    style={{ fontFamily: MONO, letterSpacing: '0.06em' }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="bg-service" className={label} style={{ fontFamily: MONO, color: MUT }}>
                  {t.ui.fieldService}
                </label>
                <select
                  id="bg-service"
                  required
                  value={service}
                  onChange={e => setService(e.target.value)}
                  data-touched={touched}
                  className={`${field} rounded-full`}
                  style={{ fontFamily: BODY, color: service ? INK : MUT }}
                >
                  <option value="" disabled>
                    {t.ui.selectPlaceholder}
                  </option>
                  {t.services.map(s => (
                    <option key={s.name} value={s.name} style={{ color: DARKINK }}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="bg-message" className={label} style={{ fontFamily: MONO, color: MUT }}>
                {t.ui.fieldMessage} <span style={{ color: MUT, textTransform: 'none', letterSpacing: 0 }}>{t.ui.optional}</span>
              </label>
              <textarea
                id="bg-message"
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t.ui.messagePlaceholder}
                className={`${field} resize-none rounded-[20px]`}
                style={{ fontFamily: BODY }}
              />
            </div>
            {touched && !valid && (
              <p className="text-[13px]" style={{ fontFamily: BODY, color: '#E06E6E' }}>
                {t.ui.formError}
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-btn bg-btn-solid mt-1 inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full text-[15px] font-bold"
              style={{ backgroundColor: AMBER, color: DARKINK, fontFamily: BODY }}
            >
              {status === 'sending' ? (
                t.ui.sending
              ) : (
                <>
                  <Send size={16} strokeWidth={2.4} aria-hidden />
                  {t.ui.submit}
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function Contact() {
  const { t } = useT()
  return (
    <section id="hafa-samband" className="relative overflow-hidden border-t" style={{ borderColor: HAIR }}>
      <ParallaxImage src={IMG.headlight} alt={t.ui.headlightAlt} className="absolute inset-0" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'rgba(15,13,11,0.85)' }} />
      <div className="relative mx-auto max-w-[1320px] px-5 py-28 md:px-8 md:py-40">
        <div className="grid gap-14 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16">
          <div className="text-center md:text-left">
            <Rise>
              <h2 className="text-balance" style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', letterSpacing: '0.005em' }}>
                {t.cta.title}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed md:mx-0" style={{ fontFamily: BODY, color: MUT }}>
                {t.cta.body}
              </p>
            </Rise>
            <Rise delay={0.12}>
              <a
                href={PHONE_HREF}
                className="bg-cta-display mt-10 leading-none"
                style={{ fontFamily: DISPLAY, textTransform: 'uppercase', color: AMBER, fontSize: 'clamp(3rem, 9vw, 5.4rem)', letterSpacing: '0.01em' }}
              >
                {PHONE_DISPLAY}
              </a>
              {/* the true line lands under the number — the concept arrives
                  at the conversion moment */}
              <TrueLine className="mx-auto mt-4 w-full max-w-md md:mx-0" delay={0.35} />
            </Rise>
            <Rise delay={0.2}>
              <div className="mt-8 flex flex-col items-center gap-1 text-[14px] md:items-start" style={{ fontFamily: MONO, color: MUT }}>
                <p>
                  {t.ui.lubeLabel}{' '}
                  <a href={LUBE_PHONE_HREF} className="bg-link-hover inline-flex min-h-11 items-center font-semibold" style={{ color: INK }}>
                    {LUBE_PHONE_DISPLAY}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="bg-link-hover inline-flex min-h-11 items-center underline decoration-1 underline-offset-4"
                    style={{ color: INK }}
                  >
                    {EMAIL}
                  </a>
                </p>
                <p className="mt-1">{t.ui.hoursStrip}</p>
              </div>
            </Rise>
          </div>
          <Rise delay={0.15}>
            <ContactForm />
          </Rise>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────── the page ─────────────────────────────── */

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)

  /* Icelandic is the original language; the EN toggle is client-side only.
     The choice persists across visits, defaulting to IS. */
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return localStorage.getItem('bg-lang') === 'en' ? 'en' : 'is'
    } catch {
      return 'is'
    }
  })
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('bg-lang', l)
    } catch {
      /* private mode: the toggle still works for this visit */
    }
  }, [])
  const langValue = useMemo(() => ({ lang, setLang, t: STRINGS[lang] }), [lang, setLang])

  /* declare the active language (screen-reader pronunciation, hyphenation) */
  useEffect(() => {
    const prevLang = document.documentElement.lang
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = prevLang
    }
  }, [lang])

  useEffect(() => {
    document.title = SEO.title
    setThemeColor(BG)
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', SEO.description)

    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    /* everything below restates facts already in data.ts — geo coordinates
       and sameAs profiles deliberately omitted (not verified) */
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AutoBodyShop',
      name: 'Bílageirinn',
      url: 'https://bilageirinn.is',
      slogan: 'Eins og ekkert hefði í skorist.',
      telephone: '+354 421 6901',
      email: EMAIL,
      address: { '@type': 'PostalAddress', streetAddress: ADDRESS.street, addressLocality: 'Reykjanesbær', postalCode: '230', addressCountry: 'IS' },
      foundingDate: '2003',
      areaServed: { '@type': 'City', name: 'Reykjanesbær' },
      memberOf: { '@type': 'Organization', name: 'Bílgreinasambandið' },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '08:00', closes: '17:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:00', closes: '15:00' },
      ],
      contactPoint: [
        { '@type': 'ContactPoint', telephone: '+354 421 6901', name: 'Verkstæði' },
        { '@type': 'ContactPoint', telephone: '+354 436 6901', name: 'Smurstöð' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Þjónusta',
        itemListElement: SERVICES.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name } })),
      },
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

  /* Loading gate: the overlay stays up until the hero photo, the icon, and the
     self-hosted fonts are actually ready, so the fade lands on an already-painted
     hero instead of visitors watching it pop in after the loader clears. ALSO
     enforced against a minimum visible time — on a fast connection (e.g. the
     production CDN) every asset can resolve in under 200ms, which made the
     first version of this screen invisible in practice. The floor covers the
     icon-draw + wordmark sequence, but ONLY on the first visit of the session:
     a return visitor who just wants the phone number gets a pure asset gate
     that clears the instant everything's painted (long intros are banned;
     the brand moment is worth one showing per session, not a recurring toll). */
  const introSeen = useMemo(() => {
    try {
      return sessionStorage.getItem('bg-intro-seen') === '1'
    } catch {
      return false
    }
  }, [])
  const MIN_VISIBLE_MS = introSeen ? 0 : 1900
  const GATE_KEYS = useMemo(() => ['fonts', 'hero', 'icon'] as const, [])
  const [ready, setReady] = useState<Record<string, boolean>>({})
  const [forced, setForced] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(MIN_VISIBLE_MS === 0)
  const mark = useCallback((k: string) => setReady(r => (r[k] ? r : { ...r, [k]: true })), [])
  const readyCount = GATE_KEYS.reduce((n, k) => n + (ready[k] ? 1 : 0), 0)
  const assetsReady = (forced || readyCount === GATE_KEYS.length) && minTimeElapsed
  const loadProgress = forced ? 1 : readyCount / GATE_KEYS.length

  useEffect(() => {
    let alive = true
    const safeMark = (k: string) => {
      if (alive) mark(k)
    }
    const warm = (src: string, key: string) => {
      const im = new Image()
      im.src = src
      im.decode().catch(() => {}).finally(() => safeMark(key))
    }
    ;(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => safeMark('fonts'))
    warm(IMG.hero, 'hero')
    warm(ICON_CONCEPT, 'icon')
    const minTimer = window.setTimeout(() => {
      if (alive) setMinTimeElapsed(true)
    }, MIN_VISIBLE_MS)
    // never trap a visitor behind the loader if a resource stalls
    const failsafe = window.setTimeout(() => {
      if (alive) setForced(true)
    }, introSeen ? 2500 : 4500)
    return () => {
      alive = false
      window.clearTimeout(minTimer)
      window.clearTimeout(failsafe)
    }
  }, [mark, MIN_VISIBLE_MS, introSeen])

  const [overlayMounted, setOverlayMounted] = useState(true)
  useEffect(() => {
    if (!assetsReady) return
    try {
      sessionStorage.setItem('bg-intro-seen', '1')
    } catch {
      /* private-mode storage failures just mean the intro replays */
    }
    const t = window.setTimeout(() => setOverlayMounted(false), 700)
    return () => window.clearTimeout(t)
  }, [assetsReady])

  return (
    <LangCtx.Provider value={langValue}>
    <div className="bg-page min-h-screen antialiased" style={{ fontFamily: BODY }}>
      <style>{CSS}</style>
      {overlayMounted && <BilageirinnLoading visible={!assetsReady} progress={loadProgress} />}
      <Nav lenisRef={lenisRef} />
      <main>
        <Hero lenisRef={lenisRef} start={assetsReady} />
        <ServiceIndex />
        <Story />
        <Facts />
        <Claims />
        <Craft />
        <Brands />
        <Reviews />
        <Workshop />
        <MapSection />
        <Contact />
      </main>

      <div className="px-5 py-5 text-center text-[11px] tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT, borderTop: `1px solid ${HAIR}` }}>
        FRUMGERÐ · SNDR STUDIO
      </div>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
    </LangCtx.Provider>
  )
}
