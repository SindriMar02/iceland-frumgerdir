import { useEffect, useId, useState } from 'react'
import { ArrowUpRight, Minus, Plus } from 'lucide-react'
import type { Copy, Lang } from './copy'
import {
  bookingHref,
  bookingReady,
  nightsBetween,
  type GodoRoomKey,
} from './godo'
import { availKnown, stayBookable } from './avail'
import DateRangeField from './DateRangeField'
import type { Stay } from './stay'

/**
 * Date and guest picker that hands off to Godo's booking page.
 *
 * The guest chooses dates and party size here, in our own type and colour, then
 * lands on Godo with all of it pre-filled. Nothing is priced on this side:
 * rates, availability and the booking rules all live in Godo, which is the only
 * place they are ever correct.
 *
 * Bookings go through Godo only — there is no phone or email fallback here on
 * purpose. Until her property id is filled into godo.ts the submit control
 * renders as an inert placeholder holding Godo's spot, so the layout is final
 * and switching it on is a one-line change.
 *
 * THE DATES ARE NOT OWNED HERE. They live one level up in Page, because the
 * room list further down carries its own per-room booking links and those have
 * to hand Godo the same nights the guest just picked up here. Two independent
 * copies of "when are you coming" is how a guest ends up choosing dates twice.
 */

const PAPER = '#F4EEE2'
const HAIR = 'rgba(244,238,226,0.14)'
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97D3D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15130F]'

/** Two calendar months fit above 768px; below it one month is the whole
 *  screen. Tracks the media query live so a rotation re-fits the popover. */
function useWide(): boolean {
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-[10px] uppercase tracking-[0.16em]"
        style={{ color: 'rgba(244,238,226,0.55)' }}
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`One fewer ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className={`grid h-11 w-11 [touch-action:manipulation] place-items-center border transition-colors disabled:opacity-30 md:h-8 md:w-8 ${FOCUS}`}
          style={{ borderColor: HAIR, color: PAPER }}
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <output
          id={id}
          className="min-w-[1.5ch] text-center font-erode text-2xl tabular-nums"
          style={{ color: PAPER }}
        >
          {value}
        </output>
        <button
          type="button"
          aria-label={`One more ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className={`grid h-11 w-11 [touch-action:manipulation] place-items-center border transition-colors disabled:opacity-30 md:h-8 md:w-8 ${FOCUS}`}
          style={{ borderColor: HAIR, color: PAPER }}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default function BookingBar({
  room = null,
  className = '',
  variant = 'bar',
  t,
  lang,
  stay,
  onStay,
  today,
}: {
  /** Focus the booking page on one unit type, when placed inside a room card. */
  room?: GodoRoomKey | null
  className?: string
  t: Copy
  lang: Lang
  /** 'bar' is the wide five-across row; 'card' stacks for a narrow column,
   *  which is what the hero uses so it can sit beside the headline. */
  variant?: 'bar' | 'card'
  stay: Stay
  onStay: (next: Partial<Stay>) => void
  today: Date
}) {
  const label = t.cta.check
  const isCard = variant === 'card'
  const wide = useWide()
  const { checkin, checkout, adults, children } = stay

  const inId = useId()

  const nights = nightsBetween(checkin, checkout)
  const ready = bookingReady()

  const href = bookingHref({ checkin, checkout, adults, children, room, lang })

  /* The one soft warning this side of Godo: the picked nights fit no single
   * room on our last snapshot. The CTA stays live — the snapshot ages between
   * deploys and Godo has the final word — but the guest is told before the
   * jump instead of after it. */
  const looksFull = availKnown() && !stayBookable(checkin, checkout)

  return (
    <div
      className={`border ${className}`}
      style={{
        borderColor: HAIR,
        /* The card sits over the hero photograph, so it needs a real surface to
         * stay legible; the wide bar sits over flat ground and can stay nearly
         * transparent. No backdrop-blur — the hero scrolls, and blurring a
         * scrolling layer is a guaranteed mobile frame drop. */
        background: isCard ? 'rgba(21,19,15,0.78)' : 'rgba(244,238,226,0.03)',
      }}
    >
      <div
        className={
          isCard
            ? 'flex flex-col gap-5 p-5 sm:p-6'
            : /* The old md five-across grid did not fit at 768 and pushed the
               * CTA 26px past the viewport (measured). Two rows at md, one at
               * lg, where the row actually has room. */
              'grid gap-6 p-5 sm:p-6 md:grid-cols-[auto_auto_1fr] md:items-end md:gap-7 lg:grid-cols-[minmax(0,1.35fr)_auto_auto_minmax(11rem,auto)]'
        }
      >
        <DateRangeField
          checkin={checkin}
          checkout={checkout}
          onRange={(ci, co) => onStay({ checkin: ci, checkout: co })}
          lang={lang}
          t={t}
          months={!isCard && wide ? 2 : 1}
          today={today}
          className={isCard ? '' : 'md:col-span-3 lg:col-span-1'}
        />

        {isCard ? (
          <div className="grid grid-cols-2 gap-4">
            <Stepper label={t.booking.adults} value={adults} min={1} max={12} onChange={(n) => onStay({ adults: n })} />
            <Stepper label={t.booking.children} value={children} min={0} max={8} onChange={(n) => onStay({ children: n })} />
          </div>
        ) : (
          <>
            <Stepper label={t.booking.adults} value={adults} min={1} max={12} onChange={(n) => onStay({ adults: n })} />
            <Stepper label={t.booking.children} value={children} min={0} max={8} onChange={(n) => onStay({ children: n })} />
          </>
        )}

        {ready && href ? (
          <a
            href={href}
            className={`group inline-flex items-center justify-center gap-2 bg-[#D97D3D] py-2 pl-6 pr-2 font-supreme text-[15px] font-semibold text-[#15130F] transition-[transform,background-color] duration-200 ease-out hover:bg-[#E68C4C] active:scale-[0.98] ${isCard ? 'w-full' : ''} ${FOCUS}`}
          >
            {label}
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#15130F]/10 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px">
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-describedby={`${inId}-placeholder`}
            className={`inline-flex cursor-not-allowed items-center justify-center gap-2 border border-dashed px-6 py-3.5 font-supreme text-[15px] font-semibold ${isCard ? 'w-full' : ''}`}
            style={{ borderColor: 'rgba(217,125,61,0.55)', color: 'rgba(217,125,61,0.85)' }}
          >
            {label}
          </button>
        )}
      </div>

      <div
        className="border-t px-5 py-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] sm:px-6"
        style={{ borderColor: HAIR, color: 'rgba(244,238,226,0.6)' }}
        id={ready ? undefined : `${inId}-placeholder`}
      >
        <p>
          {ready ? (
            <>
              {nights} {nights === 1 ? t.booking.night : t.booking.nights} · {t.booking.ageNote} ·{' '}
              {t.booking.pricesNext}
            </>
          ) : (
            <>
              {nights} {nights === 1 ? t.booking.night : t.booking.nights} · {t.booking.placeholder}
            </>
          )}
        </p>
        {looksFull ? (
          /* aria-live: the warning appears in reaction to a date change made
           * somewhere above it, so a screen reader should hear it too. */
          <p aria-live="polite" className="mt-1.5" style={{ color: 'rgba(217,125,61,0.95)' }}>
            {t.booking.mayBeFull}
          </p>
        ) : null}
      </div>
    </div>
  )
}
