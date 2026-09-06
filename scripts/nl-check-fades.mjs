import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-fadechk-' + Date.now() })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width: 1440, height: 900 })
await p.goto('https://sindrimar02.github.io/iceland-frumgerdir/preview/nollur/', { waitUntil: 'networkidle0', timeout: 45000 })
await new Promise(r => setTimeout(r, 2000))
const res = await p.evaluate(() => {
  const g = (sel, pseudo) => { const el = document.querySelector(sel); return el ? getComputedStyle(el, pseudo).backgroundImage : 'no-el' }
  return {
    islAfter: g('.nl-isl', '::after'),
    barnBefore: g('.nl-barn', '::before'),
    summerAfter: g('.nl-summer', '::after'),
    footerBefore: g('.nl-footer', '::before'),
    panelMargin: getComputedStyle(document.querySelector('.nl-panel')).marginRight,
  }
})
console.log(JSON.stringify(res, null, 1))
await b.close()
