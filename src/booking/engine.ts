/**
 * The engine. Pure functions: given config + existing bookings + a request,
 * decide whether it is bookable and what it costs.
 *
 * No storage, no network, no framework. That is deliberate — it means the same
 * engine runs in a Cloudflare Worker, in a React form for live validation, and
 * in tests, with no adapter layer.
 */

import type {
  Availability, Booking, BookingRequest, BusinessConfig, DateStr, Decision,
  ISK, Minutes, Quote, QuoteLine, Rejection, Resource, Unit, Weekday,
} from './types'

/* ── date helpers. Strings only, so no timezone can ever shift a day. ──── */

export const toDate = (d: DateStr): Date => {
  const [y, m, day] = d.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, day))
}

export const fromDate = (d: Date): DateStr =>
  `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`

export const addDays = (d: DateStr, n: number): DateStr => {
  const x = toDate(d)
  x.setUTCDate(x.getUTCDate() + n)
  return fromDate(x)
}

export const weekdayOf = (d: DateStr): Weekday => toDate(d).getUTCDay() as Weekday

export const daysBetween = (a: DateStr, b: DateStr): number =>
  Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86400000)

/** Every date a booking occupies. For NIGHT the departure day is NOT occupied. */
export function occupiedDates(req: { date: DateStr; endDate?: DateStr }, unit: Unit): DateStr[] {
  if (unit !== 'NIGHT' || !req.endDate) return [req.date]
  const n = daysBetween(req.date, req.endDate)
  return Array.from({ length: Math.max(0, n) }, (_, i) => addDays(req.date, i))
}

/** Units charged: nights, or 1 for a day/slot. */
export function unitCount(req: { date: DateStr; endDate?: DateStr }, unit: Unit): number {
  if (unit !== 'NIGHT') return 1
  return req.endDate ? Math.max(0, daysBetween(req.date, req.endDate)) : 0
}

/* ── availability ─────────────────────────────────────────────────────── */

/** Business defaults with the resource's overrides merged on top. */
export function resolve(cfg: BusinessConfig, resource?: Resource) {
  return {
    availability: { ...cfg.availability, ...(resource?.availability ?? {}) } as Availability,
    pricing: { ...cfg.pricing, ...(resource?.pricing ?? {}) },
  }
}

function openingFor(av: Availability, d: DateStr) {
  return av.opening.find((o) => o.weekday === weekdayOf(d))
}

export function isOpenOn(av: Availability, d: DateStr): boolean {
  if (av.closed?.includes(d)) return false
  if (av.season && (d < av.season.from || d > av.season.to)) return false
  const o = openingFor(av, d)
  return !!o && o.from !== undefined && o.to !== undefined
}

/**
 * Slot starts available on a date, before existing bookings are considered.
 * SLOT verticals only (clinic, tour departures).
 */
export function slotStarts(av: Availability, d: DateStr, resource?: Resource): Minutes[] {
  if (!isOpenOn(av, d)) return []
  const o = openingFor(av, d)!
  // an explicit per-resource list always wins over the generated grid
  if (resource?.times?.length) {
    const len = av.slotMinutes ?? 30
    return resource.times.filter((t) => t >= o.from! && t + len <= o.to!)
  }
  const len = av.slotMinutes ?? 30
  const step = len + (av.bufferMinutes ?? 0)
  const out: Minutes[] = []
  for (let t = o.from!; t + len <= o.to!; t += step) out.push(t)
  return out
}

/* ── conflicts ────────────────────────────────────────────────────────── */

const LIVE: Booking['status'][] = ['REQUESTED', 'CONFIRMED']

/** People already booked on a resource for a given date (and slot, if SLOT). */
export function loadOn(
  bookings: Booking[],
  unit: Unit,
  resourceId: string,
  date: DateStr,
  startMinute?: Minutes,
): number {
  return bookings
    .filter((b) => LIVE.includes(b.status) && b.resourceId === resourceId)
    .filter((b) => occupiedDates(b, unit).includes(date))
    .filter((b) => (unit === 'SLOT' ? b.startMinute === startMinute : true))
    .reduce((sum, b) => sum + b.people, 0)
}

/* ── the decision ─────────────────────────────────────────────────────── */

export function check(
  cfg: BusinessConfig,
  bookings: Booking[],
  req: BookingRequest,
  now: Date = new Date(),
): Decision {
  const reasons: Rejection[] = []
  const resource: Resource | undefined = cfg.resources.find((r) => r.id === req.resourceId)
  if (!resource) return { ok: false, reasons: ['UNKNOWN_RESOURCE'] }
  const { availability: av } = resolve(cfg, resource)

  if (resource.active === false) reasons.push('RESOURCE_INACTIVE')

  const nights = unitCount(req, cfg.unit)
  if (cfg.unit === 'NIGHT') {
    if (!req.endDate || nights <= 0) reasons.push('INVALID_RANGE')
    if (av.minNights && nights > 0 && nights < av.minNights) reasons.push('MIN_NIGHTS')
    if (av.maxNights && nights > av.maxNights) reasons.push('MAX_NIGHTS')
  }

  // every occupied date must be open
  const dates = occupiedDates(req, cfg.unit)
  for (const d of dates) {
    if (av.season && (d < av.season.from || d > av.season.to)) {
      reasons.push('OUT_OF_SEASON')
      break
    }
  }
  for (const d of dates) {
    if (!isOpenOn(av, d)) {
      reasons.push('CLOSED_DAY')
      break
    }
  }

  if (cfg.unit === 'SLOT') {
    const starts = slotStarts(av, req.date, resource)
    if (req.startMinute === undefined || !starts.includes(req.startMinute)) {
      reasons.push('OUTSIDE_HOURS')
    }
  }

  // lead time and horizon, measured from the start of the requested day
  const startMs = toDate(req.date).getTime() + (req.startMinute ?? 0) * 60000
  const hoursAway = (startMs - now.getTime()) / 3600000
  if (av.leadTimeHours !== undefined && hoursAway < av.leadTimeHours) reasons.push('TOO_SOON')
  if (av.horizonDays !== undefined && hoursAway / 24 > av.horizonDays) reasons.push('TOO_FAR_AHEAD')

  // capacity, checked on every occupied date
  if (req.people < 1) reasons.push('OVER_CAPACITY')
  for (const d of dates) {
    const used = loadOn(bookings, cfg.unit, req.resourceId, d, req.startMinute)
    if (used + req.people > resource.capacity) {
      reasons.push(used >= resource.capacity ? 'ALREADY_BOOKED' : 'OVER_CAPACITY')
      break
    }
  }

  // extras must exist on this resource and still be in stock
  for (const id of req.extraIds ?? []) {
    const extra = resource.extras?.find((e) => e.id === id)
    if (!extra) {
      reasons.push('EXTRA_UNAVAILABLE')
      break
    }
    if (extra.stock !== undefined) {
      const taken = bookings
        .filter((b) => LIVE.includes(b.status) && b.extraIds?.includes(id))
        .filter((b) => occupiedDates(b, cfg.unit).some((d) => dates.includes(d))).length
      if (taken >= extra.stock) {
        reasons.push('EXTRA_UNAVAILABLE')
        break
      }
    }
  }

  return { ok: reasons.length === 0, reasons: [...new Set(reasons)] }
}

/* ── pricing ──────────────────────────────────────────────────────────── */

export function quote(cfg: BusinessConfig, req: BookingRequest): Quote {
  const resource = cfg.resources.find((r) => r.id === req.resourceId)
  const { pricing: p } = resolve(cfg, resource)
  const units = unitCount(req, cfg.unit)
  const lines: QuoteLine[] = []

  if (p.base) lines.push({ label: 'Grunngjald', amount: p.base })

  if (p.perUnit) {
    const label =
      units > 1
        ? `${units} ${cfg.copy.unitPlural} á ${isk(p.perUnit)}`
        : `1 ${cfg.copy.unitSingular}`
    lines.push({ label, amount: p.perUnit * units })
  }

  const included = p.includedPeople ?? 0
  const extraPeople = Math.max(0, req.people - included)
  if (p.perPerson && extraPeople > 0) {
    const chargeable = cfg.unit === 'NIGHT' ? extraPeople * Math.max(1, units) : extraPeople
    lines.push({
      label: `${extraPeople} ${extraPeople === 1 ? 'gestur til viðbótar' : 'gestir til viðbótar'}`,
      amount: p.perPerson * chargeable,
    })
  }

  for (const id of req.extraIds ?? []) {
    const e = resource?.extras?.find((x) => x.id === id)
    if (!e) continue
    const amount = e.per === 'UNIT' ? e.price * Math.max(1, units) : e.price
    lines.push({ label: e.name, amount })
  }

  let total = lines.reduce((s, l) => s + l.amount, 0)

  // modifiers apply to the running subtotal, in declared order
  for (const m of p.modifiers ?? []) {
    if (!modifierApplies(m.when, req)) continue
    if (m.kind === 'ADD') {
      lines.push({ label: m.label, amount: m.value })
      total += m.value
    } else {
      const delta = Math.round(total * (m.value - 1))
      lines.push({ label: m.label, amount: delta })
      total += delta
    }
  }

  total = Math.round(total)
  return {
    lines,
    total,
    deposit: p.depositPct ? Math.round((total * p.depositPct) / 100) : 0,
    units,
    estimate: cfg.mode === 'REQUEST',
  }
}

function modifierApplies(when: NonNullable<BusinessConfig['pricing']['modifiers']>[number]['when'], req: BookingRequest): boolean {
  if (when.weekdays && !when.weekdays.includes(weekdayOf(req.date))) return false
  if (when.fromMinute !== undefined && (req.startMinute ?? 0) < when.fromMinute) return false
  if (when.dateFrom && req.date < when.dateFrom) return false
  if (when.dateTo && req.date > when.dateTo) return false
  return true
}

/** Icelandic thousands separator is a PERIOD. Never let ICU near this. */
export function isk(n: ISK): string {
  const s = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${n < 0 ? '-' : ''}${s} kr.`
}

/* ── what the UI asks for ─────────────────────────────────────────────── */

/** Bookable dates in a window, for painting a calendar. */
export function openDates(
  cfg: BusinessConfig,
  bookings: Booking[],
  from: DateStr,
  days: number,
  people = 1,
): DateStr[] {
  const out: DateStr[] = []
  for (let i = 0; i < days; i++) {
    const d = addDays(from, i)
    const anyRoom = cfg.resources
      .filter((r) => r.active !== false)
      .filter((r) => isOpenOn(resolve(cfg, r).availability, d))
      .some((r) => loadOn(bookings, cfg.unit, r.id, d) + people <= r.capacity)
    if (anyRoom) out.push(d)
  }
  return out
}

/** Free slot starts on a date for a resource. SLOT verticals. */
export function freeSlots(
  cfg: BusinessConfig,
  bookings: Booking[],
  resourceId: string,
  date: DateStr,
): Minutes[] {
  const resource = cfg.resources.find((r) => r.id === resourceId)
  if (!resource) return []
  const { availability } = resolve(cfg, resource)
  return slotStarts(availability, date, resource).filter(
    (m) => loadOn(bookings, cfg.unit, resourceId, date, m) < resource.capacity,
  )
}

/* ── the DEPARTURE roll-up ────────────────────────────────────────────────
   An owner never thinks in bookings, they think in departures: "the 10:00 has
   five riders across three bookings, so six horses". Everything the schedule
   views need is derived here, purely, from the same booking list. */

export interface Departure {
  date: DateStr
  startMinute?: Minutes
  resourceId: string
  resourceName: string
  capacity: number
  /** Live bookings on this departure, requested and confirmed. */
  bookings: Booking[]
  /** People on CONFIRMED bookings. What you saddle horses for. */
  riders: number
  /** People on bookings still awaiting an answer. */
  pending: number
  /** Seats left against capacity, counting both. */
  left: number
}

/** Departures on a date that have at least one live booking. */
export function departuresOn(cfg: BusinessConfig, bookings: Booking[], date: DateStr): Departure[] {
  const live = bookings.filter(
    (b) => LIVE.includes(b.status) && occupiedDates(b, cfg.unit).includes(date),
  )
  const key = (b: Booking) => `${b.resourceId}@${b.startMinute ?? 0}`
  const groups = new Map<string, Booking[]>()
  for (const b of live) groups.set(key(b), [...(groups.get(key(b)) ?? []), b])

  return [...groups.entries()]
    .map(([k, list]) => {
      const resource = cfg.resources.find((r) => r.id === list[0].resourceId)
      const riders = list.filter((b) => b.status === 'CONFIRMED').reduce((s, b) => s + b.people, 0)
      const pending = list.filter((b) => b.status === 'REQUESTED').reduce((s, b) => s + b.people, 0)
      const capacity = resource?.capacity ?? 0
      return {
        date,
        startMinute: list[0].startMinute,
        resourceId: list[0].resourceId,
        resourceName: resource?.name ?? k,
        capacity,
        bookings: [...list].sort((a, b) => (a.status === 'REQUESTED' ? -1 : 1)),
        riders,
        pending,
        left: Math.max(0, capacity - riders - pending),
      }
    })
    .sort((a, b) => (a.startMinute ?? 0) - (b.startMinute ?? 0))
}

/** One day summarised, for painting a calendar. */
export interface DaySummary {
  date: DateStr
  open: boolean
  departures: number
  riders: number
  pending: number
}

export function daySummary(cfg: BusinessConfig, bookings: Booking[], date: DateStr): DaySummary {
  const deps = departuresOn(cfg, bookings, date)
  const anyOpen = cfg.resources.some((r) => isOpenOn(resolve(cfg, r).availability, date))
  return {
    date,
    open: anyOpen,
    departures: deps.length,
    riders: deps.reduce((s, d) => s + d.riders, 0),
    pending: deps.reduce((s, d) => s + d.pending, 0),
  }
}

export function weekSummary(
  cfg: BusinessConfig, bookings: Booking[], from: DateStr, days = 14,
): DaySummary[] {
  return Array.from({ length: days }, (_, i) => daySummary(cfg, bookings, addDays(from, i)))
}

/** Everyone to ring if a departure has to be cancelled. */
export function contactsFor(dep: Departure): { name: string; phone: string; people: number }[] {
  return dep.bookings.map((b) => ({ name: b.customer.name, phone: b.customer.phone, people: b.people }))
}

/** Human Icelandic for a rejection, safe to show a customer. */
export const REASON_TEXT: Record<Rejection, string> = {
  UNKNOWN_RESOURCE: 'Þessi valkostur fannst ekki.',
  RESOURCE_INACTIVE: 'Þessi valkostur er ekki í boði núna.',
  CLOSED_DAY: 'Lokað þennan dag.',
  OUT_OF_SEASON: 'Þetta er utan opnunartímabilsins.',
  OUTSIDE_HOURS: 'Þessi tími er ekki í boði.',
  TOO_SOON: 'Það þarf að bóka með lengri fyrirvara.',
  TOO_FAR_AHEAD: 'Ekki er hægt að bóka svona langt fram í tímann.',
  MIN_NIGHTS: 'Lágmarksdvöl næst ekki.',
  MAX_NIGHTS: 'Dvölin er lengri en hámarkið.',
  OVER_CAPACITY: 'Það er ekki pláss fyrir svona marga.',
  ALREADY_BOOKED: 'Þetta er þegar bókað.',
  EXTRA_UNAVAILABLE: 'Aukahluturinn er ekki laus.',
  INVALID_RANGE: 'Veldu bæði komu og brottför.',
}
