/**
 * The reference's motion vocabulary, constants verbatim from juliencalot.com's
 * own unminified bundle (moussamamadou/juliencalot-public, read 2026-08-03).
 * Nothing in here is estimated — see the MOTION SYSTEM section of the
 * juliencalot-design-system memory for the sourced table.
 */
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

/* ---- reveal cues: the three beats every entrance animation hangs off.
 *      Fired on first paint and on every view change. There is no loading
 *      screen — the page reveals itself directly. ---- */
export const REVEAL_START = 'sbb:reveal:start'
export const REVEAL_MIDDLE = 'sbb:reveal:middle'
export const REVEAL_END = 'sbb:reveal:end'

/* ---- Lenis (inner pages) ---- */
export const LENIS = { lerp: 0.075, wheelMultiplier: 0.85, touchMultiplier: 1.5 }

/* ---- homepage slider physics ---- */
export const SLIDER = {
  scrollLerp: 0.085,
  friction: 0.92,
  acceleration: 0.035,
  maxVelocity: 0.8,
  minVelocityThreshold: 5e-4,
  snapThreshold: 0.01,
  snapLerp: 0.075,
  snapDistance: 0.5,
  wheelMultiplier: 1.25,
  touchMultiplier: 10,
  hoverWipe: 0.45,
}

/* ---- grid image reveal: yPercent 200 · 1.75s · expo.out · center-out row delay ---- */
export const GRID_REVEAL = { yPercent: 200, duration: 1.75, ease: 'expo.out', each: 0.075 }
export const gridDelay = (i: number, mobile: boolean) =>
  mobile ? GRID_REVEAL.each * (Math.floor(i / 2) + 1) : GRID_REVEAL.each * Math.abs((i % 5) - 2)

/* ---- list image reveal ---- */
export const LIST_REVEAL = { yPercent: 100, duration: 1.5, stagger: 0.1, ease: 'expo.out' }

/* ---- product page ---- */
export const PRODUCT_IMG = { yPercent: 50, duration: 1, stagger: 0.05, ease: 'quart.out' }

/* ---- text reveal: SplitText lines + masks ---- */
export const TEXT_REVEAL = { yPercent: 100, maskFrom: 200, duration: 1, stagger: 0.05, ease: 'quart.out' }

export const isMobile = () => window.innerWidth < 768
/** A real touch device, not just a narrow window. Used to keep Lenis off phones. */
export const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** SplitText line-mask reveal, the reference's exact recipe:
 *  lines from {yPercent:100, opacity:0} while their masks come from yPercent:200.
 *  Returns a paused timeline; caller plays it on a loader event. */
export function splitLineReveal(els: Element[], delay = 0): gsap.core.Timeline | null {
  if (!els.length) return null
  const tl = gsap.timeline({ paused: true, delay })
  if (reduceMotion()) {
    tl.from(els, { opacity: 0, duration: 0.3 })
    return tl
  }
  els.forEach((el) => {
    // autoSplit needs fonts settled; this runs post-mount which is close enough
    const split = SplitText.create(el, { type: 'lines', linesClass: 'line', mask: 'lines' })
    tl.from(
      split.lines,
      {
        duration: TEXT_REVEAL.duration,
        yPercent: TEXT_REVEAL.yPercent,
        opacity: 0,
        stagger: TEXT_REVEAL.stagger,
        ease: TEXT_REVEAL.ease,
        willChange: 'transform',
      },
      0,
    ).fromTo(
      split.masks,
      { yPercent: TEXT_REVEAL.maskFrom },
      {
        yPercent: 0,
        stagger: TEXT_REVEAL.stagger,
        duration: TEXT_REVEAL.duration,
        ease: TEXT_REVEAL.ease,
        willChange: 'transform',
      },
      0,
    )
  })
  return tl
}
