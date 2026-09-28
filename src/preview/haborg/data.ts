import type { PreviewCompany } from '../company-types'

/*
 * Háborg fasteignasala. Every fact on this page comes from their own site,
 * haborg.is, read 28.09.2026: /starfsmenn (Um okkur + 13 staff), /gjaldskra,
 * /soluskra (51 listings) and the front page (27 newest, 2 open houses).
 * Manifest: 03-prototypes/_harvest/haborg/MANIFEST.md
 * Counts and ranges below were computed from that snapshot, not typed.
 */

const BASE = import.meta.env.BASE_URL
export const A = (name: string) => `${BASE}haborg/${name}`

export type Photo = { src: string; srcSet: string; alt: string }
const photo = (name: string, widths: number[], alt: string): Photo => ({
  src: A(`${name}-${widths[widths.length - 1]}.webp`),
  srcSet: widths.map((w) => `${A(`${name}-${w}.webp`)} ${w}w`).join(', '),
  alt,
})

export const CONTACT = {
  legal: 'Háborg fasteignasala',
  street: 'Grensásvegur 1',
  town: '108 Reykjavík',
  phone: '497 0031',
  tel: '+3544970031',
  email: 'haborg@haborg.is',
  soluskra: 'https://www.haborg.is/soluskra',
}

export const IMG = {
  hero: photo('hero', [800, 1600, 2400], 'Björt stofa og borðstofa í nýrri íbúð við Grásteinsmýri 3 í Garðabæ'),
  stofa: photo('stofa', [800, 1600], 'Eldhús og borðstofa í íbúð við Grásteinsmýri 3'),
  eldhus: photo('eldhus', [800, 1600], 'Eldhús með gluggavegg út að sjónum, Hallgerðargata 5'),
  utsyni: photo('utsyni', [800, 1600], 'Borðstofa við glugga með sjávarútsýni, Hallgerðargata 5'),
  himinn: photo('himinn', [800, 1600], 'Kvöldhiminn yfir sjónum frá svölum við Hallgerðargötu'),
  svalir: photo('svalir', [800, 1600], 'Svalir á sjöundu hæð í turninum við Grensásveg 1'),
  turn: photo('turn', [800, 1600], 'Turninn við Grensásveg 1, þar sem Háborg er til húsa'),
  bordstofa: photo('bordstofa', [800, 1600], 'Borðstofa í íbúð við Skyggnisbraut 3'),
}

/* /starfsmenn, in their own order. Titles verbatim. */
export const STAFF = [
  { key: 'birkir', name: 'Birkir Már Árnason', title: 'Eigandi, framkvæmdastjóri og lögmaður', phone: '867 3388' },
  { key: 'jorunn', name: 'Jórunn Skúladóttir', title: 'Eigandi, lögg. fasteignasali og viðskiptafræðingur', phone: '845 8958' },
  { key: 'thorunn', name: 'Þórunn Pálsdóttir', title: 'Eigandi, lögg. fasteignasali, verkfræðingur, MBA', phone: '773 6000' },
  { key: 'thorir', name: 'Þórir Helgi Sigvaldason', title: 'Eigandi, lögmaður og lögg. fasteignasali', phone: '823 7170' },
  { key: 'katla', name: 'Katla Hanna Steed', title: 'Eigandi og lögg. fasteignasali', phone: '822 1661' },
  { key: 'reynir', name: 'Reynir Þór Garðarsson', title: 'Eigandi og lögmaður', phone: '847 0577' },
  { key: 'kristin', name: 'Kristín Rós Magnadóttir', title: 'Lögg. fasteignasali og lögfræðingur', phone: '860 2078' },
  { key: 'tinna', name: 'Tinna Björk Bryde', title: 'Lögg. fasteignasali og viðskiptafræðingur', phone: '660 5532' },
  { key: 'benedikt', name: 'Benedikt Smári Skúlason', title: 'Lögmaður og lögg. fasteignasali', phone: '823 3839' },
  { key: 'kristofer', name: 'Kristófer Acox', title: 'Sölumaður', phone: '846 6709' },
  { key: 'hrefna', name: 'Hrefna Harðardóttir', title: 'Sölumaður', phone: '690 0751' },
  { key: 'alexandra', name: 'Alexandra Eik Októsdóttir', title: 'Sölumaður', phone: '897 8277' },
  { key: 'kristinhogna', name: 'Kristín Högna Magnúsdóttir', title: 'Sölumaður', phone: '895 8511' },
].map((s) => ({
  ...s,
  img: photo(`starf-${s.key}`, [420, 840], s.name),
  mail: `${s.key}@haborg.is`,
  tel: `+354${s.phone.replace(/\s/g, '')}`,
}))

/* /gjaldskra, set as a rate card: the figure is the headline. */
export const TARIFF = [
  { fig: 'Frítt', t: 'Söluverðmat', p: 'Skriflegt verðmat á íbúðarhúsnæði kostar 39.900 kr. með vsk.' },
  { fig: '1,6%', t: 'Einkasala', p: 'Af söluverði auk vsk., þó að lágmarki 682.000 kr. með vsk.' },
  { fig: '2,5%', t: 'Almenn sala', p: 'Af söluverði auk vsk., þó að lágmarki 682.000 kr. með vsk.' },
  { fig: '2,5%', t: 'Sumarhús', p: 'Í einkasölu, auk vsk. Í almennri sölu 3%.' },
]

/* Five services, each the substance of /gjaldskra and their Um okkur text. */
export const SERVICES = [
  {
    id: 'sala',
    fig: 'frá 1,6%',
    t: 'Sala fasteigna',
    p: [
      'Söluþóknun í einkasölu er 1,6% af söluverði eignar auk vsk. og í almennri sölu 2,5%, þó að lágmarki 550.000 kr. auk vsk. (682.000 kr. með vsk.).',
      'Seljandi greiðir að auki gagnaöflunargjald vegna söluyfirlits og markaðs- og kynningargjald, hvort um sig 54.560 kr. með vsk.',
    ],
  },
  {
    id: 'verdmat',
    fig: 'Frítt',
    t: 'Söluverðmat',
    p: [
      'Söluverðmat er án endurgjalds.',
      'Gjald fyrir skriflegt verðmat á íbúðarhúsnæði er 32.177 kr. án vsk. (39.900 kr. með vsk.).',
    ],
  },
  {
    id: 'leiga',
    fig: 'Mánaðarleiga',
    t: 'Leigumiðlun',
    p: ['Þóknun fyrir leigumiðlun samsvarar umsaminni mánaðarleigu auk vsk.'],
  },
  {
    id: 'skjalafragangur',
    fig: '495.000 kr.',
    t: 'Skjalafrágangur',
    p: [
      'Gjald fyrir skjalafrágang við sölu fasteigna er 495.000 kr. auk vsk. Auk þess greiðir seljandi gagnaöflunargjald, 54.560 kr. með vsk.',
      'Við skjalafrágang skal liggja fyrir samkomulag um verð og greiðslufyrirkomulag.',
    ],
  },
  {
    id: 'sumarhus',
    fig: 'frá 2,5%',
    t: 'Sala sumarhúsa',
    p: ['Söluþóknun fyrir sumarhús í einkasölu er 2,5% af söluverði eignar auk vsk. og 3% í almennri sölu.'],
  },
]

/* Wild's "Prozesse." Three steps, each tied to the tariff line that prices it. */
export const PROCESS = [
  {
    id: 'skref-verdmat',
    fig: 'Frítt',
    figLab: 'söluverðmat',
    t: 'Verðmat',
    p: ['Löggiltur fasteignasali skoðar eignina og gefur söluverðmat. Það er án endurgjalds.'],
  },
  {
    id: 'skref-sala',
    fig: '54.560 kr.',
    figLab: 'gagnaöflun, með vsk',
    t: 'Eignin í sölu',
    p: [
      'Þegar eign er sett í sölu eru gögn sótt vegna söluyfirlits. Gagnaöflunargjald er 54.560 kr. með vsk.',
      'Markaðs- og kynningargjald seljanda er einnig 54.560 kr. með vsk.',
    ],
  },
  {
    id: 'skref-kaup',
    fig: '66.960 kr.',
    figLab: 'umsýsla kaupanda, með vsk',
    t: 'Kaupsamningur',
    p: ['Lögmenn og löggiltir fasteignasalar stofunnar fylgja kaupunum til lokafrágangs. Umsýsluþóknun kaupanda er 66.960 kr. með vsk.'],
  },
]

/* formatted by hand: toLocaleString('is-IS') falls back to English separators where ICU lacks Icelandic */
const mkr = (n: number) => String(Math.round(n / 100_000) / 10).replace('.', ',')
const kr = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

/* Grouped from /soluskra (51 listings, 28.09.2026). Wild's "Projekte." slot. */
export const DEVELOPMENTS = [
  { key: 'grasteinsmyri', name: 'Grásteinsmýri 3', town: '225 Garðabær', count: 14, kind: 'íbúðir í fjölbýli', min: 63_900_000, max: 103_900_000, smin: 62, smax: 122 },
  { key: 'grensasvegur', name: 'Grensásvegur 1', town: '108 Reykjavík', count: 12, kind: 'íbúðir og atvinnurými', min: 83_500_000, max: 159_900_000, smin: 90, smax: 365 },
  { key: 'gardabraut', name: 'Garðabraut 1', town: '300 Akranes', count: 11, kind: 'íbúðir í fjölbýli', min: 54_000_000, max: 100_900_000, smin: 67, smax: 118 },
].map((d) => ({
  ...d,
  img: photo(`verk-${d.key}`, [800, 1600], `${d.name}, ${d.town}`),
  price: `${mkr(d.min)} til ${mkr(d.max)} m.kr.`,
  size: `${d.smin} til ${d.smax} m²`,
}))

export const LISTING_COUNT = 51

/* The front page's newest listings, the two open houses first
 * (Sóltún 16 on 30 Sept, Skyggnisbraut 3 on 1 Oct). */
type Row = [string, string, string, number, number, number, [number, string, string, string] | null]
const NEW: Row[] = [
  ['920758', 'Sóltún 16', '105 Reykjavík', 97, 3, 84_900_000, [30, 'sept.', 'Miðvikudagur', '17:00 til 17:30']],
  ['922893', 'Skyggnisbraut 3', '113 Reykjavík', 88, 3, 72_900_000, [1, 'okt.', 'Fimmtudagur', '16:30 til 17:00']],
  ['926600', 'Bjarkarholt 17', '270 Mosfellsbær', 92, 3, 84_900_000, null],
  ['926599', 'Hallgerðargata 5', '105 Reykjavík', 105, 3, 104_900_000, null],
  ['925947', 'Grásteinsmýri 3', '225 Garðabær', 112, 3, 99_900_000, null],
  ['925944', 'Grásteinsmýri 3', '225 Garðabær', 63, 2, 67_900_000, null],
  ['925943', 'Grásteinsmýri 3', '225 Garðabær', 122, 4, 103_900_000, null],
  ['925942', 'Grásteinsmýri 3', '225 Garðabær', 105, 4, 93_900_000, null],
  ['925941', 'Grásteinsmýri 3', '225 Garðabær', 112, 3, 98_900_000, null],
  ['925939', 'Grásteinsmýri 3', '225 Garðabær', 62, 2, 63_900_000, null],
  ['925928', 'Grásteinsmýri 3', '225 Garðabær', 122, 4, 99_900_000, null],
  ['925924', 'Grásteinsmýri 3', '225 Garðabær', 83, 3, 74_900_000, null],
  ['925945', 'Grásteinsmýri 3', '225 Garðabær', 63, 2, 67_900_000, null],
  ['925544', '17. júnítorg 1', '210 Garðabær', 119, 3, 99_800_000, null],
  ['924564', 'Garðabraut 1', '300 Akranes', 82, 3, 70_900_000, null],
  ['924563', 'Garðabraut 1', '300 Akranes', 85, 3, 72_900_000, null],
  ['924561', 'Garðabraut 1', '300 Akranes', 90, 3, 77_900_000, null],
  ['924560', 'Garðabraut 1', '300 Akranes', 71, 2, 60_900_000, null],
  ['924558', 'Garðabraut 1', '300 Akranes', 83, 3, 68_400_000, null],
  ['924555', 'Garðabraut 1', '300 Akranes', 82, 3, 69_400_000, null],
]
export const NEW_LISTINGS = NEW.map(([id, street, town, size, rooms, price, oh]) => ({
  id, street, town, size, rooms,
  open: oh ? { dd: String(oh[0]), mo: oh[1], wd: oh[2], time: oh[3] } : null,
  price: `${kr(price)} kr.`,
  img: A(`ny-${id}.webp`),
  href: `https://www.haborg.is/soluskra/eign/${id}`,
}))
export const OPEN_COUNT = NEW_LISTINGS.filter((n) => n.open).length

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Háborg fasteignasala',
  telephone: '+354 497 0031',
  email: 'haborg@haborg.is',
  address: { '@type': 'PostalAddress', streetAddress: 'Grensásvegur 1', postalCode: '108', addressLocality: 'Reykjavík', addressCountry: 'IS' },
}

export const companyEntry: PreviewCompany = {
  slug: 'haborg',
  route: '/preview/haborg',
  name: 'Háborg fasteignasala',
  sector: 'Fasteignasala',
  location: 'Grensásvegur 1, 108 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Þverfagleg fasteignasala við Grensásveg með 51 eign á söluskrá',
  currentUrl: 'https://haborg.is',
  ownerEmail: 'birkir@haborg.is',
  concept: 'The tower, in sheets',
  conceptTagline: 'wild-ag.ch’s stacked-sheet rhythm, re-cut in Háborg’s own navy and gold: their lawyers and agents, their tariff, their three developments and newest listings.',
  accent: '#0B3253',
  dark: false,
  status: 'In build',
  thumb: A('hero-800.webp'),
  ownPhotography: true,
  photoCredit: 'Myndir og upplýsingar af haborg.is, september 2026.',
  audit: {
    strengths: [
      '51 eign á söluskrá, þar af þrjú nýbyggingarverkefni',
      'Þrettán starfsmenn, lögmenn og löggiltir fasteignasalar, allir með mynd, síma og netfang',
      'Skýr gjaldskrá og frítt söluverðmat',
    ],
    weaknesses: [
      'Vefurinn keyrir á jQuery 1.11.3, bannar aðdrátt í síma og vísar ekki http yfir á https',
      'Forsíðan er leitarform og eignalisti, stofan sjálf og fólkið sjást ekki',
      'Forsíðumyndir eigna eru þaktar borðum og auglýsingatexta',
    ],
    opportunities: [
      'Forsíða sem sýnir verkefnin, nýjustu eignirnar og fólkið',
      'Þverfaglega þekkingin, lögmenn og fasteignasalar saman, sem kjarni stofunnar',
    ],
  },
  positioning:
    'Háborg is a thirteen-person estate agency of lawyers and licensed agents in the Grensásvegur 1 tower, with 51 listings across three developments, on a WebEd site that shows none of that. The prototype puts their developments, newest listings, people and prices on one page, in their own navy and gold.',
  outreach: { subject: 'Hugmynd að nýrri forsíðu fyrir Háborg', body: '[Drög í vinnslu]' },
}
