import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Facebook, Instagram, Mail, MapPin } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADMISSION, CONTACT, EXHIBITIONS, GRIPIR, HOURS, IMG, JSON_LD, LINKS, META,
  PROJECTS, STRATA, TIMELINE, openState,
} from './data'
import type { OpenState } from './data'

const company = getPreviewCompany('minjasafn')

/* ── JARÐLÖG (strata) ─────────────────────────────────────────────────────
   One continuous dig. The hero peels three strata of the museum's own TIME
   (2026 · 1943 · 1942, all real dates from saga-safnsins) off the Sjálfbær
   eining photograph; every section below keeps digging: layer-numbered
   section heads with accumulating depth ticks, small --clip peels echoing
   the hero, a timeline rule that draws downward, and a footer that closes
   like an excavation window (ERA aperture, inset(8% 22%)).

   Engine: the Heklusýn/westfjords architecture, renamed mj- and library-free
   on purpose (no GSAP, no Lenis): ONE shared rAF loop, all READS first into
   closures, then all WRITES; no per-frame setState anywhere. Peels move a
   clip-path inset custom value only, never a translated duplicate of the
   same photo (the Búðir flip-frame bug). The hero wordmark uses the Búðir
   hue-heading recipe verbatim: mix-blend-mode: difference over a photo
   pre-filtered saturate(.5) contrast(1.03) brightness(.96).

   Resting discipline: WITHOUT the .mj-js class (scripts dead) and under
   prefers-reduced-motion the page rests fully excavated: photo + wordmark +
   eyebrow visible, strata gone, timeline rule drawn, aperture open. ────── */

const GROUND = '#16130F' /* warm soot black — locked token */
const GROUND_DEEP = '#1D1710' /* one step warmer, footer band */
const TEXT = '#EDE6DA' /* warm off-white on soot ≈ 13.9:1 */
const MUT = 'rgba(237,230,218,.62)'
const SIENNA = '#9C6346' /* sampled from grunnsyning-sjalfbaer.jpg — LARGE type, hairlines, chips only */
const SIENNA_DEEP = '#793E2E' /* sampled deep variant — fills under light text */
const HAIR = 'rgba(156,99,70,.32)' /* sienna hairline does ALL structural separation */
const HAIR_STRONG = 'rgba(156,99,70,.55)'
const OPEN_DOT = '#7CA26B'
const CLOSED_DOT = '#C0584A'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const BASE = import.meta.env.BASE_URL
const F_CABINET = `${BASE}fonts/cabinet-grotesk/fonts`
const F_SENTIENT = `${BASE}fonts/sentient`
const DISPLAY = "'Cabinet Grotesk', ui-sans-serif, system-ui, sans-serif"
const SERIF = "'Sentient', ui-serif, Georgia, serif"

/* faint SVG turbulence grain, tinted by the band behind it — no fabricated
   soil photo, per the brief: the strata are CSS layers from sampled tones */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

/* the three strata tints: soot at the surface, deep sienna at the bottom of
   the dig — every stop stays inside the sampled soot→sienna family */
const STRATA_BG = [
  'linear-gradient(180deg, #1A1610 0%, #16130F 52%, #1E1811 100%)',
  'linear-gradient(180deg, #221A11 0%, #281E13 55%, #2F2115 100%)',
  'linear-gradient(180deg, #2F2013 0%, #3B2717 50%, #4C2F1D 100%)',
]

/* rest-state pre-peel (% bottom inset per band): thin slivers of the deeper
   strata show at the bottom of the viewport before the first wheel input,
   so the dig is telegraphed in the still frame */
const PEEK = [8, 4, 0]

const CSS = `
  @font-face {
    font-family: 'Cabinet Grotesk';
    src: url('${F_CABINET}/CabinetGrotesk-Regular.woff2') format('woff2'),
         url('${F_CABINET}/CabinetGrotesk-Regular.woff') format('woff');
    font-weight: 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Cabinet Grotesk';
    src: url('${F_CABINET}/CabinetGrotesk-Medium.woff2') format('woff2'),
         url('${F_CABINET}/CabinetGrotesk-Medium.woff') format('woff');
    font-weight: 500; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Cabinet Grotesk';
    src: url('${F_CABINET}/CabinetGrotesk-Extrabold.woff2') format('woff2'),
         url('${F_CABINET}/CabinetGrotesk-Extrabold.woff') format('woff');
    font-weight: 800; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Sentient';
    src: url('${F_SENTIENT}/Sentient-Light.woff2') format('woff2');
    font-weight: 300; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Sentient';
    src: url('${F_SENTIENT}/Sentient-Regular.woff2') format('woff2');
    font-weight: 400; font-style: normal; font-display: swap;
  }

  .mj-page { overflow-x: clip; }
  .mj-page ::selection { background: ${SIENNA_DEEP}; color: ${TEXT}; }
  .mj-page a:focus-visible, .mj-page button:focus-visible, .mj-page [tabindex]:focus-visible {
    outline: 2px solid ${SIENNA}; outline-offset: 2px;
  }
  @media (prefers-reduced-motion: no-preference) {
    html:has(.mj-page) { scroll-behavior: smooth; }
  }

  .mj-skip {
    position: absolute; left: 12px; top: -60px; z-index: 100;
    background: ${SIENNA_DEEP}; color: ${TEXT}; padding: 12px 20px;
    font-size: 13px; letter-spacing: .08em; text-transform: uppercase;
    transition: top .2s ease;
  }
  .mj-skip:focus-visible { top: 12px; }

  /* ── drift frames (Heklusýn engine): image drifts INSIDE a fixed frame.
     --dz is DERIVED from the drift value, never hardcoded. ── */
  .mj-frame { position: relative; overflow: hidden; width: 100%; }
  .mj-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; will-change: transform; }
  .mj-frame-in > img { width: 100%; height: 100%; object-fit: cover; }

  /* ── text mask reveal. Resting state is VISIBLE: the hidden start exists
     only under .mj-js, so dead scripts can never strand the copy.
     .22em headroom is load-bearing BOTH WAYS: g/j/þ descenders clip below,
     and the acute tips of Ó Á Ý Ú clip above at display scale without it
     (the descender-clip trap, shipped once — and its ascender mirror). ── */
  .mj-mask {
    display: block; overflow: hidden;
    padding-bottom: 0.22em; margin-bottom: -0.22em;
    padding-top: 0.22em; margin-top: -0.22em;
  }
  .mj-js .mj-mask > .mj-mask-in { transform: translateY(132%); }
  .mj-js .mj-mask.is-in > .mj-mask-in {
    transform: translateY(0);
    transition: transform 1.05s ${EASE};
  }

  @keyframes mj-rise {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mj-js .mj-reveal { opacity: 0; transform: translateY(26px); }
  .mj-js .mj-reveal.is-in { animation: mj-rise 0.9s ${EASE} both; }

  /* ── the strata bands: full-cover layers whose clip-path bottom inset is
     driven 0% → 100% by the shared rAF job. Visible only under .mj-js;
     the resting state is always the fully excavated photo. ── */
  .mj-stratum {
    position: absolute; inset: 0; visibility: hidden;
    will-change: clip-path; clip-path: inset(0 0 0 0);
  }
  .mj-js .mj-stratum { visibility: visible; }
  .mj-stratum::before {
    content: ''; position: absolute; inset: 0;
    background-image: ${GRAIN}; opacity: .16; pointer-events: none;
  }
  .mj-stratum::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(180deg,
      rgba(237,230,218,.022) 0 1px, transparent 1px 16px);
  }
  .mj-strata-edge {
    position: absolute; left: 0; right: 0; top: 100%; height: 2px;
    background: ${HAIR_STRONG};
    box-shadow: 0 3px 14px rgba(0,0,0,.55);
    opacity: 0; will-change: top, opacity;
  }

  /* ── hero wordmark: the Búðir hue-heading recipe. The photo beneath is
     pre-filtered so the difference-invert stays a controlled tonal hue. ── */
  .mj-hero-photo img { filter: saturate(.5) contrast(1.03) brightness(.89); }
  .mj-hero-title { mix-blend-mode: difference; color: ${TEXT}; }

  /* eyebrow + CTAs resolve as the strata clear; without JS they rest visible.
     visibility rides the same scrub as opacity so the hidden CTAs are never
     clickable or focusable before the dig reveals them */
  .mj-js .mj-hero-late { opacity: 0; visibility: hidden; transform: translateY(16px); will-change: opacity, transform; }
  .mj-hero-cue { will-change: opacity; }

  .mj-hero-outer { height: 100svh; }
  @media (prefers-reduced-motion: no-preference) {
    .mj-js .mj-hero-outer { height: 250svh; }
  }

  /* ── section peel: the hero's motion echoed quietly. A tinted stratum
     overlay clips away (clip-path only, never a moved duplicate) when the
     frame enters the viewport. Exists only under .mj-js. ── */
  .mj-peel {
    display: none; position: absolute; inset: 0; z-index: 3; pointer-events: none;
    background: linear-gradient(180deg, #241A12 0%, #2F2115 60%, #3B2717 100%);
    clip-path: inset(0 0 0 0); will-change: clip-path;
  }
  .mj-peel::before {
    content: ''; position: absolute; inset: 0;
    background-image: ${GRAIN}; opacity: .15;
  }
  .mj-js .mj-peel { display: block; }
  .mj-js .mj-peel.is-dug {
    clip-path: inset(0 0 100% 0);
    transition: clip-path 1.2s ${EASE} .12s;
  }

  /* ── timeline rule: drawn base + sienna scaleY scrub on top ── */
  .mj-tl-rule {
    transform-origin: top center; transform: scaleY(1); will-change: transform;
  }
  .mj-js .mj-tl-rule { transform: scaleY(0); }

  /* ── footer aperture (ERA Phase 14): the clipping wrapper closes toward
     inset(8% 22%) as the page ends. Resting/no-JS state: open. ── */
  .mj-ap { will-change: clip-path; }

  /* ── gripur strip: native horizontal scroll, snap, styled scrollbar ── */
  .mj-strip {
    overflow-x: auto; scroll-snap-type: x mandatory;
    /* snap aligns to the scrollport edge, not the padding box — without this
       the first card snaps flush to x:0 and swallows the inline padding */
    scroll-padding-inline: 1.25rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-color: ${SIENNA_DEEP} rgba(237,230,218,.08);
    scrollbar-width: thin;
  }
  @media (min-width: 768px) { .mj-strip { scroll-padding-inline: 2.5rem; } }
  .mj-strip::-webkit-scrollbar { height: 6px; }
  .mj-strip::-webkit-scrollbar-track { background: rgba(237,230,218,.08); }
  .mj-strip::-webkit-scrollbar-thumb { background: ${SIENNA_DEEP}; }

  /* ── link vocabulary: sienna underline wipes in from the left ── */
  .mj-ul { position: relative; text-decoration: none; }
  .mj-ul::after {
    content: ''; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px;
    background: ${SIENNA}; transform: scaleX(0); transform-origin: left center;
  }
  .mj-ul:hover::after, .mj-ul:focus-visible::after { transform: scaleX(1); }

  .mj-row { transition: background .35s ease; }
  .mj-row:hover { background: rgba(156,99,70,.12); }
  .mj-row:hover .mj-row-arrow { transform: translate(6px, -6px); }

  .mj-cta { transition: letter-spacing .3s ease, background .3s ease, filter .3s ease; }
  .mj-cta:hover { letter-spacing: .12em; filter: brightness(1.18); }

  @keyframes mj-cue-drop {
    0%   { transform: scaleY(0); transform-origin: top center; }
    45%  { transform: scaleY(1); transform-origin: top center; }
    55%  { transform: scaleY(1); transform-origin: bottom center; }
    100% { transform: scaleY(0); transform-origin: bottom center; }
  }
  /* finite on purpose: the no-auto-loop hero rule — three cycles, then rest */
  .mj-cue-line { animation: mj-cue-drop 2.2s ${EASE} 3; }

  @media (prefers-reduced-motion: no-preference) {
    .mj-ul::after { transition: transform .4s ${EASE}; }
  }

  @media (max-width: 640px) {
    .mj-page a[href^="mailto:"], .mj-page a[href^="http"], .mj-page a[href^="#"] {
      min-height: 44px; display: inline-flex; align-items: center;
    }
    /* micro-caps floor on small screens: the wide tracking carries the
       hierarchy, 12px carries the legibility */
    .mj-page .text-\\[11px\\] { font-size: 12px; }
  }

  /* ── resting state = final excavated state, everywhere ── */
  @media (prefers-reduced-motion: reduce) {
    .mj-stratum, .mj-strata-edge, .mj-peel { display: none !important; }
    .mj-hero-cue { display: none !important; }
    .mj-js .mj-hero-late { opacity: 1 !important; visibility: visible !important; transform: none !important; }
    .mj-hero-outer, .mj-js .mj-hero-outer { height: 100svh !important; }
    .mj-frame-in { inset: 0; transform: none !important; }
    .mj-hero-photo-in { transform: none !important; }
    .mj-js .mj-mask > .mj-mask-in { transform: none !important; transition: none !important; }
    .mj-js .mj-reveal { opacity: 1 !important; transform: none !important; animation: none !important; }
    .mj-js .mj-tl-rule, .mj-tl-rule { transform: none !important; }
    .mj-ap { clip-path: none !important; }
    .mj-cue-line { animation: none !important; }
  }
`

/* ── the shared rAF loop: batched reads, then batched writes ──────────────
   Each job runs its READS against the live layout and returns a WRITE
   closure (or nothing when its section is off screen). All reads for all
   jobs complete before the first write lands — never interleaved, so no
   forced synchronous layout per node (the measured Heklusýn perf bug). */
type Job = (vh: number, vw: number) => (() => void) | void

const mjJobs = new Set<Job>()
let mjRaf = 0

function mjTick() {
  const vh = window.innerHeight
  const vw = window.innerWidth
  const writes: Array<() => void> = []
  mjJobs.forEach((job) => {
    const w = job(vh, vw)
    if (w) writes.push(w)
  })
  for (let i = 0; i < writes.length; i++) writes[i]()
  mjRaf = requestAnimationFrame(mjTick)
}

function addJob(job: Job) {
  mjJobs.add(job)
  if (!mjRaf) mjRaf = requestAnimationFrame(mjTick)
  return () => {
    mjJobs.delete(job)
    if (!mjJobs.size && mjRaf) {
      cancelAnimationFrame(mjRaf)
      mjRaf = 0
    }
  }
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const easeOut2 = (v: number) => 1 - (1 - v) * (1 - v)
/* smoothstep: each stratum accelerates from rest instead of snapping to full
   velocity the instant its stagger window opens (the onset-lurch fix), and
   still tapers gently into the resolve */
const easeBand = (v: number) => v * v * (3 - 2 * v)

/** Register a drift node (image drifting inside its fixed frame). */
function useDriftNode(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return
    return addJob((vh) => {
      const host = el.parentElement
      if (!host) return
      const r = host.getBoundingClientRect()
      if (r.bottom < -240 || r.top > vh + 240) return
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
      const d = Number(el.dataset.drift) || 9
      const y = (-p * d).toFixed(3)
      return () => {
        el.style.transform = `translate3d(0, ${y}%, 0)`
      }
    })
  }, [ref])
}

function DriftFrame({
  src, alt, drift = 9, className = '', style, eager = false, position, srcSet, sizes,
}: {
  src: string
  alt: string
  drift?: number
  className?: string
  style?: React.CSSProperties
  eager?: boolean
  position?: string
  srcSet?: string
  sizes?: string
}) {
  const inner = useRef<HTMLDivElement>(null)
  useDriftNode(inner)
  return (
    <div className={`mj-frame ${className}`} style={style}>
      <div
        ref={inner}
        className="mj-frame-in"
        data-drift={drift}
        style={{ ['--dz' as string]: `${Math.max(9, drift * 1.35).toFixed(2)}%` }}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={position ? { objectPosition: position } : undefined}
        />
      </div>
    </div>
  )
}

/* IO reveal — fires once, on an untransformed wrapper */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

function MaskLine({
  children, className = '', delay = 0, mounted,
}: {
  children: ReactNode
  className?: string
  delay?: number
  /** when provided, the mask is mount-driven instead of IO-driven (hero) */
  mounted?: boolean
}) {
  const { ref, inView } = useInView<HTMLSpanElement>()
  const on = mounted ?? inView
  return (
    <span ref={mounted === undefined ? ref : undefined} className={`mj-mask ${on ? 'is-in' : ''} ${className}`}>
      <span className="mj-mask-in block" style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
        {children}
      </span>
    </span>
  )
}

function Reveal({
  children, className = '', delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`mj-reveal ${inView ? 'is-in' : ''} ${className}`}
      style={inView ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/* ── small shared furniture ── */

function Pill({ children, tone = 'line' }: { children: ReactNode; tone?: 'line' | 'fill' }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]"
      style={{
        fontFamily: DISPLAY, fontWeight: 500,
        border: `1px solid ${tone === 'fill' ? SIENNA_DEEP : HAIR_STRONG}`,
        background: tone === 'fill' ? SIENNA_DEEP : 'transparent',
        color: tone === 'fill' ? TEXT : SIENNA,
      }}
    >
      {children}
    </span>
  )
}

/** the accumulating depth device: one tick per excavated layer */
function DepthTicks({ n }: { n: number }) {
  return (
    <span className="hidden items-end gap-[5px] sm:inline-flex" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className="inline-block w-px"
          style={{ height: `${8 + i * 4}px`, background: HAIR_STRONG }}
        />
      ))}
    </span>
  )
}

function SectionHead({
  layer, depth, kicker, title,
}: {
  /** pill text: LAG 01 … LAG 05, or the surface markers */
  layer: string
  /** how many ticks the dig has accumulated at this depth */
  depth: number
  kicker: string
  title: string
}) {
  return (
    <div>
      <Reveal>
        <div className="flex items-center gap-4">
          <Pill>{layer}</Pill>
          <DepthTicks n={depth} />
          <span className="text-[11px] uppercase tracking-[0.14em] md:text-[12px]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: MUT }}>
            {kicker}
          </span>
          <span className="h-px flex-1" style={{ background: HAIR }} aria-hidden />
        </div>
      </Reveal>
      <h2
        className="mt-6 uppercase leading-[0.98] tracking-[-0.015em] text-[clamp(2rem,4.5vw,3.6rem)]"
        style={{ fontFamily: DISPLAY, fontWeight: 800, color: TEXT }}
      >
        <MaskLine>{title}</MaskLine>
      </h2>
    </div>
  )
}

/** photo frame with the hero's peel echoed quietly: a tinted stratum overlay
    clips away (clip-path inset only) when the frame scrolls into view */
function PeelFrame(props: {
  src: string
  alt: string
  drift?: number
  className?: string
  position?: string
  srcSet?: string
  sizes?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3)
  return (
    <div ref={ref} className={`relative overflow-hidden ${props.className ?? ''}`}>
      <DriftFrame
        src={props.src}
        alt={props.alt}
        drift={props.drift ?? 9}
        className="h-full"
        position={props.position}
        srcSet={props.srcSet}
        sizes={props.sizes}
      />
      <div className={`mj-peel ${inView ? 'is-dug' : ''}`} aria-hidden />
    </div>
  )
}

function RowLink({
  href, children, external = true, sub,
}: {
  href: string
  children: ReactNode
  external?: boolean
  sub?: string
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="mj-row flex min-h-[56px] items-center justify-between gap-4 px-1 py-3"
      style={{ borderTop: `1px solid ${HAIR}`, color: TEXT }}
    >
      <span className="flex flex-col">
        <span className="text-[16px]" style={{ fontFamily: DISPLAY, fontWeight: 500 }}>{children}</span>
        {sub && <span className="mt-0.5 text-[12.5px]" style={{ color: MUT }}>{sub}</span>}
      </span>
      <ArrowUpRight size={17} className="mj-row-arrow shrink-0 transition-transform duration-300" style={{ color: SIENNA }} aria-hidden />
    </a>
  )
}

/* ── nav ── */
const NAV_LINKS = [
  { id: 'syningar', label: 'Sýningarnar' },
  { id: 'gripur', label: 'Gripur mánaðarins' },
  { id: 'sagan', label: 'Sagan' },
]

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: 'start' })
}

function Nav() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const el = document.getElementById('mj-hero-sentinel')
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setSolid(!entry.isIntersecting))
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-colors duration-500"
      style={{
        background: solid ? 'rgba(22,19,15,0.92)' : 'transparent',
        backdropFilter: solid ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(12px)' : 'none',
        borderBottom: solid ? `1px solid ${HAIR}` : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-[76px] md:px-10">
        <button
          onClick={() => goTo('efst')}
          className="text-left text-[13px] uppercase leading-tight tracking-[0.04em] md:text-[15px]"
          style={{
            fontFamily: DISPLAY, fontWeight: 800, color: TEXT,
            minHeight: 44, display: 'inline-flex', alignItems: 'center',
          }}
          aria-label="Minjasafn Austurlands, efst á síðu"
        >
          Minjasafn Austurlands
        </button>
        <nav className="flex items-center gap-6" aria-label="Aðalvalmynd">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              className="hidden text-[12px] uppercase tracking-[0.14em] transition-opacity duration-300 hover:opacity-70 lg:block"
              style={{ fontFamily: DISPLAY, fontWeight: 500, color: MUT }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => goTo('heimsokn')}
            className="mj-cta rounded-full px-5 text-[12px] uppercase tracking-[0.08em]"
            style={{
              fontFamily: DISPLAY, fontWeight: 500, background: SIENNA_DEEP, color: TEXT,
              minHeight: 44, display: 'inline-flex', alignItems: 'center',
            }}
          >
            Heimsókn
          </button>
        </nav>
      </div>
    </header>
  )
}

/* ── 1 · HERO — the dig itself. Resolves once over ~150vh of scroll. ── */
function SectionHero() {
  const [mounted, setMounted] = useState(false)
  const outer = useRef<HTMLElement>(null)
  const photoIn = useRef<HTMLDivElement>(null)
  const late = useRef<HTMLDivElement>(null)
  const cue = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 90)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const host = outer.current
    if (!host) return
    const bands = Array.from(host.querySelectorAll<HTMLElement>('.mj-stratum'))
    const edges = Array.from(host.querySelectorAll<HTMLElement>('.mj-strata-edge'))
    return addJob((vh) => {
      const r = host.getBoundingClientRect()
      if (r.bottom < -120) return
      const travel = Math.max(1, r.height - vh)
      const progress = clamp01(-r.top / travel)
      /* per-band stagger over the dig: band 0 (2026) first, 1942 last.
         PEEK pre-peels the upper bands a few percent at rest so the stacked
         strata (the page's whole premise) are visible before the first input */
      const insets = bands.map((_, i) =>
        Math.max(PEEK[i] ?? 0, easeBand(clamp01((progress - i * 0.26) / 0.44)) * 100),
      )
      const pE = easeOut2(progress)
      const lateO = clamp01((progress - 0.6) / 0.28)
      const cueO = clamp01(1 - progress * 4)
      return () => {
        for (let i = 0; i < bands.length; i++) {
          bands[i].style.clipPath = `inset(0 0 ${insets[i].toFixed(2)}% 0)`
          const edge = edges[i]
          if (edge) {
            edge.style.top = `calc(${(100 - insets[i]).toFixed(2)}% - 2px)`
            edge.style.opacity = insets[i] > 0.5 && insets[i] < 99 ? '1' : '0'
          }
        }
        if (photoIn.current) {
          photoIn.current.style.transform = `scale(${(1.09 - 0.09 * pE).toFixed(4)})`
        }
        if (late.current) {
          late.current.style.opacity = lateO.toFixed(3)
          late.current.style.visibility = lateO < 0.05 ? 'hidden' : 'visible'
          late.current.style.transform = `translateY(${((1 - lateO) * 16).toFixed(2)}px)`
        }
        if (cue.current) cue.current.style.opacity = cueO.toFixed(3)
      }
    })
  }, [])

  return (
    <section ref={outer} id="efst" className="mj-hero-outer relative" aria-label="Jarðlög, upphafskafli">
      <div className="sticky top-0 h-[100svh] overflow-hidden" style={{ background: GROUND }}>
        {/* base of the dig: the Sjálfbær eining interior, pre-desaturated for
            the difference-blend wordmark (the Búðir recipe) */}
        <div className="mj-hero-photo absolute inset-0">
          <div ref={photoIn} className="mj-hero-photo-in absolute inset-0 will-change-transform">
            <img
              src={IMG.sjalfbaer.src}
              srcSet={IMG.sjalfbaer.srcSet}
              sizes="100vw"
              alt={IMG.sjalfbaer.alt}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        {/* scrim for the resolving eyebrow/CTA band — contrast, not mood */}
        <div
          className="absolute inset-0 z-[6]"
          aria-hidden
          style={{ background: 'linear-gradient(to top, rgba(22,19,15,0.92) 0%, rgba(22,19,15,0.55) 22%, rgba(22,19,15,0) 44%)' }}
        />

        {/* the three strata of the museum's own time — real dates, not
            invented soil science. Deepest layer lowest in the stack. */}
        {STRATA.map((s, i) => (
          <div
            key={s.label}
            className="mj-stratum"
            data-stratum={i}
            aria-hidden
            style={{ zIndex: 13 - i, background: STRATA_BG[i] }}
          >
            <span
              className="absolute flex items-center gap-3 text-[11px] uppercase tracking-[0.16em]"
              style={{
                fontFamily: DISPLAY, fontWeight: 500,
                color: 'rgba(237,230,218,.66)',
                left: 'clamp(1.25rem, 5vw, 4rem)',
                top: `${20 + i * 10}%`,
              }}
            >
              <span className="inline-block h-px w-8" style={{ background: HAIR_STRONG }} />
              {s.label}
            </span>
            <span className="mj-strata-edge" />
          </div>
        ))}

        {/* the wordmark, blended over whatever depth the dig has reached */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <h1
            className="mj-hero-title text-center uppercase leading-[0.98] tracking-[-0.02em] text-[clamp(3.1rem,13.5vw,12rem)]"
            style={{ fontFamily: DISPLAY, fontWeight: 800 }}
            aria-label="Minjasafn Austurlands"
          >
            {/* trailing space keeps textContent readable ("Minjasafn Austurlands",
                not "MinjasafnAusturlands") — trailing whitespace in the block
                line box collapses, so it renders identically */}
            <MaskLine mounted={mounted}>Minjasafn </MaskLine>
            <MaskLine mounted={mounted} delay={120}>Austurlands</MaskLine>
          </h1>
        </div>

        {/* resolves once the strata are cleared */}
        <div
          ref={late}
          className="mj-hero-late absolute inset-x-0 bottom-0 z-30 px-5 pb-8 md:px-10 md:pb-10"
        >
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[12px] uppercase tracking-[0.14em] md:text-[13px]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: TEXT }}>
                Byggðasafn Austurlands · Egilsstöðum · stofnað 1943
              </p>
              <p className="mt-2 text-[15px]" style={{ color: MUT }}>
                Lag fyrir lag.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => goTo('heimsokn')}
                className="mj-cta rounded-full px-6 text-[13px] uppercase tracking-[0.08em]"
                style={{
                  fontFamily: DISPLAY, fontWeight: 500, background: SIENNA_DEEP, color: TEXT,
                  minHeight: 46, display: 'inline-flex', alignItems: 'center',
                }}
              >
                Heimsókn
              </button>
              <button
                onClick={() => goTo('syningar')}
                className="mj-cta rounded-full px-6 text-[13px] uppercase tracking-[0.08em]"
                style={{
                  fontFamily: DISPLAY, fontWeight: 500, border: `1px solid ${HAIR_STRONG}`,
                  background: 'rgba(22,19,15,0.5)', color: TEXT,
                  minHeight: 46, display: 'inline-flex', alignItems: 'center',
                }}
              >
                Sýningarnar
              </button>
            </div>
          </div>
        </div>

        {/* dig cue — fades as soon as the excavation starts */}
        <div ref={cue} className="mj-hero-cue absolute bottom-8 left-1/2 z-[24] -translate-x-1/2 md:bottom-10" aria-hidden>
          <div className="flex flex-col items-center gap-3">
            <span className="text-[12px] uppercase tracking-[0.22em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: MUT }}>
              Skrunaðu til að grafa
            </span>
            <span className="mj-cue-line block h-9 w-px" style={{ background: SIENNA }} />
          </div>
        </div>
      </div>

      {/* nav solidify sentinel: near the end of the first hero viewport */}
      <div id="mj-hero-sentinel" aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: 'calc(100svh - 120px)' }} />
    </section>
  )
}

/* ── 2 · STAÐAN Í DAG — status triptych at the surface ── */
function SectionStatus() {
  const [state, setState] = useState<OpenState | null>(null)
  useEffect(() => {
    setState(openState(new Date()))
  }, [])

  const season = state?.season ?? 'vetur'
  const seasonTable = (key: 'winter' | 'summer', active: boolean) => {
    const t = HOURS[key]
    return (
      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: active ? SIENNA : MUT }}>
          {t.label}{active ? ' · nú' : ''}
        </p>
        <dl className="mt-2">
          {t.rows.map(([d, h]) => (
            <div key={d} className="flex items-baseline justify-between gap-4 py-1.5" style={{ borderTop: `1px solid ${HAIR}` }}>
              <dt className="text-[14px]" style={{ color: MUT }}>{d}</dt>
              <dd className="text-[14px] tabular-nums" style={{ color: TEXT, fontFamily: DISPLAY, fontWeight: 500 }}>{h}</dd>
            </div>
          ))}
        </dl>
      </div>
    )
  }

  return (
    <section id="heimsokn" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Yfirborð" depth={0} kicker="Staðan í dag" title="Heimsóknin" />
        <div
          className="mt-10 grid grid-cols-1 md:grid-cols-3"
          style={{ borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}` }}
        >
          {/* opið í dag — computed live, Iceland runs UTC year round */}
          <Reveal className="py-8 pr-0 md:pr-10">
            <div className="flex items-center gap-3">
              <span
                id="mj-open-dot"
                className="inline-block h-2.5 w-2.5 rounded-full"
                data-open={state ? String(state.open) : 'pending'}
                style={{ background: state?.open ? OPEN_DOT : CLOSED_DOT }}
                aria-hidden
              />
              <h3 className="text-[13px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: TEXT }}>
                {state === null ? 'Opnunartímar' : state.open ? 'Opið núna' : 'Lokað núna'}
              </h3>
            </div>
            <p className="mt-4 text-[26px] leading-none" style={{ fontFamily: DISPLAY, fontWeight: 800, color: TEXT }}>
              {state?.todays ? `Í dag ${state.todays}` : 'Lokað í dag'}
            </p>
            {seasonTable('winter', season === 'vetur')}
            {seasonTable('summer', season === 'sumar')}
          </Reveal>

          {/* aðgangur */}
          <Reveal delay={90} className="border-t py-8 md:border-l md:border-t-0 md:px-10" >
            <h3 className="text-[13px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: TEXT }}>
              Aðgangur
            </h3>
            <dl className="mt-4">
              {ADMISSION.map(([label, price]) => (
                <div key={label} className="flex items-baseline justify-between gap-4 py-2.5" style={{ borderTop: `1px solid ${HAIR}` }}>
                  <dt className="text-[14.5px]" style={{ color: MUT }}>{label}</dt>
                  <dd className="whitespace-nowrap text-[14.5px] tabular-nums" style={{ color: TEXT, fontFamily: DISPLAY, fontWeight: 500 }}>{price}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* heimsókn */}
          <Reveal delay={160} className="border-t py-8 md:border-l md:border-t-0 md:pl-10">
            <h3 className="text-[13px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: TEXT }}>
              Hvar erum við
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              <p className="flex items-start gap-3 text-[16px]" style={{ color: TEXT }}>
                <MapPin size={17} style={{ color: SIENNA, marginTop: 3 }} aria-hidden />
                {CONTACT.address}
              </p>
              <a href={CONTACT.emailHref} className="mj-ul flex items-center gap-3 text-[16px]" style={{ color: TEXT }}>
                <Mail size={17} style={{ color: SIENNA }} aria-hidden />
                {CONTACT.email}
              </a>
              <a href={CONTACT.website} target="_blank" rel="noreferrer" className="mj-ul flex items-center gap-3 text-[16px]" style={{ color: TEXT }}>
                <ArrowUpRight size={17} style={{ color: SIENNA }} aria-hidden />
                {CONTACT.websiteDisplay}
              </a>
              <p className="mt-2 max-w-[34ch] text-[13.5px] leading-relaxed" style={{ color: MUT }}>
                Safnið er að Laufskógum 1 á Egilsstöðum. Sendu okkur línu, við svörum.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── 3 · GRUNNSÝNINGARNAR — layer 01, two stacked panels ── */
function SectionExhibitions() {
  return (
    <section id="syningar" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Lag 01" depth={1} kicker="Grunnsýningarnar tvær" title="Það sem stendur uppúr" />
        <div className="mt-12 flex flex-col gap-16 md:mt-16 md:gap-24">
          {EXHIBITIONS.map((ex, i) => (
            <article
              key={ex.id}
              className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12`}
            >
              <Reveal className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <PeelFrame
                  src={ex.img.src}
                  alt={ex.img.alt}
                  srcSet={ex.img.srcSet}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  drift={11}
                  className="aspect-[4/3] md:aspect-[16/10]"
                  position={'imgPosition' in ex ? (ex as { imgPosition?: string }).imgPosition : undefined}
                />
              </Reveal>
              <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <Reveal>
                  <Pill>Varanleg sýning</Pill>
                </Reveal>
                <h3
                  className="mt-5 uppercase leading-[0.98] tracking-[-0.015em] text-[clamp(1.8rem,3.6vw,2.9rem)]"
                  style={{ fontFamily: DISPLAY, fontWeight: 800, color: TEXT }}
                >
                  <MaskLine>{ex.title}</MaskLine>
                </h3>
                <Reveal delay={110}>
                  <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed md:text-[16.5px]" style={{ color: MUT }}>
                    {ex.body}
                  </p>
                </Reveal>
                {ex.credits && (
                  <Reveal delay={170}>
                    <p className="mt-4 text-[12px] uppercase tracking-[0.1em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: MUT }}>
                      {ex.credits}
                    </p>
                  </Reveal>
                )}
                <Reveal delay={220}>
                  <a
                    href={ex.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mj-ul mt-6 inline-flex items-center gap-2 text-[14px] uppercase tracking-[0.1em]"
                    style={{ fontFamily: DISPLAY, fontWeight: 500, color: SIENNA }}
                  >
                    Sýningin á minjasafn.is
                    <ArrowUpRight size={15} aria-hidden />
                  </a>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 4 · GRIPUR MÁNAÐARINS — layer 02, the warm human strip ── */
function SectionGripur() {
  return (
    <section id="gripur" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Lag 02" depth={2} kicker="Lifandi röð á minjasafn.is" title="Gripur mánaðarins" />
        <Reveal delay={90}>
          <p className="mt-6 max-w-[56ch] text-[16px] leading-relaxed md:text-[16.5px]" style={{ color: MUT }}>
            Safnkosturinn dreginn fram, einn gripur í einu. Í hverjum mánuði velur safnið einn grip úr geymslunum og segir sögu hans.
          </p>
        </Reveal>
      </div>

      <div
        className="mj-strip mt-10 flex gap-4 px-5 pb-4 md:mt-12 md:gap-6 md:px-10"
        tabIndex={0}
        role="region"
        aria-label="Gripur mánaðarins, myndaröð, skrunaðu til hliðar"
      >
        {GRIPIR.map((g) => (
          <figure key={g.month} className="w-[clamp(240px,64vw,320px)] shrink-0 snap-start">
            <div className="relative">
              <DriftFrame src={g.src} alt={g.alt} drift={6} className="aspect-[4/3]" />
              <span className="absolute left-3 top-3 z-[4]">
                <Pill tone="fill">{g.month}</Pill>
              </span>
            </div>
            <figcaption className="mt-3 text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: MUT }}>
              Úr safnkostinum
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <a
            href={LINKS.gripur}
            target="_blank"
            rel="noreferrer"
            className="mj-ul mt-6 inline-flex items-center gap-2 text-[14px] uppercase tracking-[0.1em]"
            style={{ fontFamily: DISPLAY, fontWeight: 500, color: SIENNA }}
          >
            Allir gripir mánaðarins á minjasafn.is
            <ArrowUpRight size={15} aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ── 5 · LJÓSMYNDASAFNIÐ — layer 03, type-led statement ── */
function SectionArchive() {
  return (
    <section id="ljosmyndasafn" className="py-20 md:py-28" style={{ background: GROUND_DEEP }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Lag 03" depth={3} kicker="Ljósmyndasafn Austurlands" title="Myndlagið" />
        <div className="mt-10 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p
              className="leading-[0.9] tracking-[-0.02em] text-[clamp(4.4rem,14vw,12.5rem)]"
              style={{ fontFamily: DISPLAY, fontWeight: 800, color: SIENNA }}
            >
              <MaskLine>
                <span aria-hidden style={{ fontSize: '.42em', verticalAlign: '0.5em', letterSpacing: 0 }}>~</span>
                <span className="sr-only">um </span>
                80.000
              </MaskLine>
            </p>
            <Reveal delay={100}>
              <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed md:text-[19px]" style={{ color: TEXT }}>
                myndir í Ljósmyndasafni Austurlands, sérstakri deild innan Héraðsskjalasafns Austfirðinga.
              </p>
            </Reveal>
          </div>
          <Reveal delay={140} className="lg:col-span-4">
            {/* spjold, not bak: bak is the same Sjálfbær eining room as the
                hero, and the archive section is about the PICTURES — the
                gallery wall of exhibition prints tells that story */}
            <PeelFrame src={IMG.spjold.src} alt={IMG.spjold.alt} srcSet={IMG.spjold.srcSet} sizes="(min-width: 1024px) 33vw, 100vw" drift={8} className="aspect-[4/3]" />
          </Reveal>
        </div>
        <div className="mt-12">
          <RowLink href={LINKS.ljosmyndasafn} sub="Nánar um deildina og aðgang að myndunum">
            Ljósmyndasafn Austurlands á minjasafn.is
          </RowLink>
          <RowLink href={LINKS.sarpur} sub="Menningarsögulegt gagnasafn íslenskra safna">
            Safnkosturinn er skráður í Sarp
          </RowLink>
          <div style={{ borderTop: `1px solid ${HAIR}` }} aria-hidden />
        </div>
      </div>
    </section>
  )
}

/* ── 6 · SAGAN — layer 04, the serif register. 1942 → í dag. ── */
function SectionSaga() {
  const host = useRef<HTMLDivElement>(null)
  const rule = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = host.current
    const ln = rule.current
    if (!el || !ln) return
    return addJob((vh) => {
      const r = el.getBoundingClientRect()
      if (r.bottom < -120 || r.top > vh + 120) return
      const p = clamp01((vh * 0.88 - r.top) / r.height)
      return () => {
        ln.style.transform = `scaleY(${p.toFixed(4)})`
      }
    })
  }, [])

  return (
    <section id="sagan" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Lag 04" depth={4} kicker="Sagan · 1942 til dagsins í dag" title="Neðsta lagið" />
        <Reveal delay={90}>
          <p
            className="mt-6 max-w-[52ch] text-[19px] leading-relaxed md:text-[21px]"
            style={{ fontFamily: SERIF, fontWeight: 300, color: TEXT }}
          >
            Safnkosturinn varð til eins og jarðlög verða til: heimili fyrir heimili, gripur fyrir grip, lag ofan á lag.
          </p>
        </Reveal>

        <div ref={host} className="relative mt-12 md:mt-16">
          {/* base rule + the sienna scrub that draws downward with the dig */}
          <div className="absolute bottom-2 left-[5px] top-2 w-px" style={{ background: HAIR }} aria-hidden />
          <div ref={rule} className="mj-tl-rule absolute bottom-2 left-[5px] top-2 w-px" style={{ background: SIENNA }} aria-hidden />
          <ol className="flex flex-col gap-10 md:gap-12">
            {TIMELINE.map((t, i) => (
              <li key={t.year} className="relative pl-9 md:pl-12">
                <span
                  className="absolute left-0 top-[6px] inline-block h-[11px] w-[11px] rounded-full"
                  style={{ background: GROUND, border: `2px solid ${SIENNA}` }}
                  aria-hidden
                />
                <Reveal delay={i * 60}>
                  <p className="text-[13px] uppercase tracking-[0.14em] tabular-nums" style={{ fontFamily: DISPLAY, fontWeight: 500, color: SIENNA }}>
                    {t.year}
                  </p>
                  <p
                    className="mt-2 max-w-[58ch] text-[17px] leading-relaxed md:text-[18px]"
                    style={{ fontFamily: SERIF, fontWeight: 400, color: 'rgba(237,230,218,.86)' }}
                  >
                    {t.text}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ── 7 · LINDARBAKKI OG FLEIRI VERKEFNI — layer 05 ── */
function SectionProjects() {
  return (
    <section id="lindarbakki" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Lag 05" depth={5} kicker="Út fyrir húsið" title="Lindarbakki og fleiri verkefni" />
        <Reveal className="mt-12">
          <div className="relative overflow-hidden">
            <PeelFrame
              src={IMG.lindarbakki.src}
              alt={IMG.lindarbakki.alt}
              srcSet={IMG.lindarbakki.srcSet}
              sizes="100vw"
              drift={12}
              className="aspect-[4/3] md:aspect-[21/9]"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-2/5"
              aria-hidden
              style={{ background: 'linear-gradient(to top, rgba(22,19,15,0.85), rgba(22,19,15,0))' }}
            />
            <span className="absolute left-4 top-4 z-[5] md:left-6 md:top-6">
              <Pill tone="fill">Gestastaður</Pill>
            </span>
            <p
              className="absolute bottom-4 left-4 z-[5] max-w-[44ch] text-[15px] leading-relaxed md:bottom-6 md:left-6 md:text-[16px]"
              style={{ color: TEXT }}
            >
              Lindarbakki á Borgarfirði eystra er meðal verkefna safnsins.
            </p>
          </div>
        </Reveal>
        <div className="mt-10">
          <RowLink href={LINKS.lindarbakki}>Lindarbakki</RowLink>
          {PROJECTS.map((p) => (
            <RowLink key={p.name} href={p.href}>{p.name}</RowLink>
          ))}
          <div style={{ borderTop: `1px solid ${HAIR}` }} aria-hidden />
        </div>
      </div>
    </section>
  )
}

/* ── 8 · FRÆÐSLA + FYLGSTU MEÐ — back up to the surface ── */
function SectionLearning() {
  return (
    <section id="fraedsla" className="py-20 md:py-28" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead layer="Upp aftur" depth={5} kicker="Fræðsla og miðlun" title="Næsta kynslóð" />
        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <PeelFrame
              src={IMG.hreindyrKrakkar.src}
              alt={IMG.hreindyrKrakkar.alt}
              srcSet={IMG.hreindyrKrakkar.srcSet}
              sizes="(min-width: 1024px) 58vw, 100vw"
              drift={11}
              className="aspect-[4/3] md:aspect-[16/10]"
            />
          </Reveal>
          <div className="lg:col-span-5">
            <Reveal>
              <p className="max-w-[48ch] text-[16px] leading-relaxed md:text-[16.5px]" style={{ color: MUT }}>
                Skólaheimsóknir eru fastur liður í starfi safnsins: nemendur vinna með alvöru gripi, alvöru hreindýrahorn og alvöru sögu.
              </p>
            </Reveal>
            <div className="mt-8">
              <RowLink href={LINKS.skolaheimsoknir}>Skólaheimsóknir</RowLink>
              <RowLink href={LINKS.joladagatal}>Jóladagatal safnsins</RowLink>
              <RowLink href={LINKS.frodleikur}>Fróðleikur</RowLink>
              <div style={{ borderTop: `1px solid ${HAIR}` }} aria-hidden />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="mj-cta inline-flex items-center gap-2.5 rounded-full px-5 text-[13px] uppercase tracking-[0.08em]"
                style={{ fontFamily: DISPLAY, fontWeight: 500, border: `1px solid ${HAIR_STRONG}`, color: TEXT, minHeight: 46 }}
              >
                <Instagram size={16} style={{ color: SIENNA }} aria-hidden />
                @minjasafnausturlands
              </a>
              <a
                href={LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="mj-cta inline-flex items-center gap-2.5 rounded-full px-5 text-[13px] uppercase tracking-[0.08em]"
                style={{ fontFamily: DISPLAY, fontWeight: 500, border: `1px solid ${HAIR_STRONG}`, color: TEXT, minHeight: 46 }}
              >
                <Facebook size={16} style={{ color: SIENNA }} aria-hidden />
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── FOOTER — the aperture closes over the dig ── */
function FooterAperture() {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = wrap.current
    if (!el) return
    return addJob((vh, vw) => {
      const r = el.getBoundingClientRect()
      if (r.top > vh + 60) return
      const p = clamp01((vh - r.top) / r.height)
      const eased = Math.pow(p, 1.5)
      const hMax = vw >= 768 ? 22 : 10
      const rMax = vw >= 768 ? 26 : 18
      /* vertical inset in px, capped: 8% of a tall wrapper would decapitate
         the wordmark once the wrapper top has scrolled past the viewport */
      const vMax = Math.min(r.height * 0.08, 52)
      const v = (eased * vMax).toFixed(1)
      const h = (eased * hMax).toFixed(2)
      const rad = (eased * rMax).toFixed(1)
      return () => {
        el.style.clipPath = `inset(${v}px ${h}% round ${rad}px)`
      }
    })
  }, [])

  return (
    <footer aria-label="Neðanmál">
      <div ref={wrap} className="mj-ap" style={{ background: GROUND_DEEP }}>
        <div
          className="mx-auto flex min-h-[78svh] w-full max-w-[560px] flex-col items-center justify-center px-6 pb-24 pt-32 text-center md:min-h-[84svh]"
          style={{ maxWidth: 'min(560px, 52vw + 120px)' }}
        >
          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: SIENNA }}>
            Lag fyrir lag
          </p>
          <p
            className="mt-4 uppercase leading-[0.98] tracking-[-0.015em] text-[clamp(1.6rem,4vw,2.8rem)]"
            style={{ fontFamily: DISPLAY, fontWeight: 800, color: TEXT }}
          >
            Minjasafn Austurlands
          </p>
          <div className="mt-8 flex flex-col items-center gap-2.5">
            <p className="flex items-center gap-2 text-[15px]" style={{ color: MUT }}>
              <MapPin size={15} style={{ color: SIENNA }} aria-hidden />
              {CONTACT.address}
            </p>
            <a href={CONTACT.emailHref} className="mj-ul flex items-center gap-2 text-[15px]" style={{ color: TEXT }}>
              <Mail size={15} style={{ color: SIENNA }} aria-hidden />
              {CONTACT.email}
            </a>
          </div>
          <div className="mt-8 w-full" style={{ borderTop: `1px solid ${HAIR}` }}>
            <p className="mt-5 text-[13px] leading-relaxed" style={{ color: MUT }}>
              Vetur, 1. sept til 31. maí: þri til fös 11:00–16:00.
              <br />
              Sumar, 1. júní til 31. ágúst: mán til fös 10:00–17:00, lau 11:00–17:00.
            </p>
          </div>
          <p className="mt-6 text-[13px]" style={{ color: MUT }}>
            Opinbert byggðasafn Austurlands, stofnað 1943.
          </p>
          <a
            href={CONTACT.website}
            target="_blank"
            rel="noreferrer"
            className="mj-ul mt-5 inline-flex items-center gap-2 text-[14px] uppercase tracking-[0.1em]"
            style={{ fontFamily: DISPLAY, fontWeight: 500, color: SIENNA }}
          >
            minjasafn.is
            <ArrowUpRight size={15} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ── the page ── */
export default function Page() {
  /* mj-js is applied after mount so the resting no-script state is always
     the fully excavated page (photo + wordmark + copy, no strata) */
  const [js, setJs] = useState(false)
  useEffect(() => {
    setJs(true)
  }, [])

  useEffect(() => {
    document.title = META.title
    setThemeColor(GROUND)
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', META.description)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    /* preload the display weights actually used at the top of the page */
    const preloads = [
      `${F_CABINET}/CabinetGrotesk-Extrabold.woff2`,
      `${F_CABINET}/CabinetGrotesk-Medium.woff2`,
      `${F_CABINET}/CabinetGrotesk-Regular.woff2`,
    ].map((href) => {
      const l = document.createElement('link')
      l.rel = 'preload'
      l.as = 'font'
      l.type = 'font/woff2'
      l.href = href
      l.crossOrigin = 'anonymous'
      document.head.appendChild(l)
      return l
    })
    return () => {
      meta?.setAttribute('content', prev)
      ld.remove()
      preloads.forEach((l) => l.remove())
    }
  }, [])

  return (
    <div
      className={`mj-page ${js ? 'mj-js' : ''} min-h-[100svh] antialiased`}
      style={{ background: GROUND, color: TEXT, fontFamily: DISPLAY, fontWeight: 400 }}
    >
      <style>{CSS}</style>
      <a href="#efni" className="mj-skip">Beint í efnið</a>
      <Nav />
      <main id="efni">
        <SectionHero />
        <SectionStatus />
        <SectionExhibitions />
        <SectionGripur />
        <SectionArchive />
        <SectionSaga />
        <SectionProjects />
        <SectionLearning />
      </main>
      <FooterAperture />
      <div
        className="px-5 py-5 text-center text-[11px] tracking-[0.16em]"
        style={{ color: MUT, borderTop: `1px solid ${HAIR}` }}
      >
        FRUMGERÐ · SNDR STUDIO
      </div>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
