/**
 * Húnabúð / Bæjarblómið — "Þrír gluggar, eitt þak".
 *
 * A café + flower shop + gift shop in one roadside building at
 * Norðurlandsvegur 4, 540 Blönduós, on Route 1. The concept is literal: the
 * real building already carries three signs side by side (Húnabúð, coffee and
 * delicacies / Bæjarblómið / flower and gift shop), so the page structure IS
 * the signage.
 *
 * HONESTY: every fact here is sourced from the brief's Part A. No invented
 * prices, no founding year, no live open/closed claim (hours conflict across
 * directories and the business runs a seasonal Ring Road schedule), no
 * mention of Litla Dótabúðin / the discredited workshop/charity claims, and
 * "GDS ehf." never appears as a customer-facing name. The four review quotes
 * are shown verbatim with their real 2024–2025 dates and Google/Wanderlog
 * attribution. Local photos (storefront, pastry case, signage) are the shop's
 * real photos; the flower/yarn/road images are honest generic stand-ins,
 * never claimed to be this shop's own interior.
 */

/** Local, real + honestly-sourced imagery. Referenced via BASE_URL in Page. */
export const IMG = {
  hero: 'hunabud/evendo1.webp', // real storefront, sun, lopapeysur rack, visitor entering
  signage: 'hunabud/wl2.webp', // real storefront, all three signs legible
  cakeCase: 'hunabud/wl3.webp', // real café pastry display case
  road: 'hunabud/us_road.webp', // generic Route 1 ring-road scenery (illustrative)
  bouquet1: 'hunabud/us_bouquet1.webp', // generic elegant bouquet (illustrative)
  bouquet2: 'hunabud/us_bouquet2.webp', // generic wedding bouquet (illustrative)
  florist: 'hunabud/us_florist.webp', // generic hands arranging flowers (illustrative)
  yarn: 'hunabud/us_yarn.webp', // generic wool yarn balls (illustrative)
} as const

export type ImgKey = keyof typeof IMG

/* Palette — the fresh, light pass. Ground is porcelain (brightest of the
 * four redesigns); structural ink is the real signage pine green. Each of
 * the three offerings gets its own tint, verified AA against porcelain:
 * pine 10.4:1, coffee 7.6:1 (safe at any size), rose 3.5:1 (large text /
 * fills only — roseDark 5.0:1 for small text), mustard 3.2:1 (large text /
 * fills only — mustardDark 5.1:1 for small text). */
export const C = {
  ground: '#FBFAF6', // porcelain
  ink: '#1E4433', // pine green (real signage lettering)
  coffee: '#6B4A2E', // café tint
  rose: '#C0705C', // blóm tint (large text / fills)
  roseDark: '#A8543F', // blóm tint, darkened for small text
  mustard: '#B4842E', // gjafir tint (large text / fills)
  mustardDark: '#8C6320', // gjafir tint, darkened for small text
  inkSoft: 'rgba(30,68,51,0.78)',
  inkFaint: 'rgba(30,68,51,0.14)',
  inkWash: 'rgba(30,68,51,0.06)',
} as const

export const FONT = {
  display: 'var(--font-survey)', // Instrument Serif
  body: 'var(--font-schibsted)', // Schibsted Grotesk
} as const

/* Contact + location (brief Part A). */
export const PHONE_MAIN = '551 0588'
export const PHONE_MAIN_TEL = 'tel:+3545510588'
export const PHONE_MOBILE = '847 8221'
export const PHONE_MOBILE_TEL = 'tel:+3548478221'
export const ADDRESS = 'Norðurlandsvegur 4, 540 Blönduós'
export const MAPS_HREF =
  'https://www.google.com/maps/search/?api=1&query=H%C3%BAnab%C3%BA%C3%B0%20Bl%C3%B6ndu%C3%B3s'
export const MAP_EMBED =
  'https://www.google.com/maps?q=H%C3%BAnab%C3%BA%C3%B0%20Bl%C3%B6ndu%C3%B3s&output=embed'

/* The three pillars — the whole concept, in the building's own order. */
export interface Pillar {
  key: ImgKey
  eyebrow: string
  title: string
  lede: string
  body: string
  cue: string
  tint: string
}

export const PILLARS: Pillar[] = [
  {
    key: 'cakeCase',
    eyebrow: '01 / Kaffihús',
    title: 'Kaffihús',
    lede: 'Heimabakað við þjóðveginn',
    body:
      'Kaffi, súpa dagsins og heimabakaðar kökur eftir gömlum, heimafengnum uppskriftum. Setstu niður og fáðu þér bita.',
    cue: 'Kíktu á kökurnar',
    tint: C.coffee,
  },
  {
    key: 'florist',
    eyebrow: '02 / Bæjarblómið',
    title: 'Bæjarblómið',
    lede: 'Blóm fyrir tímamótin',
    body:
      'Fersk blóm og skreytingar fyrir afmæli, fermingar og brúðkaup, ásamt samúðarkveðjum þegar á þarf að halda.',
    cue: 'Sjá blómin',
    tint: C.rose,
  },
  {
    key: 'yarn',
    eyebrow: '03 / Gjafavara',
    title: 'Gjafavara',
    lede: 'Handverk og gjafir heim',
    body:
      'Íslenskt handverk, ull og lopapeysur, listmunir og gjafavara til að taka með sér heim af leiðinni.',
    cue: 'Sjá gjafavöruna',
    tint: C.mustard,
  },
]

/* Café — verified items only (from dated reviews). No prices anywhere. */
export const CAFE_ITEMS = [
  { name: 'Bláberjakaka', note: 'Nefnd sérstaklega í umsögnum gesta' },
  { name: 'Jógúrtkaka', note: 'Heimabökuð eftir gömlum uppskriftum' },
  { name: 'Gúllassúpa', note: 'Súpa dagsins' },
  { name: 'Kaffi og meðlæti', note: 'Uppáhellt kaffi og heimabakað með' },
]

/* Real customer reviews — verbatim, real dates, Google via Wanderlog. */
export interface Review {
  name: string
  stars: number
  date: string
  text: string
}

export const REVIEWS: Review[] = [
  {
    name: 'Akash Y',
    stars: 5,
    date: '27.07.2024',
    text:
      'Such a fancy place with cool ambiance and delicious cakes. Tried their blueberry cake and yogurt cake and they both were great.',
  },
  {
    name: 'Tamas M',
    stars: 5,
    date: '15.05.2025',
    text: 'Excellent goulash soup and homemade cakes. Staff is super friendly.',
  },
  {
    name: 'Egwene M',
    stars: 4,
    date: '04.05.2025',
    text:
      'Old school café with homemade cakes, run by an amazing icelandic Grandma :) worth a visit!',
  },
  {
    name: 'Walter B',
    stars: 5,
    date: '23.05.2024',
    text: 'The coffee was also spectacular. if you are driving past you need to visit.',
  },
]

/* Flower occasions — from finna.is, no invented prices. */
export const OCCASIONS = ['Afmæli', 'Fermingar', 'Brúðkaup', 'Samúðarkveðjur']

/* Gift-shop goods — phrased generally, aggregator-level confidence. */
export const GIFTS = ['Lopapeysur og ull', 'Íslenskt handverk', 'Listmunir', 'Gjafavara']

/* Hours — 1819.is version, presented WITH the seasonal caveat (brief). */
export const HOURS = [
  { day: 'Mánudagur til föstudagur', time: '10:00–17:00' },
  { day: 'Laugardagur', time: '12:00–17:00' },
  { day: 'Sunnudagur', time: '12:00–16:00' },
]

/* Same HOURS facts, structured for the indicative open/closed computation.
 * days: JS Date#getDay() values (0 = Sunday .. 6 = Saturday). */
export interface OpeningRule {
  days: number[]
  start: number // minutes from midnight
  end: number
  label: string
}

export const OPENING_SCHEDULE: OpeningRule[] = [
  { days: [1, 2, 3, 4, 5], start: 10 * 60, end: 17 * 60, label: 'Mán–Fös 10–17' },
  { days: [6], start: 12 * 60, end: 17 * 60, label: 'Lau 12–17' },
  { days: [0], start: 12 * 60, end: 16 * 60, label: 'Sun 12–16' },
]

/* MUST accompany any "líklega opið/lokað núna" status shown to a visitor —
 * hours conflict across directories and the shop runs a seasonal Ring Road
 * schedule, so no hard live open/closed claim is ever made without this. */
export const STATUS_CAVEAT = 'Skv. 1819.is. Opnunartími getur breyst yfir sumarið.'
