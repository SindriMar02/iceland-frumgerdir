import type { PreviewCompany } from '../company-types'

const BASE = import.meta.env.BASE_URL

/* Editorial layer. Every fact below is Ísfugl's own, read off isfugl.is on
   2026-09-30: Um Ísfugl, Fyrirtækið, Fuglarnir okkar, Ísfuglsbændur and the four
   farm pages (Heiðarbær I, Hjallakrókur, Neslækur, Reykjabúið), Kjúklingur and
   Kalkúnn, Innihaldslýsingar (both), Sölustaðir, Starfsfólk and the footer.
   Nothing is invented: no prices, no reviews, no awards beyond
   what their pages state (opening hours are the ones in their footer). Names of children and of the deceased are left out.
   The farm badges ("Frá fjölskyldubúinu ...") are rebuilt on the pattern of
   their own campaign badges, with their own portraits. */

export const FYRIRTAEKI = {
  nafn: 'Ísfugl',
  logadi: 'Ísfugl ehf.',
  kt: '671087-1439',
  heimili: 'Reykjavegi 36, 270 Mosfellsbæ',
  simi: '566 6103',
  simiHref: 'tel:+3545666103',
  netfang: 'isfugl@isfugl.is',
  facebook: 'https://www.facebook.com/isfuglehf',
  vefur: 'https://isfugl.is',
  opnun: 'Mán.-fim. 9-16, fös. 9-15',
}

/* The four families the site presents as "Bændurnir okkar". Text is theirs, cut
   down; the numbers are the ones printed on each farm's own page. */
export const BAEIR = [
  {
    id: 'reykjabuid',
    n: 'Reykjabúið',
    stadur: 'Suður-Reykjum I, Mosfellsbæ',
    medal: 'reykjabuid',
    fyrirsogn: '„Alltaf að leita að einhverju sem má betrumbæta“',
    mynd: 'b-reykjabuid', mynd2: 'b-reykjabuid2', hlekkur: 'https://isfugl.is/isfuglsbaendur/reykjabuid/',
    texti:
      'Jón Magnús Jónsson og Kristín Sverrisdóttir reka stofnfuglarækt fyrir kalkúna og kjúklinga Ísfuglsbænda á Reykjabúinu og eru einnig með eldi annars staðar. Þau tóku alfarið yfir rekstur Ísfugls árið 2012.',
    tolur: [['750 t', 'kjúklingur á ári'], ['250 t', 'kalkúnn á ári'], ['9', 'eldisstaðir'], ['1948', 'kalkúnarækt hefst']],
    vidbot: 'Kalkúnar Ísfugls koma allir frá Reykjabúinu, eina búinu á Íslandi sem ræktar kalkúna.',
  },
  {
    id: 'heidarbaer',
    n: 'Heiðarbær I',
    stadur: 'Þingvallasveit',
    medal: 'heidarbaer',
    fyrirsogn: '„Allt á sama hlaðinu; kindur, hestar, kjúklingar, krakkar og kettir“',
    mynd: 'b-heidarbaer', mynd2: 'b-heidarbaer-skilti', hlekkur: 'https://isfugl.is/isfuglsbaendur/heidarbaer-1/',
    texti:
      'Jóhannes Sveinbjörnsson og Ólöf Björg Einarsdóttir reka blandað bú með sauðfé, kjúklingum og silungsveiði í Þingvallavatni. Þau tóku við kjúklingabúinu árið 2008.',
    tolur: [['2.800', 'fuglar í húsinu'], ['30-35 t', 'á ári'], ['1,6-1,8 kg', 'þyngd fuglanna'], ['1997', 'húsið byggt']],
    vidbot: 'Búið er með minnstu kjúklingabúum landsins.',
  },
  {
    id: 'hjallakrokur',
    n: 'Hjallakrókur',
    stadur: 'Ölfusi',
    medal: 'hjallakrokur',
    fyrirsogn: '„Ölfusingur í húð og hár“',
    mynd: 'b-hjallakrokur', mynd2: 'h-hjallakrokur', hlekkur: 'https://isfugl.is/isfuglsbaendur/hjallakrokur/',
    texti:
      'Jón Ögmundsson rekur búið að Hjallakróki ásamt eiginkonu sinni, Elínu Hörpu Jóhannsdóttur. Hann keypti Hjallakrók árið 1989 og ræktar líka gulrófur, kartöflur og gulrætur.',
    tolur: [['260 t', 'á ári'], ['4', 'eldishús'], ['1994', 'kjúklingarækt hefst'], ['90-100 t', 'grænmeti á ári']],
    vidbot: 'Kjúklingaskíturinn er ljómandi góður áburður sem nýtist við ræktun grænmetisins.',
  },
  {
    id: 'neslaekur',
    n: 'Neslækur',
    stadur: 'Ölfusi',
    medal: 'neslaekur',
    fyrirsogn: '„Af sjónum í sveitina“',
    mynd: 'b-neslaekur', mynd2: 'b-neslaekur2', hlekkur: 'https://isfugl.is/isfuglsbaendur/neslaekur/',
    texti:
      'Kristján Karl Gunnarsson fer fyrir starfsemi Neslæks. Kjúklingarækt hófst árið 2013 og nýtt 500 fermetra hús var tekið í notkun vorið 2015.',
    tolur: [['120 t', 'á ári'], ['500 m²', 'húsið frá 2015'], ['2013', 'ræktun hefst'], ['2x', 'eftirlit á dag']],
    vidbot: 'Kristján vann áður fyrir Jón Magnús og Kristínu á Reykjum og öðlaðist þar mikla reynslu.',
  },
] as const
export type Bar = (typeof BAEIR)[number]

/* Their own words, verbatim (Um Ísfugl). */
export const TILVITNUN =
  'Ísfugl leggur ríka áherslu á að neytendur geti séð á umbúðum vörunnar frá hvaða búi hún kemur.'

/* Who answers for what. Names, roles and the published address or number are from
   their Starfsfólk page. */
export const ERINDI = [
  {
    nafn: 'Verslun eða mötuneyti',
    nota: 'Helgi B. Sigurðsson sölustjóri tekur við pöntunum og fyrirspurnum um verð. Elvar og Elías eru einnig í söludeild.',
    hlekkur: 'mailto:helgi@isfugl.is?subject=Fyrirspurn', ord: 'Skrifa Helga', sima: '842 1990',
  },
  {
    nafn: 'Gæði og vottun',
    nota: 'Jóhanna Logadóttir Hólm er gæða- og skrifstofustjóri. Sýnatökuvottorð fylgja öllum reikningum þegar vara er seld.',
    hlekkur: 'mailto:johanna@isfugl.is?subject=G%C3%A6%C3%B0i', ord: 'Skrifa Jóhönnu', sima: '861 9160',
  },
  {
    nafn: 'Bændurnir',
    nota: 'Jón Magnús Jónsson er framkvæmdastjóri. Hann og Kristín Sverrisdóttir reka Reykjabúið og eiga Ísfugl.',
    hlekkur: 'mailto:reykjabuid@kalkunn.is?subject=B%C3%A6ndur', ord: 'Skrifa Jóni Magnúsi', sima: '892 1145',
  },
  {
    nafn: 'Reikningar',
    nota: 'Vera Kristborg Stefánsdóttir sér um bókhald. Rannveig Lena Gísladóttir er fjármálastjóri.',
    hlekkur: 'mailto:vera@isfugl.is?subject=Reikningar', ord: 'Skrifa Veru', sima: '566 6103',
  },
]
export const STUTT = ['Pantanir og verð', 'Umbúðir, sýni og vottun', 'Búin og fuglarnir', 'Bókhald og greiðslur']

export const TEYMI = [
  { nafn: 'Jón Magnús Jónsson', hlutverk: 'Framkvæmdastjóri', netfang: 'reykjabuid@kalkunn.is' },
  { nafn: 'Helgi B. Sigurðsson', hlutverk: 'Sölustjóri', netfang: 'helgi@isfugl.is' },
  { nafn: 'Jóhanna Logadóttir Hólm', hlutverk: 'Gæða- og skrifstofustjóri', netfang: 'johanna@isfugl.is' },
  { nafn: 'Þorsteinn Þórhallsson', hlutverk: 'Sláturhússtjóri', netfang: 'steini@isfugl.is' },
]

export const TEXTI = {
  heroLinur: ['Frá íslenskum', 'bændum sem við', 'þekkjum og'],
  heroAr: 'treystum.',
  heroUndir: 'Allt ferskt og óunnið kjöt frá Ísfugli er rekjanlegt til bónda.',
  fotur: 'Frá íslenskum bændum',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ísfugl',
  legalName: 'Ísfugl ehf.',
  url: 'https://isfugl.is',
  telephone: '+354 566 6103',
  email: 'isfugl@isfugl.is',
  sameAs: ['https://www.facebook.com/isfuglehf'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Reykjavegi 36',
    postalCode: '270',
    addressLocality: 'Mosfellsbær',
    addressCountry: 'IS',
  },
}

/* ---- the hero scatter: seven real photographs from their 2014 shoot ---- */
export type Reitur = { img: string; n: string; pos?: string; medal?: string }
export const HERO_REITIR: Reitur[] = [
  { img: 'ph/h-reykjabuid', n: 'Fjölskyldan á Reykjabúinu', pos: '50% 40%', medal: 'reykjabuid' },
  { img: 'ph/h-kalkunn', n: 'Kalkúnar á Reykjabúinu', pos: '40% 40%' },
  { img: 'ph/h-heidarbaer', n: 'Fjölskyldan á Heiðarbæ I', pos: '50% 45%', medal: 'heidarbaer' },
  { img: 'ph/h-hjallakrokur', n: 'Bóndinn í Hjallakróki', pos: '50% 22%', medal: 'hjallakrokur' },
  { img: 'ph/h-ungar', n: 'Nýklaktir ungar', pos: '50% 50%' },
  { img: 'ph/h-neslaekur', n: 'Neslækur í Ölfusi', pos: '50% 35%', medal: 'neslaekur' },
  { img: 'ph/h-rettur', n: 'Réttur úr uppskrift Ísfugls', pos: '50% 50%' },
]

/* ---- the sentence with cycling picture chips ---- */
export type Biti = { t: string } | { n: string; ground: string; b?: number }
export const SETNING: Biti[][] = [
  [{ t: 'Kjúklingur' }, { n: 'Kjúklingur', ground: '#D3BC94' }, { t: 'og kalkúnn' }, { n: 'Kalkúnn', ground: '#C4AA7E' }],
  [{ t: 'frá bæjum í Ölfusi,' }],
  [{ t: 'Mosfellsbæ, Þingvallasveit,' }],
  [{ t: 'Biskupstungum og' }, { n: 'Bæirnir', ground: '#DFCBA9', b: 1.2 }, { t: 'Sandgerði.' }],
]
export const SETNING_HRINGUR: Record<string, string[]> = {
  Kjúklingur: ['ct/kjuklingabringur', 'ct/kjuklingaleggir', 'ct/kjuklingavaengir', 'ct/heill-kjuklingur', 'ct/kjuklingalundir', 'ct/kjuklingalaeri'],
  Kalkúnn: ['ct/kalkunabringur', 'ct/kalkunahakk', 'ct/kalkunastrimlar', 'ct/kalkunalaeri-urbeinud', 'ct/kalkunaskip'],
  Bæirnir: ['m/reykjabuid', 'm/heidarbaer', 'm/hjallakrokur', 'm/neslaekur'],
}

/* ---- the two product panels: a bird and its cuts. Swatches are round pictures of
   the cut; the line under the name is the nutrition their own sheet prints. ---- */
export const SPJOLD = [
  {
    merki: 'Kjúklingur', titill: 'Kjúklingur', fugl: 'kjuklingur' as const,
    tegundir: [
      { n: 'Heill kjúklingur', vara: 'Heill kjúklingur', mynd: 'heill-kjuklingur' },
      { n: 'Bringur', vara: 'Kjúklingabringur 100%', mynd: 'kjuklingabringur' },
      { n: 'Lundir', vara: 'Kjúklingalundir', mynd: 'kjuklingalundir' },
      { n: 'Læri', vara: 'Kjúklingalæri', mynd: 'kjuklingalaeri' },
      { n: 'Leggir', vara: 'Kjúklingaleggir', mynd: 'kjuklingaleggir' },
      { n: 'Vængir', vara: 'Kjúklingavængir', mynd: 'kjuklingavaengir' },
      { n: 'Kryddaður í ofn', vara: 'Kjúklingur, kryddaður í ofn', mynd: 'kryddadur-kjuklingur' },
    ],
  },
  {
    merki: 'Kalkúnn · aðeins frá Reykjabúinu', titill: 'Kalkúnn', fugl: 'kalkunn' as const,
    tegundir: [
      { n: 'Bringur', vara: 'Kalkúnabringur', mynd: 'kalkunabringur' },
      { n: 'Læri', vara: 'Kalkúnalæri, úrbeinuð, fersk', mynd: 'kalkunalaeri-urbeinud' },
      { n: 'Strimlar', vara: 'Kalkúnastrimlar', mynd: 'kalkunastrimlar' },
      { n: 'Grillsneiðar', vara: 'Kalkúnagrillsneiðar', mynd: 'kalkunagrillsneidar' },
      { n: 'Hakk', vara: 'Kalkúnahakk 100%', mynd: 'kalkunahakk' },
      { n: 'Bringuskip', vara: 'Kalkúnaskip, smjörsprautað', mynd: 'kalkunaskip' },
    ],
  },
]

/* The three cards under "Gæðin byrja á bænum". Each is a sentence on their pages. */
export const KORT3 = [
  { m: 'Ísfuglsbændur', t: 'Engin fúkkalyf við eldi fuglanna', nr: '01', img: 'ph/g-vatnsstod' },
  { m: 'Á umbúðunum', t: 'Nafn búsins sem ræktaði fuglinn', nr: '02', img: 'm/heidarbaer' },
  { m: 'Matvælastofnun', t: 'A-vottun, fyrst alifuglasláturhúsa á landinu', nr: '03', img: 'ph/g-hvitur-kittill' },
]

/* The gallery strip: sixteen pictures from the 2014 shoot. `n` is the plain
   subject; nothing here names a person. */
export const GALLERI = [
  { img: 'g-drattarvel', n: 'Bóndi með dráttarvél', k: 'Bændurnir' },
  { img: 'g-ungar', n: 'Nýklaktir ungar', k: 'Fuglarnir' },
  { img: 'g-vinnsla', n: 'Færibandið í sláturhúsinu', k: 'Sláturhúsið' },
  { img: 'g-baendur-hoenur', n: 'Tveir bændur með hænur', k: 'Bændurnir' },
  { img: 'g-haena', n: 'Hæna', k: 'Fuglarnir' },
  { img: 'g-rettur-vaengir', n: 'Vængir með salsa', k: 'Réttirnir' },
  { img: 'g-fedgar', n: 'Faðir og sonur með hænur', k: 'Bændurnir' },
  { img: 'g-egg-karfa', n: 'Egg í körfu', k: 'Fuglarnir' },
  { img: 'g-starfsfolk', n: 'Vinnsla í sláturhúsi', k: 'Sláturhúsið' },
  { img: 'g-kalkunar', n: 'Kalkúnar', k: 'Fuglarnir' },
  { img: 'g-strakur-ungi', n: 'Drengur með unga í körfu', k: 'Bændurnir' },
  { img: 'g-egg-kalkuna', n: 'Kalkúnaegg', k: 'Fuglarnir' },
  { img: 'g-bakki', n: 'Bakki úr ofninum', k: 'Sláturhúsið' },
  { img: 'g-rettur-glaser', n: 'Gljáður kjúklingur', k: 'Réttirnir' },
  { img: 'g-bill', n: 'Ferskt kjöt á leið til verslana', k: 'Sláturhúsið' },
  { img: 'g-vatnsstod', n: 'Ungar við vatnsstöð', k: 'Fuglarnir' },
]

/* The history as a table: a group label, then rows with the year (or time) right. */
export const SOGUHOPAR = [
  { h: 'Reykjabúið', r: [
    { t: 'Kalkúnarækt hefst á Reykjabúinu, því eina á landinu sem ræktar kalkúna', a: '1948' },
    { t: 'Jón M. Guðmundsson reisir lítið fuglasláturhús á Reykjum', a: '1962' },
  ] },
  { h: 'Ísfugl', r: [
    { t: 'Sláturhús og kjötvinnsla reist á Reykjavegi. Úrbeining kjúklingakjöts hefst hér á landi', a: '1979' },
    { t: 'Jón Magnús Jónsson og Kristín Sverrisdóttir taka við rekstri Ísfugls', a: '2012' },
  ] },
  { h: 'Bændurnir', r: [
    { t: 'Jón Ögmundsson hefur kjúklingarækt í Hjallakróki', a: '1994' },
    { t: 'Kjúklingahús byggt á Heiðarbæ I', a: '1997' },
    { t: 'Kjúklingarækt hefst á Neslæk, nýtt hús tekið í notkun 2015', a: '2013' },
  ] },
  { h: 'Frá eggi til unga', r: [
    { t: 'Hani er með hænunum og þær verpa í varphreiður' },
    { t: 'Eggin eru tínd og sett í útungunarvél' },
    { t: 'Ungarnir klekjast úr eggjunum', a: '3 vikur' },
    { t: 'Fluttir í eldishús Ísfuglsbænda', a: '1 dags' },
  ] },
  { h: 'Í dag', r: [
    { t: 'Ísfugl framleiðir um 20% af innlendu alifuglakjöti og er minnsta fyrirtækið á því sviði', a: '20%' },
    { t: 'A-vottun frá Matvælastofnun, fyrst alifuglasláturhúsa á landinu', a: 'A' },
  ] },
] as { h: string; r: { t: string; a?: string }[] }[]

/* Spurt og svarað: every answer is a sentence already on isfugl.is. */
export const SPURT = [
  { q: 'Hvernig sé ég frá hvaða bónda kjötið kemur?', a: 'Nafn búsins kemur fram á umbúðum vörunnar. Allt ferskt og óunnið kjöt frá Ísfugli er rekjanlegt til bónda: um leið og unginn kemur úr egginu fær hann rekjanleikanúmer sem fylgir honum allt til enda.' },
  { q: 'Nota bændurnir fúkkalyf?', a: 'Nei. Ísfuglsbændur nota engin fúkkalyf við eldi kjúklinganna og kalkúnanna.' },
  { q: 'Hvað eru fuglarnir gamlir við slátrun?', a: 'Kjúklingar eru 4 til 5 vikna gamlir og um 1,25 kg að meðaltali í neytendapakkningu. Kalkúnar eru 8 til 12 vikna og á bilinu 6 til 10 kg.' },
  { q: 'Hvað er ábati?', a: 'Til að kjúklingabringur ofþorni ekki þegar þær eru eldaðar er í þær settur svokallaður ábati, að uppistöðu vatn með sykri og salti. Hjá Ísfugli er hann aldrei meiri en 10% af þyngd vörunnar. Ísfugl framleiðir líka vörur sem eru 100% kjöt, án aukefna.' },
  { q: 'Hvernig er eftirlitið?', a: 'Sýni eru tekin úr öllum eldishópum áður en þeir koma til slátrunar og annað sýni í sláturhúsi til staðfestingar. Eftirlitsdýralæknir Matvælastofnunar hefur daglegt eftirlit með góðum starfsháttum og velferð fuglanna.' },
  { q: 'Hvað er Skráargatið?', a: 'Samnorrænt merki fyrir vörur með minni og hollari fitu, minni sykur og minna salt en aðrar vörur í sama flokki. Það er keppikefli hjá Ísfugli að sem flestar vörur uppfylli kröfur þess.' },
  { q: 'Hvar fást vörurnar?', a: 'Í Nettó, Iceland, Krambúðinni, Kjörbúðinni og fleiri verslunum um allt land. Listinn er hér að ofan.' },
]

/* Uppskriftir: seven groups. The cover is one of the pictures; the description
   names three real recipes in the group. */
export const HOPAR = [
  { s: 'bringur', t: 'Bringur og lundir', cover: 402, g: '#C4AA7E', d: 'Tandoori-kjúklingur, kjúklingabringur Orvieto og fylltar kalkúnabringur.' },
  { s: 'heill', t: 'Heill fugl', cover: 1628, g: '#D3BC94', d: 'Kalkúnn með sveppafyllingu, kjúklingur í laukbaði og súrsætur kjúklingur.' },
  { s: 'leggir', t: 'Leggir, læri og vængir', cover: 490, g: '#DFCBA9', d: 'Hunangsvængir, kalkúnatrommukjuðar og fyllt kalkúnalæri.' },
  { s: 'hakk', t: 'Hakk og bollur', cover: 1944, g: '#C4AA7E', d: 'Kalkúnaborgari, kalkúnalasagne og indverskar kalkúnabollur.' },
  { s: 'grill', t: 'Grillréttir', cover: 424, g: '#D3BC94', d: 'Satay-kjúklingur, kjúklingakebab og ítalskir kabobs-pinnar.' },
  { s: 'salat', t: 'Salöt og súpur', cover: 468, g: '#DFCBA9', d: 'Kalkúnasalat með avókadó, Ísfuglssúpa og rómantísk kjúklingasúpa.' },
  { s: 'bitar', t: 'Réttir með bitum', cover: 416, g: '#C4AA7E', d: 'Marokkóskur pottréttur, kjúklingur með kanil og döðlum og sítrónukjúklingur.' },
]

/* The photographs on the four "Um" images and the FAQ card. */
export const FAQ_MYNDIR = ['ph/g-haena', 'ph/g-ungar', 'ph/g-kalkunar', 'ph/g-egg-karfa', 'ph/g-rettur-vaengir', 'ph/k-kjuklingur-steiktur']

export const companyEntry: PreviewCompany = {
  slug: 'isfugl',
  route: '/preview/isfugl',
  name: 'Ísfugl',
  sector: 'Alifuglarækt, sláturhús og kjötvinnsla',
  location: 'Reykjavegi 36, 270 Mosfellsbæ',
  region: 'Kjúklingur og kalkúnn af fjölskyldubúum, seldur í verslunum um allt land',
  established: 'Sláturhús og kjötvinnsla á Reykjavegi frá 1979, forveri frá 1962.',
  currentUrl: 'https://isfugl.is',
  ownerEmail: 'isfugl@isfugl.is',
  concept: 'Frá íslenskum bændum sem við þekkjum og treystum',
  conceptTagline:
    'Ísfugl segir á umbúðunum frá hvaða búi kjötið kemur. Vefurinn byrjar á fjölskyldunum fjórum og lætur hverja uppskrift, hvern skurð og hvern sölustað vísa aftur á bæinn.',
  accent: '#AD1122',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}isfugl/ph/h-reykjabuid.webp`,
  ownPhotography: true,
  photoCredit:
    'Ljósmyndir af bændum, fuglum, bæjum og sláturhúsi eru úr myndasafni Ísfugls á isfugl.is. ' +
    'Myndirnar af uppskriftum og skurðum eru sviðsettar með gervigreind í stíl við þá myndatöku til að sýna hvernig vefurinn gæti litið út með myndum; þær eru ekki ljósmyndir Ísfugls og koma í staðinn þegar fyrirtækið á sínar.',
  audit: {
    strengths: [
      'Fagleg myndataka frá 2014: bændur, fuglar, bæir, sláturhús og fimm réttir',
      'Nafn búsins á umbúðunum og rekjanleiki til bónda á öllu fersku og óunnu kjöti',
      'Næringargildi og innihald allra 26 vara á opnum síðum',
    ],
    weaknesses: [
      'Forsíðan er renna með áletruðum myndum, fjórir tenglar og um 620 stafir af texta',
      'Allar 79 uppskriftirnar á vefnum eru án mynda, þótt myndir af réttum liggi í myndasafninu',
      'Rekjanleikaloforðið („þú sérð frá hvaða Ísfuglsbónda kjötið þitt kemur“) stendur á síðu um fyrirtækið en ekki þar sem kaupandinn er',
      'WordPress 5.5.22 og jQuery 1.12.4, viðmótið stöðvar aðdrátt í síma og ein mynd á forsíðu er biluð',
    ],
    opportunities: [
      'Hvert bú með sína síðu og sitt merki, eins og herferðin „Bændurnir okkar“ 2017',
      'Uppskriftir með myndum sem leiða að skurðinum sem þarf og að sölustað í nágrenninu',
    ],
  },
  positioning:
    'Ísfugl er minnsta fyrirtækið á sínu sviði og framleiðir um fimmtung íslensks alifuglakjöts. Nafn bóndans stendur á umbúðunum. Vefurinn á að gera það að aðalatriði og láta uppskriftir, skurði og sölustaði vísa aftur á bæinn.',
  outreach: { subject: '', body: '' },
}
