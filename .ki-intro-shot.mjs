import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.goto('http://localhost:8791/', { waitUntil: 'domcontentloaded' })
const t0 = Date.now()
for (const at of [350, 700, 1200, 2000, 3000, 4000]) {
  const wait = at - (Date.now() - t0)
  if (wait > 0) await new Promise(r => setTimeout(r, wait))
  const info = await p.evaluate(() => {
    const l = document.querySelector('.ki-plx-l')
    const i = document.querySelector('[data-parallax-letter]')
    const lock = document.querySelector('.ki-plx-lockup')
    const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)] }
    const cs = l ? getComputedStyle(l) : null
    return {
      attr: document.documentElement.dataset.kiIntro || '-',
      mask: r(l), letter: r(i), lock: r(lock),
      maskOverflow: cs && cs.overflow, maskDisplay: cs && cs.display,
      letterT: i ? getComputedStyle(i).transform : null,
      titleT: document.querySelector('.parallax__layer-title') ? getComputedStyle(document.querySelector('.parallax__layer-title')).transform : null,
    }
  })
  console.log(at, JSON.stringify(info))
  await p.screenshot({ path: `/tmp/ki-intro-${at}.png` })
}
await b.close()
