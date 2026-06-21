/**
 * Beffa Tours — "Sjö sæti á Arnarfirði" (Seven seats on Arnarfjörður).
 *
 * Concept data: intimacy + stillness. One 9-metre boat (Beffa), max 7 guests,
 * leaving Bíldudalur into Arnarfjörður under the Westfjords Alps.
 *
 * HONESTY: prices, departure dates/times and live seat availability below are
 * SAMPLE values (disclaimed in the shared footer). Verified facts only for the
 * boat, capacity, location, contact, species likelihood and what's included.
 */

/** Sea palette — cold North Atlantic. Page-local (chrome uses company.accent). */
export const SEA = {
  deep: '#0c1c26', // deep sea, page background
  abyss: '#06121a', // the dark the whale rises out of (deepest layer)
  fog: '#33454f', // slate fog, used for spent-seat dot rings
  text: '#dfe8ec', // pale sky text
  textDim: '#cdd9de', // dimmer pale text
  muted: '#9fb6bf', // quiet captions (AA on deep + #0a1822)
  faint: '#86a0aa', // faint labels (AA on dark panels)
  orange: '#e7902f', // the ONE warm signal — buoy / lifejacket
  ink: '#1a1003', // text that sits on the orange (7.5:1)
} as const

/**
 * Atmospheric photography, used for mood ONLY — never claimed to be Beffa,
 * her crew or an actual tour. All ids verified 200 on images.unsplash.com.
 */
export const PHOTOS = {
  /** Layered, fog-wrapped mountains — the "Vestfjarðaalparnir" feeling. */
  alps: 'photo-1464822759023-fed622ff2c3b',
  /** A still, cold fjord under low cloud. */
  fjord: 'photo-1426604966848-d7adac402bff',
  /** Dark open-ocean water texture, close to the surface. */
  sea: 'photo-1505142468610-359e7d316be0',
} as const

export const HERO = {
  kicker: 'Bíldudalur · Arnarfjörður · Vestfirðir',
  h1: 'Hvalaskoðun á Arnarfirði',
  sub: 'Sjö gestir. Einn bátur. Kyrrðin í Vestfjarðaölpunum.',
  cta: 'Bóka sæti',
  cta2: 'Sjá ferðina',
  scrollHint: 'Skrunaðu, hvalurinn rís',
} as const

/** The single full-bleed "breath" moment between the tour and the boat. */
export const BREATH = {
  quote: 'Í þögninni heyrist andardráttur hvalsins áður en hann sést.',
  attribution: 'Augnablikið sem þú kemur til að upplifa',
} as const

/** The tour — what to honestly expect on the 2-hour trip. */
export const TOUR = {
  kicker: '2 klst · brottför frá Bíldudal',
  title: 'Ferðin',
  lead: 'Tveggja tíma sigling út í einn kyrrasta fjörð landsins. Engin þvaga, engin læti. Bara þú, hafið og fjöllin.',
  steps: [
    {
      n: '01',
      t: 'Brottför frá Bíldudal',
      d: 'Við leggjum frá höfninni í litla þorpinu Bíldudal. Hópurinn er aldrei stærri en sjö manns, svo allir fá sæti við borðstokkinn.',
    },
    {
      n: '02',
      t: '15–20 mínútna sigling',
      d: 'Stutt og róleg sigling inn á Arnarfjörð, undir tindum Vestfjarðaalpanna sem rísa beint upp úr sjónum.',
    },
    {
      n: '03',
      t: 'Kyrrð og bið',
      d: 'Við slökkvum á vélinni og bíðum. Í þögninni heyrist andardráttur hvalsins áður en hann sést. Þetta er augnablikið.',
    },
  ],
} as const

export const SPECIES_INTRO = {
  title: 'Hverju má búast við',
  body: 'Hnúfubakur er algengastur á Arnarfirði. Ekkert er þó lofað, hafið ræður. Sjaldgæfari tegundir sjást stundum, en ekki í hverri ferð.',
} as const

/**
 * Species — research-honest likelihoods. Humpback lead; rarer species only
 * flagged as "stundum / sjaldan". We do NOT overclaim blue whales or orcas.
 */
export const SPECIES = [
  { is: 'Hnúfubakur', en: 'Humpback whale', chance: 'Algengastur', rare: false },
  { is: 'Hrefna', en: 'Minke whale', chance: 'Sést oft', rare: false },
  { is: 'Grindhvalur', en: 'Pilot whale', chance: 'Sést oft', rare: false },
  { is: 'Hnýðingur', en: 'White-beaked dolphin', chance: 'Sést oft', rare: false },
  { is: 'Steypireyður', en: 'Blue whale', chance: 'Stundum, sjaldan', rare: true },
  { is: 'Háhyrningur', en: 'Orca', chance: 'Stundum, sjaldan', rare: true },
] as const

/** The boat — the intimacy story. */
export const BOAT = {
  name: 'Beffa',
  kicker: 'Báturinn',
  title: 'Báturinn Beffa',
  lead: 'Níu metra bátur. Mest sjö gestir. Þetta er ekki tilviljun, það er hugmyndin.',
  body: 'Stóru hvalaskoðunarbátarnir í Reykjavík taka tvö hundruð manns. Á Beffu ert þú einn af sjö. Þú stendur við hlið skipstjórans, heyrir í honum án hátalara og finnur fjörðinn frá borðstokknum. Nándin er það sem þú manst eftir.',
  /** The contrast device: 200 on the big boats vs 7 here. */
  contrast: { big: 200, here: 7 },
  specs: [
    { k: 'Lengd', v: '9 metrar' },
    { k: 'Mest', v: '7 gestir' },
    { k: 'Ferð', v: '2 klst' },
    { k: 'Áhöfn', v: 'Heimaskipstjóri' },
  ],
  seats: 7,
} as const

export const INCLUDED_INTRO = {
  kicker: 'Allt innifalið',
  title: 'Engin aukagjöld, engin óvissa',
} as const

/** What's included — the trust block. */
export const INCLUDED = [
  { t: 'Björgunarvesti', d: 'Vottuð vesti fyrir alla um borð, mátuð áður en lagt er af stað.' },
  { t: 'Hlý teppi', d: 'Ullarteppi til að vefja um sig þegar sjávarloftið kólnar.' },
  { t: 'Heitur drykkur', d: 'Kakó eða kaffi á meðan beðið er eftir hvalnum.' },
  { t: 'Reyndur heimaskipstjóri', d: 'Skipstjóri sem þekkir fjörðinn og leiðsögn alla ferðina.' },
  { t: 'Full endurgreiðsla', d: 'Hindri veður ferðina færðu allt endurgreitt, engar spurningar.' },
  { t: 'Aflinn heim', d: 'Á sjóstangaferðum máttu taka aflann með þér heim.' },
] as const

/**
 * Booking — SAMPLE upcoming departures. Each shows the 7-seat capacity device.
 * `taken` of `BOAT.seats` are booked, so `BOAT.seats - taken` remain.
 */
export interface Departure {
  id: string
  weekday: string
  date: string
  time: string
  taken: number
  price: number
}

export const DEPARTURES: Departure[] = [
  { id: 'd1', weekday: 'Fimmtudag', date: '3. júlí', time: '09:00', taken: 3, price: 17900 },
  { id: 'd2', weekday: 'Fimmtudag', date: '3. júlí', time: '14:00', taken: 6, price: 17900 },
  { id: 'd3', weekday: 'Föstudag', date: '4. júlí', time: '09:00', taken: 1, price: 17900 },
  { id: 'd4', weekday: 'Laugardag', date: '5. júlí', time: '14:00', taken: 7, price: 17900 },
]

export const BOOKING = {
  kicker: 'Brottfarir · sýnishorn',
  title: 'Bókaðu sæti',
  lead: 'Veldu brottför. Þegar sætin sjö eru farin er ferðin fullbókuð, það er allt og sumt.',
  perPerson: 'kr. á mann',
  cta: 'Óska eftir bókun',
  ctaShort: 'Óska eftir bókun',
  pickPrompt: 'Veldu brottför hér að ofan',
  pickedLabel: 'Valin brottför',
  selectAria: 'Veldu þessa brottför',
  fullTag: 'Fullbókað',
  nextLabel: 'Næsta laust sæti',
  note: 'Þetta er bókunarbeiðni, engin greiðsla fer fram hér. Við staðfestum sætið með tölvupósti.',
} as const

/** Practical & contact. ONE clean contact — the redesign fixes the messy mix. */
export const CONTACT = {
  kicker: 'Hagnýtt og samband',
  title: 'Hagnýtt',
  harbour: 'Bíldudalshöfn',
  address: 'Dalbraut 1, 465 Bíldudalur',
  lat: 65.685,
  lng: -23.55,
  coordLabel: '65.685° N, 23.55° V',
  phone: '+354 855 5006',
  phoneHref: 'tel:+3548555006',
  phoneLabel: 'Sími',
  email: 'info@harbourinn.is',
  emailLabel: 'Bókanir',
  bookingVia: 'Bókanir fara í gegnum Harbour Inn',
  bookingViaNote: 'Ein leið, eitt svar, engin ruglingsleg netföng.',
  family: 'Fjölskyldurekið frá 2018',
  practical: [
    'Mætið 15 mínútum fyrir brottför á höfnina.',
    'Klæðið ykkur hlýtt, það er svalara úti á firðinum.',
    'Ferðin tekur um tvær klukkustundir frá bryggju að bryggju.',
  ],
} as const

export const STICKY = {
  label: 'Beffa · Arnarfjörður',
  sub: 'Mest 7 gestir · 2 klst',
  cta: 'Bóka sæti',
} as const
