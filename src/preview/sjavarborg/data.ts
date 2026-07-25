/**
 * Sjávarborg — "Borgin við sjóinn" (the sea-castle at the harbour).
 *
 * Every fact below is primary-sourced from sjavarborg.is (homepage history
 * text, /location, room + café pages) and the official West Iceland tourism
 * board listing (west.is), fetched 2026-07-24. Photography is the guesthouse's
 * OWN first-party set, harvested from their Duda CDN (lirp.cdn-website.com)
 * at the largest rendition available (~1620w ceiling) — soft imagery is the
 * quality ceiling, so the layout favours framed panels over vast full-bleed.
 *
 * HONESTY GUARDRAILS (see the batch-11 candidate brief):
 *  - NO fixed nightly price. Their own site publishes none; OTA snapshots
 *    fluctuate ($68–90). Every rate leads to their own booking engine.
 *  - Phone = the number on their OWN site (+354 517 5353), NOT the aggregator
 *    888 1150 (legacy "Harbour Hostel").
 *  - The 1914 ice-house story is the HOUSE'S OWN account (their About text,
 *    echoed by west.is) — presented as heritage, not an archival-verified fact.
 *  - NO owner names (Sigþór Steinn / Steinar Atli are only the Smørrebord
 *    pop-up hosts, never asserted as the guesthouse's owners).
 *  - Café is SEASONAL (breakfast from 1 May; season Mar 1–Oct 31) — never
 *    implied year-round.
 *  - Ratings cite their PLATFORM (TripAdvisor / Booking / Trip.com). No
 *    invented Google score, no fabricated testimonial quotes.
 *  - Neighbour shots (Vatnasafn, sundlaugin, Sjávarpakkhúsið) are captioned
 *    honestly as neighbours, not as the guesthouse's own rooms.
 */

const BASE = import.meta.env.BASE_URL
export const IMG = (file: string) => `${BASE}sjavarborg/${file}`

/* ── Contact (verified: sjavarborg.is/location + west.is) ─────────────── */
export const EMAIL = 'info@sjavarborg.is'
export const EMAIL_HREF = 'mailto:info@sjavarborg.is'
export const PHONE_DISPLAY = '+354 517 5353'
export const PHONE_HREF = 'tel:+3545175353'
export const ADDRESS = 'Hafnargata 4, 340 Stykkishólmur'
/* Their own booking engine (link taken verbatim from sjavarborg.is). */
export const BOOKING_URL = 'https://app.thebookingfactory.com/sjavarborg/book'
export const MAP_EMBED =
  'https://www.google.com/maps?q=Sj%C3%A1varborg%2C%20Hafnargata%204%2C%20Stykkish%C3%B3lmur&output=embed'
export const MAP_LINK =
  'https://www.google.com/maps/search/?api=1&query=Sj%C3%A1varborg%20Hafnargata%204%20Stykkish%C3%B3lmur'

/* ── Nav ─────────────────────────────────────────────────────────────── */
export const NAV = [
  { id: 'sagan', label: 'Sagan' },
  { id: 'herbergi', label: 'Herbergi' },
  { id: 'kaffihus', label: 'Kaffihúsið' },
  { id: 'stadurinn', label: 'Staðurinn' },
  { id: 'heimsokn', label: 'Heimsókn' },
] as const

/* ── Hero ────────────────────────────────────────────────────────────── */
export const HERO = {
  eyebrow: 'Gistiheimili & kaffihús · Hafnargata 4, Stykkishólmur',
  /* The name is the hook: Sjávarborg means roughly "the castle by the sea". */
  word: 'Sjávarborg',
  gloss: 'borgin við sjóinn',
  year: 'Síðan 1914',
  sub: 'Grænt hafnarhús fremst á bryggjunni í Stykkishólmi, þar sem Breiðafjörður, Súgandisey og eyjarnar blasa við út um gluggann. Íshús í kjallara varð með tímanum heimili, verslun og loks gistiheimili með kaffihúsi á jarðhæð.',
  cta: 'Bóka gistingu',
  photo: 'sugandisey.webp',
  photoAlt:
    'Rauði vitinn á Súgandisey stendur á stuðlabergsklettinum yfir höfninni í Stykkishólmi, með bátum við bryggju.',
  photoTag: 'Súgandisey, við höfnina',
}

/* ── Sagan — the heritage timeline, the signature. Each era verbatim from
   the operator's own history text (sjavarborg.is), echoed by west.is. ─── */
export interface Era {
  year: string
  use: string
  title: string
  text: string
  img: string
  alt: string
}
export const SAGA = {
  title: 'Húsið gegnum tímann',
  lead: 'Nafnið Sjávarborg þýðir borgin við sjóinn. Sama húsið hefur skipt um hlutverk aftur og aftur í meira en heila öld, en alltaf staðið á sínum stað fremst við höfnina.',
  eras: [
    {
      year: '1914',
      use: 'Íshús',
      title: 'Ís fyrir bátana',
      text: 'Kjallari Sjávarborgar var byggður árið 1914 sem íshús. Þar var ís geymdur til að kæla fiskinn sem bátarnir lönduðu í höfninni rétt fyrir utan.',
      img: 'townharbour.webp',
      alt: 'Höfnin og bærinn í Stykkishólmi með bátum og snævi þöktum fjöllum Snæfellsness, þar sem fiski var landað.',
    },
    {
      year: '1938',
      use: 'Heimili & verslun',
      title: 'Tvær hæðir ofan á',
      text: 'Árið 1938 voru byggðar tvær hæðir ofan á kjallarann. Þar var íbúð fjölskyldu og verslun undir sama þaki.',
      img: 'building-front.webp',
      alt: 'Græna hafnarhúsið Sjávarborg með skiltinu, framhlið að götunni.',
    },
    {
      year: 'Í gegnum tíðina',
      use: 'Bókaverslun · rakari · kaupmaður',
      title: 'Mörg líf undir einu þaki',
      text: 'Í tímans rás hýsti húsið meðal annars bókaverslun, rakarastofu og matvöruverslun. Enn í dag er bókaskiptahorn í kjallaranum til minningar um það.',
      img: 'lounge.webp',
      alt: 'Hlýleg setustofa með gulum sófa, Íslandskorti á vegg og blómum á borði.',
    },
    {
      year: '2013',
      use: 'Gistiheimili',
      title: 'Gestir flytja inn',
      text: 'Í maí 2013 opnaði gistiheimilið. Herbergin, sameiginlega eldhúsið og setustofurnar tóku við af íbúð og verslun, en útsýnið yfir höfnina hélst óbreytt.',
      img: 'bedroom.webp',
      alt: 'Bjart tveggja manna herbergi með uppábúnu rúmi, tréparketi og gluggum.',
    },
    {
      year: 'Í dag',
      use: 'Gistiheimili & kaffihús',
      title: 'Kaffi á jarðhæð',
      text: 'Í dag er Sjávarborg gistiheimili með kaffihúsi á jarðhæð, fremst við höfnina í Stykkishólmi, þar sem gestir og heimafólk hittast yfir kaffi og köku.',
      img: 'common.webp',
      alt: 'Sameiginleg setustofa og kaffihús með sinnepsgulum bekk og gömlum útvarpstækjum.',
    },
  ] as Era[],
  note: 'Sagan er sögð eins og hún birtist á vef gistiheimilisins sjálfs.',
}

/* ── Herbergi — room types exactly as their own pages frame them ─────── */
export interface RoomCat {
  key: string
  name: string
  detail: string
  img: string
  alt: string
}
export const ROOMS: RoomCat[] = [
  {
    key: 'einstaklings',
    name: 'Einstaklingsherbergi',
    detail: 'Fyrir einn gest, með aðgangi að sameiginlegu baðherbergi og eldhúsi.',
    img: 'bedroom.webp',
    alt: 'Herbergi með uppábúnu rúmi, stól og skrifborði við gluggann.',
  },
  {
    key: 'tveggja',
    name: 'Tveggja manna & tvíbreið',
    detail: 'Tvíbreitt rúm eða tvö aðskilin rúm, mörg með útsýni yfir höfnina.',
    img: 'family.webp',
    alt: 'Herbergi með rúmi og kojum við glugga sem snýr að höfninni.',
  },
  {
    key: 'fjolskyldu',
    name: 'Fjölskylduherbergi',
    detail: 'Rúmgóð herbergi fyrir allt að sex, eitt með eigin snyrtingu.',
    img: 'cafe-festive.webp',
    alt: 'Hlýlegt sameiginlegt rými með jólaljósum og hentugt fyrir hópa.',
  },
]
export const ROOMS_INTRO =
  'Herbergin eru einstaklings, tveggja manna, tvíbreið og fjölskylduherbergi, með sameiginlegu eldhúsi, setustofum og baðherbergjum. Í kjallaranum er bókaskiptahorn.'
export const ROOMS_NOTE =
  'Verð og laust framboð birtast í bókunarkerfi gistiheimilisins.'

/* Ratings — cite the platform, never a Google score, never a fake quote. */
export const RATINGS = [
  { platform: 'Tripadvisor', score: '4 af 5', meta: 'um 220 dómar' },
  { platform: 'Booking.com', score: '8,5', meta: 'af 10' },
  { platform: 'Trip.com', score: '8,9', meta: 'af 10' },
] as const

/* ── Kaffihúsið + Smørrebord ─────────────────────────────────────────── */
export const CAFE = {
  title: 'Kaffihúsið',
  body: 'Á jarðhæð er lítið kaffihús með kaffi, heimabökuðum kökum, súpu dagsins og vefjum. Vegan og glútenlausir valkostir eru í boði. Morgunverður er framreiddur frá 1. maí, en utan þess sjá gestir um sig sjálfir í sameiginlega eldhúsinu.',
  menu: [
    { name: 'Kaffi & heimabakað', note: 'Kökur dagsins úr eldhúsinu' },
    { name: 'Súpa dagsins', note: 'Borin fram með brauði' },
    { name: 'Vefjur', note: 'Vegan og glútenlausir valkostir' },
    { name: 'Morgunverður', note: 'Frá 1. maí, árstíðabundið' },
  ],
  photos: [
    { file: 'cafe-evening.webp', alt: 'Kaffihúsið að kvöldi, borð og stólar í hlýrri lýsingu.' },
    { file: 'common.webp', alt: 'Setustofa kaffihússins með sinnepsgulum bekk.' },
  ],
  smorrebord: {
    title: 'Smørrebord',
    body: 'Á aðventunni breytist kaffihúsið í danskt smørrebrød-kvöld, árlegur viðburður með dönsku smurbrauði og aquavit í desemberbirtu.',
    photos: [
      { file: 'smorrebord-food.webp', alt: 'Réttur borinn fram á smørrebrød-kvöldi í hlýrri kvöldlýsingu.' },
      { file: 'smorrebord-aquavit.webp', alt: 'Aquavit-staup á smørrebrød-viðburðinum í desember.' },
    ],
  },
}

/* ── Staðurinn — what is literally around the house (honest neighbours) ─ */
export const PLACE = {
  title: 'Staðurinn',
  body: 'Sjávarborg stendur fremst við höfnina í Stykkishólmi, með Breiðafjörð og eyjarnar fyrir framan. Súgandisey með vitanum er í göngufæri, sundlaugin og Vatnasafnið í fimm mínútna fjarlægð og Sjávarpakkhúsið er næsti nágranni.',
  spots: [
    {
      name: 'Súgandisey',
      note: 'Basalteyja með vita, gengin frá höfninni.',
      img: 'sugandisey.webp',
      alt: 'Rauði vitinn á Súgandisey á stuðlabergsklettinum yfir höfninni.',
    },
    {
      name: 'Vatnasafnið',
      note: 'Ljóssúlur Vatnasafns, fimm mínútur í burtu.',
      img: 'libraryofwater.webp',
      alt: 'Glersúlur Vatnasafnsins fylltar vatni í björtu rými.',
    },
    {
      name: 'Sundlaugin',
      note: 'Sundlaug Stykkishólms með rennibrautum.',
      img: 'pool.webp',
      alt: 'Sundlaug Stykkishólms með rennibrautum og grænni flöt.',
    },
  ],
}

/* ── Heimsókn — visit / season / booking ─────────────────────────────── */
export const VISIT = {
  title: 'Heimsókn',
  season: 'Opið frá 1. mars til 31. október.',
  lines: [
    { label: 'Heimilisfang', value: ADDRESS, href: MAP_LINK },
    { label: 'Sími', value: PHONE_DISPLAY, href: PHONE_HREF },
    { label: 'Netfang', value: EMAIL, href: EMAIL_HREF },
  ],
  note: 'Gistiheimilið hét áður Harbour Hostel og ber enn það nafn á sumum bókunarsíðum.',
}

/* ── SEO ─────────────────────────────────────────────────────────────── */
export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Sjávarborg',
  description:
    'Gistiheimili með kaffihúsi í grænu hafnarhúsi frá 1914 fremst við höfnina í Stykkishólmi, með útsýni yfir Breiðafjörð og Súgandisey.',
  url: 'https://www.sjavarborg.is',
  email: EMAIL,
  telephone: '+354 517 5353',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hafnargata 4',
    addressLocality: 'Stykkishólmur',
    postalCode: '340',
    addressCountry: 'IS',
  },
}
