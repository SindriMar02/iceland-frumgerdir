import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-nolang' })
const errs = []
const p = await b.newPage()
p.on('pageerror', e => errs.push('page: ' + e.message))
p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0,140)) })
await p.setViewport({ width: 440, height: 956, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.evaluateOnNewDocument(() => sessionStorage.setItem('nl_seen','1'))
// ?lang=de must no longer do anything
await p.goto('http://localhost:5299/preview/nollur?lang=de', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 3500))
const out = await p.evaluate(() => {
  const txt = document.body.innerText
  const german = ['Deutsch','Häuser','Schlüssel','Nächte','Anreise','Abreise','Gäste','Menü','Schreiben Sie']
  return {
    htmlLang: document.documentElement.lang,
    langToggle: document.querySelectorAll('.nl-lang').length,
    germanWordsOnPage: german.filter(w => txt.includes(w)),
    heroWordmark: document.querySelector('.nl-hero-word')?.textContent?.trim().slice(0,20),
    bookCta: document.querySelector('.nl-book-cta')?.textContent?.trim(),
    tags: [...document.querySelectorAll('.nl-spot')].map(s => s.textContent.trim()),
  }
})
out.errors = errs
console.log(JSON.stringify(out, null, 1))
await b.close()
