import type { PreviewCompany } from '../companies'
import { SIZE } from './photos.gen'
import { STARFSFOLK, VIDBURDIR, VORUR, type Starfsmadur, type Vara } from './catalog.gen'

/**
 * REYKJAFELL EHF. — reykjafell.is (kt. 530269-6559)
 *
 * Every string below is Reykjafell's own published copy (reykjafell.is pages,
 * news, product pages, staff page and terms, harvested 2026-10-19), tidied only
 * for length, or a fact they publish themselves. Products, stock counts,
 * locations, datasheets, events and people come from their own records through
 * catalog.gen.ts. Their prices sit behind the trade login, so this page shows
 * none ([[client-copy-from-their-own-words]], [[feedback-her-text-verbatim-ours-bulletproof]]).
 *
 * Photography: every picture is one their own site serves (news articles, home
 * heroes, staff page, product pages), at the highest resolution Prismic serves.
 */

const BASE = import.meta.env.BASE_URL
export { STARFSFOLK, VIDBURDIR, VORUR, type Starfsmadur, type Vara }

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
    src: `${BASE}reykjafell/${id}-1920.jpg`,
    srcSet: w > 960 ? `${BASE}reykjafell/${id}-960.jpg 960w, ${BASE}reykjafell/${id}-1920.jpg ${w}w` : `${BASE}reykjafell/${id}-1920.jpg ${w}w`,
    alt,
    ratio: `${w} / ${h}`,
    portrait: h > w,
  }
}

export const vorumynd = (sku: string) => `${BASE}reykjafell/vorur/${sku}.webp`
export const folkmynd = (uid: string) => `${BASE}reykjafell/folk/${uid}.jpg`

export const CONTACT = {
  simi: '588 6000',
  simiHref: 'tel:+3545886000',
  neyd: '575 6644',
  neydHref: 'tel:+3545756644',
  kennitala: '530269-6559',
  vsk: '11520',
  heimilisfang: 'Blikastaðavegi 2',
  postnumer: '112 Reykjavík',
  ak: { heimilisfang: 'Baldursnesi 6a', postnumer: '603 Akureyri', simi: '462 5000', simiHref: 'tel:+3544625000', neyd: '867 3901', neydHref: 'tel:+3548673901' },
  opid: 'Afgreiðslan í Reykjavík og á Akureyri er opin 08:00–16:00 alla virka daga.',
  opidStutt: 'Opið 8–16 virka daga',
  netverslun: 'Netverslunin er opin allan sólarhringinn og við sendum hvert á land sem er.',
}

export const PHOTO = {
  hq: P('hq', 'Nýjar höfuðstöðvar Reykjafells við Blikastaðaveg 2, vöruhús og skrifstofur undir einu þaki, séð úr lofti'),
  stjorn: P('stjorn', 'Einar Þór Einarsson framkvæmdastjóri og Kristinn Benediktsson aðstoðarframkvæmdastjóri í vöruhúsi Reykjafells'),
  afmaeli: P('afmaeli', 'Um 600 gestir í vöruhúsinu á 70 ára afmæli Reykjafells 22. maí 2026'),
  terta: P('terta', 'Afmælisterta með merki Reykjafells og orðunum 70 ára'),
  gatnamot: P('gatnamot', 'Fulltrúar Reykjafells, SWARCO, Seyond, Rafals og Reykjavíkurborgar við stjórnskáp gatnamóta Bíldshöfða og Breiðhöfða'),
  rarik: P('rarik', 'Jarðstrengur sem myndar útlínur Íslands, með merkjum Reykjafells og RARIK'),
  safnahus: P('safnahus', 'Safnahúsið á Ísafirði upplýst með RGBW LED-útilýsingu í vetrarmyrkri'),
  ccp: P('ccp', 'Merki CCP á nýjum höfuðstöðvum fyrirtækisins í Vatnsmýri'),
  swarco: P('swarco', 'Ný umferðarljós frá Swarco á gatnamótum Smárahvammsvegar, Gullsmára og Fífuhvammsvegar í Kópavogi'),
  skilti: P('skilti', 'Veður- og upplýsingaskilti Vegagerðarinnar undir Ingólfsfjalli'),
  fjos: P('fjos', 'Kýr í fjósi með stýriskjá fyrir lýsinguna í forgrunni'),
  tskoli: P('tskoli', 'Fulltrúar Reykjafells og Eaton afhenda Tækniskólanum gjöf'),
  maelir: P('maelir', 'Úttektarmælir frá Kyoritsu afhentur Tækniskólanum í sýningarsal Reykjafells'),
  kuka: P('kuka', 'Námskeið í KUKA TechCenter, iðnaðarþjarkar á gólfinu'),
  lb2024: P('lb2024', 'Hópur á Reykjafellsdeginum á Light+Building í Frankfurt'),
  ansellDagar: P('ansell-dagar', 'Viðskiptavinir og starfsfólk í söludeild Reykjafells á Ansell dögum í október 2026'),
  glamox: P('glamox', 'Skrifstofurými lýst með Glamox lömpum'),
  seyond: P('seyond', 'LiDAR skynjari frá Seyond og stjórnborð sem sýnir umferð í rauntíma'),
  easee: P('easee', 'Ökumaður tengir rafbíl við Easee hleðslustöð í bílakjallara'),
  janitza: P('janitza', 'Janitza mælastöðvar fyrir orkugæðagreiningu'),
  comelit: P('comelit', 'Kona notar Comelit Ultra dyrasíma við inngang fjölbýlishúss'),
  ansell: P('ansell', 'Ansell lampi í lofti verslunar'),
  easeeOcpp: P('easee-ocpp', 'Röð af Easee hleðslustöðvum'),
}

export const PHOTO_CREDIT = 'Myndir: Reykjafell ehf., af fréttum, vörusíðum og starfsmannasíðu reykjafell.is'

export const TEXTI = {
  tagline: 'Heildarlausnir fyrir fagfólk og fyrirtæki í rafiðnaði',
  heroLabel: 'Heildverslun frá 1956',
  inngangur:
    'Reykjafell er framsækið og metnaðarfullt fyrirtæki sem býður upp á heildarlausnir á sviði raf- og lýsingarbúnaðar á fyrirtækjamarkaði.',
  um: 'Sjötíu ára félag sem hefur fylgt rafvæðingu Íslands frá fyrstu skrefum og er enn í fremstu röð.',
  umMalsgrein:
    'Reykjafell var stofnað árið 1956 og er í dag eitt rótgrónasta fyrirtæki landsins á sviði raf- og lýsingarbúnaðar. Félagið veitir rafverktökum, veitum og iðnfyrirtækjum um allt land heildarlausnir í afldreifingu, lagnaefni, lýsingu, töflubúnaði, iðnstýringum og rafbílahleðslu.',
  hq: 'Í febrúar 2026 flutti félagið starfsemi sína í nýjar höfuðstöðvar að Blikastaðavegi 2 við Korputorg, þar sem skrifstofur, vöruhús og þjónusta eru sameinuð undir einu þaki. Einnig rekur það útibú á Akureyri.',
  fagmadur:
    'Reykjafell er heildsala fyrir fagfólk og fyrirtæki í rafiðnaði. Bein smásala til einstaklinga er ekki í boði, en í verslunum Byko má finna úrval af vörum Reykjafells. Að öðru leyti sjá löggiltir rafverktakar um endursölu og uppsetningu á rafbúnaði fyrir einstaklinga.',
  netverslun:
    'Reykjafell heldur úti öflugri netverslun fyrir fyrirtæki í reikningsviðskiptum og starfsmenn þeirra. Auk netverslunar er hægt að sjá reikninga, hreyfingarlista og pöntunarsögu á þínum síðum ásamt því að vista vörur í söfn.',
  sjalfsafgreidsla:
    'Þegar svo ber við að sölumenn eru allir uppteknir geta viðskiptavinir afgreitt sig sjálfir á snertiskjá og sótt vörurnar í afgreiðslu örfáum mínútum síðar.',
  klasarH2: 'Sérfræðingar í hverjum klasa, með nafn og símanúmer.',
  klasarIntro:
    'Söludeildin skiptist í klasa. Hver klasi hefur sinn ábyrgðarmann, svo spurning um lýsingu fer beint til þess sem hannar lýsingu og spurning um jarðstreng til þess sem selur jarðstrengi.',
  verkH2: 'Búnaður frá Reykjafelli í verkum um allt land.',
  verkIntro: 'Gatnamót sem gervigreind stýrir, 36 kV dreifikerfi RARIK, lýsing í safnahúsi og fjósum. Hvert verk segir frá sér með orðum Reykjafells sjálfs.',
  vorurH2: 'Hundruð vandaðra vörumerkja, leitað eins og þú talar.',
  vorurIntro:
    'Reykjafell hefur allt frá upphafi lagt á það höfuðáherslu að bjóða upp á vandaða vöru frá gæða framleiðendum og þekktum vörumerkjum. Hér er sýnishorn úr vörulistanum, með vörunúmeri, lagerstöðu í Reykjavík og á Akureyri og tækniblöðum. Verð sést við innskráningu.',
  listiH2: 'Límdu inn efnislistann. Hann kemur til baka sem tilboðsbeiðni.',
  listiIntro:
    'Rafverktaki sendir oft lista úr teikningu eða Excel: vörunúmer, gerð og magn í hverri línu. Hér er hver lína borin saman við vörulistann, það sem finnst fær vörunúmer og lagerstöðu, og það sem finnst ekki er merkt svo sölumaður sjái það strax.',
  vidburdirH2: 'Öll námskeið og kynningar á einum stað, með sætum og biðlista.',
  vidburdirIntro:
    'Reykjafell heldur námskeið og kynningar með birgjum allt árið, í Reykjavík og á Akureyri. Í dag fær hver viðburður sína skráningarsíðu og sína takk-síðu. Hér er dagatal sem heldur utan um þá alla.',
  thjonustaH2: 'Bilun eða spurning um uppsetningu? Fyrst svarið, svo réttur maður.',
  thjonustaIntro:
    'Margar spurningar hafa þegar verið svaraðar í fréttum og tilkynningum Reykjafells. Þjónustan leiðir fyrst að því svari og sendir svo málið, með vörunúmeri og lýsingu, beint á ábyrgðarmann klasans.',
  folkH2: 'Hjá Reykjafelli starfa að jafnaði um 50 manns.',
  folkIntro: 'Hér er fólkið sem ber ábyrgð á hverjum klasa, framkvæmdastjórnin og útibúið á Akureyri. Beinn sími og netfang hjá hverju og einu.',
  metnadur: 'Viltu tilboð, aðgang að netversluninni eða aðstoð?',
  tilbod: 'Ein beiðni, þrjár leiðir. Hún fer á þann sem sér um málið hjá Reykjafelli, með öllu sem þarf til að svara í fyrstu umferð.',
  aukahl: 'Fyrirtæki í rafiðnaði geta sótt um reikningsviðskipti og aðgang að vefverslun hér.',
}

/** Their recognitions, as their own footer and news list them. */
export const VIDURKENNINGAR = [
  /* their September 2026 news says "níu ár í röð" while their footer badge reads
     2016–2025 (ten years); the news wording is used and the clash is in the handoff */
  'Í hópi Framúrskarandi fyrirtækja Creditinfo níu ár í röð.',
  'Fyrirmyndarfyrirtæki í rekstri 2020–2025, sex ár í röð.',
  'Fyrirtæki ársins hjá VR 2025, fimmta árið í röð.',
  'Jafnlaunavottun 2023–2026 og viðurkenning Jafnvægisvogar FKA 2024 og 2025.',
  'Weidmüller Pro Partner frá 2025 og umboðsaðili Swarco á Íslandi frá 2020.',
]

export const STADREYNDIR: { n: string; sup?: string; t: string }[] = [
  { n: '70', t: 'ár frá stofnun, 16. janúar 1956' },
  { n: '145', t: 'vörumerki í netversluninni' },
  { n: '50', sup: '±', t: 'starfsmenn í Reykjavík og á Akureyri' },
  { n: '2', t: 'starfsstöðvar, Blikastaðavegur og Baldursnes' },
]

/* ── the sales clusters, with the person their staff page names ─────────── */
export interface Klasi {
  id: string
  titill: string
  texti: string
  photo: Photo
  abyrgd: string // staff uid, ascii
  fam: string[] // catalogue families that route here
  merki: string[]
}
export const KLASAR: Klasi[] = [
  {
    id: 'lysing', titill: 'Lýsing', abyrgd: 'jon-thor-vigfusson', fam: ['ansell'], photo: PHOTO.safnahus,
    texti: 'Fagleg lýsing fyrir skóla, skrifstofur, iðnað og vegi, frá Zumtobel, Glamox, AEC, PIL, Ansell og fleirum.',
    merki: ['Zumtobel', 'Glamox', 'Ansell', 'Zencontrol'],
  },
  {
    id: 'afldreifing', titill: 'Afldreifing', abyrgd: 'olafur-helgi-hardarson', fam: ['kapall', 'weidmuller'], photo: PHOTO.rarik,
    texti: 'Jarðstrengir og búnaður fyrir dreifikerfi raforku, meðal annars 36 kV jarðstrengir fyrir RARIK.',
    merki: ['Eaton', 'Weidmüller', 'KONČAR'],
  },
  {
    id: 'idnstyringar', titill: 'Iðnstýringar', abyrgd: 'geir-arnar-geirsson', fam: ['janitza', 'kyoritsu'], photo: PHOTO.janitza,
    texti: 'Orkugæðagreining, mælitæki, rennslismælar og fjarstýringar frá HBC, Eaton, Janitza og Pilz, og iðnaðarþjarkar frá KUKA.',
    merki: ['Janitza', 'KUKA', 'Pilz', 'Krohne'],
  },
  {
    id: 'samgongur', titill: 'Samgöngur, hleðsla og hússtjórn', abyrgd: 'adam-thorsteinsson', fam: ['easee', 'comelit', 'plejd', 'eaton'], photo: PHOTO.easee,
    texti: 'Umferðarbúnaður, rafbílahleðsla, dyrasímar, snjallheimili, netkerfi og varaafl, frá Easee, Swarco, BKT, Grenton og MDT.',
    merki: ['Easee', 'Swarco', 'Comelit', 'Plejd'],
  },
  {
    id: 'raflagnir', titill: 'Raflagnir', abyrgd: 'ivareidsson', fam: [], photo: PHOTO.ansellDagar,
    texti: 'Lagnaefni, rofar, tenglar, töflur og kassar fyrir rafverktaka, á lager í Reykjavík og á Akureyri.',
    merki: ['Jung', 'Spelsberg', 'Hager', 'ABB'],
  },
]

/* ── catalogue families: the finder's first blank ───────────────────────── */
export const FLOKKAR: { id: string; ord: string; titill: string; klasi: string }[] = [
  { id: 'easee', ord: 'hleðslustöð', titill: 'Hleðsla rafbíla', klasi: 'samgongur' },
  { id: 'comelit', ord: 'dyrasíma', titill: 'Dyrasímar', klasi: 'samgongur' },
  { id: 'ansell', ord: 'lýsingu', titill: 'Lýsing', klasi: 'lysing' },
  { id: 'plejd', ord: 'snjallstýringu', titill: 'Hússtjórnarkerfi', klasi: 'samgongur' },
  { id: 'janitza', ord: 'orkumæli', titill: 'Orkugæðagreining', klasi: 'idnstyringar' },
  { id: 'weidmuller', ord: 'yfirspennuvörn', titill: 'Yfirspennuvarnir', klasi: 'afldreifing' },
  { id: 'eaton', ord: 'varaafl', titill: 'Varaaflgjafar', klasi: 'samgongur' },
  { id: 'kyoritsu', ord: 'mælitæki', titill: 'Mælitæki', klasi: 'idnstyringar' },
  { id: 'kapall', ord: 'jarðstreng', titill: 'Jarðstrengir', klasi: 'afldreifing' },
]

/* ── the jobs, from their own news ─────────────────────────────────────── */
export interface Verk {
  slug: string
  name: string
  flokkur: string
  stadur?: string
  ar: string
  lina: string
  texti: string
  cover: Photo
  gallery: Photo[]
  klasi: string
  frett: string
}
const F = (uid: string) => `https://www.reykjafell.is/frettir/${uid}`
export const VERK: Verk[] = [
  {
    slug: 'ai-gatnamot', name: 'Fyrstu AI-stýrðu gatnamót Íslands', flokkur: 'Samgöngur', stadur: 'Bíldshöfði og Breiðhöfði', ar: '2025', klasi: 'samgongur',
    lina: 'Gervigreind og LiDAR skynjarar stýra gatnamótum Bíldshöfða og Breiðhöfða, í fyrsta skipti í heiminum svo vitað sé.',
    texti: 'Samvinnuverkefni SWARCO, Seyond, Reykjafells, Rafals og Reykjavíkurborgar. Tveir LiDAR skynjarar frá Seyond skanna 100 m radíus út frá gatnamótunum, í öllum veðrum, og Smart-AI hugbúnaður SWARCO hagar umferð sjálfkrafa eftir aðstæðum. Með þessu næst skilvirkara flæði, styttri biðtími, minni mengun og meira öryggi fyrir alla vegfarendur.',
    cover: PHOTO.gatnamot, gallery: [PHOTO.gatnamot, PHOTO.seyond], frett: F('fyrstu-ai-styrdu-gatnamot-islands'),
  },
  {
    slug: 'rarik-36kv', name: '36 kV jarðstrengir fyrir RARIK', flokkur: 'Afldreifing', stadur: 'Um allt land', ar: '2025', klasi: 'afldreifing',
    lina: 'Samningur við RARIK um afhendingu á jarðstrengjum fyrir 36 kV dreifikerfi næstu ár.',
    texti: 'Samningurinn var formlega undirritaður 8. október 2025 og tryggir RARIK áreiðanlega og skilvirka þjónustu við uppbyggingu raforkukerfisins um allt land. „Þetta er stór áfangi fyrir Reykjafell og staðfesting á þeirri stefnu sem við höfum fylgt,“ segir Kristinn Benediktsson.',
    cover: PHOTO.rarik, gallery: [PHOTO.rarik], frett: F('reykjafell-gerir-storan-samning-vid-rarik'),
  },
  {
    slug: 'safnahusid-isafirdi', name: 'Safnahúsið á Ísafirði', flokkur: 'Lýsing', stadur: 'Ísafjörður', ar: '2025', klasi: 'lysing',
    lina: 'RGBW LED-útilýsing frá Reykjafelli lýsir upp Safnahúsið í skammdeginu.',
    texti: 'Lýsingin er hágæða RGBW LED-lýsing frá LIGMAN og Ó.K.RAF ehf. á Ísafirði sá um uppsetningu. Hún dregur fram einstaka fegurð hússins, bætir sýnileika og fyllir bæinn af lífi og lit á dimmum vetrarkvöldum.',
    cover: PHOTO.safnahus, gallery: [PHOTO.safnahus], frett: F('safnahusid-isafirdi'),
  },
  {
    slug: 'swarco-kopavogi', name: 'Umferðarljós í Kópavogi', flokkur: 'Samgöngur', stadur: 'Kópavogur', ar: '2023', klasi: 'samgongur',
    lina: 'Allur búnaður í nýjum umferðarljósum við Smárahvammsveg, Gullsmára og Fífuhvammsveg kom frá Reykjafelli.',
    texti: 'Í fyrsta sinn í yfir 25 ár var nýr framleiðandi tengdur inn á miðlægt stýrikerfi borgarinnar. ITC-3 stýribúnaðurinn frá Swarco var aðlagaður að núverandi kerfi höfuðborgarsvæðisins. Mannvirkin voru hönnuð af VSO verkfræðistofu.',
    cover: PHOTO.swarco, gallery: [PHOTO.swarco], frett: F('swarco-umferdarljos'),
  },
  {
    slug: 'vedurskilti', name: 'Veður- og upplýsingaskilti', flokkur: 'Samgöngur', stadur: 'Undir Ingólfsfjalli', ar: '2024', klasi: 'samgongur',
    lina: 'Fyrstu skilti sinnar gerðar á Íslandi, frá SWARCO í Austurríki, sett upp fyrir Vegagerðina.',
    texti: 'Skiltin sýna vindátt, vindhraða og hitastig, og vindhviður yfir 15 m/s. Þau eru tengd miðlægu stjórnkerfi í vaktstöð Vegagerðarinnar sem vaktar þau og stjórnar þeim.',
    cover: PHOTO.skilti, gallery: [PHOTO.skilti], frett: F('fyrstu-skilti-sinnar-tegundar-a-islandi'),
  },
  {
    slug: 'ccp-tolvulagnir', name: 'Tölvulagnir í höfuðstöðvum CCP', flokkur: 'Netkerfi', stadur: 'Vatnsmýri', ar: '2020', klasi: 'samgongur',
    lina: 'Cat 6A tölvulagnakerfi frá BKT í nýjum höfuðstöðvum CCP, með 25 ára framleiðsluábyrgð.',
    texti: 'Rafholt sá um uppsetninguna og fékk vottun frá BKT Elektroniks. Um 3.000 tengiendar voru tengdir og rúmlega 80 km dregnir í bygginguna.',
    cover: PHOTO.ccp, gallery: [PHOTO.ccp], frett: F('bkt-tolvulagnir-i-nyjar-hofuðstoðvar-ccp'),
  },
  {
    slug: 'lysing-i-fjosum', name: 'Lýsing í fjósum', flokkur: 'Lýsing', stadur: 'Með Ljósgjafanum', ar: '2022', klasi: 'lysing',
    lina: 'Ljósgjafinn hannar og setur upp, Reykjafell skaffar lampa og íhluti: rétt lýsing eykur nyt og bætir líðan kúa.',
    texti: 'Lýsingin er tengd notendavænu skjákerfi þar sem hægt er að stilla lýsingu í öllu fjósinu á einfaldan hátt. Sólarljós eykur framleiðslu á D-vítamíni og stýrir framleiðslu á melatóníni, sem hefur mikil áhrif á frjósemi og atferli.',
    cover: PHOTO.fjos, gallery: [PHOTO.fjos], frett: F('lysing-fjosum-ljosgjafinn'),
  },
]
export const VERK_GRID = VERK

/* ── service triage: their own published answers per product line ──────── */
export interface Thjonustulina {
  id: string
  titill: string
  fam: string
  einkenni: { spurning: string; svar: string; heimild?: string }[]
}
export const THJONUSTA: Thjonustulina[] = [
  {
    id: 'easee', titill: 'Hleðslustöð (Easee)', fam: 'easee',
    einkenni: [
      {
        spurning: 'Eru Easee stöðvarnar öruggar? Ég heyrði af sölubanni.',
        svar: 'Sænska eftirlitsstofnunin ESV tilkynnti 22. apríl 2024 að hún óski ekki eftir breytingum eða afturköllun á Home og Charge stöðvum í notkun, og norsku stofnanirnar DSB og Nkom fylgdu í kjölfarið. Bilunartíðnin er 0,4% og yfir 700 þúsund stöðvar eru í notkun.',
        heimild: F('easee-hledslustodvarnar-eru-oruggar'),
      },
      {
        spurning: 'Margar stöðvar í fjölbýli eða bílastæðahúsi: hvernig dreifist álagið?',
        svar: 'Cloud Balancing færir álagsstýringuna upp í skýið og dreifir álagi á milli margra greina, jafnvel þótt stöðvarnar séu á mismunandi Wi-Fi-netum eða 4G. Equalizer þarf þó áfram þar sem taka á mið af annarri rafmagnsnotkun hússins.',
        heimild: F('easee-kynnir-direct-ocpp-og-cloud-balancing'),
      },
      {
        spurning: 'Rekstrarkerfi (CPMS) á að tengjast stöðvunum beint.',
        svar: 'Direct OCPP leyfir rekstrarkerfi þriðja aðila að tengjast Easee stöðvum beint, án skýs Easee, með hraðari svörun og tíðari mælaálestri. Uppfærslan berst sjálfkrafa og rekstrarkerfið er skráð sem „Operator“ í Easee Partner Portal.',
        heimild: F('easee-kynnir-direct-ocpp-og-cloud-balancing'),
      },
    ],
  },
  {
    id: 'comelit', titill: 'Dyrasími (Comelit)', fam: 'comelit',
    einkenni: [
      {
        spurning: 'Hvað þarf í útistöð með skjá fyrir íbúalista?',
        svar: 'Comelit Ultra skjárinn UT9260M (vörunr. 1390070) er 3,5” skjár í útistöð. Með honum er hægt að fletta upp íbúum og notendum í kerfinu og skilgreina aðgerðahnappa. Tækniblaðið fylgir vörunni hér á síðunni.',
      },
    ],
  },
  {
    id: 'eaton', titill: 'Varaafl (Eaton UPS)', fam: 'eaton',
    einkenni: [
      {
        spurning: 'Þriggja fasa varaaflgjafi eða einfasa?',
        svar: 'Reykjafell og Eaton halda reglulega kynningar og netnámskeið um varaaflgjafa, meðal annars um þriggja fasa varaaflgjafa. Skoðaðu viðburðadagatalið hér að ofan eða sendu málið á ábyrgðarmann varaafls.',
      },
    ],
  },
  {
    id: 'janitza', titill: 'Mælar og orkugæði (Janitza)', fam: 'janitza',
    einkenni: [
      {
        spurning: 'Hvaða mælastöð hentar til orkugæðagreiningar?',
        svar: 'Mælastöðvar Janitza greina orkugæði rafmagnskerfa í rauntíma og gera rekstraraðilum kleift að greina frávik hratt. Iðnstýringaklasinn velur stöð og straumspenna eftir töflunni og fjölda greina.',
      },
    ],
  },
]

/* ── terms the assistant and the forms quote ───────────────────────────── */
export const SKILMALAR = {
  tilbodGildir: 'Tilboð gildir í 14 daga frá útgáfu nema annað sé tekið fram.',
  verd: 'Verð eru í íslenskum krónum og án virðisaukaskatts nema annað sé tekið fram.',
  afhending: 'Afhending fer fram á starfsstöð Reykjafells nema annað sé samið. Sé vara send greiðir kaupandi flutnings- og umsýslukostnað.',
  skil: 'Óska skal eftir skilum almennrar lagervöru innan 10 daga frá afhendingu og framvísa reikningi eða afhendingarseðli. Varan skal vera ónotuð í söluhæfu ástandi. Við samþykkt skil er gefin út inneignarnóta að frádregnu 15% umsýslu- og endurbirgðagjaldi.',
  gallar: 'Sýnilega vöntun, ranga vöru eða flutningsskemmd skal tilkynna skriflega innan 8 daga frá afhendingu.',
  reidufe: 'Reykjafell hætti að taka við reiðufé 1. september 2024.',
  serpantanir: 'Við sérpantanir greiðir kaupandi staðfestingargjald og pöntun fer ekki til birgis fyrr en það er greitt.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WholesaleStore',
  name: 'Reykjafell ehf.',
  description: TEXTI.inngangur,
  url: 'https://www.reykjafell.is',
  telephone: '+354 588 6000',
  foundingDate: '1956-01-16',
  taxID: '530269-6559',
  address: { '@type': 'PostalAddress', streetAddress: 'Blikastaðavegi 2', postalCode: '112', addressLocality: 'Reykjavík', addressCountry: 'IS' },
  department: [{ '@type': 'Store', name: 'Reykjafell Akureyri', telephone: '+354 462 5000', address: { '@type': 'PostalAddress', streetAddress: 'Baldursnesi 6a', postalCode: '603', addressLocality: 'Akureyri', addressCountry: 'IS' } }],
  openingHours: 'Mo-Fr 08:00-16:00',
}

export const companyEntry: PreviewCompany = {
  slug: 'reykjafell',
  route: '/preview/reykjafell',
  name: 'Reykjafell ehf.',
  sector: 'Heildverslun með raf- og lýsingarbúnað',
  location: 'Reykjavík og Akureyri',
  region: 'Höfuðborgarsvæðið',
  established: 'Stofnað 16. janúar 1956',
  currentUrl: 'https://www.reykjafell.is',
  ownerEmail: 'einar@reykjafell.is',
  concept: 'Heildarlausnir fyrir fagfólk og fyrirtæki í rafiðnaði',
  conceptTagline:
    'Vöruleit eins og fagmaður talar, efnislisti sem verður að tilboðsbeiðni, öll námskeið á einu dagatali, þjónusta sem svarar fyrst, og aðstoðarmaður sem þekkir vörulistann.',
  accent: '#0093D0',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}reykjafell/hq-960.jpg`,
  ownPhotography: true,
  photoCredit: PHOTO_CREDIT,
  audit: {
    strengths: [
      'Nútímaleg netverslun með reikningum, hreyfingarlista, pöntunarsögu og vistuðum söfnum fyrir fyrirtæki í reikningsviðskiptum',
      'Framúrskarandi fyrirtæki níu ár í röð og nýjar höfuðstöðvar þar sem vöruhús og þjónusta eru undir einu þaki',
      'Eigin myndir af verkum um allt land og vandaðar fréttir af hverju þeirra',
    ],
    weaknesses: [
      'robots.txt bannar leitarvélum /vorur, svo engin vörusíða kemur upp þegar rafvirki leitar að vörunúmeri á Google',
      'Hver viðburður er smíðaður sem tvær stakar síður (skráning og takk), 46 slíkar síður hafa safnast upp, og ekkert dagatal sýnir þá alla',
      'Í fæti vefsins stendur enn „Allur réttur áskilinn 2025“ og í opinberum kóða síðunnar sést textinn „Impersonating as ( )“',
    ],
    opportunities: [
      'Efnislisti úr teikningu eða Excel lesinn sjálfkrafa yfir á vörunúmer og sendur sem tilboðsbeiðni á réttan klasa',
      'Aðstoðarmaður á vefnum sem svarar út frá vörulista, lager, skilmálum og viðburðum og sendir málið á réttan mann',
      'Eitt dagatal fyrir öll námskeið og kynningar, með sætafjölda, biðlista og dagatalsboði',
    ],
  },
  outreach: {
    subject: 'Hugmynd að nýjum vef og kerfum fyrir Reykjafell',
    body:
      "Sæll Einar,\n\nÉg heiti Sindri Már og rek SNDR Studio, þar sem ég hanna og smíða nútímalegar, stílhreinar vefsíður, bókunarkerfi og netverslanir fyrir íslensk fyrirtæki.\n\nMarkmiðið er að búa til veflausnir sem endurspegla fyrirtækið, einfalda daglegan rekstur og spara tíma. Ég sé jafnframt um hýsingu, viðhald og reglulegar uppfærslur, svo vefurinn haldist hraður, öruggur og í takt við þær miklu tæknibreytingar sem eiga sér stað.\n\nTil hamingju með nýja starfið, og með sjötíu árin og nýju höfuðstöðvarnar á Blikastaðavegi. Ég skoðaði vef Reykjafells vel og hreifst af því hvað fyrirtækið kemur víða við, allt frá gatnamótunum á Bíldshöfða sem gervigreind stýrir og 36 kV jarðstrengjunum fyrir RARIK yfir í lýsinguna á Safnahúsinu á Ísafirði. Netverslunin er líka öflug, en tvennt vakti athygli mína. Stillingar vefsins banna leitarvélum að skrá vörusíðurnar, svo rafvirki sem slær vörunúmer inn í Google finnur ekki síðu Reykjafells, og hvert námskeið og hver kynning fær sína eigin skráningarsíðu og staðfestingarsíðu, sem eru orðnar 46 talsins.\n\nÉg gerði því frumgerð að nýjum vef úr efni sem Reykjafell hefur sjálft birt, og hana má skoða hvenær sem er á [HLEKKUR Á FRUMGERÐ] þar sem hún virkar líka vel í síma. Þar má líma inn efnislista úr teikningu eða Excel og fá hann lesinn yfir á vörunúmer með lagerstöðu, senda hann sem tilboðsbeiðni beint á þann sem sér um viðkomandi klasa, sjá öll námskeið á einu dagatali og fá svör um þjónustu áður en hringt er. Þar er líka aðstoðarmaður sem þekkir vörulistann, lagerinn og skilmálana og svarar spurningum viðskiptavina allan sólarhringinn. Í frumgerðinni er ekkert sent, beiðnirnar opnast sem tölvupóstur.\n\nÞessi frumgerð kostar ykkur ekki neitt og henni fylgir engin skuldbinding. Mig langar að sýna ykkur hana í stuttu símtali eða á fundi á Blikastaðavegi, en ef ekki er það að sjálfsögðu allt í lagi.\n\nBestu kveðjur,\nSindri Már\n845-1758\nsndrstudio.is",
  },
  positioning:
    'Reykjafell er heildsala fyrir fagfólk í rafiðnaði í 70 ár. Frumgerðin byggir á þeirra eigin vörum, lager, verkum, fólki og skilmálum, og bætir við kerfum sem spara sölu- og þjónustufólki tíma: efnislisti að tilboði, viðburðadagatal, þjónustuleiðsögn og aðstoðarmaður.',
}

export type { Vara as Product }
export const vorurEftirFlokki = (fam: string) => VORUR.filter((v) => v.fam === fam)
export const starfsmadur = (uid: string) => STARFSFOLK.find((s) => s.uid === uid)
