import type { PreviewCompany } from '../company-types'

/**
 * Svart Lodge — Lerkilundur ehf., Hagabyggð by Glæsibær, Hörgársveit, ten
 * minutes from Akureyri. Sources: svartlodge.is (Home, Location, Surroundings,
 * read 2026-09-02 through the served HTML), the Expedia listing and the Wix
 * media originals (26 frames, 3000 to 9504 px). Verified on the site today:
 * info@svartlodge.is and +354 694 6060 in the footer, kt. 611119-1780, and a
 * page whose whole overview is one paragraph with no h1.
 *
 * Kept in this folder, not the shared catalogue: [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'svartlodge',
  route: '/preview/svartlodge',
  name: 'Svart Lodge',
  sector: 'Gisting',
  location: 'Hagabyggð, Hörgársveit, við Eyjafjörð',
  region: 'Norðurland',
  established: 'Nýtt hús, með þeim fyrstu í Hagabyggð',
  currentUrl: 'https://www.svartlodge.is',
  ownerEmail: 'info@svartlodge.is',
  concept: 'Fjörðurinn í gegnum húsið',
  conceptTagline:
    'Svarta formið flutt heilt: útlínur hússins, mældar úr þeirra eigin ljósmynd, eru gríman sem fjörðurinn birtist í gegnum. Orðmerkið stendur í þeirri stærð sem húsið sjálft hefur.',
  accent: '#8FA8B0',
  dark: true,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'svartlodge/shore-house.jpg',
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru eigin myndir Svart Lodge af svartlodge.is (Wix-frumrit, 3000 til 9504 px), sóttar 2026-09-02. Staðreyndir af svartlodge.is og Expedia.',
  audit: {
    strengths: [
      'Nýtt, dýrt og vel hannað hús: fimm svefnherbergi, fimm baðherbergi, tíu gestir, heitur pottur, sauna, kaldur pottur, arinn og 180° útsýni yfir Eyjafjörð',
      'Tíu mínútur frá miðbæ Akureyrar, Hlíðarfjall og Kjarnaskógur í næsta nágrenni, forsendur fyrir heilsárs útleigu',
      'Ljósmyndirnar eru þegar til í fullri stærð, upp í 9504 px, í Wix-geymslunni þeirra',
    ],
    weaknesses: [
      'Vefsíðan er ein Wix-síða með einni efnisgrein, engri h1-fyrirsögn og myndum sem birtast í 979 px',
      'Bókanir fara í gegnum Expedia og aðra endursöluaðila; „Svart Lodge“ í leit tilheyrir þeim, ekki svartlodge.is',
      'Fáar umsagnir á hverjum stað (Expedia 10 af 3, Tripadvisor 5 af 1) og engin þeirra sést á eigin vef',
    ],
    opportunities: [
      'Láta húsið sjálft bera síðuna: formið sem grímu, fjörðinn í gegnum hana',
      'Ein síða með gagnasniði og efni sem Google og gervigreind lesa, svo „Svart Lodge“ vísi heim',
      'Beiðni um dvöl á eigin léni með iCal frá Expedia og Vrbo, og kortahald á 2. stigi fyrir svona háar nætur',
    ],
  },
  positioning:
    'Dýrasta húsið í yfirferðinni og vefsíðan er ein efnisgrein. Svart hús á sjávarkambi í Eyjafirði, eina dökka formið milli sjávar og himins. Frumgerðin mælir útlínur hússins úr þeirra eigin mynd og notar þær sem grind: fjörðurinn sést í gegnum formið, orðmerkið stendur í stærð hússins, og beiðnin fer beint til þeirra.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Svart Lodge',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska gististaði.

Ég rakst á Svart Lodge þegar ég var að skoða gistingu við Eyjafjörð og staldraði við myndirnar. Svart hús á sjávarkambinum með fjörðinn og Kaldbak í öllum gluggum, pottur, sauna og kaldur pottur. Á svartlodge.is er þetta samt sagt í einni efnisgrein, án fyrirsagnar sem Google les, og myndirnar sem þið eigið í fullri stærð birtast litlar.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Útlínur hússins, mældar beint úr ykkar eigin ljósmynd, eru grind síðunnar: fjörðurinn birtist í gegnum formið á húsinu og opnast svo yfir alla síðuna. Staðreyndirnar, fimm svefnherbergi, tíu gestir, tíu mínútur í bæinn, fá sinn stað, og fyrirspurn fer beint til ykkar.

Svo er það leitin. Eins og staðan er í dag segir vefsíðan hvorki Google né gervigreind eins og ChatGPT hvað Svart Lodge er, svo nafnið tilheyrir endursöluaðilunum í leit. Frumgerðin hefur þær upplýsingar á hreinu.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, með bókunarbeiðni á ykkar eigin léni sem heldur dagatölunum frá Expedia og Vrbo réttum. Ef ekki vona ég samt að þið hafið gaman af því að skoða hugmyndina.

Endilega látið mig vita ef þið hafið áhuga.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
