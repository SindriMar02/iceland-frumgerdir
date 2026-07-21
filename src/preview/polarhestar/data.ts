/**
 * Pólar Hestar — content data, trilingual (is/en/de).
 *
 * Every fact re-verified against polarhestar.is on 2026-07-06 via a full
 * three-language crawl (short tours + long tours + good-to-know + contact +
 * shop pages). Tour names are the company's own brand names PER LANGUAGE
 * (they differ: „Fyrstu kynni" = "Grýtubakki Charm" = „Zauberhaftes
 * Grýtubakki"). Prices are their published 2026 prices. The German copy
 * follows the site's own Sie-form register.
 *
 * Sample data (disclaimed in the footer): the three guest reviews and the
 * booking confirmation flow are prototype-only. Everything else is theirs.
 */

export type Lang = 'is' | 'en' | 'de'
export type L3 = { is: string; en: string; de: string }

/* ── Contact — single verified number; ghost landline from old site dropped ── */
export const PHONE_DISPLAY = '+354 896 1879'
export const PHONE_HREF = 'tel:+3548961879'
export const EMAIL = 'polarhestar@polarhestar.is'
/** Sandbox: booking requests go to Sindri; swap to the owner's inbox in the CMS at handoff. */
export const BOOKING_EMAIL = 'sindrimar02@gmail.com'
export const FACEBOOK = 'https://www.facebook.com/polarhestar'
export const INSTAGRAM = 'https://www.instagram.com/polarhestartours'
export const TRIPADVISOR =
  'https://www.tripadvisor.com/Attraction_Review-g189954-d1907268-Reviews-Polar_Hestar-Akureyri_Northeast_Region.html'
export const ADDRESS = 'Grýtubakki II, 616 Grenivík'
export const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'Pólar Hestar, Grýtubakki II, 616 Grenivík',
)}`

export const STATS = { years: 40, horses: 160, rating: '4,9', reviews: 263 }

/* ── Verified imagery (genuine Icelandic horses / North Iceland) ───────── */
export const IMG = {
  hero: 'photo-1501879779179-4576bae71d8d', // herd before a blue-grey snow mountain + fjord
  story: 'photo-1640892171250-2ef1c6f3b742', // white horse in mist — folklore
  booking: 'photo-1482779665037-990b5b461e91', // two horses nuzzling
  location: 'photo-1519092437326-bfd121eb53ae', // fjord road + water
  family: 'photo-1637354897876-b7df1d687628', // two riders, soft light
  ctaBand: 'photo-1778182967509-cc80b0faa2e3', // three horses under a stormy grey-blue sky
  procession: [
    'photo-1566251037378-5e04e3bec343',
    'photo-1463790323425-d6f5456869d7',
    'photo-1563734956808-602dab25525f',
    'photo-1497781495506-ce58b286d8f5',
    'photo-1694042877078-2fb0729d9ba2',
    'photo-1650735973119-f5b0fb72aa02',
    'photo-1598900154122-a6dad15d17d6',
    'photo-1694042877109-d1c547455cbf',
    'photo-1505436815265-8aa69d67f2e4',
  ],
}

/* ── Short tours — real 2026 line-up, names + prices from polarhestar.is ── */
export interface Tour {
  id: string
  name: L3 // the company's own brand name per language
  meta: L3 // duration / format / season window
  level: L3
  price: number // full 2026 price, ISK; children up to 12 pay 2.000 less
  image: string
  blurb: L3
  /** Months (1–12) the tour runs; empty/undefined = all year. Drives the booking-date hint. */
  months?: number[]
  /** Published departure times (24h, e.g. "09:00"); undefined = agreed on request. */
  times?: string[]
}

export const SHORT_TOURS: Tour[] = [
  {
    id: 'fyrstu-kynni',
    name: { is: 'Fyrstu kynni', en: 'Grýtubakki Charm', de: 'Zauberhaftes Grýtubakki' },
    meta: { is: '1 klukkustund', en: '1 hour', de: '1 Stunde' },
    level: { is: 'Fyrir alla · 6 ára+', en: 'All levels · age 6+', de: 'Alle Niveaus · ab 6' },
    price: 9500,
    times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    image: 'photo-1589157467587-913a38bb3d9d',
    blurb: {
      is: 'Tilvalin ferð til að prófa íslenska hestinn í fyrsta skipti. Frá Grýtubakka ríðum við að ánni Gljúfurá, meðfram henni og upp að fjallsrótum þar sem útsýnið yfir Eyjafjörð er fallegt.',
      en: 'The ideal tour for your first experience with the Icelandic horse. From Grýtubakki we ride towards the river Gljúfurá, along the riverside and up towards the mountains with a beautiful view over Eyjafjörður.',
      de: 'Der ideale Ritt für die erste Begegnung mit dem Islandpferd. Von Grýtubakki reiten wir zum Fluss Gljúfurá und entlang seines Flussbettes hinauf in die Berge, mit schönem Blick über den Eyjafjörður.',
    },
  },
  {
    id: 'moa-og-mela',
    name: { is: 'Yfir móa og mela', en: 'River & Mountains', de: 'Fluss & Berge' },
    meta: { is: '2 klukkustundir · maí–okt', en: '2 hours · May–Oct', de: '2 Stunden · Mai–Okt.' },
    level: { is: 'Fyrir alla · 6 ára+', en: 'All levels · age 6+', de: 'Alle Niveaus · ab 6' },
    price: 15000,
    months: [5, 6, 7, 8, 9, 10],
    times: ['10:00', '14:00'],
    image: 'photo-1726579209496-ceac166f72df',
    blurb: {
      is: 'Vinsælasta stutta ferðin okkar. Riðið er meðfram Gljúfurá, yfir engi og móa, í áttina að Eyjafirði eða upp á heiðarbrún, allt eftir veðri og reynslu hópsins.',
      en: 'Our most popular short tour. We ride along the river Gljúfurá, over green meadows and through moorland, towards Eyjafjörður or up towards the deserted peninsula of Fjörður, depending on the weather and the group.',
      de: 'Der beliebteste unserer kurzen Ritte. Wir reiten über grüne Wiesen entlang der Gljúfurá, durch Moorgebiete, Richtung Eyjafjörður oder hinauf in die Bergwelt der Halbinsel Fjörður.',
    },
  },
  {
    id: 'hofdahringur',
    name: { is: 'Höfðahringur', en: 'Fascinating Eyjafjörður', de: 'Faszination Eyjafjörður' },
    meta: { is: '3 klukkustundir · maí–okt', en: '3 hours · May–Oct', de: '3 Stunden · Mai–Okt.' },
    level: { is: 'Fyrir alla · 8 ára+', en: 'All levels · age 8+', de: 'Alle Niveaus · ab 8' },
    price: 18000,
    months: [5, 6, 7, 8, 9, 10],
    times: ['09:30', '14:00'],
    image: 'photo-1637354897519-5b962c8157e8',
    blurb: {
      is: 'Falleg ferð í kringum Þengilhöfða, meðfram Gljúfurá í áttina að Eyjafirði. Ef heppnin er með þér er góður möguleiki á að sjá hvali í firðinum.',
      en: 'A beautiful circuit around the hill Þengilhöfði towards the fjord, with a longer break above the fishing village Grenivík. With a bit of luck you can spot whales out on Eyjafjörður.',
      de: 'Eine schöne Runde um den Þengilhöfði mit Blick über den längsten Fjord Islands, Lebensraum von Buckelwalen, Zwergwalen und Schweinswalen. Mit etwas Glück sehen wir sie vom Sattel aus.',
    },
  },
  {
    id: 'frostrosir',
    name: { is: 'Frostrósir', en: 'Snowflakes & Frostroses', de: 'Schneeflocken & Frostrosen' },
    meta: { is: '1½ klukkustund · nóv–apr', en: '1½ hours · Nov–Apr', de: '1½ Stunden · Nov.–Apr.' },
    level: { is: 'Fyrir alla · 6 ára+', en: 'All levels · age 6+', de: 'Alle Niveaus · ab 6' },
    price: 12500,
    months: [11, 12, 1, 2, 3, 4],
    image: 'photo-1774018538486-49f5a51cd63f',
    blurb: {
      is: 'Vel klædd í kuldagalla njótum við reiðtúrs í átt að Eyjafirði í tæru vetrarlofti. Vetrarsólin skapar oft dulúðugt andrúmsloft og heima bíða heimagerðar kökur og heitir drykkir.',
      en: 'Wrapped up warm, we ride towards Eyjafjörður through the crisp northern air. The special light of the winter sun gives this ride a magical atmosphere, and homemade cakes and hot drinks warm you up back at the farm.',
      de: 'Warm eingepackt reiten wir durch die verschneite Landschaft Richtung Eyjafjörður. Das besondere Licht der Wintersonne verleiht diesem Ritt eine mystische Stimmung. Danach wärmen heiße Getränke und selbstgebackener Kuchen.',
    },
  },
  {
    id: 'sumarsaela',
    name: { is: 'Sumarsæla', en: 'Riding & Minigolf', de: 'Reiten & Minigolf' },
    meta: { is: 'Reiðtúr og mínígolf · jún–ágú', en: 'Ride & minigolf · Jun–Aug', de: 'Reiten & Minigolf · Juni–Aug.' },
    level: { is: 'Fyrir alla · 6 ára+', en: 'All levels · age 6+', de: 'Alle Niveaus · ab 6' },
    price: 13500,
    months: [6, 7, 8],
    image: 'photo-1452698325353-b90e60289e87',
    blurb: {
      is: 'Riðið er í einn og hálfan tíma meðfram ánni Gljúfurá og eftir hestaferðina er innifalið að skreppa á mínígolfvöllinn okkar, sex brautir sem allar tengjast Íslandi og umhverfinu. Lágmark tveir þátttakendur.',
      en: 'A 1½-hour ride along the river Gljúfurá with a fantastic view over the fjord, followed by a round on our self-made minigolf course, six lanes, each inspired by the farm and Icelandic nature. Minimum two participants.',
      de: 'Ein anderthalbstündiger Ritt entlang der Gljúfurá mit herrlichem Blick über den Fjord und danach ein Turnier auf unserem selbstgebauten Minigolfplatz mit sechs Bahnen. Mindestens zwei Teilnehmer.',
    },
  },
]

/* ── Long, multi-day tours — real 2026 programme with published EUR prices ── */
export interface LongTour {
  id: string
  name: L3 // EN brand name; the German market gets its own names
  meta: L3 // days · riding days · season · price
  blurb: L3
  image: string
  /** Rider requirements: min age, experience, group cap — published per tour. */
  requirements?: L3
  /** Published departures + availability for the coming season. */
  departures?: L3
}

export const LONG_TOURS: LongTour[] = [
  {
    id: 'midnightsun',
    name: { is: 'Ring around the Midnightsun', en: 'Ring around the Midnightsun', de: 'Sommersonnenwende' },
    meta: { is: '7 dagar · 5 reiðdagar · júní · 1.950€', en: '7 days · 5 riding days · June · €1,950', de: '7 Tage · 5 Reittage · Juni · 1.950 €' },
    requirements: {
      is: '12 ára+ · hámark 14 knapar',
      en: 'Age 12+ · max 14 riders',
      de: 'Ab 12 Jahren · max. 14 Reiter',
    },
    departures: {
      is: 'Brottfarir 2026: 5.–11. júní og 13.–19. júní (uppselt)',
      en: 'Departures 2026: June 5–11 and June 13–19 (fully booked)',
      de: 'Termine 2026: 5.–11. Juni und 13.–19. Juni (ausgebucht)',
    },
    image: 'photo-1626515406265-6d7395ece312',
    blurb: {
      is: 'Bjartar nætur og vaknandi náttúra setja svip sinn á þessa ferð um sumarsólstöður. Riðið er um Fnjóskadal, Látraströnd og Fjörður, með skoðunarferð við Mývatn og reiðtúr undir miðnætursól.',
      en: 'The scent of early summer, bright nights and awakening nature shape this tour around the solstice. We ride Fnjóskadalur, the coast of Látraströnd and Fjörður, with a sightseeing day at Mývatn and a ride under the midnight sun.',
      de: 'Der Duft des Frühsommers, helle Nächte und die erwachende Natur verleihen dieser Tour ihren besonderen Charakter. Wir reiten durch Fnjóskadalur, an der Küste Látraströnd und in Fjörður, mit Ausflugstag am Mývatn und Mitternachtsritt.',
    },
  },
  {
    id: 'fascinating-north',
    name: { is: 'Fascinating North Iceland', en: 'Fascinating North Iceland', de: 'Faszinierender Norden Islands' },
    meta: { is: '8 dagar · 6 reiðdagar · júní–júlí · 2.650€', en: '8 days · 6 riding days · June–July · €2,650', de: '8 Tage · 6 Reittage · Juni–Juli · 2.650 €' },
    requirements: {
      is: 'Fyrir vana knapa · 12 ára+ · hámark 16 knapar · 25–40 km á dag',
      en: 'Experienced riders · age 12+ · max 16 riders · 25–40 km a day',
      de: 'Für geübte Reiter · ab 12 Jahren · max. 16 Reiter · 25–40 km pro Tag',
    },
    departures: {
      is: 'Brottfarir 2026: 26. júní–3. júlí, 7.–14. júlí og 18.–25. júlí (uppselt)',
      en: 'Departures 2026: June 26–July 3, July 7–14 and July 18–25 (fully booked)',
      de: 'Termine 2026: 26. Juni – 3. Juli, 7.–14. Juli und 18.–25. Juli (ausgebucht)',
    },
    image: 'photo-1774281616625-9bfc1c9a2380',
    blurb: {
      is: 'Klassíska ferðin okkar, riðin með lausum hrossum. Gamlar þjóðleiðir norðursins liggja að Goðafossi, svörtum sandfjörum, hraunbreiðum og Mývatni.',
      en: 'Our classic, ridden with a free-running herd. The old trails of the North lead past the waterfall Goðafoss, black-sand beaches, lava fields and Lake Mývatn.',
      de: 'Unser Klassiker, geritten mit freilaufender Herde. Alte Pfade führen zum Wasserfall Goðafoss, zu schwarzen Stränden, Lavafeldern und zum See Mývatn.',
    },
  },
  {
    id: 'hidden-pearls',
    name: { is: 'Hidden Pearls of the North', en: 'Hidden Pearls of the North', de: 'Verborgene Schätze des Nordens' },
    meta: { is: '9 dagar · 7 reiðdagar · júlí–ágúst · 2.800€', en: '9 days · 7 riding days · July–August · €2,800', de: '9 Tage · 7 Reittage · Juli–August · 2.800 €' },
    requirements: {
      is: 'Fyrir vana knapa · 14 ára+',
      en: 'Experienced riders · age 14+',
      de: 'Für geübte Reiter · ab 14 Jahren',
    },
    departures: {
      is: 'Brottfarir 2026: 29. júlí–6. ágúst og 9.–17. ágúst (uppselt)',
      en: 'Departures 2026: July 29–August 6 and August 9–17 (fully booked)',
      de: 'Termine 2026: 29. Juli – 6. August und 9.–17. August (ausgebucht)',
    },
    image: 'photo-1569077016386-8a8a27da502f',
    blurb: {
      is: 'Um Flateyjardal og Fjörður, óbyggðir og eyðibýli sem fáir sjá. Tvær kyrrlátar nætur í notalegum fjallaskála við Þönglabakka í Þorgeirsfirði.',
      en: 'Through the valley of Flateyjardalur and the deserted peninsula of Fjörður few ever see, with two peaceful nights in a cosy mountain hut at Þönglabakki.',
      de: 'Durch das windgepeitschte Tal Flateyjardalur und die verlassene Halbinsel Fjörður, mit zwei stillen Nächten in der Berghütte Þönglabakki.',
    },
  },
  {
    id: 'autumn-northern-lights',
    name: { is: 'Autumn Colours and Northern Lights', en: 'Autumn Colours and Northern Lights', de: 'Herbstfarben & Nordlichter' },
    meta: { is: '7 dagar · 5 reiðdagar · september · 1.950€', en: '7 days · 5 riding days · September · €1,950', de: '7 Tage · 5 Reittage · September · 1.950 €' },
    departures: {
      is: 'Brottfarir 2026: 7.–13. september og 15.–21. september',
      en: 'Departures 2026: September 7–13 and September 15–21',
      de: 'Termine 2026: 7.–13. September und 15.–21. September',
    },
    image: 'photo-1563224347-7232cc1a5e85',
    blurb: {
      is: 'Gyllt haustfjöll á daginn og norðurljós yfir fjallaskálanum Gili á kvöldin. Riðið um Trölladal og fylgst með þegar þúsundir fjár koma af fjalli.',
      en: 'Golden mountains by day and northern lights over the mountain hut Gil by night, riding the valley of the trolls as thousands of sheep come down from their summer pastures.',
      de: 'Goldene Berge am Tag, Nordlichter über der Berghütte Gil am Abend, dazu der Ritt durch das Tal der Trolle und der herbstliche Schafabtrieb.',
    },
  },
  {
    id: 'back-to-roots',
    name: { is: 'Back to the Roots', en: 'Back to the Roots', de: 'Fjörður' },
    meta: { is: '7 dagar · 5 reiðdagar · ágúst · 2.200€', en: '7 days · 5 riding days · August · €2,200', de: '7 Tage · 5 Reittage · August · 2.200 €' },
    departures: {
      is: 'Brottför 2026: 21.–27. ágúst',
      en: 'Departure 2026: August 21–27',
      de: 'Termin 2026: 21.–27. August',
    },
    image: 'photo-1710179337706-f5e304f7740a',
    blurb: {
      is: 'Um Fjörður eftir sögufrægu leiðunum sem við riðum fyrst árið 1985, með trússhest með í för. Tvær nætur í fjallaskála.',
      en: 'Across the peninsula of Fjörður on the historic trails we first rode in 1985, with a packhorse carrying the supplies and two peaceful nights in a mountain hut.',
      de: 'Über die historischen Wege der Halbinsel Fjörður, die wir 1985 zum ersten Mal beritten haben, mit Packpferd für die Vorräte und zwei Nächten in der Berghütte.',
    },
  },
]

/* ── Seasons — the signature "Ljós Norðursins" switcher ─────────────────── */
export interface Season {
  id: 'sumar' | 'haust' | 'vetur'
  name: L3
  kicker: L3
  line: L3
  tour: L3 // the real tour that matches the season
  image: string
  glow: string
}

export const SEASONS: Season[] = [
  {
    id: 'sumar',
    name: { is: 'Sumar', en: 'Summer', de: 'Sommer' },
    kicker: { is: 'Miðnætursól', en: 'Midnight sun', de: 'Mitternachtssonne' },
    line: {
      is: 'Bjartar nætur og þeysireið í sól sem aldrei sest. Hálendið opnast og lengri ferðirnar hefjast.',
      en: 'Bright nights and long rides under a sun that never sets. The highlands open and the long tours begin.',
      de: 'Helle Nächte und lange Ritte unter einer Sonne, die nie untergeht. Das Hochland öffnet sich und die langen Touren beginnen.',
    },
    tour: { is: 'Ferð: Ring around the Midnightsun', en: 'Tour: Ring around the Midnightsun', de: 'Tour: Sommersonnenwende' },
    image: 'photo-1699818035127-75727321a851',
    glow: '#c9871f',
  },
  {
    id: 'haust',
    name: { is: 'Haust', en: 'Autumn', de: 'Herbst' },
    kicker: { is: 'Haustlitir og norðurljós', en: 'Autumn colours and aurora', de: 'Herbstfarben und Nordlichter' },
    line: {
      is: 'Gyllt fjöll á daginn, norðurljós á kvöldin. Tær og kyrr tími til að vera á hestbaki.',
      en: 'Golden mountains by day, northern lights by night. A clear, still time to be in the saddle.',
      de: 'Goldene Berge am Tag, Nordlichter am Abend. Eine klare, stille Zeit im Sattel.',
    },
    tour: { is: 'Ferð: Autumn Colours and Northern Lights', en: 'Tour: Autumn Colours and Northern Lights', de: 'Tour: Herbstfarben & Nordlichter' },
    image: 'photo-1580899905247-8aacef0d023f',
    glow: '#b4612a',
  },
  {
    id: 'vetur',
    name: { is: 'Vetur', en: 'Winter', de: 'Winter' },
    kicker: { is: 'Frostrósir', en: 'Frost roses', de: 'Frostrosen' },
    line: {
      is: 'Frostrósir á feldi og kyrrð í snjónum. Stuttar vetrarferðir um hvíta sveitina frá nóvember til apríl.',
      en: 'Frost on their coats and stillness in the snow. Short winter rides through the white countryside from November to April.',
      de: 'Frostrosen im Fell und Stille im Schnee. Kurze Winterritte durch die weiße Landschaft, von November bis April.',
    },
    tour: { is: 'Ferð: Frostrósir', en: 'Tour: Snowflakes & Frostroses', de: 'Tour: Schneeflocken & Frostrosen' },
    image: 'photo-1774018538486-49f5a51cd63f',
    glow: '#7ccdec',
  },
]

/* ── Sample guest reviews (prototype — disclaimed in footer) ────────────── */
export interface Review {
  quote: L3
  name: string
  origin: L3
}

export const REVIEWS: Review[] = [
  {
    quote: {
      is: 'Hápunktur ferðarinnar okkar um Ísland. Hestarnir ljúfir og fjölskyldan tók okkur eins og gömlum vinum.',
      en: 'The highlight of our whole trip to Iceland. Gentle horses and a family who welcomed us like old friends.',
      de: 'Der Höhepunkt unserer ganzen Islandreise. Sanfte Pferde und eine Familie, die uns wie alte Freunde empfangen hat.',
    },
    name: 'Marie L.',
    origin: { is: 'Frakkland', en: 'France', de: 'Frankreich' },
  },
  {
    quote: {
      is: 'Aldrei setið hest áður og fannst ég samt fullkomlega örugg. Útsýnið yfir fjörðinn var ógleymanlegt.',
      en: 'I had never ridden before and still felt completely safe. The views over the fjord were unforgettable.',
      de: 'Ich saß zum ersten Mal auf einem Pferd und fühlte mich völlig sicher. Der Blick über den Fjord war unvergesslich.',
    },
    name: 'Sarah K.',
    origin: { is: 'Kanada', en: 'Canada', de: 'Kanada' },
  },
  {
    quote: {
      is: 'Fórum í fimm daga ferð og hún fór fram úr öllum væntingum. Þekking þeirra á landinu er einstök.',
      en: 'We took a five-day tour and it exceeded every expectation. Their knowledge of the land is second to none.',
      de: 'Unsere fünftägige Tour hat alle Erwartungen übertroffen. Ihre Kenntnis des Landes ist einzigartig.',
    },
    name: 'Thomas B.',
    origin: { is: 'Þýskaland', en: 'Germany', de: 'Deutschland' },
  },
]

/* ── Farm shop — the real webshop items with published prices ───────────── */
export interface ShopItem {
  name: L3
  price: number
  from?: boolean // lamb skins are priced from 9.000 up
}

export const SHOP: ShopItem[] = [
  { name: { is: 'Buff með merki Pólar Hesta', en: 'Pólar Hestar buff', de: 'Buff mit Pólar-Hestar-Logo' }, price: 1500 },
  { name: { is: 'Handgerður jútupoki með tölti', en: 'Handcrafted jute bag', de: 'Handgefertigte Jutetasche' }, price: 4500 },
  { name: { is: 'Softshell-jakki', en: 'Softshell jacket', de: 'Softshell-Jacke' }, price: 10500 },
  { name: { is: 'Lambskinn af bænum', en: 'Lambskin from the farm', de: 'Lammfell vom Hof' }, price: 9000, from: true },
]

/* ── Gott að vita — the practical facts from their good-to-know pages ───── */
export interface GtkItem {
  title: L3
  body: L3
}

export interface GoodToKnowData {
  eyebrow: L3
  heading: L3
  body: L3
  items: GtkItem[]
}

export const GOOD_TO_KNOW: GoodToKnowData = {
  eyebrow: { is: 'Gott að vita', en: 'Good to know', de: 'Gut zu wissen' },
  heading: { is: 'Allt fyrir heimsóknina', en: 'Everything for your visit', de: 'Alles für Ihren Besuch' },
  body: {
    is: 'Það helsta sem gestir spyrja um, á einum stað.',
    en: 'The things guests ask about most, in one place.',
    de: 'Was Gäste am häufigsten fragen, auf einen Blick.',
  },
  items: [
    {
      title: { is: 'Persónuleg bókun', en: 'Personal booking', de: 'Persönliche Buchung' },
      body: {
        is: 'Bókanir fara fram beint hjá okkur, í tölvupósti eða síma. Fyrir bókanir með stuttum fyrirvara er best að hringja.',
        en: 'Bookings are made directly with us, by email or phone. For short-notice bookings, please phone rather than email.',
        de: 'Gebucht wird direkt bei uns, per E-Mail oder Telefon. Für kurzfristige Buchungen rufen Sie bitte an.',
      },
    },
    {
      title: { is: 'Greiðsla', en: 'Payment', de: 'Bezahlung' },
      body: {
        is: 'Engin greiðsla fer fram á netinu. Í lengri ferðum er 20% staðfestingargjald við bókun og eftirstöðvar greiðast tveimur vikum fyrir brottför.',
        en: 'No payment is taken online. Long tours require a 20% deposit on booking, with the rest due two weeks before departure.',
        de: 'Es wird nichts online bezahlt. Bei langen Touren bitten wir um 20 % Anzahlung, der Rest ist zwei Wochen vor Beginn fällig.',
      },
    },
    {
      title: { is: 'Börn', en: 'Children', de: 'Kinder' },
      body: {
        is: 'Börn 12 ára og yngri greiða 2.000 kr. minna en fullt verð í öllum stuttum ferðum. Lágmarksaldur er 6 ára, 8 ára í þriggja tíma ferðinni.',
        en: 'Children 12 and under pay 2,000 ISK less on every short tour. The minimum age is 6, and 8 for the three-hour tour.',
        de: 'Kinder bis 12 Jahre zahlen bei allen kurzen Ritten 2.000 ISK weniger. Das Mindestalter ist 6 Jahre, beim Drei-Stunden-Ritt 8 Jahre.',
      },
    },
    {
      title: { is: 'Búnaður', en: 'Equipment', de: 'Ausrüstung' },
      body: {
        is: 'Við leggjum til reiðhjálma, hanska, regnföt og buff. Komdu í traustum skóm, klæddu þig í lögum og taktu mittistösku frekar en bakpoka. Í skálaferðum þarf svefnpoka. Hámarksþyngd knapa er 95 kg.',
        en: 'We provide helmets, riding gloves, rain gear and buffs. Come in sturdy shoes, dress in layers and bring a waist bag rather than a backpack. Hut tours require a sleeping bag. The maximum rider weight is 95 kg.',
        de: 'Wir stellen Reithelme, Reithandschuhe, Regenkleidung und Buffs zur Verfügung. Kommen Sie in festen Schuhen, kleiden Sie sich in Schichten und nehmen Sie eine kleine Bauchtasche statt eines Rucksacks. Für Hüttentouren brauchen Sie einen Schlafsack. Das maximale Reitergewicht ist 95 kg.',
      },
    },
    {
      title: { is: 'Mæting og skutl', en: 'Arrival & pickup', de: 'Ankunft & Abholung' },
      body: {
        is: 'Mættu 15 til 20 mínútum fyrir brottför og gerðu ráð fyrir um klukkustund aukalega í undirbúning og kaffi eftir reiðtúrinn. Í lengri ferðum sækjum við gesti á flugvöllinn eða umferðarmiðstöðina á Akureyri, oftast milli kl. 16 og 18.',
        en: 'Please arrive 15 to 20 minutes before departure, and allow about an extra hour for preparation and coffee after the ride. For long tours we pick guests up at the airport or bus station in Akureyri, usually between 4 and 6 pm.',
        de: 'Bitte seien Sie 15 bis 20 Minuten vor Beginn auf dem Hof und planen Sie etwa eine Stunde extra für Vorbereitung und Kaffee nach dem Ritt ein. Bei langen Touren holen wir Sie am Flughafen oder Busbahnhof in Akureyri ab, meist zwischen 16 und 18 Uhr.',
      },
    },
    {
      title: { is: 'Afbókun', en: 'Cancellation', de: 'Stornierung' },
      body: {
        is: 'Í stuttum ferðum greiðist ferðin að fullu ef afbókað er með minna en 4 klst. fyrirvara. Í lengri ferðum er gjaldið 20% innan sex vikna, 50% innan þriggja vikna og fullt verð innan viku. Afbókanir berist í tölvupósti. Ferðatrygging er ekki innifalin og við mælum með henni.',
        en: 'Short-tour cancellations with less than four hours’ notice are charged in full. For long tours the fee is 20% within six weeks, 50% within three weeks and the full price within one week. Cancellations should be made by email. Travel insurance is not included and we recommend it.',
        de: 'Bei kurzen Ritten werden Stornierungen weniger als 4 Stunden vor Beginn voll berechnet. Bei langen Touren fallen innerhalb von sechs Wochen 20 % an, innerhalb von drei Wochen 50 % und innerhalb einer Woche der volle Preis. Stornierungen bitte per E-Mail. Eine Reiseversicherung ist nicht inbegriffen und wird empfohlen.',
      },
    },
  ],
}

/* ── Á bænum — farm life from their info pages, condensed ───────────────── */
export const FARM: GoodToKnowData = {
  eyebrow: { is: 'Á bænum', en: 'At the farm', de: 'Auf dem Hof' },
  heading: { is: 'Meira en reiðtúrar', en: 'More than riding', de: 'Mehr als Reiten' },
  body: {
    is: 'Grýtubakki er lifandi sveitabær. Gestir gista, spila mínígolf og kynnast dýrunum.',
    en: 'Grýtubakki is a living farm. Guests stay over, play minigolf and meet the animals.',
    de: 'Grýtubakki ist ein lebendiger Bauernhof. Gäste übernachten, spielen Minigolf und lernen die Tiere kennen.',
  },
  items: [
    {
      title: { is: 'Gisting á bænum', en: 'Staying at the farm', de: 'Übernachten auf dem Hof' },
      body: {
        is: 'Þrjú notaleg gestahús rúma allt að 26 gesti og máltíðir eru bornar fram í aðalhúsinu. Frá miðjum júní og út september er gistingin fyrir ferðagesti okkar, en utan þess tímabils er hægt að bóka gistingu með morgunverði.',
        en: 'Three cosy cottages sleep up to 26 guests, with meals served in the main building. From mid-June to the end of September the cottages are for our riding-tour guests; out of season, bed and breakfast stays are welcome.',
        de: 'Drei gemütliche Gästehäuser bieten Platz für bis zu 26 Gäste, die Mahlzeiten gibt es im Haupthaus. Von Mitte Juni bis Ende September sind die Häuser für unsere Reitgäste reserviert, in der Nebensaison ist Bed & Breakfast möglich.',
      },
    },
    {
      title: { is: 'Sumarhúsið Gilsbakki', en: 'The summer house Gilsbakki', de: 'Das Sommerhaus Gilsbakki' },
      body: {
        is: 'Gilsbakki er 60 m² timburhús fyrir allt að sex gesti, með arni, eldhúsi og rúmgóðri verönd þar sem sést til norðurljósa. Bókað símleiðis eða í tölvupósti.',
        en: 'Gilsbakki is a 60 m² wooden house for up to six guests, with a fireplace, kitchen and a spacious terrace made for northern-lights watching. Booked by phone or email.',
        de: 'Gilsbakki ist ein 60 m² großes Holzhaus für bis zu sechs Gäste, mit Kamin, Küche und einer großen Terrasse mit Nordlichtblick. Buchung per Telefon oder E-Mail.',
      },
    },
    {
      title: { is: 'Dýrin á bænum', en: 'The animals', de: 'Die Tiere auf dem Hof' },
      body: {
        is: 'Auk hrossanna 160 búa hér um 270 kindur, kettir eins og Kasper Valentínus, kanínurnar Peterson og Findus og hænurnar Berta og Hildegard. Á vorin fæðast lömbin og á haustin er réttað.',
        en: 'Besides the 160 horses, the farm is home to about 270 sheep, cats like Kasper Valentínus, the rabbits Peterson and Findus, and the hens Berta and Hildegard. Lambs arrive in spring and the sheep round-up is the highlight of autumn.',
        de: 'Neben den 160 Pferden leben hier rund 270 Schafe, Katzen wie Kasper Valentínus, die Kaninchen Peterson und Findus und die Hühner Berta und Hildegard. Im Frühjahr kommen die Lämmer, im Herbst ist der Schafabtrieb der Höhepunkt.',
      },
    },
    {
      title: { is: 'Mínígolf', en: 'Minigolf', de: 'Minigolf' },
      body: {
        is: 'Sex heimagerðar brautir sem allar tengjast Íslandi og umhverfinu. Verð 1.500 kr. á mann, börn yngri en 12 ára borga helming. Innifalið fyrir gesti í lengri ferðum.',
        en: 'Six self-made lanes, each tied to Iceland and the farm’s surroundings. 1,500 ISK per person; children under 12 pay half. Free for guests on our long tours.',
        de: 'Sechs selbstgebaute Bahnen, alle mit Bezug zu Island und der Umgebung. 1.500 ISK pro Person, Kinder unter 12 zahlen die Hälfte. Für Gäste der langen Touren inklusive.',
      },
    },
    {
      title: { is: 'Verndum íslenska hestinn', en: 'Protecting the Icelandic horse', de: 'Zum Schutz des Islandpferdes' },
      body: {
        is: 'Notaður reiðbúnaður má ekki koma til landsins. Reiðföt þarf að sótthreinsa fyrir komu, hanskar eiga að vera nýir og skór hreinir.',
        en: 'Used riding equipment may not be brought into Iceland. Riding clothes must be disinfected before arrival, gloves must be brand new and shoes clean.',
        de: 'Gebrauchte Reitausrüstung darf nicht nach Island eingeführt werden. Reitkleidung muss vor der Anreise desinfiziert werden, Handschuhe müssen neu und Schuhe sauber sein.',
      },
    },
    {
      title: { is: 'Sjálfbærni', en: 'Sustainability', de: 'Nachhaltigkeit' },
      body: {
        is: 'Við hlífum landinu með því að hvíla reiðleiðir, flokkum allan úrgang, verslum íslenskt og sameinum ferðir. Leiðsögufólkið okkar lærir að lágmarka áhrif á náttúruna.',
        en: 'We spare the land by resting trails, separate all waste, buy Icelandic groceries and share transfers. Our guides learn to minimise their impact on nature.',
        de: 'Wir schonen die Wege, trennen unseren Abfall, kaufen isländische Produkte und bündeln Transfers. Unsere Guides lernen, ihren Einfluss auf die Natur gering zu halten.',
      },
    },
  ],
}

/* ── Trilingual interface copy ──────────────────────────────────────────── */
export const COPY = {
  is: {
    nav: { tours: 'Ferðir', seasons: 'Árstíðir', info: 'Gott að vita', visit: 'Heimsókn', cta: 'Bóka reiðtúr' },

    heroEyebrow: 'Hestaferðir · Grenivík · Norðurland',
    heroH1a: 'Þar sem hestar',
    heroH1b: 'og álfar hittast',
    heroLede:
      'Í fjörutíu ár höfum við deilt norðlensku birtunni með knöpum á öllum getustigum, á bænum okkar Grýtubakka við lengsta fjörð landsins.',
    heroBook: 'Bóka reiðtúr',
    heroTours: 'Sjá ferðir',
    statYears: 'ára saga',
    statHorses: 'hross',

    storyEyebrow: 'Grýtubakki II · Eyjafjörður',
    storyH2: 'Fjörutíu ár við lengsta fjörðinn',
    storyP1:
      'Pólar Hestar hafa boðið upp á hestaferðir í 40 ár. Það byrjaði allt með rúmlega 15 hestum en í dag erum við með um 160 hross og bjóðum upp á ýmiss konar reiðtúra.',
    storyP2:
      'Landslagið í kringum bæinn okkar Grýtubakka býður upp á ógleymanlega reynslu, bæði fyrir reyndustu knapa og algjöra byrjendur. Fjölskyldan tekur á móti hverjum gesti.',
    storyQuote: '„Þar sem hestar og álfar hittast.“',

    procH2: 'Hundrað og sextíu, hvert með sinn karakter',
    procBody:
      'Íslenski hesturinn er fimur, viljugur og einstaklega traustur, með mjúka töltganginn sem þú finnur hvergi annars staðar. Hjá okkur færðu hest sem hæfir þér.',

    toursZoneEyebrow: 'Ferðirnar okkar',
    toursZoneIntro:
      'Tvær leiðir til að kynnast íslenska hestinum: stuttir reiðtúrar allt árið eða margra daga ævintýri um óbyggðir Norðurlands.',
    toursEyebrow: 'Stuttar ferðir',
    toursBadge: 'Allt árið',
    toursH2: 'Reiðtúrar fyrir alla, allt árið',
    toursBody:
      'Á sumrin bjóðum við upp á eins, tveggja og þriggja tíma ferðir en á veturna styttri ferðir í snjónum. Kaffi, te, kakó og heimabakað bíður þegar heim er komið.',
    fromLabel: 'Verð frá',
    perPerson: 'á mann',
    bookBtn: 'Bóka',
    childNote: 'Börn 12 ára og yngri greiða 2.000 kr. minna',
    weightNote: 'Hámarksþyngd knapa er 95 kg',

    bookEyebrow: 'Bókun',
    bookH2: 'Sendu bókunarbeiðni á nokkrum sekúndum',
    bookBody:
      'Veldu ferð, dagsetningu og fjölda knapa og sendu okkur beiðni. Við staðfestum persónulega innan sólarhrings.',
    bookPanelLine: 'Sætin eru fá og dagarnir vinsælir. Tryggðu þér sæti.',
    bookNoPay: 'Engin greiðsla núna. Við staðfestum persónulega innan sólarhrings.',
    stepTour: '1 · Veldu ferð',
    stepDate: '2 · Veldu dag',
    timeLabel: 'Brottför',
    stepRiders: '3 · Fjöldi knapa',
    stepContact: '4 · Þínar upplýsingar',
    dateLabel: 'Dagsetning',
    adults: 'Fullorðnir',
    children: 'Börn (12 og yngri)',
    nameLabel: 'Nafn',
    emailLabel: 'Netfang',
    phoneLabel: 'Sími (valfrjálst)',
    noteLabel: 'Skilaboð (valfrjálst)',
    totalLabel: 'Samtals',
    confirmBtn: 'Senda bókunarbeiðni',
    sendingBtn: 'Sendi…',
    errorText: 'Því miður tókst ekki að senda beiðnina. Reyndu aftur eða hringdu í',
    confirmedTitle: 'Takk fyrir!',
    confirmedBody:
      'Bókunarbeiðnin er komin til okkar. Við staðfestum símleiðis eða í tölvupósti innan sólarhrings. Hlökkum til að sjá þig á Grýtubakka.',
    bookAgain: 'Bóka aðra ferð',
    childDiscountApplied: 'Barnaafsláttur innifalinn',

    seasonsEyebrow: 'Ljós Norðursins',
    seasonsH2: 'Hver árstíð, sín birta',
    seasonsBody: 'Norðurland breytist með birtunni, og ferðin með. Veldu árstíð og sjáðu hvað bíður.',

    longEyebrow: 'Lengri reiðferðir',
    longBadge: 'Júní–sept',
    longQuestions: 'Spurningar? Skrifaðu á',
    longBody:
      'Frá júní og fram í september leggjum við í lengri ferðir um óbyggðir Norðurlands. Gisting, fullt fæði og skutl frá Akureyri eru innifalin og 20% staðfestingargjald tryggir sætið.',
    enquireBtn: 'Fá tilboð',

    galleryH2: 'Svipmyndir frá bænum',
    galleryBody: 'Úr myndasafni Pólar Hesta: hversdagurinn á Grýtubakka, ferðirnar og dýrin.',

    trustEyebrow: 'Umsagnir',
    trustH2: '4,9 stjörnur og Travelers’ Choice',
    trustBody: '263 umsagnir á Tripadvisor og Travelers’ Choice-verðlaunin.',
    reviewsWord: 'umsagnir',
    familyTitle: 'Fjölskyldan á Grýtubakka',
    familyBody:
      'Stefán, Juliane og Símon reka Pólar Hesta af alúð og þekkja hverja þúfu í kring. Hjá okkur ertu gestur, ekki númer.',

    shopH2: 'Lítil minning með heim',
    shopBody: 'Handunnið og heimafengið frá bænum. Sendu okkur línu og við tökum það frá fyrir þig, póstsending í boði.',
    orderBtn: 'Panta í tölvupósti',

    visitH2: 'Finndu okkur við fjörðinn',
    addressLabel: 'Heimilisfang',
    gettingThereLabel: 'Hvernig á að rata',
    gettingThere: 'Þjóðvegur 83 í átt að Grenivík, um 35 km frá Akureyri. Ekki fara í gegnum Vaðlaheiðargöng.',
    seasonLabel: 'Opnunartími',
    seasonInfo: 'Stuttar ferðir allt árið, alla daga. Lengri ferðir á sumrin. Bókað með fyrirvara.',
    mapsBtn: 'Opna í kortum',
    callBtn: 'Hringja',
    emailBtn: 'Senda tölvupóst',

    ctaH2: 'Komdu á hestbak í norðri',
    ctaBody: 'Bókaðu reiðtúr í dag eða heyrðu í okkur. Við svörum fljótt.',
    stickyBook: 'Bóka reiðtúr',
  },
  en: {
    nav: { tours: 'Tours', seasons: 'Seasons', info: 'Good to know', visit: 'Visit', cta: 'Book a ride' },

    heroEyebrow: 'Horse riding · Grenivík · North Iceland',
    heroH1a: 'Where horses',
    heroH1b: 'meet the elves',
    heroLede:
      'For forty years we have shared the light of the north with riders of every level, at our farm Grýtubakki by Iceland’s longest fjord.',
    heroBook: 'Book a ride',
    heroTours: 'See the tours',
    statYears: 'years',
    statHorses: 'horses',

    storyEyebrow: 'Grýtubakki II · Eyjafjörður',
    storyH2: 'Forty years by the longest fjord',
    storyP1:
      'Pólar Hestar has offered riding tours since 1985. It all began with a small herd of about 15 horses; today around 160 horses live on the farm and we offer all kinds of rides.',
    storyP2:
      'The landscape around our farm Grýtubakki makes for an unforgettable experience, for the most seasoned riders and complete beginners alike. The family welcomes every guest.',
    storyQuote: '“Where horses meet the elves.”',

    procH2: 'A hundred and sixty, each with its own character',
    procBody:
      'The Icelandic horse is sure-footed, willing and remarkably steady, with the smooth tölt gait you find nowhere else. We match you with the horse that suits you.',

    toursZoneEyebrow: 'Our rides',
    toursZoneIntro:
      'Two ways to meet the Icelandic horse: short rides all year, or multi-day journeys across the wilds of North Iceland.',
    toursEyebrow: 'Short tours',
    toursBadge: 'All year',
    toursH2: 'Rides for everyone, all year',
    toursBody:
      'In summer we offer one-, two- and three-hour rides; in winter we saddle up for shorter rides through the snow. Coffee, tea, cocoa and home baking wait for you back at the farm.',
    fromLabel: 'From',
    perPerson: 'per person',
    bookBtn: 'Book',
    childNote: 'Children 12 and under pay 2,000 ISK less',
    weightNote: 'Maximum rider weight is 95 kg',

    bookEyebrow: 'Booking',
    bookH2: 'Send a booking request in seconds',
    bookBody: 'Choose a tour, a date and your group, and send us your request. We confirm personally within a day.',
    bookPanelLine: 'Places are few and the good days fill up. Secure yours.',
    bookNoPay: 'No payment now. We confirm personally within a day.',
    stepTour: '1 · Choose a tour',
    stepDate: '2 · Choose a date',
    timeLabel: 'Departure',
    stepRiders: '3 · Riders',
    stepContact: '4 · Your details',
    dateLabel: 'Date',
    adults: 'Adults',
    children: 'Children (12 and under)',
    nameLabel: 'Name',
    emailLabel: 'Email',
    phoneLabel: 'Phone (optional)',
    noteLabel: 'Message (optional)',
    totalLabel: 'Total',
    confirmBtn: 'Send booking request',
    sendingBtn: 'Sending…',
    errorText: 'Sorry, the request could not be sent. Please try again or call',
    confirmedTitle: 'Thank you!',
    confirmedBody:
      'Your request is on its way to us. We will confirm by phone or email within a day. We look forward to seeing you at Grýtubakki.',
    bookAgain: 'Book another ride',
    childDiscountApplied: 'Child discount included',

    seasonsEyebrow: 'Light of the North',
    seasonsH2: 'Every season, its own light',
    seasonsBody: 'North Iceland changes with the light, and so does the ride. Pick a season and see what awaits.',

    longEyebrow: 'Long rides',
    longBadge: 'June–Sept',
    longQuestions: 'Questions? Write to',
    longBody:
      'From June to September we set out on longer tours across the wilds of North Iceland. Lodging, full board and the Akureyri transfer are included, and a 20% deposit secures your place.',
    enquireBtn: 'Request a quote',

    galleryH2: 'Snapshots from the farm',
    galleryBody: 'From the Pólar Hestar picture gallery: everyday life at Grýtubakki, the tours and the animals.',

    trustEyebrow: 'Reviews',
    trustH2: '4.9 stars and Travelers’ Choice',
    trustBody: '263 reviews on Tripadvisor and the Travelers’ Choice award.',
    reviewsWord: 'reviews',
    familyTitle: 'The family at Grýtubakki',
    familyBody:
      'Stefán, Juliane and Símon run Pólar Hestar with care and know every hill around here. With us you are a guest, not a number.',

    shopH2: 'A small keepsake to take home',
    shopBody: 'Handmade and homegrown from the farm. Drop us a line and we will set it aside, shipping available.',
    orderBtn: 'Order by email',

    visitH2: 'Find us by the fjord',
    addressLabel: 'Address',
    gettingThereLabel: 'Getting there',
    gettingThere: 'Road 83 towards Grenivík, about 35 km from Akureyri. Do not take the Vaðlaheiðargöng tunnel.',
    seasonLabel: 'Opening',
    seasonInfo: 'Short tours all year, every day. Long tours in summer. Advance booking required.',
    mapsBtn: 'Open in maps',
    callBtn: 'Call',
    emailBtn: 'Send an email',

    ctaH2: 'Come ride in the north',
    ctaBody: 'Book a ride today or get in touch. We answer quickly.',
    stickyBook: 'Book a ride',
  },
  de: {
    nav: { tours: 'Touren', seasons: 'Jahreszeiten', info: 'Gut zu wissen', visit: 'Anfahrt', cta: 'Ritt buchen' },

    heroEyebrow: 'Reittouren · Grenivík · Nordisland',
    heroH1a: 'Wo sich Pferde',
    heroH1b: 'und Elfen treffen',
    heroLede:
      'Seit vierzig Jahren teilen wir das Licht des Nordens mit Reitern aller Erfahrungsstufen, auf unserem Hof Grýtubakki am längsten Fjord Islands.',
    heroBook: 'Ritt buchen',
    heroTours: 'Touren ansehen',
    statYears: 'Jahre',
    statHorses: 'Pferde',

    storyEyebrow: 'Grýtubakki II · Eyjafjörður',
    storyH2: 'Vierzig Jahre am längsten Fjord',
    storyP1:
      'Pólar Hestar bietet seit 1985 Reittouren im Norden Islands an. Angefangen hat alles mit einer kleinen Herde von rund fünfzehn Pferden, heute leben etwa 160 Pferde auf dem Hof.',
    storyP2:
      'Die Landschaft rund um unseren Hof Grýtubakki macht jeden Ritt unvergesslich, für erfahrene Reiter wie für völlige Anfänger. Die Familie heißt jeden Gast willkommen.',
    storyQuote: '„Wo sich Pferde und Elfen treffen.“',

    procH2: 'Hundertsechzig Pferde, jedes mit eigenem Charakter',
    procBody:
      'Das Islandpferd ist trittsicher, willig und bemerkenswert gelassen, mit dem weichen Tölt, den es sonst nirgends gibt. Bei uns bekommen Sie das Pferd, das zu Ihnen passt.',

    toursZoneEyebrow: 'Unsere Touren',
    toursZoneIntro:
      'Zwei Wege, das Islandpferd kennenzulernen: kurze Ritte das ganze Jahr oder mehrtägige Touren durch Nordislands Wildnis.',
    toursEyebrow: 'Kurze Touren',
    toursBadge: 'Ganzjährig',
    toursH2: 'Ausritte für alle, das ganze Jahr',
    toursBody:
      'Im Sommer bieten wir Ein-, Zwei- und Drei-Stunden-Ritte an, im Winter kürzere Ritte durch den Schnee. Kaffee, Tee, Kakao und Selbstgebackenes warten nach dem Ritt.',
    fromLabel: 'Ab',
    perPerson: 'pro Person',
    bookBtn: 'Buchen',
    childNote: 'Kinder bis 12 Jahre zahlen 2.000 ISK weniger',
    weightNote: 'Maximales Reitergewicht: 95 kg',

    bookEyebrow: 'Buchung',
    bookH2: 'Buchungsanfrage in Sekunden',
    bookBody:
      'Wählen Sie Tour, Datum und Gruppe und senden Sie uns Ihre Anfrage. Wir bestätigen persönlich innerhalb eines Tages.',
    bookPanelLine: 'Die Plätze sind begrenzt und beliebte Termine schnell ausgebucht. Sichern Sie sich Ihren.',
    bookNoPay: 'Sie zahlen jetzt noch nichts. Wir bestätigen persönlich innerhalb eines Tages.',
    stepTour: '1 · Tour wählen',
    stepDate: '2 · Datum wählen',
    timeLabel: 'Startzeit',
    stepRiders: '3 · Reiter',
    stepContact: '4 · Ihre Angaben',
    dateLabel: 'Datum',
    adults: 'Erwachsene',
    children: 'Kinder (bis 12)',
    nameLabel: 'Name',
    emailLabel: 'E-Mail',
    phoneLabel: 'Telefon (optional)',
    noteLabel: 'Nachricht (optional)',
    totalLabel: 'Gesamt',
    confirmBtn: 'Buchung anfragen',
    sendingBtn: 'Wird gesendet…',
    errorText: 'Die Anfrage konnte leider nicht gesendet werden. Versuchen Sie es erneut oder rufen Sie an:',
    confirmedTitle: 'Vielen Dank!',
    confirmedBody:
      'Ihre Anfrage ist bei uns eingegangen. Wir bestätigen innerhalb eines Tages telefonisch oder per E-Mail. Wir freuen uns auf Ihren Besuch auf Grýtubakki!',
    bookAgain: 'Weitere Tour buchen',
    childDiscountApplied: 'Kinderermäßigung enthalten',

    seasonsEyebrow: 'Licht des Nordens',
    seasonsH2: 'Jede Jahreszeit hat ihr Licht',
    seasonsBody:
      'Nordisland verändert sich mit dem Licht, und der Ritt mit ihm. Wählen Sie eine Jahreszeit und sehen Sie, was Sie erwartet.',

    longEyebrow: 'Lange Reittouren',
    longBadge: 'Juni–Sept.',
    longQuestions: 'Fragen? Schreiben Sie an',
    longBody:
      'Von Juni bis September brechen wir zu längeren Touren durch die unberührte Natur Nordislands auf. Preise und Termine sind veröffentlicht, eine Anzahlung von 20 % sichert den Platz.',
    enquireBtn: 'Angebot anfragen',

    galleryH2: 'Bilder vom Hof',
    galleryBody: 'Aus der Bildergalerie von Pólar Hestar: der Alltag auf Grýtubakki, die Touren und die Tiere.',

    trustEyebrow: 'Bewertungen',
    trustH2: '4,9 Sterne und Travelers’ Choice',
    trustBody: '263 Bewertungen auf Tripadvisor und die Travelers’-Choice-Auszeichnung.',
    reviewsWord: 'Bewertungen',
    familyTitle: 'Die Familie auf Grýtubakki',
    familyBody:
      'Stefán, Juliane und Símon führen Pólar Hestar mit Herz und kennen hier jeden Hügel. Bei uns sind Sie Gast, keine Nummer.',

    shopH2: 'Eine kleine Erinnerung für zu Hause',
    shopBody:
      'Handgemachtes und Hofeigenes. Schreiben Sie uns kurz und wir legen es für Sie zurück, Versand möglich.',
    orderBtn: 'Per E-Mail bestellen',

    visitH2: 'Sie finden uns am Fjord',
    addressLabel: 'Adresse',
    gettingThereLabel: 'Anfahrt',
    gettingThere: 'Straße 83 Richtung Grenivík, etwa 35 km von Akureyri. Fahren Sie nicht durch den Tunnel Vaðlaheiðargöng.',
    seasonLabel: 'Öffnungszeiten',
    seasonInfo: 'Kurze Touren ganzjährig, täglich. Lange Touren im Sommer. Buchung nach Vereinbarung.',
    mapsBtn: 'In Google Maps öffnen',
    callBtn: 'Anrufen',
    emailBtn: 'E-Mail senden',

    ctaH2: 'Steigen Sie im Norden in den Sattel',
    ctaBody: 'Buchen Sie noch heute einen Ritt oder melden Sie sich bei uns. Wir antworten schnell.',
    stickyBook: 'Ritt buchen',
  },
} satisfies Record<Lang, unknown>
