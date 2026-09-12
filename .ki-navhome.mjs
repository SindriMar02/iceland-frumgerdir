import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 1440, height: 900 })
const reqs = []
p.on('request', r => { if (/\/assets\/.*\.js$/.test(r.url())) reqs.push(r.url().split('/').pop()) })
await p.goto(process.argv[2] + '/hafa-samband', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 2500))
console.log('on /hafa-samband, JS fetched:', reqs.join(' '))
const before = reqs.length
// click the wordmark home
await p.evaluate(() => document.querySelector('.ki-nav-mark').click())
await new Promise(r => setTimeout(r, 3500))
console.log('after clicking home, JS additionally fetched:', reqs.slice(before).join(' ') || 'none')
console.log(JSON.stringify(await p.evaluate(() => ({
  path: location.pathname,
  hero: !!document.querySelector('.parallax__header'),
  name: document.querySelector('.ki-plx-name')?.getAttribute('aria-label'),
  plates: document.querySelectorAll('[data-parallax-plate]').length,
}))))
await br.close()
