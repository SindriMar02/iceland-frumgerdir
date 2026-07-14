/* ── Bílasalan Bílás · „Á staðnum" ────────────────────────────────────────────
   Verified facts only, harvested from bilas.is + bilasolur.is 2026-07-14:
   Bílasala Akraness ehf. (kt. 670807-1180 → est. 2007), Smiðjuvöllum 17,
   300 Akranes, s. 431 2622, neyðarsími bílaleigu 644-2622. Söluumboð fyrir BL.
   Staff: Alexander Þórsson (eigandi/framkvæmdastjóri, alexander@bilas.is),
   Jón Haukur Pálmason (sölumaður, jonhaukur@bilas.is). Opnunartími mán-fös
   09:00-17:00, lau/sun lokað. Reynsluakstur 20 mín. Verðskrá af um-okkur síðu.
   CARS below = the ACTUAL live inventory (24 cars) with the dealer's own
   photos served from bilasolur.is — real prices, km, fuel, gears. The Audi's
   transmission is genuinely unlisted on the source page, so it stays null.  */

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
}

export const CARS: Car[] = [
  { make: 'AUDI', model: 'A5 SPORTBACK', reg: '12/2015', priceNum: 3590000, tilbod: false, anVsk: false, km: '128 þ.km', fuel: 'Dísel', gear: null, href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=254307&sid=1072283', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=254307&p=4513719', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=254307&p=4513721' },
  { make: 'JAGUAR', model: 'XF R-SPORT', reg: '1/2018', priceNum: 3590000, tilbod: false, anVsk: false, km: '55 þ.km', fuel: 'Dísel', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=623788&sid=1064759', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=623788&p=4328403', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=623788&p=4328404' },
  { make: 'VW', model: 'GOLF LIFE E-TSI', reg: '5/2023', priceNum: 3590000, tilbod: false, anVsk: false, km: '94 þ.km', fuel: 'Bensín / Rafmagn', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=860875&sid=1076823', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=860875&p=4588787', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=860875&p=4588788' },
  { make: 'RENAULT', model: 'CAPTUR E-TECH PLUG-IN HY', reg: '5/2022', priceNum: 3190000, tilbod: false, anVsk: false, km: '92 þ.km', fuel: 'Bensín / Rafmagn', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=465758&sid=1069004', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=465758&p=4465297', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=465758&p=4465298' },
  { make: 'VW', model: 'TRANSPORTER', reg: '9/2020', priceNum: 3190000, tilbod: false, anVsk: true, km: '152 þ.km', fuel: 'Dísel', gear: 'Beinskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=502477&sid=1075877', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=502477&p=4590590', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=502477&p=4590593' },
  { make: 'LAND ROVER', model: 'DISCOVERY SPORT SE', reg: '6/2018', priceNum: 3090000, tilbod: false, anVsk: false, km: '97 þ.km', fuel: 'Dísel', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=607881&sid=1076586', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=607881&p=4583858', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=607881&p=4583859' },
  { make: 'KIA', model: 'CEED URBAN PHEV', reg: '3/2023', priceNum: 2990000, tilbod: true, anVsk: false, km: '115 þ.km', fuel: 'Bensín / Rafmagn', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=517966&sid=1042574', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=517966&p=3879687', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=517966&p=3879689' },
  { make: 'MG', model: 'MG5 ELECTRIC LUXURY 61KWH', reg: '8/2023', priceNum: 2990000, tilbod: false, anVsk: false, km: '40 þ.km', fuel: 'Rafmagn', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=664213&sid=1076221', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=664213&p=4586566', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=664213&p=4586567' },
  { make: 'VW', model: 'TIGUAN', reg: '8/2018', priceNum: 2990000, tilbod: true, anVsk: false, km: '114 þ.km', fuel: 'Bensín', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=736479&sid=1023986', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=736479&p=3473986', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=736479&p=3473987' },
  { make: 'HYUNDAI', model: 'I20 CLASSIC', reg: '8/2023', priceNum: 2790000, tilbod: true, anVsk: false, km: '103 þ.km', fuel: 'Bensín', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=869281&sid=1042563', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=869281&p=3879691', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=869281&p=3879695' },
  { make: 'VOLVO', model: 'V40 CROSS COUNTRY', reg: '1/2018', priceNum: 2750000, tilbod: false, anVsk: false, km: '97 þ.km', fuel: 'Dísel', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=409804&sid=1054098', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=409804&p=4115876', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=409804&p=4115877' },
  { make: 'DACIA', model: 'DUSTER ESSENTIAL', reg: '6/2022', priceNum: 2690000, tilbod: false, anVsk: false, km: '101 þ.km', fuel: 'Dísel', gear: 'Beinskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=641808&sid=1076220', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=641808&p=4586585', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=641808&p=4586586' },
  { make: 'VOLVO', model: 'S60 CROSS COUNTRY', reg: '10/2017', priceNum: 2690000, tilbod: true, anVsk: false, km: '175 þ.km', fuel: 'Dísel', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=795899&sid=1068473', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=795899&p=4466174', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=795899&p=4466176' },
  { make: 'MERCEDES-BENZ', model: 'GLK 220 CDI 4MATIC', reg: '5/2015', priceNum: 2490000, tilbod: false, anVsk: false, km: '213.413 km', fuel: 'Dísel', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=431988&sid=1065995', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=431988&p=4355123', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=431988&p=4355126' },
  { make: 'VW', model: 'GOLF', reg: '6/2021', priceNum: 2290000, tilbod: true, anVsk: false, km: '101 þ.km', fuel: 'Bensín', gear: 'Beinskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=775705&sid=1042577', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=775705&p=3879655', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=775705&p=3879659' },
  { make: 'MG', model: 'MG ZS EV LUXURY 44,5KWH', reg: '6/2021', priceNum: 1990000, tilbod: true, anVsk: false, km: '43 þ.km', fuel: 'Rafmagn', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=300218&sid=1074007', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=300218&p=4528403', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=300218&p=4528404' },
  { make: 'VW', model: 'POLO', reg: '6/2020', priceNum: 1790000, tilbod: true, anVsk: false, km: '93.511 km', fuel: 'Bensín', gear: 'Beinskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=368793&sid=1048782', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=368793&p=4010199', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=368793&p=4010194' },
  { make: 'FORD', model: 'GALAXY', reg: '5/2015', priceNum: 1690000, tilbod: true, anVsk: false, km: '152 þ.km', fuel: 'Dísel', gear: 'Beinskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=500628&sid=1042396', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=500628&p=3883093', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=500628&p=3883094' },
  { make: 'HONDA', model: 'CR-V', reg: '9/2013', priceNum: 1290000, tilbod: false, anVsk: false, km: '210 þ.km', fuel: 'Bensín', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=533930&sid=1072777', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=533930&p=4519660', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=533930&p=4519661' },
  { make: 'NISSAN', model: 'MICRA TEKNA BOSE', reg: '1/2018', priceNum: 1240000, tilbod: true, anVsk: false, km: '148 þ.km', fuel: 'Dísel', gear: 'Beinskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=949199&sid=1052315', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=949199&p=4268165', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=949199&p=4268166' },
  { make: 'KIA', model: 'PICANTO GT-LINE', reg: '7/2018', priceNum: 1190000, tilbod: false, anVsk: false, km: '73 þ.km', fuel: 'Bensín', gear: 'Beinskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=941400&sid=1075336', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=941400&p=4559420', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=941400&p=4559421' },
  { make: 'OPEL', model: 'CORSA-E', reg: '9/2017', priceNum: 1190000, tilbod: false, anVsk: false, km: '45 þ.km', fuel: 'Bensín', gear: 'Beinskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=616266&sid=1071234', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=616266&p=4470937', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=616266&p=4470938' },
  { make: 'BMW', model: 'X3', reg: '8/2005', priceNum: 850000, tilbod: true, anVsk: false, km: '309 þ.km', fuel: 'Dísel', gear: 'Beinskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=310742&sid=1072512', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=310742&p=4498428', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=310742&p=4498427' },
  { make: 'HONDA', model: 'CR-V', reg: '12/2006', priceNum: 390000, tilbod: false, anVsk: false, km: '235 þ.km', fuel: 'Bensín', gear: 'Sjálfskipting', href: 'https://bilas.is/CarDetails.aspx?bid=31&cid=277650&sid=1073655', img: 'https://bilasolur.is/CarImage.aspx?s=31&c=277650&p=4570892', img2: 'https://bilasolur.is/CarImage.aspx?s=31&c=277650&p=4570893' },]

export const carImg = (src: string, w: number) => `${src}&w=${w}`

/* hero rotation: a hand-picked spread of body styles/colours from the real
   stock (sedan, SUV, wagon, EV hatch) so the carousel reads as "the lot",
   not five of the same silhouette. Pulled live from CARS, not hardcoded,
   so price/km/specs never drift out of sync with the inventory below. */
const HERO_PICKS: [string, string][] = [
  ['JAGUAR', 'XF R-SPORT'],
  ['AUDI', 'A5 SPORTBACK'],
  ['LAND ROVER', 'DISCOVERY SPORT SE'],
  ['MG', 'MG5 ELECTRIC LUXURY 61KWH'],
  ['VOLVO', 'V40 CROSS COUNTRY'],
]
export const HERO_SLIDES: Car[] = HERO_PICKS
  .map(([make, model]) => CARS.find((c) => c.make === make && c.model === model))
  .filter((c): c is Car => Boolean(c))

export const fmtPrice = (c: Car) =>
  `${c.priceNum.toLocaleString('de-DE')} kr.${c.anVsk ? ' án vsk.' : ''}`

/* transparent version: chroma-keyed off the navy background of the real
   bilas.is logo.png, so it sits directly on the page with no colour box */
export const LOGO = { src: '/media/bilas-logo-hd.png', alt: 'Bílás – Bílasala Akraness' }

/* hero + section photography = the dealer's own car photos, hi-res */
export const PHOTO = {
  heroJaguar: 'https://bilasolur.is/CarImage.aspx?s=31&c=623788&p=4328403',
  audiSunny: 'https://bilasolur.is/CarImage.aspx?s=31&c=254307&p=4513719',
  lotLandRover: 'https://bilasolur.is/CarImage.aspx?s=31&c=607881&p=4583858',
}

export const META = {
  title: 'Bílás | Notaðir bílar á staðnum á Akranesi',
  description:
    'Bílasalan Bílás á Akranesi. 24 notaðir bílar á staðnum með uppgefnu verði og akstri. Söluumboð fyrir BL. Smiðjuvöllum 17, sími 431 2622.',
}

export const CONTACT = {
  address: 'Smiðjuvellir 17, 300 Akranes',
  addressDat: 'Smiðjuvöllum 17, 300 Akranesi',
  phoneDisplay: '431 2622',
  phoneHref: 'tel:+3544312622',
  emergencyDisplay: '644-2622',
  emergencyHref: 'tel:+3546442622',
  email: 'alexander@bilas.is',
  maps: 'https://maps.google.com/?q=' + encodeURIComponent('Bílás, Smiðjuvellir 17, 300 Akranes'),
  kennitala: '670807-1180',
}

/* real staff photos, harvested from the "Starfsmenn" section of bilas.is */
export const STAFF = [
  { name: 'Alexander Þórsson', role: 'Eigandi og framkvæmdastjóri', email: 'alexander@bilas.is', photo: '/media/bilas-alexander.jpg' },
  { name: 'Jón Haukur Pálmason', role: 'Sölumaður', email: 'jonhaukur@bilas.is', photo: '/media/bilas-jonhaukur.jpg' },
]

export const HOURS = [
  { d: 'Mánudagur til föstudags', t: '09:00-17:00' },
  { d: 'Laugardagur', t: 'Lokað' },
  { d: 'Sunnudagur', t: 'Lokað' },
]

/* verðskrá — af um-okkur síðu bilas.is, orðrétt gildi */
export const FEES = {
  sale: [
    { range: 'Söluverð undir 600.000 kr.', fee: '59.990 kr.' },
    { range: '600.000 – 1.699.999 kr.', fee: '89.990 kr.' },
    { range: '1.700.000 kr. eða meira', fee: '4,2% + vsk.' },
  ],
  notes: [
    'Eigendaskipti og upplýsingar úr bifreiðaskrá innifalin',
    'Skjalafrágangur fyrir bílaviðskipti: 35.000 kr. m. vsk.',
    'Reynsluakstur er 20 mínútur',
  ],
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Bílasalan Bílás',
  legalName: 'Bílasala Akraness ehf.',
  telephone: '+354 431 2622',
  email: 'alexander@bilas.is',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Smiðjuvellir 17',
    addressLocality: 'Akranes',
    postalCode: '300',
    addressCountry: 'IS',
  },
  openingHours: 'Mo-Fr 09:00-17:00',
  url: 'https://bilas.is',
}
