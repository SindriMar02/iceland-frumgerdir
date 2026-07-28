/**
 * THG Arkitektar — "Staðarandi" (fella nýtt að því sem fyrir er).
 *
 * Facts below are sourced from BRIEF.md's locked table (§2) — itself drawn
 * from thg.is's own project pages. Photography = THG's own site, fetched at
 * full 2000px resolution (their CDN serves visitors only 750px). The visual
 * system transplants kononenkogroup.com per KONONENKO-BRIEF.md (supersedes
 * BRIEF.md for layout/motion) — this data file's facts are unchanged by
 * that rebuild and carry over as-is.
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
   "THG Arkitektar var stofnað af Halldóri Guðmundssyni arkitekt í október
   1994." Staff: ~40 named people on their About page → "um fjörutíu manns".
   Quality system: ÍST EN ISO 9001:2015 síðan 2016. Services sentence
   verbatim from thg.is. */
export const PRACTICE = {
  founded: 1994,
  founder: 'Halldór Guðmundsson',
  staffLine: 'um fjörutíu manns',
  quality: 'ÍST EN ISO 9001:2015 frá 2016',
  services:
    'Hönnun og ráðgjafarþjónusta í mannvirkjagerð á sviðum arkitektúrs, skipulags og umhverfishönnunar, auk verkumsjónar og eftirlits.',
  // The four clients named across the seven verified projects below
  // (Icelandair — Marina; Hrafnista — Boðaþingi; SÁÁ — Vík; EIR — Spöngin).
  // KONONENKO-BRIEF.md §manifesto: "Verkkaupar (Icelandair, Hrafnista, SÁÁ, EIR)".
  clients: 'Icelandair, Hrafnista, SÁÁ, EIR',
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
    quote: 'Gestamóttakan er hönnuð í Art Deco stíl í samræmi við eldri móttöku.',
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

/* ── The seven projects (BRIEF §2, the complete verified set) ──────────── */
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
}

export const PROJECTS: Project[] = [
  {
    key: 'borg',
    name: 'Hótel Borg',
    place: 'Reykjavík',
    quote: 'Gestamóttakan er hönnuð í Art Deco stíl í samræmi við eldri móttöku.',
    image: 'borg-exterior',
    alt: 'Framhlið Hótel Borgar við Austurvöll í Reykjavík.',
    theme: 'borg',
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
  },
]

/* ── Innandyra — the interiors payoff (BRIEF §6.4) ──────────────────────── */
export interface InteriorShot {
  project: string
  image: string
  alt: string
}
export const INTERIORS: InteriorShot[] = [
  { project: 'Hótel Borg', image: 'borg-lobby', alt: 'Gestamóttaka Hótel Borgar, hönnuð í Art Deco stíl í samræmi við eldri móttöku.' },
  { project: 'Hótel Borg', image: 'borg-room', alt: 'Gestaherbergi á Hótel Borg.' },
  { project: 'Hótel Borg', image: 'borg-spa', alt: 'Baðrými á Hótel Borg, klætt dökkum steini.' },
  { project: 'Icelandair Hótel Marina', image: 'marina-lounge', alt: 'Setustofa á Icelandair Hótel Marina.' },
  { project: 'Icelandair Hótel Marina', image: 'marina-room', alt: 'Gestaherbergi á Icelandair Hótel Marina.' },
  { project: 'Reykjavík Konsúlat', image: 'konsulat-lounge', alt: 'Setustofa og bókarými á Reykjavík Konsúlat.' },
  { project: 'Reykjavík Konsúlat', image: 'konsulat-bath', alt: 'Baðherbergi á Reykjavík Konsúlat.' },
]

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
