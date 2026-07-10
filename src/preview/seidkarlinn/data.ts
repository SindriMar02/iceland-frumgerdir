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

/** Icelandic thousands separator is a period ("2.690 kr."), not a comma —
 *  formatted by hand rather than via toLocaleString('is-IS'), since some
 *  runtimes silently fall back to en-GB (comma) grouping when their ICU
 *  data doesn't include the is-IS locale. */
export function isk(n: number) {
  return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} kr.`
}

export const HERO = {
  eyebrow: 'Seiðkarlinn · Náttúruvörur · Faxafen 14',
  headline: 'Allt sem jörðin gefur.',
  sub: 'Hrátt hunang, galdra-te, heilsusveppir og frostþurrkaðir ávextir. Vandlega valið og án óþarfa aukefna.',
  ctaPrimary: 'Skoða vörurnar',
  ctaSecondary: 'Búðin okkar',
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

/* ── Unified product catalogue ─────────────────────────────────────────────
   One list the shop grid AND the sorcerer both draw from, so a prescription
   always resolves to a real, buyable item. Names + prices are the real
   catalogue values from seidkarlinn.is (sýnishorn per the shared footer, since
   list prices drift). `blurb` is descriptive only — NO medical claims. */
export type ProductCat = 'te' | 'hunang' | 'sveppir' | 'frost' | 'hud' | 'faeda'

export interface Product {
  id: string
  name: string
  format: string
  price: number
  cat: ProductCat
  blurb: string
}

export const PRODUCTS: Product[] = [
  // Te-galdrar (the spell teas)
  { id: 'svefngaldur', name: 'Svefngaldur', format: '100g te', price: 2990, cat: 'te', blurb: 'Mild jurtablanda fyrir kvöldið, hluti af galdra-te línunni.' },
  { id: 'draumagaldur', name: 'Draumagaldur', format: '100g te', price: 2990, cat: 'te', blurb: 'Jurtablanda fyrir rólega nótt.' },
  { id: 'hjartagaldur', name: 'Hjartagaldur', format: '100g te', price: 2990, cat: 'te', blurb: 'Jurtablanda til daglegrar notkunar, til að finna ró.' },
  { id: 'kvennagaldur', name: 'Kvennagaldur', format: '100g te', price: 2690, cat: 'te', blurb: 'Netla, hafrastrá og hindberjalauf, sett saman með konur í huga.' },
  { id: 'blodrugaldur', name: 'Blöðrugaldur', format: '100g te', price: 2690, cat: 'te', blurb: 'Jurtablanda til daglegrar notkunar.' },
  // Sveppir & rætur (mushroom tinctures)
  { id: 'cordyceps', name: 'Cordyceps 20% Cordyfresh', format: '30ml dropar', price: 5990, cat: 'sveppir', blurb: 'Sveppatinktúra, dropar í drykkinn eða morgunmatinn.' },
  { id: 'lionsmane', name: 'Lions Mane 20% Cordyfresh', format: '30ml dropar', price: 5990, cat: 'sveppir', blurb: 'Tinktúra unnin úr Lions Mane sveppnum.' },
  { id: 'reishi', name: 'Reishi 20% Cordyfresh', format: '30ml dropar', price: 5990, cat: 'sveppir', blurb: 'Tinktúra unnin úr Reishi sveppnum, gjarnan tekin á kvöldin.' },
  { id: 'chaga', name: 'Chaga 50% Cordyfresh', format: '30ml dropar', price: 11990, cat: 'sveppir', blurb: 'Sterk Chaga tinktúra úr birkisveppnum.' },
  // Hunang & frjó (honey + bee products)
  { id: 'villibloma', name: 'Hrátt Villiblóma Hunang', format: '1kg', price: 6490, cat: 'hunang', blurb: 'Óunnið, hrátt villiblómahunang.' },
  { id: 'hafjalla', name: 'Háfjallahunang', format: '1kg', price: 8490, cat: 'hunang', blurb: 'Hrátt hunang af hálendinu, óunnið.' },
  { id: 'byflugnafrjo', name: 'Býflugnafrjó', format: '240g', price: 3990, cat: 'hunang', blurb: 'Frjókorn safnað af býflugum, út á skyrið eða í boostið.' },
  { id: 'propolis', name: 'Propolis Tincture', format: '30ml', price: 4100, cat: 'hunang', blurb: 'Propolis dropar úr býflugnabúinu.' },
  // Húð & hár
  { id: 'cbd-oil', name: 'CBD Skin Oil', format: '30ml', price: 9990, cat: 'hud', blurb: 'Húðolía með CBD, sativa eða indica.' },
  { id: 'batana', name: 'Batana Næring', format: 'hárnæring', price: 7990, cat: 'hud', blurb: 'Batana næring fyrir hárið.' },
  // Frostþurrkað
  { id: 'blaber', name: 'Frostþurrkuð Bláber', format: '250g', price: 6203, cat: 'frost', blurb: 'Frostþurrkuð ber til að narta í eða út á morgunmatinn.' },
  // Fæðubótarefni
  { id: 'd3k2', name: 'Ultimate D3+K2', format: 'dropar', price: 6550, cat: 'faeda', blurb: 'D-vítamín með K2, hugsað fyrir íslenska skammdegið.' },
  { id: 'glysin', name: 'Glýsín ProHealth', format: '120 hylki', price: 4590, cat: 'faeda', blurb: 'Amínósýra í hylkjum.' },
]

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}
