import type { PreviewCompany } from '../company-types'

/*
 * Bílabúð Benna. Every fact on this page was read on 29.09.2026 from the
 * company's own sites: benni.is (home, Um, Saga, Þjónustuverkstæði, footer),
 * kgm.benni.is (six model pages, ábyrgðarskilmálar, breytingapakkar),
 * notadir.benni.is (söluskrá + detail pages), nesdekk.is, and Porsche's dealer
 * site for Bílabúð Benna (dealer.porsche.com/is/island/is-IS/nyir-bilar,
 * prices re-read in a real browser). Fact sheet with a source and a quote per
 * line: _docs/benni-harvest-2026-09-29/FACTS.md. Nothing below is typed from
 * memory; where the sources disagree the choice is named in DESIGN.md.
 */

const BASE = import.meta.env.BASE_URL
export const A = (name: string) => `${BASE}benni/${name}`

export type Photo = { src: string; srcSet: string; alt: string; w: number; h: number }
const photo = (name: string, widths: number[], w: number, h: number, alt: string): Photo => ({
  src: A(`${name}-${widths[widths.length - 1]}.webp`),
  srcSet: widths.map((x) => `${A(`${name}-${x}.webp`)} ${Math.min(x, w)}w`).join(', '),
  alt,
  w,
  h,
})

export const CONTACT = {
  legal: 'Bílabúð Benna ehf.',
  kt: '711292-2929',
  vsk: '36193',
  street: 'Krókhálsi 9',
  town: '110 Reykjavík',
  phone: '590 2000',
  tel: '+3545902000',
  email: 'benni@benni.is',
  emergency: '800 0911',
  emergencyTel: '+3548000911',
  facebook: 'https://www.facebook.com/bilabudbenna',
  slogan: 'Sérfræðingar í bílum síðan 1975',
}

export const LINKS = {
  porsche: 'https://dealer.porsche.com/is/island/is-IS/nyir-bilar',
  kgm: 'https://kgm.benni.is/nyirbilar-yfirlit/',
  kgmTestDrive: 'https://kgm.benni.is/forsida/reynsluakstur/',
  kgmService: 'https://kgm.benni.is/bokathjonustu/',
  kgmWarranty: 'https://kgm.benni.is/abyrgdarskilmalar/',
  kgmMods: 'https://kgm.benni.is/breytingapakkar/',
  used: 'https://notadir.benni.is/soluskra/',
  nesdekk: 'https://nesdekk.is/',
  saga: 'https://benni.is/saga-bilabudar-benna/',
  map: 'https://www.google.com/maps/search/?api=1&query=Kr%C3%B3kh%C3%A1ls+9%2C+110+Reykjav%C3%ADk',
  mapService: 'https://www.google.com/maps/search/?api=1&query=Tangarh%C3%B6f%C3%B0i+8%2C+110+Reykjav%C3%ADk',
}

/* Opening hours, benni.is footer. d = JS weekday (0 Sun). Minutes from midnight. */
type Span = { d: number[]; from: number; to: number }
export type Dept = { key: string; name: string; street: string; phone: string; tel: string; email: string; hours: { label: string; time: string }[]; spans: Span[]; map: string }
const WEEK = [1, 2, 3, 4, 5]
export const DEPTS: Dept[] = [
  {
    key: 'salur', name: 'Sýningarsalir', street: 'Krókhálsi 9', phone: '590 2000', tel: '+3545902000', email: 'benni@benni.is',
    hours: [{ label: 'Virkir dagar', time: '09:00–17:00' }, { label: 'Laugardaga', time: '12:00–16:00' }],
    spans: [{ d: WEEK, from: 540, to: 1020 }, { d: [6], from: 720, to: 960 }], map: LINKS.map,
  },
  {
    key: 'notadir', name: 'Notaðir bílar', street: 'Krókhálsi 9', phone: '590 2035', tel: '+3545902035', email: 'notadir-bilar@benni.is',
    hours: [{ label: 'Virkir dagar', time: '09:00–17:00' }, { label: 'Laugardaga', time: '12:00–16:00' }],
    spans: [{ d: WEEK, from: 540, to: 1020 }, { d: [6], from: 720, to: 960 }], map: LINKS.map,
  },
  {
    key: 'verkstaedi', name: 'Þjónustuverkstæði', street: 'Tangarhöfða 8', phone: '590 2050', tel: '+3545902050', email: 'thjonusta@benni.is',
    hours: [{ label: 'Mánudaga til fimmtudaga', time: '07:45–17:00' }, { label: 'Föstudaga', time: '07:45–16:00' }],
    spans: [{ d: [1, 2, 3, 4], from: 465, to: 1020 }, { d: [5], from: 465, to: 960 }], map: LINKS.mapService,
  },
  {
    key: 'varahlutir', name: 'Varahlutir', street: 'Tangarhöfða 8–12', phone: '590 2010', tel: '+3545902010', email: 'thjonusta@benni.is',
    hours: [{ label: 'Mánudaga til fimmtudaga', time: '07:45–17:00' }, { label: 'Föstudaga', time: '07:45–16:00' }],
    spans: [{ d: [1, 2, 3, 4], from: 465, to: 1020 }, { d: [5], from: 465, to: 960 }], map: LINKS.mapService,
  },
]

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
  hero: photo('hero2', [800, 1600, 2400, 3200], 5824, 3776, 'Rauður KGM Musso Grand pallbíll ekur í gegnum vatn undir snævi þöktum fjöllum'),
  cayenne: photo('cayenne', [800, 1600, 2400], 2480, 857, 'Porsche Cayenne Electric, grænblár, og annar Cayenne í bakgrunni við steinsteypta byggingu'),
  rexton: photo('rexton', [800, 1600, 2400], 2560, 1660, 'Svartur KGM Rexton á götu í Reykjavík'),
  rextonTjorn: photo('rexton-tjorn', [800, 1600], 2560, 1660, 'KGM Rexton við Tjörnina í Reykjavík'),
  mussoGrand: photo('musso-grand', [800, 1600, 2400], 2560, 1660, 'Rauður KGM Musso Grand pallbíll ekur í gegnum vatn'),
  mussoEv: photo('musso-ev', [800, 1600, 2400], 2560, 1660, 'Gulur KGM Musso EV í mosavöxnu hrauni'),
  torres: photo('torres', [800, 1536], 1536, 900, 'KGM Torres EVX í fjöru með fjöll í baksýn'),
  korando: photo('korando', [800, 1600], 1690, 868, 'Hvítur KGM Korando í eldfjallalandslagi'),
  tivoli: photo('tivoli', [800, 1240], 1240, 868, 'KGM Tivoli'),
  kgmRange: photo('kgm-range', [800, 1600, 2000], 2000, 1205, 'Fjórir KGM jeppar í röð í fjöru'),
  macan: photo('macan', [800, 1600, 2048], 2048, 1159, 'Ljósblár Porsche Macan Electric við bílskúrsdyr'),
  taycan: photo('taycan', [800, 1248], 1248, 824, 'Ljós Porsche Taycan á hvítum palli'),
  a1975: photo('a1975', [700, 1400], 1400, 970, 'Svarthvít mynd: bræðurnir Jón og Benni að vinna í bíl á verkstæðinu'),
  a1991: photo('a1991', [700, 1400], 1400, 970, 'Breyttir jeppar í leiðangri á jökli, 1991'),
  a1996: photo('a1996', [700, 1400], 1400, 970, 'Xtremer, rauður torfærubíll smíðaður hjá Bílabúð Benna'),
  a2000: photo('a2000', [700, 1400], 1400, 970, 'Porsche í sýningarbás í Kringlunni árið 2000'),
  a2019: photo('a2019', [700, 1400], 1400, 970, 'Hús Nesdekks með grænum og svörtum merkingum'),
  a2024: photo('a2024', [700, 1400], 1400, 970, 'Stálgrind nýs Porsche sýningarsalar í byggingu, 2024'),
  stuttgart: photo('stuttgart', [800, 1600, 2400], 2480, 1340, 'Starfsfólk Bílabúðar Benna fyrir utan Porsche safnið í Stuttgart, október 2025'),
  hus: photo('hus', [800, 1600], 1600, 1200, 'Krókháls 9 úr lofti á 50 ára afmælishátíðinni'),
  salurMacan: photo('salur-macan', [800, 1600], 1600, 720, 'Dökkgrænn Porsche Macan Electric í sýningarsalnum á Krókhálsi'),
  salurCayenne: photo('salur-cayenne', [800, 1600], 1600, 720, 'Gestir í Porsche salnum á Krókhálsi hjá silfruðum Cayenne'),
  dakar: photo('dakar', [800, 1600], 1600, 1066, 'Porsche 911 Dakar á grasflötinni fyrir framan Krókháls 9 undir gulum fánum'),
  verkstaedi: photo('verkstaedi', [800, 1600], 2048, 1365, 'Tæknimaður vinnur við appelsínugulan rafknúinn Porsche á lyftu'),
}

/* ── New cars ──────────────────────────────────────────────────────────── */

export type Model = {
  key: string
  brand: 'Porsche' | 'KGM'
  name: string
  /** their own tagline, verbatim */
  line: string
  kind: string
  /** omitted where their own page does not say */
  power?: 'Rafmagn' | 'Dísil' | 'Bensín'
  /** display price, verbatim wording; null = ask a salesperson */
  price: string | null
  note?: string
  facts: string[]
  href: string
  img?: Photo
}

export const MODELS: Model[] = [
  {
    key: 'cayenne-electric', brand: 'Porsche', name: 'Cayenne Electric', line: 'Án hliðstæðu.', kind: 'Rafmagnaður jeppi', power: 'Rafmagn',
    price: '16.950.000 kr.', facts: ['Coupé útgáfa: 17.450.000 kr.', 'Plug In Hybrid: 23.950.000 kr.'],
    href: 'https://dealer.porsche.com/is/island/is-IS/nyir-bilar/Cayenne-Electric', img: IMG.cayenne,
  },
  {
    key: 'macan', brand: 'Porsche', name: 'Macan', line: 'Breyttu orkunni - ekki kraftinum.', kind: 'Rafmögnuð upplifun', power: 'Rafmagn',
    price: 'Frá 13.950.000 kr.', facts: [], href: LINKS.porsche, img: IMG.macan,
  },
  {
    key: 'taycan', brand: 'Porsche', name: 'Taycan', line: 'Upplifðu meira.', kind: 'Sálin, rafmögnuð', power: 'Rafmagn',
    price: 'Frá 15.450.000 kr.', facts: ['Taycan Cross Turismo frá 17.950.000 kr.'],
    href: 'https://dealer.porsche.com/is/island/is-IS/nyir-bilar/Taycan', img: IMG.taycan,
  },
  {
    key: '911', brand: 'Porsche', name: '911', line: 'Tímalaus.', kind: 'Á mynd: 911 Dakar á Krókhálsi',
    price: null, facts: [], href: LINKS.porsche, img: IMG.dakar,
  },
  {
    key: 'rexton', brand: 'KGM', name: 'Rexton', line: 'Fyrir íslenskar aðstæður!', kind: 'Jeppi', power: 'Dísil',
    price: 'Frá 10.980.000 kr.', facts: ['202 hö, sjálfskiptur, 4WD', 'Dráttargeta 3.500 kg', '5 ára verksmiðjuábyrgð'],
    href: 'https://kgm.benni.is/rexton/', img: IMG.rexton,
  },
  {
    key: 'musso-grand', brand: 'KGM', name: 'Musso Grand', line: 'Kraftmikill vinnuþjarkur', kind: 'Pallbíll', power: 'Dísil',
    price: 'Frá 7.990.000 kr.', facts: ['Burðargeta allt að 1.025 kg', 'Dráttargeta allt að 3.500 kg'],
    href: 'https://kgm.benni.is/musso-grand/', img: IMG.mussoGrand,
  },
  {
    key: 'musso-ev', brand: 'KGM', name: 'Musso EV', line: 'Rafmagnaður vinnufélagi', kind: 'Rafmagnspallbíll', power: 'Rafmagn',
    price: 'Frá 6.390.000 kr.', note: 'Verð með 500.000 kr. styrk.', facts: ['Drægni allt að 420 km í blönduðum akstri', '7 ára ábyrgð, 10 ára ábyrgð á rafhlöðu'],
    href: 'https://kgm.benni.is/musso-ev/', img: IMG.mussoEv,
  },
  {
    key: 'torres', brand: 'KGM', name: 'Torres EVX', line: 'Rafmögnuð ævintýri', kind: 'Stór, rúmgóður og 100% rafmagnaður', power: 'Rafmagn',
    price: 'Frá 5.890.000 kr.', note: 'Verð með 500.000 kr. styrk úr Orkusjóði, byggt á gengi í nóvember 2024.',
    facts: ['Allt að 462 km drægni (skv. WLTP)', '7 ára ábyrgð', '10 ára ábyrgð á rafhlöðu eða 1.000.000 km'],
    href: 'https://kgm.benni.is/torres-evx/', img: IMG.torres,
  },
  {
    key: 'korando', brand: 'KGM', name: 'Korando', line: 'Ævintýrin kalla!', kind: 'Sportjeppi', power: 'Bensín',
    price: 'Frá 6.990.000 kr.', facts: ['163 hö, AWD', 'Dráttargeta 1.500 kg', '5 ára ábyrgð'],
    href: 'https://kgm.benni.is/korando/', img: IMG.korando,
  },
  {
    key: 'tivoli', brand: 'KGM', name: 'Tivoli', line: 'Nettur og fjölhæfur', kind: 'Borgarjepplingur', power: 'Bensín',
    price: 'Frá 5.990.000 kr.', facts: ['Fjórhjóladrifinn', 'Farangursrými 432–1.115 l', '5 ára ábyrgð'],
    href: 'https://kgm.benni.is/tivoli/', img: IMG.tivoli,
  },
]

/* Porsche's own list, for the Porsche side of the split. Verbatim prices. */
export const PORSCHE_LIST = [
  { name: 'Macan', price: 'Verð frá: 13.950.000 kr.' },
  { name: 'Taycan', price: 'Verð frá: 15.450.000 kr.' },
  { name: 'Cayenne Electric', price: 'Verð: 16.950.000 kr.' },
  { name: 'Cayenne Coupé Electric', price: 'Verð: 17.450.000 kr.' },
  { name: 'Taycan Cross Turismo', price: 'Verð frá: 17.950.000 kr.' },
  { name: 'Cayenne Plug In Hybrid', price: 'Verð: 23.950.000 kr.' },
  { name: '911 · Panamera · 718', price: 'Verð hjá söluráðgjafa' },
]
export const KGM_LIST = MODELS.filter((m) => m.brand === 'KGM').map((m) => ({ name: m.name, price: m.price ?? '' }))

/* Browse by type. Each card goes where that thing actually lives today. */
export const CATEGORIES = [
  { key: 'porsche', label: 'Porsche', href: '#urval', img: IMG.taycan, pos: '40% 55%' },
  { key: 'jeppar', label: 'Jeppar', href: '#urval', img: IMG.korando, pos: '76% 60%' },
  { key: 'pallbilar', label: 'Pallbílar', href: '#urval', img: IMG.mussoEv, pos: '40% 60%' },
  { key: 'rafbilar', label: 'Rafbílar', href: '#urval', img: IMG.torres, pos: '72% 60%' },
  { key: 'notadir', label: 'Notaðir bílar', href: '#notadir', img: photo('u-taycan4', [640, 1280], 1280, 1024, 'Notaður Porsche Taycan fyrir utan Krókháls 9'), pos: '50% 60%' },
  { key: 'breytingar', label: 'Jeppabreytingar', href: '#thjonusta', img: IMG.a1991, pos: '50% 88%' },
] as const

/* ── Used cars: a snapshot of notadir.benni.is/soluskra on 29.09.2026 ─── */
export const USED_COUNT = 116
export const USED = [
  { key: 'u-taycan4', name: 'Porsche Taycan 4', year: '8/2022', km: '71.000 km', fuel: 'Rafmagn', price: '9.990.000 kr.', was: '10.490.000 kr.', href: 'https://notadir.benni.is/bill/porsche-taycan-4/' },
  { key: 'u-cayenne', name: 'Porsche Cayenne E-Hybrid', year: '2/2022', km: '55.000 km', fuel: 'Tengiltvinn', price: '10.950.000 kr.', was: '11.750.000 kr.', href: 'https://notadir.benni.is/bill/porsche-cayenne-e-hybrid-4/' },
  { key: 'u-tesla26', name: 'Tesla Model Y Long Range AWD', year: '9/2026', km: '10.000 km', fuel: 'Rafmagn', price: '8.490.000 kr.', href: 'https://notadir.benni.is/bill/tesla-model-y-long-range-awd/' },
  { key: 'u-kodiaq', name: 'Skoda Kodiaq Style', year: '8/2022', km: '86.000 km', fuel: 'Dísil', price: '6.690.000 kr.', href: 'https://notadir.benni.is/bill/skoda-kodiaq-style/' },
  { key: 'u-tesla22', name: 'Tesla Model Y Long Range AWD', year: '9/2022', km: '74.000 km', fuel: 'Rafmagn', price: '5.590.000 kr.', href: 'https://notadir.benni.is/bill/tesla-model-y-long-range-awd-2/' },
  { key: 'u-bz4x', name: 'Toyota bZ4X', year: '10/2023', km: '72.000 km', fuel: 'Rafmagn', price: '5.590.000 kr.', href: 'https://notadir.benni.is/bill/toyota-bz4x/' },
  { key: 'u-juke', name: 'Nissan Juke', year: '3/2025', km: '54.000 km', fuel: 'Bensín', price: '3.990.000 kr.', href: 'https://notadir.benni.is/bill/nissan-juke/' },
].map((u) => ({ ...u, img: photo(u.key, [640, 1280], 1280, 1024, `${u.name}, ${u.year}, fyrir utan Krókháls 9`) }))

/* ── Service ────────────────────────────────────────────────────────────── */
export const MODS = [
  { size: '33″ breyting', price: '689.000 kr.', note: 'Kynningarverð' },
  { size: '33″ stærri breyting', price: '1.990.000 kr.' },
  { size: '35″ breyting', price: '2.790.000 kr.' },
  { size: '37″ breyting', price: '3.990.000 kr.' },
]

export const NESDEKK = [
  { street: 'Breiðhöfða 13', town: 'Reykjavík', phone: '590 2080' },
  { street: 'Fiskislóð 41', town: 'Reykjavík', phone: '561 4110' },
  { street: 'Skeifunni 9', town: 'Reykjavík', phone: '590 2098' },
  { street: 'Dalshrauni 10', town: 'Hafnarfirði', phone: '590 2093' },
  { street: 'Lyngási 8', town: 'Garðabæ', phone: '565 8600' },
  { street: 'Völuteigi 29', town: 'Mosfellsbæ', phone: '590 2097' },
  { street: 'Dalsbraut 1', town: 'Akureyri', phone: '460 4350' },
  { street: 'Njarðarbraut 9', town: 'Reykjanesbæ', phone: '420 3333' },
  { street: 'Austurvegi 54', town: 'Selfossi', phone: '590 2095' },
]

/* ── The story: Saga page headings, verbatim ──────────────────────────── */
export const SAGA = [
  { y: '1975', t: 'Ævintýrið byrjar', img: IMG.a1975 },
  { y: '1979', t: 'Sigur þrjú ár í röð' },
  { y: '1981', t: 'Varahlutaverslun opnuð' },
  { y: '1991', t: 'Á topp Hvannadalshnjúks', img: IMG.a1991 },
  { y: '1994', t: 'Nýsköpunarverðlaun Reykjavíkur' },
  { y: '1996', t: 'Xtremer', img: IMG.a1996 },
  { y: '2000', t: 'Porsche í Kringlunni', img: IMG.a2000 },
  { y: '2018', t: 'Flutt inn í nýjar höfuðstöðvar' },
  { y: '2024', t: 'Byggingaframkvæmdir hefjast', img: IMG.a2024 },
  { y: '2025', t: '50 ára afmælis árshátíð í Stuttgart', img: IMG.stuttgart },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Bílabúð Benna',
  legalName: CONTACT.legal,
  slogan: CONTACT.slogan,
  foundingDate: '1975',
  telephone: '+354 590 2000',
  email: CONTACT.email,
  url: 'https://benni.is',
  brand: [{ '@type': 'Brand', name: 'Porsche' }, { '@type': 'Brand', name: 'KGM' }],
  address: { '@type': 'PostalAddress', streetAddress: 'Krókháls 9', postalCode: '110', addressLocality: 'Reykjavík', addressCountry: 'IS' },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '12:00', closes: '16:00' },
  ],
}

export const companyEntry: PreviewCompany = {
  slug: 'benni',
  route: '/preview/benni',
  name: 'Bílabúð Benna',
  sector: 'Bílaumboð',
  location: 'Krókháls 9, 110 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Umboðsaðili Porsche og KGM á Íslandi, stofnað 1975',
  currentUrl: 'https://benni.is',
  ownerEmail: 'benni@benni.is',
  concept: 'Úr grænum skúr',
  conceptTagline: 'spykercars.com’s film-title scroll and a Drivehub dealer layout, cut in Benni’s own yellow and black: Porsche and KGM under one roof, the used-car list, the workshop and fifty years of story, with an assistant that only answers from this page.',
  accent: '#FEE101',
  dark: true,
  status: 'In build',
  thumb: A('hero2-800.webp'),
  ownPhotography: true,
  photoCredit: 'Myndir af benni.is, kgm.benni.is og notadir.benni.is, september 2026. Bílamyndir Porsche og KGM eru frá framleiðendunum.',
  audit: {
    strengths: [
      'Umboð fyrir Porsche og KGM, notaðir bílar, verkstæði og varahlutir, allt hjá sama fyrirtæki',
      'Saga sem fáir eiga: frá grænum skúr á Vagnhöfða 1975 að Porsche sal á Krókhálsi',
      'Skýrt verð á hverri KGM útfærslu og á Porsche gerðum',
    ],
    weaknesses: [
      'benni.is er hlekkjasíða: bílar, verð, notaðir bílar og bókanir búa á fjórum öðrum vefjum með fjórum útlitum',
      'Ekkert snertiform á benni.is, aðeins netfangshlekkur, og þjónustuhlekkurinn er með stafsetningarvillu',
      'Engin leið að spyrja spurningar utan opnunartíma',
    ],
    opportunities: [
      'Ein forsíða sem sýnir báða bílaframleiðendur, verð, notaða bíla og þjónustu á einum stað',
      'Aðstoðarmaður sem svarar um opnunartíma, verð og þjónustu allan sólarhringinn og vísar á síma þegar hann veit ekki',
      'Sagan frá 1975 sem traustvekjandi rauður þráður í gegnum vefinn',
    ],
  },
  positioning: 'Bílabúð Benna hefur selt og þjónustað bíla síðan 1975 og er umboðsaðili Porsche og KGM. Vefurinn á að sýna bæði merkin, verðin og þjónustuna á einum stað og láta hálfrar aldar sérþekkingu skína í gegn.',
  outreach: {
    subject: 'Hugmynd að nýjum benni.is',
    body: 'Góðan dag,\n\nÉg heiti Sindri og hanna vefi. Ég setti saman hugmynd að nýrri forsíðu fyrir Bílabúð Benna þar sem Porsche, KGM, notaðir bílar og verkstæðið eru á einum stað, með aðstoðarmanni sem svarar spurningum um opnunartíma, verð og þjónustu:\n\n[HLEKKUR Á FRUMGERÐ]\n\nÞetta er frumgerð og ekkert á henni er tengt ykkar kerfum. Ef ykkur líst vel á er ég til í stutt spjall.\n\nKveðja,\nSindri',
  },
}
