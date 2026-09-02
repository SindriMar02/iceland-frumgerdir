import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-qa-profile' })
const p = await b.newPage()
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.evaluateOnNewDocument(() => sessionStorage.setItem('nl_seen', '1'))
await p.goto('http://localhost:5299/preview/nollur', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 2500))
console.log(JSON.stringify(await p.evaluate(() => {
  const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { top: Math.round(b.top), h: Math.round(b.height), pos: cs.position, mt: cs.marginTop } }
  return { scrollY: window.scrollY, top: r('.nl-top'), header: r('header'), kicker: r('.nl-hero-kicker'), word: r('.nl-hero-word'), hero: r('.nl-hero'), root: r('.nl-root'), chrome: [...document.querySelectorAll('body > div > *')].slice(0, 4).map(e => e.className.toString().slice(0, 30)), firstChild: document.querySelector('.nl-root')?.firstElementChild?.tagName, bodyPad: getComputedStyle(document.body).paddingTop, mq: matchMedia('(max-width: 1023px)').matches }
})))
await b.close()
