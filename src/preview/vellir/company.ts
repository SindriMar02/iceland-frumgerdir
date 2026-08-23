import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for vellir. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // WHY: a real, reviewed farm guesthouse under the dramatic Pétursey cliff (9 rooms
    // + two cottages, sheep/horses/poultry on-site, minutes from Sólheimajökull and
    // Reynisfjara), but the ONLY website is a bare, free Google Sites page with no
    // photos, no prices, no way to request a room. OPPORTUNITY: a real, warm one-pager
    // that finally gives it a presence to match its setting. CUSTOMER: self-drivers
    // researching where to stay near Vík on the South Coast.
    slug: 'vellir',
    route: '/preview/vellir',
    name: 'Guesthouse Vellir',
    sector: 'Farm guesthouse & cottages',
    location: 'Mýrdalur, near Vík',
    region: 'South',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://sites.google.com/view/Vellir',
    ownerEmail: 'f-vellir@islandia.is',
    concept: 'Between Glacier and Sea',
    conceptTagline:
      'A farm guesthouse under the cliffs of Pétursey, told through its own real photography — rooms, cottages and the mountain that watches over them — with a cooler, editorial signature distinct from its sibling build.',
    accent: '#3D5A6C',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://www.heyiceland.is/asset/1940/1-7.-8-og-9.-juli-2009-221s.jpg',
    audit: {
      strengths: [
        'A real, reviewed farm guesthouse under the dramatic Pétursey cliff, minutes off the Ring Road',
        '9 rooms across three types plus two private cottages, with real farm character — sheep, horses, poultry',
        'Genuinely close to Sólheimajökull, Dyrhólaey, Skógafoss and Reynisfjara',
      ],
      weaknesses: [
        'The only website is a bare, free Google Sites page',
        'No photos, no prices, and no way to actually request a room online',
        'Visitors researching where to stay near Vík have nothing real to compare it against',
      ],
      opportunities: [
        'Give it a real one-page home built on its own property photography',
        'Show the three room types and the two cottages clearly, side by side',
        'Make Pétursey mountain and the working farm the reason to stay here rather than in Vík itself',
      ],
    },
    positioning:
      'A real farm guesthouse under one of the South Coast’s most striking cliffs currently has no real website at all, just a bare Google Sites page. Let the mountain, the farm and the rooms speak for themselves.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Vellir',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu og gistingu.

Ég var að skoða gistimöguleika í Mýrdalnum og fann Vellir, alveg undir Pétursey. Staðsetningin er einstök og sauðfé, hestar og hænsn á bænum gera staðinn ekta. Það kom mér því á óvart að núverandi vefsíða er einföld Google Sites síða, án mynda, verðs eða leiðar til að senda fyrirspurn.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri vefsíðu sem sýnir herbergin þrjú, kofana tvo og fjallið sjálft eins og staðurinn á skilið. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að ferðafólk sem er að leita að gistingu nálægt Vík sjái strax hvað Vellir hefur upp á að bjóða, í stað þess að halda áfram að leita annað. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
