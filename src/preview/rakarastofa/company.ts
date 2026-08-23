import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for rakarastofa. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // Rakarastofa Björns og Kjartans — Austurvegur 4, Selfoss. Family barbershop
    // founded 1948 by Gísli Sigurðsson. 6 named barbers, Noona booking, ~2.500 FB
    // likes. Current site = a single-page free WordPress.com page (one paragraph,
    // one vintage photo, a WP.com comment form). Sindri's own build (Sindri took
    // over the design after an earlier agent's version was scrapped). Concept
    // "Klippt síðan 1948": warm bone paper, barber-red + pole-navy, engraved Zina
    // display, the real 1948-era archival photo, and a spinning barber pole as the
    // signature. PRICES are sýnishorn (none published anywhere).
    slug: 'rakarastofa',
    route: '/preview/rakarastofa',
    name: 'Rakarastofa Björns og Kjartans',
    sector: 'Rakarastofa',
    location: 'Austurvegur 4, Selfoss',
    region: 'South',
    established: 'Rakarastofa Björns og Kjartans, stofnuð 1948',
    currentUrl: 'https://rakarastofan.is',
    ownerEmail: 'rakarastofa@gmail.com',
    concept: 'Klippt síðan 1948',
    conceptTagline:
      'A dark, cinematic, modern barbershop: warm charcoal and off-white with one muted barber-red, Fraunces display, full-bleed photography carrying the hero, and the real 1948 archival photo as the heritage anchor. Motion is a slow ken-burns, gentle parallax and smooth reveals.',
    accent: '#C24B36',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://rakarastofan.is/wp-content/uploads/2023/03/39086604_2526530124027605_8273819462801555456_n.jpg',
    audit: {
      strengths: [
        'Rótgróin rakarastofa á Selfossi, stofnuð 1948, með dyggan hóp fastagesta og sterka Facebook nærveru',
        'Sex rakarar og netbókun á Noona þegar til staðar',
        'Ekta saga og gömul ljósmynd úr stofunni sem enginn keppinautur á',
      ],
      weaknesses: [
        'Vefurinn er ein síða á ókeypis WordPress.com, ein málsgrein, ein mynd og athugasemdareitur sem á ekki heima á rakarastofu',
        'Engin verðskrá, engin þjónustulýsing og ekkert kort',
        'Ekkert skipulagt gagnamerki, illfinnanleg á Google fyrir klippingu á Selfossi',
      ],
      opportunities: [
        'Gera 1948 arfleifðina að aðalatriðinu með gömlu myndinni og sögunni',
        'Læsileg verðskrá og skýr Noona bókun í stað einnar málsgreinar',
        'LocalBusiness gögn svo stofan finnist þegar fólk leitar að rakara á Suðurlandi',
      ],
    },
    positioning:
      'Ein elsta rakarastofa Suðurlands með ósvikna sögu frá 1948 en vef sem er ein málsgrein á ókeypis WordPress síðu. Frumgerðin gerir arfleifðina að aðalatriðinu, sýnir verðskrána skýrt og setur Noona bókunina í öndvegi, með snúandi rakarastaur sem einkennismerki. Öll verð eru sýnishorn.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Rakarastofu Björns og Kjartans',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Þið eruð með eina elstu rakarastofu Suðurlands, klippt á Selfossi allt frá 1948, og eigið ykkur dyggan hóp fastagesta. Þegar ég skoðaði vefsíðuna ykkar fannst mér hún samt ekki gera sögunni skil, hún er ein málsgrein á einfaldri WordPress síðu, engin verðskrá og engin leið að sjá hvað þið bjóðið.

Ég hannaði því frumgerð að nýjum vef þar sem arfleifðin frá 1948 fær sviðið, gamla myndin og sagan, læsileg verðskrá og Noona bókunin alltaf innan seilingar. Verðin á frumgerðinni eru sýnishorn sem þið staðfestið. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  }
