import type { PreviewCompany } from '../company-types'

/*
 * ÍSBAND (Íslensk-Bandaríska ehf.). Every fact on this page was read on
 * 01.10.2026 from the company's own sites: isband.is (forsíða, ÍSBAND/um okkur,
 * Hafa samband, Nýir bílar, Leapmotor, Jeep, RAM, Fiat og Fiat Professional
 * síðurnar, vörusíður, Breytingar, Þjónusta, Varahlutir, Neyðarþjónusta,
 * Bílalán, Rafbílastyrkur og fréttir 2024–2026) and 100bilar.is (forsíða og
 * Um okkur). Raw pages, text and the fact sheet with a source per line:
 * _docs/isband-harvest-2026-10-01/. Where their pages disagree, the choice is
 * named in DESIGN.md ("Contradictions").
 */

const BASE = import.meta.env.BASE_URL
export const A = (name: string) => `${BASE}isband/${name}`

export type Photo = { src: string; srcSet: string; alt: string; w: number; h: number }
const photo = (name: string, widths: number[], w: number, h: number, alt: string): Photo => ({
  src: A(`${name}-${widths[widths.length - 1]}.webp`),
  srcSet: widths.map((x) => `${A(`${name}-${x}.webp`)} ${Math.min(x, w)}w`).join(', '),
  alt,
  w,
  h,
})

const ISB = 'https://www.isband.is'

export const CONTACT = {
  legal: 'Íslensk-Bandaríska ehf.',
  kt: '620498-3439',
  vsk: '57964',
  street: 'Þverholti 6',
  town: '270 Mosfellsbæ',
  phone: '590 2300',
  tel: '+3545902300',
  email: 'isband@isband.is',
  emergency: '620 2391',
  emergencyTel: '+3546202391',
  facebook: 'https://www.facebook.com/isbandbilaumbod',
  slogan: 'Íslensk-Bandaríska síðan 1998',
}

export const LINKS = {
  leapmotor: `${ISB}/nyir-bilar/leapmotor/`,
  jeep: `${ISB}/nyir-bilar/`,
  ram: `${ISB}/ram/`,
  newCars: `${ISB}/nyir-bilar/`,
  breytingar: `${ISB}/breytingar/`,
  ramBreytingar: `${ISB}/breytingar/ram-breytingar/`,
  grandBreyting: `${ISB}/breytingar/grand-cherokee-33-breyting/`,
  thjonusta: `${ISB}/thjonusta/`,
  varahlutir: `${ISB}/thjonusta/varahlutir/`,
  neyd: `${ISB}/thjonusta/neydarthjonusta/`,
  abyrgd: `${ISB}/thjonusta/abyrgdarskilmalar/`,
  bilalan: `${ISB}/nyir-bilar/fjarmognun/bilalan/`,
  rafbilastyrkur: `${ISB}/nyir-bilar/rafbilastyrkur/`,
  rekstrarleiga: `${ISB}/rekstrarleiga/`,
  aukahlutir: `${ISB}/aukahlutir/`,
  um: `${ISB}/is-band/`,
  used: 'https://www.100bilar.is/',
  map: 'https://www.google.com/maps/search/?api=1&query=%C3%9Everholt+6%2C+270+Mosfellsb%C3%A6r',
  mapService: 'https://www.google.com/maps/search/?api=1&query=Smi%C3%B0sh%C3%B6f%C3%B0i+5%2C+110+Reykjav%C3%ADk',
  mapUsed: 'https://www.google.com/maps/search/?api=1&query=Stekkjarbakki+4%2C+109+Reykjav%C3%ADk',
}

/* Opening hours. d = JS weekday (0 Sun). Minutes from midnight. */
type Span = { d: number[]; from: number; to: number }
export type Dept = { key: string; name: string; street: string; phone: string; tel: string; email: string; hours: { label: string; time: string }[]; spans: Span[]; map: string; note?: string }
const WEEK = [1, 2, 3, 4, 5]
export const DEPTS: Dept[] = [
  {
    key: 'nyir', name: 'Nýir bílar', street: 'Þverholti 6, Mosfellsbæ', phone: '590 2300', tel: '+3545902300', email: 'isband@isband.is',
    hours: [{ label: 'Virkir dagar', time: '10:00–17:00' }, { label: 'Helgar', time: 'Lokað' }],
    spans: [{ d: WEEK, from: 600, to: 1020 }], map: LINKS.map,
  },
  {
    /* 100bilar.is (Um okkur) says Saturdays 12–14 and closed on summer and December
       Saturdays; isband.is's footer says 11–14. Their own page wins. */
    key: 'notadir', name: 'Notaðir bílar', street: '100 bílar, Stekkjarbakka 4', phone: '517 9999', tel: '+3545179999', email: '100bilar@100bilar.is',
    hours: [{ label: 'Virkir dagar', time: '10:00–18:00' }, { label: 'Laugardaga', time: '12:00–14:00' }],
    spans: [{ d: WEEK, from: 600, to: 1080 }, { d: [6], from: 720, to: 840 }], map: LINKS.mapUsed,
    note: 'Lokað á laugardögum á sumrin og í desember.',
  },
  {
    key: 'verkstaedi', name: 'Verkstæði', street: 'Smiðshöfða 5, Reykjavík', phone: '590 2323', tel: '+3545902323', email: 'thjonusta@isband.is',
    hours: [{ label: 'Mánudaga til fimmtudaga', time: '07:45–17:00' }, { label: 'Föstudaga', time: '07:45–16:00' }],
    spans: [{ d: [1, 2, 3, 4], from: 465, to: 1020 }, { d: [5], from: 465, to: 960 }], map: LINKS.mapService,
  },
  {
    /* Hours: Þjónusta, Varahlutir and Hafa samband all say 07:45; only the footer says 08:00. */
    key: 'varahlutir', name: 'Varahlutaverslun', street: 'Smiðshöfða 5, Reykjavík', phone: '590 2332', tel: '+3545902332', email: 'varahlutir@isband.is',
    hours: [{ label: 'Mánudaga til fimmtudaga', time: '07:45–17:00' }, { label: 'Föstudaga', time: '07:45–16:00' }],
    spans: [{ d: [1, 2, 3, 4], from: 465, to: 1020 }, { d: [5], from: 465, to: 960 }], map: LINKS.mapService,
  },
]

/* Neyðarþjónusta: weekdays 17–22, weekends and public holidays 10–20. */
export const EMERGENCY = { weekdays: '17:00–22:00', weekends: '10:00–20:00', fee: '25.000 kr.' }

/* Iceland keeps UTC all year, so the clock needs no zone library. */
export function openState(dept: Dept, now = new Date()) {
  const d = now.getUTCDay()
  const m = now.getUTCHours() * 60 + now.getUTCMinutes()
  const today = dept.spans.find((s) => s.d.includes(d))
  const hhmm = (x: number) => `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`
  if (today && m >= today.from && m < today.to) return { open: true, text: `Opið til ${hhmm(today.to)}` }
  if (today && m < today.from) return { open: false, text: `Opnar kl. ${hhmm(today.from)}` }
  return { open: false, text: 'Lokað núna' }
}

export const IMG = {
  hero: photo('hero', [800, 1600, 2560], 2560, 1440, 'Rauður RAM 2500 pallbíll á blautri möl undir skógi vöxnum fjöllum'),
  splitJeep: photo('split-jeep', [800, 1600, 1920], 1920, 1080, 'Þrír breyttir Jeep Wrangler, rauður, grár og svartur, í íslenskri fjallshlíð'),
  splitLeap: photo('split-leap', [800, 1600, 2000], 2000, 1000, 'Dökkgrænn Leapmotor C10 við timburklædda byggingu'),
  drive: photo('drive', [800, 1600, 2200], 4032, 3024, 'Svartur breyttur RAM pallbíll á möl undir snævi þöktum fjöllum'),
  statement: photo('statement', [700, 1400, 2000], 4032, 2794, 'Svartur RAM Limited með fjögur aukaljós framan á, breyttur hjá ÍSBAND'),
  kerra: photo('s-kerra', [800, 1200], 1200, 800, 'Rauður breyttur RAM 3500 dregur lokaða kerru við snævi þakin fjöll'),
  dekk: photo('s-dekk', [800, 1600], 4032, 2688, 'Gróft jeppadekk og brettakantur á breyttum RAM'),
  ljos: photo('s-ljos', [800, 1500], 1500, 938, 'Svartur breyttur RAM með ljósagrind á malarplani'),
  hus: photo('h-hus', [700, 1200], 1200, 900, 'Sýningarsalur ÍSBAND í Þverholti 6 og bílaplanið fyrir framan'),
  leap: photo('h-leap', [700, 1400], 1920, 1279, 'Leapmotor T03 og C10 hlið við hlið'),
  ramhd: photo('h-ramhd', [700, 1400], 4032, 3024, 'Grár breyttur RAM Heavy Duty á grasi'),
  grand: photo('h-grand', [700, 1400], 4032, 3024, 'Svartur Jeep Grand Cherokee á 33 tommu breytingu'),
  ram37: photo('h-ram37', [700, 1200], 1200, 800, 'Svartur RAM á 37 tommu breytingu við snævi þakin fjöll'),
}

/* ── New cars: the thirteen lines on isband.is's own front page ────────── */

export type Brand = 'Leapmotor' | 'Jeep' | 'RAM' | 'Fiat' | 'Fiat Professional'
export type Model = {
  key: string
  brand: Brand
  name: string
  kind: string
  power?: 'Rafmagn' | 'Tengiltvinn' | 'Dísil' | 'Bensín'
  /** display price, their wording; null = ask a salesperson */
  price: string | null
  note?: string
  facts: string[]
  href: string
  img: Photo
  studio?: boolean
}

/** "RAM 1500", "Leapmotor T03": the brand once, never twice */
export const fullName = (m: Pick<Model, 'brand' | 'name'>) => (m.name.startsWith(m.brand) ? m.name : `${m.brand} ${m.name}`)

const card = (name: string, widths: number[], w: number, h: number, alt: string) => photo(name, widths, w, h, alt)

export const MODELS: Model[] = [
  {
    key: 't03', brand: 'Leapmotor', name: 'T03', kind: 'Borgarbíll', power: 'Rafmagn',
    price: '2.390.000 kr.', note: 'Með 500.000 kr. rafbílastyrk. Listaverð 2.890.000 kr.',
    facts: ['Fjögurra manna borgarbíll', 'Panorama glerþak og bakkmyndavél'],
    href: `${ISB}/product/leapmotor-t03/`, img: card('m-t03', [800, 1600], 1600, 1200, 'Ljósblár Leapmotor T03'), studio: true,
  },
  {
    key: 'b03x', brand: 'Leapmotor', name: 'B03X', kind: 'Jepplingur', power: 'Rafmagn',
    price: 'Frá 2.990.000 kr.', note: 'Með rafbílastyrk. Listaverð frá 3.490.000 kr.',
    facts: ['Allt að 380 km drægni (WLTP), Design', '197 hö, framhjóladrif'],
    href: `${ISB}/product/leapmotor-b03x-design/`, img: card('m-b03x', [800, 1600], 1600, 1200, 'Dökkgrænn Leapmotor B03X'), studio: true,
  },
  {
    key: 'b05', brand: 'Leapmotor', name: 'B05 Design', kind: 'Fólksbíll', power: 'Rafmagn',
    price: '3.990.000 kr.', note: 'Með rafbílastyrk. Listaverð 4.490.000 kr.',
    facts: ['481 km drægni (WLTP)', '218 hö, afturhjóladrif'],
    href: `${ISB}/product/leapmotor-b05-design/`, img: card('m-b05', [800, 1600], 1600, 1200, 'Gulur Leapmotor B05'), studio: true,
  },
  {
    key: 'b10', brand: 'Leapmotor', name: 'B10 Design', kind: 'Jepplingur', power: 'Rafmagn',
    price: '4.790.000 kr.', note: 'Með rafbílastyrk. Listaverð 5.290.000 kr.',
    facts: ['434 km drægni (WLTP)', '218 hö, 67,6 kWh rafhlaða'],
    href: `${ISB}/product/leapmotor-b10-design/`, img: card('m-b10', [800, 1600], 1600, 1200, 'Blágrár Leapmotor B10'), studio: true,
  },
  {
    key: 'c10', brand: 'Leapmotor', name: 'C10 Design AWD', kind: 'Rafjeppi', power: 'Rafmagn',
    price: '5.990.000 kr.', note: 'Með rafbílastyrk. Listaverð 6.490.000 kr.',
    facts: ['600 hö, fjórhjóladrif', '437 km drægni (WLTP)'],
    href: `${ISB}/product/leapmotor-c10-design-awd/`, img: card('m-c10', [800, 1600], 1600, 1200, 'Dökkgrænn Leapmotor C10'), studio: true,
  },
  {
    key: 'wrangler', brand: 'Jeep', name: 'Wrangler Rubicon 4xe', kind: 'Jeppi, tengiltvinn', power: 'Tengiltvinn',
    price: '13.990.000 kr.', note: 'Tilboðsverð. Listaverð 14.990.000 kr.',
    facts: ['374 hö, 4x4 með lágu drifi', 'Driflæsingar að framan og aftan'],
    href: `${ISB}/product/new-jeep-wrangler-rubicon/`, img: card('m-wrangler', [800, 1333], 1333, 1000, 'Grár Jeep Wrangler Rubicon 4xe á vegi við stöðuvatn'),
  },
  {
    key: 'grand', brand: 'Jeep', name: 'Grand Cherokee Summit Reserve', kind: 'Lúxusjeppi, tengiltvinn', power: 'Tengiltvinn',
    price: '16.990.000 kr.',
    facts: ['380 hö, 53 km á rafmagni (WLTP)', 'McIntosh hljómkerfi með 19 hátölurum'],
    href: `${ISB}/product/jeep-grand-cherokee-summit-reserve/`, img: card('m-grand', [800, 1600], 3629, 2722, 'Svartur Jeep Grand Cherokee á möl með fjöll í baksýn'),
  },
  {
    key: 'avenger', brand: 'Jeep', name: 'Avenger Upland 4x4', kind: 'Jepplingur, mild hybrid',
    price: 'Frá 8.790.000 kr.',
    facts: ['156 hö, fjórhjóladrif', '5,4 l/100 km (WLTP)'],
    href: `${ISB}/product/jeep-avenger-mild-hybrid-upland-4x4/`, img: card('m-avenger', [800, 1024], 1024, 768, 'Ljós Jeep Avenger á hellulögðu torgi við sólsetur'),
  },
  {
    key: 'ram1500', brand: 'RAM', name: 'RAM 1500', kind: 'Pallbíll',
    price: 'Frá 18.190.000 kr.',
    facts: ['3,0 l Hurricane, allt að 540 hestöfl', '5 ára verksmiðjuábyrgð'],
    href: `${ISB}/ram/ram-1500/`, img: card('m-ram1500', [800], 853, 640, 'Grár RAM 1500 RHO á klöpp í skógi'),
  },
  {
    key: 'ramhd', brand: 'RAM', name: 'RAM 2500/3500', kind: 'Heavy Duty pallbíll',
    price: 'Frá 12.782.333 kr. án vsk.', note: 'Laramie Crew Cab með vsk.: 15.850.093 kr.',
    facts: ['430 hestöfl og 1.458 Nm', '5 ára verksmiðjuábyrgð'],
    href: `${ISB}/ram/ram-2500-3500/`, img: card('m-ramhd', [800, 1600], 4032, 3024, 'Grár breyttur RAM Heavy Duty með ljósagrind'),
  },
  {
    key: '600e', brand: 'Fiat', name: '600e', kind: 'Fimm manna rafbíll', power: 'Rafmagn',
    price: 'Frá 5.790.000 kr.',
    facts: ['400 km drægni í blönduðum akstri', '385 lítra farangursrými'],
    href: `${ISB}/nyir-bilar/fiat-600e/`, img: card('m-600e', [800, 1000], 1000, 750, 'Rauður Fiat 600e við múrsteinshús'),
  },
  {
    key: '500e', brand: 'Fiat', name: '500e', kind: 'Borgarbíll', power: 'Rafmagn',
    price: null, facts: [],
    href: `${ISB}/nyir-bilar/fiat-500e/`, img: card('m-500e', [800, 1000], 1000, 750, 'Ljósbleikur Fiat 500e'),
  },
  {
    key: 'fiatpro', brand: 'Fiat Professional', name: 'Atvinnubílar', kind: 'Doblò, Scudo og Ducato',
    price: 'Frá 4.266.129 kr. án vsk.', note: 'Doblò Van með vsk.: 5.290.000 kr. Rafmagnsútfærslur í boði.',
    facts: ['Doblò Van, Scudo Van, Ducato og Ducato Truck'],
    href: `${ISB}/nyir-bilar/fiat-professional/`, img: card('m-fiatpro', [800, 1066], 1067, 800, 'Fjórir hvítir Fiat Professional sendibílar í röð'),
  },
]

/* Browse by type. Each card goes where that thing lives on this page. */
export const CATEGORIES = [
  { key: 'rafbilar', label: 'Rafbílar', href: '#urval', img: photo('c-raf', [640, 1280], 1600, 1000, 'Leapmotor B10 á hellulagðri götu'), pos: '42% 60%' },
  { key: 'jeppar', label: 'Jeppar', href: '#urval', img: photo('c-jeppar', [640, 1280, 1605], 1605, 1070, 'Svartur Jeep Grand Cherokee á 33 tommu breytingu'), pos: '40% 60%' },
  { key: 'pallbilar', label: 'Pallbílar', href: '#urval', img: photo('c-pall', [640, 1280], 4032, 3024, 'Grár RAM Heavy Duty á möl með fjöll í baksýn'), pos: '38% 62%' },
  { key: 'atvinnubilar', label: 'Atvinnubílar', href: '#urval', img: photo('c-atv', [640, 1280, 2000], 2000, 750, 'Fiat Professional sendibílar'), pos: '36% 60%' },
  { key: 'breyttir', label: 'Breyttir bílar', href: '#breytingar', img: photo('c-breytt', [640, 1280, 1605], 1605, 1070, 'Breyttur Jeep Wrangler á 35 tommu dekkjum í snjó'), pos: '62% 60%' },
  { key: 'notadir', label: 'Notaðir bílar', href: '#notadir', img: photo('u-272167', [640, 1280], 1280, 1024, 'Breyttur Jeep Wrangler Rubicon í sal 100 bíla'), pos: '42% 60%' },
] as const

/* ── Used cars: 100 bílar's own front page, 01.10.2026 ────────────────── */
export const USED = [
  { key: 'u-272167', name: 'Jeep Wrangler Rubicon 40', year: '1/2022', km: '38.000 km', fuel: 'Bensín / rafmagn', price: '12.950.000 kr.' },
  { key: 'u-646276', name: 'Dodge Ram 3500 Laramie', year: '6/2022', km: '230.000 km', fuel: 'Dísil', price: '6.950.000 kr. án vsk.' },
  { key: 'u-532463', name: 'Jeep Wrangler Sahara 4xe', year: '6/2021', km: '72.000 km', fuel: 'Bensín / rafmagn', price: '6.950.000 kr.' },
  { key: 'u-863836', name: 'Toyota RAV4 GX Plug-in Hybrid', year: '1/2023', km: '31.000 km', fuel: 'Bensín / rafmagn', price: '6.950.000 kr.' },
  { key: 'u-597512', name: 'Jeep Compass S 4xe', year: '2/2022', km: '62.000 km', fuel: 'Bensín / rafmagn', price: '3.990.000 kr.' },
  { key: 'u-550547', name: 'BMW X5 xDrive 25d', year: '7/2014', km: '177.000 km', fuel: 'Dísil', price: '3.950.000 kr.' },
  { key: 'u-848354', name: 'Nissan Juke', year: '3/2022', km: '148.000 km', fuel: 'Bensín', price: '1.990.000 kr.' },
  { key: 'u-772144', name: 'Renault Clio', year: '5/2015', km: '137.000 km', fuel: 'Bensín', price: '690.000 kr.' },
].map((u) => ({
  ...u,
  href: `https://www.100bilar.is/CarDetails.aspx?bid=56&cid=${u.key.slice(2)}`,
  img: photo(u.key, [640, 1280], 1280, 1024, `${u.name}, ${u.year}, hjá 100 bílum`),
}))

/* ── Modification packages, verbatim from isband.is ───────────────────── */
export const MODS = {
  ram: '35″, 37″ og 40″ breytingar á RAM',
  wrangler: '35″, 37″ og 40″ breyttir Wrangler Rubicon',
  grand: [
    { size: '33″ breyting nr. 1', items: '33″ dekk, 17″ felgur, brettakantar', price: '2.753.138 kr.' },
    { size: '33″ breyting nr. 2', items: 'Sama og nr. 1 auk stigbretta', price: '3.081.714 kr.' },
  ],
  wrangler37: { name: 'Wrangler Rubicon 37″ breyttur', price: '16.696.896 kr.' },
}

/* Lykill car loans on Leapmotor, isband.is Bílalán (figures from Lykill 20.08.2026). */
export const LOANS = [
  { name: 'T03', monthly: '39.311 kr.', ahk: '12,44%' },
  { name: 'B03X Life', monthly: '50.960 kr.', ahk: '13,27%' },
  { name: 'B03X Design', monthly: '61.640 kr.', ahk: '13,21%' },
  { name: 'B05 Life', monthly: '59.860 kr.', ahk: '13,22%' },
  { name: 'B05 Design', monthly: '68.760 kr.', ahk: '13,19%' },
]

/* ── The story: ÍSBAND's own "Um okkur" and news, in order ────────────── */
export const SAGA = [
  { y: '1998', t: 'Októ Þorgrímsson stofnar ÍSBAND utan um innflutning á notuðum bílum frá Bandaríkjunum' },
  { y: '2016', t: 'Fiat Chrysler velur ÍSBAND sem dreifingaraðila sinn á Íslandi' },
  { y: '2016', t: '100 bílar flytja í Stekkjarbakka í Mjódd' },
  { y: '2017', t: 'Nýr og endurbættur sýningarsalur opnar í Þverholti' },
  { y: '2023', t: 'Jafnlaunastaðfesting Jafnréttisstofu' },
  { y: '2025', t: 'Leapmotor frumsýndur á Íslandi' },
  { y: '2026', t: 'Nýr RAM 2500 frumsýndur' },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'ÍSBAND',
  legalName: CONTACT.legal,
  foundingDate: '1998',
  telephone: '+354 590 2300',
  email: CONTACT.email,
  url: 'https://www.isband.is',
  brand: ['Jeep', 'RAM', 'Fiat', 'Fiat Professional', 'Leapmotor'].map((name) => ({ '@type': 'Brand', name })),
  address: { '@type': 'PostalAddress', streetAddress: 'Þverholt 6', postalCode: '270', addressLocality: 'Mosfellsbær', addressCountry: 'IS' },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '17:00' },
  ],
}

export const companyEntry: PreviewCompany = {
  slug: 'isband',
  route: '/preview/isband',
  name: 'ÍSBAND',
  sector: 'Bílaumboð',
  location: 'Þverholt 6, 270 Mosfellsbær',
  region: 'Höfuðborgarsvæðið',
  established: 'Umboðsaðili Jeep, RAM, Fiat og Leapmotor á Íslandi, stofnað 1998',
  currentUrl: 'https://www.isband.is',
  ownerEmail: 'isband@isband.is',
  concept: 'Breyttur bíll, óbreytt ábyrgð',
  conceptTagline: 'The Benni system (Spyker motion, Drivehub layout) re-cut in ÍSBAND red: Jeep and RAM against Leapmotor in one split, the thirteen lines from their own front page, 100 bílar’s used stock, the conversion workshop as the statement, and an assistant that only answers from this page.',
  accent: '#EC1840',
  dark: true,
  status: 'In build',
  thumb: A('hero-800.webp'),
  ownPhotography: true,
  photoCredit: 'Myndir af isband.is og 100bilar.is, október 2026. Myndir af nýjum bílum eru frá framleiðendunum; myndir af breyttum bílum eru frá ÍSBAND.',
  audit: {
    strengths: [
      'Eina bílaumboðið sem breytir sjálft, svo breyttir Jeep og RAM halda verksmiðjuábyrgð',
      'Fimm merki undir einu þaki: Jeep, RAM, Fiat, Fiat Professional og Leapmotor, auk 100 bíla',
      'Skýr verð á hverri gerð og ódýrustu rafbílar landsins í sínum stærðarflokkum',
    ],
    weaknesses: [
      'Forsíðan er rist af auglýsingamyndum þar sem texti og verð eru bökuð inn í myndirnar og rekast á texta síðunnar',
      'Opnunartímar og símanúmer varahlutaverslunar stangast á milli síðna',
      'Notaðir bílar eru á sérvef 100 bíla með öðru útliti',
    ],
    opportunities: [
      'Ein forsíða sem sýnir öll merkin, verðin, notaða bíla og verkstæðið á einum stað',
      'Breytingaverkstæðið sem rauður þráður: breyttur bíll, óbreytt ábyrgð',
      'Aðstoðarmaður sem svarar um verð, opnunartíma og þjónustu allan sólarhringinn',
    ],
  },
  positioning: 'ÍSBAND er umboðsaðili Jeep, RAM, Fiat og Leapmotor á Íslandi og eina bílaumboðið sem sér sjálft um breytingar. Vefurinn á að sýna öll merkin, verðin og breytingaverkstæðið á einum stað.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir ÍSBAND',
    body: 'Góðan dag,\n\nÉg setti saman hugmynd að nýrri forsíðu fyrir ÍSBAND þar sem öll merkin, verðin, notaðir bílar og breytingaverkstæðið eru á einum stað:\n\n[HLEKKUR Á FRUMGERÐ]\n\nKveðja,\nSindri Már',
  },
}
