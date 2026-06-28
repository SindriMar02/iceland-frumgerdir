/* ──────────────────────────────────────────────────────────────────────────
 * Edinborg Bistró — static copy & data for "A Bistro Told in Courses".
 *
 * HONESTY: Edinborg Bistró has no published menu and no live website. The
 * bill of fare below is an ILLUSTRATIVE sample composed from dish types the
 * house is genuinely known for (fish soup, halibut, cod, plaice, lamb, coffee
 * & cake). Every price is a sample. Hours are aggregator-sourced (RestaurantGuru)
 * and shown with a "confirm on Facebook" note. Nothing here is presented as an
 * unverified fact, award, or rating.
 * ────────────────────────────────────────────────────────────────────────── */

export const ADDRESS = 'Aðalstræti 7, 400 Ísafjörður'
export const PHONE_DISPLAY = '892 4337'
export const PHONE_HREF = '+3548924337'
/* EMAIL intentionally omitted: edinborgbistro.is is NOT a confirmed live domain
 * for this business (the venue has no documented live website), so no mailto:
 * link is wired anywhere. Phone is the documented, verified contact channel. */
/** Aðalstræti 7, Ísafjörður — approximate, fine-caption only. */
export const COORDS = '66.0749° N, 23.1289° W'

export interface Dish {
  /** Ranade-italic dish name line. */
  name: string
  /** Satoshi muted-slate description. */
  desc: string
  /** Sample price, ISK — illustrative only. */
  price: number
  /** Vegetarian — gets the small oxblood leaf glyph. */
  veg?: boolean
}

export interface Course {
  /** Roman numeral, drawn on as the visitor scrolls. */
  numeral: string
  /** Plain index for the sticky rail / a11y. */
  index: number
  /** Icelandic course title. */
  title: string
  /** English gloss under the title. */
  gloss: string
  dishes: Dish[]
}

export const COURSES: Course[] = [
  {
    numeral: 'I',
    index: 1,
    title: 'Til að byrja',
    gloss: 'To begin',
    dishes: [
      {
        name: 'Fiskisúpa hússins',
        desc: 'The house fish soup — day-boat catch, leek, saffron cream, rye on the side.',
        price: 2400,
      },
      {
        name: 'Reyktur lax',
        desc: 'Cold-smoked salmon, pickled cucumber, dill oil, dark crispbread.',
        price: 2600,
      },
      {
        name: 'Bakað rótargrænmeti',
        desc: 'Roast roots from the valley, toasted seeds, browned-butter skyr.',
        price: 2100,
        veg: true,
      },
    ],
  },
  {
    numeral: 'II',
    index: 2,
    title: 'Úr sjónum',
    gloss: 'From the sea',
    dishes: [
      {
        name: 'Lúða',
        desc: 'Pan-seared halibut, brown butter, capers, almond potatoes.',
        price: 5200,
      },
      {
        name: 'Þorskur',
        desc: 'Westfjords cod, leek fondue, mussel broth, crisp skin.',
        price: 4600,
      },
      {
        name: 'Plokkfiskur',
        desc: 'The old fisherman’s mash — cod, potato, onion, rúgbrauð and butter.',
        price: 3900,
      },
    ],
  },
  {
    numeral: 'III',
    index: 3,
    title: 'Af landi',
    gloss: 'From the land',
    dishes: [
      {
        name: 'Lambafillet',
        desc: 'Icelandic lamb fillet, thyme jus, celeriac, blackcurrant.',
        price: 5800,
      },
      {
        name: 'Lambaskanki',
        desc: 'Slow-braised lamb shank, root mash, juniper gravy.',
        price: 5400,
      },
      {
        name: 'Sveppabygg',
        desc: 'Barley risotto, wild mushrooms, aged cheese, herb oil.',
        price: 3600,
        veg: true,
      },
    ],
  },
  {
    numeral: 'IV',
    index: 4,
    title: 'Kaffi & kaka',
    gloss: 'Coffee & cake',
    dishes: [
      {
        name: 'Kaka dagsins',
        desc: 'Cake of the day from the counter, with whipped cream.',
        price: 1200,
      },
      {
        name: 'Skyrterta',
        desc: 'Skyr cake, crowberry compote, oat crumble.',
        price: 1400,
        veg: true,
      },
      {
        name: 'Kaffi & koníak',
        desc: 'Filter coffee and a small pour, by the harbour window.',
        price: 1900,
      },
    ],
  },
]

export interface Hours {
  /** Icelandic day label. */
  day: string
  /** English short label. */
  en: string
  hours: string
  closed?: boolean
  /** JS getDay() indices this row covers, for the "í dag" marker. */
  jsDays: number[]
}

/** Aggregator-sourced (RestaurantGuru); seasonal — confirm on Facebook. */
export const HOURS: Hours[] = [
  { day: 'Þri–Fim', en: 'Tue–Thu', hours: '17:00 – 23:00', jsDays: [2, 3, 4] },
  { day: 'Fös–Lau', en: 'Fri–Sat', hours: '17:00 – 03:00', jsDays: [5, 6] },
  { day: 'Sun–Mán', en: 'Sun–Mon', hours: 'Lokað', closed: true, jsDays: [0, 1] },
]

export interface HeritageStep {
  year: string
  label: string
}

export const HERITAGE: HeritageStep[] = [
  { year: '1907', label: 'The Edinborg house is raised on the Ísafjörður harbour' },
  { year: '—', label: 'Trading hall of Edinborgarverslunin, the old Edinburgh Store' },
  { year: '—', label: 'Architect Rögnvaldur Á. Ólafsson; protected landmark today' },
  { year: '2007', label: 'Renovated and reopened as a culture house & bistró' },
]

export const HERITAGE_BODY =
  'Edinborg Bistró keeps a corner of one of Ísafjörður’s great wooden trading halls. ' +
  'Raised in 1907 by Edinborgarverslunin — the old “Edinburgh Store”, named for its ' +
  'Scottish trading ties — and drawn by the architect Rögnvaldur Á. Ólafsson, the ' +
  'house is now a protected landmark. After a careful renovation it reopened in 2007 ' +
  'as a culture house, and the bistró sits inside it: lamp-lit, timber-walled, looking ' +
  'out over the same harbour the building was built to serve.'

/* ── Unsplash IDs — vetted set. Large features + full-bleed band now allowed;
 * the 1px framed-print look stays a motif, not a size ceiling. All toned with a
 * unified dusk/sepia CSS wash so the stock reads as one warm set. ───────────── */
export const IMG = {
  /** Hero LARGE feature — white wooden house under the mountain. */
  house: 'photo-1498008122250-bcb854c8462d',
  /** Hero small inset — plated pan-seared fish, moody warm light. */
  heroPlate: 'photo-1776097633704-6666ffafc58d',
  /** From-the-harbour FULL-BLEED band — day-boat catch / moody seafood. */
  catchBand: 'photo-1777049645735-dcb3961069cb',
  /** Course I thumb — bowl of fish soup, rustic table. */
  soup: 'photo-1714271201329-878f05aa0991',
  /** Course II thumb — pan-seared halibut, brown butter, potatoes. */
  halibut: 'photo-1633760040841-1f708ce95c56',
  /** Course III thumb — Icelandic lamb fillet, jus. */
  lamb: 'photo-1761983723667-99c7fd98af53',
  /** Course IV thumb — skyr cake / dessert. */
  dessert: 'photo-1676300185983-d5f242babe34',
  /** Room gallery feature (tallest) — warm lamp-lit timber interior. */
  roomFeature: 'photo-1670819917685-f1040e76b9b7',
  /** Room gallery — table set by a window over water. */
  roomWindow: 'photo-1778936317503-11af0b8432ea',
  /** Room gallery — coffee & cake warm detail. */
  roomDetail: 'photo-1634291090914-98d1a914c34e',
  /** Room gallery & footer sign-off — harbour boats at dusk. */
  harbour: 'photo-1687706418918-1c95d829b478',
  /** Hours & wayfinding — wooden house exterior / entrance vignette. */
  exterior: 'photo-1673112670158-569451d8ab2a',
  /** Heritage band LARGE archival print (sepia tone). */
  heritage: 'photo-1581684577012-01916121ad80',
  /** Reserve panel warmth inset — intimate set table by a window. */
  reserveTable: 'photo-1759358342176-d754874c6d6e',
} as const

/* ── Per-course hero dish image (one image-supported plate per course) ──────── */
export const COURSE_IMG: Record<number, { id: string; alt: string; cap: string }> = {
  1: {
    id: IMG.soup,
    alt: 'A bowl of fish soup on a rustic wooden table, standing in for the house fiskisúpa',
    cap: 'Fiskisúpa hússins — illustrative',
  },
  2: {
    id: IMG.halibut,
    alt: 'A pan-seared white fish fillet with brown butter and potatoes, standing in for the lúða',
    cap: 'Lúða, brúnað smjör — illustrative',
  },
  3: {
    id: IMG.lamb,
    alt: 'A plated fillet of lamb with jus, standing in for the Icelandic lambafillet',
    cap: 'Lambafillet — illustrative',
  },
  4: {
    id: IMG.dessert,
    alt: 'A slice of light skyr cake with berries, standing in for the skyrterta',
    cap: 'Skyrterta — illustrative',
  },
}

/* ── The Room gallery — mixed-size editorial bento ("scroll through an evening"). */
export interface GalleryTile {
  id: string
  alt: string
  cap: string
  /** Tailwind col/row span classes for the asymmetric bento on desktop. */
  span: string
  /** Pixel height the tile crops to (mobile uses its own). */
  h: number
}

export const GALLERY: GalleryTile[] = [
  {
    id: IMG.roomFeature,
    alt: 'A warm, lamp-lit timber-walled bistro interior in the evening — indicative of the room',
    cap: 'The room, by lamplight',
    span: 'sm:col-span-2 sm:row-span-2',
    h: 480,
  },
  {
    id: IMG.roomWindow,
    alt: 'A table set by a window looking over harbour water at dusk — indicative ambience',
    cap: 'A table by the window',
    span: 'sm:col-span-2',
    h: 230,
  },
  {
    id: IMG.halibut,
    alt: 'A plated seafood dish in warm light — indicative of the kitchen',
    cap: 'From the day’s catch',
    span: '',
    h: 230,
  },
  {
    id: IMG.roomDetail,
    alt: 'Coffee and cake in warm light, a close detail — indicative',
    cap: 'Coffee & cake',
    span: '',
    h: 230,
  },
  {
    id: IMG.harbour,
    alt: 'Boats on calm water by a lighthouse at dusk, evoking the Ísafjörður harbour — indicative',
    cap: 'The harbour at dusk',
    span: 'sm:col-span-2',
    h: 230,
  },
]

/* ── Reviews / social proof — ILLUSTRATIVE aggregate ratings, NOT verified.
 * Real per-venue listing URLs for this business could not be confirmed, so no
 * "follow a link to verify" path can resolve to the source; the figures below
 * are therefore presented as indicative/sample, not asserted as current fact.
 * Individual pull-quotes are likewise illustrative, clearly labelled. ──────── */
export interface RatingStat {
  source: string
  score: number
  outOf: number
  count: string
}

export const RATINGS: RatingStat[] = [
  { source: 'TripAdvisor', score: 4.0, outOf: 5, count: '~157 reviews' },
  { source: 'RestaurantGuru', score: 4.7, outOf: 5, count: '~303 reviews' },
  { source: 'Google', score: 4.3, outOf: 5, count: '~92 reviews' },
]

export interface Quote {
  body: string
  who: string
}

/** Representative of the room — illustrative, not transcribed from a named review. */
export const QUOTES: Quote[] = [
  {
    body: 'A warm, timber-walled room by the water — the fish soup alone is worth the walk down Aðalstræti.',
    who: 'Representative of visitor sentiment',
  },
  {
    body: 'Small and lamp-lit, the kind of place you settle into at the close of a long fjord day.',
    who: 'Representative of visitor sentiment',
  },
]

/** Editorial sourcing line for the "From the harbour" full-bleed band. */
export const CATCH_TAGS = ['Day-boat fish', 'Westfjords lamb', 'Valley roots'] as const
