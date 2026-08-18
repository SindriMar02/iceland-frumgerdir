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
const { STUDIO, CV, ADDRESS_LINE, BRANDS, CATEGORIES, PROJECTS, PHOTOGRAPHED, FAQ, SERVICES, REDIRECTS } = D

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
    title: 'Ítalskar innréttingar · Arrital eldhús og Altamarea baðinnréttingar',
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
    clean: '/hafa-samband',
    title: `Hafa samband · ${STUDIO.street}, Reykjavík`,
    desc: `Katrín Ísfeld innanhússarkitekt, ${ADDRESS_LINE}. Sími ${STUDIO.phoneDisplay}. Opið alla daga ${STUDIO.opens}–${STUDIO.closes}. Sendu stutta verklýsingu og hún hefur samband.`,
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

/* Titles carry the brand once, at the end, and never twice. */
const BRAND = 'Katrín Ísfeld'
const fullTitle = (p) => (p.clean === '/' ? p.title : `${p.title} | ${BRAND}`)

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
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: STUDIO.opens,
    closes: STUDIO.closes,
  }],
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
    name: 'Félag húsgagna- og innanhússarkitekta (FHI)',
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
const faqNode = {
  '@type': 'FAQPage',
  '@id': `${urlFor('/studioid')}#faq`,
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
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
    creditText: STUDIO.name,
    representativeOfPage: ph === p.photos[0] || undefined,
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
  if (page.kind === 'studio') nodes.push(faqNode)
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

/* ── llms.txt ─────────────────────────────────────────────────────────────
   Plain facts for answer engines, in both languages, because the questions
   arrive in both. Kept to what the site itself states. */
function writeLlms() {
  const dir = join(dist, dirFor('/'))
  const cat = (c) => PROJECTS.filter((p) => p.category === c)
  const txt = `# ${STUDIO.name}

> Innanhússarkitekt í Reykjavík. Hannar innanhús frá grunni fyrir heimili,
> gistiheimili, hótel og atvinnuhúsnæði, og selur ítalskar innréttingar.
> An interior architect in Reykjavík, Iceland, designing homes, guesthouses,
> hotels and commercial interiors, and the Icelandic stockist for Arrital
> kitchens and Altamarea bathrooms.

## Facts
- Name: ${STUDIO.personName} (trades as ${STUDIO.name})
- Title: ${STUDIO.role} / interior architect
- Address: ${ADDRESS_LINE}, Iceland
- Phone: ${STUDIO.phone}
- Email: ${STUDIO.email}
- Opening hours: every day ${STUDIO.opens}–${STUDIO.closes}
- Own studio since ${STUDIO.founded}
- Member of FHI, Félag húsgagna- og innanhússarkitekta (the Icelandic association of furniture and interior architects)
- ${CV.degree} (BSc in interior architecture), ${CV.school}, Florida. Graduated with honours; second place in a US international design competition.
- Previously an interior architect at an architecture practice in Fort Lauderdale designing luxury villas, and at the practice of Margreed Van der Hooven in the Netherlands.
- Website: https://katrinisfeld.is · Instagram: ${STUDIO.instagram}

## Services
${SERVICES.map((s) => `- ${s.name}: ${s.desc}`).join('\n')}

## Italian cabinetry stocked
${BRANDS.map((b) => `- ${b.name} (${b.room.toLowerCase()}) — ${b.site}`).join('\n')}

## The record: ${PROJECTS.length} published projects in 4 categories
${['innanhusshonnun', 'gistiheimili-og-hotel', 'atvinnuhusnaedi', 'ymislegt']
  .map((c) => `### ${CATEGORIES[c].nav} (${cat(c).length})\n${cat(c).map((p) => `- ${p.title}${p.photos.length ? ` — ${urlFor(`/verkefni/${p.slug}`)}` : ''}`).join('\n')}`)
  .join('\n\n')}

## How to engage her
Send a short description of the space (netfang ${STUDIO.email}, or phone
${STUDIO.phoneDisplay}). She visits the site and assesses the project together
with the owners, then quotes for the work. No job is too large or too small.
Prices are not published because they depend on the scope of the work.

## Questions and answers
${FAQ.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}
`
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'llms.txt'), txt)
  return txt.length
}

function writeSitemap() {
  const dir = join(dist, dirFor('/'))
  const prio = (p) => (p.clean === '/' ? '1.0' : p.kind === 'project' ? '0.7' : '0.8')
  const urls = PAGES.map((p) =>
    `  <url>\n    <loc>${urlFor(p.clean)}</loc>\n    <changefreq>monthly</changefreq>\n` +
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
      ? `User-agent: *\nAllow: /\n\n# Answer engines are welcome; the facts they need are in /llms.txt\nSitemap: ${origin}/sitemap.xml\n`
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
     not a no-op, it is a redirect loop, and the host will serve it as one. Only
     paths that actually MOVED belong here; the trailing-slash form still does,
     because /studioid/ and /studioid are different URLs. */
  const moved = REDIRECTS.filter(([from, to]) => from !== to)
  const lines = moved.map(([from, to]) => `${from} ${to} 301`)
  const withSlash = REDIRECTS.map(([from, to]) => `${from}/ ${to} 301`)
  writeFileSync(
    join(dist, '_redirects'),
    `# Her old WordPress URLs, kept alive.\n${[...lines, ...withSlash].join('\n')}\n\n# SPA fallback, last.\n/* /index.html 200\n`,
  )
  return lines.length + withSlash.length
}

let bytes = 0
for (const p of PAGES) bytes += inject(p)
console.log(`katrin-seo: ${PAGES.length} pages injected (${LIVE ? 'indexable → ' + origin : 'noindex — no KATRIN_SITE_URL'})`)
console.log(`katrin-seo: llms.txt ${writeLlms()} bytes · sitemap.xml ${writeSitemap()} urls · ${writeRedirects()} redirects`)
