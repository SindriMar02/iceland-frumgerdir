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
  /** The guesthouse deck and the cottages under snow, glacier plain behind.
   *  Runs beside the winter column in the seasons section. */
  house: photo('258957593'),
  /** The old turf-roofed outbuilding on green grass — the same farm in the
   *  other half of the year, which is what the spring column needed. */
  green: photo('10523864'),
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

/**
 * The ids the page shows as full frames above the gallery. The gallery
 * subtracts these, which is what keeps every photograph to exactly one
 * appearance — see the rule at the top of photos.ts. Derived from IMG rather
 * than written out again, so promoting or demoting a frame is one edit and the
 * two can never drift.
 */
export const FEATURED_IDS: ReadonlySet<string> = new Set(
  Object.values(IMG).map((p) => p.id),
)

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

/**
 * THE SEED. Twenty-four real, attributed guest reviews — twenty-three
 * countries, June 2024 to August 2026, every one scored 9 or 10.
 *
 * These are not the whole set any more. All ~1,400 written reviews ship in
 * reviews.json and the rotator loads them as it approaches the viewport; these
 * twenty-four are what renders on first paint, so the section is never empty
 * and never waits on a network round trip. They lead the rotation because they
 * are the strongest of the pool, and the full file is appended behind them
 * with these twenty-four filtered out.
 *
 * Harvested from her Booking.com listing on 2026-08-25 by
 * tools/nypugardar-reviews.mjs.
 *
 * THE TEXT IS VERBATIM, INCLUDING THE LINE BREAKS. Several of these were
 * written as short stacked lines rather than sentences, and the earlier
 * six-quote set had quietly replaced those breaks with full stops the reviewer
 * never wrote. A guest review is someone else's words; the page renders the
 * `\n` as a line break instead of tidying it. Typos are left alone for the same
 * reason, which is also why reviews carrying a distracting one were simply not
 * chosen rather than corrected.
 *
 * SELECTION, HONESTLY: these are the strongest of 320 harvested, one per
 * country, chosen for substance and spread across what guests actually mention
 * (the view, the lamb dinner, the breakfast, the quiet, the aurora, the price).
 * They are testimonials, so they are her good ones — which is why the real
 * overall score, 8.8, and the full review count sit directly above them with a
 * link to Booking, where the unfiltered set lives. Two things were deliberately
 * excluded: reviews describing a free room upgrade, because a testimonial
 * should not set an expectation she has not promised, and anything with a
 * complaint in it, which belongs on Booking rather than in a pull quote.
 *
 * Paolo's is Booking's own English translation of an Italian review, and says
 * so on the page.
 */
export const QUOTES = [
  {
    text: 'Staff were friendly and hospitable\nViews stunning\nDinner & breakfast outstanding and great value for money\nVery comfortable, warm and quiet',
    name: 'Felicity',
    place: 'United Kingdom',
    date: '18 June 2026',
    score: 10,
    note: null,
  },
  {
    text: 'Very nice big new room. Beautiful view of the glacier.\nThe staff is super helpful and nice. Breakfast is good with eggs, fruits, home made bread and cake. Also you have a tea station available any time.',
    name: 'Kateryna',
    place: 'Ukraine',
    date: '19 May 2026',
    score: 9,
    note: null,
  },
  {
    text: 'Wonderful location, 4 km down a gravel road off the highway. Beautiful mountain views. We ate a lamb burger dinner at their restaurant which was delicious. Good breakfast served with lots of choices.',
    name: 'Anthea',
    place: 'Canada',
    date: '11 April 2024',
    score: 9,
    note: null,
  },
  {
    text: 'Great rural location, you can see the sheep and the sheds. Nice, luminous dining area, a porch with great views. Clean, spacious cabins with built-in bathrooms. Clean linen and towels. Friendly staff',
    name: 'Covadonga',
    place: 'Spain',
    date: '26 March 2025',
    score: 9,
    note: null,
  },
  {
    text: 'This very pleasant accommodation is located in the middle of a sheep farm. There are several buildings with comfortable, spacious and clean rooms. The breakfast was very plentiful and delicious.',
    name: 'Mihaly',
    place: 'Hungary',
    date: '7 November 2024',
    score: 9,
    note: null,
  },
  {
    text: 'We loved the location for the closeness to the glacier and we were blessed to stay in one of the cabins with great views. We were very lucky to see the northern lights from our bedroom window',
    name: 'Victoria',
    place: 'Australia',
    date: '25 November 2025',
    score: 9,
    note: null,
  },
  {
    text: 'The location was stunning and the guesthouse was very inviting and comfortable. The staff has been very kind and tried to accommodate all our requests. Definitely recommended.',
    name: 'Nicola',
    place: 'Netherlands',
    date: '28 May 2025',
    score: 9,
    note: null,
  },
  {
    text: 'Good location tucked away in a farm away from the town. Rooms were decent and comfortable. Special shoutout for the complimentary breakfast - pretty nice variety and taste.',
    name: 'Datta',
    place: 'India',
    date: '7 October 2024',
    score: 9,
    note: null,
  },
  {
    text: 'Great to come back to the accommodation.\nA wonderful place to admire the landscape and the sounds of nature.\nVery nice breakfast and staff, before and during the stay.',
    name: 'Nuno',
    place: 'Portugal',
    date: '10 June 2026',
    score: 9,
    note: null,
  },
  {
    text: 'Staff was great and the food was fantastic and very cheap compared to the city. The price of the room was also a bargain. We will definitely stay again.',
    name: 'Sunnasveins',
    place: 'Iceland',
    date: '11 August 2024',
    score: 9,
    note: null,
  },
  {
    text: 'really nice and helpful stuff, amazing surroundings, you can watch sheep directly from your window, quiet farm, rich breakfast',
    name: 'Jakub',
    place: 'Czech Republic',
    date: '3 June 2024',
    score: 9,
    note: null,
  },
  {
    text: 'Good location, near to the main road (Route 1), due to our early departure, they kindly offered us breakfast to go (THANK YOU, we really appreciate it), comfortable rooms.',
    name: 'Bredachuk',
    place: 'Slovenia',
    date: '22 January 2024',
    score: 9,
    note: null,
  },
  {
    text: 'Super well located. The staff is fantastic. I informed we would be leaving early, before the breakfast being served, they prepared a small breakfast meal for take away for us. Very kind of them.',
    name: 'Lucas',
    place: 'Ireland',
    date: '22 October 2024',
    score: 10,
    note: null,
  },
  {
    text: 'Location perfect for those looking for peace and beautiful views. Even though bathroom is shared, there is a small sink in the room, which helps a lot.\nVery good breakfast in the morning.',
    name: 'Martyna',
    place: 'Poland',
    date: '30 June 2026',
    score: 10,
    note: null,
  },
  {
    text: 'A really nice guest house in the perfect spot for the ring road. The room is very clean and the breakfast is super. It is a perfect choice if you want to stay near Hofn.',
    name: 'Konstantinos',
    place: 'Greece',
    date: '2 August 2025',
    score: 10,
    note: null,
  },
  {
    text: 'Staff were really friendly and helpful. Fantastic restaurant at fair prices. Lamb from the local farm. Beautiful rooms in a picturesque rural location',
    name: 'Joshua',
    place: 'New Zealand',
    date: '19 May 2025',
    score: 10,
    note: null,
  },
  {
    text: 'Beautiful, quiet location with exceptional views and perfect for northern light spotting due to low light pollution. Delicious dinners served.',
    name: 'Lo',
    place: 'Denmark',
    date: '6 May 2026',
    score: 10,
    note: null,
  },
  {
    text: 'The guesthouse was clean, staff was friendly and the breakfast was really nice with amazing view. Truly value for money!',
    name: 'Essi',
    place: 'Finland',
    date: '20 October 2025',
    score: 10,
    note: null,
  },
  {
    text: 'Perfect remote guesthouse with local kitchen, very clean and comfortable rooms.',
    name: 'Aaron',
    place: 'Switzerland',
    date: '17 February 2026',
    score: 10,
    note: null,
  },
  {
    text: 'This was a very fun location - on a farm outside of Hofn. We enjoyed see the farm and the huge variety of birdlife on the drive to the property. Spacious, clean room and decent continental breakfast.',
    name: 'Jennifer',
    place: 'United States',
    date: '28 May 2024',
    score: 10,
    note: null,
  },
  {
    text: 'This place is amazing, very quiet and peaceful with nice views. We had a room with a private bathroom, and the room itself was quite spacious. The breakfast was great, including fresh and domestic food.',
    name: 'Jelena13',
    place: 'Croatia',
    date: '2 July 2025',
    score: 10,
    note: null,
  },
  {
    text: 'Nice place. Middle of nature with great view on the glacier! And on the sheeps ;)',
    name: 'Jeremy',
    place: 'France',
    date: '24 July 2026',
    score: 9,
    note: null,
  },
  {
    text: 'Million dollar view, good breakfast, comfortable and cozy! A memorable stay😁😁',
    name: 'Millist',
    place: 'Australia',
    date: '23 June 2026',
    score: 10,
    note: null,
  },
  {
    text: 'Best accommodation of our Icelandic holiday. Immersed in nature, beautiful dining room overlooking the countryside with glaciers visible in good weather, excellent and rich breakfast with local products.',
    name: 'Paolo',
    place: 'Italy',
    date: '30 June 2026',
    score: 10,
    note: 'Translated from Italian',
  },
] as const

export const FOOTNOTE =
  'Guest ratings and quotes are from Booking.com, verified 25 August 2026. Photographs are our own. Room rates and availability come live from our booking system. The dinner is arranged with us when you arrive.'