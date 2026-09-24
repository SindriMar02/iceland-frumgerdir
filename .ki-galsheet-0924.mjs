// Full-page tile of one project's gallery, served from dist-katrin. usage: node .ki-galsheet-0924.mjs <route> <out.png> [width]
import http from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import puppeteer from 'puppeteer-core'
const [route, out, w = '1440'] = process.argv.slice(2)
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
await pg.setViewport({ width: +w, height: 900, deviceScaleFactor: 0.5 })
await pg.goto(`http://127.0.0.1:${srv.address().port}${route}`, { waitUntil: 'networkidle0' })
await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)) } })
await new Promise(r => setTimeout(r, 800))
const box = await pg.evaluate(() => { const g = document.querySelector('.ki-proj-gallery').getBoundingClientRect(); return { y: g.top + scrollY, h: g.height } })
await pg.screenshot({ path: out, clip: { x: 0, y: box.y, width: +w, height: box.h }, captureBeyondViewport: true })
await br.close(); srv.close()
