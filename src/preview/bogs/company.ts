import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for bogs (B&S Restaurant, Blönduós). Kept in
 * this folder (not in the shared catalogue) so the preview route only ever
 * ships its own company data — see [[preview-link-isolation]].
 *
 * This is a 1:1 TRANSPLANT of studenterkilden.dk's design system, re-aimed at
 * B&S's real published content. See the master teardown for every number:
 * /Users/sindri/Documents/Website redesign mockups/_docs/studenterkilden-teardown.md
 * section 9 (re-aim map) is the source for every fact below. Nothing about
 * B&S beyond that section is stated as fact anywhere in this file.
 */
export const companyEntry: PreviewCompany = {
  // WHY: a real, warm ring-road family restaurant and café since 2007, with a
  // genuine group-menu and coach-tour business and a themed hall
  // (Eyvindarstofa) with meeting facilities, sitting on a bare Google Sites
  // page with no photography, no logo and conflicting opening hours.
  // CUSTOMER: ring-road travellers, coach tours and Blönduós locals.
  slug: 'bogs',
  route: '/preview/bogs',
  name: 'B&S Restaurant',
  sector: 'Veitingahús',
  location: 'Norðurlandsvegur 4, Blönduós',
  region: 'Northwest',
  established: 'Síðan 2007',
  currentUrl: 'https://bogs.is',
  ownerEmail: 'info@bogs.is',
  concept: 'Áningarstaður á hringveginum',
  conceptTagline:
    'A family restaurant and café on the ring road at Blönduós since 2007, warm and unpretentious, told the way it actually is instead of a bare Google Sites page.',
  // Studenterkilden's actual primary accent, section 1.1 of the teardown.
  // The B&S brand colours are UNKNOWN, so this transplant keeps the reference's
  // own values rather than inventing a "B&S orange".
  accent: '#ebbf7d',
  // The reference's hero is text-then-photo on a light paper ground (#fdfdfd),
  // not a dark hero — see teardown 4.1. dark:false is correct here.
  dark: false,
  status: 'Concept ready',
  thumb: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
  audit: {
    strengths: [
      'A real, long-running ring-road stop since 2007 with a genuine group and coach-tour business',
      'A themed hall, Eyvindarstofa, with its own meeting facilities (wifi, projectors) nobody else on this stretch of road has',
      '260 TripAdvisor reviews, an actual trust signal the current site does nothing with',
    ],
    weaknesses: [
      'A bare Google Sites page: no photography, no logo, no sense of the place at all',
      'Opening hours conflict between the site itself (09:00 to 21:00) and TripAdvisor (11:00 to 21:00), unresolved',
      'The group menus, coach offering and Eyvindarstofa are buried in a flat nav with no story or pricing',
    ],
    opportunities: [
      'A warm, photograph-led home page that actually shows the building, the food and the road',
      'A dedicated page for group and coach bookings, the business bogs.is undersells the most',
      'Surface Eyvindarstofa as its own destination for meetings and themed groups instead of one nav link',
    ],
  },
  positioning:
    'B&S already does the hard part: a real ring-road restaurant since 2007 with breakfast, pizza, burgers, group menus and a themed hall for meetings. None of that shows on a bare Google Sites page. The redesign gives it a real home page, a food page, a group and coach page, and its own page for Eyvindarstofa, built only from what B&S has actually published.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir B&S Restaurant',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús og ferðaþjónustu.

Ég rakst á B&S Restaurant á hringveginum í Blönduósi og sá að þið hafið verið að reka staðinn síðan 2007, með morgunverði, pizzum, hamborgurum, hópamatseðlum fyrir rútuhópa og meira að segja eigin þemasal, Eyvindarstofu, með fundaraðstöðu. Núverandi vefsíðan ykkar er hins vegar bara einföld Google Sites síða, engar myndir, ekkert merki og opnunartímarnir stangast á milli síðunnar sjálfrar og TripAdvisor.

Mér fannst það synd því sagan ykkar á hringveginum er sterk, svo ég settist niður og hannaði frumgerð að nýrri forsíðu, þar sem staðurinn, maturinn og Eyvindarstofa fá almennilegt pláss. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
  },
}
