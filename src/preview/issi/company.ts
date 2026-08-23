import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for issi. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'issi',
    route: '/preview/issi',
    name: 'Issi Fish & Chips',
    sector: 'Fish & chips restaurant',
    location: 'Fitjar 3, Njarðvík, Reykjanesbær',
    region: 'Reykjanes',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://issi.is',
    ownerEmail: 'issi@issi.is',
    concept: 'Beint af bátnum',
    conceptTagline:
      'The real order window at dusk, the glow of the fryer and Þorbjörn’s boat rocking in the swell an hour up the coast carry the whole page, replacing a layout that leaves half the screen blank on desktop and overlaps text on phones.',
    accent: '#E0B004',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://issi.is/wp-content/uploads/2021/04/issi_fitjar_snjor.jpg',
    ownPhotography: true,
    audit: {
      strengths: [
        'Named a 2026 finalist in the UK National Fish and Chip Awards’ International category, confirmed by Iceland Review, RÚV and fishfocus.co.uk in February and March 2026',
        '1,183 reviews at 4.9 out of 5 on RestaurantGuru and 4.7 on Tripadvisor, ranked number 1 of 3 in Njarðvík, with continuing 2026 review activity',
        'Real, characterful owner photography already in hand, the bearded chef, the glowing shop at night, fish mid-fry in the pan',
      ],
      weaknesses: [
        'The site is fixed-width, not truly responsive, a 1600px desktop screen crams everything into a roughly 1000px column with a large blank dead zone beside it',
        'On a real phone screen the same fixed-width container still does not reflow, and the tagline visually overlaps the logo and the menu icon',
        'No phone number visible on the homepage itself, and no online ordering path beyond a single email for catering and events',
      ],
      opportunities: [
        'Fix the responsive break properly so the site actually works on the phones most customers are using',
        'Lead with the real photography and the 2026 award credibility instead of burying it in a broken layout',
        'Add simple, self-editable menu and hours management across both locations',
      ],
    },
    positioning:
      'Issi Fish & Chips is a real, owner-operated fish and chips business in Njarðvík and Selfoss, a 2026 finalist in the UK National Fish and Chip Awards’ International category and rated 4.9 out of 5 across more than a thousand reviews. Their own site, issi.is, is fixed-width rather than responsive, leaving a large blank dead zone on desktop and overlapping text on phones, with no phone number on the homepage. The redesign leads with their real photography, the bearded owner at the order window, the glow of the fryer at dusk, and fixes the layout so the site works as well on a phone as the food does at the counter.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Issi Fish & Chips',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús.

Ég kynnti mér Issi Fish & Chips og sá að þið komust í úrslit í alþjóðlegum flokki bresku fish and chips verðlaunanna 2026 og eruð með 4,9 í einkunn á Google. Vefurinn ykkar heldur samt ekki í við matinn, í símanum leggst textinn á forsíðunni yfir merkið ykkar og símanúmerið sést hvergi á síðunni.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að myndirnar ykkar og matseðillinn fái loksins að njóta sín, og að fólk finni strax símanúmerið, opnunartímann og staðsetninguna í símanum. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
