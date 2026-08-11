/**
 * Gláma·Kím — every fact below was harvested from glamakim.is's own
 * rendered pages on 2026-08-10 (About, Staff and all 19 project pages).
 *
 * HONESTY GUARDRAILS:
 *  - NO founding year is stated anywhere on their site, so none appears
 *    here — no "yfir X ára reynsla", no guessed decade.
 *  - The three year-pairs in the timeline diagram are copied verbatim from
 *    their own project texts:
 *      · "friðuðu timburhúsi frá 1907" endurgert 2016
 *      · Háskólabíó: "Teikningarnar eru dagsettar í maí 1959",
 *        Gláma·Kím vann verkefni innandyra 2007-2020
 *      · Arnarnes: "teiknað af Guðmundi Kr. Kristinssyni árið 1968",
 *        tekið í gegn 2017
 *  - Photography on their project pages is credited "© Nanne Springer" —
 *    that credit is carried on this page, never dropped.
 *  - Partners (5) and staff (15) are the people NAMED on their pages,
 *    counted 2026-08-10.
 */

const BASE = import.meta.env.BASE_URL
export const IMG = (file: string) => `${BASE}glamakim/${file}.jpg`

/* ── Contact (site footer, verbatim) ───────────────────────────────────── */
/* Their own site prints "101 Reykjavík" on every page, but the company
   registry (kt. 560496-2739) has Laugavegi 164, 105 Reykjavík. The
   registry wins: 101 is their error, and a redesign should not repeat it. */
export const ADDRESS = 'Laugavegur 164, 105 Reykjavík'
export const PHONE_DISPLAY = '+354 530 8100'
export const PHONE_HREF = 'tel:+3545308100'
export const EMAIL = 'glamakim@glamakim.is'
export const EMAIL_HREF = 'mailto:glamakim@glamakim.is'

/* ── The practice — glamakim.is/about, verbatim facts ──────────────────── */
export const PRACTICE = {
  partners: 'Bæring Bjarnar Jónsson, Jóhannes Þórðarson, Richard Blurton, Sigbjörn Kjartansson og Sigurður Halldórsson',
  staffCount: 15,
  isoLine: 'Gláma·Kím starfrækir gæðakerfi sem samræmist kröfum í ÍST EN ISO 9001:2015.',
  photoCredit: 'Nanne Springer',
}

/* ── The seven works, fields copied from each project page ─────────────── */
export interface Project {
  key: string
  name: string
  place?: string
  year?: string
  size?: string
  /** Their own status wording, where a project page publishes one. */
  status?: string
  quote: string
  image: string
  alt: string
  tag: string
}

export const PROJECTS: Project[] = [
  {
    key: 'thingvallabaer',
    name: 'Þingvallabærinn',
    place: 'Þingvellir',
    year: '2021',
    quote: 'Endurgerð á Þingvallabænum. Ljósmyndir: Nanne Springer.',
    image: 'thingvallabaer-1',
    alt: 'Þingvallabærinn eftir endurgerð Glámu·Kíms, ljósmynd Nanne Springer.',
    tag: 'Endurgerð',
  },
  {
    key: 'haskolabio',
    name: 'Háskólabíó við Hagatorg',
    place: 'Reykjavík',
    year: '2007-2020',
    quote: 'Aðalbyggingin var byggð eftir teikningum Gunnlaugs Halldórssonar og Guðmundar Kr. Kristinssonar, dagsettum í maí 1959. Gláma·Kím annaðist ýmis endurgerðar- og breytingarverkefni innandyra á árunum 2007 til 2020.',
    image: 'haskolabio-1',
    alt: 'Háskólabíó við Hagatorg, endurgerðarverkefni Glámu·Kíms innandyra.',
    tag: 'Endurgerð',
  },
  {
    key: 'timburhus',
    name: 'Timburhús frá 1907',
    place: 'Reykjavík',
    year: '2016',
    quote: 'Breytingar og endurgerð á friðuðu timburhúsi frá 1907. Breytingin tekur mið af aðliggjandi húsum og styrkir götumyndina.',
    image: 'timburhus-1',
    alt: 'Friðað timburhús frá 1907 við Tjörnina, endurgert af Glámu·Kím 2016.',
    tag: 'Friðað hús',
  },
  {
    key: 'hallgerdargata',
    name: 'Hallgerðargata 20',
    place: 'Reykjavík',
    year: '2024',
    quote: 'Við Hallgerðargötu rís nýtt íbúðarhús fyrir Búseta, sem tekur þátt í að móta götumynd hverfisins.',
    image: 'hallgerdargata-1',
    alt: 'Fjölbýlishús Glámu·Kíms við Hallgerðargötu 20 fyrir Búseta.',
    tag: 'Nýbygging',
  },
  {
    key: 'silfratjorn',
    name: 'Fjölbýlishús við Silfratjörn',
    place: 'Úlfarsárdalur',
    year: '2024',
    quote: 'Við Silfratjörn rís nýtt fjölbýlishús fyrir Blæ leigufélag og fellur inn í skipulag Úlfarsárdals.',
    image: 'silfratjorn-1',
    alt: 'Fjölbýlishús Glámu·Kíms við Silfratjörn fyrir Blæ leigufélag.',
    tag: 'Nýbygging',
  },
  {
    key: 'granda',
    name: 'Heilsulind Centerhotels Granda',
    place: 'Seljavegur, Reykjavík',
    year: '2024',
    quote: 'Heilsulind fyrir Centerhotels Granda við Seljaveg.',
    image: 'granda-1',
    alt: 'Heilsulind Centerhotels Granda við Seljaveg, hönnuð af Glámu·Kím.',
    tag: 'Innrétting',
  },
  {
    key: 'hvalfjordur',
    name: 'Sumarhús í Hvalfirði',
    place: 'Hvalfjörður',
    year: '2023',
    quote: 'Sumarhúsið er falið innan um trjákrónurnar og byggt inn í miðjan skóg.',
    image: 'hvalfjordur-1',
    alt: 'Sumarhús Glámu·Kíms falið í skógi í Hvalfirði.',
    tag: 'Nýbygging',
  },
]

/* ── The photographs the set-pieces are built on ────────────────────────── */
export const PHOTOS = {
  hero: { file: 'thingvallabaer-2', alt: 'Þingvallabærinn eftir endurgerð Glámu·Kíms, ljósmynd Nanne Springer.' },
  band: { file: 'haskolabio-2', alt: 'Háskólabíó við Hagatorg, byggt eftir teikningum frá 1959.' },
  insideA: { file: 'granda-2', alt: 'Heilsulind Centerhotels Granda innandyra.' },
  insideB: { file: 'granda-3', alt: 'Heilsulind Centerhotels Granda, laugarrými.' },
  closing: { file: 'hvalfjordur-2', alt: 'Sumarhús í Hvalfirði, falið innan um trjákrónurnar.' },
} as const

/* ── §2 spec list ───────────────────────────────────────────────────────── */
export const SPEC: ReadonlyArray<readonly [string, string]> = [
  ['Eigendur', 'Fimm arkitektar'],
  ['Starfsfólk', 'Fimmtán'],
  ['Gæðakerfi', 'ÍST EN ISO 9001:2015'],
  ['Stofan', 'Laugavegur 164'],
]

/* ── §4 the ledger ──────────────────────────────────────────────────────── */
export const LEDGER: ReadonlyArray<readonly [string, string]> = [
  ['Eigendur', '5'],
  ['Starfsfólk', '15'],
  ['Verk í skrá', '19'],
  ['Elsta húsið', '1907'],
]

/* ── §7 services — their own list on glamakim.is/about ──────────────────── */
export const SERVICES: ReadonlyArray<readonly [string, string]> = [
  ['Skipulag', 'Aðal og deiliskipulag'],
  ['Mannvirki', 'Hönnun og verkteikningar'],
  ['Innandyra', 'Innanhúss og húsgagnahönnun'],
  ['Framkvæmd', 'Áætlanagerð og eftirlit'],
]

/* ── §3 THE SIGNATURE — three renovation year-pairs drawn to true scale.
   Each pair is verbatim from the project's own text; the span in years is
   the only arithmetic (2016−1907=109, 2020−1959=61, 2017−1968=49). ────── */
export const SPANS = {
  items: [
    { label: 'Timburhús við Tjörnina', from: 1907, to: 2016, note: 'friðað hús, endurgert' },
    { label: 'Háskólabíó', from: 1959, to: 2020, note: 'teikningar dagsettar í maí 1959' },
    { label: 'Einbýli á Arnarnesi', from: 1968, to: 2017, note: 'tekið í gegn og endurnýjað' },
  ],
  note: 'Skýringarmynd af árabilum, ekki tímalína verkefnanna sjálfra.',
}

/* ── §6 register marquee — all 19 titles from their project pages ───────── */
export const REGISTER: readonly string[] = [
  'Fjölbýlishús við Hallgerðargötu', 'Endurgerð á Þingvallabænum', 'Fjölbýlishús við Silfratjörn',
  'Sumarhús í Hvalfirði', 'Heilsulind Centerhotels Granda', 'Háskólabíó við Hagatorg',
  'Einbýli á Seltjarnarnesi', 'Vinnumálastofnun', 'Katrínartún 6', 'Indriðastaðir',
  'Kolsstaðir', 'Eyesland', 'Einbýli í Reykjavík', 'Útilíf', 'Sumarhús við Hvítá',
  'Timburhús frá 1907', 'Einbýli á Arnarnesi', 'Sumarhús undir Eyjafjöllum', 'Viðbygging í Hafnarfirði',
]

export const REGISTER_RISE = ['0em', '-0.28em', '-0.1em', '-0.42em', '-0.18em', '-0.5em', '-0.12em', '-0.3em']

/* ── §8 enquiry — their own service areas ───────────────────────────────── */
export const ENQUIRY_TOPICS = [
  'Almenn fyrirspurn',
  'Endurgerð eldra húss',
  'Nýbygging',
  'Innanhússhönnun',
  'Skipulagsgerð',
]

export const NAV = [
  { id: 'gk-thesis', label: 'Stofan' },
  { id: 'gk-spans', label: 'Árin' },
  { id: 'gk-works', label: 'Verkin' },
  { id: 'gk-register', label: 'Skráin' },
  { id: 'gk-services', label: 'Þjónustan' },
  { id: 'gk-enquiry', label: 'Fyrirspurn' },
] as const

export const PAGE_TITLE = 'Gláma·Kím · Að halda trúnaði við húsið'
export const PAGE_DESCRIPTION =
  'Gláma·Kím arkitektar, Laugavegi 164. Endurgerð friðaðra húsa, nýbyggingar og skipulag. ISO 9001:2015 gæðakerfi.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Gláma·Kím arkitektar',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Laugavegur 164',
    postalCode: '105',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  telephone: '+354 530 8100',
  email: 'glamakim@glamakim.is',
}
