import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-seam-profile3' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.goto('http://localhost:5299/preview/nollur', { waitUntil: 'networkidle0', timeout: 45000 })
await p.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 2000))
// coarse approach first with generous settle time between chunks
let barnLeft = 99999
for (let i = 0; i < 60 && barnLeft > 750; i++) {
  await p.mouse.wheel({ deltaY: 250 })
  await new Promise(r => setTimeout(r, 90))
  barnLeft = await p.evaluate(() => document.querySelector('.nl-barn').getBoundingClientRect().left)
}
console.log('coarse landed at', barnLeft)
// let momentum fully die down (long wait, no more input)
await new Promise(r => setTimeout(r, 1500))
barnLeft = await p.evaluate(() => document.querySelector('.nl-barn').getBoundingClientRect().left)
console.log('after settle', barnLeft)
// fine nudge with tiny ticks + long waits to converge near 720
for (let i = 0; i < 30 && Math.abs(barnLeft - 720) > 40; i++) {
  await p.mouse.wheel({ deltaY: barnLeft > 720 ? 20 : -20 })
  await new Promise(r => setTimeout(r, 300))
  barnLeft = await p.evaluate(() => document.querySelector('.nl-barn').getBoundingClientRect().left)
}
await new Promise(r => setTimeout(r, 500))
barnLeft = await p.evaluate(() => document.querySelector('.nl-barn').getBoundingClientRect().left)
console.log('final', barnLeft)
await p.screenshot({ path: 'scripts/nollur-shots/seam-precise2.png' })
await b.close()
