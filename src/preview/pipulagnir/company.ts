import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for pipulagnir. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'pipulagnir',
    route: '/preview/pipulagnir',
    name: 'Pípulagnir Suðurlands',
    sector: 'Plumbing',
    location: 'Selfoss, South Iceland',
    region: 'South',
    established: 'Est. 2000',
    currentUrl: 'https://psud.is',
    ownerEmail: 'psud@psud.is',
    concept: 'Heitt og kalt',
    conceptTagline:
      'The red and blue tap markers every Icelandic household knows become the design system: warm and cool alternating like hot and cold water through a house.',
    accent: '#921B1E',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1584774354932-62ceb99e6053?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '26 years in business (VAT-registered June 2000), owner-led since founding',
        'Creditinfo framúrskarandi rating — provable financial soundness',
        'Real breadth: gólfhiti, úðakerfi, matvælaiðnaður, loftræsting, viðhald',
      ],
      weaknesses: [
        'No opening hours, no contact form — a service business you cannot reach online',
        'News section frozen at a single post from February 2023',
        'One work photo on the whole site; the 26-year track record is invisible',
      ],
      opportunities: [
        'A quote-request flow for the jobs they already do daily',
        'Show the craft: floor heating and industrial piping as a visual story',
        'Own "pípulagnir Selfoss / Suðurland" search — the field is open',
      ],
    },
    positioning:
      'A 26-year South-Iceland plumbing firm with provable financial soundness and real industrial capability, served by a site with one photo and no way to ask for a quote. The redesign turns the hot-and-cold duality of their daily work into a design system built on their own red and green mark.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Pípulagnir Suðurlands',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég kynnti mér fyrirtækið ykkar og það vakti athygli mína. Pípulagnir í 26 ár á Selfossi, allt frá gólfhita og úðakerfum upp í lagnir fyrir matvælaiðnað, og framúrskarandi einkunn hjá Creditinfo. Það segir sína sögu um traust og vönduð vinnubrögð.

Því miður finnst mér vefsíðan ykkar ekki endurspegla þetta. Þar er hvorki hægt að sjá opnunartíma né senda fyrirspurn, aðeins ein mynd af verki, og nýjasta fréttin er frá því snemma árs 2023.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk á Suðurlandi finni ykkur, sjái strax hvað þið gerið og geti sent fyrirspurn um verk á augabragði. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
