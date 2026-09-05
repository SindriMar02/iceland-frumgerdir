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
  /* REWRITTEN 2026-09-05, after re-fetching tryggvaskali.com immediately
     before drafting (rule 0 of [[outreach-email-guide]]). The previous draft
     told the owner their menus were "einungis birtir sem PDF skjöl". They are
     not PDFs: tryggvaskali.com/matsedill publishes the menu as PNG IMAGES
     (is-menu-1-1-1024x724.png and two more, plus English versions) and the
     brunch menu as a JPG. Telling an owner a checkable fact about their own
     site and getting it wrong is the Fisk Kompaní failure. The observation
     now states the symptom they can verify on their own phone in five
     seconds, per rule 12.
     Also removed: "yfir þúsund umsagnir á TripAdvisor", a count with no dated
     proof taken today, and the closer "Endilega heyrið í mér ef þetta kveikir
     í ykkur", which rule 6 bans outright. */
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Tryggvaskála',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús og ferðaþjónustu.

Tryggvaskáli er hús sem fólk þekkir strax, fyrsta húsið sem reist var á Selfossi og stendur enn við Ölfusá. Ég skoðaði vefinn ykkar og rak augun í eitt: matseðillinn er birtur sem myndir. Í síma þarf að þysja inn til að lesa hann, og af því að þetta eru myndir en ekki texti finnst hann ekki þegar fólk leitar að mat eða brunch á Selfossi.

Mér fannst það synd fyrir stað með þessa sögu, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Sagan frá 1890 fær sitt eigið pláss, matseðillinn verður lesanlegur texti í stað mynda, og borðapöntunin ykkar hjá EasyTable helst nákvæmlega eins og hún er. Ég notaði ykkar eigin myndir, líka gömlu ljósmyndina af brúnni. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ég smíðaði líka lítið kerfi sem heitir Eldhús, fyrir innra eftirlitið sem heilbrigðiseftirlitið kallar eftir. Í stað þess að fylla út blöðin í möppunni skráir starfsfólkið hitastig, vörumóttöku og þrif í símann á nokkrum sekúndum, allt er á einum stað þegar eftirlitið kemur, og kerfið lætur vita þegar kælir er hægt og rólega að hlýna, áður en hann gefur sig um helgi. Ég set mynd af yfirlitinu með.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur. Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
  },
}
