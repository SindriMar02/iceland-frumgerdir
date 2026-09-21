import type { PreviewCompany } from '../company-types'

const BASE = import.meta.env.BASE_URL

/* Editorial layer. Every fact below is Góa's own, read off goa.is on
   2026-09-21 (the "Um Góu" panel, the contact panel and the product
   catalogue served by modules/frontPage/output/getProducts.php). The one
   outside source is the 2025 Omnom line in SAGAN, from mbl.is. Nothing is
   invented: no prices they do not publish, no reviews, no stockists. */

export const FYRIRTAEKI = {
  nafn: 'Góa',
  logadi: 'Góa-Linda sælgætisgerð ehf.',
  kt: '410168-0229',
  heimili: 'Garðahrauni 2, 210 Garðabæ',
  simi: '515 0900',
  simiHref: 'tel:+3545150900',
  netfang: 'goa@goa.is',
  pantanir: 'pantanir@goa.is',
  facebook: 'https://www.facebook.com/goa.is',
}

/* Condensed from "Um Góu". Every year is theirs except 2025. */
export const SAGAN = [
  {
    ar: '1968',
    titill: 'Ein karamelluvél',
    texti: 'Sælgætisgerðin Góa er stofnuð 1. janúar 1968. Til að byrja með á fyrirtækið eina karamelluvél.',
  },
  {
    ar: '1973',
    titill: 'Hraun',
    texti: 'Framleiðsla á Hraun-súkkulaðinu hefst. Það hefur verið vinsælasta vara Góu upp frá því.',
  },
  {
    ar: '1993',
    titill: 'Góa og Linda',
    texti: 'Tvær ástsælustu sælgætisgerðir landsins renna í eina sæng: Góa í Hafnarfirði og Linda á Akureyri.',
  },
  {
    ar: '2002',
    titill: 'Lakkrísinn',
    texti: 'Góa kaupir rekstur lakkrísgerðarinnar Drift sf.',
  },
  {
    ar: '2025',
    titill: 'Súkkulaðið',
    texti: 'Góa kaupir framleiðslutæki Omnom og tekur við súkkulaðiframleiðslunni.',
  },
]

/* Verbatim, "Um Góu". */
export const TILVITNUN =
  'Til að byrja með átti fyrirtækið eina karamelluvél en árið 1973 hófst framleiðsla á ' +
  'Hraun-súkkulaðinu sem hefur verið vinsælasta vara fyrirtækisins upp frá því.'

/* Their contact panel, each address checked against its own mailto. The live
   panel shows hanni@ under a mailto that points at binni@; here every name
   carries its own address. */
export const TEYMI = [
  { nafn: 'Helgi Vilhjálmsson', hlutverk: 'Framkvæmdastjóri', netfang: '' },
  { nafn: 'Brynjar Indriðason', hlutverk: 'Sölustjóri', netfang: 'binni@goa.is' },
  { nafn: 'Atli Einarsson', hlutverk: 'Viðskiptastjóri', netfang: 'atli@goa.is' },
  { nafn: 'Jóhann Ögri Elvarsson', hlutverk: 'Framleiðsla', netfang: 'hanni@goa.is' },
]

/* Five facts, all from "Um Góu". */
export const KOSTIR = [
  { n: '1968', t: 'Stofnuð', d: 'Góa var stofnuð 1. janúar 1968 í kringum eina karamelluvél.' },
  { n: '1973', t: 'Hraun', d: 'Vinsælasta vara Góu síðan framleiðslan hófst.' },
  { n: '1993', t: 'Góa og Linda', d: 'Hafnarfjörður og Akureyri undir einu þaki.' },
  { n: '~50', t: 'Starfsmenn', d: 'Um fimmtíu manns vinna hjá Góu.' },
  { n: '40+', t: 'Ár í starfi', d: 'Sumir hafa unnið hjá Góu í yfir fjörutíu ár.' },
]

/* The four routes a visitor actually arrives for. Fundraising prices and the
   100-bag threshold are verbatim from the afklippur listings. */
export const ERINDI = [
  {
    nafn: 'Verslanir og sjoppur',
    nota: 'Settu vörur í nammipokann og sendu pöntunina, eða skrifaðu beint á pantanir@goa.is.',
    hlekkur: '#hillan', ord: 'Í hilluna',
  },
  {
    nafn: 'Fjáröflun',
    nota: 'Lakkrísafklippur, 500 kr. fyrir 450 g. Bland í poka, 1.000 kr. fyrir 650 g. Yfir 100 pokar: hafðu samband.',
    hlekkur: 'mailto:pantanir@goa.is?subject=Fj%C3%A1r%C3%B6flun', ord: 'Panta',
  },
  {
    nafn: 'Ísbúðir',
    nota: 'Brak, Appolo kurl, bangsahlaup og súkkulaðispænir í stórum pakkningum, 1,2 til 2,5 kg.',
    hlekkur: 'mailto:pantanir@goa.is?subject=%C3%8Dsb%C3%BA%C3%B0', ord: 'Senda fyrirspurn',
  },
  {
    nafn: 'Styrkir',
    nota: 'Góa tekur við umsóknum um styrki. Segðu frá félaginu og verkefninu.',
    hlekkur: 'mailto:goa@goa.is?subject=Styrkums%C3%B3kn', ord: 'Sækja um',
  },
]

/* "Opnunartímar" from the Um Góu panel. The live front page still shows a
   dated summer notice (föstudagur 31.07.2026); that is not reproduced. */
export const OPNUN = [
  { leid: 'Lakkríssalan', verd: '8.00–16.00', nota: 'Virka daga, Garðahrauni 2.' },
  { leid: 'Skrifstofan', verd: '8.30–16.30', nota: 'Virka daga. Sími 515 0900.' },
  { leid: 'Pantanir', verd: 'pantanir@goa.is', nota: 'Afrit af pöntuninni berst á netfangið sem pantað er á.' },
]

export const TEXTI = {
  heroLinur: ['Þetta byrjaði', 'á einni', 'karamelluvél'],
  heroAr: 'árið 1968.',
  heroUndir: 'Hraun, Æði, Toffí, Prins, Flórída, Brak, Lindubuff, Conga og Appolo lakkrís.',
  linurInn:
    'Góu vörur, Lindu súkkulaðið að norðan, Appolo lakkrísinn og sælgæti í lausu. ' +
    'Samhliða framleiðslunni flytur Góa inn sælgæti fyrir söluturna og dreifingaraðila.',
  hillanInn:
    'Hver vara með vörunúmeri, pakkningu og innihaldslýsingu. Settu í nammipokann og sendu eina pöntun.',
  eggInn: 'Frá 155 g upp í rúmt kíló. Hraun, Appolo og Lindor fá sín eigin egg.',
  umInn: 'Um fimmtíu manns vinna hjá Góu. Þessi fjögur svara fyrir fyrirtækið.',
  erindiInn: 'Flestir koma hingað í einu af fjórum erindum.',
  sagaInn: 'Hraun, Linda og Appolo komu hvert á eftir öðru. Fyrst var það karamelluvélin.',
  fotur: 'Síðan 1968',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Góa',
  legalName: 'Góa-Linda sælgætisgerð ehf.',
  url: 'https://goa.is',
  telephone: '+354 515 0900',
  email: 'goa@goa.is',
  foundingDate: '1968-01-01',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Garðahrauni 2',
    postalCode: '210',
    addressLocality: 'Garðabær',
    addressCountry: 'IS',
  },
}

/* ------------------------------------------------------------------
   Colour. Every ground was sampled with a median-cut quantize off the
   wrapper of the product standing on it; none was picked from a palette.
   The ink per ground is computed, not judged: WCAG relative luminance
   against #FFFFFF and #2D1105 (the brown of their own logo), higher ratio
   wins, and every pair clears 4.5:1.
   ------------------------------------------------------------------ */
export const GRUNNAR = {
  karamella: '#FFAB03', // Karamellur 150 g, the bag's orange-gold
  brak: '#B80914',      // Brak, the red of the bag
  hjup: '#4B475E',      // Appolo Hjúp, the slate under the stripes
  toffi: '#D46F0D',     // Toffí sleikjó
  bangsi: '#E3013D',    // Bangsahlaup, the red half-tone
  lava: '#3A3C31',      // Lava marshmallow box, the moss
  bingo: '#544E46',     // Bingókúlur, the warm grey of the stripes
  florida: '#F6A93A',   // Floridabitar box
  linda: '#D0161F',     // Linda logo red, taken one step darker to clear 4.5:1 with white
  pipar: '#BAE31C',     // piparfylltur Hjúp, the lime
  gull: '#F9D100',      // the Góa crown
  egg: '#6F238C',       // páskaegg sleeve
  hraun: '#DD9C2F',     // Hraun wrapper
} as const

const INK = '#2D1105'
export const BLEK_A: Record<string, string> = {
  [GRUNNAR.karamella]: INK, [GRUNNAR.brak]: '#FFFFFF', [GRUNNAR.hjup]: '#FFFFFF',
  [GRUNNAR.toffi]: INK, [GRUNNAR.bangsi]: '#FFFFFF', [GRUNNAR.lava]: '#FFFFFF',
  [GRUNNAR.bingo]: '#FFFFFF', [GRUNNAR.florida]: INK, [GRUNNAR.linda]: '#FFFFFF',
  [GRUNNAR.pipar]: INK, [GRUNNAR.gull]: INK, [GRUNNAR.egg]: '#FFFFFF', [GRUNNAR.hraun]: INK,
}

export type Reitur = { img: string; n: string; grunnur: string }

/* Seven bags on their own colours: the reference's scattered 4x3 grid. */
export const HERO_REITIR: Reitur[] = [
  { img: '/goa/karamellur.webp', n: 'Góu karamellur', grunnur: GRUNNAR.karamella },
  { img: '/goa/brak.webp', n: 'Brak', grunnur: GRUNNAR.brak },
  { img: '/goa/appolo-hjup.webp', n: 'Appolo Hjúp lakkrís', grunnur: GRUNNAR.hjup },
  { img: '/goa/toffi-sleikjo.webp', n: 'Toffí sleikjó', grunnur: GRUNNAR.toffi },
  { img: '/goa/bangsahlaup.webp', n: 'Bangsahlaup', grunnur: GRUNNAR.bangsi },
  { img: '/goa/lava-marshmallow.webp', n: 'Lava marshmallow', grunnur: GRUNNAR.lava },
  { img: '/goa/bingokulur.webp', n: 'Bingókúlur', grunnur: GRUNNAR.bingo },
]

/* The inline-image sentence. `b` widens the chip for bars, which are
   3.5:1 and would shrink to a sliver in the square chip. */
export type Biti = { t: string } | { img: string; n: string; grunnur: string; b?: number }

export const SETNING: Biti[][] = [
  [{ t: 'Hraun' }, { img: '/goa/hraun.webp', n: 'Hraun', grunnur: GRUNNAR.hraun, b: 2.2 }, { t: 'síðan 1973,' }],
  [{ t: 'Linda' }, { img: '/goa/lindu-mjolkursukkuladi.webp', n: 'Lindu mjólkursúkkulaði', grunnur: GRUNNAR.linda, b: 2.2 }, { t: 'að norðan,' }],
  [{ t: 'Appolo' }, { img: '/goa/appolo-pipar-hjup.webp', n: 'Appolo piparfylltur Hjúp', grunnur: GRUNNAR.pipar }, { t: 'lakkrís' }],
  [{ t: 'og allt hitt í pokanum.' }],
]

export const companyEntry: PreviewCompany = {
  slug: 'goa',
  route: '/preview/goa',
  name: 'Góa',
  sector: 'Sælgætisgerð og heildsala',
  location: 'Garðahrauni 2, 210 Garðabæ',
  region: 'Sala til verslana um allt land',
  established: 'Stofnuð 1. janúar 1968. Um 50 starfsmenn.',
  currentUrl: 'https://goa.is',
  ownerEmail: 'goa@goa.is',
  concept: 'Ein karamelluvél',
  conceptTagline:
    'Góa byrjaði á einni karamelluvél árið 1968. Vefurinn byrjar þar, lætur Hraun, Lindu og ' +
    'Appolo hanga á þeirri sögu og gerir nammipokann, pöntunarleið verslananna, að skúffu sem ' +
    'fylgir manni um alla síðuna.',
  accent: '#C21514',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}goa/karamellur.webp`,
  ownPhotography: true,
  photoCredit:
    'Vörumyndir, merki og efni eru í eigu Góu-Lindu sælgætisgerðar ehf. og sótt af goa.is 21. september 2026.',
  audit: {
    strengths: [
      'Vörumyndir í prentgæðum með gegnsæjum bakgrunni af nánast hverri vöru',
      'Innihaldslýsing sem PDF við flestar vörur og vörunúmer við allar',
      'Nammipokinn er raunveruleg pöntunarleið fyrir verslanir, ekki skraut',
    ],
    weaknesses: [
      'Forsíðan sýnir enn „Í dag föstudag 31.07.2026, lokum við kl 12:00“ og sumaropnun',
      'Merkið í haus er enn „Góa 50 ára“, þótt fyrirtækið hafi verið stofnað 1968',
      'Í tengiliðaglugganum stendur hanni@goa.is en smellurinn opnar póst á binni@goa.is',
      'Vefurinn bannar aðdrátt í síma (user-scalable=no) og keyrir á jQuery 1.8.0',
    ],
    opportunities: [
      'Fjáröflun, ísbúðir og styrkir eru fjórar ólíkar ástæður fyrir heimsókn en liggja í sama lista',
      'Hraun hefur verið vinsælasta varan síðan 1973 og sú saga er hvergi sögð nema í textaglugga',
    ],
  },
  positioning:
    'Góa er ekki nammibúð á netinu heldur sælgætisgerð sem selur til verslana, ísbúða og félaga í ' +
    'fjáröflun. Vefurinn á að vísa hverjum og einum sína leið og gera pöntunina léttari, ekki búa til ' +
    'körfu sem enginn bað um.',
  /* No outreach drafted: Sindri has authorized the build only. */
  outreach: { subject: '', body: '' },
}

/* ------------------------------------------------------------------
   Copy for the noho-fidelity rebuild (2026-09-21). Same rule as above:
   every fact is Góa's own, from goa.is.
   ------------------------------------------------------------------ */

/* The three cards under "Góðgæti síðan 1968" (noho's advantages strip). */
export const KORT3 = [
  { m: 'Stofnuð 1. janúar 1968', t: 'Ein karamelluvél', nr: '01' },
  { m: 'Hraun síðan 1973', t: 'Vinsælasta varan frá upphafi', nr: '02' },
  { m: 'Um fimmtíu starfsmenn', t: 'Sumir í yfir fjörutíu ár', nr: '03' },
]

/* The two product panels, with their variants as swatches. The swatch
   colour is sampled off each wrapper. */
export const SPJOLD = [
  {
    merki: 'Góa · síðan 1973', titill: 'Hraun',
    tegundir: [
      { nr: '11101', n: 'Hraun', pk: '30 g × 24 stk.', img: 'hraun', lit: '#DD9C2F', pdf: '/uploads/hraun-bitar-vorulysing.pdf' },
      { nr: '11105', n: 'Risahraun', pk: '55 g × 20 stk.', img: 'risahraun', lit: '#B8411E', pdf: '/uploads/hraun-bitar-vorulysing_(2).pdf' },
      { nr: '11104', n: 'Lava', pk: '30 g × 24 stk.', img: 'lava', lit: '#2B2E3F', pdf: '' },
    ],
  },
  {
    merki: 'Linda · frá Akureyri', titill: 'Lindu súkkulaði',
    tegundir: [
      { nr: '121320', n: 'Lindu mjólkursúkkulaði', pk: '100 g × 24 stk.', img: 'lindu-mjolkursukkuladi', lit: '#6D4A2B', pdf: '/uploads/Innihaldslýsingar mjólkursúkkulaði.pdf' },
      { nr: '121202', n: 'Lindu suðusúkkulaði', pk: '200 g × 28 stk.', img: 'lindu-sudusukkuladi', lit: '#2B1C14', pdf: '/uploads/Innihaldslýsing suðusúkkulaði.pdf' },
      { nr: '121315', n: 'Lindor hvítt súkkulaði', pk: '100 g × 24 stk.', img: 'lindor', lit: '#FDC851', pdf: '/uploads/Innihaldslýsing hvítt súkkulaði_(3).pdf' },
      { nr: '121310', n: 'Lindu appelsínusúkkulaði', pk: '100 g × 24 stk.', img: 'lindu-appelsinu-100', lit: '#F08A2E', pdf: '/uploads/Innihaldslýsing appelsínusúkkulaði_(1).pdf' },
    ],
  },
]

/* The story carousel: one card per catalogue category. */
export const LINUR = [
  { s: 'gou', t: 'Góu vörur', img: 'floridabitar', g: '#F6A93A', d: 'Hraun, Æði, Prins, Flórída, Brak, kúlur, karamellur og hlaup.' },
  { s: 'linda', t: 'Lindu vörur', img: 'lindu-appelsinu-40', g: '#D0161F', d: 'Súkkulaðið að norðan: buff, Lindor, suðusúkkulaði og stangir.' },
  { s: 'appolo', t: 'Appolo lakkrís', img: 'appolo-pipar-hjup', g: '#BAE31C', d: 'Rúllur, reimar, kurl, molar og lakkríssúkkulaði.' },
  { s: 'lausu', t: 'Sælgæti í lausu', img: 'appolo-kurl-lausu', g: '#F9D100', d: 'Eitt til þrjú og hálft kíló, fyrir nammibari og bland í poka.' },
  { s: 'paskar', t: 'Páskar', img: 'paskaegg-7', g: '#6F238C', d: 'Páskaeggin frá nr. 3 upp í nr. 11, og Hraun, Appolo og Lindor egg.' },
  { s: 'isbudir', t: 'Ísbúðir', img: 'brak', g: '#B80914', d: 'Brak, kurl, spænir og hlaup í stórum pakkningum.' },
  { s: 'fjaroflun', t: 'Fjáröflun', img: 'appolo-kurl', g: '#4B475E', d: 'Lakkrísafklippur, 500 kr. fyrir 450 g, og bland í poka.' },
]

/* The history as noho's awards table: a group label, then rows with the
   year on the right. */
export const SOGUHOPAR = [
  { h: 'Góa', r: [{ t: 'Sælgætisgerðin stofnuð, með eina karamelluvél', a: '1968' }, { t: 'Framleiðsla á Hraun-súkkulaðinu hefst', a: '1973' }] },
  { h: 'Linda', r: [{ t: 'Góa í Hafnarfirði og Linda á Akureyri sameinast', a: '1993' }] },
  { h: 'Lakkrís', r: [{ t: 'Góa kaupir rekstur lakkrísgerðarinnar Drift sf.', a: '2002' }] },
  { h: 'Súkkulaði', r: [{ t: 'Góa kaupir framleiðslutæki Omnom og tekur við framleiðslunni', a: '2025' }] },
]

/* Spurt og svarað: each answer is a fact already on goa.is. */
export const SPURT = [
  { q: 'Hvernig panta verslanir hjá Góu?', a: 'Settu vörur í nammipokann og sendu pöntunina, eða skrifaðu á pantanir@goa.is. Núverandi viðskiptavinir gefa upp viðskiptanúmer eða kennitölu, nýir gefa upp upplýsingar um fyrirtækið.' },
  { q: 'Hvað kostar lakkrís til fjáröflunar?', a: 'Lakkrísafklippur kosta 500 kr. fyrir 450 g og bland í poka 1.000 kr. fyrir 650 g. Ef pantaðir eru fleiri en 100 pokar þarf að hafa samband og leggja inn pöntun.' },
  { q: 'Hvar finn ég innihaldslýsingar?', a: 'Við flestar vörur í vörulistanum er innihaldslýsing á PDF formi, ásamt vörunúmeri og pakkningu.' },
  { q: 'Hvenær er Lakkríssalan opin?', a: 'Lakkríssalan í Garðahrauni 2 er opin virka daga frá 8.00 til 16.00. Skrifstofan er opin virka daga frá 8.30 til 16.30.' },
  { q: 'Hvernig sæki ég um styrk?', a: 'Góa tekur við umsóknum um styrki. Sendu nafn, netfang og stutta skýringu á goa@goa.is.' },
  { q: 'Get ég fengið merki og vörumyndir?', a: 'Merkjapakkar Góu, Lindu og Appolo (ai, jpg, png) og prentvænar vörumyndir eru til niðurhals á goa.is.' },
]

/* The gallery strip. */
export const GALLERI = [
  { img: 'karamellur', nr: '11555', n: 'Karamellur', pk: '150 g × 16 stk.', g: '#FFAB03', pdf: '/uploads/2016-09-14-karamellur-og-toffisleikjo_(8).pdf' },
  { img: 'brak', nr: '11171', n: 'Brak', pk: '150 g × 20 stk.', g: '#B80914', pdf: '/uploads/Innihaldslýsing Brak_(1).pdf' },
  { img: 'paskaegg-3', nr: '11830', n: 'Góu egg nr. 3', pk: '155 g', g: '#6F238C', pdf: '' },
  { img: 'appolo-hjup', nr: '11625', n: 'Appolo lakkrís molar', pk: '150 g × 24 stk.', g: '#4B475E', pdf: '/uploads/Innihaldslýsing súkkulaðihúðaður svartur lakkrís .pdf' },
  { img: 'toffi-sleikjo', nr: '11546', n: 'Toffí sleikjó', pk: '200 g × 20 stk.', g: '#D46F0D', pdf: '/uploads/2016-09-14-karamellur-og-toffisleikjo_(7).pdf' },
  { img: 'bangsahlaup', nr: '11032', n: 'Bangsahlaup', pk: '150 g × 24 stk.', g: '#E3013D', pdf: '/uploads/Innihaldslýsingar  Góu Snuddu og bangsahlaup_(7).pdf' },
  { img: 'lava-marshmallow', nr: '11288', n: 'Lava marshmallow', pk: '250 g × 12 stk.', g: '#3A3C31', pdf: '/uploads/Innihaldslýsingar lava marshmallow.pdf' },
  { img: 'paskaegg-hraun-5', nr: '11846', n: 'Hraunegg nr. 5', pk: '450 g', g: '#DD9C2F', pdf: '' },
  { img: 'bingokulur', nr: '11326', n: 'Bingókúlur', pk: '150 g × 24 stk.', g: '#544E46', pdf: '/uploads/Innihaldslýsing Bingo-lakkrískúlur_(2).pdf' },
  { img: 'appolo-pipar-hjup', nr: '11640', n: 'Appolo piparfylltir molar', pk: '150 g × 24 stk.', g: '#BAE31C', pdf: '/uploads/Innihaldslýsing súkkulaði fyllt m piparlakkrís_(1).pdf' },
  { img: 'filakulur', nr: '11729', n: 'Fílakúlur', pk: '550 g × 16 stk.', g: '#F9D100', pdf: '/uploads/Innihaldslýsingar Fílakúlur_(3).pdf' },
  { img: 'floridabitar', nr: '11245', n: 'Floridabitar', pk: '200 g × 12 stk.', g: '#F6A93A', pdf: '/uploads/Innihaldslýsing Florida.pdf' },
  { img: 'paskaegg-lindor-4', nr: '11848', n: 'Lindor hvítt súkkulaðiegg', pk: '325 g', g: '#FDC851', pdf: '' },
  { img: 'appolo-kurl', nr: '10220', n: 'Appolo lakkrískurl', pk: '150 g × 28 stk.', g: '#282928', pdf: '/uploads/innihaldlýsing appolo-lakkris svartur_(7).pdf' },
  { img: 'appolo-fylltar-reimar', nr: '10121', n: 'Appolo fylltar reimar', pk: '80 g × 28 stk.', g: '#F9D100', pdf: '/uploads/Innihaldslysing-Fylltur-lakkris_(3).pdf' },
  { img: 'paskaegg-appolo-5', nr: '11840', n: 'Lakkrísegg nr. 5', pk: '450 g', g: '#2A2A2A', pdf: '' },
]

/* The quote's image chips cycle through these (noho §4.6). */
export const SETNING_HRINGUR: Record<string, string[]> = {
  Hraun: ['hraun', 'risahraun', 'lava'],
  'Lindu mjólkursúkkulaði': ['lindu-mjolkursukkuladi', 'lindor', 'lindu-appelsinu-100', 'lindu-sudusukkuladi'],
  'Appolo piparfylltur Hjúp': ['appolo-pipar-hjup', 'appolo-hjup', 'appolo-kurl'],
}
