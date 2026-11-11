import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { normalizeNutrition } from './nutrition-core.mjs'
// Parse only the JSON literal. Never import vorur.ts or evaluate browser code.
const source = fs.readFileSync(fileURLToPath(new URL('./vorur.ts', import.meta.url)), 'utf8')
const products = JSON.parse(source.split('export const PRODUCTS:Product[]=')[1].split('\nexport const ALLERGENS=')[0])
export const audit = products.map(p => ({slug:p.slug, name:p.name.is, ...normalizeNutrition(p)}))
if (process.argv.includes('--json')) console.log(JSON.stringify(audit, null, 2))
else {
  console.log('| Vara | Vantar | Óskýrt | Orkumunur yfir 5% |')
  console.log('| --- | --- | --- | --- |')
  for (const r of audit.filter(r => r.missing.length || r.unparseable.length || r.inconsistent)) {
    console.log(`| ${r.name} | ${r.noNutrition ? 'Allt næringargildi. ' : ''}${r.missing.join(', ')} | ${r.unparseable.join('; ')} | ${r.inconsistent ? `${(r.energyDifference * 100).toFixed(2)}% (${r.values.energyKj} kJ / ${r.values.energyKcal} kkal)` : ''} |`)
  }
  console.log(`${audit.length} products audited. ${audit.filter(r=>r.noNutrition).length} without nutrition; ${audit.filter(r=>r.missing.length).length} with missing fields; ${audit.filter(r=>r.unparseable.length).length} with unparseable values; ${audit.filter(r=>r.inconsistent).length} energy inconsistencies. Missing values remain null (Vantar).`)
}
