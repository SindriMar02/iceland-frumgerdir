import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for una. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'una',
    route: '/preview/una',
    name: 'UNA Local Store',
    sector: 'Handverks- og gjafavöruverslun',
    location: 'Austurvegur 4, Hvolsvöllur',
    region: 'South',
    established: 'Frá 2015',
    currentUrl: 'https://una-local-product.business.site',
    ownerEmail: 'info@unalocalstore.com',
    concept: 'Litla rauða húsið',
    conceptTagline:
      'One small red Nissen hut on the Ring Road, packed with everything a hundred local hands have made.',
    accent: '#A5352B',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A genuinely distinctive landmark: a red Nissen hut on the Ring Road since 2015',
        'Family-run (Magnús & Rebekka) with strong local sourcing: over 100 local knitters',
        '92% recommend on Facebook, well-reviewed on TripAdvisor',
      ],
      weaknesses: [
        'No real website, just a bare, unstyled Google Business page',
        'No sense of what is actually inside before visiting — the range of wool, food, jewelry and gifts is invisible online',
        'An owner reply on TripAdvisor mentions wanting a proper website; it never arrived',
      ],
      opportunities: [
        'Show the range (wool, food, jewelry, skincare) so travellers plan a stop, not a drive-by',
        'Use the hut itself as the visual identity — it is genuinely memorable',
        'A simple hours + map + "what is in the hut" page fixes almost everything',
      ],
    },
    positioning:
      'A real family shop inside a landmark red hut on the Golden Circle route, selling work from a hundred local hands, and none of it visible online. The site should make the hut itself the hero.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir UNA Local Store',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég kynnti mér búðina ykkar í rauða skálanum á Hvolsvelli og fannst hún einstök. Handverk frá yfir hundrað prjónakonum, íslensk matvara og gjafavara, allt í einu litlu og eftirminnilegu húsi við þjóðveginn. Því miður er núverandi vefsíða bara ómótuð Google síða, þannig að ferðafólk sem er að skipuleggja stopp á leiðinni sér ekkert af þessu fyrirfram.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái hvað leynist í rauða húsinu áður en það keyrir framhjá, og að skálinn sjálfur fái að vera aðalsöguhetjan. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
