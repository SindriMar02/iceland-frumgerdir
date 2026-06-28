/* ────────────────────────────────────────────────────────────────────────
 *  Brúnastaðir — "The Rind Library"
 *  Static copy & data. All facts strictly per the brief's verifiedFacts.
 *  NO prices are published by the farm — every ISK figure here is a clearly
 *  labelled SAMPLE ("sýnishorn af verði"), never presented as a real price.
 * ──────────────────────────────────────────────────────────────────────── */

/* ── Palette — aged-rind system ───────────────────────────────────────── */
export const C = {
  ground: '#F4ECDA', // warm aged-paper cream
  surface: '#FBF6EA', // label paper
  ink: '#241B12', // deep roast-brown near-black
  muted: '#5E4E3C', // body / metadata on cream (AA)
  accent: '#8A4B22', // washed-rind ochre-brown
  pasture: '#5B6B42', // pasture green (used sparingly)
  rule: 'rgba(138,75,34,0.30)', // ochre rule, low weight
  hair: 'rgba(36,27,18,0.12)', // hairline on cream
} as const

/* ── Unsplash helpers (srcSet + sizes ready) ──────────────────────────── */
export const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`
export const srcSet = (id: string) =>
  `${u(id, 720)} 720w, ${u(id, 1200)} 1200w, ${u(id, 1800)} 1800w, ${u(id, 2400)} 2400w`

/* Vetted image ids (pre-approved by the upgrade brief's image map) */
export const IMG = {
  wheel: '1654184729393-e9d3b8c589c5', // hero single wheel / Brúnó flagship
  wedge: '1632200751394-832eb7d4ce5d', // cut wedge — hero secondary layer / Fljóti
  wedge2: '1655662844300-e59c3d2e7587', // hard wedge — Þöll
  havarti: '1743193144224-d2db90ea7784', // creamy havarti / honey pairing tile
  valley: '1637354895830-a26021dfa658', // green valley — provenance overture full-bleed
  pasture: '1762571808926-2555640f12a6', // goats grazing — stage 01 + Visit feature
  milk: '1550583724-b2692b85b150', // pouring milk — stage 02
  cave: '1566935404705-c22355bfa3ac', // aging racks — stage 03
  board: '1707037490964-64df542d3c97', // warm cheese board — pairings feature
  texture: '1654184738790-642db81e3a99', // rind macro — newsletter texture
} as const

/* ── The Living Label — spec rows that morph to provenance ────────────── */
export const SPEC_ROWS = [
  { k: 'Type', v: 'Hard goat cheese' },
  { k: 'Rind', v: 'Washed in IPA during aging' },
  { k: 'Aged', v: '3 months or more' },
  { k: 'Origin', v: '570 Fljót · Skagafjörður' },
] as const

export const PROVENANCE_ROWS = [
  { k: 'Herd', v: '55 goats · 30 sheep' },
  { k: 'To cheese', v: '~10% goat milk · ~20% sheep' },
  { k: 'The loop', v: 'Goats fed brewery spent grain' },
  { k: 'Award', v: 'Agricultural Award 2025' },
] as const

/* Hero stat chips — quiet facts filling the lower-left of the plate */
export const HERO_STATS = [
  { v: '1 farm · 1 valley', k: 'Made on its own land' },
  { v: '55 goats · 30 sheep', k: 'The herd' },
  { v: 'Aged 3 mo +', k: 'Washed in IPA' },
] as const

/* ── Provenance strip — pasture → milk → cave → wheel ─────────────────── */
export interface Stage {
  no: string
  title: string
  copy: string
  note: string // field-note metadata row (Manrope), ties to label system
  img: keyof typeof IMG
  alt: string
  node: 'pasture' | 'accent'
}

export const STAGES: Stage[] = [
  {
    no: '01',
    title: 'The pasture',
    copy: 'Fifty-five goats and thirty sheep graze a short, intense northern summer in the Fljót valley — green between the mountains and the Arctic sea.',
    note: 'Herd · 55 goats · 30 sheep',
    img: 'pasture',
    alt: 'Illustrative photo of goats grazing a green northern pasture (sample imagery)',
    node: 'pasture',
  },
  {
    no: '02',
    title: 'The milk',
    copy: 'Only about a tenth of the goat milk and a fifth of the sheep milk is set aside for cheese. The rest stays on the farm. Small batches, by hand.',
    note: '~10% goat milk · ~20% sheep milk to cheese',
    img: 'milk',
    alt: 'Illustrative photo of fresh milk being poured, warm and rustic (sample imagery)',
    node: 'accent',
  },
  {
    no: '03',
    title: 'The cave',
    copy: 'Wheels rest on wooden racks while Brúnó takes on its washed rind — bathed in IPA from Segli in Siglufjörður, the brewery down the road.',
    note: 'Washed in Segli IPA · Siglufjörður',
    img: 'cave',
    alt: 'Illustrative photo of round cheese wheels aging on wooden racks (sample imagery)',
    node: 'accent',
  },
  {
    no: '04',
    title: 'The wheel',
    copy: 'A closed loop of place — pasture, milk, beer, cave, wheel — that won the 2025 Icelandic Agricultural Award. One farm. One valley.',
    note: 'Icelandic Agricultural Award · 2025',
    img: 'wheel',
    alt: 'Illustrative close-up of a whole farmhouse cheese wheel with a washed rind (sample imagery)',
    node: 'accent',
  },
]

/* ── The Cheese Library — the FOUR real cheeses only ──────────────────── */
export interface Cheese {
  name: string
  kind: string
  milk: string
  age: string
  texture: string
  note: string
  sample: number // SAMPLE price in ISK — never a published price
  img: keyof typeof IMG
  alt: string
  offset: number // staggered vertical offset (desktop)
}

/* Brúnó is promoted to a FEATURED entry in Page.tsx; this is its longer note. */
export const BRUNO: Cheese & { story: string } = {
  name: 'Brúnó',
  kind: 'Washed-rind · the flagship',
  milk: 'Goat milk',
  age: '3 months +',
  texture: 'Hard',
  note: 'Washed in IPA during aging — Bændablaðið reports a 3× dip and a 10-month wheel.',
  story:
    'The wheel the whole valley points to: a hard goat cheese whose rind is washed, again and again, in IPA from Segli — the brewery down the road in Siglufjörður. Bændablaðið reports a triple dip and a wheel aged as long as ten months. The same brewery’s spent grain goes back to feed the goats. Pasture, milk, beer, cave, wheel: a closed loop you can taste.',
  sample: 4200,
  img: 'wheel',
  alt: 'Illustrative close-up of a hard washed-rind goat cheese, the flagship Brúnó (sample imagery)',
  offset: 0,
}

/* The other three sit as a denser staggered shelf to Brúnó's right. */
export const CHEESES: Cheese[] = [
  {
    name: 'Havarti',
    kind: 'Danish recipe · semi-hard',
    milk: 'Goat milk',
    age: 'Young',
    texture: 'Mild · creamy',
    note: 'Mild and creamy; also made in a herb version.',
    sample: 2900,
    img: 'havarti',
    alt: 'Illustrative photo of a creamy semi-hard goat Havarti (sample imagery)',
    offset: 0,
  },
  {
    name: 'Fljóti',
    kind: 'Salad cheese',
    milk: 'Goat milk',
    age: 'Fresh',
    texture: 'Feta-inspired',
    note: 'Feta-inspired; good baked with a drizzle of honey.',
    sample: 2600,
    img: 'wedge',
    alt: 'Illustrative photo of a fresh feta-inspired salad cheese (sample imagery)',
    offset: 40,
  },
  {
    name: 'Þöll',
    kind: 'Aged blend',
    milk: 'Sheep + goat',
    age: '6 months min',
    texture: 'Hard · sharp',
    note: 'A blend of sheep and goat milk, aged at least six months — hard and sharp.',
    sample: 4600,
    img: 'wedge2',
    alt: 'Illustrative photo of a hard, aged sheep-and-goat blend cheese (sample imagery)',
    offset: 14,
  },
]

/* ── Pairings — "At the table". Serving ideas drawn from verified facts. ─ */
export interface Pairing {
  cheese: string
  with: string
  copy: string
  img: keyof typeof IMG
  alt: string
}

export const PAIRINGS: Pairing[] = [
  {
    cheese: 'Brúnó',
    with: 'A dark Segli ale',
    copy: 'The washed rind and the beer it bathed in, back in the same glass — bread, a little honey on the side.',
    img: 'board',
    alt: 'Illustrative photo of washed-rind cheese served with a dark ale (sample imagery)',
  },
  {
    cheese: 'Fljóti',
    with: 'Baked, with honey',
    copy: 'The feta-inspired salad cheese, warmed through with a drizzle of honey — the way the farm serves it.',
    img: 'havarti',
    alt: 'Illustrative photo of fresh cheese baked with a drizzle of honey (sample imagery)',
  },
  {
    cheese: 'Havarti',
    with: 'On its own, or herbed',
    copy: 'Mild and creamy, sliced plain on rye — or reach for the herb version when the board needs lift.',
    img: 'wedge',
    alt: 'Illustrative photo of creamy Havarti sliced on rye (sample imagery)',
  },
  {
    cheese: 'Þöll',
    with: 'Sharp, on dark rye',
    copy: 'Six months of sheep-and-goat, hard and sharp — the strongest note to finish a board.',
    img: 'wedge2',
    alt: 'Illustrative photo of a sharp aged cheese on dark rye (sample imagery)',
  },
]

/* ── Awards — confirmed only ──────────────────────────────────────────── */
export const AWARDS = [
  { year: '2025', label: 'Icelandic Agricultural Award', meta: 'Winner' },
  { year: '', label: 'Embla Nordic Food Awards', meta: 'Nominee' },
  { year: '2025', label: 'Featured in Bændablaðið', meta: 'Press' },
] as const

/* Press pull-quote — attributed, used to fill the Recognised left column. */
export const PRESS = {
  quote: 'A closed loop of place — pasture, milk, beer, cave, wheel.',
  source: 'The Brúnastaðir story',
  attribution: 'as reported by Bændablaðið, 2025',
} as const

/* Slow marquee credibility tokens (Tryst/Manrope caps). */
export const MARQUEE = [
  'Iceland’s only farm-made cheese',
  'Agricultural Award 2025',
  'Embla Nordic nominee',
  'Featured in Bændablaðið',
  '570 Fljót · Skagafjörður',
  'Washed in Segli IPA',
] as const

export const FARM = {
  address: '570 Fljót, Skagafjörður',
  hours: '13:00 – 18:00 daily',
  season: 'Summer',
  zoo: 'Petting zoo & farm shop on site',
  email: 'brunastadir@brunastadir.is',
} as const

/* "More at Brúnastaðir" — verified offerings at the farm. */
export const MORE_AT = [
  { k: 'Farm shop', v: 'Buy the wheels direct, at the source' },
  { k: 'Petting zoo', v: 'Meet the goats and the sheep' },
  { k: 'Guesthouse', v: 'Stay the night in the valley' },
  { k: 'Party hall', v: 'A space for gatherings on the farm' },
] as const
