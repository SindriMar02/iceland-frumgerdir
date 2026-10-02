import { ALLERGENS, PRODUCTS, type Allergen, type Product } from './vorur'

/* The allergen helpers. Nothing is guessed: a product with no ingredient label
   on Kólus' site has `allergens: null`, is never counted as free of anything,
   and sits in its own group ("sjá umbúðir"). */

/** "Hveiti (glúten)" -> "hveiti" */
export const stutt = (a: Allergen) => ALLERGENS.find((x) => x.id === a)!.is.split('(')[0].trim().toLowerCase()
export const langt = (a: Allergen) => ALLERGENS.find((x) => x.id === a)!.is

export function leita(avoid: Allergen[]): { henta: Product[]; oljost: Product[] } {
  const henta: Product[] = []
  const oljost: Product[] = []
  for (const p of PRODUCTS) {
    if (!avoid.length) continue
    if (p.allergens === null) oljost.push(p)
    else if (!p.allergens.some((a) => avoid.includes(a))) henta.push(p)
  }
  return { henta, oljost }
}

/** one line: what the label says, or that there is no label */
export function ofnaemisLina(p: Product): string {
  if (p.allergens === null) return 'Ofnæmisvaldar: sjá umbúðir'
  if (!p.allergens.length) return 'Engir ofnæmisvaldar feitletraðir á miða'
  return `Inniheldur ${p.allergens.map(stutt).join(', ')}`
}

export const skilmali =
  'Frumgerð: ofnæmisvaldar eru lesnir af miðum á sambo.eu.com og Kólus þarf að staðfesta þá. Lestu alltaf umbúðirnar, einkum ef um ofnæmi er að ræða.'
