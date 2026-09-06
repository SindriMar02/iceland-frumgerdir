import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-qa-profile' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.evaluateOnNewDocument(() => sessionStorage.setItem('nl_seen', '1'))
await p.goto('http://localhost:5299/preview/nollur', { waitUntil: 'domcontentloaded' })
await p.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 2200))
const probe = () => p.evaluate(() => {
  const w = document.querySelector('.nl-hero-word')
  const zone = document.querySelector('.nl-hero-word-zone')
  const house = document.querySelector('.nl-hero-house')
  const hero = document.querySelector('.nl-hero')
  const r = (el) => el ? (({top,left,width,height,bottom}) => ({top:Math.round(top),left:Math.round(left),width:Math.round(width),height:Math.round(height),bottom:Math.round(bottom)}))(el.getBoundingClientRect()) : null
  const cs = w ? getComputedStyle(w) : null
  return { word: r(w), zone: r(zone), house: r(house), hero: r(hero), wordOpacity: cs?.opacity, wordVisibility: cs?.visibility, wordColor: cs?.color, wordZ: cs?.zIndex, houseZ: house ? getComputedStyle(house).zIndex : null }
})
console.log('start', JSON.stringify(await probe(), null, 1))
for (let i = 0; i < 4; i++) { await p.mouse.wheel({ deltaY: 120 }); await new Promise(r => setTimeout(r, 30)) }
await new Promise(r => setTimeout(r, 500))
console.log('after4', JSON.stringify(await probe(), null, 1))
await b.close()
