import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for lysulaugar. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    // WHY: a small geothermal bath with rare naturally GREEN carbonated mineral
    // water, on a farm under Snæfellsjökull; dated WordPress, no booking.
    // OPPORTUNITY: the "green healing spring" story + a clear plan-a-visit flow.
    // CUSTOMER: Snæfellsnes travellers and wellness-seekers planning a stop.
    slug: 'lysulaugar',
    route: '/preview/lysulaugar',
    name: 'Lýsulaugar',
    sector: 'Geothermal nature bath',
    location: 'Lýsuhóll, Snæfellsnes',
    region: 'West',
    established: 'Laug síðan 1981',
    currentUrl: 'https://lysulaugar.is',
    ownerEmail: 'lysulaugar@snb.is',
    concept: 'Græna lindin',
    conceptTagline: 'The rare green mineral spring under Snæfellsjökull — calm, healing, slow.',
    accent: '#2f8f63',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1508869184489-1b42faa950b0?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A genuinely rare hook: naturally carbonated, green mineral/algae water',
        'On a working farm under Snæfellsjökull — strong Snæfellsnes location',
        'Long history and a loyal following among travellers seeking quieter baths',
      ],
      weaknesses: [
        'Dated mid-2010s site, cluttered hierarchy, weak on mobile',
        'No online booking and the opening season/hours are easy to miss',
        'The remarkable green water is never really conveyed',
      ],
      opportunities: [
        'Lead with the green mineral water — the thing nowhere else has',
        'Make the season, hours and how-to-find effortless to read',
        'A calm, wellness-led visit page that converts passing Snæfellsnes traffic',
      ],
    },
    positioning:
      'The calm, green alternative to Iceland’s crowded baths — mineral water on a farm under the glacier. The site should feel restorative and make a visit easy to plan.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Lýsulaugar',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Lýsulaugar eru sérstakar, enda er græna steinefnavatnið ykkar eitthvað sem finnst varla annars staðar. Mér fannst núverandi vefsíða ekki ná að fanga þá upplifun, og opnunartímann og leiðina til ykkar mætti gera skýrari.

Ég ákvað því að hanna frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Áherslan er á að láta vatnið og umhverfið njóta sín og gera gestum auðvelt að sjá hvenær er opið og hvernig á að finna ykkur. Ef ykkur líst vel á þetta væri gaman að heyra í ykkur, en annars er það að sjálfsögðu allt í lagi.

${SIGN}`,
    },
  }
