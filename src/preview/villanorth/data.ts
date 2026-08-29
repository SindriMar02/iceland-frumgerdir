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
  established: 'Ofurgestgjafi í 3 ár',
  currentUrl: 'https://www.airbnb.com/rooms/897747788867680607',
  ownerEmail: '',
  concept: 'Málsett',
  conceptTagline:
    'Verkfræðingur byggði húsið og það sést. Vefurinn er teiknaður eins og teikningarnar hans: hárlínur sem verða að alvöru húsi.',
  accent: '#C29049',
  dark: false,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'villanorth/glass-grid.jpg',
  ownPhotography: true,
  noOwnSite: true,
  currentLabel: 'Airbnb-skráning',
  photoCredit:
    'Allar myndir eru raunverulegar myndir úr Airbnb-skráningu Villa North (23 myndir), sóttar 2026-08-04.',
  audit: {
    strengths: [
      '5,0 í einkunn yfir 54 umsagnir, efstu 10% skráninga. Gestir kalla húsið "the real deal"',
      'Alvöru hönnunarhús: Minotti-húsgögn, Miele-tæki, steypa og klæðning mynduð eins og arkitektaverk',
      'Eina húsið af þessari stærð: 7 gestir, 4 svefnherbergi. Hópar og fjölskyldur eiga fáa premium-kosti fyrir norðan',
    ],
    weaknesses: [
      'Engin eigin vefsíða. Hús á þessu verðlagi (um 1.400 dollara nóttin) býr eingöngu á Airbnb',
      'Airbnb-skráningin getur ekki svarað spurningunni sem hópar spyrja fyrst: hver sefur hvar',
      'Skráningin fer rangt með staðreynd (Vaglaskógur sagður stærsti skógur landsins) sem eigin vefur myndi laga',
    ],
    opportunities: [
      'Herbergjaskoðari sem svarar "hver sefur hvar" beint, með heiðarlegum smáatriðum (böðin bæði niðri)',
      'Bein fyrirspurn á eigin léni framhjá þóknun Airbnb á hæsta verðlagi þessa hóps',
      'Norðurlandsleit (Akureyri, Goðafoss, Vaglaskógur) á eigin forsendum með réttum staðreyndum',
    ],
  },
  positioning:
    'Hús sem er hannað og byggt af verkfræðingi, með Minotti-húsgögnum og 5,0 í einkunn, á skilið meira en skráningarsíðu. Frumgerðin teiknar húsið eins og teikningar eigandans og svarar spurningunni sem hver hópur spyr: hver sefur hvar.',
  outreach: {
    subject: 'Villa North á eigin vef',
    body: `Húsið þitt teiknað eins og teikningarnar þínar, með beinni fyrirspurn. Frumgerð: https://sindrimar02.github.io/iceland-frumgerdir/preview/villanorth`,
  },
}
