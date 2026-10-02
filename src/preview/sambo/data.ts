import type { PreviewCompany } from '../company-types'
import { BASE, CONTACT, PRODUCTS, PK, productBySlug, type Product } from './vorur'

/* Editorial layer for the Sambó build, in the shape the Góa/Katla/Ísfugl
   system expects. Every fact below is Kólus' own: the product titles and
   descriptions on sambo.eu.com (Wix store, read 2026-10-02), the allergens
   printed in bold on their own ingredient label images, their About page
   ("privately owned Icelandic company ... domestic and export market", founded
   1962), the shield "Proudly made in Iceland, established 1962" and the Easter
   fundraising PDF. Nothing is invented: no prices (their shop shows 0), no pack
   sizes, no opening hours, no history beyond 1962, no named people. The
   Icelandic text is theirs where they wrote it, otherwise a plain translation
   of their English line, listed as an open item for their approval. */

export const FYRIRTAEKI = {
  nafn: 'Sambó',
  logadi: 'Kólus ehf.',
  kt: CONTACT.kt,
  heimili: `${CONTACT.address}, ${CONTACT.postcode}`,
  simi: CONTACT.phone,
  simiHref: CONTACT.phoneHref,
  netfang: CONTACT.email,
  pantanir: CONTACT.email,
  fjarofloun: CONTACT.emailFundraise,
  kort: CONTACT.mapHref,
}

/* Their About page, translated line for line (open item: their approval). */
export const TILVITNUN =
  'Kólus er íslenskt einkafyrirtæki sem býður sérstakt sælgæti og hefðbundna lakkrísvöru úr úrvals hráefni fyrir innanlandsmarkað og útflutning.'

/* Contact tiles: only what their own site prints. */
export const TEYMI = [
  { nafn: 'Sími', texti: CONTACT.phone, href: CONTACT.phoneHref },
  { nafn: 'Netfang', texti: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { nafn: 'Páskafjáröflun', texti: CONTACT.emailFundraise, href: `mailto:${CONTACT.emailFundraise}` },
  { nafn: 'Heimilisfang', texti: `${CONTACT.address}, ${CONTACT.postcode}`, href: CONTACT.mapHref },
]

export const TEXTI = {
  heroLinur: ['Bragð', 'af hefð'],
  heroAr: 'síðan 1962.',
  heroUndir: 'Þristur, Kúlusúkk, lakkrískonfekt, Froskar, Snjóboltar, páskaegg og allt hitt frá Kólus í Reykjavík.',
  umInn: 'Sambó og Völusælgæti í tveimur orðum.',
  fotur: 'Síðan 1962',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sambó',
  legalName: 'Kólus ehf.',
  brand: [{ '@type': 'Brand', name: 'Sambó' }, { '@type': 'Brand', name: 'Völusælgæti' }],
  url: 'https://www.sambo.eu.com',
  telephone: '+354 535 0300',
  email: CONTACT.email,
  foundingDate: '1962',
  address: { '@type': 'PostalAddress', streetAddress: CONTACT.address, postalCode: '110', addressLocality: 'Reykjavík', addressCountry: 'IS' },
}

/* ------------------------------------------------------------------
   Colour. Each ground is the colour of the pack standing on it (the product's
   own `tint`, sampled off its wrapper); the ink that sits on a ground is the
   higher-contrast of white and the teal ink.
   ------------------------------------------------------------------ */
const tint = (slug: string) => productBySlug(slug)!.tint
const nafn = (slug: string) => productBySlug(slug)!.name.is
const lysing = (slug: string) => productBySlug(slug)!.desc.is

export type Reitur = { img: string; n: string; grunnur: string }
const reitur = (slug: string): Reitur => ({ img: slug, n: nafn(slug), grunnur: tint(slug) })

/* Seven packs on their own colours: the scattered grid. */
export const HERO_REITIR: Reitur[] = ['thristur', 'kulusukk', 'froskar', 'gammeldags-lakkris', 'thristakulur', 'lakkriskonfekt', 'kremrulla'].map(reitur)

/* The inline-image sentence. Each chip cycles through its own group. */
export type Biti = { t: string } | { img: string; n: string; grunnur: string; b?: number }

export const SETNING: Biti[][] = [
  [{ t: 'Þristur' }, { img: 'thristur', n: 'Þristur', grunnur: tint('thristur') }, { t: 'í fimm útgáfum,' }],
  [{ t: 'lakkrís' }, { img: 'lakkriskonfekt', n: 'Lakkrís', grunnur: tint('gammeldags-lakkris') }, { t: 'í mörgum litum,' }],
  [{ t: 'Völusælgæti' }, { img: 'froskar', n: 'Völusælgæti', grunnur: tint('froskar') }, { t: 'í fjórum gerðum' }],
  [{ t: 'og allt hitt í pokanum.' }],
]

export const SETNING_HRINGUR: Record<string, string[]> = {
  Þristur: ['thristur', 'thristur-stong', 'thristakulur', 'thrista-stubbar', 'thristur-travel'],
  Lakkrís: ['lakkriskonfekt', 'gammeldags-lakkris', 'lakkrisreimar', 'kremrulla'],
  Völusælgæti: ['froskar', 'bananastangir', 'kokosbollur'],
}

/* The three cards under "Íslenskt síðan 1962". */
export const KORT3 = [
  { m: 'Stofnað 1962', t: 'Íslenskt einkafyrirtæki', nr: '01' },
  { m: 'Innanlands og útflutningur', t: 'Sælgæti fyrir tvo markaði', nr: '02' },
  { m: `${PRODUCTS.length} vörur`, t: 'Lakkrís, súkkulaði og mjúkt nammi', nr: '03' },
]

/* The two product panels, with their varieties as swatches. */
export const SPJOLD = [
  {
    merki: 'Mjúkur karamellubiti í súkkulaði', titill: 'Þristur',
    tegundir: ['thristur', 'thristur-stong', 'thristur-travel', 'thristakulur', 'thrista-stubbar'],
  },
  {
    merki: 'Lakkrís, með og án súkkulaðis', titill: 'Lakkrís',
    tegundir: ['lakkriskonfekt', 'gammeldags-lakkris', 'lakkrisreimar', 'kremrulla', 'kulusukk', 'sport-lakkris'],
  },
].map((s) => ({ ...s, tegundir: s.tegundir.map((slug) => ({ slug, n: nafn(slug), d: lysing(slug), lit: tint(slug) })) }))

/* The catalogue carousel: one card per line. Items are derived from the
   product list, so the carousel and the popups can never disagree with it. */
export type Lina = { s: string; t: string; d: string; img: string; g: string; filter: (p: Product) => boolean }
export const LINUR: Lina[] = [
  { s: 'lakkris', t: 'Lakkrís', d: 'Konfekt, gammeldags, reimar og rúllur, með og án súkkulaðis.', img: 'lakkriskonfekt', g: tint('gammeldags-lakkris'), filter: (p) => p.tags.includes('lakkris') },
  { s: 'sukkuladi', t: 'Súkkulaði', d: 'Þristur, Kúlusúkk, Olsen Olsen, Sæla og fleira húðað súkkulaði.', img: 'kulusukk', g: tint('kulusukk'), filter: (p) => p.tags.includes('sukkuladi') && p.brand === 'sambo' && !p.season },
  { s: 'mjukt', t: 'Mjúkt nammi', d: 'Karamellur, sykurpúðar og kókosbollur.', img: 'thristur', g: tint('thristur'), filter: (p) => p.tags.includes('mjukt') },
  { s: 'volu', t: 'Völusælgæti', d: 'Froskar, Banana-stangir, Kókosbollur og Sexa, buff og bollur.', img: 'froskar', g: tint('froskar'), filter: (p) => p.brand === 'volu' },
  { s: 'season', t: 'Páskar og jól', d: 'Páskaegg, páskabolti og Kærleikstré.', img: 'paskaegg', g: tint('paskaegg'), filter: (p) => !!p.season },
]

/* Gamalt og nýtt: a table with a group label and rows with a value on the
   right. Only what their own site marks ("New", seasonal, 1962). */
export const SOGUHOPAR = [
  { h: 'Frá 1962', r: [{ t: 'Sambó, íslenskt einkafyrirtæki, stofnað', a: '1962' }] },
  { h: 'Nýtt frá Sambó', r: ['thrista-stubbar', 'thristakulur', 'snjoboltar', 'superboltar'].map((s) => ({ t: nafn(s), a: 'Nýtt' })) },
  { h: 'Páskar', r: ['paskaegg', 'paskaboltinn', 'thrista-paskaegg'].map((s) => ({ t: nafn(s), a: 'Eftir pöntun' })) },
  { h: 'Jól', r: [{ t: nafn('kaerleikstre'), a: 'Jólin' }] },
]

/* Spurt og svarað: each answer is a fact already on their site, or states
   exactly what this prototype does. */
export const SPURT = [
  { q: 'Hvar fæst Sambó?', a: 'Netverslanirnar Nammi.is, Icelandic Store, Top Iceland og Shop Icelandic selja Sambó nú þegar. Vefverslun Kólus sjálfs er í smíðum. Verslanir sem vilja Sambó senda pöntunarlista.' },
  { q: 'Hvernig panta verslanir og veitingastaðir?', a: 'Settu vörur á pöntunarlistann, stilltu magnið og sendu. Pöntunin kemur til Kólus fullbúin með öllu sem þarf til að staðfesta hana. Verð og pakkningar staðfestir Kólus.' },
  { q: 'Hvar finn ég ofnæmisvalda?', a: 'Á hverri vörusíðu og í ofnæmisyfirlitinu. Upplýsingarnar eru lesnar af innihaldslýsingum á umbúðum Kólus. Átta vörur eru án innihaldslýsingar á vef Kólus og eru merktar „sjá umbúðir“. Lestu alltaf umbúðirnar, einkum ef um ofnæmi er að ræða.' },
  { q: 'Eru páskaegg til sölu?', a: 'Sambó páskaegg og páskaboltar eru framleidd og seld eftir pöntun, kjörin fjáröflunarleið fyrir samtök og íþróttafélög.' },
  { q: 'Hvað er í Þristi?', a: 'Súkkulaðihúðaður mjúkur karamellubiti. Þristur stöng er með mjúkum lakkrísbitum og Þristakúlur eru með súkkulaði-, lakkrís- og karamellufyllingu.' },
  { q: 'Hvernig sæki ég um starf?', a: 'Sendu stutta umsókn og ferilskrá á vefnum. Umsóknin opnast sem tölvupóstur til Kólus.' },
]

/* The gallery strip: every pack, with its own colour. */
export const GALLERI = PRODUCTS.filter((p) => p.hasPack).map((p) => ({ img: p.slug, n: p.name.is, d: p.desc.is, g: p.tint }))

/* The four errands a visitor arrives for, each with where it leads. */
export type Leid = { nafn: string; nota: string; hlekkur: '#poki' | '#paska' | '#ofnaemi' | '#hvar'; ord: string; stutt: string }
export const ERINDI: Leid[] = [
  { nafn: 'Verslun eða veitingastaður', stutt: 'Pöntunarlisti', hlekkur: '#poki', ord: 'Opna pöntunarlistann',
    nota: 'Settu vörur á pöntunarlistann á meðan þú skoðar, stilltu magnið og sendu eina fullbúna pöntun til Kólus.' },
  { nafn: 'Félag í fjáröflun', stutt: 'Páskaegg og boltar', hlekkur: '#paska', ord: 'Panta fyrir félagið',
    nota: 'Páskanammið er framleitt og selt eftir pöntun. Sendu eina pöntun fyrir félagið í stað pdf skjals og tölvupósts.' },
  { nafn: 'Ofnæmi eða óþol', stutt: 'Nammi án ofnæmisvalda', hlekkur: '#ofnaemi', ord: 'Finna nammi sem hentar',
    nota: 'Veldu það sem þú vilt forðast og sjáðu hvaða vörur henta, samkvæmt innihaldslýsingum Kólus.' },
  { nafn: 'Bara að kaupa nammi', stutt: 'Hvar fæst Sambó', hlekkur: '#hvar', ord: 'Sjá netverslanir',
    nota: 'Fjórar netverslanir selja Sambó núna. Þú getur líka beðið um Sambó í þinni verslun.' },
]

export const companyEntry: PreviewCompany = {
  slug: 'sambo',
  route: '/preview/sambo',
  name: 'Kólus ehf. (Sambó)',
  sector: 'Sælgætisgerð og lakkrís',
  location: 'Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Sambó frá 1962',
  currentUrl: 'https://www.sambo.eu.com',
  ownerEmail: CONTACT.email,
  concept: 'Bragð af hefð',
  conceptTagline: 'Allar vörur Sambó og Völusælgætis á einum stað, með ofnæmisupplýsingum, pöntun fyrir verslanir og páskafjáröflun á netinu.',
  accent: '#D3202A',
  dark: false,
  status: 'Concept ready',
  thumb: PK('thristur', 'pack', 's'),
  ownPhotography: true,
  photoCredit: 'Ljósmyndir af vörum eru ljósmyndir Kólus ehf. af vef þess (sambo.eu.com).',
  audit: {
    strengths: [
      'Sælgætisgerð með vörur á borð við Þrist, Kúlusúkk og lakkrískonfekt, merkt „Proudly made in Iceland, established 1962“',
      'Faglegar stúdíóljósmyndir af öllum vörum, í fullri upplausn (um 3500 sinnum 5000 punktar) á miðlaþjóni þeirra',
      'Ofnæmis- og næringarupplýsingar eru þegar til fyrir flestar vörur, á myndum af umbúðum',
    ],
    weaknesses: [
      'Verslunin segir „Our online store is currently under construction“ og öll verð í vefversluninni eru 0, svo ekki er hægt að kaupa neitt',
      'Vörumyndirnar sem eru birtar eru 147 punktar á breidd, teygðar upp í 309 til 978, og forsíðumyndin 49 sinnum 21 punktar, svo allt er óskýrt',
      'Ofnæmisvaldar og næringargildi eru aðeins til sem myndir af miðum, ekki sem texti sem hægt er að leita í eða lesa upp',
      'Starfsumsóknarsíðan er tómur gluggi, tengiliðurinn er aðeins netfang, enginn h1 er á forsíðu og fóturinn segir 2018',
      'Páskafjáröflun fyrir félög fer fram með pdf skjali og tölvupósti til eins manns, án eyðublaðs',
    ],
    opportunities: [
      'Hver vara á sína síðu með ofnæmisvöldum og leit að vörum án ákveðinna ofnæmisvalda',
      'Pöntun fyrir verslanir og veitingastaði: velja vörur og magn og senda eina tilbúna pöntun',
      'Páskafjáröflun félaga með eyðublaði og upplýsingar um hvar Sambó fæst',
    ],
  },
  positioning:
    'Kólus ehf. framleiðir Sambó og Völusælgæti. Frumgerðin er unnin úr þeirra eigin ljósmyndum, texta og merkingum á umbúðum, á hönnunarkerfi Góu og Ísfugls: hver vara með ofnæmisvöldum, pöntunarlisti fyrir verslanir og veitingastaði, páskafjáröflun félaga á netinu og hvar má kaupa Sambó.',
  outreach: { subject: 'Hugmynd að nýrri vefsíðu fyrir Kólus og Sambó', body: '[HLEKKUR Á FRUMGERÐ]\n\n(Drög, textinn er skrifaður þegar úttekt lýkur.)' },
}

export { BASE }
