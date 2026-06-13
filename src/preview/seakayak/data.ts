/**
 * "Still Water" — content for the Sea Kayak Iceland redesign concept.
 * Sample prices/reviews are disclaimed in the shared footer.
 */

const U = 'https://images.unsplash.com/'
const card = (id: string) => `${U}${id}?q=80&w=1200&auto=format&fit=crop`

export const HERO_ID = 'photo-1604537466158-719b1972feb8'

export interface Trip {
  name: string
  tagline: string
  duration: string
  /** 1 = calmest / easiest, 3 = most committing */
  level: number
  levelLabel: string
  price: string
  blurb: string
  season: string
  img: string
  alt: string
}

export const TRIPS: Trip[] = [
  {
    name: 'Calm Bay Paddle',
    tagline: 'The one to start with',
    duration: '2 hours',
    level: 1,
    levelLabel: 'All levels',
    price: '12.900 kr.',
    blurb:
      'Glide across sheltered, glass-flat water just off Stokkseyri. No experience needed — a short land briefing, then you are afloat. Our most-booked trip and the gentlest way onto Icelandic water.',
    season: 'May – September',
    img: card('photo-1517176118179-65244903d13c'),
    alt: 'A paddler on calm water with mountains rising behind',
  },
  {
    name: 'Family Paddle',
    tagline: 'Built for first-timers & kids',
    duration: '1.5 hours',
    level: 1,
    levelLabel: 'Ages 7+',
    price: '9.900 kr.',
    blurb:
      'A relaxed, close-to-shore route in stable double kayaks, paced for younger paddlers and nervous beginners. Guides stay within arm’s reach the whole way.',
    season: 'June – August',
    img: card('photo-1519092437326-bfd121eb53ae'),
    alt: 'Quiet Icelandic fjord farmland beside still water',
  },
  {
    name: 'Sunset & Aurora Paddle',
    tagline: 'Seasonal · evenings',
    duration: '2.5 hours',
    level: 2,
    levelLabel: 'Some basics helpful',
    price: '16.900 kr.',
    blurb:
      'Push off as the low sun gilds the water — and, on clear autumn and winter nights, paddle beneath the northern lights. A small group, warm gear and a flask of cocoa on the shore.',
    season: 'Sept – March',
    img: card('photo-1531366936337-7c912a4589a7'),
    alt: 'Green aurora glowing over a snowy Icelandic slope at night',
  },
  {
    name: 'Coastline Explorer',
    tagline: 'For confident paddlers',
    duration: 'Half day',
    level: 3,
    levelLabel: 'Some experience',
    price: '21.900 kr.',
    blurb:
      'Trace the black-sand south coast past sea stacks and seabird cliffs, reading the swell with a guide who has paddled this shore for decades. The fullest day on the water we run.',
    season: 'May – September',
    img: card('photo-1519092437326-bfd121eb53ae'),
    alt: 'Quiet Icelandic fjord farmland beside still water',
  },
]

export interface Voice {
  quote: string
  name: string
  trip: string
}

export const VOICES: Voice[] = [
  {
    quote:
      'I had never held a paddle in my life. Twenty minutes in I was completely calm — the water was like a mirror and our guide never once made me feel rushed.',
    name: 'Hannah R.',
    trip: 'Germany · Calm Bay Paddle',
  },
  {
    quote:
      'We did the family trip with two kids and it was the highlight of the whole south-coast drive. Genuinely safe-feeling, genuinely fun.',
    name: 'The Okonkwo family',
    trip: 'UK · Family Paddle',
  },
  {
    quote:
      'Paddling under a faint green aurora with the sea dead still around us is something I’ll think about for years. Thirty years of doing this clearly shows.',
    name: 'Mateo S.',
    trip: 'Spain · Sunset & Aurora Paddle',
  },
]
