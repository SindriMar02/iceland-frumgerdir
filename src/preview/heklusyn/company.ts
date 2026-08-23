import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for heklusyn. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'heklusyn',
  route: '/preview/heklusyn',
  name: 'Heklusýn',
  sector: 'Fasteignaþróun & húsbygging',
  location: 'Rangárslétta, vesturbakki Ytri-Rangár',
  region: 'South',
  established: 'Landið sjálfstæð eign frá 2020, félagið skráð 2021',
  currentUrl: 'https://heklusyn.is/',
  ownerEmail: 'heklusyn@heklusyn.is',
  concept: 'Tólf hús',
  conceptTagline:
    'Fimmtíu hektarar og aðeins tólf til fjórtán hús. Fágætið sjálft er varan, og vefurinn byrjar á því í stað þess að fela það. Undirskriftin er sjóndeildarhringurinn: fjöllin átta sem sjást frá landinu, nefnd og staðsett á myndinni sjálfri.',
  accent: '#3E5C6B',
  dark: false,
  status: 'Concept ready',
  thumb: 'https://heklusyn.is/wp-content/uploads/2023/01/DJI_0684.jpg',
  ownPhotography: true,
  photoCredit:
    'Allar ljósmyndir eru af vef Heklusýnar sjálfrar, sóttar í fullri upplausn. Tölvumyndir af innréttingum eru merktar sérstaklega á síðunni og eru ekki ljósmyndir af fullbúnum húsum.',
  audit: {
    strengths: [
      'Óvenju sterk saga: fimmtíu hektarar af landi við Ytri-Rangá sem var hluti af Leirubakka og varð sjálfstæð eign 2020, með aðeins tólf til fjórtán húsum á öllu svæðinu',
      'Frá landinu sjást átta nefnd fjöll, þar á meðal Hekla, Eyjafjallajökull og Þríhyrningur, sem er sölupunktur sem enginn annar getur afritað',
      'Eigin ljósmyndun í hárri upplausn, þar á meðal drónamyndir allt að 5472 pixla breiðar, og raunveruleg sala í gangi með þrjú hús seld',
    ],
    weaknesses: [
      'Ekkert kort af landinu. Sjálf varan, skipulag lóðanna á fimmtíu hekturum, er aðeins til sem myndbandsinnskot',
      'Tæknilegar upplýsingar eru eingöngu PDF skjöl, ellefu lóðablöð og teikningar, án nokkurra upplýsinga á síðunni sjálfri',
      'Ein eignasíða hleður fjörutíu og fimm myndum, samtals um 22 MB, þar af tíu skrár yfir eitt MB, og myndirnar eru nánast án responsive srcset',
      'Tölvumyndir og ljósmyndir eru sýndar hlið við hlið án þess að greint sé á milli, sem er bagalegt þegar verið er að selja hús fyrir yfir hundrað milljónir',
      'Fágætið sjálft, tólf til fjórtán hús á fimmtíu hekturum, kemur hvergi fram fyrr en langt niðri á síðu',
    ],
    opportunities: [
      'Byrja á fágætinu sjálfu: fimmtíu hektarar, tólf hús, sagt strax í fyrstu setningu',
      'Gera sjóndeildarhringinn að undirskrift síðunnar með fjöllin átta nefnd á myndinni',
      'Setja húsin fram sem skrá með stöðu hvers og eins, þar sem seldu húsin sjást áfram því þau eru röksemdin',
      'Breyta PDF hrúgunni í raunverulegar upplýsingar á síðunni',
      'Merkja allar tölvumyndir skýrt, sem er bæði heiðarlegra og traustvekjandi gagnvart kaupendum',
    ],
  },
  positioning:
    'Heklusýn selur ekki hús heldur land sem hefur verið skammtað. Fimmtíu hektarar, tólf til fjórtán hús, átta nefnd fjöll í sjónlínu og áin fyrir neðan. Vefurinn á að hefjast á þeirri einu setningu og verja hana síðan alla leið: landið fyrst, húsin sem skrá með stöðu, gögnin sýnileg á síðunni sjálfri og hver einasta tölvumynd merkt sem slík. Þetta er ekki lúxusvefur með dökkum flötum og gulli heldur bjartur og norrænn vefur þar sem landslagið ber sig sjálft.',
  outreach: {
    subject: 'Hugmynd að nýjum vef fyrir Heklusýn',
    body: `Sæl og blessuð,

Ég heiti Sindri og vinn við vefhönnun. Ég rakst á Heklusýn og staldraði við, því landið ykkar við Ytri-Rangá er óvenjulegt og sagan um tólf hús á fimmtíu hekturum er sterkari en flest annað sem ég sé í fasteignaþróun hér á landi.

Mér fannst hins vegar vanta að vefurinn segði þetta strax. Ég tók því saman frumgerð að nýjum vef þar sem fágætið sjálft er fyrsta setningin, fjöllin átta sem sjást frá landinu fá sitt eigið pláss og lóðirnar eru sýndar sem skrá með stöðu og verði í stað þess að vera faldar í PDF skjölum. Tvennt annað rak ég augun í. Ein eignasíða hleður um 22 MB af myndum, sem er þungt í síma úti á landi, og tölvumyndir af innréttingum standa við hliðina á ljósmyndum án þess að greint sé á milli. Í frumgerðinni eru þær merktar.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding. Ef ykkur líst vel á gæti ég klárað vefinn í heild, en ef ekki vona ég að þetta gefi ykkur að minnsta kosti hugmyndir.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
  },
}
