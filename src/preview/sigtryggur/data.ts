/* Sigtryggur Bjarni Baldvinsson — painter, Reykjavík / Akureyri.
 *
 * Every fact here is sourced from his own site (sigtryggurbjarni.is), harvested
 * 2026-08-06: the bio and the EINKASÝNINGAR / VERK Í OPINBERRI EIGU lists come
 * from his /um-mig page, the catalogue from his own gallery pages.
 * ownerEmail is sourced, not guessed: it is published on his contact page.
 * Nothing in this file is inferred about him.
 */

import type { PreviewCompany } from '../companies'

/** His solo exhibitions, verbatim from his own CV page. */
export const EXHIBITIONS: { year: string; title: string; venue: string }[] = [
  { year: '2023', title: 'Fram fjörðinn seint um haust', venue: 'Listasafn Íslands, Reykjavík' },
  { year: '2022', title: 'Drög', venue: 'Herhúsið, Siglufirði' },
  { year: '2021', title: 'Hljóðmynd', venue: 'Ásmundarsalur, Reykjavík' },
  { year: '2020', title: 'Eftir regnið', venue: 'Kompan, Siglufirði' },
  { year: '2020', title: 'Hljómur úr firði – Litir frá Bach', venue: 'Pálshús, Ólafsfirði' },
  { year: '2018', title: 'Útvarp Mýri – Litir Kvarans', venue: 'Hverfisgallerí, Reykjavík' },
  { year: '2017', title: '360 dagar og málverk', venue: 'Listasafnið á Akureyri' },
  { year: '2016', title: 'Mýrarskuggar', venue: 'Hverfisgallerí, Reykjavík' },
  { year: '2014', title: '360 dagar í grasagarðinum', venue: 'Hallgrímskirkja, Reykjavík' },
  { year: '2014', title: 'The Pastor, the Moor, the Sea and the Trees', venue: 'Blank, Brighton, England' },
  { year: '2012', title: 'Þrír staðir', venue: 'Gallery Ágúst, Reykjavík' },
  { year: '2011', title: 'Móðan gráa', venue: 'Listasafn ASÍ, Reykjavík' },
  { year: '2011', title: 'Varanlegt augnablik', venue: 'Hafnarborg, Hafnarfirði' },
  { year: '2010', title: 'Ár – málverkið á tímum straumvatna', venue: 'Listasafn Árnesinga, Hveragerði' },
  { year: '2010', title: 'Sjö himnar', venue: 'Árbæjarkirkja, Reykjavík' },
  { year: '2009', title: 'River Paintings', venue: 'More North, New York, USA' },
  { year: '2008', title: 'Eyjafjarðará', venue: 'Gallery Jónas Viðar, Akureyri' },
  { year: '2006', title: 'Sog', venue: 'Listasafn Reykjanesbæjar' },
  { year: '2004', title: 'Fletir', venue: 'Gerðarsafn, Kópavogi' },
  { year: '2002', title: 'Lög', venue: 'Gerðarsafn, Kópavogi' },
  { year: '2002', title: 'Treemix-Remix', venue: 'Englaborg, Reykjavík' },
  { year: '2002', title: 'Í minningu Rothko', venue: 'Hallgrímskirkja, Reykjavík' },
  { year: '1998', title: 'Höfuðstöðvar EFTA', venue: 'Brussel, Belgíu' },
  { year: '1997', title: 'Tvær víddir – Tvísýn', venue: 'Nýlistasafnið, Reykjavík' },
  { year: '1995', title: 'Listasafnið á Akureyri', venue: 'Akureyri' },
  { year: '1991', title: 'Gamli Lundur', venue: 'Akureyri' },
]

/** Public collections holding his work, verbatim from his own CV page. */
export const COLLECTIONS: string[] = [
  'Listasafn Íslands',
  'Listasafn Reykjavíkur',
  'Listasafnið á Akureyri',
  'Listasafn Háskóla Íslands',
  'Listasafn Reykjanesbæjar',
  'Gerðarsafn',
  'Hæstiréttur Íslands',
  'Ríkisspítalinn',
  'Listasafn Flugleiða',
  'Íslandsbanki',
  'Landsbanki',
  'MP Banki',
  'Tryggingamiðstöðin',
  'Menntaskólinn á Akureyri',
]

export const companyEntry: PreviewCompany = {
  slug: 'sigtryggur',
  route: '/preview/sigtryggur',
  name: 'Sigtryggur Bjarni Baldvinsson',
  sector: 'Myndlist',
  location: 'Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: '212 verk í 15 röðum, 1992-2023',
  currentUrl: 'https://www.sigtryggurbjarni.is',
  ownerEmail: 'sigtryggur@mir.is',
  concept: 'Raðirnar',
  conceptTagline:
    'Raðirnar hans verða leiðarkerfið og hver þeirra tengd sýningunni sem hún var sýnd á; litirnir eru lesnir beint úr málverkunum.',
  accent: '#1B3A5C',
  dark: false,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'sbb/grid/staumvotn-og-vatnsfletir-000.jpg',
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru raunverulegar myndir af verkum Sigtryggs Bjarna, sóttar af hans eigin vefsíðu sigtryggurbjarni.is.',
  audit: {
    strengths: [
      '35 einkasýningar frá 1991, sú síðasta í Listasafni Íslands 2023',
      'Verk í eigu Listasafns Íslands, Listasafns Reykjavíkur, Hæstaréttar og ellefu safna í viðbót',
      'Hver sería er þegar merkt með ártali, stærð og tækni á hans eigin síðu',
    ],
    weaknesses: [
      'Wix-síða sem sýnir aðeins 25 verk af hverri seríu í frumkóða, restin er ósýnileg leitarvélum',
      'Seríurnar liggja í flatri valmynd, engin röð og ekkert samhengi milli þeirra og sýninganna',
      'Engin verk fá að fylla skjáinn, allt situr í smáum reitum',
    ],
    opportunities: [
      'Gera seríurnar að leiðarkerfi og tengja hverja við sýninguna sem hún var sýnd á',
      'Fletta eftir litum sem eru lesnir beint úr málverkunum sjálfum',
      'Koma öllum 409 verkunum í leitarvélar í stað 212',
    ],
  },
  positioning:
    'Sigtryggur Bjarni á verk í Listasafni Íslands, Listasafni Reykjavíkur og Hæstarétti. Vefsíðan hans er hins vegar stöðluð Wix-síða þar sem seríurnar liggja í flatri valmynd og verkin birtast í smáum reitum. Frumgerðin snýr því við. Seríurnar verða leiðarkerfið, hver þeirra tengd sýningunni sem hún var sýnd á, og málverkin fá skjáinn.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir verkin þín',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenskt listafólk.

Ég var að skoða vatnsmyndirnar þínar og staldraði lengi við Merlandi Skagafjörð. Það eina sem ég saknaði var að sjá þær í fullri stærð á skjánum, því eins og staðan er í dag sitja þær í smáum reitum í Wix-galleríi.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð fyrir þig. Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Seríurnar þínar verða leiðarkerfið og hver þeirra tengd sýningunni sem hún var sýnd á, og svo má fletta verkunum eftir litum.

Eitt sem ég rakst á í leiðinni: síðan þín birtir aðeins 25 verk úr hverri seríu í frumkóðanum, svo stór hluti verkanna finnst ekki í Google í dag. Ég get sagt þér nánar frá því ef þú vilt.

Endilega láttu mig vita ef þú hefur áhuga.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
