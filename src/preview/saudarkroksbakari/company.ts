import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for saudarkroksbakari. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
/* ----------------------------------------------------------------- */
  /* Batch 4 — five new independent redesigns (each its own direction). */
  /* ----------------------------------------------------------------- */

export const companyEntry: PreviewCompany = {
    slug: 'saudarkroksbakari',
    route: '/preview/saudarkroksbakari',
    name: 'Sauðárkróksbakarí',
    sector: 'Heritage bakery',
    location: 'Sauðárkrókur, Skagafjörður',
    region: 'North',
    established: 'Síðan 1880',
    currentUrl: 'https://www.saudarkroksbakari.net',
    ownerEmail: 'saudarkroksbakari@gmail.com',
    concept: 'Bakað síðan 1880',
    conceptTagline: 'A 140-year town bakery as a warm dawn-to-day broadsheet — the ovens are still lit.',
    accent: '#b06a2c',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Eitt elsta bakarí landsins, bakað á sama stað við Aðalgötu síðan 1880',
        'Sterkar umsagnir og Travelers’ Choice á Tripadvisor (4,7 stjörnur)',
        'Hjarta gamla bæjarins á Sauðárkróki og fast stopp ferðafólks',
      ],
      weaknesses: [
        'Lénið saudarkroksbakari.net er útrunnið og vísar nú á erlenda sölusíðu',
        'Engin virk vefsíða: enginn matseðill, opnunartími, kort eða sími sem virkar',
        '140 ára sagan og sterku umsagnirnar hvergi kynntar',
      ],
      opportunities: [
        'Ná aftur sýnileika með opnunartíma, korti og síma sem hægt er að ýta á',
        'Segja 140 ára söguna sem enginn stórmarkaður á',
        'Hröð forsíða í síma fyrir ferðafólk í Skagafirði',
      ],
    },
    positioning:
      'Eitt elsta bakarí Íslands, nánast ósýnilegt á netinu eftir að lénið rann út. Frumgerðin á að koma því aftur á kortið og láta 140 ára söguna njóta sín.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Sauðárkróksbakarí',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Sauðárkróksbakarí er eitt elsta bakarí landsins og sú saga á sér fáa líka. Þegar ég ætlaði að skoða vefsíðuna ykkar tók ég eftir að lénið saudarkroksbakari.net er ekki lengur virkt, svo gestir sem leita að ykkur eða smella á hlekk frá Tripadvisor lenda á annarri síðu. Það getur kostað ykkur heimsóknir á hverjum degi.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu sem sýnir söguna, opnunartíma, vörurnar og hvar ykkur er að finna. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta getum við spjallað og fundið sanngjarnt verð. Ef ekki er ekkert mál, og ég vona að þetta veiti ykkur smá innblástur.

${SIGN}`,
    },
  }
