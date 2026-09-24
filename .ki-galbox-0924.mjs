// Box sizes of every gallery tile's figure/picture/img on one route. usage: node .ki-galbox-0924.mjs <route>
import http from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import puppeteer from 'puppeteer-core'
const route = process.argv[2]
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' }
const srv = http.createServer((q, r) => {
  let f = join('dist-katrin', decodeURIComponent(q.url.split('?')[0]))
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html')
  if (!existsSync(f)) { r.writeHead(404); return r.end() }
  r.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' }); r.end(readFileSync(f))
}).listen(0)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const pg = await br.newPage()
await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await pg.setViewport({ width: 1440, height: 900 })
await pg.goto(`http://127.0.0.1:${srv.address().port}${route}`, { waitUntil: 'networkidle0' })
await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } })
await new Promise(r => setTimeout(r, 600))
const rows = await pg.evaluate(() => [...document.querySelectorAll('.ki-proj-gallery > div')].map((d) => {
  const fig = d.querySelector('figure'), pic = d.querySelector('picture'), img = d.querySelector('img')
  const h = (e) => Math.round(e.getBoundingClientRect().height)
  const cs = getComputedStyle(img)
  return { id: img.currentSrc.split('/').pop().replace(/-\d+\.(avif|webp)$/, ''), fig: h(fig), pic: h(pic), img: h(img), gap: h(fig) - h(img), picDisplay: getComputedStyle(pic).display, imgH: cs.height, maxH: cs.maxHeight }
}))
for (const r of rows) if (Math.abs(r.gap) > 1) console.log('GAP', JSON.stringify(r))
console.log(rows.length, 'tiles,', rows.filter((r) => Math.abs(r.gap) > 1).length, 'with a gap')
await br.close(); srv.close()
