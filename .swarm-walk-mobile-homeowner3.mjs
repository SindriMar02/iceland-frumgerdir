import puppeteer from 'puppeteer-core'
import fs from 'fs'

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-homeowner'
fs.mkdirSync(OUT, { recursive: true })

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
const log = []
const shot = async (name) => { await page.screenshot({ path: `${OUT}/${name}.png` }); log.push(`shot: ${name}`) }

await page.goto('http://localhost:8963/verkefni/eldhusrymi-i-skuggahverfi', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1200))

// scroll to the "Segðu Katrínu frá rýminu þínu" / HAFA SAMBAND CTA
const found = await page.evaluate(() => {
  const all = [...document.querySelectorAll('a,button')]
  const cta = all.find(a => /hafa samband/i.test(a.textContent))
  if (!cta) return null
  const r = cta.getBoundingClientRect()
  return { top: r.top + window.scrollY, text: cta.textContent, tag: cta.tagName, href: cta.getAttribute && cta.getAttribute('href') }
})
log.push('CTA found: ' + JSON.stringify(found))
if (found) {
  await page.evaluate((top) => window.scrollTo({top: top - 200, behavior:'instant'}), found.top)
  await new Promise(r => setTimeout(r, 300))
  await shot('08-contact-cta-on-project-page')
}

// click through to contact page - find the VISIBLE instance (duplicates exist for the letter-roll hover animation)
const ctaHandle = await page.evaluateHandle(() => [...document.querySelectorAll('a')].find(a => /hafa samband/i.test(a.textContent) && a.getAttribute('href') === '/hafa-samband' && a.className === 'ki-cta'))
const ctaEl = ctaHandle.asElement()
if (ctaEl) {
  await ctaEl.evaluate(el => el.scrollIntoView({block:'center'}))
  await new Promise(r => setTimeout(r, 200))
  try { await ctaEl.click() } catch(e) { log.push('click failed: '+e.message); await page.goto('http://localhost:8963/hafa-samband') }
} else { await page.goto('http://localhost:8963/hafa-samband') }
await new Promise(r => setTimeout(r, 1200))
log.push('URL after contact click: ' + page.url())
await shot('09-contact-top')

const contactText = await page.evaluate(() => document.body.innerText)
log.push('CONTACT PAGE TEXT:\n' + contactText.slice(0, 2000))

// scroll down contact page for process/next-steps info and form
await page.evaluate(() => window.scrollBy({top: 700, behavior:'instant'}))
await new Promise(r => setTimeout(r, 300))
await shot('10-contact-scrolled')

// GO BACK to find another kitchen: use browser back twice to project page, then use "NÆSTA VERK" (next work) link
await page.goBack({ waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 800))
log.push('URL after back: ' + page.url())

// scroll to "NÆSTA VERK" link and click it (should be Eldhúsrými í skandinavískum stíl per part2 log)
const nextHandle = await page.evaluateHandle(() => [...document.querySelectorAll('a')].find(a => /skandinaviskum-stil/.test(a.getAttribute('href')||'') && a.offsetParent !== null))
const nextEl = nextHandle.asElement()
if (nextEl) {
  await nextEl.evaluate(el => el.scrollIntoView({block:'center'}))
  await new Promise(r => setTimeout(r, 300))
  await shot('11-before-next-kitchen-click')
  try { await nextEl.click() } catch(e) { log.push('next click failed: '+e.message); await page.goto('http://localhost:8963/verkefni/eldhusrymi-i-skandinaviskum-stil') }
  await new Promise(r => setTimeout(r, 1000))
  log.push('URL after next-kitchen click: ' + page.url())
  await shot('12-second-kitchen-project')
} else {
  log.push('NÆSTA VERK kitchen link not found')
}

fs.writeFileSync(`${OUT}/log-part3.txt`, log.join('\n\n'))
await br.close()
