import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/sl-book-' + Date.now() })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
await p.evaluateOnNewDocument(() => sessionStorage.setItem('sl_seen','1'))
await p.goto('https://sindrimar02.github.io/iceland-frumgerdir/preview/svartlodge/', { waitUntil: 'networkidle0', timeout: 45000 })
await new Promise(r => setTimeout(r, 2500))
await p.evaluate(() => document.querySelector('#boka')?.scrollIntoView())
await new Promise(r => setTimeout(r, 1200))
await p.screenshot({ path: 'scripts/svartlodge-shots/book-mobile-1.png' })
await p.evaluate(() => window.scrollBy(0, 700))
await new Promise(r => setTimeout(r, 800))
await p.screenshot({ path: 'scripts/svartlodge-shots/book-mobile-2.png' })
const info = await p.evaluate(() => ({
  overflowX: document.documentElement.scrollWidth - window.innerWidth,
  fields: [...document.querySelectorAll('.sl-field')].map(f => { const r = f.getBoundingClientRect(); return { label: f.textContent.trim().slice(0,18), w: Math.round(r.width), x: Math.round(r.left) } }),
}))
console.log(JSON.stringify(info, null, 1))
await b.close()
