import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for fiskkompani. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'fiskkompani',
    route: '/preview/fiskkompani',
    name: 'Fisk Kompaní',
    sector: 'Fish & deli retail, two shops',
    location: 'Kjarnagata 2 & Glerártorg, Akureyri',
    region: 'North',
    established: 'Frá 2013',
    currentUrl: 'https://www.fiskkompani.is',
    ownerEmail: 'fiskkompani@fiskkompani.is',
    concept: 'Dagsins afli, loksins á netinu',
    conceptTagline:
      'The real fish counter in Akureyri, its own five year old "opening soon" placeholder finally paid off with a working shop, and the new Ólafsfjörður smokehouse story told in drifting smoke.',
    accent: '#D9552B',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://veitingageirinn.is/wp-content/uploads/2023/02/opnun-fisk-kompani.jpg',
    audit: {
      strengths: [
        'A real, growing business: two staffed shops in Akureyri plus an April 2026 acquisition of an Ólafsfjörður salmon and Arctic char smokehouse',
        'Founded in 2013 by four local partners, over a decade of trading with roughly 8,400 Facebook followers and a loyal fresh fish and deli following',
        'Genuinely photogenic counter and product displays, real opening day and press photography already exists to build from',
      ],
      weaknesses: [
        'fiskkompani.is redirects to a password gated Shopify placeholder that has read "Opnum vefverslunina fljótlega" for years, with no products, photos or store info',
        'The second location at Glerártorg is not represented anywhere on the domain at all',
        'No online ordering exists despite the placeholder literally promising a web store',
      ],
      opportunities: [
        'Finally deliver the web store the placeholder has promised for years, built around the real counter and both real shop locations',
        'Tell the Ólafsfjörður smokehouse acquisition as a fresh, active growth story',
        'Turn thousands of Facebook followers into a proper site people can actually shop from',
      ],
    },
    positioning:
      "Fisk Kompaní is a real, growing fish and deli retailer with two staffed shops in Akureyri and a fresh 2026 acquisition of a salmon and Arctic char smokehouse in Ólafsfjörður, built on over a decade of trading since 2013. Its own domain has redirected for years to a password gated Shopify placeholder promising an online store that never arrived, with no products, photos or even a mention of the second shop. The redesign finally finishes that promise: a real photo led shop built around the counter, both locations and the new smokehouse story.",
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Fisk Kompaní',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk matvælafyrirtæki.

Ég kynnti mér Fisk Kompaní á Akureyri og sá að þið hafið vaxið jafnt og þétt síðan 2013, núna með tveimur verslunum og nýkeyptu reykhúsi á Ólafsfirði. Í dag tekur lykilorðssíða á móti þeim sem heimsækja fiskkompani.is, en vefverslunin er á leiðinni í loftið.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu með vefverslun fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk geti verslað hjá ykkur á netinu frá fyrsta degi, séð báðar búðirnar og kynnst nýja reykhúsinu á Ólafsfirði. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
