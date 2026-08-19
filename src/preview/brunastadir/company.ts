import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for brunastadir. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'brunastadir',
    route: '/preview/brunastadir',
    name: 'Brúnastaðir',
    sector: 'Farmhouse cheese',
    location: 'Fljót, Skagafjörður',
    region: 'North',
    established: 'Verðlaunabú 2025',
    currentUrl: 'https://brunastadir.is',
    ownerEmail: 'brunastadir@brunastadir.is',
    concept: 'The Rind Library',
    conceptTagline: 'Iceland’s only farm-made cheese, shown like a terroir archive — Brúnó on the plate, the closed loop as proof.',
    accent: '#8A4B22',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1654184729393-e9d3b8c589c5?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'The only farm in Iceland making cheese on its own land',
        'Won the Icelandic Agricultural Award 2025; Embla Nordic nomination',
        'A genuinely unique closed-loop product — Brúnó, washed in local IPA',
      ],
      weaknesses: [
        'Stock WordPress with tiny, compressed product thumbnails',
        'No storytelling for a one-of-a-kind product',
        'Awards and the farm story are buried or absent',
      ],
      opportunities: [
        'Present each cheese like a labelled specimen with real photography',
        'Tell the pasture-to-wheel closed loop no supermarket can',
        'Surface the awards and bring farm-shop visitors in',
      ],
    },
    positioning:
      'A national-award farmhouse cheese deserves more than thumbnail soup. Treat the cheese as the hero and the provenance as the proof.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Brúnastaði',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í matvælaframleiðslu.

Ég kolféll fyrir því sem þið gerið á Brúnastöðum, eina býlinu á Íslandi sem framleiðir ost á eigin landi, og óska ykkur til hamingju með Búnaðarverðlaunin. Það eina sem ég staldraði við var vefsíðan, því myndirnar af ostunum eru mjög smáar og sagan á bak við vöruna kemst ekki til skila.

Mér fannst það synd fyrir svona einstaka vöru, svo ég settist niður og hannaði frumgerð að nýrri forsíðu þar sem hver ostur fær að njóta sín og leiðin frá haga til hjóls er sögð. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn, en ef ykkur líst vel á gæti ég klárað vefinn í heild. Ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
