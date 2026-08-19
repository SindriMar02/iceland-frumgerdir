import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for hunabud. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'hunabud',
    route: '/preview/hunabud',
    name: 'Húnabúð',
    sector: 'Café, flower shop & gift shop',
    location: 'Norðurlandsvegur 4, 540 Blönduós',
    region: 'North',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.facebook.com/hunabudin/',
    ownerEmail: 'hunabud@hunabud.net',
    concept: 'Þrennt undir einu þaki',
    conceptTagline:
      'The building’s own three-part signage, coffee, flowers and gifts under one roof, becomes the whole page structure, replacing a dead domain and a thin Facebook page with no way to see hours or what is inside.',
    accent: '#B5432E',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://itin-dev.wanderlogstatic.com/freeImage/6PM4N3opXL7Kl4i3YSOn8N8UXWHGteoK',
    audit: {
      strengths: [
        'A genuinely rare three-in-one business, café, flower shop and gift shop, all under one roof in Blönduós, with all three services visible on the building’s own real signage',
        'Confirmed operating into 2026, listed among the open venues at the Prjónagleðin knitting festival in June 2026, plus a 5-star Google review dated July 2025',
        'A distinctive Ring Road stop with real, photogenic material already in hand, the storefront, the pastry case, the lopapeysur rack outside',
      ],
      weaknesses: [
        'No website exists at all, the referenced domain hunabud.net is fully dead with no DNS record',
        'The only presence is a Facebook page with essentially no scrapable content, no menu, no hours, no way to see what is inside',
        'Some aggregators mislabel the listing “permanently closed”, with no owned web presence anywhere to correct that false signal',
      ],
      opportunities: [
        'Give travellers on Route 1 a real way to confirm hours and see what is inside before they stop',
        'Correct the false “permanently closed” signal with a real, current site the business actually controls',
        'Show the three-in-one story, coffee, flowers and gifts, exactly as the building’s own signage already tells it',
      ],
    },
    positioning:
      'Húnabúð is a genuine three-in-one roadside stop in Blönduós, a café, flower shop and gift shop confirmed operating into 2026, most recently listed among the open venues at the June 2026 Prjónagleðin knitting festival. The business has no website at all, its referenced domain hunabud.net has no DNS record, and its only presence is a thin Facebook page, which has let some aggregators wrongly mark the listing as permanently closed. The redesign turns the building’s own signage, coffee and delicacies, flowers, gifts, into the whole page structure, giving Route 1 travellers a real way to see what is inside before they stop.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Húnabúð',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk kaffihús og verslanir.

Ég kynnti mér Húnabúð og sá að þið sameinið kaffihús, blómabúð og gjafavöru undir einu þaki á Blönduósi, nákvæmlega eins og skiltin á húsinu segja. Á netinu er samt hvergi hægt að sjá opnunartímann ykkar, matseðilinn eða það sem er í boði hverju sinni.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að ferðafólk á þjóðveginum sjái strax að hjá ykkur er kaffi, blóm og gjafir undir sama þaki, og viti hvenær er opið. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
