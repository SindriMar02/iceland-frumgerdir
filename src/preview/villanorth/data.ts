import type { PreviewCompany } from '../companies'

/**
 * Villa North — eigandi (verkfræðingur skv. eigin gestgjafasniði), Fnjóskadalur,
 * Þingeyjarsveit. Heimild: Airbnb-skráningin (room 897747788867680607), sótt
 * 2026-08-04. 23 myndir sóttar og yfirfarnar (auk 5 amenity-mynda).
 * Engin eigin vefsíða fannst (aðeins northiceland.info-skráning, cozycozy,
 * Vrbo-speglar). ATH staðreyndagát: skráningin kallar Vaglaskóg "stærsta skóg
 * Íslands" — hann er sá NÆSTstærsti (Hallormsstaðaskógur er stærstur,
 * staðfest 2026-08-04). Notum aldrei "stærstur".
 *
 * ownerEmail tómt — ekkert fundið. Aldrei giska.
 */
export const companyEntry: PreviewCompany = {
  slug: 'villanorth',
  route: '/preview/villanorth',
  name: 'Villa North',
  sector: 'Gisting',
  location: 'Fnjóskadalur, Þingeyjarsveit',
  region: 'Norðurland',
  established: 'Einkavilla í Fnjóskadal',
  currentUrl: 'https://www.airbnb.com/rooms/897747788867680607',
  ownerEmail: 'villanorth@villanorth.is',
  concept: 'Málsett',
  conceptTagline:
    'Einkavilla í Fnjóskadal með útsýni yfir dalinn og heitum potti. Vefurinn gefur gestum tilfinningu fyrir dvölinni og leiðir þá að fyrirspurn.',
  accent: '#C29049',
  dark: false,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'villanorth/glass-grid.jpg',
  ownPhotography: true,
  noOwnSite: false,
  /* Astrid manages Villa North from Austria and its guests are the Airbnb
     audience, so the shared disclaimer speaks English here. */
  english: true,
  currentLabel: 'Airbnb listing',
  photoCredit:
    "Photography of Villa North, including originals supplied by the owners. The animated winter scene is identified separately.",
  audit: {
    strengths: [
      '140 m² hús fyrir allt að sjö gesti, með fjórum svefnherbergjum og 110 m² verönd',
      'Sérstæður arkitektúr, stórir gluggar og útsýni yfir Fnjóskadal',
      'Heitur pottur, fullbúið eldhús og sameiginleg rými fyrir fjölskyldur og vinahópa',
    ],
    weaknesses: [
      'GODO-bókunarkerfi og TourDesk bíða tengingar',
      'Nýr vefur þarf að sýna herbergjaskipan og svara algengum spurningum fyrir bókun',
      'Upplýsingar um næstu villu og bókunarskilmála þarf að staðfesta áður en opnað er fyrir bókanir',
    ],
    opportunities: [
      'Herbergjaskoðari og grunnmyndir hjálpa hópum að skipuleggja dvölina',
      'Persónuleg leið frá áhuga að fyrirspurn og beinni bókun',
      'Norðurlandsleit (Akureyri, Goðafoss, Vaglaskógur) á eigin forsendum með réttum staðreyndum',
    ],
  },
  positioning:
    'Einkavilla fyrir allt að sjö gesti, með fjórum svefnherbergjum og heitum potti. Vefurinn sýnir hvernig dvölin getur verið: sameiginlegar máltíðir, ferðir um Norðurland og róleg kvöld með útsýni yfir dalinn.',
  outreach: {
    subject: 'Villa North á eigin vef',
    body: `Vefur sem sýnir upplifunina af dvölinni, með útsýni, herbergjum og beinni fyrirspurn. Frumgerð: https://sindrimar02.github.io/iceland-frumgerdir/preview/villanorth`,
  },
}
