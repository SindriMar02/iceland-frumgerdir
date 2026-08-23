import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for polarhestar. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'polarhestar',
    route: '/preview/polarhestar',
    name: 'Pólar Hestar',
    sector: 'Horse-riding tours',
    location: 'Grenivík, Eyjafjörður',
    region: 'North',
    established: 'Síðan 1985',
    currentUrl: 'https://www.polarhestar.is',
    ownerEmail: 'polarhestar@polarhestar.is',
    concept: 'Þar sem hestar og álfar hittast',
    conceptTagline:
      'A luminous North-Iceland riding world along the longest fjord — folklore, the herd, and the changing northern light, with booking made simple.',
    accent: '#a9572f',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1575137224377-9af9b69676cb?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Fjölskyldurekið í 40 ár, um 160 íslensk hross og ferðir fyrir öll getustig',
        'Frábært orðspor: 4,9 stjörnur og Travelers’ Choice á Tripadvisor (263 umsagnir)',
        'Einstök staðsetning á Grýtubakka við Eyjafjörð, lengsta fjörð landsins',
      ],
      weaknesses: [
        'Engin netbókun, aðeins tölvupóstur og sími',
        'Tvö ólík símanúmer á síðunni og verð hvergi sýnd',
        'Gamalt útlit (Stefna Moya) með skjámyndum í stað alvöru ljósmynda',
      ],
      opportunities: [
        'Bein bókun á reiðtúr með dagsetningu, fjölda knapa og verði',
        'Sýna 40 ára söguna og norðlensku birtuna með alvöru myndum',
        'Eitt rétt símanúmer og skýr verð, hannað fyrir farsímann',
      ],
    },
    positioning:
      'Rótgróin hestaferðaþjónusta með frábært orðspor sem tapar bókunum því hvorki er hægt að bóka né sjá verð á netinu. Frumgerðin selur kyrrðina og norðlensku birtuna og gerir bókun á reiðtúr einfalda.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Pólar Hesta',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska ferðaþjónustu.

Þið hafið boðið upp á hestaferðir á Grýtubakka í fjörutíu ár og orðsporið er frábært, enda skína umsagnirnar á Tripadvisor. Þegar ég skoðaði vefsíðuna tók ég samt eftir að ekki er hægt að bóka ferð beint og verð koma hvergi fram, svo gestir sem vilja bóka strax eða erlendis frá leita oft annað.

Mér fannst upplifunin og staðurinn eiga skilið sterkari umgjörð, svo ég hannaði frumgerð að nýrri vefsíðu sem sýnir ferðirnar, norðlensku birtuna og gerir bókun einfalda. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  }
