/**
 * Nýpugarðar — the stay calendar.
 *
 * The same picker as our other builds (reference: Aurora Hills StayPicker,
 * see [[booking-range-calendar-pattern]]), restyled to this site: an inline
 * month grid, not a popover, with booked nights struck through, the stay drawn
 * as one bar with two rounded ends, and the range previewed under the pointer
 * while the checkout is being chosen.
 *
 * WHAT "BOOKED" MEANS HERE. Godo's inventory for all seven room types is
 * fetched at build time (tools/nypugardar-prices.mjs, also on every deploy)
 * into prices.json. A night is struck when no room type has anything left for
 * it (avail.ts). That snapshot is a courtesy, not the authority: the handoff to
 * Godo stays live for any range, Godo checks the real inventory, and once the
 * snapshot is older than avail.ts allows, nothing is struck at all.
 *
 * THE RULES (ported, including the one that is easy to get backwards):
 *   - nothing chosen, a finished stay, or a day on/before check-in starts over;
 *   - tapping the chosen check-in clears the stay, the chosen checkout clears
 *     the checkout;
 *   - a struck day cannot be a CHECK-IN, but it is a legal CHECKOUT, because
 *     you leave that morning; so the crossing test runs over [start, end-1];
 *   - a range crossing a fully booked night is refused, and the reason is said.
 *
 * HYDRATION. The first render uses `today` from useStay, which is the
 * snapshot date (bundled, identical on the build machine and in the browser),
 * and opens on the month of the stay, so the prerendered grid and the client's
 * first grid are the same markup. The real clock arrives one tick later.
 *
 * Two months side by side when the calendar's own column is wide enough
 * (container query), one on a phone. Always six rows, so paging never jumps.
 */
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Copy, Lang } from './copy'
import { addDays, nightsBetween, startOfDay } from './godo'
import { anyRoomFree } from './avail'

const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const same = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const lead = (first.getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, i) => {
    const date = addDays(first, i - lead)
    return { date, inMonth: date.getMonth() === month.getMonth() }
  })
}

export function fmtLong(d: Date, t: Copy, lang: Lang) {
  const m = t.booking.months[d.getMonth()]
  return lang === 'is' ? `${d.getDate()}. ${m} ${d.getFullYear()}` : `${d.getDate()} ${m} ${d.getFullYear()}`
}
export function fmtShort(d: Date, t: Copy, lang: Lang) {
  const w = t.booking.weekdaysShort[(d.getDay() + 6) % 7]
  const m = t.booking.months[d.getMonth()].slice(0, 3)
  return lang === 'is' ? `${w} ${d.getDate()}. ${m}` : `${w} ${d.getDate()} ${m}`
}

export default function StayCalendar({
  start,
  end,
  today,
  t,
  lang,
  onChange,
  onNote,
  availReady,
}: {
  start: Date | null
  end: Date | null
  today: Date
  t: Copy
  lang: Lang
  /** Called with the new selection. A completed stay has both. */
  onChange: (start: Date | null, end: Date | null) => void
  onNote: (note: string | null) => void
  /** False on the server and the first client render: whether the snapshot is
   *  still fresh depends on the visitor's clock, so struck nights appear only
   *  after mount and the prerendered grid can never disagree with hydration. */
  availReady: boolean
}) {
  const [month, setMonth] = useState<Date>(() => new Date((start ?? today).getFullYear(), (start ?? today).getMonth(), 1))
  const [hover, setHover] = useState<Date | null>(null)
  const booked = (d: Date) => availReady && !anyRoomFree(d)

  function pick(day: Date) {
    if (day < startOfDay(today)) return
    if (end && same(day, end)) { onChange(start, null); onNote(null); return }
    if (same(day, start)) { onChange(null, null); onNote(null); return }
    if (!start || end || day <= start) {
      if (booked(day)) { onNote(t.booking.takenDay.replace('{date}', fmtLong(day, t, lang))); return }
      onChange(day, null); onNote(null); return
    }
    const n = nightsBetween(start, day)
    for (let i = 0; i < n; i++) {
      if (booked(addDays(start, i))) { onNote(t.booking.crossesBooked); return }
    }
    onChange(start, day); onNote(null)
  }

  const previewEnd = start && !end && hover && hover > start ? hover : null
  const to = end ?? previewEnd
  const canGoBack = month > new Date(today.getFullYear(), today.getMonth(), 1)
  const months = [month, addMonths(month, 1)]
  const title = (m: Date) => `${t.booking.months[m.getMonth()]} ${m.getFullYear()}`

  return (
    <div className="@container/cal min-w-0">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, -1))}
          disabled={!canGoBack}
          aria-label={t.booking.prevMonth}
          className="grid h-11 w-11 touch-manipulation place-items-center border border-[#F4EEE2]/15 text-[#F4EEE2] transition-[transform,border-color] duration-150 ease-out hover:border-[#F4EEE2]/45 active:scale-[0.97] disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4EEE2] md:h-9 md:w-9"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <p className="flex-1 text-center font-erode text-lg font-light @min-[34rem]/cal:hidden" aria-live="polite">
          {title(months[0])}
        </p>
        <p className="hidden flex-1 grid-cols-2 text-center font-erode text-lg font-light @min-[34rem]/cal:grid" aria-live="polite">
          <span>{title(months[0])}</span>
          <span>{title(months[1])}</span>
        </p>
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, 1))}
          aria-label={t.booking.nextMonth}
          className="grid h-11 w-11 touch-manipulation place-items-center border border-[#F4EEE2]/15 text-[#F4EEE2] transition-[transform,border-color] duration-150 ease-out hover:border-[#F4EEE2]/45 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4EEE2] md:h-9 md:w-9"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div
        className="mt-5 grid gap-8 @min-[34rem]/cal:grid-cols-2"
        onPointerLeave={() => setHover(null)}
      >
        {months.map((m, mi) => (
          <div key={mi} className={mi === 1 ? 'hidden @min-[34rem]/cal:block' : ''}>
            <div className="grid grid-cols-7 pb-2" aria-hidden="true">
              {t.booking.weekdayInitials.map((w, i) => (
                <span key={i} className="text-center font-fragment text-[11px] uppercase text-[#F4EEE2]/50">
                  {w}
                </span>
              ))}
            </div>
            {/* A flat group of buttons in a CSS grid, each naming its own full
                date and state. Columns are flush so the stay reads as one bar. */}
            <div role="group" aria-label={title(m)} className="grid grid-cols-7 gap-y-1">
              {monthGrid(m).map(({ date, inMonth }, i) => {
                const past = date < startOfDay(today)
                const dead = past || !inMonth
                const isB = inMonth && !past && booked(date)
                const isStart = same(date, start)
                const isEnd = same(date, end) || (!end && same(date, previewEnd))
                const mid = !!start && !!to && date > start && date < to
                const label = `${fmtLong(date, t, lang)}${isB ? `, ${t.booking.bookedWord}` : ''}${isStart ? `, ${t.booking.checkIn.toLowerCase()}` : ''}${same(date, end) ? `, ${t.booking.checkOut.toLowerCase()}` : ''}`
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={dead}
                    tabIndex={dead ? -1 : 0}
                    aria-label={inMonth ? label : undefined}
                    aria-hidden={inMonth ? undefined : true}
                    aria-pressed={isStart || same(date, end) || undefined}
                    onClick={() => pick(date)}
                    onPointerEnter={() => setHover(date)}
                    onFocus={() => setHover(date)}
                    className={`group relative h-10 touch-manipulation font-fragment text-[13px] tabular-nums outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F4EEE2] sm:h-11 ${
                      !inMonth ? 'invisible' : ''
                    }`}
                  >
                    {/* the bar */}
                    {(mid || (isStart && to) || (isEnd && start)) && inMonth ? (
                      <span
                        aria-hidden="true"
                        className={`absolute inset-y-0.5 bg-[#D97D3D]/22 ${isStart ? 'left-1/2 right-0' : isEnd ? 'left-0 right-1/2' : 'inset-x-0'}`}
                        style={{ opacity: !end ? 0.7 : 1 }}
                      />
                    ) : null}
                    {/* the caps */}
                    {(isStart || isEnd) && inMonth ? (
                      <span
                        aria-hidden="true"
                        className={`absolute inset-y-0.5 left-1/2 aspect-square -translate-x-1/2 rounded-full ${
                          isStart || end ? 'bg-[#D97D3D]' : 'border border-[#D97D3D] bg-[#15130F]'
                        }`}
                      />
                    ) : null}
                    {!dead && !isStart && !isEnd && !mid ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0.5 left-1/2 aspect-square -translate-x-1/2 rounded-full bg-[#F4EEE2]/0 transition-colors duration-150 [@media(hover:hover)]:group-hover:bg-[#F4EEE2]/10"
                      />
                    ) : null}
                    <span
                      className={`relative ${
                        isStart || (isEnd && end)
                          ? 'text-[#15130F]'
                          : past
                            ? 'text-[#F4EEE2]/25'
                            : isB
                              ? 'text-[#F4EEE2]/35 line-through decoration-[#F4EEE2]/50'
                              : 'text-[#F4EEE2]'
                      } ${same(date, today) && !isStart && !isEnd ? 'underline decoration-[#D97D3D] decoration-2 underline-offset-4' : ''}`}
                    >
                      {date.getDate()}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
