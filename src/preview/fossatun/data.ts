/**
 * FOSSATÚN — "Árið í Fossatúni"
 * ---------------------------------------------------------------------------
 * Country hotel, camping pods, cottage, campsite, restaurant and a troll
 * folklore trail in Borgarfjörður, West Iceland.
 *
 * EVERY fact below is taken from fossatun.is, fetched and verified 2026-07-29,
 * or from the dated third-party source named beside it. Nothing is inferred.
 *
 * WHAT IS DELIBERATELY ABSENT: room prices. Their own site says the price
 * "comes up when you click the booking knob", i.e. it is not published as a
 * public rate. So no nightly rate is printed anywhere on this page as fact.
 * The booking prototype uses a clearly-labelled SAMPLE rate (see booking.ts)
 * so the engine can be demonstrated, and says so on screen.
 *
 * Sources
 *   fossatun.is/                     hero copy, Troll10 direct discount, closure
 *   fossatun.is/country-hotel/       12 rooms, 18,2 m², 9 double + 3 twin, what is included
 *   fossatun.is/camping-pods/        8 pods, showers, kitchenette, hot tubs
 *   fossatun.is/trollgarden/         Steinar Berg, the books, admission, trail hours
 *   fossatun.is/rock-n-troll-restaurant/  the restaurant
 *   fossatun.is/vinyl-collection-and-grasasnar/  the vinyl collection
 *   mbl.is 2025-03-12 + iston.is     heiðursverðlaun Íslensku tónlistarverðlaunanna 2025
 */

export const NAME = 'Fossatún'
export const REGION = 'Borgarfjörður'
export const CURRENT_URL = 'https://fossatun.is'
export const EMAIL = 'reservations@fossatun.is'
export const EMAIL_HREF = `mailto:${EMAIL}`
export const PHONE_DISPLAY = '433 5800'
export const PHONE_HREF = 'tel:+3544335800'

/** Their own live booking hand-off, kept so the audit can point at it honestly. */
export const CURRENT_BOOKING_HOST = 'bemarchannel.eu'

/** Published on their own front page. Their number, not ours. */
export const DIRECT_DISCOUNT_CODE = 'Troll10'

/* ── the year ─────────────────────────────────────────────────────────────
   The page's spine. `open` is the business, `trail` is the Trollgarden,
   both taken from their own published hours. Do not soften "lokað": being
   shut for two months is a real fact a guest needs before they plan.        */

export type TrailState = 'daily' | 'weekends' | 'closed'

export interface MonthState {
  n: number
  /** Icelandic month name, nominative. */
  name: string
  short: string
  open: boolean
  trail: TrailState
  /** One honest line about the light. No invented weather claims. */
  light: string
  /** What a guest can actually book that month. */
  offer: string
}

export const YEAR: MonthState[] = [
  { n: 1, name: 'janúar', short: 'jan', open: false, trail: 'closed',
    light: 'Stystu dagarnir. Fossatún er lokað.',
    offer: 'Lokað í janúar.' },
  { n: 2, name: 'febrúar', short: 'feb', open: true, trail: 'closed',
    light: 'Dagurinn lengist hratt og myrkrið er enn nógu djúpt fyrir norðurljós.',
    offer: 'Hótelið opið. Tröllagarðurinn opnar aftur í apríl.' },
  { n: 3, name: 'mars', short: 'mar', open: true, trail: 'closed',
    light: 'Jafndægur að vori. Jafn langur dagur og nótt.',
    offer: 'Hótelið opið. Tröllagarðurinn opnar aftur í apríl.' },
  { n: 4, name: 'apríl', short: 'apr', open: true, trail: 'weekends',
    light: 'Bjart fram á kvöld og fyrstu grænu dagarnir í Borgarfirði.',
    offer: 'Hótelið opið og Tröllagarðurinn um helgar.' },
  { n: 5, name: 'maí', short: 'maí', open: true, trail: 'daily',
    light: 'Nóttin hverfur. Héðan í frá er bjart langt fram yfir háttatíma.',
    offer: 'Allt opið. Tröllagarðurinn daglega klukkan 10 til 17.' },
  { n: 6, name: 'júní', short: 'jún', open: true, trail: 'daily',
    light: 'Bjartasti mánuðurinn. Sólin sest varla.',
    offer: 'Allt opið. Tjaldsvæðið, pods, cottage og hótel.' },
  { n: 7, name: 'júlí', short: 'júl', open: true, trail: 'daily',
    light: 'Hlýjasti tíminn og enn albjart á kvöldin.',
    offer: 'Allt opið. Annasamasti tíminn, best að bóka snemma.' },
  { n: 8, name: 'ágúst', short: 'ágú', open: true, trail: 'daily',
    light: 'Myrkrið laumast aftur inn og fyrstu norðurljósin sjást.',
    offer: 'Allt opið. Síðasti mánuður Tröllagarðsins daglega.' },
  { n: 9, name: 'september', short: 'sep', open: true, trail: 'weekends',
    light: 'Haustlitir í Borgarfirði og norðurljósin komin á fullt.',
    offer: 'Hótelið opið og Tröllagarðurinn um helgar.' },
  { n: 10, name: 'október', short: 'okt', open: true, trail: 'weekends',
    light: 'Dimmar nætur, rólegri tími og færri gestir.',
    offer: 'Hótelið opið og Tröllagarðurinn um helgar.' },
  { n: 11, name: 'nóvember', short: 'nóv', open: true, trail: 'closed',
    light: 'Vetur genginn í garð og nóttin löng.',
    offer: 'Hótelið opið. Tröllagarðurinn lokaður.' },
  { n: 12, name: 'desember', short: 'des', open: false, trail: 'closed',
    light: 'Skemmsti dagur ársins. Fossatún er lokað.',
    offer: 'Lokað í desember.' },
]

/* ── what they rent ──────────────────────────────────────────────────────── */

export interface StayType {
  id: string
  name: string
  count: string
  /** Verbatim-grounded description. No invented amenities. */
  blurb: string
  facts: string[]
  img: string
  imgAlt: string
  /** Months this is realistically sold. Campsite and pods are summer things. */
  months: number[]
}

export const STAYS: StayType[] = [
  {
    id: 'hotel',
    name: 'Sveitahótelið',
    count: '12 herbergi',
    blurb:
      'Tólf herbergi, hvert um sig 18,2 fermetrar með sérbaðherbergi. Níu tveggja manna herbergi og þrjú með aðskildum rúmum.',
    facts: [
      'Morgunverðarhlaðborð á veitingastaðnum',
      'Rúmföt og handklæði fylgja',
      'Sjónvarp, lítill ísskápur, örbylgjuofn og ketill',
      'Þráðlaust net og aðgangur að eldhúsi',
    ],
    img: 'hotel-room',
    imgAlt: 'Herbergi á sveitahótelinu í Fossatúni',
    months: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'pods',
    name: 'Camping pods',
    count: '8 einingar',
    blurb:
      'Átta camping pods með aðgangi að sturtum og snyrtingum, eldhúskrók og heitum pottum. Einfaldasta leiðin til að sofa úti í náttúrunni án þess að tjalda.',
    facts: [
      'Aðgangur að sturtum og snyrtingum',
      'Eldhúskrókur',
      'Heitir pottar',
    ],
    img: 'pod',
    imgAlt: 'Camping pod í Fossatúni',
    months: [5, 6, 7, 8, 9],
  },
  {
    id: 'cottage',
    name: 'Sunset Cottage',
    count: 'Sérstakt hús',
    blurb: 'Sérstakt hús á staðnum fyrir þá sem vilja meira næði.',
    facts: [],
    img: 'cottage',
    imgAlt: 'Sunset Cottage í Fossatúni',
    months: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 'camp',
    name: 'Tjaldsvæðið',
    count: 'Við ána',
    blurb: 'Tjaldsvæði við Grímsá, í göngufæri við veitingastaðinn og Tröllagarðinn.',
    facts: [],
    img: 'camp',
    imgAlt: 'Tjaldsvæðið í Fossatúni',
    months: [6, 7, 8],
  },
]

/* ── the troll trail ─────────────────────────────────────────────────────── */

export const TROLL = {
  admissionAdult: 600,
  admissionChild: 300,
  admissionNote: 'Fullorðnir og börn 12 ára og eldri 600 kr. Börn 5 til 11 ára 300 kr.',
  hoursSummer: 'Maí til ágúst, daglega klukkan 10 til 17',
  hoursShoulder: 'Apríl, september og október, um helgar',
  hoursWinter: 'Utan tímabils eftir samkomulagi fyrir hópa',
  origin:
    'Steinar Berg fann klett í laginu eins og tröllsandlit við Tröllafossa og skrifaði í kjölfarið þjóðsögur um tröllin í Borgarfirði.',
  books: [
    { title: 'Tryggðatröll', note: 'Íslensk þjóðsaga um síðasta tröllið' },
    { title: 'Trunt Trunt', note: 'Tólf sögur af tröllum, álfum og fólki á Vesturlandi' },
  ],
  languages: ['íslenska', 'enska', 'franska', 'þýska', 'norska', 'japanska', 'spænska'],
}

/* ── the music ───────────────────────────────────────────────────────────── */

export const MUSIC = {
  /** Verified: mbl.is 2025-03-12 and iston.is. Ceremony 12 March 2025, Silfurberg, Harpa. */
  award: 'Steinar Berg tók við heiðursverðlaunum Íslensku tónlistarverðlaunanna í mars 2025.',
  awardSourceLabel: 'Íslensku tónlistarverðlaunin, mars 2025',
  restaurant: "Rock 'n' Troll",
  collection: 'Grasasnar',
  blurb:
    'Veitingastaðurinn heitir Rock ’n’ Troll og vínylsafn Steinars er á staðnum. Gestir geta valið sér tónlist af safninu yfir matnum.',
}

/* ── audit of the site as it stands, for the outreach record ─────────────── */

export const AUDIT = {
  strengths: [
    'Einstakur efniviður: foss, tröllasögur, vínylsafn og veitingastaður með nafni',
    'Fjórar ólíkar gerðir gistingar á sama stað, frá tjaldsvæði upp í hótel',
    'Tröllagarðurinn er sjálfstætt aðdráttarafl með eigin aðgangseyri',
    'Eigandinn er þekktur í íslensku tónlistarlífi og fékk heiðursverðlaun 2025',
  ],
  weaknesses: [
    'WordPress 7.0.2 með myndasleða á forsíðu. Sérkenni staðarins sjást hvergi.',
    'Bókun fer fram á bemarchannel.eu, öðru léni sem ber engan svip af Fossatúni.',
    'Troll10 afsláttarkóðinn á að draga bókanir beint til þeirra en er sleginn inn á þeirri síðu.',
    'Miðar í Tröllagarðinn seljast eingöngu á staðnum, ekki á vefnum.',
    'Hvergi kemur skýrt fram á forsíðu að lokað sé í desember og janúar.',
  ],
  opportunities: [
    'Beina bókun heim á þeirra eigið lén svo afslátturinn vinni þar sem hann á að vinna',
    'Selja miða í Tröllagarðinn fyrirfram',
    'Gjafabréf á gistingu og kvöldverð',
    'Láta árstíðina stýra vefnum, enda er reksturinn árstíðabundinn',
  ],
}

/* ── the catalogue entry ─────────────────────────────────────────────────── */

import type { PreviewCompany } from '../companies'

export const FOSSATUN_ENTRY: PreviewCompany = {
  slug: 'fossatun',
  route: '/preview/fossatun',
  name: 'Fossatún',
  sector: 'Sveitahótel og veitingar',
  location: 'Borgarfjörður',
  region: 'Vesturland',
  established: 'Tröllagarðurinn og bækurnar eftir Steinar Berg',
  currentUrl: CURRENT_URL,
  ownerEmail: EMAIL,
  concept: 'Árið í Fossatúni',
  conceptTagline:
    'Árstíðin stýrir síðunni, því árstíðin stýrir rekstrinum. Bókunin kemur heim á þeirra eigið lén.',
  accent: '#46604c',
  dark: false,
  status: 'Concept ready',
  thumb: 'fossatun/img/landscape-fjord-valley-01.jpg',
  ownPhotography: true,
  audit: AUDIT,
  positioning:
    'Sveitahótel með tólf herbergjum, átta camping pods, cottage og tjaldsvæði, veitingastað sem heitir Rock ’n’ Troll og tröllagarði með eigin aðgangseyri. Eigandinn, Steinar Berg, fékk heiðursverðlaun Íslensku tónlistarverðlaunanna í mars 2025. Ekkert af þessu sést á vefnum í dag og bókunin fer fram á öðru léni.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Fossatún',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Ég rakst á Fossatún og fannst sagan á bak við staðinn standa upp úr. Tröllagarðurinn og sögurnar sem urðu til eftir að Steinar Berg fann klettinn við fossinn, Rock ’n’ Troll og vínylsafnið sem gestir geta valið úr. Steinar tók svo við heiðursverðlaunum Íslensku tónlistarverðlaunanna í mars 2025. Það kom mér á óvart hvað lítið af þessu sést á vefnum ykkar í dag, og að gestur sem ætlar að bóka er sendur yfir á aðra síðu sem ber engan svip af Fossatúni.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að gestur sjái strax hvað Fossatún er, viti hvenær er opið og klári bókunina hjá ykkur sjálfum. Þá fer engin þóknun til bókunarsíðanna, sem er nákvæmlega það sem þið eruð að sækjast eftir með Troll10 kóðanum í dag.

Á sama tíma getur vefurinn tekið við því sem oftast er spurt um, hvort sé opið, hvenær Tröllagarðurinn er opinn og hvað fylgir gistingunni, og selt miða í garðinn fyrirfram í stað þess að þeir seljist bara á staðnum. Það sparar bæði símtöl og tölvupósta þegar mest er að gera.

Endilega látið mig vita ef þið hafið áhuga, annars er engin pressa.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
