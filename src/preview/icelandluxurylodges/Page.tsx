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

/* ── Waterline figure: image + its live reflection under a seam ─────────── */
function Waterline({
  src, alt, drift = 9, reflH = 34, className = '', priority = false, videoSrc,
}: {
  src: string; alt: string; drift?: number; reflH?: number; className?: string; priority?: boolean; videoSrc?: string
}) {
  const imgRef = useRef<HTMLDivElement>(null)
  const reflRef = useRef<HTMLDivElement>(null)
  const [film, setFilm] = useState(false)
  useEffect(() => {
    const a = armDrift(imgRef.current, drift, 'img')
    const b = armDrift(reflRef.current, drift * 0.66, 'refl')
    return () => { a(); b() }
  }, [drift])
  useEffect(() => {
    if (!videoSrc || reduced) return
    const con = (navigator as { connection?: { saveData?: boolean } }).connection
    if (con?.saveData) return
    setFilm(true)
  }, [videoSrc])
  const dz = Math.max(9, drift * 1.35)
  return (
    <figure className={`ill-water ${className}`}>
      <div className="ill-water-frame" style={{ ['--dz' as string]: `${dz}%` }}>
        <div className="ill-water-in" ref={imgRef}>
          <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
          {film && (
            <video
              className="ill-water-film"
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
      <div className="ill-seam" aria-hidden="true" />
      <div className="ill-refl" style={{ height: `${reflH}%`, ['--dz' as string]: `${dz}%` }} aria-hidden="true">
        <div className="ill-water-in" ref={reflRef}>
          <img src={src} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async" />
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
      <div className="ill-water-in" ref={ref}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </figure>
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

  /* boot: loader decision + reveal wiring */
  useEffect(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setThemeColor(ICE)
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
    root.querySelectorAll('.ill-rise, .ill-rule, .ill-door, .ill-fact, .ill-amen li, .ill-frame, .ill-water').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [booted])

  /* hero words chain off the loader event, never a guessed delay */
  useEffect(() => {
    const onReveal = () => rootRef.current?.classList.add('is-revealed')
    window.addEventListener('ill:revealed', onReveal)
    return () => window.removeEventListener('ill:revealed', onReveal)
  }, [])

  /* nav: smooth anchor scroll (native; no Lenis on this page) */
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
      <div className={`ill-sheet ${menuOpen ? 'is-open' : ''}`} hidden={!menuOpen}>
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} style={{ transitionDelay: `${80 + i * 55}ms` }}
            onClick={(e) => { setMenuOpen(false); goTo(n.id)(e) }}>
            {n.label}
          </a>
        ))}
      </div>

      <main id="top">
        {/* ── HERO: the waterline ── */}
        <section className="ill-hero">
          <Waterline src={IMG.heroEstate} videoSrc="/icelandluxurylodges/hero-film.mp4" alt="An evening on the lodge deck: the hot tub steaming, the firepit lit, the hall glowing behind" drift={7} reflH={38} className="is-hero" priority />
          <div className="ill-hero-word" aria-label={HERO.word}>
            {HERO.lines.map((l, i) => (
              <span className="ill-hero-line" key={l}>
                <span className="ill-hero-line-in" style={{ transitionDelay: `${140 + i * 130}ms` }}>{l}</span>
              </span>
            ))}
          </div>
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
          <Waterline src={IMG.lodgeExterior} alt="Úlfljótsskáli at dusk" drift={6} reflH={30} className="is-footer" />
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
@font-face{font-family:'Gambarino';src:url('/fonts/gambarino/Gambarino-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('/fonts/switzer/Switzer-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('/fonts/switzer/Switzer-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('/fonts/switzer/Switzer-Medium.woff2') format('woff2');font-weight:500;font-display:swap}

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
  padding:clamp(14px,2.4vw,24px) clamp(18px,3.4vw,44px);mix-blend-mode:difference;color:#F2F6F8}
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
.ill-sheet{position:fixed;inset:0;z-index:55;background:var(--ice);display:grid;place-content:center;gap:8px;text-align:center;
  opacity:0;pointer-events:none;transition:opacity .5s var(--e)}
.ill-sheet[hidden]{display:none}
.ill-sheet.is-open{opacity:1;pointer-events:auto}
.ill-sheet a{font-family:var(--serif);font-size:clamp(1.7rem,7vw,2.6rem);padding:.22em 0;opacity:0;transform:translateY(14px);transition:opacity .5s var(--e),transform .5s var(--e)}
.ill-sheet.is-open a{opacity:1;transform:none}
@media (max-width:860px){.ill-nav-links{display:none}.ill-burger{display:block}}

/* ── waterline figure ── */
.ill-water{position:relative}
.ill-water-frame{position:relative;overflow:hidden}
.ill-water-in{position:absolute;inset:calc(-1 * var(--dz,9%)) 0;will-change:transform}
.ill-water-film{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ill-seam{height:1px;background:var(--ink);opacity:.6}
.ill-refl{position:relative;overflow:hidden;transform:scaleY(-1);filter:blur(2.5px) saturate(.72) brightness(1.04);opacity:.5;
  -webkit-mask-image:linear-gradient(to top,rgba(0,0,0,0) 4%,rgba(0,0,0,.85) 96%);mask-image:linear-gradient(to top,rgba(0,0,0,0) 4%,rgba(0,0,0,.85) 96%)}
.ill-refl::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(239,243,245,0),rgba(239,243,245,.65))}

/* ── hero ── */
.ill-hero{position:relative;min-height:100svh;display:grid;grid-template-rows:1fr auto}
.ill-hero .ill-water.is-hero{position:absolute;inset:0;display:grid;grid-template-rows:1fr 1px 38%}
.ill-hero .ill-water.is-hero .ill-water-frame{height:100%}
.ill-hero .ill-water.is-hero .ill-refl{height:100% !important}
.ill-hero-word{position:absolute;left:0;right:0;top:62%;transform:translateY(-104%);z-index:3;text-align:center;
  color:#F2F6F8;mix-blend-mode:difference;pointer-events:none}
.ill-hero-line{display:block;overflow:hidden;padding:.06em 0 .1em}
.ill-hero-line-in{display:block;font-family:var(--serif);font-size:clamp(2.6rem,8.6vw,7.4rem);line-height:1.02;letter-spacing:.005em;
  transform:translateY(112%);transition:transform 1.15s var(--e)}
.is-revealed .ill-hero-line-in{transform:none}
.ill-hero-sub{position:absolute;left:0;right:0;top:calc(62% + 18px);z-index:3;text-align:center;padding:0 20px;overflow:hidden}
.ill-hero-sub-in{display:inline-block;color:var(--ink-soft);font-size:clamp(.92rem,1.6vw,1.05rem);max-width:44ch;
  opacity:0;transform:translateY(16px);transition:opacity .9s var(--e) .7s,transform .9s var(--e) .7s}
.is-revealed .ill-hero-sub-in{opacity:1;transform:none}
@media (max-width:700px){.ill-hero-sub{top:calc(62% + 12px)}}

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
.ill-footer .ill-water.is-footer{display:grid;grid-template-rows:52svh 1px 16svh}
.ill-footer .ill-water.is-footer .ill-water-frame,.ill-footer .ill-water.is-footer .ill-refl{height:100%}
.ill-footer .ill-water.is-footer .ill-seam{background:var(--ice);opacity:.5}
.ill-footer .ill-water.is-footer .ill-refl::after{background:linear-gradient(to bottom,rgba(14,22,29,0),rgba(14,22,29,.94))}
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
  .ill-water-in{position:absolute;inset:0;transform:none !important}
  .ill-refl{display:none}
  .ill-hero-line-in,.ill-hero-sub-in{transform:none;opacity:1;transition:none}
  .ill-door,.ill-fact,.ill-amen li,.ill-frame{opacity:1;transform:none;transition:none}
  .ill-loader-line::after{animation:none}
}
.reduced .ill-refl{display:none}
`
