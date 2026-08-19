import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for vinland. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // WHY: a genuinely well-reviewed riverside farm guesthouse (Tripadvisor 4.3/177,
    // Booking.com 8.1/659) with three real ways to stay (rooms, a cottage, camping
    // pods), but the current site gives visitors nothing — no real photos, no clear
    // way to see the rooms vs the cottage vs the pods separately. OPPORTUNITY: a calm,
    // photo-forward one-pager that finally shows the place, split cleanly by unit.
    // CUSTOMER: Ring Road self-drivers passing Egilsstaðir, East Iceland's hub town.
    slug: 'vinland',
    route: '/preview/vinland',
    name: 'Vínland Guesthouse',
    sector: 'Farm guesthouse & cottage',
    location: 'Fellabær, Egilsstaðir',
    region: 'East',
    established: 'Fjölskyldurekið frá 2018',
    currentUrl: 'https://vinlandguesthouse.is',
    ownerEmail: 'info@vinlandhotel.is',
    concept: 'The Crossing at Lagarfljót',
    conceptTagline:
      'A riverside farm guesthouse right off the Ring Road, told plainly through its three real ways to stay — rooms, a cottage, and camping pods — with an oversized wordmark as the one bold signature.',
    accent: '#B8431C',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://res.cloudinary.com/itb-database/image/upload/s--FQ0s_J7Q--/c_fill,dpr_auto,f_auto,q_auto:eco,w_1470/v1/ServiceProviders/ef7865232160a4a74bec5af6b384d49c',
    audit: {
      strengths: [
        'A genuinely well-reviewed riverside guesthouse right off the Ring Road (Tripadvisor 4.3/5 · 177 reviews, Booking.com 8.1/10 · 659 reviews)',
        'Three real ways to stay — six ensuite rooms, a private cottage, and camping pods — each with its own character',
        'Minutes from the Reindeer Park, Vök Baths and Hallormsstaður Forest, with free airport transfer',
      ],
      weaknesses: [
        'No real photos of the property reach visitors before they book elsewhere',
        'Rooms, the cottage and the camping pods are never shown or explained separately',
        'Nothing on the current site makes the riverside setting or nearby sights the reason to stop',
      ],
      opportunities: [
        'A clean, secure one-page home built around real photography',
        'Give the rooms, the cottage and the pods their own honest presentation and specs',
        'Make the crossing at Lagarfljót and what surrounds it the reason travellers choose to stay',
      ],
    },
    positioning:
      'A well-reviewed riverside guesthouse with three genuinely different ways to stay is being let down by a site that shows none of it. Let the crossing at Lagarfljót, the rooms, the cottage and the pods each tell their own honest story.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Vínland Guesthouse',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu og gistingu.

Ég rakst á Vínland þegar ég var að skoða gistingu rétt hjá Egilsstöðum og sá að þið eruð með virkilega góða dóma, bæði á Tripadvisor og Booking.com. Það kom mér því á óvart hvað núverandi vefsíða sýnir lítið af staðnum sjálfum. Hvergi sést hvernig herbergin líta út, hvað kofinn hefur upp á að bjóða eða hvernig tjaldskálarnir eru frábrugðnir hvort öðru.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu þar sem hver gistimöguleiki, herbergin, kofinn og skálarnir, fær sína eigin kynningu. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að ferðafólk sjái strax hvað þið bjóðið og velji Vínland með sjálfstrausti, í stað þess að halda áfram að leita. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
