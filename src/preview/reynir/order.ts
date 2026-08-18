/**
 * Reynir bakari — CUSTOM ORDER CONFIGURATOR DATA.
 *
 * ⚠️ EVERY PRODUCT, OPTION AND PRICE IN THIS FILE IS A PLACEHOLDER. ⚠️
 *
 * Nothing here has been confirmed by Reynir bakari. It exists so the ordering
 * flow can be designed, demoed and discussed before the real catalogue is
 * known. The structure is the deliverable; the content is a stand-in.
 *
 * TO FILL IN WITH THE OWNER (meeting 2026-08-07):
 *   1. Which products can actually be ordered this way? (cakes confirmed by
 *      Þorleifur; platters and pastry trays are my assumption, verify.)
 *   2. Real option groups per product, and which are required.
 *   3. Real base prices and real surcharges per option.
 *   4. Real lead time per product (how many days notice do they need).
 *   5. Whether both locations take custom orders, or only Dalvegur.
 *   6. Any minimum order size, deposit, or cancellation policy.
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

export interface OrderProduct {
  id: string
  name: Bilingual
  blurb: Bilingual
  basePrice: number
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
    id: 'terta',
    name: { en: 'Celebration cake', is: 'Terta' },
    blurb: {
      en: 'Built to order for birthdays, confirmations and anniversaries.',
      is: 'Sérbökuð fyrir afmæli, fermingar og stórafmæli.',
    },
    basePrice: 8900,
    image: `${import.meta.env.BASE_URL}reynir/order/terta.webp`,
    leadDays: 3,
    inscription: {
      label: { en: 'Writing on the cake', is: 'Áletrun á tertuna' },
      placeholder: { en: 'For example: Til hamingju Anna', is: 'Til dæmis: Til hamingju Anna' },
      maxLength: 40,
    },
    groups: [
      {
        id: 'staerd',
        kind: 'single',
        label: { en: 'Size', is: 'Stærð' },
        required: true,
        choices: [
          { id: 's8', label: { en: 'For 8 to 10', is: 'Fyrir 8 til 10' }, priceDelta: 0 },
          { id: 's16', label: { en: 'For 15 to 18', is: 'Fyrir 15 til 18' }, priceDelta: 5400 },
          { id: 's25', label: { en: 'For 25 to 30', is: 'Fyrir 25 til 30' }, priceDelta: 11800 },
        ],
      },
      {
        id: 'botn',
        kind: 'single',
        label: { en: 'Sponge', is: 'Botn' },
        required: true,
        choices: [
          { id: 'ljos', label: { en: 'Vanilla', is: 'Ljós' }, priceDelta: 0 },
          { id: 'sukkulad', label: { en: 'Chocolate', is: 'Súkkulaði' }, priceDelta: 0 },
          { id: 'gulrot', label: { en: 'Carrot', is: 'Gulrót' }, priceDelta: 900 },
        ],
      },
      {
        id: 'fylling',
        kind: 'single',
        label: { en: 'Filling', is: 'Fylling' },
        required: true,
        choices: [
          { id: 'rjomi', label: { en: 'Cream and strawberries', is: 'Rjómi og jarðarber' }, priceDelta: 0 },
          { id: 'sukkmus', label: { en: 'Chocolate mousse', is: 'Súkkulaðimús' }, priceDelta: 1200 },
          { id: 'karamella', label: { en: 'Salted caramel', is: 'Saltkaramella' }, priceDelta: 1200 },
        ],
      },
      {
        id: 'skreyting',
        kind: 'single',
        label: { en: 'Decoration', is: 'Skreyting' },
        required: true,
        choices: [
          { id: 'einfold', label: { en: 'Simple', is: 'Einföld' }, priceDelta: 0 },
          { id: 'blom', label: { en: 'Fresh flowers', is: 'Ferskt blómaskraut' }, priceDelta: 3200 },
          {
            id: 'mynd',
            label: { en: 'Printed photo', is: 'Myndprent' },
            priceDelta: 2600,
            note: { en: 'Send us the photo after ordering.', is: 'Þið sendið okkur myndina eftir pöntun.' },
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
  doneDemo: string
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
    doneDemo: 'Note: the range and prices on this page are still samples, so we will go through the details with you on the call.',
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
    doneDemo: 'Athugið: úrvalið og verðin á þessari síðu eru enn sýnishorn, svo við förum yfir útfærsluna með þér í símtalinu.',
    doneAgain: 'Byrja aðra pöntun',
    charsLeft: (n: number) => `${n} stafir eftir`,
  },
}
