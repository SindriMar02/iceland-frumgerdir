/**
 * BÓKUNARKJARNI — the core booking model.
 *
 * ONE engine, configured per business. The bet is that a guesthouse, a body
 * shop, a tour operator and a clinic are the SAME domain with different
 * granularity, and that everything else is configuration rather than code.
 *
 *   guesthouse  resource = cottage      unit = NIGHT  capacity = guests
 *   body shop   resource = bay          unit = DAY    capacity = 1 vehicle
 *   tour        resource = departure    unit = SLOT   capacity = seats
 *   clinic      resource = practitioner unit = SLOT   capacity = 1
 *
 * That single `unit` axis is what lets one engine serve all four. Everything
 * downstream (availability, conflicts, pricing) is written against it.
 *
 * Design rules, learned the hard way and worth keeping:
 *  · Money is ALWAYS integer krónur. No floats anywhere near a price.
 *  · Dates are 'YYYY-MM-DD' strings in the business's own local day. A booking
 *    for the 3rd must never become the 2nd because of a timezone.
 *  · The engine is PURE. No storage, no network, no framework. It is given
 *    state and returns decisions, which is what makes it testable and portable.
 */

/** The granularity a business sells time in. The one axis that spans verticals. */
export type Unit = 'NIGHT' | 'DAY' | 'SLOT'

/** 'YYYY-MM-DD' in the business's local day. Never a Date object. */
export type DateStr = string

/** Minutes from local midnight. 540 = 09:00. */
export type Minutes = number

/** Integer krónur. Never a float. */
export type ISK = number

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

/* ── what is being booked ─────────────────────────────────────────────── */

export interface Resource {
  id: string
  /** Shown to the customer: "Árbakki", "Réttingabás 1", "Kjartan Örn". */
  name: string
  /** How many of the countable thing fit at once: guests, seats, vehicles. */
  capacity: number
  /**
   * Extra units that may be booked alongside, priced separately. A loaner car,
   * a cot, wetsuit hire. Kept on the resource because availability is per
   * resource, not global.
   */
  extras?: Extra[]
  active?: boolean
  /**
   * Explicit start times for THIS resource, replacing the generated grid.
   * Needed the moment a business publishes real departure times: Pólar Hestar's
   * Höfðahringur leaves at 09:30 and 14:00, which no uniform hourly grid
   * produces. If omitted, the grid from `availability.slotMinutes` is used.
   */
  times?: Minutes[]
  /**
   * How long one booking of this resource actually lasts.
   *
   * The engine has never needed it: it sells a seat on a departure and cares
   * only about the start time and the capacity. It exists for the calendar
   * feed, which cannot write an event without an end.
   *
   * Optional, and left unset rather than guessed. An invented duration puts a
   * false end time in the owner's own calendar, which is worse than a slightly
   * wrong one they were never promised. Unset falls back to the slot grid; see
   * durationOf() in ical.ts.
   */
  durationMin?: Minutes
  /**
   * Per-resource overrides, merged over the business defaults. This is what
   * makes one config serve a real business: a guesthouse where the cottage is
   * 24.000 and the double room is 18.000, or a workshop where the paint bay is
   * closed on Fridays.
   */
  availability?: Partial<Availability>
  pricing?: Partial<Pricing>
}

export interface Extra {
  id: string
  name: string
  price: ISK
  /** Charged once, or for every unit (night/day/slot) of the booking. */
  per: 'BOOKING' | 'UNIT'
  /** How many exist. Omit for unlimited. */
  stock?: number
}

/* ── when it is available ─────────────────────────────────────────────── */

export interface OpeningRule {
  weekday: Weekday
  /** Omit both for a closed day. */
  from?: Minutes
  to?: Minutes
}

export interface Availability {
  opening: OpeningRule[]
  /** Dates the business is shut regardless of the weekly pattern. */
  closed?: DateStr[]
  /** Seasonal window, inclusive. Outside it nothing is bookable. */
  season?: { from: DateStr; to: DateStr }
  /** Earliest a booking may be made, in hours from now. */
  leadTimeHours?: number
  /** Furthest ahead a booking may be made, in days. */
  horizonDays?: number
  /** SLOT only: length of one slot, and the gap left after it. */
  slotMinutes?: Minutes
  bufferMinutes?: Minutes
  /** NIGHT only: stay length bounds. */
  minNights?: number
  maxNights?: number
}

/* ── prices ───────────────────────────────────────────────────────────── */

export interface Pricing {
  /** Charged once per booking regardless of length. */
  base?: ISK
  /** Charged for every night, day or slot. */
  perUnit?: ISK
  /** Charged for every person over `includedPeople`. */
  perPerson?: ISK
  /**
   * Charged for every person the request counts as a child, INSTEAD of
   * `perPerson`. Omit and children pay the adult rate, which is the safe
   * direction: a missing discount is a conversation, a missing charge is a
   * loss the business only finds in the accounts.
   *
   * `includedPeople` is deducted from ADULTS only. Combining the two is
   * arbitrary whichever way it is defined, so it is defined here, tested, and
   * not left to be discovered.
   */
  perChild?: ISK
  includedPeople?: number
  /**
   * Multipliers on the whole booking. Used for the surcharges Icelandic
   * businesses actually run: evening call-out, weekend rates, high season.
   */
  modifiers?: PriceModifier[]
  /** Deposit taken to confirm. Omit for pay-on-arrival. */
  depositPct?: number
}

export interface PriceModifier {
  id: string
  label: string
  /** A flat addition, or a multiplier on the running subtotal. */
  kind: 'ADD' | 'MULTIPLY'
  value: number
  when: {
    weekdays?: Weekday[]
    /** Applies when the booking starts at or after this time. */
    fromMinute?: Minutes
    dateFrom?: DateStr
    dateTo?: DateStr
  }
}

/* ── the business ─────────────────────────────────────────────────────── */

export interface BusinessConfig {
  slug: string
  name: string
  unit: Unit
  /** IANA zone, e.g. 'Atlantic/Reykjavik'. Used only for "now". */
  timezone: string
  currency: 'ISK'
  resources: Resource[]
  availability: Availability
  pricing: Pricing
  /**
   * REQUEST  owner confirms by hand, no card. The honest default and the only
   *          mode that needs no payment plumbing.
   * INSTANT  confirmed immediately on submit.
   */
  mode: 'REQUEST' | 'INSTANT'
  /** Every customer-facing string, so a vertical can be re-voiced without code. */
  copy: BookingCopy
}

export interface BookingCopy {
  /** "Bóka gistingu" · "Panta tíma" · "Bóka sæti" */
  cta: string
  /** What one unit is called: "nótt" · "dagur" · "tími" */
  unitSingular: string
  unitPlural: string
  /** What the countable capacity is, PLURAL: "gestir" · "sæti" · "bílar" */
  capacityLabel: string
  /**
   * The same noun in the SINGULAR: "gestur" · "sæti" · "bíll" · "knapi".
   *
   * Icelandic does not tolerate "1 gestir", and a quote line is the last thing
   * a customer reads before they commit. Optional so existing configs keep
   * working; it falls back to `capacityLabel`, which is right for neuter nouns
   * like "sæti" and wrong for the rest, so supply it.
   */
  capacitySingular?: string
  /**
   * Only used when `pricing.perChild` is set, so a business with no child rate
   * never sees them. These describe the PERSON rather than the thing being
   * sold, which is why defaulting them does not break the rule that the engine
   * must never invent the customer's own nouns: a riding farm counts knapar and
   * a workshop counts bílar, but both would say fullorðnir and börn.
   */
  adultLabel?: string
  adultSingular?: string
  childLabel?: string
  childSingular?: string
  resourceLabel: string
  confirmation: string
}

/* ── a booking ────────────────────────────────────────────────────────── */

export interface BookingRequest {
  resourceId: string
  /** For NIGHT this is the arrival day; for DAY/SLOT the day of service. */
  date: DateStr
  /** NIGHT only. Departure day, exclusive. */
  endDate?: DateStr
  /** SLOT only. Start time. */
  startMinute?: Minutes
  /**
   * EVERYONE on the booking, children included.
   *
   * Capacity, availability and conflict detection all key off this and nothing
   * else, which is the point: a nine year old still needs a horse, a seat and a
   * helmet. `children` below only ever splits this number for PRICING.
   */
  people: number
  /**
   * How many of `people` are charged the child rate. A SUBSET, never an
   * addition — `people: 4, children: 2` is a family of four, not six. Modelling
   * it as a subset is what keeps every capacity rule in the engine untouched.
   */
  children?: number
  extraIds?: string[]
  customer: Customer
  note?: string
}

export interface Customer {
  name: string
  /** Icelandic mobile or landline, digits only, no +354. */
  phone: string
  email?: string
  /** Icelandic ID. Optional, and never required to make a request. */
  kennitala?: string
}

export type BookingStatus = 'REQUESTED' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED'

/**
 * Where a booking came in. Absent means the web form, which is the only source
 * that existed before owner entry; treating undefined as WEB keeps every record
 * already in storage readable.
 */
export type BookingSource = 'WEB' | 'PHONE' | 'EMAIL' | 'WALK_IN'

export interface Booking extends BookingRequest {
  id: string
  status: BookingStatus
  quote: Quote
  createdAt: string
  /** Owner metadata, never accepted from a guest body. */
  source?: BookingSource
  /**
   * Set when the owner knowingly booked past a full departure. The engine said
   * no and a human overruled it, which is a thing you want on the record rather
   * than a mystery over-capacity departure nobody can explain later.
   */
  overrode?: string
}

/* ── results ──────────────────────────────────────────────────────────── */

export interface QuoteLine {
  label: string
  amount: ISK
}

export interface Quote {
  lines: QuoteLine[]
  total: ISK
  deposit: ISK
  /** Units charged: nights, days or slots. */
  units: number
  /** True when the total is an estimate the owner will confirm. */
  estimate: boolean
}

export type Rejection =
  | 'UNKNOWN_RESOURCE'
  | 'RESOURCE_INACTIVE'
  | 'CLOSED_DAY'
  | 'OUT_OF_SEASON'
  | 'OUTSIDE_HOURS'
  | 'TOO_SOON'
  | 'TOO_FAR_AHEAD'
  | 'MIN_NIGHTS'
  | 'MAX_NIGHTS'
  | 'OVER_CAPACITY'
  | 'ALREADY_BOOKED'
  | 'EXTRA_UNAVAILABLE'
  | 'INVALID_RANGE'

export interface Decision {
  ok: boolean
  reasons: Rejection[]
}
