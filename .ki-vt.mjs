import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 1440, height: 900 })
await p.goto(process.argv[2] + '/verkefni', { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 3500))
await p.evaluate(() => { window.__vt = 0; const o = document.startViewTransition?.bind(document)
  if (o) document.startViewTransition = (cb) => { window.__vt++; return o(cb) } })
const before = await p.evaluate(() => location.pathname)
await p.evaluate(() => { const a = [...document.querySelectorAll('a[href^="/verkefni/"]')].find(x => x.getAttribute('href').split('/').length > 2); a.click() })
await new Promise(r => setTimeout(r, 1400))
console.log(JSON.stringify(await p.evaluate(() => ({
  from: '/verkefni', to: location.pathname, viewTransitionsCalled: window.__vt,
  apiPresent: typeof document.startViewTransition === 'function', scrollY: Math.round(scrollY),
}))))
await br.close()
