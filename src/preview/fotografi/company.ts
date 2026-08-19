import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for fotografi. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'fotografi',
    route: '/preview/fotografi',
    name: 'Fótógrafí',
    sector: 'Ljósmyndavöruverslun og gallerí',
    location: 'Skólavörðustígur 22, Reykjavík',
    region: 'Capital',
    established: 'Frá 2007',
    currentUrl: 'https://www.fotografi.is',
    ownerEmail: 'fotografi.iceland@gmail.com',
    concept: 'Framköllun',
    conceptTagline:
      'A tiny red shop of vintage cameras and vinyl, told the way a photograph reveals itself in the developer tray.',
    accent: '#B23327',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1563298258-c9b0371b55cc?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '19 years in the same spot near Hallgrímskirkja, "the first of its kind in Iceland"',
        'A genuinely unique inventory: 300+ vintage cameras on the walls, a 1960s-80s vinyl collection, fine-art prints',
        'Owner-run by Ari Sigvaldason, a well-known independent story (left a 15-year career at RÚV to open it)',
      ],
      weaknesses: [
        'Dated Squarespace-era template that undersells a genuinely one-of-a-kind shop',
        'Reviewers report a buggy checkout that fails and needs retrying, a direct, quantifiable loss of print sales',
        'No real sense of the 300-camera wall or the atmosphere before visiting',
      ],
      opportunities: [
        "Let the shop's own atmosphere (cameras, vinyl, red walls) carry the design instead of a generic template",
        'Fix the actual thing costing them money: a smooth, working print-checkout flow',
        "Tell Ari's story, it is a strong, human reason to visit",
      ],
    },
    positioning:
      "One of Reykjavík's most singular little shops, undersold by a template site with a broken checkout. The site should feel like the shop itself: a print slowly resolving out of the developer tray.",
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Fótógrafí',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég kynnti mér Fótógrafí og fannst búðin einstök, gömlu myndavélarnar á veggjunum, vínylsafnið og prentin sem þið seljið. Þið hafið verið á sama stað við Skólavörðustíg í tæp tuttugu ár, sem er sjaldgæft og verðskuldar meira en núverandi vefsíða sýnir. Sumir sem hafa reynt að kaupa prent í gegnum síðuna segja að greiðsluferlið klikki og þurfi að reyna aftur, sem þýðir að þið eruð líklega að missa af sölu án þess að vita af því.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að búðin sjálf, andrúmsloftið og sagan þín, fái að vera í forgrunni, og að fólk geti keypt prent án vandræða. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
