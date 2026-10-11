import type { PreviewCompany } from '../company-types'

/*
 * Bílaumboðið Una (XPENG á Íslandi). Every fact here was read on 11.10.2026 from
 * bilaumbodiduna.is (all pages, the seven news posts), xpeng.com/is and the
 * Verðlisti október 2026 (Issuu, nine page images read by eye). Raw pages, text
 * extracts, the price list and the OSM pulls: _docs/xpeng-una-harvest-2026-10-11/.
 * Model numbers are transcribed from the price list in pricelist/prices-2026-10.json.
 */

const BASE = import.meta.env.BASE_URL
export const A = (name: string) => `${BASE}xpeng/${name}`
export const ROUTE = '/preview/xpeng'

export type Photo = { src: string; srcSet: string; alt: string; w: number; h: number }
const photo = (name: string, widths: number[], w: number, h: number, alt: string): Photo => ({
  src: A(`${name}-${widths[widths.length - 1]}.webp`),
  srcSet: widths.map((x) => `${A(`${name}-${x}.webp`)} ${x}w`).join(', '),
  alt,
  w,
  h,
})

export const CONTACT = {
  legal: 'Bílaumboðið Una',
  kt: '561106-2150',
  street: 'Vínlandsleið 6-8',
  town: '113 Reykjavík',
  phone: '590 2900',
  tel: '+3545902900',
  email: 'xpeng@bilaumbodiduna.is',
  instagram: 'https://www.instagram.com/xpengisland/',
  linkedin: 'https://www.linkedin.com/company/xpeng-island/',
  map: 'https://www.google.com/maps/search/?api=1&query=V%C3%ADnlandslei%C3%B0+6-8%2C+113+Reykjav%C3%ADk',
  brand: 'https://www.xpeng.com/is',
  config: 'https://store.xpeng.com/is/configurator',
  site: 'https://www.bilaumbodiduna.is',
}

/* Opening hours as Una prints them (every page footer, Staðsetning): virka daga 09-17, laugardaga 12-16. */
type Span = { d: number[]; from: number; to: number }
export type Dept = { key: string; name: string; email: string; hours: { label: string; time: string }[]; spans: Span[]; note?: string }
export const DEPTS: Dept[] = [
  {
    key: 'una', name: 'Sýningarsalur og sala', email: CONTACT.email,
    hours: [{ label: 'Virka daga', time: '9:00-17:00' }, { label: 'Laugardaga', time: '12:00-16:00' }],
    spans: [{ d: [1, 2, 3, 4, 5], from: 540, to: 1020 }, { d: [6], from: 720, to: 960 }],
  },
]

/* Iceland keeps UTC all year. */
export function openState(dept: Dept, now = new Date()) {
  const d = now.getUTCDay()
  const m = now.getUTCHours() * 60 + now.getUTCMinutes()
  const today = dept.spans.find((s) => s.d.includes(d))
  const hhmm = (x: number) => `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`
  if (today && m >= today.from && m < today.to) return { open: true, text: `Opið til ${hhmm(today.to)}` }
  if (today && m < today.from) return { open: false, text: `Opnar kl. ${hhmm(today.from)}` }
  return { open: false, text: 'Lokað núna' }
}

/* ── Models: the Verðlisti október 2026 ───────────────────────────────── */
export type Trim = {
  name: string
  /** list price in ISK */
  price: number
  /** price with the Orkusjóður grant as the price list prints it; absent where it prints none */
  priceGrant?: number
  drive: 'Afturhjóladrif' | 'Fjórhjóladrif'
  /** WLTP range in km as printed (the price list says "Drægni miðast við uppgefnar tölur frá framleiðanda (WLTP)") */
  range: number
  acKw: number
  dcKw: number
  acHours: string
  kw: number
  hp: number
  nm: number
  zero100: string
  kwh: string
  kwh100: string
  weight: number
}
export type Colour = { name: string; extra: number; note?: string }
export type Model = {
  slug: 'l03' | 'g6' | 'g9' | 'x9'
  name: string
  tagline: string
  /** DC 10-80 % in minutes, as printed */
  dcMin: number
  tow: number
  boot: string
  frunk?: string
  clearance: string
  dims: string
  tyres?: string
  note?: string
  trims: Trim[]
  colours: Colour[]
  colourNote?: string
  interiors: string[]
  img: Photo
  gallery: Photo[]
  /** one fact from Una's own copy, reused word for word where quoted */
  line: string
}

export const kr = (n: number) => `${n.toLocaleString('de-DE')} kr.`
export const WARRANTY = '7 ár / 160.000 km'
export const SERVICE_INTERVAL = '20.000 km / 12 mán. (hvort sem á undan kemur)'
export const LIST = { month: 'október 2026', url: 'https://issuu.com/askja/docs/xpeng_ver_listar' }

const T = (t: Omit<Trim, 'acKw' | 'dcKw' | 'kw' | 'hp'> & { ac: [number, number]; power: [number, number] }): Trim => {
  const { ac, power, ...rest } = t
  return { ...rest, acKw: ac[0], dcKw: ac[1], kw: power[0], hp: power[1] }
}

export const MODELS: Model[] = [
  {
    slug: 'l03', name: 'XPENG L03', tagline: 'Ný kynslóð snjallra rafbíla', dcMin: 20, tow: 1500, boot: '367 l', frunk: '89 l (afturhjóladrif) / 44 l (fjórhjóladrif)', clearance: '143 mm', dims: '4650 / 1920 / 1600 mm',
    trims: [
      T({ name: 'Standard Range Plus', price: 5_390_000, priceGrant: 4_890_000, drive: 'Afturhjóladrif', range: 445, ac: [11, 193], acHours: '6,8 klst', power: [163, 222], nm: 280, zero100: '7,5 s', kwh: '58,2', kwh100: '15,3', weight: 1870 }),
      T({ name: 'Long Range Plus', price: 5_890_000, priceGrant: 5_390_000, drive: 'Afturhjóladrif', range: 520, ac: [11, 236], acHours: '8,3 klst', power: [183, 249], nm: 280, zero100: '6,6 s', kwh: '71,1', kwh100: '16,0', weight: 1940 }),
      T({ name: 'Performance Plus', price: 6_390_000, priceGrant: 5_890_000, drive: 'Fjórhjóladrif', range: 440, ac: [11, 236], acHours: '8,3 klst', power: [317, 431], nm: 451, zero100: '4,5 s', kwh: '71,1', kwh100: '18,4', weight: 2040 }),
      T({ name: 'Performance Ultra', price: 6_890_000, priceGrant: 6_390_000, drive: 'Fjórhjóladrif', range: 440, ac: [11, 236], acHours: '8,3 klst', power: [317, 431], nm: 451, zero100: '4,5 s', kwh: '71,1', kwh100: '18,4', weight: 2060 }),
    ],
    colours: [
      { name: 'Arctic White', extra: 0 }, { name: 'Silver Frost', extra: 180_000, note: 'aðeins með Performance' }, { name: 'Rock Gray', extra: 180_000 },
      { name: 'Phantom Purple', extra: 180_000, note: 'aðeins með Performance' }, { name: 'Midnight Black', extra: 180_000 }, { name: 'Black Edition', extra: 280_000, note: 'aðeins með Ultra' },
    ],
    interiors: ['Dökkgrá'],
    img: photo('m-l03', [800, 1600], 1920, 1080, 'XPENG L03 í fjólubláum lit við vatn'),
    gallery: [],
    line: 'Fjórar útfærslur, frá afturhjóladrifi til fjórhjóladrifs með 4,5 sekúndna hröðun.',
  },
  {
    slug: 'g6', name: 'XPENG G6', tagline: 'Endurhlaðinn og ofursnjall', dcMin: 12, tow: 1500, boot: '571 / 1374 l', clearance: '160 mm', dims: '4758 / 1920 / 1650 mm',
    trims: [
      T({ name: 'Standard Range', price: 6_590_000, priceGrant: 6_090_000, drive: 'Afturhjóladrif', range: 480, ac: [11, 382], acHours: '7,3 klst', power: [185, 252], nm: 440, zero100: '6,9 s', kwh: '68,5', kwh100: '16,6', weight: 2085 }),
      T({ name: 'Long Range', price: 7_290_000, priceGrant: 6_790_000, drive: 'Afturhjóladrif', range: 535, ac: [11, 451], acHours: '9,2 klst', power: [218, 296], nm: 440, zero100: '6,7 s', kwh: '80,8', kwh100: '17,5', weight: 2140 }),
      T({ name: 'Performance', price: 7_690_000, priceGrant: 7_190_000, drive: 'Fjórhjóladrif', range: 510, ac: [11, 451], acHours: '9,2 klst', power: [358, 487], nm: 660, zero100: '4,1 s', kwh: '80,8', kwh100: '18,4', weight: 2240 }),
    ],
    colours: [
      { name: 'Arctic White', extra: 0 }, { name: 'Silver Frost', extra: 150_000 }, { name: 'Graphite Gray', extra: 150_000 },
      { name: 'Stellar Purple', extra: 150_000 }, { name: 'Midnight Black', extra: 150_000 }, { name: 'Black Edition', extra: 250_000, note: 'svart lakk, 20" svartar felgur, reyksvört merki, svartir framstuðari og bremsudælur' },
    ],
    interiors: ['Dökkgrá', 'Ljósgrá'],
    img: photo('m-g6', [800, 1600], 1920, 1080, 'Ljósfjólublár XPENG G6 við snævi þakið fjall'),
    gallery: [photo('winter', [800, 1600], 1920, 1080, 'XPENG G6 á blautum vegi milli snjóruðninga'), photo('int-g6', [800, 1500], 1500, 1000, 'Innanrými XPENG með ljósum sætum og glerþaki'), photo('rear', [800, 1500], 1500, 1000, 'Afturljós og skott á XPENG G6 að kvöldi')],
    line: 'Allt að 535 km drægni og hleðsla úr 10% í 80% á 12 mínútum.',
  },
  {
    slug: 'g9', name: 'XPENG G9', tagline: 'Lúxus eins og hann á að vera', dcMin: 12, tow: 1500, boot: '660 / 1576 l', clearance: '145 mm (+50 mm í hæstu stöðu)', dims: '4891 / 1937 / 1680 mm', tyres: '255/45 R21', note: 'Fjöliðafjöðrun með loftpúðum.',
    trims: [
      T({ name: 'Performance AWD', price: 10_690_000, drive: 'Fjórhjóladrif', range: 540, ac: [11, 525], acHours: '10,5 klst', power: [423, 575], nm: 695, zero100: '4,2 s', kwh: '93,1', kwh100: '20,1', weight: 2420 }),
    ],
    colours: [
      { name: 'Arctic White', extra: 0 }, { name: 'Silver Frost', extra: 150_000 }, { name: 'Graphite Gray', extra: 150_000 }, { name: 'Midnight Black', extra: 150_000 }, { name: 'Black Edition', extra: 350_000 },
    ],
    interiors: ['Svart Nappa', 'Brún Nappa', 'Kaffi Nappa', 'Ljósgrátt Nappa'],
    img: photo('m-g9', [800, 1600], 2500, 1401, 'Svartur XPENG G9 á vatnsblautu hrauni í sólarlagi'),
    gallery: [photo('int-g9', [800, 1500], 1500, 1000, 'Innanrými XPENG G9 með brúnu Nappa leðri og breiðskjá')],
    line: 'Fjórhjóladrifinn, 575 hestöfl og 4,2 sekúndur í hundraðið.',
  },
  {
    slug: 'x9', name: 'XPENG X9', tagline: 'Fyrsta flokks ferðalag', dcMin: 12, tow: 1500, boot: '721 / 2554 l', clearance: '220 mm (í hæstu stöðu)', dims: '5316 / 1988 / 1785 mm', tyres: '235/50 R20', note: 'Fjöliðafjöðrun með loftpúðum. Sjö manna.',
    trims: [
      T({ name: 'Performance AWD', price: 12_390_000, drive: 'Fjórhjóladrif', range: 580, ac: [11, 542], acHours: '11 klst', power: [370, 496], nm: 640, zero100: '5,9 s', kwh: '110', kwh100: '20', weight: 2780 }),
    ],
    colours: [{ name: 'Arctic White', extra: 0 }, { name: 'Silver Frost', extra: 150_000 }, { name: 'Midnight Black', extra: 150_000 }, { name: 'Matte Gray', extra: 250_000 }],
    interiors: ['Svart Nappa', 'Kaffi Nappa'],
    img: photo('m-x9', [800, 1600], 1920, 1080, 'XPENG X9 við sjó undir þungbúnum himni'),
    gallery: [],
    line: 'Sjö manna og alrafmagnaður, með 580 km drægni.',
  },
]
export const modelBySlug = (s: string) => MODELS.find((x) => x.slug === s)
export const fromPrice = (x: Model) => Math.min(...x.trims.map((t) => t.priceGrant ?? t.price))
export const priceLine = (x: Model) => (x.trims.some((t) => t.priceGrant) ? `Frá ${kr(fromPrice(x))} með styrk` : `Frá ${kr(fromPrice(x))}`)
export const trimLabel = (x: Model, t: Trim) => `${x.name.replace('XPENG ', '')} ${t.name}`
export const ALL_TRIMS = MODELS.flatMap((m) => m.trims.map((t) => ({ m, t })))

export const IMG = {
  hero: photo('hero', [800, 1600, 2400], 2500, 1665, 'Hvítur XPENG á malarvegi í íslensku landslagi, fjöll í fjarska'),
  land: photo('land', [800, 1600], 1646, 1096, 'Hvítur XPENG á vegi við eldfjall og hraun'),
  showroom: photo('showroom', [800, 1500], 1500, 1000, 'Sýningarsalur XPENG að Vínlandsleið 6-8 með XPENG-merkinu á framhliðinni'),
  orkan: photo('orkan', [800, 1500], 1500, 844, 'Þrír XPENG bílar við hraðhleðslustöðvar'),
  winter: photo('winter', [800, 1600], 1920, 1080, 'Ljósfjólublár XPENG á vegi umkringdum snjó'),
}

/* ── News: the seven posts on bilaumbodiduna.is/frettir, dates as published ── */
export type Post = { slug: string; date: string; iso: string; title: string; lines: string[]; img?: Photo; big?: string }
export const NEWS: Post[] = [
  { slug: 'xpeng-og-orkan-setja-islandsmet-i-hradhledslu', date: '3. nóvember 2025', iso: '2025-11-03', title: 'XPENG og Orkan setja Íslandsmet í hraðhleðslu',
    lines: ['XPENG G9 hlóð 10-80% á 12 mínútum og 23 sekúndum í hraðhleðslustöð Orkunnar á Lambhagavegi.', 'Stöðin náði 408 kW hámarksafli. Ekki er vitað um hraðari hleðslu á Íslandi og því er gert ráð fyrir að um Íslandsmet sé að ræða.'], big: '12:23' },
  { slug: 'vetrarsyning-xpeng-2026', date: '2. janúar 2026', iso: '2026-01-02', title: 'Vetrarsýning XPENG 2026',
    lines: ['Vetrarsýning í sýningarsalnum að Vínlandsleið 6-8 með reynsluakstri á G6 og G9, léttum veitingum og tónlist.'], img: photo('news-winter', [800, 1500], 1500, 844, 'Vetrarsýning XPENG 2026') },
  { slug: 'frumsyning-a-nyjum-g6-69', date: '19. september 2025', iso: '2025-09-19', title: 'Frumsýning á nýjum XPENG G6 og G9',
    lines: ['Laugardaginn 27. september kl. 12-16 í sýningarsalnum að Vínlandsleið 6-8.'], img: photo('news-launch', [800, 1500], 1500, 844, 'Frumsýning á nýjum XPENG G6 og G9') },
  { slug: 'xpeng-g6-reynsluakstur-akureyri', date: '12. maí 2025', iso: '2025-05-12', title: 'XPENG G6 reynsluakstur á Akureyri',
    lines: ['Una var á Akureyri 16.-17. maí við hleðslustöðvar ON á Glerártorgi og bauð reynsluakstur á G6.'], img: photo('news-akureyri', [800, 1500], 1500, 1000, 'XPENG G6 reynsluakstur á Akureyri') },
  { slug: 'xpeng-kynnir-nja-g6-og-g9-ofursnjalla-jepplinga-fyrir-evrpu', date: '18. júní 2025', iso: '2025-06-18', title: 'XPENG kynnir nýja og ofursnjalla G6 og G9 fyrir Evrópu',
    lines: ['Framleiðandinn kynnir nýja G6 og G9 með 5C ofurhleðslurafhlöðu og 800 V SiC kerfi í öllum útfærslum.'] },
  { slug: 'vetrarsyning-xpeng-a-nyju-ari', date: '2. janúar 2025', iso: '2025-01-02', title: 'Vetrarsýning XPENG á nýju ári', lines: ['Vetrarsýning laugardaginn 11. janúar kl. 12-16 að Vínlandsleið 6-8.'] },
  { slug: 'frumsyning-xpeng-a-islandi', date: '18. september 2024', iso: '2024-09-18', title: 'Frumsýning XPENG á Íslandi', lines: ['Una hóf sölu á XPENG og bauð í nýjan sýningarsal að Vínlandsleið 6-8 laugardaginn 21. september.'] },
]
export const newsUrl = (p: Post) => `${CONTACT.site}/frettir/${p.slug}`

/* ── Service ─────────────────────────────────────────────────────────── */
export const SERVICE = {
  jobs: ['Þjónustuskoðun', 'Ábyrgðarmál', 'Bilun eða viðvörunarljós', 'Dekk', 'Annað'],
  note: `XPENG fær þjónustuskoðun á 20.000 km fresti eða á 12 mánaða fresti, hvort sem á undan kemur. Ábyrgðin er ${WARRANTY}; forsenda hennar er reglulegt þjónustueftirlit sem kaupandi ber kostnað af.`,
  manual: 'https://tis.xpeng.com/#/home',
}

/* ── Staff: the Um Unu page, every address as published ─────────────── */
export type Person = { name: string; role: string; email: string }
export const STAFF: Person[] = [
  { name: 'Kristinn Jón Baldursson', role: 'Sölustjóri', email: 'kjb@bilaumbodiduna.is' },
  { name: 'Brynjar Þór Agnarsson', role: 'Söluráðgjafi', email: 'bta@bilaumbodiduna.is' },
  { name: 'Daníel Þór Lindsay', role: 'Söluráðgjafi', email: 'dthl@bilaumbodiduna.is' },
  { name: 'Ólafur Haukur Arilíusson', role: 'Söluráðgjafi', email: 'oha@bilaumbodiduna.is' },
]

/* ── Booking: slots the forms offer (the prototype keeps them in the browser) ── */
export const SLOTS = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
export type Request = { id: string; kind: 'reynsluakstur' | 'thjonusta' | 'innskipti' | 'fyrirspurn'; title: string; when: string; who: string; contact: string; detail: string; at: string; status: 'ný' | 'staðfest' }
const RK = 'xg-requests'
export function loadRequests(): Request[] { try { return JSON.parse(sessionStorage.getItem(RK) ?? '[]') } catch { return [] } }
export function saveRequest(r: Omit<Request, 'id' | 'at' | 'status'>): Request {
  const full: Request = { ...r, id: `U-${Date.now().toString(36).toUpperCase().slice(-5)}`, at: new Date().toISOString(), status: 'ný' }
  try { sessionStorage.setItem(RK, JSON.stringify([full, ...loadRequests()])) } catch { /* private mode */ }
  return full
}
/* Sample inbox for the staff-side preview, marked as sample on the page. */
export const SAMPLE_REQUESTS: Request[] = [
  { id: 'U-S0001', kind: 'reynsluakstur', title: 'XPENG G6 Long Range', when: 'þri. 14. okt. kl. 14:00', who: 'Hildur Ósk', contact: '690 0000', detail: 'Vill líka sjá G9', at: '2026-10-11T09:12:00Z', status: 'staðfest' },
  { id: 'U-S0002', kind: 'thjonusta', title: 'Þjónustuskoðun, XPENG G6', when: 'mán. 20. okt. kl. 9:00', who: 'Kristinn B.', contact: 'kristinn@example.is', detail: 'Bílnúmer AB-123, 20.000 km', at: '2026-10-11T07:40:00Z', status: 'ný' },
  { id: 'U-S0003', kind: 'innskipti', title: 'Tek bílinn upp í XPENG X9', when: 'Skoða í nóvember', who: 'Lagnaþjónustan', contact: 'rekstur@example.is', detail: 'Núverandi bíll: 2021 dísel, 82.000 km', at: '2026-10-10T15:05:00Z', status: 'ný' },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Bílaumboðið Una',
  telephone: '+354 590 2900',
  email: CONTACT.email,
  url: CONTACT.site,
  brand: { '@type': 'Brand', name: 'XPENG' },
  address: { '@type': 'PostalAddress', streetAddress: 'Vínlandsleið 6-8', postalCode: '113', addressLocality: 'Reykjavík', addressCountry: 'IS' },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '12:00', closes: '16:00' },
  ],
}

export const companyEntry: PreviewCompany = {
  slug: 'xpeng',
  route: ROUTE,
  name: 'Bílaumboðið Una (XPENG)',
  sector: 'Bílaumboð',
  location: 'Vínlandsleið 6-8, 113 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Umboðs- og þjónustuaðili fyrir XPENG á Íslandi; sala hófst haustið 2024',
  currentUrl: 'https://www.bilaumbodiduna.is',
  ownerEmail: 'xpeng@bilaumbodiduna.is',
  concept: 'Hringinn á rafmagni',
  conceptTagline: 'The ÍSBAND/Vatt dealer system re-aimed at a single-brand importer: four model plates, the October 2026 price list as real tables, test-drive, service and trade-in requests with a staff-side preview, and a Hringvegurinn chapter whose line is the real OSM ring road and whose stops are the real fast chargers along it.',
  accent: '#186DEF',
  dark: false,
  status: 'In build',
  thumb: A('hero-800.webp'),
  ownPhotography: false,
  photoCredit: 'Myndir frá bilaumbodiduna.is og xpeng.com/is (framleiðendamyndir), október 2026. Landakort: OpenStreetMap.',
  audit: {
    strengths: ['Eigin myndir af XPENG á íslenskum vegi, í snjó og við sýningarsalinn', 'Verðlisti fyrir október 2026 með fjórum gerðum', 'Hraðhleðslumet með Orkunni og reynsluakstur á Akureyri sem sönn dæmi'],
    weaknesses: ['Verðlistinn er flettibók á Issuu, ekki síða', 'L03 er ekki nefndur á vef Unu og X9 er aðeins biðlisti þótt verðlistinn selji hann', 'Engin bókun á reynsluakstri eða þjónustu, ekkert form á Hafa samband'],
    opportunities: ['Verð, reynsluakstur og þjónusta á einni síðu', 'Hleðsluáætlun fyrir Hringveginn með raunverulegum hleðslustöðvum', 'Vefur sem Una á sjálf og getur uppfært samhliða xpeng.com/is'],
  },
  positioning: 'Una er umboðs- og þjónustuaðili fyrir XPENG á Íslandi. Vefurinn á að vera það sem alþjóðlegi vefurinn getur ekki verið: íslensk verð, reynsluakstur, þjónusta og svar við spurningunni hvort bíllinn kemst hringinn.',
  outreach: {
    subject: 'Hugmynd að nýjum vef fyrir Unu',
    body: 'Góðan dag,\n\nÉg setti saman hugmynd að nýjum vef fyrir Unu þar sem verðlistinn, reynsluaksturinn, þjónustan og hleðsluáætlun fyrir Hringveginn eru á einum stað:\n\n[HLEKKUR Á FRUMGERÐ]\n\nKveðja,\nSindri Már',
  },
}
