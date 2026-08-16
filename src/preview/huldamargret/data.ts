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
  concept: 'Verkin sjálf',
  conceptTagline:
    'Safnið hennar ber síðuna: stjórnendaportrett, brúðkaup, íþróttir og viðburðir, með raunverulegri verðskrá og merkjum þeirra sem hringja aftur.',
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
      'Láta safnið sjálft bera síðuna: portrett, íþróttir, fermingar, brúðkaup og viðburðir, hvert með sínum kafla',
      'Verðskráin og merkjaveggurinn eru þegar til; þau þurfa bara umgjörð sem treystir þeim',
    ],
  },
  positioning:
    'Hulda Margrét ljósmyndar allt frá stjórnendaportrettum upp í landsleiki og brúðkaup. Vefurinn er byggður utan um safnið sjálft: hver tegund verks fær sinn kafla, verðskráin er hennar eigin og merkjaveggurinn sýnir hverjir hringja aftur.',
  /* Observation paragraph re-measured on huldamargret.is 2026-08-16: images are
     stored at 2001px and painted at 241px, and the meta description AIOSEO
     serves Google is a keyword list, not a sentence. */
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Huldu Margréti',
    body:
      'Sæl Hulda,\n\n' +
      'Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki. Ég rakst á vefinn þinn og staldraði við safnið: stjórnendaportrett, íþróttir, brúðkaup og viðburðir, og merki þeirra sem hringja aftur, Harpa, KSÍ, Stöð 2 og Vodafone. Það er sterkari listi en flestir ljósmyndarar hér geta sýnt.\n\n' +
      'Eitt rakst ég þó á. Myndirnar þínar liggja á vefnum í rúmlega 2000 pixla breidd en birtast gestum í mesta lagi 241 pixla breiðar, og línan sem Google birtir undir nafninu þínu er listi af leitarorðum frekar en setning. Sniðmátið heldur myndunum minni en þær eru.\n\n' +
      'Ég setti saman frumgerð að nýjum vef þar sem safnið sjálft ber síðuna: portrett, íþróttir, fermingar, brúðkaup og viðburðir, hvert með sínum kafla, ásamt verðskránni þinni og merkjaveggnum. Allar myndir á síðunni eru þínar eigin, sóttar í fullri upplausn.\n\n' +
      'Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.\n\n' +
      'Hana má skoða hér hvenær sem er, og hún virkar vel í síma:\n[HLEKKUR Á FRUMGERÐ]\n\n' +
      'Ef þér líst á er ég til í að heyra frá þér, en ef ekki er það að sjálfsögðu allt í lagi.\n\n' +
      'Bestu kveðjur,\nSindri Már\n845 1758\nsndr-studio.pages.dev',
  },
}
