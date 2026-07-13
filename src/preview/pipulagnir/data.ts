/* ─── Pípulagnir Suðurlands · „HEITT OG KALT" · structured content ───
   Every fact verified 2026-07-13 (BRIEF.md): kt. 4806002580, starfandi frá
   1. júní 2000 (26 ár), eigandi Ívar Grétarsson frá upphafi, Háheiði 10,
   800 Selfoss, sími 482 7880 / 699 1985, psud@psud.is, Creditinfo
   framúrskarandi. HOURS UNKNOWN → no opening hours anywhere.
   Reviews are SAMPLES and are disclaimed in the footer note. ─── */

export const PHONE_DISPLAY = '482 7880'
export const PHONE_HREF = 'tel:+3544827880'
export const PHONE2_DISPLAY = '699 1985'
export const PHONE2_HREF = 'tel:+3546991985'
export const EMAIL = 'psud@psud.is'
export const ADDRESS = { street: 'Háheiði 10', town: '800 Selfoss' }
export const MAPS = 'https://maps.google.com/?q=H%C3%A1hei%C3%B0i+10,+800+Selfoss'

const B = import.meta.env.BASE_URL
export const LOGO = `${B}pipulagnir/logo-secondary.png`
export const LOGO_MARK = `${B}pipulagnir/favicon.png`

/* Human-vetted Unsplash IDs only (BRIEF.md list, 2026-07-13). */
export const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const IMG = {
  hero: 'photo-1584774354932-62ceb99e6053', // warm copper coil macro, moody
  wallChase: 'photo-1694827893591-af9b80361599', // copper pipes in wall chase
  steelBrick: 'photo-1668291048339-d33756311d80', // steel pipes on dark brick
  valves: 'photo-1618840626133-54463084a141', // dark industrial valves/pipework
  heaterHands: 'photo-1620653713380-7a34b773fef8', // hands + pliers on water heater
  thermoHands: 'photo-1663602692362-80e4564384c0', // thermostat in hands (stjórnbúnaður)
  thermoWall: 'photo-1619140099965-06d74aaf51fa', // wall thermostat
  radiator: 'photo-1669725341213-7379ff6c90d5', // white panel radiator, warm room
  castIron: 'photo-1599028274511-e02a767949a3', // cast-iron radiator on tile
  whitePipes: 'photo-1538474705339-e87de81450e8', // white pipe runs, clean geometry
  meters: 'photo-1607472586893-edb57bdc0e39', // grey pipes + meters on red brick
  bathroom: 'photo-1695002817411-203c7f19dfa3', // modern bathroom, finished install
  pegboard: 'photo-1671040690726-b78261eff126', // wrench pegboard, real tools
  redValve: 'photo-1639600993675-2281b2c939f0', // pipe + red valve against glass
} as const

export const SEO = {
  title: 'Pípulagnir Suðurlands · Heitt og kalt í 26 ár · Selfoss',
  description:
    'Pípulagnir Suðurlands á Selfossi. Almennar pípulagnir, gólfhiti, neysluvatns- og hitakerfi, úðakerfi, lagnir fyrir matvælaiðnað og loftræstikerfi um allt Suðurland. Sími 482 7880.',
}

export const HERO = {
  eyebrow: 'Selfoss og allt Suðurland frá árinu 2000',
  headlineHot: 'Heitt',
  headlineAnd: 'og',
  headlineCold: 'kalt',
  headlineTail: 'í 26 ár',
  sub: 'Pípulagnir Suðurlands sjá um lagnir fyrir heimili, fyrirtæki og iðnað um allt Suðurland.',
  ctaPrimary: 'Hringja',
  ctaSecondary: 'Fá tilboð',
  alt: 'Nærmynd af heitum koparrörum í kyndiklefa',
}

/* Counted numbers with mono labels (no gauges, no meters). */
export const FACTS = [
  { num: 26, suffix: '', label: 'ár í pípulögnum', text: null },
  { num: 2000, suffix: '', label: 'stofnár', text: null },
  { num: null, suffix: '', label: 'flokkun Creditinfo', text: 'Framúrskarandi' },
  { num: null, suffix: '', label: 'þjónustusvæðið', text: 'Allt Suðurland' },
] as const

/* The 7 real services from psud.is, verbatim scope. Interactive index. */
export const SERVICES = [
  {
    name: 'Almennar pípulagnir',
    desc: 'Nýlagnir, breytingar og viðgerðir í íbúðarhúsnæði og atvinnuhúsnæði.',
    img: 'wallChase',
    alt: 'Koparlagnir felldar í vegg í nýbyggingu',
    tag: 'Heimili og fyrirtæki',
  },
  {
    name: 'Gólfhiti',
    desc: 'Lagning gólfhitakerfa í nýtt og eldra húsnæði, viðhald og stillingar.',
    img: 'thermoWall',
    alt: 'Hitastýring á vegg fyrir gólfhitakerfi',
    tag: 'Lagning og viðhald',
  },
  {
    name: 'Neysluvatns- og hitakerfi',
    desc: 'Uppsetning og endurnýjun neysluvatnslagna og hitakerfa.',
    img: 'heaterHands',
    alt: 'Unnið með töng við tengingar á hitakerfi',
    tag: 'Vatn og hiti',
  },
  {
    name: 'Úðakerfi',
    desc: 'Sprinklerkerfi í atvinnuhúsnæði, uppsetning og viðhald.',
    img: 'valves',
    alt: 'Lokar og stálpípur í tæknirými',
    tag: 'Brunavarnir',
  },
  {
    name: 'Lagnir fyrir matvælaiðnað',
    desc: 'Lagnavinna sem stenst kröfur matvælaframleiðslu.',
    img: 'whitePipes',
    alt: 'Hvítar lagnir í snyrtilegu lagnakerfi',
    tag: 'Iðnaður',
  },
  {
    name: 'Loftræstikerfi',
    desc: 'Uppsetning loftræstilagna í nýbyggingum og eldra húsnæði.',
    img: 'steelBrick',
    alt: 'Stálpípur á dökkum múrsteinsvegg',
    tag: 'Loftgæði',
  },
  {
    name: 'Viðhald eldri lagna',
    desc: 'Endurnýjun og viðhald á eldri lögnum, greining og úrbætur.',
    img: 'meters',
    alt: 'Gráar lagnir og mælar á múrsteinsvegg',
    tag: 'Endurnýjun',
  },
] as const

/* Warm band · gólfhiti. No honest floor-coil photo exists in the vetted
   set, so the imagery is control gear and radiators with honest captions. */
export const HEAT = {
  title: 'Gólfhiti sem virkar, ár eftir ár',
  lead: 'Hlýtt gólf er sjálfsagður hluti af íslensku heimili. Við leggjum gólfhita í nýbyggingar og eldra húsnæði og sjáum um viðhald og stillingar á kerfum sem fyrir eru.',
  body: 'Rétt lagt og rétt stillt kerfi skilar jafnri og þægilegri hitadreifingu um allt húsið.',
  points: ['Lagning í nýtt og eldra húsnæði', 'Viðhald og bilanagreining', 'Stillingar og hitastýring'],
  imgA: { img: 'radiator', alt: 'Hvítur ofn í hlýrri og bjartri stofu' },
  imgB: { img: 'thermoHands', alt: 'Hitastýring stillt í höndum' },
  capA: 'Ofnakerfi í íbúðarhúsnæði',
  capB: 'Stjórnbúnaður og hitastýring',
} as const

/* Cool band · industrial capability. */
export const COLD = {
  title: 'Úðakerfi og lagnir fyrir iðnað',
  lead: 'Fyrirtæki og framleiðendur um allt Suðurland treysta á lagnir sem þola álag. Við setjum upp og viðhöldum úðakerfum, leggjum lagnir fyrir matvælaiðnað og sjáum um loftræstikerfi.',
  points: ['Úðakerfi í atvinnuhúsnæði', 'Lagnir sem standast kröfur matvælaframleiðslu', 'Loftræstilagnir í stærri byggingum'],
  img: 'valves',
  alt: 'Dökkt tæknirými með lokum og stálpípum',
} as const

export const ABOUT = {
  title: 'Sami eigandinn frá árinu 2000',
  lead: 'Ívar Grétarsson stofnaði Pípulagnir Suðurlands árið 2000 og hefur átt og rekið fyrirtækið frá upphafi. Starfsstöðin er að Háheiði 10 á Selfossi og verkefnin ná um allt Suðurland.',
  body: 'Fyrirtækið er í flokki framúrskarandi fyrirtækja hjá Creditinfo. Verkefnin spanna allt frá viðgerðum á heimilum yfir í lagnakerfi fyrir iðnað.',
  imgA: { img: 'pegboard', alt: 'Skiptilyklar og verkfæri á verkfæravegg' },
  imgB: { img: 'bathroom', alt: 'Fullbúið nútímalegt baðherbergi' },
  capA: 'Verkfærin á sínum stað',
  capB: 'Fullbúið baðherbergi',
} as const

/* SAMPLE reviews. Disclaimed in the footer note. */
export const REVIEWS = [
  {
    quote: 'Fljótir að koma, fóru vel yfir verkið og skildu við allt hreint. Gólfhitinn hefur virkað óaðfinnanlega síðan.',
    name: 'Guðrún Þóra',
    role: 'Húseigandi á Selfossi',
  },
  {
    quote: 'Þeir lögðu allar lagnir í nýbygginguna hjá okkur. Skýr samskipti og staðið við áætlun.',
    name: 'Kristján Már',
    role: 'Byggingarverktaki á Suðurlandi',
  },
  {
    quote: 'Sáu um úðakerfið og lagnirnar í vinnslunni hjá okkur. Þekkja kröfurnar í matvælaiðnaði.',
    name: 'Elín Ósk',
    role: 'Rekstrarstjóri í Hveragerði',
  },
] as const

export const CONTACT = {
  title: 'Hafa samband',
  body: 'Hringdu eða sendu okkur línu og við tökum stöðuna á verkefninu með þér.',
  formTitle: 'Fá tilboð',
  formNote: 'Fyrirspurnin opnast í tölvupóstforritinu þínu og sendist á psud@psud.is.',
  submit: 'Senda fyrirspurn',
}

export const FOOTNOTE =
  'Þessi síða er frumgerð. Umsagnir eru sýnishorn og ljósmyndir eru til sýnis, ekki úr verkefnum fyrirtækisins.'
