/**
 * Reynir bakarí — static SEO/answer-engine head injection.
 *
 * WHY THIS EXISTS AT ALL
 * This app is a single-page React build: `postbuild` copies one identical
 * index.html to every route, so every page ships the catalogue's generic
 * title, its Icelandic-site-announcing-itself-as-English `lang="en"`, and a
 * blanket `noindex`. Meta written by React on mount is fine for Google (it
 * renders JS) but useless for the crawlers that matter most here — Facebook
 * and Messenger link previews, and the AI answer engines, which mostly read
 * raw HTML. So the facts are written into the file after the build.
 *
 * WHERE THE FACTS COME FROM
 * The phone number, email and opening hours are edited by the owner in Sanity
 * and rendered from there — the printed hours line, the open/closed badge and
 * the phone link all read the CMS. So the structured data reads it too, from
 * the same payload this build was rendered from. It used to keep its own copy
 * of 07:00-17:00 and guard it against data.ts, which is the FALLBACK rather
 * than the truth: the day the owner changed a Sunday, the page would have said
 * one thing and the schema another, and it is the schema Google prints in the
 * business panel.
 *
 * DRIFT GUARD
 * What is still written here is the fallback — the values published if Sanity
 * cannot be reached, which is also what the site itself falls back to. So the
 * guard still reads data.ts and refuses to build if the two fallbacks have
 * drifted apart, and warns when the live hours have moved away from them.
 *
 * INDEXING
 * While this lives on the shared preview host it stays `noindex`, because
 * letting Google index it here and then moving it to reynirbakari.is creates a
 * duplicate that competes with the real site. Pass REYNIR_SITE_URL at build
 * time (i.e. on launch day) and it flips to indexable with correct canonicals:
 *
 *   REYNIR_SITE_URL=https://reynirbakari.is npm run build
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = process.argv[2] || 'dist'
const basePath = (process.argv.find((a) => a.startsWith('--base=')) || '--base=/').slice(7)

/** Set on launch day. Unset = still on the preview host = stay out of the index. */
const SITE = process.env.REYNIR_SITE_URL || ''
const LIVE = Boolean(SITE)
const origin = LIVE ? SITE.replace(/\/$/, '') : 'https://sindrimar02.github.io'
const prefix = LIVE ? '' : basePath.replace(/\/$/, '')

/* ── The business, as published. Mirrored from data.ts; see DRIFT GUARD. ──── */
const B = {
  name: 'Reynir bakarí',
  legalName: 'Reynir bakari ehf.',
  vatID: '701195-3029',
  street: 'Dalvegur 4',
  postal: '201',
  city: 'Kópavogur',
  country: 'IS',
  lat: 64.1046006,
  lon: -21.8755066,
  phoneDisplay: '564 4700',
  phone: '+354 564 4700',
  email: 'reynirbakari@reynirbakari.is',
  orderEmail: 'pantanir@reynirbakari.is',
  founded: '1994',
  opens: '07:00',
  closes: '17:00',
  facebook: 'https://www.facebook.com/ReynirBakari',
  instagram: 'https://www.instagram.com/reynir.bakari',
  priceRange: '$$',
}

/* The fallbacks, captured before the CMS overlay below can change them. The
   drift guard compares THESE against data.ts — comparing the live values would
   fail the build every time the owner legitimately edited his own hours. */
const FALLBACK_PHONE = B.phoneDisplay
const FALLBACK_OPENS = B.opens
const FALLBACK_CLOSES = B.closes
const FALLBACK_OPEN_H = Number(FALLBACK_OPENS.split(':')[0])
const FALLBACK_CLOSE_H = Number(FALLBACK_CLOSES.split(':')[0])

/* ── The live values, from the CMS this build was made from ───────────────
 *
 * Read from the payload the prerender baked into this very build where there
 * is one: that is the exact object the pages were rendered from, so the head
 * cannot contradict the body even if someone saves in Sanity between the two
 * steps. Fetched directly otherwise (the catalogue build does not prerender).
 * If both fail the constants above stand, and say so out loud — that is the
 * same content the site itself would fall back to, so the two still agree. */
const CMS_PROJECT = 'v4v3s4wg'
const CMS_DATASET = 'production'
const CMS_QUERY =
  '{"settings": *[_type=="siteSettings"][0]{phoneDisplay, phoneHref, email, orderEmail, facebook, instagram},' +
  ' "hours": *[_type=="openingHours"][0]{mon,tue,wed,thu,fri,sat,sun}}'

function bakedCms() {
  const home = process.env.REYNIR_STANDALONE === '1' ? '' : 'preview/reynir'
  const file = join(dist, home, 'index.html')
  if (!existsSync(file)) return null
  const m = /<script id="__reynir_cms" type="application\/json">([\s\S]*?)<\/script>/.exec(
    readFileSync(file, 'utf8'),
  )
  if (!m) return null
  try {
    return JSON.parse(m[1])
  } catch {
    return null
  }
}

async function fetchCms() {
  const url =
    `https://${CMS_PROJECT}.api.sanity.io/v2025-08-15/data/query/${CMS_DATASET}` +
    `?query=${encodeURIComponent(CMS_QUERY)}&returnQuery=false&perspective=published`
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()).result ?? null
}

let cms = bakedCms()
let cmsSource = cms ? 'the payload baked into this build' : ''
if (!cms) {
  try {
    cms = await fetchCms()
    cmsSource = 'Sanity'
  } catch (e) {
    console.warn(
      `reynir-seo: CMS unavailable (${e.message}) — publishing the fallbacks in this file, ` +
        'which is what the site falls back to as well.',
    )
  }
}

/* Overlay whatever the CMS actually holds. Anything it does not hold keeps the
   fallback above, exactly as sanity.ts does for the page. */
{
  const c = cms?.settings
  if (c?.phoneHref) B.phone = c.phoneHref
  if (c?.phoneDisplay) B.phoneDisplay = c.phoneDisplay
  if (c?.email) B.email = c.email
  if (c?.orderEmail) B.orderEmail = c.orderEmail
  if (c?.facebook) B.facebook = c.facebook
  if (c?.instagram) B.instagram = c.instagram
}

/* ── Opening hours, per day, in display order ──────────────────────────── */
const DAYS = [
  { key: 'mon', schema: 'Monday', is: 'Mán', en: 'Mon' },
  { key: 'tue', schema: 'Tuesday', is: 'Þri', en: 'Tue' },
  { key: 'wed', schema: 'Wednesday', is: 'Mið', en: 'Wed' },
  { key: 'thu', schema: 'Thursday', is: 'Fim', en: 'Thu' },
  { key: 'fri', schema: 'Friday', is: 'Fös', en: 'Fri' },
  { key: 'sat', schema: 'Saturday', is: 'Lau', en: 'Sat' },
  { key: 'sun', schema: 'Sunday', is: 'Sun', en: 'Sun' },
]
const hhmm = (v, fb) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(v || '').trim())
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : fb
}
const HOURS = DAYS.map((d) => {
  const c = cms?.hours?.[d.key]
  return { ...d, closed: Boolean(c?.closed), opens: hhmm(c?.open, B.opens), closes: hhmm(c?.close, B.closes) }
})

/** Consecutive days sharing the same hours, collapsed — "Mán–Fös 07:00–17:00"
 *  rather than five identical lines. */
function hourGroups() {
  const out = []
  for (const d of HOURS) {
    const last = out[out.length - 1]
    if (last && last.closed === d.closed && last.opens === d.opens && last.closes === d.closes) last.days.push(d)
    else out.push({ closed: d.closed, opens: d.opens, closes: d.closes, days: [d] })
  }
  return out
}
/** True when all seven days are open on the same hours — the shop's usual case,
 *  and the only one that can honestly be phrased as "every day". */
const everyDaySame = () => {
  const g = hourGroups()
  return g.length === 1 && !g[0].closed
}
const spanOf = (g, lang) => {
  const names = g.days.map((d) => d[lang])
  const span = names.length === 1 ? names[0] : `${names[0]}–${names[names.length - 1]}`
  return g.closed ? `${span} ${lang === 'en' ? 'closed' : 'lokað'}` : `${span} ${g.opens}–${g.closes}`
}
/** One sentence of opening hours, for the FAQ answer. */
function hoursSentence(lang) {
  const g = hourGroups()
  if (everyDaySame()) {
    return lang === 'en'
      ? `Open every day from ${g[0].opens} to ${g[0].closes}, weekends included.`
      : `Opið er alla daga frá klukkan ${g[0].opens} til ${g[0].closes}, líka um helgar.`
  }
  const spans = g.map((x) => spanOf(x, lang)).join(', ')
  return lang === 'en' ? `Opening hours: ${spans}.` : `Opnunartími: ${spans}.`
}
/** The same, as a fragment for llms.txt. */
function hoursFragment() {
  const g = hourGroups()
  return everyDaySame()
    ? `every day ${g[0].opens}–${g[0].closes} (including weekends)`
    : g.map((x) => spanOf(x, 'en')).join(', ')
}

/* ── Drift guard: the FALLBACKS must still agree with data.ts ─────────────
 *
 * data.ts holds what the site shows when Sanity cannot be reached, and this
 * file holds what the schema publishes in the same situation. If those two
 * drift apart, an outage produces a page and a schema that disagree — the
 * failure this guard has always existed to prevent, now aimed at the layer
 * that can actually still drift. */
function assertMatchesData() {
  const dataPath = 'src/preview/reynir/data.ts'
  if (!existsSync(dataPath)) return // building from a tree without sources
  const src = readFileSync(dataPath, 'utf8')
  const checks = [
    [FALLBACK_PHONE, 'phone number'],
    ['Dalvegur 4, 201 Kópavogur', 'address'],
    [`{ open: ${FALLBACK_OPEN_H} * 60, close: ${FALLBACK_CLOSE_H} * 60 }`, 'fallback opening hours'],
  ]
  const bad = checks.filter(([needle]) => !src.includes(needle))
  if (bad.length) {
    console.error(
      `reynir-seo: these fallbacks no longer match ${dataPath}: ${bad.map((b) => b[1]).join(', ')}.\n` +
        'If Sanity were unreachable the page and the schema would disagree. Update tools/reynir-seo.mjs.',
    )
    process.exit(1)
  }
  /* Not an error — the owner is allowed to change the hours, that is what the
     CMS is for. But the fallback is then stale, so say so once per build. */
  const off = HOURS.filter((h) => h.closed || h.opens !== FALLBACK_OPENS || h.closes !== FALLBACK_CLOSES)
  if (off.length) {
    console.warn(
      `reynir-seo: live hours differ from the fallback on ${off.map((h) => h.en).join(', ')}. ` +
        'The schema follows the CMS, but consider updating HOURS_BY_DAY in data.ts so an outage matches.',
    )
  }
}

const addr = `${B.street}, ${B.postal} ${B.city}`
const img = (p) => `${origin}${prefix}/reynir/${p}`

/* Social cards, cut to 1.91:1 on purpose.
 *
 * These used to reuse the page's own photography — including a 1400x1400
 * square on /panta. Facebook, Messenger and X all render summary_large_image
 * at 1.91:1, so a square was centre-cropped and the cake lost its top and
 * bottom in every share of the page people actually share. These four are
 * crops of the same photographs at exactly the ratio the crawlers use, so
 * what is composed here is what gets posted. Declaring the dimensions
 * alongside them is what stops Facebook rendering a text-only card the first
 * time it scrapes a URL, before it has fetched the image. */
const og = (p) => `${origin}${prefix}/reynir/og/${p}`
const OG_W = 1200
const OG_H = 630

/* ── standalone mode ──────────────────────────────────────────────────────
   REYNIR_STANDALONE=1: the dist is the client's own deployment (dist-reynir),
   where the pages live at the domain root — /, /panta, /sagan, /personuvernd —
   not under /preview/reynir. Same pages, same meta; only WHERE they live
   changes. */
const STANDALONE_DIST = process.env.REYNIR_STANDALONE === '1'

/* ── Pages ────────────────────────────────────────────────────────────────
 *
 * Every page exists twice: Icelandic at the clean path, English at the same
 * path under /en.
 *
 * WHY, when the site already had a language toggle. The toggle swapped the
 * copy at the same address, which means there was one URL per page and one
 * language for a search engine to index. An English search for "bakery
 * Kopavogur order cake" had nothing to match, and the page was declaring an
 * English alternate in its Open Graph tags that did not exist anywhere.
 * hreflang is the only way to tell Google that two URLs are the same page in
 * two languages, and hreflang needs two URLs.
 *
 * Icelandic keeps the bare paths on purpose: it is the default for a Kópavogur
 * bakery, the URLs already shared point there, and x-default names it as the
 * page to serve when no language matches. */
const CONTENT = [
  {
    key: 'home',
    path: '/',
    image: og('heim.jpg'),
    is: {
      title: `Reynir bakarí — handverksbakarí í Kópavogi síðan 1994`,
      desc:
        'Handverksbakarí og kaffihús á Dalvegi 4 í Kópavogi. Súrdeigsbrauð, vínarbrauð, snúðar og tertur, allt bakað á staðnum frá grunni. Opið alla daga 07–17.',
      imageAlt: 'Bakari við steinofninn í Reyni bakara, brauð inni í ofninum',
    },
    en: {
      title: 'Reynir bakarí — a craft bakery in Kópavogur since 1994',
      desc:
        'A family craft bakery and café at Dalvegur 4 in Kópavogur, Iceland. Sourdough, Danish pastries, buns and cakes, all baked on site from scratch. Open daily 07–17.',
      imageAlt: 'A baker at the deck oven in Reynir bakarí, bread inside the oven',
    },
  },
  {
    key: 'order',
    path: '/panta',
    image: og('panta.jpg'),
    is: {
      crumb: 'Sérpantanir',
      title: 'Panta tertu eða veislubakka — Reynir bakarí í Kópavogi',
      desc:
        'Pantaðu tertu, veislubakka eða bakkelsi hjá Reyni bakara á Dalvegi 4 í Kópavogi. Við staðfestum pöntunina símleiðis og greitt er þegar sótt er.',
      imageAlt: 'Rjómaterta frá Reyni bakara skreytt með rjómatoppum og kokteilberjum',
    },
    en: {
      crumb: 'Custom orders',
      title: 'Order a cake or party platter — Reynir bakarí, Kópavogur',
      desc:
        'Order a celebration cake, party platter or pastry tray from Reynir bakarí at Dalvegur 4 in Kópavogur. We confirm the order by phone and you pay on collection.',
      imageAlt: 'A Reynir cream cake finished with piped cream and cocktail cherries',
    },
  },
  {
    key: 'story',
    path: '/sagan',
    image: og('sagan.jpg'),
    is: {
      crumb: 'Sagan og myndasafnið',
      title: 'Sagan af Reyni bakara — fjölskyldubakarí í Kópavogi frá 1994',
      desc:
        'Fjölskyldubakarí á Dalvegi í Kópavogi síðan 1994. Sagan af Reyni bakara og myndasafn úr bakaríinu sjálfu, myndað á einum vinnumorgni í ágúst.',
      imageAlt: 'Bakari stráir hveiti yfir vinnuborðið í Reyni bakara',
    },
    en: {
      crumb: 'The story and the archive',
      title: 'The story of Reynir bakarí — a family bakery since 1994',
      desc:
        'A family bakery on Dalvegur in Kópavogur since 1994. The story of Reynir bakarí and a photographic archive from inside the bakery, shot across one working morning in August.',
      imageAlt: 'A baker throwing flour across the bench in Reynir bakarí',
    },
  },
  {
    key: 'legal',
    path: '/personuvernd',
    image: og('personuvernd.jpg'),
    noindexAlways: true,
    is: {
      crumb: 'Persónuvernd og skilmálar',
      title: 'Persónuvernd og skilmálar — Reynir bakarí',
      desc:
        'Hvaða upplýsingum Reynir bakarí safnar þegar þú sendir pöntunarbeiðni, af hverju, hversu lengi þær eru geymdar og hver réttindi þín eru. Ásamt skilmálum sérpantana.',
      imageAlt: 'Myndaveggurinn í búðinni hjá Reyni bakara á Dalvegi',
    },
    en: {
      crumb: 'Privacy and terms',
      title: 'Privacy and terms — Reynir bakarí',
      desc:
        'What Reynir bakarí collects when you send an order request, why, how long it is kept and what your rights are. Plus the terms for custom orders.',
      imageAlt: 'The wall of framed photographs in the shop at Reynir bakarí',
    },
  },
]

const LANGS = ['is', 'en']
/** English path for an Icelandic one: '/' -> '/en', '/panta' -> '/en/panta'. */
const enPath = (path) => (path === '/' ? '/en' : `/en${path}`)
/** Where the file for a path lives in this dist. */
const dirFor = (path) =>
  STANDALONE_DIST ? (path === '/' ? '' : path.slice(1)) : `preview/reynir${path === '/' ? '' : path}`

/** The eight pages this script writes: four routes × two languages. */
const PAGES = CONTENT.flatMap((c) =>
  LANGS.map((lang) => {
    const path = lang === 'is' ? c.path : enPath(c.path)
    return {
      key: c.key,
      lang,
      path,
      dir: dirFor(path),
      image: c.image,
      noindexAlways: c.noindexAlways,
      ...c[lang],
    }
  }),
)

/** URL for a page — page.dir may be '' (the root) in standalone mode. */
const urlFor = (p) => `${origin}${prefix}/${p.dir ? p.dir + '/' : ''}`
/** The same route in a given language: the other half of every hreflang pair. */
const inLang = (key, lang) => PAGES.find((p) => p.key === key && p.lang === lang)
/** The Icelandic home page — the site's root for schema and for x-default. */
const HOME = inLang('home', 'is')

/* ── schema.org ───────────────────────────────────────────────────────────── */
/* One business, one @id, on every page — the description is the only thing
 * that changes with the language of the page carrying it. */
const bakeryFor = (lang) => ({
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  '@id': `${urlFor(HOME)}#bakery`,
  name: B.name,
  legalName: B.legalName,
  vatID: B.vatID,
  url: urlFor(HOME),
  telephone: B.phone,
  email: B.email,
  foundingDate: B.founded,
  description:
    lang === 'en'
      ? 'A craft bakery producing fresh pastries, bread and cakes from scratch, with catering and a coffee buffet.'
      : 'Handverksbakarí sem framleiðir ferskt bakkelsi, brauð og kökur frá grunni. Einnig veisluþjónusta með kaffihlaðborði.',
  image: [img('gallery/gal-11.webp'), img('pistasiusnudur-bakki.jpg'), img('bud.webp')],
  logo: img('brand/logo.webp'),
  priceRange: B.priceRange,
  currenciesAccepted: 'ISK',
  servesCuisine: 'Bakery',
  address: {
    '@type': 'PostalAddress',
    streetAddress: B.street,
    postalCode: B.postal,
    addressLocality: B.city,
    addressCountry: B.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: B.lat, longitude: B.lon },
  /* One entry per block of days sharing the same hours, closed days left out
     entirely — which is how schema.org says a closed day is expressed. Written
     from the CMS, so if the owner shortens a Sunday the business panel follows
     him rather than contradicting his own page. */
  openingHoursSpecification: hourGroups()
    .filter((g) => !g.closed)
    .map((g) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: g.days.map((d) => d.schema),
      opens: g.opens,
      closes: g.closes,
    })),
  sameAs: [B.facebook, B.instagram],
  areaServed: { '@type': 'City', name: 'Kópavogur' },
})

/** Real questions a person (or an assistant answering for them) actually asks.
 *  Every answer here is a fact stated on the page — FAQ schema that answers
 *  something the page does not say is the fastest way to a manual penalty. */
const FAQ_IS = [
  ['Hvenær er opið hjá Reyni bakara?', hoursSentence('is')],
  ['Hvar er Reynir bakarí?', `Reynir bakarí er á ${addr}. Bakaríið er eitt, á Dalvegi.`],
  [
    'Er hægt að panta tertu hjá Reyni bakara?',
    `Já. Hægt er að panta tertur, veislubakka og bakkelsi fyrirfram á vefnum eða í síma ${B.phoneDisplay}. Við staðfestum pöntunina símleiðis og greitt er þegar sótt er.`,
  ],
  [
    'Býður Reynir bakarí upp á veisluþjónustu?',
    'Já, Reynir bakarí býður veisluþjónustu með kaffihlaðborði, ásamt tertum og veislubökkum fyrir fundi og mannfagnaði.',
  ],
  ['Er hægt að fá brauðin send heim?', 'Já, heimsending um höfuðborgarsvæðið er í boði í gegnum aha.is.'],
]

/* The same five questions in English — asked by a visitor, or by an assistant
 * answering on their behalf. Translated, not invented: each answer states the
 * same fact as its Icelandic twin, and the English page says it too. */
const FAQ_EN = [
  ['What are the opening hours of Reynir bakarí?', hoursSentence('en')],
  ['Where is Reynir bakarí?', `Reynir bakarí is at ${addr}, Iceland. There is one bakery, on Dalvegur.`],
  [
    'Can I order a cake from Reynir bakarí?',
    `Yes. Cakes, party platters and pastry trays can be ordered in advance on the website or by phone on +354 ${B.phoneDisplay}. We confirm the order by phone and you pay on collection.`,
  ],
  [
    'Does Reynir bakarí do catering?',
    'Yes. Reynir bakarí caters with a coffee buffet, along with cakes and party platters for meetings and gatherings.',
  ],
  ['Can the bread be delivered?', 'Yes, delivery across the Reykjavík capital area is available through aha.is.'],
]

const faqFor = (lang) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: (lang === 'en' ? FAQ_EN : FAQ_IS).map(([name, text]) => ({
    '@type': 'Question',
    name,
    acceptedAnswer: { '@type': 'Answer', text },
  })),
})

/* Each page carries its own `crumb`. This was a two-way ternary — "/panta ?
 * 'Sérpantanir' : 'Persónuvernd og skilmálar'" — written when there were
 * three pages, and adding /sagan silently made it publish the story page to
 * Google as "Reynir bakarí › Persónuvernd og skilmálar". A breadcrumb that
 * contradicts the page is exactly the structured-data error Google acts on by
 * hand, so the name now comes from the page, and a new page without a crumb
 * fails the build rather than borrowing someone else's name. */
const breadcrumb = (page) => {
  if (page.key !== 'home' && !page.crumb) {
    console.error(`reynir-seo: ${page.path} has no crumb — add one to PAGES.`)
    process.exit(1)
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Reynir bakarí', item: urlFor(inLang('home', page.lang)) },
      ...(page.key === 'home'
        ? []
        : [{ '@type': 'ListItem', position: 2, name: page.crumb, item: urlFor(page) }]),
    ],
  }
}

/* ── Injection ────────────────────────────────────────────────────────────── */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function headFor(page) {
  if (!page.imageAlt) {
    console.error(`reynir-seo: ${page.path} has no imageAlt — add one to PAGES.`)
    process.exit(1)
  }
  const url = urlFor(page)
  const ld = [bakeryFor(page.lang), breadcrumb(page)]
  if (page.key === 'home') ld.push(faqFor(page.lang))
  /* hreflang, both ways plus x-default.
   *
   * Google needs each URL to name every language version INCLUDING itself, and
   * the set has to be reciprocal — an Icelandic page pointing at the English
   * one that does not point back is ignored outright. Both sides are generated
   * from the same list here, so they cannot drift apart. x-default names the
   * Icelandic page: it is what a searcher in a language we do not publish
   * should be given, and for a Kópavogur bakery that is the Icelandic site. */
  const alternates = LANGS.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="${urlFor(inLang(page.key, l))}" />`,
  )
    .concat(`    <link rel="alternate" hreflang="x-default" href="${urlFor(inLang(page.key, 'is'))}" />`)
    .join('\n')
  const ogLocale = page.lang === 'en' ? 'en_GB' : 'is_IS'
  const ogAlternate = page.lang === 'en' ? 'is_IS' : 'en_GB'
  return `
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.desc)}" />
    <link rel="canonical" href="${url}" />
${alternates}
    <meta name="robots" content="${page.noindexAlways ? 'noindex, follow' : LIVE ? 'index, follow, max-image-preview:large' : 'noindex, nofollow'}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(B.name)}" />
    <meta property="og:locale" content="${ogLocale}" />
    <meta property="og:locale:alternate" content="${ogAlternate}" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.desc)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${page.image}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="${OG_W}" />
    <meta property="og:image:height" content="${OG_H}" />
    <meta property="og:image:alt" content="${esc(page.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.desc)}" />
    <meta name="twitter:image" content="${page.image}" />
${
      page.key === 'home'
        ? `    <!-- The LCP element. It is the pistachio snúður floating in the hero,
         and without this hint the browser does not discover it until the
         React bundle has parsed and the component has mounted. fetchpriority
         is set here rather than on the <img>, because react-dom 18.3 does not
         know the property and would render it with a console warning; as a
         preload it is plain HTML that starts the fetch before any script
         runs. Both home pages only — on /panta and /personuvernd this image
         never appears, and preloading it there would be 172 KB of waste. -->
    <link rel="preload" as="image" href="${prefix}/reynir/pistasiusnudur.webp" type="image/webp" fetchpriority="high" />\n`
        : ''
    }    <meta name="geo.region" content="IS" />
    <meta name="geo.placename" content="${esc(B.city)}" />
    <meta name="geo.position" content="${B.lat};${B.lon}" />
    <meta name="ICBM" content="${B.lat}, ${B.lon}" />
    <!-- Their monogram, not the wordmark. The script logo is beautiful at
         header size and completely illegible at 32px — the strokes are hair
         thin and the capital's swash crosses itself, so every crop of it
         renders as a gold smudge. This is the initial in their own burgundy
         and gold, in a serif, drawn to survive the size. -->
    <link rel="icon" href="${prefix}/reynir/brand/favicon-32.png" type="image/png" sizes="32x32" />
    <link rel="icon" href="${prefix}/reynir/brand/favicon-48.png" type="image/png" sizes="48x48" />
    <link rel="apple-touch-icon" href="${prefix}/reynir/brand/apple-touch-icon.png" />
    <meta name="theme-color" content="#131313" />
${ld.map((o) => `    <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
`
}

function inject(page) {
  const file = join(dist, page.dir, 'index.html')
  if (!existsSync(file)) {
    console.error(`reynir-seo: ${file} missing — is the route in postbuild's list?`)
    process.exit(1)
  }
  let html = readFileSync(file, 'utf8')
  /* The shell arrives with a lang baked in — "en" from the catalogue's
     index.html, "is" from Reynir's own. Neither is right for all eight pages,
     so it is set from the page itself. A page that declares the wrong language
     is read out by screen readers in the wrong accent and indexed as the wrong
     language, which is the whole reason /en exists. */
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${page.lang}">`)
  // drop the catalogue's own title/description/robots so ours are not duplicates
  html = html
    .replace(/<title>[^<]*<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace(/<meta name="robots"[^>]*>/, '')
  /* Strip every icon the catalogue shell brought with it.
   *
   * Each route is a copy of the catalogue's index.html, which carries its own
   * `<link rel="icon">` tags pointing at Vite-hashed files under /assets/.
   * Those are ABSOLUTE and root-relative, so the moment this site is served
   * from reynirbakari.is they resolve to reynirbakari.is/assets/… — files
   * that will not exist there — and the tab falls back to whatever the origin
   * root serves. That is exactly the inheritance trap favicon-guard.mjs
   * exists to catch. Removing them here leaves only the tags added below, so
   * these pages are self-contained on any host. */
    .replace(/<link[^>]+rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*>/g, '')
    .replace(/<link[^>]+rel='(?:icon|shortcut icon|apple-touch-icon)'[^>]*>/g, '')
    .replace(/<meta name="theme-color"[^>]*>/g, '')
  html = html.replace('</head>', `${headFor(page)}  </head>`)
  writeFileSync(file, html)
  console.log(`reynir-seo: ${page.dir} (${LIVE ? 'indexable' : 'noindex — preview host'})`)
}

/** Plain-language facts for answer engines. Served next to the site; on launch
 *  this belongs at the domain root as /llms.txt. */
function writeLlms() {
  const dir = join(dist, STANDALONE_DIST ? '' : 'preview/reynir')
  const txt = `# ${B.name}

> Handverksbakarí og kaffihús í Kópavogi, rekið af sömu fjölskyldu síðan ${B.founded}.
> A family-run craft bakery and café in Kópavogur, Iceland, since ${B.founded}.

## Pages
- Icelandic: ${urlFor(inLang('home', 'is'))} (menu and story), ${urlFor(inLang('order', 'is'))} (ordering), ${urlFor(inLang('story', 'is'))} (history and photographs)
- English: ${urlFor(inLang('home', 'en'))}, ${urlFor(inLang('order', 'en'))}, ${urlFor(inLang('story', 'en'))}

## Facts
- Address: ${addr}, Iceland
- Opening hours: ${hoursFragment()}
- Phone: +354 ${B.phoneDisplay}
- Email: ${B.email}
- Orders: ${B.orderEmail}
- Founded: ${B.founded} by Reynir Þorleifsson; run today by his sons Þorleifur Karl and Henry Þór
- One location only. A former second shop at Hamraborg 14 closed around 2024.
- Everything is baked on site from scratch. Many breads are sugar-free and made with Icelandic rapeseed oil.

## What they sell
- Sourdough and traditional Icelandic breads (hvítt and gróft súrdeigsbrauð, normalbrauð, döðlubrauð, rúnstykki)
- Danish pastries and buns (vínarbrauðslengja, kanillengja, snúður, pistasíusnúður, gleraugu, kleina)
- Cakes (skúffukaka, gulrótarkaka, djöflaterta, hressóterta and more)
- Celebration cakes, party platters and pastry trays to order
- Catering with a coffee buffet (veisluþjónusta með kaffihlaðborði)

## Ordering
Custom orders are placed on the website or by phone on ${B.phoneDisplay}. Orders are
confirmed by phone; nothing is charged online and payment is taken on collection
at ${B.street}. Home delivery across the capital area is available through aha.is.
`
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'llms.txt'), txt)
  console.log('reynir-seo: llms.txt')
}

/** Ready to move to the domain root on launch day. */
function writeSitemap() {
  const dir = join(dist, STANDALONE_DIST ? '' : 'preview/reynir')
  /* A page carrying `noindex` has no business in the sitemap: the sitemap says
   * "index this", the meta says "do not", and Search Console reports the pair
   * as an error for a page nobody wanted indexed in the first place. */
  /* Every URL carries its own hreflang set, the same one that is in the page's
   * head. Google accepts either place; giving it both is the cheapest way to
   * make sure a language version is discovered even before its page is
   * crawled. The xhtml namespace on <urlset> is what makes these legal. */
  const urls = PAGES.filter((p) => !p.noindexAlways)
    .map((p) => {
      const alts = LANGS.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(inLang(p.key, l))}"/>`,
      )
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(inLang(p.key, 'is'))}"/>`)
        .join('\n')
      return (
        `  <url>\n    <loc>${urlFor(p)}</loc>\n${alts}\n` +
        `    <changefreq>weekly</changefreq>\n    <priority>${p.key === 'home' ? '1.0' : '0.8'}</priority>\n  </url>`
      )
    })
    .join('\n')
  writeFileSync(
    join(dir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
      `${urls}\n</urlset>\n`,
  )
  /* The AI crawlers are named explicitly, and allowed on purpose.
   * "User-agent: *" already permits them, but several of these bots are
   * blocked by default in hosting presets and boilerplate robots files, and a
   * silent block is indistinguishable from not being found. For a one-shop
   * bakery, being the answer when someone asks an assistant "where can I order
   * a cake in Kopavogur" is worth as much as a search ranking. */
  const AI_AGENTS = [
    'GPTBot',          // OpenAI training + ChatGPT browsing
    'OAI-SearchBot',   // ChatGPT search index
    'ChatGPT-User',    // a user asking ChatGPT to open the page
    'PerplexityBot',
    'Perplexity-User',
    'ClaudeBot',
    'Claude-User',
    'Google-Extended', // Gemini / AI Overviews
    'Applebot-Extended',
    'Bingbot',         // Copilot
  ]
  writeFileSync(
    join(dir, 'robots.txt'),
    LIVE
      ? `User-agent: *\nAllow: /\n\n` +
        AI_AGENTS.map((a) => `User-agent: ${a}\nAllow: /\n`).join('\n') +
        `\nSitemap: ${origin}/sitemap.xml\n`
      : `# Preview host — the real robots.txt is generated with REYNIR_SITE_URL set.\nUser-agent: *\nDisallow: /\n`,
  )
  console.log('reynir-seo: sitemap.xml + robots.txt')
}

assertMatchesData()
PAGES.forEach(inject)
writeLlms()
writeSitemap()
console.log(`reynir-seo: done${LIVE ? ` for ${origin}` : ''}`)
