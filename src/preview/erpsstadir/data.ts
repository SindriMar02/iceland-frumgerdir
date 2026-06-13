/**
 * Sample content for the Rjómabúið Erpsstaðir prototype — "The Tasting Room".
 * All flavours, prices, hours and quotes are illustrative (disclaimed in footer).
 */

const U = 'https://images.unsplash.com/'
const card = (id: string) => `${U}${id}?q=80&w=1200&auto=format&fit=crop`

export interface Flavour {
  id: string
  name: string
  is: string
  note: string
  price: string
  img: string
  alt: string
  accent: 'gold' | 'berry'
}

export const FLAVOURS: Flavour[] = [
  {
    id: 'kjaftaedi',
    name: 'Kjaftæði vanilla-caramel',
    is: 'Vanillu-karamella',
    note: 'Our signature. Madagascar vanilla folded through a slow, dark caramel from the morning’s cream.',
    price: '890 kr.',
    img: card('photo-1576506295286-5cda18df43e7'),
    alt: 'A scoop of ice cream in a waffle cone',
    accent: 'gold',
  },
  {
    id: 'rabarbari',
    name: 'Rabarbari',
    is: 'Rhubarb & cream',
    note: 'Garden rhubarb stewed tart and bright, rippled through milk-white skyr ice cream.',
    price: '890 kr.',
    img: card('photo-1488900128323-21503983a07e'),
    alt: 'Brightly coloured ice lollies arranged on a dark surface',
    accent: 'berry',
  },
  {
    id: 'lakkris',
    name: 'Lakkrís',
    is: 'Salt liquorice',
    note: 'The one travellers come back for — proper Icelandic liquorice, salted, swirled, unapologetic.',
    price: '890 kr.',
    img: card('photo-1560008581-09826d1de69e'),
    alt: 'Scoops of ice cream finished with a scatter of colourful sprinkles',
    accent: 'gold',
  },
  {
    id: 'blaber',
    name: 'Bláber',
    is: 'Wild blueberry',
    note: 'Late-August berries picked from the hillsides above the farm. Deep, jammy, barely sweetened.',
    price: '890 kr.',
    img: card('photo-1567206563064-6f60f40a2b57'),
    alt: 'Artisan ice cream in a display case',
    accent: 'berry',
  },
  {
    id: 'skyrhunang',
    name: 'Skyr-hunang',
    is: 'Skyr & honey',
    note: 'Our own skyr churned soft, laced with honey — tangy, light, the taste of the dairy itself.',
    price: '890 kr.',
    img: card('photo-1576506295286-5cda18df43e7'),
    alt: 'A scoop of ice cream in a waffle cone',
    accent: 'gold',
  },
]

export interface Hour {
  days: string
  time: string
  season: string
}

export const HOURS: Hour[] = [
  { days: 'Sumar / Summer', time: 'Daily · 10:00 – 18:00', season: 'Jun – Aug' },
  { days: 'Vor & haust / Spring & autumn', time: 'Daily · 12:00 – 17:00', season: 'May & Sep' },
  { days: 'Vetur / Winter', time: 'By arrangement · call ahead', season: 'Oct – Apr' },
]

export interface Quote {
  text: string
  name: string
  from: string
}

export const QUOTES: Quote[] = [
  {
    text: 'We drove 6 km off the ring road on a whim and ended up staying an hour. The liquorice scoop ruined every other ice cream for me.',
    name: 'Marta',
    from: 'Berlin',
  },
  {
    text: 'You can see the cows from the shop window, then taste what they made twenty minutes later. Our kids still talk about it.',
    name: 'James & Aoife',
    from: 'Dublin',
  },
  {
    text: 'Besti ís sem ég hef smakkað á Íslandi — og ég hef smakkað ansi mikið. Kjaftæði stendur undir nafni.',
    name: 'Guðrún',
    from: 'Reykjavík',
  },
]
