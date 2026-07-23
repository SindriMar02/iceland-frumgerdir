/**
 * Hótel Búðir — "Svarti punkturinn" (the black anchor).
 *
 * Every fact below is sourced from hotelbudir.is's own pages (rooms,
 * restaurant, sagan), fetched 2026-07-23, or from the photos themselves.
 * Photography = the hotel's OWN professional shoot (squarespace-cdn,
 * B_2xxxx sequence + drone + phone landscape shots), max source 1080w —
 * layout must therefore favour panels/slabs over giant full-bleed crops.
 *
 * HONESTY GUARDRAILS:
 *  - No room COUNT on the page (the "28 rooms" figure is aggregator-level
 *    only; their own site enumerates categories without a total).
 *  - No prices (their booking engine carries live rates).
 *  - No invented history: only the 17th-century trading-post fact, the 1945
 *    purchase (6.000 kr) and the heritage-society story, all from /about.
 *  - The church is described visually (svarta kirkjan) — no construction
 *    dates for it (not on their site).
 *  - Their three homepage phrases are quoted as the experience rails.
 */

const BASE = import.meta.env.BASE_URL
export const IMG = (file: string) => `${BASE}budir/${file}`

/* ── Contact (verified: site footer) ─────────────────────────────────── */
export const EMAIL = 'budir@budir.is'
export const EMAIL_HREF = 'mailto:budir@budir.is'
export const PHONE_DISPLAY = '+354 435 6700'
export const PHONE_HREF = 'tel:+3544356700'
export const ADDRESS = 'Búðum, 356 Snæfellsbær'
/* Their own booking engine (link taken from hotelbudir.is nav). */
export const BOOKING_URL = 'https://direct-book.com/properties/hotelbudirdirect?locale=is'
export const MAP_EMBED = 'https://www.google.com/maps?q=H%C3%B3tel%20B%C3%BA%C3%B0ir&output=embed'
export const MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=H%C3%B3tel%20B%C3%BA%C3%B0ir'

/* ── Nav ─────────────────────────────────────────────────────────────── */
export const NAV = [
  { id: 'herbergi', label: 'Herbergi' },
  { id: 'veitingar', label: 'Veitingastaður' },
  { id: 'sagan', label: 'Sagan' },
  { id: 'brudkaup', label: 'Brúðkaup' },
  { id: 'stadurinn', label: 'Staðurinn' },
] as const

/* ── Hero ────────────────────────────────────────────────────────────── */
export const HERO = {
  eyebrow: 'Snæfellsnes · 356 Snæfellsbær',
  /* The colossal word — set as the black landmark on the horizon. */
  word: 'BÚÐIR',
  wordPrefix: 'Hótel',
  sub: 'Sveitahótel í Búðahrauni, rúmlega tveggja klukkustunda akstri frá Reykjavík. Fyrir utan gluggann: hraunið, gullinn sandur, jökullinn og svarta kirkjan.',
  cta: 'Bóka herbergi',
  photoAlt: 'Hótel Búðir og svarta kirkjan standa stök við ósinn, séð yfir vatnið.',
}

/* ── Their own three phrases (homepage, nominative forms) ────────────── */
export const RAILS = ['brennandi rómantík', 'langþráð slökun', 'spennandi ævintýri'] as const

/* ── Rooms — categories exactly as their own /rooms page frames them ─── */
export interface RoomCat {
  key: string
  name: string
  wing: string
  body: string
  img: string
  alt: string
}
export const ROOMS: RoomCat[] = [
  {
    key: 'superior-standard',
    name: 'Superior Standard',
    wing: 'Nýja álman',
    body: 'Nútímaleg herbergi í nýju álmu hótelsins með rúmgóðum king-size rúmum.',
    img: 'room-bed.webp',
    alt: 'Hótelherbergi undir súð með uppábúnu rúmi, svörtum vegglömpum og innbyggðum fataskáp.',
  },
  {
    key: 'superior-deluxe',
    name: 'Superior Deluxe',
    wing: 'Nýja álman',
    body: 'Stærri og rýmri herbergi í nýju álmunni, king-size rúm. Hægt að bæta við samanbrotnu rúmi fyrir þriðja gestinn sé þess óskað við bókun.',
    img: 'room-attic.webp',
    alt: 'Bjart herbergi undir súð með tvíbreiðu rúmi, bekk og stól við lítið skrifborð.',
  },
  {
    key: 'deluxe',
    name: 'Deluxe',
    wing: 'Gamla húsið',
    body: 'Í gömlu álmunni, stærri og betur útbúin en standard herbergin. Queen- eða king-size rúm, og baðkar í öllum herbergjum nema einu.',
    img: 'suite-tub.webp',
    alt: 'Rúmgóð svíta með baðkari við gluggann, borðstofuborði og hlýrri lýsingu.',
  },
  {
    key: 'svitur',
    name: 'Svítur',
    wing: 'Gamla húsið',
    body: 'Þrjár minni svítur og rúmgóðar stofur, hver með sínu lagi, innréttaðar með gæruklæddum stólum, marmara og handvöldum húsgögnum.',
    img: 'lounge-window.webp',
    alt: 'Setustofa svítu með tveimur hægindastólum við stóra glugga í hvítu birtunni.',
  },
]
export const ROOMS_NOTE = 'Verð og framboð birtast í bókunarkerfi hótelsins.'

/* ── Restaurant (verified copy + hours) ──────────────────────────────── */
export const RESTAURANT = {
  title: 'Veitingastaðurinn',
  body: 'Veitingastaðurinn á Hótel Búðum hefur getið sér gott orð fyrir matargerð þar sem íslenskt gæðahráefni frá nágrönnunum á Snæfellsnesi er í aðalhlutverki. Lambakjöt og ferskur fiskur bera matseðilinn uppi.',
  barLine: 'Bar og setustofa með stórbrotnu útsýni til allra átta.',
  hours: [
    { label: 'Morgunverður', value: '7:00–10:00 (jún–sep) · 8:00–10:00 (okt–maí)' },
    { label: 'Hádegismatur', value: '12:00–16:00' },
    { label: 'Kvöldverður', value: '18:00–21:00' },
    { label: 'Bar', value: '11:00–23:00' },
  ],
}

/* ── Sagan — only dated facts from their own history page ────────────── */
export const SAGA = {
  title: 'Frá verslunarstað að hóteli',
  steps: [
    {
      era: '17. öld',
      text: 'Búðir eru verslunar- og útgerðarstaður. Við Búðaós var landtökustaður skipa allt frá landnámi.',
    },
    {
      era: '1945',
      text: 'Átthagafélag Snæfellsness og Hnappadals kaupir gamalt íbúðarhús á Búðum fyrir 6.000 krónur, húsið stóð til að rífa. Vegur er lagður, vatni veitt inn og gistiheimilið Búðir verður til.',
    },
    {
      era: 'Í dag',
      text: 'Sveitahótel í Búðahrauni með veitingastað sem sækir hráefnið til nágrannanna, og svörtu kirkjuna á sama tanga.',
    },
  ],
}

/* ── Weddings (big nav item on their site) ───────────────────────────── */
export const WEDDINGS = {
  title: 'Brúðkaup á Búðum',
  body: 'Svarta kirkjan, hraunið og hafið hafa gert Búðir að einum eftirsóttasta brúðkaupsstað landsins. Hótelið tekur á móti veislum, fundum og viðburðum allt árið.',
  cta: 'Senda fyrirspurn',
}

/* ── The place — what is literally around the building ───────────────── */
export const PLACE = {
  title: 'Staðurinn',
  body: 'Hótelið stendur eitt í Búðahrauni, á milli gullins sands í fjörunni og Snæfellsjökuls. Nágrannarnir eru ósinn, fuglarnir og svarta kirkjan.',
}

/* ── Photo registry (all their own shoot) ────────────────────────────── */
export const PHOTOS = {
  heroWater: { file: 'hotel-church-water.webp', alt: 'Hótel Búðir og svarta kirkjan séð yfir vatnið á kyrru síðdegi.' },
  coast: { file: 'coast-wide.webp', alt: 'Strandlengjan við Búðir, fjallgarðurinn og ósinn í vetrarbirtu.' },
  aerial: { file: 'aerial-river.webp', alt: 'Loftmynd af ánni sem liðast um Búðahraun með Snæfellsjökul í fjarska.' },
  snow: { file: 'hotel-snow.webp', alt: 'Hótel Búðir í snjó undir þungbúnum vetrarhimni.' },
  churchHill: { file: 'church-hill.webp', alt: 'Svarta kirkjan á Búðum stendur ein á grasi vaxinni hæð.' },
  churchGrass: { file: 'hotel-church-grass.webp', alt: 'Hótelið og svarta kirkjan á grænum tanga, blóm í forgrunni.' },
  beach: { file: 'beach-gold.webp', alt: 'Gullinn sandur í fjörunni við Búðir, fjöll við sjóndeildarhring.' },
  loungeSheepskin: { file: 'lounge-sheepskin.webp', alt: 'Tveir gæruklæddir stólar við lítið borð í bjartri setustofu.' },
  loungeWindow: { file: 'lounge-window.webp', alt: 'Setustofa með hægindastólum við stóra glugga.' },
  barTeal: { file: 'bar-teal.webp', alt: 'Barinn með grænum flísum, messinglömpum og háum barstólum.' },
  loungeGallery: { file: 'lounge-gallery.webp', alt: 'Setustofa með myndavegg, leðursófum og síldarbeinsparketi.' },
  roomAttic: { file: 'room-attic.webp', alt: 'Bjart herbergi undir súð með tvíbreiðu rúmi og bekk.' },
  roomBed: { file: 'room-bed.webp', alt: 'Hótelherbergi með uppábúnu rúmi og svörtum vegglömpum.' },
  suiteTub: { file: 'suite-tub.webp', alt: 'Svíta með baðkari við gluggann og borðstofuborði.' },
  eventHall: { file: 'event-hall.webp', alt: 'Langborð dekkað fyrir veislu í sal með hringstiga og útsýni.' },
  fireplace: { file: 'fireplace.webp', alt: 'Kampavín í kæli við arininn, tréskip á hillu.' },
  plateFish: { file: 'plate-fish.webp', alt: 'Fiskréttur á steindiski með grænum aspas og froðu.' },
  breakfast: { file: 'breakfast.webp', alt: 'Morgunverður: kaffi, croissant, lummur og skyr á bláu mynstruðu borði.' },
  tableSetting: { file: 'table-setting.webp', alt: 'Dekkað borð á veitingastaðnum, glös og hnífapör í hvítri birtu.' },
  wallOlive: { file: 'wall-olive.webp', alt: 'Ólífugrænn veggur með hvítum lampa og bakka á litlu borði.' },
} as const

export type PhotoKey = keyof typeof PHOTOS

/* ── SEO ─────────────────────────────────────────────────────────────── */
export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: 'Hótel Búðir',
  description:
    'Sveitahótel í Búðahrauni á Snæfellsnesi, við hlið svörtu kirkjunnar á Búðum. Veitingastaður með íslenskt hráefni úr héraði.',
  url: 'https://www.hotelbudir.is',
  email: EMAIL,
  telephone: '+354 435 6700',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Snæfellsbær',
    postalCode: '356',
    addressCountry: 'IS',
  },
}
