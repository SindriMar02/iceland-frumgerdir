import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for stjornusol. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'stjornusol',
    route: '/preview/stjornusol',
    name: 'Stjörnusól',
    sector: 'Sólbaðsstofa',
    location: 'Fjarðargata 17, Hafnarfjörður',
    region: 'Capital',
    established: 'Síðan 1979',
    currentUrl: 'https://solbadsstofa.is',
    ownerEmail: '',
    concept: 'Vélin vaknar',
    conceptTagline:
      'The K11 render is the hero film: its LED panels wake in sequence and hum on the page. Obsidian room, champagne metal, violet light, and the brand magenta star.',
    accent: '#C2185F',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1519677584237-752f8853252e?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Rótgróin stofa í hjarta Hafnarfjarðar, starfandi síðan 1979',
        'Nýjasti bekkurinn, K11 Air Loft frá KBL, ALL LED með áfangastaðaprógrömmum',
        'Netbókun á Noona og tímaskipt verðskrá sem verðlaunar morgungesti',
      ],
      weaknesses: [
        'WordPress vefur með litla hönnun, verðskráin flöt tafla og K11 síðan enn merkt „kemur í janúar 2025"',
        'Enginn opnunartími sýnilegur á vefnum og engin verðsaga á forsíðu',
        'Ekkert netfang birt og bókunarhnappurinn týnist í valmyndinni',
      ],
      opportunities: [
        'Láta ljósin sjálf segja söguna: verðið kviknar eins og perurnar í bekknum',
        'Morgunverð og dagverð sem lifandi samanburður með sparnaði á hverri línu',
        'K11 Air Loft sem stjarna vefsins með sínum raunverulegu áfangastöðum',
      ],
    },
    positioning:
      'Elsta sólbaðsstofa Hafnarfjarðar með splunkunýjan flaggskipsbekk en vef sem segir hvorki verð né opnunartíma. Frumgerðin gerir ljósið að aðalatriðinu og tímaskipta verðið að leik.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Stjörnusól',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Stjörnusól hefur verið til síðan 1979 og er nú með einn flottasta bekk landsins, K11 Air Loft. Þegar ég skoðaði vefsíðuna ykkar tók ég eftir að hún endurspeglar það ekki: verðskráin er flöt tafla, opnunartíminn kemur hvergi fram og K11 síðan segir enn að bekkurinn sé væntanlegur í janúar 2025.

Ég hannaði því frumgerð að nýjum vef þar sem ljósin sjálf segja söguna: verðið kviknar á skjánum eins og perur í bekk, morgunverð og dagverð skiptast með einum smelli og K11 Air Loft fær sviðið sem hann á skilið. Bókunin á Noona er alltaf innan seilingar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  }
