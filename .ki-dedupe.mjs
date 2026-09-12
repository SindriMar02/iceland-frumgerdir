/* Perceptual, not byte-wise. Her sampler pages reuse shots from the named
   projects, and an upscaled master and a freshly downloaded original of the
   SAME photograph differ in every byte — a hash sees two files, a visitor
   sees the same picture twice on two pages. 12x12 grayscale signature, mean
   absolute delta, same method PHOTO-SOURCES.md was built with. */
import { readdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
const dir = 'public/katrinisfeld'
const files = readdirSync(dir).filter(f => f.endsWith('-2400.jpg')).sort()
const tmp = mkdtempSync(tmpdir() + '/fp')
const sig = {}
for (const f of files) {
  const out = `${tmp}/${f}.gray`
  execFileSync('magick', [`${dir}/${f}`, '-colorspace', 'Gray', '-resize', '12x12!', '-depth', '8', `gray:${out}`])
  sig[f] = readFileSync(out)
}
const pairs = []
for (let i = 0; i < files.length; i++) for (let j = i + 1; j < files.length; j++) {
  const a = sig[files[i]], b = sig[files[j]]
  let d = 0; for (let k = 0; k < a.length; k++) d += Math.abs(a[k] - b[k])
  d /= a.length
  if (d < 6) pairs.push([files[i], files[j], d.toFixed(1)])
}
rmSync(tmp, { recursive: true, force: true })
for (const [a, b, d] of pairs) console.log(`delta ${d}  ${a}  ==  ${b}`)
console.log(`${files.length} masters, ${pairs.length} perceptual duplicates`)
