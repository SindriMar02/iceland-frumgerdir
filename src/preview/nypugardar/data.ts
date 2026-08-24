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

const BASE = import.meta.env.BASE_URL

/** Local, vetted photos (copied from the prep manifest into public/nypugardar/). */
export const p = (file: string) => `${BASE}nypugardar/full/${file}`

export const IMG = {
  /** All frames below are Nýpugarðar's own photographs, pulled at full resolution
   *  from their Booking.com gallery on 2026-08-21 (47 in total, see public/
   *  nypugardar/full/). Booking.com serves the originals, so these are the
   *  largest versions that exist. No stock imagery is used anywhere on this page. */
  hero: p('bk_908946914.jpg'),        // aerial: the farm, its land and the glacier beyond
  exterior: p('bk_258957593.jpg'),    // guesthouse and deck in winter, glacier behind
  building: p('bk_92332508.jpg'),     // the main guesthouse building
  farmland: p('bk_614398038.jpg'),    // the farm against the coastline
  glacier: p('bk_10523812.jpg'),      // glacier tongue over green farmland
  ridge: p('bk_125644995.jpg'),       // snow-capped ridge
  dusk: p('bk_125645022.jpg'),        // sun going down over the grassland
  deck: p('bk_510526816.jpg'),        // the terrace at dusk
  dining: p('bk_305950064.jpg'),      // the dining room, glacier-view windows
  breakfast: p('bk_259128011.jpg'),   // the breakfast buffet laid out
  reindeer: p('bk_10523758.jpg'),     // wild reindeer on the land
  cottage1: p('bk_510524232.jpg'),    // cottage exterior, red roof
  cottage2: p('bk_510524306.jpg'),    // second cottage exterior
  cottageIn1: p('bk_510524196.jpg'),  // pine-lined cottage interior
  cottageIn2: p('bk_510526820.jpg'),  // cottage interior with table and beds
  room1: p('bk_510523433.jpg'),       // twin room, red-framed window
  room2: p('bk_510524066.jpg'),       // room looking over farmland
  room3: p('bk_539099044.jpg'),       // twin room, wide window
  room4: p('bk_510521394.jpg'),       // twin room with dark curtains
  bath: p('bk_510524063.jpg'),        // bathroom
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
  { id: 'reviews', label: 'Guests' },
  { id: 'info', label: 'Find us' },
] as const

/** ferdalag.is unit breakdown, 2026-07-18 */
export const UNITS = [
  { n: '9', label: 'rooms with private bathroom' },
  { n: '2', label: 'rooms with shared bathroom' },
  { n: '2', label: 'cottages for 2 to 4 guests' },
  { n: '24', label: 'guests when the house is full' },
] as const

/** Booking.com house rules, re-verified live 2026-08-21. The earlier
 *  "no extra beds" line is gone: Godo lists a bookable room type literally
 *  named "Double Private with extra bed" (145058), so Booking.com's blanket
 *  statement is wrong for direct bookings and the site should not repeat it.
 *  Split into times and policies so the two facts guests actually look up
 *  (when can I arrive, when must I leave) can be given real weight instead of
 *  being buried in a flat list of seven identical lines. */
export const CHECK_TIMES = [
  { label: 'Arrive', value: '16:00', tail: 'until 23:30' },
  { label: 'Leave', value: '11:00', tail: 'from 07:30' },
] as const

export const HOUSE_RULES = [
  { rule: 'Open all year', note: null },
  { rule: 'Children welcome', note: 'guests 7 and older pay as adults' },
  { rule: 'No pets', note: null },
  { rule: 'No smoking', note: null },
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
  { n: '4 km', label: 'off Route 1, the Ring Road' },
  { n: '25 min', label: 'drive to Höfn' },
  { n: '47 km', label: 'to Jökulsárlón glacier lagoon' },
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

/** Room photo mosaic — captions describe only what each photo shows. */
export const ROOM_PHOTOS = [
  { src: IMG.room1, alt: 'Twin room at Nýpugarðar with a red-framed window looking over the fields', caption: 'Twin room' },
  { src: IMG.room2, alt: 'Room at Nýpugarðar with a window framing open farmland to the horizon', caption: 'Room with a farmland view' },
  { src: IMG.cottageIn1, alt: 'Pine-lined interior of one of the cottages at Nýpugarðar', caption: 'Inside a cottage' },
  { src: IMG.bath, alt: 'White-tiled private bathroom with a shower at Nýpugarðar', caption: 'Private bathroom' },
] as const

export const FOOTNOTE =
  'Guest ratings and quotes are from Booking.com, verified 21 August 2026. Photographs are our own. Room rates and availability come live from our booking system. The dinner is arranged with us when you arrive.'