/**
 * Motion primitives for the Rakararnir page.
 *
 * Deliberately NOT Lenis and NOT GSAP pinning. This project's ledger records
 * that a continuous rAF loop wedges the in-app browser pane's screenshots, and
 * that scroll-jacked or pinned heroes read to clients as "the page is stuck".
 * Everything here is a passive scroll listener writing custom properties, plus
 * IntersectionObserver reveals driven by CSS transitions, which both ship
 * smoothly and can be probed in headless Chrome.
 *
 * The one hard performance rule: every rect READ happens before every style
 * WRITE in a frame, otherwise each write invalidates layout and the next read
 * forces a synchronous reflow, once per element per frame.
 */

export type Cleanup = () => void

/**
 * Scroll-linked parallax. Each `[data-par]` element gets `--py`, a pixel offset
 * derived from how far its centre sits from the viewport centre, scaled by
 * `data-par` (a strength multiplier). Reversible and scrubbed, so scrolling
 * back up genuinely runs it backwards rather than replaying an entrance.
 */
export function initParallax(root: HTMLElement, reduce: boolean): Cleanup {
  if (reduce) return () => {}
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-par]'))
  if (!nodes.length) return () => {}

  let queued = false
  const apply = () => {
    queued = false
    const vh = window.innerHeight
    // READ every rect first
    const reads = nodes.map((el) => {
      const r = el.getBoundingClientRect()
      return { el, mid: r.top + r.height / 2, visible: r.bottom > -200 && r.top < vh + 200 }
    })
    // THEN write
    for (const { el, mid, visible } of reads) {
      if (!visible) continue
      const strength = Number(el.dataset.par || '10')
      const offset = ((mid - vh / 2) / vh) * strength
      el.style.setProperty('--py', offset.toFixed(2))
    }
  }
  const onScroll = () => {
    if (queued) return
    queued = true
    apply()
  }
  apply()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', apply)
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', apply)
  }
}

/**
 * Reveals. Marks `[data-rv]` shown as it enters. Under reduced motion every
 * target is marked immediately so nothing is ever gated behind an animation
 * that will not run.
 */
export function initReveals(root: HTMLElement, reduce: boolean): Cleanup {
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-rv]'))
  if (reduce) {
    targets.forEach((el) => el.setAttribute('data-shown', 'true'))
    return () => {}
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.setAttribute('data-shown', 'true')
        io.unobserve(e.target)
      }),
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  )
  targets.forEach((el) => io.observe(el))
  return () => io.disconnect()
}

/**
 * Count-up on a real number. Uses a timeout failsafe as well as rAF, because
 * a backgrounded tab throttles rAF and would otherwise leave the figure stuck
 * at its start value forever.
 */
export function initCountUp(root: HTMLElement, reduce: boolean): Cleanup {
  const el = root.querySelector<HTMLElement>('[data-count]')
  if (!el) return () => {}
  const target = Number(el.dataset.count || '0')
  if (reduce) {
    el.textContent = String(target)
    return () => {}
  }
  let raf = 0
  let done = false
  const settle = () => {
    if (done) return
    done = true
    el.textContent = String(target)
  }
  const failsafe = window.setTimeout(settle, 2600)
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting || done) return
      io.disconnect()
      const start = performance.now()
      const dur = 1100
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur)
        // ease-out quart: fast off the mark, long settle
        const e = 1 - Math.pow(1 - p, 4)
        el.textContent = String(Math.round(target * e))
        if (p < 1) raf = requestAnimationFrame(tick)
        else settle()
      }
      raf = requestAnimationFrame(tick)
    },
    { threshold: 0.5 },
  )
  io.observe(el)
  return () => {
    cancelAnimationFrame(raf)
    window.clearTimeout(failsafe)
    io.disconnect()
  }
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const remap = (v: number, a: number, b: number) => clamp01((v - a) / (b - a))
/** ease-in-out quad. Slow to leave, slow to arrive, quick through the middle. */
const ease = (v: number) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2)

/**
 * The pinned opening. Drives three properties off one scroll position, all
 * position-linked rather than played, so scrolling back up genuinely runs the
 * dissolve backwards instead of replaying an entrance:
 *
 *   --rk-t  raw progress through the stage        0 .. 1
 *   --rk-d  the dissolve, eased                   0 at t .06, 1 at t .72
 *   --rk-s  the caption settling in afterwards    0 at t .74, 1 at t .93
 *
 * Under reduced motion the stage collapses to a single screen with the
 * photograph already arrived, so nothing is gated behind a scrub that the
 * user has asked not to run.
 */
export function initStage(stage: HTMLElement, reduce: boolean): Cleanup {
  const pin = stage.querySelector<HTMLElement>('[data-pin]')
  if (!pin) return () => {}
  if (reduce) {
    pin.style.setProperty('--rk-d', '1')
    pin.style.setProperty('--rk-s', '1')
    return () => {}
  }
  let queued = false
  const apply = () => {
    queued = false
    // READ
    const r = stage.getBoundingClientRect()
    const travel = r.height - window.innerHeight
    // THEN write
    const t = travel > 0 ? clamp01(-r.top / travel) : 0
    pin.style.setProperty('--rk-t', t.toFixed(4))
    pin.style.setProperty('--rk-d', ease(remap(t, 0.06, 0.72)).toFixed(4))
    pin.style.setProperty('--rk-s', remap(t, 0.74, 0.93).toFixed(4))
  }
  const onScroll = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(apply)
  }
  apply()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
}

/**
 * Whole-page scroll progress, written to `--rk-p` (0..1) on one fixed rail
 * element. Reduced motion hides the rail in CSS rather than branching here,
 * since a moving fill bar is pure motion feedback with no other function.
 */
export function initProgress(el: HTMLElement, reduce: boolean): Cleanup {
  if (reduce) return () => {}
  let queued = false
  const apply = () => {
    queued = false
    const doc = document.documentElement
    const max = doc.scrollHeight - window.innerHeight
    const p = max > 0 ? clamp01(window.scrollY / max) : 0
    el.style.setProperty('--rk-p', p.toFixed(4))
  }
  const onScroll = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(apply)
  }
  apply()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', apply)
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', apply)
  }
}

/**
 * The corner drawing's draw-in: `[data-sweep]` elements get `--sv` (0..1) as
 * they cross a band low in the viewport, driving a CSS mask sweep. Scrubbed
 * and reversible like the parallax above, not a one-shot IntersectionObserver
 * toggle, so scrolling back up genuinely un-draws it.
 */
export function initSweep(root: HTMLElement, reduce: boolean): Cleanup {
  if (reduce) return () => {}
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-sweep]'))
  if (!nodes.length) return () => {}

  let queued = false
  const apply = () => {
    queued = false
    const vh = window.innerHeight
    // READ every rect first
    const reads = nodes.map((el) => ({ el, top: el.getBoundingClientRect().top }))
    // THEN write
    for (const { el, top } of reads) {
      const v = clamp01((vh * 0.85 - top) / (vh * 0.55))
      el.style.setProperty('--sv', v.toFixed(4))
    }
  }
  const onScroll = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(apply)
  }
  apply()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', apply)
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', apply)
  }
}

/** Splits a string into words wrapped for masked, staggered line reveals. */
export function words(text: string): { w: string; i: number }[] {
  return text.split(' ').map((w, i) => ({ w, i }))
}
