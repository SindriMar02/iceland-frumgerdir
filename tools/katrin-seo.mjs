/**
 * Katrín Ísfeld — static SEO and answer-engine head injection.
 *
 * WHY THIS EXISTS
 * The app is a React SPA. Meta written by React on mount is fine for Google,
 * which renders JavaScript, and useless for almost everything else that
 * matters here: Facebook and Messenger link previews, LinkedIn, and the AI
 * answer engines, most of which read raw HTML and stop. So the facts are
 * written into each file after the build, and tools/katrin-prerender.mjs puts
 * the rendered page in the body underneath them.
 *
 * NO SECOND SOURCE OF TRUTH
 * Everything below is imported from src/preview/katrinisfeld/seo-data.ts,
 * which re-exports the same facts.ts, projects.ts and content.ts the pages
 * render from. A wrong opening time in schema.org is worse than none, because
 * Google will show it in the business panel; the only reliable way to prevent
 * that is to make it impossible to state the fact twice.
 *
 * INDEXING IS A BUILD-TIME FLIP
 * Without KATRIN_SITE_URL the build stays noindex with no canonicals, so a
 * deploy to a preview host can never compete with katrinisfeld.is in the
 * index. On launch day:
 *
 *   KATRIN_SITE_URL=https://katrinisfeld.is npm run build:katrin
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { build } from 'esbuild'

const dist = process.argv[2] || 'dist-katrin'
const STANDALONE = process.env.KATRIN_STANDALONE === '1'
const basePath = (process.argv.find((a) => a.startsWith('--base=')) || '--base=/').slice(7)

const SITE = process.env.KATRIN_SITE_URL || ''
const LIVE = Boolean(SITE)
const origin = LIVE ? SITE.replace(/\/$/, '') : 'https://sindrimar02.github.io'
const prefix = LIVE ? '' : basePath.replace(/\/$/, '')

/* ── load the real data ───────────────────────────────────────────────── */
const tmp = join(process.cwd(), 'node_modules', '.katrin-seo-data.mjs')
await build({
  entryPoints: ['src/preview/katrinisfeld/seo-data.ts'],
  bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'silent',
  define: { 'import.meta.env.BASE_URL': '"/"', 'import.meta.env.VITE_KATRIN_STANDALONE': '"1"' },
})
const D = await import(tmp + '?t=' + process.hrtime.bigint())
const { STUDIO, CV, ADDRESS_LINE, BRANDS, CATEGORIES, PROJECTS, PHOTOGRAPHED, FAQ, FAQ_CONTACT, FAQ_BRANDS, FAQ_CATEGORY, SERVICES, PROCESS, PRESS, REDIRECTS } = D

/** Where a page lives, in both homes. */
const CAT_ORDER = ['innanhusshonnun', 'gistiheimili-og-hotel', 'atvinnuhusnaedi']
const dirFor = (clean) =>
  STANDALONE ? (clean === '/' ? '' : clean.slice(1)) : `preview/katrinisfeld${clean === '/' ? '' : clean}`
const urlFor = (clean) => `${origin}${prefix}/${dirFor(clean) ? dirFor(clean) + '/' : ''}`
const img = (p) => `${origin}${prefix}/katrinisfeld/${p}`
const photo = (id, w = 1500) => `${origin}${prefix}/katrinisfeld/rs/${id}-${w}.webp`

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
/** Google truncates around 155 chars; cut on a word, never mid-word. */
const clip = (s, n = 155) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,.;:]$/, '') + '…')

/* ── the pages ────────────────────────────────────────────────────────── */
const PAGES = [
  {
    clean: '/',
    title: 'Katrín Ísfeld innanhússarkitekt í Reykjavík',
    desc: `Innanhússarkitekt í Reykjavík sem hannar innanhús frá grunni: heimili, gistiheimili, hótel og atvinnurými. ${PROJECTS.length} verk í skránni. ${ADDRESS_LINE}.`,
    image: photo('s-eldhus-vitt'),
    kind: 'home',
  },
  {
    clean: '/verkefni',
    title: `Verkefni · ${PROJECTS.length} innanhússverkefni`,
    desc: `Verkefnaskrá Katrínar Ísfeld innanhússarkitekts: ${PROJECTS.length} verk í fjórum flokkum. Heimili og sumarhús, gistiheimili og hótel, skrifstofur og heilbrigðisrými.`,
    image: photo('p-skuggahverfi-0'),
    kind: 'work',
  },
  ...CAT_ORDER.map((c) => ({
    clean: `/verkefni/${c}`,
    title: CATEGORIES[c].title,
    desc: `${CATEGORIES[c].lead} ${CATEGORIES[c].body}`,
    image: photo(PROJECTS.filter((p) => p.category === c && p.photos.length)[0].photos[0].id),
    kind: 'category',
    cat: c,
  })),
  ...PHOTOGRAPHED.map((p) => ({
    clean: `/verkefni/${p.slug}`,
    title: `${p.title} · ${CATEGORIES[p.category].nav}`,
    desc: `${p.lead} ${p.body[0] || ''}`,
    image: photo(p.photos[0].id),
    kind: 'project',
    project: p,
  })),
  {
    clean: '/italskar-innrettingar',
    title: 'Arrital eldhús og Altamarea baðinnréttingar',
    desc: 'Arrital eldhúsinnréttingar og Altamarea baðinnréttingar fást hjá Katrín Ísfeld Hönnunar Studio í Reykjavík, teiknaðar inn í hvert rými af innanhússarkitekt.',
    image: photo('s-eyja'),
    kind: 'brands',
  },
  {
    clean: '/studioid',
    title: 'Stúdíóið · um Katrínu Ísfeld',
    desc: `Katrín Ísfeld er innanhússarkitekt með ${CV.degree} frá ${CV.school} og félagi í FHI. Áður á arkitektastofum í Hollandi og Fort Lauderdale.`,
    image: photo('f-stofa'),
    kind: 'studio',
  },
  {
    clean: '/fjolmidlar',
    title: 'Í fjölmiðlum · umfjöllun um Katrínu Ísfeld',
    desc:
      'Viðtöl og umfjöllun um Katrínu Ísfeld innanhússarkitekt í Morgunblaðinu og Hús og híbýli, ásamt myndum af verkefnum hennar eins og þau hafa birst á prenti.',
    image: photo('press-0'),
    kind: 'press',
  },
  {
    clean: '/hafa-samband',
    title: `Hafa samband · ${STUDIO.street}, Reykjavík`,
    desc: `Katrín Ísfeld innanhússarkitekt, ${ADDRESS_LINE}. Sími ${STUDIO.phoneDisplay}. Opnunartími ${STUDIO.opens}–${STUDIO.closes}. Sendu stutta verklýsingu og hún hefur samband.`,
    image: photo('s-eldhus-vitt'),
    kind: 'contact',
  },
  {
    clean: '/en',
    title: 'Interior architect in Reykjavík, Iceland',
    desc: D.EN.desc,
    image: photo('s-eyja'),
    kind: 'en',
    lang: 'en',
  },
]

/* Titles carry the brand once, at the end, and never twice — AND THEY FIT.
   Google truncates around 60 characters, and four of these ran to 65, 69, 75
   and 83, so the brand was being cut off the end of exactly the pages where a
   stranger most needs to see it. A title is built from segments now and the
   optional middle one (the category, on a project) is dropped when the whole
   would not fit. Nothing is truncated mid-word by us or by them. */
const BRAND = 'Katrín Ísfeld'
const MAX_TITLE = 60
const fullTitle = (p) => {
  if (p.clean === '/') return p.title
  const withAll = `${p.title} | ${BRAND}`
  if (withAll.length <= MAX_TITLE) return withAll
  /* drop the middle segment — "Old Charm Reykjavik Apartment · Gistiheimili
     og hótel" becomes "Old Charm Reykjavik Apartment" — before dropping the
     brand, because the brand is the part that earns the click */
  const short = p.title.includes(' · ') ? p.title.slice(0, p.title.lastIndexOf(' · ')) : p.title
  const trimmed = `${short} | ${BRAND}`
  return trimmed.length <= MAX_TITLE ? trimmed : short
}

/* ── schema.org: one connected graph, not a pile of loose blocks ───────── */
const STUDIO_ID = `${urlFor('/')}#studio`
const PERSON_ID = `${urlFor('/')}#katrin`
const SITE_ID = `${urlFor('/')}#website`

const studioNode = {
  '@type': ['ProfessionalService', 'LocalBusiness'],
  '@id': STUDIO_ID,
  name: STUDIO.name,
  alternateName: 'Katrín Ísfeld innanhússarkitekt',
  slogan: STUDIO.tagline,
  url: urlFor('/'),
  telephone: STUDIO.phone,
  email: STUDIO.email,
  foundingDate: STUDIO.founded,
  founder: { '@id': PERSON_ID },
  employee: { '@id': PERSON_ID },
  image: [photo('s-eldhus-vitt'), photo('s-eyja'), photo('f-stofa')],
  logo: img('brand/logo.png'),
  description:
    'Innanhússarkitekt í Reykjavík sem hannar innanhús frá grunni fyrir heimili, gistiheimili, hótel og atvinnuhúsnæði, og selur ítalskar innréttingar frá Arrital og Altamarea.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: STUDIO.street,
    postalCode: STUDIO.postalCode,
    addressLocality: STUDIO.city,
    addressCountry: STUDIO.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: STUDIO.lat, longitude: STUDIO.lon },
  /* Confirmed 2026-09-02: Monday–Friday. See facts.ts. */
  ...(STUDIO.openDays
    ? { openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: STUDIO.openDays, opens: STUDIO.opens, closes: STUDIO.closes,
      }] }
    : {}),
  currenciesAccepted: 'ISK',
  areaServed: [
    { '@type': 'City', name: 'Reykjavík' },
    { '@type': 'City', name: 'Kópavogur' },
    { '@type': 'City', name: 'Garðabær' },
    { '@type': 'Country', name: 'Ísland' },
  ],
  knowsAbout: [
    'Innanhússhönnun', 'Innanhússarkitektúr', 'Eldhúshönnun', 'Baðherbergishönnun',
    'Hönnun gistiheimila', 'Hótelhönnun', 'Hönnun atvinnuhúsnæðis', 'Efnisval', 'Litaval', 'Lýsingarhönnun',
  ],
  brand: BRANDS.map((b) => ({ '@type': 'Brand', name: b.name, url: b.site })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Þjónusta',
    itemListElement: SERVICES.map((s, i) => ({
      '@type': 'Offer',
      position: i + 1,
      itemOffered: { '@type': 'Service', name: s.name, description: s.desc, provider: { '@id': STUDIO_ID } },
    })),
  },
  sameAs: [STUDIO.instagram, STUDIO.facebook, STUDIO.linkedin, STUDIO.jaIs, 'https://katrinisfeld.is'],
}

const personNode = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: STUDIO.personName,
  alternateName: 'Katrín Ísfeld',
  jobTitle: STUDIO.role,
  worksFor: { '@id': STUDIO_ID },
  url: urlFor('/studioid'),
  nationality: { '@type': 'Country', name: 'Ísland' },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: CV.school,
    address: { '@type': 'PostalAddress', addressLocality: 'Fort Lauderdale', addressRegion: 'Florida', addressCountry: 'US' },
  },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'degree',
    educationalLevel: 'Bachelor of Science',
    name: CV.degree,
    recognizedBy: { '@type': 'CollegeOrUniversity', name: CV.school },
  },
  memberOf: {
    '@type': 'Organization',
    name: 'Félag húsgagna- og innanhússarkitekta',
    alternateName: 'FHI',
    url: STUDIO.fhi,
  },
  knowsLanguage: ['is', 'en'],
  knowsAbout: studioNode.knowsAbout,
  sameAs: [STUDIO.instagram, STUDIO.facebook, STUDIO.linkedin],
}

const websiteNode = {
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: urlFor('/'),
  name: STUDIO.name,
  inLanguage: 'is',
  publisher: { '@id': STUDIO_ID },
}

const crumbs = (page) => {
  const items = [{ name: 'Forsíða', clean: '/' }]
  if (page.clean.startsWith('/verkefni')) items.push({ name: 'Verkefni', clean: '/verkefni' })
  if (page.kind === 'project') items.push({ name: CATEGORIES[page.project.category].nav, clean: `/verkefni/${page.project.category}` })
  if (page.clean !== '/' && page.clean !== '/verkefni') items.push({ name: page.title.split(' · ')[0], clean: page.clean })
  return {
    '@type': 'BreadcrumbList',
    '@id': `${urlFor(page.clean)}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: urlFor(it.clean),
    })),
  }
}

/** Every answer here is a sentence the page itself makes. */
/* ── 1. FAQ, ON EVERY PAGE THAT ANSWERS SOMETHING ────────────────────────
   It lived on /studioid alone, which meant the pages where a buying question
   is actually asked — contact, the brands page, each category — carried the
   answers in prose and none of the markup. One builder now, used five times.
   The answers here are the exact strings rendered on the page; a FAQPage
   whose answer text is not visible on the page is a manual-action risk. */
const faqPage = (clean, items) => ({
  '@type': 'FAQPage',
  '@id': `${urlFor(clean)}#faq`,
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
})
const faqNode = faqPage('/studioid', FAQ)

/* ── 5. HER PROCESS, AS A HowTo ──────────────────────────────────────────
   The studio page already describes how a project runs, step by step, in
   prose. Marked up it becomes eligible for the step-by-step answer an
   assistant gives to "hvernig vinnur innanhússarkitekt". The steps are the
   ones already published, not invented for the markup. */
const howToNode = {
  '@type': 'HowTo',
  '@id': `${urlFor('/studioid')}#ferli`,
  name: 'Hvernig verkefni hjá innanhússarkitekt gengur fyrir sig',
  description: 'Ferlið frá fyrstu fyrirspurn að fullkláruðu rými hjá Katrín Ísfeld Hönnunar Studio.',
  inLanguage: 'is',
  totalTime: 'P8W',
  supply: [],
  tool: [],
  step: PROCESS.map((st, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: st.title,
    text: st.body,
    url: `${urlFor('/studioid')}#ferli-${i + 1}`,
  })),
}

const projectNode = (p) => ({
  '@type': 'CreativeWork',
  '@id': `${urlFor(`/verkefni/${p.slug}`)}#verk`,
  name: p.title,
  headline: p.title,
  description: p.lead,
  creator: { '@id': PERSON_ID },
  provider: { '@id': STUDIO_ID },
  about: CATEGORIES[p.category].title,
  inLanguage: 'is',
  image: p.photos.map((ph) => ({
    '@type': 'ImageObject',
    contentUrl: photo(ph.id),
    caption: ph.alt,
    /* THE PHOTOGRAPHER, MACHINE-READABLE. She credits Rakel Ósk
       Sigurðardóttir and Eggert Jóhannesson in the visible text; without
       creator the credit is a string nothing can resolve, and an engine
       asked who photographed a project has to guess. */
    creditText: p.credit ? `${p.credit} fyrir ${STUDIO.name}` : STUDIO.name,
    creator: p.credit ? { '@type': 'Person', name: p.credit } : { '@id': PERSON_ID },
    copyrightHolder: { '@id': STUDIO_ID },
    representativeOfPage: ph === p.photos[0] || undefined,
  })),
})

/* ── 2. THE PRESS PAGE ───────────────────────────────────────────────────
   Twelve headlines she has been given, published as text and, until now,
   invisible as authority: no Article markup, no publisher, nothing tying a
   clipping to the work it discusses. This is the strongest third-party
   signal on the site and it was the only one not expressed in the graph.
   Outlets appear ONLY where the clipping itself carries a masthead or a
   byline — the rest are CreativeWork with a headline and no invented
   publisher, because a wrong attribution is worse than a missing one. */
const pressNode = (page) => ({
  '@type': 'CollectionPage',
  '@id': `${urlFor('/fjolmidlar')}#press`,
  name: 'Í fjölmiðlum',
  about: { '@id': PERSON_ID },
  inLanguage: 'is',
  hasPart: PRESS.map((c) => ({
    '@type': c.outlet ? 'NewsArticle' : 'CreativeWork',
    headline: c.headline,
    name: c.headline,
    about: { '@id': PERSON_ID },
    mentions: { '@id': STUDIO_ID },
    inLanguage: 'is',
    ...(c.outlet ? { publisher: { '@type': 'NewsMediaOrganization', name: c.outlet } } : {}),
    ...(c.date ? { datePublished: c.isoDate } : {}),
    ...(c.byline ? { author: { '@type': 'Person', name: c.byline } } : {}),
    image: { '@type': 'ImageObject', contentUrl: photo(c.id), caption: c.alt },
  })),
})

const collectionNode = (page, list) => ({
  '@type': 'CollectionPage',
  '@id': `${urlFor(page.clean)}#collection`,
  name: page.title,
  isPartOf: { '@id': SITE_ID },
  about: { '@id': STUDIO_ID },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => ({
      '@type': 'ListItem', position: i + 1, name: p.title,
      url: p.photos.length ? urlFor(`/verkefni/${p.slug}`) : undefined,
    })),
  },
})

function graphFor(page) {
  const nodes = [studioNode, personNode, websiteNode, crumbs(page)]
  const webpage = {
    '@type': page.kind === 'contact' ? 'ContactPage' : page.kind === 'studio' ? 'AboutPage' : 'WebPage',
    '@id': `${urlFor(page.clean)}#webpage`,
    url: urlFor(page.clean),
    name: fullTitle(page),
    description: clip(page.desc),
    isPartOf: { '@id': SITE_ID },
    about: { '@id': STUDIO_ID },
    inLanguage: page.lang === 'en' ? 'en' : 'is',
    primaryImageOfPage: { '@type': 'ImageObject', contentUrl: page.image },
    breadcrumb: { '@id': `${urlFor(page.clean)}#breadcrumb` },
  }
  nodes.push(webpage)
  if (page.kind === 'studio') nodes.push(faqNode, howToNode)
  if (page.kind === 'contact') nodes.push(faqPage('/hafa-samband', FAQ_CONTACT))
  if (page.kind === 'brands') nodes.push(faqPage('/italskar-innrettingar', FAQ_BRANDS))
  if (page.kind === 'category' && FAQ_CATEGORY[page.cat]) nodes.push(faqPage(`/verkefni/${page.cat}`, [FAQ_CATEGORY[page.cat]]))
  if (page.kind === 'press') nodes.push(pressNode(page))
  if (page.kind === 'project') nodes.push(projectNode(page.project))
  if (page.kind === 'work') nodes.push(collectionNode(page, PROJECTS))
  if (page.kind === 'category') nodes.push(collectionNode(page, PROJECTS.filter((p) => p.category === page.cat)))
  return { '@context': 'https://schema.org', '@graph': nodes }
}

/* ── head ─────────────────────────────────────────────────────────────── */
function headFor(page) {
  const url = urlFor(page.clean)
  const desc = clip(page.desc)
  const isEn = page.lang === 'en'
  const alt = isEn ? urlFor('/') : urlFor('/en')
  return `
    <title>${esc(fullTitle(page))}</title>
    <meta name="description" content="${esc(desc)}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="${LIVE ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, nofollow'}" />
    <link rel="alternate" hreflang="${isEn ? 'en' : 'is'}" href="${url}" />
    <link rel="alternate" hreflang="${isEn ? 'is' : 'en'}" href="${alt}" />
    <link rel="alternate" hreflang="x-default" href="${urlFor('/')}" />
    <meta property="og:type" content="${page.kind === 'project' ? 'article' : 'website'}" />
    <meta property="og:site_name" content="${esc(STUDIO.name)}" />
    <meta property="og:locale" content="${isEn ? 'en_GB' : 'is_IS'}" />
    <meta property="og:locale:alternate" content="${isEn ? 'is_IS' : 'en_GB'}" />
    <meta property="og:title" content="${esc(fullTitle(page))}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${page.image}" />
    <meta property="og:image:width" content="1500" />
    <meta property="og:image:alt" content="${esc(STUDIO.name)}, ${esc(ADDRESS_LINE)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(fullTitle(page))}" />
    <meta name="twitter:description" content="${esc(desc)}" />
    <meta name="twitter:image" content="${page.image}" />
    <meta name="author" content="${esc(STUDIO.personName)}" />
    <meta name="geo.region" content="IS-1" />
    <meta name="geo.placename" content="${esc(STUDIO.city)}" />
    <meta name="geo.position" content="${STUDIO.lat};${STUDIO.lon}" />
    <meta name="ICBM" content="${STUDIO.lat}, ${STUDIO.lon}" />
    <link rel="icon" href="${prefix}/katrinisfeld/brand/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="${prefix}/katrinisfeld/brand/favicon-32.png" type="image/png" sizes="32x32" />
    <link rel="icon" href="${prefix}/katrinisfeld/brand/favicon-48.png" type="image/png" sizes="48x48" />
    <link rel="apple-touch-icon" href="${prefix}/katrinisfeld/brand/apple-touch-icon.png" />
    <meta name="theme-color" content="#1D1B19" />
    <script type="application/ld+json">${JSON.stringify(graphFor(page))}</script>
`
}

function inject(page) {
  const file = join(dist, dirFor(page.clean), 'index.html')
  if (!existsSync(file)) {
    console.error(`katrin-seo: ${file} missing — is the route in the prerender list?`)
    process.exit(1)
  }
  let html = readFileSync(file, 'utf8')
  html = html.replace(/<html[^>]*>/, `<html lang="${page.lang === 'en' ? 'en' : 'is'}">`)
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/g, '')
    .replace(/<meta name="robots"[^>]*>/g, '')
    .replace(/<link[^>]+rel="(?:icon|shortcut icon|apple-touch-icon|canonical)"[^>]*>/g, '')
    .replace(/<meta name="theme-color"[^>]*>/g, '')
  html = html.replace('</head>', `${headFor(page)}  </head>`)
  writeFileSync(file, html)
  return html.length
}

/* llms.txt is not shipped: no major engine has confirmed reading it and
   Google says it does not, so it was upkeep with no measured benefit. */

function writeSitemap() {
  const dir = join(dist, dirFor('/'))
  /* lastmod is the date of the last commit, i.e. when the content last changed */
  let lastmod
  try { lastmod = execFileSync('git', ['log', '-1', '--format=%cs']).toString().trim() } catch { lastmod = '' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) lastmod = new Date().toISOString().slice(0, 10)
  const prio = (p) => (p.clean === '/' ? '1.0' : p.kind === 'project' ? '0.7' : '0.8')
  const urls = PAGES.map((p) =>
    `  <url>\n    <loc>${urlFor(p.clean)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n` +
    `    <priority>${prio(p)}</priority>\n` +
    `    <image:image><image:loc>${p.image}</image:loc></image:image>\n  </url>`).join('\n')
  writeFileSync(
    join(dir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
      `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`,
  )
  writeFileSync(
    join(dir, 'robots.txt'),
    LIVE
      ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
      : `# Preview host. The real robots.txt is generated with KATRIN_SITE_URL set.\nUser-agent: *\nDisallow: /\n`,
  )
  return PAGES.length
}

/** 301s from every URL her WordPress site published. This is the single
 *  biggest risk in any redesign: her existing rankings and inbound links all
 *  point at the old paths, and without these they land on a 404 and the
 *  equity is gone. */
function writeRedirects() {
  if (!STANDALONE) return 0
  /* Several of her paths survive the redesign unchanged (/studioid,
     /hafa-samband, /verkefni). Emitting `/studioid /studioid 301` for those is
     not a no-op, it is a redirect loop, and the host will serve it as one.
     THE TRAILING-SLASH FORM IS THE SAME LOOP, and this file used to keep it on
     the reasoning that /studioid/ and /studioid are different URLs. They are —
     but which of the two is canonical is the HOST's decision, not ours, and
     Cloudflare Pages canonicalises a directory the other way: it 308s
     /studioid to /studioid/, our rule 301s it back, and the route is dead.
     Measured on the first deploy: /verkefni, /studioid, /hafa-samband and
     /italskar-innrettingar all bounced forever while every moved path was
     fine. GitHub Pages never showed it because it serves the no-slash form
     outright. So slash normalisation is left to the host in both directions,
     and only paths that actually MOVED are written here. */
  const moved = REDIRECTS.filter(([from, to]) => from !== to)
  const lines = moved.map(([from, to]) => `${from} ${to} 301`)
  const withSlash = moved.map(([from, to]) => `${from}/ ${to} 301`)
  /* and a rule that only adds or removes a slash is that loop by another
     name, whatever produced it */
  const loops = [...lines, ...withSlash].filter((l) => {
    const [from, to] = l.split(' ')
    return from.replace(/\/$/, '') === to.replace(/\/$/, '')
  })
  if (loops.length) throw new Error(`katrin-seo: redirect loops:\n${loops.join('\n')}`)
  writeFileSync(
    join(dist, '_redirects'),
    `# Her old WordPress URLs, kept alive.\n${[...lines, ...withSlash].join('\n')}\n\n# SPA fallback, last.\n/* /index.html 200\n`,
  )
  return lines.length + withSlash.length
}

let bytes = 0
for (const p of PAGES) bytes += inject(p)
console.log(`katrin-seo: ${PAGES.length} pages injected (${LIVE ? 'indexable → ' + origin : 'noindex — no KATRIN_SITE_URL'})`)
console.log(`katrin-seo: sitemap.xml ${writeSitemap()} urls · ${writeRedirects()} redirects`)
