/**
 * Gamla Fjósið — "The Old Cowhouse"
 * Faithful port of the Claude Design handoff (design_handoff_gamlafjosid_landing).
 * Editorial broadsheet landing: Newsreader display + Hanken Grotesk body + Space Mono labels.
 *
 * Menu, prices, reviews and copy are taken verbatim from the handoff spec.
 * Imagery is mostly Unsplash placeholders (the story photo is the restaurant's
 * own image from their live site) — swap for real photography before launch.
 */

const u = (id: string, w = 1280) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const IMAGES = {
  hero:    u('photo-1507807823252-1870c299a391', 2000), // Hvassafell farm beneath Eyjafjallajökull
  soup:    u('photo-1608500218861-01091cdc501e', 1100), // Eldfjallasúpa, the Volcano Soup
  story:   'https://gamlafjosid.is/wp-content/uploads/2023/06/DSC03314-1024x683.jpg', // real restaurant photo
  cattle:  u('photo-1757977158831-98c915f2429a', 700),  // free-range cattle
  volcano: u('photo-1637354895830-a26021dfa658', 700),  // Eyjafjallajökull landscape
  cowshed: u('photo-1743793055911-52e19beba5d8', 1600), // candlelit cowshed interior
  beef:    u('photo-1644704265419-96ddaf628e71', 700),  // plated tenderloin
}

// ─── MARQUEE RIBBON ──────────────────────────────────────────────────────────
export const RIBBON = [
  'Eldfjallasúpa',
  'Heimabakað brauð',
  'Nautakjöt af eigin búi',
  'Salat úr garðinum',
] as const

// ─── PROVENANCE TRAIL ────────────────────────────────────────────────────────
export interface Stage {
  num: string
  label: string
  img: string
  caption: string
}

export const STAGES: Stage[] = [
  { num: '01', label: 'Pasture',     img: IMAGES.cattle,  caption: 'Free-range cattle graze the meadows beneath the volcano — unhurried, unprocessed.' },
  { num: '02', label: 'Volcano',     img: IMAGES.volcano, caption: 'Eyjafjallajökull — the fire and ice that shaped this landscape and its soil.' },
  { num: '03', label: 'The cowshed', img: IMAGES.cowshed, caption: 'A working farm building turned restaurant in 1999. The original beams remain.' },
  { num: '04', label: 'The plate',   img: IMAGES.beef,    caption: 'Own-herd beef, garden salads, bread baked fresh every morning. No shortcuts.' },
]

// ─── MENU ────────────────────────────────────────────────────────────────────
export interface MenuItem {
  name:  string
  price: string
  desc:  string
}

export type MenuCategory = 'Mains' | 'Light Plates' | 'Vegetarian' | 'Desserts'

export const MENU_TABS: MenuCategory[] = ['Mains', 'Light Plates', 'Vegetarian', 'Desserts']

export const MENU: Record<MenuCategory, MenuItem[]> = {
  Mains: [
    { name: 'Tenderloin 200g',        price: '7.890 kr', desc: 'High-quality own-herd steak with buttered potatoes, vegetables and cheese-pepper sauce.' },
    { name: 'Country Burger',         price: '3.490 kr', desc: '140g patty, cheese, salad, tomato, cucumber and house burger sauce.' },
    { name: "Farmer's Burger",        price: '3.790 kr', desc: '140g patty, fried onions, fried mushrooms and béarnaise sauce.' },
    { name: 'Portobello Burger',      price: '3.990 kr', desc: 'Fried portobello, walnut, pickled onion, chilli jam, rúcola, blue-cheese sauce.' },
    { name: 'Steinar Steak Sandwich', price: '3.890 kr', desc: 'Homemade bread, sliced beef, fried onions, mushrooms and béarnaise.' },
    { name: 'Icelandic Cod',          price: '5.190 kr', desc: 'Oven-baked cod with fried vegetables, potatoes and the best butter in the world.' },
  ],
  'Light Plates': [
    { name: 'Bread Basket',    price: '1.640 kr', desc: 'Homemade bread with homemade mint and chilli jam.' },
    { name: 'Soup of the Day', price: '2.190 kr', desc: "Today's soup with a basket of homemade bread." },
    { name: 'Eldfjallasúpa',   price: '3.490 kr', desc: 'The Volcano Soup — powerful hearty beef-and-vegetable soup with bread.' },
  ],
  Vegetarian: [
    { name: 'Coconut & Curry Vegetables', price: '3.990 kr', desc: 'Fried vegetables in coconut-curry sauce with barley and homemade bread.' },
    { name: 'Garden Salad',               price: '3.190 kr', desc: 'Lettuce, tomato, cucumber, red onion, melon, soy-roasted seeds and feta.' },
    { name: 'Salad with Chickpeas',       price: '3.690 kr', desc: 'The garden salad, with chickpeas. Add beef for 4.290 kr.' },
  ],
  Desserts: [
    { name: 'Cake of the Day', price: '1.490 kr', desc: 'Homemade cake with whipped cream.' },
    { name: 'Eyjafjalla-skyr', price: '2.190 kr', desc: 'Skyr with cinnamon biscuits and rhubarb sauce.' },
    { name: 'Date Cake',       price: '2.390 kr', desc: 'Delicious date cake with warm caramel sauce and whipped cream.' },
  ],
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
export interface Review {
  text: string
  name: string
  from: string
}

export const REVIEWS: Review[] = [
  { text: 'We almost drove past. Then the soup arrived and we forgot we had anywhere to be.', name: 'Helena J.', from: 'Stockholm' },
  { text: 'The best beef I had in Iceland. Knowing the cattle were raised on that same farm made it taste even better.', name: 'Declan O.', from: 'Dublin' },
  { text: 'Eldfjallasúpan er besta súpa sem ég hef smakkað. Þess virði að keyra alla leið.', name: 'Bergljót S.', from: 'Reykjavík' },
  { text: 'The warmth of the old cowshed, the smell of fresh bread. We will be back next summer.', name: 'Marie & Pieter', from: 'Amsterdam' },
]

// ─── BOOKING TIME SLOTS ──────────────────────────────────────────────────────
export const TIME_SLOTS = ['11:30', '12:00', '12:30', '13:00', '14:00', '17:00', '18:00', '19:00', '20:00', '20:30'] as const
