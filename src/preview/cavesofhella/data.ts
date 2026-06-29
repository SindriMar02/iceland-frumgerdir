/**
 * Caves of Hella — "Niður í myrkrið" (Descent into the dark)
 *
 * Manngerðir hellar at Ægissíða, Hella. Twelve man-made caves of unknown
 * age; crosses, carved seats and wall markings remain. Some historians
 * believe they may predate the Norse settlement of Iceland (874 AD),
 * possibly carved by Celtic hermits (Papar). Nothing is confirmed.
 *
 * HONESTY GUARDRAILS:
 * - Dating is hedged ("may predate", "some believe") — never stated as proven.
 * - 12 caves total at Ægissíða; guided tours visit a selection (3 entered,
 *   2 viewed from outside). The cross, carved seats and wall markings are real.
 * - Prices, times and hours are from the real cavesofhella.is site.
 * - Reviews are sample data (disclaimed in the shared PreviewFooter).
 */

const IMG = (f: string) => `${import.meta.env.BASE_URL}cavesofhella/${f}`

export const IMAGES = {
  hero: IMG('hero.jpg'),
  chamber1: IMG('chamber-1.jpg'),
  chamber2: IMG('chamber-2.jpg'),
  chamber3: IMG('chamber-3.jpg'),
  chamber4: IMG('chamber-4.jpg'),
  crossDetail: IMG('cross-detail.jpg'),
  seatDetail: IMG('seat-detail.jpg'),
  candlelight: IMG('candlelight.jpg'),
  exterior: IMG('exterior.jpg'),
} as const

// ---------------------------------------------------------------------------
// Section 1: Hero
// ---------------------------------------------------------------------------
export const HERO = {
  eyebrow: 'Manngerðir hellar · Ægissíða, Hella',
  h1: 'Step into Iceland’s hidden world.',
  sub: 'Hand-carved caves that may predate the settlement. A thousand years of silence waiting below the surface.',
  cta: 'Book a tour',
  ctaHref: '#booking',
  times: ['10:00', '12:00', '14:00', '16:00'],
  meta: '1 hour · English daily',
} as const

// ---------------------------------------------------------------------------
// Section 2: The Descent (signature scroll scene — data only)
// ---------------------------------------------------------------------------
export const DESCENT = {
  endLine: 'A thousand years below the surface.',
  depthFinal: 'deep underground',
} as const

// ---------------------------------------------------------------------------
// Section 3: The Mystery
// ---------------------------------------------------------------------------
export const MYSTERY = {
  heading: 'Who carved these caves?',
  lead: 'The caves at Ægissíða have stood for centuries. But exactly how many remains one of South Iceland’s quiet riddles.',
  body: [
    'Carved into the basalt hillside above the Rangá plains, the twelve caves of Ægissíða bear crosses etched into the walls, seats hewn from stone, and recesses that scholars have yet to fully explain. Some historians believe the caves may predate the Norse settlement of Iceland, possibly the work of Celtic hermits known as the Papar, who are thought to have reached Iceland before the Vikings.',
    'Others suggest they were carved by early Norse settlers as storage, shelter or places of prayer. No definitive record survives. What remains are the marks themselves: a Latin cross, shaped seats, and the careful hand of someone who intended to stay.',
    'The mystery is part of the experience. You walk into a space that holds more questions than answers, and the quiet of the rock holds them all the same.',
  ],
  imageCaption: 'A carved cross, Kirkjuhellir',
} as const

// ---------------------------------------------------------------------------
// Section 4: The Caves
// ---------------------------------------------------------------------------
export interface Cave {
  nameIs: string
  nameEn: string
  tagline: string
  img: string
  alt: string
  note?: string
}

export const CAVES: Cave[] = [
  {
    nameIs: 'Fjóshellir',
    nameEn: 'The Byre Cave',
    tagline: 'The most celebrated of the twelve. Wide enough to shelter a congregation, or a herd.',
    img: IMG('chamber-1.jpg'),
    alt: 'Interior of Fjóshellir, the largest and most celebrated of the caves at Aegissida',
  },
  {
    nameIs: 'Kirkjuhellir',
    nameEn: 'The Church Cave',
    tagline: 'A perfectly rounded ceiling carved with care. The cross here is the clearest of all the marks.',
    img: IMG('chamber-2.jpg'),
    alt: 'Kirkjuhellir with its distinctive rounded ceiling and carved cross',
  },
  {
    nameIs: 'Hlöðuhellir',
    nameEn: 'The Hearth Cave',
    tagline: 'One of Iceland’s largest man-made caves. A 25-metre tunnel connects it to its neighbour Lambhellir.',
    img: IMG('chamber-3.jpg'),
    alt: 'The tunnel passage connecting Hloduhellir and Lambhellir caves',
    note: '25 m passage to Lambhellir',
  },
  {
    nameIs: 'Lambhellir',
    nameEn: 'The Lamb Cave',
    tagline: 'Reached through the tunnel from Hlöðuhellir. A smaller chamber that rewards the walk.',
    img: IMG('chamber-4.jpg'),
    alt: 'The intimate interior of Lambhellir, reached via the connecting tunnel',
  },
] as const

export const CAVES_NOTE = '12 caves in total at Ægissíða. Tours enter three and view two more from outside.' as const

// ---------------------------------------------------------------------------
// Section 5: The Experience
// ---------------------------------------------------------------------------
export const EXPERIENCE = {
  heading: 'What to expect on a tour',
  lead: 'A guided hour underground. Candlelight, stone, and the guide’s knowledge of every carved mark.',
  bullets: [
    'Guided in English daily, small groups',
    'Enter three caves, view two more from outside',
    'Candlelight and lanterns illuminate the carvings',
    'Carved seats inside: you sit where they sat',
    'Suitable for families and most fitness levels',
    'Ring Road location, easy stop on a South Iceland drive',
  ],
  duration: 'Approx. 1 hour',
  language: 'English daily',
} as const

// ---------------------------------------------------------------------------
// Section 6: Tours & Prices
// ---------------------------------------------------------------------------
export interface PriceLine {
  label: string
  price: string
  detail?: string
}

export const PRICES: PriceLine[] = [
  { label: 'Adult', price: '6.950 kr.' },
  { label: 'Child (6-15)', price: '2.850 kr.' },
  { label: 'Under 6', price: 'Free' },
  { label: 'Family', price: '15.900 kr.', detail: '2 adults + 2 children' },
] as const

export const SPECIAL_TOURS = [
  { t: 'Private tour', d: 'Book the caves for your group alone. Contact for availability and pricing.' },
  { t: 'Luxury tour', d: 'Extended visit with candlelit refreshments in the cave. Contact for details.' },
  { t: 'Viking feast', d: 'A traditional meal inside the cave, by candlelight. Special events only.' },
  { t: 'Weddings & ceremonies', d: 'An unforgettable setting for an intimate ceremony underground.' },
] as const

// ---------------------------------------------------------------------------
// Section 7: Booking
// ---------------------------------------------------------------------------
export const BOOKING = {
  heading: 'Reserve your place',
  sub: 'Choose a date, pick a time, and we will confirm your spot by email.',
  tourTimes: ['10:00', '12:00', '14:00', '16:00'],
  adultPrice: 6950,
  childPrice: 2850,
  familyPrice: 15900,
  email: 'info@cavesofhella.is',
  cta: 'Request booking',
  note: 'No payment taken here. We confirm your tour by email within 24 hours.',
} as const

// ---------------------------------------------------------------------------
// Section 8: Reviews (sample data)
// ---------------------------------------------------------------------------
export interface Review {
  body: string
  name: string
  from: string
}

export const REVIEWS: Review[] = [
  {
    body: 'Nothing prepares you for stepping into a space this old. The guide knew every carved line and explained the mystery without overselling it. One of the strangest, most memorable hours in Iceland.',
    name: 'Hannah R.',
    from: 'Germany',
  },
  {
    body: 'The candlelight changes everything. The rock is so close around you and the ceiling so perfectly rounded in Kirkjuhellir that it feels genuinely sacred. Our kids were completely awestruck.',
    name: 'James & Fiona O.',
    from: 'Ireland',
  },
  {
    body: 'We stopped on a whim driving the Ring Road and ended up staying twice as long as planned. The 25-metre tunnel between the two caves is extraordinary.',
    name: 'Sofia L.',
    from: 'Sweden',
  },
  {
    body: 'The guide\'s passion for the unresolved history made this. Not "here are the facts" but "here is the best theory and here is why nobody knows." Perfect.',
    name: 'David C.',
    from: 'United States',
  },
] as const

// ---------------------------------------------------------------------------
// Section 9: Plan your visit
// ---------------------------------------------------------------------------
export const VISIT = {
  heading: 'Plan your visit',
  address: 'Ægissíða 4, 851 Hella',
  addressNote: 'On the Ring Road, South Iceland',
  fromReykjavik: 'Approx. 1 hour from Reykjavík',
  parking: 'Free parking, buses welcome',
  mapsLink: 'https://www.google.com/maps/search/Caves+of+Hella+%C3%86giss%C3%AD%C3%B0a+Hella+Iceland',
  cta: 'Book a tour',
  ctaHref: '#booking',
  phone: '+354 487 8781',
  phoneHref: 'tel:+3544878781',
  email: 'info@cavesofhella.is',
} as const
