'use client'

/**
 * 21st.dev @osmosupply/parallax-scrolling.
 *
 * The registry entry ships the GSAP wiring and NOTHING ELSE — no CSS, no
 * registryDependencies. Every class it renders (.parallax, .parallax__header,
 * .parallax__visuals, .parallax__layers, .parallax__layer-img,
 * .parallax__fade, .parallax__black-line-overflow) is absent from the package,
 * which is why the code alone cannot tell you what it looks like. The
 * stylesheet next to this file was measured off the running demo's computed
 * styles; the numbers are in its comments.
 *
 * Three changes from the registry source, all forced:
 *   · it imports '@studio-freight/lenis', which is the OLD package name.
 *     Lenis ships as 'lenis' now, and that is what is installed here.
 *   · the layers are props rather than four hardcoded cdn.21st.dev URLs, so
 *     this page can pass Katrín's own photograph and her basalt.
 *   · the foreground planes are described in FRAME HEIGHTS rather than in
 *     percentages of their own box — see ParallaxPlate.
 *
 * The motion is otherwise untouched: every layer on the SAME timeline
 * position, ease none, scrub 0.
 */
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './parallax-scrolling.css'

/** the full-bleed backdrop — the room at the top of the descent, the sky at
 *  the top of the ascent. The registry's own layer 1 geometry, untouched. */
export interface ParallaxLayer {
  layer: '1'
  src: string
  alt: string
  /** overrides the registry's yPercent 70 */
  yPercent?: number
}

/**
 * A FOREGROUND PLANE — a keyed slab of rock with a silhouette along one edge
 * and its own body falling away behind it.
 *
 * WHY THIS IS NOT JUST A LAYER WITH A yPercent.
 *
 * The plates used to be sized by aspect-ratio and moved by yPercent, which
 * ties every number in the effect to the viewport's WIDTH — the plate's
 * height, the crest's position in the frame and the distance it travels all
 * scale with width, while the frame they have to cross scales with height.
 * At 1280x800 that reads correctly and at 390x844 it falls apart completely:
 * measured on the shipped hero, the crest that should have sat at 90% of the
 * frame sat at 21% instead, so the phone opened on a wall of rock with a
 * sliver of her kitchen above it, and the descent then ran out of travel
 * 90px short of the top. Both gates were built on that geometry.
 *
 * So a plate is described the way the DESIGN thinks about it:
 *
 *   crest   where the silhouette sits inside the image, 0..1 from its top.
 *   restAt  where that crest sits in the FRAME before any scroll, as a
 *           fraction of the frame height. Negative is above the frame.
 *   travel  how far the crest moves over the descent, in FRAME HEIGHTS.
 *           Negative rises (the entry), positive sinks (the exit). This
 *           ratio between the three planes is the only thing carrying depth
 *           — nothing here is ever scaled, because scale about a top origin
 *           grows the plate sideways too, and that lateral growth is the
 *           most legible thing on screen: it reads as a zoom into the rock
 *           rather than rock drifting past the camera.
 *   fill    the colour behind everything, for the rare frame the plate's own
 *           material does not reach.
 *
 * WHAT CONTINUES BELOW THE IMAGE. The plate is sized off the viewport's WIDTH
 * and the travel is measured in screen HEIGHTS, so on a phone the image alone
 * cannot cover the descent — something has to carry on past its last row.
 * That was a separate tile, seamless on both axes and repeated; and a tile
 * repeats. Even at a four-level range the mirror symmetry inside it is legible
 * in a near-black field, so the bottom of the descent was the same shape over
 * and over down the screen.
 *
 * It is the plate's OWN image now, flipped once and butted to its bottom edge,
 * so the join is the same row of pixels meeting itself — seamless by
 * construction rather than by encoding — and there is nothing repeated,
 * because it happens exactly once and then stops on `fill`, which is the tone
 * those rows already resolve to.
 *
 * The component turns those into a box whose height is in frame units and an
 * image inside it whose height is in viewport widths, which is the only
 * combination where the rock keeps its own proportions AND the choreography
 * keeps its timing.
 */
export interface ParallaxPlate {
  /** the registry's numbering: 2 and 5 sit behind the type, 4 in front.
   *  6/7/8 are in front of 4 — the ceiling that closes over the ground. */
  layer: '2' | '5' | '4' | '6' | '7' | '8'
  src: string
  /** the plate's own pixels, for the image's aspect */
  width: number
  height: number
  crest: number
  restAt: number
  travel: number
  fill: string
  /** TURNED OVER: the silhouette points DOWN and the body hangs above it, so
   *  the plate closes over the frame from the top instead of rising into it
   *  from the bottom. Same file either way — the descent's second half is the
   *  same rock coming the other way, not a different asset and not a
   *  different section. */
  flip?: boolean
  alt?: string
}

export interface ParallaxProps {
  /** the backdrop plane; omit for a gate that opens onto flat colour */
  layers?: ReadonlyArray<ParallaxLayer>
  /** the foreground planes */
  plates?: ReadonlyArray<ParallaxPlate>
  /** rides layer 3, between the plates, exactly as the demo's <h2> does */
  title?: ReactNode
  /** whatever the descent hands off to */
  children?: ReactNode
  /** Lenis smooth scroll. Off by default: it costs iOS momentum and freezes
   *  nested scrollers, and this site drives its other effects from real
   *  scroll offsets. The parallax itself does not need it. */
  smooth?: boolean
  /** Pin the hero for the length of the descent.
   *
   *  The registry does NOT do this, and for the registry's own effect it is
   *  right not to: there, the foreground rushing away as the hero leaves IS
   *  the effect — a departure, played out in the moment the section exits.
   *
   *  These two are the opposite. They have to hold the frame while the
   *  ground crosses it. Unpinned, the header is 100svh of ordinary page: it
   *  has scrolled off before the timeline is 83% done, so the descent never
   *  gets to happen on screen — the hero just shrinks into the top of the
   *  viewport while the next section pushes up underneath, and the only
   *  change still legible in that shrinking window is the scale. Which is
   *  precisely what it looked like: "it only zooms the stone." */
  sticky?: boolean
  /** total height of the pinned wrapper; the move gets this minus 100svh */
  scroll?: string
  /** layer 3's yPercent. The registry's +40 drifts the type DOWN, which is
   *  right when the whole hero is scrolling away underneath it and wrong
   *  when it is pinned — there it has to leave upward, ahead of the ground. */
  titleYPercent?: number
  /** painted behind every layer: the light the exit gate opens onto */
  backdrop?: string
  /** the colour the wrapper itself carries, for the frame the pin releases on */
  ground?: string
  /** Content that arrives once the frame has become what the move was going
   *  toward — material, at the bottom of the descent; light, at the top of
   *  the ascent. It is not part of the layer stack: the layers all run at
   *  timeline position 0, and this has to land late, so it gets its own
   *  tween further down the same scrub. */
  deep?: ReactNode
  /** where on the scrub it arrives, 0..1 */
  deepAt?: number
  /** this is the ASCENT, not the descent. Only reduced motion cares: with the
   *  movement gone, the descent's rest state still says everything and the
   *  ascent's is a blank dark wall, so they collapse to opposite halves of
   *  themselves. See the reduced-motion block in the stylesheet. */
  gate?: boolean
  /** a small affordance pinned to the landing frame's corner — above every
   *  plane, and gone by a fifth of the scrub, because it belongs to the
   *  landing page and not to the descent */
  corner?: ReactNode
  /** paint it BEHIND the nearest plane, so the rock can cross in front of it.
   *  Right for the exit, where the copy is written on the sky and the ridge
   *  is still sinking past it; wrong for the entry, where the copy is
   *  written on the near plate itself. */
  deepBehind?: boolean
  /** the tone the fixed site chrome has to read itself against while this
   *  section is under it. 'dark' means the chrome goes light. A gate section
   *  passes 'dark' too and then flips itself to 'light' as its cream deep
   *  arrives — the surface under the header genuinely changes mid-scroll,
   *  and a band measured once cannot say that. */
  band?: 'dark' | 'light'
  /** THE OPENING. The wordmark alone on the bare ground: its letters rise
   *  out of their masks one at a time, in the position and at the size they
   *  hold for the rest of the page — it never moves — and then the
   *  photographs, the stone and the corner card fade in behind it. The type
   *  starts the moment the document is ready, so something is happening
   *  while the images are still arriving; the fade waits for them to decode
   *  so it never uncovers a photograph that is not there.
   *  Skipped for a visitor who has seen it this session, under reduced
   *  motion, and inside the prerenderer. The scrub timeline is built only
   *  once the intro has handed over, at exactly its rest state. */
  intro?: boolean
}

/* ONE LENIS FOR THE PAGE, NOT ONE PER GATE.
   The registry demo constructs a Lenis inside the component, which is right
   while there is exactly one of these on a page. This page has two — the
   descent at the top and the ascent out of the dark chapter — and two Lenis
   instances both hijack wheel events and both drive their own rAF against the
   same scrollTop, so the page scrolls at roughly double speed and the two
   fight over the easing. Shared instance, reference counted, torn down when
   the last gate that asked for it unmounts. */
let sharedLenis: Lenis | undefined
let sharedTicker: ((t: number) => void) | undefined
let lenisRefs = 0
function acquireLenis() {
  if (++lenisRefs === 1) {
    sharedLenis = new Lenis()
    sharedLenis.on('scroll', ScrollTrigger.update)
    sharedTicker = (time: number) => sharedLenis?.raf(time * 1000)
    gsap.ticker.add(sharedTicker)
    gsap.ticker.lagSmoothing(0)
  }
  return sharedLenis
}
function releaseLenis() {
  if (--lenisRefs > 0) return
  if (sharedTicker) gsap.ticker.remove(sharedTicker)
  sharedLenis?.destroy()
  sharedLenis = undefined
  sharedTicker = undefined
  lenisRefs = 0
}

/** the geometry, in one place — see ParallaxPlate for why it is shaped so.
 *  The plate is a box GSAP translates, holding two static children: the keyed
 *  face at the top, and the tiled rock that continues below it. Two elements
 *  rather than two background layers on one, because the face is transparent
 *  above its own crest and a background-colour or a second background layer
 *  behind it would show THROUGH that sky. */
function plateGeom(p: ParallaxPlate) {
  /* the image is laid at 100% of the box width, so its rendered height is a
     fixed number of viewport widths and the rock keeps its proportions */
  const K = (100 * p.height) / p.width
  /* THE FACE'S HEIGHT, AND EVERY OTHER MEASUREMENT IS DERIVED FROM IT.
     K vw is the image laid at the box's full width, which is correct on any
     frame wider than the image is tall in proportion — every desktop shape.
     On a PORTRAIT PHONE it is a disaster: 2400x3800 across a 390 wide frame
     renders 617px tall against an 844px screen, so the photograph cannot
     cover the frame and what showed under it was the flat fill — the brown
     background, on the one page whose whole argument is that it is a single
     photograph of rock.
     So the face takes whichever is larger, and the image is laid at that
     HEIGHT rather than that width: it overflows sideways and is cropped,
     which costs nothing on a wall of columns and keeps the grain at one
     scale across face, hem and tail. On a desktop the two are identical, so
     nothing there changes at all.
     165svh, not 120: the plates have to have room to RISE. The travel clamp
     stops the mirror fold entering the frame by shortening the rise to
     whatever the photograph can cover, and at 120svh that came out under half
     the intended travel — the ground would barely have moved. */
  const FACE = `max(${K.toFixed(3)}vw, 165svh)`
  /* six frames of box plus the image itself. Six covers every case: the
     furthest the box edge ever sits outside the frame is
     (1 - restAt + |travel|) frames, and that is 4.7 at the very worst. */
  const height = `calc(600% + ${FACE})`
  const box: CSSProperties = p.flip
    /* top:auto is not decoration: .parallax__layer-img carries the registry's
       own top:-17.5%, and when top, bottom and height are all set CSS keeps
       top and throws bottom away — the flipped plates were silently sitting
       where the un-flipped ones do and never appeared at all */
    ? { top: 'auto', bottom: `calc(${((1 - p.restAt) * 100).toFixed(3)}% - ${p.crest.toFixed(4)} * ${FACE})`, height, ['--face' as string]: FACE }
    : { top: `calc(${(p.restAt * 100).toFixed(3)}% - ${p.crest.toFixed(4)} * ${FACE})`, height, ['--face' as string]: FACE }
  const face: CSSProperties = p.flip
    ? { bottom: 0, top: 'auto', height: FACE, backgroundImage: `url(${p.src})`,
        transform: 'scaleY(-1)' }
    : { height: FACE, backgroundImage: `url(${p.src})` }
  const tail: CSSProperties = p.flip
    ? { top: 0, bottom: FACE, backgroundColor: p.fill }
    : { top: FACE, backgroundColor: p.fill }
  /* THE HEM — the plate's own last rows, mirrored once, and ONLY those rows.
     `background-position: bottom` with the box shorter than the image shows
     the image's bottom quarter and nothing else, which is the part that has
     already resolved to `fill`; mirroring it means the two rows meeting at
     the join are the same row of pixels. A quarter, not the whole image:
     mirroring all of it brings the plate's own crest back a second time, and
     on the way out that duplicate crest landed in the middle of the frame at
     rest with its lit band under it. Below the hem is flat fill, which those
     rows already are, so there is nothing to see and nothing repeats. */
  /* 0.36, not 0.25. On a 1490x1230 frame the image plus a quarter-height hem
     ran out 600px before the bottom of the descent's last frame, and the
     way out's first frame sat even further up the tail — both landed on flat
     fill, which is the "generic brown background" back again. 36% is as far
     as the mirror can go before it runs back up into the lit falloff (the
     last 37% of the plate is floor); below that the fill carries grain of
     its own, so no frame is ever a painted colour. */
  const HEM = 0.36
  const hem: CSSProperties = {
    height: `calc(${HEM} * ${FACE})`,
    backgroundImage: `url(${p.src})`,
    ...(p.flip
      ? { top: 'auto', bottom: FACE }
      : { top: FACE, bottom: 'auto', transform: 'scaleY(-1)' }),
  }
  return { box, face, tail, hem }
}

export function ParallaxComponent({
  layers = [], plates = [], title, children, smooth = false, sticky = false,
  scroll = '240svh', titleYPercent, backdrop, ground, deep, deepAt = 0.55,
  deepBehind = false, gate = false, corner, band, intro = false,
}: ParallaxProps) {
  const parallaxRef = useRef<HTMLDivElement>(null)

  const hasDeep = !!deep
  const hasTitle = !!title
  /* the plates are the effect's whole choreography, so the timeline has to be
     rebuilt when they change — but not on every render of the page around it */
  const plateKey = plates.map((p) => `${p.layer}:${p.restAt}:${p.travel}`).join('|')
  const layerKey = layers.map((l) => `${l.layer}:${l.yPercent}`).join('|')

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const root = parallaxRef.current
    const triggerElement = root?.querySelector('[data-parallax-layers]')
    const header = root?.querySelector<HTMLElement>('.parallax__header')
    /* THE FRAME, in pixels. Every plate number is expressed against this, and
       it is read at refresh time rather than baked in, so a rotation or a
       resize re-derives the whole descent instead of keeping numbers that
       were correct for the old viewport. */
    const frame = () => header?.clientHeight || window.innerHeight

    const ctx = gsap.context(() => {}, parallaxRef)
    /* the scrub timeline, built either at once or after the opening */
    const build = () => ctx.add(() => {
      if (!triggerElement) return
      /* Unpinned, the registry runs the timeline across the layer box passing
         the viewport top. Pinned, the layer box no longer moves — the wrapper
         does — so the timeline has to run against that instead, from the
         wrapper's top hitting the viewport top to its bottom hitting the
         viewport bottom, which is exactly the length the header is stuck. */
      const tl = gsap.timeline({
        scrollTrigger: sticky
          ? { trigger: root!, start: 'top top', end: 'bottom bottom',
              scrub: 0, invalidateOnRefresh: true }
          : { trigger: triggerElement, start: '0% 0%', end: '100% 0%',
              scrub: 0, invalidateOnRefresh: true },
      })

      const at = (sel: string) => triggerElement.querySelectorAll(sel)

      /* the backdrop keeps the registry's own layer-1 drift: a few percent,
         no scale. A scaled photograph reads as a zoom, which is the thing
         this hero was accused of doing and the thing it must not do. */
      for (const l of layers) {
        const t = at(`[data-parallax-layer="${l.layer}"]`)
        if (t.length) tl.to(t, { yPercent: l.yPercent ?? 70, ease: 'none', duration: 1 }, 0)
      }
      if (hasTitle) {
        const t = at('[data-parallax-layer="3"]')
        if (t.length) tl.to(t, { yPercent: titleYPercent ?? 40, ease: 'none', duration: 1 }, 0)
      }
      /* px, from a function, re-read on every refresh — that is what makes
         travel mean "frame heights" instead of "percent of a box whose height
         happens to come from the viewport's width" */
      /* THE ONE RULE THAT KEEPS THE WALL ONE PHOTOGRAPH. Below the face is a
         hem — the plate's own last rows mirrored — and a mirror of diagonal
         columns kinks: the lean reverses at the fold and the eye reads a line
         across the whole frame. So the fold must never enter the frame. On a
         tall landscape frame (1490x1230, 1990x1300) the near plate's full
         travel carried its bottom edge a few dozen pixels above the frame's
         bottom at the end of the descent, and that was the seam. The travel
         is scaled — all plates by ONE factor, so the depth ordering between
         them is untouched — so the lowest face edge stops exactly at the
         frame's bottom. Portrait frames, where the image alone is shorter
         than the descent, keep the full travel and the hem: scaling there
         would stop the plates from rising at all. */
      const plateScale = () => {
        if (!frame()) return 1
        let s = 1
        for (const p of plates) {
          if (p.flip) continue
          const face = triggerElement.querySelector<HTMLElement>(
            `[data-parallax-layer="${p.layer}"] .parallax__plate-face`,
          )
          const K = face?.offsetHeight ?? 0
          const room = p.restAt * frame() - p.crest * K + K - frame()
          const want = Math.abs(p.travel) * frame()
          if (want > 0 && room < want) s = Math.min(s, room / want)
        }
        return s >= 0.55 ? s : 1
      }
      for (const p of plates) {
        const t = at(`[data-parallax-layer="${p.layer}"]`)
        if (t.length) tl.to(t, { y: () => p.travel * frame() * (p.flip ? 1 : plateScale()), ease: 'none', duration: 1 }, 0)
      }

      /* The layer tweens all sit at position 0 with duration 1, which is what
         makes this position mean what it says on the scrub. */
      const deepEl = triggerElement.querySelector('[data-parallax-deep]')
      if (deepEl) {
        /* NOTHING HERE FADES. The block used to arrive on an opacity tween
           and its contents on autoAlpha, and both were wrong for the same
           reason: a fade driven by a scrub is a dimmer switch under the
           visitor's finger, and autoAlpha's visibility flipped hidden and
           back on every frame the scroll rested near a tween's edge. It
           read as a glitch because it was one.
           So the container is simply MADE VISIBLE, once, outside the
           timeline — which shows nothing, because every child of it is held
           by a reveal of its own — and then the copy rises out of its
           windows and the photographs are uncovered by a wipe. No opacity
           is animated anywhere inside this block. */
        gsap.set(deepEl, { visibility: 'visible', opacity: 1 })

        /* Every reveal is timed as a FRACTION OF THE RUNWAY, not in absolute
           units of the timeline. The descent hands its block half the pin and
           the gate hands its block a third, so a stagger that reads as
           unhurried in one overran the end of the other — the gate's last
           word was landing at 1.17 of a timeline that stops at 1.0, which
           means it never landed at all. Written this way the last thing in
           the block always comes to rest at 0.96, whatever it is and however
           many of them there are. */
        const run = Math.max(0.2, 1 - deepAt)
        const words = deepEl.querySelectorAll('[data-parallax-word]')
        const stag = deepEl.querySelectorAll('[data-parallax-stagger]')

        /* gsap.set FIRST, THEN the fromTo, and the pair is not redundant.
           A STAGGERED fromTo only writes its from-state to the target whose
           own sub-tween has started: measured mid-descent, the first word
           was held and the other five had no inline style at all, which
           means they had been sitting there fully drawn since the top of the
           page and then POPPED out of sight the instant their turn came.
           That is the glitch. The set holds every target from the moment the
           timeline is built; the fromTo is kept because it survives the
           invalidate that a refresh triggers, where a plain to() would
           re-record whatever it happened to be showing as its start. */
        if (words.length) {
          const gap = words.length > 1 ? (run * 0.30) / (words.length - 1) : 0
          gsap.set(words, { yPercent: 100, y: 0 })
          tl.fromTo(words,
            { yPercent: 100, y: 0 },
            { yPercent: 0, y: 0, ease: 'power2.out', duration: run * 0.30,
              stagger: gap }, deepAt + run * 0.10)
        }
        if (stag.length) {
          /* uncovered from the bottom edge up, which is how a specimen set
             down on a shelf comes into view, with the photograph inside
             settling out of a small oversize as its own window opens */
          const gap = stag.length > 1 ? (run * 0.42) / (stag.length - 1) : 0
          gsap.set(stag, { clipPath: 'inset(100% 0% 0% 0%)' })
          tl.fromTo(stag,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out', duration: run * 0.28,
              stagger: gap }, deepAt + run * 0.26)
          const stagImgs = deepEl.querySelectorAll('[data-parallax-stagger] img')
          if (stagImgs.length) {
            gsap.set(stagImgs, { scale: 1.09 })
            tl.fromTo(stagImgs,
              { scale: 1.09 },
              { scale: 1, ease: 'power2.out', duration: run * 0.40, stagger: gap },
              deepAt + run * 0.26)
          }
        }

        /* THE CHROME STILL HAS TO FOLLOW THE SURFACE. On the way out the
           ground under the fixed header stops being stone and becomes cream
           inside this one section, and the header's band lookup reads the
           attribute live — so something has to write it. It used to ride on
           the container's fade; with the fade gone it gets a driver of its
           own, which animates nothing. */
        const rootEl = parallaxRef.current
        if (rootEl && band && gate) {
          tl.to({}, {
            duration: run * 0.5, ease: 'none',
            onUpdate: function (this: gsap.core.Tween) {
              const want = this.progress() > 0.5 ? 'light' : band
              if (rootEl.dataset.kiBand !== want) rootEl.dataset.kiBand = want
            },
          }, deepAt)
        }
      }
      const cornerEl = triggerElement.querySelector('[data-parallax-corner]')
      if (cornerEl) {
        tl.to(cornerEl, { opacity: 0, y: -12, ease: 'none', duration: 0.2 }, 0)
      }
    })

    /* WITHOUT LENIS, NOTHING DRIVES ScrollTrigger HERE.
       The registry demo always constructs Lenis and wires
       lenis.on('scroll', ScrollTrigger.update) — that call is what advances
       the timeline. Dropped straight in without Lenis the trigger measures
       correctly (start 0, end 1080) but its own scroll getter kept returning
       0 while window.scrollY was 540, so progress never moved and every
       layer sat at translate 0. This is the same wiring Lenis provides. */
    /* Lenis on the pointer, never on touch. Hijacked wheel scrolling is what
       makes a long pinned descent feel weighted on a trackpad, but on iOS it
       replaces real momentum with a JS approximation and freezes any nested
       scroller — and this page has a horizontal one. So the smooth path is
       gated to a fine pointer and the native path stays for everything else. */
    const fine = typeof window.matchMedia === 'function'
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const useLenis = smooth && fine

    const onScroll = () => ScrollTrigger.update()
    if (!useLenis) window.addEventListener('scroll', onScroll, { passive: true })

    if (useLenis) acquireLenis()

    /* THE OPENING, or not. */
    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = !!document.documentElement.dataset.kiSeen
    /* never inside the prerenderer — see tools/katrin-prerender.mjs */
    const capturing = !!(window as unknown as { __KI_PRERENDER__?: boolean }).__KI_PRERENDER__
    const runIntro = intro && !reduced && !seen && !capturing && !!triggerElement
    let introTimer = 0
    let introDone = !runIntro
    const unlock = () => {
      document.documentElement.removeAttribute('data-ki-intro')
      document.documentElement.style.overflow = ''
      sharedLenis?.start()
    }
    if (runIntro) {
      /* Scroll is held while the wordmark is alone on the ground. Both
         surfaces: the document's own overflow for touch and keyboard, Lenis
         for the wheel. */
      window.scrollTo(0, 0)
      document.documentElement.style.overflow = 'hidden'
      sharedLenis?.stop()

      ctx.add(() => {
        const q = (sel: string) => Array.from(triggerElement!.querySelectorAll<HTMLElement>(sel))
        const letters = q('[data-parallax-letter]')
        const fades = q('[data-parallax-fade]')
        const visuals = q('.parallax__layer-img, .parallax__backdrop')
        const cornerEl = triggerElement!.querySelector<HTMLElement>('[data-parallax-corner]')

        /* THE TYPE, AT ONCE. It is the only thing on the screen and it is
           the reason the wait is bearable, so it does not queue behind a
           network. Its own held state comes from the stylesheet; these
           fromTos restate it inline so nothing depends on the attribute
           still being there when they run. */
        const type = gsap.timeline()
        if (letters.length) {
          /* y: 0 IN BOTH, and it is not decoration. GSAP parses the element's
             existing computed transform on first touch and keeps the px it
             finds in `y` — then it writes translate(x + xPercent, y +
             yPercent), COMPOSING the two. The stylesheet's own held state is
             translateY(130%), so the parsed y was already one mask-height
             down and every letter finished the rise still exactly one mask
             below its window: the wordmark animated, and stayed invisible.
             Stating y clears the parsed offset and leaves the percentage as
             the only thing moving. */
          type.fromTo(letters,
            { yPercent: 130, y: 0 },
            { yPercent: 0, y: 0, duration: 1.05, ease: 'power3.out', stagger: 0.042 }, 0)
        }
        if (fades.length) {
          type.fromTo(fades,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out', stagger: 0.14 }, 0.5)
        }

        /* THE PAGE, ONCE IT EXISTS. Every plate and the room behind them,
           decoded — the fade must not uncover a photograph that has not
           arrived. Capped, so a slow connection gets the page rather than a
           held screen; floored, so the wordmark is never cut off mid-rise. */
        const srcs = [...plates.map((p) => p.src), ...layers.map((l) => l.src)]
        const decode = (src: string) => new Promise<void>((res) => {
          const im = new Image()
          im.onload = () => res(); im.onerror = () => res()
          im.src = src
          if (im.complete) res()
        })
        const hold = new Promise<void>((res) => { introTimer = window.setTimeout(res, 1250) })
        const cap = new Promise<void>((res) => { window.setTimeout(res, 3200) })

        Promise.all([hold, Promise.race([Promise.all(srcs.map(decode)), cap])]).then(() => {
          if (introDone) return
          ctx.add(() => {
            gsap.timeline({
              onComplete: () => {
                introDone = true
                unlock()
                build()
                ScrollTrigger.refresh()
              },
            })
              /* the room first and the stone after it, which is the order
                 they are stacked in and the order the eye reads them */
              .fromTo(visuals,
                { opacity: 0 },
                { opacity: 1, duration: 1.25, ease: 'power2.out', stagger: 0.075 }, 0)
              .fromTo(cornerEl ? [cornerEl] : [],
                { opacity: 0 },
                { opacity: 1, duration: 0.8, ease: 'power1.out' }, 0.75)
          })
        })
      })
    } else {
      build()
    }

    /* This page is prerendered and hydrated, and its photographs decode after
       mount — so ScrollTrigger's first measurement is taken against a layout
       that has not settled, and the timeline ends up with a zero-length
       range that never advances. Re-measure once everything has landed. */
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    const imgs = Array.from(root?.querySelectorAll('img') ?? [])
    let pending = imgs.filter((i) => !i.complete).length
    for (const img of imgs) {
      if (img.complete) continue
      img.addEventListener('load', () => { if (--pending <= 0) refresh() }, { once: true })
    }
    const t = window.setTimeout(refresh, 400)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('load', refresh)
      window.clearTimeout(t)
      window.clearTimeout(introTimer)
      if (!introDone) { introDone = true; unlock() }
      ctx.revert()
      if (useLenis) releaseLenis()
    }
  }, [smooth, sticky, titleYPercent, deepAt, hasDeep, hasTitle, plateKey, layerKey, plates, layers, intro])

  /* background-image, not <img>: an absolutely positioned <img> at
     width/height:100% inside the oversized layer box computed its height from
     its own intrinsic aspect ratio instead of the parent's actual height in
     this engine (2000x1906 -> 1220px against a 1128px parent, confirmed
     live), and whatever else that touched off left large stretches of these
     transform-driven layers unpainted mid-scroll. A background div has no
     replaced-element sizing algorithm to misfire. */
  const plate = (p: ParallaxPlate) => {
    const g = plateGeom(p)
    return (
      <div
        key={p.layer}
        data-parallax-layer={p.layer}
        data-parallax-plate
        className="parallax__layer-img parallax__plate"
        role={p.alt ? 'img' : undefined}
        aria-label={p.alt || undefined}
        aria-hidden={p.alt ? undefined : true}
        style={g.box}
      >
        <span className="parallax__plate-tail" style={g.tail} />
        <span className="parallax__plate-hem" style={g.hem} />
        <span className="parallax__plate-face" style={g.face} />
      </div>
    )
  }
  const deepNode = deep && (
    <div
      data-parallax-deep
      className={deepBehind ? 'parallax__deep parallax__deep--behind' : 'parallax__deep'}
    >
      {deep}
    </div>
  )

  return (
    <div
      className={['parallax', sticky && 'parallax--sticky', gate && 'parallax--gate', intro && 'parallax--intro']
        .filter(Boolean).join(' ')}
      ref={parallaxRef}
      {...(band ? { 'data-ki-band': band } : null)}
      style={{
        ...(sticky ? { '--parallax-scroll': scroll } : null),
        ...(ground ? { '--parallax-ground': ground } : null),
      } as CSSProperties}
    >
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" />
          <div data-parallax-layers className="parallax__layers">
            {/* PAINT ORDER IS THE OCCLUSION. The registry writes 1, 2, 3, 4
                for a reason: the title sits at 3 so that layer 4, the nearest
                plane, paints OVER it. Rendering every image first and the
                title after — which is what this did — puts the wordmark on
                top of the near stone, where the rising ground can never
                cover it. Behind the rock is the whole point, so the title
                goes back between the far planes and the near one. */}
            {backdrop && <div className="parallax__backdrop" style={{ background: backdrop }} />}
            {layers.map((l) => (
              <div
                key={l.layer}
                data-parallax-layer={l.layer}
                className="parallax__layer-img"
                role={l.alt ? 'img' : undefined}
                aria-label={l.alt || undefined}
                aria-hidden={l.alt ? undefined : true}
                style={{ backgroundImage: `url(${l.src})` }}
              />
            ))}
            {plates.filter((p) => p.layer === '2' || p.layer === '5').map(plate)}
            {hasTitle && (
              <div data-parallax-layer="3" className="parallax__layer-title">
                {title}
              </div>
            )}
            {deepBehind && deepNode}
            {plates.filter((p) => p.layer !== '2' && p.layer !== '5').map(plate)}
            {!deepBehind && deepNode}
            {corner && (
              <div data-parallax-corner className="parallax__corner">{corner}</div>
            )}
          </div>
          <div className="parallax__fade" />
        </div>
      </section>
      {children}
    </div>
  )
}

export default ParallaxComponent
