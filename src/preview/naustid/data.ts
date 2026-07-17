/* ──────────────────────────────────────────────────────────────────────────
 * Naustið — seafood restaurant, Ásgarðsvegur 1, 640 Húsavík
 * Concept: "Gula húsið við höfnina" — the page is the walk every guest
 * already takes across the harbour toward the yellow house Sel, ending at
 * the red door with the signature soup on the table.
 *
 * EVERY fact below is sourced from the research brief (ja.is, finna.is,
 * Framsýn 2016, mbl.is 2022 via search, visithusavik.is, Restaurant Guru,
 * Sluurpy, alberteldar.is, icelandicfood.is). Nothing is invented:
 *  - Hours 11:30–21:30 daily (ja.is + Restaurant Guru + Sluurpy agree)
 *  - Dinner 4,000–6,000 ISK per person (two independent source chains)
 *  - No per-dish prices exist publicly, so none are printed
 *  - Review quotes are real, relayed via aggregators (disclosed in footer)
 *  - Owners are referred to as "tvær mágkonur" (no legal names printed)
 * Own photos (exterior/soup/salmon/interior) are the restaurant's real
 * submitted photography from Visit Húsavík's listing CDN, served locally.
 * ────────────────────────────────────────────────────────────────────────── */

export const PHONE = '464 1520'
export const PHONE_HREF = 'tel:+3544641520'
export const EMAIL = 'naustidfood@gmail.com'
export const ADDRESS = 'Ásgarðsvegur 1, 640 Húsavík'
export const HOURS_LABEL = '11:30–21:30 alla daga'
export const OPEN_MIN = 11 * 60 + 30 // 11:30
export const CLOSE_MIN = 21 * 60 + 30 // 21:30
export const MAPS_URL = 'https://maps.google.com/?q=Naustið+Ásgarðsvegur+1+640+Húsavík'

const BASE = import.meta.env.BASE_URL

/* Own real photos — copied into public/naustid/ (Visit Húsavík listing CDN,
 * the restaurant's own submitted photography). */
export const IMG = {
  exterior: BASE + 'naustid/exterior-2000.jpg',
  exteriorSrcSet: `${BASE}naustid/exterior-1200.jpg 1200w, ${BASE}naustid/exterior-2000.jpg 2000w`,
  soup: BASE + 'naustid/fishsoup.jpg',
  salmon: BASE + 'naustid/salmon.jpg',
  interior: BASE + 'naustid/inside2.jpg',
} as const

/* Unsplash fill (all verified standard-license, no premium/plus IDs). */
export const UIMG = {
  dockDusk: 'photo-1666211146876-1396582a8349', // blue-hour harbour house + sailboat (atmosphere, not Húsavík)
  harbourTown: 'photo-1575660976250-f90f7e2ed9c2', // Icelandic harbour town, boats + colorful houses (Hafnarfjörður)
  windowGlow: 'photo-1769766407835-5c7f329ea6f1', // single glowing amber window at night
  tableNote: 'photo-1770902971693-8d638e97a496', // restaurant table setting, warm bokeh
  rope: 'photo-1757548710279-c353215713ad', // coiled ship's rope macro
  puffin: 'photo-1476468875881-7981a47c4eda', // puffin on a cliff edge
} as const

export const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`
export const srcSet = (id: string) =>
  [828, 1280, 2000].map((w) => `${u(id, w)} ${w}w`).join(', ')

export const NAV = [
  { id: 'supan', label: 'Súpan' },
  { id: 'matsedill', label: 'Matseðill' },
  { id: 'sagan', label: 'Sagan' },
  { id: 'opid', label: 'Opnunartími' },
  { id: 'stadsetning', label: 'Staðsetning' },
] as const

export const HERO = {
  eyebrow: 'Sjávarréttastaður á Húsavík',
  h1a: 'Gula húsið',
  h1b: 'við höfnina',
  sub: 'Ferskur fiskur úr héraði, brauð bakað á staðnum og súpan sem gestir tala um. Gakktu nær.',
  hoursLine: `Opið alla daga 11:30–21:30 · ${ADDRESS}`,
  ctaCall: 'Hringja í 464 1520',
  ctaTable: 'Panta borð',
  waterAlt: '',
  houseAlt:
    'Gula timburhúsið Sel á Ásgarðsvegi 1 á Húsavík, heimili Naustsins: rauðar dyr, hvítur stigi og skilti með fiskimerkinu',
}

export const SOUP = {
  eyebrow: 'Dyrnar opnast',
  heading: 'Súpan sem fólk stoppar fyrir',
  body1:
    'Í umsögn eftir umsögn nefna gestir sömu skálina. Rjómakennd fiskisúpa með tómat, full af fiski og skelfiski, borin fram með nýbökuðu brauði.',
  body2:
    'Naustið er efsti veitingastaðurinn á Húsavík á Tripadvisor og súpan kemur fyrir í ótal umsögnum sem ástæðan fyrir stoppinu.',
  quote: 'Such an excellent meal and cute location. Brilliant fish soup, fish of the day, mussels.',
  quoteName: 'Amanda Summons',
  quoteSource: 'Í gegnum Sluurpy',
  priceLabel: 'Kvöldverður að jafnaði',
  priceValue: '4.000–6.000 kr. á mann',
  priceNote: 'Viðmið samkvæmt opinberum skráningum, ekki staðfestur verðlisti.',
  imgAlt: 'Fiskisúpa Naustsins með brauði á útiborði í sólskini, vínglös og fleiri réttir í kring',
}

export const MENU = {
  heading: 'Það sem eldhúsið gerir best',
  intro:
    'Fiskurinn kemur ferskur úr héraði, grænmetið frá nærliggjandi ræktendum og kjötið frá bæjum í grenndinni. Brauð og kökur eru bökuð á staðnum á hverjum degi.',
  groups: [
    {
      title: 'Af sjónum',
      items: [
        { name: 'Fiskisúpa', note: 'rjómakennd með tómat, full af fiski og skelfiski' },
        { name: 'Fiskur dagsins', note: 'aflinn ræður, breytist frá degi til dags' },
        { name: 'Fish and chips', note: 'stökkur fiskur og franskar' },
        { name: 'Grillaður lax', note: 'af grillinu með salati og kartöflum' },
        { name: 'Saltfiskréttur Naustsins', note: 'saltfiskur að hætti hússins' },
        { name: 'Plokkfiskur', note: 'borinn fram á rúgbrauði' },
        { name: 'Grilluð humarsamloka', note: 'humar af grillinu í brauði' },
        { name: 'Til sjávar og sveita', note: 'sjávarfang og kjöt úr sveitinni saman á diski' },
      ],
    },
    {
      title: 'Í lokin',
      items: [
        { name: 'Súkkulaðikaka', note: 'bökuð á staðnum' },
        { name: 'Skyramisu', note: 'skyrið mætir tiramisu' },
        { name: 'Döðlukaka', note: 'heit og mjúk' },
        { name: 'Rabarbaragrautur', note: 'heitur, með rjóma' },
      ],
    },
  ],
  smallPrint:
    'Sýnishorn af réttum sem gestir og matarskrif hafa lýst. Matseðillinn breytist eftir árstíð og afla dagsins. Hringdu í 464 1520 til að heyra hvað er í boði í dag.',
  imgAlt: 'Grillaður lax frá Naustinu með grillrönd, salati, kartöflum og sítrónu, mynd tekin ofan frá',
}

export const STORY = {
  eyebrow: 'Sagan',
  heading: 'Hús frá 1931, tvær mágkonur og yfir áratugur við höfnina',
  body1:
    'Hugmyndin að Naustinu kviknaði eftir hrunið 2008. Tvær mágkonur stóðu báðar á tímamótum og ákváðu að byrja á einhverju nýju saman. Þær opnuðu fyrst lítinn stað í gömlu kaffihúsi við höfnina á Húsavík og hann varð fljótt einn vinsælasti veitingastaður bæjarins.',
  body2:
    'Árið 2016 fluttu þær starfsemina í Sel, gult timburhús í miðbænum frá 1931 sem hafði áður verið heimili fjölskyldu. Við breytingarnar var húsinu hlíft eins og hægt var svo sál þess fengi að halda sér. Það finnst um leið og gengið er inn.',
  timeline: [
    { year: '2008', label: 'Hugmyndin kviknar á tímamótum' },
    { year: 'Um 2011', label: 'Naustið opnar við höfnina' },
    { year: '2016', label: 'Flutt í gula húsið Sel' },
    { year: 'Í dag', label: 'Efst á lista veitingastaða á Húsavík' },
  ],
  imgAlt:
    'Matsalur Naustsins: grænt munstrað veggfóður, hvítmálaður gluggi með útsýni yfir tré, vínflaska og glös á dekkuðu borði',
}

export const REVIEWS = {
  heading: 'Efst á lista á Húsavík',
  body:
    'Naustið er efsti veitingastaðurinn á Húsavík á Tripadvisor og með þúsundir fimm stjörnu umsagna á milli Google og Tripadvisor.',
  quotes: [
    {
      text: 'Best seafood restaurant in the country ❤',
      name: 'Guðrún Ólafía',
      source: 'Í gegnum Sluurpy',
    },
    {
      text: 'Really good fish dishes and amazing atmosphere.',
      name: 'Benóny Valur Jakobsson',
      source: 'Í gegnum Sluurpy',
    },
    {
      text: 'Amazing dishes - the fish is very fresh and delicious. Lovely atmosphere and attentive and hospitable staff!',
      name: 'Lisa',
      source: 'Tripadvisor, í gegnum Restaurant Guru',
    },
  ],
  note: 'Raunverulegar umsagnir, sóttar í gegnum umsagnaveitur. Sjá fyrirvara neðst á síðunni.',
}

export const LANTERN = {
  eyebrow: 'Opnunartími',
  heading: 'Ljósið í glugganum',
  body:
    'Þegar ljós logar í glugganum á Ásgarðsvegi 1 er potturinn á hellunni. Naustið er opið alla daga, 11:30–21:30.',
  openNow: 'Opið núna',
  closedNow: 'Lokað núna',
  opensAt: 'Opnar aftur 11:30',
  closesAt: 'Opið til 21:30',
  hours: HOURS_LABEL,
  imgAlt: 'Gluggi með hlýrri gulri birtu í myrkri, ljósið lýsir út í nóttina',
}

export const RESERVE = {
  eyebrow: 'Borðapöntun',
  heading: 'Renndu miða undir hurðina',
  body:
    'Naustið tekur við borðapöntunum í síma og tölvupósti. Skildu eftir miða hér og við höfum samband til að staðfesta.',
  disclaimer: 'Þetta er beiðni um borð, ekki staðfest bókun. Staðfesting berst símleiðis eða í tölvupósti.',
  fields: {
    name: 'Nafn',
    contact: 'Sími eða netfang',
    guests: 'Fjöldi gesta',
    when: 'Dagur og tími',
    message: 'Skilaboð (t.d. ofnæmi eða tilefni)',
  },
  submit: 'Senda beiðni',
  successHeading: 'Miðinn er tilbúinn',
  successBody:
    'Í frumgerðinni er beiðnin ekki send sjálfkrafa. Kláraðu hana með tölvupósti eða símtali:',
  successMail: 'Senda í tölvupósti',
  successCall: 'Hringja í 464 1520',
  imgAlt: 'Dekkað veitingaborð með vínglasi, servíettu og matseðli í hlýrri kvöldbirtu',
}

export const FIND = {
  heading: 'Í hjarta Húsavíkur',
  body:
    'Húsavík stendur við Skjálfandaflóa á Norðurlandi og er oft kölluð höfuðstaður hvalaskoðunar á Íslandi. Naustið er í miðbænum, í göngufæri frá höfninni, og vinsælt stopp á Demantshringnum.',
  addressLabel: 'Heimilisfang',
  mapsCta: 'Opna í kortum',
  harbourAlt: 'Íslenskur hafnarbær: seglbátur við bryggju og litrík hús í hlíðinni (myndin er ekki tekin á Húsavík)',
  harbourCaption: 'Íslensk hafnarstemning. Myndin er ekki frá Húsavík.',
  puffinAlt: 'Lundi á klettabrún við hafið',
  puffinCaption: 'Í hjarta hvalaskoðunarbæjarins Húsavíkur',
}

export const CLOSING = {
  heading: 'Sjáumst í gula húsinu',
  sub: 'Ekkert netbókunarkerfi, engin bið. Hringdu eða kíktu við.',
}

export const DISCLAIMER =
  'Um heiðarleika: Þessi síða er hönnunarfrumgerð frá SNDR, ekki opinber vefur Naustsins. Umsagnir eru raunverulegar en sóttar í gegnum umsagnaveitur (Sluurpy og Restaurant Guru, sem safna af Google, Tripadvisor og Facebook). Naustið birtir ekki verðlagðan matseðil opinberlega; verðbilið 4.000–6.000 kr. á mann er viðmið úr opinberum skráningum, ekki staðfestur verðlisti, og réttirnir hér eru teknir saman úr umsögnum og matarskrifum. Borðapöntunarformið er beiðni en ekki rauntímabókunarkerfi. Ljósmyndir af húsinu, súpunni, laxinum og matsalnum eru raunverulegar myndir staðarins af skráningu hans hjá Visit Húsavík; aðrar myndir eru andrúmsmyndir af Unsplash og eru merktar þannig.'
