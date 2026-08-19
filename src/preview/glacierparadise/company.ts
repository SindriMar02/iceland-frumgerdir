import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for glacierparadise. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'glacierparadise',
    route: '/preview/glacierparadise',
    name: 'Glacier Paradise',
    sector: 'Glacier tours',
    location: 'Arnarstapi, Snæfellsnes',
    region: 'West',
    established: 'Síðan 2022',
    currentUrl: 'https://glacierparadise.is',
    ownerEmail: '',
    concept: 'The Ascent',
    conceptTagline: 'Scrolling is ascending — a living altimeter climbs Snæfellsjökull to a booking where the price is finally visible.',
    accent: '#7FC8E8',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1576635862964-c1a01be402ff?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Snow-cat tours up Snæfellsjökull — Jules Verne’s legendary glacier',
        'Third-generation family guides with 20+ years on the ice',
        'Entirely reliant on online discovery — a strong site moves the needle',
      ],
      weaknesses: [
        'The homepage has no booking button and no email anywhere',
        'Prices are buried on inner pages',
        'No clear contact path for a remote, no-walk-up operator',
      ],
      opportunities: [
        'Make the ascent the experience and end it on an obvious booking',
        'Put the price and a clear reserve action above the fold',
        'Add a real contact block and credible trust signals',
      ],
    },
    positioning:
      'A remote glacier operator that lives entirely on online discovery cannot afford a homepage with no way to book. Turn the climb into the story and the booking into the destination.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Glacier Paradise',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Mér líst virkilega vel á ferðirnar ykkar upp á Snæfellsjökul og þá fjölskyldusögu sem býr að baki. Það eina sem ég staldraði við var vefsíðan, því á forsíðunni er hvorki bókunarhnappur, verð né netfang, og ég held að þið séuð að missa af bókunum þess vegna.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu þar sem öll ferðin upp á jökulinn verður að upplifun og endar á skýrri bókun með sýnilegu verði. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn, en ef ykkur líst vel á gæti ég klárað vefinn í heild.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
