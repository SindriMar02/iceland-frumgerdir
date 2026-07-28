import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { STAFF } from './data'

const back = STAFF.find((s) => s.name === 'Sigrún Matthíasdóttir')!
const mid = STAFF.find((s) => s.name === 'Jón Þór Brandsson')!

/**
 * DEVICE 6 — mouse-parallax hero layers (mandated), depths 10/20/40.
 * Desktop with a fine pointer: three real-photo layers quickTo-follow the
 * cursor, expo.out, distance scaled by depth (max px drift). Touch/coarse
 * pointers: the same three layers drift on `yPercent` tied to scroll
 * instead. Both branches are gated out entirely under
 * prefers-reduced-motion, so the layers simply sit at their CSS rest
 * position — fully visible, nothing to freeze mid-animation.
 */
export function HeroVisual() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const backRef = useRef<HTMLDivElement | null>(null)
  const midRef = useRef<HTMLDivElement | null>(null)
  const frontRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const layers = [
      { el: backRef.current, depth: 40 },
      { el: midRef.current, depth: 20 },
      { el: frontRef.current, depth: 10 },
    ].filter((l): l is { el: HTMLDivElement; depth: number } => !!l.el)

    const mm = gsap.matchMedia()

    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const quickies = layers.map(({ el, depth }) => ({
        x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'expo.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'expo.out' }),
        depth,
      }))

      const onMove = (e: PointerEvent) => {
        const rect = wrap.getBoundingClientRect()
        const nx = (e.clientX - rect.left) / rect.width - 0.5
        const ny = (e.clientY - rect.top) / rect.height - 0.5
        quickies.forEach(({ x, y, depth }) => {
          x(nx * depth)
          y(ny * depth)
        })
      }
      const onLeave = () =>
        quickies.forEach(({ x, y }) => {
          x(0)
          y(0)
        })

      wrap.addEventListener('pointermove', onMove)
      wrap.addEventListener('pointerleave', onLeave)
      return () => {
        wrap.removeEventListener('pointermove', onMove)
        wrap.removeEventListener('pointerleave', onLeave)
      }
    })

    mm.add('(hover: none), (pointer: coarse)', () => {
      const ctx = gsap.context(() => {
        layers.forEach(({ el, depth }) => {
          gsap.to(el, {
            yPercent: depth / 5,
            ease: 'none',
            scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      }, wrap)
      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={wrapRef} className="sjr-hero-visual" style={{ aspectRatio: '4 / 5' }}>
      <div ref={backRef} className="sjr-hero-layer sjr-hero-layer-back">
        <img
          src={back.photo}
          alt={`${back.name}, sjúkraþjálfari hjá Sjúkraþjálfaranum, eitt af ${STAFF.length} andlitum teymisins.`}
          loading="eager"
          decoding="async"
          {...{ fetchpriority: 'high' as const }}
        />
      </div>
      <div ref={midRef} className="sjr-hero-layer sjr-hero-layer-mid">
        <img
          src={mid.photo}
          alt={`${mid.name}, sjúkraþjálfari hjá Sjúkraþjálfaranum, eitt af ${STAFF.length} andlitum teymisins.`}
          loading="eager"
          decoding="async"
        />
      </div>
      <div ref={frontRef} className="sjr-hero-layer sjr-hero-layer-front">
        <span aria-hidden="true">
          <span className="sjr-hero-badge-count">{STAFF.length}</span>
          <span className="sjr-hero-badge-label">þjálfarar</span>
        </span>
        <span className="sr-only">{STAFF.length} nafngreindir sjúkraþjálfarar starfa hjá Sjúkraþjálfaranum.</span>
      </div>
    </div>
  )
}
