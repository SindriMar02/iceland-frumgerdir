import { readFileSync } from 'node:fs'
import { transform } from 'esbuild'
import assert from 'node:assert/strict'
const {code}=await transform(readFileSync('src/preview/bilagalleri/data.ts','utf8'),{loader:'ts',format:'esm',define:{'import.meta.env.BASE_URL':'"./"'}})
const {filterCars,queryMatches,mileage,number,price}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))
const cars=JSON.parse(readFileSync('public/bilagalleri/inventory.json'))
const tests=[]
function test(name,fn){fn();tests.push(name)}
const f=q=>filterCars(cars,new URLSearchParams(q))
test('Icelandic price separators do not depend on installed locales',()=>{assert.equal(price(9490000),'9.490.000 kr.');assert.equal(number(4.2),'4,2')})
test('67 unique vehicles, real source links and complete facts',()=>{assert.equal(cars.length,67);assert.equal(new Set(cars.map(c=>c.id)).size,67);for(const c of cars){assert(c.price>0);assert(c.photos.length>0);assert(c.source.startsWith('https://www.bilagalleri.is/CarDetails.aspx'));assert(c.fuel);}})
test('jeppi recognises actual SUV categories',()=>{const r=f('q=jeppi');assert(r.length>10);assert(r.every(c=>c.type==='Jeppar'))})
test('seven seats and AWD combine',()=>{const r=f('q=7+sæta+4x4');assert(r.length>3);assert(r.every(c=>c.seats>=7&&c.specs.Drif==='Fjórhjóladrif'))})
test('electric below 5 million excludes hybrids and expensive cars',()=>{const r=f('q=rafmagn+undir+5+milljónum');assert(r.length>3);assert(r.every(c=>c.fuel==='Rafmagn'&&c.price<5e6))})
test('diacritics fold without broad false matches',()=>{assert.equal(f('q=dísel').length,f('q=disel').length);assert(f('q=xyznotacar').length===0)})
test('each combined range predicate remains true',()=>{const r=f('type=Jeppar&min=2000000&max=5000000&yearMin=2018&yearMax=2023&kmMax=120000');assert(r.length>0);assert(r.every(c=>c.price>=2e6&&c.price<=5e6&&c.year>=2018&&c.year<=2023&&c.km<=120000))})
test('contradictory ranges give zero results',()=>assert.equal(f('min=9000000&max=1000000').length,0))
test('model resets are possible with scoped make options',()=>{const c=f('make=Toyota&model=RAV4');assert.equal(c.length,1)})
test('price sort and mileage sort are monotonic',()=>{for(const [sort,prop] of [['price-up','price'],['km','km']]){const r=f('sort='+sort).filter(c=>prop!=='km'||mileage(c)!=='Ekki tilgreint');assert(r.every((c,i)=>!i||c[prop]>=r[i-1][prop]))}})
test('offer is sourced from detail marker',()=>{const r=f('offer=1');assert(r.length>10);assert(r.every(c=>c.items.includes('Flott verð')))})
test('VAT and cash/trade conditions survive preparation',()=>{assert(cars.find(c=>c.id==='173016').priceNote.includes('vsk'));assert(cars.find(c=>c.id==='526687').priceNote.includes('8.290.000'))})
test('missing bicycle year/mileage is not rendered as zero',()=>{const c=cars.find(c=>c.id==='145264');assert.equal(c.year,0);assert.equal(mileage(c),'Ekki tilgreint')})
test('tow hook requires equipment, not towing capacity alone',()=>{assert(!f('tow=1').some(c=>c.id==='259362'))})
test('URL filter round trip matches same IDs',()=>{const p=new URLSearchParams('q=7 sæta&sort=price-up');assert.deepEqual(filterCars(cars,p).map(c=>c.id),filterCars(cars,new URLSearchParams(p.toString())).map(c=>c.id))})
test('unknown terms are never silently discarded',()=>assert(!queryMatches(cars[0],'nissan unicorn')))
test('exact ISK and decimal million queries agree',()=>{assert.deepEqual(f('q=undir+4.790.000+kr').map(c=>c.id),f('q=undir+4,79+milljónum').map(c=>c.id));assert(!f('q=undir+4.790.000+kr').some(c=>c.price===4790000))})
console.log(JSON.stringify({passed:tests.length,tests},null,2))
