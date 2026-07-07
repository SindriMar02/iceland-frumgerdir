/**
 * Barna- og fjölskyldustofa — "Öruggt skjól" concept.
 *
 * A warm, unofficial redesign concept that gathers every service under
 * Barna- og fjölskyldustofa (BOFS) into one friendly, honest hub.
 *
 * Every fact below is drawn from BOFS's own pages on island.is/s/bofs
 * (verified July 2026). Copy is warm-but-honest: hopeful, human, and true —
 * nothing that erases how hard these situations are for a family.
 *
 * Bilingual: every user-facing string carries { is, en }.
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
    'Barna- og fjölskyldustofa er ríkisstofnun sem vinnur að farsæld barna um allt land. Hún tók til starfa 1. janúar 2022 og leysti Barnaverndarstofu af hólmi. Stofan rekur og hefur eftirlit með meðferðarheimilum, Barnahúsi, fjölskyldumeðferð og fóstri — og styður barnaverndarþjónustu sveitarfélaga með ráðgjöf, þjálfun og þekkingu.',
    'Barna- og fjölskyldustofa (the Directorate of Children and Family Affairs) is a state agency working for the wellbeing of children across Iceland. It began operating on 1 January 2022, succeeding the former Child Protection Agency. It runs and oversees the treatment homes, Barnahús, family therapy and foster care — and supports municipal child-protection services with guidance, training and knowledge.',
  ),
}

/* ── Concept promise ──────────────────────────────────────────────────── */

export const HERO = {
  kicker: t('Barna- og fjölskyldustofa', 'Children & Family Affairs'),
  title: t('Öruggt skjól fyrir hvert barn', 'A safe place for every child'),
  lead: t(
    'Þegar lífið verður þungt eiga börn og fjölskyldur rétt á hlýju, öryggi og von. Hér eru öll úrræðin okkar á einum stað — sagt á mannamáli, með opnum örmum.',
    'When life gets heavy, children and families deserve warmth, safety and hope. Here is every one of our services in one place — in plain language, with open arms.',
  ),
  ctaPrimary: t('Finna réttan stuðning', 'Find the right support'),
  ctaSecondary: t('Hvernig barn fær aðstoð', 'How a child gets help'),
  reassure: t('Í bráðri neyð, hringdu strax í 112', 'In an emergency, call 112 right away'),
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
      'Hard chapters end. The goal is always better days — at home, in school and with friends.',
    ),
  },
]

/* ── The referral path — how a child actually reaches help ────────────── */

export const PATH = {
  title: t('Hvernig barn fær aðstoð', 'How a child gets help'),
  lead: t(
    'Þú kemst að úrræðunum okkar í gegnum barnavernd í þínu sveitarfélagi. Það kostar ekkert og fyrsta skrefið má alltaf taka.',
    'You reach our services through child protection in your municipality. It costs nothing, and the first step can always be taken.',
  ),
  steps: [
    {
      n: 1,
      title: t('Þú hefur samband', 'You reach out'),
      body: t(
        'Foreldri, ungmenni, skóli eða heilsugæsla hefur samband við barnavernd í sveitarfélaginu. Áhyggjur eru nóg — þú þarft ekki að hafa öll svörin.',
        'A parent, young person, school or health clinic contacts child protection in the municipality. Worry is enough — you don’t need all the answers.',
      ),
    },
    {
      n: 2,
      title: t('Staðan er metin', 'The situation is assessed'),
      body: t(
        'Barnavernd kynnist stöðu barnsins og fjölskyldunnar og finnur, með ykkur, hvaða stuðningur á best við.',
        'Child protection gets to know the child and family’s situation and, together with you, finds the support that fits best.',
      ),
    },
    {
      n: 3,
      title: t('Rétta úrræðið tekur við', 'The right service steps in'),
      body: t(
        'Barnavernd sækir um úrræði hjá Barna- og fjölskyldustofu — heimastuðning, meðferð eða öruggt heimili — eftir því sem þarf.',
        'Child protection applies to Barna- og fjölskyldustofa for a service — support at home, treatment or a safe home — as needed.',
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
      'Örugg heimili þar sem ungmenni 12–18 ára fá umönnun allan sólarhringinn, hlýju og einstaklingsmiðaða meðferð.',
      'Safe homes where young people aged 12–18 receive round-the-clock care, warmth and individual treatment.',
    ),
  },
  {
    key: 'thjonusta',
    title: t('Fjölskyldu- og stuðningsþjónusta', 'Family & support services'),
    blurb: t(
      'Stuðningur sem kemur til fjölskyldunnar — heim, í Barnahús eða inn á nýtt heimili — með fagfólki sér við hlið.',
      'Support that comes to the family — at home, in Barnahús or into a new home — with professionals by their side.',
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
  /** short type label, e.g. "Neyðarvistun" */
  kind: L
  /** accent colour for the "home" + page */
  hue: string
  hueSoft: string
  /** illustration key */
  art: 'studlar' | 'blonduhlid' | 'bjargey' | 'laekjarbakki' | 'fannafold' | 'barnahus' | 'mst' | 'sok' | 'fostur'
  tagline: L
  card: L
  who: L
  what: L
  how: L
  facts: Fact[]
  /** a warm, honest closing line for the page */
  note: L
}

export const SERVICES: Service[] = [
  {
    slug: 'studlar',
    name: 'Stuðlar',
    category: 'heimili',
    kind: t('Neyðarvistun og bráðamóttaka', 'Emergency care & acute reception'),
    hue: '#D9744E',
    hueSoft: '#F6E0D3',
    art: 'studlar',
    tagline: t('Þegar þarf öruggan stað strax', 'When a safe place is needed right now'),
    card: t(
      'Meðferðarstöð ríkisins fyrir unglinga — fyrsti, öruggi viðkomustaðurinn í bráðum aðstæðum.',
      'The state treatment centre for adolescents — the first, safe stop in an acute situation.',
    ),
    who: t(
      'Ungmenni 12–18 ára sem þurfa öruggt skjól og mat á aðstæðum í bráðum eða óljósum aðstæðum.',
      'Young people aged 12–18 who need a safe place and an assessment of their situation in acute or unclear circumstances.',
    ),
    what: t(
      'Stuðlar hafa verið öruggur viðkomustaður frá árinu 1996. Hér er tekið á móti ungmenni í neyð, hlúð að því allan sólarhringinn og staða þess metin af fagfólki — svo hægt sé að finna næsta rétta skref í rólegheitum.',
      'Stuðlar has been a safe first stop since 1996. Here a young person in crisis is received, cared for around the clock, and their situation assessed by professionals — so the next right step can be found calmly.',
    ),
    how: t(
      'Barnavernd, eða lögregla í samráði við barnavernd, ráðstafar ungmenni í neyðarvistun.',
      'Child protection, or police in consultation with child protection, places a young person in emergency care.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Ungmenni 12–18 ára', 'Young people 12–18') },
      { label: t('Dvöl', 'Stay'), value: t('Neyðarvistun — allt að 14 dagar', 'Emergency stay — up to 14 days') },
      { label: t('Staðsetning', 'Location'), value: t('Fossaleyni, Grafarvogi, Reykjavík', 'Fossaleyni, Grafarvogur, Reykjavík') },
      { label: t('Starfrækt frá', 'Operating since'), value: t('1996', '1996') },
    ],
    note: t(
      'Stuðlar eru oft fyrsta skrefið — ekki það síðasta. Héðan liggur leiðin áfram í meðferð, heim eða á heimili sem hentar barninu betur.',
      'Stuðlar is often the first step — not the last. From here the path leads on to treatment, home, or a home better suited to the child.',
    ),
  },
  {
    slug: 'blonduhlid',
    name: 'Blönduhlíð',
    category: 'heimili',
    kind: t('Grunnmeðferð', 'Primary treatment'),
    hue: '#6E9E6E',
    hueSoft: '#DCEBD8',
    art: 'blonduhlid',
    tagline: t('Að kortleggja vandann — saman', 'Mapping the challenge — together'),
    card: t(
      'Grunnmeðferð þar sem staða barns og fjölskyldu er kortlögð og fyrstu skrefin tekin.',
      'Primary treatment where the child and family’s situation is mapped and the first steps are taken.',
    ),
    who: t(
      'Ungmenni 12–18 ára sem þurfa markvissa greiningu og upphaf meðferðar í öruggu, heimilislegu umhverfi.',
      'Young people aged 12–18 who need focused assessment and the start of treatment in a safe, home-like setting.',
    ),
    what: t(
      'Í Blönduhlíð er unnið að því að skilja hvað liggur að baki — styrkleikar, áskoranir og þarfir barnsins og fjölskyldunnar. Út frá því verður til skýr áætlun um næstu skref. Grunnmeðferð tekur að jafnaði 8–12 vikur.',
      'At Blönduhlíð the work is to understand what lies beneath — the strengths, challenges and needs of the child and family. From that, a clear plan for the next steps takes shape. Primary treatment usually lasts 8–12 weeks.',
    ),
    how: t(
      'Barnavernd sækir um grunnmeðferð hjá Barna- og fjölskyldustofu.',
      'Child protection applies for primary treatment through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Ungmenni 12–18 ára', 'Young people 12–18') },
      { label: t('Tegund', 'Type'), value: t('Grunnmeðferð', 'Primary treatment') },
      { label: t('Lengd', 'Length'), value: t('Að jafnaði 8–12 vikur', 'Usually 8–12 weeks') },
      { label: t('Áhersla', 'Focus'), value: t('Kortlagning og áætlun', 'Assessment and planning') },
    ],
    note: t(
      'Enginn er skilgreindur út frá versta deginum sínum. Hér byrjum við á að sjá barnið í heild — og byggja á því sem er heilt.',
      'No one is defined by their worst day. Here we start by seeing the whole child — and building on what is already whole.',
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
      'Í Bjargey er unnið áfram með það sem hófst í grunnmeðferð — í rólegu, heimilislegu umhverfi þar sem traust fær að myndast. Áhersla er á daglegar venjur, skóla, tengsl og trú á eigin getu. Dvölin getur varað í allt að sex mánuði.',
      'At Bjargey, the work started in primary treatment continues — in a calm, home-like setting where trust can form. The focus is on daily routines, school, relationships and self-belief. A stay can last up to six months.',
    ),
    how: t(
      'Barnavernd sækir um framhaldsmeðferð hjá Barna- og fjölskyldustofu.',
      'Child protection applies for continued treatment through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Stúlkur, framhald af grunnmeðferð', 'Girls, following primary treatment') },
      { label: t('Tegund', 'Type'), value: t('Framhaldsmeðferð', 'Continued treatment') },
      { label: t('Lengd', 'Length'), value: t('Allt að 6 mánuðir', 'Up to 6 months') },
      { label: t('Áhersla', 'Focus'), value: t('Venjur, skóli, tengsl', 'Routines, school, relationships') },
    ],
    note: t(
      'Breytingar sem endast gerast ekki á einni nóttu. Hér er tíminn bandamaður, ekki óvinur.',
      'Change that lasts doesn’t happen overnight. Here, time is an ally, not an enemy.',
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
      'Framhaldsmeðferð fyrir drengi í sveitasælu á Rangárvöllum. Opnar að nýju í janúar 2026.',
      'Continued treatment for boys in the countryside of Rangárvellir. Reopening January 2026.',
    ),
    who: t(
      'Drengir sem hafa lokið grunnmeðferð og þurfa lengri tíma, rútínu og fjarlægð frá álagi til að ná fótfestu.',
      'Boys who have completed primary treatment and need more time, routine and distance from pressure to find their footing.',
    ),
    what: t(
      'Lækjarbakki stendur á Rangárvöllum, þar sem sveitakyrrðin sjálf er hluti af meðferðinni. Í litlum hópi — allt að sex ungmenni í senn — fá drengir rútínu, útiveru og fagfólk sem stendur með þeim. Heimilið opnar að nýju í janúar 2026.',
      'Lækjarbakki sits in Rangárvellir, where the quiet of the countryside is itself part of the treatment. In a small group — up to six young people at a time — boys get routine, the outdoors and professionals who stand with them. The home reopens in January 2026.',
    ),
    how: t(
      'Barnavernd sækir um framhaldsmeðferð hjá Barna- og fjölskyldustofu.',
      'Child protection applies for continued treatment through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Drengir, framhald af grunnmeðferð', 'Boys, following primary treatment') },
      { label: t('Tegund', 'Type'), value: t('Framhaldsmeðferð', 'Continued treatment') },
      { label: t('Pláss', 'Places'), value: t('Allt að 6 ungmenni', 'Up to 6 young people') },
      { label: t('Staðsetning', 'Location'), value: t('Rangárvellir — opnar jan. 2026', 'Rangárvellir — reopens Jan 2026') },
    ],
    note: t(
      'Stundum þarf pláss, kyrrð og ný sjónarhorn til að finna sjálfan sig aftur.',
      'Sometimes it takes space, quiet and a new horizon to find yourself again.',
    ),
  },
  {
    slug: 'fannafold',
    name: 'Fannafold',
    category: 'heimili',
    kind: t('Stuðningsheimili', 'Support home'),
    hue: '#E0A94F',
    hueSoft: '#F7E7C6',
    art: 'fannafold',
    tagline: t('Mjúk lending eftir meðferð', 'A soft landing after treatment'),
    card: t(
      'Stuðningsheimili sem heldur utan um ungmenni þegar meðferð lýkur og lífið heldur áfram.',
      'A support home that holds a young person as treatment ends and life goes on.',
    ),
    who: t(
      'Ungmenni sem hafa lokið meðferð og þurfa áframhaldandi stuðning og öruggan ramma á meðan þau feta sig aftur inn í daglegt líf.',
      'Young people who have completed treatment and need continued support and a safe framework as they step back into everyday life.',
    ),
    what: t(
      'Fannafold er brúin milli meðferðar og daglegs lífs. Hér er haldið áfram að styðja við ungmennið — með rútínu, skóla eða vinnu og fólki sem fylgist með — svo framfarirnar sem náðust fái að halda.',
      'Fannafold is the bridge between treatment and everyday life. Here the young person keeps being supported — with routine, school or work, and people keeping watch — so the progress made gets to hold.',
    ),
    how: t(
      'Barnavernd sækir um stuðningsheimili hjá Barna- og fjölskyldustofu í framhaldi af meðferð.',
      'Child protection applies for a support home through Barna- og fjölskyldustofa following treatment.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Ungmenni eftir meðferð', 'Young people after treatment') },
      { label: t('Tegund', 'Type'), value: t('Stuðningsheimili', 'Support home') },
      { label: t('Áhersla', 'Focus'), value: t('Að festa framfarir í sessi', 'Making progress stick') },
      { label: t('Umhverfi', 'Setting'), value: t('Heimilislegt, sólarhringsstuðningur', 'Home-like, round-the-clock support') },
    ],
    note: t(
      'Það er ekki nóg að ná áfanga — það þarf líka að fá að halda honum. Þess vegna sleppum við ekki takinu of snemma.',
      'Reaching a milestone isn’t enough — you have to get to keep it. So we don’t let go too soon.',
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
    tagline: t('Allt undir einu þaki — á forsendum barnsins', 'Everything under one roof — on the child’s terms'),
    card: t(
      'Barnvænt hús fyrir börn sem hafa mögulega orðið fyrir ofbeldi. Viðtal, greining og meðferð á einum stað.',
      'A child-friendly house for children who may have experienced abuse. Interview, assessment and treatment in one place.',
    ),
    who: t(
      'Börn sem grunur leikur á að hafi sætt kynferðisofbeldi, líkamlegu ofbeldi eða orðið vitni að heimilisofbeldi.',
      'Children suspected of having experienced sexual abuse, physical abuse, or of having witnessed domestic violence.',
    ),
    what: t(
      'Í Barnahúsi fer allt fram undir einu þaki, í hlýlegu og barnvænu umhverfi — svo barn þurfi ekki að endurtaka erfiða sögu sína aftur og aftur á mörgum stöðum. Hér fara fram viðtöl, læknisskoðun, greining og meðferð, og hér er líka hlúð að fjölskyldunni. Þjónustan er að kostnaðarlausu.',
      'In Barnahús everything happens under one roof, in a warm and child-friendly setting — so a child doesn’t have to repeat their difficult story again and again in many places. Interviews, medical examination, assessment and treatment all take place here, and the family is supported too. The service is free of charge.',
    ),
    how: t(
      'Barnaverndarþjónusta óskar eftir þjónustu Barnahúss. Barn og foreldrar fá alla þjónustu á einum stað, að kostnaðarlausu.',
      'Child protection requests the services of Barnahús. The child and parents receive all services in one place, free of charge.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Börn sem gætu hafa orðið fyrir ofbeldi', 'Children who may have experienced abuse') },
      { label: t('Undir einu þaki', 'Under one roof'), value: t('Viðtal, skoðun, greining, meðferð', 'Interview, exam, assessment, treatment') },
      { label: t('Kostnaður', 'Cost'), value: t('Að kostnaðarlausu', 'Free of charge') },
      { label: t('Sími', 'Phone'), value: t('530 2500', '530 2500') },
    ],
    note: t(
      'Ekkert barn ber ábyrgð á því sem kom fyrir það. Í Barnahúsi er barninu trúað, hlustað og fylgt áfram.',
      'No child is responsible for what happened to them. In Barnahús, the child is believed, heard and walked forward.',
    ),
  },
  {
    slug: 'mst',
    name: 'MST — Fjölkerfameðferð',
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
      'Fjölskyldur barna 12–18 ára sem glíma við fjölþættan vanda — afskipti lögreglu, erfiðleika í skóla, ofbeldi eða vímuefnanotkun.',
      'Families of children aged 12–18 facing complex challenges — police involvement, school difficulties, violence or substance use.',
    ),
    what: t(
      'MST (fjölkerfameðferð) fer fram þar sem lífið gerist — heima, í skólanum og í nærumhverfi barnsins. Sérþjálfaður meðferðaraðili kemur heim, að jafnaði vikulega, og er í símasambandi allan sólarhringinn. Áherslan er á að efla foreldra svo þeir hafi verkfærin til að styðja barnið sitt. Meðferðin tekur að jafnaði 3–5 mánuði — og barnið býr heima allan tímann.',
      'MST (multisystemic therapy) takes place where life happens — at home, in school and in the child’s surroundings. A specially trained therapist comes to the home, usually weekly, and is reachable by phone around the clock. The focus is on strengthening parents so they hold the tools to support their child. Treatment usually lasts 3–5 months — and the child lives at home the whole time.',
    ),
    how: t(
      'Barnavernd um allt land getur vísað fjölskyldum í MST hjá Barna- og fjölskyldustofu.',
      'Child protection anywhere in Iceland can refer families to MST through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Fjölskyldur barna 12–18 ára', 'Families of children 12–18') },
      { label: t('Hvar', 'Where'), value: t('Heima hjá fjölskyldunni', 'In the family home') },
      { label: t('Lengd', 'Length'), value: t('Að jafnaði 3–5 mánuðir', 'Usually 3–5 months') },
      { label: t('Stuðningur', 'Support'), value: t('Vikulegar heimsóknir + sími allan sólarhringinn', 'Weekly visits + 24/7 phone') },
    ],
    note: t(
      'Barn þarf ekki alltaf að fara að heiman til að fá hjálp. Stundum er sterkasta úrræðið að styrkja heimilið sjálft.',
      'A child doesn’t always have to leave home to get help. Sometimes the strongest intervention is to strengthen the home itself.',
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
      'Sálfræðimeðferð fyrir börn vegna óviðeigandi eða skaðlegrar kynhegðunar — með stuðningi og von.',
      'Psychological treatment for children showing inappropriate or harmful sexual behaviour — with support and hope.',
    ),
    who: t(
      'Börn sem þurfa aðstoð vegna óviðeigandi eða skaðlegrar kynhegðunar, og fjölskyldur þeirra.',
      'Children who need help with inappropriate or harmful sexual behaviour, and their families.',
    ),
    what: t(
      'SÓK-meðferð er sálfræðiþjónusta sem styður barnið, dregur úr neikvæðum afleiðingum hegðunarinnar og minnkar líkur á að hún endurtaki sig. Unnið er af fagmennsku og hlýju — með skilningi frekar en skömm — svo barnið geti haldið áfram á heilbrigðari braut.',
      'SÓK is a psychological service that supports the child, reduces the negative consequences of the behaviour and lowers the likelihood of it repeating. The work is professional and warm — met with understanding rather than shame — so the child can move forward on a healthier path.',
    ),
    how: t(
      'Barnavernd vísar barni í SÓK-meðferð hjá Barna- og fjölskyldustofu.',
      'Child protection refers a child to SÓK through Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Börn og fjölskyldur þeirra', 'Children and their families') },
      { label: t('Tegund', 'Type'), value: t('Sálfræðimeðferð', 'Psychological treatment') },
      { label: t('Markmið', 'Goal'), value: t('Stuðningur og minni endurtekning', 'Support and less recurrence') },
      { label: t('Nálgun', 'Approach'), value: t('Fagmennska og hlýja', 'Professionalism and warmth') },
    ],
    note: t(
      'Börn eru ekki vandamálið sem á að leysa — þau eru manneskjur sem eiga skilið stuðning til að gera betur.',
      'Children are not a problem to be solved — they are people who deserve support to do better.',
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
      'Þegar barn getur ekki búið heima fær það öruggt skjól hjá fósturfjölskyldu — tímabundið eða til frambúðar.',
      'When a child can’t live at home, they find safety with a foster family — for a while or for good.',
    ),
    who: t(
      'Börn sem, vegna aðstæðna sinna, þurfa að búa hjá öðrum en foreldrum sínum um lengri eða skemmri tíma.',
      'Children who, because of their circumstances, need to live with someone other than their parents for a longer or shorter time.',
    ),
    what: t(
      'Fóstur er þegar barnaverndarþjónusta felur fósturforeldrum umsjá barns. Það getur verið tímabundið, varanlegt eða styrkt fóstur með sérstökum stuðningi þegar barn glímir við verulegan vanda. Fósturforeldrar fara í gegnum hæfnismat og námskeið, og Barna- og fjölskyldustofa styður þá alla leið — með ráðgjöf, samningum og eftirfylgd.',
      'Foster care is when child protection places a child in the care of foster parents. It can be temporary, permanent, or supported foster care with extra help when a child faces serious difficulties. Foster parents go through an assessment and training, and Barna- og fjölskyldustofa supports them the whole way — with guidance, agreements and follow-up.',
    ),
    how: t(
      'Barnaverndarþjónusta ráðstafar barni í fóstur. Vilt þú verða fósturforeldri? Það hefst með hæfnismati og námskeiði hjá BOFS skólanum.',
      'Child protection places a child in foster care. Want to become a foster parent? It begins with an assessment and training at the BOFS school.',
    ),
    facts: [
      { label: t('Tegundir', 'Types'), value: t('Tímabundið, varanlegt, styrkt fóstur', 'Temporary, permanent, supported') },
      { label: t('Fyrir', 'For'), value: t('Börn sem þurfa annað heimili', 'Children who need another home') },
      { label: t('Fósturforeldrar', 'Foster parents'), value: t('Hæfnismat og námskeið', 'Assessment and training') },
      { label: t('Stuðningur', 'Support'), value: t('Ráðgjöf og eftirfylgd frá BOFS', 'Guidance and follow-up from BOFS') },
    ],
    note: t(
      'Sérhvert barn á rétt á heimili þar sem því er haldið utan um. Fósturfjölskyldur gefa það — og fá stuðning til þess.',
      'Every child deserves a home where they are held. Foster families give that — and are supported to do so.',
    ),
  },
]

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug)

/* ── Photography (local, warm environments — no identifiable children) ─── */

/** One environment photo per service (files live in public/bofs/). */
export const CENTRE_PHOTO: Record<string, { src: string; alt: L }> = {
  studlar: { src: 'interior-calm.jpg', alt: t('Hlýleg, róleg setustofa í mjúkri birtu', 'A warm, calm living room in soft light') },
  blonduhlid: { src: 'interior-evening.jpg', alt: t('Notaleg stofa böðuð kvöldbirtu', 'A cosy room bathed in evening light') },
  bjargey: { src: 'interior-nook.jpg', alt: t('Lesehorn við glugga með útsýni', 'A reading nook by a window with a view') },
  laekjarbakki: {
    src: 'land-cliffs.jpg',
    alt: t('Sveitabær undir grænum hlíðum á Suðurlandi — táknræn mynd', 'A farm beneath green slopes in South Iceland — representative image'),
  },
  fannafold: { src: 'interior-living.jpg', alt: t('Björt stofa með plöntum og dagsbirtu', 'A bright living room with plants and daylight') },
  barnahus: { src: 'interior-bright.jpg', alt: t('Björt, hlýleg stofa full af mjúkri dagsbirtu', 'A bright, warm room full of soft daylight') },
  mst: { src: 'interior-family.jpg', alt: t('Notaleg fjölskyldustofa', 'A cosy family living room') },
  sok: { src: 'land-peak.jpg', alt: t('Grænt fjall undir mildum himni', 'A green mountain under a gentle sky') },
  fostur: {
    src: 'land-coast.jpg',
    alt: t('Sveitabær við fjörð, umvafinn fjöllum — táknræn mynd', 'A farmstead by a fjord, embraced by mountains — representative image'),
  },
}

/** Landing "warmth" gallery. */
export const GALLERY = {
  eyebrow: t('Andrými hlýju', 'A feeling of warmth'),
  title: t('Staðir sem eiga að líða eins og heimili', 'Places meant to feel like home'),
  lead: t(
    'Hlý rými, græn náttúra og opnar dyr — því umhverfi skiptir máli þegar barni á að líða vel.',
    'Warm rooms, green nature and open doors — because surroundings matter when a child needs to feel safe.',
  ),
  photos: [
    { src: 'land-homes.jpg', alt: t('Litrík hús í blómguðu túni undir fjöllum', 'Colourful houses in a flowering meadow below mountains') },
    { src: 'interior-bright.jpg', alt: t('Björt og hlý stofa', 'A bright, warm room') },
    { src: 'land-river.jpg', alt: t('Á sem liðast um græna dali', 'A river winding through green valleys') },
    { src: 'interior-nook.jpg', alt: t('Hlýlegt leshorn við glugga', 'A cosy reading nook by a window') },
  ] as { src: string; alt: L }[],
}

/* ── Honest-hope section ──────────────────────────────────────────────── */

export const HONEST = {
  kicker: t('Hreinskilnislega', 'Honestly'),
  title: t('Við lofum ekki fullkomnun — við lofum að hlusta og bæta', 'We don’t promise perfection — we promise to listen and improve'),
  body: t(
    'Kerfi sem heldur utan um viðkvæmustu börnin okkar má aldrei standa í stað. Við tökum gagnrýni alvarlega, lærum af því sem miður fer og vinnum á hverjum degi að því að gera betur — með öryggi og líðan barnanna í forgrunni.',
    'A system that holds our most vulnerable children can never stand still. We take criticism seriously, learn from what goes wrong, and work every day to do better — with the safety and wellbeing of children first.',
  ),
}

/* ── Emergency + contact ──────────────────────────────────────────────── */

export const HELP = {
  title: t('Þarftu að tala við einhvern núna?', 'Need to talk to someone now?'),
  lead: t(
    'Þú þarft ekki að bíða eftir réttu orðunum. Hér er hægt að ná strax í hjálp.',
    'You don’t have to wait for the right words. Here’s how to reach help right now.',
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
      blurb: t('Sími og netspjall — nafnlaust og ókeypis', 'Phone and web chat — anonymous and free'),
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
    'Hugmyndavefur — óformleg endurhönnun, ekki opinber vefur',
    'Concept site — an unofficial redesign, not the official website',
  ),
  footerTagline: t(
    'Öll úrræði fyrir börn og fjölskyldur á einum hlýjum stað.',
    'Every service for children and families in one warm place.',
  ),
  footerContact: t('Hafa samband', 'Contact'),
  footerServices: t('Úrræði', 'Services'),
  rights: t('Hugmynd og hönnun', 'Concept & design'),
}
