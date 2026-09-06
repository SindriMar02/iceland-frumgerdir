import puppeteer from 'puppeteer-core'
import http from 'node:http'
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs'
import { join, extname } from 'node:path'
const ROOT = process.cwd() + '/dist-nypugardar', OUT = '/tmp/nyp-faq-shots'
mkdirSync(OUT, { recursive: true })
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.woff2': 'font/woff2' }
const server = http.createServer((q, s) => { let f = join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html'); if (!existsSync(f)) f = join(ROOT, 'index.html'); s.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }); s.end(readFileSync(f)) })
await new Promise((r) => server.listen(5715, r))
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox', '--force-color-profile=srgb'] })
for (const [name, url, vp] of [['en-desk', 'http://localhost:5715/rooms', { width: 1440, height: 900 }], ['is-desk', 'http://localhost:5715/is/herbergi', { width: 1440, height: 900 }], ['en-mob', 'http://localhost:5715/rooms', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
  const page = await browser.newPage(); await page.setViewport(vp)
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) } })
  await page.evaluate(() => { const el = document.querySelector('#questions'); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 8) })
  await new Promise((r) => setTimeout(r, 1600))
  const info = await page.evaluate(() => { const s = document.querySelector('#questions'); const r = s.getBoundingClientRect(); return { h: Math.round(r.height), qs: s.querySelectorAll('dt').length, overflow: document.documentElement.scrollWidth > innerWidth } })
  console.log(name, JSON.stringify(info))
  await page.screenshot({ path: `${OUT}/${name}.png` }); await page.close()
}
await browser.close(); server.close()
