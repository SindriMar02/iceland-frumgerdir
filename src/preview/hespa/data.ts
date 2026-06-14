/**
 * Hespa (Hespuhúsið) — "Litir landsins" content model.
 * Plant-dyed Icelandic wool by a botanist / natural dyer in Ölfus.
 * Sample products and prices only (disclaimed in the shared footer);
 * the dye plants and the maker are real.
 *
 * ART DIRECTION NOTE — honesty over stock:
 *  - The five dye FAMILIES each show a real, distinct photo of the dye
 *    SOURCE (the plant / lichen / dye-vat), so the feature delivers its
 *    promise ("see where the colour comes from"). No source photo is reused.
 *  - The webshop PRODUCTS are deliberately photo-light: each skein is a
 *    woven COLOUR FIELD built from its own dye hex (see Yarn.wind), not a
 *    recycled stock skein. For a brand whose entire premise is distinct
 *    natural colour, an honest colour field beats a reused photo.
 */

const IMG = 'https://images.unsplash.com/'
const Q_PLANT = '?q=80&w=1100&auto=format&fit=crop'

/** Hero is a near-full-bleed photo of natural, undyed Icelandic wool. */
export const HERO_ID = 'photo-1598871956222-26b66d6559fe'

/** Photo helper that keeps the Unsplash query string consistent. */
export const photo = (id: string, w: number) =>
  `${IMG}${id}?q=80&w=${w}&auto=format&fit=crop`

/** The natural-dye colour families — the spine of the whole page. */
export interface DyeColour {
  /** stable id used as the colour-family key on products */
  id: string
  /** colour name, in Icelandic */
  name: string
  /** the swatch / panel colour */
  hex: string
  /** a paler tint safe for small text on the cream base (computed AA) */
  ink: string
  /** the plant the colour is drawn from */
  plant: string
  /** latin / context note */
  plantLatin: string
  /** one-line dye story */
  story: string
  /** photo of the actual dye SOURCE (plant / lichen / dye-vat) */
  img: string
  alt: string
}

export const DYES: DyeColour[] = [
  {
    id: 'madder',
    name: 'Krappi',
    hex: '#a8492c',
    ink: '#8f3c22',
    plant: 'Rabarbararót',
    plantLatin: 'rót · rabarbari',
    story:
      'Ræturnar gefa hlýjan ryðrauðan tón — dýpsti liturinn í húsinu og sá sem lengst hefur fylgt jurtalitun.',
    // Real rhubarb stalks (red stems, green leaves) — the dye source.
    img: `${IMG}photo-1683659184073-5b0c078b7f46${Q_PLANT}`,
    alt: 'Rabarbari með rauðum stilkum og breiðum grænum blöðum',
  },
  {
    id: 'indigo',
    name: 'Indígó',
    hex: '#38497a',
    ink: '#3a4d86',
    plant: 'Litunarpottur',
    plantLatin: 'kalt litunarbað',
    story:
      'Eini liturinn sem ekki vex hér — en hann er bundinn í köldu baði þar sem garnið kemur grænt upp og verður blátt í lofti.',
    // Vats of dark dye bath — the cold indigo vat the story describes.
    img: `${IMG}photo-1777929746858-45bbe0134e88${Q_PLANT}`,
    alt: 'Litunarpottar fullir af dökku litunarbaði',
  },
  {
    id: 'lichen',
    name: 'Skófagult',
    hex: '#c89a3c',
    // darkened for comfortable AA on cream at 11px mono (≈7.2:1)
    ink: '#5e470f',
    plant: 'Skóf',
    plantLatin: 'fléttur af steini',
    story:
      'Fléttur sem skafnar eru varlega af grjóti gefa djúpt okkurgult — tíndar í hófi svo náttúran haldi sínu.',
    // Yellow-green lichen on dark rock — the dye source.
    img: `${IMG}photo-1672920465283-69065f326245${Q_PLANT}`,
    alt: 'Gulgrænar fléttur og skóf á dökkum steini',
  },
  {
    id: 'lupin',
    name: 'Lúpína',
    hex: '#6a5a9e',
    // darkened for comfortable AA on cream at 11px mono (≈7.2:1)
    ink: '#4f4279',
    plant: 'Lúpína',
    plantLatin: 'blóm · sumar',
    story:
      'Blá blóm lúpínunnar, tínd á háannatíma sumarsins, draga fram mjúkan fjólubláan blæ á hvítri ull.',
    // A field of blue/purple lupine in bloom — the dye source.
    img: `${IMG}photo-1723791749202-561abfb9b81a${Q_PLANT}`,
    alt: 'Breiða af blárri lúpínu í fullum blóma',
  },
  {
    id: 'moss',
    name: 'Mosi',
    hex: '#5a7242',
    ink: '#4c6238',
    plant: 'Birkilauf',
    plantLatin: 'lauf · síðsumar',
    story:
      'Birkilauf og lyng úr heiðinni gefa rólegan mosagrænan tón — liturinn sem mest minnir á landið sjálft.',
    // Fresh green leaf sprig — the birch/heath foliage the colour is drawn
    // from (replaces the earlier drying-yarn photo so the feature is honest).
    img: `${IMG}photo-1501004318641-b39e6451bec6${Q_PLANT}`,
    alt: 'Ferskt grænt laufblað — birkilauf úr heiðinni',
  },
]

/** Sample webshop products — dyed-yarn skeins ("hespur"). */
export interface Yarn {
  id: string
  name: string
  /** which DyeColour.id this skein belongs to */
  colour: string
  /** weight / fibre note */
  detail: string
  price: string
  /**
   * Colour-field tone: how the skein winds in its card.
   *  'warm'  → the dye over a warm cream ground
   *  'deep'  → a darker, more saturated wind of the same dye
   * The card builds the visual from the dye hex + this hint — no stock photo,
   * so no two products ever share a recycled image.
   */
  wind: 'warm' | 'deep'
}

export const YARNS: Yarn[] = [
  {
    id: 'y-madder',
    name: 'Krappi',
    colour: 'madder',
    detail: 'Plötulopi · 100 g hespa',
    price: '2.290 kr.',
    wind: 'warm',
  },
  {
    id: 'y-indigo',
    name: 'Indígó',
    colour: 'indigo',
    detail: 'Eingirni · 100 g hespa',
    price: '2.490 kr.',
    wind: 'warm',
  },
  {
    id: 'y-lichen',
    name: 'Skófagult',
    colour: 'lichen',
    detail: 'Plötulopi · 100 g hespa',
    price: '2.290 kr.',
    wind: 'warm',
  },
  {
    id: 'y-lupin',
    name: 'Lúpína',
    colour: 'lupin',
    detail: 'Eingirni · 100 g hespa',
    price: '2.490 kr.',
    wind: 'warm',
  },
  {
    id: 'y-moss',
    name: 'Mosi',
    colour: 'moss',
    detail: 'Plötulopi · 100 g hespa',
    price: '2.290 kr.',
    wind: 'warm',
  },
  {
    id: 'y-madder-2',
    name: 'Krappi, dökkur',
    colour: 'madder',
    detail: 'Tvíbandsgarn · 100 g hespa',
    price: '2.690 kr.',
    wind: 'deep',
  },
]

/** Small trust / process marks for the maker band. */
export interface Mark {
  k: string
  label: string
}

export const MARKS: Mark[] = [
  { k: '100%', label: 'íslensk ull' },
  { k: 'Jurtir', label: 'litað með plöntum' },
  { k: 'Ölfus', label: 'opin vinnustofa' },
]

/** Real studio location (used for an honest map link). */
export const STUDIO = {
  name: 'Hespuhúsið',
  street: 'Árbæjarvegi vestri',
  area: '816 Ölfus',
  region: 'Suðurland',
  /** Place-query map link that lands on the studio, not just the region. */
  maps:
    'https://www.google.com/maps/search/?api=1&query=Hespuh%C3%BAsi%C3%B0%2C%20%C3%81rb%C3%A6jarvegi%20vestri%2C%20816%20%C3%96lfus',
}
