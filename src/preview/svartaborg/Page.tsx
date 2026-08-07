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
import { AREA, FACTS, HOST, JSON_LD, PHOTO, REVIEW_QUOTES, SILHOUETTE, srcSet } from './content'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('svartaborg')

type Photo = { src: string; alt: string; ratio: string }

/* ── SVARTABORG · "SVARTA FORMIÐ" (the black form) ──────────────────────────
   Rósa and Snæbjörn designed and built these houses themselves, and the
   building's outline is strong enough to carry the page. The silhouette is
   MEASURED from their photograph's own pixels (sky-contrast roofline +
   iterative line fit, both roof edges verified on real luminance gradients,
   ledger #62) — a 5.3° rise to the apex, then the 74° gable fall.

   One geometry, three uses:
    1. The loader: the silhouette fills with bone as real progress loads,
       then swallows the viewport.
    2. The hero: the hillside photograph shows ONLY through the house shape;
       scroll expands the form until the photo runs full bleed — the house
       opens onto its own view. SVG <image> + clipPath in one viewBox, so
       the crop is pixel-identical to object-fit: cover at every width.
    3. The seasons band: winter shows through the form standing in summer.

   Motion identity: "the form releases" — reveals slide laterally (x -14 → 0)
   like the long low building; drift frames per Heklusýn spec. Dark page
   (their charred cladding), Familjen Grotesk only. Spec: ./DESIGN.md ────── */

const BLACK = '#101112'
const BONE = '#E9E6E0'
const MUTE = 'rgba(233,230,224,.64)'
const HAIR = 'rgba(233,230,224,.16)'
const GEO = '#4FA3A5'          // geothermal teal — fills/large marks
const GEO_TEXT = '#7FC4C6'     // accent text on black (AA)

const SANS = "'Familjen Grotesk', system-ui, sans-serif"
const BASE = import.meta.env.BASE_URL

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/** Silhouette centroid (for scaling the clip around its own centre). */
const C = { x: 1031, y: 900 }

/* ── motion engine ───────────────────────────────────────────────────────── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready || reduced()) return
    const root = document.querySelector<HTMLElement>('.sb-root')
    if (!root) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    const cleanups: Array<() => void> = []
    let heroST: ScrollTrigger | null = null

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.2 },
    )
    root.querySelectorAll('.sb-rv').forEach((el) => io.observe(el))

    const ctx = gsap.context(() => {
      /* word-mask headlines rise (words, never chars) */
      root.querySelectorAll<HTMLElement>('[data-sb-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.sb-word')
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

      /* THE WORDMARK + THE FORM.
         The letters rise out of their masks while the hillside photograph
         lives only inside the house silhouette. Scroll releases the form:
         the clip scales from the gable's own centre until the photograph
         runs full bleed. Entrance drives the letters, the scrub drives the
         clip group and the wordmark wrapper — separate elements. */
      const wmWords = root.querySelectorAll<HTMLElement>('.sb-wm-word')
      const wmEl = root.querySelector<HTMLElement>('.sb-wm')
      const clipGroup = root.querySelector<SVGPathElement>('.sb-clip-scale')
      const heroEl = root.querySelector<HTMLElement>('.sb-hero')
      const heroCap = root.querySelector<HTMLElement>('.sb-hero-cap')

      if (wmWords.length) {
        gsap.set(wmWords, { yPercent: 120, opacity: 0 })
        let opened = false
        const openWordmark = () => {
          if (opened) return
          opened = true
          gsap.to(wmWords, {
            yPercent: 0, opacity: 1, duration: 1.3, ease: 'expo.out', stagger: 0.1,
          })
        }
        if (root.querySelector('.sb-loader')) {
          window.addEventListener('sb:revealed', openWordmark, { once: true })
        } else {
          gsap.delayedCall(0.15, openWordmark)
        }
        window.setTimeout(openWordmark, 3600)
      }

      if (heroEl && clipGroup && wmEl) {
        /* scale the clip path around the form's own centroid; 3.4x covers
           the full 2160x1440 box from that centre. Monotonic, reversible. */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroEl, start: 'top top', end: '+=140%',
            pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
          },
        })
        heroST = tl.scrollTrigger ?? null
        tl.fromTo(clipGroup,
          { transformOrigin: `${C.x}px ${C.y}px`, scale: 1 },
          { scale: 3.4, ease: 'none', duration: 1 }, 0)
        tl.to(wmEl, { opacity: 0, y: -60, ease: 'none', duration: 0.5 }, 0.1)
        if (heroCap) tl.to(heroCap, { autoAlpha: 1, duration: 0.2, ease: 'none' }, 0.72)
      }

      /* seasons: winter lives inside the form on the summer aerial;
         crossing the viewport releases it partway and pulls it back. */
      const seasons = root.querySelector<HTMLElement>('.sb-seasons')
      const seasonClip = root.querySelector<SVGPathElement>('.sb-season-scale')
      if (seasons && seasonClip) {
        gsap.fromTo(seasonClip,
          { transformOrigin: `${C.x}px ${C.y}px`, scale: 0.8 },
          {
            scale: 1.9, ease: 'none',
            scrollTrigger: { trigger: seasons, start: 'top 85%', end: 'bottom 15%', scrub: 0.7 },
          })
      }

      const onFocusIn = (e: FocusEvent) => {
        const rv = (e.target as HTMLElement).closest?.('.sb-rv')
        rv?.classList.add('is-in')
      }
      root.addEventListener('focusin', onFocusIn)
      cleanups.push(() => root.removeEventListener('focusin', onFocusIn))
    }, root)

    /* drift: Heklusýn spec, clamped p, gated while the hero pin holds. */
    const driftEls = Array.from(root.querySelectorAll<HTMLElement>('.sb-frame-in'))
    const drift = () => {
      if (heroST?.isActive) return
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
    <Tag
      className={`sb-headline ${className}`}
      data-sb-headline=""
      aria-label={text}
      style={{
        fontSize: fluid(size, floor),
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      }}
    >
      {words.map((w, i) => (
        <span className="sb-line" key={i} aria-hidden="true">
          <span className="sb-word">{w}</span>
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
    <figure className={`sb-frame sb-rv ${className}`} style={{ aspectRatio: photo.ratio }}>
      <div
        className="sb-frame-in"
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

/** The measured form, as an SVG image clipped to the silhouette.
    <image> + clipPath share one viewBox with slice, so the crop matches
    object-fit: cover exactly at every width. */
function FormFigure({ photo, clipId, groupClass, full }: {
  photo: Photo; clipId: string; groupClass: string; full?: Photo
}) {
  return (
    <svg
      className="sb-form-svg"
      viewBox={SILHOUETTE.viewBox}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={photo.alt}
    >
      <defs>
        <clipPath id={clipId}>
          {/* the path itself carries the animated transform: a <g> inside
             <clipPath> is IGNORED by Chromium and the clip resolves empty. */}
          <path className={groupClass} d={SILHOUETTE.path} />
        </clipPath>
      </defs>
      {full && (
        <image
          href={full.src} width="2160" height="1440"
          preserveAspectRatio="xMidYMid slice" opacity="0.34"
        />
      )}
      <image
        href={photo.src} width="2160" height="1440"
        preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`}
      />
    </svg>
  )
}

/* ── booking form ───────────────────────────────────────────────────────── */

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
      id: `sb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: 'svartaborg',
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
      <div className="sb-book-done" role="status">
        <p className="sb-book-done-title">Your request is on its way.</p>
        <p className="sb-body">
          In the finished site this lands with Rósa and Snæbjörn directly, and
          the nightly price for your dates comes with the reply.
        </p>
        <p className="sb-body">
          <Link className="sb-a" to="/preview/svartaborg/stjornbord">View the owner’s dashboard</Link>{' '}
          to see where the request arrives, or{' '}
          <button type="button" className="sb-ghost" onClick={() => setDone(null)}>
            make another request
          </button>
        </p>
      </div>
    )
  }

  return (
    <form className="sb-book-form" onSubmit={submit} noValidate>
      <div className="sb-fields">
        <label className="sb-field">
          <span className="sb-field-label">Arrival</span>
          <input type="date" name="date" min={minDate} value={date} required
            onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="sb-field">
          <span className="sb-field-label">Nights</span>
          <select name="nights" value={nights} onChange={(e) => setNights(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="sb-field">
          <span className="sb-field-label">Guests</span>
          <select name="people" value={people} onChange={(e) => setPeople(Number(e.target.value))}>
            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="sb-field sb-field-wide">
          <span className="sb-field-label">Name</span>
          <input type="text" name="name" autoComplete="name" value={name} required
            onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="sb-field sb-field-wide">
          <span className="sb-field-label">Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" value={email} required
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="sb-field sb-field-wide">
          <span className="sb-field-label">Phone <span className="sb-optional">(optional)</span></span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="sb-field sb-field-wide">
          <span className="sb-field-label">Anything the hosts should know <span className="sb-optional">(optional)</span></span>
          <textarea rows={3} name="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      {error && <p className="sb-field-error" role="alert">{error}</p>}
      <button type="submit" className="sb-cta">Enquire about your stay</button>
      <p className="sb-book-note">
        No card, no charge. The request goes straight to the hosts, and the
        nightly price for your dates comes with the reply.
      </p>
    </form>
  )
}

/* ── preloader — the form fills ─────────────────────────────────────────── */

const shouldShowLoader = () => {
  if (typeof window === 'undefined' || reduced()) return false
  if (new URLSearchParams(window.location.search).has('loader')) return true
  try { return !sessionStorage.getItem('sb_seen') } catch { return true }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('sb_seen', '1') } catch { /* private mode */ }
    const t0 = performance.now()
    let raf = 0
    let shown = 0
    let heroDone = false
    const hero = new Image()
    hero.decoding = 'async'
    const mark = () => { heroDone = true }
    hero.addEventListener('load', mark, { once: true })
    hero.addEventListener('error', mark, { once: true })
    hero.src = PHOTO.houseHillside.src
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
    <div className={`sb-loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <svg className="sb-loader-form" viewBox={SILHOUETTE.viewBox} preserveAspectRatio="xMidYMid meet">
        <path d={SILHOUETTE.path} fill="none" stroke={MUTE} strokeWidth="3" />
        <clipPath id="sb-loader-clip">
          <rect x="0" y={1440 - 11 * pct} width="2160" height={11 * pct} />
        </clipPath>
        <path d={SILHOUETTE.path} fill={BONE} clipPath="url(#sb-loader-clip)" />
      </svg>
      <p className="sb-loader-pct">{pct}%</p>
    </div>
  )
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default function SvartaborgPage() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(shouldShowLoader)

  useEffect(() => {
    setThemeColor(BLACK)
    document.title = 'Svartaborg'
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
    <div className="sb-root">
      <style>{CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      {loading && (
        <Preloader onDone={() => {
          setLoading(false)
          window.dispatchEvent(new Event('sb:revealed'))
        }} />
      )}

      <header className="sb-nav">
        <a className="sb-nav-mark" href="#top" onClick={anchor('top')}>SVARTABORG</a>
        <nav className="sb-nav-links" aria-label="Page">
          <a href="#husin" onClick={anchor('husin')}>The houses</a>
          <a href="#potturinn" onClick={anchor('potturinn')}>The hot tub</a>
          <a href="#gestir" onClick={anchor('gestir')}>Guests</a>
        </nav>
        <a className="sb-nav-cta" href="#boka" onClick={anchor('boka')}>Enquire about your stay</a>
      </header>

      {/* 01 · hero — the form opens onto its own view */}
      <section className="sb-hero" id="top">
        <div className="sb-hero-stage">
          <FormFigure
            photo={PHOTO.houseHillside}
            clipId="sb-hero-clip"
            groupClass="sb-clip-scale"
          />
          <div className="sb-wm" aria-hidden="false">
            <h1 className="sb-wm-h" aria-label="Svartaborg">
              <span className="sb-wm-line" aria-hidden="true"><span className="sb-wm-word">SVARTA</span></span>
              <span className="sb-wm-line" aria-hidden="true"><span className="sb-wm-word">BORG</span></span>
            </h1>
            <p className="sb-wm-sub">
              Two black houses on the hillside above the family farm, built by
              the designers who own them. The Diamond Circle starts at the door.
            </p>
          </div>
          <p className="sb-hero-cap" aria-hidden="true">
            The view the house was built to hold.
          </p>
        </div>
      </section>

      {/* 02 · manifesto */}
      <section className="sb-manifesto" id="husin">
        <div className="sb-manifesto-copy">
          <Headline text="Designed here, built here." size={72} floor={34} measure={620} />
          <p className="sb-body sb-rv">
            Rósa and Snæbjörn are both designers. In 2018 they took over Rangá,
            the farm her grandparents built; in 2020 they raised these houses on
            its hillside with their own hands. Everything down to the joinery
            was a decision, and it shows in the reviews.
          </p>
          <p className="sb-stat sb-rv">
            Rated {HOST.rating} of 5 across {HOST.reviewCount} reviews on Airbnb ·{' '}
            {HOST.bookingCom.score} on Booking.com
          </p>
        </div>
        <Frame photo={PHOTO.livingWood} drift={10} className="sb-manifesto-fig" priority />
      </section>

      {/* 03 · the window that holds the valley */}
      <section className="sb-view">
        <figure className="sb-view-stage sb-rv">
          <div className="sb-frame-in" data-drift={12}
            style={{ '--dz': `${(12 * 1.35).toFixed(2)}%` } as React.CSSProperties}>
            <img src={PHOTO.windowReflect.src} srcSet={srcSet(PHOTO.windowReflect.src)} sizes="100vw"
              alt={PHOTO.windowReflect.alt} loading="lazy" decoding="async" />
          </div>
        </figure>
        <div className="sb-view-copy sb-rv">
          <Headline text="The picture window earns its name." size={54} floor={30} measure={560} />
          <p className="sb-body">
            Every room faces the valley. The glass is sized so the moor reads
            like a painting hung on the timber wall, and in winter the horses
            cross the snow below it.
          </p>
        </div>
      </section>

      {/* 04 · geothermal */}
      <section className="sb-geo" id="potturinn">
        <div className="sb-geo-head sb-rv">
          <Headline text="My favorite spot we stayed on the ring road." size={54} floor={30} measure={640} />
          <p className="sb-body">
            Valerie’s words about the geothermal hot tub, sunk into the deck
            against the black gable. Hot water from the ground, cold air off
            the moor, and nobody else for miles.
          </p>
        </div>
        <div className="sb-geo-row">
          <Frame photo={PHOTO.gableTubA} drift={11} sizes="(max-width: 899px) 100vw, 60vw" className="sb-geo-main" />
          <Frame photo={PHOTO.tubClose} drift={8} sizes="(max-width: 899px) 100vw, 36vw" className="sb-geo-side" />
        </div>
      </section>

      {/* 05 · the Diamond Circle */}
      <section className="sb-circle">
        <div className="sb-circle-copy sb-rv">
          <Headline text="The Diamond Circle at the door." size={54} floor={30} measure={560} />
          <ul className="sb-circle-list">
            {AREA.map((p) => (
              <li key={p.name}>
                <span className="sb-circle-name">{p.name}</span>
                <span className="sb-circle-note">{p.note}</span>
                <span className="sb-circle-dist">{p.dist}</span>
              </li>
            ))}
          </ul>
        </div>
        <Frame photo={PHOTO.streamAutumn} drift={9} className="sb-circle-fig" />
      </section>

      {/* 06 · seasons — winter inside the form on summer */}
      <section className="sb-seasons">
        <div className="sb-seasons-stage">
          <FormFigure
            photo={PHOTO.aerialSnowA}
            full={PHOTO.aerialGreen}
            clipId="sb-season-clip"
            groupClass="sb-season-scale"
          />
          <p className="sb-seasons-cap sb-rv">
            The same hillside, both seasons at once: winter lives inside the
            form, summer around it.
          </p>
        </div>
      </section>

      {/* 07 · guests + booking */}
      <section className="sb-guests" id="gestir">
        <div className="sb-guests-head sb-rv">
          <Headline text="What guests keep saying." size={54} floor={30} measure={560} />
        </div>
        <ul className="sb-quotes">
          {REVIEW_QUOTES.map((q) => (
            <li key={q.author} className="sb-quote sb-rv">
              <p>{'“'}{q.quote}{'”'}</p>
              <cite>{q.author}, {q.when}</cite>
            </li>
          ))}
        </ul>
      </section>

      <section className="sb-book" id="boka">
        <div className="sb-book-copy sb-rv">
          <Headline text="Ask for your nights on the hill." size={62} floor={32} measure={600} />
          <p className="sb-body">
            Send your dates and the request goes straight to Rósa and Snæbjörn
            on the farm below.
          </p>
          <dl className="sb-facts">
            <div><dt>Guests</dt><dd>Up to {FACTS.guests} per house</dd></div>
            <div><dt>Hot tub</dt><dd>{FACTS.hotTub}</dd></div>
            <div><dt>Built</dt><dd>{FACTS.built}</dd></div>
            <div><dt>The farm</dt><dd>{FACTS.farm}</dd></div>
          </dl>
          <div className="sb-owner-note sb-rv">
            <p className="sb-owner-note-label">The owner’s dashboard</p>
            <p className="sb-owner-note-body">
              Requests land in a private dashboard the hosts run.{' '}
              <Link className="sb-a" to="/preview/svartaborg/stjornbord">
                See how direct bookings would work
              </Link>
            </p>
          </div>
        </div>
        <BookingForm />
      </section>

      <footer className="sb-foot">
        <div className="sb-foot-grid">
          <div>
            <p className="sb-foot-mark">SVARTABORG</p>
            <p className="sb-foot-line">Rangá, Þingeyjarsveit · North Iceland</p>
          </div>
          <div>
            <p className="sb-foot-line">Hosts: Rósa and Snæbjörn, designers</p>
            <p className="sb-foot-line">Goðafoss 10 min · Húsavík 20 min · Akureyri 30 min</p>
          </div>
          <div>
            <p className="sb-foot-line">
              Photography: the owners’ own photos from svartaborg.com and their listing, retrieved August 2026.
            </p>
            <p className="sb-foot-line">
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
@font-face { font-family: 'Familjen Grotesk'; src: url('${BASE}svartaborg/fonts/FamiljenGrotesk-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Familjen Grotesk'; src: url('${BASE}svartaborg/fonts/FamiljenGrotesk-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }

.sb-root {
  --u: clamp(0.58px, 0.0695vw, 1px);
  --sb-black: ${BLACK};
  --sb-bone: ${BONE};
  --sb-mute: ${MUTE};
  --sb-hair: ${HAIR};
  background: var(--sb-black); color: var(--sb-bone);
  font-family: ${SANS}; font-weight: 400;
  overflow-x: clip;
  color-scheme: dark;
}
.sb-root section[id] { scroll-margin-top: clamp(88px, calc(var(--u) * 116), 136px); }
.sb-root ::selection { background: ${GEO}; color: ${BLACK}; }
.sb-root :focus-visible { outline: 2px solid ${GEO_TEXT}; outline-offset: 2px; }
.sb-root img { max-width: 100%; }

/* reveals slide laterally — the long low building */
.sb-rv { opacity: 0; transform: translateX(-14px);
  transition: opacity .9s cubic-bezier(.23,1,.32,1), transform .9s cubic-bezier(.23,1,.32,1); }
.sb-rv.is-in { opacity: 1; transform: none; }

/* nav */
.sb-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 40;
  display: flex; align-items: center; gap: calc(var(--u) * 36);
  padding: calc(var(--u) * 18) calc(var(--u) * 40);
  color: var(--sb-bone);
}
.sb-nav a { color: inherit; text-decoration: none; }
.sb-nav-mark { font-weight: 500; letter-spacing: .18em; font-size: ${fluid(14, 13)}; }
.sb-nav-links { display: flex; gap: calc(var(--u) * 26); margin-left: auto; }
.sb-nav-links a { font-size: ${fluid(14, 13)}; opacity: .8; }
.sb-nav-links a:hover { opacity: 1; }
.sb-nav-cta {
  font-size: ${fluid(14, 13)}; font-weight: 500;
  padding: calc(var(--u) * 10) calc(var(--u) * 20);
  border: 1px solid ${HAIR}; border-radius: 0;
  transition: background .25s ease, color .25s ease, border-color .25s ease;
}
.sb-nav-cta:hover { background: var(--sb-bone); color: var(--sb-black); border-color: var(--sb-bone); }

/* hero */
.sb-hero { position: relative; }
.sb-hero-stage { position: relative; height: 100svh; overflow: hidden; }
.sb-form-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.sb-hero .sb-form-svg { background: var(--sb-black); }
.sb-wm {
  position: absolute; inset: 0; z-index: 2;
  display: flex; flex-direction: column; align-items: flex-start;
  justify-content: flex-end; pointer-events: none;
  padding: 0 calc(var(--u) * 44) calc(calc(var(--u) * 64) + env(safe-area-inset-bottom, 0px));
}
.sb-wm-h { margin: 0; font-weight: 500; letter-spacing: -.03em;
  font-size: clamp(46px, 10.5vw, 164px); line-height: .94; color: var(--sb-bone); }
.sb-wm-line { display: block; overflow: hidden;
  padding: .16em .04em .1em; margin: -.16em -.04em -.1em; }
.sb-wm-word { display: inline-block; }
.sb-wm-sub { margin: calc(var(--u) * 20) 0 0; max-width: 44ch;
  font-size: ${fluid(17, 15)}; line-height: 1.55; color: var(--sb-mute); }
.sb-hero-cap { position: absolute; right: calc(var(--u) * 44); bottom: calc(var(--u) * 40);
  z-index: 2; margin: 0; font-size: ${fluid(14, 13)}; color: var(--sb-mute);
  opacity: 0; visibility: hidden; }

/* headline word masks */
.sb-headline { margin: 0; font-weight: 500; letter-spacing: -.015em; line-height: 1.08; text-wrap: balance; }
.sb-line { display: inline-block; overflow: hidden; vertical-align: bottom;
  padding: .2em .04em .1em; margin: -.2em -.04em -.1em; }
.sb-word { display: inline-block; }
.sb-body { font-size: ${fluid(17, 15)}; line-height: 1.62; color: var(--sb-mute);
  max-width: 58ch; margin: calc(var(--u) * 22) 0 0; }
.sb-stat { margin: calc(var(--u) * 18) 0 0; font-size: ${fluid(14, 13)};
  letter-spacing: .04em; color: var(--sb-mute); }
.sb-a { color: ${GEO_TEXT}; }
.sb-a:hover { color: var(--sb-bone); }

/* frames + drift */
.sb-frame { position: relative; overflow: hidden; margin: 0;
  background: color-mix(in srgb, var(--sb-bone) 6%, transparent); }
.sb-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; }
@media (min-width: 992px) { .sb-frame-in { will-change: transform; } }
.sb-frame-in img { width: 100%; height: 100%; max-width: none; object-fit: cover; display: block; }

/* manifesto */
.sb-manifesto {
  display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 72);
  align-items: center; max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 150) calc(var(--u) * 44) calc(var(--u) * 110);
}
.sb-manifesto-fig { max-width: calc(var(--u) * 560); justify-self: end; }

/* view */
.sb-view { padding: calc(var(--u) * 40) 0 calc(var(--u) * 110); }
.sb-view-stage { position: relative; overflow: hidden; margin: 0;
  height: min(84svh, calc(var(--u) * 720)); }
.sb-view-copy { max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 56) calc(var(--u) * 44) 0; }

/* geothermal */
.sb-geo { max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 110) calc(var(--u) * 44) calc(var(--u) * 60); }
.sb-geo-row { display: grid; grid-template-columns: 3fr 2fr; gap: calc(var(--u) * 24);
  margin-top: calc(var(--u) * 48); align-items: start; }
.sb-geo-main { aspect-ratio: 3 / 2 !important; }
.sb-geo-side { aspect-ratio: 3 / 4 !important; margin-top: calc(var(--u) * 90); }

/* diamond circle */
.sb-circle {
  display: grid; grid-template-columns: 1.1fr 1fr; gap: calc(var(--u) * 72);
  align-items: center; max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 110) calc(var(--u) * 44);
}
.sb-circle-list { list-style: none; margin: calc(var(--u) * 40) 0 0; padding: 0; }
.sb-circle-list li { display: grid; grid-template-columns: 12ch 1fr auto;
  gap: 16px; align-items: baseline; border-top: 1px solid var(--sb-hair);
  padding: calc(var(--u) * 16) 0; }
.sb-circle-name { font-weight: 500; font-size: ${fluid(17, 15)}; }
.sb-circle-note { font-size: ${fluid(15, 14)}; color: var(--sb-mute); }
.sb-circle-dist { font-size: ${fluid(14, 13)}; color: ${GEO_TEXT}; white-space: nowrap; }

/* seasons */
.sb-seasons { padding: calc(var(--u) * 60) 0 calc(var(--u) * 110); }
.sb-seasons-stage { position: relative; height: min(88svh, calc(var(--u) * 760)); overflow: hidden; }
.sb-seasons-cap { position: absolute; left: calc(var(--u) * 44); bottom: calc(var(--u) * 36);
  margin: 0; z-index: 2; font-size: ${fluid(16, 14)}; color: var(--sb-bone);
  text-shadow: 0 1px 18px rgba(16,17,18,.6); max-width: 40ch; }

/* guests */
.sb-guests { max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 110) calc(var(--u) * 44) calc(var(--u) * 40); }
.sb-quotes { list-style: none; display: grid; grid-template-columns: repeat(3, 1fr);
  gap: calc(var(--u) * 40); margin: calc(var(--u) * 52) 0 0; padding: 0; }
.sb-quote { border-top: 1px solid var(--sb-hair); padding-top: calc(var(--u) * 22); }
.sb-quote p { margin: 0; font-size: ${fluid(17, 15)}; line-height: 1.58; }
.sb-quote cite { display: block; margin-top: calc(var(--u) * 14); font-style: normal;
  font-size: ${fluid(13, 12)}; color: var(--sb-mute); }

/* booking */
.sb-book {
  display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 80);
  max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 90) calc(var(--u) * 44) calc(var(--u) * 150);
}
.sb-facts { margin: calc(var(--u) * 36) 0 0; display: grid; gap: calc(var(--u) * 14); padding: 0; }
.sb-facts div { display: flex; gap: 16px; border-top: 1px solid var(--sb-hair);
  padding-top: calc(var(--u) * 12); }
.sb-facts dt { min-width: 10ch; font-size: ${fluid(13, 12)}; letter-spacing: .06em;
  text-transform: uppercase; color: var(--sb-mute); padding-top: 2px; }
.sb-facts dd { margin: 0; font-size: ${fluid(15, 14)}; }
.sb-owner-note { margin-top: calc(var(--u) * 40); }
.sb-owner-note-label { margin: 0; font-size: ${fluid(12, 12)}; font-weight: 500;
  letter-spacing: .14em; text-transform: uppercase; color: var(--sb-mute); }
.sb-owner-note-body { margin: calc(var(--u) * 10) 0 0; font-size: ${fluid(15, 14)};
  line-height: 1.6; color: var(--sb-mute); }

.sb-book-form { align-self: start; }
.sb-fields { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 16); }
.sb-field { display: grid; gap: 8px; }
.sb-field-wide { grid-column: 1 / -1; }
.sb-field-label { font-size: 12.5px; font-weight: 500; letter-spacing: .05em; }
.sb-optional { font-weight: 400; color: var(--sb-mute); }
.sb-field input, .sb-field select, .sb-field textarea {
  font: inherit; font-size: 15px; color: var(--sb-bone);
  background: #1B1D1F; border: 1px solid var(--sb-hair); border-radius: 0;
  padding: 12px 12px; min-height: 44px; width: 100%;
}
.sb-field textarea { resize: vertical; }
.sb-field input:focus, .sb-field select:focus, .sb-field textarea:focus {
  outline: 2px solid ${GEO_TEXT}; outline-offset: 1px;
}
.sb-field-error { color: #E08A70; font-size: 14px; margin: 14px 0 0; }
.sb-cta {
  font: inherit; font-weight: 500; font-size: ${fluid(15, 14)}; cursor: pointer;
  margin-top: calc(var(--u) * 24); width: 100%; min-height: 48px;
  background: ${GEO}; color: ${BLACK}; border: 0; border-radius: 0;
  padding: 13px 22px; transition: filter .25s ease, transform .15s ease;
}
.sb-cta:hover { filter: brightness(1.08); }
.sb-cta:active { transform: scale(.98); }
.sb-ghost {
  font: inherit; font-size: inherit; cursor: pointer; background: none;
  border: 0; padding: 0; color: ${GEO_TEXT}; text-decoration: underline;
  text-underline-offset: 2px; min-height: 44px;
}
.sb-ghost:hover { color: var(--sb-bone); }
.sb-book-note { margin: calc(var(--u) * 16) 0 0; font-size: ${fluid(13, 12.5)};
  color: var(--sb-mute); line-height: 1.6; }
.sb-book-done { border: 1px solid var(--sb-hair); background: #17191B;
  padding: calc(var(--u) * 36); align-self: start; }
.sb-book-done-title { margin: 0; font-weight: 500; font-size: ${fluid(24, 19)}; }

/* footer */
.sb-foot { border-top: 1px solid var(--sb-hair); }
.sb-foot-grid { display: grid; grid-template-columns: repeat(3, 1fr);
  gap: calc(var(--u) * 44); max-width: calc(var(--u) * 1360); margin: 0 auto;
  padding: calc(var(--u) * 52) calc(var(--u) * 44) calc(var(--u) * 68); }
.sb-foot-mark { font-weight: 500; letter-spacing: .2em; font-size: ${fluid(13, 13)};
  margin: 0 0 calc(var(--u) * 12); }
.sb-foot-line { font-size: ${fluid(13, 13)}; line-height: 1.6; color: var(--sb-mute);
  margin: 0 0 calc(var(--u) * 8); }

/* loader */
.sb-loader { position: fixed; inset: 0; z-index: 60; background: ${BLACK};
  display: grid; place-content: center;
  transition: opacity .55s ease .3s; }
.sb-loader-form { width: min(60vw, 520px); height: auto;
  transition: transform .9s cubic-bezier(.76, 0, .24, 1); }
.sb-loader.is-leaving { opacity: 0; pointer-events: none; }
.sb-loader.is-leaving .sb-loader-form { transform: scale(7); }
.sb-loader-pct { position: fixed; left: calc(var(--u) * 44); bottom: calc(var(--u) * 38);
  margin: 0; font-size: 12px; letter-spacing: .16em; color: ${MUTE}; }

/* responsive */
@media (max-width: 991px) {
  .sb-nav { padding: 10px 20px; gap: 16px; }
  .sb-nav-links { display: none; }
  .sb-nav-cta { margin-left: auto; min-height: 44px; display: inline-flex; align-items: center; }
  .sb-manifesto, .sb-book, .sb-circle { grid-template-columns: 1fr; gap: 48px;
    padding-left: 20px; padding-right: 20px; }
  .sb-manifesto-fig { justify-self: stretch; max-width: none; }
  .sb-geo, .sb-guests { padding-left: 20px; padding-right: 20px; }
  .sb-geo-row { grid-template-columns: 1fr; }
  .sb-geo-side { margin-top: 0; }
  .sb-quotes { grid-template-columns: 1fr; }
  .sb-foot-grid { grid-template-columns: 1fr; padding-left: 20px; padding-right: 20px; }
  .sb-fields { grid-template-columns: 1fr 1fr; }
  .sb-view-copy { padding-left: 20px; padding-right: 20px; }
  .sb-seasons-cap { left: 20px; right: 20px; }
  .sb-circle-list li { grid-template-columns: 1fr auto; }
  .sb-circle-note { grid-column: 1 / -1; }
}
@media (max-width: 767px) {
  .sb-fields { grid-template-columns: 1fr; }
  .sb-wm-h { font-size: clamp(40px, 14vw, 72px); }
}

@media (prefers-reduced-motion: reduce) {
  .sb-root * { transition: none !important; animation: none !important; }
  .sb-rv { opacity: 1 !important; transform: none !important; }
  .sb-word, .sb-wm-word { transform: none !important; opacity: 1 !important; }
  .sb-frame-in { inset: 0; transform: none !important; }
  .sb-hero-cap { opacity: 1 !important; visibility: visible !important; }
}
`
