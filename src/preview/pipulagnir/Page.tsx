/* ─── Pípulagnir Suðurlands · „HEITT OG KALT" ────────────────────────────
   The red and blue tap markers every Icelandic household knows become the
   design system: warm and cool grounds alternate down the page the way hot
   and cold water run through a house, and a thin rail on the left edge
   fills red through warm sections and blue through cool ones as you scroll.

   FONT NOTE FOR THE LEAD — this page self-loads Archivo (variable, expanded
   width) from Google Fonts in a useEffect. To move it into index.html, add:
     <link rel="preconnect" href="https://fonts.googleapis.com" />
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
     <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,600..900&display=swap" rel="stylesheet" />
   Optional @theme token for index.css:
     --font-archivo: 'Archivo', 'Arial Black', sans-serif;
   Satoshi + Geist Mono load from the repo's own public/fonts. ─────────── */
import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode, RefObject } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Img } from '../../components/Img'
import {
  ABOUT,
  ADDRESS,
  COLD,
  CONTACT,
  EMAIL,
  FACTS,
  FOOTNOTE,
  HEAT,
  HERO,
  IMG,
  LOGO,
  MAPS,
  PHONE2_DISPLAY,
  PHONE2_HREF,
  PHONE_DISPLAY,
  PHONE_HREF,
  REVIEWS,
  SEO,
  SERVICES,
  u,
} from './data'

const company = getPreviewCompany('pipulagnir')

/* Palette — AA verified 2026-07-13 (WCAG relative-luminance math):
   ink on bone 15.55 · red #921B1E on bone 7.83 · blue #1E4E63 on bone 8.08
   white on red 8.76 · white on blue 9.03 · bone on near-black 16.38
   muted #5F5B54 on bone 6.04 · muted #A8A49C on near-black 7.38
   warm tint #E89B94 on dark 8.33 · cool tint #9CC6DA on dark 10.03
   red-tint text #F0C9C7 on red 5.79 · blue-tint #BFD9E4 on blue 6.13

   ELEVATION PASS V2 (2026-07-13) — new elements, no new colors introduced:
   · rail wayfinding chip text: reuses white-on-red 8.76:1 / white-on-blue
     9.03:1 above (already verified) — the chip's background is always the
     rail's own current RED/BLUE, text always white.
   · ghost section numerals (01-06): aria-hidden, decorative, no text
     information conveyed (WCAG 1.4.3 doesn't apply to non-text decoration),
     so no contrast ratio is claimed for the numeral itself. What matters is
     that they never reduce the READING text's contrast: each numeral sits
     at z-0 behind its heading (z-10, opaque solid ink/white per the ratios
     above) so the heading is never visually blended with the numeral, and
     opacity is kept low (ink 7% on bone, white 14% on red/blue, bone 10% on
     dark) so even where they visually overlap non-text chrome it reads as a
     faint watermark, not a competing shape.
   · "the pour" wave overlay (Heat/Cold band tops): solid RED/BLUE, the
     section's own already-verified background color — introduces no new
     color pair, and settles behind/beside body copy (see PourEdge, sits
     within each section's top padding zone, never under heading text). */
const BONE = '#F4F2EE'
const INK = '#1B1A18'
const RED = '#921B1E'
const BLUE = '#1E4E63'
const DARK = '#141513'
const MUT = '#5F5B54'
const MUTD = '#A8A49C'
const WARM_TINT = '#E89B94'
const COOL_TINT = '#9CC6DA'
const RED_TINT = '#F0C9C7'
const BLUE_TINT = '#BFD9E4'
const HAIR = 'rgba(27,26,24,0.14)'

const DISPLAY = "'Archivo', 'Arial Black', Arial, sans-serif"
const BODY = "'Satoshi', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"
/* Icelandic caps (Í Á Ó Ú Ý Þ Æ Ö): open leading, normal tracking, no clip
   masks over headline glyphs anywhere on this page. */
const H_DISPLAY = { fontFamily: DISPLAY, fontWeight: 800, fontStretch: '125%', letterSpacing: '0', lineHeight: 1.06 } as const
/* Heat/Cold are the two full-bleed band headlines — pushed to a taller clamp
   ceiling than the rest of the page's h2s (elevation pass, move 3). */
const BAND_TITLE = { ...H_DISPLAY, fontSize: 'clamp(1.95rem, 4.8vw, 3.6rem)' } as const
/* Hand-authored liquid-edge wave (move 2, "the pour"). Abstract texture, not
   a diagram of a real object. x in %, y in px from the shape's own top. */
const WAVE_CLIP =
  'polygon(0% 44px,6% 26px,13% 50px,20% 22px,28% 46px,36% 16px,44% 42px,52% 20px,60% 48px,68% 18px,76% 44px,84% 24px,92% 50px,100% 28px,100% 100%,0% 100%)'

const B = import.meta.env.BASE_URL
const EASE = [0.23, 1, 0.32, 1] as const
const ARCHIVO_HREF = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,600..900&display=swap'

const CSS = `
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }

.ps-page { background: ${BONE}; color: ${INK}; }
.ps-page ::selection { background: ${RED}; color: #FFFFFF; }
.ps-page a, .ps-page button, .ps-page input, .ps-page textarea { -webkit-tap-highlight-color: transparent; }
.ps-page :focus-visible { outline: 2px solid ${BLUE}; outline-offset: 3px; border-radius: 2px; }
.ps-dark :focus-visible { outline-color: ${COOL_TINT}; }

/* hero photo settles in on load; scrim keeps the headline zone readable */
@keyframes ps-heroZoom { from { transform: scale(1.1); } to { transform: scale(1); } }
.ps-heroimg { animation: ps-heroZoom 2.6s cubic-bezier(0.23, 1, 0.32, 1) both; }
@media (prefers-reduced-motion: reduce) { .ps-heroimg { animation: none; } }

/* signature rail: always-on decorative liquid-flow texture inside the fill —
   self-contained CSS loop, not scroll-linked, so it's texture, not fake data */
@keyframes ps-railFlow { from { background-position: 0 0; } to { background-position: 0 -28px; } }
.ps-rail-flow {
  position: absolute; inset: 0;
  background-image: repeating-linear-gradient(180deg,
    rgba(255,255,255,0.42) 0px, rgba(255,255,255,0.42) 2px,
    transparent 2px, transparent 9px,
    rgba(255,255,255,0.16) 9px, rgba(255,255,255,0.16) 11px,
    transparent 11px, transparent 22px);
  background-size: 100% 28px;
  mix-blend-mode: overlay;
  animation: ps-railFlow 2.1s linear infinite;
}
@media (prefers-reduced-motion: reduce) { .ps-rail-flow { animation: none; } }

/* rail wayfinding chip — text on top of RED/BLUE (verified 8.76:1 / 9.03:1) */
.ps-rail-chip {
  position: absolute;
  left: 18px;
  padding: 5px 10px;
  border-radius: 3px;
  color: #FFFFFF;
  white-space: nowrap;
  pointer-events: none;
  transition: background-color 0.45s ease, opacity 0.35s ease;
}
.ps-rail-chip-text {
  display: inline-block;
  font-family: ${MONO};
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: opacity 0.35s ease, transform 0.35s ease;
}
`

/* ───────────────────────── shared motion helpers ───────────────────────── */

function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Clip-path image reveal. The observer sits on an UNCLIPPED wrapper —
    IntersectionObserver never fires on elements that clip themselves away. */
function ClipImage({
  id,
  alt,
  className,
  w = 1600,
  sizes,
  gradeColor,
  gradeOpacity,
}: {
  id: string
  alt: string
  className?: string
  w?: number
  sizes?: string
  /** photography color-grade (move 3): a low-opacity multiply tint tying the
      photo to its section ground. Honest captions never change. */
  gradeColor?: string
  gradeOpacity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-90px' })
  const reduced = useReducedMotion()
  const img = (
    <Img
      src={u(id, w)}
      srcSet={`${u(id, 828)} 828w, ${u(id, 1280)} 1280w, ${u(id, 2000)} 2000w`}
      sizes={sizes ?? '(min-width: 768px) 50vw, 100vw'}
      alt={alt}
      className="h-full w-full object-cover"
    />
  )
  const grade = gradeColor ? (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: gradeColor, mixBlendMode: 'multiply', opacity: gradeOpacity ?? 0.16 }} />
  ) : null
  if (reduced) return <div className={`relative overflow-hidden ${className ?? ''}`}>{img}{grade}</div>
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="h-full w-full"
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: inView ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
        transition={{ duration: 1.15, ease: EASE }}
      >
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.12 }}
          animate={{ scale: inView ? 1 : 1.12 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          {img}
        </motion.div>
      </motion.div>
      {grade}
    </div>
  )
}

/** Varied choreography (move 3): the two Heat-band photos slide in from
    opposite horizontal edges instead of clip-wiping like every other image
    on the page. Same once-triggered useInView pattern as ClipImage. */
function SlideImage({
  id,
  alt,
  className,
  w = 1600,
  sizes,
  from,
  gradeColor,
  gradeOpacity,
}: {
  id: string
  alt: string
  className?: string
  w?: number
  sizes?: string
  from: 'left' | 'right'
  gradeColor?: string
  gradeOpacity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-90px' })
  const reduced = useReducedMotion()
  const img = (
    <Img
      src={u(id, w)}
      srcSet={`${u(id, 828)} 828w, ${u(id, 1280)} 1280w, ${u(id, 2000)} 2000w`}
      sizes={sizes ?? '(min-width: 768px) 50vw, 100vw'}
      alt={alt}
      className="h-full w-full object-cover"
    />
  )
  const grade = gradeColor ? (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: gradeColor, mixBlendMode: 'multiply', opacity: gradeOpacity ?? 0.16 }} />
  ) : null
  if (reduced) return <div className={`relative overflow-hidden ${className ?? ''}`}>{img}{grade}</div>
  const dx = from === 'left' ? -56 : 56
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0, x: dx, scale: 1.06 }}
        animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 1.1, ease: EASE }}
      >
        {img}
      </motion.div>
      {grade}
    </div>
  )
}

/** Editorial ghost numeral (move 3): a large ornamental outline/low-opacity
    digit behind a major section heading. Purely navigational decoration —
    aria-hidden, no data claim — so it sits BEHIND the heading (z-0 vs the
    heading's z-10) and never competes with heading legibility. Uses a
    tighter/bolder Archivo cut (900/75%) than the H_DISPLAY body headlines
    (800/125%) since it's ornamental, not body type. */
function GhostNum({ n, color }: { n: string; color: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -top-2 right-0 z-0 select-none leading-none md:-top-5"
      style={{
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontStretch: '75%',
        fontSize: 'clamp(4.2rem, 12vw, 8.5rem)',
        color,
      }}
    >
      {n}
    </span>
  )
}

/** "The pour" (move 2): a liquid-edge overlay at the top of the Heat/Cold
    bands, hand-authored wave clip-path in the section's own color, bleeding
    up into the previous section's bottom padding so the seam reads as a
    poured edge instead of a flat color cut. Reveal is translateY, driven by
    a synchronous passive scroll handler computing entrance progress as the
    section nears the viewport — same mechanism family as TempRail. Once
    fully revealed it settles (flag), never tracks scroll again. */
function PourEdge({ id, color }: { id: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const settled = useRef(false)

  useEffect(() => {
    if (reduced) return
    const el = document.getElementById(id)
    if (!el) return
    const onScroll = () => {
      if (settled.current) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.94
      const end = vh * 0.35
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      const node = ref.current
      if (node) node.style.transform = `translateY(${(1 - p) * -100}%)`
      if (p >= 1) {
        settled.current = true
        window.removeEventListener('scroll', onScroll)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [id, reduced])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 z-[1]" style={{ top: -90, height: 190 }}>
      <div
        ref={ref}
        className="h-full w-full"
        style={{ background: color, clipPath: WAVE_CLIP, transform: reduced ? 'translateY(0)' : 'translateY(-100%)' }}
      />
    </div>
  )
}

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const mv = useMotionValue(0)
  const final = String(to) + suffix
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
        if (ref.current) ref.current.textContent = String(Math.round(v)) + suffix
      },
    })
    return () => controls.stop()
  }, [inView, reduced, to, suffix, mv, final])
  return (
    <span ref={ref} aria-label={final}>
      {reduced || inView ? final : '0' + suffix}
    </span>
  )
}

/* ──────────────── SIGNATURE: the hot/cold temperature rail ────────────────
   A thin vertical line fixed to the page's left edge. As you scroll, a fill
   grows from the top; it runs RED through warm sections and BLUE through
   cool ones. Section markers are the round red/blue tap dots. Mechanism:
   one synchronous passive scroll handler writing transform + background
   directly to the DOM (no Framer useScroll, no rAF loop, per the ledger). */

const RAIL: { id: string; temp: 'hot' | 'cold'; label: string | null }[] = [
  { id: 'efst', temp: 'hot', label: null },
  { id: 'tolur', temp: 'hot', label: 'Fyrirtækið í tölum' },
  { id: 'thjonusta', temp: 'cold', label: 'Þjónusta' },
  { id: 'golfhiti', temp: 'hot', label: 'Gólfhiti' },
  { id: 'udakerfi', temp: 'cold', label: 'Úðakerfi' },
  { id: 'um-okkur', temp: 'hot', label: 'Um okkur' },
  { id: 'umsagnir', temp: 'cold', label: 'Orð frá viðskiptavinum' },
  { id: 'hafa-samband', temp: 'hot', label: 'Hafa samband' },
]

function TempRail() {
  const fillRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])
  const chipRef = useRef<HTMLDivElement>(null)
  const chipTextRef = useRef<HTMLSpanElement>(null)
  const [positions, setPositions] = useState<number[]>([])
  const reduced = useReducedMotion()
  const lastIndex = useRef(-1)
  const fadeTimer = useRef<number | null>(null)

  useEffect(() => {
    let offsets: number[] = []
    let pct: number[] = []

    const onScroll = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const p = Math.min(1, Math.max(0, window.scrollY / scrollable))
      const probe = window.scrollY + window.innerHeight * 0.45
      let temp: 'hot' | 'cold' = 'hot'
      let idx = 0
      for (let i = 0; i < offsets.length; i++) {
        if (probe >= offsets[i]) {
          temp = RAIL[i].temp
          idx = i
        }
      }
      const fill = fillRef.current
      if (fill) {
        fill.style.transform = `scaleY(${p})`
        fill.style.backgroundColor = temp === 'hot' ? RED : BLUE
      }
      for (let i = 0; i < dotRefs.current.length; i++) {
        const d = dotRefs.current[i]
        if (d) d.style.opacity = p >= (pct[i] ?? 0) - 0.002 ? '1' : '0.35'
      }
      /* wayfinding chip: rides the fill's leading edge (same p), cross-
         fading its text only when the current section actually changes */
      const chip = chipRef.current
      if (chip) {
        chip.style.top = `${p * 100}%`
        chip.style.backgroundColor = temp === 'hot' ? RED : BLUE
      }
      if (idx !== lastIndex.current) {
        lastIndex.current = idx
        const label = RAIL[idx].label
        if (fadeTimer.current) window.clearTimeout(fadeTimer.current)
        if (!label) {
          if (chip) chip.style.opacity = '0'
        } else {
          if (chip) chip.style.opacity = '1'
          const textEl = chipTextRef.current
          if (textEl) {
            textEl.style.opacity = '0'
            textEl.style.transform = 'translateX(-5px)'
            fadeTimer.current = window.setTimeout(() => {
              if (chipTextRef.current) {
                chipTextRef.current.textContent = label
                chipTextRef.current.style.opacity = '1'
                chipTextRef.current.style.transform = 'translateX(0)'
              }
            }, 170)
          }
        }
      }
    }

    const measure = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      offsets = RAIL.map(s => {
        const el = document.getElementById(s.id)
        return el ? el.getBoundingClientRect().top + window.scrollY : 0
      })
      pct = offsets.map(o => Math.min(0.97, o / scrollable))
      setPositions(pct)
      if (!reduced) onScroll()
    }

    measure()
    const t = window.setTimeout(measure, 900)
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    if (!reduced) window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(t)
      if (fadeTimer.current) window.clearTimeout(fadeTimer.current)
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      if (!reduced) window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  return (
    <div aria-hidden className="pointer-events-none fixed bottom-0 left-2 top-0 z-40 w-[6px] md:left-4 md:w-[11px]">
      <div className="absolute inset-0 rounded-full" style={{ background: HAIR }} />
      {!reduced && (
        <div
          ref={fillRef}
          className="absolute inset-0 origin-top overflow-hidden rounded-full"
          style={{ background: RED, transform: 'scaleY(0)', transition: 'background-color 0.45s ease' }}
        >
          <div aria-hidden className="ps-rail-flow" />
        </div>
      )}
      {positions.map((p, i) => (
        <span
          key={RAIL[i].id}
          ref={el => {
            dotRefs.current[i] = el
          }}
          className="absolute left-1/2 h-[9px] w-[9px] -translate-x-1/2 rounded-full"
          style={{
            top: `${p * 100}%`,
            background: RAIL[i].temp === 'hot' ? RED : BLUE,
            boxShadow: `0 0 0 3px ${BONE}`,
            opacity: reduced ? 1 : 0.35,
            transition: 'opacity 0.3s ease',
          }}
        />
      ))}
      {!reduced && (
        <div ref={chipRef} className="ps-rail-chip hidden md:block" style={{ background: RED, opacity: 0, transform: 'translateY(-50%)' }}>
          <span ref={chipTextRef} className="ps-rail-chip-text" />
        </div>
      )}
      {reduced && (
        <div className="hidden md:block">
          {positions.map((p, i) =>
            RAIL[i].label ? (
              <div
                key={RAIL[i].id}
                className="ps-rail-chip"
                style={{ top: `${p * 100}%`, transform: 'translateY(-50%)', background: RAIL[i].temp === 'hot' ? RED : BLUE, opacity: 1 }}
              >
                <span className="ps-rail-chip-text" style={{ opacity: 1, transform: 'none' }}>
                  {RAIL[i].label}
                </span>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────── sections ─────────────────────────────── */

function Nav({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.querySelector(hash)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -68 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
  const link = 'hidden items-center min-h-11 px-3 text-[13px] tracking-[0.12em] uppercase md:inline-flex'
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-shadow duration-500"
      style={{ background: BONE, borderBottom: `1px solid ${solid ? HAIR : 'transparent'}` }}
    >
      <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between px-5 md:px-8">
        <a href="#efst" onClick={go('#efst')} className="inline-flex min-h-11 items-center" aria-label="Pípulagnir Suðurlands, efst á síðu">
          <img src={LOGO} alt="Pípulagnir Suðurlands" className="h-8 w-auto md:h-9" />
        </a>
        <nav className="flex items-center gap-1 md:gap-2" style={{ fontFamily: MONO, color: MUT }} aria-label="Aðalvalmynd">
          <a href="#thjonusta" onClick={go('#thjonusta')} className={link}>Þjónusta</a>
          <a href="#golfhiti" onClick={go('#golfhiti')} className={link}>Gólfhiti</a>
          <a href="#um-okkur" onClick={go('#um-okkur')} className={link}>Um okkur</a>
          <a
            href={PHONE_HREF}
            className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-sm px-4 text-[14px] font-bold text-white transition-transform duration-150 active:scale-[0.97]"
            style={{ background: RED, fontFamily: BODY }}
          >
            <Phone size={15} strokeWidth={2.2} aria-hidden />
            {PHONE_DISPLAY}
          </a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  const reduced = useReducedMotion()
  const parallaxRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced) return
    /* subtle parallax drift, layered on top of the ps-heroimg Ken Burns
       load-in zoom (separate element so the two transforms never fight over
       the same style.transform property); synchronous passive scroll write,
       same technical contract as TempRail */
    const onScroll = () => {
      const y = Math.min(window.scrollY * 0.12, 120)
      if (parallaxRef.current) parallaxRef.current.style.transform = `translateY(${y}px) scale(1.06)`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced])
  const enter = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay },
        }
  return (
    <section id="efst" className="relative flex min-h-[100svh] items-end overflow-hidden" style={{ background: DARK }}>
      <div className="absolute inset-0 overflow-hidden">
        <div ref={parallaxRef} className="h-full w-full" style={reduced ? undefined : { transform: 'scale(1.06)', willChange: 'transform' }}>
          <Img
            src={u(IMG.hero, 1280)}
            srcSet={`${u(IMG.hero, 828)} 828w, ${u(IMG.hero, 1280)} 1280w, ${u(IMG.hero, 2000)} 2000w`}
            sizes="100vw"
            alt={HERO.alt}
            loading="eager"
            fetchpriority="high"
            className="ps-heroimg h-full w-full object-cover"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${DARK} 6%, rgba(20,21,19,0.86) 28%, rgba(20,21,19,0.4) 60%, rgba(20,21,19,0.62) 100%)`,
        }}
      />
      <div className="ps-dark relative mx-auto w-full max-w-[1280px] px-5 pb-24 pt-32 md:px-8 md:pb-28">
        <motion.p
          className="mb-5 flex items-center gap-3 text-[12.5px] tracking-[0.2em] uppercase"
          style={{ fontFamily: MONO, color: MUTD }}
          {...enter(0.2)}
        >
          <span aria-hidden className="inline-flex items-center gap-1.5">
            <span className="h-[9px] w-[9px] rounded-full" style={{ background: '#C4453F' }} />
            <span className="h-[9px] w-[9px] rounded-full" style={{ background: '#4E90AC' }} />
          </span>
          {HERO.eyebrow}
        </motion.p>
        {/* open leading + zero tracking + no clip masks: Í Á Ó accents stay whole */}
        <h1 className="max-w-5xl text-balance text-white" style={{ ...H_DISPLAY, fontSize: 'clamp(2.9rem, 9.5vw, 6.4rem)' }}>
          {[
            { t: HERO.headlineHot, c: WARM_TINT },
            { t: HERO.headlineAnd, c: '#FFFFFF' },
            { t: HERO.headlineCold, c: COOL_TINT },
            { t: HERO.headlineTail, c: '#FFFFFF' },
          ].map((w, i) => (
            <motion.span key={i} className="inline-block" style={{ color: w.c }} {...enter(0.3 + i * 0.1)}>
              {w.t}
              {' '}
            </motion.span>
          ))}
        </h1>
        <motion.p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white md:text-lg" style={{ fontFamily: BODY }} {...enter(0.72)}>
          {HERO.sub}
        </motion.p>
        <motion.div className="mt-9 flex flex-wrap items-center gap-4" {...enter(0.86)}>
          <a
            href={PHONE_HREF}
            className="inline-flex min-h-[52px] items-center gap-2.5 rounded-sm px-7 text-[16px] font-bold text-white transition-transform duration-150 active:scale-[0.97]"
            style={{ background: RED, fontFamily: BODY }}
          >
            <Phone size={17} strokeWidth={2.4} aria-hidden />
            {HERO.ctaPrimary} í {PHONE_DISPLAY}
          </a>
          <a
            href="#hafa-samband"
            className="inline-flex min-h-[52px] items-center rounded-sm border px-7 text-[16px] font-medium text-white transition-transform duration-150 active:scale-[0.97]"
            style={{ borderColor: 'rgba(244,242,238,0.45)', background: 'rgba(20,21,19,0.45)', fontFamily: BODY }}
          >
            {HERO.ctaSecondary}
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function Facts() {
  return (
    <section id="tolur" className="border-b" style={{ borderColor: HAIR }}>
      <h2 className="sr-only">Fyrirtækið í tölum</h2>
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-12 px-5 py-16 md:grid-cols-4 md:px-8 md:py-20">
        {FACTS.map((f, i) => (
          <Rise key={f.label} delay={i * 0.08}>
            <p className="leading-none tabular-nums" style={{ fontFamily: MONO, color: RED, fontSize: f.num !== null ? 'clamp(2.6rem, 5vw, 3.8rem)' : 'clamp(1.5rem, 3vw, 2.1rem)' }}>
              {f.num !== null ? <CountUp to={f.num} suffix={f.suffix} /> : f.text}
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

/** The one functional asymmetric split: service list ⇄ photo panel. */
function ServiceIndex() {
  const [active, setActive] = useState(0)
  const s = SERVICES[active]
  return (
    <section id="thjonusta" className="mx-auto max-w-[1280px] scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <div className="relative">
        <GhostNum n="01" color="rgba(27,26,24,0.07)" />
        <Rise>
          <h2 className="relative z-10 max-w-3xl text-balance" style={{ ...H_DISPLAY, fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)' }}>
            Öll lagnavinna á einum stað
          </h2>
        </Rise>
      </div>
      <Rise>
        <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
          Sjö svið, sömu hendurnar. Veldu þjónustu til að sjá hvað hún nær yfir.
        </p>
      </Rise>

      <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
        {/* photo panel first on mobile so the tap result is visible */}
        <div className="order-first md:order-last">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm md:sticky md:top-24 md:aspect-[4/5]">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Img src={u(IMG[s.img], 1280)} alt={s.alt} className="h-full w-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to top, rgba(20,21,19,0.72), transparent)' }} />
            <p className="absolute bottom-4 left-5 text-[13px] tracking-[0.16em] uppercase text-white" style={{ fontFamily: MONO }}>
              {s.tag}
            </p>
          </div>
        </div>

        <ul className="border-t" style={{ borderColor: HAIR }}>
          {SERVICES.map((sv, i) => {
            const on = i === active
            return (
              <li key={sv.name} className="border-b" style={{ borderColor: HAIR }}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={on}
                  className="group flex w-full items-baseline gap-4 py-4 text-left md:py-5"
                >
                  <span aria-hidden className="mt-1 h-[9px] w-[9px] shrink-0 self-center rounded-full transition-colors duration-300" style={{ background: on ? BLUE : 'rgba(27,26,24,0.18)' }} />
                  <span className="min-w-0 flex-1">
                    <span
                      className="block transition-transform duration-500 group-hover:translate-x-1.5"
                      style={{
                        ...H_DISPLAY,
                        fontWeight: 700,
                        fontSize: 'clamp(1.25rem, 2.4vw, 1.8rem)',
                        color: on ? INK : MUT,
                        transitionProperty: 'transform, color',
                      }}
                    >
                      {sv.name}
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
                          <span className="block max-w-[54ch] pt-2 text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                            {sv.desc}
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
    </section>
  )
}

/** Warm band. Full red ground, the HEITT half of the system. */
function Heat() {
  return (
    <section id="golfhiti" className="ps-dark relative scroll-mt-20" style={{ background: RED }}>
      <PourEdge id="golfhiti" color={RED} />
      <div className="relative mx-auto grid max-w-[1280px] gap-12 px-5 py-24 md:grid-cols-[1.05fr_1fr] md:gap-16 md:px-8 md:py-32">
        <div className="flex flex-col justify-center">
          <div className="relative">
            <GhostNum n="02" color="rgba(255,255,255,0.14)" />
            <Rise>
              <h2 className="relative z-10 text-balance text-white" style={BAND_TITLE}>
                {HEAT.title}
              </h2>
              <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed text-white" style={{ fontFamily: BODY }}>
                {HEAT.lead}
              </p>
              <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed" style={{ fontFamily: BODY, color: RED_TINT }}>
                {HEAT.body}
              </p>
            </Rise>
          </div>
          <ul className="mt-9 space-y-3">
            {HEAT.points.map((p, i) => (
              <Rise key={p} delay={0.1 + i * 0.08}>
                <li className="flex items-center gap-4 text-[15px] text-white" style={{ fontFamily: MONO }}>
                  <span aria-hidden className="h-px w-8" style={{ background: RED_TINT }} />
                  {p}
                </li>
              </Rise>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          <figure className="col-span-2 md:col-span-1">
            <SlideImage id={IMG[HEAT.imgA.img]} alt={HEAT.imgA.alt} className="aspect-[4/5] rounded-sm" w={1280} sizes="(min-width: 768px) 25vw, 100vw" from="left" gradeColor={RED} gradeOpacity={0.16} />
            <figcaption className="mt-3 text-[12.5px] tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: RED_TINT }}>
              {HEAT.capA}
            </figcaption>
          </figure>
          <figure className="col-span-2 md:col-span-1 md:mt-14">
            <SlideImage id={IMG[HEAT.imgB.img]} alt={HEAT.imgB.alt} className="aspect-[4/5] rounded-sm" w={1280} sizes="(min-width: 768px) 25vw, 100vw" from="right" gradeColor={RED} gradeOpacity={0.16} />
            <figcaption className="mt-3 text-[12.5px] tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: RED_TINT }}>
              {HEAT.capB}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/** Cool band. Full-bleed industrial photo under deep blue, the KALT half.
    Background photo: mount-triggered animate + eager load, never whileInView. */
function Cold() {
  const reduced = useReducedMotion()
  return (
    <section id="udakerfi" className="ps-dark relative scroll-mt-20" style={{ background: BLUE }}>
      {/* photo + scrim contained in their own overflow-hidden layer so the
          pour overlay below (which bleeds upward into Heat's red) is not
          clipped by it */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <Img
            src={u(IMG[COLD.img], 1280)}
            srcSet={`${u(IMG[COLD.img], 828)} 828w, ${u(IMG[COLD.img], 1280)} 1280w, ${u(IMG[COLD.img], 2000)} 2000w`}
            sizes="100vw"
            alt=""
            loading="eager"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div aria-hidden className="absolute inset-0" style={{ background: 'rgba(30,78,99,0.86)' }} />
      </div>
      <PourEdge id="udakerfi" color={BLUE} />
      <div className="relative mx-auto max-w-[1280px] px-5 py-28 md:px-8 md:py-40">
        <div className="relative max-w-2xl">
          <GhostNum n="03" color="rgba(255,255,255,0.14)" />
          <Rise>
            {/* lighter than BLUE_TINT: AA-safe against the brightest photo pixels under the 0.86 scrim */}
            <p className="text-[12.5px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: '#D9E9F1' }}>
              Fyrirtæki og iðnaður
            </p>
            <h2 className="relative z-10 mt-4 text-balance text-white" style={BAND_TITLE}>
              {COLD.title}
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-white" style={{ fontFamily: BODY }}>
              {COLD.lead}
            </p>
          </Rise>
          <ul className="mt-9 space-y-3">
            {COLD.points.map((p, i) => (
              <Rise key={p} delay={0.1 + i * 0.08}>
                <li className="flex items-center gap-4 text-[15px] text-white" style={{ fontFamily: MONO }}>
                  <span aria-hidden className="h-px w-8" style={{ background: BLUE_TINT }} />
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

function About() {
  return (
    <section id="um-okkur" className="mx-auto max-w-[1280px] scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <figure>
          <ClipImage id={IMG[ABOUT.imgA.img]} alt={ABOUT.imgA.alt} className="aspect-[4/3] rounded-sm md:aspect-[4/5]" />
          <figcaption className="mt-3 text-[12.5px] tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
            {ABOUT.capA}
          </figcaption>
        </figure>
        <div className="flex flex-col justify-center">
          <div className="relative">
            <GhostNum n="04" color="rgba(27,26,24,0.07)" />
            <Rise>
              <h2 className="relative z-10 text-balance" style={{ ...H_DISPLAY, fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)' }}>
                {ABOUT.title}
              </h2>
              <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>
                {ABOUT.lead}
              </p>
              <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {ABOUT.body}
              </p>
            </Rise>
          </div>
          <Rise delay={0.12}>
            <div className="mt-9 flex flex-wrap gap-x-10 gap-y-5 border-t pt-7" style={{ borderColor: HAIR }}>
              <div>
                <p className="text-[12.5px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: RED }}>
                  Starfsstöðin
                </p>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                  <span style={{ color: INK }}>{ADDRESS.street}</span>
                  <br />
                  {ADDRESS.town}
                </p>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold underline decoration-1 underline-offset-4"
                  style={{ fontFamily: BODY, color: INK }}
                >
                  <MapPin size={15} strokeWidth={2.2} aria-hidden />
                  Opna í kortum
                </a>
              </div>
              <div>
                <p className="text-[12.5px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: BLUE }}>
                  Eigandi
                </p>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                  <span style={{ color: INK }}>Ívar Grétarsson</span>
                  <br />
                  frá stofnun árið 2000
                </p>
              </div>
            </div>
          </Rise>
          <ClipImage id={IMG[ABOUT.imgB.img]} alt={ABOUT.imgB.alt} className="mt-10 hidden aspect-video rounded-sm md:block" />
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section id="umsagnir" className="ps-dark scroll-mt-20" style={{ background: DARK }}>
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
        <div className="relative">
          <GhostNum n="05" color="rgba(244,242,238,0.10)" />
          <Rise>
            <p className="text-[12.5px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: MUTD }}>
              Sýnishorn af umsögnum
            </p>
            <h2 className="relative z-10 mt-4 max-w-2xl text-balance" style={{ ...H_DISPLAY, fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)', color: BONE }}>
              Orð frá viðskiptavinum
            </h2>
          </Rise>
        </div>
        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
          {REVIEWS.map((r, i) => (
            <Rise key={r.name} delay={i * 0.1}>
              <figure className="border-l-2 pl-6" style={{ borderColor: i % 2 === 0 ? '#C4453F' : '#4E90AC' }}>
                <blockquote className="text-[16.5px] leading-relaxed" style={{ fontFamily: BODY, color: BONE }}>
                  „{r.quote}“
                </blockquote>
                <figcaption className="mt-5">
                  <p className="text-[15px] font-bold" style={{ fontFamily: BODY, color: BONE }}>
                    {r.name}
                  </p>
                  <p className="mt-1 text-[13px] tracking-[0.08em] uppercase" style={{ fontFamily: MONO, color: MUTD }}>
                    {r.role}
                  </p>
                </figcaption>
              </figure>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const nafn = String(fd.get('nafn') ?? '')
    const simi = String(fd.get('simi') ?? '')
    const verkefni = String(fd.get('verkefni') ?? '')
    const subject = encodeURIComponent(`Fyrirspurn af vefnum: ${nafn}`)
    const body = encodeURIComponent(`Nafn: ${nafn}\nSími: ${simi}\n\nVerkefnið:\n${verkefni}`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }
  const label = 'block text-[13px] font-bold tracking-[0.06em] uppercase'
  const input = 'mt-2 w-full rounded-sm border bg-white px-4 py-3 text-[16px]'
  return (
    <section id="hafa-samband" className="scroll-mt-20 border-t" style={{ borderColor: HAIR }}>
      <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-24 md:grid-cols-[1.1fr_1fr] md:gap-20 md:px-8 md:py-32">
        <div>
          <div className="relative">
            <GhostNum n="06" color="rgba(27,26,24,0.07)" />
            <Rise>
              <h2 className="relative z-10 text-balance" style={{ ...H_DISPLAY, fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)' }}>
                {CONTACT.title}
              </h2>
              <p className="mt-5 max-w-[54ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
                {CONTACT.body}
              </p>
            </Rise>
          </div>
          <Rise delay={0.1}>
            <a
              href={PHONE_HREF}
              className="mt-8 inline-block leading-none transition-transform duration-150 active:scale-[0.98]"
              style={{ ...H_DISPLAY, color: RED, fontSize: 'clamp(3rem, 10vw, 5.6rem)' }}
            >
              {PHONE_DISPLAY}
            </a>
          </Rise>
          <Rise delay={0.16}>
            <div className="mt-7 space-y-1.5 text-[15px]" style={{ fontFamily: MONO, color: MUT }}>
              <p>
                Einnig:{' '}
                <a href={PHONE2_HREF} className="inline-flex min-h-11 items-center font-medium" style={{ color: INK }}>
                  {PHONE2_DISPLAY}
                </a>
              </p>
              <p>
                <a href={`mailto:${EMAIL}`} className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4" style={{ color: INK }}>
                  {EMAIL}
                </a>
              </p>
              <p>
                {ADDRESS.street}, {ADDRESS.town}
              </p>
            </div>
          </Rise>
        </div>

        <Rise delay={0.08}>
          <form onSubmit={onSubmit} className="rounded-sm border p-6 md:p-8" style={{ borderColor: HAIR, background: '#FBFAF8' }}>
            <h3 style={{ ...H_DISPLAY, fontWeight: 700, fontSize: '1.4rem' }}>{CONTACT.formTitle}</h3>
            <div className="mt-6 space-y-5" style={{ fontFamily: BODY }}>
              <div>
                <label htmlFor="ps-nafn" className={label} style={{ color: INK }}>
                  Nafn
                </label>
                <input id="ps-nafn" name="nafn" type="text" required autoComplete="name" className={input} style={{ borderColor: 'rgba(27,26,24,0.5)', color: INK }} />
              </div>
              <div>
                <label htmlFor="ps-simi" className={label} style={{ color: INK }}>
                  Símanúmer
                </label>
                <input id="ps-simi" name="simi" type="tel" required autoComplete="tel" className={input} style={{ borderColor: 'rgba(27,26,24,0.5)', color: INK }} />
              </div>
              <div>
                <label htmlFor="ps-verkefni" className={label} style={{ color: INK }}>
                  Verkefnið
                </label>
                <textarea id="ps-verkefni" name="verkefni" required rows={4} className={input} style={{ borderColor: 'rgba(27,26,24,0.5)', color: INK }} />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-sm px-7 text-[16px] font-bold text-white transition-transform duration-150 active:scale-[0.97]"
                style={{ background: RED }}
              >
                {CONTACT.submit}
              </button>
              <p className="text-[13px] leading-relaxed" style={{ color: MUT }}>
                {CONTACT.formNote}
              </p>
            </div>
          </form>
        </Rise>
      </div>
    </section>
  )
}

/** Mobile sticky CTA bar: call + quote, appears after the hero. */
function MobileCta() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t px-3 pt-2 transition-transform duration-500 md:hidden"
      style={{
        background: BONE,
        borderColor: HAIR,
        paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
        transform: show ? 'translateY(0)' : 'translateY(110%)',
      }}
      aria-hidden={!show}
    >
      <a
        href={PHONE_HREF}
        tabIndex={show ? 0 : -1}
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-sm text-[15px] font-bold text-white active:scale-[0.98]"
        style={{ background: RED, fontFamily: BODY }}
      >
        <Phone size={16} strokeWidth={2.4} aria-hidden />
        Hringja
      </a>
      <a
        href="#hafa-samband"
        tabIndex={show ? 0 : -1}
        className="inline-flex min-h-[52px] items-center justify-center rounded-sm text-[15px] font-bold text-white active:scale-[0.98]"
        style={{ background: BLUE, fontFamily: BODY }}
      >
        Fá tilboð
      </a>
    </div>
  )
}

/* ─────────────────────────────── the page ─────────────────────────────── */

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    document.title = SEO.title
    setThemeColor(BONE)
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', SEO.description)

    /* self-loaded display font (see FONT NOTE at the top of this file) */
    let font: HTMLLinkElement | null = null
    if (!document.querySelector(`link[href="${ARCHIVO_HREF}"]`)) {
      font = document.createElement('link')
      font.rel = 'stylesheet'
      font.href = ARCHIVO_HREF
      document.head.appendChild(font)
    }

    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Plumber',
      name: 'Pípulagnir Suðurlands',
      telephone: '+354 482 7880',
      email: EMAIL,
      address: { '@type': 'PostalAddress', streetAddress: ADDRESS.street, addressLocality: 'Selfoss', postalCode: '800', addressCountry: 'IS' },
      areaServed: 'Suðurland',
      foundingDate: '2000',
    })
    document.head.appendChild(ld)

    return () => {
      meta?.setAttribute('content', prev)
      ld.remove()
      font?.remove()
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
    <div className="ps-page min-h-screen antialiased" style={{ fontFamily: BODY }}>
      <style>{CSS}</style>
      <PreviewChrome company={company} />
      <TempRail />
      <Nav lenisRef={lenisRef} />
      <main>
        <Hero />
        <Facts />
        <ServiceIndex />
        <Heat />
        <Cold />
        <About />
        <Reviews />
        <Contact />
      </main>

      <div className="px-5 pb-20 pt-5 text-center md:pb-5" style={{ borderTop: `1px solid ${HAIR}` }}>
        <p className="text-[12px] leading-relaxed" style={{ fontFamily: BODY, color: MUT }}>
          {FOOTNOTE}
        </p>
        <p className="mt-2 text-[11px] tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT }}>
          FRUMGERÐ · SNDR STUDIO
        </p>
      </div>
      <MobileCta />
      <PreviewFooter company={company} />
    </div>
  )
}
