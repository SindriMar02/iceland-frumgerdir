import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for kidka. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'kidka',
    route: '/preview/kidka',
    name: 'KIDKA Wool Factory',
    sector: 'Ullarverksmiðja & verslun',
    location: 'Höfðabraut 34, 530 Hvammstangi',
    region: 'Norðurland vestra',
    established: 'Fjölskyldurekin frá 2008',
    currentUrl: 'https://kidka.com',
    ownerEmail: 'kidka@kidka.com',
    concept: 'Beint af prjónavélinni',
    conceptTagline:
      'Factory transparency as the brand: you can watch the machines knit through the shop windows, so the page opens with a knit-row hero reveal, a care-label mono voice, their real products at real prices, and their own model photography that the current site breaks with placeholder images.',
    accent: '#8F3F1E',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://kidka.com/wp-content/uploads/2025/04/CE3I3377-web-e1760354324225.jpg',
    photoCredit:
      'Allar ljósmyndir og vöruheiti eru eign KIDKA og koma af kidka.com; verð eru eins og þau birtust þar 23. júlí 2026.',
    audit: {
      strengths: [
        'Professional model photography already exists in their own media library, shot outdoors with Icelandic horses, uploaded as recently as July 2026',
        'Real, rare story: one of the biggest knitting factories in Iceland, 100% Icelandic wool processed start to finish on site, viewing windows onto the machines from the shop floor',
        'Working WooCommerce shop with worldwide shipping, named products and EUR prices, plus ~10K Instagram followers',
      ],
      weaknesses: [
        'The homepage and category pages break their own photography with grey SVG placeholder images, so the shop looks half dead although it is fully stocked',
        'Standard page paths (/about, /contact, /products) return 404, and the layout is a dated Elementor template with no mobile-first thinking',
        'The hero is static text with no story, although the factory has the single most tellable story in the sector: watch it being made',
      ],
      opportunities: [
        'Let their own photography lead: the orange-beanie-among-horses shot is a hero image most brands would pay a campaign for',
        'Turn factory transparency into the brand: from fleece to shop floor, knitted where you can watch',
        'Surface the 2026 puffin edition and the horse line, two ranges no competitor tourist shop carries',
      ],
    },
    positioning:
      'A real working wool factory with fashion-grade photography and a genuinely unique transparency story, trapped in a broken template that displays placeholders instead of products. The redesign lets their own assets and their own facts sell: real products at real prices, the process behind the viewing windows, and the shop five minutes off Route 1.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir KIDKA',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég skoðaði kidka.com og sá tvennt. Annars vegar eigið þið frábærar ljósmyndir, prjónles ykkar myndað úti í íslenskri náttúru með hestum, og einstaka sögu, ull unnin frá grunni á staðnum þar sem gestir geta horft á vélarnar prjóna í gegnum gluggana. Hins vegar sýnir vefurinn sjálfur gráa kassa í stað margra þessara mynda og nokkrar undirsíður skila villu.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Hún notar ykkar eigin myndir, ykkar eigin vöruheiti og verð eins og þau birtast á kidka.com í dag. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

${SIGN}`,
    },
  }
