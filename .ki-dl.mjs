import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
const m = JSON.parse(readFileSync('_harvest/manifest.json', 'utf8'))
mkdirSync('_harvest/src', { recursive: true })
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'
let n = 0, bytes = 0
const log = []
for (const p of m) {
  const dir = '_harvest/src/' + p.slug.split('/')[1]
  mkdirSync(dir, { recursive: true })
  for (const u of p.urls) {
    const name = decodeURIComponent(u.split('/').pop())
    const dest = `${dir}/${name}`
    if (existsSync(dest)) continue
    try {
      const r = await fetch(u, { headers: { 'User-Agent': UA, Referer: 'https://katrinisfeld.is/' } })
      if (!r.ok) { log.push(`${r.status} ${u}`); continue }
      const b = Buffer.from(await r.arrayBuffer())
      writeFileSync(dest, b); n++; bytes += b.length
    } catch (e) { log.push('ERR ' + u) }
  }
  console.log(p.slug.padEnd(46), 'done')
}
console.log(`downloaded ${n} files, ${(bytes/1024/1024).toFixed(1)} MB`)
if (log.length) console.log('problems:\n' + log.slice(0, 12).join('\n'))
