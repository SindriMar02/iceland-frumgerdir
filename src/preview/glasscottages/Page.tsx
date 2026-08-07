import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setNoindex, setThemeColor } from '../../lib/preview'
import { demo, type DemoBooking } from './demoStore'
import {
  COTTAGES, CRAFT, FACTS, HOST, JSON_LD, PHOTO, REVIEW_QUOTES, STAY,
  srcSet, type Photo,
} from './content'

gsap.registerPlugin(ScrollTrigger, Flip)

const company = getPreviewCompany('glasscottages')

/* ── GLASS COTTAGES · "BLÁR OG GRÆNN" (one lava field, two skies) ───────────
   Two identical glass cottages 200 metres apart: Blár follows the lagoons and
   the ice, Grænn follows the moss and the aurora. The page is built on that
   duality with the MERSI device measured from their own write-up: opposing
   `clip-path: inset()` reveals and nothing else — no opacity toggles. Full
   spec: ./DESIGN.md.

   The devices:
    1. The loader SPLITS — the sheet parts into a top and bottom half, the
       page opening the way the pair of cottages splits the field.
    2. The wordmark REFRACTS — two tinted ghost copies (one Blár, one Grænn)
       converge into the solid mark, like a double image resolving through
       glass. Scroll re-splits them. Entrance moves the ghosts, the scrub
       moves the parent — never the same element.
    3. THE CHOOSER — a pinned split where Blár's column clips open from the
       top and Grænn's from the bottom, the centre label clipping in sync
       (the exact MERSI mechanism). Choosing a cottage FLIP-morphs its
       photograph into the detail hero (the one Flip on the page).
    4. The clip system is PAGE-WIDE: every Blár-side frame reveals from the
       top, every Grænn-side frame from the bottom, so the duality is a
       system, not a section.
    5. Drift (Heklusýn spec) on every frame, gated while the chooser pin is
       active, off under reduced motion.

   ONE typeface (Satoshi), 400 body / 500 display. DARK page throughout —
   the cottages glow out of a dark field in every hero-grade photograph.
   The two accents are POSITIONAL: Blár's blue only in Blár contexts,
   Grænn's green only in Grænn contexts. ─────────────────────────────────── */

const NIGHT = '#101418'
const BONE = '#E8ECEA'
const MUTE = 'rgba(232, 236, 234, .68)'
const BLAR = '#7FA8C9'
const GRAENN = '#7FA889'

const SANS = "'Satoshi', system-ui, sans-serif"
const BASE = import.meta.env.BASE_URL

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

type CottageId = 'blar' | 'graenn'

/** The night deepens as you scroll: four of their own aurora frames. */
const NIGHT_SEQ = [PHOTO.auroraWide, PHOTO.auroraCottage, PHOTO.auroraGable, PHOTO.auroraRoof]

/* ── motion engine ───────────────────────────────────────────────────────── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready || reduced()) return
    const root = document.querySelector<HTMLElement>('.gc-root')
    if (!root) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    const cleanups: Array<() => void> = []
    let chooserST: ScrollTrigger | null = null

    /* reveals: IO arms '.gc-rv'; CSS owns the transitions.
       .gc-clip is NOT observed: Chromium clips the intersection rect by the
       element's OWN clip-path, so a fully-clipped frame reports ratio 0
       forever and the reveal deadlocks (measured with a fresh observer on a
       694px-visible frame). Clips are armed from the drift ticker's rect
       reads below instead. */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.18 },
    )
    root.querySelectorAll('.gc-rv').forEach((el) => io.observe(el))

    const ctx = gsap.context(() => {
      /* word-mask headline rises */
      root.querySelectorAll<HTMLElement>('[data-gc-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.gc-word')
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

      /* THE WORDMARK — refraction. Two tinted ghosts converge to the solid. */
      const ghostB = root.querySelector<HTMLElement>('.gc-wm-ghost-b')
      const ghostG = root.querySelector<HTMLElement>('.gc-wm-ghost-g')
      const solid = root.querySelector<HTMLElement>('.gc-wm-solid')
      const wmEl = root.querySelector<HTMLElement>('.gc-wm')
      const heroEl = root.querySelector<HTMLElement>('.gc-hero')

      if (ghostB && ghostG && solid) {
        gsap.set(ghostB, { xPercent: -8, yPercent: -14, autoAlpha: 0 })
        gsap.set(ghostG, { xPercent: 8, yPercent: 14, autoAlpha: 0 })
        gsap.set(solid, { autoAlpha: 0, scale: 1.02 })
        let opened = false
        const openWordmark = () => {
          if (opened) return
          opened = true
          gsap.timeline()
            .to([ghostB, ghostG], { autoAlpha: 0.5, duration: 0.5, ease: 'power2.out' })
            .to(ghostB, { xPercent: -1.6, yPercent: -3, duration: 1.25, ease: 'expo.out' }, 0.15)
            .to(ghostG, { xPercent: 1.6, yPercent: 3, duration: 1.25, ease: 'expo.out' }, 0.15)
            .to(solid, { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'expo.out' }, 0.45)
        }
        if (root.querySelector('.gc-loader')) {
          window.addEventListener('gc:revealed', openWordmark, { once: true })
        } else {
          gsap.delayedCall(0.15, openWordmark)
        }
        window.setTimeout(openWordmark, 3600) // rAF-suspension backstop
      }

      if (heroEl && wmEl && ghostB && ghostG) {
        const away = { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 0.6 }
        gsap.to(ghostB, { x: -70, y: -46, ease: 'none', scrollTrigger: away })
        gsap.to(ghostG, { x: 70, y: 46, ease: 'none', scrollTrigger: away })
        gsap.to(wmEl, { opacity: 0.06, ease: 'none', scrollTrigger: away })
      }

      /* the hero settles out of the opening. Its own transform, never shared
         with a scroll-away — the wordmark handles the scroll. */
      const heroImg = root.querySelector<HTMLElement>('.gc-hero-media img')
      if (heroImg) {
        gsap.set(heroImg, { scale: 1.14, transformOrigin: '50% 55%' })
        const settle = () =>
          gsap.to(heroImg, { scale: 1, duration: 2.1, ease: 'expo.out', overwrite: 'auto' })
        if (root.querySelector('.gc-loader')) {
          window.addEventListener('gc:revealed', settle, { once: true })
          window.setTimeout(settle, 3600) // rAF-suspension backstop
        } else {
          gsap.delayedCall(0.1, settle)
        }
      }

      /* THE NIGHT — pinned. The aurora deepens through four of their own
         frames as you scroll, each dissolving into the next under a slow
         push-in. The guest quotes keep their own cadence underneath. */
      const nightEl = root.querySelector<HTMLElement>('.gc-night')
      const layers = gsap.utils.toArray<HTMLElement>('.gc-night-layer', root)
      if (nightEl && layers.length > 1 && window.innerWidth >= 768) {
        gsap.set(layers, { autoAlpha: 0 })
        gsap.set(layers[0], { autoAlpha: 1 })
        /* NO pin. The page already pins the chooser, and a second pin here
           fought it: the section sat unpinned mid-range with a dead band above
           the photograph. Driving the crossfade off the section's own passage
           through the viewport gives the same deepening with nothing to break. */
        const nt = gsap.timeline({
          scrollTrigger: {
            trigger: nightEl, start: 'top bottom', end: 'bottom top',
            scrub: 0.8, invalidateOnRefresh: true,
          },
        })
        const step = 1 / (layers.length - 1)
        for (let i = 1; i < layers.length; i++) {
          const at = step * (i - 1) + step * 0.12
          const dur = step * 0.76
          nt.to(layers[i - 1], { autoAlpha: 0, ease: 'none', duration: dur }, at)
          nt.to(layers[i], { autoAlpha: 1, ease: 'none', duration: dur }, at)
        }
        nt.fromTo(layers, { scale: 1.07 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      }

      /* the header carries no surface until the hero is behind you */
      const navEl = root.querySelector<HTMLElement>('.gc-nav')
      if (navEl) {
        ScrollTrigger.create({
          start: 'top -70', end: 99999,
          onToggle: (self) => navEl.classList.toggle('is-solid', self.isActive),
        })
      }

      /* THE CHOOSER — opposing clip reveals under a pin, centre label in sync.
         Blár opens from the top, Grænn from the bottom. Desktop only; under
         1024px the columns stack and reveal via the page-wide clip system. */
      const chooser = root.querySelector<HTMLElement>('.gc-chooser')
      const colB = root.querySelector<HTMLElement>('.gc-choose-blar .gc-choose-media')
      const colG = root.querySelector<HTMLElement>('.gc-choose-graenn .gc-choose-media')
      const midT = root.querySelector<HTMLElement>('.gc-choose-mid-top')
      const midB = root.querySelector<HTMLElement>('.gc-choose-mid-bot')
      if (chooser && colB && colG && midT && midB && window.innerWidth >= 1024) {
        gsap.set(colB, { clipPath: 'inset(0% 0% 100% 0%)' })
        gsap.set(colG, { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(midT, { clipPath: 'inset(0% 0% 100% 0%)' })
        gsap.set(midB, { clipPath: 'inset(100% 0% 0% 0%)' })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chooser, start: 'top top', end: '+=160%',
            pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
            /* this pin inserts a spacer ~2650px tall. Anything below it must
               re-measure AFTER the spacer exists, so the pin refreshes first. */
            refreshPriority: 1,
          },
        })
        chooserST = tl.scrollTrigger ?? null
        tl.to([colB, midT], { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 }, 0)
          .to([colG, midB], { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 }, 0)
      }

      /* focusin failsafe */
      const onFocusIn = (e: FocusEvent) => {
        const rv = (e.target as HTMLElement).closest?.('.gc-rv, .gc-clip')
        rv?.classList.add('is-in')
      }
      root.addEventListener('focusin', onFocusIn)
      cleanups.push(() => root.removeEventListener('focusin', onFocusIn))
    }, root)

    /* drift: Heklusýn spec, gated during the chooser pin. The same rect pass
       arms .gc-clip reveals (see the IO note above). Both element lists
       refresh when the DOM changes, because the chosen-cottage detail mounts
       its frames AFTER this hook has run. */
    let driftEls = Array.from(root.querySelectorAll<HTMLElement>('.gc-frame-in'))
      .filter((el) => !el.closest('[data-nodrift]'))
    let clipEls = Array.from(root.querySelectorAll<HTMLElement>('.gc-clip'))
    const mo = new MutationObserver(() => {
      driftEls = Array.from(root.querySelectorAll<HTMLElement>('.gc-frame-in'))
        .filter((el) => !el.closest('[data-nodrift]'))
      clipEls = Array.from(root.querySelectorAll<HTMLElement>('.gc-clip'))
      root.querySelectorAll('.gc-rv').forEach((el) => io.observe(el))
    })
    mo.observe(root, { childList: true, subtree: true })
    const drift = () => {
      const vh = window.innerHeight
      // arm clip reveals from geometry (reads only)
      const armed: HTMLElement[] = []
      for (const el of clipEls) {
        if (el.classList.contains('is-in')) continue
        const r = el.getBoundingClientRect()
        if (r.height > 0 && r.top < vh * 0.84 && r.bottom > 0) armed.push(el)
      }
      if (chooserST?.isActive) {
        for (const el of armed) el.classList.add('is-in')
        return
      }
      const writes: Array<[HTMLElement, number]> = []
      for (const el of driftEls) {
        const frame = el.parentElement
        if (!frame) continue
        const r = frame.getBoundingClientRect()
        if (r.bottom < -40 || r.top > vh + 40) continue
        /* clamp: a frame taller than ~vh can push p past ±1 near its exit,
           which overruns the --dz overhang and bleeds the image edge into
           the frame (measured 45px on an 843px frame). Bound it. */
        const p = Math.max(-1, Math.min(1, 1 - (r.top + r.height / 2) / (vh / 2) / 2))
        const d = Number(el.dataset.drift || 9)
        writes.push([el, -p * d])
      }
      for (const el of armed) el.classList.add('is-in')
      for (const [el, y] of writes) el.style.transform = `translate3d(0, ${y}%, 0)`
    }

    lenis.on('scroll', ScrollTrigger.update)

    /* The document keeps growing after the triggers are built: lazy
       photographs decode, late fonts reflow, the stay table lays out. Every
       trigger otherwise keeps the positions it measured on the shorter page —
       measured symptom was the night scrub sitting ~85% through its timeline
       at the moment its own section entered the viewport. */
    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)
    const rt = window.setTimeout(refresh, 1400)
    cleanups.push(() => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(rt)
    })

    const tick = (t: number) => { drift(); lenis.raf(t * 1000) }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    drift()

    return () => {
      gsap.ticker.remove(tick)
      io.disconnect()
      mo.disconnect()
      ctx.revert()
      lenis.destroy()
      cleanups.forEach((fn) => fn())
    }
  }, [ready])
}

/* ── primitives ─────────────────────────────────────────────────────────── */

function Headline({ text, size, floor, as: Tag = 'h2', className = '', measure }: {
  text: string; size: number; floor: number
  as?: 'h1' | 'h2' | 'h3'; className?: string; measure?: number
}) {
  const words = useMemo(() => text.split(' '), [text])
  return (
    <Tag
      className={`gc-headline ${className}`}
      data-gc-headline=""
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
          <span className="gc-line"><span className="gc-word">{w}</span></span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** Drifting photo frame with a directional clip arrival.
    side 'top' = Blár direction, 'bottom' = Grænn direction. */
function Frame({ photo, className = '', priority = false, drift = 9, sizes, side, flipId, noDrift }: {
  photo: Photo; className?: string; priority?: boolean; drift?: number
  sizes?: string; side?: 'top' | 'bottom'; flipId?: string; noDrift?: boolean
}) {
  const clip = side ? `gc-clip from-${side}` : 'gc-rv'
  return (
    <figure
      className={`gc-frame ${clip} ${className}`}
      style={{ aspectRatio: photo.ratio }}
      {...(noDrift ? { 'data-nodrift': '' } : {})}
      {...(flipId ? { 'data-flip-id': flipId } : {})}
    >
      <div
        className="gc-frame-in"
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

function NightQuotes() {
  const [on, setOn] = useState(0)
  useEffect(() => {
    if (reduced()) return
    const iv = window.setInterval(() => setOn((v) => (v + 1) % REVIEW_QUOTES.length), 6200)
    return () => window.clearInterval(iv)
  }, [])
  return (
    <div className="gc-nightquotes" aria-live="off">
      {REVIEW_QUOTES.map((q, i) => (
        <blockquote key={q.author} className={`gc-nq ${i === on ? 'is-on' : ''}`}>
          <p>{'“'}{q.quote}{'”'}</p>
          <cite>{q.author}, {q.when}</cite>
        </blockquote>
      ))}
      <div className="gc-nq-dots" role="tablist" aria-label="Guest quotes">
        {REVIEW_QUOTES.map((q, i) => (
          <button
            key={q.author} type="button" role="tab"
            aria-selected={i === on} aria-label={`Quote by ${q.author}`}
            className={`gc-nq-dot ${i === on ? 'is-on' : ''}`}
            onClick={() => setOn(i)}
          />
        ))}
      </div>
    </div>
  )
}

/* ── the chosen-cottage detail (Flip target) ────────────────────────────── */

const DETAIL: Record<CottageId, { photo: Photo; second: Photo; accent: string; body: string }> = {
  blar: {
    photo: PHOTO.bedView,
    second: PHOTO.sunsetMirror,
    accent: BLAR,
    body: 'Blár faces its own stretch of the field. From the queen bed the glass roof frames the sky, and the hot tub waits a few steps from the door.',
  },
  graenn: {
    photo: PHOTO.auroraGable,
    second: PHOTO.hottubDeck,
    accent: GRAENN,
    body: 'Grænn keeps the moss side of the field. The same glass, the same bed under the sky, and on clear winter nights the aurora overhead.',
  },
}

/* ── booking form ───────────────────────────────────────────────────────── */

const plusDays = (d: string, n: number) => {
  const t = new Date(`${d}T12:00:00`)
  t.setDate(t.getDate() + n)
  return t.toISOString().slice(0, 10)
}

function BookingForm({ cottage, onCottage }: {
  cottage: CottageId; onCottage: (c: CottageId) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [nights, setNights] = useState(2)
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
      id: `gc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: cottage,
      date,
      endDate: plusDays(date, nights),
      people: 2,
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
      <div className="gc-book-done" role="status">
        <p className="gc-book-done-title">Your request is on its way.</p>
        <p className="gc-body">
          In the finished site this lands with the hosts directly, marked{' '}
          {done.resourceId === 'graenn' ? 'Grænn' : 'Blár'}, and they answer with
          availability and the nightly price for your dates.
        </p>
        <p className="gc-body">
          <Link className="gc-a" to="/preview/glasscottages/stjornbord">View the owner’s dashboard</Link>{' '}
          to see where the request arrives, or{' '}
          <button type="button" className="gc-ghost" onClick={() => setDone(null)}>
            make another request
          </button>
        </p>
      </div>
    )
  }

  return (
    <form className="gc-book-form" onSubmit={submit} noValidate>
      <fieldset className="gc-cot-pick">
        <legend className="gc-field-label">Cottage</legend>
        <div className="gc-cot-pills">
          {(['blar', 'graenn'] as const).map((c) => (
            <label key={c} className={`gc-cot-pill is-${c} ${cottage === c ? 'is-on' : ''}`}>
              <input
                type="radio" name="cottage" value={c} checked={cottage === c}
                onChange={() => onCottage(c)}
              />
              {COTTAGES[c].name}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="gc-fields">
        <label className="gc-field">
          <span className="gc-field-label">Arrival</span>
          <input type="date" name="date" min={minDate} value={date} required
            onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="gc-field">
          <span className="gc-field-label">Nights</span>
          <select name="nights" value={nights} onChange={(e) => setNights(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="gc-field">
          <span className="gc-field-label">Guests</span>
          <input type="text" inputMode="none" value="2 (the cottage sleeps two)" readOnly aria-readonly="true" />
        </label>
        <label className="gc-field gc-field-wide">
          <span className="gc-field-label">Name</span>
          <input type="text" name="name" autoComplete="name" value={name} required
            onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="gc-field gc-field-wide">
          <span className="gc-field-label">Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" value={email} required
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="gc-field gc-field-wide">
          <span className="gc-field-label">Phone <span className="gc-optional">(optional)</span></span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="gc-field gc-field-wide">
          <span className="gc-field-label">Anything the hosts should know <span className="gc-optional">(optional)</span></span>
          <textarea rows={3} name="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      {error && <p className="gc-field-error" role="alert">{error}</p>}
      <button type="submit" className="gc-cta">Enquire about your stay</button>
      <p className="gc-book-note">
        No card, no charge. The request goes to the hosts, and the nightly price
        for your dates comes with the reply.
      </p>
    </form>
  )
}

/* ── preloader — the sheet splits like the pair of cottages ─────────────── */

const shouldShowLoader = () => {
  if (typeof window === 'undefined' || reduced()) return false
  if (new URLSearchParams(window.location.search).has('loader')) return true
  try { return !sessionStorage.getItem('gc_seen') } catch { return true }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('gc_seen', '1') } catch { /* private mode */ }
    const t0 = performance.now()
    let raf = 0
    let shown = 0
    let heroDone = false
    const hero = new Image()
    hero.decoding = 'async'
    const mark = () => { heroDone = true }
    hero.addEventListener('load', mark, { once: true })
    hero.addEventListener('error', mark, { once: true })
    hero.src = PHOTO.sunsetCottage.src
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
        window.setTimeout(onDone, 1000)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div className={`gc-loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      {/* the sheet is cut along the gable: the roof drops, the sky lifts */}
      <div className="gc-loader-half gc-loader-sky" />
      <div className="gc-loader-half gc-loader-roof" />
      <div className="gc-loader-seam" />
      <div className="gc-loader-center">
        <div className="gc-loader-ring" style={{ '--p': pct } as React.CSSProperties} />
        <p className="gc-loader-mark" style={{ backgroundPositionX: `${100 - pct}%` }}>
          GLASS COTTAGES
        </p>
      </div>
      <p className="gc-loader-pct">{pct}%</p>
    </div>
  )
}

/* ── the page ───────────────────────────────────────────────────────────── */

export default function GlassCottagesPage() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(shouldShowLoader)
  const [cottage, setCottage] = useState<CottageId>('blar')
  const [chosen, setChosen] = useState(false)
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThemeColor(NIGHT)
    document.title = 'Glass Cottages Iceland'
    setReady(true)
  }, [])
  useEffect(() => setNoindex(true), [])

  useMotion(ready)

  /* choose a cottage: capture Flip state from the chooser card, morph into
     the detail hero. The one Flip on the page. */
  const choose = (c: CottageId) => {
    if (!reduced() && window.innerWidth >= 768) {
      flipState.current = Flip.getState(`[data-flip-id="cot-${c}"]`)
    }
    setCottage(c)
    setChosen(true)
  }
  useLayoutEffect(() => {
    if (!chosen || !flipState.current) return
    const state = flipState.current
    flipState.current = null
    requestAnimationFrame(() => {
      Flip.from(state, {
        targets: `[data-flip-id="cot-${cottage}"]`,
        duration: 1.15, ease: 'expo.inOut', absolute: true, scale: true,
      })
    })
  }, [chosen, cottage])
  useEffect(() => {
    if (!chosen) return
    const el = document.getElementById('valid')
    if (el) window.setTimeout(() => el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }), 120)
  }, [chosen, cottage])

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  const det = DETAIL[cottage]

  return (
    <div ref={rootRef} className="gc-root">
      <style>{CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      {loading && (
        <Preloader onDone={() => {
          setLoading(false)
          window.dispatchEvent(new Event('gc:revealed'))
        }} />
      )}

      {/* capsule nav */}
      <header className="gc-nav">
        <a className="gc-nav-mark" href="#top" onClick={anchor('top')}>
          GLASS <span>COTTAGES</span>
        </a>
        <a className="gc-nav-cta" href="#boka" onClick={anchor('boka')}>Enquire</a>
      </header>

      {/* 01 · hero */}
      <section className="gc-hero" id="top">
        <div className="gc-hero-media">
          <img src={PHOTO.sunsetCottage.src} srcSet={srcSet(PHOTO.sunsetCottage.src)} sizes="100vw"
            alt={PHOTO.sunsetCottage.alt} loading="eager" decoding="async" />
        </div>
        <h1 className="gc-wm" aria-label="Glass Cottages">
          <span className="gc-wm-ghost gc-wm-ghost-b" aria-hidden="true">GLASS COTTAGES</span>
          <span className="gc-wm-ghost gc-wm-ghost-g" aria-hidden="true">GLASS COTTAGES</span>
          <span className="gc-wm-solid" aria-hidden="true">GLASS COTTAGES</span>
        </h1>
        <div className="gc-hero-block">
          <p className="gc-hero-sub">
            Two glass cottages alone in five hundred hectares of lava near Hella.
            Each sleeps two, with its own hot tub under the open sky.
          </p>
          <a className="gc-hero-link" href="#boka" onClick={anchor('boka')}>Enquire about your stay</a>
        </div>
      </section>

      {/* 02 · the field */}
      <section className="gc-land" id="landid">
        <div className="gc-land-copy">
          <Headline text="The field keeps its distance." size={76} floor={34} measure={680} />
          <p className="gc-body gc-rv">
            The cottages stand in a family-kept lava field with no neighbours in
            sight, held as a haven for birds and wildlife. What surrounds you is
            moss, stone and weather, and nothing else.
          </p>
        </div>
        <Frame photo={PHOTO.lavaField} drift={10} side="bottom" className="gc-land-fig" sizes="90vw" />
      </section>

      {/* 03 · THE CHOOSER */}
      <section className="gc-chooser" id="husin">
        <div className="gc-chooser-inner">
          <button
            type="button"
            className="gc-choose gc-choose-blar"
            onClick={() => choose('blar')}
            aria-label="Choose Blár, the blue cottage"
          >
            <div className="gc-choose-media" data-nodrift="">
              <Frame photo={PHOTO.bedView} drift={0} noDrift flipId={chosen && cottage === 'blar' ? undefined : 'cot-blar'} sizes="50vw" />
            </div>
            <span className="gc-choose-name" style={{ color: BLAR }}>Blár</span>
            <span className="gc-choose-line">{COTTAGES.blar.line}</span>
          </button>
          <div className="gc-choose-mid" aria-hidden="true">
            <span className="gc-choose-mid-top">Two cottages</span>
            <span className="gc-choose-mid-bot">200 metres apart</span>
          </div>
          <button
            type="button"
            className="gc-choose gc-choose-graenn"
            onClick={() => choose('graenn')}
            aria-label="Choose Grænn, the green cottage"
          >
            <div className="gc-choose-media" data-nodrift="">
              <Frame photo={PHOTO.auroraGable} drift={0} noDrift flipId={chosen && cottage === 'graenn' ? undefined : 'cot-graenn'} sizes="50vw" />
            </div>
            <span className="gc-choose-name" style={{ color: GRAENN }}>Grænn</span>
            <span className="gc-choose-line">{COTTAGES.graenn.line}</span>
          </button>
        </div>
      </section>

      {/* 03b · chosen detail (Flip lands here) */}
      {chosen && (
        <section className="gc-detail" id="valid" style={{ '--acc': det.accent } as React.CSSProperties}>
          <div className="gc-detail-head">
            <p className="gc-detail-name">{COTTAGES[cottage].name}</p>
            <p className="gc-detail-gloss">{COTTAGES[cottage].gloss}</p>
          </div>
          <div className="gc-detail-grid">
            <Frame photo={det.photo} drift={9} flipId={`cot-${cottage}`}
              side={cottage === 'blar' ? 'top' : 'bottom'} className="gc-detail-hero" sizes="70vw" />
            <div className="gc-detail-copy">
              <p className="gc-body">{det.body}</p>
              <dl className="gc-detail-facts">
                <div><dt>Sleeps</dt><dd>{FACTS.guests} · {FACTS.bed}</dd></div>
                <div><dt>Bath</dt><dd>{FACTS.bath}, floor heating throughout</dd></div>
                <div><dt>Outside</dt><dd>Private hot tub on the deck</dd></div>
              </dl>
              <button
                type="button" className="gc-ghost"
                onClick={() => choose(cottage === 'blar' ? 'graenn' : 'blar')}
              >
                View {cottage === 'blar' ? 'Grænn' : 'Blár'} instead
              </button>
            </div>
          </div>
          <Frame photo={det.second} drift={11}
            side={cottage === 'blar' ? 'top' : 'bottom'} className="gc-detail-second" sizes="90vw" />
        </section>
      )}

      {/* 04 · inside / craft */}
      <section className="gc-inside">
        <div className="gc-inside-panel">
          <div className="gc-inside-head">
            <Headline text="Built by hand, warmed by the sun." size={54} floor={28} measure={560} />
            <p className="gc-body gc-rv">
              The cottages were designed by {HOST.designedBy}, and the family
              keeps them close to the land they stand on.
            </p>
          </div>
          <div className="gc-inside-grid">
            <ul className="gc-craft gc-rv">
              {CRAFT.map((c) => (
                <li key={c.name}>
                  <span className="gc-craft-name">{c.name}</span>
                  <span className="gc-craft-line">{c.line}</span>
                </li>
              ))}
            </ul>
            <div className="gc-inside-figs">
              <Frame photo={PHOTO.interiorBright} drift={9} side="top" />
              <Frame photo={PHOTO.kitchenDark} drift={8} side="bottom" />
            </div>
          </div>
          <div className="gc-inside-band">
            <Frame photo={PHOTO.daybed} drift={10} side="top" />
            <Frame photo={PHOTO.sunstar} drift={12} side="bottom" />
            <Frame photo={PHOTO.robes} drift={8} side="top" />
          </div>
        </div>
      </section>

      {/* 05 · the stay — the practical spec the old site never states */}
      <section className="gc-stay" id="dvolin">
        <div className="gc-stay-head">
          <Headline text="What the stay actually is." size={54} floor={28} measure={560} />
          <p className="gc-body gc-rv">
            Both cottages hold the same things. Blár and Grænn differ only in
            their palette: one follows the lagoons and the ice, the other the
            moss and the aurora.
          </p>
        </div>
        <dl className="gc-spec gc-rv">
          {STAY.map((row) => (
            <div className="gc-spec-row" key={row.k}>
              <dt>{row.k}</dt>
              <dd>{row.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 06 · night — aurora + quotes */}
      <section className="gc-night" id="gestir">
        <div className="gc-night-media">
          {NIGHT_SEQ.map((p, i) => (
            <img key={p.src} className="gc-night-layer" src={p.src} srcSet={srcSet(p.src)}
              sizes="100vw" alt={i === 0 ? p.alt : ''} aria-hidden={i > 0 ? 'true' : undefined}
              loading="lazy" decoding="async" />
          ))}
        </div>
        <div className="gc-night-inner">
          <p className="gc-night-score gc-rv">
            Rated {HOST.rating} across {HOST.reviewCount} reviews ·
            Hosted by {HOST.name}, Superhost for {HOST.yearsHosting} years
          </p>
          <NightQuotes />
          <p className="gc-night-honest gc-rv">
            Clear nights are never promised. When they come, the roof is glass.
          </p>
        </div>
      </section>

      {/* 06 · enquiry */}
      <section className="gc-book" id="boka">
        <div className="gc-book-copy">
          <Headline text="Choose a sky, send the dates." size={60} floor={30} measure={560} />
          <p className="gc-body gc-rv">
            Pick Blár or Grænn, and send a request straight to the hosts. They
            confirm availability and reply with the nightly price before anything
            is booked.
          </p>
          <div className="gc-owner-note gc-rv">
            <p className="gc-owner-note-label">The owner’s dashboard</p>
            <p className="gc-owner-note-body">
              Requests land in a simple dashboard, marked by cottage.{' '}
              <Link className="gc-a" to="/preview/glasscottages/stjornbord">
                See how direct bookings would work
              </Link>
            </p>
          </div>
        </div>
        <BookingForm cottage={cottage} onCottage={setCottage} />
      </section>

      {/* page footer facts */}
      <footer className="gc-foot">
        <div className="gc-foot-grid">
          <div>
            <p className="gc-foot-mark">GLASS COTTAGES</p>
            <p className="gc-foot-line">{FACTS.field}</p>
            <p className="gc-foot-line">Licence nr. {FACTS.licence}</p>
          </div>
          <div>
            <p className="gc-foot-line">{FACTS.apart} · each sleeps {FACTS.guests}</p>
            <p className="gc-foot-line">{FACTS.hotTub} · {FACTS.heating.toLowerCase()}</p>
            <p className="gc-foot-line">{FACTS.base}</p>
          </div>
          <div>
            <p className="gc-foot-line">
              Photography: the cottages’ own photographs, from glasscottages.com
              and the listing, retrieved August 2026.
            </p>
            <p className="gc-foot-line">
              Prototype by SNDR. Booking requests here are a demo and stay in this
              browser. Their live booking runs at book.glasscottages.com.
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
@font-face { font-family: 'Satoshi'; src: url('${BASE}glasscottages/fonts/Satoshi-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${BASE}glasscottages/fonts/Satoshi-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }

.gc-root {
  --u: min(calc(100vw / 1440), 1.15px);
  --gc-night: ${NIGHT};
  --gc-bone: ${BONE};
  --gc-mute: ${MUTE};
  --gc-hair: rgba(232, 236, 234, .14);
  background: var(--gc-night); color: var(--gc-bone);
  font-family: ${SANS}; font-weight: 400;
  overflow-x: clip;
}
.gc-root *, .gc-root *::before, .gc-root *::after { box-sizing: border-box; }
.gc-root img { max-width: 100%; }
.gc-root :focus-visible { outline: 2px solid ${BLAR}; outline-offset: 2px; border-radius: 2px; }
.gc-root ::selection { background: ${BLAR}; color: ${NIGHT}; }
.gc-root section { scroll-margin-top: clamp(88px, calc(var(--u) * 116), 136px); }

/* ── capsule nav ── */
.gc-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between;
  height: 70px; padding: 0 calc(var(--u) * 34);
  background: transparent; border-bottom: 1px solid transparent;
  transition: background .55s ease, border-color .55s ease,
    -webkit-backdrop-filter .55s ease, backdrop-filter .55s ease;
}
.gc-nav.is-solid {
  background: rgba(16, 20, 24, .68);
  -webkit-backdrop-filter: blur(16px) saturate(140%); backdrop-filter: blur(16px) saturate(140%);
  border-bottom-color: rgba(232, 236, 234, .11);
}
.gc-nav a { color: #F2F6F4; text-decoration: none; }
.gc-nav-mark { font-weight: 500; letter-spacing: .2em; font-size: 12.5px; white-space: nowrap; }
.gc-nav-mark span { color: ${BLAR}; }
.gc-nav a.gc-nav-cta {
  position: relative; font-size: 13px; font-weight: 500; letter-spacing: .05em;
  white-space: nowrap; padding-bottom: 4px;
}
.gc-nav-cta::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background: currentColor; opacity: .6; transform-origin: right;
  transition: transform .45s cubic-bezier(.23,1,.32,1);
}
@media (hover: hover) and (pointer: fine) {
  .gc-nav-cta:hover::after { transform: scaleX(.28); }
}

/* ── hero ── */
.gc-hero { position: relative; min-height: 100svh; display: grid; overflow: hidden; }
.gc-hero-media { position: absolute; inset: 0; }
.gc-hero-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gc-hero-media::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(200deg, rgba(16,20,24,.14) 34%, rgba(16,20,24,.72) 100%);
}
.gc-wm {
  position: absolute; inset: 0; z-index: 2; display: grid; place-items: center;
  margin: 0; pointer-events: none;
  font-weight: 500; letter-spacing: .1em; text-align: center;
  font-size: clamp(30px, 6.4vw, 100px); line-height: 1;
  color: #F2F6F4;
}
.gc-wm > span { grid-area: 1 / 1; white-space: nowrap; will-change: transform, opacity; }
.gc-wm-ghost-b { color: ${BLAR}; }
.gc-wm-ghost-g { color: ${GRAENN}; }
.gc-wm-solid { text-shadow: 0 2px 44px rgba(16, 20, 24, .4); }
.gc-hero-block {
  position: relative; z-index: 1; align-self: end;
  padding: 0 calc(var(--u) * 48) calc(calc(var(--u) * 60) + env(safe-area-inset-bottom, 0px));
  max-width: calc(var(--u) * 860);
}
.gc-hero-sub { margin: 0; font-size: ${fluid(19, 16)}; line-height: 1.5; max-width: 46ch; color: #F2F6F4; }
.gc-hero-link {
  display: inline-block; margin-top: calc(var(--u) * 22); color: #F2F6F4;
  font-weight: 500; font-size: ${fluid(15, 14)}; text-decoration: none;
  padding-bottom: 4px; position: relative;
}
.gc-hero-link::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background: currentColor; transform-origin: left;
  transition: transform .45s cubic-bezier(.23,1,.32,1);
}
@media (hover: hover) and (pointer: fine) {
  .gc-hero-link:hover::after { transform: scaleX(.35); }
}

/* ── shared type ── */
.gc-headline { margin: 0; font-weight: 500; letter-spacing: -.024em; line-height: 1.08; text-wrap: balance; }
.gc-line {
  display: inline-block; overflow: hidden; vertical-align: bottom;
  padding: .2em .04em .14em; margin: -.2em -.04em -.14em;
}
.gc-word { display: inline-block; }
.gc-body { font-size: ${fluid(17, 15)}; line-height: 1.62; color: var(--gc-mute); max-width: 56ch; margin: calc(var(--u) * 22) 0 0; }
.gc-a { color: ${BLAR}; text-underline-offset: 3px; }
.gc-a:hover { color: var(--gc-bone); }

/* generic rise reveal */
.gc-rv:not(.gc-frame) { transition: opacity .9s ease, transform .9s cubic-bezier(.23,1,.32,1); }
.gc-root .gc-rv:not(.is-in):not(.gc-frame) { opacity: 0; transform: translateY(22px); }
.gc-root .gc-rv.is-in:not(.gc-frame) { opacity: 1; transform: none; }

/* the page-wide MERSI clip system: Blár-side from the top, Grænn-side from
   the bottom. clip-path only — visible content, no opacity gating. */
.gc-clip { transition: clip-path 1.15s cubic-bezier(.77, 0, .175, 1); }
.gc-clip.from-top:not(.is-in) { clip-path: inset(0 0 100% 0); }
.gc-clip.from-bottom:not(.is-in) { clip-path: inset(100% 0 0 0); }
.gc-clip.is-in { clip-path: inset(0 0 0 0); }

/* drift frames */
.gc-frame { position: relative; overflow: hidden; margin: 0; border-radius: 4px; background: rgba(232, 236, 234, .05); }
.gc-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; }
@media (min-width: 992px) { .gc-frame-in { will-change: transform; } }
.gc-frame-in img { width: 100%; height: 100%; max-width: none; object-fit: cover; display: block; }

/* ── the field ── */
.gc-land { max-width: calc(var(--u) * 1360); margin: 0 auto; padding: calc(var(--u) * 150) calc(var(--u) * 48) calc(var(--u) * 110); }
.gc-land-fig { margin-top: calc(var(--u) * 56); }

/* ── the chooser ── */
.gc-chooser { position: relative; }
.gc-chooser-inner {
  position: relative; min-height: 100svh;
  display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
  align-items: stretch;
}
.gc-choose {
  position: relative; display: grid; align-content: end; gap: 8px;
  padding: calc(var(--u) * 40); border: 0; cursor: pointer; text-align: left;
  background: var(--gc-night); color: var(--gc-bone); font: inherit;
}
.gc-choose-media { position: absolute; inset: 0; overflow: hidden; }
.gc-choose-media .gc-frame { position: absolute; inset: 0; border-radius: 0; aspect-ratio: auto !important; }
.gc-choose-media .gc-frame-in { inset: 0; }
.gc-choose::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(12deg, rgba(16,20,24,.78) 6%, rgba(16,20,24,.05) 55%);
  pointer-events: none;
}
.gc-choose-name { position: relative; z-index: 1; font-weight: 500; font-size: ${fluid(52, 34)}; letter-spacing: -.02em; line-height: 1; }
.gc-choose-line { position: relative; z-index: 1; font-size: ${fluid(15, 13.5)}; color: rgba(242,246,244,.85); max-width: 34ch; }
.gc-choose:hover .gc-choose-name { text-decoration: underline; text-underline-offset: 6px; text-decoration-thickness: 2px; }
.gc-choose-mid {
  position: absolute; z-index: 3; inset: 0; display: grid; place-content: center;
  text-align: center; pointer-events: none; gap: 4px;
}
.gc-choose-mid span {
  display: block; font-weight: 500; font-size: ${fluid(15, 13)};
  letter-spacing: .18em; text-transform: uppercase; color: #F2F6F4;
  text-shadow: 0 1px 18px rgba(16,20,24,.8);
  background: rgba(16,20,24,.42); padding: 8px 18px; border-radius: 999px;
}

/* ── chosen detail ── */
.gc-detail { max-width: calc(var(--u) * 1360); margin: 0 auto; padding: calc(var(--u) * 110) calc(var(--u) * 48); }
.gc-detail-head { display: flex; align-items: baseline; gap: 18px; }
.gc-detail-name { margin: 0; font-weight: 500; font-size: ${fluid(64, 38)}; letter-spacing: -.02em; color: var(--acc); }
.gc-detail-gloss { margin: 0; font-size: ${fluid(15, 13.5)}; color: var(--gc-mute); }
.gc-detail-grid { display: grid; grid-template-columns: 1.25fr .75fr; gap: calc(var(--u) * 56); margin-top: calc(var(--u) * 40); align-items: start; }
.gc-detail-facts { margin: calc(var(--u) * 30) 0 0; display: grid; gap: 12px; }
.gc-detail-facts div { display: flex; gap: 16px; align-items: baseline; border-top: 1px solid var(--gc-hair); padding-top: 12px; }
.gc-detail-facts dt { font-size: 12.5px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--gc-mute); min-width: 9ch; }
.gc-detail-facts dd { margin: 0; font-size: ${fluid(15.5, 14)}; }
.gc-detail-copy .gc-ghost { margin-top: calc(var(--u) * 28); }
.gc-detail-second { margin-top: calc(var(--u) * 56); }

/* ── inside / craft ── */
.gc-inside { padding: calc(var(--u) * 130) calc(var(--u) * 24); }
.gc-inside-panel {
  max-width: calc(var(--u) * 1360); margin: 0 auto;
  background: #171D22; border: 1px solid var(--gc-hair); border-radius: 8px;
  padding: calc(var(--u) * 80) calc(var(--u) * 64);
}
.gc-inside-head { max-width: calc(var(--u) * 640); }
.gc-inside-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: calc(var(--u) * 64); margin-top: calc(var(--u) * 56); align-items: start; }
.gc-craft { list-style: none; margin: 0; padding: 0; }
.gc-craft li { display: grid; gap: 4px; padding: 18px 0; border-top: 1px solid var(--gc-hair); }
.gc-craft-name { font-weight: 500; font-size: ${fluid(19, 16)}; }
.gc-craft-line { font-size: ${fluid(14.5, 13.5)}; color: var(--gc-mute); line-height: 1.55; }
.gc-inside-figs { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 20); }
.gc-inside-band { display: grid; grid-template-columns: 1fr 1.3fr .8fr; gap: calc(var(--u) * 20); margin-top: calc(var(--u) * 20); }

/* ── night ── */
.gc-night { position: relative; min-height: 90svh; display: grid; align-items: end; overflow: hidden; }
.gc-night-media { position: absolute; inset: 0; }
.gc-night-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gc-night-media::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(10deg, rgba(16,20,24,.84) 14%, rgba(16,20,24,.12) 60%);
}
.gc-night-layer { position: absolute; inset: 0; will-change: transform, opacity; }
.gc-night-inner { position: relative; z-index: 1; padding: calc(var(--u) * 120) calc(var(--u) * 48) calc(var(--u) * 80); max-width: calc(var(--u) * 900); }
.gc-night-score { margin: 0 0 calc(var(--u) * 26); font-size: ${fluid(14, 13)}; letter-spacing: .04em; color: rgba(232,236,234,.85); }
.gc-night-honest { margin: calc(var(--u) * 64) 0 0; font-size: ${fluid(14, 13)}; color: rgba(232,236,234,.66); }
.gc-nightquotes { position: relative; min-height: 9.5em; }
.gc-nq { position: absolute; inset: 0; margin: 0; opacity: 0; transition: opacity 1.1s ease; pointer-events: none; }
.gc-nq.is-on { opacity: 1; pointer-events: auto; }
.gc-nq p { margin: 0; font-size: ${fluid(30, 20)}; line-height: 1.32; letter-spacing: -.012em; max-width: 26ch; color: #fff; }
.gc-nq cite { display: block; margin-top: 14px; font-style: normal; font-size: ${fluid(14, 13)}; color: ${GRAENN}; }
.gc-nq-dots { position: absolute; bottom: -34px; left: 2px; display: flex; gap: 10px; }
.gc-nq-dot { width: 26px; height: 3px; border: 0; border-radius: 2px; padding: 0; cursor: pointer; background: rgba(232,236,234,.3); transition: background .3s; }
.gc-nq-dot.is-on { background: ${GRAENN}; }

/* ── the stay ── */
.gc-stay {
  display: grid; grid-template-columns: .85fr 1.15fr; gap: calc(var(--u) * 88);
  align-items: start; max-width: calc(var(--u) * 1300); margin: 0 auto;
  padding: calc(var(--u) * 140) calc(var(--u) * 48);
}
.gc-stay-head { position: sticky; top: 108px; }
.gc-stay-head .gc-body { margin-top: calc(var(--u) * 24); }
.gc-spec { margin: 0; }
.gc-spec-row {
  display: grid; grid-template-columns: 9rem 1fr; gap: calc(var(--u) * 26);
  padding: 17px 0; border-top: 1px solid var(--gc-hair);
}
.gc-spec-row:last-child { border-bottom: 1px solid var(--gc-hair); }
.gc-spec dt {
  margin: 0; padding-top: .28em; font-size: 12px; font-weight: 500;
  letter-spacing: .12em; text-transform: uppercase; color: var(--gc-mute);
}
.gc-spec dd { margin: 0; font-size: ${fluid(18, 16)}; line-height: 1.5; }

/* ── booking ── */
.gc-book {
  display: grid; grid-template-columns: .9fr 1.1fr; gap: calc(var(--u) * 88);
  max-width: calc(var(--u) * 1300); margin: 0 auto;
  padding: calc(var(--u) * 150) calc(var(--u) * 48) calc(var(--u) * 120);
}
.gc-owner-note { margin-top: calc(var(--u) * 40); border-top: 1px solid var(--gc-hair); padding-top: 20px; }
.gc-owner-note-label { margin: 0 0 6px; font-size: 12.5px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--gc-mute); }
.gc-owner-note-body { margin: 0; font-size: ${fluid(15, 14)}; line-height: 1.6; color: var(--gc-mute); }
.gc-cot-pick { border: 0; padding: 0; margin: 0 0 18px; }
.gc-cot-pills { display: flex; gap: 10px; margin-top: 8px; }
.gc-cot-pill {
  position: relative; cursor: pointer; font-weight: 500; font-size: 15px;
  border: 1px solid var(--gc-hair); border-radius: 999px; padding: 10px 22px;
  transition: border-color .25s, color .25s;
}
.gc-cot-pill input { position: absolute; opacity: 0; inset: 0; cursor: pointer; }
.gc-cot-pill.is-blar.is-on { border-color: ${BLAR}; color: ${BLAR}; }
.gc-cot-pill.is-graenn.is-on { border-color: ${GRAENN}; color: ${GRAENN}; }
.gc-fields { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.gc-field { display: grid; gap: 7px; }
.gc-field-wide { grid-column: 1 / -1; }
.gc-field-label { font-size: 12.5px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--gc-mute); }
.gc-optional { text-transform: none; letter-spacing: 0; font-weight: 400; }
.gc-field input, .gc-field select, .gc-field textarea {
  font: inherit; font-size: 15px; color: var(--gc-bone);
  background: #171D22; border: 1px solid rgba(232, 236, 234, .22); border-radius: 4px;
  padding: 12px 12px; width: 100%; min-height: 46px;
  color-scheme: dark;
}
.gc-field textarea { resize: vertical; }
.gc-field input:focus, .gc-field select:focus, .gc-field textarea:focus { border-color: ${BLAR}; outline: none; box-shadow: 0 0 0 3px rgba(127, 168, 201, .2); }
.gc-field-error { margin: 14px 0 0; color: #E08A70; font-size: 14px; }
.gc-cta {
  margin-top: 22px; font: inherit; font-size: 15px; font-weight: 500; cursor: pointer;
  background: ${BONE}; color: ${NIGHT}; border: 0; border-radius: 999px;
  padding: 14px 28px; min-height: 48px;
  transition: filter .25s, transform .16s cubic-bezier(.23,1,.32,1);
}
.gc-cta:hover { filter: brightness(1.08); }
.gc-cta:active { transform: scale(.97); }
.gc-book-note { margin: 16px 0 0; font-size: ${fluid(13.5, 12.5)}; line-height: 1.6; color: var(--gc-mute); max-width: 48ch; }
.gc-book-done { border: 1px solid var(--gc-hair); border-radius: 6px; padding: calc(var(--u) * 40); background: #171D22; }
.gc-book-done-title { margin: 0; font-size: ${fluid(24, 19)}; font-weight: 500; }
.gc-ghost {
  font: inherit; font-size: inherit; color: ${BLAR}; background: none; border: 0;
  padding: 0; cursor: pointer; text-decoration: underline; text-underline-offset: 3px;
}
.gc-ghost:hover { color: var(--gc-bone); }

/* ── footer ── */
.gc-foot { border-top: 1px solid var(--gc-hair); }
.gc-foot-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 48);
  max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 56) calc(var(--u) * 48) calc(var(--u) * 72);
}
.gc-foot-mark { font-weight: 500; letter-spacing: .18em; font-size: ${fluid(14, 13)}; margin: 0 0 calc(var(--u) * 12); }
.gc-foot-line { font-size: ${fluid(13.5, 13)}; line-height: 1.6; color: var(--gc-mute); margin: 0 0 calc(var(--u) * 8); }

/* ── loader ── */
.gc-loader { position: fixed; inset: 0; z-index: 60; }
/* the sheet is cut along the cottages' own gable: an apex at the top centre,
   two slopes falling to the bottom corners. The roof drops out of frame, the
   sky either side of it lifts away, and light blooms from the apex. */
.gc-loader-half {
  position: absolute; inset: 0; background: ${NIGHT};
  transition: transform 1.15s cubic-bezier(.76, 0, .24, 1);
}
.gc-loader-roof { clip-path: polygon(0% 100%, 50% 0%, 100% 100%); }
.gc-loader-sky { clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 0, 0 100%); }
.gc-loader.is-leaving .gc-loader-roof { transform: translateY(103%); }
.gc-loader.is-leaving .gc-loader-sky { transform: translateY(-103%); }
.gc-loader-seam {
  position: absolute; left: 50%; top: -8vmax; width: 48vmax; height: 48vmax;
  transform: translateX(-50%); border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, ${BLAR} 0%, transparent 62%);
  opacity: 0; transition: opacity .9s ease;
}
.gc-loader.is-leaving .gc-loader-seam { opacity: .42; }
.gc-loader-center {
  position: absolute; inset: 0; display: grid; place-content: center; place-items: center;
  gap: 26px; transition: opacity .5s ease;
}
.gc-loader.is-leaving .gc-loader-center, .gc-loader.is-leaving .gc-loader-pct { opacity: 0; }
.gc-loader-ring {
  width: 54px; height: 54px; border-radius: 50%;
  background: conic-gradient(${BONE} calc(var(--p, 0) * 1%), rgba(232, 236, 234, .16) 0);
  -webkit-mask: radial-gradient(closest-side, transparent 64%, #000 65%);
  mask: radial-gradient(closest-side, transparent 64%, #000 65%);
}
.gc-loader-mark {
  margin: 0; font-weight: 500; letter-spacing: .14em;
  font-size: clamp(24px, 5vw, 64px); white-space: nowrap; line-height: 1;
  background-image: linear-gradient(90deg, ${BONE} 50%, rgba(232, 236, 234, .18) 50%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.gc-loader-pct {
  position: fixed; left: calc(var(--u) * 48); bottom: calc(var(--u) * 40);
  margin: 0; font-size: 12px; font-weight: 500; letter-spacing: .16em;
  color: rgba(232, 236, 234, .6); transition: opacity .5s ease;
}

/* ── responsive ── */
@media (max-width: 1023px) {
  .gc-chooser-inner { grid-template-columns: 1fr; min-height: 0; }
  .gc-choose { min-height: 62svh; }
  .gc-choose-mid { position: static; padding: 14px 0; }
  .gc-choose-mid span { background: none; text-shadow: none; color: var(--gc-mute); padding: 0; }
}
@media (max-width: 991px) {
  .gc-nav { height: 60px; padding: 0 20px; }
  .gc-stay { grid-template-columns: 1fr; gap: 40px; padding: 100px 20px; }
  .gc-stay-head { position: static; }
  .gc-land { padding: 110px 20px 70px; }
  .gc-inside { padding-left: 12px; padding-right: 12px; }
  .gc-inside-panel { padding: 40px 22px; }
  .gc-inside-grid, .gc-detail-grid, .gc-book { grid-template-columns: 1fr; gap: 40px; }
  .gc-book { padding-left: 20px; padding-right: 20px; }
  .gc-detail { padding-left: 20px; padding-right: 20px; }
  .gc-inside-band { grid-template-columns: 1fr 1fr; }
  .gc-inside-band .gc-frame:last-child { display: none; }
  .gc-night-inner { padding-left: 20px; padding-right: 20px; }
  .gc-hero-block { padding-left: 20px; padding-right: 40px; }
  .gc-foot-grid { grid-template-columns: 1fr; padding-left: 20px; padding-right: 20px; gap: 24px; }
  .gc-fields { grid-template-columns: 1fr 1fr; }
  .gc-nav-cta { font-size: 12.5px; padding: 8px 14px; }
}
@media (max-width: 519px) {
  .gc-fields { grid-template-columns: 1fr; }
  .gc-spec-row { grid-template-columns: 1fr; gap: 5px; }
  .gc-wm { font-size: clamp(22px, 8.6vw, 44px); }
}

/* ── reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .gc-root * { transition: none !important; animation: none !important; }
  .gc-word { transform: none !important; opacity: 1 !important; }
  .gc-wm > span { transform: none !important; opacity: 1 !important; visibility: visible !important; }
  .gc-wm-ghost { display: none !important; }
  .gc-rv, .gc-clip { opacity: 1 !important; transform: none !important; clip-path: inset(0 0 0 0) !important; }
  .gc-frame-in { inset: 0; transform: none !important; }
  .gc-choose-media { clip-path: inset(0 0 0 0) !important; }
}
`
