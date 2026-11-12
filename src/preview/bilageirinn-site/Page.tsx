import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import Lenis from 'lenis'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { ArrowRight, ArrowUpRight, BadgeCheck, Building2, CalendarDays, FileCheck2, ShieldAlert, ShieldCheck, Check, ChevronLeft, ChevronRight, Clock, Copy, Droplet, Mail, MapPin, Menu, MessageCircle, Navigation, Phone, Quote, Star, ThumbsUp, Users, Warehouse, Wrench } from 'lucide-react'
import BilageirinnLoading from './Loading'
import EnquiryForm from './EnquiryForm'
import { services as SERVICE_ROUTES } from './content.mjs'
import { AboutPage, ClaimsPage, ContactPage, NotFoundPage, OverviewPage, PrivacyPage, ServicePage } from './pages'
import { STRINGS, type Lang, type Review, type Strings } from './translations'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  EMAIL,
  FACEBOOK,
  IMG,
  KT,
  LUBE_PHONE_DISPLAY,
  LUBE_PHONE_HREF,
  MAPS,
  PHONE_DISPLAY,
  PHONE_HREF,
  SEO,
  SERVICES,
} from './data'

/** Touch = no JS scroll surface (Lenis keeps iOS Safari's tall toolbar up for
    the whole visit and fights momentum scrolling). Guard on capability, never
    on width — a narrow desktop window keeps the damped feel. [[lenis-mobile-damage]] */
const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches


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
/* The LOGO lockup only — chosen to match the real logo.png's heavy
   neo-grotesque wordmark (Helvetica/Arial-Black character). Inter Black is
   the closest self-hostable match; Arial/Helvetica are the system fallbacks
   that the original literally resembles. Subset to just the logo's glyphs
   (Inter-logo.woff2, ~8KB, variable so the tagline gets a lighter weight). */
const LOGO = "'Inter Logo', 'Arial Black', 'Helvetica Neue', Arial, sans-serif"

const B = import.meta.env.BASE_URL
/* Rebrand-concept icon, previewed on v2 only per Sindri's 2026-07-15 request — NOT
   the real logo.png (used everywhere else: nav on the other 3 concepts, footer).
   Background removed + cropped from a generated still; the wordmark is set as
   real type elsewhere (never baked into the image — the generated art's own
   text had a broken þ). Swap back to LOGO/the real nav markup if this doesn't land. */
const ICON_CONCEPT = `${B}preview/bilageirinn/icon-concept.png`
/** Which page this HTML entry is (each route has its own index.html with <meta name="bg-route">). */
export const ROUTE = (typeof document !== 'undefined' && document.querySelector<HTMLMetaElement>('meta[name="bg-route"]')?.content) || '/'
/** Link to a route under the deploy base. */
export const pageHref = (path: string) => `${B}${path.replace(/^\//, '')}`
export const NAV_PAGES = (lang: Lang) => [
  { path: '/', label: lang === 'is' ? 'Forsíða' : 'Home' },
  { path: '/thjonusta/', label: lang === 'is' ? 'Þjónusta' : 'Services' },
  { path: '/tjon-og-tryggingar/', label: lang === 'is' ? 'Tjón og tryggingar' : 'Claims' },
  { path: '/um-okkur/', label: lang === 'is' ? 'Um okkur' : 'About us' },
  { path: '/hafa-samband/', label: lang === 'is' ? 'Hafa samband' : 'Contact' },
  { path: '/personuvernd/', label: lang === 'is' ? 'Persónuvernd' : 'Privacy' },
]
const EASE = [0.23, 1, 0.32, 1] as const

const CSS = `
.bg-scroll-cue { animation: bg-cue 1.8s cubic-bezier(0.65,0,0.35,1) infinite; }
@keyframes bg-cue { 0% { transform: translateY(-100%); } 100% { transform: translateY(260%); } }
.bg-hero-claim { transition: background-color .3s, border-color .3s; }
@media (hover:hover) and (pointer:fine) { .bg-hero-claim:hover { background: rgba(232,162,61,0.12); border-color: ${AMBER} !important; } .bg-pick:hover { border-color: rgba(232,162,61,0.6) !important; } }
.bg-pick { transition: border-color .25s, background-color .25s, transform .35s cubic-bezier(0.23,1,0.32,1); }
.bg-pick:active { transform: scale(0.985); }
.bg-pick-arrow { opacity: .35; transition: opacity .25s, transform .35s cubic-bezier(0.23,1,0.32,1); }
.bg-pick:hover .bg-pick-arrow { opacity: 1; transform: translateX(3px); }
@media (prefers-reduced-motion: reduce) { .bg-scroll-cue { animation: none; } }

.bg-logo { transition: transform .45s cubic-bezier(0.23,1,0.32,1); transform-origin: left center; }
@media (hover:hover) and (pointer:fine) { .bg-logo:hover { transform: scale(1.06); } }
.bg-open-pulse { animation: bg-pulse 2.2s cubic-bezier(0.4,0,0.6,1) infinite; }
@keyframes bg-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(124,203,124,0.55); } 60% { box-shadow: 0 0 0 7px rgba(124,203,124,0); } }
.bg-tile { transition: transform .45s cubic-bezier(0.23,1,0.32,1), border-color .3s; }
@media (hover:hover) and (pointer:fine) { .bg-tile:hover { transform: translateY(-4px); border-color: rgba(232,162,61,0.5) !important; } .bg-foot-link:hover { transform: translateX(4px); } }
.bg-foot-link { transition: transform .35s cubic-bezier(0.23,1,0.32,1), color .2s; }
.bg-review-pick:hover span { color: ${INK} !important; }
@media (prefers-reduced-motion: reduce) { .bg-logo, .bg-tile, .bg-foot-link { transition: none; } .bg-open-pulse { animation: none; } }

@font-face { font-family: 'Inter Logo'; src: url('${B}fonts/inter/Inter-logo.woff2') format('woff2'); font-weight: 400 900; font-style: normal; font-display: swap; }
@font-face { font-family: 'Archia'; src: url('${B}fonts/archia/Archia-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Projekt Blackbird'; src: url('${B}fonts/blackbird/ProjektBlackbirdIS-ext.otf') format('opentype'); font-weight: 400 700; font-style: normal; font-display: swap; }

/* Mobile chrome standard [[mobile-chrome-standard]]: Safari tints its
   status/home strips from html/body background-color, so the page ink must
   live there, not only on an inner wrapper. overflow-x: clip (never hidden)
   keeps the sticky awning alive. Unmounts with the route. */
html { color-scheme: dark; }
html, body { background-color: ${BG}; }
.bg-page { background: ${BG}; color: ${INK}; overflow-x: clip; }
.bg-page ::selection { background: ${AMBER}; color: ${DARKINK}; }
.bg-page a, .bg-page button, .bg-page input, .bg-page select, .bg-page textarea { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.bg-page :focus-visible { outline: 2px solid ${AMBER}; outline-offset: 3px; border-radius: 9999px; }
.bg-field:focus-visible { border-radius: 0; outline-offset: 0; }

/* THE AWNING (phones only). position:sticky lives in the scrolling layer,
   the one layer iOS paints into the Dynamic Island strip; stuck at -100px
   it keeps that strip solid ink at every scroll position. The negative
   margin cancels its height so layout is untouched. */
.bg-awning { position: sticky; top: -100px; height: 106px; margin-bottom: -106px; flex: none; z-index: 45; background: ${BG}; pointer-events: none; }
@media (min-width: 768px) { .bg-awning { display: none; } }
/* phone bar: the number is one tap from first paint; at 320px only the icon fits */
.bg-navphone-num { display: none; }
@media (min-width: 360px) { .bg-navphone-num { display: inline; } }

/* hero background crossfade: each frame drifts slowly the whole time it's
   visible — a placeholder for real workshop video, not a static photo.
   8.4s covers the 6.5s dwell + 1.6s fade with margin so motion never
   freezes mid-crossfade; consecutive frames drift opposite directions. */
@keyframes bg-hero-kb { from { transform: scale(1.08) translate(0, 0); } to { transform: scale(1.16) translate(-1%, -1%); } }
.bg-hero-kb { animation: bg-hero-kb 8.4s linear both; }
@keyframes bg-hero-kb-alt { from { transform: scale(1.08) translate(0, 0); } to { transform: scale(1.16) translate(1%, -1%); } }
.bg-hero-kb-alt { animation: bg-hero-kb-alt 8.4s linear both; }

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
.bg-btn:active { transform: scale(0.97); transition-duration: 0.1s; }
.bg-btn:disabled { opacity: 0.6; cursor: default; transform: none; box-shadow: none; background-position: 118% 0; }
/* touch fires :hover on tap and leaves it stuck — hover motion is pointer-only */
@media (hover: none) {
  .bg-btn:hover { background-position: 118% 0; transform: none; box-shadow: none; }
  .bg-navlink:hover::after { transform: scaleX(0); }
  .bg-brand-mark:hover img { transform: none; opacity: 0.92; }
}

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

/* contact form: type on a line. One hairline under each field, amber when
   focused — the same drawn-line vocabulary as the rest of the page, and no
   boxed inputs inside a boxed card. */
.bg-field {
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(243,240,234,0.3);
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
  color: ${INK};
  transition: border-color 0.2s cubic-bezier(0.4,0,0.2,1);
}
.bg-field::placeholder { color: ${MUT}; }
.bg-field:hover { border-bottom-color: rgba(243,240,234,0.55); }
.bg-field:focus { outline: none; border-bottom-color: ${AMBER}; }
.bg-field:invalid[data-touched="true"] { border-bottom-color: rgba(224,110,110,0.8); }
select.bg-field { background-color: transparent; }
select.bg-field option { background-color: ${BG}; color: ${INK}; }

@media (prefers-reduced-motion: reduce) {
  .bg-navlink::after { transition: none; display: none; }
  .bg-btn { transition: none; }
  .bg-btn:hover, .bg-btn:focus-visible { background-position: 118% 0; transform: none; }
  .bg-btn:active { transform: none; }
}
`

/* ───────────────────────── shared motion helpers ───────────────────────── */

/* Section kickers (mono eyebrow above every h2) were removed 2026-09-22: an
   eyebrow on every section is the generated-page scaffold, and each one only
   repeated its own heading. The hero keeps the single kicker that carries the
   address. [[feedback-my-fallback-vocabulary-is-the-slop]] */

function Rise({ children, className, style }: {
  children: ReactNode; delay?: number; className?: string; style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.96', 'start 0.72'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0.12, 1])
  const y = useTransform(scrollYProgress, [0, 1], [24, 0])
  return <div ref={ref} className={className} style={style}>
    <motion.div style={reduced ? undefined : { opacity, y }}>{children}</motion.div>
  </div>
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.96', 'start 0.55'] })
  const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(0 0 95% 0)', 'inset(0 0 0% 0)'])
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
        style={{ clipPath }}
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
      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
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

function FactValue({ to, pad, suffix }: { to: number; pad: number; suffix: string }) {
  return <span>{String(to).padStart(pad, '0')}{suffix}</span>
}

/* ─────────────────────────── language context ─────────────────────────── */

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Strings }>({
  lang: 'is',
  setLang: () => {},
  t: STRINGS.is,
})
const useT = () => useContext(LangCtx)

/* ─────────────────────────────── sections ─────────────────────────────── */

function LangSwitch() {
  const { lang, setLang } = useT()
  const reduced = useReducedMotion()
  /* one control, two states: a hairline track, the amber thumb slides under the active language */
  return (
    <div role="group" aria-label={lang === 'is' ? 'Tungumál' : 'Language'} className="bg-lang relative inline-flex h-9 shrink-0 items-center rounded-full border p-[3px]" style={{ borderColor: 'rgba(243,240,234,0.22)', fontFamily: MONO }}>
      <motion.span
        aria-hidden
        className="absolute top-[3px] bottom-[3px] left-[3px] w-[38px] rounded-full"
        style={{ background: AMBER }}
        initial={false}
        animate={{ x: lang === 'is' ? 0 : 38 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 38 }}
      />
      {(['is', 'en'] as const).map(l => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={l === 'is' ? 'Íslenska' : 'English'}
          className="relative z-[1] inline-flex h-full w-[38px] items-center justify-center text-[11.5px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300"
          style={{ color: lang === l ? DARKINK : MUT }}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

function Nav({ lenisRef, start }: { lenisRef: RefObject<Lenis | null>; start: boolean }) {
  const { lang, t } = useT()
  const reduced = useReducedMotion()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const viaKey = useRef(false)
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

  /* open: lock the page (iOS needs the fixed-body trick), focus the panel on a pointer open and the first
     link on a keyboard open (no boxed first item on a tap), trap Tab, Escape closes and returns focus. */
  useEffect(() => {
    if (!open) return
    const lenis = lenisRef.current
    lenis?.stop()
    const main = document.querySelector('main')
    if (main) main.inert = true
    const y = window.scrollY
    const b = document.body.style
    const prev = { position: b.position, top: b.top, left: b.left, right: b.right, width: b.width, overflow: b.overflow }
    Object.assign(b, { position: 'fixed', top: `-${y}px`, left: '0', right: '0', width: '100%', overflow: 'hidden' })
    const frame = requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>('a')
      ;(viaKey.current ? first : panelRef.current)?.focus({ preventScroll: true })
    })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return }
      if (e.key !== 'Tab') return
      const controls = [triggerRef.current, ...Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a,button') ?? [])].filter(Boolean) as HTMLElement[]
      const i = controls.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey && i <= 0) { e.preventDefault(); controls[controls.length - 1]?.focus() }
      else if (!e.shiftKey && (i === controls.length - 1 || i === -1)) { e.preventDefault(); controls[0]?.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKey)
      if (main) main.inert = false
      Object.assign(b, prev)
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
      lenis?.start()
      triggerRef.current?.focus({ preventScroll: true })
    }
  }, [open, lenisRef])

  const pages = NAV_PAGES(lang).filter(p => p.path !== '/personuvernd/')
  const serviceLinks = SERVICE_ROUTES.map(([name, slug]) => ({ name, path: `/thjonusta/${slug}/` }))
  const ease = EASE as unknown as [number, number, number, number]
  const item = (i: number) => ({
    initial: reduced ? { opacity: 1 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: reduced ? 0 : 0.12 + i * 0.045 } },
    exit: { opacity: 0, y: reduced ? 0 : -8, transition: { duration: 0.18, ease: 'easeIn' as const } },
  })
  const headBg = open || solid ? 'rgba(15,13,11,0.94)' : 'transparent'
  return (
    <>
    <header
      className={`bg-chrome fixed inset-x-0 top-0 z-50 ${start ? 'bg-arrived' : ''}`}
      style={{
        background: headBg,
        backdropFilter: open || solid ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: open || solid ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${open || solid ? HAIR : 'transparent'}`,
        transition: 'background-color .35s cubic-bezier(0.23,1,0.32,1), border-color .35s',
      }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between gap-3 px-4 md:px-8">
        <a href={pageHref('/')} onClick={ROUTE === '/' ? go('#efst') : undefined} className="bg-logo inline-flex min-h-11 shrink-0 items-center gap-2 md:gap-2.5" aria-label={t.ui.navTopAria}>
          <img src={ICON_CONCEPT} alt="" className="h-7 w-auto md:h-8" style={{ filter: 'brightness(0) invert(0.96)' }} />
          <span className="flex flex-col leading-[0.9]">
            <span style={{ fontFamily: LOGO, fontWeight: 900, fontSize: 'clamp(16px, 4.4vw, 20px)', color: INK, letterSpacing: '-0.015em' }}>Bílageirinn</span>
            <span style={{ fontFamily: LOGO, fontWeight: 600, fontSize: 'clamp(6.5px, 1.7vw, 8px)', color: MUT, letterSpacing: '0.2em', alignSelf: 'flex-end', marginTop: '2px' }}>BÍLAÞJÓNUSTA</span>
          </span>
        </a>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden sm:block"><LangSwitch /></div>
          <a
            href={PHONE_HREF}
            aria-label={`${t.ui.orCall} ${PHONE_DISPLAY}`}
            className="bg-btn bg-btn-solid inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[13px] font-semibold md:min-h-11 md:gap-2 md:px-5 md:text-[14px]"
            style={{ backgroundColor: AMBER, color: DARKINK, fontFamily: BODY }}
          >
            <Phone size={15} strokeWidth={2.2} aria-hidden />
            <span className="bg-navphone-num">{PHONE_DISPLAY}</span>
          </a>
          <button
            type="button"
            ref={triggerRef}
            aria-controls="bg-menu"
            aria-expanded={open}
            aria-label={open ? t.ui.menuClose : t.ui.menuOpen}
            onClick={e => { viaKey.current = e.detail === 0; setOpen(o => !o) }}
            className="bg-burger relative inline-flex h-11 shrink-0 items-center gap-3 rounded-full border pl-4 pr-3 md:pl-5"
            style={{ borderColor: open ? AMBER : 'rgba(243,240,234,0.22)', color: INK, fontFamily: MONO, transition: 'border-color .3s' }}
          >
            <span className="hidden text-[12px] uppercase tracking-[0.18em] md:inline">{open ? (lang === 'is' ? 'Loka' : 'Close') : (lang === 'is' ? 'Valmynd' : 'Menu')}</span>
            <span aria-hidden className="relative inline-flex h-4 w-[22px] items-center justify-center">
              <span className="absolute h-[2px] w-[22px] transition-transform duration-500" style={{ background: AMBER, transform: open ? 'rotate(45deg)' : 'translateY(-4px)', transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)' }} />
              <span className="absolute h-[2px] transition-all duration-500" style={{ background: INK, width: open ? 22 : 14, right: open ? 0 : 0, transform: open ? 'rotate(-45deg)' : 'translateY(4px)', transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)' }} />
            </span>
          </button>
        </div>
      </div>

      {/* the menu unfolds from under the bar (height 0 → content, then the rows rise in) and folds back the same way */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="menu"
            id="bg-menu"
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={t.ui.menuOpen}
            initial={reduced ? { opacity: 0 } : { height: 0 }}
            animate={reduced ? { opacity: 1 } : { height: 'auto', transition: { duration: 0.6, ease } }}
            exit={reduced ? { opacity: 0 } : { height: 0, transition: { duration: 0.45, ease, delay: 0.08 } }}
            className="overflow-hidden outline-none"
            style={{ borderTop: `1px solid ${HAIR}` }}
          >
            <div className="mx-auto max-h-[calc(100svh-69px)] max-w-[1320px] overflow-y-auto px-5 pb-8 pt-7 md:px-8 md:pb-12 md:pt-10" style={{ overscrollBehavior: 'contain' }} data-lenis-prevent>
              <div className="grid gap-9 md:grid-cols-[1.25fr_1fr_0.8fr] md:gap-12">
                <nav aria-label={lang === 'is' ? 'Síður' : 'Pages'}>
                  <ul>
                    {pages.map((p, i) => (
                      <motion.li key={p.path} {...item(i)} className="border-b" style={{ borderColor: HAIR }}>
                        <a href={pageHref(p.path)} aria-current={ROUTE === p.path ? 'page' : undefined} onClick={() => setOpen(false)} className="bg-menu-link group flex min-h-[56px] items-center justify-between gap-4 py-2">
                          <span style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(1.6rem, 3.4vw, 2.5rem)', lineHeight: 1.05, color: ROUTE === p.path ? AMBER : INK }}>{p.label}</span>
                          <span aria-hidden className="text-[12px] tracking-[0.2em]" style={{ fontFamily: MONO, color: MUT }}>{String(i + 1).padStart(2, '0')}</span>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
                <motion.div {...item(pages.length)}>
                  <p className="text-[12px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: AMBER }}>{lang === 'is' ? 'Þjónusta' : 'Services'}</p>
                  <ul className="mt-3 border-t" style={{ borderColor: HAIR }}>
                    {serviceLinks.map(s => (
                      <li key={s.path} className="border-b" style={{ borderColor: HAIR }}>
                        <a href={pageHref(s.path)} aria-current={ROUTE === s.path ? 'page' : undefined} onClick={() => setOpen(false)} className="bg-link-hover flex min-h-11 items-center text-[16px]" style={{ fontFamily: BODY, color: ROUTE === s.path ? AMBER : INK }}>{s.name}</a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div {...item(pages.length + 1)} className="flex flex-col gap-5">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: AMBER }}>{t.ui.footerContact}</p>
                    <a href={PHONE_HREF} className="bg-link-hover mt-3 block text-[28px] leading-none tabular-nums" style={{ fontFamily: DISPLAY, color: INK }}>{PHONE_DISPLAY}</a>
                    <a href={LUBE_PHONE_HREF} className="bg-link-hover mt-3 inline-flex min-h-11 items-center text-[15px]" style={{ fontFamily: BODY, color: INK }}>{t.ui.footerLube} {LUBE_PHONE_DISPLAY}</a>
                    <p className="text-[14px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>{ADDRESS.street}, {ADDRESS.town}<br />{t.ui.hoursStrip}</p>
                  </div>
                  <div className="sm:hidden"><LangSwitch /></div>
                  <a href={pageHref('/personuvernd/')} onClick={() => setOpen(false)} className="bg-link-hover inline-flex min-h-11 items-center text-[13px] underline underline-offset-4" style={{ fontFamily: MONO, color: MUT }}>{lang === 'is' ? 'Persónuvernd' : 'Privacy'}</a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    {/* dim the page under the open menu; a tap outside closes it */}
    <AnimatePresence>
      {open && (
        <motion.div key="scrim" aria-hidden className="fixed inset-0 z-40" style={{ background: 'rgba(8,7,6,0.55)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }} transition={{ duration: 0.4 }} onClick={() => setOpen(false)} />
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
  const [decoded, setDecoded] = useState(false)
  useEffect(() => {
    let alive = true
    Promise.all(HERO_BG_PHOTOS.map(src => { const image = new Image(); image.src = src; return image.decode().catch(() => undefined) }))
      .then(() => { if (alive) setDecoded(true) })
    return () => { alive = false }
  }, [])
  useEffect(() => {
    if (reduced || narrow || !running || !decoded) return
    const id = window.setInterval(() => {
      // don't burn crossfades in a backgrounded tab
      if (document.hidden) return
      setActive(a => (a + 1) % HERO_BG_PHOTOS.length)
    }, 6500)
    return () => window.clearInterval(id)
  }, [reduced, narrow, running, decoded])
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
          style={{ animationPlayState: running ? 'running' : 'paused' }}
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
      <motion.div className="absolute inset-0" style={{ y: reduced || narrow ? 0 : y }}>
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
          initial={reduced ? false : { opacity: 0, y: 12 }}
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
            /* The pt/-mt pair keeps the mask box tall enough that Í's acute
               never clips against the overflow-hidden edge. It MUST be in em,
               not a fixed 8px: measured 2026-09-22, Í's ink ascent is 0.917em
               against 0.70em for every unaccented cap, so the acute sits
               0.1875em above the line box at any size. At 8px the accent was
               cut off completely from 48px up — the hero read "HEFÐI I
               SKORIST". 0.24em carries it with margin to spare. The negative
               margin cancels the padding exactly, so line spacing is
               unchanged. [[icelandic-titles-break-a-display-scale]] */
            <span
              key={i}
              className="inline-block overflow-hidden pb-1 align-top"
              style={{ paddingTop: '0.24em', marginTop: '-0.24em' }}
            >
              <motion.span
                className="inline-block"
                initial={reduced ? false : { y: '118%' }}
                animate={on ? { y: '0%' } : { y: '118%' }}
                transition={{ duration: reduced ? 0 : 1.2, ease: EASE, delay: reduced ? 0 : 0.28 + i * 0.05 }}
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
          initial={reduced ? false : { scaleX: 0 }}
          animate={on ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
        />
        <motion.p
          className="mt-6 max-w-xl text-[17px] leading-relaxed md:text-lg"
          style={{ fontFamily: BODY, color: INK, textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
          initial={reduced ? false : { opacity: 0, y: 12 }}
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
        {/* proof row: the verified differentiators, each with its own mark */}
        <motion.ul
          className="mt-9 flex flex-col flex-wrap gap-x-3 gap-y-2 sm:flex-row sm:items-center"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
        >
          {t.ui.proofRow.map((item, n) => {
            const Icon = n === 0 ? BadgeCheck : FileCheck2
            return (
              <li key={item} className="inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-[13px]"
                style={{ fontFamily: BODY, color: INK, borderColor: 'rgba(243,240,234,0.18)', background: 'rgba(15,13,11,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                <Icon size={15} strokeWidth={2} aria-hidden style={{ color: AMBER }} />
                {item}
              </li>
            )
          })}
        </motion.ul>
      </div>
      <HeroStatus on={on} />
      {!reduced && (
        <motion.div aria-hidden className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 xl:flex"
          initial={{ opacity: 0 }} animate={on ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1.2, duration: 0.6 }}>
          <span className="relative block h-10 w-px overflow-hidden" style={{ background: 'rgba(243,240,234,0.18)' }}>
            <span className="bg-scroll-cue absolute inset-x-0 top-0 block h-4" style={{ background: AMBER }} />
          </span>
        </motion.div>
      )}
    </section>
  )
}

/** Desktop hero card: the live open/closed state from the published hours, the number, and the claim route. */
function HeroStatus({ on }: { on: boolean }) {
  const { lang } = useT()
  const reduced = useReducedMotion()
  const [status, setStatus] = useState(() => shopStatus(new Date(), lang))
  useEffect(() => {
    setStatus(shopStatus(new Date(), lang))
    const id = window.setInterval(() => setStatus(shopStatus(new Date(), lang)), 60_000)
    return () => window.clearInterval(id)
  }, [lang])
  return (
    <motion.aside
      className="absolute bottom-10 right-8 z-[2] hidden w-[300px] rounded-[22px] border p-5 lg:block"
      style={{ borderColor: 'rgba(243,240,234,0.16)', background: 'rgba(15,13,11,0.62)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
    >
      <p className="inline-flex items-center gap-2 text-[13px]" style={{ fontFamily: BODY, color: INK }}>
        <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${status.open && !reduced ? 'bg-open-pulse' : ''}`} style={{ background: status.open ? '#7CCB7C' : MUT }} />
        {status.text}
      </p>
      <a href={PHONE_HREF} className="bg-link-hover mt-3 block leading-none tabular-nums" style={{ fontFamily: DISPLAY, color: INK, fontSize: '2rem' }}>{PHONE_DISPLAY}</a>
      <p className="mt-1 text-[12.5px]" style={{ fontFamily: MONO, color: MUT }}>{lang === 'is' ? 'Smurstöð' : 'Lube bay'} {LUBE_PHONE_DISPLAY}</p>
      <a href={pageHref('/tjon-og-tryggingar/')} className="bg-hero-claim group mt-4 flex items-center justify-between gap-3 rounded-[14px] border px-4 py-3" style={{ borderColor: 'rgba(232,162,61,0.45)' }}>
        <span className="flex items-center gap-2.5 text-[14.5px] font-semibold" style={{ fontFamily: BODY, color: INK }}><ShieldAlert size={16} aria-hidden style={{ color: AMBER }} />{lang === 'is' ? 'Lentir þú í tjóni?' : 'Had a crash?'}</span>
        <ArrowRight size={16} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: AMBER }} />
      </a>
    </motion.aside>
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
            <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
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
              <p className="mt-3 max-w-[46ch] text-[15.5px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
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
    one headline figure paired with illustrative workshop photography,
    the rest demoted to a quiet row. Replaces the four-across numeral grid
    with its amber tick rail, which read as a generic KPI strip. Same
    verified numbers, static values — only the hierarchy changed. On mobile
    the secondary figures stack as number/label rows instead of squeezing
    three columns of Icelandic labels across 390px. */
function Facts() {
  const { t, lang } = useT()
  const lead = t.facts[1] /* 810 m² is verified; photo is illustrative, not Grófin. */
  const rest = [t.facts[0], t.facts[2], t.facts[3]]
  const icons = [CalendarDays, BadgeCheck, ShieldCheck]
  const val = (f: typeof lead) => (f.num !== null ? <FactValue to={f.num} pad={f.pad} suffix={f.suffix} /> : f.text)
  return (
    <section className="border-y" style={{ borderColor: HAIR, background: SURFACE }}>
      <div className="mx-auto max-w-[1320px] px-5 py-16 md:px-8 md:py-24">
        <div className="relative overflow-hidden rounded-[26px]">
          <ParallaxImage src={IMG.garage} alt={t.ui.garageAlt} className="h-[340px] w-full md:h-[440px]" />
          <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(15,13,11,0.92) 0%, rgba(15,13,11,0.55) 55%, rgba(15,13,11,0.15) 100%)' }} />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <Rise>
              <p className="flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: AMBER }}><Building2 size={15} aria-hidden />{lang === 'is' ? 'Verkstæðið' : 'The workshop'}</p>
              <p className="mt-3 tabular-nums" style={{ fontFamily: EBOLD, color: INK, fontSize: 'clamp(4rem, 11vw, 8.5rem)', lineHeight: 0.9 }}>{val(lead)}</p>
              <TrueLine className="mt-4 w-[min(420px,70%)]" delay={0.25} />
              <p className="mt-4 max-w-[34ch] text-[16.5px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>{lead.label}</p>
            </Rise>
          </div>
          <span className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT, background: 'rgba(15,13,11,0.6)' }}>{lang === 'is' ? 'Mynd til hliðsjónar' : 'Illustrative photo'}</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {rest.map((f, i) => {
            const Icon = icons[i]
            return (
              <Rise key={f.label} delay={i * 0.08}>
                <div className="bg-tile h-full rounded-[22px] border p-6 md:p-7" style={{ borderColor: HAIR, background: BG }}>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full" style={{ background: 'rgba(232,162,61,0.12)', color: AMBER }}><Icon size={19} strokeWidth={1.9} aria-hidden /></span>
                  <p className="mt-6 whitespace-nowrap tabular-nums" style={{ fontFamily: EBOLD, textTransform: 'uppercase', color: INK, fontSize: f.num === null && (f.text ?? '').length > 4 ? 'clamp(1.6rem, 2.6vw, 2.2rem)' : 'clamp(2.2rem, 4vw, 3rem)', lineHeight: 1 }}>{val(f)}</p>
                  <TrueLine className="mt-4 w-16" delay={0.2 + i * 0.1} />
                  <p className="mt-4 text-[12px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: MUT }}>{f.label}</p>
                </div>
              </Rise>
            )
          })}
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
  const [photo, setPhoto] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    let alive = true
    const image = new Image(); image.src = SERVICE_IMGS[active]
    image.decode().catch(() => undefined).then(() => { if (alive) setPhoto(active) })
    return () => { alive = false }
  }, [active])
  /* Every description stays visible at every size. Only the absolutely
     positioned photograph changes; selecting a service never moves a row. */
  /* 90ms hover-intent gate: skimming the cursor down the list no longer
     churns through every row's photo crossfade — only a real
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
        <h2
          className="max-w-3xl text-balance"
          style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}
        >
          {t.ui.servicesTitle}
        </h2>
      </Rise>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.15fr_1fr] md:gap-16">
        {/* photo panel — first on mobile so the tap result is visible. The
            tag sits UNDER the photo as a caption, not on a gradient over it. */}
        <div className="order-first md:order-last">
          <div className="md:sticky md:top-24">
            <div className="relative aspect-video overflow-hidden rounded-[26px] md:aspect-[4/5]">
              <AnimatePresence initial={false}>
                <motion.img
                  key={photo}
                  src={SERVICE_IMGS[photo]}
                  alt={t.ui.serviceAlts[photo]}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: reduced ? 1 : 0, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
                />
              </AnimatePresence>
            </div>
            <p
              className="mt-3 flex items-center gap-3 text-[12.5px] tracking-[0.16em] uppercase"
              style={{ fontFamily: MONO, color: MUT }}
            >
              <span aria-hidden className="inline-block h-px w-5 shrink-0" style={{ background: AMBER }} />
              {t.services[photo].tag}
            </p>
            <div className="bg-service-strip" aria-label={t.ui.servicesTitle}>
              {t.services.map((service, i) => <button key={service.name} type="button"
                onClick={() => setActive(i)} aria-label={service.name} aria-pressed={active === i}>
                <img src={SERVICE_IMGS[i]} alt="" loading="lazy" />
                <span>{String(i + 1).padStart(2, '0')}</span>
              </button>)}
            </div>
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
                  aria-pressed={on}
                  className="bg-service-row group flex w-full cursor-pointer items-baseline gap-3 py-5 text-left md:gap-5 md:py-6"
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
                        color: INK,
                        transitionProperty: 'transform, color',
                      }}
                    >
                      {s.name}
                    </span>
                    <span className="block max-w-[52ch] pt-2.5 text-[15.5px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
                      {s.desc}
                    </span>
                  </span>
                  <img src={SERVICE_IMGS[i]} alt="" loading="lazy" className="bg-service-thumb" />
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <Rise delay={0.1}>
        {/* self-pay reassurance where services are browsed — the fixed-quote
            fact otherwise only appears deep in the claims rail */}
        <p className="mt-10 text-[15px]" style={{ fontFamily: BODY, color: INK }}>
          {t.ui.selfPayPre}
          <span className="font-semibold">{t.ui.selfPayBold}</span>
          {t.ui.selfPayPost}
        </p>
        <p className="mt-2 text-[15px]" style={{ fontFamily: BODY, color: INK }}>
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
  const { t, lang } = useT()
  const railRef = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    let raf = 0
    const read = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const steps = Array.from(railRef.current?.querySelectorAll<HTMLElement>('[data-claim-step]') ?? [])
        const tops = steps.map(el => el.getBoundingClientRect().top)
        let current = 0
        tops.forEach((top, i) => { if (top < innerHeight * .55) current = i })
        setChapter(current)
      })
    }
    addEventListener('scroll', read, { passive: true }); read()
    return () => { removeEventListener('scroll', read); cancelAnimationFrame(raf) }
  }, [])
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
          <div className="bg-claim-editorial">
            <Rise>
              <h2
                className="text-balance"
                style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}
              >
                {t.insurance.title}
              </h2>
              <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
                {t.insurance.body}
              </p>
              <p className="mt-7 text-[13px] tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                {t.insurance.companies.join(' · ')}
              </p>
            </Rise>
            <div className="bg-claim-chapter">
              <div className="bg-chapter-current" aria-hidden="true">
                <span key={chapter} className={reduced ? '' : 'bg-chapter-arrive'}>{String(chapter + 1).padStart(2, '0')}</span><small>/ 04</small>
              </div>
              <nav aria-label={lang === 'is' ? 'Skref tjónaviðgerðar' : 'Repair steps'}>
                {t.claimSteps.map((step, i) => <a key={step.title} href={`#claim-step-${i}`} aria-current={chapter === i ? 'step' : undefined}
                  onClick={e => { e.preventDefault(); document.getElementById(`claim-step-${i}`)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' }) }}>
                  <span>{String(i + 1).padStart(2, '0')}</span>{step.title}
                </a>)}
              </nav>
            </div>
            <div className="relative mt-8 hidden md:block">
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
              {t.claimSteps.map((s, i) => {
                /* the last dot is where the line lands true — filled amber */
                const last = i === t.claimSteps.length - 1
                return (
                  <li key={s.title} id={`claim-step-${i}`} data-claim-step className="relative scroll-mt-28 border-b pb-8" style={{ borderColor: HAIR }}>
                    <span
                      aria-hidden
                      className="absolute -left-8 top-2 block h-2.5 w-2.5 rounded-full md:-left-10 md:h-3 md:w-3"
                      style={{ background: last ? AMBER : BG, border: `2px solid ${last ? AMBER : MUT}` }}
                    />
                    <Rise delay={i * 0.06}>
                      <p className="text-[13px] tracking-[0.16em]" style={{ fontFamily: MONO, color: AMBER }}>
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <h3
                        className="mt-2"
                        style={{
                          fontFamily: EBOLD, textTransform: 'uppercase',
                          fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {s.title}
                      </h3>
                      <p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
                        {s.desc}
                      </p>
                    </Rise>
                  </li>
                )
              })}
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
              <p className="mt-12 text-[16px]" style={{ fontFamily: BODY, color: INK }}>
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
            <h2
              className="text-balance"
              style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}
            >
              {t.brands.title}
            </h2>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
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

/** Real, verbatim customer reviews (see translations.ts provenance note),
    set as type on the page instead of a card marquee (2026-09-22). The one
    real story — a car that broke down on the way to the airport, fixed the
    same day at a fair price — is the strongest proof the shop has, so it is
    set large; the short ones read as a hairline list beside it. The rating
    line cites platform and count, and links to the listing. Nothing here
    is padded or split; seven reviews, seven entries. */
function Stars({ value = 5, size = 16 }: { value?: number; size?: number }) {
  /* filled to the exact rating (4,0 → four full stars, one hairline); amber on the warm ground */
  return (
    <span className="inline-flex items-center gap-[3px]" role="img" aria-label={`${String(value).replace('.', ',')} / 5`}>
      {[0, 1, 2, 3, 4].map(i => {
        const fill = Math.max(0, Math.min(1, value - i))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} strokeWidth={1.6} style={{ color: 'rgba(232,162,61,0.45)', position: 'absolute', inset: 0 }} aria-hidden />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} strokeWidth={1.6} fill={AMBER} style={{ color: AMBER }} aria-hidden />
            </span>
          </span>
        )
      })}
    </span>
  )
}

const REVIEW_MS = 7000
const LIVE_REVIEWS = 'https://sndr-reviews.sindri-381.workers.dev/?site=bilageirinn'
interface LiveReview { name: string; profile: string | null; stars: number; original: string; originalLang: string | null; english: string | null; uri: string | null }
interface Live { rating: number | null; count: number | null; mapsUri: string | null; reviews: LiveReview[] }
type Shown = Review & { stars?: number; profile?: string | null }
/** Fresh from Google when the section comes near (never stored anywhere); the saved reviews stay as the fallback. */
function useLiveReviews(near: boolean) {
  const [live, setLive] = useState<Live | null>(null)
  useEffect(() => {
    if (!near || live) return
    const ctl = new AbortController()
    fetch(LIVE_REVIEWS, { signal: ctl.signal }).then(r => r.json()).then(d => { if (d?.ok && typeof d.rating === 'number') setLive(d) }).catch(() => { /* saved reviews stay */ })
    return () => ctl.abort()
  }, [near, live])
  return live
}
function Reviews() {
  const { t, lang } = useT()
  const reduced = useReducedMotion()
  const saved = t.ui.reviews as Review[]
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px' })
  const near = useInView(ref, { margin: '900px 0px', once: true })
  const live = useLiveReviews(near)
  const all: Shown[] = useMemo(() => {
    if (!live) return saved
    const fresh: Shown[] = live.reviews.map(x => {
      const useEnglish = lang === 'en' && x.originalLang !== 'en' && !!x.english
      return { name: x.name, source: 'Google', quote: useEnglish ? x.english! : x.original, translated: useEnglish, stars: x.stars, profile: x.profile }
    })
    const seen = new Set(fresh.map(x => x.name.trim().toLowerCase()))
    return [...fresh, ...saved.filter(x => !seen.has(x.name.trim().toLowerCase()))]
  }, [live, saved, lang])
  const ratingValue = live?.rating ?? 4
  const ratingText = ratingValue.toFixed(1).replace('.', lang === 'is' ? ',' : '.')
  const countText = live?.count != null ? (lang === 'is' ? `${live.count} umsagnir á Google` : `${live.count} reviews on Google`) : t.ui.reviewsGoogle.replace(/^4[,.]0 (af|of) 5 · /, '')
  /* the featured review changes by itself while the section is on screen; hover, focus or a hidden tab pause it */
  useEffect(() => {
    if (reduced || paused || !inView) return
    const id = window.setTimeout(() => setI(n => (n + 1) % all.length), REVIEW_MS)
    return () => window.clearTimeout(id)
  }, [i, paused, inView, reduced, all.length])
  useEffect(() => {
    const vis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', vis)
    return () => document.removeEventListener('visibilitychange', vis)
  }, [])
  const r = all[i % all.length]
  const byline = (x: Shown) => `${x.name} · ${x.source}${x.translated ? ` · ${t.ui.reviewsTranslatedNote}` : ''}`
  const rating = (x: Shown) => x.source === 'Google'
    ? <Stars value={x.stars ?? 5} size={15} />
    : <span className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: AMBER }}><ThumbsUp size={14} strokeWidth={2} aria-hidden />{lang === 'is' ? 'Mælir með' : 'Recommends'}</span>
  return (
    <section ref={ref} className="border-t py-24 md:py-36" style={{ borderColor: HAIR, background: BG }}>
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Rise>
            <h2 className="text-balance" style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}>
              {t.ui.reviewsTitle}
            </h2>
          </Rise>
          <Rise>
            <a href={live?.mapsUri ?? 'https://www.google.com/maps/search/B%C3%ADlageirinn+ehf+Gr%C3%B3fin+14a+Reykjanesb%C3%A6'} target="_blank" rel="noreferrer"
              className="bg-rating group flex items-center gap-4 rounded-[20px] border px-5 py-4" style={{ borderColor: HAIR, background: SURFACE }}>
              <span className="tabular-nums" style={{ fontFamily: DISPLAY, fontSize: '2.6rem', lineHeight: 1, color: INK }}>{ratingText}</span>
              <span className="flex flex-col gap-1.5">
                <Stars value={ratingValue} size={18} />
                <span className="text-[13px]" style={{ fontFamily: BODY, color: INK }}>{countText}</span>
              </span>
              <ArrowUpRight size={18} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" style={{ color: AMBER }} />
            </a>
          </Rise>
        </div>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[1.25fr_0.75fr] md:gap-20"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <figure className="relative min-h-[300px] md:min-h-[340px]" aria-live="polite">
            <Quote size={40} strokeWidth={1.4} aria-hidden style={{ color: AMBER }} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={r.name + lang}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(4px)', transition: { duration: 0.35, ease: 'easeIn' } }}>
                <div className="mt-5">{rating(r)}</div>
                <blockquote className="mt-5 text-balance" style={{ fontFamily: BODY, color: INK, fontSize: 'clamp(1.35rem, 2.3vw, 2rem)', lineHeight: 1.42 }}>
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-[12px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: MUT }}>{byline(r)}</figcaption>
              </motion.div>
            </AnimatePresence>
          </figure>

          <div>
            {/* the amber line fills while a review is on show: the True Line as a timer */}
            <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ background: HAIR }}>
              {!reduced && <motion.div key={`${i}-${paused}-${inView}`} className="h-full origin-left" style={{ background: AMBER }}
                initial={{ scaleX: 0 }} animate={{ scaleX: paused || !inView ? 0 : 1 }} transition={{ duration: paused || !inView ? 0.2 : REVIEW_MS / 1000, ease: 'linear' }} />}
            </div>
            <ul className="mt-2">
              {all.map((x, n) => (
                <li key={x.name} className="border-b" style={{ borderColor: HAIR }}>
                  <button type="button" onClick={() => setI(n)} aria-pressed={n === i % all.length}
                    className="bg-review-pick flex min-h-[52px] w-full items-center justify-between gap-4 py-2 text-left">
                    <span className="flex items-center gap-3">
                      <span aria-hidden className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold transition-colors duration-300"
                        style={{ background: n === i ? AMBER : SURFACE, color: n === i ? DARKINK : INK, fontFamily: BODY }}>{x.name.trim().charAt(0)}</span>
                      <span className="text-[15.5px] transition-colors" style={{ fontFamily: BODY, color: n === i % all.length ? INK : MUT }}>{x.name}</span>
                    </span>
                    <span className="text-[11px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: n === i ? AMBER : MUT }}>{x.source}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2">
              <button type="button" aria-label={lang === 'is' ? 'Fyrri umsögn' : 'Previous review'} onClick={() => setI(n => (n - 1 + all.length) % all.length)}
                className="bg-btn inline-flex h-11 w-11 items-center justify-center rounded-full border" style={{ borderColor: HAIR, color: INK }}><ChevronLeft size={18} aria-hidden /></button>
              <button type="button" aria-label={lang === 'is' ? 'Næsta umsögn' : 'Next review'} onClick={() => setI(n => (n + 1) % all.length)}
                className="bg-btn inline-flex h-11 w-11 items-center justify-center rounded-full border" style={{ borderColor: HAIR, color: INK }}><ChevronRight size={18} aria-hidden /></button>
              <span className="ml-2 text-[12px] tabular-nums tracking-[0.14em]" style={{ fontFamily: MONO, color: MUT }}>{String((i % all.length) + 1).padStart(2, '0')} / {String(all.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        <p className="mt-10 text-[13px]" style={{ fontFamily: MONO, color: MUT }}>
          {t.ui.reviewsSource}{live ? (lang === 'is' ? ' Einkunn og nýjustu umsagnir sóttar beint frá ' : ' Rating and latest reviews straight from ') : ''}{live && <span translate="no">Google Maps</span>}{live ? '.' : ''}
        </p>
      </div>
    </section>
  )
}

function Workshop() {
  const { t, lang } = useT()
  const facts = [
    { Icon: Building2, k: lang === 'is' ? 'Húsnæði' : 'Building', v: '810 m²', s: lang === 'is' ? 'Grófin 14a, frá 2007' : 'Grófin 14a, since 2007' },
    { Icon: MapPin, k: t.ui.locationLabel, v: ADDRESS.street, s: ADDRESS.town, href: MAPS },
    { Icon: Phone, k: lang === 'is' ? 'Verkstæði' : 'Workshop', v: PHONE_DISPLAY, s: `${t.ui.footerLube} ${LUBE_PHONE_DISPLAY}`, href: PHONE_HREF },
  ]
  return (
    <section id="verkstaedid" className="scroll-mt-20 border-t" style={{ borderColor: HAIR }}>
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-36">
        <div className="grid gap-12 md:grid-cols-[0.95fr_1.05fr] md:gap-16">
          <figure className="md:sticky md:top-28 md:self-start">
            <ClipImage src={IMG.garage} alt={t.ui.garageAlt} className="aspect-[4/3] rounded-[26px] md:aspect-[4/5]" />
            <figcaption className="bg-workshop-caption"><span>Grófin 14a · Reykjanesbær</span><span>{lang === 'is' ? 'Mynd til hliðsjónar' : 'Illustrative photograph'}</span></figcaption>
          </figure>
          <div>
            <Rise>
              <p className="flex items-center gap-2 text-[12.5px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: AMBER }}><Warehouse size={15} aria-hidden />{lang === 'is' ? 'Verkstæðið' : 'The workshop'}</p>
              <h2 className="mt-4 text-balance" style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }}>{t.facility.title}</h2>
              <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>{t.facility.body}</p>
            </Rise>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {facts.map(({ Icon, k, v, s, href }, n) => {
                const inner = (
                  <>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgba(232,162,61,0.12)', color: AMBER }}><Icon size={18} strokeWidth={1.9} aria-hidden /></span>
                    <span className="mt-4 block text-[11.5px] tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: MUT }}>{k}</span>
                    <span className="mt-1 block text-[19px] font-semibold tabular-nums" style={{ fontFamily: BODY, color: INK }}>{v}</span>
                    <span className="mt-1 block text-[13.5px]" style={{ fontFamily: BODY, color: MUT }}>{s}</span>
                  </>
                )
                return (
                  <Rise key={k} delay={n * 0.06}>
                    {href
                      ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="bg-tile block h-full rounded-[20px] border p-5" style={{ borderColor: HAIR, background: SURFACE }}>{inner}</a>
                      : <div className="bg-tile h-full rounded-[20px] border p-5" style={{ borderColor: HAIR, background: SURFACE }}>{inner}</div>}
                  </Rise>
                )
              })}
            </div>

            <Rise>
              <p className="mt-12 flex items-center gap-2 text-[12.5px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: AMBER }}><Users size={15} aria-hidden />{lang === 'is' ? 'Fólkið' : 'The people'}</p>
            </Rise>
            <ul className="mt-4 border-t" style={{ borderColor: HAIR }}>
              {t.team.map((p, n) => (
                <Rise key={p.name} delay={n * 0.07}>
                  <li className="flex items-center gap-4 border-b py-4" style={{ borderColor: HAIR }}>
                    <span aria-hidden className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-[14px] font-semibold" style={{ borderColor: 'rgba(232,162,61,0.5)', color: AMBER, fontFamily: BODY }}>
                      {p.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[16.5px] font-semibold" style={{ fontFamily: BODY, color: INK }}>{p.name}</span>
                      <span className="block text-[12px] tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: MUT }}>{p.role}{p.detail ? ` · ${p.detail}` : ''}</span>
                    </span>
                  </li>
                </Rise>
              ))}
            </ul>

            <Rise>
              <div className="mt-10 rounded-[20px] border p-5 md:p-6" style={{ borderColor: HAIR }}>
                <p className="flex items-center gap-2 text-[12.5px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: AMBER }}><Clock size={15} aria-hidden />{t.ui.hoursLabel}</p>
                <ul className="mt-3">
                  {t.hours.map(h => (
                    <li key={h.days} className="flex items-baseline justify-between gap-4 border-b py-2.5 text-[15.5px] last:border-b-0" style={{ borderColor: HAIR, fontFamily: BODY }}>
                      <span style={{ color: INK }}>{h.days}</span>
                      <span className="shrink-0 tabular-nums" style={{ color: h.close ? INK : MUT }}>{h.close ? `${h.open}${lang === 'is' ? ' til ' : ' to '}${h.close}` : h.open}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Open-now from the published hours (Iceland keeps UTC all year, so UTC clock = shop clock). */
function shopStatus(now: Date, lang: Lang) {
  const day = now.getUTCDay(), min = now.getUTCHours() * 60 + now.getUTCMinutes()
  const close = day >= 1 && day <= 4 ? 17 * 60 : day === 5 ? 15 * 60 : 0
  const open = 8 * 60
  const is = lang === 'is'
  if (close && min >= open && min < close) return { open: true, text: is ? `Opið núna · lokar kl. ${close / 60}:00` : `Open now · closes ${close / 60}:00` }
  if (close && min < open) return { open: false, text: is ? 'Lokað · opnar kl. 08:00 í dag' : 'Closed · opens 08:00 today' }
  const next = day === 5 || day === 6 || day === 0 ? (is ? 'á mánudag' : 'Monday') : (is ? 'á morgun' : 'tomorrow')
  return { open: false, text: is ? `Lokað · opnar kl. 08:00 ${next}` : `Closed · opens 08:00 ${next}` }
}

function MapSection() {
  const { t, lang } = useT()
  const reduced = useReducedMotion()
  const q = encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.town}`)
  const mapSrc = `https://www.google.com/maps?q=${q}&z=16&output=embed`
  const [status, setStatus] = useState(() => shopStatus(new Date(), lang))
  useEffect(() => {
    setStatus(shopStatus(new Date(), lang))
    const id = window.setInterval(() => setStatus(shopStatus(new Date(), lang)), 60_000)
    return () => window.clearInterval(id)
  }, [lang])
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${ADDRESS.street}, ${ADDRESS.town}`); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch { /* clipboard blocked: the address is visible anyway */ }
  }
  const routes = [
    { label: 'Google Maps', href: `https://www.google.com/maps/dir/?api=1&destination=${q}` },
    { label: 'Apple Maps', href: `https://maps.apple.com/?daddr=${q}` },
    { label: 'Waze', href: `https://waze.com/ul?q=${q}&navigate=yes` },
  ]
  return (
    <section className="relative border-t" style={{ borderColor: HAIR }} aria-labelledby="bg-map-title">
      <div className="bg-map-dark relative h-[58svh] min-h-[380px] w-full md:h-[86vh] md:min-h-[560px]">
        <iframe title={t.ui.mapTitle} src={mapSrc} className="absolute inset-0 h-full w-full" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28" style={{ background: `linear-gradient(${BG}, rgba(15,13,11,0))` }} />
      <div className="pointer-events-none relative -mt-16 flex items-end md:absolute md:inset-0 md:mt-0">
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-5 md:px-8 md:pb-10">
          <motion.div
            className="pointer-events-auto w-full max-w-[440px] rounded-[26px] border p-6 md:p-7"
            style={{ borderColor: HAIR, background: 'rgba(15,13,11,0.9)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
            initial={reduced ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-15% 0px' }} transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: AMBER }}><Navigation size={14} aria-hidden />{lang === 'is' ? 'Staðsetning' : 'Location'}</p>
            <h2 id="bg-map-title" className="mt-3" style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', lineHeight: 1.05, color: INK }}>{t.ui.mapTitle}</h2>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="text-[16px]" style={{ fontFamily: BODY, color: INK }}>{ADDRESS.street}, {ADDRESS.town}</p>
              <button type="button" onClick={copy} className="bg-btn inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[12.5px]" style={{ borderColor: HAIR, color: copied ? AMBER : MUT, fontFamily: BODY }}>
                {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}{copied ? (lang === 'is' ? 'Afritað' : 'Copied') : (lang === 'is' ? 'Afrita' : 'Copy')}
              </button>
            </div>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px]" aria-live="polite" style={{ fontFamily: BODY, background: status.open ? 'rgba(120,190,120,0.14)' : 'rgba(243,240,234,0.07)', color: INK }}>
              <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${status.open && !reduced ? 'bg-open-pulse' : ''}`} style={{ background: status.open ? '#7CCB7C' : MUT }} />
              {status.text}
            </p>
            <p className="mt-5 text-[11.5px] tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: MUT }}>{lang === 'is' ? 'Leiðarlýsing' : 'Directions'}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {routes.map(r => (
                <a key={r.label} href={r.href} target="_blank" rel="noreferrer" className="bg-btn inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-[14px]" style={{ borderColor: HAIR, color: INK, fontFamily: BODY }}>
                  {r.label}<ArrowUpRight size={14} aria-hidden style={{ color: AMBER }} />
                </a>
              ))}
            </div>
            <a href={PHONE_HREF} className="bg-btn bg-btn-solid mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-[14.5px] font-semibold" style={{ background: AMBER, color: DARKINK, fontFamily: BODY }}>
              <Phone size={15} aria-hidden />{lang === 'is' ? 'Hringja á undan' : 'Call ahead'} · {PHONE_DISPLAY}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
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
              <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed md:mx-0" style={{ fontFamily: BODY, color: INK }}>
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
            <EnquiryForm />
          </Rise>
        </div>
      </div>
    </section>
  )
}

/** The shop's own footer — the page used to end at the studio disclaimer with
    no address, hours or company number anywhere below the contact form.
    Built to the phone structure first [[mobile-footer-structure]]: wordmark
    and company block full width, the hours as a spec list (day left, time
    right, hairlines between), the two short lists side by side, then the
    legal line on its own row. Desktop spreads the same blocks over four
    columns. */
function SiteFooter() {
  const { t, lang } = useT()
  const reduced = useReducedMotion()
  const wordRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: wordRef, offset: ['start end', 'end end'] })
  const wordY = useTransform(scrollYProgress, [0, 1], ['38%', '0%'])
  const links = NAV_PAGES(lang).map(p => ({ href: pageHref(p.path), label: p.label }))
  const head = 'flex items-center gap-2 text-[11.5px] tracking-[0.18em] uppercase'
  const row = 'bg-link-hover inline-flex min-h-11 items-center text-[15px]'
  const [status, setStatus] = useState(() => shopStatus(new Date(), lang))
  useEffect(() => { setStatus(shopStatus(new Date(), lang)) }, [lang])
  return (
    <footer className="relative overflow-hidden border-t" style={{ borderColor: HAIR, background: SURFACE }}>
      {/* the closing call: the slogan, the number, the line drawn under it */}
      <div className="mx-auto max-w-[1320px] px-5 pt-16 md:px-8 md:pt-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Rise>
            <a href={pageHref('/')} className="bg-logo inline-flex items-center gap-3" aria-label="Bílageirinn">
              <img src={ICON_CONCEPT} alt="" className="h-10 w-auto md:h-12" style={{ filter: 'brightness(0) invert(0.96)' }} />
              <span className="flex flex-col leading-[0.9]">
                <span style={{ fontFamily: LOGO, fontWeight: 900, fontSize: 'clamp(26px, 4vw, 34px)', color: INK, letterSpacing: '-0.015em' }}>Bílageirinn</span>
                <span style={{ fontFamily: LOGO, fontWeight: 600, fontSize: 'clamp(9px, 1.2vw, 11px)', color: MUT, letterSpacing: '0.2em', alignSelf: 'flex-end', marginTop: '3px' }}>BÍLAÞJÓNUSTA</span>
              </span>
            </a>
            <p className="mt-6 max-w-[22ch] text-balance" style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)', lineHeight: 1.05, color: INK }}>
              {lang === 'is' ? 'Eins og ekkert hefði í skorist.' : 'As if it never happened.'}
            </p>
          </Rise>
          <Rise>
            <a href={PHONE_HREF} className="bg-cta-display block leading-none tabular-nums" style={{ fontFamily: DISPLAY, color: AMBER, fontSize: 'clamp(2.6rem, 6.4vw, 4.6rem)' }}>{PHONE_DISPLAY}</a>
            <TrueLine className="mt-3 w-full" delay={0.2} />
            <p className="mt-3 inline-flex items-center gap-2 text-[13px]" style={{ fontFamily: BODY, color: INK }}>
              <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${status.open && !reduced ? 'bg-open-pulse' : ''}`} style={{ background: status.open ? '#7CCB7C' : MUT }} />
              {status.text}
            </p>
          </Rise>
        </div>

        <div className="mt-16 grid gap-10 border-t pt-12 md:mt-20 md:grid-cols-[1fr_1fr_0.8fr_1.1fr] md:gap-12" style={{ borderColor: HAIR }}>
          <div>
            <p className={head} style={{ fontFamily: MONO, color: AMBER }}><MapPin size={14} aria-hidden />{t.ui.locationLabel}</p>
            <p className="mt-3 text-[15.5px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>{ADDRESS.street}<br />{ADDRESS.town}</p>
            <a href={MAPS} target="_blank" rel="noreferrer" className={`${row} gap-1.5 underline underline-offset-4`} style={{ color: INK, fontFamily: BODY }}>{lang === 'is' ? 'Leiðarlýsing' : 'Directions'}<ArrowUpRight size={14} aria-hidden style={{ color: AMBER }} /></a>
          </div>
          <div>
            <p className={head} style={{ fontFamily: MONO, color: AMBER }}><Clock size={14} aria-hidden />{t.ui.hoursLabel}</p>
            <ul className="mt-3 border-t" style={{ borderColor: HAIR }}>
              {t.hours.map((h, i) => (
                <li key={h.days} className="flex items-baseline justify-between gap-4 border-b py-2.5 text-[15px]" style={{ borderColor: HAIR, fontFamily: BODY }}>
                  <span style={{ color: INK }}>{t.ui.hoursShort[i] ?? h.days}</span>
                  <span className="shrink-0 tabular-nums" style={{ color: h.close ? INK : MUT }}>{h.close ? `${h.open}${lang === 'is' ? ' til ' : ' to '}${h.close}` : h.open}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={head} style={{ fontFamily: MONO, color: AMBER }}><Menu size={14} aria-hidden />{t.ui.footerOnPage}</p>
            <ul className="mt-2 flex flex-col" style={{ fontFamily: BODY }}>
              {links.map(l => <li key={l.href}><a href={l.href} className={`${row} bg-foot-link`} style={{ color: INK }}>{l.label}</a></li>)}
            </ul>
          </div>
          <div className="min-w-0">
            <p className={head} style={{ fontFamily: MONO, color: AMBER }}><Phone size={14} aria-hidden />{t.ui.footerContact}</p>
            <ul className="mt-2 flex flex-col" style={{ fontFamily: BODY }}>
              <li><a href={PHONE_HREF} className={`${row} gap-2 tabular-nums`} style={{ color: INK }}><Wrench size={14} aria-hidden style={{ color: MUT }} />{lang === 'is' ? 'Verkstæði' : 'Workshop'} {PHONE_DISPLAY}</a></li>
              <li><a href={LUBE_PHONE_HREF} className={`${row} gap-2 tabular-nums`} style={{ color: INK }}><Droplet size={14} aria-hidden style={{ color: MUT }} />{t.ui.footerLube} {LUBE_PHONE_DISPLAY}</a></li>
              <li><a href={`mailto:${EMAIL}`} className={`${row} gap-2 [overflow-wrap:anywhere]`} style={{ color: INK }}><Mail size={14} aria-hidden style={{ color: MUT }} />{EMAIL}</a></li>
              <li><a href={FACEBOOK} target="_blank" rel="noreferrer" className={`${row} gap-2`} style={{ color: INK }}><ArrowUpRight size={14} aria-hidden style={{ color: MUT }} />Facebook</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* signature: the name set edge to edge, rising into place as the page ends, the amber line beneath it */}
      <div ref={wordRef} aria-hidden className="mt-14 overflow-hidden md:mt-20">
        <motion.p className="select-none whitespace-nowrap text-center leading-[0.8]" style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: '15.6vw', letterSpacing: '-0.01em', color: 'transparent', WebkitTextStroke: '1px rgba(243,240,234,0.28)', y: reduced ? 0 : wordY }}>
          Bílageirinn
        </motion.p>
      </div>
      <div className="mx-auto max-w-[1320px] px-5 md:px-8"><TrueLine className="w-full" delay={0.1} /></div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 py-6 text-[12.5px] tracking-[0.06em] md:flex-row md:items-center md:justify-between md:px-8" style={{ fontFamily: MONO, color: MUT }}>
        <p>© {new Date().getFullYear()} Bílageirinn ehf · Kt. {KT}</p>
        <p className="flex items-center gap-5">
          <a href={pageHref('/personuvernd/')} className="bg-link-hover inline-flex min-h-11 items-center">{lang === 'is' ? 'Persónuvernd' : 'Privacy'}</a>
          <a href="https://sndrstudio.is/" title="SNDR Studio" className="bg-link-hover inline-flex min-h-11 items-center">Vefur: SNDR Studio</a>
        </p>
      </div>
    </footer>
  )
}

/* ─────────────────────────────── the page ─────────────────────────────── */

export default function Page() {
  const reduced = useReducedMotion()
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
    if (ROUTE !== '/') return
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
      legalName: 'Bílageirinn ehf',
      taxID: KT,
      url: 'https://bilageirinn.is',
      sameAs: [FACEBOOK],
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
    /* never a JS scroll surface on a phone — see isTouch() above */
    const lenis = isTouch() ? null : new Lenis({ duration: 1.1 })
    if (!lenis) return
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
      return !new URLSearchParams(location.search).has('intro') && sessionStorage.getItem('bg-intro-seen') === '1'
    } catch {
      return false
    }
  }, [])
  const MIN_VISIBLE_MS = introSeen || reduced ? 0 : 1200
  const GATE_KEYS = useMemo(() => ['fonts', 'hero', 'icon'] as const, [])
  const [ready, setReady] = useState<Record<string, boolean>>({})
  const [forced, setForced] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(MIN_VISIBLE_MS === 0)
  const mark = useCallback((k: string) => setReady(r => (r[k] ? r : { ...r, [k]: true })), [])
  const readyCount = GATE_KEYS.reduce((n, k) => n + (ready[k] ? 1 : 0), 0)
  const assetsReady = !!reduced || ((forced || readyCount === GATE_KEYS.length) && minTimeElapsed)
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
    const t = window.setTimeout(() => setOverlayMounted(false), 1200)
    return () => window.clearTimeout(t)
  }, [assetsReady])

  return (
    <LangCtx.Provider value={langValue}>
    <div className="bg-page min-h-screen antialiased" style={{ fontFamily: BODY }}>
      <style>{CSS}</style>
      {ROUTE === '/' && overlayMounted && !introSeen && !reduced && <BilageirinnLoading visible={!assetsReady} progress={loadProgress} />}
      {/* first in flow, phones only: the sticky awning that owns the island strip */}
      <div aria-hidden className="bg-awning" />
      <Nav lenisRef={lenisRef} start={assetsReady} />
      <main>
        {ROUTE !== '/' ? <InnerRoute /> : <>
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
        </>}
      </main>
      <SiteFooter />

    </div>
    </LangCtx.Provider>
  )
}

function InnerRoute() {
  if (ROUTE === '/thjonusta/') return <OverviewPage />
  const svc = ROUTE.match(/^\/thjonusta\/([a-z-]+)\/$/)
  if (svc) return <ServicePage slug={svc[1]} />
  if (ROUTE === '/tjon-og-tryggingar/') return <ClaimsPage />
  if (ROUTE === '/um-okkur/') return <AboutPage />
  if (ROUTE === '/hafa-samband/') return <ContactPage />
  if (ROUTE === '/personuvernd/') return <PrivacyPage />
  return <NotFoundPage />
}

export { ClipImage, ParallaxImage, Rise, TrueLine, shopStatus, useT }
