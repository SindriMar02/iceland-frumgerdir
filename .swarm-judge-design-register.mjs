import puppeteer from 'puppeteer-core'
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-design'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:8963/verkefni', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1200))
const total = await page.evaluate(() => document.body.scrollHeight)
await page.evaluate((h) => window.scrollTo({top: h - 900, behavior: 'instant'}), total)
await new Promise(r => setTimeout(r, 400))
await page.screenshot({ path: `${OUT}/verkefni-bottom.png` })
// try hover on a text link row near bottom
const link = await page.evaluateHandle(() => {
  const links = Array.from(document.querySelectorAll('a'));
  return links.find(a => a.getBoundingClientRect().top > 100 && a.getBoundingClientRect().top < 800 && a.textContent.trim().length > 3);
})
if (link) {
  const el = link.asElement();
  if (el) {
    await el.hover();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: `${OUT}/verkefni-registerhover2.png` });
  }
}
await br.close()
