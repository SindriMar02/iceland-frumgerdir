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
