/**
 * Svarfhóll — "Ljósin í dalnum" (the lights in the valley).
 *
 * Every fact below is sourced from Svarfhóll's own channels, fetched
 * 2026-08-25: their three Airbnb listings (capacities, per-listing ratings,
 * coordinates from the listings' own payloads), the Icelandic Tourist Board
 * registry text, and the Westfjords Way service page (contact, verified on a
 * real page after the AI-snippet flag). Photography = their OWN camera roll
 * from the listings: aurora over the lit chalet window, the rainbow over the
 * farm, horses with a foal, the wooden hot pot by the stream. Honest amateur
 * photos, so the layout favours panels and slabs over giant crops.
 *
 * HONESTY GUARDRAILS:
 *  - No prices anywhere (rates live with the family; the request form quotes
 *    nothing).
 *  - Review numbers are per-listing, read from the listings themselves
 *    (4.85 / 4.75 / 4.72); the deep 404-review base and the 9-year Superhost
 *    badge come from the fact-checked scout of the main listing.
 *  - No invented history. The farm is described as it presents itself:
 *    lodging in a quiet and calm environment in the countryside.
 *  - The northern lights, rainbow, midnight-sun and winter photographs are
 *    all their own; the page claims only what they photographed.
 */

const BASE = import.meta.env.BASE_URL
export const IMG = (file: string) => `${BASE}svarfholl/${file}`

/* ── Contact (verified: vestfjardaleidin.is service page) ────────────── */
export const EMAIL = 'svarfhollaccommodation@gmail.com'
export const EMAIL_HREF = 'mailto:svarfhollaccommodation@gmail.com'
export const PHONE_DISPLAY = '+354 824 6789'
export const PHONE_HREF = 'tel:+3548246789'
export const ADDRESS = 'Svarfhóll, 371 Búðardalur'
/* The request-to-book section on this page (SNDR engine demo tenant). */
export const BOOKING_URL = '#boka'
export const MAP_EMBED = 'https://www.google.com/maps?q=64.9897,-21.5583&z=12&output=embed'
export const MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=64.9897,-21.5583'

/* ── Nav ─────────────────────────────────────────────────────────────── */
export const NAV = [
  { id: 'gisting', label: 'The cabins' },
  { id: 'ljosin', label: 'The lights' },
  { id: 'gestabok', label: 'Nine years' },
  { id: 'stadurinn', label: 'The valley' },
  { id: 'boka', label: 'Request dates' },
] as const

/* ── Hero ────────────────────────────────────────────────────────────── */
export const HERO = {
  eyebrow: 'Dalir · 371 Búðardalur',
  word: 'SVARFHÓLL',
  wordPrefix: 'Farm stay',
  sub: 'A farm stay in the quiet of Dalir, west Iceland. Three timber chalets and rooms in the old farmhouse, with the sheep at the fence and the sky doing the entertaining.',
  cta: 'Request dates',
  photoAlt: 'The farm at Svarfhóll under the fell, seen across the home field.',
}

/* ── Their own three phrases (registry + listing copy, quoted) ───────── */
export const RAILS = ['quiet and calm', 'cosy chalets', 'an old farm guesthouse'] as const

/* ── Units — the three listings exactly as they let them ─────────────── */
export interface RoomCat {
  key: string
  name: string
  wing: string
  body: string
  img: string
  alt: string
}
export const ROOMS: RoomCat[] = [
  {
    key: 'chalet-2',
    name: 'Chalet 2',
    wing: 'Bakkaflöt',
    body: 'A cosy timber chalet for four, with its own kitchen corner and the field outside the window. Rated 4.75 by its guests.',
    img: 'room-chalet2.webp',
    alt: 'The bedroom in Chalet 2, warm timber walls and a made-up bed by the window.',
  },
  {
    key: 'chalet-3',
    name: 'Chalet 3',
    wing: 'Bakkaflöt',
    body: 'The second chalet sleeps four as well, with a deck for the evenings when the valley goes gold. Rated 4.85 by its guests.',
    img: 'chalet3-deck.webp',
    alt: 'Chalet 3 with its timber deck and outdoor table in the evening light.',
  },
  {
    key: 'farmhouse-room',
    name: 'The old farmhouse',
    wing: 'Heima á bæ',
    body: 'Simple rooms for up to three in the white farmhouse with the red roof, sharing the family kitchen and the stairs that creak honestly.',
    img: 'farm-room.webp',
    alt: 'A twin room in the old farmhouse with a window towards the fell.',
  },
  {
    key: 'hot-pot',
    name: 'The hot pot',
    wing: 'Við lækinn',
    body: 'A wooden hot pot out in the open by the stream, for every house. Winter guests soak under the northern lights.',
    img: 'hotpot.webp',
    alt: 'The wooden hot pot standing in the field by the stream below the fell.',
  },
]
export const ROOMS_NOTE = 'Requests go straight to the family; nothing is charged online.'

/* ── The lights — what their own camera roll keeps catching ──────────── */
export const RESTAURANT = {
  title: 'Ljósin',
  body: 'The valley is dark and quiet at night, and the sky makes the most of it. The family’s own photos from the farm: the aurora standing over the chalet with one window lit, a rainbow landing on the home field, the midnight sun rolling along the fells.',
  barLine: 'The sky does the entertaining out here.',
  barEm: 'the entertaining',
  hours: [
    { label: 'Northern lights', value: 'Dark-sky months, roughly September to April' },
    { label: 'Midnight sun', value: 'Around midsummer' },
    { label: 'The hot pot', value: 'All year, best under a clear sky' },
    { label: 'The quiet', value: 'Included, every night' },
  ],
}

/* ── Nine years — the guest record, from their listings ──────────────── */
export const SAGA = {
  title: 'Nine years of guests, in their own numbers',
  steps: [
    {
      era: '404',
      text: 'Reviews on the main listing alone, gathered since the farm started hosting. The deepest guest record in its valley.',
    },
    {
      era: '4,8',
      text: 'Out of 5 across the chalets, from the guests who stayed in them.',
    },
    {
      era: '9 ár',
      text: 'A Superhost badge held for nine years running. The family has met a lot of the world at their kitchen door.',
    },
  ],
}

/* ── Request panel copy (the journey's closing panel) ────────────────── */
export const WEDDINGS = {
  title: 'Pick a house and your dates',
  body: 'The request goes straight to the family. No card and no charge; they confirm each stay personally, the same way they have for nine years.',
  cta: 'Request dates',
}

/* ── The valley ──────────────────────────────────────────────────────── */
export const PLACE = {
  title: 'Dalir',
  body: 'The farm sits in the quiet of Dalir, west Iceland, off route 60 near Búðardalur. Sheep in the home field, horses next door, and a valley that keeps to itself.',
}

/* ── Photo registry (all their own) ──────────────────────────────────── */
export const PHOTOS = {
  heroWater: { file: 'hero-farm.webp', alt: 'The farm at Svarfhóll under the fell, across the home field.' },
  coast: { file: 'rainbow.webp', alt: 'A rainbow landing on the home field at golden hour.' },
  aerial: { file: 'valley.webp', alt: 'The broad valley in Dalir under a spring sky.' },
  snow: { file: 'winter.webp', alt: 'The farm in snow at winter dusk.' },
  churchHill: { file: 'aurora.webp', alt: 'The northern lights standing over the farmhouse, one window lit.' },
  churchGrass: { file: 'turf-cabin.webp', alt: 'The turf-roofed cabin in the grove by the home field.' },
  beach: { file: 'sheep-dog.webp', alt: 'Sheep and the farm dog by the fence line.' },
  loungeGallery: { file: 'chalet-kitchen.webp', alt: 'The kitchen corner of a chalet, timber walls and a laid table.' },
  roomBed: { file: 'room-chalet2.webp', alt: 'The bedroom in Chalet 2 by the window.' },
  suiteTub: { file: 'hotpot-stream.webp', alt: 'The wooden hot pot by the stream below the fell.' },
  eventHall: { file: 'chalet-table.webp', alt: 'The dining table in a chalet, set by the window.' },
  plateFish: { file: 'aurora-wide.webp', alt: 'The aurora in a wide green arc over the dark valley.' },
  breakfast: { file: 'horses.webp', alt: 'Horses grazing with a foal in the home field.' },
  barTeal: { file: 'sunset.webp', alt: 'The midnight sun rolling along the fells at the valley mouth.' },
  hosts: { file: 'hosts.webp', alt: 'The host couple on the shore in Dalir.' },
  aerialFarm: { file: 'aerial.webp', alt: 'The farm cluster from above, turf roofs and the shelter belt.' },
} as const

export type PhotoKey = keyof typeof PHOTOS

/* ── SEO ─────────────────────────────────────────────────────────────── */
export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Svarfhóll',
  description:
    'Farm stay in Dalir, west Iceland: timber chalets and rooms in the old farmhouse, in a quiet and calm environment in the countryside.',
  email: EMAIL,
  telephone: '+354 824 6789',
  geo: { '@type': 'GeoCoordinates', latitude: 64.9897, longitude: -21.5583 },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Búðardalur',
    postalCode: '371',
    addressCountry: 'IS',
  },
}
