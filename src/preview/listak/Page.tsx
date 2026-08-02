import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS, ADMISSION, EDUCATION, EMAIL, EMAIL_HREF, FACEBOOK_URL, HOURS_RECAP,
  INSTAGRAM_URL, JSON_LD, META, NEWSLETTER_URL, PHONE_DISPLAY, PHONE_HREF,
  SHOWS, SITE_URL, TAGLINE, UPCOMING, openStatus,
} from './data'
import type { OpenStatus, Show } from './data'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('listak')

/* ── SÝNINGARGANGURINN — the gallery corridor ──────────────────────────────
   Listasafnið á Akureyri runs NINE exhibitions at once in numbered halls
   (Salur 01–12). The page walks all nine as one continuous horizontal
   corridor — the way a visitor actually walks the building. One signature
   interaction; everything else stays flat, calm and hairline-bordered.

   Engines reused, not reinvented:
   - westfjords/Page.tsx  → the Heklusýn drift loop (module-level node Set +
     ONE shared rAF, batched reads-then-writes, --dz derived inset).
   - budir/Page.tsx       → the horizontal journey (gsap TWEEN + pinned
     scrub 1 + Lenis; a timeline freezes at x=0), compositing hints,
     fonts.ready + image-decode refresh.
   - laxa/Page.tsx        → the button vocabulary (micro-caps 0.14em),
     re-skinned: sharp corners here, because pills are reserved EXCLUSIVELY
     for metadata chips (hall numbers, dates, status) in this system. ───── */

const GROUND = '#F0EFE8' /* cool stone-white gallery wall */
const INK = '#14140F' /* warm charcoal near-black */
const ACCENT = '#C03E31' /* signal red — sampled from their own artwork photo set */
const ACCENT_DEEP = '#A83428' /* body-size accent text (small sizes need >4.5:1) */
const MUT = 'rgba(20,20,15,0.64)'
const PAPER = '#F0EFE8'
const PAPER_MUTE = 'rgba(240,239,232,0.66)'
const HAIR_PAPER = 'rgba(240,239,232,0.24)'
const OPEN_GREEN = '#1E7B34'

const DISPLAY = "'Familjen Grotesk', ui-sans-serif, system-ui, sans-serif"
const SERIF = "'Sentient', Georgia, 'Times New Roman', serif"

const BASE = import.meta.env.BASE_URL
const IMG = (f: string) => `${BASE}listak/${f}`
const FONT_DIR = `${BASE}fonts/`

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Module handles so anchor nav + stop focus can map into the pinned journey
   (budir's labelToScroll pattern). Set/cleared by the matchMedia branch. */
let journeyNav: { master: ScrollTrigger; track: HTMLElement; lenis: Lenis } | null = null
let pageLenis: Lenis | null = null

/* ── THE drift engine (westfjords architecture, renamed lk-) ──────────────
   ONE shared rAF loop for every drifting frame AND the corridor's
   depth-of-field. All READS happen first, into arrays, then all WRITES —
   interleaving getBoundingClientRect with style writes forces a synchronous
   layout per node per frame. No React setState anywhere in here. */
const driftNodes = new Set<HTMLElement>()
const dofNodes = new Set<HTMLElement>()
let driftRaf = 0

function driftTick() {
  const vh = window.innerHeight
  const vw = window.innerWidth
  const dReads: Array<[HTMLElement, number]> = []
  driftNodes.forEach((el) => {
    const host = el.parentElement
    if (!host) return
    const r = host.getBoundingClientRect()
    if (r.bottom < -240 || r.top > vh + 240) return
    dReads.push([el, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)])
  })
  const fReads: Array<[HTMLElement, number]> = []
  dofNodes.forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.right < -vw * 0.6 || r.left > vw * 1.6) return
    fReads.push([el, (r.left + r.width / 2 - vw / 2) / (vw / 2 + r.width / 2)])
  })
  /* writes */
  for (let i = 0; i < dReads.length; i++) {
    const [el, p] = dReads[i]
    const d = Number(el.dataset.drift) || 9
    el.style.transform = `translate3d(0, ${(-p * d).toFixed(3)}%, 0)`
  }
  for (let i = 0; i < fReads.length; i++) {
    const [el, p] = fReads[i]
    const a = Math.min(1, Math.abs(p))
    /* blur up to 6px + slight scale-down off-centre, sharp at centre.
       A SHARP PLATEAU (|offset| <= 0.28) keeps exactly one plane in focus
       through the hand-off — a real rack focus never melts everything at
       once. Quantised so the compositor is not re-rastering every frame. */
    const t = Math.max(0, a - 0.28)
    const blur = Math.round(Math.min(6, t * 9) * 4) / 4
    const scale = (1 - Math.min(0.05, t * 0.083)).toFixed(4)
    const key = `${blur}|${scale}`
    if (el.dataset.lkDof !== key) {
      el.dataset.lkDof = key
      el.style.filter = blur > 0 ? `blur(${blur}px)` : ''
      el.style.transform = `scale(${scale})`
    }
  }
  driftRaf = requestAnimationFrame(driftTick)
}

function ensureDriftLoop() {
  if (!driftRaf && (driftNodes.size || dofNodes.size)) {
    driftRaf = requestAnimationFrame(driftTick)
  }
}
function maybeStopDriftLoop() {
  if (!driftNodes.size && !dofNodes.size && driftRaf) {
    cancelAnimationFrame(driftRaf)
    driftRaf = 0
  }
}

function useDriftNode(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (prefersReduced()) return
    const el = ref.current
    if (!el) return
    driftNodes.add(el)
    ensureDriftLoop()
    return () => {
      driftNodes.delete(el)
      maybeStopDriftLoop()
    }
  }, [ref])
}

/* A fixed frame whose image drifts inside it. --dz is DERIVED from the drift
   value: a flat inset is silently wrong at drift 12+, where the image runs
   out of overhang and its own edge slides into frame. */
function DriftFrame({
  src, srcSet, sizes, alt, drift = 9, className = '', style, eager = false,
}: {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  drift?: number
  className?: string
  style?: React.CSSProperties
  eager?: boolean
}) {
  const inner = useRef<HTMLDivElement>(null)
  useDriftNode(inner)
  return (
    <div className={`lk-frame ${className}`} style={style}>
      <div
        ref={inner}
        className="lk-frame-in"
        data-drift={drift}
        style={{ ['--dz' as string]: `${Math.max(9, drift * 1.35).toFixed(2)}%` }}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          {...(eager ? { fetchpriority: 'high' as const } : {})}
        />
      </div>
    </div>
  )
}

/* IntersectionObserver reveal — fires once, on an untransformed wrapper. */
function useInView<T extends HTMLElement>(threshold = 0.18) {
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

function Reveal({
  children, className = '', delay = 0, soft = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  soft?: boolean
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`${soft ? 'lk-reveal-soft' : 'lk-reveal'} ${inView ? 'is-in' : ''} ${className}`}
      style={inView && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/* ── page-scoped styles — everything prefixed lk- ── */
const CSS = `
  @font-face {
    font-family: 'Familjen Grotesk';
    src: url('${FONT_DIR}familjen-grotesk/familjen-grotesk-v11-latin_latin-ext-regular.woff2') format('woff2');
    font-weight: 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Familjen Grotesk';
    src: url('${FONT_DIR}familjen-grotesk/familjen-grotesk-v11-latin_latin-ext-500.woff2') format('woff2');
    font-weight: 500; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Familjen Grotesk';
    src: url('${FONT_DIR}familjen-grotesk/familjen-grotesk-v11-latin_latin-ext-600.woff2') format('woff2');
    font-weight: 600; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Familjen Grotesk';
    src: url('${FONT_DIR}familjen-grotesk/familjen-grotesk-v11-latin_latin-ext-700.woff2') format('woff2');
    font-weight: 700; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Sentient';
    src: url('${FONT_DIR}sentient/Sentient-Light.woff2') format('woff2');
    font-weight: 300; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Sentient';
    src: url('${FONT_DIR}sentient/Sentient-Regular.woff2') format('woff2');
    font-weight: 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Sentient';
    src: url('${FONT_DIR}sentient/Sentient-Medium.woff2') format('woff2');
    font-weight: 500; font-style: normal; font-display: swap;
  }

  .lk-root { background: ${GROUND}; color: ${INK}; }
  .lk-root ::selection { background: ${ACCENT}; color: ${GROUND}; }
  .lk-root a:focus-visible, .lk-root button:focus-visible, .lk-root [tabindex]:focus-visible {
    outline: 2px solid ${ACCENT}; outline-offset: 2px;
  }

  .lk-sr {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
  }
  .lk-skip {
    position: fixed; left: 12px; top: -60px; z-index: 90;
    display: inline-flex; align-items: center; min-height: 44px;
    background: ${INK}; color: ${GROUND}; padding: 12px 18px;
    font-family: ${DISPLAY}; font-size: 12px; letter-spacing: 0.14em;
    text-transform: uppercase; transition: top .25s ease;
  }
  .lk-skip:focus-visible { top: 12px; }

  /* ── drift frames (Heklusýn device) ── */
  .lk-frame { position: relative; overflow: hidden; width: 100%; }
  .lk-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; will-change: transform; }
  .lk-frame-in > img { width: 100%; height: 100%; object-fit: cover; }

  /* ── reveals: resting state under reduced motion is fully visible ── */
  @keyframes lk-rise {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lk-rise-soft {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lk-reveal { opacity: 0; transform: translateY(26px); }
  .lk-reveal.is-in { animation: lk-rise 0.9s ${EASE} both; }
  .lk-reveal-soft { opacity: 0; transform: translateY(12px); }
  .lk-reveal-soft.is-in { animation: lk-rise-soft 0.7s ${EASE} both; }

  /* hairline rule that draws in with its reveal (Búðir .bu-rule-draw idea) */
  .lk-rule-draw { transform: scaleX(0); transform-origin: left center; }
  .is-in .lk-rule-draw {
    transform: scaleX(1); transition: transform 1s ${EASE} 0.08s;
  }

  /* ── metadata pill chips — the ONLY rounded surfaces on the page ── */
  .lk-chip {
    display: inline-flex; align-items: center; gap: 7px;
    border-radius: 999px; padding: 6px 13px;
    font-family: ${DISPLAY}; font-size: 12px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap;
  }
  .lk-chip-accent { border: 1px solid ${ACCENT}; color: ${ACCENT_DEEP}; }
  .lk-chip-ink { border: 1px solid rgba(20,20,15,0.34); color: ${MUT}; }
  .lk-chip-paper { border: 1px solid ${HAIR_PAPER}; color: ${PAPER_MUTE}; }

  /* ── buttons — laxa micro-caps DNA, sharp corners (pills are metadata) ── */
  .lk-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    min-height: 46px; border-radius: 2px; padding: 12px 26px;
    font-family: ${DISPLAY}; font-size: 12px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap;
    transition: opacity .25s ease, transform .25s ${EASE}, border-color .25s ease, background-color .25s ease;
  }
  .lk-btn:hover { opacity: .88; transform: translateY(-1px); }
  .lk-btn:active { transform: translateY(0); }
  .lk-btn-solid { background: ${ACCENT}; color: #FFFFFF; border: 1px solid ${ACCENT}; }
  .lk-btn-ghost { background: transparent; color: ${INK}; border: 1px solid ${ACCENT}; }
  .lk-btn-ghost:hover { border-color: ${ACCENT_DEEP}; }

  /* text link rows — hairline separations carried by the single accent */
  .lk-row {
    position: relative; display: flex; align-items: center; justify-content: space-between;
    gap: 16px; min-height: 56px; padding: 14px 2px; text-decoration: none; color: ${INK};
    border-bottom: 1px solid ${ACCENT};
  }
  .lk-row .lk-row-arrow { color: ${ACCENT_DEEP}; transition: transform .3s ${EASE}; }
  .lk-row:hover .lk-row-arrow { transform: translate(3px, -3px); }

  /* ── HERO — wordmark-as-mask, resolves ONCE ─────────────────────────────
     Resting state (no JS armed, reduced motion, crawler) is the RESOLVED
     state: photo visible, solid wordmark. The cutout veil only exists while
     .lk-js is present and the hero has not resolved. */
  .lk-hero { position: relative; height: 100svh; overflow: hidden; background: ${INK}; }
  .lk-hero-photo { position: absolute; inset: 0; }
  .lk-hero-photo img { filter: saturate(.96); }
  /* under-veil darkener: makes the photo read INSIDE the letterforms against
     the stone ground. Fades away with the veil on resolve. */
  .lk-hero-shade { position: absolute; inset: 0; background: ${INK}; opacity: 0; }
  .lk-hero-veil { position: absolute; inset: 0; opacity: 0; }
  .lk-hero-solid { position: absolute; inset: 0; opacity: 1; transform-origin: 50% 40%; }
  .lk-hero-veil svg, .lk-hero-solid svg { display: block; width: 100%; height: 100%; }
  .lk-hero-type {
    font-family: ${DISPLAY}; font-weight: 700; letter-spacing: -0.02em;
    font-size: clamp(44px, 17vw, 284px); text-anchor: middle;
  }
  .lk-js:not(.lk-done) .lk-hero-shade { opacity: 0.6; }
  .lk-js:not(.lk-done) .lk-hero-veil { opacity: 1; }
  .lk-js:not(.lk-done) .lk-hero-solid { opacity: 0; }
  .lk-done .lk-hero-shade { opacity: 0; transition: opacity 1.1s ease .05s; }
  .lk-done .lk-hero-veil { opacity: 0; transition: opacity 1s ease .05s; }
  @keyframes lk-dock {
    0%   { opacity: 0; transform: none; }
    26%  { opacity: 1; transform: none; }
    52%  { opacity: 1; transform: none; }
    100% { opacity: 0; transform: translate(-33vw, -34vh) scale(0.18); }
  }
  .lk-js.lk-done .lk-hero-solid { animation: lk-dock 1.9s ${EASE} 0.12s forwards; }

  /* ground-toned scrim under the hero's bottom content, always present */
  .lk-hero-foot {
    position: absolute; inset: auto 0 0 0; z-index: 6;
    padding: 120px 20px 26px;
    background: linear-gradient(to top, rgba(240,239,232,0.97) 0%, rgba(240,239,232,0.9) 46%, rgba(240,239,232,0) 100%);
  }
  .lk-hero-credit {
    position: absolute; right: 20px; top: 84px; z-index: 6;
    font-family: ${DISPLAY}; font-size: 12px; letter-spacing: 0.14em;
    text-transform: uppercase; color: ${INK};
    background: rgba(240,239,232,0.85); padding: 6px 10px;
  }

  /* header wordmark waits for the dock */
  .lk-mark { opacity: 1; transition: opacity .6s ease; }
  .lk-js:not(.lk-done) .lk-mark { opacity: 0; }
  .lk-js.lk-done .lk-mark { transition-delay: 1.35s; }

  /* ── corridor — vertical stacked list by default (phones, coarse pointer,
     reduced motion). The horizontal journey CSS exists ONLY inside the
     desktop fine-pointer motion-ok query below. ── */
  .lk-journey { position: relative; background: ${GROUND}; }
  .lk-stop { position: relative; }
  .lk-stop-core { width: 100%; }
  .lk-hud { display: none; }
  /* the corridor scroll hint and the centering tail exist ONLY where the
     horizontal journey itself exists — never in the stacked fallback */
  .lk-hint { display: none; }
  .lk-track-tail { display: none; }

  @media (min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .lk-journey { height: 100svh; overflow: hidden; }
    .lk-track {
      display: flex; width: max-content; height: 100svh; align-items: stretch;
      will-change: transform; backface-visibility: hidden;
    }
    .lk-stop { flex: none; height: 100svh; display: flex; align-items: center; overflow: hidden; }
    /* the pinned journey zeroes the stacked rhythm HERE, not via md: utility
       classes — tablets and reduced-motion desktops get the stacked fallback
       at >=768px and must keep the mobile padding */
    .lk-journey .lk-stop { padding: 0; }
    .lk-hint { display: block; }
    /* trailing spacer so the LAST stop (56vw) lands dead-centre at x=-maxX:
       (100vw - 56vw) / 2 — the walk must end on a sharp, centred frame */
    .lk-track-tail { display: block; flex: none; width: 22vw; height: 100svh; }
    .lk-stop-core {
      display: flex; flex-direction: column; justify-content: center;
      gap: 2.4svh; padding: 10svh 4vw 12svh; will-change: transform, filter;
    }
    .lk-stop-intro { width: 46vw; }
    .lk-stop-std { width: 56vw; }
    .lk-stop-wide { width: 76vw; }
    .lk-stop-plate { width: 56vw; }
    .lk-stop-frame { height: 50svh; width: auto; }
    .lk-stop-wide .lk-stop-frame { height: 56svh; }
    .lk-stop-frame > .lk-frame-in > img { will-change: transform; }
    .lk-hud {
      display: flex; align-items: center; gap: 18px;
      position: absolute; left: 0; right: 0; bottom: 0; z-index: 8;
      padding: 0 32px 18px;
    }
    .lk-hud-rail { position: relative; flex: 1; height: 2px; background: rgba(20,20,15,0.14); }
    .lk-hud-fill {
      position: absolute; inset: 0; background: ${ACCENT};
      transform: scaleX(0); transform-origin: left center;
    }
    /* inside the pinned journey the IO reveals would fire oddly — panels are
       laid out horizontally, so rest them visible and let the DOF carry it */
    .lk-journey .lk-reveal, .lk-journey .lk-reveal-soft {
      opacity: 1; transform: none; animation: none;
    }
    .lk-journey .lk-rule-draw { transform: scaleX(1); }
  }
  @media (max-width: 1023.9px) {
    .lk-stop-frame { width: 100%; height: auto; }
  }

  /* ── mobile type floor: nothing customer-facing below 12px ── */
  .lk-eyebrow {
    font-family: ${DISPLAY}; font-size: 12px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
  }

  /* status dot */
  .lk-dot { width: 9px; height: 9px; border-radius: 999px; display: inline-block; flex: none; }

  /* serif register — Um safnið ONLY */
  .lk-serif { font-family: ${SERIF}; }

  @media (prefers-reduced-motion: reduce) {
    .lk-frame-in { inset: 0; transform: none !important; }
    .lk-reveal, .lk-reveal-soft {
      opacity: 1 !important; transform: none !important; animation: none !important;
    }
    .lk-rule-draw { transform: scaleX(1) !important; transition: none !important; }
    .lk-btn, .lk-btn:hover, .lk-btn:active { transition: none; transform: none; }
    .lk-row .lk-row-arrow { transition: none; }
    .lk-hero-shade, .lk-hero-veil { opacity: 0 !important; transition: none !important; }
    .lk-hero-solid { opacity: 1 !important; animation: none !important; transform: none !important; }
    .lk-mark { opacity: 1 !important; }
  }
`

/* ── the wordmark, drawn twice: once as a cutout mask, once solid ── */
function WordmarkSvg({ mode }: { mode: 'cut' | 'solid' }) {
  const lines = (fill: string) => (
    <>
      <text className="lk-hero-type" x="50%" y="36%" fill={fill}>LISTASAFNIÐ</text>
      <text className="lk-hero-type" x="50%" y="36%" dy="0.98em" fill={fill}>Á AKUREYRI</text>
    </>
  )
  if (mode === 'solid') {
    return (
      <svg aria-hidden="true" focusable="false">
        {lines(INK)}
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" focusable="false">
      <defs>
        <mask id="lk-wordmark-cut">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          {lines('#000000')}
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={GROUND} mask="url(#lk-wordmark-cut)" />
    </svg>
  )
}

/* ── nav ── */
const NAV_LINKS = [
  { id: 'syningar', label: 'Sýningarnar' },
  { id: 'framundan', label: 'Framundan' },
  { id: 'fraedsla', label: 'Fræðsla' },
  { id: 'ketilhus', label: 'Ketilhús' },
  { id: 'um', label: 'Um safnið' },
]

function goTo(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  if (pageLenis) {
    pageLenis.scrollTo(target, { offset: 0, immediate: prefersReduced() })
  } else {
    target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' })
  }
}

function Header() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: 'rgba(240,239,232,0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${ACCENT}`,
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-8">
        <button
          onClick={() => (pageLenis ? pageLenis.scrollTo(0, {}) : window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' }))}
          className="lk-mark flex min-h-[44px] items-center"
          aria-label="Listasafnið á Akureyri, efst á síðu"
        >
          <img src={IMG('logo.png')} alt="Listasafnið á Akureyri" className="h-6 w-auto md:h-7" />
        </button>
        <nav aria-label="Aðalvalmynd" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              className="lk-eyebrow min-h-[44px] transition-opacity hover:opacity-60"
              style={{ color: INK }}
            >
              {l.label}
            </button>
          ))}
          <a href={PHONE_HREF} className="lk-eyebrow flex min-h-[44px] items-center" style={{ color: ACCENT_DEEP }}>
            {PHONE_DISPLAY}
          </a>
        </nav>
        <button
          onClick={() => goTo('syningar')}
          className="lk-eyebrow flex min-h-[44px] items-center border px-4 lg:hidden"
          style={{ borderColor: ACCENT, color: ACCENT_DEEP, borderRadius: 2 }}
        >
          Sýningarnar
        </button>
      </div>
    </header>
  )
}

/* ── §1 HERO ── */
function Hero({ status }: { status: OpenStatus | null }) {
  return (
    <section className="lk-hero" id="efst" aria-label="Listasafnið á Akureyri">
      <h1 className="lk-sr">Listasafnið á Akureyri</h1>
      <div className="lk-hero-photo">
        <DriftFrame
          src={IMG('show-zimoun.jpg')}
          alt="Hljóðinnsetning eftir ZIMOUN í sölum 10 og 11: skúlptúrar úr ljósum viði í hvítum sal"
          drift={13}
          className="h-full"
          eager
        />
      </div>
      <div className="lk-hero-shade" aria-hidden="true" />
      <div className="lk-hero-veil" aria-hidden="true">
        <WordmarkSvg mode="cut" />
      </div>
      <div className="lk-hero-solid" aria-hidden="true">
        <WordmarkSvg mode="solid" />
      </div>

      <p className="lk-hero-credit m-0">ZIMOUN, 2026 · Salir 10–11</p>

      <div className="lk-hero-foot">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-0 md:px-3">
          <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>
            Listasafnið á Akureyri · Kaupvangsstræti 8
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="m-0 flex items-center gap-2.5 text-[16px]" style={{ fontFamily: DISPLAY, color: INK }} aria-live="polite">
              {status ? (
                <>
                  <span
                    className="lk-dot"
                    aria-hidden="true"
                    style={{ background: status.open ? OPEN_GREEN : ACCENT_DEEP }}
                  />
                  {status.closedDay
                    ? 'Lokað í dag'
                    : status.open
                      ? `Opið núna · í dag ${status.hoursLabel}`
                      : `Lokað núna · opið í dag ${status.hoursLabel}`}
                </>
              ) : (
                <>
                  <span className="lk-dot" aria-hidden="true" style={{ background: MUT }} />
                  {'Opið alla daga'}
                </>
              )}
            </p>
            <button onClick={() => goTo('syningar')} className="lk-btn lk-btn-ghost">
              Sýningarnar
              <ArrowUpRight size={15} aria-hidden />
            </button>
          </div>
          <p className="m-0 max-w-xl text-[16px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
            {TAGLINE} Níu sýningar í tólf sölum, undir einu þaki.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── §2 STAÐAN Í DAG — live status triptych ── */
function StatusTriptych({ status }: { status: OpenStatus | null }) {
  return (
    <section id="stada" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-20" aria-label="Staðan í dag">
      <Reveal>
        <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Staðan í dag</p>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Reveal className="h-full">
          <div className="flex h-full flex-col gap-3 p-6" style={{ border: `1px solid ${ACCENT}` }}>
            <h2 className="m-0 text-[19px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
              Opið í dag
            </h2>
            <p className="m-0 flex items-center gap-2.5 text-[16px]" style={{ fontFamily: DISPLAY, color: INK }}>
              {status ? (
                <>
                  <span className="lk-dot" aria-hidden="true" style={{ background: status.open ? OPEN_GREEN : ACCENT_DEEP }} />
                  {status.closedDay ? 'Lokað í dag' : `${status.hoursLabel}${status.open ? ' · opið núna' : ''}`}
                </>
              ) : 'Opið alla daga'}
            </p>
            <p className="m-0 text-[14px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
              Sumar 10:00–17:00 · vetur 12:00–17:00, alla daga. Lokað 24., 25. og 31. desember og 1. janúar.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80} className="h-full">
          <div className="flex h-full flex-col gap-3 p-6" style={{ border: `1px solid ${ACCENT}` }}>
            <h2 className="m-0 text-[19px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
              Aðgangur
            </h2>
            <dl className="m-0 flex flex-col gap-1.5">
              {ADMISSION.map((a) => (
                <div key={a.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-[14px]" style={{ fontFamily: DISPLAY, color: MUT }}>{a.label}</dt>
                  <dd className="m-0 whitespace-nowrap text-[14px] font-medium" style={{ fontFamily: DISPLAY, color: INK }}>{a.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
        <Reveal delay={160} className="h-full">
          <div className="flex h-full flex-col gap-3 p-6" style={{ border: `1px solid ${ACCENT}` }}>
            <h2 className="m-0 text-[19px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
              Ketilkaffi
            </h2>
            <p className="m-0 text-[15px] leading-relaxed" style={{ fontFamily: DISPLAY, color: INK }}>
              Kaffihús í Ketilhúsi, opið alla daga 08:00–17:00.
            </p>
            <p className="m-0 mt-auto text-[14px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
              {ADDRESS} ·{' '}
              <a href={PHONE_HREF} className="inline-flex min-h-[44px] items-center" style={{ color: ACCENT_DEEP }}>{PHONE_DISPLAY}</a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── §3 SÝNINGARGANGURINN — the signature device ── */
function StopChips({ show }: { show: Show }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="lk-chip lk-chip-accent">{show.chip}</span>
      {show.dates ? <span className="lk-chip lk-chip-ink">{show.dates}</span> : null}
    </div>
  )
}

function Stop({ show, index }: { show: Show; index: number }) {
  const n = String(index + 1).padStart(2, '0')
  const layoutClass =
    show.layout === 'wide' ? 'lk-stop-wide' : show.layout === 'plate' ? 'lk-stop-plate' : 'lk-stop-std'
  return (
    <article
      className={`lk-stop ${layoutClass} px-5 py-10`}
      tabIndex={0}
      aria-label={`Sýning ${n} af 09: ${show.title}${show.artist && show.artist !== show.title ? `, ${show.artist}` : ''}, ${show.chip}`}
    >
      <div className="lk-stop-core">
        <Reveal soft>
          <div className="flex items-baseline justify-between gap-4">
            <StopChips show={show} />
            <span className="lk-eyebrow" style={{ color: MUT }} aria-hidden="true">{n}/09</span>
          </div>
        </Reveal>

        {show.layout === 'plate' ? (
          <>
            <Reveal>
              <h3
                className="m-0 mt-4 max-w-[16em] uppercase"
                style={{
                  fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
                  fontSize: 'clamp(1.7rem, 5vw, 4.6rem)', lineHeight: 1.02,
                  paddingBottom: '0.12em',
                }}
              >
                {show.title}
              </h3>
            </Reveal>
            <Reveal delay={60}>
              <p className="m-0 text-[16px] font-medium" style={{ fontFamily: DISPLAY, color: INK }}>{show.artist}</p>
              <p className="m-0 mt-1 text-[15px]" style={{ fontFamily: DISPLAY, color: MUT }}>{show.fact}</p>
            </Reveal>
            {/* 250x313 source — mounted as a small wall plate, never upscaled */}
            <Reveal delay={110}>
              <figure className="m-0 mt-4 flex items-end gap-4">
                <div className="p-2" style={{ border: `1px solid ${ACCENT}`, width: 'min(250px, 56vw)' }}>
                  <img
                    src={IMG(show.img)}
                    alt={show.alt}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </div>
                <figcaption className="pb-1 text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, color: MUT }}>
                  Verk á sýningunni
                </figcaption>
              </figure>
            </Reveal>
          </>
        ) : (
          <>
            <Reveal>
              <DriftFrame
                src={IMG(show.img)}
                srcSet={show.img800 ? `${IMG(show.img800)} 800w, ${IMG(show.img)} ${show.imgW ?? 1400}w` : undefined}
                sizes={show.img800 ? (show.layout === 'wide' ? '(min-width: 1024px) 76vw, 100vw' : '(min-width: 1024px) 60vw, 100vw') : undefined}
                alt={show.alt}
                drift={9}
                className="lk-stop-frame"
                style={{ aspectRatio: String(show.ar) }}
              />
            </Reveal>
            <Reveal delay={60}>
              <h3
                className="m-0 mt-2 uppercase"
                style={{
                  fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
                  fontSize: 'clamp(1.6rem, 5vw, 4.2rem)', lineHeight: 1.02,
                  paddingBottom: '0.12em',
                }}
              >
                {show.title}
              </h3>
            </Reveal>
            <Reveal delay={100}>
              <p className="m-0 text-[16px]" style={{ fontFamily: DISPLAY, color: MUT }}>
                {show.artist && show.artist !== show.title ? (
                  <span className="font-medium" style={{ color: INK }}>{show.artist} · </span>
                ) : null}
                {show.fact}
                {show.datesNote ? <span> · {show.datesNote}</span> : null}
              </p>
            </Reveal>
          </>
        )}
      </div>
    </article>
  )
}

function Corridor() {
  return (
    <section id="syningar" className="lk-journey" aria-label="Sýningargangurinn, níu sýningar í gangi">
      <div className="lk-track">
        <div className="lk-stop lk-stop-intro px-5 py-16">
          <div className="lk-stop-core md:pl-[6vw]">
            <Reveal>
              <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Sýningargangurinn</p>
            </Reveal>
            <Reveal delay={70}>
              <h2
                className="m-0 mt-3 uppercase"
                style={{
                  fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
                  fontSize: 'clamp(2rem, 5.4vw, 5rem)', lineHeight: 1.0, paddingBottom: '0.12em',
                }}
              >
                Níu sýningar, tólf salir
              </h2>
            </Reveal>
            <Reveal delay={130}>
              <p className="m-0 mt-2 max-w-md text-[16px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
                {TAGLINE} Gengið er í salaröð, frá Sal 01 að Sal 12.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="lk-eyebrow lk-hint m-0 mt-2" style={{ color: MUT }}>
                Skrunaðu · gangurinn liggur til hægri
              </p>
            </Reveal>
          </div>
        </div>
        {SHOWS.map((show, i) => (
          <Stop key={show.key} show={show} index={i} />
        ))}
        <div className="lk-track-tail" aria-hidden="true" />
      </div>
      <div className="lk-hud" aria-hidden="true">
        <div className="lk-hud-rail"><div className="lk-hud-fill" /></div>
        <span className="lk-eyebrow lk-hud-count" style={{ color: INK }}>01/09</span>
      </div>
    </section>
  )
}

/* ── §4 FRAMUNDAN ── */
function Upcoming() {
  return (
    <section id="framundan" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24" aria-label="Framundan">
      <Reveal>
        <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Framundan</p>
      </Reveal>
      <Reveal delay={60}>
        <h2
          className="m-0 mt-3 uppercase"
          style={{
            fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
            fontSize: 'clamp(1.8rem, 4vw, 3.4rem)', lineHeight: 1.02, paddingBottom: '0.12em',
          }}
        >
          Á dagskrá safnsins
        </h2>
      </Reveal>
      <div className="mt-8">
        {UPCOMING.map((title, i) => (
          <Reveal key={title} soft delay={i * 40}>
            <div className="lk-rule-draw h-px w-full" style={{ background: ACCENT }} aria-hidden="true" />
            <a href={SITE_URL} target="_blank" rel="noreferrer" className="lk-row" style={{ borderBottom: 'none' }}>
              <span className="flex items-baseline gap-5">
                <span className="lk-eyebrow" style={{ color: MUT }} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[17px] font-medium uppercase tracking-[-0.01em] md:text-[20px]" style={{ fontFamily: DISPLAY }}>
                  {title}
                </span>
              </span>
              <ArrowUpRight size={17} className="lk-row-arrow" aria-hidden />
            </a>
          </Reveal>
        ))}
        <Reveal soft>
          <div className="lk-rule-draw h-px w-full" style={{ background: ACCENT }} aria-hidden="true" />
        </Reveal>
      </div>
      <Reveal delay={80}>
        <p className="m-0 mt-5 text-[14px]" style={{ fontFamily: DISPLAY, color: MUT }}>
          Dagsetningar birtast á listak.is þegar nær dregur.
        </p>
      </Reveal>
    </section>
  )
}

/* ── §5 FRÆÐSLA ── */
function Education() {
  return (
    <section id="fraedsla" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24" aria-label="Fræðsla og fyrirlestrar">
      <Reveal>
        <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Fræðsla og fyrirlestrar</p>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {EDUCATION.map((e, i) => (
          <Reveal key={e.title} delay={i * 80} className="h-full">
            <a
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="flex h-full flex-col gap-3 p-6 no-underline"
              style={{ border: `1px solid ${ACCENT}`, color: INK }}
            >
              <h3 className="m-0 text-[19px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
                {e.title}
              </h3>
              <p className="m-0 text-[15px]" style={{ fontFamily: DISPLAY, color: MUT }}>{e.line}</p>
              <span className="lk-eyebrow mt-auto flex items-center gap-2" style={{ color: ACCENT_DEEP }}>
                Nánar á listak.is
                <ArrowUpRight size={14} aria-hidden />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ── §6 KETILHÚS · KETILKAFFI · SAFNBÚÐIN ── */
function Ketilhus() {
  return (
    <section id="ketilhus" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24" aria-label="Ketilhús og Ketilkaffi">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Í húsinu</p>
          </Reveal>
          <Reveal delay={60}>
            <h2
              className="m-0 mt-3 uppercase"
              style={{
                fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
                fontSize: 'clamp(1.8rem, 4vw, 3.4rem)', lineHeight: 1.02, paddingBottom: '0.12em',
              }}
            >
              Ketilhús og Ketilkaffi
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-6 flex flex-col">
              <div className="py-4" style={{ borderTop: `1px solid ${ACCENT}` }}>
                <h3 className="m-0 text-[17px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>Ketilhús</h3>
                <p className="m-0 mt-1.5 text-[15px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
                  Viðburðahús safnsins: sýningarrými og útleiga fyrir viðburði.
                </p>
              </div>
              <div className="py-4" style={{ borderTop: `1px solid ${ACCENT}` }}>
                <h3 className="m-0 text-[17px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>Ketilkaffi</h3>
                <p className="m-0 mt-1.5 text-[15px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
                  Kaffihús í Ketilhúsi, opið alla daga 08:00–17:00.
                </p>
              </div>
              <div className="py-4" style={{ borderTop: `1px solid ${ACCENT}`, borderBottom: `1px solid ${ACCENT}` }}>
                <h3 className="m-0 text-[17px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>Safnbúðin</h3>
                <p className="m-0 mt-1.5 text-[15px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
                  Safnbúð með völdum vörum, sjá myndina hér til hliðar.
                </p>
              </div>
              <p className="m-0 mt-4 text-[14px]" style={{ fontFamily: DISPLAY, color: MUT }}>
                {ADDRESS} · <a href={PHONE_HREF} className="inline-flex min-h-[44px] items-center" style={{ color: ACCENT_DEEP }}>{PHONE_DISPLAY}</a>
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <figure className="m-0">
            <DriftFrame
              src={IMG('samsett-mynd-1400.jpg')}
              srcSet={`${IMG('samsett-mynd-800.jpg')} 800w, ${IMG('samsett-mynd-1400.jpg')} 1400w`}
              sizes="(min-width: 1024px) 46vw, 100vw"
              alt="Samsett mynd úr safnbúð Listasafnsins á Akureyri: vörur og varningur búðarinnar"
              drift={9}
              className="aspect-[4/3]"
            />
            <figcaption className="mt-2.5 text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, color: MUT }}>
              Safnbúðin
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

/* ── §7 UM SAFNIÐ — the single serif register ── */
function About() {
  return (
    <section id="um" className="mx-auto max-w-[1440px] px-5 py-14 md:px-8 md:py-16" aria-label="Um safnið">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-20">
        <div>
          <Reveal>
            <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Um safnið</p>
          </Reveal>
          <Reveal delay={70}>
            <p
              className="lk-serif m-0 mt-6 max-w-[34em] text-[20px] font-light leading-[1.75] md:text-[23px]"
              style={{ color: INK }}
            >
              Listasafnið á Akureyri er opinbert safn sem Akureyrarbær rekur, til húsa við
              Kaupvangsstræti 8. Í húsinu eru tólf sýningarsalir ásamt Ketilhúsi, viðburðahúsi
              safnsins, og þar standa níu sýningar yfir samtímis. Safnið er viðurkennt safn.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-8 flex items-center gap-4">
              <img
                src={IMG('vidurkennt.png')}
                alt="Viðurkennt safn, viðurkenningarmerki"
                width={56}
                height={56}
                loading="lazy"
                className="h-14 w-14"
              />
              <p className="m-0 text-[14px]" style={{ fontFamily: DISPLAY, color: MUT }}>
                Viðurkennt safn · Rekið af Akureyrarbæ
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="flex flex-col">
            <a href={SITE_URL} target="_blank" rel="noreferrer" className="lk-row" style={{ borderTop: `1px solid ${ACCENT}` }}>
              <span className="text-[16px] font-medium uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
                Vinir Listasafnsins
              </span>
              <ArrowUpRight size={16} className="lk-row-arrow" aria-hidden />
            </a>
            <a href={SITE_URL} target="_blank" rel="noreferrer" className="lk-row">
              <span className="text-[16px] font-medium uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
                Útleiga á Ketilhúsi
              </span>
              <ArrowUpRight size={16} className="lk-row-arrow" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── §8 FYLGSTU MEÐ ── */
function Follow() {
  const links = [
    { label: 'Instagram · @listak.is', href: INSTAGRAM_URL },
    { label: 'Facebook', href: FACEBOOK_URL },
    { label: 'Póstlisti · skráning á listak.is', href: NEWSLETTER_URL },
  ]
  return (
    <section id="fylgstu" className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-14" aria-label="Fylgstu með">
      <Reveal>
        <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Fylgstu með</p>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-x-10 md:grid-cols-3">
        {links.map((l, i) => (
          <Reveal key={l.label} soft delay={i * 60}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="lk-row"
              style={{ borderTop: `1px solid ${ACCENT}`, borderBottom: 'none' }}
            >
              <span className="text-[15px] font-medium" style={{ fontFamily: DISPLAY }}>{l.label}</span>
              <ArrowUpRight size={16} className="lk-row-arrow" aria-hidden />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ── §9 FOOTER — ink band flip ── */
function Footer() {
  return (
    <footer id="samband" className="mt-2" style={{ background: INK, color: PAPER }} aria-label="Hafðu samband">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-20">
        <p
          className="m-0 uppercase"
          style={{
            fontFamily: DISPLAY, fontWeight: 700, letterSpacing: '-0.02em',
            fontSize: 'clamp(1.7rem, 4.6vw, 4rem)', lineHeight: 1.0,
            color: PAPER, paddingBottom: '0.22em', marginBottom: '-0.1em',
          }}
        >
          Listasafnið á Akureyri
        </p>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <p className="lk-eyebrow m-0" style={{ color: PAPER_MUTE }}>Heimsókn</p>
            <address className="mt-4 flex flex-col gap-2 not-italic" style={{ fontFamily: DISPLAY }}>
              <span className="text-[15px]">{ADDRESS}</span>
              <a href={PHONE_HREF} className="flex min-h-[44px] items-center text-[15px]" style={{ color: PAPER }}>
                {PHONE_DISPLAY}
              </a>
              <a href={EMAIL_HREF} className="flex min-h-[44px] items-center break-all text-[15px]" style={{ color: PAPER }}>
                {EMAIL}
              </a>
            </address>
          </div>
          <div>
            <p className="lk-eyebrow m-0" style={{ color: PAPER_MUTE }}>Opnunartímar</p>
            <dl className="m-0 mt-4 flex flex-col">
              {HOURS_RECAP.map((h) => (
                <div key={h.label} className="flex flex-col gap-0.5 py-2.5" style={{ borderTop: `1px solid ${HAIR_PAPER}` }}>
                  <dt className="text-[13px]" style={{ fontFamily: DISPLAY, color: PAPER_MUTE }}>{h.label}</dt>
                  <dd className="m-0 text-[15px]" style={{ fontFamily: DISPLAY }}>{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col items-start gap-4">
            <p className="lk-eyebrow m-0" style={{ color: PAPER_MUTE }}>Safnið</p>
            <div className="flex items-center gap-4">
              <img
                src={IMG('vidurkennt.png')}
                alt="Viðurkennt safn, viðurkenningarmerki"
                width={48}
                height={48}
                loading="lazy"
                className="h-12 w-12"
                style={{ background: PAPER, padding: 4 }}
              />
              <p className="m-0 text-[14px] leading-relaxed" style={{ fontFamily: DISPLAY, color: PAPER_MUTE }}>
                Viðurkennt safn<br />Rekið af Akureyrarbæ
              </p>
            </div>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="lk-eyebrow flex min-h-[44px] items-center gap-2"
              style={{ color: PAPER }}
            >
              listak.is
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </div>
      </div>
      <div
        className="px-5 py-5 text-center text-[12px] tracking-[0.16em]"
        style={{ fontFamily: DISPLAY, color: PAPER_MUTE, borderTop: `1px solid ${HAIR_PAPER}` }}
      >
        FRUMGERÐ · SNDR STUDIO
      </div>
    </footer>
  )
}

/* ── PAGE ── */
export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [resolved, setResolved] = useState(false)
  const [status, setStatus] = useState<OpenStatus | null>(null)

  /* head: title, description, lang, JSON-LD, font preloads */
  useEffect(() => {
    document.title = META.title
    setThemeColor(GROUND)
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', META.description)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    const preloads = ['familjen-grotesk-v11-latin_latin-ext-700.woff2', 'familjen-grotesk-v11-latin_latin-ext-600.woff2'].map((f) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      link.href = `${FONT_DIR}familjen-grotesk/${f}`
      document.head.appendChild(link)
      return link
    })
    return () => {
      meta?.setAttribute('content', prevDesc)
      ld.remove()
      preloads.forEach((l) => l.remove())
    }
  }, [])

  /* live open/closed status — computed once from the real rules */
  useEffect(() => {
    setStatus(openStatus())
  }, [])

  /* arm the mask choreography only for motion-ok desktop fine pointers.
     Touch and small viewports rest PRE-RESOLVED (photo revealed, solid
     wordmark) — the cutout veil would otherwise leave the first phone
     screen as dark type over empty stone with an invisible photo. The
     resting CSS state without .lk-js is already the resolved state. */
  useEffect(() => {
    if (prefersReduced()) return
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return
    setArmed(true)
  }, [])

  /* hero resolves ONCE, on first scroll intent */
  useEffect(() => {
    if (!armed || resolved) return
    let done = false
    const fire = () => {
      if (done) return
      done = true
      setResolved(true)
    }
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 0) fire() }
    const onScroll = () => { if ((window.scrollY || 0) > 8) fire() }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') fire()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchmove', fire, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', fire)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
    }
  }, [armed, resolved])

  /* THE JOURNEY — desktop, fine pointer, motion ok. Lenis + one pinned tween
     (a timeline freezes at x=0 — known Búðir bug), containerAnimation-style
     image parallax, DOF via the shared drift loop, keyboard focus mapping. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 1024px)',
        fine: '(pointer: fine)',
      },
      (mctx) => {
        const c = mctx.conditions as { motion: boolean; desktop: boolean; fine: boolean }
        if (!c.motion || !c.desktop || !c.fine) return undefined

        const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
        lenis.on('scroll', ScrollTrigger.update)
        pageLenis = lenis
        /* exposed for the QA harness only */
        ;(window as unknown as Record<string, unknown>).__lkLenis = lenis
        const tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        const journeyEl = root.querySelector('.lk-journey') as HTMLElement | null
        const track = root.querySelector('.lk-track') as HTMLElement | null
        const hudFill = root.querySelector('.lk-hud-fill') as HTMLElement | null
        const hudCount = root.querySelector('.lk-hud-count') as HTMLElement | null
        if (!journeyEl || !track) return undefined

        const maxX = () => Math.max(1, track.scrollWidth - window.innerWidth)
        /* a TWEEN, never a timeline */
        const journeyTween = gsap.to(track, { x: () => -maxX(), ease: 'none', force3D: true })
        /* HUD counter = the stop NEAREST viewport centre, from real geometry,
           so it can never disagree with the per-stop "n/09" labels. Centres
           are cached on refresh (offsetLeft is untransformed track space). */
        const showStops = Array.from(track.querySelectorAll('.lk-stop:not(.lk-stop-intro)')) as HTMLElement[]
        let stopCenters: number[] = []
        let maxXCache = 1
        const measureStops = () => {
          maxXCache = maxX()
          stopCenters = showStops.map((s) => s.offsetLeft + s.offsetWidth / 2)
        }
        measureStops()
        let lastIdx = -1
        const master = ScrollTrigger.create({
          animation: journeyTween,
          trigger: journeyEl,
          pin: journeyEl,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + maxX(),
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: measureStops,
          onUpdate: (self) => {
            if (hudFill) hudFill.style.transform = `scaleX(${self.progress})`
            if (hudCount && stopCenters.length) {
              const centre = maxXCache * self.progress + window.innerWidth / 2
              let idx = 0
              let best = Infinity
              for (let i = 0; i < stopCenters.length; i++) {
                const d = Math.abs(stopCenters[i] - centre)
                if (d < best) { best = d; idx = i }
              }
              if (idx !== lastIdx) {
                lastIdx = idx
                hudCount.textContent = `${String(idx + 1).padStart(2, '0')}/09`
              }
            }
          },
        })
        journeyNav = { master, track, lenis }

        /* depth-of-field: register every SHOW stop core with the SHARED drift
           loop (one reads pass per frame — never a second rAF loop). The
           intro panel is EXEMPT: it sits left-of-centre at pin entry, and the
           visitor needs its orientation copy sharp from the first frame. */
        const cores = Array.from(track.querySelectorAll('.lk-stop:not(.lk-stop-intro) .lk-stop-core')) as HTMLElement[]
        cores.forEach((el) => dofNodes.add(el))
        ensureDriftLoop()

        /* corridor image parallax rides the traverse via containerAnimation.
           Targets the <img>, never .lk-frame-in — that node belongs to the
           drift loop, and two writers on one transform fight. */
        const parallaxTweens: gsap.core.Tween[] = []
        Array.from(track.querySelectorAll('.lk-stop-frame > .lk-frame-in > img')).forEach((img) => {
          parallaxTweens.push(
            gsap.fromTo(img, { xPercent: 5.5, scale: 1.14 }, {
              xPercent: -5.5, scale: 1.14, ease: 'none',
              scrollTrigger: {
                trigger: (img as HTMLElement).closest('.lk-stop') as HTMLElement,
                containerAnimation: journeyTween,
                start: 'left 100%', end: 'right 0%', scrub: true,
              },
            }),
          )
        })

        /* keyboard reachability: focusing a stop travels the corridor to it */
        const onFocus = (e: FocusEvent) => {
          const stopEl = (e.target as Element | null)?.closest?.('.lk-stop') as HTMLElement | null
          if (!stopEl || !journeyNav) return
          journeyEl.scrollLeft = 0
          const mx = maxX()
          const x = Math.min(Math.max(0, stopEl.offsetLeft - (window.innerWidth - stopEl.offsetWidth) / 2), mx)
          const top = master.start + (x / mx) * (master.end - master.start)
          lenis.scrollTo(top, {})
        }
        journeyEl.addEventListener('focusin', onFocus)

        /* the traverse is only correct once the display font AND the track
           images have loaded — refresh after both */
        document.fonts.ready.then(() => ScrollTrigger.refresh())
        const imgs = Array.from(track.querySelectorAll('img'))
        Promise.all(imgs.map((im) => {
          const el = im as HTMLImageElement
          if (el.complete && el.naturalWidth > 0) return Promise.resolve()
          const dec = el.decode ? el.decode().catch(() => undefined) : undefined
          return dec ?? new Promise<void>((res) => {
            el.addEventListener('load', () => res(), { once: true })
            el.addEventListener('error', () => res(), { once: true })
          })
        })).then(() => ScrollTrigger.refresh())

        return () => {
          journeyEl.removeEventListener('focusin', onFocus)
          parallaxTweens.forEach((t) => {
            t.scrollTrigger?.kill()
            t.kill()
          })
          master.kill()
          journeyTween.kill()
          cores.forEach((el) => {
            dofNodes.delete(el)
            el.style.filter = ''
            el.style.transform = ''
            delete el.dataset.lkDof
          })
          maybeStopDriftLoop()
          gsap.ticker.remove(tick)
          lenis.destroy()
          delete (window as unknown as Record<string, unknown>).__lkLenis
          journeyNav = null
          pageLenis = null
        }
      },
    )
    return () => { mm.revert() }
  }, [])

  return (
    <div
      ref={rootRef}
      lang="is"
      className={`lk-root min-h-[100svh] antialiased ${armed ? 'lk-js' : ''} ${resolved ? 'lk-done' : ''}`}
      style={{ fontFamily: DISPLAY }}
    >
      <style>{CSS}</style>
      <a href="#meginmal" className="lk-skip">Beint í efni</a>
      <Header />
      <main id="meginmal">
        <Hero status={status} />
        <StatusTriptych status={status} />
        <Corridor />
        <Upcoming />
        <Education />
        <Ketilhus />
        <About />
        <Follow />
      </main>
      <Footer />
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
