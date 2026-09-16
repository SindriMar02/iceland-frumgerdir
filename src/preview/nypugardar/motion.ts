/**
 * Nýpugarðar — the one door to GSAP.
 *
 * GSAP and ScrollTrigger are imported dynamically, from effects only, so the
 * server render never touches them and a visitor under prefers-reduced-motion
 * never downloads them. Every scene on the landing page (hero fog, manifesto
 * develop, glacier band, route line) and the Lenis bridge call loadMotion();
 * the module cache makes it one fetch and one registration.
 *
 * iOS guards, from the Kleif momentum investigation ([[ios-momentum-killers]]):
 * ignoreMobileResize, so the URL bar collapsing mid-fling never triggers a
 * refresh that kills momentum; and a numeric scrub on touch, because a `true`
 * scrub steps visibly on WebKit, where scroll events arrive out of step with
 * rendering. Fine pointers keep `true`: Lenis already smooths them.
 */
import type { gsap as GsapType } from 'gsap'
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'

export type Motion = { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType }

let loading: Promise<Motion> | null = null

export function loadMotion(): Promise<Motion> {
  if (!loading) {
    loading = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
      const gsap = g.gsap
      const ScrollTrigger = st.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)
      ScrollTrigger.config({ ignoreMobileResize: true })
      return { gsap, ScrollTrigger }
    })
  }
  return loading
}

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches

export const scrub = () => (isTouch() ? 0.35 : true)

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
