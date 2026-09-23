import type { PreviewCompany } from '../company-types'

/*
 * Eyvík Cottages (Urðarholt ehf.). Every fact on this page comes from the
 * owners' own five Airbnb listings, read 22.09.2026, or from their guests'
 * reviews on those listings, quoted verbatim. Where Airbnb and older text
 * disagree, Airbnb's bookable facts win (2 guests, not "up to 4").
 * Audit: _docs/EYVIK-AUDIT-2026-09-22.md · Plan: _docs/EYVIK-BUILD-PLAN-2026-09-22.md
 */

const BASE = import.meta.env.BASE_URL
const P = (name: string, w: number) => `${BASE}eyvik/${name}-${w}.webp`

export type Photo = { src: string; srcSet: string; alt: string; w: number; h: number }

export function photo(name: string, widths: number[], ratio: number, alt: string): Photo {
  const top = widths[0]
  return { src: P(name, top), srcSet: widths.map((w) => `${P(name, w)} ${w}w`).join(', '), alt, w: top, h: Math.round(top / ratio) }
}

const L = 4 / 3
const T = 3 / 4
const UP = [2800, 1600, 900]
const RAW = [1800, 1000, 600]

export const IMG = {
  sunrise: photo('sunrise', UP, L, 'Sunrise seen from a cottage deck at Eyvík, the plain running flat to the mountains'),
  gold: photo('gold', UP, L, 'An Eyvík cottage in low evening sun, dry golden grass in front'),
  dusk: photo('dusk', UP, L, 'An Eyvík cottage at dusk, the sun going down behind clouds over the plain'),
  aurora: photo('aurora', UP, L, 'Northern lights over an Eyvík cottage, its windows lit'),
  drone: photo('drone', UP, 16 / 9, 'An Eyvík cottage from above: the deck, the hot tub and a car on the gravel'),
  horses: photo('horses', UP, L, 'Icelandic horses grazing on the farm at Eyvík at golden hour'),
  snowrow: photo('snowrow', UP, L, 'The row of Eyvík cottages in deep snow under a blue sky'),
  winterdeck: photo('winterdeck', UP, L, 'The view from a deck in winter, snow over the plain at sunset'),
  tub: photo('tub', RAW, L, 'The hot tub and the grill on a cottage deck'),
  tubLid: photo('tub-lid', RAW, T, 'The hot tub with its lid open, set into the deck'),
  tubNight: photo('tub-night', RAW, L, 'The hot tub and grill on the deck at night'),
  deckNight: photo('deck-night', RAW, L, 'A cottage deck at night, the wall lights on'),
  deckDay: photo('deck-day', RAW, L, 'Table and chairs on the deck, the plain beyond'),
  kitchen: photo('kitchen', RAW, L, 'The kitchen and dining table in a cottage'),
  kitchenView: photo('kitchen-view', RAW, L, 'Kitchen, table and sofa, with the plain through the windows'),
  living: photo('living', RAW, L, 'The living room sofa beside the big windows'),
  diningTv: photo('dining-tv', RAW, L, 'Dining table and the 55 inch TV'),
  bed: photo('bed', RAW, L, 'The bedroom, made up with white linen and towels'),
  bath: photo('bath', RAW, T, 'The bathroom with its shower'),
  livingB: photo('living-b', RAW, L, 'Living room with the view out over the plain'),
  livingC: photo('living-c', RAW, L, 'Open living and dining area with windows on two sides'),
  bedC: photo('bed-c', RAW, T, 'The bedroom with its reading lights'),
  snowedIn: photo('snowed-in', RAW, L, 'A cottage deck buried in snow'),
  rowSnow: photo('row-snow-b', RAW, L, 'Three of the cottages in snow'),
  cottageSnow: photo('cottage-snow', RAW, L, 'A cottage in the snow on a clear day'),
  snowCabin: photo('snow-cabin-c', RAW, L, 'A cottage in snow, low winter sun'),
  road: photo('road', RAW, 2560 / 1471, 'The gravel track across the moor to the cottages'),
  horsesB: photo('horses-b', RAW, L, 'Horses in the evening light on the farm'),
  snowAerial: photo('snow-aerial', RAW, 2560 / 1707, 'The frozen plain below the cottages, low winter sun'),
}

export const FILM = {
  gold: { src: `${BASE}eyvik/gold.mp4`, poster: `${BASE}eyvik/gold-poster-1600.webp` },
  dusk: { src: `${BASE}eyvik/dusk.mp4`, poster: `${BASE}eyvik/dusk-poster-1600.webp` },
  aurora: { src: `${BASE}eyvik/aurora.mp4`, poster: `${BASE}eyvik/aurora-poster-1600.webp` },
}

export const CONTACT = {
  phone: '770-7800',
  tel: '+3547707800',
  email: 'urdarholtehf@gmail.com',
  hosts: 'Smári and Íris',
  address: 'Eyvík, 805 Selfoss',
}

/** The same cottage five times: Airbnb gives each the same facts. */
export const SPEC = [
  ['32 m²', 'A, B and C · D and E are 39 m²'],
  ['30 m²', 'private deck, on two sides'],
  ['2', 'guests, one bedroom'],
  ['1', 'hot tub per deck, natural hot water'],
] as const

export type Cottage = {
  id: 'A' | 'B' | 'C' | 'D' | 'E'
  airbnb: string
  rating: string
  reviews: number
  badge?: string
  /** a guest who stayed in THIS cottage, verbatim from its own listing */
  quote: { text: string; who: string; when: string }
  /** one thing that happened on this deck, from its own reviews */
  moment: string
  /** floor area. Booking.com lists five houses: three at 32 m² and two at 39 m².
   *  D and E are the newer pair (Airbnb ids from 2023, typed "cabin", guests call
   *  them new), so they are read as the two 39 m² houses: an inference, flagged. */
  m2: 32 | 39
  /** what this listing on Airbnb says that the others do not, verbatim labels */
  own: string[]
}

export const COTTAGES: Cottage[] = [
  {
    id: 'A', airbnb: '32641344', rating: '4.97', reviews: 403, badge: 'Top 10% on Airbnb',
    quote: { text: 'Smári even texted us at night when Northern Lights appeared. It was magical!!', who: 'Theresa', when: 'March 2026' },
    moment: 'The first of the five, and the most reviewed.',
    m2: 32, own: ['Room-darkening shades', 'Mini fridge and freezer', 'Toaster, kettle, wine glasses'],
  },
  {
    id: 'B', airbnb: '39086287', rating: '4.98', reviews: 305, badge: 'Top 10% on Airbnb',
    quote: { text: 'The jacuzzi is filled with warm water all the time, gently sheltered from the wind and the other cottages, so privacy is guaranteed to the max.', who: 'Klaudia', when: 'May 2026, translated by Airbnb' },
    moment: 'A tub sheltered from the wind and from the neighbours.',
    m2: 32, own: ['55 inch HDTV with Netflix', 'Private patio'],
  },
  {
    id: 'C', airbnb: '39087033', rating: '4.99', reviews: 336,
    quote: { text: 'Geothermally heated hot tub, right on the deck with views onto an open vista. Even with people in the other cottages, there was perfect silence.', who: 'Mike', when: 'July 2026' },
    moment: 'Perfect silence, with a full row of guests.',
    m2: 32, own: ['Fast wifi, 129 Mbps, speed-tested', '55 inch HDTV with Netflix'],
  },
  {
    id: 'D', airbnb: '1023321018659729512', rating: '4.98', reviews: 90,
    quote: { text: 'spotted a lot of Icelandic wildlife - a blue morph Artic fox, and beautiful white ptarmigan on our deck.', who: 'Elizabeth', when: 'May 2026' },
    moment: 'An arctic fox and ptarmigan on the deck.',
    m2: 39, own: ['Listed as a cabin, one of the newer two', 'Carbon monoxide alarm', 'A dishwasher and a spacious bathroom, per its guests'],
  },
  {
    id: 'E', airbnb: '1023328116752387459', rating: '4.99', reviews: 130, badge: 'Top 5% on Airbnb',
    quote: { text: 'Had likely the most blissful experience of the entire Iceland trip sitting in sound proofed silence (courtesy of the moss) overlooking Hestvatn Lake.', who: 'Bob', when: 'September 2026' },
    moment: 'The newest, looking out over Hestvatn.',
    m2: 39, own: ['Listed as a cabin, one of the newer two', 'Carbon monoxide alarm', 'Top 5% of homes on Airbnb'],
  },
]

export const HOST = {
  reviews: '1,368',
  rating: '4.98',
  years: 7,
  superhost: true,
  response: 'Responds within an hour',
  bio: 'We are Smári and Íris and we live on a farm near Selfoss called Eyvík.',
}

/** The owners' own words, from their listings. Their caps, not ours, are dropped. */
export const THEIR_WORDS = {
  hekla: 'From the deck you can see Hekla volcano, the queen of Icelandic volcanoes.',
  winter: 'We take care of all our guests and we clear the snow from the road as often as necessary!',
  tub: 'Nothing is better than get warm in the hot tub, day and night you can enjoy it with natural hot water.',
  built: 'Well equipped and beautifully furnished, built by its owners.',
  lake: 'Lake Hestvatn is a beautiful lake only a 5 minutes walk from the cottage.',
  sunrise: 'Enjoying the sunrise and the nature at the deck is a rememberable experience.',
  motto: 'Don’t buy accommodation, buy experience!',
}

/** Four chapters of one day on the ridge. Guest words are verbatim. */
export const DAY = [
  {
    key: 'sunrise', time: 'Morning', title: ['Sunrise', 'from the', 'couch'], swash: 'couch',
    line: 'The plain runs flat to the mountains, and every deck looks out over it.',
    quote: { text: 'You can see the sunrise from the couch.', who: 'Nora' },
  },
  {
    key: 'gold', time: 'Afternoon', title: ['Horses', 'on the', 'moor'], swash: 'moor',
    line: 'Eyvík is a farm, and its horses graze the moor around the cottages.',
    quote: { text: 'drinking our coffee while watching the Icelandic horses', who: 'Lisa' },
  },
  {
    key: 'dusk', time: 'Evening', title: ['Evening', 'on the', 'deck'], swash: 'deck',
    line: 'Each deck has its own hot tub with natural hot water, and a grill beside it.',
    quote: { text: 'We loved the geo thermal hot tub! Wow!', who: 'Keisha' },
  },
  {
    key: 'aurora', time: 'Night', title: ['Lights', 'over the', 'roof'], swash: 'roof',
    line: 'Out here, far from town, a clear winter night can put the aurora right over the roof.',
    quote: { text: 'watch the northern lights both nights, either from the hot tub or through the big window', who: 'Edward' },
  },
] as const

/** Drive times from the owners' own Google Maps screenshots on their listings. */
export const NEAR = [
  { place: 'Hestvatn', min: '5', unit: 'min', note: 'On foot, the lake below the cottages' },
  { place: 'Kerið crater', min: '11', unit: 'min', note: '12 km' },
  { place: 'Selfoss', min: '20', unit: 'min', note: 'Groceries and restaurants' },
  { place: 'Secret Lagoon', min: '32', unit: 'min', note: '35 km, Flúðir' },
  { place: 'Geysir', min: '35', unit: 'min', note: '43 km' },
  { place: 'Gullfoss', min: '45', unit: 'min', note: '52 km' },
  { place: 'Þingvellir', min: '48', unit: 'min', note: '53 km' },
]

export const INSIDE = [
  ['Bedroom', 'One queen bed, room-darkening shades'],
  ['Living', 'Sofa and a 55 inch TV with Netflix'],
  ['Kitchen', 'Oven, stove, fridge and freezer, Nespresso, toaster, kettle'],
  ['Bathroom', 'Shower, hair dryer, towels and linen'],
  ['Deck', 'Hot tub, BBQ grill, table and chairs'],
  ['Arrival', 'Self check-in with a lockbox, free parking at the door'],
] as const

export const KNOW = [
  ['Check in', 'after 16:00'],
  ['Check out', 'before 11:00'],
  ['Guests', '2 per cottage'],
  ['Directions', 'A drone video and a guide arrive before you do'],
  ['Winter', 'The road is cleared of snow as often as needed'],
  ['Bring', 'Shampoo. There is no washing machine.'],
] as const

/** A handful of the 1,368, verbatim, newlines kept. */
export const VOICES = [
  { text: 'Íris was kind enough to point out to us that we could see the two famous volcanos in the landscape, Hekla and Eyjafjallajökull.', who: 'Gunnarsdóttir', when: 'November 2019' },
  { text: 'They even very kindly offered us to stay an extra night when our flights were cancelled.', who: 'Nicky', when: 'December 2022' },
  { text: 'This is exactly the kind of cottage us Icelanders prefer as a get-away the whole year round.', who: 'Gunnarsdóttir', when: 'November 2019' },
  { text: 'Very thoughtful instructions with pictures and video of the route - super helpful.', who: 'Susan', when: 'September 2026' },
  { text: 'The five cottages are nestled on the back of the property - nice and quiet with great views.', who: 'Stephen', when: 'August 2026' },
  { text: 'We arrived at night and were blown away by the view in the morning. Truly unforgettable!!', who: 'Serena', when: 'November 2025' },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Eyvík Cottages',
  description: 'Five cottages on a farm in Grímsnes, South Iceland, each with its own deck and hot tub, central to the Golden Circle.',
  telephone: '+354 770 7800',
  email: CONTACT.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Selfoss', postalCode: '805', addressCountry: 'IS' },
  checkinTime: '16:00',
  checkoutTime: '11:00',
  amenityFeature: ['Private hot tub', 'BBQ grill', 'Free parking', 'Wifi', 'Self check-in'].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
}

export const PHOTO_CREDIT =
  'Photographs are Smári and Íris’s own, from their five Airbnb listings, collected September 2026. Four were upscaled, and three were given gentle motion, from their own frames.'

export const companyEntry: PreviewCompany = {
  slug: 'eyvik',
  route: '/preview/eyvik',
  name: 'Eyvík Cottages',
  sector: 'Sumarhúsaleiga',
  location: 'Eyvík, Grímsnes, 805 Selfoss',
  region: 'Suðurland',
  established: 'Fimm sumarhús í röð á bænum Eyvík, hvert með eigin palli og heitum potti',
  currentUrl: 'https://www.airbnb.com/rooms/32641344',
  noOwnSite: true,
  currentLabel: 'Airbnb-síða (engin eigin vefsíða)',
  ownerEmail: CONTACT.email,
  concept: 'Five cottages, one ridge',
  conceptTagline: 'One day on the ridge, from sunrise on the couch to the aurora over the roof, and five decks to watch it from.',
  accent: '#9A542B',
  dark: false,
  status: 'In build',
  thumb: `${BASE}eyvik/sunrise-900.webp`,
  ownPhotography: true,
  photoCredit: PHOTO_CREDIT,
  english: true,
  audit: {
    strengths: [
      'Five cottages rated 4.97 to 4.99 on Airbnb, 1,368 reviews across the host at 4.98',
      'A private hot tub with natural hot water on every deck, Hekla on the horizon',
      'Hosts who live on the farm, clear the snow and text guests when the aurora is out',
    ],
    weaknesses: [
      'No website at all: the official tourism register lists an Airbnb room as their website',
      'Every booking pays Airbnb or Booking.com commission',
      'The host bio still says three cottages; there are five',
    ],
    opportunities: [
      'A direct booking calendar for all five cottages, fed from their own calendars',
      'A home for their own photos and 1,368 reviews that they control',
    ],
  },
  positioning:
    'Smári and Íris rent five near-identical cottages in a row on their farm at Eyvík in Grímsnes, each with a 30 m² deck and a hot tub facing the plain. The prototype tells one day on that ridge in their own photos and their guests’ own words, and ends in a booking calendar that knows which of the five is free.',
  outreach: {
    subject: 'Hugmynd að vefsíðu fyrir Eyvík',
    body: '[Drög í vinnslu]',
  },
}

/** "Along the ridge": the horizontal walk. Their photos and films, morning to night.
 *  `w` is the panel width on desktop (vw), `r` the frame ratio. Guest words verbatim. */
export const RIDGE = [
  { key: 'sunrise', time: '06:00', title: 'Sunrise from the couch', img: IMG.sunrise, w: 58, r: '4/3', quote: 'You can see the sunrise from the couch.', who: 'Nora, cottage A' },
  { key: 'gold', time: '14:00', title: 'Gold on the grass', img: IMG.gold, film: FILM.gold, w: 46, r: '4/5', quote: 'We loved the view from the house. It makes you feel like you’re miles away from anyone.', who: 'Kylie, cottage C' },
  { key: 'horses', time: '16:00', title: 'Horses on the moor', img: IMG.horses, w: 40, r: '1/1', quote: 'drinking our coffee while watching the Icelandic horses', who: 'Lisa, cottage A' },
  { key: 'dusk', time: '20:00', title: 'Evening on the deck', img: IMG.dusk, film: FILM.dusk, w: 58, r: '16/10', quote: 'we had beautiful sunsets and views of the mountains from our place', who: 'Curtis, cottage A' },
  { key: 'snow', time: 'January', title: 'The same row, in snow', img: IMG.snowrow, w: 50, r: '4/3', quote: 'Winter was a beautiful time to visit, and although rural this was still accessible.', who: 'Nicky, cottage A' },
  { key: 'tub', time: '23:00', title: 'The tub, after dark', img: IMG.tubNight, w: 56, r: '4/3', quote: 'watch the northern lights both nights, either from the hot tub or through the big window', who: 'Edward, cottage A' },
] as const
