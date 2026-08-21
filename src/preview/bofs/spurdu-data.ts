/**
 * Öruggt skjól — "Spurðu" (ask): the three-audience answer router.
 *
 * THIS IS NOT A CHATBOT, and the distinction is the whole design.
 *
 * It generates nothing. It stores nothing. It never asks a follow-up
 * question. Every word a visitor can read here was written in advance and
 * traced to a source. What the code does is exactly one thing: take a
 * question typed in ordinary, panicked, misspelled Icelandic and route it to
 * the right pre-written answer for the person asking.
 *
 * Why not a generative bot, on this domain specifically:
 *
 *  1. Barnahús exists to prevent untrained questioning of children. A model
 *     asking a child follow-ups about what happened is running a leading,
 *     unrecorded pre-interview that can contaminate the account before the
 *     forensic one. The agency that operates Barnahús cannot ship that.
 *  2. Tilkynningarskylda. A disclosure typed at 03:00 would legally oblige a
 *     report. Nothing here can receive a disclosure, because nothing is kept.
 *  3. A wrong answer here is not an inconvenience. "Fá foreldrar að vita?"
 *     has exactly one true answer (yes, always) and a plausible-sounding
 *     wrong one breaks trust at the worst possible moment.
 *  4. Crisis chat already exists and is staffed by humans around the clock:
 *     netspjall 112 with dispatch authority, 1717, 800 5999, 581 1799. A
 *     fifth door with nobody behind it is a downgrade, not a feature.
 *
 * So the escalation rule is absolute: anything that reads as danger goes
 * straight to humans, and the human channels sit on screen at all times
 * rather than at the end of a funnel.
 *
 * THE POINT OF THE THREE AUDIENCES: the same question has three different
 * true answers depending on who is asking. "Fá foreldrar að vita?" answered
 * to a child, to a parent and to a teacher are genuinely different answers,
 * and no site in Iceland currently gives all three.
 *
 * FACTS: every answer below traces to a primary source, checked 10 August
 * 2026. Sources are named per group and shown on the page.
 *   - Parents are always informed a report was received; nafnleynd holds
 *     against them but never against barnavernd staff.
 *   - A position on a report is normally taken within 7 days.
 *   - A tilkynning is not a kæra: it is a request for help. (BOFS's own FAQ)
 *   - Barnahús: ordinary-looking house, Reykjavík and Akureyri, one trained
 *     specialist; from 15 the interview is at a police station.
 *   - Right to a talsmaður: bvl. nr. 80/2002, 46. gr.
 *   - Complaints go to GEV; the one year limit does not begin, for a child,
 *     until they turn 18. (lög nr. 88/2021, 17. gr.)
 *   - Decisions are appealable to úrskurðarnefnd velferðarmála within 4 weeks.
 *   - Tengiliður by life stage: lög nr. 86/2021, 17. gr.
 *
 * Copy rule, as everywhere on this site: no em or en dashes, either language.
 */

import type { L } from './data'

const t = (is: string, en: string): L => ({ is, en })

/* ── audiences ────────────────────────────────────────────────────────── */

export type Audience = 'barn' | 'foreldri' | 'fagadili'

export const AUDIENCES: { id: Audience; label: L; short: L; blurb: L }[] = [
  {
    id: 'barn',
    label: t('Ég er barn eða ungmenni', 'I am a child or a young person'),
    short: t('Barn', 'A child'),
    blurb: t('Svör á venjulegu máli, um þig og þitt', 'Answers in plain words, about you'),
  },
  {
    id: 'foreldri',
    label: t('Ég er foreldri eða aðstandandi', 'I am a parent or a relative'),
    short: t('Foreldri', 'A parent'),
    blurb: t('Um barnið þitt og hvað þú mátt', 'About your child and your rights'),
  },
  {
    id: 'fagadili',
    label: t('Ég vinn með börnum', 'I work with children'),
    short: t('Vinn með börnum', 'Work with children'),
    blurb: t('Skyldur, frestir og verklag', 'Duties, deadlines and procedure'),
  },
]

/* ── the corpus ───────────────────────────────────────────────────────── */

export interface Variant {
  /** The question as this site phrases it for this audience. */
  q: L
  /** The answer. Written once, by a human, and never rewritten at runtime. */
  a: L
}

export interface QGroup {
  id: string
  /**
   * Match stems, not words. Icelandic inflects heavily, so "tek" has to
   * catch tekið, tekur, tekin, teknir, taka. Stems are matched as
   * substrings of the normalised query and scored by their own length, so a
   * long specific stem beats a short generic one.
   */
  keys: string[]
  /** Danger. Short-circuits everything and hands straight to 112. */
  emergency?: boolean
  source?: { label: L; href: string }
  variants: Partial<Record<Audience, Variant>>
}

export const GROUPS: QGroup[] = [
  /* ── the one that must always win ──────────────────────────────────── */
  {
    id: 'neyd',
    keys: [
      'haetta', 'i haettu', 'nuna strax', 'strax', 'hraedd', 'meidd', 'meiddur',
      'bjarga', 'neyd', 'lemur', 'bardi', 'slaer', 'thori ekki heim', 'sjalfsvig',
      'deyja', 'drepa', 'flyja', 'byssa', 'hnif',
    ],
    emergency: true,
    variants: {
      barn: {
        q: t('Ég er í hættu núna', 'I am in danger right now'),
        a: t(
          'Hringdu í 112. Það er ókeypis og þú getur hringt hvenær sem er, líka um miðja nótt. Ef þú getur ekki talað er hægt að nota netspjallið á 112.is og skrifa í staðinn. Þar er alvöru manneskja á vakt allan sólarhringinn sem getur sent hjálp til þín. Þessi síða getur það ekki.',
          'Call 112. It is free and you can call at any hour, including the middle of the night. If you cannot speak, use the web chat at 112.is and write instead. A real person is on duty there around the clock and can send help to you. This page cannot.',
        ),
      },
      foreldri: {
        q: t('Barn er í hættu núna', 'A child is in danger right now'),
        a: t(
          'Hringdu í 112 strax, eða notaðu netspjallið á 112.is. Neyðarverðir eru á vakt allan sólarhringinn og geta kallað út barnavernd og lögreglu. Utan dagvinnutíma er bakvakt barnaverndar líka náð í gegnum 112.',
          'Call 112 now, or use the web chat at 112.is. Emergency operators are on duty around the clock and can call out child protection and the police. Outside office hours the child protection on-call service is also reached through 112.',
        ),
      },
      fagadili: {
        q: t('Barn er í bráðri hættu', 'A child is in acute danger'),
        a: t(
          'Tilkynntu strax í 112. Mál sem þolir ekki bið fer aldrei í gegnum vefeyðublað eða tölvupóst. Neyðarverðir kalla út barnavernd, lögreglu og aðra viðbragðsaðila eftir þörfum, líka utan dagvinnutíma.',
          'Report to 112 immediately. A case that cannot wait never goes through a web form or email. Emergency operators call out child protection, police and other responders as needed, including outside office hours.',
        ),
      },
    },
  },

  /* ── the fear questions ────────────────────────────────────────────── */
  {
    id: 'foreldrar-vita',
    keys: [
      'foreldr', 'mamma', 'pabbi', 'mamm', 'pabb', 'fa their ad vita', 'ad vita',
      'komast ad thvi', 'frett af thvi', 'leyndarmal', 'segir thu foreldrum',
    ],
    source: {
      label: t('Barnaverndarlög nr. 80/2002 og verklag barnaverndarþjónustu', 'Child Protection Act no. 80/2002 and child protection procedure'),
      href: 'https://www.althingi.is/lagas/nuna/2002080.html',
    },
    variants: {
      barn: {
        q: t('Fá mamma og pabbi að vita?', 'Will my mum and dad find out?'),
        a: t(
          'Já. Foreldrar þínir fá alltaf að vita að barnavernd hafi fengið tilkynningu. Það er ekki hægt að lofa þér að þetta verði leyndarmál, og við ætlum ekki að segja þér neitt sem er ósatt. En sá sem sagði frá má biðja um að nafnið sitt komi ekki fram, og þá fá foreldrar þínir ekki að vita hver það var.',
          'Yes. Your parents are always told that child protection has received a report. Nobody can promise you it will stay a secret, and we are not going to tell you anything untrue. But the person who spoke up can ask for their name to be withheld, and then your parents will not be told who it was.',
        ),
      },
      foreldri: {
        q: t('Fæ ég að vita ef tilkynning berst um barnið mitt?', 'Am I told if a report is made about my child?'),
        a: t(
          'Já. Foreldrum er alltaf sagt frá því að tilkynning hafi borist. Ef sá sem tilkynnti óskaði eftir nafnleynd færð þú ekki að vita hver það var. Nafnleyndin gildir gagnvart þér en aldrei gagnvart starfsfólki barnaverndar, sem veit alltaf hver tilkynnti og getur haft samband til að fá nánari upplýsingar.',
          'Yes. Parents are always told that a report has been received. If the person who reported asked for anonymity you will not be told who it was. That anonymity applies to you but never to child protection staff, who always know who reported and can contact them for more detail.',
        ),
      },
      fagadili: {
        q: t('Fá foreldrar að vita að ég tilkynnti?', 'Will the parents know that I reported?'),
        a: t(
          'Foreldrum er alltaf tilkynnt að tilkynning hafi borist. Þú þarft að gefa upp nafn og símanúmer þegar þú tilkynnir, en þú getur óskað eftir nafnleynd. Hún gildir gagnvart foreldrum, ekki gagnvart starfsfólki barnaverndar. Athugaðu að fagfólk sem starfar með börnum ber ríkari tilkynningarskyldu en almenningur.',
          'Parents are always informed that a report has been received. You must give your name and phone number when reporting, but you can request anonymity. It applies towards the parents, not towards child protection staff. Note that professionals working with children carry a stronger duty to report than the general public.',
        ),
      },
    },
  },

  {
    id: 'tekid-af-heimili',
    keys: [
      'tek', 'taka barn', 'burt af heimil', 'fara ad heiman', 'missa barn',
      'forsja', 'svipt', 'vistun', 'fosturheimili', 'sett a stofnun', 'flytja ad heiman',
    ],
    source: {
      label: t('Barnaverndarlög nr. 80/2002, IV. og V. kafli', 'Child Protection Act no. 80/2002, chapters IV and V'),
      href: 'https://www.althingi.is/lagas/nuna/2002080.html',
    },
    variants: {
      barn: {
        q: t('Þarf ég að flytja að heiman?', 'Will I have to leave home?'),
        a: t(
          'Oftast ekki. Í flestum málum er reynt að hjálpa fjölskyldunni þannig að þú getir haldið áfram að búa heima. Stundum þarf barn að búa annars staðar í smá tíma. Ef það stendur til á að segja þér frá því, útskýra af hverju, og hlusta á hvað þér finnst um það.',
          'Usually not. In most cases the aim is to help the family so that you can carry on living at home. Sometimes a child does need to live somewhere else for a while. If that is being considered, you are meant to be told, to have it explained, and to be asked what you think about it.',
        ),
      },
      foreldri: {
        q: t('Verður barnið tekið af heimilinu?', 'Will my child be taken away?'),
        a: t(
          'Í langflestum málum gerist það ekki. Tilkynning leiðir fyrst til könnunar, og markmið barnaverndar er að styðja fjölskylduna þannig að barnið geti verið heima. Vistun utan heimilis er þyngsta úrræðið sem til er. Hún krefst skýrra lagaskilyrða, henni fylgir réttur til að tjá sig áður en ákvörðun er tekin, og hana má kæra til úrskurðarnefndar velferðarmála.',
          'In the great majority of cases it does not. A report first leads to an assessment, and the aim of child protection is to support the family so the child can stay at home. Placement outside the home is the heaviest measure available. It requires specific legal grounds, it carries a right to be heard before any decision, and it can be appealed to the welfare appeals committee.',
        ),
      },
      fagadili: {
        q: t('Leiðir tilkynning til vistunar utan heimilis?', 'Does a report lead to placement outside the home?'),
        a: t(
          'Sjaldnast. Tilkynning hefur könnun máls í för með sér, ekki ráðstöfun. Vistun utan heimilis er íþyngjandi ákvörðun sem byggir á sérstökum heimildum barnaverndarlaga, kallar að jafnaði á skipun talsmanns fyrir barnið og sætir kæru til úrskurðarnefndar velferðarmála.',
          'Rarely. A report triggers an assessment of the case, not a measure. Placement outside the home is an intrusive decision resting on specific provisions of the Child Protection Act, it normally requires a spokesperson to be appointed for the child, and it is appealable to the welfare appeals committee.',
        ),
      },
    },
  },

  /* ── reporting ─────────────────────────────────────────────────────── */
  {
    id: 'hvad-gerist-eftir',
    keys: [
      'hvad gerist', 'gerist svo', 'gerist naest', 'eftir tilkynningu', 'ferlid',
      'hvad tekur vid', 'hvad thydir thetta', 'hvad nu', 'hversu langan tima',
    ],
    source: {
      label: t('Barnaverndarlög nr. 80/2002, 21. gr.', 'Child Protection Act no. 80/2002, art. 21'),
      href: 'https://www.althingi.is/lagas/nuna/2002080.html',
    },
    variants: {
      barn: {
        q: t('Hvað gerist eftir að einhver segir frá?', 'What happens after someone speaks up?'),
        a: t(
          'Barnavernd les það sem kom fram og ákveður hvort þurfi að skoða málið betur. Þau taka yfirleitt afstöðu innan viku. Ef þau ákveða að skoða það tala þau við foreldra þína og oft við þig líka. Þú mátt segja þína skoðun og það á að hlusta á hana.',
          'Child protection reads what came in and decides whether the case needs to be looked at more closely. They usually decide within about a week. If they do look into it they speak to your parents, and often to you as well. You are allowed to say what you think and they are meant to listen.',
        ),
      },
      foreldri: {
        q: t('Hvað gerist eftir að tilkynning berst?', 'What happens after a report comes in?'),
        a: t(
          'Barnaverndarþjónustan metur upplýsingarnar og tekur afstöðu til þess hvort hefja eigi könnun. Að jafnaði er sú afstaða tekin innan sjö daga. Sé könnun hafin er rætt við foreldra og barn, aflað upplýsinga og metið hvaða stuðningur á við. Þér er tilkynnt um málið og þú átt rétt á að tjá þig áður en ákvörðun er tekin.',
          'The child protection service assesses the information and decides whether to open an inquiry. As a rule that position is taken within seven days. If an inquiry is opened, the parents and the child are spoken to, information is gathered, and it is assessed what support is appropriate. You are informed about the case and you have the right to be heard before any decision is taken.',
        ),
      },
      fagadili: {
        q: t('Hvað verður um tilkynninguna mína?', 'What becomes of the report I made?'),
        a: t(
          'Barnaverndarþjónusta í lögheimilissveitarfélagi barnsins tekur við tilkynningunni og tekur að jafnaði afstöðu innan sjö daga um hvort hefja skuli könnun. Vegna trúnaðar við fjölskylduna færð þú ekki að fylgjast með framvindu málsins. Það er ekki merki um aðgerðaleysi. Tilkynntu aftur ef aðstæður breytast eða ástandið er óbreytt.',
          'The child protection service in the municipality where the child is registered receives the report and as a rule decides within seven days whether to open an inquiry. Because of confidentiality towards the family you will not be kept updated on the case. That is not a sign that nothing is happening. Report again if circumstances change or the situation is unchanged.',
        ),
      },
    },
  },

  {
    id: 'ekki-viss',
    keys: [
      'ekki viss', 'oviss', 'kannski', 'grunar', 'held ad', 'veit ekki hvort',
      'nogu alvarlegt', 'er thetta nogu', 'a eg ad tilkynna', 'ma eg tilkynna',
    ],
    source: {
      label: t('112.is, tilkynningar til barnaverndar', '112.is, reporting to child protection'),
      href: 'https://www.112.is/resources/barnavernd',
    },
    variants: {
      barn: {
        q: t('Ég veit ekki hvort þetta er nógu alvarlegt', 'I do not know if this is serious enough'),
        a: t(
          'Þú þarft ekki að vera viss og þú þarft ekki að geta útskýrt það vel. Það er nóg að þér líði illa eða finnist eitthvað rangt. Fullorðna fólkið á að meta alvarleikann, ekki þú.',
          'You do not have to be sure and you do not have to be able to explain it well. It is enough that you feel bad or that something feels wrong. Working out how serious it is, is the adults’ job, not yours.',
        ),
      },
      foreldri: {
        q: t('Ég er ekki viss, á ég samt að hafa samband?', 'I am not certain, should I still get in touch?'),
        a: t(
          'Já. Þú þarft ekki að vera viss og það er ekki þitt hlutverk að rannsaka málið. Börn eiga alltaf að njóta vafans. Þú getur líka hringt í barnaverndarþjónustuna þína og fengið ráðgjöf án þess að tilkynna formlega.',
          'Yes. You do not have to be certain and it is not your job to investigate. Children should always be given the benefit of the doubt. You can also call your local child protection service for advice without making a formal report.',
        ),
      },
      fagadili: {
        q: t('Er grunurinn nógu sterkur til að tilkynna?', 'Is the suspicion strong enough to report?'),
        a: t(
          'Tilkynningarskyldan miðast við ástæðu til að ætla, ekki við vissu, og þér ber að tilkynna þótt þú sért ekki viss. Það er hlutverk barnaverndar að meta málið, ekki þitt að sannreyna það fyrst. Barnahús og ráðgjafar Barna- og fjölskyldustofu veita fagfólki ráðgjöf um vafatilvik.',
          'The duty to report is triggered by having reason to believe, not by certainty, and you must report even when you are not sure. Assessing the case is child protection’s job, not yours to verify first. Barnahús and the agency’s advisers give professionals guidance on borderline cases.',
        ),
      },
    },
  },

  {
    id: 'tilkynning-kaera',
    keys: ['kaera', 'asokun', 'saka', 'er thetta kaera', 'logregl', 'refsing', 'saekja til saka'],
    source: {
      label: t('Spurt og svarað, Barna- og fjölskyldustofa', 'FAQ, National Agency for Children and Families'),
      href: 'https://island.is/s/bofs/spurt-og-svarad-um-barna-og-fjoelskyldustofu',
    },
    variants: {
      foreldri: {
        q: t('Er tilkynning til barnaverndar kæra?', 'Is a report to child protection an accusation?'),
        a: t(
          'Nei. Tilkynning til barnaverndar er ekki kæra heldur beiðni um aðstoð fyrir barn og fjölskyldu sem tilkynnandi telur að þurfi hjálp. Hún fer ekki í sakaskrá og hún er ekki lögreglumál í sjálfu sér. Að fá aðstoð frá barnavernd þýðir ekki að þú hafir brugðist barninu þínu.',
          'No. A report to child protection is not a criminal complaint but a request for help for a child and family the reporter believes needs it. It does not go on a criminal record and it is not in itself a police matter. Getting help from child protection does not mean you have failed your child.',
        ),
      },
      fagadili: {
        q: t('Er tilkynning það sama og kæra til lögreglu?', 'Is a report the same as a police complaint?'),
        a: t(
          'Nei. Tilkynning er beiðni um aðstoð samkvæmt barnaverndarlögum, ekki refsimál. Barnavernd metur sjálf hvort tilefni sé til að vísa máli til lögreglu. Þú þarft ekki að taka þá ákvörðun og þú átt ekki að rannsaka málið sjálf eða sjálfur.',
          'No. A report is a request for assistance under the Child Protection Act, not a criminal matter. Child protection itself assesses whether there is cause to refer a case to the police. You do not have to make that call and you should not investigate the matter yourself.',
        ),
      },
    },
  },

  {
    id: 'nafnleynd',
    keys: ['nafnleynd', 'nafnlaus', 'leynd', 'hver tilkynnti', 'nafnid mitt', 'anonym'],
    variants: {
      foreldri: {
        q: t('Get ég tilkynnt nafnlaust?', 'Can I report anonymously?'),
        a: t(
          'Þú þarft að gefa upp nafn og símanúmer svo barnavernd geti haft samband ef þarf nánari upplýsingar, en þú getur óskað eftir nafnleynd. Þá fá foreldrarnir sem tilkynnt er um ekki að vita hver tilkynnti. Starfsfólk barnaverndar veit það alltaf og er bundið trúnaði.',
          'You must give your name and phone number so child protection can get in touch if more detail is needed, but you can request anonymity. The parents being reported about will then not be told who reported. Child protection staff always know, and are bound by confidentiality.',
        ),
      },
      fagadili: {
        q: t('Á ég rétt á nafnleynd sem fagaðili?', 'As a professional, can I have anonymity?'),
        a: t(
          'Þú gefur upp nafn við tilkynningu og getur óskað eftir nafnleynd gagnvart foreldrum. Í reynd er fagaðili þó oft auðþekkjanlegur af samhenginu. Mundu að tilkynning er lagaskylda og að skyldan hvílir á þér persónulega, ekki á stofnuninni sem þú vinnur hjá.',
          'You give your name when reporting and can request anonymity towards the parents. In practice a professional is often identifiable from the context anyway. Remember that reporting is a legal duty, and that the duty rests on you personally, not on the institution you work for.',
        ),
      },
    },
  },

  /* ── Barnahús ──────────────────────────────────────────────────────── */
  {
    id: 'barnahus-hvad',
    keys: ['barnahus', 'hvernig er husid', 'skyrslutaka', 'vidtal', 'skyrsla', 'hvernig litur'],
    source: {
      label: t('112.is, skýrslutaka í Barnahúsi', '112.is, interviews at Barnahús'),
      href: 'https://www.112.is/skyrslutaka-barnahusi-heimilisofbeldi',
    },
    variants: {
      barn: {
        q: t('Hvað er Barnahús og hvernig er þar?', 'What is Barnahús and what is it like?'),
        a: t(
          'Barnahús lítur út eins og venjulegt hús, ekki eins og skrifstofa eða spítali. Húsin eru tvö, í Reykjavík og á Akureyri. Þar talar ein manneskja við þig, og það er hennar eina starf að tala við börn og ungmenni um það sem hefur gerst. Þú mátt taka pásu og þú ræður hvað þú segir.',
          'Barnahús looks like an ordinary house, not like an office or a hospital. There are two of them, in Reykjavík and Akureyri. One person talks with you there, and talking with children and young people about what has happened is that person’s only job. You can take a break and you decide what you say.',
        ),
      },
      foreldri: {
        q: t('Hvað gerist í Barnahúsi?', 'What happens at Barnahús?'),
        a: t(
          'Barnahús sinnir málum barna þar sem grunur er um kynferðisofbeldi, líkamlegt ofbeldi eða heimilisofbeldi. Þar fer skýrslutaka fram hjá sérfræðingi sem er þjálfaður í að tala við börn, í húsi sem er hannað til að vera ekki ógnvekjandi. Tilgangurinn er að barnið þurfi ekki að segja söguna aftur og aftur á mörgum stöðum. Barnaverndarþjónusta vísar málum þangað.',
          'Barnahús handles cases where there is suspicion of sexual abuse, physical abuse or domestic violence. The interview is conducted by a specialist trained to talk with children, in a house designed not to be frightening. The purpose is that the child should not have to tell the story over and over in several places. Cases are referred there by the child protection service.',
        ),
      },
      fagadili: {
        q: t('Hvernig kemst mál í Barnahús?', 'How does a case get to Barnahús?'),
        a: t(
          'Barnaverndarþjónustur bera ábyrgð á vinnslu málanna og óska eftir þjónustu Barnahúss. Barnahús veitir einnig fagfólki ráðgjöf í síma 530 2500 vegna gruns um ofbeldi, og heldur fyrirlestra og fræðslu. Frá 15 ára aldri fer skýrslutaka fram á lögreglustöð í stað Barnahúss.',
          'Child protection services are responsible for handling the cases and request Barnahús’s services. Barnahús also advises professionals by phone on 530 2500 where abuse is suspected, and provides lectures and training. From the age of 15 the interview takes place at a police station rather than at Barnahús.',
        ),
      },
    },
  },

  {
    id: 'domstoll',
    keys: ['domar', 'domstol', 'domsal', 'bera vitni', 'vitni', 'fyrir rett', 'rettarhold'],
    source: {
      label: t('112.is, skýrslutaka í Barnahúsi', '112.is, interviews at Barnahús'),
      href: 'https://www.112.is/skyrslutaka-barnahusi-heimilisofbeldi',
    },
    variants: {
      barn: {
        q: t('Þarf ég að fara fyrir dómara?', 'Will I have to go in front of a judge?'),
        a: t(
          'Oftast ekki. Yfirleitt er talað við þig einu sinni í Barnahúsi og það dugar. Ef þú ert orðin eða orðinn 15 ára áður en málið fer fyrir dóm getur verið að þú þurfir að mæta. Þá færð þú réttargæslumann, sem er lögfræðingur sem er þarna fyrir þig, og einhvern frá barnavernd með þér.',
          'Usually not. Normally you are spoken to once at Barnahús and that is enough. If you have turned 15 before the case goes to court you may have to attend. If so you get a legal advocate, a lawyer who is there for you, and someone from child protection with you.',
        ),
      },
      foreldri: {
        q: t('Þarf barnið að bera vitni fyrir dómi?', 'Will my child have to testify in court?'),
        a: t(
          'Í flestum tilvikum ekki. Skýrslutakan í Barnahúsi er einmitt til þess gerð að barnið þurfi ekki að endurtaka frásögnina. Nái barnið 15 ára aldri áður en mál fer fyrir dóm getur þó þurft að það mæti í dómsal. Barninu fylgir þá réttargæslumaður og fulltrúi frá barnavernd.',
          'In most cases, no. The interview at Barnahús exists precisely so that the child does not have to repeat the account. If the child turns 15 before the case reaches court, attendance in the courtroom may be required. The child is then accompanied by a legal advocate and a representative from child protection.',
        ),
      },
    },
  },

  /* ── rights ────────────────────────────────────────────────────────── */
  {
    id: 'talsmadur',
    keys: ['talsmad', 'talsmann', 'malsvari', 'einhver fyrir mig', 'minn fulltrui', 'logmadur'],
    source: {
      label: t('Barnaverndarlög nr. 80/2002, 46. gr.', 'Child Protection Act no. 80/2002, art. 46'),
      href: 'https://www.althingi.is/lagas/nuna/2002080.html',
    },
    variants: {
      barn: {
        q: t('Má ég fá einhvern sem talar fyrir mig?', 'Can I have someone who speaks for me?'),
        a: t(
          'Já. Þú átt rétt á talsmanni. Það er manneskja sem er þarna fyrir þig einan eða eina, ræðir við þig og kemur skoðunum þínum á framfæri. Talsmaðurinn vinnur ekki fyrir foreldra þína og ekki fyrir barnavernd. Þú mátt biðja um talsmann og segja hvern þú vilt helst.',
          'Yes. You have a right to a spokesperson. That is a person who is there for you alone, talks with you and puts your views across. The spokesperson does not work for your parents and does not work for child protection. You may ask for one and say who you would prefer.',
        ),
      },
      foreldri: {
        q: t('Fær barnið sinn eigin fulltrúa?', 'Does my child get their own representative?'),
        a: t(
          'Barn á rétt á talsmanni. Þegar barnaverndarþjónusta ákveður að hefja könnun máls ber henni að taka afstöðu til þess hvort skipa eigi barninu talsmann, og að jafnaði skal það gert áður en gripið er til íþyngjandi ráðstafana. Hlutverk talsmanns er að ræða við barnið og koma sjónarmiðum þess á framfæri, óháð sjónarmiðum foreldra og barnaverndar.',
          'A child has a right to a spokesperson. When the child protection service decides to open an inquiry it must consider whether to appoint one, and as a rule this is done before any intrusive measure is taken. The spokesperson’s role is to talk with the child and convey the child’s views, independently of the views of the parents and of child protection.',
        ),
      },
      fagadili: {
        q: t('Hvenær ber að skipa barni talsmann?', 'When must a spokesperson be appointed?'),
        a: t(
          'Við ákvörðun um að hefja könnun skal taka afstöðu til þess hvort þörf sé á talsmanni, og að jafnaði skal skipa barni talsmann áður en gripið er til ráðstafana skv. 25., 27. eða 28. gr. og áður en krafa um forsjársviptingu er sett fram, nema barn njóti aðstoðar lögmanns. Talsmaður má ekki vera starfsmaður þeirrar einingar sem fer með málið.',
          'On deciding to open an inquiry, the need for a spokesperson must be considered, and as a rule one shall be appointed before measures under articles 25, 27 or 28 and before a custody deprivation claim is filed, unless the child has legal counsel. The spokesperson may not be a member of staff of the unit handling the case.',
        ),
      },
    },
  },

  {
    id: 'kvortun',
    keys: ['kvarta', 'kvortun', 'osatt', 'osaett', 'klaga', 'gev', 'eftirlit', 'illa medhondl', 'kvortunarleid'],
    source: {
      label: t('Kvörtun vegna velferðarþjónustu, GEV, lög nr. 88/2021', 'Complaints about welfare services, GEV, Act no. 88/2021'),
      href: 'https://island.is/kvortun-vegna-velferdarthjonustu',
    },
    variants: {
      barn: {
        q: t('Hvað ef mér finnst komið illa fram við mig?', 'What if I feel I was treated badly?'),
        a: t(
          'Þú mátt kvarta. Gæða- og eftirlitsstofnun velferðarmála tekur við kvörtunum um þjónustuna, líka frá börnum sjálfum. Og það er eitt sem fáir vita: fyrir barn byrjar eins árs fresturinn til að kvarta ekki að líða fyrr en þú verður 18 ára. Þú mátt sem sagt kvarta seinna, þegar þú ert tilbúin eða tilbúinn.',
          'You are allowed to complain. The Quality and Oversight Agency for Welfare Services receives complaints about the service, including from children themselves. And here is something few people know: for a child, the one year deadline to complain does not begin to run until you turn 18. So you can complain later, when you are ready.',
        ),
      },
      foreldri: {
        q: t('Hvernig kvarta ég yfir þjónustunni?', 'How do I complain about the service?'),
        a: t(
          'Kvartanir yfir gæðum barnaverndarþjónustu fara til Gæða- og eftirlitsstofnunar velferðarmála, GEV, í gegnum island.is. Kvörtun þarf að berast innan árs frá atvikinu, en varði hún þjónustu við barn byrjar sá frestur ekki að líða fyrr en barnið verður 18 ára. GEV getur ekki breytt ákvörðun í einstöku máli, það gerir úrskurðarnefnd velferðarmála.',
          'Complaints about the quality of child protection services go to the Quality and Oversight Agency for Welfare Services, GEV, via island.is. A complaint must arrive within a year of the events, but where it concerns a service provided to a child that period does not begin until the child turns 18. GEV cannot overturn a decision in an individual case; that is the welfare appeals committee.',
        ),
      },
      fagadili: {
        q: t('Hvert fara kvartanir yfir þjónustunni?', 'Where do complaints about the service go?'),
        a: t(
          'Til Gæða- og eftirlitsstofnunar velferðarmála, sbr. 17. gr. laga nr. 88/2021. Aðeins notandi þjónustunnar getur kvartað; aðrir, þar á meðal fagfólk og aðstandendur, geta komið á framfæri ábendingu. GEV grípur ekki inn í einstök mál og tekur ekki við kvörtunum um málsmeðferð sem lauk með kæranlegri ákvörðun.',
          'To the Quality and Oversight Agency for Welfare Services, under article 17 of Act no. 88/2021. Only the service user can complain; others, including professionals and relatives, can submit a notification. GEV does not intervene in individual cases and does not take complaints about proceedings that ended in an appealable decision.',
        ),
      },
    },
  },

  {
    id: 'kaera-akvordun',
    keys: ['kaera akvordun', 'urskurd', 'urskurdarnefnd', 'afryja', 'ovilja una', 'fjorar vikur', 'ahrifa akvordun'],
    source: {
      label: t('Úrskurðarnefnd velferðarmála', 'The welfare appeals committee'),
      href: 'https://www.urvel.is/malaflokkar/barnavernd/',
    },
    variants: {
      foreldri: {
        q: t('Get ég kært ákvörðun barnaverndar?', 'Can I appeal a child protection decision?'),
        a: t(
          'Já. Úrskurði og öðrum stjórnvaldsákvörðunum barnaverndarþjónustu, umdæmisráða barnaverndar og Barna- og fjölskyldustofu má skjóta til úrskurðarnefndar velferðarmála. Kærufrestur er fjórar vikur frá því að þér var tilkynnt um ákvörðunina. Þú átt líka rétt á að tjá þig, með aðstoð lögmanns ef þú vilt, áður en úrskurður er kveðinn upp.',
          'Yes. Rulings and other administrative decisions by child protection services, district child protection boards and the agency can be appealed to the welfare appeals committee. The deadline is four weeks from when you were notified of the decision. You also have the right to be heard, with the assistance of a lawyer if you wish, before a ruling is made.',
        ),
      },
      fagadili: {
        q: t('Hvaða ákvarðanir eru kæranlegar?', 'Which decisions can be appealed?'),
        a: t(
          'Úrskurðir og aðrar stjórnvaldsákvarðanir barnaverndarþjónustu, umdæmisráða barnaverndar og Barna- og fjölskyldustofu sæta kæru til úrskurðarnefndar velferðarmála, eftir því sem barnaverndarlög kveða á um. Kærufrestur er fjórar vikur frá tilkynningu ákvörðunar.',
          'Rulings and other administrative decisions by child protection services, district child protection boards and the agency are appealable to the welfare appeals committee, as provided in the Child Protection Act. The deadline is four weeks from notification of the decision.',
        ),
      },
    },
  },

  /* ── where do I go ─────────────────────────────────────────────────── */
  {
    id: 'hver-barnavernd',
    keys: ['hvada barnavernd', 'hvert a eg ad snua', 'hvert tilkynni eg', 'sveitarfelag', 'minn stad', 'hvar er barnavernd'],
    source: {
      label: t('Barnavernd eftir sveitarfélögum', 'Child protection services by municipality'),
      href: 'https://island.is/s/bofs/barnavernd-eftir-sveitarfeloegum',
    },
    variants: {
      foreldri: {
        q: t('Hvaða barnaverndarþjónusta á við mig?', 'Which child protection service covers me?'),
        a: t(
          'Sú sem starfar í sveitarfélaginu þar sem barnið á lögheimili. Mörg sveitarfélög reka barnaverndarþjónustu sameiginlega, því að baki hverri þjónustu skulu vera minnst 6.000 íbúar, svo þjónustan þín getur heitið annað en sveitarfélagið þitt. Listi yfir öll sveitarfélög og þjónustuna sem á við er á vef Barna- og fjölskyldustofu.',
          'The one operating in the municipality where the child is registered. Many municipalities run a joint service, since each service must cover at least 6,000 residents, so yours may be named after somewhere other than your own municipality. A list of every municipality and the service that applies is on the agency’s website.',
        ),
      },
      fagadili: {
        q: t('Hvert á ég að beina tilkynningu?', 'Where do I direct a report?'),
        a: t(
          'Til barnaverndarþjónustu í því sveitarfélagi þar sem barnið á lögheimili. Á dagvinnutíma tekur starfsfólk þjónustunnar við tilkynningum; utan dagvinnutíma, um helgar og á helgidögum næst í bakvakt vegna bráðatilvika í síma 112. Mörg sveitarfélög taka einnig við tilkynningum gegnum vef.',
          'To the child protection service in the municipality where the child is registered. During office hours the service’s staff receive reports; outside office hours, at weekends and on public holidays the on-call service for urgent cases is reached on 112. Many municipalities also accept reports through their website.',
        ),
      },
    },
  },

  {
    id: 'tengilidur',
    keys: ['tengilid', 'farsaeld', 'samthaetting', 'malstjor', 'stodningur i skola', 'hver hjalpar okkur'],
    source: {
      label: t('Lög um samþættingu þjónustu í þágu farsældar barna nr. 86/2021, 17. gr.', 'Act no. 86/2021 on integrated services for children’s wellbeing, art. 17'),
      href: 'https://www.althingi.is/lagas/nuna/2021086.html',
    },
    variants: {
      foreldri: {
        q: t('Hver er tengiliður barnsins míns?', 'Who is my child’s connector?'),
        a: t(
          'Það fer eftir aldri barnsins, og öll börn og foreldrar eiga rétt á tengilið. Á meðgöngu og þar til barn byrjar í leikskóla eða grunnskóla er tengiliðurinn starfsmaður heilsugæslunnar. Þegar barn er í leik-, grunn- eða framhaldsskóla er það starfsmaður skólans sjálfs. Eigi hvorugt við er það starfsmaður félagsþjónustu sveitarfélagsins. Þú mátt leita beint til tengiliðar án milligöngu.',
          'It depends on the child’s age, and every child and parent is entitled to one. During pregnancy and until the child starts preschool or primary school it is a member of staff at the health clinic. While the child is in preschool, primary or secondary school it is a member of staff at the school itself. If neither applies it is a member of staff at the municipal social service. You may approach the connector directly.',
        ),
      },
      fagadili: {
        q: t('Hver gegnir hlutverki tengiliðar?', 'Who acts as the connector?'),
        a: t(
          'Starfsmaður heilsugæslu eða heilbrigðisstofnunar frá meðgöngu fram að skólagöngu, starfsmaður skólans meðan barn er í leik-, grunn- eða framhaldsskóla, annars starfsmaður félagsþjónustu lögheimilissveitarfélags. Tengiliður skal hafa sótt fræðslu hjá Barna- og fjölskyldustofu og uppfylla hæfisskilyrði reglugerðar nr. 1180/2022. Þegar aðstæður barns breytast ber fyrri tengilið að tryggja að nýr fái nauðsynlegar upplýsingar.',
          'A member of staff at a health clinic or health institution from pregnancy until schooling begins, a member of staff at the school while the child is in preschool, primary or secondary education, otherwise a member of staff at the social service of the municipality of registration. The connector must have taken the agency’s training and meet the requirements of regulation no. 1180/2022. When a child’s circumstances change, the previous connector must ensure the new one receives the necessary information.',
        ),
      },
    },
  },

  {
    id: 'bid',
    keys: ['bid', 'bidlist', 'bidtim', 'hvad lengi', 'tharf ad bida', 'hversu long bid'],
    source: {
      label: t('Bið eftir þjónustu, tölur birtar af umboðsmanni barna', 'Waiting times, figures published by the Ombudsman for Children'),
      href: 'https://www.barn.is/barnasattmalinn/bid-eftir-thjonustu/',
    },
    variants: {
      foreldri: {
        q: t('Hvað þarf að bíða lengi eftir þjónustu?', 'How long is the wait for services?'),
        a: t(
          'Það fer eftir úrræðinu og talan er birt opinberlega. Í meðferðarúrræðum Barna- og fjölskyldustofu hefur biðin oftast verið stutt eða engin, en bið eftir meðferð á vegum Barnahúss hefur verið margir mánuðir. Nýjustu tölurnar eru birtar reglulega og við segjum þær eins og þær eru, líka þegar þær eru óþægilegar.',
          'It depends on the service, and the figure is published openly. For the agency’s treatment services the wait has usually been short or none, while the wait for therapy through Barnahús has run to several months. The latest figures are published regularly and we state them as they are, including when they are uncomfortable.',
        ),
      },
      fagadili: {
        q: t('Hvar sé ég stöðuna á biðlistum?', 'Where can I see current waiting lists?'),
        a: t(
          'Tölur um fjölda barna á bið, meðalbiðtíma og fjölda sem hefur beðið lengur en þrjá mánuði eru teknar saman reglulega fyrir meðferðarúrræði stofunnar og fyrir Barnahús, og eru birtar opinberlega. Þær eru sundurliðaðar eftir úrræði.',
          'Figures for the number of children waiting, average waiting time and the number who have waited longer than three months are compiled regularly for the agency’s treatment services and for Barnahús, and are published openly. They are broken down by service.',
        ),
      },
    },
  },
]

/* ── matching ─────────────────────────────────────────────────────────── */

/**
 * Fold Icelandic to a plain-ASCII skeleton so that a question typed without
 * accents, or with the wrong ones, still matches. NFD strips the combining
 * accents off á é í ó ú ý ö; ð, þ and æ have no decomposition and are mapped
 * by hand.
 */
export function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ð/g, 'd')
    .replace(/þ/g, 'th')
    .replace(/æ/g, 'ae')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export interface Hit {
  group: QGroup
  variant: Variant
  score: number
}

/**
 * Rank the corpus against a typed question, for one audience.
 *
 * Deterministic and local: a stem contributes its own length, so a specific
 * stem such as "urskurdarnefnd" outweighs a generic one such as "tek", and
 * words the visitor typed that also appear in our own phrasing of the
 * question add a smaller amount. Nothing is sent anywhere and nothing about
 * the query is retained after the keystroke.
 */
export function search(query: string, audience: Audience): Hit[] {
  const q = normalise(query)
  if (!q) return []
  const words = q.split(' ').filter((w) => w.length > 2)

  const hits: Hit[] = []
  for (const group of GROUPS) {
    const variant = group.variants[audience]
    if (!variant) continue

    let score = 0
    for (const key of group.keys) {
      if (q.includes(key)) score += key.length * 2
    }
    const own = normalise(variant.q.is) + ' ' + normalise(variant.q.en)
    for (const w of words) {
      if (own.includes(w)) score += w.length
    }

    // Danger outranks everything else that could plausibly match.
    if (score > 0 && group.emergency) score += 500
    if (score > 0) hits.push({ group, variant, score })
  }

  return hits.sort((a, b) => b.score - a.score)
}

/** The questions offered before anything is typed, in this order. */
const SUGGESTED: Record<Audience, string[]> = {
  barn: ['foreldrar-vita', 'tekid-af-heimili', 'barnahus-hvad', 'domstoll', 'talsmadur', 'ekki-viss'],
  foreldri: ['tekid-af-heimili', 'hvad-gerist-eftir', 'foreldrar-vita', 'tilkynning-kaera', 'kaera-akvordun', 'tengilidur'],
  fagadili: ['ekki-viss', 'hvad-gerist-eftir', 'foreldrar-vita', 'talsmadur', 'hver-barnavernd', 'barnahus-hvad'],
}

export function suggestionsFor(audience: Audience): Hit[] {
  return SUGGESTED[audience]
    .map((id) => {
      const group = GROUPS.find((g) => g.id === id)
      const variant = group?.variants[audience]
      return group && variant ? { group, variant, score: 0 } : null
    })
    .filter((h): h is Hit => h !== null)
}

/** Which other audiences have an answer to the same question. */
export function otherAudiences(group: QGroup, current: Audience): Audience[] {
  return AUDIENCES.map((a) => a.id).filter((a) => a !== current && Boolean(group.variants[a]))
}

/* ── the standing human channels ──────────────────────────────────────── */

/*
 * These are on screen at every step, not at the end of a funnel. Each one is
 * staffed by a person; none of them is us. 112 is listed first because it is
 * the only one that can send help.
 */
export const CHANNELS: { name: L; value: string; href: string; blurb: L; urgent?: boolean }[] = [
  {
    name: t('Neyðarlínan', 'Emergency line'),
    value: '112',
    href: 'tel:112',
    blurb: t('Sími og netspjall, allan sólarhringinn. Getur sent hjálp.', 'Phone and web chat, around the clock. Can send help.'),
    urgent: true,
  },
  {
    name: t('Hjálparsími Rauða krossins', 'Red Cross helpline'),
    value: '1717',
    href: 'tel:1717',
    blurb: t('Nafnlaust og ókeypis, allan sólarhringinn', 'Anonymous and free, around the clock'),
  },
  {
    name: t('Barnasíminn hjá umboðsmanni barna', 'Children’s line, Ombudsman for Children'),
    value: '800 5999',
    href: 'tel:8005999',
    blurb: t('Ókeypis fyrir börn og ungmenni', 'Free for children and young people'),
  },
  {
    name: t('Barna- og fjölskyldustofa', 'National Agency for Children and Families'),
    value: '530 2600',
    href: 'tel:5302600',
    blurb: t('Virka daga 9:00 til 12:00 og 12:30 til 15:00', 'Weekdays 9:00 to 12:00 and 12:30 to 15:00'),
  },
]

/* ── deep links ───────────────────────────────────────────────────────── */

/*
 * A shareable answer is `#svar-<audience>-<id>`, e.g. #svar-foreldri-tekid-af-heimili.
 * The form is deliberately a VALID CSS id selector: the app's shared
 * ScrollToTop does `document.querySelector(hash)`, which throws on anything
 * that is not, and an invalid hash would take the whole page down.
 *
 * The hash carries a topic and never the visitor's own words, and it is
 * written ONLY when someone deliberately presses copy. Reading an answer
 * never touches the URL. The sentence a frightened parent types is the worst
 * sentence of their life, and it does not belong in browser history, in a
 * server log, or in whatever they paste the link into afterwards.
 */
export function hashFor(audience: Audience, id: string): string {
  return `#svar-${audience}-${id}`
}

export function parseHash(hash: string): { audience: Audience; id: string } | null {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw.startsWith('svar-')) return null
  const rest = raw.slice('svar-'.length)
  /* Audience first, longest-prefix style, because group ids contain hyphens
     too and a regex split on the first hyphen would be ambiguous. */
  for (const a of AUDIENCES) {
    const prefix = `${a.id}-`
    if (!rest.startsWith(prefix)) continue
    const id = rest.slice(prefix.length)
    const group = GROUPS.find((g) => g.id === id)
    if (group && group.variants[a.id]) return { audience: a.id, id: group.id }
  }
  return null
}

/* ── page copy ────────────────────────────────────────────────────────── */

export const SPURDU = {
  eyebrow: t('Spurðu', 'Ask'),
  title: t('Spurðu eins og þú talar', 'Ask in your own words'),
  lead: t(
    'Þú þarft ekki að vita hvað hlutirnir heita. Skrifaðu spurninguna eins og hún kemur, og við sýnum þér svarið sem á við þig.',
    'You do not need to know what any of it is called. Write the question the way it comes to you, and we will show you the answer that applies to you.',
  ),
  step1: t('Fyrst, hver ert þú?', 'First, who are you?'),
  step1Note: t(
    'Sama spurning hefur ekki sama svar fyrir alla. Þess vegna spyrjum við.',
    'The same question does not have the same answer for everyone. That is why we ask.',
  ),
  step2: t('Hvað viltu vita?', 'What do you want to know?'),
  inputLabel: t('Skrifaðu spurninguna þína', 'Type your question'),
  placeholder: t('Til dæmis: fá foreldrar mínir að vita?', 'For example: will my parents find out?'),
  common: t('Algengar spurningar', 'Common questions'),
  results: (n: number): L =>
    t(n === 1 ? '1 svar passar' : `${n} svör passa`, n === 1 ? '1 answer matches' : `${n} answers match`),
  noMatch: t('Við eigum ekki skrifað svar við þessu', 'We do not have a written answer for that'),
  noMatchBody: t(
    'Frekar en að giska bendum við þér á manneskju. Hringdu eða skrifaðu á einhvern staðinn hér fyrir neðan, eða prófaðu að orða spurninguna öðruvísi.',
    'Rather than guess, we point you to a person. Call or write to one of the places below, or try wording the question differently.',
  ),
  clear: t('Hreinsa', 'Clear'),
  sourceLabel: t('Heimild', 'Source'),
  alsoFor: t('Sama spurning, annað svar:', 'Same question, different answer:'),
  changeAudience: t('Breyta', 'Change'),
  channelsTitle: t('Manneskja, ekki síða', 'A person, not a page'),
  channelsLead: t(
    'Þessi listi hverfur aldrei af skjánum. Ef þú vilt frekar tala við einhvern þarftu ekki að finna hann.',
    'This list never leaves the screen. If you would rather talk to someone, you should not have to go looking.',
  ),
  exit: t('Loka síðunni', 'Hide this page'),
  exitNote: t(
    'Fer strax á veðurspána og skilur ekki eftir slóð í vafraferlinum.',
    'Goes straight to the weather forecast and leaves no trace in your browser history.',
  ),
  honestTitle: t('Þetta er ekki spjallmenni', 'This is not a chatbot'),
  honestBody: t(
    'Það er engin gervigreind hér. Síðan býr ekki til svör, hún finnur svör sem starfsfólk skrifaði fyrir fram og merkti heimild við. Hún geymir ekki það sem þú skrifar, sendir það ekki neitt og spyr þig aldrei að neinu á móti. Börn eiga ekki að segja vél frá ofbeldi: fyrsta samtalið á að vera við manneskju sem kann að taka við því.',
    'There is no artificial intelligence here. The page does not generate answers, it finds answers that staff wrote in advance and attached a source to. It does not keep what you type, does not send it anywhere, and never asks you anything back. Children should not disclose abuse to a machine: the first conversation should be with a person trained to receive it.',
  ),
  carried: t('Spurningin þín:', 'Your question:')
  ,
  indexEyebrow: t('Spurningar og svör', 'Questions and answers'),
  indexTitle: t('Það sem fólk spyr okkur að', 'What people ask us'),
  indexTitleCompact: t('Fleiri spurningar', 'More questions'),
  indexFilter: t('Hver spyr', 'Who is asking'),
  indexAll: t('Sjá allar spurningar og svör', 'See all questions and answers'),
  copy: t('Afrita hlekk á þetta svar', 'Copy a link to this answer'),
  copied: t('Hlekkur afritaður', 'Link copied'),
  askHere: t('Spurðu eins og þú talar', 'Ask in your own words'),
  askLead: t(
    'Þú þarft ekki að vita í hvaða flokki spurningin þín er. Skrifaðu hana bara.',
    'You do not need to know which section your question belongs to. Just write it.',
  ),
  askInlineTitle: t('Svaraði þessi síða þér ekki?', 'Did this page not answer you?'),
  askInlineLead: t(
    'Skrifaðu spurninguna með þínum orðum og við finnum svarið sem á við þig.',
    'Write the question in your own words and we will find the answer that applies to you.',
  ),
  askSubmit: t('Finna svar', 'Find an answer'),
  honestSecond: t(
    'Þegar svarið er óþægilegt stendur það samt. Sá sem lofar barni því sem hann getur ekki staðið við gerir illt verra.',
    'Where the answer is unwelcome, it still stands. Promising a child something you cannot deliver makes things worse, not better.',
  ),
}
