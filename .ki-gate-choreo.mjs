import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
await page.goto('http://localhost:5411/preview/katrinisfeld', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 4200))
const g = await page.evaluate(() => { const s = document.querySelectorAll('.parallax')[1]; return { top: s.offsetTop, h: s.offsetHeight } })
const pct = v => { const m = /inset\(([-\d.]+)%/.exec(v); return m ? +m[1] : v === 'inset(0%)' ? 0 : v }
const rows = []
for (let f = 0; f <= 1.001; f += 0.1) {
  await page.evaluate(y => window.scrollTo(0, y), Math.round(g.top + f * (g.h - 900)))
  await new Promise(r => setTimeout(r, 380))
  rows.push(await page.evaluate(f => {
    const d = document.querySelectorAll('[data-parallax-deep]')[1]
    const w = [...d.querySelectorAll('[data-parallax-word]')].map(e => Math.round(new DOMMatrix(getComputedStyle(e).transform).m42))
    const st = [...d.querySelectorAll('[data-parallax-stagger]')].map(e => getComputedStyle(e).clipPath)
    const near = document.querySelectorAll('.parallax')[1].querySelectorAll('[data-parallax-plate]')
    return { f: f.toFixed(1), words: w, stag: st, anyVisibleTop: [...near].map(p => Math.round(p.getBoundingClientRect().top)) }
  }, f))
}
for (const r of rows) console.log(r.f, 'words', JSON.stringify(r.words), 'stag', JSON.stringify(r.stag.map(pct)))
console.log('scroll for gate copy px:', Math.round((g.h - 900) * 0.5), ' pin px:', g.h - 900)
await br.close()
