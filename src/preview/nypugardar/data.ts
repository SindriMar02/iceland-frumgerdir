/**
 * Nýpugarðar — "Kvöldverðurinn á Mýrum"
 * One real evening at a working sheep farm on Mýrar in Hornafjörður:
 * arrive among the animals, watch the glacier catch the last light, then sit
 * down with everyone else to the lamb dinner buffet. The page itself darkens
 * from daylight to night as you scroll (the "evening arc" signature).
 *
 * Every fact below is sourced from the 2026-07-18 brief/dossier:
 * Booking.com property page (live), HeyIceland listing, ferdalag.is, Keldan.
 * No founding year, no dinner price, no nightly rate — intentionally omitted
 * (unverifiable / dynamic). Guest quotes are real and attributed.
 */

import { photo } from './photos'

/**
 * The frames the page features by name. Everything else reaches the reader
 * through the gallery, which walks the whole library in photos.ts — so no
 * photograph she owns is left sitting unused in the repo.
 *
 * All 43 come from her own Booking.com listing. Four images the first harvest
 * picked up turned out to belong to a neighbouring property and are gone,
 * including the aerial that used to be the hero; see the provenance note at the
 * top of tools/nypugardar-photos.mjs.
 */
export const IMG = {
  /** Low sun raking across Mýrar, the outlet glaciers along the whole horizon.
   *  Her largest file by some distance (5312×2988 as uploaded) and the one
   *  frame that is the page's own premise: the glacier catching the last
   *  light. */
  hero: photo('125645004'),
  /** The same plain in the other direction, Vestrahorn under snow. */
  glacier: photo('125645011'),
  /** Snow ridge above the fields. */
  ridge: photo('125644995'),
  /** The sun going down at the end of the scroll. */
  dusk: photo('125645022'),
  /** Wild reindeer come down onto the land in winter. */
  reindeer: photo('10523758'),
  /** The guesthouse deck and the cottages under snow, glacier plain behind. */
  house: photo('258957593'),
  /** The terrace, two benches, evening. */
  deck: photo('510526816'),
  /** The dining room, windows the whole length of it. */
  dining: photo('305950064'),
  /** The breakfast buffet laid out. */
  breakfast: photo('259128011'),
  /** The family cottage from outside. */
  cottage1: photo('510524232'),
  /** The cottage for three. */
  cottage2: photo('510524306'),
} as const

export const BOOKING_URL = 'https://www.booking.com/hotel/is/gistiheimilid-nypugordum.html'
/** Her Booking.com property page. Used only for review attribution — never as a
 *  booking call to action, since bookings now go direct through Godo. */
export const REVIEWS_URL = 'https://www.booking.com/hotel/is/gistiheimilid-nypugordum.html'

export const PHONE = '893 1826'
export const PHONE_HREF = 'tel:+3548931826'
export const EMAIL = 'nypu@simnet.is'
export const ADDRESS = 'Nýpugarðar, 781 Höfn í Hornafirði'

export const NAV = [
  { id: 'farm', label: 'The farm' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'gallery', label: 'Photos' },
  { id: 'reviews', label: 'Guests' },
  { id: 'info', label: 'Find us' },
] as const

/** ferdalag.is unit breakdown, 2026-07-18 */
export const UNITS = [
  { n: '9', key: 'privateBath', label: 'rooms with private bathroom' },
  { n: '2', key: 'sharedBath', label: 'rooms with shared bathroom' },
  { n: '2', key: 'cottages', label: 'cottages for 2 to 4 guests' },
  { n: '24', key: 'guestsFull', label: 'guests when the house is full' },
] as const

/** Booking.com house rules, re-verified live 2026-08-21. The earlier
 *  "no extra beds" line is gone: Godo lists a bookable room type literally
 *  named "Double Private with extra bed" (145058), so Booking.com's blanket
 *  statement is wrong for direct bookings and the site should not repeat it.
 *  Split into times and policies so the two facts guests actually look up
 *  (when can I arrive, when must I leave) can be given real weight instead of
 *  being buried in a flat list of seven identical lines. */
export const CHECK_TIMES = [
  { key: 'arrive', label: 'Arrive', value: '16:00', tail: 'until 23:30' },
  { key: 'leave', label: 'Leave', value: '11:00', tail: 'from 07:30' },
] as const

export const HOUSE_RULES = [
  { key: 'openAllYear', rule: 'Open all year', noteKey: null, note: null },
  { key: 'childrenWelcome', rule: 'Children welcome', noteKey: 'childrenNote', note: 'guests 7 and older pay as adults' },
  { key: 'noPets', rule: 'No pets', noteKey: null, note: null },
  { key: 'noSmoking', rule: 'No smoking', noteKey: null, note: null },
] as const

/** Booking.com facilities list, re-verified live 2026-08-21. */
export const FACILITIES = [
  'Restaurant', 'Bar', 'Free WiFi', 'Free private parking',
  'Garden', 'Terrace', 'Hiking', 'Family rooms', 'Non-smoking rooms',
] as const

/** Booking.com breakfast detail, verified 2026-08-21. Grouped rather than kept
 *  as one flat list, because these are three different kinds of fact: how it is
 *  served, which diets the kitchen covers, and the packed option for guests
 *  leaving before the room opens. That last one is a booking reason on a farm
 *  47 km from Jökulsárlón, so it gets its own line instead of a chip. */
export const BREAKFAST = {
  served: ['Buffet', 'Continental'],
  diets: ['Vegetarian', 'Vegan', 'Gluten-free'],
  toGo: 'Breakfast to go',
} as const

/** Booking.com location facts, verified live 2026-08-21 */
export const DISTANCES = [
  { n: '4 km', key: 'offRoute1', label: 'off Route 1, the Ring Road' },
  { n: '25 min', key: 'driveToHofn', label: 'drive to Höfn' },
  { n: '47 km', key: 'toGlacierLagoon', label: 'to Jökulsárlón glacier lagoon' },
] as const

/** Booking.com live score, fetched 2026-07-18 */
export const SCORE = {
  value: '8.8',
  word: 'Fabulous',
  /** Re-verified live on Booking.com 2026-08-21: 8.8 "Fabulous", 2,265 reviews
   *  (was 2,233 on 2026-07-18). The count drifts every week, so the page says
   *  "over 2,200" rather than a figure that goes stale between deploys. */
  count: 'over 2,200',
  categories: [
    { label: 'Host', n: '9.3' },
    { label: 'Free WiFi', n: '9.2' },
    { label: 'Cleanliness', n: '9.1' },
    { label: 'Comfort', n: '9.1' },
    { label: 'Location', n: '9.1' },
    { label: 'Value for money', n: '8.9' },
  ],
} as const

/** Real, attributed quotes from Booking.com's review widget. First three
 *  captured 2026-07-18, last three added from the live page 2026-08-21 — all
 *  six verbatim, all still on the listing. Six so the section can rotate two
 *  sets of three rather than showing the same trio forever. */
export const DINNER_QUOTE = {
  text: 'I could not hype this place enough. It was wonderful!! In the middle of grassy planes with sheep grazing. Amazing views of the mountains that you could see even when in bed! Local Cuisine with farm to table ingredients! Happy staff!!',
  name: 'Stefanos',
  place: 'Germany',
} as const

export const QUOTES = [
  {
    text: 'Staff were friendly and hospitable. Views stunning. Dinner & breakfast outstanding and great value for money. Very comfortable, warm and quiet.',
    name: 'Felicity',
    place: 'United Kingdom',
    note: null,
  },
  {
    text: 'Million dollar view, good breakfast, comfortable and cozy! A memorable stay😁😁',
    name: 'Millist',
    place: 'Australia',
    note: null,
  },
  {
    text: 'Best accommodation of our Icelandic holiday. Immersed in nature, beautiful dining room overlooking the countryside with glaciers visible in good weather, excellent and rich breakfast with local products.',
    name: 'Paolo',
    place: 'Italy',
    note: 'Translated from Italian',
  },
  {
    text: 'Beautiful views, good breakfast, friendly staff. Nothing to complain :)',
    name: 'Samppa',
    place: 'Finland',
    note: null,
  },
  {
    text: 'Nice place. Middle of nature with great view on the glacier! And on the sheeps ;)',
    name: 'Jeremy',
    place: 'France',
    note: null,
  },
  {
    text: 'Very clean. Good food for dinner as well. Quiet location.',
    name: 'Olivia',
    place: 'Switzerland',
    note: null,
  },
] as const

export const FOOTNOTE =
  'Guest ratings and quotes are from Booking.com, verified 21 August 2026. Photographs are our own. Room rates and availability come live from our booking system. The dinner is arranged with us when you arrive.'