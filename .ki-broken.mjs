import puppeteer from 'puppeteer-core'
const base = process.argv[2].replace(/\/$/, '')
const routes = ['/','/verkefni','/verkefni/nybyggt-hus-i-suluhofda','/verkefni/hus-i-gardabae','/verkefni/badherbergi','/italskar-innrettingar','/studioid','/hafa-samband','/en','/verkefni/svala-apartments']
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
let bad = 0, seen = 0, f404 = []
for (const r of routes) {
  const p = await br.newPage(); await p.setViewport({ width: 1440, height: 900 })
  p.on('response', res => { if (res.status() >= 400 && /\.(avif|webp|jpg|png|woff2?)$/.test(res.url())) f404.push(r + ' -> ' + res.url().split('/').pop()) })
  await p.goto(base + r, { waitUntil: 'networkidle0' })
  await new Promise(x => setTimeout(x, 4200))
  const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  for (let y = 0; y <= H; y += 800) { await p.evaluate(v => scrollTo(0, v), y); await new Promise(x => setTimeout(x, 260)) }
  // arm every hover crossfade so the second images mount and load
  await p.evaluate(() => document.querySelectorAll('.ki-card, .ki-slide, a').forEach(e => e.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }))))
  await new Promise(x => setTimeout(x, 2500))
  const res = await p.evaluate(() => { const i = [...document.images]; return { n: i.length, bad: i.filter(x => x.currentSrc && x.naturalWidth === 0).map(x => x.currentSrc.split('/').pop()) } })
  seen += res.n; bad += res.bad.length
  if (res.bad.length) console.log('BROKEN', r, res.bad.join(' '))
  await p.close()
}
console.log(`${routes.length} routes · ${seen} images · broken ${bad} · 4xx assets ${f404.length}`)
if (f404.length) console.log(f404.slice(0, 10).join('\n'))
await br.close()
