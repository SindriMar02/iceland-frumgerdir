import { useId, useMemo, useState } from 'react'
import { ArrowUpRight, Minus, Plus } from 'lucide-react'
import {
  bookingHref,
  bookingReady,
  inputDate,
  nightsBetween,
  parseInputDate,
  PLACEHOLDER_NOTE,
  type GodoRoomKey,
} from './godo'

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
 */

const PAPER = '#F4EEE2'
const INK = '#15130F'
const EMBER = '#D97D3D'
const EMBER_LIFT = '#E68C4C'
const HAIR = 'rgba(244,238,226,0.14)'
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97D3D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15130F]'

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
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
          className={`grid h-11 w-11 place-items-center border transition-colors disabled:opacity-30 md:h-8 md:w-8 ${FOCUS}`}
          style={{ borderColor: HAIR, color: PAPER }}
        >
          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
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
          className={`grid h-11 w-11 place-items-center border transition-colors disabled:opacity-30 md:h-8 md:w-8 ${FOCUS}`}
          style={{ borderColor: HAIR, color: PAPER }}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default function BookingBar({
  room = null,
  className = '',
  label = 'Check availability',
}: {
  /** Focus the booking page on one unit type, when placed inside a room card. */
  room?: GodoRoomKey | null
  className?: string
  label?: string
}) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [checkin, setCheckin] = useState<Date>(() => addDays(today, 1))
  const [checkout, setCheckout] = useState<Date>(() => addDays(today, 3))
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const inId = useId()
  const outId = useId()

  const nights = nightsBetween(checkin, checkout)
  const ready = bookingReady()

  const href = bookingHref({ checkin, checkout, adults, children, room, lang: 'en' })

  function onCheckin(v: string) {
    const d = parseInputDate(v)
    if (!d) return
    setCheckin(d)
    if (checkout <= d) setCheckout(addDays(d, 1))
  }
  function onCheckout(v: string) {
    const d = parseInputDate(v)
    if (!d) return
    setCheckout(d > checkin ? d : addDays(checkin, 1))
  }

  /** h-8 matches the stepper buttons so every label in the row shares a baseline. */
  const field =
    'h-8 w-full bg-transparent font-erode text-lg leading-8 tracking-tight [color-scheme:dark] ' +
    FOCUS

  return (
    <div
      className={`border ${className}`}
      style={{ borderColor: HAIR, background: 'rgba(244,238,226,0.03)' }}
    >
      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1fr_1fr_auto_auto_auto] md:items-end md:gap-7">
        <div className="flex flex-col gap-2">
          <label
            htmlFor={inId}
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: 'rgba(244,238,226,0.55)' }}
          >
            Arriving
          </label>
          <input
            id={inId}
            type="date"
            value={inputDate(checkin)}
            min={inputDate(today)}
            onChange={(e) => onCheckin(e.target.value)}
            className={field}
            style={{ color: PAPER }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={outId}
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: 'rgba(244,238,226,0.55)' }}
          >
            Leaving
          </label>
          <input
            id={outId}
            type="date"
            value={inputDate(checkout)}
            min={inputDate(addDays(checkin, 1))}
            onChange={(e) => onCheckout(e.target.value)}
            className={field}
            style={{ color: PAPER }}
          />
        </div>

        <Stepper label="Adults" value={adults} min={1} max={12} onChange={setAdults} />
        <Stepper label="Children" value={children} min={0} max={8} onChange={setChildren} />

        {ready && href ? (
          <a
            href={href}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 font-supreme text-[15px] font-semibold transition-[transform,background-color] duration-200 ease-out active:scale-[0.98] ${FOCUS}`}
            style={{ background: EMBER, color: INK }}
            onMouseEnter={(e) => (e.currentTarget.style.background = EMBER_LIFT)}
            onMouseLeave={(e) => (e.currentTarget.style.background = EMBER)}
          >
            {label}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-describedby={`${inId}-placeholder`}
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 border border-dashed px-6 py-3.5 font-supreme text-[15px] font-semibold"
            style={{ borderColor: 'rgba(217,125,61,0.55)', color: 'rgba(217,125,61,0.85)' }}
          >
            {label}
          </button>
        )}
      </div>

      <p
        className="border-t px-5 py-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] sm:px-6"
        style={{ borderColor: HAIR, color: 'rgba(244,238,226,0.45)' }}
        id={ready ? undefined : `${inId}-placeholder`}
      >
        {ready ? (
          <>
            {nights} {nights === 1 ? 'night' : 'nights'} · guests 7 and older count as adults ·
            prices shown on the next step
          </>
        ) : (
          <>
            {nights} {nights === 1 ? 'night' : 'nights'} · {PLACEHOLDER_NOTE}
          </>
        )}
      </p>
    </div>
  )
}
