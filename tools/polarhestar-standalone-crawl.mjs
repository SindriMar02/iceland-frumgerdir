/**
 * Raw-HTML crawl of the Pólar Hestar standalone site: what a crawler that does
 * NOT run JavaScript gets from every URL (curl, no browser).
 *
 *   node tools/polarhestar-standalone-crawl.mjs http://127.0.0.1:8799 [--out report.json]
 *
 * The 24 Oct audit's baseline (_docs/polarhestar-seo-audit-2026-10-24/raw-html-crawl.json):
 * every URL was the same 15.6 KB shell, 17 words, title "Endurhannanir", no H1, no JSON-LD.
 * This script walks the sitemap of the site it is pointed at and checks, per page:
 * title, unique meta description, one H1, real text, self-referencing canonical, the full
 * hreflang set, og: and twitter: tags, JSON-LD that parses, and (site-wide) robots.txt,
 * sitemap.xml, llms.txt, the 301 for the removed tour and a real 404.
 * Exits 1 when anything fails, so it can gate a deploy.
 */
import { writeFileSync } from 'node:fs'

const base = (process.argv[2] || '').replace(/\/$/, '')
if (!base) {
  console.error('usage: node tools/polarhestar-standalone-crawl.mjs <base url> [--out report.json]')
  process.exit(2)
}
const outIdx = process.argv.indexOf('--out')
const out = outIdx > 0 ? process.argv[outIdx + 1] : null
const PROD = process.env.POLARHESTAR_SITE_URL || 'https://polarhestar.is'
const NOINDEX = process.env.POLARHESTAR_NOINDEX === '1'

const get = async (path, opts = {}) => {
  const res = await fetch(base + path, { redirect: 'manual', headers: { 'user-agent': 'GPTBot-like/1.0 (no javascript)' }, ...opts })
  return { status: res.status, location: res.headers.get('location'), text: await res.text(), headers: res.headers }
}

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const text = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/g, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim()
const tagAttr = (html, re, attr) => {
  const m = html.match(re)
  if (!m) return null
  const a = m[0].match(new RegExp(`${attr}="([^"]*)"`))
  return a ? decode(a[1]) : null
}
const metaName = (html, name) => tagAttr(html, new RegExp(`<meta[^>]+name="${name}"[^>]*>`), 'content')
const metaProp = (html, prop) => tagAttr(html, new RegExp(`<meta[^>]+property="${prop}"[^>]*>`), 'content')

const failures = []
const fail = (where, msg) => failures.push(`${where}: ${msg}`)

/* ── sitemap ───────────────────────────────────────────────────────────── */
const sm = await get('/sitemap.xml')
if (sm.status !== 200) {
  console.error(`sitemap.xml answered ${sm.status}`)
  process.exit(1)
}
const locs = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const paths = locs.map((u) => new URL(u).pathname)
if (new Set(paths).size !== paths.length) fail('sitemap.xml', 'duplicate <loc>')
for (const l of locs) if (!l.startsWith(PROD + '/')) fail('sitemap.xml', `${l} is not on ${PROD}`)
const xhtmlPerUrl = sm.text.split('<url>').slice(1).map((u) => (u.match(/xhtml:link/g) || []).length)
if (xhtmlPerUrl.some((n) => n !== 4)) fail('sitemap.xml', 'a <url> without the four hreflang links (is, en, de, x-default)')

/* ── pages ─────────────────────────────────────────────────────────────── */
const report = {}
const titles = new Map()
const descs = new Map()
const rows = []
for (const path of paths) {
  const r = await get(path)
  const html = r.text
  const body = html.slice(html.indexOf('<body'))
  const titleRaw = (html.match(/<title>([^<]*)<\/title>/) || [])[1]
  const title = titleRaw ? decode(titleRaw) : titleRaw
  const h1s = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]))
  const canonical = tagAttr(html, /<link[^>]+rel="canonical"[^>]*>/, 'href')
  const hreflangs = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/g)].map((m) => [m[1], m[2]])
  const lds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try { return JSON.parse(m[1]) } catch { return null }
  })
  const ldTypes = lds.map((o) => (o ? [].concat(o['@type']).join('+') : 'INVALID'))
  const words = text(body).split(' ').filter(Boolean).length
  const desc = metaName(html, 'description')
  const robots = metaName(html, 'robots') || ''
  const lang = (html.match(/<html lang="([^"]+)"/) || [])[1]
  const rec = {
    url: base + path, status: r.status, bytes: Buffer.byteLength(html), words, lang, title, tlen: title?.length ?? 0,
    description: desc, dlen: desc?.length ?? 0, h1: h1s, h2: (body.match(/<h2[\s>]/g) || []).length, canonical,
    hreflang: Object.fromEntries(hreflangs), robots, ldTypes,
    og: { title: metaProp(html, 'og:title'), description: metaProp(html, 'og:description'), image: metaProp(html, 'og:image'), url: metaProp(html, 'og:url'), type: metaProp(html, 'og:type'), locale: metaProp(html, 'og:locale') },
    twitterCard: metaName(html, 'twitter:card'),
    images: (body.match(/<img\b/g) || []).length, imagesNoAlt: (body.match(/<img\b(?![^>]*\balt=)/g) || []).length,
    tables: (body.match(/<table\b/g) || []).length, internalLinks: (body.match(/<a [^>]*href="\/[^"]*"/g) || []).length,
  }
  report[path] = rec

  const w = path
  if (r.status !== 200) fail(w, `status ${r.status}`)
  if (!title) fail(w, 'no <title>')
  if (title && titles.has(title)) fail(w, `same title as ${titles.get(title)}`)
  titles.set(title, w)
  if (title && title.length > 60) fail(w, `title is ${title.length} characters (limit 60): ${title}`)
  if (desc && desc.length > 160) fail(w, `description is ${desc.length} characters (limit 160)`)
  if (!desc) fail(w, 'no meta description')
  if (desc && descs.has(desc)) fail(w, `same description as ${descs.get(desc)}`)
  descs.set(desc, w)
  if (h1s.length !== 1 || !h1s[0]) fail(w, `${h1s.length} H1`)
  if (words < 150) fail(w, `only ${words} words in the raw HTML`)
  if (canonical !== PROD + path) fail(w, `canonical ${canonical} is not ${PROD + path}`)
  const want = ['is', 'en', 'de', 'x-default']
  for (const l of want) if (!rec.hreflang[l]) fail(w, `no hreflang ${l}`)
  if (!Object.values(rec.hreflang).includes(PROD + path)) fail(w, 'hreflang set does not include the page itself')
  if (NOINDEX ? !/noindex/.test(robots) : !/^index, follow/.test(robots)) fail(w, `robots meta "${robots}"`)
  for (const k of ['title', 'description', 'image', 'url']) if (!rec.og[k]) fail(w, `no og:${k}`)
  if (rec.og.url !== canonical) fail(w, 'og:url is not the canonical')
  if (rec.twitterCard !== 'summary_large_image') fail(w, 'no twitter:card')
  if (!ldTypes.length || ldTypes.includes('INVALID')) fail(w, `JSON-LD missing or invalid (${ldTypes.join(',')})`)
  if (/^(0|1)?$/.test(String(lang)) || !lang) fail(w, 'no <html lang>')
  const expectLang = path.startsWith('/en/') ? 'en' : path.startsWith('/de/') ? 'de' : 'is'
  if (lang !== expectLang) fail(w, `html lang ${lang}, expected ${expectLang}`)
  if (/Endurhannanir|frumger/i.test(html)) fail(w, 'catalogue boilerplate in the HTML')

  const kind = path.includes('/reidtur/') ? 'ride' : path.includes('/ferd/') ? 'tour' : path.includes('dagskra') ? 'schedule' : 'home'
  if (kind === 'home' && !ldTypes.some((t) => /TravelAgency|LocalBusiness/.test(t))) fail(w, 'home has no business entity')
  if (kind === 'home' && ldTypes.filter((t) => t === 'FAQPage').length !== 2) fail(w, 'home should carry two FAQPage blocks (short rides, long tours)')
  if (kind === 'home' && rec.tables < 1) fail(w, 'home has no comparison <table>')
  if (kind === 'tour' && !ldTypes.includes('TouristTrip')) fail(w, 'tour without TouristTrip')
  if (kind === 'tour' && !ldTypes.includes('Event')) fail(w, 'tour without departure Events')
  if (kind === 'ride' && !ldTypes.includes('TouristTrip')) fail(w, 'ride without TouristTrip')
  if (kind === 'schedule' && !ldTypes.includes('Event')) fail(w, 'schedule without departure Events')
  if (kind !== 'home' && !ldTypes.includes('BreadcrumbList')) fail(w, 'no BreadcrumbList')
  for (const o of lds.filter(Boolean)) {
    if (o['@type'] === 'BreadcrumbList') for (const it of o.itemListElement) if (!it.item.startsWith(PROD + '/')) fail(w, `breadcrumb item ${it.item} is not on ${PROD}`)
  }
  rows.push([path, r.status, `${(rec.bytes / 1024).toFixed(0)} KB`, words, `${rec.tlen}/${rec.dlen}`, h1s.length, ldTypes.join(' ')])
}

/* ── site-wide files and behaviours ────────────────────────────────────── */
const robotsTxt = await get('/robots.txt')
if (!NOINDEX) {
  for (const a of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
    if (!new RegExp(`User-agent: ${a}\\s+Allow: /`).test(robotsTxt.text)) fail('robots.txt', `${a} is not explicitly allowed`)
  }
  if (!robotsTxt.text.includes(`Sitemap: ${PROD}/sitemap.xml`)) fail('robots.txt', 'no Sitemap line')
  if (/Disallow:\s*\/\s*$/m.test(robotsTxt.text)) fail('robots.txt', 'Disallow: /')
}
const llms = await get('/llms.txt')
if (llms.status !== 200 || llms.text.length < 1500) fail('llms.txt', `status ${llms.status}, ${llms.text.length} chars`)
const gone = await get('/ferd/back-to-roots/')
if (![301, 404, 410].includes(gone.status)) fail('/ferd/back-to-roots/', `answers ${gone.status}, a soft 404`)
const nowhere = await get('/this-page-does-not-exist/')
if (nowhere.status !== 404) fail('unknown path', `answers ${nowhere.status}, not 404`)
const old = await get('/en/long-tours/ring-around-the-midnightsun')
if (old.status !== 301 || !/\/en\/ferd\/midnightsun\/$/.test(old.location || '')) fail('old URL map', `/en/long-tours/ring-around-the-midnightsun → ${old.status} ${old.location}`)

console.log(`\nRaw HTML, no JavaScript — ${base} (${paths.length} URLs)`)
console.log('path'.padEnd(40), 'st', 'size'.padStart(7), 'words'.padStart(6), 'title/desc', 'h1', 'JSON-LD')
for (const r of rows) console.log(String(r[0]).padEnd(40), r[1], String(r[2]).padStart(7), String(r[3]).padStart(6), String(r[4]).padStart(10), String(r[5]).padStart(2), r[6])
console.log(`\nrobots.txt ${robotsTxt.status}, sitemap.xml ${sm.status} (${paths.length} URLs), llms.txt ${llms.status} (${llms.text.length} chars)`)
console.log(`/ferd/back-to-roots/ → ${gone.status} ${gone.location ?? ''} · unknown path → ${nowhere.status} · old /en/long-tours/ring-around-the-midnightsun → ${old.status} ${old.location ?? ''}`)

if (out) writeFileSync(out, JSON.stringify({ base, checkedAt: new Date().toISOString(), pages: report, failures }, null, 2))
if (failures.length) {
  console.error(`\n${failures.length} FAILURE(S):`)
  for (const f of failures) console.error('  ' + f)
  process.exit(1)
}
console.log('\nALL CHECKS PASSED')
