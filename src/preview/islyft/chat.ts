import { CONTACT, DEPTS, LINKS, MODELS, USED, fullName } from './data'

/* Íslyft, 28.10.2026. Deterministic answers from company.json, CONTENT.md,
 * models.json and stock.json in _docs/islyft-harvest-2026-10-28.
 * The snapshot cannot establish current availability or unpublished terms.
 * No network, generated facts, opening-hours clock or new-machine prices.
 */
type Card = { title: string; rows: { k: string; v: string; total?: boolean }[]; cta?: { label: string; href: string } }
export type Answer = { reply?: string; tool?: string; card?: Card; refused?: boolean; chips?: string[] }
type Msg = { role: 'user' | 'assistant'; content: string }
export const GREETING = 'Halló! Ég get aðstoðað með tæki, Sölutorg, heimilisföng og símanúmer deilda Íslyft. Hvað viltu vita?'
export const CHIPS = ['Hvar eruð þið?', 'Eruð þið með Manitou?', 'Notaðir lyftarar', 'Varahlutir']
export const fold = (s: string) => s.toLowerCase().replace(/ð/g, 'd').replace(/þ/g, 'th').replace(/æ/g, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9/ ]+/g, ' ').replace(/\s+/g, ' ').trim()
const sales = DEPTS.find((d) => d.key === 'sala')!
const refer = (): Answer => ({ reply: 'Ég hef ekki staðfestar upplýsingar um það. Hringdu í söludeild 514 1610.', card: { title: 'Söludeild', rows: [{ k: 'Sími', v: sales.phone }], cta: { label: 'Hringja í söludeild', href: `tel:${sales.tel}` } }, chips: CHIPS })
const quote = (key?: string): Answer => {
  const m = MODELS.find((x) => x.key === key)
  return { reply: m ? `Þú getur valið ${fullName(m)} í tilboðsforminu. Tækið fylgir með þegar þú opnar formið. Formið er sýnishorn; hringdu í söludeild 514 1610 til að fá tilboð.` : 'Veldu tæki í tilboðsforminu og skráðu nafn og síma. Formið er sýnishorn; hringdu í söludeild 514 1610 til að fá tilboð.', card: { title: m ? fullName(m) : 'Fáðu tilboð', rows: [{ k: 'Söludeild', v: sales.phone }], cta: { label: 'Fáðu tilboð', href: m ? `#reynsluakstur?taeki=${encodeURIComponent(m.key)}` : '#reynsluakstur' } } }
}
export function answer(history: Msg[]): Answer {
  /* Prototype: the assistant is a design only, every question gets this line. */
  if (history.length) return { reply: 'Þú þarft að kaupa vefsíðuna af Sindra fyrir svarið.' }
  const q = fold([...history].reverse().find((m) => m.role === 'user')?.content ?? '')
  if (/opnun|opid|opnar|lokar|hours|open|leig|rent|abyrgd|warranty|fjarmogn|finance|\blan|neyd|emergency|afhending|lager|kostar|verd|price|cost/.test(q)) return refer()
  if (/hvar|heimilis|stadset|address|where/.test(q)) return { reply: 'Íslyft er að Vesturvör 32, 200 Kópavogi og Lækjarvöllum 6, 604 Akureyri.', card: { title: 'Heimilisföng', rows: CONTACT.addresses.map((v) => ({ k: 'Íslyft', v })), cta: { label: 'Kort að Vesturvör', href: LINKS.map } } }
  if (/varahlut|parts/.test(q)) {
    const d = DEPTS.find((x) => x.key === 'varahlutir')!
    return { reply: `Varahlutadeild Íslyft: ${d.phone}. Netfang: ${d.email}.`, card: { title: d.name, rows: [{ k: 'Sími', v: d.phone }, { k: 'Netfang', v: d.email }], cta: { label: 'Hringja í varahlutadeild', href: `tel:${d.tel}` } } }
  }
  if (/verkstaed|vidgerd|workshop|service/.test(q)) {
    const d = DEPTS.find((x) => x.key === 'verkstaedi')!
    return { reply: `Hafðu samband við verkstæði Íslyft í síma ${d.phone}.`, card: { title: d.name, rows: [{ k: 'Sími', v: d.phone }], cta: { label: 'Hringja á verkstæði', href: `tel:${d.tel}` } } }
  }
  if (/notad|notud|solutorg|used/.test(q)) return { reply: 'Á Sölutorgi Íslyft eru notuð tæki, meðal annars Linde E14 frá 2019 og Linde E18PH 386 frá 2008. Þetta er afrit frá 28. október 2026; staðfestu framboð hjá söludeild 514 1610.', card: { title: 'Sölutorg', rows: USED.map((u) => ({ k: u.name, v: String(u.year ?? '') })), cta: { label: 'Skoða Sölutorg', href: LINKS.used } } }
  if (/sima|simi|hring|netfang|deild|phone|contact/.test(q)) return { reply: `Aðalnúmer Íslyft er ${CONTACT.phone}. Netfang: ${CONTACT.email}.`, card: { title: 'Deildir', rows: DEPTS.map((d) => ({ k: d.name, v: d.phone })) } }
  const named = MODELS.find((m) => q.includes(fold(m.name)) || q.includes(fold(m.name.replace(m.brand, '').trim())))
  if (named) return quote(named.key)
  if (/tilbod|quote/.test(q)) {
    const previous = [...history].reverse().filter((m) => m.role === 'user').flatMap((m) => MODELS.filter((x) => fold(m.content).includes(fold(x.name))))[0]
    return quote(previous?.key)
  }
  const brand = [...new Set(MODELS.map((m) => m.brand))].find((b) => q.includes(fold(b)))
  if (brand) return { reply: `Já, Íslyft er með ${brand}. Hér eru valdar gerðir úr vörulistanum. Hringdu í söludeild 514 1610 til að fá tilboð.`, card: { title: brand, rows: MODELS.filter((m) => m.brand === brand).map((m) => ({ k: fullName(m), v: m.kind })), cta: { label: 'Skoða tæki', href: '#urval' } }, chips: MODELS.filter((m) => m.brand === brand).slice(0, 3).map(fullName) }
  if (/merki|umbod|sami|sennebogen|tegund|flok|seljid|lyftar|taeki/.test(q)) return { reply: 'Íslyft býður meðal annars lyftara, skotbómulyftara, vinnulyftur, dráttarvélar, liðléttinga og sópa. Umboðin eru Linde, Manitou, John Deere, Avant, Combilift, Dulevo, Konecranes, SAMI, EvoQuip, Dinos, Goupil og Sennebogen.', card: { title: 'Tæki', rows: [], cta: { label: 'Skoða úrval', href: LINKS.newCars } }, chips: CHIPS }
  if (/saga|steinbock|stofn/.test(q)) return { reply: 'Steinbock þjónustan var stofnuð árið 1972. Íslyft var síðar stofnað utan um innflutning á nýjum lyfturum og öðrum tækjum.', card: { title: 'Sagan', rows: [], cta: { label: 'Saga félagsins', href: LINKS.um } } }
  if (/^(hae|hallo|sael|godan dag)/.test(q)) return { reply: GREETING, chips: CHIPS }
  if (/^takk/.test(q)) return { reply: 'Ekkert að þakka.', chips: CHIPS }
  return refer()
}
