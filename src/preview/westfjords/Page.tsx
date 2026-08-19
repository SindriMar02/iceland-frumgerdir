import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Mail, MapPin, Moon, Phone } from 'lucide-react'
import { companyEntry } from './data'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { CLOUD_IMAGES, CONTACT, ECLIPSE, HOURS, IMG, JSON_LD, MARQUEE_IMAGES, META, SIZES, SRCSET, TOURS } from './data'
import type { Tour } from './data'

const company = companyEntry

/* ── SEX LEIÐIR VESTUR (six ways west) ────────────────────────────────────
   Concept transplant from Tengile MalaMala Collection (tengilemalamala.com,
   measured at source): a LIBRARY of named, reusable section modules rather
   than one bespoke scroll. That structure fits Westfjords Adventures for a
   real reason, not a stylistic one: the business genuinely has six distinct
   service lines (bus, jeep, hiking, biking, multi-day, rental+stay), so a
   collection of modules IS the honest shape of the business, not decoration.

   ANTI-CONVERGENCE, ON PURPOSE: this build ships with NO animation library.
   No GSAP, no Lenis, no framer-motion. Every motion in this file is native
   CSS (transitions, wf-prefixed keyframes, one CSS scroll-driven animation
   behind @supports) plus IntersectionObserver for scroll reveals. That is
   the counterweight to the other two Westfjords Adventures builds and it
   mirrors the reference's own restraint (170 KB, zero JS animation deps).

   Fonts: Excon Variable (display) and Switzer Variable (body), both real
   files now present at public/fonts/excon/Excon-Variable.woff2 and
   public/fonts/switzer/Switzer-Variable.woff2, both Icelandic-verified for
   þ/ð/æ/ö and both-case acutes. Declared once each with a 100-900 range and
   font-display: swap; weight is driven per-element with
   font-variation-settings, exactly as directed.

   Glare axis: the reference's shimmer comes from PP Fragment's "glare"
   variable axis. No font on this machine reproduces that axis - weight
   alone cannot fake it. .wf-glare below is a STATIC diagonal gradient
   text-fill standing in for it. It is explicitly commented as an
   approximation where it is defined and used, and it never animates
   (this page only animates transform/opacity, and a moving gradient would
   violate that), so it is honestly a much quieter effect than the real
   thing, not a claimed equivalent. ────────────────────────────────────── */

const GROUND = '#F5EEE9' /* warm bone */
const GROUND_DEEP = '#EEE3D8' /* one step deeper, for alternating sections */
const CARD = '#FFFFFF'
const INK = '#373F1D' /* deep olive ink - ~9.6:1 on GROUND */
const ACCENT = '#5C6E21' /* olive accent - ~4.9:1 on GROUND, both directions */
const MUT = '#5B5A4E' /* warm muted grey - ~6.1:1 on GROUND, verified WCAG relative-luminance */
const HAIR = 'rgba(55,63,29,0.14)'
const HAIR_STRONG = 'rgba(55,63,29,0.26)'

const R_CARD = '14px'
const R_PILL = '9999px'

const FONT_DISPLAY_URL = `${import.meta.env.BASE_URL}fonts/excon/Excon-Variable.woff2`
const FONT_BODY_URL = `${import.meta.env.BASE_URL}fonts/switzer/Switzer-Variable.woff2`
const DISPLAY = "'Excon Variable', ui-sans-serif, system-ui, sans-serif"
const BODY = "'Switzer Variable', ui-sans-serif, system-ui, sans-serif"

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const CSS = `
  @font-face {
    font-family: 'Excon Variable';
    src: url('${FONT_DISPLAY_URL}') format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Switzer Variable';
    src: url('${FONT_BODY_URL}') format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }

  /* contact rows measured 350x24 on a phone: wide enough, far too short */
  @media (max-width: 640px) {
    .wf-page a[href^="tel:"], .wf-page a[href^="mailto:"], .wf-page a[href*="maps"] {
      min-height: 44px; display: inline-flex; align-items: center;
    }
    .wf-page .text-\\[11px\\] { font-size: 12px; }
  }

  .wf-page ::selection { background: ${ACCENT}; color: ${GROUND}; }
  .wf-page a:focus-visible, .wf-page button:focus-visible {
    outline: 2px solid ${ACCENT}; outline-offset: 3px; border-radius: 4px;
  }

  @media (prefers-reduced-motion: no-preference) {
    html:has(.wf-page) { scroll-behavior: smooth; }
  }

  /* mount-triggered / IO-triggered reveals: opacity + translateY only, on an
     UNTRANSFORMED wrapper (never clip-path/scale-to-zero - see rule 6: an
     element observed while collapsed to nothing never satisfies its own
     observer). translateY(28px) shifts position, it never zeroes the box. */
  @keyframes wf-rise {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes wf-rise-soft {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes wf-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes wf-bob {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(7px); }
  }
  @keyframes wf-pulse {
    0%, 100% { opacity: 1;    transform: scale(1); }
    50%      { opacity: 0.5; transform: scale(1.14); }
  }

  .wf-reveal { opacity: 0; transform: translateY(28px); }
  .wf-reveal.is-in { animation: wf-rise 0.9s ${EASE} both; }
  .wf-reveal-soft { opacity: 0; transform: translateY(14px); }
  .wf-reveal-soft.is-in { animation: wf-rise-soft 0.7s ${EASE} both; }

  .wf-marquee-wrap { overflow: hidden; }
  .wf-marquee-track { animation: wf-marquee 54s linear infinite; }
  .wf-marquee-track:hover { animation-play-state: paused; }

  .wf-scroll-cue { animation: wf-bob 2.4s ease-in-out infinite; }
  .wf-pulse-ring { animation: wf-pulse 2.8s ease-in-out infinite; }

  /* APPROXIMATION ONLY - see file-level comment. Static gradient text-fill,
     never animated, standing in for PP Fragment's glare axis. Not the same
     mechanism and not claimed to be. Both places this is used (the hero
     headline over the darkened photo, and the quote panel on solid INK) sit
     on dark grounds, so the gradient stays within light bone/white tones on
     purpose — an ink-toned gradient would be near-invisible on an ink-toned
     background, which defeats the point of a shimmer entirely. */

  /* ── HEKLUSÝN / kononenkogroup image-mask drift ────────────────────────
     Images drift INSIDE a fixed frame; they never move with the page. No
     WebGL, no canvas - real <img> tags stay visible throughout, which is why
     this belongs on the one build that ships with no animation library.

     --dz is DERIVED from the drift value, never hardcoded: a flat inset:-9%
     is silently correct at drift 6 and silently WRONG at 12, where the image
     runs out of overhang and its own edge slides into frame at the extremes
     of the travel. */
  .wf-frame { position: relative; overflow: hidden; width: 100%; }
  .wf-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; will-change: transform; }
  .wf-frame-in > img { width: 100%; height: 100%; object-fit: cover; }

  /* Text mask reveal. The RESTING state is visible: the hidden start only
     exists while the .wf-js class is present, so a JS failure, a crawler or a
     paused rAF can never strand the copy off-screen.
     The .22em headroom is load-bearing, not cosmetic - at display sizes .06em
     is not enough and descenders (g y j p, and þ) clip on the mask edge. */
  .wf-mask { display: block; overflow: hidden; padding-bottom: 0.22em; margin-bottom: -0.22em; }
  .wf-js .wf-mask > .wf-mask-in { transform: translateY(108%); }
  .wf-js .wf-mask.is-in > .wf-mask-in {
    transform: translateY(0);
    transition: transform 1.05s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    .wf-frame-in { inset: 0; transform: none !important; }
    .wf-js .wf-mask > .wf-mask-in { transform: none !important; transition: none !important; }
  }

  .wf-glare {
    background-image: linear-gradient(115deg, #F5EEE9 30%, #FFFFFF 50%, #F5EEE9 70%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  /* animated hamburger -> X, transform/opacity only */
  .wf-burger-line { transform-origin: center; transition: transform 0.35s ${EASE}, opacity 0.25s ${EASE}; }
  .wf-burger-open .wf-burger-line-1 { transform: translateY(7px) rotate(45deg); }
  .wf-burger-open .wf-burger-line-2 { opacity: 0; }
  .wf-burger-open .wf-burger-line-3 { transform: translateY(-7px) rotate(-45deg); }

  .wf-overlay-link { transition: transform 0.4s ${EASE}, opacity 0.4s ${EASE}; }

  /* CSS scroll-driven animation, progressive enhancement only: a slow
     scale/drift on the hero photo tied to scroll position. Fully absent in
     browsers without support (no fallback needed - the image is already
     correctly framed without it), and switched off under reduced motion. */
  /* the old @supports scroll-driven hero parallax was removed: the hero
     now uses the same DriftFrame as every other image, and two mechanisms
     writing the same transform would fight. */


  @media (prefers-reduced-motion: reduce) {
    .wf-reveal, .wf-reveal-soft { opacity: 1 !important; transform: none !important; animation: none !important; }
    .wf-marquee-track { animation: none !important; }
    .wf-marquee-wrap { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
    .wf-marquee-dup { display: none !important; }
    .wf-scroll-cue, .wf-pulse-ring { animation: none !important; }
    .wf-hero-img { animation: none !important; }
  }
`

/* ── small shared primitives ── */

function Kicker({ children }: { children: ReactNode }) {
  return (
    <span
      className="text-[11px] uppercase tracking-[0.22em] md:text-[12px]"
      style={{ fontFamily: BODY, color: MUT }}
    >
      {children}
    </span>
  )
}

function Heading({
  as: Tag = 'h2',
  children,
  className = '',
  glare = false,
  plain = false,
}: {
  as?: 'h1' | 'h2' | 'h3'
  children: ReactNode
  className?: string
  glare?: boolean
  /** opt out of the mask for headings that already sit inside one */
  plain?: boolean
}) {
  /* leading is lifted from .9 to .98 here specifically because the mask crops
     at the line box: at .9 the box is tighter than the descender depth of
     ð/þ/g/j and they clip against the mask edge no matter how much padding
     the mask itself carries. */
  /* wf-glare MUST sit on the element that directly holds the text. It works by
     painting a gradient into the element's background box and clipping it to the
     glyphs, with color:transparent. A transformed descendant (the mask's inner
     span) paints into its own layer, so an ancestor's clipped background never
     reaches it: the colour still inherits as transparent and the heading renders
     as nothing at all. That is exactly what happened to the quote section. */
  const body = glare ? <span className="wf-glare block">{children}</span> : children
  const inner = plain ? body : <MaskLine>{body}</MaskLine>
  return (
    <Tag
      className={`uppercase leading-[0.98] tracking-[-0.02em] ${className}`}
      style={{ fontFamily: DISPLAY, color: glare ? undefined : INK, fontVariationSettings: "'wght' 230" }}
    >
      {inner}
    </Tag>
  )
}

/* IntersectionObserver reveal: fires once, on an untransformed wrapper
   (opacity/translateY only - never a self-clipping element, see rule 6). */
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


/* ── the drift engine ──────────────────────────────────────────────────────
   ONE shared rAF loop for every frame on the page.

   Perf bug 1 from the spec, and it is real: interleaving getBoundingClientRect
   with style writes forces a synchronous layout per node per frame, which pins
   the main thread hard enough to freeze devtools. So every READ happens first,
   into an array, and only then does anything get WRITTEN.

   Perf bug 2: no React setState anywhere in here. The interpolated value goes
   straight to the node's own style via the registered element. */
const driftNodes = new Set<HTMLElement>()
let driftRaf = 0

function driftTick() {
  const vh = window.innerHeight
  const reads: Array<[HTMLElement, number]> = []
  driftNodes.forEach((el) => {
    const host = el.parentElement
    if (!host) return
    const r = host.getBoundingClientRect()
    if (r.bottom < -240 || r.top > vh + 240) return
    reads.push([el, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)])
  })
  for (let i = 0; i < reads.length; i++) {
    const [el, p] = reads[i]
    const d = Number(el.dataset.drift) || 9
    /* images drift as a PERCENT of their own oversized box; text drifts in
       PIXELS, because a percent of a line box would be enormous. Spec numbers:
       images 6 contained / 9 cards / 12-13 full-bleed, text 12 body / 26
       headings / 34-40 statement. */
    const unit = el.dataset.driftUnit === 'px' ? 'px' : '%'
    el.style.transform = `translate3d(0, ${(-p * d).toFixed(3)}${unit}, 0)`
  }
  driftRaf = requestAnimationFrame(driftTick)
}

/** Register a node with the shared loop for as long as it is mounted. */
function useDriftNode(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return
    driftNodes.add(el)
    if (!driftRaf) driftRaf = requestAnimationFrame(driftTick)
    return () => {
      driftNodes.delete(el)
      if (!driftNodes.size && driftRaf) {
        cancelAnimationFrame(driftRaf)
        driftRaf = 0
      }
    }
  }, [ref])
}

/** Continuous text drift. This is the SECOND of the two text layers: the mask
 *  reveal fires once on arrival, this one runs the whole time the line is on
 *  screen. They must live on separate elements or they fight over one
 *  transform. */
function DriftText({
  children,
  drift = 26,
  className = '',
}: {
  children: ReactNode
  drift?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useDriftNode(ref)
  return (
    <span className={`block ${className}`}>
      <span ref={ref} data-drift={drift} data-drift-unit="px" className="block will-change-transform">
        {children}
      </span>
    </span>
  )
}

/** A fixed frame whose image drifts inside it. drift: 6 contained, 9 cards,
 *  12-13 full-bleed bands (at 6 a full-bleed band travels ~26px and reads as
 *  nothing at all). */
function DriftFrame({
  src,
  alt,
  drift = 9,
  className = '',
  style,
  eager = false,
}: {
  src: string
  alt: string
  drift?: number
  className?: string
  style?: React.CSSProperties
  eager?: boolean
}) {
  const inner = useRef<HTMLDivElement>(null)
  useDriftNode(inner)
  return (
    <div className={`wf-frame ${className}`} style={style}>
      <div
        ref={inner}
        className="wf-frame-in"
        data-drift={drift}
        style={{ ['--dz' as string]: `${Math.max(9, drift * 1.35).toFixed(2)}%` }}
      >
        <img
          src={src}
          srcSet={SRCSET[src]}
          sizes={SIZES}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    </div>
  )
}

/** Text mask reveal: translateY(108%) -> 0 inside overflow:hidden, fired once. */
function MaskLine({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useInView<HTMLSpanElement>()
  return (
    <span ref={ref} className={`wf-mask ${inView ? 'is-in' : ''} ${className}`}>
      <span className="wf-mask-in block" style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
        {children}
      </span>
    </span>
  )
}

function Reveal({
  children,
  className = '',
  delay = 0,
  soft = false,
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
      className={`${soft ? 'wf-reveal-soft' : 'wf-reveal'} ${inView ? 'is-in' : ''} ${className}`}
      style={inView ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/* ── nav ── */
const NAV_LINKS = [
  { id: 'leidir', label: 'Leiðirnar sex' },
  { id: 'vestfirdir', label: 'Vestfirðir' },
  { id: 'almyrkvi', label: 'Almyrkvinn' },
  { id: 'gisting', label: 'Gisting og leiga' },
  { id: 'samband', label: 'Samband' },
]

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: 'start' })
}

function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  /* solidify on scroll WITHOUT a scroll listener (rule 11): observe a 1px
     sentinel Hero renders near the bottom of its own viewport height. */
  useEffect(() => {
    const el = document.getElementById('wf-hero-sentinel')
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setSolid(!entry.isIntersecting))
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    goTo(id)
  }

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-40 transition-colors duration-500"
        style={{
          background: solid || open ? `${GROUND}F2` : 'transparent',
          backdropFilter: solid || open ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: solid || open ? 'blur(14px)' : 'none',
          borderBottom: solid || open ? `1px solid ${HAIR}` : '1px solid transparent',
        }}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-8">
          <button
            onClick={() => go('efst')}
            className="text-[15px] uppercase tracking-[-0.01em] md:text-[17px]"
            style={{
              fontFamily: DISPLAY,
              fontVariationSettings: "'wght' 500",
              color: solid ? INK : '#FFFFFF',
              textShadow: solid ? 'none' : '0 1px 8px rgba(20,20,10,0.45)',
            }}
            aria-label="Westfjords Adventures, efst á síðu"
          >
            Westfjords Adventures
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="text-[13px] uppercase tracking-[0.12em] transition-opacity duration-300 hover:opacity-70"
                style={{
                  fontFamily: BODY,
                  color: solid ? MUT : '#F2EEE6',
                  textShadow: solid ? 'none' : '0 1px 6px rgba(20,20,10,0.4)',
                }}
              >
                {l.label}
              </button>
            ))}
            <a
              href={CONTACT.phoneHref}
              className="rounded-full px-5 py-2.5 text-[13px] font-medium transition-transform duration-300 active:scale-[0.97]"
              style={{ background: ACCENT, color: GROUND, fontFamily: BODY, borderRadius: R_PILL }}
            >
              {CONTACT.phoneDisplay}
            </a>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
            className={`relative flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${open ? 'wf-burger-open' : ''}`}
            style={{
              borderColor: solid || open ? HAIR_STRONG : 'rgba(255,255,255,0.4)',
              background: solid || open ? 'transparent' : 'rgba(20,20,10,0.28)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <span className="relative block h-4 w-5" aria-hidden>
              <span
                className="wf-burger-line wf-burger-line-1 absolute inset-x-0 top-0 h-[1.5px]"
                style={{ background: solid || open ? INK : '#FFF' }}
              />
              <span
                className="wf-burger-line wf-burger-line-2 absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2"
                style={{ background: solid || open ? INK : '#FFF' }}
              />
              <span
                className="wf-burger-line wf-burger-line-3 absolute inset-x-0 bottom-0 h-[1.5px]"
                style={{ background: solid || open ? INK : '#FFF' }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* mobile overlay: a SIBLING of <header>, not nested inside it (rule 10) */}
      <div
        className="fixed inset-0 z-30 flex flex-col justify-between px-6 pb-10 pt-24 transition-[opacity,visibility] duration-400 lg:hidden"
        style={{
          background: GROUND,
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          transitionDuration: '0.4s',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Valmynd"
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              tabIndex={open ? 0 : -1}
              className="wf-overlay-link border-b py-4 text-left text-[26px] uppercase"
              style={{
                fontFamily: DISPLAY,
                fontVariationSettings: "'wght' 260",
                color: INK,
                borderColor: HAIR,
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: open ? `${80 + i * 45}ms` : '0ms',
              }}
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div className="flex flex-col gap-3">
          <a
            href={CONTACT.phoneHref}
            tabIndex={open ? 0 : -1}
            className="flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-medium"
            style={{ background: ACCENT, color: GROUND, fontFamily: BODY, borderRadius: R_PILL }}
          >
            <Phone size={16} aria-hidden />
            {CONTACT.phoneDisplay}
          </a>
          <a
            href={CONTACT.emailHref}
            tabIndex={open ? 0 : -1}
            className="flex items-center justify-center gap-2 rounded-full border py-3.5 text-[15px]"
            style={{ borderColor: HAIR_STRONG, color: INK, fontFamily: BODY, borderRadius: R_PILL }}
          >
            <Mail size={16} aria-hidden />
            {CONTACT.email}
          </a>
        </div>
      </div>
    </>
  )
}

/* ── SectionHero: 0.90-leading uppercase three-line rag over Dynjandi.
      Full-bleed background photo is MOUNT-TRIGGERED (not IntersectionObserver
      - it is already the first thing on screen, so an observer would just
      fire immediately; a short mount delay reads more deliberately). ── */
function SectionHero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  /* TWO layers, on SEPARATE elements, never sharing one transform:
       1. DriftText - continuous drift the whole time the line is on screen,
          in pixels, at the spec's "statement" weight.
       2. MaskLine  - the arrival reveal, translateY(108%) -> 0 inside
          overflow:hidden, fired once, staggered per line.
     Nesting them the other way round would make the mask's own overflow clip
     the drift. */
  const line = (text: string, extraClass = '', delay = 0) => (
    <DriftText drift={36} className={extraClass}>
      <MaskLine delay={delay}>
        <span className="wf-glare block">{text}</span>
      </MaskLine>
    </DriftText>
  )

  return (
    <section id="efst" className="relative flex min-h-[100dvh] items-end overflow-hidden" style={{ background: INK }}>
      {/* real, descriptive alt stays exposed to assistive tech - no aria-hidden
          on this wrapper, unlike the current site's 21-of-22 unlabelled images */}
      <div
        className="absolute inset-0"
        style={{ opacity: mounted ? 1 : 0, transition: `opacity 1.4s ${EASE}` }}
      >
        {/* the landing image gets the same drift as every other frame on the
            page. A full-bleed 100dvh band takes drift 13: at 6 it travels about
            26px over a whole viewport and reads as nothing at all. */}
        <DriftFrame src={IMG.dynjandi.src} alt={IMG.dynjandi.alt} drift={13} className="h-full" eager />
        <div
          className="absolute inset-0"
          style={{
            /* Dynjandi is a white cascade and the display type is near-white, so
               the old stops (0.42 at 42%, 0.12 at 62%) left the middle two lines
               crossing bare falling water. The headline occupies roughly 27% to
               56% up from the bottom, so that band is held at 0.60-0.74 while the
               cliff top above stays open. */
            background: `linear-gradient(to top, rgba(30,32,17,0.90) 4%, rgba(30,32,17,0.74) 26%, rgba(30,32,17,0.60) 46%, rgba(30,32,17,0.36) 64%, rgba(30,32,17,0.14) 82%, rgba(30,32,17,0.30) 100%)`,
          }}
        />
      </div>

      {/* solidify sentinel for Nav - sits near the bottom of the hero
          viewport so the header only goes solid once the hero is mostly
          scrolled past, not on the very first pixel of scroll. */}
      <div id="wf-hero-sentinel" aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: 'calc(100dvh - 140px)' }} />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 pt-32 md:px-8 md:pb-24">
        <Kicker>
          <span style={{ color: '#E7E1D3' }}>Ferðaþjónusta á Patreksfirði, Vestfirðir</span>
        </Kicker>
        {/* aria-label is authoritative for the accessible name: the three lines are
            separate block spans, so textContent collapses to "Sex leiðirinn í
            sömufirðina." with no spaces, which is what a screen reader and a
            crawler would otherwise get. */}
        <h1
          aria-label="Sex leiðir inn í sömu firðina."
          className="mt-5 max-w-4xl text-[clamp(2.6rem,9vw,6.4rem)] uppercase leading-[0.9] tracking-[-0.02em]"
          style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 230", paddingTop: '0.12em' }}
        >
          {line('Sex leiðir', '', 0)}
          {line('inn í sömu', 'ml-[0.85em]', 110)}
          {line('firðina.', '', 220)}
        </h1>

        <p
          className="mt-7 max-w-md text-[15px] md:text-base"
          style={{
            color: '#F2EEE6',
            fontFamily: BODY,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(14px)',
            transition: `opacity 0.9s ${EASE} 0.5s, transform 0.9s ${EASE} 0.5s`,
          }}
        >
          Sex ferðamátar. Einn fjórðungur. Engin keðja.
        </p>

        <div
          className="mt-9 flex flex-wrap items-center gap-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(14px)',
            transition: `opacity 0.9s ${EASE} 0.65s, transform 0.9s ${EASE} 0.65s`,
          }}
        >
          <button
            onClick={() => goTo('leidir')}
            className="rounded-full px-7 py-3.5 text-[15px] font-medium transition-transform duration-300 active:scale-[0.97]"
            style={{ background: ACCENT, color: GROUND, fontFamily: BODY, borderRadius: R_PILL }}
          >
            Skoða leiðirnar sex
          </button>
          <button
            onClick={() => goTo('almyrkvi')}
            className="rounded-full border px-7 py-3.5 text-[15px] font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/70"
            /* a bare outline button over a photograph measured 3.42:1; it needs a
               real backdrop of its own, not just a hairline (WCAG AA is 4.5:1) */
            style={{ borderColor: 'rgba(255,255,255,0.55)', background: 'rgba(18,20,10,0.52)', fontFamily: BODY, borderRadius: R_PILL }}
          >
            Almyrkvinn 12. ágúst
          </button>
        </div>
      </div>

    </section>
  )
}

/* ── SectionStory: a reusable module (used twice, once for "who we are",
      once for "the place itself") - exactly the reference's own library
      ethos, one component, different content each time. ── */
function SectionStory({
  id,
  kicker,
  heading,
  body,
  image,
  imageAlt,
  reverse = false,
  stats,
  ground = GROUND,
}: {
  id?: string
  kicker: string
  heading: string
  body: string
  image: string
  imageAlt: string
  reverse?: boolean
  stats?: { value: string; label: string }[]
  ground?: string
}) {
  return (
    <section id={id} className="py-24 md:py-32" style={{ background: ground }}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <div>
            <Reveal>
              <Kicker>{kicker}</Kicker>
            </Reveal>
            <Reveal delay={70}>
              <Heading className="mt-4 text-[clamp(2rem,4.6vw,3.4rem)]">{heading}</Heading>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-lg text-base leading-relaxed md:text-lg" style={{ color: MUT, fontFamily: BODY }}>
                {body}
              </p>
            </Reveal>
            {stats && (
              <Reveal delay={200}>
                <div className="mt-9 flex flex-wrap gap-8">
                  {stats.map((s) => (
                    <div key={s.label} className="border-t pt-3" style={{ borderColor: HAIR_STRONG }}>
                      <div className="text-[34px] leading-none" style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 240", color: ACCENT }}>
                        {s.value}
                      </div>
                      <div className="mt-2 max-w-[13ch] text-[13px]" style={{ color: MUT, fontFamily: BODY }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
          <Reveal delay={120}>
            <div className="overflow-hidden" style={{ borderRadius: R_CARD }}>
              <DriftFrame src={image} alt={imageAlt} drift={9} className="aspect-[4/5] md:aspect-[5/4]" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── SectionTourIndex: the centrepiece. The collection itself, six named
      cards, one per real service line. No prices, durations, departure
      times or group sizes anywhere - those live only in the real Bókun
      widget on the real tour pages, never faked here. ── */
function TourCard({ tour, index }: { tour: Tour; index: number }) {
  return (
    <Reveal delay={index * 70} className="h-full">
      <article className="flex h-full flex-col overflow-hidden border" style={{ background: CARD, borderColor: HAIR, borderRadius: R_CARD }}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={tour.img.src} srcSet={SRCSET[tour.img.src]} sizes={SIZES} alt={tour.img.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
          <span
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[12px]"
            style={{ background: `${GROUND}E6`, color: INK, fontFamily: BODY, borderRadius: R_PILL }}
            aria-hidden
          >
            {tour.num}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <Heading as="h3" className="text-[22px] md:text-[24px]">
            {tour.title}
          </Heading>
          <p className="mt-3 flex-1 text-[14.5px] leading-relaxed" style={{ color: MUT, fontFamily: BODY }}>
            {tour.desc}
          </p>
        </div>
      </article>
    </Reveal>
  )
}

function SectionTourIndex() {
  return (
    <section id="leidir" className="py-24 md:py-32" style={{ background: GROUND_DEEP }}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <Kicker>Safnið</Kicker>
            </Reveal>
            <Reveal delay={70}>
              <Heading className="mt-4 text-[clamp(2.2rem,5.6vw,4.4rem)]">Veldu þína leið</Heading>
            </Reveal>
          </div>
          <Reveal delay={120} className="max-w-sm">
            <p className="text-[15px]" style={{ color: MUT, fontFamily: BODY }}>
              Sex ólíkar leiðir um sama landsvæðið. Hver þeirra er skipulögð, seld og bókuð í gegnum Bókun kerfið á vef Westfjords Adventures.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {TOURS.map((tour, i) => (
            <TourCard key={tour.id} tour={tour} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── SectionImagesCloud: an asymmetric scatter, four images at different
      sizes/offsets, distinct from the six tour photos above. ── */
function SectionImagesCloud() {
  const offsets = ['md:mt-0', 'md:mt-16', 'md:mt-6', 'md:mt-24']
  return (
    <section className="py-24 md:py-32" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <Kicker>Í myndum</Kicker>
        </Reveal>
        <Reveal delay={70}>
          <Heading className="mt-4 max-w-2xl text-[clamp(2rem,4.6vw,3.6rem)]">Fjögur augnablik, fjórir firðir</Heading>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {CLOUD_IMAGES.map((c, i) => (
            <Reveal key={c.caption} delay={i * 80} className={offsets[i % offsets.length]}>
              <div className="overflow-hidden" style={{ borderRadius: R_CARD }}>
                <DriftFrame
                  src={c.img.src}
                  alt={c.img.alt}
                  drift={9}
                  className={i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'}
                />
              </div>
              <p className="mt-3 text-[12px] uppercase tracking-[0.16em]" style={{ color: MUT, fontFamily: BODY }}>
                {c.caption}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── SectionQuote: the company's own voice on why six leiðir, not one.
      A stated philosophy, not a fabricated guest review (rule 4 bars
      inventing review scores; this sidesteps that by never pretending to
      be a customer). ── */
function SectionQuote() {
  return (
    <section className="py-24 md:py-32" style={{ background: INK }}>
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <Heading className="text-[clamp(1.9rem,5vw,3.4rem)]" glare>
            „Vestfirðir eru ekki ein leið, heldur margar.
            <br />
            Okkar hlutverk er að finna leiðina sem hentar þér.“
          </Heading>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 text-[12px] uppercase tracking-[0.22em]" style={{ color: '#C9CBB5', fontFamily: BODY }}>
            Westfjords Adventures
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ── SectionImagesMarquee: the full 12-image library, looping, so this
      block alone gives a sense of the whole of Vestfirðir. List duplicated
      once for a seamless CSS-transform loop (translateX only - rule 11). ── */
function SectionImagesMarquee() {
  const track = useMemo(() => [...MARQUEE_IMAGES, ...MARQUEE_IMAGES], [])
  return (
    <section className="py-20 md:py-28" style={{ background: GROUND_DEEP }}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <Kicker>Vestfirðir, í hringrás</Kicker>
        </Reveal>
      </div>
      <Reveal delay={80} soft className="wf-marquee-wrap mt-8">
        <div className="wf-marquee-track flex w-max gap-4 px-5 md:gap-6 md:px-8">
          {track.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className={`h-48 w-64 shrink-0 overflow-hidden md:h-64 md:w-80 ${i >= MARQUEE_IMAGES.length ? 'wf-marquee-dup' : ''}`}
              style={{ borderRadius: R_CARD }}
            >
              <img src={img.src} srcSet={SRCSET[img.src]} sizes="50vw" alt={img.alt} loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

/* ── SectionEclipse: the total solar eclipse block. Every claim kept to
      what is verified (date, totality, path over the Westfjords); nothing
      operational is invented. The countdown is computed at render time so
      it never goes stale. ── */
function eclipseCountdownLabel(): string {
  const now = Date.now()
  const target = new Date(ECLIPSE.isoDate).getTime()
  const days = Math.ceil((target - now) / 86_400_000)
  if (days > 1) return `${days} dagar til almyrkva`
  if (days === 1) return 'Almyrkvinn er á morgun'
  if (days === 0) return 'Almyrkvinn er í dag'
  return 'Almyrkvinn var 12. ágúst 2026'
}

function SectionEclipse() {
  const [countdown, setCountdown] = useState('')
  useEffect(() => {
    setCountdown(eclipseCountdownLabel())
  }, [])

  return (
    <section id="almyrkvi" className="relative overflow-hidden py-24 md:py-32">
      {/* Atmospheric backdrop only - NOT a photo of the eclipse itself (see the
          TODO on ECLIPSE.bgImg in data.ts). Real alt text stays exposed and
          honestly describes what the photo actually is, so it never
          misidentifies itself as eclipse imagery to assistive tech either. */}
      <div className="absolute inset-0">
        <DriftFrame src={ECLIPSE.bgImg.src} alt={ECLIPSE.bgImg.alt} drift={12} className="h-full" />
        <div className="absolute inset-0" style={{ background: 'rgba(20,21,12,0.86)' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <span
            className="wf-pulse-ring inline-flex h-14 w-14 items-center justify-center rounded-full border"
            style={{ borderColor: 'rgba(245,238,233,0.35)' }}
            aria-hidden
          >
            <Moon size={22} color="#F5EEE9" />
          </span>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-6 text-[12px] uppercase tracking-[0.24em]" style={{ color: '#C9CBB5', fontFamily: BODY }}>
            {ECLIPSE.weekday} · {ECLIPSE.dateLabel}
          </p>
        </Reveal>
        <Reveal delay={140}>
          <Heading className="mt-4 text-[clamp(2.2rem,5.6vw,4rem)]">
            <span style={{ color: '#F5EEE9' }}>{ECLIPSE.heading}</span>
          </Heading>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed md:text-base" style={{ color: '#D8D3C4', fontFamily: BODY }}>
            {ECLIPSE.body}
          </p>
        </Reveal>
        <Reveal delay={260}>
          <p className="mt-8 inline-block rounded-full border px-5 py-2 text-[12px] uppercase tracking-[0.16em]" style={{ borderColor: 'rgba(245,238,233,0.3)', color: '#F5EEE9', fontFamily: BODY, borderRadius: R_PILL }} aria-live="polite">
            {countdown}
          </p>
        </Reveal>
        <Reveal delay={320}>
          <p className="mt-6 text-[12px]" style={{ color: '#A9AC94', fontFamily: BODY }}>
            Tími, aðgengi og skipulag á staðnum eru enn óstaðfest og bíða staðfestingar Westfjords Adventures.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ── SectionAccommodations: named to match the reference's own module
      (SectionAccommodations is one of its real CSS module names). ── */
function SectionAccommodations() {
  return (
    <SectionStory
      id="gisting"
      kicker="Umfram ferðirnar"
      heading="Gisting og leiga"
      body="Fyrir þá sem vilja staldra lengur við rekur Westfjords Adventures hjóla- og bílaleigu, auk þess að bjóða upp á gistingu á Patreksfirði. Nánari upplýsingar og framboð fást milliliðalaust hjá fyrirtækinu, sjá samband hér að neðan."
      image={IMG.osvor.src}
      imageAlt={IMG.osvor.alt}
      reverse
      ground={GROUND}
    />
  )
}

/* ── SectionCoverCTA: the booking handoff. THIS WORKS via Bókun already -
      the page does not fake a booking engine, it hands off honestly to the
      real domain and names the real system by name. Bookends the page on
      the same Dynjandi photograph the hero opened on, deliberately. ── */
function SectionCoverCTA() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="absolute inset-0">
        <DriftFrame src={IMG.dynjandi.src} alt={IMG.dynjandi.alt} drift={12} className="h-full" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(30,32,17,0.82), rgba(30,32,17,0.7))' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-2xl px-5 text-center md:px-8">
        <Reveal>
          <Heading className="text-[clamp(2.4rem,6.6vw,5rem)]">
            <span style={{ color: '#FFFFFF' }}>Bókaðu beint.</span>
          </Heading>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed md:text-base" style={{ color: '#F0EBDF', fontFamily: BODY }}>
            Hver ferð er bókanleg í rauntíma í gegnum Bókun kerfið á vefsíðu Westfjords Adventures. Enginn milliliður, engin bið eftir svari.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <a
            href={CONTACT.website}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex items-center gap-3 rounded-full py-3.5 pl-7 pr-3 text-[15px] font-medium transition-transform duration-300 active:scale-[0.97]"
            style={{ background: GROUND, color: INK, fontFamily: BODY, borderRadius: R_PILL }}
          >
            Fara á {CONTACT.websiteDisplay}
            <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgba(55,63,29,0.1)' }}>
              <ArrowUpRight size={16} aria-hidden />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ── SectionContact: real phone, real email, honest hours. The wedge is
      stated plainly and scoped ("winter"), never mocked. ── */
function SectionContact() {
  return (
    <section id="samband" className="py-24 md:py-32" style={{ background: GROUND }}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal>
              <Kicker>Samband</Kicker>
            </Reveal>
            <Reveal delay={70}>
              <Heading className="mt-4 text-[clamp(2rem,4.6vw,3.2rem)]">Hafðu samband</Heading>
            </Reveal>
            <Reveal delay={140}>
              <div className="mt-8 flex flex-col gap-4">
                <a href={CONTACT.phoneHref} className="flex items-center gap-3 text-[16px]" style={{ color: INK, fontFamily: BODY }}>
                  <Phone size={17} style={{ color: ACCENT }} aria-hidden />
                  {CONTACT.phoneDisplay}
                </a>
                <a href={CONTACT.emailHref} className="flex items-center gap-3 text-[16px] break-all" style={{ color: INK, fontFamily: BODY }}>
                  <Mail size={17} style={{ color: ACCENT }} aria-hidden />
                  {CONTACT.email}
                </a>
                <a href={CONTACT.mapsHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[16px]" style={{ color: INK, fontFamily: BODY }}>
                  <MapPin size={17} style={{ color: ACCENT }} aria-hidden />
                  {CONTACT.location}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <div className="rounded-2xl border p-8 md:p-10" style={{ borderColor: HAIR, background: CARD, borderRadius: R_CARD }}>
              <Kicker>Opnunartími skrifstofu</Kicker>
              <div className="mt-5 flex items-baseline justify-between gap-6 border-b pb-4" style={{ borderColor: HAIR }}>
                <span className="text-[15px]" style={{ color: INK, fontFamily: BODY }}>{HOURS.days}</span>
                <span className="whitespace-nowrap text-[15px]" style={{ fontFamily: DISPLAY, fontVariationSettings: "'wght' 500", color: ACCENT }}>{HOURS.time}</span>
              </div>
              <p className="mt-5 text-[13.5px] leading-relaxed" style={{ color: MUT, fontFamily: BODY }}>
                {HOURS.note}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── the page ── */
export default function Page() {
  useEffect(() => {
    document.title = META.title
    setThemeColor(GROUND)
    /* the shell's index.html declares lang="en"; this page is Icelandic. */
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', META.description)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => {
      meta?.setAttribute('content', prev)
      ld.remove()
    }
  }, [])

  return (
    <div className="wf-page wf-js min-h-[100dvh] antialiased" style={{ background: GROUND, color: INK, fontFamily: BODY }}>
      <style>{CSS}</style>
      <Nav />
      <main>
        <SectionHero />
        <SectionStory
          kicker="Hverjir eru þetta"
          heading="Óháð, ekki keðja."
          body="Westfjords Adventures er sjálfstætt fyrirtæki á Patreksfirði, ekki hluti af neinni ferðakeðju. Sex ólíkar leiðir liggja út frá sama firðinum, hver sniðin að sínum gesti."
          image={IMG.selur.src}
          imageAlt={IMG.selur.alt}
          stats={[
            { value: '6', label: 'ólíkar leiðir um sama svæðið' },
            { value: '0', label: 'keðjur, fyrirtækið er óháð' },
          ]}
        />
        <SectionTourIndex />
        <SectionImagesCloud />
        <SectionStory
          id="vestfirdir"
          kicker="Staðurinn sjálfur"
          heading="Vestfirðir eru ekki einn staður."
          body="Frá Rauðasandi til Dýrafjarðar, frá Látrabjargi til Arnarfjarðar, fjórðungurinn breytir um svip á hverjum firði. Sex leiðirnar eru til vegna þess að einn ferðamáti dugar ekki til að sjá hann allan."
          image={IMG.dyrafjordur.src}
          imageAlt={IMG.dyrafjordur.alt}
          reverse
          ground={GROUND_DEEP}
        />
        <SectionQuote />
        <SectionImagesMarquee />
        <SectionEclipse />
        <SectionAccommodations />
        <SectionCoverCTA />
        <SectionContact />
      </main>
      <div className="px-5 py-5 text-center text-[11px] tracking-[0.16em]" style={{ fontFamily: BODY, color: MUT, borderTop: `1px solid ${HAIR}` }}>
        FRUMGERÐ · SNDR STUDIO
      </div>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
