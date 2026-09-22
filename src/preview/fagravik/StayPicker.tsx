import { useEffect, useState } from 'react'
import { CONTACT, COTTAGES } from './data'

/**
 * THE STAY PICKER, ported from Aurora Hills (02-clients/aurora-hills/src/
 * components/StayPicker.tsx, audited on a real iPhone 30 Aug 2026): the
 * two-month grid, the click rules with undo, the hover preview and past nights
 * blocked. Restyled to Fagravík's own tokens.
 *
 * Fagravík has no calendar feed, so nothing is struck and no price is shown:
 * the site never states a night or a price it did not get from the owners.
 * The dates leave with the guest instead: into the owners' live Booking.com
 * calendar, or into a prefilled email to Auður and Soffía. Never a dead control.
 *
 * `today` is read on mount only, so a prerender never bakes the build date.
 */

const DAY_MS = 86_400_000
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const same = (a?: Date | null, b?: Date | null) => !!a && !!b && key(a) === key(b)
const nightsBetween = (a: Date, b: Date) => Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS)
const fmt = (d: Date) => `${DOW[(d.getDay() + 6) % 7]} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`
const fmtLong = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`

/** Monday first, always six rows, so the panel never changes height between months. */
function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const lead = (first.getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, i) => {
    const date = addDays(first, i - lead)
    return { date, inMonth: date.getMonth() === month.getMonth() }
  })
}

export function StayPicker() {
  const [today, setToday] = useState<Date | null>(null)
  const [month, setMonth] = useState<Date | null>(null)
  const [start, setStart] = useState<Date | null>(null)
  const [end, setEnd] = useState<Date | null>(null)
  const [hover, setHover] = useState<Date | null>(null)
  const [size, setSize] = useState(COTTAGES[1].id)
  const [guests, setGuests] = useState(4)
  const cottage = COTTAGES.find((c) => c.id === size) ?? COTTAGES[1]

  useEffect(() => {
    const now = startOfDay(new Date())
    setToday(now)
    const left = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()
    setMonth(new Date(now.getFullYear(), now.getMonth() + (left < 7 ? 1 : 0), 1))
  }, [])
  useEffect(() => { setGuests((g) => Math.min(g, cottage.guests)) }, [cottage.guests])

  const clear = () => { setStart(null); setEnd(null); setHover(null) }
  function pick(day: Date) {
    if (!today || day < today) return
    if (end && same(end, day)) { setEnd(null); return } // tapping the checkout undoes it
    if (same(start, day)) { clear(); return } // tapping the check-in undoes the stay
    if (!start || end || day <= start) { setStart(day); setEnd(null); return }
    setEnd(day)
  }

  const nights = start && end ? nightsBetween(start, end) : 0
  const previewEnd = start && !end && hover && hover > start ? hover : null
  const inRange = (d: Date) => { const to = end ?? previewEnd; return !!start && !!to && d > start && d < to }
  const months = month ? [month, addMonths(month, 1)] : [null, null]
  const canBack = !!(month && today && month > new Date(today.getFullYear(), today.getMonth(), 1))

  const q = start && end
    ? new URLSearchParams({ checkin: key(start), checkout: key(end), group_adults: String(guests), no_rooms: '1' }).toString()
    : ''
  const bookingHref = `${CONTACT.bookingUrl}${q ? `?${q}` : ''}`
  const mail = (() => {
    const body = [
      start && end
        ? `We would like to stay in a ${cottage.name.toLowerCase()} from ${fmtLong(start)} to ${fmtLong(end)} (${nights} ${nights === 1 ? 'night' : 'nights'}).`
        : `We would like to ask about a ${cottage.name.toLowerCase()}.`,
      `Guests: ${guests}`,
      'Please confirm availability and the total price.',
      '', 'Name:', 'Phone:',
    ].join('\n')
    return `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Booking request: ${cottage.name}`)}&body=${encodeURIComponent(body)}`
  })()

  return (
    <div className="fv-stay">
      <div className="fv-stay-sizes" role="group" aria-label="Which cottage">
        {COTTAGES.map((c) => (
          <button key={c.id} type="button" aria-pressed={c.id === size} onClick={() => setSize(c.id)}>
            <b>{c.name.replace(' cottage', '')}</b><span>Sleeps {c.guests}</span>
          </button>
        ))}
      </div>

      <div className="fv-stay-body">
        <div className="fv-stay-cal">
          <div className="fv-stay-head">
            <button type="button" aria-label="Previous month" disabled={!canBack} onClick={() => month && setMonth(addMonths(month, -1))}>‹</button>
            <p aria-live="polite">
              {months[0] ? `${MONTHS[months[0].getMonth()]} ${months[0].getFullYear()}` : ' '}
              <span className="m2">{months[1] ? `, ${MONTHS[months[1].getMonth()]}` : ''}</span>
            </p>
            <button type="button" aria-label="Next month" onClick={() => month && setMonth(addMonths(month, 1))}>›</button>
          </div>
          <div className="fv-stay-grids" onPointerLeave={() => setHover(null)}>
            {months.map((m, mi) => (
              <div className={`fv-stay-grid${mi === 1 ? ' two' : ''}`} key={mi}>
                <div className="dows" aria-hidden="true">{DOW.map((d) => <span key={d}>{d[0]}</span>)}</div>
                <div className="days" role="group" aria-label={m ? `${MONTHS[m.getMonth()]} ${m.getFullYear()}` : 'Calendar'}>
                  {(m ? monthGrid(m) : Array.from({ length: 42 }, () => null)).map((cell, i) => {
                    if (!cell || !today) return <span key={i} className="d ghost" aria-hidden="true" />
                    const { date, inMonth } = cell
                    const dead = date < today || !inMonth
                    const isS = same(date, start), isE = same(date, end)
                    const cls = ['d', !inMonth && 'out', date < today && 'past', isS && 's', isE && 'e', inRange(date) && 'mid', same(date, today) && 'today'].filter(Boolean).join(' ')
                    return (
                      <button key={i} type="button" className={cls} disabled={dead} tabIndex={dead ? -1 : 0}
                        aria-label={`${fmtLong(date)}${isS ? ', check in' : ''}${isE ? ', check out' : ''}`}
                        aria-pressed={isS || isE || undefined}
                        onClick={() => pick(date)} onPointerEnter={() => setHover(date)} onFocus={() => setHover(date)}>
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="fv-stay-read">
          <div className="cells">
            <div data-on={start ? '' : undefined}><span>Check in</span><b>{start ? fmt(start) : 'Pick a date'}</b></div>
            <div data-on={end ? '' : undefined}><span>Check out</span><b>{end ? fmt(end) : start ? 'Pick a date' : 'After check in'}</b></div>
          </div>
          {start && <button type="button" className="clear" onClick={clear}>Clear dates</button>}
          <div className="guests">
            <span>Guests</span>
            <div className="step">
              <button type="button" aria-label="One guest fewer" disabled={guests <= 1} onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
              <output aria-live="polite">{guests} of {cottage.guests}</output>
              <button type="button" aria-label="One guest more" disabled={guests >= cottage.guests} onClick={() => setGuests((g) => Math.min(cottage.guests, g + 1))}>+</button>
            </div>
          </div>
          <p className="sum" aria-live="polite">
            {nights ? `${nights} ${nights === 1 ? 'night' : 'nights'} in a ${cottage.name.toLowerCase()}.` : start ? `Arriving ${fmt(start)}. Now tap your last morning.` : 'Tap your first night, then your last morning.'}
          </p>
          <a className="fv-pill dark go" href={bookingHref} target="_blank" rel="noopener" aria-disabled={!nights || undefined}
            onClick={(e) => { if (!nights) e.preventDefault() }}>
            {nights ? 'See prices and availability ↗' : 'Choose your dates'}
          </a>
          <a className="ask" href={mail}>Or ask Auður and Soffía by email</a>
          <small>Prices and free nights come from the owners’ live Booking.com calendar.</small>
        </aside>
      </div>
    </div>
  )
}

export const STAY_CSS = `
.fv-stay{background:var(--paper);color:var(--ink);border-radius:14px;padding:clamp(1.1rem,2.4vw,1.8rem);display:grid;gap:1.2rem}
.fv-stay-sizes{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.4rem}
.fv-stay-sizes button{border:1px solid var(--line);background:#fff;border-radius:10px;padding:.6rem .5rem;font:inherit;cursor:pointer;text-align:left;display:grid;gap:.1rem;color:var(--ink);transition:border-color .2s var(--ease),background-color .2s var(--ease)}
.fv-stay-sizes b{font-weight:600;font-size:13px;line-height:1.25}
.fv-stay-sizes span{font-size:12px;color:var(--mute)}
.fv-stay-sizes button[aria-pressed="true"]{border-color:var(--ink);background:#F1F3F1}
.fv-stay-body{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:clamp(1rem,2.4vw,1.8rem)}
.fv-stay-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem}
.fv-stay-head p{font-weight:600;font-size:14.5px;margin:0}
.fv-stay-head button{width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:#fff;font:inherit;font-size:18px;cursor:pointer;color:var(--ink)}
.fv-stay-head button:disabled{opacity:.3;cursor:default}
.fv-stay-grids{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem}
.fv-stay-grid .dows,.fv-stay-grid .days{display:grid;grid-template-columns:repeat(7,1fr)}
.fv-stay-grid .dows span{font-size:11px;color:var(--mute);text-align:center;padding:.3rem 0;font-weight:560}
.fv-stay .d{aspect-ratio:1;border:0;background:none;font:inherit;font-size:13.5px;color:var(--ink);cursor:pointer;border-radius:50%;font-variant-numeric:tabular-nums;position:relative}
/* hover only where a pointer really hovers: iOS keeps :hover on the last tapped
   day, and this rule outranks .s/.e, so the chosen checkout turned pale */
@media (hover:hover){.fv-stay .d:hover:not(:disabled):not(.s):not(.e){background:#EEF0EE}}
.fv-stay .d.out{visibility:hidden}
.fv-stay .d.past{color:#b3bab7;cursor:default;text-decoration:line-through}
.fv-stay .d.today{box-shadow:inset 0 0 0 1px var(--line)}
.fv-stay .d.mid{background:#E7EBE8;border-radius:0}
.fv-stay .d.s,.fv-stay .d.e{background:var(--ink);color:#fff}
.fv-stay .d.ghost{aspect-ratio:1}
.fv-stay-read{display:grid;align-content:start;gap:.9rem}
.fv-stay-read .cells{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);border-radius:10px;overflow:clip}
.fv-stay-read .cells div{padding:.7rem .85rem;display:grid;gap:.15rem}
.fv-stay-read .cells div+div{border-left:1px solid var(--line)}
.fv-stay-read .cells span,.fv-stay-read .guests>span{font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
.fv-stay-read .cells b{font-weight:560;font-size:14.5px;color:var(--mute)}
.fv-stay-read .cells [data-on] b{color:var(--ink)}
.fv-stay-read .clear{justify-self:start;border:0;background:none;padding:0;font:inherit;font-size:13px;text-decoration:underline;cursor:pointer;color:var(--ink)}
.fv-stay-read .guests{display:flex;justify-content:space-between;align-items:center}
.fv-stay-read .step{display:inline-flex;align-items:center;gap:.4rem}
.fv-stay-read .step button{width:34px;height:34px;border-radius:50%;border:1px solid var(--line);background:#fff;font:inherit;font-size:16px;cursor:pointer;color:var(--ink)}
.fv-stay-read .step button:disabled{opacity:.3;cursor:default}
.fv-stay-read .step output{min-width:5.5ch;text-align:center;font-weight:600;font-size:14px}
.fv-stay-read .sum{font-size:14.5px;color:var(--mute);margin:0}
.fv-stay-read .go{justify-content:center;height:48px}
.fv-stay-read .go[aria-disabled]{opacity:.45;cursor:default}
.fv-stay-read .ask{font-size:13.5px;text-align:center}
.fv-stay-read small{font-size:12.5px;color:var(--mute);text-align:center}
@media (max-width:1100px){.fv-stay-body{grid-template-columns:1fr}}
@media (max-width:640px){.fv-stay-grids{grid-template-columns:1fr}.fv-stay-grid.two,.fv-stay-head .m2{display:none}.fv-stay-sizes{grid-template-columns:repeat(3,minmax(0,1fr))}}
`
