import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const [w,h,tag] of [[1440,900,'d'],[390,844,'m']]) {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h })
  await p.goto('https://katrin-isfeld.pages.dev/', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 4500))
  await p.screenshot({ path: `/tmp/ki-live-${tag}.png` })
  console.log(tag, await p.evaluate(() => ({ h1: document.querySelector('h1')?.getAttribute('aria-label'), face: getComputedStyle(document.querySelector('.ki-plx-name')).fontFamily.split(',')[0], w: Math.round(document.querySelector('.ki-plx-name').getBoundingClientRect().width) })))
  await p.close()
}
await br.close()
