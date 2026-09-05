/* ──────────────────────────────────────────────────────────────────────────
 * Naustið — Ásgarðsvegur 1, 640 Húsavík
 *
 * REWORK 2026-09-05. Replaces the Bárujárn (line-raster, ink-dark) build of
 * 2026-07-31. Design plan: _docs/NAUSTID-REWORK-2026-09.md
 * Reference grammar: _reference/haven-annecy-teardown/
 *
 * EVERY fact below is sourced. Re-verified 2026-09-05:
 *  · Hours 11:30–21:30 daily — ja.is and Tripadvisor agree
 *  · Tripadvisor 4.5 / 836 reviews / #1 of 8 in Húsavík / 2025 Travelers' Choice
 *    (the 2026-07 build said "#1 of 13" and "over 2,500 reviews" — both stale,
 *     corrected everywhere they appeared, including the outreach draft)
 *  · Google 4.7 (1.506) · Restaurant Guru 4.8 · Facebook 4.7 (221), as of 2026-08-04
 *  · Dinner 4.000–6.000 kr. per person — public listings, NOT a price list
 *  · No per-dish prices exist publicly, so none are printed
 *  · The house came from Norway around 1930; ground-floor dining room with a
 *    patio, sitting room upstairs — veitingageirinn.is
 *  · "Like visiting a grandmother" is Visit Húsavík's own framing, not ours
 *  · Owners are "tvær mágkonur" — no legal names printed
 *  · Review quotes are real, relayed via aggregators (disclosed in the footer)
 *
 * IMAGERY RULE for this build: the house is painted, the food is photographed,
 * nothing is stock. The two watercolours were generated from the restaurant's
 * OWN exterior photograph; every food and interior photograph is theirs, from
 * the Visit Húsavík listing, the Icelandic Food guide, and their listing photos
 * via Restaurant Guru (the 540px phone originals upscaled 4×). Any aggregator
 * frame carrying a cartoon watermark was dropped.
 * ────────────────────────────────────────────────────────────────────────── */

export const PHONE = '464 1520'
export const PHONE_HREF = 'tel:+3544641520'
export const EMAIL = 'naustidfood@gmail.com'
export const ADDRESS = 'Ásgarðsvegur 1, 640 Húsavík'
export const HOURS_LABEL = '11:30–21:30 alla daga'
export const OPEN_MIN = 11 * 60 + 30
export const CLOSE_MIN = 21 * 60 + 30
export const MAPS_URL = 'https://maps.google.com/?q=Naustið+Ásgarðsvegur+1+640+Húsavík'
export const FACEBOOK = 'https://www.facebook.com/naustid/'
export const INSTAGRAM = 'https://www.instagram.com/naustid/'

const BASE = import.meta.env.BASE_URL
const p = (name: string) => `${BASE}naustid/${name}`

/** srcset helper: `img('supa', [540, 1080])` → the webp rungs we shipped. */
const webp = (name: string, widths: number[]) =>
  widths.map((w) => `${p(`${name}-${w}.webp`)} ${w}w`).join(', ')

export const IMG = {
  /* The two watercolours. Generated from exterior-2000.jpg (their own photo of
   * the house) with Nano Banana Pro at 4K, warm-shifted so the paper matches
   * the page ground exactly and feathered into it, so the painting has no edge. */
  hus: p('hus-akvarel-2200.jpg'),
  husWebp: webp('hus-akvarel', [900, 1400, 2200, 3000]),
  husJpg: [900, 1400, 2200].map((w) => `${p(`hus-akvarel-${w}.jpg`)} ${w}w`).join(', '),
  sagan: p('sagan-akvarel-2200.jpg'),
  saganWebp: webp('sagan-akvarel', [900, 1400, 2200, 3000]),
  saganJpg: [900, 1400, 2200].map((w) => `${p(`sagan-akvarel-${w}.jpg`)} ${w}w`).join(', '),

  /* The real photograph of the house, kept so the page can show the building
   * as it actually is next to the painting of it. */
  raunmynd: p('exterior-1200.jpg'),
  raunmyndWebp: `${p('exterior-800.webp')} 800w, ${p('exterior-1200.webp')} 1200w`,

  /* Their garden: their own sign, the flower-planted bathtub, the red van. */
  gardur: p('gardur-1400.jpg'),
  gardurWebp: `${p('gardur-900.webp')} 900w, ${p('gardur-1400.webp')} 1400w, ${p('gardur-2200.webp')} 2200w`,
} as const

/** Square plates for the marquee. Order is the order they scroll past. */
export const PLATES = [
  { key: 'supa', alt: 'Fiskisúpa Naustsins með nýbökuðu brauði á útiborði í sólskini' },
  { key: 'fiskur', alt: 'Grillaður fiskur með kartöflum, salati og sósu, mynd tekin ofan frá' },
  { key: 'eldhus', alt: 'Grillaðar rækjur lagðar á disk með töngum í eldhúsi Naustsins' },
  { key: 'brasad', alt: 'Brasaður kjötréttur í djúpri skál með stökku brauði ofan á' },
  { key: 'raekjur', alt: 'Rækjuréttur með salati og grilluðu grænmeti á borði' },
  { key: 'smaretti', alt: 'Smáréttir og bjór á borði á veröndinni fyrir utan Naustið' },
] as const

export const plateSrc = (key: string) => p(`${key}.jpg`)
export const plateSrcSet = (key: string) => webp(key, [540, 1080])

/** Portrait crops for the feature slots. */
export const PORTRAIT = {
  supa: { src: p('supa-p.jpg'), set: webp('supa-p', [540, 1080]) },
  fiskur: { src: p('fiskur-p.jpg'), set: webp('fiskur-p', [540, 1080]) },
  salur: { src: p('salur-p.jpg'), set: webp('salur-p', [540, 1080]) },
} as const

export const NAV: { id: string; label: string; sub?: string }[] = [
  { id: 'supan', label: 'Súpan' },
  { id: 'matsedill', label: 'Matseðill' },
  { id: 'husid', label: 'Húsið' },
  { id: 'opid', label: 'Opið', sub: '11:30–21:30' },
]

export const HERO = {
  h1: 'Gula húsið við höfnina á Húsavík',
  body:
    'Ferskur fiskur úr héraðinu, grænmeti frá ræktendum í grenndinni, brauð og kökur bakaðar á staðnum á hverjum degi — borið fram í timburhúsi frá því um 1930.',
  welcome: 'Verið velkomin í Naustið.',
  imgAlt:
    'Vatnslitamynd af Naustinu: gula bárujárnshúsið á Ásgarðsvegi 1 með hvítum gluggum, hvítum tröppum, rauðum dyrum og skilti með fiskimerkinu, tré til vinstri og borð á grasinu fyrir framan',
  ctaTable: 'Panta borð',
  ctaCall: `Hringja · ${PHONE}`,
}

export const SUPAN = {
  eyebrow: 'Heimilismatur við höfnina',
  script: 'amma',
  columns: [
    {
      h: 'Fiskisúpan',
      body:
        'Rjómakennd fiskisúpa með tómat, full af fiski og skelfiski, borin fram með nýbökuðu brauði. Í umsögn eftir umsögn nefna gestir sömu skálina sem ástæðuna fyrir því að þeir stoppuðu.',
      quote: 'Such an excellent meal and cute location. Brilliant fish soup, fish of the day, mussels.',
      quoteName: 'Amanda Summons',
      quoteSource: 'Í gegnum Sluurpy',
      link: 'Sjá matseðilinn',
      href: '#matsedill',
    },
    {
      h: 'Úr héraðinu',
      body:
        'Fiskurinn kemur ferskur úr héraðinu, grænmetið frá ræktendum í grenndinni og kjötið frá bæjum í kring. Brauð og kökur eru bökuð á staðnum á hverjum degi. Það er ekkert flókið við þetta — það er bara gert almennilega.',
      link: 'Sagan af húsinu',
      href: '#husid',
    },
  ],
}

export const MATSEDILL = {
  script: 'alla',
  h: 'Það sem eldhúsið gerir best',
  body:
    'Matseðillinn breytist eftir árstíð og afla dagsins. Hér er það sem gestir og matarskrif nefna oftast; hringdu í ' +
    PHONE +
    ' til að heyra hvað er á borðum í dag.',
  link: 'Panta borð',
  href: '#bord',
  groups: [
    {
      title: 'Af sjónum',
      items: [
        { name: 'Fiskisúpa', note: 'rjómakennd með tómat, full af fiski og skelfiski' },
        { name: 'Fiskur dagsins', note: 'aflinn ræður, breytist frá degi til dags' },
        { name: 'Plokkfiskur', note: 'borinn fram á rúgbrauði' },
        { name: 'Saltfiskréttur Naustsins', note: 'saltfiskur að hætti hússins' },
        { name: 'Grillaður lax', note: 'af grillinu með salati og kartöflum' },
        { name: 'Fish and chips', note: 'stökkur fiskur og franskar' },
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
    'Sýnishorn af réttum sem gestir og matarskrif hafa lýst — ekki opinber matseðill. Naustið birtir engan verðlagðan matseðil; kvöldverður er að jafnaði 4.000–6.000 kr. á mann samkvæmt opinberum skráningum, sem er viðmið en ekki staðfestur verðlisti.',
}

export const HUSID = {
  script: 'sidan',
  h: 'Timburhús frá Noregi, tvær mágkonur og áratugur við höfnina',
  body:
    'Húsið var flutt inn frá Noregi um 1930 og stóð lengi sem heimili áður en það varð Naustið. Niðri er matsalurinn með veröndinni, uppi er setustofan. Við breytingarnar var húsinu hlíft eins og hægt var, svo sál þess fengi að halda sér.',
  body2:
    'Hugmyndin kviknaði eftir hrunið 2008. Tvær mágkonur stóðu báðar á tímamótum, byrjuðu í litlu kaffihúsi við höfnina og fluttu svo í gula húsið. Í dag er Naustið efsti veitingastaðurinn á Húsavík á Tripadvisor.',
  link: 'Finna okkur',
  href: '#opid',
  facts: [
    { k: 'Um 1930', v: 'Húsið flutt inn frá Noregi' },
    { k: '2008', v: 'Hugmyndin kviknar á tímamótum' },
    { k: '2016', v: 'Naustið flytur í gula húsið' },
    { k: 'Í dag', v: '4,5 af 5 og 836 umsagnir á Tripadvisor' },
  ],
}

export const SAGAN = {
  h: 'Bjart hús, fjölskylda á bak við það — og matur eins og heima',
  body:
    'Naustið er fjölskyldurekið. Visit Húsavík lýsir því að borða hér eins og að koma heim til ömmu: bjart, hlýtt og fullt af heimatilbúnu góðgæti. Þannig viljum við hafa það.',
  link: 'Kíktu við',
  href: '#bord',
  imgAlt:
    'Vatnslitamynd af Naustinu í sumarbirtu: gula húsið milli trjáa, hvítar tröppur upp að rauðum dyrum og borð á grasinu',
}

export const OPID = {
  eyebrow: 'Opnunartími og staðsetning',
  h: 'Í miðbæ Húsavíkur, í göngufæri frá höfninni',
  body:
    'Húsavík stendur við Skjálfandaflóa og er oft kölluð höfuðstaður hvalaskoðunar á Íslandi. Naustið er við Ásgarðsveg 1, í miðbænum, og er vinsælt stopp á Demantshringnum.',
  openNow: 'Opið núna',
  closedNow: 'Lokað núna',
  opensAt: 'Opnum aftur kl. 11:30',
  closesAt: 'Opið til 21:30',
  mapsCta: 'Opna í kortum',
  gardurAlt:
    'Skilti Naustsins á grasinu fyrir utan húsið, gamalt baðkar fullt af blómum og rauður sendibíll fyrir aftan',
  raunmyndAlt: 'Ljósmynd af Naustinu: gula bárujárnshúsið með hvítum tröppum og borðum á grasinu',
  raunmyndCaption: 'Húsið sjálft — ljósmyndin sem vatnslitamyndin er unnin eftir.',
}

export const BORD = {
  eyebrow: 'Borðapöntun',
  h: 'Sendu okkur línu',
  body:
    'Naustið tekur við borðapöntunum í síma og tölvupósti. Skildu eftir beiðni hér og við höfum samband til að staðfesta.',
  disclaimer:
    'Þetta er beiðni um borð, ekki staðfest bókun. Staðfesting berst símleiðis eða í tölvupósti.',
  fields: {
    name: 'Nafn',
    contact: 'Sími eða netfang',
    guests: 'Fjöldi gesta',
    when: 'Dagur og tími',
    message: 'Skilaboð (t.d. ofnæmi eða tilefni)',
  },
  submit: 'Senda beiðni',
  successHeading: 'Beiðnin er tilbúin',
  successBody:
    'Í frumgerðinni er beiðnin ekki send sjálfkrafa. Kláraðu hana með tölvupósti eða símtali:',
  successMail: 'Senda í tölvupósti',
  successCall: `Hringja í ${PHONE}`,
}

export const REVIEWS = [
  { text: 'Best seafood restaurant in the country ❤', name: 'Guðrún Ólafía', source: 'Í gegnum Sluurpy' },
  { text: 'Really good fish dishes and amazing atmosphere.', name: 'Benóný Valur Jakobsson', source: 'Í gegnum Sluurpy' },
  {
    text: 'Amazing dishes — the fish is very fresh and delicious. Lovely atmosphere and attentive and hospitable staff!',
    name: 'Lisa',
    source: 'Tripadvisor, í gegnum Restaurant Guru',
  },
] as const

export const FOOTER = {
  script: 'sjaumst',
  cols: {
    contact: 'Naustið',
    hours: 'Opnunartími',
    book: 'Borðapöntun',
  },
  hoursLines: [
    { k: 'Mánudaga til sunnudaga', v: '11:30–21:30' },
    { k: 'Eldhúsið', v: 'opið allan opnunartímann' },
  ],
}

export const DISCLAIMER =
  'Um heiðarleika: Þessi síða er hönnunarfrumgerð frá SNDR, ekki opinber vefur Naustsins. Naustið birtir engan verðlagðan matseðil opinberlega; verðbilið 4.000–6.000 kr. á mann er viðmið úr opinberum skráningum, ekki staðfestur verðlisti, og réttirnir hér eru teknir saman úr umsögnum og matarskrifum. Umsagnir eru raunverulegar en sóttar í gegnum umsagnaveitur (Sluurpy og Restaurant Guru, sem safna af Google, Tripadvisor og Facebook). Borðapöntunarformið er beiðni en ekki rauntímabókunarkerfi. Ljósmyndirnar eru raunverulegar myndir staðarins, sóttar úr skráningum hans hjá Visit Húsavík, Icelandic Food og Restaurant Guru; myndir í lægri upplausn voru stækkaðar. Vatnslitamyndirnar tvær eru málaðar eftir ljósmynd staðarins af húsinu. Engar myndir úr myndabönkum eru notaðar. Opnunartími er samkvæmt skráningu Naustsins á ja.is.'
