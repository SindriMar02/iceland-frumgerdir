/**
 * "Fjallabjór" — content for the Austri Brugghús redesign concept.
 * East Iceland in a glass: every beer is named after an Austurland landmark,
 * and selecting one repaints the whole page in that beer's colour — pale straw
 * for the lager, deep espresso for the porter — so the palette tells the beer's
 * story, not just "amber".
 *
 * Tasting notes, ABV and prices are illustrative sample data (a real brewery
 * supplies the live tap list). The shared footer disclaims this.
 */

const U = 'https://images.unsplash.com/'
export const img = (id: string, w = 1200) => `${U}${id}?q=80&w=${w}&auto=format&fit=crop`

/* Fixed image ids referenced across the page */
export const HERO_ID = 'photo-1546622891-02c72c1537b6'
export const GLASS_ID = 'photo-1600788886242-5c96aabe3757'
export const TANKS_ID = 'photo-1532634733-cae1395e440f'
export const TAPROOM_ID = 'photo-1766500616162-4ca819ff24a3'
export const LANDSCAPE_ID = 'photo-1614267209748-664b2fd099be'
export const BARLEY_ID = 'photo-1560340325-e71cad0e133a'

export interface Beer {
  /** Beer name (Austurland landmark) */
  name: string
  /** Style, in Icelandic */
  style: string
  abv: string
  ibu: string
  /** The landmark it is named after + a one-line geo note */
  landmark: string
  landmarkNote: string
  /** Two short tasting descriptors for the chip row */
  tags: string[]
  /** Sample tasting note, Icelandic */
  notes: string
  /** Optional, true-fact highlight shown on the spotlight card (no disclaimer needed) */
  brag?: string
  /**
   * Per-beer accent that repaints the page. The set spans the real beer
   * spectrum — straw gold (lager) -> amber/rust (IPAs) -> deep cool brown
   * (porter) — so the re-tint visibly changes the page's character.
   */
  accent: string
  /** A lighter tint of the accent for small text on the dark ground (AA-safe) */
  accentSoft: string
  /**
   * How far the page ground should cool/darken for this beer (0 = no shift,
   * 1 = deepest). Drives the per-beer body tint behind the foam-coloured
   * content so a porter pulls the page darker than a pale lager.
   */
  ground: number
  /**
   * Normalised landmark "skyline" — peak heights 0..1 used to draw a bespoke
   * contour/peak silhouette per beer so the landmark is *felt*, not just named.
   */
  ridge: number[]
}

export const BEERS: Beer[] = [
  {
    name: 'Steinketill',
    style: 'IPA',
    abv: '5,8%',
    ibu: '55',
    landmark: 'Steinketill',
    landmarkNote: 'klettamyndun við Lagarfljót',
    tags: ['Sítrus', 'Furunálar'],
    notes:
      'Gullin IPA með þéttum humlailmi — greipaldin og furunálar fremst, fylgt eftir af mjúkri maltsætu og þurrum, beiskum endi sem kallar á annan sopa.',
    accent: '#e0a32e',
    accentSoft: '#f3c66e',
    ground: 0.18,
    ridge: [0.18, 0.34, 0.52, 0.88, 0.46, 0.62, 0.3, 0.2],
  },
  {
    name: 'Slöttur',
    style: 'enskur bitter',
    abv: '4,2%',
    ibu: '32',
    landmark: 'Slöttur',
    landmarkNote: 'fell ofan Egilsstaða',
    tags: ['Karamella', 'Brauð'],
    notes:
      'Sígildur enskur bitter — ristað brauð og karamella, hóflega beiskur og einstaklega drekkanlegur. Sá sem þú pantar aftur, kvöld eftir kvöld.',
    accent: '#c87a2a',
    accentSoft: '#e8a25c',
    ground: 0.34,
    ridge: [0.22, 0.4, 0.66, 0.5, 0.78, 0.42, 0.34, 0.24],
  },
  {
    name: 'Skessa',
    style: 'tvöfaldur IPA',
    abv: '8,2%',
    ibu: '70',
    landmark: 'Skessugarður',
    landmarkNote: 'náttúrulegur grjótgarður á Jökuldal',
    tags: ['Wasabi', 'Mangó'],
    notes:
      'Stór og kraftmikill tvöfaldur IPA með ferskt íslenskt wasabi — suðrænn mangó og ferskja velta fram, og wasabi-ið skilur eftir hlýja, óvænta sting. Frægasti bjórinn okkar.',
    brag: 'Bruggaður með fersku íslensku wasabi',
    accent: '#e0633a',
    accentSoft: '#f3946e',
    ground: 0.42,
    ridge: [0.3, 0.58, 0.9, 0.64, 0.86, 0.5, 0.4, 0.28],
  },
  {
    name: 'Lagarfljót',
    style: 'lager',
    abv: '4,8%',
    ibu: '22',
    landmark: 'Lagarfljót',
    landmarkNote: 'vatnið langa við Egilsstaði',
    tags: ['Kornbrauð', 'Tær'],
    notes:
      'Tær og svalandi lager — milt kornbrauð, fínleg humlabeiskja og hreinn, þurr endi. Ljósastur og léttastur í línunni; bjórinn fyrir alla.',
    accent: '#e8c34a',
    accentSoft: '#f4dd86',
    ground: 0.06,
    ridge: [0.12, 0.18, 0.26, 0.2, 0.3, 0.22, 0.16, 0.12],
  },
  {
    name: 'Snæfell',
    style: 'dökkur porter',
    abv: '6,4%',
    ibu: '40',
    landmark: 'Snæfell',
    landmarkNote: 'hæsta fjall utan jökla á Íslandi',
    tags: ['Kaffi', 'Súkkulaði'],
    notes:
      'Dökkur og hlýjandi porter — ristað kaffi, dökkt súkkulaði og vottur af lakkrís. Fyllir munninn án þess að verða þungur. Vetrarbjórinn úr fjöllunum.',
    accent: '#a96a3e',
    accentSoft: '#cf9462',
    ground: 0.92,
    ridge: [0.36, 0.6, 0.82, 0.96, 0.72, 0.84, 0.5, 0.34],
  },
]

export interface Voice {
  quote: string
  name: string
  context: string
}

export const VOICES: Voice[] = [
  {
    quote:
      'Loksins bjór sem bragðast eins og Austurland. Steinketill á krana á Aski er fastur liður í hverri ferð austur.',
    name: 'Hólmfríður',
    context: 'Reykjavík',
  },
  {
    quote:
      'Við smökkuðum Skessu eftir göngu á Snæfell og skildum allt í einu af hverju bjórarnir heita eftir fjöllunum.',
    name: 'Markús',
    context: 'gestur frá Þýskalandi',
  },
  {
    quote:
      'Besta sem þú gerir á Egilsstöðum: pizza og ferskur Austri á krana á Aski. Uppáhald heimamanna.',
    name: 'Þóra',
    context: 'Fljótsdalshérað',
  },
]

export interface Stockist {
  name: string
  where: string
  detail: string
}

export const STOCKISTS: Stockist[] = [
  {
    name: 'Askur Taproom & Pizzeria',
    where: 'Við brugghúsið, Egilsstöðum',
    detail: 'Öll kranalína Austra á krana, ásamt eldbökuðum pizzum. Hjarta brugghússins.',
  },
  {
    name: 'Vök Baths',
    where: 'Urriðavatn, við Egilsstaði',
    detail: 'Austri á krana við vatnsbakkann — bjór og böð með útsýni yfir Lagarfljót.',
  },
  {
    name: 'Veitingahús víða um Austurland',
    where: 'Seyðisfjörður · Borgarfjörður eystri · Reyðarfjörður',
    detail: 'Spurðu eftir Austra á þínum stað — við dreifum um allt Austurland.',
  },
]
