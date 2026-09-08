import type { PreviewCompany } from '../companies'

/**
 * Sossa Björnsdóttir — painter, Keflavík and Turup (Denmark).
 *
 * SHE HAS A SITE: sossa.is, a Weebly page from the early 2010s. The gap is not
 * that she has nothing; it is that a painter with an MFA from Boston, a Beijing
 * Biennale and forty years of exhibitions has 129 words on her front page, no
 * viewport meta, no `<h1>`, and her paintings buried three clicks deep across
 * nineteen separate year pages.
 *
 * ownerEmail is sourced, not guessed: sossa@sossa.is is printed on her own
 * contact page and repeated on her Facebook page (read 2026-09-05).
 * The phone, +354 864 6233, is from the same contact page.
 */
export const companyEntry: PreviewCompany = {
  slug: 'sossa',
  route: '/preview/sossa',
  name: 'Sossa Björnsdóttir',
  sector: 'Myndlist',
  location: 'Keflavík',
  region: 'Suðurnes',
  established: 'Málað frá 1982',
  currentUrl: 'https://www.sossa.is',
  ownerEmail: 'sossa@sossa.is',
  concept: 'Sýningarnar',
  conceptTagline:
    'Verkin flokkast eftir sýningunum sem þau tilheyra, því það er eina flokkunin sem er sönn. Málverkið fyllir skjáinn og textinn þorir að vera örsmár.',
  accent: '#141210',
  dark: false,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'sossa/grid/ny-verk-04.jpg',
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru raunverulegar myndir af verkum Sossu, sóttar af hennar eigin vefsíðu, sossa.is.',
  audit: {
    strengths: [
      'Fjörutíu ára ferill: Beijing Biennale, Florence Biennale, MFA frá Boston',
      'Tvær vinnustofur, í Keflavík og í Turup á Fjóni, og ný opnuð þar í febrúar 2026',
      'Facebook-síðan er lifandi: 3.100 fylgjendur og færsla frá því í vikunni',
    ],
    weaknesses: [
      'Forsíðan er 129 orð, engin viewport-merking og ekkert <h1>',
      'Verkin liggja á nítján aðskildum ártalasíðum, engin leið að sjá þau saman',
      'Hvergi sést hvað verk kostar eða hvernig má spyrjast fyrir um þau',
    ],
    opportunities: [
      'Sýningarnar hennar sjálfar verða flokkunarkerfið, engu logið upp',
      'Fyrirspurnasafn: kaupandi velur nokkur verk og sendir eina fyrirspurn',
      'Ferillinn dreginn fram, hann er sterkari en nokkuð annað sem hún á',
    ],
  },
  positioning:
    'Sossa hefur málað frá 1982 og sýnt í Peking, Flórens, Boston og Kaupmannahöfn. Vefsíðan hennar er Weebly-síða með 129 orðum á forsíðunni og verkin dreifð á nítján ártalasíður. Frumgerðin snýr því við: málverkið fyllir skjáinn, sýningarnar verða flokkunin og ferillinn fær loksins að sjást.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Sossu',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenskt listafólk.

Ég staldraði við verkin þín, sérstaklega pörin sem standa hlið við hlið á bláum grunni. Það eina sem mig vantaði að sjá var síða þar sem málverkin fá að fylla skjáinn, því eins og staðan er í dag liggja þau á nítján aðskildum ártalasíðum og hvergi er hægt að sjá þau saman.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð fyrir þig. Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að verkin fái plássið sem þau eiga skilið, að sýningarnar þínar verði leiðarkerfið og að ferillinn sjáist, því hann er sterkur. Ég setti engin verð eða titla inn, enda eru þeir ekki á síðunni þinni, og ég vildi ekki finna neitt upp.

Endilega láttu mig vita ef þú hefur áhuga.

Bestu kveðjur,
Sindri Már
845 1758
sndrstudio.is`,
  },
}
