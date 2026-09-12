import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
const got = []
page.on('response', async r => { const u = r.url(); if (/\.(avif|webp|jpg|png)$/.test(u)) { try { got.push([u.split('/').pop(), (await r.buffer()).length]) } catch {} } })
await page.goto(process.argv[2], { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 4500))
const initial = got.length, initialBytes = got.reduce((a, b) => a + b[1], 0)
const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
for (let y = 0; y <= H; y += 900) { await page.evaluate(v => window.scrollTo(0, v), y); await new Promise(r => setTimeout(r, 700)) }
await new Promise(r => setTimeout(r, 2500))
const total = got.reduce((a, b) => a + b[1], 0)
console.log(`initial ${initial} imgs ${(initialBytes/1024/1024).toFixed(2)}MB | full page ${got.length} imgs ${(total/1024/1024).toFixed(2)}MB`)
console.log('heaviest:'); for (const [n, b] of got.sort((a,b)=>b[1]-a[1]).slice(0, 10)) console.log('  ' + (b/1024).toFixed(0).padStart(5) + 'KB  ' + n)
console.log(JSON.stringify(await page.evaluate(() => {
  const bad = [...document.images].filter(i => i.currentSrc && i.naturalWidth > 2.2 * i.getBoundingClientRect().width * devicePixelRatio && i.getBoundingClientRect().width > 0)
  return { oversampled: bad.length, sample: bad.slice(0,6).map(i => ({ f: i.currentSrc.split('/').pop(), nat: i.naturalWidth, css: Math.round(i.getBoundingClientRect().width), sizes: i.sizes || i.closest('picture')?.querySelector('source')?.sizes })) }
}), null, 1))
await br.close()
