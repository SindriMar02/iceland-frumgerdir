import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
const D = 'dist-katrin'
const pages = []
const walk = (dir, base = '') => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) { if (!['assets', 'katrinisfeld'].includes(e)) walk(p, base + '/' + e); continue }
    if (e === 'index.html') pages.push({ route: base || '/', file: p })
  }
}
walk(D)
if (existsSync(D + '/404.html')) pages.push({ route: '/404', file: D + '/404.html' })

const grab = (h, re) => { const m = re.exec(h); return m ? m[1].trim() : null }
const out = []
for (const { route, file } of pages) {
  const h = readFileSync(file, 'utf8')
  const text = h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
                .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim()
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => { try { return JSON.parse(m[1]) } catch { return null } })
  const types = new Set()
  const collect = (n) => { if (!n || typeof n !== 'object') return
    if (Array.isArray(n)) return n.forEach(collect)
    if (n['@type']) (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]).forEach(t => types.add(t))
    Object.values(n).forEach(collect) }
  ld.forEach(collect)
  const imgs = [...h.matchAll(/<img\b[^>]*>/g)].map(m => m[0])
  out.push({
    route,
    title: grab(h, /<title>([\s\S]*?)<\/title>/),
    desc: grab(h, /<meta name="description" content="([^"]*)"/),
    canonical: grab(h, /<link rel="canonical" href="([^"]*)"/),
    robots: grab(h, /<meta name="robots" content="([^"]*)"/),
    lang: grab(h, /<html lang="([^"]*)"/),
    h1: [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim()),
    h2: [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim()),
    h3: [...h.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim()),
    words: text.split(' ').length,
    schema: [...types].sort(),
    og: ['og:title', 'og:description', 'og:image', 'og:type', 'og:url', 'og:locale'].filter(k => h.includes(`property="${k}"`)),
    twitter: /name="twitter:card"/.test(h),
    hreflang: [...h.matchAll(/hreflang="([^"]*)"/g)].map(m => m[1]),
    imgs: imgs.length,
    imgsNoAlt: imgs.filter(t => !/\balt="/.test(t)).length,
    imgsEmptyAlt: imgs.filter(t => /\balt=""/.test(t)).length,
    internalLinks: [...h.matchAll(/href="(\/[^"#][^"]*)"/g)].map(m => m[1]).filter((v, i, a) => a.indexOf(v) === i).length,
    questionHeads: [...h.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(t => /\?$/.test(t) || /^(Hvað|Hver|Hvernig|Hvenær|Hvar|Af hverju|What|How|Who|When|Where|Why)\b/i.test(t)).length,
    bytes: h.length,
  })
}
out.sort((a, b) => a.route.localeCompare(b.route))
console.log(JSON.stringify(out, null, 0))
