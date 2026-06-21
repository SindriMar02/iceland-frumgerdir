/**
 * Kogga — "Innlegg" (The Inlay) content model.
 * Kolbrún Björgólfsdóttir ("Kogga"), a Reykjavík ceramic studio & gallery of
 * ~40 years. Signature technique: porcelain "drawings" INLAID into stoneware,
 * a patchwork of fragments inspired by ancient pottery shards and the
 * Icelandic landscape. The red house at Vesturgata 5, 101 Reykjavík.
 *
 * HONESTY (matches the shared footer disclaimer):
 *  - The maker, the technique, the address/phones/email and the real SERIES
 *    NAMES (Earthling, Saltboat, Egg of Life, Egg of the Snowbird, Mother
 *    Earth, Coffee Mug) are verified facts.
 *  - Prices, dimensions, per-piece stories, availability, opening hours and
 *    shipping terms are SAMPLE content, present so the page is usable but
 *    never passed off as real.
 *  - The critic line is the real attributed appraisal by Aðalsteinn
 *    Ingólfsson, kept short.
 *  - NO unverifiable collection/museum claims appear anywhere.
 *  - ART DIRECTION: ceramics stock photos never match her actual pieces, so
 *    the gallery is built from BESPOKE SVG vessel silhouettes on plinths, not
 *    fake photos. A single atmospheric clay/stoneware texture is used only as
 *    mood in the technique section, and is never labelled as one of her works.
 */

const IMG = 'https://images.unsplash.com/'
const Q = '?q=80&auto=format&fit=crop'

/** Atmospheric clay/stoneware surface — mood only, never "her piece". */
export const photo = (id: string, w: number) => `${IMG}${id}${Q}&w=${w}`

/** Verified 200. Raw, undyed clay/stoneware texture used as section mood. */
export const CLAY_TEXTURE_ID = 'photo-1565193566173-7a0ee3dbe261'

/* ── Palette (gallery, light) ──────────────────────────────────────── */
export const PALETTE = {
  ground: '#f3efe9', // off-white gallery wall
  ground2: '#ece6dd', // a half-tone warmer wall, for tinted plinths
  clay: '#b9a48c', // stoneware
  porcelain: '#d8cfc2', // porcelain shadow
  glaze: '#26433f', // deep glaze teal (darkened slightly for AA on its own panels)
  oxblood: '#8f3b2e', // red-house accent
  ink: '#221d19', // text
} as const

/* ── The work: the gallery grid ────────────────────────────────────── */

export type VesselShape = 'bowl' | 'tall' | 'egg' | 'boat' | 'sphere' | 'mug'

/** Acquisition state — sample, but lets the grid read like a real collection. */
export type Availability = 'available' | 'reserved' | 'commission'

export interface Piece {
  id: string
  /** Real series name */
  series: string
  /** Variant / piece title (sample for Earthling glaze variants) */
  title: string
  /** Bespoke SVG silhouette to draw */
  shape: VesselShape
  /** Sample price, formatted */
  price: string
  /** Sample dimensions */
  dimensions: string
  /** Sample firing / year line, museum-label feel */
  fired: string
  /** Sample availability state */
  status: Availability
  /** The glaze / surface family for this card's fill */
  glaze: string
  /** porcelain inlay colour for the patchwork drawing */
  inlay: string
  /** One-line glaze/surface descriptor, shown as the curatorial subtitle */
  glazeName: string
  /** Short, evocative SAMPLE story (glaze / series note) */
  story: string
}

export const PIECES: Piece[] = [
  {
    id: 'earthling-moss',
    series: 'Earthling',
    title: 'Moss',
    shape: 'bowl',
    price: '64.000 kr.',
    dimensions: 'Þvermál 24 sm · hæð 11 sm',
    fired: 'Steinleir, innlagt postulín',
    status: 'available',
    glaze: '#3f5a3e',
    inlay: '#e9e3d6',
    glazeName: 'Mosagrænn gljái',
    story:
      'Mosagrænn steinleir með innlögðu postulíni, eins og þúfur séðar úr lofti. Hver flís lögð í höndunum.',
  },
  {
    id: 'earthling-glacier',
    series: 'Earthling',
    title: 'Glacier',
    shape: 'bowl',
    price: '64.000 kr.',
    dimensions: 'Þvermál 24 sm · hæð 11 sm',
    fired: 'Steinleir, innlagt postulín',
    status: 'reserved',
    glaze: '#5d7c84',
    inlay: '#f1ede4',
    glazeName: 'Jökulblár tónn',
    story:
      'Kaldur jökulblár tónn þar sem postulínið rennur eins og sprungur í ís. Sama skál, annað landslag.',
  },
  {
    id: 'earthling-evergreen',
    series: 'Earthling',
    title: 'Evergreen',
    shape: 'bowl',
    price: '66.000 kr.',
    dimensions: 'Þvermál 25 sm · hæð 12 sm',
    fired: 'Steinleir, innlagt postulín',
    status: 'available',
    glaze: '#26433f',
    inlay: '#e6decd',
    glazeName: 'Djúpgrænn gljái',
    story:
      'Djúpgrænn gljái, dekksta systkinið í Earthling. Innlagða mynstrið minnir á sígrænt kjarr.',
  },
  {
    id: 'earthling-snow',
    series: 'Earthling',
    title: 'Snow',
    shape: 'bowl',
    price: '62.000 kr.',
    dimensions: 'Þvermál 23 sm · hæð 11 sm',
    fired: 'Steinleir, innlagt postulín',
    status: 'available',
    glaze: '#cdbfa6',
    inlay: '#ffffff',
    glazeName: 'Sandlitur matt',
    story:
      'Ljósasti tónninn, þar sem hvítt postulín liggur í sandlitan steinleir eins og snjór í mel.',
  },
  {
    id: 'saltboat',
    series: 'Saltboat',
    title: 'Saltbátur',
    shape: 'boat',
    price: '48.000 kr.',
    dimensions: 'Lengd 26 sm · breidd 9 sm',
    fired: 'Steinleir, innlagt postulín',
    status: 'available',
    glaze: '#6b7d7a',
    inlay: '#efe9dc',
    glazeName: 'Saltgrár gljái',
    story:
      'Bátslaga ker fyrir salt eða smáhluti, innblásið af verbúðum og rekaviði. Innlögð brot eins og net.',
  },
  {
    id: 'egg-of-life',
    series: 'Egg of Life',
    title: 'Lífsegg',
    shape: 'egg',
    price: '92.000 kr.',
    dimensions: 'Hæð 19 sm · þvermál 13 sm',
    fired: 'Steinleir, innlagt postulín',
    status: 'commission',
    glaze: '#8f3b2e',
    inlay: '#f1e7d4',
    glazeName: 'Oxrauður gljái',
    story:
      'Lokað eggform, oxrautt eins og rauða húsið. Postulínsbrotin liggja í samfellu kringum skurnina.',
  },
  {
    id: 'egg-snowbird',
    series: 'Egg of the Snowbird',
    title: 'Snjófuglsegg',
    shape: 'egg',
    price: '88.000 kr.',
    dimensions: 'Hæð 18 sm · þvermál 12 sm',
    fired: 'Steinleir, innlagt postulín',
    status: 'available',
    glaze: '#9fb0b4',
    inlay: '#ffffff',
    glazeName: 'Fölur vetrartónn',
    story:
      'Föl skurn í vetrartón, eins og egg rjúpu í fönn. Hvítt í hvítt, fíngert innlegg sem sést í snertingu.',
  },
  {
    id: 'mother-earth',
    series: 'Mother Earth',
    title: 'Móðir jörð',
    shape: 'sphere',
    price: '120.000 kr.',
    dimensions: 'Þvermál 22 sm',
    fired: 'Steinleir, innlagt postulín',
    status: 'available',
    glaze: '#4a3b30',
    inlay: '#d8b27a',
    glazeName: 'Moldarbrúnn gljái',
    story:
      'Hnöttótt ker í moldarbrúnu, stærsta stykkið. Innlögð brotin mynda kort af engu og öllu landi í senn.',
  },
  {
    id: 'coffee-mug',
    series: 'Coffee Mug',
    title: 'Kaffibolli',
    shape: 'mug',
    price: '14.500 kr.',
    dimensions: 'Hæð 10 sm · 3 dl',
    fired: 'Steinleir, innlagt postulín',
    status: 'available',
    glaze: '#26433f',
    inlay: '#efe9dc',
    glazeName: 'Grænn hversdagsgljái',
    story:
      'Daglegt verk í sama handverki og safnstykkin. Innlagt postulín í handfangi sem fellur að lófa.',
  },
]

/** Sample availability labels (Icelandic) for the museum-label chip. */
export const STATUS_LABEL: Record<Availability, string> = {
  available: 'Til sölu',
  reserved: 'Frátekið',
  commission: 'Pöntun',
}

/* ── The studio / visit ────────────────────────────────────────────── */
export const STUDIO = {
  name: 'Kogga',
  who: 'Kolbrún Björgólfsdóttir',
  address: 'Vesturgata 5',
  city: '101 Reykjavík',
  // sample opening hours (disclaimed)
  hours: [
    { day: 'Þriðjudag til föstudags', time: '11–17' },
    { day: 'Laugardag', time: '11–16' },
    { day: 'Sunnudag og mánudag', time: 'Lokað' },
  ],
  tel: '+354 552 6036',
  telHref: 'tel:+3545526036',
  gsm: '+354 899 2772',
  gsmHref: 'tel:+3548992772',
  email: 'kogga@kogga.is',
  // approx coords for the bespoke map motif
  coords: { lat: 64.149, lng: -21.945 },
} as const

/** Sample buying / shipping terms (disclaimed). */
export const TERMS = [
  {
    title: 'Sendum um allan heim',
    body: 'Hvert verk er pakkað í höndunum og sent með rakningu. Sýnishorn af skilmálum.',
  },
  {
    title: '14 daga skilaréttur',
    body: 'Skil innan fjórtán daga ef verkið er óskemmt. Sýnishorn af skilmálum.',
  },
  {
    title: 'Pantanir og einstök verk',
    body: 'Hægt að panta verk í tilteknum gljáa eða stærð. Verð eru sýnishorn í þessari frumgerð.',
  },
] as const

/* ── Steps of the inlay technique (for the "Innlegg" section) ──────── */
export const STEPS = [
  {
    n: '01',
    title: 'Steinleirinn mótaður',
    body: 'Kerið er rennt eða byggt úr steinleir og látið þorna þar til það heldur lögun en tekur enn við.',
  },
  {
    n: '02',
    title: 'Postulínið lagt í',
    body: 'Litað postulín er skorið í brot og lagt inn í yfirborðið, flís fyrir flís, eins og bútasaumur.',
  },
  {
    n: '03',
    title: 'Slípað og brennt',
    body: 'Yfirborðið er slípað þar til steinleir og postulín mætast í einni sléttu og síðan brennt í glerung.',
  },
] as const

/** A few quiet, verifiable facts for the curatorial "ledger" strip. */
export const LEDGER = [
  { k: 'Frá', v: 'um 1985' },
  { k: 'Nám', v: 'Danski hönnunarskólinn, Kaupmannahöfn' },
  { k: 'Tækni', v: 'Innlagt postulín í steinleir' },
  { k: 'Hús', v: 'Vesturgata 5, 101 Reykjavík' },
] as const
