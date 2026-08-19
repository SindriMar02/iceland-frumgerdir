import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for prentverk. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'prentverk',
    route: '/preview/prentverk',
    name: 'Prentverk Selfoss',
    sector: 'Print shop',
    location: 'Selfoss, South Iceland',
    region: 'South',
    established: 'Est. 2009',
    currentUrl: 'https://www.pvs.is',
    ownerEmail: 'pvs@pvs.is',
    concept: 'Yfirprent',
    conceptTagline:
      'A two-colour print house on paper. Spot red over ink black, real local jobs, proof-sheet order.',
    accent: '#D1232A',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Active, registered company (statements filed through 2025) with a real local client base',
        'The old site showcased genuine community work: club papers, event brochures, cards',
        'A real two-colour brand already exists: print red #D1232A + ink black #231F20',
      ],
      weaknesses: [
        'pvs.is is now an empty default WordPress install — a "Hello world!" post since January',
        'The whole portfolio, services and contact story vanished with the old site',
        'Zero search presence: no description, no services, nothing for Google to index',
      ],
      opportunities: [
        'Restore the portfolio the Wayback archive proves they had, properly staged',
        'Own "prentun Selfoss / Suðurland" search — the local field is wide open',
        'A simple quote-request flow for the jobs they already do daily',
      ],
    },
    positioning:
      'A working South-Iceland print shop whose website is literally a blank sheet — the redesign puts their real, community-rooted jobs back on paper with the confidence of their own red-and-black mark.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Prentverk Selfoss',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég kynnti mér verkin ykkar í gegnum árin og hreifst af þeim. Félagsblöð eins og Litli Bergþór, flugeldablaðið fyrir björgunarsveitina, nafnspjöld og jólakort fyrir fyrirtæki og félög um allt Suðurland. Svona samstarf við heimabyggðina í yfir áratug er ekki sjálfgefið.

Því miður rakst ég á að núverandi vefsíða, pvs.is, sýnir þessa sögu ekki lengur. Þar tekur nú á móti manni sjálfgefin WordPress uppsetning með einni færslu frá því í janúar, og allt sem áður sýndi verkin ykkar er horfið.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fyrirtæki og félög á Suðurlandi finni ykkur á Google, sjái hvað þið prentið og geti sent fyrirspurn beint. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
