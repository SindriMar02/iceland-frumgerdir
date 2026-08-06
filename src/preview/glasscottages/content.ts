/**
 * Real content harvested 2026-08-06 from the live Airbnb listing (Blár, room
 * 42164367) and glasscottages.com (home, cottages, gallery, about). All
 * photos are their own, individually reviewed on a contact sheet before
 * selection. Nothing invented — [[feedback-fact-check-before-drafting]].
 */

export const HOST = {
  name: 'Ari',
  designedBy: 'Ari, Gábor and Andrej',
  superhost: true,
  yearsHosting: 13,
  rating: 4.97,
  reviewCount: 588,
  licence: 'IG-REK-015406',
}

const B = import.meta.env.BASE_URL + 'glasscottages/'

export const srcSet = (src: string) =>
  `${src.replace(/\.jpg$/, '-800.jpg')} 800w, ${src} 1600w`

export interface Photo { src: string; alt: string; ratio: string }

export const PHOTO = {
  /** THE shot: the glass gable holding the sunset inside it at blue hour. */
  sunsetCottage: { src: `${B}sunset-cottage.jpg`, alt: 'A glass-gabled cottage at blue hour, the sunset burning inside its windows, the hot tub dark in front', ratio: '3 / 2' },
  gableStraight: { src: `${B}gable-straight.jpg`, alt: 'The glass gable straight on, the bed visible through the wall of glass', ratio: '3 / 2' },
  auroraRoof: { src: `${B}aurora-roof.jpg`, alt: 'Green aurora seen through the glass roof beams from inside the cottage', ratio: '3 / 4' },
  auroraWide: { src: `${B}aurora-wide.jpg`, alt: 'Aurora curtains over the lava field, green on the snow', ratio: '3 / 2' },
  auroraGable: { src: `${B}aurora-gable.jpg`, alt: 'The aurora standing over the glass cottage, its interior glowing warm', ratio: '3 / 2' },
  auroraCottage: { src: `${B}aurora-cottage.jpg`, alt: 'Green light over the cottage at night, stars behind', ratio: '3 / 2' },
  sunsetTub: { src: `${B}sunset-tub.jpg`, alt: 'The private hot tub beside the cottage at sunset', ratio: '3 / 2' },
  glowDusk: { src: `${B}glow-dusk.jpg`, alt: 'The cottage glowing amber against the dusk, alone in the lava field', ratio: '3 / 2' },
  silhouette: { src: `${B}silhouette.jpg`, alt: 'The dark silhouette of the glass cottage against the last light', ratio: '3 / 2' },
  bedView: { src: `${B}bed-view.jpg`, alt: 'The view from the bed through the glass roof, the lava field beyond the footboard', ratio: '3 / 2' },
  bedViewB: { src: `${B}bed-view-b.jpg`, alt: 'Lying-down view through the glass gable over the moss and lava', ratio: '3 / 2' },
  bedWhite: { src: `${B}bed-white.jpg`, alt: 'The queen bed in white linen under the glass roof', ratio: '3 / 2' },
  daybed: { src: `${B}daybed.jpg`, alt: 'The daybed by the glass wall with a sheepskin throw', ratio: '3 / 2' },
  interiorBright: { src: `${B}interior-bright.jpg`, alt: 'The bright interior: white walls, moss art, the table set before the glass wall', ratio: '3 / 2' },
  interiorNavy: { src: `${B}interior-navy.jpg`, alt: 'The bed and small table against the deep-blue wall, pendant lights above', ratio: '3 / 4' },
  kitchenDark: { src: `${B}kitchen-dark.jpg`, alt: 'The kitchenette at night, under-cabinet light on the timber wall', ratio: '3 / 2' },
  kitchenBright: { src: `${B}kitchen-bright.jpg`, alt: 'The compact kitchen in daylight, window on the field', ratio: '3 / 2' },
  lavaField: { src: `${B}lava-field.jpg`, alt: 'The lava field rolling to the horizon, the hot tub corner in the foreground', ratio: '3 / 2' },
  robes: { src: `${B}robes.jpg`, alt: 'Two guests in robes at the glass wall, looking out over the field', ratio: '3 / 4' },
  hottubDeck: { src: `${B}hottub-deck.jpg`, alt: 'The hot tub on its deck, snow on the lava beyond', ratio: '3 / 2' },
  sunstar: { src: `${B}sunstar.jpg`, alt: 'The low sun breaking as a star through the corner of the glass', ratio: '3 / 2' },
  winterWhite: { src: `${B}winter-white.jpg`, alt: 'The lava field under full snow, white to the horizon', ratio: '3 / 2' },
  sunsetMirror: { src: `${B}sunset-mirror.jpg`, alt: 'The sunset reflected across the whole glass wall', ratio: '3 / 2' },
  duskBlue: { src: `${B}dusk-blue.jpg`, alt: 'The cottage small under a deep blue dusk sky', ratio: '3 / 2' },
} as const satisfies Record<string, Photo>

/** Verbatim guest quotes, attributed as Airbnb displays them. */
export const REVIEW_QUOTES = [
  {
    quote: 'It was wild to see the Midnight Sun from the cottage. Ari was an amazing host.',
    author: 'Nick',
    when: 'June 2026',
  },
  {
    quote: 'It is peaceful, beautiful, incredibly well thought out and cozy beyond belief.',
    author: 'Ashley',
    when: 'July 2026',
  },
  {
    quote: 'We really look forward to coming back here again next winter to experience the aurora.',
    author: 'Eric',
    when: 'June 2026',
  },
  {
    quote: 'Surroundings are beautiful and it was lovely to enjoy the views while sitting in the hot tub.',
    author: 'Mira Audrey',
    when: 'June 2026',
  },
] as const

/** The two cottages. Names and framing are theirs (site + listing). */
export const COTTAGES = {
  blar: {
    id: 'blar' as const,
    name: 'Blár',
    gloss: 'Icelandic for blue',
    line: 'Its palette follows the lagoons, the glaciers and the ice caves.',
  },
  graenn: {
    id: 'graenn' as const,
    name: 'Grænn',
    gloss: 'Icelandic for green',
    line: 'Its palette follows the moss and the aurora.',
  },
}

export const CRAFT = [
  { name: 'Driftwood', line: 'The furniture is built from driftwood gathered on the beaches of Ísafjörður.' },
  { name: 'Wool', line: 'The cushions are hand-knitted and naturally dyed, with materials from a local rescue sheep farm.' },
  { name: 'Water and warmth', line: 'Pure water comes from their own well, and sunlight is the primary source of warmth.' },
  { name: 'The grounds', line: 'The 500 hectares around the cottages are kept as a wildlife haven. Hunting is prohibited.' },
] as const

export const FACTS = {
  guests: 2,
  bed: '1 queen bed',
  bath: '1 bath',
  apart: 'Two cottages, 200 metres apart',
  field: '500 hectares of lava field near Hella',
  hotTub: 'Private hot tub at each cottage',
  heating: 'Floor heating throughout',
  base: 'A base for the Golden Circle and the south coast',
  licence: 'IG-REK-015406',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Glass Cottages Iceland',
  description:
    'Two glass-walled cottages, Blár and Grænn, standing 200 metres apart in a 500-hectare lava field near Hella, South Iceland. Each sleeps two with a private hot tub, floor heating and handcrafted driftwood interiors.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Hella',
    addressRegion: 'Suðurland',
    addressCountry: 'IS',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.97,
    reviewCount: 588,
    // Source: the live Airbnb listing (Blár), 2026-08-06.
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private hot tub', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Floor heating', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Glass roof', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
  ],
}
