import { useEffect, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { RING_ROAD_KM, SURVEY_WAYPOINTS } from './data'

const SHEETS = ['I', 'II', 'III', 'IV', 'V', 'VI']
/** Sheet I starts at the top; II–VI begin where their sections do (measured). */
const SHEET_SECTION_IDS = ['heritage', 'atlas', 'fleet', 'care', 'book']
const FALLBACK_CUTS = [0, 0.16, 0.4, 0.56, 0.74, 0.9]

function toDegMin(value: number, axis: 'lat' | 'lng'): string {
  const abs = Math.abs(value)
  const deg = Math.floor(abs)
  const min = Math.round((abs - deg) * 60)
  const hemi = axis === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W'
  return `${deg}°${String(min).padStart(2, '0')}′${hemi}`
}

function interpolateWaypoint(p: number) {
  const pts = SURVEY_WAYPOINTS
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    if (p >= a.p && p <= b.p) {
      const t = b.p === a.p ? 0 : (p - a.p) / (b.p - a.p)
      return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t }
    }
  }
  return { lat: pts[0].lat, lng: pts[0].lng }
}

/**
 * The Living Sheet chrome: a fixed survey neatline around the viewport and a
 * margin instrument cluster (sheet no. / km / coordinates) driven by page
 * scroll. Pure decoration for assistive tech — every section carries its own
 * visible heading. Mobile gets a single cobalt progress hairline instead.
 */
export function SurveyChrome() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 })
  const [readout, setReadout] = useState({ km: 0, sheet: 'I', lat: SURVEY_WAYPOINTS[0].lat, lng: SURVEY_WAYPOINTS[0].lng })
  const [cuts, setCuts] = useState<number[]>(FALLBACK_CUTS)

  // Measure where each sheet actually begins, so the readout never lies as
  // viewport width changes the section heights. Recompute on resize.
  useEffect(() => {
    const measure = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const measured = [0, ...SHEET_SECTION_IDS.map((id) => {
        const el = document.getElementById(id)
        if (!el) return 1
        return Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY) / scrollable))
      })]
      setCuts(measured)
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    // sections settle after fonts/images; remeasure shortly after mount
    const t = window.setTimeout(measure, 600)
    return () => {
      window.removeEventListener('resize', measure)
      window.clearTimeout(t)
    }
  }, [])

  useMotionValueEvent(smooth, 'change', (v) => {
    const p = Math.min(1, Math.max(0, v))
    const sheetIdx = cuts.reduce((acc, cut, i) => (p >= cut ? i : acc), 0)
    const km = Math.round(p * RING_ROAD_KM)
    const { lat, lng } = interpolateWaypoint(p)
    // Skip the state write when nothing visible changed — cuts re-renders/frame
    setReadout((prev) =>
      prev.km === km && prev.sheet === SHEETS[sheetIdx] ? prev : { km, sheet: SHEETS[sheetIdx], lat, lng },
    )
  })

  return (
    <>
      {/* Neatline frame */}
      <div aria-hidden className="pointer-events-none fixed inset-2 z-30 hidden border border-gj-ink/15 md:block">
        <span className="absolute -top-px left-6 h-2 w-px bg-gj-ink/30" />
        <span className="absolute -top-px right-6 h-2 w-px bg-gj-ink/30" />
        <span className="absolute -bottom-px left-6 h-2 w-px bg-gj-ink/30" />
        <span className="absolute -bottom-px right-6 h-2 w-px bg-gj-ink/30" />
        <span className="absolute top-6 -left-px w-2 h-px bg-gj-ink/30" />
        <span className="absolute bottom-6 -left-px w-2 h-px bg-gj-ink/30" />
        <span className="absolute top-6 -right-px w-2 h-px bg-gj-ink/30" />
        <span className="absolute bottom-6 -right-px w-2 h-px bg-gj-ink/30" />
      </div>

      {/* Margin instrument cluster — desktop, bottom-left survey margin */}
      <div
        aria-hidden
        className="fixed bottom-5 left-7 z-30 hidden flex-col gap-0.5 font-grotesk text-[10px] font-medium tracking-[0.22em] text-gj-lichen tabular-nums md:flex"
      >
        <span>SHEET {readout.sheet} / VI</span>
        <span className="text-gj-cobalt">KM {String(readout.km).padStart(4, '0')}</span>
        <span>
          {toDegMin(readout.lat, 'lat')} {toDegMin(readout.lng, 'lng')}
        </span>
      </div>

      {/* Mobile progress hairline — a position indicator, so kept under
          reduced motion (just without the spring smoothing). */}
      <motion.div
        aria-hidden
        style={{ scaleX: reduce ? scrollYProgress : smooth }}
        className="fixed inset-x-0 top-0 z-30 h-0.5 origin-left bg-gj-cobalt md:hidden"
      />
    </>
  )
}
