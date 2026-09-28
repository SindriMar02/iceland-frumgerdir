import type { PreviewCompany } from '../companies'

/**
 * TRÉBORG EHF. — treborg.is (kt. 640615-1170), Eldshöfði 4, 110 Reykjavík
 *
 * Every string below is Tréborg's own published copy (treborg.is, harvested
 * 2026-09-28, a Wix site last changed in December 2021), tidied for spelling,
 * or a fact they publish themselves. They publish no staff names, no prices,
 * no founding year and no client quotes, so this page has none of those
 * ([[client-copy-from-their-own-words]], [[feedback-never-manufacture-social-proof]]).
 * The partner names on the job pages (Sýrusson Hönnunarhús, HBH Byggir,
 * Fröken Fix, Sólóhúsgögn, Zenus) are their own captions, word for word.
 *
 * Photography: the ten pictures their "Verkefni" gallery shows, fetched as the
 * original uploads (phone photos up to 5184px), turned upright from their EXIF
 * orientation, stripped of metadata and saved as WebP at 640/960/1280/1920. `ion-nalaegt` is a crop of their own
 * Ion City Hotel picture. The backgrounds on treborg.is are Wix library stock
 * and are not used.
 */

const BASE = import.meta.env.BASE_URL

export interface Photo {
  src: string
  srcSet: string
  alt: string
  /** natural aspect, so the grid can reserve space and never shift */
  ratio: string
  portrait?: boolean
}

/* WebP at four widths (lag purge 2026-09-28): a phone at DPR 3 picks the 1280 file
   instead of a 1920 JPEG, about a fifth of the bytes */
const WIDTHS = [640, 960, 1280, 1920]
const P = (name: string, alt: string, w: number, h: number): Photo => ({
  src: `${BASE}treborg/${name}-1280.webp`,
  srcSet: WIDTHS.map((x) => `${BASE}treborg/${name}-${x}.webp ${x}w`).join(', '),
  alt,
  ratio: `${w} / ${h}`,
  portrait: h > w,
})

export const PHOTO = {
  canopy: P('canopy', 'Sjónvarpsskápur á hótelherbergi á Canopy Hotel, eikarskápar undir dökkri hillusamstæðu með myndum', 1920, 1440),
  sethringir: P('kringlan-sethringir', 'Hringlaga setur í Kringlunni, bólstraðar setur á eikarbotnum', 1920, 2560),
  bekkir: P('kringlan-bekkir', 'Bogadreginn bólstraður bekkur á göngugötu Kringlunnar', 1920, 2560),
  ion: P('ion', 'Skenkur á Ion City Hotel, hnotuframhliðar undir svartri borðplötu', 1920, 1440),
  ionNalaegt: P('ion-nalaegt', 'Hnotuframhliðar skenksins á Ion City Hotel, nærmynd', 1920, 1440),
  veitingastadir: P('veitingastadir', 'Bás á veitingastað, eikarklæddur með leðurbekkjum og borði', 1920, 1280),
  advania: P('advania', 'Langir bekkir og sexhyrndir kollar í bleiku og fjólubláu í anddyri Advania', 1920, 1440),
  skrifstofur: P('skrifstofur', 'Skrifstofa með rimlavegg úr hnotu og afgreiðsluborði', 1920, 2560),
  eldhus: P('eldhus', 'Sérsmíðað eldhús með löngu dökku borði og bólstruðum bekk við gluggann', 1920, 1197),
  bokahilla: P('bokahilla', 'Innfelld bókahilla með lýsingu og skáp undir, í gangi á heimili', 1920, 2560),
  fataskapur: P('fataskapur', 'Sérsmíðaður fataskápur úr hnotu upp í loft í svefnherbergi', 1920, 2560),
} satisfies Record<string, Photo>

export interface Verk {
  slug: string
  name: string
  flokkur: string
  /** only where it is certain, see the header note */
  stadur?: string
  /** one line, built only from what their own caption says about the job */
  lina: string
  /** the word the home page's banner uses inside a sentence ("eldhús") */
  stutt?: string
  cover: Photo
  gallery: Photo[]
}

/** All ten jobs their "Verkefni" gallery names. The first seven are the grid,
 *  commercial work first, in the order that suits the reference's rhythm (a
 *  wide opener, two portraits, then half widths); the three for homes are
 *  linked in the banner. */
export const VERK: Verk[] = [
  {
    slug: 'canopy-hotel',
    name: 'Canopy Hotel',
    flokkur: 'Hótel',
    stadur: 'Reykjavík',
    lina: 'Sjónvarpsskápar fyrir herbergi Canopy Hotel, unnir í samstarfi við HBH Byggi.',
    cover: PHOTO.canopy,
    gallery: [PHOTO.canopy],
  },
  {
    slug: 'kringlan-sethringir',
    name: 'Kringlan, sethringir',
    flokkur: 'Verslunarmiðstöð',
    stadur: 'Kringlan',
    lina: 'Sethringir á göngugötu Kringlunnar, unnir fyrir Sýrusson Hönnunarhús.',
    cover: PHOTO.sethringir,
    gallery: [PHOTO.sethringir],
  },
  {
    slug: 'kringlan-bekkir',
    name: 'Kringlan, bekkir',
    flokkur: 'Verslunarmiðstöð',
    stadur: 'Kringlan',
    lina: 'Bekkir á göngugötu Kringlunnar, unnir fyrir Sýrusson Hönnunarhús.',
    cover: PHOTO.bekkir,
    gallery: [PHOTO.bekkir],
  },
  {
    slug: 'ion-city-hotel',
    name: 'Ion City Hotel',
    flokkur: 'Hótel',
    stadur: 'Reykjavík',
    lina: 'Bar og skenkur fyrir Ion City Hotel, unnin í samstarfi við HBH Byggi.',
    cover: PHOTO.ion,
    gallery: [PHOTO.ion, PHOTO.ionNalaegt],
  },
  {
    slug: 'veitingastadir',
    name: 'Sérsmíði fyrir veitingastaði',
    flokkur: 'Veitingastaður',
    lina: 'Básar, borð og bekkir sérsmíðaðir fyrir veitingastaði.',
    cover: PHOTO.veitingastadir,
    gallery: [PHOTO.veitingastadir],
  },
  {
    slug: 'advania',
    name: 'Advania',
    flokkur: 'Skrifstofur',
    lina: 'Bekkir og sexhyrningar fyrir Advania, unnið í samstarfi við Fröken Fix, Sólóhúsgögn og Zenus.',
    cover: PHOTO.advania,
    gallery: [PHOTO.advania],
  },
  {
    slug: 'skrifstofur',
    name: 'Innréttingar á skrifstofur',
    flokkur: 'Skrifstofur',
    lina: 'Innréttingar á skrifstofur: rimlaveggur úr hnotu og afgreiðsluborð.',
    cover: PHOTO.skrifstofur,
    gallery: [PHOTO.skrifstofur],
  },
  {
    slug: 'eldhus',
    stutt: 'eldhús',
    name: 'Sérsmíðað eldhús',
    flokkur: 'Heimili',
    lina: 'Sérsmíðað eldhús með löngu borði og bólstruðum bekk við gluggann.',
    cover: PHOTO.eldhus,
    gallery: [PHOTO.eldhus],
  },
  {
    slug: 'bokahilla',
    stutt: 'bókahilla',
    name: 'Sérsmíðuð bókahilla',
    flokkur: 'Heimili',
    lina: 'Sérsmíðuð bókahilla, felld inn í vegg með lýsingu og skáp undir.',
    cover: PHOTO.bokahilla,
    gallery: [PHOTO.bokahilla],
  },
  {
    slug: 'fataskapur',
    stutt: 'fataskápur',
    name: 'Sérsmíðaður fataskápur',
    flokkur: 'Heimili',
    lina: 'Sérsmíðaður fataskápur fyrir einstakling, úr hnotu upp í loft.',
    cover: PHOTO.fataskapur,
    gallery: [PHOTO.fataskapur],
  },
]

export const VERK_GRID = VERK.slice(0, 7)
export const VERK_ONNUR = VERK.slice(7)

/** Their own service words, from the Þjónusta and Nolte pages. */
export const THJONUSTA: Array<{ titill: string; texti?: string }> = [
  {
    titill: 'Sérsmíði',
    texti: 'Sérsmíðum innréttingar, húsgögn, borðplötur, sólbekki og innihurðir fyrir fyrirtæki, stofnanir og einstaklinga.',
  },
  {
    titill: 'Húsgagnasmíði',
    texti: 'Framleiðum húsgögn og húsgagnaíhluti, og skiptir ekki hvort það er í litlu eða miklu magni.',
  },
  {
    titill: 'Viðgerðir',
    texti: 'Tökum að okkur hvers kyns viðgerðir á húsgögnum og innréttingum.',
  },
  {
    titill: 'Nolte innréttingar',
    texti: 'Gæðainnréttingar frá Nolte, framleiddar eftir pöntun. Tréborg sér um uppsetningu sé þess óskað.',
  },
  { titill: 'Borðplötur og sólbekkir' },
  { titill: 'Innihurðir' },
]

/** Their own sentences, for the slider (they publish no testimonials). */
export const MARKMID: string[] = [
  'Sérsmíðum innréttingar, húsgögn, borðplötur, sólbekki og innihurðir.',
  'Framleiðum húsgögn og húsgagnaíhluti, í litlu eða miklu magni.',
  'Vinnum fyrir marga af stærstu húsgagnaframleiðendum landsins.',
  'Fyrirtækið er vel tækjum búið og getur tekið að sér stór sem smá verkefni.',
  'Tökum að okkur hvers kyns viðgerðir á húsgögnum og innréttingum.',
]

/** The Nolte page, in three parts, their own words. */
export const NOLTE: Array<{ titill: string; texti: string }> = [
  {
    titill: 'Framleiddar eftir pöntun',
    texti: 'Allar innréttingarnar eru framleiddar eftir pöntun og fær því hver viðskiptavinur sínar innréttingar eins og hann vill.',
  },
  {
    titill: 'Koma samsettar',
    texti: 'Innréttingarnar koma samsettar og því sparast mikill tími við uppsetningu. Tréborg getur að sjálfsögðu séð um uppsetninguna sé þess óskað.',
  },
  {
    titill: 'Afgreiðslutími',
    texti: 'Afgreiðslutími hjá Nolte er um það bil sex til átta vikur.',
  },
]

export const TEXTI = {
  tagline: 'Sérsmíði og húsgagnasmíði',
  heroLabel: 'Trésmiðja á Eldshöfða í Reykjavík',
  inngangur:
    'Tréborg sérsmíðar innréttingar, húsgögn, borðplötur, sólbekki og innihurðir fyrir fyrirtæki, stofnanir og einstaklinga.',
  um:
    'Tréborg hefur vaxið jafnt og þétt frá stofnun og vinnur nú fyrir marga af stærstu húsgagnaframleiðendum landsins.',
  starfsmenn:
    'Tréborg var upprunalega stofnað til að framleiða húsgagnaíhluti og borðplötur fyrir Sólóhúsgögn ehf. Í dag tekur fyrirtækið auk þess að sér ýmis verkefni fyrir fyrirtæki, einstaklinga og stofnanir.',
  thjonusta:
    'Tréborg sérsmíðar innréttingar og húsgögn, framleiðir húsgagnaíhluti í litlu eða miklu magni og tekur að sér hvers kyns viðgerðir á húsgögnum og innréttingum.',
  verkH2: 'Nokkur verkefni hjá okkur.',
  verkefniIntro:
    'Hótel, skrifstofur, veitingastaðir og verslunarmiðstöð, og sérsmíði fyrir heimili. Sum verkin voru unnin í samstarfi við hönnuði og aðra verktaka. Hvert verk á sína eigin síðu.',
  nolte: 'Tréborg býður upp á gæðainnréttingar frá Nolte, einum stærsta innréttingaframleiðanda í Evrópu.',
  metnadur: 'Fyrirtækið er vel tækjum búið og getur tekið að sér stór sem smá verkefni.',
  tilbod: 'Opið virka daga frá 8 til 16. Hringdu eða sendu okkur línu.',
}

export const CONTACT = {
  simi: '553 3330',
  simiHref: 'tel:+3545533330',
  gsm: '617 3330',
  gsmHref: 'tel:+3546173330',
  netfang: 'treborg@treborg.is',
  kennitala: '640615-1170',
  heimilisfang: 'Eldshöfði 4',
  stadur: '110 Reykjavík',
  opid: 'Mán. til fös. 8 til 16',
}

export const PHOTO_CREDIT =
  'Ljósmyndir eru af vef Tréborgar (treborg.is), sóttar í september 2026.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Tréborg ehf.',
  url: 'https://www.treborg.is',
  email: CONTACT.netfang,
  telephone: '+354 553 3330',
  taxID: CONTACT.kennitala,
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.heimilisfang,
    postalCode: '110',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  openingHours: 'Mo-Fr 08:00-16:00',
  areaServed: 'Ísland',
  description: TEXTI.inngangur,
}

export const companyEntry: PreviewCompany = {
  slug: 'treborg',
  route: '/preview/treborg',
  name: 'Tréborg ehf.',
  sector: 'Sérsmíði og húsgagnasmíði',
  location: 'Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Trésmiðja á Eldshöfða 4',
  currentUrl: 'https://www.treborg.is',
  ownerEmail: 'treborg@treborg.is',
  concept: 'Sérsmíði og húsgagnasmíði',
  conceptTagline:
    'Canopy Hotel, Ion City Hotel, Kringlan og Advania. Vefurinn sýnir hvert verk á sinni eigin síðu, með nafni, samstarfsaðilum og myndum.',
  accent: '#6A4A30',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}treborg/canopy-960.webp`,
  ownPhotography: true,
  photoCredit: PHOTO_CREDIT,
  audit: {
    strengths: [
      'Nafngreind verk sem fólk þekkir: Canopy Hotel, Ion City Hotel, Kringlan og Advania',
      'Skýr þjónusta í þeirra eigin orðum: sérsmíði, húsgagnasmíði, viðgerðir og Nolte innréttingar',
      'Opnunartími, heimilisfang og tvö símanúmer eru öll á vefnum',
    ],
    weaknesses: [
      'Vefnum hefur ekki verið breytt síðan í desember 2021 (vefkort og fótur „© 2021“)',
      'Fyrsti skjár í síma er óskýr himinn og merkið, ekkert orð um hvað fyrirtækið gerir',
      'Verkin eru myndatextar í myndasafni, ekkert verk á sína eigin síðu sem leitarvélar geta fundið',
    ],
    opportunities: [
      'Hvert verk fær sína eigin síðu með nafni, stað og samstarfsaðilum',
      'Nolte innréttingar fá skýran kafla með afgreiðslutíma og uppsetningu',
    ],
  },
  positioning:
    'Tréborg sérsmíðar innréttingar og húsgögn fyrir hótel, skrifstofur, veitingastaði og heimili og framleiðir húsgagnaíhluti fyrir stærstu húsgagnaframleiðendur landsins. Frumgerðin byggir á verkunum sjálfum, hvert á sinni síðu.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Tréborg',
    body:
      'Góðan dag,\n\nÉg heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.\n\nÉg rakst á treborg.is og verkalistinn stoppaði mig. Canopy Hotel, Ion City Hotel, bekkirnir og sethringirnir í Kringlunni og anddyrið hjá Advania, allt staðir sem fólk þekkir en fæstir vita hver smíðaði. Vefurinn gerir þeim samt ekki góð skil. Honum hefur ekki verið breytt síðan 2021, í síma er fyrsti skjárinn óskýr himinn og merkið án orðs um hvað Tréborg gerir, og verkin eru myndatextar í myndasafni þar sem ekkert þeirra á sína eigin síðu. Sá sem leitar að smiði sem hefur unnið fyrir hótel finnur því hvorki Canopy né Ion hjá ykkur.\n\nMér fannst það synd, svo ég settist niður og hannaði frumgerð að nýjum vef fyrir Tréborg. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.\n\nHana má skoða hér hvenær sem er, og hún virkar vel í síma:\n[HLEKKUR Á FRUMGERÐ]\n\nHugmyndin er einföld. Hvert verk fær sína eigin síðu með nafni, samstarfsaðilum og myndum, Nolte innréttingarnar fá sinn eigin kafla og allur textinn er ykkar eigin. Hún er hönnuð fyrir símann fyrst, því þar skoðar fólk vefi mest í dag, og virkar eins vel á tölvu.\n\nÉg sé líka um hýsingu, viðhald og uppfærslur á síðum sem ég geri, ef það er eitthvað sem þið hafið áhuga á.\n\nEf ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þið hafið gaman af því að skoða hugmyndina.\n\nEndilega látið mig vita hvað ykkur finnst.\n\nBestu kveðjur,\nSindri Már\n845-1758\nsndrstudio.is',
  },
}
