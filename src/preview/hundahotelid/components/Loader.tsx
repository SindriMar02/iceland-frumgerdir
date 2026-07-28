import { useEffect, useState } from 'react'

/**
 * THE LOADER (chrome, not one of the numbered devices). A brief overlay
 * carrying the wordmark (max-width ~280px), tied to real readiness: it
 * clears once web fonts report ready AND a minimum display time has
 * elapsed, whichever is later, capped by a hard failsafe so it can never
 * strand the page hidden. Fully skipped under reduced motion (see the
 * `prefers-reduced-motion` block in hh.css, which hides .hh-loader outright)
 * and under no-JS the overlay is simply absent (it only ever mounts via
 * React), so the page renders complete either way.
 */
export function Loader() {
  const [ready, setReady] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let cancelled = false
    const minTime = new Promise((resolve) => window.setTimeout(resolve, 550))
    const fontsReady =
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready
        : Promise.resolve()
    const failsafe = new Promise((resolve) => window.setTimeout(resolve, 1800))

    Promise.race([Promise.all([minTime, fontsReady]), failsafe]).then(() => {
      if (cancelled) return
      setReady(true)
      window.setTimeout(() => !cancelled && setHidden(true), 650)
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (hidden) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [hidden])

  return (
    <div className="hh-loader" data-hidden={hidden} data-ready={ready} aria-hidden={hidden}>
      <div className="hh-loader__mark flex flex-col items-center gap-4">
        <svg viewBox="0 0 300 90" className="w-full" role="img" aria-label="Hundahótelið Ásbrú">
          <text
            x="150"
            y="42"
            textAnchor="middle"
            fill="var(--hh-ink)"
            style={{ font: '700 28px "HH Fraunces", serif', letterSpacing: '-0.01em' }}
          >
            Hundahótelið
          </text>
          <text
            x="150"
            y="68"
            textAnchor="middle"
            fill="var(--hh-rust)"
            style={{ font: 'italic 500 17px "HH Fraunces", serif', letterSpacing: '0.04em' }}
          >
            Ásbrú
          </text>
        </svg>
        <svg viewBox="0 0 120 40" className="h-6 w-32" aria-hidden="true">
          <path
            d="M4,36 L4,14 C4,5 13,1 30,1 C47,1 56,5 56,14 L56,36"
            fill="none"
            stroke="var(--hh-hair)"
            strokeWidth="2"
          />
          <path
            className="hh-loader__ring"
            d="M4,36 L4,14 C4,5 13,1 30,1 C47,1 56,5 56,14 L56,36"
            fill="none"
            stroke="var(--hh-rust)"
            strokeWidth="2"
            pathLength={1}
          />
        </svg>
      </div>
    </div>
  )
}
