import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for heitirpottar. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // WHY: Iceland's best-known hot tub / sauna store (Fiskikóngurinn ehf., Kristján
    // Berg, domain since 2004). Sells 300k to 6M ISK products (Arctic Spas tubs,
    // hitaveituskeljar, saunahús named Alþingi / Bessastaðir / Þingvellir) plus real
    // discounts, yet runs on a stock Shopify "Reformation" template with Photoroom
    // cutouts, no storytelling and no address on the site. OPPORTUNITY: a dark
    // photographic showroom built from their OWN imagery and REAL prices, section
    // architecture that maps 1:1 to a custom Shopify Liquid theme (Path 1).
    slug: 'heitirpottar',
    route: '/preview/heitirpottar',
    name: 'Heitirpottar.is',
    sector: 'Hot tub & sauna e-commerce',
    location: 'Reykjavík',
    region: 'Capital',
    established: 'Est. 2004',
    currentUrl: 'https://heitirpottar.is',
    ownerEmail: 'kristjan@heitirpottar.is',
    concept: 'Gufa',
    conceptTagline:
      'A basalt-black digital showroom at dusk: a full-bleed timed product slideshow with real prices and discounts, their own night photography finally doing the selling, one ember accent. Every section maps 1:1 to a Shopify Liquid section.',
    accent: '#F07B3C',
    dark: true,
    status: 'Concept ready',
    thumb:
      'https://heitirpottar.is/cdn/shop/files/njota_2_b375b88f-08b1-43d6-9224-9b94551decee.jpg?width=1200',
    audit: {
      strengths: [
        'Strong catalog with real personality: saunahús named Alþingi, Bessastaðir and Þingvellir, uniquely Icelandic hitaveitupottar',
        'Genuinely premium supplier photography (night shots of glowing saunas in snow) already in their CDN',
        'Open every day, three phone lines, active on four social platforms, real discounts running',
      ],
      weaknesses: [
        'Stock Shopify "Reformation" template presents 3M ISK tubs like small accessories',
        'Best imagery is buried; homepage is a generic slideshow plus white product-card grids',
        'No founder story, no address, no kennitala on the site despite the owner being a well-known merchant',
      ],
      opportunities: [
        'A dark showroom experience built from their own photography and live prices',
        'Lead with Góðir dílar: real discounts (up to 44%) deserve hero placement, not a nav link',
        'Custom Liquid theme migration keeps their admin, checkout and inventory untouched',
      ],
    },
    positioning:
      'The best-known pottar store in Iceland sells showroom-class products through a stock template. Give the store a digital showroom at dusk, built from its own night photography and real prices, architected so every section drops straight into their existing Shopify as a custom Liquid theme.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Heitirpottar.is',
      body: `Sæll Kristján,

Ég heiti Sindri og hanna vefsíður fyrir íslenskar verslanir og þjónustufyrirtæki.

Það er margt sem þið gerið mjög vel á Heitirpottar.is. Vöruúrvalið er sterkt, saunahús með nöfn eins og Alþingi og Bessastaðir eru frábær hugmynd og næturmyndirnar ykkar af upplýstum saunahúsum í snjó eru með þeim flottustu sem sjást hjá íslenskri verslun. Vefurinn sjálfur er hins vegar staðlað Shopify sniðmát, og þegar pottur upp á þrjár milljónir er settur fram eins og smávara þá endurspeglar upplifunin ekki gæðin.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Hún er hugsuð eins og sýningarsalur, byggð á ykkar eigin myndum og alvöru verðum af vefnum ykkar, og hún er teiknuð þannig að hún færist beint yfir í Shopify kerfið sem þið notið nú þegar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sem er að velta fyrir sér potti eða saunahúsi finni strax sömu gæðatilfinningu á vefnum og það fær hjá ykkur í versluninni, og að góðu dílarnir ykkar blasi við. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
