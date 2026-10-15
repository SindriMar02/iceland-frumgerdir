import { CONTACT, FAQ, FLUTES, PRODUCTS, SHOP_CATS, findFits, kr, productBySlug } from './data'

/*
 * The assistant answers only from what this site says (their Kassamál rules and the catalogue sample).
 * It never invents a price for a custom box: that is a request to the factory.
 */
export const GREETING = 'Góðan dag. Ég get fundið kassa sem passar, útskýrt bylgjur og liti, eða sagt þér hvernig áskrift virkar. Hvað ertu að pakka?'
export const CHIPS = ['Hvaða kassi passar fyrir 300×200×100 mm?', 'Hver er munurinn á E- og B-bylgju?', 'Hvað kosta sendingarkassar?', 'Hvernig virkar áskrift?']

const norm = (s: string) => s.toLowerCase().replace(/[.,?!]/g, ' ')
const DIM = /(\d{1,4}(?:[.,]\d+)?)\s*[x×]\s*(\d{1,4}(?:[.,]\d+)?)\s*[x×]\s*(\d{1,4}(?:[.,]\d+)?)\s*(cm|mm)?/i

export function answer(q: string): string {
  const t = norm(q)
  const d = q.match(DIM)
  if (d) {
    const f = d[4]?.toLowerCase() === 'cm' ? 10 : 1
    const [l, b, h] = [d[1], d[2], d[3]].map((x) => Math.round(Number(x.replace(',', '.')) * f))
    const fits = findFits(l, b, h, 3)
    if (!fits.length) return `Enginn lagerkassi í úrtakinu tekur ${l} × ${b} × ${h} mm. Við sérframleiðum þá stærð: opnaðu Kassamál, sláðu inn málin og sendu beiðni; Bjarni Geir svarar með verði.`
    return `Þessir passa fyrir ${l} × ${b} × ${h} mm (innri mál): ${fits.map((f) => `${f.p.name} (${kr(f.p.price)}${f.p.pack ? `, ${f.p.pack} stk.` : ''})`).join('; ')}. Þú setur þá á listann undir Kassamál.`
  }
  if (/bylgj|sterk|þykk|e-|b-|c-/.test(t)) return `${FLUTES.map((f) => `${f.label}: ${f.line}`).join('. ')}. Því þykkari sem bylgjan er, því burðarmeiri er kassinn.`
  if (/brún|hvít|lit/.test(t)) return FAQ[2].a
  if (/fefco|0201|lagerkass/.test(t)) return FAQ[3].a
  if (/prent|merk|lógó|logo/.test(t)) return FAQ[4].a
  if (/áskrift|askrift|reglulega|mánaðar/.test(t)) return FAQ[5].a
  if (/mæl|mál |innri|ytri|lengd|breidd|hæð/.test(t)) return FAQ[0].a
  if (/opið|opnun|klukkan|hvenær/.test(t)) return `Opið ${CONTACT.hours.toLowerCase()}, ${CONTACT.street}, ${CONTACT.town}. Sími ${CONTACT.phone}.`
  if (/hvar|heimilisfang|staðsetn|hafnarf/.test(t)) return `Verksmiðjan og afgreiðslan eru að ${CONTACT.street}, ${CONTACT.town}. Opið ${CONTACT.hours.toLowerCase()}.`
  for (const c of SHOP_CATS) {
    if (t.includes(c.label.toLowerCase().split(' ')[0].replace(/ar$/, ''))) {
      const ps = PRODUCTS.filter((p) => p.cat === c.label).slice(0, 3)
      return `${c.label}: ${c.full} ${c.full === 1 ? 'vara' : 'vörur'} í vefversluninni. Til dæmis ${ps.map((p) => `${p.name} á ${kr(p.price)}`).join(', ')}. Opnaðu Verslun og veldu ${c.label} í síunni.`
    }
  }
  const hit = PRODUCTS.find((p) => t.includes(p.name.toLowerCase().split(' ')[0]) && t.length > 6 && p.name.toLowerCase().split(' ')[0].length > 4)
  if (hit) { const p = productBySlug(hit.slug)!; return `${p.name}: ${kr(p.price)}${p.pack ? ` fyrir ${p.pack} stk.` : ''}, vörunúmer ${p.sku || 'skráð í afgreiðslu'}. Á listann í versluninni.` }
  if (/verð|kost|hvað kostar/.test(t)) return 'Verð lagerkassanna standa í vefversluninni. Sérframleiddir kassar fá verðtilboð: sendu málin, magnið og bylgjuna undir Kassamál.'
  return `Þetta get ég ekki svarað héðan. Hringdu í ${CONTACT.phone} eða sendu á ${CONTACT.email}; opið ${CONTACT.hoursShort.toLowerCase()}.`
}
