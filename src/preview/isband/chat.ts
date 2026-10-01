import { CONTACT, DEPTS, EMERGENCY, LINKS, LOANS, MODELS, MODS, fullName, openState, type Brand } from './data'

/*
 * The assistant on this page, wired ONLY to this page.
 *
 * It is our <sndr-chat> widget with its `answerer` hook: every question is
 * matched against the same data module the page renders from, in the browser,
 * with no model and no network. So it cannot say anything the page does not
 * say, and a question it cannot match gets the designed refusal with the
 * phone number. Icelandic answers are composed here once, read and checked;
 * nothing is generated at runtime. English questions get English answers.
 *
 * The `tool` chip is only sent where a lookup really ran (the price list, the
 * opening-hours clock), per the widget's own rule.
 */

type Card = { title: string; rows: { k: string; v: string; total?: boolean }[]; cta?: { label: string; href: string } }
export type Answer = { reply?: string; tool?: string; card?: Card; refused?: boolean; chips?: string[] }
type Msg = { role: 'user' | 'assistant'; content: string }

export const GREETING = 'Halló! Ég svara spurningum um bílana, verðin, breytingar, opnunartíma og þjónustu hjá ÍSBAND. Hvað viltu vita?'
export const CHIPS = ['Hvenær er opið?', 'Hvað kostar Leapmotor T03?', 'Halda breyttir bílar ábyrgð?', 'Hvernig panta ég tíma á verkstæði?']

/* ö, á, ð, þ, æ folded so "hvenaer", "opid" and "Hvenær" all match. */
export const fold = (s: string) =>
  s.toLowerCase().replace(/ð/g, 'd').replace(/þ/g, 'th').replace(/æ/g, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9/ ]+/g, ' ').replace(/\s+/g, ' ').trim()

const EN_WORDS = /\b(the|what|when|where|how|do you|does|is it|price|prices|cost|open|opening|hours|electric|cars?|service|used|book|thanks?|hello|hi|which|your|warranty|lifted|modified)\b/
const isEnglish = (raw: string) => EN_WORDS.test(raw.toLowerCase()) && !/[áðéíóúýþæö]/i.test(raw)

const has = (q: string, ...keys: (string | RegExp)[]) => keys.some((k) => (typeof k === 'string' ? q.includes(k) : k.test(q)))

const MODEL_KEYS: { key: string; re: RegExp }[] = [
  { key: 't03', re: /\bt ?03\b/ },
  { key: 'b03x', re: /\bb ?03 ?x?\b/ },
  { key: 'b05', re: /\bb ?05\b/ },
  { key: 'b10', re: /\bb ?10\b/ },
  { key: 'c10', re: /\bc ?10\b/ },
  { key: 'wrangler', re: /\bwrangler\b|\brubicon\b/ },
  { key: 'grand', re: /\bgrand\b|\bcherokee\b/ },
  { key: 'avenger', re: /\bavenger\b/ },
  { key: 'ramhd', re: /\b(2500|3500|heavy duty)\b/ },
  { key: 'ram1500', re: /\b1500\b|\brho\b|\brebel\b/ },
  { key: '600e', re: /\b600 ?e\b|\bfiat 600\b/ },
  { key: '500e', re: /\b500 ?e\b|\bfiat 500\b/ },
  { key: 'fiatpro', re: /\bdoblo\b|\bscudo\b|\bducato\b|\bsendib|\batvinnub|\bfiat professional\b|\bvan\b/ },
]

const nyir = DEPTS[0]
const used100 = DEPTS[1]
const verk = DEPTS[2]
const parts = DEPTS[3]
const fromLow = (p: string) => p.replace(/^Frá /, 'frá ')
/* a price already ends in "kr.", so a sentence never gets a second full stop */
const stop = (p: string) => (p.endsWith('.') ? p : `${p}.`)

function hours(en: boolean): Answer {
  const s = openState(nyir)
  const u = openState(used100)
  const w = openState(verk)
  return {
    tool: en ? 'checked opening hours' : 'athugaði opnunartíma',
    reply: en
      ? 'New cars at Þverholt 6, Mosfellsbær: weekdays 10:00–17:00, closed at weekends. Used cars at 100 bílar, Stekkjarbakki 4: weekdays 10:00–18:00 and Saturdays 12:00–14:00 (closed on Saturdays in summer and December). The workshop at Smiðshöfði 5 opens at 07:45, Monday to Thursday until 17:00 and Fridays until 16:00.'
      : 'Nýir bílar í Þverholti 6 í Mosfellsbæ: virka daga kl. 10–17, lokað um helgar. Notaðir bílar hjá 100 bílum, Stekkjarbakka 4: virka daga kl. 10–18 og laugardaga kl. 12–14 (lokað á laugardögum á sumrin og í desember). Verkstæðið á Smiðshöfða 5 opnar kl. 7:45, mánudaga til fimmtudaga til kl. 17 og föstudaga til kl. 16.',
    card: {
      title: en ? 'Right now, by the ordinary weekly hours' : 'Staðan núna, miðað við venjulegan opnunartíma',
      rows: [
        { k: en ? 'New cars, Þverholt 6' : 'Nýir bílar, Þverholti 6', v: en ? (s.open ? 'Open' : 'Closed') : s.text },
        { k: en ? 'Used cars, 100 bílar' : 'Notaðir bílar, 100 bílar', v: en ? (u.open ? 'Open' : 'Closed') : u.text },
        { k: en ? 'Workshop, Smiðshöfði 5' : 'Verkstæði, Smiðshöfða 5', v: en ? (w.open ? 'Open' : 'Closed') : w.text },
      ],
    },
    chips: en ? ['Where are you?', 'What does a T03 cost?'] : ['Hvar eruð þið?', 'Hvernig panta ég tíma á verkstæði?'],
  }
}

function where(en: boolean): Answer {
  return {
    reply: en
      ? 'New cars and the office are at Þverholt 6, 270 Mosfellsbær. Used cars are at 100 bílar, Stekkjarbakki 4 in Mjódd, next to Garðheimar. The workshop and parts shop are at Smiðshöfði 5, 110 Reykjavík.'
      : 'Nýir bílar og skrifstofan eru í Þverholti 6, 270 Mosfellsbæ. Notaðir bílar eru hjá 100 bílum á Stekkjarbakka 4 í Mjódd, við hliðina á Garðheimum. Verkstæðið og varahlutaverslunin eru á Smiðshöfða 5, 110 Reykjavík.',
    card: {
      title: en ? 'Addresses' : 'Heimilisföng',
      rows: DEPTS.map((d) => ({ k: d.name, v: `${d.street} · ${d.phone}` })),
      cta: { label: en ? 'Map to Þverholt 6' : 'Kort að Þverholti 6', href: LINKS.map },
    },
    chips: en ? ['When are you open?'] : ['Hvenær er opið?', 'Hvaða símanúmer hringi ég í?'],
  }
}

function phones(en: boolean): Answer {
  return {
    reply: en
      ? `The main number is ${CONTACT.phone} and the e-mail is ${CONTACT.email}. Each department has its own line:`
      : `Aðalnúmerið er ${CONTACT.phone} og netfangið ${CONTACT.email}. Hver deild hefur líka sitt eigið númer:`,
    card: {
      title: en ? 'Phone numbers' : 'Símanúmer',
      rows: [...DEPTS.map((d) => ({ k: d.name, v: d.phone })), { k: en ? 'Roadside service' : 'Neyðarþjónusta', v: CONTACT.emergency }],
    },
  }
}

function modelCard(key: string, en: boolean): Answer {
  const m = MODELS.find((x) => x.key === key)!
  const title = fullName(m)
  if (!m.price) {
    return {
      tool: en ? 'checked the price list' : 'fletti upp í verðlista',
      reply: en
        ? `ÍSBAND lists no price for the ${title} right now: the sales team quotes it. Call ${CONTACT.phone}.`
        : `ÍSBAND gefur ekki upp verð á ${title} á vefnum núna heldur er bent á sölumenn. Hringdu í ${CONTACT.phone}.`,
      chips: en ? ['What does a 600e cost?'] : ['Hvað kostar Fiat 600e?', 'Hvaða rafbíla eruð þið með?'],
    }
  }
  return {
    tool: en ? 'checked the price list' : 'fletti upp í verðlista',
    reply: en
      ? `${m.key === 'fiatpro' ? 'Fiat Professional vans start at' : `The ${title} costs`} ${stop(fromLow(m.price).replace('án vsk.', 'excluding VAT'))}${m.studio ? ' That price includes the 500.000 kr. EV grant from Orkusjóður.' : ''}`
      : `${m.key === 'fiatpro' ? 'Fiat Professional atvinnubílar kosta' : `${title} kostar`} ${stop(fromLow(m.price))}${m.note ? ` ${m.note}` : ''}`,
    card: {
      title: m.key === 'fiatpro' ? 'Fiat Professional' : title,
      rows: [
        ...m.facts.map((f) => ({ k: f, v: '' })),
        { k: en ? 'Price' : 'Verð', v: m.price, total: true },
      ],
      cta: { label: en ? `See the ${m.name}` : `Skoða ${m.name}`, href: m.href },
    },
    chips: en ? ['Can I book a test drive?', 'Which electric cars do you have?'] : ['Get ég prófað bílinn?', 'Bjóðið þið bílalán?'],
  }
}

function brandList(brand: Brand | 'RAMJEEP', en: boolean): Answer {
  const list = brand === 'RAMJEEP' ? MODELS.filter((m) => m.brand === 'Jeep' || m.brand === 'RAM') : MODELS.filter((m) => m.brand === brand)
  return {
    tool: en ? 'checked the price list' : 'fletti upp í verðlista',
    reply: en ? 'These are the lines and their lowest listed prices:' : 'Þetta eru gerðirnar og lægsta verð hverrar:',
    card: {
      title: brand === 'RAMJEEP' ? 'Jeep og RAM' : brand,
      rows: list.map((m) => ({ k: brand === 'RAMJEEP' ? fullName(m) : m.name, v: m.price ? fromLow(m.price) : (en ? 'ask sales' : 'leitið til sölumanna') })),
      cta: { label: en ? 'All new cars' : 'Allir nýir bílar', href: brand === 'Leapmotor' ? LINKS.leapmotor : brand === 'RAM' ? LINKS.ram : LINKS.newCars },
    },
    chips: en ? ['Can I book a test drive?'] : ['Get ég prófað bíl?', 'Hvaða rafbíla eruð þið með?'],
  }
}

function electric(en: boolean): Answer {
  const evs = MODELS.filter((m) => m.power === 'Rafmagn')
  return {
    tool: en ? 'checked the price list' : 'fletti upp í verðlista',
    reply: en
      ? 'Leapmotor is all electric, and Fiat has the 600e and 500e. Leapmotor prices include the 500.000 kr. grant you apply for at island.is.'
      : 'Leapmotor er allur rafknúinn og Fiat er með 600e og 500e. Leapmotor verðin eru með 500.000 kr. rafbílastyrk sem sótt er um á island.is.',
    card: { title: en ? 'Electric' : 'Rafbílar', rows: evs.map((m) => ({ k: fullName(m), v: m.price ? fromLow(m.price) : (en ? 'ask sales' : 'leitið til sölumanna') })) },
    chips: en ? ['How does the EV grant work?'] : ['Hvernig virkar rafbílastyrkurinn?', 'Hvað er ódýrast?'],
  }
}

function grant(en: boolean): Answer {
  return {
    reply: en
      ? 'Buyers apply to Orkusjóður at island.is for a 500.000 kr. grant on electric passenger cars (M1) and vans (N1), when the price is under 10.000.000 kr. Orkusjóður says it takes about two working days and pays the grant into your bank account.'
      : 'Kaupendur sækja um 500.000 kr. rafbílastyrk hjá Orkusjóði á island.is, bæði fyrir fólksbíla (M1) og sendibíla (N1), ef kaupverðið er undir 10.000.000 kr. Orkusjóður áætlar um tvo virka daga í afgreiðslu og greiðir styrkinn inn á bankareikning kaupanda.',
    card: { title: en ? 'EV grant' : 'Rafbílastyrkur', rows: [], cta: { label: en ? 'Read more' : 'Nánar á isband.is', href: LINKS.rafbilastyrkur } },
  }
}

function cheapest(en: boolean): Answer {
  return {
    tool: en ? 'checked the price list' : 'fletti upp í verðlista',
    reply: en
      ? 'The lowest new-car price is the Leapmotor T03 at 2.390.000 kr. with the EV grant, then the B03X from 2.990.000 kr. 100 bílar has used cars from lower still.'
      : 'Lægsta verðið á nýjum bíl er Leapmotor T03 á 2.390.000 kr. með rafbílastyrk og svo B03X frá 2.990.000 kr. Hjá 100 bílum byrja verðin á notuðum bílum enn lægra.',
    chips: en ? ['Do you offer car loans?'] : ['Bjóðið þið bílalán?', 'Sýndu mér notaða bíla'],
  }
}

function testDrive(en: boolean): Answer {
  return {
    reply: en
      ? `Yes. Call the showroom on ${CONTACT.phone}, or e-mail ${CONTACT.email}, and a salesperson finds a time with you. The showroom at Þverholt 6 is open weekdays 10:00–17:00.`
      : `Já. Hringdu í söludeildina í síma ${CONTACT.phone} eða sendu póst á ${CONTACT.email} og sölumaður finnur tíma með þér. Sýningarsalurinn í Þverholti 6 er opinn virka daga kl. 10–17.`,
    card: { title: en ? 'Test drive' : 'Reynsluakstur', rows: [{ k: en ? 'Sales, Þverholt 6' : 'Söludeild, Þverholti 6', v: CONTACT.phone }, { k: en ? 'Weekdays' : 'Virkir dagar', v: '10:00–17:00' }] },
  }
}

function used(en: boolean): Answer {
  return {
    reply: en
      ? `Used cars are sold by 100 bílar, ÍSBAND's sister company, at Stekkjarbakki 4 in Mjódd. The list changes daily, so the live one is on 100bilar.is. Phone ${used100.phone}.`
      : `Notaðir bílar eru seldir hjá 100 bílum, systurfyrirtæki ÍSBAND, á Stekkjarbakka 4 í Mjódd. Skráin breytist daglega svo sú rétta er á 100bilar.is. Síminn er ${used100.phone}.`,
    card: { title: '100 bílar', rows: [{ k: 'Stekkjarbakka 4', v: used100.phone }, { k: en ? 'Weekdays / Saturdays' : 'Virkir dagar / laugardaga', v: '10–18 / 12–14' }], cta: { label: en ? 'See the list' : 'Skoða söluskrána', href: LINKS.used } },
    chips: en ? ['Do you offer car loans?'] : ['Bjóðið þið bílalán?', 'Takið þið bíl upp í?'],
  }
}

function finance(en: boolean): Answer {
  return {
    tool: en ? 'checked the loan examples' : 'fletti upp í lánadæmum',
    reply: en
      ? 'ÍSBAND arranges car loans with approved lenders. The published Leapmotor examples are Lykill loans over 84 months with 150.000 kr. down plus the 500.000 kr. EV grant:'
      : 'ÍSBAND býður fjármögnun í samstarfi við viðurkennda lánveitendur. Dæmin sem birt eru fyrir Leapmotor eru bílalán frá Lykli til 84 mánaða með 150.000 kr. útborgun auk 500.000 kr. rafbílastyrks:',
    card: { title: en ? 'Monthly payment, Lykill' : 'Mánaðargreiðsla, Lykill', rows: LOANS.map((l) => ({ k: `Leapmotor ${l.name}`, v: `${l.monthly} · ÁHK ${l.ahk}` })), cta: { label: en ? 'Loans and leasing' : 'Bílalán og rekstrarleiga', href: LINKS.bilalan } },
    chips: en ? ['What about leasing?'] : ['Bjóðið þið rekstrarleigu?'],
  }
}

function leasing(en: boolean): Answer {
  return {
    reply: en
      ? 'Yes. Operating lease includes service inspections, oil service, tyre service, maintenance, insurance and vehicle tax.'
      : 'Já. Rekstrarleiga inniheldur þjónustuskoðanir, smurþjónustu, dekkjaþjónustu, viðhald, tryggingar og bifreiðagjöld.',
    card: { title: en ? 'Operating lease' : 'Rekstrarleiga', rows: [], cta: { label: en ? 'Cars on lease' : 'Bílar í rekstrarleigu', href: LINKS.rekstrarleiga } },
  }
}

function service(en: boolean): Answer {
  return {
    reply: en
      ? 'The workshop at Smiðshöfði 5 is an authorised workshop for Alfa Romeo, Chrysler, Dodge, Fiat, Fiat Professional, Jeep, Leapmotor and Ram Trucks. It has high ceilings for big vehicles: motorhomes, large pickups and work vans. Book with a request or a call.'
      : 'Verkstæðið á Smiðshöfða 5 er viðurkennt þjónustuverkstæði fyrir Alfa Romeo, Chrysler, Dodge, Fiat, Fiat Professional, Jeep, Leapmotor og Ram Trucks. Þar er hátt til lofts svo það tekur vel á móti stórum bílum, húsbílum, pallbílum og vinnubílum. Þú pantar tíma með fyrirspurn eða símtali.',
    card: { title: en ? 'Workshop' : 'Verkstæði', rows: [{ k: 'Smiðshöfða 5', v: verk.phone }, { k: en ? 'Mon–Thu' : 'Mán.–fim.', v: '07:45–17:00' }, { k: en ? 'Fri' : 'Föstudaga', v: '07:45–16:00' }], cta: { label: en ? 'Send a request' : 'Senda fyrirspurn', href: `mailto:${verk.email}?subject=${encodeURIComponent('Tímapöntun á verkstæði')}` } },
    chips: en ? ['Parts?'] : ['Varahlutir?', 'Neyðarþjónusta?'],
  }
}

function partsA(en: boolean): Answer {
  return {
    reply: en
      ? `The parts shop at Smiðshöfði 5 sells original parts for Alfa Romeo, Chrysler, Dodge, Fiat, Fiat Professional, Jeep and Ram Trucks. The main parts are kept in stock; other and older parts are ordered from the maker in 7–10 days. Phone ${parts.phone}.`
      : `Varahlutaverslunin á Smiðshöfða 5 selur original varahluti í Alfa Romeo, Chrysler, Dodge, Fiat, Fiat Professional, Jeep og Ram Trucks. Helstu varahlutir eru til á lager en aðrir og varahlutir í eldri bíla eru sérpantaðir frá framleiðanda á 7–10 dögum. Síminn er ${parts.phone}.`,
    card: { title: en ? 'Parts' : 'Varahlutir', rows: [{ k: parts.email, v: parts.phone }], cta: { label: en ? 'Accessories' : 'Aukahlutir', href: LINKS.aukahlutir } },
  }
}

function mods(en: boolean): Answer {
  return {
    tool: en ? 'checked the price list' : 'fletti upp í verðlista',
    reply: en
      ? 'ÍSBAND is the only dealer that does its own modifications, so Jeep and RAM cars modified by ÍSBAND keep their factory warranty. RAM and Wrangler Rubicon come with 35″, 37″ or 40″ packages, and the Grand Cherokee with 33″:'
      : 'ÍSBAND er eina bílaumboðið sem sér sjálft um breytingar og þess vegna halda Jeep og RAM bílar sem ÍSBAND breytir verksmiðjuábyrgð sinni. Í boði eru 35″, 37″ og 40″ breytingar á RAM og Wrangler Rubicon og 33″ breyting á Grand Cherokee:',
    card: {
      title: en ? 'Modification packages' : 'Breytingapakkar',
      rows: [
        ...MODS.grand.map((g) => ({ k: `Grand Cherokee ${g.size}`, v: g.price })),
        { k: MODS.wrangler37.name, v: MODS.wrangler37.price },
      ],
      cta: { label: en ? 'All packages' : 'Allir breytingapakkar', href: LINKS.breytingar },
    },
    chips: en ? ['What does a RAM 1500 cost?'] : ['Hvað kostar RAM 1500?', 'Hvað kostar Wrangler?'],
  }
}

function warranty(en: boolean): Answer {
  return {
    reply: en
      ? 'RAM pickups imported by ÍSBAND carry a 5-year factory warranty, the first time on a big American pickup; RAMs brought in from Europe, the USA or Canada by others carry none. New Jeep Wrangler and Grand Cherokee have 5 years and 8 years on the drive battery. Cars modified by ÍSBAND keep their warranty.'
      : 'RAM pallbílar sem ÍSBAND flytur inn eru með 5 ára verksmiðjuábyrgð, í fyrsta sinn á stórum amerískum pallbíl, en RAM sem aðrir flytja inn frá Evrópu, Bandaríkjunum eða Kanada eru ekki með verksmiðjuábyrgð. Nýir Jeep Wrangler og Grand Cherokee eru með 5 ára ábyrgð og 8 ára ábyrgð á drifrafhlöðu. Bílar sem ÍSBAND breytir halda ábyrgðinni.',
    card: { title: en ? 'Warranty terms' : 'Ábyrgðarskilmálar', rows: [], cta: { label: 'isband.is', href: LINKS.abyrgd } },
  }
}

function emergency(en: boolean): Answer {
  return {
    reply: en
      ? `Roadside service is open weekdays 17:00–22:00 and 10:00–20:00 at weekends and on public holidays: ${CONTACT.emergency}. It is free for cars under warranty when the warranty terms are met; otherwise the call-out is ${EMERGENCY.fee} plus repairs.`
      : `Neyðarþjónustan er opin virka daga kl. 17–22 og kl. 10–20 um helgar og á almennum frídögum, í síma ${CONTACT.emergency}. Hún er án kostnaðar fyrir bíla í ábyrgð að uppfylltum skilyrðum ábyrgðar, annars er útkallið ${EMERGENCY.fee} auk viðgerðarkostnaðar.`,
    card: { title: en ? 'Roadside service' : 'Neyðarþjónusta', rows: [{ k: en ? 'Weekdays' : 'Virka daga', v: EMERGENCY.weekdays }, { k: en ? 'Weekends' : 'Helgar og frídaga', v: EMERGENCY.weekends }, { k: en ? 'Phone' : 'Sími', v: CONTACT.emergency, total: true }], cta: { label: en ? 'Call now' : 'Hringja', href: `tel:${CONTACT.emergencyTel}` } },
  }
}

function story(en: boolean): Answer {
  return {
    reply: en
      ? 'Íslensk-Bandaríska, ÍSBAND for short, was founded in 1998 by Októ Þorgrímsson to import used cars from the USA. In 2016 Fiat Chrysler chose ÍSBAND as its distributor in Iceland, the showroom at Þverholt opened in 2017, and Leapmotor arrived in 2025.'
      : 'Íslensk-Bandaríska ehf., eða ÍSBAND, var stofnað 1998 af Októ Þorgrímssyni utan um innflutning á notuðum bílum frá Bandaríkjunum. Árið 2016 valdi Fiat Chrysler ÍSBAND sem dreifingaraðila sinn á Íslandi, sýningarsalurinn í Þverholti opnaði 2017 og Leapmotor bættist við 2025.',
    card: { title: en ? 'The story' : 'Sagan', rows: [], cta: { label: en ? 'About ÍSBAND' : 'Um ÍSBAND', href: LINKS.um } },
  }
}

const refuse = (en: boolean, reply?: string): Answer => ({
  refused: true,
  reply: reply ?? (en ? 'Sorry, I cannot find that one and I would hate to tell you something wrong. Best thing is to give us a ring, we will find it for you straight away.' : undefined),
  chips: en ? ['When are you open?', 'Which electric cars do you have?'] : CHIPS,
})

export function answer(history: Msg[]): Answer {
  const raw = [...history].reverse().find((m) => m.role === 'user')?.content ?? ''
  const q = fold(raw)
  const en = isEnglish(raw)

  if (!q) return refuse(en)
  if (/^(takk|takk fyrir|takk kaerlega|thanks|thank you|ok|okei|flott|frabaert)\b/.test(q) && q.split(' ').length <= 4)
    return { reply: en ? 'You are welcome. Anything else?' : 'Ekkert að þakka. Get ég aðstoðað með eitthvað fleira?', chips: en ? ['When are you open?'] : CHIPS }
  if (/^(hae|hallo|godan dag|goda kvoldid|hello|hi|hey|saell|sael)\b/.test(q) && q.split(' ').length <= 3)
    return { reply: en ? 'Hello! Ask me about the cars, prices, modifications, opening hours or service.' : 'Halló! Spurðu mig um bílana, verðin, breytingar, opnunartíma eða þjónustuna.', chips: en ? ['When are you open?', 'Which electric cars do you have?'] : CHIPS }

  // Things this page genuinely cannot know. Said plainly, with the phone.
  if (has(q, 'upp i', 'uppitok', 'uppitak', 'verdmat', 'trade in', 'trade-in', 'tradein'))
    return refuse(en, en ? 'I cannot value a car you want to trade in: that needs someone to see it. Call 100 bílar on 517 9999 or sales on 590 2300.' : 'Ég get ekki metið bíl sem þú vilt setja upp í, það þarf einhver að sjá hann. Hringdu í 100 bíla í síma 517 9999 eða söludeildina í 590 2300.')
  if (has(q, 'til a lager', 'a lager', 'til afhend', 'afhendingar', 'afhendingart', 'hvenaer kemur', 'bidlist', 'in stock', 'delivery', 'available now', 'eigid thid til', /\ber til\b/, /\beru til\b/, 'sera pant', 'serpant'))
    return refuse(en, en ? 'I cannot see stock or delivery times from here, and I would rather not guess. Sales knows exactly: 590 2300.' : 'Ég sé ekki lagerstöðu eða afhendingartíma héðan og vil ekki giska. Söludeildin veit það upp á hár: 590 2300.')

  if (has(q, 'neyd', 'biladur', 'bilud', 'drattarbil', 'emergency', 'breakdown', 'vegaadstod', 'utkall', 'roadside'))
    return emergency(en)
  if (has(q, 'rafbilastyrk', 'styrk', 'orkusjod', 'grant', 'subsid'))
    return grant(en)

  // A named model outranks everything else in the sentence.
  const hit = MODEL_KEYS.find((m) => m.re.test(q))
  if (hit) {
    if (has(q, 'abyrgd', 'warranty')) return warranty(en)
    if (has(q, 'breyt', 'upphaekk', /\b3[3570]\b/, /\b40\b/, 'tomm', 'lift')) return mods(en)
    if (has(q, 'thjonust', 'verkstaed', 'smurn', 'vidgerd', 'skodun', 'boka tima', 'panta tima', 'service', 'repair', 'workshop')) return service(en)
    if (has(q, 'varahlut', 'aukahlut', 'parts')) return partsA(en)
    if (has(q, 'reynsluak', 'profa', 'prufu', 'test drive', 'testdrive')) return testDrive(en)
    if (has(q, 'notad', 'notud', 'used')) return used(en)
    if (has(q, /\blan\b/, 'bilalan', 'afborg', 'manud', 'monthly', 'loan')) return finance(en)
    return modelCard(hit.key, en)
  }

  if (has(q, 'reynsluak', 'profa bil', 'prufukeyr', 'prufuakst', 'profad', 'test drive', 'testdrive'))
    return testDrive(en)
  if (has(q, 'breyting', 'breyta', 'breytt', 'upphaekk', 'jeppabreyt', /\b3[357] ?tomm/, '40 tomm', 'modif', 'lift kit', 'lifted'))
    return mods(en)
  if (has(q, 'abyrgd', 'warranty'))
    return warranty(en)
  if (has(q, 'rekstrarleig', 'leasing', 'lease'))
    return leasing(en)
  if (has(q, 'opid', 'opnunart', 'opnar', 'lokad', 'lokar', 'hvenaer er', 'open', 'hours', 'closing', 'laugardag', 'sunnudag', 'um helg'))
    return hours(en)
  if (has(q, 'notad', 'notud', 'soluskra', '100 bil', 'used', 'second hand', 'pre owned'))
    return used(en)
  if (has(q, /\blan\b/, /\blana\b/, /\blanid\b/, 'bilalan', 'fjarmogn', 'vext', 'afborg', 'lykil', 'finance', 'financing', 'loan', 'interest'))
    return finance(en)
  if (has(q, 'varahlut', 'aukahlut', 'fylgihlut', 'parts', 'accessor'))
    return partsA(en)
  if (has(q, 'thjonust', 'verkstaed', 'smurn', 'vidgerd', 'skodun', 'boka tima', 'panta tima', 'service', 'repair', 'workshop', 'maintenance'))
    return service(en)
  if (has(q, 'rafb', 'rafmagn', 'rafknun', 'hledsl', 'draegni', 'electric', /\bev\b/, 'range'))
    return electric(en)
  if (has(q, 'odyr', 'laegst', 'cheap', 'lowest', 'budget'))
    return cheapest(en)
  if (has(q, 'opid', 'opnunart', 'opnar', 'lokad', 'lokar', 'hvenaer er', 'open', 'hours', 'closing', 'close', 'laugardag', 'sunnudag', 'um helg'))
    return hours(en)
  if (has(q, 'hvar', 'heimilisf', 'stadsetn', 'kort', 'rata', 'thverholt', 'smidshof', 'stekkjarbakk', 'mosfellsb', 'address', 'where', 'located', 'directions', 'map'))
    return where(en)
  if (has(q, 'simanum', 'simi', 'sima', 'hringi', 'hringja', 'netfang', 'tolvupost', 'email', 'e mail', 'phone', 'call', 'contact', 'hafa samband', 'na i ykkur'))
    return phones(en)
  if (has(q, 'leapmotor', 'leap'))
    return brandList('Leapmotor', en)
  if (has(q, 'jeep', 'jepp') && has(q, /\bram\b/))
    return brandList('RAMJEEP', en)
  if (has(q, /\bram\b/, 'pallbil', 'pickup', 'truck'))
    return brandList('RAM', en)
  if (has(q, 'jeep', 'jepp', 'suv'))
    return brandList('RAMJEEP', en)
  if (has(q, 'fiat'))
    return brandList('Fiat', en)
  if (has(q, 'saga', 'sogu', 'stofnad', 'stofnud', 'hvad er langt', 'since', 'history', 'founded', '1998', 'okto', 'islensk bandarisk', 'nafnid'))
    return story(en)
  if (has(q, 'verd', 'kostar', 'kosta', 'price', 'cost', 'hvad kostar'))
    return { reply: en ? 'Which car? Pick a make:' : 'Hvaða bíl ertu að spá í? Veldu merki:', chips: en ? ['Leapmotor prices', 'Jeep and RAM prices', 'Fiat prices'] : ['Leapmotor verð', 'Jeep og RAM verð', 'Fiat verð'] }

  return refuse(en)
}
