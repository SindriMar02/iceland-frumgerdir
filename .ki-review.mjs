import puppeteer from 'puppeteer-core'
import { execFileSync } from 'node:child_process'
import { rmSync } from 'node:fs'
const base = process.argv[2], paths = process.argv.slice(3)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const shots = []
for (const path of paths) {
  const p = await br.newPage(); await p.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await p.goto(base + path, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 2200))
  const H = await p.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < H; y += 800) { await p.evaluate(v => scrollTo(0, v), y); await new Promise(r => setTimeout(r, 190)) }
  await new Promise(r => setTimeout(r, 800))
  const f = `/tmp/rv${shots.length}.png`
  await p.screenshot({ path: f, fullPage: true })
  // squeeze the full page into a readable column
  const out = `/tmp/rvc${shots.length}.png`
  execFileSync('magick', [f, '-resize', '400x', '-crop', '430x2600+0+0', '+repage', out])
  shots.push(out); console.log(path, 'h=' + H)
  await p.close()
}
execFileSync('magick', [...shots, '+append', '-background', '#222', process.argv[2].includes('local') ? '/tmp/review.png' : '/tmp/review.png'])
console.log(execFileSync('identify', ['-format', '%wx%h', '/tmp/review.png']).toString())
shots.forEach(f => rmSync(f, { force: true }))
await br.close()
