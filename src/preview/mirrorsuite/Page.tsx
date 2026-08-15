import { useEffect, useRef, useState } from 'react'
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
   nameplates (Bearberry · Gleymmerey · Arctic Thyme), set as engraved
   pairs EN/IS. Engine: vanilla — one shared rAF drift loop + IO reveals,
   flex-grow accordion, no GSAP, no Lenis. ───────────────────────────────── */

/* Palette — dark ocean dusk, computed contrast:
   BONE #EEF0EA on DEEP #0F141C ...... 14.9:1 AAA
   GLASS #8FBFB0 on DEEP ............. 8.1:1 AA+ (small-text safe)
   DEEP on BONE ...................... 14.9:1 AAA */
const DEEP = '#0F141C'
const BONE = '#EEF0EA'

const SEEN_KEY = 'ms_seen'

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
    root.querySelectorAll('.ms-rise, .ms-frame, .ms-fact, .ms-amen li, .ms-name-card, .ms-row-track').forEach((el) => io.observe(el))
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
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
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
              <div className="ms-suite-pair">
                <Frame src={IMG.port1} alt="Suite detail" ratio="3/3.6" drift={8} />
                <Frame src={IMG.tall9} alt="Suite detail" ratio="3/3.6" drift={9} />
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
          <Rise as="h2" className="ms-h2 ms-center">{FLORA.lead}</Rise>
          <Rise as="p" className="ms-body ms-center">{FLORA.body}</Rise>
          <div className="ms-names">
            {FLORA.names.map((n, i) => (
              <div className="ms-name-card" key={n.en} style={{ transitionDelay: `${i * 110}ms` }}>
                <span className="ms-name-en">{n.en}</span>
                <span className="ms-name-is">{n.is}</span>
              </div>
            ))}
          </div>
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

    /* cover-fit blit */
    const draw = (im: CanvasImageSource, iw: number, ih: number) => {
      const cw = canvas.width; const ch = canvas.height
      const scale = Math.max(cw / iw, ch / ih)
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
      `${import.meta.env.BASE_URL}mirrorsuite/${dir}/f${String(n + 1).padStart(3, '0')}.jpg`

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
        <img ref={stillRef} className="ms-pano-still" src={IMG.pano}
          alt="The suites under the aurora on the shore" loading="eager" decoding="async" />
        <canvas ref={canvasRef} className="ms-pano-canvas" aria-hidden="true" />
        <p className="ms-pano-caption">{PANO.caption}</p>
        <p className="ms-pano-hint" aria-hidden="true">{PANO.note}</p>
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
        <div className="ms-rev-quotes">
          <ul className="ms-rev-list">
            {REVIEWS.quotes.map((q, idx) => (
              <li key={q.text} className={`ms-rev-q ${idx === i ? 'is-live' : ''}`} aria-hidden={idx !== i}>
                <blockquote>“{q.text}”</blockquote>
                <cite>{q.name} · {q.meta}</cite>
              </li>
            ))}
          </ul>
          <div className="ms-rev-dots" role="tablist" aria-label="Reviews">
            {REVIEWS.quotes.map((q, idx) => (
              <button
                key={q.text}
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={`Review ${idx + 1} of ${n}`}
                className={`ms-rev-dot ${idx === i ? 'is-on' : ''}`}
                onClick={() => setI(idx)}
              />
            ))}
          </div>
          <p className="ms-rev-note">{REVIEWS.sampleNote}</p>
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
.ms-pano{position:relative;height:260svh}
.ms-pano-sticky{position:sticky;top:0;height:100svh;overflow:hidden}
.ms-pano-media{position:absolute;inset:0;will-change:transform,filter;transform-origin:50% 55%}
.ms-pano-media img,.ms-pano-film{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ms-pano-still{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ms-pano-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.ms-pano-caption{position:absolute;left:0;right:0;bottom:clamp(18px,4vh,40px);text-align:center;color:#F2F6F8;
  font-size:.86rem;letter-spacing:.05em;padding:0 20px;text-shadow:0 1px 18px rgba(15,20,28,.6)}
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
.ms-rev-quotes{border-top:1px solid var(--hair);padding-top:22px;display:grid;gap:16px}
.ms-rev-list{list-style:none;padding:0;margin:0;display:grid}
.ms-rev-q{grid-area:1/1;opacity:0;transform:translateY(10px);pointer-events:none;
  transition:opacity .7s var(--e),transform .7s var(--e)}
.ms-rev-q.is-live{opacity:1;transform:none;pointer-events:auto}
.ms-rev-q blockquote{margin:0;font-family:var(--disp);font-weight:200;
  font-size:clamp(1.25rem,2.5vw,2rem);line-height:1.32;max-width:30ch}
.ms-rev-q cite{display:block;margin-top:14px;font-style:normal;font-size:.8rem;letter-spacing:.06em;color:var(--bone-mute)}
.ms-rev-dots{display:flex;gap:8px}
.ms-rev-dot{width:34px;height:2px;background:var(--hair);position:relative;padding:0;
  transition:background .4s var(--e)}
.ms-rev-dot::after{content:'';position:absolute;inset:-11px 0}
.ms-rev-dot.is-on{background:var(--glass)}
.ms-rev-note{font-size:.74rem;letter-spacing:.04em;color:var(--bone-mute)}
@media (max-width:820px){.ms-rev-grid{grid-template-columns:1fr}}

/* flora names */
.ms-flora{padding:clamp(90px,15vh,170px) clamp(20px,5vw,64px);max-width:1100px;margin:0 auto;display:grid;gap:22px}
.ms-names{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(14px,2vw,26px);margin-top:clamp(18px,4vh,40px)}
.ms-name-card{border:1px solid var(--hair);padding:clamp(22px,3.4vw,40px) clamp(16px,2.4vw,28px);display:grid;gap:8px;text-align:center;
  opacity:0;transform:translateY(20px);transition:opacity .8s var(--e),transform .8s var(--e),border-color .4s var(--e)}
.ms-name-card.is-on{opacity:1;transform:none}
.ms-name-card:hover{border-color:var(--glass)}
.ms-name-en{font-family:var(--disp);font-weight:300;font-size:clamp(1.2rem,2.4vw,1.8rem)}
.ms-name-is{color:var(--glass);font-size:.86rem;letter-spacing:.08em}
@media (max-width:700px){.ms-names{grid-template-columns:1fr}}

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
@media (max-width:860px){.ms-book{grid-template-columns:1fr}}

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
  .ms-frame,.ms-fact,.ms-amen li,.ms-name-card,.ms-panel{opacity:1;transform:none;transition:none}
  .ms-panel-text{opacity:1;transform:none}
  .ms-row-track{flex-direction:column;height:auto}
  .ms-panel{min-height:300px}
  .ms-pano{height:auto}
  .ms-pano-sticky{position:static;height:72svh}
  .ms-pano-media{transform:none !important;filter:none !important}
  .ms-rev-q{grid-area:auto;opacity:1;transform:none;pointer-events:auto;margin-bottom:26px}
  .ms-loader-horizon::after{animation:none}
}
`
