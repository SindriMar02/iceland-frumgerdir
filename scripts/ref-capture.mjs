import puppeteer from 'puppeteer-core'
/* Banners are HIDDEN, never clicked. The first pass clicked anything matching
   /accept|ok|agree/i, which on several sites hit a nav or footer link: sobha
   came back as its Privacy Policy while still REPORTING the home page title,
   because the title was read before the navigation settled. So the final path
   is checked AFTER the screenshot, and any drift off "/" is flagged. */
const SITES = [
  ['brikken',   'https://brikken.co/'],
  ['nueve',     'https://nueve.gr/'],
  ['sobha',     'https://sobha-privy-collection.com/'],
  ['vita',      'https://vita-travel.webflow.io/'],
  ['amour',     'https://amourliquide.com/'],
  ['cocoon',    'https://cocoonblanket.com/'],
  ['juvet',     'https://juvet.com/'],
  ['treehotel', 'https://treehotel.se/'],
  ['ion',       'https://ioniceland.is/'],
]
const HIDE = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  [id*="gdpr" i], [class*="gdpr" i], [aria-label*="cookie" i],
  #onetrust-consent-sdk, .cky-consent-container, #CybotCookiebotDialog { display: none !important; }
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
    await new Promise(r => setTimeout(r, 8000))
    await p.addStyleTag({ content: HIDE })
    await p.screenshot({ path: `scripts/ref-board/${slug}.jpg`, type: 'jpeg', quality: 82 })
    const info = await p.evaluate(() => ({ path: location.pathname + location.search, title: document.title.slice(0, 44) }))
    const drift = (info.path !== '/' && info.path !== '') ? `DRIFTED -> ${info.path}` : ''
    console.log(`${drift ? 'WARN' : 'OK  '} ${slug.padEnd(10)} ${info.title.padEnd(46)} ${drift}`)
  } catch (e) { console.log(`FAIL ${slug.padEnd(10)} ${String(e.message).slice(0, 60)}`) }
  await p.close()
}
await b.close()
