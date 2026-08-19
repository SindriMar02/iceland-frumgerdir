import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for samverk. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'samverk',
    route: '/preview/samverk',
    name: 'Glerverksmiðjan Samverk',
    sector: 'Glass manufacturing',
    location: 'Kópavogur / Hella',
    region: 'Capital Region / South',
    established: 'Est. 1969',
    currentUrl: 'https://www.samverk.is',
    ownerEmail: 'samverk@samverk.is',
    concept: 'Ljósbrot',
    conceptTagline:
      'Light refraction as the whole design language — every real photo shown as a square glass "pane" with a hover glint, an interactive product index instead of a static grid.',
    accent: '#27639C',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://www.samverk.is/wp-content/uploads/2019/03/glerveggur5.jpg',
    audit: {
      strengths: [
        'Real, genuinely excellent installation photography already exists (mirrors, shower glass, office glass walls, railings) — just buried and underused',
        'A real, strong story: founded 1969, both the oldest AND the largest glass workshop in Iceland',
        'Real logo is clean and usable as-is; CE-certified production, two facilities (Hella factory + Kópavogur showroom)',
      ],
      weaknesses: [
        'The homepage hero is a generic stock photo, despite far better real photography sitting further down the page',
        'One AI-generated image is mixed in with the real product photos',
        'A "Starfsfólk" (staff) heading on the About page has no content behind it at all',
      ],
      opportunities: [
        'Put the real installation photography front and center instead of stock imagery',
        'Make "founded 1969, oldest + largest in Iceland" the headline trust story instead of a buried paragraph',
        'Turn the flat product list into something that actually shows each product',
      ],
    },
    positioning:
      'Iceland\'s oldest and largest glass manufacturer, sitting on genuinely excellent real installation photography that its own site barely uses — leading with a stock hero image instead. The redesign puts Samverk\'s real photography, real 1969 founding story, and real logo at the center, with an interactive product index standing in for the static, repetitive category list.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Samverk',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég rakst á auglýsingu frá ykkur og ákvað í kjölfarið að skoða vefsíðuna ykkar. Þar komst ég að því að þið eruð bæði elsta og stærsta starfandi glerverksmiðja landsins, stofnuð 1969 af átta heimamönnum í Rangárþingi, og eigið margar mjög fínar myndir af ykkar eigin verkum, speglum, sturtugleri, glerveggjum og handriðum.

Mér fannst samt eins og núverandi vefsíða gerði þessu ekki alveg nógu góð skil. Forsíðumyndin er stök birtingamynd sem tengist ekki verksmiðjunni sjálfri, á meðan þessar fínu myndir af ykkar eigin vinnu liggja neðar á síðunni og fá minni athygli en þær eiga skilið.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur, byggða á ykkar eigin myndum og lógói. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Helsti munurinn er sá að myndirnar af ykkar eigin verkum fá að njóta sín strax í upphafi í stað þess að liggja neðarlega á síðunni, sagan frá 1969 er sögð strax í fyrstu andránni, og vöruúrvalið er sett upp þannig að hægt er að smella á hverja vöru og sjá hana beint í stað þess að lesa bara upptalningu.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
