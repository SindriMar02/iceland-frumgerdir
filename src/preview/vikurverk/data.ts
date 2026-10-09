import type { PreviewCompany } from '../company-types'
import ASSETS from './assets.json'

/*
 * Víkurverk ehf. Every fact here was read on 09.10.2026 in a browser from
 * vikurverk.is (unit pages, /leigan/, the rental product pages, /verkstaedi/,
 * /opnunartimi/, /starfsfolk/, /um-okkur/, the shop's public Store API), the
 * used list at notadir.vikurverk.is, the PDF flyers linked from each unit page,
 * and Skatturinn's company register. Gap analysis with a source per line:
 * _docs/VIKURVERK-GAP-2026-10-09.md. Raw pages, photos and the manifest:
 * _docs/vikurverk-harvest-2026-10-09/.
 */

const BASE = import.meta.env.BASE_URL
export const A = (name: string) => `${BASE}vikurverk/${name}`
export const ROUTE = '/preview/vikurverk'

export type Photo = { src: string; srcSet: string; alt: string; w: number; h: number }
type Asset = { widths: number[]; w: number; h: number }
const AS = ASSETS as Record<string, Asset>
export const photo = (name: string, alt: string): Photo => {
  const a = AS[name]
  if (!a) throw new Error(`missing asset ${name}`)
  const top = a.widths[a.widths.length - 1]
  return { src: A(`${name}-${top}.webp`), srcSet: a.widths.map((x) => `${A(`${name}-${x}.webp`)} ${x}w`).join(', '), alt, w: a.w, h: a.h }
}

export const CONTACT = {
  legal: 'Víkurverk ehf.',
  kt: '500306-1650',
  vsk: '89872',
  street: 'Víkurhvarf 6',
  town: '203 Kópavogur',
  phone: '557 7720',
  tel: '+3545577720',
  email: 'vikurverk@vikurverk.is',
  workshop: 'verkstaedi@vikurverk.is',
  parts: 'varahlutir@vikurverk.is',
  damage: 'tjonamat@vikurverk.is',
  facebook: 'https://www.facebook.com/vikurverk',
  youtube: 'https://www.youtube.com/channel/UCPNSVTcYSer3b7qYKrj3vBw',
  slogan: 'Allt í ferðalagið',
  summary: 'Víkurverk selur nýja húsbíla, hjólhýsi, sporthýsi og tjaldvagna, notaða ferðavagna, aukahluti og varahluti, rekur verkstæði allt árið og leigir út hjólhýsi og Mink.',
}

/* Shop hours from /opnunartimi/. Iceland keeps UTC all year. d = JS weekday. */
type Span = { d: number[]; from: number; to: number }
const SUMMER: Span[] = [{ d: [1, 2, 3, 4, 5], from: 600, to: 1080 }, { d: [6], from: 660, to: 900 }]
const WINTER: Span[] = [{ d: [1, 2, 3, 4, 5], from: 600, to: 1020 }]
export const HOURS = {
  shopWinter: 'September til febrúar: virka daga kl. 10-17, lokað um helgar',
  shopSummer: 'Mars til ágúst: virka daga kl. 10-18, laugardaga kl. 11-15',
  workshop: 'Verkstæði: virka daga kl. 8-17',
}
export function openState(now = new Date()) {
  const month = now.getUTCMonth() + 1
  const spans = month >= 3 && month <= 8 ? SUMMER : WINTER
  const d = now.getUTCDay()
  const m = now.getUTCHours() * 60 + now.getUTCMinutes()
  const today = spans.find((s) => s.d.includes(d))
  const hhmm = (x: number) => `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`
  if (today && m >= today.from && m < today.to) return { open: true, text: `Opið til ${hhmm(today.to)}` }
  if (today && m < today.from) return { open: false, text: `Opnar kl. ${hhmm(today.from)}` }
  return { open: false, text: 'Lokað núna' }
}

export const kr = (n: number) => `${n.toLocaleString('de-DE')} kr.`

/* ── Units ─────────────────────────────────────────────────────────────── */
export type Kind = 'hjolhysi' | 'husbill' | 'sporthysi' | 'tjaldvagn'
export const KINDS: { key: Kind; label: string; plural: string }[] = [
  { key: 'hjolhysi', label: 'Hjólhýsi', plural: 'Hjólhýsi' },
  { key: 'husbill', label: 'Húsbíll', plural: 'Húsbílar' },
  { key: 'sporthysi', label: 'Sporthýsi', plural: 'Sporthýsi' },
  { key: 'tjaldvagn', label: 'Tjaldvagn', plural: 'Tjaldvagnar' },
]
export type Unit = {
  slug: string; brand: string; brandKey: string; model: string; kind: Kind; cond: 'ny' | 'notad'
  price: number; flott?: boolean; year?: string; sleeps?: string; sleepsN?: number; weight?: number; maxWeight?: number
  length?: number; width?: number; height?: number; heating?: string; note?: string
  plan?: Photo; imgs: Photo[]; specs: [string, string][]; text: string[]; pdf?: string; v360?: string; src: string; reg?: string
}
const u = (k: string, n: number, alt: string) => Array.from({ length: n }, (_, i) => photo(`u-${k}-${i}`, i === 0 ? alt : `${alt}, mynd ${i + 1}`))

export const UNITS: Unit[] = [
  { slug: 'adria-aviva-360-dk', brand: 'Adria', brandKey: 'adria', model: 'Aviva 360 DK', kind: 'hjolhysi', cond: 'ny', price: 3990000,
    sleeps: '4', sleepsN: 4, weight: 750, maxWeight: 1000, length: 415, width: 209, height: 258, heating: 'Truma',
    plan: photo('u-aviva-360-dk-0', 'Grunnmynd Adria Aviva 360 DK'), imgs: u('aviva-360-dk', 5, 'Adria Aviva 360 DK').slice(1),
    specs: [['Heildarlengd með beisli', '548 cm'], ['Lengd húss', '415 cm'], ['Breidd', '209 cm'], ['Eigin þyngd', '750 kg'], ['Svefnpláss', '4'], ['Rúm', '194 x 126 cm'], ['Miðstöð', 'Truma'], ['Vatnstankur', '50 L']],
    text: ['Léttasta hjólhýsið í úrtakinu: 750 kg eigin þyngd og 209 cm á breidd.', 'Truma miðstöð og Truma Therme vatnshitari, 230 V, 12 V og USB tengi.'],
    pdf: 'https://vikurverk.is/wp-content/uploads/2025/12/Aviva_360_DK.pdf', src: 'https://vikurverk.is/vorur-3/adria-aviva-360-dk/' },
  { slug: 'hobby-de-luxe-460-ufe', brand: 'Hobby', brandKey: 'hobby', model: 'De Luxe 460 UFe', kind: 'hjolhysi', cond: 'ny', price: 6480000,
    sleeps: '4', sleepsN: 4, weight: 1240, maxWeight: 1350, length: 546, width: 230, height: 263, heating: 'Truma',
    plan: photo('u-deluxe-460-ufe-0', 'Grunnmynd Hobby De Luxe 460 UFe'), imgs: u('deluxe-460-ufe', 5, 'Hobby De Luxe 460 UFe').slice(1),
    specs: [['Heildarlengd', '664 cm'], ['Stærð (L x B x H)', '546 x 230 x 263 cm'], ['Eigin þyngd', '1.240 kg'], ['Leyfileg heildarþyngd', '1.350 kg'], ['Svefnpláss', '4'], ['Hjónarúm', '138/109 x 195 cm'], ['Aukarúm', '135 x 204 cm'], ['Miðstöð', 'Truma S-3004']],
    text: ['Hjónarúm með springdýnu og aukarúm 135 x 204 cm. Thetford C500 klósett.', 'Hobby birtir 360° skoðun af vagninum; hlekkurinn fylgir hér.'],
    pdf: 'https://vikurverk.is/wp-content/uploads/2025/12/De_Luxe_460_UFe-1.pdf',
    v360: 'https://data.hobby-caravan.de/fileadmin_360_views/user_upload_360_views/2026/WW/DE_LUXE_460_UFe/index.htm', src: 'https://vikurverk.is/vorur-3/hobby-de-luxe-460-ufe/' },
  { slug: 'fendt-bianco-activ-445-sfb', brand: 'Fendt', brandKey: 'fendt', model: 'Bianco Activ 445 SFB', kind: 'hjolhysi', cond: 'ny', price: 7295000,
    sleeps: '4', sleepsN: 4, weight: 1249, maxWeight: 1500, width: 232, heating: 'Combi 4E',
    plan: photo('u-bianco-445-sfb-0', 'Grunnmynd Fendt Bianco Activ 445 SFB'), imgs: u('bianco-445-sfb', 5, 'Fendt Bianco Activ 445 SFB').slice(1),
    specs: [['Heildarlengd', '677 cm'], ['Breidd', '232 cm'], ['Eigin þyngd', '1.249 kg'], ['Leyfileg heildarþyngd', '1.500 kg'], ['Svefnpláss', '4'], ['Rúm', '140 x 210 cm'], ['Aukarúm', '137/133 x 210 cm'], ['Miðstöð', 'Truma Combi 4E']],
    text: ['Þýskt hjólhýsi frá Fendt með 31 mm veggjum, 39 mm þaki og 47 mm gólfi.', 'Tvö sett af rúmfatnaði fylgja samkvæmt bæklingi Víkurverks.'],
    pdf: 'https://vikurverk.is/wp-content/uploads/2025/11/Bianco_Activ_445_SFB.pdf', src: 'https://vikurverk.is/vorur-3/fendt-bianco-activ-445-sfb/' },
  { slug: 'hobby-prestige-620-cl', brand: 'Hobby', brandKey: 'hobby', model: 'Prestige 620 CL', kind: 'hjolhysi', cond: 'ny', price: 8780000,
    sleeps: '4', sleepsN: 4, weight: 1639, maxWeight: 2000, length: 686, width: 250, height: 264,
    plan: photo('u-prestige-620-cl-0', 'Grunnmynd Hobby Prestige 620 CL'), imgs: u('prestige-620-cl', 5, 'Hobby Prestige 620 CL').slice(1),
    specs: [['Stærð (L x B x H)', '686 x 250 x 264 cm'], ['Eigin þyngd', '1.639 kg'], ['Leyfileg heildarþyngd', '2.000 kg'], ['Svefnpláss', '4'], ['Rúm', '2 x 197 x 89 cm'], ['Aukarúm', '223 x 205 x 160 cm'], ['Grind', '2 öxlar, KNOTT'], ['Fortjald', 'allt að stærð 500']],
    text: ['Tvö einstaklingsrúm sem má tengja saman og aukarúm 223 x 205 cm.', 'Álagsbremsur með bakkvörn. Hobby birtir 360° skoðun.'],
    pdf: 'https://vikurverk.is/wp-content/uploads/2025/12/Prestige_620_CL-1.pdf', src: 'https://vikurverk.is/vorur-3/hobby-prestige-620-cl/' },
  { slug: 'mink-s', brand: 'Mink', brandKey: 'mink', model: 'Mink-S', kind: 'sporthysi', cond: 'ny', price: 4380000,
    sleeps: '2-3', sleepsN: 3, weight: 520, maxWeight: 750, length: 412,
    imgs: [photo('u-mink-s-0', 'Mink-S sporthýsi'), photo('u-leiga-mink-0', 'Mink með markísu á tjaldsvæði'), photo('u-leiga-mink-2', 'Mink við sólsetur')],
    specs: [['Heildarlengd', '412 cm'], ['Eigin þyngd', '520 kg'], ['Leyfileg heildarþyngd', '750 kg'], ['Svefnpláss', '2-3'], ['Rúm', '140 x 200 cm'], ['Skel', '30 mm']],
    text: ['MINK-S er upprunalega sporthýsið frá Mink Campers, hannað á Íslandi fyrir íslenskar aðstæður.', 'Létt og hannað til að kljúfa vindinn, svo flestir bílar ættu að geta dregið það, hvort sem þeir ganga fyrir eldsneyti eða rafmagni.'],
    pdf: 'https://vikurverk.is/wp-content/uploads/2026/einblodungar/Mink/Mink_Campers.pdf', src: 'https://vikurverk.is/mink-s/' },
  { slug: 'camp-let-north', brand: 'Camp-Let', brandKey: 'camplet', model: 'North', kind: 'tjaldvagn', cond: 'ny', price: 1990000,
    sleeps: '4', sleepsN: 4, weight: 500, maxWeight: 730, length: 550,
    imgs: u('camplet-north', 5, 'Camp-Let North tjaldvagn'),
    specs: [['Heildarlengd', '550 cm'], ['Eigin þyngd', '500 kg'], ['Leyfileg heildarþyngd', '730 kg'], ['Svefnpláss', '4'], ['Rúm', '2 x 140 x 200 cm'], ['Eldhús', 'gaseldavél, 2 hellur'], ['Grind', 'AL-KO, 13" álfelgur']],
    text: ['Tilbúinn í útileguna á 1.990.000 kr. með eldhúsi, samkvæmt tilboði Víkurverks.', 'Rúmgóð setustofa og svefnhólf með plássi fyrir fjóra.'],
    pdf: 'https://vikurverk.is/wp-content/uploads/2024/06/Camplet_North_Tjaldvagn_2024.pdf', src: 'https://vikurverk.is/camplet-north/' },
  { slug: 'randger-r560', brand: 'Randger', brandKey: 'randger', model: 'R560 4x4', kind: 'husbill', cond: 'ny', price: 18980000,
    weight: 3018, maxWeight: 3500, length: 598, width: 206, height: 275, heating: 'Truma Combi D4',
    plan: photo('u-randger-r560-0', 'Grunnmynd Randger R560'), imgs: u('randger-r560', 5, 'Randger R560 4x4 húsbíll').slice(1),
    specs: [['Undirvagn', 'Ford 2.0 TDCI, 170 hö'], ['Drif', 'Fjórhjóladrif'], ['Skipting', 'Beinskiptur, 6 gírar'], ['Stærð (L x B x H)', '598 x 206 x 275 cm'], ['Eigin þyngd', '3.018 kg'], ['Leyfileg þyngd', '3.500 kg'], ['Miðstöð', 'Truma Combi D4 dísil'], ['Neysluvatn', '100 L']],
    text: ['Ford með fjórhjóladrifi, spólvörn og stöðugleikakerfi. Víkurverk: „Þessi er mættur til okkar!“', 'Loftkæling í stýrishúsi, cruise control og aðgerðastýri.'],
    src: 'https://vikurverk.is/randger-r560/' },
  { slug: 'dethleffs-495-2021', brand: 'Dethleffs', brandKey: 'dethleffs', model: '495', kind: 'hjolhysi', cond: 'notad', price: 3590000, flott: true, year: '6/2021',
    imgs: [photo('used-dethleffs-495-2021', 'Notað Dethleffs 495 hjólhýsi, árgerð 2021')], reg: '785514',
    specs: [['Árgerð', '6/2021'], ['Raðnúmer', '785514'], ['Staða', 'Á staðnum, Víkurhvarfi 6']],
    text: ['Notað hjólhýsi á „Flott verði“ af söluskrá Víkurverks.'], src: 'https://notadir.vikurverk.is/' },
  { slug: 'caravelair-alba-390-2024', brand: 'Caravelair', brandKey: 'caravelair', model: 'Alba 390', kind: 'hjolhysi', cond: 'notad', price: 3690000, flott: true, year: '6/2024',
    imgs: [photo('used-caravelair-alba-390-2024', 'Notað Caravelair Alba 390 hjólhýsi, árgerð 2024')], reg: '837158',
    specs: [['Árgerð', '6/2024'], ['Raðnúmer', '837158'], ['Aukabúnaður', 'Sólarsella, Ultraheat, inverter']],
    text: ['Nýlegt hjólhýsi með sólarsellu, Ultraheat og inverter, samkvæmt söluskránni.'], src: 'https://notadir.vikurverk.is/' },
  { slug: 'mink-camper-2-2024', brand: 'Mink', brandKey: 'mink', model: 'Sport Camper 2.0', kind: 'sporthysi', cond: 'notad', price: 3690000, year: '5/2024',
    imgs: [photo('used-mink-camper-2-2024', 'Notaður Mink Sport Camper 2.0, árgerð 2024')], reg: '272401',
    specs: [['Árgerð', '5/2024'], ['Raðnúmer', '272401']],
    text: ['Notaður Mink af söluskrá Víkurverks.'], src: 'https://notadir.vikurverk.is/' },
]
export const unitBySlug = (s: string) => UNITS.find((x) => x.slug === s)
export const unitName = (x: Pick<Unit, 'brand' | 'model'>) => `${x.brand} ${x.model}`
export const kindLabel = (k: Kind) => KINDS.find((x) => x.key === k)!.label
export const SAMPLE_NOTE = 'Úrtak: sjö nýir og þrír notaðir vagnar af vikurverk.is og notadir.vikurverk.is, eins og vefirnir stóðu 9. október 2026. Allt úrvalið: 46 hjólhýsi frá Hobby, Adria og Fendt, 6 húsbílar, 4 sporthýsi og 24 notaðir vagnar.'

export type BrandPlate = { key: string; name: string; kind: string; line: string; count: string; img: Photo }
export const PLATES: BrandPlate[] = [
  { key: 'hobby', name: 'Hobby', kind: 'Hjólhýsi', line: 'Þýsk hjólhýsi, frá Ontour upp í Prestige.', count: '18 gerðir', img: photo('u-prestige-620-cl-1', 'Hobby Prestige 620 CL í sýningarsal') },
  { key: 'adria', name: 'Adria', kind: 'Hjólhýsi', line: 'Frá Aviva, 750 kg, upp í Alpina.', count: '18 gerðir', img: photo('u-aviva-360-dk-1', 'Adria Aviva 360 DK') },
  { key: 'fendt', name: 'Fendt', kind: 'Hjólhýsi', line: 'Bianco, Tendenza og Diamant.', count: '10 gerðir', img: photo('u-bianco-445-sfb-1', 'Innrétting í Fendt Bianco Activ 445 SFB') },
  { key: 'mink', name: 'Mink', kind: 'Sporthýsi', line: 'Hannað á Íslandi fyrir íslenskar aðstæður.', count: '3 gerðir', img: photo('mink-life', 'Mink sporthýsi með markísu') },
  { key: 'camplet', name: 'Camp-Let', kind: 'Tjaldvagnar', line: 'Tjaldvagn með eldhúsi, svefnpláss fyrir fjóra.', count: 'Tilboð', img: photo('camplet-life', 'Fjölskylda í Camp-Let North') },
  { key: 'randger', name: 'Randger', kind: 'Húsbílar', line: 'R560 4x4 á Ford og R640 á Fiat.', count: '2 gerðir', img: photo('u-randger-r560-1', 'Randger R560 4x4 í sýningarsal') },
]

/* ── Rental (from /leigan/ and the three rental product pages) ─────────── */
export type Rental = { key: string; name: string; short: string; price: number; peak?: number; sleeps: string; img: Photo; imgs: Photo[]; specs: [string, string][]; text: string; extras: string[] }
export const RENTALS: Rental[] = [
  { key: 'adora-593-uk', name: 'Adria Adora 593 UK', short: 'Hjólhýsi fyrir sjö', price: 195000, peak: 229000, sleeps: '7',
    img: photo('u-leiga-593-0', 'Adria Adora 593 UK leiguhjólhýsi'), imgs: u('leiga-593', 5, 'Adria Adora 593 UK').slice(1),
    specs: [['Heildarlengd', '803 cm'], ['Innanlengd', '593 cm'], ['Breidd', '246 cm'], ['Eigin þyngd', '1.580 kg'], ['Leyfileg heildarþyngd', '2.000 kg'], ['Hiti', 'Alde, 220 V eða gas']],
    text: 'Hjónarúm og þrjár kojur, svefnpláss fyrir allt að sjö. Eldhúsáhöld, útiborð, útistólar, framlengingarspeglar og uppblásin markísa fylgja.',
    extras: ['trygging', 'thrif', 'fortjald'] },
  { key: 'adora-522-up', name: 'Adria Adora 522 UP', short: 'Hjólhýsi', price: 195000, peak: 229000, sleeps: '4',
    img: photo('u-leiga-522-1', 'Adria Adora 522 UP leiguhjólhýsi'), imgs: u('leiga-522', 5, 'Adria Adora 522 UP').slice(1),
    specs: [['Heildarlengd', '721 cm'], ['Innanlengd', '520 cm'], ['Breidd', '230 cm'], ['Eigin þyngd', '1.315 kg'], ['Leyfileg heildarþyngd', '1.700 kg'], ['Hiti', 'Alde, 220 V eða gas']],
    text: 'Hjónarúm og borðkrókur sem breytist í rúm, svefnpláss fyrir allt að fjóra. Eldhúsáhöld, útiborð, útistólar og uppblásin markísa fylgja.',
    extras: ['trygging', 'thrif', 'fortjald'] },
  { key: 'mink', name: 'Mink', short: 'Sporthýsi fyrir tvo', price: 165000, sleeps: '2',
    img: photo('u-leiga-mink-2', 'Mink sporthýsi við sólsetur'), imgs: [photo('u-leiga-mink-0', 'Mink með markísu'), photo('u-leiga-mink-1', 'Mink á tjaldsvæði')],
    specs: [['Heildarlengd', '412 cm'], ['Svefnpláss', '2'], ['Leigutími', '7 dagar / 6 nætur']],
    text: 'Íslenskt sporthýsi sem flestir bílar ráða við. Svefnpláss fyrir tvo.',
    extras: ['trygging', 'thrif'] },
]
export const EXTRAS: Record<string, { label: string; price: number; note: string }> = {
  trygging: { label: 'Trygging vegna sjálfsábyrgðar', price: 14900, note: 'Sjálfsábyrgð kaskótryggingar er annars 100.000 kr. í hverju tjóni.' },
  fortjald: { label: 'Uppblásið fortjald', price: 19900, note: 'Fyrir hjólhýsin.' },
  thrif: { label: 'Þrif eftir leigu', price: 19900, note: 'Annars þarf að skila vagninum hreinum.' },
}
export const RENTAL_TERMS = [
  'Leigutími er sjö dagar og sex nætur, frá fimmtudegi til miðvikudags.',
  'Vagnarnir eru afhentir á fimmtudögum kl. 13-15 í Víkurhvarfi 6.',
  'Hægt er að afbóka allt að 30 dögum fyrir leigudag og fá fulla endurgreiðslu, allt að 14 dögum fyrir og fá 50% endurgreidd.',
  'Leigutaki fyllir sjálfur á gaskútinn og kemur með sængur eða svefnpoka.',
  'Utanvegaakstur er bannaður. Bíllinn þarf viðurkenndan tengibúnað.',
  'Ökuréttindi gefin út fyrir 15. ágúst 1997 gilda sjálfkrafa til að draga hjólhýsi; yngri réttindi þarf að bæta við.',
]
/* The 2027 season laid out like their 2026 one: Thursday to Wednesday, mid-May to mid-September.
   The peak week is the one with verslunarmannahelgi (229.000 kr. in 2026). */
export type Week = { i: number; start: Date; end: Date; label: string; peak: boolean }
const iso = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d))
const MON = ['jan.', 'feb.', 'mars', 'apr.', 'maí', 'júní', 'júlí', 'ág.', 'sept.', 'okt.', 'nóv.', 'des.']
export const fmtDay = (d: Date) => `${d.getUTCDate()}. ${MON[d.getUTCMonth()]}`
export const SEASON: Week[] = Array.from({ length: 18 }, (_, i) => {
  const start = new Date(iso(2027, 5, 13).getTime() + i * 7 * 864e5)
  const end = new Date(start.getTime() + 6 * 864e5)
  return { i, start, end, label: `${fmtDay(start)} - ${fmtDay(end)}`, peak: start.getTime() === iso(2027, 7, 29).getTime() }
})
/* Sample bookings so the calendar shows what "taken" looks like. Not Víkurverk's real bookings. */
export const SAMPLE_BOOKED: Record<string, number[]> = { 'adora-593-uk': [4, 5, 6, 8, 13], 'adora-522-up': [5, 6, 7, 11, 12], mink: [3, 6, 10] }

/* ── Shop (real products from the Store API, 9 Oct 2026) ───────────────── */
export type Product = { slug: string; name: string; brand?: string; cat: string; price: number; img: Photo; desc: string }
const p = (slug: string, name: string, cat: string, price: number, desc: string, brand?: string): Product => ({ slug, name, cat, price, desc, brand, img: photo(`p-${slug}`, name) })
export const SHOP_CATS = [
  { key: 'fortjold', label: 'Fortjöld', count: 190 },
  { key: 'grill', label: 'Grill og gas', count: 70 },
  { key: 'stolar', label: 'Stólar og borð', count: 58 },
  { key: 'kaeli', label: 'Kælibox', count: 23 },
  { key: 'hiti', label: 'Hitarar', count: 17 },
  { key: 'vagninn', label: 'Fyrir vagninn', count: 91 },
]
export const PRODUCTS: Product[] = [
  p('fortjald-club-air-pro-260s-kampa-dometic', 'Fortjald Club Air Pro 260S', 'fortjold', 299900, 'Uppblásið fortjald frá Kampa/Dometic.', 'Kampa Dometic'),
  p('o-grill-3500-rautt', 'Ferðagasgrill O-Grill 800 T, rautt', 'grill', 49900, 'Vinsælt ferðagasgrill. Hitamælir á loki, 3,2 kW.', 'O-Grill'),
  p('bordstandur-fyrir-o-grill', 'Borðstandur fyrir O-Grill', 'grill', 14995, 'Samanbrjótanlegur og auðveldur í notkun.', 'O-Grill'),
  p('taska-fyrir-o-grill', 'Taska fyrir O-Grill', 'grill', 4495, 'Slangan kemst fyrir í henni með grillinu.', 'O-Grill'),
  p('thrystijafnari-29mb-m-2-slongu', 'Þrýstijafnari 29 mb með slöngu', 'grill', 5900, 'Áföst slanga, 150 cm, með hosuklemmu.', 'Reimo'),
  p('raptor-jackofall-nyr-2025-brunner', 'Stóll Raptor Jackofall', 'stolar', 14900, '65 x 60 cm, samanbrotinn 25 x 18 x 92 cm.', 'Brunner'),
  p('stoll-aravel-3d-m-svartur-brunner', 'Stóll Aravel 3D Medium, svartur', 'stolar', 25900, 'Léttur, stillanlegt bak.', 'Brunner'),
  p('thermo-kaelibox-28l', 'Kælibox Polarys Travel 28 L', 'kaeli', 24995, 'Nett og létt kælibox fyrir lautarferðina.', 'Brunner'),
  p('kaelibox-polarys-freeze-sz-30l-brunner', 'Kælibox Polarys Freeze SZ 30 L', 'kaeli', 69900, 'Kæli- og frystiskápur í höggheldu plasthúsi.', 'Brunner'),
  p('gashitari-42-kw-fmt', 'Gashitari 4,2 kW', 'hiti', 24995, 'Vinsæll hitari í fortjaldið. Þrýstijafnari fylgir ekki.', 'FMT'),
  p('neysluvatns-frostlogur-2', 'Neysluvatnsfrostlögur', 'vagninn', 6490, 'Í vatnslagnir vagnsins fyrir vetrargeymslu.', 'Víkurverk'),
  p('wc-pappir', 'WC klósettpappír, 6 rúllur', 'vagninn', 1495, 'Brotnar hratt niður í ferðasalerni.', 'Fiamma'),
  p('troppur-king', 'Trappa King Double Step', 'vagninn', 11995, 'Tveggja þrepa, stálgrind og rifflað gúmmí.', 'Brunner'),
  p('level-up-kit-m-tosku', 'Upphækkun Level Up, kit', 'vagninn', 8490, 'Til að rétta vagninn af á ójöfnu undirlagi. Tvö stykki í tösku.', 'Fiamma'),
]
export const productBySlug = (s: string) => PRODUCTS.find((x) => x.slug === s)
export const SHOP_NOTE = 'Úrtak: 14 af 1.635 vörum í vefverslun Víkurverks, með verði eins og það stóð 9. október 2026.'
export const FREE_SHIPPING = 20000

/* The trip list: a starting list per trip, from real products. */
export type Trip = { key: string; label: string; line: string; items: [string, number][] }
export const TRIPS: Trip[] = [
  { key: 'helgi', label: 'Helgarferð', line: 'Tvær nætur á tjaldsvæði.', items: [['o-grill-3500-rautt', 1], ['thrystijafnari-29mb-m-2-slongu', 1], ['raptor-jackofall-nyr-2025-brunner', 2], ['thermo-kaelibox-28l', 1], ['wc-pappir', 1]] },
  { key: 'sumarfri', label: 'Sumarfríið', line: 'Vika eða meira, fortjald og allt.', items: [['fortjald-club-air-pro-260s-kampa-dometic', 1], ['o-grill-3500-rautt', 1], ['bordstandur-fyrir-o-grill', 1], ['stoll-aravel-3d-m-svartur-brunner', 2], ['kaelibox-polarys-freeze-sz-30l-brunner', 1], ['troppur-king', 1], ['level-up-kit-m-tosku', 1], ['wc-pappir', 2]] },
  { key: 'haust', label: 'Haust og vetur', line: 'Fortjaldshiti í september og frágangur fyrir veturinn.', items: [['gashitari-42-kw-fmt', 1], ['thrystijafnari-29mb-m-2-slongu', 1], ['neysluvatns-frostlogur-2', 2]] },
]

/* ── Workshop (from /verkstaedi/) ──────────────────────────────────────── */
export const SERVICES = [
  { key: 'thjonusta', label: 'Þjónustuskoðun', line: 'Reglubundin yfirferð á hjólhýsi eða húsbíl.' },
  { key: 'abyrgd', label: 'Ábyrgðar- og lekaskoðun', line: 'Ábyrgðarskoðun og lekaábyrgðarskoðun hjólhýsa.' },
  { key: 'vetur', label: 'Vetrarstandsetning', line: 'Vatn, rafmagn og frostlögur fyrir veturinn.' },
  { key: 'tjon', label: 'Tjónaviðgerð', line: 'Tjónamat og tjónsnúmer frá tryggingafélagi þarf að liggja fyrir.' },
  { key: 'vidgerd', label: 'Önnur viðgerð', line: 'Lýstu því sem er að.' },
]
export const WORKSHOP_FACTS = [
  'Verkstæðið er opið allt árið. Áhersla er á viðgerðir og viðhald á hjólhýsum og húsbílum og standsetningu nýrra vagna.',
  'Stærri tjónaviðgerðir eru yfirleitt unnar 1. september til 1. apríl.',
  'Varahlutir sem þarf að sérpanta taka oft 6-12 vikur. Gefðu upp fastanúmer vagnsins.',
  'Verkstæðið tekur ekki við fellihýsum til viðgerðar.',
  'Móttakan er austan megin við húsið: leggðu vagninum milli gulu línanna.',
]

/* ── People (from /starfsfolk/) ────────────────────────────────────────── */
export const PEOPLE = [
  { name: 'Víðir Róbertsson', role: 'Framkvæmdastjóri', email: 'vidir@vikurverk.is' },
  { name: 'Bjarni Farestveit', role: 'Söluráðgjafi', email: 'bjarni@vikurverk.is' },
  { name: 'Pétur Örn Bjarnason', role: 'Söluráðgjafi', email: 'petur@vikurverk.is' },
  { name: 'Helgi Garðar Guðmundsson', role: 'Þjónustustjóri varahluta', email: 'varahlutir@vikurverk.is' },
]

/* ── Requests from the forms (kept in this browser for the prototype) ── */
export type ReqKind = 'leiga' | 'skodun' | 'uppitaka' | 'verkstaedi' | 'ferdalisti'
export const REQ_LABEL: Record<ReqKind, string> = { leiga: 'Leiga', skodun: 'Skoðun', uppitaka: 'Uppítaka', verkstaedi: 'Verkstæði', ferdalisti: 'Ferðalisti' }
export type Request = { id: string; kind: ReqKind; title: string; when: string; who: string; contact: string; detail: string; at: string; status: 'ný' | 'staðfest' }
export const routeTo = (k: ReqKind) => (k === 'verkstaedi' ? CONTACT.workshop : k === 'ferdalisti' ? 'verslun@vikurverk.is' : k === 'leiga' ? CONTACT.email : 'Söluráðgjafar (vidir@, bjarni@, petur@)')
const RK = 'vv-requests'
export function loadRequests(): Request[] { try { return JSON.parse(sessionStorage.getItem(RK) ?? '[]') } catch { return [] } }
export function saveRequest(r: Omit<Request, 'id' | 'at' | 'status'>): Request {
  const full: Request = { ...r, id: `VV-${Date.now().toString(36).toUpperCase().slice(-5)}`, at: new Date().toISOString(), status: 'ný' }
  try { sessionStorage.setItem(RK, JSON.stringify([full, ...loadRequests()])) } catch { /* private mode */ }
  return full
}
export const SAMPLE_REQUESTS: Request[] = [
  { id: 'VV-S0001', kind: 'leiga', title: 'Adria Adora 593 UK, 15. júlí - 21. júlí', when: 'Sumar 2027', who: 'Sýnishorn: fjölskylda', contact: '690 0000', detail: 'Fimm manns. Trygging og fortjald.', at: '2026-10-09T09:12:00Z', status: 'ný' },
  { id: 'VV-S0002', kind: 'uppitaka', title: 'Hobby 495 UFe 2017 upp í De Luxe 460 UFe', when: 'Sem fyrst', who: 'Sýnishorn', contact: 'netfang@example.is', detail: 'Fastanúmer XX000. Vill vita verðmat fyrir sýningarhelgi.', at: '2026-10-08T15:40:00Z', status: 'ný' },
  { id: 'VV-S0003', kind: 'verkstaedi', title: 'Ábyrgðar- og lekaskoðun', when: 'Vika 44', who: 'Sýnishorn', contact: '690 0001', detail: 'Adria Altea 2024, fastanúmer í beiðni.', at: '2026-10-08T10:05:00Z', status: 'staðfest' },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Víkurverk ehf.',
  slogan: 'Allt í ferðalagið',
  taxID: '500306-1650',
  telephone: '+354 557 7720',
  email: CONTACT.email,
  url: 'https://vikurverk.is',
  address: { '@type': 'PostalAddress', streetAddress: 'Víkurhvarf 6', postalCode: '203', addressLocality: 'Kópavogur', addressCountry: 'IS' },
  brand: PLATES.map((b) => ({ '@type': 'Brand', name: b.name })),
}

export const companyEntry: PreviewCompany = {
  slug: 'vikurverk',
  route: ROUTE,
  name: 'Víkurverk',
  sector: 'Hjólhýsi, húsbílar og ferðavagnar',
  location: 'Víkurhvarf 6, 203 Kópavogur',
  region: 'Höfuðborgarsvæðið',
  established: 'Skráð í mars 2006',
  currentUrl: 'https://vikurverk.is',
  ownerEmail: 'vikurverk@vikurverk.is',
  concept: 'Allt í ferðalagið',
  conceptTagline: 'The Set catalogue look crossed with the Vatt unit flows for a caravan and motorhome dealer: one catalogue for new and used units with floor plans on grey cards and filters by type, brand, sleeps, weight and price, six brand plates, a rental season calendar with weekly prices and extras, trade-in and viewing requests, workshop booking, the shop with a trip list built from real products, and a staff inbox. Their own swoosh draws the hero and the chosen rental weeks.',
  accent: '#01483A',
  dark: false,
  status: 'In build',
  thumb: A('ad-awning-800.webp'),
  ownPhotography: true,
  photoCredit: 'Myndir af vikurverk.is og notadir.vikurverk.is, október 2026 (framleiðendamyndir þar sem Víkurverk notar þær). Merki af vikurverk.is.',
  audit: {
    strengths: ['Verð birt á öllum nýjum vögnum', '1.635 vörur í virkri vefverslun', 'Leiga, verkstæði og sala undir einu þaki'],
    weaknesses: ['Leiguvikur sem eru liðnar enn til sölu og karfan býður Póstbox fyrir hjólhýsi', 'Notaðir vagnar á öðru kerfi með bílareitum (Dyrafjöldi 0)', 'Engin leið að bóka skoðun, taka upp í eða bóka verkstæði'],
    opportunities: ['Leigudagatal með sumrinu 2027 opnu í vetur', 'Einn listi yfir nýja og notaða vagna', 'Uppítaka og skoðun á hverri vagnsíðu'],
  },
  positioning: 'Víkurverk selur nýja og notaða ferðavagna, leigir út hjólhýsi og Mink, rekur verkstæði allt árið og vefverslun með aukahluti.',
  outreach: {
    subject: 'Víkurverk: allt í ferðalagið, á einum stað',
    body: 'Góðan dag,\n\nÉg setti saman hugmynd að nýjum vef fyrir Víkurverk:\n\n[HLEKKUR Á FRUMGERÐ]\n\nKveðja,\nSindri Már',
  },
}
