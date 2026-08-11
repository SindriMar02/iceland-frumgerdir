/**
 * T.ark arkitektar — every fact below was harvested from tark.is's own
 * rendered pages on 2026-08-10 (home/staff, six category pages and 25
 * project pages).
 *
 * HONESTY GUARDRAILS:
 *  - "Skráð 1978" is derived from their published kennitala 710178-0119
 *    (company registration encoding, listed on ja.is) — one derivation,
 *    stated as registration, never as "starfað í X ár".
 *  - Staff (26) and owners (11) are the people NAMED on tark.is with the
 *    "eigandi" designation, counted 2026-08-10.
 *  - Both areas in the scale diagram are one verbatim line from their
 *    Laugarás Lagoon page: "Hús 3000m2, lón 1000m2".
 *  - First prizes are their own statements: C40 Reinventing Cities
 *    ("1. verðlaun í alþjóðlegri samkeppni") and Stjórnarráðsreiturinn
 *    ("fengu 1. verðlaun ... í opinni samkeppni").
 *  - Svansvottun on Bygggarðar is their own claim on that project page.
 */

const BASE = import.meta.env.BASE_URL
export const IMG = (file: string) => `${BASE}tark/${file}.jpg`

/* ── Contact (site footer, verbatim) ───────────────────────────────────── */
export const ADDRESS = 'Hátún 2b, 105 Reykjavík'
export const PHONE_DISPLAY = '540 5700'
export const PHONE_HREF = 'tel:+3545405700'
export const EMAIL = 'tark@tark.is'
export const EMAIL_HREF = 'mailto:tark@tark.is'
export const KT = 'kt. 710178-0119'

export const PRACTICE = {
  registered: 1978,
  staffCount: 26,
  ownerCount: 11,
  fields: 'atvinnuhúsnæði, íbúðarhúsnæði, hótel og ferðaþjónusta, íþróttir og kennsla, skipulag, iðnaður',
}

/* ── The seven works, fields copied from each page ──────────────────────── */
export interface Project {
  key: string
  name: string
  place?: string
  year?: string
  size?: string
  /** Their own status wording, where the page publishes one. */
  status?: string
  quote: string
  image: string
  alt: string
  tag: string
}

export const PROJECTS: Project[] = [
  {
    key: 'skylagoon',
    name: 'Sky Lagoon',
    place: 'Vesturvör, Kársnes',
    year: '2019-2021',
    quote: 'Baðlón á Kársnesi sem skapar náttúrulega upplifun. Verkkaupi Nordic Resort og Pursuit.',
    image: 'skylagoon-1',
    alt: 'Sky Lagoon á Kársnesi, baðlón hannað af T.ark.',
    tag: 'Ferðaþjónusta',
  },
  {
    key: 'laugaras',
    name: 'Laugarás Lagoon',
    place: 'Laugarás, Bláskógabyggð',
    year: '2023-2025',
    size: 'Hús 3.000 m² · lón 1.000 m²',
    quote: 'Reynt var að nýta sem mest byggingarefni úr nærumhverfinu í sýnilega þætti hússins. Torfið kemur frá söndunum við Markarfljót og timburklæðningin er öll stikagreni úr Haukadalsskógi.',
    image: 'laugaras-1',
    alt: 'Laugarás Lagoon, hús og baðlón eftir T.ark í Laugarási.',
    tag: 'Ferðaþjónusta',
  },
  {
    key: 'austurhofn',
    name: 'Austurhöfn',
    place: 'Við höfnina í Reykjavík',
    year: '2016-2021',
    size: '74 íbúðir',
    quote: '74 hágæða íbúðir við höfnina í Reykjavík ásamt verslun og þjónustu á fyrstu hæð.',
    image: 'austurhofn-1',
    alt: 'Austurhöfn, 74 íbúðir við höfnina í Reykjavík eftir T.ark.',
    tag: 'Íbúðir',
  },
  {
    key: 'sundhollin',
    name: 'Stækkun Sundhallarinnar',
    place: 'Reykjavík',
    year: '2013',
    /* Their own page: "Samkeppni um útisundlaug og nýja klefa við Sundhöll
       Reykjavíkur ... Opin samkeppni. Tillagan unnin í samvinnu við Kurtogpí.
       Tillagan fékk 3. verðlaun." A competition entry, never built by T.ark,
       so it is never shown here as a completed extension. */
    status: 'Samkeppnistillaga',
    quote: 'Opin samkeppni um útisundlaug og nýja klefa við Sundhöll Reykjavíkur, unnin í samvinnu við Kurtogpí. Tillagan fékk 3. verðlaun. Eitt helsta markmið hennar var að nýta núverandi búningsklefa fyrir bæði kynin.',
    image: 'sundhollin-1',
    alt: 'Samkeppnistillaga T.ark og Kurtogpí um stækkun Sundhallarinnar.',
    tag: 'Samkeppni',
  },
  {
    key: 'edition',
    name: 'The Reykjavik Edition',
    place: 'Bryggjugata 8, Reykjavík',
    year: '2018-2021',
    size: '19.000 m² · 253 herbergi',
    quote: 'Á Austurbakkanum við hlið Hörpu reis 19.000 fermetra hótelbygging hönnuð af T.ark. Á hótelinu, sem er sex hæðir, eru 253 gestaherbergi ásamt veitingastað, skemmtistað, veislusal, börum og heilsulind. Verkkaupi Carpenter and Company.',
    image: 'edition-1',
    alt: 'Húsagarður The Reykjavik Edition við Austurhöfn.',
    tag: 'Hótel',
  },
  {
    key: 'skardshlid',
    name: 'Skarðshlíðarskóli',
    place: 'Hafnarfjörður',
    year: '2017-2020',
    quote: 'T.ark og Eykt urðu hlutskörpust í alútboði fyrir nýjan skóla í Skarðshlíðarhverfinu. Skólinn er bæði grunnskóli og leikskóli.',
    image: 'skardshlid-1',
    alt: 'Skarðshlíðarskóli í Hafnarfirði, grunn- og leikskóli eftir T.ark.',
    tag: 'Skóli',
  },
  {
    key: 'hellisheidi',
    name: 'Hellisheiðarvirkjun',
    place: 'Hellisheiði',
    quote: 'T.ark var aðalhönnuður að virkjuninni og síðari stækkunum fyrir ON.',
    image: 'hellisheidi-1',
    alt: 'Hellisheiðarvirkjun, aðalhönnun T.ark.',
    tag: 'Iðnaður',
  },
]

/* ── The photographs the set-pieces are built on ────────────────────────── */
export const PHOTOS = {
  hero: { file: 'edition-1', alt: 'Húsagarður The Reykjavik Edition við Austurhöfn, dökkar hliðar og mosaþök.' },
  band: { file: 'skylagoon-1', alt: 'Sky Lagoon á Kársnesi, torfhlaðinn veggur og inngangurinn.' },
  insideA: { file: 'edition-2', alt: 'The Reykjavik Edition innandyra.' },
  insideB: { file: 'laugaras-2', alt: 'Laugarás Lagoon, efni úr nærumhverfinu.' },
  /* Was Hús Vigdísar, which is a 2nd-prize COMPETITION entry — an unlabelled
     full-bleed render of it read as a built T.ark building. Swapped for
     Austurhöfn, which they did build. */
  closing: { file: 'austurhofn-2', alt: 'Austurhöfn við höfnina í Reykjavík, 74 íbúðir eftir T.ark.' },
} as const

/* ── §2 spec list ───────────────────────────────────────────────────────── */
export const SPEC: ReadonlyArray<readonly [string, string]> = [
  ['Skráð', '1978'],
  ['Starfsfólk', 'Tuttugu og sex'],
  ['Eigendur', 'Ellefu'],
  ['Svið', 'Sex'],
]

/* ── §4 the ledger ──────────────────────────────────────────────────────── */
export const LEDGER: ReadonlyArray<readonly [string, string]> = [
  ['Skráð', '1978'],
  ['Starfsfólk', '26'],
  ['Eigendur', '11'],
  ['Verk í skrá', '42'],
]

/* ── §7 services — their own six categories ─────────────────────────────── */
export const SERVICES: ReadonlyArray<readonly [string, string]> = [
  ['Atvinnuhúsnæði', 'Skrifstofur og verslun'],
  ['Íbúðarhúsnæði', 'Fjölbýli og sérbýli'],
  ['Ferðaþjónusta', 'Hótel og baðlón'],
  ['Opinbert', 'Skólar, íþróttir og skipulag'],
]

/* ── §3 THE SIGNATURE — the house and its lagoon, drawn to true scale.
   One verbatim line from their Laugarás Lagoon page: "Hús 3000m2, lón
   1000m2". Two published areas, no arithmetic at all. ─────────────────── */
export const SCALE = {
  items: [
    { label: 'Lónið', sub: 'Laugarás Lagoon', m2: 1000 },
    { label: 'Húsið', sub: 'Laugarás Lagoon', m2: 3000 },
  ],
  note: 'Skýringarmynd af flatarmáli, ekki mæld teikning.',
}

/* ── §6 register marquee — 42 titles from their six category pages ──────── */
export const REGISTER: readonly string[] = [
  'Arion Banki', 'Loftleiðir', 'Skrifstofur Alþingis', 'WOWair', 'Höfðaborg', 'Skógarvegur 12-14',
  'Hrólfskálamelur', 'Austurhöfn', 'Smárinn', 'Hring og Nónhamar', 'Skerjabraut', 'Jaðarleiti',
  'Skógarsel', 'Laugarás Lagoon', 'Sky Lagoon', 'The Reykjavik Edition', 'Hótel Cabin',
  'Tower Suits', 'Hótel Örk', 'EyjaSpa', 'Áshamar 9', 'Skarðshlíðarskóli', 'Úlfarsárdalur',
  'Hús Vigdísar', 'Sundhöllin', 'LHÍ', 'Stjórnarráðsreiturinn', 'Stokkar', 'Nordic Built',
  'Barónsreitir', 'Hellisheiðarvirkjun', 'C40 Reinventing Cities Ártún', 'Bygggarðar', '201 Smári',
  'Verknámsaðstaða FSU', 'Norðlingabraut Fylkir', 'Reykjavíkurflugvöllur', 'Vaðölduver',
  'VAXA Hellisheiði', 'Fjarðaál', 'Verne Global', 'Þeystareykjavirkjun',
]

export const REGISTER_RISE = ['0em', '-0.28em', '-0.1em', '-0.42em', '-0.18em', '-0.5em', '-0.12em', '-0.3em']

/* ── §8 enquiry — their own six fields, condensed ───────────────────────── */
export const ENQUIRY_TOPICS = [
  'Almenn fyrirspurn',
  'Atvinnuhúsnæði',
  'Íbúðarhúsnæði',
  'Hótel og ferðaþjónusta',
  'Skipulag',
]

export const NAV = [
  { id: 'tark-thesis', label: 'Stofan' },
  { id: 'tark-scale', label: 'Lónið' },
  { id: 'tark-works', label: 'Verkin' },
  { id: 'tark-register', label: 'Skráin' },
  { id: 'tark-services', label: 'Sviðin' },
  { id: 'tark-enquiry', label: 'Fyrirspurn' },
] as const

export const PAGE_TITLE = 'T.ark arkitektar · Frá virkjun að baðlóni'
export const PAGE_DESCRIPTION =
  'T.ark arkitektar, Hátúni 2b. Sky Lagoon, Austurhöfn, Hellisheiðarvirkjun og Sundhöllin. 26 manna stofa skráð 1978.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'T.ark arkitektar',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hátún 2b',
    postalCode: '105',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  telephone: '+354 540 5700',
  email: 'tark@tark.is',
  taxID: '710178-0119',
}
