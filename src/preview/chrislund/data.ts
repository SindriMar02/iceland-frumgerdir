import type { PreviewCompany } from '../companies'

/**
 * Christopher Lund, ljósmyndari — chris.is (Wix).
 * Facts read off his own rendered site 2026-08-14/15: Langholtsvegur 126,
 * 104 Reykjavík, s. 822 7601. Book facts from his own /baekur page: "Iceland,
 * Contrasts in Nature", 25×25 cm, 144 síður, 130 landslagsmyndir teknar á 10
 * árum, Gardamatt smooth 170g, harðspjalda; 12 valdar myndir sýndar í Gallery
 * Grásteini. Sýningin VITNI í Ljósmyndasafni Reykjavíkur sumarið 2020. His
 * About page: 20+ ára starf á Íslandi, í Noregi og Danmörku, fjögur tungumál.
 * Photography, logo and the 1% For The Planet badge are his own site assets,
 * harvested at full resolution behind Wix's thumbnail transforms. No email is
 * shown anywhere on his site, so none appears here ([[fact-check]]).
 */

const BASE = import.meta.env.BASE_URL

export interface ClPhoto { src: string; alt: string; ratio: string }

const P = (name: string, alt: string, ratio: string): ClPhoto => ({
  src: `${BASE}chrislund/${name}-1920.jpg`,
  alt,
  ratio,
})

export const srcSet = (src: string) =>
  `${src.replace('-1920.jpg', '-960.jpg')} 960w, ${src} 1920w`

export const PHOTO = {
  vestrahorn: P('vestrahorn', 'Snævi þakin fjöll og lítil mannvera í hvítri víðáttu', '4 / 3'),
  thoka: P('thoka', 'Klettur í hafþoku, sjórinn spegilsléttur', '4 / 5'),
  klettur: P('vitni-klettur', 'Svarthvít mynd: manneskja á klettabrún í úða', '3 / 4'),
  byggingBlalys: P('bygging-blalys', 'Nútímabygging að innan, bogadregnir veggir í blárri lýsingu', '1 / 1'),
  corten: P('corten', 'Íbúðarhús með ryðstálsklæðningu og grjóthleðslu', '3 / 2'),
  bokOpnaA: P('bok-opna-a', 'Opna úr bókinni: stuðlaberg og litrík fjöll', '2 / 1'),
  bokOpnaB: P('bok-opna-b', 'Opna úr bókinni: bláir ísveggir og ryðrauð jarðhitalitbrigði', '2 / 1'),
  bokKapa: P('bok-kapa', 'Bókin Iceland, Contrasts in Nature: harðspjalda kápa með melgresi í svörtum sandi', '1 / 1'),
  fyrirtaekiLid: P('fyrirtaeki-lid', 'Þrjú í hvítum sloppum við vinnu á rannsóknarstofu', '3 / 2'),
  folkBarn: P('folk-barn', 'Svarthvít mynd af brosandi barni við glugga', '4 / 3'),
  brudkaupStrond: P('brudkaup-strond', 'Brúðhjón hoppa á svartri strönd, svarthvít mynd', '4 / 5'),
  sjor: P('sjor', 'Sléttur sjór og himinn renna saman í mjúkri birtu', '5 / 4'),
  portrettBw: P('portrett-bw', 'Svarthvítt portrett af manni í mjúkri hliðarbirtu', '1 / 1'),
}

export const LOGO = {
  lockup: `${BASE}chrislund/logo-lockup.jpg`,
  onePercent: `${BASE}chrislund/onepercent.jpg`,
}

/** His six galleries, exactly as his own nav names them. */
export const SERIES = [
  { name: 'Fyrirtæki', note: 'Ímyndar- og starfsmannamyndir, ársskýrslur, ráðstefnur', photo: PHOTO.fyrirtaekiLid },
  { name: 'Landslag', note: 'FineArt-myndir frá tíu ára ferðum um landið', photo: PHOTO.sjor },
  { name: 'Fólk', note: 'Portrett, barna- og fjölskyldumyndir, fermingar', photo: PHOTO.folkBarn },
  { name: 'Brúðkaup', note: 'Fréttaljósmyndun fremur en uppstilling', photo: PHOTO.brudkaupStrond },
  { name: 'Arkitektúr', note: 'Byggingar utan og innan, innanhússhönnun', photo: PHOTO.corten },
  { name: 'Vitni', note: 'Sýning í Ljósmyndasafni Reykjavíkur, sumarið 2020', photo: PHOTO.klettur },
] as const

/** The book, specs verbatim from his own /baekur page. */
export const BOOK = {
  title: 'Iceland, Contrasts in Nature',
  specs: [
    ['Myndir', '130 landslagsmyndir'],
    ['Teknar á', '10 árum'],
    ['Stærð', '25 × 25 cm'],
    ['Síður', '144'],
    ['Pappír', 'Gardamatt smooth 170g'],
    ['Band', 'Harðspjalda, matt áferð'],
  ] as Array<[string, string]>,
}

export const SERVICES = [
  { name: 'FineArt prentun', note: 'Hágæða prentun listaverka og ljósmynda' },
  { name: 'Skönnun', note: 'Listaverk og filmur í fullum gæðum' },
  { name: 'Litgreining', note: 'Undirbúningur mynda fyrir prent og bækur' },
  { name: 'Myndvinnsla', note: 'Frágangur fyrir listaverka- og ljósmyndabækur' },
] as const

export const CONTACT = {
  phone: '822 7601',
  phoneHref: 'tel:+3548227601',
  address: 'Langholtsvegur 126, 104 Reykjavík',
} as const

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Photographer',
  name: 'Christopher Lund ljósmyndari',
  telephone: '+354 822 7601',
  url: 'https://www.chris.is',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Langholtsvegur 126',
    postalCode: '104',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  knowsAbout: ['Landslagsljósmyndun', 'Fyrirtækjaljósmyndun', 'Arkitektúrljósmyndun', 'FineArt prentun'],
}

export const companyEntry: PreviewCompany = {
  slug: 'chrislund',
  route: '/preview/chrislund',
  name: 'Christopher Lund ljósmyndari',
  sector: 'Ljósmyndun',
  location: 'Langholtsvegur 126, 104 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: '20+ ár á Íslandi, í Noregi og Danmörku',
  currentUrl: 'https://www.chris.is',
  ownerEmail: '',
  concept: 'Úrvalið',
  conceptTagline:
    'Hann tók 130 myndir í bókina og hengdi 12 upp á vegg. Vefurinn hans á að vera sá veggur, ekki 311 pixla smámyndagrind.',
  accent: '#A98147',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}chrislund/vestrahorn-960.jpg`,
  ownPhotography: true,
  photoCredit:
    'Allar myndir, merkið og 1%-merkið eru af vef Christophers (chris.is), sótt í fullri upplausn í ágúst 2026.',
  audit: {
    strengths: [
      'Verk í hæsta gæðaflokki: landslag, arkitektúr og fyrirtækjamyndir',
      'Útgefin bók (130 myndir, 144 síður) og sýning í Ljósmyndasafni Reykjavíkur',
      'Skýr þjónustulína: FineArt prentun, skönnun, litgreining',
    ],
    weaknesses: [
      'Forsíðan hefur 0 fyrirsagnir og 0 stafi af lesanlegum texta',
      'Myndasafnið birtir stærstu myndir í 311 pixlum; bókarsíðan í 472',
      'Galleríin heita „copy-of-arkitektúr“ og „Myndagallery“ í leitarvélum',
    ],
    opportunities: [
      'Láta vefinn hanga eins og sýningarvegg: fáar myndir, í fullri stærð',
      'Bókin og sýningin eru sönnunargögnin; 130 á móti 12 er sagan um úrvalið',
    ],
  },
  positioning:
    'Christopher Lund hefur ljósmyndað í yfir tuttugu ár og gefið út bók með 130 landslagsmyndum, en sýndi aðeins tólf þeirra á vegg. Vefurinn er byggður á þeirri ritstjórn: sýningarveggur sem gengið er eftir, ein mynd í einu, í fullri stærð.',
  outreach: {
    subject: 'Hugmynd að nýjum vef fyrir ljósmyndastofuna',
    body:
      'Sæll Christopher,\n\nÉg heiti Sindri og hanna vefsíður. Ég skoðaði chris.is og tók eftir að stærsta mynd sem síðan sýnir gestum er 311 pixlar á breidd, og forsíðan hefur engan lesanlegan texta fyrir Google. Myndirnar þínar eiga betra skilið.\n\nÉg setti saman frumgerð að vef sem hangir eins og sýningarveggur: fáar myndir í fullri stærð, bókin þín og VITNI-sýningin í öndvegi. Allt á síðunni eru þínar eigin myndir og þín eigin merki.\n\nÞetta kostar þig ekki neitt og því fylgir engin skuldbinding.\n\nBestu kveðjur,\nSindri',
  },
}
