/**
 * Barna- og fjölskyldustofa, "Öruggt skjól" concept.
 *
 * A warm, unofficial redesign concept that gathers every service under
 * Barna- og fjölskyldustofa (BOFS) into one friendly, honest hub, plus the
 * institutional context (the agency, the system, the law) a state body needs.
 *
 * Every user-facing string carries { is, en }; Icelandic is the original.
 * Copy rules: professional and warm, no em or en dashes anywhere. Hyphens in
 * Icelandic compounds (SÓK-meðferð, round-the-clock) are correct and allowed.
 *
 * FACTS: verified July 2026 against island.is/s/bofs, stjornarradid.is,
 * althingi.is and the BOFS Ársskýrsla 2024. Key points:
 *  - BOFS answers to mennta- og barnamálaráðuneytið (unchanged in 2026).
 *  - Fannafold no longer operates; its role sits with Stuðningsheimilið Blönduhlíð.
 *  - Stuðlar: began 1994, purpose-built premises at Fossaleyni 1996; now
 *    neyðarvistun only after the Oct 2024 fire and the move of treatment to
 *    Lækjarbakki in early 2026.
 *  - Bjargey (Eyjafjarðarsveit, frá 2022) serves stúlkur og stálp.
 *  - Lækjarbakki (Gunnarsholt) serves stráka og stálp; first resident March
 *    2026, formally opened 8 May 2026 by Inga Sæland, six places.
 *  - Barnahús frá 1998, fyrsta og elsta Barnahús í Evrópu.
 *  - MST frá 2008 (um land allt frá 2015); heimsóknir eftir samkomulagi.
 *  - SÓK-meðferð: sálfræðiþjónusta vegna óviðeigandi kynhegðunar (ekki ókeypis).
 */

export type Lang = 'is' | 'en'
export type L = Record<Lang, string>

const t = (is: string, en: string): L => ({ is, en })

/* ── The organisation ─────────────────────────────────────────────────── */

export const ORG = {
  name: 'Barna- og fjölskyldustofa',
  short: 'BOFS',
  englishName: 'National Agency for Children and Families',
  concept: t('Öruggt skjól', 'A safe place'),
  motto: t('Stöndum vörð um öll börn', 'We stand guard over every child'),
  established: 2022,
  address: 'Borgartún 21, 105 Reykjavík',
  phone: '530 2600',
  email: 'bofs@bofs.is',
  hours: t('Alla virka daga 9:00 til 12:00 og 12:30 til 15:00', 'Weekdays 9:00 to 12:00 and 12:30 to 15:00'),
  ministry: t('Mennta- og barnamálaráðuneytið', 'Ministry of Education and Children'),
  law: t('Lög um Barna- og fjölskyldustofu nr. 87/2021', 'Act no. 87/2021 on the National Agency for Children and Families'),
  predecessor: t('Barnaverndarstofa', 'the Government Agency for Child Protection'),
  staff: t('169 starfsmenn í árslok 2024', '169 staff at the end of 2024'),
  about: t(
    'Barna- og fjölskyldustofa er ríkisstofnun sem vinnur að farsæld barna um allt land. Hún tók til starfa 1. janúar 2022 og leysti Barnaverndarstofu af hólmi. Stofan rekur meðferðarheimili, Barnahús og fjölskyldumeðferð, heldur utan um fóstur og styður barnaverndarþjónustu sveitarfélaga með ráðgjöf, þjálfun og þekkingu.',
    'Barna- og fjölskyldustofa (the National Agency for Children and Families) is a state agency working for the wellbeing of children across Iceland. It began operating on 1 January 2022, succeeding the former Government Agency for Child Protection. It runs the treatment homes, Barnahús and family therapy, holds the foster care system together, and supports municipal child protection services with guidance, training and knowledge.',
  ),
}

/* ── Concept promise (hero) ───────────────────────────────────────────── */

export const HERO = {
  kicker: t('Barna- og fjölskyldustofa', 'National Agency for Children and Families'),
  title: t('Öruggt skjól fyrir hvert barn', 'A safe place for every child'),
  lead: t(
    'Þegar á reynir eiga börn og fjölskyldur rétt á hlýju, öryggi og skýrum svörum. Hér eru öll úrræði Barna- og fjölskyldustofu á einum stað, útskýrð á mannamáli.',
    'When times are hard, children and families deserve warmth, safety and clear answers. Here is every service of Barna- og fjölskyldustofa in one place, explained in plain language.',
  ),
  ctaPrimary: t('Finna réttan stuðning', 'Find the right support'),
  ctaSecondary: t('Hvernig barn fær aðstoð', 'How a child gets help'),
  reassure: t('Í bráðri neyð skaltu strax hringja í 112', 'In an emergency, call 112 right away'),
}

/* ── Wayfinder: three doors (audience triage) ─────────────────────────── */

export const WAYFINDER = {
  hand: t('Hvert liggur leiðin?', 'Which way in?'),
  title: t('Finndu þína leið inn', 'Find your way in'),
  doors: [
    {
      key: 'ahyggjur',
      hueKey: 'terra',
      title: t('Ég hef áhyggjur af barni', 'I am worried about a child'),
      body: t('Sjáðu hvernig þú tilkynnir og hvað gerist næst.', 'See how to report a concern and what happens next.'),
      to: '#tilkynna',
    },
    {
      key: 'fagfolk',
      hueKey: 'sky',
      title: t('Ég er fagaðili', 'I work with children'),
      body: t('Kynntu þér kerfið, úrræðin og lögin á bak við þau.', 'Get to know the system, the services and the law behind them.'),
      to: '/preview/bofs/kerfid',
    },
    {
      key: 'fostur',
      hueKey: 'sun',
      title: t('Ég gæti orðið fósturforeldri', 'I could become a foster parent'),
      body: t('Sjáðu hvað fóstur felur í sér og hvernig fyrsta skrefið er.', 'See what fostering involves and how the first step is taken.'),
      to: '/preview/bofs/fostur#gerast',
    },
  ],
}

/* ── Four warm pillars ────────────────────────────────────────────────── */

export const VALUES: { key: string; icon: string; title: L; body: L }[] = [
  {
    key: 'safety',
    icon: 'shield',
    title: t('Öryggi', 'Safety'),
    body: t(
      'Hvert barn á rétt á að vera óhult. Öll úrræði byggja á vernd, ró og skýrum ramma.',
      'Every child has the right to be safe. Every service is built on protection, calm and a clear framework.',
    ),
  },
  {
    key: 'warmth',
    icon: 'heart',
    title: t('Hlýja', 'Warmth'),
    body: t(
      'Fagfólk sem mætir barni og fjölskyldu af virðingu, hlýju og án fordóma.',
      'Professionals who meet each child and family with respect, warmth and no judgement.',
    ),
  },
  {
    key: 'family',
    icon: 'home',
    title: t('Fjölskyldan með', 'Family included'),
    body: t(
      'Barni farnast best nálægt sínu fólki. Þess vegna vinnum við alltaf með fjölskyldunni, ekki fram hjá henni.',
      'A child thrives best close to their own people. So we always work with the family, never around it.',
    ),
  },
  {
    key: 'hope',
    icon: 'sun',
    title: t('Von', 'Hope'),
    body: t(
      'Erfiðir kaflar taka enda. Markmiðið er alltaf betri dagar heima, í skóla og með vinum.',
      'Hard chapters end. The goal is always better days at home, in school and with friends.',
    ),
  },
]

/* ── The referral path (3 steps) ──────────────────────────────────────── */

export const PATH = {
  title: t('Hvernig barn fær aðstoð', 'How a child gets help'),
  lead: t(
    'Leiðin að úrræðunum liggur í gegnum barnaverndarþjónustu í þínu sveitarfélagi. Þjónustan kostar ekkert og það er alltaf í lagi að taka fyrsta skrefið.',
    'The path to our services runs through the child protection service in your municipality. The service is free of charge, and it is always okay to take the first step.',
  ),
  steps: [
    {
      n: 1,
      title: t('Þú hefur samband', 'You reach out'),
      body: t(
        'Foreldri, ungmenni, skóli eða heilsugæsla hefur samband við barnavernd í sveitarfélaginu. Áhyggjur duga. Þú þarft ekki að hafa öll svörin.',
        'A parent, young person, school or health centre contacts child protection in the municipality. Concern is enough. You do not need all the answers.',
      ),
    },
    {
      n: 2,
      title: t('Staðan er metin', 'The situation is assessed'),
      body: t(
        'Barnavernd kynnist stöðu barnsins og fjölskyldunnar og finnur, í samvinnu við ykkur, hvaða stuðningur á best við.',
        'Child protection gets to know the child and family and, together with you, finds the support that fits best.',
      ),
    },
    {
      n: 3,
      title: t('Rétta úrræðið tekur við', 'The right service steps in'),
      body: t(
        'Barnavernd sækir um úrræði hjá Barna- og fjölskyldustofu, hvort sem það er stuðningur heima, meðferð eða öruggt heimili.',
        'Child protection applies to Barna- og fjölskyldustofa for a service, whether that is support at home, treatment or a safe home.',
      ),
    },
  ],
}

/* ── Services ─────────────────────────────────────────────────────────── */

export type Category = 'heimili' | 'thjonusta'

export const CATEGORIES: { key: Category; title: L; blurb: L }[] = [
  {
    key: 'heimili',
    title: t('Meðferðarheimili', 'Treatment homes'),
    blurb: t(
      'Örugg heimili þar sem börn og ungmenni á aldrinum 12 til 18 ára fá umönnun allan sólarhringinn, hlýju og einstaklingsmiðaða meðferð.',
      'Safe homes where children and young people aged 12 to 18 receive round-the-clock care, warmth and individualised treatment.',
    ),
  },
  {
    key: 'thjonusta',
    title: t('Fjölskyldu- og stuðningsþjónusta', 'Family & support services'),
    blurb: t(
      'Stuðningur sem kemur til fjölskyldunnar, hvort sem er heim, í Barnahús eða inn á nýtt heimili, með fagfólki sér við hlið.',
      'Support that comes to the family, whether at home, in Barnahús or into a new home, with professionals by their side.',
    ),
  },
]

export interface Fact {
  label: L
  value: L
}

export interface Service {
  slug: string
  name: string
  category: Category
  kind: L
  hue: string
  hueSoft: string
  art: 'studlar' | 'blonduhlid' | 'bjargey' | 'laekjarbakki' | 'barnahus' | 'mst' | 'sok' | 'fostur'
  tagline: L
  card: L
  who: L
  what: L
  how: L
  facts: Fact[]
  note: L
}

export const SERVICES: Service[] = [
  {
    slug: 'studlar',
    name: 'Stuðlar',
    category: 'heimili',
    kind: t('Neyðarvistun', 'Emergency care'),
    hue: '#D9744E',
    hueSoft: '#F6E0D3',
    art: 'studlar',
    tagline: t('Þegar þarf öruggan stað strax', 'When a safe place is needed right now'),
    card: t(
      'Neyðarvistun ríkisins fyrir ungmenni, fyrsti öruggi viðkomustaðurinn þegar bráð staða kemur upp.',
      'The state emergency care unit for young people, the first safe stop when an acute situation arises.',
    ),
    who: t(
      'Ungmenni á aldrinum 12 til 18 ára sem þurfa tafarlaust öruggt skjól og mat á aðstæðum sínum.',
      'Young people aged 12 to 18 who need immediate safety and an assessment of their situation.',
    ),
    what: t(
      'Stuðlar hafa tekið á móti börnum frá árinu 1994 og flutt í núverandi húsnæði að Fossaleyni árið 1996. Þeir eru fyrsti viðkomustaðurinn í bráðum aðstæðum. Tekið er á móti ungmenninu í rólegu og öruggu umhverfi, hlúð að því allan sólarhringinn og staða þess metin af fagfólki svo hægt sé að finna næsta rétta skref í rólegheitum. Neyðarvistun varir að hámarki í fjórtán daga.',
      'Stuðlar has received children since 1994 and moved into its current premises at Fossaleyni in 1996. It is the first stop in acute situations. The young person is received in a calm, secure environment, cared for around the clock, and their situation assessed by professionals so the next right step can be found without haste. An emergency stay lasts a maximum of fourteen days.',
    ),
    how: t(
      'Barnaverndarþjónusta ráðstafar ungmenni í neyðarvistun.',
      'The child protection service places a young person in emergency care.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Ungmenni 12 til 18 ára', 'Young people 12 to 18') },
      { label: t('Dvöl', 'Stay'), value: t('Allt að 14 dagar', 'Up to 14 days') },
      { label: t('Staðsetning', 'Location'), value: t('Fossaleyni, Grafarvogi', 'Fossaleyni, Grafarvogur') },
      { label: t('Tók til starfa', 'Established'), value: t('1994', '1994') },
    ],
    note: t(
      'Stuðlar eru oft fyrsta skrefið en ekki það síðasta. Héðan liggur leiðin áfram í meðferð eða heim með réttum stuðningi.',
      'Stuðlar is often the first step but not the last. From here the path leads on to treatment, or home with the right support.',
    ),
  },
  {
    slug: 'blonduhlid',
    name: 'Blönduhlíð',
    category: 'heimili',
    kind: t('Grunnmeðferð og stuðningsheimili', 'Primary treatment & support home'),
    hue: '#6E9E6E',
    hueSoft: '#DCEBD8',
    art: 'blonduhlid',
    tagline: t('Að kortleggja stöðuna, saman', 'Mapping the situation, together'),
    card: t(
      'Grunnmeðferð þar sem staða barns er kortlögð og fyrstu skrefin tekin, ásamt stuðningsheimili fyrir börn sem geta ekki snúið heim að meðferð lokinni.',
      'Primary treatment where the situation is mapped and the first steps taken, plus a support home for children who cannot return home after treatment.',
    ),
    who: t(
      'Börn á aldrinum 12 til 18 ára sem þurfa markvissa greiningu og upphaf meðferðar, og börn sem þurfa áframhaldandi heimili og stuðning að lokinni meðferð.',
      'Children aged 12 to 18 who need focused assessment and the start of treatment, and children who need a continued home and support once treatment ends.',
    ),
    what: t(
      'Í Blönduhlíð fer fram grunnmeðferð sem tekur að jafnaði 8 til 12 vikur, með reglulegum heimferðarleyfum. Unnið er að því að skilja styrkleika, áskoranir og þarfir barnsins og fjölskyldunnar og út frá því verður til skýr áætlun um næstu skref. Við heimilið er einnig starfrækt stuðningsheimili fyrir börn sem geta ekki búið hjá forsjáraðilum sínum að lokinni meðferð. Þar heldur stuðningurinn áfram í öruggum og heimilislegum ramma.',
      'Blönduhlíð provides primary treatment that usually lasts 8 to 12 weeks, with regular home visits. The work is to understand the strengths, challenges and needs of the child and family, and from that a clear plan for the next steps takes shape. The home also runs a support home for children who cannot live with their guardians once treatment ends. There, support continues within a safe, home-like framework.',
    ),
    how: t(
      'Barnaverndarþjónusta sækir um grunnmeðferð eða stuðningsheimili hjá Barna- og fjölskyldustofu.',
      'The child protection service applies for primary treatment or the support home through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Börn 12 til 18 ára', 'Children 12 to 18') },
      { label: t('Grunnmeðferð', 'Primary treatment'), value: t('Að jafnaði 8 til 12 vikur', 'Usually 8 to 12 weeks') },
      { label: t('Einnig', 'Also'), value: t('Stuðningsheimili eftir meðferð', 'Support home after treatment') },
      { label: t('Áhersla', 'Focus'), value: t('Greining, áætlun og eftirfylgd', 'Assessment, planning, follow-up') },
    ],
    note: t(
      'Versti dagurinn segir ekki alla söguna. Hér byrjum við á að sjá barnið í heild og byggja á því sem er heilt.',
      'The worst day does not tell the whole story. Here we start by seeing the whole child and building on what is already whole.',
    ),
  },
  {
    slug: 'bjargey',
    name: 'Bjargey',
    category: 'heimili',
    kind: t('Framhaldsmeðferð fyrir stúlkur og stálp', 'Continued treatment for girls'),
    hue: '#D98895',
    hueSoft: '#F6DEE2',
    art: 'bjargey',
    tagline: t('Rými til að vaxa', 'Room to grow'),
    card: t(
      'Framhaldsmeðferð fyrir stúlkur og stálp þar sem breytingar fá tíma til að festa rætur.',
      'Continued treatment for girls and non-binary youth, where change is given time to take root.',
    ),
    who: t(
      'Stúlkur og stálp sem hafa lokið grunnmeðferð og þurfa lengri tíma og stuðning til að byggja upp nýjar venjur.',
      'Girls and non-binary young people who have completed primary treatment and need more time and support to build new routines.',
    ),
    what: t(
      'Bjargey er í Eyjafjarðarsveit og hefur verið starfrækt frá 27. júní 2022. Þar er unnið áfram með það sem hófst í grunnmeðferð, í rólegu og heimilislegu umhverfi þar sem traust fær að myndast. Áhersla er á daglegar venjur, skóla, tengsl og trú á eigin getu, og skólagangan fer fram í samstarfi við skóla í sveitinni. Dvölin getur varað í allt að sex mánuði.',
      'Bjargey is in Eyjafjarðarsveit and has operated since 27 June 2022. There, the work started in primary treatment continues in a calm, home-like setting where trust can form. The focus is on daily routines, school, relationships and self-belief, and schooling takes place in cooperation with a local school. A stay can last up to six months.',
    ),
    how: t(
      'Barnaverndarþjónusta sækir um framhaldsmeðferð hjá Barna- og fjölskyldustofu.',
      'The child protection service applies for continued treatment through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Stúlkur og stálp, eftir grunnmeðferð', 'Girls and non-binary youth, after primary treatment') },
      { label: t('Tegund', 'Type'), value: t('Framhaldsmeðferð', 'Continued treatment') },
      { label: t('Staðsetning', 'Location'), value: t('Eyjafjarðarsveit', 'Eyjafjarðarsveit') },
      { label: t('Lengd', 'Length'), value: t('Allt að 6 mánuðir', 'Up to 6 months') },
    ],
    note: t(
      'Breytingar sem endast gerast ekki á einni nóttu. Hér er tíminn bandamaður, ekki óvinur.',
      'Change that lasts does not happen overnight. Here, time is an ally, not an enemy.',
    ),
  },
  {
    slug: 'laekjarbakki',
    name: 'Lækjarbakki',
    category: 'heimili',
    kind: t('Framhaldsmeðferð fyrir stráka og stálp', 'Continued treatment for boys'),
    hue: '#5E97B8',
    hueSoft: '#D6E6EE',
    art: 'laekjarbakki',
    tagline: t('Sveitakyrrð og traustur grunnur', 'Country calm and steady ground'),
    card: t(
      'Framhaldsmeðferð fyrir stráka og stálp í Gunnarsholti á Rangárvöllum. Heimilið opnaði í endurnýjuðu húsnæði vorið 2026.',
      'Continued treatment for boys and non-binary youth at Gunnarsholt in Rangárvellir. The home opened in renovated premises in spring 2026.',
    ),
    who: t(
      'Strákar og stálp sem hafa lokið grunnmeðferð og þurfa lengri tíma, rútínu og fjarlægð frá álagi til að ná fótfestu, meðal annars vegna hegðunar- og vímuefnavanda.',
      'Boys and non-binary young people who have completed primary treatment and need more time, routine and distance from everyday pressure to find their footing, for reasons that can include behavioural and substance use difficulties.',
    ),
    what: t(
      'Lækjarbakki tók til starfa í Gunnarsholti á Rangárvöllum í mars 2026 og var formlega opnaður 8. maí sama ár. Heimilið rúmar allt að sex ungmenni í senn. Húsnæðið var endurnýjað með áherslu á öryggi, hlýlegt umhverfi og heimilislegt yfirbragð, og sveitin sjálf gefur ró, rútínu og útiveru sem styður meðferðina. Meðferðin er einstaklingsmiðuð og byggð á gagnreyndum aðferðum.',
      'Lækjarbakki began operating at Gunnarsholt in Rangárvellir in March 2026 and was formally opened on 8 May that year. The home takes up to six young people at a time. The premises were renovated with an emphasis on safety, a warm environment and a home-like character, and the countryside itself offers calm, routine and outdoor life that supports the treatment. Treatment is individualised and grounded in evidence-based methods.',
    ),
    how: t(
      'Barnaverndarþjónusta sækir um framhaldsmeðferð hjá Barna- og fjölskyldustofu.',
      'The child protection service applies for continued treatment through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Stráka og stálp, eftir grunnmeðferð', 'Boys and non-binary youth, after primary treatment') },
      { label: t('Pláss', 'Places'), value: t('Allt að 6 ungmenni', 'Up to 6 young people') },
      { label: t('Staðsetning', 'Location'), value: t('Gunnarsholti á Rangárvöllum', 'Gunnarsholt, Rangárvellir') },
      { label: t('Opnað', 'Opened'), value: t('Mars 2026', 'March 2026') },
    ],
    note: t(
      'Stundum þarf pláss, kyrrð og ný sjónarhorn til að finna sjálfan sig aftur.',
      'Sometimes it takes space, quiet and a new horizon to find yourself again.',
    ),
  },
  {
    slug: 'barnahus',
    name: 'Barnahús',
    category: 'thjonusta',
    kind: t('Stuðningur eftir ofbeldi', 'Support after abuse'),
    hue: '#C98BA6',
    hueSoft: '#EFDDE8',
    art: 'barnahus',
    tagline: t('Allt undir einu þaki, á forsendum barnsins', 'Everything under one roof, on the child’s terms'),
    card: t(
      'Barnvænt hús fyrir börn sem mögulega hafa orðið fyrir ofbeldi. Viðtal, greining og meðferð á einum stað.',
      'A child-friendly house for children who may have experienced abuse. Interview, assessment and treatment in one place.',
    ),
    who: t(
      'Börn sem grunur leikur á að hafi sætt kynferðislegu eða líkamlegu ofbeldi, eða heimilisofbeldi.',
      'Children who may have been subjected to sexual or physical abuse, or to domestic violence.',
    ),
    what: t(
      'Barnahús hefur starfað frá 1998 og er fyrsta og elsta Barnahús í Evrópu, fyrirmynd sambærilegra húsa víða um álfuna. Þar fer allt fram undir einu þaki, í hlýlegu og barnvænu umhverfi, svo barn þurfi ekki að endurtaka erfiða sögu sína aftur og aftur á mörgum stöðum. Þar fara fram viðtöl, læknisskoðun, greining og meðferð, og fjölskyldan fær einnig stuðning. Þjónustan er veitt að kostnaðarlausu.',
      'Barnahús has operated since 1998 and is the first and oldest Barnahús in Europe, a model for similar houses across the continent. Everything happens under one roof, in a warm and child-friendly setting, so a child does not have to repeat a difficult story again and again in many places. Interviews, medical examination, assessment and treatment all take place there, and the family receives support as well. The service is provided free of charge.',
    ),
    how: t(
      'Barnaverndarþjónusta óskar eftir aðkomu Barnahúss. Barn og foreldrar fá alla aðstoð á einum stað, að kostnaðarlausu.',
      'The child protection service requests the involvement of Barnahús. The child and parents receive all support in one place, free of charge.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Börn sem kunna að hafa orðið fyrir ofbeldi', 'Children who may have experienced abuse') },
      { label: t('Undir einu þaki', 'Under one roof'), value: t('Viðtal, skoðun, greining, meðferð', 'Interview, exam, assessment, treatment') },
      { label: t('Kostnaður', 'Cost'), value: t('Að kostnaðarlausu', 'Free of charge') },
      { label: t('Sími', 'Phone'), value: t('530 2500', '530 2500') },
    ],
    note: t(
      'Ekkert barn ber ábyrgð á því sem kom fyrir það. Í Barnahúsi er hlustað á barnið og því fylgt áfram, skref fyrir skref.',
      'No child is responsible for what happened to them. In Barnahús the child is heard and guided forward, step by step.',
    ),
  },
  {
    slug: 'mst',
    name: 'MST-fjölkerfameðferð',
    category: 'thjonusta',
    kind: t('Meðferð heima hjá fjölskyldunni', 'Treatment in the family home'),
    hue: '#5FA093',
    hueSoft: '#D5EAE3',
    art: 'mst',
    tagline: t('Stuðningur sem kemur heim til ykkar', 'Support that comes to your home'),
    card: t(
      'Fjölskyldumeðferð heima þar sem barnið býr áfram hjá sínu fólki og foreldrar fá öflug verkfæri.',
      'Family therapy at home, where the child keeps living with their own family and parents get practical tools.',
    ),
    who: t(
      'Fjölskyldur barna á aldrinum 12 til 18 ára sem glíma við fjölþættan vanda, svo sem afskipti lögreglu, erfiðleika í skóla, ofbeldi eða vímuefnanotkun.',
      'Families of children aged 12 to 18 facing complex challenges, such as police involvement, school difficulties, violence or substance use.',
    ),
    what: t(
      'MST-fjölkerfameðferð fer fram þar sem lífið gerist, heima, í skólanum og í nærumhverfi barnsins. Sérþjálfaður meðferðaraðili kemur heim með reglulegum heimsóknum eftir samkomulagi og er í símasambandi allan sólarhringinn. Áherslan er á að efla foreldra svo þeir hafi verkfærin til að styðja barnið sitt. Meðferðin tekur að jafnaði 3 til 5 mánuði og barnið býr heima allan tímann. MST hefur verið veitt á Íslandi frá 2008 og um land allt frá 2015.',
      'MST multisystemic therapy takes place where life happens: at home, in school and in the child’s surroundings. A specially trained therapist visits the home regularly, by arrangement, and is reachable by phone around the clock. The focus is on strengthening parents so they have the tools to support their child. Treatment usually lasts 3 to 5 months and the child lives at home the whole time. MST has been available in Iceland since 2008 and nationwide since 2015.',
    ),
    how: t(
      'Barnaverndarþjónustur um allt land geta vísað fjölskyldum í MST hjá Barna- og fjölskyldustofu.',
      'Child protection services anywhere in Iceland can refer families to MST through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Fjölskyldur barna 12 til 18 ára', 'Families of children 12 to 18') },
      { label: t('Hvar', 'Where'), value: t('Heima hjá fjölskyldunni', 'In the family home') },
      { label: t('Lengd', 'Length'), value: t('Að jafnaði 3 til 5 mánuðir', 'Usually 3 to 5 months') },
      { label: t('Stuðningur', 'Support'), value: t('Heimsóknir og sími allan sólarhringinn', 'Home visits and phone around the clock') },
    ],
    note: t(
      'Barn þarf ekki alltaf að fara að heiman til að fá hjálp. Stundum er sterkasta úrræðið að styrkja heimilið sjálft.',
      'A child does not always have to leave home to get help. Sometimes the strongest intervention is to strengthen the home itself.',
    ),
  },
  {
    slug: 'sok',
    name: 'SÓK-meðferð',
    category: 'thjonusta',
    kind: t('Sálfræðiþjónusta fyrir börn', 'Psychological service for children'),
    hue: '#9A86B8',
    hueSoft: '#E3DCEF',
    art: 'sok',
    tagline: t('Skilningur, ekki skömm', 'Understanding, not shame'),
    card: t(
      'Sálfræðimeðferð fyrir börn vegna óviðeigandi eða skaðlegrar kynhegðunar, veitt af hlýju og virðingu.',
      'Psychological treatment for children showing inappropriate or harmful sexual behaviour, delivered with warmth and respect.',
    ),
    who: t(
      'Börn sem þurfa aðstoð vegna óviðeigandi eða skaðlegrar kynhegðunar, og fjölskyldur þeirra.',
      'Children who need help with inappropriate or harmful sexual behaviour, and their families.',
    ),
    what: t(
      'SÓK-meðferð er sálfræðiþjónusta vegna óviðeigandi kynhegðunar. Hún styður barnið, dregur úr neikvæðum afleiðingum hegðunarinnar og minnkar líkur á að hún endurtaki sig. Unnið er af fagmennsku og hlýju, með skilningi frekar en skömm, svo barnið geti haldið áfram á heilbrigðari braut.',
      'SÓK is a psychological service for children showing inappropriate sexual behaviour. It supports the child, reduces the negative consequences of the behaviour and lowers the likelihood of it repeating. The work is professional and warm, meeting the child with understanding rather than shame, so they can move forward on a healthier path.',
    ),
    how: t(
      'Barnaverndarþjónusta vísar barni í SÓK-meðferð hjá Barna- og fjölskyldustofu.',
      'The child protection service refers a child to SÓK through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Börn og fjölskyldur þeirra', 'Children and their families') },
      { label: t('Tegund', 'Type'), value: t('Sálfræðimeðferð', 'Psychological treatment') },
      { label: t('Markmið', 'Goal'), value: t('Stuðningur og minni endurtekning', 'Support and less recurrence') },
      { label: t('Nálgun', 'Approach'), value: t('Fagmennska og hlýja', 'Professionalism and warmth') },
    ],
    note: t(
      'Börn eru ekki vandamál sem á að leysa. Þau eru manneskjur sem eiga skilið stuðning til að gera betur.',
      'Children are not a problem to be solved. They are people who deserve support to do better.',
    ),
  },
  {
    slug: 'fostur',
    name: 'Fóstur',
    category: 'thjonusta',
    kind: t('Öruggt heimili hjá fósturfjölskyldu', 'A safe home with a foster family'),
    hue: '#D68F5A',
    hueSoft: '#F4E1CC',
    art: 'fostur',
    tagline: t('Þegar barn þarf annað heimili um tíma', 'When a child needs another home for a while'),
    card: t(
      'Þegar barn getur ekki búið heima fær það öruggt skjól hjá fósturfjölskyldu, tímabundið eða til frambúðar.',
      'When a child cannot live at home, they find safety with a foster family, for a while or for good.',
    ),
    who: t(
      'Börn sem vegna aðstæðna sinna þurfa að búa hjá öðrum en foreldrum sínum um lengri eða skemmri tíma.',
      'Children who, because of their circumstances, need to live with someone other than their parents for a longer or shorter time.',
    ),
    what: t(
      'Fóstur felst í því að barnaverndarþjónusta felur fósturforeldrum umsjá barns. Það getur verið tímabundið, varanlegt eða styrkt fóstur með sérstökum stuðningi þegar barn glímir við verulegan vanda. Fósturforeldrar fara í gegnum hæfnismat og námskeið, og Barna- og fjölskyldustofa styður þá alla leið með ráðgjöf, samningum og eftirfylgd.',
      'Foster care means that the child protection service places a child in the care of foster parents. It can be temporary, permanent, or supported foster care with extra help when a child faces serious difficulties. Foster parents go through an assessment and training, and Barna- og fjölskyldustofa supports them the whole way with guidance, agreements and follow-up.',
    ),
    how: t(
      'Barnaverndarþjónusta ráðstafar barni í fóstur. Þau sem vilja gerast fósturforeldrar byrja á hæfnismati og námskeiði hjá Barna- og fjölskyldustofu.',
      'The child protection service places a child in foster care. Those who wish to become foster parents begin with an assessment and training at Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Tegundir', 'Types'), value: t('Tímabundið, varanlegt, styrkt fóstur', 'Temporary, permanent, supported') },
      { label: t('Fyrir', 'For'), value: t('Börn sem þurfa annað heimili', 'Children who need another home') },
      { label: t('Fósturforeldrar', 'Foster parents'), value: t('Hæfnismat og námskeið', 'Assessment and training') },
      { label: t('Stuðningur', 'Support'), value: t('Ráðgjöf og eftirfylgd frá BOFS', 'Guidance and follow-up from BOFS') },
    ],
    note: t(
      'Sérhvert barn á rétt á heimili þar sem haldið er utan um það. Fósturfjölskyldur gefa það og fá stuðning til þess.',
      'Every child deserves a home where they are held close. Foster families give that, and are supported to do so.',
    ),
  },
]

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug)

/** The three steps to becoming a foster parent (fostur page only). */
export const FOSTER_STEPS = {
  eyebrow: t('Að gerast fósturforeldri', 'Becoming a foster parent'),
  lead: t(
    'Leiðin er skýr og þú ert ekki einn á henni. Barna- og fjölskyldustofa fylgir þér alla leið.',
    'The path is clear and you are not on it alone. Barna- og fjölskyldustofa walks it with you.',
  ),
  steps: [
    {
      n: 1,
      title: t('Hæfnismat', 'Assessment'),
      body: t(
        'Þú byrjar á hæfnismati þar sem farið er yfir aðstæður þínar og hvað fóstur felur í sér, af virðingu og án skuldbindingar.',
        'You begin with an assessment of your circumstances and what fostering involves, with respect and no obligation.',
      ),
    },
    {
      n: 2,
      title: t('Námskeið', 'Training'),
      body: t(
        'Þú sækir námskeið fyrir fósturforeldra þar sem þú færð undirbúning, þekkingu og tengsl við aðra á sömu leið.',
        'You take a course for foster parents where you gain preparation, knowledge and a connection to others on the same path.',
      ),
    },
    {
      n: 3,
      title: t('Ráðgjöf og eftirfylgd', 'Guidance and follow-up'),
      body: t(
        'Þegar barn flytur inn heldur stuðningurinn áfram, með ráðgjöf, samningum og eftirfylgd frá Barna- og fjölskyldustofu.',
        'When a child moves in, the support continues, with guidance, agreements and follow-up from Barna- og fjölskyldustofa.',
      ),
    },
  ],
  cta: t('Hafa samband um fóstur', 'Get in touch about fostering'),
}

/* ── Photography (local; warm environments, no identifiable children) ─── */

export const CENTRE_PHOTO: Record<string, { src: string; alt: L }> = {
  studlar: { src: 'interior-calm.jpg', alt: t('Hlýleg og notaleg setustofa í dagsbirtu', 'A warm, homely living room in daylight') },
  blonduhlid: { src: 'interior-evening.jpg', alt: t('Notaleg stofa böðuð kvöldbirtu', 'A cosy room bathed in evening light') },
  bjargey: { src: 'interior-nook.jpg', alt: t('Leshorn við glugga með útsýni', 'A reading nook by a window with a view') },
  laekjarbakki: {
    src: 'laekjarbakki-herbergi.jpg',
    alt: t('Herbergi á meðferðarheimilinu Lækjarbakka í Gunnarsholti', 'A resident bedroom at the Lækjarbakki treatment home in Gunnarsholt'),
  },
  barnahus: { src: 'interior-bright.jpg', alt: t('Björt og hlýleg stofa full af dagsbirtu', 'A bright, warm room full of daylight') },
  mst: { src: 'interior-family.jpg', alt: t('Notaleg fjölskyldustofa', 'A cosy family living room') },
  sok: { src: 'land-peak.jpg', alt: t('Grænt fjall undir mildum himni', 'A green mountain under a gentle sky') },
  fostur: {
    src: 'land-coast.jpg',
    alt: t('Sveitabær við fjörð, umvafinn fjöllum, táknræn mynd', 'A farmstead by a fjord, embraced by mountains, representative image'),
  },
}

/** Landing "warmth" gallery. */
export const GALLERY = {
  eyebrow: t('Hlýja og andrými', 'Warmth and room to breathe'),
  title: t('Staðir þar sem barni á að líða eins og heima hjá sér', 'Places where a child should feel at home'),
  lead: t(
    'Hlý rými, græn náttúra og opnar dyr. Umhverfið skiptir máli þegar barni á að líða vel.',
    'Warm rooms, green nature and open doors. Surroundings matter when a child needs to feel safe.',
  ),
  photos: [
    { src: 'laekjarbakki-hus.jpg', alt: t('Meðferðarheimilið Lækjarbakki í Gunnarsholti að vetri', 'The Lækjarbakki treatment home in Gunnarsholt in winter') },
    { src: 'interior-bright.jpg', alt: t('Björt og hlýleg stofa', 'A bright, warm room') },
    { src: 'laekjarbakki-tonlist.jpg', alt: t('Tónlistarherbergi á Lækjarbakka', 'The music room at Lækjarbakki') },
    { src: 'land-lupines.jpg', alt: t('Lúpínubreiða undir íslenskum fjöllum', 'A lupine meadow below Icelandic mountains') },
  ] as { src: string; alt: L }[],
}

/* ── National statistics (verified; sober big-number tiles) ───────────── */

export interface Stat {
  value: number
  format?: 'thousand' | 'plain'
  label: L
}

export const STATS = {
  eyebrow: t('Starfið í tölum', 'The work in numbers'),
  title: t('Umfangið á bak við hlýjuna', 'The scale behind the warmth'),
  lead: t(
    'Tölur segja ekki alla söguna, en þær sýna hversu mörg börn og fjölskyldur treysta á kerfið á hverju ári.',
    'Numbers do not tell the whole story, but they show how many children and families rely on the system each year.',
  ),
  source: t(
    'Heimildir: Barna- og fjölskyldustofa, ársskýrsla 2024 og birt talnaefni.',
    'Sources: Barna- og fjölskyldustofa, annual report 2024 and published figures.',
  ),
  items: [
    { value: 16751, format: 'thousand', label: t('Tilkynningar til barnaverndar árið 2024', 'Reports to child protection in 2024') },
    { value: 23, format: 'plain', label: t('Barnaverndarþjónustur um allt land', 'Child protection services across the country') },
    { value: 158, format: 'plain', label: t('Börn í MST-fjölkerfameðferð árið 2024', 'Children in MST therapy in 2024') },
    { value: 169, format: 'plain', label: t('Starfsmenn Barna- og fjölskyldustofu', 'Staff at Barna- og fjölskyldustofa') },
  ] as Stat[],
}

/* ── Duty to report (tilkynningarskylda) ──────────────────────────────── */

export const REPORT = {
  eyebrow: t('Tilkynningarskylda', 'The duty to report'),
  title: t('Hefur þú áhyggjur af barni?', 'Are you worried about a child?'),
  lead: t(
    'Áhyggjur duga. Þú þarft engar sannanir og það er ekki þitt hlutverk að rannsaka málið, aðeins að láta vita.',
    'Concern is enough. You need no proof and it is not your job to investigate, only to let someone know.',
  ),
  emergency: t(
    'Ef barn er í bráðri hættu skaltu strax hringja í 112.',
    'If a child is in immediate danger, call 112 right away.',
  ),
  statute: t(
    'Tilkynningarskylda fagfólks gengur framar ákvæðum laga um þagnarskyldu.',
    'For professionals, the duty to report overrides statutory confidentiality.',
  ),
  statuteRef: t('16. og 17. gr. barnaverndarlaga nr. 80/2002', 'Articles 16 and 17, Child Protection Act no. 80/2002'),
  lanes: [
    {
      key: 'almenningur',
      title: t('Almenningur', 'Everyone'),
      rows: [
        t('Öllum er skylt að tilkynna til barnaverndar ef áhyggjur vakna af barni.', 'Everyone is obliged to report to child protection if a concern arises about a child.'),
        t('Þú hefur samband við barnaverndarþjónustu í sveitarfélaginu eða hringir í 112.', 'You contact the child protection service in the municipality or call 112.'),
        t('Þú mátt óska nafnleyndar og fagfólk metur stöðuna í kjölfarið.', 'You may request anonymity, and professionals then assess the situation.'),
      ],
    },
    {
      key: 'fagfolk',
      title: t('Fagfólk', 'Professionals'),
      rows: [
        t('Þau sem starfa með börnum bera ríkari tilkynningarskyldu samkvæmt barnaverndarlögum.', 'Those who work with children carry a stronger duty to report under the Child Protection Act.'),
        t('Skyldan gildir um kennara, heilbrigðisstarfsfólk, lögreglu og fleiri.', 'The duty applies to teachers, health staff, the police and others.'),
        t('Hún gengur framar þagnarskyldu þegar velferð barns er í húfi.', 'It overrides professional confidentiality when a child’s welfare is at stake.'),
      ],
    },
  ],
  ctaPrimary: t('Lesa um allt ferlið', 'Read about the whole process'),
  ctaSecondary: t('Neyð? Hringdu í 112', 'Emergency? Call 112'),
}

/* ── Honest-hope section ──────────────────────────────────────────────── */

export const HONEST = {
  kicker: t('Hreinskilni', 'Honesty'),
  title: t('Við lofum ekki fullkomnun. Við lofum að hlusta og gera betur', 'We do not promise perfection. We promise to listen and do better'),
  body: t(
    'Kerfi sem heldur utan um viðkvæmustu börnin okkar má aldrei standa í stað. Við tökum gagnrýni alvarlega, lærum af því sem miður fer og vinnum á hverjum degi að því að gera betur, með öryggi og líðan barnanna í forgrunni.',
    'A system that cares for our most vulnerable children must never stand still. We take criticism seriously, learn from what goes wrong, and work every day to do better, with the safety and wellbeing of children first.',
  ),
}

/* ── History timeline ─────────────────────────────────────────────────── */

export interface Milestone {
  year: string
  title: L
  body: L
}

export const TIMELINE: { eyebrow: L; title: L; items: Milestone[] } = {
  eyebrow: t('Sagan', 'The story'),
  title: t('Leiðin að Barna- og fjölskyldustofu', 'The road to Barna- og fjölskyldustofa'),
  items: [
    {
      year: '1995',
      title: t('Barnaverndarstofa tekur til starfa', 'Barnaverndarstofa begins'),
      body: t(
        'Sérstök ríkisstofnun um barnavernd verður til og heldur utan um meðferðarheimili og barnaverndarstarf á landsvísu.',
        'A dedicated state agency for child protection is created, overseeing treatment homes and child protection work nationwide.',
      ),
    },
    {
      year: '1998',
      title: t('Barnahús er stofnað', 'Barnahús is founded'),
      body: t(
        'Fyrsta og elsta Barnahús í Evrópu opnar, þar sem allt utan um barn eftir ofbeldi fer fram undir einu þaki.',
        'The first and oldest Barnahús in Europe opens, gathering everything around a child after abuse under one roof.',
      ),
    },
    {
      year: '2008',
      title: t('MST-fjölkerfameðferð hefst', 'MST therapy begins'),
      body: t(
        'Fjölskyldumeðferð heima hefst á suðvesturhorninu og er útvíkkuð um land allt árið 2015.',
        'Family therapy in the home starts in the southwest and is extended nationwide in 2015.',
      ),
    },
    {
      year: '2021',
      title: t('Farsældarlögin samþykkt', 'The Prosperity Act passed'),
      body: t(
        'Ný lög um samþættingu þjónustu í þágu farsældar barna tryggja börnum og foreldrum samþætta þjónustu við hæfi.',
        'A new law on integrating services for children’s prosperity secures joined-up, appropriate services for children and families.',
      ),
    },
    {
      year: '2022',
      title: t('Barna- og fjölskyldustofa tekur við', 'Barna- og fjölskyldustofa takes over'),
      body: t(
        'Ný stofnun tekur til starfa 1. janúar samkvæmt lögum nr. 87/2021 og leysir Barnaverndarstofu af hólmi.',
        'The new agency begins on 1 January under Act no. 87/2021, succeeding Barnaverndarstofa.',
      ),
    },
    {
      year: '2026',
      title: t('Lækjarbakki opnar í Gunnarsholti', 'Lækjarbakki opens in Gunnarsholt'),
      body: t(
        'Nýtt meðferðarheimili tekur til starfa í mars og er formlega opnað 8. maí, með rými fyrir sex ungmenni.',
        'A new treatment home begins in March and is formally opened on 8 May, with room for six young people.',
      ),
    },
  ],
}

/* ── FAQ ──────────────────────────────────────────────────────────────── */

export interface Faq {
  q: L
  a: L
  aud: 'foreldri' | 'fagadili' | 'fostur' | 'almennt'
}

export const FAQ: { eyebrow: L; title: L; hand: L; items: Faq[] } = {
  eyebrow: t('Spurt og svarað', 'Questions and answers'),
  title: t('Það sem fólk spyr oftast', 'What people ask most'),
  hand: t('Spurðu bara', 'Just ask'),
  items: [
    {
      q: t('Kostar þjónustan eitthvað?', 'Does the service cost anything?'),
      a: t('Nei. Þjónusta barnaverndar og úrræði Barna- og fjölskyldustofu, þar á meðal Barnahús, eru fjölskyldum að kostnaðarlausu.', 'No. Child protection services and the services of Barna- og fjölskyldustofa, including Barnahús, are free of charge for families.'),
      aud: 'almennt',
    },
    {
      q: t('Þarf ég sannanir til að tilkynna áhyggjur?', 'Do I need proof to report a concern?'),
      a: t('Nei. Áhyggjur duga. Það er ekki þitt hlutverk að rannsaka, heldur að láta vita. Fagfólk metur stöðuna í kjölfarið.', 'No. Concern is enough. It is not your job to investigate, only to let someone know. Professionals then assess the situation.'),
      aud: 'almennt',
    },
    {
      q: t('Get ég tilkynnt nafnlaust?', 'Can I report anonymously?'),
      a: t('Já. Almenningur má óska nafnleyndar sem gildir gagnvart öllum öðrum en starfsfólki barnaverndar.', 'Yes. Members of the public can request anonymity, which applies to everyone except child protection staff.'),
      aud: 'almennt',
    },
    {
      q: t('Hvernig kemst barn í meðferð?', 'How does a child get into treatment?'),
      a: t('Leiðin liggur alltaf í gegnum barnaverndarþjónustu í sveitarfélaginu, sem sækir um úrræði hjá Barna- og fjölskyldustofu þegar þörf er á.', 'The path always runs through the child protection service in the municipality, which applies to Barna- og fjölskyldustofa for a service when needed.'),
      aud: 'foreldri',
    },
    {
      q: t('Getur barn búið heima á meðan það fær hjálp?', 'Can a child stay at home while getting help?'),
      a: t('Oft já. MST-fjölkerfameðferð fer fram heima og styður foreldra, og alltaf er byrjað á vægustu úrræðunum.', 'Often yes. MST therapy takes place at home and supports parents, and the mildest measures are always tried first.'),
      aud: 'foreldri',
    },
    {
      q: t('Hver getur orðið fósturforeldri?', 'Who can become a foster parent?'),
      a: t('Fólk í ólíkum aðstæðum. Leiðin byrjar á hæfnismati og námskeiði hjá Barna- og fjölskyldustofu, sem styður fósturforeldra alla leið.', 'People in many different situations. The path begins with an assessment and a course at Barna- og fjölskyldustofa, which supports foster parents the whole way.'),
      aud: 'fostur',
    },
    {
      q: t('Hvað er Barnahús?', 'What is Barnahús?'),
      a: t('Barnvænt hús þar sem allt utan um barn sem mögulega hefur orðið fyrir ofbeldi fer fram á einum stað, svo barnið þurfi ekki að endurtaka sögu sína aftur og aftur.', 'A child-friendly house where everything around a child who may have experienced abuse happens in one place, so the child does not have to repeat their story again and again.'),
      aud: 'almennt',
    },
  ],
}

/* ── The child-protection system, end to end (kerfid page) ────────────── */

export const KERFID = {
  title: t('Kerfið', 'The system'),
  hero: {
    kicker: t('Hvernig kerfið virkar', 'How the system works'),
    title: t('Leiðin frá áhyggjum til öryggis', 'The road from worry to safety'),
    lead: t(
      'Hér er öll leiðin, líka sá hluti sem Barna- og fjölskyldustofa rekur ekki sjálf. Barnaverndarþjónusta sveitarfélaga tekur við tilkynningum og metur stöðuna; stofan tekur við þegar þörf er á sérhæfðum úrræðum.',
      'Here is the whole road, including the part Barna- og fjölskyldustofa does not run itself. Municipal child protection services receive reports and assess the situation; the agency steps in when specialised services are needed.',
    ),
  },
  stationsEyebrow: t('Skref fyrir skref', 'Step by step'),
  stations: [
    {
      title: t('Tilkynning', 'A report'),
      body: t(
        'Áhyggjur af barni berast barnaverndarþjónustu, í síma 112 eða beint til sveitarfélagsins. Öllum er skylt að tilkynna og fagfólk ber ríkari skyldu.',
        'A concern about a child reaches child protection, by calling 112 or contacting the municipality directly. Everyone is obliged to report, and professionals carry a stronger duty.',
      ),
      law: t('16. og 17. gr. barnaverndarlaga', 'Articles 16 and 17, Child Protection Act'),
    },
    {
      title: t('Barnaverndarþjónusta sveitarfélagsins', 'The municipal child protection service'),
      body: t(
        'Tilkynningin fer til barnaverndar í sveitarfélagi barnsins. Þar starfar fagfólk sveitarfélagsins, ekki Barna- og fjölskyldustofa. Innan sjö daga er tekin afstaða til þess hvort hefja skuli könnun.',
        'The report goes to child protection in the child’s municipality. This is municipal staff, not Barna- og fjölskyldustofa. Within seven days a decision is made on whether to open an investigation.',
      ),
      law: t('21. gr. barnaverndarlaga', 'Article 21, Child Protection Act'),
    },
    {
      title: t('Könnun og áætlun', 'Investigation and plan'),
      body: t(
        'Barnavernd kynnist stöðu barns og fjölskyldu og gerir, í samvinnu við þau, skriflega áætlun um næstu skref.',
        'Child protection gets to know the child and family and, together with them, draws up a written plan for the next steps.',
      ),
      law: t('22. og 23. gr. barnaverndarlaga', 'Articles 22 and 23, Child Protection Act'),
    },
    {
      title: t('Stuðningur heima fyrst', 'Support at home first'),
      body: t(
        'Alltaf er byrjað á vægustu úrræðum. Leiðbeiningar og stuðningur inn á heimilið eða MST-fjölkerfameðferð styðja fjölskylduna þar sem hún er.',
        'The mildest measures are always tried first. Guidance and in-home support, or MST therapy, strengthen the family where it is.',
      ),
      law: t('Meðalhófsregla, 4. gr. barnaverndarlaga', 'The proportionality principle, Article 4'),
    },
    {
      title: t('Sérhæfð úrræði Barna- og fjölskyldustofu', 'Specialised services from the agency'),
      body: t(
        'Þegar þörf er á meiri stuðningi sækir barnaverndarþjónusta um úrræði hjá Barna- og fjölskyldustofu: Barnahús, meðferðarheimili eða fóstur.',
        'When more support is needed, the child protection service applies to Barna- og fjölskyldustofa for a service: Barnahús, a treatment home or foster care.',
      ),
      law: t('Lög um Barna- og fjölskyldustofu nr. 87/2021', 'Act no. 87/2021'),
    },
    {
      title: t('Eftirfylgd og heimferð', 'Follow-up and return home'),
      body: t(
        'Markmiðið er alltaf betri dagar heima. Stuðningur heldur áfram eftir að meðferð lýkur, með eftirfylgd og skýrri áætlun.',
        'The goal is always better days at home. Support continues after treatment ends, with follow-up and a clear plan.',
      ),
      law: t('Stöðugleiki í uppvexti, 4. gr. barnaverndarlaga', 'Stability in upbringing, Article 4'),
    },
  ],
  rights: {
    eyebrow: t('Réttindi barna', 'Children’s rights'),
    title: t('Barnasáttmálinn er lög á Íslandi', 'The Convention on the Rights of the Child is law in Iceland'),
    lead: t(
      'Samningur Sameinuðu þjóðanna um réttindi barnsins hefur lagagildi á Íslandi, samanber lög nr. 19/2013. Þessi réttindi liggja til grundvallar öllu barnaverndarstarfi.',
      'The UN Convention on the Rights of the Child has the force of law in Iceland under Act no. 19/2013. These rights underpin all child protection work.',
    ),
    items: [
      { article: t('3. gr.', 'Art. 3'), text: t('Það sem er barni fyrir bestu skal alltaf hafa forgang.', 'The best interests of the child always come first.') },
      { article: t('12. gr.', 'Art. 12'), text: t('Barn á rétt á að tjá sig og að hlustað sé á það í málum sem það varða.', 'A child has the right to be heard in matters that concern them.') },
      { article: t('19. gr.', 'Art. 19'), text: t('Sérhvert barn á rétt á vernd gegn ofbeldi og vanrækslu.', 'Every child has the right to protection from violence and neglect.') },
      { article: t('20. gr.', 'Art. 20'), text: t('Barn sem ekki getur búið hjá fjölskyldu sinni á rétt á sérstakri vernd og öruggu heimili.', 'A child who cannot live with their family has the right to special protection and a safe home.') },
      { article: t('2. gr.', 'Art. 2'), text: t('Öll börn njóta réttinda sáttmálans, án mismununar.', 'All children enjoy the rights of the Convention, without discrimination.') },
      { article: t('31. gr.', 'Art. 31'), text: t('Barn á rétt á hvíld, leik og því að fá að vera barn.', 'A child has the right to rest, play and simply to be a child.') },
    ],
  },
  laws: {
    eyebrow: t('Lögin', 'The law'),
    title: t('Þrjár stoðir í lögum', 'Three pillars in law'),
    items: [
      {
        name: t('Barnaverndarlög nr. 80/2002', 'Child Protection Act no. 80/2002'),
        body: t('Grunnlöggjöf barnaverndar. Byggð á því að börn fái vernd og að vægustu úrræðin séu alltaf reynd fyrst.', 'The core child protection legislation. Built on protecting children and always trying the mildest measures first.'),
      },
      {
        name: t('Lög um farsæld barna nr. 86/2021', 'Prosperity Act no. 86/2021'),
        body: t('Tryggja börnum og foreldrum samþætta þjónustu við hæfi, með tengilið og málstjóra sér við hlið.', 'Secure joined-up, appropriate services for children and parents, with a contact person and case manager alongside them.'),
      },
      {
        name: t('Lög um Barna- og fjölskyldustofu nr. 87/2021', 'Act no. 87/2021 on the National Agency for Children and Families'),
        body: t('Setja stofnuninni það hlutverk að veita og styðja þjónustu í þágu barna og stuðla að gæðum hennar um allt land.', 'Give the agency the task of providing and supporting services for children and promoting the quality of those services nationwide.'),
      },
    ],
  },
}

/* ── About the agency (um-stofnunina page) ────────────────────────────── */

export const LEADERSHIP: { name: string; title: L }[] = [
  { name: 'Ólöf Ásta Farestveit', title: t('Forstjóri Barna- og fjölskyldustofu', 'Director General of Barna- og fjölskyldustofa') },
]

export const ABOUT = {
  title: t('Um stofnunina', 'About the agency'),
  hero: {
    kicker: t('Stofnunin', 'The agency'),
    title: t('Ríkisstofnun með eitt hlutverk: farsæld barna', 'A state agency with one purpose: children’s wellbeing'),
  },
  factband: [
    { label: t('Stofnuð', 'Established'), value: t('2022', '2022') },
    { label: t('Lög', 'Law'), value: t('Nr. 87/2021', 'No. 87/2021') },
    { label: t('Ráðuneyti', 'Ministry'), value: t('Mennta- og barnamálaráðuneytið', 'Ministry of Education and Children') },
  ],
  role: {
    eyebrow: t('Hlutverk', 'Role'),
    title: t('Hvað gerir Barna- og fjölskyldustofa?', 'What does Barna- og fjölskyldustofa do?'),
    paras: [
      t(
        'Barna- og fjölskyldustofa veitir fræðslu, ráðgjöf og handleiðslu á sviði barnaverndar og samþættingar þjónustu í þágu farsældar barna.',
        'Barna- og fjölskyldustofa provides education, advice and supervision in child protection and in integrating services for children’s prosperity.',
      ),
      t(
        'Hún rekur Barnahús og sérhæfð meðferðarúrræði, metur og þjálfar fósturforeldra og þróar gagnreyndar aðferðir í þjónustu við börn.',
        'It runs Barnahús and specialised treatment services, assesses and trains foster parents, and develops evidence-based methods in services for children.',
      ),
      t(
        'Stofan er þjónustustofnun við barnaverndarþjónustur sveitarfélaga og vinnur að samhæfingu og eflingu barnaverndarstarfs um allt land.',
        'The agency serves the municipal child protection services and works to coordinate and strengthen child protection work across the country.',
      ),
    ],
  },
  org: {
    eyebrow: t('Skipulag', 'Organisation'),
    title: t('Ein stofnun, mörg svið', 'One agency, many divisions'),
    lead: t(
      'Í árslok 2024 störfuðu 169 manns hjá stofnuninni á sjö starfsstöðvum um allt land, þar af tveimur á landsbyggðinni.',
      'At the end of 2024, 169 people worked at the agency across seven sites nationwide, two of them outside the capital area.',
    ),
    groups: [
      { title: t('Farsældarsvið og gæðasvið', 'Prosperity and quality divisions'), body: t('Fræðsla, ráðgjöf, gæðaþróun og stuðningur við barnaverndarþjónustur.', 'Education, advice, quality development and support for child protection services.') },
      { title: t('Meðferðarsvið', 'Treatment division'), body: t('Stuðlar, Blönduhlíð, Bjargey, Lækjarbakki og MST-fjölkerfameðferð.', 'Stuðlar, Blönduhlíð, Bjargey, Lækjarbakki and MST therapy.') },
      { title: t('Barnahús og fósturteymi', 'Barnahús and the foster team'), body: t('Stuðningur eftir ofbeldi og umsjón með fóstri um allt land.', 'Support after abuse and oversight of foster care nationwide.') },
    ],
  },
  leadership: {
    eyebrow: t('Forysta', 'Leadership'),
    title: t('Forysta stofnunarinnar', 'Who leads the agency'),
  },
  oversight: {
    eyebrow: t('Eftirlit', 'Oversight'),
    title: t('Hver hefur eftirlit með úrræðunum?', 'Who oversees the services?'),
    body: t(
      'Gæða- og eftirlitsstofnun velferðarmála hefur eftirlit með gæðum þjónustu sem veitt er á grundvelli barnaverndarlaga, þar á meðal úrræðum sem Barna- og fjölskyldustofa rekur. Notendur geta beint kvörtun um gæði þjónustunnar þangað.',
      'The Quality and Supervisory Authority of Welfare oversees the quality of services provided under child protection law, including those the agency runs. Service users can direct complaints about quality there.',
    ),
    contact: t('Suðurlandsbraut 24, 108 Reykjavík · 540 0040 · gev@gev.is', 'Suðurlandsbraut 24, 108 Reykjavík · 540 0040 · gev@gev.is'),
  },
  contact: {
    eyebrow: t('Hafa samband', 'Contact'),
    title: t('Talaðu við okkur', 'Talk to us'),
  },
}

/* ── About teaser (landing) ───────────────────────────────────────────── */

export const ABOUT_TEASER = {
  eyebrow: t('Stofnunin', 'The agency'),
  title: t('Hver heldur utan um öll úrræðin?', 'Who holds all of this together?'),
  body: t(
    'Barna- og fjölskyldustofa er ríkisstofnun undir mennta- og barnamálaráðuneytinu. Hún tók til starfa árið 2022 og vinnur að farsæld barna um allt land.',
    'Barna- og fjölskyldustofa is a state agency under the Ministry of Education and Children. It began in 2022 and works for the wellbeing of children across the country.',
  ),
  cta: t('Um stofnunina', 'About the agency'),
  timelineCta: t('Sjá alla söguna', 'See the whole story'),
}

/* ── Emergency + contact ──────────────────────────────────────────────── */

export const HELP = {
  title: t('Þarftu að tala við einhvern núna?', 'Need to talk to someone now?'),
  lead: t(
    'Þú þarft ekki að bíða eftir réttu orðunum. Hér er hægt að ná strax í hjálp.',
    'You do not have to wait for the right words. Here is how to reach help right now.',
  ),
  lines: [
    {
      label: t('Neyðarlínan', 'Emergency line'),
      value: '112',
      blurb: t('Bráð neyð, allan sólarhringinn', 'Acute emergencies, around the clock'),
    },
    {
      label: t('Hjálparsími Rauða krossins', 'Red Cross helpline'),
      value: '1717',
      blurb: t('Sími og netspjall, nafnlaust og ókeypis', 'Phone and web chat, anonymous and free'),
    },
    {
      label: t('Barnahús', 'Barnahús'),
      value: '530 2500',
      blurb: t('Stuðningur eftir ofbeldi', 'Support after abuse'),
    },
    {
      label: t('Barna- og fjölskyldustofa', 'National Agency for Children and Families'),
      value: '530 2600',
      blurb: t('Almenn þjónusta, virka daga', 'General service, weekdays'),
    },
  ],
}

/* ── Related institutions ─────────────────────────────────────────────── */

export const INSTITUTIONS: { eyebrow: L; title: L; items: { name: string; role: L; href: string | null }[] } = {
  eyebrow: t('Samstarf og eftirlit', 'Partners and oversight'),
  title: t('Tengdar stofnanir', 'Related institutions'),
  items: [
    {
      name: 'Barnaverndarþjónustur sveitarfélaga',
      role: t('Taka við tilkynningum og aðstoða börn og fjölskyldur', 'Receive reports and assist children and families'),
      href: 'https://island.is/s/bofs/barnavernd-eftir-sveitarfeloegum',
    },
    {
      name: 'Mennta- og barnamálaráðuneytið',
      role: t('Ráðuneytið sem Barna- og fjölskyldustofa heyrir undir', 'The ministry the agency answers to'),
      href: 'https://www.stjornarradid.is/raduneyti/mennta-og-barnamalaraduneytid/',
    },
    {
      name: 'Umboðsmaður barna',
      role: t('Stendur vörð um réttindi og hagsmuni barna', 'Safeguards the rights and interests of children'),
      href: 'https://www.barn.is/',
    },
    {
      name: 'Gæða- og eftirlitsstofnun velferðarmála',
      role: t('Hefur eftirlit með gæðum þjónustu við börn', 'Oversees the quality of services for children'),
      href: 'https://island.is/s/gev',
    },
    {
      name: 'Neyðarlínan 112',
      role: t('Neyðarnúmer allan sólarhringinn, líka fyrir börn í hættu', 'The emergency number, around the clock, also for children at risk'),
      href: 'https://www.112.is/',
    },
    {
      name: 'Hjálparsími Rauða krossins 1717',
      role: t('Nafnlaus og ókeypis sími og netspjall', 'Anonymous and free phone and web chat'),
      href: 'https://www.raudikrossinn.is/',
    },
  ],
}

/* ── Closing CTA ──────────────────────────────────────────────────────── */

export const CLOSING = {
  hand: t('Byrjaðu þar sem þú ert', 'Start where you are'),
  title: t('Hvert barn á skilið öruggt skjól', 'Every child deserves a safe place'),
  lead: t(
    'Hvort sem þú hefur áhyggjur af barni, vinnur með börnum eða vilt rétta hjálparhönd, þá er leið inn.',
    'Whether you are worried about a child, work with children or want to lend a hand, there is a way in.',
  ),
  ctaPrimary: t('Hvernig barn fær aðstoð', 'How a child gets help'),
  ctaSecondary: t('Skoða öll úrræði', 'See all services'),
}

/* ── UI strings ───────────────────────────────────────────────────────── */

export const UI = {
  skipToContent: t('Fara í meginmál', 'Skip to content'),
  nav: {
    home: t('Forsíða', 'Home'),
    homes: t('Meðferðarheimili', 'Treatment homes'),
    services: t('Úrræðin', 'Services'),
    system: t('Kerfið', 'The system'),
    about: t('Um stofnunina', 'About'),
    report: t('Tilkynna áhyggjur', 'Report a concern'),
    path: t('Ferlið', 'The process'),
    help: t('Fá hjálp', 'Get help'),
  },
  allServices: t('Öll úrræðin', 'All services'),
  exploreCentre: t('Skoða nánar', 'Learn more'),
  backToAll: t('Til baka í öll úrræði', 'Back to all services'),
  whoFor: t('Fyrir hvern', 'Who it’s for'),
  whatHappens: t('Hvað gerist', 'What happens'),
  howToReach: t('Hvernig barn kemst að', 'How a child gets a place'),
  keyFacts: t('Staðreyndir', 'Key facts'),
  nextCentre: t('Næsta úrræði', 'Next service'),
  wherePath: t('Hvar í ferlinu?', 'Where in the process?'),
  readSystem: t('Lesa um kerfið alla leið', 'Read about the whole system'),
  emergencyChip: t('Neyð? Hringdu í 112', 'Emergency? Call 112'),
  langLabel: t('Íslenska', 'English'),
  onThisPage: t('Á þessari síðu', 'On this page'),
  conceptBadge: t(
    'Hugmyndavefur. Óformleg endurhönnun, ekki opinber vefur Barna- og fjölskyldustofu.',
    'Concept site. An unofficial redesign, not the official website of Barna- og fjölskyldustofa.',
  ),
  footerTagline: t(
    'Öll úrræði fyrir börn og fjölskyldur á einum hlýjum stað.',
    'Every service for children and families in one warm place.',
  ),
  footerContact: t('Hafa samband', 'Contact'),
  footerServices: t('Úrræði', 'Services'),
  footerSite: t('Vefurinn', 'This site'),
  rights: t('Hugmynd og hönnun', 'Concept & design'),
}
