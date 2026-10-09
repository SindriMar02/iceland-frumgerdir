import type { PreviewCompany } from '../companies'
import { SIZE } from './photos.gen'

/**
 * STEINGARÐUR EHF. — steingardur.is
 *
 * Every fact below is one Steingarður publishes on its own site (forsíða and
 * starfsmenn, harvested 2026-10-09 to _docs/steingardur-harvest-2026-10-09/):
 * the service list, the equipment list word for word, the finished-work list,
 * the eight client logos, the thirteen names on the staff page, the address,
 * phone and email. They publish no prices, so this page has none. Where the
 * live site contradicts itself (Steingarður / Steinagarður, a second phone
 * number on the JCB's livery) it is noted in the build log, not guessed.
 *
 * Photography: every picture is from their own gallery or page sections, at the
 * largest size their Wix library serves, EXIF and GPS stripped. Captions only
 * name a place or a person where their own file name does.
 */

const BASE = import.meta.env.BASE_URL

export interface Photo {
  src: string
  srcSet: string
  alt: string
  ratio: string
  portrait?: boolean
}

const P = (id: string, alt: string): Photo => {
  const [w, h] = SIZE[id] ?? [1920, 1280]
  return {
    src: `${BASE}steingardur/${id}-1920.jpg`,
    srcSet: w > 960 ? `${BASE}steingardur/${id}-960.jpg 960w, ${BASE}steingardur/${id}-1920.jpg ${w}w` : `${BASE}steingardur/${id}-1920.jpg ${w}w`,
    alt,
    ratio: `${w} / ${h}`,
    portrait: h > w,
  }
}

export const CONTACT = {
  simi: '895 5758',
  simiHref: 'tel:+3548955758',
  netfang: 'steingardur@steingardur.is',
  heimilisfang: 'Dofrahella 1',
  postnumer: '221 Hafnarfjörður',
  facebook: 'https://www.facebook.com/Steingardur',
}

export const PHOTO = {
  beltagrafa: P('beltagrafa', 'Hyundai beltagrafa og appelsínugul smágrafa grafa langan skurð meðfram íbúðagötu, girðing og fjölbýlishús í baksýn'),
  hitachiGata: P('hitachi-gata', 'Appelsínugul Hitachi hjólagrafa og vörubíll að störfum í íbúðagötu'),
  hitachiGardur: P('hitachi-gardur', 'Appelsínugul Hitachi hjólagrafa grefur í garði við timburhús'),
  hitachiVegur: P('hitachi-vegur', 'Hitachi hjólagrafa grefur skurð í vegkanti meðfram trjágöngum'),
  hitachiTurn: P('hitachi-turn', 'Hitachi hjólagrafa með merki Steingarðs á opnu svæði, vatnstankur í baksýn'),
  miniKef: P('mini-kef', 'Smágrafa og starfsmaður í endurskinsfatnaði við skurð í gangstétt, keilur á götunni'),
  kobelcoKefli: P('kobelco-kefli', 'Kobelco smágrafa við stórt kefli af appelsínugulum ljósleiðararörum á opnu svæði'),
  kobelcoGras: P('kobelco-gras', 'Kobelco smágrafa grefur í grasflöt, rafmagnsskápur í forgrunni'),
  kobelcoMalbik: P('kobelco-malbik', 'Ný Kobelco smágrafa merkt Steingarði á malbikuðu athafnasvæði'),
  heklureitur: P('heklureitur', 'Gul hjólagrafa í djúpum grunni á Heklureit, klapparveggur og skrifstofuhús ofan við'),
  bogdanRunar: P('bogdan-runar', 'Bogdan og Rúnar brosa í hjálmum og endurskinsfatnaði á Heklureit'),
  heklureiturTveir: P('heklureitur-tveir', 'Tveir starfsmenn í endurskinsfatnaði standa í grunni við háan klapparvegg'),
  heklureiturLagnir: P('heklureitur-lagnir', 'Starfsmenn leggja lagnir í skurð á byggingarsvæði, byggingarkrani í baksýn'),
  kopavogur: P('kopavogur', 'Bogdan og Krystian að störfum við hús í Kópavogi, hellur og grjót við skurðinn'),
  fleygunKomatsu: P('fleygun-komatsu', 'Gul Komatsu beltagrafa með fleyg brýtur klöpp við götu'),
  fleygunHjolagrafa: P('fleygun-hjolagrafa', 'Gul hjólagrafa við djúpa holu og appelsínugulan brunn við Hraunhóla'),
  nautholsvegur: P('nautholsvegur', 'Fleygaður skurður með ræsi og grjóti við Nauthólsveg'),
  jcbMerkt: P('jcb-merkt', 'Starfsmaður stígur upp í gula JCB gröfu með merki Steingarðs á hliðinni'),
  jcbHjol: P('jcb-hjol', 'Gul JCB hjólagrafa með efnisflutningavagn á malbikuðu plani'),
  snjoGata: P('snjo-gata', 'Hjólaskófla með snjótönn mokar götu í ljósaskiptunum'),
  snjoNott: P('snjo-nott', 'Hjólaskófla með snjótönn að næturlagi í íbúðahverfi'),
  snjoTvaer: P('snjo-tvaer', 'Tvær hjólaskóflur með appelsínugulum snjótönnum í snjó'),
  snjoJcb: P('snjo-jcb', 'JCB skotbómulyftari með snjótönn við atvinnuhús í snjó'),
  snjoKlefi: P('snjo-klefi', 'Útsýni úr stýrishúsi hjólaskóflu yfir snævi þakið svæði í morgunsól'),
  ljosAkur: P('ljos-akur', 'Tveir starfsmenn í endurskinsfatnaði grafa fyrir ljósleiðara á opnu svæði'),
  ljosSkurdur: P('ljos-skurdur', 'Mjór skurður með appelsínugulu ljósleiðararöri í gegnum grasflöt'),
  ljosKefli: P('ljos-kefli', 'Kefli af appelsínugulum rörum við göngustíg í kvöldsól'),
  ljosSkapur: P('ljos-skapur', 'Tengikassar með ljósleiðararörum í opinni gryfju'),
  ljosGata: P('ljos-gata', 'Starfsmenn leggja ljósleiðara í skurð meðfram gangstétt, keilur á götunni'),
  ljosSplaes: P('ljos-splaes', 'Starfsmaður í endurskinsfatnaði vinnur við strengi í skurði'),
  scania: P('scania', 'Hvítur fjögurra öxla Scania vörubíll merktur Steingarði'),
  scaniaVagn: P('scania-vagn', 'Scania vörubíll með vagn sem flytur gröfu'),
  hopur: P('hopur', 'Starfsfólk Steingarðs í appelsínugulum göllum stillir sér upp í fjalllendi, buggy-bílar til beggja hliða'),
  hitaveita: P('hitaveita', 'Svört og blá hitaveiturör lögð í opinn skurð'),
  skoli: P('skoli', 'Smágrafa og starfsmenn við jarðvinnu framan við skólabyggingu'),
  dofrahella: P('dofrahella', 'Tölvuteikning af atvinnuhúsunum við Dofrahellu í Hafnarfirði'),
  lagnirRokkur: P('lagnir-rokkur', 'Gröfur og rör á vinnusvæði í ljósaskiptunum'),
  miniDusk: P('mini-dusk', 'Smágrafa að störfum undir bleikum kvöldhimni'),
  gatnagerd: P('gatnagerd', 'Ný lögn í opnum skurði meðfram götu, keilur og borði við skurðinn'),
  stett: P('stett', 'Sagaður skurður í gangstétt með lögnum og strengjum'),
} as const

export const LOGO = `${BASE}steingardur/logo.png`

export const TEXTI = {
  tagline: 'Jarðvinna, heimlagnir og ljósleiðari',
  heroLabel: 'Jarðvegsverktakar síðan 2006',
  inngangur:
    'Fyrirtækið var stofnað árið 2006 og er sérhæft í jarðvinnu og hefur verið leiðandi í lagningu ljósleiðara á landinu auk þjónustu við heimlagnir á höfuðborgarsvæðinu.',
  umH2: 'Sérhæfð í jarðvinnu, leiðandi í lagningu ljósleiðara.',
  thjonustaIntro:
    'Lóðagerð, heimtaugalagnir, þ.e. hitaveita, kalt vatn, fráveita, rafmagn og ljósleiðari. Gatnagerð, gangstétta og stígagerð. Snjómokstur.',
  verkH2: 'Unnin verk',
  verkIntro: 'Nokkur verk úr myndasafni Steingarðs, frá grunnum og fleygun til lagna í íbúðagötum.',
  ljosH2: 'Leiðandi í lagningu ljósleiðara á landinu.',
  tackH2: 'Tæki fyrir hvert verk, frá 3,3 tonnum upp í 33.',
  tackIntro: 'Allur tækjakosturinn eins og Steingarður birtir hann. Veldu tækin sem þú vilt fá og þau fara beint í verkbeiðnina.',
  beidniH2: 'Settu saman verkið og fáðu tilboð.',
  beidniIntro: 'Segðu hvað á að gera, hvar og hvenær. Beiðnin fer til verkstjóra með öllu sem þarf til að gefa tilboð.',
  snjoH2: 'Snjómokstur þegar á þarf að halda.',
  snjoIntro: 'Hjólaskóflur Steingarðs eru á götunum þegar snjóar. Biddu um stakan mokstur eða samning fyrir veturinn.',
  folkH2: 'Fólkið á bak við verkin.',
  folkIntro: 'Rúnar og Páll stýra verkunum. Með þeim vinnur hópur sem þekkir gröfuna, skurðinn og lagnirnar.',
  tilbodH2: 'Hafðu samband og fáðu tilboð.',
  tilbodIntro: 'Sendu verkbeiðnina eða hringdu beint. Steingarður ehf, Dofrahellu 1, 221 Hafnarfjörður.',
}

export const STADREYNDIR = [
  { tala: '2006', texti: 'stofnað' },
  { tala: '12', texti: 'vinnuvélar auk vörubíls' },
  { tala: '13', texti: 'starfsmenn' },
  { tala: '2020–25', texti: 'Framúrskarandi fyrirtæki' },
] as const

/* the four services, in their own order and words */
export const LEIDIR = [
  { id: 'lodagerd', titill: 'Lóðagerð', texti: 'Gröftur, fleygun, fyllingar og frágangur lóða.', photo: PHOTO.hitachiGardur, verk: 'lodagerd' },
  { id: 'heimlagnir', titill: 'Heimtaugalagnir', texti: 'Hitaveita, kalt vatn, fráveita, rafmagn og ljósleiðari.', photo: PHOTO.miniKef, verk: 'heimlagnir' },
  { id: 'gatnagerd', titill: 'Gatnagerð og stígar', texti: 'Gatnagerð, gangstétta og stígagerð, viðhald og endurnýjun.', photo: PHOTO.gatnagerd, verk: 'gatnagerd' },
  { id: 'snjomokstur', titill: 'Snjómokstur', texti: 'Hjólaskóflur á götum, plönum og stéttum yfir veturinn.', photo: PHOTO.snjoGata, verk: 'snjomokstur' },
] as const

/* project cards: names from their own file names, cleaned */
export interface Verk { slug: string; name: string; flokkur: string; stadur?: string; cover: Photo }
export const VERK: Verk[] = [
  { slug: 'heklureitur', name: 'Heklureitur', flokkur: 'Jarðvinna', stadur: 'Reykjavík', cover: PHOTO.heklureitur },
  { slug: 'nautholsvegur', name: 'Fleygun við Nauthólsveg', flokkur: 'Fleygun', stadur: 'Reykjavík', cover: PHOTO.nautholsvegur },
  { slug: 'hraunholar', name: 'Fleygun við Hraunhóla', flokkur: 'Fleygun', cover: PHOTO.fleygunHjolagrafa },
  { slug: 'kopavogur', name: 'Bogdan og Krystian í Kópavogi', flokkur: 'Lagnir', stadur: 'Kópavogur', cover: PHOTO.kopavogur },
  { slug: 'snjomokstur-2023', name: 'Snjómokstur í janúar 2023', flokkur: 'Snjómokstur', cover: PHOTO.snjoGata },
  { slug: 'hitaveita', name: 'Hitaveitulögn', flokkur: 'Lagnir', cover: PHOTO.hitaveita },
  { slug: 'fleygun', name: 'Fleygun með beltagröfu', flokkur: 'Fleygun', cover: PHOTO.fleygunKomatsu },
]

/* "UNNIN VERK", word for word */
export const UNNIN_VERK = [
  { titill: 'Lagning ljósleiðara', stadir: 'Reykjavík, Hafnarfirði, Garðabæ, Mosfellsbæ, Borgarnesi, Hvanneyri, Selfossi, Árborg, Reykjanesbæ, Ásbrú, Höfnum, Grindavík og Vogum' },
  { titill: 'Viðhald og endurnýjun háspennulagna', stadir: 'Reykjavík, Kópavogi og Garðabæ' },
  { titill: 'Viðhald og endurnýjun vatnslagna', stadir: 'Reykjavík, Kópavogi og Garðabæ' },
  { titill: 'Viðhald og endurnýjun gatna og göngustíga', stadir: 'Reykjavík, Kópavogi og Garðabæ' },
] as const

export const LJOS_STADIR = ['Reykjavík', 'Hafnarfjörður', 'Garðabær', 'Mosfellsbær', 'Borgarnes', 'Hvanneyri', 'Selfoss', 'Árborg', 'Reykjanesbær', 'Ásbrú', 'Hafnir', 'Grindavík', 'Vogar'] as const

export const VIDSKIPTAVINIR = [
  { nafn: 'Veitur', logo: `${BASE}steingardur/vidsk/veitur.png` },
  { nafn: 'Ljósleiðarinn', logo: `${BASE}steingardur/vidsk/ljosleidarinn.png` },
  { nafn: 'Míla', logo: `${BASE}steingardur/vidsk/mila.png` },
  { nafn: 'Orkuveita Reykjavíkur', logo: `${BASE}steingardur/vidsk/or.png` },
  { nafn: 'Reykjavíkurborg', logo: `${BASE}steingardur/vidsk/reykjavik.png` },
  { nafn: 'Kópavogsbær', logo: `${BASE}steingardur/vidsk/kopavogur.png` },
  { nafn: 'Garðabær', logo: `${BASE}steingardur/vidsk/gardabaer.png` },
  { nafn: 'Mosfellsbær', logo: `${BASE}steingardur/vidsk/mosfellsbaer.png` },
] as const

/* "TÆKJAKOSTUR", word for word, one entry per line on their page */
export type TaekiId = 'belta33' | 'hjolJcb' | 'hjolHitachi' | 'belta5' | 'mini' | 'skofla' | 'scania' | 'sog' | 'fraesari' | 'thjappa'
export interface Taeki { id: TaekiId; flokkur: string; lina: string; fjoldi: string; photo?: Photo }
export const TAEKI: Taeki[] = [
  { id: 'belta33', flokkur: 'Beltagröfur', lina: 'Beltagrafa, 33 tonn, Hyundai.', fjoldi: '1 stk.', photo: PHOTO.beltagrafa },
  { id: 'belta5', flokkur: 'Beltagröfur', lina: 'Beltagrafa, 5 tonn, Kobelco.', fjoldi: '1 stk.', photo: PHOTO.kobelcoGras },
  { id: 'mini', flokkur: 'Beltagröfur', lina: 'Beltagröfur, 5 stk, 3,3 tonn. Hitachi og Kobelco.', fjoldi: '5 stk.', photo: PHOTO.kobelcoMalbik },
  { id: 'hjolJcb', flokkur: 'Hjólagröfur', lina: 'Hjólagrafa, 17 tonn, JCB ásamt efnisflutningavagni.', fjoldi: '1 stk.', photo: PHOTO.jcbHjol },
  { id: 'hjolHitachi', flokkur: 'Hjólagröfur', lina: 'Hjólagrafa, 17 tonn, Hitachi.', fjoldi: '1 stk.', photo: PHOTO.hitachiVegur },
  { id: 'skofla', flokkur: 'Hjólaskóflur', lina: 'Hjólaskóflur 3 stk, 5,5 til 6,5 tonn. Liebherr og JCB.', fjoldi: '3 stk.', photo: PHOTO.snjoTvaer },
  { id: 'scania', flokkur: 'Vörubíll', lina: 'Vörubíll, 4 öxla með krókheysisbúnaði, Scania.', fjoldi: '1 stk.', photo: PHOTO.scania },
  { id: 'sog', flokkur: 'Sagir og smærri tæki', lina: 'Malbiks- og steinsagir, tveggja blaða vatnskældar, 3 stk.', fjoldi: '3 stk.' },
  { id: 'fraesari', flokkur: 'Sagir og smærri tæki', lina: 'Fræsarar og handsagir fyrir malbik og stein.', fjoldi: '' },
  { id: 'thjappa', flokkur: 'Sagir og smærri tæki', lina: 'Jarðvegsþjöppur og torfskurðarvélar.', fjoldi: '' },
]
export const TAEKI_STUTT: Record<TaekiId, string> = {
  belta33: 'Beltagrafa 33 t',
  belta5: 'Beltagrafa 5 t',
  mini: 'Smágrafa 3,3 t',
  hjolJcb: 'Hjólagrafa 17 t, JCB, með vagni',
  hjolHitachi: 'Hjólagrafa 17 t, Hitachi',
  skofla: 'Hjólaskófla',
  scania: 'Vörubíll með krókheysi',
  sog: 'Malbiks- og steinsög',
  fraesari: 'Fræsari og handsög',
  thjappa: 'Jarðvegsþjappa',
}

/* the job builder: what can be asked for, and which machines usually go with it.
   A suggestion only; the foreman decides. */
export type VerkId = 'lodagerd' | 'heimlagnir' | 'gatnagerd' | 'snjomokstur' | 'fleygun' | 'sogun'
export const VERKTEGUNDIR: { id: VerkId; nafn: string; taeki: TaekiId[] }[] = [
  { id: 'heimlagnir', nafn: 'Heimtaug', taeki: ['mini', 'scania', 'thjappa'] },
  { id: 'lodagerd', nafn: 'Lóðagerð', taeki: ['hjolHitachi', 'skofla', 'scania', 'thjappa'] },
  { id: 'gatnagerd', nafn: 'Gatnagerð, stétt eða stígur', taeki: ['hjolJcb', 'sog', 'thjappa', 'scania'] },
  { id: 'fleygun', nafn: 'Fleygun', taeki: ['belta33', 'scania'] },
  { id: 'sogun', nafn: 'Sögun malbiks eða steins', taeki: ['sog', 'fraesari'] },
  { id: 'snjomokstur', nafn: 'Snjómokstur', taeki: ['skofla'] },
]
export const LAGNIR = ['Hitaveita', 'Kalt vatn', 'Fráveita', 'Rafmagn', 'Ljósleiðari'] as const
export const VERKKAUPAR = ['Einstaklingur eða húsfélag', 'Fyrirtæki eða verktaki', 'Sveitarfélag eða veita'] as const
export const SVEITARFELOG = ['Reykjavík', 'Hafnarfjörður', 'Kópavogur', 'Garðabær', 'Mosfellsbær', 'Reykjanesbær', 'Árborg', 'Annað'] as const
export const HVENAER = ['Sem fyrst', 'Innan mánaðar', 'Seinna, vantar tilboð'] as const
export const SNJO_SVAEDI = ['Bílaplan', 'Gata eða innkeyrsla', 'Gangstétt eða stígur'] as const
export const SNJO_TEGUND = ['Samningur fyrir veturinn', 'Stakur mokstur'] as const

/* the staff page, in its own order */
export const STJORN = [
  { nafn: 'Rúnar Andrew Jónsson', starf: 'Rekstrarstjóri', fornafn: 'Rúnari', thgf: 'Rúnars Andrews Jónssonar' },
  { nafn: 'Páll Bragason', starf: 'Verkstjóri', fornafn: 'Páli', thgf: 'Páls Bragasonar' },
] as const
export const STARFSMENN = [
  'Andrej Dzujka', 'Bartosz Dzienis', 'Bogdan Dzienis', 'Daniils Pipins', 'Krystian Swiecicki', 'Mareks Prokofjevs',
  'Mateusz Hawrylewics', 'Michal Dzujka', 'Michal Krzyzanowski', 'Pawel Jastrzebski', 'Romas Gercevicius',
] as const

export const MARKMID = [
  'Fyrirtækið var stofnað árið 2006 og er sérhæft í jarðvinnu.',
  'Leiðandi í lagningu ljósleiðara á landinu.',
  'Þjónusta við heimlagnir á höfuðborgarsvæðinu.',
  'Framúrskarandi fyrirtæki hjá Creditinfo sex ár í röð, 2020 til 2025.',
]

export const BADGE = {
  framurskarandi: `${BASE}steingardur/framurskarandi.png`,
  vidurkenning: `${BASE}steingardur/vidurkenning-2024.png`,
}

export const PHOTO_CREDIT =
  'Ljósmyndir og upplýsingar eru af vef Steingarðs (steingardur.is), sóttar í október 2026.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'Steingarður ehf.',
  url: 'https://www.steingardur.is',
  email: CONTACT.netfang,
  telephone: '+354 895 5758',
  foundingDate: '2006',
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.heimilisfang,
    postalCode: '221',
    addressLocality: 'Hafnarfjörður',
    addressCountry: 'IS',
  },
  areaServed: 'Ísland',
  sameAs: [CONTACT.facebook],
  description: TEXTI.inngangur,
}

export const companyEntry: PreviewCompany = {
  slug: 'steingardur',
  route: '/preview/steingardur',
  name: 'Steingarður ehf.',
  sector: 'Jarðvinna, heimlagnir, ljósleiðari og snjómokstur',
  location: 'Hafnarfjörður',
  region: 'Höfuðborgarsvæðið',
  established: 'Stofnað 2006',
  currentUrl: 'https://www.steingardur.is',
  ownerEmail: 'steingardur@steingardur.is',
  concept: 'Jarðvinna, heimlagnir og ljósleiðari',
  conceptTagline:
    'Verkið sett saman á vefnum, með verktegund, stað, tímasetningu og tækjum úr tækjakosti Steingarðs, svo verkstjórinn fái beiðni sem hægt er að gefa tilboð í strax.',
  accent: '#2E7D35',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}steingardur/beltagrafa-960.jpg`,
  ownPhotography: true,
  photoCredit: PHOTO_CREDIT,
  audit: {
    strengths: [
      'Framúrskarandi fyrirtæki hjá Creditinfo sex ár í röð, 2020 til 2025',
      'Viðskiptavinir eins og Veitur, Ljósleiðarinn, Míla, OR og fjögur sveitarfélög',
      'Yfir 70 eigin ljósmyndir af tækjum, fólki og verkum, flest merkt Steingarði',
    ],
    weaknesses: [
      'Allar 72 myndirnar af tækjum og verkum sitja í einum litlum myndaglugga (um 320 × 210 punktar á tölvuskjá) þar sem ein mynd sést í einu',
      'Neðst á síðunni stendur „©2019 by Steingarður ehf.“',
      'Fyrirspurnarformið spyr aðeins um nafn, netfang, síma, heimilisfang og skilaboð, ekki um tegund verks, stað eða tíma',
      'Allt er á einni síðu, þjónusta, tækjakostur og verk í löngum textalistum',
    ],
    opportunities: [
      'Verkbeiðni sem setur saman verktegund, lagnir, sveitarfélag, tímasetningu og tæki',
      'Tækjakosturinn sem vörulisti, þar sem hvert tæki fer beint í beiðnina',
      'Snjómoksturssamningar fyrir veturinn beðnir um á vefnum',
    ],
  },
  positioning:
    'Steingarður er jarðvegsverktaki í Hafnarfirði, stofnaður 2006, sérhæfður í jarðvinnu og leiðandi í lagningu ljósleiðara. Frumgerðin byggir á eigin myndum, tækjalista og verkum fyrirtækisins og breytir beiðni um tilboð í verkbeiðni sem verkstjóri getur svarað strax.',
  /* DRAFT, not sent: Sindri reviews and sends himself */
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Steingarð',
    body:
      'Sæll Rúnar,\n\nÉg heiti Sindri Már og ég rek sndrstudio.is þar sem ég hanna og smíða nútímalegar, stílhreinar vefsíður, bókunarkerfi og netverslanir fyrir íslensk fyrirtæki.\n\nMarkmiðið er að búa til veflausnir sem endurspegla fyrirtækið, einfalda daglegan rekstur og spara tíma. Ég sé jafnframt um hýsingu, viðhald og reglulegar uppfærslur, svo vefurinn haldist hraður, öruggur og í takt við þær miklu tæknibreytingar sem eiga sér stað.\n\nÉg rakst á Steingarð á lista Creditinfo yfir framúrskarandi fyrirtæki og myndirnar ykkar sýna vel af hverju, allt frá Hyundai beltagröfunni í skurðinum til ljósleiðarakeflanna og snjómokstursins á nóttunni. Vefurinn sýnir það hins vegar ekki nógu vel. Allar 72 myndirnar sitja í litlum glugga þar sem ein sést í einu, og neðst stendur ©2019.\n\nÉg setti því saman frumgerð að nýjum vef úr ykkar eigin myndum, tækjalista og verkum. Þjónustan, ljósleiðarinn, tækjakosturinn og starfsfólkið fá hvert sinn stað, og verkbeiðni tekur við tegund verks, lögnum, stað, tíma og tækjum úr tækjakostinum ykkar í einni beiðni sem berst ykkur tilbúin til að gefa tilboð. Hana má skoða hér hvenær sem er, og hún virkar vel í síma:\n\n[HLEKKUR Á FRUMGERÐ]\n\nÞessi frumgerð kostar ykkur ekki neitt og því fylgir engin skuldbinding. Endilega látið mig vita ef þið hafið áhuga, en ef ekki er það að sjálfsögðu allt í lagi.\n\nBestu kveðjur,\nSindri Már\n845 1758\nsndrstudio.is',
  },
}
