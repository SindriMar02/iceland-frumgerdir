import type { PreviewCompany } from '../companies'

/**
 * Ljósmyndastúdíó Huldu Margrétar — huldamargret.is (WordPress/Elementor).
 * All facts below were read off her own rendered site 2026-08-14/15:
 * phone +354 897 0250, hulda@huldamargret.is, the three wedding packages with
 * their exact prices, the client-logo wall (30+ logos, 12 harvested), and the
 * positioning line about executive portraits ("til notkunar á heimasíðum, í
 * ársskýrslum, fréttum, greinum og viðburðum"). Photography: her own published
 * portfolio images, harvested at full resolution. NOTHING here is invented;
 * no address is shown because her site publishes none.
 */

const BASE = import.meta.env.BASE_URL

export interface HmPhoto { src: string; alt: string; ratio: string }

const P = (name: string, alt: string, ratio: string): HmPhoto => ({
  src: `${BASE}huldamargret/${name}-1920.jpg`,
  alt,
  ratio,
})

/** srcSet helper: every photo ships a -1920 and a -960 derivative. */
export const srcSet = (src: string) =>
  `${src.replace('-1920.jpg', '-960.jpg')} 960w, ${src} 1920w`

export const PHOTO = {
  brudkaup: P('brudkaup', 'Brúðhjón við torfbæ í sólskini, brúðarvöndurinn í forgrunni', '3 / 2'),
  portrettA: P('portrett-a', 'Stjórnendaportrett: kona með krosslagða arma í hlýrri lýsingu', '3 / 2'),
  portrettB: P('portrett-b', 'Portrett í stúdíói með rauðri neonlínu í bakgrunni', '3 / 2'),
  vollur: P('vollur', 'Fótboltaleikur: tækling á miðjum velli, búningar í fullum litum', '3 / 2'),
  vara: P('vara', 'Vörumynd: golfhanski heldur á Unbroken-túpu, völlurinn í mýkt fyrir aftan', '4 / 3'),
  ferming: P('ferming', 'Fermingarmynd: stúlka í hvítum kjól í grænu sumarljósi', '3 / 2'),
  studio: P('studio', 'Stúdíósería: fimm manns í loftköstum á ljósum grunni', '3 / 2'),
  svid: P('svid', 'Tónleikar: gítarleikari baðaður grænu sviðsljósi', '3 / 2'),
}

/** The five phases of one working day — the page's structure. */
export const PHASES = [
  { is: 'Morgunn', en: 'Portrett' },
  { is: 'Dagur', en: 'Á vellinum' },
  { is: 'Síðdegi', en: 'Fjölskyldan' },
  { is: 'Gullna stundin', en: 'Brúðkaup' },
  { is: 'Kvöld', en: 'Á sviðinu' },
] as const

/** Her real wedding packages, prices exactly as published (ágúst 2026). */
export const PACKAGES = [
  {
    name: 'Brúðkaup I',
    price: '350.000 kr.',
    includes: ['Myndataka', 'Athöfn'],
  },
  {
    name: 'Brúðkaup II',
    price: '450.000 kr.',
    includes: ['Undirbúningur', 'Myndataka', 'Athöfn'],
  },
  {
    name: 'Brúðkaup III',
    price: '490.000 kr.',
    includes: ['Undirbúningur', 'Myndataka', 'Athöfn', 'Veisla'],
  },
] as const

/** 12 of the 30+ client logos she shows on her own site. */
export const LOGOS = [
  { f: 'Harpa_Logo_Vertical_nobackblack__2_.png', name: 'Harpa' },
  { f: 'KSI_Logo_BlueRed-2.png', name: 'KSÍ' },
  { f: 'stod2-2.png', name: 'Stöð 2' },
  { f: 'vodafone-2.png', name: 'Vodafone' },
  { f: 'bauhaus.png', name: 'Bauhaus' },
  { f: 'bylgjan.jpeg', name: 'Bylgjan' },
  { f: 'icewear.jpeg', name: 'Icewear' },
  { f: 'terra-umhverfisthjonusta-_rgb_blue-4-.png', name: 'Terra' },
  { f: 'fm957-2.png', name: 'FM957' },
  { f: 'logo_smarabio.png', name: 'Smárabíó' },
  { f: 'Motus-merki-graent-2.png', name: 'Motus' },
  { f: 'kokkarnir.png', name: 'Kokkarnir' },
].map((l) => ({ ...l, src: `${BASE}huldamargret/logos/${l.f}` }))

export const CONTACT = {
  phone: '+354 897 0250',
  phoneHref: 'tel:+3548970250',
  email: 'hulda@huldamargret.is',
} as const

/** Real, fact-checked scope (her own audit flags the current meta as keyword-stuffed). */
export const META = {
  title: 'Hulda Margrét ljósmyndari',
  description:
    'Hulda Margrét er sjálfstætt starfandi ljósmyndari: stjórnendaportrett, brúðkaup, fermingar og viðburðir. Meðal viðskiptavina eru Harpa, KSÍ og Vodafone.',
} as const

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Photographer',
  name: 'Ljósmyndastúdíó Huldu Margrétar',
  telephone: '+354 897 0250',
  email: 'hulda@huldamargret.is',
  url: 'https://huldamargret.is',
  areaServed: 'Ísland',
  knowsAbout: [
    'Stjórnendaportrett',
    'Brúðkaupsljósmyndun',
    'Fermingarmyndir',
    'Íþróttaljósmyndun',
    'Viðburðaljósmyndun',
  ],
  makesOffer: PACKAGES.map((p) => ({
    '@type': 'Offer',
    name: p.name,
    price: p.price.replace(/\D/g, ''),
    priceCurrency: 'ISK',
  })),
}

export const companyEntry: PreviewCompany = {
  slug: 'huldamargret',
  route: '/preview/huldamargret',
  name: 'Ljósmyndastúdíó Huldu Margrétar',
  sector: 'Ljósmyndun',
  location: 'Höfuðborgarsvæðið',
  region: 'Höfuðborgarsvæðið',
  established: 'Sjálfstætt starfandi ljósmyndari',
  currentUrl: 'https://huldamargret.is',
  ownerEmail: 'hulda@huldamargret.is',
  concept: 'Einn dagur',
  conceptTagline:
    'Einn vinnudagur ljósmyndara: síðan byrjar í morgunbirtu stúdíósins og endar í sviðsljósinu, og verkin hennar bera hvert skref.',
  accent: '#B98A45',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}huldamargret/brudkaup-960.jpg`,
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru raunverulegar myndir af vef Huldu Margrétar (huldamargret.is), sóttar í fullri upplausn í ágúst 2026.',
  audit: {
    strengths: [
      'Raunveruleg verðskrá birt fyrir brúðkaupspakka (350/450/490 þús.)',
      '30+ alvöru viðskiptavinamerki (Harpa, KSÍ, Stöð 2, Vodafone)',
      'Fjölbreytt safn í fullri upplausn (portrett, íþróttir, viðburðir)',
    ],
    weaknesses: [
      'Núverandi síða er byggð á Elementor-sniðmáti og myndirnar bera hana ekki',
      'Meta-lýsingin er hrúga af leitarorðum, ekki setning',
      'Engin skipulögð leið frá verki að bókun',
    ],
    opportunities: [
      'Láta safnið sjálft segja vinnudaginn: portrett að morgni, völlur um miðjan dag, brúðkaup í gullnu stundinni, svið um kvöld',
      'Verðskráin og merkjaveggurinn eru þegar til; þau þurfa bara umgjörð sem treystir þeim',
    ],
  },
  positioning:
    'Hulda Margrét ljósmyndar allt frá stjórnendaportrettum upp í landsleiki og brúðkaup. Vefurinn er byggður sem einn vinnudagur: birtan á síðunni fylgir sólinni frá morgunstúdíói að sviðsljósi kvöldsins, og hvert skref dagsins er raunverulegt verk af hennar eigin vef.',
  outreach: {
    subject: 'Hugmynd að nýjum vef fyrir ljósmyndastúdíóið',
    body:
      'Sæl Hulda,\n\nÉg heiti Sindri og hanna vefsíður. Ég rakst á vefinn þinn og sá að myndirnar þínar, verðskráin og viðskiptavinalistinn eru sterkari en umgjörðin sem heldur utan um þau.\n\nÉg setti saman frumgerð að nýjum vef þar sem birtan á síðunni fylgir einum vinnudegi hjá þér: portrett að morgni, völlurinn um miðjan dag, brúðkaup í gullnu stundinni og sviðið um kvöldið. Allt á síðunni eru þínar eigin myndir og þín eigin verð.\n\nÞetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.\n\nBestu kveðjur,\nSindri',
  },
}
