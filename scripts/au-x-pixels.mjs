import puppeteer from 'puppeteer-core'
/* Measures the RENDERED pixels around the close control, not a model of the
   CSS: the previous pass computed contrast against a scrim that was painting
   behind the images and therefore did not exist on screen. */
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-xp' })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.goto('https://sindrimar02.github.io/austurey-preview/?p=' + Math.random(), { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 5200))
await p.click('#burger'); await new Promise(r => setTimeout(r, 1600))
const res = []
const n = await p.evaluate(() => document.querySelectorAll('.menu_img').length)
for (let i = 0; i < n; i++) {
  await p.evaluate(i => document.querySelectorAll('.menu_img').forEach((im, j) => im.classList.toggle('is-visible', j === i)), i)
  await new Promise(r => setTimeout(r, 400))
  const box = await p.evaluate(() => { const r = document.querySelector('.nav_burger').getBoundingClientRect()
    return { x: Math.round(r.left) - 6, y: Math.round(r.top) - 6, width: Math.round(r.width) + 12, height: Math.round(r.height) + 12 } })
  const buf = await p.screenshot({ clip: box })
  // decode the PNG's mean colour with the browser itself
  const b64 = buf.toString('base64')
  const mean = await p.evaluate(async (b64) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64
    await img.decode()
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height
    const x = c.getContext('2d'); x.drawImage(img, 0, 0)
    const d = x.getImageData(0, 0, c.width, c.height).data
    let r = 0, g = 0, bl = 0, k = 0
    for (let j = 0; j < d.length; j += 4) { r += d[j]; g += d[j+1]; bl += d[j+2]; k++ }
    return [r/k, g/k, bl/k]
  }, b64)
  const srgb = c => { c /= 255; return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4) }
  const L = ([r,g,bl]) => 0.2126*srgb(r) + 0.7152*srgb(g) + 0.0722*srgb(bl)
  const fg = [233,235,230]
  const l1 = Math.max(L(fg), L(mean)), l2 = Math.min(L(fg), L(mean))
  res.push({ img: i, meanRendered: mean.map(Math.round), contrast: +((l1+0.05)/(l2+0.05)).toFixed(2) })
}
await p.evaluate(() => document.querySelectorAll('.menu_img').forEach((im, j) => im.classList.toggle('is-visible', j === 0)))
await p.screenshot({ path: 'scripts/au-menu-scrim.png', clip: { x: 940, y: 0, width: 500, height: 230 } })
console.log(JSON.stringify({ res, worst: Math.min(...res.map(r => r.contrast)) }, null, 1))
await b.close()
