import { useEffect, useState } from 'react'
import { demo } from './demoStore'

/* ── THE STAY PICKER · Svart Lodge ──────────────────────────────────────────
   Ported from the shipped Aurora Hills picker (02-clients/aurora-hills/src/
   components/StayPicker.tsx), which is itself the 21st.dev two-month range
   picker (component 25129: two months side by side, the check-in → check-out
   read-back, the nights count) with the four things a STAY picker needs that
   a meeting picker does not: the past blocked, taken nights struck, a range
   that crosses a taken night refused out loud, and a minimum stay enforced at
   selection. Restyled to this build: square caps, no radius anywhere, haze
   fill, Familjen Grotesk, one month on a phone.

   The native <input type="date"> it replaces was the mobile breakage: on iOS
   it renders a "dd/mm/yyyy" stub and opens a system wheel, and the two
   <select> dropdowns beside it did the same. Nothing here is native chrome.

   AVAILABILITY IS NOT INVENTED. The only nights drawn as taken are the ones
   the owner has confirmed inside this demo's own store, so accepting a
   request in the dashboard strikes those nights out on the site. No fictional
   occupancy is ever shown on a real house. */

const HAZE = '#8FA8B0'
const HAZE_TEXT = '#B4C8CE'
const BLACK = '#0F1113'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const MIN_STAY = 2

const DAY_MS = 86_400_000
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const nightsBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / DAY_MS)
const sameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const fmtShort = (d: Date) => `${WEEKDAYS[(d.getDay() + 6) % 7]} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`
export const fmtLong = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`

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

export function StayPicker({
  stay, onStay, guests, onGuests, maxGuests,
}: {
  stay: Stay
  onStay: (s: Stay) => void
  guests: number
  onGuests: (n: number) => void
  maxGuests: number
}) {
  /* `today` is state, not a module constant. The catalogue is prerendered, so
     the build machine's today is not the guest's; rendering the real grid on
     the server guarantees a hydration mismatch. The skeleton below has the
     identical geometry (same header, same weekday row, same 42 cells) and the
     dates arrive on mount. No mismatch, no shift, nothing reads as empty. */
  const [today, setToday] = useState<Date | null>(null)
  const [month, setMonth] = useState<Date | null>(null)
  const [hover, setHover] = useState<Date | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [taken, setTaken] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const t = startOfDay(new Date())
    setToday(t)
    /* Open on a month that can still be booked. Landing on the 30th shows a
       grid that is almost entirely greyed-out past, which reads as a full
       house rather than as a month that has run out. */
    const daysLeft = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate() - t.getDate()
    setMonth(new Date(t.getFullYear(), t.getMonth() + (daysLeft < 7 ? 1 : 0), 1))
  }, [])

  useEffect(() => {
    const read = () => {
      const s = new Set<string>()
      for (const b of demo.all()) {
        if (b.status !== 'CONFIRMED' || !b.date) continue
        const from = startOfDay(new Date(`${b.date}T12:00:00`))
        const to = startOfDay(new Date(`${b.endDate ?? b.date}T12:00:00`))
        for (let d = from; d < to; d = addDays(d, 1)) s.add(dayKey(d))
      }
      setTaken(s)
    }
    read()
    return demo.subscribe(read)
  }, [])

  const isTaken = (d: Date) => taken.has(dayKey(d))

  /** A night is the date it starts on, so a stay of start..end occupies the
   *  nights start .. end-1. Checking out on a taken date is legal: you leave
   *  that morning and the next guest arrives that afternoon. Getting this
   *  backwards makes the picker refuse perfectly bookable stays. */
  const crossesTaken = (a: Date, b: Date) => {
    for (let d = a; d < b; d = addDays(d, 1)) if (isTaken(d)) return true
    return false
  }

  function pick(day: Date) {
    if (!today || day < today) return
    const { start, end } = stay
    if (isTaken(day) && (!start || end)) {
      setNote(`${fmtLong(day)} is already taken. The nights in grey are booked.`)
      return
    }
    /* Rule 1 — nothing chosen, or a finished range: start again. This is what
       removes the need for a clear button; a third click restarts. */
    if (!start || (start && end)) { onStay({ start: day, end: null }); setNote(null); return }
    /* Rule 2 — on or before the start is a new start, not a backwards range. */
    if (day <= start) { onStay({ start: day, end: null }); setNote(null); return }
    /* Rule 3 — complete the range if the nights between allow it. */
    if (crossesTaken(start, day)) {
      setNote('There is a booked night inside those dates. Pick a checkout before it, or start later.')
      return
    }
    if (nightsBetween(start, day) < MIN_STAY) {
      setNote(`Two nights is the shortest stay, so the earliest checkout is ${fmtLong(addDays(start, MIN_STAY))}.`)
      return
    }
    onStay({ start, end: day })
    setNote(null)
  }

  const { start, end } = stay
  const nights = start && end ? nightsBetween(start, end) : 0
  /* While the checkout is being chosen, the row under the cursor paints as if
     it were the range. A picker that shows nothing until the second click
     makes the guest guess how long a stay they are drawing. */
  const previewEnd = start && !end && hover && hover > start ? hover : null
  const inRange = (d: Date) => {
    const to = end ?? previewEnd
    return !!start && !!to && d > start && d < to
  }

  const months = month ? [month, addMonths(month, 1)] : [null, null]
  const canGoBack = !!(month && today && month > new Date(today.getFullYear(), today.getMonth(), 1))

  return (
    <div className="sl-stay">
      <div className="sl-stay-head">
        <button
          type="button" className="sl-stay-arrow" aria-label="Previous month"
          disabled={!canGoBack} onClick={() => month && setMonth(addMonths(month, -1))}
        >
          <span aria-hidden="true" className="sl-stay-chev sl-stay-chev--l" />
        </button>
        <p className="sl-stay-months" aria-live="polite">
          {months[0] ? `${MONTHS[months[0].getMonth()]} ${months[0].getFullYear()}` : ' '}
          <span className="sl-stay-month2">
            {months[1] ? ` · ${MONTHS[months[1].getMonth()]} ${months[1].getFullYear()}` : ''}
          </span>
        </p>
        <button
          type="button" className="sl-stay-arrow" aria-label="Next month"
          onClick={() => month && setMonth(addMonths(month, 1))}
        >
          <span aria-hidden="true" className="sl-stay-chev sl-stay-chev--r" />
        </button>
      </div>

      <div className="sl-stay-grids" onPointerLeave={() => setHover(null)}>
        {months.map((m, mi) => (
          <div className={`sl-stay-grid${mi === 1 ? ' sl-stay-grid--2' : ''}`} key={mi}>
            <div className="sl-stay-dows" aria-hidden="true">
              {WEEKDAYS.map((w) => <span key={w}>{w.slice(0, 1)}</span>)}
            </div>
            {/* role="group", not role="grid": a grid promises rows, gridcells
                and arrow-key navigation between them. This is a flat list of
                buttons in a CSS grid, and each button names its own date and
                state, which is both honest and more usable here. */}
            <div className="sl-stay-days" role="group" aria-label={m ? `${MONTHS[m.getMonth()]} ${m.getFullYear()}` : 'Calendar'}>
              {(m ? monthGrid(m) : Array.from({ length: 42 }, () => null)).map((cell, i) => {
                if (!cell || !today) return <span className="sl-day sl-day--ghost" key={i} aria-hidden="true" />
                const { date, inMonth } = cell
                const past = date < today
                const tk = isTaken(date)
                const isStart = sameDay(date, start)
                const isEnd = sameDay(date, end)
                const mid = inRange(date)
                const dead = past || !inMonth
                const cls = [
                  'sl-day',
                  !inMonth ? 'sl-day--out' : '',
                  past ? 'sl-day--past' : '',
                  tk && !past && inMonth ? 'sl-day--taken' : '',
                  isStart ? 'sl-day--start' : '',
                  isEnd ? 'sl-day--end' : '',
                  mid ? 'sl-day--mid' : '',
                  sameDay(date, today) ? 'sl-day--today' : '',
                ].filter(Boolean).join(' ')
                return (
                  <button
                    type="button" key={i} className={cls} disabled={dead}
                    /* No aria-disabled on a taken night: it is a perfectly
                       legal CHECKOUT, so the state travels in the label. */
                    aria-label={`${fmtLong(date)}${tk ? ', booked' : ''}${isStart ? ', check in' : ''}${isEnd ? ', check out' : ''}`}
                    aria-pressed={isStart || isEnd || undefined}
                    tabIndex={dead ? -1 : 0}
                    onClick={() => pick(date)}
                    onPointerEnter={() => setHover(date)}
                    onFocus={() => setHover(date)}
                  >
                    <span className="sl-day-n">{date.getDate()}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="sl-stay-read">
        <div className="sl-stay-cell" data-filled={start ? '' : undefined}>
          <span className="sl-stay-cell-l">Check in</span>
          <span className="sl-stay-cell-v">{start ? fmtShort(start) : 'Pick a date'}</span>
        </div>
        <span className="sl-stay-nights" aria-live="polite">
          {nights > 0 ? `${nights} ${nights === 1 ? 'night' : 'nights'}` : ' '}
        </span>
        <div className="sl-stay-cell" data-filled={end ? '' : undefined}>
          <span className="sl-stay-cell-l">Check out</span>
          {/* Never a bare dash: this build bans em and en dashes in visible
              copy, and "after check in" says what order to work in anyway. */}
          <span className="sl-stay-cell-v">{end ? fmtShort(end) : start ? 'Pick a date' : 'After check in'}</span>
        </div>
      </div>

      <div className="sl-stay-guests">
        <span className="sl-stay-cell-l">Guests</span>
        <div className="sl-stay-step">
          <button type="button" aria-label="Fewer guests" disabled={guests <= 1} onClick={() => onGuests(Math.max(1, guests - 1))}>
            <span aria-hidden="true" className="sl-stay-sign sl-stay-sign--minus" />
          </button>
          <span aria-live="polite">{guests}<span className="sl-stay-of"> of {maxGuests}</span></span>
          <button type="button" aria-label="More guests" disabled={guests >= maxGuests} onClick={() => onGuests(Math.min(maxGuests, guests + 1))}>
            <span aria-hidden="true" className="sl-stay-sign sl-stay-sign--plus" />
          </button>
        </div>
      </div>

      <p className="sl-stay-note" role="status">
        {note ?? (nights > 0
          ? `${fmtLong(start as Date)} to ${fmtLong(end as Date)}. The price for those nights comes with the reply.`
          : 'Pick a check-in, then a checkout. Two nights is the shortest stay, and nights the owners have already confirmed are struck through.')}
      </p>
    </div>
  )
}

export const STAY_CSS = `
/* the stay picker */
.sl-stay { border: 1px solid var(--sl-hair); background: #15181A; }
.sl-stay-head { display: flex; align-items: center; gap: 10px;
  padding: calc(var(--u) * 16) calc(var(--u) * 16) 0; }
.sl-stay-months { flex: 1; min-width: 0; margin: 0; text-align: center; font-size: 15px; font-weight: 500; letter-spacing: -.01em; white-space: nowrap; }
.sl-stay-month2 { display: none; color: var(--sl-mute); font-weight: 400; }
.sl-stay-arrow { appearance: none; background: none; color: inherit; cursor: pointer;
  width: 44px; height: 44px; display: grid; place-items: center; flex: none;
  border: 1px solid var(--sl-hair); border-radius: 0; transition: background .25s ease, border-color .25s ease, opacity .25s ease; }
.sl-stay-arrow:disabled { opacity: .22; cursor: default; }
.sl-stay-chev { width: 7px; height: 7px; border-top: 1px solid currentColor; border-right: 1px solid currentColor; }
.sl-stay-chev--r { transform: translateX(-2px) rotate(45deg); }
.sl-stay-chev--l { transform: translateX(2px) rotate(-135deg); }

.sl-stay-grids { display: grid; gap: calc(var(--u) * 26); padding: calc(var(--u) * 14) calc(var(--u) * 16) calc(var(--u) * 18); }
.sl-stay-grid--2 { display: none; }
.sl-stay-dows { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center;
  font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--sl-mute);
  padding-bottom: 8px; margin-bottom: 4px; border-bottom: 1px solid var(--sl-hair); }
.sl-stay-days { display: grid; grid-template-columns: repeat(7, 1fr); row-gap: 2px; }

.sl-day { position: relative; appearance: none; background: none; border: 0; font: inherit;
  color: var(--sl-bone); cursor: pointer; aspect-ratio: 1 / 1; min-height: 38px;
  display: grid; place-items: center; font-size: 14px; font-variant-numeric: tabular-nums; padding: 0; }
/* Flush cells with row-gap only: a column gap breaks the range bar into seven
   pieces. The fill is painted on a ::before so the numeral stays above it. */
.sl-day::before { content: ''; position: absolute; inset: 2px 0; z-index: 0; transition: background .18s ease; }
.sl-day-n { position: relative; z-index: 1; }
.sl-day--ghost, .sl-day--out { visibility: hidden; }
.sl-day--past { opacity: .18; cursor: default; }
/* Booked nights stay legible with a level rule through them. Invisible makes
   the month look short; struck says what happened to it. */
.sl-day--taken { color: var(--sl-mute); opacity: .74; cursor: not-allowed; }
.sl-day--taken .sl-day-n::after { content: ''; position: absolute; left: -4px; right: -4px; top: 50%; border-top: 1px solid currentColor; }
.sl-day--today .sl-day-n { color: ${HAZE_TEXT}; font-weight: 500; }
@media (hover: hover) {
  .sl-stay-arrow:not(:disabled):hover { background: rgba(233,230,224,.07); border-color: rgba(233,230,224,.32); }
  .sl-day:not(:disabled):not(.sl-day--taken):not(.sl-day--start):not(.sl-day--end):hover::before { background: rgba(233,230,224,.1); }
}
.sl-day--mid::before { background: rgba(143,168,176,.26); }
.sl-day--start::before, .sl-day--end::before { background: ${HAZE}; }
.sl-day--start, .sl-day--end { color: ${BLACK}; font-weight: 500; }
/* A taken day is still a legal checkout, so it must lose the strike once it
   becomes the end of the range. */
.sl-day--end.sl-day--taken { opacity: 1; color: ${BLACK}; }
.sl-day--end.sl-day--taken .sl-day-n::after { display: none; }

.sl-stay-read { display: grid; grid-template-columns: 1fr auto 1fr; align-items: stretch; gap: 8px;
  padding: calc(var(--u) * 16); border-top: 1px solid var(--sl-hair); }
.sl-stay-cell { border: 1px solid var(--sl-hair); padding: 10px 12px; display: grid; gap: 4px; min-width: 0;
  transition: border-color .3s ease, background .3s ease; }
.sl-stay-cell[data-filled] { border-color: rgba(143,168,176,.55); background: rgba(143,168,176,.08); }
.sl-stay-cell-l { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--sl-mute); }
.sl-stay-cell-v { font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sl-stay-nights { align-self: center; font-size: 12px; letter-spacing: .04em; color: ${HAZE_TEXT};
  font-variant-numeric: tabular-nums; min-width: 7ch; text-align: center; }

.sl-stay-guests { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: calc(var(--u) * 14) calc(var(--u) * 16); border-top: 1px solid var(--sl-hair); }
.sl-stay-step { display: inline-flex; align-items: center; gap: 4px; }
.sl-stay-step button { appearance: none; background: none; color: inherit; font: inherit; cursor: pointer;
  width: 44px; height: 44px; display: grid; place-items: center; border: 1px solid var(--sl-hair); border-radius: 0;
  transition: background .25s ease, opacity .25s ease; }
.sl-stay-step button:disabled { opacity: .22; cursor: default; }
@media (hover: hover) { .sl-stay-step button:not(:disabled):hover { background: rgba(233,230,224,.08); } }
.sl-stay-step > span { min-width: 8ch; text-align: center; font-variant-numeric: tabular-nums; font-size: 15px; }
.sl-stay-of { color: var(--sl-mute); font-size: 12px; }
.sl-stay-sign { position: relative; width: 11px; height: 11px; display: block; }
.sl-stay-sign::before { content: ''; position: absolute; left: 0; right: 0; top: 5px; border-top: 1px solid currentColor; }
.sl-stay-sign--plus::after { content: ''; position: absolute; top: 0; bottom: 0; left: 5px; border-left: 1px solid currentColor; }

.sl-stay-note { margin: 0; padding: calc(var(--u) * 14) calc(var(--u) * 16);
  border-top: 1px solid var(--sl-hair); font-size: 13px; line-height: 1.55; color: var(--sl-mute); min-height: 3.1em; }

/* Two months need width. The form is full width below 992px and a half column
   above it, so the second month comes back at two different thresholds. */
@media (min-width: 620px) and (max-width: 991px) {
  .sl-stay-grids { grid-template-columns: 1fr 1fr; }
  .sl-stay-grid--2 { display: block; }
  /* inline, not block: as a block inside the <p> it took its own line and the
     separator dot led a second row under the first month's name. */
  .sl-stay-month2 { display: inline; }
}
@media (min-width: 1240px) {
  .sl-stay-grids { grid-template-columns: 1fr 1fr; }
  .sl-stay-grid--2 { display: block; }
  .sl-stay-month2 { display: inline; }
}
@media (max-width: 359px) {
  .sl-stay-read { grid-template-columns: 1fr 1fr; }
  .sl-stay-nights { grid-column: 1 / -1; text-align: left; }
}
`
