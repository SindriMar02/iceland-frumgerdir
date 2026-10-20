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
  FACTS, HOST, JSON_LD, LOCAL_AREA, PHOTO, REVIEW_QUOTES, REVIEW_THEMES, SCRUB, srcSet,
} from './content'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('glacialglass')

/* ── GLACIAL GLASS CABIN · "EIN NÓTT" (Mirror House system) ─────────────────────────
   One page, one night. The canvas begins in daylight ice and ends in aurora
   night: a single scroll-driven palette lerp (Búðir sky-scrub lineage, new
   palette, new arc), Icelandic day-phase labels carrying the structure, and a
   pinned climax where scroll passes the hot-tub deck from day into aurora
   (a Kling film from their own daylight photograph, drawn as a canvas frame
   sequence). Full spec: ../mirrorhouse/DESIGN.md, deltas in ./DESIGN.md.

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
/**
 * Canvas and ink cross through mid-grey together, so anywhere the crossover is
 * SLOW the two meet in the middle and contrast collapses (measured 2.65:1 on
 * the evening copy). Hold the light palette late, then cross fast, so no body
 * copy is ever sitting inside the crossover.
 */
const STOPS = [
  { at: 0.0, c: '#E9EFF3', ink: '#37424E', soft: '#DDE6EC' },
  { at: 0.56, c: '#E9EFF3', ink: '#37424E', soft: '#DDE6EC' },
  { at: 0.60, c: '#C2CFD9', ink: '#202A34', soft: '#B6C5D1' },
  { at: 0.645, c: '#16202C', ink: '#E4ECF1', soft: '#1D2937' },
  { at: 0.70, c: '#0A121B', ink: '#EDF2F5', soft: '#111C28' },
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

/**
 * THE FILM'S FRAMES — module scope, started from a plain effect on mount.
 *
 * This deliberately depends on NOTHING: not gsap, not ScrollTrigger, not the
 * scroll position, not a media query. Every earlier version gated the load
 * behind one of those, and each gate found a browser where it never fired,
 * leaving the canvas black over the whole section. Someone opening this link
 * once does not get a second chance.
 */
const shots: (HTMLImageElement | null)[] = new Array(SCRUB.frameCount).fill(null)
let framesStarted = false
/** decided once: a phone pulls the 828w set, a wide screen the 1440w set */
const frameDir: 'frames-828' | 'frames' | 'frames-1440' =
  typeof window === 'undefined' || window.innerWidth < 768 ? 'frames-828'
    : window.innerWidth >= 1400 ? 'frames-1440' : 'frames'

function loadFrames(onFirst?: () => void) {
  if (framesStarted) return
  framesStarted = true
  let next = 0
  const pump = () => {
    if (next >= SCRUB.frameCount) return
    const idx = next++
    const im = new Image()
    im.decoding = 'async'
    im.onload = () => {
      // onload only means the bytes arrived — the pixels can still decode
      // lazily on the FIRST drawImage, which on iOS Safari is a synchronous
      // stall right in the middle of a scrub gesture. decode() front-loads
      // that cost onto the (already background) load phase instead.
      const commit = () => { shots[idx] = im; if (idx === 0) onFirst?.(); pump() }
      im.decode ? im.decode().then(commit, commit) : commit()
    }
    im.onerror = pump
    im.src = SCRUB.frameSrc(idx, frameDir)
  }
  // 121 frames at ~48KB (phone set) is 5.8MB total. A curious scroller can
  // reach the pin before a 6-wide pump fills that in on real mobile data,
  // landing on the "nearest loaded frame" fallback below — which reads as
  // the film stepping/stalling, not as render jank. Wider concurrency (GH
  // Pages is HTTP/2, so this isn't per-origin-limited) shortens that window.
  for (let l = 0; l < 14; l++) pump()
}

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/** The film runs everywhere a phone can pin a section, which is everywhere.
    Only reduced motion opts out, and that path keeps the two stills. Gating
    this on width previously hid the film from tablets, from narrow desktop
    windows, and from every phone. */
const cinematic = () => typeof window !== 'undefined' && !reduced()

/** Fluid size with a phone floor: --u pins small on narrow viewports. */
const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/* ── motion engine: one Lenis clock drives drift + reveals + palette ───── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const root = document.querySelector<HTMLElement>('.gg-root')
    if (!root) return

    if (reduced()) {
      root.classList.add('gg-static')
      // resting state is the visible one; only the palette needs a value
      const { c, ink, soft } = paletteAt(0)
      root.style.setProperty('--gg-c', c)
      root.style.setProperty('--gg-ink', ink)
      root.style.setProperty('--gg-soft', soft)
      return
    }

    root.classList.add('gg-js')
    // iOS Safari fires a resize when its address bar hides/shows mid-scroll;
    // without this a pinned ScrollTrigger can refresh and jump mid-gesture.
    ScrollTrigger.config({ ignoreMobileResize: true })
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    /* drift: Heklusýn spec, batched reads then writes, off-screen skipped */
    const frames = Array.from(root.querySelectorAll<HTMLElement>('.gg-frame-in'))
    // Set once the night-scrub pin goes live (below). While it holds, the
    // viewport is visually frozen, so every .gg-frame-in box reports the same
    // rect on every tick — this loop would just burn main-thread time right
    // next to the canvas draw, for zero visual change.
    let scrubST: ScrollTrigger | null = null
    const drift = () => {
      if (scrubST?.isActive) return
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

    /* palette: ONE writer for the whole world. The .gg-night class rides
       along so native form controls flip their color-scheme with the sky. */
    let lastC = '', lastInk = '', lastSoft = ''
    const applyPalette = (p: number) => {
      const { c, ink, soft } = paletteAt(p)
      // Writing a custom property on the root restyles every descendant, and
      // the palette is FLAT across more than half the document (ice to 0.32,
      // basalt from 0.74). Skipping identical writes removes that recalc
      // entirely there, and most of it elsewhere since the channels are
      // already rounded to integers.
      if (c !== lastC) { root.style.setProperty('--gg-c', c); lastC = c }
      if (ink !== lastInk) { root.style.setProperty('--gg-ink', ink); lastInk = ink }
      if (soft !== lastSoft) { root.style.setProperty('--gg-soft', soft); lastSoft = soft }
      // Derive "is the page dark now" from the canvas colour itself. A hard
      // progress threshold drifts out of sync the moment the palette stops
      // move, which is exactly how the accent ended up green-on-light.
      const rgb = c.match(/\d+/g)!.map(Number)
      const lin = rgb.map((v) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4) })
      const night = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2] < 0.18
      if (root.classList.contains('gg-night') !== night) {
        root.classList.toggle('gg-night', night)
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
    root.querySelectorAll('.gg-rv').forEach((el) => io.observe(el))

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
         first, then GLACIAL opens leftward out of it and GLASS rightward, as
         if the name were being pulled apart from its own reflection. Reveal
         is clip-path only, so nothing moves that should not.
         Then the scroll takes over the same gesture: the two halves keep
         parting, the rule grows past them, and the lockup dissolves into the
         landscape it was standing on. Transform + clip only, both cheap. */
      const seam = root.querySelector<HTMLElement>('.gg-wm-seam')
      const wmL = root.querySelector<HTMLElement>('.gg-wm-glacial')
      const wmR = root.querySelector<HTMLElement>('.gg-wm-glass')
      const heroEl = root.querySelector<HTMLElement>('.gg-hero')

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
        if (document.querySelector('.gg-loader')) {
          window.addEventListener('gg:revealed', openFromTheLine, { once: true })
        } else {
          gsap.delayedCall(0.12, openFromTheLine)
        }

        /* THE HAND-OFF: the hero wordmark IS the header mark. It is fixed from
           the start (resting in the sky band), and the scroll carries it up and
           scales it down until it sits dead centre in the header at the header's
           own type size. One element, so there is no swap and nothing to jump.
           It travels over 1.6x its distance, so it drifts up slower than the page
           rather than riding it. The seam, which only means something at hero
           scale, fades on the way. Geometry is re-read on every refresh. */
        const lock = root.querySelector<HTMLElement>('.gg-wordmark')
        const nav = root.querySelector<HTMLElement>('.gg-nav')
        const navMark = root.querySelector<HTMLElement>('.gg-nav-mark')
        if (lock && nav && navMark) {
          const geo = () => {
            const cs = getComputedStyle(lock)
            const restC = parseFloat(cs.top) + lock.offsetHeight / 2
            const navC = nav.offsetHeight / 2
            const s = parseFloat(getComputedStyle(navMark).fontSize) / parseFloat(cs.fontSize)
            return { d: Math.max(1, restC - navC), s }
          }
          gsap.timeline({
            scrollTrigger: { start: 0, end: () => geo().d * 1.6, scrub: true, invalidateOnRefresh: true },
          })
            .fromTo(lock, { y: 0, scale: 1 },
              { y: () => -geo().d, scale: () => geo().s, ease: 'power2.inOut', duration: 1 }, 0)
            .to(seam, { opacity: 0, ease: 'none', duration: 0.4 }, 0)
        }

        /* Difference-blended chrome cancels out over mid-grey: once the sky has
           scrolled past, the header sits on the moor (~110/255) and went
           grey-on-grey. A soft scrim, unblended and BELOW the chrome, lifts in
           only while the hero photo is under the header and is gone before
           the light sections, so the sky moment stays clean. */
        const scrim = root.querySelector<HTMLElement>('.gg-nav-scrim')
        if (scrim) {
          gsap.timeline({ scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } })
            // held off while the sky is still under the header (that is where
            // the invert is at its best), then a quick ramp: a half-strength
            // scrim over snow is itself mid-grey, the one value difference
            // cannot read on. Strong enough that the chrome comes out light.
            .set(scrim, { opacity: 0 }, 0)
            .to(scrim, { opacity: 1, ease: 'none', duration: 0.1 }, 0.17)
            .to(scrim, { opacity: 1, duration: 0.6 })
            .to(scrim, { opacity: 0, ease: 'none', duration: 0.13 })

          /* Difference blending cannot survive the scrim's ramp (it crosses
             mid-grey, the one backdrop the invert reads as nothing). So while
             the hero photo is under the header, the chrome is painted SOLID:
             basalt ink over the sky, near-white once the scrim is past half,
             a 0.3s colour ease between. After the hero it hands back to the
             Mirror House invert, at a moment when both read as light ink. */
          ScrollTrigger.create({
            trigger: heroEl, start: 'top top', end: 'bottom top',
            onUpdate: (self) => {
              const solid = self.progress < 0.97
              const light = self.progress > 0.22
              if (root.classList.contains('gg-chrome-solid') !== solid) root.classList.toggle('gg-chrome-solid', solid)
              if (root.classList.contains('gg-chrome-light') !== light) root.classList.toggle('gg-chrome-light', light)
            },
            onRefresh: (self) => {
              root.classList.toggle('gg-chrome-solid', self.progress < 0.97)
              root.classList.toggle('gg-chrome-light', self.progress > 0.22)
            },
          })
        }
      }

      // word-mask rises
      root.querySelectorAll<HTMLElement>('[data-gg-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.gg-word')
        if (!words.length) return
        gsap.fromTo(
          words,
          { yPercent: 116, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            duration: 1.05, ease: 'expo.out', stagger: 0.07,
            // no `once`: in ScrollTrigger 3.13+ a once-trigger already past its
            // start kills itself mid-refresh and crashes later triggers ('end')
            // on phones (Dans Brynju, 2026-10-20). 84% so the rise is seen.
            scrollTrigger: { trigger: h, start: 'top 84%', toggleActions: 'play none none none' },
          },
        )
      })

      // the night scrub: pinned on desktop, plain trigger elsewhere
      const scrubWrap = root.querySelector<HTMLElement>('.gg-scrub')
      const dayLayer = root.querySelector<HTMLElement>('.gg-scrub-day img')
      const capDay = root.querySelector<HTMLElement>('.gg-scrub-cap-day')
      const capNight = root.querySelector<HTMLElement>('.gg-scrub-cap-night')
      /* THE FILM.
         A pre-decoded frame sequence drawn to a canvas, NOT a <video> driven
         by currentTime. Every currentTime assignment is a decoder seek, and
         measured on this clip only ~104 of 241 frames ever reached the screen
         (an effective 13fps) even all-intra. Blitting an already-decoded
         Image has no seek at all, so the film tracks the scroll exactly.

         Frames load lazily, starting one section early, so the hero never
         competes with them for bandwidth. Until they arrive the daylight
         still simply stays up. */
      const canvas = root.querySelector<HTMLCanvasElement>('.gg-scrub-canvas')
      // alpha:true on purpose: with an opaque context an unpainted canvas paints
      // solid BLACK over the section. Transparent lets the daylight still show.
      const ctx = canvas?.getContext('2d') ?? null
      let shown = -1

      const drawCover = (img: HTMLImageElement) => {
        if (!canvas || !ctx) return
        const cw = canvas.width, ch = canvas.height
        const sc = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
        const w = img.naturalWidth * sc, h = img.naturalHeight * sc
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
      }

      const paint = (idx: number) => {
        if (!canvas || !ctx || !canvas.width) return
        // Nothing decoded yet? Draw the daylight still rather than leaving an
        // empty canvas over the section. Without this the film reads as a
        // blank field for as long as the first frame takes to arrive.
        if (!shots.some(Boolean)) {
          const still = root.querySelector<HTMLImageElement>('.gg-scrub-day img')
          if (still?.complete && still.naturalWidth) drawCover(still)
          return
        }
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
        drawCover(img)
      }

      const sizeCanvas = () => {
        if (!canvas || !canvas.clientWidth || !canvas.clientHeight) return
        // DPR capped at 1.5: a full-bleed 4K-ish blit per frame buys nothing
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
        const w = Math.round(canvas.clientWidth * dpr)
        const h = Math.round(canvas.clientHeight * dpr)
        if (w === canvas.width && h === canvas.height) return
        canvas.width = w
        canvas.height = h
        const keep = shown
        shown = -1
        paint(Math.max(0, keep))
      }

      if (scrubWrap && dayLayer && canvas && cinematic()) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scrubWrap,
            start: 'top top',
            end: '+=300%',
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              paint(Math.min(SCRUB.frameCount - 1,
                Math.round(self.progress * (SCRUB.frameCount - 1))))
            },
          },
        })
        scrubST = tl.scrollTrigger ?? null

        // the film is full-bleed photography too, and its aurora greens sit at
        // exactly the mid luminance the invert loses on: same solid light ink
        // and scrim as the hero, for as long as the film is under the header
        const spacer = scrubWrap.parentElement
        const scrimEl = root.querySelector<HTMLElement>('.gg-nav-scrim')
        if (spacer) {
          ScrollTrigger.create({
            trigger: spacer, start: 'top 90px', end: 'bottom 90px',
            onToggle: (self) => {
              root.classList.toggle('gg-chrome-film', self.isActive)
              if (scrimEl) gsap.to(scrimEl, { opacity: self.isActive ? 1 : 0, duration: 0.35, overwrite: 'auto' })
            },
          })
        }

        gsap.fromTo(dayLayer, { scale: 1 }, {
          scale: 1.06, ease: 'none', duration: 1,
          scrollTrigger: { trigger: scrubWrap, start: 'top top', end: '+=300%', scrub: true },
        })

        // The load is started from the component effect, never from here.
        // This only keeps the canvas sized to the pin, and paints the first
        // frame the instant it lands so the section is never empty.
        const onFirst = () => { shown = -1; paint(0) }
        window.addEventListener('gg:firstframe', onFirst)
        cleanups.push(() => window.removeEventListener('gg:firstframe', onFirst))
        if (shots[0]) onFirst()
        ScrollTrigger.addEventListener('refresh', sizeCanvas)
        cleanups.push(() => ScrollTrigger.removeEventListener('refresh', sizeCanvas))
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
      data-gg-headline
      aria-label={text}
      className={`gg-headline ${className}`}
      style={{
        fontSize: fluid(size, floor),
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      }}
    >
      {text.split(' ').map((w, i, arr) => (
        <span key={i} aria-hidden="true">
          <span className="gg-line"><span className="gg-word">{w}</span></span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** Day-phase label: the page's only recurring structural device. */
function Phase({ is, en }: { is: string; en: string }) {
  return (
    <p className="gg-phase">
      <span className="gg-phase-is">{is}</span>
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
  photo: { src: string; alt: string; ratio: string; w?: number }
  drift?: number; priority?: boolean; className?: string
}) {
  return (
    <figure className={`gg-frame gg-rv ${className}`} style={{ aspectRatio: photo.ratio }}>
      <div
        className="gg-frame-in"
        data-drift={drift}
        style={{ '--dz': `${Math.max(9, drift * 1.35)}%` } as React.CSSProperties}
      >
        <img src={photo.src} srcSet={srcSet(photo.src, photo.w)} sizes="(max-width: 991px) 100vw, 60vw"
          alt={photo.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
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
      id: `gg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: 'glacialglass',
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
      <div className="gg-book-done" role="status">
        <p className="gg-book-done-title">Your request is on its way.</p>
        <p className="gg-book-done-body">
          {done.date} to {done.endDate}, {done.people} {done.people === 1 ? 'guest' : 'guests'}.
          The hosts confirm each request personally. The price for your dates comes with their reply
          to {done.customer.email}.
        </p>
        <p className="gg-book-note">
          This is a prototype. The request lives only in this browser.{' '}
          <Link className="gg-a" to="/preview/glacialglass/stjornbord">View the owner's dashboard</Link>{' '}
          to watch it arrive.
        </p>
        <button type="button" className="gg-ghost" onClick={() => setDone(null)}>
          Make another request
        </button>
      </div>
    )
  }

  return (
    <form className="gg-book-form" onSubmit={submit} noValidate>
      <div className="gg-book-grid">
        <label className="gg-field">
          <span className="gg-field-label">Arrival</span>
          <input type="date" name="arrival" min={minDate} value={date} required
            onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="gg-field">
          <span className="gg-field-label">Nights</span>
          <select name="nights" value={nights} onChange={(e) => setNights(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="gg-field">
          <span className="gg-field-label">Guests</span>
          <select name="guests" value={people} onChange={(e) => setPeople(Number(e.target.value))}>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </label>
        <label className="gg-field gg-field-wide">
          <span className="gg-field-label">Name</span>
          <input type="text" name="name" autoComplete="name" value={name} required
            onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="gg-field gg-field-wide">
          <span className="gg-field-label">Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" spellCheck={false} value={email} required
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="gg-field gg-field-wide">
          <span className="gg-field-label">Phone <span className="gg-optional">(optional)</span></span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="gg-field gg-field-wide">
          <span className="gg-field-label">Anything the hosts should know <span className="gg-optional">(optional)</span></span>
          <textarea rows={3} name="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      {error && <p className="gg-field-error" role="alert">{error}</p>}
      <button type="submit" className="gg-cta">Enquire about your stay</button>
      <p className="gg-book-note">
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
  try { return !sessionStorage.getItem('gg_seen') } catch { return true }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('gg_seen', '1') } catch { /* private mode */ }
    const t0 = performance.now()
    let raf = 0
    let shown = 0
    const hero = document.querySelector<HTMLImageElement>('.gg-hero-media img')
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
    <div className={`gg-loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <p
        className="gg-loader-mark"
        style={{ backgroundPositionX: `${100 - pct}%` }}
      >
        GLACIAL GLASS
      </p>
      <p className="gg-loader-pct">{pct}%</p>
    </div>
  )
}

/* ── the page ──────────────────────────────────────────────────────────── */

export default function GlacialGlassPage() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(shouldShowLoader)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThemeColor(ICE)
    document.title = 'Glacial Glass Cabin · Hella, Iceland'
    setReady(true)
    // Start the film downloading here, unconditionally. Held back a beat so the
    // hero gets the connection first, then nothing can stop it.
    const t = window.setTimeout(() => {
      loadFrames(() => {
        // first frame in: paint it immediately so the section is never empty
        window.dispatchEvent(new Event('gg:firstframe'))
      })
    }, 700)
    return () => window.clearTimeout(t)
  }, [])

  useMotion(ready)

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div ref={rootRef} className="gg-root">
      <style>{CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      {loading && <Preloader onDone={() => { setLoading(false); window.dispatchEvent(new Event('gg:revealed')) }} />}

      {/* nav */}
      <div className="gg-nav-scrim" aria-hidden="true" />
      <header className="gg-nav">
        <a className="gg-nav-mark" translate="no" href="#top" onClick={anchor('top')}>GLACIAL&nbsp;GLASS</a>
        <nav className="gg-nav-links" aria-label="Page">
          <a href="#husid" onClick={anchor('husid')}>The house</a>
          <a href="#nottin" onClick={anchor('nottin')}>The night</a>
          <a href="#gestir" onClick={anchor('gestir')}>Guests</a>
        </nav>
        <a className="gg-nav-cta" href="#boka" onClick={anchor('boka')}>
          <span className="gg-cta-long">Enquire about your stay</span>
          <span className="gg-cta-short">Enquire</span>
        </a>
      </header>

      {/* 01 · hero (day) */}
      <section className="gg-hero" id="top">
        {/* The hero is a Heklusyn frame: the photograph drifts inside a box
            that never moves, so the landscape slides behind the type instead
            of scrolling with the page. Same engine and the same --dz rule as
            every other frame here; full-bleed band, so drift 13. */}
        <div className="gg-hero-media gg-rv">
          <div className="gg-frame-in" data-drift={13}
            style={{ '--dz': `${(13 * 1.35).toFixed(2)}%` } as React.CSSProperties}>
            <img src={PHOTO.arrivalWide.src} srcSet={srcSet(PHOTO.arrivalWide.src, PHOTO.arrivalWide.w)} sizes="135vw"
              alt={PHOTO.arrivalWide.alt} loading="eager" decoding="async" />
          </div>
        </div>
        {/* A hairline stands where the two words meet: GLACIAL opens out of it
            to the left, GLASS to the right. The line is the edge of the glass. */}
        <h1 className="gg-wordmark" aria-label="Glacial Glass Cabin" translate="no">
          <span className="gg-wm-word gg-wm-glacial" aria-hidden="true">GLACIAL</span>
          <span className="gg-wm-seam" aria-hidden="true" />
          <span className="gg-wm-word gg-wm-glass" aria-hidden="true">GLASS</span>
        </h1>
        <div className="gg-hero-block">
          <p className="gg-hero-sub">
            A glass cabin alone on nearly four hectares above a river near Hella,
            with Hekla in the middle of the view. Three walls of floor-to-ceiling
            glass, twenty square metres, a hot tub on the terrace. For two.
          </p>
          <a className="gg-hero-link" href="#boka" onClick={anchor('boka')}>Enquire about your stay</a>
        </div>
      </section>

      {/* 02 · manifesto */}
      <section className="gg-manifesto" id="husid">
        <div className="gg-manifesto-copy">
          <Headline text="Three walls of glass. Hekla in the middle." size={92} floor={40} measure={680} />
          <p className="gg-body gg-rv">
            The cabin is small on purpose. One room, and a landscape that does the
            rest: the river below, Búrfell to one side, Hekla taking centre stage.
            Outside, the glass is mirrored, so from across the moor the cabin all
            but disappears into the land it reflects.
          </p>
        </div>
        <Frame photo={PHOTO.mirrorLand} drift={9} className="gg-manifesto-fig" />
      </section>

      {/* 03 · arrival */}
      <section className="gg-arrival">
        <div className="gg-arrival-copy">
          <Phase is="Síðdegi" en="Afternoon" />
          <Headline text="Off the highway, onto the moor." size={64} floor={32} measure={560} />
          <p className="gg-body gg-rv">
            The last stretch is a gravel track across private land. Follow the
            directions the hosts send before you arrive, not the map pin, which
            stops on the main road. Park on the property, take the key from the
            lockbox and step inside. No reception desk. Nobody else in sight.
          </p>
          <dl className="gg-facts gg-rv">
            <div><dt>Check-in</dt><dd>{FACTS.checkIn}</dd></div>
            <div><dt>Check-out</dt><dd>{FACTS.checkOut}</dd></div>
            <div><dt>Winter</dt><dd>A 4x4 when it snows; the track is not ploughed</dd></div>
          </dl>
        </div>
        <div className="gg-arrival-figs">
          <Frame photo={PHOTO.track} drift={9} />
          <Frame photo={PHOTO.door} drift={7} className="gg-arrival-door" />
        </div>
      </section>

      {/* 04 · interior */}
      <section className="gg-interior">
        <Frame photo={PHOTO.bedView} drift={12} className="gg-interior-hero" />
        <div className="gg-interior-row">
          <div className="gg-interior-copy">
            <Headline text="You wake up already facing it." size={56} floor={30} measure={520} />
            <p className="gg-body gg-rv">
              The bed faces the glass, so the first thing you see is the river and
              the mountains. A small kitchen, a table for two in the glass corner,
              heated floors, robes and plush towels. Guests keep saying the same
              thing: smaller than the photographs, better laid out than they expected.
            </p>
          </div>
          <Frame photo={PHOTO.table} drift={8} className="gg-interior-side" />
        </div>
      </section>

      {/* 05 · evening, hot tub */}
      <section className="gg-evening">
        <div className="gg-evening-head">
          <Phase is="Kvöld" en="Evening" />
          <Headline text="Evening comes straight through the glass." size={64} floor={32} measure={640} />
        </div>
        <Frame photo={PHOTO.eveningBed} drift={12} className="gg-evening-bleed" />
        <div className="gg-evening-foot">
          <p className="gg-body gg-rv">
            Then the private hot tub on the terrace, above the river, for as long as the light lasts.
          </p>
          <p className="gg-stat gg-rv">45 of 112 reviews mention the hot tub</p>
        </div>
      </section>

      {/* 06 · the night scrub */}
      <section className="gg-scrub" id="nottin">
        <div className="gg-scrub-inner">
          <div className="gg-scrub-day">
            <img src={SCRUB.day.src} srcSet={srcSet(SCRUB.day.src, SCRUB.day.w)} sizes="100vw"
              alt={SCRUB.day.alt} loading="lazy" decoding="async" />
          </div>
          <canvas className="gg-scrub-canvas" aria-hidden="true" />
          <div className="gg-scrub-caps">
            <Phase is="Nótt" en="Night" />
            <div className="gg-scrub-captext">
              <p className="gg-scrub-cap gg-scrub-cap-day">Stay one night.</p>
              <p className="gg-scrub-cap gg-scrub-cap-night">
                Clear nights are never promised. Guests have watched the northern
                lights from the hot tub.
              </p>
            </div>
          </div>
        </div>
        {/* static / mobile fallback: the aurora photo simply follows */}
        <figure className="gg-scrub-fallback">
          <img src={SCRUB.night.src} srcSet={srcSet(SCRUB.night.src, SCRUB.night.w)} sizes="100vw"
            alt={SCRUB.night.alt} loading="lazy" decoding="async" />
          <figcaption className="gg-stat">
            Photographed at the cabin, from its own listing.
          </figcaption>
        </figure>
      </section>

      {/* 07 · guests */}
      <section className="gg-guests" id="gestir">
        <Headline text="What guests keep saying." size={64} floor={32} measure={620} />
        <p className="gg-guests-meta gg-rv">
          {HOST.rating} of 5 across {HOST.reviewCount} reviews · Superhost ·{' '}
          {HOST.yearsHosting} years hosting · Booking.com {HOST.booking.score} of 10 across{' '}
          {HOST.booking.reviews}
        </p>
        <ul className="gg-quotes">
          {REVIEW_QUOTES.map((q) => (
            <li key={q.author} className="gg-quote gg-rv">
              <blockquote>
                <p>{'“'}{q.quote}{'”'}</p>
              </blockquote>
              <p className="gg-quote-by">{q.author}, {q.when}</p>
            </li>
          ))}
        </ul>
        <dl className="gg-themes gg-rv" aria-label="What reviews mention most">
          {REVIEW_THEMES.map((t) => (
            <div key={t.theme}><dt>{t.theme}</dt><dd>{t.mentions}</dd></div>
          ))}
        </dl>
        <p className="gg-stat gg-rv">
          Counts from the Airbnb listing's own review index, October 2026.
        </p>
      </section>

      {/* 08 · the place */}
      <section className="gg-place">
        <div className="gg-place-copy">
          <Headline text="South Iceland, from a quiet ridge." size={56} floor={30} measure={540} />
          <ul className="gg-place-list gg-rv">
            {LOCAL_AREA.map((p) => (
              <li key={p.name}>
                <span className="gg-place-name">{p.name}</span>
                <span className="gg-place-note">{p.note}</span>
                <span className="gg-place-dist">{p.dist}</span>
              </li>
            ))}
          </ul>
        </div>
        <Frame photo={PHOTO.auroraHill} drift={8} className="gg-place-fig" />
      </section>

      {/* 09 · booking */}
      <section className="gg-book" id="boka">
        <div className="gg-book-intro">
          <Headline text="Ask for your night." size={72} floor={34} measure={560} />
          <p className="gg-body gg-rv">
            Requests go straight to the hosts, a couple from Iceland who answer
            within the hour, in English, Icelandic or Norwegian.
          </p>
          <div className="gg-owner-note gg-rv">
            <p className="gg-owner-note-label">The owner's dashboard</p>
            <p className="gg-owner-note-body">
              Every request lands in a dashboard built for this house: confirm or
              decline in one tap, watch the week fill up.{' '}
              <Link className="gg-a" to="/preview/glacialglass/stjornbord">
                See how direct bookings would work
              </Link>{' '}
              beside this tab and send yourself a request.
            </p>
          </div>
        </div>
        <BookingForm />
      </section>

      {/* page footer facts */}
      <footer className="gg-foot">
        <div className="gg-foot-grid">
          <div>
            <p className="gg-foot-mark" translate="no">GLACIAL GLASS CABIN</p>
            <p className="gg-foot-line">Svínhagi, near Hella, South Iceland</p>
          </div>
          <div>
            <p className="gg-foot-line">Licence nr. {HOST.licenceNr}</p>
            <p className="gg-foot-line">Guests: {FACTS.guests} · {FACTS.sleeps} · {FACTS.size}</p>
          </div>
          <div>
            <p className="gg-foot-line">
              Photography: the cabin's own listing photos, retrieved October 2026.
              The day-to-night film is generated between two of them.
            </p>
            <p className="gg-foot-line">
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

.gg-root {
  --u: clamp(.44px, 100vw / 1440, 1.15px);
  --gg-c: ${ICE};
  --gg-ink: ${ROCK};
  --gg-soft: #DDE6EC;
  --gg-aurora: ${AURORA};
  /* the aurora green reads at 1.66:1 on the ice canvas; text that uses the
     accent needs a deeper version of the same hue while the page is light */
  --gg-accent-text: #1F6647;
  --gg-mute: color-mix(in srgb, var(--gg-ink) 78%, transparent);
  --gg-hair: color-mix(in srgb, var(--gg-ink) 17%, transparent);
  background: var(--gg-c);
  color: var(--gg-ink);
  font-family: ${DISPLAY};
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
.gg-root ::selection { background: var(--gg-aurora); color: ${BASALT}; }
.gg-root a { color: inherit; }
.gg-root :focus-visible {
  outline: 2px solid var(--gg-aurora);
  outline-offset: 2px;
  border-radius: 2px;
}
.gg-root a, .gg-root button, .gg-root input, .gg-root select, .gg-root textarea {
  touch-action: manipulation;
}
.gg-a:hover { color: var(--gg-aurora); }

/* nav: borderless, no fill, painted near-white under mix-blend difference —
   it inverts against whatever passes beneath it (bright sky -> dark ink, rock
   and night -> light), so it never needs a bar to stay legible */
.gg-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 40;
  /* three columns so the mark sits on the true centre line, whatever the
     links and the CTA measure */
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  gap: calc(var(--u) * 40);
  padding: calc(var(--u) * 22) calc(var(--u) * 48);
  color: #F2F6F8;
  mix-blend-mode: difference;
}
.gg-nav, .gg-wordmark { transition: color .3s cubic-bezier(.25,1,.5,1); }
.gg-chrome-solid .gg-nav, .gg-chrome-solid .gg-wordmark { mix-blend-mode: normal; color: ${BASALT}; }
.gg-chrome-solid.gg-chrome-light .gg-nav, .gg-chrome-solid.gg-chrome-light .gg-wordmark { color: #F2F6F8; }
.gg-chrome-film .gg-nav, .gg-chrome-film .gg-wordmark { mix-blend-mode: normal; color: #F2F6F8; }
.gg-nav-scrim {
  position: fixed; top: 0; left: 0; right: 0; z-index: 39; height: 160px;
  pointer-events: none; opacity: 0;
  background: linear-gradient(180deg, rgba(10,18,27,.84) 0%, rgba(10,18,27,.6) 40%, rgba(10,18,27,0) 100%);
}
.gg-nav-mark {
  grid-column: 2; grid-row: 1;
  font-weight: 300; letter-spacing: .1em; margin-right: -.1em; text-decoration: none;
  font-size: ${fluid(16, 15)};
}
/* with motion on, the visible header mark is the hero wordmark itself, landed;
   this link stays as its click target and accessible name */
.gg-js .gg-nav-mark { color: transparent; }
.gg-nav-links { grid-column: 1; grid-row: 1; justify-self: start; display: flex; gap: calc(var(--u) * 28); }
.gg-nav-links a {
  text-decoration: none; font-size: ${fluid(14, 15)}; color: inherit;
  opacity: .68; transition: opacity .25s ease;
}
.gg-nav-links a:hover { opacity: 1; }
.gg-nav-cta {
  grid-column: 3; grid-row: 1; justify-self: end;
  text-decoration: none; font-size: ${fluid(14, 15)}; font-weight: 500;
  padding: calc(var(--u) * 10) calc(var(--u) * 18);
  border: 1px solid color-mix(in srgb, currentColor 38%, transparent);
  border-radius: 2px;
  transition: border-color .25s ease;
}
.gg-nav-cta:hover { border-color: currentColor; }
.gg-cta-short { display: none; }
@media (max-width: 480px) {
  .gg-cta-long { display: none; }
  .gg-cta-short { display: inline; }
}

/* hero: the nav is FIXED and out of flow, so the image starts at true y=0 with
   no canvas strip above it. The wordmark sits dead centre and takes its hues
   from whatever each letter happens to cover — mix-blend difference over a
   gently desaturated photo (Búðir §6: the desat is what keeps the invert a
   controlled hue instead of psychedelic). */
.gg-hero { position: relative; min-height: 100svh; display: grid; }
/* The photograph lives in a fixed box and drifts inside it (Heklusyn):
   overflow hidden, an oversized inner wrapper, --dz derived from the drift
   so the image can never run out of overhang at the extremes of travel. */
.gg-hero-media { position: absolute; inset: 0; overflow: hidden; }
.gg-hero-media img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  filter: saturate(.78) contrast(1.02);
}
.gg-js .gg-hero-media:not(.is-in) img { filter: saturate(.55) blur(10px); }
.gg-hero-media::after {
  content: ''; position: absolute; inset: 0; z-index: 1;
  /* their moor is far brighter than Mirror House's cliff, so the copy corner
     needs a deeper floor than the 200deg wash alone gives it */
  background:
    linear-gradient(200deg, transparent 42%, rgba(10,18,27,.55) 100%),
    linear-gradient(0deg, rgba(10,18,27,.62) 0%, transparent 46%);
}
/* GLACIAL | GLASS, parted by a hairline. The LOCKUP is centred as a whole
   (GLACIAL is two letters longer, so centring on the seam read as off-centre). */
.gg-wordmark {
  /* Lifted out of the centre and into the sky. Under mix-blend difference the
     type is |#F2F6F8 - photo|: over this photo's mountain band (measured mean
     luminance ~100/255) that is mid-grey on mid-grey and the name all but
     vanished. The sky band above reads ~220, which inverts to near-black ink. */
  position: absolute; top: max(15svh, 96px); left: 0; right: 0; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  margin: 0; pointer-events: none;
  transform-origin: 50% 50%;
  color: #F2F6F8;
  mix-blend-mode: difference;
  font-size: clamp(38px, 8.6vw, 132px);
  line-height: 1.02;
}
.gg-wm-word {
  /* Light, not Extralight: a 200 hairline loses too much under the invert */
  display: block; font-weight: 300; letter-spacing: .1em;
  white-space: nowrap; will-change: clip-path, transform;
}
/* each word's trailing letter-space is cancelled, so the ink, not the boxes,
   is what sits centred */
.gg-wm-glacial { padding-right: .34em; margin-right: -.1em; }
.gg-wm-glass { padding-left: .34em; margin-right: -.1em; }
/* fixed once motion is on: it rides up into the header (see the hand-off) */
.gg-js .gg-wordmark { position: fixed; z-index: 41; will-change: transform; }
.gg-wm-seam {
  flex: none; width: 1px; height: .96em; background: currentColor;
  opacity: .85; transform-origin: 50% 50%;
}
.gg-hero-block {
  position: relative; align-self: end; z-index: 1;
  padding: 0 calc(var(--u) * 48) calc(calc(var(--u) * 64) + env(safe-area-inset-bottom, 0px));
  color: #F2F6F8;
  max-width: calc(var(--u) * 900);
}
.gg-hero-sub {
  margin: 0;
  font-size: ${fluid(19, 15)}; line-height: 1.55; font-weight: 400;
  max-width: 44ch; color: #F2F6F8;
  text-shadow: 0 1px 22px rgba(10,18,27,.6), 0 0 2px rgba(10,18,27,.35);
}
/* the hero asks quietly: a rule that draws itself in from the left on hover,
   never a filled chip sitting on the photograph */
.gg-hero-link {
  display: inline-block; margin-top: calc(var(--u) * 24);
  font-size: ${fluid(16, 14)}; font-weight: 500; letter-spacing: .01em;
  color: #F2F6F8; text-decoration: none; position: relative;
  text-shadow: 0 1px 18px rgba(10,18,27,.6);
  padding-bottom: 3px;
}
.gg-hero-link::after {
  content: ''; position: absolute; left: 0; bottom: 0; height: 1px; width: 100%;
  background: currentColor; transform: scaleX(0); transform-origin: left;
  transition: transform .45s cubic-bezier(.23,1,.32,1);
}
@media (hover: hover) and (pointer: fine) {
  .gg-hero-link:hover::after { transform: scaleX(1); }
}
.gg-hero-link:focus-visible::after { transform: scaleX(1); }

.gg-cta {
  display: inline-block; margin-top: calc(var(--u) * 26);
  background: var(--gg-aurora); color: ${BASALT};
  font-weight: 500; font-size: ${fluid(15, 13)}; text-decoration: none;
  padding: calc(var(--u) * 14) calc(var(--u) * 26);
  border: 0; border-radius: 2px; cursor: pointer;
  transition: transform .15s ease, filter .25s ease;
}
.gg-cta:hover { filter: brightness(1.06); }
.gg-cta:active { transform: translateY(1px); }

/* shared text */
.gg-headline {
  margin: 0; font-weight: 200; letter-spacing: -.01em; line-height: 1.12;
  text-wrap: balance;
}
.gg-line {
  display: inline-block; overflow: hidden; vertical-align: bottom;
  padding: .2em .04em .12em; margin: -.2em -.04em -.12em;
}
.gg-word { display: inline-block; }
.gg-body {
  font-size: ${fluid(17, 15)}; line-height: 1.62; font-weight: 300;
  color: var(--gg-mute); max-width: 58ch; margin: calc(var(--u) * 26) 0 0;
  transition: color .4s ease;
}
.gg-phase {
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .16em;
  text-transform: uppercase; color: var(--gg-mute); margin: 0 0 calc(var(--u) * 18);
}
.gg-scrub-caps .gg-phase { margin-bottom: calc(var(--u) * 14); }
.gg-phase-is { color: var(--gg-accent-text); }
.gg-stat {
  font-family: ${MONO}; font-size: ${fluid(12, 12)};
  color: var(--gg-mute); margin: calc(var(--u) * 14) 0 0;
}
.gg-a { color: inherit; }

/* frames: drift + condensation-clear */
.gg-frame {
  position: relative; overflow: hidden; margin: 0; background: var(--gg-soft);
}
.gg-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; }
/* translate3d already promotes these; the extra hint is only worth its memory
   where there is memory to spare */
@media (min-width: 992px) { .gg-frame-in { will-change: transform; } }
.gg-frame-in img {
  width: 100%; height: 100%; max-width: none; object-fit: cover; display: block;
}
/* condensation-clear: a blur/saturate resolve, like breath fading off glass.
   No clip/mask on the frames: a resting clip-path on a box whose child
   transforms every frame de-optimizes compositing (measured: 60fps -> 30fps),
   and mask-image gradients don't interpolate at all. The wipe vocabulary
   lives in the night scrub, where scroll drives it. */
.gg-js .gg-rv img {
  transition: filter 1.15s cubic-bezier(.25,1,.5,1), opacity 1.15s cubic-bezier(.25,1,.5,1);
}
.gg-js .gg-rv:not(.is-in) img {
  filter: blur(10px) saturate(.55);
  opacity: .35;
}
/* the hero media is a full-bleed backdrop, never a rising block */
.gg-js .gg-rv:not(.gg-frame):not(.gg-hero-media):not(.is-in) { opacity: 0; transform: translateY(26px); }
.gg-js .gg-rv:not(.gg-frame):not(.gg-hero-media) {
  transition: opacity .9s cubic-bezier(.25,1,.5,1), transform .9s cubic-bezier(.25,1,.5,1);
}

/* sections */
.gg-manifesto {
  display: grid; grid-template-columns: 7fr 4fr; align-items: end;
  gap: calc(var(--u) * 96);
  padding: calc(var(--u) * 190) calc(var(--u) * 48) calc(var(--u) * 150);
  max-width: calc(var(--u) * 1440); margin: 0 auto;
}
.gg-manifesto-fig { width: 100%; }

.gg-arrival {
  display: grid; grid-template-columns: 5fr 6fr; gap: calc(var(--u) * 96);
  padding: calc(var(--u) * 60) calc(var(--u) * 48) calc(var(--u) * 150);
  max-width: calc(var(--u) * 1440); margin: 0 auto; align-items: start;
}
.gg-facts { margin: calc(var(--u) * 40) 0 0; }
.gg-facts div {
  display: grid; grid-template-columns: calc(var(--u) * 160) 1fr;
  gap: calc(var(--u) * 24);
  padding: calc(var(--u) * 14) 0; border-top: 1px solid var(--gg-hair);
}
.gg-facts dt {
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; text-transform: uppercase;
  letter-spacing: .14em; color: var(--gg-mute); padding-top: 2px;
}
.gg-facts dd { margin: 0; font-size: ${fluid(15, 14)}; font-weight: 300; line-height: 1.5; }
.gg-arrival-figs {
  display: grid; grid-template-columns: 3fr 2fr; gap: calc(var(--u) * 24);
  align-items: start;
}
.gg-arrival-door { margin-top: calc(var(--u) * 96); }

.gg-interior { padding: calc(var(--u) * 60) 0 calc(var(--u) * 150); }
.gg-interior-hero {
  width: min(100%, calc(var(--u) * 1240)); margin: 0 auto;
}
.gg-interior-row {
  display: grid; grid-template-columns: 6fr 4fr; gap: calc(var(--u) * 96);
  align-items: start; max-width: calc(var(--u) * 1240);
  margin: calc(var(--u) * 90) auto 0; padding: 0 calc(var(--u) * 48);
}
.gg-interior-side { margin-top: calc(var(--u) * 40); }

.gg-evening { padding: calc(var(--u) * 60) 0 calc(var(--u) * 170); }
.gg-evening-head {
  max-width: calc(var(--u) * 1440); margin: 0 auto calc(var(--u) * 64);
  padding: 0 calc(var(--u) * 48);
}
.gg-evening-bleed { width: 100%; aspect-ratio: 21 / 9 !important; }
.gg-evening-foot {
  display: flex; flex-wrap: wrap; gap: calc(var(--u) * 40); align-items: baseline;
  justify-content: space-between;
  max-width: calc(var(--u) * 1440); margin: calc(var(--u) * 40) auto 0;
  padding: 0 calc(var(--u) * 48);
}
.gg-evening-foot .gg-body {
  margin: 0; color: var(--gg-ink); font-weight: 300;
  font-size: ${fluid(23, 17)}; max-width: 30ch;
}
.gg-evening-foot .gg-stat {
  margin: 0; color: var(--gg-accent-text); font-size: ${fluid(16, 14)};
  letter-spacing: .04em;
}

/* the night scrub */
.gg-scrub-inner {
  position: relative; height: 100svh; overflow: hidden; background: ${BASALT};
}
.gg-scrub-day, .gg-scrub-day img, .gg-scrub-canvas {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
}
.gg-scrub-day img { display: block; }
/* the film sits over the daylight still, which stays up until frames land */
.gg-scrub-canvas { display: block; z-index: 1; }
.gg-scrub-caps {
  position: absolute; left: calc(var(--u) * 48); bottom: calc(var(--u) * 56);
  z-index: 3; color: #F2F6F8;
}
.gg-scrub-caps .gg-phase { color: rgba(242,246,248,.72); }
/* Both captions occupy the SAME grid cell, so they crossfade in place and the
   box is always as tall as the taller of the two. Absolute positioning with a
   fixed min-height was wrong: on a narrow screen the night line wraps to three
   lines, overflows its box upward and collides with the phase label above. */
.gg-scrub-captext { display: grid; align-items: end; }
.gg-scrub-cap {
  grid-area: 1 / 1; margin: 0;
  font-weight: 200; font-size: ${fluid(44, 23)}; line-height: 1.18;
  letter-spacing: -.01em; max-width: 32ch;
}
.gg-scrub-cap-night { opacity: 0; }
.gg-scrub-inner::after {
  content: ''; position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(200deg, transparent 55%, rgba(10,18,27,.5) 100%);
}
.gg-scrub-fallback { display: none; margin: 0; }
.gg-scrub-fallback img { width: 100%; display: block; aspect-ratio: 3 / 2; object-fit: cover; }
.gg-scrub-fallback figcaption { padding: calc(var(--u) * 14) calc(var(--u) * 48) 0; }

/* guests */
.gg-guests {
  padding: calc(var(--u) * 170) calc(var(--u) * 48);
  max-width: calc(var(--u) * 1240); margin: 0 auto;
}
.gg-guests-meta {
  font-family: ${MONO}; font-size: ${fluid(13, 12)}; color: var(--gg-mute);
  margin: calc(var(--u) * 20) 0 0;
}
.gg-quotes {
  list-style: none; margin: calc(var(--u) * 72) 0 0; padding: 0;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 56);
}
.gg-quote blockquote { margin: 0; }
.gg-quote blockquote p {
  margin: 0; font-size: ${fluid(21, 16)}; line-height: 1.45; font-weight: 300;
}
.gg-quote-by {
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--gg-mute);
  margin: calc(var(--u) * 18) 0 0;
}
.gg-themes {
  display: flex; flex-wrap: wrap; gap: calc(var(--u) * 56) calc(var(--u) * 72);
  margin: calc(var(--u) * 88) 0 0; padding: calc(var(--u) * 28) 0 0;
  border-top: 1px solid var(--gg-hair);
}
.gg-themes div { display: flex; align-items: baseline; gap: calc(var(--u) * 14); }
.gg-themes dt { font-size: ${fluid(15, 13)}; font-weight: 300; color: var(--gg-mute); }
.gg-themes dd {
  margin: 0; font-family: ${MONO}; font-size: ${fluid(28, 20)}; color: var(--gg-ink);
}

/* the place */
.gg-place {
  display: grid; grid-template-columns: 7fr 4fr; gap: calc(var(--u) * 96);
  padding: calc(var(--u) * 40) calc(var(--u) * 48) calc(var(--u) * 170);
  max-width: calc(var(--u) * 1440); margin: 0 auto; align-items: start;
}
.gg-place-list { list-style: none; margin: calc(var(--u) * 56) 0 0; padding: 0; }
.gg-place-list li {
  display: grid; grid-template-columns: calc(var(--u) * 190) 1fr auto;
  gap: calc(var(--u) * 28); align-items: baseline;
  padding: calc(var(--u) * 18) 0; border-top: 1px solid var(--gg-hair);
}
.gg-place-name { font-weight: 400; font-size: ${fluid(17, 15)}; }
.gg-place-note { font-weight: 300; font-size: ${fluid(15, 13)}; color: var(--gg-mute); line-height: 1.5; }
.gg-place-dist { font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--gg-mute); }

/* booking */
.gg-book {
  display: grid; grid-template-columns: 5fr 6fr; gap: calc(var(--u) * 96);
  padding: calc(var(--u) * 40) calc(var(--u) * 48) calc(var(--u) * 190);
  max-width: calc(var(--u) * 1440); margin: 0 auto; align-items: start;
}
.gg-book-form, .gg-book-done {
  background: var(--gg-soft);
  border: 1px solid var(--gg-hair); border-radius: 2px;
  padding: calc(var(--u) * 40);
  transition: background .4s ease;
}
.gg-book-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 22); }
.gg-field { display: flex; flex-direction: column; gap: 6px; }
.gg-field-wide { grid-column: 1 / -1; }
.gg-field-label {
  font-family: ${MONO}; font-size: ${fluid(11, 12)}; letter-spacing: .12em;
  text-transform: uppercase; color: var(--gg-mute);
}
.gg-optional { text-transform: none; letter-spacing: 0; }
.gg-field input, .gg-field select, .gg-field textarea {
  font: inherit; font-size: 16px; font-weight: 300;
  color: var(--gg-ink); background: color-mix(in srgb, var(--gg-c) 55%, transparent);
  border: 1px solid var(--gg-hair); border-radius: 2px;
  padding: 10px 12px; min-height: 44px;
}
.gg-field textarea { min-height: 0; resize: vertical; }
.gg-night { --gg-accent-text: ${AURORA}; }
.gg-night .gg-field input, .gg-night .gg-field select, .gg-night .gg-field textarea { color-scheme: dark; }
.gg-owner-note {
  margin-top: calc(var(--u) * 48); padding-top: calc(var(--u) * 24);
  border-top: 1px solid var(--gg-hair);
}
.gg-owner-note-label {
  font-family: ${MONO}; font-size: ${fluid(11, 12)}; letter-spacing: .14em;
  text-transform: uppercase; color: var(--gg-accent-text); margin: 0 0 calc(var(--u) * 10);
}
.gg-owner-note-body {
  font-size: ${fluid(14, 13)}; font-weight: 300; line-height: 1.65;
  color: var(--gg-mute); margin: 0; max-width: 44ch;
}
.gg-field-error { color: #C86A5A; font-size: ${fluid(14, 13)}; margin: calc(var(--u) * 18) 0 0; }
.gg-book-form .gg-cta { margin-top: calc(var(--u) * 28); width: 100%; text-align: center; }
.gg-book-note {
  font-size: ${fluid(13, 12)}; font-weight: 300; line-height: 1.6;
  color: var(--gg-mute); margin: calc(var(--u) * 18) 0 0;
}
.gg-book-done-title { margin: 0; font-weight: 200; font-size: ${fluid(34, 22)}; }
.gg-book-done-body {
  margin: calc(var(--u) * 18) 0 0; font-weight: 300; line-height: 1.6;
  font-size: ${fluid(16, 14)};
}
.gg-ghost {
  margin-top: calc(var(--u) * 24);
  font: inherit; font-size: ${fluid(14, 13)}; font-weight: 400; cursor: pointer;
  background: none; color: var(--gg-ink);
  border: 1px solid var(--gg-hair); border-radius: 2px;
  padding: calc(var(--u) * 10) calc(var(--u) * 18);
}
.gg-ghost:hover { border-color: var(--gg-aurora); }

/* preloader: basalt sheet, wordmark filling with real load progress, then
   the sheet lifts to reveal the day. */
.gg-loader {
  position: fixed; inset: 0; z-index: 60;
  background: ${BASALT};
  display: grid; place-content: center;
  transition: transform .95s cubic-bezier(.76, 0, .24, 1);
}
.gg-loader.is-leaving { transform: translateY(-100%); }
.gg-loader-mark {
  margin: 0; font-weight: 200; letter-spacing: .1em; margin-right: -.1em;
  font-size: clamp(34px, 7.6vw, 120px); white-space: nowrap; line-height: 1;
  background-image: linear-gradient(90deg, #EDF2F5 50%, rgba(237,242,245,.16) 50%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}
.gg-loader-pct {
  position: fixed; left: calc(var(--u) * 48); bottom: calc(var(--u) * 40);
  margin: 0; font-family: ${MONO}; font-size: 12px; letter-spacing: .16em;
  color: rgba(159,176,189,.85);
}

/* footer */
.gg-foot { border-top: 1px solid var(--gg-hair); }
.gg-foot-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 48);
  max-width: calc(var(--u) * 1440); margin: 0 auto;
  padding: calc(var(--u) * 56) calc(var(--u) * 48) calc(var(--u) * 72);
}
.gg-foot-mark { font-weight: 300; letter-spacing: .22em; font-size: ${fluid(14, 15)}; margin: 0 0 calc(var(--u) * 12); }
.gg-foot-line {
  font-size: ${fluid(13, 15)}; font-weight: 300; line-height: 1.6;
  color: var(--gg-mute); margin: 0 0 calc(var(--u) * 8);
}

/* ── responsive ── */
@media (max-width: 991px) {
  .gg-nav { padding: 10px 20px; gap: 16px; }
  /* 44px minimum on everything touchable: the fluid unit pins at its floor
     here, so calc()-based padding collapses and these measured 18-32px tall */
  .gg-nav-mark, .gg-nav-cta, .gg-nav-links a, .gg-hero-link {
    display: inline-flex; align-items: center; min-height: 44px;
  }
  .gg-nav-cta { padding: 0 16px; }
  .gg-hero-link { padding-bottom: 0; }
  .gg-hero-link::after { bottom: 10px; }
  .gg-cta { min-height: 44px; padding: 12px 22px; }
  .gg-ghost { min-height: 44px; padding: 10px 18px; }
  .gg-nav-links { display: none; }
  /* the landed hero mark scales to this size; 13px keeps it clear of the CTA at 375 */
  .gg-nav-mark { font-size: 13px; }
  .gg-nav-cta { white-space: nowrap; }
  .gg-nav-cta { margin-left: auto; }
  .gg-hero-block { padding: 0 20px 40px; }
  /* the seam and both words stay on one line; the clamp already shrinks it */
  .gg-wordmark { font-size: clamp(26px, 9vw, 62px); }
  .gg-manifesto, .gg-arrival, .gg-place, .gg-book,
  .gg-interior-row { grid-template-columns: 1fr; gap: 48px; padding-left: 20px; padding-right: 20px; }
  .gg-manifesto { padding-top: 96px; padding-bottom: 80px; }
  .gg-arrival, .gg-place, .gg-book { padding-bottom: 80px; }
  .gg-arrival-figs { grid-template-columns: 1fr; }
  .gg-arrival-door { margin-top: 0; }
  .gg-interior-side { margin-top: 0; }
  .gg-evening-head, .gg-evening-foot, .gg-guests { padding-left: 20px; padding-right: 20px; }
  .gg-evening-bleed { aspect-ratio: 4 / 3 !important; }
  .gg-quotes { grid-template-columns: 1fr; gap: 36px; }
  .gg-book-grid { grid-template-columns: 1fr; }
  .gg-place-list li { grid-template-columns: 1fr; gap: 6px; }
  .gg-foot-grid { grid-template-columns: 1fr; gap: 24px; padding: 40px 20px; }
}

/* Phone only: no pin, so the film is replaced by its two stills. Tablets and
   up keep the scrubbed clip even though their grids have collapsed. */
/* The film plays on phones too, so the section stays pinned and the two-still
   fallback stays out of the way. Only reduced motion falls back now. */
@media (max-width: 767px) {
  .gg-scrub-caps { left: 20px; bottom: 32px; }
  .gg-scrub-cap { font-size: clamp(22px, 6.4vw, 30px); max-width: 20ch; }
}

/* ── reduced motion: every device collapses to its resting state ── */
@media (prefers-reduced-motion: reduce) {
  .gg-root * { transition: none !important; animation: none !important; }
  .gg-frame-in { inset: 0; transform: none !important; }
  .gg-word { transform: none !important; opacity: 1 !important; }
  /* the name is simply open, the line already drawn */
  .gg-wm-word { clip-path: none !important; transform: none !important; opacity: 1 !important; }
  .gg-wm-seam { transform: none !important; opacity: .85 !important; }
  .gg-scrub-inner { height: auto; }
  .gg-scrub-day { position: relative; inset: auto; }
  .gg-scrub-day img { position: relative; aspect-ratio: 3 / 2; }
  .gg-scrub-canvas { display: none; }
  .gg-scrub-cap-night { display: none; }
  .gg-scrub-fallback { display: block; }
}
.gg-static .gg-frame-in { inset: 0; }
`
