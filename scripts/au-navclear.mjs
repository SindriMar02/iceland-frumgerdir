import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-nc' })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.goto('https://sindrimar02.github.io/austurey-preview/?n=' + Math.random(), { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 8000))
console.log(JSON.stringify(await p.evaluate(() => {
  return ['#burger', '.nav_book', '.nav_logo'].map(sel => {
    const el = document.querySelector(sel)
    if (!el) return { sel, missing: true }
    const b = el.getBoundingClientRect()
    const x = b.left + b.width / 2, y = b.top + b.height / 2
    const hit = document.elementFromPoint(x, y)
    const chain = []
    let n = hit
    while (n && chain.length < 4) { chain.push(n.tagName.toLowerCase() + (n.className ? '.' + n.className.toString().trim().split(/\s+/)[0] : '')); n = n.parentElement }
    return { sel, box: { x: Math.round(x), y: Math.round(y), w: Math.round(b.width), h: Math.round(b.height) },
      hit: hit ? hit.tagName.toLowerCase() + '.' + (hit.className?.toString().trim().split(/\s+/)[0] || '') : 'none',
      inside: el.contains(hit) || hit === el, chain }
  })
}), null, 1))
await b.close()
