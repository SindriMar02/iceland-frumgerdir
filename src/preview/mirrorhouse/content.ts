/**
 * Real content harvested from the live Airbnb listing (room
 * 852139182164211478), 2026-08-04. All 18 listing photos were downloaded to
 * public/mirrorhouse/ and individually reviewed. Nothing here is invented —
 * see [[feedback-fact-check-before-drafting]].
 */

export const HOST = {
  name: 'Ingibjorg',
  guestNickname: 'Inga',
  superhost: true,
  yearsHosting: 10,
  rating: 4.94,
  reviewCount: 412,
  languages: ['Danish', 'English', 'Swedish'],
  licenceNr: 'REK-2026-035830', // as shown on the live listing 2026-08-04;
  // a cached search snippet also showed HG-00017975. Re-check the LIVE
  // listing before quoting either anywhere new.
}

const B = import.meta.env.BASE_URL + 'mirrorhouse/'

/** Local, vendored copies of her own listing photography. */
export const PHOTO = {
  /** Summer, wide: gravel path leading up to the cabin, cliff wall behind. THE arrival. */
  arrivalWide: { src: `${B}unrev-07.jpg`, alt: 'The mirror cabin on a green slope beneath a basalt cliff, a gravel path leading up to it', ratio: '3 / 2' },
  /** Straight-on symmetrical: both mirror panels holding sky. */
  heroSymmetrical: { src: `${B}hero-symmetrical.jpg`, alt: 'The mirror cabin straight on, its two glass panels reflecting a pale sky', ratio: '4 / 5' },
  /** Autumn 3/4 portrait, white-sky panels, ochre hillside. */
  autumnPortrait: { src: `${B}unrev-06.jpg`, alt: 'The cabin in autumn, mirror walls holding a white sky against an ochre hillside', ratio: '3 / 4' },
  /** Detail: the mirror edge splitting landscape and reflection; snowy peak only in the glass. */
  mirrorEdge: { src: `${B}unrev-09.jpg`, alt: 'The mirrored corner of the cabin, a snow-capped mountain visible only in the reflection', ratio: '4 / 5' },
  /** The entrance door; lockbox on the cladding, hot-tub lid reflected in the glass. */
  door: { src: `${B}unrev-08.jpg`, alt: 'The timber-clad entrance, a key lockbox on the wall, the hills reflected in the door glass', ratio: '4 / 5' },
  /** Interior: bed under the glass roof, sunset over the water. THE interior. */
  bedGlassRoof: { src: `${B}unrev-05.jpg`, alt: 'The double bed under a glass roof and glass walls, an orange sunset over the water beyond', ratio: '3 / 2' },
  /** Interior: golden hour flooding the room, bed and doorway. */
  interiorGolden: { src: `${B}unrev-03.jpg`, alt: 'Golden evening light inside the cabin, the bed facing the glass corner', ratio: '3 / 2' },
  /** Interior: table and chairs, sunset panorama through the glass. */
  interiorTable: { src: `${B}unrev-04.jpg`, alt: 'The small table by the glass wall, sunset over the estuary beyond', ratio: '3 / 2' },
  /** Kitchen corner. */
  kitchen: { src: `${B}unrev-02.jpg`, alt: 'The kitchenette: pale cabinets, dark stone worktop, warm under-cabinet light', ratio: '4 / 3' },
  /** Bathroom, reed-pattern glass. */
  bath: { src: `${B}bath-shower.jpg`, alt: 'The bathroom, a round backlit mirror over dark tile and reeded glass', ratio: '3 / 4' },
  /** Hot tub, golden hour, guest facing the sunset; glass wall carrying the same sky. */
  hotTubWide: { src: `${B}hottub-sunset-wide.jpg`, alt: 'The private hot tub at sunset, the mirror wall carrying the same orange sky', ratio: '3 / 2' },
  /** Hot tub, deck framing, portrait. */
  hotTubDeck: { src: `${B}hottub-sunset-deck.jpg`, alt: 'The hot tub on its timber deck, the sun low over the water', ratio: '2 / 3' },
  /** THE aurora: green and violet curtains over the snowbound cabin, lights held in the glass. */
  auroraWide: { src: `${B}unrev-01.jpg`, alt: 'Green and violet northern lights over the snowbound cabin, the aurora repeated in its mirror walls', ratio: '3 / 2' },
  /** Aurora, portrait: star field and a green band through the glass end panel. */
  auroraStars: { src: `${B}aurora-stars.jpg`, alt: 'The cabin at night under stars, a band of green aurora glowing in the glass', ratio: '2 / 3' },
} as const

/** The two frames of the night scrub (and of the Kling generation when it runs). */
export const SCRUB = {
  day: PHOTO.arrivalWide,
  night: PHOTO.auroraWide,
  /** Set to `${B}night.mp4` once the one authorized Kling 3.0 clip is generated. */
  videoSrc: null as string | null,
}

// Verbatim guest quotes, attributed the way Airbnb displays them.
export const REVIEW_QUOTES = [
  {
    quote: 'It feels like you’re floating above nature.',
    author: 'Monica',
    when: 'April 2026',
  },
  {
    quote: 'We were lucky enough to see Aurora Borealis from the hot tub and whilst lying in bed!',
    author: 'Charlotte',
    when: 'March 2026',
  },
  {
    quote: 'Rarely do pictures of places look like how they do in person, but the Mirror House somehow looked even better in person!',
    author: 'Dylan',
    when: 'July 2026',
  },
] as const

// From the listing's own "Guest reviews mention" counts. Real numbers.
export const REVIEW_THEMES = [
  { theme: 'The view', mentions: 180 },
  { theme: 'The hot tub', mentions: 116 },
  { theme: 'The location', mentions: 96 },
  { theme: 'The hospitality', mentions: 79 },
] as const

export const LOCAL_AREA = [
  { name: 'Borgarnes', note: 'The nearest town. The Settlement Centre, Kaffi Kyrrð, a supermarket and a petrol station.', dist: '10 min' },
  { name: 'Krauma', note: 'Geothermal baths fed by Deildartunguhver, the most powerful hot spring in Europe.', dist: '35 min' },
  { name: 'Hraunfossar', note: 'A spectacular series of waterfalls out of the lava field.', dist: '40 min' },
  { name: 'Glanni', note: 'A waterfall beside the Paradísarlaut walking trail.', dist: '30 min' },
  { name: 'Snorrastofa', note: 'The medieval centre at Reykholt, named for the historian Snorri Sturluson.', dist: '30 min' },
] as const

/** Practical facts, each from the listing. */
export const FACTS = {
  guests: 2,
  sleeps: '1 double bed',
  checkIn: 'After 3 PM, self check-in with a lockbox',
  checkOut: 'Before 11 AM',
  hotTub: 'Private, open all year, 24 hours',
  heating: 'Floor heating throughout',
  parking: 'Free parking below the cabin',
  road: 'Good main road all the way; the last few metres are gravel. A 4x4 is recommended in winter.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Mirror House Iceland',
  description:
    'A one of a kind mirror glass house in Borgarbyggð, West Iceland, reflecting the surrounding landscape. Sleeps two, with floor heating and a private hot tub open all year.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ytri-Skeljabrekka, Borgarbyggð',
    addressRegion: 'Vesturland',
    addressCountry: 'IS',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.94,
    reviewCount: 412,
    // Source: her Airbnb listing, 2026-08-04.
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private hot tub', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Floor heating', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Mountain view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Sea view', value: true },
  ],
}
