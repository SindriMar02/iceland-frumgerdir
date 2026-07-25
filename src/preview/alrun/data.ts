/**
 * Alrún Nordic Design — recreated on the centremarsea.com system.
 *
 * Product names and prices are read from their own Shopify catalogue
 * (store.alrun.is/products.json). The twelve bindrune symbols are the brand's
 * OWN artwork, taken from alrun.is (/wp-content/uploads/2016/01/<Symbol>.png).
 * Photography is their own Shopify / site imagery.
 *
 * English-first: their store prices in USD and sells internationally. The
 * Icelandic symbol names ARE the brand's voice, so they lead everywhere.
 *
 * HONESTY GUARDRAILS (from the batch-11 brief — all respected):
 *  - The bindrunes are ORIGINAL, TRADEMARKED MODERN designs inspired by the
 *    galdrastafir tradition. NOT excavated or authenticated ancient artifacts,
 *    and no symbol is called "a thousand-year-old rune".
 *  - ONLY the twelve meanings published on their own site are used. No invented
 *    lore, no extra "rune meanings", no magical-efficacy claims. The single
 *    descriptive blurb (Skapa) is quoted verbatim from their own product page.
 *  - NO press claims. The LA Magazine / Elle / Harper's Bazaar list on alrun.is
 *    is self-reported and was NOT independently verified, so it is omitted.
 *  - NO owner names (they come from LinkedIn and a local paper, not their site).
 *  - NO "© 1999" founding year, and no replacement founding date is asserted.
 *  - Prices are shown in USD exactly as the store lists them, and labelled.
 */

const BASE = import.meta.env.BASE_URL
export const IMG = (file: string) => `${BASE}alrun/${file}`
export const SYM = (file: string) => `${BASE}alrun/symbols/${file}.png`

/* ── Contact (verified: alrun.is + store footer) ─────────────────────── */
export const EMAIL = 'info@alrun.is'
export const EMAIL_HREF = 'mailto:info@alrun.is'
export const PHONE_DISPLAY = '+354 698 1312'
export const PHONE_HREF = 'tel:+3546981312'
export const ADDRESS_1 = 'Sundaborg 1'
export const ADDRESS_2 = '104 Reykjavík, Iceland'
export const SHOP_URL = 'https://store.alrun.is'
export const INSTAGRAM = 'https://www.instagram.com/alrun.nordic.design/'
export const MAP_LINK =
  'https://www.google.com/maps/search/?api=1&query=Sundaborg%201%2C%20104%20Reykjav%C3%ADk'

/* ── Nav — Marsea's zones: links | action | menu ─────────────────────── */
export const NAV = [
  { id: 'twelve', label: 'The twelve' },
  { id: 'shop', label: 'Shop' },
  { id: 'craft', label: 'The craft' },
  { id: 'approach', label: 'Approach' },
  { id: 'contact', label: 'Contact' },
] as const

/* ── HERO — their colossal bottom-left wordmark + 3-column meta row ──── */
export const HERO = {
  word: 'ALRÚN',
  tagline: 'Twelve marks, drawn and cast in Reykjavík.',
  photo: 'studio.webp',
  photoAlt:
    'Portrait in profile with braided hair, wearing an Alrún bindrune ear piece, in black and white.',
  /* The bottom meta row, exactly their three-column device. */
  meta: ['Bindrune jewelry', 'Silver & 14K gold plate', 'Reykjavík, Iceland'] as const,
}

/* ── Their centred narrow statement + one uppercase link ─────────────── */
export const STATEMENT = {
  body: 'Twelve trademarked marks, each standing for a single word, cast in sterling silver and gold plate and woven into Icelandic wool.',
  cta: 'See the twelve',
  ctaTo: 'twelve',
}

/* ── THE TWELVE — the signature: numbered centred list + crossfading art *
 * Meanings EXACTLY as published on alrun.is. `blurb` exists only for Skapa,
 * quoted verbatim from their own product page. */
export interface Sym {
  key: string
  n: string
  is: string
  en: string
  file: string
  products: { name: string; price: string; href: string }[]
  blurb?: string
}
const P = (h: string) => `${SHOP_URL}/products/${h}`
export const SYMBOLS: Sym[] = [
  { key: 'ast', n: '01', is: 'Ást', en: 'Love', file: 'love', products: [
    { name: 'Gold Plated Pendant', price: '$189', href: P('love-ast-gold-plated-pendant') },
    { name: 'Silver Studs', price: '$89', href: P('love-ast-silver-studs') },
    { name: 'Charm Pendant', price: '$59', href: P('love-charm-pendant') } ] },
  { key: 'gaefa', n: '02', is: 'Gæfa', en: 'Luck', file: 'luck', products: [
    { name: 'Gold Plated Pendant', price: '$189', href: P('luck-gaefa-gold-plated-pendant') },
    { name: 'Silver Pendant', price: '$119', href: P('luck-gaefa-1') },
    { name: 'Stone Pendant', price: '$94', href: P('luck-gaefa') } ] },
  { key: 'viska', n: '03', is: 'Viska', en: 'Wisdom', file: 'wisdom', products: [
    { name: 'Silver Pendant', price: '$119', href: P('wisdom-viska') } ] },
  { key: 'magn', n: '04', is: 'Magn', en: 'Strength', file: 'strength', products: [
    { name: 'Gold Plated Pendant', price: '$189', href: P('strength-magn-gold-plated-pendant') },
    { name: 'Crystal Studs', price: '$56', href: P('strength-magn-crystal-studs') },
    { name: 'Bindrune Bracelet', price: '$59', href: P('strength-magn-2') } ] },
  { key: 'hjarta', n: '05', is: 'Hjarta', en: 'Heart', file: 'heart', products: [
    { name: 'Gold Plated Pendant', price: '$189', href: P('heart-hjarta-gold-plated-pendant') },
    { name: 'Silver Studs', price: '$89', href: P('heart-hjarta-silver-studs') },
    { name: 'Stone Pendant', price: '$94', href: P('hearthjarta') } ] },
  { key: 'orka', n: '06', is: 'Orka', en: 'Energy', file: 'energy', products: [
    { name: 'Gold Plated Pendant', price: '$189', href: P('energy-orka-gold-plated-pendant') },
    { name: 'Silver Pendant', price: '$119', href: P('energy-orka-1') },
    { name: 'Silver Studs', price: '$89', href: P('energy-orka-silver-studs') } ] },
  { key: 'skapa', n: '07', is: 'Skapa', en: 'Creation', file: 'creation',
    blurb: 'creativity, innovation, and a holistic worldview',
    products: [ { name: 'Silver Pendant', price: '$119', href: P('creation-skapa') } ] },
  { key: 'tonlist', n: '08', is: 'Tónlist', en: 'Music', file: 'music', products: [
    { name: 'Gold Plated Pendant', price: '$189', href: P('music-tonlist-gold-plated-pendant') },
    { name: 'Crystal Studs', price: '$89', href: P('music-tonlist-crystal-studs') },
    { name: 'Steel Dog-Tag', price: '$59', href: P('music-tonlist-steel-dog-tag') } ] },
  { key: 'aeska', n: '09', is: 'Æska', en: 'Youth', file: 'youth', products: [
    { name: 'Silver Pendant', price: '$119', href: P('youth-aeska-silver-pendant') },
    { name: 'Stone Pendant', price: '$94', href: P('youth-aeska') } ] },
  { key: 'von', n: '10', is: 'Von', en: 'Hope', file: 'hope', products: [
    { name: 'Silver Pendant', price: '$119', href: P('hope-von') } ] },
  { key: 'thokki', n: '11', is: 'Þokki', en: 'Grace', file: 'grace', products: [
    { name: 'Silver Pendant', price: '$119', href: P('grace-thokki') } ] },
  { key: 'ekta', n: '12', is: 'Ekta', en: 'Genuine', file: 'genuine', products: [
    { name: 'Silver Pendant', price: '$119', href: P('genuine-ekta-1') } ] },
]

export const TWELVE = {
  eyebrow: 'The twelve',
  /* Their "backdrop image + crossfading art" panel. */
  backdrop: 'lifestyle-2.webp',
  backdropAlt: 'Two Alrún bindrune pendants resting on dark fur.',
  cta: 'Visit the shop',
  note: 'The bindrunes are Alrún’s own trademarked designs, drawn in the tradition of Icelandic galdrastafir. They are modern marks, not excavated artifacts.',
}

/* ── SHOP — their 400x520 carousel cards ─────────────────────────────── */
export interface Piece {
  name: string; meaning: string; price: string; material: string
  img: string; alt: string; href: string
}
export const PIECES: Piece[] = [
  { name: 'Ást', meaning: 'Love', price: '$189', material: '14K gold plated pendant',
    img: 'products/gold-love.webp', href: P('love-ast-gold-plated-pendant'),
    alt: 'Gold plated Ást bindrune pendant on a chain.' },
  { name: 'Magn', meaning: 'Strength', price: '$189', material: '14K gold plated pendant',
    img: 'products/gold-strength.webp', href: P('strength-magn-gold-plated-pendant'),
    alt: 'Gold plated Magn bindrune pendant on a chain.' },
  { name: 'Hjarta', meaning: 'Heart', price: '$189', material: '14K gold plated pendant',
    img: 'products/gold-heart.webp', href: P('heart-hjarta-gold-plated-pendant'),
    alt: 'Gold plated Hjarta bindrune pendant on a chain.' },
  { name: 'Orka', meaning: 'Energy', price: '$189', material: '14K gold plated pendant',
    img: 'products/gold-energy.webp', href: P('energy-orka-gold-plated-pendant'),
    alt: 'Gold plated Orka bindrune pendant on a chain.' },
  { name: 'Gæfa', meaning: 'Luck', price: '$189', material: '14K gold plated pendant',
    img: 'products/gold-luck.webp', href: P('luck-gaefa-gold-plated-pendant'),
    alt: 'Gold plated Gæfa bindrune pendant on a chain.' },
  { name: 'Tónlist', meaning: 'Music', price: '$189', material: '14K gold plated pendant',
    img: 'products/gold-music.webp', href: P('music-tonlist-gold-plated-pendant'),
    alt: 'Gold plated Tónlist bindrune pendant on a chain.' },
  { name: 'Nordic Strength', meaning: 'Wool cape, hooded', price: '$199', material: 'Icelandic wool',
    img: 'products/cape-strength.webp', href: P('nordic-strength-wool-cape-with-hood'),
    alt: 'Icelandic wool cape with hood carrying the Strength bindrune.' },
  { name: 'Waveform', meaning: 'Wool blanket', price: '$169', material: 'Icelandic wool',
    img: 'products/blanket-waveform.webp', href: P('waveform-wool-blankets-assorted-colours'),
    alt: 'Aqua Waveform wool blanket with fringes.' },
]
export const SHOP = {
  eyebrow: 'The pieces',
  cta: 'View the full shop',
  priceNote: 'Prices as listed in Alrún’s own shop, in US dollars. Availability is confirmed at checkout.',
}

/* ── CRAFT — their centred uppercase line + scattered plates ─────────── */
export const CRAFT = {
  line: 'Drawn by hand, then cast in silver',
  scatter: [
    { file: 'symbols-detail.webp', alt: 'All twelve Alrún bindrune pendants displayed in a row with their names.' },
    { file: 'lifestyle-1.webp', alt: 'Two silver bindrune dog-tag pendants resting on driftwood.' },
    { file: 'products/studs-music.webp', alt: 'Tónlist bindrune crystal stud earrings.' },
  ],
  cta: 'The craft',
  ctaTo: 'approach',
}

/* ── APPROACH — their numbered full-panel sequence ───────────────────── */
export const APPROACH = {
  eyebrow: 'How a mark is made',
  steps: [
    { n: '1', title: 'Drawn', body: 'Each bindrune is drawn as an original mark and trademarked to the house.',
      img: 'symbols-detail.webp', alt: 'The twelve bindrune marks displayed together with their names.' },
    { n: '2', title: 'Cast', body: 'The mark is cast in .925 sterling silver, about two centimetres across.',
      img: 'lifestyle-1.webp', alt: 'Silver bindrune pendants resting on driftwood.' },
    { n: '3', title: 'Finished', body: 'Rhodium plated, or finished in 14K gold plate.',
      img: 'products/gold-love.webp', alt: 'Gold plated Ást bindrune pendant on a chain.' },
    { n: '4', title: 'Woven', body: 'The same marks carry across into Icelandic wool: capes, blankets, cushions.',
      img: 'products/cape-strength.webp', alt: 'Icelandic wool cape carrying the Strength bindrune.' },
  ],
  cta: 'About the studio',
}

/* ── FOOTER — their wine ground, uppercase column grid ───────────────── */
export const FOOTER = {
  heading: 'A question? Write to us and we will reply as soon as we can.',
  columns: [
    { label: 'Explore', links: [
      { t: 'The twelve', href: '#twelve' },
      { t: 'Shop', href: '#shop' },
      { t: 'The craft', href: '#craft' },
      { t: 'Approach', href: '#approach' },
    ] },
    { label: 'Contact', links: [
      { t: 'info@alrun.is', href: 'mailto:info@alrun.is' },
      { t: '+354 698 1312', href: 'tel:+3546981312' },
      { t: 'Instagram', href: 'https://www.instagram.com/alrun.nordic.design/' },
    ] },
    { label: 'Studio', links: [
      { t: 'Sundaborg 1', href: MAP_LINK },
      { t: '104 Reykjavík', href: MAP_LINK },
    ] },
  ],
  shopCta: 'Visit the shop',
  note: 'Orders are handled through Alrún’s own shop at store.alrun.is.',
}

/* ── SEO ─────────────────────────────────────────────────────────────── */
export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Alrún Nordic Design',
  description:
    'Original trademarked bindrune jewelry from Reykjavík: twelve symbols cast in sterling silver and 14K gold plate, and woven into Icelandic wool.',
  url: 'https://alrun.is',
  email: EMAIL,
  telephone: '+354 698 1312',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sundaborg 1',
    addressLocality: 'Reykjavík',
    postalCode: '104',
    addressCountry: 'IS',
  },
}
