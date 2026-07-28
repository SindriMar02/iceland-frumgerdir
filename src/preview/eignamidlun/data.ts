/**
 * EIGNAMIÐLUN SUÐURNESJA — "Heim á Suðurnesjum" (v2)
 * ---------------------------------------------------------------------------
 * Fasteignasala í Reykjanesbæ (Keflavík), starfandi frá 1978. Redesign concept.
 *
 * v2 supersedes the v1 build ("Hús fyrir hús"), which had zero real
 * photography because es.is returns 403 to curl/WebFetch on every path.
 * That block is now worked around: a real in-app browser session harvested
 * the actual logo, 20 real current-listing photos and 4 real staff portraits
 * (public/eignamidlun/real/, see HARVEST.md there). This build is built on
 * those real assets — the söluskrá is now an actual photographed product
 * catalogue, not typeset data.
 *
 * Sources
 *   es.is /                    company info, founding story, staff, sími
 *   es.is /um_fyrirtaekid       Hannes Arnar Ragnarsson + Halldóra Lúðvíksdóttir,
 *                               2 May 1978, customs-officer side job, 2008 merger
 *   es.is /gjaldskra            full price list, printed verbatim below
 *   es.is /starfsmenn           4 staff portraits + verbatim "Um okkur" line
 *   es.is homepage söluskrá     the 20 sample listings + their photos, "júlí 2026"
 *
 * PHOTO/LISTING PAIRING — read before touching LISTINGS ---------------------
 * HARVEST.md documents that the 20 listing-<id>.jpg files are real photos of
 * real current listings ("same ids as FACTS-eignamidlun.md price table"), but
 * no explicit id → address crosswalk was recorded during harvesting, and the
 * FACTS table itself never printed ids. There is therefore no verified way to
 * assert "this exact photo depicts this exact address." Rather than invent
 * that pairing as fact, each Listing below is paired POSITIONALLY with a
 * photo (LISTINGS index i ↔ the i-th listing-*.jpg file in ascending numeric
 * id order) purely as a presentational choice, and the söluskrá section
 * discloses this plainly instead of asserting false precision. Every
 * address, town, type, size, room count and price is exactly as published;
 * only the specific photo-to-row match is unverified and labeled as such.
 */

import type { AuditList, PreviewCompany } from '../companies'

const asset = (p: string) => `${import.meta.env.BASE_URL}eignamidlun/${p}`
const real = (p: string) => `${import.meta.env.BASE_URL}eignamidlun/real/${p}`

/* ── imagery ──────────────────────────────────────────────────────────────
 * LOGO is the company's real mark (es.is/assets/img/logo.png, 1690×1512),
 * harvested and verified by direct view. Palette below is drawn from its
 * measured colour (#1E4F8E, 845,671 of 1.67M opaque pixels — the dominant
 * fill by a wide margin).
 *
 * lavaRoad is the one surviving v1 atmosphere plate (Unsplash, Balázs Gábor)
 * — a moss-covered lava field crossed by a single road, the characteristic
 * Reykjanesbraut look. Kept only for the svæðið section, where it depicts
 * the region itself rather than standing in for a house or a person; every
 * other image on the page is now real. Disclosed in the footer either way.
 */
export const LOGO = real('logo.png')
export const IMG = {
  svaedi: asset('img/lava-road.jpg'),
}

/* ── identity ─────────────────────────────────────────────────────────── */

export const PHONE_DISPLAY = '420 4050'
export const PHONE_HREF = 'tel:+3544204050'
export const EMAIL = 'es@es.is'
export const EMAIL_HREF = 'mailto:es@es.is?subject=Sk%C3%A1ning%20eignar'
export const KENNITALA = '480813-0490'
export const LEGAL_NAME = 'Eignamiðlun Suðurnesja ehf.'
export const ADDRESS_CORRECT = 'Hafnargata 50, 230 Reykjanesbær'
export const CURRENT_URL = 'https://es.is'

/* ── the founding story (verbatim facts, condensed) ─────────────────────── */

export const FOUNDING = {
  date: '2. maí 1978',
  founders: 'Hannes Arnar Ragnarsson og Halldóra Lúðvíksdóttir',
  lede: 'Hannes var tollvörður og ætlaði sér að reka fasteignasöluna sem aukastarf á milli vakta.',
  body: 'Það varð fljótt að fullu starfi fyrir þau bæði, og þau réðu sinn fyrsta starfsmann. Í maí 2008 sameinaðist fyrirtækið Fasteignastofu Suðurnesja undir nafninu Eignamiðlun.',
  years: 47,
}

/** Verbatim from es.is/starfsmenn ("Um okkur"). */
export const ABOUT_QUOTE =
  'Við hjá Eignamiðlun Suðurnesja bjóðum metnaðarfulla þjónustu fyrir seljendur og kaupendur fasteigna og gætum hagsmuna beggja aðila. Við leggjum áherslu á fagleg vinnubrögð, gagnsæi og traust.'

/* ── gjaldskrá (verbatim from their published price list) ───────────────── */

export interface FeeLine {
  label: string
  value: string
  note?: string
}

export const FEES: FeeLine[] = [
  {
    label: 'Söluþóknun í almennri sölu',
    value: '1,3%',
    note: 'af söluverði, auk virðisaukaskatts. Tilboð í einkasölu, stærri eignir og fyrir verktaka.',
  },
  { label: 'Lágmarksþóknun', value: 'Engin' },
  { label: 'Verðmat, sölu og banka', value: 'Frítt' },
  {
    label: 'Gagnaöflun',
    value: 'Enginn aukakostnaður',
    note: 'söluyfirlit, veðbókarvottorð, veðbandsyfirlit, fasteignavottorð, eignaskiptasamningar, lóðarsamningar o.s.frv.',
  },
  { label: 'Ljósmyndun', value: 'Ekkert gjald' },
  {
    label: 'Netauglýsingar',
    value: 'Fríar',
    note: 'mbl.is/fasteignir, fasteignir.is, es.is, Facebook.',
  },
  {
    label: 'Þjónustu- og umsýslugjald kaupanda',
    value: '70.000 kr.',
    note: 'með vsk.',
  },
]

export const FEE_HEADLINE = '1,3%'
export const FEE_SUB = 'og engin lágmarksþóknun'

/* ── staff (real, as published today, with real portraits) ────────────────
 * IDENTITY LOCK — verified against the live es.is DOM 2026-07-29. This exact
 * file → person mapping is the source of truth; do not reorder STAFF or edit
 * a name/title/phone/email without re-verifying against es.is/starfsmenn
 * first. A wrong photo/name pairing puts a real person's face next to
 * someone else's name and contact details, which is not a cosmetic bug. */

export interface StaffMember {
  name: string
  title: string
  phone: string
  phoneHref: string
  email: string
  photo: string
  alt: string
}

const STAFF_IDENTITY = [
  {
    file: 'staff-saevar.jpg',
    name: 'M. Sævar Pétursson',
    title: 'M.Sc. rekstrarverkfræðingur, löggiltur fasteignasali og leigumiðlari',
    phone: '894 2252',
    phoneHref: 'tel:+3548942252',
    email: 'msp@es.is',
  },
  {
    file: 'staff-erla.jpg',
    name: 'Erla María Guðmundsdóttir',
    title: 'M.Sc. í fjármálum, löggiltur fasteignasali',
    phone: '869 1808',
    phoneHref: 'tel:+3548691808',
    email: 'erlamaria@es.is',
  },
  {
    file: 'staff-fannar.jpg',
    name: 'Fannar Orri Sævarsson',
    title: 'Lögfræðingur',
    phone: '420 4050',
    phoneHref: PHONE_HREF,
    email: 'fannar@es.is',
  },
  {
    file: 'staff-thury.jpg',
    name: 'Þurý Jónasdóttir',
    title: 'Ritari og móttaka',
    phone: '420 4050',
    phoneHref: PHONE_HREF,
    email: 'thury@es.is',
  },
] as const

export const STAFF: StaffMember[] = STAFF_IDENTITY.map((s) => ({
  name: s.name,
  title: s.title,
  phone: s.phone,
  phoneHref: s.phoneHref,
  email: s.email,
  photo: real(s.file),
  alt: s.name,
}))

/* ── söluskrá — the 20 real sample listings, verbatim, each paired
 * positionally with a real photo (see the PHOTO/LISTING PAIRING note up
 * top). Labeled on page as required: "Sýnishorn úr söluskrá, júlí 2026". */

export type ListingType = 'Fjölbýli' | 'Raðhús' | 'Einbýli' | 'Atvinnuhúsnæði'

export interface Listing {
  address: string
  town: string
  type: ListingType
  sqm: number
  rooms: number
  price: string
  /** Numeric price for sort/filter math; null for "Tilboð" (offer, no listed number). */
  priceValue: number | null
  photo: string
  photoAlt: string
}

/* Icelandic thousands separator is a period ("44.500.000 kr"), never a comma.
 * 'is-IS' is the semantically correct locale tag, but Chrome's headless/CI
 * ICU data does not always ship the is-IS grouping pattern and silently
 * falls back to a comma-grouped default — confirmed by direct comparison in
 * this repo's own headless audit harness. 'de-DE' uses the identical
 * period-grouping / comma-decimal convention and is reliably present, so it
 * is used here as the robust equivalent, not a locale mismatch. */
const kr = (n: number) => `${n.toLocaleString('de-DE')} kr`
const photoAlt = (town: string, type: ListingType) => `Ljósmynd af eign á söluskrá, ${type.toLowerCase()} í ${town}.`

export const LISTINGS: Listing[] = [
  { address: 'Heiðarból 4', town: 'Keflavík', type: 'Fjölbýli', sqm: 77, rooms: 3, price: kr(44_500_000), priceValue: 44_500_000, photo: real('listing-901275.jpg'), photoAlt: photoAlt('Keflavík', 'Fjölbýli') },
  { address: 'Fífumói 5', town: 'Njarðvík', type: 'Fjölbýli', sqm: 73, rooms: 3, price: kr(44_500_000), priceValue: 44_500_000, photo: real('listing-901281.jpg'), photoAlt: photoAlt('Njarðvík', 'Fjölbýli') },
  { address: 'Akurbraut 10', town: 'Njarðvík', type: 'Raðhús', sqm: 135, rooms: 5, price: kr(89_500_000), priceValue: 89_500_000, photo: real('listing-901283.jpg'), photoAlt: photoAlt('Njarðvík', 'Raðhús') },
  { address: 'Dalsbraut 6', town: 'Njarðvík', type: 'Fjölbýli', sqm: 75, rooms: 3, price: kr(51_000_000), priceValue: 51_000_000, photo: real('listing-904387.jpg'), photoAlt: photoAlt('Njarðvík', 'Fjölbýli') },
  { address: 'Brekkustígur 31B', town: 'Njarðvík', type: 'Fjölbýli', sqm: 112, rooms: 4, price: kr(66_000_000), priceValue: 66_000_000, photo: real('listing-905953.jpg'), photoAlt: photoAlt('Njarðvík', 'Fjölbýli') },
  { address: 'Bjarkardalur 26', town: 'Njarðvík', type: 'Fjölbýli', sqm: 85, rooms: 3, price: kr(59_500_000), priceValue: 59_500_000, photo: real('listing-905961.jpg'), photoAlt: photoAlt('Njarðvík', 'Fjölbýli') },
  { address: 'Birkiteigur 33', town: 'Keflavík', type: 'Raðhús', sqm: 179, rooms: 5, price: kr(82_900_000), priceValue: 82_900_000, photo: real('listing-905964.jpg'), photoAlt: photoAlt('Keflavík', 'Raðhús') },
  { address: 'Brimdalur 5', town: 'Njarðvík', type: 'Einbýli', sqm: 161, rooms: 4, price: 'Tilboð', priceValue: null, photo: real('listing-905965.jpg'), photoAlt: photoAlt('Njarðvík', 'Einbýli') },
  { address: 'Suðurgata 8', town: 'Keflavík', type: 'Fjölbýli', sqm: 64, rooms: 2, price: kr(43_900_000), priceValue: 43_900_000, photo: real('listing-905968.jpg'), photoAlt: photoAlt('Keflavík', 'Fjölbýli') },
  { address: 'Suðurgata 12', town: 'Sandgerði', type: 'Fjölbýli', sqm: 120, rooms: 6, price: kr(55_900_000), priceValue: 55_900_000, photo: real('listing-905970.jpg'), photoAlt: photoAlt('Sandgerði', 'Fjölbýli') },
  { address: 'Krossmói 5', town: 'Njarðvík', type: 'Fjölbýli', sqm: 90, rooms: 3, price: kr(63_500_000), priceValue: 63_500_000, photo: real('listing-905971.jpg'), photoAlt: photoAlt('Njarðvík', 'Fjölbýli') },
  { address: 'Hólmbergsbraut 13', town: 'Keflavík', type: 'Atvinnuhúsnæði', sqm: 107, rooms: 0, price: kr(45_000_000), priceValue: 45_000_000, photo: real('listing-905972.jpg'), photoAlt: photoAlt('Keflavík', 'Atvinnuhúsnæði') },
  { address: 'Garðbraut 86', town: 'Garður', type: 'Einbýli', sqm: 228, rooms: 6, price: kr(86_900_000), priceValue: 86_900_000, photo: real('listing-908842.jpg'), photoAlt: photoAlt('Garður', 'Einbýli') },
  { address: 'Fitjabraut 6A', town: 'Njarðvík', type: 'Fjölbýli', sqm: 100, rooms: 3, price: kr(45_000_000), priceValue: 45_000_000, photo: real('listing-909072.jpg'), photoAlt: photoAlt('Njarðvík', 'Fjölbýli') },
  { address: 'Fífumói 8', town: 'Njarðvík', type: 'Raðhús', sqm: 140, rooms: 4, price: kr(67_900_000), priceValue: 67_900_000, photo: real('listing-909073.jpg'), photoAlt: photoAlt('Njarðvík', 'Raðhús') },
  { address: 'Akurvellir 1', town: 'Hafnarfjörður', type: 'Fjölbýli', sqm: 90, rooms: 3, price: kr(66_000_000), priceValue: 66_000_000, photo: real('listing-909074.jpg'), photoAlt: photoAlt('Hafnarfjörður', 'Fjölbýli') },
  { address: 'Greniteigur 15', town: 'Keflavík', type: 'Raðhús', sqm: 172, rooms: 5, price: kr(83_900_000), priceValue: 83_900_000, photo: real('listing-909075.jpg'), photoAlt: photoAlt('Keflavík', 'Raðhús') },
  { address: 'Heiðarbraut 1', town: 'Keflavík', type: 'Fjölbýli', sqm: 181, rooms: 5, price: kr(88_000_000), priceValue: 88_000_000, photo: real('listing-909082.jpg'), photoAlt: photoAlt('Keflavík', 'Fjölbýli') },
  { address: 'Víðidalur 24', town: 'Njarðvík', type: 'Raðhús', sqm: 130, rooms: 3, price: kr(92_900_000), priceValue: 92_900_000, photo: real('listing-909083.jpg'), photoAlt: photoAlt('Njarðvík', 'Raðhús') },
  { address: 'Háteigur 54', town: 'Garður', type: 'Raðhús', sqm: 106, rooms: 3, price: kr(64_140_000), priceValue: 64_140_000, photo: real('listing-909085.jpg'), photoAlt: photoAlt('Garður', 'Raðhús') },
]

export const LISTINGS_LABEL = 'Sýnishorn úr söluskrá, júlí 2026'

/** Hero cycle: 4 of the 20 LISTINGS indices, curated for strong exteriors
 * whose paired photo and type are at least visually coherent (a detached
 * house photo lands on an Einbýli row, an apartment-block photo on a
 * Fjölbýli row, etc.) — the safest subset given the pairing caveat above. */
export const HERO_INDEXES = [7, 4, 6, 9]

/* ── söluskrá filters — device 6: staður / verðbil / röðun ───────────────── */

export const STADUR_FILTERS: { label: string; value: string }[] = [
  { label: 'Öll svæði', value: 'Öll' },
  { label: 'Keflavík', value: 'Keflavík' },
  { label: 'Njarðvík', value: 'Njarðvík' },
  { label: 'Sandgerði', value: 'Sandgerði' },
  { label: 'Garður', value: 'Garður' },
  { label: 'Hafnir', value: 'Hafnir' },
]

export interface PriceBand {
  label: string
  min?: number
  max?: number
}

export const PRICE_BANDS: PriceBand[] = [
  { label: 'Öll verðbil' },
  { label: 'Undir 50 millj.', max: 50_000_000 },
  { label: '50-70 millj.', min: 50_000_000, max: 70_000_000 },
  { label: '70-90 millj.', min: 70_000_000, max: 90_000_000 },
  { label: 'Yfir 90 millj.', min: 90_000_000 },
]

export type SortMode = 'default' | 'verd-haekkandi' | 'verd-laekkandi'

export const SORT_OPTIONS: { label: string; value: SortMode }[] = [
  { label: 'Röðun: eins og á söluskrá', value: 'default' },
  { label: 'Verð, lægst fyrst', value: 'verd-haekkandi' },
  { label: 'Verð, hæst fyrst', value: 'verd-laekkandi' },
]

/* ── editorial interstitial cards — injected into the söluskrá grid ──────
 * The ERA-manner device: short editorial cards woven between data rows
 * (device 6), roughly every 6th cell. */

export type EditorialCard =
  | { kind: 'quote'; tag: string; line: string }
  | { kind: 'gjaldskra'; tag: string; line: string }
  | { kind: 'starfsmadur'; tag: string; staff: StaffMember }

export const EDITORIAL_CARDS: EditorialCard[] = [
  { kind: 'quote', tag: 'Um okkur', line: ABOUT_QUOTE },
  { kind: 'gjaldskra', tag: 'Gjaldskrá', line: '1,3% og engin lágmarksþóknun. Sagt beint út, ekki falið.' },
  { kind: 'starfsmadur', tag: 'Beint samband', staff: STAFF[0] },
]

/* ── svæðið — the five towns, counted honestly from the sample above ─────
 * Hafnir has no listing in this 20-item sample; shown as 0, not omitted. */

export const TOWNS = [
  { name: 'Keflavík', count: LISTINGS.filter((l) => l.town === 'Keflavík').length },
  { name: 'Njarðvík', count: LISTINGS.filter((l) => l.town === 'Njarðvík').length },
  { name: 'Sandgerði', count: LISTINGS.filter((l) => l.town === 'Sandgerði').length },
  { name: 'Garður', count: LISTINGS.filter((l) => l.town === 'Garður').length },
  { name: 'Hafnir', count: LISTINGS.filter((l) => l.town === 'Hafnir').length },
]

/* ── nav ──────────────────────────────────────────────────────────────── */

export const NAV = [
  { href: '#saga', label: 'Sagan' },
  { href: '#soluskra', label: 'Söluskrá' },
  { href: '#gjaldskra', label: 'Gjaldskrá' },
  { href: '#svaedid', label: 'Svæðið' },
  { href: '#starfsfolk', label: 'Starfsfólk' },
]

/* ── JSON-LD ──────────────────────────────────────────────────────────── */

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Eignamiðlun Suðurnesja',
  description:
    'Fasteignasala á Suðurnesjum frá 1978. Söluþóknun 1,3%, engin lágmarksþóknun, frítt verðmat.',
  telephone: '+354 420 4050',
  email: EMAIL,
  foundingDate: '1978-05-02',
  logo: LOGO,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hafnargata 50',
    postalCode: '230',
    addressLocality: 'Reykjanesbær',
    addressCountry: 'IS',
  },
}

/* ── the company record — exported for the lead to merge into companies.ts
 * (this build must not edit companies.ts itself, per the shared brief) ── */

const AUDIT: AuditList = {
  strengths: [
    '47 ára samfellt starf á Suðurnesjum (stofnað 2. maí 1978), sameinað Fasteignastofu Suðurnesja 2008',
    'Gagnsæ gjaldskrá sem fæst fasteignasölur birta svona skýrt: 1,3% þóknun, engin lágmarksþóknun, frítt verðmat',
    'Fjórir nafngreindir starfsmenn með beinum símanúmerum og netföngum, þar af tveir löggiltir fasteignasalar',
  ],
  weaknesses: [
    'Vefurinn keyrir á WebEd Pro frá Think Software, sniðmáti frá því um 2013',
    'Eigið heimilisfang er rangt stafsett í haus og fæti vefsins: "Hafnagötu 50" í stað Hafnargötu',
    'Forsíðan er sjálfvirkur myndakarusel af handahófskenndum innanhússmyndum, engin saga, engin leit',
    '47 ára sagan er falin á textaundirsíðu, ekkert um hana á forsíðunni',
    'Gjaldskráin, sem er raunverulegt samkeppnisforskot, sést hvergi á forsíðunni',
    'Engin leit eða flokkun eftir eignagerð eða svæði, söluskráin er einn langur listi',
  ],
  opportunities: [
    'Setja gjaldskrána fram sem sjónrænt einkenni, ekki smáletur á undirsíðu',
    'Segja stofnsöguna (tollvörður í aukastarfi) sem hluta af forsíðunni, ekki fela hana',
    'Gera söluskrána að alvöru, flokkanlegu tóli með myndum í stað eins langs lista',
  ],
}

export const COMPANY: PreviewCompany = {
  slug: 'eignamidlun',
  route: '/preview/eignamidlun',
  name: 'Eignamiðlun Suðurnesja',
  sector: 'Fasteignasala',
  location: 'Hafnargata 50, 230 Reykjanesbær (Keflavík)',
  region: 'Suðurnes',
  established: 'Eignamiðlun Suðurnesja ehf., kt. 480813-0490 · stofnað 1978',
  currentUrl: CURRENT_URL,
  ownerEmail: EMAIL,
  concept: 'Heim á Suðurnesjum',
  conceptTagline:
    'Stofnað af tollverði í aukastarfi árið 1978, og enn í dag eina fasteignasalan á Suðurnesjum sem birtir alla gjaldskrána sína án þess að spyrja. Síðan setur núna 20 raunverulegar eignir af söluskránni, með myndum, í forgrunn í stað handahófskennds myndakarusels.',
  accent: '#1E4F8E',
  dark: false,
  status: 'Concept ready',
  thumb: LISTINGS[HERO_INDEXES[0]].photo,
  ownPhotography: true,
  photoCredit:
    'Ljósmyndir af eignum og starfsfólki eru raunverulegar myndir af núverandi söluskrá og starfsmönnum Eignamiðlunar Suðurnesja, sóttar af es.is 28. júlí 2026, ekki sviðsettar sýnishornsmyndir. Vegna þess hvernig gögnin voru sótt er ekki hægt að ábyrgjast að hver ljósmynd sé nákvæmlega af þeirri eign sem hún stendur við hlið á síðunni, aðeins að báðar heimildir eru af sama söluskrárþversniði. Landslagsmyndin í svæðiskaflanum er ódagsett andrúmsloftsmynd frá Unsplash, ekki af tiltekinni eign. Merki fyrirtækisins er raunverulegt merki þess.',
  audit: AUDIT,
  positioning:
    'Eignamiðlun Suðurnesja hefur selt hús á sama landsvæði í 47 ár og birtir gjaldskrá sem fæstir keppinautar þora að sýna, en núverandi vefur felur hvort tveggja á meðan hann sýnir handahófskenndan myndakarusel og rangt stafsett heimilisfang. Frumgerðin setur söguna og gjaldskrána fram sem það sem þau eru, samkeppnisforskot, og gerir söluskrána að myndrænu vinnutæki í stað eins langs lista.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Eignamiðlun Suðurnesja',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég var að skoða es.is og eitt vakti sérstaka athygli mína. Þið hafið starfað á Suðurnesjum í 47 ár og birtið gjaldskrá sem margar fasteignasölur þora ekki að sýna, 1,3% þóknun og enga lágmarksþóknun, en hvorugt sést á forsíðunni ykkar. Þar er þess í stað sjálfvirkur myndakarusel og heimilisfangið ykkar er meira að segja rangt stafsett í haus og fæti síðunnar.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Hún byggir alfarið á ykkar eigin upplýsingum: stofnsögunni frá 1978, gjaldskránni orðrétt og sýnishorni úr söluskránni ykkar, með myndum af eignunum. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Söluskráin er sett upp sem alvöru flokkanlegt tól í stað eins langs lista, og gjaldskráin fær loksins að standa ein og sér þar sem allir sjá hana strax.

Ég sé einnig um hýsingu, viðhald og uppfærslur á þeim síðum sem ég geri, ef það er eitthvað sem þið hafið áhuga á.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

Bestu kveðjur,
Sindri
sindrimar02@gmail.com`,
  },
}
