import { BRANCHES, BRANDS, CONTACT, FIELDS, KUHN_OFFER, LIVELINK, MACHINES, PARTS, STAFF, VAT, WARRANTY, kr, machineName, openState, type Machine } from './data'

/*
 * The assistant on this page, wired ONLY to this page: our <sndr-chat> widget
 * with its `answerer` hook. Every question is matched against data.ts, in the
 * browser, with no model and no network. It cannot say anything the page does
 * not say; a question it cannot match gets the designed refusal with the phone
 * number. English questions get English answers.
 */

type Card = { title: string; rows: { k: string; v: string; total?: boolean }[]; cta?: { label: string; href: string } }
export type Answer = { reply?: string; tool?: string; card?: Card; refused?: boolean; chips?: string[] }
type Msg = { role: 'user' | 'assistant'; content: string }

export const GREETING = 'Halló! Ég svara um vélarnar á lager, umboðin, verkstæðin þrjú, varahluti, ábyrgð og opnunartíma hjá Vélfangi. Hvað viltu vita?'
export const CHIPS = ['Hvaða Fendt eruð þið með?', 'Hvenær er opið?', 'Bóka verkstæði á Selfossi', 'Hvað kostar JCB hjólagrafan?']

export const fold = (s: string) =>
  s.toLowerCase().replace(/ð/g, 'd').replace(/þ/g, 'th').replace(/æ/g, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9/ .-]+/g, ' ').replace(/\s+/g, ' ').trim()

const EN_WORDS = /\b(the|what|when|where|how|do you|does|is it|price|prices|cost|open|opening|hours|tractor|tractors|excavator|loader|service|book|thanks?|hello|hi|which|your|warranty|parts|stock|used|new|brands?|workshop)\b/
const isEnglish = (raw: string) => EN_WORDS.test(raw.toLowerCase()) && !/[áðéíóúýþæö]/i.test(raw)
const has = (q: string, ...keys: (string | RegExp)[]) => keys.some((k) => (typeof k === 'string' ? q.includes(k) : k.test(q)))
const R = (href: string) => href
const BR = { rvk: 'Reykjavík', ak: 'Akureyri', sel: 'Selfoss' } as const

function priceRow(x: Machine, en: boolean) {
  return { k: machineName(x), v: `${kr(x.price)} ${en ? 'ex VAT' : 'án vsk.'}` }
}

function hours(en: boolean): Answer {
  const s = openState()
  return {
    tool: en ? 'checked opening hours' : 'athugaði opnunartíma',
    reply: en
      ? 'Gylfaflöt 32 in Reykjavík is open Monday to Thursday 8:00-17:00 and Friday 8:00-16:00. Akureyri and Selfoss do not publish hours on this page: call ahead (Akureyri 580 8222, Selfoss 767 8403).'
      : 'Gylfaflöt 32 í Reykjavík er opið mánudaga til fimmtudaga kl. 8-17 og föstudaga kl. 8-16. Akureyri og Selfoss birta ekki opnunartíma hér: hringdu á undan (Akureyri 580 8222, Selfoss 767 8403).',
    card: { title: en ? 'Gylfaflöt right now' : 'Gylfaflöt núna', rows: [{ k: en ? 'By the weekly hours' : 'Miðað við opnunartíma', v: en ? (s.open ? 'Open' : 'Closed') : s.text }] },
    chips: en ? ['Where are you?', 'Book a workshop slot'] : ['Hvar eruð þið?', 'Bóka verkstæði'],
  }
}

function where(en: boolean, q = ''): Answer {
  const one = /selfoss|gagnheid/.test(q) ? BRANCHES[2] : /akureyri|oseyri/.test(q) ? BRANCHES[1] : null
  if (one) return { reply: en ? `${one.street}, ${one.post}. Phone ${one.phone}.` : `${one.street}, ${one.post}. Sími ${one.phone}${one.key === 'ak' ? ', tímapantanir og varahlutir 580 8222' : ''}.`, card: { title: one.name, rows: [{ k: en ? 'Address' : 'Heimilisfang', v: `${one.street}, ${one.post}` }, { k: en ? 'Phone' : 'Sími', v: one.phone }], cta: { label: en ? 'Map' : 'Kort', href: R('utibu') } } }
  return {
    reply: en
      ? 'Three places: Gylfaflöt 32, 112 Reykjavík (head office, sales, parts, workshop); Óseyri 8, 603 Akureyri (workshop and parts); Gagnheiði 32, 800 Selfoss (workshop, opened May 2026).'
      : 'Á þremur stöðum: Gylfaflöt 32, 112 Reykjavík (höfuðstöðvar, sala, varahlutir, verkstæði); Óseyri 8, 603 Akureyri (verkstæði og varahlutir); Gagnheiði 32, 800 Selfossi (verkstæði, opnað í maí 2026).',
    card: { title: en ? 'Branches' : 'Útibú', rows: BRANCHES.map((b) => ({ k: `${b.street}, ${b.town}`, v: b.phone })), cta: { label: en ? 'Map and branches' : 'Kort og útibú', href: R('utibu') } },
  }
}

function contact(en: boolean): Answer {
  return {
    reply: en
      ? `Main number ${CONTACT.phone}, ${CONTACT.email}. Workshop requests: ${CONTACT.workshop}. Parts: ${CONTACT.parts}. Every person's direct line is on the staff page.`
      : `Aðalnúmer ${CONTACT.phone}, ${CONTACT.email}. Verkbeiðnir: ${CONTACT.workshop}. Varahlutir: ${CONTACT.parts}. Bein númer allra eru á starfsfólkssíðunni.`,
    card: { title: en ? 'Contact' : 'Hafa samband', rows: [{ k: en ? 'Phone' : 'Sími', v: CONTACT.phone }, { k: en ? 'Workshop' : 'Verkstæði', v: CONTACT.workshop }, { k: en ? 'Parts' : 'Varahlutir', v: CONTACT.parts }], cta: { label: en ? 'Staff' : 'Starfsfólk', href: R('starfsfolk') } },
  }
}

function machine(x: Machine, en: boolean): Answer {
  const rows = [
    { k: en ? 'Price ex VAT' : 'Verð án vsk.', v: kr(x.price), total: true },
    { k: en ? 'With 24 % VAT' : 'Með 24 % vsk.', v: kr(Math.round(x.price * (1 + VAT))) },
    ...(x.year ? [{ k: en ? 'Year' : 'Árgerð', v: x.year }] : []),
    ...(x.hours !== undefined ? [{ k: en ? 'Hours' : 'Notkun', v: `${x.hours.toLocaleString('de-DE')} ${x.unit}` }] : []),
    ...(x.engine ? [{ k: en ? 'Engine' : 'Vél', v: x.engine }] : []),
    { k: en ? 'Where' : 'Hvar', v: BR[x.region] },
  ]
  return {
    tool: en ? 'looked up the stock list' : 'fletti upp í söluskránni',
    reply: en
      ? `${machineName(x)} (${x.cond === 'ny' ? 'new' : 'used'}${x.year ? `, ${x.year}` : ''}): ${kr(x.price)} ex VAT. It stands in ${BR[x.region]}.`
      : `${machineName(x)} (${x.cond === 'ny' ? 'ný' : 'notuð'}${x.year ? `, ${x.year}` : ''}): ${kr(x.price)} án vsk. Hún er ${x.region === 'rvk' ? 'í Reykjavík' : x.region === 'ak' ? 'á Akureyri' : 'á Suðurlandi'}.`,
    card: { title: machineName(x), rows, cta: { label: en ? 'See the machine' : 'Skoða vélina', href: R(`velar/${x.id}`) } },
    chips: en ? ['Book a viewing', 'Warranty terms'] : ['Bóka skoðun', 'Ábyrgðarskilmálar'],
  }
}

function list(ms: Machine[], title: string, en: boolean, lead: string, href = 'velar'): Answer {
  return {
    tool: en ? 'looked up the stock list' : 'fletti upp í söluskránni',
    reply: lead,
    card: { title, rows: ms.map((x) => priceRow(x, en)), cta: { label: en ? 'Open the stock list' : 'Opna vélalistann', href: R(href) } },
  }
}

function brands(en: boolean): Answer {
  return {
    reply: en
      ? `Vélfang represents 21 manufacturers, among them ${BRANDS.slice(0, 6).map((b) => b.name).join(', ')}. In three fields: ${FIELDS.map((f) => f.label).join(', ')}.`
      : `Vélfang er með umboð fyrir 21 framleiðanda, meðal annars ${BRANDS.slice(0, 6).map((b) => b.name).join(', ')}. Í þremur greinum: ${FIELDS.map((f) => f.label.toLowerCase()).join(', ')}.`,
    card: { title: en ? 'All 21 brands' : 'Öll 21 umboðin', rows: [{ k: en ? 'Brands' : 'Merki', v: BRANDS.map((b) => b.name).join(', ') }], cta: { label: en ? 'Brand index' : 'Umboðin', href: R('umbod') } },
  }
}

function brand(key: string, en: boolean): Answer {
  const b = BRANDS.find((x) => x.key === key)!
  const ms = MACHINES.filter((x) => x.brandKey === key)
  const lead = en
    ? `${b.name}${b.since ? `: Vélfang's agency since ${b.since}` : ''}.${b.line ? ` ${b.line}.` : ''} ${ms.length ? `${ms.length} in the stock sample on this page.` : 'None in the stock sample on this page; sales can tell you what is coming.'}`
    : `${b.name}${b.since ? `: umboð hjá Vélfangi síðan ${b.since}` : ''}.${b.line ? ` ${b.line}.` : ''} ${ms.length ? `${ms.length} í söluskránni á þessari síðu.` : 'Engin í söluskránni á þessari síðu; sölumenn vita hvað er á leiðinni.'}`
  if (!ms.length) return { reply: lead, card: { title: b.name, rows: [{ k: en ? 'Manufacturer' : 'Framleiðandi', v: b.site.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') }], cta: { label: en ? 'Brand page' : 'Síða merkisins', href: R(`umbod/${b.key}`) } } }
  return list(ms, b.name, en, lead, `velar?merki=${b.key}`)
}

function workshop(en: boolean, q: string): Answer {
  const b = has(q, 'selfoss', 'sudurland', 'gagnheid') ? BRANCHES[2] : has(q, 'akureyri', 'nordurland', 'oseyri') ? BRANCHES[1] : null
  if (b) return {
    reply: en
      ? `The ${b.name} workshop is at ${b.street}, ${b.post}. Book on ${b.book} or ${b.email}, or with the workshop form on this page.`
      : `Verkstæðið ${b.key === 'ak' ? 'á Akureyri' : 'á Selfossi'} er á ${b.street}, ${b.post}. Tímapantanir í síma ${b.book} eða á ${b.email}, eða með verkstæðisforminu hér.`,
    card: { title: `${en ? 'Workshop' : 'Verkstæði'} ${b.name}`, rows: [{ k: en ? 'Phone' : 'Sími', v: b.book }, { k: en ? 'Email' : 'Netfang', v: b.email }], cta: { label: en ? 'Book a slot' : 'Bóka verkstæði', href: R(`verkstaedi?stadur=${b.key}`) } },
  }
  return {
    reply: en
      ? 'Three workshops: Reykjavík (verk@velfang.is, 580 8200), Akureyri (580 8222) and Selfoss (767 8403, jon@velfang.is). Service vans also come out to diagnose and repair on site.'
      : 'Þrjú verkstæði: Reykjavík (verk@velfang.is, 580 8200), Akureyri (580 8222) og Selfoss (767 8403, jon@velfang.is). Verkstæðisbílar koma líka á staðinn, bilanagreina og gera við það sem hægt er án flutnings.',
    card: { title: en ? 'Workshops' : 'Verkstæði', rows: BRANCHES.map((x) => ({ k: x.name, v: x.book })), cta: { label: en ? 'Book a slot' : 'Bóka verkstæði', href: R('verkstaedi') } },
  }
}

function parts(en: boolean): Answer {
  return {
    reply: en
      ? `Parts: ${CONTACT.parts} or 580 8200. Have the registration or serial number and year ready. Vélfang also sources parts and filters for most tractor makes (Massey Ferguson, Deutz, McCormick and more) from Vapormatic and Sparex.`
      : `Varahlutir: ${CONTACT.parts} eða 580 8200. Hafðu fastnúmer eða framleiðslunúmer og árgerð við höndina. ${PARTS.others}`,
    card: { title: en ? 'Parts' : 'Varahlutir', rows: [{ k: en ? 'Email' : 'Netfang', v: CONTACT.parts }, { k: 'Akureyri', v: '580 8222' }], cta: { label: en ? 'Parts request' : 'Varahlutabeiðni', href: R('varahlutir') } },
  }
}

function warranty(en: boolean): Answer {
  return {
    reply: en
      ? 'Vélfang warranty runs one year unless stated otherwise, covering labour and parts for manufacturing or material faults, done in day work at Vélfang or an approved workshop. Normal wear, transport to the workshop and loss of use are not covered. A manufacturer warranty can override these terms.'
      : `${WARRANTY.lead} ${WARRANTY.covers[0]} ${WARRANTY.excludes.join(' ')} ${WARRANTY.maker.split('.')[0]}.`,
    card: { title: en ? 'Warranty' : 'Ábyrgð', rows: [{ k: en ? 'Term' : 'Tími', v: en ? 'One year' : 'Eitt ár' }, { k: en ? 'Parts fitted by Vélfang' : 'Varahlutir settir í af Vélfangi', v: en ? 'One year' : 'Eitt ár' }], cta: { label: en ? 'Full terms' : 'Allir skilmálar', href: R('abyrgd') } },
  }
}

function livelink(en: boolean): Answer {
  return {
    reply: en
      ? `JCB LiveLink lets the owner follow the machine remotely: hours, live location, service reminders, fuel use, idle time and alerts. Most JCB machines over 5 tonnes built after 2015 have it. Ask Guðmundur Sigurðsson for access: ${LIVELINK.contact}.`
      : `${LIVELINK.what} ${LIVELINK.which} Aðgang veitir Guðmundur Sigurðsson: ${LIVELINK.contact}.`,
    card: { title: 'JCB LiveLink', rows: LIVELINK.reports.slice(0, 4).map((r) => ({ k: r, v: '' })), cta: { label: en ? 'Request access' : 'Sækja um aðgang', href: R('livelink') } },
  }
}

function kuhn(en: boolean): Answer {
  return {
    reply: en
      ? 'The Kuhn year-end offer comes out every December and ran to 5 January last time (2025-2026): 15 % off hay and soil machines and 5 % off bale combinations ordered before the deadline, payment on delivery. Leave your email on the home page to hear when the next one is out.'
      : `${KUHN_OFFER.title} kemur út í desember. Síðast (${KUHN_OFFER.last}): ${KUHN_OFFER.terms.slice(0, 2).join(', ').toLowerCase()}, ef pantað var fyrir ${KUHN_OFFER.until}. Greitt við afhendingu. Skráðu netfangið á forsíðunni til að fá að vita þegar næsta tilboð birtist.`,
    chips: en ? ['Kuhn machines in stock', 'Book a workshop slot'] : ['Kuhn á lager', 'Bóka verkstæði'],
  }
}

function sell(en: boolean): Answer {
  return {
    reply: en
      ? 'You can list a used machine for sale with Vélfang, or join the wish list and they look for the machine you want, also from abroad. Both forms are on the "Selja eða leita" page.'
      : 'Þú getur skráð notaða vél til sölu hjá Vélfangi, eða skráð þig á óskalista og Vélfang leitar að vélinni fyrir þig, líka erlendis. Bæði formin eru á síðunni „Selja eða leita“.',
    card: { title: en ? 'Sell or search' : 'Selja eða leita', rows: [{ k: en ? 'Sell' : 'Selja', v: en ? 'List your machine' : 'Skrá vél' }, { k: en ? 'Search' : 'Leita', v: en ? 'Wish list' : 'Óskalisti' }], cta: { label: en ? 'Open' : 'Opna', href: R('selja') } },
  }
}

function person(q: string, en: boolean): Answer | null {
  const roles: [RegExp, string][] = [[/yfirmadur (a )?akureyri|stjori (a )?akureyri/, 'haftor'], [/forstjor|framkvaemdastj|ceo|director/, 'eyjolfur'], [/fjarmalastj|cfo|finance/, 'inga'], [/thjonustustj|service manager/, 'gummi'], [/rekstrarstj/, 'paolo'], [/verkstjor/, 'kristinn'], [/yfirmadur varahl|parts manager/, 'kristjan'], [/lagerstj/, 'bjorgvin'], [/solustj/, 'kristjanfr']]
  const hit = roles.find(([re]) => re.test(q))
  const local = /selfoss/.test(q) ? 'sel' : /akureyri|nordurland/.test(q) ? 'ak' : null
  const p = hit && local ? (STAFF.find((s) => s.branch === local && fold(s.role).includes(hit[0].source.split('|')[0])) ?? STAFF.find((s) => s.branch === local && s.email)) : hit ? STAFF.find((s) => s.key === hit[1]) : STAFF.find((s) => q.includes(fold(s.name.split(' ')[0])) && fold(s.name.split(' ')[0]).length > 3)
  if (!p) return null
  return {
    reply: `${p.name}: ${p.role} (${BR[p.branch]}). ${p.phone ? `${en ? 'Phone' : 'Sími'} ${p.phone}` : ''}${p.email ? `, ${p.email}` : ''}.`,
    card: { title: p.name, rows: [{ k: en ? 'Role' : 'Starf', v: p.role }, ...(p.phone ? [{ k: en ? 'Phone' : 'Sími', v: p.phone }] : []), ...(p.email ? [{ k: en ? 'Email' : 'Netfang', v: p.email }] : [])], cta: { label: en ? 'All staff' : 'Allt starfsfólk', href: R('starfsfolk') } },
  }
}

function refuse(en: boolean, text?: string): Answer {
  return {
    refused: true,
    reply: text ?? (en ? `I only answer from what is on this page, and that is not here. Call ${CONTACT.phone} or write to ${CONTACT.email}.` : `Ég svara bara út frá því sem stendur á þessari síðu, og þetta er ekki hér. Hringdu í ${CONTACT.phone} eða skrifaðu á ${CONTACT.email}.`),
    chips: en ? ['Opening hours', 'Machines in stock', 'Book a workshop slot'] : ['Opnunartímar', 'Vélar á lager', 'Bóka verkstæði'],
  }
}

const MODEL_KEYS: { id: string; re: RegExp }[] = [
  { id: '274097', re: /\b728\b|728 profi/ }, { id: '728834', re: /\b516\b/ }, { id: '992887', re: /xerion/ },
  { id: '367541', re: /e-?tech|rafmagnslyft|rafmagns ?skotbom|electric (loader|telehandler)/ }, { id: '413023', re: /525-60 agp|\bagp\b/ },
  { id: '422839', re: /js ?145|hjolagraf|wheeled excavator|wheel excavator/ }, { id: '911820', re: /560-80|\bags\b/ },
  { id: '845629', re: /liner|mugavel|rake/ }, { id: '487848', re: /gf ?13012|heytaetl|tedder/ }, { id: '267861', re: /actiroll|valtar|roller/ },
  { id: '918412', re: /el ?92|hnifataet|mulcher/ }, { id: '938781', re: /b-?mix|haughraer|slurry mixer/ },
]

export async function answer(messages: Msg[]): Promise<Answer> {
  const raw = messages.filter((x) => x.role === 'user').pop()?.content ?? ''
  const en = isEnglish(raw)
  const q = fold(raw)
  if (!q) return refuse(en)

  if (has(q, 'takk', 'thakka', 'thanks', 'thank you', 'frabaert', 'snilld')) return { reply: en ? `Any time. ${CONTACT.phone} if you want a person.` : `Ekkert mál. ${CONTACT.phone} ef þú vilt tala við manneskju.` }
  if (has(q, /^(hae|hallo|halo|hi|hello|godan dag|saell|sael)\b/)) return { reply: en ? 'Hello! Ask about a machine, a brand, the workshops, parts or opening hours.' : 'Halló! Spurðu um vél, umboð, verkstæðin, varahluti eða opnunartíma.', chips: CHIPS }

  // what the page cannot answer, said plainly
  if (has(q, 'fjarmogn', /\blan\b/, 'kaupleig', 'vext', 'finance', 'financing', 'loan', 'lease', 'leasing', 'interest'))
    return refuse(en, en ? `This page lists no financing partners or terms. Sales can set it up: ${CONTACT.phone}. The Kuhn year-end offer is paid on delivery.` : `Á þessari síðu eru engir lánveitendur eða kjör. Sölumenn setja það upp: ${CONTACT.phone}. Áramótatilboð Kuhn er greitt við afhendingu.`)
  if (has(q, 'vedri', 'vedur', 'weather', 'forecast'))
    return refuse(en)
  if (has(q, 'uppitok', 'meta vel', 'verdmat', 'fyrir gomlu', 'fae eg fyrir', 'hvers virdi', 'trade in', 'trade-in', 'valuation', 'worth'))
    return refuse(en, en ? `I cannot value a machine. Sales can, on ${CONTACT.phone}, or list it on the "Selja eða leita" page.` : `Ég get ekki metið vél. Sölumenn gera það í síma ${CONTACT.phone}, eða skráðu hana á síðunni „Selja eða leita“.`)
  if (has(q, 'afhendingart', 'hvenaer kemur', 'delivery time', 'lead time', 'a leidinni'))
    return refuse(en, en ? `I cannot see delivery times from here. Sales knows: ${CONTACT.phone}.` : `Ég sé ekki afhendingartíma héðan. Sölumenn vita það: ${CONTACT.phone}.`)

  const hit = MODEL_KEYS.find((x) => x.re.test(q))
  if (hit) return machine(MACHINES.find((x) => x.id === hit.id)!, en)

  if (has(q, 'livelink', 'live link', 'villukod', 'fjarvoktun', 'gps vakt')) return livelink(en)
  if (has(q, 'kuhn') && has(q, 'tilbod', 'aramot', 'offer', 'afslatt', 'discount')) return kuhn(en)
  if (has(q, 'aramot', 'tilbod', 'afslatt', 'offer', 'discount')) return kuhn(en)
  if (has(q, 'abyrgd', 'warranty', 'guarantee')) return warranty(en)
  if (has(q, 'varahlut', 'sia', 'siur', 'filter', 'parts', 'vapormatic', 'sparex')) return parts(en)
  if (has(q, 'selja', 'selt', 'sel vel', 'skra vel', 'oskalist', 'leita ad vel', 'sell my', 'wish list', 'import')) return sell(en)

  const p = person(q, en)
  if (p) return p

  const b = BRANDS.find((x) => new RegExp(`\\b${fold(x.name).split(' ')[0]}\\b`).test(q))
  if (b) return brand(b.key, en)

  if (has(q, 'verkstaed', 'vidgerd', 'thjonust', 'smurn', 'vidhald', 'boka', 'panta tima', 'workshop', 'repair', 'service', 'maintenance')) return workshop(en, q)
  if (has(q, 'opid', 'opnunart', 'opnar', 'lokad', 'lokar', 'hvenaer er', 'open', 'hours', 'closing')) return hours(en)
  if (has(q, 'hvar', 'heimilisf', 'stadsetn', 'kort', 'akureyri', 'selfoss', 'utibu', 'address', 'where', 'located', 'map', 'branch')) return where(en, q)
  if (has(q, 'simanum', 'simi', 'sima', 'hringi', 'hringja', 'netfang', 'tolvupost', 'email', 'phone', 'call', 'contact', 'starfsfolk', 'staff')) return contact(en)
  if (has(q, 'drattarvel', 'traktor', 'tractor')) return list(MACHINES.filter((x) => x.cat === 'Dráttarvél'), en ? 'Tractors' : 'Dráttarvélar', en, en ? 'Three tractors in the sample: Fendt 728 Profi, CLAAS Xerion 4000 and Fendt 516 Profi Plus.' : 'Þrjár dráttarvélar í söluskránni hér: Fendt 728 Profi, CLAAS Xerion 4000 og Fendt 516 Profi Plus.', 'velar?flokkur=Dráttarvél')
  if (has(q, 'skotbom', 'lyftar', 'telehandler', 'loadall')) return list(MACHINES.filter((x) => x.cat === 'Skotbómulyftari'), en ? 'Telehandlers' : 'Skotbómulyftarar', en, en ? 'Three JCB telehandlers, one of them new and electric.' : 'Þrír JCB skotbómulyftarar, þar af einn nýr og rafknúinn.', 'velar?flokkur=Skotbómulyftari')
  if (has(q, 'grafa', 'grofu', 'grafan', 'excavator', 'digger')) return machine(MACHINES.find((x) => x.id === '422839')!, en)
  if (has(q, 'heyvinn', 'hay')) return list(MACHINES.filter((x) => x.cat === 'Heyvinnutæki'), en ? 'Hay machines' : 'Heyvinnutæki', en, en ? 'Two in the sample.' : 'Tvö í söluskránni hér.')
  if (has(q, 'notad', 'notud', 'used', 'second hand')) return list(MACHINES.filter((x) => x.cond === 'notud'), en ? 'Used' : 'Notaðar vélar', en, en ? `${MACHINES.filter((x) => x.cond === 'notud').length} used machines in the sample on this page.` : `${MACHINES.filter((x) => x.cond === 'notud').length} notaðar vélar í söluskránni hér.`, 'velar?astand=notud')
  if (has(q, 'ny tae', 'nyjar', 'nytt', 'new machine', 'brand new')) return list(MACHINES.filter((x) => x.cond === 'ny'), en ? 'New' : 'Ný tæki', en, en ? 'New machines in the sample.' : 'Ný tæki í söluskránni hér.', 'velar?astand=ny')
  if (has(q, 'odyr', 'laegst', 'cheap', 'lowest')) return list([...MACHINES].sort((a, c) => a.price - c.price).slice(0, 3), en ? 'Lowest prices' : 'Lægstu verðin', en, en ? 'The three lowest prices in the sample, ex VAT.' : 'Þrjú lægstu verðin í söluskránni hér, án vsk.')
  if (has(q, 'dyr', 'haest', 'expensive', 'biggest')) return list([...MACHINES].sort((a, c) => c.price - a.price).slice(0, 3), en ? 'Highest prices' : 'Hæstu verðin', en, en ? 'The three highest prices in the sample, ex VAT.' : 'Þrjú hæstu verðin í söluskránni hér, án vsk.')
  if (has(q, 'vsk', 'vat', 'tax')) return { reply: en ? 'Vélfang lists prices ex VAT. The stock page has a switch that shows them with 24 % VAT.' : 'Vélfang birtir verð án vsk. Á vélasíðunni er rofi sem sýnir þau með 24 % vsk.' }
  if (has(q, 'umbod', 'merki', 'tegund', 'framleid', 'brands', 'which makes', 'what do you sell')) return brands(en)
  if (has(q, 'lager', 'vel', 'vela', 'taeki', 'stock', 'machine', 'verd', 'kostar', 'price', 'cost')) return { reply: en ? 'Which kind? Pick one:' : 'Hvers konar vél? Veldu:', chips: en ? ['Tractors', 'Telehandlers', 'Used machines'] : ['Dráttarvélar', 'Skotbómulyftarar', 'Notaðar vélar'] }

  return refuse(en)
}
