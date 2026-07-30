/**
 * THE BOOKING PROTOTYPE — the thing Fossatún can actually try.
 *
 * This is NOT a mock. Every decision on screen comes from the real shared
 * engine in src/booking/: `check()` decides whether a stay is allowed,
 * `quote()` prices it, `isOpenOn()` greys out the calendar. The same engine
 * runs the riding-tour client. Configuring Fossatún was booking.ts, no logic.
 *
 * What that buys, visibly:
 *   · December and January physically cannot be selected, because the closed
 *     dates are data the engine reads, not a sentence on a page.
 *   · Pods disappear outside their season without a special case.
 *   · Booking a room really removes it from availability (kept in localStorage
 *     so the demo has memory), which is what makes it feel like a system.
 *
 * Mode is REQUEST: the owner confirms by hand and no card is ever entered.
 * That is stage one on purpose and it needs no payment plumbing.
 */

import { useEffect, useMemo, useState } from 'react'
import type { Booking, BookingRequest, BusinessConfig, DateStr } from '../../booking/types'
import { addDays, check, daysBetween, fromDate, isOpenOn, isk, quote, resolve } from '../../booking/engine'
import { FOSSATUN_STAY, SAMPLE_RATE_NOTE } from './booking'
import { demo } from './demoStore'

const DOW = ['mán', 'þri', 'mið', 'fim', 'fös', 'lau', 'sun']
const MONTHS = ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
  'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember']

/** Monday-first grid for one month, padded with nulls. */
function monthGrid(year: number, month: number): (DateStr | null)[] {
  const first = new Date(Date.UTC(year, month, 1))
  const lead = (first.getUTCDay() + 6) % 7
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const cells: (DateStr | null)[] = Array(lead).fill(null)
  for (let d = 1; d <= days; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  return cells
}

export function StayBooking({ month }: { month: number }) {
  const cfg: BusinessConfig = FOSSATUN_STAY
  const [bookings, setBookings] = useState<Booking[]>([])
  const [resourceId, setResourceId] = useState('hotel')
  const [from, setFrom] = useState<DateStr | null>(null)
  const [to, setTo] = useState<DateStr | null>(null)
  const [people, setPeople] = useState(2)
  const [extras, setExtras] = useState<string[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [done, setDone] = useState<Booking | null>(null)

  /**
   * Show the NEXT occurrence of the month the year band selected.
   *
   * A seasonal stay site is asked "when are you coming", and if today is late
   * July then "júlí" means next July, not the three days left of this one. The
   * old behaviour opened on a month that was almost entirely in the past and
   * therefore struck through, which read as a broken calendar.
   */
  const nextOccurrence = (m1: number) => {
    const now = new Date()
    const y = now.getUTCFullYear()
    const thisMonthIdx = now.getUTCMonth()
    const target = Math.max(0, m1 - 1)
    // Fewer than 4 days left in the current month counts as gone.
    const daysLeft = new Date(Date.UTC(y, thisMonthIdx + 1, 0)).getUTCDate() - now.getUTCDate()
    const rolled = target < thisMonthIdx || (target === thisMonthIdx && daysLeft < 4)
    return { y: rolled ? y + 1 : y, m: target }
  }
  const [view, setView] = useState(() => nextOccurrence(month))
  useEffect(() => { setView(nextOccurrence(month)) }, [month])

  // the same store the owner dashboard reads, so a request made here shows up
  // there immediately, in this tab or another one
  useEffect(() => {
    setBookings(demo.all())
    return demo.subscribe(() => setBookings(demo.all()))
  }, [])

  const resource = cfg.resources.find((r) => r.id === resourceId)!
  const cells = useMemo(() => monthGrid(view.y, view.m), [view])
  const today = fromDate(new Date())

  const req: BookingRequest | null = from
    ? {
        resourceId,
        date: from,
        endDate: to ?? addDays(from, 1),
        people,
        extraIds: extras,
        customer: { name: name || 'Sýnidæmi', phone: phone || '0000000' },
      }
    : null

  const decision = req ? check(cfg, bookings, req) : null
  const q = req && decision?.ok ? quote(cfg, req) : null
  const nights = from && to ? daysBetween(from, to) : 0

  function pick(d: DateStr) {
    if (!from || (from && to)) { setFrom(d); setTo(null); return }
    if (d <= from) { setFrom(d); setTo(null); return }
    setTo(d)
  }

  function dayState(d: DateStr): 'edge' | 'mid' | undefined {
    if (from && d === from) return 'edge'
    if (to && d === to) return 'edge'
    if (from && to && d > from && d < to) return 'mid'
    return undefined
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!req || !decision?.ok || !q) return
    const booking: Booking = {
      ...req,
      customer: { name: name.trim() || 'Gestur', phone: phone.trim() || '0000000' },
      id: crypto.randomUUID(),
      status: 'REQUESTED',
      quote: q,
      createdAt: new Date().toISOString(),
    }
    setBookings(demo.add(booking))
    setDone(booking)
  }

  function reset() {
    setDone(null); setFrom(null); setTo(null); setExtras([])
  }

  const av = resolve(cfg, resource).availability
  const shutMonth = MONTHS[view.m]

  if (done) {
    return (
      <div className="fst-panel" role="status">
        <p className="fst-label">Beiðni skráð</p>
        <h3 style={{ marginTop: 8 }}>Takk. Fossatún hefur samband.</h3>
        <p style={{ marginTop: 12 }}>
          {resource.name}, {done.date} til {done.endDate}, {done.people}{' '}
          {done.people === 1 ? cfg.copy.capacitySingular : cfg.copy.capacityLabel}.
        </p>
        <p className="fst-note">{cfg.copy.confirmation}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          <button className="fst-cta fst-cta--ghost" onClick={reset}>
            Prófa aðra dagsetningu
          </button>
          <a className="fst-cta" href={`${import.meta.env.BASE_URL}preview/fossatun/stjornbord`}>
            Sjá hana í stjórnborðinu
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="fst-book">
      <div className="fst-cal">
        <div className="fst-cal__head">
          <div>
            <span className="fst-label">Lausar nætur</span>
            <h3 style={{ marginTop: 4 }}>
              {MONTHS[view.m]} {view.y}
            </h3>
          </div>
          <div className="fst-cal__nav">
            <button
              type="button"
              aria-label="Fyrri mánuður"
              onClick={() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }))}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Næsti mánuður"
              onClick={() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }))}
            >
              ›
            </button>
          </div>
        </div>

        <div className="fst-cal__grid" role="grid" aria-label="Dagatal">
          {DOW.map((d) => (
            <div key={d} className="fst-cal__dow">{d}</div>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span key={`p${i}`} />
            const open = isOpenOn(av, d) && d >= today
            return (
              <button
                key={d}
                type="button"
                className="fst-day"
                disabled={!open}
                data-state={dayState(d)}
                data-today={d === today || undefined}
                onClick={() => pick(d)}
                aria-label={`${Number(d.slice(-2))}. ${MONTHS[view.m]}${open ? '' : ', lokað'}`}
              >
                {Number(d.slice(-2))}
              </button>
            )
          })}
        </div>

        {!cells.some((d) => d && isOpenOn(av, d)) && (
          <div className="fst-shut" style={{ marginTop: 16, marginBottom: 0 }}>
            <strong>Lokað í {shutMonth}.</strong> Dagatalið sýnir það sjálft, því lokunin er
            skráð í kerfið en ekki bara skrifuð á síðuna.
          </div>
        )}
      </div>

      <form className="fst-panel" onSubmit={submit}>
        <label className="fst-field">
          <span>Gisting</span>
          <select value={resourceId} onChange={(e) => { setResourceId(e.target.value); setExtras([]) }}>
            {cfg.resources.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </label>

        <div className="fst-field">
          <span>Gestir</span>
          <div className="fst-steps">
            <button type="button" onClick={() => setPeople((p) => Math.max(1, p - 1))} aria-label="Fækka gestum">−</button>
            <output>{people}</output>
            <button type="button" onClick={() => setPeople((p) => Math.min(resource.capacity, p + 1))} aria-label="Fjölga gestum">+</button>
            <span className="fst-note" style={{ marginLeft: 6 }}>mest {resource.capacity}</span>
          </div>
        </div>

        {resource.extras?.length ? (
          <div className="fst-field">
            <span>Aukalega</span>
            {resource.extras.map((x) => (
              <label className="fst-extra" key={x.id}>
                <input
                  type="checkbox"
                  checked={extras.includes(x.id)}
                  onChange={(e) =>
                    setExtras((prev) => (e.target.checked ? [...prev, x.id] : prev.filter((i) => i !== x.id)))
                  }
                />
                <span className="n">{x.name}</span>
                <span className="p">{isk(x.price)}</span>
              </label>
            ))}
          </div>
        ) : null}

        <label className="fst-field">
          <span>Nafn</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nafnið þitt" />
        </label>
        <label className="fst-field">
          <span>Símanúmer</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="6XX XXXX" />
        </label>

        <div className="fst-quote">
          {!from && <p className="fst-note" style={{ margin: 0 }}>Veldu komudag í dagatalinu.</p>}
          {from && !to && <p className="fst-note" style={{ margin: 0 }}>Veldu brottfarardag.</p>}
          {q && (
            <>
              {q.lines.map((l, i) => (
                <div className="fst-quote__row" key={i}>
                  <span>{l.label}</span>
                  <span className="v">{isk(l.amount)}</span>
                </div>
              ))}
              <div className="fst-quote__row total">
                <span>
                  Samtals, {nights} {nights === 1 ? 'nótt' : 'nætur'}
                  <span className="fst-sample">sýnidæmi</span>
                </span>
                <span className="v">{isk(q.total)}</span>
              </div>
              <p className="fst-note">{SAMPLE_RATE_NOTE}</p>
            </>
          )}
          {decision && !decision.ok && from && to && (
            <p className="fst-note" style={{ color: 'var(--fst-lamp)' }}>
              {decision.reasons.includes('CLOSED_DAY') && 'Lokað á þessum dögum.'}
              {decision.reasons.includes('OUT_OF_SEASON') && 'Þessi gisting er ekki í boði á þessum árstíma.'}
              {decision.reasons.includes('ALREADY_BOOKED') && 'Þessi gisting er þegar bókuð þessa nótt.'}
              {decision.reasons.includes('OVER_CAPACITY') && 'Of margir gestir fyrir þessa gistingu.'}
              {decision.reasons.includes('MAX_NIGHTS') && 'Of margar nætur í einni bókun.'}
            </p>
          )}
        </div>

        <button className="fst-cta" type="submit" disabled={!decision?.ok} style={{ marginTop: 14, width: '100%' }}>
          {cfg.copy.cta}
        </button>
        <p className="fst-note">{cfg.copy.confirmation}</p>
      </form>
    </div>
  )
}
