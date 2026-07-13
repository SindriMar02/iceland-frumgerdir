/* ── Gleraugnasalan Geisli · „Gleraugu eru skart" ─────────────────────────────
   All facts verified 2026-07-13 (see research-assets/geisli/BRIEF.md).

   PHONE DISCREPANCY NOTE: 462 1555 is confirmed everywhere and is the ONLY
   number used on this page. A "463 1455 Glerártorg" appears on the 2019
   archived site and "569 1100" in one directory — both UNVERIFIED, deliberately
   left out. Glerártorg opening hours are also unverified: the store is listed
   by name only, hours "fást í síma".                                          */

const u = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const IMG = {
  /* man holds glasses toward camera, face soft behind razor-sharp lenses */
  hero: {
    src: u('photo-1540162875225-3f6b56d69fe8', 1280),
    srcSet: `${u('photo-1540162875225-3f6b56d69fe8', 828)} 828w, ${u('photo-1540162875225-3f6b56d69fe8', 1280)} 1280w, ${u('photo-1540162875225-3f6b56d69fe8', 2000)} 2000w`,
    alt: 'Maður heldur gleraugum í átt að myndavélinni og andlitið er óskýrt á bak við skörp glerin',
  },
  /* north-Iceland fjord road — the blur⇄sharp lens signature (caption generic) */
  fjord: {
    src: u('photo-1519092437326-bfd121eb53ae', 1600),
    srcSet: `${u('photo-1519092437326-bfd121eb53ae', 828)} 828w, ${u('photo-1519092437326-bfd121eb53ae', 1280)} 1280w, ${u('photo-1519092437326-bfd121eb53ae', 2000)} 2000w`,
    alt: 'Vegur meðfram firði á Norðurlandi, grænar hlíðar og snævi þakin fjöll',
  },
  frameBlack: {
    src: u('photo-1608906709312-fe17f7c1a5a6', 900),
    alt: 'Svört gleraugnaumgjörð á hvítum fleti með skörpum skugga',
  },
  frameColour: {
    src: u('photo-1711564354308-77285d9fe3c7', 900),
    alt: 'Tvær litríkar umgjarðir, blágræn og gyllt, hlið við hlið á ljósum fleti',
  },
  frameWood: {
    src: u('photo-1591076482161-42ce6da69f67', 900),
    alt: 'Gleraugnaumgjörð á viðarborði með mjúkum ljósbaug í bakgrunni',
  },
  wall: {
    src: u('photo-1667964394328-78f6389e79ab', 1600),
    alt: 'Upplýstar ljósar hillur með úrvali af gleraugnaumgjörðum',
  },
  exam: {
    src: u('photo-1539036776273-021ec1d78bec', 1000),
    alt: 'Sjónmælingatæki í skoðunarherbergi sjóntækjafræðings',
  },
  child: {
    src: u('photo-1594918794521-a0c01cdff8c0', 1000),
    alt: 'Brosandi barn með stór retró gleraugu í rauðri og blárri peysu',
  },
  retro: {
    src: u('photo-1766310549795-dd0fc75d499f', 1800),
    alt: 'Eldri ljósmynd af sjónmælingu þar sem sjóntækjafræðingur beitir mælitæki',
  },
  town: {
    src: u('photo-1755279087677-3b473398f2c3', 1200),
    alt: 'Bær handan fjarðar undir háu fjalli',
  },
} as const

export const LOGO = 'geisli/logo_geisli_clean.png'

export const PHONE_DISPLAY = '462 1555'
export const PHONE_HREF = 'tel:+3544621555'

export const META = {
  title: 'Gleraugnasalan Geisli | Sjónmæling og gleraugu á Akureyri síðan 1967',
  description:
    'Fjölskyldurekin gleraugnaverslun á Akureyri í tæp sextíu ár. Sjónmæling, linsur og úrval umgjarða í Kaupangi við Mýrarveg og á Glerártorgi. Sími 462 1555.',
}

export const NAV = [
  { label: 'Sjónin', href: '#sjonin' },
  { label: 'Umgjarðir', href: '#umgjardir' },
  { label: 'Þjónusta', href: '#thjonusta' },
  { label: 'Heimsókn', href: '#heimsokn' },
]

export const HERO = {
  eyebrow: 'Gleraugnasalan Geisli á Akureyri síðan 1967',
  line1: 'Gleraugu',
  line2: 'eru skart.',
  sub: 'Fjölskyldurekin gleraugnaverslun á Akureyri í tæp sextíu ár. Sjónmæling, linsur og umgjarðir valdar af sömu alúð og skartgripir.',
  ctaPrimary: 'Panta tíma',
  ctaSecondary: 'Skoða þjónustu',
}

export const TRUST = [
  { value: '1967', label: 'sama fjölskyldan frá upphafi' },
  { value: '3.', label: 'kynslóðin rekur verslunina' },
  { value: '2', label: 'verslanir á Akureyri' },
] as const

export const LENS = {
  heading: 'Svona getur skýr sjón litið út',
  body: 'Ef heimurinn er farinn að renna saman er kominn tími á sjónmælingu. Dragðu linsuna yfir myndina og sjáðu muninn.',
  caption: 'Norðurland',
  hint: 'Dragðu hringinn, smelltu á myndina eða notaðu örvalykla til að skerpa.',
  inputLabel: 'Færa skilin milli óskýrrar og skýrrar myndar',
  before: 'Óskýrt',
  after: 'Skýrt',
}

export const FRAMES = {
  heading: 'Umgjarðir sem skart',
  intro:
    'Umgjörð er ekki bara hjálpartæki heldur skart sem þú berð á hverjum degi. Við veljum úrvalið af alúð og hjálpum þér að finna umgjörð sem hæfir andlitsfalli, litum og stíl.',
  plates: [
    { img: 'frameBlack', caption: 'Klassísk svört umgjörð' },
    { img: 'frameColour', caption: 'Litur sem lyftir andlitinu' },
    { img: 'frameWood', caption: 'Handvalið á sýningarborðið' },
  ],
  wallCaption: 'Úrval umgjarða fyrir öll tilefni og öll andlit',
} as const

export const SERVICES = {
  heading: 'Þjónusta',
  exam: {
    title: 'Sjónmæling',
    body: 'Nákvæm sjónmæling hjá Birni Óskari Björnssyni sjóntækjafræðingi. Þú pantar tíma í síma 462 1555 og færð niðurstöður og ráðgjöf á staðnum.',
  },
  lenses: {
    title: 'Linsur og linsumæling',
    body: 'Við finnum linsur sem henta augunum þínum, kennum þér réttu handtökin og fylgjum notkuninni eftir svo linsurnar fari alltaf vel.',
  },
  child: {
    title: 'Fyrstu gleraugun',
    body: 'Bestu stundirnar í versluninni eru þegar börn setja upp fyrstu gleraugun sín og heimurinn skerpist allt í einu. Við gefum okkur góðan tíma með yngstu viðskiptavinunum og finnum umgjarðir sem þola leik og læti.',
  },
}

export const HERITAGE = {
  year: '1967',
  heading: 'Sama fjölskyldan í tæp sextíu ár',
  body1:
    'Geisli hefur fylgt Akureyringum frá árinu 1967. Í dag stýrir Ásta Einarsdóttir rekstrinum og Björn Óskar Björnsson sjóntækjafræðingur sér um sjónmælingar, þriðja kynslóðin í sama fjölskyldufyrirtækinu.',
  body2: 'Verslanirnar eru tvær, í Kaupangi við Mýrarveg og á Glerártorgi.',
}

export const REVIEWS = {
  heading: 'Umsagnir viðskiptavina',
  disclaimer:
    'Sýnishorn: umsagnirnar hér að neðan eru dæmi, sett fram til að sýna hvernig síðan gæti litið út.',
  items: [
    {
      quote:
        '„Sjónmælingin var gerð af mikilli natni og allt útskýrt vel. Nýju gleraugun eru þau bestu sem ég hef átt.“',
      name: 'Guðrún H.',
    },
    {
      quote:
        '„Frábær þjónusta þegar dóttir mín fékk fyrstu gleraugun sín. Starfsfólkið gaf sér góðan tíma með henni.“',
      name: 'Stefán J.',
    },
    {
      quote:
        '„Ég hef verslað við Geisla í áratugi og fer ekki annað. Persónuleg þjónusta sem stórverslanir bjóða ekki.“',
      name: 'María K.',
    },
  ],
}

export const VISIT = {
  heading: 'Kíktu í heimsókn',
  kaupangur: {
    name: 'Kaupangur',
    address: 'Kaupangur v/ Mýrarveg, 600 Akureyri',
    hours: [
      { days: 'Mán. til fim.', time: '09:00-17:00' },
      { days: 'Föstudagar', time: '10:00-16:30' },
      { days: 'Um helgar', time: 'Lokað' },
    ],
    mapHref: 'https://maps.google.com/?q=Kaupangur+M%C3%BDrarvegur+Akureyri',
  },
  glerartorg: {
    name: 'Glerártorg',
    address: 'Glerártorg, Akureyri',
    note: 'Opnunartímar fást í síma 462 1555.',
    mapHref: 'https://maps.google.com/?q=Gler%C3%A1rtorg+Akureyri',
  },
  townCaption: 'Við fjörðinn',
}

export const CLOSING = {
  heading: 'Er kominn tími á sjónmælingu?',
  body: 'Hringdu í okkur og við tökum vel á móti þér, í Kaupangi eða á Glerártorgi.',
  imprint: 'Gleraugnasalan Geisli ehf · Kaupangur v/ Mýrarveg · 600 Akureyri',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Optician',
  name: 'Gleraugnasalan Geisli',
  slogan: 'Gleraugu eru skart',
  foundingDate: '1967',
  telephone: '+354-462-1555',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kaupangur v/ Mýrarveg',
    addressLocality: 'Akureyri',
    postalCode: '600',
    addressCountry: 'IS',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '09:00',
      closes: '17:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Friday',
      opens: '10:00',
      closes: '16:30',
    },
  ],
}
