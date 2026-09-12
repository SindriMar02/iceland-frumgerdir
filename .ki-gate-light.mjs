import puppeteer from 'puppeteer-core'
import { PNG } from 'pngjs'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
await page.goto('http://localhost:5411/preview/katrinisfeld', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 4200))
const g = await page.evaluate(() => { const s = document.querySelectorAll('.parallax')[1]; return { top: s.offsetTop, h: s.offsetHeight } })
const pct = v => { const m = /inset\(([-\d.]+)%/.exec(v); return m ? Math.round(+m[1]) : 0 }
for (let f = 0.5; f <= 1.001; f += 0.05) {
  await page.evaluate(y => window.scrollTo(0, y), Math.round(g.top + f * (g.h - 900)))
  await new Promise(r => setTimeout(r, 380))
  const png = PNG.sync.read(await page.screenshot())
  // lowest dark row in a column left of the copy: where the stone's edge is
  let stone = -1; for (let y = 899; y >= 0; y--) { const i = (y * 1440 + 120) * 4; if (png.data[i] + png.data[i+1] + png.data[i+2] < 330) { stone = y; break } }
  const o = await page.evaluate(() => {
    const d = document.querySelectorAll('[data-parallax-deep]')[1]
    const r = e => Math.round(e.getBoundingClientRect().top)
    return { h2: r(d.querySelector('h2')), body: r(d.querySelector('.ki-gate-body')), card: r(d.querySelector('.ki-worlds li')),
      words: [...d.querySelectorAll('[data-parallax-word]')].map(e => Math.round(new DOMMatrix(getComputedStyle(e).transform).m42)),
      stag: [...d.querySelectorAll('[data-parallax-stagger]')].map(e => getComputedStyle(e).clipPath) }
  })
  console.log(f.toFixed(2), 'stone edge y', stone, '| h2', o.h2, 'body', o.body, 'card', o.card, '| words', JSON.stringify(o.words), 'stag[rule,body,c1,c2,c3]', JSON.stringify(o.stag.map(pct)))
}
await br.close()
