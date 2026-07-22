/**
 * ISSI – Fish & Chips — "Beint af bátnum" redesign prototype.
 * Every fact, name, quote and image path here is drawn ONLY from the
 * research brief + dossier (issi.is own media library, 1819.is, Ferðalag.is,
 * Iceland Review, RÚV, fishfocus.co.uk, RestaurantGuru, TripAdvisor).
 *
 * Honesty guardrails encoded in this data (do not "improve" away):
 *  - Award = FINALIST/nominee in the international category of the 2026
 *    National Fish & Chip Awards. Never "winner" (Lake Mývatn won).
 *  - No fabricated itemized ISK prices. Portion names carry the menu; the one
 *    price signal is an approximate per-person range flagged as an estimate.
 *  - Grandfather/Akureyri-1942 story is an attributed anecdote ("Issi segir"),
 *    never narrated as fact, never illustrated with the soldiers stock photo.
 *  - Phone = 843 9333 (the two Icelandic-official sources agree); the
 *    unverified 789 7773 is never shown.
 *  - No single clean "founded in [year]"; the 2003/2007/2016 timeline has a
 *    real gap and is worded to preserve it.
 */

const BASE = import.meta.env.BASE_URL
/** Local, client-owned photography converted to WebP under /public/issi/. */
export const IMG = (file: string) => `${BASE}issi/${file}`

/* ---------------------------------------------------------------- Contact */
export const PHONE_DISPLAY = '843 9333'
export const PHONE_HREF = 'tel:+3548439333'
export const EMAIL = 'issi@issi.is'
export const EMAIL_HREF = 'mailto:issi@issi.is'
export const FACEBOOK = 'https://www.facebook.com/issifishandchips/'
export const THORFISH = 'https://www.thorfish.is'
export const TRIPADVISOR =
  'https://www.tripadvisor.com/Restaurant_Review-g7701727-d12556276-Reviews-Issi_Fish_Chips-Njardvik_Reykjanesbaer_Reykjanes_Peninsula.html'

/* -------------------------------------------------------------- Locations */
export interface Spot {
  name: string
  address: string
  place: string
  hours: { label: string; value: string }[]
  img: string
  imgMobile: string
  alt: string
  map: string
}

export const LOCATIONS: Spot[] = [
  {
    name: 'Fitjar',
    address: 'Fitjar 3',
    place: '260 Reykjanesbær',
    hours: [{ label: 'Alla daga', value: '11:00–20:00' }],
    img: IMG('06_issi_fitjar_snjor.webp'),
    imgMobile: IMG('06_issi_fitjar_snjor-900.webp'),
    alt: 'Hvíti ISSI kofinn á Fitjum að vetri til, grænt ljós skín út um gluggana og fiskbeina-merkið sést á rúðunni.',
    map: 'https://www.google.com/maps?q=Fitjar%203%2C%20260%20Reykjanesb%C3%A6r&output=embed',
  },
  {
    name: 'Selfoss',
    address: 'Við BYKO',
    place: '800 Selfoss',
    hours: [
      { label: 'Virka daga', value: '11:30–19:30' },
      { label: 'Laugardaga', value: '11:30–19:00' },
    ],
    img: IMG('07_Issi-Selfoss.webp'),
    imgMobile: IMG('07_Issi-Selfoss.webp'),
    alt: 'ISSI FISH&CHIPS vagninn stendur við BYKO á Selfossi ásamt merktum sendibíl fyrirtækisins.',
    map: 'https://www.google.com/maps?q=BYKO%20Selfoss&output=embed',
  },
]

/* ------------------------------------------------------------------- Menu */
export interface MenuHero {
  name: string
  note: string
  sizes: string[]
  img: string
  alt: string
}
/** Items we have real product-cutout photography for. */
export const MENU_HERO: MenuHero[] = [
  {
    name: 'Fiskur',
    note: 'Steikt eftir pöntun',
    sizes: ['Lítill', 'Miðlungs', 'Stór'],
    img: IMG('12_Fiskur-stor-haegri.webp'),
    alt: 'Stór skammtur af fiski og frönskum með sósu í opnum ISSI kassa á dagblaðapappír.',
  },
  {
    name: 'Blandaður',
    note: 'Fiskur og gellur saman',
    sizes: ['Miðlungs', 'Stór'],
    img: IMG('13_Blandadur-stor-haegri.webp'),
    alt: 'Blandaður stór skammtur af fiski og gellum með frönskum í ISSI kassa.',
  },
  {
    name: 'Franskar og laukhringir',
    note: 'Meðlæti',
    sizes: [],
    img: IMG('14_Franskar-og-laukhringir.webp'),
    alt: 'Franskar kartöflur og laukhringir í ISSI kassa á dagblaðapappír.',
  },
]
/** Real menu items we do not have standalone photography for — typographic. */
export const MENU_LIST: { name: string; note: string; sizes?: string }[] = [
  { name: 'Gellur', note: 'Ekta íslenskt sjávarlostæti', sizes: 'Lítill · Miðlungs · Stór' },
  { name: 'Issapopp', note: 'Litlir fiskbitar' },
  { name: 'Issaborgari', note: 'Fiskborgarinn okkar' },
  { name: 'Issa sósa', note: 'Hússósan sem allt snýst um' },
  { name: 'Drykkir', note: 'Gos og svaladrykkir' },
]
/** The only pricing signal available — an aggregator estimate, flagged as such. */
export const PRICE_ESTIMATE = 'Verðbil u.þ.b. 2.000–4.000 kr. á mann'
export const PRICE_SOURCE = 'Áætlun frá RestaurantGuru, ekki opinber verðskrá'

/* ---------------------------------------------------------------- Reviews */
export interface Review {
  quote: string
  author: string
  source: string
}
export const REVIEWS: Review[] = [
  {
    quote:
      'This place is INCREDIBLE. Not only is the food more than noteworthy, but the story behind the business and its name are as relatable as the owner himself, Jóhann.',
    author: '„WOW … Mic drop“',
    source: 'TripAdvisor',
  },
  {
    quote:
      'The BEST fish and chips I have ever had! Cute little side of the road stop, but don’t pass it by!',
    author: 'Kristy Murphy',
    source: 'Google · RestaurantGuru',
  },
  {
    quote:
      'The fish filets here are the freshest and best I have ever tasted in my entire life.',
    author: 'Larry Morales',
    source: 'Google · RestaurantGuru',
  },
]

/* ---------------------------------------------------------------- Ratings */
export const RATINGS = [
  { value: '4,9', platform: 'Google', detail: 'tæplega 1.200 umsagnir' },
  { value: '4,7', platform: 'TripAdvisor', detail: 'vel yfir 100 umsagnir' },
  { value: '5,0', platform: 'Facebook', detail: 'um 95 umsagnir' },
]

/* ------------------------------------------------------------------ Story */
export const SOURCING_QUOTE =
  'Allur fiskur sem við notum er frá Þorbirni í Grindavík, sérvalinn og sjófrystur.'
