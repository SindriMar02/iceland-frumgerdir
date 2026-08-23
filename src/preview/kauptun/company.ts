import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for kauptun. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'kauptun',
    route: '/preview/kauptun',
    name: 'Kauptún',
    sector: 'Grocery & general store',
    location: 'Hafnarbyggð 4, 690 Vopnafjörður',
    region: 'East',
    established: 'Síðan 1988',
    currentUrl: 'https://www.facebook.com/Kauptun/',
    noOwnSite: true,
    currentLabel: 'Það er aðeins með Facebook-síðu',
    photoCredit:
      'Ljósmyndir eru fréttamyndir af versluninni og eigendum, myndir af Vopnafirði af Wikimedia Commons, og tvær sýnishornsmyndir frá Unsplash.',
    ownerEmail: 'kauptun@kauptun.net',
    concept: 'Hjartað í þorpinu',
    conceptTagline:
      'The one shop holding a 650-person fjord village together gets a real front door online, hours, fresh bakery and the everything’s-here feeling of walking through its actual doors, replacing a domain that has never resolved.',
    accent: '#B8432A',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://austurfrett.is/images/allar_frettir/frettir/kaupt%C3%BAn.jpg',
    audit: {
      strengths: [
        'The town’s only grocery store for around 650 residents in Vopnafjörður, confirmed active with current hours on the municipality’s own services page',
        'A real rescue story, new owners Berghildur Fanney Oddsson Hauksdóttir and Eyjólfur Sigurðsson bought the store in 2020 to keep it open, backed by a 5.2 million ISK rural-store grant in 2021',
        'Listed as an active Landsbankinn Aukakrónur rewards partner and confirmed active in both company registries, with no bankruptcy or closure history found',
      ],
      weaknesses: [
        'No website exists at all, kauptun.net does not even resolve, it is only used as an email suffix',
        'The only public digital footprint is directory listings on já.is and 1819.is, showing phone and fax as the most current contact channels',
        'Instagram has a single post and 15 followers since the account was created, with no way anywhere to see hours, products or the bakery',
      ],
      opportunities: [
        'Give the town’s only grocery store its first real front door online, hours, the in-house bakery, and how to reach it',
        'Tell the 2020 rescue story honestly, a store that has to exist because the alternative is a 150 km drive for milk',
        'Replace directory listings and a dormant Instagram with one warm, photo-led page for both locals and visitors passing through',
      ],
    },
    positioning:
      'Kauptún is the only grocery store serving roughly 650 residents in Vopnafjörður, in continuous operation since 1988 and kept open by a 2020 ownership rescue and a 2021 rural-store grant. The business has no website at all, kauptun.net does not even resolve, and its entire public footprint is a handful of directory listings and a nearly dormant Instagram account. The redesign gives the village’s one essential shop a real digital front door, hours, the in-house bakery, and the everything’s-here feeling of walking through its actual doors.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Kauptún',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenskar verslanir og fyrirtæki á landsbyggðinni.

Ég kynnti mér Kauptún og sá að þið eruð verslunin sem heldur Vopnafirði gangandi, eina búðin í þorpinu. Samt finnst nánast ekkert um ykkur á netinu, hvorki opnunartími, bakkelsið né hvað er til hverju sinni, aðeins gamlar skráningar í símaskrá.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að hver sem er, hvort sem hann býr á Vopnafirði eða er á leiðinni þangað, sjái strax hvort opið sé og hvað er í búðinni. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
