import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * ScrollStack — cards that pin and stack into a deck as the page scrolls,
 * each earlier card scaling down behind the next. A faithful port of the
 * react-bits ScrollStack pin+scale algorithm, but driven by a synchronous
 * passive window-scroll listener instead of Lenis + requestAnimationFrame —
 * so it never hijacks the page's scroll (no conflict with other scroll-driven
 * sections), stays smooth, and respects prefers-reduced-motion.
 *
 * Usage:
 *   <ScrollStack>
 *     <ScrollStackItem>…card…</ScrollStackItem>
 *     <ScrollStackItem>…card…</ScrollStackItem>
 *   </ScrollStack>
 */

export function ScrollStackItem({
  children,
  itemClassName = '',
}: {
  children: ReactNode
  itemClassName?: string
}) {
  return <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
}

interface ScrollStackProps {
  children: ReactNode
  className?: string
  /** Flow gap between cards (px) — gives each card its scroll distance. */
  itemDistance?: number
  /** Extra scale added per card index for stacked depth. */
  itemScale?: number
  /** Vertical stagger (px) between pinned cards in the deck. */
  itemStackDistance?: number
  /** Where cards pin, measured from the top of the viewport. */
  stackPosition?: string
  /** Where the scale-down finishes. */
  scaleEndPosition?: string
  /** Scale of the deepest card in the stack. */
  baseScale?: number
  rotationAmount?: number
  blurAmount?: number
}

interface CardTransform {
  y: number
  s: number
  r: number
  b: number
}

export default function ScrollStack({
  children,
  className = '',
  itemDistance = 80,
  itemScale = 0.03,
  itemStackDistance = 26,
  stackPosition = '18%',
  scaleEndPosition = '8%',
  baseScale = 0.86,
  rotationAmount = 0,
  blurAmount = 0,
}: ScrollStackProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion() ?? false

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.scroll-stack-card'))
    if (!cards.length) return

    // Structural setup (always — even under reduced motion, so spacing reads right).
    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`
      card.style.transformOrigin = 'top center'
      card.style.willChange = 'transform, filter'
      card.style.backfaceVisibility = 'hidden'
    })

    // Reduced motion: leave the cards in normal flow, no scroll transforms.
    if (reduce) return

    const endEl = root.querySelector<HTMLElement>('.scroll-stack-end')
    const last = new Map<number, CardTransform>()

    const parsePct = (v: string, h: number) =>
      v.includes('%') ? (parseFloat(v) / 100) * h : parseFloat(v)
    const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
    const offsetTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY

    const update = () => {
      const scrollTop = window.scrollY
      const vh = window.innerHeight
      const stackPx = parsePct(stackPosition, vh)
      const scaleEndPx = parsePct(scaleEndPosition, vh)
      const endTop = endEl ? offsetTop(endEl) : 0

      cards.forEach((card, i) => {
        const cardTop = offsetTop(card)
        const triggerStart = cardTop - stackPx - itemStackDistance * i
        const triggerEnd = cardTop - scaleEndPx
        const pinStart = cardTop - stackPx - itemStackDistance * i
        const pinEnd = endTop - vh / 2

        const scaleProgress =
          triggerEnd > triggerStart ? clamp01((scrollTop - triggerStart) / (triggerEnd - triggerStart)) : 0
        const targetScale = baseScale + i * itemScale
        const scale = 1 - scaleProgress * (1 - targetScale)
        const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

        let blur = 0
        if (blurAmount) {
          let topIdx = 0
          for (let j = 0; j < cards.length; j++) {
            const jStart = offsetTop(cards[j]) - stackPx - itemStackDistance * j
            if (scrollTop >= jStart) topIdx = j
          }
          if (i < topIdx) blur = Math.max(0, (topIdx - i) * blurAmount)
        }

        let translateY = 0
        if (scrollTop >= pinStart && scrollTop <= pinEnd) {
          translateY = scrollTop - cardTop + stackPx + itemStackDistance * i
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackPx + itemStackDistance * i
        }

        const next: CardTransform = {
          y: Math.round(translateY * 100) / 100,
          s: Math.round(scale * 1000) / 1000,
          r: Math.round(rotation * 100) / 100,
          b: Math.round(blur * 100) / 100,
        }
        const prev = last.get(i)
        const changed =
          !prev ||
          Math.abs(prev.y - next.y) > 0.1 ||
          Math.abs(prev.s - next.s) > 0.001 ||
          Math.abs(prev.r - next.r) > 0.1 ||
          Math.abs(prev.b - next.b) > 0.1

        if (changed) {
          card.style.transform = `translate3d(0, ${next.y}px, 0) scale(${next.s}) rotate(${next.r}deg)`
          card.style.filter = next.b > 0 ? `blur(${next.b}px)` : ''
          last.set(i, next)
        }
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [
    reduce,
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
  ])

  return (
    <div ref={rootRef} className={className}>
      {children}
      <div className="scroll-stack-end" aria-hidden="true" style={{ width: '100%', height: 1 }} />
    </div>
  )
}
