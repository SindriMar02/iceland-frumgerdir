import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
await page.goto('http://localhost:5411/preview/katrinisfeld', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 4200))
const h = await page.evaluate(() => document.querySelector('.parallax').offsetHeight)
await page.evaluate((y) => window.scrollTo(0, y), Math.round(h * 0.95 - 900))
await new Promise(r => setTimeout(r, 800))
console.log(JSON.stringify(await page.evaluate(() => {
  const d = document.querySelector('.ki-strata-datum')
  if (!d) return 'NO ELEMENT'
  const cs = getComputedStyle(d); const b = d.getBoundingClientRect()
  return { rect: [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)], t: cs.transform, bg: cs.backgroundColor, pos: cs.position, disp: cs.display, z: cs.zIndex }
})))
await br.close()
