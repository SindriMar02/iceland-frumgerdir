import type { PreviewCompany } from '../companies'

/**
 * SAMHENTIR KASSAGERÐ HF. — samhentir.is (kt. 560196-2299) and the companies it owns:
 * Vörumerking (vorumerking.is), Plastco (plastco.is), Formar (formar.is).
 *
 * Every sentence about the business below is the group's own published copy (samhentir.is,
 * plastco.is, vorumerking.is, formar.is and Samhentir's article of 9 October 2026, all captured
 * 2026-10-14), tidied only for spelling and grammar where marked [lagað], or a fact in a public
 * register (Fyrirtækjaskrá: Samhentir Kassagerð hf. registered 16 January 1996, VSK number 49126).
 * No prices, capacities or specs are published, so none are shown. Machine model names are
 * Plastco's own catalogue; where Plastco does not name the maker, neither does this page.
 *
 * Photography: Samhentir's own packshots and building photo; Vörumerking's own press and
 * label pictures; Plastco's machine pictures (manufacturer photography: their use in a live
 * build needs the suppliers' consent, listed as an open item).
 */

const BASE = import.meta.env.BASE_URL
export const ROUTE = '/preview/samhentir'

export interface Photo {
  src: string
  srcSet?: string
  alt: string
  w: number
  h: number
  /** a cut-out on transparent ground sits on the board; a photo fills its frame */
  tone: 'cut' | 'photo'
}

const img = (key: string, alt: string, w: number, h: number, tone: Photo['tone'], sizes: number[]): Photo => ({
  src: `${BASE}samhentir/img/${key}-${sizes[sizes.length - 1]}.webp`,
  srcSet: sizes.length > 1 ? sizes.map((s) => `${BASE}samhentir/img/${key}-${s}.webp ${s}w`).join(', ') : undefined,
  alt, w, h, tone,
})

export const PHOTO = {
  oskjur: img('oskjur-sjavarutvegur', 'Prentaðar öskjur fyrir frosinn fisk, þorsk- og ýsuflök, í nokkrum gerðum og litum', 1134, 1135, 'cut', [800, 1134]),
  kassar: img('kassar-fiskur', 'Tveir prentaðir kassar fyrir frosinn fisk, hvítir og grænbláir', 1194, 1201, 'cut', [800, 1194]),
  coolseal: img('coolseal', 'Coolseal kassi fyrir ferskan fisk, hvítt lok og blár botn úr plastbylgju', 1194, 1201, 'cut', [800, 1194]),
  matvaeli: img('matvaeli', 'Umbúðir fyrir matvæli: öskjur, pokar, ísdollur og súkkulaðiumbúðir', 2439, 2439, 'photo', [800, 1600]),
  sersnidid: img('sersnidid', 'Sérsniðnar lausnir: sýningarstandar, gjafaumbúðir og öskjur', 2439, 2439, 'photo', [800, 1600]),
  almennur: img('almennur', 'Kassar, bréfpokar, límbönd og strekkifilma fyrir almennan iðnað', 2444, 2461, 'photo', [800, 1600]),
  bakari: img('bakari', 'Bréfpokar, kökuöskjur og gluggaöskjur fyrir bakarí', 2444, 2474, 'photo', [800, 1600]),
  rekstrarvorur: img('rekstrarvorur', 'Rekstrarvörur fyrir sjávarútveg: stígvél, hanskar, svunta, karfa og hnífar', 1194, 1201, 'cut', [800, 1194]),
  sigurplast: img('sigurplast', 'Blásnar PET- og HDPE-flöskur og brúsar frá Sigurplasti', 2220, 1498, 'photo', [800, 1600]),
  pappi: img('pappi', 'Bylgjupappi í stafla, séð á kantinn, ofan á plastfilmu', 741, 865, 'cut', [741]),
  rullur: img('merkingar-rullur', 'Límmiðarúllur í prentvél hjá Vörumerkingu', 1920, 715, 'photo', [800, 1600]),
  prentvel: img('vorumerking-prentvel', 'Starfsmaður Vörumerkingar við stafræna prentvél fyrir límmiða', 600, 400, 'cut', [600]),
  hus: img('hus', 'Hús Samhentra við Suðurhraun í Garðabæ', 3106, 1803, 'photo', [800, 1600]),
  kjot: img('kjotidnadur', 'Vörur fyrir kjötvinnslur: hnífar, hanskar, garn og áhöld', 1194, 1201, 'cut', [800, 1194]),
  gardyrkja: img('gardyrkja', 'Garðyrkjuvörur: grasfræ, ræktunarílát, áburður og varnarefni', 1194, 845, 'cut', [800, 1194]),
  dick: img('dick', 'Hnífar frá Friedr. Dick', 1194, 1201, 'cut', [800, 1194]),
  trollakassi: img('trollakassi', 'Tröllakassi úr bylgjupappa á vörubretti', 709, 713, 'cut', [709]),
  bill: img('bill', 'Flutningabíll Samhentra á brú yfir hraðbraut', 600, 400, 'cut', [600]),
  brcgs: img('brcgs', 'BRCGS vottunarmerki fyrir umbúðaefni', 1122, 922, 'photo', [800, 1122]),
}

export const PHOTO_CREDIT =
  'Myndir af umbúðum, húsi og prentvél eru af vefjum Samhentra og Vörumerkingar. Myndir af vélum eru af vef Plastco og eru frá framleiðendum.'

export const SHOP = 'https://verslun.samhentir.is'
export const SHOP_LOGIN = 'https://verslun.samhentir.is/login'

export const CONTACT = {
  name: 'Samhentir Kassagerð hf.',
  email: 'sala@samhentir.is',
  service: 'verk@samhentir.is',
  machines: 'veladeild@samhentir.is',
  phone: '575 8000',
  phoneHref: 'tel:+3545758000',
  address: 'Suðurhraun 4A',
  postcode: '210 Garðabær',
  hours: 'Mánudaga til fimmtudaga 8:00 til 16:00, föstudaga 8:00 til 15:00',
  kt: '560196-2299',
  vsk: '49126',
}

/** service phones outside opening hours, as Plastco publishes them */
export const ON_CALL = [
  { name: 'Stefán Benediktsson', role: 'Sölustjóri véladeildar', phone: '892 0090', href: 'tel:+3548920090' },
  { name: 'Benedikt Stefánsson', role: 'Þjónustusími utan opnunartíma', phone: '894 3400', href: 'tel:+3548943400' },
]

/* ── the group: one house, four companies ───────────────────────────── */
export interface Member {
  id: string
  name: string
  since: string
  /** the year shown big on the card */
  year: string
  what: string
  /** the one line their own site uses about themselves */
  own: string
  joined?: string
  phone: string
  phoneHref: string
  email: string
  url: string
  urlLabel: string
  address: string
}

export const GROUP: Member[] = [
  {
    id: 'samhentir', name: 'Samhentir Kassagerð', year: '1996', since: 'Stofnað 1996',
    what: 'Umbúðir, rekstrarvörur, vélar og viðgerðir, kryddblöndun og formhönnun',
    own: 'Við erum samhentur hópur sérfræðinga sem hefur áratuga reynslu á sviði framleiðslu og umbúða.',
    joined: 'Kassagerð Reykjavíkur, stofnuð 1937, rann inn í Samhenta árið 2020.',
    phone: '575 8000', phoneHref: 'tel:+3545758000', email: 'sala@samhentir.is', url: 'https://samhentir.is', urlLabel: 'samhentir.is', address: 'Suðurhraun 4A, Garðabæ',
  },
  {
    id: 'vorumerking', name: 'Vörumerking', year: '1962', since: 'Stofnað 1962, hluti af Samhentum frá 2012',
    what: 'Límmiðar í allt að 12 litum, stafræn prentun, állok, álþynnur, áprentuð pökkunarfilma og plastkort',
    own: 'Vörumerking framleiðir merkingar á umbúðir úr pappír, plastefnum og álfólíu.',
    joined: 'Sigurplast, stofnað 1960, er hluti af Vörumerkingu frá 1. janúar 2026: blásnar PET- og HDPE-flöskur.',
    phone: '414 2500', phoneHref: 'tel:+3544142500', email: 'vorumerking@vorumerking.is', url: 'https://www.vorumerking.is', urlLabel: 'vorumerking.is', address: 'Suðurhraun 6, Garðabæ',
  },
  {
    id: 'plastco', name: 'Plastco', year: '1988', since: 'Stofnað 1988, hluti af Samhentum frá 2025',
    what: 'Pökkunarvélar, vogir, prentarar og límmiðabúnaður, þjarkar, filmur og bakkar',
    own: 'Plastco þjónustar viðskiptavini við uppsetningu tækja, hugbúnaðar, þjálfun viðskiptavina, varahlutaþjónustu og fleira.',
    phone: '568 0090', phoneHref: 'tel:+3545680090', email: 'plastco@plastco.is', url: 'https://plastco.is', urlLabel: 'plastco.is', address: 'Suðurhraun 4A, Garðabæ',
  },
  {
    id: 'formar', name: 'Formar', year: 'EPS', since: 'Hluti af Samhentum frá 2024',
    what: 'Frauðplastkassar fyrir fiskiðnað og EPS einangrun til húsbygginga',
    own: 'Félagið framleiðir rúmlega 20 mismunandi frauðkassa ásamt því að selja ýmsa fylgihluti fyrir pökkun ferskra fiskafurða.',
    phone: '561 2210', phoneHref: 'tel:+3545612210', email: 'formar@formar.is', url: 'https://formar.is', urlLabel: 'formar.is', address: 'Grænásbraut 501, Reykjanesbæ',
  },
]

export const memberById = (id: string) => GROUP.find((g) => g.id === id)

/* ── the six stations of the drawn line ─────────────────────────────── */
export interface Stage {
  id: string
  n: string
  name: string
  /** which company in the group supplies this step */
  who: string[]
  /** the statement beside the line, from their own text */
  line: string
  /** what is on this step, their words */
  steps: string
  families: string[]
}

export const STAGES: Stage[] = [
  {
    id: 'vinnsla', n: '01', name: 'Vinnsla', who: ['samhentir', 'plastco'],
    line: 'Skurðarvélar, sprautsöltunarvélar og blandarar.',
    steps: 'Kjötsagir, beinasagir, mótunarvélar, formunar- og brauðunarvélar',
    families: ['vinnsluvelar', 'sprautsoltun'],
  },
  {
    id: 'vigtun', n: '02', name: 'Vigtun', who: ['plastco'],
    line: 'Samvalsvogir, gátvogir og málmleit.',
    steps: 'Vogir og skömmtunarbúnaður, málmleitartæki',
    families: ['vogir', 'malmleit'],
  },
  {
    id: 'pokkun', n: '03', name: 'Pökkun', who: ['plastco', 'samhentir'],
    line: 'Sjálfvirkar pökkunarlínur fyrir pokapökkun, bakkapökkun og öskjupökkun.',
    steps: 'Pökkunarvélar, bakkar og filmur',
    families: ['pokkunarvelar'],
  },
  {
    id: 'merking', n: '04', name: 'Merking', who: ['vorumerking', 'plastco'],
    line: 'Límmiðar í allt að 12 litum og prentarar sem merkja á línunni.',
    steps: 'Límmiða- og dagsetningaprentarar, áprentuð pökkunarfilma',
    families: ['prentarar'],
  },
  {
    id: 'kassi', n: '05', name: 'Kassi', who: ['samhentir', 'formar'],
    line: 'Kassar fyrir ferskan, blokkfrystan og lausfrystan fisk.',
    steps: 'Bylgjupappi, vaxbornar öskjur, Coolseal og frauðplastkassar, kassareisarar og kassalokun',
    families: ['kassavelar'],
  },
  {
    id: 'bretti', n: '06', name: 'Bretti', who: ['samhentir', 'plastco'],
    line: 'Strekkifilma, millispjöld og brettavafningsvélar.',
    steps: 'Brettavafning, brettastöflun og þjarkar',
    families: ['brettavelar', 'thjarkar'],
  },
]

export const stageOf = (id: string) => STAGES.find((s) => s.id === id)
export const stageOfFamily = (slug: string) => STAGES.find((s) => s.families.includes(slug))

/* ── machine families: Samhentir's machine lists and Plastco's catalogue ─ */
export interface Model { name: string; img?: string }
export interface Family {
  slug: string
  name: string
  /** accusative: "Fyrirspurn um …" */
  ask: string
  stage: number
  /** who sells and services it in the group */
  unit: 'samhentir' | 'plastco'
  blurb: string
  /** their own lists, verbatim */
  lines: string[]
  makers?: string
  models: Model[]
  /** where the lists come from */
  source: string
}

const V = (n: string) => `${BASE}samhentir/velar/${n}.webp`

export const FAMILIES: Family[] = [
  {
    slug: 'vinnsluvelar', name: 'Skurðar- og vinnsluvélar', ask: 'skurðar- og vinnsluvélar', stage: 0, unit: 'samhentir',
    blurb: 'Skurðarvélar, kjötsagir, beinasagir og mótunarvélar fyrir sjávarútveg og kjötiðnað.',
    lines: ['Skurðarvélar', 'Kjötsagir, beinasagir, mótunarvélar', 'Hakka-, hræri- og matvinnsluvélar og tromlur', 'Pylsusprautun', 'Pokaísetning'],
    models: [], source: 'Vélar og viðgerðir, samhentir.is',
  },
  {
    slug: 'sprautsoltun', name: 'Sprautsöltun og blöndun', ask: 'sprautsöltun og blöndun', stage: 0, unit: 'plastco',
    blurb: 'Sprautusöltunarvélar, blandarar og formunar- og brauðunarvélar fyrir kjöt- og fiskvinnslu.',
    lines: ['Sprautusöltunarvélar', 'Blandarar (tumblers)', 'Formunar- og brauðunarvélar', 'Kjúklingavinnslulínur'],
    models: [], source: 'Þjónusta, plastco.is',
  },
  {
    slug: 'vogir', name: 'Vogir og skömmtun', ask: 'vogir og skömmtun', stage: 1, unit: 'plastco',
    blurb: 'Samvalsvogir, flæðivogir, borðvogir og verðmerkinga- og miðalímingavogir.',
    lines: ['Samvalsvogir', 'Borðvogir og sjálfvirkar flæðivogir', 'Verðmerkinga- og miðalímingavogir', 'Dælur og skammtarar'],
    models: [
      { name: '1214S', img: V('1214s') }, { name: '1010216l', img: V('10102front') }, { name: '1010216l með IQF trog', img: V('10102iqf') },
      { name: '1010216l með Mix trog', img: V('10102mixv3') }, { name: 'ADW O 0316M', img: V('adw') }, { name: 'LI-700', img: V('li700') },
      { name: 'LI-700E', img: V('li700e') }, { name: 'MI-700', img: V('mi700') }, { name: 'WI-700', img: V('wi700') },
      { name: 'WIL-700', img: V('wil700') }, { name: 'WIW-700', img: V('wiw700') }, { name: 'WPI-702', img: V('wpi702') },
    ],
    source: 'Vogir og skömmtunarbúnaður, plastco.is',
  },
  {
    slug: 'malmleit', name: 'Málmleit og gátvogir', ask: 'málmleit og gátvogir', stage: 1, unit: 'plastco',
    blurb: 'Málmleitartæki og gátvogir, og röntgenbúnaður frá Plastco.',
    lines: ['Málmleitartæki og gátvogir', 'Metal detectors', 'X-ray', 'Labelling units'],
    models: [{ name: 'Málmleitartæki', img: V('metaldetectors') }, { name: 'Gátvogir', img: V('gatvogir') }],
    source: 'Annar búnaður og Vogir, plastco.is',
  },
  {
    slug: 'pokkunarvelar', name: 'Pökkunarvélar', ask: 'pökkunarvélar', stage: 2, unit: 'plastco',
    blurb: 'Lóðrétt og lárétt filmupökkun, bakkapökkun og vakúmpökkun.',
    lines: ['Lóðrétt filmupökkun', 'Lárétt filmupökkun', 'Bakkapökkun', 'Vakúmpökkun', 'Thermoformingvélar', 'Skinpackvélar', 'Bakkalokunarvélar'],
    makers: 'Ilapak og Sealpac',
    models: [
      { name: 'Vegatronic 2000 OF', img: V('8e68ab737d2263f0f638cf1023b0c3a0_f44') }, { name: 'Vegatronic 500', img: V('500') }, { name: 'Vegatronic 1000', img: V('1000') },
      { name: 'Delta 500 LDR', img: V('500ldr') }, { name: 'Delta 3000 DC', img: V('3000dc') }, { name: 'Delta 3000 HS', img: V('3000hs') },
      { name: 'Delta 3000 HSR', img: V('3000hsr') }, { name: 'Delta 3000 LD', img: V('3000ld') }, { name: 'Delta 3000 LDR', img: V('3000ldr') },
      { name: 'Delta FloBag', img: V('flobag') }, { name: 'Sealpac A5', img: V('a5') }, { name: 'Sealpac A6', img: V('a6') },
      { name: 'Sealpac A7', img: V('a7') }, { name: 'Sealpac A8', img: V('a8') }, { name: 'Sealpac A10', img: V('a10') },
      { name: 'Sealpac M1', img: V('m1') }, { name: 'Sealpac MX', img: V('MX') }, { name: 'Sealpac RE15', img: V('re15') },
      { name: 'Sealpac RE20', img: V('re20') }, { name: 'Sealpac RE25', img: V('re25') }, { name: 'Sealpac RE30', img: V('re30') },
    ],
    source: 'Pökkunarvélar, plastco.is',
  },
  {
    slug: 'prentarar', name: 'Prentarar og merking', ask: 'prentara og merkingu', stage: 3, unit: 'plastco',
    blurb: 'Bleksprautuprentarar, leysiprentarar, límmiðaprentarar og borðaprentarar sem merkja á línunni.',
    lines: ['Bleksprautuprentarar', 'Leysiprentarar', 'Límmiðaprentarar', 'Borðaprentarar', 'Límmiða- og dagsetningaprentarar'],
    models: [
      { name: 'A520i', img: V('a-series-cij-nml2-a520i-bracket-front') }, { name: 'Ax150i', img: V('ax150-st-angled') }, { name: 'Ax350i', img: V('ax350-7-st-angled') },
      { name: 'Ax550i', img: V('ax550-7-st-angled') }, { name: 'D120i', img: V('d-serieslaserd120iwithcontroller') }, { name: 'D320i', img: V('d-serieslaserd320iip65withcontrollerip55') },
      { name: 'D620i', img: V('d-series-laser-d620i-ip65-controller-touchpanel2') }, { name: 'M230i CW100', img: V('m230i-cw100') }, { name: 'M230i P150i', img: V('m230i-p150-pallet-labeller-stainless-steel') },
      { name: 'M230i T4/T6', img: V('m230i-t4-160mm-50x66') }, { name: 'V120i', img: V('v120ittov-series') }, { name: 'V230i', img: V('v-series-tto-nml2-v230i') },
      { name: 'V320i', img: V('v320i-tto-hero-shot-with-new-touch-panel') }, { name: 'G20i', img: V('g20i-coding-white-boxes-1') }, { name: 'G130i og G320i', img: V('g-series-130i-320i') },
      { name: 'Gx30i', img: V('g-series-tij-gx30i-with-two-heads-nml2') },
    ],
    source: 'Prentarar og límmiðabúnaður, plastco.is',
  },
  {
    slug: 'kassavelar', name: 'Kassareisarar og kassalokun', ask: 'kassareisara og kassalokun', stage: 4, unit: 'samhentir',
    blurb: 'Kassareisarar, kassalokun og kassalímingavélar, og línur fyrir „bag in box“.',
    lines: ['Kassareisari, kassalokun', 'Öskjureisara- og kassalokunarvélar', 'Pokaísetning', 'Bindiborðavél', '„Bag in box“ pökkunarlínur, kassareisarar og kassalímingavélar'],
    models: [], source: 'Vélar og viðgerðir, samhentir.is, og Þjónusta, plastco.is',
  },
  {
    slug: 'brettavelar', name: 'Brettavafning og stöflun', ask: 'brettavafning og stöflun', stage: 5, unit: 'samhentir',
    blurb: 'Brettavafningsvélar og brettastaflarar, og strekkifilma og millispjöld á brettin.',
    lines: ['Brettavafningsvélar', 'Brettavafnings- og brettastöflunarvélar', 'Brettastaflarar', 'Strekkifilma og millispjöld á bretti'],
    models: [], source: 'Vélar og viðgerðir, samhentir.is, og Þjónusta, plastco.is',
  },
  {
    slug: 'thjarkar', name: 'Þjarkar og sjálfvirkni', ask: 'þjarka og sjálfvirkni', stage: 5, unit: 'plastco',
    blurb: 'Þjarkar frá Universal Robots og iðnaðarþjarkar fyrir sjálfvirka pökkun og stöflun.',
    lines: ['Universal Robots', 'Iðnaðarþjarkar', 'Róbótalausnir og aðrar sjálfvirkar pökkunarlausnir'],
    makers: 'Universal Robots',
    models: [
      { name: 'UR5', img: V('ur5') }, { name: 'UR10', img: V('ur10') }, { name: 'Universal Robots', img: V('robots') },
      { name: 'UR stjórnbúnaður', img: V('urcontroler') }, { name: 'Iðnaðarþjarkar', img: V('indusrobots') },
    ],
    source: 'Þjarkar og sjálfvirkni, plastco.is, og IceFish 2026, samhentir.is',
  },
]

export const familyBySlug = (slug: string) => FAMILIES.find((f) => f.slug === slug)

/* ── industries: their eight menu items (four of which link nowhere today) ── */
export interface Product { k: string; v: string }
export interface Sector {
  slug: string
  name: string
  /** "fyrir …" */
  for: string
  lead: string
  products: Product[]
  photo: Photo
  families: string[]
  /** the companies in the group that serve it */
  who: string[]
  source: string
}

export const SECTORS: Sector[] = [
  {
    slug: 'sjavarutvegur', name: 'Sjávarútvegur', for: 'sjávarútveginn',
    lead: 'Starfsemi Samhentra hófst í kringum sjávarútveginn og allt frá upphafi hefur þjónusta við sjávarútvegsfyrirtæki verið okkar sérþekking.',
    products: [
      { k: 'Kassar', v: 'Kassar fyrir ferskan, blokkfrystan, lausfrystan og uppsjávarfisk færðu hjá okkur.' },
      { k: 'Vaxbornar öskjur', v: 'Vaxbornar öskjur í ýmsum stærðum; 2 kg, 6 kg, 7 kg, 9 kg ásamt 16,5 lbs blokkaröskjunni.' },
      { k: 'Coolseal', v: '100% endurvinnanlegir og óbrjótanlegir kassar fyrir ferskan fisk, framleiddir úr polypropylene (PP) plastbylgju sem veitir einangrunina.' },
      { k: 'Frauðplastkassar frá Formar', v: 'Rúmlega 20 mismunandi frauðkassar ásamt fylgihlutum fyrir pökkun ferskra fiskafurða.' },
      { k: 'Rekstrarvörur', v: 'Vinnufatnaður, sloppar, svuntur, skófatnaður, hanskar, hlífar, brýni og margt fleira.' },
    ],
    photo: PHOTO.oskjur, families: ['vinnsluvelar', 'vogir', 'pokkunarvelar', 'prentarar', 'kassavelar', 'brettavelar'], who: ['samhentir', 'formar', 'plastco', 'vorumerking'],
    source: 'Sjávarútvegur, samhentir.is, og formar.is',
  },
  {
    slug: 'matvaelaidnadur', name: 'Matvælaiðnaður', for: 'matvælaiðnaðinn',
    lead: 'Við erum með mikið úrval af öskjum, kössum og plastumbúðum, sérsniðið að þinni vöru ásamt því að finna réttar pökkunarvélar sem henta þinni framleiðslu.',
    products: [
      { k: 'Sérsniðnar umbúðir', v: 'Öskjur, kassar, plastvörur, bréfpokar og ýmsar rekstrarvörur.' },
      { k: 'Krydd og íblöndunarefni', v: 'Eftir þínum þörfum, í sérhannaðri aðstöðu til blöndunar.' },
      { k: 'Friedr. Dick', v: 'Ekki þarf að kynna fyrir íslensku fagfólki hnífa og áhöld frá Friedr. Dick.' },
    ],
    photo: PHOTO.matvaeli, families: ['pokkunarvelar', 'vogir', 'prentarar', 'malmleit'], who: ['samhentir', 'plastco', 'vorumerking'],
    source: 'Matvælaiðnaður, samhentir.is',
  },
  {
    slug: 'kjotidnadur', name: 'Kjötiðnaður', for: 'kjötiðnaðinn',
    lead: 'Við erum með heildarlausnir fyrir kjötvinnslur þar sem við bjóðum upp á íblöndunarefni, krydd, pökkunarvélar, fatnað, hnífa og handverkfæri.',
    products: [
      { k: 'Krydd og íblöndunarefni', v: 'Mikið úrval af kryddi og íblöndunarefnum. Við bjóðum upp á sérblöndun.' },
      { k: 'Vakúmvélar og pokar', v: 'Pokar í mörgum stærðum og þykktum.' },
      { k: 'Hnífar og áhöld', v: 'Friedr. Dick, gæðastál sem fæst í mörgum mismunandi stærðum og gerðum.' },
    ],
    photo: PHOTO.kjot, families: ['vinnsluvelar', 'sprautsoltun', 'pokkunarvelar', 'vogir'], who: ['samhentir', 'plastco'],
    source: 'Kjötiðnaður, samhentir.is, og Þjónusta, plastco.is',
  },
  {
    slug: 'bakari', name: 'Bakarí', for: 'bakarí',
    lead: 'Við erum með fjölbreytt úrval af bréfpokum, kökuöskjum, kökuspjöldum ásamt ýmsum plastvörum og jarðgeranlegum umbúðum. Einnig er hægt að sérpanta stærðir og prentun fyrir þína vöru.',
    products: [
      { k: 'Bréfpokar og kökuöskjur', v: 'Fjölbreytt úrval, og sérpantaðar stærðir og prentun.' },
      { k: 'Jarðgeranlegar umbúðir', v: 'Ásamt ýmsum plastvörum.' },
    ],
    photo: PHOTO.bakari, families: ['pokkunarvelar', 'prentarar'], who: ['samhentir', 'vorumerking'],
    source: 'Bakarí, samhentir.is',
  },
  {
    slug: 'gardyrkja', name: 'Garðyrkja', for: 'garðyrkjuna',
    lead: 'Við bjóðum upp á fræ fyrir innirækt sem útirækt, mold, sáðtappa, ræktunarílát, áburð, varnarefni, jarðvegsdúka og ábreiður. Frjó umbúðasalan hefur verið hluti af Samhentum frá 2016.',
    products: [
      { k: 'Grasfræ', v: 'Allt fyrir golfvöllinn, knattspyrnuvelli eða í garðinn þinn.' },
      { k: 'Mold', v: 'Gæðavara.' },
      { k: 'Varnarefni', v: 'Fyrir gróðurinn.' },
    ],
    photo: PHOTO.gardyrkja, families: ['pokkunarvelar'], who: ['samhentir'],
    source: 'Garðyrkja, samhentir.is [lagað: „sáðtappar“ í „sáðtappa“]',
  },
  {
    slug: 'almennur-idnadur', name: 'Almennur iðnaður', for: 'almennan iðnað',
    lead: 'Við bjóðum upp á allt fyrir flutning, t.d. kassa í mörgum stærðum sem við eigum ávallt á lager, tröllakassa, límbönd, millispjöld á bretti, strekkifilmu og bóluplast.',
    products: [
      { k: 'Kassar á lager', v: 'Í mörgum stærðum, og tröllakassar.' },
      { k: 'Pokar', v: 'Fjölbreytt úrval af bréf- og plastpokum og ýmsum öðrum plastvörum.' },
      { k: 'Sérpöntun', v: 'Hægt er að sérpanta hjá okkur stærðir og áprentun.' },
    ],
    photo: PHOTO.almennur, families: ['kassavelar', 'brettavelar', 'thjarkar'], who: ['samhentir', 'plastco'],
    source: 'Almennur iðnaður, samhentir.is [lagað: „ávalt“, „eru við“, „bóluplöst“]',
  },
  {
    slug: 'baendur', name: 'Bændur', for: 'bændur',
    lead: 'Plastco flytur inn vélar og umbúðir fyrir landbúnað og fóðurframleiðendur.',
    products: [
      { k: 'Landbúnaður', v: 'Heyrúlluplast, net og garn.' },
      { k: 'Fóðurframleiðendur', v: 'Sekkjunarlínur og brettastaflarar.' },
    ],
    photo: PHOTO.almennur, families: ['brettavelar'], who: ['plastco', 'samhentir'],
    source: 'Þjónusta, plastco.is',
  },
  {
    slug: 'lyfjaframleidsla', name: 'Lyfjaframleiðsla', for: 'lyfjaframleiðslu',
    lead: 'Vörumerking prentar á álefni til nota á pilluspjöld og vítamín. Aðstaðan í prentsalnum uppfyllir ströngustu gæðakröfur lyfja- og matvælaeftirlits.',
    products: [
      { k: 'Álþynnur', v: 'Prentun á álefni fyrir pilluspjöld og vítamín.' },
      { k: 'Flöskur og brúsar', v: 'Blásnar PET- og HDPE-flöskur frá Sigurplasti.' },
      { k: 'Vogir og teljarar', v: 'Fyrir lyfjaiðnað, frá Plastco.' },
    ],
    photo: PHOTO.sigurplast, families: ['vogir', 'prentarar'], who: ['vorumerking', 'plastco'],
    source: 'Állok og álfilmur, vorumerking.is, og Þjónusta, plastco.is',
  },
]

export const sectorBySlug = (slug: string) => SECTORS.find((s) => s.slug === slug)

/* ── their own work, captioned in their words ───────────────────────── */
export const WORK: { photo: Photo; t: string; s: string; sector?: string }[] = [
  { photo: PHOTO.oskjur, t: 'Öskjur fyrir frosinn fisk', s: 'Prentaðar öskjur fyrir flök, í nokkrum stærðum.', sector: 'sjavarutvegur' },
  { photo: PHOTO.coolseal, t: 'Coolseal', s: 'Endurvinnanlegir og óbrjótanlegir kassar fyrir ferskan fisk.', sector: 'sjavarutvegur' },
  { photo: PHOTO.matvaeli, t: 'Matvælaumbúðir', s: 'Öskjur, pokar og dollur sérsniðnar að vörunni.', sector: 'matvaelaidnadur' },
  { photo: PHOTO.sersnidid, t: 'Sérsniðnar lausnir', s: 'Standar, gjafaumbúðir og öskjur frá formhönnuði.' },
  { photo: PHOTO.kassar, t: 'Kassar fyrir sjávarafurðir', s: 'Prentaðir kassar fyrir frosinn fisk.', sector: 'sjavarutvegur' },
]

/* ── words and numbers ──────────────────────────────────────────────── */
export const LEAD =
  'Við sérhæfum okkur í að þjónusta þínar þarfir í framleiðslu og umbúðum, bæði í sérsniðnum lausnum og stöðluðum einingum.'

export const QUOTE = {
  text: 'Við byrjuðum á því að handlíma tröllakassa, en þeir voru mikið notaðir í rækjuvinnslu og fiskiðnaði á þessum tíma.',
  who: 'Jóhann Oddgeirsson',
  role: 'framkvæmdastjóri Samhentra',
  source: 'Heildarlausnir í umbúðum fyrir sjávarútveginn, 9. október 2026',
}

export const STORY = [
  'Samhentir fagna 30 ára afmæli á þessu ári og hafa frá stofnun verið nátengdir íslenskum sjávarútvegi. Á þessum þremur áratugum hefur fyrirtækið þróast úr lítilli starfsemi sem sinnti einföldum umbúðalausnum fyrir fiskiðnaðinn í öfluga fyrirtækjasamstæðu sem býður í dag upp á heildarlausnir fyrir sjávarútveg sem og fjölmargar aðrar greinar atvinnulífsins.',
  'Umbúðir eru áfram stór hluti starfseminnar en samhliða þeim hafa bæst við pökkunarvélar, vélbúnaður, sjálfvirkni og róbótalausnir.',
]

export const STOCK_TEXT =
  'Við erum með ríflega 15 þúsund fermetra húsnæði undir lager. Þannig getum við ávallt tryggt að við eigum til birgðir fyrir t.a.m. frystitogarana þegar þeir fara á sjó.'

export const DESIGN = {
  lead: 'Ert þú með hugmynd eða lengra komin? Vantar þig verðhugmyndir eða hráefnisráðgjöf? Við erum með reynslumikið starfsfólk sem leiðbeinir þér á öllum stigum.',
  items: [
    { k: 'Ráðgjöf og hönnun', v: 'Nýttu þér sérþekkingu formhönnuðs til að fá umbúðir sem eru sérsniðnar að þinni vöru. Hægt er að fá sýnishorn af umbúðum til mátunar.' },
    { k: 'Krydd og íblöndunarefni', v: 'Hjá okkur er sérhönnuð aðstaða til blöndunar á kryddi og ýmsum íblöndunarefnum. Við erum með staðlaðar og sérframleiddar kryddblöndur.' },
    { k: 'Umhverfisvænar lausnir', v: 'Hægt er að fá bylgjupappa og umbúðakarton úr endurunnu hráefni. Því meira sem það er endurunnið, því brúngrárra verður hráefnið.' },
  ],
}

export const CERTS = [
  { k: 'BRCGS', v: 'Samhentir Kassagerð hlaut vottun samkvæmt alþjóðlega BRCGS staðlinum fyrir innflutnings- og heildsölufyrirtæki með umbúðir, þar á meðal matvælaumbúðir.' },
  { k: 'BRC hjá Vörumerkingu', v: 'Framleiðslusalur Vörumerkingar uppfyllir ströngustu kröfur matvæla- og lyfjaeftirlits um umbúðir sem koma í snertingu við matvæli.' },
  { k: 'FSC', v: 'Staðfestir að viðar- og pappírsafurðir séu unnar úr endurunnu hráefni, eða komi úr sjálfbærum, löglega nýttum og vel stýrðum skógum.' },
]

export const SERVICE_TEXT =
  'Við seljum og þjónustum flestar gerðir véla til pökkunar og merkinga á umbúðum, kjötvinnsluvélar og ýmis léttitæki: uppsetning tækja og hugbúnaðar, þjálfun, viðhald og varahlutaþjónusta.'

/** what a service request needs, so the first reply can be an answer (the last two are Plastco's own form fields) */
export const SERVICE_READY = [
  { k: 'Framleiðandi og gerð', v: 'Gerðarheitið á skilti vélarinnar, til dæmis Sealpac A7.' },
  { k: 'Raðnúmer', v: 'Ef þú hefur það við höndina, oftast á sama skilti.' },
  { k: 'Vélbúnaður eða hugbúnaður', v: 'Og hvort þjónustusamningur er til staðar, með númeri.' },
  { k: 'Lýsing og mynd', v: 'Hvað er að, villuboð á skjá, eða mynd af varahlutnum.' },
]

/* ── Vörumerking: labels and the file checklist (their words) ───────── */
export const LABELS = {
  lead: 'Vörumerking framleiðir merkingar á umbúðir úr pappír, plastefnum og álfólíu: límmiða hverskonar, merkingar á gosdrykki og bjór, állok á mjólkurvörur og álfilmur á pilluspjöld svo eitthvað sé nefnt.',
  products: [
    { k: 'Límmiðar', v: 'Límmiða prentum við eftir þörfum hvers og eins. Allt upp í 12 liti, á margskonar pappír, plast og álefni. Einnig eigum við á lager gott úrval óáprentaðra miða.' },
    { k: 'Stafræn prentun', v: 'Vantar þig einn eða fimmtíu límmiða? Stafræn prentun hentar vel fyrir smærri upplög og breytilegar upplýsingar: strikamerki, QR kóða, texta eða myndir.' },
    { k: 'Állok og álþynnur', v: 'Ál-, plast- og pappalok á skyrdósir, jógúrtdósir, majónesdósir og kokteilsósur, og prentun á álefni fyrir pilluspjöld og vítamín.' },
    { k: 'Áprentuð pökkunarfilma', v: 'Merkingar á drykkjarumbúðir allan hringinn, filmur fyrir matvæli og sælgæti, varúðarborðar og banding filmur.' },
    { k: 'Plastkort', v: 'Plastkort í kreditkortastærð, með eða án segulrandar, nándarkort, og innáprentun breytilegra nafna.' },
  ],
  files: [
    { k: 'Forrit', v: 'Illustrator, InDesign eða Photoshop. Úr öðrum forritum tökum við eingöngu við PDF.' },
    { k: 'Letur', v: 'Allt letur fylgir með eða er útlínað.' },
    { k: 'Blæði', v: 'Minnst 2 mm út fyrir skorna eða stansaða stærð á alla kanta.' },
    { k: 'Myndir og merki', v: 'CMYK, minnst 300 dpi. Merki helst á vektorformi með Pantone litanúmerum.' },
    { k: 'Stansar', v: 'Stansasafnið er stórt. Kannaðu hvort stærðin er til áður en uppsetning hefst, nýr stans tekur nokkra daga.' },
  ],
  source: 'vorumerking.is: Límmiðar, Stafræn prentun, Állok og álfilmur, Áprentuð pökkunarfilma, Plastkort, Skil á verkefni',
}

/* ── the page-level facts the audit rests on ───────────────────────── */
export const companyEntry: PreviewCompany = {
  slug: 'samhentir',
  route: ROUTE,
  name: 'Samhentir Kassagerð hf.',
  sector: 'Umbúðir, vélar og merkingar fyrir framleiðslu',
  location: 'Garðabær',
  region: 'Höfuðborgarsvæðið',
  established: 'Stofnað 1996, samstæða með Vörumerkingu, Plastco og Formar',
  currentUrl: 'https://samhentir.is',
  ownerEmail: CONTACT.email,
  concept: 'Ein lína, eitt hús',
  conceptTagline:
    'Ein vara fer eftir einni línu og hvert skref á henni er eitthvað sem samstæðan selur: vélin, vogin, bakkinn og filman, miðinn, kassinn og strekkifilman á brettið.',
  accent: '#284195',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}samhentir/img/oskjur-sjavarutvegur-800.webp`,
  ownPhotography: true,
  photoCredit: PHOTO_CREDIT,
  audit: {
    strengths: [
      'Samstæða fjögurra fyrirtækja undir einum hatti: Samhentir, Vörumerking, Plastco og Formar, og saga aftur til 1937',
      'Ríflega 15 þúsund fermetra lager og vefverslun með innskráningu fyrir viðskiptavini, opnuð 2025',
      'BRCGS vottun fyrir innflutning og heildsölu umbúða, og BRC vottaður prentsalur hjá Vörumerkingu',
    ],
    weaknesses: [
      'Vélar eru orðalisti og þjónustan er „sendu tölvupóst“, á meðan Plastco er með sitt eigið þjónustueyðublað á öðrum vef',
      'Samstæðan sést ekki sem samstæða: Vörumerking birtist á samhentir.is sem eitt merki í röð birgja, og hvorki Plastco né Formar eiga þar hlekk',
      'Vörumerking keyrir á vefkerfi frá 2013 og lýsingin fyrir leitarvélar er enn sjálfgefni textinn „Hér setur þú lýsinguna á vefnum“',
    ],
    opportunities: [
      'Ein lína sem sýnir allt sem samstæðan selur, frá vél að bretti, með fyrirtækið sem á hvert skref',
      'Ein þjónustubeiðni fyrir vélar Samhentra og Plastco, með gerð, raðnúmeri, þjónustusamningi og mynd',
      'Hver atvinnugrein fær sína eigin síðu með vörum, vélum og fyrirtækjunum sem þjóna henni',
    ],
  },
  positioning:
    'Samhentir og fyrirtækin þeirra, Vörumerking, Plastco og Formar, selja umbúðir, merkingar og vélar fyrir framleiðslu, mest fyrir sjávarútveg. Frumgerðin byggir á þeirra eigin orðum og myndum: ein teiknuð lína þar sem hvert skref er fyrirtæki í samstæðunni, hver atvinnugrein á sinni síðu, og ein fyrirspurn sem ratar á réttan stað.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Samhenta',
    body: '[HLEKKUR Á FRUMGERÐ]\n\n(Drög, textinn er skrifaður þegar úttekt lýkur.)',
  },
}
