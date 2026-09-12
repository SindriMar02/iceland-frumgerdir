import puppeteer from 'puppeteer-core'
import { PNG } from 'pngjs'
const [A, B] = [process.argv[2], process.argv[3]]
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const shot = async (url, y, w, h, dpr) => {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h, deviceScaleFactor: dpr })
  await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 4600))
  await p.evaluate(v => window.scrollTo(0, v), y); await new Promise(r => setTimeout(r, 1200))
  const png = PNG.sync.read(await p.screenshot()); await p.close(); return png
}
for (const [w, h, dpr] of [[1440, 900, 2], [390, 844, 3]]) {
  for (const y of [0, 700, 1400, 2100]) {
    const a = await shot(A, y, w, h, dpr), b = await shot(B, y, w, h, dpr)
    let d = 0, sum = 0
    for (let i = 0; i < a.data.length; i += 4) {
      const e = Math.abs(a.data[i]-b.data[i]) + Math.abs(a.data[i+1]-b.data[i+1]) + Math.abs(a.data[i+2]-b.data[i+2])
      sum += e; if (e > 30) d++
    }
    const px = a.width * a.height
    console.log(`${w}x${h}@${dpr}  y${String(y).padStart(4)}  >30 diff: ${String(d).padStart(7)} (${(100*d/px).toFixed(3)}%)  mean err ${(sum/px/3).toFixed(2)}/255`)
  }
}
await br.close()
