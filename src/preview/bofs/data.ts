/**
 * Barna- og fjölskyldustofa, "Öruggt skjól" concept.
 *
 * An unofficial design concept that summarises the agency's services and
 * hands visitors to island.is, where the full information lives.
 *
 * Every user-facing string carries { is, en }; Icelandic is the original.
 * Copy rules (2026-09-17): plain sentences in the register of a public
 * agency, only what a source supports, no slogans, no em or en dashes.
 *
 * FACTS: re-checked 17 September 2026 against island.is/s/bofs (treatment
 * homes, SÓK, Barnahús, MST, foster care), stjornarradid.is and the BOFS
 * annual report 2024. Full report: _docs/BOFS-FACT-CHECK-2026-09-17.md.
 *  - Primary treatment: island.is/s/bofs/medferdarheimili says it takes place
 *    at Blönduhlíð, while the agency's staff page lists a unit called "Esja".
 *    Unresolved, so the site names neither location; confirm with BOFS. The
 *    route slug stays "esjan" so existing links keep working.
 *  - Blönduhlíð at Farsældartún, Mosfellsbær, opened on 26 November 2024.
 *  - Lækjarbakki reopened in March 2026 and was formally opened 8 May 2026.
 *  - SÓK is paid for by the child protection service and needs guardians' consent.
 *  - Barnahús: founded 1 November 1998; 15 to 18 year olds generally give
 *    their statement to the police.
 *  - Removed as unconfirmed: Stuðlar's 1994/1996 dates, support home capacity,
 *    and the figures 23 child protection services and 158 children in MST.
 */

import { SYNCED_AT, SYNCED_NEWS } from './news.generated'

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
  /** where the headline breaks, per language, for the line-by-line opening */
  titleLines: { is: ['Öruggt skjól', 'fyrir hvert barn'], en: ['A safe place', 'for every child'] },
  lead: t(
    'Hér er útskýrt hvaða þjónustu Barna- og fjölskyldustofa veitir börnum og fjölskyldum, hvernig sótt er um hana og hvert er hægt að leita strax.',
    'This site explains the services Barna- og fjölskyldustofa provides for children and families, how they are applied for, and where to turn straight away.',
  ),
  ctaPrimary: t('Hvar á ég að byrja?', 'Where do I start?'),
  ctaSecondary: t('Hvernig barn fær aðstoð', 'How a child gets help'),
  reassure: t('Ef barn er í bráðri hættu skaltu hringja í 112', 'If a child is in immediate danger, call 112'),
}

/* ── Wayfinder: three doors (audience triage) ─────────────────────────── */


/* ── Four warm pillars ────────────────────────────────────────────────── */


/* ── The referral path (3 steps) ──────────────────────────────────────── */

export const PATH = {
  title: t('Hvernig barn fær aðstoð', 'How a child gets help'),
  lead: t(
    'Barnaverndarþjónusta í sveitarfélagi barnsins er alltaf fyrsti viðkomustaður. Hún tekur við tilkynningum, metur stöðuna og sækir um úrræði hjá Barna- og fjölskyldustofu ef þörf er á.',
    'The child protection service in the child’s municipality is always the first point of contact. It receives reports, assesses the situation and applies to Barna- og fjölskyldustofa for a service if one is needed.',
  ),
  steps: [
    {
      n: 1,
      title: t('Haft er samband við barnavernd', 'Child protection is contacted'),
      body: t(
        'Foreldri, barn, skóli, heilsugæsla eða hver sá sem hefur áhyggjur hefur samband við barnaverndarþjónustu sveitarfélagsins. Ekki þarf að hafa sannanir.',
        'A parent, a child, a school, a health centre or anyone with a concern contacts the municipal child protection service. No proof is needed.',
      ),
    },
    {
      n: 2,
      title: t('Staðan er metin', 'The situation is assessed'),
      body: t(
        'Barnaverndarþjónustan ákveður hvort málið verði kannað og vinnur áætlun í samvinnu við barnið og foreldra.',
        'The child protection service decides whether to investigate and draws up a plan together with the child and parents.',
      ),
    },
    {
      n: 3,
      title: t('Sótt er um úrræði', 'A service is applied for'),
      body: t(
        'Dugi stuðningur heima ekki sækir barnaverndarþjónustan um úrræði hjá Barna- og fjölskyldustofu, til dæmis MST-meðferð, Barnahús, meðferðarheimili eða fóstur.',
        'If support at home is not enough, the child protection service applies to Barna- og fjölskyldustofa for a service, such as MST therapy, Barnahús, a treatment home or foster care.',
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
      'Meðferðarheimili Barna- og fjölskyldustofu eru fyrir börn á aldrinum 12 til 18 ára. Vistun kemur til greina þegar meðferð heima hefur ekki borið árangur, og barnaverndarþjónusta sækir um hana í samráði við barnið og foreldra.',
      'The agency’s treatment homes are for children aged 12 to 18. A placement is considered when treatment at home has not worked, and the child protection service applies for it in consultation with the child and parents.',
    ),
  },
  {
    key: 'thjonusta',
    title: t('Þjónusta við börn og fjölskyldur', 'Services for children and families'),
    blurb: t(
      'Meðferð sem fer fram heima eða í viðtölum, þjónusta Barnahúss vegna ofbeldis og fóstur þegar barn getur ekki búið heima.',
      'Treatment that takes place at home or in sessions, Barnahús for children who may have experienced violence, and foster care when a child cannot live at home.',
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
  art: 'studlar' | 'esjan' | 'blonduhlid' | 'bjargey' | 'laekjarbakki' | 'barnahus' | 'mst' | 'sok' | 'fostur'
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
    tagline: t('Þegar barn þarf öruggan stað strax', 'When a child needs a safe place straight away'),
    card: t(
      'Neyðarvistun fyrir börn í alvarlegum vanda. Dvölin varir að hámarki í fjórtán daga.',
      'Emergency care for children in serious difficulty. A stay lasts fourteen days at most.',
    ),
    who: t(
      'Börn á aldrinum 12 til 18 ára í alvarlegum vanda sem þurfa tafarlaust öruggan stað.',
      'Children aged 12 to 18 in serious difficulty who need a safe place immediately.',
    ),
    what: t(
      'Neyðarvistun er bráðaúrræði. Markmiðið er að stöðva skaðlega hegðun, hlúa að barninu og gefa barnaverndarþjónustu og foreldrum ráðrúm til að finna lausnir. Vistunin á aldrei að vara lengur en þörf krefur og að hámarki í fjórtán daga. Sálfræðingur og deildarstjóri meta stöðuna reglulega og ákveða lengd dvalar í samráði við barnaverndarþjónustu.',
      'Emergency care is an acute measure. Its purpose is to stop harmful behaviour, look after the child and give the child protection service and the parents time to find solutions. A stay should never last longer than necessary and at most fourteen days. A psychologist and the head of the unit review the situation regularly and decide the length of stay with the child protection service.',
    ),
    how: t(
      'Barnaverndarþjónusta sveitarfélagsins ákveður vistun í neyðarvistun.',
      'The municipal child protection service decides on a placement in emergency care.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Börn 12 til 18 ára', 'Children aged 12 to 18') },
      { label: t('Dvöl', 'Stay'), value: t('Að hámarki 14 dagar', '14 days at most') },
      { label: t('Staður', 'Location'), value: t('Stuðlar, Fossaleyni í Reykjavík', 'Stuðlar, Fossaleyni, Reykjavík') },
    ],
    note: t(
      'Foreldrar og barnaverndarþjónusta vinna saman að næstu skrefum á meðan á dvölinni stendur.',
      'Parents and the child protection service work together on the next steps during the stay.',
    ),
  },
  {
    slug: 'esjan',
    name: 'Grunnmeðferð',
    category: 'heimili',
    kind: t('Meðferðarheimili', 'Treatment home'),
    hue: '#6E9E6E',
    hueSoft: '#DCEBD8',
    art: 'esjan',
    tagline: t('Vandinn er kortlagður og meðferð hefst', 'The difficulties are mapped and treatment begins'),
    card: t(
      'Fyrsta stig meðferðar á meðferðarheimili. Vandi barnsins og fjölskyldunnar er kortlagður og meðferðaráætlun gerð. Meðferðin tekur 8 til 12 vikur.',
      'The first stage of residential treatment. The difficulties of the child and family are mapped and a treatment plan is made. Treatment takes 8 to 12 weeks.',
    ),
    who: t(
      'Börn á aldrinum 12 til 18 ára þegar meðferð heima hefur ekki borið árangur, til dæmis vegna hegðunar- eða vímuefnavanda.',
      'Children aged 12 to 18 when treatment at home has not worked, for example because of behavioural or substance use difficulties.',
    ),
    what: t(
      'Í grunnmeðferð er vandi barnsins og fjölskyldunnar kortlagður í samvinnu við barnaverndarþjónustu. Meðferðarþörf er metin og gerð er meðferðaráætlun sem miðar að því að draga úr áhættuþáttum og styrkja það sem verndar barnið. Foreldrar taka virkan þátt og barnið fer reglulega heim á meðferðartímanum. Markmiðið er alltaf að barnið geti snúið heim að meðferð lokinni. Náist markmiðin ekki er mælt með framhaldsmeðferð eða öðrum stuðningi.',
      'In primary treatment, the difficulties of the child and family are mapped together with the child protection service. The need for treatment is assessed and a plan is made to reduce risk factors and strengthen what protects the child. Parents take an active part and the child goes home regularly during treatment. The aim is always for the child to return home when treatment ends. If the goals are not met, continued treatment or other support is recommended.',
    ),
    how: t(
      'Barnaverndarþjónusta sækir um í samráði við barnið og foreldra. Meðferðarteymi Barna- og fjölskyldustofu metur hvort vistun eigi við.',
      'The child protection service applies in consultation with the child and parents. The agency’s treatment team assesses whether a placement is appropriate.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Börn 12 til 18 ára', 'Children aged 12 to 18') },
      { label: t('Lengd', 'Length'), value: t('8 til 12 vikur', '8 to 12 weeks') },
      { label: t('Heimferðir', 'Home visits'), value: t('Reglulega á meðferðartíma', 'Regularly during treatment') },
    ],
    note: t(
      'Nánari upplýsingar um grunnmeðferð og handbók meðferðarheimilisins eru á síðu meðferðarheimila á island.is.',
      'More about primary treatment, and the treatment home’s handbook, is on the treatment homes page on island.is.',
    ),
  },
  {
    slug: 'blonduhlid',
    name: 'Stuðningsheimilið Blönduhlíð',
    category: 'heimili',
    kind: t('Stuðningsheimili', 'Support home'),
    hue: '#8A9A5B',
    hueSoft: '#E4EAD4',
    art: 'blonduhlid',
    tagline: t('Áframhaldandi stuðningur að lokinni meðferð', 'Continued support after treatment'),
    card: t(
      'Fyrir börn sem hafa lokið grunn- og framhaldsmeðferð en geta ekki búið hjá foreldrum eða forsjáraðilum.',
      'For children who have completed primary and continued treatment but cannot live with their parents or guardians.',
    ),
    who: t(
      'Börn sem hafa lokið grunn- og framhaldsmeðferð, þurfa áframhaldandi stuðning og geta af ýmsum ástæðum ekki búið hjá forsjáraðilum.',
      'Children who have completed primary and continued treatment, need further support and for various reasons cannot live with their guardians.',
    ),
    what: t(
      'Á stuðningsheimilinu er lögð áhersla á að viðhalda þeim árangri sem náðst hefur í meðferð, halda áfram virkni og þátttöku í samfélaginu og undirbúa barnið undir að standa á eigin fótum.',
      'The support home focuses on keeping the progress made in treatment, continuing activity and participation in the community, and preparing the young person to stand on their own feet.',
    ),
    how: t(
      'Barnaverndarþjónusta sækir um hjá Barna- og fjölskyldustofu.',
      'The child protection service applies to Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Börn að lokinni meðferð', 'Children who have completed treatment') },
      { label: t('Áhersla', 'Focus'), value: t('Viðhald árangurs og sjálfstætt líf', 'Keeping progress, independent living') },
    ],
    note: t(
      'Handbók stuðningsheimilisins er aðgengileg á síðu meðferðarheimilanna á island.is.',
      'The support home’s handbook is available on the treatment homes page on island.is.',
    ),
  },
  {
    slug: 'bjargey',
    name: 'Bjargey',
    category: 'heimili',
    kind: t('Framhaldsmeðferð fyrir stúlkur og stálp', 'Continued treatment for girls and non-binary young people'),
    hue: '#D98895',
    hueSoft: '#F6DEE2',
    art: 'bjargey',
    tagline: t('Framhaldsmeðferð í allt að sex mánuði', 'Continued treatment for up to six months'),
    card: t(
      'Framhaldsmeðferð fyrir stúlkur og stálp sem hafa lokið grunnmeðferð. Meðferðin getur varað í allt að sex mánuði.',
      'Continued treatment for girls and non-binary young people who have completed primary treatment. It can last up to six months.',
    ),
    who: t(
      'Stúlkur og stálp sem hafa lokið grunnmeðferð og þurfa lengri meðferð.',
      'Girls and non-binary young people who have completed primary treatment and need longer treatment.',
    ),
    what: t(
      'Í framhaldsmeðferð er unnið að því að draga úr áhættuhegðun, á grundvelli þeirrar kortlagningar sem fór fram í grunnmeðferð og upplýsinga frá barninu sjálfu, barnaverndarþjónustu og forsjáraðilum. Unnið er eftir einstaklingsbundinni meðferðaráætlun, með áherslu á öryggi, stöðugleika og virkni í skóla, vinnu og tómstundum. Meðferðin getur varað í allt að sex mánuði og sækja má um framlengingu ef það þjónar hagsmunum barnsins. Bjargey er í Eyjafjarðarsveit.',
      'Continued treatment works to reduce risk behaviour, building on the mapping done in primary treatment and on information from the young person, the child protection service and guardians. Work follows an individual treatment plan, with a focus on safety, stability and activity in school, work and leisure. Treatment can last up to six months, and an extension can be requested if it serves the child’s interests. Bjargey is in Eyjafjarðarsveit.',
    ),
    how: t(
      'Barnaverndarþjónusta sækir um framhaldsmeðferð hjá Barna- og fjölskyldustofu.',
      'The child protection service applies to Barna- og fjölskyldustofa for continued treatment.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Stúlkur og stálp, eftir grunnmeðferð', 'Girls and non-binary young people, after primary treatment') },
      { label: t('Lengd', 'Length'), value: t('Allt að 6 mánuðir', 'Up to 6 months') },
      { label: t('Staður', 'Location'), value: t('Eyjafjarðarsveit', 'Eyjafjarðarsveit') },
    ],
    note: t(
      'Sækja má um framlengingu meðferðar ef það þjónar hagsmunum barnsins.',
      'An extension of treatment can be requested if it serves the child’s interests.',
    ),
  },
  {
    slug: 'laekjarbakki',
    name: 'Lækjarbakki',
    category: 'heimili',
    kind: t('Framhaldsmeðferð fyrir drengi og stálp', 'Continued treatment for boys and non-binary young people'),
    hue: '#5E97B8',
    hueSoft: '#D6E6EE',
    art: 'laekjarbakki',
    tagline: t('Framhaldsmeðferð í Gunnarsholti', 'Continued treatment at Gunnarsholt'),
    card: t(
      'Framhaldsmeðferð fyrir drengi og stálp í Gunnarsholti á Rangárvöllum. Heimilið tók aftur til starfa í mars 2026.',
      'Continued treatment for boys and non-binary young people at Gunnarsholt in Rangárvellir. The home reopened in March 2026.',
    ),
    who: t(
      'Drengir og stálp sem hafa lokið grunnmeðferð og þurfa lengri meðferð.',
      'Boys and non-binary young people who have completed primary treatment and need longer treatment.',
    ),
    what: t(
      'Í framhaldsmeðferð er unnið að því að draga úr áhættuhegðun, á grundvelli þeirrar kortlagningar sem fór fram í grunnmeðferð og upplýsinga frá barninu sjálfu, barnaverndarþjónustu og forsjáraðilum. Unnið er eftir einstaklingsbundinni meðferðaráætlun, með áherslu á öryggi, stöðugleika og virkni í skóla, vinnu og tómstundum. Meðferðin getur varað í allt að sex mánuði og sækja má um framlengingu. Lækjarbakki tók aftur til starfa í mars 2026, eftir að hafa verið lokaður um skeið, og var formlega opnaður 8. maí 2026. Þar er rými fyrir sex ungmenni.',
      'Continued treatment works to reduce risk behaviour, building on the mapping done in primary treatment and on information from the young person, the child protection service and guardians. Work follows an individual treatment plan, with a focus on safety, stability and activity in school, work and leisure. Treatment can last up to six months and an extension can be requested. Lækjarbakki reopened in March 2026 after a period of closure and was formally opened on 8 May 2026. It has places for six young people.',
    ),
    how: t(
      'Barnaverndarþjónusta sækir um framhaldsmeðferð hjá Barna- og fjölskyldustofu.',
      'The child protection service applies to Barna- og fjölskyldustofa for continued treatment.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Drengi og stálp, eftir grunnmeðferð', 'Boys and non-binary young people, after primary treatment') },
      { label: t('Lengd', 'Length'), value: t('Allt að 6 mánuðir', 'Up to 6 months') },
      { label: t('Pláss', 'Places'), value: t('Sex ungmenni', 'Six young people') },
      { label: t('Staður', 'Location'), value: t('Gunnarsholt á Rangárvöllum', 'Gunnarsholt, Rangárvellir') },
    ],
    note: t(
      'Heimilið var formlega opnað 8. maí 2026 eftir endurbætur á húsnæðinu.',
      'The home was formally opened on 8 May 2026 after work on the premises.',
    ),
  },
  {
    slug: 'barnahus',
    name: 'Barnahús',
    category: 'thjonusta',
    kind: t('Þjónusta við börn sem kunna að hafa orðið fyrir ofbeldi', 'For children who may have experienced violence'),
    hue: '#C98BA6',
    hueSoft: '#EFDDE8',
    art: 'barnahus',
    tagline: t('Þjónusta á einum stað', 'Services in one place'),
    card: t(
      'Barnahús tekur á móti börnum sem grunur leikur á að hafi orðið fyrir ofbeldi. Viðtöl, skoðun, greining og meðferð fara fram á einum stað, fjölskyldunni að kostnaðarlausu.',
      'Barnahús receives children who may have experienced violence. Interviews, examination, assessment and treatment take place in one place, free of charge for the family.',
    ),
    who: t(
      'Börn sem grunur leikur á að hafi orðið fyrir kynferðislegu eða líkamlegu ofbeldi, og foreldrar þeirra.',
      'Children suspected of having experienced sexual or physical violence, and their parents.',
    ),
    what: t(
      'Barnahús var stofnað 1. nóvember 1998 til að tryggja samstarf barnaverndar, lögreglu, dómstóla og Landspítala þegar grunur er um að barn hafi orðið fyrir ofbeldi. Barnið og foreldrar fá þjónustuna á einum stað svo barnið þurfi ekki að segja sögu sína á mörgum stöðum. Sé málið í lögreglurannsókn ákveður dómari hvar skýrslutaka fer fram. Börn á aldrinum 15 til 18 ára gefa almennt skýrslu hjá lögreglu, nema í undantekningartilvikum.',
      'Barnahús was founded on 1 November 1998 to ensure that child protection, the police, the courts and Landspítali work together when a child may have experienced violence. The child and parents receive the service in one place, so the child does not have to tell their story in many places. If the case is under police investigation, a judge decides where the child’s statement is taken. Children aged 15 to 18 generally give their statement to the police, except in exceptional cases.',
    ),
    how: t(
      'Barn og foreldrar fá þjónustu Barnahúss með tilvísun frá barnaverndarþjónustu, að kostnaðarlausu.',
      'The child and parents receive the services of Barnahús through a referral from the child protection service, free of charge.',
    ),
    facts: [
      { label: t('Stofnað', 'Founded'), value: t('1. nóvember 1998', '1 November 1998') },
      { label: t('Tilvísun', 'Referral'), value: t('Frá barnaverndarþjónustu', 'From child protection') },
      { label: t('Kostnaður', 'Cost'), value: t('Enginn fyrir fjölskylduna', 'None for the family') },
      { label: t('Sími', 'Phone'), value: t('530 2500', '530 2500') },
    ],
    note: t(
      'Ef barn er í bráðri hættu skal hringja í 112.',
      'If a child is in immediate danger, call 112.',
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
    tagline: t('Meðferð sem fer fram heima', 'Treatment that takes place at home'),
    card: t(
      'Meðferð fyrir fjölskyldur barna á aldrinum 12 til 18 ára með alvarlegan hegðunar- og vímuefnavanda. Barnið býr áfram heima.',
      'Treatment for families of children aged 12 to 18 with serious behavioural and substance use difficulties. The child keeps living at home.',
    ),
    who: t(
      'Fjölskyldur barna á aldrinum 12 til 18 ára þegar vandinn birtist til dæmis í afskiptum lögreglu, erfiðleikum í skóla, ofbeldi eða vímuefnanotkun.',
      'Families of children aged 12 to 18 when the difficulties show up, for example, as police involvement, problems at school, violence or substance use.',
    ),
    what: t(
      'MST-meðferð miðar fyrst og fremst að því að auka færni foreldra til að takast á við vanda barnsins. Meðferðaraðili hittir foreldra, og eftir atvikum barnið, heima hjá fjölskyldunni eftir samkomulagi. Foreldrar geta leitað ráða hjá meðferðaraðila í síma allan sólarhringinn. Meðferðin tekur að jafnaði 3 til 5 mánuði. Markmiðin eru að barnið búi heima, stundi skóla eða vinnu, komist ekki í kast við lögin, noti ekki vímuefni og beiti ekki ofbeldi.',
      'MST therapy aims above all to build parents’ ability to handle their child’s difficulties. A therapist meets the parents, and the child where appropriate, in the family home by arrangement. Parents can reach the therapist for advice by phone around the clock. Treatment usually takes 3 to 5 months. The goals are that the child lives at home, attends school or work, stays out of trouble with the law, does not use drugs and does not use violence.',
    ),
    how: t(
      'Barnaverndarþjónustur um allt land geta vísað fjölskyldum í MST-meðferð.',
      'Child protection services anywhere in Iceland can refer families to MST therapy.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Fjölskyldur barna 12 til 18 ára', 'Families of children aged 12 to 18') },
      { label: t('Hvar', 'Where'), value: t('Heima hjá fjölskyldunni, um allt land', 'In the family home, nationwide') },
      { label: t('Lengd', 'Length'), value: t('Að jafnaði 3 til 5 mánuðir', 'Usually 3 to 5 months') },
      { label: t('Ráðgjöf', 'Advice'), value: t('Í síma allan sólarhringinn', 'By phone around the clock') },
    ],
    note: t(
      'Barnið býr heima á meðan á meðferðinni stendur.',
      'The child lives at home throughout the treatment.',
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
    tagline: t('Sálfræðiþjónusta vegna kynhegðunar', 'Psychological help with sexual behaviour'),
    card: t(
      'Sálfræðiþjónusta fyrir börn sem þurfa aðstoð vegna óviðeigandi eða skaðlegrar kynhegðunar, og fjölskyldur þeirra.',
      'A psychological service for children who need help with inappropriate or harmful sexual behaviour, and for their families.',
    ),
    who: t(
      'Börn sem þurfa aðstoð vegna óviðeigandi eða skaðlegrar kynhegðunar, og fjölskyldur þeirra.',
      'Children who need help with inappropriate or harmful sexual behaviour, and their families.',
    ),
    what: t(
      'Meðferðin er í höndum sálfræðinga með sérþekkingu á þessu sviði og fer að mestu fram á sálfræðistofu. Unnið er með styrkleika barnsins og það sem getur dregið úr líkum á frekari óviðeigandi eða skaðlegri kynhegðun. Lengd meðferðar fer eftir umfangi vandans, aldri og þroska barnsins. Við lok meðferðar skilar sálfræðingur skýrslu til barnaverndarþjónustu og Barna- og fjölskyldustofu.',
      'Treatment is provided by psychologists with specialist knowledge in this field and mostly takes place at a psychology practice. The work builds on the child’s strengths and on what can reduce the likelihood of further inappropriate or harmful sexual behaviour. The length of treatment depends on the extent of the difficulties and the child’s age and maturity. At the end, the psychologist reports to the child protection service and Barna- og fjölskyldustofa.',
    ),
    how: t(
      'Barnaverndarþjónusta vísar barni í meðferðina. Forsjáraðilar þurfa að samþykkja þjónustuna. Barnaverndarþjónustan greiðir gjald fyrir mat og meðferð.',
      'The child protection service refers the child. Guardians must consent to the service. The child protection service pays a fee for assessment and treatment.',
    ),
    facts: [
      { label: t('Fyrir', 'For'), value: t('Börn og fjölskyldur þeirra', 'Children and their families') },
      { label: t('Veitt af', 'Provided by'), value: t('Sérhæfðum sálfræðingum', 'Specialist psychologists') },
      { label: t('Samþykki', 'Consent'), value: t('Forsjáraðilar samþykkja', 'Guardians give consent') },
      { label: t('Lengd', 'Length'), value: t('Fer eftir aðstæðum barnsins', 'Depends on the child’s situation') },
    ],
    note: t(
      'Barnaverndarþjónustan greiðir fyrir meðferðina, ekki fjölskyldan.',
      'The child protection service pays for the treatment, not the family.',
    ),
  },
  {
    slug: 'fostur',
    name: 'Fóstur',
    category: 'thjonusta',
    kind: t('Þegar barn getur ekki búið heima', 'When a child cannot live at home'),
    hue: '#D68F5A',
    hueSoft: '#F4E1CC',
    art: 'fostur',
    tagline: t('Heimili hjá fósturfjölskyldu', 'A home with a foster family'),
    card: t(
      'Þegar barn getur ekki búið hjá foreldrum sínum felur barnaverndarþjónusta fósturforeldrum umsjá þess, tímabundið eða varanlega.',
      'When a child cannot live with their parents, the child protection service places the child in the care of foster parents, for a period or permanently.',
    ),
    who: t(
      'Börn sem vegna aðstæðna sinna þurfa að búa hjá öðrum en foreldrum sínum, og fólk sem vill gerast fósturforeldrar.',
      'Children who, because of their circumstances, need to live with someone other than their parents, and people who want to become foster parents.',
    ),
    what: t(
      'Fóstur getur verið tímabundið, varanlegt eða fóstur vegna verulegs hegðunarvanda. Barnaverndarþjónusta ráðstafar barni í fóstur. Barna- og fjölskyldustofa metur hæfni þeirra sem vilja gerast fósturforeldrar, heldur námskeið fyrir þau og veitir fósturforeldrum ráðgjöf.',
      'Foster care can be temporary, permanent, or for children with serious behavioural difficulties. The child protection service places the child. Barna- og fjölskyldustofa assesses people who want to become foster parents, runs courses for them and advises foster parents.',
    ),
    how: t(
      'Barnaverndarþjónusta ráðstafar barni í fóstur. Þau sem vilja gerast fósturforeldrar sækja um hjá Barna- og fjölskyldustofu.',
      'The child protection service places a child in foster care. People who want to become foster parents apply to Barna- og fjölskyldustofa.',
    ),
    facts: [
      { label: t('Tegundir', 'Types'), value: t('Tímabundið, varanlegt, vegna hegðunarvanda', 'Temporary, permanent, for behavioural difficulties') },
      { label: t('Ráðstöfun', 'Placement'), value: t('Barnaverndarþjónusta', 'Child protection service') },
      { label: t('Fósturforeldrar', 'Foster parents'), value: t('Hæfnismat og námskeið', 'Assessment and a course') },
    ],
    note: t(
      'Umsóknarferlið fyrir verðandi fósturforeldra er lýst á island.is.',
      'The application process for prospective foster parents is described on island.is.',
    ),
  },
]

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug)

export const FOSTER_STEPS = {
  eyebrow: t('Að gerast fósturforeldri', 'Becoming a foster parent'),
  lead: t(
    'Þau sem vilja gerast fósturforeldrar sækja um hjá Barna- og fjölskyldustofu. Umsóknarferlinu, hæfnismati og leyfum er lýst á island.is.',
    'People who want to become foster parents apply to Barna- og fjölskyldustofa. The application process, assessment and approval are described on island.is.',
  ),
  steps: [
    {
      n: 1,
      title: t('Umsókn', 'Application'),
      body: t(
        'Þú sækir um að gerast fósturforeldri hjá Barna- og fjölskyldustofu.',
        'You apply to Barna- og fjölskyldustofa to become a foster parent.',
      ),
    },
    {
      n: 2,
      title: t('Hæfnismat og námskeið', 'Assessment and course'),
      body: t(
        'Barna- og fjölskyldustofa metur hæfni umsækjenda og heldur námskeið fyrir verðandi fósturforeldra.',
        'Barna- og fjölskyldustofa assesses applicants and runs a course for prospective foster parents.',
      ),
    },
    {
      n: 3,
      title: t('Leyfi og ráðstöfun', 'Approval and placement'),
      body: t(
        'Að loknu mati getur umsækjandi fengið leyfi til að taka barn í fóstur. Barnaverndarþjónusta ráðstafar barni í fóstur og Barna- og fjölskyldustofa veitir fósturforeldrum ráðgjöf.',
        'After assessment, the applicant can be approved to foster. The child protection service places a child, and Barna- og fjölskyldustofa advises foster parents.',
      ),
    },
  ],
  cta: t('Senda fyrirspurn um fóstur', 'Send a question about fostering'),
}

/* ── Photography (local; warm environments, no identifiable children) ─── */

/*
 * Service imagery: the watercolor suite (one painting per service, in the
 * service's mood) — honestly symbolic, never pretending to be the real
 * premises. Lækjarbakki is the exception: it keeps the ministry's REAL
 * photographs of the actual home.
 */
export const CENTRE_PHOTO: Record<string, { src: string; alt: L; painted?: boolean }> = {
  studlar: {
    src: 'art-studlar.jpg',
    alt: t(
      'Vatnslitamynd af Stuðlum við Fossaleyni',
      'Watercolour of Stuðlar at Fossaleyni',
    ),
    painted: true,
  },
  esjan: {
    src: 'art-esjan.jpg',
    alt: t('Vatnslitamynd af meðferðarheimili í grænu landslagi', 'Watercolour of a treatment home in a green landscape'),
    painted: true,
  },
  blonduhlid: {
    src: 'art-blonduhlid.jpg',
    alt: t('Vatnslitamynd af hvítu húsi með rauðu þaki', 'Watercolour of a white house with a red roof'),
    painted: true,
  },
  bjargey: {
    src: 'art-bjargey.jpg',
    alt: t('Vatnslitamynd af Bjargey í Eyjafjarðarsveit', 'Watercolour of Bjargey in Eyjafjarðarsveit'),
    painted: true,
  },
  laekjarbakki: {
    src: 'art-laekjarbakki.jpg',
    alt: t('Vatnslitamynd af Lækjarbakka í Gunnarsholti', 'Watercolour of Lækjarbakki at Gunnarsholt'),
    painted: true,
  },
  barnahus: {
    src: 'art-barnahus.jpg',
    alt: t(
      'Vatnslitamynd: tveir mjúkir stólar snúa hvor að öðrum við glugga, sá minni fyrir barn, vatnsglas og litir á borði á milli',
      'Watercolour: two soft chairs turned toward each other by a window, the smaller one for a child, a glass of water and crayons on the table between them',
    ),
  },
  mst: {
    src: 'art-mst.jpg',
    alt: t('Vatnslitamynd: þrjú hús í túni að kvöldi', 'Watercolour: three houses in a field in the evening'),
  },
  sok: {
    src: 'art-sok.jpg',
    alt: t('Vatnslitamynd: sólarupprás yfir kyrru vatni og dökkri hæð', 'Watercolour: sunrise over still water and a dark hill'),
  },
  fostur: {
    src: 'art-fostur.jpg',
    alt: t('Vatnslitamynd: sveitabær með opnar dyr og ljós sem fellur á hlaðið', 'Watercolour: a farmstead with an open door, light spilling onto the step'),
  },
}


/* ── National statistics (verified; sober big-number tiles) ───────────── */

export interface Stat {
  value: number
  format?: 'thousand' | 'plain'
  label: L
}

export const STATS = {
  eyebrow: t('Tölur', 'Figures'),
  title: t('Starfsemin í tölum', 'The work in figures'),
  lead: t(
    'Tölur úr ársskýrslu Barna- og fjölskyldustofu fyrir árið 2024.',
    'Figures from the Barna- og fjölskyldustofa annual report for 2024.',
  ),
  source: t(
    'Heimild: Barna- og fjölskyldustofa, ársskýrsla 2024.',
    'Source: Barna- og fjölskyldustofa, annual report 2024.',
  ),
  items: [
    { value: 16751, format: 'thousand', label: t('Tilkynningar til barnaverndar árið 2024', 'Reports to child protection in 2024') },
    { value: 169, format: 'plain', label: t('Starfsmenn í árslok 2024', 'Staff at the end of 2024') },
    { value: 7, format: 'plain', label: t('Starfsstöðvar um landið', 'Sites around the country') },
  ] as Stat[],
}

/* ── Duty to report (tilkynningarskylda) ──────────────────────────────── */

export const REPORT = {
  eyebrow: t('Tilkynningarskylda', 'The duty to report'),
  title: t('Hefur þú áhyggjur af barni?', 'Are you worried about a child?'),
  lead: t(
    'Hafðu samband við barnaverndarþjónustu í sveitarfélagi barnsins. Þú þarft ekki sannanir. Barnaverndarþjónustan metur hvort og hvernig brugðist er við.',
    'Contact the child protection service in the child’s municipality. You do not need proof. The child protection service assesses whether and how to respond.',
  ),
  emergency: t(
    'Ef barn er í bráðri hættu skaltu hringja strax í 112.',
    'If a child is in immediate danger, call 112 straight away.',
  ),
  statute: t(
    'Tilkynningarskylda fagfólks gengur framar ákvæðum laga um þagnarskyldu.',
    'For professionals, the duty to report takes precedence over statutory confidentiality.',
  ),
  statuteRef: t('16. og 17. gr. barnaverndarlaga nr. 80/2002', 'Articles 16 and 17, Child Protection Act no. 80/2002'),
  lanes: [
    {
      key: 'almenningur',
      title: t('Almenningur', 'The public'),
      rows: [
        t('Öllum er skylt að tilkynna ef ástæða er til að ætla að barn búi við óviðunandi aðstæður.', 'Everyone must report if there is reason to believe a child is living in unacceptable conditions.'),
        t('Tilkynnt er til barnaverndarþjónustu sveitarfélagsins eða í 112.', 'Reports go to the municipal child protection service or to 112.'),
        t('Þú getur óskað nafnleyndar.', 'You can ask to remain anonymous.'),
      ],
    },
    {
      key: 'fagfolk',
      title: t('Fagfólk', 'Professionals'),
      rows: [
        t('Þau sem starfa með börnum hafa ríkari tilkynningarskyldu samkvæmt barnaverndarlögum.', 'People who work with children have a stronger duty to report under the Child Protection Act.'),
        t('Skyldan á meðal annars við um kennara, heilbrigðisstarfsfólk og lögreglu.', 'The duty applies to teachers, health staff and police, among others.'),
        t('Fagfólk getur ekki óskað nafnleyndar.', 'Professionals cannot report anonymously.'),
      ],
    },
  ],
  ctaPrimary: t('Lesa um ferlið', 'Read about the process'),
  ctaSecondary: t('Hringja í 112', 'Call 112'),
}

/* ── Honest-hope section ──────────────────────────────────────────────── */

export const HONEST = {
  kicker: t('Ábendingar', 'Feedback'),
  title: t('Ábendingum og kvörtunum um þjónustuna má koma á framfæri', 'Feedback and complaints about the services can be raised'),
  body: t(
    'Gæða- og eftirlitsstofnun velferðarmála hefur eftirlit með gæðum þjónustu sem veitt er samkvæmt barnaverndarlögum og tekur við kvörtunum um hana.',
    'The Quality and Supervisory Authority of Welfare oversees the quality of services provided under the Child Protection Act and receives complaints about them.',
  ),
}

/* ── History timeline ─────────────────────────────────────────────────── */

export interface Milestone {
  year: string
  title: L
  body: L
}

export const TIMELINE: { eyebrow: L; title: L; items: Milestone[] } = {
  eyebrow: t('Saga', 'History'),
  title: t('Saga stofnunarinnar', 'History of the agency'),
  items: [
    {
      year: '1998',
      title: t('Barnahús stofnað', 'Barnahús is founded'),
      body: t(
        'Barnahús tekur til starfa 1. nóvember 1998, fyrst sinnar tegundar í Evrópu.',
        'Barnahús opens on 1 November 1998, the first of its kind in Europe.',
      ),
    },
    {
      year: '2008',
      title: t('MST-meðferð hefst', 'MST therapy begins'),
      body: t(
        'MST-fjölkerfameðferð er tekin upp og síðar boðin um allt land.',
        'MST therapy is introduced and later offered nationwide.',
      ),
    },
    {
      year: '2021',
      title: t('Farsældarlögin samþykkt', 'The Prosperity Act is passed'),
      body: t(
        'Lög nr. 86/2021 um samþættingu þjónustu í þágu farsældar barna eru samþykkt á Alþingi.',
        'Act no. 86/2021 on integrated services for children’s prosperity is passed by Althingi.',
      ),
    },
    {
      year: '2022',
      title: t('Barna- og fjölskyldustofa tekur við', 'Barna- og fjölskyldustofa takes over'),
      body: t(
        'Barna- og fjölskyldustofa tekur til starfa 1. janúar 2022 samkvæmt lögum nr. 87/2021 og tekur við verkefnum Barnaverndarstofu.',
        'Barna- og fjölskyldustofa begins operating on 1 January 2022 under Act no. 87/2021 and takes over the tasks of Barnaverndarstofa.',
      ),
    },
    {
      year: '2024',
      title: t('Meðferðarheimilið Blönduhlíð opnað', 'The Blönduhlíð treatment home opens'),
      body: t(
        'Mennta- og barnamálaráðherra opnar Blönduhlíð á Farsældartúni í Mosfellsbæ 26. nóvember 2024.',
        'The Minister of Education and Children opens Blönduhlíð at Farsældartún in Mosfellsbær on 26 November 2024.',
      ),
    },
    {
      year: '2026',
      title: t('Lækjarbakki tekur aftur til starfa', 'Lækjarbakki reopens'),
      body: t(
        'Meðferðarheimilið í Gunnarsholti tekur aftur á móti ungmennum í mars og er formlega opnað 8. maí 2026.',
        'The treatment home at Gunnarsholt receives young people again in March and is formally opened on 8 May 2026.',
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
  title: t('Spurningar og svör', 'Questions and answers'),
  hand: t('Spurningar', 'Questions'),
  items: [
    {
      q: t('Kostar þjónustan eitthvað?', 'Does the service cost anything?'),
      a: t('Nei. Þjónusta barnaverndar og úrræði Barna- og fjölskyldustofu, þar á meðal Barnahús, eru fjölskyldum að kostnaðarlausu.', 'No. Child protection services and the services of Barna- og fjölskyldustofa, including Barnahús, are free of charge for families.'),
      aud: 'almennt',
    },
    {
      q: t('Þarf ég sannanir til að tilkynna áhyggjur?', 'Do I need proof to report a concern?'),
      a: t('Nei. Það nægir að hafa áhyggjur. Barnaverndarþjónustan kannar málið og metur stöðuna.', 'No. A concern is enough. The child protection service looks into the matter and assesses the situation.'),
      aud: 'almennt',
    },
    {
      q: t('Get ég tilkynnt nafnlaust?', 'Can I report anonymously?'),
      a: t('Já. Almenningur má óska nafnleyndar sem gildir gagnvart öllum öðrum en starfsfólki barnaverndar.', 'Yes. Members of the public can request anonymity, which applies to everyone except child protection staff.'),
      aud: 'almennt',
    },
    {
      q: t('Hvernig kemst barn í meðferð?', 'How does a child get into treatment?'),
      a: t('Barnaverndarþjónusta sveitarfélagsins sækir um meðferð hjá Barna- og fjölskyldustofu. Foreldrar og barnið eru með í ráðum.', 'The path always runs through the child protection service in the municipality, which applies to Barna- og fjölskyldustofa for a service when needed.'),
      aud: 'foreldri',
    },
    {
      q: t('Getur barn búið heima á meðan það fær hjálp?', 'Can a child stay at home while getting help?'),
      a: t('Oft já. Samkvæmt barnaverndarlögum skal beita vægustu úrræðum sem duga. MST-meðferð fer til dæmis fram heima hjá fjölskyldunni.', 'Often, yes. Under the Child Protection Act, the least intrusive measures that are enough must be used. MST therapy, for example, takes place in the family home.'),
      aud: 'foreldri',
    },
    {
      q: t('Hver getur orðið fósturforeldri?', 'Who can become a foster parent?'),
      a: t('Þau sem vilja gerast fósturforeldrar sækja um hjá Barna- og fjölskyldustofu, sem metur hæfni umsækjenda. Skilyrðum og ferlinu er lýst á island.is.', 'People who want to foster apply to Barna- og fjölskyldustofa, which assesses applicants. The requirements and the process are described on island.is.'),
      aud: 'fostur',
    },
    {
      q: t('Hvað er Barnahús?', 'What is Barnahús?'),
      a: t('Barnahús tekur á móti börnum sem grunur leikur á að hafi orðið fyrir ofbeldi. Þjónustan fer fram á einum stað, með tilvísun frá barnaverndarþjónustu og fjölskyldunni að kostnaðarlausu.', 'Barnahús receives children who may have experienced violence. The services take place in one place, through a referral from child protection and free of charge for the family.'),
      aud: 'almennt',
    },
  ],
}

/* ── The child-protection system, end to end (kerfid page) ────────────── */

export const KERFID = {
  title: t('Hvernig barnavernd virkar', 'How child protection works'),
  hero: {
    kicker: t('Barnavernd', 'Child protection'),
    title: t('Hvernig barnavernd virkar', 'How child protection works'),
    lead: t(
      'Barnaverndarþjónusta sveitarfélaga tekur við tilkynningum og metur stöðu barna. Barna- og fjölskyldustofa veitir sérhæfð úrræði þegar barnaverndarþjónusta sækir um þau.',
      'Municipal child protection services receive reports and assess children’s situations. Barna- og fjölskyldustofa provides specialised services when a child protection service applies for them.',
    ),
  },
  stationsEyebrow: t('Ferlið', 'The process'),
  stations: [
    {
      title: t('Tilkynning', 'A report'),
      body: t(
        'Áhyggjur af barni eru tilkynntar til barnaverndarþjónustu sveitarfélagsins eða í 112. Öllum er skylt að tilkynna og fagfólk hefur ríkari skyldu.',
        'A concern about a child is reported to the municipal child protection service or to 112. Everyone must report, and professionals have a stronger duty.',
      ),
      law: t('16. og 17. gr. barnaverndarlaga', 'Articles 16 and 17, Child Protection Act'),
    },
    {
      title: t('Ákvörðun um könnun', 'Decision to investigate'),
      body: t(
        'Barnaverndarþjónusta sveitarfélagsins tekur afstöðu til þess innan sjö daga hvort hefja skuli könnun. Þar starfar starfsfólk sveitarfélagsins, ekki Barna- og fjölskyldustofu.',
        'Within seven days, the municipal child protection service decides whether to open an investigation. Its staff work for the municipality, not for Barna- og fjölskyldustofa.',
      ),
      law: t('21. gr. barnaverndarlaga', 'Article 21, Child Protection Act'),
    },
    {
      title: t('Könnun og áætlun', 'Investigation and plan'),
      body: t(
        'Barnaverndarþjónustan kannar aðstæður barnsins og gerir skriflega áætlun í samvinnu við foreldra og barnið eftir aldri þess og þroska.',
        'The child protection service investigates the child’s circumstances and makes a written plan with the parents, and with the child according to age and maturity.',
      ),
      law: t('22. og 23. gr. barnaverndarlaga', 'Articles 22 and 23, Child Protection Act'),
    },
    {
      title: t('Stuðningur heima', 'Support at home'),
      body: t(
        'Beita skal vægustu ráðstöfunum sem duga. Fyrst er reynt að styðja fjölskylduna heima, til dæmis með ráðgjöf eða MST-meðferð.',
        'The least intrusive measures that are enough must be used. Support at home is tried first, for example advice or MST therapy.',
      ),
      law: t('4. gr. barnaverndarlaga', 'Article 4, Child Protection Act'),
    },
    {
      title: t('Úrræði Barna- og fjölskyldustofu', 'Services from the agency'),
      body: t(
        'Dugi það ekki sækir barnaverndarþjónustan um úrræði hjá Barna- og fjölskyldustofu, til dæmis Barnahús, meðferðarheimili eða fóstur.',
        'If that is not enough, the child protection service applies to Barna- og fjölskyldustofa for a service such as Barnahús, a treatment home or foster care.',
      ),
      law: t('Lög um Barna- og fjölskyldustofu nr. 87/2021', 'Act no. 87/2021'),
    },
    {
      title: t('Eftirfylgd', 'Follow-up'),
      body: t(
        'Markmiðið er að barnið geti búið heima eða við stöðugar aðstæður. Barnaverndarþjónustan fylgir málinu eftir samkvæmt áætluninni.',
        'The aim is for the child to live at home or in stable circumstances. The child protection service follows the case according to the plan.',
      ),
      law: t('4. gr. barnaverndarlaga', 'Article 4, Child Protection Act'),
    },
  ],
  rights: {
    eyebrow: t('Réttindi barna', 'Children’s rights'),
    title: t('Barnasáttmálinn hefur lagagildi á Íslandi', 'The Convention on the Rights of the Child is law in Iceland'),
    lead: t(
      'Samningur Sameinuðu þjóðanna um réttindi barnsins var lögfestur með lögum nr. 19/2013. Hér eru nokkur ákvæði sem skipta miklu í barnavernd.',
      'The UN Convention on the Rights of the Child was incorporated into Icelandic law by Act no. 19/2013. These are some of the articles that matter most in child protection.',
    ),
    items: [
      { article: t('2. gr.', 'Art. 2'), text: t('Öll börn njóta réttinda sáttmálans án mismununar.', 'All children have the rights in the Convention without discrimination.') },
      { article: t('3. gr.', 'Art. 3'), text: t('Það sem barni er fyrir bestu skal hafa forgang í öllum ákvörðunum sem varða það.', 'The best interests of the child must be a primary consideration in all decisions about the child.') },
      { article: t('12. gr.', 'Art. 12'), text: t('Barn á rétt á að láta skoðanir sínar í ljós í málum sem það varða og að tekið sé tillit til þeirra.', 'A child has the right to express views on matters affecting them and to have those views taken into account.') },
      { article: t('19. gr.', 'Art. 19'), text: t('Barn á rétt á vernd gegn hvers kyns ofbeldi og vanrækslu.', 'A child has the right to protection from all forms of violence and neglect.') },
      { article: t('20. gr.', 'Art. 20'), text: t('Barn sem getur ekki búið hjá fjölskyldu sinni á rétt á sérstakri vernd og aðstoð.', 'A child who cannot live with their family has the right to special protection and assistance.') },
      { article: t('31. gr.', 'Art. 31'), text: t('Barn á rétt á hvíld, tómstundum og leik.', 'A child has the right to rest, leisure and play.') },
    ],
  },
  laws: {
    eyebrow: t('Lög', 'Law'),
    title: t('Lögin sem gilda', 'The laws that apply'),
    items: [
      {
        name: t('Barnaverndarlög nr. 80/2002', 'Child Protection Act no. 80/2002'),
        body: t('Meginlöggjöf um barnavernd. Þar er meðal annars kveðið á um tilkynningarskyldu, könnun mála og úrræði barnaverndarþjónustu.', 'The main child protection legislation, covering among other things the duty to report, investigations and the measures available to child protection services.'),
      },
      {
        name: t('Lög nr. 86/2021 um samþættingu þjónustu í þágu farsældar barna', 'Act no. 86/2021 on integrated services for children’s prosperity'),
        body: t('Kveða á um að börn og foreldrar fái samþætta þjónustu, með tengilið og eftir atvikum málstjóra.', 'Provides for children and parents to receive integrated services, with a contact person and, where needed, a case manager.'),
      },
      {
        name: t('Lög nr. 87/2021 um Barna- og fjölskyldustofu', 'Act no. 87/2021 on the National Agency for Children and Families'),
        body: t('Setja Barna- og fjölskyldustofu hlutverk sitt, meðal annars að veita þjónustu og styðja barnaverndarþjónustur um allt land.', 'Sets out the agency’s role, including providing services and supporting child protection services across the country.'),
      },
    ],
  },
}

/* ── About the agency (um-stofnunina page) ────────────────────────────── */

export const LEADERSHIP: { name: string; title: L }[] = [
  { name: 'Ólöf Ásta Farestveit', title: t('Forstjóri', 'Director General') },
  { name: 'Eiríkur K. Þorvarðarson', title: t('Framkvæmdastjóri sviðs búsetu og samþættrar þjónustu', 'Director, Residential and Integrated Services') },
  { name: 'Funi Sigurðsson', title: t('Framkvæmdastjóri sviðs meðferðar og samþættrar þjónustu', 'Director, Treatment and Integrated Services') },
  { name: 'Guðrún Þorleifsdóttir', title: t('Framkvæmdastjóri umbóta- og stjórnsýslusviðs', 'Director, Improvement and Administration') },
  { name: 'Guðrún Sigurjónsdóttir', title: t('Framkvæmdastjóri fjármála- og mannauðssviðs', 'Director, Finance and Human Resources') },
  { name: 'Páll Ólafsson', title: t('Framkvæmdastjóri farsældar- og barnaverndarsviðs', 'Director, Prosperity and Child Protection') },
]

export const ABOUT = {
  title: t('Um stofnunina', 'About the agency'),
  hero: {
    kicker: t('Um stofnunina', 'About the agency'),
    title: t('Barna- og fjölskyldustofa', 'Barna- og fjölskyldustofa'),
    lead: t(
      'Markmið Barna- og fjölskyldustofu er að vinna að velferð barna. Meginhlutverk hennar er að veita og styðja við þjónustu í þágu barna og stuðla að gæðaþróun. Stofnunin þjónar landinu öllu.',
      'The aim of Barna- og fjölskyldustofa is to work for the welfare of children. Its main role is to provide and support services for children and to promote quality development. The agency serves the whole country.',
    ),
  },
  factband: [
    { label: t('Heyrir undir', 'Reports to'), value: t('Mennta- og barnamálaráðherra', 'Minister of Education and Children') },
    { label: t('Starfar samkvæmt', 'Operates under'), value: t('Lögum nr. 87/2021', 'Act no. 87/2021') },
    { label: t('Tók til starfa', 'Began operating'), value: t('1. janúar 2022', '1 January 2022') },
    { label: t('Starfsfólk', 'Staff'), value: t('169 í árslok 2024', '169 at the end of 2024') },
  ],
  role: {
    eyebrow: t('Hlutverk', 'Role'),
    title: t('Hlutverk', 'Role'),
    paras: [
      t(
        'Barna- og fjölskyldustofa styður við þjónustu sem veitt er hjá sveitarfélögum um land allt og vinnur að innleiðingu samþættingar þjónustu í þágu farsældar barna.',
        'Barna- og fjölskyldustofa supports services provided by municipalities across the country and works on implementing integrated services for children’s prosperity.',
      ),
      t(
        'Á grundvelli barnaverndarlaga hefur stofnunin yfirumsjón með rekstri meðferðarheimila ríkisins og Barnahúss, auk annarra úrræða sem styðja við vinnslu barnaverndarmála. Hún veitir barnaverndarþjónustum liðsinni í fósturmálum með því að þjálfa, fræða og styðja fósturforeldra.',
        'Under the Child Protection Act, the agency oversees the state treatment homes and Barnahús, along with other services that support child protection work. It assists child protection services in foster care by training, educating and supporting foster parents.',
      ),
    ],
    tasks: [
      t('Almenn og sérhæfð fræðsla til stjórnvalda og annarra.', 'General and specialised training for public authorities and others.'),
      t('Útgáfa leiðbeininga, gátlista og annars stuðningsefnis.', 'Publishing guidance, checklists and other support material.'),
      t('Leiðbeiningar og ráðgjöf um vinnslu einstakra mála.', 'Guidance and advice on individual cases.'),
      t('Þróun og innleiðing gagnreyndra aðferða og úrræða í þágu barna.', 'Developing and introducing evidence-based methods and services for children.'),
      t('Uppbygging og yfirstjórn heimila, stofnana og sérhæfðra úrræða fyrir börn.', 'Establishing and managing homes, institutions and specialised services for children.'),
      t('Rannsóknir og stuðningur við þróunar- og rannsóknarstarf.', 'Research, and support for development and research work.'),
      t('Vinnsla upplýsinga, þar á meðal söfnun og skráahald.', 'Processing information, including collection and record keeping.'),
    ],
  },
  services: {
    title: t('Úrræði í umsjón stofnunarinnar', 'Services run by the agency'),
    items: [
      { slug: 'barnahus', label: t('Barnahús', 'Barnahús') },
      { slug: 'studlar', label: t('Meðferðarheimili', 'Treatment homes') },
      { slug: 'sok', label: t('SÓK-meðferð', 'SÓK therapy') },
      { slug: 'mst', label: t('MST-fjölkerfameðferð', 'MST therapy') },
      { slug: 'fostur', label: t('Fóstur', 'Foster care') },
    ],
  },
  org: {
    eyebrow: t('Skipulag', 'Organisation'),
    title: t('Skipulag', 'Organisation'),
    lead: t(
      'Forstjóri og framkvæmdastjórn stýra stofnuninni. Í árslok 2024 störfuðu 169 manns hjá henni á sjö starfsstöðvum.',
      'The agency is led by the Director General and the executive board. At the end of 2024, 169 people worked there across seven sites.',
    ),
    boardTitle: t('Forstjóri og framkvæmdastjórn', 'Director General and executive board'),
    unitsTitle: t('Svið og einingar', 'Divisions and units'),
    units: [
      t('Farsældar- og barnaverndarsvið', 'Prosperity and Child Protection'),
      t('Svið búsetu og samþættrar þjónustu', 'Residential and Integrated Services'),
      t('Svið meðferðar og samþættrar þjónustu', 'Treatment and Integrated Services'),
      t('Umbóta- og stjórnsýslusvið', 'Improvement and Administration'),
      t('Fjármála- og mannauðssvið', 'Finance and Human Resources'),
      t('Barnahús', 'Barnahús'),
      t('Fósturteymi', 'Foster care team'),
      t('MST', 'MST'),
      t('Stuðlar', 'Stuðlar'),
      t('Bjargey', 'Bjargey'),
      t('Lækjarbakki', 'Lækjarbakki'),
      t('Esja', 'Esja'),
    ],
  },
  sites: {
    title: t('Starfsstöðvar í Reykjavík', 'Sites in Reykjavík'),
    lead: t(
      'Upplýsingar um aðgengi og samgöngur eins og stofnunin birtir þær.',
      'Access and transport information as published by the agency.',
    ),
    items: [
      { name: t('Skrifstofa, Borgartúni 21', 'Office, Borgartún 21'), body: t('Strætisvagnar 4, 12 og 16 stansa í Borgartúni. Gjaldskyld bílastæði við aðalinngang. Aðgengi fyrir hreyfihamlaða er gott.', 'Buses 4, 12 and 16 stop on Borgartún. Paid parking at the main entrance. Good access for people with limited mobility.') },
      { name: t('Skrifstofa, Borgartúni 29', 'Office, Borgartún 29'), body: t('Strætisvagnar 4, 12 og 16 stansa í Borgartúni. Gjaldskyld bílastæði við aðalinngang.', 'Buses 4, 12 and 16 stop on Borgartún. Paid parking at the main entrance.') },
      { name: t('Barnahús', 'Barnahús'), body: t('Um fimm mínútna gangur frá Mjódd. Bílastæði fyrir framan húsið. Aðgengi fyrir hreyfihamlaða er gott.', 'About five minutes’ walk from Mjódd. Parking in front of the building. Good access for people with limited mobility.') },
      { name: t('Stuðlar', 'Stuðlar'), body: t('Strætisvagnar 6 og 15 stansa við Egilshöll, í göngufæri. Bílastæði fyrir framan húsið. Aðgengi fyrir hreyfihamlaða er gott.', 'Buses 6 and 15 stop at Egilshöll, within walking distance. Parking in front of the building. Good access for people with limited mobility.') },
    ],
  },
  policies: {
    title: t('Stefnur og áætlanir', 'Policies and plans'),
    items: [
      t('Jafnlaunastefna', 'Equal pay policy'),
      t('Jafnréttisáætlun', 'Equality plan'),
      t('Umhverfisstefna', 'Environmental policy'),
      t('Loftslagsstefna', 'Climate policy'),
      t('Persónuverndarstefna', 'Privacy policy'),
    ],
  },
  leadership: {
    eyebrow: t('Stjórnun', 'Management'),
    title: t('Forstjóri og framkvæmdastjórn', 'Director General and executive board'),
  },
  oversight: {
    eyebrow: t('Eftirlit', 'Oversight'),
    title: t('Eftirlit og kvartanir', 'Oversight and complaints'),
    body: t(
      'Gæða- og eftirlitsstofnun velferðarmála hefur eftirlit með gæðum þjónustu sem veitt er samkvæmt barnaverndarlögum, þar á meðal úrræðum Barna- og fjölskyldustofu. Kvörtunum um gæði þjónustunnar má beina þangað.',
      'The Quality and Supervisory Authority of Welfare oversees the quality of services provided under the Child Protection Act, including the agency’s services. Complaints about the quality of services can be sent there.',
    ),
    contact: t('Suðurlandsbraut 24, 108 Reykjavík. Sími 540 0040. gev@gev.is', 'Suðurlandsbraut 24, 108 Reykjavík. Phone 540 0040. gev@gev.is'),
  },
  contact: {
    eyebrow: t('Hafa samband', 'Contact'),
    title: t('Hafa samband', 'Contact'),
  },
}

/* ── About teaser (landing) ───────────────────────────────────────────── */

export const ABOUT_TEASER = {
  eyebrow: t('Stofnunin', 'The agency'),
  title: t('Um Barna- og fjölskyldustofu', 'About Barna- og fjölskyldustofa'),
  body: t(
    'Barna- og fjölskyldustofa er ríkisstofnun undir mennta- og barnamálaráðuneytinu. Hún tók til starfa 1. janúar 2022 og tók við verkefnum Barnaverndarstofu. Í árslok 2024 störfuðu þar 169 manns.',
    'Barna- og fjölskyldustofa is a state agency under the Ministry of Education and Children. It began operating on 1 January 2022, taking over the tasks of Barnaverndarstofa. At the end of 2024, 169 people worked there.',
  ),
  cta: t('Um stofnunina', 'About the agency'),
  timelineCta: t('Saga stofnunarinnar', 'History of the agency'),
}

/* ── Emergency + contact ──────────────────────────────────────────────── */

export const HELP = {
  title: t('Hvert er hægt að leita strax?', 'Where can I turn straight away?'),
  lead: t(
    'Ef barn er í hættu eða þú þarft að tala við einhvern núna eru þetta númerin.',
    'If a child is in danger or you need to talk to someone now, these are the numbers.',
  ),
  lines: [
    {
      label: t('Neyðarlínan', 'Emergency line'),
      value: '112',
      blurb: t('Bráð hætta, allan sólarhringinn', 'Immediate danger, around the clock'),
    },
    {
      label: t('Hjálparsími Rauða krossins', 'Red Cross helpline'),
      value: '1717',
      blurb: t('Sími og netspjall, allan sólarhringinn, nafnlaust og án endurgjalds', 'Phone and web chat, around the clock, anonymous and free'),
    },
    {
      label: t('Barnahús', 'Barnahús'),
      value: '530 2500',
      blurb: t('Þjónusta vegna gruns um ofbeldi gegn barni', 'Services when violence against a child is suspected'),
    },
    {
      label: t('Barna- og fjölskyldustofa', 'Barna- og fjölskyldustofa'),
      value: '530 2600',
      blurb: t('Virka daga 9 til 12 og 12.30 til 15', 'Weekdays 9 to 12 and 12.30 to 15'),
    },
  ],
}

/* ── Related institutions ─────────────────────────────────────────────── */

export const INSTITUTIONS: { eyebrow: L; title: L; items: { name: string; role: L; href: string | null }[] } = {
  eyebrow: t('Samstarf og eftirlit', 'Partners and oversight'),
  title: t('Tengdar stofnanir', 'Related bodies'),
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


/* ── News (real, current, source-linked items; verified 27 July 2026) ────
 * Every item below was re-checked against the publisher's own page on
 * 27 July 2026: island.is/s/bofs/frett (BOFS), island.is/s/gev (GEV),
 * stjornarradid.is and visir.is. Summaries are written from the article
 * body itself, never inferred from the headline, and every figure quoted
 * appears verbatim in the source. Items whose text was not read carry no
 * summary rather than a guessed one.
 *
 * One deliberate divergence from the source: the 11 May headline reads
 * "farsælda barna" on island.is, an uncorrected typo in their own CMS. We
 * publish the correct "farsæld barna".
 * ---------------------------------------------------------------------- */

export type NewsTopic = 'barnavernd' | 'medferd' | 'barnahus' | 'samstarf'

export interface NewsItem {
  date: string
  source: 'BOFS' | 'GEV' | 'Stjórnarráðið' | 'Umboðsmaður barna' | 'Vísir'
  topic: NewsTopic
  title: L
  /** The publisher's own intro, or a fuller one read off the article body. */
  summary?: L
  href: string
  /*
   * There is deliberately no image field. See the note in sections.tsx: the
   * publishers' own news images are mostly clip art and charts, and a
   * watercolour in their place would imply it depicts the story. The list is
   * typographic and fetches no news content from a third-party host.
   */
  /** True when the English side is showing Icelandic for want of a translation. */
  untranslated?: boolean
  summaryUntranslated?: boolean
  featured?: boolean
  stats?: { value: string; label: L }[]
}

export const NEWS_TOPICS: { id: NewsTopic; label: L }[] = [
  { id: 'barnavernd', label: t('Barnavernd', 'Child protection') },
  { id: 'medferd', label: t('Meðferð og úrræði', 'Treatment and services') },
  { id: 'barnahus', label: t('Barnahús', 'Barnahús') },
  { id: 'samstarf', label: t('Samstarf og forvarnir', 'Partnership and prevention') },
]

export const NEWS_SOURCES: { id: NewsItem['source']; label: L }[] = [
  { id: 'BOFS', label: t('Fréttir Barna- og fjölskyldustofu á island.is', 'Barna- og fjölskyldustofa newsroom on island.is') },
  { id: 'GEV', label: t('Gæða- og eftirlitsstofnun velferðarmála', 'Quality and Supervisory Agency for Welfare') },
  { id: 'Stjórnarráðið', label: t('Mennta- og barnamálaráðuneytið, á vef Stjórnarráðsins', 'Ministry of Education and Children, on the Government of Iceland site') },
  { id: 'Umboðsmaður barna', label: t('Umboðsmaður barna', 'The Ombudsman for Children') },
  { id: 'Vísir', label: t('Vísir, íslenskur fréttamiðill', 'Vísir, an Icelandic news outlet') },
]

export const NEWS = {
  eyebrow: t('Fréttir', 'News'),
  title: t('Fréttir', 'News'),
  lead: t(
    'Fréttir Barna- og fjölskyldustofu og tengdar fréttir frá öðrum opinberum aðilum og fjölmiðlum. Hver frétt vísar á upprunalega heimild.',
    'News from Barna- og fjölskyldustofa and related items from other public bodies and the media. Every item links to its original source.',
  ),
  /** Stamped by the sync, so it can never drift from the actual content. */
  updated: SYNCED_AT,
  note: t(
    'Fréttir Barna- og fjölskyldustofu eru sóttar daglega af fréttavef stofnunarinnar á island.is, með fyrirsögn, dagsetningu og inngangi eins og þær eru birtar þar. Fréttir frá öðrum eru valdar sérstaklega og merktar útgefanda.',
    'News from Barna- og fjölskyldustofa is collected daily from the agency’s newsroom on island.is, with the headline, date and introduction as published there. Items from other publishers are selected individually and labelled with the publisher.',
  ),
  cta: t('Sjá allar fréttir', 'See all news'),
  featuredLabel: t('Nýjast', 'Latest'),
  readMore: t('Lesa fréttina', 'Read the item'),
  filterTitle: t('Sía eftir efni', 'Filter by topic'),
  filterAll: t('Allt', 'Everything'),
  archiveTitle: t('Eldri fréttir', 'Earlier news'),
  sourcesTitle: t('Hvaðan fréttirnar koma', 'Where these items come from'),
  sourcesNote: t(
    'Hver frétt opnast á vef útgefandans.',
    'Each item opens on the publisher’s website.',
  ),
  count: (n: number): L =>
    t(n === 1 ? '1 frétt' : `${n} fréttir`, n === 1 ? '1 item' : `${n} items`),
  empty: t('Engar fréttir í þessum flokki.', 'No items in this topic.'),
  /**
   * Regenerated by scripts/bofs-news-sync.mjs from the agency own
   * newsroom on island.is. Do not hand-edit; edit OVERRIDES in that
   * script instead, or the next sync silently discards the change.
   */
  items: SYNCED_NEWS,
}

/* ── Legal pages ──────────────────────────────────────────────────────────
 * Icelandic public bodies must publish an accessibility statement and meet
 * WCAG 2.1 AA (EN 301 549). A new act passed in the 157th session phases the
 * duty in from 1 January 2027 for public websites first published after 2015.
 * The statement below follows the structure the directive requires: status,
 * known gaps, how the site was tested, and a two-stage feedback route.
 * ------------------------------------------------------------------------ */

export const ACCESSIBILITY = {
  title: t('Aðgengi', 'Accessibility'),
  updated: t('Síðast uppfært 17. september 2026', 'Last updated 17 September 2026'),
  intro: t(
    'Stefnt er að því að allir geti notað vefinn, óháð fötlun, aldri eða búnaði. Þessi yfirlýsing á við um þennan vef.',
    'The aim is for everyone to be able to use this site, regardless of disability, age or device. This statement applies to this website.',
  ),
  sections: [
    {
      title: t('Markmið', 'Aim'),
      body: t(
        'Markmiðið er að vefurinn uppfylli WCAG 2.1, stig AA. Vefurinn er hugmynd að framsetningu og hefur ekki farið í formlega úttekt.',
        'The aim is for the site to meet WCAG 2.1 level AA. The site is a design concept and has not been formally audited.',
      ),
    },
    {
      title: t('Það sem hefur verið gert', 'What has been done'),
      body: t(
        'Myndir hafa textalýsingu, fyrirsagnir eru í réttri röð, hægt er að nota vefinn með lyklaborði og fókus er sýnilegur. Hægt er að stækka letur í fæti síðunnar. Hreyfing á síðunni stöðvast ef stillt hefur verið á minni hreyfingu í tækinu.',
        'Images have text descriptions, headings are in order, the site can be used with a keyboard and focus is visible. Text size can be increased in the footer. Motion stops if reduced motion is set on the device.',
      ),
    },
    {
      title: t('Takmarkanir', 'Limitations'),
      body: t(
        'Vefurinn hefur ekki verið prófaður með notendum skjálesara eða með fötluðu fólki. Það þyrfti að gera áður en vefur af þessu tagi væri tekinn í notkun.',
        'The site has not been tested with screen reader users or with disabled people. That would need to be done before a site like this went into use.',
      ),
    },
    {
      title: t('Ábendingar', 'Feedback'),
      body: t(
        'Ábendingar um aðgengi má senda á bofs@bofs.is eða hringja í 530 2600.',
        'Feedback about accessibility can be sent to bofs@bofs.is or by calling 530 2600.',
      ),
    },
  ],
}

export const PRIVACY = {
  title: t('Persónuvernd', 'Privacy'),
  updated: t('Síðast uppfært 17. september 2026', 'Last updated 17 September 2026'),
  intro: t(
    'Barna- og fjölskyldustofa vinnur persónuupplýsingar samkvæmt lögum nr. 90/2018 um persónuvernd og vinnslu persónuupplýsinga. Persónuverndarstefna stofnunarinnar er birt á island.is.',
    'Barna- og fjölskyldustofa processes personal data under Act no. 90/2018 on data protection and the processing of personal data. The agency’s privacy policy is published on island.is.',
  ),
  sections: [
    {
      title: t('Þessi vefur', 'This site'),
      body: t(
        'Vefurinn notar engar vafrakökur og engin greiningartól. Val á tungumáli og leturstærð er vistað í vafranum þínum.',
        'The site uses no cookies and no analytics tools. Your choice of language and text size is stored in your browser.',
      ),
    },
    {
      title: t('Hýsing', 'Hosting'),
      body: t(
        'Hýsingaraðili getur skráð tæknilegar upplýsingar, svo sem IP-tölur, vegna rekstrar.',
        'The hosting provider may log technical information, such as IP addresses, for operational purposes.',
      ),
    },
    {
      title: t('Réttindi þín', 'Your rights'),
      body: t(
        'Þú átt rétt á upplýsingum um vinnslu persónuupplýsinga um þig, aðgangi að þeim og leiðréttingu. Fyrirspurnir má senda á bofs@bofs.is. Kvörtunum má beina til Persónuverndar.',
        'You have the right to information about the processing of your personal data, to access it and to have it corrected. Questions can be sent to bofs@bofs.is. Complaints can be made to Persónuvernd, the Data Protection Authority.',
      ),
    },
    {
      title: t('Viðkvæmar upplýsingar', 'Sensitive information'),
      body: t(
        'Ekki senda viðkvæmar upplýsingar um barn í tölvupósti. Hafðu frekar samband við barnaverndarþjónustu sveitarfélagsins. Ef barn er í hættu skaltu hringja í 112.',
        'Do not send sensitive information about a child by email. Contact the municipal child protection service instead. If a child is in danger, call 112.',
      ),
    },
  ],
}

/* ── Not found (a wrong turn, not a dead end) ─────────────────────────── */

export const NOTFOUND = {
  hand: t('Síða fannst ekki', 'Page not found'),
  title: t('Síðan fannst ekki', 'Page not found'),
  lead: t(
    'Slóðin getur verið röng eða síðan hefur verið færð. Hér eru helstu síður vefsins.',
    'The address may be wrong or the page may have moved. These are the main pages of the site.',
  ),
  links: [
    { label: t('Úrræði Barna- og fjölskyldustofu', 'Services of the agency'), to: '/preview/bofs#heimili' },
    { label: t('Hvernig barnavernd virkar', 'How child protection works'), to: '/preview/bofs/kerfid' },
    { label: t('Hefur þú áhyggjur af barni?', 'Are you worried about a child?'), to: '/preview/bofs#tilkynna' },
    { label: t('Hvert er hægt að leita strax?', 'Where can I turn straight away?'), to: '/preview/bofs#help' },
  ],
  home: t('Forsíða', 'Home'),
  reassure: t('Ef barn er í bráðri hættu skaltu hringja í 112.', 'If a child is in immediate danger, call 112.'),
}

/* ── UI strings ───────────────────────────────────────────────────────── */

export const UI = {
  skipToContent: t('Fara í meginmál', 'Skip to content'),
  nav: {
    home: t('Forsíða', 'Home'),
    homes: t('Meðferðarheimili', 'Treatment homes'),
    services: t('Úrræðin', 'Services'),
    system: t('Barnavernd', 'Child protection'),
    about: t('Um stofnunina', 'About'),
    report: t('Tilkynna áhyggjur', 'Report a concern'),
    path: t('Ferlið', 'The process'),
    help: t('Fá hjálp', 'Get help'),
  },
  allServices: t('Öll úrræðin', 'All services'),
  exploreCentre: t('Skoða nánar', 'Learn more'),
  backToAll: t('Til baka í öll úrræði', 'Back to all services'),
  whoFor: t('Fyrir hverja', 'Who it is for'),
  whatHappens: t('Hvað felst í þjónustunni', 'What the service involves'),
  howToReach: t('Hvernig er sótt um?', 'How is it applied for?'),
  keyFacts: t('Í stuttu máli', 'In brief'),
  nextCentre: t('Næsta úrræði', 'Next service'),
  wherePath: t('Hvar úrræðið er í ferlinu', 'Where this service sits in the process'),
  readSystem: t('Lesa um kerfið alla leið', 'Read about the whole system'),
  emergencyChip: t('Neyð? Hringdu í 112', 'Emergency? Call 112'),
  langLabel: t('Íslenska', 'English'),
  onThisPage: t('Á þessari síðu', 'On this page'),
  conceptBadge: t(
    'Hugmynd að framsetningu. Þetta er ekki opinber vefur Barna- og fjölskyldustofu.',
    'Design concept. This is not the official website of Barna- og fjölskyldustofa.',
  ),
  footerTagline: t(
    'Þjónusta við börn og fjölskyldur um allt land.',
    'Services for children and families across Iceland.',
  ),
  footerContact: t('Hafa samband', 'Contact'),
  footerServices: t('Úrræði', 'Services'),
  footerSite: t('Vefurinn', 'This site'),
  rights: t('Hugmynd og hönnun', 'Concept & design'),
}

/* ── island.is: where the full, official information lives ──────────────
 * This site is a warm front door. Everything it summarises is published in
 * full on island.is, and every section that needs more than a summary hands
 * the visitor there. Each address below was taken from the island.is
 * sitemap and confirmed to load with the matching page title on
 * 17 September 2026. island.is has no separate page per treatment home, so
 * the homes point at the treatment-homes page, which covers them.
 * ---------------------------------------------------------------------- */

const IS = 'https://island.is'

export const ISLAND = {
  home: { href: `${IS}/s/bofs`, label: t('Vefur stofnunarinnar', 'The agency’s website') },
  report: { href: `${IS}/tilkynna-um-adstaedur-barns-til-barnaverndar`, label: t('Tilkynna til barnaverndar', 'Report to child protection') },
  municipal: { href: `${IS}/s/bofs/barnavernd-eftir-sveitarfeloegum`, label: t('Finna barnaverndarþjónustu', 'Find a child protection service') },
  childProtection: { href: `${IS}/s/bofs/barnavernd`, label: t('Nánar um barnavernd', 'More about child protection') },
  system: { href: `${IS}/s/bofs/hlutverk-og-skipulag-barnaverndarstarfs`, label: t('Hlutverk og skipulag barnaverndar', 'How child protection is organised') },
  laws: { href: `${IS}/s/bofs/loeg-og-reglugerdir`, label: t('Lög og reglugerðir', 'Laws and regulations') },
  forms: { href: `${IS}/s/bofs/eydubloed-barnaverndarmala`, label: t('Eyðublöð barnaverndarmála', 'Child protection forms') },
  faq: { href: `${IS}/s/bofs/spurt-og-svarad-um-barna-og-fjoelskyldustofu`, label: t('Fleiri spurningar og svör', 'More questions and answers') },
  about: { href: `${IS}/s/bofs/um-barna-og-fjoelskyldustofu`, label: t('Nánar um stofnunina', 'More about the agency') },
  role: { href: `${IS}/s/bofs/hlutverk-barna-og-fjoelskyldustofu`, label: t('Hlutverk og lögbundin verkefni', 'Role and statutory tasks') },
  staff: { href: `${IS}/s/bofs/starfsfolk-barna-og-fjoelskyldustofu`, label: t('Starfsfólk eftir einingum', 'Staff by unit') },
  policies: { href: `${IS}/s/bofs/stefnur-og-aaetlanir`, label: t('Lesa stefnurnar', 'Read the policies') },
  sites: { href: `${IS}/s/bofs/adgengi-ad-starfsstoedvum-bofs`, label: t('Aðgengi að starfsstöðvum', 'Access to the sites') },
  publications: { href: `${IS}/s/bofs/utgefid-efni`, label: t('Ársskýrslur og útgefið efni', 'Annual reports and publications') },
  gev: { href: `${IS}/s/gev`, label: t('Senda kvörtun eða ábendingu', 'Send a complaint or feedback') },
  news: { href: `${IS}/s/bofs/frett`, label: t('Allar fréttir stofnunarinnar', 'All news from the agency') },
  privacy: { href: `${IS}/s/bofs/personuverndarstefna`, label: t('Persónuverndarstefna stofnunarinnar', 'The agency’s privacy policy') },
  homes: { href: `${IS}/s/bofs/medferdarheimili`, label: t('Nánar um meðferðarheimilin', 'More about the treatment homes') },
  fosterBecome: { href: `${IS}/ad-gerast-fosturforeldri/umsoknarferli`, label: t('Sækja um að gerast fósturforeldri', 'Apply to become a foster parent') },
}

/** The official page for each service. */
export const SERVICE_ISLAND: Record<string, { href: string; label: L }> = {
  studlar: ISLAND.homes,
  esjan: ISLAND.homes,
  blonduhlid: ISLAND.homes,
  bjargey: ISLAND.homes,
  laekjarbakki: ISLAND.homes,
  barnahus: { href: `${IS}/s/bofs/barnahus`, label: t('Nánar um Barnahús', 'More about Barnahús') },
  mst: { href: `${IS}/s/bofs/mst-medferd`, label: t('Nánar um MST-meðferð', 'More about MST therapy') },
  sok: { href: `${IS}/s/bofs/sok-medferd`, label: t('Nánar um SÓK-meðferð', 'More about SÓK therapy') },
  fostur: { href: `${IS}/s/bofs/fostur`, label: t('Nánar um fóstur', 'More about foster care') },
}
