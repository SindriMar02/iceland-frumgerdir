import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
await page.goto(process.argv[2], { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 4000))
console.log(JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('section, .ki-chapter, [class*="ki-"]')]
  .filter(e => e.offsetHeight > 300)
  .map(e => ({ y: Math.round(e.getBoundingClientRect().top + scrollY), h: e.offsetHeight, c: (e.className||'').toString().slice(0,40) }))
  .filter(e => e.y > 15500 && e.y < 22000).slice(0, 14), null, 1)))
await br.close()
