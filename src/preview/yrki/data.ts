/**
 * Yrki arkitektar — every fact below was harvested from yrki.is's own
 * rendered pages on 2026-08-10 (Sagan, Vottanir, and 87 project pages).
 *
 * HONESTY GUARDRAILS:
 *  - Competition entries are LABELLED as such — their own pages say
 *    "Samkeppni lokið" / "Tillaga". Nothing unbuilt is presented as built.
 *  - Every area, year and status is copied from the project page's own
 *    FLOKKUR / TÍMABIL / STAÐA / STÆRÐ fields, never estimated.
 *  - The Dezeen mention on Álftaból is their own claim on their own page.
 *  - The staff count (11) is the number of people NAMED on yrki.is/stofan,
 *    counted 2026-08-10 — presented as "ellefu manna hópur", never "um X".
 *  - ISO 9001 "fyrsta arkitektastofan á Íslandi" + certification date
 *    4. júlí 2008 are verbatim claims from yrki.is/vottanir.
 */

const BASE = import.meta.env.BASE_URL
export const IMG = (file: string) => `${BASE}yrki/${file}.jpg`

/* ── Contact (site footer, verbatim) ───────────────────────────────────── */
export const ADDRESS = 'Mýrargata 26, 101 Reykjavík'
export const PHONE_DISPLAY = '+354 552 6629'
export const PHONE_HREF = 'tel:+3545526629'
export const EMAIL = 'yrki@yrki.is'
export const EMAIL_HREF = 'mailto:yrki@yrki.is'

/* ── The practice — yrki.is/stofan, verbatim facts ──────────────────────
   "Yrki var stofnað árið 1997 af þeim Ásdísi Helgu Ágústsdóttur og
   Sólveigu Berg. Stofan var stofnuð í framhaldi af 1. verðlaunum sem þær
   hlutu fyrir Lækningaminjasafnið við Nesstofu á Seltjarnarnesi."
   "Yrki er fyrsta arkitektastofan á Íslandi sem fær vottun á gæðakerfi
   samkvæmt ISO 9001 staðlinum." — vottað 4. júlí 2008 (vottanir page). */
export const PRACTICE = {
  founded: 1997,
  founders: 'Ásdís Helga Ágústsdóttir og Sólveig Berg',
  staffLine: 'ellefu manna hópur',
  isoLine: 'Fyrsta arkitektastofan á Íslandi með vottað ISO 9001 gæðakerfi, frá 4. júlí 2008.',
}

/* ── The seven works, fields copied from each project page ─────────────── */
export interface Project {
  key: string
  name: string
  place?: string
  year?: string
  size?: string
  quote: string
  image: string
  alt: string
  /** free-text label, their own FLOKKUR/status language */
  tag: string
}

export const PROJECTS: Project[] = [
  {
    key: 'alftabol',
    name: 'Álftaból',
    place: 'Við Heklurætur',
    year: '2021-2025',
    size: '210 m²',
    quote: 'Sumarbústaður við Heklurætur. Dezeen, breska veftímaritið um arkitektúr og hönnun, hefur birt grein um bústaðinn.',
    image: 'alftabol-1',
    alt: 'Álftaból, sumarbústaður Yrki arkitekta við Heklurætur.',
    tag: 'Íbúðarhúsnæði',
  },
  {
    key: 'flateyri',
    name: 'Nemendagarðar á Flateyri',
    place: 'Flateyri',
    year: '2021-2022',
    size: '468 m²',
    quote: 'Nemendagarðarnir hýsa 14 námsmannaíbúðir á tveimur hæðum og sameiginlegt alrými á jarðhæð. Fullbyggt fyrir Lýðskólann á Flateyri.',
    image: 'flateyri-1',
    alt: 'Nemendagarðar Yrki arkitekta á Flateyri, fullbyggðir 2022.',
    tag: 'Fullbyggt',
  },
  {
    key: 'lautavegur',
    name: 'Lautavegur',
    place: 'Reykjavík',
    year: '2022-2024',
    size: '420 m²',
    quote: 'Parhús í Reykjavík. Fullbyggt.',
    image: 'lautavegur-1',
    alt: 'Parhús Yrki arkitekta við Lautaveg í Reykjavík.',
    tag: 'Fullbyggt',
  },
  {
    key: 'helgafellsskoli',
    name: 'Helgafellsskóli',
    place: 'Mosfellsbær',
    quote: 'Byggingin er samblanda af sjónsteypu ásamt viðarklæðningum. Hönnunin aðlagast bröttu landslagi, þar sem byggingin spannar frá einni upp í þrjár hæðir.',
    image: 'helgafellsskoli-1',
    alt: 'Helgafellsskóli, sjónsteypa og viðarklæðning í bröttu landslagi.',
    tag: 'Skóli',
  },
  {
    key: 'stefansbud',
    name: 'Stefánsbúð í Mjóafirði',
    place: 'Mjóifjörður',
    year: '2021-',
    size: '160 m²',
    quote: 'Gömul skemma í flæðarmáli Mjóafjarðar gerð upp og henni breytt í frístundahús.',
    image: 'stefansbud-1',
    alt: 'Stefánsbúð, gömul skemma í flæðarmáli Mjóafjarðar.',
    tag: 'Endurgerð',
  },
  {
    key: 'deloitte',
    name: 'Höfuðstöðvar Deloitte',
    place: 'Reykjavík',
    quote: 'Yrki arkitektar sáu um innanhússhönnunina á nýjum höfuðstöðvum Deloitte á Íslandi. Meginmarkmiðið var að skapa sveigjanleika og flæði í vinnuumhverfinu.',
    image: 'deloitte-1',
    alt: 'Innanhússhönnun Yrki arkitekta í höfuðstöðvum Deloitte.',
    tag: 'Innanhússhönnun',
  },
  {
    key: 'nesstofa',
    name: 'Nesstofa',
    place: 'Seltjarnarnes',
    size: '1.360 m²',
    quote: 'Yrki arkitektar hlutu 1. verðlaun í opinni hönnunarsamkeppni fyrir tillögu sína að Lækningaminjasafni á Seltjarnarnesi. Stofan var stofnuð í framhaldi af þeim verðlaunum.',
    image: 'nesstofa-1',
    alt: 'Verðlaunatillaga Yrki arkitekta að Lækningaminjasafni við Nesstofu.',
    tag: '1. verðlaun',
  },
]

/* ── The photographs the set-pieces are built on ────────────────────────── */
export const PHOTOS = {
  hero: { file: 'alftabol-2', alt: 'Álftaból við Heklurætur í rökkri, ljós í gluggum og áin fyrir neðan.' },
  band: { file: 'helgafellsskoli-1', alt: 'Helgafellsskóli í Mosfellsbæ, sjónsteypa og viðarklæðning eftir Yrki arkitekta.' },
  insideA: { file: 'deloitte-2', alt: 'Vinnurými í höfuðstöðvum Deloitte, innanhússhönnun Yrki arkitekta.' },
  insideB: { file: 'stefansbud-2', alt: 'Alrýmið í Stefánsbúð í Mjóafirði.' },
  closing: { file: 'lautavegur-2', alt: 'Parhús Yrki arkitekta við Lautaveg í Reykjavík.' },
} as const

/* ── §2 spec list ───────────────────────────────────────────────────────── */
export const SPEC: ReadonlyArray<readonly [string, string]> = [
  ['Stofnað', '1997'],
  ['Stofnendur', 'Ásdís Helga og Sólveig Berg'],
  ['ISO 9001', 'Frá 4. júlí 2008'],
  ['Starfsfólk', 'Ellefu'],
]

/* ── §4 the ledger ──────────────────────────────────────────────────────── */
export const LEDGER: ReadonlyArray<readonly [string, string]> = [
  ['Stofnað', '1997'],
  ['Verk í skrá', '86'],
  ['ISO 9001 frá', '2008'],
  ['Starfsfólk', '11'],
]

/* ── §7 services — their own list on yrki.is/stofan ─────────────────────── */
export const SERVICES: ReadonlyArray<readonly [string, string]> = [
  ['Nýbyggingar', 'Hönnun'],
  ['Eldri byggingar', 'Endurhönnun'],
  ['Innandyra', 'Innréttingar og húsgögn'],
  ['Skipulag', 'Aðal, ramma og deiliskipulag'],
]

/* ── §3 THE SIGNATURE — three published areas drawn to true scale.
   Every number and status is from the project's own page:
     Álftaból          210 m²  "Á framkvæmdarstigi"
     Nemendagarðar     468 m²  "Fullbyggt"
     Frystigeymsla   2.280 m²  "Fullbyggt" (Sundahöfn, fyrir Samskip)
   No third-party number, no estimate, no average. ─────────────────────── */
export const SCALE = {
  items: [
    { label: 'Álftaból', sub: 'á framkvæmdastigi', m2: 210 },
    { label: 'Nemendagarðar á Flateyri', sub: 'fullbyggt', m2: 468 },
    { label: 'Frystigeymsla í Sundahöfn', sub: 'fullbyggt', m2: 2280 },
  ],
  note: 'Skýringarmynd af flatarmáli, ekki mæld teikning.',
}

/* ── §6 register marquee — all 86 titles exactly as yrki.is/verkefni lists
   them, harvested from the rendered DOM 2026-08-10. ─────────────────────── */
export const REGISTER: readonly string[] = [
  'Ásbrú', 'Höfuðstöðvar Deloitte', 'Deiliskipulag miðbæjar á Vopnafirði', 'Skúlagata',
  'Reinventing Cities', 'Álftaból', 'Þursaholt', 'Stefánsbúð', 'Íbúðabyggð við Tónatröð',
  'Lautavegur', 'Frístundamiðstöð í Árborg', 'Nemendagarðar á Flateyri', 'Ráðhús Akureyrar',
  'Stokkabyggð við Miklubraut og Sæbraut', 'Vallarhús', 'Eldhús í Þingholtunum',
  'Leikskóli og fjölskyldumiðstöð við Njálsgötu', 'Tengivirki á Hólasandi', 'Söluhús við Ægisgarð',
  'Deiliskipulag hafnarinnar á Vopnafirði', 'Miðbakkinn í Reykjavík',
  'Hugmyndasamkeppni um framtíð Suðurnesjabæjar', 'Deiliskipulag við Hlemm og nágrenni',
  'Elliðaárstöð', 'Orkuhússreitur', 'Einbýlishús í Reykjavík', 'Leikskóli á Seltjarnarnesi',
  'Vitinn við Höfða', 'Hagkvæmt húsnæði í Gufunesi', 'Casa Y', 'Casa L', 'Casa I',
  'Deiliskipulag í Gufunesi', 'Mörkin', 'Stúdentagarðar við Sæmundargötu',
  'Deiliskipulag íþróttasvæðisins á Vopnafirði', 'Hótel á Skógum', 'Höfuðstöðvar Vodafone',
  'Deiliskipulag fyrir hótel', 'Laugardalur', 'Spöngin', 'Sveinatunga', 'Sumar í Hlíðarfjalli',
  'Höfuðstöðvar WOW air', 'Gamla höfnin Reykjavík', 'Skóli í Dalshverfi', 'Helgafellsskóli',
  'Heklureitur', 'Viti við Höfða', 'Endurhönnun á heilsárshúsi', 'Nýbýlavegur og Auðbrekka',
  'Aðstöðubygging Borgarfirði eystri', 'Sjúkrahótel', 'Stækkun verknámsaðstöðu FSU',
  'Sumarhús við vatn', 'Strandgata 31-33', 'Sjóvá Akureyri', 'Lækjargata 2',
  'Sjóbúð og bátaskýli á Selhellu', 'Fjölbýlishús í Hafnarfirði', 'Skrifstofubygging við Borgartún',
  'Atvinnu- og íbúðarhúsnæði við Borgartún', 'Fjölbýlishús í Garðabæ', 'Kennaraháskólareitur',
  'Viðbygging við Sundhöll Reykjavíkur', 'Stúdentagarðar við Oddagötu', 'Hjúkrunarheimili á Ísafirði',
  'Bryggjuhverfi Austfjörðum', 'Sjóvá Reykjavík', 'Nýtt fangelsi á Hólmsheiði',
  'Stofnun Vigdísar Finnbogadóttur', 'Happdrætti Háskóla Íslands', 'Vigtarhúsið Þorlákshöfn',
  'Skáli Kirkjuvegi', 'Endurbætur á núverandi húsnæði', 'Sumarhús í Þjórsárdal', 'Askar Capital',
  'Menningarhús og kirkja', 'Golfskáli', 'Gufuneskirkjugarður', 'Sjóminjasafn í Reykjavík',
  'Frystigeymsla Ísheimar', 'Saltfisksetur Íslands', 'Hraundalur', 'Blikaás 1', 'Nesstofa',
]

export const REGISTER_RISE = ['0em', '-0.28em', '-0.1em', '-0.42em', '-0.18em', '-0.5em', '-0.12em', '-0.3em']

/* ── §8 enquiry — their own service areas ───────────────────────────────── */
export const ENQUIRY_TOPICS = [
  'Almenn fyrirspurn',
  'Nýbygging',
  'Endurhönnun eldri byggingar',
  'Innanhússhönnun',
  'Skipulagsgerð',
]

export const NAV = [
  { id: 'yrki-thesis', label: 'Stofan' },
  { id: 'yrki-scale', label: 'Kvarðinn' },
  { id: 'yrki-works', label: 'Verkin' },
  { id: 'yrki-register', label: 'Skráin' },
  { id: 'yrki-services', label: 'Þjónustan' },
  { id: 'yrki-enquiry', label: 'Fyrirspurn' },
] as const

export const PAGE_TITLE = 'Yrki arkitektar · Það jarðbundna og það ljóðræna'
export const PAGE_DESCRIPTION =
  'Yrki arkitektar, stofnað 1997. Fyrsta arkitektastofan á Íslandi með vottað ISO 9001 gæðakerfi. 86 verk í skrá.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Yrki arkitektar',
  foundingDate: '1997',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mýrargata 26',
    postalCode: '101',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  telephone: '+354 552 6629',
  email: 'yrki@yrki.is',
}
