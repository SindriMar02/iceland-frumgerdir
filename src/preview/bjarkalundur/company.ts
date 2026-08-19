import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for bjarkalundur. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'bjarkalundur',
    route: '/preview/bjarkalundur',
    name: 'Hótel Bjarkalundur',
    sector: 'Historic hotel, restaurant & campsite',
    location: 'Bjarkalundi, 381 Reykhólahreppur',
    region: 'Westfjords',
    established: 'Síðan 1947',
    currentUrl: 'https://www.hotelbjarkalundur.is',
    ownerEmail: 'info.hotelbjarkalundur@gmail.com',
    concept: 'Hliðið að Vestfjörðum',
    conceptTagline:
      'The twin peaks of Vaðalfjöll and the hotel’s real forest-green lounges carry the arrival from road to gate to table, telling both the 1947 heritage and the fresh 2026 reopening as one continuous story instead of a Wix icon list.',
    accent: '#B08A3E',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://static.wixstatic.com/media/3d6816_9fcd9dd021f5427fa264407d12d5094a~mv2.jpg',
    ownPhotography: true,
    audit: {
      strengths: [
        'Iceland’s oldest continuously built summer hotel, raised 1945 to 1947 at the foot of Vaðalfjöll, corroborated by Vísir (2016), mbl.is (2025) and the hotel’s own history page',
        'A genuine 2026 relaunch, reopened 1 April 2026 under new owner Sigurður Friðriksson, confirmed by regional press and current 2026 pricing across Booking.com, Klook, Hotels.com and Expedia',
        '128 reviews on Booking.com and a full set of amenities already running, restaurant, bar, café, garden, campsite and EV charger',
      ],
      weaknesses: [
        'A mid-2010s Wix template with plain icon lists and a stacked photo gallery, the footer still shows a static, unmaintained “©2026 by Hotel Bjarkalundur” placeholder string',
        'No room pricing or availability shown on the hotel’s own site, booking is handed off entirely to a separate portal, property.godo.is, with no visual continuity',
        'Public contact is a personal Gmail address, info.hotelbjarkalundur@gmail.com, not a business-domain email, for a hotel with this much heritage',
      ],
      opportunities: [
        'Tell the two-part story a Wix template cannot, the 1947 heritage and the fresh 2026 reopening, through real Westfjords photography instead of icon lists',
        'Give the hotel a proper booking flow, or at least a designed handoff to the booking portal, instead of a bare external link',
        'Rebuild search visibility from scratch under the new ownership with a business-domain email and a site that actually represents the property',
      ],
    },
    positioning:
      'Hótel Bjarkalundur is Iceland’s oldest continuously built summer hotel, raised at the foot of Vaðalfjöll in the Westfjords between 1945 and 1947, and freshly reopened on 1 April 2026 under new owner Sigurður Friðriksson. The hotel is genuinely and currently operating, bookable today across Booking.com, Klook, Hotels.com and Expedia, but its own site is a mid-2010s Wix template with no room pricing, an external booking handoff, and a personal Gmail contact address. The redesign carries the arrival from road to gate to table as one continuous story, the twin peaks outside, the forest-green lounges inside, telling both the 1947 heritage and the 2026 fresh start honestly.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Hótel Bjarkalund',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk hótel og ferðaþjónustu.

Ég kynnti mér Hótel Bjarkalund og sá að þið rekið eitt elsta starfandi sumarhótel landsins, byggt á árunum 1945 til 1947 við rætur Vaðalfjalla, og opnuðuð það aftur í apríl á þessu ári. Núverandi vefur nær samt hvorki að segja þessa sögu né að sýna herbergin og veitingastaðinn eins og þau eiga skilið, öll bókun fer í gegnum utanaðkomandi kerfi og engin verð sjást á síðunni sjálfri.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái fjöllin, herbergin og salinn eins og þau eru í alvörunni, og finni strax leiðina að því að bóka. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
