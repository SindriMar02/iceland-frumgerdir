import type { PreviewCompany } from '../company-types'

/*
 * Fagravík / Aurora Vacation Homes. Every fact here comes from the owners'
 * own pages (fagravik.is, crawled 21.09.2026) or their Booking.com listing
 * (read the same day). Nothing is estimated: no prices, no availability.
 * Audit: _docs/FAGRAVIK-AUDIT-2026-09-21.md
 */

const BASE = import.meta.env.BASE_URL
const P = (name: string, w: number) => `${BASE}fagravik/${name}-${w}.webp`

export type Photo = { src: string; srcSet: string; alt: string; w: number; h: number }

/** name + the widths that exist on disk + intrinsic ratio of the source */
export function photo(name: string, widths: number[], ratio: number, alt: string): Photo {
  const top = widths[0]
  return {
    src: P(name, top),
    srcSet: widths.map((w) => `${P(name, w)} ${w}w`).join(', '),
    alt,
    w: top,
    h: Math.round(top / ratio),
  }
}

const L = 4 / 3 // landscape sources
const T = 3 / 4 // portrait sources

export const IMG = {
  hero: photo('sunset-bay', [2400, 1200, 700], L, 'The sun going down over Eyjafjörður, seen from the cottages at Fagravík'),
  heroWinter: photo('winter-bay', [2400, 1200, 700], L, 'Fagravík bay under snow, with the mountains across the fjord'),
  bayDay: photo('bay-day', [2000, 1000], L, 'The bay at Fagravík on a clear summer day'),
  shore: photo('bay-shore', [2000, 1000], L, 'The shore below the cottages, looking up the fjord'),
  sunsetPink: photo('sunset-pink', [2000, 1000], L, 'A pink evening sky over the fjord'),
  sunsetField: photo('sunset-field', [2000, 1000], L, 'Late sun over the field in front of the cottages'),
  boat: photo('boat', [2000, 1000], 3 / 2, 'The old boat with Fagravík painted on its bow, resting on the grass'),
  boatTall: photo('boat-tall', [1400, 700], L, 'The bow of the old Fagravík boat'),
  tub: photo('hottub-night', [1600, 800], T, 'A hot tub on a cottage deck at night, lanterns lit'),
  tubTall: photo('hottub-night-tall', [1400, 700], T, 'Lanterns around a hot tub on a cottage deck at dusk'),
  rainbow: photo('rainbow', [2000, 1000], L, 'A double rainbow over the cottages'),
  winterCabin: photo('winter-cabin', [2000, 1000], L, 'A cottage deep in snow'),
  winterField: photo('winter-field', [2000, 1000], L, 'Snow across the field, cottages behind'),
  winterTub: photo('winter-tub', [1600, 800], L, 'A covered hot tub under a thick layer of snow'),
  pano: photo('pano', [2800, 1400], 5680 / 1080, 'Panorama of Fagravík and the fjord'),
}

export type Cottage = {
  id: string
  name: string
  /** the owners' own cottage numbers */
  numbers: string
  count: number
  guests: number
  bedrooms: string
  beds: string
  photos: Photo[]
  note?: string
}

/*
 * Five sizes, as the owners describe them. Cottage 4 is marked "not available
 * at the moment" on their site, so it is not offered here. Photos are filed
 * by the owners' own pages (the 1&2 page uses the files named 12..., not
 * cottage 12) and, for 10 and 11/12, by the room type they filed on Booking.com
 * in February 2025.
 */
export const COTTAGES: Cottage[] = [
  {
    id: 'studio',
    name: 'Studio cottage',
    numbers: '7, 8 and 8b',
    count: 3,
    guests: 3,
    bedrooms: 'Studio',
    beds: 'A double bed and a sofa bed',
    photos: [
      photo('studio-living', [1600, 800], L, 'Living room of a studio cottage, renovated 2025'),
      photo('studio-out', [1600, 800], L, 'Cottage 8b from outside'),
      photo('studio-8b', [1600, 800], L, 'Living and dining space in cottage 8b'),
    ],
  },
  {
    id: 'two-bed',
    name: 'Two-bedroom cottage',
    numbers: '1, 2, 3, 6 and 9',
    count: 5,
    guests: 5,
    bedrooms: '2 bedrooms',
    beds: 'A double bed in each room, one with a 90 cm bunk above',
    photos: [
      photo('h1-out', [1600, 800], L, 'One of the two-bedroom cottages from outside'),
      photo('h1-living', [1600, 800], L, 'Living room of a two-bedroom cottage'),
      photo('h1-bed', [1400, 700], L, 'Bedroom in a two-bedroom cottage'),
      photo('h9-out', [1600, 800], L, 'Cottage 9 on the field'),
    ],
  },
  {
    id: 'three-bed',
    name: 'Three-bedroom cottage',
    numbers: '5',
    count: 1,
    guests: 6,
    bedrooms: '3 bedrooms',
    beds: 'Two rooms with double beds, one room with three bunks',
    photos: [
      photo('h5-out', [1600, 800], L, 'Cottage 5 from outside'),
      photo('h5-living', [1600, 800], L, 'Living room of cottage 5'),
      photo('h5-bed', [1400, 700], L, 'A double bedroom in cottage 5'),
    ],
  },
  {
    id: 'nine',
    name: 'Large three-bedroom cottage',
    numbers: '11 and 12',
    count: 2,
    guests: 9,
    bedrooms: '3 bedrooms',
    beds: 'A double bed and a 90 cm bunk in every room',
    photos: [
      photo('h11-living', [1600, 800], L, 'Living room in cottage 11 or 12, renovated 2025'),
      photo('h11-window', [1600, 800], L, 'Kitchen window looking out over the snow'),
      photo('h11-out', [1600, 800], L, 'Cottages 11 and 12 from outside'),
      photo('h11-bed', [1400, 700], L, 'Bedroom with a double bed and a bunk'),
    ],
  },
  {
    id: 'four-bed',
    name: 'Four-bedroom cottage',
    numbers: '10',
    count: 1,
    guests: 8,
    bedrooms: '4 bedrooms',
    beds: 'A double bed in every room',
    photos: [
      photo('h10-dining', [1600, 800], L, 'Dining and living room in cottage 10 under a vaulted ceiling, renovated 2025'),
      photo('h10-kitchen', [1600, 800], L, 'Kitchen and dining table in cottage 10'),
      photo('h10-out', [1600, 800], L, 'Cottage 10 from outside'),
      photo('h10-deck', [1400, 700], L, 'The deck of cottage 10 with a grill and outdoor table'),
    ],
  },
]

/** In every cottage: the owners' pages, plus WiFi from their Booking.com listing. */
export const EVERY_COTTAGE = [
  'A private hot tub',
  'A kitchen with the everyday appliances, down to a coffee machine and a toaster',
  'A grill and outdoor furniture',
  'TV, and free WiFi',
  'Pillows and duvets',
]

/* From the owners' "useful information" page. Drive times are theirs. */
export const AROUND = [
  { what: 'Akureyri', detail: 'The town centre, 4 km to the south', time: '5 min' },
  { what: 'Swimming pool', detail: 'The pool at Þelamerkurskóli', time: '8 min' },
  { what: 'Skiing', detail: 'Hlíðarfjall above Akureyri, and Dalvík', time: 'Short drive' },
  { what: 'Golf', detail: 'Jaðar, the 18-hole course of the Akureyri golf club', time: 'Short drive' },
  { what: 'Whale watching', detail: 'Summer tours from Húsavík, and the Whale Museum', time: 'Day trip' },
  { what: 'Fishing and walks', detail: 'Trout at the shore, trails along the beach and the hills', time: 'On foot' },
]

/* Booking.com, measured 21.09.2026. Linked, never restated as our claim. */
export const REVIEWS = {
  source: 'Booking.com',
  url: 'https://www.booking.com/hotel/is/vacation-home-fagravik.html',
  score: '8.8',
  count: 229,
  categories: [
    { label: 'Location', score: '9.5' },
    { label: 'Cleanliness', score: '9.2' },
    { label: 'Comfort', score: '9.1' },
    { label: 'Facilities', score: '9.0' },
  ],
}

export const CONTACT = {
  email: 'fagravik@fagravik.is',
  people: [
    { name: 'Auður', phone: '690 0007', tel: '+3546900007' },
    { name: 'Soffía', phone: '690 0006', tel: '+3546900006' },
  ],
  bookingUrl: REVIEWS.url,
}

export const SILASTADIR = {
  name: 'Sílastaðir II',
  where: 'About a mile north of the Fagravík road, on the mountain side of Route 1',
  units: [
    { name: 'Íbúð 201', guests: '6 guests', note: '3 bedrooms, hot tub shared with 202' },
    { name: 'Íbúð 202', guests: '4 guests', note: '1 bedroom' },
    { name: 'Kjarrið', guests: '10 guests', note: '4 bedrooms, own hot tub' },
    { name: 'Hreiðrið', guests: '3 to 4 guests', note: '1 bedroom and a sofa bed' },
  ],
}

export const PHOTO_CREDIT =
  'Photographs are Aurora Vacation Homes’ own, from fagravik.is and the property’s Booking.com listing, collected September 2026.'

export const companyEntry: PreviewCompany = {
  slug: 'fagravik',
  route: '/preview/fagravik',
  name: 'Aurora Vacation Homes, Fagravík',
  sector: 'Sumarhúsaleiga',
  location: 'Fagravík, 4 km norðan Akureyrar',
  region: 'Norðurland eystra',
  established: 'Þrettán sumarhús í Fögruvík og fjórar einingar á Sílastöðum II',
  currentUrl: 'https://www.fagravik.is',
  ownerEmail: 'fagravik@fagravik.is',
  concept: 'Same bay, two lights',
  conceptTagline:
    'Twelve cottages on the shore of Eyjafjörður, chosen by the size of your group, shown in the midnight sun and in deep snow.',
  accent: '#B3362B',
  dark: false,
  status: 'In build',
  thumb: `${BASE}fagravik/sunset-bay-700.webp`,
  ownPhotography: true,
  photoCredit: PHOTO_CREDIT,
  english: true,
  audit: {
    strengths: [
      'Booking.com 8.8 from 229 reviews, location scored 9.5',
      'Five cottage sizes from a studio to a four-bedroom house, a hot tub at every one',
      'Their own photos from 2016 to 2025: midnight sun, deep winter, renovated interiors',
    ],
    weaknesses: [
      'A Microsoft FrontPage frameset, content last edited January 2020',
      'Booking means an envelope icon that opens an email, no availability or prices',
      'On a phone the content frame scrolls sideways; the 2025 renovation is not on the site',
    ],
    opportunities: [
      'A cottage chooser by group size, which is the question every guest arrives with',
      'Their own best photos, currently only on Booking.com, on a site they control',
    ],
  },
  positioning:
    'Aurora Vacation Homes rents twelve cottages at Fagravík, 4 km north of Akureyri, and four more units at Sílastaðir II. The prototype is built around the question every guest arrives with, which house fits our group, and around the owners’ own photographs of the bay in summer and winter.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Fögruvík',
    body: '[Drög ekki skrifuð. Sjá _docs/FAGRAVIK-AUDIT-2026-09-21.md áður en haft er samband.]',
  },
}
