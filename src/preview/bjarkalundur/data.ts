/* Hótel Bjarkalundur, shared facts (v4, bilingual). Every word a guest reads is in
   copy.ts; this file holds what does not change with the language: contact data,
   photos, the room inventory and the reviews.
   Facts trace to _docs/BJARKALUNDUR-FACTS-2026-09-26.md and the research in
   _docs/BJARKALUNDUR-SEO-GEO-AEO-2026-09-26.md. Photos are the owner's own
   Booking.com uploads; a photo sits next to a room type only when the owner filed
   it under that type (associated_rooms). */
import type { Lang } from './paths'

const ASSETS = import.meta.env.BASE_URL
const v2 = (f: string) => `${ASSETS}bjarkalundur/v2/${f}`
const v3 = (f: string) => `${ASSETS}bjarkalundur/v3/${f}`

/* ── Contact (§3 own site footer; Google listing) ─────────────────────── */
export const PHONE_DISPLAY = '562 1900'
export const PHONE_INTL = '+354 562 1900'
export const PHONE_HREF = 'tel:+3545621900'
export const EMAIL = 'info.hotelbjarkalundur@gmail.com'
export const EMAIL_HREF = 'mailto:info.hotelbjarkalundur@gmail.com'
export const ADDRESS = 'Bjarkalundi, 381 Reykhólahreppur'
export const GEO = { lat: 65.55643, lng: -22.10442 }
export const MAP_EMBED = 'https://www.google.com/maps?q=65.55643,-22.10442&z=11&output=embed'
export const MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=H%C3%B3tel+Bjarkalundur'
export const DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=65.55643,-22.10442'
export const GOOGLE_REVIEWS = 'https://www.google.com/maps/search/?api=1&query=H%C3%B3tel+Bjarkalundur'
/* The Tripadvisor listing that receives the 2026 reviews (still named "Thomsen"). */
export const TRIPADVISOR = 'https://www.tripadvisor.com/Hotel_Review-g4909297-d3312639-Reviews-Thomsen_Bjarkalundur-Strandabyggo_Westfjords_Region.html'
export const BOOKING_COM = 'https://www.booking.com/hotel/is/thomsen-bjarkarlundur.html'
export const ROADS = { is: 'https://umferdin.is/', en: 'https://umferdin.is/en' }
export const WEATHER = { is: 'https://www.vedur.is/', en: 'https://en.vedur.is/' }
export const VEIDIKORTID = 'https://veidikortid.is/veidisvaedi/berufjardarvatn/'

/* ── Images ──────────────────────────────────────────────────────────── */
export type L = Record<Lang, string>
export type Pic = { src: string; srcS?: string; w: number; h: number; alt: L }
const p = (name: string, w: number, h: number, alt: L, small = true): Pic =>
  ({ src: v2(`${name}.webp`), srcS: small ? v2(`${name}-s.webp`) : undefined, w, h, alt })
const Lw = (n: string, alt: L) => p(n, 2400, 1800, alt) /* 4:3 */
const W = (n: string, alt: L) => p(n, 2400, 1600, alt) /* 3:2 */
const T = (n: string, alt: L) => p(n, 2250, 3000, alt) /* 3:4 */
/* Higgsfield 4K upscales (bytedance), graded once in-house, exported 2560 + 1280 */
const U = (n: string, w: number, h: number, alt: L): Pic => ({ src: v3(`${n}.webp`), srcS: v3(`${n}-s.webp`), w, h, alt })

export const IMG = {
  valley: U('valley', 2560, 1711, { is: 'Hvíta hótelhúsið með rauða þakinu í grænum dal og sumarhúsin við hliðina.', en: 'The white hotel with its red roof in a green valley, the cottages beside it.' }),
  lake: U('lake', 2560, 1711, { is: 'Berufjarðarvatn í logni og annar stapi Vaðalfjalla handan við vatnið.', en: 'Berufjarðarvatn lake on a still day, one of the Vaðalfjöll peaks beyond.' }),
  kayaks: U('kayaks', 2560, 1711, { is: 'Tveir rauðir kajakar við litla trébryggju úti í vatninu.', en: 'Two red kayaks at a small wooden jetty on the lake.' }),
  boat: W('boat-dock', { is: 'Bátur og kajakar við bryggjuna í sefinu.', en: 'A boat and kayaks at the jetty among the reeds.' }),
  bird: W('bird-fence', { is: 'Fugl á girðingarstaur við vatnið.', en: 'A bird on a fence post by the lake.' }),
  peaks: p('hotel-peaks', 2400, 1218, { is: 'Hótelið lágt í landinu og stapi Vaðalfjalla á hæðinni fyrir ofan.', en: 'The hotel low in the landscape, a Vaðalfjöll peak on the ridge above.' }),
  window: U('window', 2560, 1920, { is: 'Útsýni út um gluggann yfir planið, vatnið og fjöllin.', en: 'The view from a window across the forecourt to the lake and mountains.' }),
  sign: Lw('facade-sign', { is: 'Nafnið Hótel Bjarkalundur í hvítum stöfum á rauða bandinu undir þakinu og borð og bekkir fyrir framan.', en: 'The name Hótel Bjarkalundur in white letters on the red band under the roof, picnic tables in front.' }),
  facade: Lw('facade-long', { is: 'Langa hvíta hótelhúsið með rauða bandinu undir þakinu.', en: 'The long white hotel building with the red band under its roof.' }),
  lounge: U('lounge', 2560, 1920, { is: 'Græna stofan með hægindastólum og ljósakrónu og matsalurinn fyrir innan.', en: 'The green lounge with armchairs and a chandelier, the dining room beyond.' }),
  piano: U('piano', 2560, 1920, { is: 'Píanó, lampi og hægindastólar við vegg með blómaveggfóðri í grænu stofunni.', en: 'A piano, a lamp and armchairs against floral wallpaper in the green lounge.' }),
  lamp: T('lounge-lamp', { is: 'Lampi og glös á borði við grænan vegg með blómaveggfóðri.', en: 'A lamp and glasses on a table by a green wall with floral wallpaper.' }),
  dining: U('dining', 2560, 3413, { is: 'Matsalurinn með dökkum borðum, stólum og myndum á grænum veggjum.', en: 'The dining room with dark tables, chairs and paintings on green walls.' }),
  candle: T('table-candle', { is: 'Kerti og grein í vasa á dúklögðu borði.', en: 'A candle and a sprig in a vase on a laid table.' }),
  roomRed: Lw('room-twin-red', { is: 'Tvö rúm og rauðir hægindastólar í björtu herbergi.', en: 'Two beds and red armchairs in a bright room.' }),
  lomur: U('lomur', 2560, 1920, { is: 'Nafnaskiltið Lómur við herbergisdyr og rúm fyrir innan.', en: 'The name sign Lómur by a room door, a bed inside.' }),
  roomShared: Lw('room-shared', { is: 'Rúm með rósóttum rúmfötum og tréhurð í litlu herbergi.', en: 'A bed with floral linen and a wooden door in a small room.' }),
  himbrimi: p('sign-himbrimi', 1505, 1316, { is: 'Tréfugl og nafnaskiltið Himbrimi á herbergisdyrum.', en: 'A wooden bird and the name sign Himbrimi on a room door.' }, false),
  bathShared: Lw('bath-shared', { is: 'Sameiginleg snyrting með tveimur vöskum.', en: 'A shared washroom with two basins.' }),
  bathShared2: Lw('bath-shared-2', { is: 'Sameiginleg snyrting með vöskum og speglum.', en: 'A shared washroom with basins and mirrors.' }),
  bathPrivate: Lw('bath-private', { is: 'Baðherbergi með sturtu, salerni og vaski.', en: 'A bathroom with a shower, toilet and basin.' }),
  cottageBeds: U('cottagebeds', 2560, 1920, { is: 'Tvö rúm í sumarhúsi með viðarklæddum veggjum.', en: 'Two beds in a cottage with timber-clad walls.' }),
  cottageA: U('cottage', 2560, 1920, { is: 'Sumarhús úr timbri með palli og hótelið og vatnið fyrir neðan.', en: 'A timber cottage with a deck, the hotel and the lake below.' }),
  cottageLog: Lw('cottage-log', { is: 'Bjálkahús með palli og bekk við dyrnar.', en: 'A log cottage with a deck and a bench by the door.' }),
  cottageTowel: p('cottage-towel', 2250, 3000, { is: 'Handklæði merkt hótelinu á rósóttum rúmfötum.', en: 'A towel marked with the hotel name on floral bed linen.' }),
  cottageKitchen: p('cottage-kitchen', 1739, 1304, { is: 'Eldhúskrókur með litlum ísskáp, borði og stólum í sumarhúsi.', en: 'A kitchenette with a small fridge, a table and chairs in a cottage.' }, false),
  cottageRoad: Lw('cottage-road', { is: 'Sumarhús við malarveginn á lóðinni.', en: 'A cottage by the gravel track on the grounds.' }),
  cottagePair: Lw('cottage-pair', { is: 'Tvö sumarhús við malarveginn.', en: 'Two cottages by the gravel track.' }),
  cottageRow: Lw('cottage-row', { is: 'Sumarhúsin í röð í hlíðinni fyrir ofan hótelið.', en: 'The cottages in a row on the slope above the hotel.' }),
  single: p('single-a', 2048, 1536, { is: 'Eins manns herbergi með rúmi, glugga og stól.', en: 'A single room with a bed, a window and a chair.' }),
  single2: p('single-b', 2048, 1536, { is: 'Skrifborð, stóll og rúm í eins manns herbergi.', en: 'A desk, a chair and a bed in a single room.' }),
  campTables: Lw('camp-tables', { is: 'Rauð borð og bekkir á grasflötinni fyrir framan hótelið.', en: 'Red tables and benches on the lawn in front of the hotel.' }),
  campGrass: Lw('camp-grass', { is: 'Rauð nestisborð í röð á grasflötinni.', en: 'A row of red picnic tables on the lawn.' }),
  heroPoster: { src: v3('hero-poster.webp'), srcS: v3('hero-poster-s.webp'), w: 1920, h: 1080, alt: { is: 'Langa hvíta hótelhúsið með rauða bandinu og nafninu Hótel Bjarkalundur.', en: 'The long white hotel with the red band and the name Hótel Bjarkalundur.' } } as Pic,
  archival: { src: `${ASSETS}bjarkalundur/archival.webp`, w: 800, h: 564, alt: { is: 'Gömul ljósmynd af Bjarkalundi: hótelið í dalnum og vegurinn heim að því.', en: 'An old photograph of Bjarkalundur: the hotel in the valley and the road up to it.' } } as Pic,
}
export type ImgKey = keyof typeof IMG

export const HERO_FILM = {
  src: v3('hero-loop.mp4'),
  srcS: v3('hero-loop-720.mp4'),
  poster: v3('hero-poster.webp'),
  posterS: v3('hero-poster-s.webp'),
}

/* ── Rooms (§4 Godo propid 51121, all eight types; words in copy.ts) ──── */
export type Room = {
  id: string
  group: 'hotel' | 'sumarhus'
  size: number
  /** most guests, for filters and structured data */
  maxGuests: number
  kitchen: boolean
  privateBath: boolean
  /** Godo marks these "temporary no electricity" (2026-09-26) */
  noPower?: boolean
  pics: ImgKey[]
}

export const ROOMS: Room[] = [
  { id: 'thaegindi', group: 'hotel', size: 20, maxGuests: 3, kitchen: false, privateBath: true, pics: ['bathPrivate'] },
  { id: 'vaskur', group: 'hotel', size: 14, maxGuests: 2, kitchen: false, privateBath: false, pics: ['lomur', 'roomShared', 'himbrimi', 'bathShared'] },
  { id: 'einn', group: 'hotel', size: 7, maxGuests: 1, kitchen: false, privateBath: false, pics: ['single', 'single2'] },
  { id: 'hus-eldhus', group: 'sumarhus', size: 22, maxGuests: 2, kitchen: true, privateBath: true, pics: ['cottageKitchen', 'cottageTowel', 'cottageRoad', 'cottagePair'] },
  { id: 'hus-bad', group: 'sumarhus', size: 22, maxGuests: 3, kitchen: false, privateBath: true, pics: ['cottageBeds', 'cottageA', 'cottageLog', 'bathPrivate'] },
  { id: 'hus-stort', group: 'sumarhus', size: 24, maxGuests: 5, kitchen: true, privateBath: false, pics: [] },
  { id: 'hus-litid', group: 'sumarhus', size: 15, maxGuests: 2, kitchen: false, privateBath: false, noPower: true, pics: [] },
  { id: 'hus-tveggja', group: 'sumarhus', size: 11, maxGuests: 2, kitchen: false, privateBath: false, noPower: true, pics: [] },
]

/* ── Reviews (Google + Tripadvisor, since the April 2026 reopening) ───
   Verbatim, one review = one quote, attributed to the real reviewer.
   Captured 2026-09-26: raw JSON in _docs/bjarkalundur-harvest-2026-09-26/.
   `is` and `en` are translations; the original is always shown first. Never
   marked up as Review/AggregateRating (self-serving reviews rule). */
export type Review = {
  id: string
  name: string
  source: 'Google' | 'Tripadvisor'
  when: L
  lang: 'en' | 'de'
  title?: string
  text: string
  is: string
  /** English translation, only for reviews not written in English */
  en?: string
  enTitle?: string
  pic: ImgKey
  excerpt?: boolean
  /** the rating the reviewer gave, read off the platform; shown drawn, never marked up */
  stars?: number
}

export const REVIEWS: Review[] = [
  {
    id: 'marketa', name: 'Marketa Svarcova', source: 'Google', when: { is: 'september 2026', en: 'September 2026' }, lang: 'en', excerpt: true,
    text: 'We had a great stay in Bjarkalundur. The location and views from the hotel are stunning. I highly recommend to rent out the kayaks and explore the lake nearby.',
    is: 'Dvölin í Bjarkalundi var frábær. Staðsetningin og útsýnið frá hótelinu eru stórkostleg. Ég mæli eindregið með því að leigja kajak og skoða vatnið í grenndinni.',
    pic: 'kayaks',
  },
  {
    id: 'skip', stars: 5, name: 'Skip Jones', source: 'Google', when: { is: 'sumarið 2026', en: 'summer 2026' }, lang: 'en',
    text: 'Stopped in for a quick lunch. The views of the fjord were amazing. The soup for lunch was some of the best soup I have ever eaten. It was followed by a fresh Arctic char dish that was amazing too.',
    is: 'Stoppuðum stutt til að fá okkur hádegismat. Útsýnið yfir fjörðinn var stórkostlegt. Súpan í hádeginu var með þeim bestu sem ég hef borðað. Á eftir kom réttur úr ferskri bleikju sem var líka frábær.',
    pic: 'dining',
  },
  {
    id: 'carolina', stars: 5, name: 'Carolina Vega Recalde', source: 'Google', when: { is: 'september 2026', en: 'September 2026' }, lang: 'en',
    text: 'Stayed in cabin 1 for a night and it was just what we needed. Small stove, sink, cabinet and microwave. Enough space to put bags and a small dinner table. The bed was amazing. There’s a gas station and a charging station on site',
    is: 'Gistum eina nótt í húsi 1 og það var einmitt það sem við þurftum. Lítil eldavél, vaskur, skápur og örbylgjuofn. Nóg pláss fyrir töskurnar og lítið matarborð. Rúmið var frábært. Á staðnum er bensínstöð og hleðslustöð.',
    pic: 'cottageKitchen',
  },
  {
    id: 'marco', name: 'Marco', source: 'Tripadvisor', when: { is: 'ágúst 2026', en: 'August 2026' }, lang: 'de',
    title: 'Super Ausgangspunkt zu den Westfjords',
    text: 'Waren zur Sonnenfinsternis dort, das Hotel war voll mit Gästen. Aber das Personal hat die Situation sehr gut gehandhabt und war flexibel. Besonders Eddy war sehr freundlich und professionell im Umgang mit den Gästen. Das Abendessen ist klasse. Gutes Preis-Leistungsverhältnis.',
    is: 'Vorum þarna yfir sólmyrkvann og hótelið var fullt af gestum. Starfsfólkið réð samt mjög vel við aðstæður og var sveigjanlegt. Sérstaklega var Eddy vingjarnlegur og fagmannlegur við gestina. Kvöldmaturinn er frábær. Gott verð miðað við gæði.',
    enTitle: 'A great base for the Westfjords',
    en: 'We were there for the solar eclipse and the hotel was full of guests. But the staff handled it very well and were flexible. Eddy in particular was very friendly and professional with the guests. The dinner is excellent. Good value for money.',
    pic: 'lounge',
  },
  {
    id: 'jean', stars: 5, name: 'Jean Mârêņ', source: 'Google', when: { is: 'september 2026', en: 'September 2026' }, lang: 'en',
    text: 'We didn’t stay at the hotel, only ate at the restaurant. The food was very good and the staff was extremely nice. Can recommend.',
    is: 'Við gistum ekki á hótelinu en borðuðum á veitingastaðnum. Maturinn var mjög góður og starfsfólkið einstaklega elskulegt. Mæli með.',
    pic: 'candle',
  },
  {
    id: 'kristyna', stars: 5, name: 'Kristýnka Kazdova', source: 'Google', when: { is: 'sumarið 2026', en: 'summer 2026' }, lang: 'en',
    text: 'The staff was extremely helpful, especially Mr. Martin, who fulfilled all of our demanding requirements with great professionalism and willingness',
    is: 'Starfsfólkið var einstaklega hjálplegt, sérstaklega Martin, sem uppfyllti allar okkar ströngu kröfur af mikilli fagmennsku og greiðvikni.',
    pic: 'piano',
  },
]

/** A quote in its original language, with the right quotation marks. */
export const quote = (r: Review) => (r.lang === 'en' ? `“${r.text}${r.excerpt ? ' …' : ''}”` : `„${r.text}${r.excerpt ? ' …' : ''}“`)
