/**
 * Ljómalind Local Market — "Hillan" (the shelf index)
 * Every fact, name, quote and category below is sourced from the locked brief
 * + dossier ONLY. No invented producers, no prices, no kennitala, no star rating,
 * no current-staff names. See honesty guardrails in the brief.
 */

/* ── Palette (brief-locked, AA contrast computed via WCAG relative-luminance
 * formula — see palette derivation below, not eyeballed) ──────────────────
 * ink/ground   11.62:1   muted/ground 5.38:1   rust/ground  4.78:1
 * moss/ground   5.24:1   honey/ground 3.14:1*  indigo/ground 7.63:1
 * *honey fails AA at small text sizes — HONEY_TEXT is the darkened variant
 * for any small-text use; HONEY itself is fine for large/bold text (≥3:1) and
 * for fills/swatches. Darkened *_TEXT variants below all clear 4.5:1 on both
 * GROUND and CARD. */
export const GROUND = '#ECE6D2' // warm hay-paper (NOT the banned near-cream #F6F1E7)
export const CARD = '#F4EFDE' // slightly lifted card fill
export const INK = '#2A2A1D' // olive-brown ink, 11.62:1 on ground
export const MUTED = '#615C46' // muted ink for secondary copy, 5.38:1 on ground

/* Four dye-lot accents — the identity: a co-op of ~70 makers reads as many
 * colours, not one brand accent. RUST is the shopfront/CTA colour (jam jars,
 * the market's awning trim). MOSS reads as farm produce. HONEY is honey and
 * jam jars. INDIGO is the cool woad/hand-dyed-wool colour that breaks the
 * page off an all-warm-cream look — used for the Ull og handverk category
 * and at least one story stat so it reads as a real accent, not a token
 * gesture. */
export const RUST = '#B23A1E'
export const RUST_TEXT = '#97311A' // 6.07:1 on ground / 6.59:1 on card
export const MOSS = '#55632F'
export const MOSS_TEXT = '#485428' // 6.53:1 on ground / 7.09:1 on card
export const HONEY = '#A9772A'
export const HONEY_TEXT = '#7A561E' // 5.29:1 on ground / 5.74:1 on card
export const INDIGO = '#33456B'
export const INDIGO_TEXT = '#2D3D5E' // 8.66:1 on ground / 9.40:1 on card

export const HAIRLINE = 'rgba(42,42,29,.14)'
export const CREAM_ON_DARK = 'rgba(236,230,210,.92)'
export const CREAM_DIM = 'rgba(236,230,210,.66)'

export const EASE = 'cubic-bezier(.22,.61,.21,1)'

/* ── Local real/vetted assets (copied into public/ljomalind/) ───────────── */
export const asset = (file: string) => `${import.meta.env.BASE_URL}ljomalind/${file}`

export const IMG = {
  /** #1 REAL Ljómalind storefront, Borgarnes (DV.is 2018, signage unchanged). */
  storefront: asset('ljomalind-dv-storefront-full.jpg'),
  /** #2 REAL Ljómalind interior — the wool-shelf / "Alrún" rack. */
  interior: asset('westis-hero-1280.jpg'),
  /** #3 Sheep on Icelandic pasture (Landmannalaugar, confirmed). */
  sheep: asset('unsplash-sheep-pasture.jpg'),
  /** #4 Hand-dyed yarn on a pegboard — generic craft shelf, texture only. */
  yarn: asset('unsplash-yarn-shop-display.jpg'),
  /** #5 Jarred honey — generic, captioned generically. */
  honey: asset('unsplash-honey-jars-market.jpg'),
  /** #6 Single artisan loaf on a board. */
  bread: asset('unsplash-rye-bread-board.jpg'),
  /** #7 Green rolling hills + small farm (Iceland, confirmed). */
  hills: asset('unsplash-west-iceland-hills-farm.jpg'),
  /** #8 Turf houses — heritage divider only, never "the market". */
  turf: asset('unsplash-turf-houses.jpg'),
  /** #9 Fair-isle knit texture close-up. */
  knit: asset('unsplash-knit-texture.jpg'),
  /** #10 Homemade jam jars — generic, captioned generically. */
  jam: asset('unsplash-jam-jars.jpg'),
  /** #11 Handmade ceramic bowls. */
  ceramic: asset('unsplash-ceramic-bowls.jpg'),
} as const

/* ── Verified contact facts (Part A) ────────────────────────────────────── */
export const PHONE = '437 1400'
export const PHONE_HREF = 'tel:+3544371400'
export const EMAIL = 'ljomalind@ljomalind.is'
export const ADDRESS = 'Brúartorg 4, 310 Borgarnes'
export const HOURS = 'Opið alla daga, 10:00–18:00'
export const HOURS_SHORT = 'Alla daga 10–18'
export const OPEN_MIN = 10 * 60
export const CLOSE_MIN = 18 * 60
export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Ljómalind%2C%20Brúartorg%204%2C%20310%20Borgarnes'
export const MAPS_EMBED =
  'https://www.google.com/maps?q=Ljómalind,+Brúartorg+4,+310+Borgarnes&output=embed'

/* ── Categories — the co-op's four DV.is-2018 buckets, each carrying one of
 * the four dye-lot accents (this pairing is the visual identity: Ull og
 * handverk gets the cool indigo because wool is hand-dyed; Leirlist gets
 * rust as a fired-clay/terracotta tone; Hunang og sultur gets honey;
 * Matur af býli gets moss as the farm/pasture tone). `key` is used only to
 * filter the producer index below — it is a UI grouping, not a new fact. ── */
export interface Category {
  key: 'matur' | 'ull' | 'leir' | 'hunang'
  is: string
  sub: string
  img: string
  tone: string
  toneText: string
}

export const CATEGORIES: Category[] = [
  { key: 'matur', is: 'Matur af býli', sub: 'Nautakjöt, fiskur, ostar og ís', img: IMG.hills, tone: MOSS, toneText: MOSS_TEXT },
  { key: 'ull', is: 'Ull og handverk', sub: 'Handspunnið garn og prjónles', img: IMG.knit, tone: INDIGO, toneText: INDIGO_TEXT },
  { key: 'leir', is: 'Leirlist og skart', sub: 'Munir úr leir, tré og horni', img: IMG.ceramic, tone: RUST, toneText: RUST_TEXT },
  { key: 'hunang', is: 'Hunang og sultur', sub: 'Lagað og sett í krukkur í héraði', img: IMG.honey, tone: HONEY, toneText: HONEY_TEXT },
]

/* ── Producer index rows (categories from DV.is 2018 list ONLY) ────────────
 * Each row: category + one honest short line + a manifest image. No prices,
 * no named farms beyond "Alrún" (which is visibly on-shelf in the real
 * photo). `catKey` groups each row under one of the four CATEGORIES above —
 * derived purely from matching each row's own `line`/`tag` copy against the
 * matching category's `sub` copy (e.g. the "ostar" row's "ostar og ís" is
 * literally listed in the "Matur af býli" category's sub-line); this is a
 * grouping of existing verified copy, not a new fact. "Grænmeti eftir
 * árstíð" has no verified photo — see brief's "no vegetable photo" gap — and
 * is grouped under matur (farm produce) for filtering purposes only. */
export interface ProducerRow {
  key: string
  catKey: Category['key']
  is: string
  tag: string // mono "til sölu" style category tag
  line: string
  /** Omit when no honest, correctly-matched photo exists for this row
   *  (e.g. seasonal vegetables — see brief's "no vegetable photo" gap).
   *  Consumers must render photo-light, never substitute another stock shot. */
  img?: string
  alt?: string
}

export const PRODUCERS: ProducerRow[] = [
  {
    key: 'kjot',
    catKey: 'matur',
    is: 'Kjöt og fiskur',
    tag: 'Beint af býli',
    line: 'Ferskt nautakjöt og fiskur frá framleiðendum í nágrenninu.',
    img: IMG.hills,
    alt: 'Grænar hæðir og lítill bær í dalverpi á Vesturlandi',
  },
  {
    key: 'ostar',
    catKey: 'matur',
    is: 'Ostar og ís',
    tag: 'Mjólkurafurðir',
    line: 'Kúa- og geitaostar og heimalagaður ís úr héraðinu.',
    img: IMG.sheep,
    alt: 'Sauðfé á beit í íslensku hálendisdalverpi með fífu í blóma',
  },
  {
    key: 'sultur',
    catKey: 'hunang',
    is: 'Sultur og hunang',
    tag: 'Sett í krukkur',
    line: 'Sultur, mauk og hunang, lagað og sett í krukkur í höndunum.',
    img: IMG.jam,
    alt: 'Krukkur af heimalagaðri sultu með handskrifuðum miðum á tréborði',
  },
  {
    key: 'ull',
    catKey: 'ull',
    is: 'Ull og prjónles',
    tag: 'Handspunnið',
    line: 'Handspunnið og handlitað garn, prjónað af heimafólki. Kápur og sjöl frá Alrún.',
    img: IMG.yarn,
    alt: 'Handlitað garn á tréhillu í verslun, ásamt munstruðum prjónavarningi',
  },
  {
    key: 'leir',
    catKey: 'leir',
    is: 'Leirlist og skart',
    tag: 'Handgert',
    line: 'Leirmunir, skartgripir og hlutir úr tré og horni frá handverksfólki.',
    img: IMG.ceramic,
    alt: 'Litlir handgerðir leirskálar í ólíkri glerungslitun',
  },
  {
    key: 'grænmeti',
    catKey: 'matur',
    is: 'Grænmeti eftir árstíð',
    tag: 'Eftir árstíð',
    line: 'Tómatar, gúrkur og melónur þegar sprettan leyfir (skv. umfjöllun DV, 2018).',
    // No verified photo of this row's produce exists (see brief) — rendered
    // photo-light in Page.tsx rather than substituted with an unrelated stock shot.
  },
]

/* ── Reviews (Part A, sourced; no star number) ─────────────────────────────
 * #1/#2 are the guest's own English TripAdvisor sentences (each review page
 * contributes two adjacent fragments, separated here by a period rather than
 * stitched with a dash — never joined as if they were one continuous
 * sentence). #3 is NOT a first-person quote: the brief sources it as a
 * third-person paraphrase of Anton Freyr Arnarsson's getlocal.is
 * recommendation, so it is rendered here as an attributed description in
 * Icelandic, not invented first-person wording in his mouth. */
export const REVIEWS = [
  {
    quote: 'Something different from the typical souvenirs. Friendly staff, interesting items.',
    title: '„Genuine Icelandic Products“',
    source: 'TripAdvisor',
    href: 'https://www.tripadvisor.com/ShowUserReviews-g608868-d6367198-r511902497-Ljomalind_Local_Market-Borgarnes_Borgarbyggd_West_Region.html',
    lang: 'en',
  },
  {
    quote:
      'A co-op run by several women from the area who take turns staffing the store. Everything is made by the volunteers, supporting the local economy.',
    title: '„Cute little shop“',
    source: 'TripAdvisor',
    href: 'https://en.tripadvisor.com.hk/ShowUserReviews-g608868-d6367198-r377395558-Ljomalind_Local_Market-Borgarnes_Borgarbyggd_West_Region.html',
    lang: 'en',
  },
  {
    quote:
      'Anton keypti handprjónaða íslenska ullarpeysu í versluninni og lýsti starfsfólkinu sem einstaklega vinalegu.',
    title: 'Anton Freyr Arnarsson',
    source: 'getlocal.is',
    href: 'https://www.getlocal.is/antonfreyrarnarsson/251/item/ljomalind-local-market-595',
    lang: 'is',
  },
] as const

/* ── Nav ────────────────────────────────────────────────────────────────── */
export const NAV = [
  { id: 'vorur', label: 'Vörur' },
  { id: 'hillan', label: 'Hillan' },
  { id: 'saga', label: 'Sagan' },
  { id: 'heimsokn', label: 'Heimsókn' },
] as const
