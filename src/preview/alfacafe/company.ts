import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for alfacafe. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'alfacafe',
    route: '/preview/alfacafe',
    name: 'Álfacafé',
    sector: 'Seasonal café',
    location: 'Bakkagerði, Borgarfjörður eystri',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.facebook.com/alfacafe/',
    ownerEmail: 'alfacafe@simnet.is',
    concept: 'Á mörkum heima',
    conceptTagline:
      "A seasonal café standing at the literal threshold between the village of Bakkagerði and Álfaborg, home of Iceland's elf queen, finally telling visitors in one glance whether the door is open today.",
    accent: '#C97A2E',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://img02.restaurantguru.com/cefc-ALFACAFE-Borgarfjor-ur-Eystri-dishes.jpg',
    audit: {
      strengths: [
        'A beloved, top rated destination: 4.8 out of 5 from 422 Google reviews, ranked #1 restaurant in Borgarfjörður eystri',
        "A genuinely distinctive setting, right beside Álfaborg, the hill of Icelandic elf folklore, and a short drive from the Hafnarhólmi puffin colony",
        'A real signature dish, the fish soup, named specifically in review after review as the reason to make the long drive out',
      ],
      weaknesses: [
        'No owned website exists at all, just a Facebook page and scattered directory listings',
        'Opening hours conflict across sources, one lists a summer season and another lists year round hours, risking a wasted trip for a remote village hours from Reykjavík',
        'Phone numbers differ across several directory listings with no single canonical source to trust',
      ],
      opportunities: [
        "Give visitors one clear, always current answer to whether it is open today before they drive hours out",
        'Let the real fish soup, waffles and elf folklore setting carry the page instead of scattered third party listings',
        'Replace the conflicting phone numbers with one clear, correct contact',
      ],
    },
    positioning:
      "Álfacafé is a beloved seasonal café in the tiny village of Bakkagerði, sitting right beside Álfaborg, the hill where Icelandic folklore places the home of the elf queen, and rated 4.8 out of 5 across more than 400 Google reviews for its fish soup. It has no owned website at all, only a Facebook page and directory listings that openly disagree on its hours and phone number, a real risk for visitors driving hours each way. The redesign gives it one clear, honest home online: real hours, a real phone number, and the elf lore and puffins next door woven into the same page as the soup and the drive out.",
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Álfacafé',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús.

Ég kynnti mér Álfacafé og sá að þið eruð með 4,8 stjörnur af 422 umsögnum á Google, sem er frábær árangur fyrir stað svona langt úti á landi. Á netinu stangast þó opnunartímarnir ykkar á milli síðna, og gestir sem keyra alla þessa leið enda stundum í óvissu um hvort opið sé.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að hver sem gúglar ykkur sjái strax hvort opið sé í dag, og kynnist fiskisúpunni, Álfaborg og lundunum í leiðinni. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
