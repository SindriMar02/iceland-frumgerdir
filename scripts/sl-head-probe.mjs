import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/sl-head' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.evaluateOnNewDocument(() => sessionStorage.setItem('sl_seen','1'))
await p.goto('http://localhost:5299/preview/svartlodge', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 2000))
console.log(JSON.stringify(await p.evaluate(() => {
  const h = document.querySelector('.sl-stay-head'), m = document.querySelector('.sl-stay-months'), a = document.querySelector('.sl-stay-arrow')
  const cs = getComputedStyle(m)
  return { headW: h.getBoundingClientRect().width, monthsW: m.getBoundingClientRect().width, monthsH: m.getBoundingClientRect().height,
    scrollW: m.scrollWidth, arrowW: a.getBoundingClientRect().width, ws: cs.whiteSpace, fs: cs.fontSize, gap: getComputedStyle(h).gap, pad: getComputedStyle(h).padding }
}), null, 1))
await b.close()
