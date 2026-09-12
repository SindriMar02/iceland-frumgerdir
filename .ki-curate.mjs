import { readdirSync, readFileSync, copyFileSync, existsSync } from 'node:fs'
function jpegSize(b){let i=2;while(i<b.length){if(b[i]!==0xff){i++;continue}const m=b[i+1];if(m>=0xc0&&m<=0xcf&&m!==0xc4&&m!==0xc8&&m!==0xcc)return[b.readUInt16BE(i+7),b.readUInt16BE(i+5)];i+=2+b.readUInt16BE(i+2)}return[0,0]}
const held = new Set([...readFileSync('PHOTO-SOURCES.md','utf8').matchAll(/^\| ([a-z0-9-]+) \| ([^|]+) \|/gm)].map(m=>m[2].trim().split('/').pop()))
// dir -> id prefix, and how many masters already exist under that prefix
const MAP = {
  'nybyggt-hus-i-suluhofda':'p-suluhofda', 'sumarhus-fljotshlid':'p-fljotshlid', 'alfheimar':'p-alfheimar',
  'badherbergi':'p-badherbergi', 'barnaherbergi':'p-barnaherbergi', 'eldhusrymi':'p-eldhusrymi',
  'eldhusrymi-i-skandinaviskum-stil':'p-skandinaviskt', 'eldhusrymi-i-skuggahverfi':'p-skuggahverfi',
  'honnunar-studio':'p-studio', 'hus-i-gardabae':'p-gardabaer', 'freyja-gistiheimili':'p-freyja',
  'freyja-luxusibud':'p-freyjalux', 'svala-apartments':'p-svala', 'solvallagata':'p-solvallagata',
  'old-charm-apt':'p-oldcharm', 'skrifstofurymi':'p-skrifstofa', 'tannlaeknastofa':'p-tannlaeknar',
  'fjallalind':'p-fjallalind', 'hus-i-kopavogi':'p-kopavogur', 'laugalaekur':'p-laugalaekur',
  'sumarhus-olfusi':'p-olfus', 'hotel-hekla':'p-hekla', 'stemning':'p-stemning', 'fjolmidlar':'p-fjolmidlar',
}
const CAP = 8
const SKIP = new Set(['fjolmidlar'])
const plan = []
for (const [dir, prefix] of Object.entries(MAP)) {
  if (SKIP.has(dir)) continue
  const files = readdirSync(`_harvest/src/${dir}`).filter(f=>/\.jpe?g$/i.test(f))
  const rows = files.map(f => { const [w,h] = jpegSize(readFileSync(`_harvest/src/${dir}/${f}`)); return { f, w, h, px: w*h, have: held.has(f) } })
  const fresh = rows.filter(r => !r.have && r.w >= 500).sort((a,b) => b.px - a.px)
  // next free index under this prefix
  let n = 0
  while (existsSync(`public/katrinisfeld/${prefix}-${n}-2400.jpg`) || existsSync(`public/katrinisfeld/${prefix === 's' || prefix === 'f' ? 'zzz' : prefix}-${n}-2400.jpg`)) n++
  const LEGACY = { 'p-suluhofda': 's-', 'p-fljotshlid': 'f-' }[prefix]
  const existing = readdirSync('public/katrinisfeld').filter(x => (x.startsWith(prefix + '-') || (LEGACY && x.startsWith(LEGACY))) && x.endsWith('-2400.jpg')).length
  const room = Math.max(0, CAP - existing)
  plan.push({ dir, prefix, total: files.length, alreadyHeld: rows.filter(r=>r.have).length, existing, take: fresh.slice(0, room), skippedSmall: rows.filter(r=>!r.have && r.w<500).length })
}
for (const p of plan) console.log(`${p.dir.padEnd(34)} have:${String(p.existing).padStart(2)}  new:${String(p.take.length).padStart(2)}  (pool ${p.total}, tiny skipped ${p.skippedSmall})`)
console.log('\ntotal new masters:', plan.reduce((a,p)=>a+p.take.length,0))
import { writeFileSync } from 'node:fs'
writeFileSync('_harvest/plan.json', JSON.stringify(plan, null, 1))
if (process.argv.includes('--write')) {
  let n = 0
  for (const p of plan) {
    let i = 0
    for (const t of p.take) {
      while (existsSync(`public/katrinisfeld/${p.prefix}-${i}-2400.jpg`)) i++
      copyFileSync(`_harvest/src/${p.dir}/${t.f}`, `public/katrinisfeld/${p.prefix}-${i}-2400.jpg`)
      console.log(`${p.prefix}-${i}`.padEnd(22) + `${t.w}x${t.h}`.padEnd(11) + t.f)
      i++; n++
    }
  }
  console.log('wrote', n, 'masters')
}
