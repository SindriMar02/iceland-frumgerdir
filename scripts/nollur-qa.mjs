/* Nollur QA: headless motion + visual gate, cloned from drangar-qa.mjs.
   Run: NL_URL=http://localhost:5299/preview/nollur node scripts/nollur-qa.mjs
   The in-app pane freezes rAF; headless Chrome is the only faithful check. */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const URL = process.env.NL_URL ?? 'http://localhost:5299/preview/nollur'
const OUT = 'scripts/nollur-shots'
fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/nl-qa-profile',
  args: ['--window-size=1440,900'],
})
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(`page: ${e.message}`))
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 160)}`) })
page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url().slice(-80)}`) })
await page.setViewport({ width: 1440, height: 900 })
await page.evaluateOnNewDocument(() => { sessionStorage.setItem('nl_seen', '1') })
await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2600))

const report = {}
report.fonts = await page.evaluate(() => ({
  redaction: document.fonts.check('400 48px "Redaction 35"'),
  redactionWorn: document.fonts.check('400 48px "Redaction 70"'),
  overused: document.fonts.check('400 16px "Overused Grotesk"'),
  commit: document.fonts.check('400 12px "Commit Mono"'),
  failed: [...document.fonts].filter((f) => f.status === 'error').map((f) => f.family),
}))
report.h1 = await page.evaluate(() => {
  const h = document.querySelector('h1')
  return { ariaLabel: h?.getAttribute('aria-label'), text: h?.textContent?.trim().slice(0, 40), lang: document.documentElement.lang, title: document.title }
})
report.hero = await page.evaluate(() => {
  const band = document.querySelector('.nl-hero-cut')
  const word = document.querySelector('.nl-hero-word')
  const r = band?.getBoundingClientRect(), w = word?.getBoundingClientRect()
  return { bandTop: Math.round(r?.top ?? -1), bandH: Math.round(r?.height ?? -1), wordTop: Math.round(w?.top ?? -1), wordBottom: Math.round(w?.bottom ?? -1), spots: document.querySelectorAll('.nl-spot').length }
})
report.broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src.slice(-50)))

const probe = async () => page.evaluate(() => {
  const track = document.querySelector('.nl-track')
  const t = track ? getComputedStyle(track).transform : 'none'
  const x = t.startsWith('matrix') ? parseFloat(t.split(',')[4]) : 0
  const acc = document.querySelector('.nl-acc-item')
  const accW = acc ? acc.getBoundingClientRect().width : 0
  return { x: Math.round(x), accW: Math.round(accW), scrollY: Math.round(window.scrollY) }
})
report.samples = [{ at: 'start', ...(await probe()) }]
await page.screenshot({ path: `${OUT}/0-hero.png` })
const steps = [
  { n: 'arrival', wheels: 2 }, { n: 'statement', wheels: 3 }, { n: 'quote', wheels: 3 },
  { n: 'accordion-1', wheels: 3 }, { n: 'accordion-2', wheels: 3 }, { n: 'accordion-3', wheels: 3 },
  { n: 'farmnote', wheels: 2 }, { n: 'materials', wheels: 3 }, { n: 'farm', wheels: 4 },
  { n: 'lights', wheels: 2 }, { n: 'story', wheels: 3 }, { n: 'grenivik', wheels: 2 }, { n: 'cierre', wheels: 2 }, { n: 'footer', wheels: 8 },
]
for (const s of steps) {
  for (let i = 0; i < s.wheels; i++) { await page.mouse.wheel({ deltaY: 620 }); await new Promise((r) => setTimeout(r, 40)) }
  await new Promise((r) => setTimeout(r, 950))
  report.samples.push({ at: s.n, ...(await probe()) })
  await page.screenshot({ path: `${OUT}/${s.n}.png` })
}
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 400))
for (let i = 0; i < 20; i++) { await page.mouse.wheel({ deltaY: 620 }); await new Promise((r) => setTimeout(r, 30)) }
await new Promise((r) => setTimeout(r, 900))
const mid1 = await probe()
for (let i = 0; i < 8; i++) { await page.mouse.wheel({ deltaY: -620 }); await new Promise((r) => setTimeout(r, 30)) }
await new Promise((r) => setTimeout(r, 900))
const mid2 = await probe()
report.reversible = { forward: mid1.x, back: mid2.x, ok: mid2.x > mid1.x }

await page.evaluate(() => { window.__f = []; let last = performance.now(); const loop = (t) => { window.__f.push(t - last); last = t; requestAnimationFrame(loop) }; requestAnimationFrame(loop) })
for (let i = 0; i < 60; i++) { await page.mouse.wheel({ deltaY: 240 }); await new Promise((r) => setTimeout(r, 16)) }
report.fps = await page.evaluate(() => {
  const f = window.__f.slice(5)
  const avg = 1000 / (f.reduce((a, b) => a + b, 0) / f.length)
  const sorted = [...f].sort((a, b) => a - b)
  return { avg: Math.round(avg * 10) / 10, p95: Math.round(sorted[Math.floor(f.length * 0.95)] * 10) / 10, worst: Math.round(Math.max(...f)) }
})

const page2 = await browser.newPage()
await page2.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await page2.setViewport({ width: 1440, height: 900 })
await page2.goto(URL, { waitUntil: 'domcontentloaded' })
await new Promise((r) => setTimeout(r, 2200))
report.reduced = await page2.evaluate(() => {
  const hidden = []
  document.querySelectorAll('h1,h2,h3,p,img').forEach((el) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    if ((parseFloat(cs.opacity) < 0.5 || cs.visibility === 'hidden') && r.width > 0) hidden.push(el.className?.toString().slice(0, 40) || el.tagName)
  })
  return { hiddenCount: hidden.length, sample: hidden.slice(0, 6), overflowX: document.documentElement.scrollWidth - window.innerWidth }
})

const page3 = await browser.newPage()
await page3.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page3.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
await page3.evaluateOnNewDocument(() => sessionStorage.setItem('nl_seen', '1'))
await page3.goto(URL, { waitUntil: 'domcontentloaded' })
await new Promise((r) => setTimeout(r, 2400))
report.mobile = await page3.evaluate(() => ({
  overflowX: document.documentElement.scrollWidth - window.innerWidth,
  burgerVisible: !!document.querySelector('.nl-burger') && getComputedStyle(document.querySelector('.nl-burger')).display !== 'none',
  heroH: Math.round(document.querySelector('.nl-hero')?.getBoundingClientRect().height ?? 0),
}))
await page3.screenshot({ path: `${OUT}/m-top.png` })
const H = await page3.evaluate(() => document.body.scrollHeight)
for (const [k, f] of [['m-houses', 0.28], ['m-materials', 0.5], ['m-farm', 0.62], ['m-story', 0.8], ['m-foot', 0.97]]) {
  await page3.evaluate((y) => window.scrollTo(0, y), Math.round(H * f))
  await new Promise((r) => setTimeout(r, 900))
  await page3.screenshot({ path: `${OUT}/${k}.png` })
}
report.errors = errors
console.log(JSON.stringify(report, null, 2))
await browser.close()
