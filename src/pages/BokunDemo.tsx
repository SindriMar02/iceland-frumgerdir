import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  addBooking, clearAll, loadBookings, newId, onChange, seedIfEmpty, setStatus,
} from '../booking/store'
import {
  CHILD_DISCOUNT, POLARHESTAR, TOURS, runsOn, tourById, tourTimes,
} from '../booking/polarhestar'
import { addDays, check, fromDate, isk, loadOn, REASON_TEXT } from '../booking/engine'
import type { Booking } from '../booking/types'

/* ── BÓKUNARKERFI · demo ──────────────────────────────────────────────────
   Three views of the same system, so the whole thing can be judged in one
   link: what the guest sees, what the owner sees, and what setting it up
   looks like.

   Everything runs on the shared engine in src/booking/. Pólar Hestar is
   nothing but a config file (src/booking/polarhestar.ts) — that is the claim
   this demo exists to prove.

   Demo only: requests live in localStorage, nothing is sent anywhere.
   ────────────────────────────────────────────────────────────────────────── */

const BONE = '#EEE7DA'
const PINE = '#20352B'
const TERRA = '#B0572E'
const BASALT = '#161B19'
const INK = '#1D2320'
const SOFT = 'rgba(29,35,32,.68)'
const MUTE = 'rgba(29,35,32,.46)'
const HAIR = 'rgba(29,35,32,.16)'

const SANS = "'Hanken Grotesk', system-ui, sans-serif"
const SERIF = "'Spectral', Georgia, serif"
const MONO = "'Space Mono', ui-monospace, monospace"

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B0572E] focus-visible:ring-offset-[#EEE7DA]'

const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
const todayISO = () => fromDate(new Date())

const WEEKDAYS = ['sunnudagur', 'mánudagur', 'þriðjudagur', 'miðvikudagur', 'fimmtudagur', 'föstudagur', 'laugardagur']
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maí', 'jún', 'júl', 'ágú', 'sep', 'okt', 'nóv', 'des']

function prettyDate(d: string) {
  const dt = new Date(`${d}T00:00:00Z`)
  return `${WEEKDAYS[dt.getUTCDay()]} ${dt.getUTCDate()}. ${MONTHS[dt.getUTCMonth()]}`
}

/* ═══ 1. THE GUEST ══════════════════════════════════════════════════════ */

function GuestView({ bookings }: { bookings: Booking[] }) {
  const [tourId, setTourId] = useState(TOURS[0].id)
  const [date, setDate] = useState(() => addDays(todayISO(), 2))
  const [time, setTime] = useState<number | null>(null)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [done, setDone] = useState<string | null>(null)

  const tour = tourById(tourId)!
  const people = adults + children
  const inSeason = runsOn(tour, date)

  // free departures for this tour on this date
  const times = useMemo(() => {
    if (!inSeason) return []
    return tourTimes(tour).filter(
      (m) => loadOn(bookings, 'SLOT', tour.id, date, m) + people <= tour.maxRiders,
    )
  }, [tour, date, people, bookings, inSeason])

  useEffect(() => {
    if (time !== null && !times.includes(time)) setTime(null)
  }, [times, time])

  const total = adults * tour.price + children * (tour.price - CHILD_DISCOUNT)

  const decision = useMemo(() => {
    if (time === null) return null
    return check(
      POLARHESTAR,
      bookings,
      { resourceId: tour.id, date, startMinute: time, people, customer: { name, phone } },
      new Date(),
    )
  }, [tour.id, date, time, people, bookings, name, phone])

  const canSend = !!name.trim() && !!phone.trim() && time !== null && decision?.ok && people > 0

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend || time === null) return
    const id = newId()
    addBooking({
      id,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      resourceId: tour.id,
      date,
      startMinute: time,
      people,
      customer: { name: name.trim(), phone: phone.trim(), email: email.trim() || undefined },
      note: [note.trim(), children ? `${children} börn (afsláttur)` : ''].filter(Boolean).join(' · ') || undefined,
      quote: {
        lines: [
          ...(adults ? [{ label: `${adults} ${adults === 1 ? 'fullorðinn' : 'fullorðnir'}`, amount: adults * tour.price }] : []),
          ...(children ? [{ label: `${children} ${children === 1 ? 'barn' : 'börn'}`, amount: children * (tour.price - CHILD_DISCOUNT) }] : []),
        ],
        total, deposit: 0, units: 1, estimate: true,
      },
    })
    setDone(id)
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 sm:p-12" style={{ border: `1px solid ${HAIR}` }}>
        <p style={{ fontFamily: MONO, fontSize: '.76rem', letterSpacing: '.14em', color: TERRA }} className="uppercase">
          Beiðni {done}
        </p>
        <h3 className="mt-4" style={{ fontFamily: SERIF, fontSize: 'clamp(1.6rem,4vw,2.3rem)', lineHeight: 1.15 }}>
          Takk fyrir, {name.split(' ')[0]}.
        </h3>
        <p className="mt-4 max-w-[46ch]" style={{ color: SOFT, lineHeight: 1.6 }}>
          {POLARHESTAR.copy.confirmation}
        </p>
        <dl className="mt-7 grid gap-2" style={{ fontFamily: MONO, fontSize: '.86rem' }}>
          <div className="flex justify-between border-b py-2" style={{ borderColor: HAIR }}>
            <dt style={{ color: MUTE }}>Ferð</dt><dd>{tour.name}</dd>
          </div>
          <div className="flex justify-between border-b py-2" style={{ borderColor: HAIR }}>
            <dt style={{ color: MUTE }}>Dagur</dt><dd>{prettyDate(date)} kl. {hhmm(time!)}</dd>
          </div>
          <div className="flex justify-between border-b py-2" style={{ borderColor: HAIR }}>
            <dt style={{ color: MUTE }}>Knapar</dt><dd>{adults} {adults === 1 ? 'fullorðinn' : 'fullorðnir'}{children ? `, ${children} ${children === 1 ? 'barn' : 'börn'}` : ''}</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt style={{ color: MUTE }}>Áætlað verð</dt><dd style={{ color: TERRA }}>{isk(total)}</dd>
          </div>
        </dl>
        <button type="button" onClick={() => { setDone(null); setName(''); setPhone(''); setEmail(''); setNote('') }}
          className={`mt-8 rounded-full px-6 ${FOCUS}`}
          style={{ minHeight: 48, border: `1px solid ${HAIR}`, fontFamily: SANS }}>
          Senda aðra beiðni
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-6 sm:p-10" style={{ border: `1px solid ${HAIR}` }}>
      {/* tour */}
      <fieldset>
        <legend style={{ fontFamily: MONO, fontSize: '.74rem', letterSpacing: '.14em', color: MUTE }} className="uppercase">
          1 · Veldu reiðtúr
        </legend>
        <div className="mt-4 grid gap-2">
          {TOURS.map((t) => {
            const on = t.id === tourId
            const runs = runsOn(t, date)
            return (
              <button
                key={t.id} type="button" onClick={() => setTourId(t.id)}
                aria-pressed={on}
                className={`flex flex-wrap items-baseline justify-between gap-2 rounded-xl px-4 py-3 text-left ${FOCUS}`}
                style={{
                  border: `1px solid ${on ? PINE : HAIR}`,
                  background: on ? PINE : 'transparent',
                  color: on ? BONE : INK,
                  opacity: runs ? 1 : 0.45,
                  minHeight: 56,
                }}
              >
                <span>
                  <span style={{ fontFamily: SANS, fontWeight: 600 }}>{t.name}</span>
                  <span style={{ fontFamily: MONO, fontSize: '.74rem', color: on ? 'rgba(238,231,218,.7)' : MUTE }}>
                    {'  '}{t.duration} · {t.level}
                  </span>
                  {/*
                    The month has to be NAMED or the sentence is not said at all.
                    A guest can clear the date field, and then this rendered
                    "ekki í boði í" with nothing after it: a dangling preposition
                    in front of a customer, on every tour at once.
                  */}
                  {!runs && (
                    <span style={{ fontFamily: MONO, fontSize: '.72rem', color: on ? BONE : TERRA, display: 'block' }}>
                      {MONTHS[Number(date.slice(5, 7)) - 1]
                        ? `ekki í boði í ${MONTHS[Number(date.slice(5, 7)) - 1]}`
                        : 'ekki í boði á þessum tíma'}
                    </span>
                  )}
                </span>
                <span style={{ fontFamily: MONO, fontSize: '.86rem' }}>{isk(t.price)}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* date + riders */}
      <fieldset className="mt-8 grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Dagsetning og fjöldi</legend>
        <label className="grid gap-2">
          <span style={{ fontFamily: MONO, fontSize: '.74rem', letterSpacing: '.14em', color: MUTE }} className="uppercase">
            2 · Dagsetning
          </span>
          <input
            type="date" value={date} min={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className={`rounded-xl px-4 ${FOCUS}`}
            style={{ minHeight: 52, border: `1px solid ${HAIR}`, fontFamily: SANS, fontSize: '1rem', background: 'transparent', color: INK }}
          />
        </label>
        <div className="grid gap-2">
          <span style={{ fontFamily: MONO, fontSize: '.74rem', letterSpacing: '.14em', color: MUTE }} className="uppercase">
            3 · Knapar
          </span>
          <div className="flex gap-3">
            <Stepper label="Fullorðnir" value={adults} min={0} max={tour.maxRiders - children} onChange={setAdults} />
            <Stepper label={`Börn (${CHILD_DISCOUNT / 1000}þ afsl.)`} value={children} min={0} max={tour.maxRiders - adults} onChange={setChildren} />
          </div>
        </div>
      </fieldset>

      {/* times */}
      <fieldset className="mt-8">
        <legend style={{ fontFamily: MONO, fontSize: '.74rem', letterSpacing: '.14em', color: MUTE }} className="uppercase">
          4 · Laus brottfarartími
        </legend>
        {!inSeason ? (
          <p className="mt-4" style={{ color: TERRA, fontFamily: MONO, fontSize: '.86rem' }}>
            {tour.name} er ekki í boði á þessum árstíma. Veldu aðra ferð eða annan dag.
          </p>
        ) : times.length === 0 ? (
          <p className="mt-4" style={{ color: TERRA, fontFamily: MONO, fontSize: '.86rem' }}>
            Fullbókað þennan dag fyrir {people} knapa. Veldu annan dag.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {times.map((m) => {
              const left = tour.maxRiders - loadOn(bookings, 'SLOT', tour.id, date, m)
              const on = time === m
              return (
                <button
                  key={m} type="button" onClick={() => setTime(m)} aria-pressed={on}
                  className={`rounded-full px-5 ${FOCUS}`}
                  style={{
                    minHeight: 48,
                    border: `1px solid ${on ? TERRA : HAIR}`,
                    background: on ? TERRA : 'transparent',
                    color: on ? '#fff' : INK,
                    fontFamily: MONO, fontSize: '.9rem',
                  }}
                >
                  {hhmm(m)}
                  <span style={{ opacity: 0.7, fontSize: '.76rem' }}>{'  '}{left} laus</span>
                </button>
              )
            })}
          </div>
        )}
      </fieldset>

      {/* contact */}
      <fieldset className="mt-8 grid gap-4 sm:grid-cols-2">
        <legend style={{ fontFamily: MONO, fontSize: '.74rem', letterSpacing: '.14em', color: MUTE }} className="uppercase">
          5 · Hvernig náum við í þig
        </legend>
        <Field label="Nafn" value={name} onChange={setName} required />
        <Field label="Símanúmer" value={phone} onChange={setPhone} required inputMode="tel" />
        <Field label="Netfang (má sleppa)" value={email} onChange={setEmail} type="email" />
        <Field label="Athugasemd (má sleppa)" value={note} onChange={setNote} />
      </fieldset>

      {/* total + send */}
      <div className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t pt-7" style={{ borderColor: HAIR }}>
        <div>
          <p style={{ fontFamily: MONO, fontSize: '.74rem', color: MUTE }}>Áætlað verð</p>
          <p style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem,5vw,2.6rem)', lineHeight: 1 }}>{isk(total)}</p>
          <p className="mt-1" style={{ fontFamily: MONO, fontSize: '.72rem', color: MUTE }}>
            Ekkert er greitt á netinu
          </p>
        </div>
        <button
          type="submit" disabled={!canSend}
          className={`rounded-full px-8 ${FOCUS}`}
          style={{
            minHeight: 56, background: canSend ? PINE : 'rgba(29,35,32,.16)',
            color: canSend ? BONE : 'rgba(29,35,32,.45)',
            fontFamily: SANS, fontWeight: 600, fontSize: '1.05rem',
            cursor: canSend ? 'pointer' : 'not-allowed',
          }}
        >
          {POLARHESTAR.copy.cta}
        </button>
      </div>
      {decision && !decision.ok && (
        <p className="mt-4" style={{ color: TERRA, fontFamily: MONO, fontSize: '.82rem' }}>
          {decision.reasons.map((r) => REASON_TEXT[r]).join(' ')}
        </p>
      )}
    </form>
  )
}

function Stepper({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (n: number) => void
}) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-1 rounded-xl" style={{ border: `1px solid ${HAIR}`, minHeight: 52 }}>
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
          className={`grid h-12 w-12 place-items-center ${FOCUS}`} aria-label={`Fækka: ${label}`}
          style={{ fontSize: '1.3rem', color: SOFT }}>−</button>
        <span className="flex-1 text-center" style={{ fontFamily: MONO, fontSize: '1.05rem' }}>{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
          className={`grid h-12 w-12 place-items-center ${FOCUS}`} aria-label={`Fjölga: ${label}`}
          style={{ fontSize: '1.3rem', color: SOFT }}>+</button>
      </div>
      <p className="mt-1.5" style={{ fontFamily: MONO, fontSize: '.72rem', color: MUTE }}>{label}</p>
    </div>
  )
}

function Field({ label, value, onChange, required, type = 'text', inputMode }: {
  label: string; value: string; onChange: (v: string) => void
  required?: boolean; type?: string; inputMode?: 'tel'
}) {
  return (
    <label className="grid gap-1.5">
      <span style={{ fontFamily: MONO, fontSize: '.72rem', color: MUTE }}>{label}</span>
      <input
        type={type} value={value} required={required} inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-xl px-4 ${FOCUS}`}
        style={{ minHeight: 52, border: `1px solid ${HAIR}`, fontFamily: SANS, fontSize: '1rem', background: 'transparent', color: INK }}
      />
    </label>
  )
}

/* ═══ 2. THE OWNER ══════════════════════════════════════════════════════ */

function OwnerView({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<'NEW' | 'UPCOMING' | 'ALL'>('NEW')
  const today = todayISO()

  const rows = useMemo(() => {
    const sorted = [...bookings].sort((a, b) =>
      a.date === b.date ? (a.startMinute ?? 0) - (b.startMinute ?? 0) : a.date < b.date ? -1 : 1,
    )
    if (filter === 'NEW') return sorted.filter((b) => b.status === 'REQUESTED')
    if (filter === 'UPCOMING') return sorted.filter((b) => b.status === 'CONFIRMED' && b.date >= today)
    return sorted
  }, [bookings, filter, today])

  const newCount = bookings.filter((b) => b.status === 'REQUESTED').length
  const ridersToday = bookings
    .filter((b) => b.status === 'CONFIRMED' && b.date === today)
    .reduce((s, b) => s + b.people, 0)

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Nýjar beiðnir" value={String(newCount)} accent={newCount ? TERRA : undefined} />
        <Stat label="Knapar í dag" value={String(ridersToday)} />
        <Stat label="Staðfest framundan" value={String(bookings.filter((b) => b.status === 'CONFIRMED' && b.date >= today).length)} />
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {([['NEW', 'Nýjar beiðnir'], ['UPCOMING', 'Framundan'], ['ALL', 'Allt']] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFilter(k)} aria-pressed={filter === k}
            className={`rounded-full px-5 ${FOCUS}`}
            style={{
              minHeight: 44, fontFamily: MONO, fontSize: '.84rem',
              border: `1px solid ${filter === k ? PINE : HAIR}`,
              background: filter === k ? PINE : 'transparent',
              color: filter === k ? BONE : INK,
            }}>
            {l}
          </button>
        ))}
        <button type="button" onClick={clearAll} className={`ml-auto rounded-full px-4 ${FOCUS}`}
          style={{ minHeight: 44, fontFamily: MONO, fontSize: '.76rem', color: MUTE, border: `1px solid ${HAIR}` }}>
          Hreinsa demo
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        {rows.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center" style={{ border: `1px solid ${HAIR}`, color: MUTE, fontFamily: MONO, fontSize: '.88rem' }}>
            Ekkert hér. Sendu beiðni í flipanum „Gesturinn“ til að sjá hana birtast.
          </p>
        )}
        {rows.map((b) => {
          const t = tourById(b.resourceId)
          return (
            <article key={b.id} className="rounded-xl bg-white p-5 sm:p-6" style={{ border: `1px solid ${b.status === 'REQUESTED' ? TERRA : HAIR}` }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p style={{ fontFamily: MONO, fontSize: '.72rem', color: MUTE }}>
                    {b.id} · <StatusChip status={b.status} />
                  </p>
                  <h4 className="mt-2" style={{ fontFamily: SERIF, fontSize: '1.35rem', lineHeight: 1.2 }}>
                    {t?.name ?? b.resourceId}
                  </h4>
                  <p className="mt-1" style={{ fontFamily: MONO, fontSize: '.86rem', color: SOFT }}>
                    {prettyDate(b.date)} kl. {hhmm(b.startMinute ?? 0)} · {b.people} knapar
                  </p>
                  <p className="mt-3" style={{ fontFamily: SANS }}>
                    {b.customer.name}
                    <a href={`tel:${b.customer.phone}`} className={`ml-3 ${FOCUS}`} style={{ color: TERRA, fontFamily: MONO, fontSize: '.86rem' }}>
                      {b.customer.phone}
                    </a>
                  </p>
                  {b.note && <p className="mt-2" style={{ color: MUTE, fontSize: '.92rem' }}>„{b.note}“</p>}
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: MONO, fontSize: '1rem' }}>{isk(b.quote.total)}</p>
                  {b.status === 'REQUESTED' && (
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => setStatus(b.id, 'CONFIRMED')}
                        className={`rounded-full px-5 ${FOCUS}`}
                        style={{ minHeight: 44, background: PINE, color: BONE, fontFamily: SANS, fontWeight: 600, fontSize: '.92rem' }}>
                        Staðfesta
                      </button>
                      <button type="button" onClick={() => setStatus(b.id, 'DECLINED')}
                        className={`rounded-full px-4 ${FOCUS}`}
                        style={{ minHeight: 44, border: `1px solid ${HAIR}`, color: SOFT, fontFamily: SANS, fontSize: '.92rem' }}>
                        Hafna
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function StatusChip({ status }: { status: Booking['status'] }) {
  const map = {
    REQUESTED: ['Ný beiðni', TERRA],
    CONFIRMED: ['Staðfest', PINE],
    DECLINED: ['Hafnað', MUTE],
    CANCELLED: ['Afbókað', MUTE],
  } as const
  const [label, color] = map[status]
  return <span style={{ color }}>{label}</span>
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl bg-white p-5" style={{ border: `1px solid ${HAIR}` }}>
      <p style={{ fontFamily: MONO, fontSize: '.72rem', letterSpacing: '.12em', color: MUTE }} className="uppercase">{label}</p>
      <p className="mt-2" style={{ fontFamily: SERIF, fontSize: '2.2rem', lineHeight: 1, color: accent ?? INK }}>{value}</p>
    </div>
  )
}

/* ═══ 3. SETUP ══════════════════════════════════════════════════════════ */

function SetupView() {
  return (
    <div className="grid gap-5">
      <p className="max-w-[62ch]" style={{ color: SOFT, lineHeight: 1.65, fontSize: '1.05rem' }}>
        Uppsetningin er þetta og ekkert annað. Engin forritun, engin tenging við önnur kerfi.
        Sama vél keyrir gistiheimili, verkstæði og stofu, aðeins þessi listi breytist.
      </p>

      <div className="rounded-2xl bg-white p-6 sm:p-8" style={{ border: `1px solid ${HAIR}` }}>
        <h4 style={{ fontFamily: SERIF, fontSize: '1.3rem' }}>Ferðirnar</h4>
        <table className="mt-4 w-full" style={{ fontFamily: MONO, fontSize: '.84rem' }}>
          <thead>
            <tr style={{ color: MUTE }}>
              <th className="py-2 text-left font-normal">Heiti</th>
              <th className="py-2 text-left font-normal">Verð</th>
              <th className="py-2 text-left font-normal">Mánuðir</th>
              <th className="py-2 text-left font-normal">Brottfarir</th>
              <th className="py-2 text-right font-normal">Hámark</th>
            </tr>
          </thead>
          <tbody>
            {TOURS.map((t) => (
              <tr key={t.id} className="border-t" style={{ borderColor: HAIR }}>
                <td className="py-2.5">{t.name}</td>
                <td className="py-2.5">{isk(t.price)}</td>
                <td className="py-2.5">{t.months ? t.months.map((m) => MONTHS[m - 1]).join(' ') : 'allt árið'}</td>
                <td className="py-2.5">{t.times.join(' ')}</td>
                <td className="py-2.5 text-right">{t.maxRiders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SetupCard title="Barnaafsláttur" value={`${isk(CHILD_DISCOUNT)} · að 12 ára`} />
        <SetupCard title="Fyrirvari" value="12 klukkustundir" />
        <SetupCard title="Greiðsla" value="Engin á netinu. Greitt á staðnum." />
        <SetupCard title="Staðfesting" value="Þið staðfestið hverja beiðni sjálf." />
      </div>

      <div className="rounded-2xl p-6 sm:p-8" style={{ background: PINE, color: BONE }}>
        <h4 style={{ fontFamily: SERIF, fontSize: '1.3rem' }}>Að breyta einhverju</h4>
        <p className="mt-3 max-w-[56ch]" style={{ lineHeight: 1.65, color: 'rgba(238,231,218,.86)' }}>
          Í fullbúnu kerfi breytið þið ferðum, verði og hámarksfjölda sjálf í vefumsjónarkerfinu,
          og lokið einstökum dögum beint hér í bókunarhlutanum. Í þessu sýnishorni er taflan
          aðeins til að sýna hvaða stillingar liggja að baki.
        </p>
      </div>
    </div>
  )
}

function SetupCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-5" style={{ border: `1px solid ${HAIR}` }}>
      <p style={{ fontFamily: MONO, fontSize: '.72rem', letterSpacing: '.12em', color: MUTE }} className="uppercase">{title}</p>
      <p className="mt-2" style={{ fontFamily: SANS, fontSize: '1.02rem' }}>{value}</p>
    </div>
  )
}

/* ═══ shell ═════════════════════════════════════════════════════════════ */

type Tab = 'guest' | 'owner' | 'setup'

export default function BokunDemo() {
  const [tab, setTab] = useState<Tab>('guest')
  const [bookings, setBookings] = useState<Booking[]>([])

  const refresh = useCallback(() => setBookings(loadBookings()), [])

  useEffect(() => {
    seedIfEmpty(todayISO(), addDays(todayISO(), 1))
    refresh()
    return onChange(refresh)
  }, [refresh])

  const newCount = bookings.filter((b) => b.status === 'REQUESTED').length

  return (
    <div style={{ background: BONE, color: INK, fontFamily: SANS, minHeight: '100vh' }}>
      <header style={{ background: BASALT, color: BONE }}>
        <div className="mx-auto max-w-[1080px] px-5 py-8 sm:px-8 sm:py-12">
          <p style={{ fontFamily: MONO, fontSize: '.74rem', letterSpacing: '.16em', color: 'rgba(238,231,218,.6)' }} className="uppercase">
            Frumgerð · bókunarkerfi
          </p>
          <h1 className="mt-4" style={{ fontFamily: SERIF, fontSize: 'clamp(2rem,5.5vw,3.2rem)', lineHeight: 1.08 }}>
            Bókanir fyrir Pólar Hesta
          </h1>
          <p className="mt-4 max-w-[58ch]" style={{ color: 'rgba(238,231,218,.78)', lineHeight: 1.6 }}>
            Þrjár hliðar á sama kerfinu: það sem gesturinn sér, það sem þið sjáið, og hvernig
            uppsetningin lítur út. Ekkert er sent neitt, þetta er sýnishorn.
          </p>
        </div>
      </header>

      <div className="sticky top-0 z-10" style={{ background: BONE, borderBottom: `1px solid ${HAIR}` }}>
        <div className="mx-auto flex max-w-[1080px] gap-2 px-5 py-3 sm:px-8" role="tablist" aria-label="Hlutar kerfisins">
          {([['guest', 'Gesturinn'], ['owner', `Eigandinn${newCount ? ` (${newCount})` : ''}`], ['setup', 'Uppsetning']] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k as Tab)}
              className={`rounded-full px-5 ${FOCUS}`}
              style={{
                minHeight: 46, fontFamily: SANS, fontWeight: 600, fontSize: '.96rem',
                background: tab === k ? PINE : 'transparent',
                color: tab === k ? BONE : SOFT,
                border: `1px solid ${tab === k ? PINE : HAIR}`,
              }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-[1080px] px-5 py-10 sm:px-8 sm:py-14">
        {tab === 'guest' && <GuestView bookings={bookings} />}
        {tab === 'owner' && <OwnerView bookings={bookings} />}
        {tab === 'setup' && <SetupView />}
      </main>

      <footer className="mx-auto max-w-[1080px] px-5 pb-16 sm:px-8">
        <p style={{ fontFamily: MONO, fontSize: '.76rem', color: MUTE, lineHeight: 1.7 }}>
          Sýnishorn. Beiðnir vistast aðeins í þessum vafra og fara hvergi. Ferðir, verð,
          brottfarartímar og barnaafsláttur eru raunverulegar upplýsingar af polarhestar.is.
        </p>
      </footer>
    </div>
  )
}
