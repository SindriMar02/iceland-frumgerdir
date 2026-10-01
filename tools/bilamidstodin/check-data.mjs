import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { transform } from 'esbuild'
const source=await readFile(new URL('../../src/preview/bilamidstodin/data.ts',import.meta.url),'utf8')
const result=await transform(source,{loader:'ts',format:'esm'})
const {filterCars,queryMatches,mileage,fuelLabel}=await import('data:text/javascript;base64,'+Buffer.from(result.code).toString('base64'))
const cars=JSON.parse(await readFile(new URL('../../public/bilamidstodin/inventory.json',import.meta.url)))
assert.equal(new Set(cars.map(c=>c.id)).size,cars.length)
assert.equal(cars.length,795)
for(const c of cars){assert.equal(new URL(c.source).searchParams.get('bid'),'10');assert.ok(c.price>=0&&Number.isFinite(c.price));assert.ok(c.categories.length);assert.ok(["", "Sjálfskipting", "Beinskipting"].includes(c.transmission));assert.ok(c.photos.length);assert.ok(c.priceLabel.includes('án vsk')===c.priceNote.includes('Án vsk'))}
const boat=cars.find(c=>c.id==='226846');assert.equal(mileage(boat),'270 klst.');assert.ok(!filterCars([boat],new URLSearchParams('kmMax=1000000')).length)
const unknown=cars.find(c=>!c.price);assert.ok(!queryMatches(unknown,'undir 5 milljónum'));assert.ok(!filterCars([unknown],new URLSearchParams('max=5000000')).length)
for(const c of cars.filter(c=>c.fuel==='Rafmagn'))assert.equal(fuelLabel(c),'Rafmagn')
const outlander=cars.find(c=>c.id==='192619');assert.equal(fuelLabel(outlander),'Tengiltvinn');assert.ok(queryMatches(outlander,'tengiltvinn undir 2 milljónum'))
for(const c of filterCars(cars,new URLSearchParams('seats=7&max=5000000'))){assert.ok(c.seats>=7&&c.price>0&&c.price<=5000000)}
for(const c of filterCars(cars,new URLSearchParams('site=1'))){assert.ok(c.onSite)}
const sorted=filterCars(cars,new URLSearchParams('sort=price-up'));assert.ok(sorted.at(-1).price===0);assert.equal(sorted[0].price,Math.min(...cars.filter(c=>c.price).map(c=>c.price)))
console.log('PASS: 795 unique dealer listings; provenance, VAT notes, budget, plug-in, seats, on-site, sort and engine-hour checks')
