import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for hespa. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // WHY: botanist/natural-dyer making plant-dyed Icelandic wool; thin WP site
    // that pushes sales out to Etsy. OPPORTUNITY: a colour-led brand where the
    // palette IS the natural dyes, plus a proper webshop. CUSTOMER: knitters and
    // craft buyers (incl. abroad) and visitors to the studio.
    slug: 'hespa',
    route: '/preview/hespa',
    name: 'Hespa',
    sector: 'Plant-dyed Icelandic wool',
    location: 'Ölfus, South Iceland',
    region: 'South',
    established: 'Jurtalituð íslensk ull',
    currentUrl: 'https://hespa.is',
    ownerEmail: 'hespa@hespa.is',
    concept: 'Litir landsins',
    conceptTagline: 'Plant-dyed Icelandic wool — the palette comes from the land itself.',
    accent: '#a8492c',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1777929746858-45bbe0134e88?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A named maker with real authority (botanist and natural dyer)',
        'A beautiful, photogenic product — yarn dyed with Icelandic plants',
        'An open studio and a following among knitters at home and abroad',
      ],
      weaknesses: [
        'Thin WordPress site; the rich craft story is barely told',
        'Sales pushed out to an external Etsy shop — no real on-site webshop',
        'The colours, the heart of the brand, are not given centre stage',
      ],
      opportunities: [
        'Build the brand around the natural-dye colour palette itself',
        'A proper Icelandic webshop so buying does not leave the site',
        'Tell the dyeing story and invite visitors to the studio',
      ],
    },
    positioning:
      'Icelandic wool whose colours come straight from the land — a maker’s brand, not a marketplace listing. The site should sell the colour and the craft and keep the sale on-site.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Hespu',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki og handverksfólk.

Jurtalitaða ullin ykkar er einstaklega falleg og litirnir úr íslenskri náttúru eru saga út af fyrir sig. Mér fannst núverandi vefsíða ekki gera þeim nógu hátt undir höfði, og það er synd að salan fari fram annars staðar en á ykkar eigin síðu.

Ég settist því niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að byggja útlitið í kringum litina sjálfa, segja söguna á bak við litunina og gera fólki auðvelt að versla beint hjá ykkur. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur innblástur.

${SIGN}`,
    },
  }
