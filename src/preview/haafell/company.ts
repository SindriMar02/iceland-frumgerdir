import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for haafell. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'haafell',
    route: '/preview/haafell',
    name: 'Háafell Geitfjársetur',
    sector: 'Goat farm & conservation',
    location: 'Hvítársíða, Borgarfjörður',
    region: 'West',
    established: 'Síðan 1989',
    currentUrl: 'https://www.geitur.is',
    ownerEmail: 'geitur@geitur.is',
    concept: 'Síðasta hjörðin',
    conceptTagline: 'The only Icelandic goat farm, telling a 1,100-year breed back from the brink.',
    accent: '#5f7138',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Eina geitfjársetrið á Íslandi, lykilbýli í björgun íslensku geitarinnar',
        'Sterk saga: forn stofn frá landnámi sem stóð frammi fyrir útrýmingu',
        'Heimsóknir, geitaafurðir og einlæg saga sem fólk tengir við',
      ],
      weaknesses: [
        'Aðeins á íslensku, engin enska fyrir erlenda gesti',
        'Pöntunarhlekkur á vörur virkar ekki, enginn H1 og engin lýsigögn',
        'Þrjár tómar síður í sitemap og rangur bær í titli (Borgarnes)',
      ],
      opportunities: [
        'Tvítyngd síða (íslenska og enska) fyrir ferðafólk á Vesturlandi',
        'Segja verndunarsöguna sterkt og sýna opnunartíma, verð og kort',
        'Eigin vöruhluti í stað brotins pöntunarhlekks',
      ],
    },
    positioning:
      'Ótrúleg verndunarsaga sem síðan kemur ekki til skila. Frumgerðin segir söguna á tveimur tungumálum og gerir heimsókn og kaup auðveld.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Háafell Geitfjársetur',
      body: `Sæl Jóhanna,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki og ferðamannastaði.

Háafell er einstakur staður, eina geitfjársetrið á landinu og saga íslensku geitarinnar sem þið hafið bjargað frá útrýmingu. Þegar ég skoðaði vefsíðuna tók ég eftir að hún er aðeins á íslensku og að hlekkurinn til að panta vörur virkar ekki, svo erlendir gestir og þeir sem vilja versla komast ekki alla leið.

Mér fannst sagan ykkar eiga skilið að heyrast, svo ég hannaði frumgerð að nýrri vefsíðu á íslensku og ensku sem segir söguna, sýnir opnunartíma og verð og gerir heimsókn auðvelda. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta getum við talað um sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  }
