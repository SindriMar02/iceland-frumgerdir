import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for weider. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'weider',
    route: '/preview/weider',
    name: 'Weider',
    sector: 'Sports nutrition e-commerce',
    location: 'Kópavogur (Aura ehf)',
    region: 'Capital region',
    established: 'Weider síðan 1936',
    currentUrl: 'https://www.weider.is',
    ownerEmail: 'weidervorur@gmail.com',
    concept: 'The Engine Room',
    conceptTagline:
      'Heritage performance-nutrition storefront — Weider black-and-red, engineered for trust and conversion.',
    accent: '#e11d48',
    dark: true,
    status: 'Concept ready',
    thumb:
      'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Strong global brand (Weider, “síðan 1936”) with real heritage and trust',
        'Broad range of genuine Weider Germany products, in Icelandic and ISK',
        'Clear audience: gym-goers and health-minded Icelanders, growing market',
      ],
      weaknesses: [
        'Default Shopify “Dawn” theme with a “Powered by Shopify” footer — looks templated',
        'No brand story; the /um-okkur page 404s and the homepage is just the tagline',
        'Weak trust: no reviews, a buried Gmail contact, mixed German/English product data',
      ],
      opportunities: [
        'Build instant trust with heritage, reviews and a clear shipping promise',
        'Guide buyers to the right product by goal (muscle, energy, recovery, health)',
        'A premium storefront that turns browsing into checkout',
      ],
    },
    positioning:
      'Iceland’s home of Weider — heritage performance nutrition since 1936. The site should build instant trust, make the range effortless to navigate by goal, and turn browsers into buyers.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Weider',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Weider er sterkt vörumerki með langa sögu og frábærar vörur, og mér fannst núverandi vefverslun ekki gera því nógu hátt undir höfði. Hún byggir á stöðluðu sniðmáti og nær hvorki að segja sögu vörumerkisins né leiða viðskiptavini á einfaldan hátt að réttu vörunni.

Ég settist því niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að byggja strax upp traust, gera vöruflokkana skýra og leiða fólk hratt að réttu vörunni eftir markmiði. Ef ykkur líst vel á stefnuna gæti ég klárað vefinn í heild, en annars vona ég samt að þetta veiti ykkur smá innblástur.

${SIGN}`,
    },
  }
