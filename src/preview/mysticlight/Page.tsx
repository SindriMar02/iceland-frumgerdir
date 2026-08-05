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
  FACTS, HOST, JSON_LD, PHOTO, REVIEW_QUOTES, REVIEW_THEMES, SHORE_MARKS,
  SISTER_CABIN_NOTE, SKYLIGHT_FRAMES, TIDE, TIDE_QUOTE, srcSet, type Photo,
} from './content'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('mysticlight')

/* ── MYSTIC LIGHT LODGE · "ATHUGUNARSTÖÐIN" (the observation post) ─────────
   Esther and Pierre's mirror cabin is a instrument for watching: seals at
   low tide, sea eagles over the fjord, the aurora straight through the
   skylight above the bed. The page is built as that instrument, not as a
   generic listing. Full spec: ./DESIGN.md.

   Three devices, one each, honestly derived from THEIR material:
    1. THE SHORE — a spotting-scope lens that follows the cursor over a real
       shore panorama (fine pointers), with three focusable marks for touch
       and keyboard. They really do lend guests a scope; this is that.
    2. THE SKYLIGHT — a full-bleed horizontal journey: a pinned wrapper
       whose flex track of three 100vw panels travels sideways under a
       straight vertical scroll, one tween driving the whole thing. Their
       own three real skies, in order: sunset, winter noon, aurora.
    3. "Focus pull" — the one arrival motion. Every photograph resolves out
       of a heavy blur to sharp, like a lens being racked into focus, WHILE
       an off-axis wide-feather mask sweeps open on the same transition
       (mask-position only ever animates — gradient stops don't interpolate).
       No saturate channel. The hero is the one exception: full-bleed
       backdrop, focus-pull only, no mask.
    4. Drift (Heklusýn spec, ported from Mirror House) — the CONTINUOUS
       scroll-linked device the arrival alone can't provide. Every content
       photograph sits in a fixed, overflow-hidden `.ml-shot` frame; the
       image lives in an `.ml-frame-in` wrapper, oversized via `--dz`, that
       translates vertically every tick as the frame crosses the viewport,
       so the frame reads as a window the photo drifts behind. One shared
       gsap ticker drives it (batched reads, then batched writes), gated off
       while the skylight pin is active, and off entirely under reduced
       motion / halved under 992px. Not on the hero backdrop, the skylight
       passage, or the shore-scope base (its marks are coordinate-locked to
       the still image; drifting it would detach "Selir" from the seals).

   DARK PAGE THROUGHOUT. No palette scrub, no seam wordmark, no canvas film:
   those are Mirror House's devices. Aurora green appears only in photographs,
   never as UI colour. THE FLUID UNIT IS SCOPED to this page's root only
   ([[no-style-bleed-between-designs]]). ────────────────────────────────── */

const CANVAS = '#10141B'
const INK = '#DEE4E8'
const AMBER = '#D9A54E'

const DISPLAY = "'Nippo', system-ui, sans-serif"
const BODY_FONT = "'Supreme', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, monospace"

const BASE = import.meta.env.BASE_URL

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/* ── motion engine: Lenis + reveals + the skylight pin ──────────────────── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const root = document.querySelector<HTMLElement>('.ml-root')
    if (!root) return

    // masked arrival: once a Shot image's mask-position sweep finishes,
    // drop the mask entirely so a resting mask never sits under an image
    // that drifts/parallaxes per frame later on ([[webgl-image-effect-gotchas]]).
    const onMaskSweepEnd = (e: TransitionEvent) => {
      // browsers report the shorthand's LONGHAND components here
      // (mask-position-x/-y, plus -webkit- variants), never "mask-position"
      // itself — match by substring rather than the shorthand name.
      if (!e.propertyName.includes('mask-position')) return
      const img = e.target as HTMLElement
      if (img.tagName === 'IMG') img.classList.add('ml-mask-off')
    }
    root.addEventListener('transitionend', onMaskSweepEnd)

    if (reduced()) {
      root.classList.add('ml-static')
      return () => root.removeEventListener('transitionend', onMaskSweepEnd)
    }

    root.classList.add('ml-js')
    ScrollTrigger.config({ ignoreMobileResize: true })
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    // focus-pull: IO arms a class once, CSS owns the blur/scale transition
    // ([[framer-reveals-unreliable]] — CSS transitions, not mount state).
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.2 },
    )
    root.querySelectorAll('.ml-rv').forEach((el) => io.observe(el))

    /* drift: Heklusýn spec (ported from Mirror House), batched reads then
       writes, off-screen skipped. Set once the skylight pin goes live below
       — while it holds, the viewport is visually frozen, so every
       .ml-frame-in box reports the same rect on every tick and this loop
       would just burn main-thread time next to the pinned scrub for zero
       visual change. */
    const driftFrames = Array.from(root.querySelectorAll<HTMLElement>('.ml-frame-in'))
    let scrubST: ScrollTrigger | null = null
    const drift = () => {
      if (scrubST?.isActive) return
      const vh = window.innerHeight
      // halved below 992px, same breakpoint the rest of the page treats as
      // the mobile/desktop line
      const mobileScale = window.innerWidth < 992 ? 0.5 : 1
      const writes: [HTMLElement, string][] = []
      for (const el of driftFrames) {
        const box = el.parentElement
        if (!box) continue
        const r = box.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const d = Number(el.dataset.drift || 9) * mobileScale
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * d).toFixed(2)}%,0)`])
      }
      for (const [el, t] of writes) el.style.transform = t
    }

    const ctx = gsap.context(() => {
      // word-mask headline rises
      root.querySelectorAll<HTMLElement>('[data-ml-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.ml-word')
        if (!words.length) return
        gsap.fromTo(
          words,
          { yPercent: 112, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            duration: 1, ease: 'expo.out', stagger: 0.06,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          },
        )
      })

      // THE SKYLIGHT, now a full-bleed horizontal journey: a pinned wrapper
      // holding a flex track of three 100vw panels, only where a pin
      // behaves (desktop, ≥1024px). Below that and under reduced motion the
      // markup falls back to a plain vertical stack (CSS media query), so
      // no ScrollTrigger is created there at all.
      //
      // ONE tween drives it — never a timeline — because `containerAnimation`
      // (were any inner reveal ever added inside the track) requires a tween,
      // not a timeline, and because a single function-based `x` end value is
      // exactly what `invalidateOnRefresh` knows how to recompute.
      const skyOuter = root.querySelector<HTMLElement>('.ml-sky-outer')
      const skyTrack = root.querySelector<HTMLElement>('.ml-sky-track')
      const skyPanels = root.querySelectorAll<HTMLElement>('.ml-sky-panel')
      if (skyOuter && skyTrack && skyPanels.length === 3 && window.innerWidth >= 1024) {
        const track = skyTrack
        const traverse = () => track.scrollWidth - window.innerWidth
        const journeyTween = gsap.to(track, { x: () => -traverse(), ease: 'none' })
        scrubST = ScrollTrigger.create({
          animation: journeyTween,
          trigger: skyOuter,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + traverse(),
          invalidateOnRefresh: true,
        })

        // The traverse distance depends on track.scrollWidth, which can
        // still be a beat short of correct right after mount: swapped-in
        // fonts and undecoded images can both change layout an instant
        // later. Recompute once everything has actually settled, or the
        // section pins but the end distance reads ~0 and it never travels.
        const trackImages = Array.from(track.querySelectorAll<HTMLImageElement>('img'))
        Promise.all([
          document.fonts?.ready ?? Promise.resolve(),
          ...trackImages.map((img) => (img.decode ? img.decode().catch(() => undefined) : Promise.resolve())),
        ]).then(() => ScrollTrigger.refresh())
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
      ctx.revert()
      lenis.destroy()
      root.removeEventListener('transitionend', onMaskSweepEnd)
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
      data-ml-headline
      aria-label={text}
      className={`ml-headline ${className}`}
      style={{
        fontSize: fluid(size, floor),
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      }}
    >
      {text.split(' ').map((w, i, arr) => (
        <span key={i} aria-hidden="true">
          <span className="ml-line"><span className="ml-word">{w}</span></span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** A photograph that arrives by focusing (heavy blur resolving to sharp,
    under an off-axis mask sweep — no scale: that would fight the frame's
    own per-frame drift transform), then drifts inside its fixed frame as
    the page scrolls (Heklusýn spec). `--dz` oversizes the inner wrapper so
    the image can never run out of overhang at the extremes of travel. */
function Shot({ photo, drift = 9, priority = false, className = '' }: {
  photo: Photo; drift?: number; priority?: boolean; className?: string
}) {
  return (
    <figure className={`ml-shot ml-rv ${className}`} style={{ aspectRatio: photo.ratio }}>
      <div
        className="ml-frame-in"
        data-drift={drift}
        style={{ '--dz': `${Math.max(9, drift * 1.35)}%` } as React.CSSProperties}
      >
        <img
          src={photo.src} srcSet={srcSet(photo.src)}
          sizes="(max-width: 991px) 100vw, 60vw"
          alt={photo.alt} loading={priority ? 'eager' : 'lazy'} decoding="async"
        />
      </div>
    </figure>
  )
}

function MonoLabel({ is, en, tone = 'amber' }: { is: string; en: string; tone?: 'amber' | 'blue' }) {
  return (
    <p className="ml-mono-label">
      <span className={tone === 'blue' ? 'ml-mono-is-blue' : 'ml-mono-is'}>{is}</span>
      <span aria-hidden="true"> · </span>
      <span>{en}</span>
    </p>
  )
}

/* ── THE SHORE: the spotting-scope lens ───────────────────────────────────
   Fine pointers get a circular magnifier that follows the cursor: a second,
   2x-scaled layer of the SAME photograph, clipped to the lens circle
   (transform-only writes, an idle-cancelling rAF lerp — the loop stops the
   moment the lens has settled, and only restarts on the next input). Touch
   and keyboard get three focusable hotspot buttons that move the lens to a
   named mark instead of following a pointer that doesn't exist there. Under
   reduced motion the lens snaps straight to a mark with no lerp at all. */
function ShoreScope({ photo }: { photo: Photo }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLImageElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [engaged, setEngaged] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const lens = lensRef.current
    const zoom = zoomRef.current
    if (!wrap || !lens || !zoom) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const still = reduced()

    const current = { x: 0.5, y: 0.5 }
    const target = { x: 0.5, y: 0.5 }
    let raf = 0

    const apply = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      const size = lens.offsetWidth
      const cx = current.x * w
      const cy = current.y * h
      lens.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) translate(-50%, -50%)`
      const zw = w * 2
      const zh = h * 2
      zoom.style.width = `${zw}px`
      zoom.style.height = `${zh}px`
      zoom.style.left = `${(-(cx * 2 - size / 2)).toFixed(1)}px`
      zoom.style.top = `${(-(cy * 2 - size / 2)).toFixed(1)}px`
    }

    const tick = () => {
      const dx = target.x - current.x
      const dy = target.y - current.y
      if (Math.abs(dx) < 0.0015 && Math.abs(dy) < 0.0015) {
        current.x = target.x
        current.y = target.y
        apply()
        raf = 0
        return
      }
      current.x += dx * 0.25
      current.y += dy * 0.25
      apply()
      raf = requestAnimationFrame(tick)
    }

    const ensureLoop = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const goTo = (x: number, y: number) => {
      target.x = x
      target.y = y
      if (still) {
        current.x = x
        current.y = y
        apply()
      } else {
        ensureLoop()
      }
    }

    apply()

    let onMove: ((e: PointerEvent) => void) | null = null
    let onLeave: (() => void) | null = null
    if (finePointer && !still) {
      onMove = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect()
        const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
        const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
        setEngaged(true)
        goTo(x, y)
      }
      onLeave = () => setEngaged(false)
      wrap.addEventListener('pointermove', onMove)
      wrap.addEventListener('pointerleave', onLeave)
    }

    const buttons = Array.from(wrap.querySelectorAll<HTMLButtonElement>('.ml-mark'))
    const onMarkGo = (btn: HTMLButtonElement) => {
      const x = Number(btn.dataset.x)
      const y = Number(btn.dataset.y)
      setEngaged(true)
      setActiveId(btn.dataset.id ?? null)
      goTo(x, y)
    }
    const markHandlers: Array<[HTMLButtonElement, () => void]> = buttons.map((btn) => {
      const fn = () => onMarkGo(btn)
      btn.addEventListener('click', fn)
      btn.addEventListener('focus', fn)
      return [btn, fn]
    })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (onMove) wrap.removeEventListener('pointermove', onMove)
      if (onLeave) wrap.removeEventListener('pointerleave', onLeave)
      markHandlers.forEach(([btn, fn]) => {
        btn.removeEventListener('click', fn)
        btn.removeEventListener('focus', fn)
      })
    }
  }, [])

  const active = SHORE_MARKS.find((m) => m.id === activeId) ?? null

  return (
    <div className={`ml-scope-wrap ${engaged ? 'is-engaged' : ''}`} ref={wrapRef}>
      <img className="ml-scope-base" src={photo.src} srcSet={srcSet(photo.src)} sizes="100vw"
        alt={photo.alt} loading="lazy" decoding="async" />
      <div className="ml-scope-lens" ref={lensRef} aria-hidden="true">
        <img ref={zoomRef} className="ml-scope-zoom" src={photo.src} alt="" aria-hidden="true" decoding="async" />
        <span className="ml-scope-ring" />
        <span className="ml-scope-cross" />
      </div>
      {SHORE_MARKS.map((m) => (
        <button
          key={m.id}
          type="button"
          className={`ml-mark ${activeId === m.id ? 'is-on' : ''}`}
          data-id={m.id}
          data-x={m.x}
          data-y={m.y}
          style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
          aria-label={`Look at ${m.name}, ${m.en}`}
          onBlur={() => setEngaged(false)}
        >
          <span className="ml-mark-dot" />
          <span className="ml-mark-tag">{m.name}</span>
        </button>
      ))}
      <p className="ml-scope-caption" aria-live="polite">
        {active
          ? <><strong>{active.name}</strong> · {active.en} · {active.note}</>
          : 'Move the circle, or choose a mark: Selir, Haförn, Húsið.'}
      </p>
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
      id: `ml-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: 'mysticlight',
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
      <div className="ml-book-done" role="status">
        <p className="ml-book-done-title">Request sent.</p>
        <p className="ml-book-done-body">
          {done.date} to {done.endDate}, {done.people} {done.people === 1 ? 'guest' : 'guests'}.
          Esther and Pierre confirm each request personally. The price for your dates comes with
          their reply to {done.customer.email}.
        </p>
        <p className="ml-book-note">
          This is a prototype. The request lives only in this browser.{' '}
          <Link className="ml-a" to="/preview/mysticlight/stjornbord">See the owners' side</Link>{' '}
          to watch it arrive.
        </p>
        <button type="button" className="ml-ghost" onClick={() => setDone(null)}>
          Make another request
        </button>
      </div>
    )
  }

  return (
    <form className="ml-book-form" onSubmit={submit} noValidate>
      <div className="ml-book-grid">
        <label className="ml-field">
          <span className="ml-field-label">Arrival</span>
          <input type="date" name="arrival" autoComplete="off" min={minDate} value={date} required
            onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="ml-field">
          <span className="ml-field-label">Nights</span>
          <select name="nights" value={nights} onChange={(e) => setNights(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="ml-field">
          <span className="ml-field-label">Guests</span>
          <select name="guests" value={people} onChange={(e) => setPeople(Number(e.target.value))}>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </label>
        <label className="ml-field ml-field-wide">
          <span className="ml-field-label">Name</span>
          <input type="text" name="name" autoComplete="name" value={name} required
            onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="ml-field ml-field-wide">
          <span className="ml-field-label">Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" value={email} required
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="ml-field ml-field-wide">
          <span className="ml-field-label">Phone <span className="ml-optional">(optional)</span></span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="ml-field ml-field-wide">
          <span className="ml-field-label">Anything to mention <span className="ml-optional">(optional, pets welcome)</span></span>
          <textarea rows={3} name="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      {error && <p className="ml-field-error" role="alert">{error}</p>}
      <button type="submit" className="ml-cta">Enquire about your stay</button>
      <p className="ml-book-note">
        No card, no charge. The guest asks, the owners confirm, and the price for your dates
        comes with the reply. {FACTS.pets}.
      </p>
    </form>
  )
}

/* ── the page ──────────────────────────────────────────────────────────── */

export default function MysticLightPage() {
  const [ready, setReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThemeColor(CANVAS)
    document.title = 'Mystic Light Lodge'
    setReady(true)
  }, [])

  useMotion(ready)

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div ref={rootRef} className="ml-root">
      <style>{CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />

      {/* nav: fixed, borderless, mist ink. No mix-blend seam theatrics. */}
      <header className="ml-nav">
        <a className="ml-nav-mark" href="#top" onClick={anchor('top')}>
          MYSTIC <span className="ml-nav-mark-amber">LIGHT</span>
        </a>
        <nav className="ml-nav-links" aria-label="Page">
          <a href="#kikirinn" onClick={anchor('kikirinn')}>The shore</a>
          <a href="#thakgluggin" onClick={anchor('thakgluggin')}>The skylight</a>
          <a href="#gestir" onClick={anchor('gestir')}>Guests</a>
        </nav>
        <a className="ml-nav-cta" href="#boka" onClick={anchor('boka')}>Enquire about your stay</a>
      </header>

      {/* 01 · hero */}
      <section className="ml-hero" id="top">
        <div className="ml-hero-media ml-rv">
          <img src={PHOTO.arrivalStorm.src} srcSet={srcSet(PHOTO.arrivalStorm.src)} sizes="100vw"
            alt={PHOTO.arrivalStorm.alt} loading="eager" decoding="async" />
        </div>
        <h1 className="ml-wordmark" aria-label="Mystic Light Lodge">
          <span aria-hidden="true">MYSTIC</span>{' '}
          <span aria-hidden="true" className="ml-wm-amber">LIGHT</span>
        </h1>
        <div className="ml-hero-block">
          <p className="ml-hero-sub">
            Built around observation. Seals at low tide, sea eagles over the fjord
            and, when conditions allow, the northern lights through the skylight
            above the bed.
          </p>
          <a className="ml-hero-link" href="#boka" onClick={anchor('boka')}>Enquire about your stay</a>
        </div>
      </section>

      {/* 02 · the mirror */}
      <section className="ml-mirror">
        <div className="ml-mirror-copy">
          <Headline text="Seen only by the sky." size={84} floor={38} measure={600} />
          <p className="ml-body ml-rv">
            The mirrored facade gives the landscape back to itself. By day it reflects
            the sea, the mountains and the weather while preventing any view inside.
            Step through the door and the same glass becomes a frame for the fjord.
          </p>
        </div>
        <Shot photo={PHOTO.summerFlowers} className="ml-mirror-fig" drift={8} />
      </section>
      <section className="ml-flagship">
        <Shot photo={PHOTO.sunsetScreen} className="ml-flagship-fig" priority={false} drift={12} />
        <p className="ml-flagship-cap ml-rv">
          As the daylight goes, the view simply changes with it.
        </p>
      </section>

      {/* 03 · THE SHORE — signature interactive */}
      <section className="ml-shore" id="kikirinn">
        <div className="ml-shore-head">
          <Headline text="Look through their scope." size={64} floor={32} measure={620} />
          <p className="ml-body ml-rv">
            A spotting scope waits beside the window and binoculars are ready in the
            cabin. Move the circle across the shore, or choose a mark below to find
            seals, a sea eagle or the cabin itself.
          </p>
        </div>
        <ShoreScope photo={PHOTO.frostDawnEdge} />
      </section>

      {/* weather divider */}
      <section className="ml-divider">
        <Shot photo={PHOTO.weatherWall} className="ml-divider-fig" drift={12} />
        <p className="ml-divider-cap ml-rv">A front rolls in off the fjord.</p>
      </section>

      {/* 04 · THE SKYLIGHT — signature scroll device */}
      <section className="ml-sky-intro" id="thakgluggin">
        <Headline text="The window is over the bed." size={64} floor={32} measure={600} />
        <p className="ml-body ml-rv">
          The skylight sits directly above the double bed. Every colour, cloud and star
          overhead is exactly as it was photographed from this cabin.
        </p>
      </section>
      <section className="ml-sky-outer">
        <div className="ml-sky-track">
          {SKYLIGHT_FRAMES.map((f, i) => (
            <div key={f.label} className="ml-sky-panel">
              <img
                className="ml-sky-panel-img"
                src={f.photo.src} srcSet={srcSet(f.photo.src)} sizes="100vw"
                alt={f.photo.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async"
              />
              <div className="ml-sky-panel-cap">
                <p className="ml-mono-label ml-sky-cap-label">{f.label}</p>
                <p className="ml-sky-cap-text">
                  {f.caption}
                  {'quoteAuthor' in f && (
                    <span className="ml-sky-cap-by"> {f.quoteAuthor}, {f.quoteWhen}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* static / mobile / reduced-motion fallback: a plain triptych */}
      <div className="ml-sky-fallback">
        {SKYLIGHT_FRAMES.map((f) => (
          <figure key={f.label} className="ml-sky-fallback-fig">
            <img src={f.photo.src} srcSet={srcSet(f.photo.src)} sizes="33vw"
              alt={f.photo.alt} loading="lazy" decoding="async" />
            <figcaption>
              <p className="ml-mono-label">{f.label}</p>
              <p className="ml-sky-cap-text">
                {f.caption}
                {'quoteAuthor' in f && (
                  <span className="ml-sky-cap-by"> {f.quoteAuthor}, {f.quoteWhen}</span>
                )}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* 05 · inside */}
      <section className="ml-inside">
        <Shot photo={PHOTO.skylightPendants} className="ml-inside-hero" priority={false} drift={10} />
        <div className="ml-inside-row">
          <div className="ml-inside-copy">
            <Headline text="Small room, whole sky." size={56} floor={30} measure={520} />
            <p className="ml-body ml-rv">
              A compact kitchen has everything an unhurried morning needs. Everything else
              stays out of the way of the view, right down to the river-stone basin in the
              bathroom.
            </p>
          </div>
          <Shot photo={PHOTO.interiorVelvet} className="ml-inside-side" drift={8} />
        </div>
        <div className="ml-inside-pair">
          <Shot photo={PHOTO.kitchenette} drift={7} />
          <Shot photo={PHOTO.stoneBasin} drift={7} />
        </div>
      </section>

      {/* 06 · fjaran (the tide) */}
      <section className="ml-fjaran">
        <div className="ml-fjaran-head">
          <MonoLabel is={TIDE.low.is} en={TIDE.low.en} />
          <Headline text="The water does the same thing twice a day." size={56} floor={30} measure={560} />
        </div>
        <div className="ml-fjaran-figs">
          <Shot photo={PHOTO.sheepFjord} className="ml-fjaran-lead" drift={9} />
          <Shot photo={PHOTO.fjordGold} className="ml-fjaran-side" drift={8} />
        </div>
        <blockquote className="ml-fjaran-quote ml-rv">
          <p>{'“'}{TIDE_QUOTE.quote}{'”'}</p>
          <cite>{TIDE_QUOTE.author}, {TIDE_QUOTE.when}</cite>
        </blockquote>
        <MonoLabel is={TIDE.high.is} en={TIDE.high.en} tone="blue" />
      </section>

      {/* 07 · two cabins */}
      <section className="ml-twin">
        <div className="ml-twin-copy">
          <Headline text="There are two of these." size={56} floor={30} measure={540} />
          <p className="ml-body ml-rv">{SISTER_CABIN_NOTE}</p>
        </div>
        <div className="ml-twin-figs">
          <Shot photo={PHOTO.twoCabinsAutumn} className="ml-twin-wide" drift={11} />
          <Shot photo={PHOTO.twoCabinsSummer} drift={7} />
          <Shot photo={PHOTO.duskFrost} drift={7} />
        </div>
      </section>

      {/* 08 · guests */}
      <section className="ml-guests" id="gestir">
        <Headline text="What guests keep saying." size={64} floor={32} measure={620} />
        <p className="ml-guests-meta ml-rv">
          {HOST.rating.toFixed(1)} of 5 across {HOST.reviewCount} reviews · {HOST.badge} ·
          Superhosts for {HOST.yearsHosting} years
        </p>
        <div className="ml-guests-row">
          <ul className="ml-quotes">
            {REVIEW_QUOTES.map((q) => (
              <li key={q.author} className="ml-quote ml-rv">
                <blockquote>
                  <p>{'“'}{q.quote}{'”'}</p>
                </blockquote>
                <p className="ml-quote-by">{q.author}, {q.when}</p>
              </li>
            ))}
          </ul>
          <Shot photo={PHOTO.auroraPerson} className="ml-guests-fig" drift={9} />
        </div>
        <dl className="ml-themes ml-rv" aria-label="What reviews mention most">
          {REVIEW_THEMES.map((t) => (
            <div key={t.theme}><dt>{t.theme}</dt><dd>{t.mentions}</dd></div>
          ))}
        </dl>
        <p className="ml-stat ml-rv">Counts from the listing's own review index, August 2026.</p>
      </section>

      {/* 09 · booking */}
      <section className="ml-book" id="boka">
        <div className="ml-book-intro">
          <Headline text="Enquire about your stay." size={72} floor={34} measure={560} />
          <p className="ml-body ml-rv">
            Every request goes directly to Esther and Pierre, the people who welcome
            guests here themselves.
          </p>
          <div className="ml-owner-note ml-rv">
            <p className="ml-owner-note-label">The owners' side</p>
            <p className="ml-owner-note-body">
              Every request lands in a dashboard built for this cabin: confirm or decline in
              one tap, watch the week fill up.{' '}
              <Link className="ml-a" to="/preview/mysticlight/stjornbord">
                Open the dashboard demo
              </Link>{' '}
              beside this tab and send yourself a request.
            </p>
          </div>
        </div>
        <BookingForm />
      </section>

      {/* closing image */}
      <section className="ml-close">
        <Shot photo={PHOTO.auroraWhirl} className="ml-close-fig" drift={12} />
        <p className="ml-close-cap ml-rv">
          Clear skies can never be promised. When they arrive, guests have described
          unforgettable nights above the fjord.
        </p>
      </section>

      {/* footer facts */}
      <footer className="ml-foot">
        <div className="ml-foot-grid">
          <div>
            <p className="ml-foot-mark">MYSTIC LIGHT LODGE</p>
            <p className="ml-foot-line">{HOST.names} · Superhosts</p>
            <p className="ml-foot-line">Búðardalur, Dalabyggð, West Iceland</p>
          </div>
          <div>
            <p className="ml-foot-line">{FACTS.distanceReykjavik}</p>
            <p className="ml-foot-line">{FACTS.ringRoad}</p>
            <p className="ml-foot-line">Check-in: {FACTS.checkIn}</p>
          </div>
          <div>
            <p className="ml-foot-line">
              Photography: Esther and Pierre's own listing photos, retrieved August 2026.
            </p>
            <p className="ml-foot-line">
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
@font-face { font-family: 'Nippo'; src: url('${BASE}fonts/nippo/Nippo-Variable.woff2') format('woff2'); font-weight: 200 700; font-display: swap; }
@font-face { font-family: 'Supreme'; src: url('${BASE}fonts/supreme/Supreme-Variable.woff2') format('woff2'); font-weight: 100 800; font-display: swap; }
@font-face { font-family: 'Space Mono'; src: url('${BASE}fonts/space-mono/SpaceMono-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Space Mono'; src: url('${BASE}fonts/space-mono/SpaceMono-Bold.woff2') format('woff2'); font-weight: 700; font-display: swap; }

.ml-root {
  --u: clamp(.42px, calc(100vw / 1440), 1.1px);
  --ml-c: ${CANVAS};
  --ml-ink: ${INK};
  --ml-amber: ${AMBER};
  --ml-blue: #547297;
  --ml-velvet: #203358;
  --ml-soft: color-mix(in srgb, var(--ml-velvet) 40%, var(--ml-c) 60%);
  --ml-mute: color-mix(in srgb, var(--ml-ink) 70%, transparent);
  --ml-hair: color-mix(in srgb, var(--ml-ink) 15%, transparent);
  background: var(--ml-c);
  color: var(--ml-ink);
  font-family: ${BODY_FONT};
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
.ml-root ::selection { background: var(--ml-amber); color: var(--ml-c); }
.ml-root a { color: inherit; }
.ml-root :focus-visible {
  outline: 2px solid var(--ml-amber);
  outline-offset: 2px;
  border-radius: 2px;
}
.ml-root a, .ml-root button, .ml-root input, .ml-root select, .ml-root textarea {
  touch-action: manipulation;
}
.ml-a { color: var(--ml-amber); }
.ml-a:hover { text-decoration: underline; }

/* nav: fixed, borderless, mist ink over a quiet top scrim (no mix-blend) */
.ml-root section[id] {
  /* The header is fixed, so an anchor jump would otherwise park the
     section's first line underneath it (measured: 69px swallowed). */
  scroll-margin-top: clamp(88px, calc(var(--u) * 116), 136px);
}
.ml-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 40;
  display: flex; align-items: center; gap: calc(var(--u) * 40);
  padding: calc(var(--u) * 22) calc(var(--u) * 48);
  color: var(--ml-ink);
  background: linear-gradient(180deg, rgba(16,20,27,.55) 0%, transparent 100%);
}
.ml-nav-mark {
  font-family: ${DISPLAY}; font-weight: 300; letter-spacing: .16em;
  text-decoration: none; font-size: ${fluid(15, 15)};
}
.ml-nav-mark-amber { color: var(--ml-amber); font-weight: 500; }
.ml-nav-links { display: flex; gap: calc(var(--u) * 28); margin-left: auto; }
.ml-nav-links a {
  text-decoration: none; font-size: ${fluid(14, 15)}; color: inherit;
  opacity: .72; transition: opacity .25s ease;
}
.ml-nav-links a:hover { opacity: 1; }
.ml-nav-cta {
  text-decoration: none; font-size: ${fluid(14, 15)}; font-weight: 500;
  padding: calc(var(--u) * 10) calc(var(--u) * 18);
  border: 1px solid color-mix(in srgb, var(--ml-amber) 55%, transparent);
  color: var(--ml-amber);
  border-radius: 2px;
  transition: border-color .25s ease, background-color .25s ease;
}
.ml-nav-cta:hover { border-color: var(--ml-amber); background: color-mix(in srgb, var(--ml-amber) 12%, transparent); }

/* hero */
.ml-hero { position: relative; min-height: 100svh; display: grid; overflow: hidden; }
.ml-hero-media { position: absolute; inset: 0; }
.ml-hero-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ml-hero-media::after {
  content: ''; position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(200deg, rgba(16,20,27,.15) 30%, rgba(16,20,27,.72) 100%);
}
.ml-wordmark {
  position: relative; z-index: 2; align-self: center; justify-self: center;
  margin: 0; text-align: center; color: var(--ml-ink);
  font-family: ${DISPLAY}; font-weight: 300; letter-spacing: .06em;
  font-size: clamp(38px, 9vw, 138px); line-height: 1.02;
}
.ml-wm-amber { color: var(--ml-amber); font-weight: 500; }
.ml-hero-block {
  position: relative; z-index: 1; align-self: end;
  padding: 0 calc(var(--u) * 48) calc(calc(var(--u) * 64) + env(safe-area-inset-bottom, 0px));
  max-width: calc(var(--u) * 820);
}
.ml-hero-sub {
  margin: 0; font-size: ${fluid(19, 15)}; line-height: 1.55; font-weight: 300;
  max-width: 46ch; color: color-mix(in srgb, var(--ml-ink) 92%, transparent);
}
.ml-hero-link {
  display: inline-block; margin-top: calc(var(--u) * 24);
  font-size: ${fluid(16, 14)}; font-weight: 400; color: var(--ml-amber);
  text-decoration: none; position: relative; padding-bottom: 3px;
}
.ml-hero-link::after {
  content: ''; position: absolute; left: 0; bottom: 0; height: 1px; width: 100%;
  background: currentColor; transform: scaleX(0); transform-origin: left;
  transition: transform .45s cubic-bezier(.23,1,.32,1);
}
@media (hover: hover) and (pointer: fine) {
  .ml-hero-link:hover::after { transform: scaleX(1); }
}
.ml-hero-link:focus-visible::after { transform: scaleX(1); }

.ml-cta {
  display: inline-block; margin-top: calc(var(--u) * 26);
  background: var(--ml-amber); color: var(--ml-c);
  font-weight: 500; font-size: ${fluid(15, 13)}; text-decoration: none;
  padding: calc(var(--u) * 14) calc(var(--u) * 26);
  border: 0; border-radius: 2px; cursor: pointer;
  transition: filter .25s ease;
}
.ml-cta:hover { filter: brightness(1.08); }
.ml-cta:active { transform: translateY(1px); }

/* shared text */
.ml-headline {
  margin: 0; font-family: ${DISPLAY}; font-weight: 400; letter-spacing: -.01em;
  line-height: 1.14; text-wrap: balance;
}
.ml-line {
  display: inline-block; overflow: hidden; vertical-align: bottom;
  padding: .2em .04em .12em; margin: -.2em -.04em -.12em;
}
.ml-word { display: inline-block; }
.ml-body {
  font-size: ${fluid(17, 15)}; line-height: 1.62; font-weight: 300;
  color: var(--ml-mute); max-width: 58ch; margin: calc(var(--u) * 26) 0 0;
}
.ml-mono-label {
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .14em;
  text-transform: uppercase; color: var(--ml-mute); margin: 0 0 calc(var(--u) * 16);
  line-height: 1.4;
}
.ml-mono-is { color: var(--ml-amber); }
/* the rationed second tone: high tide only, so it reads as the water rising
   rather than a second accent competing with amber everywhere else. */
.ml-mono-is-blue { color: var(--ml-blue); }
.ml-stat {
  font-family: ${MONO}; font-size: ${fluid(12, 12)};
  color: var(--ml-mute); margin: calc(var(--u) * 14) 0 0;
}

/* photographs: focus pull + masked arrival, THEN continuous drift.
   Arrival: heavy blur falls away from sharp AT THE SAME TIME an off-axis
   wide-feather mask sweeps open. Gradient colour stops never interpolate in
   a CSS transition, so the sweep animates mask-position (72% 72% -> 0% 0%),
   never the gradient itself. Once the sweep finishes, JS (useMotion) adds
   .ml-mask-off so a resting mask never sits under a photo that now drifts
   per frame ([[webgl-image-effect-gotchas]]: a static mask under a
   per-frame transform de-optimises compositing — measured 60fps -> 30fps).
   Drift (Heklusýn spec, ported from Mirror House): .ml-shot is the fixed,
   overflow-hidden window; .ml-frame-in is the oversized wrapper the JS
   ticker translates every frame; the img fills that wrapper exactly and
   carries NO transform of its own, so the arrival's blur/mask and the
   scroll drift never fight over the same property on the same element. */
.ml-shot { position: relative; overflow: hidden; margin: 0; background: var(--ml-soft); }
.ml-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; }
/* translate3d already promotes these; the extra hint is only worth its
   memory where there is memory to spare */
@media (min-width: 992px) { .ml-frame-in { will-change: transform; } }
.ml-frame-in img {
  width: 100%; height: 100%; max-width: none; object-fit: cover; display: block;
}
/* the hero is the one exception: full-bleed backdrop, focus-pull only, no
   mask, no drift — same exclusion Mirror House needed. */
.ml-js .ml-hero-media img {
  transition: filter 1.3s cubic-bezier(.25,1,.5,1), transform 1.3s cubic-bezier(.25,1,.5,1);
}
.ml-js .ml-hero-media:not(.is-in) img { filter: blur(20px); transform: scale(1.04); }

.ml-js .ml-shot img {
  transition:
    filter 1.15s cubic-bezier(.25,1,.5,1),
    mask-position 1.15s cubic-bezier(.25,1,.5,1), -webkit-mask-position 1.15s cubic-bezier(.25,1,.5,1);
  -webkit-mask-image: linear-gradient(168deg, transparent 0%, #000 42%, #000 100%);
  mask-image: linear-gradient(168deg, transparent 0%, #000 42%, #000 100%);
  -webkit-mask-size: 300% 300%;
  mask-size: 300% 300%;
  -webkit-mask-position: 72% 72%;
  mask-position: 72% 72%;
}
.ml-js .ml-shot:not(.is-in) img { filter: blur(20px); }
.ml-js .ml-shot.is-in img { -webkit-mask-position: 0% 0%; mask-position: 0% 0%; }
.ml-shot img.ml-mask-off { -webkit-mask-image: none; mask-image: none; }

.ml-js .ml-rv:not(.ml-shot):not(.ml-hero-media):not(.is-in) { opacity: 0; transform: translateY(24px); }
.ml-js .ml-rv:not(.ml-shot):not(.ml-hero-media) {
  transition: opacity .9s cubic-bezier(.25,1,.5,1), transform .9s cubic-bezier(.25,1,.5,1);
}

/* sections: shared rhythm */
.ml-mirror {
  display: grid; grid-template-columns: 7fr 4fr; align-items: end;
  gap: calc(var(--u) * 90); padding: calc(var(--u) * 180) calc(var(--u) * 48) calc(var(--u) * 120);
  max-width: calc(var(--u) * 1400); margin: 0 auto;
}
.ml-mirror-fig { width: 100%; }
.ml-flagship { position: relative; }
.ml-flagship-fig { aspect-ratio: 21 / 9 !important; }
.ml-flagship-cap {
  position: absolute; left: calc(var(--u) * 48); bottom: calc(var(--u) * 40); z-index: 1;
  margin: 0; max-width: 34ch; font-size: ${fluid(22, 16)}; font-weight: 300; line-height: 1.4;
  color: var(--ml-ink); text-shadow: 0 2px 18px rgba(16,20,27,.85);
}

.ml-shore { padding: calc(var(--u) * 150) calc(var(--u) * 48) calc(var(--u) * 60); max-width: calc(var(--u) * 1400); margin: 0 auto; }
.ml-shore-head { max-width: calc(var(--u) * 680); margin: 0 0 calc(var(--u) * 56); }
.ml-scope-wrap {
  position: relative; width: 100%; aspect-ratio: 16 / 8; overflow: hidden;
  border-radius: 4px; background: var(--ml-soft);
}
@media (hover: hover) and (pointer: fine) {
  .ml-scope-wrap.is-engaged { cursor: none; }
}
.ml-scope-base { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ml-scope-lens {
  position: absolute; top: 0; left: 0; z-index: 2; pointer-events: none;
  width: clamp(120px, 20vw, 230px); height: clamp(120px, 20vw, 230px);
  border-radius: 50%; overflow: hidden;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ml-amber) 70%, transparent), 0 10px 40px rgba(0,0,0,.5);
  opacity: 0; transition: opacity .3s ease;
}
.ml-scope-wrap.is-engaged .ml-scope-lens { opacity: 1; }
.ml-scope-zoom { position: absolute; max-width: none; display: block; }
.ml-scope-ring {
  position: absolute; inset: 8%; border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--ml-amber) 55%, transparent);
}
.ml-scope-cross {
  position: absolute; left: 50%; top: 50%; width: 1px; height: 22px;
  background: color-mix(in srgb, var(--ml-amber) 70%, transparent);
  transform: translate(-50%, -50%);
  box-shadow: 11px 0 0 color-mix(in srgb, var(--ml-amber) 70%, transparent) inset;
}
.ml-scope-cross::after {
  content: ''; position: absolute; left: -11px; top: 11px; width: 22px; height: 1px;
  background: color-mix(in srgb, var(--ml-amber) 70%, transparent);
}
.ml-mark {
  position: absolute; z-index: 3; transform: translate(-50%, -50%);
  display: flex; align-items: center; gap: 8px;
  min-width: 44px; min-height: 44px; padding: 0;
  background: none; border: 0; cursor: pointer; color: var(--ml-ink);
}
.ml-mark-dot {
  width: 11px; height: 11px; border-radius: 50%;
  background: color-mix(in srgb, var(--ml-c) 55%, transparent);
  border: 1.5px solid var(--ml-amber);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--ml-c) 45%, transparent);
  transition: transform .2s ease;
}
.ml-mark-tag {
  font-family: ${MONO}; font-size: 12px; letter-spacing: .1em; text-transform: uppercase;
  background: color-mix(in srgb, var(--ml-c) 78%, transparent);
  padding: 3px 8px; border-radius: 2px; opacity: 0; transform: translateX(-4px);
  transition: opacity .2s ease, transform .2s ease;
}
.ml-mark:hover .ml-mark-tag, .ml-mark:focus-visible .ml-mark-tag, .ml-mark.is-on .ml-mark-tag { opacity: 1; transform: translateX(0); }
.ml-mark.is-on .ml-mark-dot, .ml-mark:hover .ml-mark-dot { transform: scale(1.25); }
.ml-scope-caption {
  margin: calc(var(--u) * 20) 0 0; min-height: 1.6em;
  font-size: ${fluid(15, 14)}; color: var(--ml-mute); max-width: 60ch;
}
.ml-scope-caption strong { color: var(--ml-amber); font-weight: 500; }

.ml-divider { position: relative; }
.ml-divider-fig { aspect-ratio: 21 / 9 !important; }
.ml-divider-cap {
  position: absolute; right: calc(var(--u) * 48); bottom: calc(var(--u) * 36); z-index: 1;
  margin: 0; font-family: ${MONO}; font-size: ${fluid(13, 12)}; letter-spacing: .04em;
  color: var(--ml-ink); text-shadow: 0 2px 14px rgba(16,20,27,.85);
}

.ml-sky-intro {
  padding: calc(var(--u) * 130) calc(var(--u) * 48) calc(var(--u) * 60);
  max-width: calc(var(--u) * 1000); margin: 0 auto;
}
/* THE SKYLIGHT, now a full-bleed horizontal journey (not a window): a
   pinned wrapper holding a flex track of three 100vw/100svh panels that
   travel sideways under a straight vertical scroll. See useMotion for the
   single-tween engine. */
.ml-sky-outer { position: relative; overflow: hidden; }
.ml-sky-track { display: flex; width: max-content; height: 100svh; }
.ml-sky-panel {
  flex: none; position: relative; overflow: hidden;
  width: 100vw; height: 100%; background: var(--ml-c);
}
.ml-sky-panel-img { width: 100%; height: 100%; object-fit: cover; display: block; }
/* a scrim per panel, same recipe as the hero, so each caption stays legible
   over whichever sky is currently centred */
.ml-sky-panel::after {
  content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(200deg, transparent 45%, rgba(16,20,27,.68) 100%);
}
.ml-sky-panel-cap {
  position: absolute; left: calc(var(--u) * 48); bottom: calc(var(--u) * 48); z-index: 2;
  max-width: 34ch;
}
.ml-sky-cap-label { margin-bottom: calc(var(--u) * 8); }
.ml-sky-cap-text { margin: 0; font-size: ${fluid(20, 16)}; line-height: 1.4; font-weight: 300; color: var(--ml-ink); }
.ml-sky-cap-by { color: var(--ml-mute); font-size: ${fluid(14, 13)}; }
.ml-sky-fallback { display: none; }

.ml-inside { padding: calc(var(--u) * 130) 0 calc(var(--u) * 140); }
.ml-inside-hero { width: min(100%, calc(var(--u) * 1200)); margin: 0 auto; aspect-ratio: 16 / 9 !important; }
.ml-inside-row {
  display: grid; grid-template-columns: 6fr 4fr; gap: calc(var(--u) * 90);
  align-items: start; max-width: calc(var(--u) * 1200);
  margin: calc(var(--u) * 84) auto 0; padding: 0 calc(var(--u) * 48);
}
.ml-inside-pair {
  display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 24);
  max-width: calc(var(--u) * 1200); margin: calc(var(--u) * 56) auto 0; padding: 0 calc(var(--u) * 48);
}

.ml-fjaran {
  padding: calc(var(--u) * 130) calc(var(--u) * 48) calc(var(--u) * 150);
  max-width: calc(var(--u) * 1200); margin: 0 auto;
}
.ml-fjaran-head { max-width: calc(var(--u) * 620); }
.ml-fjaran-figs {
  display: grid; grid-template-columns: 3fr 2fr; gap: calc(var(--u) * 24);
  margin: calc(var(--u) * 56) 0 0;
}
.ml-fjaran-lead, .ml-fjaran-side { aspect-ratio: 4 / 3 !important; }
.ml-fjaran-quote {
  margin: calc(var(--u) * 56) 0 calc(var(--u) * 32); max-width: 56ch;
}
.ml-fjaran-quote p {
  margin: 0; font-family: ${DISPLAY}; font-size: ${fluid(26, 19)}; font-weight: 300; line-height: 1.4;
}
.ml-fjaran-quote cite {
  display: block; margin-top: calc(var(--u) * 14); font-style: normal;
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--ml-mute);
}

.ml-twin {
  padding: calc(var(--u) * 40) calc(var(--u) * 48) calc(var(--u) * 150);
  max-width: calc(var(--u) * 1400); margin: 0 auto;
}
.ml-twin-copy { max-width: calc(var(--u) * 640); margin: 0 0 calc(var(--u) * 56); }
.ml-twin-figs {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 20);
}
.ml-twin-wide { grid-column: 1 / -1; aspect-ratio: 21 / 9 !important; }

.ml-guests { padding: calc(var(--u) * 150) calc(var(--u) * 48); max-width: calc(var(--u) * 1240); margin: 0 auto; }
.ml-guests-meta {
  font-family: ${MONO}; font-size: ${fluid(13, 12)}; color: var(--ml-mute);
  margin: calc(var(--u) * 20) 0 0;
}
.ml-guests-row {
  display: grid; grid-template-columns: 7fr 4fr; gap: calc(var(--u) * 72);
  margin-top: calc(var(--u) * 64); align-items: start;
}
.ml-quotes { list-style: none; margin: 0; padding: 0; display: grid; gap: calc(var(--u) * 44); }
.ml-quote blockquote { margin: 0; }
.ml-quote blockquote p {
  margin: 0; font-size: ${fluid(20, 16)}; line-height: 1.45; font-weight: 300;
  font-family: ${DISPLAY};
}
.ml-quote-by {
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; color: var(--ml-mute);
  margin: calc(var(--u) * 14) 0 0;
}
.ml-guests-fig { aspect-ratio: 3 / 4 !important; }
.ml-themes {
  display: flex; flex-wrap: wrap; gap: calc(var(--u) * 48) calc(var(--u) * 64);
  margin: calc(var(--u) * 80) 0 0; padding: calc(var(--u) * 26) 0 0;
  border-top: 1px solid var(--ml-hair);
}
.ml-themes div { display: flex; align-items: baseline; gap: calc(var(--u) * 12); }
.ml-themes dt { font-size: ${fluid(15, 13)}; font-weight: 300; color: var(--ml-mute); }
.ml-themes dd { margin: 0; font-variant-numeric: tabular-nums; font-family: ${MONO}; font-size: ${fluid(26, 19)}; color: var(--ml-amber); }

.ml-book {
  display: grid; grid-template-columns: 5fr 6fr; gap: calc(var(--u) * 90);
  padding: calc(var(--u) * 40) calc(var(--u) * 48) calc(var(--u) * 160);
  max-width: calc(var(--u) * 1400); margin: 0 auto; align-items: start;
}
.ml-book-form, .ml-book-done {
  background: var(--ml-soft); border: 1px solid var(--ml-hair); border-radius: 2px;
  padding: calc(var(--u) * 38);
}
.ml-book-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 22); }
.ml-field { display: flex; flex-direction: column; gap: 6px; }
.ml-field-wide { grid-column: 1 / -1; }
.ml-field-label {
  font-family: ${MONO}; font-size: ${fluid(11, 12)}; letter-spacing: .1em;
  text-transform: uppercase; color: var(--ml-mute);
}
.ml-optional { text-transform: none; letter-spacing: 0; }
.ml-field input, .ml-field select, .ml-field textarea {
  font: inherit; font-size: 16px; font-weight: 300; color: var(--ml-ink);
  color-scheme: dark;
  background: color-mix(in srgb, var(--ml-c) 55%, transparent);
  border: 1px solid var(--ml-hair); border-radius: 2px;
  padding: 10px 12px; min-height: 44px;
}
.ml-field textarea { min-height: 0; resize: vertical; }
.ml-owner-note { margin-top: calc(var(--u) * 44); padding-top: calc(var(--u) * 22); border-top: 1px solid var(--ml-hair); }
.ml-owner-note-label {
  font-family: ${MONO}; font-size: ${fluid(11, 12)}; letter-spacing: .12em;
  text-transform: uppercase; color: var(--ml-amber); margin: 0 0 calc(var(--u) * 10);
}
.ml-owner-note-body { font-size: ${fluid(14, 13)}; line-height: 1.65; color: var(--ml-mute); margin: 0; max-width: 44ch; }
.ml-field-error { color: #D98A6E; font-size: ${fluid(14, 13)}; margin: calc(var(--u) * 18) 0 0; }
.ml-book-form .ml-cta { margin-top: calc(var(--u) * 26); width: 100%; text-align: center; }
.ml-book-note { font-size: ${fluid(13, 12)}; line-height: 1.6; color: var(--ml-mute); margin: calc(var(--u) * 18) 0 0; }
.ml-book-done-title { margin: 0; font-family: ${DISPLAY}; font-weight: 400; font-size: ${fluid(32, 22)}; }
.ml-book-done-body { margin: calc(var(--u) * 18) 0 0; line-height: 1.6; font-size: ${fluid(16, 14)}; }
.ml-ghost {
  margin-top: calc(var(--u) * 22); font: inherit; font-size: ${fluid(14, 13)}; cursor: pointer;
  background: none; color: var(--ml-ink); border: 1px solid var(--ml-hair); border-radius: 2px;
  padding: calc(var(--u) * 10) calc(var(--u) * 18);
}
.ml-ghost:hover { border-color: var(--ml-amber); }

.ml-close { position: relative; }
.ml-close-fig { aspect-ratio: 21 / 9 !important; }
.ml-close-cap {
  position: absolute; left: calc(var(--u) * 48); bottom: calc(var(--u) * 40); z-index: 1;
  margin: 0; max-width: 36ch; font-size: ${fluid(18, 15)}; line-height: 1.5;
  color: var(--ml-ink); text-shadow: 0 2px 16px rgba(16,20,27,.85);
}

.ml-foot { border-top: 1px solid var(--ml-hair); }
.ml-foot-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 44);
  max-width: calc(var(--u) * 1400); margin: 0 auto;
  padding: calc(var(--u) * 52) calc(var(--u) * 48) calc(var(--u) * 68);
}
.ml-foot-mark { font-weight: 300; letter-spacing: .18em; font-size: ${fluid(14, 15)}; margin: 0 0 calc(var(--u) * 12); }
.ml-foot-line { font-size: ${fluid(13, 15)}; line-height: 1.6; color: var(--ml-mute); margin: 0 0 calc(var(--u) * 8); }

/* ── responsive ── */
@media (max-width: 991px) {
  .ml-nav { padding: 10px 20px; gap: 16px; }
  .ml-nav-mark, .ml-nav-cta, .ml-nav-links a, .ml-hero-link {
    display: inline-flex; align-items: center; min-height: 44px;
  }
  .ml-nav-cta { padding: 0 16px; }
  .ml-nav-links { display: none; }
  .ml-nav-cta { margin-left: auto; }
  .ml-hero-block { padding: 0 20px 40px; }
  .ml-wordmark { font-size: clamp(30px, 11vw, 62px); }
  .ml-cta, .ml-ghost { min-height: 44px; }
  .ml-mirror, .ml-inside-row, .ml-fjaran-figs, .ml-book { grid-template-columns: 1fr; gap: 40px; }
  .ml-mirror, .ml-fjaran, .ml-twin, .ml-book, .ml-guests, .ml-shore, .ml-sky-intro {
    padding-left: 20px; padding-right: 20px;
  }
  .ml-mirror { padding-top: 96px; padding-bottom: 72px; }
  .ml-shore { padding-top: 96px; }
  .ml-inside-pair, .ml-twin-figs { grid-template-columns: 1fr; }
  .ml-twin-wide { aspect-ratio: 4 / 3 !important; }
  .ml-book-grid { grid-template-columns: 1fr; }
  .ml-guests-row { grid-template-columns: 1fr; gap: 32px; }
  .ml-guests-fig { aspect-ratio: 16 / 9 !important; }
  .ml-foot-grid { grid-template-columns: 1fr; gap: 20px; padding: 36px 20px; }
  .ml-flagship-cap, .ml-divider-cap, .ml-close-cap { left: 20px; right: 20px; bottom: 24px; max-width: none; }
  .ml-scope-wrap { aspect-ratio: 4 / 3; cursor: auto; }
}

/* the horizontal journey only behaves well at desktop widths (≥1024px,
   matching the JS gate in useMotion); below that, a normal vertical stack,
   fully visible, no pin, no sideways travel */
@media (max-width: 1023px) {
  .ml-sky-outer { display: none; }
  .ml-sky-fallback {
    display: grid; grid-template-columns: 1fr; gap: calc(var(--u) * 4);
    padding: 0 20px calc(var(--u) * 40);
  }
  .ml-sky-fallback-fig { margin: 0; }
  .ml-sky-fallback-fig img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; border-radius: 8px; }
  .ml-sky-fallback-fig figcaption { padding: 14px 4px 28px; }
}

/* ── reduced motion: everything renders visible, statically ── */
@media (prefers-reduced-motion: reduce) {
  .ml-root * { transition: none !important; animation: none !important; }
  .ml-word { transform: none !important; opacity: 1 !important; }
  .ml-shot img {
    filter: none !important; transform: none !important;
    -webkit-mask-image: none !important; mask-image: none !important;
  }
  /* the drift loop never runs under reduced motion (useMotion bails out
     before creating it); this just makes sure the wrapper itself renders
     fully framed with no leftover oversize, rather than relying on an
     absent transform to look correct */
  .ml-frame-in { inset: 0; transform: none !important; }
  /* reduced motion always renders the vertical stack, at any width — no
     pin, no horizontal travel, everything visible at once */
  .ml-sky-outer { display: none; }
  .ml-sky-fallback {
    display: grid; grid-template-columns: 1fr; gap: calc(var(--u) * 16);
    padding: 0 calc(var(--u) * 48) calc(var(--u) * 60);
    max-width: calc(var(--u) * 900); margin: 0 auto;
  }
  .ml-sky-fallback-fig img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; border-radius: 8px; }
  .ml-sky-fallback-fig figcaption { padding: 14px 2px 0; }
  .ml-scope-lens { transition: none !important; }
}
.ml-static .ml-rv img { filter: none; transform: none; -webkit-mask-image: none; mask-image: none; }
.ml-static .ml-rv { opacity: 1; transform: none; }
.ml-static .ml-frame-in { inset: 0; }
`
