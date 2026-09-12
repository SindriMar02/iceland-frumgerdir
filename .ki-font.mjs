import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
const cdp = await page.createCDPSession()
await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 120, downloadThroughput: 900*1024, uploadThroughput: 500*1024 })
const t0 = Date.now()
await page.goto('http://localhost:8791/', { waitUntil: 'domcontentloaded' })
for (const at of [120, 300, 600, 1000, 1600, 2600]) {
  const w = at - (Date.now() - t0); if (w > 0) await new Promise(r => setTimeout(r, w))
  console.log(String(at).padStart(4), JSON.stringify(await page.evaluate(() => {
    const word = document.querySelector('.ki-plx-word')
    return {
      melodrama: document.fonts.check('400 104px Melodrama'),
      wordW: word ? Math.round(word.getBoundingClientRect().width) : null,
      wordH: word ? Math.round(word.getBoundingClientRect().height) : null,
      fontsReady: document.fonts.status,
    }
  })))
}
await br.close()
