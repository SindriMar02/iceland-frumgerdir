import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-seam-profile' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.goto('https://sindrimar02.github.io/iceland-frumgerdir/preview/nollur/', { waitUntil: 'networkidle0', timeout: 45000 })
await p.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 2000))
// find barn and materials panel left offsets within the track
const geo = await p.evaluate(() => {
  const track = document.querySelector('.nl-track')
  const barn = document.querySelector('.nl-barn')
  const mat = document.querySelector('.nl-mat')
  const cierre = document.querySelector('.nl-cierre')
  const summer = document.querySelector('.nl-summer')
  const off = (el) => el.getBoundingClientRect().left - track.getBoundingClientRect().left
  return { barnLeft: off(barn), matLeft: off(mat), matWidth: mat.getBoundingClientRect().width, cierreLeft: off(cierre), summerLeft: off(summer), summerWidth: summer.getBoundingClientRect().width }
})
console.log(JSON.stringify(geo))
// scroll so the materials->barn boundary sits mid-viewport
const master = await p.evaluate(() => document.body.scrollHeight)
// binary-ish: scroll until barn's left edge is near viewport x=700
let lastLeft = 99999
for (let i = 0; i < 400 && lastLeft > 700; i++) {
  await p.mouse.wheel({ deltaY: 200 })
  await new Promise(r => setTimeout(r, 5))
  lastLeft = await p.evaluate(() => document.querySelector('.nl-barn').getBoundingClientRect().left)
}
await new Promise(r => setTimeout(r, 600))
console.log('barn left now', lastLeft)
await p.screenshot({ path: 'scripts/nollur-shots/seam-matbarn.png' })
await p.screenshot({ path: 'scripts/nollur-shots/seam-matbarn-crop.png', clip: { x: Math.max(0, lastLeft - 150), y: 0, width: 500, height: 900 } })
await b.close()
