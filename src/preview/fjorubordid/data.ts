/**
 * Fjöruborðið, Stokkseyri. Every string here is verbatim from fjorubordid.is
 * (fetched 2026-09-05: forsíða, /matsedill/, /sagan-af-supunni/,
 * /opnunartimi/). Nothing is invented: no dish, price, hour or claim that is
 * not on their own site. Their dashes are written out ("12:00 til 21:00").
 */
const BASE = import.meta.env.BASE_URL

export const IMG = {
  hero: `${BASE}fjorubordid/hero-humar.jpg`, // MG_8523, their langoustine in the pan, 2880x1920
  pan: `${BASE}fjorubordid/koparpanna.jpg`, // pantabord, the copper pan, 2400x1603
  table: `${BASE}fjorubordid/bord-raudur-stoll.jpg`, // A4A5682, set table with the red chair, 2400x2400
  room: `${BASE}fjorubordid/salurinn.jpg`, // dining room, upscaled 2880x1626
  soup: `${BASE}fjorubordid/supa-dokkur-grunnur.jpg`, // the soup on the dark ground, 1903x599 native strip
  wood: `${BASE}fjorubordid/black-wood-e1504817995775.jpg`,
  logoCream: `${BASE}fjorubordid/fjorubordid-logo-cream.svg`,
  logoRed: `${BASE}fjorubordid/fjorubordid-logo-red.svg`,
}

export const CONTACT = {
  name: 'Fjöruborðið',
  street: 'Eyrarbraut 3a',
  town: '825 Stokkseyri',
  phoneDisplay: '483 1550',
  phoneHref: 'tel:+3544831550',
  email: 'info@fjorubordid.is',
  booking: 'https://bookings.dineout.is/fjorubordid',
  giftCards: 'https://bookings.dineout.is/fjorubordid/order',
  map: 'https://maps.google.com/?q=Eyrarbraut+3a,+825+Stokkseyri',
}

export const HOURS = {
  days: 'Mánudaga til sunnudaga',
  open: '12:00 til 21:00',
  lastBooking: 'Síðustu borðapantanir kl. 20:00',
  note: 'Við mælum með að pantað sé borð, alla daga, allt árið.',
}

export const NAV = [
  { label: 'Matseðill', href: '#matsedill' },
  { label: 'Sagan', href: '#sagan' },
  { label: 'Opnunartími', href: '#opnunartimi' },
]

export const HERO = {
  eyebrow: 'Stokkseyri, síðan 1995',
  // Their own line, cut to the fragment that carries it.
  title: 'Frægasta humarsúpa lýðveldisins.',
  sub: 'Humarhalar í skel, steiktir í hvítlauk og smjöri, við fjöruborðið á Stokkseyri. Opið alla daga 12:00 til 21:00.',
  cta: 'Panta borð',
}

/** The signature: one dish, four weights. Prices verbatim from /matsedill/. */
export const WEIGHTS = [
  { grams: 200, price: '8.450', threeCourse: '12.750' },
  { grams: 250, price: '9.350', threeCourse: null },
  { grams: 300, price: '10.250', threeCourse: '14.250' },
  { grams: 400, price: '12.450', threeCourse: '16.450' },
] as const

export const WEIGHTS_INTRO = {
  eyebrow: 'Leturhumar Fjöruborðsins',
  title: 'Sama pannan. Þú velur þyngdina.',
  text: 'Humarhalar í skel steiktir í hvítlauk og smjöri, bornir fram með sítrónu og steinselju ásamt smákartöflum, pikkluðum gúrkum með dilli og salati. Allir réttir eru bornir fram með heimabökuðu brauði og sælkerasósum.',
  more: 'Allur matseðillinn',
}

/** Sagan af súpunni, six of their sentences, in their order. */
export const SAGA = [
  'Hefurðu gengið fagran skeljasandinn í fjöru Stokkseyrar?',
  'Þessi súpa er göldrótt.',
  'Hún hefur nefninlega sjálfstæðan vilja og er því varasöm þeim sem treysta sér ekki upp fyrir normið.',
  'Þessa súpu hafa menn barist fyrir með storminn í fangið til þess eins að njóta.',
  'Fjöruborðið á Stokkseyri er nautnahús í álögum.',
  'Njóttu vel! Mundu að lifa lífinu til fullnustu.',
]
export const SAGA_SOURCE = 'Úr Sögunni af súpunni'

export const ROOM = {
  line: 'Menn þurfa að beita sig valdi til að eiga þaðan afturkvæmt.',
  text: 'En það er allt í lagi, einungis góðir gjörningar eiga sér stað innan veggja, nokkuð sem kitlar bæði maga og sál.',
}

export type MenuRow = { name: string; price: string; text?: string }
export type MenuGroup = { title: string; note?: string; rows: MenuRow[] }

export const MENU: MenuGroup[] = [
  {
    title: 'Þriggja rétta matseðill',
    note: 'Humarsúpan sem forréttur, Leturhumar Fjöruborðsins í aðalrétt og eftirréttur að eigin vali.',
    rows: [
      { name: 'Með 400 gr í aðalrétt', price: '16.450' },
      { name: 'Með 300 gr í aðalrétt', price: '14.250' },
      { name: 'Með 200 gr í aðalrétt', price: '12.750' },
    ],
  },
  {
    title: 'Leturhumar Fjöruborðsins',
    note: 'Síðan 1995. Humarhalar í skel steiktir í hvítlauk og smjöri bornir fram með sítrónu og steinselju ásamt smákartöflum, pikkluðum gúrkum með dilli og salati.',
    rows: [
      { name: '400 gr', price: '12.450' },
      { name: '300 gr', price: '10.250' },
      { name: '250 gr', price: '9.350' },
      { name: '200 gr', price: '8.450' },
    ],
  },
  {
    title: 'Humar í göldróttri súpu',
    note: 'Menn hætta á að verða úti á leið sinni til Stokkseyrar til þess eins að stinga upp í sig skeið og skeið. Með rjóma, tómötum, töfrum og ástríðum.',
    rows: [
      { name: 'Aðalréttur', price: '5.250' },
      { name: 'Forréttur', price: '3.750' },
    ],
  },
  {
    title: 'Aðrar krásir',
    rows: [
      { name: 'Grænmetisréttur', price: '5.250', text: 'Stökkt grænmetisbuff með blómkálsostafyllingu, fersku salati og cous cous með karrý og hvítlauk' },
      { name: 'Steiktur lambahryggvöðvi', price: '7.400', text: 'Borinn fram með smákartöflum, rauðvínssósu og fersku salati' },
    ],
  },
  {
    title: 'Fyrir börnin',
    rows: [
      { name: 'Kjúklinganaggar með frönskum kartöflum', price: '1.490' },
      { name: 'Grilluð samloka með skinku, osti og frönskum', price: '1.490' },
    ],
  },
  {
    title: 'Eftirréttir',
    rows: [{ name: 'Úrval af heimabökuðum tertum', price: '1.850' }],
  },
]

export const DRINKS: MenuGroup[] = [
  {
    title: 'Hristir og hrærðir',
    rows: [
      { name: 'Aperol Spritz', price: '2.300', text: 'Aperol og Prosecco' },
      { name: 'Dry Martini', price: '2.590', text: 'Gin og þurr vermouth' },
      { name: 'Manhattan', price: '2.590', text: 'Bourbon, sætur vermouth og bitters' },
      { name: 'Negroni', price: '2.590', text: 'Campari, gin og sætur vermouth' },
      { name: 'White Russian', price: '2.590', text: 'Vodka, Kahlúa og rjómi' },
      { name: 'Black Russian', price: '2.590', text: 'Vodka og Kahlúa' },
      { name: 'Old Fashioned', price: '2.590', text: 'Bourbon og bitters' },
      { name: 'Kir', price: '2.300', text: 'Crème de Cassis og hvítvín' },
      { name: 'Kir Royal', price: '3.100', text: 'Crème de Cassis og Cava' },
    ],
  },
  {
    title: 'Sangria og spritzer',
    rows: [
      { name: 'Sangria, glas', price: '2.350', text: 'Rauðvín eða hvítvín, brandy, appelsína og 7up' },
      { name: 'Sangria, karafla', price: '4.150' },
      { name: 'Hvítvíns spritzer', price: '1.350', text: 'Hvítvín og sódavatn' },
      { name: 'Rauðvíns spritzer', price: '1.350', text: 'Rauðvín og ginger ale' },
      { name: 'Ferskju spritzer', price: '1.550', text: 'Hvítvín, ferskjulíkjör og 7up' },
    ],
  },
  {
    title: 'Óáfengir',
    rows: [
      { name: 'Engiferkarlinn', price: '650', text: 'Appelsínusafi og engiferöl' },
      { name: 'Shirley Temple', price: '650', text: '7up og grenadine, raspberry eða lime' },
    ],
  },
]

export const MENU_NOTE = 'Allir réttir eru bornir fram með heimabökuðu brauði og sælkerasósum.'
