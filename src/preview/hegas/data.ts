import type { PreviewCompany } from '../company-types'

/* HEGAS ehf. preview (the Set system re-aimed). Every fact below was read from hegas.is and verslun.hegas.is on
   2026-10-09 (harvest + MANIFEST: _docs/hegas-harvest-2026-10-09/). The catalogue is a representative SAMPLE (108 of
   1.152 shop products, plus surfaces and Lamello tools from hegas.is pages), loaded at runtime from
   public/hegas/catalog.json, built by _docs/hegas-harvest-2026-10-09/build_catalog.py from the public Store API. */

const BASE = import.meta.env.BASE_URL
export const img = (name: string, w: 800 | 1600 = 1600) => `${BASE}hegas/img/${name}-${w}.webp`
export const productImg = (id: number) => `${BASE}hegas/p/${id}.webp`
export const staffImg = (n: number) => `${BASE}hegas/staff/s${n}.webp`

/* The site is Icelandic only, like hegas.is. The two-language plumbing of the Set system stays (T.en = T.is), but no
   route ever resolves to 'en' and no control offers it. */
export type Lang = 'is' | 'en'
export type View = 'home' | 'family' | 'product' | 'brand' | 'list' | 'review'
export type Route = { lang: Lang; view: View; param?: string }

const ROOT = '/preview/hegas'
export const SEG = {
  is: { family: 'vorur', product: 'vara', brand: 'merki', list: 'efnislisti', review: 'yfirferd' },
  en: { family: 'vorur', product: 'vara', brand: 'merki', list: 'efnislisti', review: 'yfirferd' },
} as const

export const path = (_lang: Lang, view: View, param?: string) => {
  if (view === 'home') return ROOT
  const seg = SEG.is[view]
  return param ? `${ROOT}/${seg}/${param}` : `${ROOT}/${seg}`
}

export function parseRoute(pathname: string): Route {
  const rest = pathname.replace(/\/+$/, '').slice(ROOT.length).replace(/^\/+/, '')
  const lang: Lang = 'is'
  const [seg, param] = rest.split('/')
  if (!seg) return { lang, view: 'home' }
  const s = SEG.is
  if (seg === s.family && param) return { lang, view: 'family', param: decodeURIComponent(param) }
  if (seg === s.product && param) return { lang, view: 'product', param: decodeURIComponent(param) }
  if (seg === s.brand && param) return { lang, view: 'brand', param: decodeURIComponent(param) }
  if (seg === s.list) return { lang, view: 'list' }
  if (seg === s.review) return { lang, view: 'review' }
  return { lang, view: 'home' }
}

/* ------------------------------------------------------------------ eight families, one place each (hegas.is has two
   sorting pages and four menus pointing at overlapping lists; here every product lives in exactly one family) */
export type Family = {
  n: number; slug: string; is: string; en: string
  desc: { is: string; en: string }
  shop: string; shopCount: number; enquiry?: boolean
}
const SHOP = 'https://verslun.hegas.is'
const fam = (n: number, slug: string, name: string, desc: string, shop: string, shopCount: number, enquiry = false): Family =>
  ({ n, slug, is: name, en: name, desc: { is: desc, en: desc }, shop, shopCount, enquiry })
export const FAMILIES: Family[] = [
  fam(1, 'yfirbordsefni-og-plotur', 'Yfirborðsefni og plötur',
    'HPL, FENIX, TUET, melamín, MDF, spónlagt efni og gegnheilt plötuefni fyrir innréttinga- og húsgagnaframleiðslu, borðplötur, hurðir og aðra sérsmíði.',
    'https://hegas.is/yfirbordsefni-og-plotur/', 0, true),
  fam(2, 'holdur-og-hnudar', 'Höldur og hnúðar',
    'Höldur, hnúðar og grip frá THEOFILS, Hettich og GTV, í messing, svörtu, stáli og króm.',
    `${SHOP}/product-category/holdur-hnudar-og-grip/`, 169),
  fam(3, 'skuffur-og-flokkun', 'Skúffur, innvols og flokkun',
    'Hnífaparabakkar, skúffubrautir, mottuefni, innvols í botnskápa og sorpflokkun í skápa og skúffur frá Hettich, IMA og Pelly.',
    `${SHOP}/product-category/sorpflokkun-ruslafotur/`, 101),
  fam(4, 'fataskapar-og-hillur', 'Fataskápar og hillur',
    'Vírkörfur, uppistöður, hilluberar, fataslár og fatahengislyftur frá Elfa, Pelly, IMA, Emuca og GDK.',
    `${SHOP}/product-category/virkorfur-og-tengdar-vorur/`, 143),
  fam(5, 'lamir-faetur-og-hurdir', 'Lamir, fætur og hurðir',
    'Lamir með mjúklokun, Häfele AXILO 78 sökkulkerfið, borðfætur, hurðapumpur, hurðastopparar og hurðarhúnar.',
    `${SHOP}/product-category/572/`, 115),
  fam(6, 'innrettingaljos', 'Innréttingaljós',
    'LED ljós, ljósaborðar og spennubreytar fyrir skápa, hillur og innréttingar, meðal annars EcoSpot 58 frá Halemeier.',
    `${SHOP}/product-category/4950/`, 16),
  fam(7, 'lim-oliur-og-vidhald', 'Lím, olíur og viðhald',
    'UNIKA hreinsi- og viðhaldsvörur, BAO viðgerðarvax, olíur og vax fyrir við og skurðarbretti.',
    `${SHOP}/product-category/5310/`, 135),
  fam(8, 'thvingur-og-verkfaeri', 'Þvingur og verkfæri',
    'Þvingur og klemmur frá BESSEY, meðal annars einnar handar þvingur og 360° snúningsbúnaður, og handverkfæri frá Lamello.',
    `${SHOP}/product-category/170/`, 33),
]
/* the three that open each family row */
export const FEATURED: Record<number, string[]> = {
  1: ['FENIX NTM', 'TUET 4645', 'Aranya MDF 19'],
  2: ['3310913213sp', '2890366', '3311482408sp'],
  3: ['24975760', '2497932', '45924372900'],
  4: ['249580', '9373', '5520155180'],
  5: ['5763776430', '571010041152', '19008003'],
  6: ['403215000', '405603913', '403058601'],
  7: ['53203', '97053', '53202'],
  8: ['1897', '1847', 'Zeta P2'],
}
/* X-WP-Total of the public Store API product listing, read 2026-10-09 */
export const SHOP_TOTAL = 1152
export const familyBySlug = (slug: string) => FAMILIES.find((f) => f.slug === slug)
export const pad2 = (n: number) => String(n).padStart(2, '0')
export const fmtKr = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} kr.`

/* ------------------------------------------------------------------ catalogue (runtime) */
export type Product = {
  id: number; slug: string; name: string; sku: string; fam: number; sub: string; leaf: string; brand: string
  img: boolean; white?: boolean; attrs: [string, string][]; url: string
  price: number | null; regular: number | null; sale: boolean; stock: string; short: string
}
export const priceOf = (p: Pick<Product, 'price'>) => (p.price === null ? 'Verð á fyrirspurn' : fmtKr(p.price))
export type Catalog = {
  harvested: string; source: string; shopTotal: number
  families: { n: number; slug: string; is: string; subs: [string, number][] }[]
  products: Product[]
}
let catalogPromise: Promise<Catalog> | null = null
export function loadCatalog(): Promise<Catalog> {
  if (!catalogPromise) {
    catalogPromise = fetch(`${BASE}hegas/catalog.json`).then((r) => {
      if (!r.ok) throw new Error(`catalog ${r.status}`)
      return r.json() as Promise<Catalog>
    })
    catalogPromise.catch(() => { catalogPromise = null })
  }
  return catalogPromise
}

/* Icelandic collation by hand: Intl ships no Icelandic in several browsers (memory: intl-has-no-icelandic). */
const ALPHA = 'aábcdðeéfghiíjklmnoóprstuúvwxyýzþæö'
const rank = (ch: string) => { const i = ALPHA.indexOf(ch); return i < 0 ? 100 + ch.charCodeAt(0) : i }
export function isCompare(a: string, b: string): number {
  const x = a.toLowerCase(), y = b.toLowerCase()
  let i = 0, j = 0
  while (i < x.length && j < y.length) {
    const dx = /\d/.test(x[i]), dy = /\d/.test(y[j])
    if (dx && dy) {
      let ei = i, ej = j
      while (ei < x.length && /\d/.test(x[ei])) ei++
      while (ej < y.length && /\d/.test(y[ej])) ej++
      const d = parseInt(x.slice(i, ei), 10) - parseInt(y.slice(j, ej), 10)
      if (d) return d
      i = ei; j = ej; continue
    }
    if (x[i] !== y[j]) return rank(x[i]) - rank(y[j])
    i++; j++
  }
  return (x.length - i) - (y.length - j)
}
export const firstLetter = (s: string) => {
  const c = s.trim().charAt(0).toUpperCase()
  return /\d/.test(c) ? '0–9' : c
}

/* ------------------------------------------------------------------ brands */
export const brandSlug = (b: string) => b.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
type Plate = { key: string; name: string; line: string; img: string; alt: string; to: 'brand' | 'machines' }
/* the six-plate selector (from the Vatt build): the six brands hegas.is gives their own pages and news */
export const PLATES: Plate[] = [
  { key: 'Hettich', name: 'Hettich', line: 'AvanTech YOU skúffur, lamir, flokkun og höldur', img: 'furnspin', alt: 'Stofa með skáp á FurnSpin snúningseiningu frá Hettich', to: 'brand' },
  { key: 'Häfele', name: 'Häfele', line: 'AXILO 78: sökkulfætur stilltir framan frá skápnum', img: 'axilo-2', alt: 'Maður krýpur við neðri skáp og stillir sökkulfót framan frá með löngu verkfæri', to: 'brand' },
  { key: 'FENIX', name: 'FENIX', line: 'Matt yfirborð sem heldur frá sér fingraförum', img: 'fenix-app', alt: 'Eldhús með möttum FENIX framhliðum og borðplötu', to: 'brand' },
  { key: 'Arpa', name: 'Arpa · TUET', line: 'HPL með samlitum kjarna og bárað TUET yfirborð', img: 'tuet-kitchen', alt: 'Eldhúsinnrétting með dökkum, báruðum TUET framhliðum', to: 'brand' },
  { key: 'BESSEY', name: 'BESSEY', line: 'Þvingur og klemmur, líka einnar handar', img: 'bessey-kre', alt: 'Rauð og svört BESSEY samhliða þvinga lögð á viðarplötu', to: 'brand' },
  { key: 'Biesse', name: 'Biesse', line: 'HEGAS er fulltrúi Biesse iðnaðarvéla á Íslandi', img: 'rover-a', alt: 'Biesse Rover A tölvustýrður yfirfræsari', to: 'machines' },
]
/* their words for the brand page intro, with the hegas.is page it comes from */
export const BRAND_INFO: Record<string, { body: string; page?: [string, string]; contact?: string }> = {
  Hettich: {
    body: 'AvanTech YOU skúffukerfið frá Hettich er með beinar og þunnar hliðar, aðeins 13 mm, sem gefur betri nýtingu og meira pláss í hverri skúffu. Kerfið hefur hlotið „Good Design Award 2021“, Interzum verðlaunin og „Vara ársins 2022“ í Þýskalandi. HEGAS selur líka lamir, flokkunarlausnir, höldur og FurnSpin frá Hettich.',
    page: ['AvanTech YOU á hegas.is', 'https://hegas.is/avantech-skuffukerfi/'],
  },
  'Häfele': {
    body: 'AXILO 78 frá Häfele er sökkulstillikerfi sem auðveldar afréttingu eldhúsinnréttinga, fataskápa og annarra skápa. Með sérstöku stilliverkfæri er hægt að ná til sökkulfótanna framan frá skápnum, líka að aftari fótum og fótum undir hornskápum. AXILO PRO má nota handvirkt eða með rafmagnsverkfæri.',
    page: ['AXILO 78 á hegas.is', 'https://hegas.is/hafele-axilo-78-sokkulstillikerfi-fyrir-innrettingar/'],
  },
  FENIX: {
    body: 'FENIX er yfirborðsefni fyrir lóðrétta og lárétta fleti. Efnið heldur frá sér fingraförum, er mjúkt viðkomu, með mattri áferð og auðvelt í þrifum. Það er notað á borðplötur, veggi, innréttingar og húsgögn.',
    page: ['FENIX á hegas.is', 'https://hegas.is/fenix-yfirbordsefni/'], contact: 'egill',
  },
  Arpa: {
    body: 'Arpa Industriale framleiðir HPL á Ítalíu. Colour Matching Core plöturnar eru með samlitum kjarna í 4200 × 1300 mm; 12 mm á lager og 2 til 10 mm í sérpöntun. TUET er djúp, báruð áferð frá Arpa fyrir framhliðar og veggklæðningar.',
    page: ['TUET á hegas.is', 'https://hegas.is/tuet-plotur/'], contact: 'egill',
  },
  BESSEY: {
    body: 'Hjá HEGAS fást þvingur og klemmur frá BESSEY. Meðal nýjunga eru einnar handar þvingur og 360° snúningsbúnaður sem auðveldar vinnu.',
    page: ['Þvingur og klemmur á hegas.is', 'https://hegas.is/thvingur-og-klemmur/'],
  },
  Lamello: {
    body: 'Lamello kexin hafa löngu fest sig í sessi meðal fagmanna. Zeta P2 tekur úr fyrir Clamex P, Tenso P og Divario P samsetningarfittings.',
    page: ['Lamello á hegas.is', 'https://hegas.is/lamello-handverkfaeri/'],
  },
  Unilin: {
    body: 'Master Oak frá Unilin sameinar áferð náttúrulegrar eikar og yfirborðstækni: þrefalt rispu- og höggþol, fáanleg sem melamínborin spónaplata og HPL, í 12 decor útfærslum.',
    page: ['Master Oak á hegas.is', 'https://hegas.is/master-oak-natturuleg-eik-litum/'], contact: 'egill',
  },
}
/* brands HEGAS sells that have no product in the sample: a link to their hegas.is page instead */
export const MORE_BRANDS: [string, string][] = [
  ['Akzo Nobel', 'https://hegas.is/lakk/'],
  ['TAWI lyftibúnaður', 'https://hegas.is/lyftibunadur/'],
  ['H+H SYSTEM', 'https://hegas.is/hh-system-skipulag-fyrir-heilbrigdisgeirann/'],
  ['SOUKUP', 'https://hegas.is/velar-verkfaeri/nyjar-velar/'],
]

/* ------------------------------------------------------------------ machines: hegas.is/velar-verkfaeri, 2026-10-09 */
export const NEW_MACHINES = [
  { name: 'Skipper V31', kind: 'Tölvustýrð borvél með fræsara', img: 'skipper', body: 'Skipper V31 er vinsæl og öflug tölvustýrð borvél með fræsara.' },
  { name: 'Selco WN 2', kind: 'Liggjandi plötusög', img: 'selco', body: 'SELCO WN 2 er vinsæl og öflug tölvustýrð liggjandi plötusög.' },
  { name: 'Rover A', kind: 'Tölvustýrður yfirfræsari', img: 'rover-a', body: 'ROVER A 12/15, ROVER A SMART og ROVER A 14/16 eru vinsælir og öflugir tölvustýrðir yfirfræsarar.' },
  { name: 'Akron 1300', kind: 'Kantlímingarvél', img: 'akron', body: 'AKRON 1300 er vinsæl og öflug kantlímingarvél.' },
  { name: 'Opera 5', kind: 'Breiðbandspússvél', img: 'opera5', body: 'OPERA 5 er vinsæl og öflug breiðbandspússvél. VIET S1 og VIET S2 njóta vinsælda í flokki þykktarpússvéla.' },
]
/* used machines with a photo and a listed price (30 on the list in all) */
export const USED = [
  { name: 'Viet Challenge 223', price: 950000, img: 'used-viet', alt: 'Viet Challenge 223 pússvél á verkstæðisgólfi' },
  { name: 'Italpress spónlagningarpressa (2002)', price: 800000, img: 'used-italpress', alt: 'Italpress spónlagningarpressa í vinnslusal' },
  { name: 'Kantlímingarvél Biesse Akron 435A K', price: 500000, img: 'used-akron', alt: 'Notuð Biesse Akron kantlímingarvél' },
  { name: 'Vicmarc VL175SH tré rennibekkur', price: 400000, img: 'used-vicmarc', alt: 'Vicmarc rennibekkur fyrir tré' },
  { name: 'Kantpússivél', price: 300000, img: 'used-kantpuss', alt: 'Kantpússivél með færibandi' },
  { name: 'Grass línuborvél', price: 300000, img: 'used-grass', alt: 'Græn Grass línuborvél' },
  { name: 'Vitap Alfa 21 borvél með hallandi haus', price: 250000, img: 'used-vitap', alt: 'Vitap Alfa 21 borvél' },
  { name: 'Centauro 600 NL bandsög', price: 100000, img: 'used-centauro', alt: 'Centauro 600 NL bandsög' },
  { name: 'Langbandslípivél', price: 50000, img: 'used-langband', alt: 'Löng bandslípivél í vinnslusal' },
  { name: 'Lakkrekki', price: 35000, img: 'used-ott', alt: 'Lakkrekki á hjólum með mörgum hillum' },
]
export const USED_TOTAL = 30

/* ------------------------------------------------------------------ news: the five latest posts on hegas.is (+ one spare) */
export const NEWS = [
  { date: '2026-09-22', t: 'Lýsing sem hluti af innréttingunni', b: 'Rétt staðsett ljós geta aukið notagildi, dregið fram efni og form og orðið hluti af innréttingunni.', img: 'channelline', alt: 'Opnar hillur í fataskáp lýstar upp með innfelldum LED ljósum', url: 'https://hegas.is/lysing-sem-hluti-af-innrettingunni/' },
  { date: '2026-09-18', t: 'Stilltu sökkulfætur án þess að skríða undir skápinn', b: 'Häfele AXILO 78 einfaldar verkið: aftari fætur stilltir framan frá.', img: 'axilo-2', alt: 'Maður stillir sökkulfót eldhússkáps með AXILO verkfæri', url: 'https://hegas.is/stilltu-sokkulfaetur-an-thess-ad-skrida-undir-skapinn/' },
  { date: '2026-09-10', t: 'Skúffur skipta máli: AvanTech YOU með lýsingu', b: 'Hönnun skúffa, skipulag og lýsing hafa áhrif á það hvernig innréttingin nýtist.', img: 'avantech-crop', alt: 'Dökk AvanTech YOU skúffa með lýsingu og textanum Skúffur skipta máli', url: 'https://hegas.is/skuffur-skipta-mali-avantech-you-med-lysingu/' },
  { date: '2026-07-10', t: 'Perurnar alltaf að fara?', b: 'EcoSpot 58 frá Halemeier kemur í stað gömlu halogen ljósanna sem hitna og kalla á peruskipti.', img: 'led-bad', alt: 'Baðherbergisinnrétting úr við með LED ljósum undir spegli og skáp', url: 'https://hegas.is/perurnar-alltaf-ad-fara/' },
  { date: '2026-07-02', t: 'EcoSpot 58: stílhrein LED lýsing fyrir innréttingar', b: 'Innfellt 12V LED ljósasett fyrir skápa, hillur, eldhúsinnréttingar og húsgögn.', img: 'ecospot', alt: 'Kassi með Halemeier EcoSpot 58 LED ljósasetti', url: 'https://hegas.is/ecospot-58-stilhrein-led-lysing-fyrir-innrettingar/' },
  { date: '2026-06-05', t: 'Pelly Mesh vírkörfur komnar í netverslun', b: 'Körfurnar henta í fataskápa, skápainnréttingar og þar sem gott skipulag skiptir máli.', img: 'mesh', alt: 'Nærmynd af grárri Pelly Mesh vírkörfu með skilrúmi', url: 'https://hegas.is/pelly-mesh-virkorfur-komnar-i-netverslun-hegas/' },
]
const MONTHS = ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember']
export const isDate = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return `${d}. ${MONTHS[m - 1]} ${y}` }

/* ------------------------------------------------------------------ staff: hegas.is/um-hegas/starfsfolk, order as listed */
export type Person = { n: number; name: string; role: string; direct?: string; gsm?: string; email: string; group: 'stjorn' | 'sala' | 'lager' }
export const STAFF: Person[] = [
  { n: 1, name: 'Axel Eyjólfsson', role: 'framkvæmdastjóri', direct: '580 6702', gsm: '860 1122', email: 'axel@hegas.is', group: 'stjorn' },
  { n: 5, name: 'Karlotta Jóna Finnsdóttir', role: 'fjármálastjóri', direct: '580 6709', email: 'karlotta@hegas.is', group: 'stjorn' },
  { n: 4, name: 'Gísli Páll Reynisson', role: 'tæknilegur ráðgjafi og kerfisstjóri', direct: '580 6705', gsm: '860 1125', email: 'gisli@hegas.is', group: 'stjorn' },
  { n: 2, name: 'Dagnis Lazdins', role: 'tæknimaður', gsm: '860 1130', email: 'dagnis@hegas.is', group: 'stjorn' },
  { n: 3, name: 'Egill Hjartarson', role: 'sölufulltrúi', direct: '580 6712', gsm: '843 3067', email: 'egill@hegas.is', group: 'sala' },
  { n: 8, name: 'Sveinbjörn Leósson', role: 'sölufulltrúi', direct: '580 6703', gsm: '766 3636', email: 'bjorn@hegas.is', group: 'sala' },
  { n: 6, name: 'Andri Ásgrímsson', role: 'sölufulltrúi', direct: '580 6700', email: 'sala@hegas.is', group: 'sala' },
  { n: 7, name: 'Gunnar Árnason', role: 'sölufulltrúi', direct: '580 6700', email: 'sala@hegas.is', group: 'sala' },
  { n: 9, name: 'Andrés Jónsson', role: 'lagermaður', direct: '580 6700', email: 'lager@hegas.is', group: 'lager' },
  { n: 10, name: 'Arnar Gústafsson', role: 'bílstjóri og lagermaður', direct: '580 6700', email: 'lager@hegas.is', group: 'lager' },
  { n: 11, name: 'Ísak Orri Axelsson', role: 'lagermaður', direct: '580 6700', email: 'lager@hegas.is', group: 'lager' },
  { n: 12, name: 'Ottó Arason', role: 'lagermaður', direct: '580 6700', email: 'lager@hegas.is', group: 'lager' },
  { n: 13, name: 'Alexander Þór Ólafsson', role: 'lagermaður', direct: '580 6700', email: 'lager@hegas.is', group: 'lager' },
]
export const STAFF_GROUPS: [Person['group'], string][] = [['stjorn', 'Stjórnun og tækni'], ['sala', 'Sala og ráðgjöf'], ['lager', 'Lager og afgreiðsla']]
export const tel = (n: string) => `tel:+354${n.replace(/\D/g, '')}`

/* ------------------------------------------------------------------ material list units */
export type Unit = 'stk' | 'pk' | 'plotur' | 'm'
export const UNITS: Unit[] = ['stk', 'pk', 'plotur', 'm']
const UL: Record<Unit, string> = { stk: 'stykki', pk: 'pakkar', plotur: 'plötur', m: 'metrar' }
export const UNIT_LABEL: Record<Lang, Record<Unit, string>> = { is: UL, en: UL }
export function defaultUnit(p: Pick<Product, 'name' | 'fam'>): Unit {
  if (p.fam === 1 && !/fræsivél|kexvél/i.test(p.name)) return 'plotur'
  if (/\(\d+ (stykki|stk)\.?\)|í pakka|sett\b/i.test(p.name)) return 'pk'
  return 'stk'
}

/* the demonstration list: one kitchen, hardware + surface + light from across the catalogue (all real items) */
export const DEMO_LIST = [
  { sku: 'TUET 4645', qty: 4, unit: 'plotur' as Unit },
  { sku: '3311482408sp', qty: 14, unit: 'stk' as Unit },
  { sku: '571010041152', qty: 6, unit: 'pk' as Unit },
  { sku: '5763776430', qty: 1, unit: 'stk' as Unit },
  { sku: '24975760', qty: 1, unit: 'stk' as Unit },
  { sku: '405603913', qty: 2, unit: 'stk' as Unit },
]

/* ------------------------------------------------------------------ contacts (hegas.is/hafa-samband + opnunartími) */
export const CONTACT = {
  phone: '580 6700', tel: '+3545806700', sales: 'sala@hegas.is', general: 'hegas@hegas.is',
  street: 'Smiðjuvegi 1', town: '200 Kópavogur',
  hours: [['Mánudaga til fimmtudaga', '8:00 til 17:00'], ['Föstudaga', '8:00 til 16:00']] as [string, string][],
  shop: 'https://verslun.hegas.is/',
  map: 'https://www.openstreetmap.org/search?query=Smi%C3%B0juvegur%201%2C%20200%20K%C3%B3pavogur',
}

/* ------------------------------------------------------------------ copy */
type Acc = { t: string; b: string; link?: [string, string] }
type Rail = { y: string; t: string; b: string; img?: string; cap?: string; alt?: string; links?: [string, string][] }

const IS = {
  htmlLang: 'is',
  title: 'HEGAS | Allt fyrir tréiðnaðinn',
  description: 'HEGAS á Smiðjuvegi 1 í Kópavogi: hráefni, íhlutir, yfirborðsefni, vélar og verkfæri fyrir tréiðnaðinn. Vörulisti með verðum úr netverslun og efnislisti fyrir verkið sem fer í einu lagi til söludeildar. Frumgerð að nýjum vef.',
  skip: 'Fara í efni',
  nav: { products: 'Vörur', brands: 'Merki', machines: 'Vélar', about: 'Um HEGAS', news: 'Fréttir', staff: 'Starfsfólk', story: 'Sagan', contact: 'Hafa samband', how: 'Þjónusta', shop: 'Netverslun', list: 'Efnislisti', menu: 'Valmynd', close: 'Loka', lang: '', langShort: '' },
  loader: 'HEGAS',
  hero: {
    kicker: 'Smiðjuvegi 1 · Kópavogi · síðan 1988',
    h1: 'Allt fyrir tréiðnaðinn',
    sub: 'Hráefni, íhlutir, yfirborðsefni, vélar og verkfæri fyrir innréttinga- og húsgagnasmiði. Safnaðu öllu sem verkið þarf á einn efnislista og sendu hann söludeild í einu lagi.',
    cta: 'Skoða vörur', cta2: 'Opna efnislista',
    cap: 'Innbyggð lýsing í hillum, skápum og yfir eyju. Úr fréttinni „Lýsing sem hluti af innréttingunni“, september 2026.',
    alt: 'Dökkgrænt eldhús með upplýstum glerskápum, hillum yfir eyjunni og ljósaborða undir borðplötu',
  },
  cat: {
    title: 'Vörur',
    lead: (n: number, total: string) => `Sýnishorn úr vöruúrvali HEGAS: ${n} vörur með vörunúmerum og verðum eins og þau standa í netversluninni, auk yfirborðsefna sem fást á fyrirspurn. Í netversluninni eru ${total} vörur.`,
    filter: 'Vöruflokkur', all: 'Allir flokkar', brand: 'Merki', allBrands: 'Öll merki', search: 'Leita að vöru eða vörunúmeri…', searchShort: 'Leita',
    az: 'A–Ö', grid: 'Flokkar', viewAll: 'Skoða allt', view: 'Skoða', add: 'Á lista', added: 'Á listanum', addToList: 'Setja á efnislista',
    inSample: (a: number, b: string) => `${a} í sýnishorni · ${b} í netverslun`,
    inSampleEnquiry: (a: number) => `${a} í sýnishorni · verð á fyrirspurn`,
    none: 'Engin vara fannst. Prófaðu annað orð, vörunúmer eða merki.',
    loading: 'Sæki vörulista…', error: 'Vörulistinn náðist ekki. Endurhlaðið síðuna.',
    pdf: 'Í netverslun', handbook: '', sku: 'Vörunr.', noImg: 'Mynd vantar',
    enquiry: 'Verð á fyrirspurn', shopPrice: 'Verð í netverslun', sale: 'Tilboð', was: 'Áður',
    results: (n: number) => `${n} ${n === 1 ? 'vara' : 'vörur'}`,
    jump: 'Hoppa á staf', sub: 'Undirflokkur', allSubs: 'Allir undirflokkar',
    page: 'Síða', prev: 'Fyrri síða', next: 'Næsta síða',
    back: 'Allar vörur',
  },
  brands: {
    title: 'Merki',
    lead: 'HEGAS flytur inn frá framleiðendum sem fagmenn þekkja. Veldu merki til að sjá vörurnar.',
    note: 'Fleiri merki hjá HEGAS:',
    open: 'Skoða', products: (n: number) => `${n} ${n === 1 ? 'vara' : 'vörur'} í sýnishorni`,
    back: 'Öll merki', contact: 'Nánari upplýsingar veitir',
  },
  machines: {
    title: 'Vélar',
    lead: 'HEGAS leggur metnað í þjónustu á BIESSE iðnaðarvélum á Íslandi sem fulltrúi hins virta framleiðanda.',
    newT: 'Nýjar vélar frá Biesse', usedT: 'Notaðar vélar', usedLead: (n: number) => `${n} notaðar vélar eru á skrá hjá HEGAS. Hér eru þær sem eru með mynd og verð.`,
    feature: 'Afhent í mars 2026', featureT: 'HEGAS afhendir AXIS nýja plötusög',
    featureB: 'Biesse Rover Cut Up S T 3822 hefur verið tekin í notkun í framleiðslu AXIS.',
    featureUrl: 'https://hegas.is/hegas-afhendir-axis-nyja-plotusog/',
    ask: 'Spyrja um vél', allUsed: 'Allar notaðar vélar á hegas.is', biesse: 'Úrval Biesse',
    askBody: (m: string) => `Góðan dag,%0D%0A%0D%0Amig langar að fá nánari upplýsingar um: ${m}.%0D%0A%0D%0AKveðja,`,
  },
  how: {
    title: 'Þjónusta',
    contact: 'Senda fyrirspurn',
    items: [
      { t: 'Netverslun', b: 'Verð, lagerstaða og kaup á netinu: 1.152 vörur í netverslun HEGAS. Efnislistinn hér tekur líka það sem fæst aðeins á fyrirspurn, eins og plötur og yfirborðsefni.', link: ['verslun.hegas.is', 'https://verslun.hegas.is/'] },
      { t: 'Ráðgjöf um plötur og yfirborðsefni', b: 'Nánari upplýsingar um yfirborðsefni, plötur og sérpantanir veitir Egill Hjartarson, egill@hegas.is. Um spónlagt efni: Sveinbjörn Leósson, bjorn@hegas.is.' },
      { t: 'Sérpantanir', b: 'Mun fleiri litir og þykktir eru í boði en eru til á lager. Aðrar útfærslur er hægt að sérpanta.' },
      { t: 'Lyftibúnaður frá TAWI', b: 'TAWI lyftibúnaður gerir fyrirtækjum kleift að fara frá handvirkri meðhöndlun yfir í snjallar lyftilausnir: tómarúmslyftibúnaður, lyftivagnar, lyfti- og gripverkfæri og kranabúnaður.', link: ['Lyftibúnaður á hegas.is', 'https://hegas.is/lyftibunadur/'] },
      { t: 'H+H SYSTEM fyrir heilbrigðisgeirann', b: 'Skipulagslausnir fyrir apótek, sjúkrahús, rannsóknarstofur, læknastofur, heilsugæslustöðvar og hjúkrunarheimili: skúffuskil, lyfjaskúffur og bakkar.', link: ['H+H SYSTEM á hegas.is', 'https://hegas.is/hh-system-skipulag-fyrir-heilbrigdisgeirann/'] },
      { t: 'Lakk og bæs frá Akzo Nobel', b: 'Sýruhert lökk og bæs fyrir húsgögn, málning fyrir glugga, polyurethan lökk fyrir bæði tré og málm, púðurlökk fyrir málm og UV lökk fyrir húsgögn.', link: ['Lakk á hegas.is', 'https://hegas.is/lakk/'] },
    ] as Acc[],
  },
  rail: {
    title: 'Sagan',
    lead: 'HEGAS þjónustar tréiðnaðinn með hráefni, tæki og tól, á sama sérsviði og í upphafi.',
    prev: 'Fyrra spjald', next: 'Næsta spjald',
    items: [
      { y: '1988', t: 'Stofnað', b: 'Hegas ehf. var stofnað í ársbyrjun 1988 og sérhæfði sig í innflutningi á hráefnisvörum og harðmálmsverkfærum fyrir tréiðnaðinn, í 180 fm húsnæði að Smiðjuvegi 16d.' },
      { y: '1992', t: 'Trésmíðavélar', b: 'Reksturinn gekk vel og fjórum árum seinna hófst innflutningur á trésmíðavélum og tengdum vörum.' },
      { y: '1993', t: 'Smiðjuvegur 8', b: 'Vegna aukinna umsvifa varð húsnæðið fljótt of lítið og síðla árs 1993 var keypt 425 fm húsnæði að Smiðjuvegi 8.' },
      { y: '2000', t: 'Smiðjuvegur 1', b: 'Þann 1. maí 2000 flutti starfsemin í núverandi húsnæði að Smiðjuvegi 1. Húsið, um 3000 m², er nú alfarið í eigu HEGAS og þar fer öll starfsemin fram.', img: 'kynning-3', alt: 'Tveir starfsmenn HEGAS brosa í sýningarsalnum', cap: 'Kynning í sýningarsalnum á Smiðjuvegi 1, apríl 2026.' },
      { y: '2010–2024', t: 'Framúrskarandi', b: 'HEGAS hefur verið á lista Creditinfo yfir framúrskarandi fyrirtæki frá 2010.', links: [['Fréttin á hegas.is', 'https://hegas.is/framurskarandi-fyrirtaeki-2010-2024/']] },
      { y: 'Í dag', t: 'Sýningarsalur og kynningar', b: 'HEGAS stóð fyrir vel heppnaðri kynningu í apríl 2026 þar sem gestir kynntu sér nýjungar og lausnir fyrir nútímalegar innréttingar.', img: 'kynning-4', alt: 'Gestir skoða sýnishorn af plötum og höldum á kynningu HEGAS', links: [['Fréttin á hegas.is', 'https://hegas.is/vel-heppnud-kynning-hja-hegas/']] },
    ] as Rail[],
  },
  news: { title: 'Fréttir', all: 'Allar fréttir á hegas.is', read: 'Lesa fréttina' },
  staff: { title: 'Starfsfólk', lead: 'Hringdu beint í þann sem þú þarft eða sendu póst. Aðalnúmerið er 580 6700.', direct: 'Beinn sími', gsm: 'GSM', mail: 'Senda póst' },
  contactS: { title: 'Hafa samband', come: 'Komdu til okkar', talk: 'Talaðu við okkur', mail: 'Sendu okkur tölvupóst', sales: 'Fyrirspurnir um vörur og verð', general: 'Almennar fyrirspurnir', hours: 'Opnunartími', map: 'Opna kort' },
  teaser: {
    title: 'Efnislisti',
    body: 'Safnaðu höldum, lömum, plötum og ljósum fyrir verkið á einn lista, settu magn og óskaða afhendingu og sendu söludeild HEGAS. Listinn geymist og þú getur opnað hann aftur í næsta verki.',
    cta: 'Opna efnislistann', staff: 'Sjá hvernig söludeildin tekur við',
    note: 'Frumgerð: ekkert er sent úr þessari útgáfu.',
  },
  list: {
    h1: 'Efnislisti',
    lead: 'Fyrirspurn, háð yfirferð. Söludeild HEGAS fer yfir listann og hefur samband með verð, lagerstöðu og afhendingu. Verð úr netverslun eru til viðmiðunar.',
    name: 'Heiti lista', namePh: 'T.d. Eldhús, 4 skápar',
    empty: 'Listinn er tómur. Bættu við vörum úr vörulistanum.', browse: 'Fara í vörulistann',
    cols: { sku: 'Vörunr.', item: 'Vara', qty: 'Magn', unit: 'Eining', remove: 'Fjarlægja', price: 'Verð' },
    less: 'Minnka magn', more: 'Auka magn',
    project: 'Verkefnið', ref: 'Verkheiti eða tilvísun', refPh: 'T.d. verknúmer eða heimilisfang',
    date: 'Óskuð afhending', place: 'Afhending',
    places: { pickup: 'Sótt á Smiðjuveg 1', site: 'Sent á verkstað', ship: 'Sent út á land' },
    notes: 'Athugasemdir', notesPh: 'T.d. litur, þykkt, borun eða annað sem sölumaður þarf að vita',
    file: 'Viðhengi', fileBtn: 'Velja skrá', fileNote: 'Teikning eða magntaka. Í frumgerðinni er aðeins skráarheitið geymt.',
    contact: 'Tengiliður', cname: 'Nafn', company: 'Fyrirtæki', email: 'Netfang', phone: 'Sími',
    save: 'Vista lista', saved: 'Vistað', open: 'Opna vistaðan lista', none: 'Engir vistaðir listar enn',
    clear: 'Hreinsa lista', undo: 'Afturkalla', cleared: 'Listinn var hreinsaður.', demo: 'Setja inn dæmalista',
    send: 'Senda til söludeildar',
    need: 'Nafn og netfang eða sími þarf að fylgja, og a.m.k. ein vara.',
    local: 'Í frumgerðinni eru listar geymdir í þessum vafra.',
    fallback: 'Líka hægt að senda listann á sala@hegas.is eða hringja í 580 6700.',
    total: 'Samtals eftir verðum netverslunar', totalNote: (n: number) => n ? `${n} ${n === 1 ? 'lína er' : 'línur eru'} á fyrirspurn og ekki í upphæðinni.` : 'Allar línur eru með verð úr netverslun.',
    sum: { title: 'Yfirlit fyrir sendingu', items: (n: number) => `${n} ${n === 1 ? 'lína' : 'línur'}`, back: 'Breyta', confirm: 'Senda til söludeildar', missing: 'Vantar' },
    ack: { title: 'Fyrirspurn móttekin', body: 'Listinn fer til söludeildar HEGAS. Sölumaður hefur samband með verð, lagerstöðu og afhendingu.', note: 'Frumgerð: ekkert var sent. Í raunútgáfu færi listinn á sala@hegas.is.', num: 'Fyrirspurn nr.', staff: 'Sjá listann hjá söludeild', close: 'Loka' },
    units: 'Eining',
  },
  review: {
    h1: 'Yfirferð',
    lead: 'Svona gæti söludeildin séð listana: hver lína með vörunúmeri og verði, það sem vantar merkt og svar tilbúið til sendingar.',
    sample: 'Sýnigögn', sampleNote: 'Línur merktar sýnigögn eru tilbúin dæmi, ekki raunverulegar fyrirspurnir.',
    yours: 'Listinn þinn',
    cols: { no: 'Nr.', from: 'Frá', ref: 'Verk', lines: 'Línur', date: 'Afhending', status: 'Staða' },
    status: { new: 'Ný', review: 'Í yfirferð', quoted: 'Tilboð sent' },
    flags: 'Athuga', noFlags: 'Ekkert vantar',
    flag: { date: 'Afhendingardag vantar', place: 'Afhendingarmáta vantar', ref: 'Verkheiti vantar', unit: 'Eining óljós', enquiry: 'Plötur á fyrirspurn: staðfesta lit og þykkt' },
    reply: 'Svar til viðskiptavinar',
    replyText: (name: string, ref: string) => `Sæl/l ${name},\n\ntakk fyrir efnislistann${ref ? ` vegna ${ref}` : ''}. Við förum yfir hann og sendum þér tilboð með verði, lagerstöðu og afhendingartíma.\n\nKveðja,\nsöludeild HEGAS\n580 6700`,
    mark: 'Merkja í yfirferð', quote: 'Merkja tilboð sent', pick: 'Veldu lista til að sjá hann.',
    back: 'Aftur í efnislistann',
  },
  foot: {
    names: 'Vöruheiti, vörunúmer og verð eru eins og HEGAS skráir þau í netversluninni 9. október 2026.',
    orig: 'Núverandi vefur: hegas.is',
    privacy: ['Persónuverndarstefna', 'https://hegas.is/personuverndarstefna-hegas-vidskiptavinir/'] as [string, string],
    returns: ['Skilaréttur', 'https://hegas.is/skilarettur/'] as [string, string],
  },
}
export const T = { is: IS, en: IS }
export type Copy = typeof IS

/* staff queue: made-up rows, always labelled sample data on screen */
export const SAMPLE_QUEUE = [
  { no: 'H-2207', from: 'Innréttingaverkstæði, Kópavogi', ref: 'Eldhús, 14 skápar', lines: 18, date: '2026-10-16', status: 'review' as const, flags: [] as string[] },
  { no: 'H-2206', from: 'Húsgagnasmiður, Akureyri', ref: 'Fataskápar í fjölbýli', lines: 9, date: '', status: 'new' as const, flags: ['date', 'enquiry'] },
  { no: 'H-2204', from: 'Trésmiðja, Suðurlandi', ref: '', lines: 26, date: '2026-10-28', status: 'new' as const, flags: ['ref', 'unit'] },
  { no: 'H-2201', from: 'Smiður, höfuðborgarsvæðinu', ref: 'Baðinnrétting', lines: 5, date: '2026-10-10', status: 'quoted' as const, flags: [] as string[] },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HEGAS ehf.',
  url: 'https://hegas.is/',
  foundingDate: '1988',
  telephone: '+354 580 6700',
  email: 'hegas@hegas.is',
  address: { '@type': 'PostalAddress', streetAddress: 'Smiðjuvegi 1', postalCode: '200', addressLocality: 'Kópavogur', addressCountry: 'IS' },
}

export const companyEntry: PreviewCompany = {
  slug: 'hegas',
  route: '/preview/hegas',
  name: 'HEGAS ehf.',
  sector: 'Heildsala fyrir tréiðnaðinn: íhlutir, yfirborðsefni, vélar og verkfæri',
  location: 'Smiðjuvegi 1, 200 Kópavogur',
  region: 'Höfuðborgarsvæðið',
  established: 'Stofnað 1988.',
  currentUrl: 'https://hegas.is',
  ownerEmail: 'hegas@hegas.is',
  concept: 'Efnislisti fyrir verkið',
  conceptTagline:
    'Vöruúrval HEGAS í átta flokkum með verðum úr netversluninni, merkin í sex plötum og vélarnar á einum stað. ' +
    'Úr vörulistanum verður til efnislisti fyrir verkið, höldur, lamir, plötur og ljós saman, sem fer í einu lagi til söludeildar.',
  accent: '#073ED7',
  dark: false,
  status: 'In build',
  thumb: `${BASE}hegas/img/magic-light-800.webp`,
  ownPhotography: true,
  photoCredit:
    'Ljósmyndir, vöruupplýsingar og merki eru í eigu HEGAS ehf. og framleiðenda þeirra, sótt af hegas.is og verslun.hegas.is 9. október 2026.',
  audit: {
    strengths: [
      'Netverslun með 1.152 vörum, vörunúmerum, verðum og lagerstöðu',
      'Virkar fréttir (júlí til september 2026) og eigin síður fyrir merkin sem þau selja',
      'Listi yfir notaðar vélar með myndum og verðum, og starfsmannasíða með beinum símum',
    ],
    weaknesses: [
      'Forsíðan opnar á myndaslæðu án fyrirsagnar; engin H1 og 84 af 107 myndum án alt-texta (mælt 9. okt. 2026)',
      'Sömu flokkar í mörgum valmyndum og tvær síður um sorpflokkun; aðalvefur og netverslun eru tveir aðskildir vefir',
      'Engin leið til að safna saman því sem verkið þarf, plötum á fyrirspurn og íhlutum úr netverslun, í eina beiðni',
    ],
    opportunities: [
      'Efnislisti fyrir verkið: íhlutir með verði og plötur á fyrirspurn saman, sent til söludeildar',
      'Eitt heimili fyrir hvern vöruflokk og hvert merki, með tengli í netverslunina',
      'Vélar, notaðar vélar og þjónusta á sama vef og vörurnar',
    ],
  },
  positioning:
    'HEGAS er með vörurnar, merkin og fólkið. Það sem vantar er einn vefur sem tengir þetta saman og leið fyrir smiðinn að senda allt sem verkið þarf í einu lagi.',
  outreach: {
    subject: 'Efnislisti fyrir verkið hjá HEGAS',
    body: 'Drög að kynningu eru í _docs/HEGAS-BUILD-2026-10-09.md. Ekkert hefur verið sent.',
  },
}
