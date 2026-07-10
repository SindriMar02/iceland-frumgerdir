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

/** THEIR OWN assets: the boxed wordmark + real product photography, pulled
 *  from seidkarlinn.is (Shopify CDN), contact-sheet vetted, flood-filled to
 *  transparent-background WebP cutouts and self-hosted under
 *  public/seidkarlinn/ — so they sit on any ground like printed cutouts. */
const ASSET = `${import.meta.env.BASE_URL}seidkarlinn/`
export const LOGO = `${ASSET}logo-cut.png`
export function productImg(id: string) {
  return `${ASSET}${id}.webp`
}

/** Icelandic thousands separator is a period ("2.690 kr."), not a comma —
 *  formatted by hand rather than via toLocaleString('is-IS'), since some
 *  runtimes silently fall back to en-GB (comma) grouping when their ICU
 *  data doesn't include the is-IS locale. */
export function isk(n: number) {
  return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} kr.`
}

export const HERO = {
  datelineLeft: 'Stofnað 2023 · Reykjavík',
  datelineRight: 'Verð af vef Seiðkarlsins',
  headline: 'Jurtir, hunang og aðrir galdrar.',
  sub: 'Náttúruvörur, valdar vandlega og án óþarfa aukefna. Te-lína nefnd eftir göldrum, hrátt hunang, heilsusveppir og fleira, allt á einum stað í Faxafeni 14.',
  ctaPrimary: 'Skoða verðskrána',
  ctaSecondary: 'Búðin',
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
