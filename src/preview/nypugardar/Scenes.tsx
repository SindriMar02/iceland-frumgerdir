/**
 * Nýpugarðar — the two Kleif scroll scenes that are not the hero.
 *
 * MaskDevelop: a paragraph that develops out of the mist as it is read. A CSS
 * mask on ONE element, its --mask-position scrubbed by position (top 80% to
 * bottom 60%), so it is correct at any scroll speed and costs one style
 * recalculation on one node per frame. At rest (server HTML, reduced motion,
 * no script) the variable is unset and the mask is fully open.
 *
 * InsetBand: a full-bleed photograph that starts inset from the page edges
 * and opens to full bleed as it rises (desktop only; a phone is already edge
 * to edge). The clip lives on the IMAGE WRAPPER, never on the section, so the
 * text and every observer-driven reveal inside the band stay outside the
 * clipped box ([[intersection-observer-ignores-clipped-targets]]).
 */
import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { loadMotion, scrub } from './motion'

const MASK_CSS = `
.nyp-develop {
  -webkit-mask-image: linear-gradient(#000 calc(var(--mask-position, 100) * 1%),
    rgba(0,0,0,.9) calc((var(--mask-position, 100) + 5) * 1%),
    rgba(0,0,0,.8) calc((var(--mask-position, 100) + 10) * 1%),
    rgba(0,0,0,.6) calc((var(--mask-position, 100) + 20) * 1%),
    rgba(0,0,0,.4) calc((var(--mask-position, 100) + 30) * 1%),
    rgba(0,0,0,.2) calc((var(--mask-position, 100) + 35) * 1%),
    rgba(0,0,0,.1) calc((var(--mask-position, 100) + 40) * 1%),
    rgba(0,0,0,.1) 100%);
  mask-image: linear-gradient(#000 calc(var(--mask-position, 100) * 1%),
    rgba(0,0,0,.9) calc((var(--mask-position, 100) + 5) * 1%),
    rgba(0,0,0,.8) calc((var(--mask-position, 100) + 10) * 1%),
    rgba(0,0,0,.6) calc((var(--mask-position, 100) + 20) * 1%),
    rgba(0,0,0,.4) calc((var(--mask-position, 100) + 30) * 1%),
    rgba(0,0,0,.2) calc((var(--mask-position, 100) + 35) * 1%),
    rgba(0,0,0,.1) calc((var(--mask-position, 100) + 40) * 1%),
    rgba(0,0,0,.1) 100%);
}
`

export function MaskDevelop({
  children,
  reduced,
  className = '',
}: {
  children: ReactNode
  reduced: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced) return
    let disposed = false
    let revert: (() => void) | null = null
    loadMotion().then(({ gsap }) => {
      const el = ref.current
      if (disposed || !el) return
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { '--mask-position': -40 },
          {
            '--mask-position': 100,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 60%', scrub: scrub() },
          },
        )
      }, el)
      revert = () => ctx.revert()
    })
    return () => {
      disposed = true
      revert?.()
    }
  }, [reduced])
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MASK_CSS }} />
      <div ref={ref} className={`nyp-develop ${className}`}>
        {children}
      </div>
    </>
  )
}

export function InsetBand({
  image,
  children,
  reduced,
  className = '',
  style,
}: {
  image: ReactNode
  children: ReactNode
  reduced: boolean
  className?: string
  style?: CSSProperties
}) {
  const clipRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced) return
    let disposed = false
    let revert: (() => void) | null = null
    loadMotion().then(({ gsap }) => {
      const el = clipRef.current
      if (disposed || !el) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 769px)', () => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0rem 1.25rem 0rem 1.25rem round 2px)' },
          {
            clipPath: 'inset(0rem 0rem 0rem 0rem round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 30%', scrub: scrub() },
          },
        )
      })
      revert = () => mm.revert()
    })
    return () => {
      disposed = true
      revert?.()
    }
  }, [reduced])
  return (
    <section className={`relative ${className}`} style={style}>
      <div ref={clipRef} className="absolute inset-0 overflow-hidden">
        {image}
      </div>
      {children}
    </section>
  )
}
