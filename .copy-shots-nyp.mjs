import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
const OUT = '/tmp/nyp-copy-shots'; mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox', '--force-color-profile=srgb'] })
for (const [lang, url] of [['en', 'http://localhost:5714/'], ['is', 'http://localhost:5714/is/']]) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1500))
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) } window.scrollTo(0, 0) })
  const heads = await page.evaluate(() => [...document.querySelectorAll('h1, h2, h3')].map((h) => h.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean))
  console.log(lang, JSON.stringify(heads))
  for (const [name, sel] of [['hero', '#top'], ['farm', '#farm'], ['dinner', '#dinner'], ['seasons', '#dinner + section']]) {
    await page.evaluate((s) => { const el = document.querySelector(s); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 8) }, sel)
    await new Promise((r) => setTimeout(r, 1500))
    await page.screenshot({ path: `${OUT}/${lang}-${name}.png` })
  }
  await page.close()
}
await browser.close(); console.log('shots in', OUT)
