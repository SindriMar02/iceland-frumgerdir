/**
 * The date picker: react-aria's DateRangePicker, dressed in the farm's own
 * type and colour.
 *
 * WHY THIS ENGINE (adopted via 21st.dev → HeroUI Range Calendar, whose core is
 * exactly this): range selection with unavailable dates is a state machine
 * full of edge cases — keyboard navigation, focus containment, screen-reader
 * grammar, ranges that must not span a sold-out night. react-aria ships all of
 * that as behaviour with no styling, which is precisely the right shape for a
 * build that must look like Nýpugarðar and nothing else. The styled HeroUI
 * wrapper was rejected because it imports a global stylesheet, and a shared
 * app serving ~120 previews cannot afford style bleed.
 *
 * WHAT COUNTS AS UNAVAILABLE: a night is greyed only when the build-time
 * snapshot says NO room type has inventory for it AND none for the night
 * before — the second half keeps a valid check-out morning selectable after a
 * free last night. The snapshot ages between deploys, so this is a courtesy
 * grid, not a promise: the handoff to Godo stays live regardless, and Godo
 * remains the only authority (avail.ts).
 */

import { useMemo } from 'react'
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DateRangePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  I18nProvider,
  Popover,
  RangeCalendar,
} from 'react-aria-components'
import type { DateValue } from 'react-aria-components'
import { CalendarDate } from '@internationalized/date'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { addDays, startOfDay } from './godo'
import { anyRoomFree, availKnown } from './avail'
import type { Copy, Lang } from './copy'

const PAPER = '#F4EEE2'
const HAIR = 'rgba(244,238,226,0.14)'
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const toCal = (d: Date) => new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
const fromCal = (c: DateValue) => new Date(c.year, c.month - 1, c.day)

/** Mono field label, same voice as the stepper labels beside it. */
function FieldLabel({ children }: { children: string }) {
  return (
    <span
      className="font-mono text-[10px] uppercase tracking-[0.16em]"
      style={{ color: 'rgba(244,238,226,0.55)' }}
    >
      {children}
    </span>
  )
}

function Segments({ slot }: { slot: 'start' | 'end' }) {
  return (
    <DateInput
      slot={slot}
      className="flex h-11 items-center font-erode text-lg leading-none tracking-tight md:h-8"
    >
      {(segment) => (
        <DateSegment
          segment={segment}
          className="rounded-[2px] px-px tabular-nums caret-transparent outline-none data-[placeholder]:text-[#F4EEE2]/40 data-[focused]:bg-[#D97D3D]/25 data-[focused]:text-[#F4EEE2]"
          style={{ color: PAPER }}
        />
      )}
    </DateInput>
  )
}

function Month({ offset }: { offset?: number }) {
  return (
    <CalendarGrid
      offset={offset ? { months: offset } : undefined}
      weekdayStyle="short"
      className="border-separate border-spacing-y-0.5"
    >
      <CalendarGridHeader>
        {(day) => (
          <CalendarHeaderCell className="pb-2 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-[#F4EEE2]/45">
            {day}
          </CalendarHeaderCell>
        )}
      </CalendarGridHeader>
      <CalendarGridBody>
        {(date) => (
          <CalendarCell
            date={date}
            className={[
              'grid h-10 w-10 select-none place-items-center text-[13px] tabular-nums outline-none [touch-action:manipulation] md:h-9 md:w-9',
              'text-[#F4EEE2]/85',
              /* transitions, not keyframes: cells re-render constantly while a
               * range is being dragged out, and a transition retargets. */
              'transition-[background-color,color,opacity] duration-150',
              'data-[outside-month]:invisible',
              'data-[disabled]:opacity-25',
              /* sold out on our snapshot: kept visible, struck, not clickable */
              'data-[unavailable]:cursor-not-allowed data-[unavailable]:text-[#F4EEE2]/30 data-[unavailable]:line-through',
              /* the span between the endpoints */
              'data-[selected]:bg-[#D97D3D]/[0.16] data-[selected]:text-[#F4EEE2]',
              /* the endpoints themselves: ember, ink text, square — the
               * page's own CTA geometry, not a pill from someone else's kit */
              'data-[selection-start]:!bg-[#D97D3D] data-[selection-start]:!text-[#15130F] data-[selection-start]:font-semibold',
              'data-[selection-end]:!bg-[#D97D3D] data-[selection-end]:!text-[#15130F] data-[selection-end]:font-semibold',
              'data-[hovered]:bg-[#F4EEE2]/10',
              'data-[focus-visible]:ring-2 data-[focus-visible]:ring-[#D97D3D] data-[focus-visible]:ring-offset-1 data-[focus-visible]:ring-offset-[#15130F]',
            ].join(' ')}
          />
        )}
      </CalendarGridBody>
    </CalendarGrid>
  )
}

export default function DateRangeField({
  checkin,
  checkout,
  onRange,
  lang,
  t,
  months = 1,
  today,
  className = '',
}: {
  checkin: Date
  checkout: Date
  onRange: (checkin: Date, checkout: Date) => void
  lang: Lang
  t: Copy
  /** Calendar months shown in the popover: 1 in the narrow hero card, 2 wide. */
  months?: 1 | 2
  today: Date
  className?: string
}) {
  const minValue = useMemo(() => toCal(today), [today])
  const value = useMemo(
    () => ({ start: toCal(checkin), end: toCal(checkout) }),
    [checkin, checkout],
  )

  /* Checkout-friendly: a date is blocked only when neither it nor the night
   * before can be slept, so the morning after a bookable night stays open. */
  const unavailable = useMemo(() => {
    if (!availKnown()) return undefined
    return (date: DateValue) => {
      const d = fromCal(date)
      return !anyRoomFree(d) && !anyRoomFree(addDays(d, -1))
    }
  }, [])

  return (
    <I18nProvider locale={lang === 'is' ? 'is-IS' : 'en-GB'}>
      <DateRangePicker
        aria-label={t.booking.datesAria}
        value={value}
        minValue={minValue}
        isDateUnavailable={unavailable}
        onChange={(range) => {
          if (!range) return
          const start = startOfDay(fromCal(range.start))
          let end = startOfDay(fromCal(range.end))
          if (end <= start) end = addDays(start, 1)
          onRange(start, end)
        }}
        className={className}
      >
        <Group className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
          <label className="flex min-w-0 flex-col gap-2">
            <FieldLabel>{t.booking.arriving}</FieldLabel>
            <Segments slot="start" />
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <FieldLabel>{t.booking.leaving}</FieldLabel>
            <Segments slot="end" />
          </label>
          <Button
            aria-label={t.booking.openCalendar}
            className="grid h-11 w-11 place-items-center border transition-[transform,border-color] duration-[160ms] ease-out hover:border-[#F4EEE2]/45 active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97D3D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15130F] md:h-8 md:w-8"
            style={{ borderColor: HAIR, color: PAPER }}
          >
            <CalendarDays className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </Group>

        <Popover
          placement="bottom start"
          offset={10}
          className="nyp-cal-pop"
          /* Scale from the trigger's corner, per the popover-origin rule; a
           * modal would stay centred, this must not. */
          style={{ transformOrigin: 'top left' }}
        >
          <Dialog
            className="border p-4 outline-none md:p-5"
            style={{
              background: 'rgba(21,19,15,0.98)',
              borderColor: HAIR,
              boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
            }}
          >
            <RangeCalendar
              value={value}
              minValue={minValue}
              isDateUnavailable={unavailable}
              visibleDuration={{ months }}
              firstDayOfWeek="mon"
              /* w-fit so the month grid, not the legend text, decides how wide
               * the panel is — otherwise the legend's max-content width
               * stretches the dialog to the viewport and the grid sits off to
               * the left of its own popover. */
              className="w-fit outline-none"
            >
              <header className="mb-3 flex items-center justify-between gap-3">
                <Heading className="font-erode text-lg tracking-tight" style={{ color: PAPER }} />
                <div className="flex items-center gap-1.5">
                  <Button
                    slot="previous"
                    aria-label={t.booking.prevMonth}
                    className="grid h-9 w-9 place-items-center border transition-[transform,border-color] duration-[160ms] ease-out hover:border-[#F4EEE2]/45 active:scale-[0.97] motion-reduce:active:scale-100 disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97D3D]"
                    style={{ borderColor: HAIR, color: PAPER }}
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </Button>
                  <Button
                    slot="next"
                    aria-label={t.booking.nextMonth}
                    className="grid h-9 w-9 place-items-center border transition-[transform,border-color] duration-[160ms] ease-out hover:border-[#F4EEE2]/45 active:scale-[0.97] motion-reduce:active:scale-100 disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97D3D]"
                    style={{ borderColor: HAIR, color: PAPER }}
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </Button>
                </div>
              </header>
              <div className={months === 2 ? 'flex gap-8' : ''}>
                <Month />
                {months === 2 ? <Month offset={1} /> : null}
              </div>
              {/* Legend width: w-0 + min-w-full takes the grid's width instead
                * of contributing its own, so a long sentence wraps rather than
                * widening the panel. */}
              {availKnown() ? (
                <p
                  className="mt-3 w-0 min-w-full border-t pt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em]"
                  style={{ borderColor: HAIR, color: 'rgba(244,238,226,0.6)' }}
                >
                  {t.booking.strikeNote}
                </p>
              ) : null}
            </RangeCalendar>
          </Dialog>
        </Popover>
      </DateRangePicker>

      {/* Popover entrance: 180ms ease-out from 98% + fade; exit instant-fast.
        * Written as a plain style tag with prefixed selectors so nothing
        * leaks into the other previews sharing this app. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
.nyp-cal-pop[data-entering] { animation: nypCalIn 0.18s ${EASE}; }
/* ease-OUT on the way out too. ease-in delays the frames the user is watching
 * hardest — the moment they clicked to dismiss — and reads as the panel
 * sticking to the cursor before it goes. */
.nyp-cal-pop[data-exiting] { animation: nypCalOut 0.12s ${EASE} forwards; }
@keyframes nypCalIn { from { opacity: 0; transform: scale(0.98) translateY(-4px); } }
@keyframes nypCalOut { to { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  /* Gentler, not gone: the scale and the lift go, a short fade stays so the
   * panel still reads as arriving and leaving rather than blinking. */
  .nyp-cal-pop[data-entering] { animation: nypCalFade 0.12s linear; }
  .nyp-cal-pop[data-exiting] { animation: nypCalOut 0.12s linear forwards; }
  @keyframes nypCalFade { from { opacity: 0; } }
}
`,
        }}
      />
    </I18nProvider>
  )
}
