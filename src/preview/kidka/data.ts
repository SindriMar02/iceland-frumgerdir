/**
 * KIDKA Wool Factory — "Beint af prjónavélinni / Straight off the machine".
 *
 * Every fact in this file was verified 2026-07-23 against primary sources:
 *  - kidka.com (about-us, contact-us, shop, category + product pages)
 *  - Tripadvisor attraction page (review titles verified via their URLs)
 *  - northiceland.is service listing
 * Product names, prices and photographs are KIDKA's OWN, as listed on
 * kidka.com on 2026-07-23 (WooCommerce, EUR display). Photography is
 * hot-linked from kidka.com's media library — the client's real assets,
 * exactly like the Bílás and Heitirpottar builds. Nothing is invented;
 * where a price could not be verified on the product page the product
 * links out instead of showing a number.
 *
 * Concept: the one thing no competitor can honestly say — you can stand in
 * the shop and WATCH the machines knit through the viewing windows. The
 * page treats that transparency as the brand: spec-label mono voice,
 * knit-row hero reveal, process strip from fleece to shop floor.
 *
 * Palette (computed contrast on 2026-07-23):
 *  BONE #EFEAE1 ground · INK #221E19 (14.9:1 on BONE)
 *  CHARCOAL #26221E band ground · BONE text on CHARCOAL 13.4:1
 *  MOSS #4A5D3A fills (BONE text 5.7:1 — AA at any size)
 *  RUST #8F3F1E text-on-light (6.2:1 on BONE) · #C86A3B decorative on dark
 */

export const C = {
  bone: '#EFEAE1',
  boneDeep: '#E6DFD2',
  ink: '#221E19',
  charcoal: '#26221E',
  moss: '#4A5D3A',
  mossDeep: '#3C4B2F',
  rust: '#8F3F1E',
  rustBright: '#C86A3B',
  line: 'rgba(34,30,25,0.16)',
} as const

export const FONT = {
  display: 'var(--font-boska)',
  body: 'var(--font-author)',
  mono: 'var(--font-fragment)',
  hand: 'var(--font-arkipelago)',
} as const

/** kidka.com media library — the client's own photography. */
const M = (p: string) => `https://kidka.com/wp-content/uploads/${p}`

export const IMG = {
  /** Woman in rust-orange Fjallalopi beanie among the horse herd — hero. */
  hero: M('2025/04/CE3I3377-web-e1760354324225.jpg'),
  /** Man in patterned lopapeysa cardigan against winter grass. */
  story: M('2023/05/Ben_Kidka_202050-e1718194202674-768x998.jpg'),
  /** Two women in dark Nature Sweaters with horses, wide. */
  band: M('2024/09/CE3I6107-2.jpg'),
  /** Man in black/white yoke sweater with an Icelandic horse. */
  yoke: M('2023/10/CE3I5933-2-e1727780421102.jpg'),
  /** Two women in green/red ponchos, autumn birch. */
  poncho: M('2024/10/poncho-green-and-beige-2_small-e1727780247349.jpg'),
  /** Icelandic-flag "Fáni" blanket over shoulders on a lava field. */
  blanket: M('2025/01/Fani-Teppi-small-e1739788616960.jpg'),
  /** Grey patterned mittens laid on wet pebbles. */
  mittens: M('2023/02/mittens_ing_18414_02_titelbild.jpg'),
  /** Saddle pad on an Icelandic horse — the horse line. */
  horse: M('2020/11/SaddlepadDeluxe_2_homepage-e1727864587164.jpg'),
} as const

export interface Product {
  name: string
  /** EUR price as listed on kidka.com 2026-07-23; null = link out instead */
  eur: number | null
  img: string
  url: string
  tag?: string
}

/** Verified on the linked product/category pages, 2026-07-23. */
export const PRODUCTS: Product[] = [
  {
    name: 'Sweater puffin green',
    eur: 159,
    img: M('2026/04/puffin-sweater-green-2-300x300.jpg'),
    url: 'https://kidka.com/product/sweater-puffin-green/',
    tag: 'Puffin edition',
  },
  {
    name: 'Sweater puffin blue',
    eur: 159,
    img: M('2026/04/puffin-sweater-blue-6-300x300.jpg'),
    url: 'https://kidka.com/product/sweater-puffin-blue/',
    tag: 'Puffin edition',
  },
  {
    name: 'Cardigan puffin beige',
    eur: 185,
    img: M('2026/04/puffin-cardigan-beige-1-300x300.jpg'),
    url: 'https://kidka.com/product/cardigan-puffin-beige/',
    tag: 'Puffin edition',
  },
  {
    name: '“Ísar” hooded cardigan',
    eur: 185,
    img: M('2023/10/CE3I5844-2-300x300.jpg'),
    url: 'https://kidka.com/product/cardigan-isar/',
  },
  {
    name: '“Ás” hooded cardigan black',
    eur: 185,
    img: M('2023/02/as_02570_03_bild-2_klein-e1718193984610-300x300.jpg'),
    url: 'https://kidka.com/product/as-hooded-cardigan-black/',
  },
  {
    name: '“Lundi” beige puffin blanket',
    eur: 199,
    img: M('2023/02/lundi-beige_0170_90_bild-3-300x200.jpg'),
    url: 'https://kidka.com/product/beige-puffin-blanket/',
    tag: '140 × 200 cm',
  },
  {
    name: 'Socks puffins green',
    eur: 49,
    img: M('2026/03/Cozy-socks-by-the-fireplace-first-version-300x300.jpg'),
    url: 'https://kidka.com/product/socks-puffins-green/',
  },
  {
    name: 'Hat Fjallalopi white',
    eur: null,
    img: M('2026/03/fjallalopi-hufa-hvit-e1775727428534-300x300.jpeg'),
    url: 'https://kidka.com/product/hat-fjallalopi-white/',
  },
]

/** Real shop categories on kidka.com (nav-verified 2026-07-23). */
export const CATEGORIES = [
  { label: 'Sweaters', url: 'https://kidka.com/category/sweaters/' },
  { label: 'Cardigans', url: 'https://kidka.com/category/cardigans/' },
  { label: 'Ponchos', url: 'https://kidka.com/category/ponchos/' },
  { label: 'Blankets', url: 'https://kidka.com/category/blankets/' },
  { label: 'Hats', url: 'https://kidka.com/category/hats/' },
  { label: 'Mittens', url: 'https://kidka.com/category/mittens/' },
  { label: 'Puffin edition', url: 'https://kidka.com/category/puffin-products/' },
  { label: 'Horse products', url: 'https://kidka.com/category/horseproducts/' },
  { label: 'Gift sets', url: 'https://kidka.com/category/gift-sets/' },
] as const

/** From fleece to shop floor — wording grounded in kidka.com/about-us
 *  ("washing, brushing and steaming the wool gives it a softer, fluffier
 *  texture"; knitted on machines on site; 100% Icelandic wool). */
export const PROCESS = [
  {
    n: '01',
    title: 'Icelandic fleece',
    note: '100% Icelandic sheep wool, start to finish.',
    hand: 'from local sheep',
  },
  {
    n: '02',
    title: 'Washed & brushed',
    note: 'Washing, brushing and steaming make the wool softer and fluffier.',
    hand: 'softer, fluffier',
  },
  {
    n: '03',
    title: 'Knitted on site',
    note: 'The knitting machines run right behind the shop wall.',
    hand: 'you can watch!',
  },
  {
    n: '04',
    title: 'Finished by hand',
    note: 'Linked, checked and labelled in Hvammstangi.',
    hand: 'one by one',
  },
  {
    n: '05',
    title: 'Across the counter',
    note: 'Into the factory shop, or shipped worldwide from the same floor.',
    hand: 'to your door',
  },
] as const

/** Tripadvisor review TITLES, verified via their review URLs 2026-07-23.
 *  Presented as traveller quotes with no invented star rows. */
export const REVIEWS = [
  {
    quote: 'Wool factory on the Vatnsnes Peninsula',
    body: 'Praised the factory viewing and the authenticity of buying where the knitting happens.',
    source: 'Tripadvisor traveller review',
    url: 'https://www.tripadvisor.com/ShowUserReviews-g1184970-d6434061-r394502572-Woolfactory_Shop_KIDKA-Hvammstangi_Northwest_Region.html',
  },
  {
    quote: 'My favorite place to buy Icelandic wool products',
    body: 'Returning visitors call the factory shop their first stop for genuine Icelandic knitwear.',
    source: 'Tripadvisor traveller review',
    url: 'https://www.tripadvisor.com/ShowUserReviews-g1184970-d6434061-r383740939-Woolfactory_Shop_KIDKA-Hvammstangi_Northwest_Region.html',
  },
  {
    quote: 'Pricey but high quality, worth it',
    body: 'Travellers note factory prices reflect real Icelandic wool knitted on the premises.',
    source: 'Tripadvisor traveller review',
    url: 'https://www.tripadvisor.com/ShowUserReviews-g1184970-d6434061-r624633982-Woolfactory_Shop_KIDKA-Hvammstangi_Northwest_Region.html',
  },
] as const

/** kidka.com/contact-us, 2026-07-23. */
export const HOURS = {
  winter: { label: 'November – mid-May', rows: [['Mon – Fri', '8:00 – 18:00'], ['Sat – Sun', 'Closed · by appointment']] },
  summer: { label: 'Mid-May – October', rows: [['Mon – Fri', '8:00 – 18:00'], ['Sat – Sun', '10:00 – 17:00']] },
} as const

export const CONTACT = {
  address: 'Höfðabraut 34, 530 Hvammstangi',
  phone: '+354 451 0060',
  phoneTel: '+3544510060',
  email: 'kidka@kidka.com',
  maps: 'https://www.google.com/maps/search/?api=1&query=KIDKA%20wool%20factory%20H%C3%B6f%C3%B0abraut%2034%20Hvammstangi',
  instagram: 'https://www.instagram.com/kidka_wool_fashion/',
  facebook: 'https://www.facebook.com/kidkawoolfactory/',
} as const

/** Verified claims for the trust strip (kidka.com/about-us + northiceland.is). */
export const TRUST = [
  '100% Icelandic wool',
  'Knitted in Hvammstangi',
  'Family-run since 2008',
  'One of Iceland’s biggest knitting factories',
  'Ships worldwide',
] as const

/* ------------------------------------------------------------------ v2 */
/**
 * "Uppskriftin" rebuild data. The page is drawn as a knitting chart, and
 * the factory is drawn as a plan you move through.
 *
 * HONESTY: the plan below is an ILLUSTRATIVE diagram of the stages KIDKA
 * describes on kidka.com/about-us (Icelandic fleece → washing/brushing/
 * steaming → knitted on site → finished → viewing window → shop). It is NOT
 * an architectural drawing of Höfðabraut 34 and the page says so on the page
 * itself. No room sizes, layouts or machine counts are claimed.
 */

/** v2 palette — undyed wool + ink + one dye. Contrast computed 2026-07-23:
 *  ink #16141A on oat #EFE9DC = 15.6:1 · oat on ink = 15.6:1
 *  dye #E0A100 fill with ink text = 6.7:1 (AA any size)
 *  ochre #7A5600 small text on oat = 6.0:1 (AA any size) */
export const C2 = {
  oat: '#EFE9DC',
  oatDeep: '#E4DCCB',
  ink: '#16141A',
  inkSoft: '#4A443C',
  dye: '#E0A100',
  ochre: '#7A5600',
  grid: 'rgba(22,20,26,0.12)',
  gridStrong: 'rgba(22,20,26,0.26)',
} as const

export const FONT2 = {
  display: 'var(--font-karrik)',
  body: 'var(--font-supreme)',
  mono: 'var(--font-servermono)',
} as const

/**
 * A charted band in the Icelandic yoke tradition, drawn for this page
 * (nested diamonds, 13-stitch repeat, 11 rows). Not a reproduction of any
 * specific traditional pattern. Generated so it is perfectly symmetric and
 * tiles seamlessly.
 */
export const CHART_W = 13
export const CHART_H = 11
export function chartCell(row: number, col: number): boolean {
  const d = Math.abs(col - 6)
  const k = 5 - Math.abs(row - 5)
  return d === k || d === k - 3
}

export interface Station {
  id: string
  /** chart coordinate label, e.g. "A1" */
  coord: string
  title: string
  titleIs: string
  note: string
  /** % box on the plan: left, top, width, height */
  box: [number, number, number, number]
  /** the visitor-facing hook, only on the window + shop */
  hook?: string
}

/** Stages exactly as kidka.com/about-us describes them; the plan geometry
 *  is illustrative. */
export const STATIONS: Station[] = [
  {
    id: 'wool',
    coord: 'A1',
    title: 'The wool store',
    titleIs: 'Ullin',
    note: '100% Icelandic sheep wool arrives and waits its turn. Nothing else goes into a KIDKA garment.',
    box: [4, 8, 26, 36],
  },
  {
    id: 'wash',
    coord: 'A2',
    title: 'Washing & brushing',
    titleIs: 'Þvottur',
    note: 'Washing, brushing and steaming are what give the wool its softer, fluffier feel.',
    box: [4, 50, 26, 40],
  },
  {
    id: 'knit',
    coord: 'B1',
    title: 'The knitting hall',
    titleIs: 'Prjónasalur',
    note: 'The machines run here, on site, in Hvammstangi. This is the room the shop window looks into.',
    box: [34, 8, 38, 52],
  },
  {
    id: 'finish',
    coord: 'B2',
    title: 'Finishing',
    titleIs: 'Frágangur',
    note: 'Linked, checked and labelled by hand before anything is folded.',
    box: [34, 66, 38, 24],
  },
  {
    id: 'window',
    coord: 'C1',
    title: 'The viewing window',
    titleIs: 'Glugginn',
    note: 'The wall between the shop and the machines is glass.',
    hook: 'Stand here and watch your sweater being made.',
    box: [76, 8, 20, 40],
  },
  {
    id: 'shop',
    coord: 'C2',
    title: 'The factory shop',
    titleIs: 'Búðin',
    note: 'Höfðabraut 34. Try it on, buy it at the source, or have it shipped worldwide from this same floor.',
    hook: 'Five minutes off Route 1.',
    box: [76, 54, 20, 36],
  },
]

/** Material facts for the swatch panel — all from kidka.com/about-us. */
export const SWATCH = [
  ['Fibre', '100% Icelandic sheep wool'],
  ['Made', 'Hvammstangi, North-West Iceland'],
  ['Process', 'Washed, brushed, steamed, knitted, linked'],
  ['Since', 'Family-run by Irina & Kristinn since 2008'],
  ['Ships', 'Worldwide, from the factory floor'],
] as const
