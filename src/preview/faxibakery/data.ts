/**
 * Faxi Bakery — landing-page data.
 *
 * Built on the "Faxi Bakery Café" design handoff from Claude design
 * (volcanic-black / moss-green / cream palette, "CINNAMON — fresh, every hour").
 *
 * HONESTY GUARDRAILS (prototype is disclaimed in PreviewFooter):
 *   - Verified facts: cinnamon rolls baked fresh every hour, real espresso machine,
 *     hjónabandssæla, on Route 1 in Hvolsvöllur under Eyjafjallajökull, ~4.8★.
 *   - Contact: Instagram @faxi_bakery_ / phone +354 835 9534. No public email.
 *   - Prices are illustrative Icelandic króna (kr) — sample data, confirm before publishing.
 *     The full menu below is a WORKING DRAFT of the kind of range a Route 1
 *     bakery-café carries; it has not been confirmed against Faxi's real till.
 *   - Brand voice ("a bakery with unregular stuff", "NO GROUP BOOKING", 🐌🐳🦩🐿️) is real.
 *
 * ── ASSET MODEL (three tiers, so the page is never broken and never lies) ────
 *   1. `file`    the real Faxi asset we want, under public/faxibakery/.
 *   2. `standIn` a vetted stock frame that holds the composition until (1) lands.
 *                Marked on the page with a quiet corner dot, never presented as Faxi's.
 *   3. neither   → the page draws a designed PLACEHOLDER carrying the shot brief,
 *                so every hole reads as a work order instead of a broken image.
 *   Drop the real file in with the exact `file` name and it takes over. No code change.
 */

const BASE = import.meta.env.BASE_URL
const local = (f: string) => `${BASE}faxibakery/${f}`
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

/** Ground tone the placeholder draws itself in when an asset is missing. */
export type Tone = 'terrain' | 'food' | 'room'

export interface Shot {
  /** Target filename under public/faxibakery/ — the real photo we're waiting on. */
  file: string
  /** Resolved local URL (tier 1). */
  src: string
  /** Vetted stock frame holding the slot until the real photo arrives (tier 2). */
  standIn?: string
  alt: string
  /** What to shoot or generate. Rendered inside the placeholder. */
  brief: string
  tone: Tone
}

const shot = (
  file: string,
  alt: string,
  brief: string,
  tone: Tone,
  standIn?: string,
): Shot => ({ file, src: local(file), standIn, alt, brief, tone })

export interface Film {
  file: string
  src: string
  poster: Shot
  /** What to film. Rendered inside the film slot. */
  brief: string
  /** Runtime + treatment note for whoever shoots it. */
  spec: string
}

const film = (file: string, poster: Shot, brief: string, spec: string): Film => ({
  file,
  src: local(file),
  poster,
  brief,
  spec,
})

// ── Stills ───────────────────────────────────────────────────────────────────

export const SHOTS = {
  /** The one real asset we already have. */
  hero: shot(
    'hero.jpg',
    'A single glazed cinnamon roll, photographed close on a plain warm cream ground',
    'Single cinnamon roll, extreme close-up, plain warm cream ground',
    'food',
  ),

  // Terrain — the ground the whole page sits on
  road: shot(
    'exterior.jpg',
    "The Ring Road running past Faxi, green slopes and snow-capped mountains behind",
    'The building from the road: Route 1 in the foreground, the café low and lit, Eyjafjallajökull rising behind it. Shoot wide, 3:1, late afternoon, car in shot for scale.',
    'terrain',
    u('photo-1519092437326-bfd121eb53ae', 2000),
  ),
  window: shot(
    'volcano-window.jpg',
    'Eyjafjallajökull and green mountains under an open sky, seen from the café',
    'The view out the café window — the volcano and the green slopes, shot from a seat at the glass so the window frame is in it. Overcast is fine, calm is the point.',
    'terrain',
    u('photo-1504893524553-b855bce32c67', 1800),
  ),
  seating: shot(
    'seating.jpg',
    'The bright plant-filled seating area, wood tables and big windows',
    'Interior seating: plants, warm wood, the window wall doing the work. Shoot from the door, mid-morning, real customers if they consent.',
    'room'
  ),
  kitchen: shot(
    'kitchen.jpg',
    'The open bakery kitchen, a baker shaping dough on a floured bench',
    'The open kitchen: hands shaping dough on a floured bench, flour in the air, the theatre customers actually watch. Tight, warm, no flash.',
    'room',
  ),
  terrace: shot(
    'terrace.jpg',
    "Faxi's outdoor tables on Route 1 with the mountains behind",
    'Outdoor tables with the mountain line behind. Low sun, coffee cups on the table, nobody posing.',
    'terrain'
  ),
  dusk: shot(
    'dusk-road.jpg',
    'The road past Faxi at dusk, the café windows the only warm light',
    'Dusk from across Route 1: the café windows the only warm light in a blue landscape, headlights streaking past. Tripod, long exposure, 3:1.',
    'terrain',
  ),
} as const

// ── Films ────────────────────────────────────────────────────────────────────

export const FILMS = {
  /** The calm interlude — the whole "blend into the terrain" idea in one shot. */
  window: film(
    'video/window-view.mp4',
    SHOTS.window,
    'Locked-off shot out the window: cloud shadow crossing the volcano, steam drifting up from a cup in the near corner of frame. Nothing else happens. That is the shot.',
    '12–20s silent loop · locked tripod · 1080p h.264 + webm · no cuts',
  ),
  /** Closing calm before the practical stuff. */
  dusk: film(
    'video/last-batch.mp4',
    SHOTS.dusk,
    'The last light going off the mountain while the road keeps moving. Slow, wide, patient.',
    '15–25s silent loop · locked tripod · 1080p · 3:1 crop',
  ),
} as const

// ── Popular — "out of the oven", the four things people actually stop for ────

export interface PopularItem {
  id: string
  name: string
  price: string
  tag?: string
  desc: string
  /** The one line that explains why it sells. Set in the script face. */
  note: string
  shot: Shot
}

export const POPULAR: PopularItem[] = [
  {
    id: 'pop-snudur',
    name: 'The hourly cinnamon roll',
    price: 'kr 850',
    tag: 'Signature',
    desc: 'Laminated, cardamom-heavy, properly gooey in the middle. Out of the oven on the hour, every hour, all day.',
    note: 'never lasts the full hour',
    shot: shot(
      'snudur.jpg',
      'A glossy glazed Icelandic cinnamon roll, close, with a cream-cheese drizzle',
      'One roll, close, glaze still wet, soft crumb visible where it is pulled open. Warm natural light, shallow depth.',
      'food',
      u('photo-1509365465985-25d11c17e812', 1400),
    ),
  },
  {
    id: 'pop-cream',
    name: 'Cream cheese sourdough roll',
    price: 'kr 950',
    tag: 'Fan favourite',
    desc: 'Slow sourdough, cardamom sugar, a thick swipe of cream cheese frosting that melts into the warm layers.',
    note: 'the one people photograph',
    shot: shot(
      'snudur-cream.jpg',
      'A sourdough cinnamon roll under thick cream cheese frosting',
      'Three-quarter angle, frosting still soft and slumping, one roll pulled apart beside it.',
      'food'
    ),
  },
  {
    id: 'pop-sub',
    name: 'The Faxi sub',
    price: 'kr 2,190',
    tag: 'Lunch',
    desc: 'Big, messy, built on our own bread. The reason a lot of people pull off Route 1 in the first place.',
    note: 'two hands required',
    shot: shot(
      'samloka.jpg',
      'A loaded sub sandwich on house bread, cut to show the cross-section',
      'Cut on the diagonal so the fill shows, on a board, on a real table by the window with the view soft behind it.',
      'food'
    ),
  },
  {
    id: 'pop-marriage',
    name: 'Happy marriage cake',
    price: 'kr 720',
    tag: 'Heritage',
    desc: 'Hjónabandssæla — rhubarb jam under an oat crumble, from a recipe handed down through generations.',
    note: 'grandmothers approve',
    shot: shot(
      'hjonabandssaela.jpg',
      'A slice of Icelandic hjónabandssæla rhubarb oat cake on a ceramic plate',
      'One slice on a plain ceramic plate, crumb scattered, rustic, warm side light.',
      'food'
    ),
  },
]

// ── The full menu — everything they carry ────────────────────────────────────

export interface MenuRow {
  id: string
  name: string
  note?: string
  price: string
  /** Rows with a shot drive the preview panel. Most rows do not need one. */
  shot?: Shot
}

export interface MenuGroup {
  id: string
  label: string
  /** Icelandic name, set small under the English one. */
  sub: string
  blurb: string
  /** Full-bleed ground behind the pinned menu stage while this group is active. */
  ground: Shot
  rows: MenuRow[]
}

export const FULL_MENU: MenuGroup[] = [
  {
    id: 'oven',
    label: 'From the oven',
    sub: 'Úr ofninum',
    blurb: 'Baked here, through the day. The case empties and fills again.',
    ground: POPULAR[0].shot,
    rows: [
      { id: 'm-snudur', name: 'Hourly cinnamon roll', note: 'on the hour, every hour', price: 'kr 850', shot: POPULAR[0].shot },
      { id: 'm-cream', name: 'Cream cheese sourdough roll', note: 'cardamom, cream cheese frosting', price: 'kr 950', shot: POPULAR[1].shot },
      { id: 'm-knot', name: 'Cardamom knot', note: 'pearl sugar, crisp edges', price: 'kr 820' },
      {
        id: 'm-croissant',
        name: 'Chocolate croissant',
        note: 'hand-laminated, dark Icelandic chocolate',
        price: 'kr 790',
        shot: shot('croissant.jpg', 'A chocolate croissant showing its flaky layers', 'Close, layers shattering, chocolate at the end.', 'food', u('photo-1623334044303-241021148842', 1100)),
      },
      { id: 'm-butter', name: 'Butter croissant', price: 'kr 690' },
      {
        id: 'm-earlgrey',
        name: 'Earl Grey cookie',
        note: 'crackly edge, bergamot middle',
        price: 'kr 650',
        shot: shot('earlgrey.jpg', 'A thick Earl Grey cookie broken in half', 'Broken in half so the soft middle shows, on parchment.', 'food', u('photo-1499636136210-6f4ee915583e', 1100)),
      },
      {
        id: 'm-balls',
        name: 'Faxi balls',
        note: 'our unregular little chocolate-oat things',
        price: 'kr 550',
        shot: shot('faxiballs.jpg', 'A pile of chocolate-oat balls on a small plate', 'A small pile on a plate, coconut dusting, nothing styled.', 'food'),
      },
      { id: 'm-marriage', name: 'Happy marriage cake', note: 'hjónabandssæla', price: 'kr 720', shot: POPULAR[3].shot },
      {
        id: 'm-gf',
        name: 'Gluten-free berry cake',
        note: 'ask what is in the case today',
        price: 'kr 890',
        shot: shot('gf-cake.jpg', 'A slice of gluten-free berry cake on a plate', 'A slice on a plate in bright window light, berries visible in the crumb.', 'food'),
      },
      { id: 'm-rye', name: 'Rye loaf, whole', price: 'kr 1,290' },
      { id: 'm-sourdough', name: 'Sourdough loaf, whole', note: 'baked overnight, out from nine', price: 'kr 1,490' },
    ],
  },
  {
    id: 'lunch',
    label: 'Lunch',
    sub: 'Hádegi',
    blurb: 'From eleven until three, or until it runs out.',
    ground: POPULAR[2].shot,
    rows: [
      { id: 'm-sub', name: 'The Faxi sub', note: 'on our own bread', price: 'kr 2,190', shot: POPULAR[2].shot },
      {
        id: 'm-pork',
        name: 'Pulled pork sandwich',
        note: 'slow-cooked, pickles that bite back',
        price: 'kr 2,290',
        shot: shot('pulledpork.jpg', 'A pulled pork sandwich on a wooden board', 'On a board, melty, pickles visible at the edge.', 'food'),
      },
      { id: 'm-salmon', name: 'Smoked salmon on rye', note: 'dill, lemon, butter', price: 'kr 2,090' },
      {
        id: 'm-soup',
        name: 'Soup of the day',
        note: 'with bread, refills on the bread',
        price: 'kr 1,890',
        shot: shot('supa.jpg', 'A bowl of soup with a slice of fresh bread beside it', 'Overhead, steam still visible, bread torn not sliced. Bright cozy light.', 'food'),
      },
      { id: 'm-cheese', name: 'Grilled cheese', note: 'aged cheddar, on sourdough', price: 'kr 1,690' },
      { id: 'm-ham', name: 'Toasted ham and cheese', price: 'kr 1,490' },
    ],
  },
  {
    id: 'coffee',
    label: 'Coffee and drinks',
    sub: 'Kaffi og drykkir',
    blurb: 'A real espresso machine, worked by hand. Not the automatic kind.',
    ground: shot('kaffi.jpg', 'A cup of espresso on the wooden counter in morning light', 'The counter itself: cups, the machine, morning light raking across it. Wide enough to sit behind a menu panel.', 'food'),
    rows: [
      {
        id: 'm-espresso',
        name: 'Espresso',
        note: 'double, kr 590',
        price: 'kr 490',
        shot: shot('kaffi.jpg', 'A cup of espresso on a wooden café table in morning light', 'A cup on the wooden counter, crema intact, morning light across it. Shoot low.', 'food'),
      },
      { id: 'm-americano', name: 'Americano', price: 'kr 620' },
      { id: 'm-flatwhite', name: 'Flat white', price: 'kr 750' },
      { id: 'm-cappuccino', name: 'Cappuccino', price: 'kr 750' },
      { id: 'm-latte', name: 'Latte', note: 'oat, soy or cow', price: 'kr 790' },
      { id: 'm-filter', name: 'Filter coffee', note: 'refills are free, obviously', price: 'kr 590' },
      { id: 'm-choc', name: 'Hot chocolate', note: 'with cream if you want it', price: 'kr 790' },
      { id: 'm-tea', name: 'Loose leaf tea', price: 'kr 590' },
      { id: 'm-soft', name: 'Soft drinks and juice', price: 'kr 590' },
      { id: 'm-water', name: 'Icelandic water', note: 'straight from the tap, best in the world', price: 'free' },
    ],
  },
  {
    id: 'cold',
    label: 'Cold case',
    sub: 'Kalt í borðinu',
    blurb: 'For the mornings you drove past breakfast.',
    ground: shot('cold-case.jpg', 'The cold case, skyr and fruit under glass', 'The cold case straight on, everything in it, bright even light. Wide.', 'food'),
    rows: [
      {
        id: 'm-skyr',
        name: 'Skyr with berries',
        price: 'kr 990',
        shot: shot('skyr.jpg', 'A bowl of skyr topped with berries', 'A glass or bowl of skyr, berries on top, bright and clean against the wood.', 'food'),
      },
      { id: 'm-granola', name: 'Yoghurt and granola', price: 'kr 1,090' },
      { id: 'm-fruit', name: 'Fruit cup', price: 'kr 890' },
      { id: 'm-egg', name: 'Boiled egg', note: 'one egg. that is the whole item.', price: 'kr 290' },
    ],
  },
  {
    id: 'road',
    label: 'For the road',
    sub: 'Fyrir ferðina',
    blurb: 'Most people are back in the car within ten minutes. We plan for that.',
    ground: SHOTS.road,
    rows: [
      { id: 'm-togo', name: 'Anything, to go', note: 'same price, no cup charge', price: '—' },
      { id: 'm-box', name: 'Box of six rolls', note: 'the reason your passengers forgive you', price: 'kr 4,700' },
      { id: 'm-bundle', name: 'Sandwich and coffee', note: 'together', price: 'kr 2,590' },
      { id: 'm-dog', name: 'Dog biscuit', note: 'ask at the counter', price: 'free' },
    ],
  },
]

/** Shown under the full menu — keeps the draft honest without breaking the voice. */
export const MENU_NOTE =
  'Working draft. Items and prices to be confirmed with the bakery before this goes live.'

// ── Story stat strip ─────────────────────────────────────────────────────────

// Numbers only, and only numbers that mean something. "1 very real espresso
// machine" and "0 group bookings" were jokes set in a number's clothes, and
// "24 batches a day" contradicted the 9-to-8 hours printed beside it: eleven
// hours open, one batch an hour, is eleven. The brand voice keeps its jokes,
// in prose, where they read as voice instead of as data.
// The star was rendering from a fallback font, so it sat at a different weight
// and baseline to the numerals beside it. The word does the job without the
// mismatch.
export const STATS = [
  { value: '4.8', caption: 'average over 350+ reviews' },
  { value: '11', caption: 'batches a day, one an hour' },
  { value: '9–8', caption: 'open every day' },
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

/** Warm gradient fallbacks so a dead URL never breaks the layout. */
export const FALLBACK = {
  cream: 'bg-gradient-to-br from-[#F1E4CE] to-[#E6D2B8]',
  card: 'bg-gradient-to-br from-[#E5D5BA] to-[#d6c4a0]',
  volcano: 'bg-gradient-to-br from-[#b8cfd8] to-[#8faab5]',
  moss: 'bg-gradient-to-br from-[#5b6a4e] to-[#3c4733]',
  ink: 'bg-gradient-to-br from-[#2a241d] to-[#1B1712]',
} as const

/** Kept for the hero, which still points at the one real photo we have. */
export const IMAGES = { hero: SHOTS.hero.src } as const
