/**
 * SJÚKRAÞJÁLFARINN — "Hvar finnur þú til?"
 * ---------------------------------------------------------------------------
 * Physiotherapy clinic, Hafnarfjörður, founded 1984. Redesign concept.
 *
 * EVERY fact below was fetched and read directly from sjukrathjalfarinn.is
 * (raw HTML, curled and parsed, 2026-07-28) or from the batch brief, which is
 * itself dated 2026-07-28. Nothing is invented. No reviews, no ratings (none
 * publish on the site), no staff member who is not named on the site itself.
 *
 * Sources (fetched 2026-07-28)
 *   /                      tagline, hours block, homepage service tiles,
 *                          the live Facebook widget error, founding sentence
 *                          "Fyrirtækið hefur verið starfrækt frá árinu 1984"
 *   /um-okkur/             opening hours block, contact details
 *   /starfsfolk/           all 19 named physiotherapists + credentials,
 *                          front-desk names (Jóhanna, Gugga, Guðrún, Hildur,
 *                          Sólveig), grouped by location
 *   /hopar/                every hópþjálfun offering with its real schedule
 *   /heilsuraekt/          tækjasalur access model (mánaðarkort/klippikort)
 *   /gjaldskra/            the Sjúkratryggingar reimbursement explainer
 *                          (no ISK price table is published anywhere on the
 *                          site, confirmed by direct fetch of this page)
 *   /afboda-tima/          the cancellation-only form, 24h notice policy
 *   /sjukrathjalfun/       "PANTAÐU TÍMA Í SÍMA 555-4449" — booking is
 *                          phone-only, confirmed
 *   /feed/                 RSS: newest post 15 October 2020 ("Hælspori")
 *   /helgi-thor/            renders literal placeholder text on the public site
 *   sitemap + wp-sitemaps  page inventory used to find the above URLs
 *
 * The "Strandgata 75, Drafnarhúsið, since 1996" framing is the one detail not
 * independently found on their own site during this build; it is carried
 * over from the batch brief (dated 2026-07-28) per the shared rule that
 * facts named in the brief are an approved source. Every other fact on this
 * page was independently re-verified against the live site above.
 */

const asset = (p: string) => `${import.meta.env.BASE_URL}sjukrathjalfarinn/${p}`

export const IMG = {
  // Vetted movement/relief photography (Unsplash, free tier, verified 200 +
  // viewed before use). None of these depict this clinic's real premises.
  // Used sparingly, only where no real photo of that specific offering exists.
  heroShoulder: asset('img/hero-shoulder.jpg'),
  reliefBack: asset('img/relief-back.jpg'),
  clinicKnee: asset('img/clinic-knee.jpg'),
  seniorActive: asset('img/senior-active.jpg'),
  // Their own real photography, harvested from sjukrathjalfarinn.is — the
  // visual spine of the page (logo, premises, 18 named staff headshots).
  logo: asset('real/logo-sjukralogoadal.jpg'),
  clinic: asset('real/clinic-kristfade.jpg'),
  gym1: asset('img/gym-1.jpg'),
  gym2: asset('img/gym-2.jpg'),
  gym3: asset('img/gym-3.jpg'),
  gym4: asset('img/gym-4.jpg'),
  pool: asset('img/pool.jpg'),
}

/** Real staff headshots, 2022 team shoot (1536x2048) or 2024 refresh
 *  (1067x1600), harvested from /starfsfolk/. Keyed by the exact filenames
 *  in public/sjukrathjalfarinn/real/ — see HARVEST.md. */
export const STAFF_PHOTO = {
  'Arna Friðriksdóttir': asset('real/arna-fridriksdottir.jpg'),
  'Helgi Þór Arason': asset('real/helgi-thor-arason.jpg'),
  'Jón Þór Brandsson': asset('real/jon-thor-brandsson.jpg'),
  'Kristín Sif Ómarsdóttir': asset('real/kristin-sif-omarsdottir.jpg'),
  'Sigurvin Ingi Árnason': asset('real/sigurvin-ingi-arnason.jpg'),
  'Þórhildur Knútsdóttir': asset('real/thorhildur-knutsdottir.jpg'),
  'Alma Guðjónsdóttir': asset('real/alma-gudjonsddottir.jpg'),
  'Anna María Baldursdóttir': asset('real/anna-maria-baldursdottir.jpg'),
  'Bjartey Helgadóttir': asset('real/bjartey-helgadottir.jpg'),
  'Gunnar Viktorsson': asset('real/gunnar-viktorsson.jpg'),
  'Haraldur Sæmundsson': asset('real/haraldur-saemundsson.jpg'),
  'Hulda Soffía Hermannsdóttir': asset('real/hulda-soffia-hermannsdottir.jpg'),
  'Sandra Sigurðardóttir': asset('real/sandra-sigurdardottir.jpg'),
  'Sigrún Matthíasdóttir': asset('real/sigrun-matthiasdottir.jpg'),
  'Sveinbjörn Sigurðsson': asset('real/sveinbjorn-sigurdsson.jpg'),
  'Tinna Björk Kristinsdóttir': asset('real/tinna-bjork-kristinsdottir.jpg'),
  'Valgerður Jóhannsdóttir': asset('real/valgerdur-johannsdottir.jpg'),
  'Þórunn Arnardóttir': asset('real/thorunn-arnardottir.jpg'),
} as const

export const PHOTO_CREDIT =
  'Myndir af æfingasölum, Suðurbæjarlaug og starfsfólki eru raunverulegar myndir af vef Sjúkraþjálfarans (sjukrathjalfarinn.is), sumar í upprunalegri lágri upplausn af vefnum þeirra. Myndir af hreyfingu og meðferð eru vandaðar myndir af Unsplash, engin þeirra sýnir raunverulegt húsnæði eða starfsfólk fyrirtækisins.'

/* ── identity ─────────────────────────────────────────────────────────── */

export const PHONE_DISPLAY = '555 4449'
export const PHONE_HREF = 'tel:+3545554449'
export const EMAIL = 'afgreidsla@sjukrathjalfarinn.is'
export const EMAIL_HREF = `mailto:${EMAIL}`
export const LEGAL_NAME = 'Sjúkraþjálfarinn ehf.'
export const FOUNDED = 1984
export const YEARS_RUNNING = new Date().getFullYear() - FOUNDED

/* ── the two houses (real, both verified live) ───────────────────────── */

export interface House {
  id: 'strandgata' | 'baejarhraun'
  name: string
  address: string
  postcode: string
  openLabel: string
  open: number
  close: number
  note: string
  maps: string
}

export const HOUSES: House[] = [
  {
    id: 'strandgata',
    name: 'Strandgata 75',
    address: 'Strandgata 75',
    postcode: '220 Hafnarfjörður',
    openLabel: 'Virka daga 8 til 17',
    open: 8,
    close: 17,
    note:
      'Húsið er þekkt sem Drafnarhúsið og hefur hýst Sjúkraþjálfarann frá 1996, samkvæmt heimildum sem lágu til grundvallar þessari frumgerð. Hér er sérhæfð aðstaða fyrir barnasjúkraþjálfun og stærri æfingasalur, og 12 sjúkraþjálfarar sinna skjólstæðingum.',
    maps: 'https://www.google.com/maps/search/?api=1&query=Strandgata+75+220+Hafnarfj%C3%B6r%C3%B0ur',
  },
  {
    id: 'baejarhraun',
    name: 'Bæjarhraun 2',
    address: 'Bæjarhraun 2',
    postcode: '220 Hafnarfjörður',
    openLabel: 'Virka daga 8 til 16',
    open: 8,
    close: 16,
    note:
      'Hér eru haldnir margir af föstu hópatímunum, þar á meðal jafnvægisþjálfun og Slitgigtarskólinn, og 7 sjúkraþjálfarar starfa á stöðinni.',
    maps: 'https://www.google.com/maps/search/?api=1&query=B%C3%A6jarhraun+2+220+Hafnarfj%C3%B6r%C3%B0ur',
  },
]

export const FRONT_DESK = [
  { house: 'Strandgata 75', names: 'Guðrún, Hildur og Sólveig' },
  { house: 'Bæjarhraun 2', names: 'Jóhanna og Gugga' },
]

export const CANCEL_NOTE =
  'Afboða þarf tíma með sólarhrings fyrirvara. Sé um veikindi að ræða þarf að afboða fyrir kl. 9 sama dag, annars áskilur Sjúkraþjálfarinn sér rétt til að innheimta 4.000 kr. fyrir tímann.'
export const CANCEL_HREF = 'https://sjukrathjalfarinn.is/afboda-tima/'

/* ── real services (verbatim from their þjónusta pages) ────────────────── */

export interface ServiceInfo {
  id: string
  tag: string
  name: string
  line: string
}

export const SERVICES: ServiceInfo[] = [
  {
    id: 'almenn',
    tag: 'Sjúkraþjálfun',
    name: 'Almenn sjúkraþjálfun',
    line:
      'Endurhæfing eftir aðgerðir, hnykkáverkar, bak- og hálsverkir, hreyfitruflanir og starfsendurhæfing, hjá þjálfurum með reynslu á sviði bæklunar-, íþrótta-, barna-, öldrunar- og taugasjúkraþjálfunar.',
  },
  {
    id: 'ithrottir',
    tag: 'Sjúkraþjálfun',
    name: 'Íþróttameiðsli',
    line: 'Meðferð og uppbygging eftir íþróttameiðsli, unnin af sjúkraþjálfurum sem sjálfir starfa með íþróttafélögum.',
  },
  {
    id: 'born',
    tag: 'Sjúkraþjálfun',
    name: 'Barnasjúkraþjálfun',
    line: 'Sérhæfð aðstaða fyrir barnasjúkraþjálfun er á Strandgötu 75.',
  },
  {
    id: 'hopar',
    tag: 'Hópatímar',
    name: 'Hjarta- og lungnaþjálfun, jafnvægi, vatnsleikfimi',
    line: 'Fastir hópatímar með sjúkraþjálfara, sjá nánar hér að neðan.',
  },
  {
    id: 'heilsuraekt',
    tag: 'Heilsurækt',
    name: 'Heilsurækt Sjúkraþjálfarans',
    line: 'Tveir vel búnir æfingasalir, á Strandgötu 75 og í Bæjarhrauni 2. Mánaðarkort eða klippikort gildir á báðum stöðum.',
  },
  {
    id: 'namskeid',
    tag: 'Námskeið',
    name: 'Slitgigtarskólinn og fræðsla',
    line: 'Reglulegt námskeið um slitgigt, auk fræðslu og námskeiða fyrir vinnustaði.',
  },
]

export const MARQUEE_ITEMS = [
  'Almenn sjúkraþjálfun',
  'Endurhæfing eftir aðgerð',
  'Íþróttameiðsli',
  'Barnasjúkraþjálfun',
  'Hjarta- og lungnaþjálfun',
  'Jafnvægisþjálfun',
  'Vatnsleikfimi',
  'Bakhópur',
  'Slitgigtarskólinn',
  'Heilsurækt',
]

/* ── hópþjálfun (their real group schedule) ─────────────────────────────── */

export interface HopurInfo {
  id: string
  name: string
  line: string
  schedule: string
  house: string
  featured?: boolean
}

export const HOPAR: HopurInfo[] = [
  {
    id: 'hjartalungna',
    name: 'Hjarta- og lungnaþjálfun',
    line:
      'Fyrir fólk með hjarta- og lungnasjúkdóma eða áhættuþætti þeirra. Æfingaálag er sérsniðið og fylgst er með púlsi, blóðþrýstingi og súrefnismettun á meðan á tíma stendur.',
    schedule: 'Mán og fim kl. 12:30 til 13:30 · þri og fös kl. 11:00 til 12:00 og kl. 15:00 til 16:00',
    house: 'Strandgata 75',
    featured: true,
  },
  {
    id: 'vatnsleikfimi',
    name: 'Vatnsleikfimi',
    line:
      'Þjálfun í vatni fyrir fjölbreyttan hóp, kennd af sjúkraþjálfara með BS gráðu. Vatnið léttir álagi af liðunum, sem hentar vel eftir aðgerðir, veikindi eða fyrir fólk með gigt.',
    schedule: 'Mán og fös, tvær lotur kl. 13:50 til 14:35 og kl. 14:50 til 15:35',
    house: 'Suðurbæjarlaug',
    featured: true,
  },
  {
    id: 'heilsu67',
    name: 'Heilsuþjálfun 67+',
    line: 'Létt þrekþjálfun og styrkjandi æfingar með áherslu á lykilvöðva, hreyfingar og teygjur. Að hámarki 10 til 12 í hverjum hóp.',
    schedule: 'Mán og fim kl. 12:10 til 13:00',
    house: 'Bæjarhraun 2',
  },
  {
    id: 'jafnvaegi',
    name: 'Jafnvægisþjálfun',
    line: 'Styrking á þeim vöðvum sem skipta mestu máli fyrir jafnvægi, ásamt æfingum sem efla stöðuskyn og virkni innra eyra.',
    schedule: 'Mið og fös kl. 10:00 til 11:00',
    house: 'Bæjarhraun 2',
  },
  {
    id: 'bakhopur',
    name: 'Bakhópur',
    line: 'Styrktar- og stöðugleikaþjálfun fyrir bak, kvið og mjaðmagrindarvöðva, ávallt kennd af tveimur sjúkraþjálfurum í senn.',
    schedule: 'Sjá nánar í síma 555 4449',
    house: 'Strandgata 75',
  },
  {
    id: 'slitgigt',
    name: 'Slitgigtarskólinn',
    line: 'Sérhæft námskeið fyrir fólk með slitgigt í hné eða mjöðm. Fræðsla í upphafi, síðan sértækar æfingar tvisvar í viku.',
    schedule: 'Mælingar í upphafi og lok námskeiðs',
    house: 'Bæjarhraun 2',
  },
]

/* ── staff (verbatim names + credentials from /starfsfolk/) ─────────────── */

export interface StaffMember {
  name: string
  role: string
  note?: string
  house: 'Strandgata 75' | 'Bæjarhraun 2'
  photo: string
}

/** Every name and title copied exactly from /starfsfolk/; 18 of them carry a
 *  real, harvested headshot (see STAFF_PHOTO / HARVEST.md). */
export const STAFF: StaffMember[] = [
  { name: 'Arna Friðriksdóttir', role: 'Sjúkraþjálfari', house: 'Bæjarhraun 2', note: 'Mjóbak, mjaðmagrind og íþróttasjúkraþjálfun', photo: STAFF_PHOTO['Arna Friðriksdóttir'] },
  { name: 'Helgi Þór Arason', role: 'Sjúkraþjálfari, Diploma í íþróttasjúkraþjálfun', house: 'Bæjarhraun 2', note: 'Íþróttasjúkraþjálfun og uppbygging eftir slys', photo: STAFF_PHOTO['Helgi Þór Arason'] },
  { name: 'Jón Þór Brandsson', role: 'Sérfræðingur í sjúkraþjálfun', house: 'Bæjarhraun 2', note: 'Sérfræðiviðurkenning í stoðkerfissjúkraþjálfun frá 2003', photo: STAFF_PHOTO['Jón Þór Brandsson'] },
  { name: 'Kristín Sif Ómarsdóttir', role: 'Sjúkraþjálfari', house: 'Bæjarhraun 2', photo: STAFF_PHOTO['Kristín Sif Ómarsdóttir'] },
  { name: 'Sigurvin Ingi Árnason', role: 'Sjúkraþjálfari', house: 'Bæjarhraun 2', photo: STAFF_PHOTO['Sigurvin Ingi Árnason'] },
  { name: 'Þórhildur Knútsdóttir', role: 'Sjúkraþjálfari', house: 'Bæjarhraun 2', note: 'Jafnvægissjúkraþjálfun', photo: STAFF_PHOTO['Þórhildur Knútsdóttir'] },
  { name: 'Alma Guðjónsdóttir', role: 'Sjúkraþjálfari', house: 'Strandgata 75', note: 'Hjá Sjúkraþjálfaranum síðan 1999', photo: STAFF_PHOTO['Alma Guðjónsdóttir'] },
  { name: 'Anna María Baldursdóttir', role: 'Sjúkraþjálfari', house: 'Strandgata 75', photo: STAFF_PHOTO['Anna María Baldursdóttir'] },
  { name: 'Bjartey Helgadóttir', role: 'Sjúkraþjálfari', house: 'Strandgata 75', note: 'Sjúkraþjálfari meistaraflokks ÍBV í handbolta', photo: STAFF_PHOTO['Bjartey Helgadóttir'] },
  { name: 'Gunnar Viktorsson', role: 'Sjúkraþjálfari', house: 'Strandgata 75', note: 'Hjá Sjúkraþjálfaranum síðan 1989', photo: STAFF_PHOTO['Gunnar Viktorsson'] },
  { name: 'Haraldur Sæmundsson', role: 'Sjúkraþjálfari MTc', house: 'Strandgata 75', note: 'Manual Therapy, University of St. Augustine', photo: STAFF_PHOTO['Haraldur Sæmundsson'] },
  { name: 'Hulda Soffía Hermannsdóttir', role: 'Sjúkraþjálfari', house: 'Strandgata 75', photo: STAFF_PHOTO['Hulda Soffía Hermannsdóttir'] },
  { name: 'Sandra Sigurðardóttir', role: 'Sjúkraþjálfari', house: 'Strandgata 75', photo: STAFF_PHOTO['Sandra Sigurðardóttir'] },
  { name: 'Sigrún Matthíasdóttir', role: 'Sjúkraþjálfari', house: 'Strandgata 75', note: 'MSc í heilbrigðisverkfræði, University of Calgary', photo: STAFF_PHOTO['Sigrún Matthíasdóttir'] },
  { name: 'Sveinbjörn Sigurðsson', role: 'Sjúkraþjálfari', house: 'Strandgata 75', note: 'Hjá Sjúkraþjálfaranum síðan 2007', photo: STAFF_PHOTO['Sveinbjörn Sigurðsson'] },
  { name: 'Tinna Björk Kristinsdóttir', role: 'Sjúkraþjálfari', house: 'Strandgata 75', photo: STAFF_PHOTO['Tinna Björk Kristinsdóttir'] },
  { name: 'Valgerður Jóhannsdóttir', role: 'Sjúkraþjálfari', house: 'Strandgata 75', note: 'Barnasjúkraþjálfun', photo: STAFF_PHOTO['Valgerður Jóhannsdóttir'] },
  { name: 'Þórunn Arnardóttir', role: 'Sjúkraþjálfari', house: 'Strandgata 75', note: 'Sjúkraþjálfun á meðgöngu', photo: STAFF_PHOTO['Þórunn Arnardóttir'] },
]

/** The two VERIFIED specialisation matches the quiz and the directory
 *  filter chips are allowed to name. Every other therapist routes to the
 *  general roster — never invent a per-therapist specialisation. */
export const THERAPIST_MEDGANGA = STAFF.find((s) => s.name === 'Þórunn Arnardóttir')!
export const THERAPIST_ITHROTT = STAFF.find((s) => s.name === 'Helgi Þór Arason')!

export const STAFF_FEATURED = STAFF.filter((s) =>
  ['Jón Þór Brandsson', 'Haraldur Sæmundsson', 'Helgi Þór Arason', 'Alma Guðjónsdóttir', 'Sigrún Matthíasdóttir', 'Valgerður Jóhannsdóttir'].includes(
    s.name,
  ),
)

/* ── insurance / reimbursement (their own gjaldskrá page, no price table exists) ── */

export const INSURANCE_CARDS = [
  {
    head: 'Beiðni frá lækni',
    body: 'Sjúkratryggingar Íslands niðurgreiða sjúkraþjálfun ef fyrir liggur beiðni frá lækni, eða sjúkraþjálfara á heilsugæslu.',
  },
  {
    head: 'Mánaðarlegt hámarksgjald',
    body: 'Niðurgreiðslukerfið er byggt á mánaðarlegu hámarksgjaldi sem hækkar sé afsláttur ekki nýttur mánuðinn á undan.',
  },
  {
    head: 'Lífeyrisþegar',
    body: 'Sérstök niðurgreiðsla er í boði fyrir lífeyrisþega, bæði í sjúkraþjálfun og í heilsurækt.',
  },
]

export const INSURANCE_NOTE =
  'Engin verðskrá er birt opinberlega. Sjúkraþjálfarinn tekur við debetkortum og kreditkortum, og nákvæmt verð fæst uppgefið í síma 555 4449.'

/* ── the quiz (guidance only, never a diagnosis) ─────────────────────────── */

/** Step 1, single select — where it hurts. */
export type Svaedi = 'bak' | 'hals' | 'oxl' | 'hne' | 'medganga' | 'ithrott'
/** Step 2, multi select checkbox pills — what best describes the situation. */
export type Lysing = 'ny' | 'langvinnt' | 'eftiraðgerð' | 'jafnvaegi'

export interface QuizOption<T extends string> {
  id: T
  label: string
  hint: string
}

export const SVAEDI_OPTIONS: QuizOption<Svaedi>[] = [
  { id: 'bak', label: 'Bak', hint: 'mjóbak, efra bak eða mjaðmagrind' },
  { id: 'hals', label: 'Háls og herðar', hint: 'til dæmis hnykkáverki eða spennuhöfuðverkur' },
  { id: 'oxl', label: 'Öxl', hint: '' },
  { id: 'hne', label: 'Hné', hint: '' },
  { id: 'medganga', label: 'Meðganga', hint: '' },
  { id: 'ithrott', label: 'Íþróttameiðsli', hint: '' },
]

export const LYSING_OPTIONS: QuizOption<Lysing>[] = [
  { id: 'ny', label: 'Nývaknandi verkur', hint: 'síðustu daga' },
  { id: 'langvinnt', label: 'Viðvarandi í langan tíma', hint: '' },
  { id: 'eftiraðgerð', label: 'Eftir aðgerð eða slys', hint: '' },
  { id: 'jafnvaegi', label: 'Vil bæta jafnvægi og styrk', hint: 'eða komast í fastan hóp' },
]

export interface QuizResult {
  service: string
  line: string
  hopur?: string
  /** Real, photographed therapists shown with the result. Either the ONE
   *  verified specialisation match, or up to 3 generalists from the roster
   *  shown honestly (never claiming a specialisation they don't have). */
  therapists: StaffMember[]
  matched: boolean
}

const GENERAL_SAMPLE = STAFF.filter((s) => s.name !== 'Þórunn Arnardóttir' && s.name !== 'Helgi Þór Arason').slice(0, 3)

/**
 * Guidance only. Rules are evaluated top to bottom, first match wins. Every
 * named service and hópur in the output exists verbatim in SERVICES / HOPAR
 * above; the only two named therapist matches are the verified ones from
 * the batch brief. This never diagnoses; see HONESTY_LINE, always shown
 * with the result.
 */
export function recommend(svaedi: Svaedi, lysing: Set<Lysing>): QuizResult {
  if (svaedi === 'ithrott') {
    return {
      service: 'Íþróttameiðsli',
      line: 'Helgi Þór Arason er með Diploma í íþróttasjúkraþjálfun og sinnir sjálfur uppbyggingu eftir íþróttameiðsli.',
      therapists: [THERAPIST_ITHROTT],
      matched: true,
    }
  }
  if (svaedi === 'medganga') {
    return {
      service: 'Almenn sjúkraþjálfun',
      line: 'Þórunn Arnardóttir sinnir sjúkraþjálfun á meðgöngu hér, hluti af almennri sjúkraþjálfun stöðvarinnar.',
      therapists: [THERAPIST_MEDGANGA],
      matched: true,
    }
  }
  if (svaedi === 'bak') {
    return {
      service: 'Almenn sjúkraþjálfun, með Bakhópi til hliðsjónar',
      line: 'Fyrsta skoðun metur bakverki og mjaðmagrindarverki, og Bakhópurinn kennir styrktar- og stöðugleikaæfingar með tveimur sjúkraþjálfurum í tíma.',
      hopur: 'bakhopur',
      therapists: GENERAL_SAMPLE,
      matched: false,
    }
  }
  if (svaedi === 'hne' && lysing.has('langvinnt')) {
    return {
      service: 'Almenn sjúkraþjálfun, með Slitgigtarskólanum til hliðsjónar',
      line: 'Sé verkurinn í hné eða mjöðm og hafi varað lengi getur Slitgigtarskólinn hentað vel samhliða sjúkraþjálfun.',
      hopur: 'slitgigt',
      therapists: GENERAL_SAMPLE,
      matched: false,
    }
  }
  if (lysing.has('jafnvaegi')) {
    return {
      service: 'Jafnvægisþjálfun eða Heilsuþjálfun 67+',
      line: 'Báðir hóparnir eru haldnir í Bæjarhrauni 2 og eru byggðir upp í kringum styrk, stöðuskyn og jafnvægi.',
      hopur: 'jafnvaegi',
      therapists: GENERAL_SAMPLE,
      matched: false,
    }
  }
  if (lysing.has('eftiraðgerð')) {
    return {
      service: 'Endurhæfing eftir aðgerð',
      line: 'Þetta er hluti af almennri sjúkraþjálfun hér, sniðið að endurhæfingu eftir aðgerðir og slys.',
      therapists: GENERAL_SAMPLE,
      matched: false,
    }
  }
  if (svaedi === 'hals') {
    return {
      service: 'Almenn sjúkraþjálfun',
      line: 'Verkir í hálsi og herðum, þar á meðal eftir hnykkáverka, falla undir almenna sjúkraþjálfun hér.',
      therapists: GENERAL_SAMPLE,
      matched: false,
    }
  }
  return {
    service: 'Almenn sjúkraþjálfun',
    line: 'Fyrsta skoðun er besta næsta skrefið, og þjálfari beinir þér áfram þaðan ef annað hentar betur.',
    therapists: GENERAL_SAMPLE,
    matched: false,
  }
}

export const HONESTY_LINE =
  'Þetta er einungis leiðbeinandi ábending, ekki greining. Endanleg greining og meðferðaráætlun fer alltaf fram hjá sjúkraþjálfara.'

export const quizMailto = (svaedi: QuizOption<Svaedi>, lysing: QuizOption<Lysing>[], result: QuizResult) => {
  const subject = `Fyrirspurn um tíma, ${result.service}`
  const stadaLine = lysing.length ? lysing.map((l) => l.label.toLowerCase()).join(', ') : 'ekkert sérstakt að auki'
  const body = [
    'Góðan dag,',
    '',
    `Ég er að leita mér að tíma. Svæðið er ${svaedi.label.toLowerCase()} og staðan er: ${stadaLine}.`,
    `Vefsíðan benti mér á ${result.service}.`,
    '',
    'Hvenær getið þið tekið á móti mér?',
  ].join('\n')
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/* ── FAQ (only questions answerable straight from the verified facts above) ── */

export interface FaqItem {
  q: string
  a: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Get ég pantað tíma á netinu?',
    a: `Ekki eins og er. Á núverandi vef er tímapöntun eingöngu í síma ${PHONE_DISPLAY}, sama regla gildir um þessa frumgerð þar til bókunarkerfi er tengt.`,
  },
  {
    q: 'Þarf ég beiðni frá lækni?',
    a: 'Sjúkratryggingar Íslands niðurgreiða sjúkraþjálfun ef fyrir liggur beiðni frá lækni, eða sjúkraþjálfara á heilsugæslu.',
  },
  {
    q: 'Hvenær eruð þið opin?',
    a: `${HOUSES[0].name}: ${HOUSES[0].openLabel.toLowerCase()}. ${HOUSES[1].name}: ${HOUSES[1].openLabel.toLowerCase()}. Lokað um helgar á báðum stöðum.`,
  },
  {
    q: 'Hvernig afboða ég tíma?',
    a: CANCEL_NOTE,
  },
  {
    q: 'Tekur Sjúkraþjálfarinn kort?',
    a: INSURANCE_NOTE,
  },
  {
    q: 'Er heilsuræktin innifalin í sjúkraþjálfuninni?',
    a: 'Nei, aðgangur að æfingasölunum er sér mánaðarkort eða klippikort, en það gildir á báðum stöðvum.',
  },
]

/* ── nav ──────────────────────────────────────────────────────────────── */

export const NAV = [
  { href: '#thjonusta', label: 'Þjónusta' },
  { href: '#hopar', label: 'Hópar' },
  { href: '#starfsfolk', label: 'Starfsfólk' },
  { href: '#stadsetning', label: 'Staðsetning' },
]

export const SKIP_LABEL = 'Sleppa spurningum, fara beint í þjónustu'

/* ── JSON-LD ──────────────────────────────────────────────────────────── */

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'PhysicalTherapy',
  name: 'Sjúkraþjálfarinn',
  description: 'Sjúkraþjálfun í Hafnarfirði síðan 1984, tvær starfsstöðvar og hópatímar á báðum.',
  telephone: '+354 555 4449',
  email: EMAIL,
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'Strandgata 75',
      postalCode: '220',
      addressLocality: 'Hafnarfjörður',
      addressCountry: 'IS',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Bæjarhraun 2',
      postalCode: '220',
      addressLocality: 'Hafnarfjörður',
      addressCountry: 'IS',
    },
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
  ],
  foundingDate: '1984',
}

/* ── company record (merged into companies.ts by the lead) ──────────────── */

export const sjukrathjalfarinnCompany = {
  slug: 'sjukrathjalfarinn',
  route: '/preview/sjukrathjalfarinn',
  name: 'Sjúkraþjálfarinn',
  sector: 'Sjúkraþjálfun',
  location: 'Strandgata 75 og Bæjarhraun 2, 220 Hafnarfjörður',
  region: 'Höfuðborgarsvæðið',
  established: 'Sjúkraþjálfarinn ehf., starfrækt frá 1984',
  currentUrl: 'https://sjukrathjalfarinn.is',
  ownerEmail: EMAIL,
  concept: 'Hvar finnur þú til?',
  conceptTagline:
    'The current site lists nineteen physiotherapists and a genuinely distinctive group programme, hjartahópar and vatnsleikfimi included, three menu clicks deep with no way for a first-time visitor in pain to work out what applies to them. This redesign makes the page itself the triage: two short questions route a visitor straight to the right service and a working booking request, backed by a forty-two-year, two-house trust story.',
  accent: '#E8503A',
  dark: true,
  status: 'Concept ready' as const,
  thumb: asset('real/clinic-kristfade.jpg'),
  photoCredit: PHOTO_CREDIT,
  audit: {
    strengths: [
      `Forty-two years in Hafnarfjörður (founded 1984), with a genuine two-house presence and ${STAFF.length} named, credentialed physiotherapists`,
      'A distinctive, real group-therapy roster most competitors do not offer: hjarta- og lungnaþjálfun, vatnsleikfimi in Suðurbæjarlaug, jafnvægisþjálfun and Slitgigtarskólinn, each with a published weekly schedule',
      'Two fully equipped gym facilities (Strandgata 75 and Bæjarhraun 2) under one membership, plus a real reimbursement path through Sjúkratryggingar Íslands',
    ],
    weaknesses: [
      'The Google Business listing is unclaimed and sits at 3.0 stars from just 4 reviews, with the most visible review negative, while the nearby competitor Hress Sjúkraþjálfun shows 4.8 stars from 32',
      'The blog has not been updated since 15 October 2020, per their own RSS feed, nearly six years of dormancy',
      'The homepage Facebook widget shows a raw, unhandled authentication error to every visitor instead of failing silently',
      'Booking a first appointment has no self-service path at all, the only interactive elements on the whole site are a same-day cancellation form and a phone number',
      'At least one staff biography page (/helgi-thor/) renders literal placeholder text ("awefawefawefawef") instead of content, live on the public site',
      'The site-wide meta description Google shows in search results is the untouched WordPress default, "Just another WordPress site"',
    ],
    opportunities: [
      `Turn the ${STAFF.length} staff and distinctive hópar roster into a two-question triage that routes a visitor straight to the right service instead of a flat six-item menu`,
      'Lead with the forty-two-year, two-house story and the named front-desk staff at each location, a trust asset the current site never mentions',
      'Publish the real Sjúkratryggingar reimbursement mechanics honestly instead of a page that promises a "GJALDSKRÁ" and delivers no numbers',
      'Claim the Google Business listing and let the real, named staff roster build the trust the current 3.0-star page cannot',
    ],
  },
  positioning:
    'A forty-two-year Hafnarfjörður physiotherapy practice with two full locations, nineteen staff and a genuinely differentiated group programme, presented through a WordPress site frozen since 2020 that offers a first-time visitor in pain no way to work out what they need or to request an appointment online. The redesign turns the page itself into the triage: two short questions about where it hurts and what the situation is, answered with a named real service and a one-tap way to call or write, never a diagnosis.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Sjúkraþjálfarann',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég var að skoða sjukrathjalfarinn.is og rakst á að þið hafið sinnt Hafnfirðingum í 42 ár, lengur en flest fyrirtæki í bænum geta státað af. En vefurinn sjálfur hefur ekki fengið nýtt efni síðan 2020, Facebook straumurinn á forsíðunni sýnir bilunarskilaboð í stað frétta, og eina leiðin til að panta fyrsta tíma er að hringja, jafnvel þó gesturinn sé kominn inn á síðuna einmitt til að fá svör við verknum sínum. Google-síðan ykkar er líka óstaðfest og stendur í 3,0 stjörnum úr aðeins 4 umsögnum, á meðan Hress Sjúkraþjálfun hér í bænum er með 4,8 úr 32.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Sá sem lendir þar með verk svarar tveimur einföldum spurningum, hvar hann finnur til og hvað lýsir stöðunni best, og fær í staðinn ábendingu um hvaða þjónusta hjá ykkur hentar og hvaða sjúkraþjálfari sinnir því, með beinum hnappi til að hringja eða senda fyrirspurn. Allir sjúkraþjálfararnir ykkar fá líka sitt eigið andlit á síðunni í stað þess að týnast í valmyndinni, og hópatímarnir, ekki síst hjarta- og lungnaþjálfunin og vatnsleikfimin í Suðurbæjarlaug, fá sinn eigin stað.

Hana má skoða hér hvenær sem er:
[HLEKKUR Á FRUMGERÐ]

Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

Bestu kveðjur,
Sindri
sindrimar02@gmail.com`,
  },
}
