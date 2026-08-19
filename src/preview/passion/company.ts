import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for passion. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // Passion Reykjavík — family-run artisan bakery, Álfheimar 6, Reykjavík
    // + bollur counter at Fjarðarkaup, Hafnarfjörður. Owner/baker Styrmir Már
    // Sigmundsson (veitingageirinn.is). TripAdvisor 4.8/57 (#6 of 19 Rvk
    // bakeries), Google ~4.8. Their real site passionreykjavik.is has shown an
    // "under construction" placeholder since at least Apr 2024 (Wayback digest
    // unchanged Apr 2024 → Jul 2026) while /bollur is a live order page.
    // Prototype re-skins the GK skeleton in Passion's OWN brand (logo, #111
    // ground, gold + burgundy from the logo, Lusitana + Source Serif — the
    // fonts their own build preloads). English-first with IS toggle. Only ONE
    // photo (the existing repo cinnamon-roll plate as their Cinnabon); all
    // other image slots are labelled HD-photography placeholder frames.
    slug: 'passion',
    route: '/preview/passion',
    name: 'Passion Reykjavík',
    sector: 'Bakarí & kaffihús',
    location: 'Álfheimar 6, Reykjavík',
    region: 'Capital',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.passionreykjavik.is',
    ownerEmail: 'passionreykjavik@simnet.is',
    concept: 'PASSION',
    conceptTagline:
      'Their own gold-serif identity, finally given a home: a dark, elegant, English-first page where the flagship Cinnabon turns slowly under the NÝBAKAÐ headline as you scroll.',
    accent: '#C8A877',
    dark: true,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'passion/cinnabon.jpg',
    audit: {
      strengths: [
        'TripAdvisor 4,8 af 5 (57 umsagnir), #6 af 19 bakaríum í Reykjavík, og virk Wolt heimsending',
        'Sterk sérstaða: rómað vegan úrval, Cinnabon menning og 15 tegundir af bollum fyrir bolludag',
        'Alvöru vörumerki nú þegar: gyllt serif merki með vínrauðri pensilstroku sem á skilið að sjást',
      ],
      weaknesses: [
        'Forsíðan á passionreykjavik.is hefur sagt "vefsíðan er í vinnslu" að minnsta kosti síðan í apríl 2024',
        'Engar vörur, verð eða myndir á vefnum, allt umtalið býr á TripAdvisor og samfélagsmiðlum',
        'Ferðafólk sem finnur 4,8 stjörnu bakarí á netinu lendir á tómri síðu',
      ],
      opportunities: [
        'Nota þeirra eigið merki og liti í fullbúna forsíðu í stað placeholder síðunnar',
        'Enska fyrst fyrir ferðafólk með íslensku í einum smelli',
        'Sýna raunveruleg verð af Wolt, bollumenninguna og vegan úrvalið sem gestir lofa mest',
      ],
    },
    positioning:
      'A 4.8-star family bakery whose only web presence has been a "coming soon" page for over two years. The prototype gives their existing gold-and-burgundy identity a real home: dark, elegant, English-first for the tourists already reviewing them, with real Wolt prices and marked frames where their HD photography will land.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Passion Reykjavík',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk bakarí og kaffihús.

Ég rakst á Passion Reykjavík um daginn og heillaðist af því sem þið gerið. Þið eruð með frábært orðspor, 4,8 í einkunn á TripAdvisor, og fólk talar sérstaklega vel um vegan bakkelsið og Cinnabon snúðana ykkar. Þegar ég ætlaði svo að skoða vefsíðuna ykkar fann ég hins vegar hvergi almennilega síðu með upplýsingum, því passionreykjavik.is sýnir aðeins skilaboð um að vefurinn sé í vinnslu.

Mér fannst það synd fyrir svona gott bakarí, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Síðan notar merkið ykkar og litina úr því. Hún er á ensku fyrir ferðafólk með íslensku í einum smelli, og sýnir matseðilinn, verðin eins og þau birtast á Wolt, bollurnar og vegan úrvalið. Það eina sem vantar eru ljósmyndir af vörunum ykkar, og ég merkti staðina þar sem þær gætu farið.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur. Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
