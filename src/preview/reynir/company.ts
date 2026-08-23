import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for reynir. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // Reynir bakari — family craft bakery in Kópavogur since 1994 (Dalvegur 4;
    // their Hamraborg 14 shop closed ~2024, confirmed by the owner 2026-08-16).
    // Founder Reynir (Carl) Þorleifsson; passed 2019; sons
    // Þorleifur Karl + Henry Þór took over. Google 4,5/63, Facebook 92% recommend.
    // Current site: dated Wix, "© 2020 by Undireins", no menu/prices online.
    // Prototype CLONES the Passion design + palette per Sindri's brief, re-skinned
    // with their real gold script logo, heritage dough photo, aha.is prices, story.
    slug: 'reynir',
    route: '/preview/reynir',
    name: 'Reynir bakari',
    sector: 'Bakarí & kaffihús',
    location: 'Dalvegur 4, Kópavogur',
    region: 'Capital',
    established: 'Síðan 1994',
    currentUrl: 'https://www.reynirbakari.is',
    ownerEmail: 'reynirbakari@reynirbakari.is',
    concept: 'HANDGERT',
    conceptTagline:
      'A 30-year family craft bakery given the same dark, gold, editorial treatment as Passion, re-skinned to Reynir: their real script logo in gold, their heritage dough photo, and their 1994 story.',
    accent: '#C8A877',
    dark: true,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'reynir/hero-dough.jpg',
    audit: {
      strengths: [
        'Rótgróið fjölskyldubakarí í Kópavogi síðan 1994, allt bakað á staðnum frá grunni',
        '4,5 í einkunn á Google úr 63 umsögnum og 92% mæla með þeim á Facebook',
        'Rómuð vínarbrauð og hefðbundin súrdeigsbrauð, bökuð á staðnum við Dalveg',
      ],
      weaknesses: [
        'Vefsíðan er gömul Wix síða, merkt "© 2020 by Undireins", og virkar úrelt',
        'Enginn matseðill og engin verð á vefnum, allt umtalið býr annars staðar',
        'Sagan þeirra, frá 1994 og fjölskyldunni, kemur hvergi fram á vefnum',
      ],
      opportunities: [
        'Nútímaleg, hlý og fáguð síða sem stendur undir 30 ára sögu bakarísins',
        'Skýr matseðill og raunveruleg verð, ásamt lifandi opnunartíma',
        'Segja söguna: Reynir, fjölskyldan og synirnir sem tóku við ofnunum',
      ],
    },
    positioning:
      'A beloved 30-year Kópavogur family bakery on a tired 2020 Wix with no menu, prices or story online. The prototype reuses the Passion dark-gold editorial design, re-skinned entirely to Reynir: their own script logo in gold, their real heritage dough photo, real aha.is prices, a live open/closed clock, and the 1994 family story.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Reynir bakara',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk bakarí og kaffihús.

Ég rakst á Reynir bakara og heillaðist af sögunni ykkar. Fjölskyldubakarí í Kópavogi síðan 1994, allt bakað á staðnum frá grunni, með 4,5 í einkunn á Google og fólk sem talar sérstaklega vel um vínarbrauðin og pistasíusnúðana. Þegar ég ætlaði svo að skoða vefsíðuna ykkar fann ég hins vegar bara gamla síðu frá 2020, án matseðils, verða eða sögunnar ykkar.

Mér fannst það synd fyrir svona rótgróið bakarí, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Síðan notar merkið ykkar, sýnir matseðilinn og verðin, segir söguna frá 1994 og vísar á Dalveg. Hún er á ensku fyrir ferðafólk með íslensku í einum smelli.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur. Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
