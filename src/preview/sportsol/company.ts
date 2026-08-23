import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for sportsol. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'sportsol',
    route: '/preview/sportsol',
    name: 'Sportsól',
    sector: 'Sólbaðsstofa',
    location: 'Kópavogur og Grafarvogur',
    region: 'Capital',
    established: 'Sportsól ehf, stofnað 2012',
    currentUrl: 'https://sportsol.is',
    ownerEmail: 'sportsol@sportsol.is',
    concept: 'Komdu í ljós',
    conceptTagline:
      'The landing page is the UV room: tubes strike and hum like the real thing, the neon-fuchsia logo leads the palette, and the time-of-day pricing makes sense at a glance.',
    accent: '#B500AE',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Splunkunýjar stofur: Hverafold opnaði 2024 og Hamraborg í janúar 2026, með Luxura og American M7 bekkjum',
        'Alvöru netbókun á Noona og öll verð birt á vefnum',
        'Virk á Instagram og TikTok, lifandi opnunartímar í haus',
      ],
      weaknesses: [
        'Öll tilboð eru innbakaðar auglýsingamyndir í ólíkum stílum, ólesanlegar í síma og ósýnilegar Google',
        'Eina H1 forsíðunnar er „Opnunartímar", titillinn nefnir hvorki sólbaðsstofu né staðsetningu og engin skipulögð gögn',
        'Enskir gestir fá blandaða ensk-íslenska síðu og útlitið tengist ekki bleika pálmamerkinu',
      ],
      opportunities: [
        'Eitt heildstætt sólarútlit í kringum bleika merkið í stað ósamstæðra borða',
        'Verðskráin sem hönnuð tafla með morgun- og dagverði og bókun við hverja línu',
        'LocalBusiness gögn fyrir báðar stofur svo þær finnist á Google',
      ],
    },
    positioning:
      'Ný og metnaðarfull sólbaðsstofukeðja með glæný tæki en vef sem lítur út eins og ljósritað dreifiblað. Frumgerðin selur birtuna og vellíðanina, gerir tímaskipt verð skiljanlegt á augabragði og setur Noona bókunina í öndvegi.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Sportsól',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Þið hafið byggt upp flotta aðstöðu á methraða, splunkunýir bekkir í Hverafold og nú Hamraborg, netbókun á Noona og öll verð sýnileg. Þegar ég skoðaði vefsíðuna tók ég samt eftir að tilboðin eru myndir með innbökuðum texta sem sjást illa í síma og finnast ekki á Google, og útlitið endurspeglar ekki hvað stofurnar eru nýjar og flottar.

Ég hannaði því frumgerð að nýjum vef þar sem ljósið fylgir deginum: verðskráin sýnir morgun- og dagverð á augabragði, áskriftin og Frelsi fá almennilega umgjörð og bókunin á Noona er alltaf innan seilingar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  }
