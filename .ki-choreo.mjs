import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
await page.goto('http://localhost:5411/preview/katrinisfeld', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 4200))
const h = await page.evaluate(() => document.querySelector('.parallax').offsetHeight)
const pct = (v) => { const m = /inset\(([-\d.]+)%\s+[-\d.]+%\s+([-\d.]+)%/.exec(v); return m ? [+m[1], +m[2]] : v }
for (const f of [0.0, 0.45, 0.55, 0.62, 0.70, 0.78, 0.86, 0.93, 0.99]) {
  await page.evaluate((y) => window.scrollTo(0, Math.max(0, y)), Math.round(h * f - 900))
  await new Promise(r => setTimeout(r, 420))
  const o = await page.evaluate(() => {
    const g = (s) => [...document.querySelectorAll('.ki-plx-deep--strata ' + s)]
    const cp = (e) => getComputedStyle(e).clipPath
    return {
      words: g('[data-parallax-word]').map(e => Math.round(new DOMMatrix(getComputedStyle(e).transform).m42)),
      stag: g('[data-parallax-stagger]').map(e => cp(e)),
      drop: g('[data-parallax-drop]').map(e => cp(e)),
      tail: g('[data-parallax-tail]').map(e => cp(e)),
      rule: (() => { const e = document.querySelector('.ki-strata-datum'); return e ? +new DOMMatrix(getComputedStyle(e).transform).a.toFixed(2) : null })(),
    }
  })
  console.log(f.toFixed(2), 'rule', o.rule, 'words', JSON.stringify(o.words),
    '\n     stag', JSON.stringify(o.stag.map(pct)), '\n     drop', JSON.stringify(o.drop.map(pct)), '\n     tail', JSON.stringify(o.tail.map(pct)))
}
await br.close()
