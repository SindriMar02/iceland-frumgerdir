import puppeteer from 'puppeteer-core'
import { PNG } from 'pngjs'
const A = process.argv[2], B = process.argv[3]
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const shot = async (url, y, w, h) => {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h })
  await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 4500))
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
  await p.evaluate((y) => window.scrollTo(0, y), y)
  await new Promise(r => setTimeout(r, 1400))
  const png = PNG.sync.read(await p.screenshot()); await p.close(); return png
}
for (const [w, h] of [[1440, 900], [390, 844]]) {
  for (const y of [0, 1200, 2600, 4200, 7000, 10500, 14000, 17500, 21000]) {
    const a = await shot(A, y, w, h), b = await shot(B, y, w, h)
    if (a.data.length !== b.data.length) { console.log(w, y, 'SIZE MISMATCH'); continue }
    let d = 0
    for (let i = 0; i < a.data.length; i += 4)
      if (Math.abs(a.data[i]-b.data[i]) + Math.abs(a.data[i+1]-b.data[i+1]) + Math.abs(a.data[i+2]-b.data[i+2]) > 30) d++
    const pct = (100 * d / (a.width * a.height)).toFixed(2)
    console.log(`${w}x${h}  y${String(y).padStart(6)}  differing px ${String(d).padStart(7)}  ${pct}%`)
  }
}
await br.close()
