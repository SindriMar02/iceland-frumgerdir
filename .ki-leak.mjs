import puppeteer from 'puppeteer-core'
import { PNG } from 'pngjs'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const [W,H] of [[1440,900],[1200,854],[390,844]]) {
  const page = await br.newPage(); await page.setViewport({ width: W, height: H })
  await (await page.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
  await page.goto('http://localhost:5411/preview/katrinisfeld', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 4200))
  const h = await page.evaluate(() => document.querySelector('.parallax').offsetHeight)
  const out = []
  for (const f of [0, 0.3, 0.5, 0.62, 0.7]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(f * (h - H)))
    await new Promise(r => setTimeout(r, 500))
    const a = PNG.sync.read(await page.screenshot())
    await page.evaluate(() => { document.querySelector('[data-parallax-deep]').style.visibility = 'hidden' })
    const b = PNG.sync.read(await page.screenshot())
    await page.evaluate(() => { document.querySelector('[data-parallax-deep]').style.visibility = 'visible' })
    let diff = 0
    for (let i = 0; i < a.data.length; i += 4) if (Math.abs(a.data[i]-b.data[i]) + Math.abs(a.data[i+1]-b.data[i+1]) + Math.abs(a.data[i+2]-b.data[i+2]) > 24) diff++
    out.push(`${f}:${diff}px`)
  }
  console.log(W+'x'+H, 'deep-block pixels visible at scroll fractions', out.join('  '))
  await page.close()
}
await br.close()
