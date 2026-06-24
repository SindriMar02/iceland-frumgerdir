/**
 * Sample content for the Sauðárkróksbakarí redesign — "Dögun í Skagafirði"
 * (Daybreak): a dark 4am oven that scrolls into the bright marble counter.
 *
 * HONESTY: opening hours, prices and review wording are SAMPLE data — the shared
 * PreviewFooter disclaims this on every page, and prices are labelled "sýnishorn".
 *
 * Products shown are FACT-CHECKED — only items sourced to THIS bakery via reviews
 * (Tripadvisor / HappyCow) or its own service description appear here:
 *   • snúður in three glazes (chocolate / caramel / sugar) — the signature, vegan
 *   • pink-iced donut (bleikur kleinuhringur) — a specifically reviewed item
 *   • Nutella-filled langjón-style "Nutellastöng" — a named house original
 *   • Danish-style rúgbrauð + homemade breads
 *   • vegan croissant, soup of the day, coffee (oat milk available)
 * Deliberately DROPPED (no source ties them to this bakery): kransakaka, hálfmánar,
 * lakkrístoppar, randalín, marengs, vínarbrauð-as-a-named-star. Do not re-add without
 * a real source. Vegan/oat-milk shown as "í boði" (available), never guaranteed.
 *
 * Verified facts: founded ~1880 (one of the oldest bakeries in Iceland), rebuilt
 * after a fire in 1979, Aðalgata 5 (550 Sauðárkrókur), phone +354 455 5000, ~40
 * seats in & out, Tripadvisor 4,7 + Travelers' Choice.
 */

/** Local image folder (drop Seedream 4.5 photos here — see IMAGE-PROMPTS.md). */
const IMG_BASE = `${import.meta.env.BASE_URL}saudarkroksbakari/`

/** Named image slots used outside the product gallery. */
export const IMG = {
  /** Hero: macro of the chocolate snúður swirl, spotlit in the dark (full-bleed). */
  heroSwirl: `${IMG_BASE}hero-swirl.jpg`,
  heroSwirlWide: `${IMG_BASE}hero-swirl-wide.jpg`,
  /** Dark chapter: baker sliding loaves into the glowing 1880 oven. */
  ovenHands: `${IMG_BASE}oven-hands.jpg`,
  /** Bright chapter: the real interior — white marble + pine, morning light. */
  interiorMarble: `${IMG_BASE}interior-marble.jpg`,
  /** Bright chapter: latte with oat milk, on marble by the window. */
  coffee: `${IMG_BASE}kaffi.jpg`,
} as const

export interface Product {
  id: string
  /** Icelandic name */
  name: string
  /** English gloss for travellers */
  en: string
  /** One warm line */
  blurb: string
  /** Machined spec line (mono) — glaze / style / note */
  spec: string
  /** Sample price label, e.g. "frá 450 kr" */
  price: string
  /** Optional small tag, e.g. "Vinsælast", "Vegan", "Hússérstaða" */
  tag?: string
  /** Local product photo (4:5) */
  img: string
  /** Honest descriptive alt */
  alt: string
}

/**
 * The bright "counter" gallery — fact-checked items only, signature snúður first.
 * Order reads like the real case: the snúður trio, the pink donut, the house
 * original, the heritage rye, a vegan option, then coffee.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'snudur-sukkuladi',
    name: 'Snúður með súkkulaði',
    en: 'Chocolate-glazed cinnamon bun',
    blurb: 'Það sem bakaríið er þekktast fyrir: mjúkur snúður undir stökkri súkkulaðihúð.',
    spec: 'Súkkulaðiglassúr · til í vegan',
    price: 'frá 450 kr',
    tag: 'Vinsælast',
    img: `${IMG_BASE}snudur-sukkuladi.jpg`,
    alt: 'Snúður með glansandi dökkri súkkulaðihúð á ljósu marmaraborði',
  },
  {
    id: 'snudur-karamellu',
    name: 'Snúður með karamellu',
    en: 'Caramel-glazed cinnamon bun',
    blurb: 'Sami mjúki snúðurinn, vafinn í glansandi karamellu sem mörgum þykir sú besta.',
    spec: 'Karamelluglassúr · til í vegan',
    price: 'frá 450 kr',
    img: `${IMG_BASE}snudur-karamellu.jpg`,
    alt: 'Snúður með gljáandi ljósbrúnni karamelluhúð á marmaraborði',
  },
  {
    id: 'snudur-sykur',
    name: 'Snúður með sykri',
    en: 'Sugar-glazed cinnamon bun',
    blurb: 'Klassíski snúðurinn með ljósum sykurglassúr, eins og hann hefur alltaf verið.',
    spec: 'Sykurglassúr · til í vegan',
    price: 'frá 450 kr',
    img: `${IMG_BASE}snudur-sykur.jpg`,
    alt: 'Snúður með ljósum, hálfgagnsæjum sykurglassúr á marmaraborði',
  },
  {
    id: 'kleinuhringur-bleikur',
    name: 'Bleikur kleinuhringur',
    en: 'Pink-iced donut',
    blurb: 'Bleik glassúrhúð yfir mjúkum hring, uppáhald margra í morgunsárið.',
    spec: 'Bleikur glassúr',
    price: 'frá 390 kr',
    tag: 'Litríkt',
    img: `${IMG_BASE}kleinuhringur-bleikur.jpg`,
    alt: 'Kleinuhringur með glansandi bleikri glassúrhúð á marmaraborði',
  },
  {
    id: 'nutellastong',
    name: 'Nutellastöng',
    en: 'Nutella-filled pastry',
    blurb: 'Löng smjördeigsstöng fyllt með Nutella í stað vanillukrems. Sannkölluð hússérstaða.',
    spec: 'Heimagerð · í anda langjóns',
    price: 'frá 590 kr',
    tag: 'Hússérstaða',
    img: `${IMG_BASE}nutellastong.jpg`,
    alt: 'Löng gyllt smjördeigsstöng fyllt með Nutella, skorin svo fyllingin sést',
  },
  {
    id: 'rugbraud',
    name: 'Danskt rúgbrauð',
    en: 'Danish-style rye bread',
    blurb: 'Þétt og dökkt rúgbrauð, bakað á staðnum eftir gamalli hefð.',
    spec: 'Heimabakað · dökkt',
    price: 'frá 890 kr',
    img: `${IMG_BASE}rugbraud.jpg`,
    alt: 'Dökkt danskt rúgbrauð, ein þykk sneið skorin frá, á marmaraborði',
  },
  {
    id: 'vegan-croissant',
    name: 'Vegan croissant',
    en: 'Vegan croissant',
    blurb: 'Laufþunnt deig í mörgum lögum, með jurtaosti og grænmeti. Tilvalið í hádeginu.',
    spec: 'Vegan · heitt eða kalt',
    price: 'frá 790 kr',
    tag: 'Vegan',
    img: `${IMG_BASE}vegan-croissant.jpg`,
    alt: 'Vegan croissant með jurtaosti og grænmeti, lögin sjást í skurðinum',
  },
  {
    id: 'kaffi',
    name: 'Kaffi',
    en: 'Coffee',
    blurb: 'Cappuccino eða latte, með haframjólk ef þú vilt, til að setjast niður með.',
    spec: 'Haframjólk í boði',
    price: 'frá 590 kr',
    img: `${IMG_BASE}kaffi.jpg`,
    alt: 'Latte með mjólkurlist í einföldum bolla á marmaraborði við glugga',
  },
]

export interface TimelineEntry {
  year: string
  note: string
}

/**
 * The 1880 lineage — kept to facts the bakery itself records: founded ~1880,
 * rebuilt after the 1979 fire, still on the same corner. No invented dated events
 * (the once-listed 1938 building date is dropped — not independently verified).
 */
export const TIMELINE: TimelineEntry[] = [
  { year: '1880', note: 'Ofninn er kveiktur við Aðalgötu. Eitt elsta bakarí landsins verður til.' },
  { year: '1979', note: 'Eldur kemur upp í húsinu. Það er endurreist og ofninn kveiktur á ný.' },
  { year: 'Í dag', note: 'Enn bakað á sama horni á hverjum morgni, með Travelers’ Choice á Tripadvisor.' },
]

export interface HeritageStat {
  value: string
  label: string
}

/** The 1880 numbers — all verified or simply true. */
export const HERITAGE_STATS: HeritageStat[] = [
  { value: '1880', label: 'Bakað frá' },
  { value: '146', label: 'Ár á sama horni' },
  { value: '4,7', label: 'Stjörnur á Tripadvisor' },
  { value: '40', label: 'Sæti inni og úti' },
]

export interface Review {
  quote: string
  author: string
  meta: string
}

/**
 * Trust quotes — SAMPLE wording, disclaimed in the footer, but grounded in the
 * real sentiment found while fact-checking (best cinnamon bun in Iceland, the
 * pink donut + oat-milk latte, the Danish rye, everything homemade).
 */
export const REVIEWS: Review[] = [
  {
    quote: 'Besti snúður sem við höfum smakkað á Íslandi — ofnheitur með stökku súkkulaði ofan á.',
    author: 'Ferðalangur á leið norður',
    meta: 'Sýnishorn af umsögn',
  },
  {
    quote: 'Bleikur kleinuhringur í morgunmat og latte með haframjólk. Fullkomið stopp í Skagafirði.',
    author: 'Gestur á sumardegi',
    meta: 'Sýnishorn af umsögn',
  },
  {
    quote: 'Danska rúgbrauðið er virkilega gott og allt heimabakað. Gamalt bakarí með sál.',
    author: 'Gestur úr héraði',
    meta: 'Sýnishorn af umsögn',
  },
]

export interface DayHours {
  /** Icelandic day range */
  day: string
  /** Hours string, or "Lokað" */
  hours: string
  /** Weekday indices this row covers (0=Sun … 6=Sat), for the live open/closed read. */
  days: number[]
  /** Sample open/close in 24h minutes from midnight; null = closed. */
  open: number | null
  close: number | null
}

/** SAMPLE opening hours — marked as sýnishorn on the page + disclaimed in footer. */
export const HOURS: DayHours[] = [
  { day: 'Mánudaga til föstudaga', hours: '7:30 – 18:00', days: [1, 2, 3, 4, 5], open: 7 * 60 + 30, close: 18 * 60 },
  { day: 'Laugardaga', hours: '8:00 – 16:00', days: [6], open: 8 * 60, close: 16 * 60 },
  { day: 'Sunnudaga', hours: '9:00 – 16:00', days: [0], open: 9 * 60, close: 16 * 60 },
]

/** The day's reasons, shown as a small rotating "still warm" ticker line. */
export const FRESH_LINE: string[] = [
  'Ofninn er kveiktur',
  'Snúðar beint úr ofninum',
  'Súpa dagsins í hádeginu',
  'Kaffi á könnunni',
]

/** Practical visit facts (verified). */
export const VISIT = {
  street: 'Aðalgata 5',
  town: '550 Sauðárkrókur',
  region: 'Skagafjörður',
  tel: '+3544555000',
  telLabel: '455 5000',
  email: 'saudarkroksbakari@gmail.com',
} as const
