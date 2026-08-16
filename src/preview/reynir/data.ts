/**
 * Reynir bakari — landing-page data (bilingual EN/IS, English-first toggle).
 *
 * Clones the Passion Reykjavík design system (near-black #131313 ground,
 * antique-gold serif, deep burgundy, ivory; Lusitana + Source Serif 4) per the
 * brief — same design + colours, re-skinned with Reynir's own logo, facts and
 * voice. Family craft bakery in Kópavogur, Dalvegur 4.
 *
 * HONESTY GUARDRAILS (prototype disclaimed in PreviewFooter):
 *   - LOGO is their real script wordmark (from reynirbakari.is), recoloured to
 *     the shared gold so it reads on the dark ground; shape unchanged.
 *   - HERO image is their real B&W "hands shaping dough" photo from their own
 *     site, warm-toned to fit the palette. No invented photography.
 *   - PRICES are REAL, from their aha.is delivery menu (aha.is/veitingar/
 *     reynir-bakari, fetched Jul 2026). Their own site publishes no price list.
 *   - HOURS = 07–17 EVERY DAY, confirmed directly by the owner (Þorleifur,
 *     2026-08-16). Supersedes the Mon–Sat 06–17 / Sun 07–17 published on their
 *     own (stale) Wix site.
 *   - ONE LOCATION. Their Hamraborg 14 shop CLOSED around 2024 — confirmed by
 *     the owner 2026-08-16. Their live Wix site, Google and aha.is may still
 *     list it; this site must not. (The earlier caution here — that Hamraborg
 *     hours "conflict across sources" — turned out to be because it was shut.)
 *   - STORY facts (founded 1 Feb 1994; founder Reynir (Carl) Þorleifsson;
 *     passed 2019; sons Þorleifur Karl + Henry Þór took over; ~20 staff; all
 *     baked on-site from scratch) are from their About page (reynirbakari.is/
 *     um-okkur) + kopavogsbladid.is (2016).
 *   - REVIEW quote + ratings (Google 4,5 / 63; Facebook 92% recommend) are
 *     real (RestaurantGuru / Facebook). Only one quotable review existed; not
 *     padded with invented ones.
 */

export type Lang = 'en' | 'is'

export const LOGO = `${import.meta.env.BASE_URL}reynir/brand/logo.webp`
const gal = (n: string) => `${import.meta.env.BASE_URL}reynir/gallery/gal-${n}.webp`
/** Real B&W "hands shaping dough" photo from their own site, warm-toned. */
export const HERO_IMG = `${import.meta.env.BASE_URL}reynir/hero-dough.jpg`
/** Pistachio snúður, cut out to a TRANSPARENT background (Higgsfield asset,
 *  cutout via corner floodfill — see IMAGE-PROMPTS.md). Transparent so only the
 *  bun rotates as it travels, with no square/ghost background behind it. */
export const FEATURE_IMG = `${import.meta.env.BASE_URL}reynir/pistasiusnudur.webp`
/** Torn-open, gooey pistachio snúður (Higgsfield) — the framed product shot in
 *  the featured slot. */
export const PRODUCT_IMG = `${import.meta.env.BASE_URL}reynir/pistasiusnudur-torn.jpg`

export const LINKS = {
  order: 'https://www.aha.is/veitingar/reynir-bakari',
  facebook: 'https://www.facebook.com/ReynirBakari',
  instagram: 'https://www.instagram.com/reynir.bakari',
  phone: '+3545644700',
  phoneLabel: '564 4700',
  email: 'reynirbakari@reynirbakari.is',
  orderEmail: 'pantanir@reynirbakari.is',
} as const

/** Weekly hours, minutes-from-midnight, UTC (Iceland has no DST). 07–17 every
 *  day, confirmed by the owner 2026-08-16. This array is the ONE source the
 *  hours come from: the live open/closed badge reads it, and the printed
 *  "Every day 7:00 to 17:00" line is generated from it (see sanity.ts's
 *  buildHoursRows) rather than written out a second time by hand. */
export const HOURS_BY_DAY = [
  { open: 7 * 60, close: 17 * 60 }, // Sun
  { open: 7 * 60, close: 17 * 60 }, // Mon
  { open: 7 * 60, close: 17 * 60 }, // Tue
  { open: 7 * 60, close: 17 * 60 }, // Wed
  { open: 7 * 60, close: 17 * 60 }, // Thu
  { open: 7 * 60, close: 17 * 60 }, // Fri
  { open: 7 * 60, close: 17 * 60 }, // Sat
] as const

export interface MenuItem {
  name: string
  price: string
  tag?: { en: string; is: string }
  desc: { en: string; is: string }
}

export interface Review {
  quote: { en: string; is: string }
  who: string
}

/** Real, sourced reviews only (per the honesty guardrail above) — currently just
 *  the two that exist with quotable text: the Google review already on aha.is/
 *  RestaurantGuru, and one Facebook recommendation (visible logged-out on their
 *  page, 15 Jul 2020). RestaurantGuru's other two reviews are star-ratings only,
 *  no text. Not padded to a "nicer" number. */
export const REVIEWS: Review[] = [
  {
    quote: { en: 'Great pistachio Danish.', is: 'Frábær pistasíusnúður.' },
    who: 'gj Anderson, Google',
  },
  {
    quote: {
      en: 'I wear glasses every day and absolutely hate it, but popping into Reynir Bakari for one of their “gleruauga” always makes my day better. Thanks!',
      is: 'Ég nota gleraugu á hverjum degi og gjörsamlega hata það, en að hoppa inn hjá Reyni Bakara og kaupa mér eitt „gleruauga“ hjá þeim gerir daginn minn alltaf betri. Takk fyrir mig!',
    },
    who: 'Hrafn Sigurðarson, Facebook',
  },
]

export interface GalleryPhoto {
  src: string
  /** Intrinsic pixel size, used only to reserve aspect ratio (no layout shift). */
  w: number
  h: number
  caption: { en: string; is: string }
}

/** Candid black-and-white bakery photography, harvested from their own site
 *  (reynirbakari.is/um-okkur) at full native resolution — real bakers, real
 *  ovens, the shop floor. Two near-duplicate rack shots were dropped from the
 *  live site's set of 18; the rest is shown here. */
export const GALLERY: GalleryPhoto[] = [
  { src: gal('01'), w: 1564, h: 1426, caption: { en: 'Shaping the morning’s first loaves', is: 'Fyrstu brauðin mótuð að morgni' } },
  { src: gal('02'), w: 1700, h: 1134, caption: { en: 'Into the deck oven', is: 'Í ofninn' } },
  { src: gal('03'), w: 1088, h: 1120, caption: { en: 'Building the day’s sandwiches', is: 'Samlokur settar saman' } },
  { src: gal('04'), w: 1700, h: 1360, caption: { en: 'Checking the bread rack', is: 'Litið eftir brauðunum' } },
  { src: gal('05'), w: 1700, h: 1359, caption: { en: 'Sourdough, shaped by hand', is: 'Súrdeig mótað í höndunum' } },
  { src: gal('08'), w: 1360, h: 1700, caption: { en: 'Working the dough', is: 'Deigið hnoðað' } },
  { src: gal('07'), w: 1700, h: 1133, caption: { en: 'A slice of the day’s cake', is: 'Sneið af dagsins köku' } },
  { src: gal('14'), w: 1360, h: 1700, caption: { en: 'Loading the deck oven', is: 'Brauðin sett í ofninn' } },
  { src: gal('12'), w: 1700, h: 1360, caption: { en: 'The old Fortuna mixer, still at work', is: 'Gamla Fortuna-hrærivélin enn í notkun' } },
  { src: gal('17'), w: 1134, h: 1700, caption: { en: 'Cutting the dough to weight', is: 'Deigið vigtað og skorið' } },
  { src: gal('11'), w: 1565, h: 1252, caption: { en: 'Cream puffs, fresh', is: 'Rjómabollur, nýjar' } },
  { src: gal('18'), w: 1134, h: 1700, caption: { en: 'The final shape, by hand', is: 'Lokahnykkurinn, með höndunum' } },
  { src: gal('15'), w: 1134, h: 1700, caption: { en: 'Shaping the rolls', is: 'Bollur mótaðar' } },
  { src: gal('09'), w: 640, h: 428, caption: { en: 'Fresh from the counter', is: 'Nýbakað úr búðinni' } },
  { src: gal('10'), w: 1200, h: 800, caption: { en: 'A celebration cake, plated', is: 'Tertan tilbúin' } },
  { src: gal('13'), w: 640, h: 960, caption: { en: 'A finished creation', is: 'Fullbúið verk' } },
]

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
    navGallery: 'Gallery',
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
    menuMasthead: 'The menu',
    ovenTitle: 'From the oven',
    ovenIntro: 'Baked fresh through the morning. Prices as listed on aha.is.',
    featuredLabel: 'The house favourite',
    breadKicker: 'Baked from scratch',
    breadTitle: 'The bread.',
    breadIntro: 'Sourdough and traditional Icelandic loaves, many of them sugar-free and made with Icelandic rapeseed oil.',
    breadNote: 'Prices as listed on aha.is.',
    galleryKicker: 'Behind the counter',
    galleryTitle: 'In the bakery.',
    galleryIntro: 'Sourdough on the bench, the ovens running since six every morning. A look at the everyday craft, in photos.',
    galleryClose: 'Close',
    galleryPrev: 'Previous photo',
    galleryNext: 'Next photo',
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
    trustLine: '4.5 on Google across 63 reviews. 92% recommend on Facebook (21 reviews).',
    visitKicker: 'Open every day',
    visitTitle: 'Find us',
    mainLabel: 'Bakery and café',
    mainName: 'Dalvegur 4, 201 Kópavogur',
    rowHours: 'Hours',
    rowPhone: 'Phone',
    rowEmail: 'Email',
    deliveryNote: 'Home delivery across the capital area through aha.is.',
    footerTag: 'Family-run craft bakery in Kópavogur since 1994',
  },
  is: {
    navMenu: 'Úr ofninum',
    navBread: 'Brauð',
    navGallery: 'Myndir',
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
    menuMasthead: 'Matseðillinn',
    ovenTitle: 'Úr ofninum',
    ovenIntro: 'Bakað ferskt yfir morguninn. Verð eins og þau birtast á aha.is.',
    featuredLabel: 'Uppáhald hússins',
    breadKicker: 'Bakað frá grunni',
    breadTitle: 'Brauðin.',
    breadIntro: 'Súrdeigsbrauð og hefðbundin íslensk brauð, mörg sykurlaus og bökuð með íslenskri repjuolíu.',
    breadNote: 'Verð eins og þau birtast á aha.is.',
    galleryKicker: 'Bakvið borðið',
    galleryTitle: 'Í bakaríinu.',
    galleryIntro: 'Súrdeigið á borðinu, ofnarnir í gangi frá klukkan sex á morgnana. Innsýn í daglegt handverk, í myndum.',
    galleryClose: 'Loka',
    galleryPrev: 'Fyrri mynd',
    galleryNext: 'Næsta mynd',
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
    trustLine: '4,5 á Google úr 63 umsögnum. 92% mæla með á Facebook (21 umsögn).',
    visitKicker: 'Opið alla daga',
    visitTitle: 'Finndu okkur',
    mainLabel: 'Bakarí og kaffihús',
    mainName: 'Dalvegur 4, 201 Kópavogur',
    rowHours: 'Opnunartími',
    rowPhone: 'Sími',
    rowEmail: 'Netfang',
    deliveryNote: 'Heimsending um höfuðborgarsvæðið í gegnum aha.is.',
    footerTag: 'Fjölskyldurekið handverksbakarí í Kópavogi síðan 1994',
  },
} as const
