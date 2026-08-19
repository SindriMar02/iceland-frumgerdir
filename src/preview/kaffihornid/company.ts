import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for kaffihornid. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'kaffihornid',
    route: '/preview/kaffihornid',
    name: 'Kaffi Hornið',
    sector: 'Café · bar · restaurant',
    location: 'Höfn í Hornafirði, SE Iceland',
    region: 'Southeast',
    established: 'Since 1999',
    currentUrl: 'https://kaffihornid.is',
    ownerEmail: 'info@kaffihornid.is',
    concept: 'The Warm Corner',
    conceptTagline: 'The harbour table in langoustine country — daylight warmth, glacier on the horizon.',
    accent: '#c5612f',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '27-year institution in Iceland’s langoustine capital',
        'Single warm location with steady, repeat custom',
        'On a busy tourist route below Vatnajökull',
      ],
      weaknesses: [
        'Site frozen at “© 2018” — repeated broken logos, no mobile layout',
        'Most diners arrive by phone; the current site fails on one',
        'No menu, reservations or langoustine story up front',
      ],
      opportunities: [
        'A mobile-first table that loads in a thumb on the road',
        'Own the Höfn-langoustine association on the menu and hero',
        'Reservations + hours that capture passing trade',
      ],
    },
    positioning:
      'The dependable, warm corner of Höfn — langoustine, coffee and a glacier view. The site should be the easiest table to find and book from the road.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Kaffi Hornið',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús og ferðaþjónustu.

Kaffi Hornið hefur verið fastur punktur á Höfn frá 1999 og humarinn ykkar er rómaður. Núverandi vefsíða er hins vegar orðin nokkuð gömul, hún er enn merkt árinu 2018 og virkar illa í síma, en það er einmitt þar sem flestir ferðamenn fletta ykkur upp á leiðinni.

Ég ákvað því að hanna frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Áherslan er á einfaldan og hraðan vef sem sýnir matseðilinn, opnunartíma og humarinn, og gerir gestum auðvelt að finna ykkur og bóka borð. Ef ykkur líst vel á þetta væri gaman að heyra í ykkur, en annars er engin pressa.

${SIGN}`,
    },
  }
