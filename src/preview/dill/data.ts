import type { PreviewCompany } from '../company-types'

/* Dill restaurant, Laugavegur 59, Reykjavik (Karl&Carl ehf., kt. 600717-1970).
   Design: the restaurantzimmerl.at system (sndr-teardowns PR #2), re-aimed.

   EVERY FACT BELOW IS THEIRS OR A DATED PUBLIC SOURCE. Sources, all read 2026-09-29:
   [W]  dillrestaurant.is (IS pages and /en pages)
   [N]  noona.app/dill, their own booking page (the newest statement of the offer)
   [M]  guide.michelin.com, article of 1 Feb 2023 (first Icelandic star, 2017; the
        second-floor stair) and the 2026 guide (Dill keeps one star)
   [S]  Skatturinn, Karl&Carl ehf.
   Prices are per guest. Nothing here is invented: where the source is silent the
   page is silent too (no opening hours are published anywhere, so none are shown). */

export type Lang = 'is' | 'en'

const BASE = import.meta.env.BASE_URL
export const img = (f: string) => `${BASE}dill/${f}.webp`
export const brand = (f: string) => `${BASE}dill/brand/${f}`

export const URLS = {
  site: 'https://www.dillrestaurant.is',
  book: 'https://noona.app/dill',
  vouchers: 'https://noona.app/dill?source=FoodAndDrinksScreen&rank=1#vouchers',
  michelin: 'https://guide.michelin.com/us/en/capital-region-iceland/reykjavik/restaurant/dill1186101',
  instagram: 'https://www.instagram.com/dillrestaurant/',
  facebook: 'https://www.facebook.com/dillrestaurantrvk/',
  phone: '+3545521522',
  email: 'dillrestaurant@dillrestaurant.is',
  jobs: 'jobs@dillrestaurant.is',
} as const

/* Reel and stack pictures. Widths/heights are the files' own, so nothing shifts. */
type Pic = { f: string; w: number; h: number; cls: 'wide' | 'tall' | 'square'; alt: Record<Lang, string> }

/* "16-18 courses" reel: the larder, the candle, the shelf. Wide and tall alternate as in the reference. */
export const REEL_RETTIR: Pic[] = [
  { f: 'rettir-hilla', w: 1280, h: 853, cls: 'wide', alt: { is: 'Hillur með glerkrukkum', en: 'Shelves of glass jars' } },
  { f: 'rettir-krukkur', w: 900, h: 1200, cls: 'tall', alt: { is: 'Glerkrukkur með hráefni', en: 'Glass jars of ingredients' } },
  { f: 'rettir-berja', w: 1280, h: 853, cls: 'wide', alt: { is: 'Krukka með berjum', en: 'A jar of berries' } },
  { f: 'rettir-stigi-ljos', w: 900, h: 1200, cls: 'tall', alt: { is: 'Hringstigi séður að ofan með ljósi', en: 'A spiral stair seen from above, with a lamp' } },
  { f: 'rettir-kerti', w: 1280, h: 853, cls: 'wide', alt: { is: 'Vínglös og kertaljós á borði', en: 'Wine glasses and a candle on a table' } },
  { f: 'rettir-skan', w: 900, h: 1200, cls: 'tall', alt: { is: 'Nærmynd af þurrkuðu jurtaefni', en: 'Close-up of a dried plant' } },
]

/* "3,5 hours" stack: the dining room, photographed November 2024 (their media library). */
export const STACK_SALUR: Pic[] = [
  { f: 'salur-1', w: 2000, h: 1125, cls: 'wide', alt: { is: 'Salurinn á DILL með kertaljósum og gluggum út að Laugavegi', en: 'The DILL dining room, candlelit, with windows onto Laugavegur' } },
  { f: 'salur-2', w: 2000, h: 1100, cls: 'wide', alt: { is: 'Borð með glösum og kertum við rauðan vegg', en: 'A table with glasses and candles against a red wall' } },
  { f: 'salur-3', w: 2000, h: 1100, cls: 'wide', alt: { is: 'Kringlótt borð undir ljósum við bláa mynd', en: 'A round table under pendant lamps beside a blue artwork' } },
  { f: 'salur-stigi', w: 2000, h: 1100, cls: 'wide', alt: { is: 'Svartur hringstigi og viðarklæddur veggur með ljósum', en: 'The black spiral stair and timber wall with lamps' } },
  { f: 'salur-5', w: 2000, h: 1100, cls: 'wide', alt: { is: 'Borð og bekkur með púðum í salnum', en: 'Tables and the cushioned bench in the dining room' } },
]

/* "Land and sea" reel: their photography of the country, wide / square / tall as in the reference. */
export const REEL_LAND: Pic[] = [
  { f: 'hero-halendi', w: 1920, h: 1280, cls: 'wide', alt: { is: 'Hálendið úr lofti, þoka og litrík fjöll', en: 'The highlands from the air, mist and coloured mountains' } },
  { f: 'land-hreindyr', w: 900, h: 900, cls: 'square', alt: { is: 'Hreindýr í þoku í hlíð', en: 'A reindeer on a misty hillside' } },
  { f: 'land-lundar', w: 900, h: 1350, cls: 'tall', alt: { is: 'Lundar á bjargbrún við sjóinn', en: 'Puffins on a sea cliff' } },
  { f: 'land-vegur', w: 1280, h: 853, cls: 'wide', alt: { is: 'Malarvegur í dal', en: 'A gravel road through a valley' } },
  { f: 'land-fjall', w: 900, h: 900, cls: 'square', alt: { is: 'Snævi þakið fjall og vatn', en: 'A snow-covered mountain and a lake' } },
  { f: 'land-thok', w: 900, h: 1324, cls: 'tall', alt: { is: 'Reykjavík úr lofti, litrík þök', en: 'Reykjavík from above, coloured roofs' } },
]

export const HERO_SLIDES = [
  { f: 'hero-salur', w: 2400, h: 1350, alt: { is: 'Salurinn á DILL', en: 'The DILL dining room' } },
  { f: 'hero-snaefellsnes', w: 2000, h: 1125, alt: { is: 'Fjallgarður og vatn á Snæfellsnesi', en: 'A mountain range and a lake on Snaefellsnes' } },
  { f: 'hero-halendi', w: 1920, h: 1280, alt: { is: 'Hálendið úr lofti', en: 'The highlands from the air' } },
] as const

export const PORTRAIT = { f: 'saga-jurtir', w: 1100, h: 1467 }
export const SPLIT_IMG = { f: 'umhverfi-skogur' }

/* The two experiences, from noona.app/dill [N]; the pairing names are theirs from
   dillrestaurant.is/matur-vin [W] (Signature) and the same page's English wording [N] (Short). */
export const OFFER = {
  signature: {
    name: 'The Signature One',
    price: '39.900',
    pairings: [
      { is: 'Vín og drykkjar pörun', en: 'Wine and beverage pairing', price: '21.300' },
      { is: 'Blönduð pörun', en: 'Mixed pairing', price: '19.300' },
      { is: 'Áfengislaus pörun', en: 'Alcohol-free pairing', price: '13.900' },
    ],
  },
  short: {
    name: 'The Short One',
    price: '19.950',
    pairings: [
      { is: 'Vín og drykkjar pörun', en: 'Wine and beverage pairing', price: '11.950' },
      { is: 'Blönduð pörun', en: 'Mixed pairing', price: '10.950' },
      { is: 'Áfengislaus pörun', en: 'Alcohol-free pairing', price: '7.950' },
    ],
  },
} as const

type Copy = {
  htmlLang: string
  title: string
  description: string
  nav: { reserve: string; langLabel: string; home: string }
  slideshow: { next: string; prev: string; pause: string; play: string }
  award: { label: string; line: string; caption: string }
  intro: { h1: string; lead: string; portraitAlt: string; storyLead: string; storyP: string }
  courses: { num: string; label: string; a11y: string; p1: string; p2: string; p3: string;
    priceHead: string; sig: string; short: string; sigNote: string; shortNote: string;
    allergy: string; allergy48: string; book: string; next: string }
  tables: { num: string; label: string; a11y: string; next: string }
  concept: { lead: string; strong: string; p: string; seats: string; splitLead: string; splitP1: string; splitP2: string; splitAlt: string }
  land: { h1: string; lead: string; p: string; next: string }
  welcome: { h1: string; addr1: string; addr2: string; addr3: string;
    seatSig: string; seatShort: string; kids: string; waitlist: string; book: string; vouchers: string; vouchersNote: string }
  footer: { copy: string; press: string; jobs: string; ig: string; fb: string; address1: string; address2: string }
}

export const T: Record<Lang, Copy> = {
  is: {
    htmlLang: 'is',
    title: 'DILL | Veitingastaður á Laugavegi 59 í Reykjavík',
    description:
      'DILL er veitingastaður á Laugavegi 59 í Reykjavík. Smakkseðill innblásinn af íslenskri náttúru, ein Michelin-stjarna. Bókaðu borð eða gefðu gjafabréf.',
    nav: { reserve: 'Panta borð', langLabel: 'Tungumál', home: 'DILL, forsíða' },
    slideshow: { next: 'Næsta mynd', prev: 'Fyrri mynd', pause: 'Stöðva sjálfvirka myndaskiptingu', play: 'Hefja sjálfvirka myndaskiptingu' },
    award: {
      label: 'MICHELIN Guide',
      line: 'Ein stjarna',
      caption: 'Fyrsta Michelin-stjarna Íslands kom til DILL árið 2017.', // [M]
    },
    intro: {
      // [W] "Innblásið af íslenskri náttúru og tileinkað fersku hráefni, viltum jurtum og sjálfbærni, á DILL reynum við ..."
      h1: 'Innblásið af íslenskri náttúru',
      lead: 'Tileinkað fersku hráefni, viltum jurtum og sjálfbærni, á DILL reynum við að deila með þér frábærri matarupplifun sem endurspeglar margbrotið landslag okkar.',
      portraitAlt: 'Þurrkaðar jurtir hanga við glugga',
      // [W] /um-dill
      storyLead: 'DILL var stofnað árið 2009 og hefur síðan þá haft það markmið að færa öllum sínum gestum einstaka og eftirminnilega upplifun.',
      storyP: 'Frá upphafi höfum við einblínt á að kanna nýjar aðferðir og uppskriftir á okkar gömlu réttum og hefðum sem vekur svo nýtt líf á disknum og gleður gestsins hjarta.',
    },
    courses: {
      num: '16–18', label: 'réttir', a11y: '16 til 18 réttir',
      // [W] /matur-vin
      p1: 'DILL byggir á norrænni hugmyndafræði í matreiðslu og leggur áherslu á hráefni og hefðir frá Íslandi.',
      p2: 'Einfaldleikinn er lykillinn til að leyfa hráefninu að njóta sín, einstakt eins og íslenska landið. Matur okkar segir sögu náttúru okkar og bænda sem hafa ræktað garðinn sinn kynslóð eftir kynslóð.',
      p3: 'DILL leggur ríka áherslu á lífræn vín sem parast einstaklega vel með okkar mat.',
      priceHead: 'Verð á mann',
      sig: 'um 3,5 klst.', short: 'um 2 klst.',
      sigNote: 'Sá fyllri, byggður á helstu réttum DILL.', // [N] "The more complete option, built around Dill's most representative dishes."
      shortNote: 'Léttari og hnitmiðaðri, úrval af því besta úr eldhúsinu.', // [N]
      allergy:
        'Sökum þess hvernig matseðilinn okkar er uppsettur og allri þeirri vinnu sem fer í að búa hann til getum við því miður ekki boðið upp á matseðil án mjólkurafurða. Við reynum okkar allra besta til að koma á móts við gesti með ofnæmi, svo framarlega sem við erum látin vita með góðum fyrirvara.', // [W] verbatim
      allergy48: 'Ábendingar um ofnæmi og sérþarfir þurfa að berast með að minnsta kosti 48 klukkustunda fyrirvara.', // [N]
      book: 'Panta borð', next: 'Næsta mynd',
    },
    tables: { num: '3,5', label: 'klst.', a11y: 'Þrjár og hálf klukkustund', next: 'Næsta mynd' },
    concept: {
      strong: 'SALURINN',
      lead: 'Fiskiskúr og nútímaþægindi',
      // [W] /en/location "We look forward to hosting you at our location at Laugavegur 59, second floor, where a beautifully rendered fishing shed meets modern comfort."
      p: 'Við hlökkum til að sjá ykkur á Laugavegi 59, á annarri hæð, þar sem fallega útfærður fiskiskúr mætir nútímaþægindum.',
      seats: 'Í salnum er borð fyrir 1 til 6 gesti. Við eldhúsborðið er pláss fyrir 1 til 2 gesti.', // [N]
      // [W] /um-dill
      splitLead: 'Á DILL leggjum við upp með að virða öll þau hráefni sem til okkar koma, jafnt stór sem smá.',
      splitP1: 'Hver hlutur grípur athygli okkar og við gerum allt til að nýta hann.',
      splitP2: 'Það er á ábyrgð okkar allra að passa upp á umhverfið okkar og DILL er svo sannarlega engin undantekning frá því. Við erum öll með fullan fókus og ekki bara ætlum við að vera góð, við ætlum að bæta okkur á hverjum degi. Umhverfið skiptir okkur öllu.',
      splitAlt: 'Skógur séður að ofan í haustlitum',
    },
    land: {
      h1: 'Land og sjór',
      // [W] /um-dill
      lead: 'Gunnar Karl Gíslason ræður ríkjum á DILL, tilbúinn til að nýta hvað sem finnst í fjörum okkar, landi og sjó. Skila því svo á disk í formi rétta, jafn misjöfnum og veðrið.',
      p: 'Við vinnum með bændum, sjómönnum og fólki sem tínir villtar jurtir í nágrenninu.', // [N] "working with local farmers, fishermen, and foragers"
      next: 'Næsta mynd',
    },
    welcome: {
      h1: 'Velkomin á DILL',
      addr1: 'Laugavegur 59', addr2: '101 Reykjavík', addr3: 'Önnur hæð',
      seatSig: 'Eldhúsborð 1 til 2 gestir, salur 1 til 6 gesti.', // [N]
      seatShort: 'Salur, 2 til 6 gestir.', // [N]
      kids: 'Staðurinn er ekki sérstaklega hugsaður fyrir yngri gesti. Enginn barnamatseðill er í boði og allir gestir greiða fullt verð.', // [N]
      waitlist: 'Ef erfitt er að fá borð er hægt að skrá sig á biðlista með óskadagsetningu og fjölda gesta.', // [N]
      book: 'Panta borð', vouchers: 'Gjafabréf', vouchersNote: 'Gjafabréf fást frá 39.900 kr.', // [N] 39.900 to 61.200
    },
    footer: {
      copy: '©2026 DILL', press: 'Fjölmiðlar', jobs: 'Umsókn', ig: 'Instagram', fb: 'Facebook',
      address1: 'Laugavegur 59', address2: '101 Reykjavík',
    },
  },
  en: {
    htmlLang: 'en',
    title: 'DILL | Restaurant at Laugavegur 59, Reykjavík',
    description:
      'DILL is a restaurant at Laugavegur 59 in Reykjavík. A tasting menu inspired by the Icelandic landscape, one MICHELIN Star. Reserve a table or give a gift voucher.',
    nav: { reserve: 'Reserve', langLabel: 'Language', home: 'DILL, home' },
    slideshow: { next: 'Next image', prev: 'Previous image', pause: 'Pause the slideshow', play: 'Play the slideshow' },
    award: {
      label: 'MICHELIN Guide',
      line: 'One Star',
      caption: 'DILL earned Iceland its first MICHELIN Star in 2017.', // [M]
    },
    intro: {
      // [W] /en "Inspired by the Icelandic landscape and dedicated to fresh ingredients, foraging and sustainability, at DILL, we aim ..."
      h1: 'Inspired by the Icelandic landscape',
      lead: 'Dedicated to fresh ingredients, foraging and sustainability, at DILL we aim to share an exceptional dining experience that reflects the compelling characteristics of our land.',
      portraitAlt: 'Dried plants hanging by a window',
      // [W] /en/about-dill (grammar: "that bring new life", their text has "that brings")
      storyLead: 'DILL was founded in 2009 with the aim of delivering a unique and memorable experience of Iceland.',
      storyP: 'Since our inception, we have continued to explore new methods and preparations of our native ingredients that bring new life to the plate and the guest experience.',
    },
    courses: {
      num: '16–18', label: 'courses', a11y: '16 to 18 courses',
      // [W] /en/food-wine
      p1: 'As an expression of Nordic cooking, we honor Icelandic ingredients and traditions in our own unique way.',
      p2: 'Simplicity is key in allowing our ingredients to reach their full potential. As genuine and vibrant as the Icelandic countryside, our delivery of these ingredients tells stories of our nature and the farmers whose families have worked the land for generations.',
      p3: 'DILL offers a selection of organic and provocative wines to match our unorthodox cuisine. Our menu can be enjoyed with or without the wine experience.',
      priceHead: 'Price per guest',
      sig: 'about 3.5 hours', short: 'about 2 hours',
      sigNote: "The more complete option, built around Dill's most representative dishes.", // [N] verbatim
      shortNote: 'A lighter, more focused experience of the kitchen’s highlights.', // [N] shortened
      allergy:
        'Due to the setup of our menu and all the work that goes into it, we are unable to accommodate vegans or menus free from milk protein. We try to take all allergies into account, as long as we are informed beforehand.', // [W] verbatim
      allergy48: 'Please tell us about allergies and dietary needs at least 48 hours ahead.', // [N]
      book: 'Reserve', next: 'Next image',
    },
    tables: { num: '3.5', label: 'hours', a11y: 'Three and a half hours', next: 'Next image' },
    concept: {
      strong: 'THE ROOM',
      lead: 'A fishing shed with modern comfort',
      p: 'We look forward to hosting you at Laugavegur 59, second floor, where a beautifully rendered fishing shed meets modern comfort.', // [W] /en/location
      seats: 'A table in the dining room takes 1 to 6 guests. The kitchen counter takes 1 to 2 guests.', // [N]
      splitLead: 'At DILL, we endeavor to respect all the raw materials that come to us, no matter how big or small.', // [W] /en/about-dill
      splitP1: 'Each thing grabs our attention and we do everything to make use of it.', // [W]
      splitP2: 'It is up to all of us to look after our environment, and DILL is no exception. We are all fully focused, and we do not only mean to be good, we mean to improve every day. The environment means everything to us.', // [W] IS text, translated
      splitAlt: 'A forest in autumn colours seen from above',
    },
    land: {
      h1: 'Land and sea',
      // [W] /en/about-dill
      lead: 'Founding chef Gunnar Karl Gíslason is at our helm, prepared to explore the vast and multi-faceted Icelandic countryside with you and deliver a procession of dishes that one might say is as predictable as the Icelandic weather.',
      p: 'We work with local farmers, fishermen and foragers.', // [N]
      next: 'Next image',
    },
    welcome: {
      h1: 'Welcome to DILL',
      addr1: 'Laugavegur 59', addr2: '101 Reykjavík', addr3: 'Second floor',
      seatSig: 'Kitchen counter for 1 to 2 guests, dining room for 1 to 6.', // [N]
      seatShort: 'Dining room, 2 to 6 guests.', // [N]
      kids: 'The restaurant is not designed for younger guests. There is no children’s menu, and all guests pay the full price.', // [N]
      waitlist: 'If a table is hard to get, join the waitlist with your preferred dates and group size.', // [N]
      book: 'Reserve', vouchers: 'Gift vouchers', vouchersNote: 'Gift vouchers start at 39.900 ISK.', // [N]
    },
    footer: {
      copy: '©2026 DILL', press: 'Press', jobs: 'Careers', ig: 'Instagram', fb: 'Facebook',
      address1: 'Laugavegur 59', address2: '101 Reykjavík',
    },
  },
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'DILL',
  url: URLS.site,
  email: URLS.email,
  telephone: '+354 552 1522',
  foundingDate: '2009',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Laugavegur 59',
    postalCode: '101',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  sameAs: [URLS.instagram, URLS.facebook, URLS.michelin],
}

export const companyEntry: PreviewCompany = {
  slug: 'dill',
  route: '/preview/dill',
  name: 'Dill',
  sector: 'Veitingastaður með smakkseðli',
  location: 'Laugavegur 59, 101 Reykjavík',
  region: 'Reykjavík',
  established: 'Stofnað 2009, ein Michelin-stjarna.',
  currentUrl: 'https://www.dillrestaurant.is',
  ownerEmail: 'dillrestaurant@dillrestaurant.is',
  concept: 'Kertaljós, krukkur og land',
  conceptTagline:
    'DILL byrjar á salnum og hráefninu: rauður veggur og kertaljós, krukkur og þurrkaðar jurtir, og landið sem allt kemur úr. ' +
    'Vefurinn segir frá tveimur leiðum, sextán til átján réttum, og vísar beint í bókun og gjafabréf.',
  accent: '#D19A55',
  dark: true,
  status: 'Concept ready',
  thumb: `${BASE}dill/hero-salur.webp`,
  ownPhotography: true,
  photoCredit:
    'Ljósmyndir og merki eru í eigu DILL og sótt úr myndasafni dillrestaurant.is 29. september 2026.',
  audit: {
    strengths: [
      'Ljósmyndir af hráefni, landslagi og salnum í mikilli upplausn, allt að 6788 punkta á breidd',
      'Ein Michelin-stjarna í leiðarvísi ársins 2026, og DILL fékk fyrstu stjörnu Íslands árið 2017',
      'Bókun og gjafabréf eru þegar í Noona, með verði, lengd og fjölda gesta',
    ],
    weaknesses: [
      'Vefurinn keyrir á WordPress 5.2.21 frá 2019 og fær ekki öryggisuppfærslur',
      'Forsíðan nefnir hvorki Michelin-stjörnuna né matreiðslumanninn Gunnar Karl Gíslason',
      'Vefurinn sýnir einn seðil (39.900 kr.) en bókunarsíðan býður líka „The Short One“ á 19.950 kr. og eldhúsborð',
      'Myndir af salnum frá nóvember 2024 eru í myndasafni vefsins en birtast hvergi á honum',
      'Opnunartímar eru hvergi birtir og póstlinkurinn í fæti endar á punkti (dillrestaurant@dillrestaurant.is.)',
    ],
    opportunities: [
      'Báðar leiðirnar, verð og lengd fyrir framan gestinn áður en hann fer í bókun',
      'Gjafabréfin sýnileg frá forsíðu í aðdraganda jóla',
      'Salurinn og hráefnið sýnd með myndunum sem þegar eru til',
    ],
  },
  positioning:
    'DILL er veitingastaður með eina Michelin-stjörnu og ljósmyndir sem standa sig betur en vefurinn sem sýnir þær. ' +
    'Vefurinn á að sýna salinn, hráefnið og verðið eins og bókunarsíðan gerir nú þegar, og senda gestinn beint í Noona.',
  /* No outreach drafted: Sindri has authorized the build only. */
  outreach: { subject: '', body: '' },
}
