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
 * A full-bleed photograph with a sentence stepped down it.
 *
 * Each line sits further across than the last, so the eye walks the picture
 * diagonally instead of reading a centred block laid on top of it. The lines
 * rise out of their own masks on the reveal sweep, one after another.
 *
 * The scrim is not decoration: white type over a photograph is the classic
 * way to ship something that measures 2:1 in the bright corner, so there is
 * a real gradient under the text and the contrast is measured, not hoped for.
 */
export interface StatementWord {
  /** the word */
  t: string
  /** left offset as a percentage of the frame, measured off the reference */
  x: number
  /** top offset as a percentage of the frame */
  y: number
}

export function StatementOverlay({ id, alt, words, sub }: {
  id: string; alt: string; words: ReadonlyArray<StatementWord>; sub: string
}) {
  return (
    <section className="ki-stmt" data-ki-band="dark">
      <Photo id={id} alt={alt} sizes="100vw" />
      <div className="ki-stmt-scrim" aria-hidden="true" />
      {/* .ki-rv is only the trigger — the sweep already watches for it */}
      <p className="ki-stmt-words ki-rv" aria-label={words.map((w) => w.t).join(' ')}>
        {words.map((w, i) => (
          <span
            key={w.t + i}
            className="ki-stmt-word"
            style={{ left: `${w.x}%`, top: `${w.y}%`, ['--s' as string]: i }}
            aria-hidden="true"
          >
            <i>{w.t}</i>
          </span>
        ))}
      </p>
      <p className="ki-stmt-sub">{sub}</p>
    </section>
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
  /** a full-bleed slab: the whole viewport is the photograph, with one chip */
  bleed?: boolean
}

/**
 * The horizontal journey, on the Búðir engine.
 *
 * The first version of this was a row of equal cards that slid sideways, and
 * it was correctly called out: sliding a contact sheet is not a journey. The
 * three devices that make the Búðir version read as one are all here, with
 * that build's own measured values:
 *
 *  1. FULL-BLEED SLABS between the cards. Búðir alternates panels with
 *     100vw × 100svh photographs carrying a single corner chip (kicker +
 *     roman numeral), so the eye gets a horizon between groups instead of a
 *     uniform rhythm of thumbnails.
 *  2. THE PEEL. A panel does not fade in — it is uncovered. Búðir animates a
 *     clip-path inset and NEVER a transform, because both layers are the same
 *     photograph and a translate just slides a duplicate away. Scrubbed
 *     across the band [left − 0.88·vw, left − 0.42·vw]: the reveal happens
 *     while the panel crosses the right-hand two thirds of the screen.
 *  3. INNER COUNTER-PARALLAX. The photograph inside each frame runs
 *     xPercent +7.5 → −7.5 at a constant scale 1.16 while the frame travels
 *     the other way, so the image looks into the frame rather than riding it.
 *
 * All three are driven off the same scroll arithmetic the rest of this site
 * uses — no GSAP, no containerAnimation, no Lenis.
 */
export function HorizontalChapter({ eyebrow, panels }: {
  eyebrow: string; panels: ReadonlyArray<HPanel>
}) {
  let bleedNo = 0
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
          {panels.map((p, i) => {
            if (p.bleed) bleedNo++
            return (
              <article
                key={p.id + i}
                className={`ki-hs-panel ${p.bleed ? 'is-bleed' : ''}`}
                data-ki-hpanel
              >
                <Link to={p.to} className="ki-hs-fig">
                  <span className="ki-hs-img" data-ki-hpar>
                    <Photo
                      id={p.id}
                      alt={p.alt}
                      sizes={p.bleed ? '100vw' : '(max-width: 860px) 86vw, 46vw'}
                    />
                  </span>
                </Link>
                {p.bleed ? (
                  <div className="ki-hs-chip">
                    <p className="ki-kicker">{p.meta}</p>
                    <h3 className="ki-hs-chip-title"><Link to={p.to}>{p.title}</Link></h3>
                    <span className="ki-hs-chip-no" aria-hidden="true">
                      {['I', 'II', 'III', 'IV', 'V'][bleedNo - 1] ?? bleedNo}
                    </span>
                  </div>
                ) : (
                  <div className="ki-hs-meta">
                    <h3 className="ki-hs-title"><Link to={p.to}>{p.title}</Link></h3>
                    <p className="ki-hs-sub">{p.meta}</p>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export interface PlxPlate {
  id: string
  alt: string
  /** a pre-cut plate carrying alpha, served straight rather than through
      PHOTO_DIMS — see the note on the component */
  plate?: boolean
  /** how far this plate travels, as a percentage of its own height */
  k: number
  /** the plate's box, as percentages of the stage */
  x: number; y: number; w: number
  priority?: boolean
}

/**
 * The layered opening — the 21st.dev parallax component's mechanic, on this
 * site's own scroll engine.
 *
 * WHAT THE REFERENCE ACTUALLY DOES, once you read past the GSAP: four layers
 * stacked in one box, every one tweened at the SAME timeline position (each
 * added at "<" rather than in sequence) with a different magnitude —
 * yPercent 70 / 55 / 40 / 10, `ease: "none"`, `scrub: 0`, running from the
 * stack's top hitting the viewport top to its bottom hitting it. One scroll
 * input, four displacements: the 60-point spread between the back plate and
 * the front one IS the depth. Those four numbers are kept exactly.
 *
 * WHAT IS NOT KEPT is GSAP, ScrollTrigger and Lenis. The maths is
 * `y = k * progress`; this file already runs a scroll handler that does
 * arithmetic against a cached offset, so the three libraries would have been
 * 60 KB to compute four multiplications — and Lenis in particular kills iOS
 * momentum and freezes nested scrollers.
 *
 * THE PLATES CARRY ALPHA, which is the part that took two attempts to get
 * right. Pulling the reference's own three layer images apart settles what
 * the device actually needs: all three are the SAME 2000x1906 canvas,
 * registered exactly on top of each other — layer 1 fully opaque, layer 2
 * 50.4% transparent, layer 4 70.2% transparent. It is one backdrop plus two
 * CUT-OUTS, not a deck of rectangles. Without alpha the layers just slide
 * over each other and the depth never appears, which is what the first
 * attempt here looked like.
 *
 * Her photography cannot be cut that way: these are single-plane interiors,
 * and a background remover run on one returned a 99.7%-transparent fragment
 * because a room has no "subject" to isolate. So the plates are feathered
 * instead of cut — her own rooms, alpha-vignetted to 24% and 21% transparent,
 * so they overlap as planes with no hard rectangle edge. Same structure as
 * the reference, honest about the source material, nothing generated.
 *
 * THE PLATES ARE NOT A ROW. The registry demo stacks its images dead centre,
 * which with opaque rectangles reads as a deck of cards sliding. These are
 * placed as an asymmetric composition — a wide plate low and left, a tall one
 * high and right, a small detail crossing the middle — so the layers overlap
 * at different points and the depth reads as a room rather than a stack. The
 * title is layer three, BETWEEN the plates, so the foreground detail travels
 * across the front of her name exactly as the reference passes its own front
 * plate over its heading.
 */
export function ParallaxHero({ plates, children }: {
  plates: ReadonlyArray<PlxPlate>; children: ReactNode
}) {
  return (
    <section className="ki-plx" id="top" data-ki-band="dark" data-ki-plx>
      <div className="ki-plx-stage">
        {plates.map((p) => (
          <span
            key={p.id}
            className="ki-plx-plate"
            data-ki-layer={p.k}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, zIndex: Math.round(100 - p.k) }}
          >
            {p.plate ? (
              <picture>
                <source type="image/avif" srcSet={`${DIR}/${p.id}.avif`} />
                <source type="image/webp" srcSet={`${DIR}/${p.id}.webp`} />
                <img src={`${DIR}/${p.id}.webp`} width={2000} height={p.id === 'plate-mid' ? 820 : 900}
                  alt={p.alt} loading="eager" decoding="async" />
              </picture>
            ) : (
              <Photo id={p.id} alt={p.alt} sizes={`${Math.round(p.w)}vw`} priority={p.priority} />
            )}
          </span>
        ))}
        {/* the title rides its own layer, sandwiched between the plates */}
        <div className="ki-plx-lockup" data-ki-layer="40">{children}</div>
        {/* the reference's __fade: the stack resolves into the page instead of
            ending on a hard edge */}
        <div className="ki-plx-fade" aria-hidden="true" />
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

/**
 * ON A POINTER THIS IS AN ACCORDION, the 21st.dev image-gallery device: the
 * five materials stand side by side as columns, and the one under the cursor
 * grows while its neighbours give way, over 500ms. Two changes from the
 * reference, both forced by what this content is rather than by taste:
 *
 *   · the reference expands the hovered panel to w-full, which crushes the
 *     others to a sliver. These are a PALETTE — all five have to stay legible
 *     as colour even while one is open — so it is a flex ratio (1 → 3.4)
 *     instead, and the four resting columns keep real width.
 *   · the reference reveals the title only on hover. Here the material's name
 *     is the content, so the name never hides; what the expansion buys is the
 *     hex and the full still-life, which a narrow column crops away.
 *
 * On touch it stays the stacked strip it already was. An accordion driven by
 * hover is unreachable without a pointer, and making it tap-to-open turns a
 * palette into a widget people have to learn.
 */
export function MaterialBands({ bands }: { bands: ReadonlyArray<MaterialBand> }) {
  return (
    <div className="ki-mat">
      {bands.map((b) => (
        <figure key={b.id} className={`ki-mat-band ki-rv ${b.dark ? 'is-dark' : ''}`} tabIndex={0}>
          <Photo id={b.id} alt={b.alt} sizes="(max-width: 860px) 100vw, 60vw" />
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
    /* layered parallax groups: one progress, many magnitudes */
    let plx: Array<{ start: number; end: number; layers: Array<{ el: HTMLElement; k: number }> }> = []
    let hs: Array<{
      track: HTMLElement; start: number; end: number; distance: number
      frames: Array<{ img: HTMLElement; left: number; width: number }>
    }> = []
    const canPin = window.matchMedia('(min-width: 861px) and (hover: hover) and (pointer: fine)').matches
    const motion = !reduced()

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

      /* The layered stack runs from its top meeting the viewport top to its
         bottom meeting it — the reference's own 0%/0% -> 100%/0% range. */
      plx = Array.from(root.querySelectorAll<HTMLElement>('[data-ki-plx]')).map((g) => {
        const r = g.getBoundingClientRect()
        const top = r.top + sy
        return {
          start: top,
          end: top + r.height,
          layers: Array.from(g.querySelectorAll<HTMLElement>('[data-ki-layer]')).map((el) => ({
            el, k: parseFloat(el.dataset.kiLayer || '0'),
          })),
        }
      })

      /* A horizontal chapter buys its sideways travel with vertical scroll:
         the section is made exactly as tall as the track overflows wide, so
         the distance the page scrolls is the distance the track moves. */
      hs = []
      for (const sec of Array.from(root.querySelectorAll<HTMLElement>('[data-ki-hscroll]'))) {
        const track = sec.querySelector<HTMLElement>('.ki-hs-track')
        if (!track) continue
        if (!canPin) {
          sec.style.height = ''; track.style.transform = ''
          // leave nothing clipped or offset behind on the touch build
          for (const el of Array.from(sec.querySelectorAll<HTMLElement>('[data-ki-hpar]'))) {
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
          const img = panel.querySelector<HTMLElement>('[data-ki-hpar]')
          if (img) frames.push({ img, left: panel.offsetLeft, width: panel.offsetWidth })
        }
        hs.push({
          track, start: top, end: top + distance, distance, frames,
        })
      }
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
        /* The track still travels under reduced motion — the chapter is
           navigation, and a strip nobody can reach is worse than a moving
           one. The peel and the counter-move are the decorative half, so
           they are the half that stops. */
        if (!motion) continue

        for (const f of h.frames) {
          const x = f.left + shift // the panel's left edge, in viewport coords

          /* NO PEEL. Búðir's clip-wipe reveal was transplanted here and then
             taken back out: on a track that is ALREADY moving sideways, a
             panel that is also being uncovered left-to-right just looks like
             a photograph that has half loaded. The wipe works there because
             those panels arrive at rest; here the horizontal travel is the
             reveal, and stacking a second one on top of it read as broken
             rather than as motion.

             INNER COUNTER-PARALLAX stays — xPercent +7.5 → −7.5 at a constant
             scale 1.16 across the panel's passage through view. It never
             exposes an edge (that is what the scale is for) so it reads as
             depth rather than as an unfinished image. */
          const q = (x + f.width) / (vw + f.width) // 1 entering right, 0 leaving left
          const px = (q - 0.5) * 15
          f.img.style.transform = `translate3d(${px.toFixed(2)}%, 0, 0) scale(1.16)`
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

    const onFrame = () => { themeChrome(); sweepReveals(); runParallax(); runLayers(); runHScroll(); condenseNav() }
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
