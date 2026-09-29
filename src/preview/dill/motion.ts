import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/* Script-driven motion of restaurantzimmerl.at (TEARDOWN Module 13, entries M1-M10, M16-M19),
   written here for React. Native scroll on every pointer: the reference runs no smooth scroller.

   The state that must exist without script (content visible, reels, stack) lives in CSS and
   in Page.tsx. This module only adds the motion branch; it is never started under
   prefers-reduced-motion, so that branch is simply the plain render. */

const isFine = () => window.matchMedia('(hover:hover) and (pointer:fine)').matches

/* M16-M19: dot pinned to the pointer, ring eased with a frame-rate independent 0.1 lerp;
   over [data-cursor="arrow"] the ring becomes the arrow disc, pressing shrinks it. */
function initCursor(root: HTMLElement): () => void {
  const ring = root.querySelector<HTMLElement>('.dl-cursor__ring')
  const dot = root.querySelector<HTMLElement>('.dl-cursor__dot')
  if (!ring || !dot || !isFine() || window.innerWidth < 768) return () => {}
  const LERP = 0.1
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const eased = { ...pointer }
  const setDotX = gsap.quickSetter(dot, 'x', 'px'), setDotY = gsap.quickSetter(dot, 'y', 'px')
  const setRingX = gsap.quickSetter(ring, 'x', 'px'), setRingY = gsap.quickSetter(ring, 'y', 'px')
  /* both start at the viewport centre, as on the reference */
  setDotX(pointer.x); setDotY(pointer.y); setRingX(eased.x); setRingY(eased.y)
  /* The reference ticks every frame forever. Here the ticker sleeps once the ring has caught the pointer
     (idle style work 60/s to 0, the lag purge of the Tréborg and Katla builds) and wakes on the next move. */
  let awake = false
  const tick = (_time: number, deltaMs: number) => {
    const k = 1 - Math.pow(1 - LERP, deltaMs * 0.06) // 0.06 frames per ms = 60fps
    eased.x += (pointer.x - eased.x) * k
    eased.y += (pointer.y - eased.y) * k
    setDotX(pointer.x); setDotY(pointer.y)
    setRingX(eased.x); setRingY(eased.y)
    if (Math.abs(pointer.x - eased.x) < 0.05 && Math.abs(pointer.y - eased.y) < 0.05) {
      eased.x = pointer.x; eased.y = pointer.y
      setRingX(eased.x); setRingY(eased.y)
      gsap.ticker.remove(tick)
      awake = false
    }
  }
  const shell = root.querySelector<HTMLElement>('.dl-cursor')
  const onMove = (e: MouseEvent) => {
    pointer.x = e.clientX; pointer.y = e.clientY
    shell?.classList.add('is-live')
    if (!awake) { awake = true; gsap.ticker.add(tick) }
  }
  window.addEventListener('mousemove', onMove, { passive: true })
  const offs: Array<() => void> = []
  root.querySelectorAll<HTMLElement>('[data-cursor="arrow"]').forEach((el) => {
    const enter = () => ring.classList.add('is-hover')
    const leave = () => { ring.classList.remove('is-hover'); ring.classList.remove('is-pressed') }
    const down = () => ring.classList.add('is-pressed')
    const up = () => ring.classList.remove('is-pressed')
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    el.addEventListener('mousedown', down)
    el.addEventListener('mouseup', up)
    offs.push(() => {
      el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave)
      el.removeEventListener('mousedown', down); el.removeEventListener('mouseup', up)
    })
  })
  return () => {
    window.removeEventListener('mousemove', onMove)
    gsap.ticker.remove(tick)
    awake = false
    offs.forEach((f) => f())
    ring.classList.remove('is-hover', 'is-pressed')
    shell?.classList.remove('is-live')
  }
}

/* M5-M10: headings and numeral labels split into characters that rise 20px and fade in, 1s power2.out,
   0.05s stagger, unmasked; they replay on every entry and rewind when the element leaves. */
function initReveals(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-dl-reveal]').forEach((el) => {
    const split = SplitText.create(el, { type: 'chars, words' })
    gsap.set(el, { opacity: 1 })
    gsap.from(split.chars, {
      y: 20,
      autoAlpha: 0,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.05,
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        toggleActions: 'restart reverse restart reverse',
      },
    })
  })
}

/* M1/M2: pictures settle from y -60 to 0 with a 3s scrub lag over the element's pass through the viewport.
   The reference measured that pass with its -60 offset applied, so the same numbers are computed here from
   the untransformed box, and the trigger is the parent, never the moving element. */
function pageTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY - ((gsap.getProperty(el, 'y') as number) || 0)
}
function initDrifts(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-dl-drift]').forEach((el) => {
    gsap.from(el, {
      y: -60,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el.parentElement,
        start: () => pageTop(el) - 60 - window.innerHeight,
        end: () => pageTop(el) - 60 + el.offsetHeight,
        toggleActions: 'restart reverse restart reverse',
        scrub: 3,
      },
    })
  })
}

/* M3/M4: the big numerals slide 60px left across their pass (3s scrub), fine pointers >= 767px only. */
function initSlides(root: HTMLElement): void {
  if (ScrollTrigger.isTouch || window.innerWidth < 767) return
  root.querySelectorAll<HTMLElement>('[data-dl-slide]').forEach((el) => {
    gsap.to(el, {
      x: -60,
      duration: 3,
      scrollTrigger: { trigger: el, toggleActions: 'restart pause reverse pause', start: 'top bottom', end: 'bottom top', scrub: 3 },
    })
  })
}

export function initDillMotion(root: HTMLElement): () => void {
  let alive = true
  const offCursor = initCursor(root)
  const ctx = gsap.context(() => {
    initDrifts(root)
    initSlides(root)
    /* H1s stay hidden (CSS, motion branch only) until the fonts are in, so the split measures the right glyphs */
    document.fonts.ready.then(() => {
      if (!alive) return
      ctx.add(() => {
        initReveals(root)
        ScrollTrigger.refresh()
      })
    })
  }, root)
  const onLoad = () => ScrollTrigger.refresh()
  window.addEventListener('load', onLoad)
  return () => {
    alive = false
    window.removeEventListener('load', onLoad)
    offCursor()
    ctx.revert()
  }
}
