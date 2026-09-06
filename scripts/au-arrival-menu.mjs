import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-arr' })
const errs = []
const p = await b.newPage()
p.on('pageerror', e => errs.push('page: ' + e.message))
p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0,140)) })
await p.setCacheEnabled(false)
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await p.goto('https://sindrimar02.github.io/austurey-preview/?a=' + Math.random(), { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 500))
const early = await p.evaluate(() => { const a=document.getElementById('arrival'); return { present: !!a, lifted: a?a.classList.contains('is-up'):null, locked: document.documentElement.classList.contains('arrival-on') } })
await p.screenshot({ path: 'scripts/au-arrival.png' })
await new Promise(r => setTimeout(r, 6000))
const after = await p.evaluate(() => ({ present: !!document.getElementById('arrival'), locked: document.documentElement.classList.contains('arrival-on'), scrollable: document.body.scrollHeight > innerHeight }))
// now the menu
await p.click('#burger'); await new Promise(r => setTimeout(r, 1300))
const menu = await p.evaluate(() => {
  const r = s => { const e=document.querySelector(s); if(!e) return null; const b=e.getBoundingClientRect(); return {l:Math.round(b.left),r:Math.round(b.right)} }
  const cs = s => getComputedStyle(document.querySelector(s))
  return { logo: r('.nav_logo'), bookOpacity: cs('.nav_book').opacity, burgerBg: cs('.nav_burger').backgroundColor,
    linksLeft: r('.menu_links'), visualLeft: r('.menu_visual'),
    delays: [...document.querySelectorAll('.menu_links a')].map(a => getComputedStyle(a).transitionDelay.split(',')[0]) }
})
await p.screenshot({ path: 'scripts/au-menu-fixed.png' })
console.log(JSON.stringify({ early, after, menu, errors: errs }, null, 1))
await b.close()
