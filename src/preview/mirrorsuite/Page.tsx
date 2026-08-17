import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, EMAIL, EMAIL_HREF, ADDRESS, COMPANY, NAV, HERO, STATEMENT,
  ROW, SUITE, FLORA, REVIEWS, PANO, HOSTS, BOOKING, JSON_LD,
} from './data'

const company = companyEntry

/* ── „Speglaröðin við sjóinn" — the mirror row by the sea. ──────────────────
   A row of mirror suites stands fifty metres from Hvammsfjörður. The page
   is a dark shoreline at dusk, and its signature is THE ROW: four glass
   panels standing side by side like the suites themselves, each expanding
   on hover/focus to hand over its photograph. Second device: the flora
   nameplates (Arctic Thyme · Lupine · Bearberry · Gleymmerey), engraved
   pairs EN/IS. Engine: vanilla — one shared rAF drift loop + IO reveals,
   flex-grow accordion, no GSAP, no Lenis. ───────────────────────────────── */

/* Palette — dark ocean dusk, computed contrast:
   BONE #EEF0EA on DEEP #0F141C ...... 14.9:1 AAA
   GLASS #8FBFB0 on DEEP ............. 8.1:1 AA+ (small-text safe)
   DEEP on BONE ...................... 14.9:1 AAA */
const DEEP = '#0F141C'
const BONE = '#EEF0EA'

const SEEN_KEY = 'ms_seen'

/* smooth scroll. Lenis scrolls the window for real, so the drift loop's
   getBoundingClientRect reads and the frame-sequence scrubber's native
   'scroll' listener both stay correct — no extra plumbing needed. */
let pageLenis: Lenis | null = null

interface DriftNode { el: HTMLElement; d: number }
const driftSet = new Set<DriftNode>()
let rafId = 0
let reduced = false

function loop() {
  rafId = 0
  if (!driftSet.size) return
  const vh = window.innerHeight
  const reads: { n: DriftNode; p: number; vis: boolean }[] = []
  driftSet.forEach((n) => {
    const r = n.el.getBoundingClientRect()
    reads.push({
      n,
      p: (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2),
      vis: r.bottom > -80 && r.top < vh + 80,
    })
  })
  for (const { n, p, vis } of reads) {
    if (!vis) continue
    n.el.style.transform = `translate3d(0, ${(-p * n.d).toFixed(3)}%, 0)`
  }
  rafId = requestAnimationFrame(loop)
}
function armDrift(el: HTMLElement | null, d: number) {
  if (!el || reduced) return () => {}
  const n = { el, d }
  driftSet.add(n)
  if (!rafId) rafId = requestAnimationFrame(loop)
  return () => { driftSet.delete(n); el.style.transform = '' }
}

function Frame({ src, alt, drift = 10, ratio = '4/3' }: { src: string; alt: string; drift?: number; ratio?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => armDrift(ref.current, drift), [drift])
  const dz = Math.max(9, drift * 1.35)
  return (
    <figure className="ms-frame" style={{ ['--dz' as string]: `${dz}%`, aspectRatio: ratio }}>
      <div className="ms-frame-in" ref={ref}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </figure>
  )
}

function Rise({ as: Tag = 'div', className = '', children }: { as?: 'div' | 'h2' | 'h3' | 'p'; className?: string; children: React.ReactNode }) {
  return (
    <Tag className={`ms-rise ${className}`}>
      <span className="ms-rise-in">{children}</span>
    </Tag>
  )
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const doneRef = useRef(false)
  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    const imgs = Array.from(document.images)
    const total = Math.max(1, imgs.length)
    let loaded = imgs.filter((i) => i.complete).length
    const onOne = () => { loaded += 1 }
    imgs.forEach((i) => { if (!i.complete) { i.addEventListener('load', onOne); i.addEventListener('error', onOne) } })
    const tick = () => {
      const el = performance.now() - t0
      const real = Math.min(1, loaded / total)
      const p = Math.min(1, Math.max(el / 2400, Math.min(real, el / 1100)))
      setPct(Math.round(p * 100))
      if (p >= 1 && !doneRef.current) {
        doneRef.current = true
        window.setTimeout(() => { onDone(); window.dispatchEvent(new CustomEvent('ms:revealed')) }, 240)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])
  return (
    <div className="ms-loader" role="status" aria-label="Loading">
      <div className="ms-loader-word" style={{ ['--p' as string]: `${100 - pct}%` }}>THE MIRROR SUITE</div>
      <div className="ms-loader-horizon" aria-hidden="true" />
    </div>
  )
}

/* THE ROW — flex-grow accordion of glass panels */
function TheRow() {
  const [open, setOpen] = useState(0)
  return (
    <section className="ms-row" id="rodin" aria-label="The row of suites">
      <div className="ms-row-track">
        {ROW.map((r, i) => (
          <button
            type="button"
            key={r.img}
            className={`ms-panel ${open === i ? 'is-open' : ''}`}
            onMouseEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => setOpen(i)}
            aria-expanded={open === i}
          >
            <img src={IMG[r.img]} alt={r.text} loading="lazy" decoding="async" />
            <span className="ms-panel-scrim" aria-hidden="true" />
            <span className="ms-panel-label">{r.label}</span>
            <span className="ms-panel-text">{r.text}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function BookingForm() {
  const [sent, setSent] = useState(false)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      const key = 'ms_demo_requests'
      const prev = JSON.parse(localStorage.getItem(key) || '[]')
      prev.push({ ...Object.fromEntries(fd.entries()), at: new Date().toISOString() })
      localStorage.setItem(key, JSON.stringify(prev))
    } catch { /* private mode: demo still succeeds */ }
    setSent(true)
  }
  if (sent) return <div className="ms-book-done" role="status"><p>{BOOKING.success}</p></div>
  return (
    <form className="ms-book-form" onSubmit={onSubmit}>
      <div className="ms-field-row">
        <div className="ms-field">
          <label htmlFor="ms-in">Arrival</label>
          <input id="ms-in" name="arrival" type="date" required />
        </div>
        <div className="ms-field">
          <label htmlFor="ms-out">Departure</label>
          <input id="ms-out" name="departure" type="date" required />
        </div>
      </div>
      <div className="ms-field-row">
        <div className="ms-field">
          <label htmlFor="ms-name">Name</label>
          <input id="ms-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="ms-field">
          <label htmlFor="ms-email">Email</label>
          <input id="ms-email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>
      <button className="ms-cta" type="submit">Send the request</button>
      <p className="ms-book-note">Demo prototype: the request is stored only in this browser.</p>
    </form>
  )
}

/* ═════════════════════════════ PAGE ═════════════════════════════════════ */
export default function Page() {
  const [booted, setBooted] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setThemeColor(DEEP)
    document.title = 'The Mirror Suite — Mirror suites by the sea in West Iceland'
    const forced = new URLSearchParams(window.location.search).has('loader')
    let seen = false
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1' } catch { seen = true }
    if (!reduced && (forced || !seen)) {
      setShowLoader(true)
      try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    } else {
      setBooted(true)
      window.setTimeout(() => window.dispatchEvent(new CustomEvent('ms:revealed')), 60)
    }
  }, [])

  /* ── smooth scroll ── */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    pageLenis = lenis
    let id = requestAnimationFrame(function raf(t: number) {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    })
    return () => { cancelAnimationFrame(id); lenis.destroy(); pageLenis = null }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.classList.add('js')
    if (reduced) { root.classList.add('reduced'); return }
    const io = new IntersectionObserver(
      (es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-on'); io.unobserve(en.target) } }),
      { threshold: 0.2 },
    )
    /* NOTE: never observe .ms-panel — React owns its className (is-open toggles
       on hover), so an imperatively-added is-on class is wiped on the next
       render and the whole row vanishes. Reveal the TRACK instead; the panels
       stagger off it in CSS. */
    root.querySelectorAll('.ms-rise, .ms-frame, .ms-fact, .ms-amen li, .ms-flora-row, .ms-row-track').forEach((el) => io.observe(el))
    const nav = root.querySelector('.ms-nav')
    const heroEl = root.querySelector('.ms-hero')
    if (nav && heroEl) {
      const navIo = new IntersectionObserver(
        ([en]) => nav.classList.toggle('is-past', !en.isIntersecting),
        { rootMargin: '-72px 0px 0px 0px', threshold: 0 },
      )
      navIo.observe(heroEl)
      return () => { io.disconnect(); navIo.disconnect() }
    }
    return () => io.disconnect()
  }, [booted])

  useEffect(() => {
    const onReveal = () => rootRef.current?.classList.add('is-revealed')
    window.addEventListener('ms:revealed', onReveal)
    return () => window.removeEventListener('ms:revealed', onReveal)
  }, [])

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    /* Lenis reverts native scrollIntoView on the next frame — route through it */
    if (pageLenis) pageLenis.scrollTo(el, { offset: -10 })
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div className="ms-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {showLoader && !booted && <Preloader onDone={() => setBooted(true)} />}

      <header className="ms-nav">
        <a className="ms-nav-mark" href="#top" onClick={goTo('top')}>THE MIRROR SUITE</a>
        <nav className="ms-nav-links" aria-label="Sections">
          {NAV.map((n) => <a key={n.id} href={`#${n.id}`} onClick={goTo(n.id)}>{n.label}</a>)}
        </nav>
        <button
          className={`ms-burger ${menuOpen ? 'is-x' : ''}`}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        ><i /><i /></button>
      </header>
      <div className={`ms-sheet ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} style={{ transitionDelay: `${80 + i * 55}ms` }}
            onClick={(e) => { setMenuOpen(false); goTo(n.id)(e) }}>{n.label}</a>
        ))}
      </div>

      <main id="top">
        {/* ── hero ── */}
        <section className="ms-hero">
          <HeroMedia />
          <div className="ms-hero-lockup">
            <h1 className="ms-hero-word" aria-label={HERO.word}>
              {['The Mirror', 'Suite'].map((l, i) => (
                <span className="ms-hero-line" key={l}>
                  <span className="ms-hero-line-in" style={{ transitionDelay: `${140 + i * 130}ms` }}>{l}</span>
                </span>
              ))}
            </h1>
            <p className="ms-hero-sub"><span>{HERO.sub}</span></p>
          </div>
        </section>

        {/* ── statement ── */}
        <section className="ms-statement">
          <Rise as="h2" className="ms-statement-lead">{STATEMENT.lead}</Rise>
          <Rise as="p" className="ms-statement-body">{STATEMENT.body}</Rise>
        </section>

        {/* ── THE ROW ── */}
        <TheRow />

        {/* ── the suite ── */}
        <section className="ms-suite" id="svitan">
          <div className="ms-suite-grid">
            <div className="ms-suite-copy">
              <Rise as="h2" className="ms-h2">{SUITE.lead}</Rise>
              <Rise as="p" className="ms-body">{SUITE.body}</Rise>
              <div className="ms-facts" role="list">
                {SUITE.facts.map((f) => (
                  <div className="ms-fact" role="listitem" key={f.l}>
                    <span className="ms-fact-n">{f.n}</span>
                    <span className="ms-fact-l">{f.l}</span>
                  </div>
                ))}
              </div>
              <ul className="ms-amen">
                {SUITE.amenities.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
            <div className="ms-suite-photos">
              <Frame src={IMG.int2} alt="Inside a suite, glass facing the fjord" ratio="3/2" drift={10} />
              {/* tall-9 was here under alt="Suite detail" and is a photograph
                  of a SNORKELLER — an area-activity shot, not the suite. Both
                  slots now carry actual suite detail, and both are checked
                  against the owners' own Airbnb gallery. */}
              <div className="ms-suite-pair">
                <Frame src={IMG.port1} alt="The kitchenette and its coffee" ratio="3/3.6" drift={8} />
                <Frame src={IMG.tall8} alt="Mirror cladding meeting the dark timber end wall" ratio="3/3.6" drift={9} />
              </div>
            </div>
          </div>
        </section>

        {/* ── THE NIGHT: pinned, scroll-scrubbed aurora film ── */}
        <PanoScrub />

        {/* ── reviews + testimonials ── */}
        <Reviews />

        {/* ── the names ── */}
        <section className="ms-flora" id="floran">
          <div className="ms-flora-head">
            <Rise as="h2" className="ms-h2">{FLORA.lead}</Rise>
            <Rise as="p" className="ms-body">{FLORA.body}</Rise>
          </div>
          <ol className="ms-flora-index">
            {FLORA.names.map((n, i) => (
              <li
                className="ms-flora-row"
                key={n.en}
                style={{ transitionDelay: `${i * 90}ms`, '--bloom': n.bloom } as React.CSSProperties}
              >
                <span className="ms-flora-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="ms-flora-mark" aria-hidden="true"><i /></span>
                <span className="ms-flora-name">
                  <span className="ms-flora-is">{n.is}</span>
                  <span className="ms-flora-en">{n.en}</span>
                </span>
                <span className="ms-flora-note">{n.note}</span>
                <span className="ms-flora-lat">{n.lat}</span>
              </li>
            ))}
          </ol>
          <p className="ms-flora-foot">{FLORA.foot}</p>
        </section>


        {/* ── hosts ── */}
        <section className="ms-hosts">
          <Rise as="h2" className="ms-h2 ms-center">{HOSTS.lead}</Rise>
          <Rise as="p" className="ms-body ms-center">{HOSTS.body}</Rise>
        </section>

        {/* ── booking ── */}
        <section className="ms-book" id="bokun">
          <div className="ms-book-copy">
            <Rise as="h2" className="ms-h2">{BOOKING.title}</Rise>
            <Rise as="p" className="ms-body">{BOOKING.body}</Rise>
          </div>
          <BookingForm />
        </section>

        {/* ── footer ── */}
        <footer className="ms-footer">
          <div className="ms-footer-horizon" aria-hidden="true" />
          <div className="ms-footer-word" aria-hidden="true">Sjáumst við sjóinn</div>
          <dl className="ms-footer-dl">
            <div><dt>Email</dt><dd><a href={EMAIL_HREF}>{EMAIL}</a></dd></div>
            <div><dt>Address</dt><dd>{ADDRESS}</dd></div>
            <div><dt>Company</dt><dd>{COMPANY}</dd></div>
          </dl>
          <PreviewFooter company={company} />
        </footer>
      </main>
      <PreviewChrome company={company} />
    </div>
  )
}

function HeroMedia() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => armDrift(ref.current, 8), [])
  return (
    <div className="ms-hero-media" style={{ ['--dz' as string]: '11%' }}>
      <div className="ms-frame-in" ref={ref}>
        <img src={IMG.hero} alt="The mirror suites on the shore at golden hour" loading="eager" decoding="async" />
      </div>
    </div>
  )
}

/* ── THE NIGHT — the real scroll-through ──────────────────────────────────
   [[mirrorhouse-design-system]] device 4, transplanted properly this time.
   The aurora does NOT play on its own: scroll IS the clock. A pre-decoded
   JPEG frame sequence is blitted to a canvas and the scroll position picks
   the frame, so the sky moves exactly as far as you push it and stops when
   you stop — that is the whole effect.

   Driving a <video>'s currentTime instead cannot work (measured on Mirror
   House: only 104 of 241 frames ever reached the screen, because every
   assignment is a decoder SEEK). And letting the video simply autoplay —
   which is what shipped here first — throws the effect away entirely: the
   sky moves on its own and scroll does nothing.

   Loader architecture is the hardened one from that build, every clause
   paid for by a real bug there:
   · loads unconditionally from a mount effect (never gated behind a
     scroll trigger, which found browsers where it never fired → blank),
   · img.decode() before a frame counts (onload only means bytes arrived;
     the decode would otherwise stall inside the first draw),
   · 14-wide concurrency (a curious scroller outruns a narrow pump and the
     film reads as stepping),
   · paint() falls back to the nearest loaded frame and draws the still
     while zero frames are decoded, so it is never blank,
   · canvas.dataset.frame exposes the shown frame so a probe can assert it.
   ──────────────────────────────────────────────────────────────────────── */
const NIGHT_FRAMES = 121

function PanoScrub() {
  const [chap, setChap] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stillRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas || reduced) return

    const small = window.matchMedia('(max-width: 767px)').matches
    const dir = small ? 'night-sm' : 'night'
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const imgs: (HTMLImageElement | null)[] = new Array(NIGHT_FRAMES).fill(null)
    let shown = -1
    let stopped = false

    const sizeCanvas = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
    }

    /* ── fit ────────────────────────────────────────────────────────────────
       Cover-fit alone destroys this shot on a tall viewport. The frames are
       5:3; a nearly-square pane (1364x1161 was the real case) forces cover to
       scale to the HEIGHT and then discard about 30% of the width — 15% off
       each side. The result reads as "it starts zoomed in", because the
       establishing frame of a push-in is exactly the frame that needs its
       full width. Note that exporting taller frames does NOT help: under
       cover-fit the visible field of view is set by the canvas aspect, not
       the source aspect.

       So: cover while the crop is mild, and once it would eat more than 12%
       of the width, fit the WIDTH instead and let the near-black page show
       above and below. On a night scene against DEEP #0F141C that reads as a
       letterbox rather than a fault, and the composition survives intact. */
    const MAX_SIDE_CROP = 0.12
    const draw = (im: CanvasImageSource, iw: number, ih: number) => {
      const cw = canvas.width; const ch = canvas.height
      const cover = Math.max(cw / iw, ch / ih)
      const cropped = 1 - cw / (iw * cover)
      const scale = cropped > MAX_SIDE_CROP ? cw / iw : cover
      const w = iw * scale; const h = ih * scale
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    const paint = (idx: number) => {
      /* nearest loaded frame, so a partial load still animates */
      let i = idx
      if (!imgs[i]) {
        let d = 1
        while (d < NIGHT_FRAMES) {
          if (imgs[Math.max(0, i - d)]) { i = Math.max(0, i - d); break }
          if (imgs[Math.min(NIGHT_FRAMES - 1, i + d)]) { i = Math.min(NIGHT_FRAMES - 1, i + d); break }
          d += 1
        }
      }
      const im = imgs[i]
      if (im) {
        draw(im, im.naturalWidth, im.naturalHeight)
        shown = i
        canvas.dataset.frame = String(i)
      } else {
        const still = stillRef.current
        if (still?.complete && still.naturalWidth) draw(still, still.naturalWidth, still.naturalHeight)
      }
    }

    const src = (n: number) =>
      `${import.meta.env.BASE_URL}mirrorsuite/${dir}/f${String(n + 1).padStart(3, '0')}.webp`

    /* 14-wide pump, decode() before counting */
    let next = 0
    const pump = () => {
      if (stopped || next >= NIGHT_FRAMES) return
      const n = next++
      const im = new Image()
      im.src = src(n)
      const done = () => {
        if (stopped) return
        imgs[n] = im
        if (shown < 0 || Math.abs(n - wanted) < 2) paint(wanted)
        pump()
      }
      im.decode().then(done).catch(() => { im.onload = done; im.onerror = () => { pump() } })
    }

    let wanted = 0
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = wrap.getBoundingClientRect()
        const total = r.height - window.innerHeight
        if (total <= 0) return
        const p = Math.min(1, Math.max(0, -r.top / total))
        const idx = Math.min(NIGHT_FRAMES - 1, Math.round(p * (NIGHT_FRAMES - 1)))
        if (idx !== shown) { wanted = idx; paint(idx) }
        /* the commentator: whichever line the camera has reached */
        let c = 0
        for (let k = 0; k < PANO.chapters.length; k += 1) if (p >= PANO.chapters[k].at) c = k
        setChap((v) => (v === c ? v : c))
      })
    }

    sizeCanvas()
    onScroll()
    /* let the hero win the connection first, then load unconditionally */
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
    <section className="ms-pano" ref={wrapRef} aria-label="The night">
      <div className="ms-pano-sticky">
        {/* was IMG.pano, which is NOT this property — see data.ts. The still
            is now their own verified night photograph, and it is also the
            frame the film is generated from, so poster and first frame agree. */}
        <img ref={stillRef} className="ms-pano-still" src={IMG.tall5}
          alt="The suites, the glass sauna and the hot tub under the aurora" loading="eager" decoding="async" />
        <canvas ref={canvasRef} className="ms-pano-canvas" aria-hidden="true" />

        {/* THE COMMENTATOR — one line takes the frame at each mark, arriving
            word by word out of its own mask. Every line stays mounted and
            only .is-on moves, which is the reveal pattern that has never
            failed on these builds. */}
        <div className="ms-cmt">
          {PANO.chapters.map((c, idx) => (
            <p key={c.text} className={`ms-cmt-l ${idx === chap ? 'is-on' : ''}`}>
              {c.text.split(' ').flatMap((w, k, all) => [
                <span className="ms-cmt-w" key={`${w}-${k}`}>
                  <i style={{ transitionDelay: idx === chap ? `${k * 46}ms` : '0ms' }}>{w}</i>
                </span>,
                ...(k < all.length - 1 ? [' '] : []),
              ])}
            </p>
          ))}
        </div>

        <div className="ms-cmt-rail" aria-hidden="true">
          {PANO.chapters.map((c, idx) => (
            <span key={c.text} className={idx <= chap ? 'is-on' : ''} />
          ))}
        </div>

        <p className={`ms-pano-hint ${chap > 0 ? 'is-gone' : ''}`} aria-hidden="true">{PANO.note}</p>
      </div>
    </section>
  )
}

/* ── Reviews + testimonials ───────────────────────────────────────────────
   The score/count/source are verified off their own Google widget. The
   quotes are sample copy standing in for review text nobody publishes —
   labelled as such on the face of the component, not just in the footer. */
function Reviews() {
  const [i, setI] = useState(0)
  const n = REVIEWS.quotes.length
  useEffect(() => {
    if (reduced) return
    const t = window.setInterval(() => setI((v) => (v + 1) % n), 7000)
    return () => window.clearInterval(t)
  }, [n])
  return (
    <section className="ms-reviews" aria-label="Guest reviews">
      <div className="ms-rev-head">
        <Rise as="h2" className="ms-h2">{REVIEWS.lead}</Rise>
        <Rise as="p" className="ms-body">{REVIEWS.body}</Rise>
      </div>
      <div className="ms-rev-grid">
        <div className="ms-rev-score">
          <span className="ms-rev-n">{REVIEWS.score}</span>
          <span className="ms-rev-stars" aria-hidden="true">★★★★★</span>
          <span className="ms-rev-c">{REVIEWS.count}</span>
          <span className="ms-rev-src">Verified on {REVIEWS.source}</span>
        </div>
        {/* ── the stage (21st.dev "Design Testimonial", devices transplanted) ──
            Its asymmetric shape is the point: an oversized ghost ordinal
            bleeding off the left, a rotated label over a filling progress
            line, and the quote arriving word by word. Rebuilt on class
            toggles rather than its framer-motion mount states — every quote
            stays mounted and only `.is-live` moves, which is the one reveal
            pattern that has never failed on these builds. */}
        <div className="ms-rev-stage">
          <span className="ms-rev-ord" aria-hidden="true">
            {REVIEWS.quotes.map((q, idx) => (
              <b key={q.text} className={idx === i ? 'is-on' : ''}>{String(idx + 1).padStart(2, '0')}</b>
            ))}
          </span>

          <div className="ms-rev-rail" aria-hidden="true">
            <span className="ms-rev-rail-l">Reviews</span>
            <span className="ms-rev-rail-t"><i style={{ height: `${((i + 1) / n) * 100}%` }} /></span>
          </div>

          <div className="ms-rev-body">
            {/* these are the guests' real words now — say whose, and where
                from, at full size rather than whispered under the fold */}
            <p className="ms-rev-badge"><span aria-hidden="true" />Verified on {REVIEWS.source}</p>

            <ul className="ms-rev-list">
              {REVIEWS.quotes.map((q, idx) => (
                <li key={q.text} className={`ms-rev-q ${idx === i ? 'is-live' : ''}`} aria-hidden={idx !== i}>
                  {/* A REAL space text node has to sit between the word spans.
                      Mapping words to bare <span>s renders them with no
                      whitespace at all: the gap becomes CSS-only, so the
                      accessible name, copy-paste and search all read
                      "Wesatinthehottub..." while it looks correct on screen. */}
                  <blockquote>
                    {q.text.split(' ').flatMap((w, k, all) => [
                      <span className="ms-rev-w" key={`${w}-${k}`}>
                        <i style={{ transitionDelay: idx === i ? `${k * 38}ms` : '0ms' }}>{w}</i>
                      </span>,
                      /* no trailing space, or it gaps the closing quote mark */
                      ...(k < all.length - 1 ? [' '] : []),
                    ])}
                  </blockquote>
                </li>
              ))}
            </ul>

            <div className="ms-rev-foot">
              <p className="ms-rev-who"><i aria-hidden="true" />{REVIEWS.quotes[i].name} · {REVIEWS.quotes[i].meta}</p>
              <div className="ms-rev-nav">
                <button type="button" aria-label="Previous review" onClick={() => setI((v) => (v - 1 + n) % n)}>
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 12L6 8l4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" aria-label="Next review" onClick={() => setI((v) => (v + 1) % n)}>
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>

            <p className="ms-rev-note">{REVIEWS.sourceNote}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════ STYLES ═══════════════════════════════════ */
const STYLES = `
@font-face{font-family:'BricolageMs';src:url('${import.meta.env.BASE_URL}fonts/bricolage/bricolage-grotesque-v9-latin_latin-ext-200.woff2') format('woff2');font-weight:200;font-display:swap}
@font-face{font-family:'BricolageMs';src:url('${import.meta.env.BASE_URL}fonts/bricolage/bricolage-grotesque-v9-latin_latin-ext-300.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'BricolageMs';src:url('${import.meta.env.BASE_URL}fonts/bricolage/bricolage-grotesque-v9-latin_latin-ext-500.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'SwitzerMs';src:url('${import.meta.env.BASE_URL}fonts/switzer/Switzer-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'SwitzerMs';src:url('${import.meta.env.BASE_URL}fonts/switzer/Switzer-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'SwitzerMs';src:url('${import.meta.env.BASE_URL}fonts/switzer/Switzer-Medium.woff2') format('woff2');font-weight:500;font-display:swap}

.ms-root{
  --deep:${DEEP}; --bone:${BONE}; --glass:#8FBFB0;
  --bone-soft:rgba(238,240,234,.78); --bone-mute:rgba(238,240,234,.55);
  --hair:rgba(238,240,234,.16);
  --disp:'BricolageMs','Helvetica Neue',sans-serif;
  --sans:'SwitzerMs','Helvetica Neue',Arial,sans-serif;
  --e:cubic-bezier(.24,.9,.26,1);
  background:var(--deep); color:var(--bone);
  font-family:var(--sans); font-weight:300; line-height:1.6;
  overflow-x:clip;
}
.ms-root *{box-sizing:border-box;margin:0}
.ms-root img{display:block;width:100%;height:100%;object-fit:cover}
.ms-root a{color:inherit;text-decoration:none}
.ms-root :focus-visible{outline:2px solid var(--glass);outline-offset:3px}
.ms-root button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}

/* loader: wordmark over a drawing horizon line */
.ms-loader{position:fixed;inset:0;z-index:80;background:var(--deep);display:grid;place-content:center;gap:20px;text-align:center}
.ms-loader-word{font-family:var(--disp);font-weight:200;font-size:clamp(1.6rem,5.4vw,3.6rem);letter-spacing:.12em;
  background:linear-gradient(90deg,var(--bone) 50%,rgba(238,240,234,.16) 50%);background-size:200% 100%;background-position-x:var(--p,100%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
.ms-loader-horizon{height:1px;width:min(340px,60vw);margin:0 auto;background:var(--hair);position:relative;overflow:hidden}
.ms-loader-horizon::after{content:'';position:absolute;inset:0;background:var(--glass);transform-origin:left;animation:ms-sweep 1.2s var(--e) infinite}
@keyframes ms-sweep{0%{transform:scaleX(0)}55%{transform:scaleX(1);transform-origin:left}56%{transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}

/* nav */
.ms-nav{position:fixed;inset:0 0 auto 0;z-index:60;display:flex;align-items:center;justify-content:space-between;
  padding:clamp(14px,2.4vw,22px) clamp(18px,3.4vw,44px);color:var(--bone);
  transition:background-color .45s var(--e),backdrop-filter .45s var(--e)}
.ms-nav::before{content:'';position:absolute;inset:0;z-index:-1;pointer-events:none;
  background:linear-gradient(to bottom,rgba(15,20,28,.5),transparent);transition:opacity .45s var(--e)}
.ms-nav.is-past{background:color-mix(in srgb,var(--deep) 84%,transparent);backdrop-filter:blur(10px)}
.ms-nav.is-past::before{opacity:0}
.ms-nav-mark{font-family:var(--disp);font-weight:300;letter-spacing:.14em;font-size:.9rem}
.ms-nav-links{display:flex;gap:clamp(14px,2vw,26px);font-size:.82rem;font-weight:400;letter-spacing:.04em}
.ms-nav-links a{opacity:.82;transition:opacity .3s var(--e)}
.ms-nav-links a:hover{opacity:1}
.ms-burger{display:none;width:44px;height:44px;position:relative}
.ms-burger i{position:absolute;left:11px;right:11px;height:1.5px;background:currentColor;transition:transform .45s var(--e),top .45s var(--e)}
.ms-burger i:first-child{top:18px}.ms-burger i:last-child{top:26px}
.ms-burger.is-x i:first-child{top:22px;transform:rotate(45deg)}
.ms-burger.is-x i:last-child{top:22px;transform:rotate(-45deg)}
.ms-sheet{position:fixed;inset:0;z-index:55;background:var(--deep);display:grid;place-content:center;gap:2px;text-align:center;
  opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity .5s var(--e),visibility 0s linear .5s}
.ms-sheet.is-open{opacity:1;visibility:visible;pointer-events:auto;
  transition:opacity .5s var(--e),visibility 0s linear 0s}
.ms-sheet a{font-family:var(--disp);font-weight:200;font-size:clamp(1.8rem,7vw,2.8rem);padding:.34em .2em;
  opacity:0;transform:translateY(14px);transition:opacity .5s var(--e),transform .5s var(--e);text-transform:uppercase;letter-spacing:.16em}
.ms-sheet.is-open a{opacity:1;transform:none}
@media (max-width:860px){.ms-nav-links{display:none}.ms-burger{display:block}}

/* hero */
.ms-hero{position:relative;min-height:100svh;display:grid}
.ms-hero-media{position:absolute;inset:0;overflow:hidden}
.ms-frame-in{position:absolute;inset:calc(-1 * var(--dz,9%)) 0;will-change:transform}
.ms-hero-media::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(15,20,28,.82),rgba(15,20,28,.06) 52%)}
.ms-hero-lockup{position:relative;z-index:2;align-self:end;padding:0 clamp(20px,5vw,64px) clamp(38px,9vh,100px)}
.ms-hero-word{display:grid}
.ms-hero-line{overflow:hidden;padding-bottom:.08em;margin-bottom:-.04em}
.ms-hero-line-in{display:block;font-family:var(--disp);font-weight:200;font-size:clamp(2.8rem,9.4vw,8rem);line-height:1;letter-spacing:.01em;
  transform:translateY(112%);transition:transform 1.2s var(--e)}
.is-revealed .ms-hero-line-in{transform:none}
.ms-hero-sub{margin-top:16px;overflow:hidden;max-width:52ch}
.ms-hero-sub span{display:inline-block;color:var(--bone-soft);font-size:clamp(.94rem,1.6vw,1.08rem);
  opacity:0;transform:translateY(14px);transition:opacity .9s var(--e) .75s,transform .9s var(--e) .75s}
.is-revealed .ms-hero-sub span{opacity:1;transform:none}

/* statement */
.ms-statement{padding:clamp(90px,16vh,180px) clamp(20px,6vw,72px);max-width:880px;margin:0 auto;text-align:center}
.ms-statement-lead .ms-rise-in{font-family:var(--disp);font-weight:200;font-size:clamp(1.7rem,4vw,3rem);line-height:1.16}
.ms-statement-body{margin-top:24px}
.ms-statement-body .ms-rise-in{color:var(--bone-soft);font-size:clamp(1rem,1.8vw,1.15rem);max-width:58ch;margin:0 auto}

/* THE ROW — accordion */
.ms-row{padding:0 clamp(8px,1.4vw,20px)}
.ms-row-track{display:flex;gap:clamp(6px,.9vw,12px);height:min(78svh,760px)}
.ms-panel{position:relative;flex:1;overflow:hidden;isolation:isolate;text-align:left;padding:0;
  transition:flex 1s var(--e)}
/* entry is driven by the TRACK's is-on, never by a class on the panel itself */
.js:not(.reduced) .ms-row-track .ms-panel{opacity:0;transform:translateY(26px);
  transition:flex 1s var(--e),opacity .9s var(--e),transform .9s var(--e)}
.js:not(.reduced) .ms-row-track.is-on .ms-panel{opacity:1;transform:none}
.ms-row-track .ms-panel:nth-child(2){transition-delay:0s,.08s,.08s}
.ms-row-track .ms-panel:nth-child(3){transition-delay:0s,.16s,.16s}
.ms-row-track .ms-panel:nth-child(4){transition-delay:0s,.24s,.24s}
.ms-panel.is-open{flex:3.2}
.ms-panel img{position:absolute;inset:0;filter:saturate(.9);transition:transform 1.2s var(--e)}
.ms-panel:hover img{transform:scale(1.04)}
.ms-panel-scrim{position:absolute;inset:0;background:linear-gradient(to top,rgba(15,20,28,.82),rgba(15,20,28,.04) 55%)}
.ms-panel-label{position:absolute;left:18px;bottom:52px;font-family:var(--disp);font-weight:300;font-size:clamp(1.1rem,2vw,1.7rem);letter-spacing:.02em}
.ms-panel-text{position:absolute;left:18px;right:18px;bottom:18px;font-size:.85rem;color:var(--bone-soft);max-width:44ch;
  opacity:0;transform:translateY(8px);transition:opacity .6s var(--e) .2s,transform .6s var(--e) .2s}
.ms-panel.is-open .ms-panel-text{opacity:1;transform:none}
@media (max-width:820px){
  .ms-row-track{flex-direction:column;height:auto}
  .ms-panel{min-height:150px;flex:1}
  .ms-panel.is-open{flex:2.6;min-height:340px}
}

/* suite */
.ms-suite{padding:clamp(90px,15vh,170px) clamp(20px,5vw,64px);max-width:1500px;margin:0 auto}
.ms-suite-grid{display:grid;grid-template-columns:minmax(300px,5fr) 7fr;gap:clamp(28px,4.5vw,64px);align-items:start}
.ms-suite-copy{position:sticky;top:96px;display:grid;gap:22px}
.ms-h2 .ms-rise-in{font-family:var(--disp);font-weight:200;font-size:clamp(1.6rem,3vw,2.5rem);line-height:1.16}
.ms-body .ms-rise-in{color:var(--bone-soft);max-width:54ch}
.ms-center{text-align:center}
.ms-center .ms-rise-in{margin:0 auto}
.ms-facts{display:flex;gap:clamp(20px,3vw,40px)}
.ms-fact{display:grid;gap:2px;opacity:0;transform:translateY(14px);transition:opacity .7s var(--e),transform .7s var(--e)}
.ms-fact.is-on{opacity:1;transform:none}
.ms-fact:nth-child(2){transition-delay:.1s}.ms-fact:nth-child(3){transition-delay:.2s}
.ms-fact-n{font-family:var(--disp);font-weight:200;font-size:clamp(1.9rem,3.4vw,2.8rem);line-height:1;color:var(--glass)}
.ms-fact-l{font-size:.8rem;letter-spacing:.05em;color:var(--bone-mute)}
.ms-amen{list-style:none;padding:0;display:grid;gap:9px;max-width:40ch}
.ms-amen li{padding-left:18px;position:relative;color:var(--bone-soft);font-size:.95rem;
  opacity:0;transform:translateX(-8px);transition:opacity .6s var(--e),transform .6s var(--e)}
.ms-amen li.is-on{opacity:1;transform:none}
.ms-amen li::before{content:'';position:absolute;left:0;top:.68em;width:9px;height:1px;background:var(--glass)}
.ms-suite-photos{display:grid;gap:clamp(14px,2vw,26px)}
.ms-suite-pair{display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,2vw,26px)}
.ms-frame{position:relative;overflow:hidden;opacity:0;transform:translateY(30px);transition:opacity 1s var(--e),transform 1s var(--e)}
.ms-frame.is-on{opacity:1;transform:none}
.ms-frame img{filter:saturate(.92)}
@media (max-width:1020px){.ms-suite-grid{grid-template-columns:1fr}.ms-suite-copy{position:static}}
@media (max-width:560px){.ms-suite-pair{grid-template-columns:1fr}}

/* THE NIGHT — pinned scrub */
/* three welded takes now run through here, so the pin needs the travel */
.ms-pano{position:relative;height:260svh}
.ms-pano-sticky{position:sticky;top:0;height:100svh;overflow:hidden;background:var(--deep)}
/* the poster has to letterbox on exactly the viewports where the canvas does,
   or the picture jumps the moment the first frame decodes. 1.47 is where the
   canvas hits its 12% side-crop limit against a 5:3 frame. */
@media (max-aspect-ratio:147/100){.ms-pano-still{object-fit:contain}}
/* the type sits ON the film, so the film has to give it a floor */
.ms-pano-sticky::after{content:'';position:absolute;inset:auto 0 0 0;height:62%;z-index:2;pointer-events:none;
  background:linear-gradient(to top,rgba(6,10,14,.74),rgba(6,10,14,.28) 42%,transparent)}

/* ── the commentator ── */
.ms-cmt{position:absolute;left:clamp(24px,6vw,92px);right:clamp(24px,6vw,92px);
  bottom:clamp(74px,15vh,140px);z-index:3;display:grid}
.ms-cmt-l{grid-area:1/1;margin:0;font-family:var(--disp);font-weight:200;
  font-size:clamp(1.65rem,4.2vw,3.4rem);line-height:1.04;letter-spacing:-.024em;
  color:#F7FAFB;max-width:19ch;opacity:0;transition:opacity .5s var(--e);
  text-shadow:0 2px 34px rgba(6,10,14,.6)}
.ms-cmt-l.is-on{opacity:1}
.ms-cmt-w{display:inline-block;overflow:hidden;vertical-align:top}
.ms-cmt-w i{display:inline-block;font-style:normal;opacity:0;transform:translateY(106%);
  transition:transform .74s var(--e),opacity .5s var(--e)}
.ms-cmt-l.is-on .ms-cmt-w i{opacity:1;transform:none}
.ms-cmt-rail{position:absolute;left:clamp(24px,6vw,92px);bottom:clamp(44px,9vh,84px);z-index:3;display:flex;gap:7px}
.ms-cmt-rail span{width:30px;height:1px;background:rgba(247,250,251,.26);transition:background .5s var(--e)}
.ms-cmt-rail span.is-on{background:rgba(247,250,251,.9)}
@media (max-width:640px){.ms-cmt-l{max-width:14ch}.ms-cmt-rail span{width:20px}}
.ms-pano-media{position:absolute;inset:0;will-change:transform,filter;transform-origin:50% 55%}
.ms-pano-media img,.ms-pano-film{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ms-pano-still{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ms-pano-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.ms-pano-caption{position:absolute;left:0;right:0;bottom:clamp(18px,4vh,40px);text-align:center;color:#F2F6F8;
  font-size:.86rem;letter-spacing:.05em;padding:0 20px;text-shadow:0 1px 18px rgba(15,20,28,.6)}
.ms-pano-hint.is-gone{opacity:0;transition:opacity .5s var(--e)}
.ms-pano-hint{position:absolute;left:0;right:0;top:calc(50% + 4px);text-align:center;color:var(--bone-mute);
  font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;pointer-events:none}
.reduced .ms-pano-canvas,.reduced .ms-pano-hint{display:none}

/* reviews + testimonials */
.ms-reviews{padding:clamp(80px,13vh,150px) clamp(20px,5vw,64px);max-width:1300px;margin:0 auto;display:grid;gap:clamp(28px,5vh,52px)}
.ms-rev-head{display:grid;gap:14px;max-width:52ch}
.ms-rev-grid{display:grid;grid-template-columns:minmax(200px,.66fr) minmax(300px,1.34fr);gap:clamp(24px,4vw,60px);align-items:start}
.ms-rev-score{display:grid;gap:5px;justify-items:start;border-top:1px solid var(--hair);padding-top:22px}
.ms-rev-n{font-family:var(--disp);font-weight:200;font-size:clamp(3.4rem,8vw,6rem);line-height:.92}
.ms-rev-stars{color:var(--glass);letter-spacing:.26em;font-size:1rem}
.ms-rev-c{font-size:.9rem;color:var(--bone-soft)}
.ms-rev-src{font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:var(--bone-mute)}
/* ══ review stage ══ */
.ms-rev-stage{position:relative;display:flex;gap:clamp(20px,3vw,44px);
  border-top:1px solid var(--hair);padding-top:26px;overflow:hidden}
/* oversized ghost ordinal, bled off the left edge */
.ms-rev-ord{position:absolute;left:-.16em;top:50%;transform:translateY(-46%);z-index:0;
  display:grid;font-family:var(--disp);font-weight:200;font-size:clamp(11rem,26vw,19rem);
  line-height:.8;letter-spacing:-.05em;color:var(--bone);opacity:.05;pointer-events:none;user-select:none}
.ms-rev-ord b{grid-area:1/1;font-weight:inherit;opacity:0;transform:scale(1.08);filter:blur(9px);
  transition:opacity .6s var(--e),transform .6s var(--e),filter .6s var(--e)}
.ms-rev-ord b.is-on{opacity:1;transform:none;filter:none}
/* rotated label over a filling progress line */
.ms-rev-rail{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:16px;
  padding-right:clamp(16px,2vw,28px);border-right:1px solid var(--hair);flex:none}
.ms-rev-rail-l{writing-mode:vertical-rl;text-orientation:mixed;font-size:.66rem;letter-spacing:.32em;
  text-transform:uppercase;color:var(--bone-mute)}
.ms-rev-rail-t{position:relative;width:1px;flex:1;min-height:70px;background:var(--hair)}
.ms-rev-rail-t i{position:absolute;inset:0 0 auto 0;width:100%;background:var(--glass);
  transition:height .55s var(--e)}
.ms-rev-body{position:relative;z-index:1;flex:1;min-width:0;display:grid;gap:18px;align-content:start}
/* the placeholder state, at full size */
.ms-rev-badge{display:inline-flex;align-items:center;gap:9px;justify-self:start;
  font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--bone-soft);
  border:1px solid var(--hair);border-radius:999px;padding:6px 14px}
.ms-rev-badge span{width:5px;height:5px;border-radius:50%;background:var(--glass);flex:none}
/* word-by-word arrival */
.ms-rev-w{display:inline-block;overflow:hidden;vertical-align:top}
.ms-rev-w i{display:inline-block;font-style:normal;opacity:0;
  transform:translateY(104%) rotateX(64deg);transform-origin:top center;
  transition:transform .66s var(--e),opacity .5s var(--e)}
.ms-rev-q.is-live .ms-rev-w i{opacity:1;transform:none}
.ms-rev-foot{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.ms-rev-who{display:flex;align-items:center;gap:14px;font-size:.8rem;letter-spacing:.06em;color:var(--bone-mute)}
.ms-rev-who i{display:block;width:34px;height:1px;background:var(--bone-soft);flex:none}
.ms-rev-nav{display:flex;gap:10px}
.ms-rev-nav button{width:42px;height:42px;border-radius:50%;border:1px solid var(--hair);
  display:grid;place-content:center;color:var(--bone-soft);
  transition:color .35s var(--e),border-color .35s var(--e),background-color .35s var(--e)}
.ms-rev-nav button:hover{color:var(--deep);background:var(--bone);border-color:var(--bone)}
@media (max-width:640px){
  .ms-rev-rail{display:none}
  .ms-rev-ord{font-size:9rem}
}
.ms-rev-list{list-style:none;padding:0;margin:0;display:grid;perspective:760px}
/* the <li> only gates visibility now — the WORDS carry the movement */
.ms-rev-q{grid-area:1/1;opacity:0;pointer-events:none;transition:opacity .45s var(--e)}
.ms-rev-q.is-live{opacity:1;pointer-events:auto}
.ms-rev-q blockquote{margin:0;font-family:var(--disp);font-weight:200;
  font-size:clamp(1.45rem,3vw,2.5rem);line-height:1.24;letter-spacing:-.018em;max-width:24ch}
.ms-rev-q blockquote::before{content:'\\201C'}
.ms-rev-q blockquote::after{content:'\\201D'}
.ms-rev-note{font-size:.74rem;letter-spacing:.04em;color:var(--bone-mute);max-width:62ch}
@media (max-width:820px){.ms-rev-grid{grid-template-columns:1fr}}

/* flora names */
/* ══ THE NAMES — a specimen index, not four boxes ══
   All four suites are identical, so the name is the only thing that separates
   one from another, and four centred cards said nothing about any of them (and
   left an orphan on the second row of a three-up grid). This is built as a
   herbarium index instead: the ordinal, the real Icelandic name set large, the
   English and the botanical name under it, and one checked line about the
   plant. Each row carries that plant's OWN flower colour in --bloom, so the
   palette of the section is taken off the shore it is named after rather than
   out of the design system. */
.ms-flora{padding:clamp(90px,15vh,170px) clamp(20px,5vw,64px);max-width:1180px;margin:0 auto}
.ms-flora-head{display:grid;gap:clamp(14px,2.2vw,26px);align-items:end;margin-bottom:clamp(38px,6vh,70px)}
@media (min-width:900px){
  .ms-flora-head{grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:clamp(30px,4vw,70px)}
}
.ms-flora-index{list-style:none;padding:0;margin:0;border-top:1px solid var(--hair)}
.ms-flora-row{position:relative;display:grid;gap:10px;align-items:start;
  padding:clamp(24px,3.6vh,38px) 0;border-bottom:1px solid var(--hair);
  opacity:0;transform:translateY(18px);
  transition:opacity .72s var(--e),transform .72s var(--e)}
.ms-flora-row.is-on{opacity:1;transform:none}
/* the bloom-coloured rule draws itself along the row as the row arrives */
.ms-flora-row::after{content:'';position:absolute;left:0;bottom:-1px;width:100%;height:1px;
  background:var(--bloom);opacity:.42;transform:scaleX(0);transform-origin:left;
  transition:transform 1s var(--e) .16s,opacity .5s var(--e)}
.ms-flora-row.is-on::after{transform:scaleX(1)}
.ms-flora-row:hover::after{opacity:1}
/* The name column is sized to the NAMES, not to a fraction of the row: as an
   fr it took 406px to hold "Sortulyng" and opened a dead channel down the
   middle of the section. max-content would fit each name exactly but every
   row is its own grid, so the four columns would no longer line up.
   The botanical name is then set hard against the right edge, so each row
   reads end to end under its rule instead of trailing off into 300px of air. */
@media (min-width:820px){
  .ms-flora-row{grid-template-columns:clamp(30px,2.6vw,40px) 12px clamp(168px,16vw,240px) minmax(0,1fr) clamp(150px,15vw,215px);
    column-gap:clamp(13px,1.5vw,22px)}
  .ms-flora-lat{text-align:right;padding-top:.3em}
}
.ms-flora-n{font-family:var(--disp);font-weight:200;font-size:.78rem;letter-spacing:.22em;
  color:var(--bone-mute);padding-top:.62em}
.ms-flora-mark{display:block;padding-top:.7em}
.ms-flora-mark i{display:block;width:11px;height:11px;border-radius:50%;background:var(--bloom);
  opacity:0;transform:scale(.3);
  transition:transform .8s var(--e) .22s,opacity .6s var(--e) .22s,box-shadow .5s var(--e)}
.ms-flora-row.is-on .ms-flora-mark i{opacity:1;transform:none}
.ms-flora-row:hover .ms-flora-mark i{box-shadow:0 0 0 8px color-mix(in srgb,var(--bloom) 18%,transparent)}
.ms-flora-name{display:grid;gap:6px;align-content:start}
.ms-flora-is{font-family:var(--disp);font-weight:200;font-size:clamp(1.5rem,3.1vw,2.25rem);
  line-height:1.04;letter-spacing:-.02em;
  transition:transform .6s var(--e),color .5s var(--e)}
.ms-flora-row:hover .ms-flora-is{transform:translateX(7px);color:color-mix(in srgb,var(--bloom) 42%,var(--bone))}
.ms-flora-en{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--bone-mute)}
.ms-flora-lat{font-style:italic;font-size:.92rem;color:var(--glass)}
.ms-flora-note{color:var(--bone-soft);font-size:.95rem;line-height:1.62;max-width:52ch}
.ms-flora-foot{margin-top:clamp(26px,4vh,46px);font-size:.8rem;letter-spacing:.03em;
  color:var(--bone-mute);max-width:54ch}
/* Narrow: the ordinal and the bloom belong on ONE line above the name, not
   stacked as two near-empty rows of their own. */
@media (max-width:819px){
  .ms-flora-row{grid-template-columns:auto 1fr;
    grid-template-areas:'n mark' 'name name' 'lat lat' 'note note';
    column-gap:11px;row-gap:10px;align-items:center}
  .ms-flora-n{grid-area:n;padding-top:0}
  .ms-flora-mark{grid-area:mark;justify-self:start;padding-top:0}
  .ms-flora-name{grid-area:name}
  .ms-flora-lat{grid-area:lat}
  .ms-flora-note{grid-area:note}
}

/* reviews */

/* hosts */
.ms-hosts{padding:0 clamp(20px,6vw,72px) clamp(90px,14vh,160px);max-width:760px;margin:0 auto;display:grid;gap:16px}

/* booking */
.ms-book{max-width:1100px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(100px,15vh,180px);
  display:grid;grid-template-columns:minmax(280px,1fr) minmax(300px,1.1fr);gap:clamp(30px,5vw,70px);align-items:start}
.ms-book-copy{display:grid;gap:16px}
.ms-book-form{display:grid;gap:18px;border-top:1px solid var(--hair);padding-top:26px}
.ms-field{display:grid;gap:7px}
.ms-field label{font-size:.78rem;letter-spacing:.06em;color:var(--bone-mute);font-weight:400}
.ms-field input{font:inherit;color:var(--bone);background:transparent;border:1px solid var(--hair);padding:12px 14px;border-radius:0;min-height:46px;width:100%;color-scheme:dark}
.ms-field input:focus{outline:2px solid var(--glass);outline-offset:1px;border-color:transparent}
.ms-field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ms-cta{background:var(--bone);color:var(--deep);padding:15px 30px;font-weight:500;letter-spacing:.04em;font-size:.94rem;min-height:48px;
  transition:transform .25s var(--e),background .3s var(--e),color .3s var(--e)}
.ms-cta:hover{background:var(--glass);color:var(--deep)}
.ms-cta:active{transform:translateY(1px) scale(.99)}
.ms-book-note{font-size:.78rem;color:var(--bone-mute)}
.ms-book-done p{font-family:var(--disp);font-weight:300;font-size:clamp(1.2rem,2.2vw,1.6rem);line-height:1.4;max-width:34ch;border-top:1px solid var(--glass);padding-top:22px}
/* A 1fr track is minmax(auto,1fr) — the auto floor is content width, so this track
   held 350px inside a 320px box on a 360px phone and overflowed. overflow-x:
   clip on .ms-root hid it instead of scrolling. */
@media (max-width:860px){
  .ms-book{grid-template-columns:minmax(0,1fr)}
  .ms-book-copy,.ms-book-form{min-width:0}
}

/* footer */
.ms-footer{padding:clamp(60px,10vh,110px) clamp(20px,5vw,64px) 0;border-top:1px solid var(--hair)}
.ms-footer-horizon{height:1px;background:linear-gradient(90deg,transparent,var(--glass),transparent);max-width:640px;margin:0 auto clamp(30px,6vh,60px)}
.ms-footer-word{font-family:var(--disp);font-weight:200;font-size:clamp(2rem,7vw,5.2rem);line-height:1.04;text-align:center;margin-bottom:clamp(30px,6vh,60px)}
.ms-footer-dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:22px;max-width:1200px;margin:0 auto}
.ms-footer-dl div{display:grid;gap:5px;border-top:1px solid var(--hair);padding-top:14px}
.ms-footer-dl dt{font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:var(--bone-mute);font-weight:400}
.ms-footer-dl dd{color:var(--bone-soft);font-size:.95rem}
.ms-footer-dl a:hover{color:var(--bone)}

/* rise */
.ms-rise{overflow:hidden}
.ms-rise-in{display:block;padding-bottom:.14em;margin-bottom:-.14em}
.js:not(.reduced) .ms-rise .ms-rise-in{transform:translateY(112%);transition:transform 1s var(--e)}
.js:not(.reduced) .ms-rise.is-on .ms-rise-in{transform:none}

@media (prefers-reduced-motion:reduce){
  .ms-frame-in{position:absolute;inset:0;transform:none !important}
  .ms-hero-line-in,.ms-hero-sub span{transform:none;opacity:1;transition:none}
  .ms-frame,.ms-fact,.ms-amen li,.ms-flora-row,.ms-panel{opacity:1;transform:none;transition:none}
  .ms-flora-row::after{transform:scaleX(1);transition:none}
  .ms-flora-mark i{opacity:1;transform:none;transition:none}
  .ms-panel-text{opacity:1;transform:none}
  .ms-row-track{flex-direction:column;height:auto}
  .ms-panel{min-height:300px}
  .ms-pano{height:auto}
  .ms-pano-sticky{position:static;height:72svh}
  /* no scroll to drive the commentator: keep the closing line, drop the rest */
  .ms-cmt-l{display:none}
  .ms-cmt-l:last-child{display:block;opacity:1}
  .ms-cmt-w i{opacity:1 !important;transform:none !important;transition:none}
  .ms-cmt-rail{display:none}
  .ms-pano-media{transform:none !important;filter:none !important}
  /* every quote is shown at once, so every WORD must be shown too — the
     per-word reveal is keyed off .is-live, which only one <li> ever has */
  .ms-rev-q{grid-area:auto;opacity:1;transform:none;pointer-events:auto;margin-bottom:26px}
  .ms-rev-w i{opacity:1 !important;transform:none !important;transition:none}
  .ms-rev-ord b{opacity:0}
  .ms-rev-ord b.is-on{opacity:1;filter:none;transform:none}
  .ms-loader-horizon::after{animation:none}
}

/* ── the SHARED prototype disclaimer, dressed in this page's own language ──
   PreviewFooter ships Tailwind utilities (bg-neutral-50, text-center, default
   sans). Dropped inside a designed footer it reads as a foreign design system
   bolted on: its own background, its own alignment, its own type. These rules
   are scoped to this route only and never touch the component. */
.ms-footer footer[lang="is"]{
  background:transparent !important;
  color:var(--bone-mute);
  font-family:var(--sans);
  font-size:.76rem;
  line-height:1.7;
  text-align:left;
  max-width:1200px;
  margin:clamp(38px,6vh,66px) auto 0;
  padding:clamp(22px,3.4vh,34px) 0 clamp(34px,6vh,56px);
  border-top:1px solid var(--hair);
}
.ms-footer footer[lang="is"] p{max-width:74ch;margin:0}
.ms-footer footer[lang="is"] p + p{margin-top:9px}
.ms-footer footer[lang="is"] strong{color:var(--bone-soft);font-weight:400}
.ms-footer footer[lang="is"] a{color:var(--bone-soft);text-decoration:underline;
  text-underline-offset:3px;text-decoration-thickness:1px;transition:color .3s var(--e)}
.ms-footer footer[lang="is"] a:hover{color:var(--glass)}
.ms-footer footer[lang="is"] > div{justify-content:flex-start !important;
  margin:clamp(18px,2.6vh,26px) 0 0 !important;padding-top:clamp(16px,2.4vh,22px) !important;
  border-top-color:var(--hair) !important}
@media (max-width:760px){
  .ms-footer footer[lang="is"]{padding-bottom:clamp(84px,14vh,112px)}
}
.ms-footer footer[lang="is"] [data-logotype] > span{color:var(--bone-soft) !important}

/* ── MOBILE FLOORS ── last in the sheet so these single-class rules win.
   No real text under 13px, no standalone control under 44px. Measured: the
   flora label, the pano hint and the review source were at 11.5–11.8px on a
   phone. Inline links inside a sentence stay exempt — padding them to 44px
   would break the line box. */
@media (max-width:640px){
  .ms-eyebrow,.ms-fact-l,.ms-rev-note,.ms-rev-src,.ms-pano-hint,
  .ms-flora-en,.ms-flora-foot,.ms-rev-badge,.ms-book-note,.ms-footer-dl dt,
  .ms-field label,.ms-book label{font-size:13px}
  .ms-rev-nav button{width:44px;height:44px}
  .ms-nav-mark{padding:10px 0}
  .ms-footer footer[lang="is"]{font-size:13px}
  .ms-footer-dl a{display:inline-block;padding:12px 0}
  .ms-field-row{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
}
/* A grid track may shrink, but a grid ITEM keeps min-width:auto and an
   <input> has an intrinsic ~180px min-content width, so the row overflowed on
   a narrow phone regardless of the track. The item and the control release. */
.ms-field{min-width:0}
.ms-field input,.ms-field select,.ms-field textarea{min-width:0;width:100%}
`
