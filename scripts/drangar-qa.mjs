/* Drangar QA — headless motion + visual gate.
   Run: node scripts/drangar-qa.mjs [--shots-only]
   The in-app pane freezes rAF; this is the only faithful check (ledger #42). */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const URL = process.env.DR_URL ?? 'http://localhost:5399/preview/drangar'
const OUT = 'scripts/drangar-shots'
fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/dr-qa-profile',
  args: ['--window-size=1440,900'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.evaluateOnNewDocument(() => {
  sessionStorage.setItem('dr_seen', '1') // skip preloader
})
await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2600))

const report = {}

/* fonts actually LOADED (ledger #94) */
report.fonts = await page.evaluate(() => ({
  sentient200: document.fonts.check('200 48px Sentient'),
  supreme400: document.fonts.check('400 16px Supreme'),
  azeret: document.fonts.check('400 12px "Azeret Mono"'),
  failed: [...document.fonts].filter((f) => f.status === 'error').map((f) => f.family),
}))

/* h1 accessibility (split-text hazard) */
report.h1 = await page.evaluate(() => {
  const h = document.querySelector('h1')
  return { ariaLabel: h?.getAttribute('aria-label'), text: h?.textContent?.trim().slice(0, 40) }
})

/* journey probe: wheel through, read track x + patina + visible panel */
const probe = async () => page.evaluate(() => {
  const track = document.querySelector('.dr-track')
  const t = track ? getComputedStyle(track).transform : 'none'
  const x = t.startsWith('matrix') ? parseFloat(t.split(',')[4]) : 0
  const patina = getComputedStyle(document.querySelector('.dr-root')).getPropertyValue('--dr-patina').trim()
  const acc = document.querySelector('.dr-acc-item')
  const accW = acc ? acc.getBoundingClientRect().width : 0
  const clipEl = document.querySelector('.dr-isl .dr-m-up')
  const clip = clipEl ? getComputedStyle(clipEl).clipPath : ''
  return { x: Math.round(x), patina, accW: Math.round(accW), islClip: clip.slice(0, 60), scrollY: Math.round(window.scrollY) }
})

report.samples = []
report.samples.push({ at: 'start', ...(await probe()) })
await page.screenshot({ path: `${OUT}/0-hero.png` })

const steps = [
  { n: 'statement', wheels: 4 },
  { n: 'accordion-1', wheels: 3 },
  { n: 'accordion-2', wheels: 3 },
  { n: 'shednote', wheels: 2 },
  { n: 'materials', wheels: 3 },
  { n: 'barn', wheels: 4 },
  { n: 'islands', wheels: 2 },
  { n: 'saga', wheels: 2 },
  { n: 'cierre', wheels: 2 },
  { n: 'footer', wheels: 8 },
]
for (const s of steps) {
  for (let i = 0; i < s.wheels; i++) {
    await page.mouse.wheel({ deltaY: 620 })
    await new Promise((r) => setTimeout(r, 40))
  }
  await new Promise((r) => setTimeout(r, 950)) // settle scrub:1
  report.samples.push({ at: s.n, ...(await probe()) })
  await page.screenshot({ path: `${OUT}/${s.n}.png` })
}

/* reversibility: scroll back into the journey, x must fall */
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 400))
for (let i = 0; i < 20; i++) { await page.mouse.wheel({ deltaY: 620 }); await new Promise((r) => setTimeout(r, 30)) }
await new Promise((r) => setTimeout(r, 900))
const mid1 = await probe()
for (let i = 0; i < 8; i++) { await page.mouse.wheel({ deltaY: -620 }); await new Promise((r) => setTimeout(r, 30)) }
await new Promise((r) => setTimeout(r, 900))
const mid2 = await probe()
report.reversible = { forward: mid1.x, back: mid2.x, ok: mid2.x > mid1.x }

/* fps over the accordion stretch */
await page.evaluate(() => { window.__f = []; let last = performance.now(); const loop = (t) => { window.__f.push(t - last); last = t; requestAnimationFrame(loop) }; requestAnimationFrame(loop) })
for (let i = 0; i < 60; i++) { await page.mouse.wheel({ deltaY: 240 }); await new Promise((r) => setTimeout(r, 16)) }
report.fps = await page.evaluate(() => {
  const f = window.__f.slice(5)
  const avg = 1000 / (f.reduce((a, b) => a + b, 0) / f.length)
  const sorted = [...f].sort((a, b) => a - b)
  return { avg: Math.round(avg * 10) / 10, p95: Math.round(sorted[Math.floor(f.length * 0.95)] * 10) / 10, worst: Math.round(Math.max(...f)), janky: Math.round((f.filter((x) => x > 20).length / f.length) * 1000) / 10 }
})

/* reduced-motion completeness: full page renders everything visible */
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
await page2.screenshot({ path: `${OUT}/reduced-full.png`, fullPage: true })

/* mobile viewport */
const page3 = await browser.newPage()
await page3.setViewport({ width: 390, height: 844 })
await page3.evaluateOnNewDocument(() => sessionStorage.setItem('dr_seen', '1'))
await page3.goto(URL, { waitUntil: 'domcontentloaded' })
await new Promise((r) => setTimeout(r, 2200))
report.mobile = await page3.evaluate(() => ({
  overflowX: document.documentElement.scrollWidth - window.innerWidth,
  burgerVisible: !!document.querySelector('.dr-burger') && getComputedStyle(document.querySelector('.dr-burger')).display !== 'none',
}))
await page3.screenshot({ path: `${OUT}/mobile-top.png` })
await page3.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45))
await new Promise((r) => setTimeout(r, 900))
await page3.screenshot({ path: `${OUT}/mobile-mid.png` })

console.log(JSON.stringify(report, null, 2))
await browser.close()
