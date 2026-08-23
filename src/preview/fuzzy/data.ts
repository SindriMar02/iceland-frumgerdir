/**
 * Fuzzy / Módel-húsgögn ehf.
 *
 * Every fact here was read off the client's own site (fuzzy.is), their
 * fyrirtækjaskrá record, or their own product photography. Nothing is invented.
 * Where their site contradicts itself the note says so rather than picking one.
 */

export const BRAND = {
  name: 'Fuzzy',
  legal: 'Módel-húsgögn ehf.',
  kt: '540671-0609',
  founded: '14.06.1971',
  address: 'Hraunbergi 11, 111 Reykjavík',
  maker: 'Sigurður Már Helgason',
  makerRole: 'Húsgagnabólstrari',
  phones: ['557-1425', '867-5118'],
  currentSite: 'https://fuzzy.is',
} as const

/** Their own trivia box, verbatim from fuzzy.is. */
export const TRIVIA = [
  '„Fuzzy“ merkir lítill loðinn karl á latínu.',
  'Kollurinn var fyrst hannaður árið 1972.',
] as const

export const HERO = {
  eyebrow: 'Módel-húsgögn, Reykjavík',
  // Split per WORD, never per character: Icelandic accents (ledger #23).
  headline: 'Sami maðurinn hefur smíðað hvern einasta koll síðan 1972.',
  lede:
    'Fuzzy er lítill íslenskur gærukollur. Sigurður Már hannaði hann 1972 og smíðar hann enn sjálfur í bílskúrnum sínum.',
  cta: { label: 'Sjá kollinn', href: '#kollurinn' },
} as const

/** Real, off their own product page. */
export const SPEC = {
  title: 'Fuzzy kollurinn',
  dims: '40 × 37 × 14 cm',
  weight: '3 kg',
  rows: [
    { k: 'Seta', v: 'Bólstruð með ekta íslenskri gæru' },
    { k: 'Fætur', v: 'Fjórir ávalir, renndir viðarfætur' },
    { k: 'Kassi', v: '40 × 37 × 14 cm, heildarþyngd 3 kg' },
    { k: 'Sending', v: 'Kassinn hentar innanlands og utan' },
    { k: 'Smíði', v: 'Handsmíðaður í Reykjavík, einn í einu' },
  ],
} as const

/**
 * Fleece colours sampled directly out of their own range photograph
 * (public/fuzzy/range.webp) with PIL, not picked by eye.
 */
export const COLOURWAYS = [
  { id: 'hvitt', name: 'Hvítt', hex: '#DBD2C8', paper: '#EDE9E2', note: 'Ólituð hvít gæra' },
  { id: 'graatt', name: 'Grátt', hex: '#9C928A', paper: '#E9E9E8', note: 'Grásprengd gæra' },
  { id: 'mobrunt', name: 'Móbrúnt', hex: '#5C442E', paper: '#EDE7DD', note: 'Móbrún gæra' },
  { id: 'svart', name: 'Svart', hex: '#1F1B1A', paper: '#E8E6E3', note: 'Kolsvört gæra' },
] as const

/** Dated, sourced. Two years appear on their own site; both are shown. */
export const TIMELINE = [
  {
    year: '1971',
    title: 'Módel-húsgögn skráð',
    body: 'Fyrirtækið er skráð í fyrirtækjaskrá 14. júní 1971 og er þar enn.',
  },
  {
    year: '1972',
    title: 'Fuzzy hannaður',
    body: 'Sigurður Már hannaði og smíðaði gærukollinn. Umbúðirnar fengu umbúðaverðlaun Samtaka iðnaðarins sama ár.',
  },
  {
    year: '1970-80',
    title: 'Vinsældir á áttunda áratugnum',
    body: 'Kollurinn naut strax mikilla vinsælda og fór víða um íslensk heimili.',
  },
  {
    year: 'Síðan',
    title: 'Sýningar heima og erlendis',
    body: 'Fuzzy hefur tekið þátt í hönnunarsýningum, meðal annars Scandinavian Design, og er seldur í Danmörku og Kanada.',
  },
  {
    year: 'Í dag',
    title: 'Enn í sama bílskúrnum',
    body: 'Sigurður Már býr til Fuzzy-kollana sjálfur í bílskúrnum sínum. Hver einasti þeirra.',
  },
] as const

export const RECOGNITION = [
  'Umbúðaverðlaun Samtaka iðnaðarins, 1972',
  'Gæðamerki Bændasamtakanna',
  'Award of Excellence',
  'Umfjöllun í Iceland Review og Hús og Híbýlum',
] as const

/** All ten, verbatim from their own söluaðilar page. */
export const RETAILERS = [
  { name: 'Epal', addr: 'Skeifunni 6, Hörpu og Keflavíkurflugvelli', tel: '568 7733' },
  { name: 'Rammagerðin', addr: 'Skólavörðustíg 12, 101 Reykjavík', tel: '535 6694' },
  { name: 'Líf og list', addr: 'Smáralind, 201 Kópavogur', tel: '554 2140' },
  { name: 'Litla hönnunarbúðin', addr: 'Strandgötu 19, 220 Hafnarfirði', tel: '555 7010' },
  { name: 'Blómabúðin 18 Rauðar rósir', addr: 'Hamraborg 3, 200 Kópavogi', tel: '554 4818' },
  { name: '@ Home', addr: 'Stillholti 16-18, 300 Akranesi', tel: '431 1218' },
  { name: 'Motivo', addr: 'Brúarstræti 3, 800 Selfoss', tel: '482 1700' },
  { name: 'Kista', addr: 'Menningarhúsinu Hofi, Strandgötu 12, 600 Akureyri', tel: '897 0555' },
  { name: 'Hús handanna', addr: 'Miðvangi 1-3, 700 Egilsstöðum', tel: '471 2433' },
  { name: 'Póley', addr: 'Bárugötu 8, 900 Vestmannaeyjum', tel: '481 1155' },
] as const

export const MAKER = {
  name: 'Sigurður Már Helgason',
  role: 'Húsgagnabólstrari',
  body: [
    'Sigurður Már er lærður húsgagnabólstrari. Hann hefur bæði hannað og bólstrað húsgögn samhliða smíðinni, ásamt því að smíða leiktæki fyrir börn.',
    'Hugmyndin á bakvið nafnið er einföld: Fuzzy merkir lítill loðinn karl á latínu, og kollurinn tekur útlit sitt þaðan.',
    'Enn þann dag í dag býr Sigurður Már til Fuzzy-kollana sjálfur í bílskúrnum sínum.',
  ],
} as const

/** His second line, in his own words. */
export const LAMPS = {
  title: 'Ljós íslenskrar náttúru',
  body:
    'Fætur ljóssins eru þeir sömu og á Fuzzy, í formi vatnsdropa sem er undirstaða alls lífs. Hver glerkúpull er stæling á fyrirbrigði úr íslenskri náttúru, svo sem fjallavatni eða eldfjalli.',
} as const

/**
 * The work index. 29 real photographs harvested from their own gallery page,
 * which the first build never reached. `span` drives the index grid: the page is
 * mostly picture and the type recedes, which is the grammar of wakawaka.world
 * (image-area ratio 1.004, h2 14px, body 10px) measured 2026-08-22.
 */
export const WORK = [
  { src: 'hraun', span: 7, cap: 'Fuzzy í hrauni' },
  { src: 'ad-is', span: 3, cap: 'Kveðja frá Íslandi' },
  { src: 'ad-en', span: 3, cap: 'Greetings from Iceland' },
  { src: 'ad-de', span: 3, cap: 'Grüße aus Island' },
  { src: 'ad-es', span: 3, cap: 'Saludos desde Islandia' },
  { src: 'refur', span: 6, cap: 'Gæran og refurinn' },
  { src: 'gras', span: 6, cap: 'Tveir hvítir, úti í grasi' },
  { src: 'press', span: 5, cap: 'Íslensk klassík, umfjöllun um hönnuðinn' },
  { src: 'syning1', span: 7, cap: 'Á sýningu' },
  { src: 'kaupmannahofn', span: 6, cap: 'Fatasýning, Kaupmannahöfn' },
  { src: 'syning2', span: 6, cap: 'Gallerý Gersemi' },
  { src: 'budur1', span: 4, cap: 'Í verslun' },
  { src: 'budur2', span: 4, cap: 'Í verslun' },
  { src: 'budur3', span: 4, cap: 'Jólaglugginn' },
  { src: 'budur4', span: 6, cap: 'Uppstilling' },
  { src: 'budur5', span: 6, cap: 'Fjórir saman' },
  { src: 'ad-old', span: 5, cap: 'Gömul auglýsing' },
  { src: 'ad-zh', span: 3, cap: '来自冰岛的问候' },
  { src: 'barn', span: 4, cap: 'Rétt stærð fyrir lítinn mann' },
  { src: 'svart', span: 6, cap: 'Svört gæra' },
  { src: 'budur6', span: 6, cap: 'Í sýningarrými' },
  { src: 'bjorn', span: 4, cap: 'Í búðarglugga erlendis' },
  { src: 'verdlaun', span: 8, cap: 'Verðlaunagripurinn' },
  { src: 'review', span: 4, cap: 'Iceland Review' },
  { src: 'kambur', span: 6, cap: 'Fuzzy kambur' },
  { src: 'ljos1', span: 3, cap: 'Ljós íslenskrar náttúru' },
  { src: 'ljos2', span: 3, cap: 'Glerkúpull, stæling á fyrirbrigði úr náttúrunni' },
  { src: 'ljos3', span: 6, cap: 'Ljósin á jólum' },
] as const

export const IMAGES = {
  range: '/fuzzy/range.webp',
  rangeSm: '/fuzzy/range-sm.webp',
  fleece: '/fuzzy/fleece-macro.webp',
  bench: '/fuzzy/bench.webp',
} as const

/* ------------------------------------------------------------------------
 * TRANSPLANT: the Fríða engine (01-live/frida), measured 2026-08-22.
 * Its signature is that the catalogue IS a dateline: a sticky rail of honest
 * dated stations that light as you read, and each chapter is a museum
 * accession entry (station, name, SOURCE, body, quote, count).
 * Fuzzy earns that structure because its whole argument is a dateline, and
 * every station below has a real, checkable source.
 * Reference numbers to hit: image ratio .322, ~12 images, h1 32 / h2 45 /
 * body 17, about 12 screens.
 * ------------------------------------------------------------------------ */

export const STATIONS = ['1971', '1972', '8. áratugurinn', 'Erlendis', 'Í dag'] as const

export const CHAPTERS = [
  {
    id: 'skraning', station: '1971', img: 'press',
    name: 'Módel-húsgögn skráð',
    source: 'Fyrirtækjaskrá Skattsins: Módel-húsgögn ehf., kt. 540671-0609, skráð 14. júní 1971.',
    body: 'Verkstæðið er eldra en kollurinn. Fyrirtækið er enn skráð á sömu kennitölu og hefur skilað ársreikningi á hverju ári síðan.',
    quote: 'Sigurður Már er lærður húsgagnabólstrari.',
    count: '55 ár',
    alt: 'Umfjöllun um Fuzzy og hönnuðinn í tímariti.',
  },
  {
    id: 'honnun', station: '1972', img: 'ad-old',
    name: 'Kollurinn hannaður',
    source: 'Þeirra eigin síða: hannaður 1972. Umbúðirnar fengu umbúðaverðlaun Samtaka iðnaðarins sama ár.',
    body: 'Lítill koll­ur með sútaðri lambsgæru og fjórum ávölum viðarfótum. Nafnið er latína: lítill loðinn karl.',
    quote: 'Fuzzy merkir lítill loðinn karl á latínu.',
    count: '4 fætur',
    alt: 'Gömul auglýsing fyrir Fuzzy kollinn.',
  },
  {
    id: 'vinsaeldir', station: '8. áratugurinn', img: 'barn',
    name: 'Á hverju heimili',
    source: 'Þeirra eigin frásögn: kollurinn naut strax mikilla vinsælda á áttunda áratugnum.',
    body: 'Rétt stærð fyrir lítinn mann, og nógu léttur til að vera dreginn milli herbergja. Þess vegna eiga svo margir Íslendingar mynd af sér á Fuzzy.',
    quote: 'Fuzzy hefur aldrei verið vinsælli.',
    count: '3 kg',
    alt: 'Barn situr á Fuzzy kolli.',
  },
  {
    id: 'erlendis', station: 'Erlendis', img: 'kaupmannahofn',
    name: 'Kaupmannahöfn, Kanada',
    source: 'Þeirra eigin fréttasíða: Fuzzy í Nordatlantisk Hus í Danmörku og í Kanada, auk sýninga á borð við Scandinavian Design.',
    body: 'Sami kollurinn, smíðaður í sama bílskúrnum, stendur í sýningarrýmum erlendis og í Epal heima.',
    quote: 'Fuzzy-kollurinn hefur farið víða.',
    count: '10 söluaðilar',
    alt: 'Fuzzy á fatasýningu í Kaupmannahöfn.',
  },
  {
    id: 'idag', station: 'Í dag', img: 'bench',
    name: 'Enn í sama bílskúrnum',
    source: 'Ársreikningi 2025 skilað 28. febrúar 2026. Þeirra eigin síða: hann smíðar kollana sjálfur.',
    body: 'Fimmtíu og þremur árum eftir fyrsta kollinn rennur Sigurður Már fæturna sjálfur, einn í einu, í bílskúrnum heima hjá sér.',
    quote: 'Enn þann dag í dag býr Sigurður Már til Fuzzy-kollana sjálfur í bílskúrnum sínum.',
    count: 'einn í einu',
    alt: 'Sigurður Már Helgason rennur viðarfætur í bílskúrnum sínum.',
  },
] as const

export const CH_HEAD = {
  eyebrow: 'Heimildir',
  title: 'Hver koll­ur á sér dagsetningu',
  lead: 'Fuzzy er ekki verksmiðjuvara með uppfundna sögu. Hver áfangi hér að neðan er dagsettur og á sér heimild, ýmist í fyrirtækjaskrá eða á þeirra eigin síðu.',
  sourceLabel: 'Heimild',
  countLabel: '',
}

export const WORKSHOP = {
  eyebrow: 'Verkstæðið',
  title: 'Bílskúrinn í Reykjavík',
  body: 'Sigurður Már er lærður húsgagnabólstrari og hefur bæði hannað og bólstrað húsgögn samhliða smíðinni, ásamt því að smíða leiktæki fyrir börn. Fuzzy er þó það sem hann er þekktastur fyrir.',
  noteLabel: 'Athugið',
  note: 'Hver gæra er ólík þeirri næstu, svo engir tveir kollar eru nákvæmlega eins.',
}
