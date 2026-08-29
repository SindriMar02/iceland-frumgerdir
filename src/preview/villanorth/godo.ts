/**
 * Villa North → GODO Property booking handoff. WIRED, AWAITING HER PROPID.
 *
 * Confirmed on the 2026-08-29 call: Villa North is being put into GODO
 * (property.godo.is, a white-labelled Beds24) with Vrbo and Booking.com
 * beside Airbnb, and the site's Book Now goes direct to GODO.
 *
 * The param set below is the one verified live against property.godo.is for
 * Nýpugarðar on 2026-08-21/25 (dates echo back, per-room focus works, ISK
 * renders): propid, checkin, checkout, numadult, numchild, lang, referer.
 * Same host, same engine, so the wiring is identical — only the propid is
 * missing, and it can only come from their GODO control panel.
 *
 * While it is empty the page keeps the request-a-stay demo. The moment the id
 * is pasted in, every date the guest picks in the calendar flows straight into
 * GODO's booking page. Payment never touches this site.
 */

export const GODO_PROPID = '' // ← from their GODO control panel, one line to go live

const GODO_BOOKING_BASE = 'https://property.godo.is/booking2.php'

/** Beds24 wants `2026-9-12` (unpadded), local time. Input is 'YYYY-MM-DD'. */
function godoDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${y}-${m}-${d}`
}

/** True once the property id is in place. Gates the live-booking UI. */
export function bookingReady(): boolean {
  return GODO_PROPID.trim().length > 0
}

export function godoBookingUrl(q: {
  checkin?: string | null
  checkout?: string | null
  adults?: number
  lang?: 'en' | 'is'
}): string {
  const p = new URLSearchParams()
  p.set('propid', GODO_PROPID)
  if (q.checkin) p.set('checkin', godoDate(q.checkin))
  if (q.checkout) p.set('checkout', godoDate(q.checkout))
  p.set('numadult', String(Math.max(1, q.adults ?? 2)))
  p.set('numchild', '0')
  p.set('lang', q.lang ?? 'en')
  /** Proves in GODO's reports how many bookings this site sent. */
  p.set('referer', 'villanorth-web')
  return `${GODO_BOOKING_BASE}?${p.toString()}`
}
