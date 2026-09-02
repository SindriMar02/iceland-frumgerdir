import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-dbg' })
const p = await b.newPage()
const errs = []
p.on('pageerror', e => errs.push('page: ' + e.message))
p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0,200)) })
p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url().slice(-50)) })
await p.setCacheEnabled(false)
await p.setViewport({ width: 440, height: 956, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.goto('https://sindrimar02.github.io/austurey-preview/?dbg=1', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 3000))
console.log(JSON.stringify(await p.evaluate(() => ({
  hasFn: typeof window.createStayPicker,
  mount: !!document.getElementById('bkCal'),
  mountHTML: (document.getElementById('bkCal')?.innerHTML || '').slice(0, 120),
  arrows: document.querySelectorAll('.au-stay-arrow').length,
  scripts: [...document.querySelectorAll('script[src]')].map(s => s.getAttribute('src')),
})), null, 1))
console.log('ERRORS', errs)
await b.close()
