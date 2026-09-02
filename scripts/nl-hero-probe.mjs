import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-hero' })
const p = await b.newPage()
await p.setViewport({ width: 440, height: 956, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
await p.evaluateOnNewDocument(() => sessionStorage.setItem('nl_seen','1'))
await p.goto('http://localhost:5299/preview/nollur', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 3500))
console.log(JSON.stringify(await p.evaluate(() => {
  const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { t: Math.round(b.top), b: Math.round(b.bottom), l: Math.round(b.left), r: Math.round(b.right), w: Math.round(b.width) } }
  const spots = [...document.querySelectorAll('.nl-spot')].map(e => { const b = e.getBoundingClientRect(); return { t: Math.round(b.top), l: Math.round(b.left), r: Math.round(b.right) } })
  // overlap check
  let overlaps = 0
  for (let i=0;i<spots.length;i++) for (let j=i+1;j<spots.length;j++) {
    const a=spots[i],c=spots[j]
    if (a.l < c.r && c.l < a.r && Math.abs(a.t-c.t) < 22) overlaps++
  }
  return { word: r('.nl-hero-word'), cut: r('.nl-hero-cut'), spotsRow: r('.nl-hero-hotspots'), sub: r('.nl-hero-sub'),
    spots, overlaps, rootBg: getComputedStyle(document.documentElement).backgroundColor, bodyBg: getComputedStyle(document.body).backgroundColor,
    vw: innerWidth }
}), null, 1))
await b.close()
