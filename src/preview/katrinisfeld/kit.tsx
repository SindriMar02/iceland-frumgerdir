/**
 * Katrín Ísfeld — the shared kit every page is built from.
 *
 * WHAT CHANGED FROM THE ONE-PAGE BUILD, AND WHY
 *
 * 1. Photographs go out as <picture> with AVIF, then WebP, then the original
 *    JPEG, at three real widths, carrying real width/height attributes from
 *    photo-dims.ts. The old build shipped a single JPEG per photo with a
 *    hand-written srcset and no intrinsic size: 16.2 MB of JPEG where 5.2 MB
 *    of AVIF now covers one more breakpoint, and every figure reserved its
 *    own space only through a CSS aspect-ratio that had been typed in by
 *    hand rather than measured.
 *
 * 2. Scroll costs nothing to read. The old motion engine ran a
 *    querySelectorAll plus a getBoundingClientRect per unrevealed element on
 *    every single scroll event, and re-measured the fixed chrome each time
 *    too: 2,697 forced layout reads across one pass down the page. Both the
 *    band boundaries and each element's trigger point are absolute document
 *    offsets now, cached on mount and recomputed only on resize, so a scroll
 *    frame does arithmetic against window.scrollY and touches the DOM
 *    exactly never.
 *
 * 3. No animation library. The one-page build pulled in GSAP, ScrollTrigger
 *    and Lenis to produce exactly two scroll-linked effects and a set of
 *    entrance transitions. The entrances are CSS transitions triggered by a
 *    class, which is what they always were underneath; the two scroll-linked
 *    effects are eight lines of arithmetic in the scroll handler that is
 *    already running. Lenis went with them on purpose rather than by
 *    accident: hijacked wheel scrolling reads as latency on a trackpad, does
 *    nothing at all on touch, and freezes any nested scroller that forgets
 *    data-lenis-prevent.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PHOTO_DIMS } from './photo-dims'
import { PHOTO_COLORS } from './photo-colors'

const BASE = import.meta.env.BASE_URL
const DIR = `${BASE}katrinisfeld`

export const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/* ── photographs ───────────────────────────────────────────────────────── */

export interface PhotoProps {
  id: string
  alt: string
  /** the sizes attribute — always state it, or the browser assumes 100vw */
  sizes: string
  className?: string
  priority?: boolean
  /** crop instead of using the photo's own ratio */
  ratio?: string
}

const srcset = (id: string, ext: 'avif' | 'webp') =>
  PHOTO_DIMS[id].v.map(([w]) => `${DIR}/rs/${id}-${w}.${ext} ${w}w`).join(', ')

/**
 * One photograph.
 *
 * The <img> src is a mid-size WebP rather than the original JPEG. Anything
 * that cannot read <source> — a text extractor, a scraper that only looks at
 * src — still gets a real image URL, and every browser in use can decode
 * WebP, so keeping 16 MB of JPEG on the host to serve a fallback nobody
 * reaches was 54% of the deployable for nothing. The originals stay in the
 * repository; the standalone build prunes them.
 */
export function Photo({ id, alt, sizes, className = '', priority = false, ratio }: PhotoProps) {
  const d = PHOTO_DIMS[id]
  if (!d) throw new Error(`Photo: unknown id "${id}"`)
  // the largest variant at or below 900px: a real file, never an upscale
  const fallback = (d.v.find(([w]) => w === 900) || d.v[d.v.length - 1])[0]
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcset(id, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(id, 'webp')} sizes={sizes} />
      <img
        src={`${DIR}/rs/${id}-${fallback}.webp`}
        width={d.w}
        height={d.h}
        alt={alt}
        style={ratio ? { aspectRatio: ratio } : undefined}
        loading={priority ? 'eager' : 'lazy'}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ fetchpriority: priority ? 'high' : undefined } as any)}
        decoding={priority ? 'sync' : 'async'}
      />
    </picture>
  )
}

/** The hero photograph's own preload link, for the shell's <head>. */
export const heroPreload = (id: string, sizes: string) => ({
  href: `${DIR}/rs/${id}-1500.avif`,
  imagesrcset: srcset(id, 'avif'),
  imagesizes: sizes,
})

/* ── type ──────────────────────────────────────────────────────────────── */

export const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/**
 * A headline that rises word by word out of a mask.
 *
 * The visible text is split into per-word spans marked aria-hidden, with the
 * whole string restated in aria-label, so a screen reader reads one sentence
 * instead of spelling out fragments. Icelandic is split per WORD and never
 * per character: the language's compounds and diacritics break badly under
 * per-glyph splitting, and the mask carries .22em of headroom so accents are
 * never clipped.
 */
export function Headline({ text, size, floor, as: Tag = 'h2', className = '', measure, id }: {
  text: string; size: number; floor: number
  as?: 'h1' | 'h2' | 'h3'; className?: string; measure?: number; id?: string
}) {
  return (
    <Tag
      id={id}
      data-ki-headline
      aria-label={text}
      className={`ki-headline ki-rv-h ${className}`}
      style={{ fontSize: fluid(size, floor), maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined }}
    >
      {text.split(' ').map((w, i, arr) => (
        <span key={i} aria-hidden="true">
          <span className="ki-line">
            <span className="ki-word" style={{ ['--i' as string]: i }}>{w}</span>
          </span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** A figure whose photograph slides in from a skewed polygon. */
export function Slide({ id, alt, sizes, className = '', ratio, variant = 'slide', priority }: PhotoProps & {
  variant?: 'slide' | 'shutter' | 'plain'
}) {
  const cls = variant === 'shutter' ? 'ki-shutter' : variant === 'plain' ? 'ki-plain' : 'ki-slide'
  return (
    <figure className={`${cls} ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      <Photo id={id} alt={alt} sizes={sizes} priority={priority} />
    </figure>
  )
}

/**
 * A horizontal chapter: the page pins and the projects travel sideways.
 *
 * The pin only happens on a real pointer. On touch this is a native
 * scroll-snap strip instead, because a scroll-jacked pin on a phone is the
 * exact thing that got called "jittery and doesn't work well" on
 * Sauðárkróksbakarí — the page holds still for a whole viewport and a
 * visitor reads that as broken. Native horizontal scrolling on touch is
 * both nicer and honest about what the finger is doing.
 *
 * The travel is written synchronously in the scroll handler with NO CSS
 * transition on the transform: a transition on a value rewritten every
 * scroll tick chases a moving target and smears.
 */
export interface HPanel {
  id: string
  title: string
  meta: string
  to: string
  alt: string
}

export function HorizontalChapter({ eyebrow, panels }: {
  eyebrow: string; panels: ReadonlyArray<HPanel>
}) {
  return (
    <section className="ki-hs" data-ki-band="dark" data-ki-hscroll>
      <div className="ki-hs-pin">
        <div className="ki-hs-track">
          <div className="ki-hs-intro">
            <p className="ki-kicker">{eyebrow}</p>
            <p className="ki-hs-count">
              <span className="ki-num">{String(panels.length).padStart(2, '0')}</span> verk
            </p>
          </div>
          {panels.map((p) => (
            <article key={p.id} className="ki-hs-panel">
              <Link to={p.to} className="ki-hs-fig">
                <Photo id={p.id} alt={p.alt} sizes="(max-width: 860px) 86vw, 46vw" />
              </Link>
              <div className="ki-hs-meta">
                <h3 className="ki-hs-title"><Link to={p.to}>{p.title}</Link></h3>
                <p className="ki-hs-sub">{p.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * The material bands: her palette, carried by the material rather than shown
 * as a swatch.
 *
 * The first attempt at this was five flat colour discs, and Sindri was right
 * to kill it — a circle of colour is a colour-picker, not a material. These
 * are the same five colours, each one sampled from a real photograph of her
 * work (photo-colors.ts) or from her own brand wine, but carried on the
 * material her copy already names: hör, kopar, eik, vínrautt, steinn.
 *
 * The textures are generated (Recraft), then graded so the mean colour of
 * each band is EXACTLY the sampled hex — the colour is hers even though the
 * weave is not. See PHOTO-SOURCES.md for the honesty line on this.
 *
 * Label colour is per band, decided by measuring the worst local pixel under
 * the label rather than the band's average: ink on the two light materials
 * (7.12:1 and 4.93:1), cream over a scrim on the three dark ones.
 */
export interface MaterialBand {
  id: string
  /** the material, in her own words */
  name: string
  hex: string
  alt: string
  /** true where the band is dark enough to need cream type over a scrim */
  dark?: boolean
}

export function MaterialBands({ bands }: { bands: ReadonlyArray<MaterialBand> }) {
  return (
    <div className="ki-mat">
      {bands.map((b) => (
        <figure key={b.id} className={`ki-mat-band ki-rv ${b.dark ? 'is-dark' : ''}`}>
          <Photo id={b.id} alt={b.alt} sizes="100vw" />
          <figcaption className="ki-mat-name">
            <span>{b.name}</span>
            <span className="ki-mat-hex" aria-hidden="true">{b.hex.toUpperCase()}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/**
 * A project card's photograph, standing on its own colour.
 *
 * Two things happen here that a plain <figure> did not do. The ground under
 * the photograph is that photograph's OWN sampled colour rather than a
 * generic grey, so a card that has not decoded yet already shows the room's
 * real colour instead of a hole — the same litheim data as ColorReveal.
 *
 * And where a project has a second photograph, hovering crossfades to it.
 * The second image is only MOUNTED once a pointer or the keyboard has
 * actually reached the card, so an index page costs a visitor who never
 * hovers exactly the bytes it cost before: a hidden <img> still downloads,
 * an unmounted one does not. Touch never arms it at all.
 */
export function CardFigure({ photos, sizes }: {
  photos: ReadonlyArray<{ id: string; alt: string }>; sizes: string
}) {
  const [armed, setArmed] = useState(false)
  const second = photos[1]
  const arm = second && !armed ? () => setArmed(true) : undefined
  return (
    <figure
      className="ki-card-fig"
      style={{ background: PHOTO_COLORS[photos[0].id] }}
      onPointerEnter={arm}
      onFocusCapture={arm}
    >
      <Photo id={photos[0].id} alt={photos[0].alt} sizes={sizes} />
      {second && armed && (
        <span className="ki-card-fig-alt" aria-hidden="true">
          <Photo id={second.id} alt="" sizes={sizes} />
        </span>
      )}
    </figure>
  )
}

/* ── motion: reveals + self-theming chrome, at zero layout cost ─────────── */

/**
 * Both systems on this site need to know where things are on the page, and
 * neither of them needs to ask the DOM during a scroll to find out.
 *
 * Reveals: each element's trigger line is `documentTop - viewportHeight*0.92`,
 * computed once. A scroll frame compares scrollY against a sorted array and
 * pops off whatever it has passed. This also fixes, for free, the failure the
 * observer alone has: a scroll fast enough to skip an element's whole box
 * between painted frames never produces an intersecting entry, so the element
 * stays clipped at opacity 0 forever.
 *
 * Chrome: a fixed element does not move while the page scrolls, so its centre
 * in viewport coordinates is a constant. Its centre in DOCUMENT coordinates is
 * that constant plus scrollY. Comparing that against cached band boundaries is
 * pure arithmetic.
 */
/**
 * 'spread-in' exists because 'spread' cannot work at the end of the document.
 * Spread measures progress across an element's whole passage THROUGH the
 * viewport, which an element in the footer never completes — the page runs
 * out of scroll first, so the footer wordmark drifted by under a pixel.
 * 'spread-in' measures the footer's ARRIVAL instead: from the moment its top
 * crosses the bottom of the viewport until it sits a quarter of the way up.
 * Same word arithmetic, a range the page can actually deliver.
 */
type ParKind = 'rise' | 'spread' | 'spread-in'

export function useKiMotion(ready: boolean, deps: unknown[] = []) {
  useEffect(() => {
    if (!ready) return
    const root = document.querySelector<HTMLElement>('.ki-root')
    if (!root) return

    const chromeEls = Array.from(root.querySelectorAll<HTMLElement>('[data-ki-chrome]'))
    const navEl = root.querySelector<HTMLElement>('.ki-nav')
    let bands: Array<{ top: number; bottom: number; dark: boolean }> = []
    let chromeCentres: number[] = []
    let condenseAt = Infinity
    let reveals: Array<{ el: Element; at: number }> = []
    let pars: Array<{
      el: HTMLElement; kind: ParKind; words: HTMLElement[]
      start: number; end: number; em: number
    }> = []
    /* horizontal chapters: pinned on a pointer, native scroll-snap on touch */
    let hs: Array<{ track: HTMLElement; start: number; end: number; distance: number }> = []
    const canPin = window.matchMedia('(min-width: 861px) and (hover: hover) and (pointer: fine)').matches

    const measure = () => {
      const sy = window.scrollY
      bands = Array.from(root.querySelectorAll<HTMLElement>('[data-ki-band]')).map((s) => {
        const r = s.getBoundingClientRect()
        return { top: r.top + sy, bottom: r.bottom + sy, dark: s.dataset.kiBand === 'dark' }
      })
      chromeCentres = chromeEls.map((el) => {
        const r = el.getBoundingClientRect()
        return r.top + r.height / 2
      })
      const vh = window.innerHeight
      // condense past roughly one viewport of scroll, regardless of how tall
      // any given page's hero is — a flat threshold that works on all 26 routes
      condenseAt = vh * 0.6
      reveals = Array.from(root.querySelectorAll(
        '.ki-rv:not(.is-in), .ki-slide:not(.is-in), .ki-shutter:not(.is-in), .ki-rv-h:not(.is-in)'))
        .map((el) => ({ el, at: el.getBoundingClientRect().top + sy - vh * 0.92 }))
        .sort((a, b) => a.at - b.at)

      /* Scroll-linked movement. Each effect gets a start and an end in
         DOCUMENT coordinates, measured once here, so the frame that runs it
         only has to divide. */
      pars = Array.from(root.querySelectorAll<HTMLElement>('[data-ki-par]')).map((el) => {
        const r = el.getBoundingClientRect()
        const top = r.top + sy
        const kind = el.dataset.kiPar as ParKind
        const spreads = kind === 'spread' || kind === 'spread-in'
        const words = spreads
          ? Array.from(el.querySelectorAll<HTMLElement>(':scope > span'))
          : []
        // rise: from the moment its top enters the viewport until it is a
        // third of the way up. spread: across its own passage through view.
        // spread-in: across its ARRIVAL, which is all a footer ever gets.
        let start: number, end: number
        if (kind === 'rise') { start = top - vh; end = top - vh * 0.3 }
        else if (kind === 'spread-in') { start = top - vh; end = top - vh * 0.25 }
        else { start = top - vh * 0.95; end = top + r.height - vh * 0.3 }
        /* The drift is scaled by the type it is moving, so measure the type,
           not the box. The footer wordmark sets its size on an inner <i>
           inside each word's mask, and the container is still inheriting the
           footer's 14px — reading the container made the words drift by one
           pixel instead of forty. */
        const sizedFrom = words[0]?.querySelector('i') ?? el
        return {
          el, kind, words, start, end,
          em: spreads ? parseFloat(getComputedStyle(sizedFrom).fontSize) || 60 : 0,
        }
      })

      /* A horizontal chapter buys its sideways travel with vertical scroll:
         the section is made exactly as tall as the track overflows wide, so
         the distance the page scrolls is the distance the track moves. */
      hs = []
      for (const sec of Array.from(root.querySelectorAll<HTMLElement>('[data-ki-hscroll]'))) {
        const track = sec.querySelector<HTMLElement>('.ki-hs-track')
        if (!track) continue
        if (!canPin) { sec.style.height = ''; track.style.transform = ''; continue }
        const distance = Math.max(0, track.scrollWidth - window.innerWidth)
        sec.style.height = `${vh + distance}px`
        const top = sec.getBoundingClientRect().top + sy
        hs.push({ track, start: top, end: top + distance, distance })
      }
    }

    const runHScroll = () => {
      if (!hs.length) return
      const sy = window.scrollY
      for (const h of hs) {
        const t = Math.min(1, Math.max(0, (sy - h.start) / (h.end - h.start || 1)))
        // written raw, never through a transition — see the note on the component
        h.track.style.transform = `translate3d(${(-t * h.distance).toFixed(2)}px, 0, 0)`
      }
    }

    const runParallax = () => {
      if (!pars.length) return
      const sy = window.scrollY
      for (const p of pars) {
        const t = Math.min(1, Math.max(0, (sy - p.start) / (p.end - p.start || 1)))
        if (p.kind === 'rise') {
          p.el.style.transform = `translate3d(0, ${((1 - t) * 18).toFixed(2)}%, 0)`
        } else {
          const n = p.words.length
          if (n < 2) continue
          // the words drift apart as the dome rises. Done on transform, never
          // on word-spacing, which would reflow the line on every frame.
          for (let i = 0; i < n; i++) {
            const off = (i - (n - 1) / 2) * p.em * 0.42 * t
            p.words[i].style.transform = `translate3d(${off.toFixed(2)}px, 0, 0)`
          }
        }
      }
    }

    const themeChrome = () => {
      if (!bands.length) return
      const sy = window.scrollY
      for (let i = 0; i < chromeEls.length; i++) {
        const centre = sy + chromeCentres[i]
        let dark = false
        for (const b of bands) if (centre >= b.top && centre < b.bottom) { dark = b.dark; break }
        const want = dark ? 'dark' : 'light'
        if (chromeEls[i].dataset.kiOn !== want) chromeEls[i].dataset.kiOn = want
      }
    }

    const sweepReveals = () => {
      const sy = window.scrollY
      let n = 0
      while (n < reveals.length && reveals[n].at <= sy) { reveals[n].el.classList.add('is-in'); n++ }
      if (n) reveals = reveals.slice(n)
    }

    const condenseNav = () => {
      if (!navEl) return
      const want = window.scrollY > condenseAt ? 'true' : ''
      if (navEl.dataset.kiCondensed !== want) navEl.dataset.kiCondensed = want
    }

    const onFrame = () => { themeChrome(); sweepReveals(); runParallax(); runHScroll(); condenseNav() }
    /* reduced motion keeps the horizontal chapter too: it is navigation, not
       decoration, and the alternative is a track the visitor cannot reach.
       What it loses is the parallax, which is the part that is decoration. */
    const onFrameStill = () => { themeChrome(); sweepReveals(); runHScroll(); condenseNav() }

    let rafId = 0
    const onResize = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => { measure(); onFrame() })
    }

    measure()
    onFrame()
    window.addEventListener('resize', onResize, { passive: true })
    // fonts land after first paint and reflow every headline under them
    document.fonts?.ready.then(onResize)

    if (reduced()) {
      /* Reduced motion still needs the chrome themed: without it the nav sat
         at its no-attribute fallback (dark ink) over every dark band, so a
         visitor with the OS setting on read dark on dark down most of the
         page. Reduced motion means less movement, not unreadable text. */
      root.classList.add('ki-static')
      onFrameStill()
      window.addEventListener('scroll', onFrameStill, { passive: true })
      return () => {
        window.removeEventListener('scroll', onFrameStill)
        window.removeEventListener('resize', onResize)
      }
    }

    root.classList.add('ki-js')
    window.addEventListener('scroll', onFrame, { passive: true })
    return () => {
      window.removeEventListener('scroll', onFrame)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ...deps])
}

/* ── in-page anchors ───────────────────────────────────────────────────── */

export const anchorTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
  history.replaceState(null, '', `#${id}`)
}

/* ── the page frame ────────────────────────────────────────────────────── */

export function Section({ band, className = '', id, children }: {
  band: 'dark' | 'light'; className?: string; id?: string; children: ReactNode
}) {
  return <section id={id} className={className} data-ki-band={band}>{children}</section>
}

export function useMounted() {
  const [m, setM] = useState(false)
  useEffect(() => setM(true), [])
  return m
}

export { useRef }
