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
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki og sjálfstæðar stofur.

Mér finnst tvennt eftirtektarvert við Tannlæknastofu EG. Þið birtið verðin ykkar opinberlega, sem er sjaldgæft í þessari grein, og það hafa verið sömu tvær manneskjurnar á stofunni síðan 2009. Það eina sem mig vantaði að sjá var vefsíða sem segir þetta, því eins og staðan er í dag stendur á forsíðunni símanúmer, opnunartími og reikningsnúmer, en hvergi að stofan hafi verið rekin síðan 1999 eða að þar sé mastersgráða í skurðlækningum á munni og kjálka.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
${'{{PREVIEW_URL}}'}

Hugmyndin er einföld. Að fólk sem leitar að tannlækni finni ykkur, sjái strax hver tekur á móti því og hvað hlutirnir kosta, og geti hringt beint úr símanum. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
  },
}
