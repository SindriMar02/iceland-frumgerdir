/** Shared, conservative parser. Units must be explicit; no energy conversion or imputation. */
export const fields = ['energyKj', 'energyKcal', 'fat', 'saturated', 'carbohydrate', 'sugars', 'fibre', 'protein', 'salt']
const labels = { fat: /^Fita$/i, saturated: /mettuð/i, carbohydrate: /^Kolvetni$/i, sugars: /sykurtegundir/i, fibre: /^Trefjar$/i, protein: /^Prótein$/i, salt: /^Salt$/i }
/** @param {{nutrition:string,nutritionRows:string[][]}} product */
export function normalizeNutrition(product) {
  /** @type {Record<string, number|null>} */
  const values = Object.fromEntries(fields.map(key => [key, null]))
  /** @type {string[]} */
  const unparseable = []
  const rows = product.nutritionRows
  const energy = rows.find(([label]) => /^Orka$/i.test(label))?.[1] ?? product.nutrition.match(/Orka\s+(.+?)(?=\s+Fita|$)/i)?.[1]
  if (energy) {
    // Split first so a unitless number before a slash cannot acquire its neighbour's unit.
    for (const part of energy.split('/')) {
      const match = part.trim().match(/^(\d+(?:[,.]\d+)?)\s*(kJ|kkal|kcal)$/i)
      if (match) values[/^kj$/i.test(match[2]) ? 'energyKj' : 'energyKcal'] = Number(match[1].replace(',', '.'))
      else unparseable.push(`Orka: ${part.trim()} (${energy})`)
    }
  }
  for (const [key, label] of Object.entries(labels)) {
    const row = rows.find(([name]) => label.test(name))
    const rawLabel = {fat:'Fita',saturated:'Þar af mettuð',carbohydrate:'Kolvetni',sugars:'Þar af sykurtegundir',fibre:'Trefjar',protein:'Prótein',salt:'Salt'}[key]
    const text = row?.[1] ?? product.nutrition.match(new RegExp(`${rawLabel}\\s+([^a-zþð]+g)`, 'i'))?.[1]
    if (text) {
      const match = text.trim().match(/^(\d+(?:[,.]\d+)?)\s*g$/i)
      if (match) values[key] = Number(match[1].replace(',', '.'))
      else unparseable.push(`${row?.[0] ?? rawLabel}: ${text}`)
    }
  }
  const { energyKj: kj, energyKcal: kcal } = values
  const energyDifference = kj !== null && kcal !== null ? (kcal === 0 ? (kj === 0 ? 0 : 1) : Math.abs(kj - kcal * 4.184) / (kcal * 4.184)) : null
  return { values, missing: fields.filter(key => values[key] === null), unparseable, noNutrition: !product.nutrition.trim() && !rows.length, energyDifference, inconsistent: energyDifference !== null && energyDifference > .05 }
}
