/* ──────────────────────────────────────────────────────────────────────────
 * Glacier Paradise — "The Ascent" data & copy
 * All facts strictly per the locked brief verifiedFacts.
 * Honesty: the price, the TripAdvisor rating, the ~2 hr duration and the review
 * quotes are SAMPLE signals (none exist on the live site); the email is a clearly
 * marked placeholder. Real phones, address, handles, founders and the 1446 m
 * summit are verified. Jules Verne is a fact about the mountain, not a brand claim.
 * ────────────────────────────────────────────────────────────────────────── */

/* Palette — basalt → glacier wash. Two accents, each one job. */
export const C = {
  ground: '#070A0D', // basalt-black canvas
  surface: '#11161B', // booking / trust cards
  ink: '#F4F8FB', // primary text
  muted: '#8A97A3', // body / labels
  ice: '#7FC8E8', // instrument / data / focus — never decoration
  summit: '#FFB97A', // soft glow + the ONE primary CTA fill
  iceDim: 'rgba(127,200,232,0.34)',
  iceFaint: 'rgba(127,200,232,0.14)',
  hair: 'rgba(138,151,163,0.20)',
  hairBright: 'rgba(244,248,251,0.10)',
  summitWash: '#46586A', // arrival "summit wash" — booking section ground
  climbBottom: '#1A222B', // reduced-motion climb fallback (mid basalt)
} as const

/* The ascent background lerp endpoints (basalt floor → pale summit wash).
 * Tokenised so the climb gradient is a documented part of the palette
 * rather than scattered magic numbers in Page.tsx. */
export const CLIMB_BG = {
  bottom: [7, 10, 13] as const, // basalt-black, altitude zero
  top: [70, 88, 104] as const, // pale glacier wash at summit
} as const

/* Unsplash image ids (brief-resolved, all pre-vetted by the image map) */
export const IMG = {
  glacier: 'photo-1576635862964-c1a01be402ff', // Snæfellsjökull glacier — hero near-full-bleed
  road: 'photo-1484968309888-8d6b403bc1ec', // snow road approach — SNOWLINE climb plate
  snowcat: 'photo-1561625101-a4362bbbde69', // snow-cat — Top of the Diamond featured
  slope: 'photo-1661001160384-5d7eddc97b10', // parked snow-cat / ice slope
  basalt: 'photo-1759611667112-aabe7955d62a', // basalt — BASALT climb plate
  summitIce: 'photo-1698142261898-d244515ec79b', // summit ice — SUMMIT climb plate + gallery
  midnight: 'photo-1740851220872-6611518abf6d', // midnight-sun tour card
  buggy: 'photo-1502052791480-7f3473e995d2', // buggy adventure card
  ridge: 'photo-1506303151982-402374639220', // people on summit ridge — private/custom card
  itinerary: 'photo-1775735018330-77a411d79aa4', // what-to-expect itinerary anchor
  experience: 'photo-1628072504294-df57dc522fbd', // full-bleed experience band — Verne's doorway
  coast: 'photo-1505765050516-f72dcac9c60e', // black volcanic coast / lava shore — gallery coast tile (distinct from slope)
  gift: 'photo-1551524559-8af4e6624178', // open ice plateau under cloud — gift-card tour (distinct summit frame)
  family: 'photo-1691356435951-fe1540186f03', // meet-the-family portrait
  bookingWash: 'photo-1696583536271-ad109ac6dc43', // faint booking-wash backdrop
} as const

/* Verified facts */
export const SUMMIT_M = 1446
export const HERO_ALT = 742 // hero altimeter resting value (above-the-fold, instrument tone)

export const PRICE_ISK = 18000
export const PHONES = ['+354 8612844', '+354 8657402'] as const
export const ADDRESS = 'Arnarstapavegur 2, 356 Snæfellsbær'
export const PLACEHOLDER_EMAIL = 'hello@glacierparadise.is' // placeholder — no email exists on the live site
export const INSTAGRAM = '@glacier.paradise'
export const FACEBOOK = 'glacier.paradise'

/* ── The three climb stages (drive the pinned elevation spine) ────────────── */
export interface Stage {
  id: string
  index: string
  label: string
  alt: number
  line: string
  imageKey: keyof typeof IMG
  alpha: string // caption for the inset plate
}

export const STAGES: Stage[] = [
  {
    id: 'basalt',
    index: '01',
    label: 'BASALT',
    alt: 0,
    line: 'The black coast of Arnarstapi. A snow-cat waits where the lava meets the sea, and the climb begins at altitude zero.',
    imageKey: 'basalt',
    alpha: 'Snæfellsnes approach · 0 m',
  },
  {
    id: 'snowline',
    index: '02',
    label: 'SNOWLINE',
    alt: 700,
    line: 'Around 700 metres the ground turns white and the snow-cat takes over — tracks biting into the glacier as the coast drops away below.',
    imageKey: 'road',
    alpha: 'Where the snow-cat takes over · ~700 m',
  },
  {
    id: 'summit',
    index: '03',
    label: 'SUMMIT',
    alt: SUMMIT_M,
    line: 'At 1446 metres you stand on Verne’s doorway — a weightless, 360° world of ice where Journey to the Center of the Earth begins.',
    imageKey: 'summitIce',
    alpha: 'Snæfellsjökull summit · 1446 m',
  },
]

/* ── Tour line-up — the five real offerings ───────────────────────────────── */
export interface Tour {
  id: string
  name: string
  imageKey: keyof typeof IMG
  chips: string[] // mono spec chips
  line: string
  price: string // disclaimed in UI
  priceNote: string
  cta: 'Book' | 'Enquire'
  featured?: boolean
}

export const TOURS: Tour[] = [
  {
    id: 'diamond',
    name: 'Top of the Diamond',
    imageKey: 'snowcat',
    chips: ['Snow-cat', '~2 hr · sample', 'Easy'],
    line: 'The flagship ascent — tracked snow-cat from the black coast to the 1446 m summit and a 360° world of ice.',
    price: 'frá 18.000 kr',
    priceNote: 'sýnishorn · per person',
    cta: 'Book',
    featured: true,
  },
  {
    id: 'midnight',
    name: 'Midnight-Sun Tour',
    imageKey: 'midnight',
    chips: ['Snow-cat', 'Summer eve', 'Easy'],
    line: 'A summer-evening climb under the low golden midnight sun, with the glacier lit warm from the side.',
    price: 'Verð á síðu',
    priceNote: 'seasonal · sample',
    cta: 'Book',
  },
  {
    id: 'buggy',
    name: 'Buggy Adventure',
    imageKey: 'buggy',
    chips: ['Off-road buggy', 'Year-round', 'Moderate'],
    line: 'An off-road buggy run across the black volcanic terrain at the foot of the Diamond — engine over ice.',
    price: 'Verð á síðu',
    priceNote: 'sample',
    cta: 'Book',
  },
  {
    id: 'private',
    name: 'Private / Custom',
    imageKey: 'ridge',
    chips: ['Private', 'By arrangement', 'Tailored'],
    line: 'Your own route, your own pace — a tailored ascent for couples, families or small groups, planned with the family.',
    price: 'Price on request',
    priceNote: 'we’ll quote you',
    cta: 'Enquire',
  },
  {
    id: 'gift',
    name: 'Gift Cards',
    imageKey: 'gift',
    chips: ['Any tour', 'Open-dated', 'Posted or digital'],
    line: 'Give the ascent — an open-dated gift card valid against any Glacier Paradise tour, redeemed when they’re ready.',
    price: 'Any amount',
    priceNote: 'sample',
    cta: 'Enquire',
  },
]

/* ── What to expect — chronological itinerary ─────────────────────────────── */
export const ITINERARY: { mark: string; title: string; line: string }[] = [
  {
    mark: '00:00',
    title: 'Arnarstapi base',
    line: 'Meet at the black-coast base. Gear handout and a short safety briefing before the engines start.',
  },
  {
    mark: '~0700 M',
    title: 'Through the snowline',
    line: 'The tracked snow-cat climbs as the lava gives way to white, the coast dropping away beneath you.',
  },
  {
    mark: '1446 M',
    title: 'Summit · Verne’s doorway',
    line: 'A weightless 360° on the ice cap, with time to walk, breathe and photograph the plateau.',
  },
  {
    mark: 'DESCENT',
    title: 'Back to the coast',
    line: 'A measured descent down the glacier and back to Arnarstapi where the lava meets the sea.',
  },
]

export const INCLUDED = [
  'Certified glacier guide',
  'Tracked snow-cat transport',
  'Safety gear & briefing',
  'Small group · personal pace',
]

export const BRING = [
  'Warm insulating layers',
  'Waterproof jacket & trousers',
  'Sturdy walking boots',
  'Gloves, hat & a camera',
]

/* ── Gallery tiles (justified grid, first is the 2-col hero tile) ─────────── */
export const GALLERY: { key: keyof typeof IMG; alt: string; wide?: boolean }[] = [
  { key: 'summitIce', alt: 'Indicative glacier summit-ice plateau', wide: true },
  { key: 'itinerary', alt: 'Indicative snow-cat on a glacier snowline' },
  { key: 'ridge', alt: 'Indicative figures on a ridge of ice' },
  { key: 'experience', alt: 'Indicative wide glacier plateau' },
  { key: 'coast', alt: 'Indicative black volcanic coastline' },
  { key: 'midnight', alt: 'Indicative glacier in golden low light' },
  { key: 'basalt', alt: 'Indicative black basalt coast' },
]

/* ── Booking panel — tour summary key/value rows ──────────────────────────── */
export const SUMMARY: { k: string; v: string }[] = [
  { k: 'TOUR', v: 'Top of the Diamond' },
  { k: 'DURATION', v: '~2 hr · sample' },
  { k: 'DEPARTS', v: 'Arnarstapi' },
  { k: 'GROUP', v: 'Small · private available' },
  { k: 'VEHICLE', v: 'Tracked snow-cat' },
]

/* ── Reviews — CLEARLY sample/placeholder (no reviews on the live site) ───── */
export const REVIEWS: { quote: string; who: string; from: string }[] = [
  {
    quote: 'The snow-cat ride alone was worth it — then the summit opened up and nobody said a word for a minute.',
    who: 'Sample guest',
    from: 'placeholder review',
  },
  {
    quote: 'A small family operation that clearly knows this mountain. We felt looked after the whole way up.',
    who: 'Sample guest',
    from: 'placeholder review',
  },
  {
    quote: 'Did the midnight-sun climb in June. Standing on the ice in golden light at midnight is unreal.',
    who: 'Sample guest',
    from: 'placeholder review',
  },
]

/* ── FAQ accordion — answers kept honest / disclaimed where unverified ────── */
export const FAQ: { q: string; a: string }[] = [
  {
    q: 'What happens if the weather turns?',
    a: 'Glacier weather changes fast. If conditions make the climb unsafe the family will reschedule or refund — exact cancellation terms are confirmed at booking (policy shown here is indicative).',
  },
  {
    q: 'How fit do I need to be?',
    a: 'The snow-cat does the climbing, so the standard ascent suits most reasonable fitness levels. There is light walking on snow at the summit. Tell the family in advance about any mobility needs.',
  },
  {
    q: 'What should I wear and bring?',
    a: 'Warm insulating layers, a waterproof jacket and trousers, sturdy boots, gloves and a hat. Bring a camera — the summit is the photograph. Safety gear is provided.',
  },
  {
    q: 'Are there age limits?',
    a: 'It is a family-friendly ascent, but minimum ages can vary by tour and conditions. Please confirm with the family when you book (guidance here is indicative).',
  },
  {
    q: 'Where do tours depart from?',
    a: 'From the Arnarstapi base on the black south coast of Snæfellsnes (Arnarstapavegur 2, 356 Snæfellsbær). Meeting-point details are confirmed in your booking message.',
  },
]

/* ── Founders — verified bio details ──────────────────────────────────────── */
export const FAMILY = {
  vignir:
    'Vignir grew up in North Iceland and first discovered Snæfellsjökull in 2004 — he has been drawn back to the glacier ever since.',
  kolfinna:
    'Kolfinna was born in Ólafsvík, in the shadow of the mountain, and was carried onto the glacier as an infant. This ice is home.',
}

/* Trust strip — disclaimed sample where noted */
export const TRUST: { v: string; k: string; sample?: boolean }[] = [
  { v: '4.6 ★', k: 'TripAdvisor', sample: true },
  { v: 'EST. 2022', k: 'Vignir & Kolfinna' },
  { v: '3RD GEN', k: 'on the glacier' },
  { v: '20+ YRS', k: 'family experience' },
]

/* Shared disclaimer line for indicative stock imagery */
export const IMG_DISCLAIMER =
  'Indicative imagery — not Glacier Paradise’s own equipment or location.'
