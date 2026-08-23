import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for Myndó. Stays in this folder so the preview
 * route ships only its own record. See [[preview-link-isolation]].
 */
const A = import.meta.env.BASE_URL

export const companyEntry: PreviewCompany = {
  slug: 'myndo',
  route: '/preview/myndo',
  name: 'Myndó ljósmyndastofa',
  sector: 'Ljósmyndastofa',
  location: 'Hrafnshöfða 14, 270 Mosfellsbær',
  region: 'Capital',
  established: 'Stofnuð 20.04.2007',
  currentUrl: 'https://www.myndo.is',
  ownerEmail: '',
  concept: 'Æviskeiðin',
  conceptTagline:
    'Her own service list, read in the right order, is a human lifetime. That becomes the spine of the page and the argument for staying with one photographer.',
  accent: '#3F5140',
  dark: false,
  status: 'Concept ready',
  thumb: `${A}myndo/nyburi.webp`,
  ownPhotography: true,
  positioning:
    'Ólína myndar sömu fjölskyldurnar aftur og aftur, frá bumbu að brúðkaupi. Þjónustulistinn hennar er í raun heil ævi í réttri röð, og það er sterkasta röksemdin fyrir því að halda sig við einn ljósmyndara. Síðan á að segja það, og virka í síma.',
  audit: {
    strengths: [
      'Rekin frá 2007, ársreikningi 2025 skilað 20.07.2026, svo reksturinn er sannanlega í fullum gangi',
      'Félagi í Ljósmyndarafélagi Íslands',
      'Full verðskrá er þegar birt, fimm pakkar frá 21.900 upp í 48.200, auk prentunar',
      'Þjónustan spannar heila ævi: bumba, nýburi, börn, ferming, útskrift, gifting, fjölskyldan',
      'Skólamyndir eru sérstök tekjulind með eigin pöntunarleið',
    ],
    weaknesses: [
      'Engin viewport-merking, svo síðan er læst í tölvubreidd og hleypur saman í síma',
      'Forsíðan vísar fólki á tvö önnur fyrirtæki áður en hún biður nokkurn um að bóka',
      'Verðskráin er á síðu sem er ólesin í síma, þótt hún sé heiðarleg og heil',
      'Engin bókunarleið, aðeins símanúmer',
    ],
    opportunities: [
      'Þjónustulistinn í réttri röð verður burðarásinn: heil ævi, einn ljósmyndari',
      'Verðskráin fram á forsíðu, þar sem foreldrar sjá hana strax',
      'Skólamyndir fá sína eigin leið, aðskilda frá fjölskyldumyndatökum',
    ],
  },
  outreach: {
    subject: 'myndo.is er læst í tölvubreidd og hleypur saman í síma',
    body: `Sæl Ólína.

Ég var að skoða myndo.is í símanum. Síðan opnast, en hún er ekki gerð fyrir símaskjá, svo hún birtist sem örsmá útgáfa af tölvusíðunni sem þarf að þysja inn á. Foreldrar sem eru að leita að fermingar- eða nýburamyndatöku eru nánast alltaf í síma.

Hitt sem ég tók eftir er að verðskráin ykkar er heil og heiðarleg, en hún er á síðu sem er einmitt ólesin í símanum.

Ég gerði tillögu að nýrri forsíðu, ykkur að kostnaðarlausu og án skuldbindinga:

${'{{PREVIEW_URL}}'}

Ef hún hittir ekki í mark máttu einfaldlega henda henni.

${SIGN}`,
  },
}
