import type { PreviewCompany } from '../company-types'

/* Set ehf. preview. Every fact below was read from set.is on 2026-09-29 (harvest: _docs/set-harvest-2026-09-29/).
   Product data (742 of 6,211 products, with SKUs and attributes) is loaded at runtime from public/set/catalog.json,
   built from the site's public WooCommerce Store API by _docs/set-harvest-2026-09-29/build_catalog.py. */

const BASE = import.meta.env.BASE_URL
export const img = (name: string, w: 800 | 1600 = 1600) => `${BASE}set/img/${name}-${w}.webp`
export const productImg = (id: number) => `${BASE}set/p/${id}.webp`

export type Lang = 'is' | 'en'
export type View = 'home' | 'family' | 'product' | 'list' | 'review'
export type Route = { lang: Lang; view: View; param?: string }

const ROOT = '/preview/set'
export const SEG = {
  is: { family: 'vorur', product: 'vara', list: 'efnislisti', review: 'yfirferd' },
  en: { family: 'products', product: 'product', list: 'material-list', review: 'review' },
} as const

export const path = (lang: Lang, view: View, param?: string) => {
  const base = lang === 'en' ? `${ROOT}/en` : ROOT
  if (view === 'home') return base
  const seg = SEG[lang][view]
  return param ? `${base}/${seg}/${param}` : `${base}/${seg}`
}

export function parseRoute(pathname: string): Route {
  let rest = pathname.replace(/\/+$/, '').slice(ROOT.length).replace(/^\/+/, '')
  let lang: Lang = 'is'
  if (rest === 'en' || rest.startsWith('en/')) { lang = 'en'; rest = rest.slice(2).replace(/^\/+/, '') }
  const [seg, param] = rest.split('/')
  if (!seg) return { lang, view: 'home' }
  const s = SEG[lang]
  if (seg === s.family && param) return { lang, view: 'family', param: decodeURIComponent(param) }
  if (seg === s.product && param) return { lang, view: 'product', param: decodeURIComponent(param) }
  if (seg === s.list) return { lang, view: 'list' }
  if (seg === s.review) return { lang, view: 'review' }
  return { lang, view: 'home' }
}

/* ------------------------------------------------------------------ the seven families = Set's own catalogue chapters */
export type Family = {
  n: number; slug: string; is: string; en: string
  desc: { is: string; en: string }
  pdf: string; handbook?: string
}
export const FAMILIES: Family[] = [
  {
    n: 1, slug: 'hitaveituefni', is: 'Hitaveituefni', en: 'District heating',
    desc: {
      is: 'Foreinangruð stálrör og Elipex-plaströr fyrir hitaveitur, með einangruðum fittings, kúlulokum, þönum og PEX-tengjum.',
      en: 'Pre-insulated steel and Elipex plastic pipe for district heating, with insulated fittings, ball valves, compensators and PEX couplings.',
    },
    pdf: 'https://set.is/wp-content/uploads/2022/09/1_kafli_Hitaveituror_WEB-1.pdf',
    handbook: 'https://set.is/wp-content/uploads/2022/09/heild_isl_050716-compressed.pdf',
  },
  {
    n: 2, slug: 'vatnsveituefni', is: 'Vatnsveituefni', en: 'Water supply',
    desc: {
      is: 'PE- og PP-plaströr fyrir vatnsveitur, rafsuðufittings, iJoint-tengi, viðgerðarhólkar, brunahanar og lokar frá AVK.',
      en: 'PE and PP plastic pipe for water supply, electrofusion fittings, iJoint couplings, repair clamps, hydrants and AVK valves.',
    },
    pdf: 'https://set.is/wp-content/uploads/2025/04/Vorulisti_2019_Kafli_2_Vatnsveituefni-med-breytingum25.pdf',
    handbook: 'https://set.is/wp-content/uploads/2022/09/vatnsveituefni.pdf',
  },
  {
    n: 3, slug: 'fraveituefni', is: 'Fráveituefni', en: 'Drainage and sewer',
    desc: {
      is: 'X-Stream fráveitukerfið, PVC-rör, hné og greinar, fráveitubrunnar og Weholite-rör fyrir stærri lagnir.',
      en: 'The X-Stream drainage system, PVC pipe, bends and branches, drainage chambers and Weholite pipe for larger lines.',
    },
    pdf: 'https://set.is/wp-content/uploads/2022/09/3_kafli_Fraveituefni_WEB.pdf',
    handbook: 'https://set.is/wp-content/uploads/2022/09/fraveituefni.pdf',
  },
  {
    n: 4, slug: 'hlifdarror', is: 'Hlífðarrör', en: 'Protective ducts',
    desc: {
      is: 'PE- og PVC-hlífðarrör fyrir raf- og fjarskiptalagnir, ljósleiðararör, inntakshné og Talbot-tengi.',
      en: 'PE and PVC ducts for power and telecom cables, microducts for fibre, entry bends and Talbot couplers.',
    },
    pdf: 'https://set.is/wp-content/uploads/2022/09/4_kafli_Hlifdarror_WEB.pdf',
    handbook: 'https://set.is/wp-content/uploads/2022/09/hlifdarror.pdf',
  },
  {
    n: 5, slug: 'stalror-og-fittings', is: 'Stálrör og fittings', en: 'Steel pipe and fittings',
    desc: {
      is: 'Stálrör með suðuhnjám, suðuté, suðuminnkunum, suðusöðlum, suðulokum og suðuflöngsum.',
      en: 'Steel pipe with weld bends, tees, reducers, saddles, caps and weld flanges.',
    },
    pdf: 'https://set.is/wp-content/uploads/2022/09/5_kafli_Stalror_WEB.pdf',
  },
  {
    n: 6, slug: 'verkfaeri', is: 'Verkfæri', en: 'Tools',
    desc: {
      is: 'Rafsuðuvélar og verkfæri til lagnavinnu.',
      en: 'Electrofusion welders and tools for pipe work.',
    },
    pdf: 'https://set.is/wp-content/uploads/2022/09/Vorulisti_2018_Kafli_6_Verkfaeri.pdf',
  },
  {
    n: 7, slug: 'adrar-vorur', is: 'Aðrar vörur', en: 'Other products',
    desc: {
      is: 'Dælur frá Pentair Jung og Johnson, mælabúnaður frá Diehl, merkistikur, baujustangir og ísböð.',
      en: 'Pentair Jung and Johnson pumps, Diehl metering, marker posts, buoy poles and ice baths.',
    },
    pdf: 'https://set.is/wp-content/uploads/2022/09/7_kafli_AdrarVorur_WEB.pdf',
  },
]
/* the three that open each family row: representative items with Set's own photo */
export const FEATURED: Record<number, string[]> = {
  1: ['1.114.100', '11.110.110'],
  2: ['2.18020', '2.510.020', '27.1613'],
  3: ['3.790.105', '3.720.114', '3.710.11'],
  4: ['4.42025', '4.46016', '4.69.100'],
  5: ['8.100.100', '8.120.100.100', '8.131.100.040'],
  7: ['7.110.136', '30.32102', '4.815.20'],
}
/* X-WP-Total of the public Store API product listing, read 2026-09-29 (category counts overlap, so they are not summed) */
export const SET_TOTAL = 6211
export const familyBySlug = (slug: string) => FAMILIES.find((f) => f.slug === slug)
export const pad2 = (n: number) => String(n).padStart(2, '0')

/* ------------------------------------------------------------------ catalogue (runtime) */
export type Product = {
  id: number; slug: string; name: string; sku: string; fam: number; sub: string; leaf: string
  img: boolean; white?: boolean; attrs: [string, string][]; url: string
}
export type Catalog = {
  harvested: string; source: string
  families: { n: number; slug: string; is: string; en: string; setCount: number; subs: [string, number][] }[]
  products: Product[]
}
let catalogPromise: Promise<Catalog> | null = null
export function loadCatalog(): Promise<Catalog> {
  if (!catalogPromise) {
    catalogPromise = fetch(`${BASE}set/catalog.json`).then((r) => {
      if (!r.ok) throw new Error(`catalog ${r.status}`)
      return r.json() as Promise<Catalog>
    })
    catalogPromise.catch(() => { catalogPromise = null })
  }
  return catalogPromise
}

/* Icelandic collation by hand: Intl ships no Icelandic in several browsers (memory: intl-has-no-icelandic).
   Letters in alphabet order, digits compared as numbers so 20mm sorts before 110mm. */
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

/* ------------------------------------------------------------------ material list units */
export type Unit = 'm' | 'stk' | 'rullur' | 'lengdir'
export const UNITS: Unit[] = ['m', 'stk', 'rullur', 'lengdir']
export const UNIT_LABEL: Record<Lang, Record<Unit, string>> = {
  is: { m: 'metrar', stk: 'stykki', rullur: 'rúllur', lengdir: 'lengdir' },
  en: { m: 'metres', stk: 'pieces', rullur: 'coils', lengdir: 'lengths' },
}
export function defaultUnit(p: Pick<Product, 'name' | 'attrs'>): Unit {
  const keys = p.attrs.map((a) => a[0])
  if (keys.includes('Rúllulengd')) return 'm'
  if (/(^|\s)(PE|PP|PVC)?\s?(plaströr|rör|hlífðarrör|stálrör)\b/i.test(p.name) && !/hné|té|múff|grein|minnk|loki|flangs/i.test(p.name)) return 'm'
  return 'stk'
}

/* the demonstration list starts from the real product the dossier names: 2.18020 */
export const DEMO_LIST = [
  { sku: '2.18020', qty: 200, unit: 'm' as Unit },
  { sku: '2.18025', qty: 100, unit: 'm' as Unit },
  { sku: '2.510.020', qty: 12, unit: 'stk' as Unit },
]

/* ------------------------------------------------------------------ contacts (footer of set.is, 2026-09-29) */
export const CONTACT = {
  phone: '480 2700', tel: '+3544802700', sales: 'sala@set.is',
  selfoss: { street: 'Eyravegur 41', town: '800 Selfoss' },
  reykjavik: { street: 'Klettagarðar 21', town: '104 Reykjavík' },
  dispatch: 'Víkurheiði 1',
  europe: [
    ['Set Ísland', 'https://set.is/'],
    ['Set Þýskaland', 'https://setpipes.de/'],
    ['Set Danmörk', 'https://setpipes.dk/'],
  ] as [string, string][],
}

/* ------------------------------------------------------------------ copy */
type Acc = { t: string; b: string; link?: [string, string] }
type Rail = { y: string; t: string; b: string; img?: string; cap?: string; alt?: string; links?: [string, string][] }

export const T = {
  is: {
    htmlLang: 'is',
    title: 'Set ehf. | Vatnsrör, hitaveiturör, fráveiturör og hlífðarrör frá Selfossi',
    description: 'Vörulisti Set eftir vöruflokkum, með vörunúmerum og málum, og efnislisti fyrir verkefni sem fer til yfirferðar hjá söludeild. Frumgerð að nýjum vef.',
    skip: 'Fara í efni',
    nav: { products: 'Vörur', production: 'Framleiðsla', how: 'Þjónusta', list: 'Efnislisti', menu: 'Valmynd', close: 'Loka', lang: 'English', langShort: 'EN' },
    loader: 'Set',
    hero: {
      kicker: 'Set ehf. · Selfoss · síðan 1978',
      h1: 'Við færum þér lífsgæði með lögnum',
      sub: 'Einangruð rör og plaströr fyrir hita-, vatns- og fráveitur, framleidd á Selfossi og í Þýskalandi.',
      cta: 'Skoða vörur', cta2: 'Opna efnislista',
      cap: 'Ný spegilsuðuvél á Selfossi, sú stærsta sinnar tegundar á Íslandi. Hún spegilsýður fittings frá 630 upp í 1200 mm.',
      alt: 'Opin spegilsuðuvél séð að framan: stórt rör liggur í hringlaga klemmum vélarinnar',
    },
    cat: {
      title: 'Vörur',
      lead: (n: number, total: string) => `Sýnishorn úr vörulista Set: ${n} vörur með vörunúmerum og málum eins og Set skráir þær. Allur listinn, ${total} vörur, er á set.is.`,
      filter: 'Vöruflokkur', all: 'Allir flokkar', search: 'Leita að vöru eða vörunúmeri…', searchShort: 'Leita',
      az: 'A–Ö', grid: 'Flokkar', viewAll: 'Skoða allt', view: 'Skoða', add: 'Á lista', added: 'Á listanum', addToList: 'Setja á efnislista',
      inSample: (a: number, b: string) => `${a} í sýnishorni · ${b} á set.is`,
      none: 'Engin vara fannst. Prófaðu annað orð eða vörunúmer.',
      loading: 'Sæki vörulista…', error: 'Vörulistinn náðist ekki. Endurhlaðið síðuna.',
      pdf: 'Vörulisti PDF', handbook: 'Tæknihandbók', sku: 'Vörunr.', noImg: 'Mynd vantar á set.is',
      results: (n: number) => `${n} ${n === 1 ? 'vara' : 'vörur'}`,
      jump: 'Hoppa á staf', sub: 'Undirflokkur', allSubs: 'Allir undirflokkar',
      page: 'Síða', prev: 'Fyrri síða', next: 'Næsta síða',
      back: 'Allar vörur',
    },
    how: {
      title: 'Þjónusta',
      contact: 'Senda fyrirspurn',
      items: [
        { t: 'Vörulisti og tæknihandbók', b: 'Vörulistinn er á vefnum og í sjö köflum á PDF-sniði, einn fyrir hvern vöruflokk. Vakin er athygli á því að ef misræmi er á milli Vörulista og Tæknihandbókar þá gildir Tæknihandbók Set.', link: ['Vörulisti PDF', 'https://set.is/vorulistipdf/'] },
        { t: 'Gagnasafn', b: 'Tæknihandbækur fyrir hitaveitu-, vatnsveitu-, fráveitu- og hlífðarrör, uppsetningarleiðbeiningar, öryggisblöð og tækniblöð, á íslensku, ensku og þýsku.', link: ['Opna gagnasafn', 'https://set.is/gagnasafn/'] },
        { t: 'Verðtilboð', b: 'Það er lítið mál að fá tilboð í efni. Settu vörur í tilboðskörfu eða á efnislista, hringdu í síma 480 2700 eða sendu söludeildinni tölvupóst á sala@set.is.' },
        { t: 'Afhending um allt land', b: 'Stutta svarið er já. Set er með endursöluaðila víða um land en sendir einnig vörur með Flytjanda hvert á land sem er. Þú getur fengið verð í flutning.' },
        { t: 'Afgreiðsla á Selfossi og í Reykjavík', b: 'Afgreiðsla pantana fer fram á vörulager Set að Víkurheiði 1 á Selfossi. Flestar vörur má líka fá afhentar í Klettagörðum 21 í Reykjavík, en sumar eru svo fyrirferðarmiklar að auðveldara er að afhenda þær á framleiðslustað.' },
        { t: 'Fræðsla', b: 'Set rekur eigið fræðslukerfi fyrir starfsfólk, Set-Plastiðnaðarskólann, og heldur auk þess námskeið í lagnatækni fyrir viðskiptavini sína.' },
      ] as Acc[],
    },
    rail: {
      title: 'Framleiðsla',
      lead: 'Öll framleiðsla fer fram í verksmiðjum Set á Selfossi og í Þýskalandi.',
      prev: 'Fyrra spjald', next: 'Næsta spjald',
      items: [
        { y: '1968', t: 'Steypuiðjan', b: 'Steypuiðjan var stofnuð á Selfossi árið 1968 og framleiddi meðal annars steinrör, holstein og steinhellur.', img: 'steypuidjan-1969', cap: 'Steypuiðjan 1969. Sveinn Ármann Sigurðsson og Unnar Ólafsson.', alt: 'Svarthvít mynd úr vinnslusal Steypuiðjunnar 1969' },
        { y: '1978', t: 'Einangruð hitaveiturör', b: 'Áratug síðar var Set stofnað og hóf framleiðslu á foreinangruðum stálrörum og tengistykkjum fyrir hitaveitur.', img: 'flutningur-1972', cap: 'Sigurður Karlsson á leið til Grindavíkur með rörafarm frá Steypuiðjunni 1972.', alt: 'Svarthvít mynd af vörubíl hlöðnum steinrörum' },
        { y: '1982', t: 'Fyrstu plaströrin', b: 'Fyrstu plaströrin voru framleidd í verksmiðju Set á Selfossi: PE-vatnsrör í stærðum 20 til 63 mm, PP-snjóbræðslurör og PVC-rafmagnsrör í stærðum 16 til 50 mm.', img: 'fyrstu-plastror', alt: 'Gömul litmynd af starfsmönnum við framleiðslulínu' },
        { y: 'Í dag', t: 'Selfoss', b: 'Einangruð rör og plaströr fyrir hita-, vatns- og fráveitur. Set byggir framleiðslu sína á hreinum endurnýjanlegum orkugjöfum.', img: 'pipe-machine', alt: 'Svart plaströr kemur út úr framleiðsluvél' },
        { y: 'Í dag', t: 'Þýskaland og Danmörk', b: 'Utan höfuðstöðvanna á Selfossi starfrækir Set framleiðslu í Þýskalandi, sölustarfsemi í Danmörku og lagerhald í Reykjavík.', links: [['setpipes.de', 'https://setpipes.de/'], ['setpipes.dk', 'https://setpipes.dk/']] },
        { y: 'Í jörðu', t: 'Viðbragð', b: 'Í jarðeldunum á Suðurnesjum tókst Seti að afhenda nauðsynlegan lagnabúnað á örskammri stundu til að lágmarka tjón á kerfum.', img: 'sudum-vetur', alt: 'Tveir menn í vinnufatnaði sjóða saman svört rör í snjó' },
      ] as Rail[],
    },
    teaser: {
      title: 'Efnislisti',
      body: 'Safnaðu vörunum saman á einn lista fyrir verkið. Settu magn, einingu og óskaða afhendingu og sendu söludeild Set til yfirferðar. Listinn geymist og þú getur opnað hann aftur í næsta verki.',
      cta: 'Opna efnislistann', staff: 'Sjá hvernig söludeildin tekur við',
      note: 'Frumgerð: ekkert er sent úr þessari útgáfu.',
    },
    list: {
      h1: 'Efnislisti',
      lead: 'Beiðni, háð yfirferð. Söludeild Set fer yfir listann og hefur samband með verð og afhendingu. Hér er hvorki lofað verði, lagerstöðu né hentugleika.',
      name: 'Heiti lista', namePh: 'T.d. Heimtaug, Austurvegur 12',
      empty: 'Listinn er tómur. Bættu við vörum úr vörulistanum.', browse: 'Fara í vörulistann',
      cols: { sku: 'Vörunr.', item: 'Vara', qty: 'Magn', unit: 'Eining', remove: 'Fjarlægja' },
      less: 'Minnka magn', more: 'Auka magn',
      project: 'Verkefnið', ref: 'Verkheiti eða tilvísun', refPh: 'T.d. verknúmer eða heimilisfang',
      date: 'Óskuð afhending', place: 'Afhendingarstaður',
      places: { selfoss: 'Sótt á Selfoss (Víkurheiði 1)', rvk: 'Sótt í Klettagarða 21', ship: 'Sent með Flytjanda' },
      notes: 'Athugasemdir', notesPh: 'T.d. þrýstiflokkur, tengingar eða annað sem sölumaður þarf að vita',
      file: 'Viðhengi', fileBtn: 'Velja skrá', fileNote: 'Teikning eða magntaka. Í frumgerðinni er aðeins skráarheitið geymt.',
      contact: 'Tengiliður', cname: 'Nafn', company: 'Fyrirtæki', email: 'Netfang', phone: 'Sími',
      save: 'Vista lista', saved: 'Vistað', open: 'Opna vistaðan lista', none: 'Engir vistaðir listar enn',
      clear: 'Hreinsa lista', undo: 'Afturkalla', cleared: 'Listinn var hreinsaður.', demo: 'Setja inn dæmalista',
      send: 'Senda til tæknilegrar yfirferðar',
      need: 'Nafn og netfang eða sími þarf að fylgja, og a.m.k. ein vara.',
      local: 'Í frumgerðinni eru listar geymdir í þessum vafra.',
      fallback: 'Líka hægt að senda listann á sala@set.is eða hringja í 480 2700.',
      sum: { title: 'Yfirlit fyrir sendingu', items: (n: number) => `${n} ${n === 1 ? 'lína' : 'línur'}`, back: 'Breyta', confirm: 'Senda til yfirferðar', missing: 'Vantar' },
      ack: { title: 'Beiðni móttekin', body: 'Beiðnin fer til söludeildar Set til yfirferðar. Sölumaður hefur samband með verð og afhendingu.', note: 'Frumgerð: ekkert var sent. Í raunútgáfu færi beiðnin á sala@set.is.', num: 'Beiðni nr.', staff: 'Sjá beiðnina hjá söludeild', close: 'Loka' },
      units: 'Eining',
    },
    review: {
      h1: 'Yfirferð',
      lead: 'Svona gæti söludeildin séð beiðnirnar: hver lína með vörunúmeri, það sem vantar merkt og svar tilbúið til sendingar.',
      sample: 'Sýnigögn', sampleNote: 'Línur merktar sýnigögn eru tilbúin dæmi, ekki raunverulegar beiðnir.',
      yours: 'Beiðnin þín',
      cols: { no: 'Nr.', from: 'Frá', ref: 'Verk', lines: 'Línur', date: 'Afhending', status: 'Staða' },
      status: { new: 'Ný', review: 'Í yfirferð', quoted: 'Tilboð sent' },
      flags: 'Athuga', noFlags: 'Ekkert vantar',
      flag: { date: 'Afhendingardag vantar', place: 'Afhendingarstað vantar', ref: 'Verkheiti vantar', unit: 'Eining óljós' },
      reply: 'Svar til viðskiptavinar',
      replyText: (name: string, ref: string) => `Sæl/l ${name},\n\ntakk fyrir beiðnina${ref ? ` vegna ${ref}` : ''}. Við förum yfir listann og sendum þér tilboð með verði og afhendingartíma.\n\nKveðja,\nsöludeild Set\n480 2700`,
      mark: 'Merkja í yfirferð', quote: 'Merkja tilboð sent', pick: 'Veldu beiðni til að sjá hana.',
      back: 'Aftur í efnislistann',
    },
    foot: {
      selfoss: 'Set Selfossi', selfossNote: 'Skrifstofa, vöruhús og afgreiðsla',
      rvk: 'Set Reykjavík', rvkNote: 'Vöruhús og afgreiðsla',
      hours: 'Mán. til fim. 08:00 til 12:00 og 12:30 til 16:30. Föst. 08:00 til 12:00 og 12:30 til 15:00.',
      europe: 'Set í Evrópu', phone: 'Sími', email: 'Netfang', orig: 'Núverandi vefur: set.is',
      names: 'Vöruheiti, vörunúmer og mál eru eins og Set skráir þau á set.is.',
    },
  },
  en: {
    htmlLang: 'en',
    title: 'Set ehf. | Water, district heating, drainage and duct pipe from Selfoss, Iceland',
    description: 'Set’s catalogue by product family, with item numbers and dimensions, and a project material list that goes to the sales team for review. A preview of a new website.',
    skip: 'Skip to content',
    nav: { products: 'Products', production: 'Production', how: 'Service', list: 'Material list', menu: 'Menu', close: 'Close', lang: 'Íslenska', langShort: 'IS' },
    loader: 'Set',
    hero: {
      kicker: 'Set ehf. · Selfoss, Iceland · since 1978',
      h1: 'Quality of life, delivered through pipes',
      sub: 'Insulated and plastic pipe for district heating, water and drainage, made in Selfoss and in Germany.',
      cta: 'Browse products', cta2: 'Open material list',
      cap: 'The new butt-fusion welder in Selfoss, the largest of its kind in Iceland. It welds fittings from 630 to 1200 mm.',
      alt: 'An open butt-fusion welder seen head-on: a large pipe held in the machine’s ring clamps',
    },
    cat: {
      title: 'Products',
      lead: (n: number, total: string) => `A sample of Set’s catalogue: ${n} products with item numbers and dimensions as Set lists them. The full catalogue, ${total} products, is on set.is. Product names are shown as Set lists them, in Icelandic.`,
      filter: 'Product family', all: 'All families', search: 'Search by product name or item number…', searchShort: 'Search',
      az: 'A–Z', grid: 'Families', viewAll: 'View all', view: 'View', add: 'Add', added: 'On the list', addToList: 'Add to material list',
      inSample: (a: number, b: string) => `${a} in this sample · ${b} on set.is`,
      none: 'No product found. Try another word or item number.',
      loading: 'Loading the catalogue…', error: 'The catalogue could not be loaded. Reload the page.',
      pdf: 'Catalogue PDF', handbook: 'Technical handbook', sku: 'Item no.', noImg: 'No photo on set.is',
      results: (n: number) => `${n} ${n === 1 ? 'product' : 'products'}`,
      jump: 'Jump to letter', sub: 'Sub-family', allSubs: 'All sub-families',
      page: 'Page', prev: 'Previous page', next: 'Next page',
      back: 'All products',
    },
    how: {
      title: 'Service',
      contact: 'Send an enquiry',
      items: [
        { t: 'Catalogue and technical handbook', b: 'The catalogue is online and in seven PDF chapters, one per product family. Set notes that where the catalogue and the technical handbook differ, the technical handbook applies.', link: ['Catalogue PDF', 'https://set.is/vorulistipdf/'] },
        { t: 'Document library', b: 'Technical handbooks for district heating, water, drainage and duct pipe, installation manuals, safety data sheets and technical sheets, in Icelandic, English and German.', link: ['Open the library', 'https://set.is/gagnasafn/'] },
        { t: 'Quotes', b: 'Getting a quote is simple. Put products in the quote basket or on a material list, call +354 480 2700 or email the sales team at sala@set.is.' },
        { t: 'Delivery across Iceland', b: 'The short answer is yes. Set has resellers around the country and also ships with Flytjandi anywhere in Iceland. Ask for a freight price.' },
        { t: 'Collection in Selfoss and Reykjavík', b: 'Orders are dispatched from Set’s warehouse at Víkurheiði 1 in Selfoss. Most products can also be collected at Klettagarðar 21 in Reykjavík; some are bulky enough that they are easier to hand over where they are made.' },
        { t: 'Training', b: 'Set runs its own training programme for staff, the Set Plastics School, and holds courses in pipe technology for its customers.' },
      ] as Acc[],
    },
    rail: {
      title: 'Production',
      lead: 'Everything is made in Set’s own plants in Selfoss and in Germany.',
      prev: 'Previous card', next: 'Next card',
      items: [
        { y: '1968', t: 'Steypuiðjan', b: 'Steypuiðjan was founded in Selfoss in 1968 and made concrete pipe, hollow blocks and paving slabs, among other things.', img: 'steypuidjan-1969', cap: 'Steypuiðjan, 1969. Sveinn Ármann Sigurðsson and Unnar Ólafsson.', alt: 'Black-and-white photo of the Steypuiðjan workshop in 1969' },
        { y: '1978', t: 'Insulated heating pipe', b: 'A decade later Set was founded and began making pre-insulated steel pipe and fittings for district heating.', img: 'flutningur-1972', cap: 'Sigurður Karlsson on the way to Grindavík with a load of pipe from Steypuiðjan, 1972.', alt: 'Black-and-white photo of a lorry loaded with concrete pipe' },
        { y: '1982', t: 'The first plastic pipe', b: 'The first plastic pipe came off the line in Selfoss: PE water pipe from 20 to 63 mm, PP snow-melt pipe and PVC electrical conduit from 16 to 50 mm.', img: 'fyrstu-plastror', alt: 'Old colour photo of workers at a production line' },
        { y: 'Today', t: 'Selfoss', b: 'Insulated and plastic pipe for district heating, water and drainage. Set bases its production on clean, renewable energy.', img: 'pipe-machine', alt: 'A black plastic pipe coming out of a production machine' },
        { y: 'Today', t: 'Germany and Denmark', b: 'Beyond its head office in Selfoss, Set runs production in Germany, a sales office in Denmark and a warehouse in Reykjavík.', links: [['setpipes.de', 'https://setpipes.de/'], ['setpipes.dk', 'https://setpipes.dk/']] },
        { y: 'In the ground', t: 'Response', b: 'During the eruptions on the Reykjanes peninsula, Set delivered the pipe work needed at very short notice to limit damage to the systems.', img: 'sudum-vetur', alt: 'Two workers fusing black pipe in the snow' },
      ] as Rail[],
    },
    teaser: {
      title: 'Material list',
      body: 'Gather the products for a job on one list. Set the quantity, unit and requested delivery, and send it to Set’s sales team for review. The list is kept, so you can reopen it for the next job.',
      cta: 'Open the material list', staff: 'See how the sales team receives it',
      note: 'Preview: nothing is sent from this version.',
    },
    list: {
      h1: 'Material list',
      lead: 'A request, subject to review. Set’s sales team checks the list and comes back with price and delivery. No price, stock or suitability is promised here.',
      name: 'List name', namePh: 'E.g. Service line, Austurvegur 12',
      empty: 'The list is empty. Add products from the catalogue.', browse: 'Go to the catalogue',
      cols: { sku: 'Item no.', item: 'Product', qty: 'Quantity', unit: 'Unit', remove: 'Remove' },
      less: 'Decrease quantity', more: 'Increase quantity',
      project: 'The project', ref: 'Project name or reference', refPh: 'E.g. job number or address',
      date: 'Requested delivery', place: 'Delivery',
      places: { selfoss: 'Collect in Selfoss (Víkurheiði 1)', rvk: 'Collect at Klettagarðar 21', ship: 'Ship with Flytjandi' },
      notes: 'Notes', notesPh: 'E.g. pressure class, connections or anything the salesperson should know',
      file: 'Attachment', fileBtn: 'Choose file', fileNote: 'A drawing or take-off. In the preview only the file name is kept.',
      contact: 'Contact', cname: 'Name', company: 'Company', email: 'Email', phone: 'Phone',
      save: 'Save list', saved: 'Saved', open: 'Open a saved list', none: 'No saved lists yet',
      clear: 'Clear list', undo: 'Undo', cleared: 'The list was cleared.', demo: 'Load the example list',
      send: 'Send for technical review',
      need: 'Add a name and an email or phone, and at least one product.',
      local: 'In the preview, lists are kept in this browser.',
      fallback: 'You can also send the list to sala@set.is or call +354 480 2700.',
      sum: { title: 'Summary before sending', items: (n: number) => `${n} ${n === 1 ? 'line' : 'lines'}`, back: 'Edit', confirm: 'Send for review', missing: 'Missing' },
      ack: { title: 'Request received', body: 'The request goes to Set’s sales team for review. A salesperson will be in touch with price and delivery.', note: 'Preview: nothing was sent. In the live version the request would go to sala@set.is.', num: 'Request no.', staff: 'See it on the sales side', close: 'Close' },
      units: 'Unit',
    },
    review: {
      h1: 'Review',
      lead: 'How the sales team could see incoming requests: every line with its item number, missing information flagged, and a reply ready to send.',
      sample: 'Sample data', sampleNote: 'Rows marked sample data are made-up examples, not real requests.',
      yours: 'Your request',
      cols: { no: 'No.', from: 'From', ref: 'Project', lines: 'Lines', date: 'Delivery', status: 'Status' },
      status: { new: 'New', review: 'In review', quoted: 'Quote sent' },
      flags: 'Check', noFlags: 'Nothing missing',
      flag: { date: 'No delivery date', place: 'No delivery method', ref: 'No project reference', unit: 'Unit unclear' },
      reply: 'Reply to the customer',
      replyText: (name: string, ref: string) => `Hello ${name},\n\nthank you for the request${ref ? ` for ${ref}` : ''}. We are going through the list and will send you a quote with price and delivery time.\n\nBest regards,\nSet sales team\n+354 480 2700`,
      mark: 'Mark in review', quote: 'Mark quote sent', pick: 'Choose a request to see it.',
      back: 'Back to the material list',
    },
    foot: {
      selfoss: 'Set Selfoss', selfossNote: 'Office, warehouse and dispatch',
      rvk: 'Set Reykjavík', rvkNote: 'Warehouse and dispatch',
      hours: 'Mon to Thu 08:00 to 12:00 and 12:30 to 16:30. Fri 08:00 to 12:00 and 12:30 to 15:00.',
      europe: 'Set in Europe', phone: 'Phone', email: 'Email', orig: 'Current site: set.is',
      names: 'Product names, item numbers and dimensions are as Set lists them on set.is, in Icelandic.',
    },
  },
}
export type Copy = typeof T.is

/* staff queue: made-up rows, always labelled sample data on screen */
export const SAMPLE_QUEUE = [
  { no: 'S-1042', from: 'Lagnaverktaki, Suðurlandi', ref: 'Heimtaugar í nýju hverfi', lines: 14, date: '2026-10-12', status: 'review' as const, flags: [] as string[] },
  { no: 'S-1041', from: 'Sveitarfélag, Vesturlandi', ref: 'Endurnýjun stofnlagnar', lines: 6, date: '', status: 'new' as const, flags: ['date'] },
  { no: 'S-1039', from: 'Fiskeldisstöð, Reykjanesi', ref: '', lines: 22, date: '2026-10-30', status: 'new' as const, flags: ['ref', 'unit'] },
  { no: 'S-1036', from: 'Pípulagningameistari, höfuðborgarsvæðinu', ref: 'Snjóbræðsla, bílaplan', lines: 3, date: '2026-10-05', status: 'quoted' as const, flags: [] as string[] },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Set ehf.',
  url: 'https://set.is/',
  foundingDate: '1978',
  telephone: '+354 480 2700',
  email: 'sala@set.is',
  address: { '@type': 'PostalAddress', streetAddress: 'Eyravegur 41', postalCode: '800', addressLocality: 'Selfoss', addressCountry: 'IS' },
}

export const companyEntry: PreviewCompany = {
  slug: 'set',
  route: '/preview/set',
  name: 'Set ehf.',
  sector: 'Röraframleiðsla: hitaveitu-, vatnsveitu-, fráveitu- og hlífðarrör',
  location: 'Eyravegur 41, 800 Selfoss',
  region: 'Suðurland',
  established: 'Set stofnað 1978, Steypuiðjan 1968.',
  currentUrl: 'https://set.is',
  ownerEmail: 'sala@set.is',
  concept: 'Efnislisti fyrir verkefni',
  conceptTagline:
    'Vörulisti Set eftir sjö vöruflokkum, eins og PDF-kaflarnir þeirra, með raunverulegum vörunúmerum og málum. ' +
    'Úr honum verður til efnislisti fyrir verkið sem fer til yfirferðar hjá söludeild og má opna aftur í næsta verki.',
  accent: '#83B635',
  dark: false,
  status: 'In build',
  thumb: `${BASE}set/img/extruder-800.webp`,
  ownPhotography: true,
  photoCredit:
    'Ljósmyndir, vöruupplýsingar og merki eru í eigu Set ehf. og sótt af set.is 29. september 2026.',
  audit: {
    strengths: [
      'Leitanlegur vörulisti á vefnum (6.211 vörur) með vörunúmerum og málum, auk sjö PDF-kafla og gagnasafns með tæknihandbókum',
      'Tilboðskarfa og fyrirspurnarform á hverri vöru',
      'Eigin ljósmyndir úr framleiðslu, af lagningu og úr sögu fyrirtækisins frá 1968',
    ],
    weaknesses: [
      'Viewport bannar stækkun (maximum-scale) og 11 af 12 myndum á forsíðu vantar alt-texta (mælt 29. sept. 2026)',
      'Tenglar á persónuverndarstefnu og skilmála í fæti vísa á „#“',
      'Engin leið til að vista efnislista fyrir verkefni eða opna hann aftur; tilboðskarfan tekur hvorki einingu, afhendingu né viðhengi',
    ],
    opportunities: [
      'Efnislisti fyrir verkefni: vörunúmer, magn og eining, óskuð afhending, tilvísun og viðhengi, sent til yfirferðar',
      'Vörur tengdar beint við PDF-kafla og tæknihandbók síns flokks',
      'Íslenska og enska á sitt hvorri slóð fyrir hverja vöru',
    ],
  },
  positioning:
    'Set er með vörulistann og gögnin. Það sem vantar er leiðin frá vörulistanum að skýrri, endurnýtanlegri beiðni sem söludeildin getur afgreitt án þess að elta upplýsingar.',
  outreach: {
    subject: 'Efnislisti fyrir verkefni hjá Set',
    body:
      'Mér fannst áhugavert að sjá hvernig þið tengið íslenska framleiðslu við ráðgjöf og hraða þjónustu. ' +
      'Mig langar að sýna ykkur hugmynd að einfaldari efnislista þar sem viðskiptavinur safnar saman vörum og sendir skýra tilboðsbeiðni. ' +
      'Ef það gæti létt undir hjá söludeildinni væri gaman að bera hugmyndina undir ykkur, án nokkurrar skuldbindingar.',
  },
}
