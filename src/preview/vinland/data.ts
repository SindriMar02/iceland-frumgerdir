/* ──────────────────────────────────────────────────────────────────────────
 * Vínland Guesthouse — "Mutafova"-DNA editorial redesign
 * A real family farm guesthouse in Fellabær / Egilsstaðir, East Iceland.
 * All facts below are VERIFIED (see brief). No price, pet policy or breakfast
 * claim is invented. Interior/landscape photos are INDICATIVE Unsplash stock
 * (the property's own interiors are unverified online) — the hero exterior
 * is the one REAL property photo, sourced from the East Iceland tourism
 * board listing; it may 404 in production, in which case the Img component's
 * gradient fallback renders instead (by design — never substitute a guess).
 * ────────────────────────────────────────────────────────────────────────── */

export const EMAIL = 'info@vinlandhotel.is'
export const PHONE = '+354 893 2989'
export const PHONE_HREF = 'tel:+3548932989'

export const PLACE = {
  overline: 'Fellabær · Egilsstaðir · Austurland',
  /* Compact all-caps value line — three short lines, fits beside the photo. */
  headline: [
    'SIX ROOMS, A COTTAGE',
    'AND CAMPING PODS,',
    'RIGHT BY THE RING ROAD.',
  ],
  caption: 'Vínland, on the Fellabær side of Lagarfljót · real property photo',
  practical:
    'Vínland sits directly off Route 1 in Fellabær, a short drive from Egilsstaðir across the river. The Reindeer Park is next door, Vök Baths and Hallormsstaður Forest are minutes away, and the airport is about 1.5 km — free transfer included.',
}

/* Hero trust baseline — every figure verified (see brief). */
export const TRUST: { value: string; label: string }[] = [
  { value: '4.3', label: 'Tripadvisor · 177 reviews' },
  { value: '8.1', label: 'Booking.com · 659 reviews' },
  { value: '#1', label: 'B&B / Inn in Fellabær' },
  { value: 'Since 2018', label: 'Run by Ásdís & Ólafur' },
]

/* ── REAL hero photo (East Iceland tourism board, Cloudinary-signed URL) ─── */
export const HERO_PHOTO = {
  src: 'https://res.cloudinary.com/itb-database/image/upload/s--FQ0s_J7Q--/c_fill,dpr_auto,f_auto,q_auto:eco,w_1470/v1/ServiceProviders/ef7865232160a4a74bec5af6b384d49c',
  alt: 'Vínland Guesthouse building exterior — pale blue-grey corrugated siding, teal doors, East Iceland hills behind',
}

/* ── Two more REAL property photos from the same tourism-board listing ──── */
export const REAL_ROOM_PHOTO = {
  src: 'https://res.cloudinary.com/itb-database/image/upload/s--D-z8NlGu--/c_fill,dpr_auto,f_auto,q_auto:eco,w_1280/v1/ServiceProviders/4032629f1b6dba154fe73fb98ca3b3dc',
  alt: 'A real Vínland guest bedroom — mint-green walls, a double bed, and a small desk',
}
export const REAL_BATH_PHOTO = {
  src: 'https://res.cloudinary.com/itb-database/image/upload/s--Iur6wJG3--/c_fill,dpr_auto,f_auto,q_auto:eco,w_1280/v1/ServiceProviders/8e377d9d74553c7afcbfe636cf63ccf0',
  alt: 'A real Vínland en-suite bathroom — tiled, with a sink, shower and toilet',
}

/* ── Unsplash image ids — verified loading, non-premium ─────────────────── */
export const IMG = {
  guestroom: 'photo-1722605900402-6d8b30785dfe', // bright Nordic guest room, snowy window view
  kitchenette: 'photo-1770757587087-766db2874c21', // compact self-catering kitchenette
  pod: 'photo-1762765306108-5375f855a1ef', // arched glamping pod exterior on grass
  forest: 'photo-1556180282-00faa35841d8', // looking up through green forest canopy
  river: 'photo-1659990434216-3f902fffe763', // mossy Icelandic river canyon
  reindeer: 'photo-1586001015642-c2cf2967a566', // reindeer on snow, mountains behind
} as const

export type ImgKey = keyof typeof IMG

/* ── The guesthouse rooms ─────────────────────────────────────────────────── */
export const ROOMS = {
  overline: 'The guesthouse',
  heading: 'Six rooms, each with its own bathroom.',
  body:
    'Six straightforward guest bedrooms, each with a private en-suite bathroom, satellite TV, a microwave, a small fridge and a tea/coffee maker. Free wifi and free private parking throughout.',
  image: 'guestroom' as ImgKey,
  imageAlt: 'A bright Nordic guest bedroom with a window onto snowy hills (indicative interior)',
  specs: ['6 rooms', 'Private en-suite', 'Satellite TV', 'Microwave & fridge', 'Tea/coffee maker', 'Free wifi'],
}

/* ── The cottage (summer house) ──────────────────────────────────────────── */
export const COTTAGE = {
  overline: 'The cottage',
  heading: 'A summer house that sleeps up to six.',
  body:
    'Set apart from the guesthouse, the cottage has two bedrooms — one large double, one with three single beds — plus a double sofa bed in the living room. A full kitchen, a flat-screen TV with DVD player, and a terrace with a gas BBQ. Linens, towels, parking and wifi are all included.',
  image: 'kitchenette' as ImgKey,
  imageAlt: 'A compact self-catering kitchenette with microwave and small fridge (indicative interior)',
  specs: ['Sleeps up to 6', '2 bedrooms + sofa bed', 'Full kitchen', 'Terrace & gas BBQ', 'Linens & towels included', 'Free wifi & parking'],
}

/* ── Camping pods — no invented count ────────────────────────────────────── */
export const PODS = {
  overline: 'Camping pods',
  heading: 'Small private pods, bring your own sleeping bag.',
  body:
    'Compact private pods of about 9 m², each with a single bed and a double bed, a private entrance and a small seating area. Bring your own sleeping bag — linens are not provided. A shared building nearby has a kitchen, toilets and showers for pod guests.',
  image: 'pod' as ImgKey,
  imageAlt: 'A small arched camping pod with a private entrance on green grass (indicative exterior)',
  specs: ['~9 m² each', 'Single + double bed', 'Private entrance', 'Shared kitchen & showers nearby', 'Bring your own sleeping bag'],
}

/* ── What's nearby — honest distances, no invented walkability ──────────── */
export interface Nearby {
  name: string
  distance: string
  note: string
  image?: ImgKey
  imageAlt?: string
}
export const NEARBY: Nearby[] = [
  {
    name: 'Reindeer Park',
    distance: 'Next door',
    note: 'Hreindýragarðurinn sits right on the same grounds as Vínland.',
    image: 'reindeer',
    imageAlt: 'A reindeer standing on snow with mountains in the background (indicative)',
  },
  {
    name: 'Vök Baths',
    distance: 'A few minutes’ drive',
    note: 'Floating geothermal pools on Lake Urriðavatn.',
  },
  {
    name: 'Hallormsstaður Forest',
    distance: 'A few minutes’ drive',
    note: 'Iceland’s largest forest, with marked walking trails.',
    image: 'forest',
    imageAlt: 'Looking up through a green forest canopy in soft light (indicative)',
  },
  {
    name: 'East Iceland Heritage Museum',
    distance: 'A few minutes’ drive',
    note: 'In central Egilsstaðir, across the river — not walkable from Vínland.',
  },
  {
    name: 'Egilsstaðir Airport',
    distance: '~1.5 km',
    note: 'Free airport transfer offered to guests.',
  },
]

/* ── Guest words — real, attributed exactly as verified ──────────────────── */
export interface GuestQuote {
  quote: string
  attribution: string
}
export const GUEST_QUOTES: GuestQuote[] = [
  {
    quote:
      'The guesthouse is in the middle of road 1 near Egilsstadir... The shower is excellent and the bed is comfortable.',
    attribution: 'Omri L · 5★ · July 2025',
  },
  {
    quote: 'Great cottage with good facilities, good sized bedrooms and a patio. Shower was also excellent.',
    attribution: 'Gary J · 5★ · August 2025',
  },
  {
    quote:
      'We had a wonderful experience staying in the camping pods... We got a great viewing of the northern lights from the campsite on both nights of our stay.',
    attribution: '12345678315, Leeds · 4★ · December 2016 · on the camping pods',
  },
]

export const SCORES = {
  tripadvisor: {
    value: '4.3',
    of: 'of 5',
    reviews: '177 reviews',
    rank: 'Ranked #1 of 1 B&B/Inn in Fellabær',
    categories: [
      { label: 'Cleanliness', value: '4.7' },
      { label: 'Rooms', value: '4.5' },
      { label: 'Sleep Quality', value: '4.5' },
      { label: 'Service', value: '4.2' },
      { label: 'Location', value: '4.2' },
      { label: 'Value', value: '4.1' },
    ],
  },
  booking: {
    value: '8.1',
    of: 'of 10',
    reviews: '659 reviews',
    categories: [
      { label: 'Cleanliness', value: '8.6' },
      { label: 'Comfort', value: '8.4' },
      { label: 'Location', value: '8.7' },
      { label: 'Facilities', value: '7.9' },
      { label: 'Staff', value: '7.8' },
      { label: 'Value', value: '8.0' },
      { label: 'Wi-Fi', value: '7.5' },
    ],
  },
}

/* ── Amenities confirmed ──────────────────────────────────────────────────── */
export const AMENITIES: { title: string; icon: string }[] = [
  { title: 'Free wifi', icon: 'wifi' },
  { title: 'Free private parking', icon: 'car' },
  { title: 'Free airport transfer', icon: 'plane' },
  { title: 'Non-smoking rooms', icon: 'ban' },
  { title: 'Open year-round', icon: 'calendar' },
]

/* ── Find us / getting here ──────────────────────────────────────────────── */
export const FIND = {
  overline: 'Find us',
  heading: 'Right off the Ring Road, on the Fellabær side.',
  body:
    'Vínland is at 700 Egilsstaðir, in Fellabær, directly off Route 1 on the airport side of the Lagarfljót river — about a 2 to 5 minute drive from Egilsstaðir town center across the bridge.',
  address: 'Vínland, 700 Egilsstaðir, Fellabær, Austurland, Iceland',
  mapHref: 'https://www.google.com/maps/search/?api=1&query=Vinland+Fellabaer+Egilsstadir+Iceland',
  drives: [
    { from: 'Egilsstaðir town center', time: '2–5 min', note: 'across the river bridge' },
    { from: 'Egilsstaðir Airport', time: '~1.5 km', note: 'free transfer offered' },
    { from: 'Vök Baths', time: 'A few minutes', note: 'on Lake Urriðavatn' },
    { from: 'Hallormsstaður Forest', time: 'A few minutes', note: 'Iceland’s largest forest' },
  ],
}

/* ── Booking / inquiry — no fake pricing ─────────────────────────────────── */
export const STAY = {
  overline: 'Book your stay',
  heading: 'See current rates and check availability.',
  body:
    'No price is published here — rates vary by season and room. Check current availability on Booking.com, or send a direct inquiry and Ásdís and Ólafur will write back.',
  bookHref: '#',
  bookLabel: 'Check availability',
  inquiryLabel: 'Send inquiry',
}

/* ── Closing sign-off ────────────────────────────────────────────────────── */
export const CLOSING = {
  line: 'Come stay by the river.',
  sub: 'Six rooms, a cottage and camping pods, a short drive from Egilsstaðir, by the Ring Road.',
}

export const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const srcSet = (id: string) =>
  `${u(id, 720)} 720w, ${u(id, 1100)} 1100w, ${u(id, 1600)} 1600w, ${u(id, 2200)} 2200w`
