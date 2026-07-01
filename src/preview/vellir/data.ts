/* ──────────────────────────────────────────────────────────────────────────
 * Vellir — Ferðaþjónustan Vellir, Mýrdalur, South Iceland
 * A real family farm guesthouse under the mountain Pétursey, between
 * Sólheimajökull glacier and the sea. All facts below are VERIFIED — see the
 * project brief. No price is published, so none is invented; the page uses a
 * "check availability" / inquiry pattern throughout. Property photography is
 * REAL (Hey Iceland's official cooperative listing for Vellir); supporting
 * landscape imagery (Pétursey, the glacier, the beach) is Unsplash and is
 * always labelled "(indicative)" in its alt text.
 * ────────────────────────────────────────────────────────────────────────── */

export const EMAIL = 'f-vellir@islandia.is'
export const PHONE = '+354 487 1312'
export const PHONE_HREF = 'tel:+3544871312'

export const PLACE = {
  overline: 'Mýrdalur · 871 Vík · South Iceland',
  // Compact all-caps value line — three short lines beside the image column
  headline: ['NINE ROOMS, TWO COTTAGES,', 'UNDER PÉTURSEY —', 'BETWEEN GLACIER AND SEA.'],
  caption: 'The guesthouse at Vellir, under the cliffs of Pétursey (verified property photo)',
  copy:
    'A working family farm fifteen minutes off the Ring Road, set under the cliffs of Pétursey. Nine rooms in the main house, two private cottages in the meadow, and the south coast on every side: Sólheimajökull, Dyrhólaey, Skógafoss and Reynisfjara are all a short drive away.',
}

/* Hero trust baseline — every figure stated plainly, no inflation. */
export const TRUST: { value: string; label: string }[] = [
  { value: '3.7/5', label: 'Tripadvisor · 251 reviews' },
  { value: '7.5/10', label: 'Booking.com · "Good" · 226 reviews' },
  { value: 'Family-run', label: 'Sigurbjörg & Einar' },
  { value: 'Open most of the year', label: 'February to December' },
]

/* ── Real property photography (Hey Iceland's official Vellir listing) ──── */
export const IMG = {
  exterior: 'https://www.heyiceland.is/asset/1940/1-7.-8-og-9.-juli-2009-221s.jpg',
  doubleRoom: 'https://www.heyiceland.is/asset/1942/3-641-vellir-dbl-fatlada-15s.jpg',
  tripleRoom: 'https://www.heyiceland.is/asset/1946/7-641-vellir-triple-13.jpg',
  dining: 'https://www.heyiceland.is/asset/1950/11-641-vellir-1s.jpg',
  cottages: 'https://www.heyiceland.is/asset/1952/13-7.-8-og-9.-juli-2009-206.jpg',
  host: 'https://www.heyiceland.is/asset/1954/15-vellir-17s.jpg',
  twinRoom: 'https://www.heyiceland.is/asset/1941/2-641-vellir-cat-ii-twin-6.jpg',
  grounds: 'https://www.heyiceland.is/asset/1953/14-aulis-og-fl-022.jpg',
} as const

export type ImgKey = keyof typeof IMG

/* ── Unsplash supporting imagery — Pétursey, the glacier, the coast ─────── */
/* All confirmed HTTP 200 + free-tier (images.unsplash.com/photo-…, no
 * premium_photo IDs). No genuine Unsplash photo of Pétursey or Mýrdalur
 * itself exists (searched directly, zero results) — "peturseyBackdrop" is an
 * honest stand-in (a comparable isolated Icelandic mountain landform), and
 * every alt below says "(indicative)" since none of these are Vellir's own. */
export const UIMG = {
  peturseyBackdrop: 'photo-1652403308632-55d0b8572e5d', // isolated green mountain rising from a valley (indicative — not Pétursey itself)
  glacier: 'photo-1628072504294-df57dc522fbd', // Sólheimajökull glacier terrain
  blackSandBeach: 'photo-1680345540388-0f78ec6eaf2a', // Reynisfjara black sand beach
  dyrholaey: 'photo-1755728508834-7c5128cf4017', // rugged green cliff near Dyrhólaey, South Iceland
  meadowMountains: 'photo-1660595626601-c921c9604c1d', // farm buildings in a green field with mountains behind
  icelandicHorses: 'photo-1567868501284-4d47ce2e0ab2', // Icelandic horse, brown and white
  skogafoss: 'photo-1621959721891-d297dfd9d6ee', // Skógafoss waterfall at dawn
} as const

export type UImgKey = keyof typeof UIMG

export const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const srcSet = (id: string) =>
  `${u(id, 720)} 720w, ${u(id, 1100)} 1100w, ${u(id, 1600)} 1600w, ${u(id, 2200)} 2200w`

/* ── Rooms — 3 real types, 9 rooms total in the main guesthouse ──────────── */
export interface RoomType {
  id: 'ensuite-double' | 'ensuite-triple' | 'shared-double'
  overline: string
  name: string
  count: string
  image: ImgKey
  imageAlt: string
  desc: string
  specs: string[]
}

export const ROOM_TYPES: RoomType[] = [
  {
    id: 'ensuite-double',
    overline: 'Room type 01',
    name: 'Double / twin, private bathroom',
    count: '3 rooms',
    image: 'doubleRoom',
    imageAlt: 'A double room at Vellir with a private en-suite bathroom and a window toward Pétursey mountain',
    desc:
      'Three double or twin rooms, each with its own en-suite bathroom and a window looking out toward Pétursey.',
    specs: ['Private bathroom', 'Double or twin beds', 'Pétursey view'],
  },
  {
    id: 'ensuite-triple',
    overline: 'Room type 02',
    name: 'Triple, private bathroom',
    count: '2 rooms',
    image: 'tripleRoom',
    imageAlt: 'A triple room at Vellir with a private en-suite bathroom, suited to three guests',
    desc:
      'Two triple rooms with a private en-suite bathroom, for parties of three travelling together.',
    specs: ['Private bathroom', 'Sleeps three', 'Pétursey view'],
  },
  {
    id: 'shared-double',
    overline: 'Room type 03',
    name: 'Double / twin, shared bathroom',
    count: '4 rooms',
    image: 'twinRoom',
    imageAlt: 'A twin room at Vellir with an in-room wash basin and shared bathroom facilities down the hall',
    desc:
      'Four double or twin rooms with an in-room wash basin, sharing bathroom facilities down the hall. The simplest, most affordable way to stay at the farm.',
    specs: ['In-room wash basin', 'Shared bathroom', 'Pétursey view'],
  },
]

export const ROOMS_SUMMARY = {
  overline: 'The guesthouse',
  heading: 'Nine rooms, every one facing the mountain.',
  body:
    'The main guesthouse holds nine rooms across three simple types. Every room at Vellir has a view toward Pétursey, whichever one you choose.',
  totalNote: '9 rooms total · main guesthouse',
}

/* ── The two cottages — no invented capacity, honestly described ────────── */
export const COTTAGES = {
  overline: 'The cottages',
  heading: 'Two private cottages, standing apart in the meadow.',
  body:
    'Away from the main house, two freestanding wooden cottages stand apart in an open meadow, with the hills of Mýrdalur behind them. Each is private, quiet, and a short walk from the farmyard. Write to us with your group size and we will tell you honestly what fits.',
  image: 'cottages' as ImgKey,
  imageAlt: 'The two private cottages at Vellir standing apart in an open wildflower meadow with hills behind',
  note: 'Capacity is not published — ask us and we will answer plainly.',
}

/* ── Pétursey & what's nearby — honest, internally-consistent distances ─── */
export interface Nearby {
  name: string
  distance: string
  body: string
  image: UImgKey
  imageAlt: string
}

export const PETURSEY = {
  overline: 'The mountain behind the farm',
  heading: 'Pétursey — a 275-metre cliff full of old stories.',
  body:
    'Vellir sits directly under the cliffs of Pétursey, a steep, isolated tuff mountain that was likely once an island in an older sea. It rises about 275 metres straight out of the farmland, and Icelandic folklore has long placed elves and hidden folk in its rock. Every room at the guesthouse looks toward it.',
  image: 'peturseyBackdrop' as UImgKey,
  imageAlt: 'A dramatic, steep green Icelandic tuff mountain rising from farmland (indicative — Pétursey is similar in form)',
}

export const NEARBY: Nearby[] = [
  {
    name: 'Sólheimajökull glacier',
    distance: '~10–13 km',
    body: 'An outlet glacier of Mýrdalsjökull, with guided glacier walks departing nearby.',
    image: 'glacier',
    imageAlt: 'An Icelandic glacier tongue with blue ice and black volcanic ash striping (indicative)',
  },
  {
    name: 'Cape Dyrhólaey',
    distance: '~13 km',
    body: 'A dramatic sea cliff and arch on the South Coast, with views back along the black sand toward Vík.',
    image: 'dyrholaey',
    imageAlt: 'A South Iceland sea cliff and coastline near a dramatic arch (indicative)',
  },
  {
    name: 'Skógafoss & Skógar museum',
    distance: '~16 km',
    body: 'One of Iceland’s best-known waterfalls, alongside the Skógar folk museum.',
    image: 'skogafoss',
    imageAlt: 'A wide, powerful Icelandic waterfall falling over a green cliff (indicative)',
  },
  {
    name: 'Reynisfjara & Reynisdrangar',
    distance: '~20 km',
    body: 'The black sand beach and basalt sea stacks beyond Vík, among Iceland’s most photographed coastline.',
    image: 'blackSandBeach',
    imageAlt: 'A black sand beach with basalt sea stacks rising from the surf (indicative)',
  },
  {
    name: 'Vík í Mýrdal village',
    distance: '~19–20 km',
    body: 'Shops, a swimming pool and a golf course in the South Coast’s southernmost village, about 20 minutes’ drive.',
    image: 'meadowMountains',
    imageAlt: 'Farm buildings in a green Icelandic field with mountains behind, on the way toward Vík (indicative)',
  },
]

/* ── The restaurant — breakfast & dinner, NOT claimed as free/included ───── */
export const RESTAURANT = {
  overline: 'On the farm',
  heading: 'An on-site restaurant serves breakfast and dinner.',
  body:
    'A restaurant on the farm serves breakfast each morning and a three-course dinner menu in the evening. There is no kitchen or self-catering option in the rooms or cottages, so the on-site restaurant is the way to eat at Vellir.',
  image: 'dining' as ImgKey,
  imageAlt: 'The dining room at Vellir, with a wood-beamed ceiling and full-height windows onto the farmland',
  notes: [
    'Breakfast served each morning',
    'A three-course dinner menu in the evening',
    'No self-catering — there is no kitchen in the rooms or cottages',
  ],
}

/* ── The farm — sheep, horses, poultry, and horse-riding ─────────────────── */
export const FARM = {
  overline: 'A working farm',
  heading: 'Sheep, horses and a farmyard you can hear at night.',
  body:
    'Vellir is a working family farm. Sheep, horses, poultry, cats and a dog share the grounds, and horse-riding is offered as one of the activities here. Dogs are welcome too, with no extra charges.',
  image: 'icelandicHorses' as UImgKey,
  imageAlt: 'Icelandic horses standing in a green field (indicative)',
}

/* ── Amenities — conservative, accurate, no overclaiming ─────────────────── */
export const AMENITIES: { title: string; note: string; icon: string }[] = [
  { title: 'Free wifi', note: 'Throughout the guesthouse', icon: 'wifi' },
  { title: 'Free parking', note: 'On the farm, right by the door', icon: 'car' },
  { title: 'Pétursey view', note: 'Every room faces the mountain', icon: 'mountain' },
  { title: 'Pets allowed', note: 'Dogs welcome, no extra charges', icon: 'paw' },
  { title: 'On-site restaurant', note: 'Breakfast and a dinner menu', icon: 'plate' },
  { title: 'Horse-riding', note: 'Offered as a farm activity', icon: 'horse' },
  { title: 'Open most of the year', note: 'February to December', icon: 'calendar' },
  { title: 'No self-catering', note: 'No kitchen in rooms or cottages', icon: 'info' },
]

/* ── Guest words — 4 recent, real, plainly-attributed quotes (2024–2026) ── */
export interface GuestQuote {
  quote: string
  attribution: string
  rating?: string
  source: string
}

export const GUEST_QUOTES: GuestQuote[] = [
  {
    quote: 'A quiet, restful place to relax. Comfortable beds, clean rooms, and a quiet farm setting.',
    attribution: 'Rand R, Brownsburg, Indiana',
    rating: '3★',
    source: 'Tripadvisor · June 2024',
  },
  {
    quote: 'Perfect views — the morning vista from our small triple room with a private bath was remarkable.',
    attribution: 'Roula, Lebanon',
    rating: '4★',
    source: 'Tripadvisor · June 2024',
  },
  {
    quote: 'The location was amazing and the room cozy and comfy.',
    attribution: 'Claire, United States',
    source: 'Booking.com · August 2025',
  },
  {
    quote: 'Excellent stay. 20 min to Vík.',
    attribution: 'Yvonne, Canada',
    source: 'Booking.com · June 2026',
  },
]

export const GUEST = {
  overline: 'Guest words',
  heading: 'What recent guests actually say.',
  body:
    'Vellir is a real, moderately-rated farm guesthouse — not a five-star showcase. Here is the rating plainly, alongside a few recent reviews.',
  scores: [
    { value: '3.7/5', label: 'Tripadvisor', note: '251 reviews · #9 of 19–20 B&Bs/Inns in Vík' },
    { value: '7.5/10', label: 'Booking.com', note: '"Good" · 226 reviews' },
    { value: '8.3', label: 'Location score', note: 'Booking.com category score' },
    { value: '8.2', label: 'Cleanliness score', note: 'Booking.com category score' },
  ],
  categoryScores: [
    { label: 'Cleanliness', value: 8.2 },
    { label: 'Comfort', value: 7.9 },
    { label: 'Location', value: 8.3 },
    { label: 'Facilities', value: 7.4 },
    { label: 'Staff', value: 8.3 },
    { label: 'Value for money', value: 6.7 },
    { label: 'Free WiFi', value: 8.1 },
  ],
}

/* ── Hosts — brief, no invented history ──────────────────────────────────── */
export const HOSTS = {
  overline: 'Who you will meet',
  heading: 'Run by Sigurbjörg and Einar.',
  body: 'Vellir is a family farm, run by Sigurbjörg and Einar.',
  image: 'host' as ImgKey,
  imageAlt: 'A host at the front desk of the guesthouse at Vellir',
}

/* ── Find us / getting here ──────────────────────────────────────────────── */
export const FIND = {
  overline: 'Vellir · 871 Vík',
  heading: 'Off the Ring Road, under the mountain.',
  body:
    'Vellir sits about 1–1.5 km off the Ring Road (Route 1), roughly 19–20 km — about 20 minutes’ drive — from the village of Vík í Mýrdal, in the district of Mýrdalur, South Iceland.',
  address: 'Vellir, 871 Vík, Iceland',
  mapHref: 'https://www.google.com/maps/search/?api=1&query=Vellir+871+Vik+Iceland',
  drives: [
    { from: 'Vík í Mýrdal village', time: '~20 min', note: 'shops, pool and golf' },
    { from: 'Sólheimajökull glacier', time: '~10–15 min', note: 'glacier walks depart nearby' },
    { from: 'Reynisfjara black sand beach', time: '~20–25 min', note: 'past Vík, along the coast' },
  ],
  roadImage: 'grounds' as ImgKey,
  roadAlt: 'The wider grounds and farmland landscape around Vellir',
}

/* ── FAQ / know-before-you-go ────────────────────────────────────────────── */
export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Is breakfast included in the room rate?',
    a: 'There is an on-site restaurant that serves breakfast each morning and a three-course dinner menu. Ask us when you enquire whether breakfast is included with your room, as this is not something we want to assume here.',
  },
  {
    q: 'Can I cook my own food?',
    a: 'No — there is no kitchen or self-catering option in the rooms or cottages. The on-site restaurant serves breakfast and dinner instead.',
  },
  {
    q: 'How many beds are in each cottage?',
    a: 'We have not published an exact number, and we would rather be honest about that than guess. Tell us your group size when you write to us and we will tell you plainly what fits.',
  },
  {
    q: 'Can I bring my dog?',
    a: 'Yes — dogs are allowed at Vellir, with no extra charges. This is a working farm with livestock, so we will point you to where it is appropriate to walk a dog.',
  },
  {
    q: 'Is Vellir open all year?',
    a: 'Vellir is open most of the year, roughly February to December, rather than strictly year-round. Check with us for current dates before you plan a winter visit.',
  },
  {
    q: 'What does a room cost?',
    a: 'We do not publish a fixed nightly rate here, since it changes with the season and the room. Send us your dates and party size and we will reply with current availability and price.',
  },
]

/* ── Booking / inquiry panel — no fake pricing ───────────────────────────── */
export const STAY = {
  overline: 'Check availability',
  heading: 'Write to us for current rates.',
  body:
    'There is no fixed published price at Vellir — rates depend on the season, the room and your dates. Send a short note with your dates and party size, and we will reply with availability and the current rate.',
  confirmation: 'Your enquiry is on its way to the farm.',
  panelOverline: 'A direct note, not a transaction',
  panelBody:
    'No card, no instant booking. You write to the family at Vellir, and they reply with availability, the room or cottage, and the price.',
  sideImage: 'grounds' as ImgKey,
  sideImageAlt: 'The grounds at Vellir, with farmland stretching toward the hills',
}

export const UNITS: { value: string; label: string }[] = [
  { value: 'ensuite-double', label: 'Double / twin, private bathroom' },
  { value: 'ensuite-triple', label: 'Triple, private bathroom' },
  { value: 'shared-double', label: 'Double / twin, shared bathroom' },
  { value: 'cottage', label: 'A private cottage' },
]

/* ── Closing sign-off ────────────────────────────────────────────────────── */
export const CLOSING = {
  line: 'Come and stay under the mountain.',
  sub: 'Nine rooms, two cottages, and the South Coast on every side.',
  image: 'exterior' as ImgKey,
  imageAlt: 'The guesthouse at Vellir under the cliffs of Pétursey mountain',
}
