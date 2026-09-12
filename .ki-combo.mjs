import { readdirSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const dir = 'public/katrinisfeld'
const out = process.argv[2], prefixes = process.argv.slice(3)
const files = []
for (const pre of prefixes) files.push(...readdirSync(dir).filter(f => f.startsWith(pre + '-') && f.endsWith('-2400.jpg'))
  .sort((a,b)=>(+a.match(/-(\d+)-2400/)[1])-(+b.match(/-(\d+)-2400/)[1])))
const cells = files.map((f, i) => { const c = `/tmp/k${i}.png`
  execFileSync('magick', [`${dir}/${f}`, '-resize', '290x290', '-background', '#151515', '-gravity', 'center', '-extent', '296x296', c]); return c })
const rows = []
for (let i = 0; i < cells.length; i += 6) { const r = `/tmp/kr${i}.png`; execFileSync('magick', [...cells.slice(i, i+6), '+append', r]); rows.push(r) }
execFileSync('magick', [...rows, '-background', '#151515', '-gravity', 'west', '-append', out])
console.log(execFileSync('identify', ['-format', '%wx%h', out]).toString(), files.map(f=>f.replace('-2400.jpg','')).join(' '))
cells.concat(rows).forEach(f => rmSync(f, { force: true }))
