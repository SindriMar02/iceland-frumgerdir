/* ──────────────────────────────────────────────────────────────────────────
 * Saga Kayak — "Róið inn fjörðinn" (preview data)
 *
 * Every fact, price and quote below comes from the verified brief
 * (re-checked against primary sources 2026-07-18):
 * - Prices: Saga Kayak's own "Ný verðskrá - sama verð!" graphic,
 *   posted on their Instagram 27 June 2025. The page rebuilds that graphic
 *   as real HTML (the raw image is too low-res to embed as pricing UI).
 * - Self-description: east.is + ferdalag.is (word-for-word identical).
 * - Opening-party quote: their own Instagram post, 15 July 2024.
 *
 * Deliberately NOT claimed anywhere (unverified): founding year, owner
 * names, guest reviews or ratings, opening hours, season dates, group
 * limits, cancellation policy. Booking is a REQUEST form, not a calendar.
 * ────────────────────────────────────────────────────────────────────────── */

export const PHONE = '847 4053'
export const PHONE_HREF = 'tel:+3548474053'
export const EMAIL = 'contact@sagakayak.is'
export const ADDRESS = 'Lónabraut 5, 690 Vopnafjörður'
export const INSTAGRAM_HANDLE = '@sagakayak'
export const INSTAGRAM_URL = 'https://www.instagram.com/sagakayak/'

/* Local real assets (harvested from Saga Kayak's public Instagram, 640px). */
export const asset = (file: string) => `${import.meta.env.BASE_URL}sagakayak/${file}`

/* Vetted free Unsplash (verified non-plus, no watermark). */
export const u = (id: string, w = 1280) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`
export const uSrcSet = (id: string) =>
  `${u(id, 828)} 828w, ${u(id, 1280)} 1280w, ${u(id, 2000)} 2000w`

export const UIMG = {
  /** Wide, calm, overcast Icelandic fjord with green hillsides. */
  fjord: 'photo-1724865054227-6a5f2449f856',
  /** Green aurora over dark water at night. */
  aurora: 'photo-1526644253653-a411eaafdfe6',
  /** Dark snow-dusted coastal mountains (generic, labelled sviðsmynd). */
  mountain: 'photo-1515593974903-0f6596f336bd',
  /** Wooden oar blade over calm sea in golden light. */
  oar: 'photo-1536524121708-d3c76bbf2fa1',
} as const

/* ── Tours — the three priced tiers from the June 2025 verðskrá ─────────── */

export type TourId = 'kayak15' | 'kayak2' | 'veidi'
export type BookingChoice = TourId | 'serferd' | 'leiga'

export interface Tour {
  id: TourId
  stop: string
  name: string
  duration: string
  priceSingle: string
  priceDouble: string
  desc: string
}

export const TOURS: Tour[] = [
  {
    id: 'kayak15',
    stop: 'Fyrsta stopp',
    name: 'Kayakferð, 1,5 klst',
    duration: '1,5 klst',
    priceSingle: '11.000 kr.',
    priceDouble: '7.500 kr.',
    desc: 'Stysta ferðin okkar og góð byrjun fyrir fólk sem hefur ekki róið áður. Þú færð allan búnað og leiðsögn með.',
  },
  {
    id: 'kayak2',
    stop: 'Annað stopp',
    name: 'Kayakferð, 2 klst',
    duration: '2 klst',
    priceSingle: '13.000 kr.',
    priceDouble: '8.000 kr.',
    desc: 'Lengri róður fyrir hópa og einstaklinga sem vilja meiri tíma úti á firðinum.',
  },
  {
    id: 'veidi',
    stop: 'Þriðja stopp',
    name: 'Veiðiferð eða norðurljósaferð, 2 klst',
    duration: '2 klst',
    priceSingle: '15.000 kr.',
    priceDouble: '10.000 kr.',
    desc: 'Sama tveggja tíma ferðin í tveimur útgáfum eftir árstíð. Veiðiferð yfir bjartari mánuðina og norðurljósaferð þegar dimmir. Annar búnaður fylgir með.',
  },
]

/* Verbatim from the verðskrá: "Kayak, kayakfatnaður s.s. þurrgalli, skór og
 * vettlingar, vesti og leiðsögn." */
export const INCLUDED = [
  'Kayak',
  'Kayakfatnaður: þurrgalli, skór og vettlingar',
  'Björgunarvesti',
  'Leiðsögn',
]

export const PRICE_SOURCE =
  'Verð samkvæmt verðskrá Saga Kayak frá júní 2025. Innifalið í öllum ferðum: kayak, þurrgalli, skór og vettlingar, vesti og leiðsögn.'

/* ── Rental without a guide — "Annað" in the verðskrá ───────────────────── */

export const RENTAL = [
  { name: 'Kayakleiga', detail: 'Kayak, ár og björgunarvesti', price: '8.000 kr.' },
  { name: 'Fatnaðarleiga', detail: 'Þurrgalli, skór og vettlingar', price: '3.000 kr.' },
]

/* ── Story — their own words only ───────────────────────────────────────── */

/* Their real self-description (east.is + ferdalag.is, identical wording),
 * lightly normalised ("uppá" → "upp á"). */
export const STORY_BODY =
  'Saga Kayak er lítið fjölskyldurekið fyrirtæki á Vopnafirði sem býður upp á fjölbreyttar kayakferðir í Vopnafirði og nágrenni. Ferðirnar henta jafnt byrjendum sem vönum ræðurum og passa vel fyrir vinahópa, fjölskyldur, vinnustaði og sérstök tilefni.'

/* Real quote from their own Instagram, 15 July 2024 (opening party). */
export const STORY_QUOTE =
  'Takk fyrir æðislega helgi! Fengum frábærar viðtökur í opnunarteitinu og þónokkrar bókanir yfir helgina.'
export const STORY_QUOTE_SOURCE = 'Saga Kayak á Instagram, júlí 2024'

/* ── Custom trips — sourced from the verðskrá's closing line ────────────── */

export const CUSTOM_BODY =
  'Auk fastra ferða bjóðum við upp á fjölbreyttar sérferðir, til dæmis fjölskylduferðir, gæsanir, steggjapartí og starfsmannahittinga. Segðu okkur frá tilefninu og hópnum og við finnum ferð sem passar.'

/* ── Booking form ───────────────────────────────────────────────────────── */

export const BOOKING_OPTIONS: { value: BookingChoice; label: string }[] = [
  { value: 'kayak15', label: 'Kayakferð, 1,5 klst' },
  { value: 'kayak2', label: 'Kayakferð, 2 klst' },
  { value: 'veidi', label: 'Veiðiferð eða norðurljósaferð, 2 klst' },
  { value: 'serferd', label: 'Sérferð fyrir hóp eða tilefni' },
  { value: 'leiga', label: 'Leiga án leiðsagnar' },
]

export const bookingLabel = (value: BookingChoice) =>
  BOOKING_OPTIONS.find((o) => o.value === value)?.label ?? value

/* ── Honesty disclaimer (mandatory, footer) ─────────────────────────────── */

export const DISCLAIMER =
  'Þessi frumgerð er hönnunartillaga frá SNDR Studio og er ekki opinber vefur Saga Kayak. Efnið byggir á opinberu efni Saga Kayak á Instagram og á verðskrá frá júní 2025. Verð skal staðfesta hjá Saga Kayak áður en vefur fer í loftið. Bókunarformið sendir beiðni og sýnir ekki raunverulegt framboð.'
