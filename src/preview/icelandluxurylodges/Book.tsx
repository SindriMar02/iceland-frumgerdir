import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { STAY, DISCOUNTS, DEMO_CODES } from './data'

/* ── BOOK DIRECT — the SNDR stay calendar, in this page's own language ─────
   The offer she has on the table is a site that TAKES the booking (calendar →
   total → card), so the prototype shows exactly that, end to end:
     1. pick a house (three quiet tiles, nightly rate on each)
     2. pick nights on a real calendar — taken nights are struck, past nights
        are dead, a range may never cross a taken night, and the first taken
        night after a free run stays tappable as a CHECK-OUT day
     3. guests + live total, in a card that stays beside the calendar
     4. details → "Pay securely" (Teya's hosted page on the live site; here the
        prototype stops short of any card field on purpose)
     5. confirmation with a reference
   Round 6b: the calendar is one component (RangeCal) shared by the booking
   section, the house page's sticky card and the hero bar's dates popover, so
   dates chosen on the first screen arrive on the house page already chosen.
   Availability and rates are seeded samples and say so under the calendar.
   Dates are local YYYY-MM-DD strings, never Date objects in state. */

export type D = string
const pad = (n: number) => String(n).padStart(2, '0')
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const parse = (s: D) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const addDays = (s: D, n: number) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d) }
export const nightsBetween = (a: D, b: D) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000)
const money = (n: number) => `${STAY.currency}${n.toLocaleString('en-GB')}`
export const fmt = (s: D) => parse(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
export const fmtShort = (s: D) => parse(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const MONTH = (d: Date) => d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const firstOfMonth = (s?: D | null) => { const d = s ? parse(s) : new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) }

/* Deterministic sample occupancy per house: booked runs of 2–6 nights with
   1–7 free nights between them. A one-night gap is deliberate — with a
   two-night minimum it is exactly the orphan night real calendars have. */
export function takenNights(seed: number, from: D, days = 300): Set<D> {
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
export const takenFor = (houseId: string, today: D) => takenNights(STAY.houses.findIndex((h) => h.id === houseId) + 3, today)

function monthCells(first: Date): (D | null)[] {
  const lead = (first.getDay() + 6) % 7 /* Monday-first */
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const cells: (D | null)[] = Array.from({ length: lead }, () => null)
  for (let d = 1; d <= days; d++) cells.push(iso(new Date(first.getFullYear(), first.getMonth(), d)))
  return cells
}

export const freeRun = (taken: Set<D>, a: D, b: D) => { for (let d = a; d < b; d = addDays(d, 1)) if (taken.has(d)) return false; return true }

/* one tap on the calendar, the same rules everywhere */
export function pickNight(
  sel: { start: D | null; end: D | null }, d: D, taken: Set<D>, minStay: number, houseName: string,
): { start: D | null; end: D | null; hint: string } {
  const { start, end } = sel
  if (start && !end && d > start) {
    if (!freeRun(taken, start, d)) return { start: taken.has(d) ? null : d, end: null, hint: '' }
    const n = nightsBetween(start, d)
    if (n < minStay) return { start, end: null, hint: `${houseName} has a ${minStay}-night minimum.` }
    return { start, end: d, hint: '' }
  }
  if (taken.has(d)) return { start, end, hint: '' }
  return { start: d, end: null, hint: '' }
}

/* the hero bar hands its choice over before navigating; the house page's
   card picks it up on mount (and only if those nights are free there) */
/* ── automatic discounts (Signý's meeting, 23 Oct 2026) ──────────────────
   SAMPLE rules: on the live site she sets every one herself in SNDR Bókun.
   Mirrors the engine (sndr-platform src/booking/smartPricing.ts): PER NIGHT
   the single largest percent applies, never a sum (contract grein 3.4):
     · longer stay: the highest tier the stay reaches, on every night of it;
     · last minute: a night within N days of today (judged per night, so a
       stay starting soon and running on is priced night by night);
     · gap night: a single empty night booked on both sides.
   Ties go gap, then stay, then last minute, as in the engine. The lines group
   nights by the rule that won, so they always add up to the total exactly. */
type Kind = 'gap' | 'long' | 'short'
export { DEMO_CODES }
export function priceStay(rate: number, start: D | null, end: D | null, today: D, taken: Set<D>) {
  if (!start || !end) return { base: 0, lines: [] as { label: string; amount: number }[], total: 0 }
  const n = nightsBetween(start, end), base = n * rate
  if (!(n > 0) || !(rate > 0)) return { base: Math.max(0, base), lines: [] as { label: string; amount: number }[], total: Math.max(0, base) }
  const pc = (v: number) => (Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 0)
  const tiers = (DISCOUNTS.long ?? []).filter((t) => t.min >= 1 && pc(t.pct) > 0).sort((a, b) => a.min - b.min)
  const tier = [...tiers].reverse().find((t) => n >= t.min)
  const stayPct = pc(tier?.pct ?? 0)
  const shortPct = DISCOUNTS.short && DISCOUNTS.short.days >= 0 ? pc(DISCOUNTS.short.pct) : 0
  const gapRule = pc(DISCOUNTS.gap?.pct ?? 0)
  const won: Record<Kind, { nights: number; pct: number }> = { gap: { nights: 0, pct: 0 }, long: { nights: 0, pct: 0 }, short: { nights: 0, pct: 0 } }
  for (let i = 0; i < n; i++) {
    const night = addDays(start, i)
    const stepPct = shortPct && nightsBetween(today, night) <= DISCOUNTS.short.days ? shortPct : 0
    const gapPct = gapRule && taken.has(addDays(night, -1)) && taken.has(addDays(night, 1)) ? gapRule : 0
    const pct = Math.max(stepPct, gapPct, stayPct)
    if (pct <= 0) continue
    const kind: Kind = gapPct > 0 && gapPct >= stepPct && gapPct >= stayPct ? 'gap' : stayPct > 0 && stayPct >= stepPct ? 'long' : 'short'
    won[kind].nights++; won[kind].pct = pct
  }
  /* the engine prices each night to the cent; the prototype shows whole euros, so each
     rule's nights are rounded once as a group (7 × €690 at 15% = €724.50 → €725) */
  const off = (k: Kind) => Math.round(won[k].nights * rate * won[k].pct / 100)
  const per = (k: number) => k === n ? '' : ` (${k} ${k === 1 ? 'night' : 'nights'})`
  const lines: { label: string; amount: number }[] = []
  if (off('long')) lines.push({ label: `Stay ${tier!.min}+ nights −${stayPct}%${per(won.long.nights)}`, amount: off('long') })
  if (off('short')) lines.push({ label: `Within ${DISCOUNTS.short.days} days −${shortPct}%${per(won.short.nights)}`, amount: off('short') })
  if (off('gap')) lines.push({ label: `Gap night −${gapRule}%${per(won.gap.nights)}`, amount: off('gap') })
  const total = base - lines.reduce((a, l) => a + l.amount, 0)
  return { base, lines, total: Math.max(0, total) }
}

export const stayPrefill: { house: string | null; guests: number; start: D | null; end: D | null } = { house: null, guests: 0, start: null, end: null }

/* ── the calendar itself ──────────────────────────────────────────────── */
export function RangeCal({
  count, today, taken, start, end, onTap, initialMonth, autoFocusFirst,
}: {
  count: 1 | 2; today: D; taken: Set<D>; start: D | null; end: D | null
  onTap: (d: D) => void; initialMonth?: D | null; autoFocusFirst?: boolean
}) {
  const [month, setMonth] = useState(() => firstOfMonth(initialMonth))
  const [hover, setHover] = useState<D | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const atFirst = month.getFullYear() === new Date().getFullYear() && month.getMonth() === new Date().getMonth()
  const months = count === 1 ? [month] : [month, new Date(month.getFullYear(), month.getMonth() + 1, 1)]
  const previewEnd = start && !end && hover && hover > start && freeRun(taken, start, hover) ? hover : null
  const canCheckout = (d: D) => !!start && !end && d > start && freeRun(taken, start, d)
  useEffect(() => {
    if (!autoFocusFirst) return
    gridRef.current?.querySelector<HTMLButtonElement>('button.ill-sb-day:not(:disabled)')?.focus()
  }, [autoFocusFirst])
  return (
    <div className={`ill-sb-cal ${count === 1 ? 'is-one' : ''}`} ref={gridRef}>
      <div className="ill-sb-cal-nav">
        <button type="button" aria-label="Previous month" disabled={atFirst}
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 12L6 8l4-4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" aria-label="Next month"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
                  onMouseEnter={() => setHover(d)} onClick={() => onTap(d)}>
                  <span>{parse(d).getDate()}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <p className="ill-sb-legend" aria-hidden="true"><span className="k-free" />Free <span className="k-taken" />Taken <span className="k-sel" />Your nights</p>
    </div>
  )
}

/* ── the booking: calendar beside a summary card ─────────────────────── */
export function StayBook({ initial, compact = false }: { initial?: string; compact?: boolean }) {
  const today = useMemo(() => iso(new Date()), [])
  /* a tab left open past midnight must not book a night that has begun */
  const stale = () => !!start && start < iso(new Date())
  const [hid, setHid] = useState(STAY.houses.some((h) => h.id === initial) ? initial! : STAY.houses[1].id)
  const hIdx = STAY.houses.findIndex((h) => h.id === hid)
  const house = STAY.houses[hIdx]
  const taken = useMemo(() => takenNights(hIdx + 3, today), [hIdx, today])

  /* the hero bar's choice, if it is for this house and those nights are free here */
  const pre = useMemo(() => {
    const p = stayPrefill
    const ok = p.start && p.end && (!p.house || p.house === hid) && p.start >= today && freeRun(taken, p.start, p.end)
      && nightsBetween(p.start, p.end) >= house.minStay
    return ok ? { start: p.start, end: p.end } : { start: null, end: null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [start, setStart] = useState<D | null>(pre.start)
  const [end, setEnd] = useState<D | null>(pre.end)
  const [guests, setGuests] = useState(() => Math.min(stayPrefill.guests || 4, house.max))
  const [hint, setHint] = useState('')
  const [step, setStep] = useState<'pick' | 'details' | 'done'>('pick')
  const [ref, setRef] = useState('')

  const pickHouse = (id: string) => {
    if (id === hid) return
    const h = STAY.houses.find((x) => x.id === id)!
    setHid(id); setStart(null); setEnd(null); setHint('')
    setGuests((g) => Math.min(g, h.max))
  }
  const tap = (d: D) => {
    const r = pickNight({ start, end }, d, taken, house.minStay, house.name)
    setStart(r.start); setEnd(r.end); setHint(r.hint)
  }

  const nights = start && end ? nightsBetween(start, end) : 0
  const price = priceStay(house.rate, start, end, today, taken)
  const total = price.total

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
        <p className="ill-sb-done-p">Your house manual opens from the link in your email, or with your 4-digit pass <b className="ill-sb-code">{DEMO_CODES[house.id]}</b>, from three days before you arrive. <Link className="ill-sb-link" to="/preview/icelandluxurylodges/gestir">Open the manual</Link></p>
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
            <b>{h.name}</b>
            <i>{money(h.rate)} a night · sleeps {h.max}</i>
          </button>
        ))}
      </div>}

      <div className="ill-sb-body">
        <div className="ill-sb-main">
          {step === 'pick' && (
            <RangeCal key={hid} count={compact ? 1 : 2} today={today} taken={taken} start={start} end={end} onTap={tap} initialMonth={start} />
          )}
          {step === 'details' && (
            <form className="ill-sb-form" onSubmit={pay}>
              <p className="ill-sb-form-h">Who is coming</p>
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
        </div>

        <aside className="ill-sb-side" aria-live="polite">
          <div className="ill-sb-sum-dates">
            {start && end
              ? <><b>{fmtShort(start)} <i aria-hidden="true">→</i> {fmtShort(end)}</b><span>{nights} nights at {house.name}</span></>
              : <><b>{start ? `${fmtShort(start)} → check-out?` : 'Choose your arrival'}</b><span>{hint || `${house.minStay}-night minimum at ${house.name}`}</span></>}
          </div>
          <div className="ill-sb-guests">
            <span>Guests</span>
            <div>
              <button type="button" aria-label="Fewer guests" disabled={guests <= 1 || step !== 'pick'} onClick={() => setGuests((g) => g - 1)}>−</button>
              <output aria-live="polite">{guests}</output>
              <button type="button" aria-label="More guests" disabled={guests >= house.max || step !== 'pick'} onClick={() => setGuests((g) => g + 1)}>+</button>
            </div>
          </div>
          <dl className="ill-sb-price">
            <div><dt>{money(house.rate)} × {nights || '—'} nights</dt><dd>{nights ? money(price.base) : '—'}</dd></div>
            {price.lines.map((l) => <div className="is-off" key={l.label}><dt>{l.label}</dt><dd>−{money(l.amount)}</dd></div>)}
            <div><dt>Booking fee</dt><dd>{money(0)}</dd></div>
            <div className="is-total"><dt>Total</dt><dd>{nights ? money(total) : '—'}</dd></div>
          </dl>
          {step === 'pick' && (
            <button type="button" className="ill-cta ill-sb-go" disabled={!nights}
              onClick={() => { if (stale()) { setStart(null); setEnd(null); setHint('Those dates have started. Choose again.'); return } setStep('details') }}>
              {nights ? `Continue with ${nights} nights` : 'Choose your nights'}
            </button>
          )}
          <p className="ill-sb-note">Discounts apply by themselves, and each night gets the single best one, never two added together. The amounts are samples: you set every rule (longer stays, short notice, gap nights) in your own settings.</p>
          <p className="ill-sb-note">{STAY.note}</p>
        </aside>
      </div>
    </div>
  )
}

export const BOOK_STYLES = `
.ill-sb{display:grid;gap:clamp(36px,5vh,56px);min-width:0}
/* house tiles: three quiet columns on one hairline, the chosen one in ink */
.ill-sb-houses{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 clamp(16px,2.5vw,36px)}
.ill-sb-house{display:grid;gap:4px;text-align:left;padding:16px 0 18px;border-top:1px solid var(--hair);color:var(--ink-mute);
  transition:color .25s var(--e),box-shadow .25s var(--e)}
.ill-sb-house b{font-family:var(--serif);font-weight:300;font-size:clamp(1.2rem,1.8vw,1.5rem);line-height:1.1}
.ill-sb-house i{font-style:normal;font-size:.8rem;letter-spacing:.02em}
.ill-sb-house.is-on{color:var(--fg);box-shadow:inset 0 1px 0 var(--fg)}
.ill-sb-house:disabled:not(.is-on){opacity:.45}
@media (hover:hover) and (pointer:fine){.ill-sb-house:not(:disabled):not(.is-on):hover{color:var(--ink-soft)}}
.ill-sb-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,380px);gap:clamp(36px,5.5vw,96px);align-items:start}
.ill-sb-main{min-width:0}
/* calendar */
.ill-sb-cal{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(18px,3vw,40px)}
.ill-sb-cal.is-one{grid-template-columns:minmax(0,1fr)}
.ill-sb-cal-nav{position:absolute;right:0;top:-4px;display:flex;gap:6px;z-index:1}
.ill-sb-cal-nav button{width:36px;height:36px;box-shadow:inset 0 0 0 1px var(--hair);display:grid;place-content:center;
  transition:box-shadow .2s var(--e),opacity .2s var(--e),transform .16s var(--e)}
.ill-sb-cal-nav button:disabled{opacity:.3;cursor:default}
.ill-sb-cal-nav button:not(:disabled):active{transform:scale(.94)}
@media (hover:hover) and (pointer:fine){.ill-sb-cal-nav button:not(:disabled):hover{box-shadow:inset 0 0 0 1px var(--fg)}}
.ill-sb-month-h{font-family:var(--serif);font-size:1.25rem;margin-bottom:14px;line-height:36px}
.ill-sb-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));row-gap:2px}
.ill-sb-wd{font-size:.64rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-mute);text-align:center;padding-bottom:10px}
.ill-sb-day{position:relative;aspect-ratio:1;font-family:var(--serif);font-size:.98rem;font-variant-numeric:tabular-nums;color:var(--fg);
  display:grid;place-content:center;transition:background-color .15s var(--e),color .15s var(--e)}
.ill-sb-day span{position:relative;z-index:1}
.ill-sb-day.is-today::after{content:'';position:absolute;left:50%;bottom:14%;width:3px;height:3px;border-radius:50%;background:var(--acc);transform:translateX(-50%)}
.ill-sb-day.is-past{color:var(--ink-mute);opacity:.35;cursor:default}
.ill-sb-day.is-taken{color:var(--ink-mute);text-decoration:line-through;text-decoration-thickness:1px;cursor:default}
.ill-sb-day.is-taken.is-co{cursor:pointer;text-decoration:none;color:var(--fg)}
.ill-sb-day.is-in{background:color-mix(in srgb,var(--acc) 14%,transparent)}
.ill-sb-day.is-start,.ill-sb-day.is-end{background:var(--fg);color:var(--bg);text-decoration:none}
.ill-sb-day.is-start{box-shadow:inset 0 0 0 1px var(--fg)}
@media (hover:hover) and (pointer:fine){
  .ill-sb-day:not(:disabled):not(.is-start):not(.is-end):hover{background:color-mix(in srgb,var(--fg) 9%,transparent)}
}
.ill-sb-legend{grid-column:1/-1;display:flex;align-items:center;gap:8px 16px;flex-wrap:wrap;font-size:.72rem;letter-spacing:.02em;color:var(--ink-mute);margin-top:-4px}
.ill-sb-legend span{display:inline-block;width:10px;height:10px;margin-right:-8px;border:1px solid var(--hair)}
.ill-sb-legend .k-taken{background:linear-gradient(135deg,transparent 45%,var(--ink-mute) 46% 54%,transparent 55%)}
.ill-sb-legend .k-sel{background:var(--fg);border-color:var(--fg)}
/* the summary card: stays beside the calendar while you choose */
.ill-sb-side{position:sticky;top:96px;display:grid;gap:18px;padding:24px 24px 20px;
  background:color-mix(in srgb,var(--fg) 4%,var(--bg));box-shadow:inset 0 0 0 1px var(--hair)}
.ill-sb-sum-dates{display:grid;gap:4px;min-width:0;border-bottom:1px solid var(--hair);padding-bottom:16px}
.ill-sb-sum-dates b{font-weight:300;font-family:var(--serif);font-size:clamp(1.3rem,1.9vw,1.6rem);line-height:1.15}
.ill-sb-sum-dates b i{font-style:normal;color:var(--acc);padding:0 .1em}
.ill-sb-sum-dates span{font-size:.82rem;color:var(--ink-mute)}
.ill-sb-guests{display:flex;align-items:center;justify-content:space-between;gap:12px}
.ill-sb-guests > span{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute)}
.ill-sb-guests > div{display:flex;align-items:center;gap:8px}
.ill-sb-guests button{width:36px;height:36px;box-shadow:inset 0 0 0 1px var(--hair);font-size:1rem;line-height:1;
  transition:box-shadow .2s var(--e),transform .16s var(--e)}
.ill-sb-guests button:not(:disabled):active{transform:scale(.94)}
@media (hover:hover) and (pointer:fine){.ill-sb-guests button:not(:disabled):hover{box-shadow:inset 0 0 0 1px var(--fg)}}
.ill-sb-guests button:disabled{opacity:.3;cursor:default}
.ill-sb-guests output{min-width:2ch;text-align:center;font-family:var(--serif);font-size:1.15rem;font-variant-numeric:tabular-nums}
.ill-sb-price{display:grid;gap:8px;margin:0}
.ill-sb-price div{display:flex;justify-content:space-between;gap:16px;font-size:.9rem;color:var(--ink-soft)}
.ill-sb-price dd{margin:0;font-variant-numeric:tabular-nums}
.ill-sb-price .is-off{color:var(--acc)}
.ill-sb-code{font-family:var(--sans);font-weight:500;letter-spacing:.12em}
.ill-sb-price .is-total{border-top:1px solid var(--hair);padding-top:12px;margin-top:2px;color:var(--fg);font-size:1rem}
.ill-sb-price .is-total dd{font-family:var(--serif);font-size:1.3rem}
.ill-sb-go{width:100%}
.ill-sb-form{display:grid;gap:18px;max-width:560px}
.ill-sb-form-h{font-family:var(--serif);font-size:1.4rem}
.ill-sb-link{justify-self:start;font-size:.84rem;color:var(--ink-mute);text-decoration:underline;text-underline-offset:4px;transition:color .2s var(--e)}
@media (hover:hover) and (pointer:fine){.ill-sb-link:hover{color:var(--fg)}}
.ill-sb-note{font-size:.74rem;line-height:1.5;color:var(--ink-mute);max-width:56ch}
/* done */
.ill-sb-done{position:relative;gap:12px;max-width:640px;padding-top:28px}
.ill-sb-seam{display:block;width:72px;height:1px;background:var(--fg)}
.ill-sb-eyebrow{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc)}
.ill-sb-done-h{font-family:var(--serif);font-size:clamp(1.5rem,3vw,2.3rem);line-height:1.15}
.ill-sb-done-p{color:var(--ink-soft);max-width:48ch}
/* compact: the house page's sticky card. One month, house fixed, the
   summary under the calendar instead of beside it */
.ill-sb.is-compact{gap:16px}
.ill-sb.is-compact .ill-sb-body{grid-template-columns:minmax(0,1fr);gap:16px}
.ill-sb.is-compact .ill-sb-side{position:static;padding:0;background:none;box-shadow:none;gap:14px}
.ill-sb.is-compact .ill-sb-month-h{font-size:1.1rem;margin-bottom:8px}
.ill-sb.is-compact .ill-sb-day{aspect-ratio:1.15;font-size:.9rem}
.ill-sb.is-compact .ill-field-row.is-two{grid-template-columns:minmax(0,1fr)}
@media (max-width:980px){
  .ill-sb-body{grid-template-columns:minmax(0,1fr)}
  .ill-sb-side{position:static}
}
@media (max-width:640px){
  .ill-sb-cal{grid-template-columns:minmax(0,1fr)}
  .ill-sb-month.is-second{display:none}
  .ill-sb-houses{grid-template-columns:minmax(0,1fr);gap:0}
  .ill-sb-house{padding:12px 0}
  .ill-sb-day{font-size:15px}
  .ill-sb-cal-nav button,.ill-sb-guests button{width:44px;height:44px}
}
`
