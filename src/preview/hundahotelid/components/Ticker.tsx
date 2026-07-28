import { useEffect, useRef, useState } from 'react'
import { TICKER_LINE } from '../data'

/**
 * THE TICKER — device 4. A CSS animation that starts
 * `animation-play-state: paused` and is flipped to `running` only once the
 * row is in view (never before, so it never fires off-screen and wastes the
 * moment). One row plays reversed via `animation-direction: reverse` on the
 * SAME @keyframes. Literal text per the brief: opening hours, address,
 * phone number, on repeat.
 */
export function Ticker({ reverse = false, tone = 'light' }: { reverse?: boolean; tone?: 'light' | 'dark' }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    const failsafe = window.setTimeout(() => setInView(true), 2000)
    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])

  const line = `${TICKER_LINE}  `.repeat(4)
  const color = tone === 'dark' ? 'text-[var(--hh-cream)]' : 'text-[var(--hh-rust-deep)]'

  return (
    <div ref={ref} className={`hh-ticker ${inView ? 'is-inview' : ''}`}>
      <div className={`hh-ticker__track ${reverse ? 'hh-ticker__track--reverse' : ''}`}>
        <span className={`px-4 text-[7.5vw] leading-[1.08] font-semibold sm:text-[3.4vw] ${color}`}>{line}</span>
        <span className={`px-4 text-[7.5vw] leading-[1.08] font-semibold sm:text-[3.4vw] ${color}`} aria-hidden="true">
          {line}
        </span>
      </div>
    </div>
  )
}
