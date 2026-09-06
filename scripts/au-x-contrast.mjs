import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-x2' })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.goto('https://sindrimar02.github.io/austurey-preview/?x=' + Math.random(), { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 5200))
await p.click('#burger'); await new Promise(r => setTimeout(r, 1500))
const out = await p.evaluate(async () => {
  const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
  const L = ([r, g, bl]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(bl)
  const ratio = (a, b) => { const l1 = Math.max(L(a), L(b)), l2 = Math.min(L(a), L(b)); return +((l1 + 0.05) / (l2 + 0.05)).toFixed(2) }
  const parse = s => s.match(/[\d.]+/g).map(Number)

  const btn = document.querySelector('.nav_burger')
  const bb = btn.getBoundingClientRect()
  const vis = document.querySelector('.menu_visual').getBoundingClientRect()
  const scrimEl = document.querySelector('.menu_scrim')
  const scrimH = scrimEl.getBoundingClientRect().height
  const fg = parse(getComputedStyle(btn).color).slice(0, 3)

  // scrim alpha at the button's vertical centre, from the gradient's own stops
  const yFrac = ((bb.top + bb.height / 2) - vis.top) / scrimH
  // mirrors the gradient stops in styles.css: .85 / .6 @38% / .18 @72% / 0
  let a
  if (yFrac <= 0.38) a = 0.85 + (yFrac / 0.38) * (0.60 - 0.85)
  else if (yFrac <= 0.72) a = 0.60 + ((yFrac - 0.38) / 0.34) * (0.18 - 0.60)
  else if (yFrac <= 1) a = 0.18 + ((yFrac - 0.72) / 0.28) * (0 - 0.18)
  else a = 0
  const scrimRGB = [19, 25, 28]

  const results = []
  const imgs = [...document.querySelectorAll('.menu_img')]
  for (let i = 0; i < imgs.length; i++) {
    imgs.forEach((im, j) => im.classList.toggle('is-visible', j === i))
    await new Promise(r => setTimeout(r, 260))
    const im = imgs[i]
    // replicate object-fit: cover to find the source pixels under the button
    const sw = im.naturalWidth, sh = im.naturalHeight
    const scale = Math.max(vis.width / sw, vis.height / sh)
    const dw = sw * scale, dh = sh * scale
    const offX = (vis.width - dw) / 2, offY = (vis.height - dh) / 2
    const cx = (bb.left - vis.left - offX) / scale, cy = (bb.top - vis.top - offY) / scale
    const cw = bb.width / scale, ch = bb.height / scale
    const cv = document.createElement('canvas'); cv.width = 12; cv.height = 12
    const ctx = cv.getContext('2d', { willReadFrequently: true })
    let px
    try { ctx.drawImage(im, cx, cy, cw, ch, 0, 0, 12, 12); px = ctx.getImageData(0, 0, 12, 12).data }
    catch (e) { results.push({ img: i, error: 'tainted canvas' }); continue }
    let r = 0, g = 0, bl = 0, n = 0
    for (let k = 0; k < px.length; k += 4) { r += px[k]; g += px[k+1]; bl += px[k+2]; n++ }
    const photo = [r/n, g/n, bl/n]
    const composited = photo.map((c, k) => c * (1 - a) + scrimRGB[k] * a)
    results.push({
      img: i, src: im.currentSrc.split('/').pop().slice(0, 26),
      photoMean: photo.map(Math.round),
      scrimAlpha: +a.toFixed(2),
      behindX: composited.map(Math.round),
      contrast: ratio(fg, composited),
    })
  }
  imgs.forEach((im, j) => im.classList.toggle('is-visible', j === 0))
  return { fg, scrimH: Math.round(scrimH), results }
})
console.log(JSON.stringify(out, null, 1))
await b.close()
