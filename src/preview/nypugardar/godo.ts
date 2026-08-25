/**
 * Nýpugarðar → Godo Property booking handoff.
 *
 * Godo Property is a white-labelled Beds24 deployment (control panel is
 * property.godo.is/control2.php, booking pages are booking2.php). Everything in
 * this file was tested live against property.godo.is on 2026-08-21: the dates
 * echo back into the booking page, prices render in ISK, and each room exposes
 * its offers as `br1-<roomid>` controls.
 *
 * NO API CALL EVER HAPPENS IN THE BROWSER, and that has not changed. Godo
 * issued API credentials on 2026-08-24 and the site now uses them, but only at
 * BUILD time: tools/nypugardar-prices.mjs reads her lowest bookable rate per
 * room and bakes the result into prices.json, which the page imports as inert
 * data. The keys are read-write against her live inventory, so they live in
 * .env.local and in GitHub repo secrets and are never shipped to a client.
 *
 * The handoff below is untouched by that. Availability, the exact rate for a
 * guest's dates, and the booking itself all still happen on Godo's page, which
 * remains the only authoritative source and cannot drift.
 *
 * Payment never touches this site: the guest completes the booking on Godo's
 * page, so no card data reaches us and we stay out of PCI scope.
 */

/**
 * Her numeric property id. Supplied by Godo (Ármann) 2026-08-22 and verified
 * against the live booking page, which renders "Nýpugarðar" and all seven of
 * her room types.
 *
 * Safe to keep in the repo: propid appears in every public booking URL. The
 * propKey is NOT here and must never be — see the note at the foot of this file.
 */
export const GODO_PROPID = '62130'

/** Base booking page. Same host serves the control panel and the API. */
const GODO_BOOKING_BASE = 'https://property.godo.is/booking2.php'

/**
 * Room ids, also from the control panel. Keys match the unit types confirmed on
 * ferdalag.is (9 en-suite rooms, 2 with shared bathroom, 2 cottages, 24 guests).
 * Passing `roomid` focuses the booking page on one room type; leaving it unset
 * shows everything, which is the correct default for the main call to action.
 */
export const GODO_ROOM_IDS = {
  twinSharedEconomy: '477163',
  doubleTwinShared: '145056',
  doubleTwinPrivate: '145057',
  doublePrivateExtraBed: '145058',
  double: '259673',
  cottage3: '145059',
  familyCottage: '182212',
} as const

export type GodoRoomKey = keyof typeof GODO_ROOM_IDS

/**
 * The same seven types as Booking.com knows them, read off her live listing on
 * 2026-08-25. Kept here because it is what lets the site place her photographs
 * on the right room: Booking stores an `associated_rooms` list per photo, and
 * these ids are the join. The pairing was checked on bed counts, not on names
 * alone — Booking's "Family Room" is four single beds for four guests, which is
 * Godo's Family Cottage, and Booking's "Standard Bungalow" is two singles plus
 * a sofa bed, which is Godo's Cottage for three.
 */
export const BOOKING_ROOM_IDS: Record<GodoRoomKey, string> = {
  twinSharedEconomy: '41994909',
  doubleTwinShared: '41994901',
  doubleTwinPrivate: '41994903',
  doublePrivateExtraBed: '41994904',
  double: '41994907',
  cottage3: '41994908',
  familyCottage: '41994905',
}

/** How many guests each type sleeps, from Booking's bed configuration on
 *  2026-08-25. The two cottage figures agree with the names Godo gives them,
 *  which is the cross-check that makes the mapping above safe to rely on. */
export const ROOM_SLEEPS: Record<GodoRoomKey, number> = {
  twinSharedEconomy: 2,
  doubleTwinShared: 2,
  doubleTwinPrivate: 2,
  doublePrivateExtraBed: 3,
  double: 2,
  cottage3: 3,
  familyCottage: 4,
}

/** Godo's own names for each type, so the site never invents a room name that
 *  does not match what the guest sees on the booking page. */
export const GODO_ROOM_NAMES: Record<GodoRoomKey, string> = {
  twinSharedEconomy: 'Twin room with shared bathroom, economy',
  doubleTwinShared: 'Double/Twin room with shared bathroom',
  doubleTwinPrivate: 'Double/twin room with private bath',
  doublePrivateExtraBed: 'Double private with extra bed',
  double: 'Double',
  cottage3: 'Cottage, 3 persons',
  familyCottage: 'Family Cottage',
}

/** Icelandic room names. Godo only stores the English ones, so these are ours,
 *  kept beside them deliberately: a guest reading the site in Icelandic still
 *  lands on a Godo page labelled in English, and the names must be recognisable
 *  across that jump rather than inventive. */
export const GODO_ROOM_NAMES_IS: Record<GodoRoomKey, string> = {
  twinSharedEconomy: 'Tveggja manna herbergi með sameiginlegu baði, hagkvæmt',
  doubleTwinShared: 'Tveggja manna herbergi með sameiginlegu baði',
  doubleTwinPrivate: 'Tveggja manna herbergi með eigin baði',
  doublePrivateExtraBed: 'Tveggja manna herbergi með eigin baði og aukarúmi',
  double: 'Tveggja manna herbergi',
  cottage3: 'Sumarhús fyrir 3',
  familyCottage: 'Fjölskyldusumarhús',
}

/** The three groups the page presents, mapped onto Godo's seven types. */
export const ROOM_GROUPS = {
  shared: ['twinSharedEconomy', 'doubleTwinShared'],
  private: ['doubleTwinPrivate', 'doublePrivateExtraBed', 'double'],
  cottage: ['cottage3', 'familyCottage'],
} as const satisfies Record<string, readonly GodoRoomKey[]>

export type BookingQuery = {
  /** Arrival date. Beds24 wants Y-M-D and tolerates unpadded month/day. */
  checkin?: Date | null
  /** Nights. Sent as `numnight`; alternatively pass `checkout`. */
  nights?: number
  checkout?: Date | null
  adults?: number
  /** Children under 7. Guests 7 and older are charged as adults here. */
  children?: number
  room?: GodoRoomKey | null
  lang?: 'en' | 'is'
  /** Where Godo returns the guest after booking. Also settable in the control
   *  panel as Booking Return URL. See [[booking-systems-integration]]. */
  redirect?: string
}

/** Beds24 expects `2026-9-12`, not `2026-09-12`. Local time, not UTC. */
function godoDate(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

/** True once her property id is in place. Gates the booking UI. */
export function bookingReady(): boolean {
  return GODO_PROPID.trim().length > 0
}

/**
 * Build the handoff URL. Only parameters verified as accepted by the live
 * booking page are ever sent: propid, checkin, checkout, numnight, numadult,
 * numchild, roomid, lang, referer.
 */
export function godoBookingUrl(q: BookingQuery = {}): string {
  const p = new URLSearchParams()
  p.set('propid', GODO_PROPID)

  if (q.checkin) p.set('checkin', godoDate(q.checkin))
  if (q.checkout) p.set('checkout', godoDate(q.checkout))
  else if (q.nights && q.nights > 0) p.set('numnight', String(q.nights))

  p.set('numadult', String(Math.max(1, q.adults ?? 2)))
  p.set('numchild', String(Math.max(0, q.children ?? 0)))

  const roomId = q.room ? GODO_ROOM_IDS[q.room] : ''
  if (roomId) p.set('roomid', roomId)

  if (q.redirect) p.set('redirect', q.redirect)
  p.set('lang', q.lang ?? 'en')
  /** Lets us prove in Godo's reports how many bookings this site sent. */
  p.set('referer', 'nypugardar-web')

  return `${GODO_BOOKING_BASE}?${p.toString()}`
}

/**
 * The href for a booking call to action, or `null` while the property id is
 * still missing.
 *
 * Deliberately no phone or email fallback: bookings go through Godo, full stop.
 * A call to action that quietly turns into a phone dialer teaches guests the
 * wrong path and splits the booking flow across two systems. Until Godo is
 * connected, the controls render as an inert placeholder instead — see
 * PLACEHOLDER_NOTE.
 */
export function bookingHref(q: BookingQuery = {}): string | null {
  return bookingReady() ? godoBookingUrl(q) : null
}

/** Shown wherever a booking control sits while Godo is not yet connected. */
export const PLACEHOLDER_NOTE = 'Godo booking connects here'

/**
 * VERIFIED LIVE 2026-08-25 against property.godo.is: passing `roomid` renders
 * that ONE room type and nothing else. With a date that has inventory
 * (roomid=145056, 17–18 Oct) the page came back "Double/Twin room with shared
 * bathroom · Quantity 1 · from 98.10€"; with the same roomid on a sold-out date
 * it came back with the same single room and "Not available". So a per-room
 * call to action is a real handoff, not a filter the guest has to redo.
 *
 * One thing to know about that headline figure: Godo advertises the
 * non-refundable rate (p2, 90% of p1) while this site quotes the standard rate
 * (p1). A guest therefore sees a LOWER number on Godo than on the site, which
 * is the safe direction to be wrong in — nobody arrives at checkout to find the
 * price went up.
 */

/** Nights between two dates, floored at 1. */
export function nightsBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime()
  return Math.max(1, Math.round(ms / 86_400_000))
}

/** `YYYY-MM-DD` for <input type="date">, which does want zero padding. */
export function inputDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Parse an <input type="date"> value as a local date, not UTC midnight. */
export function parseInputDate(v: string): Date | null {
  if (!v) return null
  const [y, m, d] = v.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}


/**
 * NOT IN THIS FILE, ON PURPOSE: the property key.
 *
 * Godo supplied a propKey on 2026-08-22. It is a live credential against her
 * real inventory, so it belongs in an environment variable read server-side,
 * never in a committed source file and never in anything shipped to a browser.
 * The account-level apiKey arrived on 2026-08-24 and is subject to exactly the
 * same rule: env var only, never committed, never shipped to a browser.
 *
 * When and if the API route is built: GODO_PROP_KEY and GODO_API_KEY in
 * .env.local (already gitignored), read only inside the server-side proxy.
 */

/** Midnight local. Dates are compared and formatted in local time throughout;
 *  a UTC midnight would land on the previous day west of Greenwich. */
export function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
