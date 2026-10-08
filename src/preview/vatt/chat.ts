import { BRANDS, CONTACT, DEPTS, FINANCE, LAUNCH, MODELS, SERVICE, fullName, kr, modelBySlug, openState, type Model } from './data'

/*
 * The assistant on this page, wired ONLY to this page: our <sndr-chat> widget
 * with its `answerer` hook. Every question is matched against the data module
 * the page renders from, in the browser, with no model and no network. It
 * cannot say anything the page does not say, and a question it cannot match
 * gets the designed refusal with the phone number. Icelandic answers are
 * written here once; English questions get English answers.
 */

type Card = { title: string; rows: { k: string; v: string; total?: boolean }[]; cta?: { label: string; href: string } }
export type Answer = { reply?: string; tool?: string; card?: Card; refused?: boolean; chips?: string[] }
type Msg = { role: 'user' | 'assistant'; content: string }

export const GREETING = 'Halló! Ég svara spurningum um bílana, verðin, fjármögnun, verkstæðið og opnunartíma hjá Vatt. Hvað viltu vita?'
export const CHIPS = ['Hvað kostar BYD Dolphin?', 'Hvenær er opið?', 'Hvenær koma nýju merkin?', 'Hvernig bóka ég reynsluakstur?']

export const fold = (s: string) =>
  s.toLowerCase().replace(/ð/g, 'd').replace(/þ/g, 'th').replace(/æ/g, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9/ ]+/g, ' ').replace(/\s+/g, ' ').trim()

const EN_WORDS = /\b(the|what|when|where|how|do you|does|is it|price|prices|cost|open|opening|hours|electric|cars?|van|vans|service|book|thanks?|hello|hi|which|your|warranty|range|charge|lease|loan|fleet)\b/
const isEnglish = (raw: string) => EN_WORDS.test(raw.toLowerCase()) && !/[áðéíóúýþæö]/i.test(raw)
const has = (q: string, ...keys: (string | RegExp)[]) => keys.some((k) => (typeof k === 'string' ? q.includes(k) : k.test(q)))

const MODEL_KEYS: { slug: string; re: RegExp }[] = [
  { slug: 'dolphin', re: /\bdolphin\b/ },
  { slug: 'sealion-7', re: /\bsealion\b|\bsea ?lion\b/ },
  { slug: 'seal-u-dm-i', re: /\bseal u\b.*(tengil|tvinn|phev|dm ?i|hybrid|bensin)|(tengil|tvinn|phev|dm ?i|hybrid).*\bseal u\b/ },
  { slug: 'seal-u', re: /\bseal ?u\b/ },
  { slug: 'seal', re: /\bseal\b/ },
  { slug: 'tang', re: /\btang\b/ },
  { slug: 'evo-awd', re: /\bevo\b|\batto\b/ },
  { slug: 'e-deliver-5', re: /\be ?deliver ?5\b|\bdeliver 5\b/ },
  { slug: 'e-deliver-7', re: /\be ?deliver ?7\b|\bdeliver 7\b/ },
  { slug: 'eterron-9', re: /\beterron\b|\be terron\b|\bterron\b|\bpallbil/ },
]

const sala = DEPTS[0]
const verk = DEPTS[1]
const R = (href: string) => href /* routes are absolute inside the preview; the widget opens them in-page */

function hours(en: boolean): Answer {
  const s = openState(sala)
  const w = openState(verk)
  return {
    tool: en ? 'checked opening hours' : 'athugaði opnunartíma',
    reply: en
      ? 'Sales at Skeifan 17: Monday to Thursday 8:30–17:00, Friday 8:30–16:00, Saturday 13:00–16:00 (closed on Saturdays in high summer and December). The workshop and parts counter: Monday to Thursday 8:00–17:00, Friday 8:00–16:00.'
      : 'Söludeildin í Skeifunni 17: mánudaga til fimmtudaga kl. 8:30–17, föstudaga kl. 8:30–16 og laugardaga kl. 13–16 (lokað á laugardögum um hásumarið og í desember). Verkstæðið og varahlutir: mánudaga til fimmtudaga kl. 8–17, föstudaga kl. 8–16.',
    card: {
      title: en ? 'Right now, by the ordinary weekly hours' : 'Staðan núna, miðað við venjulegan opnunartíma',
      rows: [
        { k: en ? 'Sales' : 'Söludeild', v: en ? (s.open ? 'Open' : 'Closed') : s.text },
        { k: en ? 'Workshop and parts' : 'Verkstæði og varahlutir', v: en ? (w.open ? 'Open' : 'Closed') : w.text },
      ],
    },
    chips: en ? ['Where are you?', 'How do I book a test drive?'] : ['Hvar eruð þið?', 'Hvernig bóka ég reynsluakstur?'],
  }
}

function where(en: boolean): Answer {
  return {
    reply: en
      ? `Vatt is at Skeifan 17, 108 Reykjavík: showroom, workshop and parts in one house. Phone ${CONTACT.phone}. Service partners: Höldur in Akureyri and TR þjónusta in Reykjanesbær.`
      : `Vatt er í Skeifunni 17, 108 Reykjavík: sýningarsalur, verkstæði og varahlutir í sama húsi. Sími ${CONTACT.phone}. Samstarfsverkstæði eru Höldur á Akureyri og TR þjónusta í Reykjanesbæ.`,
    card: { title: 'Skeifan 17', rows: [{ k: en ? 'Phone' : 'Sími', v: CONTACT.phone }, { k: en ? 'Email' : 'Netfang', v: CONTACT.email }], cta: { label: en ? 'Open in Google Maps' : 'Opna í Google Maps', href: CONTACT.map } },
    chips: en ? ['Opening hours', 'Service in Akureyri?'] : ['Opnunartímar', 'Þjónusta á Akureyri?'],
  }
}

function phones(en: boolean): Answer {
  return {
    reply: en ? `One number for everything: ${CONTACT.phone}. Sales ${CONTACT.sales}, workshop ${CONTACT.workshop}, parts ${CONTACT.parts}.` : `Eitt númer fyrir allt: ${CONTACT.phone}. Söludeild ${CONTACT.sales}, verkstæði ${CONTACT.workshop}, varahlutir ${CONTACT.parts}.`,
    card: { title: en ? 'Contact' : 'Hafa samband', rows: [{ k: en ? 'Phone' : 'Sími', v: CONTACT.phone }, { k: en ? 'Sales' : 'Söludeild', v: CONTACT.sales }, { k: en ? 'Workshop' : 'Verkstæði', v: CONTACT.workshop }] },
  }
}

function modelCard(slug: string, en: boolean): Answer {
  const x = modelBySlug(slug)!
  const price = x.price === null ? (en ? 'Price on request' : 'Verð á fyrirspurn') : kr(x.price)
  const priceSentence = price.replace(/\.$/, '')
  const rows = [
    { k: en ? 'List price' : 'Verðlistaverð', v: price },
    ...(x.priceGrant ? [{ k: en ? 'With the Orkusjóður grant' : 'Með rafbílastyrk Orkusjóðs', v: kr(x.priceGrant), total: true }] : []),
    ...(x.priceExVat ? [{ k: en ? 'Ex VAT' : 'Án vsk.', v: kr(x.priceExVat) }] : []),
    { k: en ? 'Range (WLTP)' : 'Drægni (WLTP)', v: x.range },
    { k: en ? 'Battery' : 'Rafhlaða', v: x.battery },
    { k: en ? 'Power' : 'Afl', v: x.powerLine },
    { k: en ? 'Drive' : 'Drif', v: en ? (x.drive === 'Fjórhjóladrif' ? 'All-wheel drive' : 'Front-wheel drive') : x.drive },
  ]
  const phev = x.power === 'Tengiltvinn'
  return {
    tool: en ? 'looked up the price list' : 'fletti upp í verðlistanum',
    reply: en
      ? `${fullName(x)}: ${priceSentence}${x.priceGrant ? `, ${kr(x.priceGrant).replace(/\.$/, '')} with the grant` : ''}. ${phev ? 'This is a plug-in hybrid, not a pure EV. ' : ''}Range ${x.range}, ${x.powerLine}, 0–100 in ${x.accel}. Warranty ${x.warranty}.`
      : `${fullName(x)}: ${priceSentence}${x.priceGrant ? `, ${kr(x.priceGrant).replace(/\.$/, '')} með rafbílastyrk` : ''}. ${phev ? 'Þetta er tengiltvinnbíll, ekki hreinn rafbíll. ' : ''}Drægni ${x.range}, ${x.powerLine}, 0–100 á ${x.accel}. Ábyrgð: ${x.warranty}.`,
    card: { title: fullName(x), rows, cta: { label: en ? 'See the car' : 'Skoða bílinn', href: R(`bilar/${x.slug}`) } },
    chips: en ? [`Book a test drive in a ${x.name}`, 'Financing'] : [`Bóka reynsluakstur í ${x.name}`, 'Fjármögnun'],
  }
}

function list(ms: Model[], title: string, en: boolean, lead: string): Answer {
  return {
    tool: en ? 'looked up the price list' : 'fletti upp í verðlistanum',
    reply: lead,
    card: { title, rows: ms.map((x) => ({ k: fullName(x), v: x.price === null ? (en ? 'On request' : 'Á fyrirspurn') : x.priceGrant ? `${kr(x.priceGrant)} ${en ? 'with grant' : 'm/styrk'}` : kr(x.price) })), cta: { label: en ? 'Open the catalogue' : 'Opna bílalistann', href: R('bilar') } },
  }
}

function launch(en: boolean): Answer {
  return {
    reply: en
      ? `OMODA, EXLANTIX and JAECOO join Vatt in ${LAUNCH.month.replace('janúar', 'January')}. The launch is at Skeifan 17. Models and prices are not published yet, so I cannot quote them.`
      : `OMODA, EXLANTIX og JAECOO bætast í hópinn hjá Vatt í ${LAUNCH.month}. Frumsýningin verður í Skeifunni 17. Gerðir og verð hafa ekki verið birt, svo ég get ekki nefnt þau.`,
    chips: en ? ['Which brands do you sell now?', 'BYD prices'] : ['Hvaða merki eruð þið með núna?', 'BYD verð'],
  }
}

function brands(en: boolean): Answer {
  const now = BRANDS.filter((b) => b.status === 'now').map((b) => b.name).join(en ? ' and ' : ' og ')
  return {
    reply: en
      ? `${now} are on sale now. OMODA, EXLANTIX and JAECOO launch in January 2027. Aiways U5 owners still get service and parts at Skeifan 17.`
      : `${now} eru í sölu núna. OMODA, EXLANTIX og JAECOO koma í janúar 2027. Eigendur Aiways U5 fá áfram þjónustu og varahluti í Skeifunni 17.`,
    chips: en ? ['BYD prices', 'Maxus vans'] : ['BYD verð', 'Maxus sendibílar'],
  }
}

function finance(en: boolean): Answer {
  return {
    reply: en
      ? 'Vatt arranges financing with Ergo, Arion banki, Landsbankinn and Lykill. New car: up to 90 % over up to 7 years. Used car: up to 80 % over 7 years (car age plus term at most 12 years). Lease purchase: up to 75 % over up to 7 years. Sales sets up the offer.'
      : 'Vatt setur upp fjármögnun með Ergo, Arion banka, Landsbankanum og Lykli. Nýr bíll: allt að 90 % lán í allt að 7 ár. Notaður bíll: allt að 80 % í 7 ár (aldur bíls og lánstími að hámarki 12 ár). Kaupleiga: allt að 75 % í allt að 7 ár. Söludeildin setur upp tilboðið.',
    card: { title: en ? 'Financing' : 'Fjármögnun', rows: FINANCE.products.map((p) => ({ k: p.name, v: p.terms.split('.')[0] })), cta: { label: en ? 'Financing page' : 'Fjármögnunarsíðan', href: R('fjarmognun') } },
    chips: en ? ['Monthly payment?', 'Fleet leasing'] : ['Hvað kostar á mánuði?', 'Kaupleiga fyrir fyrirtæki'],
  }
}

function service(en: boolean): Answer {
  return {
    reply: en
      ? `The workshop at Skeifan 17 is open Monday to Thursday 8–17 and Friday 8–16. Book a slot on the workshop page or write to ${CONTACT.workshop}. Outside Reykjavík: Höldur, Þórsstígur 4, Akureyri (461 6060) and TR þjónusta, Njarðarbraut 19, Reykjanesbær (420 6600).`
      : `Verkstæðið í Skeifunni 17 er opið mánudaga til fimmtudaga kl. 8–17 og föstudaga kl. 8–16. Þú bókar tíma á verkstæðissíðunni eða skrifar á ${CONTACT.workshop}. Utan Reykjavíkur: Höldur, Þórsstíg 4 á Akureyri (461 6060) og TR þjónusta, Njarðarbraut 19 í Reykjanesbæ (420 6600).`,
    card: { title: en ? 'Workshops' : 'Verkstæði', rows: SERVICE.shops.map((s) => ({ k: `${s.name}, ${s.town}`, v: s.phone })), cta: { label: en ? 'Book a workshop slot' : 'Bóka verkstæðistíma', href: R('verkstaedi') } },
    chips: en ? ['Roadside assistance', 'Battery return'] : ['Vegaaðstoð', 'Skila rafhlöðu'],
  }
}

function roadside(en: boolean): Answer {
  return {
    reply: en
      ? 'Vatt does not send a mechanic out after hours. For roadside help call N1 roadside assistance 660 3350, FÍB 511 2112 (members) or Sjóvá 440 2222 (members). A call-out for a breakdown is paid by the owner by the price list; if the car is under warranty, take it up with the workshop afterwards.'
      : 'Verkstæðið sendir ekki viðgerðarmann út fyrir opnunartíma. Vegaaðstoð: N1 660 3350, FÍB 511 2112 (félagsmenn) eða Sjóvá 440 2222 (félagsmenn). Útkall vegna bilunar greiðir bíleigandi samkvæmt gjaldskrá; sé bíllinn í ábyrgð er málið svo tekið upp við verkstæðið.',
    card: { title: en ? 'Roadside' : 'Vegaaðstoð', rows: SERVICE.roadside.map((r) => ({ k: r.name, v: r.phone })) },
  }
}

function battery(en: boolean): Answer {
  return { reply: en ? 'Batteries from BYD, Maxus and Aiways cars can be returned to Vatt at Skeifan 17 free of charge. Vatt sends them on for recycling.' : SERVICE.battery }
}

function testDrive(en: boolean): Answer {
  return {
    reply: en
      ? 'Pick a car, a day and a time on the test-drive page and sales confirms by phone. Test drives start at Skeifan 17 in sales hours.'
      : 'Þú velur bíl, dag og tíma á reynsluaksturssíðunni og söludeildin staðfestir símleiðis. Reynsluakstur hefst í Skeifunni 17 á opnunartíma söludeildar.',
    card: { title: en ? 'Test drive' : 'Reynsluakstur', rows: [{ k: en ? 'Where' : 'Hvar', v: 'Skeifan 17' }, { k: en ? 'When' : 'Hvenær', v: en ? 'Sales hours' : 'Á opnunartíma söludeildar' }], cta: { label: en ? 'Book a test drive' : 'Bóka reynsluakstur', href: R('reynsluakstur') } },
  }
}

function fleet(en: boolean): Answer {
  const vans = MODELS.filter((x) => x.fleet)
  return list(vans, en ? 'Maxus for businesses' : 'Maxus fyrir fyrirtæki', en,
    en ? 'For fleets Vatt sells the Maxus e-Deliver 5 and e-Deliver 7 vans and the eTerron 9 pickup. Prices ex VAT are on the fleet page, and companies can finance with a loan or lease purchase.' : 'Fyrir fyrirtæki selur Vatt Maxus e-Deliver 5 og e-Deliver 7 sendibíla og eTerron 9 pallbílinn. Verð án vsk. eru á fyrirtækjasíðunni, og fyrirtæki geta fjármagnað með bílaláni eða kaupleigu.')
}

function warranty(en: boolean): Answer {
  return {
    reply: en
      ? 'BYD: 6 years / 150,000 km on the car and 8 years / 250,000 km on the battery (8 years / 160,000 km on the Seal U plug-in hybrid). Maxus: 5 years / 100,000 km on the van and 8 years / 200,000 km on the battery (250,000 km on the e-Deliver 7).'
      : 'BYD: 6 ár / 150.000 km á bíl og 8 ár / 250.000 km á rafhlöðu (8 ár / 160.000 km á Seal U tengiltvinn). Maxus: 5 ár / 100.000 km á bíl og 8 ár / 200.000 km á rafhlöðu (250.000 km á e-Deliver 7).',
  }
}

function cheapest(en: boolean): Answer {
  const ms = [...MODELS].filter((x) => x.price !== null).sort((a, b) => (a.priceGrant ?? a.price!) - (b.priceGrant ?? b.price!)).slice(0, 3)
  return list(ms, en ? 'Lowest prices' : 'Lægstu verðin', en, en ? `The lowest price in the house is the BYD Dolphin at ${kr(4_790_000)} with the grant (list ${kr(5_290_000)}).` : `Lægsta verðið í húsinu er BYD Dolphin á ${kr(4_790_000)} með rafbílastyrk (listaverð ${kr(5_290_000)}).`)
}

function refuse(en: boolean, text?: string): Answer {
  return {
    refused: true,
    reply: text ?? (en ? `I only answer from what is on this page, and that is not here. Sales answers on ${CONTACT.phone} or ${CONTACT.sales}.` : `Ég svara bara út frá því sem stendur á þessari síðu, og þetta er ekki hér. Söludeildin svarar í síma ${CONTACT.phone} eða á ${CONTACT.sales}.`),
    chips: en ? ['Opening hours', 'BYD prices', 'Book a test drive'] : ['Opnunartímar', 'BYD verð', 'Bóka reynsluakstur'],
  }
}

export async function answer(messages: Msg[]): Promise<Answer> {
  const raw = messages.filter((x) => x.role === 'user').pop()?.content ?? ''
  const en = isEnglish(raw)
  const q = fold(raw)
  if (!q) return refuse(en)

  if (has(q, 'takk', 'thakka', 'thanks', 'thank you', 'frabaert', 'snilld')) return { reply: en ? 'Any time. Sales are on 568 5100 if you want a person.' : 'Ekkert mál. Söludeildin er í síma 568 5100 ef þú vilt tala við manneskju.' }
  if (has(q, /^(hae|hallo|halo|hi|hello|godan dag|saell|sael)\b/)) return { reply: en ? 'Hello! Ask about a car, a price, financing, the workshop or opening hours.' : 'Halló! Spurðu um bíl, verð, fjármögnun, verkstæðið eða opnunartíma.', chips: CHIPS }

  // refusals the page cannot answer, said plainly
  if (has(q, 'notad', 'notud', 'used', 'uppitoku', 'skipti', 'trade in', 'trade-in', 'innkaup'))
    return refuse(en, en ? 'Vatt lists no used cars on this page and I cannot value a trade-in. Sales can: 568 5100.' : 'Vatt birtir enga notaða bíla á þessari síðu og ég get ekki metið bíl upp í. Söludeildin getur það: 568 5100.')
  if (has(q, 'til a lager', 'a lager', 'afhendingart', 'hvenaer faest', 'bidlist', 'in stock', 'delivery time', 'available now', 'litur', 'litir', 'colour', 'color'))
    return refuse(en, en ? 'I cannot see stock, colours or delivery times from here. Sales knows: 568 5100.' : 'Ég sé ekki lagerstöðu, liti eða afhendingartíma héðan. Söludeildin veit það: 568 5100.')
  if (has(q, 'aiways', 'u5', 'u6'))
    return { reply: en ? 'Aiways U5 owners still get service and parts at Skeifan 17. No new Aiways models are listed on this page.' : 'Eigendur Aiways U5 fá áfram þjónustu og varahluti í Skeifunni 17. Engar nýjar Aiways gerðir eru á þessari síðu.', chips: en ? ['Book a workshop slot', 'Which brands do you sell?'] : ['Bóka verkstæðistíma', 'Hvaða merki eruð þið með?'] }

  if (has(q, 'omoda', 'exlantix', 'jaecoo', 'ny merki', 'nyju merkin', 'nyjar tegundir', 'januar', '2027', 'new brands', 'coming', 'launch'))
    return launch(en)
  if (has(q, 'neyd', 'biladur', 'bilud', 'drattarbil', 'vegaadstod', 'vegaadstod', 'utkall', 'emergency', 'breakdown', 'roadside', 'towing'))
    return roadside(en)
  if (has(q, 'rafhlod', 'rafhlad', 'skila', 'endurvinn', 'battery return', 'recycl'))
    return has(q, 'abyrgd', 'warranty') ? warranty(en) : battery(en)
  if (has(q, 'styrk', 'orkusjod', 'grant', 'subsid'))
    return { reply: FINANCE.grant, chips: ['BYD verð', 'Fjármögnun'] }

  const hit = MODEL_KEYS.find((x) => x.re.test(q))
  if (hit) {
    if (has(q, 'abyrgd', 'warranty')) return warranty(en)
    if (has(q, 'reynsluak', 'profa', 'prufu', 'test drive', 'testdrive')) return testDrive(en)
    if (has(q, 'thjonust', 'verkstaed', 'smurn', 'vidgerd', 'skodun', 'boka tima', 'panta tima', 'service', 'repair', 'workshop')) return service(en)
    if (has(q, /\blan\b/, 'bilalan', 'afborg', 'manud', 'monthly', 'loan', 'leasing', 'kaupleig')) return finance(en)
    return modelCard(hit.slug, en)
  }

  if (has(q, 'reynsluak', 'profa bil', 'prufukeyr', 'prufuakst', 'profad', 'test drive', 'testdrive')) return testDrive(en)
  if (has(q, 'abyrgd', 'warranty')) return warranty(en)
  if (has(q, 'floti', 'flota', 'fyrirtaek', 'rekstr', 'sendibil', 'atvinnub', 'van', 'vans', 'fleet', 'business', 'company car')) return fleet(en)
  if (has(q, /\blan\b/, /\blana\b/, 'bilalan', 'fjarmogn', 'vext', 'afborg', 'kaupleig', 'lykil', 'ergo', 'arion', 'landsbank', 'finance', 'financing', 'loan', 'interest', 'lease', 'manud', 'monthly')) return finance(en)
  if (has(q, 'varahlut', 'aukahlut', 'parts', 'accessor')) return { reply: en ? `Parts and accessories are at Skeifan 17, Monday to Thursday 8–17 and Friday 8–16: ${CONTACT.parts} or 568 5100.` : `Vara- og aukahlutir eru í Skeifunni 17, mánudaga til fimmtudaga kl. 8–17 og föstudaga kl. 8–16: ${CONTACT.parts} eða 568 5100.` }
  if (has(q, 'thjonust', 'verkstaed', 'smurn', 'vidgerd', 'skodun', 'boka tima', 'panta tima', 'akureyri', 'reykjanes', 'keflavik', 'holdur', 'service', 'repair', 'workshop', 'maintenance')) return service(en)
  if (has(q, 'opid', 'opnunart', 'opnar', 'lokad', 'lokar', 'hvenaer er', 'open', 'hours', 'closing', 'laugardag', 'sunnudag', 'um helg')) return hours(en)
  if (has(q, 'hvar', 'heimilisf', 'stadsetn', 'kort', 'rata', 'skeif', 'address', 'where', 'located', 'directions', 'map')) return where(en)
  if (has(q, 'simanum', 'simi', 'sima', 'hringi', 'hringja', 'netfang', 'tolvupost', 'email', 'e mail', 'phone', 'call', 'contact', 'hafa samband', 'na i ykkur')) return phones(en)
  if (has(q, 'odyr', 'laegst', 'cheap', 'lowest', 'budget')) return cheapest(en)
  if (has(q, 'tengiltvinn', 'tvinn', 'phev', 'hybrid', 'bensin')) return modelCard('seal-u-dm-i', en)
  if (has(q, 'sjo saet', '7 saet', 'seven seat', 'sjo manna')) return modelCard('tang', en)
  if (has(q, 'pallbil', 'pickup', 'pick up')) return modelCard('eterron-9', en)
  if (has(q, 'jepp', 'suv')) return list(MODELS.filter((x) => x.body === 'Jeppi' || x.body === 'Jepplingur'), en ? 'SUVs' : 'Jeppar og jepplingar', en, en ? 'Five SUVs: Seal U, Seal U plug-in hybrid, EVO AWD, Sealion 7 and the seven-seat Tang.' : 'Fimm jeppar og jepplingar: Seal U, Seal U tengiltvinn, EVO AWD, Sealion 7 og sjö sæta Tang.')
  if (has(q, 'maxus')) return fleet(en)
  if (has(q, 'byd')) return list(MODELS.filter((x) => x.brand === 'BYD'), 'BYD', en, en ? 'Seven BYD models, from the Dolphin to the seven-seat Tang.' : 'Sjö BYD gerðir, frá Dolphin að sjö sæta Tang.')
  if (has(q, 'merki', 'tegund', 'hvada bil', 'hvad eruð', 'brands', 'which cars', 'what do you sell')) return brands(en)
  if (has(q, 'draegni', 'hledsl', 'range', 'charg', 'kwh')) return list(MODELS.filter((x) => x.power === 'Rafmagn').slice(0, 6), en ? 'Range (WLTP)' : 'Drægni (WLTP)', en, en ? 'Ranges run from 335 km on the e-Deliver 5 to 674 km on the Seal U. Every car page lists range, battery and charging time.' : 'Drægnin er frá 335 km á e-Deliver 5 upp í 674 km á Seal U. Hver bílasíða sýnir drægni, rafhlöðu og hleðslutíma.')
  if (has(q, 'verd', 'kostar', 'kosta', 'price', 'cost', 'hvad kostar')) return { reply: en ? 'Which car? Pick a make:' : 'Hvaða bíl ertu að spá í? Veldu merki:', chips: en ? ['BYD prices', 'Maxus vans', 'Lowest price'] : ['BYD verð', 'Maxus sendibílar', 'Lægsta verðið'] }

  return refuse(en)
}
