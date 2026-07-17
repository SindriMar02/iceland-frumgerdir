/* ── HOTEL LANGAHOLT · „Sjóndeildarhringurinn" ─────────────────────────────
   One continuous horizon line runs the page: sky above carries the family's
   story since 1978, the shore below carries rooms, kitchen and golf course.
   Every fact, price and quote here comes from the verified brief/dossier
   (langaholt.is, booking.com, golfklst.is, west.is, keldan.is). No invention. */

/* All photos are real Langaholt photography (their own site + their
   Booking.com gallery), copied into public/langaholt/. Base-path safe. */
const P = (f: string) => import.meta.env.BASE_URL + 'langaholt/' + f

export const IMG = {
  hero828: P('hero-828.jpg'),
  hero1280: P('hero-1280.jpg'),
  hero2000: P('hero-2000.jpg'),
  exterior: P('exterior.jpg'),
  loungeShelf: P('lounge-shelf.jpg'),
  roomWindow: P('room-window.jpg'),
  roomBasic: P('room-basic.jpg'),
  roomStandard: P('room-standard.jpg'),
  roomComfort: P('room-comfort.jpg'),
  roomComfortXl: P('room-comfort-xl.jpg'),
  fisherman: P('fisherman.jpg'),
  breakfast: P('breakfast.jpg'),
  dinnerPlate: P('dinner-plate.jpg'),
  kitchenPrep: P('kitchen-prep.jpg'),
  seals: P('seals.jpg'),
  iceBeach: P('ice-beach.jpg'),
  church: P('church.jpg'),
  golfGreen: P('golf-green.jpg'),
  aurora: P('aurora.jpg'),
} as const

export const HERO_SRCSET = `${IMG.hero828} 828w, ${IMG.hero1280} 1280w, ${IMG.hero2000} 2000w`

export const PHONE = '+354 435 6789'
export const PHONE_HREF = 'tel:+3544356789'
export const EMAIL = 'langaholt@langaholt.is'
export const ADDRESS = 'Ytri-Görðum, Staðarsveit, 356 Snæfellsbær'
/* The hotel's real booking engine (godo.is) — the honest handoff target. */
export const BOOKING_URL =
  'https://property.godo.is/booking2.php?propid=90896&hideroom=291467%2C293358%2C291465%2C311574&hideoffer=4%2C5%2C6%2C7%2C8%2C9&lang=en'

export const NAV = [
  { id: 'stadurinn', label: 'Staðurinn' },
  { id: 'herbergi', label: 'Herbergi' },
  { id: 'veitingar', label: 'Veitingar' },
  { id: 'golf', label: 'Golf' },
  { id: 'umhverfi', label: 'Umhverfið' },
] as const

export const HERO = {
  eyebrow: 'Hótel Langaholt · Snæfellsnesi',
  h1a: 'Sjóndeildarhringurinn',
  h1b: 'þinn á Snæfellsnesi',
  sub: 'Fjölskylduhótel í fjöruborðinu síðan 1978. 40 herbergi með sérbaðherbergi, veitingastofa með fisk beint frá sjómönnum og níu holu golfvöllur við túnfótinn.',
  ctaPrimary: 'Bóka gistingu',
  ctaSecondary: 'Skoða herbergin',
  alt: 'Gullið melgresi og fjaran við Ytri-Garða undir stórum skýjahimni, sjóndeildarhringurinn klýfur myndina',
}

export const ARRIVAL = {
  heading: 'Milli strandar og fjallgarðs',
  body1: 'Langaholt stendur við Ytri-Garða í Staðarsveit, þar sem gullin ströndin mætir gráum fjallgarðinum. Þorkell Símonarson, Keli, fæddist á staðnum og hefur stýrt honum síðan 2006 ásamt Rúnu Björgu Magnúsdóttur.',
  body2: 'Tvö herbergi eru aðgengileg hjólastólum, frítt Wi-Fi er um allt hús, skjólgóð verönd og tjaldsvæði með hreinlætisaðstöðu á staðnum.',
  alt: 'Hótelbyggingin á Langaholti: tvílyft timburklædd álma með rauðum gluggum, fjallgarðurinn í fjarska',
  caption: 'Hótelið við Ytri-Garða, fjallgarðurinn ber við himin',
  stats: [
    { value: '40', label: 'herbergi með baði' },
    { value: '60', label: 'sæta veitingastofa' },
    { value: '2', label: 'setustofur og bar' },
    { value: '1978', label: 'fjölskyldurekstur síðan' },
  ],
}

export const STORY = {
  heading: 'Síðan 1978',
  intro: 'Svava Svandís og Símon byrjuðu með eitt tvíbýli á lofti íbúðarhússins. Sonur þeirra rekur staðinn í dag. Húsin risu eitt af öðru, alltaf í kringum sama borðið.',
  timeline: [
    { year: '1978', text: 'Svava Svandís og Símon hefja gistirekstur í tvíbýli á lofti íbúðarhússins.' },
    { year: '1980', text: 'Gamla húsið endurbyggt.' },
    { year: '1985', text: 'Nýtt gistihús vígt: eldhús, setustofa, baðherbergi og sex herbergi.' },
    { year: '1987', text: 'Borðstofa bætt við, fleiri herbergi og eldhúsið stækkað.' },
    { year: '1989', text: 'Þriðja húsið rís, fimm herbergi til viðbótar.' },
    { year: '1994', text: 'Tjaldsvæði með hreinlætisaðstöðu opnar.' },
    { year: '1996', text: 'Átta herbergi byggð og fleiri sérbaðherbergi.' },
    { year: '1997', text: 'Keli byggir níu holu golfvöll við hlið hótelsins.' },
    { year: '2006', text: 'Keli, fæddur á staðnum, tekur við af foreldrum sínum. Hann rekur hótelið í dag ásamt Rúnu Björgu.' },
  ],
  /* Verbatim family motto from langaholt.is/about-us-2 (kept in original English). */
  motto: '„Your place – Your home, while you explore the wonders and adventures of Iceland."',
  mottoLabel: 'Einkunnarorð fjölskyldunnar á Langaholti',
  /* Verbatim from a real TripAdvisor review titled "What a Gem!!" */
  gemQuote: '„Proprietor Thorkell (‘Keli’) Simonarson and his girlfriend Rúna Björg Magnúsdóttir have created a warm, welcoming, funky and completely absorbing guesthouse on a converted farm."',
  gemAttribution: 'Gestur á TripAdvisor, „What a Gem!!"',
  shelfAlt: 'Hilla í setustofunni full af dósum, flöskum og munum sem safnast hafa í áratugi, Langaholt-merkið á veggnum',
  shelfCaption: 'Setustofan: munir sem hafa safnast í næstum hálfa öld',
}

export type Room = {
  tag: string
  name: string
  price: string
  desc: string
  img: string
  alt: string
}

export const ROOMS_INTRO = {
  heading: 'Útsýnið fylgir herberginu',
  body: 'Rauðu gluggakarmarnir ramma inn lónið, melgresið og fjöllin. Öll 40 herbergin eru með sérbaðherbergi.',
  featureAlt: 'Gestaherbergi með tveimur rauðum gluggum sem ramma inn lón og melgresi fyrir utan',
  featureCaption: 'Útsýni úr gestaherbergi á Langaholti',
  note: 'Verð miðast við nótt með morgunverði samkvæmt verðskrá á vef hótelsins.',
}

export const ROOMS: Room[] = [
  {
    tag: 'Herbergi 01',
    name: 'Basic tvíbýli',
    price: '22.166 kr.',
    desc: 'Björt og látlaus herbergi með tvíbreiðu rúmi eða tveimur rúmum, skrifborði og sérbaðherbergi.',
    img: IMG.roomBasic,
    alt: 'Basic tvíbýli: hvítir veggir, innrammaðar myndir, skrifborð og tvíbreitt rúm',
  },
  {
    tag: 'Herbergi 02',
    name: 'Standard herbergi',
    price: '25.666 kr.',
    desc: 'Dökkgrænn veggur, tvö rúm og stór gluggi út að túninu.',
    img: IMG.roomStandard,
    alt: 'Standard herbergi með dökkgrænum vegg, tveimur rúmum og stórum glugga',
  },
  {
    tag: 'Herbergi 03',
    name: 'Comfort tvíbýli',
    price: '31.666 kr.',
    desc: 'Rauður gluggakarmur og svaladyr, melgresið blasir við í gegnum glerið.',
    img: IMG.roomComfort,
    alt: 'Comfort tvíbýli: rauður gluggakarmur og svaladyr með útsýni yfir melgresi',
  },
  {
    tag: 'Herbergi 04',
    name: 'Comfort XL tvíbýli',
    price: '34.666 kr.',
    desc: 'Rúmbetra herbergi með tvíbreiðu rúmi og setukrók.',
    img: IMG.roomComfortXl,
    alt: 'Comfort XL herbergi: hvítir veggir, tvíbreitt rúm og hægindastólar',
  },
]

export const RESTAURANT = {
  heading: 'Aflinn ræður matseðlinum',
  sub: 'Fiskurinn er keyptur beint af sjómönnum á Snæfellsnesi. Eldhúsið sérhæfir sig í fiski úr Faxaflóa og skelfiski úr Breiðafirði, og tegundirnar breytast með afla dagsins.',
  fishermanAlt: 'Sjómaður í svuntu heldur á stórum þorski við steypt borð í fjöruborðinu, þorskur og karfi á borðinu',
  board: [
    { label: 'Fiskur', value: 'úr Faxaflóa' },
    { label: 'Skelfiskur', value: 'úr Breiðafirði' },
    { label: 'Kræklingur', value: 'eftir árstíð' },
    { label: 'Tegundir', value: 'breytast með afla dagsins' },
  ],
  kitchenClaim: 'Allt brauð er bakað á staðnum og sultur, súpur, sósur og eftirréttir gerð frá grunni. Trú eldhússins er einföld: enginn réttur verður betri en hráefnið, og besta hráefnið er alltaf úr heimabyggð.',
  menu: [
    {
      name: 'Morgunverðarhlaðborð',
      hours: '8:00–10:00',
      price: '2.500 kr.',
      note: 'Snemmbúinn morgunverður í boði eftir samkomulagi við móttökuna.',
    },
    {
      name: 'Hádegi',
      hours: '12:00–16:00',
      price: 'frá 2.900 kr.',
      note: 'Fiskisúpa 2.900 kr., aðrir réttir frá 3.500 kr.',
    },
    {
      name: 'Kvöldhlaðborð',
      hours: '18:30–21:00',
      price: '8.700 kr.',
      note: 'Fiskisúpa, vegan grænmetissúpa, kræklingur eftir árstíð, þrír fiskréttir, tveir kjötréttir, vegan aðalréttur, rótargrænmeti, kartöflur, bygg með grænmeti, salat og eftirréttur kokksins.',
    },
  ],
  breakfastAlt: 'Morgunverðarhlaðborð á viðarborði með handskrifuðum merkimiðum við hvern rétt',
  breakfastCaption: 'Hlaðborðið, handskrifaðir miðar við hvern rétt',
  plateAlt: 'Kvöldverðarréttur: steikt kjöt með rótargrænmeti og sósu',
  plateCaption: 'Réttur af kvöldhlaðborðinu',
  prepAlt: 'Undirbúningsborð í eldhúsinu þakið réttum sem verið er að setja saman fyrir hlaðborðið',
  prepCaption: 'Undirbúningur fyrir kvöldið',
}

export const SURROUNDINGS = {
  heading: 'Gengið frá dyrunum',
  body: 'Gullin ströndin við Ytri-Garða er fimm mínútna gangur frá hótelinu. Þaðan má ganga austur að selalátrinu við Ytri Tungu eða vestur eftir ströndinni í átt að Búðum, með Snæfellsjökul í vestri allan tímann.',
  items: [
    { name: 'Gullin strönd við Ytri-Garða', detail: '5 mínútna gangur' },
    { name: 'Ytri Tunga, selalátur', detail: 'um 3 km austur eftir ströndinni' },
    { name: 'Lýsuhólslaug, jarðhitalaug 24–39°C', detail: '6 km frá hótelinu' },
    { name: 'Búðir', detail: 'um 10 km ganga vestur eftir ströndinni' },
  ],
  /* Regional folklore, framed as such (Bárðar saga Snæfellsáss). */
  folklore: 'Sagan segir að Bárður Snæfellsás, verndarvættur Snæfellsness, búi enn í jöklinum sjálfum.',
  photos: [
    { img: IMG.seals, alt: 'Tveir selir liggja á steinum í fjöruborðinu í kvöldbirtu', caption: 'Selir í fjöruborðinu' },
    { img: IMG.iceBeach, alt: 'Svört fjara með jökulísjökum undir gráum himni', caption: 'Jökulís í svartri fjöru' },
    { img: IMG.church, alt: 'Lítil hvít sveitakirkja með rauðu þaki við ströndina í kvöldsól, sjór og fjöll í baksýn', caption: 'Lítil sveitakirkja við ströndina' },
  ],
  auroraNote: 'Á veturna sjást norðurljósin af hlaðinu þegar himinn er heiður.',
}

export type Review = {
  quote: string
  name: string
  source: string
  /** Set when the quote string is verbatim English (screen-reader pronunciation). */
  lang?: 'en'
}

export const REVIEWS: Review[] = [
  {
    quote: '„Gorgeous views, great food. The restaurant view has windows all around so you are able to gaze out at the mountains on one side, and the seaside on the other."',
    name: 'Paige D., Cleveland',
    source: 'Umsögn á vef Langaholts',
    lang: 'en',
  },
  {
    quote: '„Best Hotel/Guesthouse in Iceland. The owners and house staff are extremely courteous and polite and will go well beyond the call of duty."',
    name: 'Steve, Colorado',
    source: 'Umsögn á vef Langaholts',
    lang: 'en',
  },
  {
    quote: '„Super friendly!! They were so kind, the food was amazing, and the wine was delicious!!"',
    name: 'Tia S., West Virginia',
    source: 'Umsögn á vef Langaholts',
    lang: 'en',
  },
  {
    quote: 'Staðsetningin „fantastic" til að skoða Snæfellsnes, morgun- og kvöldverður „delicious" úr „fresh local ingredients".',
    name: 'Ralph, Bandaríkjunum · 9,0/10',
    source: 'Booking.com, okt. 2025 · orðrétt brot',
  },
]

export const GOLF = {
  heading: 'Garðavöllur undir Jökli',
  body1: 'Árið 1997 byggði Keli níu holu strandvöll á sandinum við hliðina á hótelinu, hannaðan af Hannesi Þorsteinssyni golfvallaarkitekt. Golfklúbbur Staðarsveitar var stofnaður í gistihúsinu sjálfu í ágúst 1998.',
  body2: 'Við hverja holu er skilti sem segir frá jarðfræði og sögu svæðisins, svo hringurinn er líka náttúruganga.',
  facts: ['9 holur', 'Par 35', 'Strandvöllur á sandi', 'Vígður 1997'],
  alt: 'Barn stendur á höndum á flötinni á Garðavelli, flaggstöng á flötinni og fjallgarðurinn í baksýn',
  caption: 'Á flötinni á Garðavelli, fjallgarðurinn í baksýn',
  packagesHeading: 'Golfpakkar sumarið 2026',
  packagesNote: 'Gildir 1. maí til 30. september 2026. Verð fyrir tvo.',
  packages: [
    { name: '1 nótt + ótakmarkað golf', price: '44.500 kr.' },
    { name: '1 nótt + golf + kvöldhlaðborð', price: '61.900 kr.' },
    { name: '2 nætur + ótakmarkað golf', price: '76.800 kr.' },
    { name: '2 nætur + golf + kvöldverðir', price: '111.600 kr.' },
  ],
  cta: 'Panta golfpakka',
}

export const PRACTICAL = {
  heading: 'Hagnýtt',
  hoursHeading: 'Eldhúsið',
  hours: [
    { name: 'Morgunverður', value: '8:00–10:00' },
    { name: 'Hádegi', value: '12:00–16:00' },
    { name: 'Kvöldhlaðborð', value: '18:30–21:00' },
  ],
  findBody: 'Langaholt er við þjóðveg 54 í Staðarsveit á sunnanverðu Snæfellsnesi, um tveggja klukkustunda akstur frá Reykjavík.',
  mapHref: 'https://maps.google.com/?q=Hotel+Langaholt+Snæfellsbær',
}

export const BOOKING = {
  heading: 'Nóttin undir norðurljósunum',
  sub: 'Veldu dagsetningar og herbergi. Bókuninni lýkur á öruggri bókunarsíðu Langaholts.',
  fields: {
    checkin: 'Koma',
    checkout: 'Brottför',
    guests: 'Gestir',
    room: 'Herbergi',
    submit: 'Athuga framboð',
  },
  guestOptions: ['1 gestur', '2 gestir', '3 gestir', '4 gestir'],
  handoffTitle: 'Þú klárar bókunina hjá Langaholti',
  handoffBody: 'Verð og framboð eru sótt á bókunarsíðu Langaholts (godo.is). Þar sérðu laus herbergi fyrir dagsetningarnar þínar og gengur frá bókuninni á öruggan hátt.',
  handoffCta: 'Opna bókunarsíðuna',
  handoffBack: 'Breyta vali',
  disclaimer: 'Dagatalið hér er sýnishorn í frumgerð. Verð og framboð birtast á bókunarsíðu Langaholts.',
}

/* ── Honesty footer (brief C.8 — every guardrail must appear plainly) ──── */
export const DISCLOSURE = [
  'Um heiðarleika: þessi síða er hönnunarfrumgerð frá SNDR, ekki opinber vefur Langaholts. Allar staðreyndir, verð og tilvitnanir koma af langaholt.is, Booking.com og golfklst.is, sótt 2026-07-16.',
  'Engin heildareinkunn eða fjöldi umsagna er birtur hér þar sem heimildir um það stangast á, tilvitnanirnar sjálfar eru þó orðréttar og réttilega eignaðar.',
  'Kirkjan á myndinni í kaflanum um umhverfið er ónefnd þar sem hún er ekki staðfest.',
  'Dagatalið í bókunarhlutanum er sýnishorn í frumgerð. Verð og framboð birtast á bókunarsíðu Langaholts (godo.is), þar sem gengið er frá bókuninni.',
  'Ljósmyndir eru raunverulegar myndir af Langaholti, af vef hótelsins og Booking.com-síðu þess.',
].join(' ')

export const STICKY = { call: 'Hringja', book: 'Bóka núna' }

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: 'Hotel Langaholt',
  description:
    'Fjölskyldurekið hótel á sunnanverðu Snæfellsnesi síðan 1978: 40 herbergi með sérbaðherbergi, 60 sæta veitingastofa með staðbundnum fiski og níu holu golfvöllur.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ytri-Görðum, Staðarsveit',
    postalCode: '356',
    addressLocality: 'Snæfellsbær',
    addressCountry: 'IS',
  },
  telephone: '+354 435 6789',
  email: 'langaholt@langaholt.is',
  url: 'https://langaholt.is',
} as const
