import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for thg. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'thg',
  route: '/preview/thg',
  name: 'THG Arkitektar',
  sector: 'Arkitektastofa',
  location: 'Faxafen 9, 108 Reykjavík',
  region: 'Capital',
  established: 'Stofnað af Halldóri Guðmundssyni í október 1994',
  currentUrl: 'https://www.thg.is/',
  ownerEmail: 'thg@thg.is',
  concept: 'Staðarandi',
  conceptTagline:
    'Stofan segir sömu hugsun þrisvar á eigin vef án þess að taka eftir því: að fella nýtt að því sem fyrir er. Sú setning verður burðarásinn, og undirskriftin er lárétt ferð gegnum verkin sjö þar sem hvert hús ber sína eigin liti og viðmótið skiptir um ham með þeim.',
  accent: '#A8412A',
  dark: true,
  status: 'Concept ready',
  thumb:
    'https://images.squarespace-cdn.com/content/v1/5b0a957785ede1b5cc40a4ff/1fbd6a97-a3a3-4e7d-8786-c14862b9256d/H%C3%B3tel+Borg_Exterior_01.jpg?format=1200w',
  ownPhotography: true,
  photoCredit:
    'Allar ljósmyndir eru af vef THG Arkitekta sjálfra, sóttar í fullri upplausn af þeirra eigin myndaþjóni.',
  audit: {
    strengths: [
      'Þrjátíu og tveggja ára stofa með um fjörutíu manns og vottað gæðakerfi ÍST EN ISO 9001:2015 frá 2016',
      'Verkefnaskráin er óvenju sterk og mjög almennt þekkt: Hótel Borg, Icelandair Hótel Marina, Reykjavík Konsúlat og Hótel Von, ásamt EIR við Spöng og Hrafnistu í Boðaþingi',
      'Fagleg ljósmyndun af verkunum liggur þegar fyrir í tvöþúsund pixla upplausn á þeirra eigin myndaþjóni',
    ],
    weaknesses: [
      'Aðeins sjö verkefni eru sýnd hjá stofu sem hefur starfað í þrjátíu og tvö ár og telur um fjörutíu manns',
      'Hugsunin sem tengir verkin saman er hvergi orðuð, svo hvert verk stendur eitt og sér',
      'Hvergi kemur fram að stofan teiknar bæði hótel og hjúkrunarheimili, sem er þó eitt af því sem greinir hana frá öðrum',
      'Verklýsingarnar eru mjög stuttar og mörg verk eru án ártals eða stærðar, svo erfitt er að meta umfang stofunnar',
    ],
    opportunities: [
      'Setja þeirra eigin setningu fremst: að fella nýtt að því sem fyrir er, studda þremur tilvitnunum úr þeirra eigin verklýsingum',
      'Lárétt ferð gegnum verkin þar sem hvert hús ber sína eigin liti',
      'Segja það sem vefurinn segir hvergi: að stofan teiknar bæði hótel og hjúkrunarheimili',
      'Birta myndirnar í fullri upplausn og gefa þeim raunverulegan skala',
      'Segja söguna af Kolasundinu sem gengur gegnum jarðhæð Konsúlats',
    ],
  },
  positioning:
    'THG er stofan á bak við hús sem fólk hefur þegar verið inni í án þess að vita það. Hótel Borg, Marina, Konsúlat og Von, og á hinum endanum EIR og Hrafnista. Vefurinn á að byrja á hugsuninni sem stofan orðar sjálf þrisvar, að fella nýtt að því sem fyrir er, og láta verkin sanna hana eitt af öðru í láréttri ferð þar sem viðmótið tekur lit af hverju húsi. Þetta er vefur sem arkitektar munu dæma, svo hófstilling gildir alls staðar og myndirnar fá að tala.',
  outreach: {
    subject: 'Hugmynd að nýjum vef fyrir THG Arkitekta',
    body: `Góðan dag,

Ég heiti Sindri og vinn við vefhönnun. Ég var að skoða verkin ykkar og rak augun í eitt: þið segið sömu hugsunina þrisvar á vefnum ykkar án þess að hún sé nokkurs staðar orðuð sem stefna stofunnar. Um Hótel Borg segið þið að móttakan sé hönnuð í samræmi við eldri móttöku, um Konsúlat að hugmyndin sé að fella saman nýtt og gamalt, og um Hótel Von að byggingin eigi að falla að nágrenninu og fanga staðarandann.

Ég tók saman frumgerð að nýjum vef sem byrjar á þeirri hugsun og lætur verkin sanna hana, eitt af öðru. Vefurinn ykkar er tæknilega í fínu lagi, svo þetta snýst ekki um lagfæringar. Það sem mér fannst vanta er umfangið sjálft. Sjö verk eru sýnd hjá stofu sem hefur starfað í þrjátíu og tvö ár og telur um fjörutíu manns, og hvergi kemur fram að þið teiknið bæði hótel og hjúkrunarheimili.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding. Ef ykkur líst vel á gæti ég klárað vefinn í heild, en ef ekki vona ég að þetta gefi ykkur að minnsta kosti hugmyndir.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
  },
}
