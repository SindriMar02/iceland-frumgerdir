import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for reykjavikdistillery. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'reykjavikdistillery',
    route: '/preview/reykjavikdistillery',
    name: '64° Reykjavik Distillery',
    sector: 'Craft distillery',
    location: 'Hafnarfjörður',
    region: 'Capital',
    established: 'Síðan 2009',
    currentUrl: 'https://reykjavikdistillery.is',
    ownerEmail: 'info@reykjavikdistillery.is',
    concept: 'Frá villtu í glas',
    conceptTagline: 'A dark, cinematic spirits-house: a Lenis scroll descends from wild Icelandic highland through the copper still into the real bottles.',
    accent: '#c8881e',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1514218953589-2d7d37efd2dc?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Fjölskyldurekið örbrugghús frá 2009, fyrsta sinnar tegundar á Íslandi',
        'Sterk saga: jurtir tíndar í íslenskri náttúru, frá villtu í glas',
        'Selt á 60+ stöðum, í Fríhöfninni og um borð hjá Icelandair og Play',
      ],
      weaknesses: [
        'Engin verð og engin bein leið til að kaupa vörurnar',
        'Tæknilega úrelt (PHP 7.0), enginn H1, engin lýsigögn, læstur aðdráttur í síma',
        'Bragðlýsingar, styrkur og flöskustærðir vantar á vörurnar',
      ],
      opportunities: [
        'Setja vörurnar, bragðið og verðið í forgrunn með skýrri kaupleið',
        'Segja jurtasöguna (64° = breiddargráða Reykjavíkur) sem fáir keppa við',
        'Opna á heimsóknir og smakk í brugghúsinu í Hafnarfirði',
      ],
    },
    positioning:
      'Verðlaunavert íslenskt handverk sem felur sína bestu sögu. Frumgerðin er kvikmyndaleg ferð frá villtri náttúru í glas sem setur eimingarnar, bragðið og kaupin í forgrunn.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir 64° Reykjavik Distillery',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Það sem þið gerið hjá 64° Reykjavik Distillery er fallegt handverk, íslenskar jurtir tíndar í náttúrunni og settar í flösku. Þegar ég skoðaði vefsíðuna tók ég eftir að hvergi sjást verð á vörunum og engin bein leið er til að kaupa þær, sem getur orðið til þess að áhugasamir gestir hætta við áður en þeir komast lengra.

Mér fannst sagan og vörurnar eiga skilið betri umgjörð, svo ég hannaði frumgerð að nýrri vefsíðu sem setur jurtirnar og bragðið í forgrunn. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  }
