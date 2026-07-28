import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * THE KENNEL-DOOR ARCH — devices 1, 2 and 4 of the Amour Liquide transplant
 * (see amourliquide-teardown.md, mandated in BRIEF-hundahotelid.md).
 *
 * 1. The frame is clipped by an SVG clipPath in objectBoundingBox units,
 *    referenced as clip-path: url(#hh-arch) / url(#hh-arch-lg), swapped at
 *    992px via the --hh-clip custom property set on .hh-root (hh.css).
 * 2. Inside it, an oversized image (top:-4%; bottom:-4%, 108% height) that
 *    GSAP scrubs with a small negative-parallax drift so the photo can
 *    never reveal a gap at the mask edge, reversible with scroll direction.
 * 4. A small warm-tone caption sits directly under the frame at a literal
 *    12px / 16px (ml/mt) rhythm, never overlaid on the photo itself.
 */
export function ArchFrame({
  src,
  alt,
  caption,
  aspect = '4 / 5',
  eager = false,
  className = '',
}: {
  src: string
  alt: string
  caption?: string
  aspect?: string
  eager?: boolean
  className?: string
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
            start: 'top bottom',
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
    <figure className={className}>
      <div ref={frameRef} className="hh-frame" style={{ aspectRatio: aspect }}>
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          {...(eager ? { fetchpriority: 'high' } : {})}
          className="hh-frame__img"
        />
      </div>
      {caption ? <figcaption className="hh-cap">{caption}</figcaption> : null}
    </figure>
  )
}
