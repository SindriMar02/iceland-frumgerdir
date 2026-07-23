/* Hótel Bjarkalundur — content model. Every fact, price, quote and name here
   traces to the redesign brief + dossier (prep10). Honesty guardrails honoured:
   no invented room rates, no invented menu prices, no invented closure reason,
   no named owner on the public page, no "EV charger", softened superlative,
   reviews flagged as illustrative pending exact-quote verification. */

const BASE = import.meta.env.BASE_URL

const img = (file: string) => `${BASE}bjarkalundur/${file}`

/* ── Contact / actions ─────────────────────────────────────────────────── */
export const PHONE_DISPLAY = '+354 562 1900'
export const PHONE_HREF = 'tel:+3545621900'
export const EMAIL = 'info.hotelbjarkalundur@gmail.com'
export const EMAIL_HREF = 'mailto:info.hotelbjarkalundur@gmail.com'
export const ADDRESS = 'Bjarkalundi, 381 Reykhólahreppur'
export const GPS = 'N65° 33′ 22,703″ · V22° 6′ 14,057″'
/* Booking portal (property.godo.is) returned a maintenance page at build time,
   so the primary booking CTA routes to the live Booking.com listing per the
   brief's conversion note, rather than a broken page. */
export const BOOKING_URL = 'https://www.booking.com/hotel/is/thomsen-bjarkarlundur.html'
/* Google Maps embed centred on the verified hotel coordinates (eager-loaded). */
export const MAP_EMBED = 'https://www.google.com/maps?q=65.55631,-22.10390&z=10&output=embed'
export const MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=65.55631,-22.10390'

/* ── Images (client's own photography + 2 CC BY-SA Wikimedia landmark shots) ─ */
export const IMG = {
  hero: img('hero-exterior.webp'),
  archival: img('archival.webp'),
  vadalfjoll1: img('vadalfjoll-1.webp'),
  vadalfjoll2: img('vadalfjoll-2.webp'),
  loungeGreen: img('lounge-green.webp'),
  muralPiano: img('mural-piano.webp'),
  dining: img('dining.webp'),
  loungeWindow: img('lounge-window.webp'),
  library: img('library.webp'),
  desk: img('desk.webp'),
  bedroom: img('bedroom.webp'),
  kitchenPrep: img('kitchen-prep.webp'),
  tableDetail: img('table-detail.webp'),
  campsiteField: img('campsite-field.webp'),
  heathPanorama: img('heath-panorama.webp'),
}

/* ── Nav ───────────────────────────────────────────────────────────────── */
export const NAV = [
  { id: 'vadalfjoll', label: 'Vaðalfjöll' },
  { id: 'herbergi', label: 'Gisting' },
  { id: 'veitingar', label: 'Veitingar' },
  { id: 'saga', label: 'Sagan' },
  { id: 'tjaldsvaedi', label: 'Tjaldsvæði' },
  { id: 'hafa-samband', label: 'Hafa samband' },
]

/* ── Hero ──────────────────────────────────────────────────────────────── */
export const HERO = {
  eyebrow: 'Reykhólasveit · Vestfirðir',
  line1: 'HLIÐIÐ',
  line2: 'AÐ VESTFJÖRÐUM',
  sub: 'Hótel Bjarkalundur stendur við rætur Vaðalfjalla, á mörkum Berufjarðar og Þorskafjarðar, þar sem leiðin inn í Vestfirði hefst. Opið á ný frá 1. apríl 2026.',
  alt: 'Hótel Bjarkalundur, langt hvítt og dökkrautt hús með gráðaðri hlíð í haustlitum að baki og bílum á malarplaninu fyrir framan.',
}

/* ── The threshold — quick facts strip (all sourced, no invented meters) ─── */
export const FACTS: { value: string; label: string; count?: number }[] = [
  { value: '1947', label: 'Stofnað', count: 1947 },
  { value: '19 + 6', label: 'Herbergi og gestahús' },
  { value: '1. apríl 2026', label: 'Enduropnað' },
  { value: '214 km', label: 'Frá Reykjavík' },
]

/* ── Vaðalfjöll — signature section ────────────────────────────────────── */
export const VADALFJOLL = {
  eyebrow: 'Kennileitið',
  title: 'Vaðalfjöll',
  body: 'Sex til sjö kílómetra fyrir norðan hótelið rísa Vaðalfjöll, tveir stapar úr storknuðu hrauni upp af Þorskafjarðarheiði. Af tindunum sést yfir Vestfirði, Breiðafjörð og Dali. Gönguleiðin að þeim byrjar við dyrnar á Bjarkalundi.',
  detailAlt: 'Nærmynd af öðrum stapa Vaðalfjalla, þar sem stuðlabergið sést greinilega, með grænni mosaþúfu í forgrunni.',
  wideAlt: 'Vaðalfjöll rísa upp af kjarri vaxinni heiðinni undir bláum himni og lítið hús stendur undir hlíðinni.',
  credit: 'Ljósmyndir af Vaðalfjöllum: Hornstrandir1 og ArniGael, Wikimedia Commons, CC BY-SA 4.0.',
  waypoint: 'Bjarkalundur',
}

/* ── Rooms / accommodation (no price table — brief honesty guardrail) ────── */
export const ROOMS = {
  eyebrow: 'Gisting',
  title: 'Herbergi og gestahús',
  body: 'Á Bjarkalundi eru um 19 herbergi í aðalhúsinu og 6 sjálfstæð gestahús. Herbergin eru einföld og hlýleg, hvert gestahús með tvíbreiðu rúmi, litlu eldhorni og baðherbergi. Verð og laust framboð birtast á bókunarsíðunni.',
  alt: 'Gestaherbergi með uppábúnu tvíbreiðu rúmi, gulbrúnu teppi, vegglampa og litlu skrifborði.',
  note: 'Verð og framboð eru sýnd á bókunarsíðunni.',
  cta: 'Bóka gistingu',
}

/* ── Room categories for the on-page browser — the same two counts and the
   same gestahús furnishing list from ROOMS.body above, split into a
   selectable pair instead of one paragraph. No amenity is added that is not
   already stated verbatim in ROOMS.body (no breakfast/wifi/parking claims,
   since inclusion isn't confirmed for either room type). ─────────────────── */
export interface RoomCategory {
  id: 'adalhus' | 'gestahus'
  label: string
  count: string
  countLabel: string
  body: string
  features: string[]
  img: keyof typeof IMG
  alt: string
}
export const ROOM_CATEGORIES: RoomCategory[] = [
  {
    id: 'adalhus',
    label: 'Herbergi í aðalhúsinu',
    count: '19',
    countLabel: 'herbergi í aðalhúsinu',
    body: 'Um 19 herbergi í sjálfu hótelhúsinu, einföld og hlýleg að innan.',
    features: ['Í sjálfu hótelhúsinu', 'Einföld og hlýleg innrétting'],
    img: 'bedroom',
    alt: ROOMS.alt,
  },
  {
    id: 'gestahus',
    label: 'Sjálfstæð gestahús',
    count: '6',
    countLabel: 'sjálfstæð gestahús',
    body: 'Sex sjálfstæð gestahús á lóðinni, hvert með sínu tvíbreiða rúmi, eldhorni og baðherbergi.',
    features: ['Tvíbreitt rúm', 'Lítið eldhorn', 'Eigið baðherbergi'],
    img: 'bedroom',
    alt: ROOMS.alt,
  },
]

/* ── „Þá / Nú" — signature 1947↔2026 slider copy. Reuses the already-verified
   alt text for the two photos (STORY.archivalAlt / HERO.alt) rather than
   writing new descriptions of the same images. ────────────────────────────── */
export const THEN_NOW = {
  eyebrow: 'Þá og nú',
  title: '1947 mætir 2026',
  body: 'Sama hlið, sami staður. Dragðu sleðann til að bera saman gamla hótelið og Bjarkalund eins og hann er í dag.',
  instruction: 'Dragðu til að bera saman, eða notaðu örvatakkana.',
  labelThen: '1947',
  labelNow: '2026',
}

/* ── Restaurant & bar ──────────────────────────────────────────────────── */
export const RESTAURANT = {
  eyebrow: 'Veitingar',
  title: 'Veitingastaður og bar',
  body: 'Á staðnum er veitingastaður og bar sem býður hefðbundinn íslenskan og alþjóðlegan mat úr hráefni úr héraðinu, ásamt morgunverðarhlaðborði. Opið frá kl. 7 til kvölds, alla daga.',
  hours: 'Opið kl. 7 til kvölds · alla daga',
  gallery: [
    { key: 'dining', alt: 'Matsalur með ljósakrónu, dökkum viðarborðum sem búið er að leggja á, grænum veggjum og dagsbirtu úr gluggum.' },
    { key: 'kitchenPrep', alt: 'Hendur að skera grænmeti, radísur, kryddjurtir og chili, á viðarbretti með litlum skálum við hlið.' },
    { key: 'tableDetail', alt: 'Borðdúkur með blúndukanti, kveikt á kerti og lítil pottaplanta á dökku viðarborði.' },
  ],
  quote: 'Besta pítsa í mörg ár, fersk og full af bragði.',
  quoteBy: 'Gestur, hotelbjarkalundur.is',
}

/* ── Character / the green rooms (photo-led gallery) ───────────────────── */
export const CHARACTER = {
  eyebrow: 'Andrúmsloftið',
  title: 'Grænu stofurnar',
  body: 'Innandyra tekur á móti gestum annar heimur en glansandi keðjuhótel, skógargrænir veggir, messingslampar, gömul húsgögn og handmáluð blóm. Þetta er raunverulegt útlit hússins, ekki sviðsett.',
  panels: [
    { key: 'loungeGreen', title: 'Setustofan', alt: 'Setustofa með djúpgrænum veggjum, innrömmuðum gömlum myndum, blúndugardínum og dökku antíkborði í morgunbirtu.' },
    { key: 'muralPiano', title: 'Píanóhornið', alt: 'Horn með handmáluðu blómaskrauti á vegg, uppréttu píanó og ólífugrænum flauelsstólum í hlýrri lampabirtu.' },
    { key: 'library', title: 'Bókahornið', alt: 'Gangur með háum dökkum bókahillum, pottaplöntum, innrömmuðum myndum og hlýju hengiljósi við græna veggi.' },
    { key: 'desk', title: 'Skrifhornið', alt: 'Notalegt horn með skrifborði, antíkstól og myndavegg af litlum innrömmuðum prentum við grænan vegg.' },
    { key: 'loungeWindow', title: 'Útsýnið innan úr', alt: 'Sinnepsgulur flauelssófi við stóran glugga sem snýr að malarplaninu og grænum heiðarhólum með fjarlægum sumarhúsum.' },
  ],
}

/* ── The story — 1947 to 2026 (only dated facts) ───────────────────────── */
export const STORY = {
  eyebrow: 'Sagan',
  title: '1947 → 2026',
  intro: 'Bjarkalundur hefur staðið við mynni Vestfjarða frá stríðslokum. Sagan er sögð hér eins og hún er staðfest, án þess að fylla upp í eyðurnar.',
  archivalAlt: 'Gömul sepíu-tónuð ljósmynd af upprunalega hótelhúsinu í dalnum með aðkomuveginum sem sveigir að því.',
  timeline: [
    {
      year: '1947',
      text: 'Barðstrendingafélagið reisir Bjarkalund á árunum 1945 til 1947, lengi þekktan sem elsta starfandi sumarhótel landsins, sem áningarstað fyrir ferðalanga á leið um Vestfirði.',
    },
    {
      year: '2026',
      text: 'Opnað á ný 1. apríl 2026 eftir um þriggja ára hlé, undir nýjum eigendum, með áform um að hafa opið lengur fram á haustið en áður.',
    },
  ],
}

/* ── Campsite (real, public prices) ────────────────────────────────────── */
export const CAMPSITE = {
  eyebrow: 'Tjaldsvæði',
  title: 'Tjaldsvæðið',
  body: 'Grasflöt við litla á, í nokkurra skrefa fjarlægð frá veitingastaðnum og versluninni. Þjónustuhús með snyrtingum og sturtum, leikvöllur og veiðivatn í göngufæri.',
  fieldAlt: 'Opin grasflöt með fáeinum litlum húsum í fjarska, lágum hæðum og björtum skýjuðum himni, tjaldsvæðið.',
  wideAlt: 'Breið heiðarmynd í mildum haustlitum með mjúkum öldóttum hæðum.',
  prices: [
    { label: 'Á mann / nótt', value: '1.500 kr.' },
    { label: 'Rafmagn / nótt', value: '1.000 kr.' },
    { label: 'Sturta / mín', value: '100 kr.' },
    { label: 'Börn 12 ára og yngri', value: 'Frítt' },
  ],
}

/* ── Reviews (ILLUSTRATIVE — verify exact wording + attribution before launch) */
export const REVIEWS = {
  eyebrow: 'Umsagnir',
  title: 'Það sem gestir segja',
  score: '7,6',
  scoreScale: '/10',
  scoreCount: '128 umsagnir · Booking.com',
  /* VERIFY EXACT QUOTE + NAME + DATE BEFORE LAUNCH — these are WebSearch
     paraphrases (Booking.com/TripAdvisor blocked direct fetch 2026-07-22).
     The pizza line is from the hotel's own published testimonial. */
  items: [
    { quote: 'Starfsfólkið var mjög hjálplegt og herbergin hrein og snyrtileg.', by: 'Booking.com, sumar 2024' },
    { quote: 'Herbergið var notalegt, rúmið þægilegt og baðherbergið hreint.', by: 'TripAdvisor' },
    { quote: 'Eitt elsta hótelið á svæðinu og mætti gjarnan yngja upp, en það er hluti af sjarmanum.', by: 'TripAdvisor' },
  ],
  disclaimer: 'Umsagnir eru sýndar sem dæmi í þessari frumgerð og verða staðfestar orðrétt fyrir birtingu.',
}

/* ── Practical / location ──────────────────────────────────────────────── */
const PRACTICAL_ROWS: { label: string; value: string; href?: string }[] = [
  { label: 'Heimilisfang', value: ADDRESS },
  { label: 'Sími', value: PHONE_DISPLAY, href: PHONE_HREF },
  { label: 'Netfang', value: EMAIL, href: EMAIL_HREF },
  { label: 'Hnit', value: GPS },
]
export const PRACTICAL = {
  eyebrow: 'Hagnýtt',
  title: 'Að finna okkur',
  gateway: 'Bjarkalundur er fyrsti og síðasti áningarstaðurinn á leið um Vestfirði, þar sem hringvegurinn greinist inn á milli fjarðanna.',
  season: 'Opið frá 1. apríl, fram á haust.',
  rows: PRACTICAL_ROWS,
}

/* ── Final CTA + sticky ────────────────────────────────────────────────── */
export const CLOSING = {
  eyebrow: 'Verið velkomin',
  title: 'Gistið við hliðið að Vestfjörðum',
  body: 'Bókið herbergi, hringið eftir borði eða komið við á leið ykkar um Vestfirði.',
  book: 'Bóka gistingu',
  call: 'Hringja',
}
export const STICKY = { call: 'Hringja', book: 'Bóka' }

/* ── SEO ───────────────────────────────────────────────────────────────── */
export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Hótel Bjarkalundur',
  description:
    'Sögulegt sumarhótel við rætur Vaðalfjalla í Reykhólasveit, lengi þekkt sem eitt elsta starfandi sumarhótel landsins, opnað á ný 2026. Hótel, veitingastaður, bar og tjaldsvæði.',
  url: 'https://www.hotelbjarkalundur.is',
  telephone: '+354 562 1900',
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bjarkalundi',
    postalCode: '381',
    addressLocality: 'Reykhólahreppur',
    addressRegion: 'Vestfirðir',
    addressCountry: 'IS',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 65.55631, longitude: -22.1039 },
  foundingDate: '1947',
}
