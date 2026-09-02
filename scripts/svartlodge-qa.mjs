/* Svart Lodge QA: headless motion + visual gate (vertical page, pinned hero).
   Run: SL_URL=http://localhost:5299/preview/svartlodge node scripts/svartlodge-qa.mjs */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
const URL = process.env.SL_URL ?? 'http://localhost:5299/preview/svartlodge'
const OUT = 'scripts/svartlodge-shots'
fs.mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/sl-qa-profile', args: ['--window-size=1440,900'] })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(`page: ${e.message}`))
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 160)}`) })
page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url().slice(-80)}`) })
await page.setViewport({ width: 1440, height: 900 })
await page.evaluateOnNewDocument(() => { sessionStorage.setItem('sl_seen', '1') })
await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2600))
const report = {}
report.fonts = await page.evaluate(() => ({ familjen: document.fonts.check('500 48px "Familjen Grotesk"'), failed: [...document.fonts].filter((f) => f.status === 'error').map((f) => f.family) }))
report.h1 = await page.evaluate(() => ({ ariaLabel: document.querySelector('h1')?.getAttribute('aria-label'), title: document.title }))
report.hero = await page.evaluate(() => { const p = document.querySelector('.sl-clip-scale'); const w = document.querySelector('.sl-wm-h'); return { clipTransform: p ? getComputedStyle(p).transform : 'none', wmSize: w ? getComputedStyle(w).fontSize : '', wmOpacity: w ? getComputedStyle(w.parentElement).opacity : '' } })
report.broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src.slice(-50)))
await page.screenshot({ path: `${OUT}/0-hero.png` })
const probe = () => page.evaluate(() => { const p = document.querySelector('.sl-clip-scale'); const t = p ? getComputedStyle(p).transform : ''; const s = t.startsWith('matrix') ? parseFloat(t.split('(')[1]) : 1; return { scrollY: Math.round(window.scrollY), clipScale: +s.toFixed(2) } })
report.samples = [{ at: 'start', ...(await probe()) }]
const steps = [['hero-mid', 3], ['hero-end', 3], ['manifesto', 3], ['view', 3], ['water', 3], ['corners', 3], ['around', 3], ['shore', 3], ['book', 4], ['foot', 4]]
for (const [n, k] of steps) {
  for (let i = 0; i < k; i++) { await page.mouse.wheel({ deltaY: 300 }); await new Promise((r) => setTimeout(r, 40)) }
  await new Promise((r) => setTimeout(r, 950))
  report.samples.push({ at: n, ...(await probe()) })
  await page.screenshot({ path: `${OUT}/${n}.png` })
}
report.overflowX = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
const page3 = await browser.newPage()
await page3.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page3.evaluateOnNewDocument(() => sessionStorage.setItem('sl_seen', '1'))
await page3.goto(URL, { waitUntil: 'domcontentloaded' })
await new Promise((r) => setTimeout(r, 2400))
report.mobile = await page3.evaluate(() => ({ overflowX: document.documentElement.scrollWidth - window.innerWidth }))
await page3.screenshot({ path: `${OUT}/m-top.png` })
const H = await page3.evaluate(() => document.body.scrollHeight)
for (const [k, f] of [['m-house', 0.2], ['m-water', 0.4], ['m-around', 0.6], ['m-book', 0.85]]) {
  await page3.evaluate((y) => window.scrollTo(0, y), Math.round(H * f))
  await new Promise((r) => setTimeout(r, 900))
  await page3.screenshot({ path: `${OUT}/${k}.png` })
}
report.errors = errors
console.log(JSON.stringify(report, null, 2))
await browser.close()
