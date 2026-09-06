import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-sp' })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width: 440, height: 956, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.goto('https://sindrimar02.github.io/austurey-preview/?s=' + Math.random(), { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 6500))
const out = await p.evaluate(() => {
  const t = document.body.innerText.replace(/\s+/g, ' ')
  const welded = t.match(/[a-z]\.(com|is|net)[A-Za-z]/g) || []
  const strongs = [...document.querySelectorAll('[data-scrub-words] strong')].map(s => s.textContent)
  const sample = (t.match(/.{0,30}Booking\.com.{0,30}/) || [''])[0]
  return { sample, weldedPairs: welded, strongSurvived: strongs, anyWeld: welded.length > 0 }
})
console.log(JSON.stringify(out, null, 1))
await b.close()
