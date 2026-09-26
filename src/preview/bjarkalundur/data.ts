/* Hótel Bjarkalundur v3, content model.
   Every factual line here traces to _docs/BJARKALUNDUR-FACTS-2026-09-26.md
   (section named in the comment) or to Sindri's visit notes (§7 of that file).
   Photos are the owner's own Booking.com uploads (harvest manifest in
   _docs/bjarkalundur-harvest-2026-09-26/); a photo sits next to a room type
   only when the owner filed it under that type (associated_rooms). */

const BASE = import.meta.env.BASE_URL
const v2 = (f: string) => `${BASE}bjarkalundur/v2/${f}`
const v3 = (f: string) => `${BASE}bjarkalundur/v3/${f}`

/* ── Contact / actions (§3 own site footer, §4 Godo) ─────────────────── */
export const ROOT = '/preview/bjarkalundur'
export const PHONE_DISPLAY = '562 1900'
export const PHONE_HREF = 'tel:+3545621900'
export const EMAIL = 'info.hotelbjarkalundur@gmail.com'
export const EMAIL_HREF = 'mailto:info.hotelbjarkalundur@gmail.com'
export const ADDRESS = 'Bjarkalundi, 381 Reykhólahreppur'
export const BOOKING_URL = 'https://property.godo.is/booking.php?propid=51121&lang=is'
export const MAP_EMBED = 'https://www.google.com/maps?q=65.55643,-22.10442&z=11&output=embed'
export const MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=H%C3%B3tel+Bjarkalundur'
export const GOOGLE_REVIEWS = 'https://www.google.com/maps/search/?api=1&query=H%C3%B3tel+Bjarkalundur'
export const TRIPADVISOR = 'https://www.tripadvisor.com/Hotel_Review-g4909297-d3312639-Reviews-Thomsen_Bjarkalundur-Strandabyggo_Westfjords_Region.html'

/* ── Images ──────────────────────────────────────────────────────────── */
export type Pic = { src: string; srcS?: string; w: number; h: number; alt: string }
const p = (name: string, w: number, h: number, alt: string, small = true): Pic =>
  ({ src: v2(`${name}.webp`), srcS: small ? v2(`${name}-s.webp`) : undefined, w, h, alt })
const L = (n: string, alt: string) => p(n, 2400, 1800, alt) /* 4:3 landscape */
const W = (n: string, alt: string) => p(n, 2400, 1600, alt) /* 3:2 landscape */
const T = (n: string, alt: string) => p(n, 2250, 3000, alt) /* 3:4 portrait */
/* Higgsfield 4K upscales (bytedance), graded once in-house, exported 2560 + 1280 */
const U = (n: string, w: number, h: number, alt: string): Pic => ({ src: v3(`${n}.webp`), srcS: v3(`${n}-s.webp`), w, h, alt })

export const IMG = {
  valley: U('valley', 2560, 1711, 'Hvíta hótelhúsið með rauða þakinu í grænum dal og sumarhúsin við hliðina.'),
  lake: U('lake', 2560, 1711, 'Berufjarðarvatn í logni og annar stapi Vaðalfjalla handan við vatnið.'),
  kayaks: U('kayaks', 2560, 1711, 'Tveir rauðir kajakar við litla trébryggju úti í vatninu.'),
  boat: W('boat-dock', 'Bátur og kajakar við bryggjuna í sefinu.'),
  bird: W('bird-fence', 'Fugl á girðingarstaur við vatnið.'),
  peaks: p('hotel-peaks', 2400, 1218, 'Hótelið lágt í landinu og stapi Vaðalfjalla á hæðinni fyrir ofan.'),
  window: U('window', 2560, 1920, 'Útsýni út um gluggann yfir planið, vatnið og fjöllin.'),
  sign: L('facade-sign', 'Nafnið Hótel Bjarkalundur í hvítum stöfum á rauða bandinu undir þakinu og borð og bekkir fyrir framan.'),
  facade: L('facade-long', 'Langa hvíta hótelhúsið með rauða bandinu undir þakinu.'),
  lounge: U('lounge', 2560, 1920, 'Græna stofan með hægindastólum og ljósakrónu og matsalurinn fyrir innan.'),
  piano: U('piano', 2560, 1920, 'Píanó, lampi og hægindastólar við vegg með blómaveggfóðri í grænu stofunni.'),
  lamp: T('lounge-lamp', 'Lampi og glös á borði við grænan vegg með blómaveggfóðri.'),
  dining: U('dining', 2560, 3413, 'Matsalurinn með dökkum borðum, stólum og myndum á grænum veggjum.'),
  candle: T('table-candle', 'Kerti og grein í vasa á dúklögðu borði.'),
  roomRed: L('room-twin-red', 'Tvö rúm og rauðir hægindastólar í björtu herbergi.'),
  lomur: U('lomur', 2560, 1920, 'Nafnaskiltið Lómur við herbergisdyr og rúm fyrir innan.'),
  roomShared: L('room-shared', 'Rúm með rósóttum rúmfötum og tréhurð í litlu herbergi.'),
  himbrimi: p('sign-himbrimi', 1505, 1316, 'Tréfugl og nafnaskiltið Himbrimi á herbergisdyrum.', false),
  bathShared: L('bath-shared', 'Sameiginleg snyrting með tveimur vöskum.'),
  bathShared2: L('bath-shared-2', 'Sameiginleg snyrting með vöskum og speglum.'),
  bathPrivate: L('bath-private', 'Baðherbergi með sturtu, salerni og vaski.'),
  cottageBeds: U('cottagebeds', 2560, 1920, 'Tvö rúm í sumarhúsi með viðarklæddum veggjum.'),
  cottageA: U('cottage', 2560, 1920, 'Sumarhús úr timbri með palli og hótelið og vatnið fyrir neðan.'),
  cottageLog: L('cottage-log', 'Bjálkahús með palli og bekk við dyrnar.'),
  cottageTowel: p('cottage-towel', 2250, 3000, 'Handklæði merkt hótelinu á rósóttum rúmfötum.'),
  cottageKitchen: p('cottage-kitchen', 1739, 1304, 'Eldhúskrókur með litlum ísskáp, borði og stólum í sumarhúsi.', false),
  cottageRoad: L('cottage-road', 'Sumarhús við malarveginn á lóðinni.'),
  cottagePair: L('cottage-pair', 'Tvö sumarhús við malarveginn.'),
  cottageRow: L('cottage-row', 'Sumarhúsin í röð í hlíðinni fyrir ofan hótelið.'),
  single: p('single-a', 2048, 1536, 'Eins manns herbergi með rúmi, glugga og stól.'),
  single2: p('single-b', 2048, 1536, 'Skrifborð, stóll og rúm í eins manns herbergi.'),
  campTables: L('camp-tables', 'Rauð borð og bekkir á grasflötinni fyrir framan hótelið.'),
  campGrass: L('camp-grass', 'Rauð nestisborð í röð á grasflötinni.'),
  heroPoster: { src: v3('hero-poster.webp'), srcS: v3('hero-poster-s.webp'), w: 1920, h: 1080, alt: 'Langa hvíta hótelhúsið með rauða bandinu og nafninu Hótel Bjarkalundur, ský á hreyfingu yfir.' } as Pic,
  archival: { src: `${BASE}bjarkalundur/archival.webp`, w: 800, h: 564, alt: 'Gömul ljósmynd af Bjarkalundi: hótelið í dalnum og vegurinn heim að því.' } as Pic,
}

/* ── Navigation ──────────────────────────────────────────────────────── */
export type NavItem = { label: string; to: string }
export const NAV: NavItem[] = [
  { label: 'Gisting', to: `${ROOT}/gisting` },
  { label: 'Veitingar', to: `${ROOT}#stofan` },
  { label: 'Umhverfið', to: `${ROOT}#umhverfid` },
  { label: 'Sagan', to: `${ROOT}#sagan` },
  { label: 'Umsagnir', to: `${ROOT}/umsagnir` },
  { label: 'Hafa samband', to: `${ROOT}#hafa-samband` },
]

/* ── Home (v4: Edelhaus board × MRC scroll) ────────────────────────────
   Titles use "|" for a line break and *…* for the italic words. Every fact
   below is the same fact-checked line as v3; sources in the facts file:
   §2 history (Vísir, mbl, Wikipedia), §1 owners (mbl 8.9.2025, bb.is
   20.3.2026, Lifðu núna 10.5.2024), §6 place (Wikipedia, Google listing),
   §3 own site (campsite), Booking.com (check-in/out), §7 Sindri. */
export const HERO_FILM = {
  src: v3('hero-loop.mp4'),
  srcS: v3('hero-loop-720.mp4'),
  poster: v3('hero-poster.webp'),
  posterS: v3('hero-poster-s.webp'),
}

export const HERO = {
  name: 'Bjarkalundur',
  sub: 'Elsta sumarhótel landsins, við rætur Vaðalfjalla.',
  book: 'Bóka gistingu',
}

export const INTRO = {
  eyebrow: 'Síðan 1947',
  title: 'Sumarhótel|*við veginn vestur*',
  body: [
    'Hótel Bjarkalundur var reist á árunum 1945 til 1947 og er elsta sumarhótel landsins. Það stendur við Vestfjarðaveg, 214 kílómetra frá Reykjavík, beint neðan við Vaðalfjöll.',
    'Hér eru herbergi og sumarhús, matsalur með grænum veggjum og tjaldsvæði við lækinn.',
  ],
}

export const EXPERIENCE = {
  title: 'Vaðalfjöll|*og vatnið*',
  sub: 'Tveir gígtappar úr blágrýti beint norðan við hótelið og Berufjarðarvatn í sjö mínútna göngufæri.',
  card: { pic: 'kayaks' as const, title: 'Kajak á vatninu', text: 'Á Berufjarðarvatni er róið á kajak og rennt fyrir fisk.' },
  hike: 'Það er auðvelt að ganga að Vaðalfjöllum og upp á tindana.',
}

export const STAY = {
  eyebrow: 'Gisting',
  title: 'Herbergi|*og sumarhús*',
  features: [
    { icon: 'bed', label: '19 herbergi' },
    { icon: 'house', label: 'Sumarhús' },
    { icon: 'bath', label: 'Sérbað í boði' },
    { icon: 'wifi', label: 'Þráðlaust net' },
  ] as const,
  strip: [
    { pic: 'lomur', label: 'Lómur', to: `${ROOT}/gisting#vaskur` },
    { pic: 'cottageBeds', label: 'Sumarhús', to: `${ROOT}/gisting#hus-bad` },
    { pic: 'single', label: 'Fyrir einn', to: `${ROOT}/gisting#einn` },
    { pic: 'cottageKitchen', label: 'Eldhúskrókur', to: `${ROOT}/gisting#hus-eldhus` },
  ] as const,
  cta: 'Öll herbergin',
}

export const COTTAGES = {
  title: 'Sumarhúsin|*á lóðinni*',
  body: 'Viðarklædd hús með palli, sum með eldhúskrók og eigin baðherbergi. Ný sumarhús eru í smíðum og bætast við.',
  link: 'Skoða gistingu',
}

export const OWNERS = {
  eyebrow: 'Nýir eigendur',
  title: 'Diddi og Evelyn|*opnuðu á ný*',
  body: [
    'Bjarkalundur stóð lokaður í þrjú ár. Árið 2025 tóku hjónin Sigurður Friðriksson, Diddi, og Evelyn Rojas Tagalog við staðnum og 1. apríl 2026 var hótelið opnað aftur.',
    'Diddi var lengst af skipstjóri og hefur rekið hótel frá árinu 2004. Nú er opið frá klukkan sjö á morgnana, morgunmatur í boði og eldhúsið opið fram á kvöld, alla daga.',
    'Ný sumarhús eru í smíðum á lóðinni. Hótelið er lokað hluta vetrar og opnar aftur í mars.',
  ],
  link: 'Saga hússins',
  archivalCaption: 'Bjarkalundur á árum áður.',
}

/* Skip Jones (Google 2026) is the source for the view from the dining room. */
export const FOOD = {
  eyebrow: 'Veitingar',
  title: 'Matur|*með útsýni*',
  cards: [
    { h: 'Morgunmatur', t: 'Frá klukkan sjö á morgnana, alla daga.' },
    { h: 'Græna stofan', t: 'Píanó, hægindastólar og blómaveggfóður.', pic: 'piano' as const },
    { h: 'Hádegi og kvöld', t: 'Eldhúsið er opið fram á kvöld, alla daga.' },
  ],
  quoteId: 'skip',
}

export const REVIEWS_TEASER = {
  title: 'Það sem gestir|*segja*',
  sub: 'Frá því hótelið opnaði á ný í apríl 2026.',
  cta: 'Allar umsagnir',
}

export const HISTORY = {
  title: 'Saga|*hússins*',
  years: [
    { y: '1947', h: 'Hótelið rís', t: 'Hótelið er reist á árunum 1945 til 1947. Í dag er það elsta sumarhótel landsins.' },
    { y: '2008', h: 'Dagvaktin', t: 'Gamanþættirnir Dagvaktin eru teknir upp í Bjarkalundi.' },
    { y: '2023', h: 'Lokað', t: 'Hótelið lokar og stendur lokað í þrjú ár.' },
    { y: '2025', h: 'Nýir eigendur', t: 'Diddi og Evelyn taka við staðnum.' },
    { y: '2026', h: 'Opnað á ný', t: 'Hótelið er opnað aftur 1. apríl.' },
  ],
}

export const CAMPSITE = {
  body: 'Grasflöt við lækinn rétt við hótelið, nokkur skref frá veitingastaðnum. Þjónustuhús með salernum og sturtum, rafmagn og leiksvæði fyrir börn.',
  prices: [
    { k: 'Á mann', v: '1.500 kr.' },
    { k: 'Rafmagn, nóttin', v: '1.000 kr.' },
    { k: 'Sturta, mínútan', v: '100 kr.' },
    { k: 'Börn 12 ára og yngri', v: 'Frítt' },
  ],
}

export const INFO = {
  title: 'Gott|*að vita*',
  items: [
    { id: 'leidin', h: 'Að komast hingað', rows: [
      { k: 'Heimilisfang', v: ADDRESS },
      { k: 'Frá Reykjavík', v: '214 km, um tveir og hálfur tími á bíl' },
      { k: 'Vegur', v: 'Vestfjarðavegur (60)' },
    ] },
    { id: 'innritun', h: 'Innritun og útritun', rows: [
      { k: 'Innritun', v: 'Frá klukkan 15' },
      { k: 'Útritun', v: 'Til klukkan 11' },
    ] },
    { id: 'opid', h: 'Opnunartími', rows: [
      { k: 'Alla daga', v: 'Frá klukkan sjö og fram á kvöld' },
      { k: 'Veturinn', v: 'Lokað hluta vetrar, opnar aftur í mars' },
    ] },
    { id: 'tjald', h: 'Tjaldsvæðið', rows: [] },
    { id: 'stadnum', h: 'Á staðnum', rows: [
      { k: 'Bíllinn', v: 'Eldsneyti og hleðsla fyrir rafbíla' },
      { k: 'Innifalið', v: 'Þráðlaust net og bílastæði' },
    ] },
  ],
  mapLabel: 'Opna í Google Maps',
}

export const CLOSING = {
  title: 'Gistu við rætur|*Vaðalfjalla*',
  book: 'Bóka gistingu',
  call: 'Hringja',
}

/* ── Rooms (§4 Godo propid 51121, all eight types, names translated) ─── */
export type Room = {
  id: string
  group: 'hotel' | 'sumarhus'
  name: string
  size: number
  guests: string
  beds: string
  bath: string
  kitchen: boolean
  privateBath: boolean
  text: string
  note?: string
  pics: (keyof typeof IMG)[]
}

export const ROOMS: Room[] = [
  {
    id: 'thaegindi', group: 'hotel', name: 'Herbergi með sérbaði', size: 20,
    guests: '3 að hámarki', beds: 'Tvö einbreið rúm og sófi í sumum herbergjum', bath: 'Sérbaðherbergi',
    kitchen: false, privateBath: true,
    text: 'Stærstu herbergin í aðalhúsinu, hvert með sínu baðherbergi.',
    pics: ['bathPrivate'],
  },
  {
    id: 'vaskur', group: 'hotel', name: 'Herbergi með vaski', size: 14,
    guests: '2', beds: 'Tvö einbreið rúm', bath: 'Salerni og sturtur á ganginum',
    kitchen: false, privateBath: false,
    text: 'Vaskur inni á herberginu, salerni og sturtur frammi á gangi. Herbergin bera fuglanöfn, eins og Lómur og Himbrimi.',
    pics: ['lomur', 'roomShared', 'himbrimi', 'bathShared'],
  },
  {
    id: 'einn', group: 'hotel', name: 'Eins manns herbergi', size: 7,
    guests: '1', beds: 'Eitt einbreitt rúm', bath: 'Sameiginlegt baðherbergi',
    kitchen: false, privateBath: false,
    text: 'Lítið og hagkvæmt herbergi fyrir þann sem ferðast einn.',
    pics: ['single', 'single2'],
  },
  {
    id: 'hus-eldhus', group: 'sumarhus', name: 'Sumarhús með eldhúskrók og baði', size: 22,
    guests: '2', beds: 'Tvö einbreið rúm', bath: 'Sérbaðherbergi með sturtu',
    kitchen: true, privateBath: true,
    text: 'Eldhúskrókur með litlum ísskáp, aðstaða til að laga te og kaffi og pallur fyrir framan.',
    pics: ['cottageKitchen', 'cottageTowel', 'cottageRoad', 'cottagePair'],
  },
  {
    id: 'hus-bad', group: 'sumarhus', name: 'Sumarhús með baði', size: 22,
    guests: '3 að hámarki', beds: 'Tvö einbreið rúm', bath: 'Sérbaðherbergi með sturtu',
    kitchen: false, privateBath: true,
    text: 'Viðarklætt sumarhús með eigin baðherbergi og palli.',
    pics: ['cottageBeds', 'cottageA', 'cottageLog', 'bathPrivate'],
  },
  {
    id: 'hus-stort', group: 'sumarhus', name: 'Stórt sumarhús með eldhúskrók', size: 24,
    guests: '4 fullorðnir og 1 barn að hámarki', beds: 'Rúm fyrir fjóra', bath: 'Eigið salerni, sturtur í hótelinu',
    kitchen: true, privateBath: false,
    text: 'Stærsta sumarhúsið, með eldhúskrók, aðstöðu til að laga te og kaffi og eigin palli.',
    pics: [],
  },
  {
    id: 'hus-litid', group: 'sumarhus', name: 'Lítið sumarhús', size: 15,
    guests: '2', beds: 'Rúm fyrir tvo', bath: 'Salerni og sturtur í hótelinu',
    kitchen: false, privateBath: false,
    text: 'Einfalt hús fyrir tvo. Salerni og sturtur eru inni í hótelinu.',
    note: 'Án rafmagns í bili.',
    pics: [],
  },
  {
    id: 'hus-tveggja', group: 'sumarhus', name: 'Tveggja manna smáhýsi', size: 11,
    guests: '2', beds: 'Tvö einbreið rúm', bath: 'Salerni og sturtur í hótelinu',
    kitchen: false, privateBath: false,
    text: 'Minnsta húsið á lóðinni, með tveimur einbreiðum rúmum.',
    note: 'Án rafmagns í bili.',
    pics: [],
  },
]

export const ROOMS_PAGE = {
  title: 'Gisting|*í Bjarkalundi*',
  sub: 'Herbergi í aðalhúsinu og sumarhús á lóðinni. Þú bókar beint hjá hótelinu.',
  filters: [
    { id: 'allt', label: 'Allt' },
    { id: 'hotel', label: 'Í hótelinu' },
    { id: 'sumarhus', label: 'Sumarhús' },
    { id: 'bad', label: 'Með sérbaði' },
    { id: 'eldhus', label: 'Með eldhúskrók' },
  ],
  groups: { hotel: 'Í hótelinu', sumarhus: 'Sumarhúsin' },
  count: (n: number) => (n === 1 ? '1 tegund' : `${n} tegundir`),
  labels: { size: 'Stærð', guests: 'Gestir', beds: 'Rúm', bath: 'Bað' },
  book: 'Bóka',
  all: 'Allir gestir',
  included: 'Þráðlaust net og bílastæði fylgja öllum herbergjum. Morgunmatur fæst í matsalnum.',
  newCottages: 'Ný sumarhús eru í smíðum á lóðinni og bætast við síðar.',
  prices: 'Verð og laus herbergi sjást á bókunarsíðunni.',
  empty: 'Ekkert herbergi uppfyllir þessi skilyrði.',
  reset: 'Sýna allt',
}

/* ── Reviews (Google + Tripadvisor, since the April 2026 reopening) ───
   Verbatim, one review = one quote, attributed to the real reviewer.
   Captured 2026-09-26: raw JSON in _docs/bjarkalundur-harvest-2026-09-26/.
   `is` is my translation; the original is always shown first. */
export type Review = {
  id: string
  name: string
  source: 'Google' | 'Tripadvisor'
  when: string
  lang: 'en' | 'de'
  title?: string
  text: string
  is: string
  pic: keyof typeof IMG
  excerpt?: boolean
}

export const REVIEWS: Review[] = [
  {
    id: 'marketa', name: 'Marketa Svarcova', source: 'Google', when: 'September 2026', lang: 'en', excerpt: true,
    text: 'We had a great stay in Bjarkalundur. The location and views from the hotel are stunning. I highly recommend to rent out the kayaks and explore the lake nearby.',
    is: 'Dvölin í Bjarkalundi var frábær. Staðsetningin og útsýnið frá hótelinu eru stórkostleg. Ég mæli eindregið með því að leigja kajak og skoða vatnið í grenndinni.',
    pic: 'kayaks',
  },
  {
    id: 'skip', name: 'Skip Jones', source: 'Google', when: 'Sumarið 2026', lang: 'en',
    text: 'Stopped in for a quick lunch. The views of the fjord were amazing. The soup for lunch was some of the best soup I have ever eaten. It was followed by a fresh Arctic char dish that was amazing too.',
    is: 'Stoppuðum stutt til að fá okkur hádegismat. Útsýnið yfir fjörðinn var stórkostlegt. Súpan í hádeginu var með þeim bestu sem ég hef borðað. Á eftir kom réttur úr ferskri bleikju sem var líka frábær.',
    pic: 'dining',
  },
  {
    id: 'carolina', name: 'Carolina Vega Recalde', source: 'Google', when: 'September 2026', lang: 'en',
    text: 'Stayed in cabin 1 for a night and it was just what we needed. Small stove, sink, cabinet and microwave. Enough space to put bags and a small dinner table. The bed was amazing. There’s a gas station and a charging station on site',
    is: 'Gistum eina nótt í húsi 1 og það var einmitt það sem við þurftum. Lítil eldavél, vaskur, skápur og örbylgjuofn. Nóg pláss fyrir töskurnar og lítið matarborð. Rúmið var frábært. Á staðnum er bensínstöð og hleðslustöð.',
    pic: 'cottageKitchen',
  },
  {
    id: 'marco', name: 'Marco', source: 'Tripadvisor', when: 'Ágúst 2026', lang: 'de',
    title: 'Super Ausgangspunkt zu den Westfjords',
    text: 'Waren zur Sonnenfinsternis dort, das Hotel war voll mit Gästen. Aber das Personal hat die Situation sehr gut gehandhabt und war flexibel. Besonders Eddy war sehr freundlich und professionell im Umgang mit den Gästen. Das Abendessen ist klasse. Gutes Preis-Leistungsverhältnis.',
    is: 'Vorum þarna yfir sólmyrkvann og hótelið var fullt af gestum. Starfsfólkið réð samt mjög vel við aðstæður og var sveigjanlegt. Sérstaklega var Eddy vingjarnlegur og fagmannlegur við gestina. Kvöldmaturinn er frábær. Gott verð miðað við gæði.',
    pic: 'lounge',
  },
  {
    id: 'jean', name: 'Jean Mârêņ', source: 'Google', when: 'September 2026', lang: 'en',
    text: 'We didn’t stay at the hotel, only ate at the restaurant. The food was very good and the staff was extremely nice. Can recommend.',
    is: 'Við gistum ekki á hótelinu en borðuðum á veitingastaðnum. Maturinn var mjög góður og starfsfólkið einstaklega elskulegt. Mæli með.',
    pic: 'candle',
  },
  {
    id: 'kristyna', name: 'Kristýnka Kazdova', source: 'Google', when: 'Sumarið 2026', lang: 'en',
    text: 'The staff was extremely helpful, especially Mr. Martin, who fulfilled all of our demanding requirements with great professionalism and willingness',
    is: 'Starfsfólkið var einstaklega hjálplegt, sérstaklega Martin, sem uppfyllti allar okkar ströngu kröfur af mikilli fagmennsku og greiðvikni.',
    pic: 'piano',
  },
]

export const REVIEWS_PAGE = {
  title: 'Umsagnir|*gesta*',
  sub: 'Það sem gestir hafa skrifað síðan Bjarkalundur opnaði á ný í apríl 2026. Hver umsögn birtist orðrétt, undir nafni þess sem skrifaði.',
  translate: 'Á íslensku',
  original: 'Frumtexti',
  more: 'Fleiri umsagnir',
  google: 'Á Google',
  tripadvisor: 'Á Tripadvisor',
  photoNote: 'Myndirnar eru frá hótelinu og sýna það sem umsögnin fjallar um.',
}

export const FOOTER = {
  tagline: 'Elsta sumarhótel landsins, við rætur Vaðalfjalla.',
  season: 'Lokað hluta vetrar. Opnar aftur í mars.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: 'Hótel Bjarkalundur',
  description: 'Elsta sumarhótel landsins, reist 1945 til 1947 við rætur Vaðalfjalla í Reykhólasveit. Herbergi, sumarhús, veitingastaður og tjaldsvæði við Vestfjarðaveg.',
  url: 'https://www.hotelbjarkalundur.is',
  telephone: '+354 562 1900',
  email: EMAIL,
  checkinTime: '15:00',
  checkoutTime: '11:00',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bjarkalundi',
    postalCode: '381',
    addressLocality: 'Reykhólahreppur',
    addressRegion: 'Vestfirðir',
    addressCountry: 'IS',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 65.55643, longitude: -22.10442 },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Þráðlaust net', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Bílastæði', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Veitingastaður', value: true },
  ],
}
