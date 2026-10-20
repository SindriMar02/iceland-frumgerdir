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
    subject: 'Glacial Glass Cabin á eigin vef',
    // Gmail draft r6046465761571335762, to kyrjunehf@gmail.com (from their Facebook page).
    // Owners per the register: Kyrjun ehf., Birta Ísey Brynjarsdóttir (sole
    // board member) 50 % and Atli Eyberg Örlygsson 50 %.
    body: `Sæl Birta,

Ég heiti Sindri Már og smíða vefi og bókunarkerfi fyrir íslenska gististaði, meðal annars Villa North, Akureyri Lodge og Riverbank.

Ég rakst á Glacial Glass Cabin og sat lengi yfir myndunum. 4,94 í einkunn af 112 umsögnum á Airbnb segir sína sögu.

Eitt vakti athygli mína: kofinn á engan eigin vef og bæði Facebook-síðan og Instagram vísa beint á Airbnb. Gestur sem finnur kofann þar bókar því í gegnum Airbnb og þóknunin fylgir hverri nótt.

Ég setti saman frumgerð að eigin vef fyrir kofann. Því fylgir engin skuldbinding, kíktu endilega á hana:

https://sindrimar02.github.io/iceland-frumgerdir/preview/glacialglass

Þar eru myndirnar úr skráningunni, stutt kvikmynd þar sem kofinn fer frá degi yfir í norðurljós eftir því sem gesturinn skrunar, og bókunarform sem sendir fyrirspurnina beint til þín. Hér sérðu hvernig beiðnin birtist þér og hvernig þú staðfestir hana:

https://sindrimar02.github.io/iceland-frumgerdir/preview/glacialglass/stjornbord

Mig langar að heyra hvernig bókanirnar ganga fyrir sig hjá þér í dag, hvaða síður þú notar og hver svarar gestunum. Út frá því sendi ég þér stutta kynningu í PDF.

Þú mátt endilega segja mér hvað þér finnst, hvort sem það er já eða nei.

Bestu kveðjur,
Sindri Már
845-1758
sndrstudio.is`,
  },
}
