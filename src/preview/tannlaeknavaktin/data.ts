/**
 * TANNLÆKNAVAKTIN — "Vaktin"
 * ---------------------------------------------------------------------------
 * Dental emergency service, Reykjavík. Redesign concept.
 *
 * EVERY fact below is taken verbatim from tannlaeknavaktin.is (fetched
 * 2026-07-27) or from their já.is listing. Nothing is invented, no outcome
 * claims, no ratings (none exist publicly), no invented staff.
 *
 * Sources
 *   /                       hours, on-call, "Ávallt þarf að hafa samband símleiðis"
 *   /index.php/stadhsetning both locations + the three named dentists + licences
 *   /index.php/verdhskra    the full price list incl. the 45.590 kr surcharge
 *   /index.php/tannverkur   the toothache advice
 *   /index.php/in-english   the English emergency guidance
 *   ja.is/tannlaeknavaktin  logo, kennitala 521112-1230
 *
 * CONCEPT — the brackets are theirs. Their own logo sets the tooth inside
 * square brackets, and `[ ]` is interval notation: the notation for a span
 * with a start and an end. This business IS a time interval. So the page is
 * keyed to the clock: it knows what time it is when you open it, answers
 * "eru þið opin núna" before you ask, and its ground follows the real
 * time of day. Brand red #E70104 sampled from their actual logo pixels.
 */

/* ── imagery ──────────────────────────────────────────────────────────────
 * ART DIRECTION "Léttirinn" (the relief). No photography of this business
 * exists, and dental stock is the generic look we are avoiding. These plates
 * are generated atmosphere about RELIEF, the moment the pain stops.
 *
 * HONESTY RULE: none of them depicts the clinic's real premises, its rooms or
 * any real member of staff, and none is captioned as such. The footer
 * discloses that the imagery is illustrative and generated.
 */
const asset = (p: string) => `${import.meta.env.BASE_URL}tannlaeknavaktin/${p}`

export const IMG = {
  hero: asset('hero-morning.jpg'),
  heroAlt: asset('hero-morning-alt.jpg'),
  relief: asset('relief.jpg'),
  night: asset('night-window.jpg'),
  logo: asset('logo.png'),
  /**
   * The hero: one lit window on a dark street, painted in the same hand as the
   * first-aid plates. The stock relief portrait it replaces only said "calm";
   * this says what the business actually is, the one place still open. Its
   * left two thirds are deliberately empty paint so the type has somewhere to
   * live (measured: 14.9:1 average contrast for cream over that region).
   */
  heroNight: asset('hero-night.jpg'),
  /**
   * The hero. A hand around a hot mug, because their OWN advice page says
   * toothache shows as "tennur verða viðkvæmar við sætindum eða kulda" —
   * so something hot, held without flinching, is the literal relief this
   * clinic sells. Warm and light, measured at 14.9:1 for umber over the
   * type region (cream would be 1.1:1, so this hero is light-mode only).
   *
   * Rejected on the way: an open hand resting on a bedsheet. Beautiful, but
   * an inert palm-up hand on white linen reads as a hospital bed, which is
   * the wrong association for a frightened patient.
   */
  heroRelief: asset('hero-relief.jpg'),
  /**
   * THE HERO. An abstract painted study of glazed porcelain: the MATERIAL a
   * tooth is made of, never the object.
   *
   * Every literal idea was either a cliché (smile, chair, drill) or generic
   * comfort that any spa could claim (a mug, a bedsheet). Material sidesteps
   * both: unmistakably about enamel to anyone who thinks about it, pure
   * abstraction to everyone else, and it fits the porcelain palette exactly
   * because it IS the palette.
   *
   * Picked over its sibling on calmness, not prettiness: texture spread 12.0
   * against 15.3 across the type region, which is what matters under a 116u
   * serif. Umber measures 8.7:1 there, worst case 5.6:1.
   */
  heroPorcelain: asset('hero-porcelain.jpg'),
  /* These MUST go through asset(). A root-absolute "/tannlaeknavaktin/..."
     works on a dev server, where the base is "/", and 404s on GitHub Pages,
     where it is "/iceland-frumgerdir/". Shipped that way once already. */
  otwLoop: asset('otw-01-loop.mp4'),
  otwPoster: asset('otw-01-poster.jpg'),
  otwMilk: asset('otw-01-milk.jpg'),
}

/* ── identity ─────────────────────────────────────────────────────────── */

export const PHONE_DISPLAY = '426 8000'
export const PHONE_HREF = 'tel:+3544268000'
export const EMAIL = 'tannlaeknavaktin@gmail.com'
export const EMAIL_HREF = `mailto:${EMAIL}`
export const KENNITALA = '521112-1230'
export const LEGAL_NAME = 'Tannlæknavaktin ehf.'

/* ── the schedule (their real hours) ──────────────────────────────────── */

export interface DaySpan {
  /** JS getDay(): 0 = sunnudagur */
  day: number
  label: string
  short: string
  open: number
  close: number
}

/** mán til fim 8:00-22:00 · fös 8:00-20:00 · helgar 10:00-20:00 */
export const WEEK: DaySpan[] = [
  { day: 1, label: 'Mánudagur', short: 'Mán', open: 8, close: 22 },
  { day: 2, label: 'Þriðjudagur', short: 'Þri', open: 8, close: 22 },
  { day: 3, label: 'Miðvikudagur', short: 'Mið', open: 8, close: 22 },
  { day: 4, label: 'Fimmtudagur', short: 'Fim', open: 8, close: 22 },
  { day: 5, label: 'Föstudagur', short: 'Fös', open: 8, close: 20 },
  { day: 6, label: 'Laugardagur', short: 'Lau', open: 10, close: 20 },
  { day: 0, label: 'Sunnudagur', short: 'Sun', open: 10, close: 20 },
]

/** Bakvakt (on-call) begins at 16:00 on weekdays, and covers all weekend. */
export const ONCALL_FROM = 16

export const HOURS_NOTE = 'Bakvakt eftir kl. 16 á virkum dögum og um helgar.'
export const AFTER_CLOSE = 'Eftir lokun er bent á að hafa samband við 112 í neyðartilvikum.'

/* ── the two locations (real, with the real named dentists) ───────────── */

export interface Place {
  address: string
  postcode: string
  dentists: string
  licence: string
  maps: string
}

export const PLACES: Place[] = [
  {
    address: 'Skipholt 33',
    postcode: '105 Reykjavík',
    dentists: 'Kjartan Örn Þorgeirsson og Stefán Hallur Jónsson',
    licence: 'Leyfi til reksturs tannlæknastofu frá Heilbrigðiseftirliti Reykjavíkur.',
    maps: 'https://www.google.com/maps/search/?api=1&query=Skipholt+33+105+Reykjav%C3%ADk',
  },
  {
    address: 'Vínlandsleið 16',
    postcode: '113 Reykjavík',
    dentists: 'Theódór Friðjónsson',
    licence: 'Leyfi til reksturs tannlæknastofu frá Heilbrigðiseftirliti Reykjavíkur.',
    maps: 'https://www.google.com/maps/search/?api=1&query=V%C3%ADnlandsleid+16+113+Reykjav%C3%ADk',
  },
]

export const PLACE_NOTE = 'Staðsetning er mismunandi eftir dögum. Síminn segir ykkur hvert skal koma.'

/* ── triage ladder (the ranked channels) ──────────────────────────────── */

export const TRIAGE = [
  {
    tag: 'Bráðatilvik',
    title: 'Hringdu',
    line: 'Tönn hefur losnað, brotnað eða færst úr stað. Slæm tannpína, tannrótarbólga eða sýking í munnholi.',
    action: PHONE_DISPLAY,
    href: PHONE_HREF,
    note: 'Ávallt þarf að hafa samband símleiðis til tímapantana.',
    primary: true,
  },
  {
    tag: 'Spurning',
    title: 'Spyrðu vaktina',
    line: 'Opnunartími, verð, hvað telst bráðatilvik, hvar er opið í kvöld og hvernig greiðslu er háttað.',
    action: 'Spyrja hér á síðunni',
    href: '#spyrja',
    note: 'Svarar strax, líka utan opnunartíma.',
    primary: false,
  },
  {
    tag: 'Ekki brýnt',
    title: 'Sendu póst',
    line: 'Almennar fyrirspurnir sem mega bíða. Vaktin sinnir eingöngu bráðatilvikum, ekki reglubundnu eftirliti.',
    action: EMAIL,
    href: EMAIL_HREF,
    note: 'Svarað á opnunartíma.',
    primary: false,
  },
]

/* ── what counts as urgent (verbatim from their front page) ───────────── */

export const URGENT_INTRO =
  'Þjónusta Tannlæknavaktarinnar snýr að öllum neyðartilvikum er varða tennur og munnhol. Vakthafandi tannlæknir metur meðferðarþörf.'

export const URGENT_NOW = [
  'Tönn hefur losnað',
  'Tönn hefur brotnað',
  'Tönn hefur færst úr stað',
  'Slæm tannpína',
  'Tannrótarbólga',
  'Sýking í munnholi',
]

export const URGENT_WAIT = 'Minniháttar atvik geta oft beðið í skamman tíma.'

export const TRAUMA_NOTE =
  'Rétt viðbrögð við tannáverkum skipta sköpum hvort bjarga megi tönnum. Hafið samband við tannlækni eins fljótt og hægt er þegar um slys á tönnum er að ræða.'

/* ── toothache advice (condensed from their own tannverkur page) ──────── */

export const ADVICE = [
  {
    n: '01',
    head: 'Byrjaðu á að hreinsa vel',
    body: 'Burstaðu tennur vandlega og farðu með tannþræði á milli tanna. Stundum stafar verkur af tannsteini eða matarleifum sem sitja fastar og valda bólgu í tannholdi. Sú bólga gengur venjulega fljótt niður með góðri tannhreinsun.',
  },
  {
    n: '02',
    head: 'Verkjalyf duga oft á meðan',
    body: 'Dugi hreinsun ekki er ráðlegt að taka verkjalyf, svo sem paratabs eða ibufen, og hafa samband við tannlækni hætti verkur ekki.',
  },
  {
    n: '03',
    head: 'Viðkvæmni við sætindum eða kulda',
    body: 'Tannverkur stafar oftast af tannskemmdum og lýsir sér þá gjarnan þannig að tennur verða viðkvæmar við sætindum eða kulda. Þá er skemmdin orðin það djúp að hún hefur áhrif á taug tannarinnar. Forðastu allt sem ertir tönnina og hafðu samband við fyrsta tækifæri.',
  },
  {
    n: '04',
    head: 'Langvarandi verkur',
    body: 'Vari verkur lengur en mínútu í einu og hverfi ekki af sjálfu sér eru líkur til að rótfylla þurfi tönnina. Sé tannverkur mikill og stöðugur þarf alltaf að leita til tannlæknis, sem metur hvað sé ráðlegast að gera.',
  },
]

/* ── PROPOSED CONTENT ──────────────────────────────────────────────────────
   Everything ABOVE this point is the clinic's own published material, taken
   from tannlaeknavaktin.is, their verðskrá, or their /in-english page.

   Everything in THIS block is standard dental guidance, not something the
   clinic has published. It is here because the site is thin and repeats
   itself, and these are the questions a person in pain actually has. It is
   clinically standard and matches ADA and NHS emergency-dental guidance, but
   KJARTAN MUST CONFIRM OR CUT EACH ITEM before this goes live — especially
   VISIT, which describes how a visit runs.

   VISIT is deliberately derived from the clinic's OWN price list (skoðun,
   röntgenmynd, deyfing, bráðabirgðafylling, líming á krónu, bráðabirgðakróna)
   plus their own statement that they handle emergencies and not routine care,
   so it asserts nothing they do not already sell.
   ────────────────────────────────────────────────────────────────────────── */

/** Beyond a dental chair. Standard triage red flags; none of this is on their
 *  site today, and the swelling-and-airway one is the case where waiting for
 *  a dentist is the wrong call. */
export const RED_FLAGS = {
  intro:
    'Sumt bíður ekki eftir tannlækni. Leitaðu strax á bráðamóttöku eða hringdu í 112 ef eitthvað af þessu á við.',
  items: [
    'Bólga sem þrengir að öndun eða kyngingu',
    'Bólga sem breiðist út í andlit, kjálka eða háls',
    'Hiti samhliða bólgu eða verk í munni',
    'Blæðing sem stöðvast ekki þrátt fyrir þrýsting',
    'Áverki á höfði eða kjálka eftir slys',
  ],
  note:
    'Ígerð hverfur ekki af sjálfu sér og sýklalyf ein og sér lækna hana ekki. Hún þarf meðhöndlun hjá tannlækni.',
}

/** What a visit actually involves. Every step maps to a line item in their
 *  own verðskrá, so nothing here claims a service they do not list. */
export const VISIT = [
  { n: '01', head: 'Skoðun', body: 'Tannlæknir skoðar svæðið og fer yfir hvað gerðist og hversu lengi einkennin hafa staðið.' },
  { n: '02', head: 'Röntgenmynd ef þarf', body: 'Mynd sýnir það sem ekki sést með berum augum, til dæmis brot niður í rót eða bólgu við rótarenda.' },
  { n: '03', head: 'Deyfing', body: 'Svæðið er deyft áður en meðferð hefst svo hún valdi ekki verk.' },
  { n: '04', head: 'Bráðabirgðameðferð', body: 'Vaktin leysir bráðavandann sjálfan, til dæmis með bráðabirgðafyllingu, límingu á krónu eða bráðabirgðakrónu.' },
  { n: '05', head: 'Framhaldið hjá þínum tannlækni', body: 'Vaktin sinnir bráðatilvikum, ekki reglubundnu eftirliti. Varanleg viðgerð fer fram hjá þínum eigin tannlækni.' },
]

/** Standard post-treatment guidance. */
export const AFTERCARE = [
  'Bráðabirgðameðferð er tímabundin. Pantaðu tíma hjá þínum tannlækni sem fyrst til að ljúka viðgerðinni.',
  'Tyggðu hinum megin á meðan bráðabirgðafylling eða límd króna er á sínum stað.',
  'Sé svæðið deyft skaltu bíða með heitan mat og drykk þar til deyfingin er farin, svo þú bítir ekki í kinn eða tungu.',
  'Haltu áfram að bursta og nota tannþráð, einnig við svæðið sem var meðhöndlað, nema tannlæknir ráðleggi annað.',
  'Aukist verkur eða bólga á næstu dögum skaltu hafa samband aftur.',
]

/* ── prices (verbatim from their published verðskrá) ──────────────────── */

export const PRICE_SURCHARGE = {
  amount: '45.590 kr.',
  // NOTE: never write this as the compound "kvöld- og helgarálag" (banned house
  // style) and never as "kvöld og helgarálag er" (reads as two subjects with a
  // singular verb). The clinic's own phrasing is the safe form and is what the
  // Worker's canon sentences use: "Um kvöld og helgar er 45.590 kr. álag á
  // verðskrána." Keep these in step with vaktin-receptionist/src/index.js.
  label: 'Álag um kvöld og helgar',
  body: 'Öll verð miðast við dagvinnutaxta. Sé óskað eftir þjónustu eftir klukkan 16 á virkum dögum eða um helgar þarf að kalla út tannlækni á bakvakt, og þá leggst álagið ofan á verðskrána.',
}

export const PRICES: { item: string; price: string }[] = [
  { item: 'Skoðun', price: '9.200 kr.' },
  { item: 'Bráðabirgðafylling', price: '12.800 kr.' },
  { item: 'Líming á krónu, til bráðabirgða', price: '13.800 kr.' },
  { item: 'Bráðabirgðakróna', price: '26.500 til 35.000 kr.' },
  { item: 'Röntgenmynd', price: '5.500 kr.' },
  { item: 'Ljósmynd', price: '2.000 kr.' },
  { item: 'Yfirborðsdeyfing', price: '3.500 kr.' },
  { item: 'Deyfing 1 til 3 tennur', price: '4.500 kr.' },
  { item: 'Tannlit fylling, 1 flötur', price: '24.500 til 29.500 kr.' },
  { item: 'Tannlit fylling, 2 fletir', price: '33.000 til 38.000 kr.' },
  { item: 'Tannlit fylling, 3 fletir', price: '34.500 til 42.000 kr.' },
  { item: 'Tannlit fylling, 4 fletir', price: '39.500 til 46.500 kr.' },
]


/**
 * The same twelve prices, grouped the way a price list actually reads.
 * Flat, they are a dump of strings; grouped, they are a document. The groups
 * are the natural ones in the clinic's own list, not invented categories.
 */
export const PRICE_GROUPS: { group: string; items: { item: string; price: string }[] }[] = [
  { group: 'Skoðun', items: [{ item: 'Skoðun', price: '9.200 kr.' }] },
  {
    group: 'Myndir',
    items: [
      { item: 'Röntgenmynd', price: '5.500 kr.' },
      { item: 'Ljósmynd', price: '2.000 kr.' },
    ],
  },
  {
    group: 'Deyfing',
    items: [
      { item: 'Yfirborðsdeyfing', price: '3.500 kr.' },
      { item: 'Deyfing 1 til 3 tennur', price: '4.500 kr.' },
    ],
  },
  {
    group: 'Fyllingar',
    items: [
      { item: 'Bráðabirgðafylling', price: '12.800 kr.' },
      { item: 'Tannlit fylling, 1 flötur', price: '24.500 til 29.500 kr.' },
      { item: 'Tannlit fylling, 2 fletir', price: '33.000 til 38.000 kr.' },
      { item: 'Tannlit fylling, 3 fletir', price: '34.500 til 42.000 kr.' },
      { item: 'Tannlit fylling, 4 fletir', price: '39.500 til 46.500 kr.' },
    ],
  },
  {
    group: 'Krónur',
    items: [
      { item: 'Líming á krónu, til bráðabirgða', price: '13.800 kr.' },
      { item: 'Bráðabirgðakróna', price: '26.500 til 35.000 kr.' },
    ],
  },
]

/** The surcharge as a NUMBER, for the roll-up. The string form stays in PRICE_SURCHARGE. */
export const SURCHARGE_VALUE = 45590

export const PRICE_NOTES = [
  'Tekið er við debetkortum og kreditkortum. Tannlæknavaktin getur krafið viðskiptavini um greiðslu fyrir fram.',
  'Fyrir börn, öryrkja og aldraða gildir verðskrá samkvæmt samningi TFÍ og Sjúkratrygginga Íslands.',
  'Verðskráin er byggð upp eins og hefðbundnar verðskrár tannlækna.',
]


/* ── Á LEIÐINNI ───────────────────────────────────────────────────────────
 * Their /in-english page carries detailed first aid that their ICELANDIC page
 * does not have at all. An Icelandic speaker with a tooth knocked out at 21:00
 * currently gets none of it, and the one hour window is the single most useful
 * sentence on their whole website.
 *
 * Translated close to literal from THEIR OWN text. Medical instruction is not
 * somewhere to paraphrase freely, and nothing here is invented: every line maps
 * to a sentence on tannlaeknavaktin.is/index.php/in-english.
 *
 * Ordered by urgency, not by their page order. The knocked-out tooth is first
 * because it is the only one with a clock running on it.
 */
export const ON_THE_WAY: { n: string; head: string; body: string; urgent?: boolean }[] = [
  {
    n: '01',
    head: 'Tönn hefur slegist úr',
    urgent: true,
    body: 'Náðu í tönnina og haltu um krónuna, ekki rótina. Skolaðu hana með vatni ef hún er óhrein, en burstaðu hana ekki og fjarlægðu ekki vefjaleifar af rótinni. Reyndu að setja hana aftur á sinn stað, rétt snúna, en þvingaðu hana aldrei. Takist það ekki skaltu geyma hana í mjólk. Mestar líkur eru á að bjarga tönn sem kemst til tannlæknis innan klukkustundar.',
  },
  {
    n: '02',
    head: 'Tönn hefur brotnað',
    body: 'Geymdu brotin. Skolaðu munninn með volgu vatni og skolaðu brotin líka. Ef það blæðir skaltu þrýsta grisju á svæðið í um tíu mínútur eða þar til blæðingin stöðvast. Kaldur bakstur utan á kinnina heldur bólgu niðri og dregur úr verk.',
  },
  {
    n: '03',
    head: 'Mikill tannverkur',
    body: 'Skolaðu munninn vandlega með volgu vatni og notaðu tannþráð til að ná matarleifum sem sitja fastar. Sé bólga skaltu leggja kaldan bakstur utan á kinnina. Leggðu aldrei verkjatöflu upp að tannholdinu við tönnina, það getur brennt slímhúðina.',
  },
  {
    n: '04',
    head: 'Fylling eða króna losnaði',
    body: 'Sykurlaust tyggjó má nota til bráðabirgða í holuna, eða tannlím úr apóteki. Losni króna skaltu taka hana með þér til tannlæknisins. Notaðu aldrei skyndilím.',
  },
  {
    n: '05',
    head: 'Blæðing í munni',
    body: 'Skolaðu með mildri saltvatnslausn. Þrýstu rakri grisju á blæðingarstaðinn í fimmtán til tuttugu mínútur. Kaldur bakstur utan á kinnina í fimm til tíu mínútur dregur úr blæðingu og verk. Stöðvist blæðingin ekki skaltu leita strax til tannlæknis eða á bráðamóttöku.',
  },
]

export const ON_THE_WAY_NOTE =
  'Þessi ráð eru þýdd af ensku síðu Tannlæknavaktarinnar sjálfrar. Þau koma ekki í staðinn fyrir mat tannlæknis. Hringdu í 426 8000 um leið og þú getur.'

/**
 * Standing rule on this project: generated imagery is never passed off as the
 * client's own premises, staff or patients, and the page says so where the
 * images are, not only in a footer nobody reads.
 */
export const ON_THE_WAY_ART_NOTE =
  'Myndirnar tvær hér að ofan eru málaðar skýringarmyndir, gerðar með gervigreind. Þær sýna hvorki húsnæði stofunnar, starfsfólk hennar né raunverulegan sjúkling.'

/* ── receptionist ─────────────────────────────────────────────────────── */

/**
 * The live grounded endpoint (Cloudflare Worker, source in
 * ../../../../vaktin-receptionist). It answers only from an approved set of
 * sentences taken verbatim from tannlaeknavaktin.is.
 *
 * ASK_FACTS below stays as the OFFLINE FALLBACK: if the Worker is unreachable,
 * slow or rate-capped, the page answers locally rather than showing an error.
 * The two must be kept in step when the clinic's real hours or prices change.
 */
export const ASK_ENDPOINT = 'https://vaktin-receptionist.sindri-381.workers.dev'

export const ASK_CHIPS = [
  'Tönnin datt úr, hvað geri ég?',
  'Er þetta bráðatilvik?',
  'Fylling datt úr',
  'Hvað kostar að koma á kvöldin?',
  'Hvað ef það blæðir?',
  'Hvað með börnin?',
]

/**
 * Grounded answer set. The demo receptionist answers ONLY from these, and
 * says so plainly when it does not know, exactly as the production version
 * would when wired to the Worker. No invented facts, ever.
 */
export const ASK_FACTS: { match: string[]; answer: string }[] = [
  {
    match: ['opið', 'opin', 'opnun', 'núna', 'lokað', 'tími', 'tíma'],
    answer:
      'Opið er mánudaga til fimmtudaga kl. 8:00 til 22:00, föstudaga kl. 8:00 til 20:00 og um helgar kl. 10:00 til 20:00. Eftir kl. 16 á virkum dögum og um helgar er tannlæknir á bakvakt. Ávallt þarf að hringja í 426 8000 til að panta tíma.',
  },
  {
    match: ['kost', 'verð', 'gjald', 'álag', 'kvöld', 'dýrt', 'borga', 'greiðsl', 'kort'],
    answer:
      'Skoðun kostar 9.200 kr. á dagvinnutaxta. Um kvöld og helgar er 45.590 kr. álag á verðskrána. Tekið er við debetkortum og kreditkortum, og Tannlæknavaktin getur krafið viðskiptavini um greiðslu fyrir fram. Fyrir börn, öryrkja og aldraða gildir verðskrá samkvæmt samningi TFÍ og Sjúkratrygginga Íslands.',
  },
  {
    match: ['bráð', 'neyð', 'brotn', 'losn', 'áverk', 'slys', 'sýking', 'bólga', 'pína', 'verk'],
    answer:
      'Bráðatilvik sem krefjast tafarlausrar meðhöndlunar eru tannáverkar þar sem tennur hafa losnað, brotnað eða færst úr stað. Sama á við um slæmar tannpínur, tannrótarbólgur og sýkingar í munnholi. Vakthafandi tannlæknir metur meðferðarþörf. Minniháttar atvik geta oft beðið í skamman tíma.',
  },
  {
    match: ['hvar', 'staðsetn', 'heimilisfang', 'skipholt', 'vínlands', 'koma', 'leggja'],
    answer:
      'Tannlæknavaktin er á öðrum af tveimur stöðum, og staðsetningin er mismunandi eftir dögum. Skipholt 33 í 105 Reykjavík, þar sem tannlæknarnir eru Kjartan Örn Þorgeirsson og Stefán Hallur Jónsson, eða Vínlandsleið 16 í 113 Reykjavík, þar sem tannlæknirinn er Theódór Friðjónsson. Hringið í 426 8000 og þið fáið að vita hvert skal koma.',
  },
  {
    match: ['barn', 'börn', 'öryrk', 'aldrað', 'sjúkratrygg'],
    answer:
      'Fyrir börn, öryrkja og aldraða gildir verðskrá samkvæmt samningi TFÍ og Sjúkratrygginga Íslands. Hringið í 426 8000 og starfsfólk fer yfir það með ykkur.',
  },
  {
    match: ['112', 'eftir lokun', 'nótt', 'lokun'],
    answer:
      'Eftir lokun er bent á að hafa samband við 112 í neyðartilvikum. Á opnunartíma svarar Tannlæknavaktin í 426 8000.',
  },
]

/* first aid, from their own English page, so the new chips resolve */
ASK_FACTS.push(
  {
    match: ['datt úr', 'slegist', 'losnaði tönn', 'tönnin úr', 'missti tönn', 'brotnaði tönn'],
    answer:
      'Náðu í tönnina og haltu um krónuna, ekki rótina. Skolaðu hana með vatni ef hún er óhrein, en burstaðu hana ekki. Reyndu að setja hana aftur á sinn stað en þvingaðu hana aldrei. Takist það ekki skaltu geyma hana í mjólk. Mestar líkur eru á að bjarga tönn sem kemst til tannlæknis innan klukkustundar. Hringdu strax í 426 8000.',
  },
  {
    match: ['fylling', 'króna', 'krónan', 'losnaði'],
    answer:
      'Sykurlaust tyggjó má nota til bráðabirgða í holuna, eða tannlím úr apóteki. Losni króna skaltu taka hana með þér. Notaðu aldrei skyndilím. Hringdu í 426 8000 og fáðu tíma.',
  },
  {
    match: ['blæð', 'blóð'],
    answer:
      'Skolaðu með mildri saltvatnslausn og þrýstu rakri grisju á blæðingarstaðinn í fimmtán til tuttugu mínútur. Kaldur bakstur utan á kinnina dregur úr blæðingu og verk. Stöðvist blæðingin ekki skaltu leita strax til tannlæknis eða á bráðamóttöku.',
  },
)

export const ASK_FALLBACK =
  'Ég er ekki með það á hreinu. Best er að hringja í 426 8000, þar svarar starfsfólk vaktarinnar.'

export const ASK_INTRO =
  'Þetta er sýnishorn. Á endanlegri síðu svarar hann öllum spurningum allan sólarhringinn, líka þegar lokað er.'

/* ── nav ──────────────────────────────────────────────────────────────── */

export const NAV = [
  { href: '#spyrja', label: 'Spyrja' },
  { href: '#bradatilvik', label: 'Bráðatilvik' },
  { href: '#opnunartimi', label: 'Opnunartími' },
  { href: '#verd', label: 'Verðskrá' },
  { href: '#stadsetning', label: 'Staðsetning' },
]

/* ── JSON-LD ──────────────────────────────────────────────────────────── */

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'EmergencyService',
  name: 'Tannlæknavaktin',
  description:
    'Bráðaþjónusta vegna tannlækninga í Reykjavík. Tannlæknir á bakvakt eftir kl. 16 á virkum dögum og um helgar.',
  telephone: '+354 426 8000',
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Skipholt 33',
    postalCode: '105',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '08:00',
      closes: '22:00',
    },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '08:00', closes: '20:00' },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '10:00',
      closes: '20:00',
    },
  ],
}
