/**
 * Real content harvested 2026-10-20 from the live Airbnb listing (room
 * 1367246566538586964), the Booking.com page (28 photos, max3000 originals)
 * and the operating-licence register. Full trail and the review frictions:
 * `_harvest/glacialglass/FACTS.md`. Nothing here is invented.
 *
 * The hosts appear on Airbnb only as "Glacial Glass Cabin", a couple from
 * Iceland. No person is named on the page until the owners say who answers.
 * The listing's "featured in Architectural Digest" line was NOT verified and
 * must never become site copy.
 */

export const HOST = {
  superhost: true,
  yearsHosting: 2,
  rating: 4.94,
  reviewCount: 112,
  /** Booking.com is kept apart: a different scale and a smaller sample. */
  booking: { score: 9.1, reviews: 32 },
  languages: ['English', 'Icelandic', 'Norwegian'],
  /** Operating licence register (Sýslumaðurinn á Suðurlandi), Kyrjun ehf. */
  licenceNr: 'REK-2025-003475',
  /** The owners' own number and handle, as printed on the cabin's Facebook
      page (About → Contact info) and Google Travel; the handle is the one in
      their Instagram bio. Read 2026-10-20. */
  phone: '+354 768 4224',
  tel: '+3547684224',
  instagram: 'glacialglasscabin',
}

const B = import.meta.env.BASE_URL + 'glacialglass/'

/**
 * Three widths per photo: 800 (phones), 1440, and the full file. Full-bleed
 * frames are oversized by the drift overscan (--dz), so on a wide desktop the
 * hero is painted ~2400px wide: the four full-bleed shots are 4K AI upscales
 * (Higgsfield/ByteDance, 2 credits each) served at 2560; the rest are their
 * 2048px Booking originals; portraits top out at 1365.
 */
export const srcSet = (src: string, w = 2048) =>
  w <= 1440
    ? `${src.replace(/\.jpg$/, '-800.jpg')} 800w, ${src} ${w}w`
    : `${src.replace(/\.jpg$/, '-800.jpg')} 800w, ${src.replace(/\.jpg$/, '-1440.jpg')} 1440w, ${src} ${w}w`

/** Local, vendored copies of the listing photography (Booking.com originals). */
export const PHOTO = {
  /** Wide: the black timber cabin on the moor, cloud-capped Hekla behind. THE arrival. */
  arrivalWide: { src: `${B}arrival-hekla.jpg`, alt: 'The black timber cabin alone on the moor, Hekla under a cap of cloud behind it', ratio: '3 / 2', w: 2560 },
  /** Portrait: the mirror walls holding the moor, Búrfell beyond. */
  mirrorLand: { src: `${B}burfell-mirror.jpg`, alt: 'The cabin set into a grass ridge, its mirror walls holding the moor, the flat-topped mountain Búrfell beyond', ratio: '4 / 5', w: 1365 },
  /** The gravel track running in to the cabin. */
  track: { src: `${B}track.jpg`, alt: 'A dark gravel track curving across the golden moor to the low cabin', ratio: '3 / 2' },
  /** The timber back wall: the door, two wall lights, Hekla framed through the opening. */
  door: { src: `${B}door.jpg`, alt: 'The entrance in the black timber wall, two small lights either side, the snowy volcano behind', ratio: '4 / 5' },
  /** Interior: the bed facing the glass, the moor and Hekla beyond. THE interior. */
  bedView: { src: `${B}bed-view.jpg`, alt: 'The double bed facing floor-to-ceiling glass, the moor and the snowy volcano beyond', ratio: '3 / 2', w: 2560 },
  /** Interior: the round table and two orange chairs at the glass corner. */
  table: { src: `${B}table.jpg`, alt: 'A round timber table and two orange chairs in the glass corner, the river valley below', ratio: '3 / 2' },
  /** Interior at sunset: low sun through the glass, the bed lit amber. */
  eveningBed: { src: `${B}evening-bed.jpg`, alt: 'The bed at sunset, low sun coming straight through the glass wall', ratio: '3 / 2', w: 2560 },
  /** The hot-tub deck by day: the river below, the mirror wall at the edge. */
  deckDay: { src: `${B}deck-day.jpg`, alt: 'The hot-tub deck by day, a river winding through the moor below, the mirror wall at the edge of the frame', ratio: '3 / 2' },
  /** The push-in film's own first frame (1080p), so the still under the canvas
      and frame 0 line up exactly when the first frame lands. */
  filmDay: { src: `${B}film-day.jpg`, alt: 'The mirror-glass cabin on its grass ridge in daylight, Búrfell behind', ratio: '16 / 9', w: 1920 },
  /** Night: the aurora held in the mirror walls. */
  auroraMirror: { src: `${B}aurora-mirror.jpg`, alt: 'Green aurora over the dark moor, repeated in the mirror walls of the cabin', ratio: '3 / 2', w: 2560 },
  /** Night, portrait: the cabin on its ridge under the aurora. */
  auroraHill: { src: `${B}aurora-hill.jpg`, alt: 'The glass cabin on its grass ridge at night, a band of green aurora behind it', ratio: '3 / 4', w: 1365 },
  kitchen: { src: `${B}kitchen.jpg`, alt: 'The kitchen wall: black cabinets, an open shelf of jars, warm downlights', ratio: '4 / 3' },
  bath: { src: `${B}bath.jpg`, alt: 'The bathroom, a white basin and grey stone wall beside the glass', ratio: '3 / 4', w: 1365 },
} as const

/**
 * The night scrub, the Mirror House way: Kling 3.0 PRO (1080p, sound off,
 * 17.5 credits), start = their daylight shot of the mirror box on its ridge
 * under Búrfell, end = their own aurora photo of the same box from below.
 * The camera pushes in, arcs round to the glass and tilts up while the day
 * becomes aurora. Two earlier locked-off runs from the hot-tub deck (std
 * mode, 720p) were discarded: flat, and soft on a wide screen.
 *
 * FRAME SEQUENCE on a canvas, never a scrubbed <video> (see mirrorhouse).
 * Tiers by viewport: frames-p (506x900 centre strip) for portrait phones,
 * 828w landscape phones, 1200w desktop, 1440w for >=1400px screens (565MB
 * decoded, acceptable only where the screen is that wide).
 */
export const SCRUB = {
  day: PHOTO.filmDay,
  night: PHOTO.auroraMirror,
  frameCount: 121,
  frameSrc: (i: number, dir: 'frames-p' | 'frames-828' | 'frames' | 'frames-1440') =>
    `${B}${dir}/f${String(i + 1).padStart(3, '0')}.jpg`,
}

// Verbatim guest quotes, attributed the way Airbnb displays them.
export const REVIEW_QUOTES = [
  {
    quote: 'My partner and I really loved waking up to the view, having breakfast to the view, and sitting in the hot tub after days of hiking and exploring.',
    author: 'Shannon',
    when: 'August 2026',
  },
  {
    quote: 'We were lucky enough to see the northern lights both nights.',
    author: 'Jonathan',
    when: 'April 2026',
  },
  {
    quote: 'Had a nice walk around the property the next morning down by the glacier river, which was so very clear and cold.',
    author: 'Shelby',
    when: 'September 2026',
  },
] as const

// From the listing's own "Guests mention" counts. Real numbers.
export const REVIEW_THEMES = [
  { theme: 'The view', mentions: 58 },
  { theme: 'The hot tub', mentions: 45 },
  { theme: 'The hospitality', mentions: 38 },
  { theme: 'The location', mentions: 35 },
] as const

/** Drive times: OSM road routing (OSRM) from Svínhagi, rounded. */
export const LOCAL_AREA = [
  { name: 'Hella', note: 'The nearest town. Groceries and fuel on the way in.', dist: '30 min' },
  { name: 'Seljalandsfoss', note: 'The waterfall with a path behind the fall.', dist: '55 min' },
  { name: 'Landmannalaugar', note: 'Rhyolite mountains and a natural hot spring. Summer only, by F-road and 4x4.', dist: '1 h 20' },
  { name: 'Skógafoss', note: 'The great curtain falls on the South Coast road.', dist: '1 h 20' },
  { name: 'Geysir and Gullfoss', note: 'The Golden Circle, an easy day out and back.', dist: '1 h 40' },
] as const

/** Practical facts, each from the listing. */
export const FACTS = {
  guests: 2,
  sleeps: '1 double bed',
  size: '20 m²',
  checkIn: '4 PM to midnight, self check-in with a lockbox',
  checkOut: 'Before 11 AM',
  hotTub: 'Private, on the terrace',
  heating: 'Heated floors',
  parking: 'Free parking on the property',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Glacial Glass Cabin',
  description:
    'A 20 m² glass cabin for two on nearly four hectares of private land above a river near Hella, South Iceland, facing Hekla. Three walls of floor-to-ceiling glass, heated floors and a private hot tub.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Hella, Rangárþing ytra',
    postalCode: '851',
    addressRegion: 'Suðurland',
    addressCountry: 'IS',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.94,
    bestRating: 5,
    reviewCount: 112,
    // Source: the Airbnb listing, 2026-10-20. Booking.com (9.1/10, 32) kept separate.
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private hot tub', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Heated floors', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Mountain view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'River view', value: true },
  ],
}
