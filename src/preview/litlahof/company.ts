import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for litlahof. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'litlahof',
    route: '/preview/litlahof',
    name: 'Litla-Hof',
    sector: 'Farm guesthouse',
    location: 'Hof í Öræfum, near Skaftafell',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.facebook.com/p/Litla-Hof-Guesthouse-100070911662749/',
    ownPhotography: true,
    ownerEmail: 'litlahof@simnet.is',
    concept: 'Hjá torfkirkjunni',
    conceptTagline:
      'The same slow drive up to a small horse and sheep farm beside Iceland’s youngest turf church, under the shadow of Öræfajökull, that five star guests already describe in their reviews, told properly for the first time.',
    accent: '#8B3A2B',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/316584266.jpg?k=63cca7a1c701066d6ee93caeee99a35f25b31682705f65747bbdc50d630ec39d&o=',
    audit: {
      strengths: [
        '5 out of 5 on Tripadvisor, ranked #2 of 3 B&Bs in Hof, with guests calling the stay the favourite of their whole trip',
        'A genuinely rare setting, a working horse and sheep farm beside Iceland’s youngest turf church, in the shadow of Öræfajökull',
        'A registered, active company (Litla Hof ehf) with no adverse history found, and a confirmed horse breeding line carrying the farm’s name',
      ],
      weaknesses: [
        'No owned website at all, entirely dependent on OTA middlemen, Booking.com, Agoda and heyiceland, for discovery and booking',
        'Only contact path is a dated simnet.is email address and a phone number, no booking form of any kind',
        'Nothing online conveys the working farm, the turf church next door or the mountain setting that guests keep mentioning',
      ],
      opportunities: [
        'Turn a 5-star, "favourite of the trip" guesthouse into one that finally has its own home online',
        'Tell the story no OTA listing tells, the turf church, the horse breeding line, the farm under Iceland’s highest peak',
        'Add a direct booking path that keeps the margin OTAs currently take on every stay',
      ],
    },
    positioning:
      'Litla-Hof is a small working horse and sheep farm beside one of Iceland’s last turf churches, in the shadow of Öræfajökull, rated 5 out of 5 on Tripadvisor with guests calling it the favourite stop of their whole trip. It has no website of its own, only OTA listings and a thin Facebook page, and a dated simnet.is email address is the only way to reach them directly. The redesign turns the slow drive up to the farm that guests already describe in their reviews into a real page, the turf church, the horses, the mountain, and one clear way to book a stay.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Litla-Hof',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Ég kynnti mér Litla-Hof og sá að gestir gefa ykkur 5 stjörnur á Tripadvisor og kalla dvölina hápunkt ferðarinnar. Samt finnst Litla-Hof hvergi á netinu nema á bókunarsíðum annarra, því þið eigið enga eigin vefsíðu.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái sömu rólegu leiðina heim að bænum sem gestir lýsa í umsögnum sínum, torfkirkjuna, hestana og fjallið, og geti spurst fyrir um gistingu beint hjá ykkur. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
