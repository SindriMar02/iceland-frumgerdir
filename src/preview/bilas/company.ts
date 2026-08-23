import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for bilas. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'bilas',
  route: '/preview/bilas',
  name: 'Bílasalan Bílás',
  sector: 'Bílasala',
  location: 'Akranes',
  region: 'Vesturland',
  established: 'Est. 2007',
  currentUrl: 'https://bilas.is',
  ownerEmail: 'alexander@bilas.is',
  concept: 'Á staðnum',
  conceptTagline:
    'The lot itself is the website — every one of the 24 real cars on the Akranes lot, with the dealer’s own photos, live prices and km, browsable with filters. Night-asphalt ground, xenon-blue accent, odometer-style inventory counter as you scroll.',
  accent: '#8FC6FF',
  dark: true,
  status: 'Concept ready',
  thumb: 'https://bilasolur.is/CarImage.aspx?s=31&c=623788&p=4328403&w=784',
  audit: {
    strengths: [
      'Real inventory data is fully published — every car has price, km, fuel, transmission and ~10 photos of the actual vehicle on the lot',
      'Genuine trust signals already exist: published sölulaun price schedule, BL sales agency, named staff with direct emails, 20-min test drive policy',
      'Their own car photography is honest and atmospheric — Icelandic sky, mountains and the real premises visible in the shots',
    ],
    weaknesses: [
      'The site is a generic bilasolur.is ASP.NET template — identical to dozens of other Icelandic dealers, nothing says Bílás',
      'Dated early-2000s visual language: dense filter sidebars, tiny thumbnails, no mobile-first layout',
      'The homepage buries the actual selling point (real cars, on the lot, priced) under portal chrome',
    ],
    opportunities: [
      'Lead with the inventory itself — big photography, honest prices, instant fuel-type filtering',
      'Turn "Á staðnum" (their own nav label) into the brand promise: everything you see is physically on the lot',
      'Surface the transparency they already practice (verðskrá, test drive policy) as a trust story no portal template can tell',
    ],
  },
  positioning:
    'A real, working dealership with fully honest inventory data trapped inside a portal template that makes it look like every other car site in Iceland. The redesign gives Bílás its own face: the actual lot, the actual cars, the actual prices, presented like a premium showroom instead of a database listing.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Bílás',
    body: `Góðan dag Alexander,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég skoðaði bilas.is og sá að þið birtið allt sem skiptir máli, verð, akstur og fjölda mynda af hverjum bíl, og meira að segja verðskrána ykkar fyrir sölulaun. Sá heiðarleiki er sjaldgæfur í bransanum. En vefurinn sjálfur er staðlað bílasölukerfi sem lítur eins út og tugir annarra bílasala, þannig að þessi sérstaða sést hvergi.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Hún notar ykkar eigin myndir og alvöru bílana sem eru á planinu núna, með verði og akstri á öllum, og leyfir fólki að sía eftir eldsneyti og verði á augabragði. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðin er hér: [PREVIEW_URL]

Ef ykkur líst vel á þetta væri gaman að heyra í ykkur, en annars vona ég að þetta veiti ykkur innblástur.

${SIGN}`,
  },
}
