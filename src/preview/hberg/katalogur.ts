import { LINUR } from './data'
import { PRODUCTS, type Product } from './vorur'

/* The catalogue is the product list, grouped by the carousel's lines. There is
   no second copy of any name, description or allergen to keep in step. */
export type KFlokkur = { s: string; t: string; items: Product[] }
export const KATALOGUR: KFlokkur[] = LINUR.map((l) => ({ s: l.s, t: l.t, items: PRODUCTS.filter(l.filter) }))
