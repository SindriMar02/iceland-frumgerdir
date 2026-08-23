/* Landing-page screenshots for outreach. Waits out the opening reveal so the
   wordmark is caught at rest, never mid-blur. */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
const OUT = process.argv[2] || '.'
fs.mkdirSync(OUT, { recursive: true })
const B = 'https://sindrimar02.github.io/iceland-frumgerdir/preview'
const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'], protocolTimeout: 300000,
})
const shot = async (slug, vp, suffix) => {
  const p = await b.newPage()
  await p.setViewport(vp)
  await p.goto(`${B}/${slug}`, { waitUntil: 'networkidle2', timeout: 120000 })
  await new Promise(r => setTimeout(r, 7000))   // loader cap 2.4s + exit .95s + reveal
  await p.screenshot({ path: `${OUT}/${slug}-${suffix}.png` })
  await p.close()
  return (fs.statSync(`${OUT}/${slug}-${suffix}.png`).size / 1024).toFixed(0) + 'KB'
}
for (const slug of (process.argv.slice(3).length ? process.argv.slice(3) : ['laxfoss', 'glasscottages'])) {
  const hero = await shot(slug, { width: 1600, height: 1000, deviceScaleFactor: 2 }, 'hero')
  const phone = await shot(slug, { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, 'phone')
  console.log(`${slug.padEnd(12)} hero ${hero.padStart(7)}   phone ${phone.padStart(7)}`)
}
await b.close()
