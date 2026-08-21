/**
 * Reynir bakari — CUSTOM ORDER CONFIGURATOR DATA.
 *
 * Every product, size, rate and surcharge below is CONFIRMED by the owner
 * (Þorleifur, 2026-08-20). It was placeholder data until then; it is not now.
 *
 * What he confirmed, and what each thing means here:
 *   - Marsipanterta and kransakaka are 930 kr. PER PERSON. Rice Crispies turn
 *     is 555. Per-product rates are why `pricePerPerson` lives on the product
 *     rather than being one global number.
 *   - Marsipanterta sizes are his list (20, 25, 30, 40, 50, 60, 70); kransakaka
 *     runs 20 to 70 in fives; the turn runs 20 to 40. Nothing smaller than 20
 *     manna is made, which is why the size group says so rather than leaving a
 *     customer to guess.
 *   - The standard cake is marzipan base, raspberry jam, cocktail fruit and the
 *     mousse you pick. SIX fillings, and three of them change what is under the
 *     mousse: chocolate swaps pears in for the cocktail fruit, caramel swaps in
 *     daim, sherry adds crushed macaroons. That rule is the reason `composition`
 *     and `swap` exist: it is the question customers ring up to ask.
 *   - Standard decoration AND the writing are included in the rate.
 *   - Fresh strawberries +500. Photo on the cake +2300. Bespoke stays a quote.
 *   - 48 hours' notice, so leadDays is 2.
 *
 * STILL UNCONFIRMED, and both are soft fields carrying no price:
 *   1. The colour list is mine, asked as a preference rather than offered as a
 *      range. He confirmed the standard decoration is included but never gave
 *      colours.
 *   2. The OCCASIONS list further down, used only for company orders.
 *
 * Platters and pastry trays were REMOVED, not left as samples: they were my
 * assumption from the start and he has never confirmed them. If he wants them
 * orderable, they come back as their own products with real prices.
 *
 * The page renders a visible "these are sample options" notice for as long as
 * PLACEHOLDER_DATA below is true. Flip it to false only once every value here
 * has been confirmed by the client.
 */

import type { Lang } from './data'

/**
 * Drives the visible sample-data notice.
 *
 * FALSE since 2026-08-20: every product, size and price in this file came from
 * the owner. Leaving the notice up would now be its own inaccuracy, telling
 * customers that real prices are made up. Set it back to true the moment
 * anything unconfirmed is added to the catalogue.
 */
export const PLACEHOLDER_DATA = false

/**
 * Where a submitted order actually lands.
 *
 * ⚠️ TEMPORARY: pointed at Sindri's inbox while we test, NOT at the bakery.
 * On handover this becomes `pantanir@reynirbakari.is` — and the first send to
 * any new address makes FormSubmit email that address an activation link which
 * must be clicked once before anything is delivered. Do that before go-live,
 * not on the morning of it.
 *
 * FormSubmit is used rather than a backend because this is a static site: it
 * relays a form POST to an inbox, needs no server, and costs nothing. It does
 * require a browser Origin header, so it works from the site but not from curl.
 */
export const ORDER_FORM_TO = 'sindri@klubbr.is'

/**
 * Where an order is sent: OUR OWN Worker, at 04-platform/reynir-order.
 *
 * It replaced a third-party form relay that could not carry the photograph a
 * customer chose to send and would not admit it: post a file and it answers
 * {"success":"true"} while delivering the mail with nothing attached. Their
 * documentation says it in one line, files do not work with AJAX submissions,
 * and a multipart post to their other endpoint lost the photo too.
 *
 * What this endpoint gives that the relay could not:
 *   - the photo arrives, as a real attachment on the order
 *   - the answer is CHECKABLE. It returns the id of a message the mail
 *     provider accepted, and the page shows "sent" only when it has one.
 *     Every failure is a non-2xx with a reason, so nobody is told their order
 *     arrived when it did not.
 *   - it stores nothing. The photo is read, attached, dropped.
 *
 * Mail is sent from a domain we already control, with Reply-To set to the
 * customer, so reynirbakari.is and their Google Workspace mail are untouched
 * until launch.
 */
export const ORDER_ENDPOINT = 'https://reynir-order.sindri-381.workers.dev/order'

/**
 * Whether the form accepts a photo directly.
 *
 * ON. Verified end to end on 2026-08-20: message accepted, attachment listed
 * on the sent mail, delivered.
 *
 * It was off while the form posted to the old relay. If this is ever pointed
 * at anything that cannot PROVE delivery, turn it off again. An upload control
 * that silently discards what a customer gave it is worse than none: they
 * believe the bakery has their photo, and nobody finds out until the cake is
 * wrong.
 */
export const PHOTO_UPLOAD_ENABLED = true

/** Icelandic thousands grouping, done by hand. Never ICU/toLocaleString. */
export function isk(n: number): string {
  const s = Math.round(Math.abs(n)).toString()
  let out = ''
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += '.'
    out += s[i]
  }
  return `${n < 0 ? '-' : ''}${out} kr.`
}

export interface Bilingual {
  en: string
  is: string
}

/**
 * One layer of what a product is built from. Given an id rather than matched by
 * text so a choice can replace it (pears instead of cocktail fruit) without the
 * two strings having to agree, and so renaming a layer in the CMS does not
 * quietly break the swap that points at it.
 */
export interface CompositionLayer {
  id: string
  label: Bilingual
}

export interface OrderChoice {
  id: string
  label: Bilingual
  /** Added to the product base price. 0 renders as "included" rather than "+0 kr." */
  priceDelta: number
  note?: Bilingual
  /**
   * How many people this choice serves. Only meaningful on the size group of a
   * per-person product (see `pricePerPerson`), where it is what the price is
   * computed FROM: a 30-person cake is 30 x the rate, not a base plus a
   * surcharge someone has to keep in sync. Leaving it off a size choice of a
   * per-person product makes that choice unpriceable, which the CMS check
   * catches rather than letting it ship as 0 kr.
   */
  serves?: number
  /**
   * This choice cannot be priced up front, so picking it turns the whole order
   * into a quote request: the total stops showing a number, the submit button
   * changes, and the email is marked so nobody reads an estimate as a promise.
   * A bespoke cake is not the standard product and must never be quoted at the
   * standard rate.
   */
  quoteOnly?: boolean
  /**
   * Picking this choice reveals a required free-text field. Without it an
   * option like "another colour" or "photo on the cake" submits an order that
   * says only "another colour", and answering it costs a phone call, which is
   * the exact round trip this whole form exists to remove.
   */
  freeText?: { label: Bilingual; placeholder: Bilingual; maxLength: number }
  /**
   * This choice needs the customer to send us a picture. The site has nowhere
   * to put an uploaded file yet (it is static, and the order relays through an
   * email service that does not carry attachments), so instead of pretending
   * to accept one we give the order a REFERENCE and tell them to send the
   * photo quoting it. That is the difference between a photo that can be
   * matched to its order and a stray image in an inbox.
   *
   * When the order Worker lands, this same flag is what turns into a real
   * uploader; nothing else about the flow has to change.
   */
  needsPhoto?: boolean
  /**
   * Layers this choice puts ON TOP of the standard build, e.g. the mousse a
   * filling is named for. This is what makes the spec panel live: choosing a
   * filling visibly changes what is in the cake instead of being a word on a
   * list.
   */
  adds?: Bilingual[]
  /**
   * Replaces one standard layer. The bakery's own rule, straight from the
   * owner: a chocolate cake comes with pears instead of the cocktail fruit,
   * caramel with daim. Customers ask this constantly, so showing it beats
   * answering it.
   */
  swap?: { layerId: string; label: Bilingual }
}

export interface OrderGroup {
  id: string
  /** single = radio (pick one), multi = checkbox (pick several) */
  kind: 'single' | 'multi'
  label: Bilingual
  help?: Bilingual
  required?: boolean
  /** multi only: cap on how many can be picked. Omitted = no cap. */
  max?: number
  /**
   * How the choices are laid out.
   *
   * 'grid' packs short labels into compact tiles: good for a handful of short
   * options like colours.
   *
   * 'select' collapses the group to ONE row. A kransakaka has eleven sizes,
   * and neither eleven stacked rows nor eleven tiles is something anyone wants
   * to read on the way to the rest of the form. The usual objection to a
   * dropdown is that it hides the prices, so this layout answers it: the price
   * of the chosen size is rendered beside the control at display size, the
   * per-person rate sits under it, and every option carries its own price in
   * the open list. Picking a size is one tap, and on a phone it is the OS
   * wheel picker rather than a scroll through a wall of cards.
   *
   * Neither grid nor select suits a choice with a note or a field of its own;
   * those belong in the default list.
   */
  layout?: 'list' | 'grid' | 'select'
  choices: OrderChoice[]
}

/**
 * The chosen size on a per-person product, i.e. the choice its price is
 * computed from. Returns null for a product priced by the tray, or before a
 * size has been picked.
 */
export function sizeChoiceOf(
  product: OrderProduct,
  picked: Record<string, string[]>,
): OrderChoice | null {
  if (!product.pricePerPerson || !product.sizeGroupId) return null
  const group = product.groups.find((g) => g.id === product.sizeGroupId)
  if (!group) return null
  const id = (picked[group.id] ?? [])[0]
  const choice = group.choices.find((c) => c.id === id)
  return choice && typeof choice.serves === 'number' ? choice : null
}

/**
 * True when the configuration cannot carry a firm price, because a quote-only
 * choice (a bespoke cake) is selected. The total then renders as a quote
 * request rather than a number, everywhere: on screen, on the slip and in the
 * email the bakery receives.
 */
export function isQuoteRequest(
  product: OrderProduct,
  picked: Record<string, string[]>,
): boolean {
  return product.groups.some((g) =>
    (picked[g.id] ?? []).some((id) => g.choices.find((c) => c.id === id)?.quoteOnly),
  )
}

/**
 * What the configured product is actually made of, top layer first, with every
 * choice applied: mousses added on top, and any layer a choice replaces already
 * substituted. `changed` marks a layer that is not the standard build, so the
 * page can show WHY it differs rather than silently rendering a different list.
 */
export function compositionOf(
  product: OrderProduct,
  picked: Record<string, string[]>,
): { label: Bilingual; changed: boolean }[] {
  if (!product.composition) return []
  /* Nothing to describe until the recipe is complete. The standard layers on
   * their own are three of five, and listing them under "what is in it" before
   * a filling is chosen describes a cake nobody is ordering. */
  if (product.compositionGroupId && !(picked[product.compositionGroupId] ?? []).length) return []
  const added: Bilingual[] = []
  const swaps = new Map<string, Bilingual>()
  for (const group of product.groups) {
    for (const id of picked[group.id] ?? []) {
      const choice = group.choices.find((c) => c.id === id)
      if (!choice) continue
      if (choice.adds) added.push(...choice.adds)
      if (choice.swap) swaps.set(choice.swap.layerId, choice.swap.label)
    }
  }
  return [
    ...added.map((label) => ({ label, changed: true })),
    ...product.composition.map((layer) => {
      const swapped = swaps.get(layer.id)
      return { label: swapped ?? layer.label, changed: !!swapped }
    }),
  ]
}

/** True when any picked choice expects the customer to send a picture. */
export function needsPhoto(
  product: OrderProduct,
  picked: Record<string, string[]>,
): boolean {
  return product.groups.some((g) =>
    (picked[g.id] ?? []).some((id) => g.choices.find((c) => c.id === id)?.needsPhoto),
  )
}

/**
 * Every picked choice that opened a free-text field, paired with its group, so
 * the form can validate them and the email can print them beside the option
 * they belong to.
 */
export function freeTextChoices(
  product: OrderProduct,
  picked: Record<string, string[]>,
): { group: OrderGroup; choice: OrderChoice }[] {
  const out: { group: OrderGroup; choice: OrderChoice }[] = []
  for (const group of product.groups) {
    for (const id of picked[group.id] ?? []) {
      const choice = group.choices.find((c) => c.id === id)
      if (choice?.freeText) out.push({ group, choice })
    }
  }
  return out
}

export interface OrderProduct {
  id: string
  name: Bilingual
  blurb: Bilingual
  /**
   * Flat starting price, used only when `pricePerPerson` is not set. Products
   * sold by the tray (platters, pastry boxes) work this way.
   */
  basePrice: number
  /**
   * Per-person rate, in kronur. When set, this product is priced by headcount:
   * the customer picks how many people the cake is for and the price is that
   * many times this number. `basePrice` is then ignored entirely.
   *
   * This is the owner's own model (Thorleifur, 2026-08-20: 930 kr. per person
   * for a marsipanterta, sizes 20 to 70). It is better than a price table in
   * two ways that matter after handover: the customer picks the only thing
   * they actually know, which is how many people are coming, and the owner
   * maintains ONE number per cake instead of seven that can drift apart.
   */
  pricePerPerson?: number
  /** Which group carries the `serves` counts. Required when pricePerPerson is set. */
  sizeGroupId?: string
  /**
   * What the product is built from, TOP LAYER FIRST, shown as a spec that
   * updates as options are chosen. A marsipanterta is not one thing: what is
   * inside it changes with the filling, and the customer cannot see that from
   * a list of six flavour names.
   */
  composition?: CompositionLayer[]
  /**
   * Which group's choices complete the recipe. Until something in this group is
   * picked there is no whole product to describe, only a half cake, so the
   * summary stays hidden rather than listing three of five layers.
   */
  compositionGroupId?: string
  /** Square product photo. OPTIONAL on purpose: a product the owner adds in
   *  the CMS before uploading a picture must still render a correct card, so
   *  every card treats the image as an enhancement, never as structure. */
  image?: string
  /** Minimum days of notice. Drives the earliest selectable pickup date. */
  leadDays: number
  /** Free-text line piped onto the product, e.g. writing on a cake. */
  inscription?: { label: Bilingual; placeholder: Bilingual; maxLength: number }
  groups: OrderGroup[]
}

/** PLACEHOLDER catalogue. See the header block before changing anything here. */
export const ORDER_PRODUCTS: OrderProduct[] = [
  {
    id: 'marsipanterta',
    name: { en: 'Marzipan cake', is: 'Marsipanterta' },
    blurb: {
      en: 'Marzipan base, raspberry jam and cocktail fruit, with the mousse of your choosing. Priced per person, from 20 upwards.',
      is: 'Marsipanbotn, hindberjasulta og kokteilávextir, með þeim frómas sem þið veljið. Verðlögð á mann, frá 20 manns.',
    },
    basePrice: 0,
    pricePerPerson: 930,
    sizeGroupId: 'staerd',
    compositionGroupId: 'fylling',
    /* Top layer first. The mousse is not here: it comes from the filling, which
       is the whole reason this panel is worth rendering. */
    composition: [
      { id: 'avextir', label: { en: 'Cocktail fruit', is: 'Kokteilávextir' } },
      { id: 'sulta', label: { en: 'Raspberry jam', is: 'Hindberjasulta' } },
      { id: 'botn', label: { en: 'Marzipan base', is: 'Marsipanbotn' } },
    ],
    image: `${import.meta.env.BASE_URL}reynir/order/marsipanterta.webp`,
    /* 48 hours (owner, 2026-08-20). */
    leadDays: 2,
    inscription: {
      label: { en: 'Writing on the cake', is: 'Texti á tertuna' },
      placeholder: {
        en: 'For example: Til hamingju með 50 ára afmælið',
        is: 'Til dæmis: Til hamingju með 50 ára afmælið',
      },
      maxLength: 60,
    },
    groups: [
      {
        id: 'staerd',
        kind: 'single',
        label: { en: 'How many is the cake for?', is: 'Fyrir hvað marga á tertan að vera?' },
        layout: 'select',
        help: {
          en: '930 kr. per person. The smallest marzipan cake we make is for 20.',
          is: '930 kr. á mann. Minnsta marsipantertan sem við gerum er 20 manna.',
        },
        required: true,
        choices: [
          { id: 's20', label: { en: 'Serves 20', is: '20 manna' }, priceDelta: 0, serves: 20 },
          { id: 's25', label: { en: 'Serves 25', is: '25 manna' }, priceDelta: 0, serves: 25 },
          { id: 's30', label: { en: 'Serves 30', is: '30 manna' }, priceDelta: 0, serves: 30 },
          { id: 's40', label: { en: 'Serves 40', is: '40 manna' }, priceDelta: 0, serves: 40 },
          { id: 's50', label: { en: 'Serves 50', is: '50 manna' }, priceDelta: 0, serves: 50 },
          { id: 's60', label: { en: 'Serves 60', is: '60 manna' }, priceDelta: 0, serves: 60 },
          { id: 's70', label: { en: 'Serves 70', is: '70 manna' }, priceDelta: 0, serves: 70 },
        ],
      },
      {
        id: 'fylling',
        kind: 'single',
        label: { en: 'Filling', is: 'Fylling' },
        help: {
          en: 'The mousse the cake is built around. Some fillings change what sits under it.',
          is: 'Frómasinn sem tertan er byggð í kringum. Sumar fyllingar breyta því sem liggur undir honum.',
        },
        required: true,
        choices: [
          {
            id: 'jardarberja',
            label: { en: 'Strawberry', is: 'Jarðarberja' },
            priceDelta: 0,
            note: { en: 'Our most popular', is: 'Vinsælasta fyllingin' },
            adds: [{ en: 'Strawberry mousse', is: 'Jarðarberjafrómas' }],
          },
          {
            id: 'sukkuladi',
            label: { en: 'Chocolate', is: 'Súkkulaði' },
            priceDelta: 0,
            note: { en: 'Pears instead of the cocktail fruit', is: 'Perur í stað kokteilávaxta' },
            adds: [{ en: 'Chocolate mousse', is: 'Súkkulaðifrómas' }],
            swap: { layerId: 'avextir', label: { en: 'Pears', is: 'Perur' } },
          },
          {
            id: 'karamellu',
            label: { en: 'Caramel', is: 'Karamellu' },
            priceDelta: 0,
            note: { en: 'Daim instead of the cocktail fruit', is: 'Daim í stað kokteilávaxta' },
            adds: [{ en: 'Caramel mousse', is: 'Karamellufrómas' }],
            swap: { layerId: 'avextir', label: { en: 'Daim', is: 'Daim' } },
          },
          {
            id: 'vanillu',
            label: { en: 'Vanilla', is: 'Vanillu' },
            priceDelta: 0,
            adds: [{ en: 'Vanilla mousse', is: 'Vanillufrómas' }],
          },
          {
            id: 'sherry',
            label: { en: 'Sherry', is: 'Sherry' },
            priceDelta: 0,
            note: { en: 'With crushed macaroons as well', is: 'Muldar makkarónur fylgja með' },
            adds: [
              { en: 'Sherry mousse', is: 'Sherrýfrómas' },
              { en: 'Crushed macaroons', is: 'Muldar makkarónur' },
            ],
          },
          {
            id: 'astaraldin',
            label: { en: 'Passion fruit', is: 'Ástaraldin' },
            priceDelta: 0,
            adds: [{ en: 'Passion fruit mousse', is: 'Ástaraldinsfrómas' }],
          },
        ],
      },
      {
        id: 'vidbot',
        kind: 'multi',
        label: { en: 'Add to it', is: 'Bæta við' },
        choices: [
          {
            id: 'ektajardarber',
            label: { en: 'Fresh strawberries', is: 'Ekta jarðarber' },
            priceDelta: 500,
            adds: [{ en: 'Fresh strawberries', is: 'Ekta jarðarber' }],
          },
        ],
      },
      {
        id: 'utlit',
        kind: 'single',
        label: { en: 'Look and occasion', is: 'Útlit og tilefni' },
        help: {
          en: 'The standard decoration and the writing are both included in the price.',
          is: 'Hefðbundin skreyting og texti á tertuna eru innifalin í verðinu.',
        },
        required: true,
        choices: [
          { id: 'hefd', label: { en: 'Classic marzipan cake', is: 'Hefðbundin marsipanterta' }, priceDelta: 0 },
          { id: 'afmaeli', label: { en: 'Birthday', is: 'Afmæli' }, priceDelta: 0 },
          { id: 'barnaafmaeli', label: { en: "Child's birthday", is: 'Barnaafmæli' }, priceDelta: 0 },
          { id: 'ferming', label: { en: 'Confirmation or christening', is: 'Ferming eða skírn' }, priceDelta: 0 },
          {
            id: 'mynd',
            label: { en: 'Photo on the cake', is: 'Mynd á tertu' },
            priceDelta: 2300,
            needsPhoto: true,
            freeText: {
              label: { en: 'What should the photo be of?', is: 'Hvaða mynd á að fara á tertuna?' },
              placeholder: {
                en: 'For example a photo of the birthday girl. We send you where to email it.',
                is: 'Til dæmis mynd af afmælisbarninu. Við sendum þér netfangið til að senda hana á.',
              },
              maxLength: 140,
            },
          },
          {
            id: 'serhonnun',
            label: { en: 'Bespoke design', is: 'Sérhönnun' },
            priceDelta: 0,
            quoteOnly: true,
            needsPhoto: true,
            freeText: {
              label: { en: 'Describe what you have in mind', is: 'Lýstu tertunni sem þú hefur í huga' },
              placeholder: {
                en: 'Shape, colours, theme, or a cake you would like us to work from.',
                is: 'Form, litir, þema, eða terta sem þið viljið að við vinnum út frá.',
              },
              maxLength: 240,
            },
          },
        ],
      },
      {
        /* A PREFERENCE, not a product spec: the owner confirmed the standard
           decoration is included but never gave a colour list, so this asks
           rather than promises, and carries no price. */
        id: 'litur',
        kind: 'single',
        label: { en: 'Colour, if you have a preference', is: 'Litur, ef þið hafið ósk' },
        layout: 'grid',
        required: false,
        choices: [
          { id: 'hvit', label: { en: 'White', is: 'Hvít' }, priceDelta: 0 },
          { id: 'bleik', label: { en: 'Pink', is: 'Bleik' }, priceDelta: 0 },
          { id: 'bla', label: { en: 'Blue', is: 'Blá' }, priceDelta: 0 },
          { id: 'graen', label: { en: 'Green', is: 'Græn' }, priceDelta: 0 },
          {
            id: 'annar',
            label: { en: 'Another colour', is: 'Annar litur' },
            priceDelta: 0,
            freeText: {
              label: { en: 'Which colour?', is: 'Hvaða litur?' },
              placeholder: { en: 'For example lavender or gold.', is: 'Til dæmis lavender eða gyllt.' },
              maxLength: 40,
            },
          },
        ],
      },
      {
        id: 'ofnaemi',
        kind: 'multi',
        label: { en: 'Allergies to work around', is: 'Ofnæmi sem þarf að taka tillit til' },
        help: {
          en: 'Tell us here and we will confirm what is possible when we call.',
          is: 'Látið vita hér og við staðfestum hvað er mögulegt þegar við hringjum.',
        },
        choices: [
          { id: 'hnetur', label: { en: 'Nuts', is: 'Hnetur' }, priceDelta: 0 },
          { id: 'gluten', label: { en: 'Gluten', is: 'Glúten' }, priceDelta: 0 },
          { id: 'laktosi', label: { en: 'Lactose', is: 'Laktósi' }, priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'kransakaka',
    name: { en: 'Kransakaka', is: 'Kransakaka' },
    blurb: {
      en: 'The traditional ring cake, built to the size of the gathering. Priced per person, in steps of five.',
      is: 'Hefðbundin kransakaka, byggð eftir stærð hópsins. Verðlögð á mann, í fimm manna þrepum.',
    },
    basePrice: 0,
    pricePerPerson: 930,
    sizeGroupId: 'staerd',
    image: `${import.meta.env.BASE_URL}reynir/order/kransakaka.webp`,
    leadDays: 2,
    groups: [
      {
        id: 'staerd',
        kind: 'single',
        label: { en: 'How many is it for?', is: 'Fyrir hvað marga á hún að vera?' },
        help: { en: '930 kr. per person.', is: '930 kr. á mann.' },
        layout: 'select',
        required: true,
        choices: [
          { id: 's20', label: { en: 'Serves 20', is: '20 manna' }, priceDelta: 0, serves: 20 },
          { id: 's25', label: { en: 'Serves 25', is: '25 manna' }, priceDelta: 0, serves: 25 },
          { id: 's30', label: { en: 'Serves 30', is: '30 manna' }, priceDelta: 0, serves: 30 },
          { id: 's35', label: { en: 'Serves 35', is: '35 manna' }, priceDelta: 0, serves: 35 },
          { id: 's40', label: { en: 'Serves 40', is: '40 manna' }, priceDelta: 0, serves: 40 },
          { id: 's45', label: { en: 'Serves 45', is: '45 manna' }, priceDelta: 0, serves: 45 },
          { id: 's50', label: { en: 'Serves 50', is: '50 manna' }, priceDelta: 0, serves: 50 },
          { id: 's55', label: { en: 'Serves 55', is: '55 manna' }, priceDelta: 0, serves: 55 },
          { id: 's60', label: { en: 'Serves 60', is: '60 manna' }, priceDelta: 0, serves: 60 },
          { id: 's65', label: { en: 'Serves 65', is: '65 manna' }, priceDelta: 0, serves: 65 },
          { id: 's70', label: { en: 'Serves 70', is: '70 manna' }, priceDelta: 0, serves: 70 },
        ],
      },
      {
        id: 'ofnaemi',
        kind: 'multi',
        label: { en: 'Allergies to work around', is: 'Ofnæmi sem þarf að taka tillit til' },
        help: {
          en: 'Tell us here and we will confirm what is possible when we call.',
          is: 'Látið vita hér og við staðfestum hvað er mögulegt þegar við hringjum.',
        },
        choices: [
          { id: 'hnetur', label: { en: 'Nuts', is: 'Hnetur' }, priceDelta: 0 },
          { id: 'gluten', label: { en: 'Gluten', is: 'Glúten' }, priceDelta: 0 },
          { id: 'laktosi', label: { en: 'Lactose', is: 'Laktósi' }, priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'ricecrispies',
    name: { en: 'Rice Krispies tower', is: 'Rice Crispies turn' },
    blurb: {
      en: 'A tower for the children, and for everyone who says it is for the children. From 20 up to 40.',
      is: 'Turn fyrir börnin, og fyrir alla hina sem segjast vera að panta fyrir börnin. Frá 20 upp í 40 manns.',
    },
    basePrice: 0,
    pricePerPerson: 555,
    sizeGroupId: 'staerd',
    image: `${import.meta.env.BASE_URL}reynir/order/ricecrispies.webp`,
    leadDays: 2,
    groups: [
      {
        id: 'staerd',
        kind: 'single',
        label: { en: 'How many is it for?', is: 'Fyrir hvað marga á hann að vera?' },
        layout: 'select',
        help: { en: '555 kr. per person, up to 40 people.', is: '555 kr. á mann, mest 40 manna.' },
        required: true,
        choices: [
          { id: 's20', label: { en: 'Serves 20', is: '20 manna' }, priceDelta: 0, serves: 20 },
          { id: 's25', label: { en: 'Serves 25', is: '25 manna' }, priceDelta: 0, serves: 25 },
          { id: 's30', label: { en: 'Serves 30', is: '30 manna' }, priceDelta: 0, serves: 30 },
          { id: 's35', label: { en: 'Serves 35', is: '35 manna' }, priceDelta: 0, serves: 35 },
          { id: 's40', label: { en: 'Serves 40', is: '40 manna' }, priceDelta: 0, serves: 40 },
        ],
      },
      {
        id: 'ofnaemi',
        kind: 'multi',
        label: { en: 'Allergies to work around', is: 'Ofnæmi sem þarf að taka tillit til' },
        help: {
          en: 'Tell us here and we will confirm what is possible when we call.',
          is: 'Látið vita hér og við staðfestum hvað er mögulegt þegar við hringjum.',
        },
        choices: [
          { id: 'hnetur', label: { en: 'Nuts', is: 'Hnetur' }, priceDelta: 0 },
          { id: 'gluten', label: { en: 'Gluten', is: 'Glúten' }, priceDelta: 0 },
          { id: 'laktosi', label: { en: 'Lactose', is: 'Laktósi' }, priceDelta: 0 },
        ],
      },
    ],
  },
]

/** Occasions a company might be ordering for. PLACEHOLDER: confirm the list with the owner. */
export const OCCASIONS: { id: string; label: Bilingual }[] = [
  { id: 'fundur', label: { en: 'Meeting', is: 'Fundur' } },
  { id: 'radstefna', label: { en: 'Conference', is: 'Ráðstefna' } },
  { id: 'arshatid', label: { en: 'Staff party', is: 'Árshátíð eða starfsmannahittingur' } },
  { id: 'afmaeli', label: { en: 'Anniversary', is: 'Afmæli' } },
  { id: 'opnun', label: { en: 'Opening or launch', is: 'Opnun eða kynning' } },
  { id: 'erfidrykkja', label: { en: 'Funeral reception', is: 'Erfidrykkja' } },
  { id: 'annad', label: { en: 'Something else', is: 'Annað' } },
]

/** Real, not placeholder. ONE location: the Hamraborg 14 shop closed around
 *  2024 (owner, 2026-08-16), so it is not a collection point. The form renders
 *  a single location as plain text rather than a one-option dropdown, so this
 *  list staying at one entry is not a UI problem — and adding a second back
 *  (or a third) turns the field into a select again on its own. */
export const PICKUP_LOCATIONS: { id: string; label: Bilingual }[] = [
  { id: 'dalvegur', label: { en: 'Dalvegur 4, Kópavogur', is: 'Dalvegur 4, Kópavogi' } },
]

export interface OrderCopy {
  navOrder: string
  kicker: string
  title: string
  intro: string
  sampleNotice: string
  stepWho: string
  whoPerson: string
  whoCompany: string
  whoPersonHint: string
  whoCompanyHint: string
  stepProduct: string
  stepOptions: string
  stepDetails: string
  fieldQty: string
  fieldQtyHint: string
  fieldCompany: string
  fieldKennitala: string
  fieldKennitalaHint: string
  fieldContact: string
  fieldInvoiceEmail: string
  fieldInvoiceEmailHint: string
  fieldOccasion: string
  fieldGuests: string
  fieldGuestsHint: string
  fieldHandover: string
  handoverPickup: string
  handoverDelivery: string
  fieldAddress: string
  fieldAddressHint: string
  errCompany: string
  errKennitala: string
  errKennitalaFormat: string
  errContact: string
  errAddress: string
  bigOrderNote: string
  slipQty: (n: number) => string
  /** Homepage teaser only. */
  teaseCta: string
  teaseNote: string
  backToSite: string
  slipTitle: string
  slipEmpty: string
  slipBase: string
  slipTotal: string
  slipNote: string
  /** "930 kr. á mann", the rate shown beside a per-person product's size. */
  perPerson: string
  /** Heading over the live spec panel. */
  specTitle: string
  /** The empty option at the top of a size dropdown. */
  sizePrompt: string
  /** Stands in for the price line before a size has been picked, so an
   *  unconfigured per-person cake never renders as 0 kr. */
  slipPickSize: string
  /** Shown in place of the total when a quote-only choice is selected. */
  quoteTotal: string
  quoteNote: string
  /** Submit button copy when the order is a quote request, not a priced order. */
  submitQuote: string
  /** Order reference, shown on the done screen and carried in the email
   *  subject so a photo sent afterwards can be matched to its order. */
  refLabel: string
  /** How to send a photo, shown only when the order needs one and none was
   *  attached. */
  photoHow: (ref: string) => string
  photoLabel: string
  photoCta: string
  photoHint: string
  photoRemove: string
  /** Confirmation that the picture travelled with the order. */
  photoSent: string
  errPhotoType: string
  errPhotoSize: string
  included: string
  required: string
  optional: string
  chooseUpTo: (n: number) => string
  fieldName: string
  fieldPhone: string
  fieldEmail: string
  fieldEmailHelp: string
  fieldDate: string
  fieldDateHelp: (n: number) => string
  fieldTime: string
  fieldTimePlaceholder: string
  fieldTimeHelp: string
  fieldLocation: string
  fieldNotes: string
  fieldNotesPlaceholder: string
  errRequiredGroup: string
  errRequiredMulti: string
  errFreeText: string
  errName: string
  errPhone: string
  errPhoneFormat: string
  errEmail: string
  errDate: string
  errTime: string
  errDateTooSoon: (d: string) => string
  errSummary: string
  submit: string
  submitting: string
  doneTitle: string
  doneBody: string
  /** Only shown while PLACEHOLDER_DATA is true: the order really sends now,
   *  but the catalogue it was placed against is still sample data. */
  /** "We call during opening hours, every day 7:00 to 17:00." The hours come
   *  from the CMS so this sentence cannot drift from the printed ones. */
  doneWhen: (hours: string) => string
  /** Used when the week is not one single schedule, so no short hours phrase
   *  exists to name. */
  doneWhenGeneric: string
  /** Ends without punctuation: the phone number follows as a tel: link. */
  doneReach: string
  doneAgain: string
  charsLeft: (n: number) => string
}

/** UI copy for the configurator, kept beside its data so the whole flow reviews as one file. */
export const ORDER_T: Record<Lang, OrderCopy> = {
  en: {
    navOrder: 'Order',
    kicker: 'Order ahead',
    title: 'Build your order.',
    intro:
      'Choose what you would like and we will confirm it by phone. Nothing is charged online, you pay when you collect.',
    sampleNotice:
      'Sample options. The real range, prices and lead times are set by the bakery.',
    stepWho: 'Who is ordering?',
    whoPerson: 'For myself',
    whoCompany: 'Company or event',
    whoPersonHint: 'A single order to collect yourself.',
    whoCompanyHint: 'Invoiced to a kennitala, with delivery if you need it.',
    stepProduct: 'What are we baking?',
    stepOptions: 'Make it yours',
    stepDetails: 'Your details',
    fieldQty: 'How many?',
    fieldQtyHint: 'The same order, this many times over.',
    fieldCompany: 'Company',
    fieldKennitala: 'Kennitala',
    fieldKennitalaHint: 'So we can invoice you.',
    fieldContact: 'Contact person',
    fieldInvoiceEmail: 'Email for the invoice',
    fieldInvoiceEmailHint: 'Leave empty to use the address above.',
    fieldOccasion: 'Occasion',
    fieldGuests: 'Roughly how many people',
    fieldGuestsHint: 'Helps us get the quantity right.',
    fieldHandover: 'Collection or delivery',
    handoverPickup: 'We collect it',
    handoverDelivery: 'Deliver it to us',
    fieldAddress: 'Delivery address',
    fieldAddressHint: 'Street, floor and anything we need to find you.',
    errCompany: 'We need the company name for the invoice.',
    errKennitala: 'We need a kennitala to invoice a company.',
    errKennitalaFormat: 'An Icelandic kennitala is ten digits.',
    errContact: 'We need a name to ask for.',
    errAddress: 'We need somewhere to deliver to.',
    bigOrderNote:
      'Ordering for a bigger event? Tell us the numbers below and we will quote it when we call.',
    slipQty: (n: number) => `${n} of these`,
    teaseCta: 'Start an order',
    teaseNote: 'Takes a minute. We confirm by phone and you pay when you collect.',
    backToSite: 'Back to the bakery',
    slipTitle: 'Your order',
    slipEmpty: 'Your choices will appear here as you make them.',
    slipBase: 'Base price',
    slipTotal: 'Estimated total',
    slipNote: 'We confirm the final price when we call.',
    perPerson: 'per person',
    specTitle: 'What is in it',
    sizePrompt: 'Choose a size',
    slipPickSize: 'Choose a size',
    quoteTotal: 'We will quote you',
    quoteNote:
      'A bespoke cake is priced on what it takes to make, so we send you a price before anything is baked.',
    submitQuote: 'Send enquiry',
    refLabel: 'Order reference',
    photoLabel: 'Send the photo with the order',
    photoCta: 'Choose a photo',
    photoHint: 'JPG or PNG, up to 5 MB. You can also send it later if it is easier.',
    photoRemove: 'Remove',
    photoSent: 'Your photo came with it.',
    errPhotoType: 'That file is not an image. Choose a JPG or a PNG.',
    errPhotoSize: 'That photo is over 5 MB. Choose a smaller one, or send it to us afterwards.',
    photoHow: (ref) =>
      `Send us the photo with ${ref} in the subject line and we will match it to your order.`,
    included: 'included',
    required: 'required',
    optional: 'optional',
    chooseUpTo: (n: number) => `Choose up to ${n}`,
    fieldName: 'Name',
    fieldPhone: 'Phone',
    fieldEmail: 'Email',
    fieldEmailHelp: 'Optional, in case we cannot reach you by phone.',
    fieldDate: 'Collection date',
    fieldDateHelp: (n: number) => `We need at least ${n} days notice for this.`,
    fieldTime: 'Collection time',
    fieldTimePlaceholder: 'Choose a time',
    fieldTimeHelp: 'We are open 07:00 to 17:00 every day.',
    fieldLocation: 'Collect from',
    fieldNotes: 'Anything else we should know',
    fieldNotesPlaceholder: 'Occasion, colours, timing, anything at all.',
    errRequiredGroup: 'Pick one to carry on.',
    errRequiredMulti: 'Pick at least one to carry on.',
    errFreeText: 'Fill this in so we do not have to call and ask.',
    errName: 'We need a name for the order.',
    errPhone: 'We need a phone number so we can confirm.',
    errPhoneFormat: 'That does not look like a phone number we can call.',
    errEmail: 'That email address is missing an @.',
    errDate: 'Choose a collection date.',
    errTime: 'Choose a collection time.',
    errDateTooSoon: (d: string) => `The earliest we can manage is ${d}.`,
    errSummary: 'A few things still need filling in.',
    submit: 'Send the order request',
    submitting: 'Sending',
    doneTitle: 'Request sent.',
    doneBody:
      'We will call to confirm the details and the final price. Nothing is charged until you collect.',
    doneWhen: (hours: string) => `We call during opening hours, ${hours}.`,
    doneWhenGeneric: 'We call during the bakery opening hours.',
    doneReach: 'Questions or changes:',
    doneAgain: 'Start another order',
    charsLeft: (n: number) => `${n} characters left`,
  },
  is: {
    navOrder: 'Panta',
    kicker: 'Pantað fyrirfram',
    title: 'Settu saman pöntun.',
    intro:
      'Veldu það sem þú vilt og við staðfestum símleiðis. Ekkert er greitt á netinu, greitt er þegar sótt er.',
    sampleNotice:
      'Sýnishorn af valmöguleikum. Bakaríið ákveður raunverulegt úrval, verð og afgreiðslutíma.',
    stepWho: 'Hver er að panta?',
    whoPerson: 'Fyrir mig',
    whoCompany: 'Fyrirtæki eða viðburður',
    whoPersonHint: 'Ein pöntun sem þú sækir sjálf eða sjálfur.',
    whoCompanyHint: 'Reikningur á kennitölu, með sendingu ef þið þurfið.',
    stepProduct: 'Hvað eigum við að baka?',
    stepOptions: 'Sníddu að þér',
    stepDetails: 'Upplýsingar um þig',
    fieldQty: 'Hversu mörg?',
    fieldQtyHint: 'Sama pöntun, svona oft.',
    fieldCompany: 'Fyrirtæki',
    fieldKennitala: 'Kennitala',
    fieldKennitalaHint: 'Svo við getum sent reikning.',
    fieldContact: 'Tengiliður',
    fieldInvoiceEmail: 'Netfang fyrir reikning',
    fieldInvoiceEmailHint: 'Skildu eftir autt til að nota netfangið hér að ofan.',
    fieldOccasion: 'Tilefni',
    fieldGuests: 'Um það bil hvað margir',
    fieldGuestsHint: 'Hjálpar okkur að hafa magnið rétt.',
    fieldHandover: 'Sótt eða sent',
    handoverPickup: 'Við sækjum',
    handoverDelivery: 'Sent til okkar',
    fieldAddress: 'Afhendingarstaður',
    fieldAddressHint: 'Gata, hæð og annað sem við þurfum til að finna ykkur.',
    errCompany: 'Við þurfum nafn fyrirtækisins fyrir reikninginn.',
    errKennitala: 'Við þurfum kennitölu til að senda fyrirtæki reikning.',
    errKennitalaFormat: 'Íslensk kennitala er tíu tölustafir.',
    errContact: 'Við þurfum nafn til að spyrja eftir.',
    errAddress: 'Við þurfum stað til að senda á.',
    bigOrderNote:
      'Ertu að panta fyrir stærri viðburð? Segðu okkur fjöldann hér að neðan og við gerum tilboð þegar við hringjum.',
    slipQty: (n: number) => `${n} stykki af þessu`,
    teaseCta: 'Byrja pöntun',
    teaseNote: 'Tekur eina mínútu. Við staðfestum símleiðis og greitt er þegar sótt er.',
    backToSite: 'Til baka á vefinn',
    slipTitle: 'Pöntunin þín',
    slipEmpty: 'Valið þitt birtist hér jafnóðum.',
    slipBase: 'Grunnverð',
    slipTotal: 'Áætlað verð',
    slipNote: 'Við staðfestum endanlegt verð þegar við hringjum.',
    perPerson: 'á mann',
    specTitle: 'Svona er hún',
    sizePrompt: 'Veldu stærð',
    slipPickSize: 'Veldu stærð',
    quoteTotal: 'Við gerum tilboð',
    quoteNote:
      'Sérhönnuð terta er verðlögð eftir því sem hún kallar á, þannig að við sendum þér verð áður en nokkuð er bakað.',
    submitQuote: 'Senda fyrirspurn',
    refLabel: 'Pöntunarnúmer',
    photoLabel: 'Sendu myndina með pöntuninni',
    photoCta: 'Velja mynd',
    photoHint: 'JPG eða PNG, mest 5 MB. Þú getur líka sent hana síðar ef það er einfaldara.',
    photoRemove: 'Fjarlægja',
    photoSent: 'Myndin fylgdi með.',
    errPhotoType: 'Þetta er ekki mynd. Veldu JPG eða PNG.',
    errPhotoSize: 'Myndin er stærri en 5 MB. Veldu minni mynd, eða sendu hana á okkur á eftir.',
    photoHow: (ref) =>
      `Sendu okkur myndina með ${ref} í efnislínunni, þá tengjum við hana við pöntunina þína.`,
    included: 'innifalið',
    required: 'nauðsynlegt',
    optional: 'valfrjálst',
    chooseUpTo: (n: number) => `Veldu allt að ${n}`,
    fieldName: 'Nafn',
    fieldPhone: 'Sími',
    fieldEmail: 'Netfang',
    fieldEmailHelp: 'Valfrjálst, ef ekki næst í þig í síma.',
    fieldDate: 'Afhendingardagur',
    fieldDateHelp: (n: number) => `Við þurfum að minnsta kosti ${n} daga fyrirvara fyrir þetta.`,
    fieldTime: 'Afhendingartími',
    fieldTimePlaceholder: 'Veldu tíma',
    fieldTimeHelp: 'Við höfum opið frá 07:00 til 17:00 alla daga.',
    fieldLocation: 'Sótt í',
    fieldNotes: 'Eitthvað fleira sem við ættum að vita',
    fieldNotesPlaceholder: 'Tilefni, litir, tímasetning, hvað sem er.',
    errRequiredGroup: 'Veldu einn valkost til að halda áfram.',
    errRequiredMulti: 'Veldu að minnsta kosti einn valkost til að halda áfram.',
    errFreeText: 'Fylltu þetta út svo við þurfum ekki að hringja og spyrja.',
    errName: 'Við þurfum nafn á pöntunina.',
    errPhone: 'Við þurfum símanúmer til að staðfesta.',
    errPhoneFormat: 'Þetta lítur ekki út eins og símanúmer sem við getum hringt í.',
    errEmail: 'Það vantar @ í netfangið.',
    errDate: 'Veldu afhendingardag.',
    errTime: 'Veldu afhendingartíma.',
    errDateTooSoon: (d: string) => `Fyrsti mögulegi dagur er ${d}.`,
    errSummary: 'Það vantar enn nokkur atriði.',
    submit: 'Senda pöntunarbeiðni',
    submitting: 'Sendi',
    doneTitle: 'Beiðnin er komin til okkar.',
    doneBody:
      'Við hringjum og staðfestum útfærslu og endanlegt verð. Ekkert er greitt fyrr en sótt er.',
    doneWhen: (hours: string) => `Við hringjum á opnunartíma, ${hours}.`,
    doneWhenGeneric: 'Við hringjum á opnunartíma bakarísins.',
    doneReach: 'Spurningar eða breytingar:',
    doneAgain: 'Byrja aðra pöntun',
    charsLeft: (n: number) => `${n} stafir eftir`,
  },
}
