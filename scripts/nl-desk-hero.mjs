import puppeteer from 'puppeteer-core'
const URL = process.env.NL ?? 'http://localhost:5299/preview/nollur'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-desk' })
const out = {}
for (const [w, h] of [[1440, 900], [1728, 1080], [1280, 800]]) {
  const p = await b.newPage()
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
  await p.evaluateOnNewDocument(() => sessionStorage.setItem('nl_seen', '1'))
  await p.goto(URL, { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 4200))
  out[`${w}x${h}`] = await p.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { t: Math.round(b.top), b: Math.round(b.bottom), l: Math.round(b.left), r: Math.round(b.right), h: Math.round(b.height) } }
    const word = r('.nl-hero-word'), cut = r('.nl-hero-cut'), img = r('.nl-hero-cut img')
    const cs = getComputedStyle(document.querySelector('.nl-hero-cut'))
    const ws = getComputedStyle(document.querySelector('.nl-hero-word'))
    return {
      vh: innerHeight, word, cut, img,
      cutBottomCSS: cs.bottom, cutWidthCSS: cs.width, wordTopCSS: ws.top, wordFont: ws.fontSize,
      // how much of the wordmark's height is hidden behind the house
      wordCoveredPx: word && cut ? Math.max(0, word.b - cut.t) : null,
      wordCoveredPct: word && cut ? Math.round(Math.max(0, word.b - cut.t) / word.h * 100) : null,
    }
  })
  await p.close()
}
console.log(JSON.stringify(out, null, 1))
await b.close()
