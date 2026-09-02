import type { PreviewCompany } from '../company-types'

/**
 * Private brief + outreach copy for Nollur. Kept in this folder (not in the
 * shared catalogue) so the preview route only ever ships its own company
 * data, see [[preview-link-isolation]].
 *
 * The owner is Swiss (Nollur ehf. is a company of Esja Holding AG, their own
 * contact page). Everything client-facing is English with German second.
 * Never Icelandic.
 */
export const companyEntry: PreviewCompany = {
  slug: 'nollur',
  route: '/preview/nollur',
  name: 'Nollur ehf.',
  sector: 'Orlofshús',
  location: 'Nollur, Eyjafjörður, 601 Akureyri',
  region: 'North',
  established: 'Hrafnabjörg byggt 2006, Súlur og Krýsuvík 2009, Leifsstaðir keypt 2014, Laugaland 2025',
  currentUrl: 'https://www.nollur.is',
  ownerEmail: 'info@nollur.is',
  concept: 'Across the fjord',
  conceptTagline:
    'Nine houses on one fjord, sold today through a page whose largest photograph is 500 pixels wide. The prototype walks the fjord sideways: the wordmark stands behind the glass villa with its materials tagged on the house, three places open one at a time, and the materials the owner lists (walnut, shale, glass, ReVoX) become the page\'s own vocabulary.',
  accent: '#7A4E2E',
  dark: false,
  status: 'Concept ready',
  thumb: 'https://www.nollur.is/wp-content/uploads/2020/05/HRAFNABJ%C3%96RG_AKUREYRI_thumbnail.jpg',
  ownPhotography: true,
  photoCredit:
    'Photography: the owner\'s own published images (nollur.is uploads by Reto Kuhn, Vrbo and Expedia galleries). Facts and quoted copy from nollur.is.',
  audit: {
    strengths: [
      'Nine units across three places on Eyjafjörður, from a 280 m² villa to 50 m² farm houses, all one operator',
      'Hrafnabjörg is rated 9.8 from 268 reviews on Vrbo and Leifsstaðir 9.8 from 210; Reto Kuhn\'s 2560px photographs already sit in their WordPress uploads',
      'Real differentiators nobody else can claim: a villa directly opposite Akureyri, live cameras on every house, 360° panoramas of the fjord',
    ],
    weaknesses: [
      'The homepage shows each house at 500 pixels wide with four numbers under it; the 2560px originals are uploaded but never displayed',
      'Every "Book" button hands the guest to Vrbo or Expedia, so the two villas rank under Vrbo\'s keyword titles rather than the brand',
      'No German version although the owner is Swiss and the guests are largely German-speaking; no way to enquire but one address and a form',
    ],
    opportunities: [
      'Let the architecture carry the site: the glass villa, the walnut, the shale, the ReVoX equipment the owner already lists',
      'Bilingual EN + DE with per-house pages and schema, so "villa Akureyri" belongs to nollur.is, not to Vrbo',
      'Request-to-book on their own domain with iCal from Vrbo and Expedia, keeping the commission on repeat guests',
    ],
  },
  positioning:
    'Privacy with the town in view. Hrafnabjörg sits directly opposite Akureyri across the water; you see the whole town and it does not see you. Nine houses run with Swiss precision, sold through one page of small photographs and outbound booking links. The prototype makes the fjord the structure: a sideways walk from the villa opposite the town, to the shore at Grenivík, to the farm at Nollur.',
  outreach: {
    subject: 'A design idea for nollur.is',
    body: `Hello,

My name is Sindri and I design websites for places to stay in Iceland.

I came across Nollur while looking at houses on Eyjafjörður and stopped at Hrafnabjörg: a glass villa directly opposite Akureyri that guests rate 9.8 from 268 stays. On nollur.is that house, and the other eight, appear at 500 pixels wide with four numbers underneath, while Reto Kuhn's full-size photographs sit unused in the uploads. Every "Book" button sends the guest to Vrbo or Expedia.

So I built a prototype of a new nollur.is. It costs nothing and carries no obligation.

You can open it here, and it works on a phone:
[PROTOTYPE LINK]

It walks the fjord sideways: the villa opposite the town, the three houses on the shore at Grenivík, the four on the farm. The materials you list yourselves, walnut, shale, glass and ReVoX, become the page's own vocabulary. A German version is included; switch it in the top right.

Search is the other half. Today "villa Akureyri" belongs to Vrbo's titles rather than to nollur.is. The prototype carries the structured data and per-house pages that let Google and the AI assistants answer with your own site.

If you like it, I can finish the whole site, including request-to-book on your own domain with the Vrbo and Expedia calendars kept in sync. If not, I hope you enjoy looking at the idea.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
