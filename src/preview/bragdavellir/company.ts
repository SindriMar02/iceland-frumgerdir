import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for bragdavellir. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'bragdavellir',
  route: '/preview/bragdavellir',
  name: 'Bragðavellir',
  sector: 'Sumarhús & bistró',
  location: 'Bragðavellir, 765 Djúpivogur',
  region: 'East',
  established: 'Sveitabýli við Hamarsfjörð, Hlaðan opin á sumrin',
  currentUrl: 'https://bragdavellir.is',
  ownerEmail: 'info@bragdavellir.is',
  concept: 'Milli fjalls og fjöru',
  conceptTagline:
    'The farm sits in the thin band between Búlandstindur above and the shoreline below, so the page is a full-bleed nature-retreat editorial with one honest cottage chooser at its centre: three real house types that swap specs and photography in place, instead of a PDF and an external redirect.',
  accent: '#9A6B2F',
  dark: false,
  status: 'Concept ready',
  thumb: 'https://images.unsplash.com/photo-1699556589435-32c3a4a94366?q=80&w=1200&auto=format&fit=crop',
  photoCredit:
    'Myndir af húsunum, Hlöðunni og umhverfinu eru af vef býlisins sjálfs. Tvær stórar landslagsmyndir eru af Unsplash.',
  audit: {
    strengths: [
      'A genuinely beautiful setting: a working farm on Hamarsfjörður with Búlandstindur above, the shoreline walkable from the cottage deck and Snædalsfoss about twenty minutes away',
      'Three real cottage types (26 m², 36 m², 60 m²) rented year-round, plus Hlaðan, a summer bistro in a renovated old cowshed with published hours and a seasonal menu',
      'Close to the Ring Road and Djúpivogur, with Papey and the Eggs of Merry Bay nearby, and their own booking engine already in place',
    ],
    weaknesses: [
      'The site is frozen in 2019: nearly every image and asset sits under wp-content/uploads/2019, in a dated WordPress brochure theme that has not been refreshed in about seven years',
      'Key content is trapped in downloadable PDFs (the menu, a 2019 what-to-do brochure) instead of being on-page, which is poor on mobile and invisible to search',
      'No pricing or cottage detail on-page, so every booking intent is punted straight to an external engine, and the landscape that is the actual product is shown only as small gallery thumbnails',
    ],
    opportunities: [
      'Give the setting cinematic scale and let the mountain-and-shore story carry the page',
      'Put the three cottage types on-page with real specs so guests can choose before they are handed to the booking engine',
      'Bring the barn-to-bistro story and its hours out of a PDF and into the page, with the season stated honestly',
    ],
  },
  positioning:
    'Bragðavellir is a farm on the edge of Hamarsfjörður with a pyramid mountain above it, a shoreline below it and an old cowshed reborn as a summer bistro. It is honestly simple, cosy and nature-first, not luxury, and that is its appeal. The current site is a 2019 WordPress brochure that hides the landscape in thumbnails and the menu in a PDF. The redesign gives the setting full-bleed scale and puts an honest cottage chooser at the centre, with the season and the booking path stated plainly.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Bragðavelli',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska ferðaþjónustu og gistingu.

Ég kynnti mér Bragðavelli og fannst staðurinn sjálfur vera það sem selur. Fjörðurinn, Búlandstindur fyrir ofan, fjaran niður af pallinum, Snædalsfoss í tuttugu mínútna göngufæri og gamla fjósið sem er orðið að bistró á sumrin.

Á vefnum í dag sést þetta illa. Nánast allar myndirnar eru frá 2019 og eru bornar fram litlar, matseðillinn er falinn í PDF skjali sem opnast illa í síma, og hvergi eru upplýsingar um húsin sjálf fyrr en fólk er komið yfir í bókunarkerfið.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Landslagið fær að fylla skjáinn, staðirnir í kring fá hver sína mynd, og húsin þrjú má bera saman með stærð og fjölda rúma áður en bókað er. Hlaðan fær sinn eigin kafla með opnunartímum og árstíðinni sagt hreint út. Vatnið í forsíðumyndinni bærist meira að segja hægt, eins og á kyrrum degi.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
  },
}
