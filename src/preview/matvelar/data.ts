import type { PreviewCompany } from '../companies'

/**
 * MATVÉLAR OG UMBÚÐIR EHF. — matvelar.is (kt. 641008-1090)
 *
 * Every sentence about the business below is Matvélar og umbúðir's own published
 * copy (matvelar.is, captured 2026-10-01 and 2026-10-02), tidied only for spelling
 * and grammar where marked, or a fact in a public register (Fyrirtækjaskrá:
 * registered 20 October 2008, VSK number 121656, Páll Björnsson managing director).
 * The site publishes no prices, no capacities and no model data, so this prototype
 * has none: nothing about a machine is stated here that Matvélar has not stated.
 * Each family page shows the supplier's paragraph as Matvélar wrote it.
 *
 * Photography: the nine machine and packaging pictures Matvélar itself shows on its
 * own site (supplier product photography). They are the manufacturers' pictures, so
 * their use in a live build needs the suppliers' consent: listed as an open item.
 */

const BASE = import.meta.env.BASE_URL
export const ROUTE = '/preview/matvelar'

export interface Photo {
  src: string
  srcSet?: string
  alt: string
  w: number
  h: number
  /** the background the supplier photographed on, so the tile can match it */
  tone: 'white' | 'grey' | 'dark'
}

const img = (file: string, alt: string, w: number, h: number, tone: Photo['tone'], srcSet?: string): Photo => ({
  src: `${BASE}matvelar/${file}`, srcSet, alt, w, h, tone,
})

export const PHOTO = {
  gea: img('gea-1600.jpg', 'Pökkunarlína frá GEA úr ryðfríu stáli, séð frá hlið, með útfærslu fyrir lofttæmdar umbúðir', 1600, 900, 'grey',
    `${BASE}matvelar/gea-800.jpg 800w, ${BASE}matvelar/gea-1600.jpg 1600w`),
  holac: img('holac.jpg', 'Skurðarvél frá holac úr ryðfríu stáli með snertiskjá og færibandi', 720, 465, 'white'),
  poss: img('poss.jpg', 'Vél frá POSS úr ryðfríu stáli með trekt að ofan fyrir kjöt og bein', 720, 465, 'white'),
  vemag: img('vemag.jpg', 'Pylsusprauta og upphengilína frá Vemag í einni línu', 720, 460, 'white'),
  vetec: img('vetec.jpg', 'Reykofn frá VETEC úr ryðfríu stáli', 720, 465, 'white'),
  wetter: img('wetter.jpg', 'Hakkavélar og farsvélar frá KG Wetter, maður í rauðri svuntu stendur á milli þeirra', 720, 465, 'dark'),
  umb1: img('schur-1.jpg', 'Kjötbiti í lofttæmdum umbúðum', 800, 800, 'white'),
  umb2: img('schur-2.jpg', 'Ostsneiðar í umbúðum með filmu', 800, 800, 'white'),
  umb3: img('schurflexibles.jpg', 'Bakki með skinku, lokaður með filmu', 800, 800, 'white'),
  pylsur: img('pylsur.jpg', 'Hráar og steiktar pylsur raðað á hvítan bakgrunn', 1920, 1075, 'white'),
}

export const PHOTO_CREDIT =
  'Myndir af vélum og umbúðum eru frá framleiðendum og eru af vef Matvéla og umbúða (matvelar.is).'

export const CONTACT = {
  name: 'Matvélar og umbúðir ehf.',
  email: 'pall@matvelar.is',
  phone: '899 6716',
  phoneHref: 'tel:+3548996716',
  kapp: '664 1329',
  kappHref: 'tel:+3546641329',
  address: 'Markarflöt 12',
  postcode: '210 Garðabær',
  kt: '641008-1090',
  vsk: '121656',
}

/* ── the five stages of the line, in the order Matvélar's own text gives ───
   "frá forvinnslu með farsvélum, hakkavélum og afþýðingu í gegnum marineringu
   með saltsprautum og tromlum. Þaðan liggur leiðin í frekari fullvinnslu frá
   formun, brauðun, steikingu og frystingu. Að endingu er það pökkun ásamt
   pökkunarefni." */
export interface Stage {
  id: string
  n: string
  name: string
  /** the statement shown beside the line, built from their sentence */
  line: string
  /** a short list of what happens here, their words */
  steps: string
  families: string[]
  also: string[]
}

export const STAGES: Stage[] = [
  {
    id: 'forvinnsla', n: '01', name: 'Forvinnsla',
    line: 'Frá forvinnslu með farsvélum, hakkavélum og afþýðingu.',
    steps: 'Farsvélar, hakkavélar og afþýðing',
    families: ['farsvelar', 'hakkavelar', 'hogghnifar'],
    also: ['afthyding', 'rifvelar', 'gulasvelar', 'beinaskiljur'],
  },
  {
    id: 'marinering', n: '02', name: 'Marinering',
    line: 'Marinering með saltsprautum og tromlum.',
    steps: 'Saltsprautur og tromlur',
    families: [],
    also: ['saltsprautur', 'tromlur'],
  },
  {
    id: 'skommtun-og-formun', n: '03', name: 'Skömmtun og formun',
    line: 'Skömmtun og formun fyrir stóra framleiðendur og litla.',
    steps: 'Pylsusprautur, formunarvélar og skömmtun',
    families: ['pylsusprautur', 'formunarvelar'],
    also: ['hakkskammtarar', 'deigskammtarar', 'upphengilinur', 'bakkamatarar', 'vogir'],
  },
  {
    id: 'brauthun-og-eldun', n: '04', name: 'Brauðun, eldun og frysting',
    line: 'Brauðun, steiking, reyking og frysting.',
    steps: 'Brauðunarvélar, fulleldunarvélar og reykofnar',
    families: ['reykofnar'],
    also: ['braudunarvelar', 'fulleldunarvelar'],
  },
  {
    id: 'pokkun', n: '05', name: 'Skurður og pökkun',
    line: 'Að endingu pökkun, ásamt pökkunarefni.',
    steps: 'Áleggshnífar, pökkunarvélar og umbúðir',
    families: ['aleggshnifar', 'pokkunarvelar', 'umbudir'],
    also: [],
  },
]

export const stageOf = (id: string) => STAGES.find((s) => s.id === id)
export const stageOfFamily = (slug: string) => STAGES.find((s) => s.families.includes(slug))

/* ── suppliers: their paragraphs, verbatim ──────────────────────────────── */
export interface Supplier {
  id: string
  name: string
  url: string
  text: string
  logo: string
  logoAlt: string
  photos: Photo[]
  families: string[]
  /** the lead-in line used on cards */
  tag: string
}

export const SUPPLIERS: Supplier[] = [
  {
    id: 'vemag', name: 'VEMAG', url: 'https://www.vemag.com/',
    text: 'Þýskur leiðtogi á sínu sviði sem framleiðir vélar til skömmtunar hvers konar svo sem pylsusprautur, upphengilínur, hakkskammtara, formunarvélar, deigskammtara, bakkamatara og vogir. Getum boðið upp á vélar sem henta bæði stórum og litlum framleiðendum.',
    logo: `${BASE}matvelar/logos/vemag_logo.png`, logoAlt: 'VEMAG', photos: [PHOTO.vemag],
    families: ['pylsusprautur', 'formunarvelar'], tag: 'Skömmtun og formun',
  },
  {
    id: 'gea', name: 'GEA', url: 'https://www.gea.com/',
    text: 'Sannkallaður risi á heimsvísu í framleiðslu á vélum fyrir matvælaframleiðendur. Í raun hægt að segja að flestir íslendingar neyti matvöru sem hefur farið í gegnum vélar GEA á hverjum degi. Nægir þar að nefna formunarvélar, brauðunarvélar, fulleldunarvélar, farsvélar, áleggshnífa og pökkunarvélar.',
    logo: `${BASE}matvelar/logos/GEA_Group.png`, logoAlt: 'GEA Group', photos: [PHOTO.gea],
    families: ['formunarvelar', 'farsvelar', 'aleggshnifar', 'pokkunarvelar'], tag: 'Heil framleiðslulína',
  },
  {
    id: 'kg-wetter', name: 'KG Wetter', url: 'http://www.kgwetter.de',
    text: 'Þýskur framleiðandi á litlum og miðlungsstórum farsvélum og hakkavélum. Frábært úrval véla fyrir feskt og frosið hráefni. Þessar vélar hafa verið á íslenskum markaði í yfir 20 ár og reynst frábærlega.',
    logo: `${BASE}matvelar/logos/kg-wetter.png`, logoAlt: 'KG Wetter', photos: [PHOTO.wetter],
    families: ['farsvelar', 'hakkavelar'], tag: 'Farsvélar og hakkavélar',
  },
  {
    id: 'holac', name: 'holac', url: 'http://www.holac.de',
    text: 'Þýskur framleiðandi á rifvélum, högghnífum og gúllasvélum. Framúrskarandi vélar sem hafa sannað ágæti sitt á Íslandi í fjöldamörg ár.',
    logo: `${BASE}matvelar/logos/holac.png`, logoAlt: 'holac', photos: [PHOTO.holac],
    families: ['hogghnifar'], tag: 'Rifvélar, högghnífar og gúllasvélar',
  },
  {
    id: 'vetec', name: 'VETEC', url: 'http://www.vetec.com',
    text: 'Þýskur framleiðandi á framúrskarandi reykofnum og reykjörum. Fyrir reykingu, þurrkun, eldun, suðu og kælingu ásamt moðnunarklefum.',
    logo: `${BASE}matvelar/logos/vetec_logo.png`, logoAlt: 'VETEC', photos: [PHOTO.vetec],
    families: ['reykofnar'], tag: 'Reykofnar',
  },
  {
    id: 'poss', name: 'POSS', url: 'http://poss-separators.com',
    text: 'Kanadískur framleiðandi á vélum sem skilja kjöt frá beinum með vélrænum hætti. Leiðtogi á heimsvísu á þessum markaði.',
    logo: `${BASE}matvelar/logos/poss-logo.png`, logoAlt: 'POSS', photos: [PHOTO.poss],
    families: [], tag: 'Beinaskiljur',
  },
  {
    id: 'adapa', name: 'Adapa', url: 'http://www.adapa-group.com/',
    text: 'Einn af stærstu framleiðendum heims á sviði umbúða. Margar verksmiðjur sem framleiða mismunandi filmur svo sem mjúkar filmur, harðar filmur, herpifilmur og prentaðar filmur. Umhverfisvænar filmur eru sífellt að verða stærri hluti af þeirra framleiðslu.',
    logo: `${BASE}matvelar/logos/adapa.svg`, logoAlt: 'Adapa', photos: [PHOTO.umb3, PHOTO.umb1, PHOTO.umb2],
    families: ['umbudir'], tag: 'Umbúðir og filmur',
  },
]

export const supplierById = (id: string) => SUPPLIERS.find((s) => s.id === id)

/* ── the eight machine families of their headline, plus Umbúðir ─────────── */
export interface Family {
  slug: string
  name: string
  /** accusative as their headline has it: "Við seljum …" */
  sell: string
  suppliers: string[]
  photo?: Photo
  /** which station of the drawn line this family sits at (index into STAGES) */
  stage: number
  /** one line for cards, from their text */
  blurb: string
}

export const FAMILIES: Family[] = [
  { slug: 'hakkavelar', name: 'Hakkavélar', sell: 'hakkavélar', suppliers: ['kg-wetter'], photo: PHOTO.wetter, stage: 0,
    blurb: 'Hakkavélar fyrir feskt og frosið hráefni.' },
  { slug: 'farsvelar', name: 'Farsvélar', sell: 'farsvélar', suppliers: ['kg-wetter', 'gea'], photo: PHOTO.wetter, stage: 0,
    blurb: 'Litlar og miðlungsstórar farsvélar, og farsvélar frá GEA.' },
  { slug: 'hogghnifar', name: 'Högghnífar', sell: 'högghnífa', suppliers: ['holac'], photo: PHOTO.holac, stage: 0,
    blurb: 'Högghnífar, rifvélar og gúllasvélar frá holac.' },
  { slug: 'pylsusprautur', name: 'Pylsusprautur', sell: 'pylsusprautur', suppliers: ['vemag'], photo: PHOTO.vemag, stage: 2,
    blurb: 'Pylsusprautur og upphengilínur frá VEMAG.' },
  { slug: 'formunarvelar', name: 'Formunarvélar', sell: 'formunarvélar', suppliers: ['vemag', 'gea'], stage: 2,
    blurb: 'Formunarvélar frá VEMAG og GEA.' },
  { slug: 'reykofnar', name: 'Reykofnar', sell: 'reykofna', suppliers: ['vetec'], photo: PHOTO.vetec, stage: 3,
    blurb: 'Reykofnar og reykjarar frá VETEC.' },
  { slug: 'aleggshnifar', name: 'Áleggshnífar', sell: 'áleggshnífa', suppliers: ['gea'], stage: 4,
    blurb: 'Áleggshnífar frá GEA.' },
  { slug: 'pokkunarvelar', name: 'Pökkunarvélar', sell: 'pökkunarvélar', suppliers: ['gea'], photo: PHOTO.gea, stage: 4,
    blurb: 'Pökkunarvélar frá GEA.' },
  { slug: 'umbudir', name: 'Umbúðir', sell: 'umbúðir', suppliers: ['adapa'], photo: PHOTO.umb3, stage: 4,
    blurb: 'Mjúkar og harðar filmur, herpifilmur og prentaðar filmur.' },
]

export const familyBySlug = (slug: string) => FAMILIES.find((f) => f.slug === slug)

/* ── other machines their supplier paragraphs name, which can go on a request ─ */
export interface Also { id: string; name: string; from: string }
export const ALSO: Also[] = [
  { id: 'afthyding', name: 'Afþýðing', from: 'Forvinnsla' },
  { id: 'rifvelar', name: 'Rifvélar', from: 'holac' },
  { id: 'gulasvelar', name: 'Gúllasvélar', from: 'holac' },
  { id: 'beinaskiljur', name: 'Beinaskiljur', from: 'POSS' },
  { id: 'saltsprautur', name: 'Saltsprautur', from: 'Marinering' },
  { id: 'tromlur', name: 'Tromlur', from: 'Marinering' },
  { id: 'hakkskammtarar', name: 'Hakkskammtarar', from: 'VEMAG' },
  { id: 'deigskammtarar', name: 'Deigskammtarar', from: 'VEMAG' },
  { id: 'upphengilinur', name: 'Upphengilínur', from: 'VEMAG' },
  { id: 'bakkamatarar', name: 'Bakkamatarar', from: 'VEMAG' },
  { id: 'vogir', name: 'Vogir', from: 'VEMAG' },
  { id: 'braudunarvelar', name: 'Brauðunarvélar', from: 'GEA' },
  { id: 'fulleldunarvelar', name: 'Fulleldunarvélar', from: 'GEA' },
]

export const alsoById = (id: string) => ALSO.find((a) => a.id === id)

/* ── their customers, in their words ───────────────────────────────────── */
export const SECTORS = [
  { id: 'kjot', name: 'Kjötvinnslur', ask: 'kjötvinnslu' },
  { id: 'fiskur', name: 'Fiskvinnslur', ask: 'fiskvinnslu' },
  { id: 'kjuklingur', name: 'Kjúklingaframleiðendur', ask: 'kjúklingaframleiðslu' },
  { id: 'bakari', name: 'Iðnaðarbakarí', ask: 'iðnaðarbakarí' },
  { id: 'mjolk', name: 'Mjólkuriðnaður', ask: 'mjólkuriðnað' },
]

export const ABOUT = [
  'Við erum fyrirtæki með margra ára reynslu á sviði sölu og þjónustu við matvælaiðnaðinn í landinu. Við erum í samstarfi við mörg af fremstu fyrirtækjum í heiminum á þessu sviði. Nægir þar að nefna Vemag og GEA sem er samsteypa yfir tuttugu áður heimsþekktra fyrirtækja er hafa verið keypt upp undir merkjum GEA til að þjóna viðskiptavinum sínum sem allra best.',
  'Er svo komið að við getum þjónað okkar viðskiptavinum frá forvinnslu með farsvélum, hakkavélum og afþýðingu í gegnum marineringu með saltsprautum og tromlum. Þaðan liggur leiðin í frekari fullvinnslu frá formun, brauðun, steikingu og frystingu. Að endingu er það pökkun ásamt pökkunarefni.',
  'Fyrir minni vinnslur erum við með smærri tæki frá t.d. Vemag og KG Wetter þannig getum við sagt að við vöxum með viðskiptavinum okkar en þeir eru kjötvinnslur, fiskvinnslur, kjúklingaframleiðendur, iðnaðarbakarí og mjólkuriðnaðurinn. Matvælaiðnaðurinn í dag endurspeglar sífellt auknar kröfur neytendans um einfaldar leiðir í framreiðslu á mat. Þægindamatur er lykilorð samtímans í dag.',
]

export const TRIAL_TEXT =
  'Við bjóðum viðskiptavinum okkar upp á að gera prufur erlendis með vélum frá birgjum og hráefni frá viðskiptavinum okkar. Bjóðum einnig upp á ýmis námskeið á vegum birgja.'

export const SERVICE_TEXT =
  'Matvélar og samstarfsaðilar okkar þjóna viðskiptavinum sínum með uppsetningu nýrra véla og kennslu á vélum ásamt viðhaldi og varahlutapöntunum.'

/** what a service request needs, so the first reply can be an answer */
export const SERVICE_READY = [
  { k: 'Framleiðandi og gerð', v: 'Til dæmis VEMAG eða KG Wetter og gerðarheiti vélarinnar.' },
  { k: 'Raðnúmer', v: 'Ef þú hefur það við höndina, oftast á skilti á vélinni.' },
  { k: 'Hvað er að, eða hvað vantar', v: 'Bilun, varahlutur, viðhald, uppsetning eða kennsla.' },
  { k: 'Mynd', v: 'Af vélinni, bilunarboði eða varahlutnum, ef þú getur.' },
]

/* ── the page-level facts the audit rests on ───────────────────────────── */
export const companyEntry: PreviewCompany = {
  slug: 'matvelar',
  route: ROUTE,
  name: 'Matvélar og umbúðir ehf.',
  sector: 'Matvælavélar, umbúðir og þjónusta',
  location: 'Garðabær',
  region: 'Höfuðborgarsvæðið',
  established: 'Skráð 2008, sala og þjónusta við matvælaiðnaðinn',
  currentUrl: 'https://matvelar.is',
  ownerEmail: CONTACT.email,
  concept: 'Frá forvinnslu til pökkunar',
  conceptTagline:
    'Ný vél eða vél í notkun: hvor leiðin sem er þá kemur fyrirspurnin tilbúin, með gerð, raðnúmeri og mynd, svo fyrsta svarið geti verið svar en ekki spurningar.',
  accent: '#576a7c',
  dark: true,
  status: 'Concept ready',
  thumb: `${BASE}matvelar/gea-800.jpg`,
  ownPhotography: true,
  photoCredit: PHOTO_CREDIT,
  audit: {
    strengths: [
      'Sala og þjónusta við matvælaiðnaðinn, með sjö birgja sem vefurinn nefnir: VEMAG, GEA, KG Wetter, holac, VETEC, POSS og Adapa',
      'Vefurinn lýsir allri línunni, frá forvinnslu með farsvélum og hakkavélum, í gegnum marineringu, formun og eldun, til pökkunar og pökkunarefnis',
      'Prufur erlendis með vélum birgja og hráefni viðskiptavinar, og námskeið á vegum birgja, eru þegar í boði',
    ],
    weaknesses: [
      'Engin leið til að senda fyrirspurn: vefurinn hefur engin eyðublöð og enga síma- eða tölvupósttengla, símanúmerin eru aðeins texti',
      'Þjónusta og varahlutir eru tvær línur með nöfnum og símanúmerum, án þess að segja hvað þarf að fylgja: gerð, raðnúmer, lýsing á bilun eða mynd',
      'Vefurinn er ein síða og vélarnar eru aðeins nafnalisti í fyrirsögn, ekkert af þeim hefur sína eigin síðu sem leitarvél eða viðskiptavinur getur fundið',
      'Síðan er merkt sem tungumálalaus (lang „zxx“), myndirnar eru án lýsingartexta, hana vantar kort fyrir leitarvélar (engin sitemap.xml eða robots.txt) og hún notar jQuery 3.0.0 frá 2016',
    ],
    opportunities: [
      'Tvær leiðir inn: ný vél eða ráðgjöf, og vél í notkun með þjónustu eða varahlutum',
      'Fyrirspurnalisti: viðskiptavinur safnar vélum og sendir eina, tilbúna fyrirspurn',
      'Hver vélafjölskylda fær sína eigin síðu með texta birgjans og stað í framleiðslulínunni',
    ],
  },
  positioning:
    'Matvélar og umbúðir selja og þjónusta vélar fyrir kjötvinnslur, fiskvinnslur, kjúklingaframleiðendur, iðnaðarbakarí og mjólkuriðnaðinn. Frumgerðin byggir á þeirra eigin orðum og eigin myndum: framleiðslulínan frá forvinnslu til pökkunar, hver vélafjölskylda á sinni síðu og tvær leiðir inn, ný vél eða þjónusta, sem skila fyrirspurn með þeim upplýsingum sem starfsmaður þarf til að svara.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Matvélar og umbúðir',
    body: '[HLEKKUR Á FRUMGERÐ]\n\n(Drög, textinn er skrifaður þegar úttekt lýkur.)',
  },
}
