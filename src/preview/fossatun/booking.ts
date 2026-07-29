/**
 * Fossatún on the shared booking core.
 *
 * Everything here is DATA. No booking logic lives in this file: the same
 * engine that runs a riding tour runs this guesthouse. Adding a business is
 * filling in a form like this one.
 *
 * NO ONLINE PAYMENT, deliberately. Both flows are REQUEST mode: the guest
 * asks, Fossatún confirms, money changes hands on arrival. Card payments are
 * a hassle to set up and to run, so they are not built unless a client
 * specifically asks for them.
 *
 * HONESTY, and it matters on this build:
 *   Fossatún does NOT publish nightly rates. Their own site says the price
 *   "comes up when you click the booking knob". So the nightly numbers below
 *   are SAMPLE VALUES, marked as such, present only so the quote engine has
 *   something to compute. The page states this on screen next to the total.
 *   The Trollgarden admission (600 / 300 kr) IS published by them and is the
 *   one real price in this file.
 *
 * Verified 2026-07-29 against fossatun.is.
 */

import type { BusinessConfig, Resource } from '../../booking/types'
import { TROLL } from './data'

/** Sample only. Fossatún sets the real rates; these exist to drive the demo. */
export const SAMPLE_RATE_NOTE =
  'Verðin hér eru sýnidæmi svo hægt sé að prófa bókunina. Fossatún setur sín eigin verð.'

const ALL_WEEK = ([0, 1, 2, 3, 4, 5, 6] as const).map((d) => ({
  weekday: d,
  from: 15 * 60,
  to: 11 * 60,
}))

const HOTEL_ROOM: Resource = {
  id: 'hotel',
  name: 'Sveitahótelið',
  capacity: 2,
  pricing: { perUnit: 32000, includedPeople: 2 },
  extras: [
    { id: 'kvoldverdur', name: 'Kvöldverður á Rock ’n’ Troll', price: 7900, per: 'BOOKING' },
    { id: 'aukarum', name: 'Aukarúm', price: 6500, per: 'UNIT', stock: 3 },
  ],
}

const POD: Resource = {
  id: 'pods',
  name: 'Camping pod',
  capacity: 2,
  // Pods are a summer product on their own site. Season overrides the business default.
  availability: { season: { from: '2026-05-01', to: '2026-09-30' } },
  pricing: { perUnit: 15500, includedPeople: 2 },
  extras: [{ id: 'linlan', name: 'Rúmföt', price: 2500, per: 'BOOKING', stock: 8 }],
}

const COTTAGE: Resource = {
  id: 'cottage',
  name: 'Sunset Cottage',
  capacity: 4,
  pricing: { perUnit: 46000, perPerson: 4500, includedPeople: 2 },
  extras: [{ id: 'kvoldverdur-c', name: 'Kvöldverður á Rock ’n’ Troll', price: 7900, per: 'BOOKING' }],
}

/**
 * Closed December and January, stated on their front page. Expressed as real
 * closed dates rather than prose so the calendar physically cannot sell them.
 */
function shutMonths(year: number): string[] {
  const out: string[] = []
  for (const [m, len] of [[1, 31], [12, 31]] as const) {
    for (let d = 1; d <= len; d++) {
      out.push(`${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
    }
  }
  return out
}

export const FOSSATUN_STAY: BusinessConfig = {
  slug: 'fossatun',
  name: 'Fossatún',
  unit: 'NIGHT',
  timezone: 'Atlantic/Reykjavik',
  currency: 'ISK',
  mode: 'REQUEST',
  resources: [HOTEL_ROOM, POD, COTTAGE],
  availability: {
    opening: ALL_WEEK,
    closed: [...shutMonths(2026), ...shutMonths(2027)],
    minNights: 1,
    maxNights: 14,
    leadTimeHours: 12,
    horizonDays: 540,
  },
  pricing: {},
  copy: {
    cta: 'Senda bókunarbeiðni',
    unitSingular: 'nótt',
    unitPlural: 'nætur',
    capacityLabel: 'gestir',
    capacitySingular: 'gestur',
    resourceLabel: 'gisting',
    confirmation:
      'Fossatún staðfestir bókunina handvirkt og hefur samband. Ekkert kort er slegið inn hér.',
  },
}

/**
 * The Trollgarden as its own bookable thing. This is the part they cannot
 * sell online today at all, and the only place in this file with real prices.
 */
export const TROLLGARDEN_TICKETS: BusinessConfig = {
  slug: 'fossatun-trollagardur',
  name: 'Tröllagarðurinn',
  unit: 'DAY',
  timezone: 'Atlantic/Reykjavik',
  currency: 'ISK',
  mode: 'REQUEST',
  resources: [
    {
      id: 'trollagardur',
      name: 'Tröllagarðurinn',
      capacity: 60,
      pricing: { perPerson: TROLL.admissionAdult, includedPeople: 0 },
      extras: [
        { id: 'barn', name: 'Barn 5 til 11 ára', price: TROLL.admissionChild, per: 'BOOKING', stock: 20 },
        { id: 'bok', name: 'Tryggðatröll, bókin', price: 3900, per: 'BOOKING' },
      ],
    },
  ],
  availability: {
    // Their published trail hours: daily May to August, weekends April/Sept/Oct.
    opening: ([0, 1, 2, 3, 4, 5, 6] as const).map((d) => ({
      weekday: d,
      from: 10 * 60,
      to: 17 * 60,
    })),
    season: { from: '2026-04-01', to: '2026-10-31' },
    leadTimeHours: 2,
    horizonDays: 400,
  },
  pricing: {},
  copy: {
    cta: 'Panta miða',
    unitSingular: 'dagur',
    unitPlural: 'dagar',
    capacityLabel: 'gestir',
    capacitySingular: 'gestur',
    resourceLabel: 'heimsókn',
    confirmation:
      'Miðarnir bíða ykkar í móttökunni. Greitt á staðnum, ekkert kort er slegið inn hér.',
  },
}

/** Weekend-only months for the trail, used by the UI to grey out weekdays. */
export const TRAIL_WEEKEND_ONLY_MONTHS = [4, 9, 10]
