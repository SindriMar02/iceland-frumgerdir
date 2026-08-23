import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for Fuzzy (Módel-húsgögn ehf). Kept in this
 * folder, never in the shared catalogue, so the preview route only ever ships
 * its own company data. See [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'fuzzy',
  route: '/preview/fuzzy',
  name: 'Fuzzy',
  sector: 'Húsgagnahönnun og bólstrun',
  location: 'Hraunbergi 11, 111 Reykjavík',
  established: 'Módel-húsgögn ehf, skráð 1971',
  currentUrl: 'https://fuzzy.is',
  ownerEmail: '',
  concept: 'Í bílskúrnum síðan 1972',
  conceptTagline:
    'One man has made every single Fuzzy stool by hand in his own garage since 1972, and Epal sells them. The page is built on that one sentence.',
  accent: '#B8256B',
  dark: true,
  status: 'Concept ready',
  region: 'Capital',
  thumb: '/fuzzy/range-sm.webp',
  ownPhotography: true,
  positioning:
    'Fuzzy er ekki verksmiðjuvara heldur handverk eins manns. Sigurður Már hannaði kollinn 1972 og smíðar hann enn sjálfur í bílskúrnum sínum, úr alvöru íslenskri gæru, og Epal selur hann. Síðan á að selja það eina atriði, ekki húsgagn í hillu.',
  audit: {
    strengths: [
      'Módel-húsgögn ehf skráð 14.06.1971, ársreikningi 2025 skilað 28.02.2026, svo reksturinn er sannanlega lifandi',
      'Sigurður Már smíðar hvern einasta Fuzzy sjálfur í bílskúrnum sínum, enn þann dag í dag',
      'Raunveruleg viðurkenning: umbúðaverðlaun Samtaka iðnaðarins 1972, Gæðamerki Bændasamtakanna, Iceland Review, Hús og Híbýli',
      'Tíu alvöru söluaðilar, þar á meðal Epal og Rammagerðin, auk Danmerkur og Kanada',
    ],
    weaknesses: [
      'Vefurinn segir sjálfur til um aldur sinn: „© 2013 Öll réttindi áskilin“ stendur í fæti síðunnar',
      'Engin viewport-merking, síðan er læst í 980 px breidd og því ólesin í síma',
      'Hvorki verð né verslun, aðeins listi yfir söluaðila og eyðublað',
      'Nýjustu fréttir eru margra ára gamlar, svo síðan les eins og hún sé hætt',
    ],
    opportunities: [
      'Gæran sjálf verður tengiliður síðunnar: hárin halla með skruni eins og strokið sé yfir kollinn',
      'Litirnir eru raunverulegir, teknir beint úr þeirra eigin ljósmynd, og litta síðuna alla',
      'Bílskúrssagan er sölupunkturinn sem vantar alveg á núverandi síðu',
    ],
  },
  outreach: {
    subject: 'Fuzzy: síðan ykkar er læst í 980 px og segist vera frá 2013',
    body: `Sæll Sigurður Már.

Ég rakst á Fuzzy og fór að skoða fuzzy.is í símanum. Síðan opnast, en hún er læst í 980 punkta breidd og hleypur því saman í smámynd sem þarf að þysja inn á. Í fætinum stendur „© 2013“.

Mér þótti það synd, því sagan á bakvið kollinn er betri en flest sem ég sé: sami maðurinn hefur smíðað hvern einasta Fuzzy í bílskúrnum sínum síðan 1972, og Epal selur hann.

Ég gerði tillögu að nýrri forsíðu, ykkur að kostnaðarlausu og án allra skuldbindinga:

${'{{PREVIEW_URL}}'}

Ef þér líst ekkert á hana máttu henda henni, mér er engin vorkunn.

${SIGN}`,
  },
}
