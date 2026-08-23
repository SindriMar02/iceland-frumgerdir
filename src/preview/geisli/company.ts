import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for geisli. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'geisli',
    route: '/preview/geisli',
    name: 'Gleraugnasalan Geisli',
    sector: 'Optician',
    location: 'Akureyri',
    region: 'North',
    established: 'Est. 1967',
    currentUrl: 'https://gleraugu.is',
    // gleraugu@internet.is is from the 2019 archived site footer (site now dead) — may
    // bounce; verified phones: 462 1555 (Kaupangur). A "463 1455 Glerártorg" (2019 archive)
    // and "569 1100" (directory) exist but are unverified — not used anywhere.
    ownerEmail: 'gleraugu@internet.is',
    concept: 'Gleraugu eru skart',
    conceptTagline:
      'Their own old tagline taken seriously: frames presented like jewelry, and the page performs the moment sight snaps into focus.',
    accent: '#1F5C4D',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1540162875225-3f6b56d69fe8?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Family-run on Akureyri since 1967 — third generation, rare local trust',
        'Two locations (Kaupangur and Glerártorg) with a real optometry service',
        'A charming vintage logo and their own memorable tagline: Gleraugu eru skart',
      ],
      weaknesses: [
        'gleraugu.is is down entirely (HTTP 500) — customers find nothing at all',
        'The site was last maintained around 2016; no booking, no hours, no frames online',
        'Only findable contact is a phone number buried in directories',
      ],
      opportunities: [
        'A working site with hours, locations and panta-tíma is an instant leap from zero',
        'Frames-as-jewelry presentation nobody in the region does',
        'The 60-year, three-generation story is unused emotional gold',
      ],
    },
    positioning:
      'A beloved 59-year-old family optician whose website literally does not load. The redesign takes their own old tagline — Gleraugu eru skart — seriously: eyewear presented like jewelry, wrapped in the story of three generations helping Akureyri see clearly.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Geisla',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég kynnti mér söguna ykkar og fannst hún einstök. Gleraugnasala í fjölskyldunni á Akureyri síðan 1967, komin á þriðju kynslóð, með verslanir bæði í Kaupangi og á Glerártorgi. Svona rótgróið traust í heimabyggð er sjaldgæft.

Því miður rakst ég á að vefsíðan ykkar, gleraugu.is, opnast ekki lengur. Þar birtist bara villa, þannig að fólk sem leitar að ykkur á netinu finnur hvorki opnunartíma né getur pantað tíma í sjónmælingu.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk finni ykkur á netinu, sjái hvenær er opið og geti pantað tíma án fyrirhafnar, og að umgjarðirnar fái að njóta sín eins og skartið sem þær eru. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
