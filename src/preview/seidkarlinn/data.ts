/**
 * Seiðkarlinn (Faxafen 14, 108 Reykjavík) — verified content only.
 * Shopify store, 100+ SKUs: herbal "galdur" tea line, raw honey, medicinal
 * mushroom tinctures (Cordyfresh), freeze-dried fruit, skincare, supplements.
 * Names/prices confirmed on seidkarlinn.is; ownerEmail confirmed on their
 * official Facebook About page (seidkarlinn@seidkarlinn.is — no email is
 * published on-site, only a contact form). Only Kvennagaldur's ingredient
 * list was confirmed (its own product page) — the other four "galdur" teas
 * are described generically rather than inventing ingredients for them.
 * PRICES are real list prices at time of writing (sýnishorn, disclaimed in
 * the shared footer since they can drift).
 */

export const EMAIL = 'seidkarlinn@seidkarlinn.is'
export const PHONE_DISPLAY = '546 0339'
export const PHONE_HREF = 'tel:+3545460339'
export const MAPS = 'https://maps.google.com/?q=Sei%C3%B0karlinn,+Faxafen+14,+108+Reykjav%C3%ADk'
export const FACEBOOK = 'https://www.facebook.com/seidkarlinn'
export const INSTAGRAM = 'https://www.instagram.com/seidkarlinn'
export const ADDRESS = { street: 'Faxafen 14', town: '108 Reykjavík' }

/** Verified, visually-vetted Unsplash photos (contact-sheet checked — no
 *  premium_photo ids, no mismatched subjects, e.g. dropped a "frozen berries"
 *  candidate for the freeze-dried section because it read as frost/fresh,
 *  not dried). */
export const IMG = {
  hero: 'https://images.unsplash.com/photo-1545840716-c82e9eec6930', // real apothecary shopfront: amber bottles, jars, dried herbs
  jars: 'https://images.unsplash.com/photo-1696238980212-f8f562290c81', // glass jars of dried herbs on rustic wood
  bundle: 'https://images.unsplash.com/photo-1627744514030-28d5c0170fba', // dried herb bundle tied with twine
  honeycomb: 'https://images.unsplash.com/photo-1626285094816-39f688104ce0', // raw honeycomb macro
  tincture: 'https://images.unsplash.com/photo-1608571424266-edeb9bbefdec', // amber glass dropper bottle
  driedFruit: 'https://images.unsplash.com/photo-1772986833202-05c95cc1d793', // dried cranberries
  driedFruit2: 'https://images.unsplash.com/photo-1647945387141-387b88af06fd', // dried citrus + produce
  teaPour: 'https://images.unsplash.com/photo-1543668722-97d99b5825c5', // teapot pouring into cup
  shelf: 'https://images.unsplash.com/photo-1781595452212-a1db01b664ce', // jars on wooden shelving
}

/** Unsplash dynamic resize helper. */
export function u(url: string, w: number, q = 80) {
  return `${url}?w=${w}&q=${q}&auto=format&fit=crop`
}

export function isk(n: number) {
  return `${n.toLocaleString('is-IS')} kr.`
}

export const HERO = {
  eyebrow: 'Seiðkarlinn · Náttúruvörur í Reykjavík',
  headline: 'Hvað ef bætiefni væru galdrar?',
  sub: 'Hjá Seiðkarlinum eru te, hunang og sveppir blönduð í daglega siði — hráefni beint úr náttúrunni, ekkert flókið.',
  ctaPrimary: 'Finndu þinn galdur',
  ctaSecondary: 'Skoða vörur',
}

export interface GaldurTea {
  slug: string
  name: string
  price: number
  intent: string
  desc: string
  ingredients?: string[]
  brew?: string
}

/** The five real "galdur" teas, 100g kraft bags. Only Kvennagaldur's
 *  ingredients + brew instructions are confirmed (its own product page) —
 *  the rest keep honest, generic copy rather than invented botanicals. */
export const GALDUR_TEAS: GaldurTea[] = [
  {
    slug: 'kvennagaldur',
    name: 'Kvennagaldur',
    price: 2690,
    intent: 'Kvenheilsa',
    desc: 'Mild og nærandi jurtablanda, sett saman með konur í huga.',
    ingredients: ['Netla', 'Hafrastrá', 'Hindberjalauf'],
    brew: '1 tsk í bolla af heitu vatni. Látið standa 5–10 mín.',
  },
  {
    slug: 'svefngaldur',
    name: 'Svefngaldur',
    price: 2990,
    intent: 'Svefn',
    desc: 'Jurtablanda fyrir kvöldið, hluti af galdra-te línu Seiðkarlsins.',
    brew: '1 tsk í bolla af heitu vatni. Látið standa 5–10 mín.',
  },
  {
    slug: 'draumagaldur',
    name: 'Draumagaldur',
    price: 2990,
    intent: 'Draumar',
    desc: 'Jurtablanda fyrir rólega nótt, hluti af galdra-te línu Seiðkarlsins.',
    brew: '1 tsk í bolla af heitu vatni. Látið standa 5–10 mín.',
  },
  {
    slug: 'hjartagaldur',
    name: 'Hjartagaldur',
    price: 2990,
    intent: 'Hjarta og ró',
    desc: 'Jurtablanda til daglegrar notkunar, hluti af galdra-te línu Seiðkarlsins.',
    brew: '1 tsk í bolla af heitu vatni. Látið standa 5–10 mín.',
  },
  {
    slug: 'blodrugaldur',
    name: 'Blöðrugaldur',
    price: 2690,
    intent: 'Jafnvægi',
    desc: 'Jurtablanda til daglegrar notkunar, hluti af galdra-te línu Seiðkarlsins.',
    brew: '1 tsk í bolla af heitu vatni. Látið standa 5–10 mín.',
  },
]

export interface QuizOption {
  key: string
  label: string
  match: string // GaldurTea slug
}

export const QUIZ: QuizOption[] = [
  { key: 'svefn', label: 'Svefn', match: 'svefngaldur' },
  { key: 'draumar', label: 'Draumar', match: 'draumagaldur' },
  { key: 'hjarta', label: 'Hjarta og ró', match: 'hjartagaldur' },
  { key: 'konur', label: 'Kvenheilsa', match: 'kvennagaldur' },
  { key: 'jafnvaegi', label: 'Jafnvægi', match: 'blodrugaldur' },
]

export const HONEY = [
  { name: 'Hrátt Villiblóma Hunang', size: '1kg', price: 6490 },
  { name: 'Háfjallahunang', size: '1kg', price: 8490 },
  { name: 'Hrátt Rósmarin Hunang', size: '1kg', price: 6490 },
  { name: 'Appelsínu Hrátt Hunang', size: '1kg', price: 6490 },
  { name: 'Timíanblóma Hunang', size: '1kg', price: 6490 },
  { name: 'Býflugnafrjó', size: '240g', price: 3990 },
]

export const TINCTURES = [
  { name: 'Reishi 20%', size: '30ml', price: 5990 },
  { name: 'Chaga 50%', size: '30ml', price: 11990 },
  { name: 'Cordyceps 20%', size: '30ml', price: 5990 },
  { name: 'Lions Mane 20%', size: '30ml', price: 5990 },
]

export const FREEZE_DRIED = [
  { name: 'Hindber', size: '150g', price: 4410 },
  { name: 'Bláber', size: '250g', price: 6203 },
  { name: 'Mangó', size: '250g', price: 4226 },
  { name: 'Ananas', size: '250g', price: 5145 },
  { name: 'Sólber', size: '250g', price: 4410 },
  { name: 'Rifsber', size: '200g', price: 3307 },
]

export interface Chapter {
  key: string
  roman: string
  name: string
  desc: string
  count: number
  img: string
}

export const CHAPTERS: Chapter[] = [
  { key: 'te', roman: 'I', name: 'Te-galdrar', desc: 'Jurtablöndur nefndar eftir því sem þær gera.', count: GALDUR_TEAS.length, img: IMG.jars },
  { key: 'hunang', roman: 'II', name: 'Hunang & frjó', desc: 'Hrátt hunang og býflugnaafurðir.', count: HONEY.length, img: IMG.honeycomb },
  { key: 'sveppir', roman: 'III', name: 'Sveppir & rætur', desc: 'Tinktúrur unnar úr heilsusveppum.', count: TINCTURES.length, img: IMG.tincture },
  { key: 'frost', roman: 'IV', name: 'Frostþurrkað', desc: 'Ávextir og ber, þurrkuð við frost.', count: FREEZE_DRIED.length, img: IMG.driedFruit },
  { key: 'hud', roman: 'V', name: 'Húð & hár', desc: 'CBD-olíur, sjampó og handáburður.', count: 10, img: IMG.bundle },
  { key: 'faeda', roman: 'VI', name: 'Fæðubótarefni', desc: 'Glýsín, D3+K2 og astaxanthín.', count: 5, img: IMG.shelf },
]

export const STORY = {
  eyebrow: 'Um Seiðkarlinn',
  headline: 'Náttúran velur hráefnin. Við veljum bara vandlega.',
  body: 'Seiðkarlinn er ung íslensk verslun, starfrækt frá 2023, byggð á einni hugmynd: að náttúran þurfi enga viðbót til að vera góð. Hrátt hunang, lífræn fæðubótarefni, heilsusveppir og frostþurrkaðir ávextir eru valin með tilliti til hreinleika og uppruna, án óþarfa aukefna.',
}

export const STORE = {
  headline: 'Búðin í Faxafeni',
  body: 'Seiðkarlinn er líka alvöru verslun, ekki bara vefsíða. Pantanir má sækja á staðnum, og öll vörulínan er á hillunum til að skoða áður en þú kaupir.',
}

export const FACTS = [
  { big: '2023', small: 'Starfrækt frá' },
  { big: '100+', small: 'Vörur á lager' },
  { big: 'Faxafen 14', small: 'Verslun í Reykjavík' },
]

export const SHIPPING_THRESHOLD = 15000
