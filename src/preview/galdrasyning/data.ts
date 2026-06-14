/**
 * Galdrasýning á Ströndum — content + drawn galdrastafir geometry.
 *
 * The museum (Strandagaldur, est. 2000) tells the story of Icelandic folk
 * magic and the 17th-century witch trials (galdrabrennur) on Strandir. Two
 * sites: the main exhibition in Hólmavík and the sorcerer's cottage in
 * Bjarnarfjörður. All hours/prices below are SAMPLE/typical and disclaimed.
 *
 * The stave paths are stylised, original line drawings inspired by the visual
 * grammar of galdrastafir (a central axis with symmetric arms and terminals) —
 * they are decorative motifs, not reproductions of any specific historical
 * stave. Drawn with a stroke-dashoffset "inscribe" animation.
 */

/** Single moody atmospheric band photo (Unsplash id). */
export const ATMO_ID = 'photo-1487621167305-5d248087c724'

/** A drawn stave: viewBox is 0 0 120 120; paths are stroked, not filled. */
export interface Stave {
  /** Short Icelandic name shown as a label */
  name: string
  /** One-line, factual gloss of what such staves were believed to do */
  gloss: string
  /** SVG path data, all within the 120×120 box */
  paths: string[]
}

/**
 * Four original stave motifs. Each is built on a symmetric cross/axis the way
 * historical galdrastafir are, so they read as ceremonial line-work.
 */
export const STAVES: Stave[] = [
  {
    name: 'Vegvísir',
    gloss: 'Leiðarstafur — átti að vísa veginn í óveðri og villu.',
    paths: [
      'M60 8 V112',
      'M8 60 H112',
      'M23 23 L97 97',
      'M97 23 L23 97',
      'M60 8 L52 22 M60 8 L68 22',
      'M60 112 L52 98 M60 112 L68 98',
      'M8 60 L22 52 M8 60 L22 68',
      'M112 60 L98 52 M112 60 L98 68',
      'M23 23 L24 38 M23 23 L38 24',
      'M97 97 L96 82 M97 97 L82 96',
      'M97 23 L96 38 M97 23 L82 24',
      'M23 97 L24 82 M23 97 L38 96',
    ],
  },
  {
    name: 'Ægishjálmur',
    gloss: 'Óttastafur — borinn til verndar og hugrekkis.',
    paths: [
      'M60 60 V14',
      'M60 60 V106',
      'M60 60 H14',
      'M60 60 H106',
      'M60 14 L54 26 M60 14 L66 26',
      'M60 106 L54 94 M60 106 L66 94',
      'M14 60 L26 54 M14 60 L26 66',
      'M106 60 L94 54 M106 60 L94 66',
      'M40 32 H80',
      'M40 88 H80',
      'M32 40 V80',
      'M88 40 V80',
    ],
  },
  {
    name: 'Lukkustafur',
    gloss: 'Heillastafur — ristur til gæfu og góðs gengis.',
    paths: [
      'M60 10 V110',
      'M30 30 L90 90',
      'M90 30 L30 90',
      'M60 10 C40 28 40 44 60 52 C80 44 80 28 60 10 Z',
      'M60 110 C44 96 44 84 60 78 C76 84 76 96 60 110 Z',
      'M22 60 L34 54 M22 60 L34 66',
      'M98 60 L86 54 M98 60 L86 66',
    ],
  },
  {
    name: 'Þjófastafur',
    gloss: 'Stuldarstafur — átti að standa þjóf að verki.',
    paths: [
      'M60 12 V108',
      'M24 36 H96',
      'M24 84 H96',
      'M24 36 L24 50 M24 36 L38 36',
      'M96 36 L96 50 M96 36 L82 36',
      'M24 84 L24 70 M24 84 L38 84',
      'M96 84 L96 70 M96 84 L82 84',
      'M60 12 L52 24 M60 12 L68 24',
      'M60 108 L52 96 M60 108 L68 96',
      'M48 60 H72',
    ],
  },
]

/** What you'll see — the exhibition described in evocative typography. */
export interface Exhibit {
  kicker: string
  title: string
  body: string
}

export const EXHIBITS: Exhibit[] = [
  {
    kicker: 'Sýningin',
    title: 'Stafirnir og bækurnar',
    body: 'Ristir galdrastafir, eftirgerðir galdrabóka og munir sem segja sögu þess tíma þegar fólk trúði því að orð og tákn gætu beygt veröldina. Hver stafur átti sitt hlutverk — til verndar, gæfu eða hefndar.',
  },
  {
    kicker: 'Munir',
    title: 'Nábrókin',
    body: 'Þekktasti og umtalaðasti gripur safnsins er eftirgerð af nábrók — buxum sem þjóðsagan segir að ættu að draga að sér peninga. Hún er sýnd af virðingu sem heimild um forna þjóðtrú, ekki sem hryllingur.',
  },
  {
    kicker: 'Stemning',
    title: 'Hálfrökkur og kertaljós',
    body: 'Sýningin er sögð í hálfrökkri. Textinn er borinn fram með alúð: þetta er menningararfur og harmsaga fólks, ekki tjaldabúð. Þú gengur hægt, lest og hlustar.',
  },
]

/** Practical visit facts — SAMPLE/typical, disclaimed in footer. */
export const SITES = [
  {
    name: 'Hólmavík',
    role: 'Aðalsýning og Kaffi Galdur',
    desc: 'Sjálf galdrasýningin, safnbúð og kaffihúsið Kaffi Galdur niðri við höfnina í Hólmavík.',
  },
  {
    name: 'Bjarnarfjörður',
    role: 'Kotbýli kuklarans',
    desc: 'Endurgert torfbýli norðar á Ströndum þar sem sögð er saga galdramannsins og daglegs lífs á 17. öld.',
  },
]

export const HOURS = [
  { when: 'Sumar (jún–ágú)', time: 'Daglega 10–18' },
  { when: 'Vetur (sep–maí)', time: 'Eftir samkomulagi' },
]

export interface Ticket {
  name: string
  price: string
  note: string
}

export const TICKETS: Ticket[] = [
  { name: 'Fullorðnir', price: '2.500 kr.', note: 'Aðgangur að sýningu' },
  { name: 'Eldri borgarar & námsmenn', price: '1.900 kr.', note: 'Gegn framvísun skírteinis' },
  { name: 'Börn (yngri en 14 ára)', price: 'Frítt', note: 'Í fylgd með fullorðnum' },
]

/** Google Maps link to Hólmavík main museum. */
export const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Galdras%C3%BDning+%C3%A1+Str%C3%B6ndum+H%C3%B3lmav%C3%ADk'
