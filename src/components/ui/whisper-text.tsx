'use client'

/**
 * 21st.dev WhisperText — a headline that arrives one word at a time.
 *
 * Two changes from the registry source, both forced by this codebase:
 *
 *   · useLayoutEffect -> useEffect. Every route here is prerendered through
 *     renderToString before it is ever hydrated, and useLayoutEffect has no
 *     layout to read on the server; React warns on every build.
 *   · a MANAGED mode. The registry gives each instance its own ScrollTrigger
 *     at "top 90%", which is right for a headline sitting in the flow of the
 *     page and wrong for both of the places this site needs one: they are
 *     inside PINNED sections, where the trigger element is on screen from the
 *     moment the pin engages and "top 90%" fires while the visitor is still
 *     looking at her kitchen. Managed, the component only splits the words and
 *     marks them; the parent's own scrubbed timeline animates them at the
 *     point in the descent where the copy actually belongs. The visual is the
 *     registry's either way — words, staggered, opacity with a small offset.
 */
import { useEffect, useRef, type ElementType } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface WhisperTextProps {
  text: string
  /** keeps the heading level where the document outline needs it */
  as?: ElementType
  className?: string
  /** ms between words */
  delay?: number
  duration?: number
  x?: number
  y?: number
  triggerStart?: string
  /** let a parent timeline drive the words — see the note above */
  managed?: boolean
}

export function WhisperText({
  text,
  as: Tag = 'div',
  className = '',
  delay = 80,
  duration = 0.4,
  x = 0,
  y = 0,
  triggerStart = 'top 90%',
  managed = false,
}: WhisperTextProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (managed) return
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>('[data-parallax-word]')
      gsap.set(targets, { yPercent: 100, y: 0, x })
      gsap.to(targets, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: triggerStart,
          toggleActions: 'play none none none',
          once: true,
        },
        yPercent: 0, y: 0, x: 0, duration, ease: 'power2.out',
        stagger: delay / 1000,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [text, delay, duration, x, y, triggerStart, managed])

  return (
    <Tag ref={containerRef} className={`ki-whisper ${className}`}>
      {/* Each word is a MASK with the word inside it. The registry fades the
          words in, and a fade is the one thing that cannot be driven by a
          scrub here: opacity near a tween's edge flickers, and the visibility
          that came with it flickered harder. A word that rises out of its own
          window has no opacity at all, so there is nothing to flicker — and
          it is the gesture the rest of this site already opens on. */}
      {text.split(' ').map((word, i) => (
        <span key={i} data-word>
          <i data-parallax-word>{word}</i>
        </span>
      ))}
    </Tag>
  )
}

export default WhisperText
