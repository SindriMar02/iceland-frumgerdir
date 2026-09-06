import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-qa-profile' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.evaluateOnNewDocument(() => sessionStorage.setItem('nl_seen', '1'))
await p.goto('http://localhost:5299/preview/nollur', { waitUntil: 'domcontentloaded' })
await p.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 2200))
const probe = () => p.evaluate(() => {
  const track = document.querySelector('.nl-track')
  const t = track ? getComputedStyle(track).transform : 'none'
  const x = t.startsWith('matrix') ? parseFloat(t.split(',')[4]) : 0
  const w = document.querySelector('.nl-hero-word')
  const wt = w ? getComputedStyle(w).transform : 'none'
  const wy = wt.startsWith('matrix') ? parseFloat(wt.split(',')[5]) : 0
  return { trackX: Math.round(x), wordTranslateY: Math.round(wy) }
})
console.log('start', JSON.stringify(await probe()))
for (const step of [2, 2, 2, 2, 2]) {
  for (let i = 0; i < step; i++) { await p.mouse.wheel({ deltaY: 120 }); await new Promise(r => setTimeout(r, 30)) }
  await new Promise(r => setTimeout(r, 500))
  console.log(JSON.stringify(await probe()))
}
await p.screenshot({ path: 'scripts/nollur-shots/behind-quarter.png' })
for (let i = 0; i < 6; i++) { await p.mouse.wheel({ deltaY: 120 }); await new Promise(r => setTimeout(r, 30)) }
await new Promise(r => setTimeout(r, 500))
console.log('half', JSON.stringify(await probe()))
await p.screenshot({ path: 'scripts/nollur-shots/behind-half.png' })
await b.close()
