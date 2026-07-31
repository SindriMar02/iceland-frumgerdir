/* ── Höfðabílar ehf · „Allur skalinn" ─────────────────────────────────────────
   VERIFIED CONTENT ONLY. Harvested from hofdabilar.is + bilasolur.is (söluaðili
   id 55) on 2026-07-31.

   Höfðabílar ehf., kt. 630609-2160, Fosshálsi 27 (Dragháls megin), 110 Reykjavík.
   Sími 577 4747, hofdabilar@hofdabilar.is. „Stofnað 2002" is taken from the
   company's OWN logo mark (hofdabilar-logo-circle.png), which arches that text
   around a chequered flag — it is their claim about themselves, not a registry
   fact (the ehf. kennitala dates from 2009), and the page words it that way.
   Three named staff, opening hours, the sölulaun schedule and the fee list all
   come from their own Um okkur / About.aspx page.

   CARS below are the ACTUAL live stock (26 vehicles) with the dealer's own
   photographs, real prices, real registration dates, real mileage and the real
   badge text they wrote themselves. Nothing here is invented or rounded. The
   photographs carry bilasolur.is's baked-in watermark because that is how the
   platform serves them; a production build would use the originals.

   THE POINT OF THE PAGE: the stock runs from a 590.000 kr 1999 Cadillac DeVille
   to a 24.800.000 kr Range Rover P460 PHEV — a 42x span on one lot, plus a quad
   bike and a work van. The current template renders all of it as identical grey
   thumbnails. This design makes the range the entire argument.            ── */

export const NAME = 'Höfðabílar'
export const LEGAL = 'Höfðabílar ehf.'
export const KT = '630609-2160'
export const PHONE_DISPLAY = '577 4747'
export const PHONE_HREF = 'tel:+3545774747'
export const EMAIL = 'hofdabilar@hofdabilar.is'
export const FOUNDED = 2002

export const ADDRESS = {
  street: 'Fosshálsi 27',
  note: 'Dragháls megin',
  town: '110 Reykjavík',
}
export const MAPS =
  'https://maps.google.com/?q=H%C3%B6f%C3%B0ab%C3%ADlar,+Fossh%C3%A1lsi+27,+110+Reykjav%C3%ADk'
export const MAPS_EMBED =
  'https://www.google.com/maps?q=Fossh%C3%A1lsi+27,+110+Reykjav%C3%ADk&output=embed'

const ASSET = `${import.meta.env.BASE_URL}preview/hofdabilar/`
export const asset = (f: string) => `${ASSET}${f}`

export const HOURS = [
  { days: 'Mánudaga til föstudaga', time: '10:00 til 17:00' },
  { days: 'Laugardaga', time: '12:00 til 15:00' },
  { days: 'Sunnudaga', time: 'Lokað' },
]
/** Their own note on About.aspx — kept verbatim in meaning. */
export const HOURS_NOTE =
  'Lokað á laugardögum í júní, júlí, ágúst og desember.'

/* ── Inventory ──────────────────────────────────────────────────────────────
   `badge` strings are the dealer's OWN words from their listings, lightly
   normalised to sentence case where they were shouted in all-caps.          */

export interface Car {
  id: string
  make: string
  model: string
  price: number
  /** Price shown is ex-VAT (commercial vehicles) */
  exVsk?: boolean
  vskPrice?: number
  was?: number
  reg: string
  km: string
  isNew?: boolean
  fuel: 'Rafmagn' | 'Bensín' | 'Dísel' | 'Bensín/Rafmagn'
  gear: 'Sjálfskipting' | 'Beinskipting'
  seats?: string
  badge?: string
  img: string
  alt: string
}

export const CARS: Car[] = [
  {
    id: 'rangerover',
    make: 'Land Rover',
    model: 'Range Rover HSE P460 PHEV',
    price: 24800000,
    reg: '4/2025',
    km: '15 þ.km',
    fuel: 'Bensín/Rafmagn',
    gear: 'Sjálfskipting',
    badge: 'Flott verð',
    img: 'rangerover.webp',
    alt: 'Silfurgrár Land Rover Range Rover HSE P460 PHEV fyrir framan sýningarsal Höfðabíla',
  },
  {
    id: 'landcruiser',
    make: 'Toyota',
    model: 'Land Cruiser Luxury Panorama 37" dekk',
    price: 21900000,
    reg: '12/2024',
    km: '25 þ.km',
    fuel: 'Dísel',
    gear: 'Sjálfskipting',
    badge: 'Umboðsbíll í 7 ára ábyrgð',
    img: 'landcruiser.webp',
    alt: 'Hvítur Toyota Land Cruiser á 37 tommu dekkjum fyrir utan Höfðabíla',
  },
  {
    id: 'defender',
    make: 'Land Rover',
    model: 'Defender P400e HSE X-Dynamic PHEV',
    price: 17990000,
    reg: '2026',
    km: 'Nýtt ökutæki',
    isNew: true,
    fuel: 'Bensín/Rafmagn',
    gear: 'Sjálfskipting',
    img: 'defender.webp',
    alt: 'Nýr grár Land Rover Defender P400e fyrir framan sýningarsal Höfðabíla',
  },
  {
    id: 'i5',
    make: 'BMW',
    model: 'i5 M60 xDrive M-Sport',
    price: 12900000,
    reg: '12/2023',
    km: '47 þ.km',
    fuel: 'Rafmagn',
    gear: 'Sjálfskipting',
    img: 'i5.webp',
    alt: 'Hvítur BMW i5 M60 xDrive fyrir utan Höfðabíla',
  },
  {
    id: 'eqe',
    make: 'Mercedes-Benz',
    model: 'EQE 500 SUV 4Matic',
    price: 11790000,
    reg: '12/2023',
    km: '26 þ.km',
    fuel: 'Rafmagn',
    gear: 'Sjálfskipting',
    badge: 'Módelár 2024',
    img: 'eqe.webp',
    alt: 'Hvítur Mercedes-Benz EQE 500 SUV fyrir framan Höfðabíla',
  },
  {
    id: 'modelx',
    make: 'Tesla',
    model: 'Model X Plaid 6 sæta 1020 hö',
    price: 10990000,
    reg: '8/2023',
    km: '49 þ.km',
    fuel: 'Rafmagn',
    gear: 'Sjálfskipting',
    seats: '6 manna',
    badge: 'Umboðsbíll í ábyrgð · einn eigandi',
    img: 'modelx.webp',
    alt: 'Hvítur Tesla Model X Plaid með opnar vænghurðir fyrir utan Höfðabíla',
  },
  {
    id: 'taycan',
    make: 'Porsche',
    model: 'Taycan 4 Cross Turismo',
    price: 10490000,
    reg: '8/2021',
    km: '42 þ.km',
    fuel: 'Rafmagn',
    gear: 'Sjálfskipting',
    img: 'taycan.webp',
    alt: 'Hvítur Porsche Taycan 4 Cross Turismo fyrir utan sýningarsal Höfðabíla',
  },
  {
    id: 'model3',
    make: 'Tesla',
    model: 'Model 3 Performance',
    price: 7390000,
    reg: '9/2024',
    km: '30 þ.km',
    fuel: 'Rafmagn',
    gear: 'Sjálfskipting',
    badge: 'Flott verð',
    img: 'model3.webp',
    alt: 'Grár Tesla Model 3 Performance fyrir framan Höfðabíla',
  },
  {
    id: 'eqc1886',
    make: 'Mercedes-Benz',
    model: 'EQC 400 4Matic Edition 1886',
    price: 5900000,
    reg: '9/2021',
    km: '41 þ.km',
    fuel: 'Rafmagn',
    gear: 'Sjálfskipting',
    badge: 'Burmester hljóðkerfi · minnispakki í sætum',
    img: 'eqc1886.webp',
    alt: 'Grár Mercedes-Benz EQC 400 Edition 1886 á plani Höfðabíla',
  },
  {
    id: 'fpace',
    make: 'Jaguar',
    model: 'F-Pace AWD',
    price: 5790000,
    reg: '11/2019',
    km: '89 þ.km',
    fuel: 'Dísel',
    gear: 'Sjálfskipting',
    img: 'fpace.webp',
    alt: 'Svartur Jaguar F-Pace AWD fyrir utan Höfðabíla',
  },
  {
    id: 'eqc400',
    make: 'Mercedes-Benz',
    model: 'EQC 400 4Matic',
    price: 5790000,
    reg: '1/2021',
    km: '65 þ.km',
    fuel: 'Rafmagn',
    gear: 'Sjálfskipting',
    img: 'eqc400.webp',
    alt: 'Hvítur Mercedes-Benz EQC 400 4Matic á plani Höfðabíla',
  },
  {
    id: 'niro',
    make: 'Kia',
    model: 'Niro EV Final Edition 64 kWh',
    price: 4980000,
    reg: '4/2026',
    km: 'Nýtt ökutæki',
    isNew: true,
    fuel: 'Rafmagn',
    gear: 'Sjálfskipting',
    badge: 'Flott verð',
    img: 'niro.webp',
    alt: 'Hvítur Kia Niro EV fyrir framan sýningarsal Höfðabíla',
  },
  {
    id: 'discovery',
    make: 'Land Rover',
    model: 'Discovery HSE',
    price: 4950000,
    reg: '6/2018',
    km: '140 þ.km',
    fuel: 'Dísel',
    gear: 'Sjálfskipting',
    seats: '7 manna',
    img: 'discovery.webp',
    alt: 'Svartur Land Rover Discovery HSE fyrir utan Höfðabíla',
  },
  {
    id: 'mg4',
    make: 'MG',
    model: 'MG4 Electric 77 kW Luxury 520 km',
    price: 4480000,
    reg: '4/2026',
    km: 'Nýtt ökutæki',
    isNew: true,
    fuel: 'Rafmagn',
    gear: 'Sjálfskipting',
    badge: 'Flott verð',
    img: 'mg4.webp',
    alt: 'Svartur MG4 Electric fyrir framan sýningarsal Höfðabíla',
  },
  {
    id: 'cx30',
    make: 'Mazda',
    model: 'CX-30',
    price: 3990000,
    reg: '12/2022',
    km: '38 þ.km',
    fuel: 'Bensín',
    gear: 'Sjálfskipting',
    badge: 'Skoðun 2028 · flott verð',
    img: 'cx30.webp',
    alt: 'Rauður Mazda CX-30 fyrir utan sýningarsal Höfðabíla',
  },
  {
    id: 'canam',
    make: 'Can-Am',
    model: 'Outlander Max XT-P',
    price: 3950000,
    reg: '3/2022',
    km: '3.500 km',
    fuel: 'Bensín',
    gear: 'Sjálfskipting',
    seats: '2 manna',
    badge: '2,3 m. í breytingar og aukabúnað',
    img: 'canam.webp',
    alt: 'Svart og gult Can-Am Outlander Max XT-P fjórhjól á plani Höfðabíla',
  },
  {
    id: 'nx300h',
    make: 'Lexus',
    model: 'NX300h',
    price: 3490000,
    reg: '2/2016',
    km: '120 þ.km',
    fuel: 'Bensín/Rafmagn',
    gear: 'Sjálfskipting',
    badge: 'Flott verð',
    img: 'nx300h.webp',
    alt: 'Silfurgrár Lexus NX300h fyrir framan Höfðabíla',
  },
  {
    id: 'trafic',
    make: 'Renault',
    model: 'Trafic langur',
    price: 2790000,
    exVsk: true,
    vskPrice: 3459600,
    was: 3390000,
    reg: '3/2021',
    km: '147 þ.km',
    fuel: 'Dísel',
    gear: 'Beinskipting',
    seats: '3 manna',
    badge: 'Flott verð',
    img: 'trafic.webp',
    alt: 'Svartur Renault Trafic sendibíll fyrir utan Höfðabíla',
  },
  {
    id: 'evoque',
    make: 'Land Rover',
    model: 'Range Rover Evoque SE',
    price: 2650000,
    reg: '7/2016',
    km: '140 þ.km',
    fuel: 'Dísel',
    gear: 'Sjálfskipting',
    badge: 'Flott verð',
    img: 'evoque.webp',
    alt: 'Svartur Range Rover Evoque SE á plani Höfðabíla',
  },
  {
    id: 'hrv',
    make: 'Honda',
    model: 'HR-V sjálfskiptur',
    price: 1890000,
    reg: '11/2016',
    km: '107 þ.km',
    fuel: 'Bensín',
    gear: 'Sjálfskipting',
    img: 'hrv.webp',
    alt: 'Hvítur Honda HR-V fyrir framan sýningarsal Höfðabíla',
  },
  {
    id: 'outlander',
    make: 'Mitsubishi',
    model: 'Outlander',
    price: 1590000,
    reg: '2/2017',
    km: '215 þ.km',
    fuel: 'Dísel',
    gear: 'Beinskipting',
    badge: 'Flott verð',
    img: 'outlander.webp',
    alt: 'Silfurgrár Mitsubishi Outlander á plani Höfðabíla',
  },
  {
    id: 'fabia',
    make: 'Skoda',
    model: 'Fabia Combi sjálfskiptur',
    price: 1490000,
    reg: '6/2016',
    km: '112 þ.km',
    fuel: 'Bensín',
    gear: 'Sjálfskipting',
    badge: 'Einn eigandi · ný tímareim 2026',
    img: 'fabia.webp',
    alt: 'Blár Skoda Fabia Combi fyrir utan Höfðabíla',
  },
  {
    id: 'vitara',
    make: 'Suzuki',
    model: 'Grand Vitara V6',
    price: 1490000,
    reg: '4/2009',
    km: '100 þ.km',
    fuel: 'Bensín',
    gear: 'Sjálfskipting',
    badge: 'Flott verð',
    img: 'vitara.webp',
    alt: 'Rauðbrúnn Suzuki Grand Vitara V6 fyrir framan Höfðabíla',
  },
  {
    id: 'fiesta',
    make: 'Ford',
    model: 'Fiesta',
    price: 990000,
    was: 1090000,
    reg: '3/2017',
    km: '70 þ.km',
    fuel: 'Bensín',
    gear: 'Beinskipting',
    badge: 'Nýskoðaður · smurbók',
    img: 'fiesta.webp',
    alt: 'Rauður Ford Fiesta á plani Höfðabíla',
  },
  {
    id: 'p3008',
    make: 'Peugeot',
    model: '3008',
    price: 790000,
    reg: '3/2015',
    km: '188 þ.km',
    fuel: 'Dísel',
    gear: 'Sjálfskipting',
    img: 'p3008.webp',
    alt: 'Grár Peugeot 3008 fyrir utan sýningarsal Höfðabíla',
  },
  {
    id: 'deville',
    make: 'Cadillac',
    model: 'DeVille',
    price: 590000,
    was: 1190000,
    reg: '2/1999',
    km: '130 þ.km',
    fuel: 'Bensín',
    gear: 'Sjálfskipting',
    badge: 'Fornbíll · engin bifreiðagjöld, lægri tryggingar',
    img: 'deville.webp',
    alt: 'Svartur Cadillac DeVille árgerð 1999 fyrir framan sýningarsal Höfðabíla',
  },
]

/* ── Derived range — the whole thesis of the page ───────────────────────── */
export const PRICES = CARS.map((c) => c.price)
export const MIN_PRICE = Math.min(...PRICES)
export const MAX_PRICE = Math.max(...PRICES)
export const SPAN = Math.round(MAX_PRICE / MIN_PRICE)
export const CHEAPEST = CARS.find((c) => c.price === MIN_PRICE) as Car
export const DEAREST = CARS.find((c) => c.price === MAX_PRICE) as Car

/** Icelandic thousands grouping is a PERIOD. Hand-rolled — ICU maps is-IS to
 *  a comma, which is wrong for krónur (craft ledger #27a). */
export function isk(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
/** Short form for axis ticks: 590 þ. / 24,8 m. */
export function iskShort(n: number): string {
  if (n >= 1000000) {
    const m = n / 1000000
    const s = m >= 10 ? m.toFixed(1) : m.toFixed(1)
    return `${s.replace('.', ',')} m.`
  }
  return `${Math.round(n / 1000)} þ.`
}

export const FUELS = ['Rafmagn', 'Bensín/Rafmagn', 'Dísel', 'Bensín'] as const

/* ── People (from their own Um okkur page) ──────────────────────────────── */
export interface Person {
  name: string
  role: string
  email: string
}
export const TEAM: Person[] = [
  { name: 'Tryggvi Lárusson', role: 'Löggiltur bifreiðasali', email: 'tryggvi@hofdabilar.is' },
  { name: 'Kristján Eldjárn', role: 'Söluráðgjafi', email: 'kristjan@hofdabilar.is' },
  { name: 'Elvar Þór Magnússon', role: 'Söluráðgjafi', email: 'elvar@hofdabilar.is' },
]

/* ── Verðskrá — published on their own About page, buried where nobody on a
      phone will ever reach it. Surfacing it plainly is the honesty move
      (craft ledger #57).                                                    */
export const SOLULAUN = [
  { band: 'Ökutæki undir 299.000 kr.', fee: '69.900 kr.' },
  { band: 'Ökutæki 300.000 til 1.499.999 kr.', fee: '89.900 kr.' },
  { band: 'Ökutæki 1.500.000 kr. og yfir', fee: '4,1% af söluverði' },
]
export const FEES = [
  { label: 'Skjalagerð', value: '39.900 kr.' },
  { label: 'Umsýslugjald lána', value: '30.000 kr.' },
]

/** Financing lines the dealer prints on their own listings. */
export const FINANCING = {
  headline: 'Allt að 90% fjármögnun',
  body:
    'Á flestum bílum á planinu stendur til boða fjármögnun upp á 80 til 90% af kaupverði. Á völdum bílum bjóðum við 100% fjármögnun í allt að 60 mánuði í gegnum Ergo. Söluráðgjafarnir okkar reikna greiðslubyrðina með þér áður en þú skrifar undir nokkuð.',
  points: [
    'Allt að 80 til 90% fjármögnun á flestum bílum',
    '100% fjármögnun í allt að 60 mánuði á völdum bílum, í gegnum Ergo',
    'Greiðslubyrðin reiknuð með þér á staðnum',
  ],
}

export const LICENCE = 'Höfðabílar ehf. starfa samkvæmt leyfi til verslunar með notuð ökutæki.'

export const SEO = {
  title: 'Notaðir bílar í Reykjavík frá 590 þúsund upp í 24,8 milljónir | Höfðabílar',
  description:
    'Höfðabílar á Fosshálsi 27 í Reykjavík. Notaðir og nýir bílar, rafbílar, jeppar, sendibílar og fjórhjól á einu plani, allt frá fornbíl á 590.000 kr. upp í Range Rover á 24.800.000 kr. Sölulaun uppgefin, allt að 90% fjármögnun. Sími 577 4747.',
}

/* ── Dashboard entry ─────────────────────────────────────────────────────── */
import type { PreviewCompany } from '../companies'

export const HOFDABILAR_ENTRY: PreviewCompany = {
  slug: 'hofdabilar',
  route: '/preview/hofdabilar',
  name: 'Höfðabílar',
  sector: 'Bílasala',
  location: 'Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Stofnað 2002',
  currentUrl: 'https://hofdabilar.is',
  ownerEmail: 'hofdabilar@hofdabilar.is',
  concept: 'Allur skalinn',
  conceptTagline:
    'Á einu plani stendur fornbíll á 590.000 kr. við hliðina á Range Rover á 24.800.000 kr. Vefurinn er gerður að verðskala sem þú dregur til, og lóðin raðar sér upp eftir buddunni þinni. Krómhvítur grunnur, köflótti fáninn úr þeirra eigin merki frá 2002 notaður sem burðargrind.',
  accent: '#0F6076',
  dark: false,
  status: 'Concept ready',
  thumb: `${import.meta.env.BASE_URL}preview/hofdabilar/rangerover.webp`,
  ownPhotography: true,
  photoCredit:
    'Allar bílamyndir eru eigin myndir Höfðabíla, sóttar af söluskrá þeirra á bilasolur.is. Vatnsmerkið á myndunum kemur frá því kerfi.',
  audit: {
    strengths: [
      'Óvenju breitt úrval á einu plani: fornbíll á 590 þúsund, Range Rover á 24,8 milljónir, rafbílar, sendibíll og fjórhjól',
      'Sölulaun, skjalagerð og umsýslugjöld eru öll gefin upp opinberlega, sem fæstar bílasölur gera',
      'Þrír nafngreindir söluráðgjafar með eigin netföng, og löggiltur bifreiðasali á staðnum',
      'Eigin bílamyndir, allar teknar á sama stað fyrir framan salinn, svo úrvalið raðast upp eins og litaspjald',
    ],
    weaknesses: [
      'Vefurinn er sami hvíta merkjavefurinn og nánast allar aðrar íslenskar bílasölur keyra á, með .aspx slóðum og útliti frá 2014',
      'Öll valmyndin er falin á bak við hamborgaratákn, líka á fullri tölvuskjástærð, svo skjárinn nýtist ekki',
      'Ekkert stendur á forsíðunni um fyrirtækið sjálft: engin staðsetning, engin opnunartími, engin ástæða til að velja Höfðabíla',
      'Verðskráin liggur á undirsíðu sem enginn finnur í síma, þótt hún sé eitt sterkasta traustsmerkið sem þeir eiga',
      'Vatnsmerki er stimplað yfir hverja einustu mynd, sem kemur verst niður á dýrustu bílunum',
    ],
    opportunities: [
      'Gera verðbilið sjálft að aðalatriðinu: enginn annar í bænum getur sagst vera með allt frá 590 þúsundum upp í 24,8 milljónir',
      'Draga verðskrána fram á forsíðu sem traustsatriði í stað þess að fela hana',
      'Nota köflótta fánann úr þeirra eigin merki frá 2002 sem burðargrind hönnunarinnar',
      'Setja nafngreindu ráðgjafana og símann fremst, því bílakaup á Íslandi byrja á símtali',
    ],
  },
  positioning:
    'Höfðabílar eru ekki með markhóp, þeir eru með skala. Á planinu við Fossháls stendur Cadillac DeVille árgerð 1999 á 590.000 kr. og Range Rover P460 á 24.800.000 kr., og þar á milli rafbílar, jeppar, sendibíll og fjórhjól. Núverandi vefur flettir öllu þessu út í eins gráar smámyndir á sama merkjakerfinu og keppinautarnir keyra á. Endurhönnunin gerir breiddina að öllu málinu: verðskali sem gesturinn dregur til og lóðin raðar sér eftir, byggð á þeirra eigin myndum og þeirra eigin merki.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Höfðabíla',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég var að skoða hofdabilar.is og tók eftir tvennu. Annars vegar keyrir síðan ykkar á sama staðlaða kerfinu og nánast allar aðrar bílasölur landsins, þannig að hún lítur eins út og hjá keppinautunum. Hins vegar er úrvalið hjá ykkur allt annað en venjulegt. Sama daginn og ég skoðaði stóð Cadillac DeVille á 590 þúsund á sama plani og Range Rover á 24,8 milljónir, og þar á milli rafbílar, sendibíll og fjórhjól.

Það er sölupunktur sem enginn annar getur notað, en hann sést hvergi á vefnum eins og hann er í dag.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Hún byggir á ykkar eigin bílum, ykkar eigin myndum og köflótta fánanum úr merkinu ykkar frá 2002. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Aðalatriðið á síðunni er verðskali sem gesturinn dregur til, og bílarnir ykkar raðast upp eftir því hvað hann ætlar að borga. Ég setti líka verðskrána ykkar fram á forsíðuna, því það að gefa sölulaunin upp strax er sterkara traustsmerki en flestir átta sig á.

Ég sé einnig um hýsingu, viðhald og uppfærslur á þeim síðum sem ég geri, ef það er eitthvað sem þið hafið áhuga á.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
