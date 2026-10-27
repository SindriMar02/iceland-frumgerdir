import { ALLERGENS,PRODUCTS,type Allergen,type Product } from './vorur'
export const stutt=(a:Allergen)=>ALLERGENS.find(x=>x.id===a)!.is.toLowerCase()
export const langt=(a:Allergen)=>ALLERGENS.find(x=>x.id===a)!.is
export function leita(selected:Allergen[]){return {henta:PRODUCTS.filter(p=>!p.tags.includes('annad')&&p.allergens?.some(a=>selected.includes(a))),oljost:PRODUCTS.filter(p=>!p.tags.includes('annad')&&(p.allergens===null||p.unverified.some(a=>selected.includes(a))))}}
export function ofnaemisLina(p:Product){return p.allergens?.length?`Nefnt í innihaldi: ${p.allergens.map(stutt).join(', ')}`:'Óstaðfest, staðfest á umbúðum'}
export const skilmali='Upplýsingar úr innihaldslýsingum H-Berg. Ónefndur ofnæmisvaldur þýðir ekki að vara sé laus við hann. Staðfest á umbúðum.'
