import type { PreviewCompany } from '../companies'

/**
 * Mirror House Iceland — Ingibjorg ("Inga"), Ytri-Skeljabrekka, Borgarbyggð.
 * Sourced from the live Airbnb listing (room 852139182164211478) and her own
 * site, mirrorhouseiceland.com, 2026-08-04. See memory
 * airbnb-premium-walkthrough-strategy.md for the full research trail.
 *
 * ownerEmail is deliberately EMPTY: no address has been verified for her —
 * only a Facebook business page (178 followers, no public email) and Airbnb's
 * own host messaging. This project never invents a contact. Fill it only
 * from a source you have seen.
 *
 * currentUrl points at mirrorhouseiceland.com, NOT the Airbnb listing —
 * unlike a pure OTA-aggregator case, she already owns this domain. The
 * weakness is what it does (two links, one of them "Book on Airbnb"), not
 * that it doesn't exist. noOwnSite is therefore left unset.
 */
export const companyEntry: PreviewCompany = {
  slug: 'mirrorhouse',
  route: '/preview/mirrorhouse',
  name: 'Mirror House Iceland',
  sector: 'Gisting',
  location: 'Ytri-Skeljabrekka, Borgarbyggð',
  region: 'Vesturland',
  established: '10 ára Airbnb-gestgjafi',
  currentUrl: 'https://mirrorhouseiceland.com',
  ownerEmail: '',
  concept: 'Endurskinið',
  conceptTagline:
    'Kofinn hverfur inn í landslagið sem hann endurspeglar. Vefurinn sem hún þegar á ætti að gera slíkt hið sama.',
  accent: '#4FA87A',
  dark: true,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'mirrorhouse/hero-symmetrical.jpg',
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru raunverulegar myndir úr Airbnb-skráningu Ingibjargar (18 myndir), sóttar 2026-08-04.',
  audit: {
    strengths: [
      'Einstök spegilarkitektúr sem endurspeglar landslagið. Ekkert annað Airbnb á Íslandi lítur svona út',
      '412 umsagnir, 4,94 í einkunn, tíu ára reynsla sem gestgjafi. Traustið er þegar til staðar',
      'Hún á nú þegar sitt eigið lén og merki (mirrorhouseiceland.com). Fjárfestingin í eigin vörumerki er þegar hafin',
    ],
    weaknesses: [
      'Núverandi vefur er ein síða með tveimur hnöppum, „Um okkur" og „Bóka á Airbnb". Allar bókanir fara því beint í gegnum þóknun Airbnb',
      'Enginn beinn bókunarmöguleiki, engin umsögn sýnileg á eigin vef, ekkert vélrænt læsilegt gagnasnið',
      '412 umsagnirnar hennar eru læstar inni á Airbnb og skila henni engu utan þess',
    ],
    opportunities: [
      'Beinn bókunarmöguleiki á eigin léni dregur úr Airbnb-þóknun (14-16% af hverri nótt) sem hún greiðir í dag',
      'Umsagnirnar hennar fluttar yfir á eigin vef sem félagslegur trúverðugleiki, ekki læstar inni hjá Airbnb',
      'LodgingBusiness-gagnasnið gefur vélrænt læsilega auðkenningu sem vefurinn hefur ekki í dag',
    ],
  },
  positioning:
    'Ingibjörg á nú þegar lén, merki og eina síðu, en sú síða gerir ekkert nema senda gesti aftur til Airbnb. Frumgerðin sýnir hvað léninu hennar er raunverulega ætlað: kvikmyndaleg ferð í gegnum kofann sjálfan, umsagnirnar hennar 412 í aðalhlutverki, og bein bókun sem sparar henni þóknunina sem hún greiðir Airbnb á hverri einustu nótt.',
  outreach: {
    subject: 'Speglahúsið þitt, á þinni eigin síðu',
    body: `Sæl Ingibjörg,

Ég heiti Sindri og hanna vefsíður. Ég rakst á Speglahúsið á Airbnb og gat ekki hætt að skoða myndirnar. 412 umsagnir og 4,94 í einkunn tala sínu máli.

Ég tók eftir að þú átt nú þegar þitt eigið lén, mirrorhouseiceland.com, en að þaðan kemst maður bara beint aftur á Airbnb til að bóka.

Ég bjó til frumgerð af því hvernig síðan þín gæti litið út, með beinni bókun, umsögnunum þínum sýnilegum, og myndunum þínum í aðalhlutverki.

[HLEKKUR]

Endilega skoðaðu og láttu mig vita hvað þér finnst.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
