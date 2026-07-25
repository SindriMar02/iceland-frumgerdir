/**
 * Bragðavellir — "Milli fjalls og fjöru" (between the mountain and the shore).
 *
 * Facts are primary-sourced from bragdavellir.is (cottage specs, barn-restaurant
 * hours, contact, nearby sights) and the regional listings east.is / austurland.is,
 * per the batch-11 candidate brief (fact-checked 2026-07-24).
 *
 * Photography: the farm's OWN 2019 WordPress set (cottages, interiors, the barn
 * bistro's real plates, Snædalsfoss, the valley) — all low-res (800–1200px), so
 * they are used as framed panels, never as a full-bleed hero. The two big
 * landscape plates are high-res East-Iceland fjord photographs from Unsplash,
 * disclosed in the shared footer's photoCredit.
 *
 * HONESTY GUARDRAILS (from the brief — all respected below):
 *  - NOT "farm-to-table". Their own words are only an emphasis on LOCAL
 *    ingredients in a bistro setting.
 *  - The Barn Restaurant is SUMMER-ONLY (opens in June). Cottages are year-round.
 *  - NOT luxury. Verified guest complaints exist about thin walls/cold and older
 *    cabins, so the positioning is honestly "simple, warm, close to nature".
 *  - NO total unit count — only the three verified cottage TYPES.
 *  - NO owner name (it comes from a regional registry, not their own site).
 *  - NO review counts or scores. The brief flags Booking/Google counts as
 *    unverified search-surfaced numbers, so no rating figure is printed at all.
 *  - NO prices — their site publishes none; every rate leads to their own
 *    booking engine (property.godo.is).
 *  - The unverified "31 May 2026 Diamond tier 10/10" review is NOT used.
 */

const BASE = import.meta.env.BASE_URL
export const IMG = (file: string) => `${BASE}bragdavellir/${file}`

/* ── Contact (verified: bragdavellir.is) ─────────────────────────────── */
export const EMAIL = 'info@bragdavellir.is'
export const EMAIL_HREF = 'mailto:info@bragdavellir.is'
export const PHONE_DISPLAY = '+354 478 8240'
export const PHONE_HREF = 'tel:+3544788240'
export const ADDRESS = 'Bragðavellir, 765 Djúpivogur'
/* Their own booking engine, linked from bragdavellir.is. */
export const BOOKING_URL = 'https://property.godo.is/bragdavellir'
export const MAP_EMBED =
  'https://www.google.com/maps?q=Brag%C3%B0avellir%2C%20765%20Dj%C3%BApivogur&output=embed'
export const MAP_LINK =
  'https://www.google.com/maps/search/?api=1&query=Brag%C3%B0avellir%20Dj%C3%BApivogur'

/* ── Nav ─────────────────────────────────────────────────────────────── */
export const NAV = [
  { id: 'landid', label: 'Landið' },
  { id: 'husin', label: 'Húsin' },
  { id: 'hladan', label: 'Hlaðan' },
  { id: 'ikring', label: 'Í kring' },
  { id: 'heimsokn', label: 'Heimsókn' },
] as const

/* ── Hero ────────────────────────────────────────────────────────────── */
export const HERO = {
  eyebrow: 'Sumarhús & Hlaðan · 765 Djúpivogur',
  word: 'Bragðavellir',
  gloss: 'milli fjalls og fjöru',
  sub: 'Sveitabýli við Hamarsfjörð, tíu mínútur frá Djúpavogi. Búlandstindur rís fyrir ofan, fjaran er niður af pallinum og Snædalsfoss er tuttugu mínútna gangur. Þrjár gerðir af húsum og gamalt fjós sem er orðið að bistró á sumrin.',
  cta: 'Bóka hús',
  photo: 'fjord-house.webp',
  photoAlt:
    'Stakt hús með rauðu þaki stendur við fjöruborðið í austfirskum firði, snævi þakin fjöll speglast í kyrrum sjónum.',
  photoTag: 'Fjörðurinn að vetri',
}

export const INTRO =
  'Fjallið fyrir ofan, fjaran fyrir neðan og lítið annað á milli. Hér er ekkert að flýta sér.'

/* ── Landið — the two forces, full-bleed ─────────────────────────────── */
export const LAND = {
  title: 'Landið',
  lead: 'Bragðavellir standa í sveitinni við Hamarsfjörð, skammt frá hringveginum og um tíu til þrettán kílómetra frá Djúpavogi.',
  forces: [
    {
      key: 'fjall',
      name: 'Fjallið',
      body: 'Búlandstindur, píramídalaga fjallið yfir firðinum, er kennileiti svæðisins og sést víða að.',
      img: 'mountains.webp',
      alt: 'Snævi þakin fjöll rísa yfir dalnum við Hamarsfjörð.',
    },
    {
      key: 'fjara',
      name: 'Fjaran',
      body: 'Fjaran er í göngufæri frá pallinum. Á kvöldin sjást álftir á sjónum og kyrrðin er algjör.',
      img: 'coast-road.webp',
      alt: 'Strandvegur liðast meðfram snævi þöktu fjalli og sjónum á Austurlandi.',
    },
  ],
  band: {
    img: 'valley.webp',
    alt: 'Sumarhúsin á Bragðavöllum standa í grænum dal með fjöllin allt um kring.',
    line: 'Þrjú hús í dalnum, fjörðurinn fyrir framan og fjallahringur allt um kring.',
  },
}

/* ── STAÐIR — the destination showcase (thepopuphotel.com structure) ──── *
 * Their homepage rhythm: a full-viewport event plate, then a pair of
 * half-width cards, repeating — each labelled ONLY with a giant white
 * handwritten name. Ours carries the farm's real places. `to` anchors the
 * functional entries to their in-page sections. */
export interface Place {
  key: string
  size: 'full' | 'half'
  name: string
  sub?: string
  img: string
  alt: string
  to?: string
}
export const PLACES: Place[] = [
  {
    /* Deliberately NOT the hero photograph — this plate sat directly under a
       hero using the same image. The shore shot is from Álftafjörður, the
       fjord adjacent to Hamarsfjörður at Djúpivogur, so the caption names no
       specific fjord and cannot mislabel it. */
    key: 'fjordurinn', size: 'full', name: 'Fjörðurinn',
    sub: 'Fjaran niður af pallinum',
    img: 'shore.webp',
    alt: 'Kyrrt vatn í austfirskum firði speglar grænar og gullnar hlíðar, fjaran í forgrunni.',
  },
  {
    key: 'husin', size: 'half', name: 'Húsin þrjú', sub: 'Gistingin', to: 'husin',
    img: 'cottages-front.webp',
    alt: 'Sumarhúsin á Bragðavöllum standa í grænum dal með fjöllin allt um kring.',
  },
  {
    key: 'hladan', size: 'half', name: 'Hlaðan', sub: 'Bistró í gömlu fjósi', to: 'hladan',
    img: 'dish-burger.webp',
    alt: 'Hamborgari og franskar bornar fram á pallinum við Hlöðuna með útsýni yfir sveitina.',
  },
  {
    key: 'snaedalsfoss', size: 'full', name: 'Snædalsfoss',
    sub: 'Um tuttugu mínútna gangur frá Hlöðunni',
    img: 'snaedalsfoss.webp',
    alt: 'Snædalsfoss fellur fram af klettabelti í grænu gili.',
  },
  {
    key: 'bulandstindur', size: 'half', name: 'Búlandstindur', sub: 'Fjallið yfir firðinum',
    img: 'mountains.webp',
    alt: 'Snævi þakin fjöll rísa yfir dalnum við Hamarsfjörð.',
  },
  {
    key: 'djupivogur', size: 'half', name: 'Djúpivogur', sub: 'Þorpið, 10 til 13 km',
    img: 'river-aerial.webp',
    alt: 'Áin liðast um sanda og út í fjörðinn, séð úr lofti.',
  },
]

/* Facts strip — replaces their "Collaborators & Clients" logo band (we
   fabricate no logos); every line is from their own site. */
export const FACTS = [
  'Húsin í útleigu allt árið',
  'Hlaðan opnar í júní',
  '10 til 13 km frá Djúpavogi',
  'Skammt frá hringveginum',
] as const

/* ── Húsin — the SIGNATURE: an honest cottage chooser ────────────────── *
 * Specs are exactly as their own site frames them: three TYPES (no invented
 * unit count), each with size, sleeps and what is inside. Prices intentionally
 * absent — they lead to the booking engine. */
export interface Cottage {
  key: string
  name: string
  size: string
  sleeps: string
  beds: string
  body: string
  features: string[]
  imgs: { file: string; alt: string }[]
}
export const COTTAGES: Cottage[] = [
  {
    key: 'eitt',
    name: 'Eitt svefnherbergi',
    size: '26 m²',
    sleeps: 'Fyrir tvo',
    beds: 'Tvö einbreið rúm',
    body: 'Minnsta húsið, hugsað fyrir tvo. Eldhúskrókur, baðherbergi með sturtu og pallur með útsýni yfir dalinn.',
    features: ['Sérbaðherbergi með sturtu', 'Lítið eldhús', 'Pallur', 'Þráðlaust net'],
    imgs: [
      { file: 'cottage-one.webp', alt: 'Stofa og eldhúskrókur í timburhúsi með viðarklæðningu og gluggum út í dalinn.' },
      { file: 'cottage-one-b.webp', alt: 'Borðkrókur við glugga í litla sumarhúsinu.' },
    ],
  },
  {
    key: 'tvo',
    name: 'Tvö svefnherbergi',
    size: '36 m²',
    sleeps: 'Fyrir fjóra',
    beds: 'Tvö einbreið rúm og koja',
    body: 'Rúmbetra hús með tveimur svefnherbergjum, hentar litlum fjölskyldum og vinahópum.',
    features: ['Tvö svefnherbergi', 'Sérbaðherbergi með sturtu', 'Eldhús með örbylgjuofni', 'Pallur'],
    imgs: [
      { file: 'cottage-two.webp', alt: 'Svefnherbergi með tveimur uppábúnum rúmum í viðarklæddu sumarhúsi.' },
      { file: 'cottage-two-b.webp', alt: 'Stofa með sófa og eldhúsi í tveggja herbergja húsinu.' },
    ],
  },
  {
    key: 'orlofshus',
    name: 'Orlofshúsið',
    size: '60 m²',
    sleeps: 'Fyrir fjóra og fleiri',
    beds: 'Tvö svefnherbergi',
    body: 'Stærsta húsið með tveimur svefnherbergjum og rýmri stofu, gott fyrir lengri dvöl.',
    features: ['Tvö svefnherbergi', 'Rúmgóð stofa', 'Fullbúið eldhús', 'Þvottaaðstaða'],
    imgs: [
      { file: 'holidayhome.webp', alt: 'Stofa og eldhús í stærsta orlofshúsinu með ljósum viðum.' },
      { file: 'holidayhome-b.webp', alt: 'Eldhús og gangur í orlofshúsinu.' },
    ],
  },
]
export const COTTAGES_NOTE =
  'Öll húsin eru með sérbaðherbergi, eldhúsaðstöðu og þráðlaust net. Verð og laust framboð birtast í bókunarkerfi býlisins.'
export const COTTAGES_HONEST =
  'Húsin eru einföld timburhús í sveit, ekki lúxusgisting. Kostirnir eru kyrrðin, útsýnið og nálægðin við náttúruna.'

/* ── Hlaðan — the barn bistro (summer only) ──────────────────────────── */
export const BARN = {
  title: 'Hlaðan',
  kicker: 'Gamla fjósið',
  body: 'Gamla fjósið á bænum var gert upp og er í dag bistró sem opnar í júní og er starfrækt yfir sumarið. Matseðillinn er einfaldur og lögð er áhersla á hráefni úr héraði.',
  seasonNote: 'Hlaðan er sumarstaður og opnar í júní. Húsin sjálf eru í útleigu allt árið.',
  hours: [
    { label: 'Morgunverðarhlaðborð', value: '08:00–10:00' },
    { label: 'Hádegi', value: '11:00–14:00 · súpa og brauð' },
    { label: 'Kvöldverður', value: '17:00–21:00' },
  ],
  menuNote:
    'Matseðill sumarsins liggur frammi í Hlöðunni. Réttirnir hér að neðan eru dæmi af matseðli fyrri sumra.',
  dishes: [
    { file: 'dish-lamb.webp', alt: 'Kjötréttur með kartöflum og sósu borinn fram á diski í Hlöðunni.' },
    { file: 'dish-salmon.webp', alt: 'Fiskréttur með salati og brauði á diski.' },
    { file: 'dish-fish.webp', alt: 'Réttur með fiski og grænmeti á diski í Hlöðunni.' },
    { file: 'dish-burger.webp', alt: 'Hamborgari og franskar bornir fram á pallinum með útsýni.' },
  ],
}

/* ── Í kring — verified nearby draws their own site leans on ─────────── */
export const AROUND = {
  title: 'Í kring',
  lead: 'Það sem er í göngufæri eða stuttum akstri frá bænum.',
  spots: [
    {
      name: 'Snædalsfoss',
      note: 'Um tuttugu mínútna gangur frá Hlöðunni.',
      img: 'snaedalsfoss.webp',
      alt: 'Snædalsfoss fellur fram af klettabelti í grænu gili.',
    },
    {
      name: 'Búlandstindur',
      note: 'Píramídalaga fjallið yfir firðinum.',
      img: 'mountains.webp',
      alt: 'Búlandstindur og fjöllin við Hamarsfjörð.',
    },
    {
      name: 'Papey',
      note: 'Eyjan út af Djúpavogi með lunda og sel.',
      img: 'river-aerial.webp',
      alt: 'Áin liðast um sanda og út í fjörðinn, séð úr lofti.',
    },
    {
      name: 'Eggin í Gleðivík',
      note: 'Listaverkin við höfnina á Djúpavogi.',
      img: 'bridge.webp',
      alt: 'Gömul steinbogabrú yfir á í grýttu landslagi nærri Djúpavogi.',
    },
  ],
}

/* ── Heimsókn ────────────────────────────────────────────────────────── */
export const VISIT = {
  title: 'Heimsókn',
  lead: 'Bragðavellir eru um tíu til þrettán kílómetra frá Djúpavogi, skammt frá hringveginum.',
  lines: [
    { label: 'Heimilisfang', value: ADDRESS, href: MAP_LINK },
    { label: 'Sími', value: PHONE_DISPLAY, href: PHONE_HREF },
    { label: 'Netfang', value: EMAIL, href: EMAIL_HREF },
  ],
  note: 'Húsin eru í útleigu allt árið. Hlaðan opnar í júní og er opin yfir sumarið.',
}

/* ── SEO ─────────────────────────────────────────────────────────────── */
export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Bragðavellir',
  description:
    'Sumarhús í sveit við Hamarsfjörð skammt frá Djúpavogi, með Búlandstind fyrir ofan og fjöru í göngufæri. Hlaðan, bistró í gömlu fjósi, er opin á sumrin.',
  url: 'https://bragdavellir.is',
  email: EMAIL,
  telephone: '+354 478 8240',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Djúpivogur',
    postalCode: '765',
    addressCountry: 'IS',
  },
}
