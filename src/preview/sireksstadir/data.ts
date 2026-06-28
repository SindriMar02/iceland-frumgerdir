/* ──────────────────────────────────────────────────────────────────────────
 * Síreksstaðir — "Stillness in Sunnudalur"
 * Static copy + data. All prices are SAMPLES; interior photos are INDICATIVE
 * stock (the real cottages have no photos yet). Restaurant has no published
 * menu/hours. Hey Iceland membership is to-confirm. Guest scores are tagged
 * indicative / to-confirm. See verifiedFacts in brief.
 * ────────────────────────────────────────────────────────────────────────── */

export const EMAIL = 'sirek@sireksstadir.is'

export const PLACE = {
  overline: 'Sunnudalur · Vopnafjörður · Austurland',
  // three asymmetric lede lines
  lede: ['A family farm', 'at the still end', 'of the valley.'],
  caption: 'East-Iceland glen near Vopnafjörður · indicative',
  intro:
    'Síreksstaðir is a working family farm at the quiet end of Sunnudalur, a glen folded into the mountains of Vopnafjörður in Iceland’s far east. Most travellers never reach it. The weather rolls down off the hills, the day slows, and you are simply welcomed in.',
}

/* Hero trust baseline — 4 marks, every figure indicative / to-confirm. */
export const TRUST: { value: string; label: string }[] = [
  { value: '8.3', label: 'Booking.com · indicative' },
  { value: '4.0', label: 'TripAdvisor · indicative' },
  { value: '#1', label: 'Stay in Vopnafjörður · to confirm' },
  { value: 'Family', label: 'Working farm · 691 Austurland' },
]

/* ── Unsplash image ids — expanded, non-repeating library ─────────────────── */
/* Interiors/cottages are INDICATIVE stock; landscapes are East-Iceland-like. */
export const IMG = {
  valley: 'photo-1765871319901-0aaafe3f1a2a', // hero misty valley
  mountains: 'photo-1741807117240-0aee0cd41d25', // moody mountains (story / dividers)
  guesthouse: 'photo-1708448325735-6f366d0c42d1', // bright nordic guest room
  // River Cottage
  riverMain: 'photo-1631554668504-79dd66bbfb94', // cottage bedroom
  riverKitchen: 'photo-1694845480813-2fd2616c998d', // kitchenette
  riverLinen: 'photo-1518019671582-55004f1bc9ab', // linen close-up
  riverWindow: 'photo-1723992742524-d2228d40228a', // window view
  // South Cottage (must NOT reuse guesthouse image)
  southMain: 'photo-1585803114088-cd027272106a', // living / south windows
  southNook: 'photo-1761322026605-2d5d35b58d41', // reading nook
  southTable: 'photo-1619207486524-2b1ff1014aa3', // table by window
  southKitchen: 'photo-1694845480813-2fd2616c998d', // kitchen
  // Dining
  table: 'photo-1619207486524-2b1ff1014aa3', // farm table
  breakfast: 'photo-1413745000559-46fdd2d81cd7', // breakfast / bread
  produce: 'photo-1632776350300-11016768b521', // valley produce / kitchen
  // Experiences mosaic
  riverEvening: 'photo-1778872782874-22257be2fc9a', // river in evening light (tall)
  auroraRoad: 'photo-1628075265328-aec05575f8f0', // aurora / night sky (wide)
  remoteRoad: 'photo-1689068162535-a39297ac7de1', // lonely farm road (wide)
} as const

export type ImgKey = keyof typeof IMG

/* ── The guesthouse summary (7 rooms, shared baths) ──────────────────────── */
export const GUESTHOUSE = {
  overline: 'The guesthouse',
  name: 'Seven rooms under one roof',
  body:
    'Seven simple guest rooms with shared bathrooms, a shared lounge and laundry, free wifi and free parking. A continental breakfast buffet is laid out each morning for a small fee.',
  image: 'guesthouse' as ImgKey,
  imageAlt:
    'A bright Nordic guest room with a large window onto the landscape (indicative interior)',
  specs: ['7 rooms', 'Shared baths', 'Shared lounge & laundry', 'Breakfast buffet (fee)'],
  priceNote: 'Room rates on request',
}

/* ── The two cottages — DISTINCT per-unit copy + per-unit galleries ──────── */
export interface CottageImage {
  key: ImgKey
  alt: string
}
export interface Cottage {
  id: 'river' | 'south'
  overline: string
  name: string
  /** gallery: [0] is the primary plate, rest are thumbnails */
  gallery: CottageImage[]
  desc: string
  specs: string[]
  amenities: string[]
  priceFrom: string // sample
}

export const COTTAGES: Cottage[] = [
  {
    id: 'river',
    overline: 'Cottage 01',
    name: 'The River Cottage',
    gallery: [
      {
        key: 'riverMain',
        alt: 'A calm cottage bedroom with linen bedding and a low window (indicative interior)',
      },
      { key: 'riverKitchen', alt: 'A compact kitchenette with simple ware (indicative interior)' },
      { key: 'riverLinen', alt: 'Soft linen bedding folded by the bed (indicative interior)' },
      { key: 'riverWindow', alt: 'A low window looking out toward the water (indicative interior)' },
    ],
    desc:
      'Set toward the water, where the sound of the river carries through an open window at night. A kitchenette of your own, and the quiet of the valley closing in once the last car has gone.',
    specs: ['32 m²', '1 bedroom', 'Sleeps 4', 'Kitchenette'],
    amenities: ['River view', 'Kitchenette', 'Fresh linens'],
    priceFrom: '24.900',
  },
  {
    id: 'south',
    overline: 'Cottage 02',
    name: 'The South Cottage',
    gallery: [
      {
        key: 'southMain',
        alt: 'A cottage living space with large south-facing windows and soft daylight (indicative interior)',
      },
      { key: 'southNook', alt: 'A quiet reading nook by the window (indicative interior)' },
      { key: 'southTable', alt: 'A table set by the window in morning light (indicative interior)' },
      { key: 'southKitchen', alt: 'A self-catering kitchenette (indicative interior)' },
    ],
    desc:
      'Turned to catch the long south light, with room enough for a family of four to spread out. Mornings arrive slowly here; coffee at the window while the cloud lifts off the hills.',
    specs: ['32 m²', '1 bedroom', 'Sleeps 4', 'Kitchenette'],
    amenities: ['South light', 'Kitchenette', 'Family space'],
    priceFrom: '26.900',
  },
]

/* Booking form unit options — value matches deep-link ids */
export const UNITS: { value: string; label: string }[] = [
  { value: 'guesthouse', label: 'Guesthouse room' },
  { value: 'river', label: 'The River Cottage' },
  { value: 'south', label: 'The South Cottage' },
]

/* ── The welcome / stillness story ───────────────────────────────────────── */
export const STORY = {
  overline: 'The far end of the valley',
  heading: 'You arrive, and the day slows down.',
  body: [
    'There is no front desk and no lobby. You turn off the ring road, drive in through Vopnafjörður, and follow the last gravel stretch up the glen until the houses of Síreksstaðir come into view against the hills.',
    'It is a working family farm. Sheep on the slopes, the river below, the kitchen lit in the evening. You are welcomed plainly, given a key, and left to the quiet of a place most travellers never reach.',
  ],
  facts: [
    { value: '691 Vopnafjörður', label: 'Austurland · far east' },
    { value: 'A working farm', label: 'Family-run, year on year' },
    { value: 'Few ever reach it', label: 'The last glen in the valley' },
  ],
  pullQuote: 'The weather rolls down off the hills, and the day lets go of you.',
  image: 'mountains' as ImgKey,
  imageAlt: 'Dramatic moody East-Iceland mountains under a cloudy sky (indicative)',
}

/* ── Amenities / what's included ─────────────────────────────────────────── */
export const AMENITIES: { title: string; note: string; icon: string }[] = [
  { title: 'On-site restaurant', note: 'A small farm kitchen; served to house guests', icon: 'plate' },
  { title: 'Breakfast buffet', note: 'Laid out each morning, for a small fee', icon: 'cup' },
  { title: 'Shared lounge', note: 'A warm room to sit, with a television', icon: 'sofa' },
  { title: 'Laundry', note: 'Shared laundry on site for longer stays', icon: 'wash' },
  { title: 'Free wifi', note: 'Throughout the guesthouse and cottages', icon: 'wifi' },
  { title: 'Free parking', note: 'On the farm, right by your door', icon: 'car' },
  { title: 'Shared baths', note: 'For the seven guesthouse rooms', icon: 'bath' },
  { title: 'Kitchenettes', note: 'Self-catering in both cottages', icon: 'pot' },
]

/* ── The restaurant (no menu/hours invented) ─────────────────────────────── */
export const TABLE = {
  overline: 'Borðstofan · the farm table',
  name: 'Dinner is whatever the valley gives',
  body:
    'There is a small restaurant on the farm. The kitchen cooks from what the valley and the farm provide, so the table changes with the season rather than a fixed card.',
  serviceNote: 'Borið fram fyrir gesti — spyrjið þegar þið sendið beiðni.',
  serviceNoteEn: 'Served to house guests; ask when you request your stay.',
  pullQuote: 'You eat what the season hands up the valley.',
  image: 'table' as ImgKey,
  imageAlt: 'A rustic farmhouse dining table set with simple ware (indicative interior)',
  morning: {
    overline: 'In the morning',
    body:
      'A continental breakfast buffet is laid out each day for a small fee — bread, something warm, coffee at the window before the cloud lifts off the hills.',
    image: 'breakfast' as ImgKey,
    imageAlt: 'A continental breakfast with fresh bread on a wooden table (indicative)',
  },
  evening: {
    overline: 'In the evening',
    body:
      'When the kitchen cooks, it cooks from what is to hand — bread, lamb off the slopes, whatever the season hands up the valley. No fixed menu; ask when you request your stay.',
    image: 'produce' as ImgKey,
    imageAlt: 'A rustic farm kitchen with local valley produce (indicative)',
  },
}

/* ── Experiences / the valley & seasons ──────────────────────────────────── */
export interface Experience {
  overline: string
  title: string
  body: string
  image: ImgKey
  imageAlt: string
  span: 'tall' | 'wide'
}
export const EXPERIENCES: Experience[] = [
  {
    overline: 'Out the door',
    title: 'Walk the glen, and the river at night',
    body:
      'Footpaths run from the door up the slopes and down to the water. After dark the river is the loudest thing for miles.',
    image: 'riverEvening',
    imageAlt: 'A river in the valley under evening light (indicative)',
    span: 'tall',
  },
  {
    overline: 'Long seasons',
    title: 'Northern lights & the midnight sun',
    body:
      'No streetlight for the aurora to fight in winter; in summer the light barely leaves the valley at all.',
    image: 'auroraRoad',
    imageAlt: 'Northern lights over a dark Icelandic landscape (indicative)',
    span: 'wide',
  },
  {
    overline: 'The drive',
    title: 'Down to Vopnafjörður village',
    body:
      'A short run down the glen reaches the village — a pool, a shop, the harbour, and the road back out to the rest of Iceland.',
    image: 'remoteRoad',
    imageAlt: 'A lonely gravel road running into an Icelandic valley (indicative)',
    span: 'wide',
  },
]

export const STILLNESS_NOTE = {
  title: 'Doing nothing, well',
  body:
    'The truest thing to do here is the least: sit at the window, watch the weather change, let the valley keep its own time.',
}

/* ── Guest words (all figures indicative / to-confirm) ───────────────────── */
export const GUEST = {
  overline: 'Guest words',
  quote:
    'We turned off the road expecting a guesthouse and found a whole quiet valley. We stayed an extra night.',
  attribution: 'Sample guest note · indicative until reviews are verified',
  scores: [
    { value: '8.3', label: 'Booking.com', note: 'Staff 9.2 · indicative' },
    { value: '4.0', label: 'TripAdvisor', note: 'Indicative · to confirm' },
    { value: '#1', label: 'Specialty lodging', note: 'Vopnafjörður · to confirm' },
    { value: 'Family', label: 'Working farm', note: '691 Austurland · confirmed' },
  ],
}

/* ── Find us / getting here ──────────────────────────────────────────────── */
export const FIND = {
  overline: 'Sunnudalur · 691 Vopnafjörður',
  heading: 'Most travellers never come this far. That is the point.',
  body:
    'Síreksstaðir sits up Sunnudalur in Iceland’s far east. You drive in through the village of Vopnafjörður, then follow the last gravel stretch up the glen. Bring what you need; the nearest shop is back down in the village.',
  address: 'Síreksstaðir, Sunnudalur, 691 Vopnafjörður, Austurland, Iceland',
  coords: '65.74° N, 14.83° W · approximate',
  mapHref: 'https://www.google.com/maps/search/?api=1&query=Sireksstadir+Vopnafjordur+Iceland',
  drives: [
    { from: 'Egilsstaðir', time: '~1 hr 45 min', note: 'nearest airport / ring-road hub' },
    { from: 'Akureyri', time: '~3 hr 30 min', note: 'via Route 1, then 85' },
    { from: 'Vopnafjörður village', time: '~20 min', note: 'the last gravel stretch up the glen' },
  ],
  roadImage: 'remoteRoad' as ImgKey,
  roadAlt: 'A lonely gravel road running up into the valley (indicative)',
}

/* ── FAQ / know-before-you-go ────────────────────────────────────────────── */
export const FAQ: { q: string; a: string }[] = [
  {
    q: 'When can I check in and out?',
    a: 'Check-in is from 16:00 and check-out is by 12:00. If you are arriving late off a long drive, tell us in your request and we will leave word.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Free cancellation 30 or more days before arrival. Inside that window, the stay is charged in full. We will always confirm this back to you in writing.',
  },
  {
    q: 'Is breakfast included?',
    a: 'A continental breakfast buffet is laid out each morning for a small fee — it is not included in the room rate. The cottages also have their own kitchenette if you prefer to self-cater.',
  },
  {
    q: 'How remote is it, really? What about the road?',
    a: 'Genuinely remote — the last stretch is gravel up the glen. It is drivable in a normal car in summer; in winter, check conditions on road.is and allow extra time. There is no shop on the farm.',
  },
  {
    q: 'Can I bring a pet?',
    a: 'Ask us in your request and we will tell you honestly what works for the room or cottage you have in mind. This is a working farm with livestock, so some areas are off-limits to dogs.',
  },
]

/* ── Request-to-stay practical facts (all CONFIRMED from sireksstadir.is) ── */
export const STAY = {
  overline: 'Request to stay',
  name: 'Write us a note',
  reassure:
    'Síreksstaðir is family-run. Send a few lines and we usually write back within a day (indicative).',
  checkIn: 'Check-in from 16:00',
  checkOut: 'Check-out by 12:00',
  cancellation:
    'Free cancellation 30+ days before arrival; otherwise the stay is charged in full.',
  confirmation: 'Your note is on its way up the valley.',
  panelOverline: 'A note, not a transaction',
  panelBody:
    'No card, no instant booking. You write to the family, they write back. We confirm the room or cottage, the dates and the price by email before anything is settled.',
  sideImage: 'riverWindow' as ImgKey,
  sideImageAlt: 'A warm cottage window looking onto the valley (indicative interior)',
}

/* ── Closing sign-off ────────────────────────────────────────────────────── */
export const CLOSING = {
  line: 'Come up the valley.',
  sub: 'The kettle is on, the river is loud, and the day is in no hurry.',
  image: 'valley' as ImgKey,
  imageAlt: 'The misty valley of Sunnudalur in soft light (indicative)',
}

export const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const srcSet = (id: string) =>
  `${u(id, 720)} 720w, ${u(id, 1100)} 1100w, ${u(id, 1600)} 1600w, ${u(id, 2200)} 2200w`
