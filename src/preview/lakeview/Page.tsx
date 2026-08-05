import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setNoindex, setThemeColor } from '../../lib/preview'
import { demo, type DemoBooking } from './demoStore'
import {
  FACTS, GOLDEN_CIRCLE, HOST, JSON_LD, PHOTO, REVIEW_QUOTES, REVIEW_THEMES, srcSet,
} from './content'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('lakeview')

/* ── ICELAND LAKEVIEW RETREAT · "AF LANDINU" ───────────────────────────────
   A turf-roofed cabin the drone can barely find in its own moss. The page
   plays that hide-and-reveal once, structurally: it opens on the land (a
   locked-off film of the moor and the lake), then a pinned scroll pulls back
   out of the roof's own moss texture until the house resolves inside it.
   Everything after is the house on its own terms: three waters, one gable
   interior, one night under aurora, the real geography around it. Full spec:
   ./DESIGN.md.

   THE FLUID UNIT IS SCOPED, NOT GLOBAL: everything scales off --u on this
   page's root only ([[no-style-bleed-between-designs]]).

   ICELANDIC GLYPHS: display leading never below 1.12 with .2em mask headroom,
   split per WORD never per character (Í Á Ú Þ risk).

   Motion identity (one per site): "waterline". Every photograph arrives by a
   rising clip-path from the bottom, a feathered edge that fades as it opens,
   blur falling away and a small spring settle. Once settled, the clip-path is
   removed entirely (not left resting at 0) so any per-frame drift underneath
   never fights the compositor ([[mirrorhouse]] measured that cost directly).
   Text rises through word masks. The night ground eases in and back out for
   ONE section only — never a page-wide scrub, which is Mirror House's spine,
   not this site's. ─────────────────────────────────────────────────────── */

const CANVAS = '#E9EDEE'
const INK = '#26221F'
const NIGHT = '#171A20'
const GOLD = '#C8964F'

const DISPLAY = "'Cabinet Grotesk', system-ui, sans-serif"
const BODY_FONT = "'Author', system-ui, sans-serif"
const MONO = "'Basier Mono', ui-monospace, monospace"

const BASE = import.meta.env.BASE_URL

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const hoverOk = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true

/** The hero film plays unless motion is reduced or the connection asks not to. */
const filmOk = () => {
  if (typeof window === 'undefined' || reduced()) return false
  try {
    if (window.matchMedia?.('(prefers-reduced-data: reduce)').matches) return false
  } catch {
    /* unsupported media feature: treat as not set */
  }
  const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection
  return !conn?.saveData
}

/** Fluid size with a phone floor: --u pins small on narrow viewports. */
const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a || 1)))
  return t * t * (3 - 2 * t)
}

/* ── motion engine ─────────────────────────────────────────────────────── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const root = document.querySelector<HTMLElement>('.lv-root')
    if (!root) return

    if (reduced()) {
      root.classList.add('lv-static')
      return
    }

    root.classList.add('lv-js')
    ScrollTrigger.config({ ignoreMobileResize: true })
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    /* waterline reveal: IO arms 'is-in' once; CSS owns the transition
       ([[framer-reveals-unreliable]] - CSS transitions, not mount state).
       Once each reveal box finishes its clip-path transition, the clip-path
       is stripped entirely (added 'is-settled'), so a drift frame underneath
       never keeps a resting clip-path fighting the compositor. */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.2 },
    )
    root.querySelectorAll('.lv-rv').forEach((el) => io.observe(el))
    root.querySelectorAll<HTMLElement>('.lv-frame-reveal').forEach((el) => {
      el.addEventListener('transitionend', (e) => {
        // Chromium reports this as the longhand -webkit-mask-position-x/-y,
        // never the shorthand, so match loosely or this never fires.
        if ((e as TransitionEvent).propertyName.includes('mask-position')) {
          el.classList.add('is-settled')
        }
      })
    })

    /* focusin failsafe: a keyboard user tabbing ahead of the scroll position
       must never land on content still hidden by an in-progress reveal. */
    const onFocusIn = (e: FocusEvent) => {
      const rv = (e.target as HTMLElement).closest?.('.lv-rv')
      rv?.classList.add('is-focus-forced')
      const find = (e.target as HTMLElement).closest?.('.lv-find')
      find?.classList.add('is-focus-forced')
      const night = (e.target as HTMLElement).closest?.('.lv-night')
      night?.classList.add('is-focus-forced')
    }
    const onFocusOut = (e: FocusEvent) => {
      const rv = (e.target as HTMLElement).closest?.('.lv-rv')
      rv?.classList.remove('is-focus-forced')
      const find = (e.target as HTMLElement).closest?.('.lv-find')
      find?.classList.remove('is-focus-forced')
      const night = (e.target as HTMLElement).closest?.('.lv-night')
      night?.classList.remove('is-focus-forced')
    }
    root.addEventListener('focusin', onFocusIn)
    root.addEventListener('focusout', onFocusOut)

    /* drift: Heklusýn spec, batched reads then writes, off-screen skipped.
       Only the "Inside" section's frames opt in (data-lv-drift). */
    const driftEls = Array.from(root.querySelectorAll<HTMLElement>('.lv-frame-drift'))
    const drift = () => {
      const vh = window.innerHeight
      const writes: [HTMLElement, string][] = []
      for (const el of driftEls) {
        const box = el.closest('.lv-frame')
        if (!box) continue
        const r = box.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const d = Number(el.dataset.drift || 9)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * d).toFixed(2)}%,0)`])
      }
      for (const [el, t] of writes) el.style.transform = t
    }

    const ctx = gsap.context(() => {
      // word-mask rises (the hero wordmark is handled on its own below,
      // gated on the loader, so it is intentionally excluded here)
      root.querySelectorAll<HTMLElement>('[data-lv-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.lv-word')
        if (!words.length) return
        gsap.fromTo(
          words,
          { yPercent: 116, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            duration: 1.05, ease: 'expo.out', stagger: 0.06,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          },
        )
      })

      // hero wordmark: rises once, gated behind the loader if one is present
      const heroWord = root.querySelector<HTMLElement>('.lv-wordmark .lv-word')
      if (heroWord) {
        gsap.set(heroWord, { yPercent: 116, opacity: 0 })
        const openWordmark = () => {
          gsap.to(heroWord, { yPercent: 0, opacity: 1, duration: 1.15, ease: 'expo.out' })
        }
        if (root.querySelector('.lv-loader')) {
          window.addEventListener('lv:revealed', openWordmark, { once: true })
        } else {
          gsap.delayedCall(0.15, openWordmark)
        }
      }
      // hero: the wordmark (and its sub-block) fade and lift as the film
      // scrolls away, a generic hero-parallax pattern (not a signature device)
      const heroEl = root.querySelector<HTMLElement>('.lv-hero')
      const wordmarkEl = root.querySelector<HTMLElement>('.lv-wordmark')
      if (heroEl && wordmarkEl) {
        gsap.to(wordmarkEl, {
          opacity: 0.06, yPercent: -18, ease: 'none',
          scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
      }

      /* FINDING THE HOUSE — the signature scroll device. A single oversized
         image starts zoomed into the moss texture; scroll pulls it back until
         the turf roof and the path resolve. Transform + clip only, reversible.
         Desktop pins the section; under 768px there is no pin (a fixed-time
         tween plays once instead); reduced motion renders the resolved frame
         with no animation at all. */
      /* The pinned zoom-out that used to live here was cut on the client's
         instruction: this is now simply the aerial, full bleed, with its
         caption. No pin, no scrub, nothing to freeze the page against. */

      /* the night ground: eases --lv-night in and back out for THIS section
         only, never the whole page. A tent-shaped ease (in / hold / out)
         written straight onto the section's own custom property. */
      const nightSection = root.querySelector<HTMLElement>('.lv-night')
      if (nightSection) {
        ScrollTrigger.create({
          trigger: nightSection, start: 'top bottom', end: 'bottom top', scrub: true,
          onUpdate: (self) => {
            const p = self.progress
            const mix = p < 0.3 ? smoothstep(0, 0.3, p) : p > 0.7 ? 1 - smoothstep(0.7, 1, p) : 1
            nightSection.style.setProperty('--lv-night-mix', mix.toFixed(3))
          },
        })
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
      root.removeEventListener('focusin', onFocusIn)
      root.removeEventListener('focusout', onFocusOut)
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
      data-lv-headline
      aria-label={text}
      className={`lv-headline ${className}`}
      style={{
        fontSize: fluid(size, floor),
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      }}
    >
      {text.split(' ').map((w, i, arr) => (
        <span key={i} aria-hidden="true">
          <span className="lv-line"><span className="lv-word">{w}</span></span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/**
 * A photograph that arrives by the waterline: a rising clip-path with a
 * feathered edge, blur falling away, a small spring settle. `drift` opts a
 * frame into the Heklusýn parallax (Inside section only); everywhere else the
 * image simply sits still once revealed.
 */
function Frame({ photo, className = '', priority = false, drift, objectPosition }: {
  photo: { src: string; alt: string; ratio: string }
  className?: string; priority?: boolean; drift?: number; objectPosition?: string
}) {
  const img = (
    <img
      src={photo.src} srcSet={srcSet(photo.src)}
      sizes="(max-width: 991px) 100vw, 60vw"
      alt={photo.alt} loading={priority ? 'eager' : 'lazy'} decoding="async"
      style={objectPosition ? { objectPosition } : undefined}
    />
  )
  return (
    <figure className={`lv-frame lv-rv ${className}`} style={{ aspectRatio: photo.ratio }}>
      <div className="lv-frame-reveal">
        {drift ? (
          <div
            className="lv-frame-drift"
            data-drift={drift}
            style={{ '--dz': `${Math.max(9, drift * 1.3)}%` } as React.CSSProperties}
          >
            {img}
          </div>
        ) : img}
      </div>
    </figure>
  )
}

/* ── the night rotator ────────────────────────────────────────────────────
   Real guest lines about the night sky, crossfading on their own. All of them
   sit in ONE grid cell so the box sizes to the tallest and the layout can
   never jump between quotes. Rotation pauses on hover and while anything
   inside has focus; under reduced motion it does not rotate at all and every
   quote is simply stacked and readable. With no JS the first quote shows. */

const NIGHT_QUOTES = [REVIEW_QUOTES[1], REVIEW_QUOTES[4], REVIEW_QUOTES[3], REVIEW_QUOTES[0]]
const QUOTE_MS = 6000

function NightQuotes() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const still = reduced()

  useEffect(() => {
    if (still || paused) return
    const id = window.setInterval(() => setI((n) => (n + 1) % NIGHT_QUOTES.length), QUOTE_MS)
    return () => window.clearInterval(id)
  }, [still, paused])

  if (still) {
    return (
      <div className="lv-night-quotes is-static">
        {NIGHT_QUOTES.map((q) => (
          <blockquote key={q.author} className="lv-night-quote">
            <p>{'“'}{q.quote}{'”'}</p>
            <cite>{q.author}, {q.when}</cite>
          </blockquote>
        ))}
      </div>
    )
  }

  return (
    <div
      className="lv-night-quotes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-live="polite"
    >
      {NIGHT_QUOTES.map((q, n) => (
        <blockquote
          key={q.author}
          className={`lv-night-quote ${n === i ? 'is-on' : ''}`}
          aria-hidden={n === i ? undefined : true}
        >
          <p>{'“'}{q.quote}{'”'}</p>
          <cite>{q.author}, {q.when}</cite>
        </blockquote>
      ))}
    </div>
  )
}

/* ── the three waters ─────────────────────────────────────────────────────
   The page's one interaction class: a horizontal accordion of real buttons.
   Hover swaps the live pane on fine pointers; tap does the same on touch;
   every button is keyboard-reachable and announces its pressed state. */

type WaterKey = 'vatnid' | 'laugin' | 'badid'

function ThreeWaters() {
  const [active, setActive] = useState<WaterKey>('vatnid')
  const [winter, setWinter] = useState(false)
  const canHover = useRef(false)
  useEffect(() => { canHover.current = hoverOk() }, [])

  const panes: Array<{
    key: WaterKey; name: string; gloss: string
    photo: { src: string; alt: string; ratio: string }
    body: string; fact: string; objectPosition?: string
  }> = [
    {
      key: 'vatnid', name: 'Vatnið', photo: PHOTO.arrivalLake, objectPosition: '50% 68%',
      gloss: 'The lake',
      body: 'Úlfljótsvatn begins where the path ends. Fishing, kayaking and the area’s hiking trails all start at the water.',
      fact: 'Named in 64 of 207 reviews as the reason for the location',
    },
    {
      key: 'laugin', name: 'Laugin', photo: winter ? PHOTO.poolWinter : PHOTO.poolSunset,
      gloss: 'The geothermal pool',
      body: 'Outdoors, heated by the ground it sits on, open in every season. Guests use it as a hot tub and mostly call it one.',
      fact: '72 of 207 reviews mention it, several of them for the northern lights',
    },
    {
      key: 'badid', name: 'Baðið', photo: PHOTO.bathWide,
      gloss: 'The bath indoors',
      body: 'A freestanding bath at the floor-to-ceiling glass, with the lake filling the window.',
      fact: 'Indoors, and the only one of the three that is private in every weather',
    },
  ]

  return (
    <div className="lv-waters-row" role="group" aria-label="The three waters of the house">
      {panes.map((p) => (
        <div key={p.key} className={`lv-water ${active === p.key ? 'is-active' : 'is-idle'}`}>
          <button
            type="button"
            className="lv-water-select"
            aria-pressed={active === p.key}
            onMouseEnter={() => { if (canHover.current) setActive(p.key) }}
            onFocus={() => setActive(p.key)}
            onClick={() => setActive(p.key)}
          >
            <span className="lv-water-media">
              <img
                src={p.photo.src} srcSet={srcSet(p.photo.src)} sizes="(max-width: 767px) 100vw, 40vw"
                alt={p.photo.alt} loading="lazy" decoding="async"
                style={p.objectPosition ? { objectPosition: p.objectPosition } : undefined}
              />
            </span>
            <span className="lv-water-name">
              {p.name}
              {' '}
              <span className="lv-water-gloss">{p.gloss}</span>
            </span>
          </button>
          <div className="lv-water-copy">
            <div className="lv-water-copy-in">
              <p className="lv-water-body">{p.body}</p>
              <p className="lv-water-fact">{p.fact}</p>
              {p.key === 'laugin' && (
                <div className="lv-water-season" role="group" aria-label="Season">
                  <button type="button" aria-pressed={!winter} className={!winter ? 'is-on' : ''} onClick={() => setWinter(false)}>
                    Summer
                  </button>
                  <button type="button" aria-pressed={winter} className={winter ? 'is-on' : ''} onClick={() => setWinter(true)}>
                    Winter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
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
      id: `lv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: 'lakeview',
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
      <div className="lv-book-done" role="status">
        <p className="lv-book-done-title">Your request has been sent.</p>
        <p className="lv-book-done-body">
          {done.date} to {done.endDate}, {done.people} {done.people === 1 ? 'guest' : 'guests'}.
          {' '}Visiting Iceland confirms each request personally. The price for your dates
          comes with the reply to {done.customer.email}.
        </p>
        <p className="lv-book-note">
          This is a prototype. The request lives only in this browser.{' '}
          <Link className="lv-a" to="/preview/lakeview/stjornbord">See how direct bookings could work</Link>{' '}
          to watch it arrive.
        </p>
        <button type="button" className="lv-ghost" onClick={() => setDone(null)}>
          Make another request
        </button>
      </div>
    )
  }

  return (
    <form className="lv-book-form" onSubmit={submit} noValidate>
      <div className="lv-book-grid">
        <label className="lv-field">
          <span className="lv-field-label">Arrival</span>
          <input type="date" name="arrival" autoComplete="off" min={minDate} value={date} required
            onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="lv-field">
          <span className="lv-field-label">Nights</span>
          <select name="nights" value={nights} onChange={(e) => setNights(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="lv-field">
          <span className="lv-field-label">Guests</span>
          <select name="guests" value={people} onChange={(e) => setPeople(Number(e.target.value))}>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </label>
        <label className="lv-field lv-field-wide">
          <span className="lv-field-label">Name</span>
          <input type="text" name="name" autoComplete="name" value={name} required
            onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="lv-field lv-field-wide">
          <span className="lv-field-label">Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" value={email} required
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="lv-field lv-field-wide">
          <span className="lv-field-label">Phone <span className="lv-optional">(optional)</span></span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="lv-field lv-field-wide">
          <span className="lv-field-label">Anything Omar should know <span className="lv-optional">(optional)</span></span>
          <textarea rows={3} name="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      {error && <p className="lv-field-error" role="alert">{error}</p>}
      <button type="submit" className="lv-cta">Ask about your stay</button>
      <p className="lv-book-note">
        No payment today. Send your preferred dates and Omar confirms
        availability, with the nightly price in his reply.
      </p>
    </form>
  )
}

/* ── preloader ─────────────────────────────────────────────────────────────
   REAL progress: the hero poster's decode + fonts.ready, never a fake timer.
   1.1s floor, 2.4s cap. Once per session; ?loader forces it; never mounts
   under reduced motion. Dispatches lv:revealed for the hero wordmark. */

const shouldShowLoader = () => {
  if (typeof window === 'undefined' || reduced()) return false
  if (new URLSearchParams(window.location.search).has('loader')) return true
  try { return !sessionStorage.getItem('lv_seen') } catch { return true }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('lv_seen', '1') } catch { /* private mode */ }
    const t0 = performance.now()
    let raf = 0
    let shown = 0
    let heroDone = false
    const poster = new Image()
    poster.decoding = 'async'
    const markHeroDone = () => { heroDone = true }
    poster.addEventListener('load', markHeroDone, { once: true })
    poster.addEventListener('error', markHeroDone, { once: true })
    poster.src = PHOTO.arrivalLake.src
    if (poster.complete) heroDone = true
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
    <div className={`lv-loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <p className="lv-loader-mark" style={{ backgroundPositionX: `${100 - pct}%` }}>
        LAKEVIEW
      </p>
      <p className="lv-loader-pct">{pct}%</p>
    </div>
  )
}

/* ── the page ──────────────────────────────────────────────────────────── */

export default function LakeviewPage() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(shouldShowLoader)
  const [videoOk, setVideoOk] = useState(true)
  const [playFilm] = useState(filmOk)
  const rootRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const nightVideoRef = useRef<HTMLVideoElement>(null)
  const [nightOk, setNightOk] = useState(true)
  const [playNight] = useState(filmOk)

  useEffect(() => {
    setThemeColor(CANVAS)
    document.title = 'Iceland Lakeview Retreat'
    setReady(true)
    return setNoindex(true)
  }, [])

  /* Autoplay is advisory: Safari in particular can ignore the attribute until
     something asks. Nudge it once the data is there and swallow the rejection,
     because a blocked play() is not an error worth surfacing (the poster, which
     is the film's own first frame, is already showing). */
  useEffect(() => {
    const v = heroVideoRef.current
    if (!v || !playFilm) return
    const nudge = () => { void v.play().catch(() => {}) }
    v.addEventListener('loadeddata', nudge)
    v.addEventListener('canplay', nudge)
    nudge()
    return () => {
      v.removeEventListener('loadeddata', nudge)
      v.removeEventListener('canplay', nudge)
    }
  }, [playFilm])

  /* The night film sits far down the page, so it is not fetched at all until
     the section is near: preload="none" plus a load-on-approach observer.
     Without that it would compete with the hero for bandwidth on first paint. */
  useEffect(() => {
    const v = nightVideoRef.current
    if (!v || !playNight) return
    const nudge = () => { void v.play().catch(() => {}) }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { v.preload = 'auto'; v.load(); nudge() }
        else v.pause()
      })
    }, { rootMargin: '200px' })
    io.observe(v)
    v.addEventListener('loadeddata', nudge)
    v.addEventListener('canplay', nudge)
    return () => {
      io.disconnect()
      v.removeEventListener('loadeddata', nudge)
      v.removeEventListener('canplay', nudge)
    }
  }, [playNight])

  useMotion(ready)

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div ref={rootRef} className="lv-root">
      <style>{CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      {loading && (
        <Preloader onDone={() => {
          setLoading(false)
          window.dispatchEvent(new Event('lv:revealed'))
        }} />
      )}

      {/* nav: mix-blend difference, a shared chrome foundation (not a
          signature device) so it stays legible over the film and every
          later section without a background of its own. */}
      <header className="lv-nav">
        <a className="lv-nav-mark" href="#top" onClick={anchor('top')}>LAKEVIEW</a>
        <nav className="lv-nav-links" aria-label="Page">
          <a href="#husid" onClick={anchor('husid')}>The house</a>
          <a href="#votnin" onClick={anchor('votnin')}>The waters</a>
          <a href="#gestir" onClick={anchor('gestir')}>Guests</a>
        </nav>
        <a className="lv-nav-cta" href="#boka" onClick={anchor('boka')}>Ask about your stay</a>
      </header>

      {/* 01 · hero: film + centred wordmark */}
      <section className="lv-hero" id="top">
        <div className="lv-hero-media">
          {/* The poster IS the film's exact first frame (a 16:9 crop of their
              own arrival photograph), so the handover to video is invisible.
              Using the uncropped photo here would jump the moment it starts. */}
          <img
            className="lv-hero-poster"
            src={`${BASE}lakeview/hero-poster.jpg`}
            srcSet={`${BASE}lakeview/hero-poster-800.jpg 800w, ${BASE}lakeview/hero-poster.jpg 1200w`}
            sizes="100vw"
            alt={PHOTO.arrivalLake.alt} loading="eager" decoding="async"
          />
          {playFilm && (
            <video
              ref={heroVideoRef}
              className={`lv-hero-video ${videoOk ? '' : 'is-error'}`}
              poster={`${BASE}lakeview/hero-poster.jpg`}
              autoPlay muted loop playsInline preload="metadata"
              onError={() => setVideoOk(false)}
              aria-hidden="true"
            >
              <source src={`${BASE}lakeview/hero-film.mp4`} type="video/mp4" />
            </video>
          )}
          <div className="lv-hero-scrim" aria-hidden="true" />
        </div>
        <h1 className="lv-wordmark" aria-label="Lakeview">
          <span aria-hidden="true">
            <span className="lv-line"><span className="lv-word">LAKEVIEW</span></span>
          </span>
        </h1>
        <div className="lv-hero-block">
          <p className="lv-hero-sub">
            Built from the same landscape it overlooks. A turf-roofed retreat
            above Úlfljótsvatn where traditional Icelandic building meets
            uninterrupted glass and still water. Sleeps two.
          </p>
          <a className="lv-hero-link" href="#boka" onClick={anchor('boka')}>Ask about your stay</a>
        </div>
      </section>

      {/* 02 · manifesto */}
      <section className="lv-manifesto" id="husid">
        <div className="lv-manifesto-copy">
          <Headline text="Torfbær, sextíu árum síðar." size={84} floor={38} measure={620} />
          <p className="lv-gloss lv-rv">A turf house, sixty years on.</p>
          <p className="lv-body lv-rv">
            {'“'}…combines Icelandic traditional housing with a modern elegance,{'”'} the
            listing says, and the drone photograph proves it: the roof is
            turf, the walls are glass, and the moor keeps growing right up to
            the door.
          </p>
          <p className="lv-credit lv-rv">{HOST.press}</p>
        </div>
        <Frame photo={PHOTO.gableSummer} className="lv-manifesto-fig" />
      </section>

      {/* 03 · finding the house: the signature scroll device */}
      <section className="lv-find" id="landid">
        <div className="lv-find-inner">
          <div className="lv-find-imgwrap">
            <img
              className="lv-find-img"
              src={PHOTO.aerialTurf.src} srcSet={srcSet(PHOTO.aerialTurf.src)} sizes="100vw"
              alt={PHOTO.aerialTurf.alt} loading="lazy" decoding="async"
            />
          </div>
          <div className="lv-find-caps">
            <p className="lv-find-cap">Þakið er úr landinu.</p>
            <p className="lv-find-gloss">The roof is made of the land itself.</p>
          </div>
        </div>
      </section>

      {/* 04 · the three waters */}
      <section className="lv-waters" id="votnin">
        <div className="lv-waters-head lv-rv">
          <p className="lv-eyebrow">Vötnin þrjú</p>
          <Headline text="The lake, the pool and the bath." size={52} floor={30} measure={560} />
          <p className="lv-body lv-waters-intro">
            Three waters shape every stay. The lake beyond the glass, the
            geothermal pool beside the cabin, and the bath indoors at the window.
          </p>
        </div>
        <div className="lv-rv">
          <ThreeWaters />
        </div>
      </section>

      {/* 05 · inside */}
      <section className="lv-inside" id="inni">
        <Frame photo={PHOTO.bedTubGable} className="lv-inside-hero" />
        <div className="lv-inside-row">
          <div className="lv-inside-copy">
            <Headline text="The bed, the bath and the gable window share one view." size={48} floor={28} measure={520} />
            <p className="lv-body lv-rv">
              A fireplace and a full kitchen sit under the same roofline, so a
              slow morning or a stormy evening are equally easy to spend
              inside. {FACTS.amenityCount} amenities in total, by the
              listing's own count.
            </p>
          </div>
          <div className="lv-inside-figs">
            <Frame photo={PHOTO.kitchenFire} drift={9} className="lv-inside-fig" />
            <Frame photo={PHOTO.livingSofa} drift={7} className="lv-inside-fig lv-inside-fig-b" />
          </div>
        </div>
      </section>

      {/* 06 · night, aurora */}
      <section className="lv-night" id="nott">
        {/* The aurora loop, generated from their own winter night photograph of
            the lit cabin. The poster is its exact first frame, so the handover
            is invisible, and the poster alone is a complete picture if the
            video never plays. */}
        <figure className="lv-night-fig">
          <img
            className="lv-night-poster"
            src={`${BASE}lakeview/hero-night.jpg`}
            srcSet={`${BASE}lakeview/hero-night-800.jpg 800w, ${BASE}lakeview/hero-night.jpg 1200w`}
            sizes="(max-width: 991px) 100vw, 55vw"
            alt="The cabin lit from within on a winter night, the lake and snow-covered mountains behind it under a starry sky"
            loading="lazy" decoding="async"
          />
          {playNight && (
            <video
              ref={nightVideoRef}
              className={`lv-night-video ${nightOk ? '' : 'is-error'}`}
              poster={`${BASE}lakeview/hero-night.jpg`}
              autoPlay muted loop playsInline preload="none"
              onError={() => setNightOk(false)}
              aria-hidden="true"
            >
              <source src={`${BASE}lakeview/night-film.mp4`} type="video/mp4" />
            </video>
          )}
        </figure>
        <div className="lv-night-copy">
          <Headline text="Some nights the sky comes to the window on its own." size={44} floor={26} measure={480} as="h2" />
          <NightQuotes />
        </div>
      </section>

      {/* 07 · the golden circle */}
      <section className="lv-circle" id="hringurinn">
        <div className="lv-circle-copy">
          <p className="lv-eyebrow">Gullni hringurinn</p>
          <Headline text="The Golden Circle starts at the door." size={48} floor={28} measure={520} />
          <ul className="lv-circle-list lv-rv">
            {GOLDEN_CIRCLE.map((p) => (
              <li key={p.name}>
                <span className="lv-circle-name">{p.name}</span>
                <span className="lv-circle-note">{p.note}</span>
                <span className="lv-circle-dist">{p.dist}</span>
              </li>
            ))}
          </ul>
        </div>
        <Frame photo={PHOTO.sunriseBed} className="lv-circle-fig" />
      </section>

      {/* 08 · guests */}
      <section className="lv-guests" id="gestir">
        <Headline text="What guests keep saying." size={56} floor={30} measure={620} />
        <p className="lv-guests-meta lv-rv">
          {HOST.rating} of 5 across {HOST.reviewCount} reviews · {HOST.badges.join(' · ')}
        </p>
        <ul className="lv-quotes">
          {[REVIEW_QUOTES[0], REVIEW_QUOTES[2], REVIEW_QUOTES[4]].map((q) => (
            <li key={q.author} className="lv-quote lv-rv">
              <blockquote>
                <p>{'“'}{q.quote}{'”'}</p>
              </blockquote>
              <p className="lv-quote-by">{q.author}, {q.when}</p>
            </li>
          ))}
        </ul>
        <dl className="lv-themes lv-rv" aria-label="What reviews mention most">
          {REVIEW_THEMES.map((t) => (
            <div key={t.theme}><dt>{t.theme}</dt><dd>{t.mentions}</dd></div>
          ))}
        </dl>
        <p className="lv-stat lv-rv">
          Everything here comes directly from Airbnb guest reviews, collected
          August 2026.
        </p>
      </section>

      {/* 09 · booking */}
      <section className="lv-book" id="boka">
        <div className="lv-book-intro">
          <Headline text="Send your dates." size={64} floor={32} measure={520} />
          <p className="lv-body lv-rv">
            Requests go straight to Visiting Iceland, who responds to{' '}
            {HOST.responseRate} of guests within {HOST.respondsWithin}.
          </p>
          <div className="lv-owner-note lv-rv">
            <p className="lv-owner-note-label">The owner's side</p>
            <p className="lv-owner-note-body">
              Every request lands in a dashboard built for this cabin:
              confirm or decline in a tap, watch the calendar fill.{' '}
              <Link className="lv-a" to="/preview/lakeview/stjornbord">
                Open the owner dashboard
              </Link>{' '}
              beside this tab and send yourself a request.
            </p>
          </div>
        </div>
        <BookingForm />
      </section>

      {/* 10 · footer facts */}
      <footer className="lv-foot">
        <div className="lv-foot-grid">
          <div>
            <p className="lv-foot-mark">LAKEVIEW</p>
            <p className="lv-foot-line">{FACTS.location}</p>
          </div>
          <div>
            <p className="lv-foot-line">Host: {HOST.businessName}, Superhost for {HOST.yearsHosting} years</p>
            <p className="lv-foot-line">Guests know the host as {HOST.guestNickname} in reviews</p>
            <p className="lv-foot-line">Check-in {FACTS.checkIn} · Check-out {FACTS.checkOut}</p>
          </div>
          <div>
            <p className="lv-foot-line">
              Photography throughout this prototype comes from the owner's own
              Airbnb listing, retrieved August 2026.
            </p>
            <p className="lv-foot-line">
              Prototype by SNDR. It shows how direct enquiries could work on the
              owner's own website. Every request stays inside this browser and is
              never sent.
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
@font-face { font-family: 'Cabinet Grotesk'; src: url('${BASE}fonts/cabinet-grotesk/CabinetGrotesk-Variable.woff2') format('woff2'); font-weight: 100 800; font-display: swap; }
@font-face { font-family: 'Author'; src: url('${BASE}fonts/author/Author-Variable.woff2') format('woff2'); font-weight: 100 800; font-display: swap; }
@font-face { font-family: 'Basier Mono'; src: url('${BASE}fonts/basier-mono/BasierSquareMono-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }

.lv-root {
  --u: clamp(.44px, 100vw / 1440, 1.15px);
  --lv-c: ${CANVAS};
  --lv-ink: ${INK};
  --lv-moss: #8A6440;
  --lv-gold: ${GOLD};
  --lv-lake: #5E7CA0;
  --lv-night: ${NIGHT};
  --lv-accent-text: #7A5525;
  --lv-mute: color-mix(in srgb, var(--lv-ink) 74%, transparent);
  --lv-hair: color-mix(in srgb, var(--lv-ink) 15%, transparent);
  --lv-soft: #DCE2E1;
  background: var(--lv-c);
  color: var(--lv-ink);
  font-family: ${BODY_FONT};
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
.lv-root ::selection { background: var(--lv-gold); color: var(--lv-ink); }
.lv-root a { color: inherit; }
.lv-root :focus-visible {
  outline: 2px solid var(--lv-gold);
  outline-offset: 2px;
  border-radius: 2px;
}
.lv-root a, .lv-root button, .lv-root input, .lv-root select, .lv-root textarea {
  touch-action: manipulation;
}
.lv-a { color: var(--lv-accent-text); text-decoration: underline; text-underline-offset: 2px; }
.lv-a:hover { color: var(--lv-ink); }

/* nav: borderless, painted near-white under mix-blend difference so it
   inverts against whatever passes beneath it and never needs a bar. */
.lv-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 40;
  display: flex; align-items: center; gap: calc(var(--u) * 36);
  padding: calc(var(--u) * 22) calc(var(--u) * 48);
  color: #F4F6F5;
  mix-blend-mode: difference;
}
.lv-nav-mark {
  font-family: ${DISPLAY}; font-weight: 600; letter-spacing: .1em;
  text-decoration: none; font-size: ${fluid(15, 15)};
}
.lv-nav-links { display: flex; gap: calc(var(--u) * 26); margin-left: auto; }
.lv-nav-links a {
  text-decoration: none; font-size: ${fluid(14, 15)}; color: inherit;
  opacity: .7; transition: opacity .25s ease;
}
.lv-nav-links a:hover { opacity: 1; }
.lv-nav-cta {
  text-decoration: none; font-size: ${fluid(14, 15)}; font-weight: 500;
  padding: calc(var(--u) * 10) calc(var(--u) * 18);
  border: 1px solid color-mix(in srgb, currentColor 38%, transparent);
  border-radius: 2px;
  transition: border-color .25s ease;
}
.lv-nav-cta:hover { border-color: currentColor; }

/* hero */
.lv-hero { position: relative; min-height: 100svh; display: grid; overflow: hidden; }
.lv-hero-media { position: absolute; inset: 0; overflow: hidden; background: var(--lv-ink); }
.lv-hero-poster, .lv-hero-video {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
}
.lv-hero-video { opacity: 0; transition: opacity .6s ease; }
.lv-hero-video:not(.is-error) { opacity: 1; }
.lv-hero-video.is-error { display: none; }
.lv-hero-scrim {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(200deg, transparent 42%, rgba(23,26,32,.55) 100%);
}
.lv-wordmark {
  position: absolute; inset: 0; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  margin: 0; pointer-events: none; text-align: center;
  color: #F4F6F5;
  mix-blend-mode: difference;
  font-family: ${DISPLAY}; font-weight: 700; letter-spacing: -.01em;
  font-size: clamp(48px, 11vw, 180px);
  line-height: 1;
}
.lv-wordmark .lv-line { padding: .2em .02em .05em; margin: -.2em -.02em -.05em; }
.lv-hero-block {
  position: relative; align-self: end; z-index: 1;
  padding: 0 calc(var(--u) * 48) calc(calc(var(--u) * 64) + env(safe-area-inset-bottom, 0px));
  color: #F4F6F5;
  max-width: calc(var(--u) * 760);
}
.lv-hero-sub {
  margin: 0;
  font-size: ${fluid(19, 15)}; line-height: 1.55; font-weight: 400;
  max-width: 40ch; color: rgba(244,246,245,.94);
}
.lv-hero-link {
  display: inline-block; margin-top: calc(var(--u) * 22);
  font-size: ${fluid(16, 14)}; font-weight: 500; letter-spacing: .01em;
  color: #F4F6F5; text-decoration: none; position: relative;
  padding-bottom: 3px;
}
.lv-hero-link::after {
  content: ''; position: absolute; left: 0; bottom: 0; height: 1px; width: 100%;
  background: currentColor; transform: scaleX(0); transform-origin: left;
  transition: transform .45s cubic-bezier(.23,1,.32,1);
}
@media (hover: hover) and (pointer: fine) {
  .lv-hero-link:hover::after { transform: scaleX(1); }
}
.lv-hero-link:focus-visible::after { transform: scaleX(1); }

.lv-cta {
  display: inline-block; margin-top: calc(var(--u) * 24);
  background: var(--lv-gold); color: var(--lv-ink);
  font-weight: 600; font-size: ${fluid(15, 13)}; text-decoration: none;
  padding: calc(var(--u) * 14) calc(var(--u) * 26);
  border: 0; border-radius: 2px; cursor: pointer;
  transition: transform .15s ease, filter .25s ease;
}
.lv-cta:hover { filter: brightness(1.06); }
.lv-cta:active { transform: translateY(1px); }

/* shared text */
.lv-headline {
  margin: 0; font-family: ${DISPLAY}; font-weight: 500; letter-spacing: -.01em;
  line-height: 1.14; text-wrap: balance;
}
.lv-line {
  display: inline-block; overflow: hidden; vertical-align: bottom;
  padding: .2em .04em .12em; margin: -.2em -.04em -.12em;
}
.lv-word { display: inline-block; }
.lv-body {
  font-size: ${fluid(17, 15)}; line-height: 1.62; font-weight: 400;
  color: var(--lv-mute); max-width: 58ch; margin: calc(var(--u) * 22) 0 0;
}
.lv-gloss {
  font-style: italic; font-size: ${fluid(15, 13)}; color: var(--lv-accent-text);
  margin: calc(var(--u) * 12) 0 0;
}
.lv-credit {
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .06em;
  color: var(--lv-mute); margin: calc(var(--u) * 22) 0 0;
}
.lv-stat {
  font-family: ${MONO}; font-size: ${fluid(12, 12)};
  color: var(--lv-mute); margin: calc(var(--u) * 14) 0 0;
}
.lv-eyebrow {
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .16em;
  text-transform: uppercase; color: var(--lv-accent-text);
  margin: 0 0 calc(var(--u) * 16);
}

/* waterline: clip-path rise with a feathered edge, blur falling away, a
   small spring settle. Once settled, the clip-path is removed entirely. */
.lv-frame { position: relative; overflow: hidden; margin: 0; background: var(--lv-soft); }
.lv-frame-reveal { position: absolute; inset: 0; }
/* the hidden-then-reveal state only exists once JS is confirmed running; a
   no-JS or pre-hydration paint must show the photograph, never a stuck clip */
/* The arrival is an off-axis, wide-feather MASK sweep rather than a hard
   clip edge: the picture resolves out of softness instead of being uncovered
   by a moving line. Note the gradient's colour stops cannot be transitioned
   (they do not interpolate) - the animated property is mask-POSITION, with the
   mask sized larger than the box so there is somewhere to travel from. */
.lv-js .lv-frame-reveal {
  -webkit-mask-image: linear-gradient(168deg, transparent 0%, #000 42%, #000 100%);
  mask-image: linear-gradient(168deg, transparent 0%, #000 42%, #000 100%);
  -webkit-mask-size: 300% 300%;
  mask-size: 300% 300%;
  -webkit-mask-position: 74% 74%;
  mask-position: 74% 74%;
  filter: blur(16px) saturate(.72);
  transform: translateY(20px);
  transition: -webkit-mask-position 1.15s cubic-bezier(.25,1,.5,1),
    mask-position 1.15s cubic-bezier(.25,1,.5,1),
    filter 1.05s cubic-bezier(.25,1,.5,1),
    transform .85s cubic-bezier(.22,1,.36,1);
}
.lv-js .lv-rv.is-in .lv-frame-reveal {
  -webkit-mask-position: 0% 0%;
  mask-position: 0% 0%;
  filter: blur(0) saturate(1);
  transform: translateY(0);
}
/* Once the sweep is done the mask is removed outright: a resting mask over a
   box whose child drifts every frame de-optimises compositing. */
.lv-frame-reveal.is-settled {
  -webkit-mask-image: none; mask-image: none;
}
.lv-frame-reveal::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 16%;
  background: linear-gradient(to top, var(--lv-c), transparent);
  opacity: 0; pointer-events: none;
}
.lv-js .lv-frame-reveal::after { opacity: 1; transition: opacity 1.05s ease; }
.lv-js .lv-rv.is-in .lv-frame-reveal::after { opacity: 0; }
.lv-rv.is-focus-forced .lv-frame-reveal {
  -webkit-mask-image: none !important; mask-image: none !important;
  filter: blur(0) !important; transform: translateY(0) !important;
}
.lv-rv.is-focus-forced .lv-frame-reveal::after { opacity: 0 !important; }
.lv-frame-drift { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; }
@media (min-width: 992px) { .lv-frame-drift { will-change: transform; } }
.lv-frame-drift img, .lv-frame-reveal > img { width: 100%; height: 100%; max-width: none; object-fit: cover; display: block; }
/* non-drift frames render the img directly inside the reveal box */
.lv-frame-reveal > img { position: absolute; inset: 0; }

/* elements that rise once, independent of the frame system (text blocks) */
.lv-js .lv-rv:not(.lv-frame) { opacity: 0; transform: translateY(24px); transition: opacity .9s cubic-bezier(.25,1,.5,1), transform .9s cubic-bezier(.25,1,.5,1); }
.lv-js .lv-rv:not(.lv-frame).is-in { opacity: 1; transform: translateY(0); }
.lv-static .lv-rv, .lv-static .lv-frame-reveal { opacity: 1 !important; transform: none !important; clip-path: none !important; filter: none !important; -webkit-mask-image: none !important; mask-image: none !important; }

.lv-root section[id] {
  /* The header is fixed, so an anchor jump would otherwise park the
     section's first line underneath it (measured: 69px swallowed). */
  scroll-margin-top: clamp(88px, calc(var(--u) * 116), 136px);
}
/* sections */
.lv-manifesto {
  display: grid; grid-template-columns: 7fr 4fr; align-items: end;
  gap: calc(var(--u) * 90);
  padding: calc(var(--u) * 180) calc(var(--u) * 48) calc(var(--u) * 140);
  max-width: calc(var(--u) * 1440); margin: 0 auto;
}
.lv-manifesto-fig { width: 100%; }

/* finding the house */
.lv-find-inner { position: relative; height: 100svh; overflow: hidden; background: var(--lv-moss); }
.lv-find-imgwrap { position: absolute; inset: 0; overflow: hidden; }
.lv-find-img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
}
.lv-find-inner::after {
  content: ''; position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(200deg, transparent 55%, rgba(23,26,32,.5) 100%);
}
.lv-find-caps {
  position: absolute; left: calc(var(--u) * 48); bottom: calc(var(--u) * 56); z-index: 2;
  color: #F4F6F5; max-width: 30ch;
}
.lv-find-cap {
  margin: 0; font-family: ${DISPLAY}; font-weight: 500;
  font-size: ${fluid(42, 24)}; line-height: 1.2; letter-spacing: -.01em;
}
/* The caption used to fade in on the pinned scrub. That scrub is gone, so it
   simply rides the shared reveal like every other text block. */
.lv-find-gloss { margin: calc(var(--u) * 10) 0 0; font-style: italic; font-size: ${fluid(14, 13)}; color: rgba(244,246,245,.78); }
.lv-static .lv-find-img { transform: none !important; }

/* the three waters */
.lv-waters { padding: calc(var(--u) * 150) calc(var(--u) * 48); max-width: calc(var(--u) * 1440); margin: 0 auto; }
.lv-waters-head { margin-bottom: calc(var(--u) * 56); }
.lv-waters-row { display: flex; gap: calc(var(--u) * 4); height: clamp(360px, 56vw, 620px); }
.lv-water {
  position: relative; flex: 0 0 auto; flex-basis: 23%; overflow: hidden;
  border-radius: 2px; background: var(--lv-soft);
  transition: flex-basis .65s cubic-bezier(.65,0,.35,1);
  display: flex; flex-direction: column;
}
.lv-water.is-active { flex-basis: 54%; }
.lv-water-select {
  position: relative; flex: 1; display: block; width: 100%; margin: 0; padding: 0;
  border: 0; background: none; cursor: pointer; text-align: left; color: inherit;
}
.lv-water-media { position: absolute; inset: 0; }
.lv-water-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .8s ease; }
.lv-water.is-active .lv-water-media img { transform: scale(1.04); }
.lv-water-select::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(0deg, rgba(23,26,32,.62) 0%, transparent 46%);
}
.lv-water-name {
  position: relative; z-index: 1; align-self: flex-end; margin-top: auto;
  padding: calc(var(--u) * 20);
  font-family: ${DISPLAY}; font-weight: 600; font-size: ${fluid(22, 17)};
  color: #F4F6F5;
}
/* Height opens with grid-template-rows 0fr -> 1fr rather than a max-height
   guess: no magic pixel ceiling to outgrow, and no per-frame layout thrash
   from animating max-height and padding together. */
.lv-water-copy {
  display: grid; grid-template-rows: 0fr; opacity: 0;
  transition: grid-template-rows .5s cubic-bezier(.25,1,.5,1), opacity .4s ease;
}
.lv-water-copy > * { grid-row: 1; }
.lv-water-copy-in { overflow: hidden; padding: 0 calc(var(--u) * 20); }
.lv-water.is-active .lv-water-copy { grid-template-rows: 1fr; opacity: 1; }
.lv-water.is-active .lv-water-copy-in { padding: calc(var(--u) * 18) calc(var(--u) * 20) calc(var(--u) * 20); }
.lv-water-body { margin: 0; font-size: ${fluid(15, 14)}; line-height: 1.55; color: var(--lv-mute); }
.lv-water-gloss {
  display: block; margin-top: 2px; font-family: ${MONO}; font-weight: 400;
  font-size: ${fluid(12, 12)}; letter-spacing: .06em; color: rgba(244,246,245,.82);
}
/* the evidence line: a real count from the listing's own review index */
.lv-water-fact {
  margin: calc(var(--u) * 10) 0 0; font-family: ${MONO};
  font-size: ${fluid(12, 12)}; line-height: 1.5; color: var(--lv-accent-text);
  font-variant-numeric: tabular-nums;
}
.lv-water-season { display: flex; gap: calc(var(--u) * 10); margin-top: calc(var(--u) * 14); }
.lv-water-season button {
  font: inherit; font-family: ${MONO}; font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
  cursor: pointer; background: none; color: var(--lv-mute);
  border: 1px solid var(--lv-hair); border-radius: 2px; padding: 8px 14px; min-height: 44px;
}
.lv-water-season button.is-on { color: var(--lv-ink); border-color: var(--lv-gold); background: color-mix(in srgb, var(--lv-gold) 16%, transparent); }

/* inside */
.lv-inside { padding: calc(var(--u) * 40) 0 calc(var(--u) * 150); }
.lv-inside-hero { width: min(100%, calc(var(--u) * 1240)); margin: 0 auto; }
.lv-inside-row {
  display: grid; grid-template-columns: 5fr 6fr; gap: calc(var(--u) * 80);
  align-items: start; max-width: calc(var(--u) * 1240);
  margin: calc(var(--u) * 84) auto 0; padding: 0 calc(var(--u) * 48);
}
.lv-inside-figs { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 20); }
.lv-inside-fig-b { margin-top: calc(var(--u) * 48); }

/* night: the ground eases in/out for this section only */
.lv-night {
  --lv-night-mix: 0;
  position: relative;
  background: color-mix(in srgb, var(--lv-c), var(--lv-night) calc(var(--lv-night-mix) * 100%));
  display: grid; grid-template-columns: 6fr 5fr; align-items: center;
  gap: calc(var(--u) * 72);
  padding: calc(var(--u) * 130) calc(var(--u) * 48);
  max-width: calc(var(--u) * 1440); margin: 0 auto;
}
.lv-night-fig {
  position: relative; width: 100%; aspect-ratio: 4 / 5;
  margin: 0; overflow: hidden; background: var(--lv-night);
}
.lv-night-poster, .lv-night-video {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.lv-night-video { opacity: 0; transition: opacity .6s ease; }
.lv-night-video:not(.is-error) { opacity: 1; }
.lv-night-video.is-error { display: none; }
/* The copy sits on its OWN stable light card rather than tracking the ground
   mix directly: a text colour cross-fading through mid-grey alongside its
   background collapses contrast right in the crossover (measured elsewhere
   in this repo at 2.65:1), and unlike a timed animation a scroll-linked mix
   can be parked there indefinitely just by not scrolling. Keeping the card
   and the ink fixed makes contrast correct at every scroll position, not
   just at the two ends. */
.lv-night-copy {
  position: relative; z-index: 1; color: var(--lv-ink);
  background: color-mix(in srgb, var(--lv-c) 85%, transparent);
  border-radius: 2px;
  padding: calc(var(--u) * 32);
}
/* All quotes share ONE grid cell, so the box is as tall as the tallest and the
   card can never resize as they rotate. */
.lv-night-quotes { display: grid; margin: calc(var(--u) * 28) 0 0; }
.lv-night-quotes > .lv-night-quote { grid-area: 1 / 1; }
.lv-night-quotes.is-static { display: block; }
.lv-night-quotes.is-static > .lv-night-quote { opacity: 1; }
.lv-night-quote {
  margin: 0; padding-left: calc(var(--u) * 22);
  border-left: 2px solid var(--lv-gold);
  opacity: 0; transition: opacity .9s cubic-bezier(.25,1,.5,1);
}
.lv-night-quote.is-on { opacity: 1; }
/* No JS at all: the first quote must still be readable. */
.lv-root:not(.lv-js):not(.lv-static) .lv-night-quotes > .lv-night-quote:first-child { opacity: 1; }
.lv-night-quotes.is-static > .lv-night-quote + .lv-night-quote { margin-top: calc(var(--u) * 20); }
.lv-night-quote p { margin: 0; font-size: ${fluid(20, 16)}; line-height: 1.5; font-weight: 400; font-style: italic; }
.lv-night-quote cite {
  display: block; margin-top: calc(var(--u) * 12); font-style: normal;
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--lv-mute);
}

/* golden circle */
.lv-circle {
  display: grid; grid-template-columns: 6fr 5fr; gap: calc(var(--u) * 80);
  padding: calc(var(--u) * 130) calc(var(--u) * 48); align-items: start;
  max-width: calc(var(--u) * 1440); margin: 0 auto;
}
.lv-circle-list { list-style: none; margin: calc(var(--u) * 48) 0 0; padding: 0; }
.lv-circle-list li {
  display: grid; grid-template-columns: calc(var(--u) * 220) 1fr auto;
  gap: calc(var(--u) * 24); align-items: baseline;
  padding: calc(var(--u) * 16) 0; border-top: 1px solid var(--lv-hair);
}
.lv-circle-name { font-weight: 500; font-size: ${fluid(16, 15)}; }
.lv-circle-note { font-weight: 400; font-size: ${fluid(14, 13)}; color: var(--lv-mute); line-height: 1.5; }
.lv-circle-dist { font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--lv-accent-text); }
.lv-circle-fig { width: 100%; }

/* guests */
.lv-guests { padding: calc(var(--u) * 150) calc(var(--u) * 48); max-width: calc(var(--u) * 1240); margin: 0 auto; }
.lv-guests-meta { font-family: ${MONO}; font-size: ${fluid(13, 12)}; color: var(--lv-mute); margin: calc(var(--u) * 18) 0 0; }
.lv-quotes { list-style: none; margin: calc(var(--u) * 64) 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 48); }
.lv-quote blockquote { margin: 0; }
.lv-quote blockquote p { margin: 0; font-size: ${fluid(19, 16)}; line-height: 1.45; font-weight: 400; }
.lv-quote-by { font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--lv-mute); margin: calc(var(--u) * 16) 0 0; }
.lv-themes {
  display: flex; flex-wrap: wrap; gap: calc(var(--u) * 48) calc(var(--u) * 64);
  margin: calc(var(--u) * 72) 0 0; padding: calc(var(--u) * 24) 0 0; border-top: 1px solid var(--lv-hair);
}
.lv-themes div { display: flex; align-items: baseline; gap: calc(var(--u) * 12); }
.lv-themes dt { font-size: ${fluid(14, 13)}; font-weight: 400; color: var(--lv-mute); }
.lv-themes dd { margin: 0; font-variant-numeric: tabular-nums; font-family: ${MONO}; font-size: ${fluid(26, 19)}; color: var(--lv-ink); }

/* booking */
.lv-book {
  display: grid; grid-template-columns: 5fr 6fr; gap: calc(var(--u) * 80);
  padding: calc(var(--u) * 40) calc(var(--u) * 48) calc(var(--u) * 170);
  max-width: calc(var(--u) * 1440); margin: 0 auto; align-items: start;
}
.lv-book-form, .lv-book-done {
  background: color-mix(in srgb, var(--lv-soft) 55%, transparent);
  border: 1px solid var(--lv-hair); border-radius: 2px; padding: calc(var(--u) * 36);
}
.lv-book-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 20); }
.lv-field { display: flex; flex-direction: column; gap: 6px; }
.lv-field-wide { grid-column: 1 / -1; }
.lv-field-label {
  font-family: ${MONO}; font-size: ${fluid(11, 12)}; letter-spacing: .1em; text-transform: uppercase;
  color: var(--lv-mute);
}
.lv-optional { text-transform: none; letter-spacing: 0; }
.lv-field input, .lv-field select, .lv-field textarea {
  font: inherit; font-size: 16px; font-weight: 400; color: var(--lv-ink);
  background: color-mix(in srgb, var(--lv-c) 60%, transparent);
  border: 1px solid var(--lv-hair); border-radius: 2px; padding: 10px 12px; min-height: 44px;
}
.lv-field textarea { min-height: 0; resize: vertical; }
.lv-owner-note { margin-top: calc(var(--u) * 44); padding-top: calc(var(--u) * 22); border-top: 1px solid var(--lv-hair); }
.lv-owner-note-label {
  font-family: ${MONO}; font-size: ${fluid(11, 12)}; letter-spacing: .12em; text-transform: uppercase;
  color: var(--lv-accent-text); margin: 0 0 calc(var(--u) * 10);
}
.lv-owner-note-body { font-size: ${fluid(14, 13)}; font-weight: 400; line-height: 1.65; color: var(--lv-mute); margin: 0; max-width: 44ch; }
.lv-field-error { color: #B0473A; font-size: ${fluid(14, 13)}; margin: calc(var(--u) * 16) 0 0; }
.lv-book-form .lv-cta { margin-top: calc(var(--u) * 26); width: 100%; text-align: center; }
.lv-book-note { font-size: ${fluid(13, 12)}; font-weight: 400; line-height: 1.6; color: var(--lv-mute); margin: calc(var(--u) * 16) 0 0; }
.lv-book-done-title { margin: 0; font-family: ${DISPLAY}; font-weight: 500; font-size: ${fluid(32, 22)}; }
.lv-book-done-body { margin: calc(var(--u) * 16) 0 0; font-weight: 400; line-height: 1.6; font-size: ${fluid(16, 14)}; }
.lv-ghost {
  margin-top: calc(var(--u) * 22); font: inherit; font-size: ${fluid(14, 13)}; font-weight: 500; cursor: pointer;
  background: none; color: var(--lv-ink); border: 1px solid var(--lv-hair); border-radius: 2px;
  padding: calc(var(--u) * 10) calc(var(--u) * 18); min-height: 44px;
}
.lv-ghost:hover { border-color: var(--lv-gold); }

/* preloader */
.lv-loader {
  position: fixed; inset: 0; z-index: 60; background: ${NIGHT};
  display: grid; place-content: center;
  transition: transform .95s cubic-bezier(.76, 0, .24, 1);
}
.lv-loader.is-leaving { transform: translateY(-100%); }
.lv-loader-mark {
  margin: 0; font-family: ${DISPLAY}; font-weight: 700; letter-spacing: .04em;
  font-size: clamp(34px, 7.6vw, 120px); white-space: nowrap; line-height: 1;
  background-image: linear-gradient(90deg, #F4F6F5 50%, rgba(244,246,245,.16) 50%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.lv-loader-pct {
  position: fixed; left: calc(var(--u) * 48); bottom: calc(var(--u) * 40);
  margin: 0; font-family: ${MONO}; font-size: 12px; letter-spacing: .14em;
  color: rgba(244,246,245,.7);
}

/* footer */
.lv-foot { border-top: 1px solid var(--lv-hair); }
.lv-foot-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 40);
  max-width: calc(var(--u) * 1440); margin: 0 auto;
  padding: calc(var(--u) * 52) calc(var(--u) * 48) calc(var(--u) * 68);
}
.lv-foot-mark { font-family: ${DISPLAY}; font-weight: 600; letter-spacing: .1em; font-size: ${fluid(14, 15)}; margin: 0 0 calc(var(--u) * 12); }
.lv-foot-line { font-size: ${fluid(13, 15)}; font-weight: 400; line-height: 1.6; color: var(--lv-mute); margin: 0 0 calc(var(--u) * 8); }

/* ── responsive ── */
@media (max-width: 991px) {
  .lv-nav { padding: 10px 20px; gap: 14px; }
  .lv-nav-mark, .lv-nav-cta, .lv-nav-links a, .lv-hero-link {
    display: inline-flex; align-items: center; min-height: 44px;
  }
  .lv-nav-cta { padding: 0 16px; }
  .lv-hero-link { padding-bottom: 0; }
  .lv-hero-link::after { bottom: 10px; }
  .lv-cta { min-height: 44px; padding: 12px 22px; }
  .lv-ghost { min-height: 44px; padding: 10px 18px; }
  .lv-nav-links { display: none; }
  .lv-nav-cta { margin-left: auto; }
  .lv-hero-block { padding: 0 20px 40px; }
  .lv-wordmark { font-size: clamp(38px, 13vw, 76px); }
  .lv-manifesto, .lv-inside-row, .lv-night, .lv-circle, .lv-book {
    grid-template-columns: 1fr; gap: 44px; padding-left: 20px; padding-right: 20px;
  }
  .lv-manifesto { padding-top: 96px; padding-bottom: 72px; }
  .lv-night { padding-top: 96px; padding-bottom: 96px; }
  .lv-circle, .lv-book { padding-bottom: 72px; }
  .lv-inside-figs { grid-template-columns: 1fr 1fr; }
  .lv-inside-fig-b { margin-top: 0; }
  .lv-waters { padding-left: 20px; padding-right: 20px; }
  .lv-waters-row { flex-direction: column; height: auto; }
  .lv-water { flex-basis: auto !important; height: 220px; }
  .lv-water.is-active { height: 340px; }
  .lv-guests { padding-left: 20px; padding-right: 20px; }
  .lv-quotes { grid-template-columns: 1fr; gap: 32px; }
  .lv-book-grid { grid-template-columns: 1fr; }
  .lv-circle-list li { grid-template-columns: 1fr; gap: 4px; }
  .lv-foot-grid { grid-template-columns: 1fr; gap: 22px; padding: 36px 20px; }
}

@media (max-width: 767px) {
  .lv-find-caps { left: 20px; bottom: 28px; }
  .lv-find-cap { font-size: clamp(22px, 6.6vw, 30px); max-width: 20ch; }
}

/* ── reduced motion: every device collapses to its resting, legible state ── */
@media (prefers-reduced-motion: reduce) {
  .lv-root * { transition: none !important; animation: none !important; }
  .lv-word { transform: none !important; opacity: 1 !important; }
  .lv-frame-reveal { clip-path: none !important; filter: none !important; transform: none !important; -webkit-mask-image: none !important; mask-image: none !important; }
  .lv-frame-reveal::after { opacity: 0 !important; }
  .lv-frame-drift { inset: 0; transform: none !important; }
  .lv-find-img { transform: none !important; }
  .lv-find-cap { opacity: 1 !important; }
  .lv-hero-video { display: none; }
  .lv-night { --lv-night-mix: 0 !important; }
}
`
