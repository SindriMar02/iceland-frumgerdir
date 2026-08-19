import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for fischersetur. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'fischersetur',
    route: '/preview/fischersetur',
    name: 'Bobby Fischer Center',
    sector: 'Chess museum',
    location: 'Selfoss, South Iceland',
    region: 'South',
    established: 'Opened 2013',
    currentUrl: 'https://www.fischersetur.is',
    ownerEmail: 'fischersetur@gmail.com',
    concept: 'Match of the Century',
    conceptTagline: 'The board is the interface — scroll-replay the 1972 Reykjavík championship in ink and bone, no stock photos.',
    accent: '#3FA7D6',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1633365087123-b3f2c305769a?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'World-famous subject — the 1972 Fischer and Spassky “Match of the Century” in Reykjavík',
        'The first chess museum in the Nordic countries',
        'Fischer is buried minutes away at Laugardælir — a real reason to stop',
      ],
      weaknesses: [
        'A free 2013 template with no mobile viewport — barely usable on a phone',
        'Live placeholder lorem-ipsum text and broken character encoding',
        'No real story, hours or map a visitor can act on',
      ],
      opportunities: [
        'Turn the 1972 match into an interactive, scrollable centrepiece',
        'Mobile-first hours, admission and map for Ring Road travellers',
        'A reverent, distinctive identity worthy of the subject',
      ],
    },
    positioning:
      'The world remembers the 1972 match; the museum that keeps it deserves a site visitors can play through. Make the chessboard the interface and the practical visit effortless.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Fischersetur',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki og söfn.

Ég hef lengi haft mikinn áhuga á sögu einvígisins 1972 og fannst frábært að sjá að það á sitt eigið safn á Selfossi. Það eina sem ég staldraði við var vefsíðan, því eins og hún er í dag opnast hún illa í síma og erfitt er að sjá opnunartíma, verð og hvar safnið er.

Mér fannst það synd fyrir svona merkilegt efni, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þar er einvígið sjálft gert að upplifun sem fólk getur spilað sig í gegnum. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn af nokkrum köflum, en ef ykkur líst vel á gæti ég klárað vefinn í heild. Ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
