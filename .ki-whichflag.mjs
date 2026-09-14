/* name the elements behind anonymous audit flags: small text and small taps */
import puppeteer from 'puppeteer-core'
const [base] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const r of ['/', '/hafa-samband', '/en', '/verkefni']) {
  const p = await br.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await p.goto(base + r, { waitUntil: 'networkidle0' }); await new Promise((x) => setTimeout(x, 900))
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo({ top: y, behavior: 'instant' }); await new Promise((x) => setTimeout(x, 40)) } })
  const out = await p.evaluate(() => {
    const vis = (e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0 && b.width > 0 && b.height > 0 }
    const path = (e) => [e.parentElement?.className, e.className].filter(Boolean).map(String).map((c) => c.split(' ')[0]).join(' > ') || e.tagName
    const spans = [...document.querySelectorAll('span, a')].filter((e) => !e.className && vis(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12).map((e) => `${path(e)} "${e.textContent.trim().slice(0, 20)}" ${getComputedStyle(e).fontSize}`)
    const links = [...document.querySelectorAll('a')].filter((e) => !e.className && vis(e)).map((e) => { const b = e.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height), path(e), e.textContent.trim().slice(0, 18)] }).filter(([w, h]) => Math.min(w, h) < 44).map((x) => x.join(' ')).slice(0, 8)
    return { spans: [...new Set(spans)].slice(0, 5), links: [...new Set(links)] }
  })
  console.log(r, JSON.stringify(out))
  await p.close()
}
await br.close()
