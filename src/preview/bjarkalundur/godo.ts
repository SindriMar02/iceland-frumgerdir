/**
 * Bjarkalundur → Godo Property booking handoff.
 *
 * Godo Property is a white-labelled Beds24 deployment; the same module runs on
 * Nýpugarðar (glacierview.is), where every parameter below was verified. Re-
 * verified for THIS property on 2026-09-26 with curl against property.godo.is:
 *   booking2.php?propid=51121&checkin=2027-6-10&checkout=2027-6-13&numadult=3
 *   &numchild=1&roomid=118379 → one room (Cottage with private bathroom), the
 *   arrival echoed as firstnight=2027-06-10, numnight=3, numadult=3, numchild=1
 *   in every link on the page. `numnight` alone works the same way.
 *
 * NO API CALL EVER HAPPENS IN THE BROWSER. The hotel asked Godo (2026-09-25) to
 * send the integration keys to Sindri; when they arrive they belong in
 * .env.local / repo secrets and are read at BUILD time only (a prices and
 * availability snapshot, like tools/nypugardar-prices.mjs). Until then the
 * calendar strikes nothing and Godo's page, the only authority on availability
 * and price, does the checking.
 *
 * Payment never touches this site: the guest books on Godo's page.
 */
import type { Lang } from './paths'

/** Public: propid is in every booking URL the hotel has ever published. */
export const GODO_PROPID = '51121'
const GODO_BOOKING_BASE = 'https://property.godo.is/booking2.php'

/**
 * Godo's room ids, read off the live booking page 2026-09-26 by the name that
 * precedes each `roomcalendar<id>` block, and confirmed one by one with
 * `roomid=` (the page then shows that single room). Keys are our room ids.
 */
export const GODO_ROOM_IDS: Record<string, string> = {
  thaegindi: '118374', // Comfort room with Private Bathroom, 20 m²
  vaskur: '118375', // Standard room with private sink, shared toilet and showers, 14 m²
  einn: '617289', // Budget Single Room with Shared Bathroom, 7 m²
  'hus-eldhus': '118377', // Cottage with kitchenette and private bathroom, 22 m²
  'hus-bad': '118379', // Cottage with private bathroom, 22 m²
  'hus-stort': '617286', // Large Cottage with Private Toilet and Kitchenette, 24 m²
  'hus-litid': '616941', // Charming Cottage with shared toilet & showers in hotel, 15 m²
  'hus-tveggja': '616940', // Cosy Cottage Twin Room with shared toilet & showers in hotel, 11 m²
}

export type BookingQuery = {
  checkin?: Date | null
  checkout?: Date | null
  adults?: number
  children?: number
  room?: string | null
  lang?: Lang
}

/** Beds24 wants `2027-6-10`, local time, not UTC. */
function godoDate(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

/** Only parameters verified on the live page are sent. */
export function godoBookingUrl(q: BookingQuery = {}): string {
  const p = new URLSearchParams()
  p.set('propid', GODO_PROPID)
  if (q.checkin) p.set('checkin', godoDate(q.checkin))
  if (q.checkin && q.checkout) p.set('checkout', godoDate(q.checkout))
  p.set('numadult', String(Math.max(1, q.adults ?? 2)))
  p.set('numchild', String(Math.max(0, q.children ?? 0)))
  const roomId = q.room ? GODO_ROOM_IDS[q.room] : ''
  if (roomId) p.set('roomid', roomId)
  /* Godo's own room texts are English whatever this says; the page chrome follows it. */
  p.set('lang', q.lang ?? 'is')
  /* Lets Godo's reports show how many bookings this site sent. */
  p.set('referer', 'bjarkalundur-web')
  return `${GODO_BOOKING_BASE}?${p.toString()}`
}

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

export function nightsBetween(a: Date, b: Date): number {
  return Math.max(1, Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000))
}
