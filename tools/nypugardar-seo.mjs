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
 * Stays `noindex` until NYPUGARDAR_SITE_URL is set at build time, on launch
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

const SITE = process.env.NYPUGARDAR_SITE_URL || ''
const LIVE = Boolean(SITE)
const STANDALONE_DIST = process.env.NYPUGARDAR_STANDALONE === '1'
const origin = LIVE ? SITE.replace(/\/$/, '') : 'https://sindrimar02.github.io'
const prefix = LIVE ? '' : basePath.replace(/\/$/, '')

/* ── The business, as published. Mirrored from data.ts; see DRIFT GUARD. ── */
const B = {
  name: 'Nýpugarðar',
  altNames: ['Nypugardar', 'Guesthouse Nýpugarðar', 'Gistiheimilið Nýpugörðum', 'Glacier View Guesthouse'],
  legalName: 'Nýpugarðar ehf.',
  vatID: '510805-0380',
  street: 'Nýpugarðar',
  area: 'Mýrar',
  locality: 'Höfn í Hornafirði',
  region: 'Hornafjörður',
  postal: '781',
  country: 'IS',
  /* ferdalag.is listing, read 2026-09-01 */
  lat: 64.261553,
  lon: -15.438971,
  phoneDisplay: '893 1826',
  phone: '+354 893 1826',
  email: 'nypu@simnet.is',
  checkin: '16:00',
  checkout: '11:00',
  rooms: 13,
  guests: 24,
  facebook: 'https://www.facebook.com/nypugardar/',
  booking: 'https://www.booking.com/hotel/is/gistiheimilid-nypugordum.html',
  /* Booking.com headline figures, read live 2026-08-25 */
  rating: 8.8,
  reviewCount: 2268,
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
  ['How far is Jökulsárlón from the farm?', 'Jökulsárlón is 47 km away, a little under an hour along Route 1. Höfn is a 25 minute drive, and the farm sits 4 km off the Ring Road.'],
  ['Can I have dinner at the farm?', 'Yes, a buffet with lamb and traditional Icelandic cooking, served in the dining room facing the glacier. There is nothing to book ahead, just tell us when you arrive.'],
  ['What do you serve for breakfast?', 'A buffet in the same room, with the same view, and the kitchen covers vegetarian, vegan and gluten-free. Breakfast to go if you are leaving for the glacier lagoon before the room opens.'],
  ['What time can I check in and out?', 'Check in from 16:00 to 23:30, and check out from 07:30 to 11:00.'],
  ['Can I bring a pet, and are children welcome?', 'No pets, and the whole house is non-smoking. Children are welcome, and guests aged 7 and over are charged as adults.'],
  ['Can I book directly with the farm?', 'Yes, dates and prices here are live and the booking goes through our own system, so you deal with the farm and not an agency. Nýpugarðar is also on Booking.com, HeyIceland and Guide to Iceland.'],
]

const FAQ_IS = [
  ['Hvað er langt að Jökulsárlóni?', 'Jökulsárlón er í 47 km fjarlægð, tæpan klukkutíma eftir þjóðvegi 1. Til Hafnar er 25 mínútna akstur og bærinn stendur 4 km frá hringveginum.'],
  ['Er hægt að fá kvöldmat á bænum?', 'Já, hlaðborð með lambakjöti og hefðbundinni íslenskri matargerð, borið fram í matsalnum sem snýr að jöklinum. Það þarf ekkert að panta fyrirfram, láttu bara vita þegar þú kemur.'],
  ['Hvað er í morgunmat?', 'Hlaðborð í sama sal, með sama útsýni, og eldhúsið ræður við grænmetisfæði, vegan og glútenlaust. Morgunmat má fá með í nesti ef þú leggur af stað að Jökulsárlóni áður en salurinn opnar.'],
  ['Hvenær er innritun og útritun?', 'Innritun er frá 16:00 til 23:30 og útritun frá 07:30 til 11:00.'],
  ['Mega gæludýr koma og eru börn velkomin?', 'Gæludýr eru ekki leyfð og húsið er reyklaust. Börn eru velkomin og gestir 7 ára og eldri greiða sem fullorðnir.'],
  ['Get ég bókað beint hjá bænum?', 'Já, dagsetningar og verð hér uppfærast jafnóðum og bókunin fer í gegnum okkar eigið kerfi, svo þú ert í samskiptum við bæinn en ekki milliliði. Nýpugarðar eru einnig á Booking.com, HeyIceland og Guide to Iceland.'],
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
      desc: `Sheep farm guesthouse on Mýrar in Hornafjörður, 47 km from Jökulsárlón glacier lagoon and 25 minutes from Höfn. Rooms and cottages with glacier views, breakfast and a lamb dinner buffet. Rated ${B.rating} on Booking.com. Book direct.`,
    },
    rooms: {
      title: 'Rooms, cottages and prices | Nýpugarðar',
      desc: `Seven room types and two cottages at Nýpugarðar farm guesthouse near Höfn, from ${lowest} € a night. Private or shared bathrooms, sleeps 2 to 4, photographs of every room and live availability.`,
    },
    crumbHome: 'Nýpugarðar',
    crumbRooms: 'Rooms and prices',
    ogLocale: 'en_GB',
  },
  is: {
    home: {
      title: 'Nýpugarðar | Sveitagisting milli Hafnar og Jökulsárlóns',
      desc: `Gistiheimili á sauðfjárbúi á Mýrum í Hornafirði, 47 km frá Jökulsárlóni og 25 mínútur frá Höfn. Herbergi og sumarhús með jöklasýn, morgunverður og kvöldhlaðborð með lambakjöti. Einkunn ${String(B.rating).replace('.', ',')} á Booking.com. Bókaðu beint.`,
    },
    rooms: {
      title: 'Herbergi, sumarhús og verð | Nýpugarðar',
      desc: `Sjö herbergisgerðir og tvö sumarhús á Nýpugörðum, frá ${lowest} € nóttin. Eigið eða sameiginlegt bað, fyrir 2 til 4 gesti, myndir af hverju herbergi og laus herbergi í rauntíma.`,
    },
    crumbHome: 'Nýpugarðar',
    crumbRooms: 'Herbergi og verð',
    ogLocale: 'is_IS',
  },
}

const PAGES = STANDALONE_DIST
  ? [
      { lang: 'en', key: 'home', dir: '', image: HERO },
      { lang: 'en', key: 'rooms', dir: 'rooms', image: DINING },
      { lang: 'is', key: 'home', dir: 'is', image: HERO },
      { lang: 'is', key: 'rooms', dir: 'is/herbergi', image: DINING },
    ]
  : [
      { lang: 'en', key: 'home', dir: 'preview/nypugardar', image: HERO },
      { lang: 'en', key: 'rooms', dir: 'preview/nypugardar/herbergi', image: DINING },
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
    vatID: B.vatID,
    url: urlFor(homeOf(lang)),
    inLanguage: lang === 'is' ? 'is' : 'en',
    description: en
      ? 'Family-run guesthouse on a working sheep farm on Mýrar in Hornafjörður, between Höfn and Jökulsárlón glacier lagoon. Nine rooms with private bathroom, two with shared bathroom and two cottages, 24 guests when full. Home-cooked breakfast and a dinner buffet with lamb in a dining room facing the glacier. Open all year.'
      : 'Fjölskyldurekið gistiheimili á sauðfjárbúi á Mýrum í Hornafirði, milli Hafnar og Jökulsárlóns. Níu herbergi með eigin baði, tvö með sameiginlegu baði og tvö sumarhús, 24 gestir þegar fullt er. Heimalagaður morgunmatur og kvöldhlaðborð með lambakjöti í matsal sem snýr að jöklinum. Opið allt árið.',
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
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
    ],
    amenityFeature: FACILITIES.map((f) => ({ '@type': 'LocationFeatureSpecification', name: f, value: true })),
    servesCuisine: 'Icelandic',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: B.rating,
      bestRating: 10,
      worstRating: 1,
      reviewCount: B.reviewCount,
    },
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
          availability: 'https://schema.org/InStock',
          url: `https://property.godo.is/booking2.php?propid=62130&roomid=${r.id}&lang=${lang}&referer=nypugardar-web`,
        }
      }
      return room
    }),
    sameAs: [B.facebook, B.booking],
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
    ...(page.key === 'home' ? [] : [{ '@type': 'ListItem', position: 2, name: COPY[page.lang].crumbRooms, item: urlFor(page) }]),
  ],
})

/* ── Injection ────────────────────────────────────────────────────────── */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function headFor(page) {
  const c = COPY[page.lang][page.key]
  const url = urlFor(page)
  const other = twin(page)
  const ld = [lodging(page.lang), breadcrumb(page)]
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
  html = html.replace('</head>', `${headFor(page)}  </head>`)
  writeFileSync(file, html)
  console.log(`nypugardar-seo: ${page.dir || '/'} [${page.lang}] (${LIVE ? 'indexable' : 'noindex, preview host'})`)
}

/** Plain-language facts for answer engines. On launch this sits at /llms.txt. */
function writeLlms() {
  const dir = join(dist, STANDALONE_DIST ? '' : 'preview/nypugardar')
  const rooms = ROOMS.map((r) => `- ${r.en} (sleeps ${r.sleeps})${typeof fromPrice(r.key) === 'number' ? `: from ${fromPrice(r.key)} EUR per night` : ''}`).join('\n')
  const txt = `# ${B.name}

> Family-run guesthouse on a working sheep farm on Mýrar in Hornafjörður, south-east Iceland, between Höfn and Jökulsárlón glacier lagoon.
> Fjölskyldurekið gistiheimili á sauðfjárbúi á Mýrum í Hornafirði, milli Hafnar og Jökulsárlóns.

## Facts
- Address: ${addr}, Iceland (${B.lat}, ${B.lon})
- 4 km off Route 1 (the Ring Road). 25 minutes' drive to Höfn. 47 km to Jökulsárlón glacier lagoon.
- Phone: ${B.phone}
- Email: ${B.email}
- Open all year. Check-in ${B.checkin} to 23:30, check-out 07:30 to ${B.checkout}.
- ${B.rooms} places to sleep: 9 rooms with private bathroom, 2 rooms with shared bathroom, 2 cottages for 2 to 4 guests. ${B.guests} guests when full.
- No pets. Non-smoking. Children welcome; guests aged 7 and over pay as adults.
- Facilities: ${FACILITIES.join(', ')}.
- Rated ${B.rating} out of 10 ("Fabulous") from over 2,200 guest reviews on Booking.com.
- Prices are in EUR and come live from the farm's own booking system (Godo).

## Rooms and lowest nightly rates
${rooms}

## Food
- Dinner: a buffet with lamb, traditional Icelandic cooking with local ingredients, served in the dining room facing the glacier. Nothing to book ahead; guests say on arrival that they would like to eat.
- Breakfast: buffet and continental in the same room, with vegetarian, vegan and gluten-free options. Breakfast to go for guests leaving before the room opens.

## The place
- A working sheep farm on a low hill above the lowlands of Mýrar, with views over Hornafjörður fjord and Hvannadalshnjúkur, Iceland's highest mountain. Wild reindeer come down onto the land in winter. Guests can watch the lambing in spring.
- Nearby: Hólmi Zoo (5 km), Þórbergssetur museum and the Hornafjörður swimming pool (within 30 minutes), Jökulsárlón (47 km), Höfn (25 minutes).

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
    return `  <url>\n    <loc>${urlFor(p)}</loc>${alt}\n    <changefreq>weekly</changefreq>\n    <priority>${p.key === 'home' ? (p.lang === 'en' ? '1.0' : '0.9') : '0.8'}</priority>\n  </url>`
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
