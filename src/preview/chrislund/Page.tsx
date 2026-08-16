import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  BOOK, CONTACT, JSON_LD, LOGO, PHOTO, SERIES, SERVICES, srcSet,
} from './data'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('chrislund')

/* ── CHRISTOPHER LUND · "ÚRVALIÐ" ──────────────────────────────────────────
   The Búðir machine re-aimed at a photographer: the horizontal journey stops
   being a coastline and becomes an EXHIBITION WALL you walk along, one work
   at a time, each at full size. The 130-against-12 arithmetic from his own
   book page (130 photographs in the book, 12 hung at Gallery Grásteinn) is
   the page's thesis: the craft is the edit.

   Carried from Búðir with its measured values: the pinned horizontal journey
   (ONE track tween on ONE pinned master, containerAnimation for inner
   triggers, function-form end), the inner panel parallax (xPercent 7.5 →
   -7.5 at scale 1.16), mix-blend-difference headings over media, full-bleed
   slabs, and the drawn-rule section heads. Plate numbers on the wall are
   gallery convention, not decoration. Búðir's sky-scrub is deliberately NOT
   here (one palette-scrub build per batch); the Daylight per-word headline
   device is grafted onto the VITNI plate, as approved.

   Scoped fluid unit --u on .cl-root only ([[no-style-bleed-between-designs]]).
   Icelandic display: per-WORD splits, leading ≥1.12, .22em mask headroom. ── */

const PAPER = '#F5F4F1'
const INK = '#191917'
const GOLD = '#A98147' /* his own logo gold, sampled from the CL mark */

const DISPLAY = "'Cabinet Grotesk', system-ui, sans-serif"
const BODY = "'Geist', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, monospace"

const BASE = import.meta.env.BASE_URL

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/* ── motion engine ─────────────────────────────────────────────────────── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const root = document.querySelector<HTMLElement>('.cl-root')
    if (!root) return

    if (reduced()) {
      root.classList.add('cl-static')
      return
    }

    root.classList.add('cl-js')
    ScrollTrigger.config({ ignoreMobileResize: true })
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

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
      /* word-mask rises. Desktop: wall headlines ride the pinned
         containerAnimation below instead. Mobile/tablet: the wall never
         pins, so give them this same generic rise or they'd never animate. */
      root.querySelectorAll<HTMLElement>('[data-cl-headline]').forEach((h) => {
        if (h.closest('.cl-wall') && wallPinActive) return
        const words = h.querySelectorAll<HTMLElement>('.cl-word')
        if (!words.length) return
        gsap.fromTo(words,
          { yPercent: 116, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 1.05, ease: 'expo.out', stagger: 0.07,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          })
      })

      /* hero settle */
      const heroImg = root.querySelector<HTMLElement>('.cl-hero img')
      if (heroImg) {
        gsap.fromTo(heroImg, { scale: 1.08 }, { scale: 1, duration: 2.1, ease: 'expo.out' })
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
    // (a hard scrollbar-drag flick, repeated Page Down) can leave it with no
    // frame ever observed inside the viewport -- is-in never lands, so it
    // stays clipped forever. This sweep re-checks on every scroll tick.
    const revealPassed = () => {
      root.querySelectorAll('.cl-rv:not(.is-in)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in')
      })
    }
    lenis.on('scroll', () => { ScrollTrigger.update(); revealPassed() })
    const tick = (t: number) => { lenis.raf(t * 1000) }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      ctx.revert()
      lenis.destroy()
    }
  }, [ready])
}

/* ── primitives ────────────────────────────────────────────────────────── */

function Headline({ text, size, floor, as: Tag = 'h2', className = '', measure }: {
  text: string; size: number; floor: number
  as?: 'h1' | 'h2' | 'h3'; className?: string; measure?: number
}) {
  return (
    <Tag
      data-cl-headline
      aria-label={text}
      className={`cl-headline ${className}`}
      style={{
        fontSize: fluid(size, floor),
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      }}
    >
      {text.split(' ').map((w, i, arr) => (
        <span key={i} aria-hidden="true">
          <span className="cl-line"><span className="cl-word">{w}</span></span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** Drawn-rule section head (Búðir's SectionHead, gallery-labelled). */
function Rule({ label }: { label: string }) {
  return (
    <div className="cl-rulehead cl-rv">
      <span className="cl-rule" aria-hidden="true" />
      <span className="cl-rulehead-label">{label}</span>
    </div>
  )
}

/* ── series picker: the preview comes to the cursor ─────────────────────────
   On a fine pointer the image follows the cursor over the list, so the list
   itself takes the full measure and no column sits empty waiting to be used.
   Two hard rules from the HouseList build: the lerped position is written
   straight to the node via a ref (a setState per frame collapses on mobile
   and burns the main thread), and setState fires ONLY when a boolean or the
   active row actually flips. Touch, coarse pointers and reduced motion never
   get the float at all: they keep the anchored preview, which is also what
   keyboard focus reveals since focus has no pointer position. ─────────────── */

function SeriesPicker() {
  const [active, setActive] = useState(0)
  const [floating, setFloating] = useState(false)
  const floatRef = useRef<HTMLElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const s = SERIES[active]

  const canFloat = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !reduced()

  /* the follow loop runs only while the pointer is actually over the list */
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
          <li key={it.name}>
            <button
              type="button"
              className={`cl-series-row ${i === active ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
            >
              <span className="cl-series-row-inner">
                <span className="cl-series-name">{it.name}</span>
                <span className="cl-series-note">{it.note}</span>
              </span>
            </button>
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

  useEffect(() => {
    setThemeColor(PAPER)
    document.title = 'Christopher Lund ljósmyndari'
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prevDescription = meta.content
    meta.content = 'Christopher Lund, ljósmyndari í yfir 20 ár á Íslandi. Landslag, fyrirtæki, arkitektúr og brúðkaup, auk FineArt prentunar og skönnunar. Sími 822 7601.'
    /* see katrinisfeld/Page.tsx: the shell ships lang="en", which is wrong for
       an Icelandic page and undercuts the search pitch this build is sold on */
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'is'
    setReady(true)
    return () => {
      meta.content = prevDescription
      document.documentElement.lang = prevLang
    }
  }, [])

  useMotion(ready)

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div ref={rootRef} className="cl-root">
      <style>{CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />

      {/* nav */}
      <header className="cl-nav">
        <a className="cl-nav-mark" href="#top" onClick={anchor('top')}>CHRISTOPHER&nbsp;LUND</a>
        <nav className="cl-nav-links" aria-label="Síða">
          <a href="#veggurinn" onClick={anchor('veggurinn')}>Veggurinn</a>
          <a href="#bokin" onClick={anchor('bokin')}>Bókin</a>
          <a href="#thjonusta" onClick={anchor('thjonusta')}>Þjónusta</a>
        </nav>
        <a className="cl-nav-cta" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
      </header>

      {/* 01 · hero slab */}
      <main>
      <section className="cl-hero" id="top">
        <img src={PHOTO.vestrahorn.src} srcSet={srcSet(PHOTO.vestrahorn.src)} sizes="100vw"
          alt={PHOTO.vestrahorn.alt} loading="eager" decoding="async" />
        <Headline as="h1" className="cl-hero-title" text="Christopher Lund" size={120} floor={40} />
        <div className="cl-hero-block">
          <p className="cl-hero-sub">
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

      {/* 03 · the exhibition wall (pinned horizontal on desktop) */}
      <section className="cl-wall" id="veggurinn" aria-label="Sýningarveggurinn">
        <div className="cl-wall-progressbar" aria-hidden="true"><span className="cl-wall-progress" /></div>
        <div className="cl-wall-track">
          <div className="cl-plate cl-plate-intro">
            <p className="cl-plate-kicker">Veggurinn</p>
            <Headline text="Gakktu með veggnum." size={92} floor={34} />
            <p className="cl-body">Sex verk í fullri stærð. Hvert þeirra fær vegginn út af fyrir sig.</p>
          </div>
          {[
            { photo: PHOTO.thoka, plate: '01', label: 'Landslag' },
            { photo: PHOTO.sjor, plate: '02', label: 'Landslag' },
            { photo: PHOTO.byggingBlalys, plate: '03', label: 'Arkitektúr' },
            { photo: PHOTO.corten, plate: '04', label: 'Arkitektúr' },
          ].map((p) => (
            <figure key={p.plate} className="cl-plate">
              <div className="cl-plate-media">
                <img src={p.photo.src} srcSet={srcSet(p.photo.src)} sizes="(max-width: 991px) 100vw, 78vw"
                  alt={p.photo.alt} loading="lazy" decoding="async" />
              </div>
              <figcaption className="cl-plate-cap">
                <span>{p.label}</span>
                <span className="cl-plate-nr">{p.plate}</span>
              </figcaption>
            </figure>
          ))}
          {/* the VITNI plate carries the Daylight device: eyebrow + serif-scale
              headline sharing the media's grid cell, per-word rise */}
          <figure className="cl-plate cl-plate-vitni">
            <div className="cl-plate-media">
              <img src={PHOTO.klettur.src} srcSet={srcSet(PHOTO.klettur.src)} sizes="(max-width: 991px) 100vw, 78vw"
                alt={PHOTO.klettur.alt} loading="lazy" decoding="async" />
            </div>
            <div className="cl-vitni-lockup">
              <p className="cl-vitni-eyebrow">Ljósmyndasafn Reykjavíkur · 2020</p>
              <Headline className="cl-vitni-title" text="VITNI" size={150} floor={54} />
            </div>
            <figcaption className="cl-plate-cap">
              <span>Sýning</span>
              <span className="cl-plate-nr">05</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* bridge — the wall's payoff turned into a reason to call, before the
          page drops back into browsing mode */}
      <section className="cl-bridge">
        <p className="cl-bridge-text cl-rv">
          Verkin á veggnum eru sönnunin. Sama natni fer í fyrirtækja-,
          brúðkaups- og portrettmyndir.
        </p>
        <a className="cl-bridge-tel cl-rv" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
      </section>

      {/* 04 · series picker */}
      <section className="cl-safn">
        <Rule label="Myndaraðirnar" />
        <Headline text="Sex raðir, eitt auga." size={80} floor={32} measure={640} />
        <SeriesPicker />
      </section>

      {/* 05 · the book */}
      <section className="cl-bok" id="bokin">
        <div className="cl-bok-head">
          <Rule label="Bókin" />
          <Headline text="Iceland, Contrasts in Nature." size={80} floor={32} measure={760} />
          <p className="cl-body cl-rv">
            Andstæður landsins á opnum sem svara hver annarri: ís á móti jarðhita,
            stuðlaberg á móti mosa. Hver mynd fær rými til að anda.
          </p>
        </div>
        <div className="cl-bok-grid">
          <figure className="cl-bok-kapa cl-rv">
            <img src={PHOTO.bokKapa.src} srcSet={srcSet(PHOTO.bokKapa.src)} sizes="(max-width: 991px) 92vw, 38vw"
              alt={PHOTO.bokKapa.alt} loading="lazy" decoding="async" />
          </figure>
          <div className="cl-bok-side">
            <figure className="cl-bok-opna cl-rv">
              <img src={PHOTO.bokOpnaA.src} srcSet={srcSet(PHOTO.bokOpnaA.src)} sizes="(max-width: 991px) 92vw, 52vw"
                alt={PHOTO.bokOpnaA.alt} loading="lazy" decoding="async" />
            </figure>
            <figure className="cl-bok-opna cl-rv">
              <img src={PHOTO.bokOpnaB.src} srcSet={srcSet(PHOTO.bokOpnaB.src)} sizes="(max-width: 991px) 92vw, 52vw"
                alt={PHOTO.bokOpnaB.alt} loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
        <dl className="cl-bok-specs cl-rv" aria-label="Um bókina">
          {BOOK.specs.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </section>

      {/* 06 · services + corporate band */}
      <section className="cl-thjonusta" id="thjonusta">
        <div className="cl-thjonusta-copy">
          <Rule label="Þjónusta" />
          <Headline text="Frá töku að prenti." size={72} floor={30} measure={560} />
          <p className="cl-body cl-rv">
            Ekki bara fyrir eigin verk: ljósmyndarar og listamenn fá sömu
            prentun, skönnun og litgreiningu hér.
          </p>
          <ul className="cl-services">
            {SERVICES.map((s, i) => (
              <li key={s.name} className="cl-service cl-rv">
                <div className="cl-service-top">
                  <span className="cl-service-name">{s.name}</span>
                  <span className="cl-service-nr">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <span className="cl-service-note">{s.note}</span>
              </li>
            ))}
          </ul>
          <a className="cl-thjonusta-cta cl-rv" href={CONTACT.phoneHref}>
            Spurning um verk? Hringdu í {CONTACT.phone}.
          </a>
        </div>
        <figure className="cl-thjonusta-fig cl-rv">
          <img src={PHOTO.fyrirtaekiLid.src} srcSet={srcSet(PHOTO.fyrirtaekiLid.src)}
            sizes="(max-width: 991px) 92vw, 44vw"
            alt={PHOTO.fyrirtaekiLid.alt} loading="lazy" decoding="async" />
          <figcaption className="cl-fig-cap">Öll verk fara í gegnum sömu vinnslu: litgreiningu, frágang, prentun.</figcaption>
        </figure>
      </section>

      {/* 07 · about. Deliberately no photograph: the only portrait available
          is a sample of a client from his own gallery, and beside "Um
          Christopher" a stranger's face reads as his. */}
      <section className="cl-um">
        <div className="cl-um-copy">
          <Rule label="Um Christopher" />
          <Headline text="Tuttugu ár á bak við vélina." size={64} floor={30} measure={560} />
          <p className="cl-body cl-rv">
            Christopher hefur starfað í yfir tuttugu ár á Íslandi, í Noregi og
            Danmörku og talar fjögur tungumál. Auk myndatöku sinnir hann hágæða
            prentun, myndvinnslu og undirbúningi bóka.
          </p>
          <div className="cl-um-marks cl-rv">
            <img className="cl-um-logo" src={LOGO.lockup} alt="Merki Christophers Lund" loading="lazy" decoding="async" />
            <img className="cl-um-op" src={LOGO.onePercent} alt="1% For The Planet, aðili" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* 08 · contact */}
      <section className="cl-samband" id="samband">
        <Headline text="Næsta mynd byrjar á símtali." size={84} floor={34} measure={760} />
        <a className="cl-samband-tel cl-rv" href={CONTACT.phoneHref}>822 7601</a>
        <p className="cl-samband-addr cl-rv">{CONTACT.address}</p>
      </section>

      <div className="cl-foot">
        <div className="cl-foot-grid">
          <div>
            <p className="cl-foot-mark">CHRISTOPHER LUND</p>
            <p className="cl-foot-line">Ljósmyndari · {CONTACT.address}</p>
          </div>
          <div>
            <p className="cl-foot-line">Sími {CONTACT.phone}</p>
            <p className="cl-foot-line">Aðili að 1% For The Planet</p>
          </div>
          <div>
            <p className="cl-foot-line">
              Allar myndir og merki eru af chris.is, sótt í ágúst 2026.
            </p>
            <p className="cl-foot-line">Frumgerð frá SNDR.</p>
          </div>
        </div>
      </div>
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}

/* ── styles ────────────────────────────────────────────────────────────── */

const CSS = `
@font-face { font-family: 'Cabinet Grotesk'; src: url('${BASE}fonts/cabinet-grotesk/CabinetGrotesk-Variable.woff2') format('woff2'); font-weight: 100 900; font-display: swap; }
@font-face { font-family: 'Geist'; src: url('${BASE}fonts/geist/Geist-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Geist'; src: url('${BASE}fonts/geist/Geist-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'Space Mono'; src: url('${BASE}fonts/space-mono/SpaceMono-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }

.cl-root {
  --u: clamp(.44px, 100vw / 1440, 1.15px);
  --cl-paper: ${PAPER};
  --cl-ink: ${INK};
  --cl-gold: ${GOLD};
  --cl-gold-text: #7C5C2B;
  --cl-mute: #5C5B55;
  --cl-hair: rgb(25 25 23 / .16);
  background: var(--cl-paper);
  color: var(--cl-ink);
  font-family: ${BODY};
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
.cl-root [id] { scroll-margin-top: calc(var(--u) * 50 + 24px); }
.cl-root a, .cl-root button { touch-action: manipulation; }
.cl-edit-n, .cl-samband-tel { font-variant-numeric: tabular-nums; }
.cl-root ::selection { background: var(--cl-gold); color: #FFFDF8; }
.cl-root :focus-visible { outline: 2px solid var(--cl-gold-text); outline-offset: 3px; border-radius: 2px; }

/* nav: difference-blend, no bar */
.cl-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: calc(var(--u) * 22) calc(var(--u) * 34);
  mix-blend-mode: difference; color: #EEECE6; pointer-events: none;
}
.cl-nav a { pointer-events: auto; color: inherit; text-decoration: none; transition: opacity .2s cubic-bezier(.16,1,.3,1); }
.cl-nav a:hover { opacity: .7; }
.cl-nav-mark { font-family: ${MONO}; font-size: ${fluid(13, 12)}; letter-spacing: .13em; }
.cl-nav-links { display: flex; gap: calc(var(--u) * 26); font-size: ${fluid(14, 13)}; }
.cl-nav-cta { font-family: ${MONO}; font-size: ${fluid(14, 13)}; border-bottom: 1px solid currentColor; padding-bottom: 2px; }
@media (max-width: 640px) { .cl-nav-links { display: none; } }

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

/* type */
.cl-headline { font-family: ${DISPLAY}; font-weight: 500; line-height: 1.12; letter-spacing: -.012em; margin: 0 0 calc(var(--u) * 24); }
.cl-line { display: inline-block; overflow: hidden; padding-bottom: .22em; margin-bottom: -.22em; vertical-align: bottom; }
.cl-word { display: inline-block; }
.cl-body { font-size: ${fluid(17, 15)}; line-height: 1.66; color: var(--cl-mute); max-width: 58ch; margin: 0; }

/* drawn rule heads */
.cl-rulehead { margin-bottom: calc(var(--u) * 30); }
.cl-rule { display: block; height: 1px; background: var(--cl-ink); opacity: .5; transform-origin: left; }
.cl-js .cl-rulehead .cl-rule { transform: scaleX(0); }
.cl-js .cl-rulehead.is-in .cl-rule { transform: none; transition: transform 1.1s cubic-bezier(.16,1,.3,1); }
.cl-rulehead-label {
  display: inline-block; padding-top: 10px; font-family: ${MONO};
  font-size: ${fluid(12, 11)}; letter-spacing: .16em; text-transform: uppercase; color: var(--cl-mute);
}

/* reveals */
.cl-js .cl-rv { opacity: 0; transform: translateY(26px); }
.cl-js .cl-rv.is-in { opacity: 1; transform: none; transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1); }
.cl-static .cl-rv, .cl-root:not(.cl-js) .cl-rv { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .cl-hero img { transform: none !important; inset: 0; height: 100%; }
  .cl-word { transform: none !important; opacity: 1 !important; }
}

/* the edit */
.cl-edit { padding: calc(var(--u) * 150) calc(var(--u) * 34); }
.cl-edit-nums { display: flex; align-items: baseline; gap: calc(var(--u) * 44); flex-wrap: wrap; margin-bottom: calc(var(--u) * 36); }
.cl-edit-n { font-family: ${DISPLAY}; font-weight: 500; font-size: ${fluid(190, 72)}; line-height: 1; letter-spacing: -.03em; display: block; }
.cl-edit-l { font-family: ${MONO}; font-size: ${fluid(12.5, 11.5)}; letter-spacing: .12em; text-transform: uppercase; color: var(--cl-mute); display: block; margin-top: 10px; }
.cl-edit-slash { width: 1px; align-self: stretch; background: var(--cl-hair); }

/* the wall */
.cl-wall { position: relative; background: #131311; color: #EFEDE7; }
.cl-wall-progressbar { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgb(239 237 231 / .14); z-index: 5; }
.cl-wall-progress { display: block; height: 100%; background: var(--cl-gold); transform: scaleX(0); transform-origin: left; }
.cl-wall-track { display: flex; align-items: stretch; width: max-content; will-change: transform; }
.cl-plate {
  flex: 0 0 auto; width: 78vw; height: 100svh; margin: 0;
  display: grid; grid-template-rows: 1fr auto; padding: calc(var(--u) * 70) calc(var(--u) * 44) calc(var(--u) * 34);
}
.cl-plate-intro { width: 62vw; align-content: center; grid-template-rows: none; }
.cl-plate-kicker { font-family: ${MONO}; font-size: ${fluid(12, 11)}; letter-spacing: .16em; text-transform: uppercase; color: var(--cl-gold); margin: 0 0 calc(var(--u) * 18); }
.cl-plate-media { position: relative; overflow: hidden; background: #1D1D1A; }
.cl-plate-media img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.cl-plate-cap {
  display: flex; justify-content: space-between; padding-top: 12px;
  font-family: ${MONO}; font-size: ${fluid(12, 11)}; letter-spacing: .14em; text-transform: uppercase; color: #B9B7AE;
}
.cl-plate-nr { color: var(--cl-gold); }
.cl-plate-vitni { position: relative; }
.cl-vitni-lockup {
  position: absolute; inset: 0; z-index: 2; display: grid; place-content: center; text-align: center;
  padding: calc(var(--u) * 60); pointer-events: none;
}
.cl-vitni-eyebrow { font-family: ${MONO}; font-size: ${fluid(12, 11)}; letter-spacing: .18em; text-transform: uppercase; color: #EFEDE7; margin: 0 0 14px; }
.cl-vitni-title { color: #F4F1EA; mix-blend-mode: difference; font-weight: 500; letter-spacing: .04em; margin: 0; }
@media (max-width: 991px) {
  .cl-wall-track { display: block; width: auto; }
  .cl-plate { width: auto; height: auto; padding: 40px 20px 8px; }
  .cl-plate-intro { width: auto; padding-bottom: 24px; }
  .cl-plate-media img { aspect-ratio: 4 / 3; }
  .cl-wall-progressbar { display: none; }
}

/* bridge */
.cl-bridge { text-align: center; padding: calc(var(--u) * 60) calc(var(--u) * 34); border-bottom: 1px solid var(--cl-hair); }
.cl-bridge-text { max-width: calc(var(--u) * 560); margin: 0 auto calc(var(--u) * 18); font-size: ${fluid(17, 15)}; line-height: 1.6; color: var(--cl-ink); }
.cl-bridge-tel { display: inline-block; font-family: ${MONO}; font-size: ${fluid(20, 16)}; letter-spacing: .04em; color: var(--cl-gold-text); text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 2px; transition: color .3s cubic-bezier(.16,1,.3,1); }
.cl-bridge-tel:hover { color: var(--cl-ink); }

/* series picker */
.cl-safn { padding: calc(var(--u) * 150) calc(var(--u) * 34); }
.cl-series { display: grid; grid-template-columns: 1.15fr 1fr; gap: calc(var(--u) * 70); align-items: start; margin-top: calc(var(--u) * 30); }
.cl-series-list { list-style: none; margin: 0; padding: 0; }
.cl-series-row {
  --on: 0; width: 100%; text-align: left; background: none; border: none; cursor: pointer;
  padding: 16px 0; border-top: 1px solid var(--cl-hair); color: inherit;
  font-family: inherit;
}
.cl-series-row.is-active { --on: 1; }
.cl-series-row:active .cl-series-row-inner { transform: translateX(calc(var(--on) * 18px)) scale(.985); }
.cl-series-row-inner {
  display: grid; gap: 4px;
  transform: translateX(calc(var(--on) * 18px));
  transition: transform .5s cubic-bezier(.16,1,.3,1);
}
.cl-series-name { font-family: ${DISPLAY}; font-weight: 500; font-size: ${fluid(34, 22)}; line-height: 1.15; transition: color .3s cubic-bezier(.16,1,.3,1); }
.cl-series-row.is-active .cl-series-name { color: var(--cl-gold-text); }
.cl-series-note { font-size: ${fluid(14, 13)}; color: var(--cl-mute); }
.cl-series-preview { position: sticky; top: calc(var(--u) * 80); margin: 0; }
.cl-series-preview img { width: 100%; aspect-ratio: 4 / 3.4; object-fit: cover; background: #E4E2DB; }
.cl-series-preview figcaption { font-family: ${MONO}; font-size: ${fluid(12, 11)}; letter-spacing: .14em; text-transform: uppercase; color: var(--cl-mute); padding-top: 10px; }
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

/* the book */
.cl-bok { padding: calc(var(--u) * 140) calc(var(--u) * 34); background: #ECEAE4; }
.cl-bok-head { max-width: calc(var(--u) * 860); margin-bottom: calc(var(--u) * 50); }
.cl-bok-grid { display: grid; grid-template-columns: 1fr 1.35fr; gap: calc(var(--u) * 44); align-items: center; }
.cl-bok-kapa img { width: 100%; aspect-ratio: 1920 / 1847; object-fit: contain; }
.cl-bok-side { display: grid; gap: calc(var(--u) * 44); }
.cl-bok-opna img { width: 100%; aspect-ratio: 2 / 1; object-fit: cover; }
.cl-bok-specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 30) calc(var(--u) * 44); margin: calc(var(--u) * 60) 0 0; }
.cl-bok-specs dt { font-family: ${MONO}; font-size: ${fluid(11.5, 11)}; letter-spacing: .13em; text-transform: uppercase; color: var(--cl-mute); margin-bottom: 6px; }
.cl-bok-specs dd { margin: 0; font-size: ${fluid(16, 14.5)}; }

/* services */
.cl-thjonusta { display: grid; grid-template-columns: 1.1fr 1fr; gap: calc(var(--u) * 70); align-items: start; padding: calc(var(--u) * 150) calc(var(--u) * 34); }
.cl-services { list-style: none; margin: calc(var(--u) * 10) 0 0; padding: 0; }
.cl-service { display: grid; gap: 6px; padding: 16px 0; border-top: 1px solid var(--cl-hair); }
.cl-service-top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.cl-service-name { font-family: ${DISPLAY}; font-weight: 500; font-size: ${fluid(26, 19)}; }
.cl-service-nr { flex: none; font-family: ${MONO}; font-size: ${fluid(12, 11)}; letter-spacing: .12em; color: var(--cl-gold-text); }
.cl-service-note { font-size: ${fluid(14, 13)}; color: var(--cl-mute); }
.cl-thjonusta-cta {
  display: inline-block; margin-top: calc(var(--u) * 28); font-family: ${MONO};
  font-size: ${fluid(13.5, 12.5)}; letter-spacing: .04em; color: var(--cl-gold-text);
  text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 2px;
  transition: color .3s cubic-bezier(.16,1,.3,1);
}
.cl-thjonusta-cta:hover { color: var(--cl-ink); }
.cl-thjonusta-fig { margin: 0; }
.cl-thjonusta-fig img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; }
.cl-fig-cap { font-family: ${MONO}; font-size: ${fluid(12, 11)}; letter-spacing: .14em; text-transform: uppercase; color: var(--cl-mute); padding-top: 10px; }

/* about */
/* With no honest photograph to pair it with, About closes the page as a
   centred statement, which sets up the centred contact block directly below
   instead of leaving half a screen empty beside a short paragraph. */
.cl-um { padding: calc(var(--u) * 130) calc(var(--u) * 34) calc(var(--u) * 110); text-align: center; }
.cl-um-copy { max-width: calc(var(--u) * 720); margin-inline: auto; }
.cl-um .cl-headline { margin-inline: auto; }
.cl-um .cl-rulehead-label { display: block; text-align: center; }
.cl-um-marks { justify-content: center; }
.cl-um-marks { display: flex; align-items: center; gap: calc(var(--u) * 30); margin-top: calc(var(--u) * 36); }
.cl-um-logo { height: calc(var(--u) * 74); width: auto; mix-blend-mode: multiply; }
.cl-um-op { height: calc(var(--u) * 64); width: auto; mix-blend-mode: multiply; }

/* contact */
.cl-samband { text-align: center; padding: calc(var(--u) * 150) calc(var(--u) * 34); }
.cl-samband .cl-headline { margin-inline: auto; }
.cl-samband-tel {
  display: inline-block; font-family: ${DISPLAY}; font-weight: 500; font-size: ${fluid(110, 44)};
  letter-spacing: -.02em; color: inherit; text-decoration: none; margin-top: calc(var(--u) * 16);
  transition: color .3s cubic-bezier(.16,1,.3,1);
}
.cl-samband-tel:hover { color: var(--cl-gold-text); }
.cl-samband-addr { font-family: ${MONO}; font-size: ${fluid(13, 12)}; color: var(--cl-mute); margin-top: calc(var(--u) * 20); }

/* footer */
.cl-foot { border-top: 1px solid var(--cl-hair); padding: calc(var(--u) * 54) calc(var(--u) * 34) calc(var(--u) * 70); }
.cl-foot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 34); }
.cl-foot-mark { font-family: ${MONO}; font-size: ${fluid(13, 12)}; letter-spacing: .14em; margin: 0 0 10px; }
.cl-foot-line { font-size: ${fluid(13.5, 12.5)}; color: var(--cl-mute); margin: 0 0 6px; line-height: 1.6; }

/* responsive */
@media (max-width: 991px) {
  .cl-thjonusta { grid-template-columns: 1fr; }
  .cl-bok-grid { grid-template-columns: 1fr; }
  .cl-bok-specs { grid-template-columns: 1fr 1fr; }
  .cl-foot-grid { grid-template-columns: 1fr; }
}
/* The picker is a hover/tap preview, so the image belongs BESIDE the list for
   as long as two columns fit. Below that it moves ABOVE the list, under the
   headline, rather than sitting orphaned after six rows of text. */
@media (max-width: 760px) {
  .cl-series { grid-template-columns: 1fr; gap: calc(var(--u) * 26); }
  .cl-series-preview { position: static; order: -1; }
  .cl-series-preview img { aspect-ratio: 3 / 2; }
}
@media (max-width: 640px) {
  .cl-edit, .cl-bridge, .cl-safn, .cl-bok, .cl-thjonusta, .cl-um, .cl-samband { padding-left: 20px; padding-right: 20px; }
  .cl-hero-title { left: 20px; bottom: 96px; }
  .cl-hero-block { padding: 0 20px 30px; }
  .cl-bok-specs { grid-template-columns: 1fr; }
}
`
