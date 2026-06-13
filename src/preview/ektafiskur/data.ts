/**
 * Ektafiskur — "The Salt House" content model.
 * Sample prices/copy only (disclaimed in the shared footer).
 */

const IMG = 'https://images.unsplash.com/'
const Q_CARD = '?q=80&w=1200&auto=format&fit=crop'

export const HERO_ID = 'photo-1498654200943-1088dd4438ae'

export interface Product {
  id: string
  name: string
  is: string
  blurb: string
  weight: string
  price: string
  img: string
  alt: string
  ships: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'saltfiskur',
    name: 'Saltfiskur',
    is: 'Salted cod',
    blurb: 'Hand-salted North Atlantic cod, cured slow the way the village has done it for eighty years.',
    weight: '500 g · skinless fillet',
    price: '2.490 kr.',
    img: `${IMG}photo-1510130387422-82bed34b37e9${Q_CARD}`,
    alt: 'Two fresh whole fish resting on weathered grey wood',
    ships: 'Ships within Iceland',
  },
  {
    id: 'bacalao',
    name: 'Bacalao',
    is: 'Klassískt bacalao',
    blurb: 'Our flagship cure — firm, snow-white flesh built to be soaked, then braised with tomato, onion and oil.',
    weight: '800 g · bone-in loin',
    price: '3.290 kr.',
    img: `${IMG}photo-1498654200943-1088dd4438ae${Q_CARD}`,
    alt: 'Fresh whole fish laid on crushed ice, photographed in black and white',
    ships: 'We export worldwide',
  },
  {
    id: 'utvatnadur',
    name: 'Útvatnaður saltfiskur',
    is: 'Ready to cook',
    blurb: 'The classic cure, already soaked and rinsed for you — straight into the pan or the pot, no overnight wait.',
    weight: '600 g · desalted fillet',
    price: '2.890 kr.',
    img: `${IMG}photo-1510130387422-82bed34b37e9${Q_CARD}`,
    alt: '',
    ships: 'Ships within Iceland',
  },
  {
    id: 'gjafakassi',
    name: 'Gjafakassi',
    is: 'The gift box',
    blurb: 'Saltfiskur, bacalao and útvatnaður saltfiskur in a stamped wooden crate — the whole Salt House, boxed.',
    weight: 'Curated · 3 items',
    price: '7.490 kr.',
    img: `${IMG}photo-1580476262798-bddd9f4b7369${Q_CARD}`,
    alt: '',
    ships: 'We export worldwide',
  },
]

export interface Mark {
  k: string
  label: string
  detail: string
}

export const MARKS: Mark[] = [
  { k: '1940', label: 'Síðan', detail: 'Founded in Hauganes, hand-salting cod for eighty-five years.' },
  { k: '100%', label: 'Fiskur', detail: 'No ice glaze, no machines — just fish, hand-salted batch by batch.' },
  { k: '65°N', label: 'North Atlantic', detail: 'Wild cod from the cold, clean waters off the north coast.' },
]

export interface ShopStep {
  n: string
  title: string
  body: string
}

export const SHOP_STEPS: ShopStep[] = [
  { n: '01', title: 'Choose your cure', body: 'Saltfiskur, bacalao, útvatnaður or the full gift box — all in one clean shop.' },
  { n: '02', title: 'Pay in two clicks', body: 'A modern, bilingual checkout. No accounts, no friction, no faxes.' },
  { n: '03', title: 'We pack & ship', body: 'Vacuum-sealed and stamped. Within Iceland, or exported to your door.' },
]
