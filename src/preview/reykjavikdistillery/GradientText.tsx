import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import './GradientText.css'

/**
 * GradientText — ported from react-bits (JS-CSS variant), TypeScript + inline.
 *
 * Clips a word to a looping brand gradient. Faithful to the original API
 * (colors / animationSpeed / showBorder / direction / pauseOnHover / yoyo), but
 * rendered as <span>s so it sits inline inside a heading, with the badge chrome
 * stripped (see GradientText.css).
 *
 * Visibility never depends on the animation: at rest the gradient is a static
 * fill, so a backgrounded tab (where rAF is frozen) still shows the word. Under
 * prefers-reduced-motion the shimmer is held still.
 */
interface GradientTextProps {
  children: ReactNode
  className?: string
  colors?: string[]
  /** Seconds for one sweep across the gradient. */
  animationSpeed?: number
  showBorder?: boolean
  direction?: 'horizontal' | 'vertical' | 'diagonal'
  pauseOnHover?: boolean
  /** Ease back and forth instead of hard-looping. */
  yoyo?: boolean
}

export default function GradientText({
  children,
  className = '',
  colors = ['#5227FF', '#FF9FFC', '#B497CF'],
  animationSpeed = 8,
  showBorder = false,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = true,
}: GradientTextProps) {
  const reduce = useReducedMotion()
  const [isPaused, setIsPaused] = useState(false)
  const progress = useMotionValue(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)

  const animationDuration = animationSpeed * 1000

  useAnimationFrame((time) => {
    if (reduce || isPaused) {
      lastTimeRef.current = null
      return
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time
      return
    }
    const deltaTime = time - lastTimeRef.current
    lastTimeRef.current = time
    elapsedRef.current += deltaTime

    if (yoyo) {
      const fullCycle = animationDuration * 2
      const cycleTime = elapsedRef.current % fullCycle
      if (cycleTime < animationDuration) {
        progress.set((cycleTime / animationDuration) * 100)
      } else {
        progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100)
      }
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100)
    }
  })

  useEffect(() => {
    elapsedRef.current = 0
    progress.set(0)
  }, [animationSpeed, progress, yoyo])

  const backgroundPosition = useTransform(progress, (p) =>
    direction === 'vertical' ? `50% ${p}%` : `${p}% 50%`,
  )

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true)
  }, [pauseOnHover])
  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false)
  }, [pauseOnHover])

  const gradientAngle =
    direction === 'horizontal' ? 'to right' : direction === 'vertical' ? 'to bottom' : 'to bottom right'
  const gradientColors = [...colors, colors[0]].join(', ')

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize: direction === 'horizontal' ? '300% 100%' : direction === 'vertical' ? '100% 300%' : '300% 300%',
    backgroundRepeat: 'repeat' as const,
  }

  return (
    <motion.span
      className={`animated-gradient-text ${showBorder ? 'with-border' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && <motion.span className="gradient-overlay" style={{ ...gradientStyle, backgroundPosition }} />}
      <motion.span className="text-content" style={{ ...gradientStyle, backgroundPosition }}>
        {children}
      </motion.span>
    </motion.span>
  )
}
