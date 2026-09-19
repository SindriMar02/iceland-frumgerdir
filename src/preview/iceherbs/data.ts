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
  heroYfir: 'Úr sama grasi',
  heroAr: 'síðan 1993',
  heroUndir:
    'Fjallagrös, tínd og unnin á Íslandi. Mixtúrur frá 1995, bætiefni frá 2012, húðvörur frá 2017.',
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
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir ICEHERBS',
    body: `Sæl Katrín,

Ég rakst á söguna á bak við ICEHERBS um daginn og hún sat eftir í mér. Að sveitarfélög fyrir norðan hafi stofnað félag árið 1993 til þess eins að fjallagrösin hættu að fara óunnin úr landi, og að sama grasið sé enn í hálsmixtúrunni, hylkinu og handkreminu rúmum þrjátíu árum síðar, það er saga sem fá íslensk vörumerki eiga. Ég sé líka að það er unnið í vefnum hjá ykkur nánast í hverri viku.

Þess vegna langaði mig að nefna eitt. Þegar ég opnaði vörusíðu í síma lá póstlistagluggi yfir vörumyndinni og vafrakökuborði á ensku yfir kaupahnappnum, á sama tíma. Ég komst ekki að kaupunum fyrr en ég hafði lokað hvoru tveggja. Mér fannst rétt að þið vissuð af því, því þetta er fólkið sem er þegar komið alla leið að því að kaupa.

Ég bjó til hugmynd að því hvernig forsíðan gæti litið út ef sagan frá 1993 fengi að byrja hana og línurnar fjórar röðuðust utan um grasið sjálft, með ykkar eigin myndum, verðum og texta. Hana má skoða hvenær sem er á [HLEKKUR Á FRUMGERÐ], og hún virkar vel í síma. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Ef þetta á ekki við hjá ykkur er það að sjálfsögðu allt í lagi. Endilega látið mig vita ef þið hafið áhuga á að heyra meira.

Bestu kveðjur,
Sindri Már
845-1758
sndrstudio.is`,
  },
}
