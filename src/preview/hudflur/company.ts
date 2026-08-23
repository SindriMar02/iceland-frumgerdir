import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for hudflur. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'hudflur',
    route: '/preview/hudflur',
    name: 'Húðflúrstofa Norðurlands',
    sector: 'Húðflúrstofa',
    location: 'Gránufélagsgata 4, Akureyri',
    region: 'North',
    established: 'Frá 2011',
    currentUrl: 'https://www.facebook.com/hudflurstofanordurlands/',
    ownerEmail: 'hudflur@hudflur.net',
    concept: 'Fine Line',
    conceptTagline:
      'Fifteen years of steady hands in Akureyri, told as one continuous ink line drawn the length of the page.',
    accent: '#C22A2E',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '15 years operating in Akureyri with a loyal following',
        '256 Facebook reviews at 88% recommend, an unusually strong track record for a single studio',
        'Active, engaged Instagram (2,300+ followers)',
      ],
      weaknesses: [
        'No website at all — everything lives on Facebook/Instagram',
        'No way to see the studio, browse styles or request a booking without DMing',
        'Zero presence in Google search for "tattoo Akureyri"',
      ],
      opportunities: [
        'A clean, modern one-page site that finally gives 15 years of reputation a proper home',
        'A simple style/service overview so people arrive knowing what to ask for',
        'A direct booking-request path instead of cold DMs',
      ],
    },
    positioning:
      'Fifteen years of real work and an 88% recommend rate deserve more than a Facebook wall. The site should feel as considered and modern as the studio itself: dark, confident, understated.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Húðflúrstofu Norðurlands',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég rakst á Húðflúrstofu Norðurlands og sá að þið hafið verið starfandi á Akureyri í hátt í fimmtán ár, með frábærar umsagnir og virkan hóp fylgjenda á samfélagsmiðlum. Því miður fann ég enga vefsíðu, aðeins Facebook og Instagram, sem þýðir að fólk sem leitar að húðflúrstofu á Akureyri gæti auðveldlega misst af ykkur.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að vefsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk finni ykkur á netinu, sjái hvað þið bjóðið upp á og geti haft samband án fyrirhafnar. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
