import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for fjorubordid. Kept in this folder so the
 * preview route only ever ships its own company data ([[preview-link-isolation]]).
 *
 * REFERENCE: the MELLOW shot, measured in _docs/mellow-reference-teardown.md,
 * re-aimed at Fjöruborðið in its last section. Tokens in
 * _docs/design/fjorubordid-DESIGN.md.
 *
 * VERIFIED 2026-09-05 (re-check before sending): kt 6301131560, Pétur Viðar
 * Kristjánsson, Eyrarbraut 3a, 825 Stokkseyri, info@fjorubordid.is,
 * 483 1550. WordPress. No h1 on any page except the 404 template. Largest
 * image on the homepage is 450px wide while the 4722px originals sit on
 * their own server. The menu IS real HTML with prices (kept). Booking and
 * gift certificates already run on Dineout (kept, never pitched against).
 * No annual accounts on file yet: nothing is quoted anywhere in this file.
 */
export const companyEntry: PreviewCompany = {
  slug: 'fjorubordid',
  route: '/preview/fjorubordid',
  name: 'Fjöruborðið',
  sector: 'Veitingahús',
  location: 'Stokkseyri',
  region: 'South',
  established: 'Leturhumar síðan 1995',
  currentUrl: 'https://www.fjorubordid.is',
  ownerEmail: 'info@fjorubordid.is',
  concept: 'Ein panna, fjórar þyngdir',
  conceptTagline:
    'The most famous langoustine soup in the republic, told the way their own photographs already tell it: a dark timber room at the sea wall where the only light is the food.',
  // Their logo red, sampled from the SVG they publish.
  accent: '#ec3c20',
  dark: true,
  status: 'Concept ready',
  thumb: `${import.meta.env.BASE_URL}fjorubordid/hero-humar.jpg`,
  ownPhotography: true,
  audit: {
    strengths: [
      'A dish people drive 45 minutes for, priced by weight: a menu grammar nobody else has',
      'Their own photography is strong and the 4722px originals exist on the server',
      'The soup story is real copy with a voice; the menu is real HTML with prices',
      'Booking and gift certificates already work on Dineout',
    ],
    weaknesses: [
      'No h1 on any page except the 404 template',
      'The homepage serves its largest photograph at 450px wide',
      'The hero says nothing about the food; the famous line is buried in a text page',
      'Hours, last booking time and the booking link are three clicks apart',
    ],
    opportunities: [
      'Lead with the langoustine at full resolution and the four weights as the page\'s own device',
      'Give the soup story the pace its copy asks for',
      'Put hours, last booking and the Dineout action in one block on the first page',
    ],
  },
  positioning:
    'A destination restaurant with one signature dish and copy worth reading, currently presented at 450 pixels. The redesign turns their own material up, changes nothing about how they take bookings, and gives Google an h1 for the first time.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Fjöruborðið',
    body: `Sæl og blessuð,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús og ferðaþjónustu.

Ég sat yfir vefnum ykkar í gær. Setningin ykkar um frægustu humarsúpu lýðveldisins er sú besta sem ég hef séð á íslenskum veitingavef, og það að humarinn sé borinn fram eftir þyngd er matseðill sem enginn annar á. Hvorugt sést þó á forsíðunni eins og hún er í dag.

Tvennt annað rak ég augun í. Myndirnar af matnum birtast í 450 punkta breidd þó að frummyndirnar á vefþjóninum ykkar séu 3.728 punktar á kant, svo maturinn kemst aldrei almennilega til skila. Og engin síða á vefnum er með aðalfyrirsögn, sem er það fyrsta sem Google les til að skilja um hvað síðan fjallar.

Ég settist því niður og hannaði frumgerð að nýrri forsíðu, alfarið úr ykkar eigin myndum og ykkar eigin texta. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding. Hana má skoða hvenær sem er, og hún virkar vel í síma:

[HLEKKUR Á FRUMGERÐ]

Humarinn er efstur í fullri upplausn, þyngdirnar fjórar standa saman á einum stað með verðunum, og sagan af súpunni fær að rúlla á sínum hraða þegar skrunað er niður. Borðapantanir og gjafabréf fara áfram í gegnum Dineout eins og núna, ég hrófla ekki við því sem virkar hjá ykkur.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta gefi ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
  },
}
