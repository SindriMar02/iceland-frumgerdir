/**
 * The Mirror Suite — „Speglaröðin við sjóinn" (the mirror row by the sea).
 * Facts read off themirrorsuite.com and their Lodgify pages 2026-08-14/15,
 * then corrected against their own Airbnb listings 2026-08-16 (four suites,
 * real reviews, real ratings). English-first (their site is English-only).
 */

const B = `${import.meta.env.BASE_URL}mirrorsuite`

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

/* FOUR suites, not three — corrected 2026-08-16 against their own Airbnb
   listings, which number them 1 Arctic Thyme, 2 Lupine, 3 Bearberry,
   4 Gleymmerey, and state that all four are identical in layout, design and
   amenities. We had been missing Lupine entirely. */
export const FLORA = {
  lead: 'Named after what grows on the shore.',
  body:
    'Four suites, identical to each other and named for the flora between the row and the water: Arctic Thyme, blóðberg. Lupine, lúpína. Bearberry, sortulyng. Gleymmerey, the forget-me-not. Small, hardy, and entirely of this coast.',
  names: [
    { en: 'Arctic Thyme', is: 'Blóðberg' },
    { en: 'Lupine', is: 'Lúpína' },
    { en: 'Bearberry', is: 'Sortulyng' },
    { en: 'Gleymmerey', is: 'Gleym-mér-ei' },
  ],
}

/**
 * REVIEWS — REAL, and quoted verbatim. Source: the property's own Airbnb
 * listing "the Mirror Suite 2 - Lupine" (airbnb.com/rooms/1421255223000581372),
 * read 2026-08-16. Confirmed as theirs by the host: Marat, Superhost, with
 * Isabelle as co-host — the same two people who run the row.
 *
 * Verified on that listing the same day:
 *   4.98 from 54 reviews · Guest Favourite · 98% of reviews are five stars
 *   Cleanliness 5.0 · Accuracy 5.0 · Check-in 5.0 · Communication 5.0
 *   Location 4.9 · Value 4.7
 *   Host level: Marat holds 4.97 across 133 reviews, Superhost, 1 year hosting
 *
 * The old 5.0/10-Google figure is RETIRED: it was the weaker number, and the
 * claim built on it ("every guest gave it five stars") is now provably false —
 * Lena left four stars in July 2026. Her review is not quoted here because a
 * property's own page does not carry its own criticism, but it is recorded in
 * the build memory because it is material: her point is that the suites are a
 * row and you can see the neighbouring hot tubs. This page already tells that
 * truth by concept, since THE ROW is the whole idea.
 *
 * DO NOT lift quotes from OOD Hekla Horizon (Hella), WonderInn Arctic (Norway)
 * or Mirror House Iceland — search results are thick with all three and none of
 * them are this property.
 */
export const REVIEWS = {
  lead: '4.98 from fifty-four guests, and not one of them on your own website.',
  score: '4.98',
  count: '54 reviews · Guest Favourite',
  source: 'Airbnb',
  body: 'Ninety-eight per cent of them are five stars, and Marat is a Superhost at 4.97 across 133 stays. Your own booking page still says “no reviews yet”. A guest deciding at midnight never sees any of it.',
  sourceNote:
    'Real reviews, quoted verbatim from your Airbnb listing (the Mirror Suite 2, Lupine) on 16 August 2026. On your own site they would sit here, on your own domain, working for you instead of for Airbnb.',
  quotes: [
    {
      text: 'The location was amazing! We were able to catch the sunset over the mountain from inside our room and in the private sauna! It was really stunning, and we would highly recommend staying here!',
      name: 'Brendan',
      meta: 'Austin, Texas · Airbnb, August 2026',
    },
    {
      text: 'This was one of our two favorite places & homes on our entire Iceland trip. Perfect to relax and enjoy. We can only recommend staying here',
      name: 'Alexandra',
      meta: 'Eleven years on Airbnb · August 2026',
    },
    {
      text: 'The mirror suite was cozy, unique, and had beautiful views of both the ocean and the mountains. It was a peaceful place to relax.',
      name: 'Tamara',
      meta: 'Orlando, Florida · Airbnb, July 2026',
    },
    {
      text: 'Unique location and it was wonderful to sit in the hot tub overlooking the water.',
      name: 'Lesley-Anne',
      meta: 'Thirteen years on Airbnb · July 2026',
    },
  ],
}

export const PANO = {
  caption: 'Some nights the sky does the decorating.',
  note: 'Scroll to run the night',
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
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.98', reviewCount: '54', bestRating: '5' },
  checkinTime: '15:00',
  checkoutTime: '11:00',
}
