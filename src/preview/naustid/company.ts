import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for naustid. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'naustid',
    route: '/preview/naustid',
    name: 'Naustið',
    sector: 'Seafood restaurant',
    location: 'Ásgarðsvegur 1, Húsavík',
    region: 'North',
    established: 'Síðan um 2011',
    currentUrl: 'https://www.facebook.com/naustid/',
    ownerEmail: 'naustidfood@gmail.com',
    concept: 'Gula húsið við höfnina',
    conceptTagline:
      "Húsavík's number one rated seafood restaurant approached the way every guest already finds it, across the harbour toward the bright yellow house, with the signature soup on the table by the time you arrive.",
    accent: '#E3B81F',
    dark: true,
    /* Every photo on the page is the restaurant's own (Visit Húsavík listing);
     * the six Unsplash atmosphere shots were dropped in the Bárujárn pass. */
    ownPhotography: true,
    /* No domain resolves for Naustið (naustid.is / .com checked 2026-07-31);
     * their only web presence is the Facebook page. */
    noOwnSite: true,
    currentLabel: 'Núverandi Facebook-síða',
    status: 'Concept ready',
    thumb: 'https://visit-husavik.payload.is/api/media/file/Exterior%20PNG-2000x1125.png',
    audit: {
      strengths: [
        'Ranked #1 of 13 restaurants in Húsavík on Tripadvisor with thousands of reviews, plus a 4.8 rating on Restaurant Guru',
        'A genuinely distinctive, photogenic home: a bright yellow 1931 harbourside house called Sel, run by two sisters in law for over a decade',
        'A real signature dish, the seafood soup, repeatedly named by reviewers as the reason people stop',
      ],
      weaknesses: [
        "No independent website at all, já.is lists their official 'website' as literally a link to their Facebook page",
        'No online menu, so a top rated destination restaurant has nowhere to show its own dish list or price range',
        'No booking path beyond phone or walk in, despite being a stop on the busy Diamond Circle tourist route',
      ],
      opportunities: [
        "Give Húsavík's #1 rated restaurant an actual home online, built around the real yellow house and the signature soup",
        'Publish the real menu and hours once, on a page the owners control instead of Facebook',
        'Add a simple reservation request path for the travellers already driving the Diamond Circle to find them',
      ],
    },
    positioning:
      "Naustið is Húsavík's top rated restaurant, run by two sisters in law for over a decade out of a bright yellow 1931 harbourside house, with a seafood soup that reviewers name again and again as the reason to stop. Their entire web presence today is a Facebook page, and já.is even lists it as their official website. The redesign gives them a real home online: the same walk every guest already takes across the harbour toward the yellow house, ending at a real menu, hours and a place to request a table.",
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Naustið',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús.

Ég kynnti mér Naustið á Húsavík og sá að þið eruð í 1. sæti af 13 veitingastöðum á staðnum með yfir 2.500 umsagnir, sem er magnaður árangur. Samt er eina „vefsíðan" ykkar samkvæmt já.is einfaldlega hlekkur á Facebook.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái gula húsið, matseðilinn og fiskisúpuna sem allir tala um, og geti sent inn borðapöntun beint til ykkar. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
