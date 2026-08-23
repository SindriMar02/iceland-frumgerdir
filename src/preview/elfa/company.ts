import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for Tannlæknastofa EG. Stays in this folder so
 * the preview route ships only its own record. See [[preview-link-isolation]].
 */
const A = import.meta.env.BASE_URL

export const companyEntry: PreviewCompany = {
  slug: 'elfa',
  route: '/preview/elfa',
  name: 'Tannlæknastofa EG',
  sector: 'Tannlæknastofa',
  location: 'Salavegur 2, 201 Kópavogur',
  region: 'Capital',
  established: 'Stofnuð 22.03.1999',
  currentUrl: 'http://tannlaeknir.is',
  ownerEmail: 'mottaka@tannlaeknir.is',
  concept: 'Ferillinn',
  conceptTagline:
    'A solo dentist who went to Alabama for a surgical masters. Her dated career is the trust argument, so it becomes the page’s spine.',
  accent: '#5C68DC',
  dark: false,
  status: 'Concept ready',
  thumb: `${A}elfa/lockup.webp`,
  ownPhotography: true,
  positioning:
    'Elfa Guðmundsdóttir hefur rekið eigin stofu frá 1999 og er með meistaragráðu í munn- og kjálkaskurðlækningum frá UAB. Hún birtir alla sína verðskrá. Síðan á að sýna hvort tveggja strax, í stað þess að fela það á bak við hnapp.',
  audit: {
    strengths: [
      'Sama stofan frá 1999 og sama aðstoðarfólkið frá 2009, sem er sjaldgæft og selur sig sjálft',
      'Meistaragráða í munn- og kjálkaskurðlækningum frá UAB, University of Alabama at Birmingham',
      'Full verðskrá er þegar til, sautján liðir með föstum verðum',
      'Starfsleyfi frá Heilbrigðisnefnd og staðfesting Embættis landlæknis, hvort tveggja nefnt á síðunni',
    ],
    weaknesses: [
      'Síðan er á http, án SSL, og birtir netfang sjúklinga á síðu sem vafrinn merkir „ekki örugg“',
      'Engin viewport-merking, svo síðan er ólesin í síma',
      'Verðskráin er falin í Google Sheet á bak við 162 punkta hnappamynd og finnst hvergi í leit',
      'Nýjasta ártal á síðunni er 2022 og tímapantanir eru eingöngu símanúmer',
    ],
    opportunities: [
      'Ferill hennar er dagsettur og sannreynanlegur: 1994, 1999, 2006, 2009. Hann verður burðarásinn í síðunni',
      'Verðskráin upp á yfirborðið, flokkuð eftir hennar eigin flokkum, með jöfnum tölustöfum',
      'Handteiknaða „eg“ merkið hennar er ein samfelld lína og hentar fullkomlega sem opnunarhreyfing',
    ],
  },
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Tannlæknastofu EG',
    body: `Sæl Elfa.

Ég var að skoða tannlaeknir.is og það sem stakk mig mest er að forsíðan segir hvergi hver þú ert. Þar stendur símanúmer, opnunartími, heimilisfang og reikningsnúmer, en hvorki að þú hafir rekið stofuna frá 1999 né að þú sért með mastersgráðu í munn- og kjálkaskurðlækningum frá UAB. Það stendur á starfsfólkssíðunni, þangað sem fæstir rata.

Tvennt annað sem ég tók eftir. Síðan er ekki gerð fyrir síma, hún er án viewport-merkingar og birtist því sem örsmá útgáfa af tölvusíðunni sem þarf að þysja inn á, og þangað fer nánast allt fólk sem leitar að tannlækni. Svo er hún á http en ekki https, sem vafrar merkja sérstaklega, og verðin ykkar eru falin í Google-skjali á bak við litla hnappamynd þótt þau séu heil og heiðarleg.

Ég gerði tillögu að nýrri forsíðu sem byggir á þessu, ykkur að kostnaðarlausu og án skuldbindinga, og hún er hér: ${'{{PREVIEW_URL}}'}. Ef hún hittir ekki í mark máttu einfaldlega henda henni.

${SIGN}`,
  },
}
