import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for sireksstadir. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'sireksstadir',
    route: '/preview/sireksstadir',
    name: 'Síreksstaðir',
    sector: 'Farm-stay & cottages',
    location: 'Vopnafjörður, East Iceland',
    region: 'East',
    established: 'Fjölskyldubú',
    currentUrl: 'https://sireksstadir.is',
    ownerEmail: 'sirek@sireksstadir.is',
    concept: 'Stillness in Sunnudalur',
    conceptTagline: 'Arrival into stillness — the glen as interface, honest prices, and a request to stay that reads like a note to the family.',
    accent: '#A6593C',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1765871319901-0aaafe3f1a2a?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A genuinely remote, quiet East-Iceland farm-stay with its own restaurant',
        'Booking.com 8.3 with standout staff scores',
        'Real, repeat guests who rely on online discovery',
      ],
      weaknesses: [
        'A broken hero carousel with overlapping, unreadable slides',
        'The cottages page has no photos and two identical, copy-pasted descriptions',
        'No prices anywhere and no real booking path',
      ],
      opportunities: [
        'Replace the broken carousel with one calm, oriented arrival',
        'Give each cottage real photos, distinct copy and a clear price',
        'Add a simple request-to-book that carries the chosen unit through',
      ],
    },
    positioning:
      'A calm, remote farm-stay is being sold by a broken carousel and a photo-less cottages page. Let the glen’s stillness be the design and make staying effortless.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Síreksstaði',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu og gistingu.

Mér líst virkilega vel á staðinn ykkar inn af Sunnudal og þá kyrrð sem þið bjóðið gestum. Það eina sem ég staldraði við var vefsíðan, því forsíðan birtist brotin, myndir af sumarhúsunum vantar og hvergi er hægt að sjá verð eða bóka.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu þar sem kyrrðin í dalnum fær að ráða, hvert hús fær sínar eigin myndir og verð, og einföld bókunarbeiðni kemur í stað brotinnar síðu. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn, en ef ykkur líst vel á gæti ég klárað vefinn í heild.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
