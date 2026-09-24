// Every project gallery, desktop + phone: no photo cropped, every row level,
// nothing wider than the page, at 1920/1440/1024/768/390/320. usage: node .ki-galcheck-0924.mjs
import http from 'node:http'
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs'
import { join, extname } from 'node:path'
import puppeteer from 'puppeteer-core'
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' }
const srv = http.createServer((q, r) => {
  let f = join('dist-katrin', decodeURIComponent(q.url.split('?')[0]))
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html')
  if (!existsSync(f)) { r.writeHead(404); return r.end() }
  r.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' }); r.end(readFileSync(f))
}).listen(0)
const routes = readdirSync('dist-katrin/verkefni', { withFileTypes: true }).filter((d) => d.isDirectory() && existsSync(`dist-katrin/verkefni/${d.name}/index.html`)).map((d) => `/verkefni/${d.name}`)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const pg = await br.newPage()
await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
let bad = 0, tiles = 0, pages = 0
for (const w of [1920, 1440, 1024, 768, 390, 320]) {
  await pg.setViewport({ width: w, height: 900, deviceScaleFactor: 1 })
  for (const r of routes) {
    await pg.goto(`http://127.0.0.1:${srv.address().port}${r}`, { waitUntil: 'domcontentloaded' })
    const out = await pg.evaluate(() => {
      const g = document.querySelector('.ki-proj-gallery'); if (!g) return null
      const issues = []; let n = 0
      for (const row of g.querySelectorAll('.ki-gal-row')) {
        const hs = []
        for (const cell of row.querySelectorAll('.ki-gal-cell')) {
          const fig = cell.querySelector('figure').getBoundingClientRect(), img = cell.querySelector('img')
          const natural = img.width && img.getAttribute('width') / img.getAttribute('height')
          const shown = fig.width / fig.height
          n++
          if (Math.abs(shown - natural) / natural > 0.02) issues.push(`cropped ${img.alt.slice(0, 40)} ${shown.toFixed(2)} vs ${natural.toFixed(2)}`)
          if (fig.right > document.documentElement.clientWidth + 1) issues.push('overflows page')
          hs.push(fig.height)
        }
        if (getComputedStyle(row).flexDirection === 'row' && Math.max(...hs) - Math.min(...hs) > 2) issues.push(`row not level: ${hs.map((h) => h.toFixed(0)).join('/')}`)
      }
      return { n, issues }
    })
    if (!out) continue
    pages++; tiles += out.n
    for (const i of out.issues) { bad++; if (bad <= 15) console.log(`${w} ${r}: ${i}`) }
  }
}
console.log(`${pages} gallery views (27 pages × 6 widths), ${tiles} photos measured, ${bad} problems`)
await br.close(); srv.close()
