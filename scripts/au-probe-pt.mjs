import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-pt' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.goto('https://sindrimar02.github.io/austurey-preview/?q=' + Math.random(), { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 5200))
await p.click('#burger'); await new Promise(r => setTimeout(r, 1600))
console.log(JSON.stringify(await p.evaluate(() => {
  const pts = [[1010,190],[1010,120],[1200,300],[760,400]]
  return pts.map(([x,y]) => {
    const el = document.elementFromPoint(x,y)
    if (!el) return { x, y, el: 'none' }
    const cs = getComputedStyle(el)
    return { x, y, el: el.tagName.toLowerCase()+'.'+(el.className?.toString().trim().split(/\s+/).slice(0,2).join('.')||''),
             bg: cs.backgroundColor, radius: cs.borderRadius, z: cs.zIndex }
  })
}), null, 1))
await b.close()
