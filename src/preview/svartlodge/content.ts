/**
 * Real content from svartlodge.is (Home, Location and Surroundings pages, read
 * through the served HTML on 2026-09-02), the Expedia listing (read 2026-09-01)
 * and the site's own Wix media originals (26 frames, 3000 to 9504 px, 18
 * staged). The silhouette path is MEASURED from the sunset frame's own
 * pixels: for each column, the first row where the sky gives way to the black
 * cladding, in the frame's own 2160x1440 space. Never eyeballed.
 * NO owner names on the page. NO prices. NO aurora imagery (none in their set).
 */

export const COMPANY = {
  name: 'Svart Lodge',
  legal: 'Lerkilundur ehf.',
  kt: '611119-1780',
  email: 'info@svartlodge.is',
  phone: '+354 694 6060',
  phoneHref: 'tel:+3546946060',
  instagram: 'https://www.instagram.com/svartlodgeiceland/',
  maps: 'https://www.google.com/maps/place/Svart+Lodge/@65.7509679,-18.1614945,419m/',
}

const B = import.meta.env.BASE_URL + 'svartlodge/'

export const srcSet = (src: string) =>
  `${src.replace(/\.jpg$/, '-800.jpg')} 800w, ${src} 1800w`

/**
 * The black form, traced from the sunset photograph (image space 2160x1440):
 * the house stands on the right of the frame, its roof rising out of the top
 * edge, the sea and the steam of the pool to the left. Loader, hero clip and
 * the shore band share it. HORIZON is the sea line in the same space: the hero
 * releases from there, not from the ground.
 */
export const SILHOUETTE = {
  viewBox: '0 0 2160 1440',
  path: 'M 1428 1440 L 1428 788 L 1440 756 L 1452 728 L 1464 696 L 1476 664 L 1488 628 L 1500 600 L 1512 568 L 1524 536 L 1536 424 L 1548 392 L 1560 356 L 1572 320 L 1584 288 L 1596 260 L 1608 248 L 1620 244 L 1632 240 L 1644 236 L 1656 228 L 1668 224 L 1680 216 L 1692 212 L 1704 208 L 1716 200 L 1728 196 L 1740 192 L 1752 188 L 1764 180 L 1776 176 L 1788 172 L 1800 168 L 1812 164 L 1824 156 L 1836 152 L 1848 148 L 1860 144 L 1872 136 L 1884 132 L 1896 128 L 1908 124 L 1920 116 L 1932 112 L 1944 108 L 1956 104 L 1968 96 L 1980 92 L 1992 88 L 2004 64 L 2016 60 L 2028 72 L 2040 68 L 2052 60 L 2064 56 L 2076 52 L 2088 28 L 2100 40 L 2112 36 L 2124 32 L 2136 4 L 2148 20 L 2156 0 L 2160 1440 Z',
  /** where the house begins, from the left, in viewBox units */
  left: 1428,
  /** centre of the release: the house's midline on the sea horizon */
  origin: { x: 2000, y: 930 },
}

export const PHOTO = {
  sunsetHouse: { src: `${B}sunset-house.jpg`, alt: 'The black gable end of Svart Lodge at sunset, steam rising off the pool, the fjord beyond', ratio: '3 / 2' },
  shoreHouse: { src: `${B}shore-house.jpg`, alt: 'The shore of Eyjafjörður from above, the black houses in the birch at the water', ratio: '3 / 2' },
  fjordWide: { src: `${B}fjord-wide.jpg`, alt: 'Eyjafjörður from above, the fjord running south past Akureyri', ratio: '3 / 2' },
  roofsForest: { src: `${B}roofs-forest.jpg`, alt: 'The black roofs of Svart Lodge in the spruce and poplar of Hagaskógur, from above', ratio: '4 / 3' },
  shoreRocks: { src: `${B}shore-rocks.jpg`, alt: 'The rocky foreshore below the house, the fjord still and the mountains across it', ratio: '3 / 2' },
  livingFire: { src: `${B}living-fire.jpg`, alt: 'The living room at dusk, the wood stove lit, the fjord in the window', ratio: '3 / 2' },
  diningEvening: { src: `${B}dining-evening.jpg`, alt: 'The long table set for ten under the pendant lights, the fjord dark in the glass', ratio: '3 / 2' },
  bedroomPool: { src: `${B}bedroom-pool.jpg`, alt: 'A bedroom in winter, the heated pool and the frozen fjord outside the glass', ratio: '4 / 3' },
  kitchenIsland: { src: `${B}kitchen-island.jpg`, alt: 'The black oak kitchen island under the beamed ceiling', ratio: '3 / 4' },
  livingDay: { src: `${B}living-day.jpg`, alt: 'The living room by day, pale sofas against the black joinery', ratio: '4 / 3' },
  livingWide: { src: `${B}living-wide.jpg`, alt: 'The open plan from the sofas to the table', ratio: '4 / 3' },
  kitchenRow: { src: `${B}kitchen-row.jpg`, alt: 'The kitchen run with its copper pendants', ratio: '4 / 3' },
  bathShower: { src: `${B}bath-shower.jpg`, alt: 'A stone shower with the birch outside the window', ratio: '4 / 3' },
  chairWindow: { src: `${B}chair-window.jpg`, alt: 'A chair by the window, the fjord grey beyond', ratio: '4 / 5' },
  benchHall: { src: `${B}bench-hall.jpg`, alt: 'The hall bench in pale wood against the black wardrobe wall', ratio: '3 / 4' },
  bedroomFire: { src: `${B}bedroom-fire.jpg`, alt: 'A bedroom with its own stove and the window on the water', ratio: '4 / 5' },
  mirror: { src: `${B}mirror.jpg`, alt: 'A bedroom seen in the mirror', ratio: '3 / 4' },
  bedroomView: { src: `${B}bedroom-view.jpg`, alt: 'A bedroom in winter light, the pool outside', ratio: '2 / 3' },
} as const

/** Their own sentences, verbatim: the site's overview and the Expedia listing. */
export const OWN_WORDS = {
  livingSpace: 'Svart Lodge is a modern, luxurious home designed as both a living space and a high-quality villa for families, couples and small groups.',
  details: 'With an open floor plan, abundant amenities and wonderful details in every corner.',
  view: 'An amazing unrestricted sea view where whales can be seen passing by and northern lights during winter.',
  surroundings: 'Beautiful and unspoiled 180° views of Eyjafjörður and Kaldbakur mountain to the north and the bottom of the fjord to the south.',
  foreshore: 'The foreshore is a meditation itself, with either an afternoon stroll along the rocky beach or a relaxation on the veranda’s warm pool or benches.',
}

export const FACTS = {
  bedrooms: 5,
  bathrooms: 5,
  guests: 10,
  size: 'about 300 m²',
  water: 'Heated outdoor pool, sauna and a cold plunge',
  fire: 'Indoor fireplace',
  view: '180° over Eyjafjörður and Kaldbakur',
  where: 'Hagabyggð by Glæsibær, Hörgársveit',
}

/** Distances: their own Surroundings page and the Vrbo listing, re-checked 2026-09-01. */
export const AREA = [
  { name: 'Akureyri', note: 'Downtown, the botanical garden, the restaurants.', dist: '10 min' },
  { name: 'Forest Lagoon', note: 'The geothermal baths in the forest above the fjord.', dist: '4 min' },
  { name: 'The airport', note: 'Akureyri airport, flights from Reykjavík and abroad.', dist: '8 min' },
  { name: 'Hlíðarfjall', note: 'The ski area the owners call the best in Iceland.', dist: 'Winter' },
  { name: 'Kjarnaskógur', note: 'Forest trails and sheltered Nordic skiing.', dist: 'Year round' },
] as const

/** What is real, and nothing else: the review counts as they stand. */
export const PROOF = [
  { where: 'Expedia', score: '10 of 10', count: '3 reviews' },
  { where: 'Tripadvisor', score: '5 of 5', count: '1 review' },
] as const

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Svart Lodge',
  legalName: 'Lerkilundur ehf.',
  url: 'https://www.svartlodge.is',
  email: 'info@svartlodge.is',
  telephone: '+354 694 6060',
  description:
    'A private luxury house on the shore of Eyjafjörður, ten minutes from Akureyri: five bedrooms, five bathrooms, up to ten guests, a heated outdoor pool, sauna, cold plunge and an unrestricted view of the fjord and Kaldbakur.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hagabyggð',
    addressLocality: 'Hörgársveit',
    addressRegion: 'Norðurland eystra',
    addressCountry: 'IS',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 65.7502, longitude: -18.1584 },
  numberOfRooms: 5,
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Heated outdoor pool', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Sauna', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Cold plunge', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Sea view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Fireplace', value: true },
  ],
}
