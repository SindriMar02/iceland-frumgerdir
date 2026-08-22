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
  { id: 'hvitt', name: 'Hvítt', hex: '#DBD2C8', ground: '#1B1613', note: 'Ólituð hvít gæra' },
  { id: 'graatt', name: 'Grátt', hex: '#9C928A', ground: '#14171B', note: 'Grásprengd gæra' },
  { id: 'mobrunt', name: 'Móbrúnt', hex: '#5C442E', ground: '#1E150D', note: 'Móbrún gæra' },
  { id: 'svart', name: 'Svart', hex: '#1F1B1A', ground: '#0E0D0D', note: 'Kolsvört gæra' },
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

export const IMAGES = {
  range: '/fuzzy/range.webp',
  rangeSm: '/fuzzy/range-sm.webp',
  fleece: '/fuzzy/fleece-macro.webp',
  home: '/fuzzy/stool-home.webp',
  stockist: '/fuzzy/stockist.webp',
  press: '/fuzzy/press-icelandreview.webp',
} as const
