import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
await page.goto(process.argv[2], { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 5000))
console.log(JSON.stringify(await page.evaluate(() => {
  const imgs = [...document.images]
  const g = (f) => imgs.filter(f).length
  const big = imgs.filter(i => i.naturalWidth * i.naturalHeight > 2.2e6)
    .map(i => ({ src: i.currentSrc.split('/').pop(), nat: i.naturalWidth + 'x' + i.naturalHeight, box: Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height), dec: i.decoding, load: i.loading }))
  return { total: imgs.length, sync: g(i => i.decoding === 'sync'), eager: g(i => i.loading === 'eager'), lazy: g(i => i.loading === 'lazy'),
    oversized: big.length, sample: big.slice(0, 8),
    animatedEls: document.querySelectorAll('[style*="translate3d"], [style*="transform"]').length }
}), null, 1))
await br.close()
