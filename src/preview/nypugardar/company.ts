import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for nypugardar. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'nypugardar',
    route: '/preview/nypugardar',
    name: 'Nýpugarðar',
    sector: 'Farm guesthouse & dinner buffet',
    location: 'Nýpugörðum, Mýrar, Hornafjörður',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'http://glacierview.is',
    ownerEmail: 'nypu@simnet.is',
    concept: 'Kvöldverðurinn á Mýrum',
    conceptTagline:
      'One evening at a working sheep farm between Höfn and the glacier lagoon, arriving on the land, watching the light fall on the ice, then sitting down to the lamb dinner buffet guests keep raving about.',
    accent: '#D97D3D',
    dark: true,
    status: 'In build',
    thumb: 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/10523864.jpg?k=2e21596f72fdae8178942f8e63817dfaa86ab9c4c383b883323636aad39aa600&o=',
    audit: {
      strengths: [
        '8.8/10 on Booking.com across roughly 2,200 reviews, with the lamb dinner buffet named again and again as the reason to stop',
        'A real working sheep farm with glacier and fjord views on the property, and 47 of their own photographs already shot',
        'A registered, active company (Nýpugarðar ehf) with no adverse history found',
      ],
      weaknesses: [
        'No website of their own at all, not even a weak one, just a Facebook page',
        'Every booking runs through third-party OTAs, Booking.com, Guide to Iceland and Expedia, with no direct contact path of their own',
        'Their only real presence, a Facebook page, shows no menu, photos or dinner buffet details to visitors',
      ],
      opportunities: [
        'Turn thousands of glowing reviews and an 8.8 rating into an actual bookable, discoverable website',
        'Let the lamb dinner buffet, the dining room and the glacier views carry the page instead of a bare Facebook post',
        'Move guests from OTA-only bookings toward a direct path that keeps more of every stay on the farm',
      ],
    },
    positioning:
      'Nýpugarðar is a working sheep farm between Höfn and Jökulsárlón, rated 8.8 on Booking.com across more than 2,200 reviews, with guests repeatedly singling out the farm dinner buffet and lamb as the highlight of their stay. They have no website of their own at all, and their only real presence is a sparse Facebook page, so every booking runs through a third-party OTA. The redesign gives the farm a real home online built around one evening there, arriving among the animals, watching the glacier catch the light, then sitting down to the dinner guests already cannot stop talking about.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Nýpugarða',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu og matvælaframleiðslu.

Ég kynnti mér Nýpugarða og sá að gestir hæla lambahlaðborðinu ykkar sérstaklega í umsögnum, enda eruð þið með 8,8 í einkunn á Booking.com eftir rúmlega 2.200 umsagnir. Samt er eina vefsvæðið ykkar í dag Facebook síða, og allar bókanir fara í gegnum Booking sem tekur þóknun af hverri þeirra.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að gestir upplifi kvöldið hjá ykkur áður en þeir mæta, sauðféð, jökulinn í kvöldsólinni og svo sjálft hlaðborðið, og geti bókað beint hjá ykkur í stað þess að fara í gegnum Booking. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
