/**
 * Eyjatours — redesign concept data.
 *
 * A puffin & volcano tour company on Heimaey, Vestmannaeyjar (Westman Islands).
 * Owner & guide: Einar Birgir Baldursson ("Ebbi"); small family-run operation.
 * Audience is international visitors, so the site copy is English-first.
 *
 * Honesty: tour prices, durations and the review quotes are realistic SAMPLE
 * data (disclaimed in the shared footer). The island facts (1973 Eldfell
 * eruption, the puffin colony, Surtsey, the ferry) are sourced public record.
 * Marketing claims that are not independently verifiable ("#1 on TripAdvisor",
 * "Rick Steves") are deliberately left out.
 */

/* ── Brand image set — all visually vetted Unsplash photos ─────────────── */
export const IMG = {
  /** their own logo (kept), served from /public */
  logo: `${import.meta.env.BASE_URL}eyjatours/brand/logo.png`,
  heroPuffins: 'photo-1612564148954-59545876eaa0', // bright puffins on a clifftop over the sea (hero)
  puffinPortrait: 'photo-1596482349369-14b1dd2ce0ae', // single puffin, close
  puffinCliff: 'photo-1499597308780-f76e4f53c08a', // moody puffins on a clifftop (flagship card)
  seaCliffs: 'photo-1742514750207-83b3e38b75b0', // dramatic basalt sea cliffs
  island: 'photo-1671839308844-a2b488df9de5', // island harbour town under a peak
  lava: 'photo-1617191979724-f755c6d83e01', // glowing lava flow
  boat: 'photo-1770828310731-809268662aa3', // RIB tour boat on cold water
  seaStack: 'photo-1772643465053-2581be059942', // a lone sea stack in the Atlantic
  helm: 'photo-1528582500408-f8eeefb9bc95', // a skipper in the wheelhouse
} as const

/* ── Contact (verified on their live site) ────────────────────────────── */
export const EMAIL = 'eyjatours@eyjatours.is'
export const PHONE_DISPLAY = '+354 852 6939'
export const PHONE_HREF = 'tel:+3548526939'
export const ADDRESS = 'Básaskersbryggja 8, 900 Vestmannaeyjar'
export const MAPS_HREF =
  'https://www.google.com/maps/search/?api=1&query=Eyjatours+B%C3%A1saskersbryggja+Vestmannaeyjar'
export const FERRY_HREF = 'https://herjolfur.is/en/'

/* ── Tours ────────────────────────────────────────────────────────────── */
export interface Tour {
  id: string
  name: string
  season: string
  /** short months badge, e.g. "Apr to Sep" */
  window: string
  duration: string
  blurb: string
  includes: string[]
  adult: number
  child: number
  image: keyof typeof IMG
  /** flagship gets the large feature treatment */
  flagship?: boolean
}

export const TOURS: Tour[] = [
  {
    id: 'puffin-volcano',
    name: 'Puffin & Volcano Tour',
    season: 'Puffin season',
    window: 'Apr to Sep',
    duration: 'About 2.5 hours',
    blurb:
      'The whole island in one afternoon. We sit above one of the largest puffin colonies on earth, stand where the lava stopped in 1973, and finish with a taste of the islands.',
    includes: [
      'The puffin cliffs at the edge of the colony',
      'The 1973 Eldfell eruption and its lava field',
      'The reconstructed Viking-age stone house',
      'A taste of local Icelandic food',
    ],
    adult: 11900,
    child: 5950,
    image: 'puffinCliff',
    flagship: true,
  },
  {
    id: 'best-of',
    name: 'The Best of Vestmannaeyjar',
    season: 'Winter tour',
    window: 'Oct to Apr',
    duration: 'About 2.5 hours',
    blurb:
      'The same island told through its quieter season. The eruption story, the Viking town and the local food, without the summer crowds.',
    includes: [
      'Eldfell and the story of the eruption',
      'The reconstructed Viking-age stone house',
      'A taste of local Icelandic food',
      'The harbour the islanders refused to lose',
    ],
    adult: 11900,
    child: 5950,
    image: 'island',
  },
  {
    id: 'viking-town',
    name: 'The Viking Town',
    season: 'Short tour',
    window: 'All year',
    duration: 'About 1 hour',
    blurb:
      'A short walk into the islands a thousand years ago. A replica of one of Iceland’s first houses, built stone by stone, beside the old harbour fort.',
    includes: [
      'The reconstructed Viking-age stone house',
      'Skansinn, the old harbour fort',
      'The story of the first settlers',
    ],
    adult: 5900,
    child: 2950,
    image: 'seaCliffs',
  },
]

/* ── The 1973 chapter — sourced public record ─────────────────────────── */
export const ERUPTION = {
  date: '23 January 1973',
  stats: [
    { value: 5300, suffix: '', label: 'islanders evacuated by fishing boat, almost all within hours' },
    { value: 5, suffix: ' months', label: 'of eruption from the new fissure beside the town' },
    { value: 200, prefix: '~', suffix: ' m', label: 'tall, the brand new cone they named Eldfell' },
    { value: 20, suffix: '%', label: 'larger, the island the lava left behind' },
  ],
  body: [
    'At about two in the morning on 23 January 1973, the ground split open barely a kilometre from the centre of town. By a stroke of luck the fishing fleet was in harbour, and within hours nearly every one of the island’s 5,300 people was safely across the water on the mainland.',
    'As the lava crept toward the harbour mouth, the town’s lifeline, the islanders did something no one had tried at full scale before. They pumped seawater onto the advancing flow to cool and harden it. It worked. The lava stopped short, and the cooled wall left the harbour better sheltered than before.',
    'When it was over, the islanders came back and dug their town out of the ash. Today it is sometimes called the Pompeii of the North, and the new mountain, Eldfell, is the one you stand on with us.',
  ],
}

/* ── Archipelago — the illustrative map ───────────────────────────────── */
export interface Isle {
  id: string
  name: string
  /** % position on the illustrative chart */
  x: number
  y: number
  r: number
  /** real, sourced fact */
  fact: string
  tone: 'home' | 'puffin' | 'fire' | 'young'
}

export const ARCHIPELAGO: Isle[] = [
  {
    id: 'heimaey',
    name: 'Heimaey',
    x: 46,
    y: 52,
    r: 16,
    fact: 'The only inhabited island, home to about 4,300 people and the harbour every tour leaves from.',
    tone: 'home',
  },
  {
    id: 'storhofdi',
    name: 'Stórhöfði',
    x: 40,
    y: 78,
    r: 8,
    fact: 'The windswept southern cape, edge of a colony of roughly 1.6 million puffins, one of the largest on earth.',
    tone: 'puffin',
  },
  {
    id: 'eldfell',
    name: 'Eldfell',
    x: 58,
    y: 40,
    r: 7,
    fact: 'The cone born in the 1973 eruption. You can still feel the warmth in the ground near the top.',
    tone: 'fire',
  },
  {
    id: 'surtsey',
    name: 'Surtsey',
    x: 16,
    y: 84,
    r: 7,
    fact: 'Rose from the sea in 1963 to 1967 and is now a UNESCO reserve. No one may land, so we watch it from the water.',
    tone: 'young',
  },
  { id: 'ellidaey', name: 'Elliðaey', x: 74, y: 24, r: 6, fact: 'One of about fifteen uninhabited islands, a few with a single lonely hunting cabin.', tone: 'home' },
  { id: 'bjarnarey', name: 'Bjarnarey', x: 70, y: 60, r: 5, fact: 'Green-topped and sheer, the kind of cliff seabirds nest on by the thousand.', tone: 'puffin' },
]

/* ── Reviews (sample, disclaimed in footer) ───────────────────────────── */
export interface Review {
  quote: string
  name: string
  place: string
}

export const REVIEWS: Review[] = [
  {
    quote:
      'Ebbi made the whole island come alive. Hundreds of puffins, and then standing where the lava stopped in 1973. The best thing we did in Iceland.',
    name: 'Marta K.',
    place: 'Germany',
  },
  {
    quote:
      'A small group, a local who clearly loves his island, and puffins everywhere you look. Do not skip the Westman Islands.',
    name: 'James & Eleanor',
    place: 'United Kingdom',
  },
  {
    quote:
      'We met Ebbi at the harbour and three hours later we understood why people fall for Heimaey. Warm, funny and full of stories.',
    name: 'Sofie L.',
    place: 'Denmark',
  },
]

/* ── Trust facts (safe, true) ─────────────────────────────────────────── */
export const TRUST = [
  'One of the world’s largest puffin colonies',
  'Family run, on Heimaey',
  'Small groups, a local guide',
  'Leaves from the harbour',
]

/* ── Plan-your-visit facts ────────────────────────────────────────────── */
export const PLAN = {
  season: 'Puffins arrive in mid April and leave by mid August, with June and July at their best. The volcano, the Viking town and the food are there all year.',
  ferry:
    'The Herjólfur ferry crosses from Landeyjahöfn to Heimaey in about 35 minutes, several times a day. There is also a short flight from Reykjavík in season.',
  meet:
    'We meet at the harbour at Básaskersbryggja 8, a few minutes from the ferry. Look for the puffin.',
}

export const isk = (n: number) => 'ISK ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
