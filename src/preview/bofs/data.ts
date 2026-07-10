/**
 * Barna- og fjölskyldustofa, "Öruggt skjól" concept.
 *
 * A warm, unofficial redesign concept that gathers every service under
 * Barna- og fjölskyldustofa (BOFS) into one friendly, honest hub.
 *
 * Facts verified July 2026 against island.is/s/bofs and stjornarradid.is:
 * Fannafold no longer operates (its support-home role moved to the support
 * home at Blönduhlíð). Lækjarbakki reopened in Gunnarsholt: first resident
 * March 2026, formal opening 8 May 2026, six places.
 *
 * Copy rules: professional and warm, no em or en dashes anywhere,
 * every user-facing string carries { is, en }.
 */

export type Lang = 'is' | 'en'
export type L = Record<Lang, string>

const t = (is: string, en: string): L => ({ is, en })

/* ── The organisation ─────────────────────────────────────────────────── */

export const ORG = {
  name: 'Barna- og fjölskyldustofa',
  short: 'BOFS',
  concept: t('Öruggt skjól', 'A safe place'),
  established: 2022,
  address: 'Borgartún 21, 105 Reykjavík',
  phone: '530 2600',
  email: 'bofs@bofs.is',
  ministry: t('mennta- og barnamálaráðuneyti', 'Ministry of Education and Children'),
  law: t('lög nr. 87/2021', 'Act no. 87/2021'),
  about: t(
    'Barna- og fjölskyldustofa er ríkisstofnun sem vinnur að farsæld barna um allt land. Hún tók til starfa 1. janúar 2022 og leysti Barnaverndarstofu af hólmi. Stofan rekur og hefur eftirlit með meðferðarheimilum, Barnahúsi, fjölskyldumeðferð og fóstri, og styður barnaverndarþjónustu sveitarfélaga með ráðgjöf, þjálfun og þekkingu.',
    'Barna- og fjölskyldustofa (the Directorate of Children and Family Affairs) is a state agency working for the wellbeing of children across Iceland. It began operating on 1 January 2022, succeeding the former Child Protection Agency. It runs and oversees the treatment homes, Barnahús, family therapy and foster care, and supports municipal child protection services with guidance, training and knowledge.',
  ),
}

/* ── Concept promise ──────────────────────────────────────────────────── */

export const HERO = {
  kicker: t('Barna- og fjölskyldustofa', 'Children & Family Affairs'),
  title: t('Öruggt skjól fyrir hvert barn', 'A safe place for every child'),
  lead: t(
    'Þegar á reynir eiga börn og fjölskyldur rétt á hlýju, öryggi og skýrum svörum. Hér eru öll úrræði Barna- og fjölskyldustofu á einum stað, útskýrð á mannamáli.',
    'When times are hard, children and families deserve warmth, safety and clear answers. Here is every service of Barna- og fjölskyldustofa in one place, explained in plain language.',
  ),
  ctaPrimary: t('Finna réttan stuðning', 'Find the right support'),
  ctaSecondary: t('Hvernig barn fær aðstoð', 'How a child gets help'),
  reassure: t('Í bráðri neyð skaltu strax hringja í 112', 'In an emergency, call 112 right away'),
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
      'Barn þrífst best nálægt sínu fólki. Þess vegna vinnum við alltaf með fjölskyldunni, ekki fram hjá henni.',
      'A child thrives closest to their own people. So we always work with the family, never around it.',
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

/* ── The referral path ────────────────────────────────────────────────── */

export const PATH = {
  title: t('Hvernig barn fær aðstoð', 'How a child gets help'),
  lead: t(
    'Leiðin að úrræðunum liggur í gegnum barnavernd í þínu sveitarfélagi. Þjónustan kostar ekkert og fyrsta skrefið má alltaf taka.',
    'The path to our services runs through child protection in your municipality. The service is free of charge, and the first step can always be taken.',
  ),
  steps: [
    {
      n: 1,
      title: t('Þú hefur samband', 'You reach out'),
      body: t(
        'Foreldri, ungmenni, skóli eða heilsugæsla hefur samband við barnavernd í sveitarfélaginu. Áhyggjur duga. Þú þarft ekki að hafa öll svörin.',
        'A parent, young person, school or health clinic contacts child protection in the municipality. Concern is enough. You do not need all the answers.',
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
      'Safe homes where children and young people aged 12 to 18 receive round the clock care, warmth and individual treatment.',
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
      'The state emergency care unit for adolescents, the first safe stop when an acute situation arises.',
    ),
    who: t(
      'Ungmenni á aldrinum 12 til 18 ára sem þurfa tafarlaust öruggt skjól og mat á aðstæðum sínum.',
      'Young people aged 12 to 18 who need immediate safety and an assessment of their situation.',
    ),
    what: t(
      'Stuðlar hafa starfað frá árinu 1996 og eru fyrsti viðkomustaðurinn í bráðum aðstæðum. Tekið er á móti ungmenninu í rólegu og öruggu umhverfi, hlúð að því allan sólarhringinn og staða þess metin af fagfólki svo hægt sé að finna næsta rétta skref í rólegheitum. Neyðarvistun varir að hámarki í fjórtán daga.',
      'Stuðlar has operated since 1996 and is the first stop in acute situations. The young person is received in a calm, secure environment, cared for around the clock, and their situation assessed by professionals so the next right step can be found without haste. An emergency stay lasts a maximum of fourteen days.',
    ),
    how: t(
      'Barnavernd, eða lögregla í samráði við barnavernd, ráðstafar ungmenni í neyðarvistun.',
      'Child protection, or police in consultation with child protection, places a young person in emergency care.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Ungmenni 12 til 18 ára', 'Young people 12 to 18') },
      { label: t('Dvöl', 'Stay'), value: t('Allt að 14 dagar', 'Up to 14 days') },
      { label: t('Staðsetning', 'Location'), value: t('Fossaleyni, Grafarvogi', 'Fossaleyni, Grafarvogur') },
      { label: t('Starfrækt frá', 'Operating since'), value: t('1996', '1996') },
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
      'Í Blönduhlíð fer fram grunnmeðferð sem tekur að jafnaði 8 til 12 vikur. Unnið er að því að skilja styrkleika, áskoranir og þarfir barnsins og fjölskyldunnar og út frá því verður til skýr áætlun um næstu skref. Við heimilið er einnig starfrækt stuðningsheimili fyrir börn sem geta ekki búið hjá forsjáraðilum sínum að lokinni meðferð. Þar heldur stuðningurinn áfram í öruggum og heimilislegum ramma.',
      'Blönduhlíð provides primary treatment that usually lasts 8 to 12 weeks. The work is to understand the strengths, challenges and needs of the child and family, and from that a clear plan for the next steps takes shape. The home also runs a support home for children who cannot live with their guardians once treatment ends. There, support continues within a safe, home-like framework.',
    ),
    how: t(
      'Barnavernd sækir um grunnmeðferð eða stuðningsheimili hjá Barna- og fjölskyldustofu.',
      'Child protection applies for primary treatment or the support home through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Börn 12 til 18 ára', 'Children 12 to 18') },
      { label: t('Grunnmeðferð', 'Primary treatment'), value: t('Að jafnaði 8 til 12 vikur', 'Usually 8 to 12 weeks') },
      { label: t('Einnig', 'Also'), value: t('Stuðningsheimili eftir meðferð', 'Support home after treatment') },
      { label: t('Áhersla', 'Focus'), value: t('Greining, áætlun og eftirfylgd', 'Assessment, planning, follow up') },
    ],
    note: t(
      'Enginn er skilgreindur út frá versta deginum sínum. Hér byrjum við á að sjá barnið í heild og byggja á því sem er heilt.',
      'No one is defined by their worst day. Here we start by seeing the whole child and building on what is already whole.',
    ),
  },
  {
    slug: 'bjargey',
    name: 'Bjargey',
    category: 'heimili',
    kind: t('Framhaldsmeðferð fyrir stúlkur', 'Continued treatment for girls'),
    hue: '#D98895',
    hueSoft: '#F6DEE2',
    art: 'bjargey',
    tagline: t('Rými til að vaxa', 'Room to grow'),
    card: t(
      'Framhaldsmeðferð fyrir stúlkur þar sem breytingar fá tíma til að festa rætur.',
      'Continued treatment for girls, where change is given time to take root.',
    ),
    who: t(
      'Stúlkur sem hafa lokið grunnmeðferð og þurfa lengri tíma og stuðning til að byggja upp nýjar venjur.',
      'Girls who have completed primary treatment and need more time and support to build new routines.',
    ),
    what: t(
      'Í Bjargey er unnið áfram með það sem hófst í grunnmeðferð, í rólegu og heimilislegu umhverfi þar sem traust fær að myndast. Áhersla er á daglegar venjur, skóla, tengsl og trú á eigin getu. Dvölin getur varað í allt að sex mánuði.',
      'At Bjargey, the work started in primary treatment continues in a calm, home-like setting where trust can form. The focus is on daily routines, school, relationships and self belief. A stay can last up to six months.',
    ),
    how: t(
      'Barnavernd sækir um framhaldsmeðferð hjá Barna- og fjölskyldustofu.',
      'Child protection applies for continued treatment through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Stúlkur, í framhaldi af grunnmeðferð', 'Girls, following primary treatment') },
      { label: t('Tegund', 'Type'), value: t('Framhaldsmeðferð', 'Continued treatment') },
      { label: t('Lengd', 'Length'), value: t('Allt að 6 mánuðir', 'Up to 6 months') },
      { label: t('Áhersla', 'Focus'), value: t('Venjur, skóli, tengsl', 'Routines, school, relationships') },
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
    kind: t('Framhaldsmeðferð fyrir drengi', 'Continued treatment for boys'),
    hue: '#5E97B8',
    hueSoft: '#D6E6EE',
    art: 'laekjarbakki',
    tagline: t('Sveitakyrrð og traustur grunnur', 'Country calm and steady ground'),
    card: t(
      'Framhaldsmeðferð fyrir drengi í Gunnarsholti á Rangárvöllum. Heimilið opnaði í endurnýjuðu húsnæði vorið 2026.',
      'Continued treatment for boys at Gunnarsholt in Rangárvellir. The home opened in renovated premises in spring 2026.',
    ),
    who: t(
      'Drengir sem hafa lokið grunnmeðferð og þurfa lengri tíma, rútínu og fjarlægð frá álagi til að ná fótfestu, meðal annars vegna hegðunar- og vímuefnavanda.',
      'Boys who have completed primary treatment and need more time, routine and distance from pressure to find their footing, including behavioural and substance use difficulties.',
    ),
    what: t(
      'Lækjarbakki tók til starfa í Gunnarsholti á Rangárvöllum í mars 2026 og var formlega opnaður 8. maí sama ár. Heimilið rúmar allt að sex ungmenni í senn. Húsnæðið var endurnýjað með áherslu á öryggi, hlýlegt umhverfi og heimilislegt yfirbragð, og sveitin sjálf gefur ró, rútínu og útiveru sem styður meðferðina. Meðferðin er einstaklingsmiðuð og byggð á gagnreyndum aðferðum.',
      'Lækjarbakki began operating at Gunnarsholt in Rangárvellir in March 2026 and was formally opened on 8 May that year. The home takes up to six young people at a time. The premises were renovated with an emphasis on safety, a warm environment and a home-like character, and the countryside itself offers calm, routine and outdoor life that supports the treatment. Treatment is individual and grounded in evidence based methods.',
    ),
    how: t(
      'Barnavernd sækir um framhaldsmeðferð hjá Barna- og fjölskyldustofu.',
      'Child protection applies for continued treatment through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Drengi, í framhaldi af grunnmeðferð', 'Boys, following primary treatment') },
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
      'Barnvænt hús fyrir börn sem hafa mögulega orðið fyrir ofbeldi. Viðtal, greining og meðferð á einum stað.',
      'A child friendly house for children who may have experienced abuse. Interview, assessment and treatment in one place.',
    ),
    who: t(
      'Börn sem grunur leikur á að hafi sætt kynferðisofbeldi eða líkamlegu ofbeldi, eða orðið vitni að heimilisofbeldi.',
      'Children suspected of having experienced sexual or physical abuse, or of having witnessed domestic violence.',
    ),
    what: t(
      'Í Barnahúsi fer allt fram undir einu þaki, í hlýlegu og barnvænu umhverfi, svo barn þurfi ekki að endurtaka erfiða sögu sína aftur og aftur á mörgum stöðum. Þar fara fram viðtöl, læknisskoðun, greining og meðferð, og fjölskyldan fær einnig stuðning. Þjónustan er að kostnaðarlausu.',
      'In Barnahús everything happens under one roof, in a warm and child friendly setting, so a child does not have to repeat a difficult story again and again in many places. Interviews, medical examination, assessment and treatment all take place there, and the family receives support as well. The service is free of charge.',
    ),
    how: t(
      'Barnaverndarþjónusta óskar eftir þjónustu Barnahúss. Barn og foreldrar fá alla þjónustu á einum stað, að kostnaðarlausu.',
      'Child protection requests the services of Barnahús. The child and parents receive all services in one place, free of charge.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Börn sem kunna að hafa orðið fyrir ofbeldi', 'Children who may have experienced abuse') },
      { label: t('Undir einu þaki', 'Under one roof'), value: t('Viðtal, skoðun, greining, meðferð', 'Interview, exam, assessment, treatment') },
      { label: t('Kostnaður', 'Cost'), value: t('Að kostnaðarlausu', 'Free of charge') },
      { label: t('Sími', 'Phone'), value: t('530 2500', '530 2500') },
    ],
    note: t(
      'Ekkert barn ber ábyrgð á því sem kom fyrir það. Í Barnahúsi er hlustað á barnið og því fylgt áfram, skref fyrir skref.',
      'No child is responsible for what happened to them. In Barnahús the child is heard and walked forward, step by step.',
    ),
  },
  {
    slug: 'mst',
    name: 'MST fjölkerfameðferð',
    category: 'thjonusta',
    kind: t('Meðferð heima hjá fjölskyldunni', 'Treatment in the family home'),
    hue: '#5FA093',
    hueSoft: '#D5EAE3',
    art: 'mst',
    tagline: t('Stuðningur sem kemur heim til ykkar', 'Support that comes to your home'),
    card: t(
      'Fjölskyldumeðferð heima þar sem barnið býr áfram hjá sínu fólki og foreldrar fá öflug verkfæri.',
      'Family therapy at home, where the child keeps living with their people and parents gain strong tools.',
    ),
    who: t(
      'Fjölskyldur barna á aldrinum 12 til 18 ára sem glíma við fjölþættan vanda, svo sem afskipti lögreglu, erfiðleika í skóla, ofbeldi eða vímuefnanotkun.',
      'Families of children aged 12 to 18 facing complex challenges, such as police involvement, school difficulties, violence or substance use.',
    ),
    what: t(
      'MST fjölkerfameðferð fer fram þar sem lífið gerist, heima, í skólanum og í nærumhverfi barnsins. Sérþjálfaður meðferðaraðili kemur heim, að jafnaði vikulega, og er í símasambandi allan sólarhringinn. Áherslan er á að efla foreldra svo þeir hafi verkfærin til að styðja barnið sitt. Meðferðin tekur að jafnaði 3 til 5 mánuði og barnið býr heima allan tímann.',
      'MST multisystemic therapy takes place where life happens: at home, in school and in the child’s surroundings. A specially trained therapist visits the home, usually weekly, and is reachable by phone around the clock. The focus is on strengthening parents so they hold the tools to support their child. Treatment usually lasts 3 to 5 months and the child lives at home the whole time.',
    ),
    how: t(
      'Barnavernd um allt land getur vísað fjölskyldum í MST hjá Barna- og fjölskyldustofu.',
      'Child protection anywhere in Iceland can refer families to MST through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Fjölskyldur barna 12 til 18 ára', 'Families of children 12 to 18') },
      { label: t('Hvar', 'Where'), value: t('Heima hjá fjölskyldunni', 'In the family home') },
      { label: t('Lengd', 'Length'), value: t('Að jafnaði 3 til 5 mánuðir', 'Usually 3 to 5 months') },
      { label: t('Stuðningur', 'Support'), value: t('Vikulegar heimsóknir og sími allan sólarhringinn', 'Weekly visits and phone around the clock') },
    ],
    note: t(
      'Barn þarf ekki alltaf að fara að heiman til að fá hjálp. Stundum er sterkasta úrræðið að styrkja heimilið sjálft.',
      'A child does not always have to leave home to get help. Sometimes the strongest intervention is to strengthen the home itself.',
    ),
  },
  {
    slug: 'sok',
    name: 'SÓK meðferð',
    category: 'thjonusta',
    kind: t('Sálfræðiþjónusta fyrir börn', 'Psychological service for children'),
    hue: '#9A86B8',
    hueSoft: '#E3DCEF',
    art: 'sok',
    tagline: t('Skilningur, ekki skömm', 'Understanding, not shame'),
    card: t(
      'Sálfræðimeðferð fyrir börn vegna óviðeigandi eða skaðlegrar kynhegðunar, veitt af stuðningi og virðingu.',
      'Psychological treatment for children showing inappropriate or harmful sexual behaviour, delivered with support and respect.',
    ),
    who: t(
      'Börn sem þurfa aðstoð vegna óviðeigandi eða skaðlegrar kynhegðunar, og fjölskyldur þeirra.',
      'Children who need help with inappropriate or harmful sexual behaviour, and their families.',
    ),
    what: t(
      'SÓK meðferð er sálfræðiþjónusta sem styður barnið, dregur úr neikvæðum afleiðingum hegðunarinnar og minnkar líkur á að hún endurtaki sig. Unnið er af fagmennsku og hlýju, með skilningi frekar en skömm, svo barnið geti haldið áfram á heilbrigðari braut.',
      'SÓK is a psychological service that supports the child, reduces the negative consequences of the behaviour and lowers the likelihood of it repeating. The work is professional and warm, met with understanding rather than shame, so the child can move forward on a healthier path.',
    ),
    how: t(
      'Barnavernd vísar barni í SÓK meðferð hjá Barna- og fjölskyldustofu.',
      'Child protection refers a child to SÓK through Barna- og fjölskyldustofa.',
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
      'Fóstur er þegar barnaverndarþjónusta felur fósturforeldrum umsjá barns. Það getur verið tímabundið, varanlegt eða styrkt fóstur með sérstökum stuðningi þegar barn glímir við verulegan vanda. Fósturforeldrar fara í gegnum hæfnismat og námskeið, og Barna- og fjölskyldustofa styður þá alla leið með ráðgjöf, samningum og eftirfylgd.',
      'Foster care is when child protection places a child in the care of foster parents. It can be temporary, permanent, or supported foster care with extra help when a child faces serious difficulties. Foster parents go through an assessment and training, and Barna- og fjölskyldustofa supports them the whole way with guidance, agreements and follow up.',
    ),
    how: t(
      'Barnaverndarþjónusta ráðstafar barni í fóstur. Þau sem vilja gerast fósturforeldrar byrja á hæfnismati og námskeiði hjá Barna- og fjölskyldustofu.',
      'Child protection places a child in foster care. Those who wish to become foster parents begin with an assessment and training at Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Tegundir', 'Types'), value: t('Tímabundið, varanlegt, styrkt fóstur', 'Temporary, permanent, supported') },
      { label: t('Fyrir', 'For'), value: t('Börn sem þurfa annað heimili', 'Children who need another home') },
      { label: t('Fósturforeldrar', 'Foster parents'), value: t('Hæfnismat og námskeið', 'Assessment and training') },
      { label: t('Stuðningur', 'Support'), value: t('Ráðgjöf og eftirfylgd frá BOFS', 'Guidance and follow up from BOFS') },
    ],
    note: t(
      'Sérhvert barn á rétt á heimili þar sem því er haldið utan um. Fósturfjölskyldur gefa það og fá stuðning til þess.',
      'Every child deserves a home where they are held. Foster families give that, and are supported to do so.',
    ),
  },
]

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug)

/* ── Photography (local, warm environments, no identifiable children) ─── */

export const CENTRE_PHOTO: Record<string, { src: string; alt: L }> = {
  studlar: { src: 'interior-calm.jpg', alt: t('Hlýleg og notaleg setustofa í dagsbirtu', 'A warm, homely living room in daylight') },
  blonduhlid: { src: 'interior-evening.jpg', alt: t('Notaleg stofa böðuð kvöldbirtu', 'A cosy room bathed in evening light') },
  bjargey: { src: 'interior-nook.jpg', alt: t('Leshorn við glugga með útsýni', 'A reading nook by a window with a view') },
  laekjarbakki: {
    src: 'land-cliffs.jpg',
    alt: t('Sveitabær undir grænum hlíðum á Suðurlandi, táknræn mynd', 'A farm beneath green slopes in South Iceland, representative image'),
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
  eyebrow: t('Andrými hlýju', 'A feeling of warmth'),
  title: t('Staðir sem eiga að líða eins og heimili', 'Places meant to feel like home'),
  lead: t(
    'Hlý rými, græn náttúra og opnar dyr. Umhverfið skiptir máli þegar barni á að líða vel.',
    'Warm rooms, green nature and open doors. Surroundings matter when a child needs to feel safe.',
  ),
  photos: [
    { src: 'land-homes.jpg', alt: t('Litrík hús í blómguðu túni undir fjöllum', 'Colourful houses in a flowering meadow below mountains') },
    { src: 'interior-bright.jpg', alt: t('Björt og hlýleg stofa', 'A bright, warm room') },
    { src: 'land-river.jpg', alt: t('Á sem liðast um græna dali', 'A river winding through green valleys') },
    { src: 'interior-nook.jpg', alt: t('Hlýlegt leshorn við glugga', 'A cosy reading nook by a window') },
  ] as { src: string; alt: L }[],
}

/* ── Honest-hope section ──────────────────────────────────────────────── */

export const HONEST = {
  kicker: t('Hreinskilni', 'Honesty'),
  title: t('Við lofum ekki fullkomnun. Við lofum að hlusta og gera betur', 'We do not promise perfection. We promise to listen and do better'),
  body: t(
    'Kerfi sem heldur utan um viðkvæmustu börnin okkar má aldrei standa í stað. Við tökum gagnrýni alvarlega, lærum af því sem miður fer og vinnum á hverjum degi að því að gera betur, með öryggi og líðan barnanna í forgrunni.',
    'A system that holds our most vulnerable children can never stand still. We take criticism seriously, learn from what goes wrong, and work every day to do better, with the safety and wellbeing of children first.',
  ),
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
      label: t('Barna- og fjölskyldustofa', 'Children & Family Affairs'),
      value: '530 2600',
      blurb: t('Almenn þjónusta, virka daga', 'General service, weekdays'),
    },
  ],
}

/* ── UI strings ───────────────────────────────────────────────────────── */

export const UI = {
  skipToContent: t('Fara í meginmál', 'Skip to content'),
  nav: {
    home: t('Forsíða', 'Home'),
    homes: t('Meðferðarheimili', 'Treatment homes'),
    services: t('Þjónusta', 'Services'),
    path: t('Hvernig það virkar', 'How it works'),
    help: t('Fá hjálp', 'Get help'),
  },
  allServices: t('Öll úrræðin', 'All services'),
  exploreCentre: t('Skoða nánar', 'Learn more'),
  backToAll: t('Til baka í öll úrræði', 'Back to all services'),
  whoFor: t('Fyrir hvern', 'Who it’s for'),
  whatHappens: t('Hvað gerist', 'What happens'),
  howToReach: t('Hvernig barn kemst að', 'How a child reaches it'),
  keyFacts: t('Staðreyndir', 'Key facts'),
  nextCentre: t('Næsta úrræði', 'Next service'),
  emergencyChip: t('Neyð? Hringdu 112', 'Emergency? Call 112'),
  langLabel: t('Íslenska', 'English'),
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
  rights: t('Hugmynd og hönnun', 'Concept & design'),
}
