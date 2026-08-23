import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ServiceSlide } from '../data'

/**
 * THE RESIDENT VIEWER — device 8 of the Amour Liquide transplant. A
 * swipeable Swiper-style viewer over the hero (real prev/next buttons, one
 * slide at a time via scroll-snap) whose slides are the five services
 * (pössun / dagvistun / göngutúrar / snyrting / akstur). Each slide is a
 * real link to its own section: an invisible full-slide `<a>` sits over the
 * photo and label, exactly like Amour's per-slide overlay `<a>`.
 */
export function ResidentViewer({
  slides,
  onNavigate,
}: {
  slides: ServiceSlide[]
  onNavigate: (anchor: string) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  const go = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const slide = track.querySelector<HTMLElement>('[data-hh-slide]')
    const step = slide ? slide.getBoundingClientRect().width + 14 : track.clientWidth
    track.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div ref={trackRef} className="hh-viewer__track gap-3.5 pb-2" role="list" aria-label="Þjónusta hótelsins">
        {slides.map((s) => (
          <div key={s.id} data-hh-slide className="hh-viewer__slide" role="listitem">
            <div className="hh-frame relative" style={{ aspectRatio: '3 / 4' }}>
              <img src={s.img} alt={s.imgAlt} loading="lazy" className="hh-frame__img" />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 p-5"
                style={{ background: 'linear-gradient(to top, rgba(22,50,29,.82), rgba(22,50,29,0) 62%)' }}
              >
                <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--hh-cream)]/80 uppercase">
                  {s.priceNote}
                </p>
                <p className="mt-1 text-2xl font-semibold text-white">{s.label}</p>
                <p className="mt-1 text-sm text-white/85">{s.tagline}</p>
              </div>
            </div>
            <a
              href={s.anchor}
              onClick={(e) => {
                e.preventDefault()
                onNavigate(s.anchor)
              }}
              className="hh-focus absolute inset-0 rounded-[inherit]"
              aria-label={`Fara í ${s.label.toLowerCase()}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--hh-cream)]/75">Dragðu til hliðar, eða veldu þjónustu.</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            className="hh-focus flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
            aria-label="Fyrri þjónusta"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="hh-focus flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
            aria-label="Næsta þjónusta"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  )
}
