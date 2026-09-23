import { useEffect, useMemo, useState } from 'react'
import { COTTAGES, CONTACT } from './data'
import { NIGHTS, SNAPSHOT_DATE, nightState } from './availability'

/**
 * THE STAY PICKER, fifth port. Behaviour from the audited line:
 * aurora-hills (the two-month grid, hydration skeleton, open on a bookable
 * month) → riverbank (taken nights struck, a range CROSSING a booked night
 * refused out loud and restarted there, minimum stay named, a booked night is
 * still a legal CHECKOUT: the crossing test runs over [start, end-1]) →
 * fagravik 486dea4 (iOS sticky :hover on the chosen day, hover preview only
 * where a pointer really hovers) → the 15 Sept undo rule (tap the check-in to
 * clear, tap the checkout to drop it, a visible Clear dates).
 *
 * NEW HERE: five calendars. "Any cottage" strikes a night only when all five
 * are booked, and once a stay is drawn it names which of the five are free
 * for every night of it. The minimum stay is Airbnb's own, per arrival night:
 * two nights, except the gap nights Airbnb opens to one.
 */

type Id = (typeof COTTAGES)[number]['id']
export type Unit = Id | 'any'

const DAY_MS = 86_400_000
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const IDS = COTTAGES.map((c) => c.id)
const sod = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const add = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMo = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const same = (a?: Date | null, b?: Date | null) => !!a && !!b && key(a) === key(b)
const nightsBetween = (a: Date, b: Date) => Math.round((sod(b).getTime() - sod(a).getTime()) / DAY_MS)
const fmt = (d: Date) => `${DOW[(d.getDay() + 6) % 7]} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`
const fmtLong = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`

function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const lead = (first.getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, i) => {
    const date = add(first, i - lead)
    return { date, inMonth: date.getMonth() === month.getMonth() }
  })
}

/** A night is free in one cottage when its snapshot says so. Outside the snapshot it is unknown, never free. */
const freeIn = (id: Id, d: Date) => { const s = nightState(id, d); return s === 'o' || s === '1' }
const minFrom = (id: Id, d: Date) => (nightState(id, d) === '1' ? 1 : 2)
/** Cottages free for every night of [a, b). */
const freeFor = (a: Date, b: Date) => IDS.filter((id) => { for (let d = a; d < b; d = add(d, 1)) if (!freeIn(id, d)) return false; return true })

export function StayPicker({ unit, setUnit }: { unit: Unit; setUnit: (u: Unit) => void }) {
  const [today, setToday] = useState<Date | null>(null)
  const [month, setMonth] = useState<Date | null>(null)
  const [start, setStart] = useState<Date | null>(null)
  const [end, setEnd] = useState<Date | null>(null)
  const [hover, setHover] = useState<Date | null>(null)
  const [note, setNote] = useState('')
  const [guests, setGuests] = useState(2)

  useEffect(() => {
    const now = sod(new Date())
    setToday(now)
    const left = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()
    setMonth(new Date(now.getFullYear(), now.getMonth() + (left < 7 ? 1 : 0), 1))
  }, [])

  /* Open on a month that has something to book for THIS selection: a grid
     that is all past and struck nights reads as a fully booked cottage. */
  useEffect(() => {
    if (!today || start) return // never move the grid away from a stay being drawn
    for (let i = 0; i < 344; i++) {
      const d = add(today, i)
      if (unit === 'any' ? IDS.some((id) => freeIn(id, d)) : freeIn(unit, d)) {
        const first = new Date(d.getFullYear(), d.getMonth(), 1)
        const left = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() - d.getDate()
        setMonth(left < 3 ? addMo(first, 1) : first)
        return
      }
    }
  }, [today, unit])

  /* A different cottage is a different calendar: a stay drawn on the old one
     must not silently survive into the new one. Switching to "any" keeps it,
     because any-cottage is the union and cannot make a drawn stay illegal. */
  useEffect(() => { if (unit !== 'any' && start && end && !freeFor(start, end).includes(unit)) { setStart(null); setEnd(null) } setNote('') }, [unit])

  const taken = useMemo(() => (d: Date) => (unit === 'any' ? !IDS.some((id) => freeIn(id, d)) : !freeIn(unit, d)), [unit])
  /** the shortest stay from this arrival: the smallest any free cottage allows */
  const minStay = (d: Date) => (unit === 'any' ? Math.min(...IDS.filter((id) => freeIn(id, d)).map((id) => minFrom(id, d)), 2) : minFrom(unit, d))
  /* [start, end-1]: the morning you leave may be someone else's arrival. For
     "any", the stay must fit ONE cottage end to end, not a patchwork. */
  const fits = (a: Date, b: Date) => (unit === 'any' ? freeFor(a, b).length > 0 : freeFor(a, b).includes(unit))

  const clear = () => { setStart(null); setEnd(null); setHover(null); setNote('') }
  function pick(day: Date) {
    if (!today || day < today) return
    if (end && same(end, day)) { setEnd(null); setNote(''); return }
    if (same(start, day)) { clear(); return }
    const restart = !start || !!end || day <= start
    if (restart) {
      if (taken(day)) { setNote(`${fmtLong(day)} is booked${unit === 'any' ? ' in all five cottages' : ` in cottage ${unit}`}. The struck-through nights are taken.`); return }
      setStart(day); setEnd(null); setNote(''); return
    }
    if (!fits(start, day)) {
      if (taken(day)) { setNote(`A booked night sits between those dates. Pick an earlier morning to leave, or start again.`); return }
      setStart(day); setEnd(null)
      setNote(`A booked night sits between those dates, so this is a new arrival on ${fmtLong(day)}. Now pick the morning you leave.`)
      return
    }
    const min = minStay(start)
    if (nightsBetween(start, day) < min) { setNote(`From ${fmt(start)} the shortest stay is ${min} nights, so the earliest checkout is ${fmtLong(add(start, min))}.`); return }
    setEnd(day); setNote('')
  }

  const nights = start && end ? nightsBetween(start, end) : 0
  const previewEnd = start && !end && hover && hover > start ? hover : null
  const inRange = (d: Date) => { const to = end ?? previewEnd; return !!start && !!to && d > start && d < to }
  const months = month ? [month, addMo(month, 1)] : [null, null]
  const canBack = !!(month && today && month > new Date(today.getFullYear(), today.getMonth(), 1))
  const free = start && end ? freeFor(start, end) : []
  const chosen: Id | null = unit !== 'any' ? unit : free[0] ?? null
  const listing = COTTAGES.find((c) => c.id === chosen)

  const airbnbHref = listing && start && end
    ? `https://www.airbnb.com/rooms/${listing.airbnb}?${new URLSearchParams({ check_in: key(start), check_out: key(end), adults: String(guests) })}`
    : null
  const mail = (() => {
    const body = [
      start && end
        ? `We would like to stay ${nights} ${nights === 1 ? 'night' : 'nights'}, arriving ${fmtLong(start)} and leaving ${fmtLong(end)}.`
        : 'We would like to ask about a stay.',
      unit === 'any' ? (free.length ? `Any cottage is fine. The calendar showed ${free.join(', ')} free.` : 'Any cottage is fine.') : `Cottage ${unit}, if it is free.`,
      `Guests: ${guests}`,
      '', 'Name:', 'Phone:',
    ].join('\n')
    return `mailto:${CONTACT.email}?subject=${encodeURIComponent('Booking request, Eyvík Cottages')}&body=${encodeURIComponent(body)}`
  })()

  return (
    <div className="ev-stay">
      <div className="ev-stay-units" role="group" aria-label="Which cottage">
        <button type="button" aria-pressed={unit === 'any'} onClick={() => setUnit('any')}><b>Any</b><span>of the five</span></button>
        {COTTAGES.map((c) => (
          <button key={c.id} type="button" aria-pressed={unit === c.id} onClick={() => setUnit(c.id)}>
            <b>{c.id}</b><span>{c.rating} · {c.reviews}</span>
          </button>
        ))}
      </div>

      <div className="ev-stay-body">
        <div className="ev-stay-cal">
          <div className="ev-stay-head">
            <button type="button" aria-label="Previous month" disabled={!canBack} onClick={() => month && setMonth(addMo(month, -1))}>‹</button>
            <p aria-live="polite">
              {months[0] ? `${MONTHS[months[0].getMonth()]} ${months[0].getFullYear()}` : ' '}
              <span className="m2">{months[1] ? ` · ${MONTHS[months[1].getMonth()]}` : ''}</span>
            </p>
            <button type="button" aria-label="Next month" onClick={() => month && setMonth(addMo(month, 1))}>›</button>
          </div>
          <div className="ev-stay-grids" onPointerLeave={() => setHover(null)}>
            {months.map((m, mi) => (
              <div className={`ev-stay-grid${mi === 1 ? ' two' : ''}`} key={mi}>
                <div className="dows" aria-hidden="true">{DOW.map((d) => <span key={d}>{d[0]}</span>)}</div>
                <div className="days" role="group" aria-label={m ? `${MONTHS[m.getMonth()]} ${m.getFullYear()}` : 'Calendar'}>
                  {(m ? monthGrid(m) : Array.from({ length: 42 }, () => null)).map((cell, i) => {
                    if (!cell || !today) return <span key={i} className="d ghost" aria-hidden="true" />
                    const { date, inMonth } = cell
                    const past = date < today
                    const tk = !past && taken(date)
                    const isS = same(date, start), isE = same(date, end)
                    const cls = ['d', !inMonth && 'out', past && 'past', tk && 'tk', isS && 's', isE && 'e', inRange(date) && 'mid', same(date, today) && 'today'].filter(Boolean).join(' ')
                    return (
                      <button key={i} type="button" className={cls} disabled={past || !inMonth} tabIndex={past || !inMonth ? -1 : 0}
                        data-range={isS && (end || previewEnd) ? 'start' : isE ? 'end' : undefined}
                        aria-label={`${fmtLong(date)}${tk ? ', booked' : ''}${isS ? ', check in' : ''}${isE ? ', check out' : ''}`}
                        aria-pressed={isS || isE || undefined}
                        onClick={() => pick(date)} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHover(date) }}>
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          {note ? <p className="ev-stay-note" role="status">{note}</p> : null}
        </div>

        <aside className="ev-stay-read">
          <div className="cells">
            <div data-on={start ? '' : undefined}><span>Arrive</span><b>{start ? fmt(start) : 'Pick a night'}</b></div>
            <div data-on={end ? '' : undefined}><span>Leave</span><b>{end ? fmt(end) : start ? 'Pick a morning' : 'After arrival'}</b></div>
          </div>
          {start && <button type="button" className="clear" onClick={clear}>Clear dates</button>}
          <div className="guests">
            <span>Guests</span>
            <div className="step">
              <button type="button" aria-label="One guest fewer" disabled={guests <= 1} onClick={() => setGuests(1)}>−</button>
              <output aria-live="polite">{guests} of 2</output>
              <button type="button" aria-label="One guest more" disabled={guests >= 2} onClick={() => setGuests(2)}>+</button>
            </div>
          </div>
          <p className="sum" aria-live="polite">
            {nights
              ? unit === 'any'
                ? <>{nights} {nights === 1 ? 'night' : 'nights'}. Free for every one of them: <strong>{free.map((f) => `cottage ${f}`).join(', ')}</strong>.</>
                : <>{nights} {nights === 1 ? 'night' : 'nights'} in <strong>cottage {unit}</strong>.</>
              : start ? <>Arriving {fmt(start)}. Now tap the morning you leave.</> : <>Tap the night you arrive, then the morning you leave.</>}
          </p>
          {unit === 'any' && free.length > 1 && (
            <div className="pickfree" role="group" aria-label="Choose one of the free cottages">
              {free.map((f) => <button key={f} type="button" onClick={() => setUnit(f)}>{f}</button>)}
            </div>
          )}
          <a className="ev-pill dark go" href={mail} aria-disabled={!nights || undefined} onClick={(e) => { if (!nights) e.preventDefault() }}>
            {nights ? 'Ask Smári and Íris for these nights' : 'Choose your dates'}
          </a>
          {airbnbHref
            ? <a className="ev-link alt" href={airbnbHref} target="_blank" rel="noopener">Or book cottage {chosen} on Airbnb with these dates ↗</a>
            : <a className="ev-link alt" href={`tel:${CONTACT.tel}`}>Or call {CONTACT.phone}</a>}
          <small>Booked nights are each cottage’s own Airbnb calendar as it stood on {SNAPSHOT_DATE}. On the live site they update by themselves.</small>
        </aside>
      </div>
    </div>
  )
}

/** Count of nights still free across all five, for the section intro. */
export function freeNightsAhead(from: Date, days: number) {
  let n = 0
  for (let i = 0; i < days; i++) { const d = add(from, i); for (const id of IDS) if (freeIn(id, d)) n++ }
  return n
}
export const COTTAGE_COUNT = Object.keys(NIGHTS).length

export const STAY_CSS = `
.ev-stay{background:var(--paper);color:var(--ink);border-radius:20px;padding:clamp(1.1rem,2.4vw,2rem);display:grid;gap:1.3rem;box-shadow:0 1px 0 rgba(0,0,0,.04)}
.ev-stay-units{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.4rem}
.ev-stay-units button{border:1px solid var(--line);background:transparent;border-radius:12px;padding:.6rem .6rem .55rem;font:inherit;cursor:pointer;text-align:left;display:grid;gap:.05rem;color:var(--ink);min-height:52px;transition:border-color .2s var(--ease),background-color .2s var(--ease)}
.ev-stay-units b{font-family:'EvC',Georgia,serif;font-weight:400;font-size:24px;line-height:1}
.ev-stay-units span{font-family:'EvM',ui-monospace,monospace;font-size:10.5px;color:var(--mute);letter-spacing:.02em}
.ev-stay-units button[aria-pressed="true"]{border-color:var(--moss);background:var(--moss);color:var(--paper)}
.ev-stay-units button[aria-pressed="true"] span{color:rgba(234,226,208,.72)}
@media (hover:hover){.ev-stay-units button:hover:not([aria-pressed="true"]){border-color:var(--ink)}}
.ev-stay-body{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:clamp(1rem,2.6vw,2.2rem)}
.ev-stay-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem}
.ev-stay-head p{font-weight:560;font-size:14.5px;margin:0}
.ev-stay-head button{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);background:transparent;font:inherit;font-size:18px;cursor:pointer;color:var(--ink)}
.ev-stay-head button:disabled{opacity:.3;cursor:default}
.ev-stay-grids{display:grid;grid-template-columns:1fr 1fr;gap:1.4rem}
.ev-stay-grid .dows,.ev-stay-grid .days{display:grid;grid-template-columns:repeat(7,1fr)}
.ev-stay-grid .days{row-gap:2px}
.ev-stay-grid .dows span{font-family:'EvM',ui-monospace,monospace;font-size:10.5px;color:var(--mute);text-align:center;padding:.3rem 0}
.ev-stay .d{aspect-ratio:1;border:0;background:none;font:inherit;font-size:13.5px;color:var(--ink);cursor:pointer;font-variant-numeric:tabular-nums;position:relative;z-index:0;padding:0}
.ev-stay .d::before{content:'';position:absolute;inset:2px 0;z-index:-1;border-radius:999px}
@media (hover:hover){.ev-stay .d:hover:not(:disabled):not(.s):not(.e):not(.tk)::before{background:rgba(52,64,42,.1)}}
.ev-stay .d.out{visibility:hidden}
.ev-stay .d.past{color:rgba(29,26,20,.28);cursor:default}
/* booked: a LEVEL rule at .72, never a rotated hairline (aliases on device) */
.ev-stay .d.tk{color:rgba(29,26,20,.72)}
.ev-stay .d.tk::after{content:'';position:absolute;left:28%;right:28%;top:50%;height:1px;background:currentColor}
.ev-stay .d.today{font-weight:640}
.ev-stay .d.mid::before{background:rgba(52,64,42,.14);border-radius:0}
.ev-stay .d.s,.ev-stay .d.e{color:var(--paper)}
.ev-stay .d.s::before,.ev-stay .d.e::before{background:var(--moss)}
.ev-stay .d.s[data-range="start"]::before{border-radius:999px 0 0 999px}
.ev-stay .d.e[data-range="end"]::before{border-radius:0 999px 999px 0}
.ev-stay .d.s.tk::after,.ev-stay .d.e.tk::after{display:none}
.ev-stay .d.ghost{aspect-ratio:1}
.ev-stay-note{margin:.9rem 0 0;font-size:14px;color:var(--rust);max-width:52ch}
.ev-stay-read{display:grid;align-content:start;gap:.9rem}
.ev-stay-read .cells{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);border-radius:12px;overflow:clip}
.ev-stay-read .cells div{padding:.75rem .9rem;display:grid;gap:.15rem}
.ev-stay-read .cells div+div{border-left:1px solid var(--line)}
.ev-stay-read .cells span,.ev-stay-read .guests>span{font-family:'EvM',ui-monospace,monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.ev-stay-read .cells b{font-weight:520;font-size:15px;color:var(--mute)}
.ev-stay-read .cells [data-on] b{color:var(--ink)}
.ev-stay-read .clear{justify-self:start;border:0;background:none;padding:.6rem 0;min-height:44px;font:inherit;font-size:13.5px;text-decoration:underline;text-underline-offset:3px;cursor:pointer;color:var(--ink)}
.ev-stay-read .guests{display:flex;justify-content:space-between;align-items:center}
.ev-stay-read .step{display:inline-flex;align-items:center;gap:.4rem}
.ev-stay-read .step button{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);background:transparent;font:inherit;font-size:16px;cursor:pointer;color:var(--ink)}
.ev-stay-read .step button:disabled{opacity:.3;cursor:default}
.ev-stay-read .step output{min-width:5ch;text-align:center;font-weight:560;font-size:14px}
.ev-stay-read .sum{font-size:15px;color:var(--mute);margin:0}
.ev-stay-read .sum strong{color:var(--ink);font-weight:560}
.ev-stay-read .pickfree{display:flex;gap:.4rem;flex-wrap:wrap}
.ev-stay-read .pickfree button{min-width:44px;height:44px;border-radius:999px;border:1px solid var(--moss);background:transparent;color:var(--moss);font-family:'EvC',Georgia,serif;font-size:20px;cursor:pointer}
.ev-stay-read .go{justify-content:center;height:52px}
/* the gated CTA is an OUTLINE while it waits: a dimmed solid reads as broken */
.ev-stay-read .go[aria-disabled]{background:transparent;color:var(--ink);border:1px solid var(--line);cursor:default}
.ev-stay-read .alt{justify-self:center;text-align:center;font-size:14px}
.ev-stay-read small{font-size:12.5px;color:var(--mute);text-align:center;line-height:1.5}
@media (max-width:1100px){.ev-stay-body{grid-template-columns:1fr}}
@media (max-width:620px){.ev-stay-grids{grid-template-columns:1fr}.ev-stay-grid.two,.ev-stay-head .m2{display:none}.ev-stay-units{grid-template-columns:repeat(3,minmax(0,1fr))}}
`
