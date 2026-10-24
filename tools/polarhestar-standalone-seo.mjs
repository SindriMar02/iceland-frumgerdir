/**
 * Pólar Hestar standalone build: write each page's own <head>, and the files a
 * domain root needs (robots.txt, sitemap.xml, llms.txt).
 *
 * WHY AT BUILD TIME. Meta written by React on mount is fine for Google, which
 * renders JavaScript, and useless for the crawlers that matter most for a
 * riding farm: link previews in WhatsApp, Messenger and mail clients, and the
 * AI answer engines, which read raw HTML. So every route's title, description,
 * canonical, hreflang set, Open Graph card and structured data are written
 * into the file after the build.
 *
 * WHERE THE FACTS COME FROM. Not from this file. The SSR bundle exports PAGES
 * (src/preview/polarhestar/seo.ts, computed from the same CMS snapshot the
 * page bodies render) and the llms.txt text, so a price, a date or an answer
 * exists once. The only things written here are the file formats.
 *
 * INDEXING. The standalone dist is the production site: indexable, canonical
 * on https://polarhestar.is. POLARHESTAR_NOINDEX=1 builds a staging copy with
 * noindex and `Disallow: /`. (vite.polarhestar.config.ts reads the same two
 * variables, so the HTML and these files cannot disagree: this script checks.)
 *
 * Usage (from tools/polarhestar-standalone-post.mjs):
 *   node tools/polarhestar-standalone-seo.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = 'dist-polarhestar'
const SITE = (process.env.POLARHESTAR_SITE_URL || 'https://polarhestar.is').replace(/\/$/, '')
const NOINDEX = process.env.POLARHESTAR_NOINDEX === '1'

const serverEntry = resolve('dist-polarhestar-server/polarhestar-entry-server.js')
if (!existsSync(serverEntry)) {
  console.error('polarhestar-seo: dist-polarhestar-server/polarhestar-entry-server.js missing; run the SSR build first')
  process.exit(1)
}
const { PAGES, LLMS_TXT, HERO } = await import(pathToFileURL(serverEntry).href)

const fileFor = (path) => join(dist, path === '/' ? '' : path.replace(/^\/|\/$/g, ''), 'index.html')
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

/* ── 1. the head of every page ─────────────────────────────────────────── */
const seen = { title: new Map(), description: new Map() }
for (const p of PAGES) {
  for (const k of ['title', 'description']) {
    if (!p[k] || !p[k].trim()) {
      console.error(`polarhestar-seo: ${p.path} has an empty ${k}`)
      process.exit(1)
    }
    const clash = seen[k].get(p[k])
    if (clash) {
      console.error(`polarhestar-seo: ${p.path} and ${clash} have the same ${k}: "${p[k]}"`)
      process.exit(1)
    }
    seen[k].set(p[k], p.path)
  }

  const file = fileFor(p.path)
  if (!existsSync(file)) {
    console.error(`polarhestar-seo: ${file} missing; the prerender did not write ${p.path}`)
    process.exit(1)
  }
  let html = readFileSync(file, 'utf8')
  if (!/<html lang="[a-z-]*">/.test(html)) {
    console.error(`polarhestar-seo: ${file} has no <html lang=""> to set`)
    process.exit(1)
  }
  html = html.replace(/<html lang="[a-z-]*">/, `<html lang="${p.lang}">`)
  // the shell's placeholders give way to the route's own
  html = html
    .replace(/\s*<title>[^<]*<\/title>/, '')
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace(/\s*<meta name="robots"[^>]*>/, '')
  const hero =
    p.route.kind === 'home' && HERO?.src
      ? `\n    <link rel="preload" as="image" href="${attr(HERO.src)}" imagesrcset="${attr(HERO.srcSet)}" imagesizes="100vw" fetchpriority="high" />`
      : ''
  html = html.replace('</head>', `${p.headHtml}${hero}\n  </head>`)

  const robots = NOINDEX ? /<meta name="robots" content="noindex/ : /<meta name="robots" content="index, follow/
  if (!robots.test(html)) {
    console.error(
      `polarhestar-seo: ${p.path} robots meta does not match the build mode (${NOINDEX ? 'noindex' : 'indexable'}).\n` +
        '  The HTML is stamped from VITE_POLARHESTAR_NOINDEX; set POLARHESTAR_NOINDEX for the whole build, not just this step.',
    )
    process.exit(1)
  }
  if (!p.canonical.startsWith(`${SITE}/`)) {
    console.error(`polarhestar-seo: ${p.path} canonical ${p.canonical} is not on ${SITE}`)
    process.exit(1)
  }
  writeFileSync(file, html)
}
console.log(`polarhestar-seo: ${PAGES.length} pages stamped (${NOINDEX ? 'NOINDEX staging copy' : 'indexable'}, origin ${SITE})`)

/* ── 2. sitemap.xml: every page, with its language set ─────────────────── */
const urls = PAGES.map((p) => {
  const alt = p.alternates
    .map((a) => `\n    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
    .join('')
  return `  <url>\n    <loc>${p.canonical}</loc>${alt}\n  </url>`
}).join('\n')
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
)

/* ── 3. robots.txt ─────────────────────────────────────────────────────── */
/* The AI crawlers are named explicitly, and allowed on purpose. "User-agent: *"
 * already permits them, but several are blocked by default in hosting presets,
 * and a silent block is indistinguishable from not being found. For a riding
 * farm, being the answer when someone asks an assistant "horse riding near
 * Akureyri" is worth as much as a ranking. */
const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'Bingbot',
]
writeFileSync(
  join(dist, 'robots.txt'),
  NOINDEX
    ? `# Staging copy: the real robots.txt is generated by a build without POLARHESTAR_NOINDEX.\nUser-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\n\n${AI_AGENTS.map((a) => `User-agent: ${a}\nAllow: /\n`).join('\n')}\nSitemap: ${SITE}/sitemap.xml\n`,
)

/* ── 4. llms.txt ───────────────────────────────────────────────────────── */
writeFileSync(join(dist, 'llms.txt'), LLMS_TXT)

console.log('polarhestar-seo: sitemap.xml, robots.txt, llms.txt written')
