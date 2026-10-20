import type { PreviewCompany } from '../companies'

/**
 * Glacial Glass Cabin — Svínhagi, near Hella (Rangárþing ytra).
 * Operator Kyrjun ehf. (410324-1210); responsible person on the operating
 * licence REK-2025-003475 is Birta Ísey Brynjarsdóttir. On Airbnb the hosts
 * show only as "Glacial Glass Cabin", a couple from Iceland. Research trail:
 * `_harvest/glacialglass/FACTS.md` and the Codex premium sweep
 * `_docs/premium-prospect-sweep-2026-10-20/SHORTLIST.md` §3.
 *
 * ownerEmail is deliberately EMPTY: no public email was verified. The only
 * verified channels are the Google Travel phone (+354 768 4224) and the
 * Instagram account @glacialglasscabin. Never invent a contact.
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
  ownerEmail: '',
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
    subject: 'Glacial Glass Cabin á eigin síðu',
    body: `Sæl Birta,

Ég heiti Sindri og hanna vefsíður. Ég rakst á Glacial Glass Cabin og sat lengi yfir myndunum. 4,94 í einkunn af 112 umsögnum segir sína sögu.

Ég tók eftir einu: kofinn á enga eigin síðu, svo hver bókun fer í gegnum Airbnb eða Booking og þóknunin fylgir hverri nótt.

Ég bjó til frumgerð af því hvernig ykkar eigin síða gæti litið út. Því fylgir engin skuldbinding, kíktu endilega á hana:

https://sindrimar02.github.io/iceland-frumgerdir/preview/glacialglass

Þar eru ykkar eigin myndir, umsagnirnar, og bókunarform sem sendir fyrirspurn beint til ykkar. Útsýnið af pallinum fer frá degi til norðurljósa eftir því sem lesandinn skrunar.

Ef þér líst á, þá er þetta það sem ég geri: sjálf síðan, Google-leitin svo fólk finni kofann án bókunarsíðna, og umsagnakerfi sem safnar umsögnum á ykkar eigin síðu.

Þú mátt endilega segja mér hvað þér finnst, hvort sem það er já eða nei.

Bestu kveðjur,
Sindri Már
845 1758
sndrstudio.is`,
  },
}
