import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await page.goto(process.argv[2], { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 4500))
console.log(JSON.stringify(await page.evaluate(() => {
  const q = [...document.querySelectorAll('.parallax__plate, .parallax__layer-img, .parallax__plate-face, .parallax__plate-hem, .parallax__plate-tail')]
  const seen = {}
  for (const e of q) {
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e)
    const k = e.className.toString().split(' ').slice(-1)[0]
    ;(seen[k] ||= []).push({ w: Math.round(r.width), h: Math.round(r.height), mpx: +(r.width * r.height / 1e6).toFixed(1), wc: cs.willChange, bg: cs.backgroundImage.slice(0, 30) })
  }
  return { vh: innerHeight, dpr: devicePixelRatio, seen }
}), null, 1))
await br.close()
