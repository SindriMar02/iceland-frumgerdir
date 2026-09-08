/**
 * Icelandic first, English second — the toggle sits in the far-right nav cluster
 * exactly where the reference keeps its cart. Every string is a pair so nothing
 * can silently fall back to English on an Icelandic page.
 *
 * Note what is NOT here, compared with the Áslaug Saja build this is branched
 * from: no price, no technique, no size, no colour axis. Sossa publishes none of
 * those, and a label with nothing true behind it is worse than no label.
 */
export type Lang = 'is' | 'en'

type Pair = readonly [is: string, en: string]

export const T = {
  bySeries: ['EFTIR SÝNINGUM', 'BY EXHIBITION'],
  all: ['ÖLL VERK', 'ALL WORK'],
  about: ['UM', 'ABOUT'],
  cv: ['FERILL', 'CV'],
  contact: ['SAMBAND', 'CONTACT'],
  collection: ['SAFN', 'SELECTION'],
  menu: ['YFIRLIT', 'INDEX'],
  close: ['LOKA', 'CLOSE'],
  pieces: ['VERK', 'PIECES'],
  works: ['VERK', 'WORKS'],
  series: ['SÝNING', 'EXHIBITION'],
  studio: ['VINNUSTOFA', 'STUDIO'],
  enquire: ['SETJA Í SAFN', 'ADD TO SELECTION'],
  inCollection: ['Í SAFNI', 'IN SELECTION'],
  remove: ['TAKA ÚR', 'REMOVE'],
  emptyCollection: [
    'Safnið er tómt. Veldu verk og sendu eina fyrirspurn.',
    'The selection is empty. Pick works and send one enquiry.',
  ],
  sendEnquiry: ['SENDA FYRIRSPURN', 'SEND ENQUIRY'],
  next: ['NÆSTA', 'NEXT'],
  prev: ['FYRRA', 'PREVIOUS'],
  list: ['LISTI', 'LIST'],
  grid: ['REITIR', 'GRID'],
  backToSeries: ['TIL BAKA', 'BACK'],
  scrollHint: ['SKRUNAÐU', 'SCROLL'],
  enquiryIntro: [
    'Verkin eru til sölu í gegnum vinnustofuna. Veldu þau sem þú vilt spyrjast fyrir um og sendu eina fyrirspurn.',
    'Work is sold through the studio. Pick the pieces you want to ask about and send one enquiry.',
  ],
  untitledNote: [
    'Verkin bera ekki titla á vef Sossu. Þau eru merkt eftir sýningunni sem þau tilheyra og númeri innan hennar.',
    'The works carry no titles on Sossa’s own site. They are labelled by the exhibition they belong to and their number within it.',
  ],
} satisfies Record<string, Pair>

export function t(k: keyof typeof T, lang: Lang): string {
  return T[k][lang === 'is' ? 0 : 1]
}

/**
 * Every fact below is from sossa.is (about + CV pages, read 2026-09-05) or from
 * her own contact page. Nothing here is inferred, and nothing is rounded up.
 */
export const ABOUT: Record<Lang, string[]> = {
  is: [
    'Sossa Björnsdóttir hefur málað frá 1982. Hún er fædd og uppalin í Keflavík og vinnur þar enn, á vinnustofu við Mánagötu 1.',
    'Hún nam við Myndlista- og handíðaskóla Íslands 1977 til 1979, við Konunglegu dönsku listaakademíuna 1979 til 1984, og lauk meistaragráðu frá Tufts University og School of the Museum of Fine Arts í Boston 1991 til 1993.',
    'Hún er einnig með vinnustofu í Turup á Fjóni og dvelur þar nokkra mánuði á ári. Ný vinnustofa opnaði þar 7. febrúar 2026.',
    'Á hverju ári opnar hún vinnustofuna í Keflavík fyrir jólin. Verkin á þessari síðu eru sótt af hennar eigin vefsíðu og flokkuð eftir sýningunum sem þau tilheyra.',
  ],
  en: [
    'Sossa Björnsdóttir has painted since 1982. She was born and raised in Keflavík and still works there, in a studio at Mánagata 1.',
    'She studied at the Icelandic College of Art and Crafts 1977 to 1979, at the Royal Danish Academy of Fine Art 1979 to 1984, and took an MFA from Tufts University and the School of the Museum of Fine Arts in Boston, 1991 to 1993.',
    'She also keeps a studio in Turup on Funen, where she spends several months a year. A new atelier opened there on 7 February 2026.',
    'Every year she opens the Keflavík studio before Christmas. The work on this site is drawn from her own website and sorted by the exhibitions it belongs to.',
  ],
}

/**
 * Her exhibition record, transcribed from sossa.is/cv--exhibitions.html.
 * Selected, not complete — the page lists more. Never add a venue that is not
 * on that page.
 */
export const CV: { year: string; venue: Pair }[] = [
  { year: '2025', venue: ['Galleri SAM, Danmörk (samsýning)', 'Galleri SAM, Denmark (group)'] },
  { year: '2024', venue: ['Önnur nánd, Listasafn Reykjanesbæjar (samsýning)', 'Önnur nánd, Reykjanesbær Art Museum (group)'] },
  { year: '2016', venue: ['Gallery 1314½, Washington DC', 'Gallery 1314½, Washington DC'] },
  { year: '2016', venue: ['Art Apart Fair, Singapúr', 'Art Apart Fair, Singapore'] },
  { year: '2015', venue: ['Beijing Biennale, Kína', 'Beijing Biennale, China'] },
  { year: '2005', venue: ['Florence Biennale, Ítalíu', 'Florence Biennale, Italy'] },
  { year: '2001–2012', venue: ['Galleri Sct. Gertrud, Kaupmannahöfn', 'Galleri Sct. Gertrud, Copenhagen'] },
  { year: '1990', venue: ['Museum of Fine Arts, Boston', 'Museum of Fine Arts, Boston'] },
]

export const EDUCATION: { year: string; school: Pair }[] = [
  { year: '1991–1993', school: ['MFA, Tufts University og School of the Museum of Fine Arts, Boston', 'MFA, Tufts University and School of the Museum of Fine Arts, Boston'] },
  { year: '1979–1984', school: ['Konunglega danska listaakademían', 'The Royal Danish Academy of Fine Art'] },
  { year: '1977–1979', school: ['Myndlista- og handíðaskóli Íslands', 'Icelandic College of Art and Crafts'] },
]

export const STUDIOS: { place: Pair; addr: string }[] = [
  { place: ['KEFLAVÍK', 'KEFLAVÍK'], addr: 'Mánagata 1, 230 Keflavík' },
  { place: ['TURUP', 'TURUP'], addr: 'Blangstrupvej 17, 5610 Turup, Danmark' },
]

export const CONTACT = {
  email: 'sossa@sossa.is',
  phone: '+354 864 6233',
}
