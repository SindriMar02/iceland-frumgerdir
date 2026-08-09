/* ── Drangar Country Guesthouse — „Húsin muna" (the buildings remember) ──────
   NIB-lineage build (normalisboring.es studied at source, 2026-08-09; see
   scratchpad NIB-MASTER-TEARDOWN). Concept from the property's own material:
   Studio Granda's "principle of memory" renovation of standard 1980s farm
   buildings. A tractor shed is the most ordinary building in Iceland; here it
   is the most extraordinary place to sleep.

   EVERY fact and most sentences below come from their own channels, checked
   2026-08-09:
   - drangar.com (the About / Premium Experience / Views / Location copy)
   - west.is listing, written by the business (two buildings, room counts)
   - studiogranda.is (dates, materials, liveries, copper patina, mosaic)
   - honnunarmidstod.is (Icelandic Design Award 2020; Mies 2022 nomination)
   - booking.com (9.8/225 reviews, 2026 availability, 17 m² doubles,
     Traveller Review Award 2021: 9.7)
   - circon.graennibyggd.is (working farm until 2001, ~12 years of disrepair)
   NO personal names (owner names conflict across sources). NO prices.
   Kitchenette rooms identified from their own photographs (red + green).   */

const A = `${import.meta.env.BASE_URL}drangar/`

export const IMG = {
  estate: `${A}estate.webp`,          // copper barn + ridge + golden grass
  barnGable: `${A}barn-gable.webp`,   // the copper barn front elevation
  barnSea: `${A}barn-sea.webp`,       // the barn low against Breiðafjörður
  gate: `${A}gate.webp`,              // the DRANGAR gate over the road, dusk
  corridor: `${A}corridor.webp`,      // blue room | corridor | red room
  corridorLight: `${A}corridor-light.webp`, // bright shed corridor, slat ceiling
  shedCommon: `${A}shed-common.webp`, // shed common: picnic table, fjord view
  shedKitchen: `${A}shed-kitchen.webp`, // shed kitchen under oak coffers
  barnCommon: `${A}barn-common.webp`, // barn common: oak, rattan, sea view
  breakfastRoom: `${A}breakfast-room.webp`,
  breakfastSpread: `${A}breakfast-spread.webp`,
  roomGreen: `${A}room-green-wide.webp`,
  roomGreenDetail: `${A}room-green.webp`,
  greenKitchenette: `${A}green-kitchenette.webp`,
  roomBlue: `${A}room-blue-wide.webp`,
  roomBlueDesk: `${A}room-blue-desk.webp`,
  roomRed: `${A}room-red-wide.webp`,
  redKitchenette: `${A}red-kitchenette.webp`,
  roomOrange: `${A}room-orange-wide.webp`,
  roomBovine: `${A}room-bovine.webp`, // grey room, framed cow painting
  bathMosaic: `${A}bath-mosaic.webp`,
  copper: `${A}copper-texture.webp`,  // aubergine corrugation close-up
  islands: `${A}islands.webp`,        // Breiðafjörður dusk pano (their site)
  duskShore: `${A}dusk-shore.webp`,   // violet dusk over the water
  summerMeadow: `${A}summer-meadow.webp`, // green meadow, white farm, water
  entranceDusk: `${A}entrance-dusk.webp`, // concrete entrance + glazing at dusk
  auroraWindow: `${A}aurora-window.webp`, // aurora through the barn glazing
  aurora: `${A}aurora.webp`,
  winterShore: `${A}winter-shore.webp`,
}

export const EMAIL = 'drangar@drangar.com'
export const EMAIL_HREF = 'mailto:drangar@drangar.com'
export const PHONE_DISPLAY = '+354 855 1026'
export const PHONE_HREF = 'tel:+3548551026'
export const ADDRESS = 'Drangar, Skógarströnd, 371 Dalabyggð'
export const BOOKING_URL =
  'https://www.booking.com/hotel/is/drangar-country-guesthouse.html'
export const INSTAGRAM = 'https://www.instagram.com/drangarguesthouse'
export const FACEBOOK = 'https://www.facebook.com/DrangarCountryGuesthouse'

export const NAV = [
  { id: 'skemman', label: 'The Tractor Shed' },
  { id: 'efnin', label: 'The materials' },
  { id: 'fjosid', label: 'The Cow Barn' },
  { id: 'sagan', label: 'The story' },
  { id: 'heimsokn', label: 'Finding us' },
]

export const HERO = {
  word: 'DRANGAR',
  kicker: 'Country guesthouse (Skógarströnd)',
  /* condensed from their own About sentence, drangar.com */
  sub: 'A premium guesthouse on a renovated farm on the Snæfellsnes peninsula, bordering Dalir, two hours from Reykjavík.',
  copyright: '© Drangar',
}

/* ── Post-hero image pair (the reference's principal images panel).
   Their own arrival: the gate, then the buildings. ── */
export const ARRIVAL = {
  bigAlt: 'The copper-clad Cow Barn, front elevation against a bright sky',
  bigSpec: ['Fjósið', 'Skógarströnd', 'Est. um 1980 / 2019'],
}

/* The 4-line statement; line 4 slides into justification. */
export const STATEMENT = [
  'A tractor shed',
  'and a cow barn,',
  'on the shore of Breiðafjörður,',
  'remembered into a guesthouse.',
]
export const STATEMENT_BODY =
  'Until 2001 this was a working farm, its buildings raised in the early eighties from standard state blueprints. Studio Granda spent six years turning them into rooms, and kept every trace of what they were. The architects call it the principle of memory.'

/* ── Images-text module — the west.is sentence is theirs, verbatim. ── */
export const RENOVATED = {
  quote:
    'We have renovated two buildings in a unique style which celebrates the past and welcomes a modern vision.',
  attribution: 'In their own words',
  photoAlt: 'Breakfast laid on long timber tables in the panelled morning room',
  photo2Alt: 'The bright shed corridor under a slatted timber ceiling',
}

/* ── The Tractor Shed accordion — 4 real double rooms. Livery brands from
   studiogranda.is; kitchenettes placed only where their own photographs show
   them (red, green). 17 m² per booking.com. ── */
export interface Room {
  id: string
  num: string
  name: string
  livery: string
  field: string
  ink: string
  photo: string
  photoAlt: string
  photo2: string
  photo2Alt: string
  plate: string[]
  line: string
}
export const ROOMS: Room[] = [
  {
    id: 'graena',
    num: '01',
    name: 'The green room',
    livery: 'John Deere',
    field: '#2E5C38',
    ink: '#EDEBE6',
    photo: IMG.roomGreen,
    photoAlt: 'Guest room with glossy John Deere green ceiling, concrete bedhead wall and green lamp glow',
    photo2: IMG.greenKitchenette,
    photo2Alt: 'The green room kitchenette in oak against raw concrete',
    plate: ['17 m²', 'DOUBLE', 'EN SUITE', 'KITCHENETTE'],
    line: 'A glossy green ceiling over rough-cast concrete, a kitchenette in oak.',
  },
  {
    id: 'blaa',
    num: '02',
    name: 'The blue room',
    livery: 'New Holland',
    field: '#24406E',
    ink: '#EDEBE6',
    photo: IMG.roomBlue,
    photoAlt: 'Guest room in deep New Holland blue with a framed landscape over the bed',
    photo2: IMG.roomBlueDesk,
    photo2Alt: 'A lit white desk against the deep blue wall',
    plate: ['17 m²', 'DOUBLE', 'EN SUITE'],
    line: 'Deep working blue, one lamp lit, the sea outside.',
  },
  {
    id: 'rauda',
    num: '03',
    name: 'The red room',
    livery: 'Massey Ferguson',
    field: '#8F2018',
    ink: '#EDEBE6',
    photo: IMG.roomRed,
    photoAlt: 'Guest room painted glossy Massey Ferguson red over bare concrete, leather bedhead',
    photo2: IMG.redKitchenette,
    photo2Alt: 'The red room kitchenette in oak against the gloss red wall',
    plate: ['17 m²', 'DOUBLE', 'EN SUITE', 'KITCHENETTE'],
    line: 'Gloss red from wall to ceiling, a kitchenette against the concrete.',
  },
  {
    id: 'gula',
    num: '04',
    name: 'The orange room',
    livery: 'Kubota',
    field: '#9F4617',
    ink: '#EDEBE6',
    photo: IMG.roomOrange,
    photoAlt: 'Guest room in warm Kubota orange with a framed tractor print',
    photo2: IMG.bathMosaic,
    photo2Alt: 'The en suite bathroom in aquatic blue mosaic',
    plate: ['17 m²', 'DOUBLE', 'EN SUITE'],
    line: 'Workshop orange warmed to candlelight, a tractor print on the wall.',
  },
]
/* Their own sentences, drangar.com */
export const ROOMS_NOTE =
  'The superb accommodation includes a well-equipped common living space with cooking facilities. There are four unique double rooms with private bathrooms, and two of the rooms have kitchenettes. It is also possible for families to rent the whole house and use the sleeping sofa in the common area.'

/* ── Efnin — the materials, in the architects' own words. ── */
export interface Material {
  id: string
  title: string
  body: string
  photo: string
  photoAlt: string
}
export const MATERIALS: Material[] = [
  {
    id: 'steypa',
    title: 'Concrete',
    body: 'The original rough-cast walls stand untouched, offset by a new terrazzo floor.',
    photo: IMG.roomGreenDetail,
    photoAlt: 'Rough-cast concrete wall in a guest room',
  },
  {
    id: 'eik',
    title: 'Oak',
    body: 'Bespoke oak carpentry lines the ceilings and fitments of the communal rooms.',
    photo: IMG.shedKitchen,
    photoAlt: 'Oak coffered ceiling over the shed kitchen',
  },
  {
    id: 'kopar',
    title: 'Copper',
    body: 'Corrugated copper wraps the barn, weathering from brown through aubergine to Spanish green.',
    photo: IMG.copper,
    photoAlt: 'Corrugated copper cladding close up, aubergine patina',
  },
  {
    id: 'mosaik',
    title: 'Mosaic',
    body: 'Every bathroom is tiled in an aquatic blue mosaic.',
    photo: IMG.bathMosaic,
    photoAlt: 'Bathroom tiled in aquatic blue mosaic',
  },
]

/* ── Fjósið — the Cow Barn (west.is, their own listing). ── */
export const BARN = {
  is: 'Fjósið',
  body: 'Eight rooms wrapped in sleek copper where the cows once stood, six double and two triple, with a common room, kitchen and reception opening onto the water. All twelve rooms across the farm have bathrooms of their own.',
  photos: [
    { src: IMG.barnCommon, alt: 'The Cow Barn common room, oak ceiling and full-height glazing to the sea' },
    { src: IMG.roomBovine, alt: 'A bovine-grey guest room with a framed portrait of a cow' },
    { src: IMG.auroraWindow, alt: 'The aurora seen through the barn glazing' },
    { src: IMG.barnSea, alt: 'The copper-clad barn low against Breiðafjörður' },
  ],
}

/* ── Full-bleed slabs. ── */
export const ISLANDS = {
  kicker: 'Breiðafjörður',
  travelWord: 'islands',
}
export const SUMMER = {
  kicker: '(Summer on Skógarströnd)',
}

/* ── Sagan — the dated record. ── */
export const TIMELINE = [
  { year: 'um 1980', text: 'Farm buildings raised from standard state blueprints' },
  { year: '2001', text: 'The last working season, then twelve quiet years' },
  { year: '2013-2017', text: 'Studio Granda designs the renovation' },
  { year: '2014-2019', text: 'Construction, 1.056 m² remembered into rooms' },
  { year: '2020', text: 'Icelandic Design Award, winner' },
  { year: '2022', text: 'EU Mies van der Rohe Award, nominee' },
]
export const SAGA = {
  title: 'Designed to remember',
  credit: 'Renovation by Studio Granda, Reykjavík',
  award: 'Winner of the Icelandic Design Award 2020 and nominee for the EU Mies van der Rohe Award 2022. Rated 9.8 of 10 by 225 guests on Booking.com.',
}

/* ── Cierre — the single red panel. ── */
export const CIERRE = {
  lineA: 'Sleep in',
  lineB: 'the shed.',
  sub: 'Four rooms, one shore, live availability year round.',
}

export const CREDIT_NOTE =
  'Prototype by SNDR. Photography: the guesthouse’s own published images (drangar.com, booking.com, west.is). Facts and quoted copy from drangar.com, west.is, studiogranda.is and honnunarmidstod.is.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'GuestHouse',
  name: 'Drangar Country Guesthouse',
  url: 'https://drangar.com',
  email: 'drangar@drangar.com',
  telephone: '+354 855 1026',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Drangar, Skógarströnd',
    postalCode: '371',
    addressLocality: 'Dalabyggð',
    addressCountry: 'IS',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 65.046333, longitude: -22.423689 },
  award:
    'Icelandic Design Award 2020 (winner); EU Mies van der Rohe Award 2022 (nominee)',
  numberOfRooms: 12,
  image: 'https://drangar.com/img/hero.png',
}
