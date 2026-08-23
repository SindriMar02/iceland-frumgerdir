import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for saelan. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'saelan',
    route: '/preview/saelan',
    name: 'Sælan',
    sector: 'Sólbaðsstofa og spraytan',
    location: 'Faxafen 10, Reykjavík',
    region: 'Capital',
    established: 'Sólbaðsstofa ehf, opnaði aftur í Faxafeni 1. október 2025 (saga frá 2002)',
    currentUrl: 'https://saelan.is',
    ownerEmail: 'saelan@saelan.is',
    concept: 'Sólplakat',
    conceptTagline:
      'A silkscreened solarium poster: the page is drenched in the logo sun yellow with red and ink as print colors, Tanker slab type, a draggable sun-path price dial and punch-card timakort.',
    accent: '#C9301C',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://saelan.is/wp-content/uploads/2025/09/saelanmynd11.png',
    audit: {
      strengths: [
        'Glænýir bekkir, KBL K11 Air Loft ALL LED og Ergoline Prestige 1400, plús eina sjálfvirka spraytanið á Íslandi (VersaSpa PRO)',
        'Netbókun á Noona og áskrift gegnum Repeat, öll verð birt á vefnum',
        'Flottar alvöru ljósmyndir til, bekkirnir í hlýrri lýsingu og skiltið í glugganum',
      ],
      weaknesses: [
        'Titillinn er bara „Sælan", engin lýsing, ekkert schema, lang="en-US" og engin H1 á forsíðunni, eina H1 vefsins er ensk „coming soon" síða',
        'Elementor sniðmát með óviðkomandi myndabankamyndum (fætur á strönd, jógakona) og skilmálasíðan er með hliðarstiku sem vísar á ástralska húsgagnaverslun',
        '50 skriftur og 45 stílblöð á forsíðunni, um 2 MB af óþjöppuðum myndum, og pinch-zoom er læst',
      ],
      opportunities: [
        'Eitt heildstætt gyllt útlit byggt á þeirra eigin myndum í stað sniðmátsmynda',
        'Sagan frá 2002 og endurkoman í Faxafenið sögð upphátt, það byggir upp traust eftir lokanirnar',
        'Verðskráin og áskriftarskilmálarnir settir fram heiðarlega, traustið er söluvaran eftir endurkomuna',
      ],
    },
    positioning:
      'Rótgróið vörumerki með yfir 20 ára sögu sem opnaði aftur í Faxafeni með flottustu tæki landsins en vef á sniðmáti með myndabankamyndum. Frumgerðin fangar gullnu stundina: dökkur hlýr heimur, alvöru myndir af bekkjunum, áfangastaðavalið úr K11 sem wow-augnablik og heiðarleg verðskrá og áskrift í öndvegi.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Sæluna',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Til hamingju með endurkomuna í Faxafenið, bekkirnir eru greinilega á heimsmælikvarða og spraytanklefinn er sá eini sinnar tegundar á landinu. Þegar ég skoðaði vefsíðuna tók ég samt eftir því að hún stendur tækjunum langt að baki: titillinn er bara eitt orð svo Google veit varla af ykkur, myndirnar eru að mestu úr erlendu sniðmáti frekar en ykkar eigin, og síðan er þung í síma.

Ég settist því niður og hannaði frumgerð að nýjum vef í kringum ykkar eigin myndir og alvöru verð. Bekkirnir ykkar fá að vera stjarnan, verðskráin er loksins læsileg á augabragði og bókunin á Noona er alltaf innan seilingar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á hana getum við fundið sanngjarnt verð. Ef ekki, þá er það ekkert mál.

${SIGN}`,
    },
  }
