/**
 * Nýpugarðar — "Kvöldverðurinn á Mýrum"
 * One real evening at a working sheep and horse farm on Mýrar in Hornafjörður:
 * arrive among the animals, watch the glacier catch the last light, then sit
 * down with everyone else to the lamb dinner buffet. The page itself darkens
 * from daylight to night as you scroll (the "evening arc" signature).
 *
 * Every fact below is sourced from the 2026-07-18 brief/dossier:
 * Booking.com property page (live), HeyIceland listing, ferdalag.is, Keldan.
 * No founding year, no dinner price, no nightly rate — intentionally omitted
 * (unverifiable / dynamic). Guest quotes are real and attributed.
 */

const BASE = import.meta.env.BASE_URL

/** Local, vetted photos (copied from the prep manifest into public/nypugardar/). */
export const p = (file: string) => `${BASE}nypugardar/${file}`

export const IMG = {
  hero: p('bk_14_10523864.jpg'), // turf hut + guesthouse + glacier, one frame
  glacier: p('bk_15_10523812.jpg'), // wide glacier tongue over green farmland
  ridge: p('bk_09_125644995.jpg'), // snow-capped ridge, blue sky
  dining: p('bk_17_305950064.jpg'), // the real dining room, glacier-view windows
  deck: p('bk_05_510526816.jpg'), // dusk from the guesthouse deck
  dusk: p('bk_13_125645022.jpg'), // sunset over the grassland
  cottage1: p('bk_08_510524232.jpg'),
  cottage2: p('bk_36_510524306.jpg'),
  room1: p('bk_02_510526820.jpg'), // pine cabin room, sofa nook
  room2: p('bk_06_510524066.jpg'), // bedroom window framing farmland
  room3: p('bk_18_510521394.jpg'), // twin room, red-framed window
  bath: p('bk_03_510524063.jpg'), // clean modern bathroom
  sheep: p('us_sheep_7ye9WrKyxl8.jpg'), // Icelandic sheep, Unsplash (Zosia Szopka)
  horses: p('us_horses_diMBLU4FzDQ.jpg'), // Icelandic horses, Unsplash (Vladimir Riabinin)
  horsesPair: p('us_horses_R_rnbkwudCw.jpg'), // two horses nose to nose (Claire Nolan)
} as const

export const BOOKING_URL = 'https://www.booking.com/hotel/is/gistiheimilid-nypugordum.html'
export const PHONE = '893 1826'
export const PHONE_HREF = 'tel:+3548931826'
export const EMAIL = 'nypu@simnet.is'
export const ADDRESS = 'Nýpugarðar, 781 Höfn í Hornafirði'

export const NAV = [
  { id: 'farm', label: 'The farm' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'reviews', label: 'Guests' },
  { id: 'info', label: 'Find us' },
] as const

/** ferdalag.is unit breakdown, 2026-07-18 */
export const UNITS = [
  { n: '9', label: 'rooms with private bathroom' },
  { n: '2', label: 'rooms with shared bathroom' },
  { n: '2', label: 'cottages for 2 to 4 guests' },
  { n: '24', label: 'guests when the house is full' },
] as const

/** Booking.com house rules + ferdalag.is, 2026-07-18 */
export const HOUSE_RULES = [
  'Check-in 16:00–23:30',
  'Check-out 07:30–11:00',
  'Open all year',
  'No pets',
  'No smoking',
  'Children welcome, guests 7 and older pay as adults',
] as const

/** Booking.com location facts, 2026-07-18 */
export const DISTANCES = [
  { n: '4 km', label: 'off Route 1, the Ring Road' },
  { n: '25 min', label: 'drive to Höfn' },
  { n: '47 km', label: 'to Jökulsárlón glacier lagoon' },
] as const

/** Booking.com live score, fetched 2026-07-18 */
export const SCORE = {
  value: '8.8',
  word: 'Fabulous',
  count: '2,233',
  categories: [
    { label: 'Host', n: '9.3' },
    { label: 'Free WiFi', n: '9.2' },
    { label: 'Cleanliness', n: '9.1' },
    { label: 'Comfort', n: '9.1' },
    { label: 'Location', n: '9.1' },
    { label: 'Value for money', n: '8.9' },
  ],
} as const

/** Real, attributed quotes from Booking.com's review widget, live 2026-07-18. */
export const DINNER_QUOTE = {
  text: 'I could not hype this place enough. It was wonderful!! In the middle of grassy planes with sheep grazing. Amazing views of the mountains that you could see even when in bed! Local Cuisine with farm to table ingredients! Happy staff!!',
  name: 'Stefanos',
  place: 'Germany',
} as const

export const QUOTES = [
  {
    text: 'Staff were friendly and hospitable. Views stunning. Dinner & breakfast outstanding and great value for money. Very comfortable, warm and quiet.',
    name: 'Felicity',
    place: 'United Kingdom',
    note: null,
  },
  {
    text: 'Million dollar view, good breakfast, comfortable and cozy! A memorable stay😁😁',
    name: 'Millist',
    place: 'Australia',
    note: null,
  },
  {
    text: 'Best accommodation of our Icelandic holiday. Immersed in nature, beautiful dining room overlooking the countryside with glaciers visible in good weather, excellent and rich breakfast with local products.',
    name: 'Paolo',
    place: 'Italy',
    note: 'Translated from Italian',
  },
] as const

/** Room photo mosaic — captions describe only what each photo shows. */
export const ROOM_PHOTOS = [
  { src: IMG.room1, alt: 'Pine-walled cabin room at Nýpugarðar with twin beds and a small sofa nook', caption: 'Pine cabin room' },
  { src: IMG.room2, alt: 'Bedroom at Nýpugarðar with a window framing open farmland to the horizon', caption: 'Room with a farmland view' },
  { src: IMG.room3, alt: 'Twin room at Nýpugarðar with a red-framed window looking over the fields', caption: 'Twin room' },
  { src: IMG.bath, alt: 'Modern white-tiled bathroom with a shower at Nýpugarðar', caption: 'Bathroom' },
] as const

export const FOOTNOTE =
  'This page is a redesign concept built by SNDR Studio from publicly available information (Booking.com, HeyIceland, Ferðalag.is) as of July 2026. It is a sample layout, not the official website of Nýpugarðar. Guest quotes are real and attributed to Booking.com; individual review dates were not published there. Nightly rates and the dinner buffet price are deliberately not shown because they change with the season. Please confirm current prices and availability on the linked Booking.com page or directly with the farm.'
