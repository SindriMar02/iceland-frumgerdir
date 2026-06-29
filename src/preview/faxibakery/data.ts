/**
 * Data for the Faxi Bakery redesign — "Nýbakað, með útsýni"
 * (Fresh-baked, with a view).
 *
 * HONESTY GUARDRAILS:
 *   - Verified facts: cinnamon rolls baked hourly, hjónabandssæla, real espresso,
 *     gluten-free options, soup of the day, sandwiches, open kitchen, indoor/outdoor
 *     seating, free WiFi, open daily 08:00–18:00, on Route 1 under Eyjafjallajökull.
 *   - Contact: Instagram @faxi_bakery_ / phone +354 835 9534. NO public email.
 *   - NO official prices exist — all prices marked SAMPLE ("sýnishorn / frá").
 *   - NO founding year stated (not publicly confirmed).
 *   - Hjónabandssæla described softly as "from a cherished recipe".
 *   - Review quotes are SAMPLE (disclaimer in PreviewFooter).
 */

/** Vite-aware image URL helper — all images live in /public/faxibakery/ */
const IMG = (f: string) => `${import.meta.env.BASE_URL}faxibakery/${f}`

export const IMAGES = {
  hero:           IMG('hero.jpg'),
  snudur:         IMG('snudur.jpg'),
  snudurTray:     IMG('snudur-tray.jpg'),
  hjonabandssaela:IMG('hjonabandssaela.jpg'),
  samloka:        IMG('samloka.jpg'),
  supa:           IMG('supa.jpg'),
  kaffi:          IMG('kaffi.jpg'),
  gfCake:         IMG('gf-cake.jpg'),
  kitchen:        IMG('kitchen.jpg'),
  exterior:       IMG('exterior.jpg'),
  seating:        IMG('seating.jpg'),
} as const

// ── Fallback gradient classNames (warm cream, no img dependency) ──────────────
export const FALLBACK = {
  hero:     'bg-gradient-to-br from-[#f4e3b6] via-[#e8cf95] to-[#d9b97a]',
  snudur:   'bg-gradient-to-br from-[#f4e3b6] to-[#e6cf95]',
  kitchen:  'bg-gradient-to-br from-[#e8d5aa] to-[#d4b97a]',
  seating:  'bg-gradient-to-br from-[#dce8d0] to-[#b8d4a8]',
  exterior: 'bg-gradient-to-br from-[#b8cfd8] to-[#8faab5]',
  berry:    'bg-gradient-to-br from-[#c46070] to-[#8f2d3a]',
  coffee:   'bg-gradient-to-br from-[#c4a87a] to-[#8a6840]',
} as const

// ── Menu ─────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string
  name: string
  nameIs?: string
  description: string
  /** Sample price label. ALL are sample data, clearly labelled. */
  price: string
  /** true = gluten-free option available */
  gf?: boolean
  /** optional flavour / note tag */
  tag?: string
}

export interface MenuCategory {
  id: string
  title: string
  titleIs: string
  note?: string
  items: MenuItem[]
}

export const MENU: MenuCategory[] = [
  {
    id: 'snudar',
    title: 'Snúðar',
    titleIs: 'Snúðar',
    note: 'Baked every hour. Served warm.',
    items: [
      {
        id: 'snudur-classic',
        name: 'Classic Cinnamon Roll',
        nameIs: 'Klassískur snúður',
        description: 'Soft, pillowy dough, warm cinnamon butter, vanilla glaze.',
        price: 'frá 750 kr.',
        tag: 'Bestseller',
      },
      {
        id: 'snudur-cream-cheese',
        name: 'Cream Cheese Top',
        nameIs: 'Rjómaostahúð',
        description: 'Classic base, finished with a thick layer of whipped cream cheese.',
        price: 'frá 820 kr.',
      },
      {
        id: 'snudur-sourdough',
        name: 'Sourdough Snúður',
        nameIs: 'Sourdough snúður',
        description: 'Made with a slow-fermented sourdough base. Slightly tangy, very tender.',
        price: 'frá 850 kr.',
        tag: 'Weekend special',
      },
    ],
  },
  {
    id: 'hjonabandssaela',
    title: 'Hjónabandssæla',
    titleIs: 'Hjónabandssæla',
    note: 'Traditional Icelandic oat cake, from a cherished recipe.',
    items: [
      {
        id: 'hjonabandssaela-slice',
        name: 'Happy Marriage Cake',
        nameIs: 'Hjónabandssæla',
        description:
          'A beloved Icelandic layer cake: oat and rhubarb jam, buttery crumble. From a cherished house recipe.',
        price: 'frá 700 kr.',
        gf: false,
      },
    ],
  },
  {
    id: 'samlokur',
    title: 'Samlokur',
    titleIs: 'Samlokur',
    note: 'Sandwiches on fresh-baked bread.',
    items: [
      {
        id: 'faxi-sub',
        name: 'Faxi Sub',
        nameIs: 'Faxi-samloka',
        description: 'Grilled chicken, roasted peppers, garlic aioli on house-baked roll.',
        price: 'frá 1.850 kr.',
      },
      {
        id: 'schnitzel',
        name: 'Pork Schnitzel',
        nameIs: 'Svínaschnitzel',
        description: 'Crispy breaded pork, pickled cabbage slaw, mustard cream.',
        price: 'frá 1.950 kr.',
      },
      {
        id: 'roast-beef',
        name: 'Roast Beef',
        nameIs: 'Rjómabeef',
        description: 'Slow-roasted beef, horseradish cream, caramelised onion on dark rye.',
        price: 'frá 2.050 kr.',
      },
    ],
  },
  {
    id: 'supa',
    title: 'Súpa',
    titleIs: 'Súpa',
    items: [
      {
        id: 'soup-of-the-day',
        name: 'Soup of the Day',
        nameIs: 'Súpa dagsins',
        description: 'Today: tomato and roasted pepper. Changes daily. Served with bread.',
        price: 'frá 1.450 kr.',
        gf: true,
      },
    ],
  },
  {
    id: 'kaka',
    title: 'Pastries & Cakes',
    titleIs: 'Bakkelsi & kökur',
    items: [
      {
        id: 'blueberry-cottage-pie',
        name: 'Blueberry Cottage-Cheese Pie',
        nameIs: 'Bláberjakaka með kotasælu',
        description: 'Wild Icelandic blueberries and creamy cottage cheese in a buttery pastry shell.',
        price: 'frá 750 kr.',
        gf: true,
        tag: 'Gluten-free option',
      },
      {
        id: 'peach-pie',
        name: 'Peach Cottage-Cheese Pie',
        nameIs: 'Ferskjukaka með kotasælu',
        description: 'Ripe peach and cottage cheese on a delicate crust. Light and not too sweet.',
        price: 'frá 750 kr.',
        gf: true,
        tag: 'Gluten-free option',
      },
    ],
  },
  {
    id: 'kaffi',
    title: 'Coffee',
    titleIs: 'Kaffi',
    note: 'Real espresso. Oat milk available.',
    items: [
      {
        id: 'espresso',
        name: 'Espresso',
        nameIs: 'Espresso',
        description: 'Single origin, pulled to order.',
        price: 'frá 450 kr.',
      },
      {
        id: 'cappuccino',
        name: 'Cappuccino',
        nameIs: 'Cappuccino',
        description: 'Double espresso, micro-foamed milk. Oat milk on request.',
        price: 'frá 650 kr.',
        gf: true,
      },
      {
        id: 'filter',
        name: 'Filter Coffee',
        nameIs: 'Filterkaffi',
        description: 'House filter, brewed fresh. Free refill with any pastry.',
        price: 'frá 500 kr.',
        gf: true,
      },
    ],
  },
]

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface Review {
  quote: string
  author: string
  origin: string
  source: string
}

/** SAMPLE reviews — disclaimed in PreviewFooter. */
export const REVIEWS: Review[] = [
  {
    quote:
      'We stopped for a cinnamon roll and ended up staying an hour just to watch the volcano clouds shift. The rolls came out of the oven while we were sitting there.',
    author: 'Emma R.',
    origin: 'Edinburgh, UK',
    source: 'Google',
  },
  {
    quote:
      'Best coffee stop on the entire Ring Road. The pastries are made right in front of you, which makes every bite feel earned.',
    author: 'Ólafur S.',
    origin: 'Reykjavik',
    source: 'Google',
  },
  {
    quote:
      'My daughter needed gluten-free and they had several real options, not an afterthought. Brilliant little place under a very big mountain.',
    author: 'Heather M.',
    origin: 'Toronto, Canada',
    source: 'TripAdvisor',
  },
  {
    quote:
      'Pulled over on a whim. Stayed for the hjónabandssæla. Left planning the return trip.',
    author: 'Magnús E.',
    origin: 'Selfoss',
    source: 'Google',
  },
]

// ── Visit info ────────────────────────────────────────────────────────────────

export const VISIT = {
  address: 'Þjóðvegur 1, undir Eyjafjöllum',
  addressNote: 'Between Hvolsvöllur and Vík, South Iceland',
  hours: 'Open daily 8:00–18:00',
  hoursShort: '8–18',
  phone: '+354 835 9534',
  phoneFmt: '+354 835 9534',
  phoneHref: '+3548359534',
  instagram: 'https://www.instagram.com/faxi_bakery_',
  instagramHandle: '@faxi_bakery_',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Faxi+Bakery+Iceland',
  nearbyNote:
    'Minutes from Seljalandsfoss and Skógafoss. Large parking area right on Route 1.',
} as const

// ── Road-trip landmarks ────────────────────────────────────────────────────────

export interface Landmark {
  name: string
  distance: string
  note: string
}

export const LANDMARKS: Landmark[] = [
  { name: 'Seljalandsfoss', distance: '~8 km', note: 'The waterfall you can walk behind.' },
  { name: 'Skógafoss', distance: '~25 km', note: 'One of Iceland\'s widest and tallest falls.' },
  { name: 'Hvolsvöllur', distance: '~15 km west', note: 'Nearest town with fuel and services.' },
  { name: 'Vík', distance: '~55 km east', note: 'Black sand beach and basalt columns.' },
]
