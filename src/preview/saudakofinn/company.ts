import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for saudakofinn. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'saudakofinn',
    route: '/preview/saudakofinn',
    name: 'Sauðakofinn á Fossnesi',
    sector: 'Smokehouse & farm tourism',
    location: 'Fossnes, 804 Selfoss',
    region: 'South',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.fossnes.is/saudakofinn/',
    ownerEmail: 'sigrunfossnes@gmail.com',
    concept: 'Reykurinn í kofanum',
    conceptTagline:
      'The old smoke shed and its slow, twice-smoked ritual set the whole page’s rhythm, opening on the meat and its price list within the first screen before the farm’s other real chapters, the guesthouse, the horses, the river, clear into view underneath.',
    accent: '#A8481A',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://www.fossnes.is/wp-content/uploads/2013/02/Haust-2012-252.jpg',
    audit: {
      strengths: [
        'A genuinely rare product, tvíreykt sauðakjöt (double-smoked wether meat), actively priced and updated for autumn 2025',
        'A diversified real farm business, smokehouse, guesthouse, horses and fishing, all run from the same family farm',
        'A registered member of the Icelandic Sheep Farmers Association (SSFM) with a confirmed kennitala and no adverse history',
      ],
      weaknesses: [
        'The site is an early-2000s WordPress template, with the newest photos on the page still dated 2013',
        'No online ordering of any kind, meat, guesthouse stays and fishing trips are all phone or email only',
        'The whole multi-part farm business is spread across thin, sparsely written sub-pages with no mobile-friendly layout',
      ],
      opportunities: [
        'Let the rare double-smoked product and its price list be seen clearly on a phone, not buried in a 2000s-era layout',
        'Surface the farm’s other real assets, the guesthouse, the horses, the fishing, as one cohesive rural brand',
        'Replace phone-and-email-only ordering with a simple way to see what is available and ask to buy or book',
      ],
    },
    positioning:
      'Sauðakofinn is a small family farm at Fossnes producing tvíreykt sauðakjöt, a rare double-smoked wether meat, alongside a guesthouse, horses and fishing, all confirmed still active with autumn 2025 pricing. Their entire online presence is a handful of thin pages on an early-2000s WordPress template, with no online ordering and photos dating back to 2013. The redesign puts the smoking ritual and the meat itself in the first screen, then slowly reveals the farm’s other chapters underneath, the same way real smoke clears to show what is there.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Sauðakofann á Fossnesi',
      body: `Góðan dag Sigrún,

Ég heiti Sindri og hanna vefsíður fyrir íslensk matvælafyrirtæki og ferðaþjónustu.

Ég kynnti mér Sauðakofann og sá að tvíreykta sauðahangikjötið ykkar á sér fastan aðdáendahóp. Samt er vefsíðan ykkar í dag gömul sniðmátssíða þar sem nýjustu myndirnar sem ég finn eru frá 2013, og erfitt er að sjá vörurnar, verðin og hvernig maður pantar.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að kjötið og verðskráin sjáist strax, og að hitt sem þið gerið á Fossnesi, gistingin, hestarnir og veiðin, fái sinn stað á sömu síðu. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
