import type { PreviewCompany } from '../company-types'

/*
 * Vatt ehf. Every fact here was read on 08.10.2026 from vatt.is (forsíða,
 * þjónusta, fjármögnun, rafhlöður, footer), byd.is and maxus.is (model pages
 * and their Verðskrá PDFs), and the fact check in
 * _docs/VATT-FACTCHECK-2026-10-08.md. Raw pages, PDFs and the manifest:
 * _docs/vatt-harvest-2026-10-08/.
 */

const BASE = import.meta.env.BASE_URL
export const A = (name: string) => `${BASE}vatt/${name}`
export const ROUTE = '/preview/vatt'

export type Photo = { src: string; srcSet: string; alt: string; w: number; h: number }
const photo = (name: string, widths: number[], w: number, h: number, alt: string): Photo => ({
  src: A(`${name}-${widths[widths.length - 1]}.webp`),
  srcSet: widths.map((x) => `${A(`${name}-${x}.webp`)} ${x}w`).join(', '),
  alt,
  w,
  h,
})

export const CONTACT = {
  legal: 'Vatt ehf.',
  kt: '570500-2280',
  street: 'Skeifan 17',
  town: '108 Reykjavík',
  phone: '568 5100',
  tel: '+3545685100',
  email: 'vatt@vatt.is',
  sales: 'soludeild@vatt.is',
  workshop: 'verkstaedi@vatt.is',
  parts: 'varahlutir@vatt.is',
  facebook: 'https://www.facebook.com/vattehf/',
  instagram: 'https://www.instagram.com/',
  map: 'https://www.google.com/maps/search/?api=1&query=Skeifan+17%2C+108+Reykjav%C3%ADk',
}

/* Opening hours, vatt.is footer (sales) and /thjonusta/ (workshop). Minutes from midnight, d = JS weekday. */
type Span = { d: number[]; from: number; to: number }
export type Dept = { key: string; name: string; email: string; hours: { label: string; time: string }[]; spans: Span[]; note?: string }
export const DEPTS: Dept[] = [
  {
    key: 'sala', name: 'Söludeild', email: CONTACT.sales,
    hours: [{ label: 'Mánudaga til fimmtudaga', time: '8:30–17:00' }, { label: 'Föstudaga', time: '8:30–16:00' }, { label: 'Laugardaga', time: '13:00–16:00' }],
    spans: [{ d: [1, 2, 3, 4], from: 510, to: 1020 }, { d: [5], from: 510, to: 960 }, { d: [6], from: 780, to: 960 }],
    note: 'Lokað á laugardögum um hásumarið og í desember.',
  },
  {
    key: 'verkstaedi', name: 'Verkstæði og varahlutir', email: CONTACT.workshop,
    hours: [{ label: 'Mánudaga til fimmtudaga', time: '8:00–17:00' }, { label: 'Föstudaga', time: '8:00–16:00' }],
    spans: [{ d: [1, 2, 3, 4], from: 480, to: 1020 }, { d: [5], from: 480, to: 960 }],
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

/* ── Brands: the six under one roof ───────────────────────────────────── */
export type BrandKey = 'byd' | 'maxus' | 'omoda' | 'exlantix' | 'jaecoo' | 'aiways'
export type Brand = { key: BrandKey; name: string; line: string; status: 'now' | 'jan2027' | 'service'; logo?: string; img?: Photo; site?: string }
export const BRANDS: Brand[] = [
  { key: 'byd', name: 'BYD', line: 'Sjö gerðir, frá Dolphin að Tang', status: 'now', logo: 'byd-white.png', site: 'https://www.byd.is', img: photo('b-byd', [800, 1600], 2000, 2000, 'Blár BYD Seal á sléttu salti undir heiðum himni') },
  { key: 'maxus', name: 'Maxus', line: 'Rafsendibílar og pallbíll', status: 'now', logo: 'maxus-white.png', site: 'https://www.maxus.is', img: photo('b-maxus', [800, 1600], 2000, 1333, 'Grár Maxus eTerron 9 pallbíll á götu við múrsteinshús') },
  { key: 'omoda', name: 'OMODA', line: 'Frumsýnt í janúar 2027', status: 'jan2027', logo: 'omoda-white.png' },
  { key: 'exlantix', name: 'EXLANTIX', line: 'Frumsýnt í janúar 2027', status: 'jan2027', logo: 'exlantix-white.png' },
  { key: 'jaecoo', name: 'JAECOO', line: 'Frumsýnt í janúar 2027', status: 'jan2027', logo: 'jaecoo-white.png' },
  { key: 'aiways', name: 'Aiways', line: 'Þjónusta og varahlutir fyrir U5', status: 'service' },
]
export const LAUNCH = { month: 'janúar 2027', brands: ['OMODA', 'EXLANTIX', 'JAECOO'], line: 'Þrjú ný merki bætast í hópinn hjá Vatt og verða frumsýnd í Skeifunni 17 í janúar 2027.' }

/* ── Models: byd.is and maxus.is, 08.10.2026 ──────────────────────────── */
export type Body = 'Smábíll' | 'Fólksbíll' | 'Jepplingur' | 'Jeppi' | 'Sendibíll' | 'Pallbíll'
export type Drive = 'Framhjóladrif' | 'Fjórhjóladrif'
export type Power = 'Rafmagn' | 'Tengiltvinn'
export type Model = {
  slug: string
  brand: 'BYD' | 'Maxus'
  name: string
  body: Body
  drive: Drive
  power: Power
  seats: number
  /** list price in ISK from the importer's Verðskrá PDF, null = not published */
  price: number | null
  /** price with the Orkusjóður grant as the PDF prints it */
  priceGrant?: number
  priceExVat?: number
  range: string
  battery: string
  powerLine: string
  accel: string
  charge: string
  cargo?: string
  tow?: string
  payload?: string
  warranty: string
  facts: string[]
  img: Photo
  gallery: Photo[]
  source: string
  fleet?: boolean
}

export const kr = (n: number) => `${n.toLocaleString('de-DE')} kr.`

const m = (key: string, alt: string, g1: string, g2: string) => ({
  img: photo(`m-${key}`, [800, 1600], 1600, 1067, alt),
  gallery: [photo(`g-${key}-1`, [800, 1600], 1600, 1067, g1), photo(`g-${key}-2`, [800, 1600], 1600, 1067, g2)],
})

export const MODELS: Model[] = [
  {
    slug: 'dolphin', brand: 'BYD', name: 'Dolphin', body: 'Smábíll', drive: 'Framhjóladrif', power: 'Rafmagn', seats: 5,
    price: 5_290_000, priceGrant: 4_790_000,
    range: '427–559 km', battery: '60 kWh Blade', powerLine: '204 hö / 310 Nm', accel: '7,0 s', charge: '10–80 % á 45 mín. (DC)', cargo: '345–1.310 l',
    warranty: '6 ár / 150.000 km á bíl, 8 ár / 250.000 km á rafhlöðu',
    facts: ['Bílakaup ársins í Evrópu 2024 hjá Autobest', 'Fimm stjörnur í Euro NCAP', '12,8" snúanlegur skjár, Apple CarPlay og Android Auto'],
    ...m('dolphin', 'Hvítur BYD Dolphin í stúdíói', 'Fólk gengur að hvítum BYD Dolphin á hafnarbakka', 'Nærmynd af felgu og framljósi á BYD Dolphin'),
    source: 'https://www.byd.is/typur/byd-dolphin',
  },
  {
    slug: 'seal', brand: 'BYD', name: 'Seal AWD', body: 'Fólksbíll', drive: 'Fjórhjóladrif', power: 'Rafmagn', seats: 5,
    price: 7_850_000, priceGrant: 7_350_000,
    range: '520–618 km', battery: '82,5 kWh Blade', powerLine: '530 hö / 670 Nm', accel: '3,8 s', charge: '10–80 % á 35 mín. (DC)', cargo: '400 l',
    warranty: '6 ár / 150.000 km á bíl, 8 ár / 250.000 km á rafhlöðu',
    facts: ['iF hönnunarverðlaunin', 'Dynaudio hljómkerfi með 12 hátölurum', 'Framrúðuskjár og panorama glerþak'],
    ...m('seal', 'Grár BYD Seal í stúdíói', 'Blár BYD Seal ekur yfir salthvíta sléttu', 'Innanrými BYD Seal, hvít sæti og 15,6" skjár'),
    source: 'https://www.byd.is/typur/byd-seal',
  },
  {
    slug: 'sealion-7', brand: 'BYD', name: 'Sealion 7 AWD', body: 'Jeppi', drive: 'Fjórhjóladrif', power: 'Rafmagn', seats: 5,
    price: 8_490_000, priceGrant: 7_990_000,
    range: '502–615 km', battery: '91,3 kWh Blade', powerLine: '530 hö / 690 Nm', accel: '4,5 s', charge: '10–80 % á 24 mín. (DC)', cargo: '520 l + 58 l að framan', tow: '1.500 kg',
    warranty: '6 ár / 150.000 km á bíl, 8 ár / 250.000 km á rafhlöðu',
    facts: ['Nýjasti BYD jeppinn á Íslandi', 'Cell-to-Body: rafhlaðan hluti af burðargrind', 'Hiti í fram- og aftursætum, 20" álfelgur'],
    ...m('sealion7', 'Hvítur BYD Sealion 7 í stúdíói, hlið', 'Hvítur BYD Sealion 7 á þaki að nóttu með borgarljós í baksýn', 'Hvítur BYD Sealion 7 á gljáandi gólfi'),
    source: 'https://www.byd.is/typur/sealion7',
  },
  {
    slug: 'seal-u', brand: 'BYD', name: 'Seal U', body: 'Jepplingur', drive: 'Framhjóladrif', power: 'Rafmagn', seats: 5,
    price: 7_290_000, priceGrant: 6_790_000,
    range: '500–674 km', battery: '87 kWh Blade', powerLine: '230 hö / 330 Nm', accel: '9,3 s', charge: '10–80 % á 43 mín. (DC)', payload: '1.300 kg burðargeta',
    warranty: '6 ár / 150.000 km á bíl, 8 ár / 250.000 km á rafhlöðu',
    facts: ['Fjölskyldujeppi með V2L, bíllinn sem rafstöð', '15,6" snúanlegur skjár', 'Opnanleg sóllúga'],
    ...m('seal-u', 'Ljósblár BYD Seal U í stúdíói, hlið', 'BYD Seal U með opið skott í haustlituðu landslagi', 'Ljósblár BYD Seal U í íbúðahverfi'),
    source: 'https://www.byd.is/typur/byd-seal-u',
  },
  {
    slug: 'seal-u-dm-i', brand: 'BYD', name: 'Seal U AWD tengiltvinn', body: 'Jepplingur', drive: 'Fjórhjóladrif', power: 'Tengiltvinn', seats: 5,
    price: 8_990_000,
    range: '70–98 km á rafmagni, allt að 870 km samtals', battery: '18,3 kWh', powerLine: '323 hö / 550 Nm', accel: '5,9 s', charge: '30–80 % á 35 mín. (DC)', cargo: '425–1.440 l',
    warranty: '6 ár / 150.000 km á bíl, 8 ár / 160.000 km á rafhlöðu',
    facts: ['Tengiltvinnbíll: bensínvél og rafmótor, eyðsla 1,2–6,4 l/100 km', 'Super DM aflrás, fjórhjóladrif', 'Stór sóllúga með renniopnun'],
    ...m('seal-u-dmi', 'Grár BYD Seal U AWD tengiltvinnbíll í stúdíói', 'Grár BYD Seal U AWD fyrir framan hús með fjölskyldu', 'Hleðslutengi sett í BYD Seal U'),
    source: 'https://www.byd.is/typur/seal-u-dmi',
  },
  {
    slug: 'tang', brand: 'BYD', name: 'Tang AWD', body: 'Jeppi', drive: 'Fjórhjóladrif', power: 'Rafmagn', seats: 7,
    price: 10_990_000,
    range: '530–618 km', battery: '108,8 kWh Blade', powerLine: '517 hö / 700 Nm', accel: '4,9 s', charge: '30–80 % á 30 mín. (DC)', tow: '1.500 kg', cargo: '235 l með sjö sætum',
    warranty: '6 ár / 150.000 km á bíl, 8 ár / 250.000 km á rafhlöðu',
    facts: ['Sjö sæti, fimm Isofix festingar', 'Nudd í framsætum', 'Fimm stjörnur í Euro NCAP'],
    ...m('tang', 'Dökkgrár BYD Tang AWD í stúdíói', 'Tveir BYD Tang á sléttu undir bláum himni', 'Nærmynd af framljósi á BYD Tang'),
    source: 'https://www.byd.is/typur/byd-tang-awd',
  },
  {
    slug: 'evo-awd', brand: 'BYD', name: 'EVO AWD', body: 'Jepplingur', drive: 'Fjórhjóladrif', power: 'Rafmagn', seats: 5,
    price: 7_490_000, priceGrant: 6_990_000,
    range: '470–630 km', battery: '74,8 kWh Blade', powerLine: '449 hö / 560 Nm', accel: '3,9 s', charge: '10–80 % á um 25 mín. (DC, 220 kW)', cargo: '490–1.360 l', tow: '1.500 kg',
    warranty: '6 ár / 150.000 km á bíl, 8 ár / 250.000 km á rafhlöðu',
    facts: ['Ný kynslóð af Atto 3 á 800 V e-platform 3.0', 'Innbyggð Google þjónusta', 'Opnanlegt panorama glerþak'],
    ...m('evo', 'Blár BYD EVO AWD við nútímalegt hús', 'Blár BYD EVO AWD á götu í borg', 'Blár BYD EVO AWD á bílaplani við hús'),
    source: 'https://www.byd.is/typur/evo-awd',
  },
  {
    slug: 'e-deliver-5', brand: 'Maxus', name: 'e-Deliver 5', body: 'Sendibíll', drive: 'Framhjóladrif', power: 'Rafmagn', seats: 3, fleet: true,
    price: 6_939_000, priceGrant: 6_439_000, priceExVat: 5_595_968,
    range: '335–489 km', battery: '64 kWh', powerLine: '120 kW', accel: '10,7 s', charge: '36 mín. (DC, 70 kW)', cargo: '6,6 eða 7,7 m³', payload: 'Allt að 1.200 kg', tow: '1.500 kg',
    warranty: '5 ár / 100.000 km á bíl, 8 ár / 200.000 km á rafhlöðu',
    facts: ['Platinum hjá Euro NCAP', 'Þriggja manna, stillanlegt ökumannssæti', 'MILA léttbyggð pallgrind'],
    ...m('ed5', 'Hvítur Maxus e-Deliver 5 sendibíll á skógarvegi', 'Hvítur Maxus e-Deliver 5 við steinvegg og tré', 'Hvítur Maxus e-Deliver 5 á bílastæði'),
    source: 'https://www.maxus.is/typur/e-deliver-5-sendibill',
  },
  {
    slug: 'e-deliver-7', brand: 'Maxus', name: 'e-Deliver 7', body: 'Sendibíll', drive: 'Framhjóladrif', power: 'Rafmagn', seats: 3, fleet: true,
    price: 8_490_000, priceGrant: 7_990_000, priceExVat: 6_846_774,
    range: '362–524 km', battery: '88 kWh', powerLine: '150 kW', accel: '11,6 s', charge: '43 mín. (DC)', cargo: '6,7 m³', payload: '1.020 kg', tow: '1.500 kg',
    warranty: '5 ár / 100.000 km á bíl, 8 ár / 250.000 km á rafhlöðu',
    facts: ['Einnig fáanlegur fjórhjóladrifinn: 9.390.000 kr.', 'Gulleinkunn Euro NCAP fyrir sendibíla', 'Rafdrifnar rennihurðir báðum megin'],
    ...m('ed7', 'Hvítur Maxus e-Deliver 7 við vatn', 'Hvítur Maxus e-Deliver 7 með opnar rennihurðir', 'Farmrými Maxus e-Deliver 7 séð aftan frá'),
    source: 'https://www.maxus.is/typur/e-deliver-7',
  },
  {
    slug: 'eterron-9', brand: 'Maxus', name: 'eTerron 9 AWD', body: 'Pallbíll', drive: 'Fjórhjóladrif', power: 'Rafmagn', seats: 5, fleet: true,
    price: 10_990_000,
    range: '432–566 km', battery: '102,2 kWh', powerLine: '422 hö / 700 Nm', accel: '5,8 s', charge: '42 mín. (DC, 115 kW)', tow: '3.500 kg', payload: '650 kg', cargo: '236 l undir húddi',
    warranty: '5 ár / 100.000 km á bíl, 8 ár / 200.000 km á rafhlöðu',
    facts: ['Luxury 10.990.000 kr., Premium 11.430.000 kr.', 'Fyrsti rafpallbíllinn í sínum flokki með fimm stjörnur í Euro NCAP', 'Fimm sæti, tvær Isofix festingar'],
    ...m('eterron', 'Grár Maxus eTerron 9 pallbíll á malarplani', 'Opið farangursrými undir húddi á Maxus eTerron 9', 'Maxus eTerron 9 með opinn pall'),
    source: 'https://www.maxus.is/typur/eterron-9-rafknuinn-pallbill',
  },
]
export const modelBySlug = (s: string) => MODELS.find((x) => x.slug === s)
export const fullName = (x: Pick<Model, 'brand' | 'name'>) => `${x.brand} ${x.name}`
export const priceLine = (x: Model) => (x.price === null ? 'Verð á fyrirspurn' : x.priceGrant ? `${kr(x.priceGrant)} með styrk` : kr(x.price))

export const IMG = {
  hero: photo('hero', [800, 1600, 2000], 2000, 1665, 'Tveir BYD Sealion 7 á malbikaðri sléttu undir heiðum himni'),
  drive: photo('drive', [800, 1600, 2000], 2000, 1040, 'Blár BYD EVO AWD á þjóðvegi við sjó'),
  fleetDoors: photo('f-doors', [800, 1600], 1600, 1067, 'Maxus e-Deliver 7 með opnar hliðarhurðir'),
  fleetCargo: photo('f-cargo', [800, 1600], 1600, 1067, 'Tómt farmrými í Maxus e-Deliver 7'),
  fleetFrunk: photo('f-frunk', [800, 1600], 1600, 1067, 'Opið geymslurými undir húddi á Maxus eTerron 9'),
  charge: photo('s-charge', [800, 1600], 1600, 900, 'Hleðslutengi sett í BYD rafbíl'),
}

/* ── Service: Skeifan 17 plus the two partners, vatt.is/thjonusta ──────── */
export const SERVICE = {
  shops: [
    { key: 'rvk', name: 'Vatt, Skeifan 17', town: 'Reykjavík', phone: '568 5100', tel: '+3545685100', role: 'Þjónustuverkstæði, varahlutir og aukahlutir', own: true },
    { key: 'ak', name: 'Höldur bílaverkstæði', town: 'Akureyri', street: 'Þórsstígur 4', phone: '461 6060', tel: '+3544616060', role: 'Samstarfsverkstæði' },
    { key: 'rnb', name: 'TR þjónusta', town: 'Reykjanesbær', street: 'Njarðarbraut 19', phone: '420 6600', tel: '+3544206600', role: 'Samstarfsverkstæði' },
  ],
  roadside: [
    { name: 'Vegaaðstoð N1', phone: '660 3350', tel: '+3546603350' },
    { name: 'FÍB, fyrir félagsmenn', phone: '511 2112', tel: '+3545112112' },
    { name: 'Sjóvá, fyrir félagsmenn', phone: '440 2222', tel: '+3544402222' },
  ],
  roadsideNote: 'Verkstæðið sendir ekki viðgerðarmann út fyrir opnunartíma. Útkall vegna bilunar greiðir bíleigandi samkvæmt gjaldskrá; sé bíllinn í ábyrgð er málið svo tekið upp við verkstæðið.',
  body: [
    { name: 'Réttur bílaréttingar', street: 'Skútuvogur 12 H', phone: '587 6350' },
    { name: 'Bílaréttingar og sprautun Sævars', street: 'Skútuvogur 4', phone: '528 8888' },
  ],
  battery: 'Rafhlöðum úr BYD, Maxus og Aiways bílum má skila til Vatt í Skeifunni 17 án endurgjalds. Vatt kemur þeim í endurvinnslu.',
  jobs: ['Þjónustuskoðun', 'Hugbúnaðaruppfærsla', 'Dekkjaskipti', 'Bilanagreining', 'Ábyrgðarmál', 'Annað'],
}

/* ── Financing, vatt.is/fjarmognun ─────────────────────────────────────── */
export const FINANCE = {
  lenders: ['Ergo', 'Arion banki', 'Landsbankinn', 'Lykill'],
  products: [
    { name: 'Bílalán, nýr bíll', terms: 'Allt að 90 % lán í allt að 7 ár. Kaupandi er skráður eigandi og lánveitandi á fyrsta veðrétt.' },
    { name: 'Bílalán, notaður bíll', terms: 'Allt að 80 % lán í 7 ár. Samanlagður aldur bíls og lánstími að hámarki 12 ár.' },
    { name: 'Kaupleiga (bílasamningur)', terms: 'Allt að 75 % fjármögnun í allt að 7 ár. Lánveitandi er skráður eigandi og kaupandi umráðamaður.' },
  ],
  business: 'Fyrirtækjum og rekstraraðilum býðst bílalán eða kaupleiga. Söludeildin setur upp tilboð með lánveitanda að eigin vali.',
  grant: 'Rafbílastyrkur Orkusjóðs, 500.000 kr., er dreginn frá þar sem verðlisti framleiðanda sýnir „verð m/styrk“. Skilyrði styrksins eru Orkusjóðs.',
}

/* ── Staff: the footer of vatt.is, every address as printed there ─────── */
export type Person = { name: string; role: string; email: string; dept: 'stjorn' | 'sala' | 'thjonusta' }
export const STAFF: Person[] = [
  { name: 'Úlfar Hinriksson', role: 'Framkvæmdastjóri', email: 'ulfar@vatt.is', dept: 'stjorn' },
  { name: 'Sonja', role: 'Aðstoðarframkvæmdastjóri og markaðsstjóri', email: 'sonja@vatt.is', dept: 'stjorn' },
  { name: 'Gísli', role: 'Fjármálastjóri', email: 'gisli@vatt.is', dept: 'stjorn' },
  { name: 'Þorsteinn Ólafsson', role: 'Sölustjóri', email: 'steini@vatt.is', dept: 'sala' },
  { name: 'Guðmundur Snær Guðmundsson', role: 'Sölumaður', email: 'gudmundur@vatt.is', dept: 'sala' },
  { name: 'Samúel Kárason', role: 'Sölumaður', email: 'samuel@vatt.is', dept: 'sala' },
  { name: 'Atli Karl Sigurbjartsson', role: 'Sölumaður', email: 'atli@vatt.is', dept: 'sala' },
  { name: 'Þjónustuverkstæði', role: 'Tímapantanir og ábyrgðarmál', email: 'verkstaedi@vatt.is', dept: 'thjonusta' },
  { name: 'Vara- og aukahlutir', role: 'Pantanir og fyrirspurnir', email: 'varahlutir@vatt.is', dept: 'thjonusta' },
]

/* ── Booking: slots the forms offer (the prototype keeps them in the browser) ── */
export const SLOTS = ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
export type Request = { id: string; kind: 'reynsluakstur' | 'verkstaedi' | 'floti' | 'fyrirspurn'; title: string; when: string; who: string; contact: string; detail: string; at: string; status: 'ný' | 'staðfest' }
const RK = 'vt-requests'
export function loadRequests(): Request[] { try { return JSON.parse(sessionStorage.getItem(RK) ?? '[]') } catch { return [] } }
export function saveRequest(r: Omit<Request, 'id' | 'at' | 'status'>): Request {
  const full: Request = { ...r, id: `V-${Date.now().toString(36).toUpperCase().slice(-5)}`, at: new Date().toISOString(), status: 'ný' }
  try { sessionStorage.setItem(RK, JSON.stringify([full, ...loadRequests()])) } catch { /* private mode */ }
  return full
}
/* Sample inbox for the staff-side preview, marked as sample on the page. */
export const SAMPLE_REQUESTS: Request[] = [
  { id: 'V-S0001', kind: 'reynsluakstur', title: 'BYD Sealion 7 AWD', when: 'fim. 9. okt. kl. 14:00', who: 'Hildur Ósk', contact: '690 0000', detail: 'Vill líka sjá Seal U', at: '2026-10-08T09:12:00Z', status: 'staðfest' },
  { id: 'V-S0002', kind: 'verkstaedi', title: 'Þjónustuskoðun, BYD Atto 3', when: 'mán. 13. okt. kl. 8:00', who: 'Kristinn B.', contact: 'kristinn@example.is', detail: 'Bílnúmer AB-123, 30.000 km', at: '2026-10-08T07:40:00Z', status: 'ný' },
  { id: 'V-S0003', kind: 'floti', title: 'Tilboð í 4 × e-Deliver 7', when: 'Afhending í nóvember', who: 'Lagnaþjónustan ehf.', contact: 'rekstur@example.is', detail: 'Kaupleiga, hleðsla á athafnasvæði', at: '2026-10-07T15:05:00Z', status: 'ný' },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Vatt ehf.',
  telephone: '+354 568 5100',
  email: CONTACT.email,
  url: 'https://www.vatt.is',
  brand: ['BYD', 'Maxus', 'OMODA', 'EXLANTIX', 'JAECOO'].map((name) => ({ '@type': 'Brand', name })),
  address: { '@type': 'PostalAddress', streetAddress: 'Skeifan 17', postalCode: '108', addressLocality: 'Reykjavík', addressCountry: 'IS' },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '08:30', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:30', closes: '16:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '13:00', closes: '16:00' },
  ],
}

export const companyEntry: PreviewCompany = {
  slug: 'vatt',
  route: ROUTE,
  name: 'Vatt',
  sector: 'Bílaumboð',
  location: 'Skeifan 17, 108 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Umboð BYD og Maxus á Íslandi; OMODA, EXLANTIX og JAECOO frá janúar 2027',
  currentUrl: 'https://www.vatt.is',
  ownerEmail: 'ulfar@vatt.is',
  concept: 'Eitt hús, sex merki',
  conceptTagline: 'The Benni/ÍSBAND system crossed with Suðurverk: a six-plate brand selector instead of a two-way split, one catalogue across BYD and Maxus with real prices from the importers’ price lists, a pinned January 2027 chapter for the three new brands, working test-drive, workshop and fleet requests with a staff-side preview, and an assistant that answers only from this page.',
  accent: '#7DB03A',
  dark: false,
  status: 'In build',
  thumb: A('hero-800.webp'),
  ownPhotography: false,
  photoCredit: 'Myndir frá byd.is og maxus.is (framleiðendamyndir), október 2026. Merki frá vatt.is.',
  audit: {
    strengths: ['Sex merki undir einu þaki frá janúar 2027', 'Verðlistar með raunverðum hjá byd.is og maxus.is', 'Eigið verkstæði í Skeifunni og samstarfsverkstæði á Akureyri og í Reykjanesbæ'],
    weaknesses: ['Forsíðan er myndbandskassi, svartur á síma án fyrirsagnar', 'Hnappurinn „Panta tíma hér“ fer á forsíðuna', 'Netföng starfsfólks eru brotin (vattt.is og tvær 404-síður)'],
    opportunities: ['Einn vefur sem heldur utan um öll merkin og nýju þrjú frá janúar', 'Reynsluakstur og verkstæðistími bókaður á vefnum', 'Fyrirtækjasíða fyrir Maxus flotann með tilboðsbeiðni'],
  },
  positioning: 'Vatt er umboð BYD og Maxus á Íslandi og tekur á móti OMODA, EXLANTIX og JAECOO í janúar 2027. Vefurinn á að halda utan um sex merki, sýna verð og bóka reynsluakstur og verkstæðistíma.',
  outreach: {
    subject: 'Hugmynd að nýjum vef fyrir Vatt',
    body: 'Góðan dag,\n\nÉg setti saman hugmynd að nýjum vef fyrir Vatt þar sem öll merkin, verðin, reynsluakstur og verkstæðið eru á einum stað:\n\n[HLEKKUR Á FRUMGERÐ]\n\nKveðja,\nSindri Már',
  },
}
