import type { PreviewCompany } from '../companies'

/**
 * Sossa Björnsdóttir — painter, Keflavík and Turup (Denmark).
 *
 * SHE HAS A SITE: sossa.is, a Weebly page from the early 2010s. The gap is not
 * that she has nothing; it is that a painter with an MFA from Boston, a Beijing
 * Biennale and forty years of exhibitions has a couple of paragraphs on her front
 * page, no viewport meta, no `<h1>`, and her paintings split across separate pages
 * named by year. Deliberately no word count and no page count here: both move
 * depending on how you count, and neither belongs in a letter.
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
      'Engin viewport-merking: síðan er ekki gerð fyrir síma',
      'Verkin liggja á aðskildum síðum eftir ártali, engin leið að sjá þau saman',
      'Hvergi sést hvað verk kostar eða hvernig má spyrjast fyrir um þau',
    ],
    opportunities: [
      'Sýningarnar hennar sjálfar verða flokkunarkerfið, engu logið upp',
      'Fyrirspurnasafn: kaupandi velur nokkur verk og sendir eina fyrirspurn',
      'Ferillinn dreginn fram, hann er sterkari en nokkuð annað sem hún á',
    ],
  },
  positioning:
    'Sossa hefur málað frá 1982 og sýnt í Peking, Flórens, Boston og Kaupmannahöfn. Vefsíðan hennar er Weebly-síða án viewport-merkingar og verkin dreifð á síður eftir ártali. Frumgerðin snýr því við: málverkið fyllir skjáinn, sýningarnar verða flokkunin og ferillinn fær loksins að sjást.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Sossu',
    body: `Sæl Sossa,

Ég heiti Sindri og hanna vefsíður fyrir íslenskt listafólk.

Ég rakst á verkin þín þegar ég var að skoða íslenska myndlist, og ég staldraði lengi við pörin sem standa hlið við hlið á bláum og grænum grunni. Það eina sem mig vantaði var síða þar sem málverkin fá að fylla skjáinn. Eins og staðan er í dag skiptast verkin á margar síður eftir ártali, hvergi er hægt að sjá þau saman, og síðan opnast ekki rétt í síma.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir þig. Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hún er hönnuð fyrir símann fyrst, því þar skoðar fólk vefi mest í dag, og virkar eins vel á tölvu. Málverkið fyllir skjáinn og textinn víkur til hliðar. Sýningarnar þínar verða leiðarkerfið, enda er það eina flokkunin sem er sönn, og ferillinn fær loksins að sjást. Ég setti hvorki titla né verð inn, enda eru þeir ekki á síðunni þinni í dag og ég vildi ekki finna neitt upp.

Þar er líka safn. Gestur getur valið nokkur verk sem hann hefur áhuga á og sent þér eina fyrirspurn um þau öll, í stað þess að þú svarir sama póstinum aftur og aftur um eitt verk í einu. Ég sé svo um hýsingu og viðhald á síðunum sem ég geri, ef það er eitthvað sem þú hefur áhuga á.

Ef þér líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þú hafir gaman af því að skoða hugmyndina.

Endilega láttu mig vita hvað þér finnst.

Bestu kveðjur,
Sindri Már
845 1758
sndrstudio.is`,
  },
}
