/**
 * Iceland Luxury Lodges — „Húsin við vötnin" (The houses on the lakes).
 * Every fact below was read off the client's own pages or their own OTA
 * listings on 2026-08-14/15 — see company.ts audit for sources.
 * English-first: their whole market is foreign travellers and their own
 * site is English-only.
 */

const B = `${import.meta.env.BASE_URL}icelandluxurylodges`

export const EMAIL = 'signy@icelandluxurylodges.com'
export const EMAIL_HREF = 'mailto:signy@icelandluxurylodges.com'
export const PHONE_DISPLAY = '+354 822 2202'
export const PHONE_HREF = 'tel:+3548222202'
export const ADDRESS = 'Miðengi 17, 800 Selfoss, Iceland'
export const INSTAGRAM = 'https://instagram.com/icelandluxurylodges'
export const FACEBOOK = 'https://facebook.com/icelandluxurylodges'

export const IMG = {
  heroEstate: `${B}/hero-estate.jpg`,
  lodgeExterior: `${B}/lodge-exterior.jpg`,
  lodgeWide: `${B}/lodge-wide.jpg`,
  lodgeSuite: `${B}/lodge-suite.jpg`,
  lodgeSpa: `${B}/lodge-spa.jpg`,
  lodgeSauna: `${B}/lodge-sauna.jpg`,
  lodgeGameroom: `${B}/lodge-gameroom.jpg`,
  lodgeGym: `${B}/lodge-gym.jpg`,
  lodgeInt2: `${B}/lodge-int-2.jpg`,
  lodgeInt3: `${B}/lodge-int-3.jpg`,
  lodgeInt4: `${B}/lodge-int-4.jpg`,
  lodgeFamily: `${B}/lodge-family.jpg`,
  villa1: `${B}/villa-1.jpg`,
  villa2: `${B}/villa-2.jpg`,
  villa3: `${B}/villa-3.jpg`,
  villa4: `${B}/villa-4.jpg`,
  villa5: `${B}/villa-5.jpg`,
  villa6: `${B}/villa-6.jpg`,
  aslundurHouse: `${B}/aslundur-house.jpg`,
  aslundurPatio: `${B}/aslundur-patio.jpg`,
  aslundurDining: `${B}/aslundur-dining.jpg`,
  aslundurLiving: `${B}/aslundur-living.jpg`,
  aslundurTerrace: `${B}/aslundur-terrace.jpg`,
  aslundurMaster: `${B}/aslundur-master.jpg`,
  /* Úlfljótsskáli's own verified Vrbo photograph (the fire-pit deck with the
     hot tub), relit to night with an aurora and the guests removed. The
     architecture, deck, fire pit, tub and planters are untouched — only the
     hour and the sky changed. It exists because Shawn R.'s review on that
     listing says he watched the northern lights from that hot tub, and no
     photograph of that night exists. The loop is palindromed, so it has no
     seam; the generated camera drifted despite being asked to stay locked,
     and the reversal turns that drift into a slow breath instead of a jump. */
  auroraStill: `${B}/aurora-night.jpg`,
  auroraFilm: `${B}/aurora-night.mp4`,
}

export const NAV = [
  { id: 'husin', label: 'The houses' },
  { id: 'ulfljotsskali', label: 'Úlfljótsskáli' },
  { id: 'alftavik', label: 'Álftavík' },
  { id: 'aslundur', label: 'Áslundur' },
  { id: 'bokun', label: 'Enquire' },
]

export const HERO = {
  word: 'Iceland Luxury Lodges',
  lines: ['Iceland', 'Luxury Lodges'],
  sub: 'Four private houses on the lakes of the Golden Circle. One family, one key each.',
}

export const STATEMENT = {
  lead: 'Still water carries the whole collection.',
  body:
    'Úlfljótsskáli stands by Úlfljótsvatn, Álftavík and Áslundur on the shore of Álftavatn, and a fourth key opens an apartment in Reykjavík. Each house is let whole, run by the same family, and reached inside an hour from the city.',
}

/** The fork. Capacity is the orienting number on each door. */
export const DOORS = [
  {
    id: 'ulfljotsskali',
    name: 'Úlfljótsskáli',
    kind: 'The lodge',
    sleeps: 'Sleeps 19',
    img: 'lodgeExterior',
    alt: 'Úlfljótsskáli at dusk, hot tub and firepit on the deck',
  },
  {
    id: 'alftavik',
    name: 'Álftavík',
    kind: 'The lakefront villa',
    sleeps: 'Sleeps 12',
    img: 'villa1',
    alt: 'Álftavík villa on the shore of Álftavatn',
  },
  {
    id: 'aslundur',
    name: 'Áslundur',
    kind: 'The lake house',
    sleeps: 'Sleeps 8',
    img: 'aslundurHouse',
    alt: 'Áslundur lake house at Álftavatn',
  },
]

export interface Chapter {
  id: string
  ord: string
  name: string
  water: string
  lead: string
  body: string
  facts: { n: string; l: string }[]
  amenities: string[]
  photos: { img: keyof typeof IMG; alt: string; wide?: boolean }[]
  chip?: { score: string; source: string }
}

/**
 * Facts per house, verbatim-sourced:
 * — Úlfljótsskáli: their own /ulfljotsskali/ page ("10 bedrooms - sleeps 19
 *   guests", "Bathrooms: 9 full, 1 half", amenity list, "Suitable for small
 *   events and weddings").
 * — Álftavík: their own /alftavik/ page + the villa's live OTA listing
 *   (170 m², 4 bedrooms, 8–12 guests, infinity hot tub, panorama sauna,
 *   black sand beach, in/outdoor fireplaces, firepit on the beach,
 *   ~50 minutes from Reykjavík; Airbnb 4.94/162).
 * — Áslundur: their own /aslundur/ page + Vrbo listing (4 bedrooms,
 *   2½ baths, hot tub, fireplace, sandy beach, mountain view).
 */
export const CHAPTERS: Chapter[] = [
  {
    id: 'ulfljotsskali',
    ord: 'I',
    name: 'Úlfljótsskáli',
    water: 'by Úlfljótsvatn',
    lead: 'A ten-bedroom lodge in the heart of the Golden Circle.',
    body:
      'The whole house comes with the key: a high-ceilinged hall for dining and long evenings, a spa wing with sauna and relaxation lounge, a gym, a game room, and a large hot tub under the open sky. Built for families and small groups, and quietly good at weddings.',
    facts: [
      { n: '10', l: 'bedrooms' },
      { n: '19', l: 'guests' },
      { n: '9½', l: 'bathrooms' },
    ],
    amenities: [
      'High-ceiling hall with bar and dining',
      'Sauna and relaxation lounge',
      'Gym',
      'Game room',
      'Large outdoor hot tub',
      'Fireplace and outdoor firepit',
    ],
    photos: [
      { img: 'lodgeWide', alt: 'The bar and dining hall', wide: true },
      { img: 'lodgeSuite', alt: 'Master suite' },
      { img: 'lodgeSpa', alt: 'Spa and sauna lounge' },
      { img: 'lodgeSauna', alt: 'The sauna' },
      { img: 'lodgeGameroom', alt: 'Game room' },
      { img: 'lodgeGym', alt: 'Gym' },
      { img: 'lodgeFamily', alt: 'En-suite bathroom of the family bedroom' },
    ],
  },
  {
    id: 'alftavik',
    ord: 'II',
    name: 'Álftavík',
    water: 'on Álftavatn',
    lead: 'The infinity hot tub meets the surface of the lake.',
    body:
      'A modern 170 m² villa on the shore of Álftavatn, fifty minutes from Reykjavík. The deck carries an infinity hot tub set flush against the waterline and a glass-walled panorama sauna facing the lake. Below the house: a black sand beach with its own firepit.',
    facts: [
      { n: '4', l: 'bedrooms' },
      { n: '12', l: 'guests' },
      { n: '170', l: 'm²' },
    ],
    amenities: [
      'Infinity hot tub on the waterline',
      'Panorama glass sauna',
      'Black sand beach with firepit',
      'Indoor and outdoor fireplaces',
      'Three bathrooms',
      '50 minutes from Reykjavík',
    ],
    photos: [
      { img: 'villa2', alt: 'Álftavík living space with lake view', wide: true },
      { img: 'villa3', alt: 'The villa interior' },
      { img: 'villa4', alt: 'Bedroom facing the lake' },
      { img: 'villa5', alt: 'The deck at dusk' },
      { img: 'villa6', alt: 'The shore below the villa' },
    ],
    chip: { score: '4.94 of 5 · 162 reviews', source: 'Airbnb, Top guest favorite' },
  },
  {
    id: 'aslundur',
    ord: 'III',
    name: 'Áslundur',
    water: 'on Álftavatn',
    lead: 'The quiet one, with a sandy beach and the mountain across the water.',
    body:
      'Four bedrooms on the shore of the same lake: hot tub on the patio, fireplace inside, and a beach below the house that ends in open water. The view runs straight across Álftavatn to the mountain on the far side.',
    facts: [
      { n: '4', l: 'bedrooms' },
      { n: '8', l: 'guests' },
      { n: '2½', l: 'bathrooms' },
    ],
    amenities: [
      'Hot tub on the patio',
      'Fireplace',
      'Sandy lakefront beach',
      'Mountain view across the lake',
      'Full kitchen and dining for the house',
    ],
    photos: [
      { img: 'aslundurPatio', alt: 'Patio and hot tub', wide: true },
      { img: 'aslundurLiving', alt: 'Living room with the loft above and the fireplace lit' },
      { img: 'aslundurDining', alt: 'Dining table facing Álftavatn through the glass' },
      { img: 'aslundurTerrace', alt: 'Covered terrace looking across the lake to the mountain' },
      { img: 'aslundurMaster', alt: 'Master bedroom with robes laid out' },
    ],
  },
]

/** The fourth key: no photography exists for it on their site, so it stays a text card — honest. */
export const FOURTH_KEY = {
  name: 'The Art Collector’s Apartment',
  place: 'Reykjavík',
  body: 'The city key of the collection: a private apartment in Reykjavík for the nights before and after the lake. Ask us for details and dates.',
}

/**
 * REVIEWS — REAL, quoted verbatim from their own Vrbo listing for Úlfljótsskáli
 * ("10 bedroom Luxury Lodge with a Hot Tub, Spa, Sauna, Gym and Game Room",
 * vrbo.com/3969806ha), read 2026-08-16. Confirmed theirs by the reviews
 * themselves, which name the hosts: Jill B. writes "Signy and her sister Sigyn
 * were wonderful to deal with" — so the business is run by TWO sisters, which
 * our copy did not previously say.
 *
 * Verified on the listing the same day: 10/10 Exceptional across 28 reviews,
 * with every sub-score at 10/10 — cleanliness, check-in, communication,
 * location and listing accuracy. There is no rating below 10 on the histogram.
 *
 * Long reviews are cut at a sentence boundary, never paraphrased and never
 * completed by us. Joshua S. is retained from the ÁLFTAVÍK listing and is
 * labelled as such, because this is an umbrella of three houses and the
 * flagship's reviews should not be made to speak for the others.
 *
 * What guests actually praise, in order of frequency: the host (by name), the
 * chef and guide she arranges, the hot tub, and the common areas for big
 * groups. That is the real product, and the page should say so.
 */
export const REVIEWS = {
  score: '10/10',
  count: '28 reviews',
  source: 'Vrbo',
  sourceNote:
    'Real reviews, quoted verbatim from your Vrbo listing on 16 August 2026, where Úlfljótsskáli holds 10/10 across 28 reviews with every sub-score at 10. On your own site they would sit here, on your own domain, working for you instead of for Vrbo.',
  /* Each quote is ONE sentence, cut verbatim at a sentence boundary from a
     longer review — never paraphrased, never stitched from two places. Set at
     display size, a 40-word Vrbo review overflows its own section and the
     words scatter; one sentence is also simply the better pull-quote. The
     full reviews are on the listing, and the note below says where. */
  quotes: [
    {
      text: 'We were able to see the Northern Lights from the hot tub.',
      name: 'Shawn R.',
      meta: 'Úlfljótsskáli · Vrbo, November 2024 · 10/10',
    },
    {
      text: 'This was the perfect place to bring our family to celebrate our wedding.',
      name: 'Carrie S.',
      meta: 'Úlfljótsskáli · Vrbo, May 2025 · 10/10',
    },
    {
      text: 'Our stay at this property was absolutely incredible — the house itself is simply beyond nice.',
      name: 'Patricia P.',
      meta: 'Úlfljótsskáli · Vrbo, March 2026 · 10/10',
    },
    {
      text: 'The common areas are extremely well designed for a large gathering, with everything you need provided.',
      name: 'Blair B.',
      meta: 'Úlfljótsskáli · Vrbo, January 2025 · 10/10',
    },
    {
      text: 'Amazing stay at a wonderful property.',
      name: 'Joshua S.',
      meta: 'Álftavík · Vrbo, July 2025 · 10/10',
    },
  ],
}

export const BOOKING = {
  title: 'Ask for a house',
  body: 'Tell us which house, your dates and your party. We reply personally with availability and a price. No card, no charge, nothing is booked yet.',
  properties: ['Úlfljótsskáli — the lodge', 'Álftavík — the lakefront villa', 'Áslundur — the lake house', 'The Art Collector’s Apartment'],
  success: 'Thank you. Your enquiry is with us and we answer personally, usually within a day.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Iceland Luxury Lodges',
      url: 'https://icelandluxurylodges.com',
      email: EMAIL,
      telephone: '+3548222202',
      address: { '@type': 'PostalAddress', streetAddress: 'Miðengi 17', postalCode: '800', addressLocality: 'Selfoss', addressCountry: 'IS' },
      sameAs: [INSTAGRAM, FACEBOOK],
    },
    {
      '@type': 'LodgingBusiness',
      name: 'Úlfljótsskáli Luxury Lodge',
      description: '10-bedroom private lodge in the Golden Circle, sleeps 19, with sauna, gym, game room and large outdoor hot tub.',
      address: { '@type': 'PostalAddress', addressLocality: 'Úlfljótsvatn, 805 Selfoss', addressCountry: 'IS' },
      parentOrganization: { '@type': 'Organization', name: 'Iceland Luxury Lodges' },
    },
    {
      '@type': 'LodgingBusiness',
      name: 'Álftavík Lakefront Villa',
      description: '170 m² lakefront villa on Álftavatn with infinity hot tub, panorama sauna and private black sand beach. Sleeps up to 12.',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.94', reviewCount: '162', bestRating: '5' },
      address: { '@type': 'PostalAddress', addressLocality: 'Grímsnes- og Grafningshreppur', addressCountry: 'IS' },
      parentOrganization: { '@type': 'Organization', name: 'Iceland Luxury Lodges' },
    },
    {
      '@type': 'LodgingBusiness',
      name: 'Áslundur Lake House',
      description: '4-bedroom lake house on Álftavatn with hot tub, fireplace and a sandy lakefront beach.',
      address: { '@type': 'PostalAddress', addressLocality: 'Grímsnes- og Grafningshreppur', addressCountry: 'IS' },
      parentOrganization: { '@type': 'Organization', name: 'Iceland Luxury Lodges' },
    },
  ],
}
