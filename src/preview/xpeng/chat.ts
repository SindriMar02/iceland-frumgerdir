import { ALL_TRIMS, CONTACT, DEPTS, MODELS, NEWS, SERVICE, WARRANTY, fromPrice, kr, modelBySlug, openState, priceLine, trimLabel, type Model } from './data'
import { RING } from './geo'
import { gapInfo, kwhNum, planRing } from './plan'

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

export const GREETING = 'Halló! Ég svara spurningum um XPENG bílana, verðin, reynsluakstur, þjónustu, hleðslu og opnunartíma hjá Unu. Hvað viltu vita?'
export const CHIPS = ['Hvað kostar XPENG G6?', 'Kemst ég hringinn á G6?', 'Hvenær er opið?', 'Hvernig bóka ég reynsluakstur?']

export const fold = (s: string) =>
  s.toLowerCase().replace(/ð/g, 'd').replace(/þ/g, 'th').replace(/æ/g, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9/ ]+/g, ' ').replace(/\s+/g, ' ').trim()

const EN_WORDS = /\b(the|what|when|where|how|do you|does|is it|price|prices|cost|open|opening|hours|electric|cars?|service|book|thanks?|hello|hi|which|your|warranty|range|charge|charging|ring road|loop)\b/
const isEnglish = (raw: string) => EN_WORDS.test(raw.toLowerCase()) && !/[áðéíóúýþæö]/i.test(raw)
const has = (q: string, ...keys: (string | RegExp)[]) => keys.some((k) => (typeof k === 'string' ? q.includes(k) : k.test(q)))

const MODEL_KEYS: { slug: Model['slug']; re: RegExp }[] = [
  { slug: 'l03', re: /\bl ?03\b/ },
  { slug: 'g6', re: /\bg ?6\b/ },
  { slug: 'g9', re: /\bg ?9\b/ },
  { slug: 'x9', re: /\bx ?9\b/ },
]

const una = DEPTS[0]
const R = (href: string) => href /* routes are absolute inside the preview; the widget opens them in-page */
const kmFmt = (n: number) => Math.round(n).toLocaleString('de-DE')
const K = (n: number) => kr(n).replace(/\.$/, '') /* price inside a sentence: no double full stop */

function hours(en: boolean): Answer {
  const s = openState(una)
  return {
    tool: en ? 'checked opening hours' : 'athugaði opnunartíma',
    reply: en
      ? 'Una, Vínlandsleið 6-8: weekdays 9:00-17:00 and Saturdays 12:00-16:00.'
      : 'Una, Vínlandsleið 6-8: virka daga kl. 9-17 og laugardaga kl. 12-16.',
    card: { title: en ? 'Right now, by the ordinary weekly hours' : 'Staðan núna, miðað við venjulegan opnunartíma', rows: [{ k: en ? 'Showroom' : 'Sýningarsalur', v: en ? (s.open ? 'Open' : 'Closed') : s.text }] },
    chips: en ? ['Where are you?', 'How do I book a test drive?'] : ['Hvar eruð þið?', 'Hvernig bóka ég reynsluakstur?'],
  }
}

function where(en: boolean): Answer {
  return {
    reply: en
      ? `Una is at Vínlandsleið 6-8, 113 Reykjavík: the XPENG showroom. Phone ${CONTACT.phone}.`
      : `Una er að Vínlandsleið 6-8, 113 Reykjavík, í sýningarsal XPENG. Sími ${CONTACT.phone}.`,
    card: { title: 'Vínlandsleið 6-8', rows: [{ k: en ? 'Phone' : 'Sími', v: CONTACT.phone }, { k: en ? 'Email' : 'Netfang', v: CONTACT.email }], cta: { label: en ? 'Open in Google Maps' : 'Opna í Google Maps', href: CONTACT.map } },
    chips: en ? ['Opening hours', 'Book a test drive'] : ['Opnunartímar', 'Bóka reynsluakstur'],
  }
}

function phones(en: boolean): Answer {
  return {
    reply: en ? `Phone ${CONTACT.phone}, email ${CONTACT.email}. The sales team is listed on the contact page.` : `Sími ${CONTACT.phone}, netfang ${CONTACT.email}. Sölufólkið er á síðunni Hafa samband.`,
    card: { title: en ? 'Contact' : 'Hafa samband', rows: [{ k: en ? 'Phone' : 'Sími', v: CONTACT.phone }, { k: en ? 'Email' : 'Netfang', v: CONTACT.email }], cta: { label: en ? 'Contact page' : 'Hafa samband', href: R('hafa-samband') } },
  }
}

function modelCard(slug: Model['slug'], en: boolean): Answer {
  const x = modelBySlug(slug)!
  const rows = x.trims.flatMap((t) => [
    { k: t.name, v: kr(t.price) },
    ...(t.priceGrant ? [{ k: `${t.name}, ${en ? 'with grant' : 'með styrk'}`, v: kr(t.priceGrant), total: true }] : []),
  ])
  const best = x.trims.reduce((a, t) => (t.range > a.range ? t : a))
  return {
    tool: en ? 'looked up the price list' : 'fletti upp í verðlistanum',
    reply: en
      ? `${x.name}: ${x.trims.length > 1 ? `from ${K(fromPrice(x))}` : K(x.trims[0].price)}. Up to ${best.range} km (WLTP), DC charging 10-80 % in ${x.dcMin} minutes, towing ${x.tow} kg, warranty ${WARRANTY}.`
      : `${x.name}: ${x.trims.length > 1 ? `frá ${K(fromPrice(x))}` : K(x.trims[0].price)}. Allt að ${best.range} km (WLTP), hraðhleðsla 10-80 % á ${x.dcMin} mínútum, dráttargeta ${x.tow} kg, ábyrgð ${WARRANTY}.`,
    card: { title: x.name, rows, cta: { label: en ? 'See the car' : 'Skoða bílinn', href: R(`gerdir/${x.slug}`) } },
    chips: en ? [`Book a test drive in the ${x.name.replace('XPENG ', '')}`, `Can I do the ring road in the ${x.name.replace('XPENG ', '')}?`] : [`Bóka reynsluakstur í ${x.name.replace('XPENG ', '')}`, `Kemst ég hringinn á ${x.name.replace('XPENG ', '')}?`],
  }
}

function priceList(en: boolean): Answer {
  return {
    tool: en ? 'looked up the price list' : 'fletti upp í verðlistanum',
    reply: en
      ? 'The October 2026 price list has four models: L03 from 5,390,000 kr., G6 from 6,590,000 kr., G9 10,690,000 kr. and X9 12,390,000 kr. L03 and G6 also have a price with the Orkusjóður grant.'
      : 'Verðlistinn fyrir október 2026 sýnir fjórar gerðir: L03 frá 5.390.000 kr., G6 frá 6.590.000 kr., G9 á 10.690.000 kr. og X9 á 12.390.000 kr. Á L03 og G6 er einnig verð með orkustyrk.',
    card: { title: en ? 'Price list, October 2026' : 'Verðlisti, október 2026', rows: MODELS.map((x) => ({ k: x.name, v: priceLine(x).replace('Frá ', en ? 'from ' : 'frá ') })), cta: { label: en ? 'Open the price list' : 'Opna verðlistann', href: R('gerdir#verdlisti') } },
  }
}

function cheapest(en: boolean): Answer {
  const t = [...ALL_TRIMS].sort((a, b) => (a.t.priceGrant ?? a.t.price) - (b.t.priceGrant ?? b.t.price)).slice(0, 3)
  return {
    tool: en ? 'looked up the price list' : 'fletti upp í verðlistanum',
    reply: en ? `The lowest price is the L03 Standard Range Plus at ${K(4_890_000)} with the grant (list ${K(5_390_000)}).` : `Lægsta verðið er XPENG L03 Standard Range Plus á ${K(4_890_000)} með orkustyrk (listaverð ${K(5_390_000)}).`,
    card: { title: en ? 'Lowest prices' : 'Lægstu verðin', rows: t.map(({ m, t: x }) => ({ k: trimLabel(m, x), v: kr(x.priceGrant ?? x.price) })), cta: { label: en ? 'Open the price list' : 'Opna verðlistann', href: R('gerdir#verdlisti') } },
  }
}

function colours(en: boolean, slug: Model['slug']): Answer {
  const x = modelBySlug(slug)!
  return {
    tool: en ? 'looked up the price list' : 'fletti upp í verðlistanum',
    reply: en
      ? `The price list shows ${x.colours.length} colours for the ${x.name.replace('XPENG ', '')} (${x.colours.map((c) => c.name).join(', ')}) and these interiors: ${x.interiors.join(', ')}. White is standard, the others cost extra as listed. I cannot see which are in stock.`
      : `Verðlistinn sýnir ${x.colours.length} liti á ${x.name.replace('XPENG ', '')} (${x.colours.map((c) => c.name).join(', ')}) og þessar innréttingar: ${x.interiors.join(', ')}. Arctic White er staðalbúnaður, aðrir litir kosta aukalega eins og listinn sýnir. Ég sé ekki hvaða litir eru til á lager.`,
    card: { title: x.name, rows: x.colours.map((c) => ({ k: c.name, v: c.extra ? `+${kr(c.extra)}` : en ? 'standard' : 'staðalbúnaður' })), cta: { label: en ? 'See the car' : 'Skoða bílinn', href: R(`gerdir/${x.slug}`) } },
  }
}

function grant(en: boolean): Answer {
  return {
    reply: en
      ? 'The price list shows a price with the Orkusjóður grant on the L03 and G6 trims (500,000 kr. lower than the list price) and says the grant amount is subject to change. The G9 and X9 have no grant price on the list.'
      : 'Verðlistinn sýnir verð með orkustyrk á L03 og G6 útfærslum (500.000 kr. lægra en listaverð) og tekur fram að upphæð Orkusjóðsstyrks geti breyst. Á G9 og X9 er ekkert verð með styrk í verðlistanum.',
    chips: en ? ['Lowest price', 'XPENG G6 price'] : ['Lægsta verðið', 'Hvað kostar XPENG G6?'],
  }
}

function warranty(en: boolean): Answer {
  return {
    reply: en ? `Every XPENG on the price list has a ${WARRANTY} warranty. Service every 20,000 km or 12 months, whichever comes first. The condition printed on the price list is regular servicing, paid by the buyer.` : `Allir XPENG bílar á verðlistanum hafa ${WARRANTY} ábyrgð. Þjónustuskoðun á 20.000 km fresti eða 12 mánaða fresti, hvort sem á undan kemur. Forsenda ábyrgðar samkvæmt verðlistanum er reglulegt þjónustueftirlit sem kaupandi ber kostnað af.`,
  }
}

function testDrive(en: boolean): Answer {
  return {
    reply: en
      ? 'Pick a car, a day and a time on the test-drive page and Una confirms by phone. Test drives start at the showroom, Vínlandsleið 6-8, in opening hours.'
      : 'Þú velur bíl, dag og tíma á reynsluaksturssíðunni og Una staðfestir símleiðis. Reynsluakstur hefst í sýningarsalnum að Vínlandsleið 6-8 á opnunartíma.',
    card: { title: en ? 'Test drive' : 'Reynsluakstur', rows: [{ k: en ? 'Where' : 'Hvar', v: 'Vínlandsleið 6-8' }, { k: en ? 'When' : 'Hvenær', v: en ? 'Opening hours' : 'Á opnunartíma' }], cta: { label: en ? 'Book a test drive' : 'Bóka reynsluakstur', href: R('reynsluakstur') } },
  }
}

function service(en: boolean): Answer {
  return {
    reply: en
      ? `Una is the service partner for XPENG in Iceland. ${SERVICE.note} Send a service request on the service page and Una confirms where and when by phone.`
      : `Una er þjónustuaðili fyrir XPENG á Íslandi. ${SERVICE.note} Sendu beiðni á þjónustusíðunni og Una staðfestir stað og tíma símleiðis.`,
    card: { title: en ? 'Service' : 'Þjónusta', rows: [{ k: en ? 'Warranty' : 'Ábyrgð', v: WARRANTY }, { k: en ? 'Service interval' : 'Þjónustuskoðun', v: '20.000 km / 12 mán.' }], cta: { label: en ? 'Request service' : 'Biðja um þjónustu', href: R('thjonusta') } },
  }
}

function tradeIn(en: boolean): Answer {
  return {
    reply: en
      ? 'You can send the details of your current car on the trade-in page and sales gets back to you with an offer. I cannot value a car myself.'
      : 'Þú getur sent upplýsingar um núverandi bíl á innskiptasíðunni og söludeildin svarar með tilboði. Ég get ekki metið bíl sjálf.',
    card: { title: en ? 'Trade-in' : 'Bíllinn upp í', rows: [{ k: en ? 'You send' : 'Þú sendir', v: en ? 'Make, year, km' : 'Tegund, árgerð, km' }], cta: { label: en ? 'Send the details' : 'Senda upplýsingar', href: R('innskipti') } },
  }
}

function record(en: boolean): Answer {
  const p = NEWS[0]
  return {
    reply: en
      ? 'Una and Orkan report that an XPENG G9 charged 10-80 % in 12 minutes 23 seconds at an Orkan fast charger at Lambhagavegur, with a peak of 408 kW. Una writes that no faster charge is known in Iceland, so it is assumed to be a record. The measurement is confirmed by video of the car screen, and Orkan\'s electrical engineer followed it.'
      : 'Una og Orkan segja að XPENG G9 hafi hlaðið 10-80% á 12 mínútum og 23 sekúndum í hraðhleðslustöð Orkunnar á Lambhagavegi, með 408 kW hámarksafl. Una skrifar að ekki sé vitað um hraðari hleðslu á Íslandi og því sé gert ráð fyrir að um Íslandsmet sé að ræða. Mælingin er staðfest með myndbandi af skjá bílsins og tæknistjóri rafmagns hjá Orkunni fylgdist með.',
    card: { title: p.title, rows: [{ k: en ? 'Charge' : 'Hleðsla', v: '10-80 %' }, { k: en ? 'Time' : 'Tími', v: '12:23' }, { k: en ? 'Peak power' : 'Hámarksafl', v: '408 kW' }], cta: { label: en ? 'Read the news' : 'Fréttir', href: R('frettir') } },
  }
}

function pickTrim(x: Model, q: string) {
  const words = ['standard', 'long', 'performance', 'plus', 'ultra']
  const want = words.filter((w) => q.includes(w))
  const scored = x.trims.map((y) => ({ y, n: want.filter((w) => fold(y.name).includes(w)).length - fold(y.name).split(' ').filter((w) => !want.includes(w) && words.includes(w)).length * 0.1 }))
  const best = scored.sort((a, b) => b.n - a.n)[0]
  return want.length && best.n > 0 ? best.y : x.trims.reduce((a, y) => (y.range > a.range ? y : a))
}

function ring(en: boolean, slug: Model['slug'] = 'g6', q = ''): Answer {
  const x = modelBySlug(slug)!
  const t = pickTrim(x, q)
  const car = { range: t.range, dcMin: x.dcMin, kwh: kwhNum(t.kwh) }
  const p = planRing(car)
  const label = trimLabel(x, t)
  const gap = gapInfo(false)
  const DAT: Record<string, string> = { Borgarnes: 'Borgarnesi', Blönduós: 'Blönduósi', Egilsstaðir: 'Egilsstöðum', Mývatn: 'Mývatni', Kirkjubæjarklaustur: 'Kirkjubæjarklaustri', Selfoss: 'Selfossi' }
  const near = (km: number) => { let b = RING.places[0]; for (const pl of RING.places) if (Math.abs(pl.km - km) < Math.abs(b.km - km)) b = pl; return en ? b.name : (DAT[b.name] ?? b.name) }
  const caveat = en
    ? 'It is a calculation from the printed WLTP range and the fast chargers mapped in OpenStreetMap, which the operators have not confirmed. Winter, wind and charger power change it.'
    : 'Þetta er útreikningur úr uppgefinni WLTP-drægni og hraðhleðslustöðvum á korti OpenStreetMap, sem rekstraraðilar hafa ekki staðfest. Vetur, vindur og afl stöðvanna breyta honum.'
  if (!p.ok) {
    const alt = planRing(car, { useUnk: true })
    return {
      tool: en ? 'planned the ring road' : 'reiknaði Hringveginn',
      reply: en
        ? `${label} (${t.range} km WLTP) does not reach the next fast charger on the map: the longest gap is ${kmFmt(gap.g)} km, from ${near(gap.a)} to ${near(gap.b)}. ${alt.ok ? 'ON has a station at Mývatn that the map lists without connector or power data; counting it, the car would make it, but that is unconfirmed.' : 'Try a longer-range trim.'} ${caveat}`
        : `${label} (${t.range} km WLTP) nær ekki næstu hraðhleðslustöð á kortinu: lengsta bilið er ${kmFmt(gap.g)} km, frá ${near(gap.a)} að ${near(gap.b)}. ${alt.ok ? 'ON er með stöð við Mývatn sem er skráð á kortið án upplýsinga um tengi eða afl; með henni kæmist bíllinn, en það er óstaðfest.' : 'Prófaðu útfærslu með lengri drægni.'} ${caveat}`,
      card: { title: 'Hringvegurinn', rows: [{ k: en ? 'Route' : 'Leið', v: `${kmFmt(RING.km)} km` }, { k: en ? 'Reaches' : 'Nær', v: `${kmFmt(p.reach)} km` }, { k: en ? 'Longest gap' : 'Lengsta bil', v: `${kmFmt(gap.g)} km` }], cta: { label: en ? 'Plan a trip' : 'Skipuleggja ferð', href: R(`hringvegurinn?bill=${x.slug}&utf=${encodeURIComponent(t.name)}`) } },
    }
  }
  return {
    tool: en ? 'planned the ring road' : 'reiknaði Hringveginn',
    reply: en
      ? `${label}: the ring road is about ${kmFmt(RING.km)} km on the OpenStreetMap route. Starting with a full battery, charging only what the next leg needs and arriving with at least 10 %, it takes ${p.stops.length} fast-charge stops and about ${p.minutes} minutes of charging at best, and gets home with ${p.endSoc} %. ${caveat}`
      : `${label}: Hringvegurinn er um ${kmFmt(RING.km)} km á leiðinni í OpenStreetMap. Bíllinn fer af stað með fullan geymi, hleður aðeins þá orku sem næsti leggur þarf og fer aldrei undir 10%. Þá þarf hann ${p.stops.length} hraðhleðslustopp og alls um ${p.minutes} mínútur í hleðslu í besta falli, og kemur heim með ${p.endSoc}%. ${caveat}`,
    card: { title: `${label}, Hringvegurinn`, rows: [{ k: en ? 'Route' : 'Leið', v: `${kmFmt(RING.km)} km` }, { k: en ? 'Fast-charge stops' : 'Hraðhleðslustopp', v: String(p.stops.length) }, { k: en ? 'Charging, at best' : 'Hleðsla, í besta falli', v: `${p.minutes} mín.`, total: true }, { k: en ? 'Arrives home with' : 'Kemur heim með', v: `${p.endSoc} %` }], cta: { label: en ? 'Plan a trip' : 'Skipuleggja ferð', href: R(`hringvegurinn?bill=${x.slug}&utf=${encodeURIComponent(t.name)}`) } },
    chips: en ? ['Change the car', 'Book a test drive'] : ['Annan bíl', 'Bóka reynsluakstur'],
  }
}

function refuse(en: boolean, text?: string): Answer {
  return {
    refused: true,
    reply: text ?? (en ? `I only answer from what is on this page, and that is not here. Una answers on ${CONTACT.phone} or ${CONTACT.email}.` : `Ég svara bara út frá því sem stendur á þessari síðu, og þetta er ekki hér. Una svarar í síma ${CONTACT.phone} eða á ${CONTACT.email}.`),
    chips: en ? ['Opening hours', 'Price list', 'Book a test drive'] : ['Opnunartímar', 'Verðlistinn', 'Bóka reynsluakstur'],
  }
}

export async function answer(messages: Msg[]): Promise<Answer> {
  const raw = messages.filter((x) => x.role === 'user').pop()?.content ?? ''
  const en = isEnglish(raw)
  const q = fold(raw)
  if (!q) return refuse(en)

  if (has(q, 'takk', 'thakka', 'thanks', 'thank you', 'frabaert', 'snilld')) return { reply: en ? `Any time. Una is on ${CONTACT.phone} if you want a person.` : `Ekkert mál. Una er í síma ${CONTACT.phone} ef þú vilt tala við manneskju.` }
  if (has(q, /^(hae|hallo|halo|hi|hello|godan dag|saell|sael)\b/)) return { reply: en ? 'Hello! Ask about a car, a price, charging, service or opening hours.' : 'Halló! Spurðu um bíl, verð, hleðslu, þjónustu eða opnunartíma.', chips: CHIPS }

  // things the page cannot answer, said plainly
  if (has(q, 'fjarmogn', /\blan\b/, /\blana\b/, 'afborg', 'manud', 'vext', 'loan', 'finance', 'financing', 'lease', 'kaupleig', 'monthly'))
    return refuse(en, en ? `The price list shows prices but no financing terms, so I cannot quote a monthly payment. Una's sales team can: ${CONTACT.phone}.` : `Verðlistinn sýnir verð en ekki lánaskilmála, svo ég get ekki nefnt greiðslu á mánuði. Söludeild Unu getur það: ${CONTACT.phone}.`)
  if (has(q, 'til a lager', 'a lager', 'afhendingart', 'hvenaer faest', 'bidlist', 'ahugalist', 'in stock', 'delivery time', 'available now'))
    return refuse(en, en ? `I cannot see stock or delivery times from here. Una knows: ${CONTACT.phone}.` : `Ég sé ekki lagerstöðu eða afhendingartíma héðan. Una veit það: ${CONTACT.phone}.`)
  if (has(q, 'notad', 'notud', 'used car', 'second hand')) return refuse(en, en ? 'This page lists new XPENG cars only. Una is the importer and service partner.' : 'Þessi síða sýnir aðeins nýja XPENG bíla. Una er umboðs- og þjónustuaðili.')

  if (has(q, 'innskipti', 'uppitoku', 'upp i', 'taka bilinn', 'bilinn minn', 'bilinn minn', 'minn bill', 'my car', 'my old car', 'trade in', 'trade-in', 'skipta a')) return tradeIn(en)
  if (has(q, 'islandsmet', 'met i hradhledslu', 'record', 'lambhagaveg', '408', '12 minut', 'orkan', 'orkunnar')) return record(en)
  if (has(q, 'styrk', 'orkusjod', 'grant', 'subsid')) return grant(en)

  const hit = MODEL_KEYS.find((x) => x.re.test(q))
  if (has(q, 'hringinn', 'hringveg', 'ring road', 'around iceland', 'round iceland', 'komast hringinn', 'kemst'))
    return ring(en, hit?.slug ?? 'g6', q)
  if (hit) {
    if (has(q, /\blit(i|ir|ur|um)?\b/, 'colour', 'color', 'innrett', 'interior')) return colours(en, hit.slug)
    if (has(q, 'abyrgd', 'warranty')) return warranty(en)
    if (has(q, 'reynsluak', 'profa', 'prufu', 'test drive', 'testdrive')) return testDrive(en)
    if (has(q, 'thjonust', 'verkstaed', 'vidgerd', 'skodun', 'service', 'repair', 'workshop')) return service(en)
    return modelCard(hit.slug, en)
  }

  if (has(q, 'reynsluak', 'profa bil', 'prufukeyr', 'prufuakst', 'profad', 'test drive', 'testdrive')) return testDrive(en)
  if (has(q, 'abyrgd', 'warranty')) return warranty(en)
  if (has(q, 'thjonust', 'verkstaed', 'smurn', 'vidgerd', 'skodun', 'boka tima', 'panta tima', 'service', 'repair', 'workshop', 'maintenance')) return service(en)
  if (has(q, 'opid', 'opnunart', 'opnar', 'lokad', 'lokar', 'hvenaer er', 'open', 'hours', 'closing', 'laugardag', 'sunnudag', 'um helg')) return hours(en)
  if (has(q, 'hvar', 'heimilisf', 'stadsetn', 'kort', 'rata', 'vinlandsleid', 'address', 'where', 'located', 'directions', 'map')) return where(en)
  if (has(q, 'simanum', 'simi', 'sima', 'hringi', 'hringja', 'netfang', 'tolvupost', 'email', 'e mail', 'phone', 'call', 'contact', 'hafa samband')) return phones(en)
  if (has(q, 'odyr', 'laegst', 'cheap', 'lowest', 'budget')) return cheapest(en)
  if (has(q, 'sjo saet', '7 saet', 'seven seat', 'sjo manna', 'fjolskyldubil')) return modelCard('x9', en)
  if (has(q, 'verdlist', 'price list', 'allar gerdir', 'allir bilar', 'hvada bila', 'which cars', 'what do you sell', 'models')) return priceList(en)
  if (has(q, 'drattar', 'towing', 'tow ')) return { reply: en ? 'All four models tow 1,500 kg according to the price list.' : 'Allar fjórar gerðirnar draga 1.500 kg samkvæmt verðlistanum.', chips: en ? ['Price list'] : ['Verðlistinn'] }
  if (has(q, 'draegni', 'hledsl', 'range', 'charg', 'kwh')) return { reply: en ? 'Range (WLTP) runs from 440 km (L03 Performance) to 580 km (X9). DC charging from 10 to 80 % takes 12 minutes on the G6, G9 and X9 and 20 minutes on the L03. Ask about a car by name, or ask whether it makes the ring road.' : 'Drægni (WLTP) er frá 440 km (L03 Performance) upp í 580 km (X9). Hraðhleðsla úr 10 í 80% tekur 12 mínútur á G6, G9 og X9 og 20 mínútur á L03. Spurðu um bíl með nafni, eða hvort hann kemst Hringveginn.', chips: en ? ['Can I do the ring road in the G6?', 'XPENG X9'] : ['Kemst ég hringinn á G6?', 'XPENG X9'] }
  if (has(q, 'verd', 'kostar', 'kosta', 'price', 'cost')) return priceList(en)
  if (has(q, 'xpeng', 'bilar', 'bila', 'cars')) return priceList(en)

  return refuse(en)
}
