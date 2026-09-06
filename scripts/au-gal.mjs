import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-gal', args: ['--hide-scrollbars'] })
const errs = []
async function run(w, h, mobile, tag) {
  const p = await b.newPage()
  p.on('pageerror', e => errs.push(tag + ': ' + e.message))
  p.on('console', m => { if (m.type() === 'error') errs.push(tag + ' console: ' + m.text().slice(0,110)) })
  p.on('response', r => { if (r.status() >= 400) errs.push(`${r.status()} ${r.url().split('/').pop()}`) })
  await p.setCacheEnabled(false)
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile })
  if (mobile) await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
  await p.goto('https://sindrimar02.github.io/austurey-preview/?g=' + Math.random(), { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 8500))
  await p.evaluate(() => document.querySelector('#stays')?.scrollIntoView({ block: 'start' }))
  await new Promise(r => setTimeout(r, 1800))
  const grid = await p.evaluate(() => ({
    cards: document.querySelectorAll('.gcard').length,
    revealed: document.querySelector('.gal').classList.contains('is-in'),
    cardOpacity: getComputedStyle(document.querySelector('.gcard')).opacity,
    cols: getComputedStyle(document.querySelector('.gal_grid')).gridTemplateColumns.split(' ').length,
    imgsLoaded: [...document.querySelectorAll('.gcard_shot img')].filter(i => i.complete && i.naturalWidth > 0).length,
    imgSrc: document.querySelector('.gcard_shot img')?.currentSrc.split('/').pop(),
    tap: Math.round(document.querySelector('.gcard_go').getBoundingClientRect().height),
    overflow: document.documentElement.scrollWidth - innerWidth,
  }))
  await p.screenshot({ path: `scripts/au-gal-${tag}.png` })
  // open the lightbox on card 5 (the aurora)
  await p.evaluate(() => document.querySelectorAll('.gcard_shot')[5]?.click())
  await new Promise(r => setTimeout(r, 1200))
  const lb1 = await p.evaluate(() => ({ open: !document.getElementById('lbox').hidden,
    cap: document.querySelector('.lbox_cap')?.textContent, src: document.querySelector('.lbox_img')?.currentSrc.split('/').pop(),
    locked: document.documentElement.classList.contains('lbox-on') }))
  await p.keyboard.press('ArrowRight'); await new Promise(r => setTimeout(r, 700))
  const lb2 = await p.evaluate(() => ({ cap: document.querySelector('.lbox_cap')?.textContent }))
  await p.screenshot({ path: `scripts/au-lbox-${tag}.png` })
  await p.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 700))
  const lb3 = await p.evaluate(() => ({ closed: document.getElementById('lbox').hidden, unlocked: !document.documentElement.classList.contains('lbox-on') }))
  await p.close(); return { grid, lb1, lb2, lb3 }
}
console.log(JSON.stringify({ desktop: await run(1440,900,false,'desktop'), mobile: await run(440,956,true,'mobile'), errors: errs }, null, 1))
await b.close()
