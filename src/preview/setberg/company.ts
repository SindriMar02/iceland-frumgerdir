import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for setberg. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'setberg',
    route: '/preview/setberg',
    name: 'Setberg Guesthouse',
    sector: 'Farm guesthouse',
    location: 'Setbergi, Nesjum, 781 Höfn í Hornafirði',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.booking.com/hotel/is/setberg-guesthouse.html',
    noOwnSite: true,
    ownerEmail: 'setberg1@gmail.com',
    concept: 'Bærinn undir fjallinu',
    conceptTagline:
      'A 9.4-rated farm guesthouse under the East Iceland mountains, finally getting to introduce itself in its own voice instead of being spoken for by booking agents every time someone searches its name.',
    accent: '#C97B45',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1581094987116-97a1b02c36d4?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '9.4/10 on Booking.com across 280 verified reviews, with cleanliness, comfort and staff all scoring 9.8',
        'A genuinely distinctive setting, a former sheep farm at the foot of the mountains near Höfn, run by host Stefán',
        'A registered, active company (Setberg 1 ehf) with no bankruptcy or closure history found',
      ],
      weaknesses: [
        'No real homepage of their own, only a generic third-party booking-widget microsite and OTA listings speak for them',
        'Completely dependent on OTA commission, Booking.com, Airbnb, Expedia and Hotels.com all list the property with no direct-booking channel',
        'Only public contact is a personal Gmail address, not a business email tied to any domain',
      ],
      opportunities: [
        'Give the farm its first real chance to speak for itself online, instead of being described secondhand by booking agents',
        'Capture direct bookings currently lost entirely to OTA commission',
        'Own the search results for a Höfn farm guesthouse, a term every top result today sends to a third party',
      ],
    },
    positioning:
      'Setberg is a 9.4-rated farm guesthouse at the foot of the mountains near Höfn, with 280 reviews praising its cleanliness, comfort and staff, yet it has no real homepage speaking in its own voice, only a generic booking-widget microsite and OTA listings. Every search result today leads to a booking agent speaking on the farm’s behalf, and every stay pays a commission to a third party. The redesign gives Setberg its first real home online, a quiet, honest introduction in the farm’s own voice, with a direct path to book a room without the middleman.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Setberg',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Ég kynnti mér Setberg og sá að þið eruð með 9,4 í einkunn á Booking.com eftir 279 umsagnir, sem er frábær árangur. Samt á Setberg enga heimasíðu sem talar í eigin röddu, aðeins bókunarsíður sem tala fyrir ykkar hönd og taka þóknun af hverri bókun.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að Setberg fái loksins að kynna sig sjálft, í eigin röddu, í stað þess að bókunarsíður tali fyrir ykkur, og að gestir geti bókað beint hjá ykkur. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
