/**
 * Eldofninn (eldofninn.is) - verified content only.
 * Source: eldofninn.is (studied 2026-07-13) + its published English menu PDF (all prices real ISK).
 * DESIGN-HANDOFF prototype cloning the flatbakan redesign's exact template (hero pizza-spin intro,
 * layout, structure) - only fonts/logo/photography/copy/prices are re-skinned to Eldofninn's own
 * brand. Every "Panta" action deep-links to the real /panta/ order flow.
 */

export const ORDER = 'https://eldofninn.is/panta/'
export const PHONE_DISPLAY = '533 1313'
export const PHONE_HREF = 'tel:+3545331313'
export const EMAIL = 'eldofninn@eldofninn.is'
export const MAPS = 'https://maps.google.com/?q=Grímsbær+við+Bústaðaveg,+108+Reykjavík'

export const SOCIAL = {
  instagram: 'https://www.instagram.com/eldofninn/',
  facebook: 'https://www.facebook.com/PizzeriaEldofninn/',
}

const A = `${import.meta.env.BASE_URL}img/eldofninn/`
// whole/slice/sl0-7/ingredientsBg are the SAME real Higgsfield-cut pizza asset flatbakan uses (kept
// byte-identical per the brief - "keep the 3D pizza image"), just copied into this page's own asset
// folder. logoBadge is a hand-drawn flame silhouette (free, in-code SVG, no generation spend) that
// stands in for Eldofninn's real flame-in-the-"O" wordmark once run through .fb-badge's
// brightness(0)/invert(1) filter (any solid silhouette becomes the white nav icon).
export const IMG = {
  logoBadge: `${A}logo-badge.svg`,
  whole: `${A}pizza-whole.webp`,
  slice: `${A}pizza-slice.webp`,
  // PLACEHOLDER: the 4 "vinsælustu" cards below reuse this same hero photo until real dish shots
  // exist - see IMAGE-PROMPTS.md for the exact 4 shots to generate (free, Higgsfield web app,
  // Seedream 4.5, Unlimited toggle ON) and swap in.
  boltada: `${A}pizza-whole.webp`,
  dodlada: `${A}pizza-whole.webp`,
  sterka: `${A}pizza-whole.webp`,
  peppada: `${A}pizza-whole.webp`,
  ingredientsBg: `${A}fb-ingredients-bg-2.webp`,
}

/** Geometry of the removed bottom slice - identical to flatbakan, same source image. */
export const SLICE_GEO = { cx: 0.146, cy: 0.212, w: 0.291 }

/** The 8 slices as individual registered layers - identical to flatbakan, same source image. */
export const SLICES = [
  { img: `${A}pizza-sl0.webp`, ux: -0.930, uy: -0.367, traveller: false },
  { img: `${A}pizza-sl1.webp`, ux: -0.403, uy: -0.915, traveller: false },
  { img: `${A}pizza-sl2.webp`, ux: 0.375, uy: -0.927, traveller: false },
  { img: `${A}pizza-sl3.webp`, ux: 0.922, uy: -0.387, traveller: false },
  { img: `${A}pizza-sl4.webp`, ux: 0.919, uy: 0.395, traveller: false },
  { img: `${A}pizza-sl5.webp`, ux: 0.362, uy: 0.932, traveller: true },
  { img: `${A}pizza-sl6.webp`, ux: -0.356, uy: 0.934, traveller: false },
  { img: `${A}pizza-sl7.webp`, ux: -0.921, uy: 0.391, traveller: false },
]
export const TRAVELLER_VEC = { ux: 0.362, uy: 0.932 }

/** Same exact solid orange the shared pizza asset is generated on - must not change (seam). */
export const HERO_ORANGE = '#F19C2C'

/**
 * Vinsælustu bökurnar - 4 real menu items + real ISK prices, straight from Eldofninn's own
 * published menu (2023 PDF, still current per the site's order page). Toppings translated to
 * Icelandic. "Eldofninn" is literally the house's namesake pizza.
 */
export const FEATURED = [
  {
    name: 'Eldofninn',
    img: IMG.boltada,
    desc: 'Jalapeno, blandaðar ólífur, grænt piparkorn og piparostur.',
    price: '3.440',
    best: true,
  },
  {
    name: 'Pepperóní Trio',
    img: IMG.dodlada,
    desc: 'Pepperóní, sveppir og rjómaostur.',
    price: '3.700',
    best: true,
  },
  {
    name: 'Hawaii Special',
    img: IMG.sterka,
    desc: 'Skinka, sveppir og ananas.',
    price: '3.550',
    best: false,
  },
  {
    name: 'Vegetar',
    img: IMG.peppada,
    desc: 'Plómutómatar, paprika, rauðlaukur, sveppir og svartur pipar.',
    price: '3.650',
    best: false,
  },
]

/** Landing "matseðill" quick-links - all open the real order flow */
export const MENU_LINKS = [
  { label: 'Pizzur', note: '12"-13" bökur af öllum stærðum' },
  { label: 'Meðlæti', note: 'Hvítlauks- og chilibrauð' },
  { label: 'Álegg', note: 'Settu saman þína eigin' },
  { label: 'Kaffi', note: 'Italcaffé frá La Spezia' },
  { label: 'Drykkir', note: 'Gos, bjór og vín' },
  { label: 'Vín', note: 'Rautt og hvítt frá Chile' },
]

export const HOURS = [
  { day: 'Mánudaga', time: 'Lokað' },
  { day: 'Þriðjudaga til föstudaga', time: '11:30 - 21:00' },
  { day: 'Laugardaga til sunnudaga', time: '15:00 - 21:00' },
]

/** Repurposes flatbakan's "Pizza Truck" package/rate cards for Eldofninn's real Italian coffee
 * import - same data shape, same rendering, genuinely different (and true) content. Prices from
 * the same published menu PDF. */
export const TRUCK = {
  intro: 'Baunirnar koma frá Italcaffé í La Spezia á Ítalíu - sama fyrirtæki sem hefur flutt þær inn fyrir Eldofninn frá upphafi.',
  packages: [
    {
      name: 'Gran Crema',
      line: 'Rík og fyllt blanda fyrir hefðbundið ítalskt espresso.',
      rates: [{ label: '1 kg baunir', sub: 'heilar', price: '2.950', per: 'kg' }],
    },
    {
      name: 'Espresso Casa',
      line: 'Arabica- og Robusta-blanda fyrir espresso heima.',
      rates: [
        { label: '500 gr baunir', sub: 'heilar', price: '1.450', per: 'pk' },
        { label: '250 gr malað', sub: '', price: '750', per: 'pk' },
      ],
    },
  ],
}

export const STORY = {
  heading: 'Fjölskyldurekið frá 2009',
  body: 'Eldofninn opnaði laugardaginn 13. júní 2009 - fjölskyldurekinn staður með ofn fluttan beint inn frá Ítalíu. Deigið og sósan eru gerð frá grunni á hverjum degi, og eldhúsið er opið svo þú sérð pizzuna verða til frá fyrsta degi.',
}

/** Repurposes flatbakan's "Kærleikspizza" callout - Eldofninn has no equivalent charity campaign,
 * so this is their real "open kitchen" differentiator instead (from eldofninn.is/about). */
export const KAERLEIKS = {
  heading: 'Opið eldhús',
  body: 'Eldhúsið er opið svo þú sérð hverja pizzu verða til, frá deigi til ofns.',
}

/** Real trust badge shown on eldofninn.is (a TripAdvisor Certificate of Excellence) - used instead
 * of inventing an unverified award/year. */
export const AWARD = { title: 'TripAdvisor', sub: 'Certificate of Excellence' }

export const ADDRESS = { street: 'Grímsbær við Bústaðaveg', town: '108 Reykjavík' }
