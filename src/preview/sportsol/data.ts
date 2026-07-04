/**
 * Sportsól — content data. Every fact, price and name below was verified
 * against sportsol.is (2026-07-04): verðskrá-1, áskriftarkort, frelsi,
 * bekkirnir-okkar, stadirnir-okkar, um-okkur + Skatturinn registry.
 * Booking runs on Noona (noona.app/sportsol). No invented facts.
 */

export const PHONE_DISPLAY = '554 3799'
export const PHONE_HREF = 'tel:+3545543799'
export const EMAIL = 'sportsol@sportsol.is'
export const NOONA = 'https://noona.app/sportsol'

export interface Location {
  id: 'hamraborg' | 'hverafold'
  name: string
  address: string
  town: string
  locality: string // schema.org addressLocality (official postal locality)
  opened: string // verified opening wording
  openedYear: string
  hours: { days: string; time: string }[]
  maps: string
  beds: string[]
}

export const LOCATIONS: Location[] = [
  {
    id: 'hamraborg',
    name: 'Hamraborg',
    address: 'Hamraborg 16',
    town: '200 Kópavogur',
    locality: 'Kópavogur',
    opened: 'Opnaði í janúar 2026 með splunkunýjum bekkjum',
    openedYear: '2026',
    hours: [
      { days: 'Mánudaga til föstudaga', time: '10:00 til 23:30' },
      { days: 'Laugardaga', time: '12:00 til 22:00' },
      { days: 'Sunnudaga', time: '12:00 til 23:00' },
    ],
    maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Sportsól, Hamraborg 16, 200 Kópavogur'),
    beds: ['Luxura JEWEL', 'Luxura Vegaz', 'Standandi bekkur', 'American M7 infrared'],
  },
  {
    id: 'hverafold',
    name: 'Hverafold',
    address: 'Hverafold 1-3',
    town: '112 Reykjavík',
    locality: 'Reykjavík',
    opened: 'Opnaði í desember 2024 með glænýjum bekkjum',
    openedYear: '2024',
    hours: [
      { days: 'Mánudaga til föstudaga', time: '10:00 til 23:00' },
      { days: 'Laugardaga', time: '12:00 til 22:00' },
      { days: 'Sunnudaga', time: '12:00 til 23:00' },
    ],
    maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Sportsól, Hverafold 1-3, 112 Reykjavík'),
    beds: ['Luxura JEWEL', 'Luxura X10', 'Luxura X10 Túrbó', 'Standandi bekkur'],
  },
]

/* ── Verðskrá — verified from sportsol.is/pages/verdskra-1 ─────────────── */

export interface PriceRow {
  minutes: string
  morning: number // milli kl. 10 og 14
  day: number // frá kl. 14 til lokunar
}

export interface PriceGroup {
  id: string
  name: string
  note?: string
  rows: PriceRow[]
}

export const PRICE_GROUPS: PriceGroup[] = [
  {
    id: 'venjulegir',
    name: 'Vegaz, Túrbó og venjulegir bekkir',
    rows: [
      { minutes: '10 mínútur', morning: 1832, day: 2290 },
      { minutes: '15 mínútur', morning: 2232, day: 2790 },
      { minutes: '20 mínútur', morning: 2792, day: 3490 },
    ],
  },
  {
    id: 'jewell',
    name: 'JEWEL bekkir',
    note: 'Djásnið frá Luxura',
    rows: [
      { minutes: '10 mínútur', morning: 1910, day: 2390 },
      { minutes: '15 mínútur', morning: 2552, day: 3190 },
      { minutes: '20 mínútur', morning: 3432, day: 4290 },
    ],
  },
  {
    id: 'standandi',
    name: 'Standandi bekkir',
    rows: [
      { minutes: '7 mínútur', morning: 1752, day: 2190 },
      { minutes: '10 mínútur', morning: 1832, day: 2290 },
      { minutes: '15 mínútur', morning: 2232, day: 2790 },
      { minutes: '18 mínútur', morning: 2792, day: 3490 },
    ],
  },
]

/* Infrared has all-day pricing (frá opnun til lokunar) */
export const INFRARED_PRICES = [
  { minutes: '15 mínútur', price: 1490 },
  { minutes: '20 mínútur', price: 1980 },
]

export const WEEKEND_OFFER = {
  name: 'Helgartilboð',
  detail: '15 mínútur í Vegaz, Túrbó, standandi og venjulega bekki',
  price: 1900,
}

/* ── Áskrift — verified from sportsol.is/pages/askriftarkort ───────────── */

export interface Plan {
  id: string
  name: string
  price: number
  perDay: number
  cancel: string
  detail: string
  featured?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'askrift-3',
    name: 'Áskrift',
    price: 8990,
    perDay: 299,
    cancel: 'Þriggja mánaða uppsagnarfrestur',
    detail: '15 mínútna ljósatími eða infrared tími alla daga, allan ársins hring. Gildir í báðum stofum.',
    featured: true,
  },
  {
    id: 'askrift-1',
    name: 'Áskrift, styttri binding',
    price: 9990,
    perDay: 330,
    cancel: 'Eins mánaðar uppsagnarfrestur',
    detail: 'Sama áskrift, styttri uppsagnarfrestur. 15 mínútna ljósatími eða infrared tími alla daga.',
  },
  {
    id: 'infrared',
    name: 'Infrared áskrift',
    price: 4990,
    perDay: 166,
    cancel: 'Þriggja mánaða uppsagnarfrestur',
    detail: '15 eða 20 mínútna infrared tími alla daga. Hreint handklæði og sturtuaðstaða í einkaklefa fylgja. Veitir ekki aðgang að hefðbundnum ljósabekkjum.',
  },
]

export const FRELSI = {
  name: 'Frelsi',
  pay: 10000,
  credit: 12500,
  points: [
    '12.500 kr. inneign fyrir 10.000 kr., tuttugu prósenta afsláttur af tímagjaldi',
    'Inneignin rennur aldrei út',
    'Gildir í báðum stofum og í alla bekki',
    'Má nota með helgartilboði og morguntilboði',
  ],
}

/* ── Bekkirnir — verified from sportsol.is/pages/bekkirnir-okkar ───────── */

export interface Bed {
  id: string
  name: string
  tagline: string // verified site wording, lightly normalized
  minutes: string
  locations: string[]
  tone: 'gold' | 'coral' | 'pink' | 'ember'
}

export const BEDS: Bed[] = [
  {
    id: 'jewel',
    name: 'Luxura JEWEL',
    tagline: 'Djásnið frá Luxura. Háþróuð ljósatækni og hámarksþægindi.',
    minutes: '10, 15 eða 20 mínútur',
    locations: ['Hamraborg', 'Hverafold'],
    tone: 'pink',
  },
  {
    id: 'vegaz',
    name: 'Luxura Vegaz',
    tagline: 'Nýr hágæða lúxusbekkur. Þú velur styrkleikann, Túrbó eða venjulegan.',
    minutes: '10, 15 eða 20 mínútur',
    locations: ['Hamraborg'],
    tone: 'coral',
  },
  {
    id: 'x10',
    name: 'Luxura X10 og X10 Túrbó',
    tagline: 'Mildur og þægilegur bekkur með stillanlegum styrkleika. Túrbó útgáfan er sú öflugri.',
    minutes: '10, 15 eða 20 mínútur',
    locations: ['Hverafold'],
    tone: 'gold',
  },
  {
    id: 'standandi',
    name: 'Standandi bekkur',
    tagline: 'Hraður standandi tími þar sem þú stillir styrkleikann sjálf eða sjálfur.',
    minutes: '7 til 18 mínútur',
    locations: ['Hamraborg', 'Hverafold'],
    tone: 'gold',
  },
  {
    id: 'm7',
    name: 'American M7 infrared',
    tagline: 'Innrautt ljós, djúp og kraftmikil meðferð á aðeins 15 mínútum.',
    minutes: '15 eða 20 mínútur',
    locations: ['Hamraborg'],
    tone: 'ember',
  },
]

/* ── Sólarkrem — verified Shopify products, 7.900 kr hvert ─────────────── */

export const CREAMS = [
  { name: 'Tiki Tequila', href: 'https://sportsol.is/products/tiki-tequila' },
  { name: 'Stardust', href: 'https://sportsol.is/products/stardust' },
  { name: 'Pure Charm', href: 'https://sportsol.is/products/pure-charm' },
  { name: 'Pro Tan Bodaciously Black', href: 'https://sportsol.is/products/pro-tan-bodaciously-black' },
]

export const CREAM_PRICE = 7900

/* ── Um okkur — verified wording from sportsol.is/pages/um-okkur ───────── */

export const TRUST = [
  {
    title: 'Hreinlæti í fyrirrúmi',
    body: 'Hver bekkur er vandlega þrifinn og sótthreinsaður eftir hverja einustu notkun.',
  },
  {
    title: 'Perur í toppstandi',
    body: 'Við skiptum um perur oftar en framleiðendur mæla með, til að tryggja hámarksárangur.',
  },
  {
    title: 'Allt til alls',
    body: 'Hrein handklæði og hárhandklæði í hverri heimsókn, make-up klútar og hárblásarar.',
  },
  {
    title: 'Ábyrg sólbaðsupplifun',
    body: 'Við leggjum áherslu á ábyrga notkun ljósabekkja svo þú náir árangri án þess að brenna.',
  },
]

export const FAQ = [
  {
    q: 'Hvernig bóka ég tíma?',
    a: 'Þú bókar á Noona, annaðhvort á noona.app/sportsol eða í Noona appinu. Þar sérðu lausa tíma í báðum stofum í rauntíma. Þú getur líka hringt í 554 3799.',
  },
  {
    q: 'Hvor stofan hentar mér?',
    a: 'Báðar stofur eru með JEWEL og standandi bekki. Vegaz og infrared bekkurinn eru í Hamraborg 16 í Kópavogi og X10 og X10 Túrbó í Hverafold 1-3 í Grafarvogi. Veldu stofuna sem er nær þér, eða bekkinn sem þig langar í.',
  },
  {
    q: 'Af hverju er verðið lægra fyrir klukkan 14?',
    a: 'Morgunverð gildir milli klukkan 10 og 14 og er um tuttugu prósentum lægra en dagverð. Ef þú kemst í ljós fyrir klukkan tvö sparar þú á hverjum einasta tíma.',
  },
  {
    q: 'Hvað er innifalið í áskrift?',
    a: 'Fimmtán mínútna ljósatími eða infrared tími alla daga, allan ársins hring, í báðum stofum. Áskrift frá 8.990 kr. á mánuði, sem gerir um 299 kr. á dag.',
  },
  {
    q: 'Hvað er Frelsi?',
    a: 'Frelsi er inneignarkort: þú greiðir 10.000 kr. og færð 12.500 kr. inneign. Inneignin rennur aldrei út, gildir í báðum stofum og hana má nota með helgartilboði og morguntilboði.',
  },
  {
    q: 'Hvað er infrared bekkurinn?',
    a: 'American M7 infrared bekkurinn í Hamraborg notar innrautt ljós. Meðferðin er djúp og kraftmikil og skilar hámarksárangri á aðeins 15 mínútum. Hreint handklæði og sturtuaðstaða í einkaklefa fylgja.',
  },
]
