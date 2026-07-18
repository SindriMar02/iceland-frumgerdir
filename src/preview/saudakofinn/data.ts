/**
 * Sauðakofinn á Fossnesi — "Reykurinn í kofanum"
 *
 * Every fact, price, name and quote below is sourced from fossnes.is (raw HTML,
 * fetched 2026-07-18) or the Beint frá býli listing (beintfrabyli.is/byli/fossnes,
 * "Verð haustið 2025"). Nothing invented: no founding year, no smoking-fuel claim,
 * no Hekla view, no fishing-licence price, no fabricated reviews.
 *
 * Concept: the old smoke shed sets the page's rhythm. The visitor lands in the
 * dark smoke chapter (product + price list + ordering ritual) within the first
 * screen, then the page clears into the farm's other real chapters underneath.
 */

/* ── Contact (fossnes.is footer, every page) ─────────────────────────────── */
export const OWNER = 'Sigrún Bjarnadóttir'
export const ADDRESS = 'Fossnes, 804 Selfoss'
export const MUNICIPALITY = 'Skeiða- og Gnúpverjahreppur'
export const PHONE_1 = '486-6079'
export const PHONE_1_HREF = 'tel:+3544866079'
export const PHONE_2 = '895-8079'
export const PHONE_2_HREF = 'tel:+3548958079'
export const EMAIL = 'sigrunfossnes@gmail.com'
export const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('Pöntun frá vefsíðu Sauðakofans')}`
export const TAGLINE = 'Ferðaþjónusta og sauðfjárrækt'

/* ── Local real photography (downloaded from fossnes.is, copied to public/) ── */
export const asset = (file: string) => `${import.meta.env.BASE_URL}saudakofinn/${file}`

export const IMG = {
  /** 517×800 — the ONLY real product photo in existence; use small, never blown up */
  product: asset('fossnes-01.jpg'),
  /** 1000×667 — real Fossnes farmhouse exterior */
  farmhouse: asset('fossnes-02.jpg'),
  /** 1000×1333 — real herd of Icelandic horses on the farm */
  horses: asset('fossnes-03.jpg'),
  /** 1000×748 — real river-valley landscape (Þverá lowland) */
  riverValley: asset('fossnes-04.jpg'),
  /** 1000×748 — Icelandic flag + grazing sheep on the home pasture */
  flagSheep: asset('fossnes-05.jpg'),
  /** 1000×750 — Svartagljúfur canyon in winter (named on fossnes.is) */
  svartagljufur: asset('fossnes-07.jpg'),
  /** 2288×1712 — planted forestry creek, matches "skógrækt síðan 1993" copy */
  forestry: asset('fossnes-08.jpg'),
  /** 2048×1360 — Bæjargljúfur canyon, top of the fishing beat (named on-site) */
  baejargljufur: asset('fossnes-12.jpg'),
  /** 2000×1500 — regional Þjórsárdalur waterfall (NOT on-farm; caption honestly) */
  waterfallRegional: asset('fossnes-14.jpg'),
  /** 2000×1500 — second regional waterfall, drier season */
  waterfallAlt: asset('fossnes-15.jpg'),
  /** 2000×1500 — sunlit canyon with hiker and dog, walking-tours storytelling */
  canyonHiker: asset('fossnes-16.jpg'),
} as const

/* ── Unsplash atmosphere (mood/texture ONLY, never captioned as Fossnes) ──── */
export const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&fm=jpg&fit=crop`
/** Close-up of embers/fire in a pot — Wallace Fonseca (clean photo- id) */
export const UIMG_EMBERS = u('photo-1686795435930-daec9c115045', 1200)
/** Pale smoke rising against dark trees — Jeferson Santu (clean photo- id) */
export const UIMG_SMOKE = u('photo-1646176401809-0b0e165b1ef1', 1600)

/* ── Sauðakofinn — the product (fossnes.is/saudakofinn, verbatim-grounded) ── */
export const PRODUCT_INTRO =
  'Sauðakofinn framleiðir reykt sauðakjöt og fleira gott úr reykhúsinu á Fossnesi. Sauðakjöt er kjöt af veturgömlum kindum sem hafa verið fóðraðar í einn vetur og hrútarnir geldir.'
export const PRODUCT_CLAIM =
  'Kjötið er sérlega bragðmikið og þykir herramannsmatur.'
export const CUSTOM_SMOKING =
  'Einnig er tekið kjöt í reyk frá fólki.'

export interface PriceRow {
  name: string
  note?: string
  price: string
}

/** The four live prices on the Icelandic page, matching "Verð haustið 2025"
 *  on the Beint frá býli listing. Never the stale English-page numbers. */
export const PRICES: PriceRow[] = [
  { name: 'Tvíreykt sauðalæri', note: 'hrátt kjöt', price: '4.500 kr/kg' },
  { name: 'Reyktir frampartar', note: 'með beini', price: '3.200 kr/kg' },
  { name: 'Hangirúlla frampartur', price: '3.800 kr/kg' },
  {
    name: 'Tvíreyktir sauðahryggir',
    note: 'hrátt kjöt, seldir í u.þ.b. 300 g umbúðum',
    price: '7.500 kr/kg',
  },
]
export const PRICES_LABEL = 'Verð haustið 2025'
export const PRICES_NOTE =
  'Verð samkvæmt fossnes.is og skráningu hjá Beint frá býli. Staðfestið verð við pöntun.'
export const ORDER_LINE =
  'Sendu okkur pöntun í síma eða á netfangið og við tökum vel á móti þér.'

/* ── Sauðfjárræktin (fossnes.is, verbatim-grounded) ──────────────────────── */
export const SHEEP_COPY = [
  'Á bænum er stundaður sauðfjárbúskapur, um 200 ær ásamt hrútum og fylgdarliði. Ærnar ganga í heimahögum á sumrin en Fossnes er stór og góð fjallajörð sem hentar vel til sauðfjárræktar.',
  'Margir góðir verðlauna kynbótahrútar og ær hafa komið frá búinu. Féð er kjötmikið og fitulítið, gengur í heimahögum og er smalað heim um mánaðamótin september og október.',
]
export const SHEEP_FACTS = [
  { value: 'Um 200', label: 'ær ásamt hrútum og fylgdarliði' },
  { value: 'Verðlaunafé', label: 'kynbótahrútar og ær frá búinu' },
  { value: 'Sept. til okt.', label: 'féð smalað heim af fjalli' },
] as const
export const TRUST_LINE = 'Skráður aðili hjá Beint frá býli.'

/* ── Landið / skógrækt (fossnes.is Gönguferðir page; dated anchors only) ─── */
export const LAND_COPY =
  'Skógrækt hefur verið stunduð á jörðinni frá árinu 1993. Þar má finna lerki, birki, sitkagreni og furu. Landgræðsla hefur verið stunduð frá 1992 og hafa melar og rofabörð gróið vel upp.'
export const LAND_ANCHORS = [
  { value: '1992', label: 'Landgræðsla stunduð frá' },
  { value: '1993', label: 'Skógrækt stunduð frá' },
] as const

/* ── Gisting (fossnes.is/gisting, "Verðskrá 2026" on the page itself) ────── */
export const STAY_COPY = [
  'Á efri hæð hússins er nýuppgerð séríbúð fyrir 8 til 10 manns ásamt eldhúsi, klósetti og sturtu. Á miðhæðinni er stórt eldhús og góð aðstaða fyrir 20 manns í mat.',
  'Í kjallaranum eru tvö herbergi fyrir 3 til 4 gesti. Úti eru tvö 10 fermetra gestahús með góðum rúmum fyrir tvo í hvoru húsi. Í garðinum er svo heitur pottur fyrir 8 til 10 manns.',
  'Mjög stutt er í Þjórsárdalinn, sundlaugar og hvers kyns afþreyingu.',
]
export const STAY_PRICES: PriceRow[] = [
  { name: 'Uppábúið rúm', note: '1. júní til 30. september', price: '10.000 kr/nótt' },
  { name: 'Uppábúið rúm', note: '1. október til 31. maí', price: '8.000 kr/nótt' },
  { name: 'Svefnpokapláss', note: 'sumar', price: '8.500 kr/nótt' },
  { name: 'Svefnpokapláss', note: 'vetur', price: '6.000 kr/nótt' },
  { name: 'Börn yngri en 12 ára', price: '4.500 kr/nótt' },
  { name: 'Börn 0 til 4 ára', price: 'Frítt' },
  { name: 'Hagabeit fyrir hrossið', price: '600 kr/nótt' },
]
export const STAY_PRICES_LABEL = 'Verðskrá 2026'
export const STAY_NOTE =
  'Hægt er að fá bæði svefnpokapláss og uppábúin rúm. Hópar geta eldað fyrir sig.'

/* ── Hestar (fossnes.is/hestar) ──────────────────────────────────────────── */
export const HORSES_COPY = [
  'Á bænum eru til nokkur góð hross og gott hesthús ásamt trippauppeldi. Ef áhugi er á að skreppa á hestbak má alltaf hringja.',
  'Frábærar reiðleiðir eru í boði, stutt í fjallaskálana og inn í Þjórsárdal. Einnig eru tekin ferðahross í hagabeit og kostar nóttin 600 kr.',
]
export const HORSES_CTA = 'Hringið til að bóka útreiðartúr'

/* ── Veiði (fossnes.is/veidi; no licence price published, none invented) ─── */
export const FISHING_COPY = [
  'Í Þveránni sem rennur við bæinn er hægt að kaupa veiðileyfi fyrir eina til tvær stangir. Í ánni er að finna urriða og bleikju, og svo lax síðsumars.',
  'Veiðisvæði árinnar er um einn kílómetri að lengd, frá Þjórsá að fossinum í Bæjargljúfrinu.',
]
export const FISHING_FACTS = [
  { label: 'Veiðitímabil', value: '1. apríl til 1. október' },
  { label: 'Áin leigð', value: '15. júlí til 1. október' },
  { label: 'Stangir', value: '1 til 2' },
  { label: 'Tegundir', value: 'Urriði, bleikja og lax síðsumars' },
] as const
export const FISHING_CTA = 'Hafið samband fyrir verð á veiðileyfi'

/* ── Gönguferðir / nágrenni (fossnes.is; named places only) ──────────────── */
export const WALKS_COPY =
  'Góður jeppaslóði liggur inn Fossneshaga, alveg inn að Sneplafossi, og frábært er að ganga inn með Þveránni. Glæsileg gljúfur eru við bæinn sem heita Bæjargljúfur og Stöðlagljúfur, og Svartagljúfur er rétt fyrir innan bæinn.'
export const PLACES = ['Sneplafoss', 'Bæjargljúfur', 'Stöðlagljúfur', 'Svartagljúfur'] as const

/* ── Honesty disclosure (page-local, above the shared preview footer) ────── */
export const HONESTY =
  'Þessi frumgerð er hönnunarhugmynd unnin upp úr birtum texta og ljósmyndum af fossnes.is. Verð eru tekin af fossnes.is og beintfrabyli.is í júlí 2026 og skal staðfesta þau beint við Sigrúnu áður en pöntun er gerð. Engar umsagnir gesta birtast hér þar sem engar fundust staðfestar á vefnum.'
