import type { PreviewCompany } from '../company-types'

/**
 * Iceland Lakeview Retreat — hýst af "Visiting Iceland" (gestir kalla hann
 * Omar í umsögnum; íslensk stafsetning ÓSTAÐFEST, notum "Visiting Iceland").
 * Heimild: Airbnb-skráningin (room 53609937), sótt 2026-08-04. 29 myndir
 * sóttar og yfirfarnar. Engin sjálfstæð vefsíða fannst (Perplexity-úttekt
 * 2026-08-04): aðeins Airbnb + umfjöllun (m.a. Matador Network) — og
 * skráningin sjálf ber "Featured in Architectural Digest, July 2025".
 *
 * ownerEmail er tómt: ekkert netfang hefur fundist. Aldrei giska.
 */
export const companyEntry: PreviewCompany = {
  slug: 'lakeview',
  route: '/preview/lakeview',
  name: 'Iceland Lakeview Retreat',
  sector: 'Gisting',
  location: 'Úlfljótsvatn, Grímsnes- og Grafningshreppi',
  region: 'Suðurland',
  established: 'Ofurgestgjafi í 5 ár',
  currentUrl: 'https://www.airbnb.com/rooms/53609937',
  ownerEmail: '',
  concept: 'Af landinu',
  conceptTagline:
    'Torfþakið hverfur inn í mosann og vefurinn leikur sér að því: hann opnar á landinu og finnur svo húsið í því.',
  accent: '#C8964F',
  dark: false,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'lakeview/arrival-lake.jpg',
  ownPhotography: true,
  noOwnSite: true,
  currentLabel: 'Airbnb-skráning',
  photoCredit:
    'Allar myndir eru raunverulegar myndir úr Airbnb-skráningunni (29 myndir), sóttar 2026-08-04.',
  audit: {
    strengths: [
      'Umfjöllun í Architectural Digest (júlí 2025) samkvæmt skráningunni sjálfri. Arkitektúrinn er þegar vottaður',
      '207 umsagnir, 4,96 í einkunn, efstu 5% skráninga á Airbnb. Útsýnið eitt fær 97 umtöl',
      'Í hjarta Gullna hringsins: Gullfoss, Geysir og Þingvellir í stuttum akstri. Sterkasta leitarorðasvæði íslenskrar ferðaþjónustu',
    ],
    weaknesses: [
      'Engin eigin vefsíða. Öll tilvera hússins á netinu býr á léni Airbnb og hverfur ef skráningin hverfur',
      'Þóknun Airbnb fylgir hverri einustu bókun, á verðlagi upp á um 800 dollara nóttin',
      'AD-umfjöllunin, 207 umsagnirnar og ljósmyndunin skila engri leitarniðurstöðu á eigin forsendum',
    ],
    opportunities: [
      'Eigin lén + LodgingBusiness-gagnasnið setur húsið beint í Google-leit um gistingu við Gullna hringinn',
      'Bein fyrirspurn á eigin síðu dregur úr Airbnb-þóknun án þess að hreyfa við Airbnb-skráningunni',
      'AD-umfjöllunin fær loksins heimili: pressa af þessari stærð á hvergi heima í dag',
    ],
  },
  positioning:
    'Hús sem Architectural Digest fjallar um á ekki að vera til eingöngu sem Airbnb-skráning. Frumgerðin gefur torfþakinu, vötnunum þremur og 207 umsögnum eigið svið, og bókunarfyrirspurn sem fer beint til gestgjafans.',
  outreach: {
    subject: 'Lakeview Retreat á eigin vef',
    body: `Ykkar eigin myndir, umsagnirnar og bein fyrirspurn án þóknunar. Frumgerð, engin skuldbinding: https://sindrimar02.github.io/iceland-frumgerdir/preview/lakeview`,
  },
}
