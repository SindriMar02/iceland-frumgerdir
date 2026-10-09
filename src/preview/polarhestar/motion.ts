/**
 * Desktop motion layer, ported from the Suðurverk system (CargoKite motion map):
 * Lenis smooth scroll (lerp .1) synced to ScrollTrigger, and a scrubbed hero
 * parallax. Everything here runs ONLY on `(min-width: 992px) and (hover: hover)
 * and (pointer: fine)` without reduced motion — phones and tablets keep native
 * scrolling and the CSS reveals, exactly as Suðurverk ships it. Libraries load
 * lazily, so touch devices never download them.
 */
import { useEffect, type RefObject } from 'react'

const DESKTOP = '(min-width: 992px) and (hover: hover) and (pointer: fine)'
const REDUCE = '(prefers-reduced-motion: reduce)'
const wants = () => window.matchMedia(DESKTOP).matches && !window.matchMedia(REDUCE).matches

type GsapModules = {
  gsap: typeof import('gsap').gsap
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
}
let mods: Promise<GsapModules> | undefined
const loadGsap = () =>
  (mods ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, s]) => {
    g.gsap.registerPlugin(s.ScrollTrigger)
    return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger }
  }))

/** Lenis smooth scroll for the page's lifetime (desktop, fine pointer only). */
export function useSmoothScroll() {
  useEffect(() => {
    if (!wants()) return
    let live = true
    let stop: (() => void) | undefined
    Promise.all([loadGsap(), import('lenis')]).then(([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
      if (!live) return
      const lenis = new Lenis({ lerp: 0.1, anchors: true })
      document.documentElement.classList.add('lenis')
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (t: number) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      // in-page hash jumps (nav, "Book a ride") go through Lenis so they stay smooth
      const onHash = () => {
        const el = location.hash && document.querySelector<HTMLElement>(location.hash)
        if (el) lenis.scrollTo(el, { offset: -80 })
      }
      window.addEventListener('hashchange', onHash)
      stop = () => {
        window.removeEventListener('hashchange', onHash)
        gsap.ticker.remove(tick)
        lenis.destroy()
        document.documentElement.classList.remove('lenis')
      }
    })
    return () => {
      live = false
      stop?.()
    }
  }, [])
}

/**
 * Hero parallax, scrubbed over the first 700px: the photo drifts down a
 * little, the copy lifts away faster (Suðurverk: field 15 / copy -28 / photo 8).
 * `media` must be a wrapper around the <img>, never the image itself — the
 * image carries its own CSS Ken Burns transform.
 */
export function useHeroParallax(hero: RefObject<HTMLElement | null>, media: string, copy: string) {
  useEffect(() => {
    const root = hero.current
    if (!root || !wants()) return
    let live = true
    let kill: (() => void) | undefined
    loadGsap().then(({ gsap }) => {
      if (!live) return
      const ctx = gsap.context(() => {
        const st = { trigger: root, start: 'top top', end: '+=700', scrub: true }
        gsap.to(media, { yPercent: 8, ease: 'none', scrollTrigger: st })
        gsap.to(copy, { yPercent: -28, opacity: 0.35, ease: 'none', scrollTrigger: st })
      }, root)
      kill = () => ctx.revert()
    })
    return () => {
      live = false
      kill?.()
    }
  }, [hero, media, copy])
}

/**
 * Realevate's category hero: the photo frame grows from an inset card to
 * full-bleed as you scroll into the page. Scrubbed, desktop only; elsewhere
 * the CSS leaves it full-bleed from the start.
 */
export function useGrowingHero(hero: RefObject<HTMLElement | null>, frame: string) {
  useEffect(() => {
    const root = hero.current
    if (!root || !wants()) return
    let live = true
    let kill: (() => void) | undefined
    loadGsap().then(({ gsap }) => {
      if (!live) return
      const ctx = gsap.context(() => {
        gsap.fromTo(
          frame,
          { clipPath: 'inset(14% 10% 10% 10% round 28px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: '+=520', scrub: 0.6 } },
        )
      }, root)
      kill = () => ctx.revert()
    })
    return () => {
      live = false
      kill?.()
    }
  }, [hero, frame])
}
