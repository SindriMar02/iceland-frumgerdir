import { PRODUCTS } from './vorur'
import { normalizeNutrition } from './nutrition-core.mjs'

export const NAERING = Object.fromEntries(PRODUCTS.map(v => [v.slug, normalizeNutrition(v).values]))
export const NUTRITION_COLUMNS = [
  { key: 'energyKj', title: 'Orka' },
  { key: 'fat', title: 'Fita' },
  { key: 'saturated', title: 'Mettuð' },
  { key: 'carbohydrate', title: 'Kolvetni' },
  { key: 'sugars', title: 'Sykur' },
  { key: 'fibre', title: 'Trefjar' },
  { key: 'protein', title: 'Prótein' },
  { key: 'salt', title: 'Salt' },
] as const
export type NutritionSort = typeof NUTRITION_COLUMNS[number]['key']
export const nutritionSort = (key: string | null): NutritionSort => NUTRITION_COLUMNS.find(c => c.key === key)?.key ?? 'energyKj'
// Comma decimals by hand: some browsers lack Icelandic locale data and would print points.
export const numberText = (value: number | null) => value === null ? 'Vantar' : String(Math.round(value * 1000) / 1000).replace('.', ',')
export function nutritionValue(slug: string, key: NutritionSort) {
  const n = NAERING[slug]
  return key === 'energyKj' ? `${n.energyKj === null ? 'Vantar' : `${numberText(n.energyKj)} kJ`} / ${n.energyKcal === null ? 'Vantar' : `${numberText(n.energyKcal)} kkal`}` : n[key] === null ? 'Vantar' : `${numberText(n[key])} g`
}
