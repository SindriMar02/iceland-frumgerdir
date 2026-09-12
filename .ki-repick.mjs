/* replace one master with the best unused, perceptually distinct candidate
   from its own project's harvested pool */
import { readdirSync, readFileSync, copyFileSync, mkdtempSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
const [target, poolDir, excludeRe] = process.argv.slice(2)
const dir = 'public/katrinisfeld'
const tmp = mkdtempSync(tmpdir() + '/rp')
const fp = (path, tag) => { const o = `${tmp}/${tag}.gray`; execFileSync('magick', [path, '-colorspace', 'Gray', '-resize', '12x12!', '-depth', '8', `gray:${o}`]); return readFileSync(o) }
const delta = (a, b) => { let d = 0; for (let i = 0; i < a.length; i++) d += Math.abs(a[i] - b[i]); return d / a.length }
const existing = readdirSync(dir).filter(f => f.endsWith('-2400.jpg') && f !== target).map((f, i) => fp(`${dir}/${f}`, 'e' + i))
function sz(b){let i=2;while(i<b.length){if(b[i]!==0xff){i++;continue}const m=b[i+1];if(m>=0xc0&&m<=0xcf&&m!==0xc4&&m!==0xc8&&m!==0xcc)return[b.readUInt16BE(i+7),b.readUInt16BE(i+5)];i+=2+b.readUInt16BE(i+2)}return[0,0]}
const re = excludeRe ? new RegExp(excludeRe, 'i') : null
const cands = readdirSync(`_harvest/src/${poolDir}`).filter(f => /\.jpe?g$/i.test(f) && (!re || !re.test(f)))
  .map(f => { const b = readFileSync(`_harvest/src/${poolDir}/${f}`); const [w, h] = sz(b); return { f, w, h, px: w * h } })
  .filter(r => r.w >= 700).sort((a, b) => b.px - a.px)
let picked = null
for (const c of cands) {
  const s = fp(`_harvest/src/${poolDir}/${c.f}`, 'c')
  if (existing.every(e => delta(e, s) >= 6)) { picked = c; break }
}
rmSync(tmp, { recursive: true, force: true })
if (!picked) { console.log('no distinct candidate for', target); process.exit(1) }
copyFileSync(`_harvest/src/${poolDir}/${picked.f}`, `${dir}/${target}`)
console.log(`${target}  <-  ${picked.w}x${picked.h}  ${picked.f}`)
