import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for austri. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
/* ── Batch 3 — five new redesigns (combined-showcase build) ──────────────
   * Diversified across five sectors and five regions. Each is real, active,
   * owner-run, has a genuinely weak/dated/absent website, and strong visual
   * potential. Weider stays excluded from the public showcase. */

export const companyEntry: PreviewCompany = {
    // WHY: East Iceland craft brewery with NO website at all (pure greenfield) —
    // the clearest possible before/after. OPPORTUNITY: tell the place-and-product
    // story; every beer is named after an Austurland landmark. CUSTOMER: locals,
    // beer travellers and visitors looking to taste or find Austri on tap.
    slug: 'austri',
    route: '/preview/austri',
    name: 'Austri Brugghús',
    sector: 'Craft brewery',
    location: 'Egilsstaðir, East Iceland',
    region: 'East',
    established: 'Síðan 2015',
    currentUrl: 'https://www.instagram.com/austribrugghus',
    ownerEmail: '',
    concept: 'Fjallabjór',
    conceptTagline: 'East Iceland in a glass — beers named after the peaks, a tap list that paints the page.',
    accent: '#c8772b',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1546622891-02c72c1537b6?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A genuine East Iceland craft brewery with a strong local following',
        'Every beer named after an Austurland landmark — a ready-made story',
        'On tap locally (Askur taproom, Vök Baths); local ingredients (Vallanes barley)',
      ],
      weaknesses: [
        'No website at all — only a third-party directory listing and social pages',
        'Nowhere online to learn the story, see the beers, or find where to taste them',
        'The whole brand identity lives on other platforms it does not control',
      ],
      opportunities: [
        'A first real home for the brand — story, beer list and where-to-find',
        'Turn “beers named after the mountains” into the signature experience',
        'Point visitors to the taproom and stockists; build the East Iceland identity',
      ],
    },
    positioning:
      'East Iceland’s brewery, with no website to tell any of it. The site should make the place-and-beer story unmissable and send people to where they can taste it.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Austra Brugghús',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Mér finnst frábært það sem þið eruð að gera á Austurlandi, ekki síst að nefna bjórana eftir fjöllunum og kennileitunum í kring. Það eina sem ég fann ekki var vefsíða þar sem hægt er að kynnast sögunni, sjá bjórana og finna hvar má smakka þá.

Ég settist því niður og hannaði frumgerð að forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að gefa Austra loksins almennilegt heimili á netinu, segja söguna á bak við hvern bjór og vísa fólki á kranann. Ef ykkur líst vel á þetta heyri ég glaður meira, en annars vona ég að þetta veiti ykkur innblástur.

${SIGN}`,
    },
  }
