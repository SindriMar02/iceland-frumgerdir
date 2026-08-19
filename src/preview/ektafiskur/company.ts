import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for ektafiskur. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'ektafiskur',
    route: '/preview/ektafiskur',
    name: 'Ektafiskur',
    sector: 'Artisan saltfish & Baccalá Bar',
    location: 'Hauganes, North Iceland',
    region: 'North',
    established: 'Since 1940',
    currentUrl: 'https://www.ektafiskur.is',
    ownerEmail: 'elvar@ektafiskur.is',
    concept: 'The Salt House',
    conceptTagline: 'Eighty years of provenance, clean as Nordic salt — a premium label that finally ships.',
    accent: '#1f5673',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Rare 1940 provenance — eight decades of hand-salted bacalao',
        'Three revenue lines under one roof: retail, export webshop, Baccalá Bar',
        'A real product story with genuine international demand',
      ],
      weaknesses: [
        'Early-2000s desktop-first site; thumbnail images, weak hierarchy',
        'Webshop is clunky and inconsistent across languages',
        'Heritage — the brand’s biggest asset — is barely visible',
      ],
      opportunities: [
        'A premium bilingual label that makes the webshop actually convert',
        'Position the Baccalá Bar as a north-coast destination',
        'Lead with “since 1940” — provenance as the moat',
      ],
    },
    positioning:
      'A heritage Icelandic seafood house, not a fish stall — provenance, craft and export. The site should look as considered as the product and sell in two clicks.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Ektafisk',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk matvælafyrirtæki og ferðaþjónustu.

Saga Ektafisks frá 1940 er eitthvað sem fá fyrirtæki geta státað af. Handsaltaður fiskur, vefverslun og Baccalá Bar á sama stað. Mér fannst núverandi vefsíða ekki gera þessari arfleifð eða vörunni nógu hátt undir höfði, enda er hún orðin nokkuð þung og gamaldags, og vefverslunin mætti vera mun einfaldari.

Ég settist því niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að láta áttatíu ára söguna njóta sín, gera vefverslunina lipra og kynna Baccalá Bar betur fyrir ferðafólki. Ef ykkur líst vel á stefnuna gæti ég klárað vefinn í heild, en ef ekki er það að sjálfsögðu í góðu.

${SIGN}`,
    },
  }
