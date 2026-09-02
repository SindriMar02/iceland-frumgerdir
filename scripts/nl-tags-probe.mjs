import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-tags' })
const out = {}
for (const w of [320, 355, 390, 440, 620]) {
  const p = await b.newPage()
  await p.setViewport({ width: w, height: 781, deviceScaleFactor: 2, isMobile: w < 700, hasTouch: w < 700 })
  await p.evaluateOnNewDocument(() => sessionStorage.setItem('nl_seen','1'))
  await p.goto('http://localhost:5299/preview/nollur', { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 3200))
  out[w] = await p.evaluate(() => {
    const row = document.querySelector('.nl-hero-hotspots')
    const spots = [...document.querySelectorAll('.nl-spot')]
    const rr = row.getBoundingClientRect()
    const rects = spots.map(s => s.getBoundingClientRect())
    const rows = new Set(rects.map(r => Math.round(r.top)))
    return {
      vw: innerWidth,
      row: { l: Math.round(rr.left), r: Math.round(rr.right) },
      firstL: Math.round(Math.min(...rects.map(r => r.left))),
      lastR: Math.round(Math.max(...rects.map(r => r.right))),
      lines: rows.size,
      clipped: Math.min(...rects.map(r => r.left)) < 0 || Math.max(...rects.map(r => r.right)) > innerWidth,
      minTap: Math.round(Math.min(...rects.map(r => r.height))),
    }
  })
  await p.close()
}
console.log(JSON.stringify(out, null, 1))
await b.close()
