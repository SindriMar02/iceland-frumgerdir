import type { PreviewCompany } from '../company-types'

const BASE = import.meta.env.BASE_URL

/* Editorial layer. Every fact below is Málning's own, read off malning.is on
   2026-09-29 (front page, Um Málningu, Sölustaðir, Litakort, the product pages
   and their data-sheet PDFs) or off Skatturinn (company register) the same day.
   The colour library is estimated from their own printed Kópal colour card, and
   the interface says so. Nothing is invented: no prices, no reviews, no
   customer list, no claim that a dealer accepts a colour sent from here. */

export const FYRIRTAEKI = {
  nafn: 'Málning hf.',
  kt: '450269-4849',
  stofnad: '1953',
  heimilisfang: 'Dalvegi 18',
  postnumer: '201 Kópavogur',
  simi: '580 6000',
  simiHref: 'tel:+3545806000',
  netfang: 'malning@malning.is',
  vefur: 'https://malning.is',
  fax: '580 6001',
}

export const OPNUN = [
  { d: 'Mánudaga til föstudaga', t: '07:30 til 18:00' },
  { d: 'Laugardaga', t: '10:00 til 14:00' },
  { d: 'Sunnudaga', t: 'Lokað' },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Málning',
  legalName: 'Málning hf.',
  url: 'https://malning.is',
  telephone: '+354 580 6000',
  email: 'malning@malning.is',
  foundingDate: '1953',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dalvegi 18',
    postalCode: '201',
    addressLocality: 'Kópavogur',
    addressCountry: 'IS',
  },
}

/* ------------------------------------------------------------------ *
 * Copy
 * ------------------------------------------------------------------ */
export const TEXTI = {
  augnamerki: 'Málning hf. síðan 1953',
  heroA: 'Málning í',
  heroB: 'þínum lit.',
  heroUnder: 'Skoðaðu litina, blandaðu þinn eigin og sendu hann til söluaðila eða söludeildar Málningar.',
  heroTakki: 'Blanda lit',

  vorurTitill: 'Finndu þína málningu',
  vorurUnder: 'Öll framleiðsla Málningar, með efnisnotkun og yfirmálunartíma úr vörulýsingunum.',

  blandariTitillA: 'Blandaðu',
  blandariTitillB: 'þinn lit.',
  blandariUnder:
    'Bættu dropum af litarefnum út í hvítan grunn og sjáðu litinn á veggnum. Nálægasti litur úr Kópal litakortinu birtist um leið.',
  blandariVidvorun:
    'Ekki er allt sem sýnist í litakortum eða tölvuskjám. Fersk litaprufa af litnum gefur raunverulegustu myndina af litnum.',

  litakortTitill: 'Litakort Kópal',
  litakortUnder:
    'Áttatíu litir af Kópal innilitakortinu. Litirnir hér eru áætlaðir út frá skönnuðu, prentuðu korti, svo litaðu prufu áður en þú málar.',

  verkTitill: 'Hvað þarf ég?',
  verkUnder:
    'Veldu vöru og stærð flatarins. Tölurnar koma úr vörulýsingum Málningar: efnisnotkun á fermetra og tíminn þar til næsta umferð má fara á.',

  framleittTitill: 'Framleitt í Kópavogi',
  framleittUnder:
    'Málning er eina málningarverksmiðjan á Íslandi sem notar alfarið eigin uppskriftir við framleiðsluna.',

  solustadirTitill: 'Hvar fæst Málning?',
  solustadirUnder:
    'Málning selur í gegnum söluaðila um allt land og í söludeildinni á Dalvegi.',

  spurtTitill: 'Spurt og svarað',
  fotur: 'Endalaust litaúrval.',
}

/* The three tiles under "Framleitt í Kópavogi". Each line is Málning's own. */
export const FLISAR = [
  {
    m: 'Svansmerkt',
    t: 'Flestar gerðir Kópal-málningar bera Svansmerkið, norræna umhverfismerkið.',
    mynd: 'hero-haegri',
  },
  {
    m: 'Eigin uppskriftir',
    t: 'Verksmiðjan í Kópavogi og rannsóknarstofan fylgjast með hráefnum og framleiðslu.',
    mynd: 'steinn-hvitt',
  },
  {
    m: 'Íslenskar aðstæður',
    t: 'Steinakrýl er hannað fyrir múr og steinsteypu við íslenskar aðstæður, og Steinskjól má mála með allt niður að 0°C.',
    mynd: 'vidur-vetur',
  },
]

/* Every answer below is taken from Málning's own pages or data sheets. */
export const SPURT = [
  {
    s: 'Hvað þarf ég mikla málningu?',
    sv:
      'Í vörulýsingu hverrar vöru stendur efnisnotkun á hvern fermetra í umferð, til dæmis um 0,10 lítra fyrir Kópal 10. Verkreiknirinn hér notar þessar tölur.',
  },
  {
    s: 'Hvenær má mála næstu umferð?',
    sv:
      'Kópal 10 má yfirmála eftir 4 til 8 klukkustundir, eftir aðstæðum. Hver vara hefur sinn tíma í vörulýsingunni og hann birtist í reiknivélinni.',
  },
  {
    s: 'Er Kópal umhverfisvæn málning?',
    sv:
      'Flestar gerðir Kópal-málningar bera Svansmerkið, norræna umhverfismerkið, og innihalda engin lífræn leysiefni, ammóníak eða formaldehýð.',
  },
  {
    s: 'Fæst málningin í mínum lit?',
    sv:
      'Kópal 10 er framleidd í nokkrum staðallitum og að auki er boðið upp á mikinn fjölda lita með litun á Kópal Glitru í stofnum. Kjörvari fæst í þúsundum lita þegar hann á að hylja viðinn og í yfir 300 litbrigðum þegar hann á að vera gagnsær.',
  },
  {
    s: 'Má mála úti í kulda?',
    sv:
      'Steinskjól má mála með allt niður að 0°C. Lágmarks vinnsluhitastig hverrar vöru stendur í vörulýsingunni, til dæmis um 5°C fyrir Kópal 10.',
  },
  {
    s: 'Hvar fæ ég málninguna?',
    sv:
      'Hjá söluaðilum um allt land og í söludeild Málningar á Dalvegi 18. Söludeildin er opin á virkum dögum 07:30 til 18:00 og á laugardögum 10:00 til 14:00.',
  },
]

/* Sölustaðir, as listed on malning.is/solustadir-malningar (2026-09-29). */
export const SOLUSTADIR: { hopur: string; nofn: { n: string; s: string; simi: string }[] }[] = [
  {
    hopur: 'Höfuðborgarsvæðið',
    nofn: [
      { n: 'Málning hf., söludeild', s: 'Dalvegi 18, Kópavogi', simi: '580 6000' },
      { n: 'Bauhaus', s: 'Lambhagavegi 2, Reykjavík', simi: '515 0800' },
      { n: 'BYKO Fiskislóð', s: 'Fiskislóð, Reykjavík', simi: '535 9400' },
      { n: 'BYKO Breidd', s: 'Breiddinni, Kópavogi', simi: '515 4001' },
    ],
  },
  {
    hopur: 'Suðurnes og Vesturland',
    nofn: [
      { n: 'BYKO Suðurnes', s: 'Víkurbraut 4, Keflavík', simi: '421 7000' },
      { n: 'Smiðjan Fönix', s: 'Smiðjuvegi 6, Hellissandi', simi: '436 6500' },
    ],
  },
  {
    hopur: 'Norðurland',
    nofn: [
      { n: 'Lífland', s: 'Blönduósi', simi: '540 1155' },
      { n: 'Villi Vall', s: 'Hvammstanga', simi: '898 2063' },
      { n: 'BYKO Akureyri', s: 'Óðinsnesi 2, Akureyri', simi: '460 4800' },
      { n: 'Verslunin Valberg', s: 'Strandgötu 4, Ólafsfirði', simi: '466 2255' },
    ],
  },
  {
    hopur: 'Austurland og Suðurland',
    nofn: [
      { n: 'Launafl', s: 'Hrauni 3, Reyðarfirði', simi: '414 9400' },
      { n: 'Verslunin Pan', s: 'Egilsbraut 6, Neskaupstað', simi: '477 1900' },
      { n: 'BYKO Selfossi', s: 'Selfossi', simi: '480 4600' },
      { n: 'Miðstöðin', s: 'Strandvegi 30', simi: '481 7475' },
    ],
  },
]

export const VELJA_SENDANDA = [
  { id: 'malning', n: 'Söludeild Málningar', t: 'malning@malning.is', simi: '580 6000' },
  { id: 'solustadur', n: 'Söluaðili sem ég vel', t: 'Sýni kóðann í verslun', simi: '' },
]

/* ------------------------------------------------------------------ *
 * The entry for the preview gallery (companies.ts pushes this)
 * ------------------------------------------------------------------ */
export const companyEntry: PreviewCompany = {
  slug: 'malning',
  route: '/preview/malning',
  name: 'Málning',
  sector: 'Málningarframleiðsla',
  location: 'Dalvegi 18, 201 Kópavogur',
  region: 'Kópal, Kjörvari og Steinvari í verslunum um allt land',
  established: 'Stofnuð 1953, eina málningarverksmiðja landsins með eigin uppskriftir.',
  currentUrl: 'https://malning.is',
  ownerEmail: 'malning@malning.is',
  concept: 'Málning í þínum lit',
  conceptTagline:
    'Vefur sem selur lit: litakortið á einum stað, blandari sem sýnir litinn á veggnum og býr til litakóða, ' +
    'og reiknivél sem byggir á tölunum í vörulýsingum Málningar.',
  accent: '#222221',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}malning/ph/skipt-herbergi-640.webp`,
  ownPhotography: true,
  photoCredit:
    'Ljósmyndir, vörumyndir, merki og litakort eru í eigu Málningar hf. og sótt af malning.is og úr litakortum þeirra 29. september 2026.',
  audit: {
    strengths: [
      'Vörulýsing með efnisnotkun, þurrktíma og yfirmálunartíma við nánast hverja vöru',
      'Sölustaðalisti með símanúmerum um allt land',
      'Sterkar auglýsingaljósmyndir, meðal annars herbergi málað í tveimur litum',
    ],
    weaknesses: [
      'Litakortin eru fjögur PDF skjöl frá 2014 til 2021 og enginn stafrænn litavefur',
      'Fóturinn segir 2021 og nýjasta fréttin er frá nóvember 2018',
      'Forsíðan sækir um 10 MB á síma, þar af ein mynd 3,8 MB',
      'Ekkert skref frá því að velja lit til þess að fá hann hjá söluaðila',
    ],
    opportunities: [
      'Systurfyrirtækið Slippfélagið er komið með stafrænan litavef og reiknivélar, Málning ekki',
      'Blandari sem býr til litakóða gefur Málningu beint samband við þann sem velur litinn',
    ],
  },
  positioning:
    'Málning framleiðir og selur í gegnum söluaðila. Vefurinn á að hjálpa fólki að velja lit og réttar vörur og vísa ' +
    'því á söluaðila eða söludeild með allt tilbúið.',
  /* Outreach is drafted separately in Gmail; nothing is sent from here. */
  outreach: { subject: '', body: '' },
}
