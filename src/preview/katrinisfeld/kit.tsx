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
  /** object-position for a cover crop; see Photo.pos in projects.ts */
  pos?: string
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
export function Photo({ id, alt, sizes, className = '', priority = false, ratio, pos }: PhotoProps) {
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
        style={ratio || pos ? { aspectRatio: ratio, objectPosition: pos } : undefined}
        loading={priority ? 'eager' : 'lazy'}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ fetchpriority: priority ? 'high' : undefined } as any)}
        /* async even when priority. `sync` blocks the main thread on the
           decode of a full-size photograph; what stopped the specimens
           flashing was fetching them EAGERLY at high priority, which is the
           line above, not decoding them on the scroll thread. */
        decoding="async"
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
  /* HER RULE, 2026-09-22: no full stop on a headline, anywhere. Large type
     already ends the thought; the dot read to her as noise on the form.
     Stripped here so every headline, including the ones built from data
     (SHOWROOM.lead, category titles, brand names), obeys it. Questions keep
     their mark. */
  const clean = text.replace(/\.\s*$/, '')
  const words = clean.split(' ')
  /* and no word left alone on the last line ("…tekur að / sér"): the last two
     words travel together when they are short enough to fit a phone line */
  const n = words.length
  const glue = n > 2 && (words[n - 2].length + words[n - 1].length) <= 14
  const word = (w: string, i: number) => (
    <span className="ki-line">
      <span className="ki-word" style={{ ['--i' as string]: i }}>{w}</span>
    </span>
  )
  return (
    <Tag
      id={id}
      data-ki-headline
      aria-label={clean}
      className={`ki-headline ki-rv-h ${className}`}
      /* 8% under the sizes the pages ask for: she found the big letters a
         touch large (2026-09-22), and one factor here keeps every page's
         hierarchy intact. The phone floors are untouched. */
      style={{ fontSize: fluid(Math.round(size * 0.92), floor), maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined }}
    >
      {(glue ? words.slice(0, n - 2) : words).map((w, i, arr) => (
        <span key={i} aria-hidden="true">
          {word(w, i)}
          {i < arr.length - 1 || glue ? ' ' : ''}
        </span>
      ))}
      {glue ? (
        <span aria-hidden="true" className="ki-nowrap">
          {word(words[n - 2], n - 2)}{' '}{word(words[n - 1], n - 1)}
        </span>
      ) : null}
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

export function Answers({ items, title }: {
  items: ReadonlyArray<{ q: string; a: string }>
  title?: string
}) {
  if (!items.length) return null
  return (
    <section className="ki-answers" aria-label={title || 'Spurt og svarað'}>
      {title && <p className="ki-kicker ki-rv">{title}</p>}
      {items.map((f) => (
        <div key={f.q} className="ki-answer ki-rv">
          <h2 className="ki-answer-q">{f.q}</h2>
          <p className="ki-answer-a">{f.a}</p>
        </div>
      ))}
    </section>
  )
}

export function CardFigure({ photos, sizes }: {
  photos: ReadonlyArray<{ id: string; alt: string; pos?: string }>; sizes: string
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
      <Photo id={photos[0].id} alt={photos[0].alt} sizes={sizes} pos={photos[0].pos} />
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

    /* RE-QUERIED IN measure(), not captured once. The header is part of the
       app shell and does not necessarily exist in its final shape at the
       moment this effect runs — capturing here left the burger out of the
       list entirely, so it kept the stylesheet's dark-ink fallback for the
       whole page and sat invisible on every dark band. */
    let chromeEls: HTMLElement[] = Array.from(root.querySelectorAll<HTMLElement>('[data-ki-chrome]'))
    const navEl = root.querySelector<HTMLElement>('.ki-nav')
    let bands: Array<{ el: HTMLElement; top: number; bottom: number; hz: boolean }> = []
    let condenseAt = Infinity
    let reveals: Array<{ el: Element; at: number }> = []
    let pars: Array<{
      el: HTMLElement; kind: ParKind; words: HTMLElement[]
      start: number; end: number; em: number
    }> = []
    /* horizontal chapters: pinned on a pointer, native scroll-snap on touch */
    /* layered parallax groups: one progress, many magnitudes */
    let plx: Array<{ start: number; end: number; dark: HTMLElement | null
      ground: HTMLElement[]
      layers: Array<{ el: HTMLElement; k: number }> }> = []
    let hs: Array<{
      track: HTMLElement; start: number; end: number; distance: number
      frames: Array<{ img: HTMLElement; left: number; width: number }>
    }> = []
    /* READ CONTINUOUSLY, NEVER ONCE. A flag evaluated at setup goes stale the
       moment the window is resized across the breakpoint: a window that loads
       narrow and is then widened keeps the mobile path forever and the
       chapter never moves again. The query object is kept and re-read inside
       measure(), and its own change event triggers one. */
    const pinQ = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)')
    let canPin = pinQ.matches
    const motion = !reduced()

    const measure = () => {
      const sy = window.scrollY
      const vh = window.innerHeight
      chromeEls = Array.from(root.querySelectorAll<HTMLElement>('[data-ki-chrome]'))
      /* THE HORIZONTAL CHAPTER IS SIZED FIRST, and everything else is
         measured after it. This block writes sec.style.height, which is
         twelve thousand pixels of document on this page; measuring bands,
         reveals and parallax starts before it recorded every position below
         the chapter twelve thousand pixels too high. The header read the
         wrong band for a third of the page because of it. */
      /* A horizontal chapter buys its sideways travel with vertical scroll:
         the section is made exactly as tall as the track overflows wide, so
         the distance the page scrolls is the distance the track moves. */
      hs = []
      canPin = pinQ.matches && motion
      for (const sec of Array.from(root.querySelectorAll<HTMLElement>('[data-ki-hscroll]'))) {
        const track = sec.querySelector<HTMLElement>('.ki-hs-track')
        if (!track) continue
        if (!canPin) {
          sec.style.height = ''; track.style.transform = ''
          // leave nothing clipped or offset behind on the touch build
          for (const el of Array.from(sec.querySelectorAll<HTMLElement>('[data-ki-hpar] img'))) {
            el.style.transform = ''
          }
          continue
        }
        const distance = Math.max(0, track.scrollWidth - window.innerWidth)
        sec.style.height = `${vh + distance}px`
        const top = sec.getBoundingClientRect().top + sy
        /* Each panel's offset INSIDE the track, measured once. offsetLeft is
           relative to the track's padding box and so is unaffected by the
           translate that is about to be written to it — reading a rect here
           would fold the current scroll position into the constant. */
        const frames: Array<{ img: HTMLElement; left: number; width: number }> = []
        for (const panel of Array.from(track.querySelectorAll<HTMLElement>('[data-ki-hpanel]'))) {
          for (const par of Array.from(panel.querySelectorAll<HTMLElement>('[data-ki-hpar]'))) {
            const img = par.querySelector<HTMLElement>('img')
            if (img) frames.push({ img, left: panel.offsetLeft + par.offsetLeft, width: par.offsetWidth })
          }
        }
        hs.push({
          track, start: top, end: top + distance, distance, frames,
        })
      }
      /* the ELEMENT is kept, not the answer. A section whose surface changes
         while the page sits inside it — the way out, stone to cream — has to
         be re-read on the frame, or the header keeps whatever tone it had
         when the page was measured. Geometry is still measured once. */
      bands = Array.from(root.querySelectorAll<HTMLElement>('[data-ki-band]')).map((s) => {
        const r = s.getBoundingClientRect()
        /* A band inside a horizontal track is NOT MEASURABLE HERE. It is a
           sticky panel that moves sideways while the page's scroll position
           stays inside one section, so its document-space range means nothing;
           and the section that contains it has not been given its height yet
           when this runs, so borrowing that range gets a window a fraction of
           the real one — which is why the header kept the chapter's cream and
           printed dark ink on the dark panel. Marked instead, and tested
           against its live rect on the frame: for a panel that is pinned to
           the viewport, "is it under the header" is a question about the
           viewport, not about the document. */
        const hz = !!s.closest('.ki-hs-track')
        return { el: s, top: r.top + sy, bottom: r.bottom + sy, hz }
      })
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

      /* The layered stack runs from its top meeting the viewport top to its
         bottom meeting it — the reference's own 0%/0% -> 100%/0% range. */
      plx = Array.from(root.querySelectorAll<HTMLElement>('[data-ki-plx]')).map((g) => {
        const r = g.getBoundingClientRect()
        const top = r.top + sy
        return {
          start: top,
          end: top + r.height,
          dark: g.querySelector<HTMLElement>('[data-ki-plx-dark]'),
          ground: Array.from(g.querySelectorAll<HTMLElement>('[data-ki-ground]')),
          layers: Array.from(g.querySelectorAll<HTMLElement>('[data-ki-layer]')).map((el) => ({
            el, k: parseFloat(el.dataset.kiLayer || '0'),
          })),
        }
      })

    }

    const runLayers = () => {
      if (!plx.length || !motion) return
      const sy = window.scrollY
      for (const g of plx) {
        const p = Math.min(1, Math.max(0, (sy - g.start) / (g.end - g.start || 1)))
        for (const l of g.layers) {
          // ease "none": the reference maps scroll to displacement linearly
          l.el.style.transform = `translate3d(0, ${(l.k * p).toFixed(3)}%, 0)`
        }
        /* THE STONE DARKENS, NOT THE FRAME.
           A full-bleed dimmer pushed the photograph above and the stone below
           toward the same colour at the same rate, so by the middle of the
           descent the boundary between them had no contrast left — the edge
           is geometrically just as broken the whole way up (329px of spread,
           measured), but it READ as a ruler-straight line because you could
           no longer see it. Darkening the plates themselves keeps the edge
           legible while the material goes down.

           brightness(.55) lands the marble almost exactly on the page's own
           ground colour: mean #4A3527 x .55 = (41,29,21) = #291D15. */
        const b = Math.min(1, Math.max(0, (p - 0.06) / 0.40))
        const bright = (1 - b * 0.45).toFixed(3)
        for (const el of g.ground) el.style.filter = `brightness(${bright})`
        /* The frame-wide dim only finishes off the last strip of photograph,
           long after the stone has taken most of the screen. */
        if (g.dark) {
          const o = Math.min(1, Math.max(0, (p - 0.30) / 0.20))
          g.dark.style.opacity = o.toFixed(3)
        }
      }
    }

    const runHScroll = () => {
      if (!hs.length) return
      const sy = window.scrollY
      const vw = window.innerWidth
      for (const h of hs) {
        const t = Math.min(1, Math.max(0, (sy - h.start) / (h.end - h.start || 1)))
        const shift = -t * h.distance
        // written raw, never through a transition — see the note on the component
        h.track.style.transform = `translate3d(${shift.toFixed(2)}px, 0, 0)`
        /* THE ROCK TRAVELS WITH THE JOURNEY, NOT WITH THE PAGE. Same scroll
           arithmetic as the track, at a fraction of its speed: the projects
           cross a rock face instead of sitting on a picture of one, and the
           only motion on screen is the one the visitor is making. */
        /* The track still travels under reduced motion — the chapter is
           navigation, and a strip nobody can reach is worse than a moving
           one. The peel and the counter-move are the decorative half, so
           they are the half that stops. */
        if (!motion) continue

        for (const f of h.frames) {
          /* THE COUNTER-MOVE, to the spec's own formula. The figure's screen x
             normalised by the viewport gives -1 offscreen left through 0 at
             the left edge to 1 offscreen right; the image, which is 120% wide
             with a -10% margin, is offset against it by at most 8%. Small on
             purpose: eight percent against a 120% image never exposes an edge
             and still reads, and above about twelve it starts to feel unglued
             from its frame. f.left is cached in measure() — reading a rect
             per figure per frame forces layout on every frame of a scroll and
             is the easiest way to make this chapter stutter. */
          const x = f.left + shift
          const k = Math.max(-1, Math.min(1, x / vw))
          f.img.style.transform = `translate3d(${(k * -8).toFixed(2)}%, 0, 0)`
        }
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
        /* LIVE, not cached. The nav condenses: the burger does not exist at
           the top of the page, so its cached box was zero and it themed
           itself against a point at the very top of the document for the
           whole scroll — dark ink on the dark panel, alone among the six.
           Six rects a frame is nothing next to the band rects already read
           here, and it makes the chrome's own geometry impossible to stale. */
        const cr = chromeEls[i].getBoundingClientRect()
        if (!cr.width && !cr.height) continue
        const cy = cr.top + cr.height / 2
        const cx = cr.left + cr.width / 2
        const centre = sy + cy
        let dark = false
        /* LAST MATCH WINS, so iterate backwards. Bands nest: the horizontal
           chapter is cream and holds one charcoal panel, and the panel is
           later in the document than the chapter that contains it. Taking the
           first match handed the header the chapter's cream and printed dark
           ink on the dark panel. */
        for (let j = bands.length - 1; j >= 0; j--) {
          const b = bands[j]
          if (b.hz) {
            /* live, in viewport coordinates, both axes */
            const r = b.el.getBoundingClientRect()
            if (cy < r.top || cy >= r.bottom) continue
            if (cx < r.left || cx >= r.right) continue
          } else if (centre < b.top || centre >= b.bottom) continue
          dark = b.el.dataset.kiBand === 'dark'
          break
        }
        const want = dark ? 'dark' : 'light'
        if (chromeEls[i].dataset.kiOn !== want) chromeEls[i].dataset.kiOn = want
        if (i === 0 && navEl && navEl.dataset.kiTone !== want) navEl.dataset.kiTone = want
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
      /* the header gets its own ground the moment anything can pass under it */
      const moved = window.scrollY > 8 ? 'true' : ''
      if (navEl.dataset.kiScrolled !== moved) navEl.dataset.kiScrolled = moved
    }

    /* THE TRACK MOVES FIRST. The header themes itself against whatever band
       is under it, and one of those bands is a panel that slides sideways —
       so theming before the slide is written reads the PREVIOUS frame's
       position. During a scroll that is a frame's lag and invisible; when the
       scroll stops it is permanent, which is why the wordmark sat dark on the
       dark panel until the visitor moved again. */
    /* AND THE NAV CONDENSES BEFORE IT IS THEMED, for the same reason: the
       burger does not exist until condenseNav shows it, so a theming pass
       that runs first skips it as a zero-size box. If the scroll then stops
       on that frame it never gets a tone at all, and it kept the
       stylesheet's dark-ink fallback on top of the dark panel. */
    const onFrame = () => { runHScroll(); condenseNav(); themeChrome(); sweepReveals(); runParallax(); runLayers() }
    /* reduced motion keeps the horizontal chapter too: it is navigation, not
       decoration, and the alternative is a track the visitor cannot reach.
       What it loses is the parallax, which is the part that is decoration. */
    const onFrameStill = () => { runHScroll(); condenseNav(); themeChrome(); sweepReveals() }

    let rafId = 0
    const onResize = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => { measure(); onFrame() })
    }

    measure()
    onFrame()
    window.addEventListener('resize', onResize, { passive: true })
    /* AND A RESIZE OBSERVER, because `resize` is a WINDOW event. When the
       viewport changes width without the window changing — a pane beside the
       page widening, a devtools dock, a desktop-app layout change — nothing
       fires, and every constant measured here goes stale: the horizontal
       chapter keeps the old travel distance and its last panel stops short of
       the right edge while the pin releases early, which is exactly the
       symptom. Observing the root catches it whatever caused it. */
    /* Guarded, because measure() sets the horizontal chapter's height and the
       root's own box therefore changes as a RESULT of measuring — an
       unguarded observer would answer its own writes. Only a real viewport
       change gets through. */
    let lastW = window.innerWidth
    let lastH = window.innerHeight
    const ro = new ResizeObserver(() => {
      if (window.innerWidth === lastW && window.innerHeight === lastH) return
      lastW = window.innerWidth; lastH = window.innerHeight
      onResize()
    })
    ro.observe(root)
    pinQ.addEventListener('change', onResize)
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
        ro.disconnect()
        window.removeEventListener('resize', onResize)
        pinQ.removeEventListener('change', onResize)
      }
    }

    root.classList.add('ki-js')
    window.addEventListener('scroll', onFrame, { passive: true })
    return () => {
      window.removeEventListener('scroll', onFrame)
      window.removeEventListener('resize', onResize)
      pinQ.removeEventListener('change', onResize)
      ro.disconnect()
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
