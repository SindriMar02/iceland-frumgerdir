import http from 'node:http'
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs'
import { join, extname } from 'node:path'
import puppeteer from 'puppeteer-core'
const ROOT = process.cwd() + '/dist-nypugardar'
const OUT = '/tmp/nyp-standalone-shots'
mkdirSync(OUT, { recursive: true })
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' }
const server = http.createServer((req, res) => {
  let f = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname))
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html')
  if (!existsSync(f)) f = join(ROOT, 'index.html')
  res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f))
})
await new Promise((r) => server.listen(5713, r))
const base = 'http://localhost:5713'
const routes = ['/', '/rooms', '/is/', '/is/herbergi']
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
console.log('== static HTML ==')
for (const r of routes) {
  const html = await (await fetch(base + r)).text()
  const g = (re) => (html.match(re) || [])[1] || ''
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1])['@type'] } catch { return 'INVALID' } })
  console.log(r, JSON.stringify({ lang: g(/<html lang="([a-z]+)">/), title: g(/<title>([^<]*)<\/title>/), hreflang: (html.match(/hreflang=/g) || []).length, ld, chars: strip(html).length, previewHrefs: (html.match(/href="\/preview\//g) || []).length, opacity0: (html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<div id="mobile-menu"[^>]*>/, '').match(/opacity:0/g) || []).length }))
}
console.log('== browser ==')
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
for (const [vpName, vp] of [['desk', { width: 1440, height: 900 }], ['mob', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
  for (const r of routes) {
    const page = await browser.newPage(); const msgs = []
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') msgs.push(m.type() + ': ' + m.text().slice(0, 120)) })
    page.on('pageerror', (e) => msgs.push('PAGEERR ' + String(e).slice(0, 120)))
    page.on('requestfailed', (q) => msgs.push('REQFAIL ' + q.url().slice(-50)))
    await page.setViewport(vp)
    await page.goto(base + r, { waitUntil: 'networkidle0', timeout: 60000 })
    await new Promise((x) => setTimeout(x, 1500))
    const info = await page.evaluate(async () => {
      const v = document.querySelector('video'); let video = null
      if (v) { await new Promise((x) => setTimeout(x, 2500)); video = { playing: !v.paused && v.currentTime > 0, opacity: getComputedStyle(v).opacity } }
      return { lang: document.documentElement.lang, docW: document.documentElement.scrollWidth, vw: innerWidth, rootChildren: document.getElementById('root').childElementCount, broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length, video }
    })
    console.log(vpName, r, JSON.stringify(info), 'msgs:', JSON.stringify(msgs.slice(0, 4)))
    await page.close()
  }
}
await browser.close(); server.close()
