import { useEffect, useRef, useState } from 'react'
import { ArchFrame } from './ArchFrame'
import { TIMELINE_MARKERS, type DayBeat } from '../data'

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/**
 * THE TIMELINE SPINE — device 3. A sticky time-marker rail
 * (07:45 · 09:00 · 12:00 · 16:00 · 19:00) that advances as each day-beat
 * scrolls through view, tracked with one IntersectionObserver per beat
 * (never ScrollTrigger position math in a rAF loop). Under reduced motion
 * the rail still renders (it is a plain sticky list, not an animation) but
 * no observer runs and every beat's own content is always fully visible
 * regardless — the spine's job is only to say "you are here", never to
 * gate content.
 */
export function TimelineSpine({ beats }: { beats: DayBeat[] }) {
  const [active, setActive] = useState(0)
  const beatRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (reduced()) return
    const els = beatRefs.current.filter((el): el is HTMLDivElement => el !== null)
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = Number((entry.target as HTMLElement).dataset.hhBeatIndex)
          const marker = beats[idx]?.markerIndex
          if (marker !== undefined) setActive(marker)
        })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [beats])

  return (
    <div className="hh-spine">
      <div className="hh-spine__rail" aria-hidden="true">
        {TIMELINE_MARKERS.map((m, i) => (
          <span key={m} className="hh-spine__marker" data-active={i === active}>
            {m}
          </span>
        ))}
      </div>

      <div>
        <div className="hh-spine__mobile" role="list" aria-label="Tímalína dagsins">
          {TIMELINE_MARKERS.map((m, i) => (
            <span
              key={m}
              className="hh-spine__marker"
              data-active={i === active}
              style={{ flex: 'none' }}
              role="listitem"
            >
              {m}
            </span>
          ))}
        </div>

        {beats.map((beat, i) => (
          <div
            key={`${beat.time}-${beat.label}`}
            ref={(el) => {
              beatRefs.current[i] = el
            }}
            data-hh-beat-index={i}
            className="hh-beat"
          >
            <div className="grid gap-7 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:gap-10">
              <div className={i % 2 === 1 ? 'sm:order-2' : ''}>
                <ArchFrame src={beat.img} alt={beat.imgAlt} aspect="4 / 5" />
              </div>
              <div className={i % 2 === 1 ? 'sm:order-1' : ''} data-hh-reveal>
                <p className="hh-beat__time">{beat.time}</p>
                <h3 className="mt-1.5 text-[clamp(1.5rem,3.2vw,2.1rem)] leading-[1.1] font-semibold">
                  {beat.label}
                </h3>
                <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-[var(--hh-ink)]/85">
                  {beat.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
