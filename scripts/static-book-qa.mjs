import puppeteer from 'puppeteer-core'
const URL = process.argv[2], PREFIX = process.argv[3]
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/sbq' })
const errs = []
async function run(w, h, mobile, label) {
  const p = await b.newPage()
  p.on('pageerror', e => errs.push(label + ': ' + e.message))
  p.on('console', m => { if (m.type() === 'error') errs.push(label + ' console: ' + m.text().slice(0,120)) })
  await p.setCacheEnabled(false)
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile })
  if (mobile) await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
  await p.goto(URL, { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 4500))
  await p.evaluate(() => document.querySelector('#bk')?.scrollIntoView({ block: 'start' }))
  await new Promise(r => setTimeout(r, 800))
  const day = (n) => p.evaluate(({n,PREFIX}) => { const l=[...document.querySelectorAll('.'+PREFIX+'-day')].filter(d=>!d.disabled&&!d.classList.contains('is-out')); l[n]?.click() }, {n,PREFIX})
  const probe = () => p.evaluate((PREFIX) => {
    const q=s=>document.querySelector(s)
    const live=[...document.querySelectorAll('.'+PREFIX+'-day')].filter(d=>!d.disabled&&!d.classList.contains('is-out'))
    const c=live[0]?.getBoundingClientRect()
    return { exists: !!q('.'+PREFIX), months: [...document.querySelectorAll('.'+PREFIX+'-grid')].filter(g=>getComputedStyle(g).display!=='none').length,
      cell: c?+c.width.toFixed(1):null, overflowX: document.documentElement.scrollWidth - innerWidth,
      readIn: q('.'+PREFIX+'-cell-v')?.textContent.trim(), nights: q('.'+PREFIX+'-nights')?.textContent.trim(),
      note: q('.'+PREFIX+'-note')?.textContent.trim().slice(0,64),
      cta: q('#bkGo')?.textContent.trim(), houses: document.querySelectorAll('.bk__house, .bk_w').length,
      inputFont: q('.bk__field input') ? getComputedStyle(q('.bk__field input')).fontSize : null,
      arrowH: Math.round((q('.'+PREFIX+'-arrow')?.getBoundingClientRect().height||0)), nativeDate: !!q('input[type=date]') }
  }, PREFIX)
  const before = await probe()
  await day(3); await new Promise(r=>setTimeout(r,250)); await day(4); await new Promise(r=>setTimeout(r,300))
  const minStay = await p.evaluate((PREFIX) => document.querySelector('.'+PREFIX+'-note')?.textContent.trim().slice(0,58), PREFIX)
  await day(3); await new Promise(r=>setTimeout(r,250)); await day(7); await new Promise(r=>setTimeout(r,350))
  const after = await probe()
  const el = await p.$('#bk'); if (el) await el.screenshot({ path: `scripts/static-book-${label}.png` })
  await p.close(); return { before, minStay, after }
}
console.log(JSON.stringify({ mobile: await run(440,956,true,'m'), desktop: await run(1440,900,false,'d'), errors: errs }, null, 1))
await b.close()
