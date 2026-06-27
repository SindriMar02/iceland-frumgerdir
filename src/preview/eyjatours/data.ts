/**
 * Eyjatours — redesign concept data ("Born of fire, ruled by puffins").
 *
 * A puffin & volcano boat/land tour company on Heimaey, Vestmannaeyjar
 * (Westman Islands), off Iceland's south coast. Owner & guide: Einar Birgir
 * Baldursson ("Ebbi"); small family-run operation. Audience is international
 * visitors, so the page copy is English-first.
 *
 * Honesty: tour prices and the review quotes are realistic SAMPLE data
 * (disclaimed in the page footer). The island facts (the 1973 Eldfell
 * eruption, the ~1.6M puffin colony hedged as "one of the world's largest",
 * Surtsey, the archipelago, the ferry) are sourced public record. Unverifiable
 * marketing claims ("#1 on TripAdvisor", celebrity endorsements) are left out.
 */

const BASE = import.meta.env.BASE_URL

/* ── Brand assets ─────────────────────────────────────────────────────── */
export const IMG = {
  /** their own logo (kept), served from /public */
  logo: `${BASE}eyjatours/brand/logo.png`,
  /** seamless 1080p puffin-colony hero loop (Vecteezy footage, compressed) */
  heroVideo: `${BASE}eyjatours/media/puffin-loop.mp4`,
  heroPoster: `${BASE}eyjatours/media/puffin-poster.jpg`,
  /* vetted Unsplash photo ids (resolved via the project's u() helper) */
  seaCliffs: 'photo-1742514750207-83b3e38b75b0', // dramatic basalt sea cliffs (intro)
  puffinInset: 'photo-1596482349369-14b1dd2ce0ae', // single puffin, close (intro inset)
  flagship: 'photo-1612564148954-59545876eaa0', // puffins over the sea (flagship tour)
  harbour: 'photo-1671839308844-a2b488df9de5', // island harbour town (best-of tour)
  seaStack: 'photo-1772643465053-2581be059942', // a lone sea stack (viking tour / CTA)
  lava: 'photo-1617191979724-f755c6d83e01', // glowing lava (1973 chapter)
  helm: 'photo-1528582500408-f8eeefb9bc95', // skipper in the wheelhouse (Meet Ebbi)
} as const

/* ── Contact (verified on their live site) ────────────────────────────── */
export const EMAIL = 'eyjatours@eyjatours.is'
export const PHONE_DISPLAY = '+354 852 6939'
export const PHONE_HREF = 'tel:+3548526939'
export const ADDRESS = 'Básaskersbryggja 8, at the harbour'
export const FERRY_HREF = 'https://www.herjolfur.is'
export const MAPS_HREF =
  'https://www.google.com/maps/search/?api=1&query=Eyjatours+B%C3%A1saskersbryggja+Vestmannaeyjar'

/* ── Number formatting ────────────────────────────────────────────────── */
/** Thousands-separated, en-US, e.g. 11900 -> "11,900". */
export const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

/* ── Tours (prices are sample data, disclaimed in the footer) ─────────── */
export interface Tour {
  id: string
  name: string
  /** schedule + duration meta, e.g. "April to September, about 2.5 hours" */
  meta: string
  price: number
  blurb: string
  image: keyof typeof IMG
  /** the flagship gets the full-width feature treatment */
  flagship?: boolean
}

export const TOURS: Tour[] = [
  {
    id: 'puffin-volcano',
    name: 'Puffin & Volcano',
    meta: 'April to September, about 2.5 hours',
    price: 11900,
    blurb:
      'Out to the puffin cliffs by boat, along the black 1973 lava where it met the sea, and into the caves under the rock. Our most loved trip.',
    image: 'flagship',
    flagship: true,
  },
  {
    id: 'best-of',
    name: 'Best of Vestmannaeyjar',
    meta: 'October to April, about 3 hours',
    price: 13500,
    blurb:
      'The winter round, by land and water. The rebuilt town, Eldheimar and the big viewpoints over the bay.',
    image: 'harbour',
  },
  {
    id: 'viking-town',
    name: 'The Viking Town',
    meta: 'All year, about 1 hour',
    price: 6500,
    blurb:
      'A short walk through the reconstructed Viking age stone house, the harbour and the old streets of town.',
    image: 'seaStack',
  },
]

/* ── Facts band (true, sourced; figures hedged honestly) ──────────────── */
export interface Fact {
  /** target value for the count-up */
  value: number
  /** decimals to render (the 1.6M figure animates to one) */
  dec?: number
  prefix?: string
  suffix?: string
  /** the first figure (puffins) is gold; the rest bone */
  gold?: boolean
  /** render without a thousands separator (a year, not a count) */
  plain?: boolean
  caption: string
}

export const FACTS: Fact[] = [
  { value: 1.6, dec: 1, suffix: 'M', gold: true, caption: "puffins, one of the world's largest colonies" },
  { value: 1973, plain: true, caption: 'the year Eldfell erupted and reshaped the island' },
  { value: 12, suffix: ' yrs', caption: 'family run, guided by Ebbi who was born here' },
  { value: 15, caption: 'islands in the archipelago, only Heimaey inhabited' },
]

/* ── The 1973 chapter — sourced public record ─────────────────────────── */
export interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export const ERUPTION = {
  /** eyebrow */
  when: '23 January 1973, 01:55',
  heading: 'A fissure opened a kilometre from town. By morning the island was being evacuated.',
  body:
    'The whole town left by fishing boat within hours. The eruption ran about five months, buried a third of the houses, then crews pumped seawater onto the lava and saved the harbour. The island came out bigger. We show you exactly where it stopped.',
  stats: [
    { value: 5300, label: 'islanders evacuated' },
    { value: 5, label: 'months erupting' },
    { value: 2, prefix: '~', label: 'km² of new land' },
    { value: 200, prefix: '~', label: 'm tall, the new Eldfell cone' },
  ] as Stat[],
  chip: 'Dug back out and rebuilt, the Pompeii of the North',
}

/* ── Archipelago — the signature nautical chart ───────────────────────── */
export interface Isle {
  id: string
  name: string
  /** short list label */
  chip: string
  desc: string
  /** real coordinates + framing for the Google Maps pin */
  lat: number
  lng: number
  zoom: number
}

export const ARCHIPELAGO: Isle[] = [
  {
    id: 'heimaey',
    name: 'Heimaey',
    chip: 'Heimaey',
    desc: 'The only inhabited island, home to about 4,300 people and the harbour the lava nearly closed in 1973. Every tour starts here.',
    lat: 63.4404,
    lng: -20.2716,
    zoom: 13,
  },
  {
    id: 'storhofdi',
    name: 'Stórhöfði',
    chip: 'Stórhöfði',
    desc: 'The windswept southern headland, one of the best places anywhere to watch Atlantic puffins wheel in off the sea.',
    lat: 63.4012,
    lng: -20.2887,
    zoom: 14,
  },
  {
    id: 'surtsey',
    name: 'Surtsey',
    chip: 'Surtsey',
    desc: 'A UNESCO island born of eruptions between 1963 and 1967. Landing is forbidden, so we view this young land from the water.',
    lat: 63.3033,
    lng: -20.6044,
    zoom: 12,
  },
  {
    id: 'skerries',
    name: 'The outer islands',
    chip: 'Outer islands',
    desc: 'Around fifteen uninhabited islands and thirty skerries scattered across the archipelago, full of nesting seabirds. Elliðaey is the famous one.',
    lat: 63.4664,
    lng: -20.1869,
    zoom: 13,
  },
]

/* ── Reviews (sample data, disclaimed in the footer) ──────────────────── */
export interface Review {
  quote: string
  name: string
  place: string
  /** card ground: teal-ink, coral, or bone (staggered, the middle sits lower) */
  variant: 'teal' | 'coral' | 'bone'
}

export const REVIEWS: Review[] = [
  {
    quote:
      'Ebbi knows every cliff and cave by name. We saw thousands of puffins and the spot where the lava stopped.',
    name: 'Marta',
    place: 'Berlin',
    variant: 'teal',
  },
  {
    quote:
      'Small boat, big stories. The 1973 chapter gave me chills, standing on land that did not exist before.',
    name: 'James',
    place: 'Toronto',
    variant: 'coral',
  },
  {
    quote:
      'Booked the ferry, did the Puffin & Volcano tour, and it was the best day of our whole Iceland trip.',
    name: 'Sofie',
    place: 'Copenhagen',
    variant: 'bone',
  },
]
