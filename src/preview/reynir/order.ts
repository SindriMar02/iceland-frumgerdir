/**
 * Reynir bakari — CUSTOM ORDER CONFIGURATOR DATA.
 *
 * ⚠️ EVERY PRODUCT, OPTION AND PRICE IN THIS FILE IS A PLACEHOLDER. ⚠️
 *
 * Nothing here has been confirmed by Reynir bakari. It exists so the ordering
 * flow can be designed, demoed and discussed before the real catalogue is
 * known. The structure is the deliverable; the content is a stand-in.
 *
 * CONFIRMED BY THE OWNER (Þorleifur, 2026-08-20), and already applied below:
 *   - The marsipanterta is priced PER PERSON at 930 kr., not from a table.
 *   - Its sizes are 20, 25, 30, 40, 50, 60 and 70 manna.
 *   - The customer picks the headcount first and sees the final price at once.
 *
 * STILL OPEN, and each one is a single edit when the answer lands:
 *   1. The four filling NAMES. He confirmed there are exactly four but wrote
 *      them as "Fylling 1..4", so the four labels in the `fylling` group are
 *      the only thing waiting.
 *   2. Whether everything is included in the 930, or whether "Mynd á tertu"
 *      and "Sérhönnun" carry a surcharge. If they do, set priceDelta on those
 *      two choices; sérhönnun is already quoteOnly so it never shows a firm
 *      number either way.
 *   3. The real lead time, and whether the biggest cakes need longer.
 *   4. The per-person rate for the OTHER cakes, so each becomes its own
 *      product with its own pricePerPerson.
 *   5. Whether anything smaller than 20 manna can be ordered this way.
 *   6. Platters and pastry trays below are still entirely my assumption:
 *      unconfirmed products, prices and lead times.
 *
 * The page renders a visible "these are sample options" notice for as long as
 * PLACEHOLDER_DATA below is true. Flip it to false only once every value here
 * has been confirmed by the client.
 */

import type { Lang } from './data'

/** Drives the visible sample-data notice. Set false only after the owner confirms every value. */
export const PLACEHOLDER_DATA = true

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
      en: 'Priced per person, so choose how many you are feeding and the price is the price.',
      is: 'Verðlögð á mann. Veldu fyrir hvað marga hún á að vera og verðið liggur strax fyrir.',
    },
    /* Priced per person, so basePrice is unused and deliberately 0. */
    basePrice: 0,
    /* The owner's own rate (Thorleifur, 2026-08-20). Sizes below are his list. */
    pricePerPerson: 930,
    sizeGroupId: 'staerd',
    image: `${import.meta.env.BASE_URL}reynir/order/terta.webp`,
    /* PLACEHOLDER: real notice period is question 3 to the owner, still open. */
    leadDays: 3,
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
        /* PLACEHOLDER NAMES. The owner confirmed there are exactly FOUR
           fillings but wrote them as "Fylling 1..4", so these four strings are
           the only thing waiting on his answer to question 1. Swap the labels,
           change nothing else. */
        id: 'fylling',
        kind: 'single',
        label: { en: 'Filling', is: 'Fylling' },
        required: true,
        choices: [
          { id: 'f1', label: { en: 'Cream and strawberries', is: 'Rjómi og jarðarber' }, priceDelta: 0 },
          { id: 'f2', label: { en: 'Chocolate mousse', is: 'Súkkulaðimús' }, priceDelta: 0 },
          { id: 'f3', label: { en: 'Salted caramel', is: 'Saltkaramella' }, priceDelta: 0 },
          { id: 'f4', label: { en: 'Vanilla cream', is: 'Vanillukrem' }, priceDelta: 0 },
        ],
      },
      {
        id: 'utlit',
        kind: 'single',
        label: { en: 'Look and occasion', is: 'Útlit og tilefni' },
        required: true,
        choices: [
          { id: 'hefd', label: { en: 'Classic marzipan cake', is: 'Hefðbundin marsipanterta' }, priceDelta: 0 },
          { id: 'afmaeli', label: { en: 'Birthday', is: 'Afmæli' }, priceDelta: 0 },
          { id: 'barnaafmaeli', label: { en: "Child's birthday", is: 'Barnaafmæli' }, priceDelta: 0 },
          { id: 'ferming', label: { en: 'Confirmation or christening', is: 'Ferming eða skírn' }, priceDelta: 0 },
          {
            id: 'mynd',
            label: { en: 'Photo on the cake', is: 'Mynd á tertu' },
            priceDelta: 0,
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
            /* A bespoke cake is not the standard product, so it cannot carry
               the standard per-person rate. Quoting it at 930 a head would
               under-price the one order most likely to cost more. */
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
        id: 'litur',
        kind: 'single',
        label: { en: 'Colour', is: 'Litur' },
        required: true,
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
    id: 'veislubakki',
    name: { en: 'Party platter', is: 'Veislubakki' },
    blurb: {
      en: 'Open sandwiches and savouries, made up the morning you collect them.',
      is: 'Snittur og brauðréttir, lagað að morgni þess dags sem sótt er.',
    },
    basePrice: 6400,
    image: `${import.meta.env.BASE_URL}reynir/order/veislubakki.webp`,
    leadDays: 2,
    groups: [
      {
        id: 'fjoldi',
        kind: 'single',
        label: { en: 'Serves', is: 'Fjöldi' },
        required: true,
        choices: [
          { id: 'p10', label: { en: '10 people', is: '10 manns' }, priceDelta: 0 },
          { id: 'p20', label: { en: '20 people', is: '20 manns' }, priceDelta: 6100 },
          { id: 'p30', label: { en: '30 people', is: '30 manns' }, priceDelta: 12200 },
        ],
      },
      {
        id: 'alegg',
        kind: 'multi',
        label: { en: 'Toppings', is: 'Álegg' },
        help: { en: 'Choose up to three.', is: 'Veljið allt að þremur.' },
        required: true,
        max: 3,
        choices: [
          { id: 'skinka', label: { en: 'Ham', is: 'Skinka' }, priceDelta: 0 },
          { id: 'roastbeef', label: { en: 'Roast beef', is: 'Roast beef' }, priceDelta: 800 },
          { id: 'raekjur', label: { en: 'Prawns', is: 'Rækjur' }, priceDelta: 1100 },
          { id: 'graenmeti', label: { en: 'Vegetarian', is: 'Grænmeti' }, priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'bakkelsi',
    name: { en: 'Pastry tray', is: 'Bakkelsisbakki' },
    blurb: {
      en: 'A tray of the morning bake for meetings and gatherings.',
      is: 'Bakki af bakkelsi dagsins fyrir fundi og mannfagnaði.',
    },
    basePrice: 4900,
    image: `${import.meta.env.BASE_URL}reynir/order/bakkelsi.webp`,
    leadDays: 2,
    groups: [
      {
        id: 'stk',
        kind: 'single',
        label: { en: 'Pieces', is: 'Fjöldi stykkja' },
        required: true,
        choices: [
          { id: 'x12', label: { en: '12 pieces', is: '12 stykki' }, priceDelta: 0 },
          { id: 'x24', label: { en: '24 pieces', is: '24 stykki' }, priceDelta: 4400 },
          { id: 'x36', label: { en: '36 pieces', is: '36 stykki' }, priceDelta: 8800 },
        ],
      },
      {
        id: 'urval',
        kind: 'multi',
        label: { en: 'Selection', is: 'Úrval' },
        help: { en: 'Choose as many as you like.', is: 'Veljið eins margt og þið viljið.' },
        required: true,
        choices: [
          { id: 'snudar', label: { en: 'Snúðar', is: 'Snúðar' }, priceDelta: 0 },
          { id: 'vinarbraud', label: { en: 'Danish pastries', is: 'Vínarbrauð' }, priceDelta: 0 },
          { id: 'kleinur', label: { en: 'Kleinur', is: 'Kleinur' }, priceDelta: 0 },
          { id: 'pistasiu', label: { en: 'Pistachio snúður', is: 'Pistasíusnúður' }, priceDelta: 700 },
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
  /** How to send a photo, shown only when the order needs one. */
  photoHow: (ref: string) => string
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
    slipPickSize: 'Choose a size',
    quoteTotal: 'We will quote you',
    quoteNote:
      'A bespoke cake is priced on what it takes to make, so we send you a price before anything is baked.',
    submitQuote: 'Send enquiry',
    refLabel: 'Order reference',
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
    doneWhen: (hours: string) => `That call comes during opening hours, ${hours}.`,
    doneWhenGeneric: 'That call comes during the bakery opening hours.',
    doneReach: 'If you need to change anything, or have a question, call',
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
    slipPickSize: 'Veldu stærð',
    quoteTotal: 'Við gerum tilboð',
    quoteNote:
      'Sérhönnuð terta er verðlögð eftir því sem hún kallar á, þannig að við sendum þér verð áður en nokkuð er bakað.',
    submitQuote: 'Senda fyrirspurn',
    refLabel: 'Pöntunarnúmer',
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
    doneWhen: (hours: string) => `Símtalið kemur á opnunartíma, ${hours}.`,
    doneWhenGeneric: 'Símtalið kemur á opnunartíma bakarísins.',
    doneReach: 'Ef þú þarft að breyta einhverju eða hefur spurningu, hringdu í',
    doneAgain: 'Byrja aðra pöntun',
    charsLeft: (n: number) => `${n} stafir eftir`,
  },
}
