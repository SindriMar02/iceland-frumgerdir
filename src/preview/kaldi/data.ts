import { CONTACT, PRODUCTS, productBySlug, type Product } from './vorur'

/* ------------------------------------------------------------------
   Bruggsmiðjan Kaldi, on the Góa / the brand design system.

   Copy is Kaldi's own: their front page, beer page, kynningar page, staff
   page and Sagan okkar (bruggsmidjan.is, re-read 2026-10-24), and the
   holding page of bjorbodin.is. Informational only: no buy-now pushes and no
   lifestyle claims (áfengislög 75/1998, gr. 20).
   ------------------------------------------------------------------ */

export const FYRIRTAEKI = {
  logadi: CONTACT.name,
  kt: CONTACT.kt,
  heimili: `${CONTACT.address}, ${CONTACT.postcode}`,
  simi: CONTACT.phone,
  simiHref: CONTACT.phoneHref,
  netfang: CONTACT.email,
  sermerking: CONTACT.emailSermerking,
  kort: CONTACT.mapHref,
}

/* Their front page, word for word. */
export const TILVITNUN = 'Íslenskur bjór, bruggaður eftir tékkneskri hefð, ógerilsneyddur, enginn viðbættur sykur og án rotvarnarefna.'

/* Contact tiles: only what their own site prints. */
export const TEYMI = [
  { nafn: 'Sími', texti: CONTACT.phone, href: CONTACT.phoneHref },
  { nafn: 'Netfang', texti: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { nafn: 'Sérmerking', texti: CONTACT.emailSermerking, href: `mailto:${CONTACT.emailSermerking}` },
  { nafn: 'Heimilisfang', texti: `${CONTACT.address}, ${CONTACT.postcode}`, href: CONTACT.mapHref },
]

export const TEXTI = {
  heroLinur: ['Fyrsta', 'handverks­brugghús', 'á Íslandi,'],
  heroAr: 'frá 2006.',
  heroUndir: 'Kaldi Ljós, Dökkur, Lite, IPA, Tripel og jólabjórarnir, bruggaðir á Árskógssandi úr vatni úr lind í Sólarfjalli.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Brewery',
  name: 'Bruggsmiðjan Kaldi',
  url: 'https://www.bruggsmidjan.is',
  telephone: '+354 466 2505',
  email: CONTACT.email,
  foundingDate: '2006',
  address: { '@type': 'PostalAddress', streetAddress: CONTACT.address, postalCode: '621', addressLocality: 'Árskógssandur', addressCountry: 'IS' },
  sameAs: [CONTACT.facebook, CONTACT.instagram],
}

const tint = (slug: string) => productBySlug(slug)!.tint
const nafn = (slug: string) => productBySlug(slug)!.name.is
const lysing = (slug: string) => productBySlug(slug)!.desc.is

export type Reitur = { img: string; n: string; grunnur: string }
const reitur = (slug: string): Reitur => ({ img: slug, n: nafn(slug), grunnur: tint(slug) })

/* Seven bottles and cans on their own label colours: the scattered grid. */
export const HERO_REITIR: Reitur[] = ['ljos', 'ipa', 'dokkur', 'lite', 'tripel', 'jola', 'nullprosent'].map(reitur)

/* The inline-image sentence. Each chip cycles through its own group. */
export type Biti = { t: string } | { img: string; n: string; grunnur: string; b?: number }

export const SETNING: Biti[][] = [
  [{ t: 'Lager' }, { img: 'ljos', n: 'Lager', grunnur: tint('ljos') }, { t: 'eftir tékkneskri hefð,' }],
  [{ t: 'öl' }, { img: 'ipa', n: 'Öl', grunnur: tint('ipa') }, { t: 'með erlendum humlum,' }],
  [{ t: 'jólabjór' }, { img: 'jola', n: 'Jól', grunnur: tint('jola') }, { t: 'fyrir hver jól' }],
  [{ t: 'og áfengislaus Kaldi.' }],
]

export const SETNING_HRINGUR: Record<string, string[]> = {
  Lager: ['ljos', 'dokkur', 'lite'],
  Öl: ['ipa', 'tripel'],
  Jól: ['jola', 'porter'],
}

/* The three cards under "Íslenskur síðan 2006": their own three promises. */
export const KORT3 = [
  { m: 'Allir bjórar Kalda', t: 'Ógerilsneyddir', nr: '01' },
  { m: 'Vatn, maltað bygg, humlar og ger', t: 'Án rotvarnarefna', nr: '02' },
  { m: 'Nema Súkkulaði Porter (Síríus súkkulaði)', t: 'Án viðbætts sykurs', nr: '03' },
]

/* The two product panels, with their beers as swatches. */
export const SPJOLD = [
  { merki: 'Lager og áfengislaust', titill: 'Lagerinn', tegundir: ['ljos', 'dokkur', 'lite', 'nullprosent'] },
  { merki: 'Öl og jólabjór', titill: 'Ölin og jólin', tegundir: ['ipa', 'tripel', 'jola', 'porter'] },
].map((s) => ({ ...s, tegundir: s.tegundir.map((slug) => ({ slug, n: nafn(slug), d: lysing(slug), lit: tint(slug) })) }))

/* The catalogue carousel: one card per line, items derived from the beer list. */
export type Lina = { s: string; t: string; d: string; img: string; g: string; filter: (p: Product) => boolean }
export const LINUR: Lina[] = [
  { s: 'lager', t: 'Lager', d: 'Ljós, Dökkur og Lite: tékknesk lagerhefð, fjögurra vikna gerjun.', img: 'ljos', g: tint('ljos'), filter: (p) => p.lina === 'lager' },
  { s: 'ol', t: 'Öl', d: 'IPA að bandarískri fyrirmynd og belgískur Tripel.', img: 'tripel', g: tint('tripel'), filter: (p) => p.lina === 'ol' },
  { s: 'jol', t: 'Jólabjór', d: 'Jóla Kaldi og Jóla Súkkulaði Porter, aðeins fyrir jólin.', img: 'jola', g: tint('jola'), filter: (p) => p.lina === 'jol' },
  { s: 'afengislaust', t: 'Áfengislaust', d: 'Áfengislaus Kaldi, á markað í júní 2023.', img: 'nullprosent', g: tint('nullprosent'), filter: (p) => p.lina === 'afengislaust' },
]

/* Tuttugu ár: group labels, rows with a date on the right. All from Sagan okkar,
   the beer page and their own 20-year post (22 August 2026). */
export const SOGUHOPAR = [
  { h: 'Upphafið', r: [
    { t: 'Frétt á RÚV um lítil brugghús', a: 'Júní 2005' },
    { t: 'Fyrsta bruggun á Árskógssandi', a: '22.8.2006' },
    { t: 'Fyrsta átöppun', a: '28.9.2006' },
  ] },
  { h: 'Bjórinn', r: [
    { t: 'Kaldi Ljós, fyrsti bjórinn', a: '2006' },
    { t: 'Áfengislaus Kaldi', a: 'Júní 2023' },
  ] },
  { h: 'Í dag', r: [
    { t: 'Beint frá framleiðanda í verksmiðjunni', a: '1.7.2022' },
    { t: 'Tuttugu ár frá fyrsta Kalda', a: '22.8.2026' },
  ] },
]

/* Spurt og svarað: each answer is a fact already on their site, or states
   exactly what this prototype does. */
export const SPURT = [
  { q: 'Hvar fæst Kaldi?', a: 'Í Vínbúðunum og beint frá okkur í verksmiðjunni á Árskógssandi, Samkvæmt síðustu tilkynningu er opið þriðjudaga til fimmtudaga 8 til 18 og föstudaga til 20.' },
  { q: 'Hvernig bóka ég kynningu?', a: 'Kynningar eru almennt 60 mínútur: saga Kalda frá 2006, skoðunarferð um verksmiðjuna og smökkun beint af dælu. Verð á mann er 3.500 kr. og hægt er að fá tilboð fyrir stærri hópa. Sendu beiðni hér á síðunni eða á bruggsmidjan@bruggsmidjan.is.' },
  { q: 'Hvernig virkar sérmerking?', a: 'Sérmerktur Kaldi fyrir brúðkaupið, veisluna eða fyrirtækið, bæði á flöskur og dósir. Veldu umbúðir og tilefni og fyrirspurnin fer tilbúin til Jóa á joi@bruggsmidjan.is.' },
  { q: 'Get ég leigt dælu?', a: 'Já. Þú kaupir bjórkút eða kúta og færð dælu með án endurgjalds. Settu bjóra á kútalistann og sendu eina fyrirspurn.' },
  { q: 'Úr hverju er Kaldi bruggaður?', a: 'Eingöngu vatni, möltuðu byggi, humlum og geri. Byggið kemur frá Tékklandi, humlarnir meðal annars frá Tékklandi, Bandaríkjunum, Ástralíu og Nýja-Sjálandi, og vatnið úr lind í Sólarfjalli við utanverðan Eyjafjörð.' },
  { q: 'Er Bjórböðin opin?', a: 'Bjórböðin eru lokuð tímabundið á meðan staðnum er breytt í áfangastað með gistingu og nýrri aðstöðu. Fyrirspurnir á bjorbodin@bjorbodin.is.' },
]

/* The gallery strip: every beer, on its own colour. */
export const GALLERI = PRODUCTS.map((p) => ({ img: p.slug, n: p.name.is, d: p.desc.is, g: p.tint }))

/* The four services on their front page, each with where it leads. */
export type Leid = { nafn: string; nota: string; hlekkur: '#kutar' | '#kynning' | '#sermerking' | '#hvar'; ord: string; stutt: string }
export const ERINDI: Leid[] = [
  { nafn: 'Kynning fyrir hópinn', stutt: '60 mínútur, 3.500 kr. á mann', hlekkur: '#kynning', ord: 'Bóka kynningu',
    nota: 'Saga Kalda, skoðunarferð um verksmiðjuna og smökkun beint af dælu. Sendu dagsetningu og fjölda og þú færð staðfestingu.' },
  { nafn: 'Sérmerking', stutt: 'Flöskur og dósir', hlekkur: '#sermerking', ord: 'Setja saman sérmerkingu',
    nota: 'Sérmerktur Kaldi fyrir brúðkaupið, veisluna eða fyrirtækið. Fyrirspurnin fer tilbúin til Jóa.' },
  { nafn: 'Leiga á dælu', stutt: 'Kútar og frí dæla', hlekkur: '#kutar', ord: 'Opna kútalistann',
    nota: 'Þú kaupir kút eða kúta og færð dælu með. Veldu bjóra og fjölda kúta og sendu eina fyrirspurn.' },
  { nafn: 'Kaupa beint frá okkur', stutt: 'Í verksmiðjunni', hlekkur: '#hvar', ord: 'Opnunartími og staður',
    nota: 'Frá 1. júlí 2022 er hægt að kaupa bjórinn beint í verksmiðjunni á Árskógssandi. Hér sérðu opnunartíma og hvar Kaldi fæst.' },
]
