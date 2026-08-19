import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for galdrasyning. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // WHY: a beloved Westfjords folklore/witchcraft museum (runic staves, witch-
    // trial history) with a dated site and no online ticketing. OPPORTUNITY: dark,
    // cinematic heritage storytelling + a clear visit/ticket path. CUSTOMER:
    // travellers in the Westfjords and folklore/culture enthusiasts.
    slug: 'galdrasyning',
    route: '/preview/galdrasyning',
    name: 'Galdrasýning á Ströndum',
    sector: 'Folklore museum',
    location: 'Hólmavík, Strandir',
    region: 'Westfjords',
    established: 'Síðan 2000',
    currentUrl: 'https://www.galdrasyning.is',
    ownerEmail: 'galdrasyning@holmavik.is',
    concept: 'Galdrastafir',
    conceptTagline: 'Strandir folk-magic told in candlelight and carved staves.',
    accent: '#b08a34',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A genuinely unique subject — Strandir folk magic and witch-trial history',
        'An established destination with strong reviews and guidebook coverage',
        'A café (Kaffi Galdur) and bookshop alongside the exhibition',
      ],
      weaknesses: [
        'Dated early-2010s site; mobile is an afterthought',
        'No online ticketing — conversion is left on the table for a remote stop',
        'The atmosphere that makes it special is missing from the site',
      ],
      opportunities: [
        'Lean into the dark, atmospheric folklore — a mood the subject deserves',
        'Make opening hours, the two sites and tickets effortless to find',
        'Turn a quirky museum into a must-stop on the Strandir route',
      ],
    },
    positioning:
      'The keeper of Strandir’s folk-magic story — a museum whose atmosphere never reaches its website. The redesign should feel like stepping into the dark, and make the visit easy to plan.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Galdrasýningu á Ströndum',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk söfn og ferðaþjónustu.

Galdrasýningin er einstök, enda á sér fátt sinn líka í íslenskri sögu og þjóðtrú. Mér fannst núverandi vefsíða ekki fanga þá stemningu sem býr í sýningunni, og það vantaði einfalda leið til að sjá opnunartíma og kaupa miða.

Ég settist því niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að láta dulúðina og söguna njóta sín og gera gestum auðvelt að finna ykkur og skipuleggja heimsókn. Ef ykkur líst vel á þetta væri gaman að heyra í ykkur, en annars er engin pressa.

${SIGN}`,
    },
  }
