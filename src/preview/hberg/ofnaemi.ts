import { ALLERGENS,PRODUCTS,type Allergen,type Product } from './vorur'
export const stutt=(a:Allergen)=>ALLERGENS.find(x=>x.id===a)?.is.toLowerCase() || a
export const langt=(a:Allergen)=>ALLERGENS.find(x=>x.id===a)?.is || a
export const genitive:Record<string,string>={nuts:'hneta',peanut:'jarðhneta',milk:'mjólkur',gluten:'glútens',soy:'soja',sesame:'sesams',sulphites:'súlfíta',mustard:'sinneps'}
export const joinWords=(words:string[], conjunction='og')=>words.length<2?words.join(''):words.slice(0,-1).join(', ')+` ${conjunction} `+words[words.length-1]
export const productCount=(n:number)=>`${n} ${n % 10 === 1 && n % 100 !== 11 ? 'vara' : 'vörur'}`
export function leita(selected:Allergen[]){const all=PRODUCTS.filter(p=>!p.tags.includes('annad'));return {henta:all.filter(p=>p.allergens?.some(a=>selected.includes(a))),an:all.filter(p=>p.allergens!==null&&!p.allergens.some(a=>selected.includes(a))),oljost:all.filter(p=>p.allergens===null)}}
export function ofnaemisLina(p:Product){return p.allergens?.length?`Inniheldur: ${p.allergens.map(langt).join(', ')}`:'Enginn af skráðum ofnæmisvöldum nefndur í innihaldslýsingu.'}
export const skilmali='Upplýsingarnar koma úr innihaldslýsingum H-Berg. Lestu alltaf á umbúðirnar. Hringdu í 565 6500 ef þú ert í vafa.'
export const peanutExplanation='Jarðhnetur eru belgjurtir og eru taldar sér. Hnetur og jarðhnetur eru tveir ólíkir ofnæmisvaldar.'
