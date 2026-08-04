import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { demo, type DemoBooking } from './demoStore'
import {
  FACTS, HOST, JSON_LD, LOCAL_AREA, PHOTO, REVIEW_QUOTES, REVIEW_THEMES, SCRUB,
} from './content'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('mirrorhouse')

/* ── MIRROR HOUSE · "EIN NÓTT" ─────────────────────────────────────────────
   One page, one night. The canvas begins in daylight ice and ends in aurora
   night: a single scroll-driven palette lerp (Búðir sky-scrub lineage, new
   palette, new arc), Icelandic day-phase labels carrying the structure, and a
   pinned climax where scroll passes the real cabin from day into aurora
   (two of her own photographs; a Kling interpolation slots in later via
   SCRUB.videoSrc). Full spec: ./DESIGN.md.

   THE FLUID UNIT IS SCOPED, NOT GLOBAL: everything scales off --u on this
   page's root only ([[no-style-bleed-between-designs]]).

   ICELANDIC GLYPHS: display leading never below 1.12 with .2em mask headroom,
   or the acutes and descenders (Í Á ð þ g) clip (ledger #23, Búðir §9.3).

   Motion identity (one per site): "condensation clearing". Images arrive by
   mask-sweep + blur/saturate resolve, then drift inside fixed frames
   (Heklusýn spec: derived --dz, batched reads before writes). Text rises
   through word masks. The reflection device appears ONCE, under the hero
   wordmark. ─────────────────────────────────────────────────────────────── */

const ICE = '#E9EFF3'
const BASALT = '#0A121B'
const ROCK = '#37424E'
const AURORA = '#57BE8C'

const DISPLAY = "'Switzer', system-ui, sans-serif"
const MONO = "'Fragment Mono', ui-monospace, monospace"

const BASE = import.meta.env.BASE_URL

/** Palette stops for the master scrub. soft = elevated surface. */
const STOPS = [
  { at: 0.0, c: '#E9EFF3', ink: '#37424E', soft: '#DDE6EC' },
  { at: 0.32, c: '#E9EFF3', ink: '#37424E', soft: '#DDE6EC' },
  { at: 0.5, c: '#B9C7D2', ink: '#26313C', soft: '#AFBFCC' },
  { at: 0.62, c: '#2A3849', ink: '#DFE7ED', soft: '#33445A' },
  { at: 0.74, c: '#0A121B', ink: '#EDF2F5', soft: '#111C28' },
  { at: 1.0, c: '#0A121B', ink: '#EDF2F5', soft: '#111C28' },
]

const hex2rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mixHex = (a: string, b: string, t: number) => {
  const A = hex2rgb(a), Bc = hex2rgb(b)
  return `rgb(${A.map((v, i) => Math.round(v + (Bc[i] - v) * t)).join(',')})`
}
const paletteAt = (p: number) => {
  let i = 0
  while (i < STOPS.length - 2 && p > STOPS[i + 1].at) i++
  const a = STOPS[i], b = STOPS[i + 1]
  const t = Math.max(0, Math.min(1, (p - a.at) / (b.at - a.at || 1)))
  return { c: mixHex(a.c, b.c, t), ink: mixHex(a.ink, b.ink, t), soft: mixHex(a.soft, b.soft, t) }
}

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/** Pin + full choreography only where it earns itself. This is deliberately a
    LOWER threshold than the 991px layout breakpoint: the grids need a wide
    canvas, but the night scrub only needs a screen tall enough to pin, and
    gating it at 992 hid the film from every tablet and every desktop window
    narrower than that. */
const cinematic = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 768px)').matches &&
  !reduced()

/** Fluid size with a phone floor: --u pins small on narrow viewports. */
const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/* ── motion engine: one Lenis clock drives drift + reveals + palette ───── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const root = document.querySelector<HTMLElement>('.mh-root')
    if (!root) return

    if (reduced()) {
      root.classList.add('mh-static')
      // resting state is the visible one; only the palette needs a value
      const { c, ink, soft } = paletteAt(0)
      root.style.setProperty('--mh-c', c)
      root.style.setProperty('--mh-ink', ink)
      root.style.setProperty('--mh-soft', soft)
      return
    }

    root.classList.add('mh-js')
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    /* drift: Heklusýn spec, batched reads then writes, off-screen skipped */
    const frames = Array.from(root.querySelectorAll<HTMLElement>('.mh-frame-in'))
    const drift = () => {
      const vh = window.innerHeight
      const writes: [HTMLElement, string][] = []
      for (const el of frames) {
        const box = el.parentElement
        if (!box) continue
        const r = box.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const d = Number(el.dataset.drift || 9)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * d).toFixed(2)}%,0)`])
      }
      for (const [el, t] of writes) el.style.transform = t
    }

    /* palette: ONE writer for the whole world. The .mh-night class rides
       along so native form controls flip their color-scheme with the sky. */
    const applyPalette = (p: number) => {
      const { c, ink, soft } = paletteAt(p)
      root.style.setProperty('--mh-c', c)
      root.style.setProperty('--mh-ink', ink)
      root.style.setProperty('--mh-soft', soft)
      const night = p > 0.58
      if (root.classList.contains('mh-night') !== night) {
        root.classList.toggle('mh-night', night)
        setThemeColor(night ? BASALT : ICE)
      }
    }
    applyPalette(0)

    /* condensation-clear: IO arms a class once; CSS owns the transition
       ([[framer-reveals-unreliable]] - CSS transitions, not mount state) */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.22 },
    )
    root.querySelectorAll('.mh-rv').forEach((el) => io.observe(el))

    const cleanups: Array<() => void> = []
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        onUpdate: (self) => applyPalette(self.progress),
        invalidateOnRefresh: true,
      })

      /* THE WORDMARK — the mirror line.
         A hairline rule stands where the two words meet. It draws itself
         first, then MIRROR opens leftward out of it and HOUSE rightward, as
         if the name were being pulled apart from its own reflection. Reveal
         is clip-path only, so nothing moves that should not.
         Then the scroll takes over the same gesture: the two halves keep
         parting, the rule grows past them, and the lockup dissolves into the
         landscape it was standing on. Transform + clip only, both cheap. */
      const seam = root.querySelector<HTMLElement>('.mh-wm-seam')
      const wmL = root.querySelector<HTMLElement>('.mh-wm-mirror')
      const wmR = root.querySelector<HTMLElement>('.mh-wm-house')
      const heroEl = root.querySelector<HTMLElement>('.mh-hero')

      if (seam && wmL && wmR && heroEl) {
        gsap.set(seam, { scaleY: 0 })
        gsap.set(wmL, { clipPath: 'inset(0% 0% 0% 100%)' })
        gsap.set(wmR, { clipPath: 'inset(0% 100% 0% 0%)' })

        const openFromTheLine = () => {
          gsap.timeline()
            .to(seam, { scaleY: 1, duration: 0.85, ease: 'expo.out' })
            .to(
              [wmL, wmR],
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out' },
              '-=0.42',
            )
            .from(
              [wmL, wmR],
              // a breath of outward travel under the wipe, so the words feel
              // pushed out of the line rather than merely uncovered
              { x: (i: number) => (i === 0 ? 26 : -26), duration: 1.5, ease: 'expo.out' },
              '<',
            )
        }

        // wait for the sheet to lift; the loader owns the first moment
        if (document.querySelector('.mh-loader')) {
          window.addEventListener('mh:revealed', openFromTheLine, { once: true })
        } else {
          gsap.delayedCall(0.12, openFromTheLine)
        }

        const driveOn = { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 0.6 }
        gsap.to(wmL, { xPercent: -14, opacity: 0.08, ease: 'none', scrollTrigger: driveOn })
        gsap.to(wmR, { xPercent: 14, opacity: 0.08, ease: 'none', scrollTrigger: driveOn })
        gsap.to(seam, { scaleY: 3.4, opacity: 0, ease: 'none', scrollTrigger: driveOn })
      }

      // word-mask rises
      root.querySelectorAll<HTMLElement>('[data-mh-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.mh-word')
        if (!words.length) return
        gsap.fromTo(
          words,
          { yPercent: 116, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            duration: 1.05, ease: 'expo.out', stagger: 0.07,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          },
        )
      })

      // the night scrub: pinned on desktop, plain trigger elsewhere
      const scrubWrap = root.querySelector<HTMLElement>('.mh-scrub')
      const dayLayer = root.querySelector<HTMLElement>('.mh-scrub-day img')
      const capDay = root.querySelector<HTMLElement>('.mh-scrub-cap-day')
      const capNight = root.querySelector<HTMLElement>('.mh-scrub-cap-night')
      /* THE FILM.
         A pre-decoded frame sequence drawn to a canvas, NOT a <video> driven
         by currentTime. Every currentTime assignment is a decoder seek, and
         measured on this clip only ~104 of 241 frames ever reached the screen
         (an effective 13fps) even all-intra. Blitting an already-decoded
         Image has no seek at all, so the film tracks the scroll exactly.

         Frames load lazily, starting one section early, so the hero never
         competes with them for bandwidth. Until they arrive the daylight
         still simply stays up. */
      const canvas = root.querySelector<HTMLCanvasElement>('.mh-scrub-canvas')
      const ctx = canvas?.getContext('2d', { alpha: false }) ?? null
      const shots: (HTMLImageElement | null)[] = new Array(SCRUB.frameCount).fill(null)
      let shown = -1

      const paint = (idx: number) => {
        if (!canvas || !ctx) return
        // nearest frame we actually hold, so a partial load still animates
        let i = idx
        if (!shots[i]) {
          let lo = i, hi = i
          while (lo >= 0 || hi < shots.length) {
            if (lo >= 0 && shots[lo]) { i = lo; break }
            if (hi < shots.length && shots[hi]) { i = hi; break }
            lo--; hi++
          }
        }
        const img = shots[i]
        if (!img || i === shown) return
        shown = i
        // exposed so the headless harness can assert which frame is on screen
        canvas.dataset.frame = String(i)
        const cw = canvas.width, ch = canvas.height
        const sc = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
        const w = img.naturalWidth * sc, h = img.naturalHeight * sc
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
      }

      const sizeCanvas = () => {
        if (!canvas) return
        // DPR capped at 1.5: a full-bleed 4K-ish blit per frame buys nothing
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
        canvas.width = Math.round(canvas.clientWidth * dpr)
        canvas.height = Math.round(canvas.clientHeight * dpr)
        shown = -1
        paint(Math.max(0, shown))
      }

      let framesStarted = false
      const loadFrames = () => {
        if (framesStarted) return
        framesStarted = true
        let next = 0
        const LANES = 6 // keep the pipe busy without starving the rest
        const pump = () => {
          if (next >= SCRUB.frameCount) return
          const idx = next++
          const im = new Image()
          im.decoding = 'async'
          im.onload = () => {
            shots[idx] = im
            if (idx === 0) { sizeCanvas(); paint(0) }
            pump()
          }
          im.onerror = pump
          im.src = SCRUB.frameSrc(idx)
        }
        for (let l = 0; l < LANES; l++) pump()
      }

      if (scrubWrap && dayLayer && canvas && cinematic()) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scrubWrap,
            start: 'top top',
            end: '+=300%',
            pin: true,
            // Lenis already eases the scroll itself; a second smoothing pass
            // here is what makes the picture trail the page. Map 1:1 and let
            // Lenis own the feel.
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              paint(Math.min(SCRUB.frameCount - 1,
                Math.round(self.progress * (SCRUB.frameCount - 1))))
            },
          },
        })
        gsap.fromTo(dayLayer, { scale: 1 }, {
          scale: 1.06, ease: 'none', duration: 1,
          scrollTrigger: { trigger: scrubWrap, start: 'top top', end: '+=300%', scrub: true },
        })

        // begin decoding a full screen ahead of the pin
        ScrollTrigger.create({ trigger: scrubWrap, start: 'top bottom+=100%', once: true, onEnter: loadFrames })
        sizeCanvas()
        window.addEventListener('resize', sizeCanvas, { passive: true })
        cleanups.push(() => window.removeEventListener('resize', sizeCanvas))
        if (capDay && capNight) {
          // hand over early enough that the middle of the pin is never captionless
          tl.to(capDay, { opacity: 0, duration: 0.12 }, 0.18)
            .fromTo(capNight, { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.4)
        }
      }
    }, root)

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => { lenis.raf(t * 1000); drift() }
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
      data-mh-headline
      aria-label={text}
      className={`mh-headline ${className}`}
      style={{
        fontSize: fluid(size, floor),
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      }}
    >
      {text.split(' ').map((w, i, arr) => (
        <span key={i} aria-hidden="true">
          <span className="mh-line"><span className="mh-word">{w}</span></span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** Day-phase label: the page's only recurring structural device. */
function Phase({ is, en }: { is: string; en: string }) {
  return (
    <p className="mh-phase">
      <span className="mh-phase-is">{is}</span>
      <span aria-hidden="true"> · </span>
      <span>{en}</span>
    </p>
  )
}

/**
 * A photograph that drifts inside a fixed frame and arrives by clearing,
 * like condensation wiped off glass. Inset derives from drift so the image
 * can never run out of overhang (Heklusýn rule).
 */
function Frame({ photo, drift = 9, priority = false, className = '' }: {
  photo: { src: string; alt: string; ratio: string }
  drift?: number; priority?: boolean; className?: string
}) {
  return (
    <figure className={`mh-frame mh-rv ${className}`} style={{ aspectRatio: photo.ratio }}>
      <div
        className="mh-frame-in"
        data-drift={drift}
        style={{ '--dz': `${Math.max(9, drift * 1.35)}%` } as React.CSSProperties}
      >
        <img src={photo.src} alt={photo.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </div>
    </figure>
  )
}

/* ── booking form ──────────────────────────────────────────────────────── */

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
  const [nights, setNights] = useState(1)
  const [people, setPeople] = useState(2)
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
      id: `mh-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: 'mirrorhouse',
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
      <div className="mh-book-done" role="status">
        <p className="mh-book-done-title">Request sent.</p>
        <p className="mh-book-done-body">
          {done.date} to {done.endDate}, {done.people} {done.people === 1 ? 'guest' : 'guests'}.
          Ingibjörg confirms each request personally. The price for your dates comes with her reply
          to {done.customer.email}.
        </p>
        <p className="mh-book-note">
          This is a prototype. The request lives only in this browser.{' '}
          <Link className="mh-a" to="/preview/mirrorhouse/stjornbord">See the owner's side</Link>{' '}
          to watch it arrive.
        </p>
        <button type="button" className="mh-ghost" onClick={() => setDone(null)}>
          Make another request
        </button>
      </div>
    )
  }

  return (
    <form className="mh-book-form" onSubmit={submit} noValidate>
      <div className="mh-book-grid">
        <label className="mh-field">
          <span className="mh-field-label">Arrival</span>
          <input type="date" name="arrival" min={minDate} value={date} required
            onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="mh-field">
          <span className="mh-field-label">Nights</span>
          <select name="nights" value={nights} onChange={(e) => setNights(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="mh-field">
          <span className="mh-field-label">Guests</span>
          <select name="guests" value={people} onChange={(e) => setPeople(Number(e.target.value))}>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </label>
        <label className="mh-field mh-field-wide">
          <span className="mh-field-label">Name</span>
          <input type="text" name="name" autoComplete="name" value={name} required
            onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="mh-field mh-field-wide">
          <span className="mh-field-label">Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" value={email} required
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="mh-field mh-field-wide">
          <span className="mh-field-label">Phone <span className="mh-optional">(optional)</span></span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="mh-field mh-field-wide">
          <span className="mh-field-label">Anything Ingibjörg should know <span className="mh-optional">(optional)</span></span>
          <textarea rows={3} name="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      {error && <p className="mh-field-error" role="alert">{error}</p>}
      <button type="submit" className="mh-cta">Request to book</button>
      <p className="mh-book-note">
        No card, no charge. The guest asks, the owner confirms, and payment is
        settled on arrival. The nightly price for your dates comes with the reply.
      </p>
    </form>
  )
}

/* ── preloader ─────────────────────────────────────────────────────────────
   Heklusýn spec: counts REAL loading (hero image decode + fonts.ready), never
   a fake timer. 1.1s floor (a warm cache would otherwise flash it for one
   tick), 2.4s hard cap. Once per session; ?loader forces it for review; never
   mounts under reduced motion. Wordmark fill: a hard two-stop gradient at
   background-size 200%, position driven by (100 - pct) so it is exactly solid
   at 100. */

const shouldShowLoader = () => {
  if (typeof window === 'undefined' || reduced()) return false
  if (new URLSearchParams(window.location.search).has('loader')) return true
  try { return !sessionStorage.getItem('mh_seen') } catch { return true }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('mh_seen', '1') } catch { /* private mode */ }
    const t0 = performance.now()
    let raf = 0
    let shown = 0
    const hero = document.querySelector<HTMLImageElement>('.mh-hero-media img')
    let target = 0
    let heroDone = hero ? hero.complete : true
    let fontsDone = false
    if (hero && !heroDone) {
      hero.addEventListener('load', () => { heroDone = true }, { once: true })
      hero.addEventListener('error', () => { heroDone = true }, { once: true })
    }
    document.fonts.ready.then(() => { fontsDone = true })

    const FLOOR = 1100, CAP = 2400
    const tick = () => {
      const t = performance.now() - t0
      target = ((heroDone ? 55 : Math.min(50, t / 24)) + (fontsDone ? 45 : 0))
      if (t >= CAP) target = 100
      // presentation lerp toward the real target; the data is real, the ease is ours
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
    <div className={`mh-loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <p
        className="mh-loader-mark"
        style={{ backgroundPositionX: `${100 - pct}%` }}
      >
        MIRROR HOUSE
      </p>
      <p className="mh-loader-pct">{pct}%</p>
    </div>
  )
}

/* ── the page ──────────────────────────────────────────────────────────── */

export default function MirrorHousePage() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(shouldShowLoader)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThemeColor(ICE)
    document.title = 'Mirror House Iceland'
    setReady(true)
  }, [])

  useMotion(ready)

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div ref={rootRef} className="mh-root">
      <style>{CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      {loading && <Preloader onDone={() => { setLoading(false); window.dispatchEvent(new Event('mh:revealed')) }} />}

      {/* nav */}
      <header className="mh-nav">
        <a className="mh-nav-mark" href="#top" onClick={anchor('top')}>MIRROR&nbsp;HOUSE</a>
        <nav className="mh-nav-links" aria-label="Page">
          <a href="#husid" onClick={anchor('husid')}>The house</a>
          <a href="#nottin" onClick={anchor('nottin')}>The night</a>
          <a href="#gestir" onClick={anchor('gestir')}>Guests</a>
        </nav>
        <a className="mh-nav-cta" href="#boka" onClick={anchor('boka')}>Request to book</a>
      </header>

      {/* 01 · hero (day) */}
      <section className="mh-hero" id="top">
        {/* The hero is a Heklusyn frame: the photograph drifts inside a box
            that never moves, so the landscape slides behind the type instead
            of scrolling with the page. Same engine and the same --dz rule as
            every other frame here; full-bleed band, so drift 13. */}
        <div className="mh-hero-media mh-rv">
          <div className="mh-frame-in" data-drift={13}
            style={{ '--dz': `${(13 * 1.35).toFixed(2)}%` } as React.CSSProperties}>
            <img src={PHOTO.arrivalWide.src} alt={PHOTO.arrivalWide.alt} loading="eager"
              decoding="async" />
          </div>
        </div>
        {/* A hairline stands where the two words meet: MIRROR opens out of it
            to the left, HOUSE to the right. The line is the mirror edge. */}
        <h1 className="mh-wordmark" aria-label="Mirror House Iceland">
          <span className="mh-wm-word mh-wm-mirror" aria-hidden="true">MIRROR</span>
          <span className="mh-wm-seam" aria-hidden="true" />
          <span className="mh-wm-word mh-wm-house" aria-hidden="true">HOUSE</span>
        </h1>
        <div className="mh-hero-block">
          <p className="mh-hero-sub">
            A one of a kind mirror glass cabin under the cliffs of Borgarbyggð.
            Sleeps two, an hour from Reykjavík.
          </p>
          <a className="mh-hero-link" href="#boka" onClick={anchor('boka')}>Request to book</a>
        </div>
      </section>

      {/* 02 · manifesto */}
      <section className="mh-manifesto" id="husid">
        <div className="mh-manifesto-copy">
          <Headline text="Built to disappear." size={92} floor={40} measure={620} />
          <p className="mh-body mh-rv">
            The shell is mirror glass. It holds the cliff, the grass and whatever
            the sky is doing, and gives the landscape back to itself. Inside there
            is floor heating, a double bed, and the view through every pane.
          </p>
        </div>
        <Frame photo={PHOTO.mirrorEdge} drift={9} className="mh-manifesto-fig" />
      </section>

      {/* 03 · arrival */}
      <section className="mh-arrival">
        <div className="mh-arrival-copy">
          <Phase is="Síðdegi" en="Afternoon" />
          <Headline text="The road ends at a lockbox." size={64} floor={32} measure={560} />
          <p className="mh-body mh-rv">
            A good main road runs almost to the door; the last few metres are
            gravel, with parking just below the hill. Check-in is after 3 PM,
            with your own code. No reception, no queue, and no one else around.
          </p>
          <dl className="mh-facts mh-rv">
            <div><dt>Check-in</dt><dd>{FACTS.checkIn}</dd></div>
            <div><dt>Check-out</dt><dd>{FACTS.checkOut}</dd></div>
            <div><dt>Winter</dt><dd>A 4x4 is recommended</dd></div>
          </dl>
        </div>
        <div className="mh-arrival-figs">
          <Frame photo={PHOTO.heroSymmetrical} drift={9} />
          <Frame photo={PHOTO.door} drift={7} className="mh-arrival-door" />
        </div>
      </section>

      {/* 04 · interior */}
      <section className="mh-interior">
        <Frame photo={PHOTO.bedGlassRoof} drift={12} className="mh-interior-hero" />
        <div className="mh-interior-row">
          <div className="mh-interior-copy">
            <Headline text="Glass on three sides, and above the bed." size={56} floor={30} measure={520} />
            <p className="mh-body mh-rv">
              The double bed faces the panorama, the floor is heated, and the
              kitchenette makes a slow morning easy. When the weather turns, the
              house is the best seat for it.
            </p>
          </div>
          <Frame photo={PHOTO.interiorTable} drift={8} className="mh-interior-side" />
        </div>
      </section>

      {/* 05 · evening, hot tub */}
      <section className="mh-evening">
        <div className="mh-evening-head">
          <Phase is="Kvöld" en="Evening" />
          <Headline text="The water is already hot." size={64} floor={32} measure={560} />
        </div>
        <Frame photo={PHOTO.hotTubWide} drift={12} className="mh-evening-bleed" />
        <div className="mh-evening-foot">
          <p className="mh-body mh-rv">
            The private hot tub sits on the deck, open all year, day and night.
          </p>
          <p className="mh-stat mh-rv">116 of 412 reviews mention it</p>
        </div>
      </section>

      {/* 06 · the night scrub */}
      <section className="mh-scrub" id="nottin">
        <div className="mh-scrub-inner">
          <div className="mh-scrub-day">
            <img src={SCRUB.day.src} alt={SCRUB.day.alt} loading="lazy" decoding="async" />
          </div>
          <canvas className="mh-scrub-canvas" aria-hidden="true" />
          <div className="mh-scrub-caps">
            <Phase is="Nótt" en="Night" />
            <div className="mh-scrub-captext">
              <p className="mh-scrub-cap mh-scrub-cap-day">Stay one night.</p>
              <p className="mh-scrub-cap mh-scrub-cap-night">
                In winter, the lights come down to the glass.
              </p>
            </div>
          </div>
        </div>
        {/* static / mobile fallback: the aurora photo simply follows */}
        <figure className="mh-scrub-fallback">
          <img src={SCRUB.night.src} alt={SCRUB.night.alt} loading="lazy" decoding="async" />
          <figcaption className="mh-stat">
            Both photographs are of this cabin, from Ingibjörg's own listing.
          </figcaption>
        </figure>
      </section>

      {/* 07 · guests */}
      <section className="mh-guests" id="gestir">
        <Headline text="What guests keep saying." size={64} floor={32} measure={620} />
        <p className="mh-guests-meta mh-rv">
          {HOST.rating} of 5 across {HOST.reviewCount} reviews · Superhost ·{' '}
          {HOST.yearsHosting} years hosting
        </p>
        <ul className="mh-quotes">
          {REVIEW_QUOTES.map((q) => (
            <li key={q.author} className="mh-quote mh-rv">
              <blockquote>
                <p>{'“'}{q.quote}{'”'}</p>
              </blockquote>
              <p className="mh-quote-by">{q.author}, {q.when}</p>
            </li>
          ))}
        </ul>
        <dl className="mh-themes mh-rv" aria-label="What reviews mention most">
          {REVIEW_THEMES.map((t) => (
            <div key={t.theme}><dt>{t.theme}</dt><dd>{t.mentions}</dd></div>
          ))}
        </dl>
        <p className="mh-stat mh-rv">
          Counts from the listing's own review index, August 2026.
        </p>
      </section>

      {/* 08 · the place */}
      <section className="mh-place">
        <div className="mh-place-copy">
          <Headline text="West Iceland, from a quiet hill." size={56} floor={30} measure={540} />
          <ul className="mh-place-list mh-rv">
            {LOCAL_AREA.map((p) => (
              <li key={p.name}>
                <span className="mh-place-name">{p.name}</span>
                <span className="mh-place-note">{p.note}</span>
                <span className="mh-place-dist">{p.dist}</span>
              </li>
            ))}
          </ul>
        </div>
        <Frame photo={PHOTO.autumnPortrait} drift={8} className="mh-place-fig" />
      </section>

      {/* 09 · booking */}
      <section className="mh-book" id="boka">
        <div className="mh-book-intro">
          <Headline text="Ask for your night." size={72} floor={34} measure={560} />
          <p className="mh-body mh-rv">
            Requests go straight to Ingibjörg, who has hosted this hill for ten
            years and answers within the hour.
          </p>
          <div className="mh-owner-note mh-rv">
            <p className="mh-owner-note-label">The owner's side</p>
            <p className="mh-owner-note-body">
              Every request lands in a dashboard built for this house: confirm or
              decline in one tap, watch the week fill up.{' '}
              <Link className="mh-a" to="/preview/mirrorhouse/stjornbord">
                Open the dashboard demo
              </Link>{' '}
              beside this tab and send yourself a request.
            </p>
          </div>
        </div>
        <BookingForm />
      </section>

      {/* page footer facts */}
      <footer className="mh-foot">
        <div className="mh-foot-grid">
          <div>
            <p className="mh-foot-mark">MIRROR HOUSE</p>
            <p className="mh-foot-line">Ytri-Skeljabrekka, Borgarbyggð, West Iceland</p>
          </div>
          <div>
            <p className="mh-foot-line">Licence nr. {HOST.licenceNr}</p>
            <p className="mh-foot-line">Guests: {FACTS.guests} · {FACTS.sleeps}</p>
          </div>
          <div>
            <p className="mh-foot-line">
              Photography: Ingibjörg's own listing photos, retrieved August 2026.
            </p>
            <p className="mh-foot-line">
              Prototype by SNDR. Booking requests here are a demo and stay in this browser.
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
@font-face { font-family: 'Switzer'; src: url('${BASE}fonts/switzer/Switzer-Extralight.woff2') format('woff2'); font-weight: 200; font-display: swap; }
@font-face { font-family: 'Switzer'; src: url('${BASE}fonts/switzer/Switzer-Light.woff2') format('woff2'); font-weight: 300; font-display: swap; }
@font-face { font-family: 'Switzer'; src: url('${BASE}fonts/switzer/Switzer-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Switzer'; src: url('${BASE}fonts/switzer/Switzer-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'Fragment Mono'; src: url('${BASE}fonts/fragment-mono/FragmentMono-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }

.mh-root {
  --u: clamp(.44px, 100vw / 1440, 1.15px);
  --mh-c: ${ICE};
  --mh-ink: ${ROCK};
  --mh-soft: #DDE6EC;
  --mh-aurora: ${AURORA};
  --mh-mute: color-mix(in srgb, var(--mh-ink) 64%, transparent);
  --mh-hair: color-mix(in srgb, var(--mh-ink) 17%, transparent);
  background: var(--mh-c);
  color: var(--mh-ink);
  font-family: ${DISPLAY};
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
.mh-root ::selection { background: var(--mh-aurora); color: ${BASALT}; }
.mh-root a { color: inherit; }
.mh-root :focus-visible {
  outline: 2px solid var(--mh-aurora);
  outline-offset: 2px;
  border-radius: 2px;
}
.mh-root a, .mh-root button, .mh-root input, .mh-root select, .mh-root textarea {
  touch-action: manipulation;
}
.mh-a:hover { color: var(--mh-aurora); }

/* nav: borderless, no fill, painted near-white under mix-blend difference —
   it inverts against whatever passes beneath it (bright sky -> dark ink, rock
   and night -> light), so it never needs a bar to stay legible */
.mh-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 40;
  display: flex; align-items: center; gap: calc(var(--u) * 40);
  padding: calc(var(--u) * 22) calc(var(--u) * 48);
  color: #F2F6F8;
  mix-blend-mode: difference;
}
.mh-nav-mark {
  font-weight: 300; letter-spacing: .22em; text-decoration: none;
  font-size: ${fluid(15, 12)};
}
.mh-nav-links { display: flex; gap: calc(var(--u) * 28); margin-left: auto; }
.mh-nav-links a {
  text-decoration: none; font-size: ${fluid(14, 12)}; color: inherit;
  opacity: .68; transition: opacity .25s ease;
}
.mh-nav-links a:hover { opacity: 1; }
.mh-nav-cta {
  text-decoration: none; font-size: ${fluid(14, 12)}; font-weight: 500;
  padding: calc(var(--u) * 10) calc(var(--u) * 18);
  border: 1px solid color-mix(in srgb, currentColor 38%, transparent);
  border-radius: 2px;
  transition: border-color .25s ease;
}
.mh-nav-cta:hover { border-color: currentColor; }

/* hero: the nav is FIXED and out of flow, so the image starts at true y=0 with
   no canvas strip above it. The wordmark sits dead centre and takes its hues
   from whatever each letter happens to cover — mix-blend difference over a
   gently desaturated photo (Búðir §6: the desat is what keeps the invert a
   controlled hue instead of psychedelic). */
.mh-hero { position: relative; min-height: 100svh; display: grid; }
/* The photograph lives in a fixed box and drifts inside it (Heklusyn):
   overflow hidden, an oversized inner wrapper, --dz derived from the drift
   so the image can never run out of overhang at the extremes of travel. */
.mh-hero-media { position: absolute; inset: 0; overflow: hidden; }
.mh-hero-media img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  filter: saturate(.78) contrast(1.02);
}
.mh-js .mh-hero-media:not(.is-in) img { filter: saturate(.55) blur(10px); }
.mh-hero-media::after {
  content: ''; position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(200deg, transparent 42%, rgba(10,18,27,.55) 100%);
}
/* MIRROR | HOUSE, parted by a hairline. The row is centred on the seam, so
   the two words are exactly mirrored about it. */
.mh-wordmark {
  position: absolute; inset: 0; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  margin: 0; pointer-events: none;
  color: #F2F6F8;
  mix-blend-mode: difference;
  font-size: clamp(38px, 8.6vw, 132px);
  line-height: 1.02;
}
.mh-wm-word {
  display: block; font-weight: 200; letter-spacing: .1em;
  white-space: nowrap; will-change: clip-path, transform;
}
/* the trailing letter-space would otherwise push MIRROR off the seam */
.mh-wm-mirror { padding-right: .34em; margin-right: -.1em; text-align: right; }
.mh-wm-house { padding-left: .34em; text-align: left; }
.mh-wm-seam {
  flex: none; width: 1px; height: .96em; background: currentColor;
  opacity: .85; transform-origin: 50% 50%;
}
.mh-hero-block {
  position: relative; align-self: end; z-index: 1;
  padding: 0 calc(var(--u) * 48) calc(calc(var(--u) * 64) + env(safe-area-inset-bottom, 0px));
  color: #F2F6F8;
  max-width: calc(var(--u) * 900);
}
.mh-hero-sub {
  margin: 0;
  font-size: ${fluid(19, 15)}; line-height: 1.55; font-weight: 300;
  max-width: 44ch; color: rgba(242,246,248,.92);
}
/* the hero asks quietly: a rule that draws itself in from the left on hover,
   never a filled chip sitting on the photograph */
.mh-hero-link {
  display: inline-block; margin-top: calc(var(--u) * 24);
  font-size: ${fluid(16, 14)}; font-weight: 300; letter-spacing: .01em;
  color: #F2F6F8; text-decoration: none; position: relative;
  padding-bottom: 3px;
}
.mh-hero-link::after {
  content: ''; position: absolute; left: 0; bottom: 0; height: 1px; width: 100%;
  background: currentColor; transform: scaleX(0); transform-origin: left;
  transition: transform .45s cubic-bezier(.23,1,.32,1);
}
@media (hover: hover) and (pointer: fine) {
  .mh-hero-link:hover::after { transform: scaleX(1); }
}
.mh-hero-link:focus-visible::after { transform: scaleX(1); }

.mh-cta {
  display: inline-block; margin-top: calc(var(--u) * 26);
  background: var(--mh-aurora); color: ${BASALT};
  font-weight: 500; font-size: ${fluid(15, 13)}; text-decoration: none;
  padding: calc(var(--u) * 14) calc(var(--u) * 26);
  border: 0; border-radius: 2px; cursor: pointer;
  transition: transform .15s ease, filter .25s ease;
}
.mh-cta:hover { filter: brightness(1.06); }
.mh-cta:active { transform: translateY(1px); }

/* shared text */
.mh-headline {
  margin: 0; font-weight: 200; letter-spacing: -.01em; line-height: 1.12;
  text-wrap: balance;
}
.mh-line {
  display: inline-block; overflow: hidden; vertical-align: bottom;
  padding: .2em .04em .12em; margin: -.2em -.04em -.12em;
}
.mh-word { display: inline-block; }
.mh-body {
  font-size: ${fluid(17, 15)}; line-height: 1.62; font-weight: 300;
  color: var(--mh-mute); max-width: 58ch; margin: calc(var(--u) * 26) 0 0;
  transition: color .4s ease;
}
.mh-phase {
  font-family: ${MONO}; font-size: ${fluid(12, 11)}; letter-spacing: .16em;
  text-transform: uppercase; color: var(--mh-mute); margin: 0 0 calc(var(--u) * 18);
}
.mh-phase-is { color: var(--mh-aurora); }
.mh-stat {
  font-family: ${MONO}; font-size: ${fluid(12, 11)};
  color: var(--mh-mute); margin: calc(var(--u) * 14) 0 0;
}
.mh-a { color: inherit; }

/* frames: drift + condensation-clear */
.mh-frame {
  position: relative; overflow: hidden; margin: 0; background: var(--mh-soft);
}
.mh-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; will-change: transform; }
.mh-frame-in img {
  width: 100%; height: 100%; max-width: none; object-fit: cover; display: block;
}
/* condensation-clear: a blur/saturate resolve, like breath fading off glass.
   No clip/mask on the frames: a resting clip-path on a box whose child
   transforms every frame de-optimizes compositing (measured: 60fps -> 30fps),
   and mask-image gradients don't interpolate at all. The wipe vocabulary
   lives in the night scrub, where scroll drives it. */
.mh-js .mh-rv img {
  transition: filter 1.15s cubic-bezier(.25,1,.5,1), opacity 1.15s cubic-bezier(.25,1,.5,1);
}
.mh-js .mh-rv:not(.is-in) img {
  filter: blur(10px) saturate(.55);
  opacity: .35;
}
/* the hero media is a full-bleed backdrop, never a rising block */
.mh-js .mh-rv:not(.mh-frame):not(.mh-hero-media):not(.is-in) { opacity: 0; transform: translateY(26px); }
.mh-js .mh-rv:not(.mh-frame):not(.mh-hero-media) {
  transition: opacity .9s cubic-bezier(.25,1,.5,1), transform .9s cubic-bezier(.25,1,.5,1);
}

/* sections */
.mh-manifesto {
  display: grid; grid-template-columns: 7fr 4fr; align-items: end;
  gap: calc(var(--u) * 96);
  padding: calc(var(--u) * 190) calc(var(--u) * 48) calc(var(--u) * 150);
  max-width: calc(var(--u) * 1440); margin: 0 auto;
}
.mh-manifesto-fig { width: 100%; }

.mh-arrival {
  display: grid; grid-template-columns: 5fr 6fr; gap: calc(var(--u) * 96);
  padding: calc(var(--u) * 60) calc(var(--u) * 48) calc(var(--u) * 150);
  max-width: calc(var(--u) * 1440); margin: 0 auto; align-items: start;
}
.mh-facts { margin: calc(var(--u) * 40) 0 0; }
.mh-facts div {
  display: grid; grid-template-columns: calc(var(--u) * 160) 1fr;
  gap: calc(var(--u) * 24);
  padding: calc(var(--u) * 14) 0; border-top: 1px solid var(--mh-hair);
}
.mh-facts dt {
  font-family: ${MONO}; font-size: ${fluid(12, 11)}; text-transform: uppercase;
  letter-spacing: .14em; color: var(--mh-mute); padding-top: 2px;
}
.mh-facts dd { margin: 0; font-size: ${fluid(15, 14)}; font-weight: 300; line-height: 1.5; }
.mh-arrival-figs {
  display: grid; grid-template-columns: 3fr 2fr; gap: calc(var(--u) * 24);
  align-items: start;
}
.mh-arrival-door { margin-top: calc(var(--u) * 96); }

.mh-interior { padding: calc(var(--u) * 60) 0 calc(var(--u) * 150); }
.mh-interior-hero {
  width: min(100%, calc(var(--u) * 1240)); margin: 0 auto;
}
.mh-interior-row {
  display: grid; grid-template-columns: 6fr 4fr; gap: calc(var(--u) * 96);
  align-items: start; max-width: calc(var(--u) * 1240);
  margin: calc(var(--u) * 90) auto 0; padding: 0 calc(var(--u) * 48);
}
.mh-interior-side { margin-top: calc(var(--u) * 40); }

.mh-evening { padding: calc(var(--u) * 60) 0 calc(var(--u) * 170); }
.mh-evening-head {
  max-width: calc(var(--u) * 1440); margin: 0 auto calc(var(--u) * 64);
  padding: 0 calc(var(--u) * 48);
}
.mh-evening-bleed { width: 100%; aspect-ratio: 21 / 9 !important; }
.mh-evening-foot {
  display: flex; flex-wrap: wrap; gap: calc(var(--u) * 40); align-items: baseline;
  justify-content: space-between;
  max-width: calc(var(--u) * 1440); margin: calc(var(--u) * 40) auto 0;
  padding: 0 calc(var(--u) * 48);
}
.mh-evening-foot .mh-body { margin: 0; }

/* the night scrub */
.mh-scrub-inner {
  position: relative; height: 100svh; overflow: hidden; background: ${BASALT};
}
.mh-scrub-day, .mh-scrub-day img, .mh-scrub-canvas {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
}
.mh-scrub-day img { display: block; }
/* the film sits over the daylight still, which stays up until frames land */
.mh-scrub-canvas { display: block; z-index: 1; }
.mh-scrub-caps {
  position: absolute; left: calc(var(--u) * 48); bottom: calc(var(--u) * 56);
  z-index: 3; color: #F2F6F8;
}
.mh-scrub-caps .mh-phase { color: rgba(242,246,248,.72); }
/* Both captions are absolutely positioned on the same baseline so they
   crossfade in place. Leaving one in flow let the taller night line grow
   straight over the day line. */
.mh-scrub-captext { position: relative; min-height: 2.5em; }
.mh-scrub-cap {
  position: absolute; left: 0; bottom: 0; margin: 0;
  font-weight: 200; font-size: ${fluid(44, 23)}; line-height: 1.18;
  letter-spacing: -.01em; max-width: 32ch;
}
.mh-scrub-cap-night { opacity: 0; }
.mh-scrub-inner::after {
  content: ''; position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(200deg, transparent 55%, rgba(10,18,27,.5) 100%);
}
.mh-scrub-fallback { display: none; margin: 0; }
.mh-scrub-fallback img { width: 100%; display: block; aspect-ratio: 3 / 2; object-fit: cover; }
.mh-scrub-fallback figcaption { padding: calc(var(--u) * 14) calc(var(--u) * 48) 0; }

/* guests */
.mh-guests {
  padding: calc(var(--u) * 170) calc(var(--u) * 48);
  max-width: calc(var(--u) * 1240); margin: 0 auto;
}
.mh-guests-meta {
  font-family: ${MONO}; font-size: ${fluid(13, 12)}; color: var(--mh-mute);
  margin: calc(var(--u) * 20) 0 0;
}
.mh-quotes {
  list-style: none; margin: calc(var(--u) * 72) 0 0; padding: 0;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 56);
}
.mh-quote blockquote { margin: 0; }
.mh-quote blockquote p {
  margin: 0; font-size: ${fluid(21, 16)}; line-height: 1.45; font-weight: 300;
}
.mh-quote-by {
  font-family: ${MONO}; font-size: ${fluid(12, 11)}; color: var(--mh-mute);
  margin: calc(var(--u) * 18) 0 0;
}
.mh-themes {
  display: flex; flex-wrap: wrap; gap: calc(var(--u) * 56) calc(var(--u) * 72);
  margin: calc(var(--u) * 88) 0 0; padding: calc(var(--u) * 28) 0 0;
  border-top: 1px solid var(--mh-hair);
}
.mh-themes div { display: flex; align-items: baseline; gap: calc(var(--u) * 14); }
.mh-themes dt { font-size: ${fluid(15, 13)}; font-weight: 300; color: var(--mh-mute); }
.mh-themes dd {
  margin: 0; font-family: ${MONO}; font-size: ${fluid(28, 20)}; color: var(--mh-ink);
}

/* the place */
.mh-place {
  display: grid; grid-template-columns: 7fr 4fr; gap: calc(var(--u) * 96);
  padding: calc(var(--u) * 40) calc(var(--u) * 48) calc(var(--u) * 170);
  max-width: calc(var(--u) * 1440); margin: 0 auto; align-items: start;
}
.mh-place-list { list-style: none; margin: calc(var(--u) * 56) 0 0; padding: 0; }
.mh-place-list li {
  display: grid; grid-template-columns: calc(var(--u) * 190) 1fr auto;
  gap: calc(var(--u) * 28); align-items: baseline;
  padding: calc(var(--u) * 18) 0; border-top: 1px solid var(--mh-hair);
}
.mh-place-name { font-weight: 400; font-size: ${fluid(17, 15)}; }
.mh-place-note { font-weight: 300; font-size: ${fluid(15, 13)}; color: var(--mh-mute); line-height: 1.5; }
.mh-place-dist { font-family: ${MONO}; font-size: ${fluid(12, 11)}; color: var(--mh-mute); }

/* booking */
.mh-book {
  display: grid; grid-template-columns: 5fr 6fr; gap: calc(var(--u) * 96);
  padding: calc(var(--u) * 40) calc(var(--u) * 48) calc(var(--u) * 190);
  max-width: calc(var(--u) * 1440); margin: 0 auto; align-items: start;
}
.mh-book-form, .mh-book-done {
  background: var(--mh-soft);
  border: 1px solid var(--mh-hair); border-radius: 2px;
  padding: calc(var(--u) * 40);
  transition: background .4s ease;
}
.mh-book-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 22); }
.mh-field { display: flex; flex-direction: column; gap: 6px; }
.mh-field-wide { grid-column: 1 / -1; }
.mh-field-label {
  font-family: ${MONO}; font-size: ${fluid(11, 10)}; letter-spacing: .12em;
  text-transform: uppercase; color: var(--mh-mute);
}
.mh-optional { text-transform: none; letter-spacing: 0; }
.mh-field input, .mh-field select, .mh-field textarea {
  font: inherit; font-size: 16px; font-weight: 300;
  color: var(--mh-ink); background: color-mix(in srgb, var(--mh-c) 55%, transparent);
  border: 1px solid var(--mh-hair); border-radius: 2px;
  padding: 10px 12px; min-height: 44px;
}
.mh-field textarea { min-height: 0; resize: vertical; }
.mh-night .mh-field input, .mh-night .mh-field select, .mh-night .mh-field textarea { color-scheme: dark; }
.mh-owner-note {
  margin-top: calc(var(--u) * 48); padding-top: calc(var(--u) * 24);
  border-top: 1px solid var(--mh-hair);
}
.mh-owner-note-label {
  font-family: ${MONO}; font-size: ${fluid(11, 10)}; letter-spacing: .14em;
  text-transform: uppercase; color: var(--mh-aurora); margin: 0 0 calc(var(--u) * 10);
}
.mh-owner-note-body {
  font-size: ${fluid(14, 13)}; font-weight: 300; line-height: 1.65;
  color: var(--mh-mute); margin: 0; max-width: 44ch;
}
.mh-field-error { color: #C86A5A; font-size: ${fluid(14, 13)}; margin: calc(var(--u) * 18) 0 0; }
.mh-book-form .mh-cta { margin-top: calc(var(--u) * 28); width: 100%; text-align: center; }
.mh-book-note {
  font-size: ${fluid(13, 12)}; font-weight: 300; line-height: 1.6;
  color: var(--mh-mute); margin: calc(var(--u) * 18) 0 0;
}
.mh-book-done-title { margin: 0; font-weight: 200; font-size: ${fluid(34, 22)}; }
.mh-book-done-body {
  margin: calc(var(--u) * 18) 0 0; font-weight: 300; line-height: 1.6;
  font-size: ${fluid(16, 14)};
}
.mh-ghost {
  margin-top: calc(var(--u) * 24);
  font: inherit; font-size: ${fluid(14, 13)}; font-weight: 400; cursor: pointer;
  background: none; color: var(--mh-ink);
  border: 1px solid var(--mh-hair); border-radius: 2px;
  padding: calc(var(--u) * 10) calc(var(--u) * 18);
}
.mh-ghost:hover { border-color: var(--mh-aurora); }

/* preloader: basalt sheet, wordmark filling with real load progress, then
   the sheet lifts to reveal the day. */
.mh-loader {
  position: fixed; inset: 0; z-index: 60;
  background: ${BASALT};
  display: grid; place-content: center;
  transition: transform .95s cubic-bezier(.76, 0, .24, 1);
}
.mh-loader.is-leaving { transform: translateY(-100%); }
.mh-loader-mark {
  margin: 0; font-weight: 200; letter-spacing: .1em; margin-right: -.1em;
  font-size: clamp(34px, 7.6vw, 120px); white-space: nowrap; line-height: 1;
  background-image: linear-gradient(90deg, #EDF2F5 50%, rgba(237,242,245,.16) 50%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}
.mh-loader-pct {
  position: fixed; left: calc(var(--u) * 48); bottom: calc(var(--u) * 40);
  margin: 0; font-family: ${MONO}; font-size: 12px; letter-spacing: .16em;
  color: rgba(159,176,189,.85);
}

/* footer */
.mh-foot { border-top: 1px solid var(--mh-hair); }
.mh-foot-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 48);
  max-width: calc(var(--u) * 1440); margin: 0 auto;
  padding: calc(var(--u) * 56) calc(var(--u) * 48) calc(var(--u) * 72);
}
.mh-foot-mark { font-weight: 300; letter-spacing: .22em; font-size: ${fluid(14, 12)}; margin: 0 0 calc(var(--u) * 12); }
.mh-foot-line {
  font-size: ${fluid(13, 12)}; font-weight: 300; line-height: 1.6;
  color: var(--mh-mute); margin: 0 0 calc(var(--u) * 8);
}

/* ── responsive ── */
@media (max-width: 991px) {
  .mh-nav { padding: 14px 20px; gap: 16px; }
  .mh-nav-links { display: none; }
  .mh-nav-cta { margin-left: auto; }
  .mh-hero-block { padding: 0 20px 40px; }
  /* the seam and both words stay on one line; the clamp already shrinks it */
  .mh-wordmark { font-size: clamp(30px, 11vw, 62px); }
  .mh-manifesto, .mh-arrival, .mh-place, .mh-book,
  .mh-interior-row { grid-template-columns: 1fr; gap: 48px; padding-left: 20px; padding-right: 20px; }
  .mh-manifesto { padding-top: 96px; padding-bottom: 80px; }
  .mh-arrival, .mh-place, .mh-book { padding-bottom: 80px; }
  .mh-arrival-figs { grid-template-columns: 1fr; }
  .mh-arrival-door { margin-top: 0; }
  .mh-interior-side { margin-top: 0; }
  .mh-evening-head, .mh-evening-foot, .mh-guests { padding-left: 20px; padding-right: 20px; }
  .mh-evening-bleed { aspect-ratio: 4 / 3 !important; }
  .mh-quotes { grid-template-columns: 1fr; gap: 36px; }
  .mh-book-grid { grid-template-columns: 1fr; }
  .mh-place-list li { grid-template-columns: 1fr; gap: 6px; }
  .mh-foot-grid { grid-template-columns: 1fr; gap: 24px; padding: 40px 20px; }
}

/* Phone only: no pin, so the film is replaced by its two stills. Tablets and
   up keep the scrubbed clip even though their grids have collapsed. */
@media (max-width: 767px) {
  .mh-scrub-inner { height: auto; }
  .mh-scrub-day { position: relative; inset: auto; }
  .mh-scrub-day img { position: relative; aspect-ratio: 3 / 2; }
  .mh-scrub-canvas { display: none; }
  .mh-scrub-caps { position: absolute; }
  .mh-scrub-cap-night { display: none; }
  .mh-scrub-fallback { display: block; }
}

/* ── reduced motion: every device collapses to its resting state ── */
@media (prefers-reduced-motion: reduce) {
  .mh-root * { transition: none !important; animation: none !important; }
  .mh-frame-in { inset: 0; transform: none !important; }
  .mh-word { transform: none !important; opacity: 1 !important; }
  /* the name is simply open, the line already drawn */
  .mh-wm-word { clip-path: none !important; transform: none !important; opacity: 1 !important; }
  .mh-wm-seam { transform: none !important; opacity: .85 !important; }
  .mh-scrub-inner { height: auto; }
  .mh-scrub-day { position: relative; inset: auto; }
  .mh-scrub-day img { position: relative; aspect-ratio: 3 / 2; }
  .mh-scrub-canvas { display: none; }
  .mh-scrub-cap-night { display: none; }
  .mh-scrub-fallback { display: block; }
}
.mh-static .mh-frame-in { inset: 0; }
`
