import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for sagakayak. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'sagakayak',
    route: '/preview/sagakayak',
    name: 'Saga Kayak',
    sector: 'Kayak & fishing tours',
    location: 'Lónabraut 5, Vopnafjörður',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.instagram.com/sagakayak/',
    ownerEmail: 'contact@sagakayak.is',
    concept: 'Róið inn fjörðinn',
    conceptTagline:
      'A family-run kayak outfit on Vopnafjörður fjord, where the page itself follows the same paddle route out, from the dock to open water, that a real trip with them takes.',
    accent: '#E8734F',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1724865054227-6a5f2449f856?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'An active, well-run Instagram presence, 326 followers and 64 posts, covering kayak, fishing and northern-lights trips across multiple seasons',
        'A distinctive fjord setting in Vopnafjörður, with real photos of the owners and the boat launch already in hand',
        'Still listed as a current operator on Visit Austurland’s official regional tourism site',
      ],
      weaknesses: [
        'Their own domain, sagakayak.is, is a dead, password-protected placeholder that has never launched',
        'No online booking system at all, trips are booked only by direct message, email or phone',
        'The only pricing information anywhere is a photo of a hand-written price list on Instagram',
      ],
      opportunities: [
        'Replace the dead placeholder domain with a real, bookable website built around the fjord and the family story',
        'Turn the hand-written price list into clear, structured pricing for kayak, fishing and aurora trips',
        'Capture travellers who plan and book online before they arrive, rather than relying on a chance direct message',
      ],
    },
    positioning:
      'Saga Kayak is a small, family-run kayak and fishing tour operator on Vopnafjörður fjord in East Iceland, active on Instagram across multiple seasons but with no real website of their own, their own domain is a password-protected placeholder that never launched. Every trip today is booked by direct message, email or phone, and the only pricing anywhere is a photo of a hand-written list. The redesign turns their real fjord setting and family story into a proper page, the same paddle out from the dock to open water that a real trip with them follows, ending at a clear way to book.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Saga Kayak',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Ég kynnti mér Saga Kayak og sá að ferðirnar ykkar bókast í dag í gegnum skilaboð og síma. Ferðafólk sem skipuleggur fyrirfram á netinu bókar oftast hjá þeim sem sýna ferðir og verð beint á vefsíðu, og eigin lén ykkar, sagakayak.is, er ennþá óopnuð biðsíða.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái fjörðinn, ferðirnar þrjár og verðin á augabragði, og geti sent inn bókunarbeiðni beint til ykkar. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
