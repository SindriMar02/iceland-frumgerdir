import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for svarfholl. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'svarfholl',
  route: '/preview/svarfholl',
  name: 'Svarfhóll',
  sector: 'Ferðaþjónusta í sveit',
  location: 'Svarfhóll, 371 Búðardalur',
  region: 'West',
  established: 'Gestgjafar á Airbnb í níu ár (Superhost)',
  currentUrl: 'https://www.airbnb.com/rooms/18693632',
  ownerEmail: 'svarfhollaccommodation@gmail.com',
  concept: 'Ljósin í dalnum',
  conceptTagline:
    'The family’s own camera roll keeps catching the sky: aurora over the lit chalet window, a rainbow on the home field, the midnight sun on the fells. The page is built around those lights, and everything else stays as quiet as the valley.',
  accent: '#A6403A',
  dark: false,
  status: 'Concept ready',
  thumb: '',
  ownPhotography: true,
  audit: {
    strengths: [
      'A 404-review guest record on the main listing with a flat-out excellent rating, and a Superhost badge held for nine years',
      'Three real listings (two chalets and the old farmhouse) with honest, warm photography of aurora, rainbows, horses and the wooden hot pot',
      'Contact details published on a real tourism-route page, and the Icelandic Tourist Board registry lists them as an accommodation provider',
    ],
    weaknesses: [
      'No website at all: svarfholl.is and svarfholl.com are both unregistered, and the Tourist Board registry points guests at the dead svarfholl.is',
      'The three listings are fragmented across Airbnb with no shared identity, so nine years of guests have nowhere direct to return to',
      'Every booking pays OTA fees, and repeat guests cannot book directly even when they ask',
    ],
    opportunities: [
      'One page that gathers the three listings under the farm’s own name, with request-to-book straight to the family',
      'Capture the repeat guests and word-of-mouth that a nine-year Superhost record generates',
      'Fix the dead registry link by finally owning svarfholl.is',
    ],
  },
  positioning:
    'Svarfhóll is a nine-year Superhost farm stay in Dalir with a 404-review guest record and no website: the official registry points at a domain that does not resolve. The redesign gathers the two chalets, the old farmhouse and the hot pot under one quiet page built from the family’s own sky photography, and routes requests straight to their kitchen table.',
  outreach: {
    subject: 'Hugmynd að vefsíðu fyrir Svarfhól',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska gististaði.

${SIGN}`,
  },
}
