import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reduced } from './primitives'
import { ACCENT, DISPLAY, INK } from './tokens'

/**
 * DEVICE 3 — the direction-reversing marquee (mandated).
 *
 * Adapted from thegrind.nl's device 5 (thegrind-teardown-mjolnir, "motion
 * inventory"): the track runs as one continuous GSAP tween (xPercent -50,
 * repeat -1, ease none) over a doubled content list, and a ScrollTrigger on
 * the marquee's own viewport window flips the tween's `timeScale` sign to
 * match live scroll direction. Scroll up and the strip visibly reverses.
 * The whole page only carries this one marquee (skill rule: max one per
 * page), used here to give the service list a fast, scannable pass before
 * the honest per-service cards underneath.
 */
export function Marquee({ items }: { items: string[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const track = trackRef.current
    const wrap = wrapRef.current
    if (!track || !wrap || reduced()) return

    const ctx = gsap.context(() => {
      const width = track.scrollWidth / 2
      const duration = Math.max(18, width / 46)
      const tween = gsap.to(track, { xPercent: -50, duration, ease: 'none', repeat: -1 })

      ScrollTrigger.create({
        trigger: wrap,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => tween.timeScale(self.direction === 1 ? 1 : -1),
      })
    }, wrap)

    return () => ctx.revert()
  }, [])

  const doubled = [...items, ...items]

  return (
    <div ref={wrapRef} className="overflow-hidden" aria-hidden="true">
      <div ref={trackRef} className="sjr-marquee-track">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 whitespace-nowrap px-6"
            style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.6rem, 5vw, 3.2rem)', color: INK }}
          >
            {item}
            <span style={{ margin: '0 1.5rem', color: ACCENT }} aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
