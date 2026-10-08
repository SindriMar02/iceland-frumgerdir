export type Car = {
 id: string; make: string; model: string; name: string; trim: string; price: number; priceLabel: string; priceNote: string;
 registration: string; year: number; km: number; fuel: string; transmission: string; seats: number;
 location: string; onSite: boolean; plugIn: boolean; hours: number | null; categories: string[]; items: string[]; specs: Record<string,string>; groups: string[][]; photos: string[];
 source: string; inquiry: string; offer: boolean; type: string; notes: string[]; highlight: string;
}
// Pin separators because some embedded browsers omit Icelandic ICU locale data.
export const number = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).formatToParts(n).map(part => part.type === 'group' ? '.' : part.type === 'decimal' ? ',' : part.value).join('')
export const price = (n: number) => `${number(n)} kr.`
export const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ð/g,'d').replace(/þ/g,'th').replace(/æ/g,'ae')
export const asset = (s: string) => s.startsWith('http') ? s : `${import.meta.env.BASE_URL}${s.replace(/^\.\//,'')}`
export const keys = ['q','make','model','type','fuel','min','max','yearMin','yearMax','kmMax','gear','drive','seats','offer','tow','site'] as const
export type FilterKey = typeof keys[number]
export const filterNames: Record<FilterKey,string> = {q:'Leit',make:'Tegund',model:'Gerð',type:'Flokkur',fuel:'Orkugjafi',min:'Verð frá',max:'Verð að',yearMin:'Árgerð frá',yearMax:'Árgerð til',kmMax:'Akstur að',gear:'Skipting',drive:'Drif',seats:'Sæti',offer:'Tilboðsverð',tow:'Dráttarkrókur',site:'Á staðnum'}
export function queryMatches(car: Car, raw: string) {
 let q = fold(raw).trim()
 const conditions: boolean[] = []
 q=q.replace(/(undir|ad|upp ad)\s+(\d[\d.,]*)\s*(milljon\w*|m(?:\.|\b)|kr\.?)/g,(_,op:string,n:string,u:string)=>{const value=u.startsWith('m')?Number(n.replace(',','.'))*1e6:Number(n.replace(/\./g,'').replace(',','.'));conditions.push(car.price>0&&(op==='undir'?car.price<value:car.price<=value));return ' '})
 q=q.replace(/(?:7\s*(?:saeta|manna)|sjo\s*saeta)/g,()=>{conditions.push(car.seats>=7);return ' '})
 q=q.replace(/4\s*[x×]\s*4|fjorhjoladrif/g,()=>{conditions.push(car.specs.Drif==='Fjórhjóladrif');return ' '})
 q=q.replace(/jepp\w*/g,()=>{conditions.push(car.categories.includes('Jeppar'));return ' '})
 q=q.replace(/rafbil\w*/g,()=>{conditions.push(car.fuel==='Rafmagn'&&car.type!=='Hjól');return ' '})
 q=q.replace(/rafmagn/g,()=>{conditions.push(car.fuel==='Rafmagn');return ' '})
 q=q.replace(/tengiltvinn\w*/g,()=>{conditions.push(car.plugIn&&car.fuel!=='Rafmagn');return ' '})
 const text=fold([car.make,car.model,car.type,car.fuel,car.transmission,car.year,car.specs.Drif,...car.groups.flat()].join(' '))
 return conditions.every(Boolean) && q.split(/\s+/).filter(Boolean).every(word=>text.includes(word))
}
export function filterCars(cars: Car[], p: URLSearchParams) {
 return cars.filter(c=>{
  if(!queryMatches(c,p.get('q')||''))return false
  for(const k of ['make','type','fuel'] as const)if(p.get(k)&&(k==='type'?!c.categories.includes(p.get(k)!):(k==='fuel'?fuelLabel(c)!==p.get(k):c[k]!==p.get(k))))return false
  if(p.get('model')&&c.name!==p.get('model'))return false
  if(p.get('gear')&&c.transmission!==p.get('gear'))return false
  if(p.get('drive')&&c.specs.Drif!==p.get('drive'))return false
  if(p.get('seats')&&c.seats<Number(p.get('seats')))return false
  if(p.get('offer')==='1'&&!c.offer)return false
  if(p.get('tow')==='1'&&!c.groups.flat().some(x=>/^Dráttarkrókur|^Dráttarbeisli$/.test(x)))return false
  if(p.get('site')==='1'&&!c.onSite)return false
  if((p.get('min')||p.get('max'))&&!c.price)return false
  if(p.get('min')&&c.price<Number(p.get('min')))return false
  if(p.get('max')&&c.price>Number(p.get('max')))return false
  if(p.get('yearMin')&&c.year<Number(p.get('yearMin')))return false
  if(p.get('yearMax')&&(!c.year||c.year>Number(p.get('yearMax'))))return false
  if(p.get('kmMax')&&(!c.items.some(i=>/^Akstur \d.*km/.test(i))||c.km>Number(p.get('kmMax'))))return false
  return true
 }).sort((a,b)=>p.get('sort')==='price-up'?(a.price||Infinity)-(b.price||Infinity):p.get('sort')==='price-down'?(b.price||-Infinity)-(a.price||-Infinity):p.get('sort')==='km'?(a.items.some(i=>/^Akstur \d.*km/.test(i))?a.km:Infinity)-(b.items.some(i=>/^Akstur \d.*km/.test(i))?b.km:Infinity):p.get('sort')==='year'?b.year-a.year:0)
}
export const carTitle = (c: Car) => `${c.make} ${c.name}`
export const mileage = (c: Car) => c.hours!==null?`${number(c.hours)} klst.`:c.items.some(i=>/^Akstur \d.*km/.test(i))?`${number(c.km)} km`:'Ekki tilgreint'
export const fuelLabel = (c:Car) => c.plugIn&&c.fuel!=='Rafmagn'?'Tengiltvinn':c.fuel==='Bensín / Rafmagn'?'Bensín / rafmagn':c.fuel||'Ekki tilgreint'
export const driveLabel = (c:Car) => c.specs.Drif==='Fjórhjóladrif'?'Fjórhjóladrif':c.specs.Drif||'Ekki tilgreint'
export const cashURL = 'https://www.bilamidstodin.is/kaupum-bila'
export const sellURL = 'https://www.bilamidstodin.is/RegisterCar.aspx'
