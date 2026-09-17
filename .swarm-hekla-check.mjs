import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:8963/verkefni/hotel-hekla', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))
const imgs = await page.evaluate(() => Array.from(document.images).map(img => ({
  src: img.currentSrc.split('/').pop(), nw: img.naturalWidth, nh: img.naturalHeight, cw: img.clientWidth, ch: img.clientHeight,
  ratio: +(img.clientWidth / img.naturalWidth).toFixed(2)
})).filter(i => i.nw > 0))
console.log(JSON.stringify(imgs, null, 1))
await br.close()
