/**
 * Gamla Fjósið — "Eldur, gras og nautakjöt"
 * Farm-to-table in a converted cowshed under Eyjafjallajökull since 1999.
 * All data sourced from gamlafjosid.is; prices verified; reviews are sample.
 */

// Sourced + visually vetted from Unsplash (honest, category-matched, sample imagery).
const u = (id: string, w = 1280) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const IMAGES = {
  hero:     u('photo-1507807823252-1870c299a391', 1920), // Icelandic farm beneath a snow-capped mountain
  soup:     u('photo-1608500218861-01091cdc501e', 1100), // hearty beef & vegetable stew
  beef:     u('photo-1644704265419-96ddaf628e71', 1100), // grilled steak with vegetables + wine
  burger:   u('photo-1508736793122-f516e3ba5569', 1100), // cheeseburger on wood
  cod:      u('photo-1733554080207-754bfedf4864', 1100), // plated white fish with vegetables
  dessert:  u('photo-1763208384514-9b8531d62ee6', 1100), // slice of rich dark cake
  interior: u('photo-1743793055911-52e19beba5d8', 1600), // warm table set by a window
  cattle:   u('photo-1757977158831-98c915f2429a', 1280), // cattle grazing green pasture
  bread:    u('photo-1589367920969-ab8e050bbb04', 1100), // rustic crusty loaf
  farm:     u('photo-1637354895830-a26021dfa658', 1280), // green Icelandic field under a mountain
}

// ─── PROVENANCE TRAIL ───────────────────────────────────────────────────────

export interface ProvenanceStage {
  id: string
  label: string
  caption: string
  img: string
  alt: string
  fallback: string
}

export const PROVENANCE: ProvenanceStage[] = [
  {
    id:      'pasture',
    label:   'Pasture',
    caption: 'Free-range cattle graze the meadows beneath Eyjafjallajökull — unhurried, unprocessed.',
    img:     IMAGES.cattle,
    alt:     'Cattle grazing green pasture with a snow-capped volcano in the background',
    fallback: 'bg-gradient-to-br from-[#4a5d3a] to-[#2e3d22]',
  },
  {
    id:      'volcano',
    label:   'Volcano',
    caption: 'Eyjafjallajökull — the fire and ice that defines this landscape and flavours the soil.',
    img:     IMAGES.farm,
    alt:     'The farm Hvassafell with Eyjafjallajökull volcano behind it',
    fallback: 'bg-gradient-to-br from-[#5c4030] to-[#241a12]',
  },
  {
    id:      'cowshed',
    label:   'The Old Cowshed',
    caption: 'A working farm converted into a restaurant in 1999. The original beams are still there.',
    img:     IMAGES.interior,
    alt:     'Warm candlelit interior of the converted cowshed restaurant',
    fallback: 'bg-gradient-to-br from-[#3d2b1a] to-[#1a120c]',
  },
  {
    id:      'plate',
    label:   'The Plate',
    caption: 'Own-farm beef, garden salads, and bread baked fresh every morning. No shortcuts.',
    img:     IMAGES.beef,
    alt:     'A beautifully plated beef dish from Gamla Fjosid',
    fallback: 'bg-gradient-to-br from-[#c2410c]/40 to-[#241a12]',
  },
]

// ─── MENU ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  name:   string
  desc?:  string
  price:  string
  img?:   string
  alt?:   string
  fallback?: string
  featured?: boolean
}

export interface MenuGroup {
  heading: string
  items:   MenuItem[]
}

export const MENU: MenuGroup[] = [
  {
    heading: 'Mains',
    items: [
      {
        name:    'Beef Tenderloin 200g',
        desc:    'Own-farm free-range beef, served with seasonal accompaniments.',
        price:   '7.890 kr.',
        img:     IMAGES.beef,
        alt:     'Sliced beef tenderloin on a plate',
        fallback: 'bg-gradient-to-br from-[#5c3018] to-[#241a12]',
        featured: true,
      },
      {
        name:  'Country Burger',
        desc:  'Own-farm beef patty, house sauce, toasted bun.',
        price: '3.490 kr.',
        img:   IMAGES.burger,
        alt:   'A thick beef burger with house sauce',
        fallback: 'bg-gradient-to-br from-[#7a4020] to-[#3d1e0a]',
      },
      {
        name:  'Farmer\'s Burger',
        desc:  'Double patty, aged cheese, pickled onion.',
        price: '3.790 kr.',
      },
      {
        name:  'Portobello Burger',
        desc:  'Grilled portobello, goat cheese, roasted pepper.',
        price: '3.990 kr.',
      },
      {
        name:  'Steinar Steak Sandwich',
        desc:  'Thin-sliced beef on sourdough with mustard and greens.',
        price: '3.890 kr.',
      },
      {
        name:  'Oven-Baked Icelandic Cod',
        desc:  'Day-fresh Atlantic cod, lemon butter, garden herbs.',
        price: '5.190 kr.',
        img:   IMAGES.cod,
        alt:   'Oven-baked Icelandic cod with herbs',
        fallback: 'bg-gradient-to-br from-[#2a4a5a] to-[#1a2d38]',
      },
    ],
  },
  {
    heading: 'Light Plates',
    items: [
      {
        name:  'Bread Basket',
        desc:  'Homemade sourdough baked this morning.',
        price: '1.640 kr.',
        img:   IMAGES.bread,
        alt:   'A basket of freshly baked sourdough bread',
        fallback: 'bg-gradient-to-br from-[#c49a6c] to-[#8a6340]',
      },
      {
        name:  'Soup of the Day',
        desc:  'Ask your server what is on today.',
        price: '2.190 kr.',
      },
    ],
  },
  {
    heading: 'Vegetarian',
    items: [
      {
        name:  'Coconut and Curry Vegetables',
        desc:  'Seasonal garden vegetables in a fragrant coconut-curry broth.',
        price: '3.990 kr.',
      },
      {
        name:  'Chickpea Salad',
        desc:  'Garden leaves, roasted chickpeas, lemon-herb dressing.',
        price: '3.690 kr.',
      },
    ],
  },
  {
    heading: 'Desserts',
    items: [
      {
        name:  'Cake of the Day',
        desc:  'Ask your server.',
        price: '1.490 kr.',
        img:   IMAGES.dessert,
        alt:   'A slice of homemade cake',
        fallback: 'bg-gradient-to-br from-[#b8825c] to-[#7a5030]',
      },
      {
        name:  'Eyjafjalla-Skyr',
        desc:  'Icelandic skyr with seasonal berries and cream.',
        price: '2.190 kr.',
      },
      {
        name:  'Date Cake',
        desc:  'Warm date cake with toffee sauce and vanilla cream.',
        price: '2.390 kr.',
      },
    ],
  },
]

// ─── MENU GALLERY (the scrollable dish carousel — photographed dishes only) ───
export interface GalleryDish {
  image: string
  name:  string
  price: string
  desc:  string
}

export const MENU_GALLERY: GalleryDish[] = [
  {
    image: IMAGES.soup,
    name:  'Eldfjallasúpa',
    price: '3.490 kr.',
    desc:  'Our volcano soup — a hearty beef and root-vegetable broth, slow-simmered all day and served with bread baked this morning.',
  },
  {
    image: IMAGES.beef,
    name:  'Beef Tenderloin',
    price: '7.890 kr.',
    desc:  '200g of our own free-range beef, raised on the farm under Eyjafjallajökull, with potatoes, seasonal vegetables and a cheese-pepper sauce.',
  },
  {
    image: IMAGES.burger,
    name:  'Country Burger',
    price: '3.490 kr.',
    desc:  'A 140g patty of our own beef with cheese, salad, tomato and cucumber in a toasted bun. Simple, generous, honest.',
  },
  {
    image: IMAGES.cod,
    name:  'Oven-Baked Cod',
    price: '5.190 kr.',
    desc:  'Day-fresh Icelandic cod baked in lemon butter and finished with herbs picked from the garden out back.',
  },
  {
    image: IMAGES.bread,
    name:  'Bread Basket',
    price: '1.640 kr.',
    desc:  'Sourdough and dark rye, baked fresh in the kitchen every single morning and served warm with farm butter.',
  },
  {
    image: IMAGES.dessert,
    name:  'Cake of the Day',
    price: '1.490 kr.',
    desc:  'A rotating homemade cake — ask your server what came out of the oven today. There is always something.',
  },
]

/** Stable {image,text} list for the WebGL gallery (labels show the dish name). */
export const MENU_GALLERY_ITEMS = MENU_GALLERY.map((d) => ({ image: d.image, text: d.name }))

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

export interface Quote {
  text: string
  name: string
  from: string
}

export const QUOTES: Quote[] = [
  {
    text: 'We almost drove past. Then the soup arrived and we forgot we had anywhere to be. That is not an exaggeration.',
    name: 'Helena J.',
    from: 'Stockholm',
  },
  {
    text: 'The tenderloin was the best beef I had in Iceland. Knowing the cattle were raised on that same farm under the volcano made it taste even better.',
    name: 'Declan O.',
    from: 'Dublin',
  },
  {
    text: 'Eldfjallasupan er besta súpa sem ég hef smakkað. Hvata til ferðar alla leið hingað og það er þess virði.',
    name: 'Bergljot S.',
    from: 'Reykjavik',
  },
  {
    text: 'The warmth of the old cowshed, the smell of fresh bread, the bread basket alone. We will be back next summer.',
    name: 'Marie &amp; Pieter',
    from: 'Amsterdam',
  },
]

// ─── TIME SLOTS ──────────────────────────────────────────────────────────────

export const TIME_SLOTS = [
  '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00',
  '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30',
]
