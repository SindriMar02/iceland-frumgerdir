import { useEffect, useRef, useState } from 'react'
import { Link, useNavigationType } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  BOOK, CONTACT, JSON_LD, LOGO, PHOTO, SERIES, SERVICES, TESTIMONIALS, WORKS,
  arOf, seriesName, srcSet,
} from './data'
import {
  ClFoot, ClNav, CursorRing, Headline, ROUTE, Rule, SHARED_CSS,
  buildEntrance, createLenis, createRevealSweep, finePointer, fluid, reduced,
} from './shared'
import type { SmoothScroller } from './shared'

/** Where the visitor stood on the front page when they opened a work. */
const WALL_Y = 'cl-wall-y'

/** Remember the spot so the back button returns to it, not to the top. */
const rememberSpot = () => {
  try { sessionStorage.setItem(WALL_Y, String(Math.round(window.scrollY))) } catch { /* private mode */ }
}

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('chrislund')

/* ── CHRISTOPHER LUND · "ÚRVALIÐ" ──────────────────────────────────────────
   The Búðir machine re-aimed at a photographer: the horizontal journey stops
   being a coastline and becomes an EXHIBITION WALL you walk along, one work
   at a time, FULL BLEED. Each plate is a real link into the safn page where
   the work hangs with its caption and its siblings. The 130-against-12
   arithmetic from his own book page is the page's thesis: the craft is the
   edit.

   Carried from Búðir with its measured values: the pinned horizontal journey
   (ONE track tween on ONE pinned master, containerAnimation for inner
   triggers, function-form end), the inner panel parallax (xPercent 7.5 →
   -7.5 at scale 1.16), and the drawn-rule section heads. The circle cursor
   is Chris's own request: a gold dot that opens into a frosted ring reading
   "Skoða" over every plate. Búðir's sky-scrub is deliberately NOT here (one
   palette-scrub build per batch); the Daylight per-word headline device is
   grafted onto the VITNI plate, as approved.

   Lenis runs ONLY on fine pointers ([[lenis-mobile-damage]]); touch scroll
   stays native. Scoped fluid unit --u on .cl-root only. ── */

/* The hanging order alternates landscape and architecture so no two rooms of
   the wall feel alike; VITNI closes the walk. */
const WALL_ORDER = ['thoka', 'blalys', 'halendi', 'timburhus', 'sjor', 'landrover', 'vitni']
const WALL = WALL_ORDER
  .map((id) => WORKS.find((w) => w.id === id && w.wall))
  .filter((w): w is NonNullable<typeof w> => !!w)

/* ── motion engine ─────────────────────────────────────────────────────── */

function useMotion(ready: boolean, restoring: boolean) {
  useEffect(() => {
    if (!ready) return
    const root = document.querySelector<HTMLElement>('.cl-root')
    if (!root) return

    if (reduced()) {
      root.classList.add('cl-static')
      root.classList.remove('cl-pre')
      return
    }

    root.classList.add('cl-js')
    ScrollTrigger.config({ ignoreMobileResize: true })

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      // threshold 0: a figure taller than the sampling window that is scrolled
      // past fast never reaches a ratio threshold, and stays clipped forever.
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    root.querySelectorAll('.cl-rv').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in')
      io.observe(el)
    })

    const wallPinActive = window.matchMedia('(min-width: 992px)').matches

    const ctx = gsap.context(() => {
      /* THE OPENING — one timeline: photograph and header together, the
         wordmark out of them, the reading text last. Skipped entirely when
         we are restoring a scroll position, because an entrance that plays
         while the visitor is being put back mid-page is just a flash. */
      if (!restoring) buildEntrance(root)
      else root.classList.remove('cl-pre')

      /* word-mask rises. Desktop: wall headlines ride the pinned
         containerAnimation below instead. Mobile/tablet: the wall never
         pins, so give them this same generic rise or they'd never animate.
         The hero title is owned by the opening timeline, not by a trigger. */
      root.querySelectorAll<HTMLElement>('[data-cl-headline]').forEach((h) => {
        if (h.closest('.cl-wall') && wallPinActive) return
        if (h.dataset.clEnter === 'word' && !restoring) return
        const words = h.querySelectorAll<HTMLElement>('.cl-word')
        if (!words.length) return
        gsap.fromTo(words,
          { yPercent: 116, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 1.05, ease: 'expo.out', stagger: 0.07,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          })
      })

      /* hero drift (the settle itself belongs to the opening timeline) */
      const heroImg = root.querySelector<HTMLElement>('.cl-hero img')
      if (heroImg) {
        gsap.to(heroImg, {
          yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: '.cl-hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
      }

      /* THE WALL — Búðir's engine, verbatim shape: all plates on one
         max-content track; ONE pinned trigger scrubs ONE track tween. */
      const wall = root.querySelector<HTMLElement>('.cl-wall')
      const track = root.querySelector<HTMLElement>('.cl-wall-track')
      const progress = root.querySelector<HTMLElement>('.cl-wall-progress')
      const counter = root.querySelector<HTMLElement>('.cl-wall-count')
      const maxX = () => (track ? Math.max(1, track.scrollWidth - window.innerWidth) : 1)
      if (wall && track && wallPinActive) {
        const tween = gsap.to(track, { x: () => -maxX(), ease: 'none', force3D: true })
        ScrollTrigger.create({
          animation: tween,
          trigger: wall,
          pin: wall,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + maxX(),
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress) progress.style.transform = `scaleX(${self.progress})`
            if (counter) {
              const n = Math.min(WALL.length, Math.max(1, Math.round(self.progress * WALL.length + 0.5)))
              const label = `${String(n).padStart(2, '0')} / ${String(WALL.length).padStart(2, '0')}`
              if (counter.textContent !== label) counter.textContent = label
            }
          },
        })
        /* inner plate parallax — Búðir's measured drift, centre-spared so
           coverage holds on every plate size */
        root.querySelectorAll<HTMLElement>('.cl-plate-media img').forEach((img) => {
          gsap.fromTo(img, { xPercent: 7.5, scale: 1.16 }, {
            xPercent: -7.5, scale: 1.16, ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.cl-plate'),
              containerAnimation: tween,
              start: 'left 100%', end: 'right 0%', scrub: true,
            },
          })
        })
        /* plate captions rise as their plate slides in */
        root.querySelectorAll<HTMLElement>('.cl-plate-cap').forEach((cap) => {
          gsap.fromTo(cap, { y: 26, opacity: 0 }, {
            y: 0, opacity: 1, duration: .9, ease: 'power3.out',
            scrollTrigger: {
              trigger: cap.closest('.cl-plate'),
              containerAnimation: tween,
              start: 'left 72%', once: true,
            },
          })
        })
        /* the VITNI plate's per-word rise fires as the plate slides in */
        const vitni = root.querySelector<HTMLElement>('.cl-vitni-title')
        if (vitni) {
          gsap.fromTo(vitni.querySelectorAll('.cl-word'),
            { yPercent: 116, opacity: 0 },
            {
              yPercent: 0, opacity: 1, duration: 1.05, ease: 'expo.out', stagger: 0.09,
              scrollTrigger: {
                trigger: vitni.closest('.cl-plate'),
                containerAnimation: tween,
                start: 'left 62%', once: true,
              },
            })
        }
      }

      /* the book's contrast pairs drift toward each other on scrub: the
         andstæður made kinetic. Desktop only; resting CSS is the layout. */
      if (wallPinActive) {
        root.querySelectorAll<HTMLElement>('.cl-bok-pair').forEach((pair) => {
          const a = pair.querySelector('.cl-bok-fig-a')
          const b = pair.querySelector('.cl-bok-fig-b')
          if (!a || !b) return
          const st = { trigger: pair, start: 'top 90%', end: 'bottom 10%', scrub: 0.6 }
          gsap.fromTo(a, { y: 34 }, { y: -34, ease: 'none', scrollTrigger: st })
          gsap.fromTo(b, { y: -34 }, { y: 34, ease: 'none', scrollTrigger: { ...st } })
        })
      }

      /* the edit numerals count up once, from real numbers to real numbers */
      const nums = root.querySelectorAll<HTMLElement>('[data-cl-count]')
      nums.forEach((el) => {
        const to = Number(el.dataset.clCount || 0)
        const obj = { v: 0 }
        el.textContent = '0' // zero it off-screen now, not on trigger fire, or the
        // real JSX value (130/12) sits there and visibly snaps to 0 later
        gsap.to(obj, {
          v: to, duration: 1.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: () => { el.textContent = String(Math.round(obj.v)) },
        })
      })
    }, root)

    // IntersectionObserver is the primary reveal trigger, but a scroll fast
    // enough to skip an element's whole bounding box between painted frames
    // can leave it with no frame ever observed inside the viewport -- is-in
    // never lands, so it stays clipped forever. The backstop is throttled and
    // self-pruning; measuring every unrevealed element every frame is the
    // main-thread cost the Sandholt purge removed.
    const revealSweep = createRevealSweep(root)
    const sweep = () => { ScrollTrigger.update(); revealSweep.tick() }
    window.addEventListener('scroll', sweep, { passive: true })

    /* The track is measured before the wall's lazy photographs have laid out,
       so re-measure once the page is really settled -- and only then put the
       visitor back exactly where they left the wall. */
    let restored = false
    const settleAndRestore = () => {
      ScrollTrigger.refresh()
      revealSweep.refresh()
      if (restored || !restoring) return
      restored = true
      const y = Number(sessionStorage.getItem(WALL_Y) || 0)
      if (y > 0) {
        window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
        ScrollTrigger.update()
      }
      sessionStorage.removeItem(WALL_Y)
    }
    const settleTimer = window.setTimeout(settleAndRestore, 260)
    window.addEventListener('load', settleAndRestore)

    /* smooth scroll attaches async, and only ever on fine pointers */
    let lenis: SmoothScroller | null = null
    let tick: ((t: number) => void) | null = null
    let disposed = false
    createLenis().then((l) => {
      if (!l) return
      if (disposed) { l.destroy(); return }
      lenis = l
      ;(window as unknown as { __clLenis?: SmoothScroller | null }).__clLenis = l
      l.on('scroll', sweep)
      tick = (t: number) => { l.raf(t * 1000) }
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    })

    return () => {
      disposed = true
      io.disconnect()
      if (tick) gsap.ticker.remove(tick)
      window.clearTimeout(settleTimer)
      window.removeEventListener('scroll', sweep)
      window.removeEventListener('load', settleAndRestore)
      ctx.revert()
      lenis?.destroy()
      ;(window as unknown as { __clLenis?: SmoothScroller | null }).__clLenis = null
    }
  }, [ready, restoring])
}

/* ── series picker: the preview comes to the cursor ─────────────────────────
   On a fine pointer the image follows the cursor over the list; each row is
   now a real link into the safn page, landed on that series. The lerped
   position is written straight to the node via a ref; setState fires ONLY
   when a boolean or the active row actually flips. Touch, coarse pointers
   and reduced motion keep the anchored preview. ──────────────────────────── */

function SeriesPicker() {
  const [active, setActive] = useState(0)
  const [floating, setFloating] = useState(false)
  const floatRef = useRef<HTMLElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const s = SERIES[active]

  const canFloat = () => finePointer() && !reduced()

  useEffect(() => {
    if (!floating) return
    let raf = 0
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.14
      pos.current.y += (target.current.y - pos.current.y) * 0.14
      const el = floatRef.current
      if (el) {
        el.style.transform =
          `translate3d(${pos.current.x.toFixed(1)}px, ${pos.current.y.toFixed(1)}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [floating])

  const place = (e: React.PointerEvent) => {
    target.current = { x: e.clientX, y: e.clientY }
  }

  return (
    <div className={`cl-series ${floating ? 'is-floating' : ''}`}>
      <ul
        className="cl-series-list"
        aria-label="Myndaraðir"
        onPointerEnter={(e) => {
          if (!canFloat()) return
          // start under the cursor, or the preview flies in from the corner
          target.current = { x: e.clientX, y: e.clientY }
          pos.current = { x: e.clientX, y: e.clientY }
          const el = floatRef.current
          if (el) el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
          setFloating(true)
        }}
        onPointerMove={place}
        onPointerLeave={() => setFloating(false)}
      >
        {SERIES.map((it, i) => (
          <li key={it.key}>
            <Link
              className={`cl-series-row ${i === active ? 'is-active' : ''}`}
              to={`${ROUTE}/safn?rod=${it.key}`}
              onClick={rememberSpot}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="cl-series-row-inner">
                <span className="cl-series-top">
                  <span className="cl-series-name">{it.name}</span>
                  <span className="cl-series-arrow" aria-hidden="true">&rarr;</span>
                </span>
                <span className="cl-series-note">{it.note}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* anchored preview: touch, coarse pointer, reduced motion, and the
          keyboard path (revealed by :focus-within, which has no cursor) */}
      <figure className="cl-series-preview" aria-live="polite">
        <img key={s.photo.src} src={s.photo.src} srcSet={srcSet(s.photo.src)}
          sizes="(max-width: 991px) 92vw, 40vw" alt={s.photo.alt}
          loading="lazy" decoding="async" />
        <figcaption>{s.name}</figcaption>
      </figure>

      {/* pointer-follow preview: decorative, the anchored one carries the a11y */}
      <figure className="cl-series-float" ref={floatRef} aria-hidden="true">
        <img src={s.photo.src} srcSet={srcSet(s.photo.src)} sizes="340px"
          alt="" loading="lazy" decoding="async" />
      </figure>
    </div>
  )
}

/* ── the page ──────────────────────────────────────────────────────────── */

export default function ChrisLundPage() {
  const [ready, setReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  /* arriving via the browser's back button means the visitor is returning to
     a spot on the wall, not opening the site */
  const restoring = useNavigationType() === 'POP' && !!sessionStorage.getItem(WALL_Y)
  /* the holding class has to be on the very first painted frame, so it is
     decided during render and never inside an effect */
  const holdRef = useRef(!reduced() && !restoring)

  useEffect(() => {
    setThemeColor('#F5F4F1')
    document.title = 'Christopher Lund ljósmyndari'
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prevDescription = meta.content
    meta.content = 'Christopher Lund, ljósmyndari í yfir 20 ár á Íslandi. Landslag, fyrirtæki, arkitektúr og brúðkaup, auk FineArt prentunar og skönnunar. Sími 822 7601.'
    /* the shell ships lang="en", which is wrong for an Icelandic page */
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'is'
    setReady(true)
    return () => {
      meta.content = prevDescription
      document.documentElement.lang = prevLang
    }
  }, [])

  useMotion(ready, restoring)

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const lenis = (window as unknown as { __clLenis?: { scrollTo: (t: Element, o?: object) => void } | null }).__clLenis
    if (lenis && !reduced()) lenis.scrollTo(el)
    else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div ref={rootRef} className={`cl-root ${holdRef.current ? 'cl-pre' : ''}`}>
      <style>{SHARED_CSS + CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <CursorRing />
      <ClNav home onAnchor={anchor} />

      {/* 01 · hero slab */}
      <main>
      <section className="cl-hero" id="top">
        <img data-cl-enter="media" src={PHOTO.vestrahorn.src} srcSet={srcSet(PHOTO.vestrahorn.src)} sizes="100vw"
          alt={PHOTO.vestrahorn.alt} loading="eager" decoding="async"
          {...{ fetchpriority: 'high' }} />
        <Headline as="h1" className="cl-hero-title" text="Christopher Lund" size={120} floor={40} enter />
        <div className="cl-hero-block">
          <p className="cl-hero-sub" data-cl-enter="item">
            Ljósmyndari í yfir tuttugu ár: landslag, fyrirtæki og arkitektúr, ásamt
            FineArt prentun.
          </p>
        </div>
      </section>

      {/* 02 · the edit */}
      <section className="cl-edit">
        <Rule label="Úrvalið" />
        <div className="cl-edit-nums" role="group" aria-label="130 myndir í bókinni, 12 á veggnum">
          <div className="cl-edit-num">
            <span className="cl-edit-n" data-cl-count="130" aria-hidden="true">130</span>
            <span className="cl-edit-l">myndir í bókinni</span>
          </div>
          <span className="cl-edit-slash" aria-hidden="true" />
          <div className="cl-edit-num">
            <span className="cl-edit-n" data-cl-count="12" aria-hidden="true">12</span>
            <span className="cl-edit-l">á veggnum í Gallery Grásteini</span>
          </div>
        </div>
        <p className="cl-body cl-rv">
          Bókin geymir 130 landslagsmyndir af tíu ára ferðum um landið. Á sýningunni
          héngu tólf. Ljósmyndun er ekki söfnun heldur úrval, og vefur ljósmyndara á
          að hanga eins og veggur, ekki eins og geymsla.
        </p>
      </section>

      {/* 03 · the exhibition wall: pinned horizontal, FULL BLEED, every plate
          a real doorway into the safn */}
      <section className="cl-wall" id="veggurinn" aria-label="Sýningarveggurinn">
        <div className="cl-wall-progressbar" aria-hidden="true"><span className="cl-wall-progress" /></div>
        <span className="cl-wall-count" aria-hidden="true">01 / {String(WALL.length).padStart(2, '0')}</span>
        <div className="cl-wall-track">
          <div className="cl-plate cl-plate-intro">
            <p className="cl-plate-kicker">Veggurinn</p>
            <Headline text="Gakktu með veggnum." size={92} floor={34} />
            <p className="cl-body">
              {WALL.length} verk í fullri stærð, hvert með vegginn út af fyrir sig.
              Veldu verk til að skoða það nánar.
            </p>
          </div>
          {WALL.map((w, i) => (
            w.series === 'vitni' ? (
              <Link
                key={w.id}
                className="cl-plate cl-plate-full cl-plate-vitni"
                to={`${ROUTE}/safn?verk=${w.id}`}
                onClick={rememberSpot}
                data-cursor="Skoða"
                aria-label={`${w.title}: skoða í safninu`}
              >
                <div className="cl-plate-media">
                  <img src={w.photo.src} srcSet={srcSet(w.photo.src)} sizes="100vw"
                    alt={w.photo.alt} loading="lazy" decoding="async" />
                </div>
                {/* the Daylight device: eyebrow + colossal title sharing the
                    media's cell, per-word rise */}
                <div className="cl-vitni-lockup">
                  <p className="cl-vitni-eyebrow">Ljósmyndasafn Reykjavíkur · 2020</p>
                  <Headline className="cl-vitni-title" text="VITNI" size={150} floor={54} />
                </div>
                <div className="cl-plate-scrim" aria-hidden="true" />
                <div className="cl-plate-cap">
                  <span className="cl-plate-title">Sýningin í heild</span>
                  <span className="cl-plate-meta">{String(i + 1).padStart(2, '0')}</span>
                </div>
              </Link>
            ) : (
              <Link
                key={w.id}
                className="cl-plate cl-plate-full"
                to={`${ROUTE}/safn?verk=${w.id}`}
                onClick={rememberSpot}
                data-cursor="Skoða"
                aria-label={`${w.title}: skoða í safninu`}
              >
                <div className="cl-plate-media">
                  <img src={w.photo.src} srcSet={srcSet(w.photo.src)} sizes="100vw"
                    alt={w.photo.alt} loading="lazy" decoding="async" />
                </div>
                <div className="cl-plate-scrim" aria-hidden="true" />
                <div className="cl-plate-cap">
                  <span className="cl-plate-title">{w.title}</span>
                  <span className="cl-plate-meta">{seriesName(w.series)} · {String(i + 1).padStart(2, '0')}</span>
                </div>
              </Link>
            )
          ))}
        </div>
      </section>

      {/* bridge — the wall's payoff turned into a reason to keep looking,
          then a reason to call */}
      <section className="cl-bridge">
        <p className="cl-bridge-text cl-rv">
          Verkin á veggnum eru sönnunin. Sama natni fer í fyrirtækja-,
          brúðkaups- og portrettmyndir.
        </p>
        <div className="cl-bridge-row cl-rv">
          <Link className="cl-bridge-safn" to={`${ROUTE}/safn`}>Skoða allt safnið</Link>
          <a className="cl-bridge-tel" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
        </div>
      </section>

      {/* 04 · series picker */}
      <section className="cl-safn">
        <Rule label="Myndaraðirnar" />
        <Headline text="Sex raðir, eitt auga." size={80} floor={32} measure={640} />
        <SeriesPicker />
      </section>

      {/* 05 · the book: no frames, no mockups. The photographs themselves,
          hung in the pairs the book is built on: andstæður. */}
      <section className="cl-bok" id="bokin">
        <div className="cl-bok-head">
          <Rule label="Bókin" />
          <Headline text="Iceland, Contrasts in Nature." size={80} floor={32} measure={760} />
          <p className="cl-body cl-rv">
            Andstæður landsins á opnum sem svara hver annarri: ís á móti jarðhita,
            stuðlaberg á móti mosa. Hver mynd fær rými til að anda.
          </p>
        </div>
        {BOOK.pairs.map((pair, i) => {
          const arA = arOf(pair.a.ratio)
          const arB = arOf(pair.b.ratio)
          /* the two portrait spreads need their own proportions, or a tall
             photograph in a wide track either overruns the viewport or is
             capped and leaves the track half empty */
          const port = arA < 1
          return (
            <figure
              key={i}
              className={`cl-bok-pair ${i % 2 ? 'is-flip' : ''} ${port ? 'is-port' : ''}`}
            >
              <div className="cl-bok-fig cl-bok-fig-a cl-rv" style={{ '--ar': arA } as React.CSSProperties}>
                <img src={pair.a.src} srcSet={srcSet(pair.a.src)}
                  sizes="(max-width: 991px) 92vw, 52vw" style={{ aspectRatio: pair.a.ratio }}
                  alt={pair.a.alt} loading="lazy" decoding="async" />
              </div>
              <figcaption className="cl-bok-cap cl-rv">{pair.cap}</figcaption>
              <div className="cl-bok-fig cl-bok-fig-b cl-rv" style={{ '--ar': arB } as React.CSSProperties}>
                <img src={pair.b.src} srcSet={srcSet(pair.b.src)}
                  sizes="(max-width: 991px) 78vw, 34vw" style={{ aspectRatio: pair.b.ratio }}
                  alt={pair.b.alt} loading="lazy" decoding="async" />
              </div>
            </figure>
          )
        })}
        <p className="cl-bok-specline cl-rv">{BOOK.specLine}</p>
      </section>

      {/* 06 · services: three doors, each its own page */}
      <section className="cl-thjonusta" id="thjonusta">
        <div className="cl-thjonusta-copy">
          <Rule label="Þjónusta" />
          <Headline text="Frá töku að prenti." size={72} floor={30} measure={560} />
          <p className="cl-body cl-rv">
            Ekki bara fyrir eigin verk: ljósmyndarar, listamenn og forlög fá sömu
            prentun, skönnun og litgreiningu hér.
          </p>
          <ul className="cl-services">
            {SERVICES.map((s) => (
              <li key={s.slug} className="cl-rv">
                <Link className="cl-service" to={`${ROUTE}/${s.slug}`} onClick={rememberSpot} data-cursor="Opna">
                  <span className="cl-service-top">
                    <span className="cl-service-name">{s.name}</span>
                    <span className="cl-service-arrow" aria-hidden="true">&rarr;</span>
                  </span>
                  <span className="cl-service-note">
                    {s.slug === 'prentun' && 'Pigment-blek á sýrufrían pappír, Epson SC-P9500'}
                    {s.slug === 'skonnun' && 'Filmur í allt að 4×5" stærð, listaverk stór og smá'}
                    {s.slug === 'litgreining' && 'Samræmt litróf fyrir bækur og prent'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <a className="cl-thjonusta-cta cl-rv" href={CONTACT.phoneHref}>
            Spurning um verk? Hringdu í {CONTACT.phone}.
          </a>
        </div>
        <figure className="cl-thjonusta-fig cl-rv">
          <img src={PHOTO.filmur.src} srcSet={srcSet(PHOTO.filmur.src)}
            sizes="(max-width: 991px) 92vw, 40vw"
            alt={PHOTO.filmur.alt} loading="lazy" decoding="async" />
          <figcaption className="cl-fig-cap">Öll verk fara í gegnum sömu vinnslu: litgreiningu, frágang, prentun.</figcaption>
        </figure>
      </section>

      {/* 07 · one voice that carries: RAX, verbatim from his own umsagnir page */}
      <section className="cl-quote" aria-label="Umsögn">
        <blockquote className="cl-quote-block cl-rv">
          <p>„{TESTIMONIALS.rax.quote}“</p>
          <footer>{TESTIMONIALS.rax.name}, {TESTIMONIALS.rax.org}</footer>
        </blockquote>
      </section>

      {/* 08 · about, now with his own portrait from his own About page */}
      <section className="cl-um">
        <figure className="cl-um-fig cl-rv">
          <img src={PHOTO.christopher.src} srcSet={srcSet(PHOTO.christopher.src)}
            sizes="(max-width: 991px) 92vw, 48vw"
            alt={PHOTO.christopher.alt} loading="lazy" decoding="async" />
        </figure>
        <div className="cl-um-copy">
          <Rule label="Um Christopher" />
          <Headline text="Tuttugu ár á bak við vélina." size={64} floor={30} measure={560} />
          <p className="cl-body cl-rv">
            Christopher lýsir sér sjálfur sem ljósmyndara, eiginmanni, föður,
            stjúpföður, afa og nörd. Hann hefur starfað í yfir tuttugu ár á Íslandi,
            í Noregi og Danmörku, talar fjögur tungumál og sinnir auk myndatöku
            hágæða prentun, myndvinnslu og undirbúningi bóka.
          </p>
          <div className="cl-um-marks cl-rv">
            <img className="cl-um-logo" src={LOGO.lockup} alt="Merki Christophers Lund" loading="lazy" decoding="async" />
            <img className="cl-um-op" src={LOGO.onePercent} alt="1% For The Planet, aðili" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* 09 · contact */}
      <section className="cl-samband" id="samband">
        <Headline text="Næsta mynd byrjar á símtali." size={84} floor={34} measure={760} />
        <a className="cl-samband-tel cl-rv" href={CONTACT.phoneHref}>822 7601</a>
        <p className="cl-samband-addr cl-rv">{CONTACT.address}</p>
      </section>

      <ClFoot />
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}

/* ── page styles (shared chrome lives in shared.tsx) ───────────────────── */

const CSS = `
/* hero */
.cl-hero { position: relative; height: 100svh; min-height: 560px; overflow: hidden; display: grid; align-items: end; }
.cl-hero img { position: absolute; inset: -6% 0; width: 100%; height: 112%; object-fit: cover; will-change: transform; }
.cl-hero-title {
  position: absolute; left: calc(var(--u) * 30); bottom: calc(var(--u) * 110);
  z-index: 2; color: #F4F1EA; mix-blend-mode: difference; margin: 0;
  font-weight: 500; letter-spacing: -.015em;
}
.cl-hero-block {
  position: relative; z-index: 2; padding: 0 calc(var(--u) * 34) calc(var(--u) * 40);
  color: #F6F4EE;
}
.cl-hero-block::before {
  content: ''; position: absolute; inset: auto 0 0 0; height: 220%; z-index: -1;
  background: linear-gradient(180deg, transparent, rgb(15 14 12 / .5));
  pointer-events: none;
}
.cl-hero-sub { max-width: 44ch; font-size: ${fluid(17, 15)}; line-height: 1.6; margin: 0; }
@media (prefers-reduced-motion: reduce) {
  .cl-hero img { transform: none !important; inset: 0; height: 100%; }
}

/* the edit */
.cl-edit { padding: calc(var(--u) * 150) calc(var(--u) * 34); }
.cl-edit-nums { display: flex; align-items: baseline; gap: calc(var(--u) * 44); flex-wrap: wrap; margin-bottom: calc(var(--u) * 36); }
.cl-edit-n { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(190, 72)}; line-height: 1; letter-spacing: -.03em; display: block; font-variant-numeric: tabular-nums; }
.cl-edit-l { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12.5, 12)}; letter-spacing: .12em; text-transform: uppercase; color: var(--cl-mute); display: block; margin-top: 10px; }
.cl-edit-slash { width: 1px; align-self: stretch; background: var(--cl-hair); }

/* the wall: full-bleed plates */
.cl-wall { position: relative; background: #131311; color: #EFEDE7; }
.cl-wall-progressbar { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgb(239 237 231 / .14); z-index: 5; }
.cl-wall-progress { display: block; height: 100%; background: var(--cl-gold); transform: scaleX(0); transform-origin: left; }
.cl-wall-count {
  position: absolute; top: calc(var(--u) * 74); right: calc(var(--u) * 34); z-index: 5;
  font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12, 12)};
  letter-spacing: .18em; color: rgb(239 237 231 / .75); font-variant-numeric: tabular-nums;
}
.cl-wall-track { display: flex; align-items: stretch; width: max-content; will-change: transform; }
.cl-plate { flex: 0 0 auto; margin: 0; }
.cl-plate-intro {
  width: 62vw; height: 100svh; display: grid; align-content: center;
  padding: calc(var(--u) * 70) calc(var(--u) * 44);
}
.cl-plate-kicker { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12, 12)}; letter-spacing: .16em; text-transform: uppercase; color: var(--cl-gold); margin: 0 0 calc(var(--u) * 18); }
.cl-plate-intro .cl-body { color: #B9B7AE; }
.cl-plate-full {
  position: relative; display: block; width: 100vw; height: 100svh;
  color: inherit; text-decoration: none; overflow: hidden;
}
.cl-plate-media { position: absolute; inset: 0; overflow: hidden; background: #1D1D1A; transition: transform .8s cubic-bezier(.23,1,.32,1); }
.cl-plate-media img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
@media (hover: hover) and (pointer: fine) {
  .cl-plate-full:hover .cl-plate-media { transform: scale(1.015); }
}
.cl-plate-scrim {
  position: absolute; inset: auto 0 0 0; height: 34%; z-index: 1; pointer-events: none;
  background: linear-gradient(180deg, transparent, rgb(10 10 8 / .62));
}
.cl-plate-cap {
  position: absolute; inset: auto 0 0 0; z-index: 2;
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
  padding: 0 calc(var(--u) * 44) calc(var(--u) * 34);
}
.cl-plate-title { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(30, 20)}; letter-spacing: -.01em; color: #F4F1EA; }
.cl-plate-meta { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12, 12)}; letter-spacing: .14em; text-transform: uppercase; color: rgb(244 241 234 / .82); flex: none; }
.cl-plate-vitni .cl-vitni-lockup {
  position: absolute; inset: 0; z-index: 2; display: grid; place-content: center; text-align: center;
  padding: calc(var(--u) * 60); pointer-events: none;
}
.cl-vitni-eyebrow { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12, 12)}; letter-spacing: .18em; text-transform: uppercase; color: #EFEDE7; margin: 0 0 14px; }
.cl-vitni-title { color: #F4F1EA; mix-blend-mode: difference; font-weight: 500; letter-spacing: .04em; margin: 0; }
@media (max-width: 991px) {
  .cl-wall-track { display: block; width: auto; }
  .cl-plate-intro { width: auto; height: auto; padding: 44px 20px 28px; }
  .cl-plate-full { width: auto; height: auto; }
  .cl-plate-media { position: static; aspect-ratio: 4 / 3; }
  .cl-plate-media img { aspect-ratio: 4 / 3; }
  .cl-plate-cap { position: static; padding: 10px 20px 26px; }
  .cl-plate-title { color: #EFEDE7; font-size: ${fluid(22, 17)}; }
  .cl-plate-meta { color: rgb(239 237 231 / .7); }
  .cl-plate-scrim { display: none; }
  .cl-wall-progressbar, .cl-wall-count { display: none; }
}

/* bridge */
.cl-bridge { text-align: center; padding: calc(var(--u) * 60) calc(var(--u) * 34); border-bottom: 1px solid var(--cl-hair); }
.cl-bridge-text { max-width: calc(var(--u) * 560); margin: 0 auto calc(var(--u) * 22); font-size: ${fluid(17, 15)}; line-height: 1.6; color: var(--cl-ink); }
.cl-bridge-row { display: flex; justify-content: center; align-items: baseline; gap: calc(var(--u) * 40); flex-wrap: wrap; }
.cl-bridge-safn, .cl-bridge-tel {
  display: inline-block; font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(15, 13.5)};
  letter-spacing: .04em; text-decoration: none; border-bottom: 1px solid currentColor;
  padding-bottom: 2px; transition: color .3s cubic-bezier(.16,1,.3,1);
}
.cl-bridge-safn { color: var(--cl-ink); }
.cl-bridge-safn:hover { color: var(--cl-gold-text); }
.cl-bridge-tel { color: var(--cl-gold-text); }
.cl-bridge-tel:hover { color: var(--cl-ink); }

/* series picker */
.cl-safn { padding: calc(var(--u) * 150) calc(var(--u) * 34); }
.cl-series { display: grid; grid-template-columns: 1.15fr 1fr; gap: calc(var(--u) * 70); align-items: start; margin-top: calc(var(--u) * 30); }
.cl-series-list { list-style: none; margin: 0; padding: 0; }
.cl-series-row {
  --on: 0; display: block; width: 100%; text-align: left;
  padding: 16px 0; border-top: 1px solid var(--cl-hair); color: inherit;
  text-decoration: none;
}
.cl-series-row.is-active { --on: 1; }
.cl-series-row:active .cl-series-row-inner { transform: translateX(calc(var(--on) * 18px)) scale(.985); }
.cl-series-row-inner {
  display: grid; gap: 4px;
  transform: translateX(calc(var(--on) * 18px));
  transition: transform .5s cubic-bezier(.16,1,.3,1);
}
.cl-series-top { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; }
.cl-series-name { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(34, 22)}; line-height: 1.15; transition: color .3s cubic-bezier(.16,1,.3,1); }
.cl-series-arrow { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-size: ${fluid(22, 17)}; opacity: 0; transform: translateX(-8px); transition: opacity .35s, transform .5s cubic-bezier(.16,1,.3,1); color: var(--cl-gold-text); }
.cl-series-row.is-active .cl-series-name { color: var(--cl-gold-text); }
.cl-series-row.is-active .cl-series-arrow, .cl-series-row:focus-visible .cl-series-arrow { opacity: 1; transform: none; }
.cl-series-note { font-size: ${fluid(14, 13)}; color: var(--cl-mute); }
.cl-series-preview { position: sticky; top: calc(var(--u) * 80); margin: 0; }
.cl-series-preview img { width: 100%; aspect-ratio: 4 / 3.4; object-fit: cover; background: #E4E2DB; }
.cl-series-preview figcaption { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12, 12)}; letter-spacing: .14em; text-transform: uppercase; color: var(--cl-mute); padding-top: 10px; }
/* the float never exists for touch or reduced motion */
.cl-series-float { display: none; }

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  /* the image comes to the cursor, so the list takes the whole measure and
     nothing sits in a reserved column waiting to be filled */
  .cl-series { display: block; position: relative; margin-top: calc(var(--u) * 30); }
  .cl-series-preview {
    position: absolute; top: 0; right: 0; width: clamp(240px, 26%, 360px);
    opacity: 0; pointer-events: none;
    transition: opacity .3s cubic-bezier(.16,1,.3,1);
  }
  /* keyboard has no pointer, so focus anchors the preview instead */
  .cl-series:focus-within .cl-series-preview { opacity: 1; }
  .cl-series-float {
    display: block; position: fixed; top: 0; left: 0; z-index: 30; margin: 0;
    width: clamp(220px, 22vw, 340px); pointer-events: none; will-change: transform;
    opacity: 0; transition: opacity .35s cubic-bezier(.16,1,.3,1);
  }
  .cl-series.is-floating .cl-series-float { opacity: 1; }
  .cl-series-float img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; background: #E4E2DB; }
}

/* the book: photographs hung in pairs, no frames */
.cl-bok { padding: calc(var(--u) * 140) calc(var(--u) * 34); background: #ECEAE4; }
.cl-bok-head { max-width: calc(var(--u) * 860); margin-bottom: calc(var(--u) * 70); }
/* Each photograph is sized from its OWN aspect ratio against a shared
   height budget, so a landscape spread fills its track and a portrait one
   stays inside the viewport instead of either overrunning it or shrinking
   to its natural pixel size and stranding the column. The caption hangs
   under the large print like a wall label; the second print sits low in the
   facing column so the pair reads as two works answering each other. */
.cl-bok-pair {
  --bokh: min(72vh, calc(var(--u) * 660));
  display: grid; grid-template-columns: 7fr 5fr;
  column-gap: calc(var(--u) * 64); row-gap: 16px;
  align-items: start; margin: 0 0 calc(var(--u) * 108);
}
.cl-bok-fig-a { grid-column: 1; grid-row: 1; width: min(100%, calc(var(--bokh) * var(--ar))); }
.cl-bok-cap   { grid-column: 1; grid-row: 2; align-self: start; }
.cl-bok-fig-b {
  grid-column: 2; grid-row: 1 / span 2; align-self: end;
  width: min(100%, calc(var(--bokh) * .72 * var(--ar)));
}
.cl-bok-pair.is-flip { grid-template-columns: 5fr 7fr; }
.cl-bok-pair.is-flip .cl-bok-fig-a,
.cl-bok-pair.is-flip .cl-bok-cap { grid-column: 2; }
.cl-bok-pair.is-flip .cl-bok-fig-b { grid-column: 1; justify-self: start; }
.cl-bok-pair.is-flip .cl-bok-cap { text-align: right; }
/* two portraits: content-sized tracks pushed apart, so the pair sits as a
   duo rather than as two islands in half-empty columns */
.cl-bok-pair.is-port {
  grid-template-columns: max-content max-content; justify-content: space-between;
  max-width: calc(var(--u) * 1040); margin-inline: auto;
}
.cl-bok-pair.is-port .cl-bok-fig-a { width: calc(var(--bokh) * var(--ar)); }
.cl-bok-pair.is-port .cl-bok-fig-b { width: calc(var(--bokh) * .72 * var(--ar)); }
.cl-bok-fig { will-change: transform; }
.cl-bok-fig img { width: 100%; height: auto; object-fit: cover; display: block; }
.cl-bok-cap {
  font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12, 12)};
  letter-spacing: .14em; text-transform: uppercase; color: var(--cl-mute);
}
.cl-bok-specline {
  margin: calc(var(--u) * 40) 0 0; font-family: 'Space Mono', ui-monospace, monospace;
  font-size: ${fluid(12.5, 12)}; letter-spacing: .1em; color: var(--cl-mute);
}

/* services */
.cl-thjonusta { display: grid; grid-template-columns: 1.1fr 1fr; gap: calc(var(--u) * 70); align-items: start; padding: calc(var(--u) * 150) calc(var(--u) * 34); }
.cl-services { list-style: none; margin: calc(var(--u) * 10) 0 0; padding: 0; }
.cl-service { display: grid; gap: 6px; padding: 18px 0; border-top: 1px solid var(--cl-hair); color: inherit; text-decoration: none; }
.cl-service-top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.cl-service-name { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(26, 19)}; transition: color .3s cubic-bezier(.16,1,.3,1); }
.cl-service-arrow { flex: none; font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-size: ${fluid(20, 16)}; color: var(--cl-gold-text); opacity: 0; transform: translateX(-8px); transition: opacity .35s, transform .5s cubic-bezier(.16,1,.3,1); }
.cl-service:hover .cl-service-name, .cl-service:focus-visible .cl-service-name { color: var(--cl-gold-text); }
.cl-service:hover .cl-service-arrow, .cl-service:focus-visible .cl-service-arrow { opacity: 1; transform: none; }
.cl-service-note { font-size: ${fluid(14, 13)}; color: var(--cl-mute); }
.cl-thjonusta-cta {
  display: inline-block; margin-top: calc(var(--u) * 28); font-family: 'Space Mono', ui-monospace, monospace;
  font-size: ${fluid(13.5, 12.5)}; letter-spacing: .04em; color: var(--cl-gold-text);
  text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 2px;
  transition: color .3s cubic-bezier(.16,1,.3,1);
}
.cl-thjonusta-cta:hover { color: var(--cl-ink); }
.cl-thjonusta-fig { margin: 0; max-width: calc(var(--u) * 460); justify-self: end; }
.cl-thjonusta-fig img { width: 100%; aspect-ratio: 5 / 7; object-fit: cover; }
.cl-fig-cap { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12, 12)}; letter-spacing: .14em; text-transform: uppercase; color: var(--cl-mute); padding-top: 10px; }

/* the RAX quote */
.cl-quote { padding: calc(var(--u) * 40) calc(var(--u) * 34) calc(var(--u) * 120); }
.cl-quote-block { margin: 0 auto; max-width: calc(var(--u) * 880); text-align: center; }
.cl-quote-block p { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(34, 21)}; line-height: 1.32; letter-spacing: -.01em; margin: 0 0 calc(var(--u) * 22); }
.cl-quote-block footer { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12.5, 12)}; letter-spacing: .14em; text-transform: uppercase; color: var(--cl-mute); }

/* about: his own portrait from his own About page */
.cl-um { display: grid; grid-template-columns: 1.15fr 1fr; gap: calc(var(--u) * 70); align-items: center; padding: calc(var(--u) * 40) calc(var(--u) * 34) calc(var(--u) * 130); }
.cl-um-fig { margin: 0; }
.cl-um-fig img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; }
.cl-um-marks { display: flex; align-items: center; gap: calc(var(--u) * 30); margin-top: calc(var(--u) * 36); }
.cl-um-logo { height: calc(var(--u) * 74); width: auto; mix-blend-mode: multiply; }
.cl-um-op { height: calc(var(--u) * 64); width: auto; mix-blend-mode: multiply; }

/* contact */
.cl-samband { text-align: center; padding: calc(var(--u) * 150) calc(var(--u) * 34); }
.cl-samband .cl-headline { margin-inline: auto; }
.cl-samband-tel {
  display: inline-block; font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(110, 44)};
  letter-spacing: -.02em; color: inherit; text-decoration: none; margin-top: calc(var(--u) * 16);
  transition: color .3s cubic-bezier(.16,1,.3,1); font-variant-numeric: tabular-nums;
}
.cl-samband-tel:hover { color: var(--cl-gold-text); }
.cl-samband-addr { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(13, 12.5)}; color: var(--cl-mute); margin-top: calc(var(--u) * 20); }

/* responsive */
@media (max-width: 991px) {
  .cl-thjonusta { grid-template-columns: 1fr; }
  .cl-thjonusta-fig { justify-self: start; max-width: 100%; }
  .cl-um { grid-template-columns: 1fr; }
  .cl-bok-pair, .cl-bok-pair.is-flip, .cl-bok-pair.is-port {
    grid-template-columns: 1fr; column-gap: 0; row-gap: calc(var(--u) * 26);
    margin: 0 0 calc(var(--u) * 80); max-width: none; justify-content: start;
  }
  .cl-bok-pair .cl-bok-fig-a, .cl-bok-pair.is-flip .cl-bok-fig-a, .cl-bok-pair.is-port .cl-bok-fig-a {
    grid-column: 1; grid-row: 1; width: 100%;
  }
  .cl-bok-pair .cl-bok-fig-b, .cl-bok-pair.is-flip .cl-bok-fig-b, .cl-bok-pair.is-port .cl-bok-fig-b {
    grid-column: 1; grid-row: 2; width: 76%; justify-self: end; align-self: auto;
  }
  .cl-bok-pair .cl-bok-cap, .cl-bok-pair.is-flip .cl-bok-cap {
    grid-column: 1; grid-row: 3; text-align: left; padding-top: 2px;
  }
}
@media (max-width: 760px) {
  .cl-series { grid-template-columns: 1fr; gap: calc(var(--u) * 26); }
  .cl-series-preview { position: static; order: -1; }
  .cl-series-preview img { aspect-ratio: 3 / 2; }
}
@media (max-width: 640px) {
  .cl-edit, .cl-bridge, .cl-safn, .cl-bok, .cl-thjonusta, .cl-quote, .cl-um, .cl-samband { padding-left: 20px; padding-right: 20px; }
  .cl-hero-title { left: 20px; bottom: 96px; }
  .cl-hero-block { padding: 0 20px 30px; }
}
`
