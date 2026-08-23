import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for faxibakery. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // WHY: a beloved roadside bakery (fresh cinnamon rolls hourly, real espresso,
    // a clear view of Eyjafjallajökull) with NO website at all — designed from
    // scratch. CUSTOMER: self-driving tourists on the Ring Road between Hvolsvöllur
    // and Vík. Contact is Instagram @faxi_bakery_ / phone (no public email found).
    slug: 'faxibakery',
    route: '/preview/faxibakery',
    name: 'Faxi Bakery',
    sector: 'Bakarí & kaffihús',
    location: 'Undir Eyjafjöllum, þjóðvegur 1',
    region: 'South',
    established: 'Bakarí og kaffihús',
    currentUrl: 'https://www.instagram.com/faxi_bakery_',
    ownerEmail: '',
    concept: 'Nýbakað, með útsýni',
    conceptTagline:
      'Fresh-baked, with a view — a roadside bakery brand built from scratch around the hourly cinnamon roll and the volcano on the horizon.',
    accent: '#b23a48',
    dark: false,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'faxibakery/hero.jpg',
    audit: {
      strengths: [
        'A signature ritual people love — fresh cinnamon rolls baked every hour',
        'A postcard setting right on the Ring Road, looking at Eyjafjallajökull',
        'Real espresso, gluten-free options and an open kitchen you can watch',
      ],
      weaknesses: [
        'No website at all — passing travellers cannot find hours, menu or a reason to stop',
        'Discovery lives only on third-party review sites and Instagram',
        'No way to see the offering before driving past',
      ],
      opportunities: [
        'Build a real brand and first impression from the ground up',
        'Make the hourly cinnamon roll and the volcano view the hook',
        'Put hours, menu and location where road-trippers will actually look',
      ],
    },
    positioning:
      'A bakery this good with no website is invisible to the travellers driving past it. Built from scratch, the brand turns the hourly cinnamon roll and the Eyjafjallajökull view into a reason to stop — with hours, menu and location front and centre.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Faxi Bakery',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk bakarí og kaffihús.

Ég kom auga á Faxi Bakery og heillaðist strax. Nýbakaðir snúðar á hverjum klukkutíma, alvöru kaffi og útsýni yfir Eyjafjallajökul er nákvæmlega svona stopp sem ferðafólk elskar á leiðinni austur. Það eina sem ég fann ekki var vefsíða, svo fólk sem keyrir framhjá hefur enga leið til að sjá opnunartíma, hvað er í boði eða af hverju það ætti að stoppa.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að forsíðu fyrir ykkur frá grunni. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að ferðafólk finni ykkur áður en það keyrir framhjá, fái vatn í munninn og viti hvenær er opið. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
