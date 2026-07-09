/**
 * The Seiðkarl's tongue — a hand-authored Icelandic response engine.
 *
 * PROTOTYPE NOTE: this runs entirely client-side (no backend), so it reads the
 * visitor's words, matches an INTENT, and answers in character from an authored
 * library. It is deliberately deep enough to feel alive for a demo. In
 * production this same character is backed by a real language model (the
 * client's AI-receptionist product) so he can answer anything.
 *
 * HONESTY: the Seiðkarl is a folk-herbalist storyteller, never a doctor. He
 * speaks of ritual, rest and balance — never cures or diagnoses — and says so
 * himself. Every reply resolves to a real, buyable product.
 */
import { getProduct } from './data'
import type { Product } from './data'

/** Strip Icelandic diacritics so typed input matches loosely. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ý/g, 'y')
    .replace(/þ/g, 'th')
    .replace(/æ/g, 'ae')
    .replace(/ö/g, 'o')
    .replace(/ð/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export interface Intent {
  id: string
  /** Normalized substrings that signal this need. */
  keys: string[]
  productId: string
  /** Authored replies, {vara} is replaced with the product name. */
  replies: string[]
}

/* The keys are stored already-normalized (no accents) so matching is a simple
   substring test against the normalized input. */
const INTENTS: Intent[] = [
  {
    id: 'svefn',
    keys: ['svefn', 'sofa', 'sef ekki', 'sef illa', 'andvaka', 'vaka', 'sofna', 'naettur', 'threyttur a morgnana', 'vakna', 'sofuleysi'],
    productId: 'svefngaldur',
    replies: [
      'Svefninn flýr marga um þessar mundir. Þegar hugurinn neitar að þagna á kvöldin er gott að eiga sér lítinn sið fyrir háttinn. Ég rétti þér {vara} — þú lætur teið standa í heitu vatni meðan þú leggur daginn frá þér. Enginn galdur í raun, heldur gömul ró í bolla.',
      'Löng er íslensk nótt og ekki alltaf væn. Fáðu þér {vara} klukkutíma fyrir svefninn, slökktu á skjánum og leyfðu bollanum að kólna í höndunum. Líkaminn man hvernig á að sofna, hann þarf bara merki. Ég er enginn læknir, en gömul jurt og góð rútína gera sitt.',
      'Þreyttur en glaðvakandi, ekki satt? Það þekkja allir. {vara} er mild kvöldblanda úr galdra-línunni okkar — hún kemur ekki í stað hvíldar en hún býr til stundina þar sem þú leyfir þér hana.',
    ],
  },
  {
    id: 'draumar',
    keys: ['draum', 'draema', 'martrod', 'martraed', 'dreymir', 'draumfarir'],
    productId: 'draumagaldur',
    replies: [
      'Svo þig fýsir að muna draumana þína. Forfeður okkar lásu í þá og margir sofa enn með blað við rúmið. {vara} er kvöldblanda fyrir rólega nótt — bruggaðu þér bolla, andaðu djúpt og leyfðu huganum að reika. Hvað hann sýnir þér er þitt.',
      'Draumar eru eina ferðalagið sem enginn getur tekið af þér. {vara} er hugsuð fyrir kyrra nótt; ég lofa engu um álfa og forspár, en stundin ein og sér er þess virði.',
    ],
  },
  {
    id: 'ro',
    keys: ['kvidi', 'kvidin', 'stress', 'streita', 'ahyggjur', 'ro', 'slokun', 'slaka', 'spenna', 'spenntur', 'oroi', 'nidur', 'hugurinn a fullu', 'of mikid ad gera', 'hradur hugur'],
    productId: 'hjartagaldur',
    replies: [
      'Hugurinn á fullri ferð og hjartað með. Ég þekki það. Ég rétti þér {vara} — daglegt te sem margir taka sér stund með þegar allt er á iði. Þú sest, heldur um bollann og andar. Ekki lækning, heldur andrými.',
      'Streitan safnast hljóðlega, dag frá degi, þar til maður tekur ekki lengur eftir henni. {vara} er lítill sið til að staldra við. Þrír andardrættir og einn bolli, kvölds og morgna. Byrjaðu þar.',
      '{vara} heitir eftir því sem hún á að minna þig á — að hægja á. Ég er enginn læknir og ef þungt er á þér til langframa skaltu tala við einn slíkan. En stundin með bollanum, hana áttu alltaf.',
    ],
  },
  {
    id: 'kvenheilsa',
    keys: ['kona', 'konur', 'kven', 'tur', 'tidir', 'blaedingar', 'hormon', 'tidahvorf', 'kvenheilsa', 'legid'],
    productId: 'kvennagaldur',
    replies: [
      'Fyrir þetta á ég sérstaka blöndu. {vara} er sett saman með konur í huga — netla, hafrastrá og hindberjalauf, jarðbundið te til daglegrar notkunar. Gömul lauf sem konur hafa bruggað lengur en nokkur man.',
      '{vara} er mild og nærandi, úr netlu, hafrastrái og hindberjalaufi. Hún læknar ekkert, en hún er góður daglegur siður. Einn bolli, heitt vatn, fimm til tíu mínútur.',
    ],
  },
  {
    id: 'jafnvaegi',
    keys: ['melting', 'magi', 'maginn', 'jafnvaegi', 'thembdur', 'meltingu', 'garnir', 'uppthemba'],
    productId: 'blodrugaldur',
    replies: [
      'Þegar innra jafnvægið riðlast finnur maður það alls staðar. {vara} er jurtablanda til daglegrar notkunar — bolli eftir mat, hægt og rólega. Náttúran vinnur best þegar henni er ekki flýtt.',
      'Maginn talar sínu máli og það borgar sig að hlusta. Prófaðu {vara} sem daglegan sið og gefðu honum viku eða tvær. Ég er enginn læknir — ef eitthvað er verulega að, leitaðu til slíks.',
    ],
  },
  {
    id: 'orka',
    keys: ['orka', 'orku', 'threyta', 'threyttur', 'threklaus', 'slen', 'urvinda', 'utkeyrdur', 'orkulaus', 'buinn a thvi', 'engin orka', 'lufi'],
    productId: 'cordyceps',
    replies: [
      'Þreytan sem sefur ekki af sér — hana þekkja margir í skammdeginu. Ég rétti þér {vara}, dropa úr sveppnum sem fjallgöngufólk hefur lengi haft í hávegum. Nokkrir dropar í morgundrykkinn og þú finnur þinn eigin takt. Engin kraftaverk, bara náttúra.',
      'Þegar orkan þrýtur er auðvelt að grípa í sykur og kaffi, en það endist stutt. {vara} er hægari leið — sveppatinktúra í drykkinn á morgnana. Gefðu henni tíma, líkaminn kann að þiggja hana.',
    ],
  },
  {
    id: 'einbeiting',
    keys: ['einbeiting', 'einbeita', 'fokus', 'heilathoka', 'minni', 'gleymi', 'utan vid mig', 'utan vid sig', 'hausinn i thoku', 'skyr hugsun', 'heili'],
    productId: 'lionsmane',
    replies: [
      'Hugurinn í þoku, ekki satt? {vara} er tinktúra úr sveppnum sem sumir kalla „makka minnisins“ — dropar í teið eða kaffið á morgnana. Ég lofa engu, en margir sverja fyrir skýrari daga.',
      'Skýr hugsun er dýrmæt og hún kemur og fer. {vara} úr Lions Mane sveppnum er það sem ég rétti fólki sem vill styðja við hana. Nokkrir dropar, daglega, og þolinmæði.',
    ],
  },
  {
    id: 'onaemi',
    keys: ['onaemi', 'kvef', 'kvef', 'halsbolga', 'veikur', 'veik', 'pest', 'flensa', 'vorn', 'hosti', 'kvefadur', 'ad verda veikur', 'verjast'],
    productId: 'propolis',
    replies: [
      'Þegar pestir ganga er gott að styðja við sig. Ég rétti þér {vara} — dropar beint úr býflugnabúinu, gömul vörn sem býflugurnar sjálfar treysta á. Nokkrir dropar í heitt vatn með hunangi. Ég er enginn læknir, en náttúran á sín ráð.',
      'Fyrstu merkin um kvef eru merki um að hægja á. {vara} úr búinu, skeið af hráu hunangi og heitt vatn — gamalt húsráð sem gerir engum illt. Hvíldu þig með.',
    ],
  },
  {
    id: 'hud',
    keys: ['hud', 'thurr hud', 'exem', 'thurrk', 'hudin', 'klaedi', 'utbrot', 'thurra hud'],
    productId: 'cbd-oil',
    replies: [
      'Íslenskur vetur fer illa með húðina, þar er engum blöðum um að fletta. Ég rétti þér {vara} — húðolíu sem þú berð á þar sem þarf, kvölds og morgna. Mild og einföld, eins og húðin kann best að meta.',
      '{vara} er það sem ég rétti fólki með þurra, þreytta húð. Nokkrir dropar, nudda varlega inn. Engin fyrirheit, bara góð olía og góð rútína.',
    ],
  },
  {
    id: 'har',
    keys: ['har', 'harid', 'harvoxtur', 'harlos', 'hargaedi', 'thunnt har', 'flasa'],
    productId: 'batana',
    replies: [
      'Fyrir hárið á ég {vara} — næringu sem hefur ferðast langt að og margir sverja fyrir. Berðu í, gefðu því tíma og reglu. Hárið vex á sínum hraða, ekki okkar.',
    ],
  },
  {
    id: 'vetur',
    keys: ['d vitamin', 'vitamin', 'skammdegi', 'sol', 'solarleysi', 'myrkur', 'vetur', 'depurd', 'daufur', 'thungt skap', 'skap', 'nott og myrkur'],
    productId: 'd3k2',
    replies: [
      'Sólin lætur á sér standa marga mánuði hér og það finna allir. {vara} er D-vítamín með K2, hugsað einmitt fyrir íslenska skammdegið. Fáir dropar á dag þegar sólin gefur ekki sitt. Ég er enginn læknir, en þetta veit hver Íslendingur.',
      'Myrkrið er langt og það tekur sinn toll. {vara} kemur ekki í stað sólar en það styður við þig meðan hún er í fríi. Daglega, allan veturinn.',
    ],
  },
  {
    id: 'snarl',
    keys: ['snarl', 'nammi', 'saetindi', 'saett', 'hollt snarl', 'millimal', 'ad narta', 'ber', 'avextir', 'skyrid'],
    productId: 'blaber',
    replies: [
      'Löngun í eitthvað sætt en gott? Ég rétti þér {vara} — ber sem eru þurrkuð við frost svo bragðið og liturinn haldast. Nartaðu beint úr pokanum eða stráðu yfir skyrið. Náttúrunnar eigin nammi.',
      '{vara} eru það sem ég gríp sjálfur í milli mála. Frostþurrkuð, engu bætt við, bara berin sjálf. Prófaðu út á morgunhafragrautinn.',
    ],
  },
  {
    id: 'gjof',
    keys: ['gjof', 'gjafir', 'afmaeli', 'jol', 'gefa', 'pakki', 'handa vini', 'handa mommu'],
    productId: 'villibloma',
    replies: [
      'Gjöf úr náttúrunni klikkar sjaldan. Ég rétti þér {vara} — krukku af hráu, óunnu hunangi. Fátt er persónulegra en að gefa eitthvað sem jörðin sjálf bjó til. Ég get líka bent þér á gjafaöskjurnar okkar ef þig vantar meira.',
    ],
  },
  {
    id: 'almenn',
    keys: ['heilsa', 'almennt', 'byrja', 'nytt', 'veit ekki', 'hvad maelir thu med', 'eitthvad gott', 'hvar byrja eg', 'bara skoda'],
    productId: 'villibloma',
    replies: [
      'Ef þú veist ekki hvar á að byrja, þá byrjaðu á hunangi. {vara} er hjartað í búðinni — hrátt, óunnið, skeið á dag út í teið eða beint af skeiðinni. Þaðan getum við fundið meira, segðu mér bara meira um þig.',
      'Góð heilsa er ekki eitt undralyf heldur litlir siðir, dag frá degi. Byrjaðu á {vara} og segðu mér svo hvað þig vantar helst — betri svefn, meiri orku, eða bara ró.',
    ],
  },
]

const FALLBACKS = [
  'Ég heyri þig, en náttúran talar hægt og ég vil skilja þig rétt. Segðu mér með öðrum orðum — snýst þetta um svefn, orku, ró, meltingu eða húð? Eða veldu eitt af orðunum hér að neðan.',
  'Hmm. Segðu mér aðeins meira. Er þetta líkaminn, hugurinn eða svefninn? Þá veit ég betur hvað ég á að rétta þér.',
  'Þolinmæði, vinur — ég er gamall og orðin þín ný. Reyndu aftur og nefndu hvað þjakar þig helst: svefn, streitu, orku, kvef, húð eða meltingu.',
]

export interface Reply {
  text: string
  product?: Product
}

/** Match the visitor's words to an intent and compose an in-character reply.
 *  `seed` (a turn counter) varies the wording without needing Math.random. */
export function ask(input: string, seed: number): Reply {
  const norm = normalize(input)
  let best: Intent | undefined
  let bestScore = 0
  for (const intent of INTENTS) {
    let score = 0
    for (const key of intent.keys) {
      if (norm.includes(key)) score += key.length // longer, more specific keys win
    }
    if (score > bestScore) {
      bestScore = score
      best = intent
    }
  }

  if (!best) {
    return { text: FALLBACKS[seed % FALLBACKS.length] }
  }

  const product = getProduct(best.productId)
  const template = best.replies[seed % best.replies.length]
  const text = template.replace(/\{vara\}/g, product ? product.name : 'þessa vöru')
  return { text, product }
}

/** The Seiðkarl's opening line, coloured by the real time of day. */
export function greeting(hour: number): string {
  if (hour >= 5 && hour < 11) {
    return 'Sæll og góðan daginn. Kertið er nýkveikt og ketillinn að hitna. Segðu mér, hvað liggur á þér í morgunsárið? Ég sé hvað náttúran á handa þér.'
  }
  if (hour >= 11 && hour < 17) {
    return 'Sæll, vertu velkominn inn úr birtunni. Seztu andartak. Segðu mér hvað þig vantar — betri svefn, meiri orku, eða bara stund af ró — og ég skal finna rétta jurt.'
  }
  if (hour >= 17 && hour < 23) {
    return 'Gott kvöld. Kertið logar og ketillinn er heitur. Seztu hjá mér og segðu mér hvað liggur á þér, þá sé ég hvað náttúran á til handa þér.'
  }
  return 'Þú ert á ferli seint, eins og ég. Nóttin er löng á Íslandi. Seztu í skímuna og segðu mér hvað heldur fyrir þér vöku, þá finnum við eitthvað gott.'
}

/** Suggested opening needs, shown as tappable chips. */
export const SUGGESTIONS: { label: string; send: string }[] = [
  { label: 'Ég sef illa', send: 'Ég sef illa' },
  { label: 'Ég er kvíðin', send: 'Ég er með kvíða og streitu' },
  { label: 'Mig vantar orku', send: 'Mig vantar meiri orku, ég er alltaf þreytt' },
  { label: 'Einbeiting', send: 'Ég á erfitt með einbeitingu' },
  { label: 'Að verjast kvefi', send: 'Ég vil verjast kvefi' },
  { label: 'Þurr húð', send: 'Ég er með þurra húð' },
  { label: 'Skammdegið', send: 'Skammdegið fer illa í mig' },
  { label: 'Hvar byrja ég?', send: 'Ég veit ekki hvar ég á að byrja' },
]
