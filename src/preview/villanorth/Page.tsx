import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { motion } from 'framer-motion'
import { companyEntry } from './data'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setNoindex, setThemeColor } from '../../lib/preview'
import { demo, type DemoBooking } from './demoStore'
import {
  BATH_NOTE, FACTS, GLOW, GLOW_FILM, HOST, JSON_LD, MATERIALS, PHOTO, REVIEW_QUOTES, REVIEW_THEMES,
  ROOMS, VALLEY, WELCOME_RITUAL, srcSet, type Photo, type RoomEntry,
} from './content'

gsap.registerPlugin(ScrollTrigger)

const company = companyEntry

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

const BASE = import.meta.env.BASE_URL

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
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

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

      /* word-mask headline rises */
      root.querySelectorAll<HTMLElement>('[data-vn-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.vn-word')
        if (!words.length) return
        gsap.fromTo(
          words,
          { yPercent: 116, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 1.0, ease: 'expo.out', stagger: 0.06,
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
              pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
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

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => { drift(); lenis.raf(t * 1000) }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    drift()

    return () => {
      gsap.ticker.remove(tick)
      io.disconnect()
      cleanups.forEach((fn) => fn())
      ctx.revert()
      lenis.destroy()
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
      {text.split(' ').map((w, i, arr) => (
        <span key={i} aria-hidden="true">
          <span className="vn-line"><span className="vn-word">{w}</span></span>
          {i < arr.length - 1 ? ' ' : ''}
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
function Frame({ photo, className = '', priority = false, maxWidth, sizes, drift = 9 }: {
  photo: Photo; className?: string; priority?: boolean; maxWidth?: number; sizes?: string; drift?: number
}) {
  return (
    <figure
      className={`vn-frame vn-rv ${className}`}
      style={{ aspectRatio: photo.ratio, maxWidth: maxWidth ? `${maxWidth}px` : undefined }}
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

function BookingForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [nights, setNights] = useState(2)
  const [people, setPeople] = useState(7)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<DemoBooking | null>(null)

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !date) {
      setError('Name, email and an arrival date are needed to send a request.')
      return
    }
    setError(null)
    const b: DemoBooking = {
      id: `vn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: 'villanorth',
      date,
      endDate: plusDays(date, nights),
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
    return (
      <div className="vn-book-done" role="status">
        <p className="vn-book-done-title">Your request is on its way.</p>
        <p className="vn-book-done-body">
          {done.date} to {done.endDate}, {done.people} {done.people === 1 ? 'guest' : 'guests'}.
          Eyþór confirms each request personally. The price for your dates comes with his reply
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
        <label className="vn-field">
          <span className="vn-field-label">Arrival</span>
          <input type="date" name="arrival" autoComplete="off" min={minDate} value={date} required
            onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="vn-field">
          <span className="vn-field-label">Nights</span>
          <select name="nights" value={nights} onChange={(e) => setNights(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="vn-field">
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
          <span className="vn-field-label">Anything you would like Eyþór to know <span className="vn-optional">(optional)</span></span>
          <textarea rows={3} name="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      {error && <p className="vn-field-error" role="alert">{error}</p>}
      <button type="submit" className="vn-cta vn-cta-block">Enquire about your stay</button>
      <p className="vn-book-note">
        No payment today. Send your preferred dates and Eyþór replies with
        availability and the nightly price. Payment is settled on arrival.
      </p>
    </form>
  )
}

/* ── the page ──────────────────────────────────────────────────────────── */

export default function VillaNorthPage() {
  const [ready, setReady] = useState(false)
  const [activeRoom, setActiveRoom] = useState<string>(ROOMS[0].id)
  const [glowErrored, setGlowErrored] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const roomBtnRefs = useRef<Array<HTMLButtonElement | null>>([])
  const glowVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setThemeColor(PAPER)
    document.title = 'Villa North'
    setReady(true)
  }, [])
  useEffect(() => setNoindex(true), [])

  useMotion(ready)

  /* THE GLOW's film: a defensive nudge for Safari, which sometimes needs an
     explicit play() even with the autoplay attribute set. Never runs under
     reduced motion — the poster (the film's exact first frame) stands in. */
  useEffect(() => {
    const v = glowVideoRef.current
    if (!v || reduced()) return
    const tryPlay = () => { v.play()?.catch(() => {}) }
    v.addEventListener('canplay', tryPlay)
    v.addEventListener('loadeddata', tryPlay)
    return () => {
      v.removeEventListener('canplay', tryPlay)
      v.removeEventListener('loadeddata', tryPlay)
    }
  }, [])

  const [loading, setLoading] = useState(shouldShowLoader)

  const activeRoomData: RoomEntry = ROOMS.find((r) => r.id === activeRoom) ?? ROOMS[0]

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

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
        <a className="vn-nav-mark" href="#top" onClick={anchor('top')}>VILLA&nbsp;NORTH</a>
        <nav className="vn-nav-links" aria-label="Page">
          <a href="#drawing" onClick={anchor('drawing')}>The house</a>
          <a href="#rooms" onClick={anchor('rooms')}>Rooms</a>
          <a href="#guests" onClick={anchor('guests')}>Guests</a>
        </nav>
        <a className="vn-nav-cta" href="#booking" onClick={anchor('booking')}>Enquire about your stay</a>
      </header>

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
          <a className="vn-cta" href="#booking" onClick={anchor('booking')}>Enquire about your stay</a>
        </div>
      </section>

      {/* 02 · the drawing */}
      <section className="vn-drawing" id="drawing">
        <div className="vn-drawing-copy">
          <Headline text="Every angle, decided first." size={64} floor={32} measure={600} />
          <p className="vn-body vn-rv">
            Eyþór trained as an engineer, and every line feels intentional: an
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
          Traced to the pixel from this exact photograph, Eyþór's own: the roofline, both
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

      {/* 04 · rooms to measure */}
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
        <div className="vn-glow-row">
          <Frame photo={PHOTO.wineGlasses} className="vn-glow-wine" drift={9} />
          <div className="vn-glow-tub-col">
            <Frame photo={PHOTO.tubNightSmall} className="vn-glow-tub" maxWidth={240} sizes="240px" drift={6} />
            <p className="vn-glow-fact">{GLOW.auroraFact}</p>
          </div>
          <Frame photo={PHOTO.winterRiver} className="vn-glow-river" maxWidth={420} sizes="420px" drift={7} />
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

      {/* 08 · guests */}
      <section className="vn-guests" id="guests">
        <Headline text="What guests keep saying." size={64} floor={32} measure={620} />
        <p className="vn-guests-meta vn-rv">
          {HOST.rating.toFixed(1)} of 5 across {HOST.reviewCount} reviews · {HOST.badges.join(' · ')}
        </p>
        <ul className="vn-quotes">
          {REVIEW_QUOTES.map((q) => (
            <li key={q.author} className="vn-quote vn-rv">
              <blockquote><p>{'“'}{q.quote}{'”'}</p></blockquote>
              <p className="vn-quote-by">{q.author}, {q.when}</p>
            </li>
          ))}
        </ul>
        <dl className="vn-themes vn-rv" aria-label="What reviews mention most">
          {REVIEW_THEMES.map((t) => (
            <div key={t.theme}><dt>{t.theme}</dt><dd>{t.mentions}</dd></div>
          ))}
        </dl>
        <p className="vn-stat vn-rv">Counts from the listing's own review index, August 2026.</p>
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
      <footer className="vn-foot">
        <div className="vn-foot-grid">
          <div>
            <p className="vn-foot-mark">VILLA NORTH</p>
            <p className="vn-foot-line">Fnjóskadalur valley, Þingeyjarsveit, North Iceland</p>
            <p className="vn-foot-line">
              Host: {HOST.name}, Superhost, {HOST.yearsHosting} years hosting. {HOST.profession}.
            </p>
          </div>
          <div>
            <p className="vn-foot-line">Check-in: {FACTS.checkIn}</p>
            <p className="vn-foot-line">Check-out: {FACTS.checkOut}</p>
            <p className="vn-foot-line">
              Guests {FACTS.guests} · {FACTS.bedrooms} bedrooms · {FACTS.beds} beds · {FACTS.baths} bathrooms
            </p>
          </div>
          <div>
            <p className="vn-foot-line">
              Practical to know: the washer and dryer are outside the main house.
              {' '}{FACTS.security}. {FACTS.water}.
            </p>
            <p className="vn-foot-line">
              Photography throughout this prototype comes directly from Eyþór's Airbnb
              listing, retrieved August 2026.
            </p>
            <p className="vn-foot-line">{GLOW.filmCredit}</p>
            <p className="vn-foot-line">
              A private design prototype by SNDR. Booking requests stay a local
              demonstration in this browser and are never submitted.
            </p>
          </div>
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
.vn-line {
  display: inline-block; overflow: hidden; vertical-align: bottom;
  padding: .2em .04em .12em; margin: -.2em -.04em -.12em;
}
.vn-word { display: inline-block; }
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
.vn-frame { position: relative; overflow: hidden; margin: 0; background: color-mix(in srgb, var(--vn-ink) 6%, transparent); }
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
  display: grid; grid-template-columns: 2fr 1fr 1fr; gap: calc(var(--u) * 24); align-items: start;
  max-width: calc(var(--u) * 1440); margin: calc(var(--u) * 48) auto 0; padding: 0 calc(var(--u) * 48);
}
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
.vn-quotes { list-style: none; margin: calc(var(--u) * 64) 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 48); }
.vn-quote blockquote { margin: 0; }
.vn-quote blockquote p { margin: 0; font-size: ${fluid(20, 16)}; line-height: 1.45; font-weight: 400; }
.vn-quote-by { font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--vn-mute); margin: calc(var(--u) * 16) 0 0; }
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

/* footer */
.vn-foot { border-top: 1px solid var(--vn-hair); }
.vn-foot-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 44);
  max-width: calc(var(--u) * 1440); margin: 0 auto; padding: calc(var(--u) * 52) calc(var(--u) * 48) calc(var(--u) * 68);
}
.vn-foot-mark { font-family: ${DISPLAY}; font-weight: 700; letter-spacing: .06em; font-size: ${fluid(14, 15)}; margin: 0 0 calc(var(--u) * 12); }
.vn-foot-line { font-size: ${fluid(13, 15)}; line-height: 1.6; color: var(--vn-mute); margin: 0 0 calc(var(--u) * 8); }

/* ── responsive ── */
@media (max-width: 991px) {
  .vn-nav { padding: 10px 20px; gap: 16px; }
  .vn-nav-mark, .vn-nav-cta, .vn-nav-links a { display: inline-flex; align-items: center; min-height: 44px; }
  .vn-nav-links { display: none; }
  .vn-hero-block { padding: 0 20px 40px; }
  .vn-wordmark { font-size: clamp(28px, 10vw, 52px); }
  .vn-valley, .vn-rooms-explorer, .vn-welcome, .vn-book, .vn-drawing-inside {
    grid-template-columns: 1fr; gap: 40px;
  }
  .vn-valley, .vn-rooms, .vn-materials, .vn-welcome, .vn-book, .vn-drawing-copy, .vn-glow-row, .vn-elev-credit, .vn-drawing-inside {
    padding-left: 20px; padding-right: 20px;
  }
  .vn-mat-expand { height: calc(var(--u) * 340); }
  .vn-quotes { grid-template-columns: 1fr; gap: 32px; }
  .vn-book-grid { grid-template-columns: 1fr; }
  .vn-glow-row { grid-template-columns: 1fr; }
  .vn-foot-grid { grid-template-columns: 1fr; gap: 24px; padding: 36px 20px; }
}

@media (max-width: 767px) {
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
