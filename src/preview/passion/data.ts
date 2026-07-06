/**
 * Passion Reykjavík — landing-page data (bilingual EN/IS, English-first).
 *
 * Family-run artisan bakery, Álfheimar 6, 104 Reykjavík + a bollur counter at
 * Fjarðarkaup, Hafnarfjörður. Their real site (passionreykjavik.is) has shown
 * an "under construction" placeholder since at least April 2024 (Wayback
 * digest identical Apr 2024 → Jul 2026) while /bollur is a working order page.
 *
 * HONESTY GUARDRAILS (prototype is disclaimed in PreviewFooter):
 *   - BRAND is theirs, not invented: gold-serif + burgundy-brushstroke logo
 *     (public/passion/brand/logo.png, from passionreykjavik.is), palette
 *     sampled from that logo (#111 page ground is their own site background),
 *     Lusitana + Source Serif are the fonts their current build preloads.
 *   - MENU prices are REAL Wolt listings (wolt.com/en/isl/reykjavik/venue/
 *     passion-bakari, fetched Jul 2026): Cinnabon 645, Nutella Cinnabon 715,
 *     Lúxus Cinnabon jarðaberja 715, Ostaslaufa 655, Skinkuhorn 655, Snúður
 *     með ekta súkkulaði 590, Ástarpungur 500. Disclaimed "as listed on Wolt".
 *   - BOLLUR: 15 kinds, 810 kr (Croissant bolla 910), bulk 100+ by email,
 *     seasonal — all from their own live page passionreykjavik.is/bollur.
 *   - REVIEWS are real TripAdvisor quotes with reviewer handles + dates.
 *   - STATS: TripAdvisor 4.8/57 reviews, #6 of 19 Reykjavík bakeries (fetched
 *     Jul 2026). NO founding year anywhere (none is documented — do not add).
 *   - The sourdough quote is reported by veitingageirinn.is (tag page for
 *     Passion; Styrmir Már Sigmundsson named there as bakari og eigandi).
 *   - Interior description (chandeliers, dark wood, fireplace) phrased as
 *     what guests describe, sourced from published reviews/guides.
 *   - PHOTOGRAPHY: deliberately none except the one existing cinnamon-roll
 *     plate (public/passion/cinnabon.jpg, Higgsfield asset already in the
 *     repo, flat cream ground). Every other image slot is a labelled
 *     placeholder frame — HD shots to be added with the owner.
 */

export type Lang = 'en' | 'is'

export const LOGO = `${import.meta.env.BASE_URL}passion/brand/logo.png`
export const CINNABON_IMG = `${import.meta.env.BASE_URL}passion/cinnabon.jpg`
/** Hero Cinnabon on a flat #131313 ground — Higgsfield asset, see IMAGE-PROMPTS.md. */
export const HERO_IMG = `${import.meta.env.BASE_URL}passion/hero-cinnabon.jpg`
/** Second shot for the menu feature: the Cinnabon torn open, side angle, same
 *  flat #131313 ground — Higgsfield asset, see IMAGE-PROMPTS.md shot 2.
 *  Until the file exists the card shows a labelled placeholder frame. */
export const FEATURE_IMG = `${import.meta.env.BASE_URL}passion/feature-cinnabon.jpg`

export const LINKS = {
  wolt: 'https://wolt.com/en/isl/reykjavik/venue/passion-bakari',
  instagram: 'https://www.instagram.com/passionreykjavik',
  facebook: 'https://www.facebook.com/passionreykjavik',
  phone: '+3545536280',
  phoneLabel: '553 6280',
  email: 'passionreykjavik@simnet.is',
} as const

/** Weekly hours, minutes-from-midnight, UTC (Iceland has no DST — UTC = local).
 *  Source: passionreykjavik.is structured data (their own site). */
export const HOURS_BY_DAY = [
  { open: 9 * 60, close: 16 * 60 }, // Sun
  { open: 7 * 60 + 30, close: 17 * 60 }, // Mon
  { open: 7 * 60 + 30, close: 17 * 60 }, // Tue
  { open: 7 * 60 + 30, close: 17 * 60 }, // Wed
  { open: 7 * 60 + 30, close: 17 * 60 }, // Thu
  { open: 7 * 60 + 30, close: 17 * 60 }, // Fri
  { open: 8 * 60, close: 16 * 60 }, // Sat
] as const

export interface MenuItem {
  /** Icelandic product name — kept in both languages (it is the real name) */
  name: string
  price: string
  tag?: { en: string; is: string }
  desc: { en: string; is: string }
  /** true = the one real photo we have */
  photo?: boolean
}

/** Feature item — the one with a real photo already in the repo. */
export const FEATURE: MenuItem = {
  name: 'Cinnabon',
  price: '645 kr.',
  desc: {
    en: 'The roll people cross town for. Soft, generous and glazed while still warm.',
    is: 'Snúðurinn sem fólk keyrir yfir bæinn fyrir. Mjúkur, vel útilátinn og gljáður á meðan hann er enn heitur.',
  },
  photo: true,
}

export const MENU: MenuItem[] = [
  {
    name: 'Nutella Cinnabon',
    price: '715 kr.',
    tag: { en: 'New', is: 'Nýtt' },
    desc: {
      en: 'The house roll, filled and finished with Nutella.',
      is: 'Húsins snúður, fylltur og toppaður með Nutella.',
    },
  },
  {
    name: 'Lúxus Cinnabon jarðaberja',
    price: '715 kr.',
    tag: { en: 'New', is: 'Nýtt' },
    desc: {
      en: 'A luxury take on the Cinnabon, crowned with strawberry.',
      is: 'Lúxusútgáfa af Cinnabon, krýnd með jarðaberjum.',
    },
  },
  {
    name: 'Ostaslaufa',
    price: '655 kr.',
    desc: {
      en: 'A flaky cheese twist, best while the coffee is hot.',
      is: 'Flögótt ostaslaufa, best á meðan kaffið er heitt.',
    },
  },
  {
    name: 'Skinkuhorn',
    price: '655 kr.',
    desc: {
      en: 'A savoury ham crescent, baked through the morning.',
      is: 'Skinkuhorn, bakað jafnt og þétt yfir morguninn.',
    },
  },
  {
    name: 'Snúður með ekta súkkulaði',
    price: '590 kr.',
    desc: {
      en: 'The classic Icelandic snúður, iced with real chocolate.',
      is: 'Klassíski snúðurinn, með ekta súkkulaði.',
    },
  },
  {
    name: 'Ástarpungur',
    price: '500 kr.',
    desc: {
      en: 'The traditional "love puff", fried the old way.',
      is: 'Ástarpungur eins og hann á að vera.',
    },
  },
]

/** All 15 bollur from passionreykjavik.is/bollur — names + real fillings. */
export const BOLLUR: { name: string; filling: { en: string; is: string } }[] = [
  {
    name: 'Bolla ársins 2026',
    filling: {
      en: 'Raspberry jam, Danish macaroons and orange vanilla cream',
      is: 'Hindberjasulta, danskar makkarónur og vanillurjómi með appelsínubragði',
    },
  },
  {
    name: 'Croissant bolla',
    filling: {
      en: 'Strawberry jam, strawberry cream, crumble and fresh strawberries',
      is: 'Jarðaberjasulta, jarðaberjarjómi, crumble og fersk jarðaber',
    },
  },
  {
    name: 'Classic bolla',
    filling: {
      en: 'Blackcurrant jam and cream, topped with chocolate glaze',
      is: 'Sólberjasulta og rjómi, toppuð með súkkulaðiglassúr',
    },
  },
  {
    name: 'Vegan bolla',
    filling: {
      en: 'Vegan croissant with strawberry jam, vegan cream and Oreo',
      is: 'Vegancroissant með jarðaberjasultu, veganrjóma og oreokexi',
    },
  },
  { name: 'After Eight bolla', filling: { en: 'Mint cream and After Eight', is: 'Mynturjómi og After Eight' } },
  { name: 'Snickers og banana bolla', filling: { en: 'Nutella, banana cream and Snickers', is: 'Nutella, bananarjómi og Snickerskurl' } },
  { name: 'Twix bolla', filling: { en: 'Caramel cream and Twix', is: 'Karamellurjómi og Twix' } },
  { name: 'Oreo bolla', filling: { en: 'Oreo cream and vanilla', is: 'Oreorjómi og vanillukrem' } },
  { name: 'Irish bolla', filling: { en: 'Irish coffee cream, mocha glaze', is: 'Irish kaffirjómi og mokkaglassúr' } },
  { name: 'Karamellu bolla', filling: { en: 'Caramel cream', is: 'Karamellurjómi' } },
  { name: 'Jarðaberja bolla', filling: { en: 'Strawberry jam and strawberry cream', is: 'Jarðaberjasulta og jarðaberjarjómi' } },
  { name: 'Kókosbollu bolla', filling: { en: 'Meringue crumble, raspberries and a kókosbolla', is: 'Marengs crumble, hindber og kókosbolla' } },
  { name: 'Nóakropp bolla', filling: { en: 'Cream and Nóakropp', is: 'Rjómi og Nóakropp' } },
  { name: 'Púns bolla', filling: { en: 'Rum cream with vanilla filling', is: 'Rommrjómi með vanillufyllingu' } },
  { name: 'Valentínusarbolla', filling: { en: 'Biscoff cream and Biscoff crumble', is: 'Biscoff krem og biscoff crumble' } },
]

/** Real TripAdvisor quotes (handles + dates as published). */
export const REVIEWS = [
  {
    quote: 'A surprising amount of vegan options for an Icelandic bakery, and such high quality.',
    who: 'Mia D',
    when: { en: 'May 2026', is: 'Maí 2026' },
  },
  {
    quote: 'Pure indulgence for a reasonable price, chilled cosy atmosphere with friendly welcoming staff.',
    who: 'Rehcopple',
    when: { en: 'January 2026', is: 'Janúar 2026' },
  },
  {
    quote: 'This is without a doubt the best bakery in Reykjavik. The cinnamon rolls are to die for.',
    who: 'ValgerdurSig',
    when: { en: 'June 2023', is: 'Júní 2023' },
  },
] as const

export const T = {
  en: {
    navMenu: 'The counter',
    navBollur: 'Bollur',
    navStory: 'Our story',
    navVisit: 'Visit',
    orderWolt: 'Order on Wolt',
    statusOpen: (t: string) => `Open now, we close at ${t}`,
    statusOpensToday: (t: string) => `Closed, we open at ${t} today`,
    statusOpensTomorrow: (t: string) => `Closed, we open tomorrow at ${t}`,
    heroTitle: 'FRESHLY BAKED',
    heroSub: 'A family-run artisan bakery in Reykjavík.',
    heroLine: 'Sourdough, pastries, cakes and coffee, baked with real passion at Álfheimar 6.',
    ctaCounter: 'See the counter',
    hoursShort: ['Mon to Fri 7:30 to 17', 'Sat 8 to 16, Sun 9 to 16'],
    menuMasthead: 'The menu',
    ovenTitle: 'From the oven',
    ovenIntro: 'Baked through the day, priced as listed on our Wolt menu.',
    featuredLabel: 'The house favourite',
    galleryTitle: 'The counter, in photographs',
    photoNote: 'HD photography of the counter is in production. Marked frames show where it will live.',
    placeholder: 'HD photo in production',
    bollurKicker: 'A Reykjavík tradition',
    bollurTitle: 'Fifteen kinds of bollur.',
    bollurIntro:
      'Every February, before Bolludagur, the counter fills with cream buns. Fifteen kinds, from the classic to the ones you will not find anywhere else.',
    bollurPrice: '810 kr. each, Croissant bolla 910 kr.',
    bollurBulk: 'Orders of 100 or more by email.',
    bollurSeason: 'Seasonal. Online orders open in the weeks before Bolludagur.',
    veganTitle: 'Vegan, done properly.',
    veganBody:
      'Vegan croissants, breads and cinnamon buns share the counter with everything else, made with the same care. Ask what is vegan today.',
    veganQuote: 'Their chocolate raspberry vegan croissant is worth the trip to Iceland alone.',
    veganWho: 'Loree L, TripAdvisor, January 2023',
    storyTitle: 'A family bakery,\nin every sense.',
    storyP1:
      'Passion is run by the family that bakes here. Guests describe a room of chandeliers, dark wood and a little fireplace, the kind of place you stay in longer than you meant to.',
    storyP2:
      'The name is not decoration. It is how the baking is done, from the sourdough up.',
    storyQuote: 'There is real passion in this sourdough bread.',
    storyQuoteWho: 'Styrmir Már Sigmundsson, baker and owner',
    stats: [
      { value: '4.8', caption: 'on TripAdvisor, 57 reviews' },
      { value: '#6', caption: 'of 19 bakeries in Reykjavík' },
      { value: '15', caption: 'kinds of bollur each season' },
      { value: '2', caption: 'places to find us' },
    ],
    interiorLabel: 'The room at Álfheimar 6',
    reviewsTitle: 'What guests say',
    reviewsNote: 'From TripAdvisor',
    visitKicker: 'Two counters',
    visitTitle: 'Find us',
    mainLabel: 'Bakery and café',
    mainName: 'Álfheimar 6, 104 Reykjavík',
    counterLabel: 'Bollur counter',
    counterName: 'Fjarðarkaup, Hafnarfjörður',
    counterNote: 'Our bollur, sold at the Fjarðarkaup counter.',
    rowHours: 'Hours',
    rowPhone: 'Phone',
    rowEmail: 'Email',
    hoursRows: ['Mon to Fri 7:30 to 17:00', 'Sat 8:00 to 16:00', 'Sun 9:00 to 16:00'],
    deliveryNote: 'Delivery across the capital area through Wolt.',
    footerTag: 'Family-run artisan bakery in Reykjavík',
  },
  is: {
    navMenu: 'Úr ofninum',
    navBollur: 'Bollur',
    navStory: 'Sagan',
    navVisit: 'Heimsókn',
    orderWolt: 'Panta á Wolt',
    statusOpen: (t: string) => `Opið núna, lokum kl. ${t}`,
    statusOpensToday: (t: string) => `Lokað, opnum kl. ${t} í dag`,
    statusOpensTomorrow: (t: string) => `Lokað, opnum á morgun kl. ${t}`,
    heroTitle: 'NÝBAKAÐ',
    heroSub: 'Fjölskyldurekið handverksbakarí í Reykjavík.',
    heroLine: 'Súrdeigsbrauð, sætabrauð, kökur og kaffi, bakað af alvöru ástríðu í Álfheimum 6.',
    ctaCounter: 'Skoða úrvalið',
    hoursShort: ['Mán til fös 7:30 til 17', 'Lau 8 til 16, sun 9 til 16'],
    menuMasthead: 'Matseðillinn',
    ovenTitle: 'Úr ofninum',
    ovenIntro: 'Bakað yfir daginn, verð eins og þau birtast á Wolt.',
    featuredLabel: 'Uppáhald hússins',
    galleryTitle: 'Borðið, í myndum',
    photoNote: 'Ljósmyndir af úrvalinu eru í vinnslu. Merktir rammar sýna hvar þær koma.',
    placeholder: 'Ljósmynd í vinnslu',
    bollurKicker: 'Reykvísk hefð',
    bollurTitle: 'Fimmtán tegundir af bollum.',
    bollurIntro:
      'Á hverju ári, vikurnar fyrir bolludag, fyllist borðið af bollum. Fimmtán tegundir, frá þeirri klassísku yfir í þær sem fást hvergi annars staðar.',
    bollurPrice: '810 kr. stykkið, Croissant bolla 910 kr.',
    bollurBulk: 'Pantanir upp á 100 stykki eða fleiri í tölvupósti.',
    bollurSeason: 'Árstíðabundið. Netpantanir opna vikurnar fyrir bolludag.',
    veganTitle: 'Vegan, gert almennilega.',
    veganBody:
      'Vegan croissant, brauð og snúðar standa við hliðina á öllu hinu, gerð af sömu alúð. Spyrjið hvað er vegan í dag.',
    veganQuote: 'Their chocolate raspberry vegan croissant is worth the trip to Iceland alone.',
    veganWho: 'Loree L, TripAdvisor, janúar 2023',
    storyTitle: 'Fjölskyldubakarí,\ní öllum skilningi.',
    storyP1:
      'Passion er rekið af fjölskyldunni sem bakar hér. Gestir lýsa stofu með ljósakrónum, dökkum viði og litlum arni, stað þar sem maður situr lengur en maður ætlaði.',
    storyP2: 'Nafnið er ekki skraut. Það er lýsing á því hvernig er bakað, alveg frá súrnum.',
    storyQuote: 'Það er sko ástríða í þessu súrdeigsbrauði.',
    storyQuoteWho: 'Styrmir Már Sigmundsson, bakari og eigandi',
    stats: [
      { value: '4,8', caption: 'á TripAdvisor, 57 umsagnir' },
      { value: '#6', caption: 'af 19 bakaríum í Reykjavík' },
      { value: '15', caption: 'tegundir af bollum á hverri vertíð' },
      { value: '2', caption: 'staðir til að finna okkur' },
    ],
    interiorLabel: 'Stofan í Álfheimum 6',
    reviewsTitle: 'Það sem gestir segja',
    reviewsNote: 'Af TripAdvisor',
    visitKicker: 'Tveir staðir',
    visitTitle: 'Finndu okkur',
    mainLabel: 'Bakarí og kaffihús',
    mainName: 'Álfheimar 6, 104 Reykjavík',
    counterLabel: 'Bolluborðið',
    counterName: 'Fjarðarkaup, Hafnarfirði',
    counterNote: 'Bollurnar okkar, seldar við borðið í Fjarðarkaupum.',
    rowHours: 'Opnunartími',
    rowPhone: 'Sími',
    rowEmail: 'Netfang',
    hoursRows: ['Mán til fös 7:30 til 17:00', 'Lau 8:00 til 16:00', 'Sun 9:00 til 16:00'],
    deliveryNote: 'Heimsending um höfuðborgarsvæðið í gegnum Wolt.',
    footerTag: 'Fjölskyldurekið handverksbakarí í Reykjavík',
  },
} as const
