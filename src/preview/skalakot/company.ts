import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for skalakot. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'skalakot',
  route: '/preview/skalakot',
  name: 'Skálakot Manor Hotel',
  sector: 'Sveitahótel & hrossabú',
  location: 'Skálakoti, 861 Hvolsvöllur',
  region: 'South',
  established: 'Fjölskyldujörð í sjö kynslóðir, Mummi og Jóhanna tóku við 1985',
  currentUrl: 'https://skalakot.is',
  ownerEmail: 'info@skalakot.is',
  concept: 'Sjöunda kynslóðin',
  conceptTagline:
    'The seventh generation on one farm is the signature: a horizontal manor-and-horses journey where the family story, the rooms and the spa travel past under a sky that shifts from dawn to dusk. Exact reuse of the Búðir system (see budir-design-system) on Skálakot’s own material.',
  accent: '#A8802F',
  dark: false,
  status: 'Concept ready',
  thumb: 'https://skalakot.is/wp-content/uploads/2026/01/Wedding-couples-skalakot-6.jpg',
  photoCredit: 'Allar myndir eru af vef hótelsins sjálfs (skalakot.is), þeirra eigin myndatökur.',
  audit: {
    strengths: [
      'A genuinely rare asset: a seventh-generation family farm with a boutique manor hotel, homebred Icelandic horses, a spa and fine dining, told in the family’s own words on their site',
      'Strong live reputation: TripAdvisor #1 of 26 in Hvolsvöllur (4/5, 123 reviews), Booking.com 9.3/300 reviews, guests staying as recently as June 2026',
      'Professional photography exists at up to 4720px on their own CDN, including a full 2026 wedding shoot',
    ],
    weaknesses: [
      'WordPress + Elementor on the dated free Septera theme: 2019-era uploads, "Best of Iceland 2019" badges still up, duplicated nav markup and a malformed menu URL',
      'No prices anywhere, booking punted to an external godo.is engine, images served at 455-1024px though larger originals exist, no alt text',
      'The seven-generations story, their single best asset, is buried on a text-thin family-farm page; only 3 room interiors shown for 14 rooms',
    ],
    opportunities: [
      'Make the seventh generation the whole story: a scroll-told family timeline instead of a buried paragraph',
      'Serve their own photography at full size and give the manor, horses and spa real editorial scale',
      'Honest room categories with every path leading to their own booking engine',
    ],
  },
  positioning:
    'Skálakot is a seventh-generation family farm under the mountains of South Iceland that has grown into a manor hotel with homebred horses, a spa and a fine-dining restaurant. All of that is trapped in a dated free WordPress theme with 2019 badges, small photos and no story. The redesign reuses the proven Búðir system: a pinned horizontal journey through the farm, mix-blend headings over their own photography, and the family timeline (seven generations, 1985, today) as the signature moment, with every path leading to their own booking engine.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Skálakot',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk hótel og ferðaþjónustu.

Ég kynnti mér Skálakot og heillaðist af sögunni ykkar. Sjö kynslóðir á sömu jörð, hrossaræktin og gestrisnin sem þið byggið á. Mér fannst vefurinn ykkar samt ekki ná að segja þessa sögu. Hún er falin í stuttri málsgrein, myndirnar ykkar birtast litlar þótt til séu miklu stærri útgáfur af þeim, og verð sjást hvergi.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að sagan um kynslóðirnar sjö sé hjarta vefsins, að myndirnar ykkar fái að njóta sín í fullri stærð og að allar leiðir liggi í bókunarkerfið ykkar. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
  },
}
