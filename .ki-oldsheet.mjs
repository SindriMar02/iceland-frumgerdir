import puppeteer from 'puppeteer-core'
const [url, out, click] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const pg = await br.newPage()
await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 0.5 })
await pg.goto(url, { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 800))
if (click) { await pg.evaluate((sel) => { document.querySelector(sel).click() }, click); await new Promise(r => setTimeout(r, 2500)) }
// walk the page so lazy/reveals fire
const H = await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) } window.scrollTo(0,0); await new Promise(r => setTimeout(r, 400)); return document.body.scrollHeight })
console.log('height', H)
const step = 3600
for (let i = 0, y = 0; y < H; y += step, i++) {
  await pg.screenshot({ path: `${out}-${i}.png`, clip: { x: 0, y, width: 1440, height: Math.min(step, H - y) }, captureBeyondViewport: true })
}
await br.close()
