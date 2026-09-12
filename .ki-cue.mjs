import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 1440, height: 900 })
await p.goto(process.argv[2], { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 5000))
const h = await p.evaluate(() => document.querySelector('[data-ki-hscroll]').offsetTop)
let found = null
for (const off of [600, 1200, 1800, 2400, 3000, 3600, 4400]) {
  await p.evaluate(y => window.scrollTo(0, y), h + off); await new Promise(r => setTimeout(r, 600))
  found = await p.evaluate(() => {
    const all = [...document.querySelectorAll('.ki-hs-bleedfig, .ki-hs-frame')]
    document.querySelectorAll('[data-probe]').forEach(e => delete e.dataset.probe)
    const f = all.find(e => { const b = e.getBoundingClientRect(); return b.x > 30 && b.right < innerWidth - 30 && b.top < innerHeight - 200 && b.bottom > 200 })
    if (!f) return null
    f.dataset.probe = '1'
    const b = f.getBoundingClientRect(); return { x: Math.round(b.x + b.width/2), y: Math.round(b.y + b.height/2) }
  })
  if (found) { console.log('in view at offset', off, JSON.stringify(found)); break }
}
const before = await p.evaluate(() => { const c = document.querySelector('.ki-hs-cue'); return c ? { txt: c.textContent, op: getComputedStyle(c).opacity, disp: getComputedStyle(c).display } : null })
const box = found
await p.mouse.move(box.x, box.y); await new Promise(r => setTimeout(r, 700))
const after = await p.evaluate(() => { const c = document.querySelector('[data-probe] .ki-hs-cue'); return c ? { txt: c.textContent, op: +getComputedStyle(c).opacity, y: getComputedStyle(c).transform } : 'no cue inside probe' })
console.log('before', JSON.stringify(before), '\nafter ', JSON.stringify(after))
await p.screenshot({ path: '/tmp/ki-cue.png' })
await br.close()
