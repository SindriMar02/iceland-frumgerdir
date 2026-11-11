import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
const path = fileURLToPath(new URL('./vorur.ts', import.meta.url))
const source = fs.readFileSync(path, 'utf8')
export const products = JSON.parse(source.split('export const PRODUCTS:Product[]=')[1].split('\nexport const ALLERGENS=')[0])
// All 14 EU groups. Match inflected Icelandic stems, not the generic word hnetur
// inside jarðhnetur. Coconut is not a tree nut.
const rules = {
  nuts: /möndl|heslihnet|kasjú|pekan|pistas|valhnet|brasilí|makadam|macadam/i,
  peanut: /jarðhnet/i,
  milk: /mjólk|mysu|jógúrt|kasein|laktós|rjóma|smjörduft/i,
  gluten: /hveiti|bygg|rúg|hafr|hafra|glúten|spelt/i,
  soy: /soja/i, sesame: /sesam/i, sulphites: /súlfít|sulfit|brennisteinsdíoxíð/i,
  egg: /egg/i, fish: /fisk|lax|þorsk|ansjós/i, crustaceans: /krabba|rækj|humar/i,
  molluscs: /lindýr|krækling|smokkfisk|hörpuskel/i, celery: /sellerí/i,
  mustard: /sinnep/i, lupin: /lúpín/i,
}
// Unicode word boundaries are needed for Icelandic letters at either end.
export const capitalWords = text => [...new Set(text.match(/(?<!\p{L})[\p{Lu}]{2,}(?!\p{L})/gu) || [])]
export const audit = products.map(p => {
  const words = capitalWords(p.ingredients)
  const declared = Object.keys(rules).filter(id => words.some(w => rules[id].test(w)))
  // Also inspect the actual ingredient phrase: single ingredient products often
  // use title case. Do not inspect recipe/editorial text appended after it.
  const phrase = p.ingredients.split('Hnetusmjör Uppskriftir')[0]
  const ingredientIds = Object.keys(rules).filter(id => rules[id].test(phrase))
  const nameIds = Object.keys(rules).filter(id => rules[id].test(p.name.is))
  const expected = [...new Set([...declared, ...ingredientIds, ...nameIds])]
  const before = p.allergens || []
  return { slug: p.slug, name: p.name.is, capitals: words, before, expected,
    missing: expected.filter(id => !before.includes(id)), extra: before.filter(id => !expected.includes(id)) }
})
if (process.argv.includes('--json')) console.log(JSON.stringify(audit, null, 2))
else {
  const mismatches = audit.filter(r => r.missing.length || r.extra.length)
  for (const r of mismatches) console.log(`${r.name}: missing [${r.missing}], extra [${r.extra}]`)
  console.log(`${products.length} products audited against 14 EU allergen groups. ${mismatches.length} mismatches.`)
  if (mismatches.length) process.exitCode = 1
}
