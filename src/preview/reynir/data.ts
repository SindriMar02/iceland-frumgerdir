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
/** Full-size gallery frame (lightbox). */
const gal = (n: string) => `${import.meta.env.BASE_URL}reynir/gallery/gal-${n}.webp`
/** 800px variant of the same frame, for the masonry tiles — the grid renders
 *  them around 380px wide, so shipping the 2000px file to every tile would
 *  cost ~5.8MB for a gallery that needs 600KB. Paired via srcset. */
const galSm = (n: string) => `${import.meta.env.BASE_URL}reynir/gallery/gal-${n}-sm.webp`
/** Real B&W "hands shaping dough" photo from their own site, warm-toned. */
export const HERO_IMG = `${import.meta.env.BASE_URL}reynir/hero-dough.jpg`
/** THE pistachio snúður, from Reynir's own 2020 shoot, masked to a circle so
 *  the medallion can turn without revealing a rectangle behind it. A true
 *  cutout was attempted and abandoned: the bun's pale crust and the baking
 *  parchment sit too close in tone, so every threshold that removed the paper
 *  also ate the crust. The circle keeps a sliver of parchment, which reads as
 *  paper rather than as an error. */
export const FEATURE_IMG = `${import.meta.env.BASE_URL}reynir/pistasiusnudur.webp`
/** The same bun wider, keeping the caramel running off the edge — the framed
 *  product shot in the featured slot. */
export const PRODUCT_IMG = `${import.meta.env.BASE_URL}reynir/pistasiusnudur-bakki.jpg`
/** The shop itself: their wall of framed black-and-white bakery photographs,
 *  the "HANDVERKSBAKARÍ" sign, and the tables you can sit at. */
export const SHOP_IMG = `${import.meta.env.BASE_URL}reynir/bud.webp`

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
  /** Full-size frame, used by the lightbox. */
  src: string
  /** 800px variant for the masonry tile; paired with src via srcset. */
  srcSm: string
  /** Intrinsic pixel size, used only to reserve aspect ratio (no layout shift). */
  w: number
  h: number
  caption: { en: string; is: string }
}

/** Reynir's own professional shoot (August 2020), in the photographer's own
 *  black-and-white selects, at full resolution from the originals — these
 *  replace the ~1700px versions previously harvested off their Wix site.
 *
 *  Ordered as one morning rather than as sixteen nice pictures: the dough is
 *  mixed, weighed and shaped, the cinnamon goes on, the rolls are cut, the
 *  ovens are loaded and emptied, the cakes and sandwiches are finished, and
 *  the room is working. Chosen from 220 frames; see reynir-photo-map.md for
 *  the full selection and what was left out. */
export const GALLERY: GalleryPhoto[] = [
  { src: gal('01'), srcSm: galSm('01'), w: 1335, h: 2000, caption: { en: 'Lifting the dough from the tub', is: 'Deigið lyft upp úr karinu' } },
  { src: gal('02'), srcSm: galSm('02'), w: 1335, h: 2000, caption: { en: 'The dough goes in to rest', is: 'Deigið sett í kar' } },
  { src: gal('03'), srcSm: galSm('03'), w: 2000, h: 1335, caption: { en: 'Flour across the bench', is: 'Hveiti yfir borðið' } },
  { src: gal('04'), srcSm: galSm('04'), w: 1335, h: 2000, caption: { en: 'Cutting the dough to weight', is: 'Deigið vigtað og skorið' } },
  { src: gal('05'), srcSm: galSm('05'), w: 1335, h: 2000, caption: { en: 'Shaped by hand', is: 'Mótað í höndunum' } },
  { src: gal('06'), srcSm: galSm('06'), w: 1335, h: 2000, caption: { en: 'Spreading the cinnamon', is: 'Kanilsmjörið smurt á' } },
  { src: gal('07'), srcSm: galSm('07'), w: 1335, h: 2000, caption: { en: 'Cutting the roll', is: 'Rúllan skorin' } },
  { src: gal('08'), srcSm: galSm('08'), w: 1335, h: 2000, caption: { en: 'The scissor cut that makes a snúður', is: 'Klippt í snúða' } },
  { src: gal('09'), srcSm: galSm('09'), w: 1335, h: 2000, caption: { en: 'A tray, shaped and ready', is: 'Bakkinn mótaður og tilbúinn' } },
  { src: gal('10'), srcSm: galSm('10'), w: 2000, h: 1335, caption: { en: 'Into the deck oven', is: 'Sett í steinofninn' } },
  { src: gal('11'), srcSm: galSm('11'), w: 2000, h: 1335, caption: { en: 'The oven’s glow', is: 'Ofninn glóir' } },
  { src: gal('12'), srcSm: galSm('12'), w: 1335, h: 2000, caption: { en: 'The tin loaf, out', is: 'Formbrauðið úr ofninum' } },
  { src: gal('13'), srcSm: galSm('13'), w: 1335, h: 2000, caption: { en: 'Straight from the oven', is: 'Beint úr ofninum' } },
  { src: gal('14'), srcSm: galSm('14'), w: 1335, h: 2000, caption: { en: 'Glazing the buns', is: 'Bollurnar gljáðar' } },
  { src: gal('15'), srcSm: galSm('15'), w: 1335, h: 2000, caption: { en: 'The cake gets its cream', is: 'Rjóminn á tertuna' } },
  { src: gal('16'), srcSm: galSm('16'), w: 1335, h: 2000, caption: { en: 'Building the day’s sandwiches', is: 'Samlokur dagsins settar saman' } },
  { src: gal('17'), srcSm: galSm('17'), w: 2000, h: 1335, caption: { en: 'The bakery at work', is: 'Bakaríið að störfum' } },
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
    galleryIntro: 'Sourdough on the bench and the ovens already running before the doors open. A look at the everyday craft, in photos.',
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
    galleryIntro: 'Súrdeigið á borðinu og ofnarnir komnir í gang áður en opnað er. Innsýn í daglegt handverk, í myndum.',
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
