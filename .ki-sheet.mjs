import { readdirSync, mkdirSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
mkdirSync('_harvest/sheets', { recursive: true })
const dir = 'public/katrinisfeld'
const prefixes = process.argv.slice(2)
for (const pre of prefixes) {
  const files = readdirSync(dir).filter(f => f.startsWith(pre + '-') && f.endsWith('-2400.jpg'))
    .sort((a, b) => (+a.match(/-(\d+)-2400/)[1]) - (+b.match(/-(\d+)-2400/)[1]))
  if (!files.length) { console.log(pre, 'none'); continue }
  const cells = []
  files.forEach((f, i) => {
    const c = `/tmp/c${i}.png`
    execFileSync('magick', [`${dir}/${f}`, '-resize', '430x430', '-background', '#151515', '-gravity', 'center', '-extent', '440x440', c])
    cells.push(c)
  })
  const rows = []
  for (let i = 0; i < cells.length; i += 4) {
    const r = `/tmp/r${i}.png`
    execFileSync('magick', [...cells.slice(i, i + 4), '+append', r]); rows.push(r)
  }
  const out = `_harvest/sheets/${pre}.png`
  execFileSync('magick', [...rows, '-background', '#151515', '-gravity', 'west', '-append', out])
  const size = execFileSync('identify', ['-format', '%wx%h', out]).toString()
  console.log(`${pre.padEnd(18)} ${files.length} imgs  ${size}  (${files.map(f=>f.match(/-(\d+)-2400/)[1]).join(',')})`)
  cells.concat(rows).forEach(f => rmSync(f, { force: true }))
}
