import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for edinborg. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'edinborg',
    route: '/preview/edinborg',
    name: 'Edinborg Bistró',
    sector: 'Harbour bistro',
    location: 'Ísafjörður, Westfjords',
    region: 'Westfjords',
    established: 'House from 1907',
    currentUrl: 'https://edinborgbistro.is',
    ownerEmail: 'bistro@edinborgbistro.is',
    concept: 'A Bistro Told in Courses',
    conceptTagline: 'The menu as the hero — a self-setting letterpress bill of fare in the 1907 harbour house; slate, ecru and oxblood.',
    accent: '#6E1F2B',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1687706418918-1c95d829b478?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Lands in the landmark 1907 Edinborg house on the Ísafjörður harbour',
        'Strong reviews across platforms (RestaurantGuru around 4.7)',
        'A real destination in the Westfjords hub',
      ],
      weaknesses: [
        'No working website at all — the domain shows a blank placeholder',
        'A visitor who finds them online gets no menu, hours or location',
        'Everything lives on Facebook, invisible to a quick search',
      ],
      opportunities: [
        'Put a real, beautiful menu on the domain they already own',
        'Clear hours, map and contact for travellers in town',
        'Tell the Edinborg-house heritage that makes the room unique',
      ],
    },
    positioning:
      'A beloved harbour bistro with no website is leaving travellers at a blank page. Give the 1907 house one elegant page where the menu itself is the experience.',
    outreach: {
      subject: 'Hugmynd að vefsíðu fyrir Edinborg Bistró',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í veitingum og ferðaþjónustu.

Ég er mikill aðdáandi þess sem þið gerið í Edinborgarhúsinu og heyri eingöngu gott af staðnum. Það eina sem ég fann ekki var vefsíða, því þegar maður leitar að ykkur á netinu birtist auð síða og hvorki matseðill, opnunartími né staðsetning.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að vefsíðu fyrir ykkur þar sem matseðillinn sjálfur er aðalatriðið og sagan af húsinu fær að njóta sín. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn, en ef ykkur líst vel á gæti ég klárað vefinn í heild og sett hann inn á lénið sem þið eigið nú þegar.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
