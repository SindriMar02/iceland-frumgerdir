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
 * DRIFT GUARD
 * The business facts below are duplicated from src/preview/reynir/data.ts,
 * which is exactly the two-sources-of-truth trap that produces a site whose
 * schema says one thing and whose page says another. So this script READS
 * data.ts and refuses to build if the phone number, address or hours here no
 * longer appear there. A wrong opening time in schema.org is worse than none:
 * Google will show it in the business panel.
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

/* ── Drift guard: these must still be true in data.ts ─────────────────────── */
function assertMatchesData() {
  const dataPath = 'src/preview/reynir/data.ts'
  if (!existsSync(dataPath)) return // building from a tree without sources
  const src = readFileSync(dataPath, 'utf8')
  const checks = [
    [B.phoneDisplay, 'phone number'],
    ['Dalvegur 4, 201 Kópavogur', 'address'],
    ['{ open: 7 * 60, close: 17 * 60 }', 'opening hours'],
  ]
  const bad = checks.filter(([needle]) => !src.includes(needle))
  if (bad.length) {
    console.error(
      `reynir-seo: these no longer match ${dataPath}: ${bad.map((b) => b[1]).join(', ')}.\n` +
        'Structured data would publish a fact the page contradicts. Update tools/reynir-seo.mjs.',
    )
    process.exit(1)
  }
  // every day must carry the same hours, or "opens 07:00 daily" is a lie
  const days = (src.match(/\{ open: 7 \* 60, close: 17 \* 60 \}/g) || []).length
  if (days !== 7) {
    console.error(`reynir-seo: expected 7 identical day entries in HOURS_BY_DAY, found ${days}.`)
    process.exit(1)
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

/* ── Pages ────────────────────────────────────────────────────────────────── */
const PAGES = [
  {
    dir: 'preview/reynir',
    path: '/',
    title: `Reynir bakarí — handverksbakarí í Kópavogi síðan 1994`,
    desc:
      'Handverksbakarí og kaffihús á Dalvegi 4 í Kópavogi. Súrdeigsbrauð, vínarbrauð, snúðar og tertur, allt bakað á staðnum frá grunni. Opið alla daga 07–17.',
    descEn:
      'A family craft bakery and café at Dalvegur 4 in Kópavogur. Sourdough, Danish pastries and cakes, all baked on-site from scratch. Open every day 07:00–17:00.',
    image: og('heim.jpg'),
    imageAlt: 'Bakari við steinofninn í Reyni bakara, brauð inni í ofninum',
  },
  {
    dir: 'preview/reynir/panta',
    path: '/panta',
    crumb: 'Sérpantanir',
    title: 'Panta tertu eða veislubakka — Reynir bakarí í Kópavogi',
    desc:
      'Pantaðu tertu, veislubakka eða bakkelsi hjá Reyni bakara á Dalvegi 4 í Kópavogi. Við staðfestum pöntunina símleiðis og greitt er þegar sótt er.',
    descEn:
      'Order a celebration cake, party platter or pastry tray from Reynir bakarí at Dalvegur 4 in Kópavogur. We confirm the order by phone and you pay on collection.',
    image: og('panta.jpg'),
    imageAlt: 'Rjómaterta frá Reyni bakara skreytt með rjómatoppum og kokteilberjum',
  },
  {
    dir: 'preview/reynir/personuvernd',
    path: '/personuvernd',
    title: 'Persónuvernd og skilmálar — Reynir bakarí',
    desc:
      'Hvaða upplýsingum Reynir bakarí safnar þegar þú sendir pöntunarbeiðni, af hverju, hversu lengi þær eru geymdar og hver réttindi þín eru. Ásamt skilmálum sérpantana.',
    descEn:
      'What Reynir bakarí collects when you send an order request, why, how long it is kept and what your rights are. Plus the terms for custom orders.',
    image: og('personuvernd.jpg'),
    imageAlt: 'Myndaveggurinn í búðinni hjá Reyni bakara á Dalvegi',
    crumb: 'Persónuvernd og skilmálar',
    noindexAlways: true,
  },
  {
    dir: 'preview/reynir/sagan',
    path: '/sagan',
    crumb: 'Sagan og myndasafnið',
    title: 'Sagan af Reyni bakara — fjölskyldubakarí í Kópavogi frá 1994',
    desc:
      'Fjölskyldubakarí á Dalvegi í Kópavogi síðan 1994. Sagan af Reyni bakara og myndasafn úr bakaríinu sjálfu, myndað á einum vinnumorgni í ágúst.',
    descEn:
      'A family bakery on Dalvegur in Kópavogur since 1994. The story of Reynir bakarí and a photographic archive from inside the bakery, shot across one working morning in August.',
    image: og('sagan.jpg'),
    imageAlt: 'Bakari stráir hveiti yfir vinnuborðið í Reyni bakara',
  },
]

/* ── standalone mode ──────────────────────────────────────────────────────
   REYNIR_STANDALONE=1: the dist is the client's own deployment (dist-reynir),
   where the pages live at the domain root — /, /panta, /sagan, /personuvernd —
   not under /preview/reynir. Same pages, same meta; only WHERE they live
   changes, so only page.dir does. */
const STANDALONE_DIST = process.env.REYNIR_STANDALONE === '1'
if (STANDALONE_DIST) {
  for (const p of PAGES) p.dir = p.path === '/' ? '' : p.path.slice(1)
}
/** URL for a page — page.dir may be '' (the root) in standalone mode. */
const urlFor = (p) => `${origin}${prefix}/${p.dir ? p.dir + '/' : ''}`

/* ── schema.org ───────────────────────────────────────────────────────────── */
const bakery = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  '@id': `${urlFor(PAGES[0])}#bakery`,
  name: B.name,
  legalName: B.legalName,
  vatID: B.vatID,
  url: urlFor(PAGES[0]),
  telephone: B.phone,
  email: B.email,
  foundingDate: B.founded,
  description:
    'Handverksbakarí sem framleiðir ferskt bakkelsi, brauð og kökur frá grunni. Einnig veisluþjónusta með kaffihlaðborði.',
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
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: B.opens,
      closes: B.closes,
    },
  ],
  sameAs: [B.facebook, B.instagram],
  areaServed: { '@type': 'City', name: 'Kópavogur' },
}

/** Real questions a person (or an assistant answering for them) actually asks.
 *  Every answer here is a fact stated on the page — FAQ schema that answers
 *  something the page does not say is the fastest way to a manual penalty. */
const faq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hvenær er opið hjá Reyni bakara?',
      acceptedAnswer: { '@type': 'Answer', text: 'Opið er alla daga frá klukkan 07:00 til 17:00, líka um helgar.' },
    },
    {
      '@type': 'Question',
      name: 'Hvar er Reynir bakarí?',
      acceptedAnswer: { '@type': 'Answer', text: `Reynir bakarí er á ${addr}. Bakaríið er eitt, á Dalvegi.` },
    },
    {
      '@type': 'Question',
      name: 'Er hægt að panta tertu hjá Reyni bakara?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Já. Hægt er að panta tertur, veislubakka og bakkelsi fyrirfram á vefnum eða í síma 564 4700. Við staðfestum pöntunina símleiðis og greitt er þegar sótt er.',
      },
    },
    {
      '@type': 'Question',
      name: 'Býður Reynir bakarí upp á veisluþjónustu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Já, Reynir bakarí býður veisluþjónustu með kaffihlaðborði, ásamt tertum og veislubökkum fyrir fundi og mannfagnaði.',
      },
    },
    {
      '@type': 'Question',
      name: 'Er hægt að fá brauðin send heim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Já, heimsending um höfuðborgarsvæðið er í boði í gegnum aha.is.',
      },
    },
  ],
}

/* Each page carries its own `crumb`. This was a two-way ternary — "/panta ?
 * 'Sérpantanir' : 'Persónuvernd og skilmálar'" — written when there were
 * three pages, and adding /sagan silently made it publish the story page to
 * Google as "Reynir bakarí › Persónuvernd og skilmálar". A breadcrumb that
 * contradicts the page is exactly the structured-data error Google acts on by
 * hand, so the name now comes from the page, and a new page without a crumb
 * fails the build rather than borrowing someone else's name. */
const breadcrumb = (page) => {
  if (page.path !== '/' && !page.crumb) {
    console.error(`reynir-seo: ${page.path} has no crumb — add one to PAGES.`)
    process.exit(1)
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Reynir bakarí', item: urlFor(PAGES[0]) },
      ...(page.path === '/'
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
  const ld = [bakery, breadcrumb(page)]
  if (page.path === '/') ld.push(faq)
  return `
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.desc)}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="${page.noindexAlways ? 'noindex, follow' : LIVE ? 'index, follow, max-image-preview:large' : 'noindex, nofollow'}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(B.name)}" />
    <meta property="og:locale" content="is_IS" />
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
      page.path === '/'
        ? `    <!-- The LCP element. It is the pistachio snúður floating in the hero,
         and without this hint the browser does not discover it until the
         React bundle has parsed and the component has mounted. fetchpriority
         is set here rather than on the <img>, because react-dom 18.3 does not
         know the property and would render it with a console warning; as a
         preload it is plain HTML that starts the fetch before any script
         runs. Home only — on /panta and /personuvernd this image never
         appears, and preloading it there would be 172 KB of waste. -->
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
  // an Icelandic page must say so, for screen readers and for search
  html = html.replace('<html lang="en">', '<html lang="is">')
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

## Facts
- Address: ${addr}, Iceland
- Opening hours: every day 07:00–17:00 (including weekends)
- Phone: ${B.phone}
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
  const urls = PAGES.filter((p) => !p.noindexAlways)
    .map(
      (p) => `  <url><loc>${urlFor(p)}</loc><changefreq>weekly</changefreq><priority>${p.path === '/' ? '1.0' : '0.8'}</priority></url>`,
    )
    .join('\n')
  writeFileSync(
    join(dir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
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
