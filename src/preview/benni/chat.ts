import { CONTACT, DEPTS, LINKS, MODELS, MODS, NESDEKK, PORSCHE_LIST, USED_COUNT, openState } from './data'

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

export const GREETING = 'Halló! Ég svara spurningum um bílana, verðin, opnunartíma og þjónustu hjá Bílabúð Benna. Hvað viltu vita?'
export const CHIPS = ['Hvenær er opið?', 'Hvað kostar Torres EVX?', 'Hvaða rafbíla eruð þið með?', 'Hvernig bóka ég þjónustu?']

/* ö, á, ð, þ, æ folded so "hvenaer", "opid" and "Hvenær" all match. */
export const fold = (s: string) =>
  s.toLowerCase().replace(/ð/g, 'd').replace(/þ/g, 'th').replace(/æ/g, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()

const EN_WORDS = /\b(the|what|when|where|how|do you|does|is it|price|prices|cost|open|opening|hours|electric|cars?|service|used|book|thanks?|hello|hi|which|your)\b/
const isEnglish = (raw: string) => EN_WORDS.test(raw.toLowerCase()) && !/[áðéíóúýþæö]/i.test(raw)

const has = (q: string, ...keys: (string | RegExp)[]) => keys.some((k) => (typeof k === 'string' ? q.includes(k) : k.test(q)))

const MODEL_KEYS: { key: string; re: RegExp }[] = [
  { key: 'cayenne-electric', re: /\bcayenne\b/ },
  { key: 'macan', re: /\bmacan\b/ },
  { key: 'taycan', re: /\btaycan\b/ },
  { key: '911', re: /\b911\b|\bpanamera\b|\b718\b/ },
  { key: 'rexton', re: /\brexton\b/ },
  { key: 'musso-ev', re: /\bmusso ?ev\b|\brafmagns ?musso\b/ },
  { key: 'musso-grand', re: /\bmusso\b/ },
  { key: 'torres', re: /\btorres\b|\bevx\b/ },
  { key: 'korando', re: /\bkorando\b/ },
  { key: 'tivoli', re: /\btivoli\b/ },
]

const salur = DEPTS[0]
const verk = DEPTS[2]

function hours(en: boolean): Answer {
  const s = openState(salur)
  const w = openState(verk)
  return {
    tool: en ? 'checked opening hours' : 'athugaði opnunartíma',
    reply: en
      ? `The showrooms at Krókháls 9 are open weekdays 09:00–17:00 and Saturdays 12:00–16:00, with no Sunday hours. The workshop and parts at Tangarhöfði 8 open at 07:45, Monday to Thursday until 17:00 and Fridays until 16:00.`
      : `Sýningarsalirnir á Krókhálsi 9 eru opnir virka daga kl. 9–17 og laugardaga kl. 12–16, en ekki á sunnudögum. Verkstæðið og varahlutaverslunin á Tangarhöfða 8 opna kl. 7:45, mánudaga til fimmtudaga til kl. 17 og föstudaga til kl. 16.`,
    card: {
      title: en ? 'Right now, by the ordinary weekly hours' : 'Staðan núna, miðað við venjulegan opnunartíma',
      rows: [
        { k: en ? 'Showrooms, Krókháls 9' : 'Sýningarsalir, Krókhálsi 9', v: en ? (s.open ? 'Open' : 'Closed') : s.text },
        { k: en ? 'Workshop, Tangarhöfði 8' : 'Verkstæði, Tangarhöfða 8', v: en ? (w.open ? 'Open' : 'Closed') : w.text },
      ],
    },
    chips: en ? ['Where are you?', 'What does a Torres EVX cost?'] : ['Hvar eruð þið?', 'Hvernig bóka ég þjónustu?'],
  }
}

function where(en: boolean): Answer {
  return {
    reply: en
      ? 'The showrooms and used cars are at Krókháls 9, 110 Reykjavík. The service workshop is at Tangarhöfði 8 and parts at Tangarhöfði 8–12.'
      : 'Sýningarsalirnir og notaðir bílar eru á Krókhálsi 9, 110 Reykjavík. Þjónustuverkstæðið er á Tangarhöfða 8 og varahlutirnir á Tangarhöfða 8–12.',
    card: {
      title: en ? 'Addresses' : 'Heimilisföng',
      rows: DEPTS.map((d) => ({ k: d.name, v: `${d.street} · ${d.phone}` })),
      cta: { label: en ? 'Map to Krókháls 9' : 'Kort að Krókhálsi 9', href: LINKS.map },
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
      rows: [...DEPTS.map((d) => ({ k: d.name, v: d.phone })), { k: en ? 'Porsche emergency, 24/7' : 'Neyðarnúmer Porsche, 24/7', v: CONTACT.emergency }],
    },
  }
}

function modelCard(key: string, en: boolean): Answer {
  const m = MODELS.find((x) => x.key === key)!
  if (!m.price) {
    return {
      tool: en ? 'checked the price list' : 'fletti upp í verðlista',
      reply: en
        ? `Porsche lists no price for the 911, Panamera or 718: a sales adviser gives you a quote for the exact car you want. Call ${CONTACT.phone}.`
        : `Porsche gefur ekki upp verð á 911, Panamera eða 718 heldur gerir söluráðgjafi þér tilboð í nákvæmlega þann bíl sem þú vilt. Hringdu í ${CONTACT.phone}.`,
      chips: en ? ['What does a Macan cost?'] : ['Hvað kostar Macan?', 'Get ég prófað bíl?'],
    }
  }
  return {
    tool: en ? 'checked the price list' : 'fletti upp í verðlista',
    reply: en
      ? `The ${m.brand} ${m.name} costs ${m.price.replace(/^Frá /, 'from ')}${m.note ? ', a price that includes the 500.000 kr. grant.' : ''}`
      : `${m.brand} ${m.name} kostar ${m.price.replace(/^Frá /, 'frá ')}${m.note ? ` ${m.note}` : ''}`,
    card: {
      title: `${m.brand} ${m.name}`,
      rows: [
        ...m.facts.map((f) => ({ k: f, v: '' })),
        { k: en ? 'Price' : 'Verð', v: m.price, total: true },
      ],
      cta: { label: en ? `See the ${m.name}` : `Skoða ${m.name}`, href: m.href },
    },
    chips: en ? ['Can I book a test drive?', 'Which electric cars do you have?'] : ['Get ég prófað bílinn?', 'Hvaða ábyrgð fylgir?'],
  }
}

function brandList(brand: 'Porsche' | 'KGM', en: boolean): Answer {
  const rows = brand === 'Porsche'
    ? PORSCHE_LIST.map((p) => ({ k: p.name, v: p.price.replace(/^Verð frá: /, 'frá ').replace(/^Verð: /, '') }))
    : MODELS.filter((m) => m.brand === 'KGM').map((m) => ({ k: m.name, v: (m.price ?? '').replace(/^Frá /, 'frá ') }))
  return {
    tool: en ? 'checked the price list' : 'fletti upp í verðlista',
    reply: brand === 'Porsche'
      ? (en ? 'These are the Porsche models with a published price:' : 'Þetta eru Porsche gerðirnar og verðin sem Porsche gefur upp:')
      : (en ? 'The KGM range, lowest trim first listed:' : 'KGM línan og lægsta verð hverrar gerðar:'),
    card: { title: brand, rows, cta: { label: en ? `All ${brand} prices` : `Allir ${brand} verðlistar`, href: brand === 'Porsche' ? LINKS.porsche : LINKS.kgm } },
    chips: en ? ['Can I book a test drive?'] : ['Get ég prófað bíl?', 'Hvaða rafbíla eruð þið með?'],
  }
}

function electric(en: boolean): Answer {
  const evs = MODELS.filter((m) => m.power === 'Rafmagn' && m.price)
  return {
    tool: en ? 'checked the price list' : 'fletti upp í verðlista',
    reply: en
      ? 'Both makes have electric cars. Torres EVX and Musso EV come with a 10-year battery warranty from KGM.'
      : 'Bæði merkin eru með rafbíla. Torres EVX og Musso EV eru með 10 ára ábyrgð á rafhlöðu frá KGM.',
    card: { title: en ? 'Electric' : 'Rafbílar', rows: evs.map((m) => ({ k: `${m.brand} ${m.name}`, v: (m.price ?? '').replace(/^Frá /, 'frá ') })) },
    chips: en ? ['What is the range of the Torres EVX?'] : ['Hver er drægni Torres EVX?', 'Hvað er ódýrast?'],
  }
}

function cheapest(en: boolean): Answer {
  return {
    tool: en ? 'checked the price list' : 'fletti upp í verðlista',
    reply: en
      ? 'The lowest new-car prices right now are the Torres EVX from 5.890.000 kr. (with the 500.000 kr. Orkusjóður grant) and the Tivoli from 5.990.000 kr. The used-car list starts lower.'
      : 'Lægstu verðin á nýjum bílum núna eru Torres EVX frá 5.890.000 kr. (með 500.000 kr. styrk úr Orkusjóði) og Tivoli frá 5.990.000 kr. Á söluskrá notaðra bíla byrja verðin lægra.',
    chips: en ? ['Show me used cars'] : ['Sýndu mér notaða bíla', 'Hvað kostar Tivoli?'],
  }
}

function testDrive(en: boolean): Answer {
  return {
    reply: en
      ? `Yes. Call the showroom on ${CONTACT.phone} and they will find a time with you. For KGM there is also a test-drive form on kgm.benni.is.`
      : `Já. Hringdu í salinn í síma ${CONTACT.phone} og þau finna tíma með þér. Fyrir KGM er líka reynsluakstursform á kgm.benni.is.`,
    card: { title: en ? 'Test drive' : 'Reynsluakstur', rows: [{ k: en ? 'Showrooms' : 'Sýningarsalir', v: CONTACT.phone }, { k: en ? 'Weekdays' : 'Virkir dagar', v: '09:00–17:00' }, { k: en ? 'Saturdays' : 'Laugardaga', v: '12:00–16:00' }], cta: { label: en ? 'KGM test-drive form' : 'Reynsluakstursform KGM', href: LINKS.kgmTestDrive } },
  }
}

function used(en: boolean): Answer {
  return {
    reply: en
      ? `There were ${USED_COUNT} cars on the used-car list when this page was made, many of them in front of Krókháls 9. The list changes daily, so the live one is on notadir.benni.is. Used cars: ${DEPTS[1].phone}.`
      : `Þegar þessi síða var gerð voru ${USED_COUNT} bílar á söluskrá notaðra bíla. Skráin breytist daglega svo sú rétta er á notadir.benni.is. Notaðir bílar eru í síma ${DEPTS[1].phone}.`,
    card: { title: en ? 'Used cars' : 'Notaðir bílar', rows: [{ k: 'Krókhálsi 9', v: DEPTS[1].phone }, { k: en ? 'Weekdays / Saturdays' : 'Virkir dagar / laugardaga', v: '09–17 / 12–16' }], cta: { label: en ? 'See the list' : 'Skoða söluskrána', href: LINKS.used } },
    chips: en ? ['Do you offer financing?'] : ['Bjóðið þið lán?', 'Takið þið bíl upp í?'],
  }
}

function finance(en: boolean): Answer {
  return {
    reply: en
      ? 'On selected used cars there is an offer of up to 50% non-indexed car loan over 5 years at 4.9% variable interest; the lender is Lykill. Terms depend on credit assessment. For new cars, ask a sales adviser.'
      : 'Á völdum notuðum bílum er í boði allt að 50% óverðtryggt bílalán til 5 ára með 4,9% breytilegum vöxtum. Lánveitandi er Lykill og kjör ráðast af lánshæfi og greiðslumati. Um fjármögnun nýrra bíla er best að spyrja söluráðgjafa.',
    chips: en ? ['Show me used cars'] : ['Sýndu mér notaða bíla'],
  }
}

function service(en: boolean): Answer {
  return {
    reply: en
      ? 'The workshop at Tangarhöfði 8 does all service inspections and general repairs. To book, send a request or call, and the reception finds a time that suits you. KGM owners can use the service form on kgm.benni.is.'
      : 'Þjónustuverkstæðið á Tangarhöfða 8 sér um allar þjónustuskoðanir og almennar viðgerðir. Þú sendir fyrirspurn eða hringir og móttakan finnur tíma sem hentar. Eigendur KGM geta líka notað þjónustuformið á kgm.benni.is.',
    card: { title: en ? 'Service workshop' : 'Þjónustuverkstæði', rows: [{ k: 'Tangarhöfða 8', v: verk.phone }, { k: en ? 'Mon–Thu' : 'Mán.–fim.', v: '07:45–17:00' }, { k: en ? 'Fri' : 'Föstudaga', v: '07:45–16:00' }], cta: { label: en ? 'Send a request' : 'Senda fyrirspurn', href: `mailto:${verk.email}?subject=${encodeURIComponent('Þjónustuverkstæði Bílabúð Benna')}` } },
    chips: en ? ['Tyres?'] : ['Hvar skipti ég um dekk?', 'Varahlutir?'],
  }
}

function parts(en: boolean): Answer {
  return {
    reply: en
      ? `Parts are at Tangarhöfði 8–12, phone ${DEPTS[3].phone}. Besides Porsche, KGM and SsangYong parts, Benni imports parts and accessories for all makes.`
      : `Varahlutirnir eru á Tangarhöfða 8–12, sími ${DEPTS[3].phone}. Auk vara- og fylgihluta í Porsche, KGM og SsangYong flytur Bílabúð Benna inn og selur vara- og fylgihluti í allar tegundir bifreiða.`,
  }
}

function tyres(en: boolean): Answer {
  return {
    reply: en
      ? 'Tyres are Nesdekk, at nine workshops around the country, with online booking on nesdekk.is.'
      : 'Dekkin eru hjá Nesdekkjum, sem eru á níu stöðum um landið og taka við tímabókunum á nesdekk.is.',
    card: { title: 'Nesdekk', rows: NESDEKK.slice(0, 5).map((n) => ({ k: `${n.street}, ${n.town}`, v: n.phone })), cta: { label: en ? 'All nine, and booking' : 'Allir níu staðirnir og tímabókun', href: LINKS.nesdekk } },
  }
}

function warranty(en: boolean): Answer {
  return {
    reply: en
      ? 'KGM warranty: Torres EVX and Musso EV 7 years or 150,000 km, battery 10 years or 1,000,000 km. Rexton 5 years or 150,000 km. Korando, Torres and Tivoli 5 years or 100,000 km. Musso 3 years or 100,000 km. Corrosion 6 years, unlimited mileage.'
      : 'Ábyrgð á KGM: Torres EVX og Musso EV 7 ár eða 150.000 km og rafhlaðan 10 ár eða 1.000.000 km. Rexton 5 ár eða 150.000 km. Korando, Torres og Tivoli 5 ár eða 100.000 km. Musso 3 ár eða 100.000 km. Tæringarábyrgð er 6 ár með ótakmörkuðum akstri.',
    card: { title: en ? 'Full terms' : 'Ábyrgðarskilmálar', rows: [], cta: { label: 'kgm.benni.is', href: LINKS.kgmWarranty } },
  }
}

function mods(en: boolean): Answer {
  return {
    tool: en ? 'checked the price list' : 'fletti upp í verðlista',
    reply: en
      ? 'Benni has modified jeeps since the 1970s. For a new Rexton or Musso, these are the packages (prices apply when the modification is done with the purchase of a new car):'
      : 'Bílabúð Benna hefur breytt jeppum frá upphafi. Fyrir nýjan Rexton eða Musso eru þetta pakkarnir, og verðin miðast við að breyting sé gerð við kaup á nýjum bíl:',
    card: { title: en ? 'Modification packages' : 'Breytingapakkar', rows: MODS.map((m) => ({ k: m.note ? `${m.size} (${m.note.toLowerCase()})` : m.size, v: m.price })), cta: { label: en ? 'More on kgm.benni.is' : 'Nánar á kgm.benni.is', href: LINKS.kgmMods } },
  }
}

function emergency(en: boolean): Answer {
  return {
    reply: en
      ? `Porsche's emergency number is open 24/7: ${CONTACT.emergency}.`
      : `Neyðarnúmer Porsche er opið allan sólarhringinn: ${CONTACT.emergency}.`,
    card: { title: en ? 'Porsche emergency' : 'Neyðarnúmer Porsche', rows: [{ k: '24/7', v: CONTACT.emergency, total: true }], cta: { label: en ? 'Call now' : 'Hringja', href: `tel:${CONTACT.emergencyTel}` } },
  }
}

function story(en: boolean): Answer {
  return {
    reply: en
      ? 'In 1975 Benedikt Eyjólfsson started repairing motorcycles in a green shed at Vagnhöfði 23. The company soon pioneered jeep modifications and became Bílabúð Benna. It has worked with Porsche since 2000, sells KGM, and moved into its headquarters at Krókháls 9 in 2018.'
      : 'Árið 1975 hóf Benedikt Eyjólfsson viðgerðir á mótorhjólum í grænum skúr á Vagnhöfða 23 undir heitinu Vagnhjólið. Fyrirtækið varð fljótlega brautryðjandi í jeppabreytingum og nafnið breyttist í Bílabúð Benna. Samstarfið við Porsche hefur staðið síðan árið 2000 og árið 2018 flutti fyrirtækið í höfuðstöðvarnar á Krókhálsi 9.',
    card: { title: en ? 'The story' : 'Sagan', rows: [], cta: { label: en ? 'Read the full history' : 'Saga Bílabúðar Benna', href: LINKS.saga } },
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
  if (/^(hae|halló|hallo|godan dag|goda kvoldid|hello|hi|hey|saell|sael)\b/.test(q) && q.split(' ').length <= 3)
    return { reply: en ? 'Hello! Ask me about the cars, prices, opening hours or service.' : 'Halló! Spurðu mig um bílana, verðin, opnunartíma eða þjónustuna.', chips: en ? ['When are you open?', 'Which electric cars do you have?'] : CHIPS }

  // Things this page genuinely cannot know. Said plainly, with the phone.
  if (has(q, 'upp i', 'uppitok', 'uppitak', 'verdmat', 'trade in', 'trade-in', 'tradein'))
    return refuse(en, en ? 'I cannot value a car you want to trade in: that needs someone to see it. Call used cars on 590 2035 and they will take it from there.' : 'Ég get ekki metið bíl sem þú vilt setja upp í, það þarf einhver að sjá hann. Hringdu í notaða bíla í síma 590 2035 og þau taka við þér.')
  if (has(q, 'til a lager', 'a lager', 'til afhend', 'afhendingar', 'afhendingart', 'hvenaer kemur', 'bidlist', 'in stock', 'delivery', 'available now', 'eigid thid til', /\ber til\b/, /\beru til\b/))
    return refuse(en, en ? 'I cannot see stock or delivery times from here, and I would rather not guess. The showroom knows exactly: 590 2000.' : 'Ég sé ekki lagerstöðu eða afhendingartíma héðan og vil ekki giska. Salurinn veit það upp á hár: 590 2000.')

  if (has(q, 'neyd', 'biladur', 'bilud', 'drattarbil', 'emergency', 'breakdown', 'vegaadstod', '24 7', 'solarhring'))
    return emergency(en)

  // A named model outranks everything else in the sentence.
  const hit = MODEL_KEYS.find((m) => m.re.test(q))
  if (hit) {
    const porscheHit = ['cayenne-electric', 'macan', 'taycan', '911'].includes(hit.key)
    if (has(q, 'abyrgd', 'warranty')) {
      if (porscheHit) return refuse(en, en ? 'I do not have the Porsche warranty terms on this page. The showroom can tell you exactly: 590 2000.' : 'Ábyrgðarskilmálar Porsche eru ekki á þessari síðu. Salurinn getur sagt þér það nákvæmlega í síma 590 2000.')
      return warranty(en)
    }
    if (has(q, 'thjonust', 'verkstaed', 'smurn', 'vidgerd', 'skodun', 'boka tima', 'panta tima', 'service', 'repair', 'workshop')) return service(en)
    if (has(q, 'varahlut', 'aukahlut', 'parts')) return parts(en)
    if (has(q, 'draegni', 'range', 'hledsl') && ['torres', 'musso-ev'].includes(hit.key)) {
      const m = MODELS.find((x) => x.key === hit.key)!
      return { reply: en ? `${m.name}: ${m.facts[0]}.` : `${m.name}: ${m.facts[0]}.`, chips: en ? ['What does it cost?'] : [`Hvað kostar ${m.name}?`, 'Hvaða ábyrgð fylgir?'] }
    }
    if (has(q, 'reynsluak', 'profa', 'prufu', 'test drive', 'testdrive')) return testDrive(en)
    if (has(q, 'notad', 'notud', 'used')) return used(en)
    if (has(q, 'breyt', 'upphaekk', /\b3[357]\b/)) return porscheHit ? refuse(en) : mods(en)
    return modelCard(hit.key, en)
  }

  if (has(q, 'reynsluak', 'profa bil', 'prufukeyr', 'prufuakst', 'profad', 'test drive', 'testdrive'))
    return testDrive(en)
  if (has(q, 'breyting', 'breyta', 'upphaekk', 'jeppabreyt', /\b3[357] ?tomm/, '33 tomm', '35 tomm', '37 tomm', 'modif', 'lift kit'))
    return mods(en)
  if (has(q, 'abyrgd', 'warranty'))
    return warranty(en)
  if (has(q, 'notad', 'notud', 'soluskra', 'used', 'second hand', 'pre owned'))
    return used(en)
  if (has(q, /\blan\b/, /\blana\b/, /\blanid\b/, 'fjarmogn', 'vext', 'afborg', 'rekstrarleig', 'finance', 'financing', 'loan', 'interest'))
    return finance(en)
  if (has(q, 'dekk', 'nesdekk', 'umfelg', 'dekkjaskipt', 'dekkjageym', 'tyre', 'tire'))
    return tyres(en)
  if (has(q, 'varahlut', 'aukahlut', 'fylgihlut', 'parts', 'accessor'))
    return parts(en)
  if (has(q, 'thjonust', 'verkstaed', 'smurn', 'vidgerd', 'skodun', 'boka tima', 'panta tima', 'service', 'repair', 'workshop', 'maintenance'))
    return service(en)
  if (has(q, 'rafb', 'rafmagn', 'rafknun', 'hledsl', 'draegni', 'electric', ' ev ', /\bev\b/, 'range'))
    return electric(en)
  if (has(q, 'odyr', 'laegst', 'cheap', 'lowest', 'budget'))
    return cheapest(en)
  if (has(q, 'opid', 'opnunart', 'opnar', 'lokad', 'lokar', 'hvenaer er', 'open', 'hours', 'closing', 'close', 'laugardag', 'sunnudag', 'um helg'))
    return hours(en)
  if (has(q, 'hvar', 'heimilisf', 'stadsetn', 'kort', 'rata', 'krokhal', 'tangarhof', 'address', 'where', 'located', 'directions', 'map'))
    return where(en)
  if (has(q, 'simanum', 'simi', 'sima', 'hringi', 'hringja', 'netfang', 'tolvupost', 'email', 'e mail', 'phone', 'call', 'contact', 'hafa samband', 'na i ykkur'))
    return phones(en)
  if (has(q, 'porsche'))
    return brandList('Porsche', en)
  if (has(q, 'kgm', 'ssangyong', 'jepp', 'pallbil', 'pickup', 'suv'))
    return brandList('KGM', en)
  if (has(q, 'saga', 'sogu', 'stofnad', 'stofnud', 'hver er benni', 'benedikt', 'hvad er langt', 'since', 'history', 'founded', 'who is benni', '1975'))
    return story(en)
  if (has(q, 'verd', 'kostar', 'kosta', 'price', 'cost', 'hvad kostar'))
    return { reply: en ? 'Which car? Here are both ranges:' : 'Hvaða bíl ertu að spá í? Hér eru bæði merkin:', chips: en ? ['Porsche prices', 'KGM prices'] : ['Porsche verð', 'KGM verð'] }

  return refuse(en)
}
