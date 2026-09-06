import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-pick', args: ['--hide-scrollbars'] })
const errs = []
async function run(w, h, mobile, tag) {
  const p = await b.newPage()
  p.on('pageerror', e => errs.push(tag + ': ' + e.message))
  p.on('console', m => { if (m.type() === 'error') errs.push(tag + ' console: ' + m.text().slice(0,110)) })
  p.on('response', r => { if (r.status() >= 400) errs.push(`${r.status()} ${r.url().split('/').pop()}`) })
  await p.setCacheEnabled(false)
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile })
  if (mobile) await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
  await p.goto('https://sindrimar02.github.io/austurey-preview/?k=' + Math.random(), { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 8000))
  await p.evaluate(() => document.querySelector('#stays')?.scrollIntoView({ block: 'center' }))
  await new Promise(r => setTimeout(r, 1600))
  const before = await p.evaluate(() => ({
    rows: document.querySelectorAll('.pick_row').length,
    shots: document.querySelectorAll('.pick_shot').length,
    on: document.querySelector('.pick_row.is-on .pick_name')?.textContent,
    facts: document.getElementById('pickFacts')?.textContent.slice(0, 44),
    go: document.getElementById('pickGo')?.textContent,
    href: document.getElementById('pickGo')?.getAttribute('href'),
    revealed: document.querySelector('.pick').classList.contains('is-in'),
    rowOpacity: getComputedStyle(document.querySelector('.pick_row')).opacity,
    tap: Math.round(document.querySelector('.pick_row button').getBoundingClientRect().height),
    overflow: document.documentElement.scrollWidth - innerWidth,
  }))
  // choose cottage 5
  await p.evaluate(() => document.querySelectorAll('.pick_row button')[5]?.click())
  await new Promise(r => setTimeout(r, 1400))
  const after = await p.evaluate(() => ({
    on: document.querySelector('.pick_row.is-on .pick_name')?.textContent,
    shotOn: document.querySelector('.pick_shot.is-on')?.dataset.i,
    facts: document.getElementById('pickFacts')?.textContent.slice(0, 44),
    go: document.getElementById('pickGo')?.textContent,
    href: document.getElementById('pickGo')?.getAttribute('href')?.slice(-30),
    pressed: document.querySelectorAll('.pick_row button[aria-pressed="true"]').length,
  }))
  await p.screenshot({ path: `scripts/au-picker-${tag}.png` })
  await p.close(); return { before, after }
}
console.log(JSON.stringify({ desktop: await run(1440,900,false,'desktop'), mobile: await run(440,956,true,'mobile'), errors: errs }, null, 1))
await b.close()
