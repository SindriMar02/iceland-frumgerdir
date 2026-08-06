/**
 * Real content harvested 2026-08-06 from the live Airbnb listing (room
 * 48712789) and laxfoss.org. All photos are their own, individually reviewed
 * on a contact sheet before selection. Nothing invented —
 * [[feedback-fact-check-before-drafting]].
 */

export const HOST = {
  name: 'Guðlaug',
  listedAs: 'Gudlaug', // unaccented on the listing itself
  superhost: true,
  yearsHosting: 12,
  rating: 5.0,
  reviewCount: 123,
  badges: ['Guest favorite', 'Top 10% of homes'],
}

const B = import.meta.env.BASE_URL + 'laxfoss/'

/** Phones get the 800w set; desktop the 1440-tall originals. */
export const srcSet = (src: string) =>
  `${src.replace(/\.jpg$/, '-800.jpg')} 800w, ${src} 1600w`

export interface Photo { src: string; alt: string; ratio: string }

export const PHOTO = {
  /** THE shot: the lodge on its bluff directly above the falls, Baula behind. */
  waterfallAerial: { src: `${B}waterfall-aerial.jpg`, alt: 'The lodge on a bluff directly above Laxfoss waterfall, the Norðurá winding toward the snow cone of Baula', ratio: '3 / 2' },
  /** Dark aerial of the rapids and fish ladder — the descent scrub. */
  rapidsDark: { src: `${B}rapids-dark.jpg`, alt: 'The rapids of the Norðurá from above, white water threading dark basalt', ratio: '3 / 2' },
  valleyTwilight: { src: `${B}valley-twilight.jpg`, alt: 'The Norðurá valley at twilight, the river winding pale between dark banks', ratio: '3 / 2' },
  waterfallWinter: { src: `${B}waterfall-winter.jpg`, alt: 'Laxfoss in winter, water breaking over snow-edged basalt shelves', ratio: '3 / 2' },
  waterfallSunset: { src: `${B}waterfall-sunset.jpg`, alt: 'The waterfall at sunset, the hillside glowing amber above it', ratio: '3 / 2' },
  riverCanyon: { src: `${B}river-canyon.jpg`, alt: 'The blue river canyon below the falls, frost on both banks', ratio: '3 / 2' },
  sunriseRiver: { src: `${B}sunrise-river.jpg`, alt: 'Low sun over the river, the water reading like beaten metal', ratio: '3 / 2' },
  lodgeExterior: { src: `${B}lodge-exterior.jpg`, alt: 'The lodge from the riverside: stone footing, dark timber, pitched roof', ratio: '3 / 2' },
  kitchenBlack: { src: `${B}kitchen-black.jpg`, alt: 'The black kitchen with a white island under the timber ceiling', ratio: '3 / 2' },
  diningGlass: { src: `${B}dining-glass.jpg`, alt: 'The dining table against the glass wall, the river valley beyond', ratio: '3 / 2' },
  diningWindow: { src: `${B}dining-window.jpg`, alt: 'The living space wrapped in windows, paintings on original timber walls', ratio: '3 / 2' },
  livingFireplace: { src: `${B}living-fireplace.jpg`, alt: 'The stone fireplace in the living room, windows on the river to both sides', ratio: '3 / 2' },
  livingWide: { src: `${B}living-wide.jpg`, alt: 'The sitting room: white sofa, timber walls, the valley in every window', ratio: '3 / 2' },
  windowSeat: { src: `${B}window-seat.jpg`, alt: 'An armchair pulled up to the window, the river below', ratio: '3 / 4' },
  bedroom: { src: `${B}bedroom.jpg`, alt: 'A double bedroom in original timber, the window on the valley', ratio: '3 / 2' },
  bedroomGold: { src: `${B}bedroom-gold.jpg`, alt: 'A double bed with gold cushions against a panelled wall', ratio: '3 / 4' },
  saunaNight: { src: `${B}sauna-night.jpg`, alt: 'The barrel sauna at night, its round window glowing under the stars', ratio: '3 / 2' },
  saunaForest: { src: `${B}sauna-forest.jpg`, alt: 'The barrel sauna standing among the trees', ratio: '3 / 4' },
  hottubDusk: { src: `${B}hottub-dusk.jpg`, alt: 'The hot tub on the deck at dusk, steam rising against the last light', ratio: '3 / 2' },
  auroraLodge: { src: `${B}aurora-lodge.jpg`, alt: 'Green aurora over the lodge, its windows lit warm below', ratio: '3 / 2' },
} as const satisfies Record<string, Photo>

/** Verbatim guest quotes, attributed the way Airbnb displays them. */
export const REVIEW_QUOTES = [
  {
    quote: 'There can’t be many places on Earth quite like this. The history, the view, the peace.',
    author: 'Kevin',
    when: 'June 2026',
  },
  {
    quote: 'We were able to see salmon jumping upstream from our balcony. The wood burning sauna was simply fabulous!',
    author: 'Soo',
    when: 'August 2026',
  },
  {
    quote: 'The view of the waterfall was breathtaking and the noise of the waterfall could be heard throughout the living space.',
    author: 'Nadine',
    when: 'July 2026',
  },
  {
    quote: 'The sauna with a great view of the waterfall provides relaxation.',
    author: 'Sabine',
    when: 'August 2026',
  },
] as const

/** The descent — three stations of the falls, copy written to their material. */
export const DROP_STATIONS = [
  {
    key: 'upstream',
    name: 'Upstream',
    body: 'Above the brink the Norðurá runs wide and calm. This is the stretch where guests take a careful dip on warm days, in the slow water above the fall.',
  },
  {
    key: 'brink',
    name: 'The brink',
    body: 'The river narrows over basalt and drops beside the house. With a window open, the sound carries through every room.',
  },
  {
    key: 'pool',
    name: 'The pool',
    body: 'In season, salmon gather below the white water and throw themselves at the fall. Guests watch the attempts from the balcony, for hours.',
  },
] as const

export const ROOMS = [
  { name: 'Bedroom one', line: 'Double bed, window on the valley' },
  { name: 'Bedroom two', line: 'Double bed, original timber walls' },
  { name: 'Bedroom three', line: 'Single bed' },
  { name: 'The bunk room', line: 'Two toddler beds, made for children' },
] as const

export const FACTS = {
  guests: 5,
  bedrooms: 4,
  baths: '1.5 baths',
  built: 'Built in the 1920s, thoughtfully renovated',
  drive: '1 hour 20 minutes from Reykjavík',
  town: '20 minutes to Borgarnes',
  winter: 'A 4x4 is recommended in winter',
  sauna: 'Private wood-fired sauna',
  fireplace: 'Fireplace in the sitting room',
}

export const RIVER = {
  name: 'Norðurá',
  claim: 'Norðurá is one of Iceland’s most prestigious fly-fishing rivers.',
  fishing: 'The river is privately managed. Fishing requires a valid permit, arranged separately in advance.',
  safety: 'The currents are strong and the falls are not for swimming. On calm days guests dip safely in the slow water above the fall.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Laxfoss Luxury Lodge',
  description:
    'A 1920s riverside lodge set directly above the Laxfoss waterfall on the Norðurá in Borgarfjörður, West Iceland. Sleeps five across four bedrooms, with a private wood-fired sauna, hot tub and fireplace.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Borgarbyggð',
    addressRegion: 'Vesturland',
    addressCountry: 'IS',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 5.0,
    reviewCount: 123,
    // Source: the live Airbnb listing, 2026-08-06.
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private waterfall view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Private sauna', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Hot tub', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Fireplace', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
  ],
}
