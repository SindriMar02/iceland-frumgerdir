/* the i popover, frame by frame: opening and closing, plus end states
   (visibility, inert, tabbable) — at a desktop and a phone size */
import puppeteer from 'puppeteer-core'
const [url, out] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const [w, h, clip] of [[1440, 900, { x: 0, y: 470, width: 520, height: 430 }], [390, 844, { x: 0, y: 420, width: 390, height: 424 }]]) {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 })
  await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 2600))
  const state = () => p.evaluate(() => { const d = document.getElementById('ki-show-info'); const c = getComputedStyle(d)
    return { vis: c.visibility, op: (+c.opacity).toFixed(2), clip: c.clipPath.slice(0, 22), inert: d.hasAttribute('inert'), ariaHidden: d.getAttribute('aria-hidden') } })
  console.log(w, 'closed', JSON.stringify(await state()))
  await p.click('.ki-show-i')
  const t0 = Date.now()
  for (const t of [60, 200, 380, 620, 1000]) { await new Promise(r => setTimeout(r, Math.max(0, t - (Date.now() - t0)))); await p.screenshot({ path: `${out}-${w}-open-${t}.png`, clip }) }
  console.log(w, 'open  ', JSON.stringify(await state()))
  await p.click('.ki-show-i')
  const t1 = Date.now()
  for (const t of [60, 200, 380, 700]) { await new Promise(r => setTimeout(r, Math.max(0, t - (Date.now() - t1)))); await p.screenshot({ path: `${out}-${w}-close-${t}.png`, clip }) }
  console.log(w, 'closed', JSON.stringify(await state()))
  await p.close()
}
await br.close()
