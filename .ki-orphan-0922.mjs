// Every route, 1440 + 390: any heading whose last visual line holds one word,
// and any headline still ending in a full stop. usage: node .ki-orphan-0922.mjs
import http from 'node:http'
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs'
import { join, extname, relative } from 'node:path'
import puppeteer from 'puppeteer-core'
const root = 'dist-katrin'
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' }
const srv = http.createServer((q, r) => {
  let f = join(root, decodeURIComponent(q.url.split('?')[0]))
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html')
  if (!existsSync(f)) { r.writeHead(404); return r.end() }
  r.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); r.end(readFileSync(f))
}).listen(0)
const routes = []
const walk = (d) => { for (const e of readdirSync(d)) { const p = join(d, e); if (statSync(p).isDirectory()) walk(p); else if (e === 'index.html') routes.push('/' + relative(root, d).replace(/\\/g, '/')) } }
walk(root)
const base = `http://127.0.0.1:${srv.address().port}`
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const pg = await br.newPage()
await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
const bad = []
for (const w of [1440, 390]) {
  await pg.setViewport({ width: w, height: 900, deviceScaleFactor: 1 })
  for (const r of routes) {
    await pg.goto(base + (r === '/.' ? '/' : r), { waitUntil: 'domcontentloaded' })
    await pg.evaluate(() => document.fonts.ready)
    const hits = await pg.evaluate(() => {
      const out = []
      for (const h of document.querySelectorAll('h1, h2, h3')) {
        const label = h.getAttribute('aria-label') || h.textContent.trim()
        if (!label || h.offsetParent === null) continue
        if (/\.$/.test(label) && h.classList.contains('ki-headline')) out.push(['DOT', label])
        // measure visual lines from the word spans, or from a Range when there are none
        const words = [...h.querySelectorAll('.ki-word')]
        let lines = []
        if (words.length) {
          for (const el of words) { const t = Math.round(el.getBoundingClientRect().top); (lines[t] ||= []).push(el.textContent) }
          lines = Object.values(lines)
        } else {
          const r = document.createRange(); r.selectNodeContents(h)
          const rects = [...r.getClientRects()]
          if (rects.length > 1) lines = rects.map(() => ['x'])
          const txt = label.split(' ')
          if (rects.length > 1 && txt.length > 1) {
            // approximate: last line width vs one word
            const last = rects[rects.length - 1]
            lines = rects.length > 1 && last.width < h.getBoundingClientRect().width * 0.22 ? [['a'], ['b']] : []
            if (lines.length) out.push(['ORPHAN?', label])
            continue
          }
        }
        if (lines.length > 1 && lines[lines.length - 1].length === 1) out.push(['ORPHAN', label])
      }
      return out
    })
    for (const [kind, label] of hits) bad.push(`${w} ${r.padEnd(42)} ${kind}  ${label}`)
  }
}
console.log(bad.length ? bad.join('\n') : 'clean: no orphaned last word, no headline full stop, at 1440 and 390')
console.log(`checked ${routes.length} routes × 2 widths`)
await br.close(); srv.close()
