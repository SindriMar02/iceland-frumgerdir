import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for eyjatours. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'eyjatours',
    route: '/preview/eyjatours',
    name: 'Eyjatours',
    sector: 'Puffin & volcano boat tours',
    location: 'Heimaey, Vestmannaeyjar',
    region: 'South',
    established: 'Est. ~2012',
    currentUrl: 'https://www.eyjatours.com',
    ownerEmail: 'eyjatours@eyjatours.is',
    concept: 'Puffins & Fire',
    conceptTagline:
      'A cinematic island world — the world’s great puffin colony, the volcano that nearly won in 1973, and one local guide.',
    accent: '#E5573E',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1612564148954-59545876eaa0?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Top-rated puffin and volcano tours, a charismatic local guide (Ebbi)',
        'A genuinely world-class story: a million puffins and the 1973 Eldfell eruption',
        'A short ferry from the mainland, in easy reach of the south-coast route',
      ],
      weaknesses: [
        'No real online booking, only a static "Book Now" link and email',
        'Duplicated navigation and a broken footer year, with no prices anywhere',
        'Low-resolution graphics and grunge overlays undercut a stunning subject',
      ],
      opportunities: [
        'A clean booking request flow (tour, date, guests, live price) on the page',
        'Let the puffins, the eruption and the archipelago carry the design',
        'One coherent brand built around their own puffin logo, fast on mobile',
      ],
    },
    positioning:
      'The number-one tour on one of the world’s great puffin islands, held back by a cluttered, booking-less site. The redesign turns the island’s story into an experience and makes booking with Ebbi effortless.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Eyjatours',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska ferðaþjónustu.

Ég kynnti mér Eyjatours og ferðirnar ykkar í Vestmannaeyjum og var virkilega hrifinn. Lundabyggðin, sagan af gosinu 1973 og þekkingin ykkar á eyjunni er nokkuð sem fáir geta boðið upp á. Þegar ég skoðaði vefsíðuna fannst mér hún samt ekki gera þessu nógu góð skil. Það er erfitt að bóka ferð beint, verð koma hvergi fram og útlitið er orðið svolítið gamaldags. Erlendir gestir sem vilja bóka strax gefast stundum upp og leita annað.

Mér fannst það synd, svo ég settist niður og gerði litla frumgerð að nýrri forsíðu, bara handa ykkur til að skoða. Þetta kostar ekki neitt og því fylgir engin skuldbinding.

Á henni er hægt að velja ferð, dagsetningu og fjölda og senda bókunarbeiðni í örfáum skrefum. Verð eru sýnileg, sagan af lundanum og gosinu er í forgrunni, það fylgir kort af eyjunum og síðan virkar vel í síma.

Hana má skoða hér hvenær sem er:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn, en ef ykkur líst vel á gæti ég klárað vefinn í heild. Ef ekki er það að sjálfsögðu allt í lagi og engin pressa. Mér þætti samt vænt um að heyra hvað ykkur finnst.

${SIGN}`,
    },
  }
