/**
 * Pólar Hestar — content + design data.
 *
 * Facts verified against polarhestar.is and northiceland.is (June 2026):
 * family-run since 1985, ~160 horses, Grýtubakki II by Eyjafjörður, the
 * tagline "Þar sem hestar og álfar hittast", and the short-tour line-up with
 * its published ISK prices. Long-tour names are the company's own (marketed in
 * English). Phone is the single number shown on their site and confirmed by
 * Visit North Iceland: +354 896 1879.
 *
 * Sample data (disclaimed in the footer): the guest reviews, the shop prices,
 * and the booking confirmation flow are prototype-only.
 */

export type Lang = 'is' | 'en'

/* ── Contact (single, correct number — fixes the conflicting-phone flaw) ── */
export const PHONE_DISPLAY = '+354 896 1879'
export const PHONE_HREF = 'tel:+3548961879'
export const EMAIL = 'polarhestar@polarhestar.is'
export const ADDRESS = 'Grýtubakki II, 616 Grenivík'
export const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'Pólar Hestar, Grýtubakki II, 616 Grenivík',
)}`

export const STATS = { founded: 1985, years: 40, horses: 160, rating: '4,9', reviews: 263 }

/* ── Verified imagery (genuine Icelandic horses / North Iceland) ───────── */
export const IMG = {
  hero: 'photo-1501879779179-4576bae71d8d', // herd before a blue-grey snow mountain + fjord (Iceland)
  story: 'photo-1640892171250-2ef1c6f3b742', // white horse in mist — folklore
  booking: 'photo-1482779665037-990b5b461e91', // two horses nuzzling
  location: 'photo-1519092437326-bfd121eb53ae', // fjord road + water
  family: 'photo-1637354897876-b7df1d687628', // two riders, soft light
  ctaBand: 'photo-1778182967509-cc80b0faa2e3', // three horses under a stormy grey-blue sky, Grindavík
  procession: [
    'photo-1566251037378-5e04e3bec343',
    'photo-1463790323425-d6f5456869d7',
    'photo-1563734956808-602dab25525f',
    'photo-1497781495506-ce58b286d8f5',
    'photo-1694042877078-2fb0729d9ba2',
    'photo-1650735973119-f5b0fb72aa02',
    'photo-1598900154122-a6dad15d17d6',
    'photo-1694042877109-d1c547455cbf',
    'photo-1505436815265-8aa69d67f2e4',
  ],
}

/* ── Short tours (bookable, real published prices in ISK) ──────────────── */
export interface Tour {
  id: string
  name: { is: string; en: string }
  meta: { is: string; en: string } // duration / format
  level: { is: string; en: string }
  price: number
  blurb: { is: string; en: string }
  image: string
}

export const SHORT_TOURS: Tour[] = [
  {
    id: 'fyrstu-kynni',
    name: { is: 'Fyrstu kynni', en: 'First Acquaintance' },
    meta: { is: '1 klukkustund', en: '1 hour' },
    level: { is: 'Byrjendur', en: 'Beginners' },
    price: 9500,
    image: 'photo-1589157467587-913a38bb3d9d',
    blurb: {
      is: 'Rólegur kynningartúr um túnin heima á Grýtubakka. Fullkomið fyrsta skipti á hestbaki.',
      en: 'A calm introductory ride around the home fields at Grýtubakki. The perfect first time in the saddle.',
    },
  },
  {
    id: 'moa-og-mela',
    name: { is: 'Yfir móa og mela', en: 'Over Moors and Gravel' },
    meta: { is: '2 klukkustundir', en: '2 hours' },
    level: { is: 'Miðlungs', en: 'Intermediate' },
    price: 15000,
    image: 'photo-1726579209496-ceac166f72df',
    blurb: {
      is: 'Lengra haldið út í landslagið, yfir móa, mela og lækjarsprænur með útsýni yfir fjörðinn.',
      en: 'Further out into the landscape, across moors, gravel flats and little streams with views over the fjord.',
    },
  },
  {
    id: 'hofdahringur',
    name: { is: 'Höfðahringur', en: 'Cape Circuit' },
    meta: { is: '3 klukkustundir', en: '3 hours' },
    level: { is: 'Vön og vanar', en: 'Experienced' },
    price: 18000,
    image: 'photo-1637354897519-5b962c8157e8',
    blurb: {
      is: 'Lengsti dagtúrinn okkar, hringur um höfðann með fjölbreyttu landslagi og góðri ferð á tölti.',
      en: 'Our longest day ride, a circuit around the cape with varied terrain and a good stretch at the tölt.',
    },
  },
  {
    id: 'sumarsaela',
    name: { is: 'Sumarsæla', en: 'Summer Bliss' },
    meta: { is: 'Reiðtúr og minigolf', en: 'Ride and mini-golf' },
    level: { is: 'Fjölskyldur', en: 'Families' },
    price: 13500,
    image: 'photo-1452698325353-b90e60289e87',
    blurb: {
      is: 'Notalegur reiðtúr og minigolf á eftir. Sniðið fyrir fjölskyldur og hópa á góðum sumardegi.',
      en: 'An easy ride followed by a round of mini-golf. Made for families and groups on a fine summer day.',
    },
  },
]

/* ── Long, multi-day tours (summer, experienced riders) — company names ── */
export interface LongTour {
  id: string
  name: string // the company's own marketed name
  blurb: { is: string; en: string }
  image: string
}

export const LONG_TOURS: LongTour[] = [
  {
    id: 'midnightsun',
    name: 'Ring around the Midnightsun',
    image: 'photo-1626515406265-6d7395ece312',
    blurb: {
      is: 'Margra daga reiðtúr um víðerni Norðurlands í sól sem aldrei sest.',
      en: 'A multi-day ride across the North Iceland wilds under a sun that never sets.',
    },
  },
  {
    id: 'fascinating-north',
    name: 'Fascinating North Iceland',
    image: 'photo-1774281616625-9bfc1c9a2380',
    blurb: {
      is: 'Fjölbreytt Norðurland, frá grænum dölum að svörtum söndum og fjöllum.',
      en: 'Diverse North Iceland, from green valleys to black sands and mountains.',
    },
  },
  {
    id: 'hidden-pearls',
    name: 'Hidden Pearls of the North',
    image: 'photo-1569077016386-8a8a27da502f',
    blurb: {
      is: 'Um Flateyjardal og Fjörður, óbyggðir og eyðibýli sem fáir sjá.',
      en: 'Through Flateyjardalur and Fjörður, remote country and abandoned farms few ever see.',
    },
  },
  {
    id: 'autumn-northern-lights',
    name: 'Autumn Colours and Northern Lights',
    image: 'photo-1563224347-7232cc1a5e85',
    blurb: {
      is: 'Gyllt haustfjöll á daginn og norðurljós yfir tjaldinu á kvöldin.',
      en: 'Golden autumn mountains by day and northern lights over camp by night.',
    },
  },
  {
    id: 'back-to-roots',
    name: 'Back to the Roots',
    image: 'photo-1710179337706-f5e304f7740a',
    blurb: {
      is: 'Um Fjörður-skagann þar sem reiðmennskan og landið eiga sér djúpar rætur.',
      en: 'Across the Fjörður peninsula where horsemanship and the land run deep.',
    },
  },
]

/* ── Seasons — the signature "Ljós Norðursins" switcher ─────────────────── */
export interface Season {
  id: 'sumar' | 'haust' | 'vetur'
  name: { is: string; en: string }
  kicker: { is: string; en: string }
  line: { is: string; en: string }
  tour: { is: string; en: string }
  image: string
  glow: string // accent tint for this season
}

export const SEASONS: Season[] = [
  {
    id: 'sumar',
    name: { is: 'Sumar', en: 'Summer' },
    kicker: { is: 'Miðnætursól', en: 'Midnight sun' },
    line: {
      is: 'Bjartar nætur og þeysireið í sól sem aldrei sest. Hálendið opnast og lengri ferðirnar hefjast.',
      en: 'Bright nights and long rides under a sun that never sets. The highlands open and the long tours begin.',
    },
    tour: { is: 'Ferð: Ring around the Midnightsun', en: 'Tour: Ring around the Midnightsun' },
    image: 'photo-1699818035127-75727321a851',
    glow: '#c9871f',
  },
  {
    id: 'haust',
    name: { is: 'Haust', en: 'Autumn' },
    kicker: { is: 'Haustlitir og norðurljós', en: 'Autumn colours and aurora' },
    line: {
      is: 'Gyllt fjöll á daginn, norðurljós á kvöldin. Tær og kyrr tími til að vera á hestbaki.',
      en: 'Golden mountains by day, northern lights by night. A clear, still time to be in the saddle.',
    },
    tour: { is: 'Ferð: Autumn Colours and Northern Lights', en: 'Tour: Autumn Colours and Northern Lights' },
    image: 'photo-1580899905247-8aacef0d023f',
    glow: '#b4612a',
  },
  {
    id: 'vetur',
    name: { is: 'Vetur', en: 'Winter' },
    kicker: { is: 'Frostrósir', en: 'Frost roses' },
    line: {
      is: 'Frostrósir á feldi og kyrrð í snjónum. Stuttar vetrarferðir um hvíta sveitina, allt árið um kring.',
      en: 'Frost on their coats and stillness in the snow. Short winter rides through the white countryside, all year round.',
    },
    tour: { is: 'Ferð: Frostrósir', en: 'Tour: Frostrósir' },
    image: 'photo-1774018538486-49f5a51cd63f',
    glow: '#7ccdec', // logo ice-blue — winter light

  },
]

/* ── Sample guest reviews (prototype — disclaimed in footer) ────────────── */
export interface Review {
  quote: { is: string; en: string }
  name: string
  origin: { is: string; en: string }
}

export const REVIEWS: Review[] = [
  {
    quote: {
      is: 'Hápunktur ferðarinnar okkar um Ísland. Hestarnir ljúfir og fjölskyldan tók okkur eins og gömlum vinum.',
      en: 'The highlight of our whole trip to Iceland. Gentle horses and a family who welcomed us like old friends.',
    },
    name: 'Marie L.',
    origin: { is: 'Frakkland', en: 'France' },
  },
  {
    quote: {
      is: 'Aldrei setið hest áður og leið samt fullkomlega örugg. Útsýnið yfir fjörðinn var ógleymanlegt.',
      en: 'I had never ridden before and still felt completely safe. The views over the fjord were unforgettable.',
    },
    name: 'Sarah K.',
    origin: { is: 'Kanada', en: 'Canada' },
  },
  {
    quote: {
      is: 'Fórum í fimm daga ferð og hún fór fram úr öllum væntingum. Þekking þeirra á landinu er einstök.',
      en: 'We took a five-day tour and it exceeded every expectation. Their knowledge of the land is second to none.',
    },
    name: 'Thomas B.',
    origin: { is: 'Þýskaland', en: 'Germany' },
  },
]

/* ── Farm shop (photo-light; sample prices) — fixes the dead-end shop ───── */
export interface ShopItem {
  name: { is: string; en: string }
  price: number
}

export const SHOP: ShopItem[] = [
  { name: { is: 'Fjölnotaklútur (buff)', en: 'Multi-use buff' }, price: 2900 },
  { name: { is: 'Lambskinn af bænum', en: 'Sheepskin from the farm' }, price: 12900 },
  { name: { is: 'Taupoki með merki', en: 'Branded tote bag' }, price: 3500 },
]

/* ── Bilingual interface copy ──────────────────────────────────────────── */
export const COPY = {
  is: {
    langBtn: 'EN',
    nav: { tours: 'Ferðir', seasons: 'Árstíðir', book: 'Bóka', visit: 'Heimsókn', cta: 'Bóka reiðtúr' },

    heroEyebrow: 'Hestaferðir · Grenivík · Norðurland',
    heroH1a: 'Þar sem hestar',
    heroH1b: 'og álfar hittast',
    heroLede:
      'Í fjörutíu ár höfum við deilt norðlensku birtunni með knöpum á öllum getustigum, á bænum okkar Grýtubakka við lengsta fjörð landsins.',
    heroBook: 'Bóka reiðtúr',
    heroTours: 'Sjá ferðir',
    statYears: 'ára saga',
    statHorses: 'hross',
    statRating: 'á Tripadvisor',
    scrollHint: 'Skrunaðu',

    storyEyebrow: 'Grýtubakki II · Eyjafjörður',
    storyH2: 'Fjörutíu ár við lengsta fjörðinn',
    storyP1:
      'Pólar Hestar hafa boðið upp á hestaferðir í 40 ár. Það byrjaði allt með rúmlega 15 hestum en í dag erum við með um 160 hross og bjóðum upp á ýmiss konar reiðtúra.',
    storyP2:
      'Landslagið í kringum bæinn okkar Grýtubakka býður upp á ógleymanlega reynslu, bæði fyrir reyndustu knapa og algjöra byrjendur. Fjölskyldan tekur á móti hverjum gesti.',
    storyQuote: '„Þar sem hestar og álfar hittast.“',

    procEyebrow: 'Hjörðin',
    procH2: 'Hundrað og sextíu, hver með sinn karakter',
    procBody:
      'Íslenski hesturinn er fimur, viljugur og einstaklega traustur, með mjúka tölt-ganginn sem þú finnur hvergi annars staðar. Hjá okkur færðu hest sem hæfir þér.',

    toursEyebrow: 'Stuttar ferðir',
    toursH2: 'Reiðtúrar fyrir alla, allt árið',
    toursBody:
      'Allar stuttar ferðir eru í boði allt árið og henta öllum aldri og getu. Kaffi, te, kakó og heimabakað bíður þegar heim er komið.',
    fromLabel: 'Verð frá',
    perPerson: 'á mann',
    bookBtn: 'Bóka',
    childNote: 'Börn 12 ára og yngri fá 2.000 kr. afslátt',
    weightNote: 'Hámarksþyngd knapa er 95 kg',

    bookEyebrow: 'Bókun',
    bookH2: 'Bókaðu á nokkrum sekúndum',
    bookBody:
      'Veldu ferð, dagsetningu og fjölda knapa, og sjáðu verðið strax. Engin bið eftir tölvupósti.',
    bookPanelLine: 'Sætin eru fá og dagarnir vinsælir. Tryggðu þitt.',
    stepTour: '1 · Veldu ferð',
    stepDate: '2 · Veldu dag',
    stepRiders: '3 · Fjöldi knapa',
    dateLabel: 'Dagsetning',
    adults: 'Fullorðnir',
    children: 'Börn (12 og yngri)',
    totalLabel: 'Samtals',
    confirmBtn: 'Staðfesta bókun',
    confirmedTitle: 'Takk fyrir!',
    confirmedBody:
      'Við staðfestum bókunina þína símleiðis eða í tölvupósti innan sólarhrings. Hlökkum til að sjá þig á Grýtubakka.',
    bookAgain: 'Bóka aðra ferð',
    childDiscountApplied: 'Afsláttur barna innifalinn',

    seasonsEyebrow: 'Ljós Norðursins',
    seasonsH2: 'Hver árstíð, sín birta',
    seasonsBody:
      'Norðurland breytist með birtunni, og ferðin með. Veldu árstíð og sjáðu hvað bíður.',

    longEyebrow: 'Lengri reiðferðir',
    longH2: 'Margra daga ævintýri á sumrin',
    longBody:
      'Á sumrin leggjum við í lengri ferðir um hálendi og afdali Norðurlands, fyrir vana knapa. Hafðu samband og við setjum saman ferð við hæfi.',
    multiDay: 'Margra daga · sumar',
    enquireBtn: 'Fá tilboð',

    trustEyebrow: 'Umsagnir',
    trustH2: '4,9 stjörnur og Travelers’ Choice',
    trustBody: '263 umsagnir á Tripadvisor og Travelers’ Choice verðlaunin.',
    reviewsWord: 'umsagnir',
    familyTitle: 'Fjölskyldan á Grýtubakka',
    familyBody:
      'Stefán, Juliane og Símon reka Pólar Hesta af alúð og þekkja hverja þúfu í kring. Hjá okkur ertu gestur, ekki númer.',

    shopEyebrow: 'Búðin',
    shopH2: 'Lítil minning með heim',
    shopBody: 'Handvalið dót frá bænum. Sendu okkur línu og við tökum það frá fyrir þig.',
    orderBtn: 'Panta í tölvupósti',

    visitEyebrow: 'Heimsókn',
    visitH2: 'Finndu okkur við fjörðinn',
    addressLabel: 'Heimilisfang',
    gettingThereLabel: 'Hvernig á að rata',
    gettingThere: 'Þjóðvegur 83 í átt að Grenivík, skammt fyrir norðan Akureyri.',
    seasonLabel: 'Opnunartími',
    seasonInfo: 'Stuttar ferðir allt árið, alla daga. Lengri ferðir á sumrin. Bókað með fyrirvara.',
    mapsBtn: 'Opna í kortum',
    callBtn: 'Hringja',
    emailBtn: 'Senda tölvupóst',

    ctaH2: 'Komdu á hestbak í norðri',
    ctaBody: 'Bókaðu reiðtúr í dag eða heyrðu í okkur. Við svörum fljótt.',
    stickyBook: 'Bóka reiðtúr',
  },
  en: {
    langBtn: 'IS',
    nav: { tours: 'Tours', seasons: 'Seasons', book: 'Book', visit: 'Visit', cta: 'Book a ride' },

    heroEyebrow: 'Horse riding · Grenivík · North Iceland',
    heroH1a: 'Where horses',
    heroH1b: 'meet the elves',
    heroLede:
      'For forty years we have shared the northern light with riders of every level, at our farm Grýtubakki by Iceland’s longest fjord.',
    heroBook: 'Book a ride',
    heroTours: 'See the tours',
    statYears: 'years',
    statHorses: 'horses',
    statRating: 'on Tripadvisor',
    scrollHint: 'Scroll',

    storyEyebrow: 'Grýtubakki II · Eyjafjörður',
    storyH2: 'Forty years by the longest fjord',
    storyP1:
      'Pólar Hestar has offered riding tours for 40 years. It all began with about 15 horses, and today we have around 160 and offer all kinds of rides.',
    storyP2:
      'The landscape around our farm Grýtubakki makes for an unforgettable experience, for the most seasoned riders and complete beginners alike. The family welcomes every guest.',
    storyQuote: '“Where horses meet the elves.”',

    procEyebrow: 'The herd',
    procH2: 'A hundred and sixty, each with a character',
    procBody:
      'The Icelandic horse is sure-footed, willing and remarkably steady, with the smooth tölt gait you find nowhere else. We match you with the horse that suits you.',

    toursEyebrow: 'Short tours',
    toursH2: 'Rides for everyone, all year',
    toursBody:
      'Every short tour runs all year and suits all ages and abilities. Coffee, tea, cocoa and home baking wait for you back at the farm.',
    fromLabel: 'From',
    perPerson: 'per person',
    bookBtn: 'Book',
    childNote: 'Children 12 and under get a 2,000 ISK discount',
    weightNote: 'Maximum rider weight is 95 kg',

    bookEyebrow: 'Booking',
    bookH2: 'Book in seconds',
    bookBody: 'Choose a tour, a date and the number of riders, and see the price at once. No waiting on email.',
    bookPanelLine: 'Seats are few and the good days fill up. Secure yours.',
    stepTour: '1 · Choose a tour',
    stepDate: '2 · Choose a date',
    stepRiders: '3 · Riders',
    dateLabel: 'Date',
    adults: 'Adults',
    children: 'Children (12 and under)',
    totalLabel: 'Total',
    confirmBtn: 'Confirm booking',
    confirmedTitle: 'Thank you!',
    confirmedBody:
      'We will confirm your booking by phone or email within a day. We look forward to seeing you at Grýtubakki.',
    bookAgain: 'Book another ride',
    childDiscountApplied: 'Child discount included',

    seasonsEyebrow: 'Light of the North',
    seasonsH2: 'Every season, its own light',
    seasonsBody: 'North Iceland changes with the light, and so does the ride. Pick a season and see what waits.',

    longEyebrow: 'Long rides',
    longH2: 'Multi-day adventures in summer',
    longBody:
      'In summer we set out on longer tours across the highlands and hidden valleys of the North, for experienced riders. Get in touch and we will tailor a tour to you.',
    multiDay: 'Multi-day · summer',
    enquireBtn: 'Request a quote',

    trustEyebrow: 'Reviews',
    trustH2: '4.9 stars and Travelers’ Choice',
    trustBody: '263 reviews on Tripadvisor and the Travelers’ Choice award.',
    reviewsWord: 'reviews',
    familyTitle: 'The family at Grýtubakki',
    familyBody:
      'Stefán, Juliane and Símon run Pólar Hestar with care and know every hill around. With us you are a guest, not a number.',

    shopEyebrow: 'The shop',
    shopH2: 'A small memory to take home',
    shopBody: 'Hand-picked bits and pieces from the farm. Drop us a line and we will set one aside for you.',
    orderBtn: 'Order by email',

    visitEyebrow: 'Visit',
    visitH2: 'Find us by the fjord',
    addressLabel: 'Address',
    gettingThereLabel: 'Getting there',
    gettingThere: 'Road 83 toward Grenivík, a short way north of Akureyri.',
    seasonLabel: 'Opening',
    seasonInfo: 'Short tours all year, every day. Long tours in summer. Booking by arrangement.',
    mapsBtn: 'Open in maps',
    callBtn: 'Call',
    emailBtn: 'Send an email',

    ctaH2: 'Come ride in the north',
    ctaBody: 'Book a ride today or get in touch. We answer quickly.',
    stickyBook: 'Book a ride',
  },
}
