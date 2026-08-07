/**
 * Real content harvested from the live Airbnb listing (room
 * 1280420693070657952), 2026-08-06. 111 listing photos downloaded, contact-
 * sheeted and individually reviewed; 24 staged. Nothing invented — see
 * [[feedback-fact-check-before-drafting]].
 */

export const HOST = {
  names: 'Agla and Haffi',
  primary: 'Agla',
  superhost: true,
  yearsHosting: 12,
  rating: 4.99,
  reviewCount: 70,
}

const B = import.meta.env.BASE_URL + 'glasshouse/'

/** Phones get the 800w set; desktop the 1440-tall originals. */
export const srcSet = (src: string) =>
  `${src.replace(/\.jpg$/, '-800.jpg')} 800w, ${src} 1600w`

export const PHOTO = {
  /** THE anchor: square skylight directly over the bed, glass corner beyond. */
  skylight: { src: `${B}skylight.jpg`, alt: 'The square skylight set directly over the bed, glass walls opening onto birch scrub', ratio: '4 / 3' },
  bedSkylight: { src: `${B}bed-skylight.jpg`, alt: 'The bed beneath the skylight, morning light falling across the linen', ratio: '3 / 2' },
  bedSummer: { src: `${B}bed-summer.jpg`, alt: 'The bed facing the glass wall, birch scrub in summer leaf beyond', ratio: '3 / 2' },
  bedCurtains: { src: `${B}bed-curtains.jpg`, alt: 'Sheer curtains drawn back from the glass wall beside the bed', ratio: '3 / 2' },
  bedWinter: { src: `${B}bed-winter.jpg`, alt: 'The same glass wall in winter, snow on the birches beyond the bed', ratio: '3 / 2' },
  deckOverhang: { src: `${B}deck-overhang.jpg`, alt: 'The timber deck under the roof overhang, the hot tub at its edge', ratio: '3 / 2' },
  houseBirch: { src: `${B}house-birch.jpg`, alt: 'The timber-clad house low in the birch scrub', ratio: '3 / 2' },
  houseWide: { src: `${B}house-wide.jpg`, alt: 'The house and its glass corner seen across the heath', ratio: '3 / 2' },
  houseSauna: { src: `${B}house-sauna.jpg`, alt: 'The house with the barrel sauna beside it in the scrub', ratio: '3 / 2' },
  saunaBarrel: { src: `${B}sauna-barrel.jpg`, alt: 'The barrel sauna between the birches', ratio: '3 / 2' },
  hottubSnow: { src: `${B}hottub-snow.jpg`, alt: 'The wooden hot tub steaming in the snow', ratio: '3 / 2' },
  poolMoss: { src: `${B}pool-moss.jpg`, alt: 'The small plunge pool set into the moss', ratio: '3 / 2' },
  auroraTrees: { src: `${B}aurora-trees.jpg`, alt: 'Green northern lights over the birch tops', ratio: '3 / 2' },
  auroraHouse: { src: `${B}aurora-house.jpg`, alt: 'The aurora over the house and barrel sauna at night, their photograph', ratio: '3 / 2' },
  winterHouse: { src: `${B}winter-house.jpg`, alt: 'The house under deep snow', ratio: '3 / 2' },
  winterDeep: { src: `${B}winter-deep.jpg`, alt: 'Snow banked against the glass, the birches white', ratio: '3 / 2' },
  winterSauna: { src: `${B}winter-sauna.jpg`, alt: 'The barrel sauna half-buried in snow', ratio: '3 / 2' },
  hottubPerson: { src: `${B}hottub-person.jpg`, alt: 'A guest in the hot tub, snow all around', ratio: '3 / 2' },
  kitchen: { src: `${B}kitchen.jpg`, alt: 'The white kitchen, morning light through the glass', ratio: '3 / 2' },
  bath: { src: `${B}bath.jpg`, alt: 'The freestanding bath by the window', ratio: '3 / 4' },
  sofa: { src: `${B}sofa.jpg`, alt: 'The white sofa facing the glass wall', ratio: '3 / 2' },
  deskWindow: { src: `${B}desk-window.jpg`, alt: 'The desk at the window, the heath beyond', ratio: '3 / 2' },
  sunsetPerson: { src: `${B}sunset-person.jpg`, alt: 'Watching the sunset through the glass wall', ratio: '3 / 2' },
  viewSky: { src: `${B}view-sky.jpg`, alt: 'The wide sky over the heath', ratio: '3 / 2' },
} as const

// Verbatim guest quotes, attributed as Airbnb displays them. Never reworded.
export const REVIEW_QUOTES = [
  {
    quote: 'We enjoyed the views, the seclusion, the sunsets, the comfortable bed, the wake-up sauna, the goodnight bathe in the hot tub. Everything.',
    author: 'Toby',
    when: 'July 2026',
  },
  {
    quote: 'The view out those big windows was stunning, and it was just the calm, relaxing trip we needed.',
    author: 'Richard',
    when: 'July 2026',
  },
  {
    quote: 'Surrounded by beautiful nature, great hot tub and sauna. Around 20 minutes to town. Was a great base for the Golden Circle as well.',
    author: 'Goldie',
    when: 'August 2026',
  },
] as const

/** Facts, each from the listing or repeated across guest reviews. */
export const FACTS = {
  guests: 2,
  bedrooms: 1,
  sauna: 'Barrel sauna in the birches',
  hotTub: 'Wood-fired hot tub, open all year',
  distance: 'About 20 minutes from Reykjavík',
  base: 'Mosfellsbær, at the edge of the heath',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'The Glass House',
  description:
    'A one-bedroom glass house on the heath at Mosfellsbær, about twenty minutes from Reykjavík. A skylight sits directly over the bed; a barrel sauna and wood-fired hot tub stand in the birch scrub.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mosfellsbær',
    addressRegion: 'Höfuðborgarsvæðið',
    addressCountry: 'IS',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.99,
    reviewCount: 70,
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private sauna', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Private hot tub', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Skylight over the bed', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
  ],
}
