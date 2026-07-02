import { useMemo, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ArrowRight, Check, Minus, Plus } from 'lucide-react'
import { Reveal } from '../../components/Reveal'
import { BOOKING_FACILITIES, SAMPLE_DEPARTURES, TOUR_CATALOG } from './data'
import type { CatalogTour } from './data'

/**
 * SHEET IV — THE BOOKING DESK. The full gjtravel.is booking surface,
 * intact and navigable: the real tour catalog (names/durations verified
 * from the live site), a TourMaster-style booking bar (departure,
 * travellers, room, fare), the availability overview, and the booking
 * facilities the live engine provides. Dates/seats/fares are specimen
 * values — the desk demonstrates the flow that connects to the client's
 * live booking engine at launch.
 */

const ROOMS = ['Double', 'Twin', 'Single'] as const
type Room = (typeof ROOMS)[number]

/** Specimen fare: deterministic from duration so rows stay consistent. */
const farePerPerson = (t: CatalogTour) => t.days * 42 // þús. kr

const fmtKr = (thousands: number) => `${thousands.toLocaleString('de-DE')}.000 kr.`

/** Specimen departures derived from the tour's season label. */
const departuresFor = (t: CatalogTour): string[] => {
  const s = t.season.toLowerCase()
  if (s.includes('aug 2026')) return ['08 Aug 2026', '10 Aug 2026']
  if (s.includes('dec')) return ['21 Dec 2026', '28 Dec 2026']
  if (s.includes('sep – apr') || s.includes('sep –')) return ['12 Oct 2026', '09 Nov 2026', '18 Jan 2027']
  if (s.includes('all year')) return ['14 Jul 2026', '15 Sep 2026', '10 Nov 2026']
  return ['30 Jun 2026', '14 Jul 2026', '18 Aug 2026']
}

export function BookingDesk() {
  const [cat, setCat] = useState(0)
  const category = TOUR_CATALOG[cat]
  const [tourIdx, setTourIdx] = useState(0)
  const tour = category.tours[tourIdx] ?? category.tours[0]

  const departures = useMemo(() => departuresFor(tour), [tour])
  const [depIdx, setDepIdx] = useState(0)
  const [pax, setPax] = useState(2)
  const [room, setRoom] = useState<Room>('Double')
  const [reserved, setReserved] = useState(false)

  const pp = farePerPerson(tour) + (room === 'Single' ? 12 : 0)
  const total = pp * pax

  const pickCategory = (i: number) => {
    setCat(i)
    setTourIdx(0)
    setDepIdx(0)
    setReserved(false)
  }
  const pickTour = (i: number) => {
    setTourIdx(i)
    setDepIdx(0)
    setReserved(false)
  }

  const onTabKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = (cat + dir + TOUR_CATALOG.length) % TOUR_CATALOG.length
    pickCategory(next)
    document.getElementById(`desk-tab-${TOUR_CATALOG[next].id}`)?.focus()
  }

  return (
    <section id="desk" aria-labelledby="desk-h" className="bg-gj-paper2 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase">
            Sheet IV — The Booking Desk
          </p>
          <h2 id="desk-h" className="mt-3 max-w-2xl font-survey text-4xl text-gj-ink text-balance md:text-6xl">
            Every departure, one ledger
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-gj-ink/70 md:text-base">
            The complete GJ catalogue — summer and winter Iceland, the 2026 eclipse, Greenland and
            the Faroes, private groups in four languages — with dates, seats and payment handled
            online, exactly as on the current booking system.
          </p>
        </Reveal>

        {/* Category tabs */}
        <Reveal delay={0.08}>
          <div
            role="tablist"
            aria-label="Tour categories"
            onKeyDown={onTabKey}
            className="mt-10 flex flex-wrap gap-2"
          >
            {TOUR_CATALOG.map((c, i) => (
              <button
                key={c.id}
                id={`desk-tab-${c.id}`}
                role="tab"
                aria-selected={i === cat}
                tabIndex={i === cat ? 0 : -1}
                onClick={() => pickCategory(i)}
                className={`border px-4 py-2.5 font-grotesk text-sm transition-colors duration-200 focus-visible:outline-gj-ink ${
                  i === cat
                    ? 'border-gj-ink bg-gj-ink text-gj-paper'
                    : 'border-gj-ink/30 text-gj-ink/75 hover:border-gj-ink hover:text-gj-ink'
                }`}
              >
                {c.label}
                <span className="ml-2 font-grotesk text-[10px] text-current/60 tabular-nums">
                  {c.tours.length}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 font-grotesk text-[10px] tracking-[0.22em] text-gj-lichen uppercase">
            {category.note}
          </p>
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Tour ledger */}
          <div className="lg:col-span-3">
            <ul className="border-t-2 border-gj-ink">
              {category.tours.map((t, i) => {
                const active = i === tourIdx
                return (
                  <li key={`${t.name}-${t.days}`}>
                    <button
                      onClick={() => pickTour(i)}
                      aria-pressed={active}
                      className={`group grid w-full grid-cols-[3.2rem_1fr_auto] items-baseline gap-3 border-b border-gj-ink/15 px-1 py-4 text-left transition-colors focus-visible:outline-gj-ink ${
                        active ? 'bg-gj-ink text-gj-paper' : 'hover:bg-gj-ink/5'
                      }`}
                    >
                      <span
                        className={`font-grotesk text-[11px] font-medium tracking-[0.14em] tabular-nums ${
                          active ? 'text-gj-paper/70' : 'text-gj-cobalt'
                        }`}
                      >
                        {String(t.days).padStart(2, '0')}d
                      </span>
                      <span className="min-w-0">
                        <span className="block font-survey text-lg leading-snug md:text-xl">{t.name}</span>
                        <span
                          className={`mt-0.5 flex flex-wrap gap-x-3 font-grotesk text-[10px] tracking-[0.18em] uppercase ${
                            active ? 'text-gj-paper/60' : 'text-gj-lichen'
                          }`}
                        >
                          <span>{t.season}</span>
                          {t.smallGroup && <span>Small group</span>}
                          {t.lang && <span>{t.lang}</span>}
                          {t.isNew && <span className={active ? 'text-gj-paper' : 'text-gj-vermilion-ink'}>New</span>}
                        </span>
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 shrink-0 self-center transition-transform ${
                          active ? 'translate-x-0' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Booking bar — TourMaster-style flow */}
          <div className="lg:col-span-2">
            <div className="border border-gj-ink/25 bg-gj-paper p-6 md:p-7 lg:sticky lg:top-6">
              <p className="font-grotesk text-[10px] font-medium tracking-[0.22em] text-gj-lichen uppercase">
                Booking sheet
              </p>
              <h3 className="mt-2 font-survey text-2xl leading-snug text-gj-ink">{tour.name}</h3>
              <p className="mt-1 font-grotesk text-[11px] tracking-[0.18em] text-gj-cobalt uppercase tabular-nums">
                {tour.days} days · {tour.season}
              </p>

              {/* Departure */}
              <div className="mt-6">
                <p className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase">
                  Departure
                </p>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Departure date">
                  {departures.map((d, i) => (
                    <button
                      key={d}
                      aria-pressed={i === depIdx}
                      onClick={() => {
                        setDepIdx(i)
                        setReserved(false)
                      }}
                      className={`border px-3 py-2 font-grotesk text-[13px] tabular-nums transition-colors focus-visible:outline-gj-ink ${
                        i === depIdx
                          ? 'border-gj-ink bg-gj-ink text-gj-paper'
                          : 'border-gj-ink/30 text-gj-ink/75 hover:border-gj-ink'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travellers + room */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase">
                    Travellers
                  </p>
                  <div className="mt-2 flex items-center border border-gj-ink/30">
                    <button
                      aria-label="Fewer travellers"
                      onClick={() => setPax((p) => Math.max(1, p - 1))}
                      className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-gj-ink hover:text-gj-paper focus-visible:outline-gj-ink"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="flex-1 text-center font-survey text-xl tabular-nums" aria-live="polite">
                      {pax}
                    </span>
                    <button
                      aria-label="More travellers"
                      onClick={() => setPax((p) => Math.min(16, p + 1))}
                      className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-gj-ink hover:text-gj-paper focus-visible:outline-gj-ink"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase">
                    Room
                  </p>
                  <div className="mt-2 flex" role="group" aria-label="Room type">
                    {ROOMS.map((r) => (
                      <button
                        key={r}
                        aria-pressed={room === r}
                        onClick={() => setRoom(r)}
                        className={`h-11 flex-1 border font-grotesk text-[12px] transition-colors focus-visible:outline-gj-ink ${
                          room === r
                            ? 'border-gj-ink bg-gj-ink text-gj-paper'
                            : 'border-gj-ink/30 text-gj-ink/75 hover:border-gj-ink'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fare */}
              <dl className="mt-6 space-y-1.5 border-t border-gj-ink/15 pt-4 font-grotesk text-sm">
                <div className="flex justify-between">
                  <dt className="text-gj-ink/60">Specimen fare · per person</dt>
                  <dd className="tabular-nums">{fmtKr(pp)}</dd>
                </div>
                <div className="flex justify-between font-semibold">
                  <dt>Total · {pax} travellers</dt>
                  <dd className="tabular-nums">{fmtKr(total)}</dd>
                </div>
              </dl>

              <button
                onClick={() => setReserved(true)}
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 bg-gj-vermilion px-8 py-4 font-grotesk text-sm font-bold tracking-[0.06em] text-white uppercase transition-colors hover:bg-[color-mix(in_oklab,var(--color-gj-vermilion),black_12%)] focus-visible:outline-gj-ink"
              >
                {reserved ? (
                  <>
                    <Check className="h-4 w-4" /> Seats held — demonstration
                  </>
                ) : (
                  <>
                    Reserve seats
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
              <p className="mt-3 font-grotesk text-[10px] leading-relaxed tracking-[0.18em] text-gj-lichen uppercase" aria-live="polite">
                {reserved
                  ? 'No real booking was made. On the live site this completes with card payment.'
                  : 'Specimen dates & fares. The desk connects to the live booking engine at launch.'}
              </p>
            </div>
          </div>
        </div>

        {/* Availability overview */}
        <Reveal delay={0.05}>
          <div className="mt-16 border border-gj-ink/25 bg-gj-paper p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-survey text-2xl text-gj-ink">Availability overview</h3>
              <span className="font-grotesk text-[10px] tracking-[0.22em] text-gj-lichen uppercase">
                Specimen departures — the live sheet lists every date of every tour
              </span>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-gj-ink font-grotesk text-[10px] tracking-[0.22em] text-gj-lichen uppercase">
                    <th scope="col" className="py-2 pr-4 font-medium">Tour</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Departure</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Seats</th>
                    <th scope="col" className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="font-grotesk text-sm">
                  {SAMPLE_DEPARTURES.map((d) => (
                    <tr key={`${d.tour}-${d.date}`} className="border-b border-gj-ink/12">
                      <td className="py-3 pr-4 font-survey text-base">{d.tour}</td>
                      <td className="py-3 pr-4 tabular-nums">{d.date}</td>
                      <td className="py-3 pr-4 tabular-nums">{d.seats > 0 ? d.seats : '—'}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-2 font-grotesk text-[11px] tracking-[0.14em] uppercase ${
                            d.state === 'open'
                              ? 'text-gj-ink/75'
                              : d.state === 'few'
                                ? 'text-gj-vermilion-ink'
                                : 'text-gj-lichen'
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`h-1.5 w-1.5 rounded-full ${
                              d.state === 'open' ? 'bg-gj-cobalt' : d.state === 'few' ? 'bg-gj-vermilion' : 'bg-gj-lichen'
                            }`}
                          />
                          {d.state === 'open' ? 'Open' : d.state === 'few' ? 'Few seats' : 'Waitlist'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Booking facilities — the full surface, intact */}
        <Reveal delay={0.08}>
          <ul className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {BOOKING_FACILITIES.map(([term, detail]) => (
              <li key={term} className="border-t border-gj-ink/15 pt-3">
                <p className="font-grotesk text-xs font-medium tracking-[0.14em] text-gj-cobalt uppercase">{term}</p>
                <p className="mt-1 text-sm text-gj-ink/75">{detail}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
