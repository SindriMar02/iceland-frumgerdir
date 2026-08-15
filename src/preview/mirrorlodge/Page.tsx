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
  CABIN, SKY, PLACE, GALLERY, REVIEWS, BOOKING, JSON_LD,
} from './data'

gsap.registerPlugin(ScrollTrigger)

const company = companyEntry

/* ── „Landslagið klæðir húsið" — the landscape wears the house. ─────────────
   A mirror-clad cabin has no colour of its own, so the page stays quiet and
   lets the photographs carry every colour on it. The visitor walks the
   property sideways instead of scrolling down it.

   Two devices, both transplanted at source:
   · [[mirrorhouse-design-system]] — the SEAM-REVEAL wordmark: a hairline
     draws itself, MIRROR opens leftward out of it and LODGE rightward, then
     scroll keeps parting them while the rule grows past them.
   · [[drangar]]/NIB — the PINNED HORIZONTAL JOURNEY (a tween, never a
     timeline, driven through containerAnimation) and its image flow: two-copy
     FLIP PEELS where a clip-path uncovers the top copy while the oversized
     source beneath scales and drifts. One writer per image.

   TWO THINGS DELIBERATELY REMOVED after review, both worth keeping out:
   1. NO palette scrub. Mirror House lerps its whole palette because its
      concept is "scroll is one night" — one cabin, one night. This page's
      concept is the CLADDING, not the hour, so the scrub fit nothing; worse,
      interpolating canvas and ink independently put body copy at grey-on-grey
      through the middle of the ramp. One committed palette instead, legible
      at every scroll position.
   2. NO text cards over photographs. A translucent blurred box on an image is
      the house style of every templated page on the internet. Image panels
      here are PURE image; type gets its own panels with real air around it,
      and the only type that ever sits on a photograph is a single caption
      line over a soft gradient — no box, no blur, no border. ───────────── */

/* Palette — one committed set, measured:
   INK #14171A on PAPER #EFEFED ...... 15.1:1 AAA
   MOSS #3D6A5A on PAPER ............. 5.6:1 AA (small text safe)
   PAPER on INK ...................... 15.1:1 AAA */
const PAPER = '#EFEFED'
const INK = '#14171A'
const MOSS = '#3D6A5A'

const SEEN_KEY = 'ml_seen'

let pageLenis: Lenis | null = null

/* ── flip peel figure (drangar mechanism) ── */
function Flip({
  src, alt, dir = 'up', scrub = false, par = true, className = '', priority = false,
}: {
  src: string; alt: string; dir?: 'up' | 'left' | 'right'; scrub?: boolean; par?: boolean; className?: string; priority?: boolean
}) {
  return (
    <figure className={`ml-flip ${par ? 'ml-par' : ''} ${className}`} data-ml-dir={dir} data-ml-scrub={scrub ? '1' : '0'}>
      <div className="ml-m ml-m-src">
        <img src={src} alt="" aria-hidden="true" loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </div>
      <div className="ml-m ml-m-up">
        <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </div>
    </figure>
  )
}

/** A full-bleed image panel. Pure photograph; at most one caption line, set
 *  directly on a soft gradient — never in a box. */
function Plate({
  src, alt, ord, caption, dir = 'right',
}: { src: string; alt: string; ord: string; caption?: string; dir?: 'up' | 'left' | 'right' }) {
  return (
    <article className="ml-panel ml-plate">
      <Flip src={src} alt={alt} dir={dir} scrub par />
      <span className="ml-plate-ord" aria-hidden="true">{ord}</span>
      {caption && <p className="ml-plate-cap">{caption}</p>}
    </article>
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
      <p className="ml-eyebrow">Guests</p>
      <ul className="ml-rev-list">
        {REVIEWS.quotes.map((q, idx) => (
          <li key={q.text} className={`ml-rev-q ${idx === i ? 'is-live' : ''}`} aria-hidden={idx !== i}>
            <blockquote>{q.text}</blockquote>
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
    setThemeColor(PAPER)
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
      /* ── THE SEAM REVEAL ── */
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

      /* nav register swap at the foot of the hero */
      const navEl = root.querySelector('.ml-nav')
      if (navEl && heroEl) {
        ScrollTrigger.create({
          trigger: heroEl,
          start: 'bottom 72px',
          onEnter: () => navEl.classList.add('is-past'),
          onLeaveBack: () => navEl.classList.remove('is-past'),
        })
      }

      /* ── flip peels ── */
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
          tl.from(src, { scale: 1.18, duration: 2, ease: 'power2.out' }, 0)
          ScrollTrigger.create({
            ...container(fig),
            animation: tl,
            ...(scrub ? { scrub: 0.35, end: '+=75%' } : { toggleActions: 'play none none reverse' }),
          })
          if (fig.classList.contains('ml-par')) {
            const par = gsap.timeline({ paused: true })
            par.fromTo(src, { yPercent: 5 }, { yPercent: -5, ease: 'none' }, 0)
            ScrollTrigger.create({ ...container(fig), animation: par, scrub: 0.5, end: '+=120%' })
          }
        })
      }

      /* type: one mask-rise per heading, quiet fades for everything else */
      const armRises = (container?: (t: Element) => ScrollTrigger.Vars) => {
        root.querySelectorAll<HTMLElement>('.ml-rise').forEach((el) => {
          const inJourney = !!el.closest('.ml-journey')
          const inner = el.querySelector('.ml-rise-in')
          if (!inner) return
          gsap.fromTo(inner, { yPercent: 118 }, {
            yPercent: 0, duration: 1.15, ease: 'expo.out',
            scrollTrigger: (inJourney && container) ? container(el) : { trigger: el, start: 'top 88%', once: true },
          })
        })
        root.querySelectorAll<HTMLElement>('.ml-fade').forEach((el) => {
          const inJourney = !!el.closest('.ml-journey')
          gsap.fromTo(el, { opacity: 0, y: 18 }, {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: (inJourney && container) ? container(el) : { trigger: el, start: 'top 90%', once: true },
          })
        })
      }

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches && !reduced

      if (isDesktop) {
        /* ══ THE HORIZONTAL JOURNEY ══ */
        const lenis = new Lenis()
        pageLenis = lenis
        lenis.on('scroll', ScrollTrigger.update)
        const raf = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)

        const journeyEl = root.querySelector<HTMLElement>('.ml-journey')!
        const track = root.querySelector<HTMLElement>('.ml-track')!
        const measureMaxX = () => track.scrollWidth - window.innerWidth
        const journeyTween = gsap.to(track, { x: () => -measureMaxX(), duration: 100, ease: 'none', force3D: true })
        ScrollTrigger.create({
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
        armFlips((t) => ({ trigger: t, containerAnimation: journeyTween, start: 'left 92%' }))
        armRises((t) => ({ trigger: t, containerAnimation: journeyTween, start: 'left 86%', once: true }))

        Promise.all([
          document.fonts?.ready ?? Promise.resolve(),
          ...Array.from(root.querySelectorAll('img')).map((im) =>
            im.complete ? Promise.resolve() : new Promise((res) => { im.addEventListener('load', res, { once: true }); im.addEventListener('error', res, { once: true }) })),
        ]).then(() => ScrollTrigger.refresh())
      } else {
        armFlips((t) => ({ trigger: t, start: 'top 86%' }))
        if (!reduced) armRises()
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
      <div className={`ml-sheet ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} style={{ transitionDelay: `${80 + i * 55}ms` }}
            onClick={(e) => { setMenuOpen(false); goTo(n.id)(e) }}>{n.label}</a>
        ))}
      </div>

      <main id="top">
        {/* ── HERO ── */}
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
          <p className="ml-statement-body ml-fade">{STATEMENT.body}</p>
        </section>

        {/* ══ THE JOURNEY — image panels stay pure, type gets its own air ══ */}
        <section className="ml-journey" id="spegill" aria-label="The property">
          <div className="ml-track">
            <Plate src={IMG.hero} ord="I" dir="right"
              alt="The cabin mirrored in the snow"
              caption="Snow, birch, midnight sun, aurora. The cladding takes whatever the Golden Circle is doing." />

            <article className="ml-panel ml-type" id="skalinn">
              <p className="ml-eyebrow ml-fade">The cabin</p>
              <h2 className="ml-rise ml-display"><span className="ml-rise-in">{CABIN.lead}</span></h2>
              <p className="ml-body ml-fade">{CABIN.body}</p>
              <div className="ml-facts ml-fade">
                {CABIN.facts.map((f) => (
                  <div className="ml-fact" key={f.l}>
                    <span className="ml-fact-n">{f.n}</span>
                    <span className="ml-fact-l">{f.l}</span>
                  </div>
                ))}
              </div>
              <ul className="ml-amen ml-fade">{CABIN.amenities.map((a) => <li key={a}>{a}</li>)}</ul>
            </article>

            {/* lower-resolution interiors: shown inset, never full-bleed */}
            <article className="ml-panel ml-duo">
              <Flip src={IMG.inside} alt="Breakfast brought to the bed inside the cabin" dir="up" par />
              <Flip src={IMG.cabin6} alt="The mirror cladding up close" dir="up" par />
            </article>

            <Plate src={IMG.aurora} ord="II" dir="left"
              alt="Aurora over Mirror Lodge"
              caption="End of August to early April, the aurora comes straight through the skylight." />

            <article className="ml-panel ml-type">
              <p className="ml-eyebrow ml-fade">The sky</p>
              <h2 className="ml-rise ml-display"><span className="ml-rise-in">{SKY.lead}</span></h2>
              <p className="ml-body ml-fade">{SKY.body}</p>
            </article>

            <Plate src={IMG.wide2} ord="III" dir="right"
              alt="The cabin in the open land" />

            <article className="ml-panel ml-type" id="stadurinn">
              <p className="ml-eyebrow ml-fade">The place</p>
              <h2 className="ml-rise ml-display"><span className="ml-rise-in">{PLACE.lead}</span></h2>
              <p className="ml-body ml-fade">{PLACE.body}</p>
              <ul className="ml-points ml-fade">{PLACE.points.map((p) => <li key={p}>{p}</li>)}</ul>
              <figure className="ml-inset ml-fade">
                <img src={IMG.geysir} alt="Strokkur erupting at Geysir" loading="lazy" decoding="async" />
              </figure>
            </article>

            <article className="ml-panel ml-type ml-type-rev">
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
            <p className="ml-eyebrow ml-fade">Booking</p>
            <h2 className="ml-rise ml-display"><span className="ml-rise-in">{BOOKING.title}</span></h2>
            <p className="ml-body ml-fade">{BOOKING.body}</p>
          </div>
          <BookingForm />
        </section>

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
  --paper:${PAPER}; --ink:${INK}; --moss:${MOSS};
  --ink-soft:rgba(20,23,26,.74); --ink-mute:rgba(20,23,26,.5);
  --hair:rgba(20,23,26,.14);
  --disp:'ClashDisplayMl','Helvetica Neue',sans-serif;
  --sans:'GeneralSansMl','Helvetica Neue',Arial,sans-serif;
  --e:cubic-bezier(.25,.9,.25,1);
  background:var(--paper); color:var(--ink);
  font-family:var(--sans); font-weight:300; line-height:1.6;
  overflow-x:clip;
}
.ml-root *{box-sizing:border-box;margin:0}
.ml-root img{display:block;width:100%;height:100%;object-fit:cover}
.ml-root a{color:inherit;text-decoration:none}
.ml-root :focus-visible{outline:2px solid var(--moss);outline-offset:3px}
.ml-root button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}

/* one editorial type system */
.ml-eyebrow{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-mute);font-weight:400}
.ml-display{overflow:hidden}
.ml-display .ml-rise-in{display:block;font-family:var(--disp);font-weight:200;
  font-size:clamp(2rem,4.2vw,3.6rem);line-height:1.08;letter-spacing:-.012em;
  padding-bottom:.14em;margin-bottom:-.14em}
.ml-body{color:var(--ink-soft);font-size:clamp(1rem,1.15vw,1.08rem);line-height:1.66;max-width:50ch}

/* loader */
.ml-loader{position:fixed;inset:0;z-index:80;background:var(--paper);display:grid;place-content:center;gap:18px;text-align:center}
.ml-loader-word{font-family:var(--disp);font-weight:200;font-size:clamp(1.8rem,6vw,4rem);letter-spacing:.14em;
  background:linear-gradient(90deg,${INK} 50%,rgba(20,23,26,.16) 50%);background-size:200% 100%;background-position-x:var(--p,100%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
.ml-loader-line{width:96px;height:1px;background:var(--hair);margin:0 auto;position:relative;overflow:hidden}
.ml-loader-line::after{content:'';position:absolute;inset:0;background:var(--moss);transform-origin:left;animation:ml-sweep 1.2s var(--e) infinite}
@keyframes ml-sweep{0%{transform:scaleX(0)}55%{transform:scaleX(1);transform-origin:left}56%{transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}

/* nav */
.ml-nav{position:fixed;inset:0 0 auto 0;z-index:60;display:flex;align-items:center;justify-content:space-between;
  padding:clamp(14px,2.4vw,22px) clamp(18px,3.4vw,44px);color:#F5F8F9;
  transition:color .45s var(--e),background-color .45s var(--e)}
.ml-nav::before{content:'';position:absolute;inset:0;z-index:-1;pointer-events:none;
  background:linear-gradient(to bottom,rgba(16,22,28,.44),transparent);transition:opacity .45s var(--e)}
.ml-nav.is-past{color:var(--ink);background:rgba(239,239,237,.88);backdrop-filter:blur(10px);box-shadow:0 1px 0 var(--hair)}
.ml-nav.is-past::before{opacity:0}
.ml-nav-mark{font-family:var(--disp);font-weight:300;letter-spacing:.16em;font-size:.92rem}
.ml-nav-links{display:flex;gap:clamp(14px,2vw,26px);font-size:.82rem;font-weight:400;letter-spacing:.04em}
.ml-nav-links a{opacity:.82;transition:opacity .3s var(--e)}
.ml-nav-links a:hover{opacity:1}
.ml-burger{display:none;width:44px;height:44px;position:relative}
.ml-burger i{position:absolute;left:11px;right:11px;height:1.5px;background:currentColor;transition:transform .45s var(--e),top .45s var(--e)}
.ml-burger i:first-child{top:18px}.ml-burger i:last-child{top:26px}
.ml-burger.is-x i:first-child{top:22px;transform:rotate(45deg)}
.ml-burger.is-x i:last-child{top:22px;transform:rotate(-45deg)}
.ml-sheet{position:fixed;inset:0;z-index:55;background:var(--paper);display:grid;place-content:center;gap:2px;text-align:center;
  opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity .5s var(--e),visibility 0s linear .5s}
.ml-sheet.is-open{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .5s var(--e),visibility 0s linear 0s}
.ml-sheet a{font-family:var(--disp);font-weight:200;font-size:clamp(1.8rem,7vw,2.8rem);padding:.34em .2em;
  opacity:0;transform:translateY(20px);transition:opacity .5s var(--e),transform .55s var(--e);
  text-transform:uppercase;letter-spacing:.16em}
.ml-sheet.is-open a{opacity:1;transform:none}
@media (max-width:860px){.ml-nav-links{display:none}.ml-burger{display:block}}

/* flip peel media */
.ml-flip{position:relative;overflow:clip;display:block;background:rgba(20,23,26,.06)}
.ml-m{position:absolute;inset:0}
.ml-m-up{z-index:2}
.ml-par .ml-m-src img{height:114%;top:-7%;position:absolute}
.ml-flip img{filter:saturate(.92)}

/* hero */
.ml-hero{position:relative;min-height:100svh;display:grid}
.ml-hero-media{position:absolute;inset:0;overflow:hidden}
.ml-hero-media img{filter:saturate(.82) brightness(.95)}
.ml-hero-media::after{content:'';position:absolute;inset:0;
  background:radial-gradient(120% 60% at 50% 50%,rgba(16,22,28,.4) 0%,rgba(16,22,28,.1) 58%,transparent 80%),
             linear-gradient(to top,rgba(16,22,28,.48),transparent 46%)}
.ml-wordmark{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;
  margin:0;pointer-events:none;color:#F6F9FA;
  font-family:var(--disp);font-size:clamp(34px,8.4vw,124px);line-height:1.02;font-weight:200;
  text-shadow:0 2px 30px rgba(16,22,28,.42)}
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
.ml-statement{padding:clamp(100px,17vh,190px) clamp(20px,6vw,72px);max-width:1000px;margin:0 auto}
.ml-statement-lead{overflow:hidden}
.ml-statement-lead .ml-rise-in{display:block;font-family:var(--disp);font-weight:200;
  font-size:clamp(1.9rem,4.6vw,3.4rem);line-height:1.12;letter-spacing:-.014em;padding-bottom:.12em;margin-bottom:-.12em}
.ml-statement-body{margin-top:26px;color:var(--ink-soft);font-size:clamp(1rem,1.5vw,1.15rem);max-width:56ch}

/* ══ THE JOURNEY ══ */
.ml-journey{position:relative;overflow:clip;background:var(--paper)}
.ml-track{display:flex;width:fit-content;align-items:stretch}
.ml-panel{position:relative;height:100svh;flex:none}

/* image plate: PURE photograph, one caption on a gradient — never a box */
.ml-plate{width:100vw;display:grid}
.ml-plate .ml-flip{position:absolute;inset:0}
.ml-plate::after{content:'';position:absolute;inset:auto 0 0 0;height:46%;z-index:2;pointer-events:none;
  background:linear-gradient(to top,rgba(16,20,24,.6),transparent)}
.ml-plate-ord{position:absolute;top:clamp(84px,12vh,128px);left:clamp(24px,4vw,64px);z-index:3;
  font-family:var(--disp);font-weight:200;font-size:.82rem;letter-spacing:.3em;color:rgba(246,249,250,.7)}
.ml-plate-cap{position:absolute;left:clamp(24px,4vw,64px);bottom:clamp(34px,7vh,74px);z-index:3;
  color:#F4F7F8;font-size:clamp(.95rem,1.25vw,1.12rem);line-height:1.5;max-width:34ch;
  text-shadow:0 1px 18px rgba(16,20,24,.5)}

/* type panel: air, not a card */
.ml-type{width:min(88vw,620px);display:grid;align-content:center;gap:20px;padding:0 clamp(28px,4.6vw,84px)}
.ml-type-rev{width:min(92vw,700px)}
.ml-facts{display:flex;gap:clamp(22px,3vw,46px);margin-top:6px}
.ml-fact{display:grid;gap:3px}
.ml-fact-n{font-family:var(--disp);font-weight:200;font-size:clamp(1.9rem,3.2vw,2.7rem);line-height:1;color:var(--moss)}
.ml-fact-l{font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-mute)}
.ml-amen,.ml-points{list-style:none;padding:0;display:grid;gap:10px;max-width:42ch;
  border-top:1px solid var(--hair);padding-top:20px}
.ml-amen li,.ml-points li{position:relative;padding-left:20px;color:var(--ink-soft);font-size:.96rem}
.ml-amen li::before,.ml-points li::before{content:'';position:absolute;left:0;top:.7em;width:10px;height:1px;background:var(--moss)}
/* the 1200x600 Geysir frame is too small to bleed; it lives inset */
.ml-inset{width:100%;aspect-ratio:2/1;overflow:hidden}
.ml-inset img{filter:saturate(.92)}

/* duo of interiors, inset with real margin */
.ml-duo{width:min(92vw,780px);display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,1.8vw,24px);
  align-content:center;padding:0 clamp(24px,3vw,48px)}
.ml-duo .ml-flip{aspect-ratio:3/4}

/* reviews */
.ml-rev{display:grid;gap:18px}
.ml-rev-list{list-style:none;padding:0;margin:0;display:grid}
.ml-rev-q{grid-area:1/1;opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .7s var(--e),transform .7s var(--e)}
.ml-rev-q.is-live{opacity:1;transform:none;pointer-events:auto}
.ml-rev-q blockquote{margin:0;font-family:var(--disp);font-weight:200;
  font-size:clamp(1.3rem,2.4vw,2rem);line-height:1.34;letter-spacing:-.008em;max-width:30ch}
.ml-rev-q blockquote::before{content:'“'}
.ml-rev-q blockquote::after{content:'”'}
.ml-rev-q cite{display:block;margin-top:16px;font-style:normal;font-size:.74rem;letter-spacing:.14em;
  text-transform:uppercase;color:var(--ink-mute)}
.ml-rev-dots{display:flex;gap:8px}
.ml-rev-dot{width:36px;height:1px;background:var(--hair);position:relative;padding:0;transition:background .4s var(--e)}
.ml-rev-dot::after{content:'';position:absolute;inset:-12px 0}
.ml-rev-dot.is-on{background:var(--moss)}
.ml-rev-note{font-size:.72rem;letter-spacing:.04em;color:var(--ink-mute)}

.ml-progress-rail{position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--hair);z-index:4}
.ml-progress{display:block;height:100%;background:var(--moss);transform:scaleX(0);transform-origin:left}

/* vertical fallback */
@media (max-width:1023px){
  .ml-track{display:block;width:100%}
  .ml-panel{height:auto;width:auto !important;padding:clamp(64px,10vh,110px) clamp(22px,6vw,48px)}
  .ml-plate{padding:0;min-height:78svh}
  .ml-plate .ml-flip{position:absolute;inset:0}
  .ml-plate-ord{top:clamp(70px,10vh,100px);left:clamp(22px,6vw,40px)}
  .ml-plate-cap{left:clamp(22px,6vw,40px);right:clamp(22px,6vw,40px);bottom:clamp(28px,5vh,48px)}
  .ml-progress-rail{display:none}
}
.reduced .ml-track{display:block;width:100%}
.reduced .ml-panel{height:auto;width:auto !important}

/* gallery */
.ml-gallery{overflow:hidden;padding:clamp(80px,12vh,150px) 0}
.ml-gal-track{display:flex;gap:clamp(12px,1.6vw,22px);width:max-content;animation:ml-gal 64s linear infinite;padding:0 20px}
.ml-gallery:hover .ml-gal-track{animation-play-state:paused}
.ml-gal-item{width:clamp(220px,26vw,380px);aspect-ratio:3/2;overflow:hidden;flex:none}
.ml-gal-item img{filter:saturate(.9);transition:transform 1.1s var(--e)}
.ml-gal-item:hover img{transform:scale(1.05)}
@keyframes ml-gal{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.reduced .ml-gal-track{animation:none;flex-wrap:wrap;width:auto}

/* booking */
.ml-book{max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(100px,15vh,180px);
  display:grid;grid-template-columns:minmax(280px,1fr) minmax(300px,1.05fr);gap:clamp(34px,5vw,80px);align-items:start}
.ml-book-copy{display:grid;gap:18px}
.ml-book-form{display:grid;gap:18px;border-top:1px solid var(--hair);padding-top:26px}
.ml-field{display:grid;gap:7px}
.ml-field label{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute);font-weight:400}
.ml-field input{font:inherit;color:var(--ink);background:transparent;border:0;border-bottom:1px solid var(--hair);
  padding:10px 2px;border-radius:0;min-height:46px;width:100%;transition:border-color .3s var(--e)}
.ml-field input:focus{outline:none;border-bottom-color:var(--moss);box-shadow:0 1px 0 var(--moss)}
.ml-field-row{display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,2vw,28px)}
.ml-cta{justify-self:start;background:var(--ink);color:var(--paper);padding:15px 34px;font-weight:400;
  letter-spacing:.06em;text-transform:uppercase;font-size:.8rem;min-height:48px;
  transition:transform .25s var(--e),background .3s var(--e)}
.ml-cta:hover{background:var(--moss)}
.ml-cta:active{transform:translateY(1px) scale(.99)}
.ml-book-note{font-size:.74rem;color:var(--ink-mute)}
.ml-book-done p{font-family:var(--disp);font-weight:200;font-size:clamp(1.3rem,2.2vw,1.7rem);line-height:1.4;max-width:34ch;
  border-top:1px solid var(--moss);padding-top:24px}
@media (max-width:860px){.ml-book{grid-template-columns:1fr}}

/* footer */
.ml-footer{background:var(--paper);color:var(--ink);padding:clamp(50px,9vh,100px) clamp(20px,5vw,64px) 0;border-top:1px solid var(--hair)}
.ml-footer-word{display:flex;align-items:center;justify-content:center;gap:.34em;margin-bottom:clamp(30px,6vh,58px)}
.ml-footer-word span{font-family:var(--disp);font-weight:200;font-size:clamp(1.9rem,7vw,5.4rem);letter-spacing:.14em;line-height:1.04}
.ml-footer-seam{flex:none;width:1px;height:.9em;background:var(--moss);opacity:.8}
.ml-footer-dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:22px;max-width:1200px;margin:0 auto}
.ml-footer-dl div{display:grid;gap:5px;border-top:1px solid var(--hair);padding-top:14px}
.ml-footer-dl dt{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute);font-weight:400}
.ml-footer-dl dd{color:var(--ink-soft);font-size:.95rem}
.ml-footer-dl a:hover{color:var(--ink)}

.ml-rise{overflow:hidden}
.ml-rise-in{display:block}

@media (prefers-reduced-motion:reduce){
  .ml-gal-track{animation:none;flex-wrap:wrap;width:auto}
  .ml-loader-line::after{animation:none}
  .ml-rev-q{grid-area:auto;opacity:1;transform:none;pointer-events:auto;margin-bottom:24px}
}

/* ── the SHARED prototype disclaimer, dressed in this page's own language ──
   PreviewFooter ships Tailwind utilities (bg-neutral-50, text-center, default
   sans). Dropped inside a designed footer it reads as a foreign design system
   bolted on: its own background, its own alignment, its own type. These rules
   are scoped to this route only and never touch the component. */
.ml-footer footer[lang="is"]{
  background:transparent !important;
  color:var(--ink-mute);
  font-family:var(--sans);
  font-size:.76rem;
  line-height:1.7;
  text-align:left;
  max-width:1200px;
  margin:clamp(38px,6vh,66px) auto 0;
  padding:clamp(22px,3.4vh,34px) 0 clamp(34px,6vh,56px);
  border-top:1px solid var(--hair);
}
.ml-footer footer[lang="is"] p{max-width:74ch;margin:0}
.ml-footer footer[lang="is"] p + p{margin-top:9px}
.ml-footer footer[lang="is"] strong{color:var(--ink-soft);font-weight:400}
.ml-footer footer[lang="is"] a{color:var(--ink-soft);text-decoration:underline;
  text-underline-offset:3px;text-decoration-thickness:1px;transition:color .3s var(--e)}
.ml-footer footer[lang="is"] a:hover{color:var(--moss)}
.ml-footer footer[lang="is"] > div{justify-content:flex-start !important;
  margin:clamp(18px,2.6vh,26px) 0 0 !important;padding-top:clamp(16px,2.4vh,22px) !important;
  border-top-color:var(--hair) !important}
@media (max-width:760px){
  .ml-footer footer[lang="is"]{padding-bottom:clamp(84px,14vh,112px)}
}
`
