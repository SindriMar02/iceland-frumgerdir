import { useEffect, useId, useState } from 'react'
import { ArrowUpRight, Minus, Plus } from 'lucide-react'
import type { Copy, Lang } from './copy'
import { bookingHref, bookingReady, nightsBetween, type GodoRoomKey } from './godo'
import { countBookingHandoff } from './Page'
import { availKnown, stayBookable } from './avail'
import StayCalendar, { fmtShort } from './StayCalendar'
import type { Stay } from './stay'

/**
 * The booking widget: our stay calendar, the party, and the handoff to Godo.
 *
 * The guest picks a stay on the inline calendar (StayCalendar: booked nights
 * struck from the Godo inventory snapshot, the same picker our other builds
 * use) and the party size, then lands on Godo's booking page with all of it
 * filled in (bookingHref). Nothing is priced on this side: rates and the final
 * availability live in Godo, the only place they are always correct.
 *
 * THE DATES ARE NOT OWNED HERE. The committed stay lives one level up
 * (stay.ts), because the room list carries its own per-room Book links and
 * they must hand Godo the same nights. This component holds only the stay
 * being drawn: a check-in with no checkout yet does not overwrite the page's
 * stay, so the room links never point at half a stay.
 *
 * Placement: at the foot of the page, by the footer, never under the hero
 * ([[booking-widget-at-the-bottom]]).
 */

const PAPER = '#F4EEE2'
const HAIR = 'rgba(244,238,226,0.14)'
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97D3D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15130F]'

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
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="font-fragment text-[11px] uppercase tracking-[0.14em] text-[#F4EEE2]/60">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`One fewer: ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className={`grid h-11 w-11 touch-manipulation place-items-center border transition-[transform,border-color] duration-150 ease-out hover:border-[#F4EEE2]/45 active:scale-[0.97] disabled:opacity-30 md:h-9 md:w-9 ${FOCUS}`}
          style={{ borderColor: HAIR, color: PAPER }}
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <output id={id} className="min-w-[1.5ch] text-center font-erode text-2xl font-light tabular-nums" style={{ color: PAPER }}>
          {value}
        </output>
        <button
          type="button"
          aria-label={`One more: ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className={`grid h-11 w-11 touch-manipulation place-items-center border transition-[transform,border-color] duration-150 ease-out hover:border-[#F4EEE2]/45 active:scale-[0.97] disabled:opacity-30 md:h-9 md:w-9 ${FOCUS}`}
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
  /** Kept for call sites; the widget now lays itself out by its own width. */
  variant?: 'bar' | 'card'
  stay: Stay
  onStay: (next: Partial<Stay>) => void
  today: Date
}) {
  const { checkin, checkout, adults, children } = stay
  const [start, setStart] = useState<Date | null>(checkin)
  const [end, setEnd] = useState<Date | null>(checkout)
  const [note, setNote] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  /* The page's stay can move without us (useStay re-seeds past defaults on
     mount); follow it. A half-drawn stay does not change `stay`, so this never
     undoes the guest's first click. */
  useEffect(() => {
    setStart(checkin)
    setEnd(checkout)
  }, [checkin.getTime(), checkout.getTime()]) // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (s: Date | null, e: Date | null) => {
    setStart(s)
    setEnd(e)
    if (s && e) onStay({ checkin: s, checkout: e })
  }

  const complete = !!start && !!end
  const nights = complete ? nightsBetween(start!, end!) : 0
  const ready = bookingReady()
  const href = complete ? bookingHref({ checkin: start!, checkout: end!, adults, children, room, lang }) : null
  /* Every night has some room, but no single room holds the whole stay on the
     last snapshot: said before the jump, never blocking it. */
  const looksFull = mounted && complete && availKnown() && !stayBookable(start!, end!)

  const cell = (label: string, value: string, filled: boolean) => (
    <div className="min-w-0 flex-1 border-b pb-3" style={{ borderColor: filled ? 'rgba(217,125,61,0.6)' : HAIR }}>
      <span className="block font-fragment text-[11px] uppercase tracking-[0.14em] text-[#F4EEE2]/60">{label}</span>
      <span className={`mt-1 block truncate font-erode text-xl font-light ${filled ? 'text-[#F4EEE2]' : 'text-[#F4EEE2]/45'}`}>{value}</span>
    </div>
  )

  return (
    <div id="stay" className={`@container border text-[#F4EEE2] ${className}`} style={{ borderColor: HAIR, background: '#15130F' }}>
      <div className="grid gap-8 p-5 sm:p-6 @min-[52rem]:grid-cols-[minmax(0,1fr)_18rem] @min-[52rem]:gap-10">
        <div>
          <StayCalendar
            start={start}
            end={end}
            today={today}
            t={t}
            lang={lang}
            onChange={onChange}
            onNote={setNote}
            availReady={mounted}
          />
          <p className="mt-4 text-[13px] leading-relaxed text-[#F4EEE2]/55">{t.booking.calendarKey}</p>
        </div>

        <aside className="flex flex-col gap-5">
          <div className="flex gap-4">
            {cell(t.booking.checkIn, start ? fmtShort(start, t, lang) : t.booking.pickDate, !!start)}
            {cell(t.booking.checkOut, end ? fmtShort(end, t, lang) : start ? t.booking.pickDate : t.booking.afterCheckIn, !!end)}
          </div>
          {start ? (
            <button
              type="button"
              onClick={() => onChange(null, null)}
              className={`-my-2 self-start py-2 text-[13px] text-[#F4EEE2]/70 underline underline-offset-4 transition-colors duration-150 hover:text-[#F4EEE2] ${FOCUS}`}
            >
              {t.booking.clearDates}
            </button>
          ) : null}

          <div className="flex flex-col gap-3">
            <Stepper label={t.booking.adults} value={adults} min={1} max={12} onChange={(n) => onStay({ adults: n })} />
            <Stepper label={t.booking.children} value={children} min={0} max={8} onChange={(n) => onStay({ children: n })} />
            <p className="text-[13px] text-[#F4EEE2]/55">{t.booking.ageNote}</p>
          </div>

          {note ? (
            <p role="status" className="text-[14px] leading-snug text-[#E68C4C]">
              {note}
            </p>
          ) : null}

          {ready && href ? (
            <a
              href={href}
              onClick={countBookingHandoff}
              className={`group mt-auto inline-flex w-full items-center justify-between gap-2 bg-[#D97D3D] py-2 pl-5 pr-2 text-[15px] font-semibold text-[#15130F] transition-[transform,background-color] duration-150 ease-out hover:bg-[#E68C4C] active:scale-[0.98] ${FOCUS}`}
            >
              <span>
                {t.cta.check}
                <span className="font-normal"> · {nights} {nights === 1 ? t.booking.night : t.booking.nights}</span>
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#15130F]/10 transition-transform duration-150 ease-out group-hover:-translate-y-px group-hover:translate-x-0.5">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="mt-auto inline-flex w-full cursor-not-allowed items-center justify-center border border-dashed px-5 py-3.5 text-[15px] font-semibold"
              style={{ borderColor: 'rgba(217,125,61,0.55)', color: 'rgba(217,125,61,0.9)' }}
            >
              {start ? t.booking.chooseCheckout : t.booking.pickDate}
            </button>
          )}

          <p className="text-[13px] leading-relaxed text-[#F4EEE2]/55">
            {t.booking.pricesNext}
            {looksFull ? (
              <span aria-live="polite" className="mt-1.5 block text-[#E68C4C]">
                {t.booking.mayBeFull}
              </span>
            ) : null}
          </p>
        </aside>
      </div>
    </div>
  )
}
