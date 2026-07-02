/**
 * LANDMÆLING — content & geometry for the GJ Travel survey-sheet rebuild.
 * Numbers are honest where verifiable (1931, 63 seats, 1,332 km ring road,
 * 2025 Responsible Tourism Award); itinerary prices/details are samples,
 * disclaimed in the footer like every prototype.
 */

export const RING_ROAD_KM = 1332

/** Waypoints the global instrument cluster interpolates between (page progress 0→1). */
export const SURVEY_WAYPOINTS = [
  { p: 0.0, lat: 64.146, lng: -21.943 }, // Reykjavík
  { p: 0.34, lat: 63.533, lng: -19.511 }, // Vík
  { p: 0.62, lat: 64.256, lng: -15.21 }, // Höfn
  { p: 0.82, lat: 65.683, lng: -18.091 }, // Akureyri
  { p: 1.0, lat: 64.146, lng: -21.943 }, // back to base
]

export interface Milestone {
  year: number
  mark: string
  title: string
  body: string
}

export const MILESTONES: Milestone[] = [
  {
    year: 1931,
    mark: 'BM-01',
    title: 'The first crossing',
    body: 'Guðmundur Jónasson begins driving Iceland’s mountain tracks — reading rivers by eye, years before bridges or maps caught up.',
  },
  {
    year: 1950,
    mark: 'BM-02',
    title: 'The unbridged years',
    body: 'Glacier rivers crossed by sounding the ford on foot. The ledger entry is famously dry: “crossed.”',
  },
  {
    year: 1974,
    mark: 'BM-03',
    title: 'The loop closes',
    body: 'The Ring Road is completed — 1,332 kilometres GJ coaches already knew in pieces, now driven whole.',
  },
  {
    year: 1990,
    mark: 'BM-04',
    title: 'The world arrives',
    body: 'A full incoming agency: escorted groups, multilingual guides, conferences — organised with highland discipline.',
  },
  {
    year: 2012,
    mark: 'BM-05',
    title: 'The far shore',
    body: 'Greenland and the Faroe Islands join the map. The survey extends across the Denmark Strait.',
  },
  {
    year: 2025,
    mark: 'BM-06',
    title: 'Responsible Tourism Award',
    body: 'Ninety-four years of careful passage, formally recognised. Carbon offset through the Katla reforestation project.',
  },
  {
    year: 2026,
    mark: 'BM-07',
    title: 'Year 95 of operation',
    body: 'Same family standards, modern fleet, the calm that only decades of weather can teach. The line continues.',
  },
]

export interface RouteDay {
  label: string
  detail: string
}

export interface SurveyRoute {
  id: string
  name: string
  meta: string
  season: string
  priceFrom: string
  desc: string
  days: RouteDay[]
  /** Path inside the 440×300 map viewBox */
  path: string
  waypoints: { x: number; y: number; label: string }[]
  /** Elevation sparkline points inside 300×56 */
  elevation: string
  maxElevation: string
  greenland?: boolean
}

export const ROUTES: SurveyRoute[] = [
  {
    id: 'R-01',
    name: 'The Grand Circle',
    meta: '8 days · 1,332 km',
    season: 'May – Sep',
    priceFrom: 'from 349.000 kr.',
    desc: 'The whole country in one unhurried loop — glaciers, fjords, whale country and the geothermal north, escorted by a guide who has driven it for decades.',
    days: [
      { label: 'Days 1–2', detail: 'Golden Circle & south coast — Þingvellir, Gullfoss, black-sand Vík' },
      { label: 'Days 3–5', detail: 'Glacier lagoon, the East Fjords, herring towns of the north' },
      { label: 'Days 6–8', detail: 'Mývatn geothermal fields, Akureyri, the western return' },
    ],
    path: 'M120 198 C150 215 190 228 225 230 C265 228 300 212 330 192 C352 175 366 152 369 128 C371 108 362 92 344 84 C320 72 290 66 262 70 C220 74 190 80 168 92 C152 102 140 122 128 150 C122 166 119 184 120 198 Z',
    waypoints: [
      { x: 120, y: 198, label: 'Reykjavík' },
      { x: 222, y: 230, label: 'Vík' },
      { x: 340, y: 186, label: 'Höfn' },
      { x: 254, y: 76, label: 'Akureyri' },
    ],
    elevation: '0,46 30,40 60,44 90,28 120,36 150,22 180,34 210,26 240,38 270,30 300,44',
    maxElevation: '540 m',
  },
  {
    id: 'R-02',
    name: 'South Coast & Lagoon',
    meta: '2 days · 380 km',
    season: 'All year',
    priceFrom: 'from 89.000 kr.',
    desc: 'Waterfalls, black beaches and a night beside Europe’s largest glacier — the essential south, paced for light rather than schedules.',
    days: [
      { label: 'Day 1', detail: 'Seljalandsfoss, Skógafoss, Reynisfjara — overnight near the ice' },
      { label: 'Day 2', detail: 'Jökulsárlón glacier lagoon & Diamond Beach, returning by dusk' },
    ],
    path: 'M120 198 C150 215 185 227 220 231 C252 232 282 222 306 207',
    waypoints: [
      { x: 120, y: 198, label: 'Reykjavík' },
      { x: 222, y: 230, label: 'Vík' },
      { x: 306, y: 207, label: 'Jökulsárlón' },
    ],
    elevation: '0,48 60,44 120,46 180,28 240,40 300,34',
    maxElevation: '120 m',
  },
  {
    id: 'R-03',
    name: 'Highlands Crossing',
    meta: '4 days · 4x4 coach',
    season: 'Jul – Aug',
    priceFrom: 'from 215.000 kr.',
    desc: 'Through the interior on a high-clearance coach — rhyolite mountains, glacial fords and roads that are closed ten months of the year.',
    days: [
      { label: 'Day 1', detail: 'Into the Kjölur corridor between two glaciers' },
      { label: 'Days 2–3', detail: 'Hot-spring oases, obsidian fields, a night at a mountain hut' },
      { label: 'Day 4', detail: 'Descent to the north coast at Akureyri' },
    ],
    path: 'M150 185 C160 165 170 145 182 125 C192 108 210 92 232 84 C239 81 246 80 252 80',
    waypoints: [
      { x: 150, y: 185, label: 'Gullfoss' },
      { x: 186, y: 120, label: 'Hveravellir' },
      { x: 252, y: 80, label: 'Akureyri' },
    ],
    elevation: '0,46 50,28 100,16 150,10 200,18 250,30 300,44',
    maxElevation: '700 m',
  },
  {
    id: 'R-04',
    name: 'Greenland: The Far Shore',
    meta: '+4 days · extension',
    season: 'Jun – Aug',
    priceFrom: 'from 385.000 kr.',
    desc: 'Across the Denmark Strait to the icefjords — a Greenland extension run with the same escorts, the same calm, a bigger horizon.',
    days: [
      { label: 'Day 1', detail: 'Flight from Reykjavík over the strait' },
      { label: 'Days 2–3', detail: 'Icefjord sailings, settlement visits, midnight light' },
      { label: 'Day 4', detail: 'Return crossing to Reykjavík' },
    ],
    path: 'M120 198 C100 210 70 226 44 240 C32 246 18 252 6 257',
    waypoints: [
      { x: 120, y: 198, label: 'Reykjavík' },
      { x: 40, y: 242, label: 'To Kulusuk' },
    ],
    elevation: '0,44 40,18 80,34 120,12 160,28 200,16 240,38 300,36',
    maxElevation: 'sea level → 980 m',
    greenland: true,
  },
]

export interface FleetVehicle {
  reg: string
  name: string
  type: string
  seats: string
  drive: string
  clearance: string
  commissioned: string
  role: string
  lengthM: number
  vermilion?: boolean
}

export const FLEET: FleetVehicle[] = [
  {
    reg: 'GJ-63',
    name: 'Grand Tourer 63',
    type: 'Luxury touring coach',
    seats: '63',
    drive: '6×2',
    clearance: '180 mm',
    commissioned: '2023',
    role: 'Escorted group tours, ring road',
    lengthM: 13.8,
  },
  {
    reg: 'GJ-4X',
    name: 'Highland 46',
    type: 'High-clearance 4x4 coach',
    seats: '46',
    drive: '4×4',
    clearance: '390 mm',
    commissioned: '2021',
    role: 'F-roads, glacial fords, interior crossings',
    lengthM: 12.2,
  },
  {
    reg: 'GJ-19',
    name: 'Fjord Runner',
    type: 'Executive minibus',
    seats: '19',
    drive: '4×2',
    clearance: '200 mm',
    commissioned: '2024',
    role: 'Private groups, incentives, transfers',
    lengthM: 7.7,
  },
  {
    reg: 'GJ-SJ',
    name: 'Super Jeep',
    type: 'Modified expedition 4x4',
    seats: '6',
    drive: '4×4 · 44″ tyres',
    clearance: '460 mm',
    commissioned: '2022',
    role: 'Small parties, winter highlands, ice caves',
    lengthM: 5.6,
  },
  {
    reg: 'GJ-62',
    name: 'The 1962 Original',
    type: 'Heritage coach',
    seats: '28',
    drive: '4×2',
    clearance: '—',
    commissioned: '1962',
    role: 'Retired from rivers. Never from parades.',
    lengthM: 8.6,
    vermilion: true,
  },
]

export interface LogEntry {
  stamp: string
  quote: string
  name: string
}

export const LOGBOOK: LogEntry[] = [
  {
    stamp: 'LOG 2025-07 · 42 PAX · R-01 GRAND CIRCLE',
    quote: 'Every transfer, every meal, every contingency was handled before we thought to ask. Forty-two colleagues, zero logistics emails.',
    name: 'Event organiser · corporate group, Germany',
  },
  {
    stamp: 'LOG 2025-09 · 2 PAX · R-03 HIGHLANDS',
    quote: 'Our driver had thirty years of highland routes behind him. You cannot buy that kind of calm when a storm rolls in. You can only book it.',
    name: 'Robert & Ellen · highlands crossing',
  },
  {
    stamp: 'LOG 2026-01 · 4 PAX · WINTER',
    quote: 'Booked late, changed dates twice, got a personal reply within the hour each time.',
    name: 'Priya S. · winter package',
  },
]

/**
 * Simplified Iceland coastline for the Atlas sheet (440×300 viewBox),
 * plotted from real geographic anchors (lon −24.5…−13.5 → x, lat 66.6…63.3 → y):
 * Westfjords mass NW, Snæfellsnes spike W, Reykjanes SW, smooth fjordless
 * south coast, the East Fjords, and the northern peninsulas with Langanes.
 */
export const ICELAND_OUTLINE =
  'M120 198 C116 188 118 176 120 169 C114 165 108 162 102 161 C84 160 64 158 46 155 C40 153 40 148 47 146 C70 140 92 136 112 132 C100 124 80 124 62 116 C48 110 36 106 30 100 C26 92 34 88 40 86 C32 78 36 68 46 66 C42 56 50 44 62 40 C68 34 74 30 78 31 C86 32 95 33 103 35 C108 42 104 50 112 54 C118 58 120 64 118 72 C120 84 122 92 124 100 C130 110 138 118 147 122 C152 116 156 104 158 92 C162 76 168 62 176 56 C180 54 184 54 186 56 C190 60 192 64 194 70 C198 78 200 82 204 84 C208 72 212 56 220 50 C224 48 228 48 230 52 C234 58 234 64 236 72 C240 80 246 86 252 86 C258 76 262 62 270 54 C274 50 278 49 282 50 C290 52 294 56 298 58 C302 46 304 32 312 28 C316 27 320 28 322 31 C326 38 328 44 332 48 C342 50 356 42 372 34 C376 33 378 36 376 39 C366 46 356 52 350 58 C356 68 360 76 364 82 C374 92 382 98 388 106 C384 110 384 114 392 120 C398 126 400 130 396 136 C398 142 402 146 398 154 C392 170 374 184 352 192 C336 204 320 214 303 222 C270 240 244 250 220 252 C195 252 170 247 150 240 C132 234 116 228 104 221 C94 216 88 212 92 207 C100 202 110 200 120 198 Z'

/** Graticule lines for the map plate. */
export const MAP_GRATICULE = [
  'M0 75 H440',
  'M0 150 H440',
  'M0 225 H440',
  'M110 0 V300',
  'M220 0 V300',
  'M330 0 V300',
]

/* ────────────────────────────────────────────────────────────────────
   SHEET IV — THE BOOKING DESK.
   The real gjtravel.is catalog (WordPress + TourMaster booking engine):
   tour NAMES, DURATIONS and CATEGORY structure below are verified from
   gjtravel.is (availability-overview + menus, fetched 2026-07-02).
   Departure dates, seat counts and prices are SAMPLES for the
   demonstration desk, disclaimed inline and in the footer.
   ──────────────────────────────────────────────────────────────────── */

export interface CatalogTour {
  name: string
  days: number
  season: string
  /** guided languages beyond English, when the real product is language-specific */
  lang?: string
  smallGroup?: boolean
  isNew?: boolean
}

export interface TourCategory {
  id: string
  label: string
  note: string
  tours: CatalogTour[]
}

export const TOUR_CATALOG: TourCategory[] = [
  {
    id: 'summer',
    label: 'Summer Iceland',
    note: 'Escorted coach journeys · May – September',
    tours: [
      { name: 'Gems of South Iceland', days: 3, season: 'May – Sep' },
      { name: 'Land of Midnight Sun', days: 5, season: 'Jun – Jul' },
      { name: 'Gems of South Iceland & Reykjavík', days: 6, season: 'May – Sep' },
      { name: 'Gracious Southwest Iceland', days: 7, season: 'All year' },
      { name: 'Westfjords of Iceland', days: 8, season: 'Jun – Aug' },
      { name: 'Guided Iceland Circle', days: 8, season: 'May – Sep' },
      { name: 'Grand Tour of Iceland', days: 12, season: 'Jun – Aug' },
      { name: 'Iceland Circle & Westfjords Combo', days: 17, season: 'Jun – Aug' },
    ],
  },
  {
    id: 'winter',
    label: 'Winter & Aurora',
    note: 'Northern-lights season · September – April',
    tours: [
      { name: 'Land of Northern Lights', days: 5, season: 'Sep – Apr' },
      { name: 'Gracious Southwest Iceland', days: 7, season: 'All year' },
      { name: 'Northern Lights Secrets — Westfjords', days: 7, season: 'Sep – Apr' },
      { name: 'Northern Lights Exploration', days: 8, season: 'Sep – Apr' },
      { name: 'Northern Lights Exploration — Small Group', days: 8, season: 'Sep – Apr', smallGroup: true },
      { name: 'Guided Iceland Circle & Northern Lights', days: 8, season: 'Sep – Apr' },
      { name: 'Combo: Land of Northern Lights & Westfjords Secrets', days: 11, season: 'Sep – Apr' },
      { name: 'Combo: Westfjords Secrets & Iceland Circle', days: 12, season: 'Sep – Apr' },
    ],
  },
  {
    id: 'holiday',
    label: 'Holidays & Eclipse 2026',
    note: 'Christmas, New Year — and totality over Iceland, August 2026',
    tours: [
      { name: 'Christmas & Northern Lights Adventure', days: 5, season: 'December' },
      { name: 'New Year’s Northern Lights Adventure', days: 5, season: 'Dec – Jan' },
      { name: 'Reykjavík Solar Eclipse City Break', days: 5, season: 'Aug 2026', isNew: true },
      { name: 'Reykjavík & Solar Eclipse Adventure — Small Group', days: 5, season: 'Aug 2026', smallGroup: true },
      { name: 'South Iceland & Reykjavík Solar Eclipse Break', days: 8, season: 'Aug 2026' },
      { name: 'Grand Tour of Iceland — Small Group', days: 12, season: 'Aug 2026', smallGroup: true },
    ],
  },
  {
    id: 'greenland',
    label: 'Greenland & Faroe',
    note: 'Across the Denmark Strait — west, south and east Greenland',
    tours: [
      { name: 'Amazing Days in Ilulissat', days: 4, season: 'Jun – Sep' },
      { name: 'Amazing Days in Ilulissat', days: 5, season: 'Jun – Sep' },
      { name: 'South Greenland Grand Adventure', days: 6, season: 'Jun – Sep' },
      { name: 'East Greenland: Scoresby Sund, Long Hikes', days: 10, season: 'Jul – Sep' },
      { name: 'East Greenland: Scoresby Sund & Iceland Aurora', days: 12, season: 'Aug – Sep' },
      { name: 'Highlights of Iceland & Greenland', days: 8, season: 'Jun – Sep' },
      { name: 'Iceland & Greenland Discovery', days: 15, season: 'Jun – Sep' },
      { name: 'Taste of Faroe Islands', days: 4, season: 'May – Sep' },
      { name: 'Highlights of Faroe Islands', days: 6, season: 'May – Sep' },
    ],
  },
  {
    id: 'private',
    label: 'Private & Groups',
    note: 'Tailored departures, guided in your language',
    tours: [
      { name: 'Customized private groups — ten set itineraries', days: 4, season: 'All year' },
      { name: 'Geführte Islandreisen — acht Reisen', days: 4, season: 'All year', lang: 'Deutsch' },
      { name: 'Tours a Islandia en Español', days: 7, season: 'All year', lang: 'Español' },
      { name: 'Grupos privados em Português', days: 7, season: 'All year', lang: 'Português' },
      { name: 'MICE, incentives & conferences', days: 1, season: 'All year' },
      { name: 'Shore excursions from Reykjavík port', days: 1, season: 'All year' },
      { name: 'Workshop on Wheels — regenerative travel', days: 1, season: 'All year' },
      { name: 'Coach & minibus hire, 6 to 63 seats', days: 1, season: 'All year' },
    ],
  },
]

/** What the live booking engine offers — mirrored so the owner sees the
 *  full surface is intact. All true of the current gjtravel.is system. */
export const BOOKING_FACILITIES = [
  ['Online booking', 'Dates, travellers and rooms, paid by card'],
  ['Availability overview', 'Every departure of every tour on one sheet'],
  ['Traveller accounts', 'Log in to view and manage your booking'],
  ['Special offers', 'Seasonal fares, flagged on the sheet'],
  ['Four guide languages', 'English · Deutsch · Español · Português'],
  ['Coach hire', 'The GJ fleet, 6 to 63 seats, with driver'],
] as const

/** SAMPLE departures for the demonstration desk (clearly marked). */
export interface Departure {
  tour: string
  date: string
  seats: number
  state: 'open' | 'few' | 'waitlist'
}

export const SAMPLE_DEPARTURES: Departure[] = [
  { tour: 'Guided Iceland Circle', date: '14 Jul 2026', seats: 12, state: 'open' },
  { tour: 'Land of Midnight Sun', date: '21 Jul 2026', seats: 4, state: 'few' },
  { tour: 'Reykjavík Solar Eclipse City Break', date: '10 Aug 2026', seats: 0, state: 'waitlist' },
  { tour: 'Westfjords of Iceland', date: '18 Aug 2026', seats: 9, state: 'open' },
  { tour: 'Northern Lights Exploration — Small Group', date: '12 Oct 2026', seats: 7, state: 'open' },
  { tour: 'Christmas & Northern Lights Adventure', date: '21 Dec 2026', seats: 3, state: 'few' },
]
