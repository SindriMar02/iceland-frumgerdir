import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for ljomalind. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'ljomalind',
    route: '/preview/ljomalind',
    name: 'Ljómalind Local Market',
    sector: 'Farmers & artisan co-op market',
    location: 'Brúartorg 4, 310 Borgarnes',
    region: 'West',
    established: 'Síðan 2013',
    currentUrl: 'https://www.ljomalind.is',
    ownerEmail: 'ljomalind@ljomalind.is',
    concept: 'Beint frá héraðinu',
    conceptTagline:
      'Every shelf on the market floor becomes a small map back to the farm or workshop that made it, wool, cheese, honey and pottery from real West Iceland producers, replacing a domain that today loads nothing but a bare hosting placeholder.',
    accent: '#C4472A',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1595279521754-4b0f9a6bb10b?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A 13-year-old market, opened 17 May 2013, run as a genuine co-op of around 70 local West Iceland producers selling wool, cheese, honey, pottery and preserves',
        'A 4.0 out of 5 rating on TripAdvisor from 40 reviews, with dated 2025 visitor reviews still praising the real local products',
        'Confirmed active today on West Iceland’s own tourism directories, west.is and ferdalag.is, and on já.is, all showing matching daily 10:00 to 18:00 hours',
      ],
      weaknesses: [
        'Their own domain, ljomalind.is, loads nothing but a bare hosting-provider placeholder, and the older /en/ path now returns a 404',
        'No product or vendor showcase anywhere online despite around 70 real producers selling inside the market',
        'No booking or contact form on the owned domain, so all the real traffic value from TripAdvisor and the tourism boards dead-ends at a page with no content',
      ],
      opportunities: [
        'Replace the placeholder with a warm, photo-led site that shows the market’s real shelves and the producers behind them',
        'Turn the wall of hand-dyed wool, the Alrún capes and the jars of jam into a proper, browsable product index',
        'Capture the tourist traffic already pointed at Ljómalind by west.is and TripAdvisor with a real destination instead of a dead end',
      ],
    },
    positioning:
      'Ljómalind is a 13-year-old co-op market in Borgarnes where around 70 West Iceland producers sell wool, cheese, honey, pottery and preserves under one roof, rated 4.0 on TripAdvisor and still listed as active on every regional tourism directory. Its own domain, ljomalind.is, currently loads nothing but a generic hosting placeholder, so none of that real activity is visible anywhere the business actually controls. The redesign turns the market’s real shelves into a living index of its producers, the same wall of wool and jam a visitor sees walking through the door, so the market finally has a front door of its own online.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Ljómalind',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenskar verslanir og ferðaþjónustu.

Ég kynnti mér Ljómalind og sá að þið seljið vörur frá tugum framleiðenda í héraðinu, ull, osta, hunang, leirmuni og sultur, og eruð með 4,0 í einkunn á TripAdvisor. Samt er heimasíðan ykkar, ljomalind.is, í dag aðeins auð biðsíða frá hýsingaraðila, þannig að ekkert af þessu sést á ykkar eigin vef.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái hillurnar ykkar eins og þær eru í alvörunni, fullar af vörum frá alvöru framleiðendum, og viti strax hverjir standa á bak við þær. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
