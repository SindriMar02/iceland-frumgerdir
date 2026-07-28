/**
 * Heklusýn — "Tólf hús". Fimmtíu hektarar á vesturbakka Ytri-Rangár, aðeins
 * tólf til fjórtán hús á öllu svæðinu. Fágætið er varan.
 *
 * HONESTY GUARDRAILS (sjá BRIEF.md):
 *  - Engin einkunn, engin fjarlægð til Reykjavíkur, engin hnit.
 *  - VERÐ: leiðrétt af verkefnisstjóra eftir endurstaðfestingu á heklusyn.is
 *    (yfirskrifar "FORBIDDEN: any price" í BRIEF.md §2). Eitt verð er birt:
 *    Rangárslétta 2 á 109.000.000 kr. Seld hús sýna "Selt" í verðdálki, nákvæmlega
 *    eins og frumsíðan gerir. Rangárslétta 10 er án birts verðs, því er reiturinn
 *    tómur þar, aldrei ágiskun eða "hafið samband um verð". Ekkert annað verð er
 *    fundið upp, áætlað eða reiknað sem meðaltal.
 *  - "Lúxus" er aldrei notað sem sjálfslýsing.
 *  - Sex myndir eru alvöru ljósmyndir. Fjórar eru tölvumyndir og bera ávallt
 *    sýnilegan "Tölvumynd" merkimiða — aldrei aðeins í alt-texta.
 *  - Öll tala og staðreynd hér er annaðhvort tekin beint upp úr BRIEF.md
 *    ("LOCKED FACTS"), verðleiðréttingunni hér að ofan, eða er hönnunartexti
 *    um síðuna sjálfa (t.d. "ein lína á hvert hús"), aldrei ný staðreynd um
 *    landið eða húsin.
 */

const BASE = import.meta.env.BASE_URL
export const IMG = (file: string) => `${BASE}heklusyn/${file}`

/* ── Contact — verbatim from BRIEF §2 ───────────────────────────────────── */
export const EMAIL = 'heklusyn@heklusyn.is'
export const EMAIL_HREF = 'mailto:heklusyn@heklusyn.is'
export const PHONE_DISPLAY = '+354 822 8080'
export const PHONE_HREF = 'tel:+3548228080'
export const COMPANY_LINE = 'Heklusýn ehf. · kt. 490221-0690'
export const COMPANY_ADDRESS = 'Furubyggð 21, 270 Mosfellsbær'
export const OWNERS =
  'Skúli K. Skúlason og Sigurlaug S. Einarsdóttir, ásamt Sigurði E. Guðmundssyni og Sunnevu Eiðsdóttur'

/* ── Real photographs — may be presented as the place, no chip ─────────── */
export const PHOTOS = {
  heroEstate: { file: 'hero-estate.jpg', alt: 'Loftmynd af landinu í Rangárslétta: húsið í sléttunni, áin og fjöllin í baksýn.' },
  landRiver: { file: 'land-river.jpg', alt: 'Dalurinn, Ytri-Rangá liðast um sléttuna, fjöllin fyrir aftan.' },
  houseAutumn: { file: 'house-autumn.jpg', alt: 'Dökkt hús með palli á þýfðum bakka, haustlitir.' },
  houseBuilt: { file: 'house-built.jpg', alt: 'Fullbúið hús, svartur málmur og timbur, malarinnkeyrsla.' },
  construction: { file: 'construction.jpg', alt: 'Timburgrind rís á rýmdu byggingarsvæði.' },
  winterDusk: { file: 'winter-dusk.jpg', alt: 'Snjór, fjólublátt rökkur, ljós í gluggum.' },
} as const

/* ── Visualisations — every appearance carries a visible "Tölvumynd" chip ─ */
export const VISUALS = {
  living: { file: 'vis-living.jpg', alt: 'Tölvumynd af stofu.', room: 'Stofan' },
  kitchen: { file: 'vis-kitchen.jpg', alt: 'Tölvumynd af eldhúsi.', room: 'Eldhúsið' },
  plan: { file: 'vis-plan.jpg', alt: 'Tölvumynd af grunnmynd húss.', room: 'Grunnmyndin' },
  exterior: { file: 'vis-exterior.jpg', alt: 'Tölvumynd af húsi að utan.', room: 'Að utan' },
} as const

/* ── §3 Sjóndeildarhringurinn — the eight named mountains, verbatim order
   from BRIEF §2. No bearing/elevation/distance data exists, so positions
   are spread evenly and labelled "skýringarmynd" (indicative), never
   presented as a survey. ─────────────────────────────────────────────── */
export interface Mountain { name: string; pos: number }
export const MOUNTAINS: Mountain[] = [
  { name: 'Búrfell', pos: 6 },
  { name: 'Hekla', pos: 19 },
  { name: 'Bjólfell', pos: 31 },
  { name: 'Vatnafjöll', pos: 43 },
  { name: 'Tindfjöll', pos: 55 },
  { name: 'Selsundsfjall', pos: 67 },
  { name: 'Eyjafjallajökull', pos: 80 },
  { name: 'Þríhyrningur', pos: 93 },
]

/* ── §5 Húsin — the ledger. One row per house named in BRIEF §2. Sizes and
   plot areas are stated only where BRIEF gives them; nothing is estimated.
   PRICE — correction from the lead (re-verified live against heklusyn.is,
   overrides BRIEF §2's "no prices" line): Rangárslétta 2 is the one published
   price, 109.000.000 kr. Sold houses show "Selt" in the price column, exactly
   as the source does. Rangárslétta 10 has no published price, so its price
   field is null (rendered as nothing, never a made-up "hafðu samband"
   placeholder). No other price is invented, extrapolated or averaged. ── */
export type HouseStatus = 'selt' | 'til-solu' | 'i-byggingu'
export interface HouseRow {
  name: string
  size: string | null
  plot: string | null
  /** null = no published price (render nothing). 'Selt' for sold houses. */
  price: string | null
  statuses: HouseStatus[]
  note: string
}
export const HOUSES: HouseRow[] = [
  {
    name: 'Rangárslétta 2',
    size: '147 m²',
    plot: '2,1 ha',
    price: '109.000.000 kr.',
    statuses: ['til-solu', 'i-byggingu'],
    note: 'Heilsárshús, um 147 fermetrar að stærð, á lóð sem er um 2,1 hektari. Verð 109.000.000 kr. Nú í byggingu og auglýst til sölu.',
  },
  {
    name: 'Rangárslétta 3',
    size: '168 m²',
    plot: '4,8 ha',
    price: 'Selt',
    statuses: ['selt'],
    note: 'Hús um 168 fermetrar að stærð, á lóð sem er um 4,8 hektarar. Selt.',
  },
  {
    name: 'Rangárslétta 9',
    size: null,
    plot: null,
    price: 'Selt',
    statuses: ['selt'],
    note: 'Selt. Stærð og lóðarmál ekki gefin upp opinberlega.',
  },
  {
    name: 'Rangárslétta 10',
    size: null,
    plot: null,
    price: null,
    statuses: ['til-solu', 'i-byggingu'],
    note: 'Nú í byggingu og auglýst til sölu. Stærð, lóðarmál og verð ekki gefin upp opinberlega.',
  },
  {
    name: 'Rangárslétta 11',
    size: null,
    plot: null,
    price: 'Selt',
    statuses: ['selt', 'i-byggingu'],
    note: 'Selt og nú í byggingu fyrir eiganda. Stærð og lóðarmál ekki gefin upp opinberlega.',
  },
]

export const STATUS_LABEL: Record<HouseStatus, string> = {
  selt: 'Selt',
  'til-solu': 'Til sölu',
  'i-byggingu': 'Í byggingu',
}

/* ── §9 Gögnin — the compliance monument. Counts only, no links: the
   documents are the developer's own and are not republished here. ──────── */
export const DOCUMENTS = [
  { count: '11', label: 'lóðablöð', note: 'Eitt blað á hverja skráða lóð.' },
  { count: '1', label: 'skipulagsgátt', note: 'Deiliskipulag svæðisins.' },
  { count: '1', label: 'hönnunargögn', note: 'Teikningar frá þróunaraðila.' },
]

/* ── §10 Fyrirspurn — enquiry targets ─────────────────────────────────── */
export const ENQUIRY_HOUSES = ['Almenn fyrirspurn', ...HOUSES.map((h) => h.name)]

/* ── Nav / section index (id must match the section wrapper). Kononenko's
   own chrome is a short comma-separated list, not one entry per section —
   KONONENKO-BRIEF §4 gives this exact five-item set verbatim. ──────────── */
export const NAV = [
  { id: 'hk-thesis', label: 'Fágætið' },
  { id: 'hk-horizon', label: 'Fjöllin' },
  { id: 'hk-houses', label: 'Húsin' },
  { id: 'hk-docs', label: 'Gögnin' },
  { id: 'hk-enquiry', label: 'Fyrirspurn' },
] as const
