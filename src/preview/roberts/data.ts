import type { PreviewCompany } from '../companies'

/**
 * TRÉSMÍÐI RÓBERTS EHF. — tresmidiroberts.is (kt. 621205-0990)
 *
 * Every string below is Róberts' own published copy (tresmidiroberts.is,
 * harvested 2026-09-21, a Shopify store template launched May 2025), lightly
 * tidied for spelling and with the dashes taken out, or a fact they publish
 * themselves. They publish no prices, no opening hours, no street address and
 * no client quotes, so this page has none of those
 * ([[client-copy-from-their-own-words]], [[feedback-never-manufacture-social-proof]]).
 *
 * Photography: every picture is one their own "Verkin okkar" page shows, at
 * the highest resolution it serves. Several are not theirs to credit as
 * their own, and the file names say so, so PHOTO_CREDIT names the
 * photographers: Mikael Lundblad (Enska húsið, Þjóðleikhúsið), Mikael Axelsson
 * (Pablo Discobar) and salir.is (Risið, watermarked). Widths are the real
 * served widths, not 1920 for everything, so srcset never claims pixels the
 * file does not have ([[srcset-descriptor-lies]]).
 *
 * Places: a town is shown only where their own page, a file name they
 * uploaded, or the venue itself fixes it beyond doubt. The rest carry the
 * kind of job only.
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

const P = (name: string, alt: string, w: number, h: number): Photo => ({
  src: `${BASE}roberts/${name}-1920.jpg`,
  srcSet:
    w > 960
      ? `${BASE}roberts/${name}-960.jpg 960w, ${BASE}roberts/${name}-1920.jpg ${w}w`
      : `${BASE}roberts/${name}-1920.jpg ${w}w`,
  alt,
  ratio: `${w} / ${h}`,
  portrait: h > w,
})

export const PHOTO = {
  gilligogg: P('gilligogg', 'Barinn á Gilligogg með veggmynd, viðarbar og barstólum', 1920, 1280),
  menam: P('menam', 'Afgreiðsla Menam Wok í mathöll, klædd lóðréttum rimlum með lituðu gleri', 1440, 1920),
  risid: P('risid', 'Risið Vínbar undir súð, með sófum, borðum og viðarbar', 1732, 1155),
  risidBar: P('risid2', 'Skeifulaga viðarbar Risins með barstólum undir súðinni', 1732, 1155),
  pablo: P('pablo', 'Barinn á Pablo Discobar með myndskreyttri framhlið og speglalofti', 1919, 1280),
  ntc: P('ntc', 'Verslun NTC með sérsmíðuðum borðum, hillum og fataslám', 1920, 1280),
  dill: P('dill', 'Borðsalur Dill með dökkrauðum vegg og viðarborðum', 1320, 742),
  levis: P('levis', 'Verslun Levi’s í Kringlunni með rifluðum veggklæðningum við innganginn', 1360, 766),
  geysir: P('geysir', 'Afgreiðsla og matsalur Geysis undir viðarklæddu lofti með ljósaperum', 1000, 664),
  geysirSalur: P('geysir2', 'Matsalur Geysis með löngum viðarborðum og bekkjum', 1000, 667),
  enska: P('enska', 'Eldhús og borðstofa Enska hússins með viðarinnréttingu og bitum í lofti', 1500, 1000),
  fantasia: P('fantasia', 'Bar í Fantasíu veislusal með bólstraðri framhlið og viðarplötu', 1280, 720),
  joe: P('joe', 'Joe & The Juice í Kringlunni með löngum viðarborðum og barstólum', 1400, 700),
  kassinn: P('kassinn', 'Viðarbar Kassans í Þjóðleikhúsinu í hlýrri lýsingu', 1024, 768),
  krua: P('krua', 'Matsalur Krua Thai með viðarborðum og stólum', 960, 540),
  messinn: P('messinn', 'Básar Messans á Selfossi, smíðaðir eins og um borð í skipi', 960, 720),
  mharstofa: P('mharstofa', 'M Hárstofa með bláum veggjum, speglum og viðargólfi', 960, 594),
  sumac: P('sumac', 'Barinn á Sumac með upplýstum flöskuhillum og barstólum', 1500, 999),
  thjodleikhus: P('thjodleikhus', 'Bogadreginn dökkur bar í Þjóðleikhúsinu með upplýstri umgjörð', 900, 602),
  teymi: P('heimasida', 'Starfsfólk Trésmíði Róberts, sjö smiðir fyrir framan vinnubílinn', 1500, 1000),
} satisfies Record<string, Photo>

export interface Verk {
  slug: string
  name: string
  flokkur: string
  /** only where it is certain, see the header note */
  stadur?: string
  /** one line, built only from what their own page says about the job */
  lina: string
  cover: Photo
  gallery: Photo[]
}

const lina = (name: string, extra = '') =>
  `${name} er á meðal verka sem Trésmíði Róberts ehf. hefur unnið.${extra ? ' ' + extra : ''}`

/** All seventeen jobs their "Verkin okkar" page names. The first seven are the
 *  grid, in the order that suits the reference's rhythm (a wide opener, two
 *  portraits, then half widths); the other ten are linked in the banner. */
export const VERK: Verk[] = [
  { slug: 'gilligogg', name: 'Gilligogg', flokkur: 'Bar', lina: lina('Gilligogg'), cover: PHOTO.gilligogg, gallery: [PHOTO.gilligogg] },
  { slug: 'menam-wok', name: 'Menam Wok', flokkur: 'Veitingastaður', stadur: 'Mathöll', lina: lina('Menam Wok'), cover: PHOTO.menam, gallery: [PHOTO.menam] },
  {
    slug: 'risid',
    name: 'Risið Vínbar',
    flokkur: 'Vínbar',
    stadur: 'Mjólkurbúið, Selfoss',
    lina: lina('Risið Vínbar', 'Myndirnar eru úr barnum undir súðinni.'),
    cover: PHOTO.risid,
    gallery: [PHOTO.risidBar, PHOTO.risid],
  },
  { slug: 'pablo-discobar', name: 'Pablo Discobar', flokkur: 'Bar', stadur: 'Reykjavík', lina: lina('Pablo Discobar'), cover: PHOTO.pablo, gallery: [PHOTO.pablo] },
  { slug: 'ntc', name: 'NTC', flokkur: 'Verslun', lina: lina('NTC'), cover: PHOTO.ntc, gallery: [PHOTO.ntc] },
  { slug: 'dill', name: 'Dill Restaurant', flokkur: 'Veitingastaður', stadur: 'Reykjavík', lina: lina('Dill Restaurant'), cover: PHOTO.dill, gallery: [PHOTO.dill] },
  { slug: 'levis', name: 'Levi’s', flokkur: 'Verslun', stadur: 'Kringlan', lina: lina('Verslun Levi’s í Kringlunni'), cover: PHOTO.levis, gallery: [PHOTO.levis] },
  {
    slug: 'geysir',
    name: 'Geysir',
    flokkur: 'Veitingastaður',
    stadur: 'Haukadalur',
    lina: lina('Veitingastaðurinn Geysir', 'Myndirnar eru úr afgreiðslunni og matsalnum.'),
    cover: PHOTO.geysir,
    gallery: [PHOTO.geysir, PHOTO.geysirSalur],
  },
  { slug: 'enska-husid', name: 'Enska húsið', flokkur: 'Gisting og veitingar', stadur: 'Borgarbyggð', lina: lina('Enska húsið'), cover: PHOTO.enska, gallery: [PHOTO.enska] },
  { slug: 'thjodleikhusid-bar', name: 'Þjóðleikhúsið, bar', flokkur: 'Bar', stadur: 'Reykjavík', lina: lina('Barinn í Þjóðleikhúsinu'), cover: PHOTO.thjodleikhus, gallery: [PHOTO.thjodleikhus] },
  { slug: 'kassinn', name: 'Kassinn', flokkur: 'Bar', stadur: 'Þjóðleikhúsið', lina: lina('Kassinn í Þjóðleikhúsinu'), cover: PHOTO.kassinn, gallery: [PHOTO.kassinn] },
  { slug: 'sumac', name: 'Sumac', flokkur: 'Veitingastaður', stadur: 'Reykjavík', lina: lina('Sumac'), cover: PHOTO.sumac, gallery: [PHOTO.sumac] },
  { slug: 'joe-and-the-juice', name: 'Joe & The Juice', flokkur: 'Veitingar', stadur: 'Kringlan', lina: lina('Joe & The Juice í Kringlunni'), cover: PHOTO.joe, gallery: [PHOTO.joe] },
  { slug: 'fantasia', name: 'Fantasía', flokkur: 'Veislusalur', lina: lina('Veislusalurinn Fantasía'), cover: PHOTO.fantasia, gallery: [PHOTO.fantasia] },
  { slug: 'messinn', name: 'Messinn', flokkur: 'Veitingastaður', stadur: 'Selfoss', lina: lina('Messinn á Selfossi'), cover: PHOTO.messinn, gallery: [PHOTO.messinn] },
  { slug: 'krua-thai', name: 'Krua Thai', flokkur: 'Veitingastaður', stadur: 'Kópavogur', lina: lina('Krua Thai'), cover: PHOTO.krua, gallery: [PHOTO.krua] },
  { slug: 'm-harstofa', name: 'M Hárstofa', flokkur: 'Hárstofa', lina: lina('M Hárstofa'), cover: PHOTO.mharstofa, gallery: [PHOTO.mharstofa] },
]

export const VERK_GRID = VERK.slice(0, 7)
export const VERK_ONNUR = VERK.slice(7)

/** Their own service words, from the Þjónusta and Um okkur pages. */
export const THJONUSTA: Array<{ titill: string; texti?: string }> = [
  {
    titill: 'Sérsmíði',
    texti: 'Við sérhæfum okkur í að hanna og smíða innréttingar og lausnir sem sameina vandað handverk, hágæða efnisval og nákvæmni í hverju smáatriði.',
  },
  {
    titill: 'Hönnun, framleiðsla og uppsetning',
    texti: 'Við tökum að okkur hönnun, framleiðslu og uppsetningu á innréttingum, þar á meðal afgreiðsluborðum, hillukerfum, skápum og sérlausnum sem eru sniðnar að þörfum hvers verkefnis.',
  },
  {
    titill: 'Endurbætur og breytingar',
    texti: 'Hvort sem um er að ræða ný verkefni, breytingar á eldri innréttingum eða reglulegt viðhald leggjum við ríka áherslu á nákvæmni, fagmennsku og skilvirk vinnubrögð.',
  },
  {
    titill: 'Fagleg ráðgjöf',
    texti: 'Við vinnum náið með viðskiptavinum okkar frá hugmynd að fullkláruðu verki til að tryggja að útkoman endurspegli bæði þarfir og sýn þeirra.',
  },
  { titill: 'Nýsmíði' },
  { titill: 'Viðhald' },
]

/** Their three focus lines and two sentences of intent, for the slider. */
export const MARKMID: string[] = [
  'Gæðasmíði. Vandað handverk og endingargóðar lausnir.',
  'Fagleg ráðgjöf. Við hjálpum til við að móta lausnir frá fyrstu hugmynd.',
  'Reynsla og þekking. Áralöng reynsla í sérsmíði og innréttingum.',
  'Okkar markmið er að skila af okkur verkefnum sem standast strangar kröfur og endast vel til framtíðar.',
  'Við tökum að okkur stór sem smá verkefni af metnaði og alúð.',
]

/** The three master carpenters, as their Um okkur page introduces them. */
export const TEYMI: Array<{ nafn: string; texti: string }> = [
  {
    nafn: 'Róbert Lárusson',
    texti: 'Eigandi og húsasmíðameistari, með mikla reynslu í sérsmíði og innréttingum fyrir fjölbreytt atvinnuhúsnæði. Hann sér einnig um undirbúning verkefna og áætlanagerð.',
  },
  {
    nafn: 'Lárus Pálmi Magnússon',
    texti: 'Húsasmíðameistari til margra ára, sem býr yfir mikilli þekkingu og leggur ríka áherslu á vandað handverk og nákvæmni.',
  },
  {
    nafn: 'Magnús Eyjólfsson',
    texti: 'Húsasmíðameistari til margra ára, með mikla reynslu og þekkingu í sérsmíði.',
  },
]

export const TEXTI = {
  tagline: 'Sérsmíði er okkar fag',
  heroLabel: 'Sérsmíði fyrir veitingastaði, hótel og verslanir',
  inngangur:
    'Trésmíði Róberts ehf. sérhæfir sig í sérsmíðuðum innréttingum, nýsmíði og endurbótum fyrir fyrirtæki og einstaklinga, með áherslu á vandað handverk, hágæða efni og endingargóðar lausnir.',
  um:
    'Trésmíði Róberts ehf. er traust og rótgróið fyrirtæki með áralanga reynslu í sérsmíði fyrir veitingastaði, hótel, verslanir og fjölbreytt atvinnuhúsnæði.',
  starfsmenn:
    'Hjá Trésmíði Róberts ehf. starfa faglærðir og reynslumiklir trésmiðir sem sérhæfa sig í vönduðu handverki, sérsmíði og innréttingum fyrir fyrirtæki og heimili. Hvort sem um er að ræða verkefni í Reykjavík eða annars staðar á landinu geturðu treyst á fagmennsku, nákvæm vinnubrögð og áratuga reynslu.',
  thjonusta:
    'Trésmíði Róberts ehf. býður upp á fjölbreytta og sérsniðna trésmíðaþjónustu fyrir fyrirtæki og einstaklinga. Við sérhæfum okkur í nýsmíði, sérsmíði, viðhaldi og endurbótum á innréttingum fyrir veitingastaði, hótel, verslanir, skrifstofur og önnur atvinnuhúsnæði.',
  verkH2: 'Vandað handverk og fagmennska.',
  verkefniIntro:
    'Við hjá Trésmíði Róberts ehf. höfum unnið fjölbreytt verkefni fyrir veitingastaði, hótel og verslanir víðs vegar um landið. Hér má sjá sýnishorn af lausnum sem endurspegla vandað handverk, gæði og fagmennsku.',
  teymi:
    'Kjarni fyrirtækisins samanstendur af þremur reyndum húsasmíðameisturum. Auk þeirra starfa jafnan fjórir til sex manns sem mynda öflugt og samhent teymi.',
  metnadur:
    'Hvort sem um er að ræða innréttingar, sérverkefni eða endurbætur leggjum við metnað okkar í að skapa lausnir sem sameina gæði, fagurfræði og endingu.',
  tilbod: 'Hafðu samband í dag og fáðu faglega ráðgjöf eða tilboð.',
}

export const CONTACT = {
  simi: '772 9009',
  simiHref: 'tel:+3547729009',
  netfang: 'robert@tresmidi.is',
  kennitala: '621205-0990',
  stadur: 'Reykjavík',
}

export const PHOTO_CREDIT =
  'Ljósmyndir eru af vef Trésmíði Róberts (tresmidiroberts.is), sóttar í september 2026. Myndir frá Enska húsinu og Þjóðleikhúsinu tók Mikael Lundblad, af Pablo Discobar Mikael Axelsson og af Risinu salir.is.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'Trésmíði Róberts ehf.',
  url: 'https://tresmidiroberts.is',
  email: CONTACT.netfang,
  telephone: '+354 772 9009',
  taxID: CONTACT.kennitala,
  founder: { '@type': 'Person', name: 'Róbert Lárusson' },
  address: { '@type': 'PostalAddress', addressLocality: 'Reykjavík', addressCountry: 'IS' },
  areaServed: 'Ísland',
  description: TEXTI.inngangur,
}

export const companyEntry: PreviewCompany = {
  slug: 'roberts',
  route: '/preview/roberts',
  name: 'Trésmíði Róberts ehf.',
  sector: 'Sérsmíði og innréttingar',
  location: 'Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Þrír húsasmíðameistarar og fjögur til sex manna teymi',
  currentUrl: 'https://tresmidiroberts.is',
  ownerEmail: 'robert@tresmidi.is',
  concept: 'Sérsmíði er okkar fag',
  conceptTagline:
    'Barir, veitingastaðir og verslanir sem fólk þekkir voru smíðuð á einu verkstæði. Vefurinn sýnir hvert verk á sinni eigin síðu, með nafni og myndum.',
  accent: '#5C3C24',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}roberts/gilligogg-960.jpg`,
  ownPhotography: true,
  photoCredit: PHOTO_CREDIT,
  audit: {
    strengths: [
      'Sautján nafngreind verk með myndum: Dill, Pablo Discobar, Sumac, Geysir, Levi’s í Kringlunni og fleiri',
      'Þrír húsasmíðameistarar nafngreindir, með eigin lýsingu á reynslu hvers og eins',
      'Viðskiptavinir sem fólk þekkir í veitingum, verslun og gistingu',
    ],
    weaknesses: [
      'Vefurinn er ósérsniðin Shopify verslun: titill og fótur segja „Min butik“ og „Translation missing“ birtist víða á síðunni',
      'Innkaupakarfa, innskráning og leit á vef sem selur enga vöru',
      'Verkin eru ein myndaröð, ekkert verk á sína eigin síðu og netfangslénið tresmidi.is svarar „This domain is not configured“',
    ],
    opportunities: [
      'Hvert verk fær sína eigin síðu með nafni, tegund og stað, sem leitarvélar geta sýnt',
      'Sami strúktúr og hjá hollenskum arkitektastofum: flokkur, staður og myndaröð fyrir hvert verk',
    ],
  },
  positioning:
    'Trésmíði Róberts sérsmíðar innréttingar, bari og afgreiðsluborð fyrir veitingastaði, hótel og verslanir. Frumgerðin byggir á verkunum sjálfum: sautján nafngreind verk með þeirra eigin myndum, hvert á sinni síðu.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Trésmíði Róberts',
    body:
      'Sæll Róbert,\n\nÉg heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.\n\nÉg rakst á tresmidiroberts.is og verkalistinn stoppaði mig. Dill, Pablo Discobar, Sumac, Risið á Selfossi, Levi’s í Kringlunni og barinn í Þjóðleikhúsinu, allt staðir sem fólk þekkir en fæstir vita hver smíðaði. Vefurinn gerir þeim samt ekki góð skil. Hann er settur upp sem Shopify verslun sem var aldrei kláruð, svo forsíðan heitir „Min butik“ í vafraflipanum, textinn „Translation missing“ birtist víða og gestur sér innkaupakörfu og innskráningu þó ekkert sé til sölu. Verkin eru ein myndaröð þar sem ekkert þeirra á sína eigin síðu, og lénið tresmidi.is, sem netfangið þitt er á, opnar bara villuboð.\n\nMér fannst það synd, svo ég settist niður og hannaði frumgerð að nýjum vef fyrir Trésmíði Róberts. Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.\n\nHana má skoða hér hvenær sem er, og hún virkar vel í síma:\n[HLEKKUR Á FRUMGERÐ]\n\nHugmyndin er einföld. Hvert af sautján verkunum fær sína eigin síðu með nafni og myndum, þú og hinir húsasmíðameistararnir eruð kynntir með nafni og allur textinn er ykkar eigin. Hún er hönnuð fyrir símann fyrst, því þar skoðar fólk vefi mest í dag, og virkar eins vel á tölvu.\n\nÉg sé líka um hýsingu, viðhald og uppfærslur á síðum sem ég geri, ef það er eitthvað sem þú hefur áhuga á.\n\nEf þér líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þú hafir gaman af því að skoða hugmyndina.\n\nEndilega láttu mig vita hvað þér finnst.\n\nBestu kveðjur,\nSindri Már\n845-1758\nsndrstudio.is',
  },
}
