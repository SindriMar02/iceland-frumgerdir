import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-fin' })
const errs = []
// desktop: curtain then menu
const d = await b.newPage()
d.on('pageerror', e => errs.push('desktop: ' + e.message))
d.on('console', m => { if (m.type() === 'error') errs.push('desktop console: ' + m.text().slice(0,120)) })
await d.setCacheEnabled(false)
await d.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await d.goto('https://sindrimar02.github.io/austurey-preview/?f=' + Math.random(), { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 700))
await d.screenshot({ path: 'scripts/au-curtain.png' })
await new Promise(r => setTimeout(r, 6000))
await d.click('#burger'); await new Promise(r => setTimeout(r, 1500))
await d.screenshot({ path: 'scripts/au-menu-final.png' })
// mobile: curtain, menu opens, no slide, scroll restored
const m = await b.newPage()
m.on('pageerror', e => errs.push('mobile: ' + e.message))
m.on('console', e => { if (e.type() === 'error') errs.push('mobile console: ' + e.text().slice(0,120)) })
await m.setCacheEnabled(false)
await m.setViewport({ width: 440, height: 956, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await m.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
await m.goto('https://sindrimar02.github.io/austurey-preview/?f=' + Math.random(), { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 7000))
const mob = await m.evaluate(() => ({ curtainGone: !document.getElementById('arrival'), locked: document.documentElement.classList.contains('arrival-on'), scrollable: document.body.scrollHeight > innerHeight }))
await m.click('#burger'); await new Promise(r => setTimeout(r, 1200))
const mobMenu = await m.evaluate(() => {
  const l = document.querySelector('.menu_links').getBoundingClientRect()
  return { open: document.body.classList.contains('menu-open'), linksL: Math.round(l.left), linksW: Math.round(l.width), vw: innerWidth,
    linksVisible: getComputedStyle(document.querySelector('.menu')).opacity }
})
await m.screenshot({ path: 'scripts/au-menu-mobile.png' })
console.log(JSON.stringify({ mob, mobMenu, errors: errs }, null, 1))
await b.close()
