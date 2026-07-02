/**
 * Háafell Geitfjársetur — "Síðasta hjörðin" (The Last Herd).
 *
 * Bilingual content store (IS/EN). The page reads `lang` state and pulls the
 * matching string. Verified facts only (see brief); SAMPLE product prices and
 * an ILLUSTRATIVE lineage timeline are labelled as such in the UI.
 *
 * Verified Unsplash ids (curl -sI 200 + visually confirmed subject):
 *   HERO_ID  photo-1524024973431-2ad916746881  white goat, green pasture
 *   KID_ID   photo-1533318087102-b3ad366ed041  goat kid
 *   FARM_ID  photo-1500595046743-cd271d694d30  golden-hour livestock (warmth)
 *   LAND_ID  photo-1551446591-142875a901a1     snowy mountains at dusk (land)
 * Atmospheric only — never labelled as Háafell's own specific animals.
 */

export type Lang = 'is' | 'en'

/** A pair of strings keyed by language. */
export type LocPair = Record<Lang, string>

export const HERO_ID = 'photo-1524024973431-2ad916746881'
export const KID_ID = 'photo-1533318087102-b3ad366ed041'
export const FARM_ID = 'photo-1500595046743-cd271d694d30'
export const LAND_ID = 'photo-1551446591-142875a901a1'

/* ── Real contact / visit facts (verified) ─────────────────────────── */

export const FARM = {
  name: 'Háafell Geitfjársetur',
  addressLines: ['Háafell, Hvítársíða', '320 Reykholt'],
  phoneHuman: '+354 790 1548',
  phoneTel: '+3547901548',
  email: 'geitur@geitur.is',
  driveFromReykjavik: { is: '~1,5 klst frá Reykjavík', en: '~1.5 hrs from Reykjavík' },
  founded: 1989,
  goatsSince: 2005,
  owners: 'Jóhanna B. Þorvaldsdóttir & Þorbjörn Oddsson',
} as const

/* ── Top-level UI strings ──────────────────────────────────────────── */

export const UI = {
  langName: { is: 'Íslenska', en: 'English' } satisfies LocPair,
  toggleLabel: { is: 'Velja tungumál', en: 'Choose language' } satisfies LocPair,
  skipToContent: { is: 'Fara í meginmál', en: 'Skip to content' } satisfies LocPair,
  nav: {
    story: { is: 'Sagan', en: 'The story' },
    farm: { is: 'Bærinn', en: 'The farm' },
    visit: { is: 'Heimsókn', en: 'Visit' },
    shop: { is: 'Verslun', en: 'Shop' },
  } satisfies Record<string, LocPair>,
  planVisit: { is: 'Skipuleggja heimsókn', en: 'Plan your visit' } satisfies LocPair,
}

/* ── Hero ──────────────────────────────────────────────────────────── */

export const HERO = {
  eyebrow: { is: 'Eina geitfjársetrið á Íslandi', en: 'The only goat centre in Iceland' } satisfies LocPair,
  // h1 — the name stays in Icelandic; the line under it is bilingual.
  tagline: {
    is: 'Þar sem vinalegar geitur taka vel á móti þér.',
    en: 'Where friendly goats welcome you.',
  } satisfies LocPair,
  lede: {
    is: 'Hér býr íslenska geitin, fornn landnámsstofn sem stóð frammi fyrir útrýmingu. Á Háafelli höfum við haldið hjörðinni lifandi og bjóðum þér að hitta hana.',
    en: 'Home of the Icelandic goat, an ancient settlement-era breed that came close to vanishing. At Háafell we have kept the herd alive, and we would love you to meet it.',
  } satisfies LocPair,
  imageAlt: { is: 'Geit á grænu túni', en: 'A goat standing in green pasture' } satisfies LocPair,
}

/* ── The conservation story + lineage line ─────────────────────────── */

export const STORY = {
  kicker: { is: 'Verndunarsagan', en: 'The conservation story' } satisfies LocPair,
  heading: {
    is: 'Ellefu aldir á einum þræði.',
    en: 'Eleven centuries on a single thread.',
  } satisfies LocPair,
  paras: [
    {
      is: 'Íslenska geitin kom með landnámsmönnum fyrir um 1.100 árum og hefur lifað hér einangruð allar götur síðan. Hún er sérstök í heiminum, lítil, harðger og þúsund ára gömul.',
      en: 'The Icelandic goat arrived with the settlers some 1,100 years ago and has lived here in isolation ever since. It is a breed found nowhere else: small, hardy and a thousand years old.',
    },
    {
      is: 'Á 20. öld fækkaði geitunum hættulega mikið og stofninn komst nálægt útrýmingu, niður í örfá hundruð dýr. Heil ætt sem lifað hafði af aldirnar stóð skyndilega tæpt.',
      en: 'In the 20th century numbers fell dangerously low and the breed came close to extinction, down to only a few hundred animals. A line that had survived the centuries was suddenly hanging by a thread.',
    },
    {
      is: 'Háafell hefur verið lykilbýli í björgun stofnsins. Með ræktun, þrautseigju og umhyggju hefur hjörðin vaxið á ný. Sagan er ekki búin, en hún stefnir upp á við.',
      en: 'Háafell has been central to saving the breed. Through careful breeding, persistence and care the herd has grown again. The story is not over, but it is rising.',
    },
  ] satisfies LocPair[],
  // Illustrative timeline points for the lineage line (NOT exact figures).
  timelineLabel: {
    is: 'Skýringarmynd, ekki nákvæmar tölur',
    en: 'Illustrative timeline, not exact figures',
  } satisfies LocPair,
  // axis hint shown vertically on the chart
  axisLabel: { is: 'Stofnstærð', en: 'Population' } satisfies LocPair,
  axisLow: { is: 'fátt', en: 'few' } satisfies LocPair,
  axisHigh: { is: 'margt', en: 'many' } satisfies LocPair,
  // the shaded near-extinction band
  dangerLabel: { is: 'Nær útrýmingu', en: 'Near extinction' } satisfies LocPair,
  // floating caption that fades in over the trough as the line is drawn
  troughNote: {
    is: 'Niður í örfá hundruð dýr.',
    en: 'Down to a few hundred animals.',
  } satisfies LocPair,
  riseNote: {
    is: 'Og þaðan, hægt og rólega, upp á við.',
    en: 'And from there, slowly, back up.',
  } satisfies LocPair,
  marks: [
    { year: '~870', t: { is: 'Landnám', en: 'Settlement' } },
    { year: '1700', t: { is: 'Aldir af jafnvægi', en: 'Centuries steady' } },
    { year: '1960', t: { is: 'Nær útrýmingu', en: 'Near extinction' } },
    { year: '1989', t: { is: 'Háafell hefst', en: 'Háafell begins' } },
    { year: '2026', t: { is: 'Hjörðin vex', en: 'The herd grows' } },
  ] satisfies { year: string; t: LocPair }[],
}

/* ── Meet the farm ─────────────────────────────────────────────────── */

export const FARM_SECTION = {
  kicker: { is: 'Bærinn', en: 'The farm' } satisfies LocPair,
  heading: { is: 'Fólkið á bak við hjörðina.', en: 'The people behind the herd.' } satisfies LocPair,
  body: [
    {
      is: 'Háafell hefur verið heimili okkar síðan 1989. Frá 2005 hafa geiturnar verið hjarta búsins, og við Jóhanna og Þorbjörn höfum helgað okkur þeim alla daga ársins.',
      en: 'Háafell has been our home since 1989. Since 2005 the goats have been the heart of the farm, and we, Jóhanna and Þorbjörn, have devoted ourselves to them every day of the year.',
    },
    {
      is: 'Þetta er ekki dýragarður heldur lifandi býli í Hvítársíðu. Þegar þú kemur hittir þú forvitnar, vinalegar geitur sem þekkja fólk og taka vel á móti gestum.',
      en: 'This is not a zoo but a working farm in Hvítársíða. When you come you will meet curious, friendly goats that know people and greet visitors warmly.',
    },
  ] satisfies LocPair[],
  ownersLabel: { is: 'Ábúendur', en: 'Farmers' } satisfies LocPair,
  imageAlt: { is: 'Geitarkið á búi', en: 'A goat kid on a farm' } satisfies LocPair,
  imageAlt2: { is: 'Búfénaður í kvöldsól', en: 'Farm animals in evening light' } satisfies LocPair,
  stats: [
    { v: '1989', t: { is: 'Bærinn stofnaður', en: 'Farm founded' } },
    { v: '2005', t: { is: 'Aðallega geitur', en: 'Mainly goats since' } },
    { v: '1', t: { is: 'Setur sinnar tegundar', en: 'Of its kind in Iceland' } },
  ] satisfies { v: string; t: LocPair }[],
}

/* ── Visit planner ─────────────────────────────────────────────────── */

export const VISIT = {
  kicker: { is: 'Heimsókn', en: 'Plan your visit' } satisfies LocPair,
  heading: { is: 'Komdu og hittu hjörðina.', en: 'Come and meet the herd.' } satisfies LocPair,
  intro: {
    is: 'Allt sem þú þarft til að rata til okkar og verja eftirminnilegri stund með geitunum.',
    en: 'Everything you need to find us and spend a memorable afternoon with the goats.',
  } satisfies LocPair,
  hoursTitle: { is: 'Opnunartími', en: 'Opening hours' } satisfies LocPair,
  hoursMain: {
    is: '1. júní til 31. ágúst',
    en: '1 June to 31 August',
  } satisfies LocPair,
  hoursTime: { is: 'Kl. 11 til 18, alla daga', en: '11:00 to 18:00, daily' } satisfies LocPair,
  hoursNote: {
    is: 'Aðrir tímar eftir samkomulagi. Hafðu samband.',
    en: 'Other times by arrangement. Get in touch.',
  } satisfies LocPair,
  priceTitle: { is: 'Aðgangur', en: 'Admission' } satisfies LocPair,
  priceFoot: {
    is: 'Greitt á staðnum. Aðgangur styður verndun stofnsins.',
    en: 'Paid on site. Admission supports the breed’s conservation.',
  } satisfies LocPair,
  prices: [
    { who: { is: 'Fullorðnir', en: 'Adults' }, amount: '1.800 kr' },
    { who: { is: 'Börn 7 til 17 ára', en: 'Children 7 to 17' }, amount: '950 kr' },
  ] satisfies { who: LocPair; amount: string }[],
  getThereTitle: { is: 'Hvernig á að komast', en: 'How to get there' } satisfies LocPair,
  getThereBody: {
    is: 'Háafell er í Hvítársíðu, um 1,5 klst akstur frá Reykjavík um Borgarnes og Reykholt. Síðasti spölurinn er sveitavegur, taktu því rólega.',
    en: 'Háafell is in Hvítársíða, about a 1.5 hour drive from Reykjavík via Borgarnes and Reykholt. The last stretch is a country road, so take it gently.',
  } satisfies LocPair,
  // labels for the bespoke route map
  routeFrom: { is: 'Reykjavík', en: 'Reykjavík' } satisfies LocPair,
  routeVia: { is: 'Borgarnes · Reykholt', en: 'Borgarnes · Reykholt' } satisfies LocPair,
  openInMaps: { is: 'Opna í kortum', en: 'Open in maps' } satisfies LocPair,
  callLabel: { is: 'Hringja', en: 'Call' } satisfies LocPair,
  emailLabel: { is: 'Senda póst', en: 'Email' } satisfies LocPair,
  mapNote: { is: 'Staðsetning til skýringar', en: 'Approximate location' } satisfies LocPair,
}

/* ── Booking (request form + live open status) ─────────────────────── */

/** Numeric admission prices for the live total (same figures as VISIT.prices). */
export const BOOKING_PRICES = { adult: 1800, child: 950 } as const

export const BOOKING = {
  title: { is: 'Bóka heimsókn', en: 'Book a visit' } satisfies LocPair,
  intro: {
    is: 'Veldu dag og hópstærð og sendu okkur fyrirspurn. Við svörum persónulega og staðfestum.',
    en: 'Pick a day and your party size and send us a request. We reply personally to confirm.',
  } satisfies LocPair,
  dateLabel: { is: 'Dagsetning', en: 'Date' } satisfies LocPair,
  adultsLabel: { is: 'Fullorðnir', en: 'Adults' } satisfies LocPair,
  childrenLabel: { is: 'Börn 7 til 17 ára', en: 'Children 7 to 17' } satisfies LocPair,
  nameLabel: { is: 'Nafn', en: 'Name' } satisfies LocPair,
  contactLabel: { is: 'Sími eða netfang', en: 'Phone or email' } satisfies LocPair,
  decrease: { is: 'Fækka', en: 'Fewer' } satisfies LocPair,
  increase: { is: 'Fjölga', en: 'More' } satisfies LocPair,
  summaryTitle: { is: 'Heimsóknin þín', en: 'Your visit' } satisfies LocPair,
  totalLabel: { is: 'Áætlað verð', en: 'Estimated total' } satisfies LocPair,
  totalNote: {
    is: 'Greitt á staðnum, engin fyrirframgreiðsla.',
    en: 'Paid on site, no prepayment.',
  } satisfies LocPair,
  submit: { is: 'Senda bókunarfyrirspurn', en: 'Send booking request' } satisfies LocPair,
  mailNote: {
    is: 'Fyrirspurnin opnast í póstforritinu þínu og við staðfestum um hæl.',
    en: 'The request opens in your email app and we confirm right away.',
  } satisfies LocPair,
  altContact: { is: 'Frekar að tala við okkur?', en: 'Rather talk to us?' } satisfies LocPair,
  subject: { is: 'Bókunarfyrirspurn, Háafell', en: 'Booking request, Háafell' } satisfies LocPair,
  mailLines: {
    date: { is: 'Dagsetning', en: 'Date' },
    adults: { is: 'Fullorðnir', en: 'Adults' },
    children: { is: 'Börn 7 til 17 ára', en: 'Children 7 to 17' },
    name: { is: 'Nafn', en: 'Name' },
    contact: { is: 'Sími eða netfang', en: 'Phone or email' },
    total: { is: 'Áætlað verð, greitt á staðnum', en: 'Estimated total, paid on site' },
  } satisfies Record<string, LocPair>,
  // Live open-status chip (summer season 1 June – 31 Aug, 11:00–18:00 daily)
  status: {
    open: { is: 'Opið núna · til 18:00', en: 'Open now · until 18:00' },
    opensToday: { is: 'Opnar kl. 11 í dag', en: 'Opens at 11:00 today' },
    opensTomorrow: { is: 'Opnar kl. 11 á morgun', en: 'Opens at 11:00 tomorrow' },
    offSeason: { is: 'Utan sumaropnunar · eftir samkomulagi', en: 'Off-season · visits by arrangement' },
  } satisfies Record<string, LocPair>,
}

/* ── Shop ──────────────────────────────────────────────────────────── */

export interface Product {
  /** Real Icelandic product name. */
  name: string
  /** EN gloss of what it is. */
  gloss: LocPair
  /** SAMPLE price. */
  price: string
  /** Short tactile description. */
  desc: LocPair
  /** Card ground tint the page renders (typographic cards, no fake product photos). */
  tint: 'meadow' | 'straw' | 'ceramic' | 'spruce'
}

export const SHOP = {
  kicker: { is: 'Verslun', en: 'Farm shop' } satisfies LocPair,
  heading: { is: 'Úr hjörðinni, heim til þín.', en: 'From the herd, to your table.' } satisfies LocPair,
  mission: {
    is: 'Hver kaup styðja verndun stofnsins. Það sem þú tekur með þér heldur íslensku geitinni á lífi.',
    en: 'Every purchase supports the breed. What you take home helps keep the Icelandic goat alive.',
  } satisfies LocPair,
  // small ribbon shown on each product card
  supportsTag: { is: 'Styður verndun', en: 'Supports conservation' } satisfies LocPair,
  priceNote: { is: 'Verð eru sýnishorn', en: 'Prices are samples' } satisfies LocPair,
  products: [
    {
      name: 'Huðnuhnoss',
      gloss: { is: 'Geitaostur', en: 'Goat cheese' },
      price: '2.400 kr',
      desc: {
        is: 'Mjúkur, rjómakenndur geitaostur úr mjólk hjarðarinnar.',
        en: 'A soft, creamy goat cheese made from the herd’s own milk.',
      },
      tint: 'meadow',
    },
    {
      name: 'Geitabreki',
      gloss: { is: 'Geitaostur', en: 'Goat cheese' },
      price: '2.600 kr',
      desc: {
        is: 'Þéttari ostur með karakter, þroskaður á búinu.',
        en: 'A firmer cheese with character, aged here on the farm.',
      },
      tint: 'straw',
    },
    {
      name: 'Kiðaskinn sápur',
      gloss: { is: 'Sápa úr geitamjólk', en: 'Goat-milk soap' },
      price: '1.200 kr',
      desc: {
        is: 'Mild handsápa úr geitamjólk, góð fyrir viðkvæma húð.',
        en: 'A mild goat-milk soap, kind to sensitive skin.',
      },
      tint: 'ceramic',
    },
    {
      name: 'Geitapylsur',
      gloss: { is: 'Geitapylsa', en: 'Goat sausage' },
      price: '1.900 kr',
      desc: {
        is: 'Bragðmiklar pylsur úr geitakjöti, gerðar í höndunum.',
        en: 'Rich, hand-made sausages of goat meat.',
      },
      tint: 'spruce',
    },
  ] satisfies Product[],
  orderCta: { is: 'Senda pöntunarfyrirspurn', en: 'Send an order enquiry' } satisfies LocPair,
  orderNote: {
    is: 'Við svörum hverri fyrirspurn persónulega og staðfestum verð og afhendingu.',
    en: 'We reply to every enquiry personally and confirm price and pickup.',
  } satisfies LocPair,
  // subject line for the order enquiry mailto
  orderSubject: { is: 'Pöntunarfyrirspurn, Háafell', en: 'Order enquiry, Háafell' } satisfies LocPair,
}

/* ── Closing trust band ────────────────────────────────────────────── */

export const TRUST = {
  line: {
    is: 'Eina býlið sinnar tegundar á Íslandi. Síðan 1989.',
    en: 'The only farm of its kind in Iceland. Since 1989.',
  } satisfies LocPair,
  sub: {
    is: 'Komdu við, heilsaðu upp á hjörðina og taktu þátt í að halda henni lifandi.',
    en: 'Stop by, say hello to the herd, and help keep it alive.',
  } satisfies LocPair,
}
