import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
const t0 = Date.now()
await page.goto('http://localhost:8941/', { waitUntil: 'domcontentloaded' })
for (const at of [250, 700, 1400, 2400, 3600]) {
  const w = at - (Date.now() - t0); if (w > 0) await new Promise(r => setTimeout(r, w))
  const o = await page.evaluate(() => {
    const ls = [...document.querySelectorAll('[data-parallax-letter]')]
    const room = document.querySelector('.parallax__layer-img')
    const M = e => new DOMMatrix(getComputedStyle(e).transform)
    return {
      attr: document.documentElement.dataset.kiIntro || '-',
      x0: ls.length ? Math.round(M(ls[0]).m41) : null,
      xN: ls.length ? Math.round(M(ls[ls.length - 1]).m41) : null,
      y: ls.length ? Math.round(M(ls[0]).m42) : null,
      roomOp: room ? +(+getComputedStyle(room).opacity).toFixed(2) : null,
      roomScale: room ? +M(room).a.toFixed(3) : null,
      nameW: Math.round(document.querySelector('.ki-plx-name').getBoundingClientRect().width),
    }
  })
  console.log(String(at).padStart(4), JSON.stringify(o))
  await page.screenshot({ path: `/tmp/ki-open-${at}.png` })
}
await br.close()
