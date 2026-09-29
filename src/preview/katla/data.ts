import type { PreviewCompany } from '../company-types'

const BASE = import.meta.env.BASE_URL

/* Editorial layer. Every fact below is Katla's own, read off katla.is on
   2026-09-28 (front page, Um okkur, Neytendavara, Kjötvinnslur,
   Sjávarútvegur, Starfsfólk, the footer and the product catalogue), plus two
   dated press sources for the history: Vísir 2019 (Rannveig takes over as
   framkvæmdastjóri) and mbl.is 8.10.2024 (Katla's own press release on the
   Costco export and the 2023 Nói Síríus cookie dough). Nothing is invented:
   no prices, no reviews, no stockist list, no awards. The Eðal kakó pack is
   deliberately not shown anywhere as a picture (its mascot); it stays a text
   row in the catalogue. */

export const FYRIRTAEKI = {
  nafn: 'Katla',
  logadi: 'Katla matvælaiðja ehf.',
  kt: '620786-1959',
  heimili: 'Kletthálsi 3, 110 Reykjavík',
  simi: '567 4422',
  simiHref: 'tel:+3545674422',
  netfang: 'rekstur@katla.is',
  pantanir: 'rekstur@katla.is',
  facebook: 'https://www.facebook.com/katla.is/',
  instagram: 'https://www.instagram.com/katla.bakstur/',
  linkedin: 'https://www.linkedin.com/company/katla',
}

/* Condensed history. 1954 and 1986 are Katla's own words ("stofnað 1954",
   "í sömu eigu frá 1986"); 2019 is Vísir; 2023 and 2024 are mbl.is
   8.10.2024. */
export const SAGAN = [
  { ar: '1954', titill: 'Katla stofnuð', texti: 'Katla er fjölskyldufyrirtæki stofnað árið 1954.' },
  { ar: '1986', titill: 'Sama fjölskyldan', texti: 'Katla hefur verið í sömu eigu frá 1986.' },
  { ar: '2019', titill: 'Næsta kynslóð', texti: 'Rannveig Tryggvadóttir tekur við sem framkvæmdastjóri við hlið föður síns, Tryggva Magnússonar.' },
  { ar: '2023', titill: 'Smákökudeig', texti: 'Katla og Nói Síríus þróa smákökudeig byggt á Pipp og Eitt sett.' },
  { ar: '2024', titill: 'Útflutningur', texti: 'Smákökudeig frá Kötlu fer í 29 verslanir Costco í Bretlandi og eina í Svíþjóð.' },
]

/* Verbatim, katla.is/neytendavara. */
export const TILVITNUN =
  'Katla hefur alla tíð lagt mikið upp úr gæðum sem Íslendingar þekkja enda eru neytendavörur ' +
  'Kötlu til sölu í flestum matvöruverslunum landsins.'

/* Their Starfsfólk page: name, role and the address printed under each. */
export const TEYMI = [
  { nafn: 'Rannveig Tryggvadóttir', hlutverk: 'Framkvæmdastjóri', netfang: 'rekstur@katla.is' },
  { nafn: 'Guðni Þór Sigurjónsson', hlutverk: 'Viðskiptastjóri neytendasviðs', netfang: 'neytendur@katla.is' },
  { nafn: 'Börkur Thor Rosenberg', hlutverk: 'Viðskiptastjóri fagsviðs', netfang: 'sala@katla.is' },
  { nafn: 'Sigmar Rafnsson', hlutverk: 'Viðskiptastjóri fisksviðs', netfang: 'fiskur@katla.is' },
]

/* Five facts, all theirs. */
export const KOSTIR = [
  { n: '1954', t: 'Stofnuð', d: 'Katla er fjölskyldufyrirtæki stofnað árið 1954.' },
  { n: '1986', t: 'Sama eigandi', d: 'Í sömu eigu frá 1986.' },
  { n: '4', t: 'Svið', d: 'Neytendavörur, bakarí, kjötvinnslur og sjávarútvegur.' },
  { n: 'BRC', t: 'Vottun', d: 'Fullkominn rekjanleiki á öllum vörum fyrirtækisins.' },
  { n: '340', t: 'Vörur', d: 'Neytendavörur, bakarí og kjötvinnslur í vörulistanum.' },
]

/* The four sviðs a visitor arrives for, each with the person their own
   pages name. Texts condensed from their Neytendavara, Bakarí, Kjötvinnslur
   and Sjávarútvegur pages. */
export const ERINDI = [
  {
    nafn: 'Verslanir',
    nota: 'Neytendasviðið þjónustar verslanir með reglubundnum heimsóknum. Settu vörur á pöntunarlistann eða hafðu samband við Guðna Þór, neytendur@katla.is.',
    hlekkur: '#hillan', ord: 'Í hilluna',
  },
  {
    nafn: 'Bakarí',
    nota: 'Blöndur, marsípan, smjörlíki, ger, dropar og áhöld fyrir bakarí. Börkur Thor Rosenberg, sala@katla.is, 824 4322.',
    hlekkur: 'mailto:sala@katla.is?subject=Bakar%C3%AD', ord: 'Senda fyrirspurn',
  },
  {
    nafn: 'Kjötvinnslur',
    nota: 'Katla vinnur náið með kjötvinnslum landsins og býður heildarlausn í samstarfi við birgja sína. Gísli Vagn Jónsson, kjot@katla.is.',
    hlekkur: 'mailto:kjot@katla.is?subject=Kj%C3%B6tvinnsla', ord: 'Senda fyrirspurn',
  },
  {
    nafn: 'Sjávarútvegur',
    nota: 'Hjálparefni fyrir fiskiðnað og sérframleiddar blöndur fyrir hvern viðskiptavin. Sigmar Rafnsson, fiskur@katla.is.',
    hlekkur: 'mailto:fiskur@katla.is?subject=Fiski%C3%B0na%C3%B0ur', ord: 'Senda fyrirspurn',
  },
]

/* Opening hours: the office from their footer, the goods desk from Um okkur. */
export const OPNUN = [
  { leid: 'Skrifstofan', verd: '8.00–16.00', nota: 'Mánudaga til fimmtudaga, föstudaga 8.00–15.00.' },
  { leid: 'Vöruafgreiðsla', verd: '8.00–15.45', nota: 'Virka daga, föstudaga til 12.00. Vestan megin við húsið.' },
  { leid: 'Pantanir', verd: 'Fyrir kl. 11', nota: 'Daginn fyrir afhendingardag. Lágmarkspöntun 20.000 kr.' },
]

export const TEXTI = {
  heroLinur: ['Gæðavörur', 'í íslenskan', 'bakstur'],
  heroAr: 'síðan 1954.',
  heroUndir: 'Vöfflumix, íslenskar pönnsur, smákökudeig, dropar, kanill, lyftiduft, matarsódi og rasp.',
  linurInn:
    'Neytendavörur í flestar matvöruverslanir landsins, hráefni fyrir bakarí og lausnir fyrir ' +
    'kjötvinnslur og fiskiðnað.',
  hillanInn:
    'Hver vara með vörunúmeri og pakkningu. Settu á pöntunarlistann og sendu eina fyrirspurn.',
  eggInn: '',
  umInn: 'Þessi fjögur svara fyrir sviðin.',
  erindiInn: 'Katla starfar á fjórum sviðum.',
  sagaInn: 'Fjölskyldufyrirtæki síðan 1954, í sömu eigu síðan 1986.',
  fotur: 'Síðan 1954',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Katla',
  legalName: 'Katla matvælaiðja ehf.',
  url: 'https://katla.is',
  telephone: '+354 567 4422',
  email: 'rekstur@katla.is',
  foundingDate: '1954',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kletthálsi 3',
    postalCode: '110',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
}

/* ------------------------------------------------------------------
   Colour. Each ground is taken off the pack standing on it (the label, the
   lid or the box); the ink per ground is the higher-contrast of white and
   the cocoa ink, and every pair clears 4.5:1.
   ------------------------------------------------------------------ */
export const GRUNNAR = {
  vofflur: '#E7A93B',    // Vöfflumix box, the waffle gold
  vanilla: '#1F7A60',    // Vanilludropar label green
  kanill: '#C77B4A',     // the cinnamon in the Kanill tub
  rasp: '#1E5DA6',       // Rasp gullið box blue
  glassur: '#F2C94C',    // the yellow tube in the Glassúr box
  kaka: '#3B2320',       // Súkkulaðikaka box, the cake
  ponnsur: '#E8D3B0',    // the batter in the Íslenskar pönnsur bottle
  rautt: '#D9161C',      // the Katla oval
  sitrona: '#E3B63A',    // Sítrónudropar label
  romm: '#A5452C',       // Rommdropar label
  kokos: '#5EA4BE',      // Smákökudeig kókos wrapper
  piparkaka: '#B23C35',  // Smákökudeig piparkökur wrapper
  salt: '#2B4C9B',       // Borðsalt blue lettering
} as const

const INK = '#2A1614'
export const BLEK_A: Record<string, string> = {
  [GRUNNAR.vofflur]: INK, [GRUNNAR.vanilla]: '#FFFFFF', [GRUNNAR.kanill]: INK,
  [GRUNNAR.rasp]: '#FFFFFF', [GRUNNAR.glassur]: INK, [GRUNNAR.kaka]: '#FFFFFF',
  [GRUNNAR.ponnsur]: INK, [GRUNNAR.rautt]: '#FFFFFF', [GRUNNAR.sitrona]: INK,
  [GRUNNAR.romm]: '#FFFFFF', [GRUNNAR.kokos]: INK, [GRUNNAR.piparkaka]: '#FFFFFF', [GRUNNAR.salt]: '#FFFFFF',
}

export type Reitur = { img: string; n: string; grunnur: string }

/* Seven packs on their own colours: the scattered grid. */
export const HERO_REITIR: Reitur[] = [
  { img: '/katla/vofflumix.webp', n: 'Vöfflumix', grunnur: GRUNNAR.vofflur },
  { img: '/katla/vanilludropar.webp', n: 'Vanilludropar', grunnur: GRUNNAR.vanilla },
  { img: '/katla/rasp-gullid.webp', n: 'Rasp gullið', grunnur: GRUNNAR.rasp },
  { img: '/katla/kanill.webp', n: 'Kanill', grunnur: GRUNNAR.kanill },
  { img: '/katla/sukkuladikaka.webp', n: 'Súkkulaðikaka', grunnur: GRUNNAR.kaka },
  { img: '/katla/glassur.webp', n: 'Glassúr', grunnur: GRUNNAR.glassur },
  { img: '/katla/islenskar-ponnsur.webp', n: 'Íslenskar pönnsur', grunnur: GRUNNAR.ponnsur },
]

/* The inline-image sentence. `b` widens the chip for the cookie-dough rolls,
   which are about 4.5:1 and would shrink to a sliver in the square chip. */
export type Biti = { t: string } | { img: string; n: string; grunnur: string; b?: number }

export const SETNING: Biti[][] = [
  [{ t: 'Dropar' }, { img: '/katla/vanilludropar.webp', n: 'Dropar', grunnur: GRUNNAR.vanilla }, { t: 'í sjö bragðtegundum,' }],
  [{ t: 'smákökudeig' }, { img: '/katla/smakokudeig-piparkokur.webp', n: 'Smákökudeig', grunnur: GRUNNAR.piparkaka, b: 2.6 }, { t: 'í sex,' }],
  [{ t: 'krydd' }, { img: '/katla/kanill.webp', n: 'Krydd', grunnur: GRUNNAR.kanill }, { t: 'með rauða lokinu' }],
  [{ t: 'og allt hitt í skápnum.' }],
]

export const companyEntry: PreviewCompany = {
  slug: 'katla',
  route: '/preview/katla',
  name: 'Katla',
  sector: 'Matvælaframleiðsla og heildsala',
  location: 'Kletthálsi 3, 110 Reykjavík',
  region: 'Neytendavörur í flestum matvöruverslunum landsins',
  established: 'Stofnuð 1954, í sömu eigu síðan 1986.',
  currentUrl: 'https://katla.is',
  ownerEmail: 'rekstur@katla.is',
  concept: 'Gæðavörur í íslenskan bakstur',
  conceptTagline:
    'Katla hefur bakað með Íslendingum síðan 1954. Vefurinn byrjar á vörunum sjálfum, dropunum og ' +
    'smákökudeiginu, og vísar verslunum, bakaríum, kjötvinnslum og fiskiðnaði hverju á sitt svið.',
  accent: '#D9161C',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}katla/vofflumix.webp`,
  ownPhotography: true,
  photoCredit:
    'Vörumyndir, merki og efni eru í eigu Kötlu matvælaiðju ehf. og sótt af katla.is 28. september 2026.',
  audit: {
    strengths: [
      'Vörumyndir með gegnsæjum bakgrunni af nánast öllum neytendavörum',
      'Vörunúmer og pakkning við 332 af 340 vörum í vörulistanum',
      'Hvert svið er með nafngreindan tengilið og beint netfang',
    ],
    weaknesses: [
      'Fréttasíðan sýnir enn „News Post Test“ og lorem ipsum texta',
      'Tvær sýnishornsfærslur standa enn á vefnum: „Þetta er nýtt bloggasafn“',
      'Forsíðunni var síðast breytt í janúar 2020 og fóturinn segir „2019 © All rights reserved“',
      'Smákökudeigið sem fór til Costco 2024 og samstarfið við Nóa Síríus sjást hvergi á vefnum',
    ],
    opportunities: [
      'Fjögur ólík svið (verslanir, bakarí, kjötvinnslur, sjávarútvegur) eiga hvert sína leið',
      'Rúmlega fjörutíu uppskriftir sem gætu vísað beint á vörurnar sem notaðar eru',
    ],
  },
  positioning:
    'Katla er ekki netverslun heldur matvælaframleiðandi sem selur til verslana, bakaría, kjötvinnsla ' +
    'og fiskiðnaðar. Vefurinn á að sýna vörurnar vel og vísa hverjum og einum á rétt svið.',
  /* No outreach drafted: Sindri has authorized the build only. */
  outreach: { subject: '', body: '' },
}

/* ------------------------------------------------------------------
   Copy for the section system. Same rule as above: every fact is theirs.
   ------------------------------------------------------------------ */

/* The three cards under "Gæðavörur síðan 1954". */
export const KORT3 = [
  { m: 'Stofnuð 1954', t: 'Fjölskyldufyrirtæki', nr: '01' },
  { m: 'Í sömu eigu síðan 1986', t: 'Tvær kynslóðir við stjórn', nr: '02' },
  { m: 'BRC vottun', t: 'Fullkominn rekjanleiki á öllum vörum', nr: '03' },
]

/* The two product panels, with their variants as swatches. The swatch
   colour is sampled off each label. Vörunúmer and pakkning are theirs
   where their own catalogue card prints them; the cookie doughs print none. */
export const SPJOLD = [
  {
    merki: 'Dropar · 30 ml', titill: 'Dropar',
    tegundir: [
      { nr: '10214', n: 'Vanilludropar', pk: '24 × 30 ml', img: 'vanilludropar', lit: '#1F7A60', pdf: '' },
      { nr: '10217', n: 'Sítrónudropar', pk: '12 × 30 ml', img: 'sitronudropar', lit: '#E3B63A', pdf: '' },
      { nr: '10221', n: 'Rommdropar', pk: '24 × 30 ml', img: 'rommdropar', lit: '#A5452C', pdf: '' },
      { nr: '10216', n: 'Kardimommudropar', pk: '24 × 30 ml', img: 'kardimommudropar', lit: '#865D41', pdf: '' },
      { nr: '10219', n: 'Piparmyntudropar', pk: '12 × 30 ml', img: 'piparmyntudropar', lit: '#7BA0BB', pdf: '' },
      { nr: '10215', n: 'Möndludropar', pk: '12 × 30 ml', img: 'mondludropar', lit: '#586988', pdf: '' },
      { nr: '10222', n: 'Appelsínudropar', pk: '12 × 30 ml', img: 'appelsinudropar', lit: '#D7832F', pdf: '' },
    ],
  },
  {
    merki: 'Smákökudeig · sex tegundir', titill: 'Smákökudeig',
    tegundir: [
      { nr: '', n: 'Piparkökur', pk: 'Smákökudeig', img: 'smakokudeig-piparkokur', lit: '#B23C35', pdf: '' },
      { nr: '', n: 'Súkkulaðibitar', pk: 'Smákökudeig', img: 'smakokudeig-sukkuladibitar', lit: '#714B3E', pdf: '' },
      { nr: '', n: 'Hvítt súkkulaði', pk: 'Smákökudeig', img: 'smakokudeig-hvitt-sukkuladi', lit: '#E6DCCB', pdf: '' },
      { nr: '', n: 'Kókos', pk: 'Smákökudeig', img: 'smakokudeig-kokos', lit: '#5EA4BE', pdf: '' },
      { nr: '', n: 'Engifer', pk: 'Smákökudeig', img: 'smakokudeig-engifer', lit: '#D39862', pdf: '' },
      { nr: '', n: 'Lakkrís', pk: 'Smákökudeig', img: 'smakokudeig-lakkris', lit: '#2B2B2B', pdf: '' },
    ],
  },
]

/* The catalogue carousel: one card per product group (katalogur.ts). */
export const LINUR = [
  { s: 'blondur', t: 'Bakstursblöndur', img: 'vofflumix', g: '#E7A93B', d: 'Vöfflumix, íslenskar pönnsur, amerískar pönnukökur og súkkulaðikaka.' },
  { s: 'dropar', t: 'Dropar', img: 'vanilludropar', g: '#1F7A60', d: 'Vanillu, sítrónu, romm, kardimommu, piparmyntu, möndlu og appelsínu.' },
  { s: 'deig', t: 'Smákökudeig', img: 'smakokudeig-sukkuladibitar', g: '#B23C35', d: 'Piparkökur, súkkulaðibitar, hvítt súkkulaði, kókos, engifer og lakkrís.' },
  { s: 'krydd', t: 'Krydd og bakstur', img: 'lyftiduft', g: '#C77B4A', d: 'Kanill, lyftiduft, matarsódi, hjartarsalt, vanillusykur, glassúr og rasp.' },
  { s: 'salt', t: 'Salt', img: 'bordsalt', g: '#2B4C9B', d: 'Borðsalt, sjávarsalt, gróft salt og Epsom salt.' },
  { s: 'bakari', t: 'Bakarí', img: 'glassur', g: '#F2C94C', d: 'Blöndur, marsípan, smjörlíki, ger, dropar og áhöld fyrir bakarí.' },
  { s: 'kjot', t: 'Kjötvinnslur', img: 'sjavarsalt', g: '#3B2320', d: 'Krydd, kryddblöndur, marineringar, raspur og net fyrir kjötvinnslur.' },
]

/* The history as a table: a group label, then rows with the year right. */
export const SOGUHOPAR = [
  { h: 'Katla', r: [{ t: 'Katla stofnuð', a: '1954' }, { t: 'Katla matvælaiðja kaupir Kötlu, í sömu eigu síðan', a: '1986' }] },
  { h: 'Fjölskyldan', r: [{ t: 'Rannveig Tryggvadóttir tekur við sem framkvæmdastjóri við hlið föður síns', a: '2019' }] },
  { h: 'Smákökudeig', r: [{ t: 'Smákökudeig með Pipp og Eitt sett, þróað með Nóa Síríus', a: '2023' }, { t: 'Útflutningur í 29 verslanir Costco í Bretlandi og eina í Svíþjóð', a: '2024' }] },
]

/* Spurt og svarað: each answer is a fact already on katla.is. */
export const SPURT = [
  { q: 'Hvar fást vörur Kötlu?', a: 'Neytendavörur Kötlu eru til sölu í flestum matvöruverslunum landsins. Neytendasviðið heimsækir verslanir reglulega svo vörurnar séu alltaf til staðar.' },
  { q: 'Hvernig panta fyrirtæki?', a: 'Pantanir verða að berast fyrir kl. 11 daginn fyrir afhendingardag og lágmarkspöntun er 20.000 kr. Settu vörur á pöntunarlistann eða hafðu samband við rétt svið.' },
  { q: 'Hvenær er vöruafgreiðslan opin?', a: 'Vöruafgreiðslan er vestan megin við húsið á Kletthálsi 3 og er opin frá 8.00 til 15.45 alla virka daga nema föstudaga, þá til 12.00.' },
  { q: 'Er Katla með gæðavottun?', a: 'Já. Katla er vottuð samkvæmt BRC Global Standard for Food Safety, sem stærstu verslunarkeðjur heims og erlendar fiskvinnslur gera yfirleitt kröfu um.' },
  { q: 'Eru uppskriftir á vefnum?', a: 'Já, rúmlega fjörutíu: vöfflur, kanilsnúðar, sörur, jólakonfekt, súkkulaðikaka og fleira.' },
  { q: 'Hverjir eiga Kötlu?', a: 'Katla er fjölskyldufyrirtæki, stofnað 1954 og í sömu eigu frá 1986. Tryggvi Magnússon er forstjóri og Rannveig Tryggvadóttir framkvæmdastjóri.' },
]

/* The gallery strip: consumer packs with their catalogue data. */
export const GALLERI = [
  { img: 'vofflumix', nr: '10208', n: 'Vöfflumix', pk: '15 × 500 g', g: '#E7A93B', pdf: '' },
  { img: 'vanilludropar', nr: '10214', n: 'Vanilludropar', pk: '24 × 30 ml', g: '#1F7A60', pdf: '' },
  { img: 'kanill', nr: '15783', n: 'Kanill', pk: '10 × 120 g', g: '#C77B4A', pdf: '' },
  { img: 'smakokudeig-piparkokur', nr: '', n: 'Smákökudeig piparkökur', pk: 'Smákökudeig', g: '#B23C35', pdf: '' },
  { img: 'rasp-gullid', nr: '10240', n: 'Rasp gullið', pk: '18 × 300 g', g: '#1E5DA6', pdf: '' },
  { img: 'islenskar-ponnsur', nr: '15515', n: 'Íslenskar pönnsur', pk: '18 × 300 g', g: '#E8D3B0', pdf: '' },
  { img: 'lyftiduft', nr: '15829', n: 'Lyftiduft', pk: '10 × 110 g', g: '#E7D2C4', pdf: '' },
  { img: 'sukkuladikaka', nr: '15823', n: 'Súkkulaðikaka', pk: '15 × 500 g', g: '#3B2320', pdf: '' },
  { img: 'sitronudropar', nr: '10217', n: 'Sítrónudropar', pk: '12 × 30 ml', g: '#E3B63A', pdf: '' },
  { img: 'bordsalt', nr: '10232', n: 'Borðsalt', pk: '15 × 1 kg', g: '#2B4C9B', pdf: '' },
  { img: 'glassur', nr: '15630', n: 'Glassúr', pk: '10 × 500 ml', g: '#F2C94C', pdf: '' },
  { img: 'smakokudeig-kokos', nr: '', n: 'Smákökudeig kókos', pk: 'Smákökudeig', g: '#5EA4BE', pdf: '' },
  { img: 'hjartarsalt', nr: '15782', n: 'Hjartarsalt', pk: '10 × 210 g', g: '#E9D9CF', pdf: '' },
  { img: 'rommdropar', nr: '10221', n: 'Rommdropar', pk: '24 × 30 ml', g: '#A5452C', pdf: '' },
  { img: 'vanillusykur', nr: '15784', n: 'Vanillusykur', pk: '10 × 140 g', g: '#F4D9D3', pdf: '' },
  { img: 'baunasupu-grunnur', nr: '15680', n: 'Baunasúpugrunnur', pk: '6 × 1 l', g: '#D7B473', pdf: '' },
]

/* The quote's image chips cycle through these. */
export const SETNING_HRINGUR: Record<string, string[]> = {
  Dropar: ['vanilludropar', 'sitronudropar', 'rommdropar', 'kardimommudropar', 'piparmyntudropar', 'mondludropar', 'appelsinudropar'],
  Smákökudeig: ['smakokudeig-piparkokur', 'smakokudeig-sukkuladibitar', 'smakokudeig-hvitt-sukkuladi', 'smakokudeig-kokos', 'smakokudeig-engifer', 'smakokudeig-lakkris'],
  Krydd: ['kanill', 'karri', 'lyftiduft', 'matarsodi-dos', 'vanillusykur', 'hjartarsalt'],
}
