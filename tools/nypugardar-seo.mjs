/**
 * Nýpugarðar — static SEO / answer-engine head injection.
 *
 * WHY THIS EXISTS AT ALL
 * Meta written by React on mount is fine for Google, which renders
 * JavaScript, and useless for the crawlers that matter most for a small farm
 * guesthouse: link previews in WhatsApp, Messenger and mail clients, and the
 * AI answer engines, which mostly read raw HTML. So every route's title,
 * description, canonical, language pair, Open Graph card and structured data
 * are written into the file after the build.
 *
 * TWO MODES
 *   catalogue   (default)  the two English preview routes under /preview/
 *                          nypugardar, kept noindex so the preview host never
 *                          competes with the real site.
 *   standalone  NYPUGARDAR_STANDALONE=1: the client's own deployment, four
 *                          pages at the domain root, English and Icelandic,
 *                          each pointing at the other with hreflang.
 *
 * INDEXING
 * Stays `noindex` until NYPUGARDAR_SITE_URL is set at build time, on launch.
 * SINCE THE LAUNCH (2026-09-18) the npm script supplies it, because forgetting
 * it silently ships `noindex, nofollow` and `Disallow: /` to a live client
 * site: that happened on 2026-09-19 and stood for about four hours before the
 * monthly-report verifier caught it. Override it only to build a preview copy
 * day, which flips it to indexable with correct canonicals:
 *
 *   NYPUGARDAR_SITE_URL=https://glacierview.is npm run build:nypugardar
 *
 * DRIFT GUARD
 * The facts below are mirrored from data.ts, godo.ts and prices.json, which
 * is the two-sources-of-truth trap that produces a site whose schema says one
 * thing and whose page says another. So this script READS those files and
 * refuses to build if a phone number, address, check-in time, room id or
 * room name here no longer appears there. A wrong fact in schema.org is worse
 * than none: Google shows it in the business panel.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = process.argv[2] || 'dist'
const basePath = (process.argv.find((a) => a.startsWith('--base=')) || '--base=/').slice(7)

const STANDALONE_DIST = process.env.NYPUGARDAR_STANDALONE === '1'

/* HER OWN BUILD IS ALWAYS THE LIVE DOMAIN. The standalone dist is only ever
   deployed to glacierview.is, so it defaults to the live origin and is
   indexable; only the catalogue preview on github.io stays noindex. This used
   to hang on NYPUGARDAR_SITE_URL alone, and a rebuild that forgot it published
   `noindex, nofollow` + `Disallow: /` to the live client site for about four
   hours on 2026-09-19. Putting the default in the npm script did NOT fix it:
   `VAR=x a && b && c` only exports to `a`, so the injector still ran without
   it. The signal has to live here, where the decision is made. */
const SITE = process.env.NYPUGARDAR_SITE_URL || (STANDALONE_DIST ? 'https://glacierview.is' : '')
const LIVE = Boolean(SITE)
const origin = LIVE ? SITE.replace(/\/$/, '') : 'https://sindrimar02.github.io'
const prefix = LIVE ? '' : basePath.replace(/\/$/, '')

/* ── The business, as published. Mirrored from data.ts; see DRIFT GUARD. ── */
const B = {
  name: 'Nýpugarðar',
  altNames: ['Nypugardar', 'Guesthouse Nýpugarðar', 'Gistiheimilið Nýpugörðum', 'Glacier View Guesthouse'],
  legalName: 'Nýpugarðar ehf.',
  /* A kennitala is a registry id, not a VSK (VAT) number: taxID, not vatID. */
  taxID: '510805-0380',
  street: 'Nýpugarðar',
  area: 'Mýrar',
  locality: 'Höfn í Hornafirði',
  region: 'Hornafjörður',
  postal: '781',
  country: 'IS',
  /* ferdalag.is listing, read 2026-09-01 */
  lat: 64.261553,
  lon: -15.438971,
  phoneDisplay: '+354 893 1826',
  phone: '+354 893 1826',
  email: 'nypu@simnet.is',
  checkin: '16:00',
  checkout: '11:00',
  rooms: 13,
  facebook: 'https://www.facebook.com/nypugardar/',
  /* Ferðamálastofa's own directory listing, checked live 2026-09-18: it
   * carries the name, the address, the phone, the email and the domain, so
   * it is a real entity anchor for a farm whose domain is not its name. */
  ferdalag: 'https://www.ferdalag.is/en/service/nypugardar',
  booking: 'https://www.booking.com/hotel/is/gistiheimilid-nypugordum.html',
  /* Booking.com headline figures, read live 2026-09-16 */
  rating: 8.8,
  reviewCount: 2289,
}

/* Godo room types: id, name, sleeps. Mirrored from godo.ts; guarded below. */
const ROOMS = [
  { key: 'twinSharedEconomy', id: '477163', en: 'Twin room with shared bathroom, economy', is: 'Tveggja manna herbergi með sameiginlegu baði, hagkvæmt', sleeps: 2 },
  { key: 'doubleTwinShared', id: '145056', en: 'Double or twin room with shared bathroom', is: 'Hjóna- eða tveggja manna herbergi með sameiginlegu baði', sleeps: 2 },
  { key: 'double', id: '259673', en: 'Double room', is: 'Hjónaherbergi', sleeps: 2 },
  { key: 'doubleTwinPrivate', id: '145057', en: 'Double or twin room with private bathroom', is: 'Hjóna- eða tveggja manna herbergi með eigin baði', sleeps: 2 },
  { key: 'doublePrivateExtraBed', id: '145058', en: 'Double room with private bathroom and extra bed', is: 'Hjónaherbergi með eigin baði og aukarúmi', sleeps: 3 },
  { key: 'cottage3', id: '145059', en: 'Cottage for three', is: 'Sumarhús fyrir þrjá', sleeps: 3 },
  { key: 'familyCottage', id: '182212', en: 'Family cottage', is: 'Fjölskyldusumarhús', sleeps: 4 },
]

const FACILITIES = ['Restaurant', 'Bar', 'Free WiFi', 'Free private parking', 'Garden', 'Terrace', 'Hiking', 'Family rooms', 'Non-smoking rooms']

const PRICES = JSON.parse(readFileSync('src/preview/nypugardar/prices.json', 'utf8'))
const fromPrice = (key) => PRICES.rooms?.[key]?.from ?? null
const lowest = PRICES.groups?.shared ?? Math.min(...ROOMS.map((r) => fromPrice(r.key)).filter((n) => typeof n === 'number'))
const highest = Math.max(...ROOMS.map((r) => fromPrice(r.key)).filter((n) => typeof n === 'number'))

/* ── The six questions, mirrored from src/preview/nypugardar/copy.ts ─────
 * The rooms page renders these; the drift guard asserts they are still
 * there before the build may publish them as FAQPage structured data. */
const FAQ_EN = [
  ['How far is Jökulsárlón from the farm?', 'Jökulsárlón is about 50 km from the farm, a little under an hour along Route 1. Höfn is 20 km away, and Nýpugarðar is 4 km off the Ring Road.'],
  ['Can I have dinner at the farm?', 'Yes. In the evening we serve dinner from the menu in the dining room facing the glacier. You do not need to book ahead. Just let us know when you arrive that you would like dinner.'],
  ['What do you serve for breakfast?', 'We serve a buffet in the dining room, with the same glacier view. Vegetarian, vegan and gluten-free options are available. If you are leaving for Jökulsárlón before breakfast starts, we can prepare breakfast to go.'],
  ['What time can I check in and out?', 'Check-in is from 16:00 to 22:00 and check-out from 07:30 to 11:00. If you arrive after 22:00, a note on the table in the lobby tells you which room is yours.'],
  ['Can I bring a pet, and are children welcome?', 'Pets are not allowed and the guesthouse is non-smoking. Children are welcome, and guests aged 7 and over are charged as adults.'],
  ['Can I book directly with the farm?', 'Yes. A direct booking comes straight to us at the farm, and our booking system shows live prices and availability. Nýpugarðar is also listed on Booking.com, HeyIceland and Guide to Iceland.'],
]

const FAQ_IS = [
  ['Hvað er langt að Jökulsárlóni?', 'Jökulsárlón er í um 50 km fjarlægð frá bænum, tæpan klukkutíma eftir þjóðvegi 1. Til Hafnar eru 20 km og Nýpugarðar eru 4 km frá hringveginum.'],
  ['Er hægt að fá kvöldmat á bænum?', 'Já. Á kvöldin bjóðum við upp á mat af matseðli í matsalnum sem snýr að jöklinum. Það þarf ekki að bóka fyrirfram. Láttu okkur bara vita við komu að þú viljir kvöldmat.'],
  ['Hvað er í morgunmat?', 'Við bjóðum upp á hlaðborð í matsalnum, með sömu jöklasýn. Grænmetis-, vegan- og glútenlausir kostir eru í boði. Ef þú leggur af stað að Jökulsárlóni áður en morgunmatur er borinn fram útbúum við nesti handa þér.'],
  ['Hvenær er innritun og útritun?', 'Innritun er frá 16:00 til 22:00 og útritun frá 07:30 til 11:00. Ef þú kemur eftir klukkan 22:00 liggur blað á borðinu í anddyrinu sem segir þér hvar þú gistir.'],
  ['Mega gæludýr koma og eru börn velkomin?', 'Gæludýr eru ekki leyfð og gistihúsið er reyklaust. Börn eru velkomin og gestir 7 ára og eldri greiða sem fullorðnir.'],
  ['Get ég bókað beint hjá bænum?', 'Já. Bein bókun kemur beint til okkar á bænum og bókunarkerfið okkar sýnir verð og laus herbergi í rauntíma. Nýpugarðar eru einnig á Booking.com, HeyIceland og Guide to Iceland.'],
]

/* ── Drift guard ──────────────────────────────────────────────────────── */
function assertMatchesSource() {
  const data = 'src/preview/nypugardar/data.ts'
  const godo = 'src/preview/nypugardar/godo.ts'
  if (!existsSync(data) || !existsSync(godo)) return // building from a tree without sources
  const d = readFileSync(data, 'utf8')
  const g = readFileSync(godo, 'utf8')
  const bad = []
  for (const [needle, what] of [
    [`'${B.phoneDisplay}'`, 'phone number'],
    [`'${B.street}, ${B.postal} ${B.locality}'`, 'address'],
    [`value: '${B.checkin}'`, 'check-in time'],
    [`value: '${B.checkout}'`, 'check-out time'],
    [`'${B.email}'`, 'email'],
  ]) if (!d.includes(needle)) bad.push(what)
  for (const r of ROOMS) if (!g.includes(`'${r.id}'`)) bad.push(`room id ${r.id} (${r.key})`)
  /* Every FAQ answer must still be rendered on the rooms page. Structured
   * data describing content the page does not carry is exactly what earns a
   * manual action, and the copy is the thing that will be edited. */
  const copyPath = 'src/preview/nypugardar/copy.ts'
  if (existsSync(copyPath)) {
    const copy = readFileSync(copyPath, 'utf8')
    for (const [lang, table] of [['en', FAQ_EN], ['is', FAQ_IS]])
      for (const [q, a] of table) {
        if (!copy.includes(q)) bad.push(`FAQ question missing from the page (${lang}): "${q.slice(0, 40)}"`)
        if (!copy.includes(a)) bad.push(`FAQ answer missing from the page (${lang}): "${q.slice(0, 40)}"`)
      }
  }
  if (bad.length) {
    console.error(
      `nypugardar-seo: these no longer match the source: ${bad.join(', ')}.\n` +
        'Structured data would publish a fact the page contradicts. Update tools/nypugardar-seo.mjs.',
    )
    process.exit(1)
  }
}

const addr = `${B.street}, ${B.postal} ${B.locality}`
const img = (p) => `${origin}${prefix}/nypugardar/${p}`
const HERO = img('photos/125645004-2000.jpg')
const DINING = img('photos/305950064-2000.jpg')
const HOUSE = img('photos/258957593-2000.jpg')

/* ── Pages ────────────────────────────────────────────────────────────── */
const COPY = {
  en: {
    home: {
      title: 'Nýpugarðar | Farm guesthouse between Höfn and Jökulsárlón',
      desc: `Family-run farm guesthouse on Mýrar in Hornafjörður, 20 km from Höfn and about 50 km from Jökulsárlón. Quiet rooms and cottages, glacier views, breakfast and dinner at the farm. Rated ${B.rating} on Booking.com. Book direct.`,
    },
    rooms: {
      title: 'Rooms, cottages and prices | Nýpugarðar',
      desc: `Seven room types, the two cottages among them, at Nýpugarðar guesthouse near Höfn, from ${lowest} € a night. Private or shared bathrooms, sleeps 2 to 4, photographs of every room and direct booking.`,
    },
    winter: {
      title: 'Winter at Nýpugarðar | Daylight, roads and northern lights',
      desc: 'What winter is like at Nýpugarðar guesthouse near Höfn: hours of daylight month by month, road conditions on Route 1, northern lights from the farmyard, arriving after dark and getting to Jökulsárlón in winter.',
    },
    privacy: {
      title: 'Privacy | Nýpugarðar',
      desc: 'How Nýpugarðar guesthouse handles your personal information: this website, bookings, email and your rights.',
    },
    crumbHome: 'Nýpugarðar',
    crumbRooms: 'Rooms and prices',
    crumbWinter: 'Winter',
    crumbPrivacy: 'Privacy',
    ogLocale: 'en_GB',
  },
  is: {
    home: {
      title: 'Nýpugarðar | Sveitagisting milli Hafnar og Jökulsárlóns',
      desc: `Fjölskyldurekið sveitagistiheimili á Mýrum í Hornafirði, 20 km frá Höfn og um 50 km frá Jökulsárlóni. Kyrrlát herbergi og sumarhús, jöklasýn, morgunmatur og kvöldmatur á bænum. Einkunn ${String(B.rating).replace('.', ',')} á Booking.com. Bókaðu beint.`,
    },
    rooms: {
      title: 'Herbergi, sumarhús og verð | Nýpugarðar',
      desc: `Sjö herbergisgerðir, þar á meðal tvö sumarhús, á Nýpugörðum, frá ${lowest} € nóttin. Eigið eða sameiginlegt bað, fyrir 2 til 4 gesti, myndir af hverju herbergi og bein bókun.`,
    },
    winter: {
      title: 'Veturinn á Nýpugörðum | Birta, færð og norðurljós',
      desc: 'Hvernig veturinn er á Nýpugörðum við Höfn: birtan mánuð fyrir mánuð, færð á þjóðvegi 1, norðurljós frá hlaðinu, koma eftir myrkur og leiðin að Jökulsárlóni að vetri.',
    },
    privacy: {
      title: 'Persónuvernd | Nýpugarðar',
      desc: 'Hvernig gistiheimilið Nýpugarðar fer með persónuupplýsingar: vefurinn, bókanir, tölvupóstur og réttindi þín.',
    },
    crumbHome: 'Nýpugarðar',
    crumbRooms: 'Herbergi og verð',
    crumbWinter: 'Veturinn',
    crumbPrivacy: 'Persónuvernd',
    ogLocale: 'is_IS',
  },
}

const PAGES = STANDALONE_DIST
  ? [
      { lang: 'en', key: 'home', dir: '', image: HERO },
      { lang: 'en', key: 'rooms', dir: 'rooms', image: DINING },
      { lang: 'is', key: 'home', dir: 'is', image: HERO },
      { lang: 'is', key: 'rooms', dir: 'is/herbergi', image: DINING },
      { lang: 'en', key: 'winter', dir: 'winter', image: HOUSE },
      { lang: 'is', key: 'winter', dir: 'is/vetur', image: HOUSE },
      { lang: 'en', key: 'privacy', dir: 'privacy', image: HERO },
      { lang: 'is', key: 'privacy', dir: 'is/personuvernd', image: HERO },
    ]
  : [
      { lang: 'en', key: 'home', dir: 'preview/nypugardar', image: HERO },
      { lang: 'en', key: 'rooms', dir: 'preview/nypugardar/herbergi', image: DINING },
      { lang: 'en', key: 'winter', dir: 'preview/nypugardar/vetur', image: HOUSE },
      { lang: 'en', key: 'privacy', dir: 'preview/nypugardar/personuvernd', image: HERO },
    ]

const urlFor = (p) => `${origin}${prefix}/${p.dir ? p.dir + '/' : ''}`
const twin = (p) => PAGES.find((q) => q.key === p.key && q.lang !== p.lang) ?? null
const homeOf = (lang) => PAGES.find((q) => q.key === 'home' && q.lang === lang) ?? PAGES[0]

/* ── schema.org ───────────────────────────────────────────────────────── */
function lodging(lang) {
  const en = lang === 'en'
  return {
    '@context': 'https://schema.org',
    '@type': 'BedAndBreakfast',
    '@id': `${urlFor(homeOf('en'))}#guesthouse`,
    name: B.name,
    alternateName: B.altNames,
    legalName: B.legalName,
    taxID: B.taxID,
    url: urlFor(homeOf(lang)),
    inLanguage: lang === 'is' ? 'is' : 'en',
    description: en
      ? 'Family-run farm guesthouse on Mýrar in Hornafjörður, between Höfn and Jökulsárlón. Eleven rooms, two with a shared bathroom, and two cottages. Breakfast and dinner are served in a dining room looking towards the glaciers.'
      : 'Fjölskyldurekið sveitagistiheimili á Mýrum í Hornafirði, milli Hafnar og Jökulsárlóns. Ellefu herbergi, þar af tvö með sameiginlegu baði, og tvö sumarhús. Morgunmatur og kvöldmatur eru borin fram í matsal með útsýni til jöklanna.',
    image: [HERO, DINING, HOUSE],
    telephone: B.phone,
    email: B.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: B.street,
      addressLocality: B.locality,
      addressRegion: B.region,
      postalCode: B.postal,
      addressCountry: B.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: B.lat, longitude: B.lon },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${B.lat},${B.lon}`,
    checkinTime: B.checkin,
    checkoutTime: B.checkout,
    numberOfRooms: B.rooms,
    petsAllowed: false,
    smokingAllowed: false,
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Credit card',
    priceRange: `€${lowest}–€${highest}`,
    /* No openingHoursSpecification: the farm is closed over Christmas and New
       Year (Bogga, 2026-09-19) and the booking calendar is the only source that
       stays true year to year. This was question 7
     * for Bogga (Godo shows no rooms 22 to 31 December). */
    amenityFeature: FACILITIES.map((f) => ({ '@type': 'LocationFeatureSpecification', name: f, value: true })),
    servesCuisine: 'Icelandic',
    // Third-party Booking.com ratings remain attributed in visible copy.
    // They are not our own aggregate review collection.
    containsPlace: ROOMS.map((r) => {
      const price = fromPrice(r.key)
      const room = {
        '@type': 'HotelRoom',
        name: en ? r.en : r.is,
        occupancy: { '@type': 'QuantitativeValue', maxValue: r.sleeps, unitCode: 'C62' },
      }
      if (typeof price === 'number') {
        room.offers = {
          '@type': 'Offer',
          priceCurrency: PRICES.currency || 'EUR',
          price,
          priceSpecification: { '@type': 'UnitPriceSpecification', priceCurrency: PRICES.currency || 'EUR', price, unitText: en ? 'per night' : 'á nótt' },
          // A cached minimum price does not establish availability for dates.
          url: `https://property.godo.is/booking2.php?propid=62130&roomid=${r.id}&lang=${lang}&referer=nypugardar-web`,
        }
      }
      return room
    }),
    sameAs: [B.facebook, B.booking, B.ferdalag],
    areaServed: [
      { '@type': 'Place', name: 'Hornafjörður' },
      { '@type': 'Place', name: 'Jökulsárlón' },
      { '@type': 'Place', name: 'Höfn' },
    ],
  }
}

/** Real questions a traveller asks. Every answer is a fact stated on the
 *  page; FAQ schema that answers something the page does not say is the
 *  fastest way to a manual penalty.
 *
 *  THESE ARE MIRRORED FROM copy.ts, where the rooms page renders them
 *  visibly. The drift guard below asserts each one still appears there, so
 *  the schema cannot outlive the copy it claims to describe. */
function faq(lang) {
  const qa = lang === 'en' ? FAQ_EN : FAQ_IS
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: qa.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
}

const breadcrumb = (page) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: COPY[page.lang].crumbHome, item: urlFor(homeOf(page.lang)) },
    ...(page.key === 'home'
      ? []
      : [{
          '@type': 'ListItem',
          position: 2,
          name: page.key === 'privacy'
            ? COPY[page.lang].crumbPrivacy
            : page.key === 'winter'
              ? COPY[page.lang].crumbWinter
              : COPY[page.lang].crumbRooms,
          item: urlFor(page),
        }]),
  ],
})

/* ── Injection ────────────────────────────────────────────────────────── */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function headFor(page) {
  const c = COPY[page.lang][page.key]
  const url = urlFor(page)
  const other = twin(page)
  /* The privacy page describes a policy, not the lodging: breadcrumb only. */
  const ld = page.key === 'privacy' ? [breadcrumb(page)] : [lodging(page.lang), breadcrumb(page)]
  /* The FAQ schema goes on the page that CARRIES the questions, which is the
   * rooms page, not the home page. Structured data is a description of the
   * document it sits in; putting it on the home page would have described
   * content that is one click away. */
  if (page.key === 'rooms') ld.push(faq(page.lang))
  const alternates = other
    ? [
        `    <link rel="alternate" hreflang="${page.lang}" href="${url}" />`,
        `    <link rel="alternate" hreflang="${other.lang}" href="${urlFor(other)}" />`,
        `    <link rel="alternate" hreflang="x-default" href="${urlFor(page.lang === 'en' ? page : other)}" />`,
      ].join('\n')
    : ''
  return `
    <title>${esc(c.title)}</title>
    <meta name="description" content="${esc(c.desc)}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="${LIVE ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, nofollow'}" />
${alternates}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(B.name)}" />
    <meta property="og:locale" content="${COPY[page.lang].ogLocale}" />
    ${other ? `<meta property="og:locale:alternate" content="${COPY[other.lang].ogLocale}" />` : ''}
    <meta property="og:title" content="${esc(c.title)}" />
    <meta property="og:description" content="${esc(c.desc)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${page.image}" />
    <meta property="og:image:width" content="2000" />
    <meta property="og:image:height" content="${page.image === HERO ? 1125 : 902}" />
    <meta property="og:image:alt" content="${esc(page.lang === 'is' ? 'Kvöldsól yfir Mýrum við Nýpugarða, jöklar við sjóndeildarhringinn' : 'Evening sun over Mýrar at Nýpugarðar, glaciers along the horizon')}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(c.title)}" />
    <meta name="twitter:description" content="${esc(c.desc)}" />
    <meta name="twitter:image" content="${page.image}" />
    <meta name="geo.region" content="IS" />
    <meta name="geo.placename" content="${esc(B.locality)}" />
    <meta name="geo.position" content="${B.lat};${B.lon}" />
    <meta name="ICBM" content="${B.lat}, ${B.lon}" />
    <link rel="icon" href="${prefix}/nypugardar/brand/favicon-32.png" type="image/png" sizes="32x32" />
    <link rel="icon" href="${prefix}/nypugardar/brand/favicon-48.png" type="image/png" sizes="48x48" />
    <link rel="apple-touch-icon" href="${prefix}/nypugardar/brand/apple-touch-icon.png" />
    <meta name="theme-color" content="#15130F" />
${ld.map((o) => `    <script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')}
`
}

function inject(page) {
  const file = join(dist, page.dir, 'index.html')
  if (!existsSync(file)) {
    console.error(`nypugardar-seo: ${file} missing; is the route in the prerender list / postbuild list?`)
    process.exit(1)
  }
  let html = readFileSync(file, 'utf8')
  html = html.replace(/<html lang="[a-z-]*">/, `<html lang="${page.lang}">`)
  html = html
    .replace(/<title>[^<]*<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace(/<meta name="robots"[^>]*>/, '')
    .replace(/<link[^>]+rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*>/g, '')
    .replace(/<link[^>]+rel='(?:icon|shortcut icon|apple-touch-icon)'[^>]*>/g, '')
    .replace(/<meta name="theme-color"[^>]*>/g, '')
  // The shared shell's home photograph is unused on these pages.
  if (page.key !== 'home') html = html.replace(/<link\b[^>]*rel="preload"[^>]*as="image"[^>]*>/g, '')
  const routeHeads = STANDALONE_DIST
    ? `<script id="nyp-route-heads" type="application/json">${JSON.stringify(Object.fromEntries(PAGES.map(p => ['/' + p.dir, headFor(p)]))).replace(/</g, '\\u003c')}</script>`
    : ''
  html = html.replace('</head>', `${headFor(page)}${routeHeads}  </head>`)
  writeFileSync(file, html)
  console.log(`nypugardar-seo: ${page.dir || '/'} [${page.lang}] (${LIVE ? 'indexable' : 'noindex, preview host'})`)
}

/** Plain-language facts for answer engines. On launch this sits at /llms.txt. */
function writeLlms() {
  const dir = join(dist, STANDALONE_DIST ? '' : 'preview/nypugardar')
  const rooms = ROOMS.map((r) => `- ${r.en} (sleeps ${r.sleeps})${typeof fromPrice(r.key) === 'number' ? `: from ${fromPrice(r.key)} EUR per night` : ''}`).join('\n')
  const txt = `# ${B.name}

> Family-run farm guesthouse on Mýrar in Hornafjörður, south-east Iceland, between Höfn and Jökulsárlón glacier lagoon.
> Fjölskyldurekið sveitagistiheimili á Mýrum í Hornafirði, milli Hafnar og Jökulsárlóns.

## Facts
- Address: ${addr}, Iceland (${B.lat}, ${B.lon})
- 4 km off Route 1 (the Ring Road). 20 km to Höfn. About 50 km to Jökulsárlón glacier lagoon.
- Phone: ${B.phone}
- Email: ${B.email}
- Check-in ${B.checkin} to 22:00, check-out 07:30 to ${B.checkout}. Guests arriving later find a note on the table in the lobby saying which room is theirs.
- ${B.rooms} places to sleep: 11 rooms (2 of them with shared bathroom) and 2 cottages, one for three guests and one for four.
- No pets. Non-smoking. Children welcome; guests aged 7 and over pay as adults.
- Facilities: ${FACILITIES.join(', ')}.
- Rated ${B.rating} out of 10 ("Fabulous") from over 2,200 guest reviews on Booking.com.
- Prices are in EUR. The indicative lowest rates below are cached from Godo; confirm current prices and availability for your dates in the booking system.

## Rooms and lowest nightly rates
${rooms}

## Food
- Dinner: served from the evening menu in the dining room facing the glacier. No advance reservation is needed; guests let the farm know on arrival if they would like dinner.
- Breakfast: buffet and continental in the same dining room, with vegetarian, vegan and gluten-free options. Breakfast to go is available for guests leaving before service begins.

## Winter (November to March)
- The farm takes guests through the winter, apart from Christmas and New Year, when it is closed; the booking system shows which nights are free.
- Daylight at the farm: about 8 hours on 1 November, 5 hours on 1 December, about 4 hours around 21 December (sunrise 10:58, sunset 15:01), 7 hours on 1 February and 10 hours on 1 March.
- Northern lights are visible from the farmyard on clear nights from September to April; there is no streetlight on Mýrar.
- Route 1 runs past the farm and is cleared in winter but can close in storms. Road conditions: road.is (Vegagerðin). Alerts: safetravel.is. Aurora forecast: vedur.is.
- Arriving after dark is normal. Check-in runs to 22:00; later arrivals find a note on the table in the lobby saying which room is theirs.
- Jökulsárlón is about 50 km, roughly 50 minutes when the road is clear. Ice cave and glacier tours run through the winter and leave early; breakfast to go can be arranged the evening before.
- Full page: ${origin}${prefix}/winter (Icelandic: ${origin}${prefix}/is/vetur)

## The place
- The farm stands on a low hill above Mýrar, looking towards the mountains and outlet glaciers of Vatnajökull. The setting is quiet, and from September to April guests can watch for the northern lights on dark, clear evenings.
- Nearby: Höfn (20 km, with a swimming pool and plenty to do), Þórbergssetur museum (37 km by road), Jökulsárlón (about 50 km).

## Booking
Book directly at ${urlFor(homeOf('en'))} (live dates and prices) or call ${B.phone}. Also listed on Booking.com, HeyIceland and Guide to Iceland.
`
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'llms.txt'), txt)
  console.log('nypugardar-seo: llms.txt')
}

/** Sitemap with the language pair declared on every URL, and robots. */
function writeSitemap() {
  const dir = join(dist, STANDALONE_DIST ? '' : 'preview/nypugardar')
  const urls = PAGES.map((p) => {
    const other = twin(p)
    const alt = other
      ? `\n    <xhtml:link rel="alternate" hreflang="${p.lang}" href="${urlFor(p)}" />` +
        `\n    <xhtml:link rel="alternate" hreflang="${other.lang}" href="${urlFor(other)}" />` +
        `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(p.lang === 'en' ? p : other)}" />`
      : ''
    return `  <url>\n    <loc>${urlFor(p)}</loc>${alt}\n    <changefreq>weekly</changefreq>\n    <priority>${p.key === 'home' ? (p.lang === 'en' ? '1.0' : '0.9') : p.key === 'privacy' ? '0.3' : '0.8'}</priority>\n  </url>`
  }).join('\n')
  writeFileSync(
    join(dir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  )
  /* The AI crawlers are named explicitly, and allowed on purpose. "User-agent:
   * *" already permits them, but several are blocked by default in hosting
   * presets, and a silent block is indistinguishable from not being found.
   * For a farm guesthouse, being the answer when someone asks an assistant
   * "where can I stay with dinner near Jökulsárlón" is worth as much as a
   * search ranking. */
  const AI_AGENTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot']
  writeFileSync(
    join(dir, 'robots.txt'),
    LIVE
      ? `User-agent: *\nAllow: /\n\n` + AI_AGENTS.map((a) => `User-agent: ${a}\nAllow: /\n`).join('\n') + `\nSitemap: ${origin}/sitemap.xml\n`
      : `# Preview host: the real robots.txt is generated with NYPUGARDAR_SITE_URL set.\nUser-agent: *\nDisallow: /\n`,
  )
  console.log('nypugardar-seo: sitemap.xml + robots.txt')
}

assertMatchesSource()
PAGES.forEach(inject)
writeLlms()
writeSitemap()
console.log(`nypugardar-seo: done${LIVE ? ` for ${origin}` : ''}`)
