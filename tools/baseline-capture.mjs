/**
 * T0 baseline capture — the "before" for every prospect and client site.
 *
 *   node tools/baseline-capture.mjs                 # every currentUrl in the catalogue
 *   node tools/baseline-capture.mjs reynir hyrox    # named slugs only
 *   node tools/baseline-capture.mjs --json          # machine-readable
 *
 * Everything here is SELF-GATHERED: one HTTP fetch per site, nothing asked of
 * an owner, no dashboard access. It is deliberately repeatable — anyone can
 * re-run it and get the same numbers, which is what makes the before/after
 * evidence rather than assertion.
 *
 * T0 IS UNREPEATABLE per site: once a domain moves to our build, the old site
 * is gone and these numbers cannot be recovered. Run it while they are up.
 *
 * The headline measurement is `textNoJs` — visible body text with scripts and
 * styles stripped. That is what GPTBot, PerplexityBot and ClaudeBot read,
 * because they do not run JavaScript. A JS-built site scoring near zero there
 * is invisible to AI assistants, and that single number carries most of the
 * argument for a rebuild.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const args = process.argv.slice(2)
const asJson = args.includes('--json')
const slugs = args.filter((a) => !a.startsWith('--'))

/* Read currentUrl straight out of each company record — no TS build needed,
   and it cannot drift from what the catalogue actually claims. */
import { globSync } from 'node:fs'
const files = globSync('src/preview/*/company.ts')
const targets = []
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  const slug = (src.match(/slug:\s*'([^']+)'/) || [])[1]
  const url = (src.match(/currentUrl:\s*'([^']+)'/) || [])[1]
  const name = (src.match(/name:\s*'([^']+)'/) || [])[1]
  const noOwn = /noOwnSite:\s*true/.test(src)
  if (slug && url && !noOwn) targets.push({ slug, name, url })
}
const list = slugs.length ? targets.filter((t) => slugs.includes(t.slug)) : targets
if (!list.length) {
  console.error('no targets matched'); process.exit(1)
}

const strip = (html) => {
  const body = html.includes('<body') ? html.slice(html.indexOf('<body')) : html
  return body
    .replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
const one = (h, re) => { const m = h.match(re); return m ? m[1].trim() : '' }

const rows = []
for (const t of list) {
  const started = Date.now()
  try {
    const res = await fetch(t.url, {
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; SNDR-baseline/1.0)' },
      signal: AbortSignal.timeout(25_000),
    })
    const html = await res.text()
    const ms = Date.now() - started
    const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
    const types = new Set()
    for (const m of ld) {
      try {
        const d = JSON.parse(m[1].trim())
        for (const x of (Array.isArray(d) ? d : [d])) if (x && x['@type']) types.add(String(x['@type']))
      } catch { /* malformed JSON-LD is itself a finding, just not a crash */ }
    }
    rows.push({
      slug: t.slug, name: t.name, url: t.url,
      status: res.status, finalUrl: res.url,
      bytes: html.length,
      textNoJs: strip(html).length,
      lang: one(html, /<html[^>]*\blang="([^"]*)"/i) || '(none)',
      title: one(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || '(none)',
      hasDescription: /<meta[^>]*name=["']description["']/i.test(html),
      hasOgImage: /<meta[^>]*property=["']og:image["']/i.test(html),
      jsonLd: [...types],
      h1: (html.match(/<h1[\s>]/gi) || []).length,
      scripts: (html.match(/<script[\s>]/gi) || []).length,
      ms,
    })
  } catch (e) {
    rows.push({ slug: t.slug, name: t.name, url: t.url, error: e.message.slice(0, 60) })
  }
}

if (asJson) {
  writeFileSync('baseline.json', JSON.stringify(rows, null, 1))
  console.log(`wrote baseline.json (${rows.length} sites)`)
} else {
  const pad = (s, n) => String(s ?? '').padEnd(n).slice(0, n)
  console.log(pad('slug', 20) + pad('textNoJs', 10) + pad('lang', 6) + pad('desc', 6) + pad('og', 4) + pad('h1', 4) + pad('schema', 26) + 'kB')
  console.log('-'.repeat(88))
  for (const r of rows.sort((a, b) => (a.textNoJs ?? 0) - (b.textNoJs ?? 0))) {
    if (r.error) { console.log(pad(r.slug, 20) + 'ERROR  ' + r.error); continue }
    console.log(
      pad(r.slug, 20) + pad(r.textNoJs, 10) + pad(r.lang, 6) +
      pad(r.hasDescription ? 'yes' : 'NO', 6) + pad(r.hasOgImage ? 'y' : 'N', 4) +
      pad(r.h1, 4) + pad(r.jsonLd.join(',') || '(none)', 26) + Math.round(r.bytes / 1024)
    )
  }
  const blank = rows.filter((r) => !r.error && r.textNoJs < 500).length
  console.log(`\n${rows.length} sites | ${blank} render under 500 chars without JS (effectively blank to AI crawlers)`)
}
