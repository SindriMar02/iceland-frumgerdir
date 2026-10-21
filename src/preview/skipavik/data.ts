import type { PreviewCompany } from '../company-types'

/* Skipavík ehf. preview on the Set engine. Every fact below was read on 2026-10-21 from skipavik.is (crawl and photo
   provenance: _docs/skipavik-2026-10-21/claude/build/photo-map.tsv), the Stykkishólmur municipality (Víkurhverfi, 16 Apr
   and 1 Oct 2026) and HEV minutes no. 202 (workshop permits). The "catalogue" is Skipavík's own services and its own
   published jobs; nothing here is a price, an availability or a date promise. Icelandic only (prototype scope). */

const BASE = import.meta.env.BASE_URL
export const img = (name: string, w: 800 | 1600 = 1600) => `${BASE}skipavik/img/${name}-${w}.webp`

export type Lang = 'is' | 'en'
export type View = 'home' | 'family' | 'product' | 'list' | 'review'
export type Route = { lang: Lang; view: View; param?: string }

const ROOT = '/preview/skipavik'
export const SEG = {
  is: { family: 'svid', product: 'verk', list: 'verkbeidni', review: 'yfirferd' },
  en: { family: 'svid', product: 'verk', list: 'verkbeidni', review: 'yfirferd' },
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
  if (seg === s.list) return { lang, view: 'list' }
  if (seg === s.review) return { lang, view: 'review' }
  return { lang, view: 'home' }
}

/* ------------------------------------------------------------------ the five divisions, as skipavik.is lists them */
export type Person = { name: string; role: string; tel?: string; email?: string }
export type Family = {
  n: number; slug: string; is: string; en: string
  desc: { is: string; en: string }
  people: Person[]; page: string; place: string
}
const dual = (s: string) => ({ is: s, en: s })
export const FAMILIES: Family[] = [
  {
    n: 1, slug: 'drattarbraut', is: 'Dráttarbraut', en: 'Dráttarbraut', place: 'Nesvegi 20, Stykkishólmi',
    desc: dual('Dráttarbraut Skipavíkur tekur allt að 400 þungatonna skip. Mesta breidd í sleða er 8,6 metrar og hægt er að taka allt að 27 metra löng skip inn í hús. Brautin og sleðinn hafa verið endurbætt á síðustu árum.'),
    people: [{ name: 'Guðlaugur Harðarson', role: 'Verkstjóri vélsmiðju', tel: '860 4314', email: 'slippur@skipavik.is' }],
    page: 'https://www.skipavik.is/index.php/thjonusta/drattarbraut',
  },
  {
    n: 2, slug: 'velsmidja', is: 'Vélsmiðja Stykkishólmi', en: 'Vélsmiðja Stykkishólmi', place: 'Nesvegi 20, Stykkishólmi',
    desc: dual('Í vélsmiðjunni í Stykkishólmi er unnið að fjölþættum verkefnum: almennu viðhaldi á skipum og breytingum. Smiðjan er búin tækjum og tólum til allra almennra verka.'),
    people: [{ name: 'Guðlaugur Harðarson', role: 'Verkstjóri vélsmiðju', tel: '860 4314', email: 'slippur@skipavik.is' }],
    page: 'https://www.skipavik.is/index.php/thjonusta/velsmidja',
  },
  {
    n: 3, slug: 'grundartangi', is: 'Vélsmiðja Grundartanga', en: 'Vélsmiðja Grundartanga', place: 'Klafastaðavegi 2, Grundartanga',
    desc: dual('Stærstu einstöku verkefnin tengjast stækkunum á álveri Norðuráls við Hvalfjörð: uppsetningu og suðu straumleiðara og kerja. Stækkanirnar eru alls fjórar og allt að 30 starfsmenn hafa unnið við verkið á hverjum tíma.'),
    people: [
      { name: 'Hallfreður Ragnar Björgvinsson', role: 'Verkefnisstjóri', tel: '694 6747', email: 'tangi@skipavik.is' },
      { name: 'Dúi Andersen', role: 'Liðsstjóri', tel: '839 9055' },
    ],
    page: 'https://www.skipavik.is/index.php/thjonusta/velsmidja-grundartanga',
  },
  {
    n: 4, slug: 'byggingar', is: 'Byggingar', en: 'Byggingar', place: 'Stykkishólmi og Snæfellsnesi',
    desc: dual('Frá árinu 1998 hefur Skipavík unnið að fjölda verkefna í byggingariðnaði: íþróttamannvirkjum, skóla, leikskóla, brúargerð, íbúðum og húsum undir atvinnustarfsemi. Síðustu ár hefur Skipavík byggt og selt hús og tekið þátt í uppbyggingu frístundahúsa við Arnarborgir.'),
    people: [
      { name: 'Kristján Gunnlaugsson', role: 'Byggingarmeistari og byggingarstjóri', tel: '894 2955' },
      { name: 'Sigurbjartur Loftsson', role: 'Tæknimaður byggingardeildar', tel: '788 0077', email: 'baddi@skipavik.is' },
    ],
    page: 'https://www.skipavik.is/index.php/thjonusta/husbyggingar',
  },
  {
    n: 5, slug: 'verslun', is: 'Verslun', en: 'Verslun', place: 'Aðalgötu, Stykkishólmi',
    desc: dual('Skipavík hóf verslunarrekstur árið 1986. Í desember 2006 flutti verslunin í eigið húsnæði við Aðalgötu, þar sem Lyfja, Arion banki og ÁTVR eru einnig með aðstöðu.'),
    people: [{ name: 'Ásgeir Ásgeirsson', role: 'Verslun', tel: '430 1415', email: 'verslun@skipavik.is' }],
    page: 'https://www.skipavik.is/index.php/thjonusta/verslun',
  },
]
export const familyBySlug = (slug: string) => FAMILIES.find((f) => f.slug === slug)
export const pad2 = (n: number) => String(n).padStart(2, '0')

/* ------------------------------------------------------------------ services (req: can go on a request) and published jobs */
export type Product = {
  id: number; slug: string; name: string; sku: string; fam: number; sub: string; leaf: string
  img: boolean; white?: boolean; photo?: string; alt?: string; req?: boolean; attrs: [string, string][]; url: string; src?: string
}
type P = Omit<Product, 'id' | 'img' | 'white' | 'sub'>
const VIK_SRC = 'https://www.stykkisholmur.is/is/frettir/samningur-um-frekari-uppbyggingu-i-vikurhverfi-undirritadur'
const ITEMS: P[] = [
  /* 01 Dráttarbraut */
  { slug: 'upptaka', sku: 'D-01', fam: 1, leaf: 'Þjónusta', req: true, name: 'Upptaka í dráttarbraut', photo: 'slip-helgi',
    alt: 'Stefni á bláu fiskiskipi uppi á dráttarbrautinni í ljósaskiptunum',
    attrs: [['Mesta þyngd', 'allt að 400 þungatonn'], ['Mesta breidd í sleða', '8,6 m']], url: FAMILIES[0].page },
  { slug: 'inni-i-husi', sku: 'D-02', fam: 1, leaf: 'Þjónusta', req: true, name: 'Skip inn í hús', photo: 'slip-green',
    alt: 'Grænt fiskiskip á sleðanum framan við gulan skipasmíðasal',
    attrs: [['Mesta lengd inni', 'allt að 27 m']], url: FAMILIES[0].page },
  { slug: 'malning', sku: 'D-03', fam: 1, leaf: 'Þjónusta', req: true, name: 'Málningarþjónusta fyrir skip og báta', photo: 'slip-esjar',
    alt: 'Blátt skip, Esjar SH 75, uppi í slipp',
    attrs: [['Staður', 'Dráttarbrautin í Stykkishólmi']], url: FAMILIES[0].page,
    src: 'Starfsleyfi HEV, gefið út 16. apríl 2026 (fundargerð 202)' },
  { slug: 'braut-og-sledi', sku: 'D-04', fam: 1, leaf: 'Aðstaða', name: 'Brautin og sleðinn endurbætt', photo: 'slip-renewed',
    alt: 'Unnið við endurnýjun dráttarbrautarinnar', attrs: [['Ástand', 'endurbætt á síðustu árum']], url: FAMILIES[0].page },
  /* 02 Vélsmiðja Stykkishólmi */
  { slug: 'vidhald-og-breytingar', sku: 'V-01', fam: 2, leaf: 'Þjónusta', req: true, name: 'Viðhald og breytingar á skipum', photo: 'ws-sparks',
    alt: 'Neistar frá slípun í vélsmiðjunni, skip inni í salnum', attrs: [['Verkstæði', 'Nesvegi 20, Stykkishólmi']], url: FAMILIES[1].page },
  { slug: 'lenging', sku: 'V-02', fam: 2, leaf: 'Verk', name: 'Lenging Gunnars Bjarnasonar SH og Mattíasar', photo: 'slip-gunnar',
    alt: 'Gunnar Bjarnason SH 122 við Skipavík', attrs: [['Verk', 'lenging tveggja báta']], url: FAMILIES[0].page },
  { slug: 'veltitankur-baldur', sku: 'V-03', fam: 2, leaf: 'Verk', name: 'Veltitankur í Breiðafjarðarferjuna Baldur', attrs: [['Verk', 'Breiðafjarðarferjan Baldur']], url: FAMILIES[0].page },
  { slug: 'perustefni', sku: 'V-04', fam: 2, leaf: 'Verk', name: 'Perustefni á fjölda báta', attrs: [['Verk', 'Undanfarin ár, fjölmargir bátar']], url: FAMILIES[0].page },
  /* 03 Grundartangi */
  { slug: 'nordural', sku: 'G-01', fam: 3, leaf: 'Verk', name: 'Straumleiðarar og ker í álveri Norðuráls', attrs: [['Stækkanir', '4'], ['Mannafli', 'allt að 30 starfsmenn í einu']], url: FAMILIES[2].page },
  { slug: 'smidja-grundartanga', sku: 'G-02', fam: 3, leaf: 'Þjónusta', req: true, name: 'Vélsmíði og vélaviðgerðir á Grundartanga', photo: 'gt-hall',
    alt: 'Inni í vélsmiðjunni á Grundartanga', attrs: [['Verkstæði', 'Klafastaðavegi 2']], url: FAMILIES[2].page,
    src: 'Starfsleyfi HEV, gefið út 16. apríl 2026 (fundargerð 202)' },
  /* 04 Byggingar */
  { slug: 'vikurhverfi', sku: 'B-01', fam: 4, leaf: 'Í undirbúningi', req: true, name: 'Víkurhverfi: íbúðir í undirbúningi',
    attrs: [
      ['Fjöldi íbúða', '14 til 28, samkvæmt viljayfirlýsingu 13. apríl 2026'],
      ['Gerðir', 'parhús, einbýli og raðhús'],
      ['Skipulag', 'breyting á deiliskipulagi auglýst 1. október 2026, athugasemdir til 12. nóvember'],
      ['Áætlun', 'uppbygging innan átta ára frá gildistöku deiliskipulags'],
    ], url: VIK_SRC, src: 'Sveitarfélagið Stykkishólmur, 16. apríl og 1. október 2026' },
  { slug: 'ithrottamidstod', sku: 'B-02', fam: 4, leaf: 'Verk', name: 'Íþróttamiðstöðin í Stykkishólmi', photo: 'bld-sport',
    alt: 'Íþróttamiðstöðin í Stykkishólmi með útisundlaug og rennibrautum', attrs: [['Staður', 'Stykkishólmur']], url: FAMILIES[3].page },
  { slug: 'fjolbrautaskoli', sku: 'B-03', fam: 4, leaf: 'Verk', name: 'Fjölbrautaskóli Snæfellinga', photo: 'bld-fsn',
    alt: 'Fjölbrautaskóli Snæfellinga, gulir veggir og timburklæddur inngangur', attrs: [['Staður', 'Grundarfjörður']], url: FAMILIES[3].page },
  { slug: 'ithrottahus-snaefellsbae', sku: 'B-04', fam: 4, leaf: 'Verk', name: 'Íþróttahús í Snæfellsbæ', photo: 'bld-olafsvik',
    alt: 'Íþróttahúsið í Ólafsvík, rautt og hvítt', attrs: [['Staður', 'Ólafsvík']], url: FAMILIES[3].page },
  { slug: 'moholt', sku: 'B-05', fam: 4, leaf: 'Íbúðir', name: 'Íbúðir við Móholt 2, 2a, 4 og 4a', photo: 'bld-moholt',
    alt: 'Raðhús á einni hæð við Móholt', attrs: [['Staður', 'Stykkishólmur']], url: FAMILIES[3].page },
  { slug: 'arnarborgir', sku: 'B-06', fam: 4, leaf: 'Íbúðir', name: 'Frístundahús við Arnarborgir', photo: 'bld-arnarborgir',
    alt: 'Hvít frístundahús í mólendi utan við Stykkishólm', attrs: [['Staður', 'rétt utan við Stykkishólm']], url: FAMILIES[3].page },
  /* 05 Verslun */
  { slug: 'byggingarvoruverslun', sku: 'S-01', fam: 5, leaf: 'Verslun', name: 'Byggingarvöruverslun við Aðalgötu', photo: 'shop',
    alt: 'Verslunarhús Skipavíkur við Aðalgötu með rauðu þaki',
    attrs: [['Mán. til fim.', '09:00 til 18:00'], ['Föstudaga', '09:00 til 19:00'], ['Laugardaga', '11:00 til 14:00'], ['Sími', '430 1415']], url: FAMILIES[4].page },
  { slug: 'bokin', sku: 'S-02', fam: 5, leaf: 'Bók', name: 'Skipavík: Saga Skipavíkur í Stykkishólmi og fyrirrennarar hennar 1900–2020', photo: 'book',
    alt: 'Bókin um sögu Skipavíkur í hillu verslunarinnar',
    attrs: [['Höfundur', 'Sigurður Bergsveinsson'], ['Efni', 'smíði 110 báta og saga um 200 báta'], ['Myndir', 'hátt í 500']], url: 'https://www.skipavik.is/index.php/frettir/skipavik-saga-skipavikur-i-stykkisholmi' },
]
export const PRODUCTS: Product[] = ITEMS.map((p, i) => ({ ...p, id: i + 1, sub: p.leaf, img: !!p.photo, white: false }))
export const FEATURED: Record<number, string[]> = {
  1: ['D-01', 'D-02', 'D-03'],
  2: ['V-01', 'V-02', 'V-03'],
  3: ['G-02', 'G-01'],
  4: ['B-02', 'B-03', 'B-01'],
  5: ['S-01', 'S-02'],
}
export const SET_TOTAL = PRODUCTS.length

export type Catalog = {
  harvested: string; source: string
  families: { n: number; slug: string; is: string; en: string; setCount: number; subs: [string, number][] }[]
  products: Product[]
}
const CATALOG: Catalog = {
  harvested: '2026-10-21', source: 'skipavik.is',
  families: FAMILIES.map((f) => {
    const ps = PRODUCTS.filter((p) => p.fam === f.n)
    const subs = [...new Set(ps.map((p) => p.sub))].map((s) => [s, ps.filter((p) => p.sub === s).length] as [string, number])
    return { n: f.n, slug: f.slug, is: f.is, en: f.en, setCount: ps.length, subs }
  }),
  products: PRODUCTS,
}
export function loadCatalog(): Promise<Catalog> { return Promise.resolve(CATALOG) }

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

/* ------------------------------------------------------------------ request lines carry no quantity: one line per job */
export type Unit = 'verk'
export const UNITS: Unit[] = ['verk']
export const UNIT_LABEL: Record<Lang, Record<Unit, string>> = { is: { verk: 'verk' }, en: { verk: 'verk' } }
export const defaultUnit = (_p: Pick<Product, 'name' | 'attrs'>): Unit => 'verk'
export const DEMO_LIST = [
  { sku: 'D-01', qty: 1, unit: 'verk' as Unit },
  { sku: 'D-03', qty: 1, unit: 'verk' as Unit },
  { sku: 'V-01', qty: 1, unit: 'verk' as Unit },
]

/* ------------------------------------------------------------------ contacts (skipavik.is footer and um-okkur, 2026-10-21) */
export const CONTACT = {
  phone: '430 1400', tel: '+3544301400', sales: 'skipavik@skipavik.is',
  street: 'Nesvegi 20', town: '340 Stykkishólmur',
  hours: [
    ['Verslun', 'Mán. til fim. 09:00 til 18:00 · Fös. 09:00 til 19:00 · Lau. 11:00 til 14:00'],
    ['Lager, Nesvegi 20', 'Mán. til fim. 08:00 til 16:10 · Fös. 08:00 til 15:00'],
    ['Skrifstofa', 'Mán. til fös. 08:00 til 15:00'],
  ] as [string, string][],
}

/* ------------------------------------------------------------------ copy (Icelandic; the engine's EN slot points at the same text) */
type Acc = { t: string; b: string; link?: [string, string] }
type Rail = { y: string; t: string; b: string; img?: string; cap?: string; alt?: string; links?: [string, string][] }

const IS = {
  htmlLang: 'is',
  title: 'Skipavík ehf. | Dráttarbraut, vélsmiðjur, byggingar og verslun í Stykkishólmi',
  description: 'Dráttarbraut fyrir allt að 400 þungatonna skip, vélsmiðjur í Stykkishólmi og á Grundartanga, byggingar og byggingarvöruverslun. Frumgerð að nýjum vef Skipavíkur.',
  skip: 'Fara í efni',
  nav: { products: 'Þjónusta', production: 'Saga', how: 'Spurt og svarað', list: 'Verkbeiðni', menu: 'Valmynd', close: 'Loka', lang: 'English', langShort: 'EN' },
  loader: 'Skipavík',
  hero: {
    kicker: 'Skipavík ehf. · Stykkishólmi og Grundartanga',
    h1: 'Slippur, smiðjur og byggingar við Breiðafjörð',
    sub: 'Dráttarbraut fyrir allt að 400 þungatonna skip, vélsmiðjur í Stykkishólmi og á Grundartanga, byggingar og byggingarvöruverslun.',
    cta: 'Skoða þjónustu', cta2: 'Senda verkbeiðni',
    cap: 'Athafnasvæði Skipavíkur í Stykkishólmi. Ljósmynd: Mats Wibe Lund.',
    alt: 'Loftmynd af Stykkishólmi: höfnin, skipasmíðasalurinn og dráttarbrautin við Breiðafjörð',
    facts: [['400', 'þungatonn', 'mesta þyngd á brautinni'], ['8,6', 'm', 'mesta breidd í sleða'], ['27', 'm', 'mesta lengd inni í húsi']] as [string, string, string][],
  },
  cat: {
    title: 'Þjónusta',
    lead: (n: number) => `Fimm svið Skipavíkur og ${n} verk og þjónustuþættir af skipavik.is. Veldu þjónustu og settu hana í verkbeiðni, eða hringdu beint í verkstjóra sviðsins.`,
    filter: 'Svið', all: 'Öll svið', search: 'Leita að þjónustu eða verki…', searchShort: 'Leita',
    az: 'A–Ö', grid: 'Svið', viewAll: 'Skoða sviðið', view: 'Skoða', add: 'Í beiðni', added: 'Í beiðninni', addToList: 'Setja í verkbeiðni',
    inSample: (a: number) => `${a} ${a === 1 ? 'atriði' : 'atriði'} á sviðinu`,
    none: 'Ekkert fannst. Prófaðu annað orð.',
    loading: 'Sæki…', error: 'Efnið náðist ekki. Endurhlaðið síðuna.',
    sku: 'Nr.', noImg: 'Mynd vantar',
    results: (n: number) => `${n} ${n === 1 ? 'atriði' : 'atriði'}`,
    jump: 'Hoppa á staf', sub: 'Flokkur', allSubs: 'Allt',
    page: 'Síða', prev: 'Fyrri síða', next: 'Næsta síða',
    back: 'Öll svið', call: 'Hringja', onSite: 'Á skipavik.is', source: 'Heimild',
  },
  how: {
    title: 'Spurt og svarað',
    contact: 'Senda verkbeiðni',
    items: [
      { t: 'Hvað á að fylgja beiðni um upptöku?', b: 'Nafn skips og skipaskrárnúmer, lengd og þyngd, hvaða verk á að vinna og hvaða daga þú hefur í huga. Mynd eða teikning flýtir fyrir. Verkbeiðnin hér á vefnum spyr um þetta allt.' },
      { t: 'Hvað stór skip komast upp?', b: 'Dráttarbrautin tekur allt að 400 þungatonna skip. Mesta breidd í sleða er 8,6 metrar og allt að 27 metra löng skip komast inn í hús.' },
      { t: 'Verk á Grundartanga', b: 'Vélsmiðja Skipavíkur á Grundartanga er við Klafastaðaveg 2. Hallfreður Ragnar Björgvinsson verkefnisstjóri svarar í síma 694 6747 og á tangi@skipavik.is.' },
      { t: 'Íbúðir í Víkurhverfi', b: 'Skipavík og Sveitarfélagið Stykkishólmur rituðu 13. apríl 2026 undir viljayfirlýsingu um 14 til 28 íbúðir vestan Borgarbrautar: parhús, einbýli og raðhús. Breyting á deiliskipulagi var auglýst 1. október og athugasemdir má senda í Skipulagsgátt til 12. nóvember 2026.', link: ['Frétt sveitarfélagsins', VIK_SRC] },
      { t: 'Opnunartímar', b: 'Verslun: mán. til fim. 09:00 til 18:00, fös. 09:00 til 19:00, lau. 11:00 til 14:00. Lager á Nesvegi 20: mán. til fim. 08:00 til 16:10, fös. 08:00 til 15:00. Skrifstofa: mán. til fös. 08:00 til 15:00.' },
    ] as Acc[],
  },
  rail: {
    title: 'Saga',
    lead: 'Skipasmíðar í Stykkishólmi í meira en öld, eins og Skipavík segir frá þeim sjálf.',
    prev: 'Fyrra spjald', next: 'Næsta spjald',
    items: [
      { y: '1900–2020', t: 'Skipasmíðar í Stykkishólmi', b: 'Bókin um sögu Skipavíkur og fyrirrennara hennar rekur smíði 110 báta, allt frá árabátum upp í nútíma fiskiskip.', img: 'saga-old', alt: 'Gömul svarthvít mynd af skipi í smíðum á slippnum' },
      { y: '1967 og 1975', t: 'Skipasmíðastöðin Skipavík', b: 'Skipasmíðastöðin Skipavík var stofnuð 1967. Árið 1975 sameinuðust Vélsmiðja Kristjáns Rögnvaldssonar og Skipasmíðastöð Stykkishólms undir nafni Skipavíkur.', img: 'slip-renewed', alt: 'Dráttarbrautin í Stykkishólmi' },
      { y: '1977', t: 'Síðasti eikarbáturinn', b: 'Síðasti nýi eikarbáturinn var smíðaður hjá Skipavík árið 1977. Síðan hafa slippurinn og vélsmiðjan unnið að viðgerðum, breytingum og smíði fyrir skip og báta.', img: 'ws-drum', alt: 'Stór stálhluti í vinnslu í vélsmiðjunni' },
      { y: '1986 og 2006', t: 'Verslunin', b: 'Skipavík hóf verslunarrekstur 1986 og flutti verslunina í eigið hús við Aðalgötu í desember 2006.', img: 'shop', alt: 'Verslunarhús Skipavíkur við Aðalgötu' },
      { y: '1998', t: 'Byggingar', b: 'Við breyttar aðstæður í bæjarfélaginu fór Skipavík út í byggingarstarfsemi og almenna verktakavinnu árið 1998. Nafninu var breytt í Skipavík árið 2005.', img: 'bld-sport', alt: 'Íþróttamiðstöðin í Stykkishólmi' },
      { y: 'Valtýr', t: 'Víkingaskipið', b: 'Valtýr byggir á Gaukstaðaskipinu: 16,5 m langur, 4,3 m breiður og ristir aðeins 1,0 m.', img: 'valtyr', alt: 'Víkingaskipið Valtýr undir seglum á Breiðafirði', links: [['Um Valtý á skipavik.is', 'https://www.skipavik.is/index.php/thjonusta/vikingaskip']] },
    ] as Rail[],
  },
  teaser: {
    title: 'Verkbeiðni',
    body: 'Veldu verkin, skráðu skipið, stærðina og þá daga sem henta, og sendu verkstjóra til yfirferðar. Beiðnin geymist í vafranum og þú getur opnað hana aftur.',
    cta: 'Opna verkbeiðni', staff: 'Sjá hvernig verkstjóri tekur við',
    note: 'Frumgerð: ekkert er sent úr þessari útgáfu.',
  },
  list: {
    h1: 'Verkbeiðni',
    lead: 'Beiðni, háð yfirferð. Verkstjóri fer yfir hana og hefur samband um tíma og verð. Hér er hvorki lofað dagsetningu né verði.',
    name: 'Skip eða verk', namePh: 'T.d. Esjar…',
    empty: 'Beiðnin er tóm. Veldu þjónustu af listanum.', browse: 'Skoða þjónustu',
    cols: { sku: 'Nr.', item: 'Verk', qty: 'Svið', unit: '', remove: 'Fjarlægja' },
    less: 'Minnka', more: 'Auka',
    project: 'Skipið og verkið', ref: 'Skipaskrárnúmer eða tilvísun', refPh: 'T.d. SH 75 eða 2330…',
    len: 'Lengd (m)', ton: 'Þyngd (þungatonn)',
    date: 'Óskaður upphafsdagur', place: 'Hvar',
    places: { selfoss: 'Dráttarbraut og vélsmiðja, Stykkishólmi', rvk: 'Vélsmiðja Grundartanga', ship: 'Á verkstað' },
    notes: 'Lýsing á verkinu', notesPh: 'T.d. botnmálun eða skipti á skrúfuöxli…',
    file: 'Mynd eða teikning', fileBtn: 'Velja skrá', fileNote: 'Í frumgerðinni er aðeins skráarheitið geymt.',
    contact: 'Tengiliður', cname: 'Nafn', company: 'Útgerð eða fyrirtæki', email: 'Netfang', phone: 'Sími',
    save: 'Vista beiðni', saved: 'Vistað', open: 'Opna vistaða beiðni', none: 'Engar vistaðar beiðnir enn',
    clear: 'Hreinsa', undo: 'Afturkalla', cleared: 'Beiðnin var hreinsuð.', demo: 'Setja inn dæmi',
    send: 'Senda til verkstjóra',
    need: 'Nafn og netfang eða sími þarf að fylgja, og a.m.k. eitt verk.',
    local: 'Í frumgerðinni eru beiðnir geymdar í þessum vafra.',
    fallback: 'Líka hægt að hringja í 430 1400 eða senda póst á skipavik@skipavik.is.',
    sum: { title: 'Yfirlit fyrir sendingu', items: (n: number) => `${n} ${n === 1 ? 'verk' : 'verk'}`, back: 'Breyta', confirm: 'Senda til yfirferðar', missing: 'Vantar' },
    ack: { title: 'Beiðni móttekin', body: 'Beiðnin fer til verkstjóra sviðsins til yfirferðar. Haft verður samband um tíma og verð.', note: 'Frumgerð: ekkert var sent. Í raunútgáfu færi beiðnin á netfang sviðsins.', num: 'Beiðni nr.', staff: 'Sjá beiðnina hjá verkstjóra', close: 'Loka' },
    units: 'Eining',
  },
  review: {
    h1: 'Yfirferð',
    lead: 'Svona gæti verkstjóri séð beiðnirnar: skipið, stærðin og verkin í einni línu, það sem vantar merkt og svar tilbúið.',
    sample: 'Sýnigögn', sampleNote: 'Línur merktar sýnigögn eru tilbúin dæmi, ekki raunverulegar beiðnir.',
    yours: 'Beiðnin þín',
    cols: { no: 'Nr.', from: 'Frá', ref: 'Skip eða verk', lines: 'Verk', date: 'Upphaf', status: 'Staða' },
    status: { new: 'Ný', review: 'Í skoðun', quoted: 'Svar sent' },
    flags: 'Athuga', noFlags: 'Ekkert vantar',
    flag: { date: 'Upphafsdag vantar', place: 'Staðsetningu vantar', ref: 'Skipaskrárnúmer vantar', unit: 'Óljóst', size: 'Lengd eða þyngd vantar' },
    reply: 'Svar til viðskiptavinar',
    replyText: (name: string, ref: string) => `Sæl/l ${name},\n\ntakk fyrir beiðnina${ref ? ` vegna ${ref}` : ''}. Við förum yfir hana og höfum samband um tíma í slipp og verð.\n\nKveðja,\nSkipavík\n430 1400`,
    mark: 'Merkja í skoðun', quote: 'Merkja svar sent', pick: 'Veldu beiðni til að sjá hana.',
    back: 'Aftur í verkbeiðni',
  },
  foot: {
    hq: 'Skipavík', hqNote: 'Skrifstofa, dráttarbraut, vélsmiðja og lager',
    tangi: 'Grundartangi', tangiNote: 'Vélsmiðja, Klafastaðavegi 2',
    phone: 'Sími', email: 'Netfang', orig: 'Núverandi vefur: skipavik.is',
    names: 'Texti, staðreyndir og ljósmyndir eru af skipavik.is og frá Sveitarfélaginu Stykkishólmi, sótt 21. október 2026.',
  },
}
export const T = { is: IS, en: IS }
export type Copy = typeof IS

/* staff queue: made-up rows, always labelled sample data on screen */
export const SAMPLE_QUEUE = [
  { no: 'B-2042', from: 'Útgerð, Snæfellsnesi', ref: 'Upptaka og málning', lines: 2, date: '2026-11-10', status: 'review' as const, flags: [] as string[] },
  { no: 'B-2041', from: 'Útgerð, Vestfjörðum', ref: 'Skrúfa og öxull', lines: 1, date: '', status: 'new' as const, flags: ['date', 'size'] },
  { no: 'B-2039', from: 'Verktaki, Grundartanga', ref: '', lines: 1, date: '2026-11-02', status: 'new' as const, flags: ['ref'] },
  { no: 'B-2036', from: 'Einstaklingur, Stykkishólmi', ref: 'Íbúð í Víkurhverfi', lines: 1, date: '', status: 'quoted' as const, flags: [] as string[] },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Skipavík ehf.',
  url: 'https://www.skipavik.is/',
  telephone: '+354 430 1400',
  email: 'skipavik@skipavik.is',
  address: { '@type': 'PostalAddress', streetAddress: 'Nesvegur 20', postalCode: '340', addressLocality: 'Stykkishólmur', addressCountry: 'IS' },
}

export const companyEntry: PreviewCompany = {
  slug: 'skipavik',
  route: '/preview/skipavik',
  name: 'Skipavík ehf.',
  sector: 'Dráttarbraut, vélsmiðjur, byggingar og byggingarvöruverslun',
  location: 'Nesvegur 20, 340 Stykkishólmur',
  region: 'Vesturland',
  established: 'Skipasmíðastöðin Skipavík 1967, sameinuð 1975 (skipavik.is).',
  currentUrl: 'https://www.skipavik.is',
  ownerEmail: 'skipavik@skipavik.is',
  concept: 'Verkbeiðni fyrir slipp og smiðjur',
  conceptTagline:
    'Fimm svið Skipavíkur á einum stað, hvert með sínum verkstjóra og eigin verkum. ' +
    'Úr þjónustulistanum verður til verkbeiðni með skipi, stærð og dögum sem fer beint til verkstjóra sviðsins.',
  accent: '#CF9253',
  dark: false,
  status: 'In build',
  thumb: `${BASE}skipavik/img/yard-aerial-800.webp`,
  ownPhotography: true,
  photoCredit:
    'Ljósmyndir, texti og merki eru í eigu Skipavíkur ehf. og sótt af skipavik.is 21. október 2026. Loftmynd: Mats Wibe Lund.',
  audit: {
    strengths: [
      'Skýr og mæld geta dráttarbrautar: 400 þungatonn, 8,6 m sleði, 27 m inni í húsi',
      'Starfsfólk með beinum símanúmerum á hverju sviði',
      'Eigið myndasafn: skip í slipp, smiðjur, byggingar og saga',
    ],
    weaknesses: [
      'Fyrirspurnarformið spyr hvorki um skip, stærð né daga',
      'Fréttasíðan sýnir „Frétt 1“ með lorem ipsum texta (21. okt. 2026)',
      'Engin lýsing (meta description) á neinni síðu og síðan merkt á ensku (lang en-gb)',
    ],
    opportunities: [
      'Verkbeiðni sem fer beint til verkstjóra rétta sviðsins með öllu sem þarf',
      'Verk og þjónusta hvers sviðs á sinni slóð, sem Google getur fundið',
      'Víkurhverfi: staðfestar upplýsingar og skráning áhuga þegar Skipavík vill',
    ],
  },
  positioning:
    'Skipavík er með getuna, fólkið og myndirnar. Það sem vantar er leiðin frá vefnum að skýrri beiðni sem verkstjóri getur svarað án þess að elta upplýsingar.',
  outreach: {
    subject: 'Hugmynd að nýjum vef fyrir Skipavík',
    body:
      'Ég setti saman frumgerð þar sem hvert svið Skipavíkur er á sínum stað og útgerð getur sent verkbeiðni með skipi, stærð og dögum beint til verkstjóra. ' +
      'Gaman væri að sýna þér hana, án nokkurrar skuldbindingar.',
  },
}
