import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for budir. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'budir',
    route: '/preview/budir',
    name: 'Hótel Búðir',
    sector: 'Sveitahótel & veitingastaður',
    location: 'Búðum, 356 Snæfellsbær',
    region: 'West',
    established: 'Verslunarstaður frá 17. öld, gistirekstur frá miðri 20. öld',
    currentUrl: 'https://www.hotelbudir.is',
    ownerEmail: 'budir@budir.is',
    concept: 'Svarti punkturinn',
    conceptTagline:
      'The lone black church and the cream hotel are the only fixed points in a landscape that never repeats, so the page fixes colossal editorial type on the horizon and lets the world scrub past it, built entirely from the hotel\u2019s own professional shoot.',
    accent: '#8A8455',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.squarespace-cdn.com/content/v1/667c1a62d2f7af7f810e49f4/ffe3883b-5f23-4b52-863c-bc78dd8c514b/B_23106.jpg?format=1000w',
    ownPhotography: true,
    audit: {
      strengths: [
        'One of the most photographed spots in Iceland, the lone hotel and the black church at Búðir, with a real professional interior and food shoot already on their own site',
        'A genuine premium operation, four room categories across two wings, a respected restaurant sourcing from Snæfellsnes neighbours, and their own direct booking engine',
        'A real 17th-century story on their own history page, trading post, shipwreck-era landings at Búðaós, and the 1945 rescue of a condemned house for 6.000 kr',
      ],
      weaknesses: [
        'A generic Squarespace template that tells none of that story visually, the same layout as thousands of sites, with the gallery reduced to 213px thumbnails',
        'Photography uploaded at 1080px maximum even though the shoot is clearly professional, so their best asset is served at a fraction of its quality',
        'Navigation mixes Icelandic and untranslated English items, and a booking link on the homepage still carries a hardcoded date parameter from November 2016',
      ],
      opportunities: [
        'Give the most photogenic hotel in the country a site with actual art direction, type and choreography that match the property\u2019s own standard',
        'Tell the 17th-century to 1945 to today story as a designed thread instead of a wall of text',
        'Fix the booking path presentation and lead every page toward their own direct engine',
      ],
    },
    positioning:
      'Hótel Búðir is arguably the most photogenic hotel in Iceland, a cream country hotel beside the famous black church, alone in a lava field between a golden beach and Snæfellsjökull, with a professional photo shoot, a respected restaurant and a real 17th-century story already published on its own site. All of it is trapped in a generic Squarespace template with 213px gallery thumbnails and a stale 2016 booking link. The redesign fixes colossal editorial type on the horizon like the church itself, black and immovable, and lets the hotel\u2019s own photography and story move past it.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Hótel Búðir',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk hótel og ferðaþjónustu.

Ég kynnti mér Hótel Búðir og sá að þið sitjið á einstökum efnivið, atvinnuljósmyndum af húsinu, herbergjunum og matnum, sögu sem nær aftur á 17. öld og einum eftirsóttasta brúðkaupsstað landsins. Núverandi vefur kemur þessu samt ekki til skila, hann er byggður á stöðluðu sniðmáti, myndasafnið birtist sem litlar smámyndir og einn bókunarhlekkur á forsíðunni ber enn dagsetningu frá 2016.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að vefurinn standist samanburð við staðinn sjálfan, myndirnar ykkar fái að njóta sín í fullri stærð og allar leiðir liggi í ykkar eigið bókunarkerfi. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
