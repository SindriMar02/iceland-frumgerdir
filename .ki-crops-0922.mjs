// How every photo frame on the site crops its photograph. usage: node .ki-crops-0922.mjs <outdir>
import http from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import puppeteer from 'puppeteer-core'
const out = process.argv[2]
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
const pg = await br.newPage()
await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
const pages = ['/', '/verkefni', '/verkefni/heimili', '/verkefni/badherbergi', '/verkefni/solvallagata', '/studioid']
const rows = []
for (const p of pages) {
  await pg.goto(base + p, { waitUntil: 'networkidle0' })
  await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } window.scrollTo(0, 0) })
  await new Promise((r) => setTimeout(r, 500))
  const data = await pg.evaluate(() => [...document.querySelectorAll('img')].map((img) => {
    const b = img.getBoundingClientRect()
    if (!b.width || !b.height) return null
    const na = img.naturalWidth / img.naturalHeight
    const ba = b.width / b.height
    const fit = getComputedStyle(img).objectFit
    const vis = fit === 'cover' ? (na < ba ? na / ba : ba / na) : 1
    const cls = (img.closest('figure,span,section,a,div')?.className || '').split(' ').filter((c) => c.startsWith('ki-')).slice(0, 2).join('.')
    return { src: img.currentSrc.split('/').pop().replace(/-\d+\.(avif|webp)$/, ''), box: `${Math.round(b.width)}x${Math.round(b.height)}`, na: +na.toFixed(2), ba: +ba.toFixed(2), vis: Math.round(vis * 100), fit, cls }
  }).filter(Boolean))
  for (const d of data) rows.push({ page: p, ...d })
}
const hard = rows.filter((r) => r.vis < 70).sort((a, b) => a.vis - b.vis)
console.log(`${rows.length} rendered photos; ${hard.length} show under 70% of the frame's photo\n`)
for (const r of hard) console.log(`${String(r.vis).padStart(3)}%  ${r.page.padEnd(24)} ${r.cls.padEnd(28)} box ${r.box.padEnd(10)} photo ${r.na} -> frame ${r.ba}  ${r.src}`)
const byCls = {}
for (const r of rows) { (byCls[r.cls] ||= []).push(r.vis) }
console.log('\nby frame class: median % visible')
for (const [c, v] of Object.entries(byCls)) { v.sort((a, b) => a - b); console.log(`  ${c.padEnd(30)} n=${String(v.length).padStart(3)}  median ${v[Math.floor(v.length / 2)]}%  worst ${v[0]}%`) }
await br.close(); srv.close()
