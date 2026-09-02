import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for tryggvaskali. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 *
 * TRANSPLANT SOURCE: Caffè Paszkowski (caffepaszkowski.com), see
 * /Users/sindri/Documents/Website redesign mockups/_docs/caffe-paszkowski-teardown.md
 * section 9 for the full re-aim map. Every client fact below is sourced from
 * either the task's VERIFIED CLIENT FACTS or teardown section 9 (each of
 * which cites tryggvaskali.com pages, fetched 2026-09-02). Nothing here is
 * invented: prices, dish names, team, and any date beyond 1890/1891 are
 * UNKNOWN and stay out of this file.
 *
 * WHY: a genuinely popular, long-running destination restaurant (1,133
 * TripAdvisor reviews, the highest of any candidate researched for this
 * client) sitting in the first house ever built in Selfoss, right beside the
 * Ölfusá bridge — but the story is told through a dated site that still
 * hands the menu over as a PDF instead of a page.
 * CUSTOMER: Selfoss locals and South Coast travellers deciding where to eat
 * on the ring road.
 */
export const companyEntry: PreviewCompany = {
  slug: 'tryggvaskali',
  route: '/preview/tryggvaskali',
  name: 'Tryggvaskáli',
  sector: 'Veitingahús',
  location: 'Selfoss',
  region: 'South',
  established: 'Húsið frá 1890',
  currentUrl: 'https://tryggvaskali.is',
  ownerEmail: 'tryggvaskali@tryggvaskali.is',
  concept: 'Áin, húsið, birtan',
  conceptTagline:
    'The first house in Selfoss, 1890, beside the Ölfusá bridge — warmth and heritage, elevated brunch and dinner told the way 1,133 reviews already tell it.',
  // Reference's own measured primary accent (brass, hover-only), teardown
  // section 1.1 / 8: #b27b00. Kept literally, it happens to suit an old
  // riverside house as well as it suited a 1903 Florentine café.
  accent: '#b27b00',
  // The reference's hero is a greyscale video sitting on a near-black scrim
  // (`--colNero`/`#0c0c0c`, header scrim, teardown 4.1 H1) — the hero itself
  // is dark even though the page's total painted area is paper-majority.
  dark: true,
  status: 'Concept ready',
  thumb: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
  audit: {
    strengths: [
      'The first house built in the town of Selfoss, 1890, standing right beside the Ölfusá bridge',
      '1,133 TripAdvisor reviews, the highest review count of any candidate researched for this client — a genuine destination, not an unknown',
      'Brunch and dinner both already running, with an existing booking flow (EasyTable) and gift certificate sale (Smartcard) in place',
    ],
    weaknesses: [
      'Menus are handed over as PDF downloads, not a page a phone can read at the table',
      'The house\'s own real story, the 1890 building and the 1891 bridge, is buried instead of leading the site',
      'The site prints two different street addresses on its own pages, which reads as neglect before a guest even arrives',
    ],
    opportunities: [
      'Lead with the house and the river: one clean hero, one true history section, told only in facts that are actually published',
      'Turn the PDF menus into a real, scannable menu page in Icelandic and English',
      'Keep the booking and gift-certificate flows the client already has (EasyTable, Smartcard), just presented as native to a site that finally looks like the restaurant deserves',
    ],
  },
  positioning:
    'Tryggvaskáli already has what most restaurants spend years building: the first house in Selfoss, a river and a bridge outside the window, and over a thousand reviews. The current site hides all three behind a dated layout and PDF menus. The redesign leads with the 1890 house and the Ölfusá, turns the menu into a real page, and keeps the booking and gift-certificate flows the client already trusts, just inside a site that finally matches the place.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Tryggvaskála',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús og ferðaþjónustu.

Tryggvaskáli er einmitt svona staður sem fólk man eftir. Fyrsta húsið sem byggt var á Selfossi, beint við Ölfusárbrúna, og yfir þúsund umsagnir á TripAdvisor sem staðfesta það. Mér fannst núverandi vefsíðan samt ekki gera þessari sögu nógu hátt undir höfði. Matseðlarnir eru einungis birtir sem PDF skjöl, sem er óþægilegt í síma, og sagan af húsinu sjálfu kemst hvergi að.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Húsið og áin fá að njóta sín efst, sagan frá 1890 fær sitt eigið pláss, og matseðillinn verður alvöru síða í stað PDF skjals. Borðapöntun og gjafabréf haldast nákvæmlega eins og þau eru í dag, bara innan í síðu sem loksins lítur út eins og staðurinn sjálfur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
  },
}
