import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
page.on('pageerror', e => console.log('PAGEERROR', e.message.slice(0, 200)))
page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 200)) })
await page.goto(process.argv[2] || 'http://localhost:8791/', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 5000))
console.log(JSON.stringify(await page.evaluate(() => ({
  scrollH: document.documentElement.scrollHeight,
  rootKids: document.getElementById('root')?.children.length,
  sections: [...document.querySelectorAll('main > *, .ki-root > *')].map(e => e.className || e.tagName).slice(0, 25),
  textLen: document.body.innerText.length,
  h2s: [...document.querySelectorAll('h2')].map(e => e.textContent.trim().slice(0, 30)),
})), null, 1))
await br.close()
