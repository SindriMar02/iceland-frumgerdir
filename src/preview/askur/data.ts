/**
 * Askur Pizzeria (askurpizzeria.is) - verified content only.
 * Source: askurpizzeria.is (studied 2026-07-13) — homepage, /matsedill/, /um-okkur/ + footer.
 * DESIGN-HANDOFF prototype: clones the flatbakan/eldofninn pizza-spin template but re-skinned to a
 * DARK theme to match Askur's real black/white brand (their moody dark-plate photography, their
 * monoline pictogram logo). Every "Panta" action deep-links to their real order flow.
 */

export const ORDER = 'https://askurpizzeria.is/matsedill/'
export const MENU_URL = 'https://askurpizzeria.is/matsedill/'
export const BOOK = 'https://tableagent.com/iframe/askur-pizzeria/'
export const TAPROOM = 'https://askurtaproom.is/'
export const PHONE_DISPLAY = '470 6070'
export const PHONE_HREF = 'tel:+3544706070'
export const EMAIL = 'askur@askurtaproom.com'
export const MAPS = 'https://maps.google.com/?q=Fagradalsbraut+25,+700+Egilsstaðir'

export const SOCIAL = {
  instagram: 'https://www.instagram.com/askurpizzeria/',
  facebook: 'https://www.facebook.com/askurpizzeria',
}

const A = `${import.meta.env.BASE_URL}img/askur/`
// whole/slice/sl0-7 are the SAME shared Higgsfield-cut pizza-spin asset the sibling pages use (kept
// byte-identical — "keep the 3D pizza image"). This spinning hero pizza is the ONE placeholder that
// is NOT a photo of Askur's own pizza; the outreach email must say so plainly.
// logo is Askur's OWN real monoline pictogram wordmark (white-on-transparent) — used directly, not
// replaced by an in-code silhouette (their logo is genuinely good). grid/interior are their own real
// photography; the 4 menu-card photos are individual pizzas cropped from their real overhead grid
// shot (real pizzas, sensible name pairing, same approach as Pizzasmiðjan). The fixed ambient
// backdrop is a Grainient shader (ember-glow) instead of a stock ingredients photo — the shared
// flatbakan ingredients image was colour-toned for a cream page and clashed against this dark theme.
export const IMG = {
  logo: `${A}logo.png`,
  whole: `${A}pizza-whole.webp`,
  slice: `${A}pizza-slice.webp`,
  grid: `${A}grid.webp`,
  interior: `${A}interior.webp`,
  supreme: `${A}pizza-supreme.jpg`,
  center: `${A}pizza-center.jpg`,
  mush: `${A}pizza-mush.jpg`,
  beef: `${A}pizza-beef.jpg`,
}

/** Geometry of the removed bottom slice — identical to the sibling pages, same source image. */
export const SLICE_GEO = { cx: 0.146, cy: 0.212, w: 0.291 }

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

/** Same exact solid orange the shared pizza asset is generated on — must not change (seam). */
export const HERO_ORANGE = '#F19C2C'

/**
 * Vinsælustu pizzurnar — 4 real Askur menu items + real ISK prices from their own /matsedill/.
 * Photos are individual pizzas cropped from Askur's own real overhead grid shot (real pizzas of
 * theirs; the topping match to each name is sensible, not guaranteed exact — same standard as the
 * Pizzasmiðjan cards).
 */
export const FEATURED = [
  {
    name: 'Með allt á hreinu',
    img: IMG.supreme,
    desc: 'Hreindýrahakk, sultaður rauðlaukur, Gellir ferskostur, furuhnetur og timían.',
    price: '5.550',
    best: true,
  },
  {
    name: 'Fallegi smiðurinn',
    img: IMG.center,
    desc: 'Sósa, ostur, pepperoni, piparostur, rauðlaukur og sveppir.',
    price: '3.650',
    best: true,
  },
  {
    name: 'Vor í Vaglaskógi',
    img: IMG.mush,
    desc: 'Sósa, ostur, sveppir, rauðlaukur, paprika, svartar ólífur og oregano.',
    price: '3.750',
    best: false,
  },
  {
    name: 'Stella í Orlofi',
    img: IMG.beef,
    desc: 'BBQ sósa, ostur, hakk, beikon, rauðlaukur og kjúklingur.',
    price: '4.000',
    best: false,
  },
]

/** Their real playful pizza names — the marquee strip that shows off Askur's voice. */
export const NAME_MARQUEE = [
  'Mér er drull', 'Fæ aldrei nóg af þér', 'Með allt á hreinu', 'Fimm á richter',
  'Stella í orlofi', 'Í átt að tunglinu', 'Fallegi smiðurinn', 'Vertu þú sjálfur',
  'Vor í Vaglaskógi', 'Í bláum skugga',
]

/** Landing "matseðill" quick-links — all open the real order flow */
export const MENU_LINKS = [
  { label: 'Pizzur', note: 'Eldbakað á súrdeigsbotni' },
  { label: 'Vinsælar', note: 'Það sem bærinn pantar' },
  { label: 'Sterkar', note: 'Fyrir hugrakka' },
  { label: 'Vegan', note: 'Grænt og gott' },
  { label: 'Barnamatseðill', note: 'Fyrir yngstu gestina' },
  { label: 'Drykkir', note: 'Gos, bjór og meira' },
]

export const HOURS = [
  { day: 'Alla daga', time: '11:30 - 21:00' },
  { day: 'Gleðistund á Taproom', time: '16:00 - 18:00' },
]

/** Repurposes the sibling template's second feature band for Askur Taproom (next door, same house).
 * Real content from askurpizzeria.is/um-okkur/. */
export const TAPROOM_BAND = {
  intro: 'Í sama húsi og Askur Pizzeria er Askur Taproom. Það er meira að segja gengið á milli innandyra, svo þú þarft ekki einu sinni að fara út.',
  packages: [
    {
      name: 'Á krananum',
      line: 'Bjórval frá Austra brugghúsi og Múla Craft Brew, ásamt vinsælu kokteilunum okkar.',
      rates: [{ label: 'Gleðistund', sub: 'Alla daga', price: '16-18', per: '' }],
    },
    {
      name: 'Líf og fjör',
      line: 'Tónleikar, pöbbkviss og boltinn í beinni. Og já, það er frítt wifi.',
      rates: [{ label: 'Opið', sub: 'Alla daga', price: 'til seint', per: '' }],
    },
  ],
}

export const STORY = {
  heading: 'Eldbakað á Egilsstöðum',
  body: 'Askur Pizzeria býður upp á ljúffengar eldbakaðar pizzur með súrdeigsbotni, bornar fram í afslöppuðu andrúmslofti í veitingasalnum okkar á Egilsstöðum. Verið velkomin í heimsókn og njótið máltíðarinnar með fjallasýn á veggnum og glóð í ofninum.',
}

/** Their real, distinctive differentiator — the reindeer pizza + the taproom next door. */
export const KAERLEIKS = {
  heading: 'Súrdeigsbotn',
  body: 'Hægt hefaður súrdeigsbotn, eldbakaður þar til hann er stökkur.',
}

export const AWARD = { title: 'Austurland', sub: 'Pizzur í hjarta Egilsstaða' }

export const ADDRESS = { street: 'Fagradalsbraut 25', town: '700 Egilsstaðir' }
