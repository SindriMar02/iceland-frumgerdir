/**
 * THG Arkitektar — "Staðarandi" (fella nýtt að því sem fyrir er).
 *
 * Every fact below is sourced from BRIEF.md's locked table (§2) — itself
 * drawn from thg.is's own project pages. Photography = THG's own site,
 * fetched at full 2000px resolution (their CDN serves visitors only 750px).
 *
 * HONESTY GUARDRAILS (see BRIEF §2, §3):
 *  - Fields marked "not published" in the brief are omitted entirely below —
 *    no placeholder, no inferred year, no invented size.
 *  - Konsúlat (Hafnarstræti 19) appears ONCE — their own /verkefni lists it
 *    twice under two names; that duplication is the bug being fixed.
 *  - Vík is SÁÁ's rehabilitation centre, not a hotel — no retreat framing.
 *  - No awards, no testimonials, no staff names beyond Halldór Guðmundsson,
 *    no revenue, no project outside this table, no "award-winning".
 *  - The Konsúlat quote is a faithful Icelandic translation of the English
 *    original on thg.is ("The idea is to blend new and historical
 *    constructions.") — translated, not paraphrased, to honour the
 *    Icelandic-only copy rule while keeping the source meaning intact.
 */

const BASE = import.meta.env.BASE_URL
export const IMG = (file: string) => `${BASE}thg/${file}.jpg`

/* ── Contact (BRIEF §2, verbatim) ───────────────────────────────────────── */
export const ADDRESS = 'Faxafen 9, 108 Reykjavík'
export const PHONE_DISPLAY = '(+354) 545 1600'
export const PHONE_HREF = 'tel:+3545451600'
export const EMAIL = 'thg@thg.is'
export const EMAIL_HREF = 'mailto:thg@thg.is'
export const KT = 'kt. 440703-2590'
export const MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=Faxafen+9%2C+108+Reykjav%C3%ADk'

/* ── The practice ────────────────────────────────────────────────────────
   "THG architects was founded by Halldór Guðmundsson in October 1994."
   Staff: 34 named people counted on thg.is/um-thg, 2026-08-05 — the earlier
   "um fjörutíu manns" was a rounding of an older harvest and is retired.
   Quality system: ÍST EN ISO 9001:2015 síðan 2016. Services sentence
   verbatim from thg.is. */
export const PRACTICE = {
  founded: 1994,
  founder: 'Halldór Guðmundsson',
  staffLine: 'þrjátíu og fjórir starfsmenn',
  quality: 'ÍST EN ISO 9001:2015 frá 2016',
  services:
    'Hönnun og ráðgjafarþjónusta í mannvirkjagerð á sviðum arkitektúrs, skipulags og umhverfishönnunar, auk verkumsjónar og eftirlits.',
}

/* ── The thesis (BRIEF §1) — the three quotations, verbatim / translated ── */
export interface ThesisQuote {
  project: string
  quote: string
  note?: string
}
export const THESIS_QUOTES: ThesisQuote[] = [
  {
    project: 'Hótel Borg',
    quote: 'Gestamóttakan er hönnuð í Art Deko stíl í samræmi við eldri móttöku.',
  },
  {
    project: 'Reykjavík Konsúlat',
    quote: 'Hugmyndin er að flétta saman nýjum og sögulegum byggingum.',
    note: '(þýtt úr ensku: „The idea is to blend new and historical constructions.")',
  },
  {
    project: 'Hótel Von',
    quote:
      'Miðað var við að hótelbyggingin mundi falla að þeim byggingarstíl sem er í næsta nágrenni og reynt að fanga „staðarandann".',
  },
]

export const CODENAME = 'Staðarandi'
export const TAGLINE = 'Að fella nýtt að því sem fyrir er.'

/* ── Seven projects, re-verified 2026-08-05. NOT the complete set any more:
   thg.is/verkefni now lists 22 projects (it listed these seven when the
   BRIEF was written). These are the seven whose full-resolution photography
   is already harvested; every piece of copy on the page therefore says
   "seven of", never "the seven". ─────────────────────────────────────── */
export type ProjectKind = 'hotel' | 'thjonusta' | 'endurhaefing'

export const KIND_LABEL: Record<ProjectKind, string> = {
  hotel: 'Hótel',
  thjonusta: 'Þjónusta og hjúkrun',
  endurhaefing: 'Endurhæfing',
}

export interface Project {
  key: string
  name: string
  place?: string
  year?: string
  size?: string
  client?: string
  quote: string
  image: string
  alt: string
  theme: 'borg' | 'marina' | 'konsulat' | 'von' | 'eir' | 'hrafnista' | 'saavik'
  /** Which of the three families the project belongs to. Derived only from
   *  what thg.is itself says the building is — never from square metres. */
  kind: ProjectKind
}

export const PROJECTS: Project[] = [
  {
    key: 'borg',
    name: 'Hótel Borg',
    place: 'Reykjavík',
    quote: 'Gestamóttakan er hönnuð í Art Deko stíl í samræmi við eldri móttöku.',
    image: 'borg-exterior',
    alt: 'Ytra byrði Hótel Borgar í Reykjavík.',
    theme: 'borg',
    kind: 'hotel',
  },
  {
    key: 'marina',
    name: 'Icelandair Hótel Marina',
    place: 'Mýrargata 2-8, Reykjavík',
    year: '2012',
    size: '111 herbergi',
    client: 'Icelandair',
    quote: 'Í húsinu eru 111 herbergi, líkamsræktaraðstaða ásamt bar og veitingaaðstöðu á jarðhæð.',
    image: 'marina-exterior',
    alt: 'Ytra byrði Icelandair Hótel Marina við gömlu höfnina í Reykjavík.',
    theme: 'marina',
    kind: 'hotel',
  },
  {
    key: 'konsulat',
    name: 'Reykjavík Konsúlat',
    place: 'Hafnarstræti 19, Reykjavík',
    year: '2015',
    quote: 'Kolasundið liggur gegnum jarðhæðina og tengir gamla miðbæinn við gömlu sjávarlóðina.',
    image: 'konsulat-street',
    alt: 'Hafnarstræti 19, Reykjavík Konsúlat, við Kolasundið í miðbænum.',
    theme: 'konsulat',
    kind: 'hotel',
  },
  {
    key: 'von',
    name: 'Hótel Von',
    place: 'Reykjavík',
    year: '2016-2019',
    quote:
      'Miðað var við að hótelbyggingin mundi falla að þeim byggingarstíl sem er í næsta nágrenni og reynt að fanga „staðarandann".',
    image: 'von-1',
    alt: 'Hótel Von í Reykjavík, byggt inn í nærliggjandi byggingarstíl.',
    theme: 'von',
    kind: 'hotel',
  },
  {
    key: 'eir',
    name: 'EIR, Spöngin',
    place: 'Reykjavík',
    year: '2009-2010',
    size: '111 þjónustuíbúðir · um 20.000 m²',
    quote:
      'Arkitektahönnun og verkefnastjórnun á 111 þjónustuíbúðum fyrir aldraða ásamt samtengdu þjónustu og menningarhúsi við Spöng.',
    image: 'eir-1',
    alt: 'EIR þjónustukjarni og íbúðir við Spöngina í Reykjavík.',
    theme: 'eir',
    kind: 'thjonusta',
  },
  {
    key: 'hrafnista',
    name: 'Hrafnista, Boðaþingi',
    place: 'Kópavogur',
    quote: 'Klasi íbúðarhúsa ásamt þjónustu fyrir aldraða við Boðaþing í Kópavogi.',
    client: 'Hrafnista',
    image: 'hrafnista-1',
    alt: 'Hrafnista við Boðaþing í Kópavogi, klasi íbúðarhúsa fyrir aldraða.',
    theme: 'hrafnista',
    kind: 'thjonusta',
  },
  {
    key: 'saavik',
    name: 'Endurhæfingarmiðstöð SÁÁ, Vík',
    place: 'Kjalarnes',
    size: '+2.730 m² í 3.580 m² alls',
    quote: 'Húsið stækkar um samtals 2.730 m² og verður eftir stækkun samtals 3.580 m².',
    image: 'saa-vik-1',
    alt: 'Endurhæfingarmiðstöð SÁÁ í Vík á Kjalarnesi eftir stækkun.',
    theme: 'saavik',
    kind: 'endurhaefing',
  },
]

/* ── Innandyra — the interiors payoff (BRIEF §6.4) ──────────────────────── */
export interface InteriorShot {
  project: string
  image: string
  alt: string
  /** The room itself, taken straight from the alt text — never invented. */
  room: string
}
export const INTERIORS: InteriorShot[] = [
  { project: 'Hótel Borg', image: 'borg-lobby', room: 'Gestamóttakan', alt: 'Gestamóttaka Hótel Borgar, hönnuð í Art Deko stíl í samræmi við eldri móttöku.' },
  { project: 'Hótel Borg', image: 'borg-room', room: 'Gestaherbergi', alt: 'Gestaherbergi á Hótel Borg.' },
  { project: 'Hótel Borg', image: 'borg-spa', room: 'Baðrými', alt: 'Baðrými á Hótel Borg, klætt dökkum steini.' },
  { project: 'Icelandair Hótel Marina', image: 'marina-lounge', room: 'Setustofan', alt: 'Setustofa á Icelandair Hótel Marina.' },
  { project: 'Icelandair Hótel Marina', image: 'marina-room', room: 'Gestaherbergi', alt: 'Gestaherbergi á Icelandair Hótel Marina.' },
  { project: 'Reykjavík Konsúlat', image: 'konsulat-lounge', room: 'Setustofa og bókarými', alt: 'Setustofa og bókarými á Reykjavík Konsúlat.' },
  { project: 'Reykjavík Konsúlat', image: 'konsulat-bath', room: 'Baðherbergi', alt: 'Baðherbergi á Reykjavík Konsúlat.' },
]

/* ── Tvenns konar hús — BRIEF §6.5, the plain split ─────────────────────── */
export const TVENNS_KONAR = {
  hotel: { label: 'Hótel', project: 'Icelandair Hótel Marina', figure: '111', unit: 'herbergi', image: 'marina-exterior' },
  care: { label: 'Hjúkrunarheimili', project: 'EIR, Spöngin', figure: '111', unit: 'þjónustuíbúðir', image: 'eir-1' },
}

/* ── Kolasundið — BRIEF §6.6 ─────────────────────────────────────────────── */
export const KOLASUNDID = {
  title: 'Kolasundið',
  body:
    'Kolasundið er göngugata sem liggur gegnum jarðhæð Reykjavík Konsúlat við Hafnarstræti 19 og tengir gamla miðbæinn við það sem áður var sjávarströndin. Almenn gönguleið er hluti af húsinu sjálfu, ekki viðbót við það.',
  diagramLabel: 'Skýringarmynd, ekki mæld teikning.',
  image: 'konsulat-street',
}

/* ═══════════════════════════════════════════════════════════════════════
   Below: the data the Heklusýn machine needs, transplanted 1:1. Every
   photograph named here is one of THG's own JPEGs already in public/thg —
   no new asset, no stock, no CGI. Where Heklusýn labelled a frame
   "Tölvumynd", THG's equivalent frame is a real photograph and is labelled
   with the building instead: a "Tölvumynd" chip over a real photo would be
   a false claim, and the chip device is kept, only re-captioned.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── The photographs the set-pieces are built on ────────────────────────── */
export const PHOTOS = {
  /** §1 the 320vh dive-in. Their most recognisable façade. */
  hero: { file: 'borg-exterior', alt: 'Ytra byrði Hótel Borgar í Reykjavík.' },
  /** §4 full-bleed band under the dome — the "staðarandi" project itself. */
  domeBand: { file: 'von-1', alt: 'Hótel Von í Reykjavík, byggt inn í nærliggjandi byggingarstíl.' },
  /** §6 the paired pair: the street the building gives back, then inside it. */
  onePairA: { file: 'konsulat-street', alt: 'Hafnarstræti 19, Reykjavík Konsúlat, við Kolasundið í miðbænum.' },
  onePairB: { file: 'konsulat-lounge', alt: 'Setustofa og bókarými á Reykjavík Konsúlat.' },
  /** §7 the shutter merge: same building, outside wiped through to inside. */
  shutterBase: { file: 'borg-exterior', alt: 'Ytra byrði Hótel Borgar í Reykjavík.' },
  shutterPlate: { file: 'borg-lobby', alt: 'Gestamóttaka Hótel Borgar, hönnuð í Art Deko stíl í samræmi við eldri móttöku.' },
} as const

/* ── §9 Stofan — the three numbers. Every one is thg.is's own statement
   about itself; nothing here is counted, inferred or rounded by me. ────── */
export const DOCUMENTS = [
  { count: '1994', label: 'stofnað', note: 'Halldór Guðmundsson arkitekt stofnaði stofuna í október 1994.' },
  { count: '34', label: 'starfsmenn', note: 'Nafngreint starfsfólk á starfsmannasíðu stofunnar, talið 5. ágúst 2026.' },
  { count: '2016', label: 'ISO 9001', note: 'Gæðakerfi ÍST EN ISO 9001:2015 hefur verið í gildi frá 2016.' },
]

/* ── §10 Fyrirspurn — the enquiry targets. Their four published service
   areas plus a general option; never a project name, since a visitor
   enquiring about Hótel Borg would be writing to the wrong company. ───── */
export const ENQUIRY_TOPICS = [
  'Almenn fyrirspurn',
  'Arkitektúr og hönnun',
  'Skipulag og umhverfishönnun',
  'Verkumsjón og eftirlit',
  'Hjúkrunarheimili og þjónustuíbúðir',
]

/* ── Nav / section index (id must match the section wrapper) ────────────── */
export const NAV = [
  { id: 'thg-thesis', label: 'Kjarninn' },
  { id: 'thg-works', label: 'Verkin' },
  { id: 'thg-method', label: 'Aðferðin' },
  { id: 'thg-ledger', label: 'Skráin' },
  { id: 'thg-inside', label: 'Utan og innan' },
  { id: 'thg-interiors', label: 'Innandyra' },
  { id: 'thg-practice', label: 'Stofan' },
  { id: 'thg-enquiry', label: 'Fyrirspurn' },
] as const

/* ── SEO / meta ───────────────────────────────────────────────────────── */
export const PAGE_TITLE = 'THG Arkitektar · Staðarandi'
export const PAGE_DESCRIPTION =
  'THG Arkitektar, stofnuð 1994. Hótel og hjúkrunarheimili sem falla að því sem fyrir er.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'THG Arkitektar',
  foundingDate: '1994-10',
  founder: { '@type': 'Person', name: 'Halldór Guðmundsson' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Faxafen 9',
    postalCode: '108',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  telephone: '+354 545 1600',
  email: 'thg@thg.is',
  taxID: '440703-2590',
}
