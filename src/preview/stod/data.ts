import type { PreviewCompany } from '../company-types'

/* Content for /preview/stod (Icelandic) and /preview/stod/en.
   Every sentence about STOÐ comes from pallaleiga.is as read on 2 October 2026 (harvest: _docs/stod-build-2026-10-02/harvest/,
   page text in pages.txt). Where a heading had to be shortened it is condensed from their sentence. Prices are the prices
   pallaleiga.is publishes on its product pages, read 2 October 2026; the site does not say whether VAT is included.
   Sample requests on /beidnir are marked SAMPLE (Dæmigögn / Sample data) wherever they appear. */

export type Lang = 'is' | 'en'
export interface Bi { is: string; en: string }
const L = (is: string, en: string): Bi => ({ is, en })
export const pick = (b: Bi, lang: Lang) => b[lang]

const BASE = import.meta.env.BASE_URL
export const img = (f: string) => `${BASE}stod/${f}.webp`
export const brand = (f: string) => `${BASE}stod/brand/${f}`
export const ROUTE_IS = `${BASE}preview/stod`
export const ROUTE_EN = `${BASE}preview/stod/en`

export const READ_DATE: Bi = L('2. október 2026', '2 October 2026')
export const PHONE = { display: '571 0600', href: 'tel:+3545710600' }
export const QUOTE_PHONE = { name: 'Lúðvík', display: '660 7604', href: 'tel:+3546607604' }
export const MAIL = 'pallaleiga@pallaleiga.is'
export const ADDRESS = 'Tunguháls 17, 110 Reykjavík'
export const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Tunguh%C3%A1ls%2017%2C%20110%20Reykjav%C3%ADk'
export const SITE_URL = 'https://www.pallaleiga.is/'

/** 2.550 kr. / ISK 2,550 */
export const kr = (n: number, lang: Lang) => {
  const s = n.toLocaleString('en-US')
  return lang === 'is' ? `${s.replace(/,/g, '.')} kr.` : `ISK ${s}`
}
/** 6,5 m / 6.5 m */
export const m = (n: number, lang: Lang) => `${lang === 'is' ? String(n).replace('.', ',') : String(n)} m`

/* -------------------------------------------------------------------------------------------- published prices
   pallaleiga.is/einfaldur-hjolapallur, /tvofaldur-hjolapallur, /einfaldur-samanbrotinn-hjolapallur, /stigi-varitex-prof,
   /trappa-andes, /troppustigi-challanger, /loftastodhir, /viralyftur. Week = "Vikuleiga" as published (five days' price). */
export interface TowerRow { stand: number; work: number; single: [number, number]; double: [number, number] }
export const TOWERS: TowerRow[] = [
  { stand: 2.5, work: 4.5, single: [2550, 12750], double: [2700, 13500] },
  { stand: 3.5, work: 5.5, single: [2760, 13800], double: [3000, 15000] },
  { stand: 4.5, work: 6.5, single: [3400, 17000], double: [3800, 19000] },
  { stand: 5.5, work: 7.5, single: [3700, 18500], double: [4200, 21000] },
  { stand: 6.5, work: 8.5, single: [4500, 22500], double: [5400, 27000] },
  { stand: 7.5, work: 9.5, single: [4800, 24000], double: [5700, 28500] },
  { stand: 8.5, work: 10.5, single: [5450, 27250], double: [6600, 33000] },
  { stand: 9.5, work: 11.5, single: [5800, 29000], double: [6900, 34500] },
]
export const FOLDING = { stand: L('0,5-1,8 m', '0.5-1.8 m'), work: L('2,5-3,8 m', '2.5-3.8 m'), day: 2200, week: 11000 }
export const FLAT = { ladder: [2500, 12500], steps: [2500, 12500], roof: [2500, 12500] } as const
export const PROPS = { len: L('2,5-5,5 m', '2.5-5.5 m'), day: 150, week: 750 }
export const HOIST = { len: L('1-14 m', '1-14 m'), week: 50000 }

/* the rental form's product list: value = key used by the price estimate */
export const PRODUCTS: Array<{ key: string; label: Bi }> = [
  { key: 'tower-single', label: L('Hjólapallur, einfaldur (0,75 m breiður)', 'Mobile tower, single width (0.75 m)') },
  { key: 'tower-double', label: L('Hjólapallur, tvöfaldur (1,35 m breiður)', 'Mobile tower, double width (1.35 m)') },
  { key: 'tower-folding', label: L('Samanbrotinn hjólapallur', 'Folding mobile tower') },
  { key: 'ladder', label: L('Stigi', 'Ladder') },
  { key: 'steps', label: L('Tröppur', 'Step ladder') },
  { key: 'roof', label: L('Þakstigi', 'Roof ladder') },
  { key: 'props', label: L('Loftastoðir', 'Ceiling props') },
  { key: 'hoist', label: L('Víralyfta (Power climber)', 'Suspended platform (Power climber)') },
  { key: 'unsure', label: L('Veit ekki, ég lýsi verkinu', "Not sure, I'll describe the job") },
]
export const HEIGHTS: Bi[] = [FOLDING.work, ...TOWERS.map((r) => L(`${String(r.work).replace('.', ',')} m`, `${r.work} m`)), L('Veit ekki', 'Not sure')]

/** price estimate from the published price list; null when the product is priced by quote */
export function estimate(product: string, heightIdx: number, qty: number, lang: Lang): string | null {
  const per = (d: number, w: number, unit = '') =>
    lang === 'is' ? `${kr(d, lang)}${unit} á dag eða ${kr(w, lang)}${unit} vikan` : `${kr(d, lang)}${unit} a day or ${kr(w, lang)}${unit} a week`
  if (product === 'tower-folding') return per(FOLDING.day, FOLDING.week)
  if (product === 'tower-single' || product === 'tower-double') {
    const row = TOWERS[heightIdx - 1]
    if (!row) return null
    const p = product === 'tower-single' ? row.single : row.double
    return per(p[0], p[1])
  }
  if (product === 'ladder' || product === 'steps' || product === 'roof') return per(FLAT[product][0], FLAT[product][1])
  if (product === 'props') {
    const n = Math.max(1, qty || 1)
    const each = lang === 'is' ? ' á stykki' : ' each'
    return n > 1 ? `${per(PROPS.day * n, PROPS.week * n)} (${n} × ${kr(PROPS.day, lang)}${each})` : per(PROPS.day, PROPS.week, each)
  }
  if (product === 'hoist') return lang === 'is' ? `${kr(HOIST.week, lang)} vikan` : `${kr(HOIST.week, lang)} a week`
  return null
}

/* -------------------------------------------------------------------------------------------- sales: what STOÐ sells and from whom
   pallaleiga.is/sala, read 2 October 2026. Their own links, two corrected: Amadio for system scaffolding pointed at asc-bv.nl,
   and "ACS group" is the same ASC group link. The page's "Slyskjur" row is left out until STOÐ says what it is. */
export const SUPPLIERS = {
  asc: { name: 'ASC group', url: 'https://www.asc-bv.nl/' },
  layher: { name: 'Layher', url: 'https://www.layher.com/' },
  amadio: { name: 'Amadio', url: 'https://www.amadio.com/' },
  arrigoni: { name: 'Arrigoni', url: 'https://www.arrigoni.it/' },
  titan: { name: 'Titan Ladders', url: 'https://www.titanladders.co.uk/' },
  powerclimber: { name: 'Powerclimber', url: 'https://www.powerclimber.be/' },
} as const
type SupplierKey = keyof typeof SUPPLIERS
export const FOR_SALE: Array<{ name: Bi; from: SupplierKey[] }> = [
  { name: L('Hjólapallar', 'Mobile towers'), from: ['asc', 'layher'] },
  { name: L('Vinnupallar og kerfispallar', 'Scaffolding and system scaffolding'), from: ['amadio'] },
  { name: L('Net á vinnupalla', 'Scaffold netting'), from: ['arrigoni'] },
  { name: L('Stigar og tröppur', 'Ladders and steps'), from: ['asc', 'titan'] },
  { name: L('Víralyftur', 'Suspended platforms'), from: ['powerclimber'] },
  { name: L('Girðingar utan um vinnusvæði', 'Site fencing'), from: ['amadio'] },
  { name: L('Öryggishandrið fyrir svalir o.fl.', 'Safety railings for balconies and more'), from: ['amadio'] },
]

/* -------------------------------------------------------------------------------------------- collections */
export interface Fact { img: string; alt: Bi; stat: [Bi, Bi]; desc: Bi; pos?: string }
export interface LedgerCell { main: Bi; small?: Bi }
export interface LedgerRow { title: Bi; sub?: Bi; a: LedgerCell; b: LedgerCell; go: Bi; prefill: Record<string, string> }
export interface Collection {
  key: 'hjolapallar' | 'vinnupallar' | 'viralyftur' | 'stigar'
  name: Bi; marquee: Bi; blurb: [Bi, Bi]
  description: Bi
  hero: string; heroAlt: Bi; cover: string
  slides: Array<{ f: string; alt: Bi }>
  lead: Bi; chip: Bi; galleryTitle: Bi; galleryText: Bi
  quoteImg: string; quote: Bi; quoteSource: Bi
  breaks: [{ f: string; alt: Bi }, { f: string; alt: Bi }]
  labels: [Bi, Bi]
  facts: Fact[]
  pull?: Bi
  cta: Bi; ctaPrefill: Record<string, string>
  ledgerTitle: Bi; ledgerHead: [Bi, Bi, Bi]; ledgerNote: Bi
  rows: LedgerRow[]
  source: string
  card: { from: Bi; range: Bi; service: Bi }
}

const day = L('á dag', 'a day')
const towerRow = (r: TowerRow): LedgerRow => ({
  title: L(`${String(r.work).replace('.', ',')} m`, `${r.work} m`),
  sub: L(`standhæð ${String(r.stand).replace('.', ',')} m`, `platform at ${r.stand} m`),
  a: { main: L(kr(r.single[0], 'is'), kr(r.single[0], 'en')), small: L(`á dag · ${kr(r.single[1], 'is')} vikan`, `a day · ${kr(r.single[1], 'en')} a week`) },
  b: { main: L(kr(r.double[0], 'is'), kr(r.double[0], 'en')), small: L(`á dag · ${kr(r.double[1], 'is')} vikan`, `a day · ${kr(r.double[1], 'en')} a week`) },
  go: L('Panta', 'Book'),
  prefill: { height: String(TOWERS.indexOf(r) + 1) },
})
const flatRow = (title: Bi, sub: Bi, d: number, w: number, product: string): LedgerRow => ({
  title, sub,
  a: { main: L(kr(d, 'is'), kr(d, 'en')), small: day },
  b: { main: L(kr(w, 'is'), kr(w, 'en')), small: L('vikan', 'a week') },
  go: L('Panta', 'Book'),
  prefill: { product },
})
const quoteRow = (title: Bi, sub: Bi, need: Bi, prefill: Record<string, string>): LedgerRow => ({
  title, sub,
  a: { main: L('Tilboð', 'Quote'), small: L('þér að kostnaðarlausu', 'free of charge') },
  b: { main: need },
  go: L('Fá tilboð', 'Get a quote'),
  prefill: { tab: 'partners', ...prefill },
})

export const COLLECTIONS: Collection[] = [
  {
    key: 'hjolapallar',
    name: L('Hjólapallar', 'Mobile towers'), marquee: L('Hjólapallar', 'Mobile towers'),
    blurb: [L('Leiga og sala', 'Rent or buy'), L('Vinnuhæð 2,5-11,5 m', 'Working height 2.5-11.5 m')],
    description: L('Hjólapallar til leigu hjá STOÐ pallaleigu: einfaldir, tvöfaldir og samanbrotnir, vinnuhæð 2,5 til 11,5 m, frá 2.200 kr. á dag. Tunguháls 17, Reykjavík.', 'Mobile scaffold towers for hire from STOÐ pallaleiga: single, double and folding, working height 2.5 to 11.5 m, from ISK 2,200 a day. Tunguháls 17, Reykjavík.'),
    hero: 'hj-hero', heroAlt: L('Samanbrotinn hjólapallur á hjólum við steinvegg', 'A folding mobile tower on castors against a block wall'), cover: 'hj-tvo',
    slides: [
      { f: 'hj-tvo', alt: L('Tvöfaldur hjólapallur reistur við húsvegg', 'A double-width mobile tower set up against a building') },
      { f: 'hj-ein', alt: L('Einfaldur hjólapallur með stoðum við húsvegg', 'A single-width mobile tower with outriggers against a building') },
      { f: 'hj-hero', alt: L('Samanbrotinn hjólapallur fyrir innivinnu', 'A folding mobile tower for indoor work') },
    ],
    lead: L('Hjólapallar sem nýtast jafnt að innan sem að utan.', 'Mobile towers that work just as well indoors as out.'),
    chip: L('Frá 2.200 kr. á dag', 'From ISK 2,200 a day'),
    galleryTitle: L('Einfaldur, tvöfaldur og samanbrotinn', 'Single, double and folding'),
    galleryText: L('Einfaldur hjólapallur er 0,75 m á breidd og tvöfaldur 1,35 m. Báðir fást 1,85 m, 2,45 m eða 3,05 m á lengd.', 'A single-width tower is 0.75 m wide and a double-width one 1.35 m. Both come 1.85 m, 2.45 m or 3.05 m long.'),
    quoteImg: 'hj-ein', quote: L('Þessi er mjög þægilegur í uppsetningu og nýtist jafnt að innan sem að utan.', 'This one is very easy to put up and works just as well inside as outside.'),
    quoteSource: L('vörulýsing', 'product description'),
    breaks: [{ f: 'hj-tvo', alt: L('Tvöfaldur hjólapallur við húsvegg', 'A double-width tower against a wall') }, { f: 'hj-hero', alt: L('Samanbrotinn hjólapallur', 'A folding tower') }],
    labels: [L('Tvöfaldur hjólapallur', 'Double-width tower'), L('Samanbrotinn hjólapallur', 'Folding tower')],
    facts: [
      { img: 'hj-ein', alt: L('Einfaldur hjólapallur', 'A single-width tower'), stat: [L('0,75 m', '0.75 m'), L('breiður', 'wide')], desc: L('Einfaldur hjólapallur, breidd 0,75 m x lengd 1,85 m, 2,45 m eða 3,05 m. Vinnuhæð frá 4,5 m upp í 11,5 m.', 'Single-width tower, 0.75 m wide by 1.85 m, 2.45 m or 3.05 m long. Working height from 4.5 m up to 11.5 m.'), pos: '50% 40%' },
      { img: 'hj-tvo', alt: L('Tvöfaldur hjólapallur', 'A double-width tower'), stat: [L('1,35 m', '1.35 m'), L('breiður', 'wide')], desc: L('Tvöfaldur hjólapallur, breidd 1,35 m x lengd 1,85 m, 2,45 m eða 3,05 m. Þessi er mjög þægilegur í uppsetningu og nýtist jafnt að innan sem að utan.', 'Double-width tower, 1.35 m wide by 1.85 m, 2.45 m or 3.05 m long. Very easy to put up, and it works just as well inside as outside.'), pos: '50% 35%' },
      { img: 'hj-hero', alt: L('Samanbrotinn hjólapallur', 'A folding tower'), stat: [L('Inn um', 'Through'), L('hurðir', 'doorways')], desc: L('Samanbrotinn hjólapallur 0,75 m x 1,85 m. Einstaklega hentugur pallur í innivinnuna vegna þess hve meðfærilegur hann er og lítið fer fyrir honum. Auðvelt að koma honum í gegnum hurðir.', 'Folding tower, 0.75 m by 1.85 m. Especially handy for indoor work because it is easy to move and takes little room. It goes through doorways easily.'), pos: '45% 50%' },
    ],
    pull: L('Kynntu þér málið frekar hjá okkur á Tunguhálsi 17. Alltaf heitt á könnunni.', 'Come and see us at Tunguháls 17. The coffee is always on.'),
    cta: L('Pantaðu hjólapall', 'Book a mobile tower'), ctaPrefill: { product: 'tower-double' },
    ledgerTitle: L('Verðskrá eftir vinnuhæð', 'Prices by working height'),
    ledgerHead: [L('Vinnuhæð', 'Working height'), L('Einfaldur, 0,75 m', 'Single, 0.75 m'), L('Tvöfaldur, 1,35 m', 'Double, 1.35 m')],
    ledgerNote: L('Verð eru eins og pallaleiga.is birtir þau, lesin 2. október 2026. Vinnuhæð er um tveimur metrum ofan við standhæð pallsins. Starfsfólk staðfestir verð, framboð og hvaða pallur hentar verkinu.', 'Prices as pallaleiga.is publishes them, read on 2 October 2026. Working height is about two metres above the platform height. Staff confirm the price, availability and which tower suits the job.'),
    rows: [
      {
        title: FOLDING.work, sub: L('samanbrotinn, standhæð 0,5-1,8 m', 'folding, platform at 0.5-1.8 m'),
        a: { main: L(kr(FOLDING.day, 'is'), kr(FOLDING.day, 'en')), small: L(`á dag · ${kr(FOLDING.week, 'is')} vikan`, `a day · ${kr(FOLDING.week, 'en')} a week`) },
        b: { main: L('-', '-'), small: L('aðeins einföld breidd', 'single width only') },
        go: L('Panta', 'Book'), prefill: { product: 'tower-folding', height: '0' },
      },
      ...TOWERS.map(towerRow),
    ],
    source: 'https://www.pallaleiga.is/hjolapallar/',
    card: { from: L('2.200 kr. á dag', 'ISK 2,200 a day'), range: L('2,5-11,5 m', '2.5-11.5 m'), service: L('Leiga, sala, uppsetning', 'Hire, sale, set-up') },
  },
  {
    key: 'vinnupallar',
    name: L('Vinnupallar', 'Scaffolding'), marquee: L('Vinnupallar', 'Scaffolding'),
    blurb: [L('Kerfispallar, álpallar og net', 'System scaffolding and netting'), L('Tilboð eftir lengd × hæð', 'Quoted by length × height')],
    description: L('Vinnupallar og kerfispallar fyrir stærri verk, álpallar og net á vinnupalla. Gefðu upp lengd og hæð hússins og fáðu tilboð þér að kostnaðarlausu. STOÐ setur upp og tekur niður.', 'Scaffolding and system scaffolding for larger jobs, aluminium platforms and scaffold netting. Give the length and height of the building for a free quote. STOÐ puts it up and takes it down.'),
    hero: 'vp-1', heroAlt: L('Stoðturnar og vinnupallar undir mótauppslætti', 'Shoring towers and scaffolding under formwork'), cover: 'vp-3',
    slides: [
      { f: 'vp-3', alt: L('Vinnupallar utan á fjölbýlishúsi', 'Scaffolding on an apartment building') },
      { f: 'vp-kerfi', alt: L('Kerfispallar utan um hús í byggingu', 'System scaffolding around a building under construction') },
      { f: 'vp-4', alt: L('Vinnupallar á framhlið húss', 'Scaffolding on the front of a building') },
      { f: 'vp-grandi', alt: L('Hús HB Granda í vinnupöllum', "HB Grandi's building in scaffolding") },
      { f: 'vp-net', alt: L('Net strengt á staura', 'Netting strung between posts') },
      { f: 'vp-2', alt: L('Pallaefni á verkstað', 'Scaffold frames stacked on site') },
      { f: 'vp-kerfi2', alt: L('Kerfispallar upp eftir háhýsi', 'System scaffolding up a high-rise') },
    ],
    lead: L('Vinnupallar fyrir stærri verk, og við setjum þá upp.', 'Scaffolding for larger jobs, and we put it up.'),
    chip: L('Tilboð eftir lengd × hæð', 'Quoted by length × height'),
    galleryTitle: L('Kerfispallar, álpallar og net', 'System scaffolding, aluminium platforms and netting'),
    galleryText: L('Til þess að fá tilboð í leigu á vinnupöllum þarf aðeins að gefa upp lengd og hæð hússins. Net á vinnupalla er boðið eftir lengd og hæð hússins, eða lengd og breidd flatarins sem þarf að verja.', 'For a quote on scaffolding all we need is the length and height of the building. Netting is quoted by the length and height of the building, or the length and width of the area to protect.'),
    quoteImg: 'vp-4', quote: L('Sparaðu þér sporin og hringdu á einn stað og fáðu leigða palla, víralyftu eða annað og láttu okkur um að setja þetta upp fyrir þig og taka niður að verki loknu.', 'Save yourself the legwork: call one place, hire the scaffolding, a hoist or whatever else, and let us put it up for you and take it down when the job is done.'),
    quoteSource: L('forsíða pallaleiga.is', 'pallaleiga.is home page'),
    breaks: [{ f: 'vp-grandi', alt: L('Hús HB Granda í vinnupöllum', "HB Grandi's building in scaffolding") }, { f: 'vp-kerfi2', alt: L('Kerfispallar upp eftir háhýsi', 'System scaffolding up a high-rise') }],
    labels: [L('Hús HB Granda í vinnupöllum', "HB Grandi's building in scaffolding"), L('Kerfispallar á háhýsi', 'System scaffolding on a high-rise')],
    facts: [
      { img: 'vp-4', alt: L('Vinnupallar á framhlið', 'Scaffolding on a facade'), stat: [L('Lengd', 'Length'), L('× hæð', '× height')], desc: L('Til þess að fá tilboð í leigu á vinnupöllum og kerfispöllum er bara að hafa samband og gefa upp lengd x hæð á húsinu, og þú færð tilboð um hæl.', 'For a quote on scaffolding or system scaffolding, just get in touch with the length × height of the building and you get a quote straight back.'), pos: '50% 50%' },
      { img: 'vp-kerfi', alt: L('Kerfispallar', 'System scaffolding'), stat: [L('Lama', 'Lama'), L('álpallar', 'aluminium')], desc: L('Þessir álpallar hafa slegið í gegn hjá málurum og öðrum iðnaðarmönnum vegna þess hversu léttir og auðveldir þeir eru í uppsetningu.', 'These aluminium platforms have been a hit with painters and other tradespeople because they are so light and easy to put up.'), pos: '40% 50%' },
      { img: 'vp-net', alt: L('Net á vinnupalla', 'Scaffold netting'), stat: [L('Net', 'Netting'), L('á palla', 'for scaffolds')], desc: L('Gefðu upp lengd x hæð á húsinu, eða lengd x breidd þess flatar sem þú þarft að verja, og þú færð tilboð í leigu á neti um hæl.', 'Give the length × height of the building, or the length × width of the area you need to protect, and you get a quote for netting straight back.'), pos: '30% 50%' },
      { img: 'vp-2', alt: L('Pallaefni á verkstað', 'Scaffold frames on site'), stat: [L('Upp', 'Up'), L('og niður', 'and down')], desc: L('STOÐ pallaleiga býður viðskiptavinum sínum uppá uppsetningu á pöllum, netum og víralyftum, og tekur þá niður að verki loknu.', 'STOÐ pallaleiga puts up scaffolding, netting and suspended platforms for its customers, and takes them down when the job is done.'), pos: '55% 50%' },
    ],
    pull: L('Fáðu tilboð þér að kostnaðarlausu í þitt verk.', 'Get a quote for your job, free of charge.'),
    cta: L('Fáðu tilboð í vinnupalla', 'Get a quote for scaffolding'), ctaPrefill: { tab: 'partners', need: 'scaffold' },
    ledgerTitle: L('Það sem þarf í tilboð', 'What a quote needs'),
    ledgerHead: [L('Vara', 'Item'), L('Verð', 'Price'), L('Gefðu upp', 'Tell us')],
    ledgerNote: L('Vinnupallar, net og uppsetning eru boðin eftir verkinu. Áætluð mál duga í beiðnina; starfsfólk skoðar verkið og staðfestir magn, verð og tíma.', 'Scaffolding, netting and set-up are quoted per job. Approximate measurements are fine in the request; staff look at the job and confirm quantities, price and timing.'),
    rows: [
      quoteRow(L('Kerfispallar', 'System scaffolding'), L('stærri verk', 'larger jobs'), L('Lengd × hæð hússins', 'Length × height of the building'), { need: 'scaffold' }),
      quoteRow(L('Álpallar', 'Aluminium platforms'), L('Lama útipallar', 'Lama outdoor platforms'), L('Lengd × hæð hússins', 'Length × height of the building'), { need: 'scaffold' }),
      quoteRow(L('Net á vinnupalla', 'Scaffold netting'), L('Arrigoni', 'Arrigoni'), L('Lengd × hæð, eða lengd × breidd', 'Length × height, or length × width'), { need: 'net' }),
      quoteRow(L('Uppsetning og niðurtekt', 'Set-up and take-down'), L('pallar, net og víralyftur', 'scaffolds, netting, platforms'), L('Heimilisfang og dagsetningar', 'Address and dates'), { need: 'scaffold', assembly: 'yes' }),
    ],
    source: 'https://www.pallaleiga.is/vinnupallar-kerfispallar-staerri-verk/',
    card: { from: L('Tilboð', 'Quote'), range: L('Eftir húsinu', 'By the building'), service: L('Leiga, sala, uppsetning', 'Hire, sale, set-up') },
  },
  {
    key: 'viralyftur',
    name: L('Víralyftur', 'Suspended platforms'), marquee: L('Víralyftur', 'Platforms'),
    blurb: [L('Power climber', 'Power climber'), L('1-14 m · 50.000 kr. vikan', '1-14 m · ISK 50,000 a week')],
    description: L('Víralyftur (Power climber) til leigu og sölu hjá STOÐ pallaleigu, 1 til 14 metrar, 50.000 kr. vikan. Uppsetning, niðurtekt og varahlutir.', 'Suspended platforms (Power climber) for hire and sale from STOÐ pallaleiga, 1 to 14 metres, ISK 50,000 a week. Set-up, take-down and spare parts.'),
    hero: 'vl-hero', heroAlt: L('Hjól og vír á víralyftu', 'The wheel and wire rope of a suspended platform'), cover: 'vl-lyfta',
    slides: [
      { f: 'vl-lyfta', alt: L('Power climber víralyfta á gólfi', 'A Power climber suspended platform on the floor') },
      { f: 'vl-hero', alt: L('Hjól og vír á víralyftu', 'The wheel and wire rope of a platform') },
      { f: 'vl-detail', alt: L('Festing víralyftu', 'A platform fitting') },
    ],
    lead: L('Víralyftur til leigu og sölu, með uppsetningu og varahlutum.', 'Suspended platforms to hire or buy, with set-up and spare parts.'),
    chip: L('50.000 kr. vikan', 'ISK 50,000 a week'),
    galleryTitle: L('Power climber, 1 til 14 metrar', 'Power climber, 1 to 14 metres'),
    galleryText: L('Víralyftan er leigð í viku í senn. STOÐ setur hana upp og tekur hana niður að verki loknu fyrir þá sem óska eftir því.', 'The platform is hired by the week. STOÐ puts it up and takes it down when the job is done, if you want.'),
    quoteImg: 'vl-detail', quote: L('Láttu okkur um að setja þetta upp fyrir þig og taka niður að verki loknu.', 'Let us put it up for you and take it down when the job is done.'),
    quoteSource: L('forsíða pallaleiga.is', 'pallaleiga.is home page'),
    breaks: [{ f: 'vl-lyfta', alt: L('Víralyfta', 'A suspended platform') }, { f: 'vl-hero', alt: L('Hjól víralyftu', 'A platform wheel') }],
    labels: [L('Power climber víralyfta', 'Power climber platform'), L('Hjól og vír', 'Wheel and wire rope')],
    facts: [
      { img: 'vl-lyfta', alt: L('Víralyfta', 'A suspended platform'), stat: [L('1-14', '1-14'), L('metrar', 'metres')], desc: L('Power climber víralyfta, lengd 1 til 14 metrar. Vikuleiga 50.000 kr. samkvæmt verðskrá.', 'Power climber suspended platform, 1 to 14 metres long. ISK 50,000 a week by the price list.'), pos: '50% 50%' },
      { img: 'vl-hero', alt: L('Hjól víralyftu', 'A platform wheel'), stat: [L('Uppsetning', 'Set-up'), L('og niðurtekt', 'and take-down')], desc: L('STOÐ pallaleiga býður viðskiptavinum sínum uppá uppsetningu á pöllum, netum og víralyftum.', 'STOÐ pallaleiga offers its customers set-up of scaffolding, netting and suspended platforms.'), pos: '50% 50%' },
      { img: 'vl-detail', alt: L('Festing', 'A fitting'), stat: [L('Varahlutir', 'Spare parts'), L('og sala', 'and sales')], desc: L('Víralyftur: sala, leiga, varahlutir, uppsetning og niðurtekt. STOÐ flytur þær inn frá Powerclimber.', 'Suspended platforms: sale, hire, spare parts, set-up and take-down. STOÐ imports them from Powerclimber.'), pos: '50% 50%' },
    ],
    cta: L('Fáðu tilboð í víralyftu', 'Get a quote for a platform'), ctaPrefill: { tab: 'partners', need: 'hoist' },
    ledgerTitle: L('Verð og þjónusta', 'Price and service'),
    ledgerHead: [L('Vara', 'Item'), L('Verð', 'Price'), L('Lengd', 'Length')],
    ledgerNote: L('Verð eins og pallaleiga.is birtir það, lesið 2. október 2026. Uppsetning og niðurtekt eru boðin eftir verkinu.', 'Price as pallaleiga.is publishes it, read on 2 October 2026. Set-up and take-down are quoted per job.'),
    rows: [
      { title: L('Power climber', 'Power climber'), sub: L('víralyfta', 'suspended platform'), a: { main: L(kr(HOIST.week, 'is'), kr(HOIST.week, 'en')), small: L('vikan', 'a week') }, b: { main: HOIST.len }, go: L('Panta', 'Book'), prefill: { product: 'hoist' } },
      quoteRow(L('Uppsetning og niðurtekt', 'Set-up and take-down'), L('víralyftur', 'platforms'), L('Heimilisfang og dagsetningar', 'Address and dates'), { need: 'hoist', assembly: 'yes' }),
      quoteRow(L('Varahlutir', 'Spare parts'), L('Powerclimber', 'Powerclimber'), L('Gerð lyftunnar', 'The model'), { need: 'hoist' }),
    ],
    source: 'https://www.pallaleiga.is/viralyftur/',
    card: { from: L('50.000 kr. vikan', 'ISK 50,000 a week'), range: L('1-14 m', '1-14 m'), service: L('Leiga, sala, varahlutir', 'Hire, sale, parts') },
  },
  {
    key: 'stigar',
    name: L('Stigar og tröppur', 'Ladders and steps'), marquee: L('Stigar', 'Ladders'),
    blurb: [L('Stigar, tröppur, stoðir', 'Ladders, steps, props'), L('Frá 2.500 kr. á dag', 'From ISK 2,500 a day')],
    description: L('Stigar, tröppur og þakstigar til leigu hjá STOÐ pallaleigu, 2.500 kr. á dag og 12.500 kr. vikan, og loftastoðir 2,5 til 5,5 m. Tunguháls 17, Reykjavík.', 'Ladders, step ladders and roof ladders for hire from STOÐ pallaleiga at ISK 2,500 a day or ISK 12,500 a week, and ceiling props of 2.5 to 5.5 m. Tunguháls 17, Reykjavík.'),
    hero: 'st-hero', heroAlt: L('Bláir álstigar í röð', 'Blue aluminium ladders in a row'), cover: 'st-stigi',
    slides: [
      { f: 'st-stigi', alt: L('Blá trappa með pöllum við vegg', 'A blue platform step ladder against a wall') },
      { f: 'st-troppu', alt: L('Tröppur með handriði', 'Steps with a handrail') },
      { f: 'st-stigar', alt: L('Stigar á lager', 'Ladders in stock') },
      { f: 'st-troppu2', alt: L('Tröppur með handriði við steinvegg', 'Steps with a handrail by a block wall') },
      { f: 'st-stod', alt: L('Loftastoð', 'A ceiling prop') },
    ],
    lead: L('Stigar, tröppur og þakstigar til leigu, ásamt loftastoðum.', 'Ladders, step ladders and roof ladders for hire, and ceiling props.'),
    chip: L('2.500 kr. á dag', 'ISK 2,500 a day'),
    galleryTitle: L('Ýmsar gerðir og stærðir', 'Many types and sizes'),
    galleryText: L('Erum með ýmsar gerðir og stærðir af stigum og tröppum til leigu. Komdu og skoðaðu úrvalið og sjáðu hvað hentar þínum væntingum.', 'We have many types and sizes of ladders and steps for hire. Come and see the range and find what suits you.'),
    quoteImg: 'st-troppu', quote: L('Komdu og skoðaðu úrvalið og sjáðu hvað hentar þínum væntingum.', 'Come and see the range and find what suits you.'),
    quoteSource: L('vörulýsing', 'product description'),
    breaks: [{ f: 'st-hero', alt: L('Bláir álstigar', 'Blue aluminium ladders') }, { f: 'st-stigar', alt: L('Stigar á lager', 'Ladders in stock') }],
    labels: [L('Bláir álstigar', 'Blue aluminium ladders'), L('Stigar á lager', 'Ladders in stock')],
    facts: [
      { img: 'st-stigi', alt: L('Trappa', 'A step ladder'), stat: [L('2.500 kr.', 'ISK 2,500'), L('á dag', 'a day')], desc: L('Stigar, tröppur og þakstigar kosta það sama: 2.500 kr. á dag og 12.500 kr. vikan samkvæmt verðskrá. Fleiri vörur einnig fáanlegar í leigu.', 'Ladders, step ladders and roof ladders cost the same: ISK 2,500 a day or ISK 12,500 a week by the price list. More items are also available for hire.'), pos: '50% 45%' },
      { img: 'st-stod', alt: L('Loftastoð', 'A ceiling prop'), stat: [L('2,5-5,5', '2.5-5.5'), L('metrar', 'metres')], desc: L('Loftastoðir, lengd 2,5 til 5,5 metrar. 150 kr. á stykki á dag og 750 kr. vikan.', 'Ceiling props, 2.5 to 5.5 metres long. ISK 150 each a day or ISK 750 a week.'), pos: '50% 35%' },
      { img: 'st-stigar', alt: L('Stigar á lager', 'Ladders in stock'), stat: [L('Líka', 'Also'), L('til sölu', 'for sale')], desc: L('Stigar og tröppur fást líka keypt. STOÐ flytur inn frá ASC group og Titan Ladders.', 'Ladders and steps can also be bought. STOÐ imports from ASC group and Titan Ladders.'), pos: '50% 50%' },
    ],
    cta: L('Leigðu stiga eða tröppur', 'Hire a ladder or steps'), ctaPrefill: { product: 'ladder' },
    ledgerTitle: L('Verðskrá', 'Price list'),
    ledgerHead: [L('Vara', 'Item'), L('Dagur', 'Day'), L('Vika', 'Week')],
    ledgerNote: L('Verð eru eins og pallaleiga.is birtir þau, lesin 2. október 2026. Loftastoðir eru verðlagðar á stykki.', 'Prices as pallaleiga.is publishes them, read on 2 October 2026. Ceiling props are priced each.'),
    rows: [
      flatRow(L('Stigar', 'Ladders'), L('Varitex prof', 'Varitex prof'), FLAT.ladder[0], FLAT.ladder[1], 'ladder'),
      flatRow(L('Tröppur', 'Step ladders'), L('Andes', 'Andes'), FLAT.steps[0], FLAT.steps[1], 'steps'),
      flatRow(L('Þakstigar', 'Roof ladders'), L('Challenger', 'Challenger'), FLAT.roof[0], FLAT.roof[1], 'roof'),
      { title: L('Loftastoðir', 'Ceiling props'), sub: L('2,5-5,5 m, verð á stykki', '2.5-5.5 m, price each'), a: { main: L(kr(PROPS.day, 'is'), kr(PROPS.day, 'en')), small: day }, b: { main: L(kr(PROPS.week, 'is'), kr(PROPS.week, 'en')), small: L('vikan', 'a week') }, go: L('Panta', 'Book'), prefill: { product: 'props' } },
    ],
    source: 'https://www.pallaleiga.is/stigar-troppur/',
    card: { from: L('2.500 kr. á dag', 'ISK 2,500 a day'), range: L('Stoðir 2,5-5,5 m', 'Props 2.5-5.5 m'), service: L('Leiga og sala', 'Hire and sale') },
  },
]
export const collectionOf = (key: string) => COLLECTIONS.find((c) => c.key === key)

/* -------------------------------------------------------------------------------------------- about (pallaleiga.is/um-okkur, /uppsetning-a-pollum, forsíða) */
export const PILLARS: Array<{ img: string; alt: Bi; stat: [Bi, Bi]; desc: Bi }> = [
  { img: 'hj-tvo', alt: L('Hjólapallur', 'A mobile tower'), stat: [L('Leiga', 'Hire'), L('dagur eða vika', 'by day or week')], desc: L('Hjólapallar, vinnupallar og kerfispallar, tröppur, net á vinnupalla, stigar, víralyftur og loftastoðir.', 'Mobile towers, scaffolding and system scaffolding, steps, scaffold netting, ladders, suspended platforms and ceiling props.') },
  { img: 'st-stigar', alt: L('Stigar á lager', 'Ladders in stock'), stat: [L('Sala', 'Sales'), L('frá framleiðendum', 'from the makers')], desc: L('STOÐ pallaleiga flytur inn efni frá öflugum framleiðendum víðsvegar um heiminn. Með því að versla við STOÐ pallaleigu ertu að tryggja þér frábæra vöru á frábæru verði.', 'STOÐ pallaleiga imports equipment from strong manufacturers around the world. Buying from STOÐ means a great product at a great price.') },
  { img: 'vp-3', alt: L('Vinnupallar á fjölbýlishúsi', 'Scaffolding on an apartment building'), stat: [L('Uppsetning', 'Set-up'), L('á pöllum', 'of scaffolding')], desc: L('STOÐ pallaleiga býður viðskiptavinum sínum uppá uppsetningu á pöllum, netum og víralyftum.', 'STOÐ pallaleiga offers its customers set-up of scaffolding, netting and suspended platforms.') },
  { img: 'vp-2', alt: L('Pallaefni á verkstað', 'Scaffold frames on site'), stat: [L('Niðurtekt', 'Take-down'), L('að verki loknu', 'when the job is done')], desc: L('Láttu okkur um að setja þetta upp fyrir þig og taka niður að verki loknu.', 'Let us put it up for you and take it down when the job is done.') },
]
export const JOBS: Array<{ f: string; label: string }> = [
  { f: 'pj-torfufell', label: 'Torfufell 25-35' },
  { f: 'pj-vesturberg', label: 'Vesturberg 138-142' },
  { f: 'pj-stelksholar', label: 'Stelkshólar 8-12' },
  { f: 'pj-arnarhvoll', label: 'Arnarhvoll' },
  { f: 'pj-grandagardur', label: 'Grandagarður 2' },
  { f: 'pj-hofdabakki', label: 'Höfðabakki 9' },
]

/* -------------------------------------------------------------------------------------------- sample requests (SAMPLE, never real)
   Used only by /beidnir. Every request below was made up to show the layout; addresses are invented. */
export const SAMPLE_REQUESTS: Array<{ kind: Bi; what: Bi; where: Bi; when: Bi; size: Bi; status: Bi; flag?: boolean }> = [
  { kind: L('Leiga', 'Hire'), what: L('Hjólapallur, tvöfaldur', 'Mobile tower, double'), where: L('Sækir á Tunguháls', 'Collects at Tunguháls'), when: L('12.-19. okt.', '12-19 Oct'), size: L('Vinnuhæð 6,5 m', 'Working height 6.5 m'), status: L('Ný', 'New') },
  { kind: L('Verk', 'Job'), what: L('Vinnupallar og net, með uppsetningu', 'Scaffolding and netting, with set-up'), where: L('Dæmigata 4, 104 Rvk.', 'Sample Street 4, 104 Rvk.'), when: L('Frá 1. nóv., 1-3 mán.', 'From 1 Nov, 1-3 months'), size: L('Um 24 × 9 m, 3 myndir', 'About 24 × 9 m, 3 photos'), status: L('Í skoðun', 'Being reviewed') },
  { kind: L('Óviss', 'Unsure'), what: L('Gluggaskipti á 3. hæð', 'Window replacement, 3rd floor'), where: L('Prófgata 11, 200 Kóp.', 'Test Road 11, 200 Kóp.'), when: L('Sem fyrst', 'As soon as possible'), size: L('Hæð ekki vituð, 2 myndir', 'Height unknown, 2 photos'), status: L('Hringja í dag', 'Call today'), flag: true },
  { kind: L('Leiga', 'Hire'), what: L('Loftastoðir × 24', 'Ceiling props × 24'), where: L('Sækir á Tunguháls', 'Collects at Tunguháls'), when: L('Tvær vikur frá 20. okt.', 'Two weeks from 20 Oct'), size: L('2,5-5,5 m', '2.5-5.5 m'), status: L('Staðfest', 'Confirmed') },
]
export const SAMPLE_BRIEF: Array<[Bi, Bi]> = [
  [L('Tegund', 'Type'), L('Verk með uppsetningu', 'Job with set-up')],
  [L('Hvað þarf', 'Needed'), L('Vinnupallar og net á vinnupalla', 'Scaffolding and scaffold netting')],
  [L('Verkstaður', 'Site'), L('Dæmigata 4, 104 Reykjavík', 'Sample Street 4, 104 Reykjavík')],
  [L('Stærð', 'Size'), L('Um 24 m á lengd og 9 m á hæð (áætlun viðskiptavinar)', 'About 24 m long and 9 m high (customer estimate)')],
  [L('Verkið', 'The work'), L('Múrviðgerðir og málun', 'Masonry repair and painting')],
  [L('Uppsetning', 'Set-up'), L('Já, STOÐ setji upp og taki niður', 'Yes, STOÐ puts up and takes down')],
  [L('Tími', 'Timing'), L('Frá 1. nóvember, 1 til 3 mánuðir', 'From 1 November, 1 to 3 months')],
  [L('Myndir', 'Photos'), L('3 myndir af framhlið og aðkomu', '3 photos of the front and the access')],
  [L('Tengiliður', 'Contact'), L('Nafn, sími og netfang', 'Name, phone and email')],
]

/* -------------------------------------------------------------------------------------------- UI text */
const IS_T: Record<string, string> = {
  htmlLang: 'is',
  skip: 'Fara í efni',
  brand: 'STOÐ pallaleiga, forsíða', logoAlt: 'STOÐ pallaleiga',
  about: 'Um okkur', contact: 'Fá tilboð', home: 'Forsíða', forSale: 'Til leigu', forSaleAria: 'Vörur til leigu',
  menuLabel: 'Valmynd', menuCloseLabel: 'Loka', menuOpen: 'Opna valmynd', menuClose: 'Loka valmynd', nav: 'Aðalvalmynd', navPrimary: 'Efni',
  requests: 'Beiðnir (sýnishorn)', phoneLabel: 'Sími', langSwitch: 'English', langHref: 'en',
  pickerAria: 'Vörur til leigu', homeTile: 'Forsíða', homeTileBlurb: 'Leiga, sala og uppsetning',
  scroll: 'Skrunaðu', scrollHint: '(Skrunaðu)', next: 'Næst', play: 'Spila', stop: 'Stöðva', close: 'Loka',
  colophon: 'STOÐ pallaleiga · Stofnuð 2009',
  homeLead: 'Leiga og sala á pöllum, uppsetning og niðurtekt.',
  homeTitle: 'STOÐ pallaleiga | Hjólapallar, vinnupallar og stigar til leigu',
  homeDesc: 'STOÐ pallaleiga leigir og selur hjólapalla, vinnupalla, víralyftur, stiga og tröppur, og reisir palla og tekur niður. Verðskrá og tilboð á einum stað. Tunguháls 17, Reykjavík.',
  chipNote: 'Verð af pallaleiga.is, lesið 2.10.2026',
  creditPre: 'Hannað af', creditAria: 'Hannað af SNDR Studio',
  protoNote: 'Frumgerð: hönnunarhugmynd, ekki vefur STOÐ pallaleigu. Myndir, texti, verð og merki eru af pallaleiga.is; sýnishorn eru merkt sem slík.',
  nextLabel: 'Næst', ctaLink: 'Fá tilboð',
  aboutTitle: 'Um okkur | STOÐ pallaleiga', aboutDesc: 'STOÐ pallaleiga var stofnuð í júní 2009 og sérhæfir sig í leigu og sölu á pöllum ásamt því að reisa palla og taka þá niður. Tunguháls 17, Reykjavík.',
  aboutMarquee: 'Um okkur', aboutLabel: '(Um okkur)', aboutH1: 'Um STOÐ pallaleigu',
  aboutStatementLead: 'STOÐ pallaleiga ',
  aboutStatement: 'var stofnuð í júní 2009. STOÐ pallaleiga sérhæfir sig í leigu og sölu á pöllum ásamt því að bjóða uppá þjónustu við að reisa palla og taka þá niður fyrir þá sem óska eftir því.',
  aboutFilmAlt: 'Pallaefni á verkstað', aboutFilmLink: 'Um okkur á pallaleiga.is',
  aboutQuote: '„Það er yðar hagur að versla við fagmenn.“', aboutQuoteAlt: 'Vinnupallar á framhlið',
  aboutMarquee2: 'STOÐ', aboutLabel2: '(Þjónustan)', aboutValuesLead: 'Sparaðu þér sporin ',
  aboutValues: 'og hringdu á einn stað og fáðu leigða palla, víralyftu eða annað og láttu okkur um að setja þetta upp fyrir þig og taka niður að verki loknu.',
  aboutLabel3: '(Framleiðendur)', aboutHistoryLead: 'Úrvalið ', aboutHistory: 'kemur frá framleiðendum sem STOÐ flytur inn frá. Allt sem er til leigu fæst líka keypt.',
  aboutLabel4: '(Hver svarar)',
  pillars: '(01)|(02)|(03)|(04)',
  aboutCta: 'Skoðaðu það sem er til leigu', aboutCtaLink: 'Hjólapallar', aboutBreak: 'Úr myndasafni pallaleiga.is',
  jobsLabel: '(Úr myndasafninu)', jobsText: 'Hús sem eru í myndasafni pallaleiga.is, myndir frá janúar 2015.',
  contactTitle: 'Fá tilboð | STOÐ pallaleiga', contactDesc: 'Pantaðu palla, stiga eða víralyftu, eða fáðu tilboð í vinnupalla með uppsetningu. Segðu hvar, hvenær og hve hátt, og starfsfólk STOÐ svarar.',
  contactWord: 'Fá tilboð', contactH1: 'Fá tilboð', contactHeading: 'Segðu okkur frá verkinu.',
  chOffice: 'Sími', chQuote: 'Tilboð (Lúðvík)', chMail: 'Netfang', chHours: 'Opið',
  hoursText: 'Virka daga 8:00-12:00 og 13:00-17:00, lokað um helgar', hoursShort: 'Virka daga 8-12 og 13-17',
  copyDone: 'Netfang afritað', copyAria: 'Afrita netfang ',
  tabRental: 'Leiga á tækjum', tabJob: 'Verk með uppsetningu', tabsAria: 'Tegund beiðni',
  fName: 'Nafn*', fEmail: 'Netfang*', fPhone: 'Sími*', fCompany: 'Fyrirtæki', fProduct: 'Hvað viltu leigja?*', fHeight: 'Vinnuhæð', fQty: 'Fjöldi',
  fFrom: 'Frá hvaða degi?*', fPeriod: 'Hve lengi?', fPickup: 'Afhending', fPlace: 'Hvar er verkið?', fMessage: 'Annað sem gott er að vita',
  fNeed: 'Hvað þarf?*', fAddress: 'Heimilisfang verksins*', fLength: 'Lengd hússins, m', fTall: 'Hæð hússins, m', fTask: 'Hvað á að gera?', fAssembly: 'Uppsetning og niðurtekt?*',
  fStart: 'Hvenær byrjar verkið?', fDuration: 'Hve lengi stendur það?', fPhotos: 'Myndir af húsinu',
  optPeriod: 'Einn dagur|Nokkrir dagar|Vika|Tvær vikur|Lengur',
  optPickup: 'Sæki á Tunguháls 17|Spyr um akstur',
  optNeed: 'scaffold:Vinnupallar eða kerfispallar|net:Net á vinnupalla|hoist:Víralyfta|several:Fleira en eitt|unsure:Veit ekki, ég lýsi verkinu',
  optTask: 'Málun|Múrviðgerðir|Klæðning|Gluggaskipti|Þakvinna|Nýbygging|Annað',
  optAssembly: 'yes:Já, STOÐ setji upp og taki niður|no:Nei, leiga eingöngu|unsure:Veit ekki enn',
  optDuration: 'Innan við mánuð|1-3 mánuðir|Lengur|Óvíst',
  hintRental: 'Veldu tæki og vinnuhæð og verðið úr verðskránni birtist hér. Starfsfólk staðfestir verð, framboð og hvort tækið hentar.',
  hintSize: 'Áætlun dugar. Mældu eða teldu hæðir (um 3 m á hæð); starfsfólk skoðar og staðfestir.',
  hintPhotos: 'Valfrjálst. Mynd af framhlið og aðkomu sparar oft skoðunarferð. Engin mynd? Lýstu húsinu hér fyrir neðan.',
  estimateLabel: 'Samkvæmt verðskrá:', estimateNone: 'Verð kemur í tilboði.',
  consent: 'Ég samþykki að upplýsingarnar fari til STOÐ pallaleigu. Sjá ',
  consentLink: 'persónuupplýsingar í frumgerðinni', consentTail: '.',
  send: 'Senda beiðni', sending: 'Sendi…', phonePh: 'Sími*', phoneNeeded: 'Sláðu inn símanúmer.',
  formError: 'Eitthvað fór úrskeiðis og ekkert var sent. Það sem þú skrifaðir er enn í forminu. Prófaðu aftur eða hringdu í 571 0600.',
  sampleForm: 'Frumgerð: ekkert er sent eða vistað.',
  thanksTitle: 'Takk fyrir', thanksText: 'Beiðnin er móttekin.', thanksNote: 'Frumgerð: ekkert var sent eða vistað. Svona bærist beiðnin starfsfólki STOÐ.', thanksMore: 'Halda áfram',
  thanksRental: 'Beiðnin fer til STOÐ á pallaleiga@pallaleiga.is, svona:',
  thanksJob: 'Beiðnin fer til STOÐ og Lúðvík fær hana til að gera tilboð, svona:',
  policyTitle: 'Persónuupplýsingar í frumgerðinni',
  policy: '<p>Þetta er frumgerð. Ekkert sem þú slærð inn er sent eða vistað, hvorki hjá STOÐ pallaleigu né SNDR Studio.</p><h4>Í raunverulegri útgáfu</h4><p>Nafn, netfang, sími og lýsing verksins (tæki, dagsetningar, heimilisfang, mál og myndir) færu til STOÐ pallaleigu til að gera tilboð og svara beiðninni.</p><h4>Persónuverndarstefna</h4><p>Persónuverndarstefna, geymslutími mynda og vinnsluskilmálar kæmu frá STOÐ og yrðu birt á vefnum áður en hann færi í loftið.</p>',
  notFoundTitle: 'Síða fannst ekki | STOÐ pallaleiga', notFoundDesc: 'Síðan sem þú leitar að fannst ekki. Farðu á forsíðu STOÐ pallaleigu.',
  notFoundWord: '404', notFoundHeading: 'Þessi síða er ekki til.', chExplore: 'Skoða', chBack: 'Aftur á forsíðu', chHelp: 'Vantar aðstoð?', chContactUs: 'Fá tilboð',
  notFoundText: 'Hlekkurinn gæti verið úreltur eða síðan flutt. Farðu á forsíðu eða hringdu í 571 0600.',
  ovTitle: 'Beiðnir (sýnishorn) | STOÐ pallaleiga', ovDesc: 'Sýnishorn af því hvernig beiðnir af vefnum bærust starfsfólki STOÐ: tegund, tæki, staður, tími og stærð í einni línu. Allar færslur eru dæmi.',
  ovMarquee: 'Beiðnir', ovLabel: '(Sýnishorn)', ovH1: 'Beiðnir af vefnum (sýnishorn)',
  ovLead: 'Svona ', ovStatement: 'bærust beiðnir af vefnum: hver beiðni segir strax hvort um leigu eða verk er að ræða, hvar, hvenær og hve hátt, svo að fyrsta símtalið fer í tilboðið en ekki í spurningar.',
  ovNoticeTag: 'Dæmigögn', ovNotice: 'Allar beiðnir á þessari síðu eru búnar til til að sýna útlitið. Heimilisföngin eru tilbúin og engin færsla kemur frá STOÐ eða viðskiptavinum.',
  ovInboxTitle: 'Nýjustu beiðnir', ovInboxSub: 'Ein lína á hverja beiðni (dæmi).',
  ovBriefTitle: 'Ein beiðni opnuð', ovBriefSub: 'Allt sem þarf í tilboð á einum stað (dæmi).',
  ovCol1: 'Tegund', ovCol2: 'Hvað', ovCol3: 'Hvar', ovCol4: 'Hvenær', ovCol5: 'Stærð', ovCol6: 'Staða',
  ovCta: 'Sjáðu beiðnina eins og viðskiptavinur sér hana', ovCtaLink: 'Fá tilboð', ovBreak: 'Vinnupallar á fjölbýlishúsi',
  fromWord: 'Frá',
  homeSub: 'Hjólapallar, vinnupallar, víralyftur, stigar og tröppur. Verðskráin er hér á einum stað og beiðnin segir strax hvar, hvenær og hve hátt.',
  homeCtaEnquire: 'Fá tilboð', homeCtaSale: 'Sjá verðskrá',
  factsAria: 'Í stuttu máli', factFrom: 'hjólapallur á dag', factHeight: 'mesta vinnuhæð hjólapalla', factHoist: 'víralyftur', factFounded: 'stofnuð',
  saleTitle: 'Til leigu',
  saleText: 'Fjórir vöruflokkar, hver með sína síðu og verðskrá. Verð eru af pallaleiga.is, lesin 2. október 2026; starfsfólk staðfestir verð og framboð.',
  cardPrice: 'Verð', cardRange: 'Hæð og stærð', cardService: 'Þjónusta', cardView: 'Skoða', cardEnquire: 'Fá tilboð',
  moreTitle: 'Til sölu', moreText: 'Allt sem er til leigu fæst líka keypt. STOÐ flytur inn frá þessum framleiðendum.', moreView: 'Vefur framleiðanda', moreAsk: 'Spyrja um verð',
  howTitle: 'Svona virkar beiðnin',
  how1: 'Leiga eða verk', how1Text: 'Leiga á hjólapalli, stiga eða víralyftu, eða verk þar sem STOÐ reisir vinnupalla og tekur niður. Ekki viss? Veldu það og lýstu verkinu.',
  how2: 'Hvar, hvenær og hve hátt', how2Text: 'Dagsetningar, heimilisfang og áætluð lengd og hæð hússins. Myndir hjálpa en eru valfrjálsar.',
  how3: 'Starfsfólk staðfestir', how3Text: 'Starfsfólk STOÐ staðfestir magn, verð og tíma. Vefurinn tekur ekki frá tæki og reiknar ekki út palla.',
  priceTitle: 'Verðskrá í hnotskurn', priceText: 'Verð eins og pallaleiga.is birtir þau, lesin 2. október 2026. Vinnupallar og net eru boðin eftir verkinu.',
  priceItem: 'Vara', priceDay: 'Dagur', priceWeek: 'Vika', priceQuote: 'Tilboð eftir lengd × hæð', priceFrom: 'frá',
  endTitle: 'Hafðu samband', endText: 'Tunguháls 17, 110 Reykjavík. Virka daga 8:00-12:00 og 13:00-17:00, lokað um helgar.',
  needQuote: 'Tilboð í verk', needQuoteText: 'Lúðvík gerir tilboð í vinnupalla, net og uppsetningu.', needQuoteGo: '660 7604',
  needSetup: 'Uppsetning og niðurtekt', needSetupText: 'Pallar, net og víralyftur, sett upp og tekin niður að verki loknu.', needSetupGo: 'Biðja um tilboð',
  needMap: 'Hvar erum við', needMapText: 'Tunguháls 17, 110 Reykjavík. Alltaf heitt á könnunni.', needMapGo: 'Kort',
  ledgerHint: 'Smelltu á Panta og beiðnin opnast með vinnuhæðinni valinni.',
  sourceLink: 'Síðan á pallaleiga.is', allPrices: 'Allar vörur til leigu',
}
const EN_T: Record<string, string> = {
  htmlLang: 'en',
  skip: 'Skip to content',
  brand: 'STOÐ pallaleiga, home', logoAlt: 'STOÐ pallaleiga',
  about: 'About', contact: 'Get a quote', home: 'Home', forSale: 'For hire', forSaleAria: 'Equipment for hire',
  menuLabel: 'Menu', menuCloseLabel: 'Close', menuOpen: 'Open menu', menuClose: 'Close menu', nav: 'Main menu', navPrimary: 'Pages',
  requests: 'Requests (sample)', phoneLabel: 'Phone', langSwitch: 'Íslenska', langHref: 'is',
  pickerAria: 'Equipment for hire', homeTile: 'Home', homeTileBlurb: 'Hire, sale and set-up',
  scroll: 'Scroll', scrollHint: '(Scroll)', next: 'Next', play: 'Play', stop: 'Stop', close: 'Close',
  colophon: 'STOÐ pallaleiga · Founded 2009',
  homeLead: 'Scaffolding to hire or buy, put up and taken down.',
  homeTitle: 'STOÐ pallaleiga | Mobile towers, scaffolding and ladders for hire',
  homeDesc: 'STOÐ pallaleiga hires and sells mobile towers, scaffolding, suspended platforms, ladders and steps, and puts scaffolding up and takes it down. Prices and quotes in one place. Tunguháls 17, Reykjavík.',
  chipNote: 'Price from pallaleiga.is, read 2.10.2026',
  creditPre: 'Designed by', creditAria: 'Designed by SNDR Studio',
  protoNote: "Prototype: a design concept, not STOÐ pallaleiga's website. Pictures, text, prices and logo are from pallaleiga.is; samples are marked as such.",
  nextLabel: 'Next', ctaLink: 'Get a quote',
  aboutTitle: 'About | STOÐ pallaleiga', aboutDesc: 'STOÐ pallaleiga was founded in June 2009 and specialises in hiring and selling scaffolding, and in putting it up and taking it down. Tunguháls 17, Reykjavík.',
  aboutMarquee: 'About us', aboutLabel: '(About us)', aboutH1: 'About STOÐ pallaleiga',
  aboutStatementLead: 'STOÐ pallaleiga ',
  aboutStatement: 'was founded in June 2009. It specialises in hiring and selling scaffolding, and offers to put it up and take it down for anyone who wants that.',
  aboutFilmAlt: 'Scaffold frames on site', aboutFilmLink: 'About us on pallaleiga.is (in Icelandic)',
  aboutQuote: '“It pays to deal with professionals.”', aboutQuoteAlt: 'Scaffolding on a facade',
  aboutMarquee2: 'STOÐ', aboutLabel2: '(The service)', aboutValuesLead: 'Save yourself the legwork: ',
  aboutValues: 'call one place, hire the scaffolding, a platform or whatever else, and let us put it up for you and take it down when the job is done.',
  aboutLabel3: '(Manufacturers)', aboutHistoryLead: 'The range ', aboutHistory: 'comes from manufacturers STOÐ imports from. Everything for hire can also be bought.',
  aboutLabel4: '(Who answers)',
  pillars: '(01)|(02)|(03)|(04)',
  aboutCta: 'See what is for hire', aboutCtaLink: 'Mobile towers', aboutBreak: 'From the pallaleiga.is photo library',
  jobsLabel: '(From the photo library)', jobsText: 'Buildings in the pallaleiga.is photo library, photographed in January 2015.',
  contactTitle: 'Get a quote | STOÐ pallaleiga', contactDesc: 'Book a tower, ladder or platform, or get a quote for scaffolding with set-up. Tell us where, when and how high, and STOÐ staff reply.',
  contactWord: 'Get a quote', contactH1: 'Get a quote', contactHeading: 'Tell us about the job.',
  chOffice: 'Phone', chQuote: 'Quotes (Lúðvík)', chMail: 'Email', chHours: 'Open',
  hoursText: 'Weekdays 8:00-12:00 and 13:00-17:00, closed at weekends', hoursShort: 'Weekdays 8-12 and 13-17',
  copyDone: 'Email copied', copyAria: 'Copy email address ',
  tabRental: 'Equipment hire', tabJob: 'Job with set-up', tabsAria: 'Type of request',
  fName: 'Full name*', fEmail: 'Email*', fPhone: 'Phone*', fCompany: 'Company', fProduct: 'What would you like to hire?*', fHeight: 'Working height', fQty: 'Quantity',
  fFrom: 'From which day?*', fPeriod: 'How long?', fPickup: 'Handover', fPlace: 'Where is the job?', fMessage: 'Anything else worth knowing',
  fNeed: 'What do you need?*', fAddress: 'Site address*', fLength: 'Building length, m', fTall: 'Building height, m', fTask: 'What is the work?', fAssembly: 'Set-up and take-down?*',
  fStart: 'When does the work start?', fDuration: 'How long will it last?', fPhotos: 'Photos of the building',
  optPeriod: 'One day|A few days|A week|Two weeks|Longer',
  optPickup: 'I collect at Tunguháls 17|I would like delivery',
  optNeed: 'scaffold:Scaffolding or system scaffolding|net:Scaffold netting|hoist:Suspended platform|several:More than one|unsure:Not sure, I will describe the job',
  optTask: 'Painting|Masonry repair|Cladding|Window replacement|Roof work|New build|Other',
  optAssembly: 'yes:Yes, STOÐ puts it up and takes it down|no:No, hire only|unsure:Not sure yet',
  optDuration: 'Under a month|1-3 months|Longer|Not sure',
  hintRental: 'Choose the equipment and working height and the published price appears here. Staff confirm price, availability and whether it suits the job.',
  hintSize: 'An estimate is fine. Measure or count floors (about 3 m each); staff check and confirm.',
  hintPhotos: 'Optional. A photo of the front and the access often saves a site visit. No photo? Describe the building below.',
  estimateLabel: 'By the price list:', estimateNone: 'The price comes in the quote.',
  consent: 'I agree that the details go to STOÐ pallaleiga. See ',
  consentLink: 'personal data in the prototype', consentTail: '.',
  send: 'Send request', sending: 'Sending…', phonePh: 'Phone*', phoneNeeded: 'Please enter your phone number.',
  formError: 'Something went wrong and nothing was sent. What you typed is still in the form. Please try again or call 571 0600.',
  sampleForm: 'Prototype: nothing is sent or stored.',
  thanksTitle: 'Thank you', thanksText: 'Your request has been received.', thanksNote: 'Prototype: nothing was sent or stored. This is how STOÐ staff would receive it.', thanksMore: 'Continue browsing',
  thanksRental: 'The request goes to STOÐ at pallaleiga@pallaleiga.is, like this:',
  thanksJob: 'The request goes to STOÐ and Lúðvík gets it to prepare a quote, like this:',
  policyTitle: 'Personal data in the prototype',
  policy: '<p>This is a prototype. Nothing you type is sent or stored, not by STOÐ pallaleiga and not by SNDR Studio.</p><h4>In a real version</h4><p>Name, email, phone and the description of the job (equipment, dates, address, measurements and photos) would go to STOÐ pallaleiga to prepare a quote and answer the request.</p><h4>Privacy policy</h4><p>The privacy policy, photo retention period and processing terms would come from STOÐ and be published on the site before it went live.</p>',
  notFoundTitle: 'Page not found | STOÐ pallaleiga', notFoundDesc: 'The page you are looking for could not be found. Go to the STOÐ pallaleiga home page.',
  notFoundWord: '404', notFoundHeading: "This page doesn't exist.", chExplore: 'Explore', chBack: 'Back to homepage', chHelp: 'Need help?', chContactUs: 'Get a quote',
  notFoundText: 'The link may be outdated, or the page may have moved. Go to the home page or call 571 0600.',
  ovTitle: 'Requests (sample) | STOÐ pallaleiga', ovDesc: 'A sample of how requests from the website would reach STOÐ staff: type, equipment, place, time and size on one line. Every entry is a sample.',
  ovMarquee: 'Requests', ovLabel: '(Sample)', ovH1: 'Requests from the website (sample)',
  ovLead: 'This is how ', ovStatement: 'requests from the website would arrive: each one says straight away whether it is hire or a job, where, when and how high, so the first call goes on the quote and not on questions.',
  ovNoticeTag: 'Sample data', ovNotice: 'Every request on this page was made up to show the layout. The addresses are invented and no entry comes from STOÐ or its customers.',
  ovInboxTitle: 'Latest requests', ovInboxSub: 'One line per request (sample).',
  ovBriefTitle: 'One request opened', ovBriefSub: 'Everything a quote needs in one place (sample).',
  ovCol1: 'Type', ovCol2: 'What', ovCol3: 'Where', ovCol4: 'When', ovCol5: 'Size', ovCol6: 'Status',
  ovCta: 'See the request as a customer sees it', ovCtaLink: 'Get a quote', ovBreak: 'Scaffolding on an apartment building',
  fromWord: 'From',
  homeSub: 'Mobile towers, scaffolding, suspended platforms, ladders and steps. The price list is here in one place, and the request says straight away where, when and how high.',
  homeCtaEnquire: 'Get a quote', homeCtaSale: 'See prices',
  factsAria: 'At a glance', factFrom: 'mobile tower a day', factHeight: 'highest tower working height', factHoist: 'suspended platforms', factFounded: 'founded',
  saleTitle: 'For hire',
  saleText: 'Four product families, each with its own page and price list. Prices are from pallaleiga.is, read on 2 October 2026; staff confirm price and availability.',
  cardPrice: 'Price', cardRange: 'Height and size', cardService: 'Service', cardView: 'View', cardEnquire: 'Get a quote',
  moreTitle: 'For sale', moreText: 'Everything for hire can also be bought. STOÐ imports from these manufacturers.', moreView: "Maker's website", moreAsk: 'Ask for a price',
  howTitle: 'How the request works',
  how1: 'Hire or a job', how1Text: 'Hire a mobile tower, ladder or platform, or a job where STOÐ puts up scaffolding and takes it down. Not sure? Choose that and describe the job.',
  how2: 'Where, when and how high', how2Text: 'Dates, the address and the rough length and height of the building. Photos help but are optional.',
  how3: 'Staff confirm', how3Text: 'STOÐ staff confirm quantities, price and timing. The website does not reserve equipment or design scaffolding.',
  priceTitle: 'Prices at a glance', priceText: 'Prices as pallaleiga.is publishes them, read on 2 October 2026. Scaffolding and netting are quoted per job.',
  priceItem: 'Item', priceDay: 'Day', priceWeek: 'Week', priceQuote: 'Quoted by length × height', priceFrom: 'from',
  endTitle: 'Get in touch', endText: 'Tunguháls 17, 110 Reykjavík. Weekdays 8:00-12:00 and 13:00-17:00, closed at weekends.',
  needQuote: 'Quotes for jobs', needQuoteText: 'Lúðvík quotes scaffolding, netting and set-up.', needQuoteGo: '660 7604',
  needSetup: 'Set-up and take-down', needSetupText: 'Scaffolding, netting and platforms, put up and taken down when the job is done.', needSetupGo: 'Ask for a quote',
  needMap: 'Where we are', needMapText: 'Tunguháls 17, 110 Reykjavík. The coffee is always on.', needMapGo: 'Map',
  ledgerHint: 'Press Book and the request opens with the working height chosen.',
  sourceLink: 'The page on pallaleiga.is', allPrices: 'Everything for hire',
}
export const T: Record<Lang, Record<string, string>> = { is: IS_T, en: EN_T }

/* -------------------------------------------------------------------------------------------- catalogue entry */
export const companyEntry: PreviewCompany = {
  slug: 'stod',
  route: '/preview/stod',
  name: 'STOÐ pallaleiga',
  sector: 'Pallaleiga: leiga, sala og uppsetning',
  location: 'Tunguháls 17, 110 Reykjavík',
  region: 'Reykjavík',
  established: 'Stofnuð í júní 2009.',
  currentUrl: 'https://www.pallaleiga.is',
  ownerEmail: '',
  concept: 'Ein beiðni sem segir hvað verkið þarf',
  conceptTagline:
    'STOÐ birtir verð á ellefu undirsíðum og tekur við beiðnum í almennu formi með nafni, titli og skilaboðum. Frumgerðin setur verðskrána á einn stað og skiptir beiðninni í leigu og verk: tæki, vinnuhæð og dagsetningar fyrir leigu, heimilisfang, lengd og hæð hússins, uppsetningu og myndir fyrir verk, svo að starfsfólk fær allt sem þarf í tilboð í fyrstu beiðni.',
  accent: '#005C9C',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}stod/hero-s.webp`,
  ownPhotography: true,
  photoCredit: 'Ljósmyndir, verð og merki eru af pallaleiga.is, sótt 2. október 2026. Litlar vörumyndir voru stækkaðar (upscale) án þess að breyta myndefninu.',
  audit: {
    strengths: [
      'Verð birt fyrir hjólapalla eftir vinnuhæð, stiga, tröppur, loftastoðir og víralyftur, sem fáar pallaleigur gera',
      'Rekstur síðan 2009 á Tunguhálsi 17, með uppsetningu og niðurtekt sem þjónustu',
      'Eigin myndir af pöllum á verkstöðum, meðal annars hús HB Granda klætt pöllum',
    ],
    weaknesses: [
      'Verðin eru dreifð á ellefu undirsíður; enginn staður sýnir verðskrána í heild',
      'Formið á Hafðu samband biður um nafn, netfang, síma, titil og skilaboð: engin dagsetning, heimilisfang, tæki, hæð eða myndir',
      'Fréttasíðan sýnir hrátt sniðmát, {News1}Frettir{/News1}, líka í lýsingu síðunnar',
      'Á Sala-síðunni vísar hlekkur Amadio á vef ASC, og engin síða er með lýsingu (meta description) fyrir leitarvélar',
    ],
    opportunities: [
      'Ein verðskrá og pöntun beint af verðlínunni, með vinnuhæðina valda',
      'Tvískipt beiðni, leiga eða verk, sem safnar því sem þarf í tilboð',
      'Beiðnir berast starfsfólki sem ein lesanleg lína en ekki tölvupóstur sem þarf að svara með spurningum',
    ],
  },
  positioning:
    'STOÐ selur tæki sem viðskiptavinurinn þarf að lýsa rétt: vinnuhæð, lengd og hæð hússins, dagsetningar og hvort þarf uppsetningu. Núverandi vefur birtir verðin en dreifir þeim, og formið spyr ekki um neitt af þessu. ' +
    'Frumgerðin lætur vefinn spyrja réttu spurninganna, með áætluðum málum leyfðum, og starfsfólk staðfestir allt sem varðar öryggi, magn og verð.',
  outreach: { subject: '', body: '' },
}
