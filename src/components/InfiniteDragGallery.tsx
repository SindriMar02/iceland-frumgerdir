/**
 * Infinite drag + scroll gallery — vendored from 21st.dev
 * (@rylenlobo/infinite-drag-scroll, demo id 2481) and ADAPTED for this app.
 *
 * Adaptations, all deliberate:
 *  1. `motion/react` → `framer-motion`. The app runs framer-motion v11; a
 *     second motion runtime leaves the component inert. ([[21st-dev-mcp]])
 *  2. The original attaches its wheel listener to WINDOW, so scrolling
 *     anywhere on the page moved the gallery — that is page-wide scroll
 *     hijacking. It is now scoped to the gallery element and only acts while
 *     the pointer is actually over it, and it does not preventDefault, so the
 *     page keeps scrolling normally.
 *  3. The original fades items in from opacity 0 via framer mount variants.
 *     Mount/state animations fire unreliably here ([[framer-reveals-unreliable]]),
 *     which would leave the whole gallery invisible. Items now render fully
 *     opaque; entrance is a CSS transition driven by a mounted flag.
 *  4. `cva` dependency dropped (not installed) — variants inlined.
 *  5. Height is a prop instead of a hardcoded 100dvh.
 *  6. Respects prefers-reduced-motion: drag still works, momentum is off.
 */
import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  wrap,
  useReducedMotion,
} from 'framer-motion'
import { createContext, memo, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

type Variant = 'default' | 'masonry'

const GridVariantContext = createContext<Variant | undefined>(undefined)

export function DraggableContainer({
  className = '',
  children,
  variant = 'default',
  height = '78vh',
}: {
  className?: string
  children: ReactNode
  variant?: Variant
  height?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)
  const reduce = useReducedMotion()
  // On touch devices, lock drag to the X axis so a vertical swipe still
  // scrolls the PAGE (framer sets touch-action: pan-y for x-only drag).
  // Without this a 72vh drag panel traps the scroll and the visitor is stuck.
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect()
    const viewport = viewportRef.current
    if (!rect || !viewport) return
    const { width, height: h } = rect

    const unX = x.on('change', (latest) => x.set(wrap(-(width / 2), 0, latest)))
    const unY = y.on('change', (latest) => y.set(wrap(-(h / 2), 0, latest)))

    // Scoped to the gallery, not the window: the page must keep scrolling.
    let over = false
    const onEnter = () => (over = true)
    const onLeave = () => (over = false)
    const onWheel = (event: WheelEvent) => {
      if (!over || isDragging) return
      animate(y, y.get() - event.deltaY * (reduce ? 1 : 2.2), {
        type: 'tween',
        duration: reduce ? 0 : 1.1,
        ease: cubicBezier(0.18, 0.71, 0.11, 1),
      })
    }
    viewport.addEventListener('mouseenter', onEnter)
    viewport.addEventListener('mouseleave', onLeave)
    viewport.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      unX()
      unY()
      viewport.removeEventListener('mouseenter', onEnter)
      viewport.removeEventListener('mouseleave', onLeave)
      viewport.removeEventListener('wheel', onWheel)
    }
  }, [x, y, isDragging, reduce])

  return (
    <GridVariantContext.Provider value={variant}>
      <div ref={viewportRef} className="overflow-hidden" style={{ height }}>
        <motion.div
          className={`grid h-fit w-fit cursor-grab grid-cols-[repeat(2,1fr)] will-change-transform active:cursor-grabbing ${className}`}
          drag={touch ? 'x' : true}
          dragMomentum={!reduce}
          dragTransition={{ timeConstant: 200, power: 0.28, restDelta: 0, bounceStiffness: 0 }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          style={{ x, y }}
          ref={ref}
        >
          {children}
        </motion.div>
      </div>
    </GridVariantContext.Provider>
  )
}

export function GridItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const variant = useContext(GridVariantContext)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), 60)
    return () => window.clearTimeout(t)
  }, [])
  const variantCls = variant === 'masonry' ? 'even:mt-[52%]' : ''
  // NOTE: no `h-full w-full` here. The caller passes explicit sizes
  // (h-40 w-28 …); a hardcoded h-full collapses to 0 against the fit-content
  // grid parent, which blanked the whole gallery. Size comes from `className`.
  return (
    <div
      className={`overflow-hidden will-change-transform hover:cursor-pointer ${variantCls} ${className}`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'scale(0.94)',
        transition: 'opacity 700ms ease, transform 700ms cubic-bezier(0.18,0.71,0.11,1)',
      }}
    >
      {children}
    </div>
  )
}

export const GridBody = memo(function GridBody({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const variant = useContext(GridVariantContext)
  const pad = variant === 'masonry' ? 'gap-x-8 px-4 md:gap-x-16 md:px-8' : 'gap-8 p-4 md:gap-14 md:p-8'
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`grid h-fit w-fit grid-cols-[repeat(6,1fr)] ${pad} ${className}`}>
          {children}
        </div>
      ))}
    </>
  )
})
