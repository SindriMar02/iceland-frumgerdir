import { useEffect, useRef, useState } from 'react'
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, EMAIL, EMAIL_HREF, INSTAGRAM, LICENCE, NAV, HERO, STATEMENT,
  MIRROR_STOPS, CABIN, SKY, PLACE, GALLERY, BOOKING, JSON_LD,
} from './data'

const company = companyEntry

/* ── „Landslagið klæðir húsið" — the landscape wears the house. ─────────────
   A mirror-clad cabin has no colour of its own. The page is built on that:
   THE MIRROR — a pinned frame where the cabin stays still while its
   reflected world wipes from snow to open land to aurora (clip-path inset,
   driven by scroll progress in the shared rAF; CSS sticky does the pin,
   no GSAP). The wordmark stands on its own true reflection (scaleY(-1)).
   Chrome register: silver canvas, graphite ink, one desaturated
   aurora-green accent. Clash Display + General Sans. ─────────────────────── */

/* Palette — computed contrast:
   GRAPHITE #14181B on SILVER #F4F6F7 ..... 15.2:1 AAA
   MOSS #3F6B5B on SILVER ................. 5.5:1 AA (small-text safe)
   SILVER on GRAPHITE ..................... 15.2:1 AAA */
const SILVER = '#F4F6F7'
const GRAPHITE = '#14181B'

const SEEN_KEY = 'ml_seen'

interface DriftNode { el: HTMLElement; d: number }
const driftSet = new Set<DriftNode>()
/** the pinned mirror registers a progress callback into the same loop */
const scrubSet = new Set<{ el: HTMLElement; fn: (p: number) => void }>()
let rafId = 0
let reduced = false

function loop() {
  rafId = 0
  if (!driftSet.size && !scrubSet.size) return
  const vh = window.innerHeight
  const dReads: { n: DriftNode; p: number; vis: boolean }[] = []
  driftSet.forEach((n) => {
    const r = n.el.getBoundingClientRect()
    dReads.push({
      n,
      p: (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2),
      vis: r.bottom > -80 && r.top < vh + 80,
    })
  })
  const sReads: { s: { el: HTMLElement; fn: (p: number) => void }; p: number }[] = []
  scrubSet.forEach((s) => {
    const r = s.el.getBoundingClientRect()
    const total = r.height - vh
    if (total <= 0) return
    sReads.push({ s, p: Math.min(1, Math.max(0, -r.top / total)) })
  })
  for (const { n, p, vis } of dReads) {
    if (!vis) continue
    n.el.style.transform = `translate3d(0, ${(-p * n.d).toFixed(3)}%, 0)`
  }
  for (const { s, p } of sReads) s.fn(p)
  rafId = requestAnimationFrame(loop)
}
function armDrift(el: HTMLElement | null, d: number) {
  if (!el || reduced) return () => {}
  const n = { el, d }
  driftSet.add(n)
  if (!rafId) rafId = requestAnimationFrame(loop)
  return () => { driftSet.delete(n); el.style.transform = '' }
}
function armScrub(el: HTMLElement | null, fn: (p: number) => void) {
  if (!el || reduced) return () => {}
  const s = { el, fn }
  scrubSet.add(s)
  if (!rafId) rafId = requestAnimationFrame(loop)
  return () => { scrubSet.delete(s) }
}

function Frame({ src, alt, drift = 10, ratio = '4/3' }: { src: string; alt: string; drift?: number; ratio?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => armDrift(ref.current, drift), [drift])
  const dz = Math.max(9, drift * 1.35)
  return (
    <figure className="ml-frame" style={{ ['--dz' as string]: `${dz}%`, aspectRatio: ratio }}>
      <div className="ml-frame-in" ref={ref}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </figure>
  )
}

function Rise({ as: Tag = 'div', className = '', children }: { as?: 'div' | 'h2' | 'h3' | 'p'; className?: string; children: React.ReactNode }) {
  return (
    <Tag className={`ml-rise ${className}`}>
      <span className="ml-rise-in">{children}</span>
    </Tag>
  )
}

/* ── THE MIRROR: pinned wipe through their own photos ───────────────────── */
function MirrorPin() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    return armScrub(wrapRef.current, (p) => {
      const n = MIRROR_STOPS.length
      /* layer i wipes in over segment [i-1, i] of n-1 segments */
      for (let i = 1; i < n; i++) {
        const el = layerRefs.current[i]
        if (!el) continue
        const seg = (p * (n - 1)) - (i - 1)
        const t = Math.min(1, Math.max(0, seg))
        el.style.clipPath = `inset(0 ${((1 - t) * 100).toFixed(2)}% 0 0)`
      }
    })
  }, [])
  return (
    <section className="ml-mirror" id="spegill" ref={wrapRef} aria-label="The cabin through its seasons">
      <div className="ml-mirror-sticky">
        {MIRROR_STOPS.map((s, i) => (
          <div
            className="ml-mirror-layer"
            key={s.img}
            ref={(el) => { layerRefs.current[i] = el }}
            style={i === 0 ? undefined : { clipPath: 'inset(0 100% 0 0)' }}
          >
            <img src={IMG[s.img]} alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
          </div>
        ))}
        <p className="ml-mirror-caption">Snow, open land, aurora. The mirror takes whatever comes.</p>
      </div>
    </section>
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
        window.setTimeout(() => { onDone(); window.dispatchEvent(new CustomEvent('ml:revealed')) }, 240)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])
  return (
    <div className="ml-loader" role="status" aria-label="Loading">
      <div className="ml-loader-word" style={{ ['--p' as string]: `${100 - pct}%` }}>MIRROR LODGE</div>
      <div className="ml-loader-refl" style={{ ['--p' as string]: `${100 - pct}%` }} aria-hidden="true">MIRROR LODGE</div>
    </div>
  )
}

function BookingForm() {
  const [sent, setSent] = useState(false)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      const key = 'ml_demo_requests'
      const prev = JSON.parse(localStorage.getItem(key) || '[]')
      prev.push({ ...Object.fromEntries(fd.entries()), at: new Date().toISOString() })
      localStorage.setItem(key, JSON.stringify(prev))
    } catch { /* private mode: demo still succeeds */ }
    setSent(true)
  }
  if (sent) return <div className="ml-book-done" role="status"><p>{BOOKING.success}</p></div>
  return (
    <form className="ml-book-form" onSubmit={onSubmit}>
      <div className="ml-field-row">
        <div className="ml-field">
          <label htmlFor="ml-in">Arrival</label>
          <input id="ml-in" name="arrival" type="date" required />
        </div>
        <div className="ml-field">
          <label htmlFor="ml-out">Departure</label>
          <input id="ml-out" name="departure" type="date" required />
        </div>
      </div>
      <div className="ml-field-row">
        <div className="ml-field">
          <label htmlFor="ml-name">Name</label>
          <input id="ml-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="ml-field">
          <label htmlFor="ml-email">Email</label>
          <input id="ml-email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>
      <button className="ml-cta" type="submit">Send the request</button>
      <p className="ml-book-note">Demo prototype: the request is stored only in this browser.</p>
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
    setThemeColor(SILVER)
    const forced = new URLSearchParams(window.location.search).has('loader')
    let seen = false
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1' } catch { seen = true }
    if (!reduced && (forced || !seen)) {
      setShowLoader(true)
      try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    } else {
      setBooted(true)
      window.setTimeout(() => window.dispatchEvent(new CustomEvent('ml:revealed')), 60)
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
    root.querySelectorAll('.ml-rise, .ml-frame, .ml-fact, .ml-amen li, .ml-point, .ml-gal-item').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [booted])

  useEffect(() => {
    const onReveal = () => rootRef.current?.classList.add('is-revealed')
    window.addEventListener('ml:revealed', onReveal)
    return () => window.removeEventListener('ml:revealed', onReveal)
  }, [])

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div className="ml-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {showLoader && !booted && <Preloader onDone={() => setBooted(true)} />}

      <header className="ml-nav">
        <a className="ml-nav-mark" href="#top" onClick={goTo('top')}>MIRROR LODGE</a>
        <nav className="ml-nav-links" aria-label="Sections">
          {NAV.map((n) => <a key={n.id} href={`#${n.id}`} onClick={goTo(n.id)}>{n.label}</a>)}
        </nav>
        <button
          className={`ml-burger ${menuOpen ? 'is-x' : ''}`}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        ><i /><i /></button>
      </header>
      <div className={`ml-sheet ${menuOpen ? 'is-open' : ''}`} hidden={!menuOpen}>
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} style={{ transitionDelay: `${80 + i * 55}ms` }}
            onClick={(e) => { setMenuOpen(false); goTo(n.id)(e) }}>{n.label}</a>
        ))}
      </div>

      <main id="top">
        {/* ── hero: photo + reflected wordmark ── */}
        <section className="ml-hero">
          <HeroMedia />
          <div className="ml-hero-lockup">
            <h1 className="ml-hero-word" aria-label={HERO.word}>
              <span className="ml-hero-word-in">MIRROR LODGE</span>
            </h1>
            <div className="ml-hero-word ml-hero-word-refl" aria-hidden="true">
              <span className="ml-hero-word-in">MIRROR LODGE</span>
            </div>
            <p className="ml-hero-sub"><span>{HERO.sub}</span></p>
          </div>
        </section>

        {/* ── statement ── */}
        <section className="ml-statement">
          <Rise as="h2" className="ml-statement-lead">{STATEMENT.lead}</Rise>
          <Rise as="p" className="ml-statement-body">{STATEMENT.body}</Rise>
        </section>

        {/* ── THE MIRROR (pinned wipe) ── */}
        <MirrorPin />

        {/* ── the cabin ── */}
        <section className="ml-cabin" id="skalinn">
          <div className="ml-cabin-grid">
            <div className="ml-cabin-copy">
              <Rise as="h2" className="ml-h2">{CABIN.lead}</Rise>
              <Rise as="p" className="ml-body">{CABIN.body}</Rise>
              <div className="ml-facts" role="list">
                {CABIN.facts.map((f) => (
                  <div className="ml-fact" role="listitem" key={f.l}>
                    <span className="ml-fact-n">{f.n}</span>
                    <span className="ml-fact-l">{f.l}</span>
                  </div>
                ))}
              </div>
              <ul className="ml-amen">
                {CABIN.amenities.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
            <div className="ml-cabin-photos">
              <Frame src={IMG.inside} alt="Inside the cabin, bed under the skylight" ratio="4/3" drift={10} />
              <Frame src={IMG.cabin3} alt="The cabin on the property" ratio="4/3" drift={9} />
              <Frame src={IMG.cabin6} alt="The mirror cladding up close" ratio="4/3" drift={9} />
            </div>
          </div>
        </section>

        {/* ── skylight / aurora band ── */}
        <section className="ml-sky">
          <div className="ml-sky-media">
            <img src={IMG.aurora} alt="Aurora over Mirror Lodge" loading="lazy" decoding="async" />
          </div>
          <div className="ml-sky-copy">
            <Rise as="h2" className="ml-h2">{SKY.lead}</Rise>
            <Rise as="p" className="ml-body">{SKY.body}</Rise>
          </div>
        </section>

        {/* ── the place ── */}
        <section className="ml-place" id="stadurinn">
          <div className="ml-place-grid">
            <div className="ml-place-copy">
              <Rise as="h2" className="ml-h2">{PLACE.lead}</Rise>
              <Rise as="p" className="ml-body">{PLACE.body}</Rise>
              <ul className="ml-points">
                {PLACE.points.map((p) => <li className="ml-point" key={p}>{p}</li>)}
              </ul>
            </div>
            <Frame src={IMG.geysir} alt="Strokkur erupting at Geysir" ratio="3/2.6" drift={11} />
          </div>
        </section>

        {/* ── gallery strip ── */}
        <section className="ml-gallery" aria-label="Gallery">
          <div className="ml-gal-track">
            {GALLERY.map((g) => (
              <figure className="ml-gal-item" key={g.img}>
                <img src={IMG[g.img]} alt={g.alt} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </section>

        {/* ── booking ── */}
        <section className="ml-book" id="bokun">
          <div className="ml-book-copy">
            <Rise as="h2" className="ml-h2">{BOOKING.title}</Rise>
            <Rise as="p" className="ml-body">{BOOKING.body}</Rise>
          </div>
          <BookingForm />
        </section>

        {/* ── footer ── */}
        <footer className="ml-footer">
          <div className="ml-footer-word" aria-hidden="true">
            <span>MIRROR LODGE</span>
            <span className="ml-footer-word-refl">MIRROR LODGE</span>
          </div>
          <dl className="ml-footer-dl">
            <div><dt>Email</dt><dd><a href={EMAIL_HREF}>{EMAIL}</a></dd></div>
            <div><dt>Follow</dt><dd><a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a></dd></div>
            <div><dt>Licence</dt><dd>{LICENCE}</dd></div>
          </dl>
          <PreviewFooter company={company} />
        </footer>
      </main>
      <PreviewChrome company={company} />
    </div>
  )
}

/* hero media with drift, split out so the ref wiring stays tidy */
function HeroMedia() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => armDrift(ref.current, 8), [])
  return (
    <div className="ml-hero-media" style={{ ['--dz' as string]: '11%' }}>
      <div className="ml-frame-in" ref={ref}>
        <img src={IMG.hero} alt="Mirror Lodge mirrored in the winter landscape" loading="eager" decoding="async" />
      </div>
    </div>
  )
}

/* ═════════════════════════════ STYLES ═══════════════════════════════════ */
const STYLES = `
@font-face{font-family:'ClashDisplayMl';src:url('/fonts/clash-display/fonts/ClashDisplay-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'ClashDisplayMl';src:url('/fonts/clash-display/fonts/ClashDisplay-Extralight.woff2') format('woff2');font-weight:200;font-display:swap}
@font-face{font-family:'GeneralSansMl';src:url('/fonts/general-sans/GeneralSans-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'GeneralSansMl';src:url('/fonts/general-sans/GeneralSans-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'GeneralSansMl';src:url('/fonts/general-sans/GeneralSans-Medium.woff2') format('woff2');font-weight:500;font-display:swap}

.ml-root{
  --silver:${SILVER}; --ink:${GRAPHITE}; --moss:#3F6B5B;
  --ink-soft:rgba(20,24,27,.78); --ink-mute:rgba(20,24,27,.58);
  --silver-soft:rgba(244,246,247,.85); --silver-mute:rgba(244,246,247,.6);
  --hair:rgba(20,24,27,.13); --hair-silver:rgba(244,246,247,.22);
  --disp:'ClashDisplayMl','Helvetica Neue',sans-serif;
  --sans:'GeneralSansMl','Helvetica Neue',Arial,sans-serif;
  --e:cubic-bezier(.25,.9,.25,1);
  background:var(--silver); color:var(--ink);
  font-family:var(--sans); font-weight:300; line-height:1.6;
  overflow-x:clip;
}
.ml-root *{box-sizing:border-box;margin:0}
.ml-root img{display:block;width:100%;height:100%;object-fit:cover}
.ml-root a{color:inherit;text-decoration:none}
.ml-root :focus-visible{outline:2px solid var(--moss);outline-offset:3px}
.ml-root button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}

/* loader: wordmark + its true reflection fill together */
.ml-loader{position:fixed;inset:0;z-index:80;background:var(--silver);display:grid;place-content:center;text-align:center}
.ml-loader-word,.ml-loader-refl{font-family:var(--disp);font-weight:200;font-size:clamp(1.8rem,6vw,4rem);letter-spacing:.14em;
  background:linear-gradient(90deg,var(--ink) 50%,rgba(20,24,27,.18) 50%);background-size:200% 100%;background-position-x:var(--p,100%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
.ml-loader-refl{transform:scaleY(-1);opacity:.28;
  -webkit-mask-image:linear-gradient(to top,rgba(0,0,0,0) 15%,#000 90%);mask-image:linear-gradient(to top,rgba(0,0,0,0) 15%,#000 90%)}

/* nav */
.ml-nav{position:fixed;inset:0 0 auto 0;z-index:60;display:flex;align-items:center;justify-content:space-between;
  padding:clamp(14px,2.4vw,22px) clamp(18px,3.4vw,44px);mix-blend-mode:difference;color:#F2F6F8}
.ml-nav-mark{font-family:var(--disp);font-weight:300;letter-spacing:.16em;font-size:.92rem}
.ml-nav-links{display:flex;gap:clamp(14px,2vw,26px);font-size:.82rem;font-weight:400;letter-spacing:.04em}
.ml-nav-links a{opacity:.82;transition:opacity .3s var(--e)}
.ml-nav-links a:hover{opacity:1}
.ml-burger{display:none;width:44px;height:44px;position:relative}
.ml-burger i{position:absolute;left:11px;right:11px;height:1.5px;background:currentColor;transition:transform .45s var(--e),top .45s var(--e)}
.ml-burger i:first-child{top:18px}.ml-burger i:last-child{top:26px}
.ml-burger.is-x i:first-child{top:22px;transform:rotate(45deg)}
.ml-burger.is-x i:last-child{top:22px;transform:rotate(-45deg)}
.ml-sheet{position:fixed;inset:0;z-index:55;background:var(--silver);display:grid;place-content:center;gap:8px;text-align:center;
  opacity:0;pointer-events:none;transition:opacity .5s var(--e)}
.ml-sheet[hidden]{display:none}
.ml-sheet.is-open{opacity:1;pointer-events:auto}
.ml-sheet a{font-family:var(--disp);font-weight:200;font-size:clamp(1.8rem,7vw,2.8rem);letter-spacing:.06em;padding:.2em 0;
  opacity:0;transform:translateY(14px);transition:opacity .5s var(--e),transform .5s var(--e)}
.ml-sheet.is-open a{opacity:1;transform:none}
@media (max-width:860px){.ml-nav-links{display:none}.ml-burger{display:block}}

/* hero */
.ml-hero{position:relative;min-height:100svh;display:grid}
.ml-hero-media{position:absolute;inset:0;overflow:hidden}
.ml-frame-in{position:absolute;inset:calc(-1 * var(--dz,9%)) 0;will-change:transform}
.ml-hero-media img{filter:saturate(.82)}
.ml-hero-media::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(20,24,27,.42),rgba(20,24,27,.05) 45%)}
.ml-hero-lockup{position:relative;z-index:2;align-self:end;justify-self:center;text-align:center;padding-bottom:clamp(34px,8vh,90px)}
.ml-hero-word{overflow:hidden;color:#F2F6F8;mix-blend-mode:difference}
.ml-hero-word-in{display:block;font-family:var(--disp);font-weight:200;font-size:clamp(2.3rem,8vw,6.6rem);letter-spacing:.12em;line-height:1.06;
  transform:translateY(112%);transition:transform 1.2s var(--e)}
.is-revealed .ml-hero-word-in{transform:none}
.ml-hero-word-refl{opacity:.3;transform:scaleY(-1);margin-top:-2px;
  -webkit-mask-image:linear-gradient(to top,rgba(0,0,0,0) 30%,#000 96%);mask-image:linear-gradient(to top,rgba(0,0,0,0) 30%,#000 96%)}
.ml-hero-word-refl .ml-hero-word-in{transition-delay:.06s}
.ml-hero-sub{margin-top:18px;overflow:hidden}
.ml-hero-sub span{display:inline-block;color:#EDF1F2;font-size:clamp(.92rem,1.6vw,1.05rem);max-width:44ch;text-shadow:0 1px 14px rgba(20,24,27,.4);
  opacity:0;transform:translateY(14px);transition:opacity .9s var(--e) .75s,transform .9s var(--e) .75s}
.is-revealed .ml-hero-sub span{opacity:1;transform:none}

/* statement */
.ml-statement{padding:clamp(90px,16vh,180px) clamp(20px,6vw,72px);max-width:880px;margin:0 auto;text-align:center}
.ml-statement-lead .ml-rise-in{font-family:var(--disp);font-weight:300;font-size:clamp(1.7rem,4vw,3rem);line-height:1.16;letter-spacing:.01em}
.ml-statement-body{margin-top:24px}
.ml-statement-body .ml-rise-in{color:var(--ink-soft);font-size:clamp(1rem,1.8vw,1.15rem);max-width:58ch;margin:0 auto}

/* THE MIRROR */
.ml-mirror{height:320svh;position:relative}
.ml-mirror-sticky{position:sticky;top:0;height:100svh;overflow:hidden}
.ml-mirror-layer{position:absolute;inset:0;will-change:clip-path}
.ml-mirror-layer img{filter:saturate(.88)}
.ml-mirror-caption{position:absolute;left:0;right:0;bottom:clamp(20px,4vh,44px);text-align:center;color:#F2F6F8;mix-blend-mode:difference;
  font-size:.86rem;letter-spacing:.05em;padding:0 20px}
.reduced .ml-mirror{height:auto}
.reduced .ml-mirror-sticky{position:static;height:auto;display:grid;gap:2px}
.reduced .ml-mirror-layer{position:static;clip-path:none !important;aspect-ratio:16/9}

/* cabin */
.ml-cabin{padding:clamp(90px,15vh,170px) clamp(20px,5vw,64px);max-width:1500px;margin:0 auto}
.ml-cabin-grid{display:grid;grid-template-columns:minmax(300px,5fr) 7fr;gap:clamp(28px,4.5vw,64px);align-items:start}
.ml-cabin-copy{position:sticky;top:96px;display:grid;gap:22px}
.ml-h2 .ml-rise-in{font-family:var(--disp);font-weight:300;font-size:clamp(1.5rem,2.8vw,2.3rem);line-height:1.18;letter-spacing:.01em}
.ml-body .ml-rise-in{color:var(--ink-soft);max-width:52ch}
.ml-facts{display:flex;gap:clamp(20px,3vw,40px)}
.ml-fact{display:grid;gap:2px;opacity:0;transform:translateY(14px);transition:opacity .7s var(--e),transform .7s var(--e)}
.ml-fact.is-on{opacity:1;transform:none}
.ml-fact:nth-child(2){transition-delay:.1s}.ml-fact:nth-child(3){transition-delay:.2s}
.ml-fact-n{font-family:var(--disp);font-weight:200;font-size:clamp(1.9rem,3.4vw,2.8rem);line-height:1;color:var(--moss)}
.ml-fact-l{font-size:.8rem;letter-spacing:.05em;color:var(--ink-mute)}
.ml-amen{list-style:none;padding:0;display:grid;gap:9px;max-width:40ch}
.ml-amen li{padding-left:18px;position:relative;color:var(--ink-soft);font-size:.95rem;
  opacity:0;transform:translateX(-8px);transition:opacity .6s var(--e),transform .6s var(--e)}
.ml-amen li.is-on{opacity:1;transform:none}
.ml-amen li::before{content:'';position:absolute;left:0;top:.68em;width:9px;height:1px;background:var(--moss)}
.ml-cabin-photos{display:grid;gap:clamp(14px,2vw,26px)}
.ml-frame{position:relative;overflow:hidden;opacity:0;transform:translateY(30px);transition:opacity 1s var(--e),transform 1s var(--e)}
.ml-frame.is-on{opacity:1;transform:none}
.ml-frame img{filter:saturate(.9)}
@media (max-width:1020px){.ml-cabin-grid{grid-template-columns:1fr}.ml-cabin-copy{position:static}}

/* sky band */
.ml-sky{position:relative;min-height:92svh;display:grid;align-content:end;isolation:isolate}
.ml-sky-media{position:absolute;inset:0;z-index:-1}
.ml-sky-media::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(20,24,27,.78),rgba(20,24,27,.08) 55%)}
.ml-sky-copy{padding:clamp(30px,6vw,70px);max-width:760px;color:var(--silver);display:grid;gap:16px}
.ml-sky-copy .ml-h2 .ml-rise-in{color:var(--silver)}
.ml-sky-copy .ml-body .ml-rise-in{color:var(--silver-soft)}

/* place */
.ml-place{padding:clamp(90px,15vh,170px) clamp(20px,5vw,64px);max-width:1400px;margin:0 auto}
.ml-place-grid{display:grid;grid-template-columns:minmax(300px,1fr) minmax(300px,1.1fr);gap:clamp(28px,5vw,70px);align-items:center}
.ml-place-copy{display:grid;gap:20px}
.ml-points{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:10px}
.ml-point{border:1px solid var(--hair);padding:9px 16px;font-size:.88rem;color:var(--ink-soft);
  opacity:0;transform:translateY(10px);transition:opacity .6s var(--e),transform .6s var(--e)}
.ml-point.is-on{opacity:1;transform:none}
.ml-point:nth-child(2){transition-delay:.08s}.ml-point:nth-child(3){transition-delay:.16s}.ml-point:nth-child(4){transition-delay:.24s}
@media (max-width:900px){.ml-place-grid{grid-template-columns:1fr}}

/* gallery: one slow marquee row (the page's single marquee) */
.ml-gallery{overflow:hidden;padding:0 0 clamp(90px,14vh,160px)}
.ml-gal-track{display:flex;gap:clamp(12px,1.6vw,22px);width:max-content;animation:ml-gal 60s linear infinite;padding:0 20px}
.ml-gallery:hover .ml-gal-track{animation-play-state:paused}
.ml-gal-item{width:clamp(220px,26vw,380px);aspect-ratio:3/2;overflow:hidden;flex:none;
  opacity:0;transform:translateY(20px);transition:opacity .8s var(--e),transform .8s var(--e)}
.ml-gal-item.is-on{opacity:1;transform:none}
.ml-gal-item img{filter:saturate(.88);transition:transform 1.1s var(--e)}
.ml-gal-item:hover img{transform:scale(1.06)}
@keyframes ml-gal{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.reduced .ml-gal-track{animation:none;flex-wrap:wrap;width:auto}

/* booking */
.ml-book{max-width:1100px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(100px,15vh,180px);
  display:grid;grid-template-columns:minmax(280px,1fr) minmax(300px,1.1fr);gap:clamp(30px,5vw,70px);align-items:start}
.ml-book-copy{display:grid;gap:16px}
.ml-book-form{display:grid;gap:18px;border-top:1px solid var(--hair);padding-top:26px}
.ml-field{display:grid;gap:7px}
.ml-field label{font-size:.78rem;letter-spacing:.06em;color:var(--ink-mute);font-weight:400}
.ml-field input{font:inherit;color:var(--ink);background:transparent;border:1px solid var(--hair);padding:12px 14px;border-radius:0;min-height:46px;width:100%}
.ml-field input:focus{outline:2px solid var(--moss);outline-offset:1px;border-color:transparent}
.ml-field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ml-cta{background:var(--ink);color:var(--silver);padding:15px 30px;font-weight:400;letter-spacing:.04em;font-size:.94rem;min-height:48px;
  transition:transform .25s var(--e),background .3s var(--e)}
.ml-cta:hover{background:var(--moss)}
.ml-cta:active{transform:translateY(1px) scale(.99)}
.ml-book-note{font-size:.78rem;color:var(--ink-mute)}
.ml-book-done p{font-family:var(--disp);font-weight:300;font-size:clamp(1.2rem,2.2vw,1.6rem);line-height:1.4;max-width:34ch;border-top:1px solid var(--moss);padding-top:22px}
@media (max-width:860px){.ml-book{grid-template-columns:1fr}}

/* footer */
.ml-footer{background:var(--ink);color:var(--silver);padding:clamp(60px,10vh,110px) clamp(20px,5vw,64px) 0}
.ml-footer-word{display:grid;justify-items:center;margin-bottom:clamp(30px,6vh,60px)}
.ml-footer-word span{font-family:var(--disp);font-weight:200;font-size:clamp(2rem,7.4vw,5.8rem);letter-spacing:.14em;line-height:1.04}
.ml-footer-word-refl{transform:scaleY(-1);opacity:.22;
  -webkit-mask-image:linear-gradient(to top,rgba(0,0,0,0) 35%,#000 96%);mask-image:linear-gradient(to top,rgba(0,0,0,0) 35%,#000 96%)}
.ml-footer-dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:22px;max-width:1200px;margin:0 auto}
.ml-footer-dl div{display:grid;gap:5px;border-top:1px solid var(--hair-silver);padding-top:14px}
.ml-footer-dl dt{font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:var(--silver-mute);font-weight:400}
.ml-footer-dl dd{color:var(--silver-soft);font-size:.95rem}
.ml-footer-dl a:hover{color:var(--silver)}

/* rise */
.ml-rise{overflow:hidden}
.ml-rise-in{display:block;padding-bottom:.14em;margin-bottom:-.14em}
.js:not(.reduced) .ml-rise .ml-rise-in{transform:translateY(112%);transition:transform 1s var(--e)}
.js:not(.reduced) .ml-rise.is-on .ml-rise-in{transform:none}

@media (prefers-reduced-motion:reduce){
  .ml-frame-in{position:absolute;inset:0;transform:none !important}
  .ml-hero-word-in,.ml-hero-sub span{transform:none;opacity:1;transition:none}
  .ml-frame,.ml-fact,.ml-amen li,.ml-point,.ml-gal-item{opacity:1;transform:none;transition:none}
  .ml-gal-track{animation:none;flex-wrap:wrap;width:auto}
  .ml-mirror{height:auto}
  .ml-mirror-sticky{position:static;height:auto;display:grid;gap:2px}
  .ml-mirror-layer{position:static;clip-path:none !important;aspect-ratio:16/9}
}
`
