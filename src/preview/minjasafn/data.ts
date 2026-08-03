import type { PreviewCompany } from '../companies'

/* Minjasafn Austurlands — facts verified 2026-08-02 against minjasafn.is (live).
   Every URL below was re-verified against the live homepage nav on 2026-08-02
   (curl of minjasafn.is): gripur mánaðarins, ljósmyndasafn, fornleifa-/samtíma-
   rannsóknir, sumarhús Kjarvals, lindarbakki, skólaheimsóknir, jóladagatal,
   fróðleikur, the Facebook page id and the Instagram handle all exist as given.
   "Fjallkonan" has NO dedicated page — it lives inside /onnur-verkefni, so its
   row links there (no invented URL).
   NO PHONE NUMBER anywhere: their site says 471-1412, the sweep recorded
   472-1750 — conflict unresolved, publishing either would be a guess. */

const BASE = import.meta.env.BASE_URL

/* ── image library — all files live in /public/minjasafn/, eyes-on reviewed ── */
export const IMG = {
  /* srcSet: pre-resized 800w variants (generated with sips from the originals)
     so a 390px phone never downloads a 2000px original */
  sjalfbaer: {
    src: `${BASE}minjasafn/grunnsyning-sjalfbaer.jpg`,
    srcSet: `${BASE}minjasafn/grunnsyning-sjalfbaer-800.jpg 800w, ${BASE}minjasafn/grunnsyning-sjalfbaer.jpg 1200w`,
    alt: 'Innansýn í grunnsýninguna Sjálfbæra einingu: timburveggir, rauðmálaður stigi, tunnur og strokkur',
  },
  hreindyrSyning: {
    src: `${BASE}minjasafn/grunnsyning-hreindyr.jpg`,
    srcSet: `${BASE}minjasafn/grunnsyning-hreindyr-800.jpg 800w, ${BASE}minjasafn/grunnsyning-hreindyr.jpg 1200w`,
    alt: 'Grunnsýningin Hreindýrin á Austurlandi með uppstoppuðum hreindýrum og veggmyndum',
  },
  hreindyrKrakkar: {
    src: `${BASE}minjasafn/hreindyr.jpg`,
    srcSet: `${BASE}minjasafn/hreindyr-800.jpg 800w, ${BASE}minjasafn/hreindyr-1200.jpg 1200w, ${BASE}minjasafn/hreindyr.jpg 2000w`,
    alt: 'Tvö börn vinna verkefnablöð við hlið alvöru hreindýrahorna í safnfræðslu',
  },
  spjold: {
    src: `${BASE}minjasafn/spjold.jpg`,
    srcSet: `${BASE}minjasafn/spjold-800.jpg 800w, ${BASE}minjasafn/spjold-1200.jpg 1200w, ${BASE}minjasafn/spjold.jpg 2000w`,
    alt: 'Sýningarspjöld um Grýlu og þjóðtrú á vegg í sýningarsal safnsins',
  },
  lindarbakki: {
    src: `${BASE}minjasafn/lindarbakki.jpg`,
    srcSet: `${BASE}minjasafn/lindarbakki-800.jpg 800w, ${BASE}minjasafn/lindarbakki.jpg 1200w`,
    alt: 'Lindarbakki, rauðgaflaður torfbær á Borgarfirði eystra',
  },
  bak: {
    src: `${BASE}minjasafn/bak.jpg`,
    alt: 'Gestur skoðar sýningargripi í sal Minjasafns Austurlands',
  },
  syning2023: {
    src: `${BASE}minjasafn/syning2023.jpg`,
    alt: 'Sérsýning í Minjasafni Austurlands árið 2023',
  },
} as const

/* ── CONTACT_SHEET — the photographs laid out as an archive contact sheet in
      the Ljósmyndasafn section.
      HONESTY BOUNDARY: these are the museum's OWN photographs of its work,
      events and exhibitions. They are NOT the digitised Ljósmyndasafn
      Austurlands (about 80.000 images, kept as a department within
      Héraðsskjalasafn Austfirðinga), which is not published on the web.
      The section copy says exactly that, and so does the foot of the sheet.
      Alt text stays inside what the brief's eyes-on review established about
      each file: no invented dates, names, places, captions or object
      identifications. The sequence numbers 01..11 are sheet positions, not
      accession numbers. ── */
export const CONTACT_SHEET = [
  { src: `${BASE}minjasafn/spjold-800.jpg`, alt: 'Sýningarspjöld um Grýlu og þjóðtrú á vegg í sýningarsal safnsins' },
  { src: `${BASE}minjasafn/bak-800.jpg`, alt: 'Gestur skoðar sýningargripi í sal Minjasafns Austurlands' },
  { src: `${BASE}minjasafn/syning2023-800.jpg`, alt: 'Sérsýning í Minjasafni Austurlands árið 2023' },
  { src: `${BASE}minjasafn/thorri-800.jpg`, alt: 'Ljósmynd úr þorraviðburði á vegum Minjasafns Austurlands' },
  { src: `${BASE}minjasafn/bras-800.jpg`, alt: 'Ljósmynd frá BRAS árið 2019' },
  { src: `${BASE}minjasafn/saudkind-800.jpg`, alt: 'Sauðkind, ljósmynd frá Minjasafni Austurlands' },
  { src: `${BASE}minjasafn/lindarbakki-800.jpg`, alt: 'Lindarbakki, rauðgaflaður torfbær á Borgarfirði eystra' },
  { src: `${BASE}minjasafn/ull-800.jpg`, alt: 'Ull og textílvinna, ljósmynd frá Minjasafni Austurlands' },
  { src: `${BASE}minjasafn/safnfraedsla-800.jpg`, alt: 'Safnfræðsla í Minjasafni Austurlands' },
  /* the three gripur-mánaðarins studio shots that used to sit here were the
     same three files as the strip above, and a studio object shot is neither
     starf, viðburður né sýning. Replaced with the two remaining unused files
     from the museum's own set, both eyes-on described, so the sheet runs
     eleven real frames instead of twelve with repeats. */
  { src: `${BASE}minjasafn/brakeout-800.jpg`, alt: 'Börn leysa þrautir við borð í safnfræðslu, með blöðum, kortum og læstum kassa' },
  { src: `${BASE}minjasafn/spengja-800.jpg`, alt: 'Spengt leirtau á sýningu: skál og bolli sem gert hefur verið við með vír' },
] as const

/* Gripur mánaðarins — real, running series on minjasafn.is. Months only,
   object names are NOT invented for the photos. */
export const GRIPIR = [
  { month: 'MAÍ', src: `${BASE}minjasafn/gripur-mai.jpg`, alt: 'Gripur mánaðarins í maí úr safnkosti Minjasafns Austurlands' },
  { month: 'APRÍL', src: `${BASE}minjasafn/gripur-apr.jpg`, alt: 'Gripur mánaðarins í apríl úr safnkosti Minjasafns Austurlands' },
  { month: 'MARS', src: `${BASE}minjasafn/gripur-mars.jpg`, alt: 'Gripur mánaðarins í mars úr safnkosti Minjasafns Austurlands' },
  { month: 'FEBRÚAR', src: `${BASE}minjasafn/gripur-feb.jpg`, alt: 'Gripur mánaðarins í febrúar úr safnkosti Minjasafns Austurlands' },
  { month: 'JANÚAR', src: `${BASE}minjasafn/gripur-jan.jpg`, alt: 'Gripur mánaðarins í janúar úr safnkosti Minjasafns Austurlands' },
  { month: 'NÓVEMBER', src: `${BASE}minjasafn/gripur-nov.jpg`, alt: 'Gripur mánaðarins í nóvember úr safnkosti Minjasafns Austurlands' },
  { month: 'OKTÓBER', src: `${BASE}minjasafn/gripur-okt.jpg`, alt: 'Gripur mánaðarins í október úr safnkosti Minjasafns Austurlands' },
  { month: 'SEPTEMBER', src: `${BASE}minjasafn/gripur-sept.jpg`, alt: 'Gripur mánaðarins í september úr safnkosti Minjasafns Austurlands' },
] as const

/* ── hero strata — the dig is through TIME, which is real, not invented
      soil science. Top layer is today; the deepest layer is the letter. ── */
export const STRATA = [
  { label: '2026 · SAFNIÐ Í DAG' },
  { label: '1943 · SAFNIÐ STOFNAÐ' },
  { label: '1942 · BRÉFIÐ' },
] as const

/* ── opening hours — verified 2026-08-02 on minjasafn.is ──
   Winter, Sept 1 to May 31: Tue to Fri 11:00 to 16:00 (closed Sat to Mon).
   Summer, Jun 1 to Aug 31: Mon to Fri 10:00 to 17:00, Sat 11:00 to 17:00
   (closed Sun).
   Iceland runs UTC year round (no DST), so the UTC fields of any Date ARE
   Iceland local time. Pure function, directly evaluable in QA. */
export type OpenState = {
  open: boolean
  /** today's hours as a display string, or null when closed all day */
  todays: string | null
  season: 'sumar' | 'vetur'
}

export function openState(now: Date): OpenState {
  const m = now.getUTCMonth() // 0..11
  const day = now.getUTCDay() // 0 Sun .. 6 Sat
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes()
  const summer = m >= 5 && m <= 7 // Jun, Jul, Aug
  let from = -1
  let to = -1
  if (summer) {
    if (day >= 1 && day <= 5) {
      from = 10 * 60
      to = 17 * 60
    } else if (day === 6) {
      from = 11 * 60
      to = 17 * 60
    }
  } else {
    if (day >= 2 && day <= 5) {
      from = 11 * 60
      to = 16 * 60
    }
  }
  const fmt = (v: number) => `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`
  return {
    open: from >= 0 && mins >= from && mins < to,
    todays: from >= 0 ? `${fmt(from)}–${fmt(to)}` : null,
    season: summer ? 'sumar' : 'vetur',
  }
}

export const HOURS = {
  winter: { label: 'Vetur · 1. sept til 31. maí', rows: [['Þri til fös', '11:00–16:00'], ['Lau til mán', 'Lokað']] },
  summer: { label: 'Sumar · 1. júní til 31. ágúst', rows: [['Mán til fös', '10:00–17:00'], ['Laugardagar', '11:00–17:00'], ['Sunnudagar', 'Lokað']] },
} as const

export const ADMISSION = [
  ['Almennur aðgangur', '1.800 kr'],
  ['Eldri borgarar, námsmenn, öryrkjar', '1.200 kr'],
  ['17 ára og yngri', 'Frítt'],
  ['Hópar, 10 manns eða fleiri', '1.200 kr'],
  ['Hljóðleiðsögn', '400 kr'],
] as const

export const CONTACT = {
  address: 'Laufskógar 1, 700 Egilsstaðir',
  email: 'minjasafn@minjasafn.is',
  emailHref: 'mailto:minjasafn@minjasafn.is',
  website: 'https://www.minjasafn.is',
  websiteDisplay: 'minjasafn.is',
} as const

/* ── the two permanent exhibitions — real copy, real credits ── */
export const EXHIBITIONS = [
  {
    id: 'hreindyrin',
    title: 'Hreindýrin á Austurlandi',
    img: IMG.hreindyrSyning,
    body: 'Grunnsýning opnuð sumarið 2015 um lífshætti og lífsbaráttu hreindýranna, sögu hreindýraveiða og nýtingu afurðanna. Á sýningunni má sjá kvikmynd Eðvarðs Sigurgeirssonar frá 5. áratugnum, nýja teiknimynd Láru Garðarsdóttur um hreinreið Bjarts í Sumarhúsum og heimildamynd Hjalta Stefánssonar og Heiðar Óskar Helgadóttur.',
    credits: 'Höfundur sýningar: Unnur Birna Karlsdóttir · Hönnun: Björn G. Björnsson',
    href: 'https://minjasafn.is/syningar/grunnsyningar/91-hreindyrin-a-austurlandi',
  },
  {
    id: 'sjalfbaer',
    title: 'Sjálfbær eining',
    img: IMG.sjalfbaer,
    /* hard bottom crop: the barrels/churn detail, NOT the staircase framing
       the hero already used — the same file must not read as the hero rerun */
    imgPosition: 'center 88%',
    body: 'Hvert íslenskt sveitaheimili þurfti að vera sjálfu sér nægt um fæði, klæði, áhöld, verkfæri og húsaskjól. Sýningin dregur fram gripi úr sögu byggðar á Austurlandi og sýnir hvernig heimilið var sjálfbær eining.',
    credits: null,
    href: 'https://minjasafn.is/syningar/grunnsyningar/90-sjalfbaer-eining',
  },
] as const

/* ── the founding story — from minjasafn.is/um-safnid/saga-safnsins ── */
export const TIMELINE = [
  {
    year: '1942',
    text: 'Fundur í Atlavík. Undirbúningsnefnd skipuð, í henni sat meðal annarra Gunnar Gunnarsson rithöfundur á Skriðuklaustri.',
  },
  {
    year: '17.11.1942',
    text: 'Söfnun hefst með bréfi þar sem hvert heimili á Austurlandi er beðið að leggja gamla muni af mörkum.',
  },
  {
    year: '1943',
    text: 'Safnið formlega stofnað. Stofnaðilar: Búnaðarsamband Austurlands, Samband austfirskra kvenna og Ungmenna- og íþróttasamband Austurlands.',
  },
  {
    year: 'Í dag',
    text: 'Opinbert byggðasafn Austurlands með aðsetur að Laufskógum 1 á Egilsstöðum.',
  },
] as const

/* ── projects — names only, no invented descriptions. Fjallkonan has no own
      page on minjasafn.is; it is described inside /onnur-verkefni. ── */
export const PROJECTS = [
  { name: 'Fornleifarannsóknir', href: 'https://www.minjasafn.is/verkefni-og-rannsoknir/fornleifarannsoknir' },
  { name: 'Samtímarannsóknir', href: 'https://www.minjasafn.is/verkefni-og-rannsoknir/samtimarannsoknir' },
  { name: 'Sumarhús Kjarvals', href: 'https://www.minjasafn.is/verkefni-og-rannsoknir/sumarhus-kjarvals' },
  { name: 'Fjallkonan', href: 'https://www.minjasafn.is/verkefni-og-rannsoknir/onnur-verkefni' },
] as const

export const LINKS = {
  gripur: 'https://www.minjasafn.is/fraedsla/gripur-manadarins',
  ljosmyndasafn: 'https://www.minjasafn.is/verkefni-og-rannsoknir/ljosmyndasafn-austurlands',
  lindarbakki: 'https://www.minjasafn.is/verkefni-og-rannsoknir/lindarbakki',
  skolaheimsoknir: 'https://www.minjasafn.is/fraedsla/skolaheimsoknir',
  joladagatal: 'https://www.minjasafn.is/fraedsla/joladagatal',
  frodleikur: 'https://www.minjasafn.is/fraedsla/frodleikur',
  /* deep Sarpur links on their homepage are dead — root only, on purpose */
  sarpur: 'https://www.sarpur.is',
  instagram: 'https://www.instagram.com/minjasafnausturlands/',
  facebook: 'https://www.facebook.com/Minjasafn-Austurlands-East-Iceland-Heritage-Museum-397917426945558/',
} as const

export const META = {
  title: 'Minjasafn Austurlands | Byggðasafn á Egilsstöðum, stofnað 1943',
  description:
    'Minjasafn Austurlands á Egilsstöðum: grunnsýningarnar Hreindýrin á Austurlandi og Sjálfbær eining, gripur mánaðarins og Ljósmyndasafn Austurlands með um 80 þúsund myndum. Laufskógar 1, 700 Egilsstaðir.',
} as const

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Museum',
  name: 'Minjasafn Austurlands',
  alternateName: 'East Iceland Heritage Museum',
  foundingDate: '1943',
  email: 'minjasafn@minjasafn.is',
  url: 'https://www.minjasafn.is',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Laufskógar 1',
    postalCode: '700',
    addressLocality: 'Egilsstaðir',
    addressCountry: 'IS',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '11:00',
      closes: '16:00',
      validFrom: '2026-09-01',
      validThrough: '2027-05-31',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '17:00',
      validFrom: '2026-06-01',
      validThrough: '2026-08-31',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '11:00',
      closes: '17:00',
      validFrom: '2026-06-01',
      validThrough: '2026-08-31',
    },
  ],
  sameAs: [
    'https://www.instagram.com/minjasafnausturlands/',
    'https://www.facebook.com/Minjasafn-Austurlands-East-Iceland-Heritage-Museum-397917426945558/',
  ],
} as const

/* ── dashboard entry — shape kept intact ── */
export const companyEntry: PreviewCompany = {
  slug: 'minjasafn',
  route: '/preview/minjasafn',
  name: 'Minjasafn Austurlands',
  sector: 'Minjasafn · stofnað 1943',
  location: 'Laufskógar 1, 700 Egilsstaðir',
  region: 'Austurland',
  established: 'Opinbert safn, stofnað 1943',
  currentUrl: 'https://minjasafn.is',
  ownerEmail: 'minjasafn@minjasafn.is',
  concept: 'Jarðlög',
  conceptTagline:
    'Lag fyrir lag. Lóðrétt uppgraftarafhjúpun byggð á torfbyggingararfinum úr Sjálfbærri einingu.',
  accent: '#9C6346',
  dark: true,
  status: 'Concept ready',
  thumb: '/minjasafn/grunnsyning-sjalfbaer.jpg',
  ownPhotography: true,
  audit: {
    strengths: ['Stofnað 1943, raunveruleg saga', 'Ljósmyndasafn með um 80 þúsund myndum', 'Gripur mánaðarins, virk miðlun'],
    weaknesses: ['Joomla vefur án h1', 'Dauður Sarpur-tengill á forsíðu', 'Sýningar settar fram sem textalisti'],
    opportunities: ['Jarðlaga-afhjúpun úr torfarfinum', 'Gripur mánaðarins sem lifandi eining'],
  },
  positioning:
    'Byggðasafn með 83 ára sögu og 80 þúsund mynda ljósmyndasafn, en vefurinn felur hvort tveggja. Endurhönnunin grefur sig niður í gegnum lögin, eins og safnkosturinn varð til.',
  outreach: { subject: '', body: '' },
}
