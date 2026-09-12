/* the home page's closing section with its form, and a dark→light boundary */
import puppeteer from 'puppeteer-core'
const [url, out] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 })
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 1200))
  const r = await p.$eval('#samband', e => { const b = e.getBoundingClientRect(); return { y: b.top + scrollY, h: b.height } })
  await p.screenshot({ path: `${out}-form-${w}.png`, clip: { x: 0, y: r.y, width: w, height: Math.min(r.h, 1700) }, captureBeyondViewport: true })
  const edge = await p.$eval('.ki-verk-sulu', e => { const b = e.getBoundingClientRect(); return b.bottom + scrollY })
  await p.screenshot({ path: `${out}-edge-${w}.png`, clip: { x: 0, y: edge - 160, width: w, height: 320 }, captureBeyondViewport: true })
  const f = await p.evaluate(() => ({ fields: document.querySelectorAll('#samband .ki-form input:not([type=hidden]):not(.ki-sr), #samband .ki-form textarea').length, submit: !!document.querySelector('#samband button.ki-fill[type=submit]'), fontSizes: [...document.querySelectorAll('#samband .ki-form input, #samband .ki-form textarea')].map(e => getComputedStyle(e).fontSize).filter((v, i, a) => a.indexOf(v) === i), fade: getComputedStyle(document.querySelector('.ki-verk-sulu')).backgroundImage }))
  console.log(w, JSON.stringify(f))
  await p.close()
}
await br.close()
