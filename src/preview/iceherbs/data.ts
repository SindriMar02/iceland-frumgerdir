import type { PreviewCompany } from '../company-types'

const BASE = import.meta.env.BASE_URL

/* Editorial layer. Facts marked "þeirra" are quoted or condensed from Iceherbs'
   own pages (/about-us, /pakki-posthus, /skilmalar); everything else is written
   for this proposal and is marked as such. Nothing is invented about the
   company: no reviews, no awards, no stockist we have not verified. */

export const FYRIRTAEKI = {
  nafn: 'ICEHERBS',
  logadi: 'Kavita ehf.',
  kt: '660712-0460',
  heimili: 'Akralind 2, 201 Kópavogur',
  framleidsla: 'Húnabraut 33, 540 Blönduós',
  simi: '510 8500',
  simiHref: 'tel:+3545108500',
  netfang: 'hallo@iceherbs.is',
}

/* Their own history, condensed from /about-us. Every year is theirs. */
export const SAGAN = [
  {
    ar: '1993',
    titill: 'Íslensk fjallagrös hf.',
    texti:
      'Sveitarfélög á Norðurlandi stofna félagið til að vinna íslensk fjallagrös hér heima. ' +
      'Fram að því höfðu grösin verið flutt úr landi óunnin.',
  },
  {
    ar: '1995',
    titill: 'Fyrsta hálsmixtúran',
    texti: 'Hálsmixtúrur undir vörumerkinu ICEHERBS koma í verslanir og hafa verið til sölu síðan.',
  },
  {
    ar: '2012',
    titill: 'Bætiefni í hylkjum',
    texti: 'Vöruþróun og framleiðsla á hreinum bætiefnum í hylkjum hefst.',
  },
  {
    ar: '2016',
    titill: 'Kavita ehf.',
    texti: 'Vörumerkið flyst í nýtt félag. Katrín Amni tekur við framkvæmdastjórn.',
  },
  {
    ar: '2017',
    titill: 'ICEHERBS SKIN',
    texti: 'Húðvörur bætast við. Varasalvar með fjallagrösum voru fyrstir í vöruþróun.',
  },
]

/* Their own words, from /about-us. Used as the pull quote. */
export const TILVITNUN =
  'Fyrirtækið hefur að markmiði að nýta náttúruauðlindir, sem eru tengdar við sögu og ' +
  'hefðir íslensku þjóðarinnar, og gera þær að neytendavænum vörum.'

export const TEYMI = [
  { nafn: 'Katrín Amni Friðriksdóttir', hlutverk: 'Framkvæmdastjóri' },
  { nafn: 'Ágúst Sindri Karlsson', hlutverk: 'Fjármálastjóri' },
  { nafn: 'Vigdís Guðmundsdóttir', hlutverk: 'Vef og samfélagsmiðlar' },
  { nafn: 'Berglind Gerða Sigurðardóttir', hlutverk: 'Söludeild' },
  { nafn: 'Sunna Sveinsdóttir', hlutverk: 'Söludeild' },
  { nafn: 'Guðrún Le Sage De-Fontenay', hlutverk: 'Grafískur hönnuður' },
]

/* Five facts, all of them theirs and all of them checkable on their own site.
   No claim here that Iceherbs does not already make in public. */
export const KOSTIR = [
  { n: '1993', t: 'Sama grasið', d: 'Fjallagrös hafa verið uppistaðan í vörunum frá fyrsta degi félagsins.' },
  { n: '540', t: 'Framleitt á Blönduósi', d: 'Framleiðslan er í Húnabraut 33, ekki flutt inn tilbúin.' },
  { n: '1995', t: 'Mixtúrur í þrjátíu ár', d: 'Hálsmixtúrurnar hafa verið samfellt í sölu síðan 1995.' },
  { n: '20', t: 'Vegan vörur', d: 'Tuttugu vörur í línunni eru merktar vegan.' },
  { n: '12.000', t: 'Frí heimsending', d: 'Pantanir yfir 12.000 kr. eru sendar frítt hvert á land sem er.' },
]

/* Verified stockists only. Sourced 2026-09-19: lyfja.is/voerumerki/iceherbs,
   heilsuhusid.is, apotekarinn.is. Their own /solustadir page is empty, which is
   the point of putting this section on the page at all. */
export const SOLUSTADIR = [
  { nafn: 'Lyfja', nota: 'Um allt land og í netverslun' },
  { nafn: 'Heilsuhúsið', nota: 'Verslanir á höfuðborgarsvæðinu og á landsbyggðinni' },
  { nafn: 'Apótekarinn', nota: 'Valdar verslanir' },
]

/* Delivery, condensed from their own /pakki-posthus page. Prices are theirs. */
export const SENDING = [
  { leid: 'Póstbox', verd: 'kr. 990', nota: 'Opið allan sólarhringinn, afhent daginn eftir í 90% tilvika.' },
  { leid: 'Pakki á pósthús', verd: 'kr. 1.190', nota: 'Sóttur á pósthús gegn framvísun skilríkja. Geymdur í 30 daga.' },
  { leid: 'Pakki heim', verd: 'kr. 1.490', nota: 'Keyrður heim 1 til 3 dögum eftir póstlagningu.' },
]

export const TEXTI = {
  /* Written for this proposal, from their own facts. */
  /* The reference's hero headline is a four-line sentence filling the left
     half of the screen, not a two-word title. This is the same shape, and
     every clause in it is a fact already on their own site. */
  heroLinur: ['Sama grasið er í', 'mixtúrunni, hylkinu', 'og handkreminu,'],
  heroAr: 'síðan 1993',
  heroYfir: 'Úr sama grasi',
  heroUndir: 'Fjallagrös, tínd og unnin á Íslandi',
  familiurInn:
    'Fjórar línur, allar byggðar á sama hráefninu. Mixtúrurnar komu fyrst og eru enn gerðar eftir sömu hugmynd.',
  pakkarInn:
    'Pakkarnir eru settir saman eftir því hvernig fólki líður, ekki eftir vöruflokkum.',
  hudInn: 'ICEHERBS SKIN byrjaði á varasalvum með fjallagrösum. Línan er orðin ellefu vörur.',
  umInn: 'Kavita ehf. á vörumerkið. Sex manns vinna við það.',
  solustadirInn:
    'Hægt er að versla beint hér, eða taka vörurnar með úr hillu á þessum stöðum.',
  greinarInn: 'Greinar um hráefnin og hvernig fólk notar þau.',
  sjalfbaerni:
    'Fjallagrös voru flutt úr landi óunnin þangað til 1993. Félagið var stofnað til að vinna þau hér.',
  fotur: 'Úr íslenskri náttúru',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ICEHERBS',
  legalName: 'Kavita ehf.',
  url: 'https://iceherbs.is',
  telephone: '+354 510 8500',
  email: 'hallo@iceherbs.is',
  foundingDate: '1993',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Akralind 2',
    postalCode: '201',
    addressLocality: 'Kópavogur',
    addressCountry: 'IS',
  },
}

export const companyEntry: PreviewCompany = {
  slug: 'iceherbs',
  route: '/preview/iceherbs',
  name: 'ICEHERBS',
  sector: 'Bætiefni, mixtúrur og húðvörur',
  location: 'Akralind 2, 201 Kópavogur',
  region: 'Framleiðsla á Blönduósi, sala um allt land',
  established: 'Kavita ehf., rætur til 1993. Sex starfsmenn.',
  currentUrl: 'https://iceherbs.is',
  ownerEmail: 'hallo@iceherbs.is',
  concept: 'Úr sama grasi',
  conceptTagline:
    'Fjallagrös eru í hverri einustu línu, frá hálsmixtúrunni 1995 til varasalvans 2017. ' +
    'Vefurinn er byggður utan um það eina hráefni í stað þess að telja upp 216 vörur í stafrófsröð.',
  accent: '#25422D',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}iceherbs/3D-mix-Sofdurott-600x600-1.webp`,
  ownPhotography: true,
  photoCredit:
    'Vörumyndir og efni eru í eigu Kavita ehf. og sótt af iceherbs.is 19. september 2026.',
  audit: {
    strengths: [
      'Eigin framleiðsla á Blönduósi og saga aftur til 1993, þegar fjallagrös voru enn flutt úr landi óunnin',
      'Nöfnin á pökkunum eru besti textinn á vefnum: Flensubaninn, Álagstímar, Næturbrölt, Bjútíbarinn',
      'Vörurnar fást líka í Lyfju, Heilsuhúsinu og Apótekaranum, svo vörumerkið er þekkt úr hillu',
    ],
    weaknesses: [
      'JavaScript-villa kastast á hverri einustu síðu, líka í körfunni: $j(...).select2 is not a function',
      'Forsíðan er 11,4 MB í 303 köllum og tekur 6,4 sekúndur að róast',
      'Í síma liggja tvö lög ofan á vörusíðunni: 15% póstlistagluggi yfir myndinni og enskur vafrakökuborði yfir kaupahnappnum',
      'Síðan „Aðrir sölustaðir ICEHERBS“ er tóm, þótt vörurnar fáist í þremur apótekskeðjum',
      'Fjórtán af sautján innsláttarreitum á vörusíðu eru undir 16 px, svo iPhone þysjar inn við hvern smell',
    ],
    opportunities: [
      'Tuttugu tilboðspakkar kosta 4.390 til 8.990 kr. og eru allir undir 12.000 kr. mörkunum í fría sendingu',
      'Mánaðaráskrift er þegar til á vörunum en hvergi sýnd sem valkostur á forsíðu',
      'Tuttugu og fjórar greinar liggja á vefnum og eru ekki tengdar við vörurnar sem þær fjalla um',
    ],
  },
  positioning:
    'ICEHERBS er ekki heilsuvörumerki sem fann sér sögu. Félagið var stofnað 1993 af sveitarfélögum ' +
    'á Norðurlandi til að vinna fjallagrös hér heima í stað þess að flytja þau út óunnin, og sama ' +
    'grasið er enn í mixtúrunni, hylkinu og handkreminu. Vefurinn á að byrja þar og láta vöruúrvalið ' +
    'hanga á því, í stað þess að opna á 216 vörur í stafrófsröð á bak við tvo glugga.',
  /* Draft, NOT sent. Source of truth is _hq/data/outreach-drafts/iceherbs.md,
     which passes scripts/outreach-draft-gate.mjs (all ten shape checks). The
     link is live and preflight-outreach.mjs PASSED against it on 2026-09-19.
     Paragraph three was re-verified on the live Icelandic product page the
     same day; the earlier "two layers over the buy button" framing was cut
     because the Klaviyo popup did not fire on re-check. */
  /* Draft, NOT sent. Source of truth is _hq/data/outreach-drafts/iceherbs.md,
     which passes scripts/outreach-draft-gate.mjs. The link is live and
     preflight-outreach.mjs PASSED against it on 2026-09-19.

     Two claims were cut on re-check, both of which had survived into an
     earlier draft. Paragraph three no longer says a newsletter popup and a
     cookie banner sat over the buy button at once: the Klaviyo popup did not
     fire on re-check. Paragraph two no longer says the site is worked on
     "nánast í hverri viku": 67 uploads in the last 365 days fall in only 20
     distinct weeks of 52, with a 41 day gap and two empty months in 2026.
     Same-day bursts are what made the yearly total read as weekly work. */
  outreach: {
    subject: "Hugmynd að nýrri vefsíðu fyrir ICEHERBS",
    body: "Sæl Katrín,\n\nÉg rakst á söguna á bak við ICEHERBS um daginn og hún sat eftir í mér. Að sveitarfélög fyrir norðan hafi stofnað félag árið 1993 til þess eins að fjallagrösin hættu að fara óunnin úr landi, og að sama grasið sé enn í hálsmixtúrunni, í hylkinu og í handkreminu rúmum þrjátíu árum síðar. Það eru ekki mörg íslensk vörumerki sem eiga svoleiðis sögu, og enn færri sem framleiða enn sjálf.\n\nÉg sé líka að þið eruð enn að bæta við efni, nýjustu vörumyndirnar fóru inn núna í september. Það er greinilega fólk á bak við þetta sem hefur áhuga á því sem það er að gera, og það skilar sér í textanum. Nöfnin á pökkunum finnst mér það besta á vefnum, Flensubaninn og Næturbrölt og Álagstímar.\n\nÞess vegna langaði mig að nefna eitt lítið. Þegar ég opnaði vörusíðu í símanum kom vafrakökuborðinn upp á ensku, á annars íslenskri síðu. Þetta er lítið atriði en það er það fyrsta sem fólk sér.\n\nMér datt í hug að prófa hvernig forsíðan gæti litið út ef sagan frá 1993 fengi að byrja hana, og línurnar fjórar röðuðust utan um grasið sjálft frekar en að opna á allar vörurnar í einu. Ég notaði ykkar eigin vörumyndir, verð og texta, svo þið sjáið þetta með ykkar eigin efni en ekki einhverju sýnishorni. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.\n\nHana má skoða hér hvenær sem er, og hún virkar vel í síma:\nhttps://sindrimar02.github.io/iceland-frumgerdir/preview/iceherbs\n\nÉg sé líka um hýsingu, viðhald og uppfærslur á síðum sem ég geri, ef það er eitthvað sem þið hafið áhuga á.\n\nEf þetta á ekki við hjá ykkur er það að sjálfsögðu allt í lagi. Endilega látið mig vita ef þið viljið heyra meira.\n\nBestu kveðjur,\nSindri Már\n845-1758\nsndrstudio.is",
  },
}

/* ------------------------------------------------------------------
   Hero tiles. The reference fills the right half of the hero with a
   4x3 grid in which only seven of twelve cells are used, each a
   full-bleed saturated photograph. Iceherbs has pack shots on
   transparency rather than editorial photography, so the saturation
   has to come from somewhere honest: every ground below was sampled
   with `magick histogram` off the label of the product standing on
   it. Nothing here is a colour I chose.
   ------------------------------------------------------------------ */
export type Reitur = { img: string; n: string; grunnur: string; uppruni: string }

export const HERO_REITIR: Reitur[] = [
  {
    img: '/iceherbs/reitir/230010_ICEHERBS-HALSMIXTURA-LAKKRIS-200ML_600X600.webp',
    n: 'Hálsmixtúra með lakkrís',
    grunnur: '#8A6B81',
    uppruni: 'plómulitur af lakkrísmiðanum',
  },
  {
    img: '/iceherbs/reitir/230011_ICEHERBS-HALSMIXTURA-HUN.PIPARM200ML_600X600.webp',
    n: 'Hálsmixtúra með hunangi og piparmyntu',
    grunnur: '#9DB956',
    uppruni: 'piparmyntugrænn af miðanum',
  },
  {
    img: '/iceherbs/reitir/220240_ICEHERBS-C-VITAMIN-ENGIFER-FLENSUBANI-60-HYLKI_600X600.webp',
    n: 'C-vítamín og engifer',
    grunnur: '#DFA548',
    uppruni: 'engiferguli af miðanum',
  },
  {
    img: '/iceherbs/reitir/220250_ICEHERBS-ASTAXANTHIN-60-PERLUR_600X600.webp',
    n: 'Astaxanthin',
    grunnur: '#BE5349',
    uppruni: 'astaxanthin-rauður af miðanum',
  },
  {
    img: '/iceherbs/reitir/3D-mix-Sofdurott-600x600-1.webp',
    n: 'Sofðu rótt',
    grunnur: '#4D6B93',
    uppruni: 'næturblár af Sofðu rótt',
  },
  {
    img: '/iceherbs/reitir/3D-ermi-framm-Hand.webp',
    n: 'ICEHERBS SKIN handkrem',
    grunnur: '#759FA0',
    uppruni: 'djúpi jöklatónninn af SKIN-öskjunni',
  },
  {
    img: '/iceherbs/reitir/220010_ICEHERBS-ICELAND-MOSS-60-CAPSULES_600X600.webp',
    n: 'Fjallagrös í hylkjum',
    grunnur: '#3D5B42',
    uppruni: 'mosagrænn af fjallagrasaglasinu',
  },
]

/* The reference's signature device: one display-size sentence with small
   images set inline between the words, sitting on the text baseline.

   It is segmented into explicit LINES, which is how the reference does it
   (div.title-line-parent > div.title-line, one per line) and is not
   cosmetic: each line needs its own block-level overflow:hidden mask to
   rise out of. Wrapping the text runs themselves in inline masks collapses
   the box and cuts the glyphs off, which is exactly what it did here.

   Written for this proposal from their own mission statement, which is
   quoted verbatim and separately in TILVITNUN. */
export type Biti = { t: string } | { img: string; n: string; grunnur: string }

export const SETNING: Biti[][] = [
  [
    { t: 'Náttúruauðlind' },
    { img: '/iceherbs/reitir/220010_ICEHERBS-ICELAND-MOSS-60-CAPSULES_600X600.webp', n: 'Fjallagrös í hylkjum', grunnur: '#3D5B42' },
    { t: 'sem tengist' },
  ],
  [
    { t: 'sögu' },
    { img: '/iceherbs/reitir/230010_ICEHERBS-HALSMIXTURA-LAKKRIS-200ML_600X600.webp', n: 'Hálsmixtúra', grunnur: '#8A6B81' },
    { t: 'og hefðum þjóðarinnar,' },
  ],
  [
    { t: 'gerð' },
    { img: '/iceherbs/reitir/3D-ermi-framm-Hand.webp', n: 'SKIN handkrem', grunnur: '#759FA0' },
    { t: 'að vöru sem fólk' },
  ],
  [{ t: 'notar daglega' }],
]

/* The seven grounds, named. Every one was sampled off an Iceherbs label
   with `magick histogram`; none was picked from a palette. Used by the
   hero tiles, the four line cards and the bundle grid so that the colour
   on this page always traces back to a bottle that exists. */
export const GRUNNAR = {
  ploma: '#8A6B81',
  piparmynta: '#9DB956',
  engifer: '#DFA548',
  astaxanthin: '#BE5349',
  nott: '#4D6B93',
  jokull: '#759FA0',
  mosi: '#3D5B42',
} as const

export const GRUNNROD = [
  GRUNNAR.engifer, GRUNNAR.ploma, GRUNNAR.nott, GRUNNAR.piparmynta,
  GRUNNAR.astaxanthin, GRUNNAR.jokull, GRUNNAR.mosi,
]

/* Which ink each ground takes. Not a judgement call: computed from the
   WCAG relative-luminance formula against #FFFFFF and #24232C, the
   higher ratio wins, and every pair below clears 4.5:1.
   ploma 4.67 / piparmynta 7.03 / engifer 7.11 / astaxanthin 4.64 /
   nott 5.47 / jokull 5.34 / mosi 7.57 */
export const BLEK_A: Record<string, string> = {
  [GRUNNAR.ploma]: '#FFFFFF',
  [GRUNNAR.piparmynta]: '#24232C',
  [GRUNNAR.engifer]: '#24232C',
  [GRUNNAR.astaxanthin]: '#FFFFFF',
  [GRUNNAR.nott]: '#FFFFFF',
  [GRUNNAR.jokull]: '#24232C',
  [GRUNNAR.mosi]: '#FFFFFF',
}
