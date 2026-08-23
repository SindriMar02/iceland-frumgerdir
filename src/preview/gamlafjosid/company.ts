import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for gamlafjosid. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // WHY: a wonderful farm-to-table story (own free-range beef, an old cowshed
    // under Eyjafjallajökull, since 1999, the Eldfjallasúpa) lost on a cluttered,
    // dated template with duplicate menus, a price typo and weak imagery.
    // CUSTOMER: travellers on the South Coast and Icelanders who make the trip.
    slug: 'gamlafjosid',
    route: '/preview/gamlafjosid',
    name: 'Gamla Fjósið',
    sector: 'Veitingahús',
    location: 'Hvassafell, undir Eyjafjöllum',
    region: 'South',
    established: 'Síðan 1999',
    currentUrl: 'https://gamlafjosid.is',
    ownerEmail: 'info@gamlafjosid.is',
    concept: 'Eldur, gras og nautakjöt',
    conceptTagline:
      'The Old Cowshed — own-farm beef under a volcano, a farm-to-plate story told warm and whole.',
    accent: '#9a3f12',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1507807823252-1870c299a391?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'An enviable story — their own free-range beef, garden vegetables and daily bread',
        'A working farm in a converted cowshed right under Eyjafjallajökull, since 1999',
        'A signature people remember (the Eldfjallasúpa / Volcano Soup)',
      ],
      weaknesses: [
        'A dated template with duplicate menus and navigation repeated down the page',
        'A real price typo (Kr. 1.1.210) and weak, placeholder-feeling imagery',
        'Seasonal closing and table booking are buried and slightly contradictory',
      ],
      opportunities: [
        'Lead with the farm-to-plate provenance and the volcano setting',
        'A single, photographed, scannable menu with the Volcano Soup featured',
        'Clear hours and season, and an easy table booking',
      ],
    },
    positioning:
      'The food and the farm are the story; the current site hides both. The redesign leads with own-farm beef under Eyjafjallajökull, a warm photographed menu around the Eldfjallasúpa, and clear hours and booking.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Gamla fjósið',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús og ferðaþjónustu.

Sagan ykkar í Gamla fjósinu er einmitt það sem fólk fellur fyrir. Eigið nautakjöt beint af bænum, gamalt fjós undir Eyjafjöllum og Eldfjallasúpa sem fólk talar um. Mér fannst þó núverandi vefsíða ekki gera þessari sögu nógu hátt undir höfði. Matseðillinn endurtekur sig nokkrum sinnum á síðunni, myndirnar eru fáar og litlar, og það er ekki alveg einfalt að sjá hvenær er opið eða hvernig maður bókar borð.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur, þar sem ég reyndi að laga einmitt þessi atriði. Sagan og hráefnið fá að njóta sín efst, matseðillinn er einn og skýr með flipum eftir flokkum, stórar myndir gera réttina girnilega og Eldfjallasúpan fær sitt eigið pláss. Svo eru opnunartímar á hreinu og einfalt að bóka borð. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
