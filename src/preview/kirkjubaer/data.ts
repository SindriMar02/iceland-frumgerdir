/**
 * Kirkjubær II Camping — content + i18n catalog.
 *
 * Faithful production data for the "Kirkjubær II Camping" design handoff from
 * Claude design (warm earthy editorial, bilingual EN/IS, live season status).
 * All copy is lifted verbatim from the handoff's renderVals() (the spec).
 *
 * HONESTY GUARDRAILS (prototype is disclaimed in PreviewFooter):
 *   - Real business: Tjaldsvæðið Kirkjubær II, 880 Kirkjubæjarklaustur, South Iceland.
 *   - Facts (season Mar–mid Nov, reception 17–21, quiet 23–07, 7 cottages sleeping 4,
 *     prices, Airbnb booking, phone +354 894 4495) are from the current site.
 *   - Review quotes are clearly-labelled SAMPLES (wire to live TripAdvisor before launch).
 *   - Distances are approximate (~). Prices "Updated May 2025" per the current site.
 *   - Imagery is the campsite's own, downloaded from kirkjubaer.com and served locally.
 */

export type Lang = 'en' | 'is'

/** Local assets live in /public/kirkjubaer/ (downloaded from kirkjubaer.com). */
const A = `${import.meta.env.BASE_URL}kirkjubaer/`

export const IMAGES = {
  hero: A + 'hero-glacier.jpg', // home hero + camping banner — campsite beneath the glacier
  cottages: A + 'cottages.jpg', // cottages banner + home "stay your way" card
  cottageSingle: A + 'cottage-single.png', // cottages intro — one cabin
  cottageBunk: A + 'cottage-bunk.jpg', // cottages — bunk beds inside
  locationMap: A + 'location-map.png', // home location preview map
  prices: A + 'prices.png', // prices banner — two campervans
  fjadrargljufur: A + 'surr-fjadrargljufur.jpg', // surroundings banner + canyon card
  skaftareldahraun: A + 'surr-skaftareldahraun.jpg', // lava-field attraction card
  volcanicWay: A + 'surr-volcanic-way.jpg', // location banner + Volcanic Way card
} as const

export const FACILITY_ICONS = {
  tent: A + 'icon-Tjaldsvaedi.webp',
  caravan: A + 'icon-Hjolhysasvaedi.webp',
  shower: A + 'icon-Sturta.webp',
  washer: A + 'icon-Thvottavel.webp',
  cooking: A + 'icon-Eldunaradstada.webp',
  sewage: A + 'icon-Losun_skolptanka.webp',
  cottage: A + 'icon-Sumarhus_til_leigu.webp',
} as const

export const LINKS = {
  airbnbHost: 'https://www.airbnb.is/users/show/154967856',
  facebook: 'https://www.facebook.com/kirkjubaer2',
  tripadvisor:
    'https://www.tripadvisor.com/Hotel_Review-g315850-d6728230-Reviews-Tjaldstaeoio_Kirkjubaer_II_Camping_Site_and_Cottages-Kirkjubaejarklaustur_South_Region.html',
  googleMaps:
    'https://www.google.com/maps/search/?api=1&query=Kirkjubaer+II+Camping+Kirkjubaejarklaustur',
  osmEmbed:
    'https://www.openstreetmap.org/export/embed.html?bbox=-18.18%2C63.74%2C-17.93%2C63.83&layer=mapnik&marker=63.7906%2C-18.0594',
  tel: '+3548944495',
  telDisplay: '+354 894 4495',
  email: 'kirkjubaer@simnet.is',
} as const

export type PageKey = 'home' | 'camping' | 'cottages' | 'location' | 'prices' | 'surroundings'

export const NAV: { key: PageKey; en: string; is: string }[] = [
  { key: 'camping', en: 'Camping', is: 'Tjaldsvæði' },
  { key: 'cottages', en: 'Cottages', is: 'Sumarhús' },
  { key: 'location', en: 'Location', is: 'Staðsetning' },
  { key: 'prices', en: 'Prices', is: 'Verð' },
  { key: 'surroundings', en: 'Surroundings', is: 'Nágrenni' },
]

/** Resolve the full content tree for a language (mirrors the handoff renderVals). */
export function getContent(lang: Lang) {
  const p = (en: string, is: string) => (lang === 'is' ? is : en)

  const t = {
    call: p('Call us', 'Hringdu'),
    bookCottage: p('Book a cottage', 'Bóka sumarhús'),
    seeCamping: p('Explore camping', 'Skoða tjaldsvæði'),
    seeCottages: p('See cottages', 'Skoða sumarhús'),
    seePrices: p('See prices', 'Sjá verð'),
    getDirections: p('Get directions', 'Fá leiðsögn'),
    bookNow: p('Book now', 'Bóka núna'),
    readReviews: p('Read reviews on TripAdvisor', 'Lesa dóma á TripAdvisor'),
    seeSurroundings: p('See surroundings', 'Skoða nágrenni'),
    scroll: p('Scroll', 'Skrunaðu'),
    menuLabel: p('Menu', 'Valmynd'),
    followLabel: p('Follow', 'Fylgdu'),
    phoneLabel: p('Phone', 'Sími'),
    emailLabel: p('Email', 'Netfang'),
    rights: p('All rights reserved', 'Allur réttur áskilinn'),
    langLabel: p('Language', 'Tungumál'),
    home: p('Home', 'Forsíða'),
  }

  const c = {
    heroKicker: p('Reconnect with nature at', 'Tengstu náttúrunni á'),
    heroTitle: p('Kirkjubær II Camping Ground', 'Tjaldsvæðið Kirkjubær II'),
    heroBody: p(
      'Nestled by the village of Kirkjubæjarklaustur in the heart of South Iceland, a peaceful, friendly base for exploring the region’s waterfalls, canyons and lava fields.',
      'Í hjarta Suðurlands, rétt hjá Kirkjubæjarklaustri. Friðsæll og vinalegur áfangastaður til að skoða fossa, gljúfur og hraun svæðisins.',
    ),

    welcomeKicker: p('Welcome', 'Velkomin'),
    welcomeTitle: p('A peaceful base camp, open to all', 'Friðsæl bækistöð, opin öllum'),
    welcomeBody: p(
      'No booking, no fuss. Roll in with your tent, campervan or caravan and find your spot, first come, first served. Clean facilities, hot showers, and a cozy cabin waiting if you’d rather sleep indoors.',
      'Engin bókun, ekkert vesen. Komdu með tjaldið, húsbílinn eða hjólhýsið og finndu þér stað, fyrstur kemur, fyrstur fær. Hrein aðstaða, heitar sturtur, og hlýtt sumarhús ef þú vilt frekar sofa inni.',
    ),

    stayKicker: p('Stay your way', 'Veldu þína gistingu'),
    campCardTitle: p('Camping', 'Tjaldsvæði'),
    campCardBody: p(
      'Plenty of space for tents, campervans and caravans. No advance booking, just arrive and settle in.',
      'Nóg pláss fyrir tjöld, húsbíla og hjólhýsi. Engin bókun, bara mæta og koma sér fyrir.',
    ),
    cotCardTitle: p('Cottages', 'Sumarhús'),
    cotCardBody: p(
      'Seven warm little cabins, each sleeping four. Perfect after a long day on the road. Book in advance.',
      'Sjö hlý sumarhús, hvert fyrir fjóra. Fullkomið eftir langan dag á veginum. Bókaðu fyrirfram.',
    ),

    locKicker: p('Find us', 'Finndu okkur'),
    locTitle: p('Halfway along the South Coast', 'Miðja vegu á Suðurströndinni'),
    locBody: p(
      'Right by Kirkjubæjarklaustur on Route 1, midway between Reykjavík and Höfn, the ideal place to set up base and explore.',
      'Rétt hjá Kirkjubæjarklaustri á þjóðvegi 1, miðja vegu milli Reykjavíkur og Hafnar. Kjörinn staður til að slá upp búðum og skoða sig um.',
    ),

    surrKicker: p('Things to do', 'Hvað má gera'),
    surrTitle: p('Wonders on your doorstep', 'Undur við útidyrnar'),
    surrBody: p(
      'Vatnajökull National Park, the Katla UNESCO Geopark, Fjaðrárgljúfur canyon, vast lava fields and more, all within reach.',
      'Vatnajökulsþjóðgarður, Kötlu jarðvangur (UNESCO), Fjaðrárgljúfur, víðáttumikil hraun og fleira, allt í seilingarfjarlægð.',
    ),

    revKicker: p('Loved by travellers', 'Ferðalangar elska okkur'),
    revNote: p('sample highlights, connect live reviews', 'sýnishorn, tengja má dóma'),
    revTitle: p('A little spot people remember', 'Staður sem fólk man eftir'),

    ctaTitle: p('Plan your stay at Kirkjubær II', 'Skipuleggðu dvölina á Kirkjubæ II'),
    ctaBody: p(
      'Open March through mid-November. Camping is first come, first served; cottages book up fast, reserve yours early.',
      'Opið frá mars fram í miðjan nóvember. Tjaldsvæði: fyrstur kemur, fyrstur fær; sumarhús bókast hratt, tryggðu þitt snemma.',
    ),

    campTitle: p('Camping', 'Tjaldsvæði'),
    campLead: p(
      'Several open campsites with room for everyone. Tents, campervans and caravans all welcome, no advance booking, first come, first served.',
      'Nokkur opin tjaldsvæði með plássi fyrir alla. Tjöld, húsbílar og hjólhýsi velkomin, engin bókun, fyrstur kemur, fyrstur fær.',
    ),
    facTitle: p('Facilities', 'Aðstaða'),
    recLabel: p('Reception', 'Móttaka'),
    recHoursCamp: '17:00 – 21:00',
    quietLabel: p('Quiet hours', 'Kyrrðartími'),
    quietVal: '23:00 – 07:00',
    seasonLabel: p('Season', 'Tímabil'),
    seasonVal: p('March – mid Nov', 'Mars – miðjan nóv'),
    bookingLabel: p('Booking', 'Bókun'),
    bookingVal: p('Not required', 'Ekki nauðsynleg'),

    cotTitle: p('Cottages', 'Sumarhús'),
    cotLead: p(
      'Seven small, warm cabins, each sleeping four in two bunk beds. Ideal for families or anyone who’d rather enjoy the warmth indoors. Booked in advance through Airbnb.',
      'Sjö lítil, hlý hús, hvert með svefnpláss fyrir fjóra í tveimur kojum. Tilvalið fyrir fjölskyldur eða þá sem vilja njóta hlýju innandyra. Bókast fyrirfram í gegnum Airbnb.',
    ),
    bookVia: p('Booked in advance via Airbnb', 'Bókað fyrirfram í gegnum Airbnb'),
    cotHasTitle: p('Each cottage has', 'Í hverju húsi er'),
    cotBringTitle: p('You bring your own', 'Þú kemur með'),
    cabinSmallTitle: p('Cabins 1–4 · 10 m²', 'Hús 1–4 · 10 m²'),
    cabinSmallDesc: p(
      'Sleeping space for four in two bunk beds. Toilet and showers are in the service building 10 m away. Cooking facilities with a fridge in the small house, with tableware, pots and pans for four.',
      'Svefnpláss fyrir fjóra í tveimur kojum. Salerni og sturtur eru í þjónustuhúsi í 10 m fjarlægð. Eldunaraðstaða með ísskáp í litla húsinu, ásamt borðbúnaði, pottum og pönnum fyrir fjóra.',
    ),
    cabinLargeTitle: p('Cabins 5–7 · 14.5 m²', 'Hús 5–7 · 14,5 m²'),
    cabinLargeDesc: p(
      'Sleeping space for four in two bunk beds. A toilet and sink (cold water) are in the cabin, plus a small fridge. Shower and cooking facilities are in the service building.',
      'Svefnpláss fyrir fjóra í tveimur kojum. Salerni og vaskur (kalt vatn) eru í húsinu, ásamt litlum ísskáp. Sturta og eldunaraðstaða eru í þjónustuhúsi.',
    ),

    locPageTitle: p('Location', 'Staðsetning'),
    locPageLead: p(
      'We’re right beside Kirkjubæjarklaustur on Route 1 (the Ring Road), midway between Reykjavík and Höfn. An easy, central base for the whole South Coast.',
      'Við erum rétt hjá Kirkjubæjarklaustri á þjóðvegi 1 (hringveginum), miðja vegu milli Reykjavíkur og Hafnar. Þægileg, miðsvæðis bækistöð fyrir alla Suðurströndina.',
    ),
    addressLabel: p('Address', 'Heimilisfang'),
    openMaps: p('Open in Google Maps', 'Opna í Google kortum'),
    distLabel: p('From key places', 'Vegalengdir'),

    priceTitle: p('Prices', 'Verð'),
    colService: p('Service', 'Þjónusta'),
    colPrice: p('Price', 'Verð'),
    allIsk: p('All prices in ISK', 'Allt verð í ISK'),
    noCard: p('No Camping Card', 'Ekki Camping Card'),
    updated: p('Updated May 2025', 'Uppfært í maí 2025'),
    cotRentTitle: p('Cottage rental', 'Leiga á sumarhúsum'),
    cotRentBody: p(
      'Cottage prices are flexible and subject to availability. Cabins must be booked in advance, see availability, price and book online.',
      'Verð sumarhúsa er sveigjanlegt og háð framboði. Bóka þarf hús fyrirfram, sjá framboð, verð og bóka á netinu.',
    ),

    surrPageTitle: p('Surroundings', 'Nágrenni'),
    surrPageLead: p(
      'Kirkjubæjarklaustur is a brilliant base for exploring Vatnajökull National Park, the Katla UNESCO Geopark, Fjaðrárgljúfur canyon, the Skaftáreldahraun lava field, Lómagnúpur and much more.',
      'Kirkjubæjarklaustur er frábær bækistöð til að skoða Vatnajökulsþjóðgarð, Kötlu jarðvang (UNESCO), Fjaðrárgljúfur, Skaftáreldahraun, Lómagnúp og margt fleira.',
    ),
    moreTitle: p('More to explore', 'Fleira að skoða'),

    addressLine1: 'Tjaldsvæðið Kirkjubæ II',
    addressLine2: p('880 Kirkjubæjarklaustur', '880 Kirkjubæjarklaustur'),
    footerAddress: p(
      'Tjaldsvæðið Kirkjubæ II\n880 Kirkjubæjarklaustur, Iceland',
      'Tjaldsvæðið Kirkjubæ II\n880 Kirkjubæjarklaustur, Ísland',
    ),
  }

  const facilities = [
    { img: FACILITY_ICONS.tent, label: p('Tent area', 'Tjaldsvæði') },
    { img: FACILITY_ICONS.caravan, label: p('Caravan & campervan', 'Hjólhýsi & húsbílar') },
    { img: FACILITY_ICONS.shower, label: p('Hot showers', 'Heitar sturtur') },
    { img: FACILITY_ICONS.washer, label: p('Washing machine', 'Þvottavél') },
    { img: FACILITY_ICONS.cooking, label: p('Cooking area', 'Eldunaraðstaða') },
    { img: FACILITY_ICONS.sewage, label: p('Sewage disposal', 'Losun skólptanka') },
    { img: FACILITY_ICONS.cottage, label: p('Cottages for rent', 'Sumarhús til leigu') },
  ]

  const cabinLbl = p('Cabin ', 'Hús ')
  const cabinsSmall = [
    { url: 'https://www.airbnb.is/rooms/33355516', label: cabinLbl + '1' },
    { url: 'https://www.airbnb.is/rooms/22539268', label: cabinLbl + '2' },
    { url: 'https://www.airbnb.is/rooms/21538879', label: cabinLbl + '3' },
    { url: 'https://www.airbnb.is/rooms/21392929', label: cabinLbl + '4' },
  ]
  const cabinsLarge = [
    { url: 'https://www.airbnb.is/rooms/22687671', label: cabinLbl + '5' },
    { url: 'https://www.airbnb.is/rooms/21718849', label: cabinLbl + '6' },
    { url: 'https://www.airbnb.is/rooms/21412905', label: cabinLbl + '7' },
  ]

  const hasList = [
    p('Sleeping space for 4 in two bunk beds', 'Svefnpláss fyrir 4 í tveimur kojum'),
    p('A clean sheet and pillow for every bed', 'Hreint lak og koddi fyrir hvert rúm'),
    p('Table and chairs for four', 'Borð og stólar fyrir fjóra'),
    p('Heating', 'Hitun'),
  ]
  const bringList = [
    p('Bedding, sleeping bags and/or blankets', 'Sængurföt, svefnpoka og/eða teppi'),
    p(
      'Or rent linen & bedding — 2.000 ISK per person per stay',
      'Eða leigðu lín og sængurföt — 2.000 kr. á mann fyrir dvölina',
    ),
  ]

  const surroundings = [
    {
      img: IMAGES.fjadrargljufur,
      title: p('Fjaðrárgljúfur Canyon', 'Fjaðrárgljúfur'),
      blurb: p(
        'A dramatic 2 km canyon trail, under an hour return from the car park.',
        'Tilkomumikið 2 km gljúfur, innan við klukkutími fram og til baka frá bílastæði.',
      ),
      link: 'https://www.south.is/en/place/fjadrargljufur-canyon',
    },
    {
      img: IMAGES.skaftareldahraun,
      title: 'Skaftáreldahraun',
      blurb: p(
        'The largest lava flow from a single eruption in recorded history, from Lakagígar in 1783.',
        'Stærsta hraunflæði úr einu gosi í sögunni, frá Lakagígum árið 1783.',
      ),
      link: 'https://www.south.is/en/place/skaftareldahraun-lava-field',
    },
    {
      img: IMAGES.volcanicWay,
      title: p('The Volcanic Way', 'Eldfjallaleiðin'),
      blurb: p(
        'A travel route through South Iceland following eight major volcanoes and the stories they tell.',
        'Ferðaleið um Suðurland sem fylgir átta eldfjöllum og sögum þeirra.',
      ),
      link: 'https://www.south.is/en/destinations/travel-routes/the-volcanic-way',
    },
  ]

  const morePlaces = [
    p('Vatnajökull National Park', 'Vatnajökulsþjóðgarður'),
    'Katla UNESCO Geopark',
    'Lómagnúpur',
    'Laki / Lakagígar',
    p('Systrafoss waterfall', 'Systrafoss'),
    'Dverghamrar',
  ]

  const prices = [
    {
      label: p('Camping, per night per person', 'Tjald, á nótt á mann'),
      price: '2.000',
      note: p('Free for ages 12 & under', 'Frítt fyrir 12 ára og yngri'),
    },
    { label: p('Lodging tax, per unit', 'Gistináttagjald, á einingu'), price: '400' },
    { label: p('Electricity, per night per unit', 'Rafmagn, á nótt á einingu'), price: '1.500' },
    { label: p('Shower, 3 min (token at reception)', 'Sturta, 3 mín (mynt í móttöku)'), price: '300' },
    { label: p('Washing machine, per wash', 'Þvottavél, hver þvottur'), price: '950' },
    { label: p('Dryer, per cycle', 'Þurrkari, hver lota'), price: '950' },
  ]

  const distances = [
    { place: 'Reykjavík', km: '~257 km' },
    { place: 'Vík í Mýrdal', km: '~72 km' },
    { place: 'Höfn', km: '~200 km' },
    { place: p('Fjaðrárgljúfur canyon', 'Fjaðrárgljúfur'), km: '~10 km' },
  ]

  const reviews = [
    {
      q: p(
        'A peaceful base with spotless facilities and easy access to the canyon.',
        'Friðsæl bækistöð með hreinni aðstöðu og stutt í gljúfrið.',
      ),
      a: 'TripAdvisor · sample',
    },
    {
      q: p(
        'Cozy little cabins, exactly what we needed after a long drive.',
        'Notaleg lítil hús, einmitt það sem við þurftum eftir langan akstur.',
      ),
      a: 'TripAdvisor · sample',
    },
    {
      q: p(
        'Friendly hosts and a perfect spot halfway along the South Coast.',
        'Vingjarnlegir gestgjafar og fullkomin staðsetning miðja vegu á Suðurströndinni.',
      ),
      a: 'TripAdvisor · sample',
    },
  ]

  return {
    t,
    c,
    facilities,
    cabinsSmall,
    cabinsLarge,
    hasList,
    bringList,
    surroundings,
    morePlaces,
    prices,
    distances,
    reviews,
  }
}

export type Content = ReturnType<typeof getContent>

/** Live season status: open if today is within [Mar 1, Nov 17] of the current year. */
export function seasonStatus(lang: Lang, now: Date) {
  const yr = now.getFullYear()
  const open = now >= new Date(yr, 2, 1) && now <= new Date(yr, 10, 17, 23, 59, 59)
  const p = (en: string, is: string) => (lang === 'is' ? is : en)
  return {
    open,
    label: open
      ? p(`Open for the ${yr} season`, `Opið sumarið ${yr}`)
      : p('Closed for the season', 'Lokað yfir veturinn'),
    sub: p('Reception 17–21 · Quiet hours 23–07', 'Móttaka 17–21 · Kyrrð 23–07'),
  }
}
