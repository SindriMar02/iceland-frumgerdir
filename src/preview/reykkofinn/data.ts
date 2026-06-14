/**
 * Reykkofinn / Litla sveitabúðin — "Reykur úr hrauninu" content model.
 * A lava-field smokehouse & farm shop at Hella in Mývatnssveit.
 * Sample prices/copy only (disclaimed in the shared footer).
 */

const IMG = 'https://images.unsplash.com/'
const Q_CARD = '?q=80&w=1100&auto=format&fit=crop'

/** Hero — smoked salmon/char, dark. */
export const HERO_ID = 'photo-1763062550082-2c9f94096abb'

/** Process / place imagery (Unsplash ids supplied in the brief). */
export const IMGS = {
  board: 'photo-1546970361-407ddc8053fc', // smoked board / platter
  smoking: 'photo-1777798343565-50a5c7959013', // smoking process
  hanging: 'photo-1737690526913-6ad06bc04340', // fish hanging in smoke
  lava: 'photo-1582721478779-0ae163c05a60', // lava field
  lake: 'photo-1655536103884-206fc6837a4a', // Lake Mývatn
  sign: 'photo-1576501161309-37635f837061', // farm-shop sign
} as const

export interface Product {
  id: string
  name: string
  line: string
  weight: string
  price: string
  cta: string
  /** photoLight tiles render a typographic card instead of a stock photo */
  photoLight?: boolean
  img?: string
  alt?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'reyktur',
    name: 'Reyktur silungur',
    line: 'Villtur Mývatnssilungur, hægreyktur yfir birki í hraunkofanum.',
    weight: '200 g · heil flök',
    price: '1.890 kr.',
    cta: 'Panta',
    img: `${IMG}${HERO_ID}${Q_CARD}`,
    alt: 'Reykt silungsflök í dökkri lýsingu, glansandi yfirborð',
  },
  {
    id: 'grafinn',
    name: 'Grafinn silungur',
    line: 'Mildur, grafinn í salti, sykri og dilli — borinn fram þunnskorinn.',
    weight: '150 g · sneitt',
    price: '1.690 kr.',
    cta: 'Panta',
    img: `${IMG}${IMGS.board}${Q_CARD}`,
    alt: 'Reykt og grafinn fiskur á dökku skurðarbretti með kryddi',
  },
  {
    id: 'hangikjot',
    name: 'Hangikjöt',
    line: 'Birkireykt að gömlum sið — selt eftir vigt í sveitabúðinni um hátíðar.',
    weight: 'Eftir vigt · árstíðabundið',
    price: 'frá 4.200 kr./kg',
    cta: 'Spyrja um framboð',
    photoLight: true,
  },
]

export interface Step {
  n: string
  title: string
  body: string
}

/** "Frá vatni að borði" — lake → smokehouse → table. */
export const FLOW: Step[] = [
  {
    n: '01',
    title: 'Úr vatninu',
    body: 'Villtur silungur úr tæru Mývatni — handflakaður samdægurs á búinu.',
  },
  {
    n: '02',
    title: 'Í reykkofann',
    body: 'Hægreyktur yfir íslensku birki í kofanum úti í hrauninu, lágum hita.',
  },
  {
    n: '03',
    title: 'Á borðið',
    body: 'Pakkað í sveitabúðinni — tilbúið á brauðið eða sent heim til þín.',
  },
]

export interface Spec {
  k: string
  label: string
  detail: string
}

export const SPECS: Spec[] = [
  { k: 'Birki', label: 'Reykur', detail: 'Aðeins íslenskt birki — engin gerviefni, enginn flýtir.' },
  { k: 'Villt', label: 'Hráefni', detail: 'Silungur úr Mývatni, ekki eldisfiskur úr keri.' },
  { k: '65°N', label: 'Mývatnssveit', detail: 'Reykt í hrauninu við vatnið, í Norðurlandi eystra.' },
]
