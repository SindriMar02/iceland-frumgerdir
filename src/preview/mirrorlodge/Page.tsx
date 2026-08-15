import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, EMAIL, EMAIL_HREF, INSTAGRAM, LICENCE, NAV, HERO, STATEMENT,
  CABIN, SKY, PLACE, GALLERY, REVIEWS, JOURNEY, BOOKING, JSON_LD,
} from './data'

gsap.registerPlugin(ScrollTrigger)

const company = companyEntry

/* ── „Landslagið klæðir húsið" — the landscape wears the house. ─────────────
   A mirror-clad cabin has no colour of its own, so the page borrows its
   colour from the sky and hands the visitor a walk instead of a scroll.

   Two engines, welded together:
   · [[mirrorhouse-design-system]] — the SEAM-REVEAL wordmark (a hairline
     draws itself, MIRROR opens leftward out of it and LODGE rightward, then
     scroll keeps parting them while the rule grows past them), the PALETTE
     SCRUB (one master trigger lerps day → dusk → night across the whole
     document through three CSS vars on the root, so every section inherits
     the hour), and mix-blend-difference chrome that needs no bar.
   · [[drangar]]/NIB — the PINNED HORIZONTAL JOURNEY (a tween, never a
     timeline, driven with containerAnimation) and its image flow: two-copy
     FLIP PEELS where a clip-path inset uncovers the top copy while the
     oversized source below scales and drifts, one writer per image.

   Desktop ≥1024 and no reduced motion gets the journey; everything else is
   a plain vertical document with the same content and the same peels. ──── */

/* Palette — the hour is a variable, not a constant. Computed contrast at
   both ends of the scrub:
   INK #14181B on DAY  #F4F6F7 ....... 15.2:1 AAA
   BONE #EEF1F2 on NIGHT #10161C ..... 15.4:1 AAA
   MOSS #3F6B5B on DAY ............... 5.5:1 AA (small text safe)
   GLASS #8FC3B1 on NIGHT ............ 8.6:1 AA (small text safe) */
const DAY = '#F4F6F7'
const NIGHT = '#10161C'

const SEEN_KEY = 'ml_seen'

/* the scrub stops: canvas / ink / accent / hairline, in order of the day */
const HOURS = [
  { at: 0.00, canvas: '#F4F6F7', ink: '#14181B', accent: '#3F6B5B' },
  { at: 0.42, canvas: '#E4E7EA', ink: '#171C21', accent: '#3F6B5B' },
  { at: 0.72, canvas: '#5C6874', ink: '#F2F5F6', accent: '#A9D3C4' },
  { at: 1.00, canvas: '#10161C', ink: '#EEF1F2', accent: '#8FC3B1' },
]

const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const mixHex = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = hex(a); const [r2, g2, b2] = hex(b)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const bl = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r}, ${g}, ${bl})`
}
function hourAt(p: number) {
  let i = 0
  while (i < HOURS.length - 2 && p > HOURS[i + 1].at) i += 1
  const a = HOURS[i]; const b = HOURS[i + 1]
  const t = Math.min(1, Math.max(0, (p - a.at) / Math.max(0.0001, b.at - a.at)))
  return {
    canvas: mixHex(a.canvas, b.canvas, t),
    ink: mixHex(a.ink, b.ink, t),
    accent: mixHex(a.accent, b.accent, t),
  }
}

let pageLenis: Lenis | null = null

/* ── flip peel figure (drangar mechanism: two copies, --clip on the top,
      oversized source underneath so the parallax never exposes an edge) ── */
function Flip({
  src, alt, dir = 'up', scrub = false, par = true, className = '', priority = false,
}: {
  src: string; alt: string; dir?: 'up' | 'left' | 'right'; scrub?: boolean; par?: boolean; className?: string; priority?: boolean
}) {
  return (
    <figure
      className={`ml-flip ${par ? 'ml-par' : ''} ${className}`}
      data-ml-dir={dir}
      data-ml-scrub={scrub ? '1' : '0'}
    >
      <div className="ml-m ml-m-src">
        <img src={src} alt="" aria-hidden="true" loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </div>
      <div className="ml-m ml-m-up">
        <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </div>
    </figure>
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
        window.setTimeout(() => { onDone(); window.dispatchEvent(new CustomEvent('ml:revealed')) }, 220)
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
      <div className="ml-loader-line" aria-hidden="true" />
    </div>
  )
}

function Reviews() {
  const [i, setI] = useState(0)
  const n = REVIEWS.quotes.length
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setI((v) => (v + 1) % n), 7000)
    return () => window.clearInterval(t)
  }, [n])
  return (
    <div className="ml-rev">
      <div className="ml-rev-head">
        <h2 className="ml-h2">{REVIEWS.lead}</h2>
        <p className="ml-body">{REVIEWS.body}</p>
      </div>
      <div className="ml-rev-quotes">
        <ul className="ml-rev-list">
          {REVIEWS.quotes.map((q, idx) => (
            <li key={q.text} className={`ml-rev-q ${idx === i ? 'is-live' : ''}`} aria-hidden={idx !== i}>
              <blockquote>“{q.text}”</blockquote>
              <cite>{q.meta}</cite>
            </li>
          ))}
        </ul>
        <div className="ml-rev-dots" role="tablist" aria-label="Reviews">
          {REVIEWS.quotes.map((q, idx) => (
            <button key={q.text} type="button" role="tab" aria-selected={idx === i}
              aria-label={`Review ${idx + 1} of ${n}`}
              className={`ml-rev-dot ${idx === i ? 'is-on' : ''}`} onClick={() => setI(idx)} />
          ))}
        </div>
        <p className="ml-rev-note">{REVIEWS.sampleNote}</p>
      </div>
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
    } catch { /* private mode: the demo still succeeds */ }
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
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setThemeColor(DAY)
    document.title = 'Mirror Lodge Iceland — A mirror-glass cabin by Geysir'
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
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    root.classList.add('js')
    if (reduced) root.classList.add('reduced')

    const ctx = gsap.context(() => {
      /* ── THE SEAM REVEAL (mirrorhouse device 2) ── */
      const seam = root.querySelector<HTMLElement>('.ml-wm-seam')
      const wmL = root.querySelector<HTMLElement>('.ml-wm-l')
      const wmR = root.querySelector<HTMLElement>('.ml-wm-r')
      const heroEl = root.querySelector<HTMLElement>('.ml-hero')
      if (seam && wmL && wmR && heroEl && !reduced) {
        gsap.set(seam, { scaleY: 0 })
        gsap.set(wmL, { clipPath: 'inset(0% 0% 0% 100%)' })
        gsap.set(wmR, { clipPath: 'inset(0% 100% 0% 0%)' })
        const openFromTheLine = () => {
          gsap.timeline()
            .to(seam, { scaleY: 1, duration: 0.85, ease: 'expo.out' })
            .to([wmL, wmR], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out' }, '-=0.42')
            .from([wmL, wmR], { x: (i: number) => (i === 0 ? 26 : -26), duration: 1.5, ease: 'expo.out' }, '<')
        }
        if (document.querySelector('.ml-loader')) {
          window.addEventListener('ml:revealed', openFromTheLine, { once: true })
        } else {
          gsap.delayedCall(0.12, openFromTheLine)
        }
        const driveOn = { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 0.6 }
        gsap.to(wmL, { xPercent: -14, opacity: 0.08, ease: 'none', scrollTrigger: driveOn })
        gsap.to(wmR, { xPercent: 14, opacity: 0.08, ease: 'none', scrollTrigger: driveOn })
        gsap.to(seam, { scaleY: 3.4, opacity: 0, ease: 'none', scrollTrigger: driveOn })
      }

      /* ── THE PALETTE SCRUB (mirrorhouse device 1): ONE writer, three vars,
            every section inherits the hour. ── */
      const applyHour = (p: number) => {
        const h = hourAt(p)
        root.style.setProperty('--ml-canvas', h.canvas)
        root.style.setProperty('--ml-ink', h.ink)
        root.style.setProperty('--ml-accent', h.accent)
        root.classList.toggle('ml-night', p > 0.6)
        setThemeColor(p > 0.6 ? NIGHT : DAY)
      }
      applyHour(0)
      if (!reduced) {
        ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => applyHour(self.progress),
        })
      }

      /* ── flip peels: ONE writer per image (clip on the up copy, scale +
            drift on the source below) ── */
      const armFlips = (container: (t: Element) => ScrollTrigger.Vars) => {
        root.querySelectorAll<HTMLElement>('.ml-flip').forEach((fig) => {
          const up = fig.querySelector('.ml-m-up') as HTMLElement
          const src = fig.querySelector('.ml-m-src img') as HTMLElement
          if (!up || !src) return
          const dir = fig.dataset.mlDir ?? 'up'
          const scrub = fig.dataset.mlScrub === '1'
          const clipFrom = dir === 'up' ? 'inset(100% 0% 0% 0%)'
            : dir === 'right' ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)'
          const tl = gsap.timeline({ paused: true })
          tl.fromTo(up, { clipPath: clipFrom },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power2.out', immediateRender: true }, 0)
          tl.from(src, { scale: 1.2, duration: 2, ease: 'power2.out' }, 0)
          ScrollTrigger.create({
            ...container(fig),
            animation: tl,
            ...(scrub ? { scrub: 0.35, end: '+=75%' } : { toggleActions: 'play none none reverse' }),
          })
          if (fig.classList.contains('ml-par')) {
            const par = gsap.timeline({ paused: true })
            par.fromTo(src, { yPercent: 6 }, { yPercent: -6, ease: 'none' }, 0)
            ScrollTrigger.create({ ...container(fig), animation: par, scrub: 0.5, end: '+=120%' })
          }
        })
      }

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches && !reduced

      if (isDesktop) {
        /* ══ THE HORIZONTAL JOURNEY (drangar/NIB) ══ */
        const lenis = new Lenis()
        pageLenis = lenis
        lenis.on('scroll', ScrollTrigger.update)
        const raf = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)

        const journeyEl = root.querySelector<HTMLElement>('.ml-journey')!
        const track = root.querySelector<HTMLElement>('.ml-track')!
        const measureMaxX = () => track.scrollWidth - window.innerWidth
        /* containerAnimation REQUIRES a tween, not a timeline, or the track
           freezes at x=0 (budir §9.2) */
        const journeyTween = gsap.to(track, { x: () => -measureMaxX(), duration: 100, ease: 'none', force3D: true })
        const master = ScrollTrigger.create({
          animation: journeyTween,
          trigger: journeyEl,
          pin: journeyEl,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + measureMaxX(),
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const bar = root.querySelector<HTMLElement>('.ml-progress')
            if (bar) bar.style.transform = `scaleX(${self.progress})`
          },
        })
        void master
        armFlips((t) => ({ trigger: t, containerAnimation: journeyTween, start: 'left 88%' }))

        /* copy rises inside the journey ride the same container */
        root.querySelectorAll<HTMLElement>('.ml-rise').forEach((el) => {
          const inJourney = !!el.closest('.ml-journey')
          gsap.fromTo(el.querySelector('.ml-rise-in'), { yPercent: 112 }, {
            yPercent: 0, duration: 1, ease: 'expo.out',
            scrollTrigger: inJourney
              ? { trigger: el, containerAnimation: journeyTween, start: 'left 82%', once: true }
              : { trigger: el, start: 'top 88%', once: true },
          })
        })

        const refresh = () => ScrollTrigger.refresh()
        Promise.all([
          document.fonts?.ready ?? Promise.resolve(),
          ...Array.from(root.querySelectorAll('img')).map((im) =>
            im.complete ? Promise.resolve() : new Promise((res) => { im.addEventListener('load', res, { once: true }); im.addEventListener('error', res, { once: true }) })),
        ]).then(refresh)
      } else {
        armFlips((t) => ({ trigger: t, start: 'top 86%' }))
        if (!reduced) {
          root.querySelectorAll<HTMLElement>('.ml-rise').forEach((el) => {
            gsap.fromTo(el.querySelector('.ml-rise-in'), { yPercent: 112 }, {
              yPercent: 0, duration: 1, ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            })
          })
        }
      }
    }, rootRef)

    return () => {
      ctx.revert()
      if (pageLenis) { pageLenis.destroy(); pageLenis = null }
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [booted])

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    if (pageLenis) pageLenis.scrollTo(el, { offset: -10 })
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
        <button className={`ml-burger ${menuOpen ? 'is-x' : ''}`} aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((v) => !v)}>
          <i /><i />
        </button>
      </header>
      <div className={`ml-sheet ${menuOpen ? 'is-open' : ''}`} hidden={!menuOpen}>
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} style={{ transitionDelay: `${80 + i * 55}ms` }}
            onClick={(e) => { setMenuOpen(false); goTo(n.id)(e) }}>{n.label}</a>
        ))}
      </div>

      <main id="top">
        {/* ── HERO: the seam-reveal lockup over the cabin ── */}
        <section className="ml-hero">
          <div className="ml-hero-media">
            <img src={IMG.hero} alt="Mirror Lodge reflecting the winter landscape" loading="eager" decoding="async" />
          </div>
          <h1 className="ml-wordmark" aria-label={HERO.word}>
            <span className="ml-wm-word ml-wm-l">MIRROR</span>
            <span className="ml-wm-seam" aria-hidden="true" />
            <span className="ml-wm-word ml-wm-r">LODGE</span>
          </h1>
          <p className="ml-hero-sub"><span>{HERO.sub}</span></p>
        </section>

        {/* ── statement ── */}
        <section className="ml-statement">
          <h2 className="ml-rise ml-statement-lead"><span className="ml-rise-in">{STATEMENT.lead}</span></h2>
          <p className="ml-statement-body">{STATEMENT.body}</p>
        </section>

        {/* ══ THE JOURNEY — a walk through the cabin's day ══ */}
        <section className="ml-journey" id="spegill" aria-label={JOURNEY.label}>
          <div className="ml-track">
            {/* panel 1 — the mirror, full bleed */}
            <article className="ml-panel ml-panel-bleed">
              <Flip src={IMG.hero} alt="The cabin mirrored in the snow" dir="right" scrub par />
              <div className="ml-panel-chip">
                <span className="ml-kicker">The mirror</span>
                <p>Snow, birch, midnight sun, aurora. The cladding takes whatever the Golden Circle is doing.</p>
              </div>
            </article>

            {/* panel 2 — the cabin, copy + facts */}
            <article className="ml-panel ml-panel-copy" id="skalinn">
              <h2 className="ml-rise ml-h2"><span className="ml-rise-in">{CABIN.lead}</span></h2>
              <p className="ml-body">{CABIN.body}</p>
              <div className="ml-facts">
                {CABIN.facts.map((f) => (
                  <div className="ml-fact" key={f.l}>
                    <span className="ml-fact-n">{f.n}</span>
                    <span className="ml-fact-l">{f.l}</span>
                  </div>
                ))}
              </div>
              <ul className="ml-amen">{CABIN.amenities.map((a) => <li key={a}>{a}</li>)}</ul>
            </article>

            {/* panel 3 — inside, tall pair */}
            <article className="ml-panel ml-panel-pair">
              <Flip src={IMG.inside} alt="Inside the cabin, the bed under the skylight" dir="up" par />
              <Flip src={IMG.cabin6} alt="The mirror cladding up close" dir="up" par />
            </article>

            {/* panel 4 — the sky, full bleed */}
            <article className="ml-panel ml-panel-bleed">
              <Flip src={IMG.aurora} alt="Aurora over Mirror Lodge" dir="left" scrub par />
              <div className="ml-panel-chip">
                <span className="ml-kicker">{SKY.lead}</span>
                <p>{SKY.body}</p>
              </div>
            </article>

            {/* panel 5 — the place */}
            <article className="ml-panel ml-panel-copy" id="stadurinn">
              <h2 className="ml-rise ml-h2"><span className="ml-rise-in">{PLACE.lead}</span></h2>
              <p className="ml-body">{PLACE.body}</p>
              <ul className="ml-points">{PLACE.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </article>

            {/* panel 6 — geysir, full bleed */}
            <article className="ml-panel ml-panel-bleed">
              <Flip src={IMG.geysir} alt="Strokkur erupting at Geysir" dir="right" scrub par />
              <div className="ml-panel-chip">
                <span className="ml-kicker">Down the road</span>
                <p>Geysir is minutes away. Stay the night and have it after the buses leave.</p>
              </div>
            </article>

            {/* panel 7 — testimonials, riding the journey */}
            <article className="ml-panel ml-panel-rev">
              <Reviews />
            </article>
          </div>
          <div className="ml-progress-rail" aria-hidden="true"><i className="ml-progress" /></div>
        </section>

        {/* ── gallery ── */}
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
            <h2 className="ml-rise ml-h2"><span className="ml-rise-in">{BOOKING.title}</span></h2>
            <p className="ml-body">{BOOKING.body}</p>
          </div>
          <BookingForm />
        </section>

        {/* ── footer: resolves back to the day so the shared prototype
             disclaimer below it lands on a matching surface ── */}
        <footer className="ml-footer">
          <div className="ml-footer-word" aria-hidden="true">
            <span>MIRROR</span><i className="ml-footer-seam" /><span>LODGE</span>
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

/* ═════════════════════════════ STYLES ═══════════════════════════════════ */
const B = import.meta.env.BASE_URL
const STYLES = `
@font-face{font-family:'ClashDisplayMl';src:url('${B}fonts/clash-display/fonts/ClashDisplay-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'ClashDisplayMl';src:url('${B}fonts/clash-display/fonts/ClashDisplay-Extralight.woff2') format('woff2');font-weight:200;font-display:swap}
@font-face{font-family:'GeneralSansMl';src:url('${B}fonts/general-sans/GeneralSans-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'GeneralSansMl';src:url('${B}fonts/general-sans/GeneralSans-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'GeneralSansMl';src:url('${B}fonts/general-sans/GeneralSans-Medium.woff2') format('woff2');font-weight:500;font-display:swap}

.ml-root{
  /* the hour: written by ONE scrub, inherited by everything */
  --ml-canvas:${DAY}; --ml-ink:#14181B; --ml-accent:#3F6B5B;
  --ink-soft:color-mix(in srgb,var(--ml-ink) 78%,transparent);
  --ink-mute:color-mix(in srgb,var(--ml-ink) 56%,transparent);
  --hair:color-mix(in srgb,var(--ml-ink) 15%,transparent);
  --disp:'ClashDisplayMl','Helvetica Neue',sans-serif;
  --sans:'GeneralSansMl','Helvetica Neue',Arial,sans-serif;
  --e:cubic-bezier(.25,.9,.25,1);
  background:var(--ml-canvas); color:var(--ml-ink);
  font-family:var(--sans); font-weight:300; line-height:1.6;
  overflow-x:clip;
  transition:background-color .25s linear,color .25s linear;
}
.ml-root *{box-sizing:border-box;margin:0}
.ml-root img{display:block;width:100%;height:100%;object-fit:cover}
.ml-root a{color:inherit;text-decoration:none}
.ml-root :focus-visible{outline:2px solid var(--ml-accent);outline-offset:3px}
.ml-root button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}

/* loader */
.ml-loader{position:fixed;inset:0;z-index:80;background:${DAY};display:grid;place-content:center;gap:18px;text-align:center}
.ml-loader-word{font-family:var(--disp);font-weight:200;font-size:clamp(1.8rem,6vw,4rem);letter-spacing:.14em;
  background:linear-gradient(90deg,#14181B 50%,rgba(20,24,27,.18) 50%);background-size:200% 100%;background-position-x:var(--p,100%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
.ml-loader-line{width:96px;height:1px;background:rgba(20,24,27,.18);margin:0 auto;position:relative;overflow:hidden}
.ml-loader-line::after{content:'';position:absolute;inset:0;background:#3F6B5B;transform-origin:left;animation:ml-sweep 1.2s var(--e) infinite}
@keyframes ml-sweep{0%{transform:scaleX(0)}55%{transform:scaleX(1);transform-origin:left}56%{transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}

/* nav — no bar, self-theming */
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
.ml-sheet{position:fixed;inset:0;z-index:55;background:var(--ml-canvas);display:grid;place-content:center;gap:8px;text-align:center;
  opacity:0;pointer-events:none;transition:opacity .5s var(--e)}
.ml-sheet[hidden]{display:none}
.ml-sheet.is-open{opacity:1;pointer-events:auto}
.ml-sheet a{font-family:var(--disp);font-weight:200;font-size:clamp(1.8rem,7vw,2.8rem);letter-spacing:.06em;padding:.2em 0;
  opacity:0;transform:translateY(14px);transition:opacity .5s var(--e),transform .5s var(--e)}
.ml-sheet.is-open a{opacity:1;transform:none}
@media (max-width:860px){.ml-nav-links{display:none}.ml-burger{display:block}}

/* ── flip peel media (drangar mechanism) ── */
.ml-flip{position:relative;overflow:clip;display:block;background:color-mix(in srgb,var(--ml-ink) 8%,transparent)}
.ml-m{position:absolute;inset:0}
.ml-m-up{z-index:2}
.ml-par .ml-m-src img{height:116%;top:-8%;position:absolute}
.ml-flip img{filter:saturate(.9)}

/* hero */
.ml-hero{position:relative;min-height:100svh;display:grid}
.ml-hero-media{position:absolute;inset:0;overflow:hidden}
.ml-hero-media img{filter:saturate(.8) brightness(.95)}
.ml-hero-media::after{content:'';position:absolute;inset:0;
  background:radial-gradient(120% 60% at 50% 50%,rgba(16,22,28,.42) 0%,rgba(16,22,28,.12) 58%,transparent 80%),
             linear-gradient(to top,rgba(16,22,28,.5),transparent 46%)}
/* MIRROR | LODGE about a hairline */
.ml-wordmark{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;
  margin:0;pointer-events:none;color:#F2F6F8;mix-blend-mode:difference;
  font-family:var(--disp);font-size:clamp(34px,8.4vw,124px);line-height:1.02;font-weight:200}
.ml-wm-word{display:block;letter-spacing:.12em;white-space:nowrap;will-change:clip-path,transform}
.ml-wm-l{padding-right:.34em;margin-right:-.1em;text-align:right}
.ml-wm-r{padding-left:.34em;text-align:left}
.ml-wm-seam{flex:none;width:1px;height:.96em;background:currentColor;opacity:.85;transform-origin:50% 50%}
.ml-hero-sub{position:absolute;left:0;right:0;bottom:clamp(30px,7vh,80px);z-index:2;text-align:center;padding:0 20px;overflow:hidden}
.ml-hero-sub span{display:inline-block;color:#EDF1F2;font-size:clamp(.92rem,1.6vw,1.05rem);max-width:46ch;
  text-shadow:0 1px 16px rgba(16,22,28,.55)}
@media (max-width:640px){
  .ml-wordmark{flex-direction:column;gap:.1em;font-size:clamp(34px,12vw,64px)}
  .ml-wm-l,.ml-wm-r{padding:0;margin:0;text-align:center}
  .ml-wm-seam{width:.8em;height:1px}
}

/* statement */
.ml-statement{padding:clamp(90px,16vh,180px) clamp(20px,6vw,72px);max-width:900px;margin:0 auto;text-align:center}
.ml-statement-lead{overflow:hidden}
.ml-statement-lead .ml-rise-in{display:block;font-family:var(--disp);font-weight:300;font-size:clamp(1.7rem,4vw,3rem);line-height:1.16;
  padding-bottom:.12em;margin-bottom:-.12em}
.ml-statement-body{margin-top:24px;color:var(--ink-soft);font-size:clamp(1rem,1.8vw,1.15rem);max-width:58ch;margin-inline:auto}

/* ══ THE JOURNEY ══ */
.ml-journey{position:relative;overflow:clip}
.ml-track{display:flex;width:fit-content;align-items:stretch}
.ml-panel{position:relative;height:100svh;flex:none;display:grid}
.ml-panel-bleed{width:100vw}
.ml-panel-bleed .ml-flip{position:absolute;inset:0}
.ml-panel-chip{position:relative;z-index:3;align-self:end;justify-self:start;max-width:min(46ch,42vw);
  margin:0 0 clamp(30px,7vh,72px) clamp(24px,4vw,64px);
  background:color-mix(in srgb,var(--ml-canvas) 88%,transparent);color:var(--ml-ink);
  padding:clamp(18px,2.4vw,28px);border-top:1px solid var(--ml-accent);backdrop-filter:blur(6px)}
.ml-kicker{display:block;font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:8px}
.ml-panel-chip p{color:var(--ink-soft);font-size:.98rem;line-height:1.55}
.ml-panel-copy{width:min(92vw,760px);align-content:center;padding:0 clamp(24px,4vw,72px);gap:22px}
.ml-h2{overflow:hidden}
.ml-h2 .ml-rise-in{display:block;font-family:var(--disp);font-weight:300;font-size:clamp(1.5rem,2.9vw,2.4rem);line-height:1.18;
  padding-bottom:.14em;margin-bottom:-.14em}
.ml-body{color:var(--ink-soft);max-width:54ch}
.ml-facts{display:flex;gap:clamp(20px,3vw,44px)}
.ml-fact{display:grid;gap:2px}
.ml-fact-n{font-family:var(--disp);font-weight:200;font-size:clamp(1.9rem,3.4vw,2.9rem);line-height:1;color:var(--ml-accent)}
.ml-fact-l{font-size:.8rem;letter-spacing:.05em;color:var(--ink-mute)}
.ml-amen{list-style:none;padding:0;display:grid;gap:9px;max-width:42ch}
.ml-amen li{padding-left:18px;position:relative;color:var(--ink-soft);font-size:.95rem}
.ml-amen li::before{content:'';position:absolute;left:0;top:.68em;width:9px;height:1px;background:var(--ml-accent)}
.ml-points{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:10px}
.ml-points li{border:1px solid var(--hair);padding:9px 16px;font-size:.88rem;color:var(--ink-soft)}
.ml-panel-pair{width:min(96vw,860px);grid-template-columns:1fr 1fr;gap:clamp(14px,2vw,26px);align-content:center;padding:0 clamp(24px,3vw,48px)}
.ml-panel-pair .ml-flip{aspect-ratio:3/4}
/* testimonials panel */
.ml-panel-rev{width:min(96vw,900px);align-content:center;padding:0 clamp(24px,4vw,64px)}
.ml-rev{display:grid;gap:clamp(22px,4vh,44px)}
.ml-rev-head{display:grid;gap:14px;max-width:52ch}
.ml-rev-quotes{border-top:1px solid var(--hair);padding-top:24px;display:grid;gap:16px}
.ml-rev-list{list-style:none;padding:0;margin:0;display:grid}
.ml-rev-q{grid-area:1/1;opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .7s var(--e),transform .7s var(--e)}
.ml-rev-q.is-live{opacity:1;transform:none;pointer-events:auto}
.ml-rev-q blockquote{margin:0;font-family:var(--disp);font-weight:200;font-size:clamp(1.25rem,2.5vw,2rem);line-height:1.32;max-width:32ch}
.ml-rev-q cite{display:block;margin-top:14px;font-style:normal;font-size:.8rem;letter-spacing:.06em;color:var(--ink-mute)}
.ml-rev-dots{display:flex;gap:8px}
.ml-rev-dot{width:34px;height:2px;background:var(--hair);position:relative;padding:0;transition:background .4s var(--e)}
.ml-rev-dot::after{content:'';position:absolute;inset:-11px 0}
.ml-rev-dot.is-on{background:var(--ml-accent)}
.ml-rev-note{font-size:.74rem;color:var(--ink-mute)}
/* progress rail */
.ml-progress-rail{position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--hair);z-index:4}
.ml-progress{display:block;height:100%;background:var(--ml-accent);transform:scaleX(0);transform-origin:left}

/* the journey collapses to a plain document below 1024 / reduced motion */
@media (max-width:1023px){
  .ml-track{display:block;width:100%}
  .ml-panel{height:auto;width:auto !important;padding:clamp(60px,10vh,110px) clamp(20px,5vw,48px);gap:20px}
  .ml-panel-bleed{padding:0;min-height:72svh;display:grid}
  .ml-panel-bleed .ml-flip{position:absolute;inset:0}
  .ml-panel-chip{max-width:none;margin:0 clamp(16px,4vw,28px) clamp(20px,5vh,40px)}
  .ml-panel-pair{grid-template-columns:1fr 1fr}
  .ml-progress-rail{display:none}
}
.reduced .ml-track{display:block;width:100%}
.reduced .ml-panel{height:auto;width:auto !important}

/* gallery */
.ml-gallery{overflow:hidden;padding:clamp(70px,11vh,140px) 0}
.ml-gal-track{display:flex;gap:clamp(12px,1.6vw,22px);width:max-content;animation:ml-gal 60s linear infinite;padding:0 20px}
.ml-gallery:hover .ml-gal-track{animation-play-state:paused}
.ml-gal-item{width:clamp(220px,26vw,380px);aspect-ratio:3/2;overflow:hidden;flex:none}
.ml-gal-item img{filter:saturate(.88);transition:transform 1.1s var(--e)}
.ml-gal-item:hover img{transform:scale(1.06)}
@keyframes ml-gal{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.reduced .ml-gal-track{animation:none;flex-wrap:wrap;width:auto}

/* booking */
.ml-book{max-width:1100px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(90px,14vh,170px);
  display:grid;grid-template-columns:minmax(280px,1fr) minmax(300px,1.1fr);gap:clamp(30px,5vw,70px);align-items:start}
.ml-book-copy{display:grid;gap:16px}
.ml-book-form{display:grid;gap:18px;border-top:1px solid var(--hair);padding-top:26px}
.ml-field{display:grid;gap:7px}
.ml-field label{font-size:.78rem;letter-spacing:.06em;color:var(--ink-mute);font-weight:400}
.ml-field input{font:inherit;color:var(--ml-ink);background:transparent;border:1px solid var(--hair);padding:12px 14px;border-radius:0;min-height:46px;width:100%}
.ml-field input:focus{outline:2px solid var(--ml-accent);outline-offset:1px;border-color:transparent}
.ml-field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ml-night .ml-field input{color-scheme:dark}
.ml-cta{background:var(--ml-ink);color:var(--ml-canvas);padding:15px 30px;font-weight:400;letter-spacing:.04em;font-size:.94rem;min-height:48px;
  transition:transform .25s var(--e),background .3s var(--e)}
.ml-cta:hover{background:var(--ml-accent)}
.ml-cta:active{transform:translateY(1px) scale(.99)}
.ml-book-note{font-size:.78rem;color:var(--ink-mute)}
.ml-book-done p{font-family:var(--disp);font-weight:300;font-size:clamp(1.2rem,2.2vw,1.6rem);line-height:1.4;max-width:34ch;
  border-top:1px solid var(--ml-accent);padding-top:22px}
@media (max-width:860px){.ml-book{grid-template-columns:1fr}}

/* footer — returns to daylight so the shared disclaimer below matches */
.ml-footer{background:${DAY};color:#14181B;padding:clamp(50px,9vh,100px) clamp(20px,5vw,64px) 0;border-top:1px solid rgba(20,24,27,.12)}
.ml-footer-word{display:flex;align-items:center;justify-content:center;gap:.34em;margin-bottom:clamp(30px,6vh,58px)}
.ml-footer-word span{font-family:var(--disp);font-weight:200;font-size:clamp(1.9rem,7vw,5.4rem);letter-spacing:.14em;line-height:1.04}
.ml-footer-seam{flex:none;width:1px;height:.9em;background:#3F6B5B;opacity:.8}
.ml-footer-dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:22px;max-width:1200px;margin:0 auto}
.ml-footer-dl div{display:grid;gap:5px;border-top:1px solid rgba(20,24,27,.14);padding-top:14px}
.ml-footer-dl dt{font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(20,24,27,.55);font-weight:400}
.ml-footer-dl dd{color:rgba(20,24,27,.8);font-size:.95rem}
.ml-footer-dl a:hover{color:#14181B}

/* rise: resting state is visible; GSAP arms the hidden start only with js */
.ml-rise{overflow:hidden}
.ml-rise-in{display:block}

@media (prefers-reduced-motion:reduce){
  .ml-gal-track{animation:none;flex-wrap:wrap;width:auto}
  .ml-loader-line::after{animation:none}
  .ml-rev-q{grid-area:auto;opacity:1;transform:none;pointer-events:auto;margin-bottom:24px}
}
`
