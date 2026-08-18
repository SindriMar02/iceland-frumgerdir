/**
 * The internal catalogue record for this build. Catalogue-only: nothing under
 * her own build imports this file, and the audit and outreach text below is
 * for us, never for her site.
 */
import type { PreviewCompany } from '../companies'
import { STUDIO, ADDRESS_LINE } from './facts'
import { PROJECTS } from './projects'

const BASE = import.meta.env.BASE_URL

export const companyEntry: PreviewCompany = {
  slug: 'katrinisfeld',
  route: '/preview/katrinisfeld',
  name: 'Katrín Ísfeld innanhússarkitekt',
  sector: 'Innanhússhönnun',
  location: ADDRESS_LINE,
  region: 'Höfuðborgarsvæðið',
  established: `Eigið stúdíó frá ${STUDIO.founded}`,
  currentUrl: 'https://katrinisfeld.is',
  ownerEmail: STUDIO.email,
  concept: 'Í heild',
  conceptTagline:
    'Hún hannar innanhús frá grunni, ekki eitt horn í einu. Vefurinn gerir það sama: hvert verkefni fær sinn eigin litheim og forsíðan ber þá alla.',
  accent: '#8C3A34',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}katrinisfeld/rs/s-eldhus-vitt-900.webp`,
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru raunveruleg verkefni af vef Katrínar (katrinisfeld.is), sóttar í fullri upplausn í ágúst 2026.',
  audit: {
    strengths: [
      `${PROJECTS.length} birt verkefni í fjórum flokkum, þar af sex fyrir gistiheimili og hótel`,
      'Ítölsku innréttingarnar (Arrital, Altamarea) eru raunveruleg sérstaða sem hvergi er markaðssett',
      'Menntun og ferill (Fort Lauderdale með láði, Holland, FHI) standast samanburð við hvaða stofu sem er',
    ],
    weaknesses: [
      'Forsíðan hefur engar fyrirsagnir (0 h1/h2/h3) og aðeins 238 stafi af texta',
      'Hver einasta ljósmynd er CSS-bakgrunnur í Elementor: ekkert indexanlegt myndefni',
      'Þrjú ólík heimilisföng í skráningum: Katrínartún 4 (rétt), Bankastræti 10 og Skipasund 74',
    ],
    opportunities: [
      'Verkefnaskráin sjálf er burðarvirkið: 23 verk sem eiga hvert sína síðu í stað einnar',
      'Arrital og Altamarea eru vörumerkjaleit með kauphug á bak við sig og engin síða til að taka á móti henni',
    ],
  },
  positioning:
    'Katrín Ísfeld hannar innanhús frá grunni fyrir heimili, gistiheimili og hótel. Vefurinn er byggður eins og hún hannar: gesturinn kemur inn í eitt rými í einu, hvert með sínum litheimi, og verkefnaskráin öll stendur opin eins og teikningaskápur.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Katrínu Ísfeld',
    body: 'Seld. Sjá KATRIN-SEO.md fyrir stöðu og næstu skref.',
  },
}
