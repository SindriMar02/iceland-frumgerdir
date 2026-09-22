// The register hover: is a photograph ready the instant the pointer lands?
import http from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import puppeteer from 'puppeteer-core'
const root = 'dist-katrin'
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' }
const srv = http.createServer((q, r) => {
  let f = join(root, decodeURIComponent(q.url.split('?')[0]))
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html')
  if (!existsSync(f)) { r.writeHead(404); return r.end() }
  r.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); r.end(readFileSync(f))
}).listen(0)
const base = `http://127.0.0.1:${srv.address().port}`
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const path of ['/', '/verkefni']) {
  const pg = await br.newPage()
  await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  // a slow connection is where an on-demand fetch shows as an empty frame
  const throttle = !process.argv.includes('--fast')
  const cdp = await pg.target().createCDPSession()
  await cdp.send('Network.enable')
  if (throttle) await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 300, downloadThroughput: 400 * 1024 / 8, uploadThroughput: 200 * 1024 / 8 })
  await pg.goto(base + path, { waitUntil: 'domcontentloaded' })
  // the hover only exists once the page has hydrated; on a throttled
  // connection that is seconds, which is exactly when a visitor is reading
  await pg.waitForFunction(() => document.querySelector('.ki-peek') !== null, { timeout: 60000 })
  await pg.evaluate(async () => {
    document.querySelector('.ki-skra-list')?.scrollIntoView({ block: 'center', behavior: 'instant' })
    await new Promise((r) => setTimeout(r, 1500))
  })
  const rows = await pg.$$('.ki-skra-row a[data-preview]')
  const misses = []
  let instant = 0
  for (const [i, row] of rows.entries()) {
    await row.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await new Promise((r) => setTimeout(r, 60))
    const box = await row.boundingBox()
    if (!box) continue
    await pg.mouse.move(box.x + 12, box.y + box.height / 2)
    // no wait at all: what a visitor sees the instant the pointer lands
    const state = await pg.evaluate(() => {
      const on = document.querySelector('.ki-peek-slot[data-on] img')
      const peek = document.querySelector('.ki-peek')
      return {
        mounted: document.querySelectorAll('.ki-peek-slot').length,
        ready: !!on && on.complete && on.naturalWidth > 0,
        shown: !!peek && peek.hasAttribute('data-on'),
        src: on ? on.currentSrc.split('/').pop() : null,
      }
    })
    if (state.shown && !state.ready) misses.push(`row ${i}: EMPTY FRAME shown with no photograph`)
    if (!state.shown && state.ready) misses.push(`row ${i}: photograph ready but frame hidden`)
    if (state.ready && state.shown) instant++
  }
  const mounted = await pg.evaluate(() => {
    const imgs = [...document.querySelectorAll('.ki-peek img')]
    return { total: imgs.length, loaded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length }
  })
  console.log(`${path}: ${rows.length} rows hovered fast (${throttle ? 'throttled' : 'normal'} link) · ${instant} showed instantly · ${mounted.loaded}/${mounted.total} loaded · ${misses.length ? 'PROBLEMS:' : 'never an empty frame'}`)
  misses.forEach((m) => console.log('   ' + m))
  await pg.close()
}
await br.close(); srv.close()
