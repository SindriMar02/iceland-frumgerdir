import type { PreviewCompany } from '../company-types'

/**
 * Mystic Light Lodge (Mirror Cabin) — Esther & Pierre, Búðardalur, Dalabyggð.
 * Heimild: Airbnb-skráningin (room 1104246660273438823), sótt 2026-08-04.
 * 21 mynd sótt og yfirfarin. Engin eigin vefsíða (aðeins OTA-speglar:
 * guidetoiceland.is, is-hotels.com). Tvö eins hús: hitt er með heitum potti
 * (sérskráning 1120400137280352498, þeirra eigin texti staðfestir).
 *
 * ownerEmail tómt — ekkert fundið. Lýsing skráningar er vélþýdd (líklega
 * þýskumælandi hjón). Aldrei giska á netfang.
 */
export const companyEntry: PreviewCompany = {
  slug: 'mysticlight',
  route: '/preview/mysticlight',
  name: 'Mystic Light Lodge',
  sector: 'Gisting',
  location: 'Búðardalur, Dalabyggð',
  region: 'Vesturland',
  established: 'Ofurgestgjafar í 2 ár',
  currentUrl: 'https://www.airbnb.com/rooms/1104246660273438823',
  ownerEmail: '',
  concept: 'Athugunarstöðin',
  conceptTagline:
    'Kofinn er tæki til að horfa: selir á fjöru, hafernir yfir firðinum, norðurljós um þakgluggann. Vefurinn er byggður eins og það tæki.',
  accent: '#D9A54E',
  dark: true,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'mysticlight/arrival-storm.jpg',
  ownPhotography: true,
  noOwnSite: true,
  currentLabel: 'Airbnb-skráning',
  photoCredit:
    'Allar myndir eru raunverulegar myndir úr Airbnb-skráningu Estherar og Pierre (21 mynd), sóttar 2026-08-04.',
  audit: {
    strengths: [
      '5,0 í einkunn yfir 61 umsögn. Fullkomið skor, ekki ein einasta frávik',
      'Þakglugginn yfir rúminu er raunverulegt sérkenni: gestir lýsa norðurljósum séðum úr rúminu í mörgum umsögnum',
      'Selir og hafernir við dyrnar, kíkir og fjarsjá í húsinu. Efnið í söguna er þegar til',
    ],
    weaknesses: [
      'Engin eigin vefsíða, aðeins Airbnb og OTA-speglar sem þau stjórna ekki',
      'Tvö hús seld gegnum tvær aðskildar Airbnb-skráningar sem vita ekki hvor af annarri',
      'Vélþýdd skráningarlýsing flettir kvöldsögunni þeirra út í almennt orðalag',
    ],
    opportunities: [
      'Eitt lén sem kynnir bæði húsin saman (með og án heita pottsins) í stað tveggja ótengdra skráninga',
      'Bein fyrirspurn framhjá þóknun Airbnb, á verðlagi um 580 dollara nóttin',
      'Google-leit um gistingu við Snæfellsnes/Vestfirði nær þeim í dag ekki neitt',
    ],
  },
  positioning:
    'Fullkomið 5,0 skor og þakgluggi sem gestir muna alla ævi, en engin eigin tilvera á netinu. Frumgerðin byggir vefinn eins og tækið sem kofinn er: sjónauki á ströndina, þakglugginn sem rammi og bein fyrirspurn til Estherar og Pierre.',
  outreach: {
    subject: 'Mystic Light Lodge á eigin vef',
    body: `Bæði húsin á einu léni, umsagnirnar ykkar og bein fyrirspurn. Frumgerð: https://sindrimar02.github.io/iceland-frumgerdir/preview/mysticlight`,
  },
}
