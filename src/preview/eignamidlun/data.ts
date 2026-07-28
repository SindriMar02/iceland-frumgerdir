/**
 * EIGNAMIÐLUN SUÐURNESJA — "Hús fyrir hús"
 * ---------------------------------------------------------------------------
 * Fasteignasala í Reykjanesbæ (Keflavík), starfandi frá 1978. Redesign concept.
 *
 * EVERY fact below is taken verbatim from FACTS-eignamidlun.md, itself
 * harvested live from es.is (forsíða, /um_fyrirtaekid, /gjaldskra) on
 * 2026-07-28 in a real browser session — es.is returns 403 to curl/WebFetch
 * on every path including images, so nothing on this page is hot-linked from
 * or fetched directly against es.is. No client photography exists to
 * harvest; no logo could be harvested (disclosed below and in the footer).
 *
 * Sources
 *   es.is /                    company info, founding story, staff, sími
 *   es.is /um_fyrirtaekid       Hannes Arnar Ragnarsson + Halldóra Lúðvíksdóttir,
 *                               2 May 1978, customs-officer side job, 2008 merger
 *   es.is /gjaldskra            full price list, printed verbatim below
 *   es.is homepage söluskrá     the 20 sample listings, "júlí 2026"
 *
 * CONCEPT — their real gjaldskrá (1,3%, engin lágmarksþóknun, frítt verðmat)
 * is a genuine competitive weapon that is invisible on their current site,
 * and their 47-year history is buried on a text subpage. So this page prints
 * both at full display scale: the söluskrá as a real, filterable ledger, and
 * the gjaldskrá as a monument you cannot scroll past without reading.
 */

import type { AuditList, PreviewCompany } from '../companies'

const asset = (p: string) => `${import.meta.env.BASE_URL}eignamidlun/${p}`

/* ── imagery ──────────────────────────────────────────────────────────────
 * No client photography exists to harvest (es.is blocks every fetch). These
 * four plates are vetted Unsplash atmosphere — Reykjanes-adjacent coastline,
 * lava and a lighthouse — none captioned as a specific real location, all
 * disclosed in the footer as staðarmyndir (place-atmosphere), not literal
 * photographs of Eignamiðlun Suðurnesja, its staff, or its listed properties.
 * The söluskrá itself is deliberately typeset data with no house photography
 * on real addresses (hard honesty rule, since none of these homes' actual
 * photos are ours to use).
 *
 * VETTING METHOD: each file was downloaded to a temp path and viewed directly
 * (not taken on caption faith) before being copied into this folder.
 *   lighthouse.jpg  — verified: a real white conical lighthouse on a grassy
 *                     coastal hill. Photo id Pd4LV52qwq0 (Unsplash).
 *   coast-dusk.jpg  — verified: a dark sea stack in the ocean at dusk, warm
 *                     clouds. Photo id (Jan Brennenstuhl, Unsplash).
 *   lava-road.jpg   — verified: a flat moss-covered lava field crossed by a
 *                     single road — the characteristic Reykjanesbraut look.
 *                     Photo id (Balázs Gábor, Unsplash).
 *   moss-detail.jpg — verified: a close crop of undulating lava moss.
 *                     Photo id (Adi Albulescu, Unsplash).
 * None is captioned as a named landmark (no "Reykjanesviti", no "Keflavík
 * höfn") since that exact identification cannot be verified — captions
 * describe only what is visibly true in the frame.
 */
export const IMG = {
  lighthouse: asset('img/lighthouse.jpg'),
  coastDusk: asset('img/coast-dusk.jpg'),
  lavaRoad: asset('img/lava-road.jpg'),
  mossDetail: asset('img/moss-detail.jpg'),
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

/* ── staff (real, as published today) ────────────────────────────────────
 * No headshots exist to harvest — typographic staff cards only. */

export interface StaffMember {
  name: string
  title: string
  phone: string
  phoneHref: string
  email: string
}

export const STAFF: StaffMember[] = [
  {
    name: 'M. Sævar Pétursson',
    title: 'M.Sc. rekstrarverkfræðingur, löggiltur fasteignasali og leigumiðlari',
    phone: '894 2252',
    phoneHref: 'tel:+3548942252',
    email: 'msp@es.is',
  },
  {
    name: 'Erla María Guðmundsdóttir',
    title: 'M.Sc. í fjármálum, löggiltur fasteignasali',
    phone: '869 1808',
    phoneHref: 'tel:+3548691808',
    email: 'erlamaria@es.is',
  },
  {
    name: 'Fannar Orri Sævarsson',
    title: 'Lögfræðingur',
    phone: '420 4050',
    phoneHref: PHONE_HREF,
    email: 'fannar@es.is',
  },
  {
    name: 'Þuríður Jónasdóttir',
    title: 'Ritari og móttaka',
    phone: '420 4050',
    phoneHref: PHONE_HREF,
    email: 'thury@es.is',
  },
]

/* ── söluskrá — the 20 real sample listings, verbatim ────────────────────
 * Labeled on page as required: "Sýnishorn úr söluskrá, júlí 2026". */

export type ListingType = 'Fjölbýli' | 'Raðhús' | 'Einbýli' | 'Atvinnuhúsnæði'

export interface Listing {
  address: string
  town: string
  type: ListingType
  sqm: number
  rooms: number
  price: string
  /** Numeric price for sort/display math; null for "Tilboð" (offer, no listed number). */
  priceValue: number | null
}

const kr = (n: number) => `${n.toLocaleString('is-IS')} kr`

export const LISTINGS: Listing[] = [
  { address: 'Heiðarból 4', town: 'Keflavík', type: 'Fjölbýli', sqm: 77, rooms: 3, price: kr(44_500_000), priceValue: 44_500_000 },
  { address: 'Fífumói 5', town: 'Njarðvík', type: 'Fjölbýli', sqm: 73, rooms: 3, price: kr(44_500_000), priceValue: 44_500_000 },
  { address: 'Akurbraut 10', town: 'Njarðvík', type: 'Raðhús', sqm: 135, rooms: 5, price: kr(89_500_000), priceValue: 89_500_000 },
  { address: 'Dalsbraut 6', town: 'Njarðvík', type: 'Fjölbýli', sqm: 75, rooms: 3, price: kr(51_000_000), priceValue: 51_000_000 },
  { address: 'Brekkustígur 31B', town: 'Njarðvík', type: 'Fjölbýli', sqm: 112, rooms: 4, price: kr(66_000_000), priceValue: 66_000_000 },
  { address: 'Bjarkardalur 26', town: 'Njarðvík', type: 'Fjölbýli', sqm: 85, rooms: 3, price: kr(59_500_000), priceValue: 59_500_000 },
  { address: 'Birkiteigur 33', town: 'Keflavík', type: 'Raðhús', sqm: 179, rooms: 5, price: kr(82_900_000), priceValue: 82_900_000 },
  { address: 'Brimdalur 5', town: 'Njarðvík', type: 'Einbýli', sqm: 161, rooms: 4, price: 'Tilboð', priceValue: null },
  { address: 'Suðurgata 8', town: 'Keflavík', type: 'Fjölbýli', sqm: 64, rooms: 2, price: kr(43_900_000), priceValue: 43_900_000 },
  { address: 'Suðurgata 12', town: 'Sandgerði', type: 'Fjölbýli', sqm: 120, rooms: 6, price: kr(55_900_000), priceValue: 55_900_000 },
  { address: 'Krossmói 5', town: 'Njarðvík', type: 'Fjölbýli', sqm: 90, rooms: 3, price: kr(63_500_000), priceValue: 63_500_000 },
  { address: 'Hólmbergsbraut 13', town: 'Keflavík', type: 'Atvinnuhúsnæði', sqm: 107, rooms: 0, price: kr(45_000_000), priceValue: 45_000_000 },
  { address: 'Garðbraut 86', town: 'Garður', type: 'Einbýli', sqm: 228, rooms: 6, price: kr(86_900_000), priceValue: 86_900_000 },
  { address: 'Fitjabraut 6A', town: 'Njarðvík', type: 'Fjölbýli', sqm: 100, rooms: 3, price: kr(45_000_000), priceValue: 45_000_000 },
  { address: 'Fífumói 8', town: 'Njarðvík', type: 'Raðhús', sqm: 140, rooms: 4, price: kr(67_900_000), priceValue: 67_900_000 },
  { address: 'Akurvellir 1', town: 'Hafnarfjörður', type: 'Fjölbýli', sqm: 90, rooms: 3, price: kr(66_000_000), priceValue: 66_000_000 },
  { address: 'Greniteigur 15', town: 'Keflavík', type: 'Raðhús', sqm: 172, rooms: 5, price: kr(83_900_000), priceValue: 83_900_000 },
  { address: 'Heiðarbraut 1', town: 'Keflavík', type: 'Fjölbýli', sqm: 181, rooms: 5, price: kr(88_000_000), priceValue: 88_000_000 },
  { address: 'Víðidalur 24', town: 'Njarðvík', type: 'Raðhús', sqm: 130, rooms: 3, price: kr(92_900_000), priceValue: 92_900_000 },
  { address: 'Háteigur 54', town: 'Garður', type: 'Raðhús', sqm: 106, rooms: 3, price: kr(64_140_000), priceValue: 64_140_000 },
]

export const LISTINGS_LABEL = 'Sýnishorn úr söluskrá, júlí 2026'

export const LISTING_FILTERS: { label: string; value: ListingType | 'Öll' }[] = [
  { label: 'Öll', value: 'Öll' },
  { label: 'Fjölbýli', value: 'Fjölbýli' },
  { label: 'Raðhús', value: 'Raðhús' },
  { label: 'Einbýli', value: 'Einbýli' },
  { label: 'Atvinnuhúsnæði', value: 'Atvinnuhúsnæði' },
]

/* ── editorial interstitial cards — injected into the söluskrá grid ──────
 * The ERA-manner device: short editorial cards woven between data rows at
 * computed positions (device 6). Full versions of both stories live in
 * their own sections elsewhere on the page; these are the condensed echo. */

export const EDITORIAL_CARDS = [
  {
    kind: 'saga' as const,
    tag: 'Síðan 1978',
    line: 'Fjórar kynslóðir kaupenda á Suðurnesjum. Sama fyrirtæki, allan tímann.',
  },
  {
    kind: 'gjaldskra' as const,
    tag: 'Gjaldskrá',
    line: '1,3% og engin lágmarksþóknun. Sagt beint út, ekki falið.',
  },
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
    'Engin leit eða flokkun eftir eignagerð, söluskráin er einn langur listi',
    'Ekkert merki, aðeins skreytt húsatákn án sjónrænnar sérstöðu',
  ],
  opportunities: [
    'Setja gjaldskrána fram sem sjónrænt einkenni, ekki smáletur á undirsíðu',
    'Segja stofnsöguna (tollvörður í aukastarfi) sem hluta af forsíðunni, ekki fela hana',
    'Gera söluskrána að alvöru, flokkanlegu tóli í stað eins langs lista',
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
  concept: 'Hús fyrir hús',
  conceptTagline:
    'Stofnað af tollverði í aukastarfi árið 1978, og enn í dag eina fasteignasalan á Suðurnesjum sem birtir alla gjaldskrána sína án þess að spyrja. Síðan setur báðar staðreyndir fram af fullum þunga: söguna og töluna 1,3%.',
  accent: '#C1571F',
  dark: false,
  status: 'Concept ready',
  thumb: IMG.lavaRoad,
  photoCredit:
    'Ljósmyndir eru andrúmsloftsmyndir frá Unsplash sem sýna landslag á borð við hraun, strönd og vita, ekki raunverulegar myndir af Eignamiðlun Suðurnesja, starfsfólki þeirra eða eignum á söluskrá. Merki fyrirtækisins var ekki hægt að nálgast (vefur þeirra hafnar allri sjálfvirkri sókn), svo nafnið er hér sett fram í texta.',
  audit: AUDIT,
  positioning:
    'Eignamiðlun Suðurnesja hefur selt hús á sama landsvæði í 47 ár og birtir gjaldskrá sem fæstir keppinautar þora að sýna, en núverandi vefur felur hvort tveggja á meðan hann sýnir handahófskenndan myndakarusel og rangt stafsett heimilisfang. Frumgerðin setur söguna og gjaldskrána fram sem það sem þau eru, samkeppnisforskot, og gerir söluskrána að vinnutæki í stað eins langs lista.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Eignamiðlun Suðurnesja',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég var að skoða es.is og eitt vakti sérstaka athygli mína. Þið hafið starfað á Suðurnesjum í 47 ár og birtið gjaldskrá sem margar fasteignasölur þora ekki að sýna, 1,3% þóknun og enga lágmarksþóknun, en hvorugt sést á forsíðunni ykkar. Þar er þess í stað sjálfvirkur myndakarusel og heimilisfangið ykkar er meira að segja rangt stafsett í haus og fæti síðunnar.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Hún byggir alfarið á ykkar eigin upplýsingum: stofnsögunni frá 1978, gjaldskránni orðrétt og sýnishorni úr söluskránni ykkar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

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
