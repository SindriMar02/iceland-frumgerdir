import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { motion } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setNoindex, setThemeColor } from '../../lib/preview'
import { demo, type DemoBooking } from './demoStore'
import { bookingReady, godoBookingUrl } from './godo'
import {
  AERIAL_FILM, BATH_NOTE, EXAMPLE_TOURS, FACTS, GLOW, GLOW_FILM, HOST, JSON_LD, MATERIALS, PHOTO, REVIEW_QUOTES, REVIEW_THEMES, TOURS_PORTAL,
  ROOMS, VALLEY, WELCOME_RITUAL, srcSet, type Photo, type RoomEntry,
} from './content'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('villanorth')

/* ── VILLA NORTH · "MÁLSETT" (drawn to measure) ─────────────────────────────
   One page, drawn like an engineer's own drawings: a hairline measure line
   under the wordmark, a roofline traced from the owner's own photograph that
   resolves into the real house, and a room index a family can plan into
   before they book. Full spec: ./DESIGN.md.

   THE FLUID UNIT IS SCOPED, NOT GLOBAL: everything scales off --u on this
   page's root only ([[no-style-bleed-between-designs]]).

   Motion identity (one per site): "drafted". A hairline frame draws around
   each image slot (stroke-dashoffset), the photo fades in inside it, then the
   frame settles to 10% opacity. Every frame then drifts on scroll inside its
   fixed box, a window the photograph moves behind (Heklusýn spec: derived
   --dz, batched reads before writes, ported from mirrorhouse). One dark
   passage (THE GLOW) eases the ground to --vn-night and back to paper.
   ─────────────────────────────────────────────────────────────────────── */

const PAPER = '#F0F1F2'
const INK = '#17181A'
const NIGHT = '#101216'

const DISPLAY = "'Apfel Grotezk', system-ui, sans-serif"
const BODY = "'Onest', system-ui, sans-serif"
const MONO = "'Azeret Mono', ui-monospace, monospace"
/* Glóðin row: three equal cells in a 1440 measure with 48 padding and 24 gaps,
   so each cell tops out around 432px. One crop for all three (the tub photo is
   near-square on its own) so the row reads as a set, stacked or not. */
const GLOW_SIZES = '(min-width: 1440px) 432px, (min-width: 992px) 30vw, 100vw'
const GLOW_RATIO = '3 / 2'
/* Tours sheet: four cells inside a 1440 measure that is already inset by the
   section padding and the sheet's own padding, so a cell is around 300px. */
const TOUR_SIZES = '(min-width: 1200px) 300px, (min-width: 700px) 44vw, 90vw'

const BASE = import.meta.env.BASE_URL

/* A phone, not a narrow window. Guarding on width would strip the damped feel
   from a small desktop window, which is not the thing that breaks. */
const isTouch = () =>
  typeof matchMedia !== 'undefined' &&
  matchMedia('(hover: none) and (pointer: coarse)').matches

/* iOS delivers scroll events async with rendering, so a synchronous scrub
   lands a frame late against a smoothly moving page and visibly steps. A
   small numeric scrub re-times it. Desktop keeps true, where Lenis has
   already smoothed the event flow. */
const SCRUB: number | true = isTouch() ? 0.35 : true

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/** Fluid size with a phone floor: --u pins small on narrow viewports. */
const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/* ── motion engine ───────────────────────────────────────────────────────
   Lenis wheel-only clock drives ScrollTrigger; a single IntersectionObserver
   arms the "drafted" reveal class; THE DRAWING gets its own pinned scrub
   (desktop) or a one-shot time-based timeline (phone); THE GLOW toggles a
   dark-ground class on the section itself when it is in view; and every
   .vn-frame-in wrapper drifts continuously with scroll (Heklusýn spec,
   ported from mirrorhouse), gated off while THE DRAWING's pin is active so
   the two scrubs never fight for main-thread time. ─────────────────────── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const root = document.querySelector<HTMLElement>('.vn-root')
    if (!root) return

    if (reduced()) {
      root.classList.add('vn-static')
      return
    }

    root.classList.add('vn-js')
    ScrollTrigger.config({ ignoreMobileResize: true })
    /* SKIPPED on touch, never tuned. Lenis and iOS momentum fight over the
       same scroll position every frame (the judder), and a JS-scrolled
       document keeps Safari's tall bottom toolbar for the whole visit, so the
       last ~90px of every screen goes dead. Desktop keeps it. */
    const lenis = isTouch() ? null : new Lenis({ duration: 1.1, smoothWheel: true })

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.2 },
    )
    root.querySelectorAll('.vn-rv').forEach((el) => io.observe(el))

    /* drift: Heklusýn spec, batched reads then writes, off-screen skipped.
       Set once THE DRAWING's pinned scrub goes live (below). While it holds,
       the viewport is visually frozen, so every .vn-frame-in box would report
       the same rect on every tick - this loop would just burn main-thread
       time right next to the pinned scrub, for zero visual change. */
    const frames = Array.from(root.querySelectorAll<HTMLElement>('.vn-frame-in'))
    let scrubST: ScrollTrigger | null = null
    const drift = () => {
      if (scrubST?.isActive) return
      const vh = window.innerHeight
      const half = window.innerWidth < 992
      const writes: [HTMLElement, string][] = []
      for (const el of frames) {
        const box = el.parentElement
        if (!box) continue
        const r = box.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const base = Number(el.dataset.drift || 9)
        const d = half ? base * 0.5 : base
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * d).toFixed(2)}%,0)`])
      }
      for (const [el, t] of writes) el.style.transform = t
    }

    const cleanups: Array<() => void> = []

    const ctx = gsap.context(() => {
      /* THE WORDMARK — the site opens on it. Both words rise out of their own
         masks, staggered, and the supporting line follows. Transform and
         opacity only, and the tween is created synchronously so gsap.context
         owns it and reverts it on unmount. */
      const wmWords = root.querySelectorAll<HTMLElement>('.vn-wm-word')
      const wmRule = root.querySelector<HTMLElement>('.vn-wm-rule')
      const measureText = root.querySelector<HTMLElement>('.vn-measure-text')
      if (wmWords.length) {
        gsap.set(wmWords, { yPercent: 120, opacity: 0 })
        if (wmRule) gsap.set(wmRule, { scaleX: 0 })
        if (measureText) gsap.set(measureText, { opacity: 0, y: 8 })
        // The guide line is drawn before the name, left to right, the way the
        // elevation further down is drawn. The words then rise under it.
        const tl = gsap.timeline({ paused: true, delay: 0.25 })
          .to(wmRule, { scaleX: 1, duration: 0.9, ease: 'expo.out' })
          .to(wmWords, {
            yPercent: 0, opacity: 1, duration: 1.35, ease: 'expo.out', stagger: 0.1,
          }, '-=0.55')
          .to(measureText, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.7')

        // The entrance is driven by requestAnimationFrame, and rAF is suspended
        // in a background tab. Playing it there would burn the whole reveal
        // while nobody is looking and, worse, leave the wordmark parked at
        // opacity 0 until the tab is focused. So: play it when the page is
        // actually visible, and keep a setTimeout backstop (setTimeout keeps
        // ticking when rAF does not) that snaps to the resting state if the
        // timeline somehow never ran.
        const play = () => { if (!tl.isActive() && tl.progress() === 0) tl.play() }
        const start = () => { if (document.visibilityState === 'visible') play() }
        // The loader owns the first moment; the name opens only once the sheet
        // has been pulled off, otherwise the reveal plays behind it unseen.
        if (document.querySelector('.vn-loader')) {
          window.addEventListener('vn:revealed', start, { once: true })
        } else {
          start()
        }
        const onVis = () => { if (document.visibilityState === 'visible') play() }
        document.addEventListener('visibilitychange', onVis)
        // 6s, not 4s: the loader itself can hold the first 2.4s of that budget.
        const backstop = window.setTimeout(() => {
          if (tl.progress() === 0) tl.progress(1)
        }, 6000)
        cleanups.push(() => {
          document.removeEventListener('visibilitychange', onVis)
          window.clearTimeout(backstop)
        })

        /* SCROLL AWAY - the drawing is put back in the drawer. Both words
           retract down into the masks they rose from, the guide line runs on
           past them and fades. Entrance drives yPercent and the scrub drives
           y, so the two never contend for one transform component. */
        const heroEl = root.querySelector<HTMLElement>('.vn-hero')
        const wmEl = root.querySelector<HTMLElement>('.vn-wordmark')
        if (heroEl && wmEl) {
          const away = { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 0.6 }
          gsap.to(wmWords, { y: 84, ease: 'none', stagger: 0.04, scrollTrigger: away })
          if (wmRule) gsap.to(wmRule, { scaleX: 2.8, opacity: 0, ease: 'none', scrollTrigger: away })
          gsap.to(wmEl, { opacity: 0.1, ease: 'none', scrollTrigger: away })
        }
      }

      /* HEADLINE BLUR REVEAL, per character, driven by the page's own
         ScrollTrigger rather than a second motion library: running
         framer-motion's whileInView beside GSAP would put two engines on the
         same elements. Timings are the reference's: stagger 0.03/1.5, duration
         0.3/0.5, from blur(12px) + y 10 + opacity 0.

         The blur is DESKTOP ONLY. A per-character filter animation promotes a
         layer per glyph and repaints each one every frame; on a phone that is
         paid for in exactly the momentum this build just spent a pass
         protecting. Touch keeps the rise and the fade, which carries the same
         reveal without the repaint. */
      const BLUR_OK = !isTouch()
      root.querySelectorAll<HTMLElement>('[data-vn-headline]').forEach((h) => {
        const chars = h.querySelectorAll<HTMLElement>('.vn-char')
        if (!chars.length) return
        gsap.fromTo(
          chars,
          { opacity: 0, y: 10, ...(BLUR_OK ? { filter: 'blur(12px)' } : null) },
          {
            opacity: 1, y: 0, ...(BLUR_OK ? { filter: 'blur(0px)' } : null),
            duration: 0.6, ease: 'power2.out', stagger: 0.02,
            /* clears the inline filter so no glyph is left on its own layer */
            clearProps: BLUR_OK ? 'filter' : '',
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          },
        )
      })

      /* THE DRAWING: the roofline traced from grid-sunset.jpg, an SVG
         elevation whose strokes draw in on scrub, hairline hatching fills,
         then a crossfade to the real aerial-sunset photograph. Pinned scrub
         on >=768px; a one-shot time-based timeline (no pin) under 768px. */
      const drawWrap = root.querySelector<HTMLElement>('.vn-drawing-inner')
      const linePath = root.querySelector<SVGPathElement>('.vn-elev-line')
      const secondaryPath = root.querySelector<SVGPathElement>('.vn-elev-secondary')
      const mullionsPath = root.querySelector<SVGPathElement>('.vn-elev-mullions')
      const hatch = root.querySelector<SVGRectElement>('.vn-elev-hatch')
      const svgLayer = root.querySelector<HTMLElement>('.vn-elev-svg')
      const photoLayer = root.querySelector<HTMLElement>('.vn-elev-photo')
      const capSketch = root.querySelector<HTMLElement>('.vn-elev-cap-sketch')
      const capPhoto = root.querySelector<HTMLElement>('.vn-elev-cap-photo')

      const armPath = (p: SVGPathElement | SVGRectElement | null) => {
        if (!p || !('getTotalLength' in p)) return
        const len = (p as SVGPathElement).getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      }
      armPath(linePath)
      armPath(secondaryPath)
      armPath(mullionsPath)
      if (hatch) gsap.set(hatch, { opacity: 0 })
      if (photoLayer) gsap.set(photoLayer, { opacity: 0 })
      if (capPhoto) gsap.set(capPhoto, { opacity: 0 })

      if (drawWrap && linePath && photoLayer && svgLayer) {
        const drivers = [linePath, secondaryPath].filter(Boolean) as SVGPathElement[]
        if (window.innerWidth >= 768) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: drawWrap, start: 'top top', end: '+=220%',
              pin: true, scrub: SCRUB, anticipatePin: 1, invalidateOnRefresh: true,
            },
          })
          scrubST = tl.scrollTrigger ?? null
          tl.to(drivers, { strokeDashoffset: 0, ease: 'none', duration: 0.4 }, 0)
          if (mullionsPath) tl.to(mullionsPath, { strokeDashoffset: 0, ease: 'none', duration: 0.22 }, 0.16)
          if (hatch) tl.to(hatch, { opacity: 0.3, ease: 'none', duration: 0.14 }, 0.38)
          if (capSketch) tl.to(capSketch, { opacity: 0, ease: 'none', duration: 0.08 }, 0.58)
          tl.to(svgLayer, { opacity: 0, ease: 'none', duration: 0.2 }, 0.6)
          tl.to(photoLayer, { opacity: 1, ease: 'none', duration: 0.2 }, 0.6)
          if (capPhoto) tl.to(capPhoto, { opacity: 1, ease: 'none', duration: 0.1 }, 0.68)
        } else {
          const drawIO = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return
              drawIO.disconnect()
              const m = gsap.timeline()
              m.to(drivers, { strokeDashoffset: 0, ease: 'power1.inOut', duration: 1.1 })
              if (mullionsPath) m.to(mullionsPath, { strokeDashoffset: 0, ease: 'power1.inOut', duration: 0.6 }, '-=0.35')
              if (hatch) m.to(hatch, { opacity: 0.3, duration: 0.5 }, '-=0.2')
              if (capSketch) m.to(capSketch, { opacity: 0, duration: 0.3 })
              m.to(svgLayer, { opacity: 0, duration: 0.6 }, '<')
              m.to(photoLayer, { opacity: 1, duration: 0.6 }, '<')
              if (capPhoto) m.to(capPhoto, { opacity: 1, duration: 0.4 }, '-=0.3')
            })
          }, { threshold: 0.35 })
          drawIO.observe(drawWrap)
          cleanups.push(() => drawIO.disconnect())
        }
      }

      /* THE GLOW: one dark passage. Toggle the ground on the section itself
         (never the whole canvas) when it crosses the viewport. */
      const glow = root.querySelector<HTMLElement>('.vn-glow')
      if (glow) {
        const glowIO = new IntersectionObserver(
          (entries) => entries.forEach((e) => {
            glow.classList.toggle('is-dark', e.isIntersecting)
            setThemeColor(e.isIntersecting ? NIGHT : PAPER)
          }),
          { threshold: 0.3 },
        )
        glowIO.observe(glow)
        cleanups.push(() => glowIO.disconnect())
      }
    }, root)

    /* focusin failsafe: a keyboard user tabbing through a scrubbed section
       must land on the resolved state, not mid-transition. */
    const drawSection = root.querySelector<HTMLElement>('.vn-drawing')
    const onFocusIn = () => drawSection?.classList.add('vn-force-resolved')
    const onFocusOut = () => drawSection?.classList.remove('vn-force-resolved')
    drawSection?.addEventListener('focusin', onFocusIn)
    drawSection?.addEventListener('focusout', onFocusOut)
    cleanups.push(() => {
      drawSection?.removeEventListener('focusin', onFocusIn)
      drawSection?.removeEventListener('focusout', onFocusOut)
    })

    /* Without Lenis the browser scrolls natively, so ScrollTrigger listens to
       the real scroll event and the ticker only drives the drift. */
    if (lenis) lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => { drift(); lenis?.raf(t * 1000) }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    drift()

    return () => {
      gsap.ticker.remove(tick)
      io.disconnect()
      cleanups.forEach((fn) => fn())
      ctx.revert()
      lenis?.destroy()
    }
  }, [ready])
}

/* ── primitives ────────────────────────────────────────────────────────── */

/** Split PER WORD, never per character (Icelandic accent risk). */
function Headline({ text, size, floor, as: Tag = 'h2', className = '', measure }: {
  text: string; size: number; floor: number
  as?: 'h1' | 'h2' | 'h3'; className?: string; measure?: number
}) {
  return (
    <Tag
      data-vn-headline
      aria-label={text}
      className={`vn-headline ${className}`}
      style={{
        fontSize: fluid(size, floor),
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      }}
    >
      {/* Split to CHARACTERS for the blur reveal, but each word stays one
          unbreakable inline-block so a line never breaks mid-word. The
          aria-label above carries the real string, so the split is invisible
          to assistive tech. */}
      {text.split(' ').map((w, i, arr) => (
        <span key={i} className="vn-word" aria-hidden="true">
          {Array.from(w).map((c, j) => (
            <span key={j} className="vn-char">{c}</span>
          ))}
          {i < arr.length - 1 ? <span className="vn-char">{'\u00A0'}</span> : null}
        </span>
      ))}
    </Tag>
  )
}

/**
 * The "drafted" motion identity, now TWO always-on layers over one photo:
 * a hairline frame draws around the slot and the image fades in inside it
 * (mask sweep + blur/saturate resolve, both on the <img>), while the
 * Heklusýn drift device (see useMotion's drift()) continuously nudges the
 * SAME image vertically inside its fixed frame as the page scrolls, so the
 * frame reads as a window the photograph moves behind rather than a static
 * picture that merely arrives once. `.vn-frame-in` is the drift device's own
 * wrapper: it owns transform (written every tick), nothing else may
 * transform it. `--dz` derives from `drift` so the oversized wrapper can
 * never run out of overhang at the extremes of travel.
 * Driven off the shared .vn-rv / is-in reveal class, never framer mount
 * state (see [[framer-reveals-unreliable]]).
 */
function Frame({ photo, className = '', priority = false, maxWidth, sizes, drift = 9, ratio }: {
  photo: Photo; className?: string; priority?: boolean; maxWidth?: number; sizes?: string; drift?: number
  /** Crop override for mosaic cells; the photo's own ratio otherwise. */
  ratio?: string
}) {
  return (
    <figure
      className={`vn-frame vn-rv ${className}`}
      /* Custom properties rather than inline aspect-ratio/max-width: an inline
         value beats every stylesheet rule, so a stacked mobile layout could
         never equalise frames that carry a desktop width cap. */
      style={{
        '--vn-ar': ratio ?? photo.ratio,
        ...(maxWidth ? { '--vn-fw': `${maxWidth}px` } : null),
      } as React.CSSProperties}
    >
      <svg className="vn-frame-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0.6" y="0.6" width="98.8" height="98.8" />
      </svg>
      <div
        className="vn-frame-in"
        data-drift={drift}
        style={{ '--dz': `${Math.max(9, drift * 1.35)}%` } as React.CSSProperties}
      >
        <img
          src={photo.src}
          srcSet={srcSet(photo.src)}
          sizes={sizes ?? '(max-width: 899px) 100vw, 50vw'}
          alt={photo.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    </figure>
  )
}

/**
 * One tour, drawn as a plate: the photograph fills the card, a scrim carries
 * the name at its foot, and the button is a hairline pill that inverts under
 * the pointer. The whole plate is the hover target, so the leader rule, the
 * arrow and the pill all answer to it - a button that only reacts when the
 * cursor is exactly on it reads as dead on a card this size.
 *
 * With no portal configured the pill is still DRAWN, because the card has to
 * show what it will do; it just is not an anchor. An inert link would lie
 * about where it goes.
 */
function TourPlate({ tour }: { tour: (typeof EXAMPLE_TOURS)[number] }) {
  const body = (
    <>
      <Frame photo={tour.photo} className="vn-tour-shot" ratio="4 / 5" sizes={TOUR_SIZES} drift={5} />
      <span className="vn-tour-veil" aria-hidden="true" />
      <span className="vn-tour-over">
        <span className="vn-tour-place">{tour.place}</span>
        <span className="vn-tour-name">{tour.name}</span>
        <span className="vn-tour-cta">
          See times
          <span aria-hidden="true">→</span>
        </span>
      </span>
    </>
  )
  /* tabIndex on the non-link case so the plate is still reachable by keyboard:
     the focus-within rule is what gives a keyboard user the same reveal a
     pointer user gets from hover. */
  return TOURS_PORTAL ? (
    <a className="vn-tour-plate" href={TOURS_PORTAL} target="_blank" rel="noreferrer">{body}</a>
  ) : (
    <article className="vn-tour-plate" tabIndex={0}>{body}</article>
  )
}

/**
 * Materials hover-expand: concrete / cladding / walkway share one row at
 * equal thirds and one fixed height; the hovered or focused tile grows to
 * roughly its resting width's high side while the other two give up the
 * difference (flex-grow, not width, so the ratios hold at any container
 * size). Ported from a 21st.dev reference (larsen66/expand-on-hover) - kept
 * its one-activeIndex logic and shared-row displacement, replaced its skin,
 * tuned the amount down from a filmstrip to "expand a bit", and made every
 * tile a real <button> so hover, focus and tap all work (see .vn-mat-* CSS).
 * No Heklusýn drift runs inside these tiles: the width change IS the motion
 * here, and a per-frame-drifting child would fight the flex-grow tween.
 */
const MATERIAL_PANELS = [
  { photo: PHOTO.concreteDetail, label: 'Board-formed concrete' },
  { photo: PHOTO.claddingDetail, label: 'Dark timber cladding' },
  { photo: PHOTO.walkway, label: 'The walkway' },
] as const

function MaterialsExpand() {
  const [active, setActive] = useState<number | null>(null)
  const still = reduced()

  return (
    <div className="vn-mat-expand" role="group" aria-label="Materials">
      {MATERIAL_PANELS.map((m, i) => (
        <motion.button
          key={m.label}
          type="button"
          className="vn-mat-panel"
          aria-expanded={active === i}
          aria-current={active === i ? 'true' : undefined}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onClick={() => setActive(i)}
          animate={{ flexGrow: active === i ? 2.2 : 1 }}
          transition={{ duration: still ? 0 : 0.5, ease: [0.25, 1, 0.5, 1] }}
        >
          <img
            src={m.photo.src}
            srcSet={srcSet(m.photo.src)}
            sizes="(max-width: 767px) 100vw, 33vw"
            alt={m.photo.alt}
            loading="lazy"
            decoding="async"
          />
          <span className={`vn-mat-scrim ${active === i ? 'is-active' : ''}`} aria-hidden="true" />
          <span className={`vn-mat-label ${active === i ? 'is-active' : ''}`}>{m.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

/* ── booking form ──────────────────────────────────────────────────────── */

/* ── preloader ──────────────────────────────────────────────────────────────
   Counts REAL loading (hero decode + fonts.ready), never a fake timer. 1.1s
   floor so a warm cache does not flash it for one tick, 2.4s cap. Once per
   session; ?loader forces it for review; never mounts under reduced motion.
   The sheet is wiped away left to right, the way a drafting sheet is pulled
   off a board, rather than lifted like the other builds. */
const shouldShowLoader = () => {
  if (typeof window === 'undefined' || reduced()) return false
  if (new URLSearchParams(window.location.search).has('loader')) return true
  try { return !sessionStorage.getItem('vn_seen') } catch { return true }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('vn_seen', '1') } catch { /* private mode */ }
    const t0 = performance.now()
    let raf = 0
    let shown = 0
    let heroDone = false
    const hero = new Image()
    hero.decoding = 'async'
    const mark = () => { heroDone = true }
    hero.addEventListener('load', mark, { once: true })
    hero.addEventListener('error', mark, { once: true })
    hero.src = PHOTO.aerialSunset.src
    if (hero.complete) heroDone = true
    let fontsDone = false
    document.fonts.ready.then(() => { fontsDone = true })

    const FLOOR = 1100, CAP = 2400
    const tick = () => {
      const t = performance.now() - t0
      let target = (heroDone ? 55 : Math.min(50, t / 24)) + (fontsDone ? 45 : 0)
      if (t >= CAP) target = 100
      shown += (target - shown) * 0.12
      const display = Math.min(100, Math.round(shown))
      setPct(display)
      if (display >= 100 && t >= FLOOR) {
        setLeaving(true)
        window.setTimeout(onDone, 950)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div className={`vn-loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <p className="vn-loader-mark" style={{ backgroundPositionX: `${100 - pct}%` }}>
        VILLA NORTH
      </p>
      <p className="vn-loader-pct">{pct}%</p>
    </div>
  )
}

const NIGHT_MS = 86400000
const plusDays = (d: string, n: number) => {
  const t = new Date(`${d}T12:00:00`)
  return new Date(t.getTime() + n * NIGHT_MS).toISOString().slice(0, 10)
}

/* ── the stay calendar ──────────────────────────────────────────────────────
   Replaces a native date input and a "nights" dropdown, neither of which
   belongs on a page whose whole argument is that this house was drawn before
   it was built. The chosen nights read as a MEASURED SPAN: ticked at both
   ends, with the night count sitting in a break in the hairline exactly the
   way the figure sits in the dimension line on the elevation above.

   Dates are 'YYYY-MM-DD' strings throughout and every Date object is anchored
   at T12:00:00, so no timezone can shift a day. */

const pad2 = (n: number) => String(n).padStart(2, '0')
const isoOf = (y: number, m: number, d: number) => `${y}-${pad2(m + 1)}-${pad2(d)}`
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
/* Monday-first: JS Sunday is 0, and Sunday ends the week here. */
const firstCol = (y: number, m: number) => (new Date(y, m, 1).getDay() + 6) % 7
const nightsBetween = (a: string, b: string) =>
  Math.round((new Date(`${b}T12:00:00`).getTime() - new Date(`${a}T12:00:00`).getTime()) / NIGHT_MS)
/* Fixed three-letter tables rather than toLocaleDateString: en-GB emits
   "Sept" for one month out of twelve, which breaks the tabular alignment the
   dimension line depends on. */
const MON3 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const prettyDate = (d: string) => {
  const t = new Date(`${d}T12:00:00`)
  return `${DAY3[t.getDay()]} ${t.getDate()} ${MON3[t.getMonth()]}`
}
const monthLabel = (y: number, m: number) =>
  new Date(y, m, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export type Stay = { from: string | null; to: string | null }

function StayCalendar({ stay, onChange, minDate }: {
  stay: Stay
  onChange: (s: Stay) => void
  minDate: string
}) {
  const startMonth = useMemo(() => {
    const d = new Date(`${minDate}T12:00:00`)
    return { y: d.getFullYear(), m: d.getMonth() }
  }, [minDate])
  const [cursor, setCursor] = useState(startMonth)
  const [hover, setHover] = useState<string | null>(null)
  const [focused, setFocused] = useState<string>(stay.from || minDate)
  const keyNav = useRef(false)

  /* The provisional end while the guest is still choosing: the real departure
     if it exists, otherwise whatever they are hovering, so the span is drawn
     before it is committed. */
  const end = stay.to ?? (stay.from && hover && hover > stay.from ? hover : null)

  const shift = (n: number) => setCursor((c) => {
    const d = new Date(c.y, c.m + n, 1)
    const next = { y: d.getFullYear(), m: d.getMonth() }
    if (next.y * 12 + next.m < startMonth.y * 12 + startMonth.m) return c
    return next
  })
  const atStart = cursor.y * 12 + cursor.m <= startMonth.y * 12 + startMonth.m

  const pick = (d: string) => {
    /* Second click only closes the range when it lands after the arrival.
       Anything else starts a new one from there, which is what a guest
       correcting themselves actually means. */
    if (!stay.from || stay.to || d <= stay.from) onChange({ from: d, to: null })
    else onChange({ from: stay.from, to: d })
  }

  /* Roving focus: arrows walk the grid, and the view follows if the walk
     leaves the two visible months. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step: Record<string, number> = {
      ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, PageUp: -28, PageDown: 28,
    }
    const n = step[e.key]
    if (n === undefined) return
    e.preventDefault()
    /* Walk from the day that actually has focus, not from state: the two are
       the same for a real keypress, but reading the DOM cannot go stale. */
    const origin = (e.target as HTMLElement).dataset?.vnDay || focused
    const next = plusDays(origin, n)
    if (next < minDate) return
    keyNav.current = true
    setFocused(next)
    const [ny, nm] = [Number(next.slice(0, 4)), Number(next.slice(5, 7)) - 1]
    const idx = ny * 12 + nm
    const left = cursor.y * 12 + cursor.m
    if (idx < left) setCursor({ y: ny, m: nm })
    else if (idx > left + 1) {
      const back = new Date(ny, nm - 1, 1)
      setCursor({ y: back.getFullYear(), m: back.getMonth() })
    }
  }

  useEffect(() => {
    if (!keyNav.current) return
    keyNav.current = false
    const el = document.querySelector<HTMLButtonElement>(`[data-vn-day="${focused}"]`)
    el?.focus()
  }, [focused])

  const renderMonth = (offset: number) => {
    const d = new Date(cursor.y, cursor.m + offset, 1)
    const y = d.getFullYear()
    const m = d.getMonth()
    const cells: (string | null)[] = Array.from({ length: firstCol(y, m) }, () => null)
    for (let i = 1; i <= daysInMonth(y, m); i++) cells.push(isoOf(y, m, i))
    while (cells.length % 7) cells.push(null)

    return (
      <div className="vn-cal-month" key={`${y}-${m}`}>
        <p className="vn-cal-title">{monthLabel(y, m)}</p>
        <div className="vn-cal-dows" aria-hidden="true">
          {DOW.map((w, i) => <span className="vn-cal-dow" key={i}>{w}</span>)}
        </div>
        <div className="vn-cal-grid" role="grid" onKeyDown={onKeyDown}>
          {cells.map((day, i) => {
            if (!day) return <span className="vn-cal-cell is-blank" key={`b${i}`} />
            const past = day < minDate
            const isFrom = day === stay.from
            const isTo = !!end && day === end
            const inside = !!stay.from && !!end && day > stay.from && day < end
            const cls = [
              'vn-cal-cell',
              isFrom ? 'is-from' : '',
              isTo ? 'is-to' : '',
              inside ? 'is-in' : '',
            ].filter(Boolean).join(' ')
            return (
              <span className={cls} key={day}>
                <button
                  type="button"
                  data-vn-day={day}
                  className={`vn-cal-day ${isFrom || isTo ? 'is-end' : ''}`}
                  disabled={past}
                  tabIndex={day === focused ? 0 : -1}
                  aria-label={prettyDate(day)}
                  aria-pressed={isFrom || isTo}
                  onFocus={() => setFocused(day)}
                  onMouseEnter={() => setHover(day)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => pick(day)}
                >
                  {Number(day.slice(8))}
                </button>
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  const nights = stay.from && end ? nightsBetween(stay.from, end) : 0

  return (
    <div className="vn-cal">
      <div className="vn-cal-head">
        <span className="vn-field-label">Your dates</span>
        <span className="vn-cal-nav">
          <button type="button" onClick={() => shift(-1)} disabled={atStart} aria-label="Previous month">&#8592;</button>
          <button type="button" onClick={() => shift(1)} aria-label="Next month">&#8594;</button>
        </span>
      </div>

      <div className="vn-cal-months">{renderMonth(0)}{renderMonth(1)}</div>

      {/* the dimension line: ticked at both ends, the figure breaking the rule */}
      <div className="vn-cal-dim" aria-live="polite">
        {stay.from && end ? (
          <>
            <span className="vn-cal-dim-end">
              <em>Arrival</em>{prettyDate(stay.from)}
            </span>
            <span className="vn-cal-dim-rule is-left" />
            <span className="vn-cal-dim-figure">{nights} {nights === 1 ? 'night' : 'nights'}</span>
            <span className="vn-cal-dim-rule is-right" />
            <span className="vn-cal-dim-end is-right">
              <em>Departure</em>{prettyDate(end)}
            </span>
          </>
        ) : (
          <p className="vn-cal-dim-empty">
            {stay.from ? 'Now choose the day you leave.' : 'Choose the day you arrive.'}
          </p>
        )}
      </div>
    </div>
  )
}

/* ── the hero's tour window ─────────────────────────────────────────────────
   A window onto the tours, not a text ticker: every tour photograph is
   mounted at once and stacked, and the flip is a slow crossfade between them
   with the outgoing frame easing back a hair, so it reads as one image
   dissolving into the next rather than a slide swapping out. All three load
   eagerly - a crossfade to an image that has not arrived is a flash of empty
   frame. Advance pauses under reduced motion (the first tour simply stands). */
function ToursTicker({ onOpen }: { onOpen: (e: React.MouseEvent) => void }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (reduced()) return
    const t = window.setInterval(() => setIdx((i) => (i + 1) % EXAMPLE_TOURS.length), 4600)
    return () => window.clearInterval(t)
  }, [])
  const tour = EXAMPLE_TOURS[idx]
  return (
    <a className="vn-hero-tours" href="#tours" onClick={onOpen} aria-label="See example tours">
      <span className="vn-ht-stack">
        {EXAMPLE_TOURS.map((t, i) => (
          <img
            key={t.name}
            className={`vn-ht-img ${i === idx ? 'is-on' : ''}`}
            src={t.photo.src}
            srcSet={srcSet(t.photo.src)}
            sizes="260px"
            alt=""
            loading="eager"
            decoding="async"
          />
        ))}
        <span className="vn-ht-veil" />
        <span className="vn-ht-ticks" aria-hidden="true">
          {EXAMPLE_TOURS.map((t, i) => (
            <span key={t.name} className={`vn-ht-tick ${i === idx ? 'is-on' : ''}`} />
          ))}
        </span>
        <span className="vn-ht-stamp">Tours · examples</span>
        {/* Keyed on the name so the overline and title re-mount together and
            replay their own, much shorter fade under the photograph's longer
            crossfade. Same two-line anatomy as the plates below. */}
        <span className="vn-ht-body" key={tour.name}>
          <span className="vn-ht-place">{tour.place}</span>
          <span className="vn-ht-name">{tour.name}</span>
        </span>
        <span className="vn-ht-cta">
          See tours
          <span aria-hidden="true">→</span>
        </span>
      </span>
    </a>
  )
}

function BookingForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [stay, setStay] = useState<Stay>({ from: null, to: null })
  const [people, setPeople] = useState(7)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<DemoBooking | null>(null)

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const nights = stay.from && stay.to ? nightsBetween(stay.from, stay.to) : 0

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!stay.from || !stay.to) {
      setError('Choose the day you arrive and the day you leave.')
      return
    }
    if (!name.trim() || !email.trim()) {
      setError('A name and an email are needed so the owner can reply.')
      return
    }
    setError(null)
    const b: DemoBooking = {
      id: `vn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: 'villanorth',
      date: stay.from,
      endDate: stay.to,
      people,
      customer: { name: name.trim(), phone: phone.trim(), email: email.trim() },
      note: note.trim() || undefined,
      quote: { lines: [], total: 0, deposit: 0, units: nights, estimate: true },
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
    }
    demo.add(b)
    setDone(b)
  }

  if (done) {
    /* endDate is optional on the shared Booking shape; a stay submitted here
       always has one, but the type has to be satisfied rather than asserted. */
    const leaves = done.endDate ?? done.date
    return (
      <div className="vn-book-done" role="status">
        <p className="vn-book-done-title">Your request is on its way.</p>
        <p className="vn-book-done-body">
          {prettyDate(done.date)} to {prettyDate(leaves)}, {done.quote.units}{' '}
          {done.quote.units === 1 ? 'night' : 'nights'}, {done.people}{' '}
          {done.people === 1 ? 'guest' : 'guests'}.
          The owner confirms each request personally. The price for your dates comes with the reply
          to {done.customer.email}.
        </p>
        <p className="vn-book-note">
          This is a prototype. The request lives only in this browser.{' '}
          <Link className="vn-a" to="/preview/villanorth/stjornbord">See the owner's side</Link>{' '}
          to watch it arrive.
        </p>
        <button type="button" className="vn-ghost" onClick={() => setDone(null)}>
          Make another request
        </button>
      </div>
    )
  }

  return (
    <form className="vn-book-form" onSubmit={submit} noValidate>
      <div className="vn-book-grid">
        <StayCalendar stay={stay} onChange={setStay} minDate={minDate} />
        <label className="vn-field vn-field-guests">
          <span className="vn-field-label">Guests</span>
          <select name="guests" value={people} onChange={(e) => setPeople(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="vn-field vn-field-wide">
          <span className="vn-field-label">Name</span>
          <input type="text" name="name" autoComplete="name" value={name} required
            onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="vn-field vn-field-wide">
          <span className="vn-field-label">Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" value={email} required
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="vn-field vn-field-wide">
          <span className="vn-field-label">Phone <span className="vn-optional">(optional)</span></span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="vn-field vn-field-wide">
          <span className="vn-field-label">Anything you would like the owner to know <span className="vn-optional">(optional)</span></span>
          <textarea rows={3} name="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      {error && <p className="vn-field-error" role="alert">{error}</p>}
      {bookingReady() ? (
        /* The GODO handoff: the same dates the guest just picked, carried
           straight onto the secure booking page. Live the moment the propid
           lands in godo.ts. */
        <a
          className="vn-cta vn-cta-block"
          href={godoBookingUrl({ checkin: stay.from, checkout: stay.to, adults: people })}
        >
          Continue to secure booking
        </a>
      ) : (
        <button type="submit" className="vn-cta vn-cta-block">Enquire about your stay</button>
      )}
      <p className="vn-book-note">
        {bookingReady()
          ? 'Your dates carry over. Availability, the exact price and payment are all handled on the secure booking page.'
          : 'No payment today. Send your preferred dates and the owner replies with availability and the nightly price. Payment is settled on arrival.'}
      </p>
    </form>
  )
}

/* ── the page ──────────────────────────────────────────────────────────── */

export default function VillaNorthPage() {
  const [ready, setReady] = useState(false)
  const [activeRoom, setActiveRoom] = useState<string>(ROOMS[0].id)
  const [glowErrored, setGlowErrored] = useState(false)
  const [aerialErrored, setAerialErrored] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const roomBtnRefs = useRef<Array<HTMLButtonElement | null>>([])
  const glowVideoRef = useRef<HTMLVideoElement>(null)
  const aerialVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setThemeColor(PAPER)
    document.title = 'Villa North'
    setReady(true)
  }, [])
  useEffect(() => setNoindex(true), [])

  useMotion(ready)

  /* Both films: a defensive nudge for browsers that refuse the autoplay.
     Two causes, both real: Safari sometimes needs an explicit play() even
     with the attribute set, and React applies `muted` as a PROPERTY after
     the element is inserted, so Chrome can evaluate autoplay eligibility
     against an unmuted video and block it — by then the poster is already
     dismissed and the element paints black (seen live on the aerial film,
     2026-08-29). Force the property first, then play. Never runs under
     reduced motion — the poster stands in. */
  useEffect(() => {
    if (reduced()) return
    const cleanups: Array<() => void> = []
    for (const ref of [glowVideoRef, aerialVideoRef]) {
      const v = ref.current
      if (!v) continue
      v.muted = true
      const tryPlay = () => { v.muted = true; v.play()?.catch(() => {}) }
      v.addEventListener('canplay', tryPlay)
      v.addEventListener('loadeddata', tryPlay)
      tryPlay()
      cleanups.push(() => {
        v.removeEventListener('canplay', tryPlay)
        v.removeEventListener('loadeddata', tryPlay)
      })
    }
    return () => cleanups.forEach((fn) => fn())
  }, [])

  const [loading, setLoading] = useState(shouldShowLoader)
  const [menuOpen, setMenuOpen] = useState(false)

  const activeRoomData: RoomEntry = ROOMS.find((r) => r.id === activeRoom) ?? ROOMS[0]

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const go = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
      history.replaceState(null, '', `#${id}`)
    }
    if (!menuOpen) { go(); return }
    /* The sheet locks body overflow while it is open, and that lock is only
       released by the menu effect's cleanup, which runs AFTER this render
       commits. Scrolling in the same tick therefore scrolls a locked
       document and silently does nothing: on the phone the sheet closed and
       the page stayed exactly where it was. Close first, scroll once the
       lock is actually gone. */
    setMenuOpen(false)
    requestAnimationFrame(() => requestAnimationFrame(go))
  }

  /* Escape closes, and the page underneath is locked while the sheet is open
     so a scroll gesture on the overlay cannot carry the page with it. */
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const onRoomKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return
    e.preventDefault()
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
    const next = (idx + dir + ROOMS.length) % ROOMS.length
    roomBtnRefs.current[next]?.focus()
  }

  return (
    <div ref={rootRef} className="vn-root">
      <style>{CSS}</style>
      {loading && (
        <Preloader onDone={() => {
          setLoading(false)
          window.dispatchEvent(new Event('vn:revealed'))
        }} />
      )}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />

      <header className="vn-nav">
        <a className="vn-nav-mark" href="#top" onClick={anchor('top')}>
          <span className="vn-logo-mark" aria-hidden="true" />
          VILLA&nbsp;NORTH
        </a>
        <nav className="vn-nav-links" aria-label="Page">
          <a href="#drawing" onClick={anchor('drawing')}>The house</a>
          <a href="#rooms" onClick={anchor('rooms')}>Rooms</a>
          <a href="#gallery" onClick={anchor('gallery')}>Gallery</a>
          <a href="#tours" onClick={anchor('tours')}>Tours</a>
          <a href="#guests" onClick={anchor('guests')}>Guests</a>
        </nav>
        <a className="vn-nav-cta" href="#booking" onClick={anchor('booking')}>Book now</a>

        {/* Phone only. Two rules from the fleet: a tap fires pointer events AND
            click, so this is bound to onClick alone and never to hover; and the
            bars are drawn with currentColor so the whole control keeps the
            header's difference blend rather than sitting on a plate. */}
        <button
          type="button"
          className={`vn-burger ${menuOpen ? 'is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="vn-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </header>

      {/* The sheet. Ink ground rather than a blur: a translucent blurred layer
          over a scrolling page is a guaranteed dropped frame on iOS. */}
      <div
        id="vn-menu"
        className={`vn-menu ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="vn-menu-links" aria-label="Sections">
          <a href="#drawing" onClick={anchor('drawing')}>The house</a>
          <a href="#rooms" onClick={anchor('rooms')}>Rooms</a>
          <a href="#gallery" onClick={anchor('gallery')}>Gallery</a>
          <a href="#tours" onClick={anchor('tours')}>Tours</a>
          <a href="#guests" onClick={anchor('guests')}>Guests</a>
          <a href="#contact" onClick={anchor('contact')}>Finding the house</a>
        </nav>
        <a className="vn-menu-cta" href="#booking" onClick={anchor('booking')}>Book now</a>
        <p className="vn-menu-foot">
          <a href="tel:+3548449808">+354 844 9808</a>
          <a href="mailto:villanorthiceland@gmail.com">villanorthiceland@gmail.com</a>
        </p>
      </div>

      {/* 01 · hero */}
      <section className="vn-hero" id="top">
        <div className="vn-hero-media vn-rv">
          <img src={PHOTO.aerialSunset.src} srcSet={srcSet(PHOTO.aerialSunset.src)} sizes="100vw"
            alt={PHOTO.aerialSunset.alt} loading="eager" decoding="async" />
        </div>
        <h1 className="vn-wordmark" aria-label="Villa North">
          <span className="vn-wm-rule" aria-hidden="true" />
          <span className="vn-wm-row" aria-hidden="true">
            <span className="vn-wm-line"><span className="vn-wm-word">VILLA</span></span>
            {' '}
            <span className="vn-wm-line"><span className="vn-wm-word">NORTH</span></span>
          </span>
        </h1>
        <div className="vn-hero-block">
          <p className="vn-measure-text">Sleeps 7 · four bedrooms</p>
          <p className="vn-hero-sub">
            Designed with precision, built for gathering. An engineer's house of glass
            and dark timber above Fnjóskadalur, made for seven.
          </p>
          <a className="vn-cta" href="#booking" onClick={anchor('booking')}>Book now</a>
        </div>
        <ToursTicker onOpen={anchor('tours')} />
      </section>

      {/* 02 · the drawing */}
      <section className="vn-drawing" id="drawing">
        <div className="vn-drawing-copy">
          <Headline text="Every angle, decided first." size={64} floor={32} measure={600} />
          <p className="vn-body vn-rv">
            The owner trained as an engineer, and every line feels intentional: an
            asymmetric roofline, long glass on one side and dark timber cladding on
            the other, cut into a hillside above Fnjóskadalur.
          </p>
        </div>
        <div className="vn-drawing-inner">
          {/* The elevation is measured directly from glass-grid.jpg's own pixels
              (1200x802: apex, both eaves, the central post, both corner posts,
              the transom and three window mullions, the ground line - each
              read from real luminance edges in that exact photograph, not
              hand-drawn). viewBox + preserveAspectRatio="xMidYMid slice" on
              the SAME 1200x802 box the <img> below covers with object-fit:
              cover is the SVG equivalent of cover, so the trace and the photo
              crop identically at every viewport width and the lines dissolve
              into their own photographed edges when this crossfades. */}
          <div className="vn-elev-svg">
            <svg className="vn-elev" viewBox="0 0 1200 802" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <pattern id="vnHatch" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="9" stroke={INK} strokeWidth="1" />
                </pattern>
                <clipPath id="vnGableClip">
                  <path d="M572,272 L290,384 L289,660 L607,663 L607,204 Z" />
                </clipPath>
              </defs>
              <rect className="vn-elev-hatch" x="289" y="204" width="318" height="459" fill="url(#vnHatch)" clipPath="url(#vnGableClip)" />
              <path className="vn-elev-secondary" d="M572,272 L290,384 L289,660 L607,663" />
              <path className="vn-elev-mullions" d="M604,459 L983,459 M702,271 L714,660 M877,350 L885,660 M976,390 L989,660" />
              <path className="vn-elev-line" d="M570,151 L1030,368 L1033,525 M607,204 L607,663 L983,660" />
            </svg>
          </div>
          <div className="vn-elev-photo">
            <img src={PHOTO.glassGrid.src} srcSet={srcSet(PHOTO.glassGrid.src)} sizes="100vw"
              alt={PHOTO.glassGrid.alt} loading="lazy" decoding="async" />
          </div>
          <div className="vn-elev-caps">
            <p className="vn-elev-cap vn-elev-cap-sketch">The elevation, traced from the photograph line for line.</p>
            <p className="vn-elev-cap vn-elev-cap-photo">Villa North, Fnjóskadalur valley.</p>
          </div>
        </div>
        <p className="vn-elev-credit vn-rv">
          Traced to the pixel from this exact photograph, the owner's own: the roofline, both
          posts, the window grid and the ground it stands on.
        </p>
        <div className="vn-drawing-inside">
          <div className="vn-drawing-inside-copy">
            <p className="vn-drawing-inside-kicker">Sama þakið, að innan</p>
            <p className="vn-drawing-inside-line">
              The angle drawn above is the same angle overhead in here. The roofline
              traced outside is the ceiling line inside.
            </p>
          </div>
          <Frame photo={PHOTO.livingTall} className="vn-drawing-inside-fig" drift={7} />
        </div>
      </section>

      {/* 03 · the valley */}
      <section className="vn-valley" id="valley">
        <div className="vn-valley-copy">
          <Headline text="The valley below." size={56} floor={30} measure={520} />
          <p className="vn-body vn-rv">{VALLEY.intro}</p>
          <dl className="vn-draws vn-rv">
            {VALLEY.draws.map((d) => (
              <div key={d.name}><dt>{d.name}</dt><dd>{d.note}</dd></div>
            ))}
          </dl>
        </div>
        <div className="vn-valley-figs">
          <Frame photo={PHOTO.aerialRiver} className="vn-valley-main" drift={11} />
          <div className="vn-valley-duo">
            <Frame photo={PHOTO.aerialMist} className="vn-valley-duo-a" drift={8} />
            <Frame photo={PHOTO.aerialSunsetB} className="vn-valley-duo-b" drift={8} />
          </div>
        </div>
      </section>

      {/* 04 · from the air — their own drone film, shown full bleed. A muted
          loop with the poster as permanent fallback (glow-film pattern: the
          film must never be the section's single point of failure). */}
      <section className="vn-film" id="film" aria-label="Aerial film of the house">
        <div className="vn-film-bleed">
          <img
            src={AERIAL_FILM.poster}
            srcSet={`${AERIAL_FILM.posterSmall} 800w, ${AERIAL_FILM.poster} 1120w`}
            sizes="100vw"
            alt={PHOTO.aerialSunset.alt}
            loading="lazy"
            decoding="async"
            className="vn-film-poster"
          />
          <video
            ref={aerialVideoRef}
            className={`vn-film-video ${aerialErrored ? 'is-errored' : ''}`}
            poster={AERIAL_FILM.poster}
            autoPlay={!reduced()}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onError={() => setAerialErrored(true)}
          >
            <source src={AERIAL_FILM.src} type="video/mp4" />
          </video>
          <div className="vn-film-caps">
            <p className="vn-film-label">Úr lofti</p>
          </div>
        </div>
      </section>

      {/* 05 · rooms to measure */}
      <section className="vn-rooms" id="rooms">
        <Headline text="Plan who sleeps where." size={64} floor={32} measure={620} />
        <p className="vn-body vn-rv">
          A simple guide to how the villa flows: four bedrooms, the sitting room, the
          kitchen and the sundeck. Einföld skýringarmynd, ekki í mælikvarða: a
          schematic, not to scale.
        </p>
        <Frame photo={PHOTO.mezzanine} className="vn-rooms-lead" drift={11} />

        <div className="vn-rooms-explorer">
          <div className="vn-rooms-index" role="group" aria-label="Herbergi">
            {ROOMS.map((r, i) => (
              <div key={r.id} className="vn-rooms-index-item">
                {(i === 0 || ROOMS[i - 1].level !== r.level) && (
                  <p className="vn-rooms-zone-label">
                    {r.level === 'efri' ? 'Efri hæð (upstairs)' : 'Neðri hæð (main level)'}
                  </p>
                )}
                <button
                  type="button"
                  ref={(el) => { roomBtnRefs.current[i] = el }}
                  className={`vn-room-btn ${activeRoom === r.id ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveRoom(r.id)}
                  onFocus={() => setActiveRoom(r.id)}
                  onClick={() => setActiveRoom(r.id)}
                  onKeyDown={(e) => onRoomKeyDown(e, i)}
                  aria-pressed={activeRoom === r.id}
                >
                  <span className="vn-room-btn-label">{r.label}</span>
                  <span className="vn-room-btn-fact">{r.fact}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="vn-rooms-pane" aria-live="polite">
            <Frame photo={activeRoomData.photo} className="vn-rooms-pane-frame" sizes="(max-width: 899px) 100vw, 46vw" drift={8} />
            <p className="vn-rooms-pane-label">{activeRoomData.label}</p>
            <p className="vn-rooms-pane-fact">
              {activeRoomData.fact}
              {activeRoomData.note ? ` · ${activeRoomData.note}` : ''}
            </p>
            {activeRoomData.photoNote && (
              <p className="vn-rooms-pane-note">{activeRoomData.photoNote}</p>
            )}
          </div>

          <div className="vn-rooms-acc">
            {ROOMS.map((r) => (
              <div className="vn-rooms-acc-item" key={r.id}>
                <button
                  type="button"
                  className={`vn-rooms-acc-btn ${activeRoom === r.id ? 'is-open' : ''}`}
                  onClick={() => setActiveRoom(r.id)}
                  aria-expanded={activeRoom === r.id}
                >
                  <span>{r.label}</span>
                  <span className="vn-rooms-acc-fact">{r.fact}</span>
                </button>
                <div className={`vn-rooms-acc-panel ${activeRoom === r.id ? 'is-open' : ''}`}>
                  <div className="vn-rooms-acc-panel-in">
                    <Frame photo={r.photo} />
                    {r.note && <p className="vn-rooms-acc-note">{r.note}</p>}
                    {r.photoNote && <p className="vn-rooms-acc-note">{r.photoNote}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="vn-rooms-bath vn-rv">
          <Frame photo={BATH_NOTE.photo} className="vn-rooms-bath-frame" drift={6} />
          <div>
            <p className="vn-rooms-bath-fact">{BATH_NOTE.fact}</p>
            <p className="vn-rooms-bath-detail">ATH: {BATH_NOTE.detail}</p>
          </div>
        </div>
      </section>

      {/* 05 · materials */}
      <section className="vn-materials" id="materials">
        <Headline text="Furnished like the real thing." size={56} floor={30} measure={560} />
        <p className="vn-body vn-rv">{MATERIALS.intro}</p>
        <ul className="vn-materials-names vn-rv">
          {MATERIALS.names.map((n) => <li key={n}>{n}</li>)}
        </ul>
        <MaterialsExpand />
        <blockquote className="vn-quote-block vn-rv">
          <p>{'“'}{MATERIALS.quote.quote}{'”'}</p>
          <cite>{MATERIALS.quote.author}, {MATERIALS.quote.when}</cite>
        </blockquote>
      </section>

      {/* 06 · the glow */}
      <section className="vn-glow" id="glow">
        <div className="vn-glow-bleed">
          {/* The still is a real <img>, not just the <video poster="">: if the
              film errors or never loads, this is the permanent fallback and
              the section still looks complete. It is also what paints first
              (the film must never be the LCP blocker), and it is pixel-for-
              pixel the film's own first frame, so there is no handover flash. */}
          <img
            src={GLOW_FILM.poster}
            srcSet={`${GLOW_FILM.posterSmall} 800w, ${GLOW_FILM.poster} 1280w`}
            sizes="100vw"
            alt={PHOTO.winterNight.alt}
            loading="lazy"
            decoding="async"
            className="vn-glow-poster"
          />
          <video
            ref={glowVideoRef}
            className={`vn-glow-video ${glowErrored ? 'is-errored' : ''}`}
            poster={GLOW_FILM.poster}
            autoPlay={!reduced()}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onError={() => setGlowErrored(true)}
          >
            <source src={GLOW_FILM.src} type="video/mp4" />
          </video>
          <div className="vn-glow-caps">
            <p className="vn-glow-label">Glóðin</p>
            <p className="vn-glow-cap">{GLOW.intro}</p>
          </div>
        </div>
        {/* Three equal cells. No per-frame width cap and no per-photo ratio:
            the row is one measure, so the frames read as a set rather than
            three loose sizes (worst stacked on a phone). .vn-glow-row owns
            both the width and the crop. */}
        <div className="vn-glow-row">
          <Frame photo={PHOTO.wineGlasses} className="vn-glow-wine" ratio={GLOW_RATIO} sizes={GLOW_SIZES} drift={9} />
          <div className="vn-glow-tub-col">
            <Frame photo={PHOTO.tubNightSmall} className="vn-glow-tub" ratio={GLOW_RATIO} sizes={GLOW_SIZES} drift={6} />
            <p className="vn-glow-fact">{GLOW.auroraFact}</p>
          </div>
          <Frame photo={PHOTO.winterRiver} className="vn-glow-river" ratio={GLOW_RATIO} sizes={GLOW_SIZES} drift={7} />
        </div>
        <blockquote className="vn-quote-block vn-glow-quote vn-rv">
          <p>{'“'}{GLOW.quote.quote}{'”'}</p>
          <cite>{GLOW.quote.author}, {GLOW.quote.when}</cite>
        </blockquote>
      </section>

      {/* 07 · welcome ritual */}
      <section className="vn-welcome" id="welcome">
        <div className="vn-welcome-copy">
          <Headline text="Ready before you arrive." size={56} floor={30} measure={520} />
          <p className="vn-body vn-rv">{WELCOME_RITUAL.intro}</p>
          <ul className="vn-ritual-list vn-rv">
            {WELCOME_RITUAL.items.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </div>
        <div className="vn-welcome-figs">
          <Frame photo={PHOTO.kitchenPendants} className="vn-welcome-main" />
          <div className="vn-welcome-duo">
            <Frame photo={PHOTO.dining} className="vn-welcome-duo-a" />
            <Frame photo={PHOTO.livingSofa} className="vn-welcome-duo-b" />
          </div>
        </div>
      </section>

      {/* 08 · gallery — the photo set, plainly. The call asked for a photo
          gallery page; on a one-page prototype it is a section, and each frame
          keeps the same drift device as everywhere else. */}
      <section className="vn-gallery" id="gallery">
        <div className="vn-gallery-head">
          <Headline text="The house in pictures." size={56} floor={30} measure={560} />
          <p className="vn-body vn-rv">
            Glass, dark timber and the valley, room by room.
          </p>
        </div>
        {/* Six frames, three rows of rhythm (4+2 / 2+2+2 / 6), and none of
            them appears anywhere else on the page. Crops are overridden per
            cell so the row heights resolve exactly. */}
        <div className="vn-gallery-grid">
          <Frame photo={PHOTO.living} className="vn-g-a" drift={7} ratio="16 / 10" sizes="(max-width: 899px) 100vw, 62vw" />
          <Frame photo={PHOTO.bedroom} className="vn-g-b" drift={6} ratio="4 / 5" sizes="(max-width: 899px) 100vw, 31vw" />
          <Frame photo={PHOTO.kitchenDining} className="vn-g-c" drift={6} ratio="1 / 1" sizes="(max-width: 899px) 100vw, 31vw" />
          <Frame photo={PHOTO.bath} className="vn-g-d" drift={6} ratio="1 / 1" sizes="(max-width: 899px) 100vw, 31vw" />
          <Frame photo={PHOTO.bedroomAttic} className="vn-g-e" drift={6} ratio="1 / 1" sizes="(max-width: 899px) 100vw, 31vw" />
          <Frame photo={PHOTO.gridSunset} className="vn-g-f" drift={9} ratio="21 / 9" sizes="100vw" />
        </div>
      </section>

      {/* 09 · tours — the placeholder is deliberate and visible: the slot is
          drawn, the engine (TourDesk or Bókun) is the client's choice, and the
          cards are marked as examples rather than sold as real inventory. */}
      <section className="vn-tours" id="tours">
        {/* The whole section is drawn as ONE example sheet: a dashed boundary
            with an architect's title stamp in the corner, real-feeling cards
            inside it. The placeholder is the sheet, not the cards. */}
        <div className="vn-tours-sheet">
          <p className="vn-tours-stamp" aria-label="Example section">
            <span className="vn-tours-stamp-a">Example section</span>
            <span className="vn-tours-stamp-b">Tour booking connects here</span>
          </p>
          <div className="vn-tours-head">
            <Headline text="Trips from the door." size={56} floor={30} measure={560} />
            <p className="vn-body vn-rv">
              The valley is a base as much as a destination. Guests will browse
              and book tours right here, without leaving the page.
            </p>
          </div>
          {/* Each tour is one plate: the photograph IS the card and carries a
              place overline, the tour's name and a button, nothing else.
              Pointing at one plate pulls it forward and pushes every sibling
              back behind a blur, so the row reads as a stack of photographs
              being sorted through rather than four tiles sitting still.
              Mechanism after a 21st.dev reference (lavikatiyar/cards); the
              skin, type and amber are ours. */}
          <div className="vn-tours-grid vn-rv">
            {EXAMPLE_TOURS.map((tour) => (
              <TourPlate key={tour.name} tour={tour} />
            ))}
            <div className="vn-tour-plate vn-tour-ghost">
              <span className="vn-tour-ghost-plus" aria-hidden="true">+</span>
              <p className="vn-tour-ghost-note">The rest land here</p>
            </div>
          </div>
          <p className="vn-tours-foot">
            The live tours come from TourDesk or Bókun, whichever is chosen.
            Guests book on the spot and the house earns a commission on every seat.
          </p>
        </div>
      </section>

      {/* 10 · guests */}
      <section className="vn-guests" id="guests">
        <Headline text="What guests keep saying." size={64} floor={32} measure={620} />
        <p className="vn-guests-meta vn-rv">
          {HOST.rating.toFixed(1)} of 5 across {HOST.reviewCount} reviews · {HOST.badges.join(' · ')}
        </p>
        {/* An infinite marquee (the 21st.dev testimonials-with-marquee
            mechanism: duplicated track at -50%, pause on hover, edge fades),
            re-drawn in this page's own materials. Real quotes interleaved
            with real counts from the review index — never invented filler. */}
        <div className="vn-marquee vn-rv" aria-label="Guest reviews">
          <div className="vn-marquee-track">
            {[0, 1].map((copy) => (
              <div className="vn-marquee-set" aria-hidden={copy === 1} key={copy}>
                {REVIEW_QUOTES.map((q) => (
                  <figure className="vn-mq-card" key={`${copy}-${q.author}`}>
                    <blockquote><p>{'“'}{q.quote}{'”'}</p></blockquote>
                    <figcaption>{q.author} · {q.when}</figcaption>
                  </figure>
                ))}
                {REVIEW_THEMES.map((th) => (
                  <div className="vn-mq-card vn-mq-stat" key={`${copy}-${th.theme}`}>
                    <p className="vn-mq-stat-n">{th.mentions}</p>
                    <p className="vn-mq-stat-l">reviews mention {th.theme.toLowerCase()}</p>
                  </div>
                ))}
                <div className="vn-mq-card vn-mq-stat">
                  <p className="vn-mq-stat-n">{HOST.rating.toFixed(1)}</p>
                  <p className="vn-mq-stat-l">across {HOST.reviewCount} reviews</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09 · booking */}
      <section className="vn-book" id="booking">
        <div className="vn-book-intro">
          <Headline text="Ask for your dates." size={72} floor={34} measure={560} />
          <p className="vn-body vn-rv">
            Requests go straight to {HOST.name}, who responds to {HOST.responseRate} of
            messages, usually {HOST.respondsWithin}.
          </p>
          <div className="vn-owner-note vn-rv">
            <p className="vn-owner-note-label">The owner's dashboard</p>
            <p className="vn-owner-note-body">
              Every request lands in a dashboard built for this house: confirm or
              decline in one tap, watch requests arrive.{' '}
              <Link className="vn-a" to="/preview/villanorth/stjornbord">
                See how direct bookings could work
              </Link>{' '}
              beside this tab and send yourself a request.
            </p>
          </div>
        </div>
        <BookingForm />
      </section>

      {/* 10 · footer facts */}
      {/* 11 · finding the house — contact block + a live map. The map iframe
          is keyless (google output=embed), lazy, and boxed in a hairline frame
          so it reads as a drawing plate rather than a widget. */}
      <section className="vn-contact" id="contact">
        <div className="vn-contact-copy">
          <Headline text="Finding the house." size={56} floor={30} measure={520} />
          <dl className="vn-contact-list vn-rv">
            <div>
              <dt>Where</dt>
              <dd>Fnjóskadalur, Þingeyjarsveit, North Iceland</dd>
            </div>
            <div>
              <dt>From Akureyri</dt>
              <dd>Fifteen to twenty minutes through Vaðlaheiðargöng</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd><a className="vn-a" href="tel:+3548449808">+354 844 9808</a></dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd><a className="vn-a" href="mailto:villanorthiceland@gmail.com">villanorthiceland@gmail.com</a></dd>
            </div>
          </dl>
        </div>
        <div className="vn-contact-map vn-rv">
          <iframe
            title="Map of Fnjóskadalur, North Iceland"
            src="https://www.google.com/maps?q=Fnj%C3%B3skadalur%2C%20%C3%9Eingeyjarsveit&z=10&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <p className="vn-map-cap">Fnjóskadalur — the valley east of Akureyri.</p>
        </div>
      </section>

      {/* The close: the page returns to night (the glow's ground), the
          wordmark comes back one last time at size with the monogram above
          it, and the practical rows sit quiet beneath a hairline. */}
      <footer className="vn-foot">
        <div className="vn-foot-hero">
          {/* No monogram here: the fixed nav's own mark parks directly over
              this corner at rest, and two marks double-print. The wordmark
              carries the close alone. */}
          <p className="vn-foot-wordmark" aria-hidden="true">VILLA NORTH</p>
          <a className="vn-cta" href="#booking" onClick={anchor('booking')}>Book now</a>
        </div>
        <div className="vn-foot-grid">
          <div>
            <p className="vn-foot-label">Find us</p>
            <p className="vn-foot-line">Fnjóskadalur, Þingeyjarsveit, North Iceland</p>
            <p className="vn-foot-line"><a className="vn-foot-a" href="tel:+3548449808">+354 844 9808</a></p>
            <p className="vn-foot-line"><a className="vn-foot-a" href="mailto:villanorthiceland@gmail.com">villanorthiceland@gmail.com</a></p>
          </div>
          <div>
            <p className="vn-foot-label">The house</p>
            <p className="vn-foot-line">Guests {FACTS.guests} · {FACTS.bedrooms} bedrooms · {FACTS.beds} beds · {FACTS.baths} bathrooms</p>
            <p className="vn-foot-line">Check-in {FACTS.checkIn}</p>
            <p className="vn-foot-line">Check-out {FACTS.checkOut}</p>
          </div>
          <div>
            <p className="vn-foot-label">Good to know</p>
            <p className="vn-foot-line">{FACTS.security}</p>
            <p className="vn-foot-line">{FACTS.water}</p>
            <p className="vn-foot-line">Washer and dryer are outside the main house</p>
          </div>
        </div>
        <div className="vn-foot-base">
          <p className="vn-foot-line">© 2026 Villa North</p>
          <a className="vn-foot-a vn-foot-sndr" href="https://sndr-studio.pages.dev" target="_blank" rel="noopener">
            Designed by SNDR Studio
          </a>
        </div>
      </footer>

      <PreviewFooter company={company} />
    </div>
  )
}

/* ── styles ────────────────────────────────────────────────────────────── */

const CSS = `
@font-face { font-family: 'Apfel Grotezk'; src: url('${BASE}fonts/apfel-grotezk/ApfelGrotezk-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Apfel Grotezk'; src: url('${BASE}fonts/apfel-grotezk/ApfelGrotezk-Mittel.woff2') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'Apfel Grotezk'; src: url('${BASE}fonts/apfel-grotezk/ApfelGrotezk-Fett.woff2') format('woff2'); font-weight: 700; font-display: swap; }
@font-face { font-family: 'Onest'; src: url('${BASE}fonts/onest/Onest-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Onest'; src: url('${BASE}fonts/onest/Onest-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'Onest'; src: url('${BASE}fonts/onest/Onest-Bold.woff2') format('woff2'); font-weight: 700; font-display: swap; }
@font-face { font-family: 'Azeret Mono'; src: url('${BASE}fonts/azeret-mono/AzeretMono-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Azeret Mono'; src: url('${BASE}fonts/azeret-mono/AzeretMono-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }

.vn-root {
  --u: clamp(.44px, 100vw / 1440, 1.15px);
  --vn-c: ${PAPER};
  --vn-ink: ${INK};
  --vn-line: #62656A;
  --vn-amber: #C29049;
  --vn-amber-text: #8A5F1E;
  --vn-night: ${NIGHT};
  --vn-mute: color-mix(in srgb, var(--vn-ink) 66%, transparent);
  --vn-hair: color-mix(in srgb, var(--vn-ink) 16%, transparent);
  background: var(--vn-c);
  color: var(--vn-ink);
  font-family: ${BODY};
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
.vn-root ::selection { background: var(--vn-amber); color: ${INK}; }
.vn-root a { color: inherit; }
.vn-root :focus-visible { outline: 2px solid var(--vn-amber); outline-offset: 2px; border-radius: 2px; }
.vn-root a, .vn-root button, .vn-root input, .vn-root select, .vn-root textarea {
  touch-action: manipulation;
}
.vn-a:hover { color: var(--vn-amber-text); }

/* nav */
/* No bar, no fill, no hairline: the header floats straight on the full-bleed
   hero. Painted near-white under mix-blend difference so it inverts against
   whatever passes beneath it (bright sky -> dark ink, dark timber and the
   night glow section -> light). Everything inside must be currentColor based;
   a fixed accent inverts to something ugly under difference. */
.vn-root section[id] {
  /* The header is fixed, so an anchor jump would otherwise park the
     section's first line underneath it (measured: 69px swallowed). */
  scroll-margin-top: clamp(88px, calc(var(--u) * 116), 136px);
}
.vn-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 40;
  display: flex; align-items: center; gap: calc(var(--u) * 36);
  padding: calc(var(--u) * 18) calc(var(--u) * 44);
  color: #F2F1EE;
  mix-blend-mode: difference;
}
.vn-nav-mark {
  font-family: ${DISPLAY}; font-weight: 700; letter-spacing: .06em; text-decoration: none;
  font-size: ${fluid(16, 15)}; color: inherit;
}
.vn-nav-links { display: flex; gap: calc(var(--u) * 28); margin-left: auto; }
.vn-nav-links a {
  text-decoration: none; font-size: ${fluid(14, 15)}; color: inherit;
  opacity: .72; transition: opacity .25s ease;
}
.vn-nav-links a:hover { opacity: 1; }
.vn-nav-cta {
  text-decoration: none; font-size: ${fluid(14, 15)}; font-weight: 500;
  padding: calc(var(--u) * 10) calc(var(--u) * 18);
  border: 1px solid color-mix(in srgb, currentColor 40%, transparent);
  border-radius: 2px; color: inherit;
  transition: border-color .25s ease;
}
.vn-nav-cta:hover { border-color: currentColor; }

/* ── the phone menu ────────────────────────────────────────────────────────
   Desktop never sees any of this. The trigger is two rules drawn in
   currentColor so it inherits the header's difference blend exactly like the
   wordmark does, and becomes an X by rotating the same two rules. */
.vn-burger {
  display: none; margin-left: auto; position: relative;
  width: 44px; height: 44px; padding: 0;
  background: none; border: 0; color: inherit; cursor: pointer;
}
.vn-burger span {
  position: absolute; left: 11px; width: 22px; height: 1.5px;
  background: currentColor;
  transition: transform .38s cubic-bezier(.76,0,.24,1), opacity .2s ease;
}
.vn-burger span:nth-child(1) { top: 19px; }
.vn-burger span:nth-child(2) { top: 25px; }
.vn-burger.is-open span:nth-child(1) { transform: translateY(3px) rotate(45deg); }
.vn-burger.is-open span:nth-child(2) { transform: translateY(-3px) rotate(-45deg); }

/* svh, never dvh: dvh re-lays out every frame while the iOS URL bar moves,
   which is a full-screen relayout during a scroll. */
.vn-menu {
  position: fixed; inset: 0; z-index: 39;
  display: flex; flex-direction: column; justify-content: center;
  gap: calc(var(--u) * 34);
  padding: 96px 24px calc(40px + env(safe-area-inset-bottom, 0px));
  min-height: 100svh;
  background: var(--vn-night); color: #F2F1EE;
  /* visibility, not the hidden attribute: toggling display in the same frame
     as the class kills the transition, and visibility still takes the links
     out of the tab order while closed. */
  opacity: 0; visibility: hidden;
  transition: opacity .34s ease, visibility 0s linear .34s;
}
.vn-menu.is-open {
  opacity: 1; visibility: visible;
  transition: opacity .34s ease, visibility 0s linear 0s;
}
.vn-menu-links { display: flex; flex-direction: column; gap: calc(var(--u) * 8); }
.vn-menu-links a {
  display: inline-flex; align-items: center; min-height: 52px;
  font-family: ${DISPLAY}; font-weight: 700; letter-spacing: -.01em;
  font-size: clamp(28px, 8.5vw, 40px); line-height: 1.05;
  color: inherit; text-decoration: none;
}
.vn-menu-links a:active { color: var(--vn-amber); }
.vn-menu-cta {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 56px; padding: 0 calc(var(--u) * 26);
  background: var(--vn-amber); color: ${INK};
  font-weight: 500; font-size: 16px; text-decoration: none; border-radius: 2px;
}
.vn-menu-foot {
  margin: 0; display: flex; flex-direction: column; gap: 8px;
  font-family: ${MONO}; font-size: 12px; letter-spacing: .04em;
}
.vn-menu-foot a { color: rgba(242, 241, 238, .62); text-decoration: none; }

/* hero */
.vn-hero { position: relative; min-height: 100svh; display: grid; }
.vn-hero-media { position: absolute; inset: 0; overflow: hidden; }
.vn-hero-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.vn-hero-media::after {
  content: ''; position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(200deg, transparent 46%, rgba(16,18,22,.62) 100%);
}
.vn-hero-block {
  position: relative; align-self: end; z-index: 1;
  padding: 0 calc(var(--u) * 48) calc(calc(var(--u) * 64) + env(safe-area-inset-bottom, 0px));
  color: #F2F1EE; max-width: calc(var(--u) * 760);
}
/* The wordmark sits dead centre of the hero and opens the site: each word
   rises out of its own mask. The mask box carries .18em of headroom (and a
   matching negative margin) so nothing clips. */
.vn-wordmark {
  position: absolute; inset: 0; z-index: 2;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0; margin: 0; pointer-events: none;
  color: #F5F4F1;
  font-family: ${DISPLAY}; font-weight: 700; letter-spacing: .05em;
  font-size: clamp(30px, 8vw, 116px); line-height: 1.08;
  text-shadow: 0 2px 44px rgba(16, 18, 22, .42);
}
.vn-wm-row { display: flex; align-items: center; gap: .3em; }
/* the drafting guide the name is set against */
.vn-wm-rule {
  display: block; width: min(40vw, 520px); height: 1px; background: currentColor;
  opacity: .55; margin-bottom: .3em; transform-origin: 0 50%;
  will-change: transform, opacity;
}
.vn-wm-line {
  display: inline-block; overflow: hidden;
  padding: .18em .05em .14em; margin: -.18em -.05em -.14em;
}
.vn-wm-word { display: inline-block; }
.vn-measure-text {
  margin: 0; font-family: ${MONO}; font-weight: 500; font-size: ${fluid(15, 13)};
  letter-spacing: .04em; color: #F2F1EE;
}
.vn-hero-sub {
  margin: calc(var(--u) * 22) 0 0; font-size: ${fluid(18, 15)}; line-height: 1.55;
  font-weight: 400; max-width: 42ch; color: rgba(242,241,238,.9);
}
.vn-cta {
  display: inline-block; margin-top: calc(var(--u) * 26);
  background: var(--vn-amber); color: ${INK};
  font-weight: 500; font-size: ${fluid(15, 13)}; text-decoration: none;
  padding: calc(var(--u) * 14) calc(var(--u) * 26);
  border: 0; border-radius: 2px; cursor: pointer;
  transition: transform .15s ease, filter .25s ease;
}
.vn-cta:hover { filter: brightness(1.06); }
.vn-cta:active { transform: translateY(1px); }
.vn-cta-block { width: 100%; text-align: center; }

/* shared text */
.vn-headline {
  margin: 0; font-family: ${DISPLAY}; font-weight: 700; letter-spacing: -.01em;
  line-height: 1.14; text-wrap: balance;
}
/* The word is the unbreakable unit; the character is what animates. No
   overflow clip any more: the reveal is a blur and a lift, not a mask, and a
   clip would cut the blur radius off at the line box. */
.vn-word { display: inline-block; white-space: nowrap; }
.vn-char { display: inline-block; will-change: opacity, transform; }
.vn-body {
  font-size: ${fluid(17, 15)}; line-height: 1.6; font-weight: 400;
  color: var(--vn-mute); max-width: 58ch; margin: calc(var(--u) * 24) 0 0;
}
.vn-stat { font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--vn-mute); margin: calc(var(--u) * 14) 0 0; }
.vn-a { color: inherit; }
.vn-quote-block { max-width: 60ch; margin: calc(var(--u) * 40) 0 0; }
.vn-quote-block p { margin: 0; font-size: ${fluid(20, 16)}; line-height: 1.45; font-weight: 400; }
.vn-quote-block cite {
  display: block; font-style: normal; font-family: ${MONO}; font-size: ${fluid(12, 12)};
  color: var(--vn-mute); margin-top: calc(var(--u) * 14);
}

/* drafted frames: the hairline draws (unchanged below), then the photo itself
   sweeps in under an off-axis mask, resolving out of a soft blur as it
   uncovers. Mask POSITION is what transitions (mask-image gradient stops
   never interpolate); the mask is oversize (300% 300%) so its edge falls
   off-axis rather than closing symmetrically. Once the sweep finishes,
   mask-image is cleared to none - now that .vn-frame-in transforms every
   tick, a resting mask on top of that would be a real compositing cost.

   .vn-frame-in is the Heklusýn drift device's wrapper (see drift() in
   useMotion): position absolute, oversized on both axes by --dz (derived
   from the frame's drift amount), so the image can never run out of
   overhang at the extremes of scroll travel. It is the ONLY thing that ever
   sets a transform here. The <img> inside it fills the wrapper at 100%/100%
   and owns the mask sweep + blur/saturate reveal only - no transform, no
   oversize of its own. */
.vn-frame {
  position: relative; overflow: hidden; margin: 0;
  background: color-mix(in srgb, var(--vn-ink) 6%, transparent);
  aspect-ratio: var(--vn-ar);
  max-width: var(--vn-fw, none);
}
.vn-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; }
@media (min-width: 992px) { .vn-frame-in { will-change: transform; } }
.vn-frame-in img {
  width: 100%; height: 100%; max-width: none; object-fit: cover; display: block;
}
.vn-js .vn-frame-in img {
  -webkit-mask-image: linear-gradient(168deg, transparent 0%, #000 42%, #000 100%);
  mask-image: linear-gradient(168deg, transparent 0%, #000 42%, #000 100%);
  -webkit-mask-size: 300% 300%;
  mask-size: 300% 300%;
  -webkit-mask-position: 72% 72%;
  mask-position: 72% 72%;
  filter: blur(18px) saturate(.72);
  transition:
    -webkit-mask-position 1.15s cubic-bezier(.25,1,.5,1) .45s,
    mask-position 1.15s cubic-bezier(.25,1,.5,1) .45s,
    filter 1.15s cubic-bezier(.25,1,.5,1) .45s,
    -webkit-mask-image 0s linear 1.65s,
    mask-image 0s linear 1.65s;
}
.vn-js .vn-frame.is-in .vn-frame-in img {
  -webkit-mask-position: 0% 0%;
  mask-position: 0% 0%;
  filter: blur(0) saturate(1);
  -webkit-mask-image: none;
  mask-image: none;
}
.vn-frame-svg { position: absolute; inset: 0; pointer-events: none; z-index: 2; }
.vn-frame-svg rect {
  fill: none; stroke: var(--vn-line); stroke-width: 1; vector-effect: non-scaling-stroke;
  stroke-dasharray: 396; stroke-dashoffset: 396;
}
.vn-js .vn-frame-svg rect {
  transition: stroke-dashoffset .95s cubic-bezier(.65,0,.35,1), opacity .8s ease .95s;
}
.vn-js .vn-frame.is-in .vn-frame-svg rect { stroke-dashoffset: 0; opacity: .1; }
.vn-static .vn-frame-in { inset: 0; }
.vn-static .vn-frame-in img {
  -webkit-mask-image: none; mask-image: none; filter: none;
}
.vn-static .vn-frame-svg rect { stroke-dashoffset: 0; opacity: .1; }

/* the drawing */
.vn-drawing { padding: calc(var(--u) * 170) 0 calc(var(--u) * 60); }
.vn-drawing-copy {
  max-width: calc(var(--u) * 1240); margin: 0 auto calc(var(--u) * 56);
  padding: 0 calc(var(--u) * 48);
}
.vn-drawing-inner {
  position: relative; overflow: hidden; background: var(--vn-c);
  aspect-ratio: 4 / 3;
}
@media (min-width: 768px) {
  .vn-drawing-inner { height: 100svh; aspect-ratio: auto; }
}
.vn-elev-svg, .vn-elev-photo { position: absolute; inset: 0; }
.vn-elev { width: 100%; height: 100%; }
.vn-elev-line { fill: none; stroke: var(--vn-ink); stroke-width: 2.2; vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; }
.vn-elev-secondary, .vn-elev-mullions { fill: none; stroke: var(--vn-line); stroke-width: 1.3; vector-effect: non-scaling-stroke; stroke-linecap: round; }
.vn-elev-hatch { opacity: 0; }
.vn-elev-photo { z-index: 1; }
.vn-elev-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.vn-elev-caps {
  position: absolute; left: calc(var(--u) * 48); bottom: calc(var(--u) * 48); z-index: 3;
  display: grid; align-items: end; max-width: 30ch;
}
.vn-elev-cap { grid-area: 1 / 1; margin: 0; font-family: ${DISPLAY}; font-weight: 500; font-size: ${fluid(22, 16)}; }
.vn-elev-cap-sketch { color: var(--vn-ink); }
.vn-elev-cap-photo { color: #F2F1EE; opacity: 0; }
.vn-force-resolved .vn-elev-svg { opacity: 0 !important; }
.vn-force-resolved .vn-elev-photo { opacity: 1 !important; }
.vn-elev-credit {
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--vn-mute); line-height: 1.6;
  max-width: calc(var(--u) * 1240); margin: calc(var(--u) * 24) auto 0; padding: 0 calc(var(--u) * 48);
}
/* "the same gable, from inside": an asymmetric copy+image pairing distinct
   from the duo-grids (valley/welcome) and the interactive rooms explorer -
   a kicker + one editorial line reading the ceiling angle as a rhyme with
   the traced roofline above, the portrait photo taking the wider column. */
.vn-drawing-inside {
  display: grid; grid-template-columns: 1fr calc(var(--u) * 380);
  align-items: center; gap: calc(var(--u) * 48);
  max-width: calc(var(--u) * 1240); margin: calc(var(--u) * 72) auto 0;
  padding: calc(var(--u) * 40) calc(var(--u) * 48) 0; border-top: 1px solid var(--vn-hair);
}
.vn-drawing-inside-copy { max-width: 34ch; }
.vn-drawing-inside-kicker {
  font-family: ${MONO}; font-size: ${fluid(11, 12)}; letter-spacing: .12em; text-transform: uppercase;
  color: var(--vn-amber-text); margin: 0 0 calc(var(--u) * 14);
}
.vn-drawing-inside-line {
  font-family: ${DISPLAY}; font-weight: 500; font-size: ${fluid(23, 18)}; line-height: 1.4; margin: 0;
}
.vn-drawing-inside-fig { width: 100%; }

/* the valley */
.vn-valley {
  display: grid; grid-template-columns: 5fr 6fr; gap: calc(var(--u) * 88);
  padding: calc(var(--u) * 60) calc(var(--u) * 48) calc(var(--u) * 150);
  max-width: calc(var(--u) * 1440); margin: 0 auto; align-items: start;
}
.vn-draws { margin: calc(var(--u) * 36) 0 0; }
.vn-draws div {
  display: grid; grid-template-columns: calc(var(--u) * 190) 1fr; gap: calc(var(--u) * 24);
  padding: calc(var(--u) * 14) 0; border-top: 1px solid var(--vn-hair);
}
.vn-draws dt { font-weight: 500; font-size: ${fluid(15, 14)}; }
.vn-draws dd { margin: 0; font-size: ${fluid(14, 13)}; color: var(--vn-mute); line-height: 1.5; }
.vn-valley-figs { display: grid; gap: calc(var(--u) * 20); }
.vn-valley-duo { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 20); }

/* rooms */
.vn-rooms { padding: calc(var(--u) * 60) calc(var(--u) * 48) calc(var(--u) * 150); max-width: calc(var(--u) * 1440); margin: 0 auto; }
.vn-rooms-lead { width: min(100%, calc(var(--u) * 1000)); margin: calc(var(--u) * 44) auto 0; }
.vn-rooms-explorer {
  display: grid; grid-template-columns: 5fr 7fr; gap: calc(var(--u) * 64);
  margin-top: calc(var(--u) * 64);
}
.vn-rooms-index { display: flex; flex-direction: column; gap: calc(var(--u) * 6); }
.vn-rooms-zone-label {
  font-family: ${MONO}; font-size: ${fluid(11, 12)}; letter-spacing: .12em; text-transform: uppercase;
  color: var(--vn-amber-text); margin: calc(var(--u) * 20) 0 calc(var(--u) * 6);
}
.vn-rooms-index-item:first-child .vn-rooms-zone-label { margin-top: 0; }
.vn-room-btn {
  display: flex; justify-content: space-between; align-items: baseline; gap: calc(var(--u) * 16);
  width: 100%; text-align: left; font: inherit; cursor: pointer; min-height: 44px;
  background: none; border: 0; border-top: 1px solid var(--vn-hair);
  padding: calc(var(--u) * 14) calc(var(--u) * 4);
}
.vn-room-btn-label { font-weight: 500; font-size: ${fluid(16, 15)}; }
.vn-room-btn-fact { font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--vn-mute); }
.vn-room-btn.is-active .vn-room-btn-label { color: var(--vn-amber-text); }
.vn-rooms-pane { display: block; }
.vn-rooms-pane-frame { width: 100%; }
.vn-rooms-pane-label { font-family: ${DISPLAY}; font-weight: 500; font-size: ${fluid(20, 17)}; margin: calc(var(--u) * 20) 0 0; }
.vn-rooms-pane-fact { font-size: ${fluid(15, 14)}; color: var(--vn-mute); margin: calc(var(--u) * 8) 0 0; line-height: 1.5; }
.vn-rooms-pane-note { font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--vn-mute); margin: calc(var(--u) * 10) 0 0; }
.vn-rooms-acc { display: none; }
.vn-rooms-bath {
  display: flex; align-items: center; gap: calc(var(--u) * 24);
  margin-top: calc(var(--u) * 64); padding-top: calc(var(--u) * 32); border-top: 1px solid var(--vn-hair);
}
.vn-rooms-bath-frame { width: calc(var(--u) * 220); flex: none; }
.vn-rooms-bath-fact { font-weight: 500; font-size: ${fluid(16, 15)}; margin: 0; }
.vn-rooms-bath-detail { font-size: ${fluid(14, 13)}; color: var(--vn-mute); margin: calc(var(--u) * 8) 0 0; line-height: 1.5; max-width: 46ch; }

/* materials */
.vn-materials { padding: calc(var(--u) * 60) calc(var(--u) * 48) calc(var(--u) * 150); max-width: calc(var(--u) * 1240); margin: 0 auto; }
.vn-materials-names {
  display: flex; gap: calc(var(--u) * 32); list-style: none; margin: calc(var(--u) * 32) 0 0; padding: calc(var(--u) * 20) 0 0;
  border-top: 1px solid var(--vn-hair); font-family: ${MONO}; font-size: ${fluid(15, 13)}; letter-spacing: .04em;
}
/* hover-expand accordion, ported from a 21st.dev reference (larsen66/expand-
   on-hover): one activeIndex, flex-grow (not width) so container resizes
   never desync the ratios, one shared height across all three tiles. Tuned
   restrained per the brief: equal thirds at rest, ~1.6x on the active tile,
   never a sliver. Reduced motion forces flex-grow back to 1 (below). */
.vn-mat-expand {
  display: flex; gap: calc(var(--u) * 12);
  height: calc(var(--u) * 420);
  margin-top: calc(var(--u) * 48);
}
.vn-mat-panel {
  position: relative; overflow: hidden; flex: 1 1 0%; min-width: 0;
  height: 100%; padding: 0; margin: 0; border: 0; border-radius: 2px;
  cursor: pointer; background: color-mix(in srgb, var(--vn-ink) 6%, transparent);
  -webkit-tap-highlight-color: transparent;
}
.vn-mat-panel:focus-visible { outline: 2px solid var(--vn-amber); outline-offset: 3px; }
.vn-mat-panel img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
}
.vn-mat-scrim {
  position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0;
  background: linear-gradient(0deg, rgba(16,18,22,.66) 0%, rgba(16,18,22,.1) 55%, transparent 75%);
  transition: opacity .3s ease;
}
.vn-mat-scrim.is-active { opacity: 1; }
.vn-mat-label {
  position: absolute; left: calc(var(--u) * 16); bottom: calc(var(--u) * 14); z-index: 2;
  font-family: ${MONO}; font-size: ${fluid(13, 12)}; color: #F2F1EE; white-space: nowrap;
  opacity: 0; transform: translateY(6px);
  transition: opacity .3s ease .1s, transform .3s ease .1s;
}
.vn-mat-label.is-active { opacity: 1; transform: translateY(0); }

/* the glow */
.vn-glow { padding: calc(var(--u) * 90) 0; transition: background .5s ease, color .5s ease; }
.vn-glow.is-dark, .vn-static .vn-glow { background: var(--vn-night); color: #EFEEEA; }
.vn-glow.is-dark, .vn-static .vn-glow { --vn-mute: rgba(239,238,234,.62); --vn-amber-text: #D9A968; }
.vn-glow-bleed { position: relative; aspect-ratio: 21 / 9; overflow: hidden; background: ${NIGHT}; }
.vn-glow-poster, .vn-glow-video {
  position: absolute; inset: 0; z-index: 0;
  width: 100%; height: 100%; object-fit: cover; display: block;
}
/* the still is the permanent base layer; the film plays on top of it and, if
   it errors, simply removes itself (opacity 0) to reveal the still beneath -
   the section never depends on the video succeeding to look complete. */
.vn-glow-video { z-index: 1; transition: opacity .4s ease; }
.vn-glow-video.is-errored { opacity: 0; }
/* Scrim strengthened over a real pixel read: the drafted still had a bright
   patch (aurora/steam) sitting under the label's right edge, measured at
   1.27:1 against the amber label and 2.73:1 against the white caption -
   both fail WCAG AA. A radial pool anchored under the caption block (it
   moves with the section, not the video's shifting light) plus a steeper
   diagonal fixes every corner sampled to >=4.5:1 at both mobile and desktop
   widths, without touching the type colours. */
.vn-glow-bleed::after {
  content: ''; position: absolute; inset: 0; z-index: 2;
  background:
    radial-gradient(135% 120% at 2% 98%, rgba(10,11,15,.92) 0%, rgba(10,11,15,.68) 42%, rgba(10,11,15,0) 82%),
    linear-gradient(198deg, transparent 30%, rgba(10,11,15,.7) 100%);
}
.vn-glow-caps { position: absolute; left: calc(var(--u) * 48); bottom: calc(var(--u) * 40); z-index: 3; color: #F2F1EE; max-width: 38ch; }
.vn-glow-label { font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .16em; text-transform: uppercase; color: #D9A968; margin: 0 0 calc(var(--u) * 10); }
.vn-glow-cap { margin: 0; font-family: ${DISPLAY}; font-weight: 500; font-size: ${fluid(24, 17)}; line-height: 1.3; }
.vn-glow-row {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 24); align-items: start;
  max-width: calc(var(--u) * 1440); margin: calc(var(--u) * 48) auto 0; padding: 0 calc(var(--u) * 48);
}
/* Custom properties obey the cascade, so a rule here could not beat Frame's
   inline --vn-ar; the crop is equalised through the ratio prop instead
   (GLOW_RATIO). This only has to fill the cell. */
.vn-glow-row .vn-frame { width: 100%; }
.vn-glow-tub-col { display: flex; flex-direction: column; gap: calc(var(--u) * 14); align-items: start; }
/* Every child of .vn-frame is position:absolute, so the figure has no in-flow
   content and its fit-content width is 0. In .vn-glow-row (a grid) align-items
   is the BLOCK axis and items still stretch inline, so the other two frames are
   fine. In this flex COLUMN align-items is the INLINE axis, so start = shrink
   to fit = width 0, aspect-ratio then took height to 0, and the photo loaded
   but never painted. Give width so the maxWidth prop has something to cap. */
.vn-glow-tub-col > .vn-frame { width: 100%; }
.vn-glow-fact { font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--vn-mute); margin: 0; max-width: 26ch; }
.vn-glow-quote { max-width: calc(var(--u) * 1440); margin: calc(var(--u) * 56) auto 0; padding: 0 calc(var(--u) * 48); color: inherit; }
.vn-glow-quote cite { color: var(--vn-mute); }

/* welcome ritual */
.vn-welcome {
  display: grid; grid-template-columns: 5fr 7fr; gap: calc(var(--u) * 88);
  padding: calc(var(--u) * 90) calc(var(--u) * 48) calc(var(--u) * 150);
  max-width: calc(var(--u) * 1440); margin: 0 auto; align-items: start;
}
.vn-ritual-list { list-style: none; margin: calc(var(--u) * 32) 0 0; padding: 0; display: flex; flex-direction: column; gap: calc(var(--u) * 10); }
.vn-ritual-list li {
  font-family: ${MONO}; font-size: ${fluid(14, 13)}; padding: calc(var(--u) * 10) 0; border-top: 1px solid var(--vn-hair);
}
.vn-welcome-figs { display: grid; gap: calc(var(--u) * 20); }
.vn-welcome-duo { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 20); }

/* guests */
.vn-guests { padding: calc(var(--u) * 150) calc(var(--u) * 48); max-width: calc(var(--u) * 1240); margin: 0 auto; }
.vn-guests-meta { font-family: ${MONO}; font-size: ${fluid(13, 12)}; color: var(--vn-mute); margin: calc(var(--u) * 20) 0 0; }
/* the review marquee: duplicated track at -50%, pause on hover, edge fades
   to the page ground. width: max-content is what makes -50% exact. */
.vn-marquee { position: relative; margin-top: calc(var(--u) * 56); overflow: hidden; }
.vn-marquee::before, .vn-marquee::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: calc(var(--u) * 140); z-index: 1; pointer-events: none;
}
.vn-marquee::before { left: 0; background: linear-gradient(90deg, var(--vn-c), transparent); }
.vn-marquee::after { right: 0; background: linear-gradient(270deg, var(--vn-c), transparent); }
.vn-marquee-track { display: flex; width: max-content; animation: vn-mq 56s linear infinite; }
.vn-marquee:hover .vn-marquee-track { animation-play-state: paused; }
@keyframes vn-mq { to { transform: translateX(-50%); } }
.vn-marquee-set { display: flex; gap: calc(var(--u) * 20); padding-right: calc(var(--u) * 20); }
.vn-mq-card {
  width: calc(var(--u) * 330); flex: none; margin: 0;
  background: color-mix(in srgb, var(--vn-ink) 4%, var(--vn-c));
  border: 1px solid var(--vn-hair); border-radius: 2px;
  padding: calc(var(--u) * 26) calc(var(--u) * 26) calc(var(--u) * 22);
  display: flex; flex-direction: column; justify-content: space-between; gap: calc(var(--u) * 18);
}
.vn-mq-card blockquote { margin: 0; }
.vn-mq-card blockquote p { margin: 0; font-size: ${fluid(17, 15)}; line-height: 1.5; }
.vn-mq-card figcaption { font-family: ${MONO}; font-size: ${fluid(11, 11)}; letter-spacing: .06em; color: var(--vn-mute); }
.vn-mq-stat { justify-content: center; align-items: flex-start; width: calc(var(--u) * 210); }
.vn-mq-stat-n { margin: 0; font-family: ${MONO}; font-variant-numeric: tabular-nums; font-size: ${fluid(40, 30)}; line-height: 1; color: var(--vn-amber-text); }
.vn-mq-stat-l { margin: 0; font-size: ${fluid(13, 12)}; line-height: 1.45; color: var(--vn-mute); max-width: 16ch; }
.vn-themes {
  display: flex; flex-wrap: wrap; gap: calc(var(--u) * 48) calc(var(--u) * 64);
  margin: calc(var(--u) * 72) 0 0; padding: calc(var(--u) * 24) 0 0; border-top: 1px solid var(--vn-hair);
}
.vn-themes div { display: flex; align-items: baseline; gap: calc(var(--u) * 12); }
.vn-themes dt { font-size: ${fluid(14, 13)}; color: var(--vn-mute); }
.vn-themes dd { margin: 0; font-variant-numeric: tabular-nums; font-family: ${MONO}; font-size: ${fluid(26, 19)}; }

/* booking */
.vn-book {
  display: grid; grid-template-columns: 5fr 6fr; gap: calc(var(--u) * 88);
  padding: calc(var(--u) * 40) calc(var(--u) * 48) calc(var(--u) * 170);
  max-width: calc(var(--u) * 1440); margin: 0 auto; align-items: start;
}
.vn-book-form, .vn-book-done {
  background: color-mix(in srgb, var(--vn-ink) 4%, var(--vn-c));
  border: 1px solid var(--vn-hair); border-radius: 2px; padding: calc(var(--u) * 40);
}
.vn-book-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 20); }
.vn-field { display: flex; flex-direction: column; gap: 6px; }
.vn-field-wide { grid-column: 1 / -1; }
.vn-field-label { font-family: ${MONO}; font-size: ${fluid(11, 12)}; letter-spacing: .1em; text-transform: uppercase; color: var(--vn-mute); }
.vn-optional { text-transform: none; letter-spacing: 0; }
.vn-field input, .vn-field select, .vn-field textarea {
  font: inherit; font-size: 16px; font-weight: 400; color: var(--vn-ink);
  background: var(--vn-c); border: 1px solid var(--vn-hair); border-radius: 2px;
  padding: 10px 12px; min-height: 44px;
}
.vn-field textarea { min-height: 0; resize: vertical; }
.vn-field-error { color: #A5462F; font-size: ${fluid(14, 13)}; margin: calc(var(--u) * 16) 0 0; }

/* the stay calendar — a drafting sheet, not a date picker. The chosen nights
   are a measured span: an amber band through the grid, ink squares on the two
   endpoints, and a dimension line beneath with the figure breaking the rule. */
.vn-cal { grid-column: 1 / -1; }
.vn-cal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: calc(var(--u) * 14); }
.vn-cal-nav { display: flex; gap: 6px; }
.vn-cal-nav button {
  width: 32px; height: 32px; display: grid; place-items: center; cursor: pointer;
  font: inherit; font-size: 14px; line-height: 1; color: var(--vn-ink);
  background: var(--vn-c); border: 1px solid var(--vn-hair); border-radius: 2px;
  transition: border-color .2s ease, opacity .2s ease;
}
.vn-cal-nav button:disabled { opacity: .3; cursor: default; }
.vn-cal-nav button:not(:disabled):hover { border-color: var(--vn-amber); }
.vn-cal-months { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 34); }
.vn-cal-title {
  font-family: ${MONO}; font-size: ${fluid(11, 11)}; letter-spacing: .1em; text-transform: uppercase;
  color: var(--vn-ink); margin: 0 0 calc(var(--u) * 10);
}
.vn-cal-dows, .vn-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); }
.vn-cal-dow {
  font-family: ${MONO}; font-size: 10px; letter-spacing: .06em; text-align: center;
  color: var(--vn-mute); padding-bottom: 7px; border-bottom: 1px solid var(--vn-hair);
}
.vn-cal-cell { position: relative; }
/* the band sits behind the numerals and runs edge to edge, so consecutive
   cells read as one continuous span rather than seven separate chips */
.vn-cal-cell.is-in::before, .vn-cal-cell.is-from::before, .vn-cal-cell.is-to::before {
  content: ''; position: absolute; top: 3px; bottom: 3px; left: 0; right: 0;
  background: color-mix(in srgb, var(--vn-amber) 20%, transparent);
}
.vn-cal-cell.is-from::before { left: 50%; }
.vn-cal-cell.is-to::before { right: 50%; }
.vn-cal-day {
  position: relative; width: 100%; min-height: 38px; cursor: pointer;
  font-family: ${MONO}; font-size: ${fluid(13, 13)}; font-variant-numeric: tabular-nums;
  color: var(--vn-ink); background: none; border: 0; border-radius: 2px; padding: 0;
  transition: box-shadow .15s ease, background-color .15s ease, color .15s ease;
}
.vn-cal-day:disabled { color: color-mix(in srgb, var(--vn-ink) 24%, transparent); cursor: default; }
.vn-cal-day:not(:disabled):hover { box-shadow: inset 0 0 0 1px var(--vn-line); }
.vn-cal-day.is-end { background: var(--vn-ink); color: var(--vn-c); font-weight: 500; }
.vn-cal-day.is-end:hover { box-shadow: none; }

.vn-cal-dim {
  display: grid; grid-template-columns: auto 1fr auto 1fr auto; align-items: center;
  gap: calc(var(--u) * 12); min-height: 46px;
  margin-top: calc(var(--u) * 20); padding-top: calc(var(--u) * 18);
  border-top: 1px solid var(--vn-hair);
}
.vn-cal-dim-end { font-family: ${MONO}; font-size: ${fluid(13, 12)}; font-variant-numeric: tabular-nums; }
.vn-cal-dim-end.is-right { text-align: right; }
.vn-cal-dim-end em {
  display: block; font-style: normal; font-size: 10px; letter-spacing: .1em;
  text-transform: uppercase; color: var(--vn-mute); margin-bottom: 3px;
}
/* terminal ticks, drawn only on the outer ends the way a dimension is */
.vn-cal-dim-rule { position: relative; height: 1px; background: var(--vn-line); }
.vn-cal-dim-rule::before { content: ''; position: absolute; top: -4px; width: 1px; height: 9px; background: var(--vn-line); }
.vn-cal-dim-rule.is-left::before { left: 0; }
.vn-cal-dim-rule.is-right::before { right: 0; }
.vn-cal-dim-figure {
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .06em;
  text-transform: uppercase; color: var(--vn-amber-text); white-space: nowrap;
}
.vn-cal-dim-empty { margin: 0; grid-column: 1 / -1; font-size: ${fluid(13, 13)}; color: var(--vn-mute); }

.vn-owner-note { margin-top: calc(var(--u) * 44); padding-top: calc(var(--u) * 22); border-top: 1px solid var(--vn-hair); }
.vn-owner-note-label { font-family: ${MONO}; font-size: ${fluid(11, 12)}; letter-spacing: .12em; text-transform: uppercase; color: var(--vn-amber-text); margin: 0 0 calc(var(--u) * 10); }
.vn-owner-note-body { font-size: ${fluid(14, 13)}; line-height: 1.6; color: var(--vn-mute); margin: 0; max-width: 44ch; }
.vn-book-note { font-size: ${fluid(13, 12)}; line-height: 1.6; color: var(--vn-mute); margin: calc(var(--u) * 16) 0 0; }
.vn-book-done-title { margin: 0; font-family: ${DISPLAY}; font-weight: 700; font-size: ${fluid(30, 21)}; }
.vn-book-done-body { margin: calc(var(--u) * 16) 0 0; line-height: 1.6; font-size: ${fluid(16, 14)}; }
.vn-ghost {
  margin-top: calc(var(--u) * 22); font: inherit; font-size: ${fluid(14, 13)}; font-weight: 500; cursor: pointer;
  min-height: 44px; background: none; color: var(--vn-ink);
  border: 1px solid var(--vn-hair); border-radius: 2px; padding: calc(var(--u) * 10) calc(var(--u) * 18);
}
.vn-ghost:hover { border-color: var(--vn-amber); }

/* the aerial film — full bleed, same fallback contract as the glow */
.vn-film { margin: calc(var(--u) * 140) 0 calc(var(--u) * 40); }
.vn-film-bleed { position: relative; aspect-ratio: 21 / 9; overflow: hidden; background: ${NIGHT}; }
.vn-film-poster, .vn-film-video {
  position: absolute; inset: 0; z-index: 0;
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.vn-film-video { z-index: 1; transition: opacity .4s ease; }
.vn-film-video.is-errored { opacity: 0; }
/* A low scrim across the film's foot, not a filled chip behind the words: a
   box floating on a photograph reads as a UI sticker, and its width tracks
   the text so it never sits right. The scrim spans the frame, so the label
   is legible on any frame of a bright daytime pass.
   Amber is deliberately NOT used here the way it is on the night film — this
   footage is pale sky and sunlit hillside, and near-white is the only value
   that holds against it. */
.vn-film-bleed::after {
  content: ''; position: absolute; z-index: 2; inset: auto 0 0 0; height: 38%;
  pointer-events: none;
  background: linear-gradient(to top, rgba(16, 18, 22, .58), rgba(16, 18, 22, .22) 46%, transparent);
}
.vn-film-caps { position: absolute; z-index: 3; left: calc(var(--u) * 48); bottom: calc(var(--u) * 30); }
.vn-film-label { margin: 0; font-family: ${MONO}; font-size: ${fluid(11, 11)}; letter-spacing: .14em; text-transform: uppercase; color: #F2F1EE; }

/* gallery — three columns, ratios as shot, drift everywhere */
.vn-gallery { max-width: calc(var(--u) * 1440); margin: 0 auto; padding: calc(var(--u) * 120) calc(var(--u) * 48) 0; }
.vn-gallery-head { max-width: 56ch; }
.vn-gallery-grid {
  margin-top: calc(var(--u) * 48);
  display: grid; grid-template-columns: repeat(6, 1fr); gap: calc(var(--u) * 20);
  align-items: stretch;
}
/* the mosaic: 4+2 over 2+2+2 over a full-width band */
.vn-g-a { grid-column: span 4; }
.vn-g-b { grid-column: span 2; }
.vn-g-c, .vn-g-d, .vn-g-e { grid-column: span 2; }
.vn-g-f { grid-column: 1 / -1; }
/* cells stretch to their row, so the crop fills whatever the row resolves to */
.vn-gallery-grid .vn-frame { height: 100%; }

/* the logo mark — their monogram as an alpha mask painted with currentColor,
   so it inverts with the difference-blend nav and sits as ink in the footer */
.vn-logo-mark {
  display: inline-block; width: 30px; height: 21px; vertical-align: -3px; margin-right: 10px;
  background: currentColor;
  -webkit-mask: url('${BASE}villanorth/logo-mark.png') center / contain no-repeat;
  mask: url('${BASE}villanorth/logo-mark.png') center / contain no-repeat;
}
.vn-logo-mark-foot { width: 34px; height: 24px; vertical-align: -4px; }

/* the hero's tour window */
.vn-hero-tours {
  position: absolute; right: calc(var(--u) * 44); bottom: calc(var(--u) * 40); z-index: 3;
  display: block; width: calc(var(--u) * 260); overflow: hidden;
  border: 1px solid rgba(242, 241, 238, .34); border-radius: 2px;
  background: rgba(16, 18, 22, .44); color: #F2F1EE; text-decoration: none;
  transition: border-color .25s ease;
}
.vn-hero-tours:hover { border-color: rgba(242, 241, 238, .78); }
.vn-ht-stack { position: relative; display: block; aspect-ratio: 4 / 5; overflow: hidden; background: ${NIGHT}; }
/* Every tour photograph is mounted; only opacity and a hair of scale move, so
   the flip is one image dissolving into the next. The outgoing frame eases
   BACK rather than forward, which keeps the incoming one reading as the
   subject instead of two images fighting. */
.vn-ht-img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  opacity: 0; transform: scale(1.045);
  transition: opacity 1.1s cubic-bezier(.33,1,.68,1), transform 1.6s cubic-bezier(.33,1,.68,1);
}
.vn-ht-img.is-on { opacity: 1; transform: scale(1); }
/* Same anatomy as the plates in the tours section: everything is drawn ON the
   photograph, overline then title then button, bottom left. */
.vn-ht-veil {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, rgba(16,18,22,.46) 0%, rgba(16,18,22,0) 34%, rgba(16,18,22,.26) 56%, rgba(16,18,22,.84) 100%);
}
.vn-ht-ticks { position: absolute; top: calc(var(--u) * 13); left: calc(var(--u) * 15); display: flex; gap: 4px; }
.vn-ht-tick { display: block; width: calc(var(--u) * 16); height: 1px; background: rgba(242, 241, 238, .38); transition: background-color .5s ease; }
.vn-ht-tick.is-on { background: var(--vn-amber); }
.vn-ht-stamp {
  position: absolute; top: calc(var(--u) * 22); left: calc(var(--u) * 15);
  font-family: ${MONO}; font-size: 10px; letter-spacing: .16em; text-transform: uppercase;
  color: rgba(242, 241, 238, .72);
}
.vn-ht-body {
  position: absolute; left: calc(var(--u) * 15); right: calc(var(--u) * 15); bottom: calc(var(--u) * 52);
  display: flex; flex-direction: column;
  animation: vn-ht-in .55s cubic-bezier(.25,1,.5,1) both;
}
@keyframes vn-ht-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
.vn-ht-place { font-family: ${MONO}; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--vn-amber); margin-bottom: calc(var(--u) * 6); }
.vn-ht-name { display: block; font-family: ${DISPLAY}; font-weight: 700; font-size: ${fluid(17, 15)}; line-height: 1.15; }
.vn-ht-cta {
  position: absolute; left: calc(var(--u) * 15); bottom: calc(var(--u) * 15);
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 13px; border: 1px solid rgba(242, 241, 238, .5); border-radius: 999px;
  font-family: ${MONO}; font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
  transition: background-color .32s ease, color .32s ease, border-color .32s ease;
}
.vn-ht-cta span { transition: transform .32s cubic-bezier(.25,1,.5,1); }
.vn-hero-tours:hover .vn-ht-cta { background: #F2F1EE; border-color: #F2F1EE; color: ${NIGHT}; }
.vn-hero-tours:hover .vn-ht-cta span { transform: translateX(3px); }

/* tours — one dashed example sheet with a title stamp; the cards inside feel real */
.vn-tours { max-width: calc(var(--u) * 1440); margin: 0 auto; padding: calc(var(--u) * 120) calc(var(--u) * 48) 0; }
.vn-tours-sheet {
  position: relative; border: 1px dashed color-mix(in srgb, var(--vn-ink) 38%, transparent);
  border-radius: 2px; padding: calc(var(--u) * 48) calc(var(--u) * 44) calc(var(--u) * 44);
}
.vn-tours-stamp {
  position: absolute; top: 0; right: 0; margin: 0;
  display: flex; flex-direction: column; gap: 3px; text-align: right;
  border-left: 1px dashed color-mix(in srgb, var(--vn-ink) 38%, transparent);
  border-bottom: 1px dashed color-mix(in srgb, var(--vn-ink) 38%, transparent);
  padding: calc(var(--u) * 14) calc(var(--u) * 18);
}
.vn-tours-stamp-a { font-family: ${MONO}; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--vn-amber-text); }
.vn-tours-stamp-b { font-family: ${MONO}; font-size: 10px; letter-spacing: .06em; color: var(--vn-mute); }
.vn-tours-head { max-width: 56ch; }
.vn-tours-grid { margin-top: calc(var(--u) * 40); display: grid; grid-template-columns: repeat(4, 1fr); gap: calc(var(--u) * 20); align-items: stretch; }
/* The plate: photograph edge to edge, everything else drawn ON it. */
.vn-tour-plate {
  position: relative; display: block; overflow: hidden; border-radius: 2px;
  color: #F2F1EE; text-decoration: none; isolation: isolate;
  transition: transform .5s cubic-bezier(.25,1,.5,1), filter .5s ease, opacity .5s ease, box-shadow .5s ease;
}
.vn-tour-plate:focus-visible { outline: 1px solid var(--vn-amber); outline-offset: 3px; }
/*
 * The reveal, after a 21st.dev reference (lavikatiyar/cards): the plate under
 * the pointer comes forward and every OTHER plate falls back behind a blur, so
 * attention is taken away from the rest of the row rather than merely added to
 * one card. :focus-within gives a keyboard user the identical reveal.
 *
 * Gated on a real pointer. On a touch screen :hover latches after a tap and
 * would leave three cards permanently blurred, and blurring a filter over a
 * photograph that is still drifting on scroll is expensive on a phone for an
 * effect no one there can trigger on purpose.
 */
@media (hover: hover) and (pointer: fine) {
  .vn-tours-grid:hover .vn-tour-ghost:not(:hover) { filter: blur(3px); opacity: .45; }
  .vn-tours-grid:hover .vn-tour-plate:not(:hover),
  .vn-tours-grid:focus-within .vn-tour-plate:not(:focus-within) {
    filter: blur(3px) saturate(.72); opacity: .5; transform: scale(.99);
  }
  .vn-tour-plate:hover, .vn-tour-plate:focus-within {
    transform: translateY(-5px);
    box-shadow: 0 22px 44px -20px rgba(16, 18, 22, .6);
  }
}
.vn-tour-shot { width: 100%; }
.vn-tour-veil {
  position: absolute; inset: 0; z-index: 2; pointer-events: none;
  background: linear-gradient(180deg, rgba(16,18,22,.40) 0%, rgba(16,18,22,0) 34%, rgba(16,18,22,.24) 56%, rgba(16,18,22,.82) 100%);
  transition: opacity .55s cubic-bezier(.25,1,.5,1);
}
.vn-tour-plate:hover .vn-tour-veil { opacity: .88; }
.vn-tour-over {
  position: absolute; z-index: 3; left: calc(var(--u) * 16); right: calc(var(--u) * 16); bottom: calc(var(--u) * 15);
  display: flex; flex-direction: column; align-items: start;
}
.vn-tour-place {
  font-family: ${MONO}; font-size: 10px; letter-spacing: .16em; text-transform: uppercase;
  color: var(--vn-amber); margin-bottom: calc(var(--u) * 6);
}
.vn-tour-name { display: block; font-family: ${DISPLAY}; font-weight: 700; font-size: ${fluid(19, 16)}; line-height: 1.15; }
.vn-tour-cta {
  margin-top: calc(var(--u) * 12);
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 13px; border: 1px solid rgba(242, 241, 238, .5); border-radius: 999px;
  font-family: ${MONO}; font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
  transition: background-color .32s ease, color .32s ease, border-color .32s ease;
}
.vn-tour-cta span { transition: transform .32s cubic-bezier(.25,1,.5,1); }
.vn-tour-plate:hover .vn-tour-cta { background: #F2F1EE; border-color: #F2F1EE; color: ${NIGHT}; }
.vn-tour-plate:hover .vn-tour-cta span { transform: translateX(3px); }
/* The ghost keeps the plates' proportion so the row stays one rhythm. */
.vn-tour-ghost {
  aspect-ratio: 4 / 5; color: var(--vn-ink);
  transition: filter .5s ease, opacity .5s ease, transform .5s cubic-bezier(.25,1,.5,1);
  border: 1px dashed color-mix(in srgb, var(--vn-ink) 30%, transparent);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: calc(var(--u) * 8);
}
.vn-tour-ghost-plus { font-family: ${MONO}; font-size: ${fluid(22, 20)}; line-height: 1; color: var(--vn-mute); }
.vn-tour-ghost-note { margin: 0; font-family: ${MONO}; font-size: 11px; letter-spacing: .04em; color: var(--vn-mute); }
.vn-tours-foot { margin: calc(var(--u) * 26) 0 0; max-width: 62ch; font-size: ${fluid(13.5, 13)}; line-height: 1.6; color: var(--vn-mute); }

/* contact — the drawing plate with a live map */
.vn-contact {
  display: grid; grid-template-columns: 5fr 6fr; gap: calc(var(--u) * 88); align-items: start;
  max-width: calc(var(--u) * 1440); margin: 0 auto;
  padding: calc(var(--u) * 40) calc(var(--u) * 48) calc(var(--u) * 150);
}
.vn-contact-list { margin: calc(var(--u) * 36) 0 0; display: grid; gap: calc(var(--u) * 18); }
.vn-contact-list div { display: grid; grid-template-columns: calc(var(--u) * 150) 1fr; gap: calc(var(--u) * 16); align-items: baseline; }
.vn-contact-list dt { font-family: ${MONO}; font-size: ${fluid(11, 11)}; letter-spacing: .12em; text-transform: uppercase; color: var(--vn-mute); }
.vn-contact-list dd { margin: 0; font-size: ${fluid(16, 15)}; line-height: 1.55; }
.vn-contact-map { border: 1px solid var(--vn-hair); border-radius: 2px; padding: calc(var(--u) * 14); background: color-mix(in srgb, var(--vn-ink) 4%, var(--vn-c)); }
.vn-contact-map iframe { display: block; width: 100%; aspect-ratio: 4 / 3; border: 0; filter: grayscale(1) contrast(1.02); }
.vn-map-cap { margin: calc(var(--u) * 12) 0 0; font-family: ${MONO}; font-size: ${fluid(11, 11)}; color: var(--vn-mute); letter-spacing: .04em; }

/* footer — the night close */
.vn-foot { background: var(--vn-night); color: #F2F1EE; }
.vn-foot-hero {
  max-width: calc(var(--u) * 1440); margin: 0 auto;
  padding: calc(var(--u) * 96) calc(var(--u) * 48) calc(var(--u) * 64);
  display: flex; flex-direction: column; align-items: flex-start; gap: calc(var(--u) * 22);
}
.vn-logo-mark-big { width: calc(var(--u) * 64); height: calc(var(--u) * 44); }
.vn-foot-wordmark {
  margin: 0; font-family: ${DISPLAY}; font-weight: 700; line-height: .96;
  font-size: clamp(44px, calc(var(--u) * 124), 142px); letter-spacing: .015em;
}
.vn-foot-hero .vn-cta { margin-top: calc(var(--u) * 10); }
.vn-foot-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 44);
  max-width: calc(var(--u) * 1440); margin: 0 auto;
  padding: calc(var(--u) * 44) calc(var(--u) * 48) calc(var(--u) * 52);
  border-top: 1px solid rgba(242, 241, 238, .14);
}
.vn-foot-label {
  margin: 0 0 calc(var(--u) * 14); font-family: ${MONO}; font-size: ${fluid(11, 11)};
  letter-spacing: .14em; text-transform: uppercase; color: var(--vn-amber);
}
.vn-foot-line { font-size: ${fluid(13.5, 14)}; line-height: 1.65; color: rgba(242, 241, 238, .66); margin: 0 0 calc(var(--u) * 6); }
.vn-foot-a { color: rgba(242, 241, 238, .84); text-decoration: none; }
.vn-foot-a:hover { color: #FFFFFF; }
.vn-foot-base {
  max-width: calc(var(--u) * 1440); margin: 0 auto;
  padding: calc(var(--u) * 20) calc(var(--u) * 48) calc(var(--u) * 34);
  border-top: 1px solid rgba(242, 241, 238, .1);
  display: flex; justify-content: space-between; align-items: baseline; gap: 20px; flex-wrap: wrap;
}
.vn-foot-base .vn-foot-line { margin: 0; }
.vn-foot-sndr { font-size: ${fluid(12.5, 13)}; }

/* ── responsive ── */
@media (max-width: 991px) {
  .vn-nav { padding: 10px 12px 10px 20px; gap: 16px; }
  .vn-nav-mark, .vn-nav-links a { display: inline-flex; align-items: center; min-height: 44px; }
  .vn-nav-links { display: none; }
  /* Book now moves INTO the sheet on a phone, so the header carries the
     wordmark and one control instead of two competing ones. */
  .vn-nav-cta { display: none; }
  .vn-burger { display: block; }
  .vn-hero-block { padding: 0 20px 40px; }
  /* The corner window is 260px wide over a 375px hero, so at phone widths it
     sat straight on top of the intro copy. Narrow tablets get a smaller one;
     phones lose it entirely below, because a card squeezed next to the
     headline is worse than no card and the tour plates are one screen down. */
  .vn-hero-tours { right: 20px; bottom: calc(var(--u) * 30); width: calc(var(--u) * 200); }
  .vn-wordmark { font-size: clamp(28px, 10vw, 52px); }
  .vn-valley, .vn-rooms-explorer, .vn-welcome, .vn-book, .vn-drawing-inside {
    grid-template-columns: 1fr; gap: 40px;
  }
  .vn-valley, .vn-rooms, .vn-materials, .vn-welcome, .vn-book, .vn-drawing-copy, .vn-glow-row, .vn-elev-credit, .vn-drawing-inside {
    padding-left: 20px; padding-right: 20px;
  }
  .vn-mat-expand { height: calc(var(--u) * 340); }
  .vn-mq-card { width: 280px; }
  .vn-foot-hero { padding: 56px 20px 40px; }
  .vn-foot-base { padding-left: 20px; padding-right: 20px; }
  .vn-book-grid { grid-template-columns: 1fr; }
  .vn-gallery, .vn-tours { padding-left: 20px; padding-right: 20px; }
  .vn-gallery-grid { grid-template-columns: 1fr 1fr; }
  .vn-g-a, .vn-g-b, .vn-g-c, .vn-g-d, .vn-g-e { grid-column: auto; }
  .vn-g-f { grid-column: 1 / -1; }
  .vn-tours-grid { grid-template-columns: 1fr 1fr; }
  .vn-contact { grid-template-columns: 1fr; gap: 40px; padding-left: 20px; padding-right: 20px; }
  .vn-film-caps { left: 20px; bottom: 20px; }
  .vn-film-bleed { aspect-ratio: 16 / 10; }
  .vn-film-credit { padding: 0 20px; }
  /* one month at a time below the desktop column width: two would squeeze the
     cells under a usable tap target. The arrows still reach every month. */
  .vn-cal-months { grid-template-columns: 1fr; }
  .vn-cal-month + .vn-cal-month { display: none; }
  .vn-cal-day { min-height: 44px; }
  /* Stacked, the three glow frames read as three different sizes: two of them
     carry desktop width caps and all three crop differently. One width, one
     ratio, for all of them. */
  .vn-glow-row { grid-template-columns: 1fr; gap: 16px; }
  .vn-foot-grid { grid-template-columns: 1fr; gap: 24px; padding: 36px 20px; }
}

@media (max-width: 767px) {
  .vn-hero-tours { display: none; }
  .vn-rooms-index, .vn-rooms-pane { display: none; }
  .vn-rooms-acc { display: block; }
  .vn-rooms-acc-item + .vn-rooms-acc-item { margin-top: 10px; }
  .vn-rooms-acc-btn {
    display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
    width: 100%; text-align: left; font: inherit; cursor: pointer; min-height: 44px;
    background: none; border: 0; border-top: 1px solid var(--vn-hair); padding: 12px 4px;
  }
  .vn-rooms-acc-btn.is-open span:first-child { color: var(--vn-amber-text); font-weight: 500; }
  .vn-rooms-acc-fact { font-family: ${MONO}; font-size: 12px; color: var(--vn-mute); }
  .vn-rooms-acc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s ease; }
  .vn-rooms-acc-panel.is-open { grid-template-rows: 1fr; }
  .vn-rooms-acc-panel-in { overflow: hidden; }
  .vn-rooms-acc-panel-in > .vn-frame { margin-top: 12px; }
  .vn-rooms-acc-note { font-size: 13px; color: var(--vn-mute); margin: 10px 0 0; line-height: 1.5; }
  .vn-rooms-bath { flex-direction: column; align-items: flex-start; }
  .vn-rooms-bath-frame { width: 100%; }
  .vn-mat-expand { flex-direction: column; height: auto; }
  /* flex-basis:0% (from the base "flex: 1 1 0%") wins over "height" as the
     main-axis size in a COLUMN flex container, so an auto-height stack with
     only a height override collapses to 0 - override the whole shorthand
     with a real basis instead. */
  .vn-mat-panel { flex: 0 0 160px !important; }
  /* the dimension line loses its rules rather than its figures: three columns
     of real information beat five columns of squeezed hairline */
  .vn-cal-dim { grid-template-columns: 1fr auto 1fr; gap: 12px; }
  .vn-cal-dim-rule { display: none; }
  .vn-gallery-grid { grid-template-columns: 1fr; }
  .vn-contact-list div { grid-template-columns: 1fr; gap: 4px; }
}

/* reduced motion: everything renders visible statically */
/* preloader: a paper sheet wiped off the board, left to right */
.vn-loader {
  position: fixed; inset: 0; z-index: 60; background: ${PAPER};
  display: grid; place-content: center;
  clip-path: inset(0 0 0 0);
  transition: clip-path 1s cubic-bezier(.76, 0, .24, 1);
}
.vn-loader.is-leaving { clip-path: inset(0 0 0 100%); }
.vn-loader-mark {
  margin: 0; font-family: ${DISPLAY}; font-weight: 700; letter-spacing: .05em;
  font-size: clamp(30px, 7.2vw, 108px); white-space: nowrap; line-height: 1;
  background-image: linear-gradient(90deg, ${INK} 50%, rgba(23,24,26,.14) 50%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.vn-loader-pct {
  position: fixed; left: calc(var(--u) * 48); bottom: calc(var(--u) * 40);
  margin: 0; font-family: ${MONO}; font-size: 12px; letter-spacing: .16em;
  color: rgba(23,24,26,.5);
}

@media (prefers-reduced-motion: reduce) {
  .vn-root * { transition: none !important; animation: none !important; }
  .vn-word { transform: none !important; opacity: 1 !important; }
  .vn-wm-word { transform: none !important; opacity: 1 !important; }
  .vn-wm-rule { transform: none !important; opacity: .55 !important; }
  .vn-measure-text { opacity: 1 !important; transform: none !important; }
  .vn-elev-svg { opacity: .12; }
  .vn-elev-photo { opacity: 1; }
  .vn-elev-hatch { opacity: .3; }
  .vn-elev-line, .vn-elev-secondary, .vn-elev-mullions { stroke-dashoffset: 0 !important; }
  .vn-elev-cap-sketch { opacity: 0; }
  .vn-elev-cap-photo { opacity: 1; }
  .vn-frame-in { inset: 0; transform: none !important; }
  .vn-frame-in img {
    -webkit-mask-image: none !important; mask-image: none !important; filter: none !important;
  }
  /* framer-motion drives .vn-mat-panel's flex-grow from JS, not a CSS
     transition, so the blanket "transition: none" above cannot stop it -
     force every tile back to equal thirds and show every label at rest. */
  .vn-mat-panel { flex-grow: 1 !important; }
  .vn-mat-scrim { opacity: 1 !important; }
  .vn-mat-label { opacity: 1 !important; transform: none !important; }
}
`
