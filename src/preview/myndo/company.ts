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
    subject: 'Hugmynd að nýrri vefsíðu fyrir Myndó ljósmyndastofu',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki og sjálfstæðar stofur.

Það sem mér finnst sterkast við Myndó er að þjónustan ykkar spannar heila ævi, frá bumbu og nýbura að fermingu, útskrift og brúðkaupi, og að þið hafið myndað fjölskyldur í Mosfellsbæ síðan 2007. Mér finnst það sterkasta röksemdin fyrir því að fjölskylda haldi sig við sömu stofuna. Það eina sem mig vantaði að sjá var vefsíða sem segir þetta, því eins og staðan er í dag er síðan ekki gerð fyrir símaskjá og birtist sem örsmá útgáfa af tölvusíðunni sem þarf að þysja inn á.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
${'{{PREVIEW_URL}}'}

Hugmyndin er einföld. Að foreldrar sem eru að leita að myndatöku fyrir fermingu eða nýbura finni ykkur í símanum, sjái æviskeiðin og verðin strax, og geti hringt beint þaðan. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
  },
}
