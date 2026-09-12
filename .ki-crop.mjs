import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const grab = async (url, out) => {
  const p = await br.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 })
  await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 4600))
  await p.evaluate(() => window.scrollTo(0, 0)); await new Promise(r => setTimeout(r, 1200))
  await p.screenshot({ path: out, clip: { x: 20, y: 655, width: 350, height: 150 } }); await p.close()
}
await grab(process.argv[2], '/tmp/ki-crop-full.png')
await grab(process.argv[3], '/tmp/ki-crop-80.png')
await br.close()
