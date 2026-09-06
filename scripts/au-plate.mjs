import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-plate', args: ['--hide-scrollbars'] })
const errs = []
async function shot(w, h, mobile, name) {
  const p = await b.newPage()
  p.on('pageerror', e => errs.push(name + ': ' + e.message))
  p.on('console', m => { if (m.type() === 'error') errs.push(name + ' console: ' + m.text().slice(0,120)) })
  p.on('response', r => { if (r.status() >= 400) errs.push(`${r.status()} ${r.url().slice(-42)}`) })
  await p.setCacheEnabled(false)
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile })
  if (mobile) await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
  await p.goto('https://sindrimar02.github.io/austurey-preview/?p=' + Math.random(), { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 8500))
  await p.screenshot({ path: `scripts/au-plate-${name}.png` })
  // measure the mark against the painting it sits on
  const m = await p.evaluate(() => {
    const el = document.querySelector('.plate_word')
    if (!el) return { missing: true }
    const r = el.getBoundingClientRect()
    return { lit: document.querySelector('.plate').classList.contains('is-lit'),
      opacity: getComputedStyle(el).opacity, word: el.textContent.trim(),
      face: getComputedStyle(el).fontFamily.split(',')[0].replace(/['"]/g,''),
      spratLoaded: document.fonts.check('300 100px Sprat'),
      box: { t: Math.round(r.top), l: Math.round(r.left), w: Math.round(r.width) },
      vw: innerWidth, overflow: document.documentElement.scrollWidth - innerWidth }
  })
  await p.close(); return m
}
const d = await shot(1440, 900, false, 'desktop')
const mob = await shot(440, 956, true, 'mobile')
console.log(JSON.stringify({ desktop: d, mobile: mob, errors: errs }, null, 1))
await b.close()
