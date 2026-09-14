/* Signal extraction for the SEO/GEO/AEO audit, run against a built launch
   snapshot: every route's metadata, headings, schema graph, AEO answer
   shapes, entity signals and image alt coverage. Usage: node .ki-audit3.mjs <dist> */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
const D = process.argv[2]
const pages = []
const walk = (dir, base = '') => { for (const e of readdirSync(dir)) { const p = join(dir, e)
  if (statSync(p).isDirectory()) { if (!['assets', 'katrinisfeld', 'fonts'].includes(e)) walk(p, base + '/' + e); continue }
  if (e === 'index.html') pages.push({ route: base || '/', file: p }) } }
walk(D); if (existsSync(D + '/404.html')) pages.push({ route: '/404', file: D + '/404.html' })
const grab = (h, re) => { const m = re.exec(h); return m ? m[1].trim() : null }
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim()
const out = []
for (const { route, file } of pages) {
  const h = readFileSync(file, 'utf8')
  const body = h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, '')
  const main = (/<main[\s\S]*?<\/main>/.exec(body) || [body])[0]
  const text = strip(body), mainText = strip(main)
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]) } catch { return { _bad: true } } })
  const types = new Set(); let faqQ = 0, howToSteps = 0, sameAs = [], badLd = ld.filter((x) => x._bad).length, speakable = false, dates = []
  const collect = (n) => { if (!n || typeof n !== 'object') return; if (Array.isArray(n)) return n.forEach(collect)
    const t = n['@type']; if (t) (Array.isArray(t) ? t : [t]).forEach((x) => types.add(x))
    if (t === 'FAQPage' && Array.isArray(n.mainEntity)) faqQ += n.mainEntity.length
    if (t === 'HowTo' && Array.isArray(n.step)) howToSteps += n.step.length
    if (n.sameAs) sameAs = sameAs.concat(n.sameAs)
    if (n.speakable) speakable = true
    for (const k of ['datePublished', 'dateModified']) if (n[k]) dates.push(n[k])
    Object.values(n).forEach(collect) }
  ld.forEach(collect)
  const heads = [...main.matchAll(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => [m[1], strip(m[2])])
  // answer length right under a question heading: text until the next heading
  const qAnswers = [...main.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[1-3][\s>]|$)/g)]
    .map((m) => [strip(m[2]), strip(m[3]).split(' ').filter(Boolean).length]).filter(([q]) => /\?$/.test(q))
  const imgs = [...main.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])
  const ext = [...h.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]).filter((u) => !/katrinisfeld\.is/.test(u)).filter((v, i, a) => a.indexOf(v) === i)
  out.push({
    route, title: grab(h, /<title>([\s\S]*?)<\/title>/), desc: grab(h, /<meta name="description" content="([^"]*)"/),
    canonical: grab(h, /<link rel="canonical" href="([^"]*)"/), robots: grab(h, /<meta name="robots" content="([^"]*)"/),
    lang: grab(h, /<html lang="([^"]*)"/), viewport: /name="viewport"/.test(h),
    h1: heads.filter((x) => x[0] === 'h1').map((x) => x[1]), h2: heads.filter((x) => x[0] === 'h2').map((x) => x[1]), h3n: heads.filter((x) => x[0] === 'h3').length,
    words: text.split(' ').length, mainWords: mainText.split(' ').length,
    schema: [...types].sort(), badLd, faqQ, howToSteps, sameAs: [...new Set(sameAs)], speakable, dates: [...new Set(dates)],
    og: ['og:title', 'og:description', 'og:image', 'og:type', 'og:url', 'og:locale'].filter((k) => h.includes(`property="${k}"`)),
    ogImage: grab(h, /property="og:image" content="([^"]*)"/), twitter: /name="twitter:card"/.test(h),
    hreflang: [...h.matchAll(/hreflang="([^"]*)"/g)].map((m) => m[1]),
    imgs: imgs.length, imgsNoAlt: imgs.filter((t) => !/\balt="/.test(t)).length, imgsEmptyAlt: imgs.filter((t) => /\balt=""/.test(t)).length,
    internalLinks: [...main.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]).filter((v, i, a) => a.indexOf(v) === i).length,
    external: ext, qAnswers,
    nap: { phone: /663\s?3414/.test(text), street: /Katrínartún 4/.test(text), post: /105 Reykjavík/.test(text), email: /katrin@katrinisfeld\.is/.test(text) },
    definition: /Innanhússarkitekt er /.test(mainText),
    bytes: h.length,
  })
}
out.sort((a, b) => a.route.localeCompare(b.route))
console.log(JSON.stringify(out))
