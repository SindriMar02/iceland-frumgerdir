import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for alrun. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'alrun',
  route: '/preview/alrun',
  name: 'Alrún Nordic Design',
  sector: 'Skartgripir & ull',
  location: 'Sundaborg 1, 104 Reykjavík',
  region: 'Capital',
  established: 'Bindrúnir í silfri, gulli og íslenskri ull',
  currentUrl: 'https://alrun.is',
  ownerEmail: 'info@alrun.is',
  concept: 'Twelve marks, one alphabet',
  conceptTagline:
    'Alrún’s twelve trademarked bindrunes are treated as a type specimen rather than a jewelry boutique: a bone-and-ink alphabet chart where their own artwork is the design system, and choosing a mark reveals its meaning and the real pieces that carry it.',
  accent: '#A33A2B',
  dark: false,
  status: 'Concept ready',
  thumb: 'https://cdn.shopify.com/s/files/1/1999/0377/files/Alrun_14K_gold_plated_necklace_Bindrune_Love.jpg?v=1760127384',
  photoCredit:
    'Myndir og tákn eru af vef og vefverslun Alrúnar sjálfrar (alrun.is og store.alrun.is).',
  audit: {
    strengths: [
      'A genuinely distinctive brand asset: twelve original, trademarked bindrune symbols that work as a complete visual language across jewelry, capes, blankets and cushions',
      'A live, actively maintained Shopify catalogue with real prices, plus strong 2025 studio photography for the gold-plated pendant line and the wool pieces',
      'Real craft credentials: .925 sterling silver, rhodium and 14K gold plate, a Reykjavík studio, and a listing in the official Handverk og hönnun directory',
    ],
    weaknesses: [
      'Two disconnected properties: a marketing site (alrun.is) and a Shopify store (store.alrun.is) with different design, navigation and even different brand names (Nordic Jewelry vs Nordic Design)',
      'The footer claims a 1999 copyright although the company kennitala decodes to a 2004 registration, and the store footer separately shows a stale 2025 date',
      'A hardcoded 560x315 autoplaying YouTube embed that breaks on mobile, legacy 2016 to 2017 product photography beside the new 2025 shots, a leftover copy-of-strength-charm-pendant URL and unfinished copy on product pages',
    ],
    opportunities: [
      'Make the twelve symbols the whole interface, so the catalogue reads as one language instead of a product list',
      'Unify the marketing site and the shop into a single storefront with one canonical brand name',
      'Lead with the maker and the craft, which the current About page omits entirely',
    ],
  },
  positioning:
    'Alrún owns something most jewelry brands never get: a complete, trademarked visual alphabet of twelve bindrunes, already carried across silver, gold plate and Icelandic wool. Today that language is split across a dated marketing site and a separate Shopify store, with an implausible 1999 copyright and 2016-era photos sitting beside strong 2025 studio work. The redesign treats the twelve marks as a type specimen, a bone and ink alphabet chart where choosing a symbol reveals its meaning and the real pieces that carry it, with every price and link going to their own shop.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Alrúnu',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk vörumerki.

Ég kynnti mér Alrúnu og það sem stóð upp úr voru táknin sjálf. Tólf bindrúnir, hver með sína merkingu, sem ganga í gegnum allt sem þið gerið, bæði skartið og ullina. Það er sérstaða sem fá vörumerki eiga.

Í dag skiptist vefurinn hins vegar í tvennt, kynningarsíðu og sérstaka vefverslun, með ólíku útliti og meira að segja ólíku nafni, Alrún Nordic Jewelry á öðrum og Alrún Nordic Design á hinum. Myndbandið á forsíðunni er fast í 560 punkta breidd og fer sjálfkrafa í gang, sem virkar illa í síma. Og táknin tólf, sem eru kjarninn í öllu, fá hvergi að vera aðalatriðið.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Hún notar ykkar eigin tákn og ykkar eigin myndir, og verðin koma beint úr vefversluninni ykkar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Táknin tólf eru sett fram eins og stafróf, þar sem hægt er að velja tákn og sjá strax merkinguna, myndina af gripnum sem ber það og verðið. Allt á einum stað í stað þess að skiptast á tvo vefi.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
  },
}
