/* the caption name on a slide change, measured per ~16ms inside the page:
   translateY, opacity and blur of the arriving name; plus the rendered text */
import puppeteer from 'puppeteer-core'
const [url] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 })
  await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 2600))
  const rows = await p.evaluate(() => new Promise((done) => {
    const rows = []; const t0 = performance.now()
    document.querySelectorAll('.ki-show-dots button')[1].click()
    const tick = () => {
      const t = performance.now() - t0, el = document.querySelector('.ki-show-title-in'), c = getComputedStyle(el)
      const m = /matrix\([^)]*,\s*([-\d.]+)\)$/.exec(c.transform)
      rows.push([Math.round(t), m ? (+m[1]).toFixed(1) : '0', (+c.opacity).toFixed(2), c.filter, el.textContent])
      if (t < 1150) setTimeout(tick, 16); else done(rows)
    }
    setTimeout(tick, 0)
  }))
  console.log(`${w}: ms  ty(px)  op  filter  text`)
  for (const r of rows.filter((r, i) => i % 4 === 0)) console.log(`  ${String(r[0]).padStart(4)}  ${String(r[1]).padStart(5)}  ${r[2]}  ${r[3]}  ${r[4]}`)
  const clip = await p.evaluate(() => { const t = document.querySelector('.ki-show-title'), s = document.querySelector('.ki-show-title-in'); return { linkW: Math.round(t.getBoundingClientRect().width), spanW: Math.round(s.scrollWidth), clipped: s.scrollWidth > s.clientWidth } })
  console.log('  final', JSON.stringify(clip))
  await p.close()
}
await br.close()
