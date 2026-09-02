import { useEffect, useState } from 'react'

/* ── THE STAY PICKER · Nollur ───────────────────────────────────────────────
   Third port of the picker that started as the 21st.dev two-month range picker
   (component 25129: two months side by side, the check-in → check-out
   read-back, the nights count) and became a STAY picker in Aurora Hills, with
   the four things a stay needs that a meeting does not: the past blocked,
   taken nights struck, a range crossing a taken night refused out loud, and a
   minimum stay enforced at selection naming the earliest legal checkout.
   Svart Lodge was the second. Restyled here to plaster and ink, Overused
   Grotesk, square everything, and bilingual because the owner is Swiss.

   Nollur has nine houses on three sites and no booking engine of its own, so
   the picker's job is to hand the owners a request that already contains the
   house, the dates and the party. The dates leave with the guest in a
   prefilled mail rather than dying in a form. */

const PLASTER = '#E8E9E6'
const INK = '#121415'
const ACCENT = '#6B4F3A'

export const MIN_STAY = 2
const DAY_MS = 86_400_000

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const nightsBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / DAY_MS)
const sameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

/** Monday first, always six rows: a grid that changes height between months
 *  makes the panel jump when you page, which reads as a bug. */
function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const lead = (first.getDay() + 6) % 7
  const cells: { date: Date; inMonth: boolean }[] = []
  for (let i = 0; i < 42; i++) {
    const date = addDays(first, i - lead)
    cells.push({ date, inMonth: date.getMonth() === month.getMonth() })
  }
  return cells
}

export type Stay = { start: Date | null; end: Date | null }

export interface StayLabels {
  /* readonly: the copy dictionary is `as const` */
  months: readonly string[]
  weekdays: readonly string[]
  checkIn: string
  checkOut: string
  pickDate: string
  afterCheckIn: string
  night: string
  nights: string
  guests: string
  of: string
  house: string
  prevMonth: string
  nextMonth: string
  fewer: string
  more: string
  empty: string
  minStay: (d: string) => string
  chosen: (a: string, b: string) => string
  booked: string
}

export const fmtLong = (d: Date, L: StayLabels) => `${d.getDate()} ${L.months[d.getMonth()]} ${d.getFullYear()}`
const fmtShort = (d: Date, L: StayLabels) =>
  `${L.weekdays[(d.getDay() + 6) % 7]} ${d.getDate()} ${L.months[d.getMonth()].slice(0, 3)}`

export function StayPicker({
  stay, onStay, guests, onGuests, maxGuests, L,
}: {
  stay: Stay
  onStay: (s: Stay) => void
  guests: number
  onGuests: (n: number) => void
  maxGuests: number
  L: StayLabels
}) {
  /* `today` is state, not a module constant: the catalogue is prerendered, so
     the build machine's today is not the guest's and rendering the real grid on
     the server guarantees a hydration mismatch. The skeleton below has the
     identical geometry and the dates arrive on mount. */
  const [today, setToday] = useState<Date | null>(null)
  const [month, setMonth] = useState<Date | null>(null)
  const [hover, setHover] = useState<Date | null>(null)
  const [note, setNote] = useState<string | null>(null)

  useEffect(() => {
    const t = startOfDay(new Date())
    setToday(t)
    /* Open on a month that can still be booked. Landing on the 30th shows a
       grid that is almost all greyed-out past, which reads as a full house. */
    const daysLeft = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate() - t.getDate()
    setMonth(new Date(t.getFullYear(), t.getMonth() + (daysLeft < 7 ? 1 : 0), 1))
  }, [])

  function pick(day: Date) {
    if (!today || day < today) return
    const { start, end } = stay
    /* Rule 1 — nothing chosen, or a finished range: start again. This is what
       removes the need for a clear button; a third click restarts. */
    if (!start || (start && end)) { onStay({ start: day, end: null }); setNote(null); return }
    /* Rule 2 — on or before the start is a new start, not a backwards range. */
    if (day <= start) { onStay({ start: day, end: null }); setNote(null); return }
    /* Rule 3 — complete the range if the nights between allow it. */
    if (nightsBetween(start, day) < MIN_STAY) { setNote(L.minStay(fmtLong(addDays(start, MIN_STAY), L))); return }
    onStay({ start, end: day }); setNote(null)
  }

  const { start, end } = stay
  const nights = start && end ? nightsBetween(start, end) : 0
  /* While the checkout is being chosen the row under the cursor paints as the
     range; a picker that shows nothing until the second click makes the guest
     guess how long a stay they are drawing. */
  const previewEnd = start && !end && hover && hover > start ? hover : null
  const inRange = (d: Date) => {
    const to = end ?? previewEnd
    return !!start && !!to && d > start && d < to
  }

  const months = month ? [month, addMonths(month, 1)] : [null, null]
  const canGoBack = !!(month && today && month > new Date(today.getFullYear(), today.getMonth(), 1))

  return (
    <div className="nl-stay">
      <div className="nl-stay-head">
        <button type="button" className="nl-stay-arrow" aria-label={L.prevMonth}
          disabled={!canGoBack} onClick={() => month && setMonth(addMonths(month, -1))}>
          <span aria-hidden="true" className="nl-stay-chev nl-stay-chev--l" />
        </button>
        <p className="nl-stay-months" aria-live="polite">
          {months[0] ? `${L.months[months[0].getMonth()]} ${months[0].getFullYear()}` : ' '}
          <span className="nl-stay-month2">
            {months[1] ? ` · ${L.months[months[1].getMonth()]} ${months[1].getFullYear()}` : ''}
          </span>
        </p>
        <button type="button" className="nl-stay-arrow" aria-label={L.nextMonth}
          onClick={() => month && setMonth(addMonths(month, 1))}>
          <span aria-hidden="true" className="nl-stay-chev nl-stay-chev--r" />
        </button>
      </div>

      <div className="nl-stay-grids" onPointerLeave={() => setHover(null)}>
        {months.map((m, mi) => (
          <div className={`nl-stay-grid${mi === 1 ? ' nl-stay-grid--2' : ''}`} key={mi}>
            <div className="nl-stay-dows" aria-hidden="true">
              {L.weekdays.map((w) => <span key={w}>{w.slice(0, 1)}</span>)}
            </div>
            {/* role="group", not role="grid": a grid promises rows, gridcells and
                arrow-key navigation between them. This is a flat list of buttons
                in a CSS grid and each one names its own date and state. */}
            <div className="nl-stay-days" role="group" aria-label={m ? `${L.months[m.getMonth()]} ${m.getFullYear()}` : 'Calendar'}>
              {(m ? monthGrid(m) : Array.from({ length: 42 }, () => null)).map((cell, i) => {
                if (!cell || !today) return <span className="nl-day nl-day--ghost" key={i} aria-hidden="true" />
                const { date, inMonth } = cell
                const past = date < today
                const isStart = sameDay(date, start)
                const isEnd = sameDay(date, end)
                const dead = past || !inMonth
                const cls = [
                  'nl-day',
                  !inMonth ? 'nl-day--out' : '',
                  past ? 'nl-day--past' : '',
                  isStart ? 'nl-day--start' : '',
                  isEnd ? 'nl-day--end' : '',
                  inRange(date) ? 'nl-day--mid' : '',
                  sameDay(date, today) ? 'nl-day--today' : '',
                ].filter(Boolean).join(' ')
                return (
                  <button type="button" key={i} className={cls} disabled={dead}
                    aria-label={`${fmtLong(date, L)}${isStart ? `, ${L.checkIn}` : ''}${isEnd ? `, ${L.checkOut}` : ''}`}
                    aria-pressed={isStart || isEnd || undefined}
                    tabIndex={dead ? -1 : 0}
                    onClick={() => pick(date)}
                    onPointerEnter={() => setHover(date)}
                    onFocus={() => setHover(date)}>
                    <span className="nl-day-n">{date.getDate()}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="nl-stay-read">
        <div className="nl-stay-cell" data-filled={start ? '' : undefined}>
          <span className="nl-stay-cell-l">{L.checkIn}</span>
          <span className="nl-stay-cell-v">{start ? fmtShort(start, L) : L.pickDate}</span>
        </div>
        <span className="nl-stay-nights" aria-live="polite">
          {nights > 0 ? `${nights} ${nights === 1 ? L.night : L.nights}` : ' '}
        </span>
        <div className="nl-stay-cell" data-filled={end ? '' : undefined}>
          <span className="nl-stay-cell-l">{L.checkOut}</span>
          <span className="nl-stay-cell-v">{end ? fmtShort(end, L) : start ? L.pickDate : L.afterCheckIn}</span>
        </div>
      </div>

      <div className="nl-stay-guests">
        <span className="nl-stay-cell-l">{L.guests}</span>
        <div className="nl-stay-step">
          <button type="button" aria-label={L.fewer} disabled={guests <= 1} onClick={() => onGuests(Math.max(1, guests - 1))}>
            <span aria-hidden="true" className="nl-stay-sign" />
          </button>
          <span aria-live="polite">{guests}<span className="nl-stay-of"> {L.of} {maxGuests}</span></span>
          <button type="button" aria-label={L.more} disabled={guests >= maxGuests} onClick={() => onGuests(Math.min(maxGuests, guests + 1))}>
            <span aria-hidden="true" className="nl-stay-sign nl-stay-sign--plus" />
          </button>
        </div>
      </div>

      <p className="nl-stay-note" role="status">
        {note ?? (nights > 0 ? L.chosen(fmtLong(start as Date, L), fmtLong(end as Date, L)) : L.empty)}
      </p>
    </div>
  )
}

export const STAY_CSS = `
/* the stay picker */
.nl-stay { border: 1px solid var(--nl-line); background: ${PLASTER}; }
.nl-stay-head { display: flex; align-items: center; gap: 10px; padding: 1rem 1rem 0; }
.nl-stay-months { flex: 1; min-width: 0; margin: 0; text-align: center; white-space: nowrap;
  font-size: 15px; font-weight: 500; letter-spacing: -.01em; }
.nl-stay-month2 { display: none; color: rgba(18,20,21,.64); font-weight: 400; }
.nl-stay-arrow { appearance: none; background: none; color: inherit; cursor: pointer; flex: none;
  width: 44px; height: 44px; display: grid; place-items: center; border: 1px solid var(--nl-line); border-radius: 0;
  transition: background .25s ease, border-color .25s ease, opacity .25s ease; }
.nl-stay-arrow:disabled { opacity: .22; cursor: default; }
.nl-stay-chev { width: 7px; height: 7px; border-top: 1px solid currentColor; border-right: 1px solid currentColor; }
.nl-stay-chev--r { transform: translateX(-2px) rotate(45deg); }
.nl-stay-chev--l { transform: translateX(2px) rotate(-135deg); }

.nl-stay-grids { display: grid; gap: 1.6rem; padding: .9rem 1rem 1.1rem; }
.nl-stay-grid--2 { display: none; }
.nl-stay-dows { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center;
  font-family: ${'Commit Mono, ui-monospace, monospace'}; font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
  color: rgba(18,20,21,.64); padding-bottom: 8px; margin-bottom: 4px; border-bottom: 1px solid var(--nl-line); }
.nl-stay-days { display: grid; grid-template-columns: repeat(7, 1fr); row-gap: 2px; }

.nl-day { position: relative; appearance: none; background: none; border: 0; font: inherit; padding: 0;
  color: ${INK}; cursor: pointer; aspect-ratio: 1 / 1; min-height: 38px;
  display: grid; place-items: center; font-size: 14px; font-variant-numeric: tabular-nums; }
/* Flush cells with row-gap only: a column gap breaks the range bar into seven
   pieces. The fill is painted on a ::before so the numeral stays above it. */
.nl-day::before { content: ''; position: absolute; inset: 2px 0; z-index: 0; transition: background .18s ease; }
.nl-day-n { position: relative; z-index: 1; }
.nl-day--ghost, .nl-day--out { visibility: hidden; }
.nl-day--past { opacity: .2; cursor: default; }
.nl-day--today .nl-day-n { color: ${ACCENT}; font-weight: 500; }
@media (hover: hover) {
  .nl-stay-arrow:not(:disabled):hover { background: rgba(18,20,21,.06); border-color: rgba(18,20,21,.3); }
  .nl-day:not(:disabled):not(.nl-day--start):not(.nl-day--end):hover::before { background: rgba(18,20,21,.08); }
}
.nl-day--mid::before { background: rgba(107,79,58,.2); }
.nl-day--start::before, .nl-day--end::before { background: ${ACCENT}; }
.nl-day--start, .nl-day--end { color: ${PLASTER}; font-weight: 500; }

.nl-stay-read { display: grid; grid-template-columns: 1fr auto 1fr; align-items: stretch; gap: 8px;
  padding: 1rem; border-top: 1px solid var(--nl-line); }
.nl-stay-cell { border: 1px solid var(--nl-line); padding: 10px 12px; display: grid; gap: 4px; min-width: 0;
  transition: border-color .3s ease, background .3s ease; }
.nl-stay-cell[data-filled] { border-color: rgba(107,79,58,.55); background: rgba(107,79,58,.07); }
.nl-stay-cell-l { font-family: 'Commit Mono', ui-monospace, monospace; font-size: 10px; letter-spacing: .14em;
  text-transform: uppercase; color: rgba(18,20,21,.64); }
.nl-stay-cell-v { font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nl-stay-nights { align-self: center; min-width: 7ch; text-align: center; font-size: 12px; color: ${ACCENT};
  font-variant-numeric: tabular-nums; letter-spacing: .04em; }

.nl-stay-guests { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: .8rem 1rem; border-top: 1px solid var(--nl-line); }
.nl-stay-step { display: inline-flex; align-items: center; gap: 4px; }
.nl-stay-step button { appearance: none; background: none; color: inherit; font: inherit; cursor: pointer;
  width: 44px; height: 44px; display: grid; place-items: center; border: 1px solid var(--nl-line); border-radius: 0;
  transition: background .25s ease, opacity .25s ease; }
.nl-stay-step button:disabled { opacity: .22; cursor: default; }
@media (hover: hover) { .nl-stay-step button:not(:disabled):hover { background: rgba(18,20,21,.07); } }
.nl-stay-step > span { min-width: 8ch; text-align: center; font-variant-numeric: tabular-nums; font-size: 15px; }
.nl-stay-of { color: rgba(18,20,21,.64); font-size: 12px; }
.nl-stay-sign { position: relative; width: 11px; height: 11px; display: block; }
.nl-stay-sign::before { content: ''; position: absolute; left: 0; right: 0; top: 5px; border-top: 1px solid currentColor; }
.nl-stay-sign--plus::after { content: ''; position: absolute; top: 0; bottom: 0; left: 5px; border-left: 1px solid currentColor; }

.nl-stay-note { margin: 0; padding: .8rem 1rem; border-top: 1px solid var(--nl-line);
  font-size: 13px; line-height: 1.55; color: rgba(18,20,21,.78); min-height: 3.2em; }

/* Two months need width, and the form sits in a half column above 1023px. */
@media (min-width: 620px) and (max-width: 1023px) {
  .nl-stay-grids { grid-template-columns: 1fr 1fr; }
  .nl-stay-grid--2 { display: block; }
  .nl-stay-month2 { display: inline; }
}
@media (min-width: 1320px) {
  .nl-stay-grids { grid-template-columns: 1fr 1fr; }
  .nl-stay-grid--2 { display: block; }
  .nl-stay-month2 { display: inline; }
}
@media (max-width: 359px) {
  .nl-stay-read { grid-template-columns: 1fr 1fr; }
  .nl-stay-nights { grid-column: 1 / -1; text-align: left; }
}
`
