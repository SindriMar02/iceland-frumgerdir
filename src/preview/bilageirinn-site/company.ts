import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for bilageirinn. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'bilageirinn',
    route: '/preview/bilageirinn',
    name: 'Bílageirinn',
    sector: 'Auto body & service shop',
    location: 'Reykjanesbær',
    region: 'Reykjanes',
    established: 'Est. 2003',
    currentUrl: 'https://www.bilageirinn.is',
    ownerEmail: 'bilageirinn@bilageirinn.is',
    concept: 'True Line',
    conceptTagline:
      'Aviation-trained precision for everyday cars. Night-shift workshop cinema: one amber line drawn back into place.',
    accent: '#E8A23D',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Founder is a certified master aircraft mechanic — a rare, ownable precision story',
        'Purpose-built 810 m² facility (2007), Toyota + Kia authorized service',
        'CABAS assessment + partnerships with every Icelandic insurer, loaner car during repairs',
      ],
      weaknesses: [
        'Homepage hero is a dead Adobe Flash slider — visitors see an install prompt',
        'Zero responsive design: no viewport meta, no media queries, fixed 960px on black',
        'Misspelled <title>, empty meta description, a primary nav page with no content',
      ],
      opportunities: [
        'Tell the aircraft-tolerances story the current site buries on a staff list',
        'Turn the CABAS insurance-claim flow + loaner car into a clear customer journey',
        'Trivially beat the SEO baseline (empty meta, 2010-era WordPress theme)',
      ],
    },
    positioning:
      'A manufacturer-certified body shop whose entire value is precision — served today by a site that literally asks for Flash Player. The redesign translates real aviation-grade rigor into a calibration-instrument visual language.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Bílageirann',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég rakst á söguna ykkar og heillaðist alveg. Björn Steinar er meistari í flugvélavirkjun og byggði verkstæðið upp frá grunni, alla leið upp í sérhannað 810 fermetra húsnæði í Grófinni. Þið eruð með viðurkennda þjónustu fyrir Toyota og Kia og vinnið með öllum tryggingafélögum landsins. Svona bakgrunn og natni sér maður ekki oft.

Því miður finnst mér núverandi vefsíða ekki alveg gera þessari sögu skil. Forsíðan biður gesti enn um að setja upp Flash Player, sem hefur ekki virkað í neinum vafra síðan 2020, og hún virkar illa í síma.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sem lendir í tjóni finni ykkur fljótt, sjái strax hvað þið standið fyrir og geti haft samband án fyrirhafnar. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
