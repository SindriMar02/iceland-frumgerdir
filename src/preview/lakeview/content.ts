/**
 * Real content harvested from the live Airbnb listing (room 53609937),
 * retrieved 2026-08-04. All 29 listing photos were downloaded to
 * public/lakeview/ and individually reviewed. Nothing here is invented — see
 * [[feedback-fact-check-before-drafting]]. Source of truth: the harvest JSON
 * at scratchpad/harvest/lakeview.json, cross-read against ./DESIGN.md.
 *
 * Host naming: the listing is run by the business host "Visiting Iceland".
 * Guests consistently name a host "Omar" in their reviews (harvest JSON,
 * unaccented as written there) — the Icelandic spelling ("Ómar") is NOT
 * confirmed anywhere in the source, so this file never asserts it. The page
 * credits "Visiting Iceland" as the host of record and notes the guest-facing
 * nickname as an aside, exactly as the harvest allows.
 *
 * No licence number is displayed on the listing (LicenseTextList null) — none
 * is invented anywhere below, and the footer omits a licence line entirely
 * (unlike other previews in this repo that do have one).
 */

export const HOST = {
  businessName: 'Visiting Iceland',
  /** As guests write it in reviews. Spelling unconfirmed — see note above. */
  guestNickname: 'Omar',
  superhost: true,
  yearsHosting: 5,
  responseRate: '100%',
  respondsWithin: 'an hour',
  livesIn: 'Reykjavík',
  speaks: ['English'],
  rating: 4.96,
  reviewCount: 207,
  badges: ['Guest favorite', 'Top 5% of homes'],
  press: 'Featured in Architectural Digest, July 2025',
}

const B = import.meta.env.BASE_URL + 'lakeview/'

/**
 * Phones get the -800 set (already generated alongside every asset); desktop
 * gets the full 1200w original. Both were confirmed present on disk before
 * writing this file.
 */
export const srcSet = (src: string) =>
  `${src.replace(/\.jpg$/, '-800.jpg')} 800w, ${src} 1200w`

/** Local, vendored copies of the listing's own photography. */
export const PHOTO = {
  /** THE arrival still: gravel path down to the lake, the house catching low light. Hero poster + film source. */
  arrivalLake: { src: `${B}arrival-lake.jpg`, alt: 'The turf-roofed cabin above Úlfljótsvatn lake at golden hour, a path leading down to the water', ratio: '1 / 1' },
  /** Drone shot: the turf roof all but merges into the surrounding moss. THE finding-the-house device. */
  aerialTurf: { src: `${B}aerial-turf.jpg`, alt: 'Aerial view of the cabin, its turf roof merging into the mossy tundra, a stream curling past it', ratio: '16 / 9' },
  /** The round outdoor geothermal pool at golden hour, a guest looking out at the sunset. */
  poolSunset: { src: `${B}pool-sunset.jpg`, alt: 'The outdoor heated pool at sunset, a guest looking out over the moor as the sun sets', ratio: '4 / 5' },
  /** Same pool, snowbound: its winter twin. */
  poolWinter: { src: `${B}pool-winter.jpg`, alt: 'The same outdoor pool in winter, steaming gently in a ring of snow beside the cabin wall', ratio: '2 / 3' },
  /** THE aurora shot, seen from the bed: green curtains and stars over the frozen lake. */
  auroraBed: { src: `${B}aurora-bed.jpg`, alt: 'The northern lights over the lake and snow, seen from the bed through the gable window', ratio: '4 / 5' },
  /** Aurora from the hillside above the house, cabin lights small in the distance. */
  auroraHill: { src: `${B}aurora-hill.jpg`, alt: 'Green aurora over a snowy hillside, the cabin a small point of light in the valley below', ratio: '4 / 5' },
  /** THE interior: the bed and the freestanding tub sharing the gable window and its view. */
  bedTubGable: { src: `${B}bed-tub-gable.jpg`, alt: 'The bed and a freestanding tub sharing the same gable window over Úlfljótsvatn lake', ratio: '3 / 4' },
  /** The bath moment: the tub at the glass, lake and mountains beyond. */
  bathWide: { src: `${B}bath-wide.jpg`, alt: 'A freestanding bath at the floor-to-ceiling glass, the lake and mountains filling the window', ratio: '3 / 2' },
  /** Portrait crop of the same tub and view. */
  tubView: { src: `${B}tub-view.jpg`, alt: 'The bath seen from the doorway, the lake framed in the gable window beyond it', ratio: '2 / 3' },
  /** Sunrise flooding the bed, the moor and a distant lake glowing gold. */
  sunriseBed: { src: `${B}sunrise-bed.jpg`, alt: 'Sunrise through the gable window over the bed, the moor and a distant lake catching the light', ratio: '2 / 3' },
  /** Champagne on the bed, gable window beyond: a small staged detail. */
  champagneBed: { src: `${B}champagne-bed.jpg`, alt: 'A bottle chilling on the bed at the gable window, the lake view behind it', ratio: '2 / 3' },
  /** Kitchen and the built-in fireplace sharing the same stone wall. */
  kitchenFire: { src: `${B}kitchen-fire.jpg`, alt: 'The fireplace and kitchen sharing one stone wall, a dining table at the window beyond', ratio: '3 / 2' },
  /** Detail: stacked firewood over the lit fireplace. */
  fireplace: { src: `${B}fireplace.jpg`, alt: 'Stacked firewood set into the stone above a lit fireplace, the dining table just visible alongside', ratio: '2 / 3' },
  /** The living corner: sofa, a landscape print, snow through the gable glass. */
  livingSofa: { src: `${B}living-sofa.jpg`, alt: 'A sofa in the living corner, a landscape print on the wall, snow-covered hillside through the glass', ratio: '3 / 2' },
  /** The same corner in deep winter light. */
  livingWinter: { src: `${B}living-winter.jpg`, alt: 'The living corner in winter, pale light crossing the floor from the gable window', ratio: '4 / 5' },
  /** The gable end in summer: blue glass against a clear sky, on its mossy knoll. */
  gableSummer: { src: `${B}gable-summer.jpg`, alt: 'The gable end of the cabin in summer, its glass front holding a clear blue sky', ratio: '3 / 4' },
  /** The cabin lit up at night, lake and stars behind it. */
  nightCabin: { src: `${B}night-cabin.jpg`, alt: 'The cabin lit up at night beside the lake, stars and a bank of cloud overhead', ratio: '2 / 3' },
  /** Winter wide shot: the cabin and a neighbouring house across the frozen shoreline. */
  winterTwoHouses: { src: `${B}winter-two-houses.jpg`, alt: 'The cabin in snow beside the frozen lake, a second house visible further along the shore', ratio: '3 / 2' },
  /** Hallway to the bathroom: a round mirror catching the slatted screen and the hill beyond. */
  doorwayMirror: { src: `${B}doorway-mirror.jpg`, alt: 'The hallway to the bathroom, a round mirror reflecting a wooden slat screen and the hill outside', ratio: '4 / 5' },
  /** Bathroom basin under the round mirror. */
  basinMirror: { src: `${B}basin-mirror.jpg`, alt: 'A pedestal basin below the round bathroom mirror, folded towels on the shelving alongside', ratio: '2 / 3' },
} as const

// Verbatim guest quotes, attributed exactly as Airbnb displays them.
export const REVIEW_QUOTES = [
  { quote: 'The view! The view! The view! Pictures can’t do it justice.', author: 'Kim', when: 'April 2026' },
  { quote: 'We were lucky to see the northern lights from our own geo thermal tub and from our bed in the morning.', author: 'Tom', when: 'November 2025' },
  { quote: 'Our stay at Lakeview Retreat was pure luxury from start to finish.', author: 'Lucie', when: 'February 2026' },
  { quote: 'The view from it, especially also from the bed is unmatched.', author: 'Tanja', when: 'January 2026' },
  { quote: 'We were lucky enough to catch the aurora one night that we were there, since it was so far from any light pollution.', author: 'Hayley', when: 'January 2026' },
] as const

/** From the listing's own "Guest reviews mention" counts. Real numbers. */
export const REVIEW_THEMES = [
  { theme: 'View', mentions: 97 },
  { theme: 'Hot tub', mentions: 72 },
  { theme: 'Location', mentions: 64 },
] as const

/**
 * The Golden Circle list. Only what the harvest JSON actually supports:
 * "short drive" to Gullfoss/Geysir/Þingvellir is the listing's own phrase, the
 * two drive times are from the live search page, and the lake activities are
 * the listing's own amenity list. Kerið and Friðheimar are NOT included here:
 * DESIGN.md names them as "from guest reviews", but they do not appear
 * anywhere in the harvest JSON supplied for this build, so they are left out
 * rather than guessed at.
 */
export const GOLDEN_CIRCLE = [
  { name: 'Gullfoss, Geysir & Þingvellir', note: 'The Golden Circle’s three signature stops, all the same short drive.', dist: 'Short drive' },
  { name: 'Reykjavík', note: 'The capital, and the road to the airport.', dist: '45 min' },
  { name: 'Selfoss', note: 'The nearest town, for fuel and groceries.', dist: '15 min' },
  { name: 'Úlfljótsvatn itself', note: 'Fishing, kayaking and hiking paths start at the water’s edge.', dist: 'On site' },
] as const

/** Practical facts, each traceable to the harvest JSON. */
export const FACTS = {
  type: 'Entire cabin',
  guests: 2,
  bedrooms: 1,
  beds: '1 queen bed',
  baths: 1,
  checkIn: 'After 3:00 PM',
  checkOut: 'Before 11:00 AM',
  amenities: [
    'Lake view', 'Mountain view', 'Outdoor heated geothermal pool', 'Hot tub',
    'Fireplace', 'Kitchen', 'Wifi', 'Dedicated workspace',
  ],
  amenityCount: 52,
  location: 'Úlfljótsvatn lake, Grímsnes- og Grafningshreppur, South Iceland',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Iceland Lakeview Retreat',
  description:
    'A turf-roofed cabin above Úlfljótsvatn lake in the heart of the Golden Circle, combining Icelandic traditional housing with a modern elegance: floor-to-ceiling glass, a fireplace and an outdoor heated pool.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Úlfljótsvatn',
    addressRegion: 'Suðurland',
    addressCountry: 'IS',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.96,
    reviewCount: 207,
    // Source: the Airbnb listing, retrieved 2026-08-04.
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Lake view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Mountain view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Outdoor heated geothermal pool', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Hot tub', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Fireplace', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Dedicated workspace', value: true },
  ],
}
