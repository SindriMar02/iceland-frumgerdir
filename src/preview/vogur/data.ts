/* ── Vogur Country Lodge — „Fjaran" (the shore at low tide) ────────────────
   Fourth build on the Drangar / NIB engine (src/preview/drangar). Vogur means
   an inlet; outside it lie Breiðafjörður's countless islands and skerries,
   which the tide uncovers twice a day. Reference teardown (Pinterest →
   live sites → capture.mjs): _docs/vogur-2026-10-24/teardown/.

   EVERY fact below comes from Vogur's own channels, read 2026-10-24:
   - vogur.org (Home, Activities: the Dalir text is theirs)
   - their Godo booking engine, propid 89686 (room types, the Double's
     description, one-night prices for 15 June 2027)
   - their Hey Iceland listing (description, facilities, open all year)
   - OpenStreetMap + OSRM for coordinates and road distances from the lodge
   NO personal names. Prices labelled with their date and conditions. */

const A = `${import.meta.env.BASE_URL}vogur/`

export const IMG = {
  aerial: `${A}aerial.webp`,          // the white farm, red roofs, ravine behind
  islands: `${A}islands.webp`,        // Breiðafjörður islands from the rocks
  night: `${A}night.webp`,            // the lodge lit, aurora over the ridge
  aurora: `${A}aurora.webp`,
  stone: `${A}stone.webp`,            // the boulder carved VOGUR, heather
  stoneWide: `${A}stone-wide.webp`,
  window: `${A}window.webp`,          // navy window frame, mountain
  deck: `${A}deck.webp`,              // the deck, Snæfellsjökull across the bay
  deckSun: `${A}deck-sun.webp`,
  deckWinter: `${A}deck-winter.webp`,
  sill: `${A}sill.webp`,
  rocks: `${A}rocks.webp`,
  roomDouble: `${A}room-double.webp`,
  roomDouble2: `${A}room-double-2.webp`,
  roomTwin: `${A}room-twin.webp`,
  roomSlate: `${A}room-slate.webp`,
  roomFamily: `${A}room-family.webp`,
  roomSuperior: `${A}room-superior.webp`,
  roomSuperior2: `${A}room-superior-2.webp`,
  roomJunior: `${A}room-junior.webp`,
  roomJunior2: `${A}room-junior-2.webp`,
  bath: `${A}bath.webp`,
  bathJunior: `${A}bath-junior.webp`,
  lounge: `${A}lounge.webp`,
  dining: `${A}dining.webp`,
  cod: `${A}cod.webp`,
  soup: `${A}soup.webp`,
  breakfast: `${A}breakfast.webp`,
  sunset: `${A}sunset.webp`,
  winter: `${A}winter.webp`,
  road: `${A}road.webp`,
  bbq: `${A}bbq.webp`,
  viewBay: `${A}view-bay.webp`,
}

export const EMAIL = 'vogur@vogur.org'
export const EMAIL_HREF = 'mailto:vogur@vogur.org'
export const PHONE_DISPLAY = '+354 894 4396'
export const PHONE_HREF = 'tel:+3548944396'
export const ADDRESS = 'Vogur, Fellsströnd, 371 Búðardalur'
export const COORDS = '65°10′36″N 22°21′58″W'
/* Godo honours checkin/nights/adults on the booking page (tested 24 Oct). */
export const BOOKING_URL = 'https://property.godo.is/booking2.php?propid=89686'

export const NAV = [
  { id: 'herbergin', label: 'Rooms' },
  { id: 'husid', label: 'The house' },
  { id: 'kvoldin', label: 'Evenings' },
  { id: 'dalir', label: 'Dalir' },
  { id: 'kort', label: 'Map' },
  { id: 'heimsokn', label: 'Finding us' },
]

export const HERO = {
  word: 'VOGUR',
  kicker: 'Country lodge (Fellsströnd)',
  /* condensed from their Hey Iceland description */
  sub: 'A country lodge off the beaten track on Fellsströnd, looking out over the islands and skerries of Breiðafjörður. Open all year.',
  copyright: '© Vogur',
}

export const ARRIVAL = {
  bigAlt: 'The islands and skerries of Breiðafjörður seen from the rocks above Vogur',
  bigSpec: ['Breiðafjörður', '65°10´N', 'From the rocks above the lodge'],
}

/* The 4-line statement; line 4 slides into justification. */
export const STATEMENT = [
  'A country lodge',
  'on Fellsströnd,',
  'where the tide goes out',
  'over countless islands.',
]
/* their Hey Iceland description, verbatim apart from tense */
export const STATEMENT_BODY =
  'Vogur is a well equipped country lodge in a peaceful area truly off the beaten track, offering splendid views out to Breiðafjörður Bay’s countless small islands and skerries. Snæfellsjökull Glacier, a beautifully shaped extinct volcano, looms in the distance.'

/* Images-text module: their own sentence (Hey Iceland listing). */
export const QUOTE = {
  quote:
    'Vogur is an ideal base for hikes along the coast, into the valleys or up to the mountains and for exploring historic sites featured in Icelandic Sagas.',
  attribution: 'In their own words',
  photoAlt: 'A guest on the window sill with a cup of coffee, fields outside',
  photo2Alt: 'A guest on the deck in low sun',
}

/* ── Rooms accordion: Godo's room types with real prices. Fields are hues
   Vogur owns in its own pictures: the slate wainscot painted in every room,
   the navy window frames, the red roofs, the heather on the hill. ── */
export interface Room {
  id: string
  num: string
  name: string
  is: string
  field: string
  ink: string
  photo: string
  photoAlt: string
  photo2: string
  photo2Alt: string
  plate: string[]
  line: string
  price: string
}
export const ROOMS: Room[] = [
  {
    id: 'double',
    num: '01',
    name: 'Double room',
    is: 'Tveggja manna, hjónarúm',
    field: '#55666B',
    ink: '#F3F4F1',
    photo: IMG.roomDouble,
    photoAlt: 'A double room with a queen bed, hardwood floor and slate-blue wainscot',
    photo2: IMG.bath,
    photo2Alt: 'The bathroom with a walk-in shower',
    plate: ['20 m²', 'QUEEN BED', 'EN SUITE'],
    line: 'Bright, modern room with hardwood floors and a table and chair set.',
    price: '€210.80',
  },
  {
    id: 'twin',
    num: '02',
    name: 'Twin room',
    is: 'Tveggja manna, tvö rúm',
    field: '#233542',
    ink: '#F3F4F1',
    photo: IMG.roomTwin,
    photoAlt: 'A room at Vogur with two beds',
    photo2: IMG.roomSlate,
    photo2Alt: 'White upper walls over the slate-blue wainscot',
    plate: ['TWO BEDS', 'EN SUITE'],
    line: 'Two beds under white-and-slate walls.',
    price: '€210.80',
  },
  {
    id: 'superior',
    num: '03',
    name: 'Superior room',
    is: 'Superior herbergi',
    field: '#88303C',
    ink: '#F3F4F1',
    photo: IMG.roomSuperior,
    photoAlt: 'A superior room with a sitting area and window',
    photo2: IMG.roomSuperior2,
    photo2Alt: 'A superior room with its sitting area',
    plate: ['SITTING AREA', 'EN SUITE'],
    line: 'A sitting corner by the window, the fields outside.',
    price: '€284.75',
  },
  {
    id: 'junior',
    num: '04',
    name: 'Junior suite',
    is: 'Junior svíta',
    field: '#5C4330',
    ink: '#F3F4F1',
    photo: IMG.roomJunior,
    photoAlt: 'A junior suite with a sofa and bed',
    photo2: IMG.bathJunior,
    photo2Alt: 'The bathroom of a junior suite',
    plate: ['SOFA', 'EN SUITE'],
    line: 'A sofa, a bed and a window on the view.',
    price: '€369.75',
  },
]
/* the other two Godo types, and the price conditions */
export const ROOMS_NOTE =
  'Also single rooms (€192.10 for one guest) and family rooms (€369.75 for two). Every room has its own bathroom. Prices are Godo’s standard rate for one night on 15 June 2027 for two guests unless stated, read from Vogur’s booking engine on 24 October 2026.'

/* ── The house: rows with a cursor that becomes the photograph. ── */
export interface Row {
  id: string
  title: string
  body: string
  photo: string
  photoAlt: string
}
export const HOUSE: Row[] = [
  {
    id: 'restaurant',
    title: 'Restaurant',
    body: 'A restaurant and bar, with meals on request.',
    photo: IMG.dining,
    photoAlt: 'The dining room in the evening',
  },
  {
    id: 'breakfast',
    title: 'Breakfast',
    body: 'A breakfast buffet each morning.',
    photo: IMG.breakfast,
    photoAlt: 'The breakfast buffet',
  },
  {
    id: 'pottur',
    title: 'Hot tub',
    body: 'A hot tub and a sauna for the end of the day.',
    photo: IMG.deckWinter,
    photoAlt: 'A guest in the hot tub, snow on the mountains across the bay',
  },
  {
    id: 'grill',
    title: 'Barbecue hut',
    body: 'Open to guests for their own meals. Meat and dairy products can be bought on site.',
    photo: IMG.bbq,
    photoAlt: 'The barbecue hut with reindeer hides',
  },
]

/* ── Evenings: pin-in-pin filmstrip. ── */
export const EVENINGS = {
  is: 'Kvöldin',
  body: 'When it gets dark the lodge lights up against the ridge. If you like, they wake you when the northern lights appear.',
  photos: [
    { src: IMG.night, alt: 'The lodge lit up at night with northern lights over the mountain', cap: 'The lodge at night' },
    { src: IMG.aurora, alt: 'Northern lights over the lit lodge', cap: 'The wake-up call' },
    { src: IMG.sunset, alt: 'Sunset through a window at Vogur', cap: 'Sunset from a window' },
    { src: IMG.lounge, alt: 'The lounge with leather sofas and hides', cap: 'The lounge' },
  ],
}

/* ── Full-bleed slabs. ── */
export const ISLANDS = {
  kicker: 'Breiðafjörður',
  travelWord: 'skerries',
}
export const WINTER = {
  kicker: '(Fellsströnd in winter, open all year)',
}

/* ── Dalir: their activities text + real road distances (OSRM, 24 Oct). ── */
export const DALIR = {
  title: 'A stepping-stone into the New World',
  credit: 'Their own words, on the Dalir around Vogur',
  body: 'Few parts of Iceland are as rich in history as Dalir, where records go back virtually unbroken to the Settlement. Eirík the Red, who pioneered the settlement of Greenland, lived at Eiríksstaðir in Haukadalur; his son, Leif the Lucky, was born there.',
}
export const DISTANCES = [
  { km: '11 km', text: 'Klofningur, the rocks on the coast road' },
  { km: '21 km', text: 'Skarð church, Skarðsströnd' },
  { km: '42 km', text: 'Laugar in Sælingsdalur, a geothermal pool' },
  { km: '54 km', text: 'Búðardalur, the village of Dalir' },
  { km: '70 km', text: 'Erpsstaðir, taste and buy from the farm' },
  { km: '72 km', text: 'Eiríksstaðir, Leif the Lucky’s birthplace' },
  { km: '208 km', text: 'Reykjavík, about 3 h 11 min by road' },
]

/* ── Cierre — the single roof-red panel. ── */
export const CIERRE = {
  lineA: 'Stay by',
  lineB: 'the shore.',
  sub: 'Six kinds of room, one bay, open all year.',
}

export const CREDIT_NOTE =
  'Prototype by SNDR. Photography: the lodge’s own published images (vogur.org, Godo, Hey Iceland, and its hotel-supplied gallery on Expedia). Facts and quoted copy from vogur.org, their Godo engine and Hey Iceland listing; road distances from OpenStreetMap and OSRM, 24 October 2026.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: 'Vogur Country Lodge',
  url: 'https://vogur.org',
  email: 'vogur@vogur.org',
  telephone: '+354 894 4396',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Vogur, Fellsströnd',
    postalCode: '371',
    addressLocality: 'Búðardalur',
    addressCountry: 'IS',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 65.1766598, longitude: -22.3660028 },
}

/* ── The map: OpenStreetMap coastline (Overpass natural=coastline, bbox
   64.95,-23.35,65.52,-21.40, read 24 Oct 2026, ODbL) drawn from
   public/vogur/chart.json. Road distances: OSRM from the lodge. ── */
export const MAP = {
  src: `${A}chart.json`,
  bbox: [64.95, -23.35, 65.52, -21.40] as [number, number, number, number],
  vogur: { lat: 65.1766598, lon: -22.3660028 },
  credit: 'Coastline © OpenStreetMap contributors. Distances by road from Vogur (OSRM).',
}
export const PLACES = [
  { name: 'Klofningur', lat: 65.2154, lon: -22.4382, note: '11 km' },
  { name: 'Skarð', lat: 65.2802, lon: -22.3124, note: '21 km' },
  { name: 'Laugar', lat: 65.2469, lon: -21.8024, note: '42 km · hot pool' },
  { name: 'Búðardalur', lat: 65.1098, lon: -21.7668, note: '54 km' },
  { name: 'Erpsstaðir', lat: 65.0022, lon: -21.6287, note: '70 km · farm' },
  { name: 'Eiríksstaðir', lat: 65.0586, lon: -21.5384, note: '72 km · saga farm' },
  { name: 'Stykkishólmur', lat: 65.0743, lon: -22.7303, note: '140 km · ferry' },
  { name: 'Flatey', lat: 65.3757, lon: -22.9168, note: 'island · by ferry' },
]

/* ── Reviews: short verbatim excerpts from their public Google Maps listing
   (read 24 Oct 2026). Staff names left out; reviewers by first name and
   initial. ── */
export const RATING = { score: '4.4', count: '167', source: 'Google reviews', read: 'read 24 October 2026' }
export const REVIEWS = [
  { quote: 'The rooms here are large and have amazing views of the surrounding countryside.', who: 'Amanda P.', where: 'Google' },
  { quote: 'Love the sauna and hot tub. Just a 20 min walk to a lovely waterfall.', who: 'A Tripadvisor guest', where: 'via Google' },
  { quote: 'Wonderful place to stay away from the city. The hospitality was exceptional.', who: 'Michelle C.', where: 'Google' },
  { quote: 'This was my favourite stay in Iceland.', who: 'Annabelle R.', where: 'Google' },
  { quote: 'From the moment we arrived, the staff went above and beyond to make us feel incredibly welcome.', who: 'Mladen Ž.', where: 'Google' },
]
