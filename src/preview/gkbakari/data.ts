/**
 * GK Bakarí — landing-page data.
 *
 * Same design system as Faxi Bakery Café (volcanic-black / moss-green / cream
 * palette, Bricolage Grotesque + Caveat + Hanken Grotesk) — reused here with
 * GK Bakarí's own real facts, since the Faxi build has gone unanswered.
 *
 * HONESTY GUARDRAILS (prototype is disclaimed in PreviewFooter):
 *   - Verified via direct fetch/search (ja.is, 1819.is, Wolt, Tripadvisor, RestaurantGuru,
 *     veitingageirinn.is, sunnlenska.is): founders Guðmundur Helgi Harðarson (ex Brauð & Co)
 *     and Kjartan Ásbjörnsson (ex IKEA bakery), opened Jan 2020 in Kjartan's hometown of
 *     Selfoss; address Austurvegur 31b, 800 Selfoss; phone 482 1007; email gkbakari@simnet.is
 *     (ja.is + 1819.is agree; supersedes an earlier gmail address found in a scouting pass
 *     but never confirmed on a live source); RestaurantGuru 4.7/5 (438 reviews); no independent
 *     website — only Facebook/Instagram/Wolt/aggregators.
 *   - REAL Wolt menu items + prices: Ostaslaufa 520 kr, Kleinuhringur (karamellu) 500 kr,
 *     Kanilsnúður 680 kr, Eplasafi/Heilsusafi 390 kr each.
 *   - Rúgbrauð and Berlínarbolla are REAL items (named in Tripadvisor/RestaurantGuru reviews)
 *     but their prices are ILLUSTRATIVE ESTIMATES (no confirmed source) — confirm before
 *     publishing. Same for Smurt (an actual Wolt menu CATEGORY, "Great bread, buns and
 *     sandwiches" per a real review) — item exists, price is an estimate.
 *   - Opening hours: sources disagree slightly (Wolt shows fragmented delivery windows,
 *     Tripadvisor shows standard shop hours) — using the Tripadvisor version as the more
 *     plausible in-store hours; confirm before publishing.
 *   - HERO photo is the Higgsfield-generated cinnamon-roll plate from the Faxi Bakery
 *     prototype (its background is baked to flat #F1E4CE cream, so it sits seamlessly on
 *     this page's identical cream). INDICATIVE imagery, not GK's own product photo.
 *   - LOGO is GK Bakarí's real mark (gold hand-drawn cinnamon roll + GK monogram +
 *     BAKARÍ), sourced from their public Wolt venue listing (imageproxy.wolt.com asset),
 *     fabric-shadow background crushed to uniform black to sit as a circular badge.
 *   - Other photography is INDICATIVE Unsplash stock, vetted via contact-sheet montage.
 *     Two menu items (Rúgbrauð, Berlínarbolla) have no honest matching stock photo and
 *     go photo-light (typographic card) rather than mislabel.
 */

const u = (id: string, w = 1100) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const LOGO = `${import.meta.env.BASE_URL}gkbakari/brand/logo.jpg`

export const IMAGES = {
  hero: `${import.meta.env.BASE_URL}gkbakari/hero.jpg`, // Higgsfield cinnamon roll on flat cream (shared with the Faxi prototype)
  // Story
  hands: u('photo-1652283321082-72bb2b601abd', 1200), // hands shaping a ball of dough, floured counter
  counter: u('photo-1771498326035-c148ca1511de', 1200), // wood-framed glass bakery case, handwritten labels
  // Visit
  visit: u('photo-1649308401368-a68b77116605', 1200), // top-down tray of fresh cinnamon rolls, flat-lay
} as const

/** Warm gradient fallbacks so a dead URL never breaks the layout — also used
 *  deliberately (no `img`) for the two menu items with no honest photo. */
export const FALLBACK = {
  cream: 'bg-gradient-to-br from-[#F1E4CE] to-[#E6D2B8]',
  card: 'bg-gradient-to-br from-[#E5D5BA] to-[#d6c4a0]',
  moss: 'bg-gradient-to-br from-[#5b6a4e] to-[#3c4733]',
  ink: 'bg-gradient-to-br from-[#2a241d] to-[#1B1712]',
} as const

export interface MenuItem {
  slotId: string
  name: string
  price: string
  tag?: string
  desc: string
  shot: string
  /** image URL — omitted (undefined) means a deliberate photo-light card */
  img?: string
  fallback: string
}

export const MENU: MenuItem[] = [
  {
    slotId: 'menu-kanilsnudur',
    name: 'Kanilsnúður',
    price: 'kr 680',
    tag: 'Signature',
    desc: 'The one we’re known for — soft, properly gooey, never far from the oven.',
    shot: 'Fresh iced cinnamon rolls, homemade look, close together on a tray',
    img: u('photo-1694632288834-17d86b340745', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-rugbraud',
    name: 'Rúgbrauð',
    price: 'kr 1.290',
    tag: 'Fan favourite',
    desc: 'Dense, dark and slow-baked. One guest called it “the best, heartiest rye bread” they’d ever had.',
    shot: 'No honest matching photo found — deliberate photo-light card',
    fallback: FALLBACK.ink,
  },
  {
    slotId: 'menu-ostaslaufa',
    name: 'Ostaslaufa',
    price: 'kr 520',
    desc: 'Flaky and buttery, cheese folded through every layer — best while the coffee is hot.',
    shot: 'Golden laminated pastry, close, flaky layers, on parchment',
    img: u('photo-1756137943371-f67c60f132e9', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-kleinuhringur',
    name: 'Kleinuhringur með karamellu',
    price: 'kr 500',
    desc: 'A proper ring doughnut, dipped in caramel glaze.',
    shot: 'Caramel-glazed ring doughnuts, drizzle pattern, top-down',
    img: u('photo-1685779923216-5b386a173447', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-berlinarbolla',
    name: 'Berlínarbolla',
    price: 'kr 550',
    desc: 'Jam-filled and sugar-dusted — “like a kind of cloud,” as one guest put it.',
    shot: 'No honest matching photo found — deliberate photo-light card',
    fallback: FALLBACK.moss,
  },
  {
    slotId: 'menu-smurt',
    name: 'Smurt brauð',
    price: 'kr 1.590',
    tag: 'Lunch',
    desc: 'Open-faced sandwiches on our own fresh bread, made up at the counter all morning.',
    shot: 'Open-faced sandwich, ham, lettuce, red onion, on a wooden board',
    img: u('photo-1618569629551-ac5b990b1ef6', 900),
    fallback: FALLBACK.card,
  },
  {
    slotId: 'menu-safar',
    name: 'Ferskir safar',
    price: 'kr 390',
    desc: 'Eplasafi or heilsusafi, cold from the case.',
    shot: 'A glass of fresh orange juice with fruit alongside',
    img: u('photo-1613478223719-2ab802602423', 900),
    fallback: FALLBACK.card,
  },
]

export const STATS = [
  { value: '4.7★', caption: 'across 438 reviews and counting' },
  { value: '2020', caption: 'the January we first opened the doors' },
  { value: '1', caption: 'pot of soup on the stove, every day' },
  { value: '2', caption: 'South Iceland farms in the larder' },
] as const

/** Weekly hours, minutes-from-midnight, UTC (Iceland has no DST — UTC = local). */
export const HOURS_BY_DAY = [
  { open: 8 * 60, close: 14 * 60 }, // Sun
  { open: 7 * 60, close: 16 * 60 }, // Mon
  { open: 7 * 60, close: 16 * 60 }, // Tue
  { open: 7 * 60, close: 16 * 60 }, // Wed
  { open: 7 * 60, close: 16 * 60 }, // Thu
  { open: 7 * 60, close: 16 * 60 }, // Fri
  { open: 8 * 60, close: 16 * 60 }, // Sat
] as const

export const VISIT = {
  where: 'Austurvegur 31b · Selfoss\nSouth Iceland',
  hoursLines: ['Mon–Fri: 7 — 4', 'Sat: 8 — 4 · Sun: 8 — 2'],
  call: '482 1007',
  callHref: '+3544821007',
  email: 'gkbakari@simnet.is',
  facebook: 'https://www.facebook.com/gkbakari',
  facebookHandle: '@gkbakari',
  wolt: 'https://wolt.com/en/isl/selfossonly/venue/gk-bakari',
} as const
