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
  aslundurBath: `${B}/aslundur-bath.jpg`,
  aslundurTwin: `${B}/aslundur-twin.jpg`,
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
      { img: 'aslundurDining', alt: 'Dining and kitchen' },
      { img: 'aslundurLiving', alt: 'Dining and living room' },
      { img: 'aslundurBath', alt: 'Suite bathroom' },
      { img: 'aslundurTwin', alt: 'Twin bedroom with full bathroom' },
    ],
  },
]

/** The fourth key: no photography exists for it on their site, so it stays a text card — honest. */
export const FOURTH_KEY = {
  name: 'The Art Collector’s Apartment',
  place: 'Reykjavík',
  body: 'The city key of the collection: a private apartment in Reykjavík for the nights before and after the lake. Ask us for details and dates.',
}

export const QUOTE = {
  text: 'Amazing stay at a wonderful property.',
  name: 'Joshua S.',
  meta: 'Vrbo guest review of Álftavík, July 2025, rated 10/10',
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
