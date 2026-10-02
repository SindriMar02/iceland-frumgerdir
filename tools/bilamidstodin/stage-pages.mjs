// Stage the standalone showroom without duplicating its full photo library.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import assert from 'node:assert/strict'
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..')
const output=resolve(root,process.argv[2]||'dist')
assert(['dist','dist-bilamidstodin-pages-check'].some(name=>output===join(root,name)),'Unexpected output directory')
const source=join(root,'dist-bilamidstodin')
assert(existsSync(join(source,'index.html')),'Build standalone Bílamiðstöðin first')
const sha=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim()
assert(/^[a-f0-9]{40}$/.test(sha))
const cars=JSON.parse(readFileSync(join(source,'inventory.json'),'utf8'))
assert.equal(cars.length,795)
assert.equal(new Set(cars.map(c=>c.id)).size,795)
const local=new Set([...cars.slice(0,12),...cars.filter(c=>['153689','407501','371481'].includes(c.id))].map(c=>c.photos[0]))
const destination=join(output,'preview/bilamidstodin')
// Only generated BM output; no other preview or public source is touched.
rmSync(destination,{recursive:true,force:true});mkdirSync(destination,{recursive:true})
cpSync(source,destination,{recursive:true,filter:path=>basename(path)!=='.gitignore'&&(!/^\d+-\d+\.webp$/.test(basename(path))||local.has('./'+basename(path)))})
let pinned=0
for(const car of cars){
 car.photos=car.photos.map(photo=>{
  if(!photo.startsWith('./'))return photo
  assert(/^\.\/\d+-\d+\.webp$/.test(photo),'Unexpected photo path')
  assert(existsSync(join(root,'public/bilamidstodin',photo)),`Missing source photo ${photo}`)
  if(local.has(photo)){assert(existsSync(join(destination,photo)));return photo}
  pinned++;return `https://raw.githubusercontent.com/SindriMar02/iceland-frumgerdir/${sha}/public/bilamidstodin/${photo.slice(2)}`
 })
}
writeFileSync(join(destination,'inventory.json'),JSON.stringify(cars))
writeFileSync(join(destination,'build.json'),JSON.stringify({commit:sha,route:'/preview/bilamidstodin/',vehicles:cars.length,localPhotos:local.size,pinnedPhotos:pinned}))
rmSync(join(output,'bilamidstodin'),{recursive:true,force:true})
const html=readFileSync(join(destination,'index.html'),'utf8')
assert(html.includes('noindex,nofollow'))
assert(html.includes('rel="icon"'))
for(const [,asset] of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g))assert(existsSync(join(destination,asset)),`Missing asset ${asset}`)
for(const file of ['logo.png','robots.txt','fonts/clash-display/css/clash-display.css','fonts/clash-display/fonts/ClashDisplay-Variable.woff2','fonts/cabinet-grotesk/css/cabinet-grotesk.css','fonts/cabinet-grotesk/fonts/CabinetGrotesk-Variable.woff2'])assert(existsSync(join(destination,file)))
if(output.endsWith('dist-bilamidstodin-pages-check'))writeFileSync(join(output,'.gitignore'),'*\n')
console.log(`Bílamiðstöðin staged: ${cars.length} vehicles, ${local.size} local photos, ${pinned} immutable repository photos; commit ${sha.slice(0,8)}.`)
