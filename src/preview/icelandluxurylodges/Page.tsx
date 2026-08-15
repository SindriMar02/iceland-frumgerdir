import { useEffect, useRef, useState } from 'react'
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, ADDRESS, INSTAGRAM, FACEBOOK,
  NAV, HERO, STATEMENT, DOORS, CHAPTERS, FOURTH_KEY, QUOTE, BOOKING, JSON_LD,
} from './data'

const company = companyEntry

/* ── „Húsin við vötnin" — the houses on the lakes. ──────────────────────────
   One owner, four keys, two lakes. The page is built on THE WATERLINE:
   every estate photograph stands above its own live reflection, separated
   by a 1px seam. The reflection is real CSS (scaleY(-1) + mask + blur) and
   drifts in counter-phase with its source in the shared rAF loop, so the
   whole page reads as still water. Landing forks into full-height doors
   per house (umbrella-multi-property template), each opening a chapter.
   Engine: vanilla — ONE rAF loop, IntersectionObserver reveals, CSS sticky.
   No GSAP, no Lenis. ─────────────────────────────────────────────────────── */

/* Palette — cold water, computed contrast:
   INK #0E161D on ICE #EFF3F5 ......... 15.6:1 AAA
   DUSK #41607A on ICE ................ 5.6:1 AA (small-text safe)
   ICE on INK ......................... 15.6:1 AAA
   DUSK_SOFT large/decorative only. */
const ICE = '#EFF3F5'
const INK = '#0E161D'
const DUSK = '#41607A'

const SEEN_KEY = 'ill_seen'

type DriftKind = 'img' | 'refl' | 'text'
interface DriftNode { el: HTMLElement; d: number; kind: DriftKind }

/* module-scope so all frames share ONE loop (heklusyn spec) */
const driftSet = new Set<DriftNode>()
let rafId = 0
let reduced = false

function driftLoop() {
  rafId = 0
  if (!driftSet.size) return
  const vh = window.innerHeight
  /* read pass */
  const reads: { n: DriftNode; p: number; vis: boolean }[] = []
  driftSet.forEach((n) => {
    const r = n.el.getBoundingClientRect()
    const vis = r.bottom > -80 && r.top < vh + 80
    const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
    reads.push({ n, p, vis })
  })
  /* write pass */
  for (const { n, p, vis } of reads) {
    if (!vis) continue
    const dir = n.kind === 'refl' ? 1 : -1
    n.el.style.transform = `translate3d(0, ${(dir * -p * n.d).toFixed(3)}%, 0)`
  }
  rafId = requestAnimationFrame(driftLoop)
}
function armDrift(el: HTMLElement | null, d: number, kind: DriftKind) {
  if (!el || reduced) return () => {}
  const node: DriftNode = { el, d, kind }
  driftSet.add(node)
  if (!rafId) rafId = requestAnimationFrame(driftLoop)
  return () => {
    driftSet.delete(node)
    el.style.transform = ''
  }
}

/* ── Full-bleed stage: the photograph, optionally alive as film ──────────
   (The mirrored-reflection strip this used to carry is gone: a flipped,
   blurred copy of a landscape photo is not a reflection, it is a smear —
   it read as a rendering fault rather than water.) ────────────────────── */
function Stage({
  src, alt, drift = 9, className = '', priority = false, videoSrc,
}: {
  src: string; alt: string; drift?: number; className?: string; priority?: boolean; videoSrc?: string
}) {
  const imgRef = useRef<HTMLDivElement>(null)
  const [film, setFilm] = useState(false)
  useEffect(() => armDrift(imgRef.current, drift, 'img'), [drift])
  useEffect(() => {
    if (!videoSrc || reduced) return
    const con = (navigator as { connection?: { saveData?: boolean } }).connection
    if (con?.saveData) return
    setFilm(true)
  }, [videoSrc])
  const dz = Math.max(9, drift * 1.35)
  return (
    <figure className={`ill-stage ${className}`}>
      <div className="ill-stage-frame" style={{ ['--dz' as string]: `${dz}%` }}>
        <div className="ill-stage-in" ref={imgRef}>
          <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
          {film && (
            <video
              className="ill-stage-film"
              src={videoSrc}
              poster={src}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </figure>
  )
}

/* ── Drift frame without reflection (chapter collages) ──────────────────── */
function Frame({ src, alt, drift = 10, wide = false }: { src: string; alt: string; drift?: number; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => armDrift(ref.current, drift, 'img'), [drift])
  const dz = Math.max(9, drift * 1.35)
  return (
    <figure className={`ill-frame ${wide ? 'is-wide' : ''}`} style={{ ['--dz' as string]: `${dz}%` }}>
      <div className="ill-stage-in" ref={ref}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </figure>
  )
}

/* ── THE WALKTHROUGH ──────────────────────────────────────────────────────
   A pinned band where SCROLL walks you through the lodge: a pre-decoded JPEG
   frame sequence blitted to a canvas, the scroll position picking the frame.
   The camera moves exactly as far as you push it and stops when you stop.
   (Not a <video>: driving currentTime is a decoder seek per frame and cannot
   be smooth — measured on Mirror House at 104 of 241 frames. And an
   autoplaying video is not a walkthrough at all, it is a video.)
   Loader is the hardened Mirror House one: unconditional from a mount
   effect, decode() before a frame counts, 14-wide pump, nearest-loaded
   fallback so a partial load still animates, still drawn until the first
   frame decodes, and canvas.dataset.frame exposed for the QA probe. ────── */
const WALK_FRAMES = 121

function Walkthrough({ still, label, lead }: { still: string; label: string; lead: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stillRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas || reduced) return
    const small = window.matchMedia('(max-width: 767px)').matches
    const dir = small ? 'walk-lodge-sm' : 'walk-lodge'
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const imgs: (HTMLImageElement | null)[] = new Array(WALK_FRAMES).fill(null)
    let shown = -1
    let wanted = 0
    let stopped = false

    const sizeCanvas = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
    }
    const blit = (im: CanvasImageSource, iw: number, ih: number) => {
      const cw = canvas.width; const ch = canvas.height
      const s = Math.max(cw / iw, ch / ih)
      const w = iw * s; const h = ih * s
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h)
    }
    const paint = (idx: number) => {
      let i = idx
      if (!imgs[i]) {
        let d = 1
        while (d < WALK_FRAMES) {
          if (imgs[Math.max(0, i - d)]) { i = Math.max(0, i - d); break }
          if (imgs[Math.min(WALK_FRAMES - 1, i + d)]) { i = Math.min(WALK_FRAMES - 1, i + d); break }
          d += 1
        }
      }
      const im = imgs[i]
      if (im) { blit(im, im.naturalWidth, im.naturalHeight); shown = i; canvas.dataset.frame = String(i) }
      else {
        const st = stillRef.current
        if (st?.complete && st.naturalWidth) blit(st, st.naturalWidth, st.naturalHeight)
      }
    }
    const src = (n: number) =>
      `${import.meta.env.BASE_URL}icelandluxurylodges/${dir}/f${String(n + 1).padStart(3, '0')}.jpg`
    let next = 0
    const pump = () => {
      if (stopped || next >= WALK_FRAMES) return
      const n = next++
      const im = new Image()
      im.src = src(n)
      const done = () => {
        if (stopped) return
        imgs[n] = im
        if (shown < 0 || Math.abs(n - wanted) < 2) paint(wanted)
        pump()
      }
      im.decode().then(done).catch(() => { im.onload = done; im.onerror = () => pump() })
    }
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = wrap.getBoundingClientRect()
        const total = r.height - window.innerHeight
        if (total <= 0) return
        const p = Math.min(1, Math.max(0, -r.top / total))
        const idx = Math.min(WALK_FRAMES - 1, Math.round(p * (WALK_FRAMES - 1)))
        if (idx !== shown) { wanted = idx; paint(idx) }
      })
    }
    sizeCanvas(); onScroll()
    const kick = window.setTimeout(() => { for (let k = 0; k < 14; k++) pump() }, 700)
    const onResize = () => { sizeCanvas(); paint(wanted) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      stopped = true
      window.clearTimeout(kick)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="ill-walk" ref={wrapRef} aria-label={label}>
      <div className="ill-walk-sticky">
        <img ref={stillRef} className="ill-walk-still" src={still} alt={label} loading="lazy" decoding="async" />
        <canvas ref={canvasRef} className="ill-walk-canvas" aria-hidden="true" />
        <div className="ill-walk-copy">
          <span className="ill-walk-label">{label}</span>
          <p className="ill-walk-lead">{lead}</p>
        </div>
      </div>
    </section>
  )
}

/* ── Mask-reveal text helpers ───────────────────────────────────────────── */
function Rise({ as: Tag = 'div', className = '', children }: { as?: 'div' | 'h2' | 'h3' | 'p' | 'span'; className?: string; children: React.ReactNode }) {
  return (
    <Tag className={`ill-rise ${className}`}>
      <span className="ill-rise-in">{children}</span>
    </Tag>
  )
}

/* ── Preloader — real progress, Heklusýn spec ───────────────────────────── */
function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const doneRef = useRef(false)
  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    let real = 0
    const imgs = Array.from(document.images)
    const total = Math.max(1, imgs.length)
    let loaded = imgs.filter((i) => i.complete).length
    const onOne = () => { loaded += 1 }
    imgs.forEach((i) => { if (!i.complete) { i.addEventListener('load', onOne); i.addEventListener('error', onOne) } })
    const tick = () => {
      const el = performance.now() - t0
      real = Math.max(real, Math.min(1, loaded / total))
      const floorP = Math.min(1, el / 1100)
      const capP = el / 2400
      const p = Math.min(1, Math.max(capP, Math.min(real, floorP)))
      setPct(Math.round(p * 100))
      if (p >= 1 && !doneRef.current) {
        doneRef.current = true
        window.setTimeout(() => {
          onDone()
          window.dispatchEvent(new CustomEvent('ill:revealed'))
        }, 240)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])
  return (
    <div className="ill-loader" role="status" aria-label="Loading">
      <div className="ill-loader-mark" style={{ ['--p' as string]: `${100 - pct}%` }}>
        <span>Iceland</span>
        <span>Luxury Lodges</span>
      </div>
      <div className="ill-loader-line" aria-hidden="true" />
    </div>
  )
}

/* ── Booking demo (request-to-book, localStorage, no card) ──────────────── */
function BookingForm() {
  const [sent, setSent] = useState(false)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const rec = Object.fromEntries(fd.entries())
    try {
      const key = 'ill_demo_requests'
      const prev = JSON.parse(localStorage.getItem(key) || '[]')
      prev.push({ ...rec, at: new Date().toISOString() })
      localStorage.setItem(key, JSON.stringify(prev))
    } catch { /* storage may throw in private mode — the demo still succeeds */ }
    setSent(true)
  }
  if (sent) {
    return (
      <div className="ill-book-done" role="status">
        <div className="ill-book-done-seam" aria-hidden="true" />
        <p>{BOOKING.success}</p>
      </div>
    )
  }
  return (
    <form className="ill-book-form" onSubmit={onSubmit}>
      <div className="ill-field">
        <label htmlFor="ill-house">House</label>
        <select id="ill-house" name="house" required defaultValue={BOOKING.properties[0]}>
          {BOOKING.properties.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="ill-field-row">
        <div className="ill-field">
          <label htmlFor="ill-in">Arrival</label>
          <input id="ill-in" name="arrival" type="date" required />
        </div>
        <div className="ill-field">
          <label htmlFor="ill-out">Departure</label>
          <input id="ill-out" name="departure" type="date" required />
        </div>
        <div className="ill-field">
          <label htmlFor="ill-guests">Guests</label>
          <input id="ill-guests" name="guests" type="number" min="1" max="19" defaultValue="4" required />
        </div>
      </div>
      <div className="ill-field-row is-two">
        <div className="ill-field">
          <label htmlFor="ill-name">Name</label>
          <input id="ill-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="ill-field">
          <label htmlFor="ill-email">Email</label>
          <input id="ill-email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>
      <button className="ill-cta" type="submit">Send the enquiry</button>
      <p className="ill-book-note">Demo prototype: the enquiry is stored only in this browser.</p>
    </form>
  )
}

/* ═════════════════════════════ PAGE ═════════════════════════════════════ */
export default function Page() {
  const [booted, setBooted] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const seamRef = useRef<HTMLSpanElement>(null)
  const wmLRef = useRef<HTMLSpanElement>(null)
  const wmRRef = useRef<HTMLSpanElement>(null)

  /* ── THE SEAM REVEAL ([[mirrorhouse-design-system]] device 2, ported to
       vanilla). The hairline draws itself, then ICELAND opens leftward out
       of it and LUXURY LODGES rightward, with a breath of outward travel
       under the wipe so the words feel pushed out of the line rather than
       merely uncovered. Scroll then keeps parting them while the rule grows
       past them. Chains off the loader event, never a guessed delay. ── */
  useEffect(() => {
    const seam = seamRef.current
    const wmL = wmLRef.current
    const wmR = wmRRef.current
    const hero = heroRef.current
    if (!seam || !wmL || !wmR || !hero) return
    if (reduced) {
      seam.style.transform = 'scaleY(1)'
      wmL.style.clipPath = 'inset(0)'
      wmR.style.clipPath = 'inset(0)'
      return
    }
    /* resting (pre-reveal) state */
    seam.style.transform = 'scaleY(0)'
    wmL.style.clipPath = 'inset(0% 0% 0% 100%)'
    wmR.style.clipPath = 'inset(0% 100% 0% 0%)'

    /* JS is the SINGLE writer of transform on all three nodes. The reveal
       transitions it, then hands ownership to the scroll driver — a CSS
       var-based transform alongside an inline one silently loses. */
    let revealDone = false
    const open = () => {
      seam.style.transition = 'transform .85s cubic-bezier(.16,1,.3,1)'
      seam.style.transform = 'scaleY(1)'
      window.setTimeout(() => {
        for (const [el, from] of [[wmL, 26], [wmR, -26]] as const) {
          el.style.transition = 'clip-path 1.5s cubic-bezier(.16,1,.3,1), transform 1.5s cubic-bezier(.16,1,.3,1)'
          el.style.transform = `translateX(${from}px)`
          requestAnimationFrame(() => {
            el.style.clipPath = 'inset(0% 0% 0% 0%)'
            el.style.transform = 'translateX(0px)'
          })
        }
        /* release the transitions so the scroll driver writes land instantly */
        window.setTimeout(() => {
          revealDone = true
          seam.style.transition = ''
          wmL.style.transition = ''
          wmR.style.transition = ''
          onScroll()
        }, 1560)
      }, 430)
    }
    window.addEventListener('ill:revealed', open, { once: true })

    /* scroll keeps parting the halves; the seam grows past them and fades */
    let raf = 0
    function onScroll() {
      if (raf || !revealDone) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = hero!.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)))
        wmL!.style.transform = `translateX(${(-14 * p).toFixed(2)}%)`
        wmR!.style.transform = `translateX(${(14 * p).toFixed(2)}%)`
        wmL!.style.opacity = wmR!.style.opacity = `${(1 - p * 0.92).toFixed(3)}`
        seam!.style.transform = `scaleY(${(1 + p * 2.4).toFixed(3)})`
        seam!.style.opacity = `${(1 - p).toFixed(3)}`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('ill:revealed', open)
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
    /* mount-once: re-running this on `booted` would re-arm the hidden resting
       state AFTER the reveal had already played, blanking the wordmark. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* boot: loader decision + reveal wiring */
  useEffect(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setThemeColor(ICE)
    document.title = 'Iceland Luxury Lodges — Four private houses on the lakes of the Golden Circle'
    const forced = new URLSearchParams(window.location.search).has('loader')
    let seen = false
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1' } catch { seen = true }
    if (!reduced && (forced || !seen)) {
      setShowLoader(true)
      try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    } else {
      setBooted(true)
      window.setTimeout(() => window.dispatchEvent(new CustomEvent('ill:revealed')), 60)
    }
  }, [])

  /* reveals: IO arms .is-on; resting CSS state is the visible one without .js */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.classList.add('js')
    if (reduced) { root.classList.add('reduced'); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-on'); io.unobserve(en.target) }
      }),
      { threshold: 0.22 },
    )
    root.querySelectorAll('.ill-rise, .ill-rule, .ill-door, .ill-fact, .ill-amen li, .ill-frame').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [booted])

  /* hero words chain off the loader event, never a guessed delay */
  useEffect(() => {
    const onReveal = () => rootRef.current?.classList.add('is-revealed')
    window.addEventListener('ill:revealed', onReveal)
    return () => window.removeEventListener('ill:revealed', onReveal)
  }, [])

  /* nav: smooth anchor scroll (native; no Lenis on this page) */
  /* the nav swaps register at the foot of the hero instead of inverting */
  useEffect(() => {
    const nav = rootRef.current?.querySelector('.ill-nav')
    const hero = heroRef.current
    if (!nav || !hero) return
    const io = new IntersectionObserver(
      ([en]) => nav.classList.toggle('is-past', !en.isIntersecting),
      { rootMargin: '-72px 0px 0px 0px', threshold: 0 },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="ill-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {showLoader && !booted && <Preloader onDone={() => setBooted(true)} />}

      {/* ── chrome ── */}
      <header className="ill-nav">
        <a className="ill-nav-mark" href="#top" onClick={goTo('top')}>
          <span>Iceland</span> <span>Luxury Lodges</span>
        </a>
        <nav className="ill-nav-links" aria-label="Sections">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={goTo(n.id)}>{n.label}</a>
          ))}
        </nav>
        <button
          className={`ill-burger ${menuOpen ? 'is-x' : ''}`}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <i /><i />
        </button>
      </header>
      <div className={`ill-sheet ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} style={{ transitionDelay: `${80 + i * 55}ms` }}
            onClick={(e) => { setMenuOpen(false); goTo(n.id)(e) }}>
            {n.label}
          </a>
        ))}
      </div>

      <main id="top">
        {/* ── HERO: the seam-reveal lockup over the living terrace ──
             ICELAND | LUXURY LODGES parted by a hairline (mirrorhouse spec). */}
        <section className="ill-hero" ref={heroRef}>
          <Stage src={IMG.heroEstate} videoSrc={`${import.meta.env.BASE_URL}icelandluxurylodges/hero-film.mp4`} alt="The infinity pool on the terrace above the lake, mountains across the water" drift={7} className="is-hero" priority />
          <h1 className="ill-wordmark" aria-label={HERO.word}>
            <span className="ill-wm-word ill-wm-l" ref={wmLRef}>Iceland</span>
            <span className="ill-wm-seam" aria-hidden="true" ref={seamRef} />
            <span className="ill-wm-word ill-wm-r" ref={wmRRef}>Luxury Lodges</span>
          </h1>
          <p className="ill-hero-sub">
            <span className="ill-hero-sub-in">{HERO.sub}</span>
          </p>
        </section>

        {/* ── statement ── */}
        <section className="ill-statement">
          <Rise as="h2" className="ill-statement-lead">{STATEMENT.lead}</Rise>
          <Rise as="p" className="ill-statement-body">{STATEMENT.body}</Rise>
        </section>

        {/* ── THE FORK: doors ── */}
        <section className="ill-doors" id="husin" aria-label="The houses">
          {DOORS.map((d, i) => (
            <a className="ill-door" key={d.id} href={`#${d.id}`} onClick={goTo(d.id)} style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="ill-door-media">
                <img src={IMG[d.img as keyof typeof IMG]} alt={d.alt} loading="lazy" decoding="async" />
              </div>
              <div className="ill-door-copy">
                <span className="ill-door-kind">{d.kind}</span>
                <span className="ill-door-name">{d.name}</span>
                <span className="ill-door-sleeps">{d.sleeps}</span>
              </div>
            </a>
          ))}
        </section>

        {/* ── chapters ── */}
        {CHAPTERS.map((c) => (
          <section className="ill-chapter" id={c.id} key={c.id}>
            <header className="ill-chapter-head">
              <div className="ill-chapter-ord" aria-hidden="true">{c.ord}</div>
              <div>
                <Rise as="h2" className="ill-chapter-name">{c.name}</Rise>
                <Rise as="p" className="ill-chapter-water">{c.water}</Rise>
              </div>
            </header>
            <div className="ill-chapter-grid">
              <div className="ill-chapter-copy">
                <Rise as="h3" className="ill-chapter-lead">{c.lead}</Rise>
                <Rise as="p" className="ill-chapter-body">{c.body}</Rise>
                <div className="ill-facts" role="list">
                  {c.facts.map((f) => (
                    <div className="ill-fact" role="listitem" key={f.l}>
                      <span className="ill-fact-n">{f.n}</span>
                      <span className="ill-fact-l">{f.l}</span>
                    </div>
                  ))}
                </div>
                <ul className="ill-amen">
                  {c.amenities.map((a) => <li key={a}>{a}</li>)}
                </ul>
                {c.chip && (
                  <p className="ill-chip">
                    <strong>{c.chip.score}</strong>
                    <span>{c.chip.source}</span>
                  </p>
                )}
              </div>
              <div className="ill-chapter-photos">
                {c.photos.map((p) => (
                  <Frame key={p.img} src={IMG[p.img]} alt={p.alt} wide={p.wide} drift={p.wide ? 12 : 9} />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── THE WALKTHROUGH: scroll walks the lodge ── */}
        <Walkthrough
          still={IMG.lodgeWide}
          label="Walk through Úlfljótsskáli"
          lead="Past the bar, through the hall, into the rooms. Scroll to walk."
        />

        {/* ── fourth key: honest text card, no photo exists ── */}
        <section className="ill-fourth">
          <div className="ill-fourth-card">
            <Rise as="h2" className="ill-fourth-name">{FOURTH_KEY.name}</Rise>
            <Rise as="p" className="ill-fourth-place">{FOURTH_KEY.place}</Rise>
            <Rise as="p" className="ill-fourth-body">{FOURTH_KEY.body}</Rise>
          </div>
        </section>

        {/* ── quote ── */}
        <section className="ill-quote">
          <Rise as="p" className="ill-quote-text">“{QUOTE.text}”</Rise>
          <Rise as="p" className="ill-quote-meta">{QUOTE.name} · {QUOTE.meta}</Rise>
        </section>

        {/* ── request-to-book ── */}
        <section className="ill-book" id="bokun">
          <div className="ill-book-copy">
            <Rise as="h2">{BOOKING.title}</Rise>
            <Rise as="p">{BOOKING.body}</Rise>
          </div>
          <BookingForm />
        </section>

        {/* ── footer ── */}
        <footer className="ill-footer">
          <Stage src={IMG.lodgeExterior} alt="Úlfljótsskáli at dusk" drift={6} className="is-footer" />
          <div className="ill-footer-grid">
            <div className="ill-footer-word" aria-hidden="true">Sjáumst við vatnið</div>
            <dl className="ill-footer-dl">
              <div><dt>Email</dt><dd><a href={EMAIL_HREF}>{EMAIL}</a></dd></div>
              <div><dt>Phone</dt><dd><a href={PHONE_HREF}>{PHONE_DISPLAY}</a></dd></div>
              <div><dt>Address</dt><dd>{ADDRESS}</dd></div>
              <div><dt>Follow</dt><dd><a href={INSTAGRAM} rel="noreferrer" target="_blank">Instagram</a> · <a href={FACEBOOK} rel="noreferrer" target="_blank">Facebook</a></dd></div>
            </dl>
          </div>
          <PreviewFooter company={company} />
        </footer>
      </main>
      <PreviewChrome company={company} />
    </div>
  )
}

/* ═════════════════════════════ STYLES ═══════════════════════════════════ */
const STYLES = `
@font-face{font-family:'Gambarino';src:url('${import.meta.env.BASE_URL}fonts/gambarino/Gambarino-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('${import.meta.env.BASE_URL}fonts/switzer/Switzer-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('${import.meta.env.BASE_URL}fonts/switzer/Switzer-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('${import.meta.env.BASE_URL}fonts/switzer/Switzer-Medium.woff2') format('woff2');font-weight:500;font-display:swap}

.ill-root{
  --ice:${ICE}; --ink:${INK}; --dusk:${DUSK};
  --ink-soft:rgba(14,22,29,.78); --ink-mute:rgba(14,22,29,.6);
  --ice-soft:rgba(239,243,245,.85); --ice-mute:rgba(239,243,245,.6);
  --hair:rgba(14,22,29,.14); --hair-ice:rgba(239,243,245,.2);
  --serif:'Gambarino','Cormorant Garamond',Georgia,serif;
  --sans:'SwitzerIll','Helvetica Neue',Arial,sans-serif;
  --e:cubic-bezier(.22,.9,.28,1);
  background:var(--ice); color:var(--ink);
  font-family:var(--sans); font-weight:300; line-height:1.6;
  overflow-x:clip;
}
.ill-root *{box-sizing:border-box;margin:0}
.ill-root img{display:block;width:100%;height:100%;object-fit:cover}
.ill-root a{color:inherit;text-decoration:none}
.ill-root :focus-visible{outline:2px solid var(--dusk);outline-offset:3px}
.ill-root button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}

/* ── loader ── */
.ill-loader{position:fixed;inset:0;z-index:80;background:var(--ice);display:grid;place-content:center;gap:18px;text-align:center}
.ill-loader-mark{font-family:var(--serif);font-size:clamp(1.6rem,4.6vw,3rem);line-height:1.14;letter-spacing:.01em;display:grid;
  background:linear-gradient(90deg,var(--ink) 50%,rgba(14,22,29,.22) 50%);background-size:200% 100%;background-position-x:var(--p,100%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
.ill-loader-line{width:88px;height:1px;background:var(--hair);margin:0 auto;position:relative;overflow:hidden}
.ill-loader-line::after{content:'';position:absolute;inset:0;background:var(--dusk);transform-origin:left;animation:ill-sweep 1.2s var(--e) infinite}
@keyframes ill-sweep{0%{transform:scaleX(0)}55%{transform:scaleX(1);transform-origin:left}56%{transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}

/* ── nav ── */
.ill-nav{position:fixed;inset:0 0 auto 0;z-index:60;display:flex;align-items:center;justify-content:space-between;
  padding:clamp(14px,2.4vw,24px) clamp(18px,3.4vw,44px);color:#F5F8F9;
  transition:color .45s var(--e),background-color .45s var(--e),backdrop-filter .45s var(--e)}
/* over the hero photo: solid light on a soft scrim. Past it: the page's own
   ink on a quiet blurred surface. NEVER mix-blend-difference — over a bright
   mid-tone photograph it inverts to muddy olive/brown instead of reading as
   chrome. */
.ill-nav::before{content:'';position:absolute;inset:0;z-index:-1;pointer-events:none;
  background:linear-gradient(to bottom,rgba(14,22,29,.42),transparent);
  opacity:1;transition:opacity .45s var(--e)}
.ill-nav.is-past{color:var(--ink);background:rgba(239,243,245,.86);backdrop-filter:blur(10px);
  box-shadow:0 1px 0 var(--hair)}
.ill-nav.is-past::before{opacity:0}
.ill-nav-mark{font-family:var(--serif);font-size:1.02rem;letter-spacing:.02em;display:flex;gap:.4em}
.ill-nav-links{display:flex;gap:clamp(14px,2vw,26px);font-size:.82rem;font-weight:400;letter-spacing:.04em}
.ill-nav-links a{opacity:.82;transition:opacity .3s var(--e)}
.ill-nav-links a:hover{opacity:1}
.ill-burger{display:none;width:44px;height:44px;position:relative}
.ill-burger i{position:absolute;left:11px;right:11px;height:1.5px;background:currentColor;transition:transform .45s var(--e),top .45s var(--e)}
.ill-burger i:first-child{top:18px}
.ill-burger i:last-child{top:26px}
.ill-burger.is-x i:first-child{top:22px;transform:rotate(45deg)}
.ill-burger.is-x i:last-child{top:22px;transform:rotate(-45deg)}
.ill-sheet{position:fixed;inset:0;z-index:55;background:var(--ice);display:grid;place-content:center;gap:2px;text-align:center;
  opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity .5s var(--e),visibility 0s linear .5s}
.ill-sheet.is-open{opacity:1;visibility:visible;pointer-events:auto;
  transition:opacity .5s var(--e),visibility 0s linear 0s}
.ill-sheet a{font-family:var(--serif);font-size:clamp(1.7rem,7vw,2.6rem);padding:.34em .2em;opacity:0;transform:translateY(14px);transition:opacity .5s var(--e),transform .5s var(--e);text-transform:uppercase;letter-spacing:.16em}
.ill-sheet.is-open a{opacity:1;transform:none}
@media (max-width:860px){.ill-nav-links{display:none}.ill-burger{display:block}}

/* ── full-bleed stage ── */
.ill-stage{position:relative}
.ill-stage-frame{position:relative;overflow:hidden;height:100%}
.ill-stage-in{position:absolute;inset:calc(-1 * var(--dz,9%)) 0;will-change:transform}
.ill-stage-film{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}

/* ── hero: seam-reveal lockup over the living terrace ── */
.ill-hero{position:relative;min-height:100svh;display:grid}
.ill-hero .ill-stage.is-hero{position:absolute;inset:0}
/* the difference-blend wordmark needs a calmer, darker ground to read against
   a busy mid-tone photograph (mirrorhouse ran its hero at saturate(.78)) */
.ill-hero .ill-stage.is-hero img,.ill-hero .ill-stage.is-hero video{filter:saturate(.78) brightness(.94)}
.ill-hero .ill-stage.is-hero::after{content:'';position:absolute;inset:0;z-index:1;
  background:
    radial-gradient(120% 62% at 50% 50%,rgba(14,22,29,.46) 0%,rgba(14,22,29,.16) 55%,transparent 78%),
    linear-gradient(200deg,transparent 40%,rgba(14,22,29,.5) 100%)}
/* ICELAND | LUXURY LODGES, mirrored about a hairline (mirrorhouse spec) */
.ill-wordmark{position:absolute;inset:0;z-index:3;display:flex;align-items:center;justify-content:center;
  margin:0;pointer-events:none;color:#F6F9FA;text-shadow:0 2px 30px rgba(14,22,29,.45);
  font-family:var(--serif);font-size:clamp(30px,7.4vw,112px);line-height:1.02;font-weight:400}
.ill-wm-word{display:block;white-space:nowrap;letter-spacing:.02em;will-change:clip-path,transform}
.ill-wm-l{padding-right:.3em;margin-right:-.08em;text-align:right}
.ill-wm-r{padding-left:.3em;text-align:left}
.ill-wm-seam{flex:none;width:1px;height:.94em;background:currentColor;opacity:.85;transform-origin:50% 50%}
.ill-hero-sub{position:absolute;left:0;right:0;bottom:clamp(30px,7vh,74px);z-index:3;text-align:center;padding:0 20px;overflow:hidden}
.ill-hero-sub-in{display:inline-block;color:#EDF1F2;font-size:clamp(.92rem,1.6vw,1.05rem);max-width:44ch;
  text-shadow:0 1px 16px rgba(14,22,29,.5);
  opacity:0;transform:translateY(16px);transition:opacity .9s var(--e) .9s,transform .9s var(--e) .9s}
.is-revealed .ill-hero-sub-in{opacity:1;transform:none}
@media (max-width:640px){
  .ill-wordmark{flex-direction:column;gap:.16em;font-size:clamp(30px,10.4vw,60px)}
  .ill-wm-l,.ill-wm-r{padding:0;margin:0;text-align:center}
  .ill-wm-seam{width:.86em;height:1px}
}

/* ── statement ── */
.ill-statement{padding:clamp(90px,16vh,180px) clamp(20px,6vw,72px);max-width:900px;margin:0 auto;text-align:center}
.ill-statement-lead .ill-rise-in{font-family:var(--serif);font-size:clamp(1.7rem,4vw,3rem);line-height:1.2;font-weight:400}
.ill-statement-body{margin-top:26px}
.ill-statement-body .ill-rise-in{color:var(--ink-soft);font-size:clamp(1rem,1.8vw,1.15rem);max-width:60ch;margin:0 auto}

/* ── doors ── */
.ill-doors{display:grid;grid-template-columns:repeat(3,1fr);min-height:88svh}
.ill-door{position:relative;display:grid;align-content:end;overflow:hidden;isolation:isolate;min-height:340px;
  opacity:0;transform:translateY(26px);transition:opacity .9s var(--e),transform .9s var(--e)}
.ill-door.is-on{opacity:1;transform:none}
.ill-door-media{position:absolute;inset:0;z-index:-1}
.ill-door-media img{transform:scale(1.05);transition:transform 1.2s var(--e);filter:saturate(.86)}
.ill-door:hover .ill-door-media img{transform:scale(1.11)}
.ill-door::after{content:'';position:absolute;inset:0;z-index:-1;
  background:linear-gradient(to top,rgba(14,22,29,.86) 0%,rgba(14,22,29,.44) 40%,rgba(14,22,29,.1) 100%)}
.ill-door + .ill-door{box-shadow:inset 1px 0 0 var(--hair-ice)}
.ill-door-copy{padding:clamp(20px,3vw,38px);color:var(--ice);display:grid;gap:6px}
.ill-door-kind{font-size:.78rem;letter-spacing:.08em;color:var(--ice-mute);font-weight:400}
.ill-door-name{font-family:var(--serif);font-size:clamp(1.7rem,3.2vw,2.7rem);line-height:1.06}
.ill-door-sleeps{font-size:.86rem;color:var(--ice-soft)}
@media (max-width:900px){.ill-doors{grid-template-columns:1fr}.ill-door{min-height:64svh}.ill-door + .ill-door{box-shadow:inset 0 1px 0 var(--hair-ice)}}

/* ── chapters ── */
.ill-chapter{padding:clamp(90px,15vh,170px) clamp(20px,5vw,64px);max-width:1500px;margin:0 auto}
.ill-chapter-head{display:flex;align-items:baseline;gap:clamp(16px,3vw,34px);border-top:1px solid var(--hair);padding-top:26px;margin-bottom:clamp(34px,6vh,64px)}
.ill-chapter-ord{font-family:var(--serif);font-size:clamp(2.4rem,6vw,4.6rem);line-height:1;color:var(--dusk)}
.ill-chapter-name .ill-rise-in{font-family:var(--serif);font-size:clamp(2.2rem,5.4vw,4.2rem);line-height:1.04}
.ill-chapter-water{margin-top:6px}
.ill-chapter-water .ill-rise-in{color:var(--ink-mute);font-size:.95rem;letter-spacing:.03em}
.ill-chapter-grid{display:grid;grid-template-columns:minmax(300px,5fr) 7fr;gap:clamp(28px,4.5vw,64px);align-items:start}
.ill-chapter-copy{position:sticky;top:96px;display:grid;gap:22px}
.ill-chapter-lead .ill-rise-in{font-family:var(--serif);font-size:clamp(1.3rem,2.4vw,1.8rem);line-height:1.3}
.ill-chapter-body .ill-rise-in{color:var(--ink-soft);max-width:52ch}
.ill-facts{display:flex;gap:clamp(20px,3vw,40px)}
.ill-fact{display:grid;gap:2px;opacity:0;transform:translateY(14px);transition:opacity .7s var(--e),transform .7s var(--e)}
.ill-fact.is-on{opacity:1;transform:none}
.ill-fact:nth-child(2){transition-delay:.1s}
.ill-fact:nth-child(3){transition-delay:.2s}
.ill-fact-n{font-family:var(--serif);font-size:clamp(1.9rem,3.4vw,2.8rem);line-height:1;color:var(--dusk)}
.ill-fact-l{font-size:.8rem;letter-spacing:.05em;color:var(--ink-mute)}
.ill-amen{list-style:none;padding:0;display:grid;gap:9px;max-width:40ch}
.ill-amen li{padding-left:18px;position:relative;color:var(--ink-soft);font-size:.95rem;
  opacity:0;transform:translateX(-8px);transition:opacity .6s var(--e),transform .6s var(--e)}
.ill-amen li.is-on{opacity:1;transform:none}
.ill-amen li::before{content:'';position:absolute;left:0;top:.68em;width:9px;height:1px;background:var(--dusk)}
.ill-chip{border:1px solid var(--hair);padding:12px 16px;display:inline-grid;gap:2px;max-width:max-content}
.ill-chip strong{font-weight:500;font-size:.98rem}
.ill-chip span{font-size:.8rem;color:var(--ink-mute)}
.ill-chapter-photos{display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,2vw,26px)}
.ill-frame{position:relative;overflow:hidden;aspect-ratio:4/3.1;
  opacity:0;transform:translateY(30px);transition:opacity 1s var(--e),transform 1s var(--e)}
.ill-frame.is-on{opacity:1;transform:none}
.ill-frame.is-wide{grid-column:1/-1;aspect-ratio:16/8.4}
.ill-frame img{filter:saturate(.92)}
@media (max-width:1020px){.ill-chapter-grid{grid-template-columns:1fr}.ill-chapter-copy{position:static}}
@media (max-width:640px){.ill-chapter-photos{grid-template-columns:1fr}.ill-frame{aspect-ratio:4/3}}

/* ── THE WALKTHROUGH ── */
.ill-walk{position:relative;height:300svh}
.ill-walk-sticky{position:sticky;top:0;height:100svh;overflow:hidden;background:var(--ink)}
.ill-walk-still,.ill-walk-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover}
.ill-walk-sticky::after{content:'';position:absolute;inset:auto 0 0 0;height:46%;z-index:2;pointer-events:none;
  background:linear-gradient(to top,rgba(14,22,29,.72),transparent)}
.ill-walk-copy{position:absolute;left:clamp(24px,5vw,72px);bottom:clamp(36px,8vh,84px);z-index:3;display:grid;gap:10px}
.ill-walk-label{font-size:.74rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(239,243,245,.72)}
.ill-walk-lead{font-family:var(--serif);font-size:clamp(1.4rem,3vw,2.4rem);line-height:1.2;color:#F4F8F9;max-width:22ch;
  text-shadow:0 2px 24px rgba(14,22,29,.5)}
.reduced .ill-walk{height:auto}
.reduced .ill-walk-sticky{position:static;height:76svh}
.reduced .ill-walk-canvas{display:none}
@media (prefers-reduced-motion:reduce){
  .ill-walk{height:auto}
  .ill-walk-sticky{position:static;height:76svh}
  .ill-walk-canvas{display:none}
}

/* ── fourth key ── */
.ill-fourth{padding:0 clamp(20px,5vw,64px) clamp(80px,12vh,140px)}
.ill-fourth-card{max-width:820px;margin:0 auto;background:var(--ink);color:var(--ice);padding:clamp(36px,6vw,72px);text-align:center;display:grid;gap:14px}
.ill-fourth-name .ill-rise-in{font-family:var(--serif);font-size:clamp(1.5rem,3.2vw,2.3rem);line-height:1.15}
.ill-fourth-place .ill-rise-in{color:var(--ice-mute);letter-spacing:.14em;text-transform:uppercase;font-size:.76rem;font-weight:400}
.ill-fourth-body .ill-rise-in{color:var(--ice-soft);max-width:46ch;margin:0 auto}

/* ── quote ── */
.ill-quote{padding:0 clamp(20px,6vw,72px) clamp(90px,14vh,160px);text-align:center}
.ill-quote-text .ill-rise-in{font-family:var(--serif);font-size:clamp(1.5rem,3.4vw,2.5rem);line-height:1.3;max-width:26ch;margin:0 auto}
.ill-quote-meta{margin-top:16px}
.ill-quote-meta .ill-rise-in{font-size:.85rem;color:var(--ink-mute)}

/* ── booking ── */
.ill-book{max-width:1200px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(100px,15vh,180px);
  display:grid;grid-template-columns:minmax(280px,1fr) minmax(320px,1.2fr);gap:clamp(30px,5vw,70px);align-items:start}
.ill-book-copy{display:grid;gap:16px;position:sticky;top:110px}
.ill-book-copy h2 .ill-rise-in{font-family:var(--serif);font-size:clamp(1.9rem,4vw,3.1rem);line-height:1.1}
.ill-book-copy p .ill-rise-in{color:var(--ink-soft);max-width:44ch}
.ill-book-form{display:grid;gap:18px;border-top:1px solid var(--hair);padding-top:26px}
.ill-field{display:grid;gap:7px}
.ill-field label{font-size:.78rem;letter-spacing:.06em;color:var(--ink-mute);font-weight:400}
.ill-field input,.ill-field select{font:inherit;color:var(--ink);background:transparent;border:1px solid var(--hair);
  padding:12px 14px;border-radius:0;min-height:46px;width:100%}
.ill-field input:focus,.ill-field select:focus{outline:2px solid var(--dusk);outline-offset:1px;border-color:transparent}
.ill-field-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.ill-field-row.is-two{grid-template-columns:1fr 1fr}
.ill-cta{background:var(--ink);color:var(--ice);padding:15px 30px;font-weight:400;letter-spacing:.04em;font-size:.94rem;
  min-height:48px;transition:transform .25s var(--e),background .3s var(--e)}
.ill-cta:hover{background:var(--dusk)}
.ill-cta:active{transform:translateY(1px) scale(.99)}
.ill-book-note{font-size:.78rem;color:var(--ink-mute)}
.ill-book-done{display:grid;gap:18px;padding-top:26px}
.ill-book-done-seam{height:1px;background:var(--dusk)}
.ill-book-done p{font-family:var(--serif);font-size:clamp(1.2rem,2.2vw,1.6rem);line-height:1.4;max-width:34ch}
@media (max-width:860px){.ill-book{grid-template-columns:1fr}.ill-book-copy{position:static}.ill-field-row{grid-template-columns:1fr 1fr}.ill-field-row .ill-field:last-child{grid-column:1/-1}}

/* ── footer ── */
.ill-footer{position:relative;background:var(--ink);color:var(--ice)}
.ill-footer .ill-stage.is-footer{height:56svh;position:relative}
.ill-footer .ill-stage.is-footer::after{content:'';position:absolute;inset:0;
  background:linear-gradient(to bottom,rgba(14,22,29,.12),rgba(14,22,29,.96))}
.ill-footer-grid{padding:clamp(40px,7vh,90px) clamp(20px,5vw,64px);display:grid;gap:clamp(28px,5vh,54px);max-width:1500px;margin:0 auto}
.ill-footer-word{font-family:var(--serif);font-size:clamp(2rem,7.2vw,5.4rem);line-height:1.04;color:var(--ice);opacity:.94}
.ill-footer-dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:22px}
.ill-footer-dl div{display:grid;gap:5px;border-top:1px solid var(--hair-ice);padding-top:14px}
.ill-footer-dl dt{font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ice-mute);font-weight:400}
.ill-footer-dl dd{color:var(--ice-soft);font-size:.95rem}
.ill-footer-dl a:hover{color:var(--ice)}

/* ── rise mechanism (resting state visible; .js arms the hidden start) ── */
.ill-rise{overflow:hidden}
.ill-rise-in{display:block;padding-bottom:.14em;margin-bottom:-.14em}
.js:not(.reduced) .ill-rise .ill-rise-in{transform:translateY(112%);transition:transform 1s var(--e)}
.js:not(.reduced) .ill-rise.is-on .ill-rise-in{transform:none}

/* ── reduced motion: everything rests visible, no drift, no loader ── */
@media (prefers-reduced-motion:reduce){
  .ill-stage-in{position:absolute;inset:0;transform:none !important}
  .ill-hero-line-in,.ill-hero-sub-in{transform:none;opacity:1;transition:none}
  .ill-door,.ill-fact,.ill-amen li,.ill-frame{opacity:1;transform:none;transition:none}
  .ill-loader-line::after{animation:none}
}
`
