import puppeteer from 'puppeteer-core'

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-design'

const pages = [
  { path: '/', name: 'home' },
  { path: '/verkefni/innanhusshonnun', name: 'category' },
  { path: '/verkefni/gistiheimili-og-hotel', name: 'project-a' },
  { path: '/verkefni/hotel-hekla', name: 'project-b' },
  { path: '/studioid', name: 'studioid' },
  { path: '/italskar-innrettingar', name: 'italskar' },
]

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

for (const p of pages) {
  await page.goto('http://localhost:8963' + p.path, { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1500))
  // top of page
  await page.screenshot({ path: `${OUT}/${p.name}-top.png` })
  // scroll in steps, screenshot every ~1600px viewport chunk
  const total = await page.evaluate(() => document.body.scrollHeight)
  let y = 900
  let i = 1
  while (y < total) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
    await new Promise(r => setTimeout(r, 200))
    await page.screenshot({ path: `${OUT}/${p.name}-scroll${i}.png` })
    y += 900
    i += 1
    if (i > 6) break
  }
  console.log(p.name, 'total height', total, 'shots', i)
}

await br.close()
