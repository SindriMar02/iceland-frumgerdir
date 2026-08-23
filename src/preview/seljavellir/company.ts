import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for seljavellir. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'seljavellir',
    route: '/preview/seljavellir',
    name: 'Guesthouse Seljavellir',
    sector: 'Guesthouse & farm dining',
    location: 'Seljavellir, Höfn í Hornafirði',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://seljavellir.com',
    ownerEmail: 'reynirasg@gmail.com',
    concept: 'Einn dagur á Seljavöllum',
    conceptTagline:
      'A full day at a working Hornafjörður farm guesthouse, from blue hour quiet to aurora over Vestrahorn, with the glacier view rooms and breakfast times a dead website could never show.',
    accent: '#E8A33D',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1759675739458-6e5a4a60a117?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Real, working farm guesthouse with mountain and glacier view rooms, 8 minutes from Höfn and 72 km from Jökulsárlón',
        'Strong reputation: 8.6 "Fabulous" on Booking.com from over 2,000 reviews, ranked #3 of 21 B&Bs/inns in Höfn on Tripadvisor',
        'Genuinely photogenic real assets: golden hour farmland panoramas, mountain view rooms, an active Facebook page with real guest photos',
      ],
      weaknesses: [
        'seljavellir.com returns a live 404 on both http and https, with an expired SSL certificate and a derelict 2015 WordPress install underneath',
        'Every booking runs through Booking.com, Expedia and Airbnb, so the guesthouse pays OTA commission on every reservation instead of taking direct bookings itself',
        'Public contact is a personal Gmail address, and two different phone and email sets are floating around online with no owned site to state the facts once, clearly',
      ],
      opportunities: [
        "Replace the dead domain with a photo led site that finally answers guests' practical questions on breakfast, check in and rooms in one place",
        'Add a direct booking path to start pulling reservations back from OTA commission',
        'Turn the real farm setting and glacier view rooms into the visual identity instead of leaving guests to piece it together from Booking.com',
      ],
    },
    positioning:
      'Guesthouse Seljavellir is a real, multi room family guesthouse on a working farm outside Höfn, eight minutes from town and seventy two kilometres from Jökulsárlón, with an 8.6 rating across more than two thousand Booking.com reviews. Its own domain has been a dead 404 for years since its old WordPress site lapsed, so every guest who searches for it lands on Booking.com or Expedia instead. The redesign gives the farm a real home online built around its own light, from blue hour to the aurora over Vestrahorn, with breakfast times, room rates and a direct booking path finally in one place.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Guesthouse Seljavellir',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Ég kynnti mér gistiheimilið ykkar á Seljavöllum og fannst staðurinn einstakur, alvöru sveitabær rétt við þjóðveginn með útsýni yfir fjöll og jökla, aðeins 72 kílómetra frá Jökulsárlóni. Vissuð þið að seljavellir.com skilar núna bara 404 villu? Hver einasti gestur sem gúglar ykkur endar því hjá Booking.com og borgar þeim þóknun sem ætti að vera ykkar.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að gestir sjái fjöllin, jöklana og bóndabæinn áður en þeir bóka, og geti pantað beint hjá ykkur í stað þess að fara alltaf í gegnum Booking.com. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
