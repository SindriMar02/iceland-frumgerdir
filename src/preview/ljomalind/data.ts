/**
 * Ljómalind Local Market — "Beint frá héraðinu"
 * Every fact, name, quote and category below is sourced from the locked brief
 * + dossier ONLY. No invented producers, no prices, no kennitala, no star rating,
 * no current-staff names. See honesty guardrails in the brief.
 */

/* ── Palette (brief-locked, AA-checked) ─────────────────────────────────── */
export const GROUND = '#F6F1E7' // warm oat/cream
export const CARD = '#FCF8EF' // slightly lifted card fill
export const INK = '#2B241C' // near-black warm brown (~14.7:1 on ground)
export const MUTED = '#6A5F4E' // muted ink for secondary copy
export const ACCENT = '#C4472A' // rust-red (awning trim / jam label)
export const ACCENT_TEXT = '#A23B22' // darkened rust for small text (~5.6:1 on ground; ACCENT itself is 4.36:1, fails AA at small sizes)
export const MOSS = '#6E7A4F' // dandelion-mark green — category chips / large-scale fills only
export const MOSS_TEXT = '#535D3C' // darkened moss for small text (~5.9:1 on ground; MOSS itself is 4.1:1, fails AA at small sizes)
export const HAY = '#DCCB9E' // dry-hay tan — dividers / card fills
export const PINE = '#3A4A3A' // deep pine — the one darker "story" band
export const HAIRLINE = 'rgba(43,36,28,.14)'
export const CREAM_ON_DARK = 'rgba(246,241,231,.92)'
export const CREAM_DIM = 'rgba(246,241,231,.66)'

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

/* ── Section 2 — what/who in 5 seconds ──────────────────────────────────── */
export interface Category {
  is: string
  sub: string
  img: string
  tone: string
}

export const CATEGORIES: Category[] = [
  { is: 'Matur af býli', sub: 'Nautakjöt, fiskur, ostar og ís', img: IMG.hills, tone: MOSS },
  { is: 'Ull og handverk', sub: 'Handspunnið garn og prjónles', img: IMG.knit, tone: ACCENT },
  { is: 'Leirlist og skart', sub: 'Munir úr leir, tré og horni', img: IMG.ceramic, tone: PINE },
  { is: 'Hunang og sultur', sub: 'Lagað og sett í krukkur í héraði', img: IMG.honey, tone: ACCENT },
]

/* ── Section 4 — Framleiðendur rows (categories from DV.is 2018 list ONLY) ──
 * Each row: category + one honest short line + a manifest image. No prices,
 * no named farms beyond "Alrún" (which is visibly on-shelf in the real photo). */
export interface ProducerRow {
  key: string
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
    is: 'Kjöt og fiskur',
    tag: 'Beint af býli',
    line: 'Ferskt nautakjöt og fiskur frá framleiðendum í nágrenninu.',
    img: IMG.hills,
    alt: 'Grænar hæðir og lítill bær í dalverpi á Vesturlandi',
  },
  {
    key: 'ostar',
    is: 'Ostar og ís',
    tag: 'Mjólkurafurðir',
    line: 'Kúa- og geitaostar og heimalagaður ís úr héraðinu.',
    img: IMG.sheep,
    alt: 'Sauðfé á beit í íslensku hálendisdalverpi með fífu í blóma',
  },
  {
    key: 'sultur',
    is: 'Sultur og hunang',
    tag: 'Sett í krukkur',
    line: 'Sultur, mauk og hunang, lagað og sett í krukkur í höndunum.',
    img: IMG.jam,
    alt: 'Krukkur af heimalagaðri sultu með handskrifuðum miðum á tréborði',
  },
  {
    key: 'ull',
    is: 'Ull og prjónles',
    tag: 'Handspunnið',
    line: 'Handspunnið og handlitað garn, prjónað af heimafólki. Kápur og sjöl frá Alrún.',
    img: IMG.yarn,
    alt: 'Handlitað garn á tréhillu í verslun, ásamt munstruðum prjónavarningi',
  },
  {
    key: 'leir',
    is: 'Leirlist og skart',
    tag: 'Handgert',
    line: 'Leirmunir, skartgripir og hlutir úr tré og horni frá handverksfólki.',
    img: IMG.ceramic,
    alt: 'Litlir handgerðir leirskálar í ólíkri glerungslitun',
  },
  {
    key: 'grænmeti',
    is: 'Grænmeti eftir árstíð',
    tag: 'Eftir árstíð',
    line: 'Tómatar, gúrkur og melónur þegar sprettan leyfir (skv. umfjöllun DV, 2018).',
    // No verified photo of this row's produce exists (see brief) — rendered
    // photo-light in Page.tsx rather than substituted with an unrelated stock shot.
  },
]

/* ── Section 7 — reviews (Part A, sourced; no star number) ────────────────
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
  { id: 'framleidendur', label: 'Framleiðendur' },
  { id: 'saga', label: 'Sagan' },
  { id: 'heimsokn', label: 'Heimsókn' },
] as const
