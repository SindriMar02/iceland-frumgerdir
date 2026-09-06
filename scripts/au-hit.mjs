import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-hit' })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.goto('https://sindrimar02.github.io/austurey-preview/?h=' + Math.random(), { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 8000))
const probe = await p.evaluate(() => {
  const lb = document.getElementById('lbox')
  const cs = getComputedStyle(lb)
  const at = (sel) => {
    const el = document.querySelector(sel); if (!el) return 'missing'
    const r = el.getBoundingClientRect()
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
    return { target: sel, hitBy: hit ? hit.tagName.toLowerCase() + '.' + (hit.className?.toString().trim().split(/\s+/)[0] || '') : 'none',
             blocked: !!hit && !el.contains(hit) && hit !== el }
  }
  return {
    lbox: { hiddenAttr: lb.hasAttribute('hidden'), display: cs.display, opacity: cs.opacity,
            pointerEvents: cs.pointerEvents, zIndex: cs.zIndex,
            rect: (r => ({ w: Math.round(r.width), h: Math.round(r.height) }))(lb.getBoundingClientRect()) },
    burger: at('#burger'), book: at('.nav_book'), logo: at('.nav_logo'),
  }
})
console.log(JSON.stringify(probe, null, 1))
// try actually clicking the burger
await p.click('#burger').catch(e => console.log('CLICK FAILED:', e.message.slice(0, 80)))
await new Promise(r => setTimeout(r, 900))
console.log('menu-open after click:', await p.evaluate(() => document.body.classList.contains('menu-open')))
await b.close()
