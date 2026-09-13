/* The i popover's motion, measured inside the page on every animation frame
   rather than screenshotted (a headless screenshot takes ~100ms, which is a
   third of the whole close). Prints clip top-inset %, card opacity and the
   first line's opacity against time for the open and the close. */
import puppeteer from 'puppeteer-core'
const [url] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 2600))
const sample = (phase) => p.evaluate((phase) => new Promise((done) => {
  const d = document.getElementById('ki-show-info'), first = d.firstElementChild, b = document.querySelector('.ki-show-i')
  const rows = []; const t0 = performance.now()
  b.click()
  const tick = () => {
    const t = performance.now() - t0, c = getComputedStyle(d)
    const m = /inset\(([\d.]+)%/.exec(c.clipPath); const top = m ? +m[1] : 0
    rows.push([Math.round(t), top.toFixed(0), (+c.opacity).toFixed(2), (+getComputedStyle(first).opacity).toFixed(2), c.visibility[0]])
    if (t < 1000) setTimeout(tick, 16); else done(rows)
  }
  setTimeout(tick, 16)
}), phase)
for (const phase of ['open', 'close']) {
  const rows = await sample(phase)
  const pick = rows.filter((r, i) => i % 3 === 0 && r[0] <= 900)
  console.log(`${phase}: ms  clipTop%  card  line1  vis`)
  for (const r of pick) console.log(`  ${String(r[0]).padStart(4)}  ${r[1].padStart(4)}  ${r[2]}  ${r[3]}  ${r[4]}`)
  await new Promise((r) => setTimeout(r, 400))
}
await br.close()
