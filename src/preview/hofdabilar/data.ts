/* ── Höfðabílar ehf · „Á staðnum" ─────────────────────────────────────────────
   The Bílás design system, transplanted onto Höfðabílar. Bílás did not take
   their site; the design was strong, so it carries over to the next dealer
   rather than being rebuilt from scratch. This file therefore exports the
   SAME contract as src/preview/bilas/data.ts (Car, CARS, carImg, HERO_SLIDES,
   fmtPrice, LOGO, PHOTO, META, CONTACT, STAFF, HOURS, FEES, JSON_LD) so the
   page transplants with only the copy changing.

   VERIFIED CONTENT ONLY, harvested from hofdabilar.is + bilasolur.is
   (söluaðili id 55) on 2026-07-31.

   Höfðabílar ehf., kt. 630609-2160, Fosshálsi 27 (Dragháls megin),
   110 Reykjavík. Sími 577 4747. THERE IS NO COMPANY-WIDE EMAIL: their site
   publishes only the three staff addresses, and hofdabilar@hofdabilar.is does
   NOT exist (checked every page; the domain's MX is Microsoft 365 but that
   mailbox is unverified). All mail goes to Tryggvi, the löggilti bifreiðasali.
   „Stofnað 2002" is
   taken from the company's OWN logo mark, which arches that text around a
   chequered flag; it is their claim about themselves, not a registry fact
   (the ehf. kennitala dates from 2009). Three named staff, opening hours,
   the sölulaun schedule and the fee list all come from their own Um okkur
   page.

   CARS are the ACTUAL live stock (26 vehicles) with the dealer's own
   photographs, real prices, registration dates, mileage and the badge text
   they wrote themselves. The photographs carry bilasolur.is's baked-in
   watermark because that is how the platform serves them.

   img2 (the card's hover angle) exists for only 14 of the 26 cars. The
   remaining second photos came back as an identical blank placeholder from
   the CarImage endpoint (stddev 9.9 vs ~27 for a real photo), so those cars
   fall back to img rather than shipping a guessed pairing.              ── */

export type Car = {
  make: string
  model: string
  reg: string
  priceNum: number
  tilbod: boolean
  anVsk: boolean
  km: string | null
  fuel: string
  gear: string | null
  href: string
  img: string
  img2: string
  alt: string
  /** Vehicle class, using bilasolur.is's OWN taxonomy (the "Flokkar" dropdown
   *  on hofdabilar.is: Fólksbíll · Skutbíll · Sportjeppi · Jeppi · Sendibíll ·
   *  Fjórhjól). The platform does not expose the per-car value in the listing
   *  markup, so each one is classified here from what the vehicle actually is.
   *  Uncontroversial for every car in this stock, and it is the filter buyers
   *  reach for first. */
  body: BodyType
}

export type BodyType = 'Fólksbíll' | 'Skutbíll' | 'Sportjeppi' | 'Jeppi' | 'Sendibíll' | 'Fjórhjól'
export const BODIES: BodyType[] = ['Fólksbíll', 'Skutbíll', 'Sportjeppi', 'Jeppi', 'Sendibíll', 'Fjórhjól']

const A = (f: string) => `${import.meta.env.BASE_URL}preview/hofdabilar/${f}`
const CD = (cid: number) => `https://hofdabilar.is/CarDetails.aspx?bid=55&cid=${cid}`

export const CARS: Car[] = [
  { make: 'LAND ROVER', model: 'RANGE ROVER HSE P460 PHEV', reg: '4/2025', priceNum: 24800000, tilbod: true, anVsk: false, km: '15 þ.km', fuel: 'Bensín / Rafmagn', gear: 'Sjálfskipting', href: CD(118053), img: A('rangerover.webp'), img2: A('rangerover.webp'), alt: 'Silfurgrár Land Rover Range Rover HSE P460 PHEV fyrir framan sýningarsal Höfðabíla', body: 'Jeppi' },
  { make: 'TOYOTA', model: 'LAND CRUISER LUXURY PANORAMA 37" DEKK', reg: '12/2024', priceNum: 21900000, tilbod: false, anVsk: false, km: '25 þ.km', fuel: 'Dísel', gear: 'Sjálfskipting', href: CD(359065), img: A('landcruiser.webp'), img2: A('landcruiser-b.webp'), alt: 'Hvítur Toyota Land Cruiser á 37 tommu dekkjum fyrir utan Höfðabíla', body: 'Jeppi' },
  { make: 'LAND ROVER', model: 'DEFENDER P400E HSE X-DYNAMIC PHEV', reg: '2026', priceNum: 17990000, tilbod: false, anVsk: false, km: null, fuel: 'Bensín / Rafmagn', gear: 'Sjálfskipting', href: CD(103656), img: A('defender.webp'), img2: A('defender-b.webp'), alt: 'Nýr grár Land Rover Defender P400e fyrir framan sýningarsal Höfðabíla', body: 'Jeppi' },
  { make: 'BMW', model: 'I5 M60 XDRIVE M-SPORT', reg: '12/2023', priceNum: 12900000, tilbod: false, anVsk: false, km: '47 þ.km', fuel: 'Rafmagn', gear: 'Sjálfskipting', href: CD(122306), img: A('i5.webp'), img2: A('i5-b.webp'), alt: 'Hvítur BMW i5 M60 xDrive fyrir utan Höfðabíla', body: 'Fólksbíll' },
  { make: 'MERCEDES-BENZ', model: 'EQE 500 SUV 4MATIC', reg: '12/2023', priceNum: 11790000, tilbod: false, anVsk: false, km: '26 þ.km', fuel: 'Rafmagn', gear: 'Sjálfskipting', href: CD(261431), img: A('eqe.webp'), img2: A('eqe-b.webp'), alt: 'Hvítur Mercedes-Benz EQE 500 SUV fyrir framan Höfðabíla', body: 'Sportjeppi' },
  { make: 'TESLA', model: 'MODEL X PLAID 6 SÆTA 1020 HÖ', reg: '8/2023', priceNum: 10990000, tilbod: true, anVsk: false, km: '49 þ.km', fuel: 'Rafmagn', gear: 'Sjálfskipting', href: CD(409370), img: A('modelx.webp'), img2: A('modelx.webp'), alt: 'Hvítur Tesla Model X Plaid með opnar vænghurðir fyrir utan Höfðabíla', body: 'Jeppi' },
  { make: 'PORSCHE', model: 'TAYCAN 4 CROSS TURISMO', reg: '8/2021', priceNum: 10490000, tilbod: false, anVsk: false, km: '42 þ.km', fuel: 'Rafmagn', gear: 'Sjálfskipting', href: CD(253257), img: A('taycan.webp'), img2: A('taycan-b.webp'), alt: 'Hvítur Porsche Taycan 4 Cross Turismo fyrir utan sýningarsal Höfðabíla', body: 'Skutbíll' },
  { make: 'TESLA', model: 'MODEL 3 PERFORMANCE', reg: '9/2024', priceNum: 7390000, tilbod: true, anVsk: false, km: '30 þ.km', fuel: 'Rafmagn', gear: 'Sjálfskipting', href: CD(189991), img: A('model3.webp'), img2: A('model3-b.webp'), alt: 'Grár Tesla Model 3 Performance fyrir framan Höfðabíla', body: 'Fólksbíll' },
  { make: 'MERCEDES-BENZ', model: 'EQC 400 4MATIC EDITION 1886', reg: '9/2021', priceNum: 5900000, tilbod: false, anVsk: false, km: '41 þ.km', fuel: 'Rafmagn', gear: 'Sjálfskipting', href: CD(304510), img: A('eqc1886.webp'), img2: A('eqc1886-b.webp'), alt: 'Grár Mercedes-Benz EQC 400 Edition 1886 á plani Höfðabíla', body: 'Sportjeppi' },
  { make: 'JAGUAR', model: 'F-PACE AWD', reg: '11/2019', priceNum: 5790000, tilbod: false, anVsk: false, km: '89 þ.km', fuel: 'Dísel', gear: 'Sjálfskipting', href: CD(379819), img: A('fpace.webp'), img2: A('fpace.webp'), alt: 'Svartur Jaguar F-Pace AWD fyrir utan Höfðabíla', body: 'Sportjeppi' },
  { make: 'MERCEDES-BENZ', model: 'EQC 400 4MATIC', reg: '1/2021', priceNum: 5790000, tilbod: false, anVsk: false, km: '65 þ.km', fuel: 'Rafmagn', gear: 'Sjálfskipting', href: CD(822542), img: A('eqc400.webp'), img2: A('eqc400-b.webp'), alt: 'Hvítur Mercedes-Benz EQC 400 4Matic á plani Höfðabíla', body: 'Sportjeppi' },
  { make: 'KIA', model: 'NIRO EV FINAL EDITION 64 KWH', reg: '4/2026', priceNum: 4980000, tilbod: true, anVsk: false, km: null, fuel: 'Rafmagn', gear: 'Sjálfskipting', href: CD(252991), img: A('niro.webp'), img2: A('niro-b.webp'), alt: 'Hvítur Kia Niro EV fyrir framan sýningarsal Höfðabíla', body: 'Sportjeppi' },
  { make: 'LAND ROVER', model: 'DISCOVERY HSE', reg: '6/2018', priceNum: 4950000, tilbod: false, anVsk: false, km: '140 þ.km', fuel: 'Dísel', gear: 'Sjálfskipting', href: CD(329681), img: A('discovery.webp'), img2: A('discovery-b.webp'), alt: 'Svartur Land Rover Discovery HSE fyrir utan Höfðabíla', body: 'Jeppi' },
  { make: 'MG', model: 'MG4 ELECTRIC 77KW LUXURY 520 KM', reg: '4/2026', priceNum: 4480000, tilbod: true, anVsk: false, km: null, fuel: 'Rafmagn', gear: 'Sjálfskipting', href: CD(234276), img: A('mg4.webp'), img2: A('mg4.webp'), alt: 'Svartur MG4 Electric fyrir framan sýningarsal Höfðabíla', body: 'Fólksbíll' },
  { make: 'MAZDA', model: 'CX-30', reg: '12/2022', priceNum: 3990000, tilbod: true, anVsk: false, km: '38 þ.km', fuel: 'Bensín', gear: 'Sjálfskipting', href: CD(374630), img: A('cx30.webp'), img2: A('cx30.webp'), alt: 'Rauður Mazda CX-30 fyrir utan sýningarsal Höfðabíla', body: 'Sportjeppi' },
  { make: 'CAN-AM', model: 'OUTLANDER MAX XT-P', reg: '3/2022', priceNum: 3950000, tilbod: false, anVsk: false, km: '3.500 km', fuel: 'Bensín', gear: 'Sjálfskipting', href: CD(419602), img: A('canam.webp'), img2: A('canam-b.webp'), alt: 'Svart og gult Can-Am Outlander Max XT-P fjórhjól á plani Höfðabíla', body: 'Fjórhjól' },
  { make: 'LEXUS', model: 'NX300H', reg: '2/2016', priceNum: 3490000, tilbod: true, anVsk: false, km: '120 þ.km', fuel: 'Bensín / Rafmagn', gear: 'Sjálfskipting', href: CD(262092), img: A('nx300h.webp'), img2: A('nx300h.webp'), alt: 'Silfurgrár Lexus NX300h fyrir framan Höfðabíla', body: 'Sportjeppi' },
  { make: 'RENAULT', model: 'TRAFIC LANGUR', reg: '3/2021', priceNum: 2790000, tilbod: true, anVsk: true, km: '147 þ.km', fuel: 'Dísel', gear: 'Beinskipting', href: CD(816355), img: A('trafic.webp'), img2: A('trafic-b.webp'), alt: 'Svartur Renault Trafic sendibíll fyrir utan Höfðabíla', body: 'Sendibíll' },
  { make: 'LAND ROVER', model: 'RANGE ROVER EVOQUE SE', reg: '7/2016', priceNum: 2650000, tilbod: true, anVsk: false, km: '140 þ.km', fuel: 'Dísel', gear: 'Sjálfskipting', href: CD(224005), img: A('evoque.webp'), img2: A('evoque-b.webp'), alt: 'Svartur Range Rover Evoque SE á plani Höfðabíla', body: 'Sportjeppi' },
  { make: 'HONDA', model: 'HR-V SJÁLFSKIPTUR', reg: '11/2016', priceNum: 1890000, tilbod: false, anVsk: false, km: '107 þ.km', fuel: 'Bensín', gear: 'Sjálfskipting', href: CD(223291), img: A('hrv.webp'), img2: A('hrv.webp'), alt: 'Hvítur Honda HR-V fyrir framan sýningarsal Höfðabíla', body: 'Sportjeppi' },
  { make: 'MITSUBISHI', model: 'OUTLANDER', reg: '2/2017', priceNum: 1590000, tilbod: true, anVsk: false, km: '215 þ.km', fuel: 'Dísel', gear: 'Beinskipting', href: CD(127264), img: A('outlander.webp'), img2: A('outlander.webp'), alt: 'Silfurgrár Mitsubishi Outlander á plani Höfðabíla', body: 'Sportjeppi' },
  { make: 'SKODA', model: 'FABIA COMBI SJÁLFSKIPTUR', reg: '6/2016', priceNum: 1490000, tilbod: true, anVsk: false, km: '112 þ.km', fuel: 'Bensín', gear: 'Sjálfskipting', href: CD(338476), img: A('fabia.webp'), img2: A('fabia.webp'), alt: 'Blár Skoda Fabia Combi fyrir utan Höfðabíla', body: 'Skutbíll' },
  { make: 'SUZUKI', model: 'GRAND VITARA V6', reg: '4/2009', priceNum: 1490000, tilbod: true, anVsk: false, km: '100 þ.km', fuel: 'Bensín', gear: 'Sjálfskipting', href: CD(398210), img: A('vitara.webp'), img2: A('vitara.webp'), alt: 'Rauðbrúnn Suzuki Grand Vitara V6 fyrir framan Höfðabíla', body: 'Sportjeppi' },
  { make: 'FORD', model: 'FIESTA', reg: '3/2017', priceNum: 990000, tilbod: true, anVsk: false, km: '70 þ.km', fuel: 'Bensín', gear: 'Beinskipting', href: CD(298477), img: A('fiesta.webp'), img2: A('fiesta.webp'), alt: 'Rauður Ford Fiesta á plani Höfðabíla', body: 'Fólksbíll' },
  { make: 'PEUGEOT', model: '3008', reg: '3/2015', priceNum: 790000, tilbod: false, anVsk: false, km: '188 þ.km', fuel: 'Dísel', gear: 'Sjálfskipting', href: CD(340438), img: A('p3008.webp'), img2: A('p3008.webp'), alt: 'Grár Peugeot 3008 fyrir utan sýningarsal Höfðabíla', body: 'Sportjeppi' },
  { make: 'CADILLAC', model: 'DEVILLE', reg: '2/1999', priceNum: 590000, tilbod: true, anVsk: false, km: '130 þ.km', fuel: 'Bensín', gear: 'Sjálfskipting', href: CD(295309), img: A('deville.webp'), img2: A('deville-b.webp'), alt: 'Svartur Cadillac DeVille árgerð 1999 fyrir framan sýningarsal Höfðabíla', body: 'Fólksbíll' },
]

/** Local webp assets, so the width param the layout passes is a no-op here. */
export const carImg = (src: string, _w: number) => src

/* Hero rotation: a deliberate spread of body styles, eras and colours from
   the real stock (classic sedan, sports EV, new SUV, wing-door EV, 37" jeep)
   so the carousel reads as "the lot", not five of the same silhouette.
   Pulled live from CARS so specs never drift out of sync with the inventory. */
const HERO_PICKS: [string, string][] = [
  ['PORSCHE', 'TAYCAN 4 CROSS TURISMO'],
  ['CADILLAC', 'DEVILLE'],
  ['LAND ROVER', 'DEFENDER P400E HSE X-DYNAMIC PHEV'],
  ['TOYOTA', 'LAND CRUISER LUXURY PANORAMA 37" DEKK'],
  ['TESLA', 'MODEL X PLAID 6 SÆTA 1020 HÖ'],
]
export const HERO_SLIDES: Car[] = HERO_PICKS
  .map(([make, model]) => CARS.find((c) => c.make === make && c.model === model))
  .filter((c): c is Car => Boolean(c))

/* de-DE grouping gives Icelandic's PERIOD thousands separator. Never is-IS:
   this Chrome's ICU maps it to a comma (craft ledger #27a). */
export const fmtPrice = (c: Car) =>
  `${c.priceNum.toLocaleString('de-DE')} kr.${c.anVsk ? ' án vsk.' : ''}`

/* Their real mark: a chromed circle holding a chequered flag, arched
   „STOFNAÐ 2002". Only 110x113 exists, so it is never rendered above its
   native size (craft ledger #64). */
export const LOGO = {
  src: `${import.meta.env.BASE_URL}preview/hofdabilar/logo.png`,
  alt: 'Höfðabílar',
}

/* Section photography = the dealer's own car photos. */
export const PHOTO = {
  heroCar: `${import.meta.env.BASE_URL}preview/hofdabilar/taycan.webp`,
  lot: `${import.meta.env.BASE_URL}preview/hofdabilar/landcruiser.webp`,
  sell: `${import.meta.env.BASE_URL}preview/hofdabilar/rangerover.webp`,
}

export const META = {
  title: 'Höfðabílar | Notaðir bílar á staðnum við Fossháls í Reykjavík',
  description:
    'Höfðabílar við Fossháls 27 í Reykjavík. 26 ökutæki á staðnum með uppgefnu verði og akstri, allt frá fornbíl upp í nýjan jeppa. Sölulaun uppgefin, allt að 90% fjármögnun. Sími 577 4747.',
}

export const CONTACT = {
  address: 'Fossháls 27, 110 Reykjavík',
  addressDat: 'Fosshálsi 27, Dragháls megin',
  phoneDisplay: '577 4747',
  phoneHref: 'tel:+3545774747',
  email: 'tryggvi@hofdabilar.is',
  maps: 'https://maps.google.com/?q=' + encodeURIComponent('Höfðabílar, Fossháls 27, 110 Reykjavík'),
  mapsEmbed:
    'https://www.google.com/maps?q=Fossh%C3%A1lsi+27,+110+Reykjav%C3%ADk&output=embed',
  kennitala: '630609-2160',
  founded: 2002,
}

/* Named staff from their own Um okkur page. They publish no staff
   photographs, so the page sets the names typographically instead of
   inventing portraits. */
export const STAFF = [
  { name: 'Tryggvi Lárusson', role: 'Löggiltur bifreiðasali', email: 'tryggvi@hofdabilar.is' },
  { name: 'Kristján Eldjárn', role: 'Söluráðgjafi', email: 'kristjan@hofdabilar.is' },
  { name: 'Elvar Þór Magnússon', role: 'Söluráðgjafi', email: 'elvar@hofdabilar.is' },
]

export const HOURS = [
  { d: 'Mánudagur til föstudags', t: '10:00-17:00' },
  { d: 'Laugardagur', t: '12:00-15:00' },
  { d: 'Sunnudagur', t: 'Lokað' },
]
export const HOURS_NOTE = 'Lokað á laugardögum í júní, júlí, ágúst og desember.'

/* Verðskrá — af Um okkur síðu hofdabilar.is, orðrétt gildi. */
export const FEES = {
  sale: [
    { range: 'Söluverð undir 299.000 kr.', fee: '69.900 kr.' },
    { range: '300.000 til 1.499.999 kr.', fee: '89.900 kr.' },
    { range: '1.500.000 kr. eða meira', fee: '4,1% af söluverði' },
  ],
  notes: [
    'Skjalagerð: 39.900 kr.',
    'Umsýslugjald lána: 30.000 kr.',
    'Allt að 80 til 90% fjármögnun á flestum bílum, 100% í allt að 60 mánuði á völdum bílum í gegnum Ergo',
  ],
}

export const LICENCE = 'Höfðabílar ehf. starfa samkvæmt leyfi til verslunar með notuð ökutæki.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Höfðabílar',
  legalName: 'Höfðabílar ehf.',
  telephone: '+354 577 4747',
  email: 'tryggvi@hofdabilar.is',
  foundingDate: '2002',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Fossháls 27',
    addressLocality: 'Reykjavík',
    postalCode: '110',
    addressCountry: 'IS',
  },
  openingHours: ['Mo-Fr 10:00-17:00', 'Sa 12:00-15:00'],
  url: 'https://hofdabilar.is',
}

/* ── Dashboard entry ─────────────────────────────────────────────────────── */
import type { PreviewCompany } from '../company-types'

export const HOFDABILAR_ENTRY: PreviewCompany = {
  slug: 'hofdabilar',
  route: '/preview/hofdabilar',
  name: 'Höfðabílar',
  sector: 'Bílasala',
  location: 'Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Stofnað 2002',
  currentUrl: 'https://hofdabilar.is',
  ownerEmail: 'tryggvi@hofdabilar.is',
  concept: 'Á staðnum',
  conceptTagline:
    'Bílás-hönnunin færð yfir á Höfðabíla: lóðin sjálf er vefurinn. Öll 26 ökutækin á planinu við Fossháls með eigin myndum sölunnar, raunverði og akstri, leitarvél og síum. Næturasfalt, xenonblár hreimur, kílómetramælir sem telur bílana meðan þú skrollar.',
  accent: '#8FC6FF',
  dark: true,
  status: 'Concept ready',
  thumb: `${import.meta.env.BASE_URL}preview/hofdabilar/taycan.webp`,
  ownPhotography: true,
  photoCredit:
    'Allar bílamyndir eru eigin myndir Höfðabíla, sóttar af söluskrá þeirra á bilasolur.is. Vatnsmerkið á myndunum kemur frá því kerfi.',
  audit: {
    strengths: [
      'Óvenju breitt úrval á einu plani: fornbíll á 590 þúsund, Range Rover á 24,8 milljónir, rafbílar, sendibíll og fjórhjól',
      'Sölulaun, skjalagerð og umsýslugjöld eru öll gefin upp opinberlega, sem fæstar bílasölur gera',
      'Þrír nafngreindir söluráðgjafar með eigin netföng, og löggiltur bifreiðasali á staðnum',
      'Eigin bílamyndir, allar teknar á sama stað fyrir framan salinn, svo úrvalið raðast upp eins og litaspjald',
    ],
    weaknesses: [
      'Vefurinn er sami hvíta merkjavefurinn og nánast allar aðrar íslenskar bílasölur keyra á, með .aspx slóðum og útliti frá 2014',
      'Öll valmyndin er falin á bak við hamborgaratákn, líka á fullri tölvuskjástærð, svo skjárinn nýtist ekki',
      'Ekkert stendur á forsíðunni um fyrirtækið sjálft: engin staðsetning, enginn opnunartími, engin ástæða til að velja Höfðabíla',
      'Verðskráin liggur á undirsíðu sem enginn finnur í síma, þótt hún sé eitt sterkasta traustsmerkið sem þeir eiga',
      'Vatnsmerki er stimplað yfir hverja einustu mynd, sem kemur verst niður á dýrustu bílunum',
    ],
    opportunities: [
      'Setja allt planið fram sem eina leitarvél með síum, í stað lista sem lítur eins út og hjá keppinautunum',
      'Draga verðskrána fram á forsíðu sem traustsatriði í stað þess að fela hana',
      'Nota breiddina í úrvalinu sem sölupunkt: enginn annar í bænum er með allt frá 590 þúsundum upp í 24,8 milljónir',
      'Setja nafngreindu ráðgjafana og símann fremst, því bílakaup á Íslandi byrja á símtali',
    ],
  },
  positioning:
    'Höfðabílar hafa staðið við Fossháls síðan 2002 og eru með óvenju breitt úrval á einu plani, allt frá Cadillac DeVille árgerð 1999 á 590.000 kr. upp í Range Rover P460 á 24.800.000 kr. Núverandi vefur flettir öllu þessu út í eins gráar smámyndir á sama merkjakerfinu og keppinautarnir keyra á. Endurhönnunin gerir planið sjálft að vefnum: hver einasti bíll með eigin mynd sölunnar, raunverði og akstri, leitarvél sem skilur venjulegt talmál og verðskrá sem er sögð upphátt í stað þess að vera falin.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Höfðabíla',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég var að skoða hofdabilar.is og tók eftir tvennu. Annars vegar keyrir síðan ykkar á sama staðlaða kerfinu og nánast allar aðrar bílasölur landsins, þannig að hún lítur eins út og hjá keppinautunum. Hins vegar er úrvalið hjá ykkur allt annað en venjulegt. Sama daginn og ég skoðaði stóð Cadillac DeVille á 590 þúsund á sama plani og Range Rover á 24,8 milljónir, og þar á milli rafbílar, sendibíll og fjórhjól.

Það er sölupunktur sem enginn annar getur notað, en hann sést hvergi á vefnum eins og hann er í dag.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Hún byggir á ykkar eigin bílum og ykkar eigin myndum. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Öll 26 ökutækin á planinu eru þarna inni með verði og akstri, með leitarvél sem skilur venjulegt talmál og síum eftir verði, tegund og orkugjafa. Ég setti líka verðskrána ykkar fram á forsíðuna, því það að gefa sölulaunin upp strax er sterkara traustsmerki en flestir átta sig á.

Ég sé einnig um hýsingu, viðhald og uppfærslur á þeim síðum sem ég geri, ef það er eitthvað sem þið hafið áhuga á.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
