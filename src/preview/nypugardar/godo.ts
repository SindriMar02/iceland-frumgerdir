/**
 * Nýpugarðar → Godo Property booking handoff.
 *
 * Godo Property is a white-labelled Beds24 deployment (control panel is
 * property.godo.is/control2.php, booking pages are booking2.php). Everything in
 * this file was tested live against property.godo.is on 2026-08-21: the dates
 * echo back into the booking page, prices render in ISK, and each room exposes
 * its offers as `br1-<roomid>` controls.
 *
 * DELIBERATELY NO API USE. Godo exposes the Beds24 JSON API (v1 at /api/json/*,
 * v2 at /api/v2/*), but whether Nýpugarðar's plan is entitled to use it is not
 * confirmed yet. Everything here depends only on the public booking page, which
 * is verified to work. If API access is later granted, live per-room prices can
 * be layered on top without changing this handoff.
 *
 * Payment never touches this site: the guest completes the booking on Godo's
 * page, so no card data reaches us and we stay out of PCI scope.
 */

/**
 * Her numeric property id, from Settings → Properties in the Godo control panel.
 * Requested from Godo 2026-08-21.
 *
 * THIS IS THE ONLY THING THAT HAS TO CHANGE TO GO LIVE. While it is empty,
 * `bookingReady()` is false and every booking control renders as an inert
 * placeholder holding Godo's spot. Fill it in (plus GODO_ROOM_IDS) and the
 * whole booking flow switches on.
 */
export const GODO_PROPID = ''

/** Base booking page. Same host serves the control panel and the API. */
const GODO_BOOKING_BASE = 'https://property.godo.is/booking2.php'

/**
 * Room ids, also from the control panel. Keys match the unit types confirmed on
 * ferdalag.is (9 en-suite rooms, 2 with shared bathroom, 2 cottages, 24 guests).
 * Passing `roomid` focuses the booking page on one room type; leaving it unset
 * shows everything, which is the correct default for the main call to action.
 */
export const GODO_ROOM_IDS = {
  ensuite: '',
  shared: '',
  cottage: '',
} as const

export type GodoRoomKey = keyof typeof GODO_ROOM_IDS

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
