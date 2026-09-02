import puppeteer from 'puppeteer-core'
const URL = process.env.NL ?? 'http://localhost:5299/preview/nollur'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-book' })
const errs = []
async function run(w, h, mobile, label) {
  const p = await b.newPage()
  p.on('pageerror', e => errs.push(label + ' page: ' + e.message))
  p.on('console', m => { if (m.type() === 'error') errs.push(label + ' console: ' + m.text().slice(0,120)) })
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile })
  if (mobile) await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
  await p.evaluateOnNewDocument(() => sessionStorage.setItem('nl_seen','1'))
  await p.goto(URL, { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 3200))
  await p.evaluate(() => document.querySelector('#book')?.scrollIntoView({ block: 'start' }))
  await new Promise(r => setTimeout(r, 900))
  const day = (n) => p.evaluate((n) => { const l=[...document.querySelectorAll('.nl-day')].filter(d=>!d.disabled&&!d.classList.contains('nl-day--out')); l[n]?.click() }, n)
  const probe = () => p.evaluate(() => {
    const q=s=>document.querySelector(s); const days=[...document.querySelectorAll('.nl-day:not(.nl-day--ghost)')]
    const live=days.filter(d=>!d.disabled); const c=live[0]?.getBoundingClientRect()
    return { exists: !!q('.nl-stay'), overflowX: document.documentElement.scrollWidth - window.innerWidth,
      months: [...document.querySelectorAll('.nl-stay-grid')].filter(g=>getComputedStyle(g).display!=='none').length,
      cell: c?+c.width.toFixed(1):null, houses: document.querySelectorAll('.nl-book-house').length,
      readIn: q('.nl-stay-cell-v')?.textContent.trim(), nights: q('.nl-stay-nights')?.textContent.trim(),
      cta: q('.nl-book-cta')?.textContent.trim(), note: q('.nl-stay-note')?.textContent.trim().slice(0,70),
      inputFont: getComputedStyle(q('.nl-book-field input')).fontSize,
      arrowH: Math.round(q('.nl-stay-arrow').getBoundingClientRect().height),
      nativeDate: !!q('input[type=date]') }
  })
  const before = await probe()
  await day(3); await new Promise(r=>setTimeout(r,260)); await day(4)
  await new Promise(r=>setTimeout(r,300))
  const minStay = await p.evaluate(() => document.querySelector('.nl-stay-note')?.textContent.trim().slice(0,60))
  await day(3); await new Promise(r=>setTimeout(r,260)); await day(7)
  await new Promise(r=>setTimeout(r,300))
  const after = await probe()
  await p.screenshot({ path: `scripts/nollur-shots/book-${label}.png` })
  await p.close()
  return { before, minStay, after }
}
const out = { mobile: await run(440, 956, true, 'm'), desktop: await run(1440, 900, false, 'd'), errors: errs }
console.log(JSON.stringify(out, null, 1))
await b.close()
