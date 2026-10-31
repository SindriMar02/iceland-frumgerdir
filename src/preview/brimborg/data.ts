import type { PreviewCompany } from '../company-types'

/*
 * Brimborg ehf. Every fact on this page was read on 31.10.2026 from the
 * company's own sites: brimborg.is (forsíða, Brimborg ehf., Opnunartímar,
 * Opnunartímar Akureyri, Bíldshöfða 6 og 8, Brimborg verkstæði, Neyðarþjónusta,
 * Bílorka), nyirbilar.brimborg.is (lagerskrá nýrra bíla, bíll AML29),
 * notadir.brimborg.is (lagerskrá notaðra bíla) and polestar.com/is-is
 * (Polestar 5, Polestar Reykjavík). Raw pages, text and the harvest scripts:
 * _docs/brimborg-build-2026-10-31/. Where their pages disagree, the choice is
 * named in DESIGN.md ("Contradictions").
 */

const BASE = import.meta.env.BASE_URL
export const A = (name: string) => `${BASE}brimborg/${name}`

export type Photo = { src: string; srcSet: string; alt: string; w: number; h: number }
const photo = (name: string, widths: number[], w: number, h: number, alt: string): Photo => ({
  src: A(`${name}-${widths[widths.length - 1]}.webp`),
  srcSet: widths.map((x) => `${A(`${name}-${x}.webp`)} ${Math.min(x, w)}w`).join(', '),
  alt,
  w,
  h,
})

const BR = 'https://www.brimborg.is'
const NB = 'https://nyirbilar.brimborg.is'
const NO = 'https://notadir.brimborg.is'
const PS = 'https://www.polestar.com/is-is'

export const CONTACT = {
  legal: 'Brimborg ehf.',
  kt: '701277-0239',
  vsk: '11650',
  street: 'Bíldshöfða 6',
  town: '110 Reykjavík',
  phone: '515 7000',
  tel: '+3545157000',
  email: 'brimborg@brimborg.is',
  emergency: '515 7001',
  emergencyTel: '+3545157001',
  slogan: 'Öruggur staður til að vera á',
}

export const LINKS = {
  newCars: `${NB}/is/nyir-bilar`,
  used: `${NO}/is`,
  polestar5: `${NB}/is/nyir-bilar/bill/AML29`,
  polestar5Info: `${PS}/polestar-5/`,
  polestarSpace: `${PS}/spaces/reykjavik-bildsofhoi/`,
  bev: `${NB}/is/nyir-bilar?fueltype=2`,
  phev: `${NB}/is/nyir-bilar?fueltype=5`,
  bilorka: `${BR}/is/rafbilar-hja-brimborg/bilorka-brimborg-hradhledsla`,
  hledslustodvar: `${BR}/is/rafbilar-hja-brimborg/hledslustodvar-til-solu`,
  styrkur: `${BR}/is/rafbilar-hja-brimborg/rafbill-verd-og-ivilnanir`,
  verkstaedi: `${BR}/is/verkstaedi-brimborg/brimborg-verkstaedi`,
  neyd: `${BR}/is/verkstaedi-brimborg/brimborg-verkstaedi/neydarthjonusta`,
  bilalan: `${BR}/is/nyir-bilar/bilalan`,
  reynsluakstur: `${BR}/is/nyir-bilar/reynsluakstur`,
  opnunartimar: `${BR}/is/brimborg-bilaumbod/opnunartimar`,
  um: `${BR}/is/brimborg-bilaumbod/brimborg-bilaumbod/brimborg-ehf`,
  map: 'https://www.google.com/maps/search/?api=1&query=B%C3%ADldsh%C3%B6f%C3%B0i+6%2C+110+Reykjav%C3%ADk',
  map8: 'https://www.google.com/maps/search/?api=1&query=B%C3%ADldsh%C3%B6f%C3%B0i+8%2C+110+Reykjav%C3%ADk',
  mapAk: 'https://www.google.com/maps/search/?api=1&query=Tryggvabraut+5%2C+600+Akureyri',
}

/* Opening hours. d = JS weekday (0 Sun). Minutes from midnight. */
type Span = { d: number[]; from: number; to: number }
export type Dept = { key: string; name: string; street: string; phone: string; tel: string; hours: { label: string; time: string }[]; spans: Span[]; map: string; note?: string }
const SALES: Span[] = [{ d: [1], from: 600, to: 1020 }, { d: [2, 3, 4], from: 540, to: 1020 }, { d: [5], from: 540, to: 975 }]
const SALES_HOURS = [{ label: 'Mánudaga', time: '10:00–17:00' }, { label: 'Þriðjudaga til fimmtudaga', time: '09:00–17:00' }, { label: 'Föstudaga', time: '09:00–16:15' }]
export const DEPTS: Dept[] = [
  {
    key: 'polestar', name: 'Polestar, Volvo og Ford', street: 'Bíldshöfða 6, Reykjavík', phone: CONTACT.phone, tel: CONTACT.tel,
    hours: SALES_HOURS, spans: SALES, map: LINKS.map, note: 'Nýir og notaðir bílar. Lokað um helgar.',
  },
  {
    key: 'mazda', name: 'Mazda, Citroën, Peugeot og Opel', street: 'Bíldshöfða 8, Reykjavík', phone: CONTACT.phone, tel: CONTACT.tel,
    hours: SALES_HOURS, spans: SALES, map: LINKS.map8, note: 'Nýir og notaðir bílar. Lokað um helgar.',
  },
  {
    key: 'verkstaedi', name: 'Verkstæði og varahlutir', street: 'Bíldshöfða 6 og 8, Reykjavík', phone: CONTACT.phone, tel: CONTACT.tel,
    hours: [{ label: 'Mánudaga til fimmtudaga', time: '07:45–17:00' }, { label: 'Föstudaga', time: '07:45–16:15' }],
    spans: [{ d: [1, 2, 3, 4], from: 465, to: 1020 }, { d: [5], from: 465, to: 975 }], map: LINKS.map,
  },
  {
    key: 'akureyri', name: 'Akureyri', street: 'Tryggvabraut 5, Akureyri', phone: CONTACT.phone, tel: CONTACT.tel,
    hours: [{ label: 'Mánudaga', time: '09:00–17:00' }, { label: 'Þriðjudaga til fimmtudaga', time: '08:00–17:00' }, { label: 'Föstudaga', time: '08:00–16:15' }],
    spans: [{ d: [1], from: 540, to: 1020 }, { d: [2, 3, 4], from: 480, to: 1020 }, { d: [5], from: 480, to: 975 }], map: LINKS.mapAk,
    note: 'Söludeild nýrra og notaðra bíla.',
  },
]

/* Neyðarsími verkstæðis: weekdays outside opening hours 18–22, weekends and public holidays 10–17. */
export const EMERGENCY = { weekdays: '18:00–22:00', weekends: '10:00–17:00', fee: '25.000 kr.' }

/* Iceland keeps UTC all year, so the clock needs no zone library. */
export function openState(dept: Pick<Dept, 'spans'>, now = new Date()) {
  const d = now.getUTCDay()
  const m = now.getUTCHours() * 60 + now.getUTCMinutes()
  const today = dept.spans.find((s) => s.d.includes(d))
  const hhmm = (x: number) => `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`
  if (today && m >= today.from && m < today.to) return { open: true, text: `Opið til ${hhmm(today.to)}` }
  if (today && m < today.from) return { open: false, text: `Opnar kl. ${hhmm(today.from)}` }
  return { open: false, text: 'Lokað núna' }
}

/* ── Polestar 5: the centrepiece. Price, lease and stock from the car's own
 * listing (nyirbilar.brimborg.is, bíll AML29, 31.10.2026); output and 0–100 from
 * polestar.com/is-is/polestar-5. An older listing showed 21.690.000 kr.; the live
 * one says 21.990.000 kr. ── */
export const P5 = {
  name: 'Polestar 5 Performance',
  priceText: '21.990.000 kr.',
  priceDigits: '21990000',
  lease: '791.640 kr.',
  leaseNote: 'á mánuði í langtímaleigu, 36 mánuði',
  delivery: 'Til afgreiðslu strax',
  stock: 'Á lager',
  colour: 'Storm Matte',
  interior: 'Bridge of Weir Charcoal leður',
  stats: [
    { v: 650, dec: 0, unit: 'kW', label: 'Afl, allt að', src: 'Polestar' },
    { v: 3.2, dec: 1, unit: 'sek.', label: 'Úr 0 í 100 km/klst.', src: 'Polestar, Performance' },
    { v: 558, dec: 0, unit: 'km', label: 'Drægni, allt að', src: 'bíllinn á lager, Brimborg' },
  ],
}

export const SHOWROOM = {
  name: 'Polestar Reykjavík',
  street: 'Bíldshöfða 6',
  town: '110 Reykjavík',
  phone: CONTACT.phone,
  tel: CONTACT.tel,
  /* Polestar's own words for the space, verbatim. */
  line: 'Rými fyrir mínimalíska hönnun og afkastamikla rafbíla í hjarta borgarinnar.',
  services: ['Sala', 'Reynsluakstur', 'Afhending', 'Sýningarsalur'],
  hours: [...SALES_HOURS, { label: 'Um helgar', time: 'Lokað' }],
  spans: SALES,
}

export const IMG = {
  hero: photo('hero', [800, 1600, 2560], 2560, 1422, 'Grár Polestar 5 á ferð, séður að ofan og framan, óskýr vegur í bakgrunni'),
  p5wide: photo('p5-wide', [800, 1600, 2304], 2304, 1536, 'Polestar 5 á fjallvegi undir klettavegg'),
  showroom: photo('showroom', [1200, 2400, 4106], 4106, 1652, 'Hvítur Polestar í sýningarsal Polestar Reykjavík með gráum veggjum'),
  showroomSq: photo('showroom-sq', [700, 1200], 1200, 862, 'Hvítur Polestar í sýningarsal Polestar Reykjavík'),
  splitEv: photo('c-raf', [640, 1280, 1695], 1695, 919, 'Hvítur Polestar 4 á strandvegi með úthafið og hraunklappir í baksýn'),
  splitPhev: photo('split-phev', [800, 1698], 1698, 840, 'Rauður Mazda CX-60 tengiltvinnbíll á sveitavegi'),
  drive: photo('hero', [800, 1600, 2560], 2560, 1422, 'Grár Polestar 5 á ferð'),
  statement: photo('statement', [700, 1305], 1305, 622, 'Rauður rafbíll í hleðslu við hús með timburklæðningu'),
  fa: photo('u-FLN61', [640, 1280], 1280, 853, 'Volvo XC60 Inscription Plug-In Hybrid í sal Brimborgar'),
  fb: photo('u-YUP07', [640, 1280], 1280, 853, 'Mazda2 Hybrid Centre-Line í sal Brimborgar'),
  fc: photo('u-BHK47', [640, 1280], 1280, 853, 'Volvo EX30 Recharge Ultra í sal Brimborgar'),
  h1: photo('u-KLN72', [640, 1280], 1280, 853, 'Citroën e-C4 MAX í sal Brimborgar'),
  h2: photo('showroom-sq', [700, 1200], 1200, 862, 'Polestar Reykjavík á Bíldshöfða 6'),
  h3: photo('h-ex90', [700, 1320], 1320, 839, 'Volvo EX90 séður að aftan á dökkrósum bakgrunni'),
  h4: photo('u-FXD86', [640, 1280], 1280, 853, 'Ford Explorer Platinum Plug-In Hybrid í sal Brimborgar'),
  h5: photo('p5-2', [640, 1228], 1228, 1536, 'Afturljós Polestar 5 í návígi'),
}

/* The Polestar 5 gallery: Polestar's own press images for the car (polestar.com/is-is/polestar-5). */
export const P5_GALLERY: { img: Photo; cap: string }[] = [
  { img: photo('p5-1', [800, 1600, 2304], 2304, 1536, 'Ökumaður Polestar 5 með leiðsögn á miðskjá'), cap: 'Miðskjár og stjórntæki' },
  { img: photo('p5-2', [640, 1228], 1228, 1536, 'Afturljós Polestar 5 í návígi'), cap: 'Afturljósin' },
  { img: photo('p5-4', [800, 1600, 2304], 2304, 1536, 'Framsæti Polestar 5 í ljósu áklæði'), cap: 'Sætin' },
  { img: photo('p5-5', [640, 1228], 1228, 1536, 'Ökumaður horfir út um þakglugga Polestar 5 á milli pálmatrjáa'), cap: 'Þakgluggi' },
  { img: photo('p5-7', [800, 1600, 2304], 2304, 1536, 'Þaklína og afturhluti Polestar 5 í návígi'), cap: 'Þaklínan' },
]

/* ── New cars: one card per model, from the stock listings on nyirbilar.brimborg.is ── */

export type Brand = 'Polestar' | 'Volvo' | 'Ford' | 'Mazda' | 'Peugeot'
export type Model = {
  key: string
  brand: Brand
  name: string
  kind: string
  power?: 'Rafmagn' | 'Tengiltvinn' | 'Dísil' | 'Bensín'
  group: 'folksbill' | 'jeppi' | 'sjo' | 'sendibill' | 'pallbill'
  /** display price, their wording; null = ask a salesperson */
  price: string | null
  note?: string
  facts: string[]
  href: string
  img: Photo
  studio?: boolean
}

/** "Polestar 5", "Volvo EX30": the brand once, never twice */
export const fullName = (m: Pick<Model, 'brand' | 'name'>) => (m.name.startsWith(m.brand) ? m.name : `${m.brand} ${m.name}`)

const car = (name: string, alt: string) => photo(name, [800, 1200], 1200, 900, alt)

export const MODELS: Model[] = [
  {
    key: 'polestar5', brand: 'Polestar', name: 'Polestar 5', kind: 'Rafmagn, Performance', power: 'Rafmagn', group: 'folksbill',
    price: P5.priceText, note: 'Langtímaleiga frá 791.640 kr. á mánuði í 36 mánuði.',
    facts: ['Allt að 650 kW, 0 í 100 km/klst. á 3,2 sek.', 'Til afgreiðslu strax, á lager'],
    href: LINKS.polestar5, img: car('m-polestar5', 'Grár Polestar 5'), studio: true,
  },
  {
    key: 'polestar4', brand: 'Polestar', name: 'Polestar 4', kind: 'Rafmagn, fjórhjóladrif', power: 'Rafmagn', group: 'jeppi',
    price: 'Frá 9.790.000 kr.', note: 'Til afgreiðslu í janúar 2027. Langtímaleiga frá 233.981 kr. á mánuði.',
    facts: ['Allt að 600 km drægni', 'Fjórhjóladrif, 5 sæti'],
    href: `${NB}/is/nyir-bilar?brand=POLESTAR`, img: car('m-polestar4', 'Silfurgrár Polestar 4'), studio: true,
  },
  {
    key: 'ex30', brand: 'Volvo', name: 'EX30 Recharge Ultra', kind: 'Rafmagn, fjórhjóladrif', power: 'Rafmagn', group: 'folksbill',
    price: '7.220.000 kr.', note: 'Með rafbílastyrk 6.820.000 kr. Kaupandinn sækir um styrk hjá Orkusjóði.',
    facts: ['Allt að 450 km drægni', 'Til afgreiðslu strax'],
    href: `${NB}/is/nyir-bilar/bill/KMA49`, img: car('m-ex30', 'Svartur Volvo EX30'), studio: true,
  },
  {
    key: 'ex30cc', brand: 'Volvo', name: 'EX30 Cross Country', kind: 'Rafmagn, fjórhjóladrif', power: 'Rafmagn', group: 'folksbill',
    price: '7.990.000 kr.', note: 'Tilboð. Listaverð 8.220.000 kr. Með rafbílastyrk 7.590.000 kr.',
    facts: ['Allt að 427 km drægni', 'Til afgreiðslu strax'],
    href: `${NB}/is/nyir-bilar/bill/TNH91`, img: car('m-ex30cc', 'Svartur Volvo EX30 Cross Country'), studio: true,
  },
  {
    key: 'ex90', brand: 'Volvo', name: 'EX90 Ultra', kind: 'Rafmagn, sjö sæta', power: 'Rafmagn', group: 'jeppi',
    price: 'Verð væntanlegt',
    facts: ['Allt að 608 km drægni', 'Fjórhjóladrif, 7 sæti'],
    href: `${NB}/is/nyir-bilar/bill/IXH19`, img: car('m-ex90', 'Grænn Volvo EX90'), studio: true,
  },
  {
    key: 'puma', brand: 'Ford', name: 'Puma EV Premium', kind: 'Rafmagn', power: 'Rafmagn', group: 'folksbill',
    price: '4.780.000 kr.', note: 'Tilboð. Listaverð 4.990.000 kr. Með rafbílastyrk 4.380.000 kr.',
    facts: ['Allt að 364 km drægni', 'Til afgreiðslu strax'],
    href: `${NB}/is/nyir-bilar/bill/NHE86`, img: car('m-puma', 'Hvítur Ford Puma EV'), studio: true,
  },
  {
    key: 'explorer', brand: 'Ford', name: 'Explorer Premium', kind: 'Rafmagn, fjórhjóladrif', power: 'Rafmagn', group: 'jeppi',
    price: '8.070.000 kr.', note: 'Tilboð. Listaverð 8.420.000 kr. Langtímaleiga frá 198.712 kr. á mánuði.',
    facts: ['Allt að 519 km drægni', 'Til afgreiðslu strax'],
    href: `${NB}/is/nyir-bilar/bill/FIN28`, img: car('m-explorer', 'Dökkgrár Ford Explorer'), studio: true,
  },
  {
    key: 'ranger', brand: 'Ford', name: 'Ranger Wildtrak PHEV', kind: 'Pallbíll, tengiltvinn', power: 'Tengiltvinn', group: 'pallbill',
    price: '14.490.000 kr.', note: 'Til afgreiðslu í janúar 2027. Langtímaleiga frá 362.250 kr. á mánuði.',
    facts: ['Dráttargeta 3.500 kg', 'Fjórhjóladrif, 5 sæti'],
    href: `${NB}/is/nyir-bilar?brand=FORD`, img: car('m-ranger', 'Hvítur Ford Ranger Wildtrak'), studio: true,
  },
  {
    key: 'transit', brand: 'Ford', name: 'Transit Custom L1H1 Trend', kind: 'Sendibíll, dísil', power: 'Dísil', group: 'sendibill',
    price: '6.677.419 kr. án vsk.', note: 'Tilboð. Listaverð 9.980.000 kr. með vsk.',
    facts: ['Dráttargeta 2.800 kg', 'Fjórhjóladrif, til afgreiðslu strax'],
    href: `${NB}/is/nyir-bilar/bill/ZZP70`, img: car('m-transit', 'Svartur Ford Transit Custom'), studio: true,
  },
  {
    key: 'cx60', brand: 'Mazda', name: 'CX-60 Takumi Plug-in Hybrid', kind: 'Jeppi, tengiltvinn', power: 'Tengiltvinn', group: 'jeppi',
    price: '9.710.000 kr.', note: 'Tilboð. Listaverð 10.710.000 kr.',
    facts: ['63 km á rafmagni', 'Fjórhjóladrif, dráttargeta 2.500 kg'],
    href: `${NB}/is/nyir-bilar/bill/BXD74`, img: car('m-cx60', 'Svartur Mazda CX-60'), studio: true,
  },
  {
    key: 'e3008', brand: 'Peugeot', name: 'E-3008 Allure', kind: 'Rafmagn', power: 'Rafmagn', group: 'jeppi',
    price: '6.780.000 kr.', note: 'Tilboð. Listaverð 7.080.000 kr. Með rafbílastyrk 6.380.000 kr.',
    facts: ['Allt að 525 km drægni', 'Til afgreiðslu strax'],
    href: `${NB}/is/nyir-bilar/bill/KJB85`, img: car('m-e3008', 'Silfurblár Peugeot E-3008'), studio: true,
  },
  {
    key: 'e5008', brand: 'Peugeot', name: 'E-5008 Allure AWD', kind: 'Rafmagn, sjö sæta', power: 'Rafmagn', group: 'sjo',
    price: '7.910.000 kr.', note: 'Tilboð. Listaverð 8.210.000 kr. Með rafbílastyrk 7.510.000 kr.',
    facts: ['Allt að 467 km drægni', 'Fjórhjóladrif, 7 sæti'],
    href: `${NB}/is/nyir-bilar/bill/YFJ88`, img: car('m-e5008', 'Blágrár Peugeot E-5008'), studio: true,
  },
]

/* Browse by type. Each card goes where that thing lives on this page. */
export const CATEGORIES = [
  { key: 'rafbilar', label: 'Rafbílar', href: '#urval', img: photo('p5-6', [800, 1228], 1228, 1536, 'Polestar 5 á hlykkjóttum fjallvegi, séður að ofan'), pos: '50% 38%' },
  { key: 'jeppar', label: 'Jeppar', href: '#urval', img: photo('c-jeppar', [640, 1344], 1344, 502, 'Blágrænn Peugeot E-3008 á vegi'), pos: '34% 60%' },
  { key: 'sjo', label: 'Sjö manna bílar', href: '#urval', img: photo('c-sjo', [640, 1344], 1344, 502, 'Grár Peugeot E-5008, sjö sæta rafbíll'), pos: '34% 60%' },
  { key: 'sendibilar', label: 'Sendibílar', href: '#urval', img: photo('c-send', [640, 1200], 1200, 900, 'Svartur Ford Transit Custom'), pos: '50% 62%' },
  { key: 'pallbilar', label: 'Pallbílar', href: '#urval', img: photo('c-pall', [640, 1200], 1200, 900, 'Hvítur Ford Ranger Wildtrak'), pos: '50% 62%' },
  { key: 'notadir', label: 'Notaðir bílar', href: '#notadir', img: photo('u-VNA78', [640, 1280], 1280, 853, 'Notaður Polestar 4 í sal Brimborgar'), pos: '50% 60%' },
] as const

/* ── Used cars: notadir.brimborg.is, 31.10.2026. The photos carry Brimborg's own badge and plates. ── */
export const USED = [
  { key: 'VNA78', name: 'Polestar 4 LRDM Plus', year: '12/2025', km: '7.564 km', fuel: 'Rafmagn', price: '8.990.000 kr.' },
  { key: 'KLE80', name: 'Polestar 2 LRDM Plus', year: '06/2025', km: '21.000 km', fuel: 'Rafmagn', price: '6.590.000 kr.' },
  { key: 'BHK47', name: 'Volvo EX30 Recharge Ultra', year: '12/2024', km: '14.892 km', fuel: 'Rafmagn', price: '5.690.000 kr.' },
  { key: 'FLN61', name: 'Volvo XC60 Inscription Plug-In Hybrid', year: '04/2021', km: '87.845 km', fuel: 'Tengiltvinn', price: '5.990.000 kr.' },
  { key: 'DTR21', name: 'Mazda CX-5 Homura', year: '04/2026', km: '2.600 km', fuel: 'Bensín', price: '8.190.000 kr.' },
  { key: 'YUP07', name: 'Mazda2 Hybrid Centre-Line', year: '03/2025', km: '18.009 km', fuel: 'Bensín og rafmagn', price: '3.890.000 kr.' },
  { key: 'KLN72', name: 'Citroën e-C4 MAX', year: '05/2025', km: '16.790 km', fuel: 'Rafmagn', price: '4.490.000 kr.' },
  { key: 'FXD86', name: 'Ford Explorer Platinum Plug-In Hybrid', year: '07/2021', km: '92.353 km', fuel: 'Tengiltvinn', price: '7.990.000 kr.' },
].map((u) => ({
  ...u,
  href: `${NO}/is/notadir-bilar/bill/${u.key}`,
  img: photo(`u-${u.key}`, [640, 1280], 1280, 853, `${u.name}, ${u.year}, hjá Brimborg`),
}))

/* ── The history Brimborg tells itself (Brimborg ehf., "Upplýsingar um Brimborg ehf.") ── */
export const SAGA = [
  { y: '1964', t: 'Brimborg stofnað sem sérhæft bílaverkstæði' },
  { y: '2024', t: 'Brimborg fagnar 60 ára afmæli í bílgreininni' },
  { y: '2026', t: 'Polestar 5 frumsýndur á Íslandi í október' },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Brimborg',
  legalName: CONTACT.legal,
  foundingDate: '1964',
  telephone: '+354 515 7000',
  email: CONTACT.email,
  url: 'https://www.brimborg.is',
  brand: ['Polestar', 'Volvo', 'Ford', 'Mazda', 'Citroën', 'Peugeot', 'Opel'].map((name) => ({ '@type': 'Brand', name })),
  address: { '@type': 'PostalAddress', streetAddress: 'Bíldshöfði 6', postalCode: '110', addressLocality: 'Reykjavík', addressCountry: 'IS' },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '10:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:00', closes: '16:15' },
  ],
}

export const companyEntry: PreviewCompany = {
  slug: 'brimborg',
  route: '/preview/brimborg',
  name: 'Brimborg',
  sector: 'Bílaumboð',
  location: 'Bíldshöfði 6, 110 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Umboðsaðili Ford, Volvo, Polestar, Mazda, Citroën, Peugeot og Opel á Íslandi, stofnað 1964',
  currentUrl: 'https://www.brimborg.is',
  ownerEmail: 'brimborg@brimborg.is',
  concept: 'Polestar 5 er kominn',
  conceptTagline: 'The Benni / ÍSBAND / Íslyft system re-cut in Brimborg teal: a Polestar 5 hero and a chapter with the real price, the lease and the Reykjavík showroom, electric against plug-in hybrid in one split, the stock cards for seven brands, used cars, the Bílorka charging statement, and an assistant that only answers “buy the website from Sindri”.',
  accent: '#00B6AD',
  dark: true,
  status: 'In build',
  thumb: A('hero-800.webp'),
  ownPhotography: true,
  photoCredit: 'Myndir af Polestar 5 og Polestar Reykjavík eru frá polestar.com. Myndir af bílum á lager og notuðum bílum eru af nyirbilar.brimborg.is og notadir.brimborg.is, og herferðarmyndir af brimborg.is, sótt 31. október 2026.',
  audit: {
    strengths: [
      'Sjö bílamerki undir einu þaki: Polestar, Volvo, Ford, Mazda, Citroën, Peugeot og Opel, auk Veltis fyrir atvinnutæki',
      'Polestar Reykjavík á Bíldshöfða 6 og Bílorka hraðhleðslunet, hvort tveggja sérstætt í íslenskum bílaiðnaði',
      'Lagerskrá með verðum, afhendingartíma og langtímaleigu á hverjum bíl',
    ],
    weaknesses: [
      'Forsíðan er byggð úr herferðarborðum og merkjaspjöldum þar sem texti og merki eru bökuð inn í myndirnar',
      'Nýir og notaðir bílar eru á tveimur vefsýningarsölum með öðru útliti en forsíðan',
      'Verð á Polestar 5 er ekki á síðu Polestar á Íslandi og sést aðeins á skrá yfir bíla á lager',
    ],
    opportunities: [
      'Ein forsíða sem sýnir nýjasta bílinn með verði, leigu og sýningarsalnum á einum stað',
      'Rafmagn og tengiltvinn borin saman í einni mynd, með rafbílastyrk og hleðslu við hliðina',
      'Aðstoðarmaður sem svarar á forsíðunni allan sólarhringinn',
    ],
  },
  positioning: 'Brimborg er umboðsaðili sjö bílamerkja á Íslandi og rekur Polestar Reykjavík á Bíldshöfða 6. Vefurinn á að sýna Polestar 5 með verði og sýningarsal, öll merkin og lagerinn á einum stað.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Brimborg',
    body: 'Góðan dag,\n\nÉg setti saman hugmynd að nýrri forsíðu fyrir Brimborg þar sem Polestar 5, verðið og sýningarsalurinn fá aðalhlutverkið:\n\n[HLEKKUR Á FRUMGERÐ]\n\nKveðja,\nSindri Már',
  },
}
