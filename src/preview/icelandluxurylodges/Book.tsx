import { useMemo, useState } from 'react'
import { IMG, STAY } from './data'

/* ── BOOK DIRECT — the SNDR stay calendar, in this page's own language ─────
   Replaces the old "send an enquiry" form. The offer she has on the table is
   a site that TAKES the booking (calendar → total → card), so the prototype
   has to show exactly that, end to end:
     1. pick a house (photo tiles, nightly rate on each)
     2. pick nights on a real two-month calendar — taken nights are struck,
        past nights are dead, a range may never cross a taken night, and the
        first taken night after a free run stays tappable as a CHECK-OUT day
        (you leave that morning, the next guest arrives that afternoon)
     3. guests + live total
     4. details → "Pay securely" (Teya's hosted page on the live site; here the
        prototype stops short of any card field on purpose)
     5. confirmation with a reference
   Availability and rates are seeded samples and say so in the note under the
   calendar. Dates are local YYYY-MM-DD strings, never Date objects in state,
   so no timezone can shift a night. */

type D = string
const pad = (n: number) => String(n).padStart(2, '0')
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parse = (s: D) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
const addDays = (s: D, n: number) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d) }
const nightsBetween = (a: D, b: D) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000)
const money = (n: number) => `${STAY.currency}${n.toLocaleString('en-GB')}`
const fmt = (s: D) => parse(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
const MONTH = (d: Date) => d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

/* Deterministic sample occupancy per house: booked runs of 2–6 nights with
   1–7 free nights between them. A one-night gap is deliberate — with a
   two-night minimum it is exactly the orphan night real calendars have. */
function takenNights(seed: number, from: D, days = 300): Set<D> {
  const set = new Set<D>()
  let s = (seed * 7919) % 233280
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280
  let i = 3 + Math.floor(rnd() * 5)
  while (i < days) {
    const len = 2 + Math.floor(rnd() * 5)
    for (let k = 0; k < len; k++) set.add(addDays(from, i + k))
    i += len + 1 + Math.floor(rnd() * 7)
  }
  return set
}

function monthCells(first: Date): (D | null)[] {
  const lead = (first.getDay() + 6) % 7 /* Monday-first */
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const cells: (D | null)[] = Array.from({ length: lead }, () => null)
  for (let d = 1; d <= days; d++) cells.push(iso(new Date(first.getFullYear(), first.getMonth(), d)))
  return cells
}

/* the hero's dates pill hands its guest count over before navigating */
export const stayPrefill = { guests: 0 }

export function StayBook({ initial, compact = false }: { initial?: string; compact?: boolean }) {
  const today = useMemo(() => iso(new Date()), [])
  /* a tab left open past midnight must not book a night that has begun */
  const stale = () => !!start && start < iso(new Date())
  const [hid, setHid] = useState(STAY.houses.some((h) => h.id === initial) ? initial! : STAY.houses[1].id)
  const hIdx = STAY.houses.findIndex((h) => h.id === hid)
  const house = STAY.houses[hIdx]
  const taken = useMemo(() => takenNights(hIdx + 3, today), [hIdx, today])

  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const [start, setStart] = useState<D | null>(null)
  const [end, setEnd] = useState<D | null>(null)
  const [hover, setHover] = useState<D | null>(null)
  const [guests, setGuests] = useState(() => Math.min(stayPrefill.guests || 4, house.max))
  const [hint, setHint] = useState('')
  const [step, setStep] = useState<'pick' | 'details' | 'done'>('pick')
  const [ref, setRef] = useState('')

  const freeRun = (a: D, b: D) => { for (let d = a; d < b; d = addDays(d, 1)) if (taken.has(d)) return false; return true }
  const canCheckout = (d: D) => !!start && !end && d > start && freeRun(start, d)

  const pickHouse = (id: string) => {
    if (id === hid) return
    const h = STAY.houses.find((x) => x.id === id)!
    setHid(id); setStart(null); setEnd(null); setHint('')
    setGuests((g) => Math.min(g, h.max))
  }

  const tap = (d: D) => {
    setHint('')
    if (start && !end && d > start) {
      if (!freeRun(start, d)) { setStart(taken.has(d) ? null : d); return }
      const n = nightsBetween(start, d)
      if (n < house.minStay) { setHint(`${house.name} has a ${house.minStay}-night minimum.`); return }
      setEnd(d); return
    }
    if (taken.has(d)) return
    setStart(d); setEnd(null)
  }

  const nights = start && end ? nightsBetween(start, end) : 0
  const total = nights * house.rate
  const previewEnd = start && !end && hover && hover > start && freeRun(start, hover) ? hover : null

  const months = compact ? [month] : [month, new Date(month.getFullYear(), month.getMonth() + 1, 1)]
  const atFirst = month.getFullYear() === new Date().getFullYear() && month.getMonth() === new Date().getMonth()

  const pay = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (stale()) { setStart(null); setEnd(null); setStep('pick'); setHint('Those dates have started. Choose again.'); return }
    const r = `ILL-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    try {
      const key = 'ill_demo_bookings'
      const prev = JSON.parse(localStorage.getItem(key) || '[]')
      prev.push({ ref: r, house: house.id, start, end, guests, total, ...Object.fromEntries(new FormData(e.currentTarget).entries()), at: new Date().toISOString() })
      localStorage.setItem(key, JSON.stringify(prev))
    } catch { /* private mode: the demo still completes */ }
    setRef(r); setStep('done')
  }

  if (step === 'done' && start && end) {
    return (
      <div className={`ill-sb ill-sb-done ${compact ? 'is-compact' : ''}`} role="status">
        <span className="ill-sb-seam" aria-hidden="true" />
        <p className="ill-sb-eyebrow">Confirmed · {ref}</p>
        <p className="ill-sb-done-h">{house.name} is yours, {fmt(start)} to {fmt(end)}.</p>
        <p className="ill-sb-done-p">{nights} nights for {guests} {guests === 1 ? 'guest' : 'guests'}, {money(total)} paid. A confirmation is on its way to your inbox.</p>
        <button type="button" className="ill-sb-link" onClick={() => { setStep('pick'); setStart(null); setEnd(null) }}>Plan another stay</button>
        <p className="ill-sb-note">{STAY.note}</p>
      </div>
    )
  }

  return (
    <div className={`ill-sb ${compact ? 'is-compact' : ''}`}>
      {!compact && <div className="ill-sb-houses" role="radiogroup" aria-label="House">
        {STAY.houses.map((h) => (
          <button key={h.id} type="button" role="radio" aria-checked={h.id === hid}
            tabIndex={h.id === hid ? 0 : -1}
            onKeyDown={(e) => {
              const k = e.key
              if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(k)) return
              e.preventDefault()
              const n = STAY.houses.length
              const next = STAY.houses[(hIdx + (k === 'ArrowRight' || k === 'ArrowDown' ? 1 : n - 1)) % n]
              pickHouse(next.id)
              ;(e.currentTarget.parentElement?.querySelector(`[data-h="${next.id}"]`) as HTMLElement | null)?.focus()
            }}
            data-h={h.id}
            className={`ill-sb-house ${h.id === hid ? 'is-on' : ''}`} onClick={() => pickHouse(h.id)} disabled={step !== 'pick'}>
            <span className="ill-sb-house-img"><img src={IMG[h.img]} alt="" loading="lazy" decoding="async" /></span>
            <span className="ill-sb-house-t">
              <b>{h.name}</b>
              <i>{money(h.rate)} a night</i>
              <i>Sleeps {h.max}</i>
            </span>
          </button>
        ))}
      </div>}

      {step === 'pick' && (
        <>
          <div className="ill-sb-cal">
            <div className="ill-sb-cal-nav">
              <button type="button" aria-label="Previous month" disabled={atFirst}
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 12L6 8l4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" aria-label="Next month"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            {months.map((m, mi) => (
              <div className={`ill-sb-month ${mi ? 'is-second' : ''}`} key={m.toISOString()}>
                <p className="ill-sb-month-h">{MONTH(m)}</p>
                <div className="ill-sb-grid" role="group" aria-label={MONTH(m)} onMouseLeave={() => setHover(null)}>
                  {WEEK.map((w) => <span className="ill-sb-wd" key={w} aria-hidden="true">{w}</span>)}
                  {monthCells(m).map((d, i) => {
                    if (!d) return <span key={`x${i}`} aria-hidden="true" />
                    const past = d < today
                    const isTaken = taken.has(d)
                    const co = canCheckout(d)
                    const rangeEnd = end ?? previewEnd
                    const inRange = !!start && !!rangeEnd && d > start && d < rangeEnd
                    const dead = past || (isTaken && !co)
                    const cls = [
                      'ill-sb-day',
                      past && 'is-past', isTaken && 'is-taken', co && isTaken && 'is-co',
                      d === start && 'is-start', d === rangeEnd && 'is-end', inRange && 'is-in',
                      d === today && 'is-today',
                    ].filter(Boolean).join(' ')
                    return (
                      <button key={d} type="button" className={cls} disabled={dead}
                        aria-pressed={d === start || d === end}
                        aria-label={`${fmt(d)}${isTaken ? (co ? ', check-out only' : ', taken') : ''}`}
                        onMouseEnter={() => setHover(d)} onClick={() => tap(d)}>
                        {parse(d).getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="ill-sb-legend" aria-hidden="true"><span className="k-free" />Free <span className="k-taken" />Taken <span className="k-sel" />Your nights</p>
        </>
      )}

      <div className="ill-sb-sum" aria-live="polite">
        <div className="ill-sb-sum-dates">
          {start && end
            ? <><b>{fmt(start)} → {fmt(end)}</b><span>{nights} nights at {house.name}</span></>
            : <><b>{start ? `${fmt(start)} → choose check-out` : 'Choose your arrival'}</b><span>{hint || `${house.minStay}-night minimum at ${house.name}`}</span></>}
        </div>
        <div className="ill-sb-guests">
          <span>Guests</span>
          <button type="button" aria-label="Fewer guests" disabled={guests <= 1 || step !== 'pick'} onClick={() => setGuests((g) => g - 1)}>−</button>
          <output aria-live="polite">{guests}</output>
          <button type="button" aria-label="More guests" disabled={guests >= house.max || step !== 'pick'} onClick={() => setGuests((g) => g + 1)}>+</button>
        </div>
        {nights > 0 && (
          <dl className="ill-sb-price">
            <div><dt>{money(house.rate)} × {nights} nights</dt><dd>{money(total)}</dd></div>
            <div><dt>Booking fee</dt><dd>{money(0)}</dd></div>
            <div className="is-total"><dt>Total</dt><dd>{money(total)}</dd></div>
          </dl>
        )}
        {step === 'pick' && (
          <button type="button" className="ill-cta ill-sb-go" disabled={!nights}
            onClick={() => { if (stale()) { setStart(null); setEnd(null); setHint('Those dates have started. Choose again.'); return } setStep('details') }}>
            {nights ? `Continue with ${nights} nights` : 'Choose your nights'}
          </button>
        )}
      </div>

      {step === 'details' && (
        <form className="ill-sb-form" onSubmit={pay}>
          <div className="ill-field-row is-two">
            <div className="ill-field">
              <label htmlFor="ill-sb-name">Name</label>
              <input id="ill-sb-name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="ill-field">
              <label htmlFor="ill-sb-email">Email</label>
              <input id="ill-sb-email" name="email" type="email" autoComplete="email" required />
            </div>
          </div>
          <div className="ill-field">
            <label htmlFor="ill-sb-note">Anything we should know (optional)</label>
            <input id="ill-sb-note" name="note" type="text" placeholder="Arrival time, a celebration, a private chef" />
          </div>
          <button className="ill-cta" type="submit">Pay {money(total)} securely</button>
          <p className="ill-sb-note">Card payment opens Teya&rsquo;s secure page on the live site. Nothing is charged in this prototype.</p>
          <button type="button" className="ill-sb-link" onClick={() => setStep('pick')}>Change dates</button>
        </form>
      )}

      {step === 'pick' && <p className="ill-sb-note">{STAY.note}</p>}
    </div>
  )
}

export const BOOK_STYLES = `
.ill-sb{display:grid;gap:22px;border-top:1px solid var(--hair);padding-top:26px;min-width:0}
.ill-sb-houses{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.ill-sb-house{display:grid;grid-template-rows:auto auto;text-align:left;border:1px solid var(--hair);padding:0;
  transition:border-color .25s var(--e),opacity .25s var(--e)}
.ill-sb-house.is-on{border-color:var(--fg);box-shadow:inset 0 0 0 1px var(--fg)}
.ill-sb-house:disabled:not(.is-on){opacity:.45}
.ill-sb-house-img{display:block;aspect-ratio:4/2.6;overflow:hidden}
.ill-sb-house-img img{transition:transform .5s var(--e)}
@media (hover:hover) and (pointer:fine){
  .ill-sb-house:not(:disabled):hover .ill-sb-house-img img{transform:scale(1.06)}
  .ill-sb-house:not(:disabled):not(.is-on):hover{border-color:var(--ink-soft)}
}
.ill-sb-house-t{display:grid;gap:1px;padding:10px 12px 12px}
.ill-sb-house-t b{font-family:var(--serif);font-weight:400;font-size:1.12rem;line-height:1.15}
.ill-sb-house-t i{font-style:normal;font-size:.76rem;color:var(--ink-mute);letter-spacing:.02em}
.ill-sb-cal{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(18px,3vw,34px)}
.ill-sb-cal-nav{position:absolute;right:0;top:-6px;display:flex;gap:6px}
.ill-sb-cal-nav button{width:36px;height:36px;border:1px solid var(--hair);border-radius:50%;display:grid;place-content:center;
  transition:border-color .2s var(--e),opacity .2s var(--e)}
.ill-sb-cal-nav button:disabled{opacity:.3;cursor:default}
@media (hover:hover) and (pointer:fine){.ill-sb-cal-nav button:not(:disabled):hover{border-color:var(--fg)}}
.ill-sb-month-h{font-family:var(--serif);font-size:1.1rem;margin-bottom:12px;line-height:36px}
.ill-sb-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));row-gap:3px}
.ill-sb-wd{font-size:.68rem;letter-spacing:.08em;color:var(--ink-mute);text-align:center;padding-bottom:6px}
.ill-sb-day{position:relative;aspect-ratio:1;font-size:.86rem;font-variant-numeric:tabular-nums;color:var(--fg);
  display:grid;place-content:center;transition:background-color .15s var(--e),color .15s var(--e)}
.ill-sb-day.is-today::after{content:'';position:absolute;left:50%;bottom:16%;width:3px;height:3px;border-radius:50%;background:var(--acc);transform:translateX(-50%)}
.ill-sb-day.is-past{color:var(--ink-mute);opacity:.4;cursor:default}
.ill-sb-day.is-taken{color:var(--ink-mute);text-decoration:line-through;text-decoration-thickness:1px;cursor:default}
.ill-sb-day.is-taken.is-co{cursor:pointer;text-decoration:none;color:var(--fg)}
.ill-sb-day.is-in{background:color-mix(in srgb,var(--acc) 22%,transparent)}
.ill-sb-day.is-start,.ill-sb-day.is-end{background:var(--fg);color:var(--bg);text-decoration:none}
@media (hover:hover) and (pointer:fine){
  .ill-sb-day:not(:disabled):not(.is-start):not(.is-end):hover{background:color-mix(in srgb,var(--fg) 10%,transparent)}
}
.ill-sb-legend{display:flex;align-items:center;gap:8px 14px;flex-wrap:wrap;font-size:.74rem;color:var(--ink-mute);margin-top:-6px}
.ill-sb-legend span{display:inline-block;width:10px;height:10px;margin-right:-8px;border:1px solid var(--hair)}
.ill-sb-legend .k-taken{background:linear-gradient(135deg,transparent 45%,var(--ink-mute) 46% 54%,transparent 55%)}
.ill-sb-legend .k-sel{background:var(--fg);border-color:var(--fg)}
.ill-sb-sum{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px 24px;align-items:center;
  border-top:1px solid var(--hair);padding-top:20px}
.ill-sb-sum-dates{display:grid;gap:3px;min-width:0}
.ill-sb-sum-dates b{font-weight:400;font-family:var(--serif);font-size:1.25rem;line-height:1.2}
.ill-sb-sum-dates span{font-size:.84rem;color:var(--ink-mute)}
.ill-sb-guests{display:flex;align-items:center;gap:6px}
.ill-sb-guests > span{font-size:.78rem;letter-spacing:.06em;color:var(--ink-mute);margin-right:6px}
.ill-sb-guests button{width:40px;height:40px;border:1px solid var(--hair);border-radius:50%;font-size:1.1rem;line-height:1}
.ill-sb-guests button:disabled{opacity:.3;cursor:default}
.ill-sb-guests output{min-width:2ch;text-align:center;font-variant-numeric:tabular-nums}
.ill-sb-price{grid-column:1/-1;display:grid;gap:7px;margin:0}
.ill-sb-price div{display:flex;justify-content:space-between;gap:16px;font-size:.92rem;color:var(--ink-soft)}
.ill-sb-price dd{margin:0;font-variant-numeric:tabular-nums}
.ill-sb-price .is-total{border-top:1px solid var(--hair);padding-top:10px;margin-top:3px;color:var(--fg);font-size:1.05rem}
.ill-sb-go{grid-column:1/-1}
/* compact: the house page's sticky card. One month, house fixed, the
   summary stacked so nothing is squeezed into a 360px column */
.ill-sb.is-compact{border-top:0;padding-top:0;gap:16px}
.ill-sb.is-compact .ill-sb-cal{grid-template-columns:minmax(0,1fr)}
.ill-sb.is-compact .ill-sb-day{aspect-ratio:1.18}
.ill-sb.is-compact .ill-sb-month-h{margin-bottom:6px}
.ill-sb.is-compact .ill-sb-sum{grid-template-columns:minmax(0,1fr)}
.ill-sb.is-compact .ill-sb-guests{justify-content:space-between}
.ill-sb.is-compact .ill-field-row.is-two{grid-template-columns:minmax(0,1fr)}
.ill-root .ill-cta:disabled{background:transparent;color:var(--ink-mute);box-shadow:inset 0 0 0 1px var(--hair);cursor:default}
.ill-sb-form{display:grid;gap:18px}
.ill-sb-note{font-size:.76rem;line-height:1.55;color:var(--ink-mute);max-width:64ch}
.ill-sb-link{justify-self:start;font-size:.86rem;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;
  color:var(--ink-soft);padding:10px 0}
.ill-sb-done{gap:14px}
.ill-sb-seam{height:1px;background:var(--acc)}
.ill-sb-eyebrow{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc)}
.ill-sb-done-h{font-family:var(--serif);font-size:clamp(1.5rem,3vw,2.2rem);line-height:1.2;max-width:24ch}
.ill-sb-done-p{color:var(--ink-soft);max-width:52ch}
@media (max-width:640px){
  .ill-sb-houses{grid-template-columns:minmax(0,1fr);gap:8px}
  .ill-sb-house{grid-template-columns:96px minmax(0,1fr);grid-template-rows:none;align-items:center}
  .ill-sb-house-img{aspect-ratio:auto;height:100%;min-height:72px}
  .ill-sb-cal{grid-template-columns:minmax(0,1fr)}
  .ill-sb-month.is-second{display:none}
  .ill-sb-day{font-size:.95rem}
  .ill-sb-wd,.ill-sb-legend,.ill-sb-note,.ill-sb-house-t i{font-size:13px}
  .ill-sb-guests button,.ill-sb-cal-nav button{width:44px;height:44px}
  .ill-sb-cal-nav{top:-10px}
}
`
