/**
 * The booking widget: our stay calendar, the party, and the handoff to Godo.
 *
 * Ported from Nýpugarðar's StayCalendar + BookingBar (reference implementation:
 * Aurora Hills StayPicker, see [[booking-range-calendar-pattern]]) and restyled
 * to this site's DESIGN.md. Behaviour kept:
 *   - three-rule clicks: nothing chosen, a finished stay, or a day on or before
 *     the arrival starts over; tapping the arrival clears; tapping the
 *     departure clears the departure;
 *   - the range previews under the pointer while the departure is chosen;
 *   - two months side by side when the card is wide, one on a phone; always
 *     six rows, so paging never jumps.
 * Optional build-time inventory greys sold-out nights; without a snapshot
 * no night is struck. Godo always confirms the final price and availability.
 *
 * HYDRATION: `today` is null on the server and on the first client render; the
 * grid renders as a skeleton of identical geometry and fills on mount, so the
 * prerendered HTML never carries the build machine's date.
 *
 * Placement: at the foot of the page, by the footer, never under the hero
 * ([[booking-widget-at-the-bottom]]).
 */
import { useId, useState } from 'react'
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { addDays, startOfDay } from './godo'
import { ROOMS, fitsParty } from './data'
import { inventory, soldOut } from './availability'
import { useSite } from './site'
import type { Copy } from './copy'
import { CAL_ANCHOR } from './paths'
import type { Lang } from './paths'

export const PICKER_CSS = `
.bj3 .picker{background:var(--paper);color:var(--ink);border-radius:var(--r);padding:clamp(20px,2.6vw,36px);display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,300px);gap:clamp(24px,3.4vw,52px);text-align:left}
@media (max-width:899px){.bj3 .picker{grid-template-columns:1fr}}
.bj3 .picker-calendar{container-type:inline-size;min-width:0}
.bj3 .cal-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
.bj3 .cal-head p{flex:1;display:grid;grid-template-columns:1fr;text-align:center;font-family:var(--serif);font-weight:300;font-size:1.25rem;text-transform:capitalize}
.bj3 .cal-nav{all:unset;box-sizing:border-box;cursor:pointer;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);transition:transform .16s var(--ease),border-color .2s}
.bj3 .cal-nav:disabled{opacity:.3;cursor:default}
.bj3 .cal-nav:focus-visible{outline:2px solid var(--band);outline-offset:2px}
.bj3 .cal-nav:active{transform:scale(.96)}
.bj3 .months{display:grid;grid-template-columns:1fr;gap:28px;margin-top:16px}
.bj3 .months .m2{display:none}
@container (min-width:620px){.bj3 .months{grid-template-columns:1fr 1fr}.bj3 .months .m2{display:block}.bj3 .cal-head p{grid-template-columns:1fr 1fr}.bj3 .cal-head p .t2{display:block}}
.bj3 .cal-head p .t2{display:none}
.bj3 .wk{display:grid;grid-template-columns:repeat(7,1fr);padding-bottom:6px}
.bj3 .wk span{text-align:center;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.bj3 .grid7{display:grid;grid-template-columns:repeat(7,1fr);row-gap:4px}
.bj3 .day{all:unset;box-sizing:border-box;position:relative;height:42px;cursor:pointer;text-align:center;font-size:.92rem;font-variant-numeric:tabular-nums}
.bj3 .day[disabled]{cursor:default}
.bj3 .day.out{visibility:hidden}
.bj3 .day .bar{position:absolute;top:3px;bottom:3px;background:rgba(90,31,24,.13)}
.bj3 .day .cap{position:absolute;top:3px;bottom:3px;left:50%;aspect-ratio:1;transform:translateX(-50%);border-radius:50%}
.bj3 .day .cap.on{background:var(--band)}
.bj3 .day .cap.soft{border:1px solid var(--band);background:var(--paper)}
.bj3 .day .n{position:relative;line-height:42px}
.bj3 .day.past .n{color:rgba(28,29,26,.28)}
.bj3 .day.sel .n{color:var(--on)}
.bj3 .day.today .n{text-decoration:underline;text-decoration-color:var(--band);text-decoration-thickness:2px;text-underline-offset:5px}
@media (hover:hover) and (pointer:fine){.bj3 .day:not([disabled]):not(.sel):hover .n::before{content:'';position:absolute;inset:3px -9px;border-radius:50%;background:rgba(28,29,26,.07);z-index:-1}}
.bj3 .day:focus-visible{outline:2px solid var(--band);outline-offset:-2px;border-radius:8px}
.bj3 .skel{height:42px}
.bj3 .side{display:flex;flex-direction:column;gap:20px}
.bj3 .cells{display:flex;gap:14px}
.bj3 .cell{flex:1;min-width:0;border-bottom:1px solid var(--line);padding-bottom:10px}
.bj3 .cell.on{border-color:var(--band)}
.bj3 .cell span{display:block;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}
.bj3 .cell b{display:block;margin-top:4px;font-family:var(--serif);font-weight:300;font-size:1.3rem;overflow-wrap:anywhere}
.bj3 .cell b.dim{color:var(--mute)}
.bj3 .clear{all:unset;cursor:pointer;align-self:flex-start;min-height:40px;font-size:.88rem;text-decoration:underline;text-underline-offset:.28em;color:var(--text)}
.bj3 .clear:focus-visible{outline:2px solid var(--band);outline-offset:3px}
.bj3 .step{display:flex;align-items:center;justify-content:space-between;gap:12px}
.bj3 .step label{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}
.bj3 .step div{display:flex;align-items:center;gap:12px}
.bj3 .step output{min-width:1.6ch;text-align:center;font-family:var(--serif);font-weight:300;font-size:1.5rem;font-variant-numeric:tabular-nums}
.bj3 .go{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:54px;padding:6px 6px 6px 22px;border-radius:999px;background:var(--band);color:var(--on);text-decoration:none;font-weight:560;transition:background-color .25s ease,transform .16s var(--ease)}
.bj3 .go:hover{background:#461711}
.bj3 .go:active{transform:scale(.98)}
.bj3 .go i{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:rgba(245,244,241,.14)}
.bj3 .go small{font-weight:400;opacity:.85}
.bj3 .picker .note{font-size:.86rem;line-height:1.5;color:var(--mute)}

.bj3 .picker{scroll-margin-top:calc(84px + env(safe-area-inset-top))}
.bj3 .day.sold-night .n {
  color:var(--mute);
  text-decoration:line-through;
}
.bj3 .day.sold-night.sel .n {
  color:var(--on);
}
@media(prefers-reduced-motion:reduce) {
  .bj3 .rv-draw {
    clip-path:none!important;
  }
  .bj3 .rv-icons>* {
    transform:none!important;
    opacity:1!important;
  }
}
`

const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const same = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

function grid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const lead = (first.getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, i) => {
    const date = addDays(first, i - lead)
    return { date, inMonth: date.getMonth() === month.getMonth() }
  })
}

export function fmtShort(d: Date, t: Copy, lang: Lang) {
  const w = t.booking.weekdaysShort[(d.getDay() + 6) % 7]
  const m = t.booking.months[d.getMonth()].slice(0, 3)
  return lang === 'is' ? `${w} ${d.getDate()}. ${m}` : `${w} ${d.getDate()} ${m}`
}
function fmtLong(d: Date, t: Copy, lang: Lang) {
  const m = t.booking.months[d.getMonth()]
  return lang === 'is' ? `${d.getDate()}. ${m} ${d.getFullYear()}` : `${d.getDate()} ${m} ${d.getFullYear()}`
}

export function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const { t } = useSite()
  const id = useId()
  return (
    <div className="step">
      <label htmlFor={id}>{label}</label>
      <div>
        <button type="button" className="cal-nav" aria-label={t.booking.fewer(label)} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
          <Minus size={15} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <output id={id} aria-live="polite">{value}</output>
        <button type="button" className="cal-nav" aria-label={t.booking.more(label)} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
          <Plus size={15} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/** `guests: false` on the rooms page, where the party is chosen above the list. */
export function StayPicker({ guests = true }: { guests?: boolean } = {}) {
  const { t, lang, stay, setStay, today } = useSite()
  const [start, setStart] = useState<Date | null>(stay.checkin)
  const [end, setEnd] = useState<Date | null>(stay.checkout)
  const [hover, setHover] = useState<Date | null>(null)
  const [month, setMonth] = useState<Date | null>(null)
  const shown = month ?? (today ? new Date((start ?? today).getFullYear(), (start ?? today).getMonth(), 1) : null)

  const commit = (s: Date | null, e: Date | null) => {
    setStart(s); setEnd(e)
    setStay({ checkin: s && e ? s : null, checkout: s && e ? e : null })
  }
  function pick(day: Date) {
    if (!today || day < startOfDay(today)) return
    if (end && same(day, end)) { commit(start, null); return }
    if (same(day, start)) { commit(null, null); return }
    if (!start || end || day <= start) { commit(day, null); return }
    commit(start, day)
  }

  const previewEnd = start && !end && hover && hover > start ? hover : null
  const to = end ?? previewEnd
  const selectedRoom = ROOMS.find((r) => r.id === stay.room)
  const validRoom = selectedRoom &&
    fitsParty(selectedRoom, stay.adults, stay.children) &&
    !soldOut(selectedRoom.id, start, end) ? selectedRoom : null
  const candidates = validRoom ? [validRoom] : ROOMS.filter((r) => fitsParty(r, stay.adults, stay.children))
  const closedNight = (day: Date) => candidates.length > 0 && candidates.every((r) => inventory(r.id, day) === 0)
  const title = (m: Date) => `${t.booking.months[m.getMonth()]} ${m.getFullYear()}`
  const canBack = !!shown && !!today && shown > new Date(today.getFullYear(), today.getMonth(), 1)

  const monthView = (m: Date | null, cls: string) => (
    <div className={cls}>
      <div className="wk" aria-hidden="true">{t.booking.weekdayInitials.map((w, i) => <span key={i}>{w}</span>)}</div>
      {m && today ? (
        <div className="grid7" role="group" aria-label={title(m)}>
          {grid(m).map(({ date, inMonth }, i) => {
            const past = date < startOfDay(today)
            const closed = closedNight(date)
            // A sold-out night can still be a departure, because checkout is exclusive.
            const canDepart = !!start && !end && date > start && (candidates.length === 0 || candidates.some((r) => !soldOut(r.id, start, date)))
            const blockedRange = !!start && !end && date > start && !canDepart
            const dead = past || !inMonth || (closed && !canDepart && !same(date, start) && !same(date, end)) || blockedRange
            const isStart = same(date, start)
            const isEnd = same(date, end) || (!end && same(date, previewEnd))
            const mid = !!start && !!to && date > start && date < to
            const label = `${fmtLong(date, t, lang)}${closed ? `, ${t.picker.soldOut}` : ''}${isStart ? `, ${t.booking.checkIn.toLowerCase()}` : ''}${same(date, end) ? `, ${t.booking.checkOut.toLowerCase()}` : ''}`
            return (
              <button
                key={i}
                type="button"
                disabled={dead}
                tabIndex={dead ? -1 : 0}
                aria-label={inMonth ? label : undefined}
                aria-hidden={inMonth ? undefined : true}
                aria-pressed={isStart || same(date, end) || undefined}
                className={`day${!inMonth ? ' out' : ''}${past ? ' past' : ''}${closed ? ' sold-night' : ''}${isStart || (isEnd && end) ? ' sel' : ''}${same(date, today) ? ' today' : ''}`}
                onClick={() => pick(date)}
                onPointerEnter={() => !dead && setHover(date)}
                onFocus={() => setHover(date)}
              >
                {(mid || (isStart && to) || (isEnd && start)) && inMonth ? (
                  <span className="bar" style={{ left: isStart ? '50%' : 0, right: isEnd ? '50%' : 0, opacity: end ? 1 : 0.6 }} aria-hidden="true" />
                ) : null}
                {(isStart || isEnd) && inMonth ? <span className={`cap ${isStart || end ? 'on' : 'soft'}`} aria-hidden="true" /> : null}
                <span className="n">{date.getDate()}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="grid7" aria-hidden="true">{Array.from({ length: 42 }, (_, i) => <span key={i} className="skel" />)}</div>
      )}
    </div>
  )

  return (
    <div className="picker" id={CAL_ANCHOR[lang]}>
      <div className="picker-calendar" onPointerLeave={() => setHover(null)}>
        <div className="cal-head">
          <button type="button" className="cal-nav" onClick={() => shown && setMonth(addMonths(shown, -1))} disabled={!canBack} aria-label={t.booking.prevMonth}>
            <ChevronLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <p aria-live="polite">
            <span>{shown ? title(shown) : ' '}</span>
            <span className="t2">{shown ? title(addMonths(shown, 1)) : ' '}</span>
          </p>
          <button type="button" className="cal-nav" onClick={() => shown && setMonth(addMonths(shown, 1))} disabled={!shown} aria-label={t.booking.nextMonth}>
            <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <div className="months">
          {monthView(shown, 'm1')}
          {monthView(shown ? addMonths(shown, 1) : null, 'm2')}
        </div>
        <p className="note" style={{ marginTop: 14 }}>{t.booking.season}</p>
      </div>

      <div className="side">
        <div className="cells">
          <div className={`cell${start ? ' on' : ''}`}><span>{t.booking.checkIn}</span><b className={start ? '' : 'dim'}>{start ? fmtShort(start, t, lang) : t.booking.pickDate}</b></div>
          <div className={`cell${end ? ' on' : ''}`}><span>{t.booking.checkOut}</span><b className={end ? '' : 'dim'}>{end ? fmtShort(end, t, lang) : start ? t.booking.pickDate : t.booking.afterCheckIn}</b></div>
        </div>
        {start ? <button type="button" className="clear" onClick={() => commit(null, null)}>{t.booking.clearDates}</button> : null}
        {guests && (
          <>
            <Stepper label={t.booking.adults} value={stay.adults} min={1} max={5} onChange={(n) => setStay({ adults: n })} />
            <Stepper label={t.booking.children} value={stay.children} min={0} max={4} onChange={(n) => setStay({ children: n })} />
          </>
        )}
        <p className="note">{t.booking.pricesNext}</p>
      </div>
    </div>
  )
}
