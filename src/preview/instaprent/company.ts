import type { PreviewCompany } from '../company-types'

/**
 * Instaprent: Myndó's print and gift shop. Part of the confirmed Myndó package
 * (not an outreach lead), so the outreach block is internal only and never sent.
 * Design: a 1:1 Coutumes transplant (Awwwards SOTD/SOTM/SOTY), teardown in
 * 02-clients/clients/myndo/instaprent-design/teardowns/coutumes/.
 */
const A = import.meta.env.BASE_URL

export const companyEntry: PreviewCompany = {
  slug: 'instaprent',
  route: '/preview/instaprent',
  name: 'Instaprent',
  sector: 'Prentun og persónulegar gjafir',
  location: 'Háholt 14, 270 Mosfellsbær',
  region: 'Capital',
  established: 'Rekið af Myndó ljósmyndastofu ehf',
  currentUrl: 'https://www.iprent.is',
  ownerEmail: 'myndo@myndo.is',
  concept: 'Coutumes, á íslensku',
  conceptTagline:
    'Coutumes transplanted 1:1 onto a photo print and gift shop: one calm hero with her own line, category tiles, and a checkout path a grandparent can follow.',
  accent: '#F67A32',
  dark: false,
  status: 'In build',
  thumb: `${A}instaprent/hero-d-1200.webp`,
  ownPhotography: true,
  photoCredit:
    'Vörumyndir eru af núverandi vef Instaprent. Forsíðumyndin er gerð með gervigreind og kemur í stað ljósmyndar sem Myndó tekur sjálf fyrir opnun.',
  positioning:
    'Persónuleg gjöf sem gleður. Instaprent prentar myndirnar þínar á bolla, púða, púsl og ljósmyndapappír í Mosfellsbæ. Nýja verslunin á að gera það einfalt: velja vöru, setja inn mynd og texta, sækja eða fá sent.',
  audit: {
    strengths: [
      '118 vörur, raunverulegar myndir af eigin framleiðslu',
      'Eigin prentarar: ljósmynda-, sublimation- og DTF-prentari',
      'Verslun og verkstæði í Háholti 14, Mosfellsbæ',
    ],
    weaknesses: [
      'Viðskiptavinur þarf að senda mynd í tölvupósti eftir pöntun',
      'Wix-síða, 1,8 MB af kóða á forsíðu',
      'Flokkar óljósir, 40 undirsíður',
    ],
    opportunities: [
      'Mynd og texti beint á vörusíðunni',
      'Framköllun með upphleðslu og skurði',
      'Árstíðabundin forsíða: Jólin, Fermingar, Mæðradagurinn',
    ],
  },
  outreach: {
    subject: 'Instaprent, frumgerð (innanhúss)',
    body: 'Innanhúss frumgerð fyrir Myndó pakkann. Ekki senda sem kynningarpóst. [HLEKKUR Á FRUMGERÐ]',
  },
}
