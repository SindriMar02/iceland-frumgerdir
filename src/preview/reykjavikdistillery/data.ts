/**
 * 64°08′N — Breiddargráða (The Latitude)
 *
 * Content model for the foraging-map spirit selector. Every spirit owns a
 * botanical coordinate plotted on a stylised latitude grid + abstract Iceland
 * coastline. Selecting a spirit glides a crosshair to its (x, y), crossfades
 * the page accent to the botanical colour, and rolls a Space Mono coordinate
 * readout into view.
 *
 * HONESTY: company facts (founded 2009, address, phone, real product names,
 * 64° = Reykjavík's latitude ~64.1°N) are real and public. ABV, prices, bottle
 * sizes, harvest seasons, visit availability and the botanical coordinates are
 * SAMPLE / illustrative ("til skýringar") and disclaimed on the page + in the
 * shared footer. No awards or accolades are claimed.
 */

export interface Spirit {
  /** Stable id used for ARIA + reticle targeting */
  id: string
  /** Product name (real) */
  name: string
  /** Category, Icelandic */
  type: string
  /** Sample ABV, e.g. "40% vol" — marked sample on the page */
  abv: string
  /** Lead botanical, Icelandic */
  botanical: string
  /** Where that botanical is foraged (atmospheric, sample) */
  source: string
  /** Short place label for the readout block (sample) */
  place: string
  /** Harvest window, Icelandic (sample / illustrative) */
  season: string
  /** Sample tasting notes */
  notes: string
  /** Three short palate descriptors for the tasting strip (sample) */
  palate: [string, string, string]
  /** Sample price in ISK */
  price: number
  /** Bottle size */
  size: string
  /** Botanical accent hex (page accent crossfades to this) */
  accent: string
  /** WCAG-AA-safe light tint of the accent for small text on the dark ground */
  tint: string
  /** Plotted coordinate on the SVG map viewBox (0..400 x, 0..520 y) */
  x: number
  y: number
  /** Mono coordinate readout, e.g. "64°08′N · 21°56′V" */
  coord: string
}

/** Six spirits chosen for the selector; the rest are listed in COLLECTION. */
export const SPIRITS: Spirit[] = [
  {
    id: 'einiber',
    name: 'Einiberja Gin',
    type: 'London Dry gin',
    abv: '44% vol',
    botanical: 'Einiber',
    source: 'Tínt í lyngmóum á Reykjanesi',
    place: 'Reykjanes',
    season: 'Sept–okt',
    notes: 'Þurrt og bjart. Einiber fremst, sítrusbörkur og angan af fjallagrösum í lokin.',
    palate: ['Einiber', 'Sítrus', 'Fjallagrös'],
    price: 8990,
    size: '500 ml',
    accent: '#4f8a64',
    tint: '#8fc7a3',
    x: 198,
    y: 236,
    coord: '64°08′N · 21°56′V',
  },
  {
    id: 'angelica',
    name: 'Angelica Hvönn',
    type: 'Jurtagin',
    abv: '42% vol',
    botanical: 'Ætihvönn',
    source: 'Skorin við árbakka í Borgarfirði',
    place: 'Borgarfjörður',
    season: 'Júlí–ágúst',
    notes: 'Jarðbundið og kryddað. Hvönn, engifer og þurr rótarkeimur sem situr lengi.',
    palate: ['Hvönn', 'Engifer', 'Rót'],
    price: 9490,
    size: '500 ml',
    accent: '#8a9a5b',
    tint: '#c2cf93',
    x: 156,
    y: 178,
    coord: '64°33′N · 21°46′V',
  },
  {
    id: 'rabarbari',
    name: '64° Rhubarb Gin',
    type: 'Rabarbara-líkjör',
    abv: '20% vol',
    botanical: 'Rabarbari',
    source: 'Úr görðum í Hafnarfirði',
    place: 'Hafnarfjörður',
    season: 'Júní–júlí',
    notes: 'Sætt og sýrt í senn. Bleikur rabarbari, jarðarber og mjúk vanilla undir.',
    palate: ['Rabarbari', 'Jarðarber', 'Vanilla'],
    price: 7490,
    size: '500 ml',
    accent: '#b0566a',
    tint: '#e09aa8',
    x: 232,
    y: 268,
    coord: '64°04′N · 21°57′V',
  },
  {
    id: 'kraekiber',
    name: 'Crowberry Líkjör',
    type: 'Berjalíkjör',
    abv: '21% vol',
    botanical: 'Krækiber',
    source: 'Handtínt í Þórsmörk',
    place: 'Þórsmörk',
    season: 'Ágúst–sept',
    notes: 'Dökkt og safaríkt. Krækiber, bláber og keimur af lyngi og haustkvöldi.',
    palate: ['Krækiber', 'Bláber', 'Lyng'],
    price: 7290,
    size: '500 ml',
    accent: '#6a4f86',
    tint: '#b9a0d8',
    x: 286,
    y: 318,
    coord: '63°41′N · 19°37′V',
  },
  {
    id: 'dill',
    name: 'Dill Akvavit',
    type: 'Akvavit',
    abv: '38% vol',
    botanical: 'Dill',
    source: 'Ræktað og þurrkað í Mosfellsdal',
    place: 'Mosfellsdalur',
    season: 'Júlí–ágúst',
    notes: 'Hreint og grænt. Dill og kúmen fremst, fennel og salt sjávarloft í lokin.',
    palate: ['Dill', 'Kúmen', 'Sjávarsalt'],
    price: 8490,
    size: '500 ml',
    accent: '#5f9e7a',
    tint: '#93cfae',
    x: 178,
    y: 206,
    coord: '64°10′N · 21°41′V',
  },
  {
    id: 'brennivin',
    name: 'Brennivín',
    type: 'Akvavit',
    abv: '40% vol',
    botanical: 'Kúmen',
    source: 'Kúmen tínt í Viðey',
    place: 'Viðey',
    season: 'Ágúst',
    notes: 'Klassískt og þurrt. Kúmen og rúgur, anís í miðjunni og langur, beinn endir.',
    palate: ['Kúmen', 'Rúgur', 'Anís'],
    price: 6990,
    size: '500 ml',
    accent: '#c79a4e',
    tint: '#e6c684',
    x: 214,
    y: 222,
    coord: '64°09′N · 21°51′V',
  },
]

/** The fuller range, listed below the selector (names real). */
export const COLLECTION: { name: string; type: string }[] = [
  { name: 'Katla Vodka', type: 'Vodka' },
  { name: 'Angelica Pink Gin', type: 'Jurtagin' },
  { name: 'Blueberry Líkjör', type: 'Aðalbláber' },
  { name: 'Bilberry Líkjör', type: 'Bláber' },
  { name: 'Lundey', type: 'Jurtalíkjör' },
  { name: 'Rhubarb Líkjör', type: 'Rabarbari' },
]

/** Foraging → glass, four steps. */
export const PROCESS: { k: string; t: string; d: string }[] = [
  {
    k: '01',
    t: 'Tína',
    d: 'Jurtir og ber eru handtínd í íslenskri náttúru, hvert á sinni breiddargráðu og sínum árstíma.',
  },
  {
    k: '02',
    t: 'Þurrka',
    d: 'Uppskeran er þurrkuð hægt svo ilmurinn og olíurnar haldist óskaddaðar fyrir eimingu.',
  },
  {
    k: '03',
    t: 'Eima',
    d: 'Eimað í litlum lotum í kopareimi. Hver jurt fær sinn tíma og sína hitastýringu.',
  },
  {
    k: '04',
    t: 'Átöppun',
    d: 'Handfyllt og merkt í Hafnarfirði. Hver lota ber sína breiddargráðu á miðanum.',
  },
]

/** Where to buy, with the clearest path first. */
export const BUY: { name: string; detail: string; tag: string; href?: string; cta?: string }[] = [
  {
    name: 'Nammi.is',
    detail: 'Vefverslun með sendingu um allt land og til útlanda. Skýrasta leiðin að flösku heim að dyrum.',
    tag: 'Vefverslun',
    href: 'https://nammi.is',
    cta: 'Versla á netinu',
  },
  {
    name: 'Fríhöfnin',
    detail: 'Tollfrjálst í Leifsstöð, bæði við komu og brottför. Oft besta verðið.',
    tag: 'Leifsstöð',
  },
  {
    name: '60+ barir og veitingastaðir',
    detail: 'Á kokteilseðlum víða um höfuðborgarsvæðið og lengra. Spurðu eftir 64°.',
    tag: 'Á barnum',
  },
  {
    name: 'Icelandair og Play',
    detail: 'Í boði um borð á völdum flugleiðum. Íslensk eiming í 10 km hæð.',
    tag: 'Um borð',
  },
]

/** Distillery facts for the visit/map section. */
export const DISTILLERY = {
  addr: 'Lónsbraut 6, 220 Hafnarfjörður',
  tel: '+354 519 3838',
  telHref: 'tel:+3545193838',
  email: 'info@reykjavikdistillery.is',
  lat: 64.06,
  lng: -21.95,
  coord: '64°04′N · 21°57′V',
}
