/**
 * The long tours as a collection you drag through (Realevate's category
 * slider, kept upright): native scroll-snap so it works everywhere, pointer
 * drag on fine pointers, arrows, and a progress line. Each card opens the
 * tour's own page (itinerary, map, departures).
 */
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { LongTourX } from './sanity'
import { departuresLine, metaLine, requirementsLine, type Lang } from './schedule'

const PAPER = '#F7FAFC'
const INK = '#161B3C'
const BODY = '#3D4565'
const CLAY = '#3B8FD4'
const CLAY_TX = '#2160A6'
const SLATE = '#57608A'
const HOME = '/preview/polarhestar'

export function LongTourSlider({ tours, lang }: { tours: LongTourX[]; lang: Lang }) {
  const t = (is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      setProgress(max > 0 ? el.scrollLeft / max : 1)
      setAtStart(el.scrollLeft < 4)
      setAtEnd(el.scrollLeft > max - 4)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [tours.length])

  const step = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const w = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' })
  }

  // drag to scroll on mouse; touch keeps native momentum + snap
  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false }
    ref.current.setPointerCapture(e.pointerId)
  }
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = ref.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    el.scrollLeft = d.left - dx
  }
  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!drag.current || !el) return
    if (drag.current.moved) {
      // a drag is not a click: swallow the click that follows
      el.addEventListener('click', (ev) => ev.preventDefault(), { once: true, capture: true })
    }
    drag.current = null
    el.releasePointerCapture(e.pointerId)
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className="ph-slider -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:-mx-8 md:px-8"
        style={{ scrollPaddingLeft: 'var(--ph-pad, 20px)', cursor: drag.current ? 'grabbing' : undefined }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        role="list"
      >
        {tours.map((tour) => (
          <article
            key={tour.id}
            data-card
            role="listitem"
            className="ph-card group flex w-[86vw] max-w-[420px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] shadow-[0_1px_2px_rgba(22,27,60,0.05),0_10px_22px_-14px_rgba(22,27,60,0.22),0_28px_56px_-32px_rgba(32,32,112,0.3)] md:w-[420px]"
            style={{ background: PAPER }}
          >
            <Link to={`${HOME}/ferd/${tour.id}`} className="relative block aspect-[4/3] overflow-hidden" draggable={false} tabIndex={-1} aria-hidden="true">
              <img
                src={tour.pic.src}
                srcSet={tour.pic.srcSet}
                sizes="(max-width: 768px) 86vw, 420px"
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="ph-card-img absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: tour.pic.pos }}
              />
            </Link>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <div className="flex flex-wrap items-center gap-2">
                {metaLine(tour, lang).split(' · ').map((part, j) => (
                  <span key={j} className="rounded-full px-2.5 py-1 font-hanken text-[0.72rem] font-semibold" style={part.includes('€') ? { background: `${CLAY}1f`, color: CLAY_TX } : { background: `${INK}0d`, color: SLATE }}>
                    {part}
                  </span>
                ))}
              </div>
              <h3 className="font-spectral text-2xl leading-snug" style={{ color: INK }}>
                <Link to={`${HOME}/ferd/${tour.id}`} className="outline-none focus-visible:underline" draggable={false}>
                  {tour.name[lang]}
                </Link>
              </h3>
              <p className="font-hanken text-sm leading-relaxed" style={{ color: BODY }}>{tour.blurb[lang]}</p>
              <div className="mt-auto flex flex-col gap-1 border-t pt-3" style={{ borderColor: '#161B3C12' }}>
                <p className="font-hanken text-xs leading-relaxed" style={{ color: SLATE }}>{requirementsLine(tour, lang)}</p>
                <p className="font-hanken text-xs leading-relaxed font-medium" style={{ color: CLAY_TX }}>{departuresLine(tour, lang)}</p>
              </div>
              <Link to={`${HOME}/ferd/${tour.id}`} className="inline-flex items-center gap-1 self-start font-hanken text-sm font-semibold transition-colors" style={{ color: CLAY_TX }} draggable={false}>
                {tour.itinerary ? t('Dagur fyrir dag og kort', 'Day by day and map', 'Tag für Tag und Karte') : t('Sjá ferðina', 'See the tour', 'Zur Tour')}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-4">
        <div className="h-[2px] flex-1 rounded-full" style={{ background: `${INK}14` }}>
          <div className="h-full rounded-full" style={{ width: `${Math.max(12, progress * 100)}%`, background: CLAY_TX, transition: 'width .2s ease-out' }} />
        </div>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => step(-1)} disabled={atStart} aria-label={t('Fyrri ferð', 'Previous tour', 'Vorige Tour')} className="grid h-10 w-10 place-items-center rounded-full border transition-colors hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent" style={{ borderColor: '#0000001f', color: INK }}>
            <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => step(1)} disabled={atEnd} aria-label={t('Næsta ferð', 'Next tour', 'Nächste Tour')} className="grid h-10 w-10 place-items-center rounded-full border transition-colors hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent" style={{ borderColor: '#0000001f', color: INK }}>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
