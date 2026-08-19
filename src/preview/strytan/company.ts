import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for strytan. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // Strýtan Dive Center — Hjalteyri, Eyjafjörður. Since 2010, Erlendur Bogason.
    // Geothermal hydrothermal-chimney diving. Concept "Niður að strýtunni": a
    // scroll-driven WebGL descent + a request-a-dive mailto flow (no online booking).
    slug: 'strytan',
    route: '/preview/strytan',
    name: 'Strýtan Dive Center',
    sector: 'Köfun og upplifun',
    location: 'Hjalteyri, Eyjafjörður',
    region: 'North',
    established: 'Strýtan Dive Center, frá 2010',
    currentUrl: 'https://strytan.is',
    ownerEmail: 'strytan@strytan.is',
    concept: 'Niður að strýtunni',
    conceptTagline:
      'A scroll-driven descent into Eyjafjörður: the page sinks from the silver surface down through the blue to the glowing hydrothermal chimney, an original animated world built around their real teal-chimney logo.',
    accent: '#2CA6B7',
    dark: true,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'strytan/thumb.jpg',
    audit: {
      strengths: [
        'Einstök upplifun á heimsvísu: köfun við jarðhitastrýtur sem finnast hvergi annars staðar í boði fyrir sportkafara',
        'Erlendur Bogason, frumkvöðull og rannsóknarkafari, hefur kafað strýturnar frá 2010 og átti þátt í friðlýsingu þeirra',
        'Framúrskarandi umsagnir á TripAdvisor og samstarf við Háskólann á Akureyri og Íslenskar orkurannsóknir',
      ],
      weaknesses: [
        'Vefurinn er frá miðjum síðasta áratug, engin netbókun og hvergi verð',
        'Neðansjávarmyndirnar, sem eru sjálf söluvaran, birtast varla og engin sterk myndræn frásögn er til staðar',
        'Ekkert skipulagt gagnamerki og enskur ferðamaður fær litla leiðsögn um hvernig eigi að bóka',
      ],
      opportunities: [
        'Gera sjálfa niðurköfunina að upplifun á vefnum: síðan sekkur niður að glóandi strýtunni',
        'Skýrt bókunarferli fyrir hverja köfun og hvert námskeið í stað almenns netfangs',
        'Segja rannsóknar- og friðlýsingarsöguna sem enginn keppinautur á',
      ],
    },
    positioning:
      'Heimsþekkt köfun við jarðhitastrýtur en vefur sem sýnir hvorki upplifunina né verð. Frumgerðin gerir sjálfa niðurköfunina að hreyfingu á vefnum, frá silfruðu yfirborði niður í bláma að glóandi strýtunni, og gefur gestum skýra leið til að óska eftir köfun.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Strýtuna',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Köfunin ykkar við jarðhitastrýturnar í Eyjafirði er einstök á heimsvísu og umsagnirnar tala sínu máli. Þegar ég skoðaði vefinn ykkar fannst mér hann samt ekki gera upplifuninni skil: neðansjávarmyndirnar sjást varla, hvergi er hægt að sjá verð og ferðamaður sem vill bóka fær bara almennt netfang.

Mér fannst þetta svo spennandi að ég hannaði frumgerð að nýjum vef þar sem sjálf niðurköfunin verður upplifun: síðan sekkur með þér frá yfirborðinu niður í bláma að glóandi strýtunni, sagan um rannsóknirnar og friðlýsinguna fær pláss og gestir geta óskað eftir köfun með nokkrum smellum. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  }
