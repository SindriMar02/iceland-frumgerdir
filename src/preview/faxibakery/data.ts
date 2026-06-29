/**
 * Faxi Bakery — landing-page data.
 *
 * Rebuilt to match the "Faxi Bakery Café" design handoff from Claude design
 * (volcanic-black / moss-green / cream palette, "CINNAMON — fresh, every hour").
 *
 * HONESTY GUARDRAILS (prototype is disclaimed in PreviewFooter):
 *   - Verified facts: cinnamon rolls baked fresh every hour, real espresso machine,
 *     hjónabandssæla, on Route 1 in Hvolsvöllur under Eyjafjallajökull, ~4.8★.
 *   - Contact: Instagram @faxi_bakery_ / phone +354 835 9534. No public email.
 *   - Prices are illustrative Icelandic króna (kr) — sample data, confirm before publishing.
 *   - Brand voice ("a bakery with unregular stuff", "NO GROUP BOOKING", 🐌🐳🦩🐿️) is real.
 */

/** Local hero photo lives in /public/faxibakery/. Unsplash for the rest. */
const HERO = `${import.meta.env.BASE_URL}faxibakery/hero.jpg`
const u = (id: string, w = 1100) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const IMAGES = {
  hero: HERO, // provided: one cinnamon roll, extreme close-up on plain warm/cream bg
  // Story
  volcano:  u('photo-1504893524553-b855bce32c67', 1200), // green mountains / volcano under blue sky
  interior: u('photo-1559925393-8be0ec4767c8', 1200),    // cozy café counter / pastry case, warm wood
  // Visit
  visit:    u('photo-1528605248644-14dd04022da1', 1200), // outdoor terrace seating with a view
} as const

/** Warm gradient fallbacks so a dead URL never breaks the layout. */
export const FALLBACK = {
  cream:   'bg-gradient-to-br from-[#ECE3D1] to-[#DCCEAF]',
  card:    'bg-gradient-to-br from-[#E4D9C2] to-[#d8c8a6]',
  volcano: 'bg-gradient-to-br from-[#b8cfd8] to-[#8faab5]',
  moss:    'bg-gradient-to-br from-[#5b6a4e] to-[#3c4733]',
  ink:     'bg-gradient-to-br from-[#2a241d] to-[#1B1712]',
} as const

// ── Menu (exact copy + prices from the design handoff) ───────────────────────

export interface MenuItem {
  slotId: string
  name: string
  price: string
  /** optional pill badge */
  tag?: string
  desc: string
  /** art-direction caption / alt */
  shot: string
  /** image URL */
  img: string
  /** fallback gradient className */
  fallback: string
}

export const MENU: MenuItem[] = [
  {
    slotId: 'menu-cinnamon',
    name: 'The Hourly Cinnamon Roll',
    price: 'kr 850',
    tag: 'Signature',
    desc: 'Pulled from the oven every hour, on the hour. Soft, laminated, properly gooey.',
    shot: 'Single cinnamon roll, top-down, glossy glaze, cardamom sugar',
    img: u('photo-1509365465985-25d11c17e812', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-sourdough',
    name: 'Cream Cheese Sourdough Roll',
    price: 'kr 950',
    tag: 'Fan favourite',
    desc: 'Slow sourdough, cardamom, a thick swipe of cream cheese frosting.',
    shot: 'Sourdough cinnamon roll with cream cheese frosting, 3/4 angle',
    img: u('photo-1607958996333-41aef7caefaa', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-faxiballs',
    name: 'Faxi Balls',
    price: 'kr 550',
    desc: 'Our unregular little chocolate-oat balls. Nobody quite knows why they work.',
    shot: 'Pile of chocolate-oat energy balls on a small plate',
    img: u('photo-1606312619070-d48b4c652a52', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-earlgrey',
    name: 'Earl Grey Cookie',
    price: 'kr 650',
    desc: 'Crackly edges, bergamot middle, baked thick.',
    shot: 'Thick earl grey cookie, broken in half showing texture',
    img: u('photo-1499636136210-6f4ee915583e', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-croissant',
    name: 'Chocolate Croissant',
    price: 'kr 790',
    desc: 'Hand-laminated, dark Icelandic chocolate, shatter-crisp shell.',
    shot: 'Chocolate croissant, close, flaky layers, melted chocolate end',
    img: u('photo-1623334044303-241021148842', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-sub',
    name: 'The Faxi Sub',
    price: 'kr 2,190',
    tag: 'Lunch',
    desc: 'Big, messy, the reason people pull off Route 1.',
    shot: 'Loaded sub sandwich on house bread, cross-section visible',
    img: u('photo-1553909489-cd47e0907980', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-pulledpork',
    name: 'Pulled Pork Sandwich',
    price: 'kr 2,290',
    tag: 'Lunch',
    desc: 'Slow-cooked, on house bread, with pickles that bite back.',
    shot: 'Pulled pork sandwich, melty, on a wooden board',
    img: u('photo-1521305916504-4a1121188589', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-marriage',
    name: 'Happy Marriage Cake',
    price: 'kr 720',
    tag: 'Heritage',
    desc: 'Hjónabandssæla — a recipe handed down through generations. You can taste the love.',
    shot: 'Slice of Icelandic happy-marriage rhubarb oat cake, rustic',
    img: u('photo-1488477181946-6428a0291777', 900),
    fallback: FALLBACK.card,
  },
]

// ── Story stat strip ─────────────────────────────────────────────────────────

export const STATS = [
  { value: '4.8★', caption: 'across 350+ reviews' },
  { value: '24', caption: 'fresh batches a day' },
  { value: '1', caption: 'very real espresso machine' },
  { value: '0', caption: 'group bookings, sorry' },
] as const

// ── Visit ────────────────────────────────────────────────────────────────────

export const VISIT = {
  where: 'Route 1 · Hvolsvöllur\nSouth Iceland',
  hours: 'Open every day · 9 — 8',
  call: '+354 835 9534',
  callHref: '+3548359534',
  bookings: 'No group bookings 🐌',
  instagram: 'https://www.instagram.com/faxi_bakery_/',
  instagramHandle: '@faxi_bakery_',
} as const
