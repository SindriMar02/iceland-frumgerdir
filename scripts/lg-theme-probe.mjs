import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/lg-theme' })
const p = await b.newPage()
await p.setCacheEnabled(false)
await p.setViewport({ width: 440, height: 956, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
await p.goto('https://sindrimar02.github.io/lagskogur-preview/?probe=1', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 4000))
const H = await p.evaluate(() => document.body.scrollHeight)
const rows = []
for (const f of [0, .04, .08, .12, .16, .2, .26, .32, .4, .5, .6, .7, .8, .9, .97]) {
  await p.evaluate(y => window.scrollTo(0, y), Math.round(H * f))
  await new Promise(r => setTimeout(r, 700))
  rows.push(await p.evaluate((f) => {
    const h = document.getElementById('header')
    const hd = document.documentElement
    return {
      f, y: Math.round(window.scrollY),
      header: [...h.classList].filter(c => c.startsWith('ui-')).join(' '),
      rootDark: hd.classList.contains('hd-dark'),
      rootBg: getComputedStyle(hd).backgroundColor,
      barBg: getComputedStyle(h, '::after').background.slice(0, 60),
      inSync: (h.classList.contains('ui-dark')) === hd.classList.contains('hd-dark'),
    }
  }, f))
}
console.log(JSON.stringify(rows, null, 0).replace(/\},\{/g, '},\n{'))
await b.close()
