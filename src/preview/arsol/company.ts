import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for arsol. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // Sólbaðsstofan Ársól — Hrísholt 17, Selfoss. 4× Luxura X7 + infrared sauna
    // + massage chair (verified from their Noona profile). Open daily 11–22.
    // No website (Facebook + Noona only). Prices are sýnishorn.
    slug: 'arsol',
    route: '/preview/arsol',
    name: 'Sólbaðsstofan Ársól',
    sector: 'Sólbaðsstofa',
    location: 'Hrísholt 17, Selfoss',
    region: 'South',
    established: 'Sólbaðsstofan Ársól, á Selfossi frá 2020',
    currentUrl: 'https://noona.app/arsol',
    ownerEmail: 'Solbadsstofanarsol@gmail.com',
    concept: 'Ársól',
    conceptTagline:
      'A silkscreen sun-poster for Selfoss in the Sælan magazine language but its own sunset-to-UV colourway: four Luxura X7 beds as numbered plates and a printed skin-type sun-dial that tells you your minutes.',
    accent: '#E0672A',
    dark: false,
    status: 'Concept ready',
    thumb:
      'https://res.cloudinary.com/timatal-ehf/image/upload/v1719837848/companyCoverImages/ajtjvlu5xbk2hhkbe2nz.jpg',
    audit: {
      strengths: [
        'Fjórir nýir Luxura X7 bekkir með nýjustu tækni, infrarauður saunaklefi og nuddstóll',
        'Opið alla daga frá 11 til 22 og netbókun á Noona',
        'Rótgróin á Selfossi með dyggan hóp fastagesta, yfir 1.200 fylgjendur á Noona',
      ],
      weaknesses: [
        'Engin eiginleg vefsíða til, aðeins Facebook síða og bókunarsíða á Noona',
        'Hvergi hægt að sjá bekki, verð eða opnunartíma án þess að fara inn í bókunarferlið',
        'Ósýnileg á Google þegar fólk á Suðurlandi leitar að ljósum og sólbekk',
      ],
      opportunities: [
        'Fyrsta alvöru vefsíðan: bekkirnir, verð og opnunartími á augabragði',
        'Verðskrá og húðgerðar-leiðbeiningar sem hönnuð sólarplaköt í stað falinna Noona lista',
        'LocalBusiness gögn svo Ársól finnist á Google fyrir Selfoss og nágrenni',
      ],
    },
    positioning:
      'Rótgróin sólbaðsstofa á Selfossi með fjóra glænýja Luxura X7 bekki en enga vefsíðu, bara Facebook og Noona. Frumgerðin er sólarplakat sem sýnir bekkina, gerir verðskrána læsilega og setur húðgerðar-leiðbeiningarnar og Noona bókunina í öndvegi. Öll verð eru sýnishorn sem staðfest yrðu með stofunni.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Ársól',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Þið eruð með fjóra glænýja Luxura X7 bekki, infrarauðan saunaklefa og nuddstól, opið alla daga og dyggan hóp fastagesta. Þegar ég leitaði að Ársól á netinu fann ég samt bara Facebook síðu og bókun á Noona, enga eiginlega vefsíðu þar sem sést hvað þið bjóðið, hvað það kostar eða hvenær er opið.

Ég hannaði því frumgerð að nýjum vef í anda sólarplakats: bekkirnir fá sviðið, verðskráin verður læsileg og einföld, húðgerðar-leiðbeiningar hjálpa fólki að velja réttan tíma og bókunin á Noona er alltaf innan seilingar. Verðin á frumgerðinni eru sýnishorn sem þið staðfestið. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  }
