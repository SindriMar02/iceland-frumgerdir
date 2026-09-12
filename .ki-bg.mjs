import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await p.goto(process.argv[2], { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 4200))
console.log(JSON.stringify(await p.evaluate(() => ['.parallax__plate-face', '.parallax__plate-hem'].map(s => {
  const e = document.querySelector(s), cs = getComputedStyle(e), r = e.getBoundingClientRect()
  return { s, box: Math.round(r.width) + 'x' + Math.round(r.height), size: cs.backgroundSize, pos: cs.backgroundPosition, url: cs.backgroundImage.split('/').pop().replace(/["')]/g, '') }
})), null, 1))
await br.close()
