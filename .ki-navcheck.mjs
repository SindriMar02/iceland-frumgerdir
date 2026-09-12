/* the header over a light and a dark section, both widths: backing, links, focus */
import puppeteer from 'puppeteer-core'
const [url, out] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await br.newPage()
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 })
  await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 1500))
  for (const [name, sel] of [['light', '.ki-doors'], ['dark', '#verkefni .ki-grid']]) {
    const y = await p.$eval(sel, e => e.getBoundingClientRect().top + scrollY - 30)
    for (let s = 0; s <= y; s += 500) { await p.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), s); await new Promise(r => setTimeout(r, 90)) }
    await p.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), y); await new Promise(r => setTimeout(r, 900))
    const st = await p.evaluate(() => { const n = document.querySelector('.ki-nav'); const a = getComputedStyle(n, '::after'); const l = document.querySelector('.ki-nav-links')
      return { tone: n.dataset.kiTone, scrolled: n.dataset.kiScrolled, condensed: n.dataset.kiCondensed, backing: a.opacity + ' ' + a.backgroundColor, linksVis: getComputedStyle(l).visibility + '/' + getComputedStyle(l).opacity, burger: getComputedStyle(document.querySelector('.ki-burger')).display, burgerBox: (() => { const b = document.querySelector('.ki-burger').getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)] })() } })
    console.log(w, name, JSON.stringify(st))
    await p.screenshot({ path: `${out}-${w}-${name}.png`, clip: { x: 0, y: await p.evaluate(() => scrollY), width: w, height: 140 } })
  }
  await p.close()
}
await br.close()
