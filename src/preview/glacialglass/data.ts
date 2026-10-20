import type { PreviewCompany } from '../companies'

/**
 * Glacial Glass Cabin — Svínhagi, near Hella (Rangárþing ytra).
 * Operator Kyrjun ehf. (410324-1210); responsible person on the operating
 * licence REK-2025-003475 is Birta Ísey Brynjarsdóttir; the register lists her
 * and Atli Eyberg Örlygsson as 50/50 owners (read 2026-10-20). On Airbnb the
 * hosts show only as "Glacial Glass Cabin", a couple from Iceland. Research trail:
 * `_harvest/glacialglass/FACTS.md` and the Codex premium sweep
 * `_docs/premium-prospect-sweep-2026-10-20/SHORTLIST.md` §3.
 *
 * ownerEmail: kyrjunehf@gmail.com, printed on the cabin's own Facebook page
 * (facebook.com/61574080466173, About, read 2026-10-20) with phone 768 4224
 * and Svínhagi L6A. Instagram @glacialglasscabin is the other channel.
 *
 * No own website exists, so currentUrl points at the Airbnb listing.
 */
export const companyEntry: PreviewCompany = {
  slug: 'glacialglass',
  route: '/preview/glacialglass',
  name: 'Glacial Glass Cabin',
  sector: 'Gisting',
  location: 'Svínhagi, Hellu',
  region: 'Suðurland',
  established: 'Ofurgestgjafi í 2 ár',
  currentUrl: 'https://www.airbnb.com/rooms/1367246566538586964',
  ownerEmail: 'kyrjunehf@gmail.com',
  noOwnSite: true,
  concept: 'Ein nótt',
  conceptTagline:
    'Ein nótt í glerhúsinu, frá síðdegi til norðurljósa, og skrunið er klukkan.',
  accent: '#4FA87A',
  dark: true,
  status: 'Concept ready',
  thumb: import.meta.env.BASE_URL + 'glacialglass/arrival-hekla.jpg',
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru raunverulegar myndir úr skráningu kofans (28 myndir af Booking.com), sóttar 2026-10-20. Kvikmyndin frá degi til nætur er unnin á milli tveggja þeirra.',
  audit: {
    strengths: [
      'Speglagler á þrjá vegu, Hekla í miðri myndinni. Arkitektúrinn er markaðsefnið sjálft',
      '4,94 í einkunn af 112 umsögnum á Airbnb og ofurgestgjafi. Traustið er þegar til staðar',
      'Ljósmyndirnar eru í hæsta gæðaflokki, bæði dagur og norðurljós, svo síðan þarf ekkert lánsefni',
    ],
    weaknesses: [
      'Engin eigin vefsíða fannst. Hver einasta bókun fer í gegnum Airbnb eða Booking og þóknun þeirra',
      'Sá sem leitar að nafninu lendir á bókunarsíðum annarra, ekki á kofanum sjálfum',
      'Umsagnirnar og myndirnar eru læstar inni á bókunarsíðum og vinna ekki fyrir kofann annars staðar',
    ],
    opportunities: [
      'Eigin síða með beinni bókunarbeiðni dregur úr þóknun af hverri nótt',
      'Leiðarlýsingin heim að kofanum og vetraraðstæður skýrðar fyrir komu, sem umsagnir kalla eftir',
      'LodgingBusiness-gagnasnið svo Google og gervigreindarleit finni kofann undir eigin nafni',
    ],
  },
  positioning:
    'Glacial Glass Cabin er eitt fallegasta einstaka gistirými landsins en á enga eigin síðu. Frumgerðin er ein nótt í kofanum: síðan byrjar í dagsbirtu og endar í norðurljósum, skrunið færir útsýnið af pallinum frá degi til nætur, og bókunarbeiðni fer beint til gestgjafanna í stað þess að kosta þóknun.',
  outreach: {
    subject: 'Hugmynd að vefsíðu fyrir Glacial Glass Cabin',
    // Gmail draft s:4203738882580142694 (search the subject, the id changes), to kyrjunehf@gmail.com
    // (from their Facebook page). Rewritten 2026-10-20 around her guests' map-pin trouble, Airbnb fees and
    // findability. Owners per the register: Kyrjun ehf., Birta Ísey Brynjarsdóttir (sole board member) 50 %
    // and Atli Eyberg Örlygsson 50 %.
    body: `Sæl Birta,

Ég heiti Sindri Már og rek SNDR Studio, þar sem ég hanna og smíða nútímalegar, stílhreinar vefsíður og bókunarkerfi fyrir íslensk fyrirtæki. Ég sé jafnframt um hýsingu, viðhald og reglulegar uppfærslur, svo vefurinn haldist hraður og öruggur.

Ég rakst á Glacial Glass Cabin og sat lengi yfir myndunum. Hekla í glugganum, áin fyrir neðan og potturinn á pallinum. Gestirnir eru sammála, 4,94 í einkunn af 112 umsögnum, og útsýnið og heiti potturinn eru það sem flestir nefna.

Ég tók samt eftir tvennu þegar ég las umsagnirnar. Nokkrir gestir segja að Google Maps hafi skilað þeim út á þjóðveg og að þeir hafi þurft leiðbeiningarnar frá þér til að finna kofann. Svo vísa bæði Facebook og Instagram beint á Airbnb, þannig að hver einasta bókun fer þar í gegn með þóknun.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að vef fyrir kofann. Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
https://sindrimar02.github.io/iceland-frumgerdir/preview/glacialglass

Þar eru þínar eigin myndir, umsagnir gestanna og bókunarform sem sendir beiðnina beint til þín, án þóknunar. Þú sérð allar beiðnir á einum stað og staðfestir þær þar:
https://sindrimar02.github.io/iceland-frumgerdir/preview/glacialglass/stjornbord

Í kaflanum um komuna stendur strax að fylgja leiðbeiningunum frá þér en ekki pinnanum á kortinu. Næsta skref væri komusíða sem þú sendir hverjum gesti fyrir fram, með leiðinni síðasta spölinn, lyklaboxinu og því hvernig potturinn virkar. Þá þarftu ekki að skrifa það sama aftur og aftur, og færri villast á leiðinni.

Svo er það leitin. Kofinn á engan eigin vef í dag, svo þegar fólk leitar að honum á Google eða spyr gervigreind eins og ChatGPT er ekkert frá þér sjálfri til að vísa á, bara Airbnb og bókunarsíður. Airbnb heldur áfram eins og áður, vefurinn bætist bara við.

Ef þér líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þú hafir gaman af því að skoða hugmyndina. Endilega láttu mig vita hvað þér finnst.

Bestu kveðjur,
Sindri Már
845-1758
sndrstudio.is`,
  },
}
