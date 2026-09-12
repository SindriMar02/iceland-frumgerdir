import puppeteer from 'puppeteer-core'
const URL = process.argv[2] || 'http://localhost:5411/preview/katrinisfeld'
const W = +(process.argv[3] || 1440), H = +(process.argv[4] || 900)
const tag = process.argv[5] || 'd'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 })
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
page.on('pageerror', e => console.log('PAGEERROR', e.message.slice(0, 160)))
await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 4200))
const hero = await page.evaluate(() => {
  const s = document.querySelector('.parallax')
  return s ? { top: s.offsetTop, h: s.offsetHeight } : null
})
console.log('hero', JSON.stringify(hero))
for (const f of [0.55, 0.70, 0.82, 0.95]) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(hero.top + hero.h * f - H))
  await new Promise(r => setTimeout(r, 700))
  await page.screenshot({ path: `/tmp/ki-str-${tag}-${Math.round(f * 100)}.png` })
}
const m = await page.evaluate(() => {
  const c = document.querySelector('.ki-strata-core'), d = document.querySelector('.ki-plx-deep--strata')
  const r = e => { if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)] }
  return { deep: r(d), core: r(c), figs: [...document.querySelectorAll('.ki-plx-deep--strata .ki-stratum-fig')].map(r), vh: innerHeight }
})
console.log(JSON.stringify(m))
await br.close()
