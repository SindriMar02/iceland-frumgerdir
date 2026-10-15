import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/* The motion branch of /preview/prentmidlun (copied from /preview/hudflur, the React port of Live-up). Behaviour from the live-up.co.jp clean-room rebuild
   (sndr-teardowns PR #3, js/app.js, module numbers in comments). Never started under
   prefers-reduced-motion: the plain render in styles.ts is that branch.

   Two deliberate departures from the reference:
   - live-up fires its masked reveals once from an IntersectionObserver on a 1.2s timer. Here each mask is
     tied to scroll position over a short band (memory: scroll-reveals-must-be-position-tied), so a fast
     flick can never outrun a heading that is still below its mask.
   - live-up runs Lenis everywhere with touch left native. Here Lenis is never constructed on a touch
     device at all (memory: lenis-mobile-damage). */

const isTouch = () => matchMedia('(hover: none) and (pointer: coarse)').matches
const isFine = () => matchMedia('(hover: hover) and (pointer: fine)').matches
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

let pageLenis: Lenis | null = null
/* anchor jumps go through Lenis when it runs (live-up M1: offset -20, duration 1, easeOutCubic) */
export function scrollToHash(hash: string): boolean {
  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return false
  if (pageLenis) pageLenis.scrollTo(target, { offset: -20, duration: 1, easing: easeOutCubic })
  else target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  return true
}

/* M5: the hero cursor lens was removed 2026-10-15 (Sindri: the hover motion on the landing image went). */

export function initPrentMotion(root: HTMLElement): () => void {
  const offs: Array<() => void> = []
  const mm = gsap.matchMedia()
  mm.add({ wide: '(min-width: 769px)', narrow: '(max-width: 768px)' }, (ctx) => {
    const { wide } = ctx.conditions as { wide: boolean; narrow: boolean }
    const q = gsap.utils.selector(root)

    const lenis = isFine() && !isTouch() ? new Lenis({ duration: 1, easing: easeOutCubic, smoothWheel: true, wheelMultiplier: 1 }) : null
    let tick: ((t: number) => void) | null = null
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      tick = (t: number) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      pageLenis = lenis
    }

    /* M4 masked lines, position-tied: 108% to 0 while the line crosses the lower quarter */
    ;(q('[data-pm-mask] > span') as HTMLElement[]).forEach((inner) => {
      const line = inner.parentElement!
      gsap.fromTo(inner, { yPercent: 108 }, {
        yPercent: 0, ease: 'expo.out',
        scrollTrigger: {
          trigger: line, start: 'top bottom', end: 'top 72%', scrub: 0.4,
          onLeave: (self) => { self.animation?.progress(1); self.kill(); gsap.set(inner, { clearProps: 'transform' }) },
        },
      })
    })
    ;(q('[data-pm-fade]') as HTMLElement[]).forEach((el) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, ease: 'power2.out',
        scrollTrigger: {
          trigger: el, start: 'top-=24 bottom', end: 'top-=24 78%', scrub: 0.4,
          onLeave: (self) => { self.animation?.progress(1); self.kill(); gsap.set(el, { clearProps: 'opacity,visibility,transform' }) },
        },
      })
    })

    /* M5 hero layer (desktop only, as live-up): the title lifts away; the photo belongs to the lens */
    if (wide) {
      const hero = q('.pm-hero')[0] as HTMLElement | undefined
      if (hero) {
        gsap.to(q('.pm-hero__title'), { yPercent: -18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      }
    }
    /* the cursor lens on the hero photo was removed 2026-10-15 (Sindri: the hover motion on the landing image went) */

    /* M6 drift: each process photo slides inside its frame over the frame's pass */
    ;(q('.pm-drift img') as HTMLElement[]).forEach((im, i) => {
      gsap.fromTo(im, { yPercent: -7 - (i % 2) * 2 }, {
        yPercent: 7 + (i % 2) * 2, ease: 'none',
        scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })

    /* work cards: the card never moves (it is its own trigger), the picture settles inside it */
    ;(q('.pm-work') as HTMLElement[]).forEach((card) => {
      const im = card.querySelector('img')
      if (!im) return
      gsap.fromTo(im, { autoAlpha: 0, scale: 1.1 }, {
        autoAlpha: 1, scale: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: card, start: 'top bottom', end: 'top 82%', scrub: 0.4,
          onLeave: (self) => { self.animation?.progress(1); self.kill(); gsap.set(im, { clearProps: 'opacity,visibility,transform' }) },
        },
      })
    })

    const mail = q('.pm-mail')[0] as HTMLElement | undefined
    if (mail) gsap.fromTo(q('.pm-mail__rule'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: mail, start: 'top bottom', end: 'top 60%', scrub: 0.4 } })

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
      if (pageLenis === lenis) pageLenis = null
      offs.splice(0).forEach((f) => f())
    }
  })
  return () => { mm.revert(); offs.splice(0).forEach((f) => f()) }
}

/* the works grid changes height when it re-deals: every later trigger has to be measured again */
export function refreshTriggers(): void {
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

export function topNow(): void {
  if (pageLenis) pageLenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}
