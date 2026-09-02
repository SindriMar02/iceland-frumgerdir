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
import { StayPicker, STAY_CSS, dayKey, fmtLong, type Stay } from './StayPicker'
import { AREA, COMPANY, FACTS, JSON_LD, OWN_WORDS, PHOTO, PROOF, srcSet } from './content'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('svartlodge')

type Photo = { src: string; alt: string; ratio: string }

/* ── SVART LODGE · a plain landing page, Svartaborg's DNA without the cutout ─
   Same lineage as Svartaborg (../svartaborg, its declined design, never sent):
   dark page, Familjen Grotesk only, reveals that slide laterally (x -14 → 0)
   like the long low building. The house-silhouette clip mask that page used
   for its hero and seasons band is deliberately NOT reused here — a full-bleed
   photograph carries the hero instead, wordmark set over it the ordinary way,
   the MODUS board's scale kept but without the trace-dependent mask. */

const BLACK = '#0F1113'        // their cladding, re-sampled from the sunset frame
const BONE = '#E9E6E0'
const MUTE = 'rgba(233,230,224,.64)'
const HAIR = 'rgba(233,230,224,.16)'
const HAZE = '#8FA8B0'         // sea haze, fills and large marks
const HAZE_TEXT = '#B4C8CE'    // accent text on black (AA)

const SANS = "'Familjen Grotesk', system-ui, sans-serif"
const BASE = import.meta.env.BASE_URL

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/* ── motion engine ───────────────────────────────────────────────────────── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready || reduced()) return
    const root = document.querySelector<HTMLElement>('.sl-root')
    if (!root) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    const cleanups: Array<() => void> = []

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.2 },
    )
    root.querySelectorAll('.sl-rv').forEach((el) => io.observe(el))

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-sl-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.sl-word')
        if (!words.length) return
        gsap.fromTo(
          words,
          { yPercent: 116, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.05, ease: 'expo.out', stagger: 0.06,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true } },
        )
      })

      /* THE WORDMARK. Letters rise once, set directly over the full-bleed photo. */
      const wmWords = root.querySelectorAll<HTMLElement>('.sl-wm-word')
      if (wmWords.length) {
        gsap.set(wmWords, { yPercent: 120, opacity: 0 })
        let opened = false
        const openWordmark = () => {
          if (opened) return
          opened = true
          gsap.to(wmWords, { yPercent: 0, opacity: 1, duration: 1.3, ease: 'expo.out', stagger: 0.1 })
        }
        if (root.querySelector('.sl-loader')) {
          window.addEventListener('sl:revealed', openWordmark, { once: true })
        } else {
          gsap.delayedCall(0.15, openWordmark)
        }
        window.setTimeout(openWordmark, 3600)
      }

      /* the hero photo settles in from a slight zoom on load, nothing more */
      const heroImg = root.querySelector<HTMLElement>('.sl-hero-media img')
      if (heroImg) gsap.fromTo(heroImg, { scale: 1.08 }, { scale: 1, duration: 2.6, ease: 'power2.out' })

      const onFocusIn = (e: FocusEvent) => {
        const rv = (e.target as HTMLElement).closest?.('.sl-rv')
        rv?.classList.add('is-in')
      }
      root.addEventListener('focusin', onFocusIn)
      cleanups.push(() => root.removeEventListener('focusin', onFocusIn))
    }, root)

    const driftEls = Array.from(root.querySelectorAll<HTMLElement>('.sl-frame-in'))
    const drift = () => {
      const vh = window.innerHeight
      const writes: Array<[HTMLElement, number]> = []
      for (const el of driftEls) {
        const frame = el.parentElement
        if (!frame) continue
        const r = frame.getBoundingClientRect()
        if (r.bottom < -40 || r.top > vh + 40) continue
        const p = Math.max(-1, Math.min(1, 1 - (r.top + r.height / 2) / (vh / 2) / 2))
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
    <Tag className={`sl-headline ${className}`} data-sl-headline="" aria-label={text}
      style={{ fontSize: fluid(size, floor), maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined }}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="sl-line"><span className="sl-word">{w}</span></span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

function Frame({ photo, className = '', priority = false, drift = 9, sizes }: {
  photo: Photo; className?: string; priority?: boolean; drift?: number; sizes?: string
}) {
  return (
    <figure className={`sl-frame sl-rv ${className}`} style={{ aspectRatio: photo.ratio }}>
      <div className="sl-frame-in" data-drift={drift} style={{ '--dz': `${Math.max(9, drift * 1.35)}%` } as React.CSSProperties}>
        <img src={photo.src} srcSet={srcSet(photo.src)} sizes={sizes ?? '(max-width: 899px) 100vw, 50vw'}
          alt={photo.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </div>
    </figure>
  )
}

/* ── booking form ───────────────────────────────────────────────────────── */

const nightsOf = (s: Stay) =>
  s.start && s.end ? Math.round((s.end.getTime() - s.start.getTime()) / 86_400_000) : 0

function BookingForm() {
  const [stay, setStay] = useState<Stay>({ start: null, end: null })
  const [people, setPeople] = useState(6)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<DemoBooking | null>(null)
  const nights = nightsOf(stay)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!stay.start || !stay.end) {
      setError('Pick an arrival and a checkout on the calendar, then send the request.')
      return
    }
    if (!name.trim() || !email.trim()) {
      setError('A name and an email address are needed so the owners can answer you.')
      return
    }
    setError(null)
    const b: DemoBooking = {
      id: `sl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: 'svartlodge',
      date: dayKey(stay.start),
      endDate: dayKey(stay.end),
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
      <div className="sl-book-done" role="status">
        <p className="sl-book-done-title">Your request is on its way.</p>
        <p className="sl-book-done-dates">
          {stay.start ? fmtLong(stay.start) : done.date} to {stay.end ? fmtLong(stay.end) : done.endDate}
          {' · '}{nights} {nights === 1 ? 'night' : 'nights'} · {people} {people === 1 ? 'guest' : 'guests'}
        </p>
        <p className="sl-body">
          In the finished site this lands with the owners directly, and the
          price for your dates comes with the reply.
        </p>
        <p className="sl-body">
          <Link className="sl-a" to="/preview/svartlodge/stjornbord">View the owner’s dashboard</Link>{' '}
          to see where the request arrives, or{' '}
          <button type="button" className="sl-ghost" onClick={() => { setDone(null); setStay({ start: null, end: null }) }}>make another request</button>
        </p>
      </div>
    )
  }

  return (
    <form className="sl-book-form" onSubmit={submit} noValidate>
      <StayPicker stay={stay} onStay={setStay} guests={people} onGuests={setPeople} maxGuests={FACTS.guests} />
      <div className="sl-fields">
        <label className="sl-field">
          <span className="sl-field-label">Name</span>
          <input type="text" name="name" autoComplete="name" value={name} required onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="sl-field">
          <span className="sl-field-label">Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="sl-field sl-field-wide">
          <span className="sl-field-label">Phone <span className="sl-optional">(optional)</span></span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="sl-field sl-field-wide">
          <span className="sl-field-label">Anything the house should know <span className="sl-optional">(optional)</span></span>
          <textarea rows={3} name="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      {error && <p className="sl-field-error" role="alert">{error}</p>}
      <button type="submit" className="sl-cta" data-ready={nights > 0 ? '' : undefined}>
        {nights > 0 ? `Ask for these ${nights} ${nights === 1 ? 'night' : 'nights'}` : 'Ask for your nights'}
      </button>
      <p className="sl-book-note">
        No card, no charge. The request goes straight to the owners, and the
        price for your dates comes with the reply.
      </p>
    </form>
  )
}

/* ── preloader — the form fills ─────────────────────────────────────────── */

const shouldShowLoader = () => {
  if (typeof window === 'undefined' || reduced()) return false
  if (new URLSearchParams(window.location.search).has('loader')) return true
  try { return !sessionStorage.getItem('sl_seen') } catch { return true }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('sl_seen', '1') } catch { /* private mode */ }
    const t0 = performance.now()
    let raf = 0
    let shown = 0
    let heroDone = false
    const hero = new Image()
    hero.decoding = 'async'
    const mark = () => { heroDone = true }
    hero.addEventListener('load', mark, { once: true })
    hero.addEventListener('error', mark, { once: true })
    hero.src = PHOTO.sunsetHouse.src
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
    <div className={`sl-loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <div className="sl-loader-word">
        {'SVART LODGE'.split('').map((c, i) => <span key={i}>{c === ' ' ? '  ' : c}</span>)}
      </div>
      <div className="sl-loader-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
      <p className="sl-loader-pct">{pct}%</p>
    </div>
  )
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default function SvartLodgePage() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(shouldShowLoader)

  useEffect(() => {
    setThemeColor(BLACK)
    document.title = 'Svart Lodge · A private house on the shore of Eyjafjörður'
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
    <div className="sl-root">
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      {loading && (
        <Preloader onDone={() => {
          setLoading(false)
          window.dispatchEvent(new Event('sl:revealed'))
        }} />
      )}

      <header className="sl-nav">
        <a className="sl-nav-mark" href="#top" onClick={anchor('top')}>SVART LODGE</a>
        <nav className="sl-nav-links" aria-label="Page">
          <a href="#husid" onClick={anchor('husid')}>The house</a>
          <a href="#vatnid" onClick={anchor('vatnid')}>The water</a>
          <a href="#stadurinn" onClick={anchor('stadurinn')}>Around</a>
        </nav>
        <a className="sl-nav-cta" href="#boka" onClick={anchor('boka')}>Ask for your nights</a>
      </header>

      {/* 01 · hero: the house at sunset, full bleed, wordmark set over it */}
      <section className="sl-hero" id="top">
        <div className="sl-hero-stage">
          <div className="sl-hero-media">
            <img src={PHOTO.sunsetHouse.src} srcSet={srcSet(PHOTO.sunsetHouse.src)} sizes="100vw"
              alt={PHOTO.sunsetHouse.alt} loading="eager" decoding="async" />
          </div>
          <div className="sl-hero-scrim" aria-hidden="true" />
          <div className="sl-wm">
            <h1 className="sl-wm-h" aria-label="Svart Lodge">
              <span className="sl-wm-line" aria-hidden="true"><span className="sl-wm-word">SVART</span></span>
              <span className="sl-wm-line" aria-hidden="true"><span className="sl-wm-word">LODGE</span></span>
            </h1>
            <p className="sl-wm-sub">
              A black house on the shore of Eyjafjörður, ten minutes from
              Akureyri. Five bedrooms, a heated pool on the veranda, the whole
              fjord in the glass.
            </p>
          </div>
          <p className="sl-hero-cap">The view the house was built to hold.</p>
        </div>
      </section>

      {/* 02 · a living space first */}
      <section className="sl-manifesto" id="husid">
        <div className="sl-manifesto-copy">
          <Headline text="A living space first, a villa second." size={72} floor={34} measure={640} />
          <p className="sl-body sl-rv">{OWN_WORDS.livingSpace} {OWN_WORDS.details}</p>
          <dl className="sl-keyfacts sl-rv">
            <div><dt>Size</dt><dd>{FACTS.size}</dd></div>
            <div><dt>Bedrooms</dt><dd>{FACTS.bedrooms}, each with its own bathroom</dd></div>
            <div><dt>Guests</dt><dd>Up to {FACTS.guests}</dd></div>
            <div><dt>Fire</dt><dd>{FACTS.fire}</dd></div>
          </dl>
        </div>
        <Frame photo={PHOTO.livingFire} drift={10} className="sl-manifesto-fig" priority />
      </section>

      {/* 03 · the sea held still */}
      <section className="sl-view">
        <figure className="sl-view-stage sl-rv">
          <div className="sl-frame-in" data-drift={12} style={{ '--dz': `${(12 * 1.35).toFixed(2)}%` } as React.CSSProperties}>
            <img src={PHOTO.shoreRocks.src} srcSet={srcSet(PHOTO.shoreRocks.src)} sizes="100vw"
              alt={PHOTO.shoreRocks.alt} loading="lazy" decoding="async" />
          </div>
        </figure>
        <div className="sl-view-copy sl-rv">
          <Headline text="The sea, unrestricted." size={54} floor={30} measure={560} />
          <p className="sl-body">{OWN_WORDS.surroundings} {OWN_WORDS.view}</p>
          <p className="sl-stat">In their own words, on svartlodge.is and the listing.</p>
        </div>
      </section>

      {/* 04 · the water */}
      <section className="sl-geo" id="vatnid">
        <div className="sl-geo-head sl-rv">
          <Headline text="Warm pool, cold plunge, sauna, and the fjord for the rest." size={54} floor={30} measure={720} />
          <p className="sl-body">
            The heated pool sits on the veranda facing the water, with the
            sauna and the cold plunge beside it. In winter the steam rises
            off it against the black cladding; in summer the light never
            quite leaves.
          </p>
        </div>
        <div className="sl-geo-row">
          <Frame photo={PHOTO.bedroomPool} drift={11} sizes="(max-width: 899px) 100vw, 60vw" className="sl-geo-main" />
          <Frame photo={PHOTO.bathShower} drift={8} sizes="(max-width: 899px) 100vw, 36vw" className="sl-geo-side" />
        </div>
      </section>

      {/* 05 · every corner */}
      <section className="sl-corners">
        <div className="sl-corners-head sl-rv">
          <Headline text="Wonderful details in every corner." size={54} floor={30} measure={600} />
          <p className="sl-body">
            Black oak joinery, stone floors, copper pendants over the long
            table, a stove in the living room and another in the bedroom.
            Their sentence, and their photographs.
          </p>
        </div>
        <div className="sl-corners-row">
          <Frame photo={PHOTO.kitchenIsland} drift={8} sizes="(max-width: 899px) 100vw, 30vw" />
          <Frame photo={PHOTO.diningEvening} drift={10} sizes="(max-width: 899px) 100vw, 40vw" className="sl-corners-wide" />
          <Frame photo={PHOTO.chairWindow} drift={8} sizes="(max-width: 899px) 100vw, 30vw" />
        </div>
      </section>

      {/* 06 · around */}
      <section className="sl-circle" id="stadurinn">
        <div className="sl-circle-copy sl-rv">
          <Headline text="Ten minutes from town, and none of it." size={54} floor={30} measure={560} />
          <p className="sl-body">
            Hagabyggð by Glæsibær, in Hörgársveit: the estate sits at the
            seaside in the spruce and poplar of Hagaskógur, low birch around
            it for shelter from the highland winds.
          </p>
          <ul className="sl-circle-list">
            {AREA.map((p) => (
              <li key={p.name}>
                <span className="sl-circle-name">{p.name}</span>
                <span className="sl-circle-note">{p.note}</span>
                <span className="sl-circle-dist">{p.dist}</span>
              </li>
            ))}
          </ul>
        </div>
        <Frame photo={PHOTO.fjordWide} drift={9} className="sl-circle-fig" />
      </section>

      {/* 07 · the shore, full bleed: the house from above */}
      <section className="sl-shore">
        <div className="sl-shore-stage">
          <img className="sl-shore-img" src={PHOTO.roofsForest.src} srcSet={srcSet(PHOTO.roofsForest.src)} sizes="100vw"
            alt={PHOTO.roofsForest.alt} loading="lazy" decoding="async" />
          <p className="sl-shore-cap sl-rv">
            The house from above, in the spruce and poplar of Hagaskógur, the
            shore it stands on around it.
          </p>
        </div>
      </section>

      {/* 08 · what is real + booking */}
      <section className="sl-book" id="boka">
        <div className="sl-book-copy sl-rv">
          <Headline text="Ask for your nights on the shore." size={62} floor={32} measure={600} />
          <p className="sl-body">
            Send your dates and the request goes straight to the owners in
            Akureyri.
          </p>
          <dl className="sl-facts">
            <div><dt>Guests</dt><dd>Up to {FACTS.guests}, {FACTS.bedrooms} bedrooms and {FACTS.bathrooms} bathrooms</dd></div>
            <div><dt>Water</dt><dd>{FACTS.water}</dd></div>
            <div><dt>The view</dt><dd>{FACTS.view}</dd></div>
            <div><dt>Where</dt><dd>{FACTS.where}</dd></div>
          </dl>
          <ul className="sl-proof sl-rv" aria-label="Guest ratings">
            {PROOF.map((p) => (
              <li key={p.where}><span className="sl-proof-score">{p.score}</span><span className="sl-proof-where">{p.where}, {p.count}</span></li>
            ))}
          </ul>
          <div className="sl-owner-note sl-rv">
            <p className="sl-owner-note-label">The owner’s dashboard</p>
            <p className="sl-owner-note-body">
              Requests land in a private dashboard the owners run.{' '}
              <Link className="sl-a" to="/preview/svartlodge/stjornbord">See how direct bookings would work</Link>
            </p>
          </div>
        </div>
        <BookingForm />
      </section>

      <footer className="sl-foot">
        <div className="sl-foot-grid">
          <div>
            <p className="sl-foot-mark">SVART LODGE</p>
            <p className="sl-foot-line">{FACTS.where} · Eyjafjörður, North Iceland</p>
            <p className="sl-foot-line"><a className="sl-a" href={COMPANY.maps} target="_blank" rel="noreferrer">Open in Google Maps</a></p>
          </div>
          <div>
            <p className="sl-foot-line"><a className="sl-a" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>
            <p className="sl-foot-line"><a className="sl-a" href={COMPANY.phoneHref}>{COMPANY.phone}</a></p>
            <p className="sl-foot-line"><a className="sl-a" href={COMPANY.instagram} target="_blank" rel="noreferrer">Instagram</a></p>
            <p className="sl-foot-line">{COMPANY.legal} · kt. {COMPANY.kt}</p>
          </div>
          <div>
            <p className="sl-foot-line">
              Photography: the owners’ own photographs from svartlodge.is, retrieved September 2026.
            </p>
            <p className="sl-foot-line">
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
@font-face { font-family: 'Familjen Grotesk'; src: url('${BASE}svartlodge/fonts/FamiljenGrotesk-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Familjen Grotesk'; src: url('${BASE}svartlodge/fonts/FamiljenGrotesk-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }

.sl-root {
  --u: clamp(0.58px, 0.0695vw, 1px);
  --sl-black: ${BLACK};
  --sl-bone: ${BONE};
  --sl-mute: ${MUTE};
  --sl-hair: ${HAIR};
  background: var(--sl-black); color: var(--sl-bone);
  font-family: ${SANS}; font-weight: 400;
  overflow-x: clip;
  color-scheme: dark;
}
.sl-root section[id] { scroll-margin-top: clamp(88px, calc(var(--u) * 116), 136px); }
.sl-root ::selection { background: ${HAZE}; color: ${BLACK}; }
.sl-root :focus-visible { outline: 2px solid ${HAZE_TEXT}; outline-offset: 2px; }
.sl-root img { max-width: 100%; }

.sl-rv { opacity: 0; transform: translateX(-14px);
  transition: opacity .9s cubic-bezier(.23,1,.32,1), transform .9s cubic-bezier(.23,1,.32,1); }
.sl-rv.is-in { opacity: 1; transform: none; }

/* nav */
.sl-nav { position: fixed; inset: 0 0 auto 0; z-index: 40; display: flex; align-items: center; gap: calc(var(--u) * 36);
  padding: calc(var(--u) * 18) calc(var(--u) * 40); color: var(--sl-bone); }
.sl-nav a { color: inherit; text-decoration: none; }
.sl-nav-mark { font-weight: 500; letter-spacing: .18em; font-size: ${fluid(14, 13)}; }
.sl-nav-links { display: flex; gap: calc(var(--u) * 26); margin-left: auto; }
.sl-nav-links a { font-size: ${fluid(14, 13)}; opacity: .8; }
.sl-nav-links a:hover { opacity: 1; }
.sl-nav-cta { font-size: ${fluid(14, 13)}; font-weight: 500; padding: calc(var(--u) * 10) calc(var(--u) * 20);
  border: 1px solid ${HAIR}; border-radius: 0; transition: background .25s ease, color .25s ease, border-color .25s ease; }

/* hero: a plain full-bleed photograph, the wordmark set over it */
.sl-hero { position: relative; }
.sl-hero-stage { position: relative; height: 100svh; overflow: hidden; background: var(--sl-black); }
.sl-hero-media { position: absolute; inset: 0; z-index: 0; }
.sl-hero-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.sl-hero-scrim { position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(0deg, rgba(15,17,19,.75) 0%, rgba(15,17,19,.34) 34%, rgba(15,17,19,0) 60%); }
.sl-wm { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; align-items: flex-start;
  justify-content: flex-end; pointer-events: none;
  padding: 0 calc(var(--u) * 44) calc(calc(var(--u) * 56) + env(safe-area-inset-bottom, 0px)); }
.sl-wm-h { margin: 0; font-weight: 500; letter-spacing: -.035em; font-size: clamp(64px, 17.5vw, 300px); line-height: .86; color: var(--sl-bone); }
.sl-wm-line { display: block; overflow: hidden; padding: .16em .04em .1em; margin: -.16em -.04em -.1em; }
.sl-wm-word { display: inline-block; }
.sl-wm-sub { margin: calc(var(--u) * 22) 0 0; max-width: 42ch; font-size: ${fluid(17, 15)}; line-height: 1.55; color: var(--sl-mute); }
.sl-hero-cap { position: absolute; right: calc(var(--u) * 44); bottom: calc(var(--u) * 40); z-index: 2; margin: 0;
  font-size: ${fluid(14, 13)}; color: var(--sl-mute); }

/* headlines */
.sl-headline { margin: 0; font-weight: 500; letter-spacing: -.015em; line-height: 1.08; text-wrap: balance; }
.sl-line { display: inline-block; overflow: hidden; vertical-align: bottom; padding: .2em .04em .1em; margin: -.2em -.04em -.1em; }
.sl-word { display: inline-block; }
.sl-body { font-size: ${fluid(17, 15)}; line-height: 1.62; color: var(--sl-mute); max-width: 58ch; margin: calc(var(--u) * 22) 0 0; }
.sl-stat { margin: calc(var(--u) * 18) 0 0; font-size: ${fluid(14, 13)}; letter-spacing: .04em; color: var(--sl-mute); }
.sl-a { color: ${HAZE_TEXT}; }
.sl-a:hover { color: var(--sl-bone); }

/* frames + drift */
.sl-frame { position: relative; overflow: hidden; margin: 0; background: color-mix(in srgb, var(--sl-bone) 6%, transparent); }
.sl-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; }
@media (min-width: 992px) { .sl-frame-in { will-change: transform; } }
.sl-frame-in img { width: 100%; height: 100%; max-width: none; object-fit: cover; display: block; }

/* manifesto */
.sl-manifesto { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 72); align-items: center;
  max-width: calc(var(--u) * 1360); margin: 0 auto; padding: calc(var(--u) * 150) calc(var(--u) * 44) calc(var(--u) * 110); }
/* width:100% is load-bearing: every child of the frame is absolute, so
   justify-self:end would shrink it to 0 ([[frame-zero-width-flex-collapse]]) */
.sl-manifesto-fig { width: 100%; max-width: calc(var(--u) * 560); justify-self: end; }
.sl-keyfacts { margin: calc(var(--u) * 32) 0 0; padding: 0; display: grid; gap: calc(var(--u) * 12); }
.sl-keyfacts div { display: flex; gap: 16px; border-top: 1px solid var(--sl-hair); padding-top: calc(var(--u) * 12); }
.sl-keyfacts dt { min-width: 10ch; font-size: ${fluid(13, 12)}; letter-spacing: .06em; text-transform: uppercase; color: var(--sl-mute); padding-top: 2px; }
.sl-keyfacts dd { margin: 0; font-size: ${fluid(15, 14)}; }

/* view */
.sl-view { padding: calc(var(--u) * 40) 0 calc(var(--u) * 110); }
.sl-view-stage { position: relative; overflow: hidden; margin: 0; height: min(84svh, calc(var(--u) * 720)); }
.sl-view-copy { max-width: calc(var(--u) * 1360); margin: 0 auto; padding: calc(var(--u) * 56) calc(var(--u) * 44) 0; }

/* the water */
.sl-geo { max-width: calc(var(--u) * 1360); margin: 0 auto; padding: calc(var(--u) * 110) calc(var(--u) * 44) calc(var(--u) * 60); }
.sl-geo-row { display: grid; grid-template-columns: 3fr 2fr; gap: calc(var(--u) * 24); margin-top: calc(var(--u) * 48); align-items: start; }
.sl-geo-main { aspect-ratio: 4 / 3 !important; }
.sl-geo-side { aspect-ratio: 4 / 3 !important; margin-top: calc(var(--u) * 90); }

/* every corner */
.sl-corners { max-width: calc(var(--u) * 1360); margin: 0 auto; padding: calc(var(--u) * 60) calc(var(--u) * 44) calc(var(--u) * 60); }
.sl-corners-row { display: grid; grid-template-columns: 3fr 4fr 3fr; gap: calc(var(--u) * 24); margin-top: calc(var(--u) * 48); align-items: end; }
.sl-corners-row .sl-frame { width: 100%; }
.sl-corners-wide { aspect-ratio: 3 / 2 !important; }

/* around */
.sl-circle { display: grid; grid-template-columns: 1.1fr 1fr; gap: calc(var(--u) * 72); align-items: center;
  max-width: calc(var(--u) * 1360); margin: 0 auto; padding: calc(var(--u) * 110) calc(var(--u) * 44); }
.sl-circle-fig { width: 100%; }
.sl-circle-list { list-style: none; margin: calc(var(--u) * 40) 0 0; padding: 0; }
.sl-circle-list li { display: grid; grid-template-columns: 13ch 1fr auto; gap: 16px; align-items: baseline;
  border-top: 1px solid var(--sl-hair); padding: calc(var(--u) * 16) 0; }
.sl-circle-name { font-weight: 500; font-size: ${fluid(17, 15)}; }
.sl-circle-note { font-size: ${fluid(15, 14)}; color: var(--sl-mute); }
.sl-circle-dist { font-size: ${fluid(14, 13)}; color: ${HAZE_TEXT}; white-space: nowrap; }

/* the shore band, full bleed */
.sl-shore { padding: calc(var(--u) * 60) 0 calc(var(--u) * 110); }
.sl-shore-stage { position: relative; height: min(88svh, calc(var(--u) * 760)); overflow: hidden; }
.sl-shore-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.sl-shore-cap { position: absolute; left: calc(var(--u) * 44); bottom: calc(var(--u) * 36); margin: 0; z-index: 2;
  font-size: ${fluid(16, 14)}; color: var(--sl-bone); text-shadow: 0 1px 18px rgba(15,17,19,.6); max-width: 40ch; }

/* the enquire CTA: a travelling gradient in the sea haze, lifted by a glow */
.sl-nav-cta { position: relative; isolation: isolate; border: 0 !important; color: ${BLACK} !important; font-weight: 500;
  background-image: linear-gradient(100deg, ${HAZE} 0%, #C2D6DB 26%, ${HAZE} 50%, #5F7A82 76%, ${HAZE} 100%);
  background-size: 300% 100%; background-position: 0% 50%;
  box-shadow: 0 6px 26px -10px rgba(143,168,176,.75);
  transition: background-position 1s cubic-bezier(.23,1,.32,1), box-shadow .45s ease, transform .15s ease; }
.sl-nav-cta::before { content: ''; position: absolute; inset: -1px; z-index: -1; opacity: 0; background: inherit; filter: blur(11px); transition: opacity .45s ease; }
.sl-nav-cta:hover { background-position: 100% 50%; box-shadow: 0 10px 34px -10px rgba(143,168,176,.9); }
.sl-nav-cta:hover::before { opacity: .75; }
.sl-nav-cta:active { transform: scale(.98); }

/* booking */
.sl-book { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 80); max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 90) calc(var(--u) * 44) calc(var(--u) * 150); }
.sl-facts { margin: calc(var(--u) * 36) 0 0; display: grid; gap: calc(var(--u) * 14); padding: 0; }
.sl-facts div { display: flex; gap: 16px; border-top: 1px solid var(--sl-hair); padding-top: calc(var(--u) * 12); }
.sl-facts dt { min-width: 10ch; font-size: ${fluid(13, 12)}; letter-spacing: .06em; text-transform: uppercase; color: var(--sl-mute); padding-top: 2px; }
.sl-facts dd { margin: 0; font-size: ${fluid(15, 14)}; }
.sl-proof { list-style: none; margin: calc(var(--u) * 36) 0 0; padding: 0; display: flex; gap: calc(var(--u) * 40); flex-wrap: wrap; }
.sl-proof li { display: flex; flex-direction: column; gap: 4px; }
.sl-proof-score { font-weight: 500; font-size: ${fluid(28, 22)}; letter-spacing: -.02em; }
.sl-proof-where { font-size: ${fluid(13, 12)}; color: var(--sl-mute); letter-spacing: .04em; }
.sl-owner-note { margin-top: calc(var(--u) * 40); }
.sl-owner-note-label { margin: 0; font-size: ${fluid(12, 12)}; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: var(--sl-mute); }
.sl-owner-note-body { margin: calc(var(--u) * 10) 0 0; font-size: ${fluid(15, 14)}; line-height: 1.6; color: var(--sl-mute); }

.sl-book-form { align-self: start; }
.sl-fields { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 16); margin-top: calc(var(--u) * 20); }
.sl-field { display: grid; gap: 8px; }
.sl-field-wide { grid-column: 1 / -1; }
.sl-field-label { font-size: 12.5px; font-weight: 500; letter-spacing: .05em; }
.sl-optional { font-weight: 400; color: var(--sl-mute); }
.sl-field input, .sl-field select, .sl-field textarea { font: inherit; font-size: 16px; color: var(--sl-bone);
  background: #1A1D20; border: 1px solid var(--sl-hair); border-radius: 0; padding: 12px 12px; min-height: 44px; width: 100%; }
.sl-field textarea { resize: vertical; }
.sl-field input:focus, .sl-field select:focus, .sl-field textarea:focus { outline: 2px solid ${HAZE_TEXT}; outline-offset: 1px; }
.sl-field-error { color: #E08A70; font-size: 14px; margin: 14px 0 0; }
.sl-cta { font: inherit; font-weight: 500; font-size: ${fluid(15, 14)}; cursor: pointer; margin-top: calc(var(--u) * 24); width: 100%; min-height: 48px;
  background: ${HAZE}; color: ${BLACK}; border: 0; border-radius: 0; padding: 13px 22px; transition: filter .25s ease, transform .15s ease; }
.sl-cta:hover { filter: brightness(1.08); }
.sl-cta:active { transform: scale(.98); }
.sl-ghost { font: inherit; font-size: inherit; cursor: pointer; background: none; border: 0; padding: 0; color: ${HAZE_TEXT};
  text-decoration: underline; text-underline-offset: 2px; min-height: 44px; }
.sl-ghost:hover { color: var(--sl-bone); }
.sl-book-note { margin: calc(var(--u) * 16) 0 0; font-size: ${fluid(13, 12.5)}; color: var(--sl-mute); line-height: 1.6; }
.sl-book-done { border: 1px solid var(--sl-hair); background: #17191B; padding: calc(var(--u) * 36); align-self: start; }
.sl-book-done-title { margin: 0; font-weight: 500; font-size: ${fluid(24, 19)}; }
.sl-book-done-dates { margin: calc(var(--u) * 12) 0 0; font-size: 14px; letter-spacing: .03em; color: ${HAZE_TEXT}; font-variant-numeric: tabular-nums; }

${STAY_CSS}

/* footer */
.sl-foot { border-top: 1px solid var(--sl-hair); }
.sl-foot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 44); max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 52) calc(var(--u) * 44) calc(var(--u) * 68); }
.sl-foot-mark { font-weight: 500; letter-spacing: .2em; font-size: ${fluid(13, 13)}; margin: 0 0 calc(var(--u) * 12); }
.sl-foot-line { font-size: ${fluid(13, 13)}; line-height: 1.6; color: var(--sl-mute); margin: 0 0 calc(var(--u) * 8); }

/* loader: wordmark + a thin bar, no house shape to fill */
.sl-loader { position: fixed; inset: 0; z-index: 60; background: ${BLACK}; color: ${BONE};
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: calc(var(--u) * 30);
  transition: opacity .55s ease .3s; }
.sl-loader-word { font-weight: 500; letter-spacing: .1em; font-size: clamp(20px, 2.6vw, 30px); }
.sl-loader-bar { position: relative; width: min(40vw, 300px); height: 1px; background: ${HAIR}; }
.sl-loader-bar i { position: absolute; inset: 0; transform-origin: left center; background: ${HAZE}; }
.sl-loader.is-leaving { opacity: 0; pointer-events: none; }
.sl-loader-pct { margin: 0; font-size: 12px; letter-spacing: .16em; color: ${MUTE}; }

/* responsive */
@media (max-width: 991px) {
  .sl-nav { padding: 10px 20px; gap: 16px; }
  .sl-nav-links { display: none; }
  .sl-nav-cta { margin-left: auto; min-height: 44px; display: inline-flex; align-items: center; }
  .sl-manifesto, .sl-book, .sl-circle { grid-template-columns: 1fr; gap: 48px; padding-left: 20px; padding-right: 20px; }
  .sl-manifesto-fig { justify-self: stretch; max-width: none; }
  .sl-geo, .sl-corners { padding-left: 20px; padding-right: 20px; }
  .sl-geo-row, .sl-corners-row { grid-template-columns: 1fr; }
  .sl-geo-side { margin-top: 0; }
  .sl-foot-grid { grid-template-columns: 1fr; padding-left: 20px; padding-right: 20px; }
  .sl-view-copy { padding-left: 20px; padding-right: 20px; }
  .sl-shore-cap { left: 20px; right: 20px; }
  .sl-circle-list li { grid-template-columns: 1fr auto; }
  .sl-circle-note { grid-column: 1 / -1; }
}
@media (max-width: 619px) {
  .sl-fields { grid-template-columns: 1fr; }
}
@media (max-width: 767px) {
  .sl-wm-h { font-size: clamp(56px, 21vw, 110px); }
  .sl-wm-sub { max-width: none; font-size: 15px; }
  .sl-hero-cap { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .sl-root * { transition: none !important; animation: none !important; }
  .sl-rv { opacity: 1 !important; transform: none !important; }
  .sl-word, .sl-wm-word { transform: none !important; opacity: 1 !important; }
  .sl-frame-in { inset: 0; transform: none !important; }
  .sl-hero-media img { transform: none !important; }
}
`
