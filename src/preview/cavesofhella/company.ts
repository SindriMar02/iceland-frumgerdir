import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for cavesofhella. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // WHY: an extraordinary subject (twelve man-made caves with carved crosses,
    // possibly older than the settlement) on a generic Wix template with almost
    // no imagery and booking buried in a menu. OPPORTUNITY: a cinematic, immersive
    // "descent" with timed-tour booking first. CUSTOMER: self-driving tourists on
    // the South Coast — the caves sit on the Ring Road, an hour from Reykjavík.
    slug: 'cavesofhella',
    route: '/preview/cavesofhella',
    name: 'Caves of Hella',
    sector: 'Hellaferðir',
    location: 'Ægissíða, Hella',
    region: 'South',
    established: 'Manngerðir hellar',
    currentUrl: 'https://cavesofhella.is',
    ownerEmail: 'info@cavesofhella.is',
    concept: 'Niður í myrkrið',
    conceptTagline:
      'Iceland’s hidden underworld — a cinematic scroll-descent into man-made caves that may predate the settlement.',
    accent: '#9a5b1e',
    dark: true,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'cavesofhella/hero.jpg',
    audit: {
      strengths: [
        'A genuinely rare subject — twelve man-made caves with crosses and carvings, possibly pre-settlement',
        'Right on the Ring Road, an hour from Reykjavík, with daily guided tours in English',
        'Clear pricing and a real booking system already in place',
      ],
      weaknesses: [
        'A generic Wix template that conveys none of the mystery or atmosphere',
        'Almost no photography for what is, fundamentally, a visual attraction',
        'Booking and tour times are buried in a menu rather than front and centre',
      ],
      opportunities: [
        'Make the visitor feel the descent into the underworld before they arrive',
        'Showcase each named cave (Fjóshellir, Kirkjuhellir, Hlöðuhellir, Lambhellir)',
        'Put “pick a time and book” one tap away',
      ],
    },
    positioning:
      'Iceland’s oldest standing archaeological mystery deserves a site that feels like stepping underground. The redesign trades a flat template for a cinematic descent — candlelight, carved stone, the named caves — with timed-tour booking as the hero.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Caves of Hella',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Við vorum nokkur á leið í útilegu í sumar þegar ég fór að skoða hellana ykkar á netinu og heillaðist strax af sögunni. Manngerðir hellar sem gætu verið eldri en sjálft landnámið, með krossum og útskurði í veggjunum, eru saga sem fólk vill upplifa. Það eina sem ég staldraði við var sjálf vefsíðan, því mér fannst hún ekki ná að fanga þessa dulúð. Myndirnar eru fáar og það er ekki alveg augljóst hvernig maður bókar ferð.

Mér fannst það synd, svo ég settist niður í frítímanum mínum og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að gestir finni strax fyrir leyndardómnum sem býr í hellunum, sjái þá með eigin augum og geti bókað ferð á örfáum sekúndum. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
