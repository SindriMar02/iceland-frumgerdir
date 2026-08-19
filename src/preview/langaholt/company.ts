import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for langaholt. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'langaholt',
    route: '/preview/langaholt',
    name: 'Hotel Langaholt',
    sector: 'Countryside hotel & restaurant',
    location: 'Ytri-Görðum, Staðarsveit, Snæfellsnes',
    region: 'West',
    established: 'Frá 1978',
    currentUrl: 'https://langaholt.is',
    ownerEmail: 'langaholt@langaholt.is',
    concept: 'Sjóndeildarhringurinn',
    conceptTagline:
      "A single unbroken Snæfellsnes horizon line runs the whole page, sky carrying the family's story since 1978 while the shore below carries real rooms, the daily catch and a nine hole links course.",
    accent: '#C9A468',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://langaholt.is/wp-content/uploads/2019/01/Velkomion-1024x768.jpg',
    audit: {
      strengths: [
        '48 year family run hotel, roughly 40 en suite rooms plus a 60 seat restaurant, bar and two lounges, ranked #1 hotel in Snæfellsbær on Tripadvisor',
        'A genuine coastal setting with its own 9 hole links golf course built in 1997, a five minute walk to the beach and real seal watching nearby at Ytri Tunga',
        'Kitchen sources fish straight from local Snæfellsnes fishermen, so the restaurant already has a strong, true story to tell',
      ],
      weaknesses: [
        'langaholt.is still shows the footer copyright frozen at 2019, seven years out of date',
        "Room and testimonial photos are broken, showing gray placeholder boxes instead of the hotel's own rooms",
        'Booking is pushed entirely off the domain to a third party godo.is widget, so the hotel has no native booking flow of its own',
      ],
      opportunities: [
        "Replace the broken photo boxes with the hotel's real, already photographed rooms and let guests actually see what they are booking",
        "Bring booking back onto the hotel's own site instead of handing every guest off to a separate widget",
        'Tell the real 48 year family story and the golf course and restaurant sourcing, assets almost no competitor in the area has',
      ],
    },
    positioning:
      "Hotel Langaholt is a genuine, 48 year old family run hotel on the Snæfellsnes coast, with roughly 40 en suite rooms, a 60 seat restaurant sourcing fish from local fishermen, and its own 9 hole links golf course, already rated the best hotel in Snæfellsbær. Its website has been frozen since 2019, with broken placeholder images where real room photos should be and booking pushed entirely off the domain to a third party widget. The redesign turns the coastline itself into the site's spine, an unbroken horizon line carrying the family's story above and the real rooms, kitchen and golf course below.",
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Hótel Langaholt',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Ég kynnti mér Hótel Langaholt og fannst frábært að þið hafið rekið staðinn í næstum fimmtíu ár, með eigin golfvelli og eldhúsi sem kaupir fiskinn beint af sjómönnum á Snæfellsnesi. Á langaholt.is stendur enn © 2019 og herbergin á besta hóteli Snæfellsbæjar birtast sem gráir kassar, á meðan Booking tekur þóknun af hverri einustu bókun.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að gestir sjái alvöru herbergin, ströndina og golfvöllinn áður en þeir bóka, og að fleiri bóki beint hjá ykkur í stað þess að borga Booking þóknun af hverri nóttu. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
