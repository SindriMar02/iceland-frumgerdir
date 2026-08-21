import type { PreviewCompany } from '../companies'

/**
 * Christopher Lund, ljósmyndari — chris.is (Wix).
 * Facts read off his own rendered site 2026-08-14/15, re-harvested 2026-08-21:
 * Langholtsvegur 126, 104 Reykjavík, s. 822 7601. Book facts from his own
 * /baekur page: "Iceland, Contrasts in Nature", 25×25 cm, 144 síður, 130
 * landslagsmyndir teknar á 10 árum, Gardamatt smooth 170g, harðspjalda; 12
 * valdar myndir sýndar í Gallery Grásteini. Sýningin VITNI í Ljósmyndasafni
 * Reykjavíkur sumarið 2020. Service copy (printer/scanner models, book and
 * publisher credits) and every testimonial are quoted from his own
 * /prentun-tilbod, /copy-of-litgreining, /myndvinnsla and /umsagnir pages,
 * fetched 2026-08-21. His About page: 20+ ára starf á Íslandi, í Noregi og
 * Danmörku, fjögur tungumál; "ljósmyndari, eiginmaður, faðir, stjúpfaðir,
 * afi og nörd". Photography, logo and the 1% For The Planet badge are his
 * own site assets, harvested at full resolution behind Wix's thumbnail
 * transforms. No email is shown anywhere on his site, so none appears here.
 */

const BASE = import.meta.env.BASE_URL

export interface ClPhoto { src: string; alt: string; ratio: string }

const P = (name: string, alt: string, ratio: string): ClPhoto => ({
  src: `${BASE}chrislund/${name}-1920.jpg`,
  alt,
  ratio,
})

export const srcSet = (src: string) =>
  `${src.replace('-1920.jpg', '-960.jpg')} 960w, ${src} 1920w`

export const PHOTO = {
  vestrahorn: P('vestrahorn', 'Snævi þakin fjöll og lítil mannvera í hvítri víðáttu', '4 / 3'),
  thoka: P('thoka', 'Klettur í hafþoku, sjórinn spegilsléttur', '4 / 5'),
  klettur: P('vitni-klettur', 'Svarthvít mynd: manneskja á klettabrún í úða', '3 / 4'),
  byggingBlalys: P('bygging-blalys', 'Nútímabygging að innan, bogadregnir veggir í blárri lýsingu', '1 / 1'),
  corten: P('corten', 'Íbúðarhús með ryðstálsklæðningu og grjóthleðslu', '3 / 2'),
  halendi: P('halendi', 'Grænar hlíðar og dökkur sandur á hálendinu', '3 / 2'),
  landrover: P('landrover', 'Gamall Land Rover í djúpum snjó', '4 / 3'),
  sandalda: P('sandalda', 'Sandalda í mjúkri síðdegisbirtu', '3 / 2'),
  timburhus: P('timburhus', 'Timburklædd bygging, mynstur í klæðningunni', '4 / 5'),
  stigi: P('stigi', 'Bogadreginn steinsteyptur stigi og hreinar línur', '2 / 3'),
  syningarsalur: P('syningarsalur', 'Sýningarsalur safns með upplýstum sýningargripum', '4 / 3'),
  fyrirtaekiLid: P('fyrirtaeki-lid', 'Þrjú í hvítum sloppum við vinnu á rannsóknarstofu', '3 / 2'),
  radstefna: P('radstefna', 'Hópur á upplýstu ráðstefnusviði', '3 / 2'),
  gagnaver: P('gagnaver', 'Tveir starfsmenn milli tölvuskápa í gagnaveri', '3 / 2'),
  velmenni: P('velmenni', 'Starfsmaður við gulan vélarm í framleiðslusal', '1920 / 1304'),
  eldsyning: P('eldsyning', 'Eldlistafólk sveiflar logum í myrkri', '1 / 1'),
  folkBarn: P('folk-barn', 'Svarthvít mynd af brosandi barni við glugga', '4 / 3'),
  portrettBw: P('portrett-bw', 'Svarthvítt portrett af manni í mjúkri hliðarbirtu', '1 / 1'),
  portrettMadur: P('portrett-madur', 'Svarthvítt portrett, horft til hliðar', '3 / 2'),
  ferming: P('ferming', 'Fermingardrengur í jakkafötum við dökkan bakgrunn', '1920 / 1387'),
  brudkaupStrond: P('brudkaup-strond', 'Brúðhjón hoppa á svartri strönd, svarthvít mynd', '4 / 5'),
  brudkaupVetur: P('brudkaup-vetur', 'Brúðhjón á snævi þöktu hrauni í lágri vetrarsól', '3 / 2'),
  brudkaupGraent: P('brudkaup-graent', 'Brúðhjón í grænum garði', '1920 / 1624'),
  sjor: P('sjor', 'Sléttur sjór og himinn renna saman í mjúkri birtu', '5 / 4'),
  christopher: P('christopher', 'Christopher Lund við sjóinn', '16 / 9'),
  eftirtokustandur: P('eftirtokustandur', 'Myndavél á eftirtökustandi yfir ljósaborði', '5 / 7'),
  filmur: P('filmur', 'Filmuræmur á ljósaborði', '5 / 7'),
  bokA1: P('bok-a1', 'Stuðlaberg og ísskarir við jökulvatn, loftmynd úr bókinni', '728 / 545'),
  bokA2: P('bok-a2', 'Skærgrænar hlíðar og dökkur skriðusandur, opna úr bókinni', '728 / 545'),
  bokB1: P('bok-b1', 'Blár ísveggur og fossandi vatn, opna úr bókinni', '529 / 739'),
  bokB2: P('bok-b2', 'Melgresi og loftbólur frosnar í ís, opna úr bókinni', '528 / 738'),
}

export const LOGO = {
  lockup: `${BASE}chrislund/logo-lockup.jpg`,
  onePercent: `${BASE}chrislund/onepercent.jpg`,
}

/* ── The catalogue ──────────────────────────────────────────────────────────
   Every work is his own photograph, harvested from his own galleries. Titles
   are descriptive of what is IN the frame, never invented place names or
   dates. `wall` = hangs on the exhibition wall on the front page.
   `print` = his own Landslag gallery line: "FineArt Prent eða til birtinga". */

export type SeriesKey = 'landslag' | 'arkitektur' | 'fyrirtaeki' | 'folk' | 'brudkaup' | 'vitni'

export interface Work {
  id: string
  photo: ClPhoto
  title: string
  series: SeriesKey
  note: string
  wall?: boolean
  print?: boolean
}

export const WORKS: Work[] = [
  /* Landslag */
  { id: 'thoka', photo: PHOTO.thoka, title: 'Klettur í hafþoku', series: 'landslag', wall: true, print: true,
    note: 'Sjórinn spegilsléttur og kletturinn einn í þokunni. Ein af landslagsmyndunum úr tíu ára ferðum um landið.' },
  { id: 'halendi', photo: PHOTO.halendi, title: 'Grænar hlíðar hálendisins', series: 'landslag', wall: true, print: true,
    note: 'Mosagrænar hlíðar á móti dökkum sandi. Andstæðurnar sem bókin hans dregur nafn sitt af.' },
  { id: 'sjor', photo: PHOTO.sjor, title: 'Sjór og himinn', series: 'landslag', wall: true, print: true,
    note: 'Löng lýsing þar sem sjór og himinn renna saman í eina mjúka birtu.' },
  { id: 'vestrahorn', photo: PHOTO.vestrahorn, title: 'Snævi þakin fjöll', series: 'landslag', print: true,
    note: 'Lítil mannvera í hvítri víðáttu undir snævi þöktum tindum.' },
  { id: 'landrover', photo: PHOTO.landrover, title: 'Land Rover í snjó', series: 'landslag', wall: true, print: true,
    note: 'Gamli Land Roverinn í djúpum snjó. Christopher segist sjálfur elska ljósmyndun, ferðalög og Land Rover.' },
  { id: 'sandalda', photo: PHOTO.sandalda, title: 'Sandalda', series: 'landslag', print: true,
    note: 'Mjúkar línur sandöldunnar í lágri birtu, tekin á ferðum erlendis.' },
  /* Arkitektúr */
  { id: 'blalys', photo: PHOTO.byggingBlalys, title: 'Bogadregnir veggir', series: 'arkitektur', wall: true,
    note: 'Nútímabygging að innan, bogadregnir veggir í blárri lýsingu. Byggingar utan og innan, ásamt innanhússhönnun.' },
  { id: 'timburhus', photo: PHOTO.timburhus, title: 'Timburklædd bygging', series: 'arkitektur', wall: true,
    note: 'Mynstrið í timburklæðningunni á móti gleri, séð neðan frá.' },
  { id: 'corten', photo: PHOTO.corten, title: 'Ryðstál og grjót', series: 'arkitektur',
    note: 'Íbúðarhús með ryðstálsklæðningu og grjóthleðslu, efniviðurinn í aðalhlutverki.' },
  { id: 'stigi', photo: PHOTO.stigi, title: 'Bogadreginn stigi', series: 'arkitektur',
    note: 'Hreinar línur og bogadregin steinsteypa, arkitektúrinn sjálfur fær að tala.' },
  { id: 'syningarsalur', photo: PHOTO.syningarsalur, title: 'Sýningarsalur', series: 'arkitektur',
    note: 'Upplýstir sýningargripir í dempaðri lýsingu safns.' },
  /* Fyrirtæki */
  { id: 'rannsoknarstofa', photo: PHOTO.fyrirtaekiLid, title: 'Á rannsóknarstofunni', series: 'fyrirtaeki',
    note: 'Ímyndar- og starfsmannamyndir, teknar á staðnum í raunverulegu vinnuumhverfi.' },
  { id: 'radstefna', photo: PHOTO.radstefna, title: 'Á ráðstefnusviðinu', series: 'fyrirtaeki',
    note: 'Viðburðir og ráðstefnur, hér fyrir LS Retail. Fyrirtækjamyndir fyrir ársskýrslur, vefi og bæklinga.' },
  { id: 'gagnaver', photo: PHOTO.gagnaver, title: 'Í gagnaverinu', series: 'fyrirtaeki',
    note: 'Starfsfólk í sínu rétta umhverfi, milli tölvuskápa í gagnaveri.' },
  { id: 'velmenni', photo: PHOTO.velmenni, title: 'Í framleiðslusalnum', series: 'fyrirtaeki',
    note: 'Iðnaður og framleiðsla, starfsmaður við gulan vélarm.' },
  { id: 'eldsyning', photo: PHOTO.eldsyning, title: 'Eldsýning', series: 'fyrirtaeki',
    note: 'Viðburðaljósmyndun, logarnir teiknaðir í myrkrið.' },
  /* Fólk */
  { id: 'barn', photo: PHOTO.folkBarn, title: 'Barn við glugga', series: 'folk',
    note: 'Barna- og fjölskyldumyndir í mjúkri dagsbirtu.' },
  { id: 'portrett', photo: PHOTO.portrettBw, title: 'Portrett í hliðarbirtu', series: 'folk',
    note: 'Svarthvítt portrett í mjúkri hliðarbirtu.' },
  { id: 'portrett-2', photo: PHOTO.portrettMadur, title: 'Portrett', series: 'folk',
    note: 'Portrettmyndataka í stúdíói eða á staðnum.' },
  { id: 'ferming', photo: PHOTO.ferming, title: 'Fermingardrengurinn', series: 'folk',
    note: 'Fermingarmyndir, í stúdíói eða úti.' },
  /* Brúðkaup */
  { id: 'brudkaup-strond', photo: PHOTO.brudkaupStrond, title: 'Á svartri strönd', series: 'brudkaup',
    note: 'Fréttaljósmyndun fremur en uppstilling: augnablikið eins og það gerðist.' },
  { id: 'brudkaup-vetur', photo: PHOTO.brudkaupVetur, title: 'Í vetrarsól', series: 'brudkaup',
    note: 'Brúðhjón á snævi þöktu hrauni í lágri vetrarsól.' },
  { id: 'brudkaup-graent', photo: PHOTO.brudkaupGraent, title: 'Í garðinum', series: 'brudkaup',
    note: 'Brúðarmyndataka úti, augnablik fremur en uppstilling.' },
  /* Vitni */
  { id: 'vitni', photo: PHOTO.klettur, title: 'Vitni', series: 'vitni', wall: true, print: true,
    note: 'Úr sýningunni VITNI í Ljósmyndasafni Reykjavíkur sumarið 2020: vélinni snúið að ferðamanninum sjálfum.' },
]

export const SERIES_META: Array<{ key: SeriesKey; name: string; note: string }> = [
  { key: 'fyrirtaeki', name: 'Fyrirtæki', note: 'Ímyndar- og starfsmannamyndir, ársskýrslur, ráðstefnur' },
  { key: 'landslag', name: 'Landslag', note: 'FineArt-myndir frá tíu ára ferðum um landið' },
  { key: 'folk', name: 'Fólk', note: 'Portrett, barna- og fjölskyldumyndir, fermingar' },
  { key: 'brudkaup', name: 'Brúðkaup', note: 'Fréttaljósmyndun fremur en uppstilling' },
  { key: 'arkitektur', name: 'Arkitektúr', note: 'Byggingar utan og innan, innanhússhönnun' },
  { key: 'vitni', name: 'Vitni', note: 'Sýning í Ljósmyndasafni Reykjavíkur, sumarið 2020' },
]

export const seriesName = (key: SeriesKey) => SERIES_META.find((s) => s.key === key)?.name ?? key

/** Series picker on the front page: one representative work per series. */
export const SERIES = SERIES_META.map((s) => ({
  ...s,
  photo: WORKS.find((w) => w.series === s.key && !w.wall)?.photo ?? WORKS.find((w) => w.series === s.key)!.photo,
}))

/** The book, specs verbatim from his own /baekur page. */
export const BOOK = {
  title: 'Iceland, Contrasts in Nature',
  specLine: '25 × 25 cm · 144 síður · 130 landslagsmyndir · Gardamatt smooth 170g · harðspjalda',
  pairs: [
    { a: PHOTO.bokA1, b: PHOTO.bokA2, cap: 'Stuðlaberg á móti litríkum fjöllum' },
    { a: PHOTO.bokB1, b: PHOTO.bokB2, cap: 'Ís á móti jarðhita' },
  ],
}

/* ── Þjónusta: Frá töku að prenti ───────────────────────────────────────────
   Three pages mirroring his own service pages. All gear, formats, book and
   publisher credits are from his own copy, fetched 2026-08-21. */

export interface Testimonial { quote: string; name: string; org: string }

export const TESTIMONIALS: Record<string, Testimonial> = {
  rax: {
    quote: 'Chris er einstakur fagmaður á sínu sviði og við höfum átt afar farsælt samstarf í myndvinnslu fyrir bækur mínar og prent.',
    name: 'Ragnar Axelsson', org: 'ljósmyndari',
  },
  i8: {
    quote: 'Margir af þeim listamönnum sem við vinnum með láta Chris prenta allt fyrir sig. Við höfum unnið ótal verkefni með honum í gegnum árin og skiptir þar mestu skilningur hans á okkar kröfum.',
    name: 'Börkur Arnarson', org: 'i8 Gallery',
  },
  nesutgafan: {
    quote: 'Við höfum unnið með Christopher Lund við gerð ýmissa bókverka, m.a. stóru Kjarvalsbókarinnar. Hann er frábær fagmaður í ljósmyndun og myndvinnslu, vandvirkur, áreiðanlegur og þægilegur að vinna með.',
    name: 'Erna Sörensen og Einar Matthíasson', org: 'Nesútgáfan',
  },
  crymogea: {
    quote: 'Hvort sem það er ljósmyndun, myndvinnsla eða undirbúningur ljósmynda fyrir prentun, allt þetta hefur hann leyst fumlaust og vel og alltaf með sama yfirvegaða og ljúfa fasinu.',
    name: 'Kristján B. Jónsson', org: 'Crymogea',
  },
  lsretail: {
    quote: 'Chris er eflaust einn sá besti ljósmyndari sem ég hef unnið með, og það er sönn ánægja og heiður að vinna með honum.',
    name: 'Magnús Norðdahl', org: 'LS Retail',
  },
}

export interface ServicePage {
  slug: string
  nr: string
  name: string
  title: string
  intro: string
  photos: Array<{ photo: ClPhoto; cap: string }>
  facts: Array<[string, string]>
  blocks: Array<{ h: string; body: string[] }>
  steps?: Array<{ h: string; b: string }>
  register?: { h: string; note: string; items: Array<{ name: string; note: string }>; foot: string }
  quotes: string[]
}

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'prentun',
    nr: '01',
    name: 'FineArt prentun',
    title: 'Prent sem endist.',
    intro:
      'FineArt prentun er bleksprautuprentun með pigment-bleki á vottaðan, sýrufrían pappír. Hún tryggir gæði og endingu sem myndlistarfólk og ljósmyndarar sækjast eftir við prentun verka sinna.',
    photos: [
      { photo: PHOTO.halendi, cap: 'Landslagsmyndirnar úr bókinni fást sem FineArt prent.' },
    ],
    facts: [
      ['Prentari', 'Epson SC-P9500'],
      ['Blek', 'Epson UltraChrome Pro 12'],
      ['Litrófið', 'Meiri litmettun og dýpri svörtur en hefðbundinn ljósmyndapappír gefur'],
      ['Pappír', 'Vottaður og sýrufrír: mattur, luster eða háglans'],
    ],
    blocks: [
      {
        h: 'Pappírinn ræður mestu',
        body: [
          'Tæki og tól ein og sér tryggja ekki bestu mögulegu útkomu. Vinna þarf hverja mynd í myndvinnslu og aðlaga hana prentferlinu, og þar hefur pappírstegundin mest að segja: mattur pappír hegðar sér öðruvísi en luster eða háglans, og hvítan í pappírnum litar björtustu svæði myndarinnar.',
          'Christopher hefur áralanga þjálfun í að vinna hágæða myndir og prentar jafnt eigin verk sem verk annarra ljósmyndara og myndlistarfólks.',
        ],
      },
    ],
    steps: [
      { h: 'Sendu myndirnar', b: 'Í tölvupósti eða með WeTransfer eða Dropbox þegar skrárnar eru stórar eða margar.' },
      { h: 'Staðfesting', b: 'Christopher staðfestir móttöku og fer yfir pappírsval með þér.' },
      { h: 'Tilbúið', b: 'Þú færð að vita um leið og prentin eru tilbúin til afhendingar.' },
    ],
    quotes: ['i8'],
  },
  {
    slug: 'skonnun',
    nr: '02',
    name: 'Skönnun og eftirtökur',
    title: 'Filman í fulla upplausn.',
    intro:
      'Hágæða skönnun á svarthvítum filmum og litfilmum, jafnt negatífum sem pósitífum. Tekið er við 35mm, 120mm og blaðfilmum í allt að 4×5" stærð, auk hefðbundinna pappírsmynda.',
    photos: [
      { photo: PHOTO.eftirtokustandur, cap: 'Eftirtökustandurinn með ljósaborði.' },
      { photo: PHOTO.filmur, cap: 'Filmuræmur á ljósaborðinu.' },
    ],
    facts: [
      ['Myndavélar', '50MP Pentax eða 100MP Hasselblad á eftirtökustandi'],
      ['Ljósaborð', '99 CRI'],
      ['Filmuskanni', 'Imacon 949 þegar það hentar betur'],
      ['Flatbed', 'Epson Pro V-850 fyrir pappírsmyndir'],
      ['Filmustærðir', '35mm, 120mm og blaðfilmur í allt að 4×5"'],
      ['Skil', 'Hráskönnun í fullri upplausn eða fullunnin, litgreind og rykhreinsuð mynd'],
    ],
    blocks: [
      {
        h: 'Eftirtökur af listaverkum',
        body: [
          'Christopher annast eftirtökur af teikningum, málverkum og öðrum listaverkum, stórum sem smáum, og tekur einnig að sér ljósmyndun á listsýningum hvers konar.',
        ],
      },
    ],
    quotes: ['crymogea'],
  },
  {
    slug: 'litgreining',
    nr: '03',
    name: 'Litgreining og myndvinnsla',
    title: 'Litirnir skila sér alla leið.',
    intro:
      'Þegar gefa á út veglegar listaverka- eða ljósmyndabækur skiptir myndvinnsla og litgreining öllu máli. Þjálfunin byrjaði í myrkraherberginu á unglingsárunum og þróaðist út í stafræna vinnslu í kringum 1996.',
    photos: [
      { photo: PHOTO.filmur, cap: 'Frummyndirnar á ljósaborðinu, fyrsta skrefið í litgreiningunni.' },
    ],
    facts: [
      ['Frá', 'Myrkraherbergi á unglingsárum, stafræn vinnsla frá 1996'],
      ['Prentaðferðir', 'Fjórlitur CMYK, Duotone og Tritone'],
      ['Hlutverkið', 'Skönnun frummynda, umsjón aðsends myndefnis, samræmt heildarútlit'],
    ],
    blocks: [
      {
        h: 'Reynslan',
        body: [
          'Fyrstu árin í stafrænni vinnslu voru lærdómsrík: litstýring í tölvum var afar takmörkuð og ICC litaprófílar ekki komnir fram, svo hann þurfti að setja sig djúpt inn í hvernig best er að varpa litum á milli litrýmda ólíkra miðla. Prentaðferðir og pappírstegundir hafa áhrif á liti og skerpu, og smátt og smátt hefur safnast í reynslubankann.',
        ],
      },
      {
        h: 'Með Ragnari Axelssyni',
        body: [
          'Christopher hefur átt náið samstarf við Ragnar Axelsson. Bækur hans, Veiðimenn Norðursins, Fjallaland, Andlit Norðursins og Jöklar, eru ýmist prentaðar í fjórlit, Duotone eða Tritone, og tveimur þeirra fylgdi hann alla leið í prentsmiðjuna EBS í Veróna á Ítalíu.',
        ],
      },
    ],
    register: {
      h: 'Bækurnar',
      note: 'Listamenn sem Christopher hefur annast myndvinnslu og litgreiningu fyrir:',
      items: [
        { name: 'Kjarval', note: 'stóra Kjarvalsbókin' },
        { name: 'Svavar Guðnason', note: 'listaverkabók' },
        { name: 'Eggert Pétursson', note: 'listaverkabók' },
        { name: 'Mikines', note: 'færeyski listmálarinn' },
        { name: 'Nína Sæmundsson', note: 'listaverkabók' },
        { name: 'Ragna Róbertsdóttir', note: 'listaverkabók' },
      ],
      foot: 'Meðal útgefenda: Forlagið, JPV útgáfa, Crymogea og Nesútgáfan. Meðal ljósmyndara: Ragnar Axelsson, Páll Stefánsson, Spessi, Einar Falur og Thorsten Henn.',
    },
    quotes: ['nesutgafan', 'rax'],
  },
]

export const SERVICES = SERVICE_PAGES.map((p) => ({ slug: p.slug, name: p.name, nr: p.nr }))

export const CONTACT = {
  phone: '822 7601',
  phoneHref: 'tel:+3548227601',
  address: 'Langholtsvegur 126, 104 Reykjavík',
} as const

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Photographer',
  name: 'Christopher Lund ljósmyndari',
  telephone: '+354 822 7601',
  url: 'https://www.chris.is',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Langholtsvegur 126',
    postalCode: '104',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  knowsAbout: ['Landslagsljósmyndun', 'Fyrirtækjaljósmyndun', 'Arkitektúrljósmyndun', 'FineArt prentun'],
}

export const companyEntry: PreviewCompany = {
  slug: 'chrislund',
  route: '/preview/chrislund',
  name: 'Christopher Lund ljósmyndari',
  sector: 'Ljósmyndun',
  location: 'Langholtsvegur 126, 104 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: '20+ ár á Íslandi, í Noregi og Danmörku',
  currentUrl: 'https://www.chris.is',
  ownerEmail: '',
  concept: 'Úrvalið',
  conceptTagline:
    'Hann tók 130 myndir í bókina og hengdi 12 upp á vegg. Vefurinn hans á að vera sá veggur, ekki 311 pixla smámyndagrind.',
  accent: '#A98147',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}chrislund/vestrahorn-960.jpg`,
  ownPhotography: true,
  photoCredit:
    'Allar myndir, merkið og 1%-merkið eru af vef Christophers (chris.is), sótt í fullri upplausn í ágúst 2026.',
  audit: {
    strengths: [
      'Verk í hæsta gæðaflokki: landslag, arkitektúr og fyrirtækjamyndir',
      'Útgefin bók (130 myndir, 144 síður) og sýning í Ljósmyndasafni Reykjavíkur',
      'Skýr þjónustulína: FineArt prentun, skönnun, litgreining',
    ],
    weaknesses: [
      'Forsíðan hefur 0 fyrirsagnir og 0 stafi af lesanlegum texta',
      'Myndasafnið birtir stærstu myndir í 311 pixlum; bókarsíðan í 472',
      'Galleríin heita „copy-of-arkitektúr“ og „Myndagallery“ í leitarvélum',
    ],
    opportunities: [
      'Láta vefinn hanga eins og sýningarvegg: fáar myndir, í fullri stærð',
      'Bókin og sýningin eru sönnunargögnin; 130 á móti 12 er sagan um úrvalið',
    ],
  },
  positioning:
    'Christopher Lund hefur ljósmyndað í yfir tuttugu ár og gefið út bók með 130 landslagsmyndum, en sýndi aðeins tólf þeirra á vegg. Vefurinn er byggður á þeirri ritstjórn: sýningarveggur sem gengið er eftir, ein mynd í einu, í fullri stærð.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Christopher Lund',
    body:
      'Sæll Christopher,\n\n' +
      'Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki. Ég skoðaði chris.is og staldraði við Vitni, sýninguna sem þú settir upp í Ljósmyndasafni Reykjavíkur sumarið 2020. Að snúa vélinni að ferðamanninum sjálfum, einmitt sumarið sem hann var hvergi, er hugmynd sem stendur enn.\n\n' +
      'Eitt rakst ég þó á. Á verkefnasíðunni birtast myndirnar 311 pixla breiðar og á bókarsíðunni 472, og forsíðan hefur hvorki fyrirsagnir né lesanlegan texta, þannig að Google hefur ekkert að lesa á henni. Ein slóðin heitir enn copy-of-arkitektur.\n\n' +
      'Ég setti saman frumgerð að vef sem hangir eins og sýningarveggur: fáar myndir í fullri stærð, gengið eftir þeim einni í einu, með bókinni og sýningunni í öndvegi. Allar myndir og merki á síðunni eru þín eigin.\n\n' +
      'Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.\n\n' +
      'Hana má skoða hér hvenær sem er, og hún virkar vel í síma:\n[HLEKKUR Á FRUMGERÐ]\n\n' +
      'Ef þér líst á er ég til í að heyra frá þér, en ef ekki er það að sjálfsögðu allt í lagi.\n\n' +
      'Bestu kveðjur,\nSindri Már\n845 1758\nsndr-studio.pages.dev',
  },
}
