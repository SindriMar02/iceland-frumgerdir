// Viewport shots of the 2026-09-22 walkthrough changes, served from dist-katrin
// by an in-process static server (no dev server). usage: node .ki-shots-0922.mjs <outdir>
import http from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import puppeteer from 'puppeteer-core'
const out = process.argv[2]
const root = 'dist-katrin'
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'text/xml', '.txt': 'text/plain' }
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); let f = join(root, p)
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html')
  if (!existsSync(f)) f = join(root, p + '.html')
  if (!existsSync(f)) { r.writeHead(404); return r.end() }
  r.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); r.end(readFileSync(f))
}).listen(0)
const base = `http://127.0.0.1:${srv.address().port}`
const shots = [
  ['home-hero', '/', null, 1440],
  ['home-litheim', '/', 'section[data-ki-band="light"] .ki-headline', 1440],
  ['home-italskar', '/', 'h2[aria-label="Ítalskar innréttingar"]', 1440],
  ['studio-top', '/studioid', null, 1440],
  ['studio-services', '/studioid', 'h2[aria-label="Hvað stúdíóið tekur að sér"]', 1440],
  ['studio-fhi', '/studioid', '.ki-split .ki-body', 1440],
  ['bad-hero', '/verkefni/badherbergi', null, 1440],
  ['bad-body', '/verkefni/badherbergi', '.ki-proj-cover', 1440],
  ['bad-gallery', '/verkefni/badherbergi', '.ki-proj-gallery', 1440],
  ['sulu-body', '/verkefni/nybyggt-hus-i-suluhofda', '.ki-proj-cover', 1440],
  ['contact-faq', '/hafa-samband', '.ki-answers', 1440],
  ['footer', '/', '.ki-footwm-word', 1440],
  ['m-home-hero', '/', null, 390],
  ['m-studio-services', '/studioid', 'h2[aria-label="Hvað stúdíóið tekur að sér"]', 390],
  ['m-bad-hero', '/verkefni/badherbergi', null, 390],
]
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const pg = await br.newPage()
await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
for (const [name, path, sel, w] of shots) {
  await pg.setViewport({ width: w, height: w < 500 ? 844 : 900, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 })
  await pg.goto(base + path, { waitUntil: 'networkidle0' })
  await pg.evaluate(() => document.fonts.ready)
  if (sel) {
    const ok = await pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; window.scrollTo({ top: e.getBoundingClientRect().top + scrollY - 140, behavior: 'instant' }); return true }, sel)
    if (!ok) console.log('MISSING', name, sel)
  }
  await new Promise((r) => setTimeout(r, 900))
  await pg.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 70 })
}
// facts worth asserting in text, not pixels
const facts = await pg.evaluate(async () => 0)
await pg.goto(base + '/', { waitUntil: 'networkidle0' })
console.log(JSON.stringify(await pg.evaluate(() => ({
  headlineFont: getComputedStyle(document.querySelector('.ki-headline')).fontFamily,
  footerFont: getComputedStyle(document.querySelector('.ki-footwm-word i') || document.body).fontFamily,
  alpinoLoaded: [...document.fonts].filter((f) => f.family.includes('Alpino')).map((f) => f.status),
  headsWithDot: [...document.querySelectorAll('.ki-headline')].map((h) => h.getAttribute('aria-label')).filter((t) => /\.$/.test(t)),
}))))
await br.close(); srv.close()
