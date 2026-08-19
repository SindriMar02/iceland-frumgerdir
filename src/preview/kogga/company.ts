import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for kogga. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'kogga',
    route: '/preview/kogga',
    name: 'Kogga',
    sector: 'Ceramic studio & gallery',
    location: 'Vesturgata 5, Reykjavík',
    region: 'Capital',
    established: 'Í 40 ár',
    currentUrl: 'https://www.kogga.is',
    ownerEmail: 'kogga@kogga.is',
    concept: 'Innlegg',
    conceptTagline: 'A 40-year studio built on inlaid porcelain — fragments that assemble into form.',
    accent: '#8f3b2e',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Kolbrún Björgólfsdóttir, fjörutíu ára ferill og eigin innlagstækni',
        'Rauða húsið við Vesturgötu 5, vinnustofa og galarí undir sama þaki',
        'Einstök verk sem sameina postulín og steinleir, innblásin af landinu',
      ],
      weaknesses: [
        'Engin verð sjást þegar flett er verkunum, engin stærð eða saga',
        'Engir opnunartímar, ekkert kort og engin lýsigögn',
        'Útlit óbreytt frá 2016, stendur ekki undir gæðum verkanna',
      ],
      opportunities: [
        'Sýna verkin eins og á safni, með verði, stærð og sögu hvers stykkis',
        'Bjóða heimsókn í vinnustofuna með opnunartíma og korti',
        'Segja söguna á bak við innlagstæknina sem fólk man eftir',
      ],
    },
    positioning:
      'Keramík í safngæðaflokki seld á síðu sem felur verðið og söguna. Frumgerðin setur verkin á stall og gerir bæði kaup og heimsókn einföld.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Koggu',
      body: `Sæl Kolbrún,

Ég heiti Sindri og hanna vefsíður fyrir íslenskt handverk og listafólk.

Keramíkverkin þín og innlagstæknin sem þú hefur þróað í fjörutíu ár eru einstök, og rauða húsið við Vesturgötu er staður sem fólk man eftir. Þegar ég skoðaði vefsíðuna tók ég eftir að gestir sjá ekki verð þegar þeir fletta verkunum og opnunartímar koma hvergi fram, sem getur valdið því að áhugasamir kaupendur og gestir gefist upp.

Mér fannst verkin eiga skilið umgjörð í sínum gæðaflokki, svo ég hannaði frumgerð að nýrri vefsíðu þar sem verkin og sagan fá að njóta sín. Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef þér líst vel á þetta getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  }
