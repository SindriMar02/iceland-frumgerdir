/**
 * THE YOKE — KIDKA's signature moment.
 *
 * An Icelandic lopapeysa yoke is knitted IN THE ROUND: the pattern grows in
 * concentric rings out from the neck opening, and the stitch count rises as
 * the radius grows. This canvas does exactly that, driven by scroll — you are
 * watching the garment being made, which is the one thing KIDKA can honestly
 * claim that no reseller can.
 *
 * Why canvas and not SVG/DOM: a full yoke is ~4,000 stitches. As DOM nodes
 * that is a layout disaster; on a 2D canvas it redraws in well under a frame,
 * and only when the scroll value actually changes (no idle rAF, no battery
 * drain).
 *
 * Robustness rules this file follows (hard-won in this project):
 *  - Nothing is gated on scroll alone. A time-based intro draws the first
 *    third of the yoke on mount, so the hero is never an empty canvas even if
 *    the visitor never scrolls or the tab is throttled.
 *  - prefers-reduced-motion renders the finished yoke immediately, no intro,
 *    no scroll coupling.
 *  - The scroll handler is synchronous + passive and reads the wrapper rect,
 *    the same pattern as the Caves of Hella descent.
 */
import { useEffect, useRef } from 'react'
import { CHART_H, CHART_W, chartCell } from './data'

const INK = '#16141A'
const DYE = '#E0A100'
const GHOST = 'rgba(22,20,26,0.085)'
/** pattern repeats around the yoke — constant, like a real chart */
const REPEATS = 8

function drawYoke(ctx: CanvasRenderingContext2D, size: number, p: number) {
  ctx.clearRect(0, 0, size, size)
  const cx = size / 2
  const cy = size / 2
  const maxR = (size / 2) * 0.98
  const r0 = maxR * 0.15 // the neck opening
  const rings = 30
  const ringH = (maxR - r0) / rings
  const revealed = p * rings
  // gentle turn as it knits, so the pattern never sits static
  const rot = -Math.PI / 2 + p * 0.22

  for (let i = 0; i < rings; i++) {
    if (i > revealed) break
    const rIn = r0 + i * ringH
    const rOut = rIn + ringH * 0.84
    // A real yoke keeps the SAME number of pattern repeats all the way up and
    // lets each stitch grow wider as the radius grows — that is what makes the
    // motif read as continuous radial wedges. Varying the repeat count per
    // ring (the first attempt) scattered the pattern into noise.
    const n = REPEATS * CHART_W
    const frontier = revealed - i
    const count = frontier >= 1 ? n : Math.floor(n * frontier)
    const row = i % CHART_H
    const band = Math.floor(i / CHART_H) % 2 === 1

    for (let j = 0; j < count; j++) {
      const on = chartCell(row, j % CHART_W)
      const a0 = rot + (j / n) * Math.PI * 2
      const a1 = rot + ((j + 0.88) / n) * Math.PI * 2
      ctx.beginPath()
      ctx.arc(cx, cy, rIn, a0, a1)
      ctx.arc(cx, cy, rOut, a1, a0, true)
      ctx.closePath()
      ctx.fillStyle = on ? (band ? DYE : INK) : GHOST
      ctx.fill()
    }
  }
}

/** Reads its OWN scroll progress off the pinned wrapper. An earlier version
 *  took the value from a ref the parent filled in, which silently lagged: in
 *  React the child's effect registers its scroll listener BEFORE the parent's,
 *  so every event rendered with the previous frame's number. Owning the
 *  measurement removes the ordering hazard completely. */
export function Yoke({ wrapRef }: { wrapRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let size = 0
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const box = canvas.parentElement?.getBoundingClientRect()
      const css = Math.max(240, Math.min(box?.width ?? 520, box?.height ?? 520))
      size = css
      canvas.width = Math.round(css * dpr)
      canvas.height = Math.round(css * dpr)
      canvas.style.width = `${css}px`
      canvas.style.height = `${css}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fit()

    // Time-based intro so the yoke is never blank before the first scroll.
    let intro = reduce ? 1 : 0
    let raf = 0
    let last = -1

    const scrollP = () => {
      const el = wrapRef.current
      if (!el) return 0
      const r = el.getBoundingClientRect()
      const span = r.height - window.innerHeight
      return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0
    }

    const render = () => {
      const p = reduce ? 1 : Math.max(intro, scrollP())
      if (p !== last) {
        drawYoke(ctx, size, p)
        last = p
      }
    }

    if (!reduce) {
      const start = performance.now()
      const DURATION = 1500
      const step = (t: number) => {
        const k = Math.min(1, (t - start) / DURATION)
        // ease-out so the first rings land quickly, then settle
        intro = (1 - Math.pow(1 - k, 3)) * 0.44
        render()
        if (k < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    render()

    // Drive from rAF, not the scroll event. Lenis (smooth scroll) swallows
    // native `scroll` events on this page — measured: window.scrollY moves
    // while zero scroll events fire — so a scroll-driven canvas would never
    // update. rAF is what Lenis itself runs on, and render() early-returns
    // when the value has not changed, so an idle frame costs almost nothing.
    // An IntersectionObserver stops the loop entirely once the hero is off
    // screen, so there is no permanent background loop.
    let loop = 0
    let inView = true
    const tick = () => {
      render()
      loop = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !inView) {
            inView = true
            loop = requestAnimationFrame(tick)
          } else if (!e.isIntersecting && inView) {
            inView = false
            cancelAnimationFrame(loop)
          }
        })
      },
      { threshold: 0 },
    )
    if (wrapRef.current) io.observe(wrapRef.current)
    if (!reduce) loop = requestAnimationFrame(tick)

    const onScroll = () => render()
    const onResize = () => {
      fit()
      last = -1
      render()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    // Failsafe: if the intro rAF never runs (throttled tab), draw anyway.
    const failsafe = window.setTimeout(() => {
      if (last < 0) {
        intro = 0.44
        render()
      }
    }, 1800)

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(loop)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(failsafe)
    }
  }, [wrapRef])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="An Icelandic lopapeysa yoke pattern, knitted in the round from the neck outward"
    />
  )
}
