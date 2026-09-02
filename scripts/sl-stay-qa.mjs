import puppeteer from 'puppeteer-core'
const URL = process.env.SL_URL ?? 'http://localhost:5299/preview/svartlodge'
const OUT = 'scripts/svartlodge-shots'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/sl-stay-qa' })
const errs = []
const rep = {}

async function open(w, h, mobile) {
  const p = await b.newPage()
  p.on('pageerror', e => errs.push('page: ' + e.message))
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)) })
  await p.setCacheEnabled(false)
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile })
  if (mobile) await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
  await p.evaluateOnNewDocument(() => sessionStorage.setItem('sl_seen', '1'))
  await p.goto(URL, { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 2200))
  await p.evaluate(() => document.querySelector('#boka')?.scrollIntoView({ block: 'start' }))
  await new Promise(r => setTimeout(r, 1000))
  return p
}

const probe = (p) => p.evaluate(() => {
  const q = s => document.querySelector(s)
  const r = e => { const x = e?.getBoundingClientRect(); return x ? { w: Math.round(x.width), h: Math.round(x.height) } : null }
  const days = [...document.querySelectorAll('.sl-day:not(.sl-day--ghost)')]
  const live = days.filter(d => !d.disabled)
  const cell = live[0]?.getBoundingClientRect()
  return {
    overflowX: document.documentElement.scrollWidth - window.innerWidth,
    stay: r(q('.sl-stay')),
    monthsShown: [...document.querySelectorAll('.sl-stay-grid')].filter(g => getComputedStyle(g).display !== 'none').length,
    dayCell: cell ? { w: +cell.width.toFixed(1), h: +cell.height.toFixed(1) } : null,
    dayCount: days.length,
    header: q('.sl-stay-months')?.textContent.trim(),
    checkin: q('.sl-stay-cell-v')?.textContent.trim(),
    nights: q('.sl-stay-nights')?.textContent.trim(),
    note: q('.sl-stay-note')?.textContent.trim().slice(0, 90),
    cta: q('.sl-cta')?.textContent.trim(),
    inputFont: getComputedStyle(q('.sl-field input')).fontSize,
    arrowH: r(q('.sl-stay-arrow'))?.h,
    stepH: r(q('.sl-stay-step button'))?.h,
    fieldsCols: getComputedStyle(q('.sl-fields')).gridTemplateColumns,
    nativeDate: !!q('input[type=date]'),
  }
})

// pick a range: click a live day then 4 later
const clickDay = (p, n) => p.evaluate((n) => {
  const live = [...document.querySelectorAll('.sl-day')].filter(d => !d.disabled && !d.classList.contains('sl-day--out'))
  live[n]?.click()
}, n)
const pickRange = async (p) => { await clickDay(p, 3); await new Promise(r => setTimeout(r, 260)); await clickDay(p, 7) }

const m = await open(390, 844, true)
rep.mobileEmpty = await probe(m)
await m.screenshot({ path: `${OUT}/stay-m-empty.png` })
await pickRange(m)
await new Promise(r => setTimeout(r, 500))
rep.mobilePicked = await probe(m)
await m.screenshot({ path: `${OUT}/stay-m-picked.png` })
await m.evaluate(() => window.scrollBy(0, 620))
await new Promise(r => setTimeout(r, 500))
await m.screenshot({ path: `${OUT}/stay-m-fields.png` })

const d = await open(1440, 900, false)
rep.desktop = await probe(d)
await pickRange(d)
await new Promise(r => setTimeout(r, 400))
await d.screenshot({ path: `${OUT}/stay-d.png` })
rep.desktopPicked = await probe(d)

const t = await open(760, 1000, false)
rep.tablet = await probe(t)
await t.screenshot({ path: `${OUT}/stay-t.png` })

rep.errors = errs
console.log(JSON.stringify(rep, null, 1))
await b.close()
