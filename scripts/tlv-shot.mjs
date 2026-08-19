/**
 * Landing-page shot for the Tannlæknavaktin outreach email.
 *
 * 1440x900 @2x off a running preview, per the outreach guide's recipe, then
 * converted to JPEG by the caller. Waits out the assistant launcher's 900ms
 * entrance so the floating bubble is actually in frame.
 *
 * Usage:  node scripts/tlv-shot.mjs [url] [outPath]
 */
import puppeteer from 'puppeteer-core'

const URL = process.argv[2] || 'http://localhost:4199/preview/tannlaeknavaktin/'
const OUT = process.argv[3] || '/tmp/frumgerd-tannlaeknavaktin.png'

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/tlv-shot-profile',
  args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 2800))

await page.screenshot({ path: OUT })

console.log('hero:', await page.evaluate(() =>
  document.querySelector('main section').innerText.replace(/\n+/g, ' | ').slice(0, 110)))
console.log('launcher entered:', await page.evaluate(() => {
  const l = document.querySelector('.tlv-launch')
  return !!l && getComputedStyle(l.parentElement).opacity === '1'
}))

await browser.close()
