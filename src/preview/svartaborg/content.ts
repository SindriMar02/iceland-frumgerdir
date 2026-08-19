/**
 * Real content from svartaborg.com and the live Airbnb listing (room
 * 42879945), both read 2026-08-06, plus Booking.com (9.7 · 327). 149 photos
 * downloaded and reviewed, 30 staged. The silhouette path below is MEASURED
 * from elevation-a.jpg's own pixels (sky-contrast roofline + iterative line
 * fit; both roof edges verified on real luminance gradients per ledger #62),
 * never eyeballed.
 */

export const HOST = {
  names: 'Rósa and Snæbjörn',
  superhost: true,
  rating: 4.99,
  reviewCount: 557,
  bookingCom: { score: 9.7, reviews: 327 },
  farm: 'Rangá',
}

const B = import.meta.env.BASE_URL + 'svartaborg/'

export const srcSet = (src: string) =>
  `${src.replace(/\.jpg$/, '-800.jpg')} 800w, ${src} 1600w`

/**
 * The black form, traced from their photograph (image space 2160x1440):
 * long roof rising 5.3 degrees to the apex near the right end, then the
 * steep 74-degree gable fall. Used by the loader, the hero clip and the
 * seasons band — one geometry, three uses.
 */
export const SILHOUETTE = {
  viewBox: '0 0 2160 1440',
  path: 'M 344 1334 L 344 478 L 1559 365 L 1718 931 L 1718 1334 Z',
}

export const PHOTO = {
  houseHillside: { src: `${B}house-hillside.jpg`, alt: 'The black timber house on its green hillside, the valley open below', ratio: '3 / 2' },
  elevationA: { src: `${B}elevation-a.jpg`, alt: 'The house side-on: the long black form against the moor and sky', ratio: '3 / 2' },
  livingWood: { src: `${B}living-wood.jpg`, alt: 'The walnut-panelled living room, grey sofa under the pitched ceiling', ratio: '3 / 2' },
  bedroomMain: { src: `${B}bedroom-main.jpg`, alt: 'The bedroom, white linen against the dark timber wall', ratio: '3 / 2' },
  windowView: { src: `${B}window-view.jpg`, alt: 'The picture window holding the valley like a framed painting', ratio: '3 / 2' },
  kitchenWindow: { src: `${B}kitchen-window.jpg`, alt: 'The kitchen window over the sink, the moor beyond', ratio: '3 / 2' },
  kitchenBay: { src: `${B}kitchen-bay.jpg`, alt: 'The dining corner in the glazed bay', ratio: '3 / 2' },
  gableTubA: { src: `${B}gable-tub-a.jpg`, alt: 'The geothermal hot tub sunk into the deck against the black gable', ratio: '3 / 2' },
  tubClose: { src: `${B}tub-close.jpg`, alt: 'The hot tub close up, steam over the water', ratio: '3 / 2' },
  diningRound: { src: `${B}dining-round.jpg`, alt: 'The round dining table under the pendant light', ratio: '3 / 2' },
  bedWhite: { src: `${B}bed-white.jpg`, alt: 'White bedding, the window bright beyond', ratio: '3 / 2' },
  bathBlack: { src: `${B}bath-black.jpg`, alt: 'The black bathroom with its walk-in shower', ratio: '3 / 4' },
  aerialSnowA: { src: `${B}aerial-snow-a.jpg`, alt: 'The house alone in the white snowfield, from above', ratio: '3 / 2' },
  aerialGreen: { src: `${B}aerial-green.jpg`, alt: 'The house and hot tub from directly above in summer green', ratio: '3 / 2' },
  moorAutumn: { src: `${B}moor-autumn.jpg`, alt: 'The moor turned crimson in autumn', ratio: '3 / 2' },
  streamAutumn: { src: `${B}stream-autumn.jpg`, alt: 'A stream cutting through the autumn moor', ratio: '3 / 2' },
  ridgeWide: { src: `${B}ridge-wide.jpg`, alt: 'The house small on its ridge, the valley wide around it', ratio: '3 / 2' },
  houseTubHill: { src: `${B}house-tub-hill.jpg`, alt: 'The house and hot tub on the hillside', ratio: '3 / 2' },
  windowReflect: { src: `${B}window-reflect.jpg`, alt: 'The big window reflecting the valley back at itself', ratio: '3 / 2' },
  windowMoss: { src: `${B}window-moss.jpg`, alt: 'The corner window in the black cladding, the valley in the glass and the second house small on the hill', ratio: '2 / 3' },
  winterSide: { src: `${B}winter-side.jpg`, alt: 'The house in snow, the mirrored windows holding the white hills', ratio: '3 / 2' },
  horsesSnow: { src: `${B}horses-snow.jpg`, alt: 'Horses crossing the snow below the house', ratio: '3 / 2' },
  arrivalDrone: { src: `${B}arrival-drone.jpg`, alt: 'Arriving up the track, the house on the hill ahead', ratio: '3 / 2' },
  diningSet: { src: `${B}dining-set.jpg`, alt: 'The table set for dinner', ratio: '3 / 2' },
  bedPlant: { src: `${B}bed-plant.jpg`, alt: 'The bed under the sloped ceiling', ratio: '3 / 2' },
  rangaFarm: { src: `${B}ranga-farm.jpg`, alt: 'Rangá, the family farm below the hill', ratio: '3 / 2' },
} as const

export const REVIEW_QUOTES = [
  {
    quote: 'Completely peaceful, stunning views, and a cabin that is thoughtfully designed down to the details.',
    author: 'Léa',
    when: 'July 2026',
  },
  {
    quote: 'The stand out for me was the private geothermal hot tub. Easily my favorite spot we stayed on the ring road.',
    author: 'Valerie',
    when: 'July 2026',
  },
  {
    quote: 'Amazing place. Total highlight of the trip. Spacious house with dramatic views and amazing amenities.',
    author: 'Alex',
    when: 'July 2026',
  },
] as const

/** From their site, the listing and northiceland.is. */
export const AREA = [
  { name: 'Goðafoss', note: 'The waterfall of the gods, on the Diamond Circle.', dist: '10 min' },
  { name: 'Húsavík', note: 'Whale watching and the GeoSea baths.', dist: '20 min' },
  { name: 'Akureyri', note: 'The capital of the north.', dist: '30 min' },
  { name: 'Mývatn', note: 'The lake, the craters and the nature baths.', dist: 'Within reach' },
] as const

export const FACTS = {
  guests: 4,
  built: 'Built by the owners in 2020',
  hotTub: 'Private geothermal hot tub',
  farm: 'On the family farm Rangá',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Svartaborg',
  description:
    'Two black timber houses on a hillside above the family farm Rangá, on the Diamond Circle in North Iceland. Designed and built by the owners, with a private geothermal hot tub, ten minutes from Goðafoss.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Húsavík',
    addressRegion: 'Norðurland eystra',
    addressCountry: 'IS',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.99,
    reviewCount: 557,
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private geothermal hot tub', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Mountain view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
  ],
}
