/**
 * Real content harvested from the live Airbnb listing (room 897747788867680607),
 * 2026-08-04. 23 listing photos reviewed; 24 local files vendored to
 * public/villanorth/. Nothing here is invented; everything traces to
 * ../../../../../../private/tmp/.../scratchpad/harvest/villanorth.json — see
 * [[feedback-fact-check-before-drafting]].
 *
 * FACT GATE (binding): Vaglaskógur is the SECOND-largest forest in Iceland
 * (Hallormsstaðaskógur is largest, verified 2026-08-04). Their own listing
 * calls it "the largest" — that claim is never repeated here; the safe
 * phrasing used throughout is "one of Iceland's largest forests". A fire pit
 * is listed by them but reported absent by a guest (Emily, Feb 2026) — it is
 * not mentioned anywhere on this page, positive or negative.
 */

const B = import.meta.env.BASE_URL + 'villanorth/'

/** Phones get the -800 set; desktop gets the full-res original. */
/**
 * Two harvested photos are smaller than the 1200px the rest of the set is, and
 * tub-night-small is smaller than its own -800 variant (520 vs 800). A srcset
 * descriptor is a promise about a file's real width: claim 1200w on a 520px
 * file and the browser happily picks it for a wide slot and renders it soft.
 * See [[srcset-descriptor-lies]]. Measured widths win over the default.
 */
const INTRINSIC_W: Record<string, number> = {
  'tub-night-small.jpg': 520,
  'winter-river.jpg': 800,
}

export const srcSet = (src: string) => {
  const w = INTRINSIC_W[src.split('/').pop() ?? ''] ?? 1200
  const small = `${src.replace(/\.jpg$/, '-800.jpg')} 800w`
  /* Nothing to choose between when the base is no wider than the -800. */
  return w <= 800 && w !== 520 ? small : `${small}, ${src} ${w}w`
}

export const HOST = {
  name: 'the owner',
  superhost: true,
  yearsHosting: 3,
  profession: 'Engineer, by the host profile',
  responseRate: '100%',
  respondsWithin: 'within an hour',
  rating: 5.0,
  reviewCount: 54,
  badges: ['Guest favorite', 'Top 10% of homes'],
}

export interface Photo {
  src: string
  alt: string
  ratio: string
}

/** Local, vendored copies of the listing's own photography. */
export const PHOTO = {
  /**
   * p06: the two-storey glass gable holding the sky. THE DRAWING's traced
   * elevation is now measured directly from this photograph's own pixels
   * (1200x802) and resolves into it exactly, so the hairline lines dissolve
   * into their real photographed edges as the scrub crossfades.
   */
  glassGrid: { src: `${B}glass-grid.jpg`, alt: 'The two-storey glass gable of Villa North against a pale blue sky, dark timber cladding at its edges', ratio: '3 / 2' } as Photo,
  /**
   * p26: the same gable in silhouette against a sunset. No longer used: the
   * elevation trace is measured straight from glass-grid.jpg itself now, so
   * this photograph isn't needed as a separate trace source.
   */
  gridSunset: { src: `${B}grid-sunset.jpg`, alt: "The gable end of Villa North in silhouette against an orange sunset, its roofline the source of this page's drawing", ratio: '3 / 2' } as Photo,
  /** p02: aerial, sunset, the full villa cut into the hillside, hot tub on its deck. THE hero. */
  aerialSunset: { src: `${B}aerial-sunset.jpg`, alt: 'Aerial view of Villa North at sunset, cut into the hillside above Fnjóskadalur with the hot tub on its deck', ratio: '4 / 3' } as Photo,
  /** A second sunset aerial, same evening, wider on the valley and the fells behind. */
  aerialSunsetB: { src: `${B}aerial-sunset-b.jpg`, alt: 'A wider aerial view of Villa North at dusk, the valley and dark fells behind it', ratio: '4 / 3' } as Photo,
  /** p05: aerial, daylight, the river Fnjóská winding through the valley below. */
  aerialRiver: { src: `${B}aerial-river.jpg`, alt: 'Aerial daylight view of Villa North above Fnjóskadalur, the river Fnjóská winding through the valley below', ratio: '4 / 3' } as Photo,
  /** Aerial, low mist sitting in the valley, same house. */
  aerialMist: { src: `${B}aerial-mist.jpg`, alt: 'Aerial view of Villa North with morning mist low in the valley and fog on the fells behind', ratio: '4 / 3' } as Photo,
  /** The double-height gallery, looking down into the sitting room below. */
  mezzanine: { src: `${B}mezzanine.jpg`, alt: 'Looking down from the upstairs gallery into the double-height sitting room, glass wall onto the valley', ratio: '3 / 2' } as Photo,
  /** The dining table and open kitchen beyond, glass walls on two sides. */
  dining: { src: `${B}dining.jpg`, alt: 'The round dining table for six, glass walls open to the deck and the valley beyond', ratio: '3 / 2' } as Photo,
  /** The main bedroom: a dark upholstered bed, wall sconces either side. */
  bedroom: { src: `${B}bedroom.jpg`, alt: 'A bedroom with a dark upholstered bed, folded towels, and a wall sconce either side of the headboard', ratio: '16 / 9' } as Photo,
  /** Upstairs, under the sloped roof: the attic bedroom. */
  bedroomAttic: { src: `${B}bedroom-attic.jpg`, alt: 'The upstairs bedroom under the sloped roof, a bed against the low wall and a balcony door beyond', ratio: '16 / 9' } as Photo,
  /** The sitting room: sectional sofa, floor to ceiling glass on the valley. */
  living: { src: `${B}living.jpg`, alt: 'The sitting room, a grey sectional sofa facing a floor to ceiling glass wall onto the valley', ratio: '3 / 2' } as Photo,
  /** Sitting room, evening, a throw over the sofa arm. */
  livingSofa: { src: `${B}living-sofa.jpg`, alt: 'The sitting room in the evening, a throw blanket over the sofa arm, the valley through the glass behind it', ratio: '3 / 2' } as Photo,
  /** The kitchen counter run, an amber light strip under the shelf above it. */
  kitchenRun: { src: `${B}kitchen-run.jpg`, alt: 'The kitchen counter run, a warm light strip glowing under the shelf above the worktop', ratio: '3 / 2' } as Photo,
  /** Kitchen island, close, fresh flowers and a fruit bowl on the counter. */
  kitchenPendants: { src: `${B}kitchen-pendants.jpg`, alt: 'The kitchen island under three pendant lights, a vase of fresh flowers and a bowl of fruit on the counter', ratio: '3 / 2' } as Photo,
  /** Kitchen island, wider, pendant lights lit, dining table beyond. */
  kitchenDining: { src: `${B}kitchen-dining.jpg`, alt: 'The kitchen island under pendant lights, the dining table and valley view visible beyond it', ratio: '3 / 2' } as Photo,
  /** The bathroom: dark tile, a round backlit mirror, a black basin. */
  bath: { src: `${B}bath.jpg`, alt: 'A bathroom with dark tile, a round backlit mirror, and a black oval basin', ratio: '3 / 2' } as Photo,
  /** Board-formed concrete, a steel wall light set into it. Materials. */
  concreteDetail: { src: `${B}concrete-detail.jpg`, alt: 'A steel wall light set into board-formed concrete, the timber cladding continuing beyond it', ratio: '3 / 2' } as Photo,
  /** Dark timber cladding, a steel light fixture mounted on it. Materials. */
  claddingDetail: { src: `${B}cladding-detail.jpg`, alt: 'A black steel light fixture mounted on dark vertical timber cladding', ratio: '2 / 3' } as Photo,
  /** The exterior walkway: concrete, steel edge, cladding, all in one frame. */
  walkway: { src: `${B}walkway.jpg`, alt: 'The concrete walkway along the house, a steel handrail edge in the foreground and timber cladding beyond', ratio: '2 / 3' } as Photo,
  /** THE GLOW: the villa lit at night, snow on the ground, the hot tub deck visible. */
  winterNight: { src: `${B}winter-night.jpg`, alt: 'Villa North lit up at dusk in winter, snow patches on the ground and the hot tub visible on its deck', ratio: '3 / 2' } as Photo,
  /** A second winter aerial: the river system tracing through the valley at dusk. */
  /* Stock, and deliberately so: the tours sheet is an example of a section
     that does not exist yet, so it must not imply the house owns these
     photographs. Unsplash, cropped 3/2 to match the card grid. */
  tourWhales: { src: `${B}tour-whales.jpg`, alt: 'A whale surfacing in open water off the north coast', ratio: '3 / 2' } as Photo,
  tourGodafoss: { src: `${B}tour-godafoss.jpg`, alt: 'A wide waterfall breaking over a dark basalt lip', ratio: '3 / 2' } as Photo,
  tourHorses: { src: `${B}tour-horses.jpg`, alt: 'Icelandic horses grazing below a mountain ridge', ratio: '3 / 2' } as Photo,
  winterRiver: { src: `${B}winter-river.jpg`, alt: 'An aerial dusk view in winter, the river system tracing through the valley beyond the lit house', ratio: '3 / 2' } as Photo,
  /** Two wine glasses on the deck rail at golden hour, the same amber light strip beneath. THE GLOW's golden-hour beat, and the pallurinn room photo. */
  wineGlasses: { src: `${B}wine-glasses.jpg`, alt: 'Two wine glasses on the deck rail at golden hour, an amber light strip glowing beneath the rail', ratio: '3 / 2' } as Photo,
  /** The hot tub itself, at night, steam and warm underlighting, snow-dusted birch behind. Small specimen only, see SIZES. */
  tubNightSmall: { src: `${B}tub-night-small.jpg`, alt: 'The hot tub at night, warm light glowing under its rim, bare snow-dusted birch trees behind it', ratio: '520 / 546' } as Photo,
  /** Sofa in the evening, portrait crop, steel wall brace and timber ceiling visible. */
  livingTall: { src: `${B}living-tall.jpg`, alt: 'A portrait view inside the sitting room, the angled timber ceiling and a black steel wall brace above the sofa', ratio: '2 / 3' } as Photo,
} as const

/**
 * Two hard size constraints from the harvest brief, honoured at the call
 * site: tub-night-small's real file is 520w, so it is used as a small inset
 * specimen only, never full-bleed or scaled past its intrinsic-ish size.
 * winter-river is 800w, so it never exceeds a mid-column frame.
 */
export const SIZES = {
  tubNightSmallMaxWidth: 260,
  winterRiverMaxWidth: 440,
}

/* ── the rooms, honestly ──────────────────────────────────────────────── */

export interface RoomEntry {
  id: string
  level: 'efri' | 'nedri'
  label: string
  fact: string
  note?: string
  photo: Photo
  photoNote?: string
}

export const ROOMS: RoomEntry[] = [
  {
    id: 'br1',
    level: 'efri',
    label: 'Svefnherbergi 1',
    fact: '1 king + 2 single beds',
    note: 'Upstairs. No bathroom on this floor.',
    photo: PHOTO.bedroomAttic,
  },
  {
    id: 'br2',
    level: 'nedri',
    label: 'Svefnherbergi 2',
    fact: '1 queen bed',
    photo: PHOTO.bedroom,
  },
  {
    id: 'br3',
    level: 'nedri',
    label: 'Svefnherbergi 3',
    fact: '1 queen bed',
    photo: PHOTO.bedroom,
    photoNote: 'Same room type as Svefnherbergi 2; the photo is shared.',
  },
  {
    id: 'br4',
    level: 'nedri',
    label: 'Svefnherbergi 4',
    fact: '1 single bed',
    photo: PHOTO.bedroom,
    photoNote: 'The smallest room; the photo is shared with the two queen rooms.',
  },
  {
    id: 'stofa',
    level: 'nedri',
    label: 'Stofa',
    fact: 'The sitting room',
    note: 'Floor to ceiling glass on the valley side.',
    photo: PHOTO.living,
  },
  {
    id: 'eldhus',
    level: 'nedri',
    label: 'Eldhús',
    fact: 'The kitchen',
    note: 'Miele appliances, very well stocked, open to the dining table.',
    photo: PHOTO.kitchenRun,
  },
  {
    id: 'pallur',
    level: 'nedri',
    label: 'Pallurinn',
    fact: 'The sundeck',
    note: 'The hot tub sits at its edge: trees on one side, the valley on the other.',
    photo: PHOTO.wineGlasses,
  },
]

export const BATH_NOTE = {
  fact: '1.5 bathrooms, both on the main level',
  detail: 'The upstairs bedroom (Svefnherbergi 1) has no bathroom of its own; both bathrooms are downstairs.',
  photo: PHOTO.bath,
}

/* ── the valley ────────────────────────────────────────────────────────── */

export const VALLEY = {
  intro:
    "Below the house, the river Fnjóská curves past the farm at Steinkirkja, with Vaglaskógur, one of Iceland's largest forests, a short walk away.",
  draws: [
    { name: 'Vaglaskógur', note: "One of Iceland's largest forests, a short walk from the house." },
    { name: 'Fnjóská', note: 'A rod-fishing river, right below the hillside.' },
    { name: 'Akureyri', note: 'Fifteen to twenty minutes through the toll tunnel, Vaðlaheiðargöng. Guests recommend buying the 10-pass.' },
    { name: '9-hole golf course', note: 'Nearby, in the same valley.' },
    { name: 'Hiking trails', note: 'Starting from the forest edge.' },
  ],
}

/* ── materials ─────────────────────────────────────────────────────────── */

export const MATERIALS = {
  intro:
    'Board-formed concrete outside, dark timber cladding, and steel fixtures set flush into both. Inside, the furniture is the real thing.',
  names: ['Minotti', 'Miele', 'Stelton'],
  quote: {
    quote: 'Where other design houses are filled with Ikea products and furniture, this home is the real deal.',
    author: 'Harold',
    when: 'April 2026',
  },
}

/* ── the glow: one dark passage ───────────────────────────────────────── */

export const GLOW = {
  intro: 'The hot tub sits on the edge of the sundeck, trees on one side, the valley on the other, open through the winter.',
  auroraFact: 'Guests have watched the northern lights from the tub, mentioned in three or more reviews.',
  quote: {
    quote: 'Just wait until you see the view from the hot tub on your first evening there!',
    author: 'Katie',
    when: 'September 2025',
  },
  filmCredit:
    "The loop above is generated, made from one of the owner's own winter-night photographs: the house itself is locked frame to frame, and only the steam, a faint aurora and the falling snow move.",
}

/**
 * THE GLOW's film: a Higgsfield loop generated from winter-night.jpg
 * (the owner's own photograph, see PHOTO.winterNight above). The house was
 * verified locked frame to frame; only steam, a faint aurora and snow
 * glitter move. Palindromic (last frame = first), so it loops with no seam.
 * glow-poster.jpg / glow-poster-800.jpg are the exact first frame, used as
 * the <video poster> and as a plain <img> fallback so the section still
 * looks complete if the video never loads. Generated 2026-08-05.
 */
export const GLOW_FILM = {
  src: `${B}glow-film.mp4`,
  poster: `${B}glow-poster.jpg`,
  posterSmall: `${B}glow-poster-800.jpg`,
}

/* ── welcome ritual ───────────────────────────────────────────────────── */

export const WELCOME_RITUAL = {
  intro: 'Recurring across many guest reviews, the same small ritual greets every arrival.',
  items: ['Fresh flowers', 'Champagne or sparkling wine', 'Chocolate', 'Fruit'],
}

/* ── guests ────────────────────────────────────────────────────────────── */

export const REVIEW_THEMES = [
  { theme: 'Location', mentions: 24 },
  { theme: 'View', mentions: 21 },
  { theme: 'Hospitality', mentions: 20 },
] as const

export const REVIEW_QUOTES = [
  { quote: 'Probably the best Airbnb experience I have ever had.', author: 'Eric', when: 'June 2026' },
  { quote: 'Thoughtful design, unparalleled views. 11/10!', author: 'Naomi', when: 'July 2026' },
  {
    quote: 'It was squeaky clean and the epitome of luxury. The house was designed and engineered perfectly.',
    author: 'Kris',
    when: 'August 2025',
  },
] as const

/* ── practical facts ──────────────────────────────────────────────────── */

export const FACTS = {
  guests: 7,
  bedrooms: 4,
  beds: 6,
  baths: '1.5',
  checkIn: 'After 4:00 PM, self check-in with a lockbox',
  checkOut: 'Before 11:00 AM',
  laundry: 'Washer and dryer are outside the main house',
  amenitiesTotal: 52,
  security: 'Exterior security cameras are in use',
  water: 'The hot tub has no gate or lock; a river runs nearby',
}

/**
 * Their own drone film — the landing video on the current villanorth.is,
 * published there by the owners (YouTube "Villa north drone1", 34s). Pulled
 * 2026-08-29, re-encoded to a muted web loop (1120px, denoised, no audio).
 * Poster is the film's own frame at 2s, so the handover cannot flash.
 */
/** The tour placeholders: clearly-marked examples of what the area sells,
 *  shared by the tours sheet and the hero's small rotating window. */
/**
 * The tours portal URL, once the account is live. TourDesk hands partners a
 * hosted portal on their own subdomain (`<brand>.tourdesk.com`) and publishes
 * no embed widget or catalogue API, so linking out is the honest integration
 * until they confirm otherwise. See [[booking-systems-integration]]. Filling
 * this one string turns every card's button into a real link.
 */
export const TOURS_PORTAL = ''

export const EXAMPLE_TOURS = [
  {
    name: 'Whale watching',
    note: 'From Akureyri harbour, twenty minutes away',
    photo: PHOTO.tourWhales,
    duration: '3 hours',
    cta: 'See times',
  },
  {
    name: 'Goðafoss and Mývatn',
    note: 'A day east along the Ring Road',
    photo: PHOTO.tourGodafoss,
    duration: 'Full day',
    cta: 'See times',
  },
  {
    name: 'Riding in the valley',
    note: 'Icelandic horses, an hour or an afternoon',
    photo: PHOTO.tourHorses,
    duration: 'From 1 hour',
    cta: 'See times',
  },
] as const

export const AERIAL_FILM = {
  src: `${B}aerial-film.mp4`,
  poster: `${B}aerial-film-poster.jpg`,
  posterSmall: `${B}aerial-film-poster-800.jpg`,
} as const

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Villa North',
  description:
    "A villa in Fnjóskadalur valley, Þingeyjarsveit, North Iceland, with a view over the river Fnjóská and the farm Steinkirkja. Sleeps seven across four bedrooms, with a private hot tub on the sundeck.",
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Fnjóskadalur, Þingeyjarsveit',
    addressRegion: 'Norðurland',
    addressCountry: 'IS',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 5.0,
    reviewCount: 54,
    // Source: the live Airbnb listing, 2026-08-04.
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private hot tub', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'River view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Valley view', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Kitchen', value: true },
  ],
}
