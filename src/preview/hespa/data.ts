/**
 * Hespa (Hespuhúsið) — "Litir landsins" content model.
 * Plant-dyed Icelandic wool by a botanist / natural dyer in Ölfus.
 * Sample products and prices only (disclaimed in the shared footer);
 * the dye plants and the maker are real.
 */

const IMG = 'https://images.unsplash.com/'
const Q_CARD = '?q=80&w=1100&auto=format&fit=crop'
const Q_PLANT = '?q=80&w=900&auto=format&fit=crop'

/** Hero is a near-full-bleed yarn image. */
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
  /** a paler tint safe for small text on the cream base */
  ink: string
  /** the plant the colour is drawn from */
  plant: string
  /** latin / context note */
  plantLatin: string
  /** one-line dye story */
  story: string
  /** plant or dye-vat photo */
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
    img: `${IMG}photo-1683659184073-5b0c078b7f46${Q_PLANT}`,
    alt: 'Rabarbari með breiðum grænum blöðum og rauðum stilkum',
  },
  {
    id: 'indigo',
    name: 'Indígó',
    hex: '#38497a',
    ink: '#3a4d86',
    plant: 'Litunarpottur',
    plantLatin: 'kalt litunarbað',
    story:
      'Eini liturinn sem ekki vex hér — en hann er bundinn í köldu baði þar sem garnið kemur grænt upp og bláknar í lofti.',
    img: `${IMG}photo-1777929746858-45bbe0134e88${Q_PLANT}`,
    alt: 'Litunarpottar með dökku litunarbaði',
  },
  {
    id: 'lichen',
    name: 'Skófagult',
    hex: '#c89a3c',
    ink: '#6f5413',
    plant: 'Skóf',
    plantLatin: 'fléttur af steini',
    story:
      'Fléttur sem skafnar eru varlega af grjóti gefa djúpt gyllt okkur — tíndar í hófi svo náttúran haldi sínu.',
    img: `${IMG}photo-1672920465283-69065f326245${Q_PLANT}`,
    alt: 'Gulgrænar fléttur og skóf á steini',
  },
  {
    id: 'lupin',
    name: 'Lúpína',
    hex: '#6a5a9e',
    ink: '#5b4d8c',
    plant: 'Lúpína',
    plantLatin: 'blóm · sumar',
    story:
      'Blá blóm lúpínunnar, tínd á háannatíma sumarsins, draga fram mjúkan fjólubláan blæ á hvítri ull.',
    img: `${IMG}photo-1723791749202-561abfb9b81a${Q_PLANT}`,
    alt: 'Breiða af blárri lúpínu í blóma',
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
    img: `${IMG}photo-1770572274716-1bae682c48f7${Q_PLANT}`,
    alt: 'Jurtalituð ullarhespur að þorna á snúru',
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
  img: string
  alt: string
}

export const YARNS: Yarn[] = [
  {
    id: 'y-madder',
    name: 'Krappi',
    colour: 'madder',
    detail: 'Plötulopi · 100 g hespa',
    price: '2.290 kr.',
    img: `${IMG}photo-1598871956222-26b66d6559fe${Q_CARD}`,
    alt: 'Ryðrauð ullarhespa, jurtalituð',
  },
  {
    id: 'y-indigo',
    name: 'Indígó',
    colour: 'indigo',
    detail: 'Eingirni · 100 g hespa',
    price: '2.490 kr.',
    img: `${IMG}photo-1670764732222-e787bccd934f${Q_CARD}`,
    alt: 'Hespur af ull í bláum og náttúrulegum tónum',
  },
  {
    id: 'y-lichen',
    name: 'Skófagult',
    colour: 'lichen',
    detail: 'Plötulopi · 100 g hespa',
    price: '2.290 kr.',
    img: `${IMG}photo-1737113551426-9d59e52aa51d${Q_CARD}`,
    alt: 'Óunnin, óllituð íslensk ull í náttúrulegum tónum',
  },
  {
    id: 'y-lupin',
    name: 'Lúpína',
    colour: 'lupin',
    detail: 'Eingirni · 100 g hespa',
    price: '2.490 kr.',
    img: `${IMG}photo-1541944743827-e04aa6427c33${Q_CARD}`,
    alt: 'Prjónaskapur úr mjúku jurtalituðu garni',
  },
  {
    id: 'y-moss',
    name: 'Mosi',
    colour: 'moss',
    detail: 'Plötulopi · 100 g hespa',
    price: '2.290 kr.',
    img: `${IMG}photo-1770572274716-1bae682c48f7${Q_CARD}`,
    alt: 'Jurtalituð ullarhespa að þorna á snúru',
  },
  {
    id: 'y-madder-2',
    name: 'Krappi, dökkur',
    colour: 'madder',
    detail: 'Tvíbandsgarn · 100 g hespa',
    price: '2.690 kr.',
    img: `${IMG}photo-1670764732222-e787bccd934f${Q_CARD}`,
    alt: 'Hespur af ull í rauðum og náttúrulegum tónum',
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
