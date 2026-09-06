import puppeteer from 'puppeteer-core'
/* No clicking: the previous pass clicked anything matching /accept|ok|agree/,
   which on three sites hit a nav or booking link and navigated away, so the
   "reference" was a cookie policy page. Banners get hidden, not pressed. */
const SITES = [
  ['juvet',     'https://juvet.com/'],
  ['treehotel', 'https://treehotel.se/'],
  ['ion',       'https://ioniceland.is/'],
]
const HIDE = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  [id*="gdpr" i], [class*="gdpr" i], [aria-label*="cookie" i],
  #onetrust-consent-sdk, .cky-consent-container, #CybotCookiebotDialog,
  [class*="Cookie"], [class*="banner--cookie"] { display: none !important; }
  html, body { overflow: auto !important; }
`
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars'] })
for (const [slug, url] of SITES) {
  const p = await b.newPage()
  try {
    await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
    await p.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36')
    await p.goto(url, { waitUntil: 'networkidle2', timeout: 45000 })
    await p.addStyleTag({ content: HIDE })
    await new Promise(r => setTimeout(r, 7000))
    await p.addStyleTag({ content: HIDE })
    const info = await p.evaluate(() => ({ url: location.href, title: document.title.slice(0, 60) }))
    await p.screenshot({ path: `scripts/ref-board/${slug}.jpg`, type: 'jpeg', quality: 82 })
    console.log(`OK   ${slug.padEnd(10)} ${info.title}  <- ${info.url.slice(0, 46)}`)
  } catch (e) { console.log(`FAIL ${slug.padEnd(10)} ${String(e.message).slice(0, 60)}`) }
  await p.close()
}
await b.close()
