import puppeteer from 'puppeteer-core'
import { PNG } from 'pngjs'
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const [w, h] of [[390, 844], [390, 664]]) {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await (await p.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
  await p.goto(process.argv[2], { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 5200))
  for (const sel of ['.ki-newest-kicker', '.ki-newest-title']) {
    const box = await p.evaluate(s => { const e = document.querySelector(s); const b = e.getBoundingClientRect()
      return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), col: getComputedStyle(e).color } }, sel)
    await p.evaluate(s => { document.querySelector(s).style.visibility = 'hidden' }, sel)
    const png = PNG.sync.read(await p.screenshot({ clip: { x: box.x, y: box.y, width: Math.max(2, box.w), height: Math.max(2, box.h) } }))
    await p.evaluate(s => { document.querySelector(s).style.visibility = '' }, sel)
    let worst = 1, best = 21
    const m = /(\d+),\s*(\d+),\s*(\d+)/.exec(box.col); const Lt = L(+m[1], +m[2], +m[3])
    for (let i = 0; i < png.data.length; i += 4) {
      const Lb = L(png.data[i], png.data[i + 1], png.data[i + 2])
      const c = (Math.max(Lt, Lb) + 0.05) / (Math.min(Lt, Lb) + 0.05)
      if (c < best) best = c
    }
    console.log(`${w}x${h}  ${sel.padEnd(20)} worst contrast ${best.toFixed(2)}:1  ${best >= 4.5 ? 'AA' : best >= 3 ? 'AA-large only' : 'FAIL'}`)
  }
  await p.close()
}
await br.close()
