/* Drangar mobile audit — beauty + usability. */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const URL = process.env.DR_URL ?? 'http://localhost:5399/preview/drangar'
const OUT = 'scripts/drangar-shots/mobile'
fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/dr-mob-profile',
  args: ['--window-size=390,844'],
})
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
await page.evaluateOnNewDocument(() => sessionStorage.setItem('dr_seen', '1'))
await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2400))

const report = {}

/* structural checks */
report.structure = await page.evaluate(() => {
  const docW = document.documentElement.scrollWidth
  const clipped = []
  document.querySelectorAll('h1,h2,h3,p,a,span').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.width === 0) return
    if (r.right > window.innerWidth + 2 || r.left < -2) {
      const cs = getComputedStyle(el)
      if (cs.position !== 'fixed' && !el.closest('.dr-track') === false) return
      clipped.push(`${el.tagName}.${(el.className || '').toString().slice(0, 30)} L${Math.round(r.left)} R${Math.round(r.right)}`)
    }
  })
  return { docW, innerW: window.innerWidth, overflow: docW - window.innerWidth }
})

/* tap targets */
report.tapTargets = await page.evaluate(() => {
  const bad = []
  document.querySelectorAll('a,button').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return
    if (r.height < 40 || r.width < 40) bad.push(`${(el.textContent || '').trim().slice(0, 22)} ${Math.round(r.width)}x${Math.round(r.height)}`)
  })
  return { count: bad.length, sample: bad.slice(0, 12) }
})

/* body font sizes below 16px that matter */
report.smallText = await page.evaluate(() => {
  const small = new Set()
  document.querySelectorAll('p').forEach((el) => {
    const fs = parseFloat(getComputedStyle(el).fontSize)
    if (fs < 13 && (el.textContent || '').trim().length > 40) small.add(`${(el.className || '').toString().slice(0, 30)}:${Math.round(fs)}px`)
  })
  return [...small].slice(0, 8)
})

/* walk the page, screenshot every ~90svh */
const H = await page.evaluate(() => document.body.scrollHeight)
report.pageHeight = H
let i = 0
for (let y = 0; y < H - 400; y += 760) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
  await new Promise((r) => setTimeout(r, 700))
  await page.screenshot({ path: `${OUT}/m${String(i).padStart(2, '0')}.png` })
  i += 1
  if (i > 24) break
}

/* menu open/close */
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await new Promise((r) => setTimeout(r, 500))
await page.tap('.dr-burger')
await new Promise((r) => setTimeout(r, 900))
await page.screenshot({ path: `${OUT}/menu-open.png` })
report.menu = await page.evaluate(() => {
  const menu = document.querySelector('.dr-menu')
  const links = menu ? menu.querySelectorAll('a').length : 0
  return { open: !!menu, links, bodyLocked: document.body.style.overflow === 'hidden' }
})
await page.tap('.dr-burger')
await new Promise((r) => setTimeout(r, 600))
report.menuClosed = await page.evaluate(() => !document.querySelector('.dr-menu'))

console.log(JSON.stringify(report, null, 2))
await browser.close()
