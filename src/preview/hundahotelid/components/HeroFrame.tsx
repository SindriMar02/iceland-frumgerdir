import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * THE HERO ARCH — device 1, full-bleed variant (D-FIX-1). Same SVG
 * clip-path + oversized-drift-image grammar as ArchFrame (see that file's
 * header comment), but sized by an explicit viewport height instead of a
 * fixed aspect-ratio, so the real photograph owns the first screen instead
 * of sharing it with a text column. Headline/CTA content is passed as
 * `children` and sits INSIDE the frame, over a bottom-anchored gradient
 * scrim, so the type sits in relation to the image rather than beside it.
 */
export function HeroFrame({
  src,
  alt,
  children,
}: {
  src: string
  alt: string
  children: ReactNode
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!frameRef.current || !imgRef.current) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.fromTo(
        imgRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: frameRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      )
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={frameRef} className="hh-hero__frame">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="eager"
        className="hh-frame__img"
        {...{ fetchpriority: 'high' }}
      />
      <div className="hh-hero__scrim" aria-hidden="true" />
      <div className="hh-hero__content">{children}</div>
    </div>
  )
}
