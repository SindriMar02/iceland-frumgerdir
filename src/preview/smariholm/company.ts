import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for smariholm. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'smariholm',
    route: '/preview/smariholm',
    name: 'Prolan Bílaryðvörn Hjá Smára Hólm',
    sector: 'Vehicle rust protection',
    location: 'Hafnarfjörður',
    region: 'Capital Region',
    established: 'kt. 640815-0270',
    currentUrl: 'https://www.smariholm.com',
    ownerEmail: 'prolan@prolan.is',
    concept: 'Brynja',
    conceptTagline:
      'An invisible armor against Icelandic weather — warm paper instead of another dark page, rust-red for the threat, wax-amber for the cure, a drag scrubber across the real 10-year warranty.',
    accent: '#A8371B',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1723099971299-3789db53604c?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Real, well-reviewed local business — 14 Google reviews, genuine repeat-customer quotes',
        'A genuinely differentiated product: flexible lanolin membrane vs. rigid coatings that crack',
        'A strong, concrete claim already on the site — up to 10 years tested protection',
      ],
      weaknesses: [
        'Every image on the site is AI-generated ("ChatGPT Image ..." filenames), including the hero that looks photoreal at a glance',
        'A leftover, unrelated "PROLAN Bílamarkaður" graphic sits in the footer with unverified-looking NSF/ISO badges',
        'No pricing, no real photography of the actual hands-on work, generic Wix template chrome',
      ],
      opportunities: [
        'Replace every AI image with honest photography of real workshop/rust-prevention work',
        'Put the 10-year warranty claim and the 5x-corrosion stat front and center as the trust anchor',
        'Surface the real Google reviews, which the current site barely shows',
      ],
    },
    positioning:
      'A real, well-reviewed rust-protection specialist whose current site is a generic Wix template filled entirely with AI-generated imagery — undermining a business whose whole pitch is authenticity and craftsmanship. The redesign is built around Prolan\'s own real differentiator (a flexible lanolin membrane, not a rigid shell) and its real 10-year tested-protection claim.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Prolan Bílaryðvörn',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég rakst á Prolan og tók eftir góðum umsögnum viðskiptavina og því að lanólín-vörnin ykkar er í grunninn öðruvísi en hefðbundnar ryðvarnir, sveigjanleg frekar en stíf. Það er saga sem má nýta mun betur.

Því miður finnst mér núverandi vefsíða ekki gera henni skil. Myndirnar á síðunni, meira að segja sú sem lítur út fyrir að vera af verkstæðinu ykkar, eru allar tölvugerðar, og niðri í síðufæti er meira að segja óskyld auglýsing með óstaðfestum vottunum sem tengist ekki starfseminni ykkar.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái strax af hverju bíllinn þeirra þarf ryðvörn hér á landi, kynnist tíu ára prófaðri vernd ykkar og geti hringt eða sent línu án fyrirhafnar. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
