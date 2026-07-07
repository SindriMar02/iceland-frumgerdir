/**
 * Reynir bakari — landing-page data (bilingual EN/IS, English-first toggle).
 *
 * Clones the Passion Reykjavík design system (near-black #131313 ground,
 * antique-gold serif, deep burgundy, ivory; Lusitana + Source Serif 4) per the
 * brief — same design + colours, re-skinned with Reynir's own logo, facts and
 * voice. Family craft bakery in Kópavogur, Dalvegur 4 + Hamraborg 14.
 *
 * HONESTY GUARDRAILS (prototype disclaimed in PreviewFooter):
 *   - LOGO is their real script wordmark (from reynirbakari.is), recoloured to
 *     the shared gold so it reads on the dark ground; shape unchanged.
 *   - HERO image is their real B&W "hands shaping dough" photo from their own
 *     site, warm-toned to fit the palette. No invented photography.
 *   - PRICES are REAL, from their aha.is delivery menu (aha.is/veitingar/
 *     reynir-bakari, fetched Jul 2026). Their own site publishes no price list.
 *   - HOURS = their own site (Dalvegur): Mon–Sat 06–17, Sun 07–17. Hamraborg
 *     hours conflict across sources + are not on their site → we direct to a
 *     phone call rather than state a possibly-wrong time.
 *   - STORY facts (founded 1 Feb 1994; founder Reynir (Carl) Þorleifsson;
 *     passed 2019; sons Þorleifur Karl + Henry Þór took over; ~20 staff; all
 *     baked on-site from scratch) are from their About page (reynirbakari.is/
 *     um-okkur) + kopavogsbladid.is (2016).
 *   - REVIEW quote + ratings (Google 4,5 / 63; Facebook 92% recommend) are
 *     real (RestaurantGuru / Facebook). Only one quotable review existed; not
 *     padded with invented ones.
 */

export type Lang = 'en' | 'is'

export const LOGO = `${import.meta.env.BASE_URL}reynir/brand/logo.png`
/** Real B&W "hands shaping dough" photo from their own site, warm-toned. */
export const HERO_IMG = `${import.meta.env.BASE_URL}reynir/hero-dough.jpg`
/** Pistachio snúður, cut out to a TRANSPARENT background (Higgsfield asset,
 *  cutout via corner floodfill — see IMAGE-PROMPTS.md). Transparent so only the
 *  bun rotates as it travels, with no square/ghost background behind it. */
export const FEATURE_IMG = `${import.meta.env.BASE_URL}reynir/pistasiusnudur.webp`

export const LINKS = {
  order: 'https://www.aha.is/veitingar/reynir-bakari',
  facebook: 'https://www.facebook.com/ReynirBakari',
  instagram: 'https://www.instagram.com/reynir.bakari',
  phone: '+3545644700',
  phoneLabel: '564 4700',
  phone2Label: '554 4200',
  email: 'reynirbakari@reynirbakari.is',
  orderEmail: 'pantanir@reynirbakari.is',
} as const

/** Weekly hours, minutes-from-midnight, UTC (Iceland has no DST). Dalvegur,
 *  from their own site: Mon–Sat 06–17, Sun 07–17. */
export const HOURS_BY_DAY = [
  { open: 7 * 60, close: 17 * 60 }, // Sun
  { open: 6 * 60, close: 17 * 60 }, // Mon
  { open: 6 * 60, close: 17 * 60 }, // Tue
  { open: 6 * 60, close: 17 * 60 }, // Wed
  { open: 6 * 60, close: 17 * 60 }, // Thu
  { open: 6 * 60, close: 17 * 60 }, // Fri
  { open: 6 * 60, close: 17 * 60 }, // Sat
] as const

export interface MenuItem {
  name: string
  price: string
  tag?: { en: string; is: string }
  desc: { en: string; is: string }
}

/** The house favourite — the pistachio Danish guests single out. */
export const FEATURE: MenuItem = {
  name: 'Pistasíusnúður',
  price: '610 kr.',
  desc: {
    en: 'The pistachio Danish guests single out by name, one of the reasons regulars keep coming back.',
    is: 'Pistasíusnúðurinn sem gestir nefna sérstaklega, ein af ástæðunum fyrir því að fastagestir koma aftur og aftur.',
  },
}

/** Pastries — real names + aha.is prices. */
export const MENU: MenuItem[] = [
  {
    name: 'Vínarbrauðslengja með súkkulaði',
    price: '1.395 kr.',
    desc: {
      en: 'A long Danish pastry finished with chocolate, made to share.',
      is: 'Vínarbrauðslengja með súkkulaði, tilvalin til að deila.',
    },
  },
  {
    name: 'Kanillengja',
    price: '1.395 kr.',
    tag: { en: 'Loved', is: 'Vinsælt' },
    desc: {
      en: 'The cinnamon length, soft and generous down its full length.',
      is: 'Kanillengjan, mjúk og vel útilátin endanna á milli.',
    },
  },
  {
    name: 'Snúður með súkkulaði glassúr',
    price: '550 kr.',
    desc: {
      en: 'The classic Icelandic snúður under a real chocolate glaze.',
      is: 'Klassíski snúðurinn undir súkkulaðiglassúr.',
    },
  },
  {
    name: 'Sérbakað vínarbrauð',
    price: '620 kr.',
    desc: {
      en: 'A single Danish pastry, baked fresh through the morning.',
      is: 'Stakt vínarbrauð, bakað ferskt yfir morguninn.',
    },
  },
  {
    name: 'Moohnsnúður',
    price: '610 kr.',
    desc: {
      en: 'A poppyseed roll for anyone after something a little different.',
      is: 'Valmúasnúður fyrir þá sem vilja eitthvað aðeins öðruvísi.',
    },
  },
  {
    name: 'Kleina',
    price: '395 kr.',
    desc: {
      en: 'The traditional Icelandic twist, fried the old way.',
      is: 'Hefðbundin íslensk kleina, steikt eins og hún á að vera.',
    },
  },
]

/** Traditional breads — real names + aha.is prices. */
export const BREAD: MenuItem[] = [
  { name: 'Hvítt súrdeigsbrauð', price: '1.190 kr.', desc: { en: 'White sourdough, slow-proved and baked on-site.', is: 'Hvítt súrdeigsbrauð, hæghefað og bakað á staðnum.' } },
  { name: 'Gróft súrdeigsbrauð', price: '1.190 kr.', desc: { en: 'Wholegrain sourdough with a deep crust.', is: 'Gróft súrdeigsbrauð með þéttri skorpu.' } },
  { name: 'Döðlubrauð', price: '1.110 kr.', desc: { en: 'Naturally sweet date bread.', is: 'Náttúrulega sætt döðlubrauð.' } },
  { name: 'Sexkornabrauð', price: '930 kr.', desc: { en: 'A six-grain loaf, hearty and healthy.', is: 'Sexkornabrauð, matarmikið og hollt.' } },
  { name: 'Þriggja korna brauð', price: '930 kr.', desc: { en: 'Three grains in one everyday loaf.', is: 'Þrjú korn í einu hversdagsbrauði.' } },
  { name: 'Normalbrauð', price: '930 kr.', desc: { en: 'The everyday standard loaf.', is: 'Venjulega brauðið fyrir hvern dag.' } },
]

/** Celebration cakes — real names + aha.is prices. */
export const CAKES: MenuItem[] = [
  { name: 'Skúffukaka', price: '1.920 kr.', desc: { en: '', is: '' } },
  { name: 'Gulrótarkaka', price: '1.920 kr.', desc: { en: '', is: '' } },
  { name: 'Djöflaterta', price: '3.480 kr.', desc: { en: '', is: '' } },
  { name: 'Hressóterta', price: '7.600 kr.', desc: { en: '', is: '' } },
]

export const T = {
  en: {
    navMenu: 'The counter',
    navBread: 'Bread',
    navStory: 'Our story',
    navVisit: 'Visit',
    orderPrimary: 'Order delivery',
    ctaMenu: 'See the menu',
    statusOpen: (t: string) => `Open now, we close at ${t}`,
    statusOpensToday: (t: string) => `Closed, we open at ${t} today`,
    statusOpensTomorrow: (t: string) => `Closed, we open tomorrow at ${t}`,
    heroTitle: 'HANDMADE',
    heroSub: 'A family bakery in Kópavogur since 1994.',
    heroLine: 'Sourdough, Danish pastries, cakes and coffee, all baked on-site from scratch.',
    heroPhotoCaption: 'Shaping the day, Reynir bakari',
    hoursShort: ['Mon to Fri 6 to 17', 'Sat 6 to 17, Sun 7 to 17'],
    menuMasthead: 'The menu',
    ovenTitle: 'From the oven',
    ovenIntro: 'Baked fresh through the morning. Prices as listed on aha.is.',
    featuredLabel: 'The house favourite',
    breadKicker: 'Baked from scratch',
    breadTitle: 'The bread.',
    breadIntro: 'Sourdough and traditional Icelandic loaves, many of them sugar-free and made with Icelandic rapeseed oil.',
    breadNote: 'Prices as listed on aha.is.',
    statementKicker: 'Our story',
    statementQuote: 'Everything made here, from scratch.',
    statementWho: 'Reynir bakari, since 1994',
    storyP1:
      'Reynir Þorleifsson opened the bakery with his family in 1994 and became one of the people who built up the Kópavogur valley. Everything is still baked on-site, from scratch.',
    storyP2:
      'When Reynir passed away in 2019, his sons Þorleifur Karl and Henry Þór took over the ovens they had learned at. Around twenty people bake here.',
    cateringKicker: 'Cakes & catering',
    cateringTitle: 'Baked for the occasion.',
    cateringBody:
      'Celebration cakes in cream, marzipan and chocolate, plus full catering for parties and events. Tell us the occasion and we will quote it.',
    cateringCta: 'Send an enquiry',
    reviewQuote: 'Great pistachio Danish.',
    reviewWho: 'gj Anderson, Google',
    trustLine: '4.5 on Google across 63 reviews. 92% recommend on Facebook.',
    visitKicker: 'Two locations',
    visitTitle: 'Find us',
    mainLabel: 'Bakery and café',
    mainName: 'Dalvegur 4, 201 Kópavogur',
    rowHours: 'Hours',
    rowPhone: 'Phone',
    rowEmail: 'Email',
    hoursRows: ['Mon to Fri 6:00 to 17:00', 'Sat 6:00 to 17:00', 'Sun 7:00 to 17:00'],
    secondLabel: 'Also in Hamraborg',
    secondName: 'Hamraborg 14, 200 Kópavogur',
    secondNote: 'Our second Kópavogur bakery. Call 554 4200 for its opening hours.',
    deliveryNote: 'Home delivery across the capital area through aha.is.',
    footerTag: 'Family-run craft bakery in Kópavogur since 1994',
  },
  is: {
    navMenu: 'Úr ofninum',
    navBread: 'Brauð',
    navStory: 'Sagan',
    navVisit: 'Heimsókn',
    orderPrimary: 'Panta heim',
    ctaMenu: 'Skoða úrvalið',
    statusOpen: (t: string) => `Opið núna, lokum kl. ${t}`,
    statusOpensToday: (t: string) => `Lokað, opnum kl. ${t} í dag`,
    statusOpensTomorrow: (t: string) => `Lokað, opnum á morgun kl. ${t}`,
    heroTitle: 'HANDGERT',
    heroSub: 'Fjölskyldubakarí í Kópavogi síðan 1994.',
    heroLine: 'Súrdeigsbrauð, vínarbrauð, kökur og kaffi, allt bakað á staðnum frá grunni.',
    heroPhotoCaption: 'Deigið mótað, Reynir bakari',
    hoursShort: ['Mán til fös 6 til 17', 'Lau 6 til 17, sun 7 til 17'],
    menuMasthead: 'Matseðillinn',
    ovenTitle: 'Úr ofninum',
    ovenIntro: 'Bakað ferskt yfir morguninn. Verð eins og þau birtast á aha.is.',
    featuredLabel: 'Uppáhald hússins',
    breadKicker: 'Bakað frá grunni',
    breadTitle: 'Brauðin.',
    breadIntro: 'Súrdeigsbrauð og hefðbundin íslensk brauð, mörg sykurlaus og bökuð með íslenskri repjuolíu.',
    breadNote: 'Verð eins og þau birtast á aha.is.',
    statementKicker: 'Sagan',
    statementQuote: 'Allt gert á staðnum, frá grunni.',
    statementWho: 'Reynir bakari, síðan 1994',
    storyP1:
      'Reynir Þorleifsson opnaði bakaríið með fjölskyldu sinni árið 1994 og varð einn af frumkvöðlum atvinnulífsins í Kópavogsdalnum. Enn í dag er allt bakað á staðnum, frá grunni.',
    storyP2:
      'Þegar Reynir féll frá árið 2019 tóku synir hans, Þorleifur Karl og Henry Þór, við ofnunum sem þeir lærðu við. Um tuttugu manns baka hér.',
    cateringKicker: 'Tertur og veislur',
    cateringTitle: 'Bakað fyrir tilefnið.',
    cateringBody:
      'Rjóma, marsípan og súkkulaðitertur fyrir stóru stundirnar, ásamt veisluþjónustu fyrir hvers kyns viðburði. Segið okkur frá tilefninu og við gerum tilboð.',
    cateringCta: 'Senda fyrirspurn',
    reviewQuote: 'Frábær pistasíusnúður.',
    reviewWho: 'gj Anderson, Google',
    trustLine: '4,5 á Google úr 63 umsögnum. 92% mæla með á Facebook.',
    visitKicker: 'Tveir staðir',
    visitTitle: 'Finndu okkur',
    mainLabel: 'Bakarí og kaffihús',
    mainName: 'Dalvegur 4, 201 Kópavogur',
    rowHours: 'Opnunartími',
    rowPhone: 'Sími',
    rowEmail: 'Netfang',
    hoursRows: ['Mán til fös 6:00 til 17:00', 'Lau 6:00 til 17:00', 'Sun 7:00 til 17:00'],
    secondLabel: 'Einnig í Hamraborg',
    secondName: 'Hamraborg 14, 200 Kópavogur',
    secondNote: 'Hitt bakaríið okkar í Kópavogi. Hringið í 554 4200 fyrir opnunartíma.',
    deliveryNote: 'Heimsending um höfuðborgarsvæðið í gegnum aha.is.',
    footerTag: 'Fjölskyldurekið handverksbakarí í Kópavogi síðan 1994',
  },
} as const
