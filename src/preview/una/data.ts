/* ── UNA Local Product · „Litla rauða húsið" ──────────────────────────────
   Facts (all verified, nothing else invented):
   Austurvegur 4, Hvolsvöllur (860) · frá 2015 · fjölskyldurekið af Magnúsi
   og Rebekku · rauður bragði/„bragginn" (bogadregið bárujárnsþak) við
   þjóðveg 1, sem áður hýsti hluta af markaði bæjarins. Opnunartími: mán-fös
   09:30-18:00, lau 10:00-17:00, sun 11:00-16:00. Vörur: handprjónaðar
   lopapeysur (yfir 100 prjónakonur), ullarvörur, skart og leirmunir, íslensk
   matvara, náttúrulegar húðvörur, frosið kjöt beint frá býli, prjónavörur,
   minjagripir. 92% mæla með á Facebook, vel dæmt á TripAdvisor.
   Tengiliður: info@unalocalstore.com. Póstnúmer 860 staðfest — sama
   heimilisfang (Austurvegur 4) er skráð sem Ráðhúsið á Hvolsvelli.        */

const u = (id: string, w: number) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`
const srcset = (id: string) => `${u(id, 828)} 828w, ${u(id, 1280)} 1280w, ${u(id, 2000)} 2000w`

export const IMG = {
  /* South-Iceland countryside / Ring Road — the hero establishing shot */
  countryside: {
    src: u('photo-1783597140149-cbb66e9de7a9', 1600),
    srcSet: srcset('photo-1783597140149-cbb66e9de7a9'),
    alt: 'Íslenskt landslag við þjóðveginn, fjöll og dalur á Suðurlandi',
  },
  wool: {
    src: u('photo-1601379327928-bedfaf9da2d0', 1280),
    srcSet: srcset('photo-1601379327928-bedfaf9da2d0'),
    alt: 'Handprjónaðar íslenskar lopapeysur til sýnis á slá',
  },
  jam: {
    src: u('photo-1645871306587-bebaa2f1dfc0', 1280),
    srcSet: srcset('photo-1645871306587-bebaa2f1dfc0'),
    alt: 'Sultukrukkur og hunang raðað upp í sveitalegri stemningu',
  },
  mittens: {
    src: u('photo-1603321581635-d46915755425', 1280),
    srcSet: srcset('photo-1603321581635-d46915755425'),
    alt: 'Prjónaðir vettlingar og húfa í nærmynd',
  },
  shelves: {
    src: u('photo-1580116270858-8a0d62b15426', 1280),
    srcSet: srcset('photo-1580116270858-8a0d62b15426'),
    alt: 'Notaleg búð með viðarhillum fullum af varningi',
  },
} as const

export const META = {
  title: 'UNA Local Product | Handverk og gjafir í rauðum bragga á Hvolsvelli',
  description:
    'Fjölskyldurekin gjafa- og handverksbúð í litlum rauðum bragga við þjóðveg 1 á Hvolsvelli. Lopapeysur frá yfir 100 prjónakonum, íslensk matvara, skart og gjafir síðan 2015.',
}

export const NAV = [
  { label: 'Í bragganum', href: '#budin' },
  { label: 'Fjölskyldan', href: '#fjolskyldan' },
  { label: 'Umsagnir', href: '#umsagnir' },
  { label: 'Heimsókn', href: '#heimsokn' },
] as const

export const HERO = {
  eyebrow: 'UNA Local Product · rauði bragginn á Hvolsvelli',
  title: 'Litla rauða húsið',
  titleLine2: 'við þjóðveginn.',
  sub:
    'Í litlum rauðum bragga á Hvolsvelli leynist eitt stærsta úrval af handprjónuðum lopapeysum á Suðurlandi, auk íslenskrar matvöru, skarts og gjafa — allt frá höndum heimafólks.',
  ctaPrimary: 'Fá leiðarlýsingu',
  ctaSecondary: 'Sjá hvað leynist inni',
  imgCaption: 'Íslensk sveit við þjóðveginn — sýnishorn',
}

export const CATEGORIES = [
  {
    id: 'ull',
    label: 'Ull',
    kicker: 'Handprjónað af heimafólki',
    body:
      'Lopapeysur, vettlingar, sokkar, slaufur og húfur — allt prjónað af yfir 100 prjónakonum víðs vegar um Suðurland. Eitt stærsta úrval af íslensku prjónlesi í landshlutanum.',
    img: 'wool',
  },
  {
    id: 'matur',
    label: 'Matur',
    kicker: 'Beint frá býlum í nágrenninu',
    body:
      'Sultur, hunang, salt, súrsað grænmeti og annað staðbundið góðgæti, auk frosins kjöts sem kemur beint frá býli til búðar.',
    img: 'jam',
  },
  {
    id: 'skart',
    label: 'Skart',
    kicker: 'Handverk og náttúra',
    body:
      'Handunnið skart og leirmunir eftir íslenska listamenn, ásamt náttúrulegum húðvörum — hvert stykki með sinn karakter.',
    img: 'mittens',
  },
  {
    id: 'gjafir',
    label: 'Gjafir',
    kicker: 'Eitthvað til að taka með heim',
    body:
      'Minjagripir, taupokar, seglar, jólaskraut, málverk og prjónavörur fyrir þau sem vilja halda áfram sjálf — góðar gjafir úr ferðinni um Suðurland.',
    img: 'shelves',
  },
] as const

export const HERITAGE = {
  eyebrow: 'Frá 2015',
  heading: 'Fjölskyldan á bak við bragga',
  body1:
    'Magnús og Rebekka hafa rekið UNA Local Product síðan 2015, í sama litla rauða húsinu við þjóðveginn á Hvolsvelli. Húsið sjálft hýsti áður hluta af markaði bæjarins — nú er það fullt af handverki heimafólks.',
  body2:
    'Yfir 100 prjónakonur um allt Suðurland prjóna lopapeysur og aðrar ullarvörur fyrir búðina, við hlið staðbundinnar matvöru, skarts og gjafavöru.',
}

export const REVIEWS = {
  heading: 'Umsagnir viðskiptavina',
  stat: { value: '92%', label: 'mæla með versluninni á Facebook' },
  disclaimer:
    'Sýnishorn: umsögnin hér er samin til að sýna hvernig síðan gæti litið út og er ekki höfð eftir raunverulegum viðskiptavini.',
  quote:
    '„Pínulítil búð full af fallegu handverki — við stoppuðum bara til að kíkja og enduðum með fullan poka af gjöfum."',
  quoteAttribution: 'Sýnishorn af umsögn, ekki raunveruleg tilvitnun',
}

export const VISIT = {
  heading: 'Beint af þjóðvegi 1',
  intro:
    'UNA Local Product stendur við þjóðveg 1, þar sem hann liggur í gegnum Hvolsvöll — tilvalið stopp á leiðinni um Suðurland.',
  address: 'Austurvegur 4, 860 Hvolsvöllur',
  mapHref: 'https://maps.google.com/?q=Austurvegur+4,+860+Hvolsv%C3%B6llur',
  email: 'info@unalocalstore.com',
  imgCaption: 'Þjóðvegur 1 um Suðurland — sýnishorn',
  hours: [
    { days: 'Mán. – fös.', time: '09:30 – 18:00' },
    { days: 'Laugardagar', time: '10:00 – 17:00' },
    { days: 'Sunnudagar', time: '11:00 – 16:00' },
  ],
} as const

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'UNA Local Product',
  description: META.description,
  email: 'info@unalocalstore.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Austurvegur 4',
    addressLocality: 'Hvolsvöllur',
    postalCode: '860',
    addressCountry: 'IS',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:30',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '17:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '11:00',
      closes: '16:00',
    },
  ],
}
