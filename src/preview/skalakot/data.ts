/**
 * Skálakot Manor Hotel — "Sjöunda kynslóðin" (the seventh generation).
 * Exact structural clone of the Búðir build (see budir/data.ts + the
 * budir-design-system memory spec) reskinned with Skálakot's own material.
 *
 * Every fact below is sourced from skalakot.is's own pages (the-family-farm,
 * rooms/*, restaurant, spa, events, location), fetched 2026-07-25, or from
 * the photos themselves. Photography = the hotel's OWN shoots (wp-content
 * originals up to 4720px, harvested + vetted on a contact sheet).
 *
 * HONESTY GUARDRAILS:
 *  - No room prices (their godo.is booking engine carries live rates).
 *  - History only as THEY state it: seven generations, the 1985 takeover by
 *    Guðmundur (Mummi) & Jóhanna, "volcanic eruptions, ash fall, famine and
 *    cold summers" — all from /the-family-farm/.
 *  - No Eyjafjallajökull claim (third-party only; not stated on their site).
 *    The Westman-Islands view IS theirs (master-suite page).
 *  - Their own taglines are quoted as the experience rails.
 */

const BASE = import.meta.env.BASE_URL
export const IMG = (file: string) => `${BASE}skalakot/${file}`

/* ── Contact (verified: site footer + location page) ─────────────────── */
export const EMAIL = 'info@skalakot.is'
export const EMAIL_HREF = 'mailto:info@skalakot.is'
export const PHONE_DISPLAY = '+354 487 8953'
export const PHONE_HREF = 'tel:+3544878953'
export const ADDRESS = 'Skálakoti, 861 Hvolsvöllur'
/* Their own booking engine (link taken from skalakot.is nav). */
export const BOOKING_URL = 'https://property.godo.is/booking2.php?propid=88935&invoicee=13712'
export const MAP_EMBED = 'https://www.google.com/maps?q=Sk%C3%A1lakot%20Manor%20Hotel&output=embed'
export const MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=Sk%C3%A1lakot%20Manor%20Hotel'

/* ── Nav ─────────────────────────────────────────────────────────────── */
export const NAV = [
  { id: 'rooms', label: 'Rooms' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'farm', label: 'The farm' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'location', label: 'The land' },
] as const

/* ── Hero ────────────────────────────────────────────────────────────── */
export const HERO = {
  eyebrow: 'Skálakoti · 861 Hvolsvöllur',
  /* The colossal word — the farm's name standing on the horizon. */
  word: 'SKÁLAKOT',
  wordPrefix: 'Manor hotel',
  sub: 'A family run farm and small boutique hotel in the south of Iceland. Luxury rooms, a restaurant, a spa and the family’s own Icelandic horses.',
  cta: 'Book a room',
  photoAlt: 'The Skálakot farm from above: the manor, stables and outbuildings under a green mountainside.',
}

/* ── Their own three phrases (homepage + family-farm page) ───────────── */
export const RAILS = ['family run farm', 'small boutique hotel', 'icelandic hospitality'] as const

/* ── Rooms — categories exactly as their own /rooms pages frame them ─── */
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
    key: 'standard',
    name: 'Standard',
    wing: 'First & second floor',
    body: 'Mountain-view rooms with 180×200 cm beds, set up double or twin. Two ground-floor rooms are wheelchair accessible.',
    img: 'room-standard.webp',
    alt: 'Standard room with a made-up bed, patterned wallpaper and daylight from the window.',
  },
  {
    key: 'grand',
    name: 'Grand',
    wing: 'Second floor',
    body: 'The most booked rooms. Three with balconies overlooking the ocean, three with a big old-fashioned bathtub and mountain view.',
    img: 'room-grand.webp',
    alt: 'Grand room with a wide bed, armchair and a painting over the headboard.',
  },
  {
    key: 'suites',
    name: 'Suites',
    wing: 'Second & third floor',
    body: 'The Mini Suite with a separate living room and ocean view. The Master Suite with a bathtub in the middle of the room, a private fireplace, and the best view of the coastline and the Westman Islands.',
    img: 'room-suite.webp',
    alt: 'Attic suite with a freestanding bathtub on a chequered floor under the gable window.',
  },
  {
    key: 'spa',
    name: 'The Spa',
    wing: 'The bathhouse',
    body: 'Sauna and hot tub, a hug for your soul. Complimentary for hotel guests; massages by advance booking.',
    img: 'spa-interior.webp',
    alt: 'The spa pool under a glass gable wall looking out over the green farmland.',
  },
]
export const ROOMS_NOTE = 'Rates and availability appear in the hotel’s own booking engine.'

/* ── Restaurant (verified copy + hours) ──────────────────────────────── */
export const RESTAURANT = {
  title: 'The restaurant',
  body: 'The restaurant at Skálakot serves local Icelandic food in a cozy and relaxing setting, with local ingredients at the heart of the menu. Reservations are recommended for guests from outside the hotel.',
  barLine: 'Dishes made with passion.',
  hours: [
    { label: 'Breakfast', value: '8:00–10:00' },
    { label: 'Lunch', value: '12:00–14:30' },
    { label: 'Dinner', value: '18:00–21:30' },
    { label: 'Spa', value: 'Complimentary for hotel guests' },
  ],
}

/* ── The farm — only what their own family-farm page states ──────────── */
export const SAGA = {
  title: 'From one generation to the next',
  steps: [
    {
      era: 'VII',
      text: 'Seven generations have run this farm, each contending with what the land sends: volcanic eruptions, ash fall, famine and cold summers.',
    },
    {
      era: '1985',
      text: 'Guðmundur, called Mummi, and Jóhanna take over the farm and begin the development that grew into the manor hotel.',
    },
    {
      era: 'Today',
      text: 'A family run farm and small boutique hotel, with its main focus on breeding Icelandic horses and offering Icelandic hospitality.',
    },
  ],
}

/* ── Weddings (their events page, in their words) ────────────────────── */
export const WEDDINGS = {
  title: 'Weddings at Skálakot',
  body: 'A quiet celebration in the heart of South Iceland. Ceremonies at the hotel or out in the nature nearby, among waterfalls, valleys and open countryside, planned with their partner Pink Iceland.',
  cta: 'Send an inquiry',
}

/* ── The land — their location page + master-suite view ──────────────── */
export const PLACE = {
  title: 'The land',
  body: 'The farm stands 2 km off the ring road, up Skálavegur (road 246), between the mountains and the coastline, with the Westman Islands on the horizon.',
}

/* ── Photo registry (all their own shoots) ───────────────────────────── */
export const PHOTOS = {
  heroManor: { file: 'manor-exterior.webp', alt: 'The manor house at Skálakot with its gabled white facade on the family farm.' },
  slope: { file: 'volcano-slope.webp', alt: 'Rust-coloured mountain slope above the farm in low winter light.' },
  farmAerial: { file: 'farm-aerial.webp', alt: 'The farm from above: the manor, stables and outbuildings under a green mountainside.' },
  glassCabin: { file: 'glass-cabin.webp', alt: 'The glass-gabled bathhouse standing alone in pale autumn grass.' },
  roomStandard: { file: 'room-standard.webp', alt: 'Standard room with a made-up bed and patterned wallpaper.' },
  roomGrand: { file: 'room-grand.webp', alt: 'Grand room with a wide bed and an armchair by the window.' },
  roomSuite: { file: 'room-suite.webp', alt: 'Attic suite with a freestanding bathtub under the gable window.' },
  spaInterior: { file: 'spa-interior.webp', alt: 'The spa pool under a glass gable wall looking out over the farmland.' },
  spaMassage: { file: 'spa-massage.webp', alt: 'A massage with warm stones at the spa.' },
  plateFish: { file: 'plate-fish.webp', alt: 'Cured salmon starter with edible flowers on a dark stone plate.' },
  plateLamb: { file: 'plate-lamb.webp', alt: 'Thin-sliced lamb with herbs and flowers on a glazed plate.' },
  dessert: { file: 'dessert.webp', alt: 'Profiterole dessert with berries and cream on a long plate.' },
  diningRoom: { file: 'dining-room.webp', alt: 'The candle-lit dining room set for dinner with wallpapered walls.' },
  diningChef: { file: 'dining-chef.webp', alt: 'The kitchen team dressing a long table for a celebration dinner.' },
  horsesHerd: { file: 'horses-herd.webp', alt: 'The farm’s herd of Icelandic horses being led out of the stable.' },
  horsesArena: { file: 'horses-arena.webp', alt: 'Young riders on Icelandic horses inside the riding arena.' },
  horseChild: { file: 'horse-child.webp', alt: 'A child in the saddle being helped by a guide outside the stable.' },
  farmWork: { file: 'farm-work.webp', alt: 'The family at work on the land with a tractor, building for the next season.' },
  owners: { file: 'owners.webp', alt: 'Guðmundur and Jóhanna standing in front of the farm buildings.' },
  sheep: { file: 'sheep.webp', alt: 'A ewe and her lamb resting in the hay inside the barn.' },
  weddingRoom: { file: 'wedding-room.webp', alt: 'A bride getting ready beside the bathtub in the attic suite.' },
  weddingBW: { file: 'wedding-bw.webp', alt: 'A newly married couple in the open landscape, in black and white.' },
  weddingHorse: { file: 'wedding-horse.webp', alt: 'A couple greeting an Icelandic horse on their wedding day.' },
  canapes: { file: 'canapes.webp', alt: 'Canapés and sparkling wine served at a celebration.' },
} as const

export type PhotoKey = keyof typeof PHOTOS

/* ── SEO ─────────────────────────────────────────────────────────────── */
export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: 'Skálakot Manor Hotel',
  description:
    'Family run farm and small boutique hotel in South Iceland, with a restaurant, spa and the family’s own Icelandic horses. Seventh generation on the farm.',
  url: 'https://skalakot.is',
  email: EMAIL,
  telephone: '+354 487 8953',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Skálakoti',
    addressLocality: 'Hvolsvöllur',
    postalCode: '861',
    addressCountry: 'IS',
  },
}
