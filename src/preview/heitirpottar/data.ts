/**
 * HEITIRPOTTAR.IS — "GUFA" (steam)
 * A digital showroom at dusk: basalt-black canvas, the products photographed
 * like cars in a night showroom, one ember accent carrying every call to action.
 *
 * Shopify migration contract (Path 1 — custom Liquid theme):
 * - Every exported list below maps to a Liquid section's blocks/settings.
 * - ShopProduct mirrors the Shopify product object (handle, title, type,
 *   price, compare_at_price, featured_image) so each card can be rendered
 *   from {{ product }} without reshaping data.
 * - All titles, prices, compare-at prices and copy fragments are REAL,
 *   pulled from heitirpottar.is/products.json on 2026-07-02.
 * - Images are served from the store's own Shopify CDN (?width= transforms).
 */

/** Mirrors the Shopify product object — migrates to {{ product }} in Liquid. */
export interface ShopProduct {
  handle: string
  title: string
  type: string
  price: number
  compareAtPrice: number | null
  image: string
  alt: string
}

export interface HeroSlide extends ShopProduct {
  /** responsive candidates for the full-bleed image */
  srcSet: string
  blurb: string
  badge?: string
}

export interface CategoryTile {
  title: string
  note: string
  url: string
  image: string
  alt: string
  /** render as photo tile (cover) instead of cutout tile (contain) */
  photo: boolean
}

export interface DealProduct extends ShopProduct {
  /**
   * Styled scene shot (composited from the store's own product photo).
   * When absent the card stages the raw cutout on a lit plinth instead.
   */
  scene?: string
}

/** Shopify CDN image transform — no-op for local theme assets. */
export const cdn = (src: string, width: number) =>
  src.startsWith('http') ? `${src}${src.includes('?') ? '&' : '?'}width=${width}` : src

/** "795.000 kr." — Icelandic dot separators, locale-independent. */
export const kr = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} kr.`

export const productUrl = (handle: string) => `https://heitirpottar.is/products/${handle}`

const F = 'https://heitirpottar.is/cdn/shop/files'
const S = 'https://cdn.shopify.com/s/files/1/0765/8206/0351/files'

/**
 * Local scene shots: the store's own product photos composited into
 * night scenes (Higgsfield, product geometry untouched), optimized JPGs
 * in public/heitirpottar/. In the Liquid migration these become theme
 * assets ({{ 'iris-hero.jpg' | asset_img_url }}).
 */
const pub = (file: string) => `${import.meta.env.BASE_URL}heitirpottar/${file}`

/* ---------------------------------------------------------------- hero */

const queenImg = `${S}/IMG_0753.jpg?v=1774555823`
const thingvellirImg = `${S}/Foto_SiimSolman_008.jpg?v=1774088031`

export const HERO_SLIDES: HeroSlide[] = [
  {
    handle: 'agust-forpontun-queen-pakki',
    title: 'Queen pakkinn',
    type: 'Hitaveituskel',
    price: 695000,
    compareAtPrice: 873000,
    image: cdn(queenImg, 1600),
    srcSet: `${cdn(queenImg, 828)} 828w, ${cdn(queenImg, 1280)} 1280w, ${cdn(queenImg, 2000)} 2000w`,
    alt: 'Queen hitaveituskel í notkun í kvöldbirtu með kertaljósum',
    blurb: 'Mest selda skelin í áratug, nú á pakkatilboði. Afgreidd í ágúst.',
    badge: 'Forpöntun',
  },
  {
    handle: 'iris',
    title: 'IRIS',
    type: 'Rafmagnspottur',
    price: 795000,
    compareAtPrice: 990000,
    image: pub('iris-hero.jpg'),
    srcSet: `${pub('iris-hero-md.jpg')} 1200w, ${pub('iris-hero.jpg')} 2000w`,
    alt: 'IRIS rafmagnspottur rjúkandi á dimmum palli í snjó við hlið húss',
    blurb: '3ja manna pottur með tveimur legubekkjum, hljóðkerfi og Bluetooth.',
    badge: 'Tilboð',
  },
  {
    handle: 'thingvellir',
    title: 'Þingvellir',
    type: 'Saunahús',
    price: 6050000,
    compareAtPrice: null,
    image: cdn(thingvellirImg, 1600),
    srcSet: `${cdn(thingvellirImg, 828)} 828w, ${cdn(thingvellirImg, 1280)} 1280w, ${cdn(thingvellirImg, 2000)} 2000w`,
    alt: 'Þingvellir saunahús upplýst í snjó að kvöldi til',
    blurb: 'Flaggskipið. Fjögurra metra saunahús fyrir þá sem gera hámarkskröfur.',
  },
  {
    handle: 'vaentanlegt-ice-queen-kaldi-pottur-plug-play',
    title: 'IceQueen Plug&Play',
    type: 'Kaldur pottur',
    price: 299000,
    compareAtPrice: 420000,
    image: pub('icequeen-hero.jpg'),
    srcSet: `${pub('icequeen-hero-md.jpg')} 1200w, ${pub('icequeen-hero.jpg')} 2000w`,
    alt: 'IceQueen kaldur pottur á steinhellum í snjó undir norðurljósum',
    blurb: 'Hannaður fyrir íslenskar aðstæður. Nýtist sem kaldur eða heitur pottur.',
    badge: 'Tilboð',
  },
  {
    handle: 'forpontun-fbg-481',
    title: 'FBG-481',
    type: 'Infrarauður inniklefi',
    price: 449490,
    compareAtPrice: 530400,
    image: pub('fbg481-hero.jpg'),
    srcSet: `${pub('fbg481-hero-md.jpg')} 1200w, ${pub('fbg481-hero.jpg')} 2000w`,
    alt: 'FBG-481 infrarauður inniklefi lýsir upp dimmt heimilisrými',
    blurb: '4ra manna inniklefi með A, B og C bylgjutíðni. Ný sending komin.',
    badge: 'Ný sending',
  },
]

/* ---------------------------------------------------------- categories */

export const CATEGORIES: CategoryTile[] = [
  {
    title: 'Heitir pottar',
    note: 'Rafmagnspottar og saltvatnspottar',
    url: 'https://heitirpottar.is/collections/allir-pottar',
    image: `${F}/njota_2_b375b88f-08b1-43d6-9224-9b94551decee.jpg`,
    alt: 'Par í heitum potti í snjóþungu fjallalandslagi í rökkri',
    photo: true,
  },
  {
    title: 'Saunahús',
    note: 'Forseti, Alþingi, Bessastaðir og Þingvellir',
    url: 'https://heitirpottar.is/collections/saunahus',
    image: `${F}/MOODEM4You_mood_photo_3.png`,
    alt: 'Svart saunahús upplýst að innan undir stjörnubjörtum næturhimni',
    photo: true,
  },
  {
    title: 'Kaldir pottar',
    note: 'IceQueen og Vastera',
    url: 'https://heitirpottar.is/collections/kaldir-pottar',
    image: pub('icequeen-hero-md.jpg'),
    alt: 'IceQueen kaldur pottur í snjó undir norðurljósum',
    photo: true,
  },
  {
    title: 'Infrared',
    note: 'Inniklefar með A, B og C tíðni',
    url: 'https://heitirpottar.is/collections/infrared-inniklefar',
    image: pub('fbg2r7-card.jpg'),
    alt: 'Infrarauður inniklefi með rauðljósum í dimmu rými',
    photo: true,
  },
  {
    title: 'Aukahlutir',
    note: 'Pottalok, síur, hreinsiefni og ilmir',
    url: 'https://heitirpottar.is/collections/aukahlutir',
    image: `${S}/Foto_SiimSolman_011.jpg?v=1774283614`,
    alt: 'Saunasteinar í körfu í hlýrri birtu',
    photo: true,
  },
  {
    title: 'Góðir dílar',
    note: 'Tilboð á pottum, skeljum og klefum',
    url: 'https://heitirpottar.is/collections/godir-dilar',
    image: `${S}/SUMMITSkelhvit-Photoroom.png?v=1779098823`,
    alt: 'Hvít Summit hitaveituskel',
    photo: false,
  },
]

/* --------------------------------------------------------------- deals */

export const DEALS: DealProduct[] = [
  {
    handle: 'dill-aldarinnar-b-skel-summit-pottalok',
    title: 'B-Skel Summit + pottalok',
    type: 'Hitaveituskel',
    price: 420000,
    compareAtPrice: 750000,
    image: `${S}/SUMMITSkelhvit-Photoroom.png?v=1779098823`,
    alt: 'Hvít Summit hitaveituskel fyrir sex, B-vara',
  },
  {
    handle: 'iris',
    title: 'IRIS',
    type: 'Rafmagnspottur',
    price: 795000,
    compareAtPrice: 990000,
    image: `${S}/IrisD_1.png?v=1774284583`,
    scene: pub('iris-card.jpg'),
    alt: 'IRIS rafmagnspottur rjúkandi á dimmum palli í snjó',
  },
  {
    handle: 'san-marino',
    title: 'San Marino',
    type: 'Rafmagnspottur',
    price: 795000,
    compareAtPrice: 990000,
    image: `${S}/SanMarino_1_-Photoroom_1_6e85bc74-d162-4d92-a954-5bc47d98f65b.png?v=1774270516`,
    scene: pub('sanmarino-card.jpg'),
    alt: 'San Marino rafmagnspottur á palli í snjókomu undir ljósaseríu',
  },
  {
    handle: 'forpontun-fbg-481',
    title: 'FBG-481',
    type: 'Infrarauður inniklefi',
    price: 449490,
    compareAtPrice: 530400,
    image: `${S}/FBG-481_2_-Photoroom.png?v=1774266764`,
    scene: pub('fbg481-card.jpg'),
    alt: 'FBG-481 infrarauður inniklefi lýsir upp dimmt rými',
  },
  {
    handle: 'forpontun-frb-033lv',
    title: 'Hornklefi FRB-0033LV',
    type: 'Infrarauður inniklefi',
    price: 345490,
    compareAtPrice: 420900,
    image: `${S}/FRB-033LV_2_-Photoroom.png?v=1755945871`,
    scene: pub('hornklefi-card.jpg'),
    alt: 'Infrarauður hornklefi glóir í horni á dimmu rými',
  },
  {
    handle: 'forpontun-frb-2r7',
    title: 'FBG-2R7 + Red Light',
    type: 'Infrarauður inniklefi',
    price: 325490,
    compareAtPrice: 376400,
    image: `${S}/FBG-2R7_1_-Photoroom.png?v=1755621724`,
    scene: pub('fbg2r7-card.jpg'),
    alt: 'FBG-2R7 inniklefi með rauðljósum í dimmu rými',
  },
  {
    handle: 'forpontun-frb-3r8',
    title: 'FRB-3R8',
    type: 'Infrarauður inniklefi',
    price: 343490,
    compareAtPrice: 393900,
    image: `${S}/FRB-3R8_1_-Photoroom.png?v=1755622326`,
    scene: pub('frb3r8-card.jpg'),
    alt: 'FRB-3R8 inniklefi með gulu gleri í dimmu rými',
  },
]

/* ----------------------------------------------------------- hitaveita */

export const HITAVEITA_IMAGE = {
  src: pub('summitskel-hitaveita.jpg'),
  alt: 'Marmaragrá hitaveituskel felld ofan í dimman pall, gufa yfir vatninu',
}

export const STEAM_IMAGE = {
  src: pub('steam-band.jpg'),
  alt: 'Gufa stígur upp af heitu vatni í íslenskri vetrarnótt',
}

export const HITAVEITA_TUBS: ShopProduct[] = [
  {
    handle: 'timberwolf-hitaveitupottur-hvitur',
    title: 'Timberwolf',
    type: '3ja manna',
    price: 950000,
    compareAtPrice: null,
    image: '',
    alt: '',
  },
  {
    handle: 'eagle-hitaveitupottur-dakota',
    title: 'Eagle',
    type: '5 manna',
    price: 1280000,
    compareAtPrice: null,
    image: '',
    alt: '',
  },
  {
    handle: 'mustang-hitaveitupottur-dakota',
    title: 'Mustang',
    type: '5 manna',
    price: 1330000,
    compareAtPrice: null,
    image: '',
    alt: '',
  },
  {
    handle: 'summit-hitaveitupottur-dakota-1',
    title: 'Summit',
    type: '5 manna',
    price: 1330000,
    compareAtPrice: null,
    image: '',
    alt: '',
  },
]

/* ------------------------------------------------------------ saunahús */

export const SAUNA_IMAGES = {
  interior: { src: `${S}/Saun3_5_1_1.jpg?v=1774283170`, alt: 'Sedrusviður og bekkir inni í Alþingi saunahúsinu' },
  night: { src: `${S}/Foto_SiimSolman_009.jpg?v=1774088031`, alt: 'Tvö saunahús upplýst í snjó að nóttu' },
}

export const SAUNA_HOUSES: (ShopProduct & { capacity: string })[] = [
  {
    handle: 'forseti',
    title: 'Forseti',
    type: 'Saunahús',
    capacity: 'Allt að 3, passar á pallinn',
    price: 1700000,
    compareAtPrice: null,
    image: '',
    alt: '',
  },
  {
    handle: 'althingi-saunahus',
    title: 'Alþingi',
    type: 'Saunahús',
    capacity: 'Allt að 5 í einu',
    price: 1910000,
    compareAtPrice: null,
    image: '',
    alt: '',
  },
  {
    handle: 'althingi-med-verond',
    title: 'Alþingi með verönd',
    type: 'Saunahús',
    capacity: 'Allt að 5, með verönd',
    price: 2180000,
    compareAtPrice: null,
    image: '',
    alt: '',
  },
  {
    handle: 'bessastadir-1',
    title: 'Bessastaðir',
    type: 'Útiklefi',
    capacity: '5 manna, efsta hillan',
    price: 3450000,
    compareAtPrice: null,
    image: '',
    alt: '',
  },
  {
    handle: 'thingvellir',
    title: 'Þingvellir',
    type: 'Saunahús',
    capacity: 'Fjögurra metra flaggskip',
    price: 6050000,
    compareAtPrice: null,
    image: '',
    alt: '',
  },
]

/* ------------------------------------------------------------ infrared */

export const INFRARED_IMAGE = {
  src: `${F}/infrared_sauna_8fe7f37c-f5b4-4101-a444-66ddb30c23d8.jpg`,
  alt: 'Manneskja í rauðri birtu infrarauðs klefa',
}

/* --------------------------------------------------------- reviews etc */

export const REVIEWS_IMAGE = {
  src: `${F}/IMG_3107.jpg`,
  alt: 'Fjölskylda saman í heitum potti',
}

export interface Review {
  quote: string
  name: string
  /** Reviewer location, Google-review style. */
  detail: string
}

/**
 * Sample reviews for the Google-style umsagnir wall — disclaimed as sýnishorn
 * in the shared preview footer. The store's own Google reviews are not printed
 * on their current site, but the recurring themes here (fast install, helpful
 * staff, fair price, geothermal/sauna/infrared range) mirror the real feedback
 * their profile carries and their own "fimm stjörnu þjónusta" positioning. On a
 * live Shopify build this section is wired to their real Google Business feed.
 */
export const REVIEWS: Review[] = [
  {
    quote: 'Frábær þjónusta og ótrúlega hjálplegt starfsfólk. Potturinn kom á umsömdum tíma og var tengdur fyrir okkur.',
    name: 'Guðrún S.',
    detail: 'Reykjavík',
  },
  {
    quote: 'Toppþjónusta og toppmenn. Fengum ráðgjöf sem sparaði okkur bæði tíma og pening.',
    name: 'Kristján Þór',
    detail: 'Kópavogur',
  },
  {
    quote: 'Ískalt á morgnana og fjörutíu gráður á kvöldin. Besta fjárfesting sem heimilið hefur gert.',
    name: 'Þorsteinn E.',
    detail: 'Hafnarfjörður',
  },
  {
    quote: 'Saunahúsið stóð klárt í garðinum viku eftir að við kíktum í búðina. Útkoman fór fram úr væntingum.',
    name: 'Már og Helga',
    detail: 'Garðabær',
  },
  {
    quote: 'Gott úrval, sanngjarnt verð og allt útskýrt í þaula. Mæli hiklaust með þeim.',
    name: 'Anna Lísa B.',
    detail: 'Reykjavík',
  },
  {
    quote: 'Keyptum hitaveituskel og fengum hana heimsenda samdægurs. Þjónustan er í sérflokki.',
    name: 'Sigurður H.',
    detail: 'Selfoss',
  },
  {
    quote: 'Infrarauði klefinn hefur gjörbreytt kvöldunum okkar. Frágangur allur til fyrirmyndar.',
    name: 'Elín R.',
    detail: 'Mosfellsbær',
  },
  {
    quote: 'Starfsfólkið gaf sér tíma í að finna réttan pott fyrir pallinn okkar. Ekkert vesen, bara lausnir.',
    name: 'Jón Ólafur',
    detail: 'Reykjanesbær',
  },
  {
    quote: 'Verðið kom skemmtilega á óvart og gæðin leyna sér ekki. Við notum pottinn nánast á hverju kvöldi.',
    name: 'Harpa D.',
    detail: 'Akureyri',
  },
]

export const SHOWROOM_IMAGE = {
  src: `${F}/69A0743-Edit-Edit.jpg`,
  alt: 'Úr verslun Heitirpottar.is, pottar til sýnis og viðurkenningar á vegg',
}

export const PHONES = [
  { label: 'Verslun', number: '777 2000', tel: '+3547772000' },
  { label: 'Aðstoð', number: '777 2001', tel: '+3547772001' },
  { label: 'Fyrirspurnir', number: '777 2002', tel: '+3547772002' },
]

export const SOCIALS = [
  { label: 'Instagram', url: 'https://www.instagram.com/heitirpottar.is/' },
  { label: 'Facebook', url: 'https://www.facebook.com/heitirpottar/' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@heitirpottar' },
  { label: 'YouTube', url: 'https://www.youtube.com/channel/UCJLVTOWYIc6azaEunPPf2vw' },
]
