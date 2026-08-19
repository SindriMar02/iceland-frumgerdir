import type { PreviewCompany } from '../company-types'

/**
 * The Glass House — Agla og Haffi, Mosfellsbær. Source: the live Airbnb
 * listing (room 1280420693070657952), read 2026-08-06. 111 photos downloaded
 * and reviewed, 24 staged.
 *
 * ownerEmail is EMPTY: there is no website, no socials found, no public
 * address anywhere. The ONLY channel is Airbnb messaging — and per the hard
 * rule an Airbnb DM must never carry the commission argument or links
 * (Airbnb filters them). The outreach draft below is written for that
 * channel: curiosity + the filter-proof fallback, nothing else.
 */
export const companyEntry: PreviewCompany = {
  slug: 'glasshouse',
  route: '/preview/glasshouse',
  name: 'The Glass House',
  sector: 'Gisting',
  location: 'Mosfellsbær',
  region: 'Höfuðborgarsvæðið',
  established: 'Ofurgestgjafar í 12 ár',
  currentUrl: 'https://www.airbnb.com/rooms/1280420693070657952',
  ownerEmail: '',
  concept: 'Upp',
  conceptTagline:
    'Þakglugginn er beint yfir rúminu, svo þyngdarafl síðunnar snýr öfugt: allt birtist að ofan, himinninn færist í gegnum gluggann og nóttin endar í þeirra eigin norðurljósamynd.',
  accent: '#C97B4A',
  dark: false,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'glasshouse/skylight.jpg',
  ownPhotography: true,
  noOwnSite: true,
  currentLabel: 'Airbnb-skráning',
  photoCredit:
    'Allar myndir eru raunverulegar myndir úr Airbnb-skráningu Öglu og Haffa, sóttar 2026-08-06.',
  audit: {
    strengths: [
      '4,99 í einkunn yfir 70 umsagnir og tólf ára reynsla. Gestir nefna kyrrðina og gluggana aftur og aftur',
      'Þakglugginn beint yfir rúminu er raunverulegt sérkenni sem engin önnur skráning á svæðinu á',
      'Tuttugu mínútur frá Reykjavík: næsta norðurljósahús við borgina, með gufubaði og heitum potti',
    ],
    weaknesses: [
      'Engin eigin vefsíða til. Allt traust, allar myndir og allar bókanir lifa inni á Airbnb',
      'Í leit að gistingu við Reykjavík finnst húsið hvergi utan Airbnb',
      'Ekkert vélrænt læsilegt gagnasnið, svo gervigreindarleit getur ekki lýst staðnum',
    ],
    opportunities: [
      'Eigin lén með beinni fyrirspurn: engin þóknun á nætur sem bókast þar',
      'Umsagnirnar 70 sýnilegar á eigin vef í stað þess að vera læstar inni á Airbnb',
      'LodgingBusiness-gagnasnið og nálægðin við Reykjavík gera sterka leitarstöðu mögulega',
    ],
  },
  positioning:
    'Agla og Haffi eiga hús sem selur sig sjálft, þakglugga yfir rúminu og fullkomnar umsagnir, en ekkert af því sést utan Airbnb. Frumgerðin snýr síðunni upp eins og húsið sjálft: himinninn í aðalhlutverki og fyrirspurnin beint til þeirra.',
  outreach: {
    subject: 'Fyrirspurn um Glass House',
    body: `Sæl Agla,

Ég heiti Sindri og hanna vefsíður fyrir íslenska gististaði. Ég rakst á Glass House og þakglugginn yfir rúminu stoppaði mig alveg, ég hef ekki séð þetta annars staðar á Íslandi.

Ég hannaði litla frumgerð að vefsíðu fyrir húsið, bara af því að hugmyndin var of góð til að sleppa henni. Mig langar að sýna ykkur hana ef þið hafið áhuga.

Ef þú vilt kíkja á hana, flettu mér upp undir SNDR Studio.

Bestu kveðjur,
Sindri Már`,
  },
}
