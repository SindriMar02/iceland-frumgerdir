import type { PreviewCompany } from '../company-types'

/* Listasafnið á Akureyri — facts verified 2026-08-02 against listak.is (live).
   BUILD AGENT: replace/extend this file wholesale; keep the export names. */

export const companyEntry: PreviewCompany = {
  slug: 'listak',
  route: '/preview/listak',
  name: 'Listasafnið á Akureyri',
  sector: 'Listasafn · 9 sýningar samtímis',
  location: 'Kaupvangsstræti 8, 600 Akureyri',
  region: 'Norðurland',
  established: 'Opinbert safn, Akureyrarbær',
  currentUrl: 'https://www.listak.is',
  ownerEmail: 'listak@listak.is',
  concept: 'Sýningargangurinn',
  conceptTagline:
    'Ein samfelld ganga í gegnum níu sýningar. Láréttur sýningargangur með dýptarskerpu, í stað spjaldanets.',
  accent: '#C03E31',
  dark: false,
  status: 'Concept ready',
  thumb: '/listak/show-zimoun.jpg',
  ownPhotography: true,
  audit: {
    strengths: ['Níu sýningar í gangi samtímis', 'Virk Instagram myndasöfnun', 'Ketilkaffi og Ketilhús á staðnum'],
    weaknesses: ['Engin viewport meta, vefur óskalanlegur í síma', 'Opnunartímar hvergi á forsíðu', 'Vefur frá 2014 á Moya'],
    opportunities: ['Sýningargangur með sal-merkingum', 'Lifandi stöðulína fyrir opnun dagsins'],
  },
  positioning:
    'Eina listasafnið á landsbyggðinni með níu sýningar samtímis, en vefurinn frá 2014 sýnir þær sem textalista. Endurhönnunin gengur í gegnum sýningarnar eins og gestur gengur um húsið.',
  outreach: { subject: '', body: '' },
}

/* ── Contact & meta (all real, verified 2026-08-02) ─────────────────────── */

export const META = {
  title: 'Listasafnið á Akureyri · Níu sýningar undir einu þaki',
  description:
    'Listasafnið á Akureyri, Kaupvangsstræti 8. Níu sýningar í tólf sölum, Ketilhús og Ketilkaffi. Opið alla daga: sumar 10:00 til 17:00, vetur 12:00 til 17:00.',
}

export const ADDRESS = 'Kaupvangsstræti 8, 600 Akureyri'
export const PHONE_DISPLAY = '461 2610'
export const PHONE_HREF = 'tel:+3544612610'
export const EMAIL = 'listak@listak.is'
export const EMAIL_HREF = 'mailto:listak@listak.is'
export const SITE_URL = 'https://www.listak.is'
export const INSTAGRAM_URL = 'https://www.instagram.com/listak.is'
/* Exact slugs for Facebook and the póstlisti page were not verified — the
   Facebook slug mirrors the verified Instagram handle; póstlisti goes to the
   site root where their „Skrá á póstlista" nav entry lives. */
export const FACEBOOK_URL = 'https://www.facebook.com/listak.is'
export const NEWSLETTER_URL = 'https://www.listak.is'

export const TAGLINE = 'Ein samfelld ganga í gegnum níu sýningar.'

/* ── Opening hours — the real rules, computed live (Iceland is UTC+0 all
   year, so UTC getters are Iceland time). Sept 1 to May 31: 12:00–17:00
   daily; Jun 1 to Aug 31: 10:00–17:00 daily; closed Dec 24, 25, 31, Jan 1. */

export interface OpenStatus {
  open: boolean
  closedDay: boolean
  hoursLabel: string
  summer: boolean
}

export function openStatus(now: Date = new Date()): OpenStatus {
  const m = now.getUTCMonth() + 1
  const d = now.getUTCDate()
  const t = now.getUTCHours() + now.getUTCMinutes() / 60
  const closedDay =
    (m === 12 && (d === 24 || d === 25 || d === 31)) || (m === 1 && d === 1)
  const summer = m >= 6 && m <= 8
  const opensAt = summer ? 10 : 12
  const open = !closedDay && t >= opensAt && t < 17
  return {
    open,
    closedDay,
    summer,
    hoursLabel: `${summer ? '10:00' : '12:00'}–17:00`,
  }
}

export const HOURS_RECAP = [
  { label: 'Sumar, 1. júní til 31. ágúst', value: '10:00–17:00 alla daga' },
  { label: 'Vetur, 1. september til 31. maí', value: '12:00–17:00 alla daga' },
  { label: 'Lokað', value: '24., 25. og 31. desember og 1. janúar' },
]

export const ADMISSION = [
  { label: 'Almennt', value: '2.400 kr.' },
  { label: 'Námsmenn og 67 ára og eldri', value: '1.200 kr.' },
  { label: '18 ára og yngri', value: 'Frítt' },
  { label: 'Öryrkjar', value: 'Frítt' },
  { label: 'Árskort', value: '5.700 kr.' },
]

/* ── The nine current shows — ALL REAL, verified 2026-08-02 from their own
   show pages. Hall order = walking order through the building. ───────────── */

/* RESOLUTION IS A FACT, NOT A PREFERENCE (measured 2026-08-03 from the files
   in public/listak, `sips -g pixelWidth`). Six of the nine images the museum
   publishes are small — several are screenshots they uploaded themselves, and
   the museum's own server has nothing larger (checked). So the layout follows
   the resolution instead of stretching the resolution to fill a layout: no
   image on this page is ever drawn wider than its own pixels. */

export interface Show {
  key: string
  artist: string
  title: string
  dates: string | null
  datesNote?: string
  chip: string
  img: string
  alt: string
  fact: string
  /** TRUE intrinsic width/height of the LARGEST candidate actually served for
      `img`, in pixels. This is the hard ceiling for the rendered width. */
  natW: number
  natH: number
  /** the honest resolution tier, DERIVED from natW — it picks the composition:
      'mini'  under  400px → small mounted plate, type carries the panel
      'small' under 1000px → wall-label composition, plate well under 1:1
      'full'  1300px+      → the large drift frame, which draws ~1.42x its own
                             box (cover overhang x parallax scale) and so needs
                             real pixels behind it */
  plate: 'mini' | 'small' | 'full'
  /** only consulted for plate === 'full' */
  layout?: 'std' | 'wide'
  /** optional 800px-wide variant for srcset (phones must not pull ~1400px JPGs) */
  img800?: string
}

export const SHOWS: Show[] = [
  {
    key: 'fugl',
    artist: 'Örlygur Kristfinnsson',
    title: 'Sýning um heilagan fugl',
    dates: '16.05.–06.09.2026',
    chip: 'SALUR 01',
    img: 'show-fugl.jpg',
    alt: 'Vatnslitaverk eftir Örlyg Kristfinnsson á sýningunni Sýning um heilagan fugl',
    fact: 'F. á Siglufirði 1949 · vatnslitir',
    natW: 702,
    natH: 608,
    plate: 'small',
  },
  {
    key: 'silica',
    artist: 'Hulda Rós Guðnadóttir',
    title: 'S-I-L-I-C-A-0-3',
    dates: '16.05.–06.09.2026',
    chip: 'SALIR 02–03A',
    img: 'show-silica.jpg',
    alt: 'Verk eftir Huldu Rós Guðnadóttur á sýningunni S-I-L-I-C-A-0-3',
    fact: 'F. 1973 · býr í Berlín',
    natW: 804,
    natH: 696,
    plate: 'small',
  },
  {
    key: 'magnus',
    artist: 'Magnús Helgason',
    title: 'Andlegar verðmætavindur Magnúsar',
    dates: '16.05.–06.09.2026',
    chip: 'SALIR 04–05',
    img: 'show-magnus.jpg',
    alt: 'Verk eftir Magnús Helgason á sýningunni Andlegar verðmætavindur Magnúsar',
    fact: 'F. 1977 · á Akureyri síðan 2016',
    natW: 782,
    natH: 631,
    plate: 'small',
  },
  {
    key: 'katrin',
    artist: 'Katrín Inga Jónsdóttir Hjördísardóttir',
    title: 'Sjálfsástarvírus – minnisvarði #3',
    dates: null,
    chip: 'SALUR 06 + SVALIR',
    img: 'show-katrin.jpg',
    alt: 'Sjálfsástarvírus, minnisvarði #3: verk úr málmi, neoni og steypu eftir Katrínu Ingu Jónsdóttur Hjördísardóttur',
    fact: 'Málmur, neon, steypa',
    natW: 250,
    natH: 313,
    plate: 'mini',
  },
  {
    key: 'hughrif',
    artist: '',
    title: 'Hughrif – Litir – Form I',
    dates: '28.03.–16.08.2026',
    datesNote: 'Hluti II: 29.08.2026–07.03.2027',
    chip: 'SALUR 07',
    img: 'show-hughrif.jpg',
    alt: 'Verk úr safneign á sýningunni Hughrif, Litir, Form I',
    fact: 'Valin verk úr safneign',
    natW: 822,
    natH: 655,
    plate: 'small',
  },
  {
    key: 'eirikur',
    artist: 'Eiríkur Páll Sveinsson',
    title: 'Saga Íslands: 2. hluti',
    dates: '28.03.–16.08.2026',
    chip: 'SALUR 08',
    img: 'show-eirikur-1400.jpg',
    img800: 'show-eirikur-800.jpg',
    alt: 'Verk eftir Eirík Pál Sveinsson á sýningunni Saga Íslands: 2. hluti',
    fact: 'Læknirinn sem prentaði út internetið',
    /* the untouched original is 2000x1130; 1400 is the largest candidate we
       serve, so 1400 is the ceiling the layout must respect */
    natW: 1400,
    natH: 791,
    plate: 'full',
    layout: 'wide',
  },
  {
    key: 'ulfur',
    artist: 'Úlfur Logason',
    title: 'Guð launi þér',
    dates: '28.03.–16.08.2026',
    chip: 'SALUR 09',
    img: 'show-ulfur.jpg',
    alt: 'Verk eftir Úlf Logason á sýningunni Guð launi þér',
    fact: 'F. 1997 · fyrsta einkasýning á opinberu safni',
    natW: 789,
    natH: 679,
    plate: 'small',
  },
  {
    key: 'zimoun',
    artist: 'ZIMOUN',
    title: 'ZIMOUN',
    dates: '04.06.–06.09.2026',
    chip: 'SALIR 10–11',
    img: 'show-zimoun.jpg',
    alt: 'Hljóðinnsetning eftir ZIMOUN í sölum 10 og 11: skúlptúrar úr ljósum viði í hvítum sal',
    fact: 'Svissneskur hljóðskúlptúristi, f. 1977',
    natW: 1300,
    natH: 867,
    plate: 'full',
    layout: 'wide',
  },
  {
    key: 'kristin',
    artist: 'Kristín Gunnlaugsdóttir',
    title: 'Ný aðföng í safneign',
    dates: '18.05.–06.09.2026',
    chip: 'SALUR 12',
    img: 'show-kristin-1400.jpg',
    img800: 'show-kristin-800.jpg',
    alt: 'Verk eftir Kristínu Gunnlaugsdóttur á sýningunni Ný aðföng í safneign',
    fact: 'Fimm ný verk í safneign',
    /* original 2000x1650; 1400 is the largest candidate served */
    natW: 1400,
    natH: 1155,
    plate: 'full',
    layout: 'std',
  },
]

/* ── Framundan — real upcoming titles from their own nav; no dates were
   published on the overview, so titles only. ─────────────────────────────── */

export const UPCOMING = [
  'Í snertingu',
  'Hversdagsland',
  'AURORA – Vatnslitahátíð Íslands 1/3',
  'Söngskemmtun, saumur, ló og þvottaleiðbeiningar',
  'Í skugga átaka',
  'Svartur blettur',
  'A! Gjörningahátíð',
  'Boreal Screendance Festival 2026',
  'Aðventusýning',
]

/* ── Fræðsla — real programs from their nav, one line each, nothing
   invented beyond what the nav names say. ────────────────────────────────── */

export const EDUCATION = [
  { title: 'Safnfræðsla', line: 'Skólaheimsóknir' },
  { title: 'Leiðsögn og fjölskylduleiðsögn', line: 'Bókanleg leiðsögn' },
  { title: 'Þriðjudagsfyrirlestrar', line: 'Fyrirlestraröð á þriðjudögum' },
]

/* ── HÚSIÐ — hall index ───────────────────────────────────────────────────
   Which of the nine shows sits in which of the twelve halls. Derived ONLY
   from the hall chips the museum publishes on its own show pages (see the
   `chip` field on every Show above): "SALUR 01", "SALIR 02–03A",
   "SALIR 04–05", "SALUR 06 + SVALIR", "SALUR 07" … "SALUR 12".
   `showKey: null` renders the honest empty state instead of a guess. */

export interface Hall {
  id: string
  showKey: string | null
}

export const HALLS: Hall[] = [
  { id: '01', showKey: 'fugl' },
  { id: '02', showKey: 'silica' },
  { id: '03', showKey: 'silica' },
  { id: '04', showKey: 'magnus' },
  { id: '05', showKey: 'magnus' },
  { id: '06', showKey: 'katrin' },
  { id: '07', showKey: 'hughrif' },
  { id: '08', showKey: 'eirikur' },
  { id: '09', showKey: 'ulfur' },
  { id: '10', showKey: 'zimoun' },
  { id: '11', showKey: 'zimoun' },
  { id: '12', showKey: 'kristin' },
]

export const HALL_EMPTY = 'Enginn viðburður núna'

/* The museum publishes its own floor plans („Grunnteikningar"). This is the
   real drawing, public/listak/floorplan.jpg, 1547×959.

   HONESTY NOTE (load-bearing, do not "improve" this into a full hotspot map):
   the drawing carries printed red hall numerals for FIVE halls only — 01, 02,
   03, 04 and 05. Halls 06 to 12 do not appear on this sheet at all. The marks
   below are the read-off positions of those five printed numerals, in percent
   of the image box, measured from the file itself. They are label positions,
   NOT surveyed room outlines: no room boundary is asserted anywhere in this
   build, and the twelve-hall grid beside it is drawn as a schematic and is
   labelled as one. */
export const FLOORPLAN = {
  src: 'floorplan.jpg',
  w: 1547,
  h: 959,
  /** halls whose numeral is legibly printed on the sheet */
  marks: [
    { id: '01', x: 73.7, y: 17.9 },
    { id: '02', x: 41.3, y: 57.6 },
    { id: '03', x: 22.4, y: 50.3 },
    { id: '04', x: 16.1, y: 65.9 },
    { id: '05', x: 46.4, y: 82.0 },
  ],
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ArtGallery',
  name: 'Listasafnið á Akureyri',
  url: SITE_URL,
  telephone: '+354 461 2610',
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kaupvangsstræti 8',
    postalCode: '600',
    addressLocality: 'Akureyri',
    addressCountry: 'IS',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '17:00',
      validFrom: '2026-06-01',
      validThrough: '2026-08-31',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '12:00',
      closes: '17:00',
      validFrom: '2026-09-01',
      validThrough: '2027-05-31',
    },
  ],
}
