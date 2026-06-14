/**
 * Reykkofinn / Litla sveitabúðin — "Reykur úr hrauninu" content model.
 * Sauðfjárbændur á Hellu í Mývatnssveit: heimareykt hangikjöt og lambakjöt,
 * fullunnið og selt beint frá býli. Reyktur silungur er hliðarvara.
 * Tagline búsins: "Heimareykt — bragðsins vegna!"
 * Sample prices/copy only (disclaimed in the shared footer).
 */

/** Real tagline of the farm (hangikjot.is). */
export const TAGLINE = 'Heimareykt — bragðsins vegna!'

/** Phone — real numbers for the farm. 848 4237 primary, 896 4237 secondary. */
export const PHONE_PRIMARY = '848 4237'
export const PHONE_SECONDARY = '896 4237'

/**
 * Hero — atmospheric lava + rising smoke ("Reykur úr hrauninu") rather than a
 * single species photo, so no product is misrepresented. The hero sells the
 * place and the smoke, not a fish; hangikjöt + lambakjöt lead the grid below.
 */
export const HERO_ID = 'photo-1582721478779-0ae163c05a60' // glowing lava + rising smoke

/** Place imagery — only verified, authentic Mývatn shots are used. */
export const IMGS = {
  lake: 'photo-1655536103884-206fc6837a4a', // Lake Mývatn with pseudo-craters
} as const

export interface Product {
  id: string
  name: string
  line: string
  weight: string
  price: string
  cta: string
  /** flagship tiles get the largest, most prominent treatment */
  flagship?: boolean
  /** short uppercase tag shown on the photo-light tiles */
  tag?: string
}

/**
 * Hierarchy fix: hangikjöt is the flagship (first + biggest), lambakjöt
 * second, reyktur silungur a supporting third. The two products that
 * previously had un-usable stock photos are now premium photo-light tiles
 * — the pattern the review called the best card on the page.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'hangikjot',
    name: 'Hangikjöt',
    line: 'Heimareykt yfir íslensku birki að gömlum sið. Hjartað í búðinni okkar — fullunnið beint frá býli.',
    weight: 'Heilt, hálft eða eftir vigt',
    price: 'frá 4.200 kr./kg',
    cta: 'Panta hangikjöt',
    flagship: true,
    tag: 'Beint frá býli',
  },
  {
    id: 'lambakjot',
    name: 'Lambakjöt',
    line: 'Lamb af eigin fé, alið á heiðum Mývatnssveitar. Heilt og hálft skrokk, eða einstakir bitar.',
    weight: 'Heilt / hálft skrokk · eftir vigt',
    price: 'frá 1.890 kr./kg',
    cta: 'Panta lambakjöt',
    tag: 'Af eigin fé',
  },
  {
    id: 'reyktur',
    name: 'Reyktur silungur',
    line: 'Heimareyktur silungur, hægt yfir birki í kofanum. Tilbúinn á brauðið — fáanlegur eftir árstíð.',
    weight: '200 g · heil flök',
    price: '1.890 kr.',
    cta: 'Panta silung',
    tag: 'Árstíðabundið',
  },
]

export interface Step {
  n: string
  title: string
  body: string
}

/** "Svona pantar þú" — the honest ordering path (no fake cart). */
export const FLOW: Step[] = [
  {
    n: '01',
    title: 'Hafðu samband',
    body: 'Hringdu eða sendu okkur tölvupóst og segðu hvað þig vantar — hangikjöt, lambakjöt eða silung.',
  },
  {
    n: '02',
    title: 'Við reykjum og pökkum',
    body: 'Við fullvinnum vöruna heima á Hellu, vigtum og pökkum fyrir þig — beint frá býli.',
  },
  {
    n: '03',
    title: 'Sækja eða senda',
    body: 'Náðu í pöntunina í sveitabúðinni við hringveginn, eða við sendum heim innanlands.',
  },
]

export interface Spec {
  k: string
  label: string
  detail: string
}

/** Defensible claims only — no "villtur úr Mývatni" overclaim. */
export const SPECS: Spec[] = [
  { k: 'Birki', label: 'Reykur', detail: 'Aðeins íslenskt birki — engin gerviefni, enginn flýtir.' },
  { k: 'Heima', label: 'Vinnsla', detail: 'Fullunnið og reykt heima á Hellu, selt beint frá býli.' },
  { k: '65°N', label: 'Mývatnssveit', detail: 'Búið okkar stendur í hrauninu við vatnið, á Norðurlandi eystra.' },
]
