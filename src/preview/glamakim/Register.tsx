import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'

/* ═════════════════════════════════════════════════════════════════════════
   SKRÁIN — the twenty-two project titles, as a register that drifts past.

   Structurally the Heklusýn build's Skyline, copied device-for-device and
   re-prefixed gk- (repo law: no imports across page folders).

   Vendored from 21st.dev "Scroll Velocity Text" (@cnippet.dev) — a marquee
   whose speed and direction follow scroll velocity — rather than installed,
   because the shipped component is Tailwind-classed and this page carries
   its own stylesheet. Behaviour is the original's; the styling is ours.

   ONE row, not the demo's two opposing ones: the claim above it is that
   these twenty-two are one register, and two rows moving apart would read
   as two lists.

   Twenty-two Icelandic project titles cannot be laid out on one line at any
   viewport, and a flex-wrap list breaks differently at every width. A
   marquee cannot wrap, so that whole class of bug goes away. The per-name
   vertical offsets are purely typographic — they say nothing about any
   building's size, height or importance.

   Under prefers-reduced-motion nothing moves: it renders as a plain
   horizontally-scrollable list, which is also the no-JS resting state.
   ═════════════════════════════════════════════════════════════════════════ */

const wrapValue = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

export interface RegisterItem { name: string; rise: string }

export function Register({ peaks, label }: { peaks: readonly RegisterItem[]; label: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const blockRef = useRef<HTMLUListElement>(null)
  const [copies, setCopies] = useState(1)
  const [reduced, setReduced] = useState(false)

  const baseX = useMotionValue(0)
  const unitWidth = useMotionValue(0)
  const dirRef = useRef(-1)
  const inViewRef = useRef(true)
  const visibleRef = useRef(true)

  // scroll velocity → a bounded signed factor, smoothed so a flick of the
  // wheel does not snap the row
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, (v) => {
    const sign = v < 0 ? -1 : 1
    return sign * Math.min(5, (Math.abs(v) / 1000) * 5)
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onPRM = () => setReduced(mq.matches)
    onPRM()
    mq.addEventListener('change', onPRM)
    return () => mq.removeEventListener('change', onPRM)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const block = blockRef.current
    if (!container || !block || reduced) return

    const measure = () => {
      const cw = container.offsetWidth || 0
      const bw = block.scrollWidth || 0
      unitWidth.set(bw)
      // enough copies to cover the container plus one leaving and one entering
      setCopies((prev) => {
        const next = bw > 0 ? Math.max(3, Math.ceil(cw / bw) + 2) : 1
        return prev === next ? prev : next
      })
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(container)
    ro.observe(block)

    // a marquee running off screen is pure battery drain
    const io = new IntersectionObserver(([e]) => { if (e) inViewRef.current = e.isIntersecting })
    io.observe(container)

    const onVis = () => { visibleRef.current = document.visibilityState === 'visible' }
    document.addEventListener('visibilitychange', onVis, { passive: true })
    onVis()

    return () => {
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduced, unitWidth])

  const x = useTransform([baseX, unitWidth], ([v, bw]) =>
    `${-wrapValue(0, Number(bw) || 1, Number(v) || 0)}px`)

  useAnimationFrame((_, delta) => {
    if (reduced || !inViewRef.current || !visibleRef.current) return
    const bw = unitWidth.get()
    if (bw <= 0) return
    const vf = factor.get()
    const mag = Math.min(5, Math.abs(vf))
    // scrolling down carries the horizon one way, scrolling up reverses it
    if (mag > 0.1) dirRef.current = vf >= 0 ? -1 : 1
    baseX.set(baseX.get() + dirRef.current * (bw * 3) / 100 * (1 + mag) * (delta / 1000))
  })

  const list = (i: number) => (
    <ul
      key={i}
      className="gk-sky"
      ref={i === 0 ? blockRef : null}
      {...(i === 0 ? { 'aria-label': label } : { 'aria-hidden': true })}
    >
      {peaks.map((p) => (
        <li key={p.name} style={{ '--r': p.rise } as React.CSSProperties}>{p.name}</li>
      ))}
    </ul>
  )

  if (reduced) return <div className="gk-skyline is-static">{list(0)}</div>

  return (
    <div className="gk-skyline" ref={containerRef}>
      <motion.div className="gk-skyline-track" style={{ x }}>
        {Array.from({ length: copies }, (_, i) => list(i))}
      </motion.div>
    </div>
  )
}
