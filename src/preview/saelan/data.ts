/**
 * Sælan (saelan.is) — verified content only.
 * Sources: saelan.is (fetched 2026-07-04), Noona listing, Repeat.is checkout links.
 * Prices are the salon's own published prices; disclaimed as prototype in the footer.
 */

export const NOONA = 'https://noona.is/saelansolbadsstofa'
export const PHONE_DISPLAY = '544 2424'
export const PHONE_HREF = 'tel:+3545442424'
export const EMAIL = 'saelan@saelan.is'
export const MAPS = 'https://maps.google.com/?q=Faxafen+10,+108+Reykjav%C3%ADk'

export const REPEAT_PORTAL = 'https://repeat.is/audkenning/verslun/5a6b4f99-b7fd-4c2e-8ff7-6d1ec4052190'
const REPEAT_BASE = 'https://repeat.is/repeat_checkout/5a6b4f99-b7fd-4c2e-8ff7-6d1ec4052190/'
const REPEAT_TAIL = '&products.0.quantity=1&currency=ISK&language=is&interval_type=MONTH&interval_count=1'

export const SOCIAL = {
  facebook: 'https://www.facebook.com/profile.php?id=61580652401262',
  instagram: 'https://www.instagram.com/saelan1',
  instagramSpray: 'https://www.instagram.com/spraytan.is',
}

/** Real photos from saelan.is, self-hosted and compressed (reused assets, zero new generation) */
const ASSET = `${import.meta.env.BASE_URL}img/saelan/`
export const IMG = {
  logo: `${ASSET}logo.png`,
  bedLifestyle: `${ASSET}bed-lifestyle.jpg`, // Ergoline Prestige 1400 lifestyle shot (hero)
  bedK11: `${ASSET}bed-k11.png`, // KBL K11 Air Loft, official product cutout (transparent)
  bedK11Room: `${ASSET}bed-k11-room.jpg`, // K11 Air Loft, dark studio 3/4 view
  bedPrestige: `${ASSET}bed-prestige.png`,
  bedGlow: `${ASSET}bed-ergoline.jpg`, // real salon photo of their Ergoline (amber neon)
  bedGlow2: `${ASSET}bed-led.jpg`, // real salon photo of their Ergoline (blue/purple LED)
  storefront: `${ASSET}storefront.jpg`,
  products7suns: `${ASSET}products-7suns.jpg`,
  products7suns2: `${ASSET}products-7suns-2.jpg`,
}

/** The two beds, copy grounded in the salon's own descriptions */
export const BEDS = [
  {
    id: 'k11',
    name: 'KBL K11 Air Loft',
    claim: 'ALL LED bekkur af nýjustu kynslóð',
    body:
      'SunControl leyfir þér að sérsníða brúnkuna og SunFinity LED tæknin skilar 26% meira UVA og 33% meira UVB á andlit og háls. Loft Infinity speglar og kæling fyrir andlit og líkama gera tímann að hreinni slökun.',
    specs: ['ALL LED', 'SunControl sérsníðing', '+26% UVA á andlit', 'Kæling fyrir andlit og líkama'],
    image: IMG.bedK11Room,
    alt: 'KBL K11 Air Loft ljósabekkurinn',
  },
  {
    id: 'prestige',
    name: 'Ergoline Prestige 1400',
    claim: 'Ný kynslóð ljósabekkja',
    body:
      'Intelligent Performance kerfið stillir styrk UV ljóssins eftir líkamsstöðu og tryggir jafna og djúpa brúnku. LED ljósasýning með yfir 200 litum og Comfort Cooling Plus kæling gera hverja mínútu þægilega.',
    specs: ['Intelligent Performance', 'Jöfn og djúp brúnka', 'LED ljósasýning', 'Comfort Cooling Plus'],
    image: IMG.bedGlow,
    alt: 'Ergoline Prestige 1400 ljósabekkurinn í Sælunni',
  },
]

export interface PriceRow {
  label: string
  minutes: string
  day: number
  morning: number
}

/** Verðlisti — dagverð 14–23, morgunverð 10–14 (published on saelan.is) */
export const TIMES: PriceRow[] = [
  { label: 'Hálfur tími', minutes: '7 mín', day: 2390, morning: 2190 },
  { label: 'Stakur tími', minutes: '10 mín', day: 2590, morning: 2390 },
  { label: 'Stakur tími', minutes: '14 mín', day: 2790, morning: 2590 },
  { label: 'Stakur tími', minutes: '16 mín', day: 2990, morning: 2790 },
  { label: 'Einn og hálfur', minutes: '21 mín', day: 4290, morning: 3790 },
]

export const CARDS = [
  { label: '5 tíma kort', day: 12900, morning: 11900 },
  { label: '10 tíma kort', day: 23900, morning: 21900 },
  { label: '15 tíma kort', day: 32900, morning: 30900 },
]

export const K11_PRICES = [
  { label: 'Hálfur tími', minutes: '8 mín', price: 2690 },
  { label: 'Stakur tími', minutes: '12 mín', price: 2990 },
  { label: 'Einn og hálfur', minutes: '16 mín', price: 3890 },
]

export const PLANS = [
  {
    id: 'plan3',
    price: 7990,
    binding: '3 mánaða uppsagnarfrestur',
    pitch: 'Ódýrari leiðin fyrir þau sem vita að ljóminn er kominn til að vera.',
    href: `${REPEAT_BASE}?products.0.uuid=574669cf-5f93-4d0b-8bc9-8e6c2ffe7970${REPEAT_TAIL}`,
  },
  {
    id: 'plan1',
    price: 8990,
    binding: '1 mánaðar uppsagnarfrestur',
    pitch: 'Meiri sveigjanleiki, styttri binding, sama sól alla daga.',
    href: `${REPEAT_BASE}?products.0.uuid=81c5e6f2-6352-4972-b359-46b497f3fecf${REPEAT_TAIL}`,
  },
]

/** Subscription terms, stated up front on purpose (the honest sell) */
export const PLAN_TERMS = [
  'Einn ljósatími á dag, allt að 14 mínútur í senn',
  'Hreint handklæði fylgir alltaf',
  'Sagt upp fyrir 15. mánaðarins, annars endurnýjast áskriftin',
  '18 ára aldurstakmark og skilríki við komu',
]

/** Spraytan.is — the sub-brand inside Faxafen 10 */
export const SPRAY = {
  claim: 'Eina sjálfvirka spraytanið á Íslandi',
  intro:
    'VersaSpa PRO úðaklefinn gefur jafna og náttúrulega brúnku á örfáum mínútum, með raddleiðsögn skref fyrir skref. Klefinn er í Faxafeni 10, gengið inn í Sæluna.',
  prices: [
    { label: 'Einfaldur tími', price: 4990 },
    { label: 'Einfaldur tími plús auka umferð á lappir', price: 6500 },
  ],
  cards: [
    { label: '5 skipti', price: 19990, discount: '20% afsláttur' },
    { label: '10 skipti', price: 36900, discount: '26% afsláttur' },
  ],
  cardsNote: 'Skiptakortin fást í afgreiðslunni',
  levels: 'Þrjú styrkleikastig: vægt, miðlungs og dökkt',
  solutions: [
    { name: 'Monterey', tone: '#B5713F', line: 'Hlýr og klassískur bronslitur fyrir sólkyssta áferð.' },
    { name: 'Clear', tone: '#D8B48C', line: 'Litlaus við úðun, liturinn þróast fallega á næstu klukkustundum.' },
    { name: 'Venetian', tone: '#8E5B45', line: 'Kaldir fjólubláir undirtónar sem draga úr appelsínugulum blæ.' },
    { name: 'Vivid', tone: '#96501F', line: 'Djúpur bronslitur sem sést strax, fyrir viðburði og myndatökur.' },
  ],
}

/** Products retail — real brands they carry */
export const PRODUCTS = {
  headline: 'Australian Gold og 7Suns',
  body:
    'Sælan er söluaðili Australian Gold og 7Suns Cosmetics. Hágæða sólarkrem og sólarvörn sem henta bæði í ljósabekki og útiveru, með ilminum fræga Cocoa Dreams af kókos, appelsínu og vanillu.',
}

/** Skin-type guidance from the salon's own ráðleggingar page */
export const SKIN_TYPES = [
  { skin: 'Mjög ljós og freknótt húð', hair: 'Rautt hár', minutes: '6 til 8 mín' },
  { skin: 'Ljós og smá freknótt húð', hair: 'Ljóst hár', minutes: '8 til 10 mín' },
  { skin: 'Ljósbrún húð', hair: 'Dökkt hár', minutes: '10 til 12 mín' },
  { skin: 'Brún eða dökk húð', hair: 'Mjög dökkt hár', minutes: '12 til 15 mín' },
]

export const SAFETY = [
  'Byrjaðu stutt og lengdu tímann hægt og rólega',
  'Láttu 48 klukkustundir líða á milli tíma',
  'Notaðu alltaf hlífðargleraugu',
]

/** The story, told straight: 2002 heritage, back in Faxafen since Oct 2025 */
export const STORY = {
  headline: 'Sólin er komin aftur í Faxafenið',
  body:
    'Sælan á sér yfir tuttugu ára sögu, fyrsta stofan opnaði í Bæjarlind árið 2002 og önnur í Egilshöll 2015. Fyrsta október 2025 opnuðum við aftur, í Faxafeni 10, með nýjum bekkjum, spraytanklefa og sömu sól og sælu og alltaf.',
}

export const FACTS = [
  { big: '2002', small: 'Fyrsta stofan opnaði í Bæjarlind' },
  { big: '1. okt 2025', small: 'Opnuðum aftur í Faxafeni 10' },
  { big: 'Til 23:00', small: 'Opið fram á kvöld í Faxafeninu' },
]

export const ADDRESS = { street: 'Faxafen 10', town: '108 Reykjavík', hours: 'Opið til 23:00' }
