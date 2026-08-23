import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for reykkofinn. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // WHY: a lava-field smokehouse and farm shop at Mývatn with an early-2000s
    // site (the weakest found) and a wonderful farm-to-table story. OPPORTUNITY:
    // the smoke/lava/lake story + simple ordering. CUSTOMER: Mývatn-area visitors
    // and Icelanders ordering smoked produce.
    slug: 'reykkofinn',
    route: '/preview/reykkofinn',
    name: 'Reykkofinn',
    sector: 'Smokehouse & farm shop',
    location: 'Hella, Mývatnssveit',
    region: 'North',
    established: 'Reykt sveitaafurðir',
    currentUrl: 'https://www.hangikjot.is',
    ownerEmail: 'hella@hangikjot.is',
    concept: 'Reykur úr hrauninu',
    conceptTagline: 'A lava-field smokehouse — wild Mývatn char, birch smoke, a farm shop.',
    accent: '#b5651d',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1763062550082-2c9f94096abb?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A real farm smokehouse in the lava by Lake Mývatn — strong provenance',
        'Wild Arctic char and traditional birch smoking; a working farm shop',
        'Sits in one of Iceland’s most-visited regions (Mývatn)',
      ],
      weaknesses: [
        'Early-2000s, table-based site with a single low-quality photo',
        'No mobile layout; the farm-to-table story is not told at all',
        'Ordering is a bare link rather than a real shop experience',
      ],
      opportunities: [
        'Tell the smoke-and-lava story with proper photography',
        'A simple ordering/visit flow for the farm shop',
        'Capture Mývatn route traffic with a clear, modern page',
      ],
    },
    positioning:
      'A lava-field smokehouse with a story most producers would envy — and a site that tells none of it. The redesign should make the provenance mouth-watering and the visit or order simple.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Reykkofann',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk matvælafyrirtæki og sveitabúðir.

Sagan ykkar er frábær, reykkofi í hrauninu og silungur úr Mývatni er einmitt það sem fólk vill heyra. Mér fannst núverandi vefsíða ekki ná að segja þá sögu, enda er hún orðin nokkuð gömul og virkar illa í síma.

Ég ákvað því að hanna frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að láta hráefnið og reykinn njóta sín og gera fólki auðvelt að panta eða koma við í sveitabúðinni. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars er það líka allt í lagi.

${SIGN}`,
    },
  }
