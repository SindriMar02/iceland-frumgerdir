/**
 * Álfacafé — "Á mörkum heima" · data layer
 *
 * Every fact, price, quote and season date below comes from the vetted
 * research brief (east.is, ferdalag.is, borgarfjordureystri.is, ja.is,
 * facebook.com/alfacafe, restaurantguru.com). Nothing is invented:
 * no founding year, no owner name, no fixed daily hours grid, no
 * per-item price list. The honesty notes ship on-page (footer).
 */

/* ── asset helpers — GH Pages serves under a base path, never hardcode "/" ── */
export const AV = (file: string) => `${import.meta.env.BASE_URL}alfacafe/${file}`

/** Local resized variants for the four Unsplash shots (828/1280/2000). */
export const variantSet = (base: string) =>
  `${AV(`${base}-828.jpg`)} 828w, ${AV(`${base}-1280.jpg`)} 1280w, ${AV(`${base}-2000.jpg`)} 2000w`

/* ── contact — canonical values only (the page's whole point) ─────────────── */
export const PHONE = '472 9900'
export const PHONE_HREF = 'tel:+3544729900'
export const EMAIL = 'alfacafe@simnet.is'
export const ADDRESS_LINES = ['Borgarfjarðarvegur', 'Bakkagerði', '720 Borgarfjörður eystri']
export const ADDRESS_NOTE =
  'Samkvæmt eigin skráningu staðarins á Facebook. Aðrar vefsíður nota önnur heimilisföng fyrir sama hús.'
export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Álfacafé, Bakkagerði, Borgarfjörður eystri')
export const DISTANCE_NOTE = 'Um 75 km akstur frá Egilsstöðum.'

/* ── season window — the one cross-confirmed data point (east.is + ferdalag.is).
      Daily hours are NOT asserted anywhere on the page; the phone is the truth. */
export const SEASON = {
  startLabel: '4. maí',
  endLabel: '30. september',
  rangeMono: '4. MAÍ – 30. SEPT.',
  isOpenSeason(d: Date): boolean {
    const m = d.getMonth() + 1
    const day = d.getDate()
    if (m < 5 || m > 9) return false
    if (m === 5 && day < 4) return false
    return true
  },
}

export const LANTERN = {
  litLabel: 'OPIÐ YFIR SUMARIÐ',
  unlitLabel: 'LOKAÐ YFIR VETURINN',
  unlitSub: 'OPNAR AFTUR 4. MAÍ',
  confirmLine: 'Opnunartímar geta breyst eftir degi og veðri. Hringdu og staðfestu áður en þú leggur af stað.',
}

/* ── hero ─────────────────────────────────────────────────────────────────── */
export const HERO = {
  h1: 'Á mörkum heima',
  sub: 'Fiskisúpa, vöfflur og álfasögur við rætur Álfaborgar í Bakkagerði.',
  ctaDirections: 'Fá leiðbeiningar',
  ctaMenu: 'Sjá matseðil',
  imgAlt: 'Langur beinn þjóðvegur að fjöllum, myndskreyting fyrir aksturinn austur',
}

/* ── lantern band ─────────────────────────────────────────────────────────── */
export const OPEN_BAND = {
  heading: 'Er opið í dag?',
  body:
    'Álfacafé er sumarkaffihús og skráðir opnunartímar á netinu stangast á milli vefsíðna. Þess vegna er símanúmerið hér í yfirstærð: eitt símtal tekur af allan vafa.',
}

/* ── menu — verified items only, price range not a price list ─────────────── */
export const MENU = {
  heading: 'Súpan sem fólk keyrir langt fyrir',
  body:
    'Fiskisúpan er rétturinn sem gestir nefna aftur og aftur í umsögnum. Ein umsögn nefnir 2.200 kr. fyrir súpu að vild ásamt brauði og tei.',
  items: [
    { name: 'Fiskisúpa', note: 'Rétturinn sem umsagnirnar snúast um, borin fram með brauði' },
    { name: 'Vöfflur', note: 'Með rjóma og ferskum berjum' },
    { name: 'Pönnukökur', note: 'Upprúllaðar, íslensk klassík' },
    { name: 'Reyktur lax', note: 'Léttur réttur með kaffinu' },
    { name: 'Kökur og bakkelsi', note: 'Bláberjabaka, rabarbarabaka og ávaxtakaka' },
    { name: 'Heitt súkkulaði og kaffi', note: 'Eftir gönguna á Álfaborg' },
  ],
  priceRange: '2.000–4.000 kr. á mann',
  vegNote: 'Grænmetisréttir í boði.',
  disclaimer: 'Verðin eru viðmið úr opinberum umsögnum, ekki fastur verðlisti. Verð geta breyst.',
  soupImgAlt: 'Rjúkandi fiskisúpa í skál, myndskreyting',
  soupCaption: 'Sýnishorn af fiskisúpu (Unsplash), ekki mynd frá Álfacafé.',
  strip: [
    { file: 'fb-02-coffee.jpg', alt: 'Kaffibolli og smákökur á viðarborði úti við' },
    { file: 'fb-06-pastry.jpg', alt: 'Nýbakaðir snúðar í glerskál við hlið cappuccino' },
    { file: 'fb-08-ponnukokur.jpg', alt: 'Bakki af upprúlluðum pönnukökum' },
  ],
  stripCaption: 'Af Facebook-síðu Álfacafé.',
}

/* ── story — no founding year, no owner name (unverified) ─────────────────── */
export const STORY = {
  heading: 'Að venju fyrst til að opna í þorpinu',
  quote: 'Sumarið er alveg að skella á og þá opnar Álfacafé að venju fyrst veitingastaða í þorpinu.',
  quoteSource: 'Frétt á borgarfjordureystri.is',
  body1:
    'Þannig var opnun sumarsins kynnt í fréttum heimamanna. Orðin „að venju“ segja sína sögu: þetta er staðurinn sem opnar fyrstur á vorin, ár eftir ár.',
  body2:
    'Kaffihúsið deilir húsnæði með Alfa Stein, þar sem steinmunir úr héraði eru til sölu. Innandyra standa slípaðir steinar og handverk heimafólks við hlið málverka, svo heimsóknin er í senn kaffihús og lítil sýning.',
  imgAlt: 'Fullsetinn pallurinn við Álfacafé á sumardegi, fjörður og fjöll í baksýn',
  imgCaption: 'Pallurinn á góðum degi. Mynd af Facebook-síðu Álfacafé.',
  stoneImgAlt: 'Hilla með málverkum og slípuðum steinmunum frá Alfa Stein',
  stoneCaption: 'Steinmunir Alfa Steins, af Facebook-síðu staðarins.',
}

/* ── folklore — verified from borgarfjordureystri.is / east.is ────────────── */
export const FOLKLORE = {
  heading: 'Álfadrottningin í næsta húsi',
  pull: 'Þar býr drottning íslenskra álfa með hirð sinni.',
  body1:
    'Rétt við þorpið rís Álfaborg, kletturinn sem fjörðurinn er sagður draga nafn sitt af. Þjóðtrúin lýsir huldufólkinu sem líku mönnum, en hærra, fegurra og bjartara yfirlitum, og heimili þess undir yfirborðinu eiga að líkjast íslenskum húsum 19. aldar. Álfaborg var friðlýst árið 1976 og af útsýnispallinum efst sést yfir þorpið og fjörðinn.',
  body2:
    'Inni á kaffihúsinu er þetta ekki bara saga. Þar stendur lítill álfadrengur með handskrifuðu nafnspjaldi, Ingjaldur, og Wi-Fi lykilorðið á staðnum er „fishsoup“.',
  photos: [
    {
      file: 'fb-05-ingjaldur.jpg',
      alt: 'Villiblóm í vasa og handskrifað spjald: Ingjaldur, álfadrengur',
      caption: 'Ingjaldur álfadrengur, innandyra.',
    },
    {
      file: 'fb-03-wifi-sign.jpg',
      alt: 'Ætihvönn í potti við steinvegg og handskrifað Wi-Fi skilti með lykilorðinu fishsoup',
      caption: 'Wi-Fi skiltið. Lykilorðið segir allt.',
    },
  ],
  photoCredit: 'Báðar myndir af Facebook-síðu Álfacafé.',
}

/* ── puffins — Hafnarhólmi, verified figures ──────────────────────────────── */
export const PUFFINS = {
  heading: 'Lundarnir á Hafnarhólma',
  body:
    'Niðri við höfnina í Bakkagerði er Hafnarhólmi, ein aðgengilegasta lundabyggð landsins. Göngupallar liggja svo nærri varpinu að fuglinn situr í eins til tveggja metra fjarlægð. Rita, fýll og æðarfugl verpa þar líka.',
  itinerary: 'Súpa á Álfacafé, svo lundarnir á Hafnarhólma. Það er dagsplanið.',
  facts: [
    { value: '≈10.000', label: 'lundapör í varpi' },
    { value: '1–2 m', label: 'frá göngupöllunum' },
    { value: 'Miðjan apríl – byrjun ágúst', label: 'lundinn við hólmann' },
    { value: 'Lok maí – byrjun júlí', label: 'mesta lífið í varpinu' },
  ],
  mainAlt: 'Lundi á grasi vaxinni brún í Borgarfirði eystri',
  mainCaption: 'Lundi í Borgarfirði eystri (Unsplash / Bianca Fazacas).',
  detailAlt: 'Nærmynd af lunda með marglitan gogg',
  detailCaption: 'Nærmynd (Unsplash / myndskreyting).',
}

/* ── reviews — verbatim Google reviews as shown on restaurantguru.com ─────── */
export const REVIEWS = {
  heading: 'Það sem gestir segja',
  badges: [
    { value: '4,8 af 5', label: 'Google · 422 umsagnir' },
    { value: '4,5 af 5', label: 'Tripadvisor · 138 umsagnir' },
    { value: '#1', label: 'veitingastaður í Borgarfirði eystri' },
  ],
  quotes: [
    {
      text: 'The fish soup as recommended by everyone in the reviews, was insanely good. Service was great and friendly.',
      name: 'Marcel Veldman',
    },
    {
      text: "This was probably one of the best fish soups we've had on our trip so far. Delightful place with friendly staff.",
      name: 'Kiley B',
    },
    {
      text: 'Great and friendly service, delicious fish soup...by far the best, cheapest and most authentic meal we had.',
      name: 'John Blanckaert',
    },
  ],
  sourceNote: 'Google-umsagnir, birtar á restaurantguru.com. Nöfn og texti óbreytt.',
}

/* ── gallery — the café's own small Facebook photos, shown near-native ────── */
export const GALLERY = {
  heading: 'Beint af Facebook-síðunni',
  sub: 'Litlar myndir af alvöru stað, birtar hér nálægt upprunalegri stærð.',
  photos: [
    { file: 'fb-02-coffee.jpg', alt: 'Kaffibolli og smákökur á viðarborði' },
    { file: 'fb-03-wifi-sign.jpg', alt: 'Handskrifað Wi-Fi skilti og ætihvönn í potti' },
    { file: 'fb-04-alfastein.jpg', alt: 'Hilla með málverkum og steinmunum Alfa Steins' },
    { file: 'fb-05-ingjaldur.jpg', alt: 'Ingjaldur álfadrengur og villiblóm í vasa' },
    { file: 'fb-06-pastry.jpg', alt: 'Snúðar í glerskál og cappuccino' },
    { file: 'fb-08-ponnukokur.jpg', alt: 'Upprúllaðar pönnukökur á bakka' },
  ],
}

/* ── practical info ───────────────────────────────────────────────────────── */
export const PRACTICAL = {
  heading: 'Á leiðinni?',
  seasonLabel: 'Opið tímabil',
  seasonValue: '4. maí til 30. september',
  ctaDirections: 'Fá leiðbeiningar',
  ctaCall: 'Hringja',
}

/* ── closing ──────────────────────────────────────────────────────────────── */
export const CLOSING = {
  heading: 'Ljósið logar á sumrin',
  body: 'Keyrslan er löng og hún er þess virði. Hringdu á undan þér, svo er heitt á könnunni.',
}

/* ── on-page honesty notes (footer) ───────────────────────────────────────── */
export const HONESTY: string[] = [
  'Þessi síða er hönnunarfrumgerð, unnin án aðkomu Álfacafé. Staðreyndir eru sóttar í opinberar heimildir: east.is, ferdalag.is, borgarfjordureystri.is, ja.is, Facebook-síðu staðarins og restaurantguru.com.',
  'Opnunartímabilið 4. maí til 30. september byggir á skráningu east.is og ferdalag.is. Dagleg opnun er hvergi staðfest á einum stað og skráðir tímar stangast á milli vefsíðna, hringdu því alltaf til að staðfesta.',
  'Verð eru viðmið úr umsögnum gesta, ekki verðlisti staðarins.',
  'Myndir af mat, pallinum og innandyra eru af Facebook-síðu Álfacafé. Myndir af veginum, lundunum og fiskisúpunni eru myndskreyting frá Unsplash (norbert velescu, Bianca Fazacas, Harrison Chang) og sýna ekki staðinn sjálfan.',
  'Ekkert er fullyrt um stofnár eða eigendur, og heimilisfangið fylgir eigin skráningu staðarins á Facebook, enda nota vefskrár fleiri en eitt heimilisfang.',
]

export const NAV = [
  { id: 'matsedill', label: 'Matseðill' },
  { id: 'sagan', label: 'Sagan' },
  { id: 'alfaborg', label: 'Álfaborg' },
  { id: 'lundar', label: 'Lundar' },
  { id: 'hvar', label: 'Á leiðinni' },
] as const
