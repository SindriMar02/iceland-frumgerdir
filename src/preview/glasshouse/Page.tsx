import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setNoindex, setThemeColor } from '../../lib/preview'
import { demo, type DemoBooking } from './demoStore'
import { FACTS, HOST, JSON_LD, PHOTO, REVIEW_QUOTES, srcSet } from './content'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('glasshouse')

type Photo = { src: string; alt: string; ratio: string }

/* ── THE GLASS HOUSE · "UPP" (looking up) ───────────────────────────────────
   Their skylight sits directly over the bed, so this is the catalogue's only
   page whose gravity points UP. Full spec: ./DESIGN.md.

   The devices, each derived from that one fact:
    1. The loader is the skylight: a sky-filling rectangle with a conic
       progress ring. Its exit EXPANDS — the skylight becomes the page.
    2. The wordmark settles on the z-axis: oversized and soft, then down
       toward the reader into focus. Scroll sends it back UP through the
       glass. Entrance drives scale/blur on the inner element, the scrub
       drives y/opacity on the wrapper — separate elements, never a fight.
    3. THE WINDOW — a pinned aperture framed like their ceiling. The sky
       moves THROUGH it as you scroll: morning, evening, then their own
       aurora photograph, which releases to full bleed. The sky travels
       DOWNWARD (you are on your back; scrolling pulls the night over you).
    4. Every reveal arrives from ABOVE (y -16 → 0), inverting the house
       default. Drift frames per Heklusýn spec, gated during the pin.

   ONE typeface (Cabinet Grotesk), 400 body / 500 marks, tracking scaled by
   size. Fluid unit scoped to this root. ─────────────────────────────────── */

const SKY = '#DFE7EE'
const INK = '#1C2228'
const NIGHT = '#0B1016'
const NIGHT_INK = '#E6ECF2'
const EMBER = '#C97B4A'        // fills only (with ink text)
const EMBER_TEXT = '#96521F'   // accent text on the sky ground (AA)

const SANS = "'Alpino', system-ui, sans-serif"
const BASE = import.meta.env.BASE_URL

/** The window film: 48 frames of THEIR view, generated from their own
    photograph, carrying the sky from open day through dusk to a full aurora.
    Shipped as a frame sequence rather than a <video>, because seeking a video
    by currentTime never scrubs smoothly under a scroll scrub. */
const SKY_FRAMES = 48
const skyFrame = (i: number) =>
  `${BASE}glasshouse/skyseq/${String(i + 1).padStart(3, '0')}.jpg`

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/* ── motion engine ───────────────────────────────────────────────────────── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready || reduced()) return
    const root = document.querySelector<HTMLElement>('.gh-root')
    if (!root) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    const cleanups: Array<() => void> = []
    let windowST: ScrollTrigger | null = null

    /* reveals: IO arms 'is-in' once; CSS owns the transition (from ABOVE). */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.2 },
    )
    root.querySelectorAll('.gh-rv').forEach((el) => io.observe(el))

    /* nav flips to night chrome over the dark window finale */
    const nav = root.querySelector<HTMLElement>('.gh-nav')
    const navIo = new IntersectionObserver(
      (entries) => nav?.classList.toggle('is-dark', entries.some((e) => e.isIntersecting)),
      { rootMargin: '-2% 0px -94% 0px' },
    )
    root.querySelectorAll('[data-gh-dark]').forEach((el) => navIo.observe(el))

    const ctx = gsap.context(() => {
      /* word-mask headline: words drop IN from above (the inverted gravity) */
      root.querySelectorAll<HTMLElement>('[data-gh-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.gh-word')
        if (!words.length) return
        gsap.fromTo(
          words,
          { yPercent: -116, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            duration: 1.05, ease: 'expo.out', stagger: 0.06,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          },
        )
      })

      /* THE WORDMARK — the z-settle.
         Oversized, soft and above you; it settles DOWN toward the reader into
         focus. Scroll returns it upward through the glass. */
      const wmIn = root.querySelector<HTMLElement>('.gh-wm-in')
      const wmEl = root.querySelector<HTMLElement>('.gh-wm')
      const heroEl = root.querySelector<HTMLElement>('.gh-hero')

      if (wmIn) {
        gsap.set(wmIn, { autoAlpha: 0, scale: 1.14, filter: 'blur(14px)' })
        let opened = false
        const openWordmark = () => {
          if (opened) return
          opened = true
          gsap.to(wmIn, {
            autoAlpha: 1, scale: 1, filter: 'blur(0px)',
            duration: 1.5, ease: 'expo.out',
          })
        }
        if (root.querySelector('.gh-loader')) {
          window.addEventListener('gh:revealed', openWordmark, { once: true })
        } else {
          gsap.delayedCall(0.15, openWordmark)
        }
        /* rAF suspends in a hidden tab; setTimeout keeps ticking. */
        window.setTimeout(openWordmark, 3600)
      }

      if (heroEl && wmEl) {
        gsap.to(wmEl, {
          y: -110, opacity: 0.06, ease: 'none',
          scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
      }

      /* THE WINDOW — the skylight opens, again and again.
         Each photograph is a pane hinged along the TOP edge of the aperture.
         Scroll swings the front pane up and away on rotateX, revealing the
         next beneath it, exactly the way their roof window opens. The frame
         NEVER expands to full bleed: the section ends holding its last pane,
         because the whole idea is that you are looking THROUGH something.
         One timeline, one scrub, monotonic and reversible. */
      const win = root.querySelector<HTMLElement>('.gh-window')
      const canvas = root.querySelector<HTMLCanvasElement>('.gh-sky')
      const caps = root.querySelectorAll<HTMLElement>('.gh-pane-cap')
      const aperture = root.querySelector<HTMLElement>('.gh-aperture')
      if (win && aperture && canvas && caps.length === 4 && window.innerWidth >= 768) {
        const c2d = canvas.getContext('2d')
        const frames: HTMLImageElement[] = []
        let drawn = -1

        /* Fit to the aperture's own box at device resolution. Re-run on every
           ScrollTrigger refresh, since the pin changes layout. */
        const fit = () => {
          const r = canvas.getBoundingClientRect()
          const dpr = Math.min(2, window.devicePixelRatio || 1)
          canvas.width = Math.max(1, Math.round(r.width * dpr))
          canvas.height = Math.max(1, Math.round(r.height * dpr))
          drawn = -1                              // size changed, force a redraw
        }
        /* object-fit: cover, by hand */
        const paint = (i: number) => {
          const im = frames[i]
          if (!c2d || !im || !im.complete || !im.naturalWidth) return
          const cw = canvas.width, ch = canvas.height
          const k = Math.max(cw / im.naturalWidth, ch / im.naturalHeight)
          const w = im.naturalWidth * k, h = im.naturalHeight * k
          c2d.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h)
          drawn = i
        }
        for (let i = 0; i < SKY_FRAMES; i++) {
          const im = new Image()
          im.decoding = 'async'
          im.src = skyFrame(i)
          frames.push(im)
          /* a CACHED image never fires load, so paint straight away if it is
             already complete rather than waiting on an event that will not
             come. The canvas is never faded in — it paints or it does not. */
          if (im.complete) { if (i === 0) paint(0) }
          else if (i === 0) im.addEventListener('load', () => paint(0), { once: true })
        }
        fit()
        gsap.set(caps, { autoAlpha: 0, y: -22 })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: win, start: 'top top', end: '+=280%',
            pin: true, scrub: 0.9, anticipatePin: 1, invalidateOnRefresh: true,
            onRefresh: () => { fit(); paint(Math.max(0, drawn)) },
          },
        })
        windowST = tl.scrollTrigger ?? null

        /* the scrub drives a plain number; the number picks the frame */
        const cursor = { f: 0 }
        tl.to(cursor, {
          f: SKY_FRAMES - 1, ease: 'none', duration: 1,
          onUpdate: () => {
            const i = Math.max(0, Math.min(SKY_FRAMES - 1, Math.round(cursor.f)))
            if (i !== drawn) paint(i)
          },
        }, 0)

        const n = caps.length
        const slice = 1 / n
        caps.forEach((_, i) => {
          /* Captions are stacked in one spot, so their opacities must not
             overlap (two captions render over each other) and must not leave a
             gap (none renders). Caption i leaves across .80-.98 of its slice;
             caption i+1 arrives from .98, exactly where the previous ended. */
          tl.to(caps[i], { autoAlpha: 1, y: 0, duration: slice * 0.18, ease: 'power2.out' },
            slice * (i - 0.02))
          if (i < n - 1) {
            tl.to(caps[i], { autoAlpha: 0, y: 16, duration: slice * 0.18, ease: 'power2.in' },
              slice * (i + 0.80))
          }
        })
      }

      /* seasons band: one clip sweep, summer uncovers winter as it crosses */
      const seasons = root.querySelector<HTMLElement>('.gh-seasons')
      const seasonTop = root.querySelector<HTMLElement>('.gh-season-top')
      if (seasons && seasonTop) {
        gsap.fromTo(
          seasonTop,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 100% 0%)', ease: 'none',
            scrollTrigger: { trigger: seasons, start: 'top 80%', end: 'bottom 30%', scrub: 0.7 },
          },
        )
      }

      /* focusin failsafe */
      const onFocusIn = (e: FocusEvent) => {
        const rv = (e.target as HTMLElement).closest?.('.gh-rv')
        rv?.classList.add('is-in')
      }
      root.addEventListener('focusin', onFocusIn)
      cleanups.push(() => root.removeEventListener('focusin', onFocusIn))
    }, root)

    /* drift: Heklusýn spec — batched reads then writes, clamped p, gated
       while the window is pinned. */
    const driftEls = Array.from(root.querySelectorAll<HTMLElement>('.gh-frame-in'))
    const drift = () => {
      if (windowST?.isActive) return
      const vh = window.innerHeight
      const writes: Array<[HTMLElement, number]> = []
      for (const el of driftEls) {
        const frame = el.parentElement
        if (!frame) continue
        const r = frame.getBoundingClientRect()
        if (r.bottom < -40 || r.top > vh + 40) continue
        const p = Math.max(-1, Math.min(1, 1 - (r.top + r.height / 2) / (vh / 2) / 2))
        const d = Number(el.dataset.drift || 9)
        /* POSITIVE p here, unlike every other build: the photo travels DOWN
           as the page scrolls down, matching this page's inverted gravity. */
        writes.push([el, p * d])
      }
      for (const [el, y] of writes) el.style.transform = `translate3d(0, ${y}%, 0)`
    }

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => { drift(); lenis.raf(t * 1000) }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    drift()

    return () => {
      gsap.ticker.remove(tick)
      io.disconnect()
      navIo.disconnect()
      ctx.revert()
      lenis.destroy()
      cleanups.forEach((fn) => fn())
    }
  }, [ready])
}

/* ── primitives ─────────────────────────────────────────────────────────── */

/** Split PER WORD, never per character (Icelandic accent risk). */
function Headline({ text, size, floor, as: Tag = 'h2', className = '', measure }: {
  text: string; size: number; floor: number
  as?: 'h1' | 'h2' | 'h3'; className?: string; measure?: number
}) {
  const words = useMemo(() => text.split(' '), [text])
  return (
    <Tag
      className={`gh-headline ${className}`}
      data-gh-headline=""
      aria-label={text}
      style={{
        fontSize: fluid(size, floor),
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      }}
    >
      {/* The inter-word space MUST sit outside the overflow-hidden mask: a
          trailing space inside an inline-block is trimmed by the layout
          engine, and every word butts against the next. */}
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="gh-line"><span className="gh-word">{w}</span></span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** Drifting photo frame — the continuous device on every content photo. */
function Frame({ photo, className = '', priority = false, drift = 9, sizes }: {
  photo: Photo; className?: string; priority?: boolean; drift?: number; sizes?: string
}) {
  return (
    <figure className={`gh-frame gh-rv ${className}`} style={{ aspectRatio: photo.ratio }}>
      <div
        className="gh-frame-in"
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

/* ── booking form (the two-sided demo) ──────────────────────────────────── */

const plusDays = (d: string, n: number) => {
  const t = new Date(`${d}T12:00:00`)
  t.setDate(t.getDate() + n)
  return t.toISOString().slice(0, 10)
}

function BookingForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [nights, setNights] = useState(2)
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
      id: `gh-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: 'glasshouse',
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
      <div className="gh-book-done" role="status">
        <p className="gh-book-done-title">Your request is on its way.</p>
        <p className="gh-body">
          In the finished site this lands with Agla and Haffi directly, and the
          nightly price for your dates comes with the reply.
        </p>
        <p className="gh-body">
          <Link className="gh-a" to="/preview/glasshouse/stjornbord">View the owner’s dashboard</Link>{' '}
          to see where the request arrives, or{' '}
          <button type="button" className="gh-ghost" onClick={() => setDone(null)}>
            make another request
          </button>
        </p>
      </div>
    )
  }

  return (
    <form className="gh-book-form" onSubmit={submit} noValidate>
      <div className="gh-fields">
        <label className="gh-field">
          <span className="gh-field-label">Arrival</span>
          <input type="date" name="date" min={minDate} value={date} required
            onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="gh-field">
          <span className="gh-field-label">Nights</span>
          <select name="nights" value={nights} onChange={(e) => setNights(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="gh-field">
          <span className="gh-field-label">Guests</span>
          <select name="people" value={people} onChange={(e) => setPeople(Number(e.target.value))}>
            {[1, 2].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="gh-field gh-field-wide">
          <span className="gh-field-label">Name</span>
          <input type="text" name="name" autoComplete="name" value={name} required
            onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="gh-field gh-field-wide">
          <span className="gh-field-label">Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" value={email} required
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="gh-field gh-field-wide">
          <span className="gh-field-label">Phone <span className="gh-optional">(optional)</span></span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="gh-field gh-field-wide">
          <span className="gh-field-label">Anything the hosts should know <span className="gh-optional">(optional)</span></span>
          <textarea rows={3} name="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      {error && <p className="gh-field-error" role="alert">{error}</p>}
      <button type="submit" className="gh-cta">Enquire about your stay</button>
      <p className="gh-book-note">
        No card, no charge. The request goes straight to the hosts, and the
        nightly price for your dates comes with the reply.
      </p>
    </form>
  )
}

/* ── preloader ──────────────────────────────────────────────────────────────
   The loader IS the skylight: a sky rectangle filling with light as real
   progress loads (hero decode + fonts.ready), a conic ring tracing around
   it. Exit: the rectangle expands until the skylight becomes the page.
   1.1s floor / 2.4s cap, once per session, ?loader forces, never under
   reduced motion. */

const shouldShowLoader = () => {
  if (typeof window === 'undefined' || reduced()) return false
  if (new URLSearchParams(window.location.search).has('loader')) return true
  try { return !sessionStorage.getItem('gh_seen') } catch { return true }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('gh_seen', '1') } catch { /* private mode */ }
    const t0 = performance.now()
    let raf = 0
    let shown = 0
    let heroDone = false
    const hero = new Image()
    hero.decoding = 'async'
    const mark = () => { heroDone = true }
    hero.addEventListener('load', mark, { once: true })
    hero.addEventListener('error', mark, { once: true })
    hero.src = PHOTO.skylight.src
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
        window.setTimeout(onDone, 900)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div className={`gh-loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <div className="gh-loader-sky" style={{ ['--p' as string]: pct / 100 }}>
        <span className="gh-loader-fill" />
        <span className="gh-loader-ring" />
      </div>
      <p className="gh-loader-pct">{pct}%</p>
    </div>
  )
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default function GlasshousePage() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(shouldShowLoader)

  useEffect(() => {
    setThemeColor(SKY)
    document.title = 'The Glass House'
    setReady(true)
  }, [])
  useEffect(() => setNoindex(true), [])

  useMotion(ready)

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="gh-root">
      <style>{CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      {loading && (
        <Preloader onDone={() => {
          setLoading(false)
          window.dispatchEvent(new Event('gh:revealed'))
        }} />
      )}

      <header className="gh-nav">
        <a className="gh-nav-mark" href="#top" onClick={anchor('top')}>GLASS&nbsp;HOUSE</a>
        <nav className="gh-nav-links" aria-label="Page">
          <a href="#husid" onClick={anchor('husid')}>The house</a>
          <a href="#glugginn" onClick={anchor('glugginn')}>The window</a>
          <a href="#gestir" onClick={anchor('gestir')}>Guests</a>
        </nav>
        <a className="gh-nav-cta" href="#boka" onClick={anchor('boka')}>Enquire about your stay</a>
      </header>

      {/* 01 · hero — the ceiling */}
      <section className="gh-hero" id="top">
        <div className="gh-hero-media">
          <div className="gh-frame-in" data-drift={12}
            style={{ '--dz': `${(12 * 1.35).toFixed(2)}%` } as React.CSSProperties}>
            <img src={PHOTO.skylight.src} srcSet={srcSet(PHOTO.skylight.src)} sizes="100vw"
              alt={PHOTO.skylight.alt} loading="eager" decoding="async" />
          </div>
        </div>
        <div className="gh-wm" aria-hidden="false">
          <h1 className="gh-wm-in" aria-label="The Glass House">
            <span aria-hidden="true">GLASS</span>{' '}
            <span aria-hidden="true" className="gh-wm-thin">HOUSE</span>
          </h1>
        </div>
        <div className="gh-hero-block">
          <p className="gh-hero-sub">
            A one-bedroom glass house on the heath at Mosfellsbær, about twenty
            minutes from Reykjavík. The skylight sits directly over the bed.
          </p>
          <a className="gh-hero-link" href="#boka" onClick={anchor('boka')}>Enquire about your stay</a>
        </div>
      </section>

      {/* 02 · manifesto */}
      <section className="gh-manifesto" id="husid">
        <div className="gh-manifesto-copy">
          <Headline text="Built for lying down and looking up." size={78} floor={36} measure={640} />
          <p className="gh-body gh-rv">
            Most houses put their best window on the horizon. This one puts it
            overhead. Glass walls hold the birch scrub, the floor is warm, and
            the roof opens straight onto the sky, so the last thing you see at
            night is whatever Iceland decides to do with it.
          </p>
        </div>
        <Frame photo={PHOTO.bedSkylight} drift={10} className="gh-manifesto-fig" priority />
      </section>

      {/* 03 · THE WINDOW — pinned sky device */}
      <section className="gh-window" id="glugginn" data-gh-dark="">
        <div className="gh-window-inner">
          {/* the aperture is still the point: you are looking THROUGH a frame,
             and it never expands to full bleed. What sits inside it is now one
             continuous film of their own view rather than four hinged stills. */}
          <div className="gh-aperture" aria-hidden="true">
            <canvas className="gh-sky" />
          </div>
          <div className="gh-pane-caps">
            <p className="gh-pane-cap">Day. The field runs flat to the horizon, and the sky takes most of it.</p>
            <p className="gh-pane-cap">Evening. The light drops and the first green shows low in the north.</p>
            <p className="gh-pane-cap">Night. The aurora crosses the whole sky, not a corner of it.</p>
            <p className="gh-pane-cap">Rendered, not photographed. Clear nights are never promised, but this is the sky they wait for.</p>
          </div>
          {/* static fallback for reduced motion and phones */}
          <figure className="gh-window-static">
            <img src={PHOTO.auroraHouse.src} srcSet={srcSet(PHOTO.auroraHouse.src)}
              sizes="100vw" alt={PHOTO.auroraHouse.alt} loading="lazy" decoding="async" />
            <figcaption className="gh-caption">
              The aurora over the house and sauna. Clear nights are never
              promised; this is what waits when they come.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 04 · warm water, cold air */}
      <section className="gh-water">
        <div className="gh-water-head gh-rv">
          <Headline text="The wake-up sauna, the goodnight bathe." size={54} floor={30} measure={620} />
          <p className="gh-body">
            Toby’s words, not ours. The barrel sauna stands in the birches and
            the wood-fired hot tub steams beside the deck, both yours alone,
            all year.
          </p>
        </div>
        <div className="gh-water-row">
          <Frame photo={PHOTO.saunaBarrel} drift={9} sizes="(max-width: 899px) 100vw, 33vw" />
          <Frame photo={PHOTO.hottubSnow} drift={11} sizes="(max-width: 899px) 100vw, 33vw" />
          <Frame photo={PHOTO.poolMoss} drift={8} sizes="(max-width: 899px) 100vw, 33vw" />
        </div>
      </section>

      {/* 05 · seasons — one clip sweep, summer gives way to winter */}
      <section className="gh-seasons">
        <div className="gh-seasons-stage">
          <figure className="gh-season gh-season-under">
            <img src={PHOTO.bedWinter.src} srcSet={srcSet(PHOTO.bedWinter.src)} sizes="100vw"
              alt={PHOTO.bedWinter.alt} loading="lazy" decoding="async" />
          </figure>
          <figure className="gh-season gh-season-top" aria-hidden="true">
            <img src={PHOTO.bedCurtains.src} srcSet={srcSet(PHOTO.bedCurtains.src)} sizes="100vw"
              alt="" loading="lazy" decoding="async" />
          </figure>
          <p className="gh-seasons-cap gh-rv">
            The same bed, the same glass. Only the season changes.
          </p>
        </div>
      </section>

      {/* 06 · guests */}
      <section className="gh-guests" id="gestir">
        <div className="gh-guests-head gh-rv">
          <Headline text="What guests keep saying." size={54} floor={30} measure={560} />
          <p className="gh-stat">
            Rated {HOST.rating} of 5 across {HOST.reviewCount} reviews · Superhost ·{' '}
            {HOST.yearsHosting} years hosting
          </p>
        </div>
        <ul className="gh-quotes">
          {REVIEW_QUOTES.map((q) => (
            <li key={q.author} className="gh-quote gh-rv">
              <p>{'“'}{q.quote}{'”'}</p>
              <cite>{q.author}, {q.when}</cite>
            </li>
          ))}
        </ul>
      </section>

      {/* 07 · booking */}
      <section className="gh-book" id="boka">
        <div className="gh-book-copy gh-rv">
          <Headline text="Ask for your night under the glass." size={62} floor={32} measure={600} />
          <p className="gh-body">
            Send your dates and the request goes straight to {HOST.names}, who
            host the house themselves.
          </p>
          <dl className="gh-facts">
            <div><dt>Guests</dt><dd>{FACTS.guests} · one bedroom</dd></div>
            <div><dt>Sauna</dt><dd>{FACTS.sauna}</dd></div>
            <div><dt>Hot tub</dt><dd>{FACTS.hotTub}</dd></div>
            <div><dt>From Reykjavík</dt><dd>{FACTS.distance}</dd></div>
          </dl>
          <div className="gh-owner-note gh-rv">
            <p className="gh-owner-note-label">The owner’s dashboard</p>
            <p className="gh-owner-note-body">
              Requests land in a private dashboard the hosts run.{' '}
              <Link className="gh-a" to="/preview/glasshouse/stjornbord">
                See how direct bookings would work
              </Link>
            </p>
          </div>
        </div>
        <BookingForm />
      </section>

      {/* page footer facts */}
      <footer className="gh-foot">
        <div className="gh-foot-grid">
          <div>
            <p className="gh-foot-mark">GLASS HOUSE</p>
            <p className="gh-foot-line">{FACTS.base}</p>
          </div>
          <div>
            <p className="gh-foot-line">Hosts: {HOST.names} · Superhost, {HOST.yearsHosting} years</p>
            <p className="gh-foot-line">Guests: {FACTS.guests} · 1 bedroom</p>
          </div>
          <div>
            <p className="gh-foot-line">
              Photography: the hosts’ own listing photos, retrieved August 2026.
            </p>
            <p className="gh-foot-line">
              Prototype by SNDR. Booking requests here are a demo and stay in this browser.
            </p>
          </div>
        </div>
      </footer>

      <PreviewFooter company={company} />
    </div>
  )
}

/* ── styles ─────────────────────────────────────────────────────────────── */

const CSS = `
@font-face { font-family: 'Alpino'; src: url('${BASE}glasshouse/fonts/Alpino-Light.woff2') format('woff2'); font-weight: 300; font-display: swap; }
@font-face { font-family: 'Alpino'; src: url('${BASE}glasshouse/fonts/Alpino-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Alpino'; src: url('${BASE}glasshouse/fonts/Alpino-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }

.gh-root {
  --u: clamp(0.58px, 0.0695vw, 1px);
  --gh-sky: ${SKY};
  --gh-ink: ${INK};
  --gh-mute: rgba(28,34,40,.68);
  --gh-hair: rgba(28,34,40,.16);
  background: var(--gh-sky); color: var(--gh-ink);
  font-family: ${SANS}; font-weight: 400;
  overflow-x: clip;
}
.gh-root section[id] { scroll-margin-top: clamp(88px, calc(var(--u) * 116), 136px); }
.gh-root ::selection { background: ${EMBER}; color: #fff; }
.gh-root :focus-visible { outline: 2px solid ${EMBER_TEXT}; outline-offset: 2px; }
.gh-root img { max-width: 100%; }

/* reveals arrive FROM ABOVE — the page's inverted gravity */
.gh-rv { opacity: 0; transform: translateY(-16px);
  transition: opacity .9s cubic-bezier(.23,1,.32,1), transform .9s cubic-bezier(.23,1,.32,1); }
.gh-rv.is-in { opacity: 1; transform: none; }

/* nav */
.gh-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 40;
  display: flex; align-items: center; gap: calc(var(--u) * 36);
  padding: calc(var(--u) * 18) calc(var(--u) * 40);
  color: var(--gh-ink);
  transition: color .45s ease;
}
.gh-nav.is-dark { color: ${NIGHT_INK}; }
.gh-nav a { color: inherit; text-decoration: none; }
.gh-nav-mark { font-weight: 500; letter-spacing: .18em; font-size: ${fluid(14, 13)}; }
.gh-nav-links { display: flex; gap: calc(var(--u) * 26); margin-left: auto; }
.gh-nav-links a { font-size: ${fluid(14, 13)}; opacity: .82; }
.gh-nav-links a:hover { opacity: 1; }
/* the enquire CTA: an animated gradient that travels on hover, with a glow
   under it. Mechanism adapted from a 21st.dev gradient button; the palette,
   geometry and the ink-on-ember contrast are this build's own. Ink text is
   deliberate — white would fall under AA at the light end of the ramp. */
.gh-nav-cta {
  position: relative; isolation: isolate;
  font-size: ${fluid(14, 13)}; font-weight: 500;
  padding: calc(var(--u) * 10) calc(var(--u) * 20);
  border: 0; border-radius: 12px;
  color: ${INK} !important;
  background-image: linear-gradient(100deg, ${EMBER} 0%, #E8A878 26%, ${EMBER} 50%, #A85F30 76%, ${EMBER} 100%);
  background-size: 300% 100%; background-position: 0% 50%;
  box-shadow: 0 6px 24px -10px rgba(201,123,74,.8);
  transition: background-position 1s cubic-bezier(.23,1,.32,1),
              box-shadow .45s ease, transform .15s ease;
}
.gh-nav-cta::before {
  content: ''; position: absolute; inset: -1px; z-index: -1; opacity: 0;
  border-radius: inherit; background: inherit; filter: blur(11px);
  transition: opacity .45s ease;
}
.gh-nav-cta:hover {
  background-position: 100% 50%;
  box-shadow: 0 10px 32px -10px rgba(201,123,74,.95);
}
.gh-nav-cta:hover::before { opacity: .8; }
.gh-nav-cta:active { transform: scale(.98); }

/* hero */
.gh-hero { position: relative; min-height: 100svh; display: grid; overflow: hidden; }
.gh-hero-media { position: absolute; inset: 0; overflow: hidden; background: var(--gh-ink); }
.gh-hero-media::after {
  content: ''; position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(196deg, rgba(28,34,40,.08) 40%, rgba(28,34,40,.56) 100%);
}
.gh-wm {
  position: absolute; inset: 0; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  margin: 0; pointer-events: none; color: #F4F7FA;
}
.gh-wm-in {
  margin: 0; font-weight: 500; letter-spacing: -.03em;
  font-size: clamp(40px, 9.4vw, 148px); line-height: 1;
  text-align: center; will-change: transform, filter, opacity;
  text-shadow: 0 2px 40px rgba(11,16,22,.35);
}
.gh-wm-thin { font-weight: 400; }
.gh-hero-block {
  position: relative; align-self: end; z-index: 1;
  padding: 0 calc(var(--u) * 44) calc(calc(var(--u) * 60) + env(safe-area-inset-bottom, 0px));
  color: #F4F7FA; max-width: calc(var(--u) * 860);
}
.gh-hero-sub { margin: 0; font-size: ${fluid(18, 15)}; line-height: 1.55; max-width: 46ch; }
.gh-hero-link {
  display: inline-flex; align-items: center; min-height: 44px;
  margin-top: calc(var(--u) * 18); color: inherit; font-weight: 500;
  font-size: ${fluid(15, 14)}; text-decoration: none; position: relative;
  padding-bottom: 4px;
}
.gh-hero-link::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background: currentColor; transform-origin: 0 50%; transform: scaleX(.35);
  transition: transform .5s cubic-bezier(.23,1,.32,1);
}
@media (hover: hover) and (pointer: fine) {
  .gh-hero-link:hover::after { transform: scaleX(1); }
}
.gh-hero-link:focus-visible::after { transform: scaleX(1); }

/* headline word masks */
.gh-headline { margin: 0; font-weight: 500; letter-spacing: -.015em; line-height: 1.08; text-wrap: balance; }
.gh-line { display: inline-block; overflow: hidden; vertical-align: bottom;
  padding: .2em .04em .1em; margin: -.2em -.04em -.1em; }
.gh-word { display: inline-block; }
.gh-body { font-size: ${fluid(17, 15)}; line-height: 1.62; color: var(--gh-mute);
  max-width: 58ch; margin: calc(var(--u) * 22) 0 0; }
.gh-a { color: ${EMBER_TEXT}; }
.gh-a:hover { color: var(--gh-ink); }

/* manifesto */
.gh-manifesto {
  display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 72);
  align-items: center; max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 150) calc(var(--u) * 44) calc(var(--u) * 120);
}
/* width:100% is load-bearing: every child of the frame is absolute, so
   justify-self:end shrinks the figure's fit-content width to 0 and
   aspect-ratio takes the height with it ([[frame-zero-width-flex-collapse]]). */
.gh-manifesto-fig { width: 100%; max-width: calc(var(--u) * 560); justify-self: end; }

/* frames + drift */
.gh-frame { position: relative; overflow: hidden; margin: 0;
  background: color-mix(in srgb, var(--gh-ink) 8%, transparent); }
.gh-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; }
@media (min-width: 992px) { .gh-frame-in { will-change: transform; } }
.gh-frame-in img { width: 100%; height: 100%; max-width: none; object-fit: cover; display: block; }

/* THE WINDOW */
.gh-window { position: relative; min-height: 100svh; background: ${NIGHT}; color: ${NIGHT_INK}; }
.gh-window-inner { position: relative; height: 100svh; overflow: hidden; }
.gh-aperture {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: min(68vw, calc(var(--u) * 900)); height: min(52svh, calc(var(--u) * 560));
  border-radius: 2px; overflow: hidden;
  /* the frame is the point: a hairline plus a vignette that isolates it */
  box-shadow: 0 0 0 1px rgba(230,236,242,.32), 0 0 0 200vmax ${NIGHT};
}
.gh-sky {
  position: absolute; inset: 0; width: 100%; height: 100%; display: block;
  background: ${NIGHT};
}
.gh-pane-caps { position: absolute; left: 0; right: 0; bottom: calc(var(--u) * 64);
  display: grid; place-items: center; z-index: 20; pointer-events: none; }
.gh-pane-cap {
  grid-area: 1 / 1; margin: 0; font-size: ${fluid(18, 15)}; font-weight: 400;
  letter-spacing: .01em; color: ${NIGHT_INK}; text-align: center; max-width: 46ch;
  padding: 0 20px; text-shadow: 0 1px 20px rgba(11,16,22,.75);
}
.gh-window-static { display: none; margin: 0; }
.gh-caption { font-size: ${fluid(14, 13)}; color: ${NIGHT_INK}; opacity: .82;
  padding: calc(var(--u) * 18) calc(var(--u) * 44); line-height: 1.6; }

/* water */
.gh-water { max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 150) calc(var(--u) * 44) calc(var(--u) * 60); }
.gh-water-row { display: grid; grid-template-columns: repeat(3, 1fr);
  gap: calc(var(--u) * 24); margin-top: calc(var(--u) * 48); align-items: start; }
.gh-water-row .gh-frame { aspect-ratio: 3 / 4 !important; }

/* seasons */
.gh-seasons { padding: calc(var(--u) * 120) 0; }
.gh-seasons-stage { position: relative; height: min(88svh, calc(var(--u) * 760)); overflow: hidden; }
.gh-season { position: absolute; inset: 0; margin: 0; }
.gh-season img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gh-season-top { will-change: clip-path; }
.gh-seasons-cap {
  position: absolute; left: calc(var(--u) * 44); bottom: calc(var(--u) * 36);
  margin: 0; z-index: 2; color: #F4F7FA; font-size: ${fluid(16, 14)};
  text-shadow: 0 1px 18px rgba(11,16,22,.5); max-width: 40ch;
}

/* guests */
.gh-guests { max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 130) calc(var(--u) * 44) calc(var(--u) * 60); }
.gh-stat { margin: calc(var(--u) * 16) 0 0; font-size: ${fluid(14, 13)};
  letter-spacing: .04em; color: var(--gh-mute); }
.gh-quotes { list-style: none; display: grid; grid-template-columns: repeat(3, 1fr);
  gap: calc(var(--u) * 40); margin: calc(var(--u) * 52) 0 0; padding: 0; }
.gh-quote { border-top: 1px solid var(--gh-hair); padding-top: calc(var(--u) * 22); }
.gh-quote p { margin: 0; font-size: ${fluid(17, 15)}; line-height: 1.58; }
.gh-quote cite { display: block; margin-top: calc(var(--u) * 14); font-style: normal;
  font-size: ${fluid(13, 12)}; color: var(--gh-mute); }

/* booking */
.gh-book {
  display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 80);
  max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 130) calc(var(--u) * 44) calc(var(--u) * 150);
}
.gh-facts { margin: calc(var(--u) * 36) 0 0; display: grid; gap: calc(var(--u) * 14); padding: 0; }
.gh-facts div { display: flex; gap: 16px; border-top: 1px solid var(--gh-hair);
  padding-top: calc(var(--u) * 12); }
.gh-facts dt { min-width: 12ch; font-size: ${fluid(13, 12)}; letter-spacing: .06em;
  text-transform: uppercase; color: var(--gh-mute); padding-top: 2px; }
.gh-facts dd { margin: 0; font-size: ${fluid(15, 14)}; }
.gh-owner-note { margin-top: calc(var(--u) * 40); }
.gh-owner-note-label { margin: 0; font-size: ${fluid(12, 12)}; font-weight: 500;
  letter-spacing: .14em; text-transform: uppercase; color: var(--gh-mute); }
.gh-owner-note-body { margin: calc(var(--u) * 10) 0 0; font-size: ${fluid(15, 14)};
  line-height: 1.6; color: var(--gh-mute); }

.gh-book-form { align-self: start; }
.gh-fields { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 16); }
.gh-field { display: grid; gap: 8px; }
.gh-field-wide { grid-column: 1 / -1; }
.gh-field-label { font-size: 12.5px; font-weight: 500; letter-spacing: .05em; }
.gh-optional { font-weight: 400; color: var(--gh-mute); }
.gh-field input, .gh-field select, .gh-field textarea {
  font: inherit; font-size: 15px; color: var(--gh-ink);
  background: #fff; border: 1px solid var(--gh-hair); border-radius: 2px;
  padding: 12px 12px; min-height: 44px; width: 100%;
}
.gh-field textarea { resize: vertical; }
.gh-field input:focus, .gh-field select:focus, .gh-field textarea:focus {
  outline: 2px solid ${EMBER_TEXT}; outline-offset: 1px;
}
.gh-field-error { color: #9E3A20; font-size: 14px; margin: 14px 0 0; }
.gh-cta {
  font: inherit; font-weight: 500; font-size: ${fluid(15, 14)}; cursor: pointer;
  margin-top: calc(var(--u) * 24); width: 100%; min-height: 48px;
  background: ${EMBER}; color: ${INK}; border: 0; border-radius: 2px;
  padding: 13px 22px; transition: filter .25s ease, transform .15s ease;
}
.gh-cta:hover { filter: brightness(1.06); }
.gh-cta:active { transform: scale(.98); }
.gh-ghost {
  font: inherit; font-size: inherit; cursor: pointer; background: none;
  border: 0; padding: 0; color: ${EMBER_TEXT}; text-decoration: underline;
  text-underline-offset: 2px; min-height: 44px;
}
.gh-ghost:hover { color: var(--gh-ink); }
.gh-book-note { margin: calc(var(--u) * 16) 0 0; font-size: ${fluid(13, 12.5)};
  color: var(--gh-mute); line-height: 1.6; }
.gh-book-done { border: 1px solid var(--gh-hair); background: #fff;
  padding: calc(var(--u) * 36); align-self: start; }
.gh-book-done-title { margin: 0; font-weight: 500; font-size: ${fluid(24, 19)}; }

/* footer */
.gh-foot { border-top: 1px solid var(--gh-hair); }
.gh-foot-grid { display: grid; grid-template-columns: repeat(3, 1fr);
  gap: calc(var(--u) * 44); max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 52) calc(var(--u) * 44) calc(var(--u) * 68); }
.gh-foot-mark { font-weight: 500; letter-spacing: .2em; font-size: ${fluid(13, 13)};
  margin: 0 0 calc(var(--u) * 12); }
.gh-foot-line { font-size: ${fluid(13, 13)}; line-height: 1.6; color: var(--gh-mute);
  margin: 0 0 calc(var(--u) * 8); }

/* loader — the skylight */
.gh-loader { position: fixed; inset: 0; z-index: 60; background: ${INK};
  display: grid; place-content: center;
  transition: opacity .55s ease .35s; }
.gh-loader-sky { position: relative; width: min(46vw, 340px); aspect-ratio: 4 / 3;
  transition: transform .9s cubic-bezier(.76, 0, .24, 1); }
.gh-loader-fill { position: absolute; inset: 0; background:
  linear-gradient(to top, #B9CCDC, ${SKY});
  transform-origin: 50% 100%; transform: scaleY(var(--p, 0));
  transition: transform .2s linear; }
.gh-loader-ring { position: absolute; inset: -14px; border-radius: 2px;
  background: conic-gradient(rgba(244,247,250,.9) calc(var(--p, 0) * 360deg), rgba(244,247,250,.14) 0);
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude; padding: 2px; }
.gh-loader.is-leaving { opacity: 0; pointer-events: none; }
.gh-loader.is-leaving .gh-loader-sky { transform: scale(9); }
.gh-loader-pct { position: fixed; left: calc(var(--u) * 44); bottom: calc(var(--u) * 38);
  margin: 0; font-size: 12px; letter-spacing: .16em; color: rgba(244,247,250,.72); }

/* responsive */
@media (max-width: 991px) {
  .gh-nav { padding: 10px 20px; gap: 16px; }
  .gh-nav-links { display: none; }
  .gh-nav-cta { margin-left: auto; min-height: 44px; display: inline-flex; align-items: center; }
  .gh-manifesto, .gh-book { grid-template-columns: 1fr; gap: 48px;
    padding-left: 20px; padding-right: 20px; }
  .gh-manifesto-fig { justify-self: stretch; max-width: none; }
  .gh-water, .gh-guests { padding-left: 20px; padding-right: 20px; }
  .gh-water-row, .gh-quotes { grid-template-columns: 1fr; }
  .gh-foot-grid { grid-template-columns: 1fr; padding-left: 20px; padding-right: 20px; }
  .gh-fields { grid-template-columns: 1fr 1fr; }
  .gh-seasons-cap { left: 20px; right: 20px; }
}
@media (max-width: 767px) {
  /* no pin under 768: the window becomes its static aurora figure */
  .gh-window { min-height: 0; }
  .gh-window-inner { height: auto; overflow: visible; }
  .gh-aperture, .gh-pane-caps { display: none; }
  .gh-window-static { display: block; }
  .gh-window-static img { width: 100%; height: auto; display: block; }
  .gh-fields { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .gh-root * { transition: none !important; animation: none !important; }
  .gh-rv { opacity: 1 !important; transform: none !important; }
  .gh-word { transform: none !important; opacity: 1 !important; }
  .gh-wm-in { opacity: 1 !important; transform: none !important; filter: none !important; visibility: visible !important; }
  .gh-frame-in { inset: 0; transform: none !important; }
  .gh-aperture, .gh-pane-caps { display: none; }
  .gh-window-static { display: block; }
  .gh-season-top { clip-path: inset(0 0 100% 0) !important; }
}
`
