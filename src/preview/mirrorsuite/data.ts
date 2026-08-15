/**
 * The Mirror Suite — „Speglaröðin við sjóinn" (the mirror row by the sea).
 * Facts read off themirrorsuite.com, their Lodgify pages and their own
 * Google widget 2026-08-14/15. English-first (their site is English-only).
 */

const B = '/mirrorsuite'

export const EMAIL = 'info@themirrorsuite.com'
export const EMAIL_HREF = 'mailto:info@themirrorsuite.com'
export const ADDRESS = 'Ljárskógarströnd 17, 371 Búðardalur, Iceland'
export const COMPANY = 'the Glass Suite ehf.'

export const IMG = {
  hero: `${B}/hero.jpg`,
  dusk: `${B}/int-1.jpg`,
  wide2: `${B}/wide-2.jpg`,
  wide3: `${B}/wide-3.jpg`,
  wide4: `${B}/wide-4.jpg`,
  wide5: `${B}/wide-5.jpg`,
  wide6: `${B}/wide-6.jpg`,
  wide7: `${B}/wide-7.jpg`,
  int2: `${B}/int-2.jpg`,
  int3: `${B}/int-3.jpg`,
  int4: `${B}/int-4.jpg`,
  pano: `${B}/pano.jpg`,
  land1: `${B}/land-1.jpg`,
  land2: `${B}/land-2.jpg`,
  tall1: `${B}/tall-1.jpg`,
  tall2: `${B}/tall-2.jpg`,
  tall3: `${B}/tall-3.jpg`,
  tall4: `${B}/tall-4.jpg`,
  tall5: `${B}/tall-5.jpg`,
  tall6: `${B}/tall-6.jpg`,
  tall7: `${B}/tall-7.jpg`,
  tall8: `${B}/tall-8.jpg`,
  tall9: `${B}/tall-9.jpg`,
  sq1: `${B}/sq-1.jpg`,
  sq2: `${B}/sq-2.jpg`,
  port1: `${B}/port-1.jpg`,
  port2: `${B}/port-2.jpg`,
  port3: `${B}/port-3.jpg`,
  port4: `${B}/port-4.jpg`,
}

export const NAV = [
  { id: 'rodin', label: 'The row' },
  { id: 'svitan', label: 'The suite' },
  { id: 'floran', label: 'The names' },
  { id: 'bokun', label: 'Book' },
]

export const HERO = {
  word: 'The Mirror Suite',
  sub: 'Mirror suites on the shore of Hvammsfjörður, fifty metres from the sea.',
}

export const STATEMENT = {
  lead: 'The sea on one side. The sea again, in the glass.',
  body:
    'A row of mirror-clad suites stands on the shore in West Iceland, each with floor-to-ceiling glass facing the fjord, its own glass-walled sauna, and a hot tub under the open sky. Fifty metres away, the tide does the decorating.',
}

/** THE ROW — expanding glass panels. Captions describe what each photo shows. */
export const ROW = [
  { img: 'dusk', label: 'The dusk', text: 'A suite and its hot tub on the moor at golden hour, the fjord light reflected in the cladding.' },
  { img: 'tall1', label: 'The bed', text: 'From under the duvet: the next mirror cube standing in the window.' },
  { img: 'tall5', label: 'The night', text: 'The suite lit under a starry sky, the aurora low on the horizon.' },
  { img: 'tall2', label: 'The glass', text: 'Mirror panels handing the room to the fjord and the sky.' },
] as const

export const SUITE = {
  lead: 'Each suite carries its own sauna and its own sky.',
  body:
    'Floor-to-ceiling windows face the fjord, a private glass-walled sauna faces the same water, and the hot tub sits outside under whatever the night brings. Self check-in from three, and the suite is yours until eleven.',
  facts: [
    { n: '2', l: 'guests per suite' },
    { n: '50', l: 'metres to the sea' },
    { n: '15–11', l: 'check-in to check-out' },
  ],
  amenities: [
    'Private glass-walled sauna',
    'Outdoor hot tub',
    'Floor-to-ceiling ocean glass',
    'Bathrobes and floor heating',
    'Kitchenette with coffee and spices',
    'Credit cards accepted',
  ],
}

export const FLORA = {
  lead: 'Named after what grows on the shore.',
  body:
    'The suites take their names from the flora between the row and the water: Bearberry, sortulyng. Gleymmerey, the forget-me-not. Arctic Thyme, blóðberg. Small, hardy, and entirely of this coast.',
  names: [
    { en: 'Bearberry', is: 'Sortulyng' },
    { en: 'Gleymmerey', is: 'Gleym-mér-ei' },
    { en: 'Arctic Thyme', is: 'Blóðberg' },
  ],
}

export const REVIEWS = {
  lead: 'Five stars, hiding in a widget.',
  score: '5.0',
  count: '10 Google reviews',
  body: 'Every guest who has reviewed The Mirror Suite on Google gave it five stars. The booking page never mentions it. This one does.',
}

export const HOSTS = {
  lead: 'Marat and Isabelle',
  body:
    'The duo behind the row: Marat runs marketing and strategy, Isabelle runs communication and the guests. Lena joined in 2026 and keeps the suites spotless.',
}

export const BOOKING = {
  title: 'Ask for a suite',
  body: 'Send your dates and party of two, and we answer personally with availability and a price. No card, no charge, nothing is booked yet.',
  success: 'Thank you. Your request is with us and we answer personally, usually within a day.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'The Mirror Suite',
  legalName: 'the Glass Suite ehf.',
  description:
    'Mirror-clad luxury suites on the shore of Hvammsfjörður in West Iceland, 50 metres from the sea, each with a private glass-walled sauna and outdoor hot tub.',
  email: EMAIL,
  url: 'https://www.themirrorsuite.com',
  address: { '@type': 'PostalAddress', streetAddress: 'Ljárskógarströnd 17', postalCode: '371', addressLocality: 'Búðardalur', addressCountry: 'IS' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '10', bestRating: '5' },
  checkinTime: '15:00',
  checkoutTime: '11:00',
}
