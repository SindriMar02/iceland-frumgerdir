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
  DROP_STATIONS, FACTS, HOST, JSON_LD, PHOTO, REVIEW_QUOTES, RIVER, ROOMS,
  srcSet, type Photo,
} from './content'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('laxfoss')

/* ── LAXFOSS · "NIÐURÁ" (downstream) ────────────────────────────────────────
   The waterfall beside this 1920s house never stops falling, so this is the
   catalogue's only page whose spine moves DOWN. Full spec: ./DESIGN.md.

   The devices, each honestly derived from their material:
    1. The loader FALLS — the sheet exits downward, the page's first drop.
       Real progress (hero decode + fonts.ready) shown as a conic ring.
    2. The wordmark POURS — LAXFOSS arrives from above its mask, letter by
       letter, under a hairline drawn like the water's brink. Scroll takes
       the same gesture over: the letters fall out the bottom, the brink
       runs on. Entrance drives yPercent, the scrub drives y — two separate
       transform components, so they can never fight.
    3. THE DROP — a pinned descent of the falls in three stations (Upstream /
       The brink / The pool) while the dark aerial of the rapids rises past
       the reader. One timeline, one scrub, reversible.
    4. Drift (Heklusýn spec) — every content photograph drifts continuously
       inside its fixed overflow-hidden frame; drift DEEPENS down the page
       (8 up top → 13 at the pool) so the page itself accelerates. Batched
       reads-then-writes on the one ticker, gated while the pin holds, off
       under reduced motion.

   ONE typeface (General Sans), 400 everywhere, 500 only for wordmark/CTAs;
   tracking scales with size (Lightship discipline). Fluid unit scoped to
   this root only. ──────────────────────────────────────────────────────── */

const FROST = '#EEF3F5'
const INK = '#22303A'
const NIGHT = '#0B1B26'
const NIGHT_INK = '#E8EEF2'
const RIVER_A = '#33688A'   // functional accent on light (AA with white fills)
const GLACIAL = '#8FC1DB'   // accent text on night sections only

const SANS = "'General Sans', system-ui, sans-serif"
const BASE = import.meta.env.BASE_URL

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/** The hero film plays unless motion is reduced or the connection asks not to.
    A Kling 3.0 ambient loop of THEIR aerial: water moves, nothing else does.
    Palindrome (last frame = first), poster = the exact first frame. */
const filmOk = () => {
  if (typeof window === 'undefined' || reduced()) return false
  const c = (navigator as { connection?: { saveData?: boolean } }).connection
  return !c?.saveData
}

/* ── motion engine ───────────────────────────────────────────────────────── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready || reduced()) return
    const root = document.querySelector<HTMLElement>('.lx-root')
    if (!root) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    const cleanups: Array<() => void> = []
    let dropST: ScrollTrigger | null = null

    /* reveals: IO arms 'is-in' once; CSS owns the transition. */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.2 },
    )
    root.querySelectorAll('.lx-rv').forEach((el) => io.observe(el))

    /* nav: flip to night chrome while a dark section is under it */
    const nav = root.querySelector<HTMLElement>('.lx-nav')
    const navIo = new IntersectionObserver(
      (entries) => {
        const dark = entries.some((e) => e.isIntersecting)
        nav?.classList.toggle('is-dark', dark)
      },
      { rootMargin: '-2% 0px -94% 0px' },
    )
    root.querySelectorAll('[data-lx-dark]').forEach((el) => navIo.observe(el))

    const ctx = gsap.context(() => {
      /* word-mask headline rises (words, never chars) */
      root.querySelectorAll<HTMLElement>('[data-lx-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.lx-word')
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

      /* THE WORDMARK — the pour.
         A hairline draws across like the brink of the fall, then the letters
         of LAXFOSS pour DOWN out of it into place. Scroll continues the fall:
         the letters drop out the bottom of the mask, the brink runs wide. */
      const letters = root.querySelectorAll<HTMLElement>('.lx-wm-letter')
      const brink = root.querySelector<HTMLElement>('.lx-wm-brink')
      const wmEl = root.querySelector<HTMLElement>('.lx-wm')
      const heroEl = root.querySelector<HTMLElement>('.lx-hero')

      if (letters.length && brink) {
        gsap.set(letters, { yPercent: -120 })
        gsap.set(brink, { scaleX: 0 })
        let opened = false
        const openWordmark = () => {
          if (opened) return
          opened = true
          gsap.timeline()
            .to(brink, { scaleX: 1, duration: 0.8, ease: 'expo.out' })
            .to(letters, {
              yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.05,
            }, '-=0.45')
        }
        if (root.querySelector('.lx-loader')) {
          window.addEventListener('lx:revealed', openWordmark, { once: true })
        } else {
          gsap.delayedCall(0.15, openWordmark)
        }
        /* rAF suspends in a hidden tab; the loader's timer may never fire.
           setTimeout keeps ticking. [[preview-pane-verification-gotchas]] */
        window.setTimeout(openWordmark, 3600)
      }

      if (heroEl && wmEl && letters.length && brink) {
        const away = { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 0.6 }
        gsap.to(letters, { y: 110, ease: 'none', stagger: 0.03, scrollTrigger: away })
        gsap.to(brink, { scaleX: 2.4, opacity: 0, ease: 'none', scrollTrigger: away })
        gsap.to(wmEl, { opacity: 0.08, ease: 'none', scrollTrigger: away })
      }

      /* THE DROP — pinned descent of the falls. One timeline, one scrub.
         The dark aerial rises past the reader while three stations pass:
         Upstream, The brink, The pool. Desktop pins; under 768px the
         stations simply stack (no pin, nothing to miss). */
      const drop = root.querySelector<HTMLElement>('.lx-drop')
      const dropImg = root.querySelector<HTMLElement>('.lx-drop-img')
      const stations = root.querySelectorAll<HTMLElement>('.lx-drop-station')
      if (drop && dropImg && stations.length === 3 && window.innerWidth >= 768) {
        gsap.set(stations, { autoAlpha: 0, y: 44 })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: drop, start: 'top top', end: '+=240%',
            pin: true, scrub: 0.9, anticipatePin: 1, invalidateOnRefresh: true,
          },
        })
        dropST = tl.scrollTrigger ?? null
        tl.fromTo(dropImg, { yPercent: 7 }, { yPercent: -13, ease: 'none', duration: 1 }, 0)
        /* The three stations are absolutely positioned in the SAME place, so
           their opacities must never overlap: two visible at once renders both
           texts on top of each other and reads as duplicated, garbled copy.
           Nor may there be a RANGE with none visible, which reads as an empty,
           broken section. So the handoff is exact — each station's fade-out
           ENDS on the frame the next station's fade-in BEGINS:
             st1  in .02-.11   out .30-.39
             st2  in .39-.48   out .62-.71
             st3  in .71-.80   holds to the end                            */
        const FADE = 0.09
        const beats = [
          [0.02, 0.30],   // [in, start-leaving]
          [0.39, 0.62],
          [0.71, -1],     // the pool stays to the end
        ] as const
        stations.forEach((st, i) => {
          const [inAt, leaveAt] = beats[i]
          tl.to(st, { autoAlpha: 1, y: 0, duration: FADE, ease: 'power2.out' }, inAt)
          if (leaveAt > 0) tl.to(st, { autoAlpha: 0, y: -34, duration: FADE, ease: 'power2.in' }, leaveAt)
        })
      }

      /* focusin failsafe: keyboard users must never land inside hidden copy */
      const onFocusIn = (e: FocusEvent) => {
        const rv = (e.target as HTMLElement).closest?.('.lx-rv')
        rv?.classList.add('is-in')
      }
      root.addEventListener('focusin', onFocusIn)
      cleanups.push(() => root.removeEventListener('focusin', onFocusIn))
    }, root)

    /* drift: Heklusýn spec — batched reads then writes, off-screen skipped,
       gated while the drop is pinned. Depth-scaled per frame via data-drift. */
    const driftEls = Array.from(root.querySelectorAll<HTMLElement>('.lx-frame-in'))
    const drift = () => {
      if (dropST?.isActive) return
      const vh = window.innerHeight
      const writes: Array<[HTMLElement, number]> = []
      for (const el of driftEls) {
        const frame = el.parentElement
        if (!frame) continue
        const r = frame.getBoundingClientRect()
        if (r.bottom < -40 || r.top > vh + 40) continue
        /* clamp: a frame taller than ~vh can push p past ±1 near its exit,
           which overruns the --dz overhang and bleeds the image edge into
           the frame (measured 45px on an 843px frame). Bound it. */
        const p = Math.max(-1, Math.min(1, 1 - (r.top + r.height / 2) / (vh / 2) / 2)) // -1..1 across viewport
        const d = Number(el.dataset.drift || 9)
        writes.push([el, -p * d])
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
      className={`lx-headline ${className}`}
      data-lx-headline=""
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
          <span className="lx-line"><span className="lx-word">{w}</span></span>
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
    <figure className={`lx-frame lx-rv ${className}`} style={{ aspectRatio: photo.ratio }}>
      <div
        className="lx-frame-in"
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

/** Auto-rotating verbatim quotes over the aurora night beat. */
function NightQuotes() {
  const [on, setOn] = useState(0)
  useEffect(() => {
    if (reduced()) return
    const iv = window.setInterval(() => setOn((v) => (v + 1) % REVIEW_QUOTES.length), 6200)
    return () => window.clearInterval(iv)
  }, [])
  return (
    <div className="lx-nightquotes" aria-live="off">
      {REVIEW_QUOTES.map((q, i) => (
        <blockquote key={q.author} className={`lx-nq ${i === on ? 'is-on' : ''}`}>
          <p>{'“'}{q.quote}{'”'}</p>
          <cite>{q.author}, {q.when}</cite>
        </blockquote>
      ))}
      <div className="lx-nq-dots" role="tablist" aria-label="Guest quotes">
        {REVIEW_QUOTES.map((q, i) => (
          <button
            key={q.author} type="button" role="tab"
            aria-selected={i === on} aria-label={`Quote by ${q.author}`}
            className={`lx-nq-dot ${i === on ? 'is-on' : ''}`}
            onClick={() => setOn(i)}
          />
        ))}
      </div>
    </div>
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
      id: `lx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: 'laxfoss',
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
      <div className="lx-book-done" role="status">
        <p className="lx-book-done-title">Your request is on its way.</p>
        <p className="lx-body">
          In the finished site this lands with Guðlaug directly, and she answers with
          availability and the nightly price for your dates.
        </p>
        <p className="lx-body">
          <Link className="lx-a" to="/preview/laxfoss/stjornbord">View the owner’s dashboard</Link>{' '}
          to see where the request arrives, or{' '}
          <button type="button" className="lx-ghost" onClick={() => setDone(null)}>
            make another request
          </button>
        </p>
      </div>
    )
  }

  return (
    <form className="lx-book-form" onSubmit={submit} noValidate>
      <div className="lx-fields">
        <label className="lx-field">
          <span className="lx-field-label">Arrival</span>
          <input type="date" name="date" min={minDate} value={date} required
            onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="lx-field">
          <span className="lx-field-label">Nights</span>
          <select name="nights" value={nights} onChange={(e) => setNights(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="lx-field">
          <span className="lx-field-label">Guests</span>
          <select name="people" value={people} onChange={(e) => setPeople(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="lx-field lx-field-wide">
          <span className="lx-field-label">Name</span>
          <input type="text" name="name" autoComplete="name" value={name} required
            onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="lx-field lx-field-wide">
          <span className="lx-field-label">Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" value={email} required
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="lx-field lx-field-wide">
          <span className="lx-field-label">Phone <span className="lx-optional">(optional)</span></span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="lx-field lx-field-wide">
          <span className="lx-field-label">Anything Guðlaug should know <span className="lx-optional">(optional)</span></span>
          <textarea rows={3} name="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      {error && <p className="lx-field-error" role="alert">{error}</p>}
      <button type="submit" className="lx-cta">Enquire about your stay</button>
      <p className="lx-book-note">
        No card, no charge. The request goes to the host, and the nightly price for
        your dates comes with the reply.
      </p>
    </form>
  )
}

/* ── preloader ──────────────────────────────────────────────────────────────
   Real progress (hero decode + fonts.ready), 1.1s floor / 2.4s cap, once per
   session, ?loader forces, never under reduced motion. The ring is a conic
   gradient; the exit FALLS — the sheet drops away downward, the page's first
   descent. */

const shouldShowLoader = () => {
  if (typeof window === 'undefined' || reduced()) return false
  if (new URLSearchParams(window.location.search).has('loader')) return true
  try { return !sessionStorage.getItem('lx_seen') } catch { return true }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('lx_seen', '1') } catch { /* private mode */ }
    const t0 = performance.now()
    let raf = 0
    let shown = 0
    let heroDone = false
    const hero = new Image()
    hero.decoding = 'async'
    const mark = () => { heroDone = true }
    hero.addEventListener('load', mark, { once: true })
    hero.addEventListener('error', mark, { once: true })
    hero.src = `${BASE}laxfoss/hero-poster.jpg`
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
    <div className={`lx-loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <div className="lx-loader-center">
        <div className="lx-loader-ring" style={{ '--p': pct } as React.CSSProperties} />
        <p className="lx-loader-mark" style={{ backgroundPositionX: `${100 - pct}%` }}>
          LAXFOSS
        </p>
      </div>
      <p className="lx-loader-pct">{pct}%</p>
    </div>
  )
}

/* ── the page ───────────────────────────────────────────────────────────── */

export default function LaxfossPage() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(shouldShowLoader)
  const [playFilm] = useState(filmOk)
  const [filmAlive, setFilmAlive] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThemeColor(FROST)
    document.title = 'Laxfoss Luxury Lodge'
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
    <div ref={rootRef} className="lx-root">
      <style>{CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      {loading && (
        <Preloader onDone={() => {
          setLoading(false)
          window.dispatchEvent(new Event('lx:revealed'))
        }} />
      )}

      {/* capsule nav — a floating frost pill; flips ink over night sections */}
      <header className="lx-nav">
        <a className="lx-nav-mark" href="#top" onClick={anchor('top')}>LAXFOSS</a>
        {/* laxfoss.org runs Our lodge / History / Gallery / Enquiry. Every one
            of those already existed here as a section, just unlinked, so the
            page looked thinner than theirs while actually holding more. The
            nav now covers their whole structure and adds the falls and the
            guests, which their site has no page for. */}
        <nav className="lx-nav-links" aria-label="Page">
          <a href="#husid" onClick={anchor('husid')}>The house</a>
          <a href="#herbergin" onClick={anchor('herbergin')}>Rooms</a>
          <a href="#fossinn" onClick={anchor('fossinn')}>The falls</a>
          <a href="#saunan" onClick={anchor('saunan')}>Sauna</a>
          <a href="#sagan" onClick={anchor('sagan')}>History</a>
          <a href="#gestir" onClick={anchor('gestir')}>Guests</a>
        </nav>
        <a className="lx-nav-cta" href="#boka" onClick={anchor('boka')}>Enquire</a>
      </header>

      {/* 01 · hero — the lodge above its falls */}
      <section className="lx-hero" id="top">
        <div className="lx-hero-media">
          {playFilm && filmAlive ? (
            <video
              autoPlay muted loop playsInline
              poster={`${BASE}laxfoss/hero-poster.jpg`}
              aria-label={PHOTO.waterfallAerial.alt}
              onError={() => setFilmAlive(false)}
            >
              <source src={`${BASE}laxfoss/hero-film.mp4`} type="video/mp4" />
            </video>
          ) : (
            <img src={PHOTO.waterfallAerial.src} srcSet={srcSet(PHOTO.waterfallAerial.src)} sizes="100vw"
              alt={PHOTO.waterfallAerial.alt} loading="eager" decoding="async" />
          )}
        </div>
        <h1 className="lx-wm" aria-label="Laxfoss">
          <span className="lx-wm-brink" aria-hidden="true" />
          <span className="lx-wm-mask" aria-hidden="true">
            {'LAXFOSS'.split('').map((ch, i) => (
              <span className="lx-wm-letter" key={i}>{ch}</span>
            ))}
          </span>
        </h1>
        <div className="lx-hero-block">
          <p className="lx-hero-sub">
            A 1920s lodge set directly above its own waterfall on the Norðurá,
            in Borgarfjörður. Sleeps five.
          </p>
          <a className="lx-hero-link" href="#boka" onClick={anchor('boka')}>Enquire about your stay</a>
        </div>
      </section>

      {/* 02 · manifesto */}
      <section className="lx-manifesto" id="husid">
        <div className="lx-manifesto-copy">
          <Headline text="The river does the talking." size={80} floor={36} measure={640} />
          <p className="lx-body lx-rv">
            Laxfoss means salmon falls, and the house takes its name from the water
            beside it. With a window open, the sound of the fall carries through
            every room. Guests describe it as the thing they remember longest.
          </p>
        </div>
        <Frame photo={PHOTO.waterfallSunset} drift={8} className="lx-manifesto-fig" />
      </section>

      {/* 03 · THE DROP — pinned descent of the falls */}
      <section className="lx-drop" id="fossinn" data-lx-dark>
        <div className="lx-drop-inner">
          <div className="lx-drop-media">
            <img className="lx-drop-img" src={PHOTO.rapidsDark.src} srcSet={srcSet(PHOTO.rapidsDark.src)}
              sizes="100vw" alt={PHOTO.rapidsDark.alt} loading="lazy" decoding="async" />
          </div>
          {DROP_STATIONS.map((s) => (
            <div className="lx-drop-station" key={s.key}>
              <p className="lx-drop-name">{s.name}</p>
              <p className="lx-drop-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 04 · the 1920s house */}
      <section className="lx-history" id="sagan">
        <Frame photo={PHOTO.lodgeExterior} drift={9} className="lx-history-fig" />
        <div className="lx-history-copy">
          <Headline text="A century by the water." size={56} floor={30} measure={520} />
          <p className="lx-body lx-rv">
            The house was built in the 1920s and renovated around the view. The
            wooden floors and walls at its centre are original, and the living
            space faces the river through glass, with a stone fireplace for the
            evenings.
          </p>
          <dl className="lx-facts lx-rv">
            <div><dt>Built</dt><dd>1920s, thoughtfully renovated</dd></div>
            <div><dt>From Reykjavík</dt><dd>1 hour 20 minutes</dd></div>
            <div><dt>Nearest town</dt><dd>Borgarnes, 20 minutes</dd></div>
          </dl>
        </div>
      </section>

      {/* 05 · inside + rooms index */}
      <section className="lx-rooms" id="herbergin">
        <div className="lx-rooms-head">
          <Headline text="Five guests, four rooms." size={56} floor={30} measure={560} />
          <p className="lx-body lx-rv">
            Two doubles, a single and a bunk room made for children, around a
            shared living space that keeps the river in every window.
          </p>
        </div>
        <div className="lx-rooms-grid">
          <ul className="lx-rooms-list lx-rv">
            {ROOMS.map((r) => (
              <li key={r.name}>
                <span className="lx-room-name">{r.name}</span>
                <span className="lx-room-line">{r.line}</span>
              </li>
            ))}
            <li className="lx-room-tail">
              <span className="lx-room-name">Throughout</span>
              <span className="lx-room-line">{FACTS.baths} · fully equipped kitchen · {FACTS.fireplace.toLowerCase()}</span>
            </li>
          </ul>
          <div className="lx-rooms-figs">
            <Frame photo={PHOTO.livingFireplace} drift={10} />
            <Frame photo={PHOTO.bedroom} drift={8} />
          </div>
        </div>
        <div className="lx-rooms-band">
          <Frame photo={PHOTO.kitchenBlack} drift={9} />
          <Frame photo={PHOTO.diningGlass} drift={11} />
          <Frame photo={PHOTO.windowSeat} drift={8} />
        </div>
      </section>

      {/* 06 · sauna night beat */}
      <section className="lx-sauna" id="saunan" data-lx-dark>
        <Frame photo={PHOTO.saunaNight} drift={12} className="lx-sauna-bleed" sizes="100vw" priority={false} />
        <div className="lx-sauna-copy">
          <Headline text="Wood smoke, cold air." size={64} floor={32} measure={560} />
          <p className="lx-body lx-rv">
            The barrel sauna stands between the trees with its round window on
            the falls, and the hot tub waits on the deck. Guests go from one to
            the other in the river air.
          </p>
          <p className="lx-sauna-quote lx-rv">
            {'“'}The sauna with a great view of the waterfall provides relaxation.{'”'}
            <span> Sabine, August 2026</span>
          </p>
        </div>
        <div className="lx-sauna-figs">
          <Frame photo={PHOTO.hottubDusk} drift={9} />
          <Frame photo={PHOTO.saunaForest} drift={8} />
        </div>
      </section>

      {/* 07 · the river, honestly */}
      <section className="lx-river" id="ain">
        <div className="lx-river-copy">
          <Headline text="Norðurá, up close." size={56} floor={30} measure={560} />
          <p className="lx-body lx-rv">{RIVER.claim} In season the salmon gather
            below the fall and jump it, and guests watch the attempts from the
            balcony.</p>
          <ul className="lx-river-notes lx-rv">
            <li>{RIVER.fishing}</li>
            <li>{RIVER.safety}</li>
            <li>{FACTS.winter}.</li>
          </ul>
        </div>
        <div className="lx-river-figs">
          <Frame photo={PHOTO.riverCanyon} drift={11} />
          <Frame photo={PHOTO.valleyTwilight} drift={13} />
        </div>
      </section>

      {/* 08 · guests — night quotes */}
      <section className="lx-guests" id="gestir" data-lx-dark>
        <div className="lx-guests-media">
          <img src={PHOTO.auroraLodge.src} srcSet={srcSet(PHOTO.auroraLodge.src)} sizes="100vw"
            alt={PHOTO.auroraLodge.alt} loading="lazy" decoding="async" />
        </div>
        <div className="lx-guests-inner">
          <p className="lx-guests-score lx-rv">
            Rated {HOST.rating.toFixed(1)} across {HOST.reviewCount} reviews ·
            Hosted by {HOST.name}, Superhost for {HOST.yearsHosting} years
          </p>
          <NightQuotes />
        </div>
      </section>

      {/* 09 · enquiry */}
      <section className="lx-book" id="boka">
        <div className="lx-book-copy">
          <Headline text="Ask for your nights." size={64} floor={32} measure={560} />
          <p className="lx-body lx-rv">
            Pick your dates and send a request straight to the host. She confirms
            availability and replies with the nightly price before anything is
            booked.
          </p>
          <div className="lx-owner-note lx-rv">
            <p className="lx-owner-note-label">The owner’s dashboard</p>
            <p className="lx-owner-note-body">
              Requests land in a simple dashboard made for this house.{' '}
              <Link className="lx-a" to="/preview/laxfoss/stjornbord">
                See how direct bookings would work
              </Link>
            </p>
          </div>
        </div>
        <BookingForm />
      </section>

      {/* page footer facts */}
      <footer className="lx-foot">
        <div className="lx-foot-grid">
          <div>
            <p className="lx-foot-mark">LAXFOSS</p>
            <p className="lx-foot-line">Norðurá, Borgarfjörður, West Iceland</p>
          </div>
          <div>
            <p className="lx-foot-line">Guests: {FACTS.guests} · {FACTS.bedrooms} bedrooms · {FACTS.baths}</p>
            <p className="lx-foot-line">{FACTS.sauna} · hot tub · {FACTS.winter.toLowerCase()}</p>
          </div>
          <div>
            <p className="lx-foot-line">
              Photography: the lodge’s own photographs, from laxfoss.org and the
              listing, retrieved August 2026.
            </p>
            <p className="lx-foot-line">
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
@font-face { font-family: 'General Sans'; src: url('${BASE}laxfoss/fonts/GeneralSans-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'General Sans'; src: url('${BASE}laxfoss/fonts/GeneralSans-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }

.lx-root {
  --u: min(calc(100vw / 1440), 1.15px);
  --lx-frost: ${FROST};
  --lx-ink: ${INK};
  --lx-night: ${NIGHT};
  --lx-mute: rgba(34, 48, 58, .68);
  --lx-hair: rgba(34, 48, 58, .14);
  background: var(--lx-frost); color: var(--lx-ink);
  font-family: ${SANS}; font-weight: 400;
  overflow-x: clip;
}
.lx-root *, .lx-root *::before, .lx-root *::after { box-sizing: border-box; }
.lx-root img { max-width: 100%; }
.lx-root :focus-visible { outline: 2px solid ${RIVER_A}; outline-offset: 2px; border-radius: 2px; }
.lx-root ::selection { background: ${RIVER_A}; color: #fff; }
.lx-root section { scroll-margin-top: clamp(88px, calc(var(--u) * 116), 136px); }

/* ── capsule nav ── */
.lx-nav {
  position: fixed; top: 14px; left: 50%; transform: translateX(-50%);
  z-index: 40; display: flex; align-items: center; gap: calc(var(--u) * 30);
  height: 54px; padding: 0 10px 0 22px; border-radius: 999px;
  background: rgba(238, 243, 245, .78);
  -webkit-backdrop-filter: blur(14px) saturate(150%); backdrop-filter: blur(14px) saturate(150%);
  border: 1px solid rgba(34, 48, 58, .1);
  transition: background .45s cubic-bezier(.23,1,.32,1), border-color .45s, color .45s;
  max-width: calc(100vw - 24px);
}
.lx-nav.is-dark {
  background: rgba(11, 27, 38, .6); color: ${NIGHT_INK};
  border-color: rgba(232, 238, 242, .14);
}
.lx-nav a { color: inherit; text-decoration: none; }
.lx-nav-mark { font-weight: 500; letter-spacing: .16em; font-size: 14px; }
.lx-nav-links { display: flex; gap: calc(var(--u) * 24); font-size: 14px; letter-spacing: .01em; }
.lx-nav-links a { opacity: .78; transition: opacity .2s; padding: 8px 0; }
.lx-nav-links a:hover { opacity: 1; }
.lx-nav a.lx-nav-cta {
  font-size: 13.5px; font-weight: 500; white-space: nowrap; color: #fff;
  padding: 9px 18px; border-radius: 999px;
  background: ${RIVER_A}; color: #fff;
  transition: filter .25s, transform .16s cubic-bezier(.23,1,.32,1);
}
.lx-nav-cta:hover { filter: brightness(1.08); }
.lx-nav-cta:active { transform: scale(.97); }

/* ── hero ── */
.lx-hero { position: relative; min-height: 100svh; display: grid; overflow: hidden; }
.lx-hero-media { position: absolute; inset: 0; }
.lx-hero-media img, .lx-hero-media video { width: 100%; height: 100%; object-fit: cover; display: block; }
.lx-hero-media::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(198deg, rgba(11,27,38,.12) 40%, rgba(11,27,38,.66) 100%);
}
.lx-wm {
  position: absolute; inset: 0; z-index: 2;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  margin: 0; pointer-events: none; color: #F4F8FA;
  font-weight: 500; letter-spacing: .1em;
  font-size: clamp(44px, 9.4vw, 148px); line-height: 1;
  text-shadow: 0 2px 46px rgba(11, 27, 38, .38);
}
.lx-wm-brink {
  display: block; width: min(52vw, 640px); height: 1px;
  background: currentColor; opacity: .8; margin-bottom: .3em;
  transform-origin: 50% 50%; will-change: transform, opacity;
}
.lx-wm-mask {
  display: flex; overflow: hidden;
  padding: .12em .06em .18em; margin: -.12em -.06em -.18em;
}
.lx-wm-letter { display: inline-block; will-change: transform; }
.lx-hero-block {
  position: relative; z-index: 1; align-self: end;
  padding: 0 calc(var(--u) * 48) calc(calc(var(--u) * 60) + env(safe-area-inset-bottom, 0px));
  color: #F4F8FA; max-width: calc(var(--u) * 860);
}
.lx-hero-sub { margin: 0; font-size: ${fluid(19, 16)}; line-height: 1.5; max-width: 44ch; }
.lx-hero-link {
  display: inline-block; margin-top: calc(var(--u) * 22); color: inherit;
  font-weight: 500; font-size: ${fluid(15, 14)}; text-decoration: none;
  padding-bottom: 4px; position: relative;
}
.lx-hero-link::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background: currentColor; transform-origin: left;
  transition: transform .45s cubic-bezier(.23,1,.32,1);
}
@media (hover: hover) and (pointer: fine) {
  .lx-hero-link:hover::after { transform: scaleX(.35); }
}

/* ── shared type ── */
.lx-headline {
  margin: 0; font-weight: 400; letter-spacing: -.028em;
  line-height: 1.08; text-wrap: balance;
}
.lx-line {
  display: inline-block; overflow: hidden; vertical-align: bottom;
  padding: .2em .04em .14em; margin: -.2em -.04em -.14em;
}
.lx-word { display: inline-block; }
.lx-body {
  font-size: ${fluid(17, 15)}; line-height: 1.62; color: var(--lx-mute);
  max-width: 56ch; margin: calc(var(--u) * 22) 0 0;
}
.lx-a { color: ${RIVER_A}; text-underline-offset: 3px; }
.lx-a:hover { color: var(--lx-ink); }

/* reveals: visible-by-default enhancement */
.lx-js .lx-rv { opacity: 1; }
.lx-rv:not(.lx-frame) { transition: opacity .9s ease, transform .9s cubic-bezier(.23,1,.32,1); }
.lx-root .lx-rv:not(.is-in):not(.lx-frame) { opacity: 0; transform: translateY(22px); }
.lx-root .lx-rv.is-in:not(.lx-frame) { opacity: 1; transform: none; }

/* drift frames */
.lx-frame {
  position: relative; overflow: hidden; margin: 0; border-radius: 4px;
  background: rgba(34, 48, 58, .07);
}
.lx-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; }
@media (min-width: 992px) { .lx-frame-in { will-change: transform; } }
.lx-frame-in img { width: 100%; height: 100%; max-width: none; object-fit: cover; display: block; }

/* ── manifesto ── */
.lx-manifesto {
  display: grid; grid-template-columns: 1.1fr .9fr; gap: calc(var(--u) * 72);
  align-items: center; max-width: calc(var(--u) * 1360);
  margin: 0 auto; padding: calc(var(--u) * 150) calc(var(--u) * 48);
}

/* ── the drop ── */
.lx-drop { position: relative; background: ${NIGHT}; color: ${NIGHT_INK}; }
.lx-drop-inner { position: relative; height: 100svh; overflow: hidden; display: grid; place-items: center; }
.lx-drop-media { position: absolute; inset: -16% 0; }
.lx-drop-img { width: 100%; height: 100%; object-fit: cover; display: block; will-change: transform; }
/* The station copy sits over whitewater, which is the brightest thing on the
   page. The old scrim was an edge vignette — lightest exactly where the text
   is — so white-on-white made the section read as broken. Two layers now: a
   soft dark pool under the copy (carries the type to ~5.9:1 over foam), and
   the original edge vignette behind it. */
.lx-drop-inner::after {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 64% 48% at center, rgba(6,18,26,.80) 0%, rgba(6,18,26,.56) 44%, rgba(6,18,26,0) 78%),
    radial-gradient(ellipse at center, rgba(11,27,38,.22) 34%, rgba(11,27,38,.66) 100%);
}
.lx-drop-station {
  position: absolute; z-index: 2; text-align: center; max-width: 46ch;
  padding: 0 24px;
}
.lx-drop-name {
  margin: 0 0 10px; font-weight: 500; font-size: ${fluid(30, 22)};
  letter-spacing: -.02em; color: #fff; text-shadow: 0 2px 22px rgba(6,18,26,.6);
}
.lx-drop-body {
  margin: 0; font-size: ${fluid(16, 14.5)}; line-height: 1.6;
  color: rgba(236,242,246,.94); text-shadow: 0 1px 18px rgba(6,18,26,.55);
}
/* no-JS / reduced-motion: stations flow under the image instead of hiding.
   No sticky, no overlap, nothing that depends on frames. */
@media (prefers-reduced-motion: reduce) {
  .lx-drop-inner { height: auto; display: block; }
  .lx-drop-media { position: relative; inset: auto; aspect-ratio: 3 / 2; }
  .lx-drop-inner::after { content: none; }
  .lx-drop-station { position: static; opacity: 1 !important; transform: none !important; visibility: visible !important; text-align: left; max-width: 56ch; padding: 28px 20px 0; }
  .lx-drop { padding-bottom: 48px; }
}

/* PHONE — the descent, translated rather than discarded.
   The old mobile fallback dropped the pin and left one big rapids photo with
   three headings stacked underneath it on flat navy: the copy lost its river
   and the section stopped meaning anything. Here the river is STICKY and the
   three stations scroll over it, one screen each, which is the desktop idea
   in pure CSS. No ScrollTrigger, no JS, nothing to starve on a phone. */
@media (max-width: 767px) and (prefers-reduced-motion: no-preference) {
  /* overflow MUST be cleared here: the desktop rule sets overflow:hidden on
     this element, and an overflow:hidden ancestor silently disables position
     sticky in a descendant. Measured symptom was the river scrolling straight
     off the top (top 0 to -2228) while the stations passed correctly. */
  .lx-drop-inner { height: auto; display: block; position: relative; overflow: visible; }
  .lx-drop-media {
    /* inset MUST come before top: it is the shorthand for all four sides, so
       declaring top first and inset:auto after resets top straight back to
       auto and the element never sticks. Computed style read top:auto until
       this was reordered. */
    position: sticky; inset: auto; top: 0; height: 100svh; z-index: 0;
  }
  .lx-drop-img { height: 100%; }
  .lx-drop-inner::after { content: none; }
  .lx-drop-station {
    position: relative; z-index: 2;
    opacity: 1 !important; visibility: visible !important; transform: none !important;
    min-height: 88svh; display: flex; flex-direction: column; justify-content: center;
    max-width: none; text-align: left; padding: 0 22px;
  }
  /* No negative margin to pull the first station up over the river. The
     sticky media only stays put for (container height - its own height), so
     stealing 100svh back would end the stick a station early and strand
     "The pool" on flat navy. Letting the river hold one screen on its own
     first also matches desktop, where the photograph is there before the
     first station fades in. */
  /* each station carries its own pool of shade, so the type stays legible
     wherever the whitewater happens to sit behind it */
  .lx-drop-station::before {
    content: ''; position: absolute; inset: -6% -22px; z-index: -1;
    background: radial-gradient(120% 68% at 50% 50%,
      rgba(6,18,26,.86) 0%, rgba(6,18,26,.66) 46%, rgba(6,18,26,0) 82%);
  }
  .lx-drop { padding-bottom: 0; }
}

/* ── history ── */
.lx-history {
  display: grid; grid-template-columns: .95fr 1.05fr; gap: calc(var(--u) * 72);
  align-items: center; max-width: calc(var(--u) * 1360);
  margin: 0 auto; padding: calc(var(--u) * 150) calc(var(--u) * 48) calc(var(--u) * 110);
}
.lx-facts { margin: calc(var(--u) * 30) 0 0; display: grid; gap: 12px; }
.lx-facts div { display: flex; gap: 16px; align-items: baseline; border-top: 1px solid var(--lx-hair); padding-top: 12px; }
.lx-facts dt { font-size: 12.5px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--lx-mute); min-width: 13ch; }
.lx-facts dd { margin: 0; font-size: ${fluid(15.5, 14)}; }

/* ── rooms ── */
.lx-rooms { max-width: calc(var(--u) * 1360); margin: 0 auto; padding: calc(var(--u) * 40) calc(var(--u) * 48) calc(var(--u) * 130); }
.lx-rooms-head { max-width: calc(var(--u) * 640); }
.lx-rooms-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: calc(var(--u) * 64); margin-top: calc(var(--u) * 56); align-items: start; }
.lx-rooms-list { list-style: none; margin: 0; padding: 0; }
.lx-rooms-list li { display: grid; gap: 4px; padding: 18px 0; border-top: 1px solid var(--lx-hair); }
.lx-room-name { font-weight: 500; font-size: ${fluid(19, 16)}; letter-spacing: -.01em; }
.lx-room-line { font-size: ${fluid(14.5, 13.5)}; color: var(--lx-mute); }
.lx-rooms-figs { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 20); }
.lx-rooms-band { display: grid; grid-template-columns: 1.2fr 1fr .7fr; gap: calc(var(--u) * 20); margin-top: calc(var(--u) * 20); }

/* ── sauna (night) ── */
.lx-sauna {
  position: relative; background: ${NIGHT}; color: ${NIGHT_INK};
  padding: calc(var(--u) * 130) calc(var(--u) * 48);
}
.lx-sauna .lx-body { color: rgba(232, 238, 242, .78); }
.lx-sauna-bleed { max-width: calc(var(--u) * 1360); margin: 0 auto; }
.lx-sauna-copy { max-width: calc(var(--u) * 640); margin: calc(var(--u) * 64) auto 0; }
.lx-sauna-quote {
  margin: calc(var(--u) * 30) 0 0; font-size: ${fluid(19, 16)}; line-height: 1.5;
  color: ${GLACIAL};
}
.lx-sauna-quote span { display: block; margin-top: 8px; font-size: ${fluid(13.5, 12.5)}; color: rgba(232,238,242,.6); }
.lx-sauna-figs {
  display: grid; grid-template-columns: 1.35fr 1fr; gap: calc(var(--u) * 20);
  max-width: calc(var(--u) * 1360); margin: calc(var(--u) * 64) auto 0;
}

/* ── river ── */
.lx-river {
  display: grid; grid-template-columns: .9fr 1.1fr; gap: calc(var(--u) * 72);
  max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 150) calc(var(--u) * 48);
  align-items: center;
}
.lx-river-notes { margin: calc(var(--u) * 28) 0 0; padding: 0; list-style: none; display: grid; gap: 12px; }
.lx-river-notes li {
  font-size: ${fluid(14.5, 13.5)}; line-height: 1.6; color: var(--lx-mute);
  border-top: 1px solid var(--lx-hair); padding-top: 12px;
}
.lx-river-figs { display: grid; gap: calc(var(--u) * 20); }

/* ── guests / night quotes ── */
.lx-guests { position: relative; min-height: 88svh; display: grid; align-items: end; overflow: hidden; }
.lx-guests-media { position: absolute; inset: 0; }
.lx-guests-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.lx-guests-media::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(12deg, rgba(11,27,38,.82) 12%, rgba(11,27,38,.15) 62%);
}
.lx-guests-inner {
  position: relative; z-index: 1; color: ${NIGHT_INK};
  padding: calc(var(--u) * 120) calc(var(--u) * 48) calc(var(--u) * 80);
  max-width: calc(var(--u) * 900);
}
.lx-guests-score { margin: 0 0 calc(var(--u) * 26); font-size: ${fluid(14, 13)}; letter-spacing: .04em; color: rgba(232,238,242,.82); }
.lx-nightquotes { position: relative; min-height: 9.5em; }
.lx-nq { position: absolute; inset: 0; margin: 0; opacity: 0; transition: opacity 1.1s ease; pointer-events: none; }
.lx-nq.is-on { opacity: 1; pointer-events: auto; }
.lx-nq p { margin: 0; font-size: ${fluid(30, 20)}; line-height: 1.32; letter-spacing: -.015em; max-width: 26ch; color: #fff; }
.lx-nq cite { display: block; margin-top: 14px; font-style: normal; font-size: ${fluid(14, 13)}; color: ${GLACIAL}; }
.lx-nq-dots { position: absolute; bottom: -34px; left: 2px; display: flex; gap: 10px; }
.lx-nq-dot {
  width: 26px; height: 3px; border: 0; border-radius: 2px; padding: 0; cursor: pointer;
  background: rgba(232, 238, 242, .3); transition: background .3s;
}
.lx-nq-dot.is-on { background: ${GLACIAL}; }

/* ── booking ── */
.lx-book {
  display: grid; grid-template-columns: .9fr 1.1fr; gap: calc(var(--u) * 88);
  max-width: calc(var(--u) * 1300); margin: 0 auto;
  padding: calc(var(--u) * 150) calc(var(--u) * 48) calc(var(--u) * 120);
}
.lx-owner-note { margin-top: calc(var(--u) * 40); border-top: 1px solid var(--lx-hair); padding-top: 20px; }
.lx-owner-note-label { margin: 0 0 6px; font-size: 12.5px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--lx-mute); }
.lx-owner-note-body { margin: 0; font-size: ${fluid(15, 14)}; line-height: 1.6; color: var(--lx-mute); }
.lx-fields { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.lx-field { display: grid; gap: 7px; }
.lx-field-wide { grid-column: 1 / -1; }
.lx-field-label { font-size: 12.5px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--lx-mute); }
.lx-optional { text-transform: none; letter-spacing: 0; font-weight: 400; }
.lx-field input, .lx-field select, .lx-field textarea {
  font: inherit; font-size: 15px; color: var(--lx-ink);
  background: #fff; border: 1px solid rgba(34, 48, 58, .22); border-radius: 4px;
  padding: 12px 12px; width: 100%; min-height: 46px;
}
.lx-field textarea { resize: vertical; }
.lx-field input:focus, .lx-field select:focus, .lx-field textarea:focus { border-color: ${RIVER_A}; outline: none; box-shadow: 0 0 0 3px rgba(51, 104, 138, .18); }
.lx-field-error { margin: 14px 0 0; color: #A33B22; font-size: 14px; }
.lx-cta {
  margin-top: 22px; font: inherit; font-size: 15px; font-weight: 500; cursor: pointer;
  background: ${RIVER_A}; color: #fff; border: 0; border-radius: 999px;
  padding: 14px 28px; min-height: 48px;
  transition: filter .25s, transform .16s cubic-bezier(.23,1,.32,1);
}
.lx-cta:hover { filter: brightness(1.08); }
.lx-cta:active { transform: scale(.97); }
.lx-book-note { margin: 16px 0 0; font-size: ${fluid(13.5, 12.5)}; line-height: 1.6; color: var(--lx-mute); max-width: 48ch; }
.lx-book-done { border: 1px solid var(--lx-hair); border-radius: 6px; padding: calc(var(--u) * 40); background: #fff; }
.lx-book-done-title { margin: 0; font-size: ${fluid(24, 19)}; font-weight: 500; letter-spacing: -.015em; }
.lx-ghost {
  font: inherit; font-size: inherit; color: ${RIVER_A}; background: none; border: 0;
  padding: 0; cursor: pointer; text-decoration: underline; text-underline-offset: 3px;
}
.lx-ghost:hover { color: var(--lx-ink); }

/* ── footer ── */
.lx-foot { border-top: 1px solid var(--lx-hair); }
.lx-foot-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 48);
  max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 56) calc(var(--u) * 48) calc(var(--u) * 72);
}
.lx-foot-mark { font-weight: 500; letter-spacing: .18em; font-size: ${fluid(14, 13)}; margin: 0 0 calc(var(--u) * 12); }
.lx-foot-line { font-size: ${fluid(13.5, 13)}; line-height: 1.6; color: var(--lx-mute); margin: 0 0 calc(var(--u) * 8); }

/* ── loader ── */
.lx-loader {
  position: fixed; inset: 0; z-index: 60; background: ${NIGHT};
  display: grid; place-content: center;
  transition: transform .95s cubic-bezier(.76, 0, .24, 1);
}
.lx-loader.is-leaving { transform: translateY(100%); }
.lx-loader-center { display: grid; place-items: center; gap: 26px; }
.lx-loader-ring {
  width: 54px; height: 54px; border-radius: 50%;
  background: conic-gradient(${GLACIAL} calc(var(--p, 0) * 1%), rgba(232, 238, 242, .16) 0);
  -webkit-mask: radial-gradient(closest-side, transparent 64%, #000 65%);
  mask: radial-gradient(closest-side, transparent 64%, #000 65%);
}
.lx-loader-mark {
  margin: 0; font-weight: 500; letter-spacing: .16em;
  font-size: clamp(30px, 6.6vw, 92px); white-space: nowrap; line-height: 1;
  background-image: linear-gradient(90deg, #EDF3F6 50%, rgba(237, 243, 246, .18) 50%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.lx-loader-pct {
  position: fixed; left: calc(var(--u) * 48); bottom: calc(var(--u) * 40);
  margin: 0; font-size: 12px; font-weight: 500; letter-spacing: .16em;
  color: rgba(232, 238, 242, .6);
}

/* ── responsive ── */
@media (max-width: 991px) {
  .lx-nav { gap: 16px; padding: 0 8px 0 18px; height: 50px; }
  .lx-nav-links { display: none; }
  .lx-manifesto, .lx-history, .lx-river, .lx-book { grid-template-columns: 1fr; gap: 44px; padding-left: 20px; padding-right: 20px; }
  .lx-rooms { padding-left: 20px; padding-right: 20px; }
  .lx-rooms-grid { grid-template-columns: 1fr; gap: 40px; }
  .lx-rooms-band { grid-template-columns: 1fr 1fr; }
  .lx-rooms-band .lx-frame:last-child { display: none; }
  .lx-sauna { padding-left: 20px; padding-right: 20px; }
  .lx-sauna-figs { grid-template-columns: 1fr; }
  .lx-guests-inner { padding-left: 20px; padding-right: 20px; }
  .lx-hero-block { padding-left: 20px; padding-right: 40px; }
  .lx-foot-grid { grid-template-columns: 1fr; padding-left: 20px; padding-right: 20px; gap: 24px; }
  .lx-fields { grid-template-columns: 1fr 1fr; }
  .lx-nav-cta { font-size: 12.5px; padding: 8px 14px; }
}
@media (max-width: 519px) {
  .lx-fields { grid-template-columns: 1fr; }
  .lx-wm { font-size: clamp(38px, 12.5vw, 64px); }
}

/* ── reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .lx-root * { transition: none !important; animation: none !important; }
  .lx-word { transform: none !important; opacity: 1 !important; }
  .lx-wm-letter { transform: none !important; }
  .lx-wm-brink { transform: none !important; opacity: .8 !important; }
  .lx-rv { opacity: 1 !important; transform: none !important; }
  .lx-frame-in { inset: 0; transform: none !important; }
  .lx-nq { transition: none; }
}
`
