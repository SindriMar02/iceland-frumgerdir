/**
 * Tannlæknastofa EG ehf.
 *
 * Every fact below was read off her own site (tannlaeknir.is, ISO-8859-1 .asp
 * pages) or her own published verðskrá, which currently lives in a Google
 * Sheet linked from a 162x68 button image. Prices are hers, verbatim.
 */

export const CLINIC = {
  name: 'Tannlæknastofa EG',
  legal: 'Tannlæknastofa EG ehf.',
  kt: '620399-2809',
  founded: '22.03.1999',
  address: 'Salavegur 2, 201 Kópavogur',
  tel: '564 6250',
  telHref: '5646250',
  emergency: '896 2366',
  emergencyHref: '8962366',
  email: 'mottaka@tannlaeknir.is',
  hours: '8:30 - 15:00',
  instagram: 'https://instagram.com/tannlaeknastofaeg',
  facebook: 'https://www.facebook.com/tannlaeknir.is',
} as const

export const LICENCES = [
  { label: 'Starfsleyfi', body: 'Heilbrigðisnefnd Hafnarfjarðar- og Kópavogssvæðis' },
  { label: 'Staðfesting á rekstri heilbrigðisþjónustu', body: 'Embætti landlæknis' },
] as const

export const HERO = {
  eyebrow: 'Salavegur 2, Kópavogi',
  headline: 'Sami tannlæknirinn frá 1999.',
  lede:
    'Elfa Guðmundsdóttir rekur eigin stofu í Kópavogi og hefur gert frá 1999. Hún er auk þess með meistaragráðu í munn- og kjálkaskurðlækningum.',
  cta: { label: 'Panta tíma', href: `tel:5646250` },
} as const

/** Her own words, from thjonusta.asp. */
export const GENERAL =
  'Elfa Guðmundsdóttir DDS, MS býður upp á alla almenna tannlæknaþjónustu, svo sem fegrunartannlækningar, tannfyllingar, rótfyllingar, krónu- og brúargerðir og heilgómagerðir.'

/** Her stated specialisations, verbatim. This is the differentiator. */
export const SPECIALITIES = [
  'Ísetning tannplanta með eða án beinígræðslu',
  'Sínuslift',
  'Rótarendaaðgerðir',
  'Endajaxlataka og allur almennur tanndráttur',
  'Fegrunartannholdsaðgerðir með mjúkvefjalaser',
  'Tannholdsaðgerðir til að hylja bera tannhálsa',
] as const

/**
 * The verðskrá, exactly as she publishes it, regrouped into her own natural
 * categories. A dental price list is a short list of fixed procedures, so the
 * fix is information design, not a pricing component (ledger #75).
 */
export const PRICE_NOTE =
  'Viðmiðunargjaldskrá. Hafa ber í huga að hvert tilfelli þarf að meta og gæti það mat haft áhrif á verðlagningu.'

export const PRICES = [
  {
    group: 'Skoðun og eftirlit',
    rows: [
      { k: 'Skoðun, áfangaeftirlit, ein tímaeining', v: '9.100' },
      { k: 'Röntgenmynd', v: '4.780' },
      { k: 'Deyfing', v: '3.890' },
      { k: 'Tannsteinshreinsun, ein tímaeining', v: '8.950' },
    ],
  },
  {
    group: 'Forvarnir',
    rows: [
      { k: 'Flúorlökkun, báðir gómar', v: '13.386' },
      { k: 'Skorufylling, jaxl, fyrsta tönn', v: '14.500' },
    ],
  },
  {
    group: 'Fyllingar',
    rows: [
      { k: 'Ljóshert plastfylling, einn flötur', v: '33.600' },
      { k: 'Ljóshert plastfylling, jaxl, tveir fletir', v: '39.800' },
      { k: 'Gúmmídúkur, ein til þrjár tennur', v: '3.500' },
    ],
  },
  {
    group: 'Rótarholsaðgerðir',
    rows: [
      { k: 'Úthreinsun, einn gangur', v: '45.000' },
      { k: 'Rótfylling, þrír gangar', v: '82.000' },
    ],
  },
  {
    group: 'Tanndráttur og aðgerðir',
    rows: [
      { k: 'Tanndráttur, venjulegur', v: '36.000' },
      { k: 'Endajaxl fjarlægður með skurðaðgerð', v: '55.000 - 120.000' },
    ],
  },
  {
    group: 'Krónur og gómar',
    rows: [
      { k: 'Postulínsheilkróna á forjaxl, tannsmíði innifalin', v: '220.000' },
      { k: 'Gervitennur, heilgómur á báða tanngarða, tannsmíði innifalin', v: '650.000' },
    ],
  },
  {
    group: 'Tannlýsing',
    rows: [
      { k: 'Lýsingarskinnur og efni, báðir gómar', v: '70.000' },
      { k: 'Lýsing við stól, báðir gómar', v: '70.000' },
    ],
  },
] as const

export const CANCELLATION = 'Vinsamlegast afbókið tíma með sólarhrings fyrirvara.'

/**
 * THE SIGNATURE SPINE. Her actual dated path, off her own starfsfolk.asp.
 * A genuine sequence, so numbering it is honest (ledger: structure encodes
 * something true, it does not decorate).
 */
export const CAREER = [
  { year: '1994', title: 'Cand. odont.', body: 'Útskrifast úr tannlæknadeild Háskóla Íslands.' },
  { year: '1999', title: 'Eigin stofa', body: 'Opnar sína eigin tannlæknastofu og rekur hana enn.' },
  { year: '2006', title: 'Til Alabama', body: 'Hefur mastersnám í munn- og kjálkaskurðlækningum við UAB, University of Alabama at Birmingham.' },
  { year: '2009', title: 'MS í skurðlækningum', body: 'Útskrifast frá UAB. Hrefna Daðadóttir hefur störf á stofunni sama ár.' },
  { year: 'Í dag', title: 'Sama stofan, sama fólkið', body: 'Elfa og Hrefna hafa unnið saman á Salavegi síðan 2009.' },
] as const

export const ELFA = {
  name: 'Elfa Guðmundsdóttir',
  creds: 'DDS, MS',
  body: [
    'Elfa er fædd og uppalin á Húsavík. Hún lauk stúdentsprófi frá Menntaskólanum á Akureyri og kandídatsnámi (cand. odont.) frá Tannlæknadeild Háskóla Íslands árið 1994.',
    'Árið 2006 fór hún í mastersnám í munn- og kjálkaskurðlækningum við tannlæknadeild UAB, University of Alabama at Birmingham, þaðan sem hún útskrifaðist árið 2009.',
    'Elfa er dugleg að sækja námskeið og fyrirlestra, bæði heima og erlendis.',
  ],
} as const

export const HREFNA = {
  name: 'Hrefna Daðadóttir',
  body: 'Hrefna hefur unnið með Elfu frá 2009 og aðstoðar hana við tannlæknastólinn.',
} as const

export const WELCOME =
  'Við bjóðum alla velkomna og leggjum okkur fram við að bjóða upp á árangursríka og þægilega heimsókn sem einkennist af persónulegu viðmóti og faglegri þjónustu.'

/**
 * The annotated plate. Anchor points are percentages of the drawing's own box,
 * chosen off an elementFromPoint ink map of jaw.svg rather than by eye, so every
 * leader line lands on drawn anatomy. `side` puts the label in the left or right
 * margin. Each note is one of her own stated specialisations, verbatim.
 */
export const PLATE = [
  { id: 'sinus', side: 'right', ly: 8, ax: 60, ay: 18,
    title: 'Sínuslift',
    note: 'Beinuppbygging í efri gómi, ofan við aftari jaxla, áður en tannplanti er settur.' },
  { id: 'endajaxl', side: 'right', ly: 40, ax: 70, ay: 38,
    title: 'Endajaxlar',
    note: 'Endajaxlataka og allur almennur tanndráttur.' },
  { id: 'planti', side: 'right', ly: 74, ax: 55, ay: 52,
    title: 'Tannplantar',
    note: 'Ísetning tannplanta með eða án beinígræðslu.' },
  { id: 'tannhals', side: 'left', ly: 26, ax: 16, ay: 33,
    title: 'Berir tannhálsar',
    note: 'Tannholdsaðgerðir til að hylja bera tannhálsa.' },
  { id: 'rot', side: 'left', ly: 70, ax: 30, ay: 64,
    title: 'Rótarendi',
    note: 'Rótarendaaðgerðir, þar sem rótarendinn situr í kjálkabeininu.' },
] as const

export const PLATE_CAPTION =
  'Elfa lauk meistaranámi í munn- og kjálkaskurðlækningum við UAB, University of Alabama at Birmingham, árið 2009. Myndin er stílfærð skýringarmynd, ekki klínísk teikning, og sýnir í grófum dráttum hvar á tanngarðinum þessar aðgerðir fara fram.'

/* Served from a project Pages path, so every asset must carry the base. */
const A = import.meta.env.BASE_URL

export const IMAGES = {
  jaw: `${A}elfa/jaw.svg`,
  portraitTall: `${A}elfa/portrait-tall.webp`,
  portraitTallSm: `${A}elfa/portrait-tall-sm.webp`,
  mark: `${A}elfa/mark.webp`,
  lockup: `${A}elfa/lockup.webp`,
  portrait: `${A}elfa/elfa.webp`,
} as const
