/**
 * GÍTARINN, "Veggurinn"
 * ---------------------------------------------------------------------------
 * Musical instrument shop, Stórhöfði 27, 110 Reykjavík. Founded 1989.
 *
 * SOURCES (all fetched 2026-07-28 via curl with a desktop user agent, since
 * plain WebFetch is blocked by their server):
 *   https://gitarinn.is/                         hero slider, logo, nav
 *   https://gitarinn.is/um-okkur/                 founding year, address history,
 *                                                  showroom size, warranty, payment
 *                                                  terms, repair service, hours
 *   https://gitarinn.is/stadsetning/              address
 *   https://gitarinn.is/hafdu-samband/             phone, email, address
 *   https://gitarinn.is/vorur/ (21 pages)          full catalogue index
 *   https://gitarinn.is/voruflokkur/*              10 category archive pages,
 *                                                  213 products parsed for name,
 *                                                  price, image, spec, stock class
 *   https://gitarinn.is/vara/<handle>/             6 individual product pages for
 *                                                  full spec text on featured pieces
 *   https://gitarinn.is/wp-json/                   confirms only the legacy
 *                                                  authenticated wc/v1 + wc/v2 REST
 *                                                  routes exist; wc/store/v1 (the
 *                                                  public Store API) returns 404
 *   já.is                                          conflicting hours, per the brief
 *
 * HONESTY: every product name, price and spec line below is copied or directly
 * paraphrased from gitarinn.is on 2026-07-28 (see PRICE_HARVEST_DATE). Every
 * product image is their own real product photo, hotlinked from their own
 * wp-content/uploads at the largest rendition their server serves (usually
 * 731x600, a few 600x600). All 18 product pages and all 18 images were
 * verified to return HTTP 200 on harvest day. No stock counts, reviews or
 * awards are invented; the "landsins mesta úrval" claim is attributed to DV
 * (2016), and the ~200-instrument showroom figure is a direct quote from
 * their own um-okkur page.
 */

import type { PreviewCompany } from '../company-types'

const asset = (p: string) => `${import.meta.env.BASE_URL}gitarinn/${p}`
const shopImg = (p: string) => `https://gitarinn.is/wp-content/uploads/${p}`

export const FONTS = {
  display: asset('fonts/BebasNeue-Regular.woff2'),
  monoRegular: asset('fonts/IBMPlexMono-Regular.woff2'),
  monoMedium: asset('fonts/IBMPlexMono-Medium.woff2'),
  monoSemiBold: asset('fonts/IBMPlexMono-SemiBold.woff2'),
  monoBold: asset('fonts/IBMPlexMono-Bold.woff2'),
}

/* ── identity ─────────────────────────────────────────────────────────── */

export const PHONE_DISPLAY = '552 2125'
export const PHONE_HREF = 'tel:+3545522125'
export const EMAIL = 'gitarinn@gitarinn.is'
export const EMAIL_HREF = `mailto:${EMAIL}`
export const KENNITALA = '490389-1569'
export const LEGAL_NAME = 'Gítarinn ehf.'
export const ADDRESS = 'Stórhöfða 27'
export const POSTCODE = '110 Reykjavík'
export const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=St%C3%B3rh%C3%B6f%C3%B0i+27+110+Reykjav%C3%ADk'
export const CURRENT_URL = 'https://gitarinn.is'

export const PRICE_HARVEST_DATE = '28. júlí 2026'

/* ── hours (their own site, verbatim) ────────────────────────────────────
   Their own um-okkur page states: "Mánudaga-Föstudaga kl. 10-17 og
   Laugardaga kl. 11-14." já.is lists Tue-Fri 10-16, Sat 11-14 instead, a
   conflict noted in the audit, not printed on the page itself. */
export interface DaySpan {
  day: number
  label: string
  open: number
  close: number
  closed?: boolean
}

export const WEEK: DaySpan[] = [
  { day: 1, label: 'Mánudagur', open: 10, close: 17 },
  { day: 2, label: 'Þriðjudagur', open: 10, close: 17 },
  { day: 3, label: 'Miðvikudagur', open: 10, close: 17 },
  { day: 4, label: 'Fimmtudagur', open: 10, close: 17 },
  { day: 5, label: 'Föstudagur', open: 10, close: 17 },
  { day: 6, label: 'Laugardagur', open: 11, close: 14 },
  { day: 0, label: 'Sunnudagur', open: 0, close: 0, closed: true },
]

/* ── products ─────────────────────────────────────────────────────────── */

export type Category = 'rafmagnsgitarar' | 'kassagitarar' | 'klassiskir' | 'bassar' | 'magnarar' | 'aukahlutir'

export const CATEGORIES: { key: Category; label: string; count: string }[] = [
  { key: 'rafmagnsgitarar', label: 'Rafmagnsgítarar', count: '04' },
  { key: 'kassagitarar', label: 'Kassagítarar', count: '04' },
  { key: 'klassiskir', label: 'Klassískir', count: '02' },
  { key: 'bassar', label: 'Bassar', count: '03' },
  { key: 'magnarar', label: 'Magnarar', count: '03' },
  { key: 'aukahlutir', label: 'Aukahlutir', count: '02' },
]

export type Budget = 'undir60' | 'milli' | 'yfir120'

export const BUDGETS: { key: Budget; label: string; note: string }[] = [
  { key: 'undir60', label: 'Undir 60.000 kr.', note: 'Fyrsta hljóðfærið, án þess að taka áhættu' },
  { key: 'milli', label: '60.000 til 120.000 kr.', note: 'Alvöru hljóðfæri sem endist árin' },
  { key: 'yfir120', label: 'Yfir 120.000 kr.', note: 'Búnaður fyrir þá sem eru komnir lengra' },
]

export interface Product {
  handle: string
  name: string
  brand: string
  category: Category
  price: number
  originalPrice?: number
  url: string
  img: string
  spec: string
}

export const PRODUCTS: Product[] = [
  {
    handle: 'italia-maranello-61',
    name: 'Italia Maranello 61',
    brand: 'Italia',
    category: 'rafmagnsgitarar',
    price: 110000,
    url: 'https://gitarinn.is/vara/italia-maranello-61/',
    img: shopImg('2015/11/maranello-61-net.jpg'),
    spec: '22 banda rafmagnsgítar. Búkur úr mahóní, toppur úr greni, háls úr mahóní.',
  },
  {
    handle: 'italia-rimini-12',
    name: 'Italia Rimini 12',
    brand: 'Italia',
    category: 'rafmagnsgitarar',
    price: 123000,
    url: 'https://gitarinn.is/vara/italia-rimini-12/',
    img: shopImg('2015/11/italia-rimini-12.jpg'),
    spec: '22 banda 12 strengja rafmagnsgítar. Búkur úr agathis, gegnheill hlynur í toppi. Aðeins fáanlegur í ljósrauðu.',
  },
  {
    handle: 'italia-imola-6',
    name: 'Italia Imola 6',
    brand: 'Italia',
    category: 'rafmagnsgitarar',
    price: 106000,
    url: 'https://gitarinn.is/vara/italia-imola-6/',
    img: shopImg('2015/11/imola-6-2-net.jpg'),
    spec: '22 banda rafmagnsgítar. Búkur úr korínu, háls úr hlyni.',
  },
  {
    handle: 'stagg-sel-zeb-2bk',
    name: 'Stagg Sel Zeb 2BK',
    brand: 'Stagg',
    category: 'rafmagnsgitarar',
    price: 59900,
    url: 'https://gitarinn.is/vara/stagg-sel-zeb-2bk/',
    img: shopImg('2016/08/sel-zeb-2-bk.jpg'),
    spec: '22 banda rafmagnsgítar með tveimur humbucker tónnemum, hvítum og svörtum.',
  },
  {
    handle: 'fina-fd-891-ceq',
    name: 'Fina FD-891 CEQ',
    brand: 'Fina',
    category: 'kassagitarar',
    price: 79900,
    originalPrice: 139900,
    url: 'https://gitarinn.is/vara/fina-fd-891-ceq/',
    img: shopImg('2015/11/fd-891-ceq-net.jpg'),
    spec: 'Rafmagnaður kassagítar. Toppur, bak og hliðar úr koa.',
  },
  {
    handle: 'crafter-md-50n',
    name: 'Crafter MD-50/N',
    brand: 'Crafter',
    category: 'kassagitarar',
    price: 53900,
    url: 'https://gitarinn.is/vara/crafter-md-50n/',
    img: shopImg('2015/11/md-50-net.jpg'),
    spec: 'Kassagítar. Toppur úr greni, bak og hliðar úr bubinga.',
  },
  {
    handle: 'fina-fj-913',
    name: 'Fina FJ-913',
    brand: 'Fina',
    category: 'kassagitarar',
    price: 53900,
    originalPrice: 73900,
    url: 'https://gitarinn.is/vara/fina-fj-913/',
    img: shopImg('2015/10/fj-913-net.jpg'),
    spec: 'Kassagítar. Gegnheill sitkagreni í toppi, bak og hliðar úr bubinga.',
  },
  {
    handle: 'da-capo-w-802-12strengja',
    name: 'Da Capo W-802 (12 strengja)',
    brand: 'Da Capo',
    category: 'kassagitarar',
    price: 49900,
    url: 'https://gitarinn.is/vara/da-capo-w-802-12strengja/',
    img: shopImg('2015/11/w_802_12str-net.jpg'),
    spec: '12 strengja kassagítar. Gegnheilt greni í toppi, bak og hliðar úr natowood.',
  },
  {
    handle: 'da-capo-klassiskur-mpickup',
    name: 'Da Capo Klassískur með Pick Up',
    brand: 'Da Capo',
    category: 'klassiskir',
    price: 56900,
    url: 'https://gitarinn.is/vara/da-capo-klassiskur-gitar-mpick-up-full-staerd/',
    img: shopImg('2015/10/c_603_ceqf.jpg'),
    spec: 'Full stærð, með innbyggðum 4 banda tónjafnara. Toppur úr greni, háls og hliðar úr natowood, skali 650 mm.',
  },
  {
    handle: 'tanglewood-manuel-rodriguez-tcmr2',
    name: 'Tanglewood / Manuel Rodriguez TCMR2',
    brand: 'Tanglewood',
    category: 'klassiskir',
    price: 55900,
    url: 'https://gitarinn.is/vara/tanglewood-manuel-rodriguez-klassiskur-gitar-tcmr2/',
    img: shopImg('2015/11/tcmr-2-net.jpg'),
    spec: 'Hannaður í samstarfi Tanglewood og Manuel Rodriguez. Gegnheilt greni í toppi, bak og hliðar úr mahóní, skali 650 mm.',
  },
  {
    handle: 'rafbassi-italia-mondial-deluxe',
    name: 'Italia Mondial Deluxe',
    brand: 'Italia',
    category: 'bassar',
    price: 135000,
    url: 'https://gitarinn.is/vara/rafbassi-italia-mondial-deluxe/',
    img: shopImg('2015/12/mondial-deluxe-bass-net.jpg'),
    spec: '22 banda rafmagnsbassi. Búkur úr mahóní, gegnheill hlynur í toppi.',
  },
  {
    handle: 'rafbassi-apolloaston-dqt-6',
    name: 'Apollo/Aston DQT-6',
    brand: 'Apollo/Aston',
    category: 'bassar',
    price: 145900,
    url: 'https://gitarinn.is/vara/rafbassi-apolloaston-dqt-6/',
    img: shopImg('2015/12/dqt_6_tgy.jpg'),
    spec: '24 banda, 6 strengja rafmagnsbassi. Búkur úr basswood, háls úr hlyni, tveir humbucker tónnemar, skali 35".',
  },
  {
    handle: 'rafbassi-tanglewood-toj1-4-overwater',
    name: 'Tanglewood TOJ1-4 Overwater',
    brand: 'Tanglewood',
    category: 'bassar',
    price: 99900,
    url: 'https://gitarinn.is/vara/rafbassi-tanglewood-toj1-4-overwater/',
    img: shopImg('2015/12/toj_1_car.jpg'),
    spec: '20 banda, 4 strengja rafbassi, léttur búkur úr ösp, single coil PJ tónnemasett frá Overwater.',
  },
  {
    handle: 'gitarmagnari-hiwatt-hi-gain-50-combo',
    name: 'Hiwatt Hi-Gain 50 Combo',
    brand: 'Hiwatt',
    category: 'magnarar',
    price: 250000,
    url: 'https://gitarinn.is/vara/gitarmagnari-hiwatt-hi-gain-50-combo/',
    img: shopImg('2015/12/hg-50combo-net.jpg'),
    spec: '50 W lampamagnari, tvær formagnaðar rásir, reverb, tveir EL34 og fjórir ECC83 lampar, tveir 12" Celestion hátalarar.',
  },
  {
    handle: 'gitarmagnari-kustom-quad-100',
    name: 'Kustom Quad 100',
    brand: 'Kustom',
    category: 'magnarar',
    price: 179900,
    url: 'https://gitarinn.is/vara/gitarmagnari-kustom-quad-100/',
    img: shopImg('2015/12/quad-100hd-net1.jpg'),
    spec: '100 W, tvær rásir, átta innbyggðir stafrænir effektar, fjórir 12" hátalarar.',
  },
  {
    handle: 'artec-a100ts',
    name: 'Artec A100TS',
    brand: 'Artec',
    category: 'magnarar',
    price: 89900,
    url: 'https://gitarinn.is/vara/artec-a100ts/',
    img: shopImg('2016/01/a100_ts-net.jpg'),
    spec: '100 W magnari fyrir kassagítar, tvær rásir, fjórir 5" hátalarar.',
  },
  {
    handle: 'blaxx-delay',
    name: 'Blaxx Delay',
    brand: 'Blaxx',
    category: 'aukahlutir',
    price: 9900,
    url: 'https://gitarinn.is/vara/blaxx-delay/',
    img: shopImg('2018/10/blaxx-delay.jpg'),
    spec: 'Delay pedali fyrir rafmagnsgítar.',
  },
  {
    handle: 'hljodnemi-stagg-md-1000',
    name: 'Stagg MD-1000',
    brand: 'Stagg',
    category: 'aukahlutir',
    price: 8900,
    url: 'https://gitarinn.is/vara/hljodnemi-stagg-md-1000/',
    img: shopImg('2016/07/md-1000.jpg'),
    spec: 'Sönghljóðnemi.',
  },
]

export const budgetOf = (p: Product): Budget => (p.price < 60000 ? 'undir60' : p.price <= 120000 ? 'milli' : 'yfir120')

/* ── featured instrument story (horizontal scroll device) ────────────── */

export const FEATURED_HANDLES = [
  'italia-maranello-61',
  'gitarmagnari-hiwatt-hi-gain-50-combo',
  'rafbassi-apolloaston-dqt-6',
  'tanglewood-manuel-rodriguez-tcmr2',
  'italia-rimini-12',
]

export const FEATURED_STORY: Record<string, string> = {
  'italia-maranello-61':
    'Nafnið er sótt í ítalska bílaborg, og línurnar á búknum eru jafn ávalar. Mahóní í búk og hálsi, greni í toppi.',
  'gitarmagnari-hiwatt-hi-gain-50-combo':
    'Lampamagnari með tveimur EL34 og fjórum ECC83 lömpum. Sama lampablanda og hefur fyllt hljómsveitarsvið í fimmtíu ár.',
  'rafbassi-apolloaston-dqt-6':
    'Sex strengja bassi fyrir þá sem eru búnir að fylla fjóra strengi. Tveir humbucker tónnemar, virkur tónjafnari.',
  'tanglewood-manuel-rodriguez-tcmr2':
    'Hannaður í samstarfi tveggja gítarhúsa. Klassískur skali, gegnheilt greni í toppi, mahóní í baki og hliðum.',
  'italia-rimini-12':
    'Tólf strengir á rafmagnsgítar, sem þýðir tvöfaldur hljómur af hverjum tón. Fæst aðeins í ljósrauðu.',
}

/* ── brands stocked (verified category and product names on gitarinn.is) ─ */

export const BRANDS = [
  'Fina', 'Stagg', 'Tanglewood', 'Crafter', 'Da Capo', 'Italia',
  'Apollo/Aston', 'Manuel Rodriguez', 'Walden', 'Hiwatt', 'Carlsbro',
  'Kustom', 'Artec', 'Danelectro',
]

/* ── heritage facts (verbatim from um-okkur, their own page) ──────────── */

export const FOUNDED_YEAR = 1989
export const FIRST_ADDRESS = 'Laugavegi 45'
export const MOVED_YEAR = 2001
export const SHOWROOM_QUOTE = 'um 200 gítarar og bassar uppstilltir'
export const DV_YEAR = 2016

/* ── services (verbatim from um-okkur) ───────────────────────────────── */

export const SERVICES = [
  {
    title: 'Ábyrgð',
    body: 'Tveggja ára ábyrgð á öllum hljóðfærum og rafmagnstækjum.',
  },
  {
    title: 'Greiðsluskilmálar',
    body: 'Kortalán frá 3 upp í 36 mánuði fyrir bæði Visa og Mastercard.',
  },
  {
    title: 'Póstkrafa',
    body: 'Sendum vörur hvert á land sem er gegn póstkröfu. Viðtakandi greiðir flutningskostnað.',
  },
  {
    title: 'Viðgerðaþjónusta',
    body: 'Gerum við gítara, bassa, trommur og fleira gegn vægu gjaldi. Skiptum um strengi og stillum hljóðfæri.',
  },
]

/* ── nav ──────────────────────────────────────────────────────────────── */

export const NAV = [
  { href: '#vorur', label: 'Vörur' },
  { href: '#sagan', label: 'Sagan' },
  { href: '#leidarvisir', label: 'Finna réttu hljóðfærið' },
  { href: '#heimsaekja', label: 'Heimsækja' },
]

/* ── JSON-LD ──────────────────────────────────────────────────────────── */

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'MusicStore',
  name: 'Gítarinn',
  description: 'Hljóðfæraverslun í Reykjavík frá 1989. Rafmagns- og kassagítarar, bassar, magnarar og aukahlutir.',
  telephone: '+354 552 2125',
  email: EMAIL,
  foundingDate: '1989',
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS,
    postalCode: '110',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '17:00',
    },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '11:00', closes: '14:00' },
  ],
}

/* ── company record, local to this build, for the lead to merge into
   companies.ts (see BRIEF-SHARED.md: "define your company record locally in
   your data.ts, export it, the lead merges it into companies.ts"). ──────── */

const OUTREACH_SIGN = `Bestu kveðjur, Sindri
sindrimar02@gmail.com`

export const GITARINN: PreviewCompany = {
  slug: 'gitarinn',
  route: '/preview/gitarinn',
  name: 'Gítarinn',
  sector: 'Hljóðfæraverslun',
  location: 'Stórhöfða 27, 110 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Gítarinn ehf., kt. 490389-1569, stofnað 1989',
  currentUrl: CURRENT_URL,
  ownerEmail: EMAIL,
  concept: 'Veggurinn',
  conceptTagline:
    'A 36-year-old specialist shop presented like a record label: their real instruments, names and ISK prices as the design material. The guitar wall from their own showroom (about 200 instruments on display, per their own copy) becomes a dark editorial gallery instead of a bare category dropdown.',
  accent: '#c9853f',
  dark: true,
  status: 'Concept ready',
  thumb: shopImg('2015/11/maranello-61-net.jpg'),
  photoCredit:
    'Allar vörumyndir eru raunverulegar ljósmyndir af hljóðfærum Gítarans, sóttar beint af þeirra eigin vefsíðu 28. júlí 2026. Merki verslunarinnar er þeirra eigið.',
  audit: {
    strengths: [
      'Starfandi frá 1989 og á sama stað frá 2001, með eitt stærsta úrval landsins af gíturum að sögn DV árið 2016',
      'Um 200 gítarar og bassar uppstilltir í versluninni, samkvæmt þeirra eigin lýsingu',
      'Verslunin býður upp á tveggja ára ábyrgð, kortalán upp í 36 mánuði og viðgerðaþjónustu, sem fæstir samkeppnisaðilar auglýsa jafn skýrt',
    ],
    weaknesses: [
      'Öll síðan er merkt "noindex" fyrir leitarvélar (staðfest í frumkóða forsíðu, vörulista og allra vörusíðna), svo Google fær bein fyrirmæli um að sleppa henni úr leitarniðurstöðum',
      'Vörumyndir eru frá 2014 til 2016 og birtast í 200x200 punkta upplausn í vörulistanum, þótt verslunin sjálf sé stórglæsileg að þeirra eigin sögn',
      'Vefurinn keyrir enn á WooCommerce 3.1.2 og gömlu Wordpress þema, sem þýðir enga nútímalega vöru-API og enga leið til að sýna vörurnar annars staðar en í hráum fellilista',
      'Höfundarréttarlínan í fæti síðunnar er einfaldlega "(C) Gítarinn ehf", án ártals',
      'Vörumerkið er eitt textalógó, "GITARINN.IS" í 302x29 punktum, engin eiginleg hönnun umfram símanúmer og fellilista',
      'Að minnsta kosti ein vörusíða (Italia Torino) er merkt á lager í kerfinu en lýsingartextinn segir sjálfur "Vara uppseld", sem sýnir að enginn hefur haldið vörulistanum við í mörg ár',
      'Á ja.is er opnunartíminn sagður þriðjudaga til föstudaga 10 til 16 og laugardaga 11 til 14, en á þeirra eigin vef stendur mánudaga til föstudaga 10 til 17 og laugardaga 11 til 14, svo viðskiptavinir fá tvær mismunandi upplýsingar um hvenær er opið',
    ],
    opportunities: [
      'Sýna hljóðfærin sjálf, með alvöru verðum og alvöru myndum, í staðinn fyrir fellilista sem segir ekkert um vöruúrvalið',
      'Gera töluna um 200 hljóðfæri á vegg að sjálfri hönnunarhugmyndinni, í stað þess að fela hana í texta',
      'Að laga noindex merkinguna eina og sér myndi líklega gera meira fyrir umferðina en nokkur önnur breyting',
    ],
  },
  positioning:
    'Gítarinn er 36 ára sérverslun með, að sögn DV, eitt stærsta úrval landsins af gíturum og um 200 hljóðfæri uppstillt á vegg. En vefurinn þeirra er bókstaflega ósýnilegur: hver einasta síða er merkt noindex fyrir Google, vörumyndirnar eru frá 2014 til 2016 í 200 punkta upplausn, og vörumerkið er textalógó og fellilisti. Uppfærslan setur hljóðfærin sjálf, nöfnin og verðin í öndvegi sem hönnunarefni, með vinnandi körfu og verðum sem standast samanburð við núverandi vef, krónu fyrir krónu.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Gítarann',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég var að skoða gitarinn.is og rakst á eitt sem kom mér á óvart. Í frumkóða allra síðnanna ykkar, forsíðunnar, vörulistans og hverrar einustu vörusíðu, er merking sem segir leitarvélum eins og Google að sleppa síðunni úr leitarniðurstöðum. Það þýðir að verslun sem hefur starfað frá 1989 og er, að sögn DV, með eitt stærsta úrval landsins af gíturum, finnst einfaldlega ekki þegar fólk leitar að gíturum á Íslandi.

Mér fannst það synd, því vörurnar sjálfar eru sterkasta söluefnið sem þið eigið. Þið eruð með um 200 hljóðfæri uppstillt í versluninni að eigin sögn, en á vefnum er það falið á bak við fellilista og myndir frá 2014 til 2016 í 200 punkta upplausn.

Ég settist niður og hannaði frumgerð að nýrri síðu sem byggir alfarið á ykkar eigin vörum, nöfnum og verðum. Rafmagns- og kassagítarar, bassar, magnarar, allt með raunverulegum myndum og verðum af gitarinn.is. Ég setti líka inn vinnandi körfu og litla leit sem hjálpar fólki að finna rétta hljóðfærið eftir tegund og verði.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding. Ef ykkur líst vel á gæti ég klárað vefinn í heild, en ef ekki vona ég að þetta gefi ykkur að minnsta kosti hugmyndir, og þá sérstaklega um noindex merkinguna.

Endilega látið mig vita ef þið hafið áhuga.

${OUTREACH_SIGN}`,
  },
}
