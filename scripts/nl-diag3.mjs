import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-qa-profile3' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.evaluateOnNewDocument(() => sessionStorage.setItem('nl_seen', '1'))
await p.goto('http://localhost:5299/preview/nollur', { waitUntil: 'domcontentloaded' })
await p.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 2200))
const probe = () => p.evaluate(() => {
  const w = document.querySelector('.nl-hero-word')
  const house = document.querySelector('.nl-hero-house')
  const r = (el) => { const b = el.getBoundingClientRect(); return { top: Math.round(b.top), left: Math.round(b.left), bottom: Math.round(b.bottom) } }
  return { word: r(w), houseTop: Math.round(house.getBoundingClientRect().top) }
})
console.log('0', JSON.stringify(await probe()))
for (const n of [1,1,1,1,1,1]) {
  await p.mouse.wheel({ deltaY: 60 })
  await new Promise(r => setTimeout(r, 250))
  console.log(JSON.stringify(await probe()))
}
await p.screenshot({ path: 'scripts/nollur-shots/fine-step.png' })
await b.close()
