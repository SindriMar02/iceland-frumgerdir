import type { PreviewCompany } from '../company-types'
import RAW from './products.json'

/*
 * Umbúðagerðin ehf. Every fact here was read on 15.10.2026 from umbudagerdin.is (the Kassagerð, Kassamál,
 * Þjónusta, Um okkur, Umhverfisábyrgð, Hringrás and shop pages), the public WooCommerce Store API
 * (338 products, 18 categories) and Skatturinn's company register (kt 590214-1670).
 * Harvest + sources: _docs/umbudagerdin-harvest-2026-10-15/ (products-all.json, pages.json, raw/).
 * Shortlist, inspiration and the WooCommerce dive: _docs/umbudagerdin-inspiration-2026-10-15/SHORTLIST.md.
 */

const BASE = import.meta.env.BASE_URL
export const A = (name: string) => `${BASE}umbudagerdin/${name}`
export const ROUTE = '/preview/umbudagerdin'

export type Photo = { src: string; srcSet: string; alt: string; w: number; h: number }
const mk = (name: string, widths: number[], w: number, h: number, alt: string): Photo => ({
  src: A(`${name}-${widths[widths.length - 1]}.webp`), srcSet: widths.map((x) => `${A(`${name}-${x}.webp`)} ${x}w`).join(', '), alt, w, h,
})
/* their own photography: the 2020 shoot (hands opening a kraft box on white), the open FEFCO box on kraft board, the honeycomb sheet */
export const PHOTOS = {
  hands: mk('hero-hands', [800, 1400, 2000], 5184, 3888, 'Hendur opna brúnan pappakassa á hvítum fleti'),
  box: mk('28x28-3', [640, 1200], 1920, 2560, 'Opinn brúnn pappakassi á pappa'),
  honey: mk('honeyc1', [640, 1200], 1920, 2560, 'Honeycomb pappaörk, 20 mm þykk'),
  /* from their public Facebook page (2025–2026 posts), placeholders until they send originals */
  verslun: mk('fb-verslun', [800, 1400], 1609, 2048, 'Afgreiðslan á Reykjavíkurvegi 70: kassar á borði, hillur með vörum'),
  jolamenn: mk('fb-jolamenn', [800, 1400], 1536, 2048, 'Tveir starfsmenn halda á rauðum jólakössum í afgreiðslunni'),
  dagatal: mk('fb-dagatal', [800, 1200], 1536, 2048, 'Jóladagatal úr bylgjupappa með 24 lúgum'),
  stand1: mk('fb-stand-1', [600, 1000], 1536, 2048, 'Starfsfólk Umbúðagerðarinnar á sýningarbás með stöflum af kössum'),
  stand2: mk('fb-stand-2', [600, 1000], 1536, 2048, 'Tvö úr starfsfólkinu við kassastafla á sýningarbásnum'),
  stand3: mk('fb-stand-3', [600, 1000], 1290, 1716, 'Hópur gesta og starfsfólks á sýningarbásnum'),
  stand4: mk('fb-stand-4', [600, 1000], 1536, 2048, 'Fjögur á sýningarbásnum fyrir framan merkið'),
}

export const CONTACT = {
  legal: 'Umbúðagerðin ehf.',
  kt: '590214-1670',
  vsk: '117952',
  street: 'Reykjavíkurvegur 70',
  town: '220 Hafnarfjörður',
  phone: '588 4440',
  tel: '+3545884440',
  email: 'umbudagerdin@umbudagerdin.is',
  facebook: 'https://www.facebook.com/umbudagerdin',
  hours: 'Mán. til fim. 8.30 til 16.30, fös. 8.30 til 15.00',
  hoursShort: 'Mán. til fim. 8.30 til 16.30 · fös. 8.30 til 15.00',
  slogan: 'Hjá okkur er það stærðin sem skiptir mestu',
  summary: 'Umbúðagerðin framleiðir pappakassa úr bylgjupappa í Hafnarfirði í þeirri stærð sem óskað er eftir, prentar á kassa, býður kassa í áskrift og rekur vefverslun með kassa, poka, bönd, kassakurl og pökkunarbúnað.',
}
export const PEOPLE = [
  { name: 'Sigrún Edda Eðvarðsdóttir', role: 'Framkvæmdastjóri' },
  { name: 'Bjarni Geir Eyþórsson', role: 'Framleiðslustjóri' },
  { name: 'Eyþór Páll Hauksson', role: 'Ráðgjafi, framkvæmdastjóri Prentmiðlunar' },
]

/* Icelandic count: 1 and 21, 31... take the singular (vara), 11 does not */
export const sg = (n: number) => n % 10 === 1 && n % 100 !== 11
export const vorur = (n: number) => `${n.toLocaleString('de-DE')} ${sg(n) ? 'vara' : 'vörur'}`
export const kr = (n: number) => `${Math.round(n).toLocaleString('de-DE')} kr.`
export const mm = (n: number) => `${n.toLocaleString('de-DE')} mm`

/* ── the catalogue (a representative sample of the real shop, prices and SKUs as published) ──────────── */

export type Product = {
  id: number; slug: string; sku: string; name: string; cat: string; cats: string[]; price: number; regular: number
  short: string; desc: string; dims: [number, number, number] | null; pack: number | null
  img: Photo; catKey: string; permalink: string
}
export const slugify = (s: string) => s.toLowerCase().replace(/&amp;|&/g, 'og').replace(/á/g, 'a').replace(/ð/g, 'd').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ý/g, 'y').replace(/þ/g, 'th').replace(/æ/g, 'ae').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

type Raw = { id: number; slug: string; sku: string; name: string; cat: string; cats: string[]; price: number; regular: number; short: string; desc: string; dims: number[] | null; pack: number | null; img: { widths: number[]; w: number; h: number }; permalink: string }
const tidy = (s: string) => s.replace(/\s*-\s*Hafið samband/i, '').replace(/\s+/g, ' ').trim()
export const PRODUCTS: Product[] = (RAW as Raw[]).map((r) => ({
  ...r,
  name: tidy(r.name),
  dims: r.dims && r.dims.length === 3 ? [r.dims[0], r.dims[1], r.dims[2]] as [number, number, number] : null,
  catKey: slugify(r.cat),
  img: { src: A(`p/${r.slug}-${r.img.widths[r.img.widths.length - 1]}.webp`), srcSet: r.img.widths.map((w) => `${A(`p/${r.slug}-${w}.webp`)} ${w}w`).join(', '), alt: tidy(r.name), w: r.img.w, h: r.img.h },
}))
export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug)

/* category order: boxes first (the factory's own product), then what goes around and inside them */
const CAT_ORDER = ['Sendingarkassar', 'Gjafakassar', 'Pizzakassar', 'Bakkar', 'Vefverslunarpokar og umslög', 'Pokar', 'Pökkunarlausnir', 'Kassakurl', 'Borðar og bönd', 'Límbönd', 'Pökkunarbúnaður', 'Öryggishnífar & skæri', 'Slice auka blöð', 'Hringrásarlausnir']
/* the real counts of the whole shop (Store API categories, 2026-10-15), so the tiles tell the truth about the full range */
const FULL_COUNT: Record<string, number> = { Sendingarkassar: 7, Gjafakassar: 61, Pizzakassar: 5, Bakkar: 4, 'Vefverslunarpokar og umslög': 16, Pokar: 37, 'Pökkunarlausnir': 16, Kassakurl: 29, 'Borðar og bönd': 36, 'Límbönd': 6, 'Pökkunarbúnaður': 7, 'Öryggishnífar & skæri': 99, 'Slice auka blöð': 17, 'Hringrásarlausnir': 5 }
export const SHOP_CATS = CAT_ORDER.filter((c) => PRODUCTS.some((p) => p.cat === c)).map((c) => ({ key: slugify(c), label: c, count: PRODUCTS.filter((p) => p.cat === c).length, full: FULL_COUNT[c] ?? 0 }))
export const SHOP_TOTAL = 338
export const BOX_CATS = new Set(['sendingarkassar', 'gjafakassar', 'pizzakassar', 'bakkar'])
export const catLabel = (key: string) => SHOP_CATS.find((c) => c.key === key)?.label ?? 'Verslun'

/* ── Kassamál: their own rules, from umbudagerdin.is/kassamal ─────────────────────────────────────────── */

export const FLUTES = [
  { key: 'E', label: 'E-bylgja', thick: 1.5, line: 'um 1,5 mm, fín og slétt; gjafakassar, léttar vörur' },
  { key: 'B', label: 'B-bylgja', thick: 3, line: 'um 3 mm, algengasti sendingarkassinn' },
  { key: 'C', label: 'C-bylgja', thick: 4, line: 'um 4 mm, burðarmeiri; þyngri vörur og stöflun' },
  { key: 'BC', label: 'Tvöföld bylgja', thick: 7, line: 'B + C saman; flutningskassar og brettakassar' },
] as const
export type FluteKey = (typeof FLUTES)[number]['key']
export const COLOURS = [
  { key: 'bb', label: 'Brúnn / brúnn', line: 'brúnn að utan og innan' },
  { key: 'hb', label: 'Hvítur / brúnn', line: 'hvítur að utan, brúnn að innan' },
] as const
export type ColourKey = (typeof COLOURS)[number]['key']
export const STYLES = [
  { key: '0201', label: 'FEFCO 0201', line: 'Lagerkassinn: fjórir flipar sem mætast, límband yfir. Algengasti kassi í heimi.' },
  { key: '0427', label: 'FEFCO 0427', line: 'Póstkassi með loki á hjörum, stansaður úr einni örk, engin límbönd.' },
  { key: '0203', label: 'FEFCO 0203', line: 'Eins og 0201 en með flipum sem ná alla leið yfir; tvöfalt lok og botn.' },
  { key: 'annad', label: 'Annað', line: 'Bakkar, hólkar, millispjöld, kassar með glugga. Segðu okkur hvað á í hann.' },
] as const
export type StyleKey = (typeof STYLES)[number]['key']
export const RHYTHMS = [
  { key: 'einu-sinni', label: 'Einu sinni' },
  { key: 'manadarlega', label: 'Mánaðarlega' },
  { key: 'arsfjordungslega', label: 'Ársfjórðungslega' },
  { key: 'eftir-thorfum', label: 'Eftir þörfum' },
] as const

/* bulk tiers: Discount Rules for WooCommerce is already installed on their site (table switched off).
   These rows are a SAMPLE of the mechanism; Umbúðagerðin sets the real steps. The UI says so. */
export const TIERS = [
  { min: 1, pct: 0 },
  { min: 10, pct: 5 },
  { min: 50, pct: 10 },
  { min: 200, pct: 15 },
]
export const tierFor = (qty: number) => [...TIERS].reverse().find((t) => qty >= t.min) ?? TIERS[0]
export const TIER_NOTE = 'Afsláttarþrepin eru sýnishorn: Umbúðagerðin stillir sín eigin þrep í Discount Rules, sem er þegar uppsett á vefnum.'

/* ── Kassamál fit: which stock boxes take a product of L × B × H (inner mm, their formula) ────────────── */

export type Fit = { p: Product; slack: number; turned: boolean }
export const MAX_SLACK = 4
/* slack = box volume / product volume; the box must take the product upright (L and B may swap, H never does) */
export function findFits(l: number, b: number, h: number, n = 6): Fit[] {
  return allFits(l, b, h).filter((f) => f.slack <= MAX_SLACK).slice(0, n)
}
export function allFits(l: number, b: number, h: number): Fit[] {
  if (!(l > 0 && b > 0 && h > 0)) return []
  const want = l * b * h
  const out: Fit[] = []
  for (const p of PRODUCTS) {
    if (!p.dims || !BOX_CATS.has(p.catKey)) continue
    const [pl, pb, ph] = p.dims
    const straight = pl >= l && pb >= b && ph >= h
    const turned = pl >= b && pb >= l && ph >= h
    if (!straight && !turned) continue
    out.push({ p, slack: (pl * pb * ph) / want, turned: !straight && turned })
  }
  return out.sort((a, c) => a.slack - c.slack)
}

/* ── requests (forms store here; nothing is sent) ─────────────────────────────────────────────────────── */

export type ReqKind = 'serframleidsla' | 'pontun' | 'askrift' | 'prentun'
export const REQ_LABEL: Record<ReqKind, string> = { serframleidsla: 'Sérframleiðsla', pontun: 'Pöntun', askrift: 'Áskrift', prentun: 'Prentun' }
export const routeTo = (k: ReqKind) => (k === 'pontun' ? 'Vefverslun, afgreiðsla' : k === 'prentun' ? 'Prentun, Bjarni Geir' : 'Framleiðsla, Bjarni Geir')
export type Request = { id: string; kind: ReqKind; title: string; when: string; who: string; contact: string; detail: string; status: 'ný' | 'staðfest'; at: string }
const RKEY = 'ug-requests'
export function loadRequests(): Request[] { try { return JSON.parse(sessionStorage.getItem(RKEY) ?? '[]') as Request[] } catch { return [] } }
export function saveRequest(r: Omit<Request, 'id' | 'status' | 'at'>): Request {
  const all = loadRequests()
  const id = `UG-${String(1041 + all.length).padStart(4, '0')}`
  const req: Request = { ...r, id, status: 'ný', at: new Date().toISOString() }
  try { sessionStorage.setItem(RKEY, JSON.stringify([req, ...all])) } catch { /* private mode */ }
  return req
}
export const SAMPLE_REQUESTS: Request[] = [
  { id: 'UG-DÆMI-03', kind: 'serframleidsla', title: 'Kassi 340 × 240 × 120 mm, B-bylgja, hvítur/brúnn', when: 'Afhending í viku 44', who: 'Dæmi: vefverslun', contact: '555 0000, daemi@example.com', detail: 'FEFCO 0201, 500 stk., prentun í einum lit (PDF fylgir). Mánaðarleg áskrift.', status: 'staðfest', at: '2026-10-13T09:40:00Z' },
  { id: 'UG-DÆMI-02', kind: 'pontun', title: '3 vörur, 21.219 kr.', when: 'Sótt á Reykjavíkurvegi 70', who: 'Dæmi: hönnunarstofa', contact: '555 0000', detail: '2 × Gjafakassi 200x150x80mm; 1 × Bókakassar 465x310x243 mm, 20 stk', status: 'ný', at: '2026-10-14T14:05:00Z' },
  { id: 'UG-DÆMI-01', kind: 'prentun', title: 'Prentun á 1.000 sendingarkassa', when: 'Verðtilboð', who: 'Dæmi: matvælafyrirtæki', contact: 'daemi@example.com', detail: 'Flexo, tveir litir, prentklisja til.', status: 'ný', at: '2026-10-15T08:12:00Z' },
]
export const SAMPLE_NOTE = `Frumgerð: ${PRODUCTS.length} af ${SHOP_TOTAL} vörum úr vefverslun Umbúðagerðarinnar eru sýndar hér (kassaflokkarnir allir, úrtak úr hinum), með verðum og vörunúmerum eins og þau voru 15. október 2026.`

/* ── questions, from their own pages ──────────────────────────────────────────────────────────────────── */

export const FAQ: { q: string; a: string; link: [string, string] }[] = [
  { q: 'Hvernig mæli ég kassann?', a: 'Málin sem við vinnum með eru innri mál kassans, sem er það sama og ytra mál vörunnar sem á að fara í hann. Lengd er lengsta hliðin, breidd sú styttri og hæð er dýptin frá botni að opnun. Allt í millimetrum.', link: ['Opna Kassamál', 'kassamal'] },
  { q: 'Hvað þarf kassinn að vera sterkur?', a: 'Því þykkari sem bylgjan er, því sterkari og burðugri er kassinn. E-bylgja er um 1,5 mm, B-bylgja um 3 mm og C-bylgja um 4 mm. Hægt er að velja einfalda eða tvöfalda bylgju.', link: ['Sjá bylgjurnar', 'kassagerd#bylgja'] },
  { q: 'Brúnn eða hvítur?', a: 'Hver kassi hefur þrjú lög: ytra lag, bylgjuna sjálfa og innra lag. Brúnn kassi er brúnn að innan líka. Hvítur kassi er hvítur að utan og brúnn að innan. Aðrir litir eru sérpöntun.', link: ['Velja lit undir Kassamál', 'kassamal'] },
  { q: 'Hvað er FEFCO 0201?', a: 'Evrópski hönnunarstaðallinn fyrir umbúðir. 0201 er lagerkassinn með fjórum flipum, algengasti kassi í heimi, og við gerum hann nánast í þeirri stærð sem óskað er eftir, að því tilskildu að hráefnið sé til í húsi.', link: ['Sjá kassagerðir', 'kassagerd'] },
  { q: 'Getið þið prentað á kassann?', a: 'Já, með flexo-prentun. Þú sendir prentskjal í PDF og tilgreinir liti; við útbúum prentklisju sem nýtist aftur og aftur. Litirnir eru úr jurtaríkinu, vatns- og rakaþolnir.', link: ['Biðja um prentun', 'fyrirspurn?prent=1'] },
  { q: 'Hvað eru kassar í áskrift?', a: 'Minna í senn og oftar, í stað þess að binda fjármagn og fermetra í lager. Afgreiðslutími, magn, bylgjutegund og afhending eftir þínum þörfum: mánaðarlega, ársfjórðungslega eða eins og hentar.', link: ['Setja upp áskrift', 'fyrirspurn?askrift=1'] },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Umbúðagerðin ehf.',
  url: 'https://umbudagerdin.is',
  telephone: CONTACT.tel,
  email: CONTACT.email,
  address: { '@type': 'PostalAddress', streetAddress: CONTACT.street, addressLocality: 'Hafnarfjörður', postalCode: '220', addressCountry: 'IS' },
  openingHours: ['Mo-Th 08:30-16:30', 'Fr 08:30-15:00'],
  vatID: CONTACT.vsk,
}

export const companyEntry: PreviewCompany = {
  slug: 'umbudagerdin',
  route: ROUTE,
  name: 'Umbúðagerðin',
  sector: 'Kassagerð og umbúðir',
  location: 'Reykjavíkurvegur 70, 220 Hafnarfjörður',
  region: 'Höfuðborgarsvæðið',
  established: 'Skráð í febrúar 2014, eigin framleiðsla frá janúar 2021',
  currentUrl: 'https://umbudagerdin.is',
  ownerEmail: CONTACT.email,
  concept: 'Hjá okkur er það stærðin sem skiptir mestu',
  conceptTagline: 'The Víkurverk round-3 engine (Lightship framing, Mammut shop, Pebble chooser) re-aimed at a corrugated-box factory with a WooCommerce shop: the signature is Kassamál, where three measurements redraw the FEFCO 0201 box to scale and list the stock boxes that fit with real prices, or become a custom-box request. The shop keeps your place (list state in the URL), shows the SKU on every product, pages with real links instead of "load more", and carries the bulk-discount tier mechanism their site already owns but hides.',
  accent: '#AC2619',
  dark: false,
  status: 'In build',
  thumb: A('hero-hands-800.webp'),
  ownPhotography: true,
  photoCredit: 'Myndir af umbudagerdin.is (ljósmyndataka Umbúðagerðarinnar 2020 og vörumyndir vefverslunarinnar), október 2026. Merki af umbudagerdin.is.',
  audit: {
    strengths: ['Eigin framleiðsla í Hafnarfirði síðan 2021', '338 vörur í vefverslun með verðum og vörunúmerum', 'Kassamál-síðan útskýrir mál, bylgju og liti á mannamáli'],
    weaknesses: ['"Sjá meira" í vefversluninni týnir staðnum þegar farið er til baka', 'Sérframleiðsla er aðeins fyrirspurnarform, engin leið að setja upp kassann', 'Prentun-síðan er lorem ipsum; 18 vörur á 0 kr. án fyrirspurnarhnapps'],
    opportunities: ['Kassamál sem tæki: mál inn, kassar sem passa út', 'Listi + afgreiðsla sem nýtist líka sem kassakerfi', 'Magnafsláttur sýnilegur á hverri vöru'],
  },
  positioning: 'Umbúðagerðin sérframleiðir pappakassa í Hafnarfirði og rekur vefverslun með umbúðir; kassinn er mældur innan, lengd × breidd × hæð í millimetrum.',
  outreach: {
    subject: 'Umbúðagerðin: hugmynd að nýjum vef',
    body: 'Sæll Heiðar,\n\nHér er frumgerðin sem ég lofaði:\n\n[HLEKKUR Á FRUMGERÐ]\n\nKveðja,\nSindri Már',
  },
}
