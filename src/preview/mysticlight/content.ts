/**
 * Real content harvested from the live Airbnb listing (room
 * 1104246660273438823, "Mystic Light Lodge — Mirror Cabin"), Búðardalur,
 * Dalabyggð. Hosts: Esther & Pierre. 21 listing photos downloaded to
 * public/mysticlight/ and reviewed individually, 2026-08-04. Nothing here is
 * invented — every fact traces to
 * /private/tmp/.../scratchpad/harvest/mysticlight.json (see
 * [[feedback-fact-check-before-drafting]]). ownerEmail is deliberately empty
 * in ./data.ts; never guessed here either.
 */

const B = import.meta.env.BASE_URL + 'mysticlight/'

/** Phones get the -800 set; desktop the full 1200w JPEGs. */
export const srcSet = (src: string) =>
  `${src.replace(/\.jpg$/, '-800.jpg')} 800w, ${src} 1200w`

export interface Photo {
  src: string
  alt: string
  ratio: string
}

/** Local, vendored copies of Esther & Pierre's own listing photography. */
export const PHOTO = {
  /** THE hero: the cabin alone on the moor under a heavy storm sky. */
  arrivalStorm: { src: `${B}arrival-storm.jpg`, alt: 'The black mirror cabin standing alone on the moor under a heavy storm sky, one panel catching a break of gold light', ratio: '3 / 2' } as Photo,
  /** Dusk, both structures, snow-capped range behind. */
  duskFrost: { src: `${B}dusk-frost.jpg`, alt: 'The cabin and its timber porch at blue dusk, snow-capped mountains along the horizon', ratio: '16 / 9' } as Photo,
  /** THE mirror, close: wildflowers against the glass holding cloud. */
  summerFlowers: { src: `${B}summer-flowers.jpg`, alt: 'Arctic wildflowers in the foreground, the mirror wall behind them holding a cloud-streaked sky', ratio: '3 / 2' } as Photo,
  /** Skylight frame 1: sunset, the scope on its tripod. */
  bedSunsetScope: { src: `${B}bed-sunset-scope.jpg`, alt: 'The bed beneath the skylight at sunset, a spotting scope on its tripod aimed at the fjord through the glass wall', ratio: '16 / 9' } as Photo,
  /** Skylight frame 3: the aurora, directly overhead, from the bed. */
  auroraSkylight: { src: `${B}aurora-skylight.jpg`, alt: 'Green aurora seen directly overhead through the skylight above the bed, more colour glowing in the glass wall beyond', ratio: '3 / 2' } as Photo,
  /** Skylight frame 2: winter sun, low over the shore ice. */
  bedWinter: { src: `${B}bed-winter.jpg`, alt: 'A low winter sun over a snow-covered shore, seen through the skylight and glass wall from the pillow', ratio: '3 / 2' } as Photo,
  /** Interior lead: pendant globes hanging under the skylight glass. */
  skylightPendants: { src: `${B}skylight-pendants.jpg`, alt: 'Three amber pendant lights hanging from the skylight frame, the fjord glowing gold beyond the glass', ratio: '3 / 2' } as Photo,
  /** Interior: the blue velvet bed. */
  interiorVelvet: { src: `${B}interior-velvet.jpg`, alt: 'The blue velvet bed against the dark timber wall, the kitchenette and pendant lights beyond', ratio: '3 / 2' } as Photo,
  /** Interior: the kitchenette, sea framed in the splashback window. */
  kitchenette: { src: `${B}kitchenette.jpg`, alt: 'The kitchenette’s stone counter and copper tap, the fjord framed in the window over the sink', ratio: '3 / 2' } as Photo,
  /** Interior: the river-stone basin. */
  stoneBasin: { src: `${B}stone-basin.jpg`, alt: 'A raw river-stone basin and a backlit round mirror in the bathroom', ratio: '3 / 2' } as Photo,
  /** Two cabins, distant, autumn. */
  twoCabinsAutumn: { src: `${B}two-cabins-autumn.jpg`, alt: 'Both cabins standing small and dark across the autumn moor at sunset', ratio: '3 / 2' } as Photo,
  /** THE SHORE panorama: shot past the room’s own window edge. */
  frostDawnEdge: { src: `${B}frost-dawn-edge.jpg`, alt: 'Looking out past the room’s black window edge at a frosted shore and a low dawn sun', ratio: '3 / 2' } as Photo,
  /** THE flagship: the mirror wall lit solid gold at sunset. */
  sunsetScreen: { src: `${B}sunset-screen.jpg`, alt: 'The mirror wall glowing solid gold at sunset, holding the sky like a lit screen', ratio: '3 / 2' } as Photo,
  /** Two cabins, close detail, summer. */
  twoCabinsSummer: { src: `${B}two-cabins-summer.jpg`, alt: 'The cabin’s black cladding and mirror wall in summer, a second timber-clad wall standing just behind it', ratio: '3 / 2' } as Photo,
  /** Fjaran: sheep in the yard, the fjord behind. */
  sheepFjord: { src: `${B}sheep-fjord.jpg`, alt: 'Two sheep in the yard beside the cabin, the fjord and hills spreading out behind them', ratio: '3 / 2' } as Photo,
  /** Fjaran: the sun setting into the fjord. */
  fjordGold: { src: `${B}fjord-gold.jpg`, alt: 'The sun setting into the fjord, its light laid across the water in a single gold band', ratio: '3 / 2' } as Photo,
  /** Guests: a guest under the full sweep of the aurora. */
  auroraPerson: { src: `${B}aurora-person.jpg`, alt: 'A guest standing in silhouette under a full sweep of green and violet aurora', ratio: '3 / 2' } as Photo,
  /** Closing: the aurora curling over the dark fjord water. */
  auroraWhirl: { src: `${B}aurora-whirl.jpg`, alt: 'The aurora curling directly over the dark fjord water', ratio: '3 / 2' } as Photo,
  /** Transition: the cabin under an incoming weather front. */
  weatherWall: { src: `${B}weather-wall.jpg`, alt: 'The cabin under a heavy blue-grey weather front rolling in off the sea', ratio: '16 / 9' } as Photo,
} as const

export const HOST = {
  names: 'Esther & Pierre',
  listedAs: 'Esther',
  superhost: true,
  yearsHosting: 2,
  rating: 5.0,
  reviewCount: 61,
  badge: 'Guest favorite',
}

/** Verbatim guest quotes, attributed the way Airbnb displays them. */
export const REVIEW_QUOTES = [
  {
    quote: 'The location is phenomenal - so special that part of me wants to keep it a secret!',
    author: 'Alina Gabriela',
    when: 'July 2026',
  },
  {
    quote: 'We could see the northern lights from bed.',
    author: 'Ben',
    when: 'January 2026',
  },
  {
    quote: 'As architects, we fully appreciated the streamlined, efficient space made with high quality materials, fixtures, and finishes.',
    author: 'Anne',
    when: 'May 2026',
  },
  {
    quote: 'Probably our most memorable stay during the whole of our tour of Iceland.',
    author: 'Peter',
    when: 'June 2026',
  },
] as const

/** Connie's line carries the tide section; kept separate from the quote wall. */
export const TIDE_QUOTE = {
  quote: 'We watched the tide roll in and out, and saw the seals playing constantly just off shore.',
  author: 'Connie',
  when: 'May 2026',
}

/** From the listing's own "Guest reviews mention" counts. Top five, real numbers. */
export const REVIEW_THEMES = [
  { theme: 'View', mentions: 32 },
  { theme: 'Location', mentions: 23 },
  { theme: 'Hospitality', mentions: 21 },
  { theme: 'Indoor spaces', mentions: 15 },
  { theme: 'Decor', mentions: 12 },
] as const

/** Practical facts, each from the listing. */
export const FACTS = {
  guests: 2,
  bed: '1 double bed, 160 × 200 cm, directly beneath the skylight',
  baths: 1,
  checkIn: 'Self check-in, keypad',
  pets: 'Pets welcome',
  parking: 'Free parking',
  wifi: '5G-based wifi',
  distanceReykjavik: '2h from Reykjavík',
  distanceKeflavik: '2h40 from Keflavík Airport',
  ringRoad: '30 min detour off Ring Road 1',
}

/** The three marks a real spotting scope finds from this doorstep. */
export const SHORE_MARKS = [
  {
    id: 'selir',
    name: 'Selir',
    en: 'Seals',
    x: 0.15,
    y: 0.8,
    note: 'Seals are seen from the front door at low tide.',
  },
  {
    id: 'hafoern',
    name: 'Haförn',
    en: 'Sea eagle',
    x: 0.47,
    y: 0.2,
    note: 'Sea eagles pass over the fjord, seen from this same door.',
  },
  {
    id: 'husid',
    name: 'Húsið',
    en: 'The cabin',
    x: 0.79,
    y: 0.46,
    note: 'The cabin itself, out on the moor.',
  },
] as const

/** THE SKYLIGHT passage: their three real skies, in scrub order. */
export const SKYLIGHT_FRAMES = [
  {
    photo: PHOTO.bedSunsetScope,
    label: 'Sunset',
    caption: 'The scope waits by the glass, aimed at the fjord.',
  },
  {
    photo: PHOTO.bedWinter,
    label: 'Winter noon',
    caption: 'A low sun crosses the shore ice, seen from the pillow.',
  },
  {
    photo: PHOTO.auroraSkylight,
    label: 'Aurora',
    caption: '“We could see the northern lights from bed.”',
    quoteAuthor: 'Ben',
    quoteWhen: 'January 2026',
  },
] as const

/** The section's only recurring structural label: the tide, not day-phases. */
export const TIDE = {
  low: { is: 'Fjara', en: 'Low tide' },
  high: { is: 'Flóð', en: 'High tide' },
}

/** The honest note on the second, identical cabin: their own listing text. */
export const SISTER_CABIN_NOTE =
  'The identical cabin next door adds one thing this one doesn’t: a private hot tub. Esther and Pierre’s own description of it.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Mystic Light Lodge (Mirror Cabin)',
  description:
    'A mirror-glass cabin directly on the shore of Hvammsfjörður, West Iceland, with a skylight over the bed and seals and sea eagles at the door.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Búðardalur, Dalabyggð',
    addressRegion: 'Vesturland',
    addressCountry: 'IS',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 5.0,
    reviewCount: 61,
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Bay view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Sea view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Pets allowed', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
  ],
}
