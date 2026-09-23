import type { PreviewCompany } from '../company-types'

/*
 * Fjárfesting fasteignasala ehf. Every fact on this page comes from their own
 * site, fjarfesting.is, read 22.09.2026: the footer, /starfsmenn, /gjaldska,
 * /soluskra (120 listings) and the open houses on the front page.
 * Manifest: 03-prototypes/_harvest/fjarfesting/MANIFEST.md
 * Counts and price ranges below were computed from that snapshot, not typed.
 */

const BASE = import.meta.env.BASE_URL
export const A = (name: string) => `${BASE}fjarfesting/${name}`

export type Photo = { src: string; srcSet: string; alt: string }
const photo = (name: string, widths: number[], alt: string): Photo => ({
  src: A(`${name}-${widths[widths.length - 1]}.webp`),
  srcSet: widths.map((w) => `${A(`${name}-${w}.webp`)} ${w}w`).join(', '),
  alt,
})

export const CONTACT = {
  legal: 'Fjárfesting fasteignasala ehf',
  street: 'Borgartún 31',
  town: '105 Reykjavík',
  phone: '562 4250',
  tel: '+3545624250',
  email: 'fjarfesting@fjarfesting.is',
  kt: '480389-1159',
  vsk: '10316',
  soluskra: 'https://fjarfesting.is/soluskra',
  facebook: 'https://www.facebook.com/fjarfestingfasteignasala/',
}

export const IMG = {
  hero: photo('hero', [800, 1600], 'Stofa og eldhús með gluggum í tvær áttir, ein af eignunum á söluskrá'),
  stofa: photo('stofa-asparlaut', [800, 1600], 'Stofa og borðstofa í nýrri íbúð við Asparlaut í Keflavík'),
  loft: photo('kopavogur-loft', [800, 1600], 'Naustavör á Kársnesi séð úr lofti, með Fossvog og Reykjavíkurflugvöll handan við'),
  eldhus: photo('eldhus-asparlaut', [800, 1600], 'Eldhús og stofa í íbúð við Asparlaut'),
  utsyni: photo('utsyni-naustavor', [800, 1600], 'Borðstofa með útsýni yfir sjóinn við Naustavör 36'),
  dagur: photo('naustavor-dagur', [1400, 2400], 'Fjölbýlishús við Naustavör í Kópavogi'),
  kvold: photo('naustavor-kvold', [1400, 2800], 'Naustavör við sjávarsíðuna í kvöldbirtu'),
}

/* /starfsmenn, in their own order. Titles verbatim. */
export const STAFF = [
  { key: 'oskar', name: 'Óskar Þór Hilmarsson', title: 'Framkvæmdastjóri, löggiltur fasteignasali', phone: '822 8750', w: [420, 840] },
  { key: 'hilmar', name: 'Hilmar Óskarsson', title: 'Ráðgjafi', phone: '896 8750', w: [420, 840] },
  { key: 'gudjon', name: 'Guðjón Sigurjónsson', title: 'Löggiltur fasteignasali', phone: '846 1511', w: [420, 840] },
  { key: 'hildur', name: 'Hildur Edda Gunnarsdóttir', title: 'Lögfræðingur, löggiltur fasteignasali', phone: '661 0804', w: [420, 840], email: 'Hildur' },
  { key: 'edda', name: 'Edda Svavarsdóttir', title: 'Löggiltur fasteignasali', phone: '845 0425', w: [420, 840] },
  { key: 'smari', name: 'Smári Jónsson', title: 'Löggiltur fasteignasali', phone: '864 1362', w: [420, 840] },
  { key: 'gudmundur', name: 'Guðmundur H. Valtýsson', title: 'Viðskiptafræðingur, löggiltur fasteignasali', phone: '865 3022', w: [420, 840] },
  { key: 'jonas', name: 'Jónas H. Jónasson', title: 'Löggiltur fasteignasali', phone: '842 1520', w: [420, 840] },
  { key: 'omar', name: 'Ómar Örn Sigurðsson', title: 'Löggiltur fasteignasali', phone: '897 0203', w: [347] },
  { key: 'margret', name: 'Margrét Snæfríður Árnadóttir', title: 'Aðstoðarmaður fasteignasala', phone: '845 5979', w: [420, 840] },
].map((s) => ({
  ...s,
  img: photo(`starf-${s.key}`, s.w, s.name),
  mail: `${s.email ?? s.key}@fjarfesting.is`,
  tel: `+354${s.phone.replace(/\s/g, '')}`,
}))

/* /gjaldska, lines 2.0 A and 4.0, set as a rate card: the figure is the headline. */
export const TARIFF = [
  { fig: 'Frítt', t: 'Söluverðmat', p: 'Skriflegt verðmat 39.900 kr. í fjölbýli og 49.900 kr. í sérbýli.' },
  { fig: '1,75%', t: 'Einkasala', p: 'Frá 1,75% af söluverði, eða eftir samkomulagi.' },
  { fig: '2,50%', t: 'Almenn sala', p: 'Af söluverði, eða eftir samkomulagi.' },
  { fig: '5%', t: 'Sumarhús', p: 'Af söluverði, auk gagnaöflunar.' },
]

/* Five services, each the substance of one /gjaldska section. */
export const SERVICES = [
  {
    id: 'sala',
    fig: 'frá 1,75%',
    t: 'Sala fasteigna',
    p: [
      'Almenn sala fasteigna og skráðra skipa er 2,50% af söluverði og sala í einkasölu frá 1,75%, eða eftir samkomulagi. Sala sumarhúsa er 5% og sala félaga og atvinnufyrirtækja 5% af heildarsölu.',
      'Söluþóknun er umsemjanleg og byggir á mati á markaðssvæði, seljanleika og nánara samkomulagi.',
    ],
  },
  {
    id: 'verdmat',
    fig: 'Frítt',
    t: 'Söluverðmat',
    p: [
      'Söluverðmat fasteigna er frítt.',
      'Skriflegt verðmat íbúða í fjölbýlishúsi kostar 39.900 kr. og sérbýlishúsnæðis 49.900 kr. Skoðun og mat á atvinnuhúsnæði er 0,2% af fasteignamati, en aldrei minna en 100.000 kr.',
    ],
  },
  {
    id: 'leiga',
    fig: 'Mánaðarleiga',
    t: 'Leiga',
    p: [
      'Auk þóknunar fyrir gerð leigusamnings er þóknun fyrir að koma leigusamningi á sem samsvarar mánaðarleigu hins leigða.',
      'Sé leigusamningur gerður til þriggja ára eða lengur er áskilin hærri þóknun.',
    ],
  },
  {
    id: 'skjalagerd',
    fig: '35.000 kr./klst.',
    t: 'Skjalagerð og ráðgjöf',
    p: [
      'Skjalagerð og frágangur við eignaskipti, þegar kaup hafa átt sér stað utan fasteignasölunnar, er 1% af söluandvirði en aldrei lægri en 620.000 kr. með vsk.',
      'Tímagjald löggilts fasteignasala vegna ráðgjafar er 35.000 kr.',
    ],
  },
  {
    id: 'umsysla',
    fig: 'Tímagjald',
    t: 'Eignaumsýsla og skuldaskil',
    p: ['Vinna við eignaumsýslu, samninga um skuldaskil, aflýsingar lána og veðflutninga er unnin samkvæmt tímagjaldi.'],
  },
]

/* Wild's "Prozesse." Three steps, each tied to the tariff line that prices it. */
export const PROCESS = [
  {
    id: 'skref-verdmat',
    fig: 'Frítt',
    figLab: 'söluverðmat',
    t: 'Verðmat',
    p: ['Löggiltur fasteignasali skoðar eignina og gefur söluverðmat. Það er frítt.'],
  },
  {
    id: 'skref-sala',
    fig: '89.980 kr.',
    figLab: 'gagnaöflun, með vsk',
    t: 'Eignin í sölu',
    p: [
      'Þegar eign er sett í sölu eru gögn um hana sótt, svo sem veðbókarvottorð og teikningar. Gagnaöflunargjald er 89.980 kr. með vsk.',
      'Fast gjald vegna markaðskostnaðar á vef- og samfélagsmiðlum er 29.900 kr. með vsk.',
    ],
  },
  {
    id: 'skref-kaup',
    fig: '89.900 kr.',
    figLab: 'umsýsla kaupanda, með vsk',
    t: 'Kaupsamningur',
    p: [
      'Fasteignasalan annast skjalagerð við kaupin. Umsýsluþóknun kaupanda er 89.900 kr. með vsk.',
    ],
  },
]

const mkr = (n: number) => (n / 1_000_000).toLocaleString('is-IS', { maximumFractionDigits: 1 })

/* Grouped from /soluskra (120 listings, 22.09.2026). Wild's "Projekte." slot. */
export const DEVELOPMENTS = [
  { key: 'naustavor', name: 'Naustavör', town: '200 Kópavogur', count: 24, kind: 'íbúðir í fjölbýli', min: 94_900_000, max: 198_000_000, smin: 89, smax: 170 },
  { key: 'bolholt', name: 'Bolholt 7 og 9', town: '105 Reykjavík', count: 24, kind: 'íbúðir í fjölbýli', min: 71_000_000, max: 164_000_000, smin: 60, smax: 131 },
  { key: 'asparlaut', name: 'Asparlaut', town: '230 Keflavík', count: 27, kind: 'íbúðir í fjölbýli', min: 69_900_000, max: 129_900_000, smin: 96, smax: 240 },
  { key: 'fossvogsvegur', name: 'Fossvogsvegur', town: '108 Reykjavík', count: 9, kind: 'raðhús og íbúðir', min: 197_000_000, max: 335_000_000, smin: 167, smax: 242 },
  { key: 'hjallabraut', name: 'Hjallabraut', town: '220 Hafnarfjörður', count: 5, kind: 'raðhús', min: 169_000_000, max: 169_000_000, smin: 157, smax: 159 },
].map((d) => ({
  ...d,
  img: photo(`verk-${d.key}`, [800, 1600], `${d.name}, ${d.town}`),
  price: d.min === d.max ? `${mkr(d.min)} m.kr.` : `${mkr(d.min)} til ${mkr(d.max)} m.kr.`,
  size: `${d.smin} til ${d.smax} m²`,
}))

export const LISTING_COUNT = 120

/* The front page's "Opin hús", 23 to 25 September 2026 (the 22nd had passed). */
const OH: [string, number, string, string, string, string, number, number, number][] = [
  ['917866', 23, '12:00', '12:30', 'Bolholt 7', '105 Reykjavík', 112, 4, 114_000_000],
  ['917868', 23, '12:00', '12:30', 'Bolholt 7', '105 Reykjavík', 68, 2, 73_000_000],
  ['917869', 23, '12:00', '12:30', 'Bolholt 7', '105 Reykjavík', 112, 4, 119_000_000],
  ['917870', 23, '12:00', '12:30', 'Bolholt 7', '105 Reykjavík', 62, 2, 71_000_000],
  ['917871', 23, '12:00', '12:30', 'Bolholt 7', '105 Reykjavík', 60, 2, 73_000_000],
  ['917874', 23, '12:00', '12:30', 'Bolholt 7', '105 Reykjavík', 131, 4, 164_000_000],
  ['914071', 23, '12:00', '12:30', 'Bolholt 7', '105 Reykjavík', 116, 4, 122_000_000],
  ['923615', 23, '16:30', '17:00', 'Lundur 14-18', '200 Kópavogur', 150, 4, 169_000_000],
  ['917395', 24, '16:30', '17:00', 'Fossvogsvegur 28', '108 Reykjavík', 170, 4, 205_000_000],
  ['916641', 24, '12:00', '12:30', 'Naustavör 62', '200 Kópavogur', 95, 2, 94_900_000],
  ['920227', 24, '12:00', '12:30', 'Naustavör 62', '200 Kópavogur', 137, 3, 141_500_000],
  ['916645', 24, '12:00', '12:30', 'Naustavör 62', '200 Kópavogur', 153, 4, 164_900_000],
  ['918981', 24, '12:00', '12:30', 'Naustavör 60', '200 Kópavogur', 112, 3, 139_900_000],
  ['911839', 24, '16:30', '17:00', 'Fossvogsvegur 32', '108 Reykjavík', 189, 5, 220_000_000],
  ['906331', 25, '12:00', '12:30', 'Fossvogsvegur 12', '108 Reykjavík', 169, 4, 205_000_000],
  ['906334', 25, '12:00', '12:30', 'Fossvogsvegur 8', '108 Reykjavík', 210, 5, 240_000_000],
  ['906338', 25, '12:00', '12:30', 'Fossvogsvegur 10', '108 Reykjavík', 233, 5, 335_000_000],
  ['913043', 25, '17:00', '17:30', 'Bolholt 9', '105 Reykjavík', 92, 3, 99_000_000],
  ['913052', 25, '17:30', '17:30', 'Bolholt 9', '105 Reykjavík', 91, 3, 89_000_000],
  ['923556', 25, '17:00', '17:30', 'Bolholt 9', '105 Reykjavík', 68, 2, 76_000_000],
  ['918253', 25, '17:00', '17:30', 'Bolholt 9', '105 Reykjavík', 73, 2, 84_000_000],
]
const DAY: Record<number, string> = { 23: 'Mið. 23. sept.', 24: 'Fim. 24. sept.', 25: 'Fös. 25. sept.' }
const WD: Record<number, string> = { 23: 'Miðvikudagur', 24: 'Fimmtudagur', 25: 'Föstudagur' }
export const OPEN_HOUSES = OH.map(([id, day, a, b, street, town, size, rooms, price]) => ({
  id, street, town, size, rooms,
  day: DAY[day],
  dd: String(day),
  wd: WD[day],
  time: a === b ? a : `${a} til ${b}`,
  price: `${price.toLocaleString('is-IS')} kr.`,
  img: A(`oh-${id}.webp`),
  href: `https://fjarfesting.is/soluskra/eign/${id}`,
}))

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Fjárfesting fasteignasala',
  legalName: 'Fjárfesting fasteignasala ehf',
  taxID: '480389-1159',
  telephone: '+354 562 4250',
  email: 'fjarfesting@fjarfesting.is',
  address: { '@type': 'PostalAddress', streetAddress: 'Borgartún 31', postalCode: '105', addressLocality: 'Reykjavík', addressCountry: 'IS' },
}

export const companyEntry: PreviewCompany = {
  slug: 'fjarfesting',
  route: '/preview/fjarfesting',
  name: 'Fjárfesting fasteignasala',
  sector: 'Fasteignasala',
  location: 'Borgartún 31, 105 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Tíu manna fasteignasala í Borgartúni með 120 eignir á söluskrá',
  currentUrl: 'https://fjarfesting.is',
  ownerEmail: 'oskar@fjarfesting.is',
  concept: 'The house mark, in sheets',
  conceptTagline: 'wild-ag.ch’s stacked-sheet rhythm, re-cut in Fjárfesting’s own maroon: their agents, their tariff, their live developments and open houses.',
  accent: '#974042',
  dark: false,
  status: 'In build',
  thumb: A('hero-800.webp'),
  ownPhotography: true,
  photoCredit: 'Myndir og upplýsingar af fjarfesting.is, september 2026.',
  audit: {
    strengths: [
      '120 eignir á söluskrá og opin hús í hverri viku',
      'Tíu starfsmenn, þar af átta löggiltir fasteignasalar, allir með mynd, síma og netfang',
      'Opin og ítarleg gjaldskrá, með fríu söluverðmati',
    ],
    weaknesses: [
      'Vefkortið var síðast uppfært 2019, vefurinn keyrir á jQuery 1.11.3 og bannar aðdrátt í síma',
      'Forsíðan segir ekkert um stofuna nema „Velkominn á vef Fjárfestingar Fasteignasölu“',
      'Nýbyggingasíðan sýnir verkefni sem eru ekki lengur á söluskrá',
    ],
    opportunities: [
      'Forsíða sem sýnir verkefnin sem eru í sölu, opnu húsin og fólkið',
      'Gjaldskráin sem styrkleiki, ekki smáa letrið',
    ],
  },
  positioning:
    'Fjárfesting is a ten-person estate agency in Borgartún with 120 listings, weekly open houses and a transparent tariff, on a 2019 site that says almost nothing about itself. The prototype puts their developments, open houses, agents and prices on one page, in their own maroon.',
  outreach: { subject: 'Hugmynd að nýrri forsíðu fyrir Fjárfestingu', body: '[Drög í vinnslu]' },
}
