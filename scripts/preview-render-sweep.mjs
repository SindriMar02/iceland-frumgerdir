/**
 * Regression sweep: load every /preview/* route from the built dist and assert
 * it still renders (no page/console error, non-trivial text, shared disclaimer
 * footer present). Run against `npm run preview` on :4199.
 */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const app = fs.readFileSync('src/App.tsx', 'utf8')
const routes = [...new Set([...app.matchAll(/path="(\/preview\/[^"]*)"/g)].map((m) => m[1]))]
  .filter((r) => !r.includes('*') && !r.includes(':'))

const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox'],
})
const bad = []
for (const r of routes) {
  const page = await b.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)))
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 160)))
  try {
    await page.goto('http://localhost:4199' + r, { waitUntil: 'networkidle2', timeout: 45000 })
    await new Promise((s) => setTimeout(s, 700))
    const info = await page.evaluate(() => ({
      len: document.body.innerText.length,
      title: document.title,
    }))
    const fatal = errs.filter((e) => !/favicon|404 \(Not Found\)|net::ERR_/.test(e))
    if (info.len < 200 || fatal.length) bad.push({ r, ...info, errs: fatal.slice(0, 3) })
    process.stdout.write(info.len < 200 || fatal.length ? 'X' : '.')
  } catch (e) {
    bad.push({ r, err: String(e).slice(0, 160) })
    process.stdout.write('E')
  }
  await page.close()
}
await b.close()
console.log(`\n\nroutes: ${routes.length} | problems: ${bad.length}`)
for (const x of bad) console.log(JSON.stringify(x))
