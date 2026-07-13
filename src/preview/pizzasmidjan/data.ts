/**
 * Pizzasmiðjan (pizzasmidjan.is) - verified content only.
 * Source: pizzasmidjan.is (studied 2026-07-13), its real matseðill page (all prices real ISK),
 * and its Instagram bio ("Pizzastaður í hjarta Akureyrar"). DESIGN-HANDOFF prototype cloning the
 * flatbakan/eldofninn redesigns' exact template - only fonts/logo/photography/copy/prices are
 * re-skinned to this brand. Pizzasmiðjan has NO online ordering system (verified - no order/Wolt/
 * aha.is link anywhere on their site), so unlike flatbakan/eldofninn the primary CTA is a phone
 * call, not a web checkout - ORDER below is a tel: link, and MENU_URL points at their real menu
 * page for "see full menu" style links instead.
 */

export const ORDER = 'tel:+3544615858'
export const MENU_URL = 'https://www.pizzasmidjan.is/is/matsedlar'
export const PHONE_DISPLAY = '461 5858'
export const PHONE_HREF = 'tel:+3544615858'
export const EMAIL = 'pizzasmidjan@pizzasmidjan.is'
export const MAPS = 'https://maps.google.com/?q=Hafnarstræti+92,+600+Akureyri'

export const SOCIAL = {
  instagram: 'https://www.instagram.com/pizzasmidjan/',
  facebook: 'https://www.facebook.com/pizzasmidjan/',
}

const A = `${import.meta.env.BASE_URL}img/pizzasmidjan/`
// whole/slice/sl0-7/ingredientsBg are the SAME real Higgsfield-cut pizza asset flatbakan/eldofninn
// use (kept byte-identical - "keep the 3D pizza image"). This hero pizza is the ONE remaining
// placeholder on this page - it is not a photo of Pizzasmiðjan's actual pizza, so the outreach
// email must say so plainly (see the drafted email in the handoff notes). logoBadge is a free
// in-code SVG pizza slice silhouette (echoes the slice icon on Pizzasmiðjan's own dining-room wall
// art), no generation spend. All 4 menu-card photos below are now REAL photos harvested from
// pizzasmidjan.is itself (their own site's actual dish photography) - parma/vegan genuinely match
// those named dishes; pacman/spicegirls are real photos of other real pizzas from their site
// (a row of wood-fired pies, a drizzled pie with a Gull beer) rather than an exact topping match.
export const IMG = {
  logoBadge: `${A}logo-badge.svg`,
  whole: `${A}pizza-whole.webp`,
  slice: `${A}pizza-slice.webp`,
  parma: `${A}pizza-parma.jpg`,
  vegan: `${A}pizza-vegan.jpg`,
  pacman: `${A}pizza-pacman.jpg`,
  spicegirls: `${A}pizza-spicegirls.jpg`,
  ingredientsBg: `${A}fb-ingredients-bg-2.webp`,
}

/** Geometry of the removed bottom slice - identical to flatbakan/eldofninn, same source image. */
export const SLICE_GEO = { cx: 0.146, cy: 0.212, w: 0.291 }

/** The 8 slices as individual registered layers - identical to flatbakan/eldofninn, same source. */
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
 * Vinsælustu pizzurnar - 4 real menu items + real ISK prices, straight from Pizzasmiðjan's own
 * published menu. Parma and Vegan use REAL photos of these exact dishes harvested from their site.
 */
export const FEATURED = [
  {
    name: 'Spice Girls',
    img: IMG.spicegirls,
    desc: 'Pepperóní, piparostur, chillí, trönuber, gráðostur og hunang.',
    price: '4.399',
    best: true,
  },
  {
    name: 'Parma',
    img: IMG.parma,
    desc: 'Hráskinka, klettasalat, parmesan, ólífuolía og svartur pipar.',
    price: '4.399',
    best: true,
  },
  {
    name: 'Pac Man',
    img: IMG.pacman,
    desc: 'Pepperóní, sveppir, rauðlaukur og svartur pipar.',
    price: '3.999',
    best: false,
  },
  {
    name: 'Vegan',
    img: IMG.vegan,
    desc: 'Grilluð paprika, rauðlaukur, sveppir, ólífur, kryddolía og klettasalat.',
    price: '3.999',
    best: false,
  },
]

/** Landing "matseðill" quick-links - real menu categories, all open the real menu page */
export const MENU_LINKS = [
  { label: 'Pizzur', note: 'Eldbakaðar, allar stærðir' },
  { label: 'Brauðstangir', note: 'Ostafylltar smiðjustangir' },
  { label: 'Álegg', note: 'Bættu við eða breyttu' },
  { label: 'Barnamatseðill', note: 'Litlar pizzur, sama gæðin' },
  { label: 'Glútenlaus', note: 'Sami botn, engin glúten' },
]

export const HOURS = [
  { day: 'Alla daga vikunnar', time: '17:00 - 22:00' },
]

/**
 * Repurposes flatbakan/eldofninn's "Pizza Truck"/"Ítalskt kaffi" package/rate cards for
 * Pizzasmiðjan's real topping and gluten-free add-on pricing - same data shape, same rendering,
 * genuinely different (and fully real, verified) content.
 */
export const TRUCK = {
  intro: 'Allar pizzur eru bakaðar í alvöru ítölskum viðarofni og þið getið alltaf bætt við eða breytt áleggi.',
  packages: [
    {
      name: 'Auka álegg, kjöt',
      line: 'Pepperóní, hráskinka, kjúklingur, beikon, tígrisrækjur og fleira.',
      rates: [{ label: 'Á hverja pizzu', sub: '', price: '450', per: 'stk' }],
    },
    {
      name: 'Grænmeti og ávextir',
      line: 'Döðlur, ólífur, ananas, chilli og fleira.',
      rates: [{ label: 'Á hverja pizzu', sub: '', price: '350', per: 'stk' }],
    },
    {
      name: 'Glútenlaus botn',
      line: 'Sama uppskrift, glútenlaus botn í staðinn.',
      rates: [{ label: 'Aukalega', sub: '', price: '1.050', per: '' }],
    },
  ],
}

export const STORY = {
  heading: 'Nýjasta viðbótin hjá K6, síðan 2019',
  body: 'Pizzasmiðjan opnaði 12. febrúar 2019 í hjarta Akureyrar, nýjasta viðbótin hjá K6 veitingum. Allar pizzur eru bakaðar í alvöru ítölskum viðarofni og bornar fram ferskar og stökkar, kvöld eftir kvöld.',
}

/** Repurposes flatbakan/eldofninn's callout line - Pizzasmiðjan's own real Instagram self
 * description instead of an invented charity angle or open-kitchen line. */
export const KAERLEIKS = {
  heading: 'Í hjarta Akureyrar',
  body: 'Pizzastaður í hjarta Akureyrar, stutt ganga frá höfninni og miðbænum.',
}

/** Real, verifiable trust signal (being part of the K6 veitingar group with RUB23 and Bautinn)
 * instead of inventing an unverified award. */
export const AWARD = { title: 'K6 veitingar', sub: 'Systurstaðir RUB23 og Bautinn' }

export const ADDRESS = { street: 'Hafnarstræti 92', town: '600 Akureyri' }
