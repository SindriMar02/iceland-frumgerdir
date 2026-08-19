import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for gkbakari. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // GK Bakarí — Selfoss, South Iceland. Founded late 2019 by two friends,
    // Guðmundur Helgi Harðarson (ex Brauð & Co, Reykjavík) and Kjartan Ásbjörnsson
    // (ex IKEA bakery), opened Jan 2020 in Kjartan's hometown. RestaurantGuru
    // 4.7/5 across 438 reviews, but NO website at all — only Facebook, Instagram
    // and third-party aggregators/Wolt delivery. Reuses the Faxi Bakery Café
    // design system verbatim (Faxi's own outreach went unanswered).
    slug: 'gkbakari',
    route: '/preview/gkbakari',
    name: 'GK Bakarí',
    sector: 'Bakarí & kaffihús',
    location: 'Selfoss, Suðurland',
    region: 'South',
    established: 'Est. 2019',
    currentUrl: 'https://www.facebook.com/gkbakari',
    ownerEmail: 'gkbakari@simnet.is',
    concept: 'Bakað af tveimur vinum',
    conceptTagline:
      'A neighborhood bakery brand built around its real story — two friends, real Selfoss ingredients, and the daily rhythm of who’s open right now.',
    accent: '#C2773A',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1686207855146-c3ffe2166d40?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Two real, named bakers (ex Brauð & Co, ex an IKEA bakery) running their own place since Jan 2020',
        '4.7★ on RestaurantGuru across 438 reviews — genuinely well-loved locally',
        'A real Wolt delivery menu with real prices, not just a social feed',
      ],
      weaknesses: [
        'No website at all — only Facebook, Instagram and third-party delivery/review aggregators',
        'Passing Golden Circle and Ring Road traffic has no way to discover them online',
        'Their own founding story is invisible outside word of mouth',
      ],
      opportunities: [
        'Build a real home for the brand from the ground up',
        'Surface real hours, menu and prices somewhere travelers and locals will actually find them',
        'Tell the founders’ story instead of leaving it to Facebook captions',
      ],
    },
    positioning:
      'A well-loved young bakery with a 4.7★ rating and zero web presence outside Facebook and delivery apps. Built from scratch, the brand turns the founders’ own story, real menu and daily open/closed rhythm into the reason to stop by.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir GK Bakarí',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk bakarí og kaffihús.

Ég rakst á GK Bakarí og varð hissa að sjá hvað þið standið ykkur vel, 4,7 í einkunn og fullt af frábærum umsögnum, en samt eruð þið hvergi að finna nema á Facebook, Instagram og í gegnum Wolt. Fólk sem er að leita að góðu bakaríi á Selfossi hefur því enga alvöru síðu til að skoða áður en það kemur við.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri vefsíðu fyrir ykkur. Hún segir söguna ykkar, tveggja vina sem opnuðu bakarí í heimabæ Kjartans, og sýnir matseðilinn og opnunartímann skýrt. Þið getið ekki bara skoðað hana heldur líka prófað hana sjálf, til dæmis notað pöntunarhnappinn sem fer beint inn á Wolt. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða og prófa hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
