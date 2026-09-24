/**
 * The written content that is not a project: services, process, questions.
 *
 * The FAQ exists for two audiences at once. A person scanning for "does she
 * do small jobs" reads it on the page; an assistant answering "who designs
 * hotel interiors in Reykjavík" reads the same text as FAQPage structured
 * data. That only works if every answer is a fact stated on the page itself.
 * Marking up an answer the page does not make is the fastest route to a
 * manual action, so each entry below is either quoted from her own site or
 * derived from the project record.
 *
 * Note what is deliberately NOT here: prices. She publishes none, and her
 * stated process is a site visit followed by a quote. Inventing a price band
 * would be the single easiest way to lose her a job before the phone rings.
 */
import { STUDIO, CV, ADDRESS_LINE, HOURS_DAYS_IS } from './facts'
import { PROJECTS } from './projects'

export const SERVICES = [
  {
    name: 'Heildræn hönnun',
    desc: 'Skipulag, innréttingar, efnisval og lýsing fyrir heil hús og íbúðir, hannað sem ein heild.',
  },
  {
    name: 'Eldhús og baðherbergi',
    desc: 'Stök rými eru líka verkefni, því ekkert verk er of stórt eða lítið. Ítalskar innréttingar frá Arrital fást í stúdíóinu.',
  },
  {
    name: 'Gistiheimili og hótel',
    desc: 'Allt frá einni gistiíbúð upp í heilt hótel.',
  },
  {
    name: 'Atvinnuhúsnæði',
    desc: 'Skrifstofur og tannlæknastofa, hannaðar í anda fyrirtækjanna sem þar starfa, hlýlegar og vel skipulagðar með góðu flæði.',
  },
] as const

/** Her own process, from katrinisfeld.is/hafa-samband. */
export const PROCESS = [
  {
    title: 'Þú sendir stutta verklýsingu',
    body: 'Nokkrar línur um rýmið og hvað stendur til, í síma eða tölvupósti.',
  },
  {
    title: 'Katrín kemur á staðinn',
    body: 'Verkefnið er tekið út á staðnum í samráði við eigendur.',
  },
  {
    title: 'Tilboð í verkið',
    body: 'Í framhaldinu gerir Katrín tilboð í verkið.',
  },
] as const

export const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Hvað gerir innanhússarkitekt?',
    a:
      'Innanhússarkitekt hannar rýmið sjálft, ekki bara það sem sett er inn í það: skipulag, innréttingar, efni, liti, lýsingu og húsgögn sem ein heild. ' +
      `Katrín er með ${CV.degree} frá ${CV.school} í Flórída og er félagi í FHI, Félagi húsgagna- og innanhússarkitekta.`,
  },
  {
    q: 'Hvernig byrjar verkefni?',
    a:
      'Þú sendir stutta verklýsingu í tölvupósti eða hringir. Katrín kemur á staðinn og tekur verkefnið út í samráði við eigendur, og gerir í framhaldi tilboð í verkið.',
  },
  {
    q: 'Tekur hún að sér lítil verkefni?',
    a:
      'Já. Það er ekkert verk of stórt eða lítið. Í skránni eru bæði heil hús sem eru hönnuð frá grunni og stök rými: eitt eldhús, eitt baðherbergi, eitt fataherbergi.',
  },
  {
    q: 'Hvað kostar að fá innanhússarkitekt?',
    a:
      'Verðið ræðst af umfangi verkefnisins. Katrín kemur á staðinn, tekur verkefnið út í samráði við eigendur og gerir í framhaldi tilboð í verkið.',
  },
  {
    q: 'Hannar hún gistiheimili og hótel?',
    a:
      `Já. Sex af verkefnunum í skránni eru gistirými, allt frá einstökum gistiíbúðum í eldri húsum upp í heilt hótel: Freyja gistiheimili, Freyja lúxusíbúð, Svala Apartments, Sólvallagata, Old Charm Reykjavik Apartment og Hótel Hekla.`,
  },
  {
    q: 'Hvaða innréttingar er hægt að fá hjá henni?',
    a:
      'Eldhúsinnréttingar frá ítalska framleiðandanum Arrital, baðinnréttingar frá Arrital undir merkinu Altamarea og Living-línuna fyrir borðstofu og stofu. Fyrir fataherbergi, fataskápa og húsgögn er það ítalski framleiðandinn Novamobili. Innréttingarnar fást hjá Katrín Ísfeld Hönnunar Studio.',
  },
  {
    q: 'Hvar er stúdíóið og hvenær er opið?',
    a: `Heimilisfang stúdíósins er ${ADDRESS_LINE}. Opnunartími er frá ${STUDIO.opens} til ${STUDIO.closes} ${HOURS_DAYS_IS}, og best er að hafa samband fyrirfram til að bóka tíma. Sími ${STUDIO.phoneDisplay}, netfang ${STUDIO.email}.`,
  },
  {
    q: 'Vinnur hún utan höfuðborgarsvæðisins?',
    a:
      'Já. Flest verkefnin eru á höfuðborgarsvæðinu, í Reykjavík, Kópavogi og Garðabæ, en meðal þeirra eru líka sumarhús í Fljótshlíðinni og í Ölfusi og Hótel Hekla úti á landi.',
  },
]

/* ── English ───────────────────────────────────────────────────────────
   One page, not a mirror. The English-speaking demand here is specific:
   guesthouse and hotel owners, and people who have moved to Iceland and are
   renovating. They need who she is, what she does, proof, and how to reach
   her, in that order. A full translation of twenty-six pages would be a
   different project and is noted as such in KATRIN-SEO.md. */
export const EN = {
  title: 'Katrín Ísfeld, interior architect in Reykjavík, Iceland',
  desc:
    'Katrín Ísfeld is an interior architect in Reykjavík designing homes, guesthouses, hotels and commercial interiors, and sells Italian kitchens, bathrooms and wardrobes from Arrital and Novamobili.',
  lead: 'An interior architect in Reykjavík who designs a space as a whole, from the plan to the last light fitting.',
  paras: [
    `Katrín Ísfeld holds a BSc in interior architecture from the ${CV.school} in Florida, where she graduated with honours and took second place in an international design competition in the United States. She worked as an interior architect at an architecture practice in Fort Lauderdale designing luxury villas, and at the practice of Margreed Van der Hooven in the Netherlands, before opening her own studio in Reykjavík.`,
    `She is a member of FHI, the Icelandic association of furniture and interior architects. Her portfolio includes ${PROJECTS.length} projects: homes and summer houses, guesthouses and a hotel, offices and a dental clinic.`,
    'The studio also sells Italian interiors: kitchens from Arrital, bathroom furniture from Arrital under the Altamarea name, Arrital\'s Living line for dining and living rooms, and wardrobes and furniture from Novamobili.',
  ],
  how: {
    title: 'How a project starts',
    body: 'Send a short description of the space and what you have in mind. Katrín visits the site and assesses the project together with the owners, then quotes for the work. No job is too large or too small.',
  },
  contactTitle: 'Get in touch',
} as const

/* ── PAGE-SCOPED QUESTIONS ────────────────────────────────────────────────
   The audit found FAQ markup on exactly one page of thirty-four and five
   question-phrased headings across the whole site, which is why nothing here
   was eligible for a featured snippet, a People Also Ask box or a voice
   answer. These are the questions people actually type before they hire an
   interior architect, and each answer is written to the length a snippet
   takes — roughly forty to sixty words, complete on its own, with the fact
   in the first sentence rather than the last.

   THEY ARE RENDERED AS VISIBLE HEADINGS AND PARAGRAPHS, not inside a
   <details>. A collapsed answer is still read by a crawler but it is second
   choice for extraction, and these are the pages where extraction is the
   whole point.

   NOTHING HERE INVENTS A PRICE. She has no published rate and I will not
   publish one for her; the cost question is answered with the process that
   produces the number, which is true and is what a caller needs to know. */
export const FAQ_CONTACT: Array<{ q: string; a: string }> = [
  {
    q: 'Hvað kostar að fá innanhússarkitekt?',
    a:
      'Það fer eftir umfangi verksins og því er ekki eitt fast verð. Katrín kemur á staðinn, tekur rýmið út með eigendum og gerir í framhaldi tilboð í verkið miðað við það sem raunverulega stendur til. Það kostar ekkert að senda fyrirspurn og spyrja.',
  },
  {
    q: 'Tekur hún að sér lítil verkefni?',
    a:
      'Já. Verkefnin spanna allt frá heilum húsum niður í eitt eldhús, eitt baðherbergi eða eitt fataherbergi. Vinnan er sú sama í öllum tilvikum, það er umfangið sem breytist. Baðherbergi og eldhús eru algengustu einstöku rýmin sem hún tekur að sér.',
  },
  {
    q: 'Hvar er stúdíóið og get ég komið við?',
    a:
      `Stúdíóið er í Katrínartúni 4 í Reykjavík og þar er sýningarrými með ítölskum innréttingum og efnissýnishornum. Opið er ${STUDIO.opens}–${STUDIO.closes} ${HOURS_DAYS_IS}, en stúdíóið er ekki opin verslun, svo best er að hringja eða senda tölvupóst og bóka tíma áður en komið er.`,
  },
]

/** One question per flokkur, answered where the visitor is standing. */
export const FAQ_CATEGORY: Record<string, { q: string; a: string }> = {
  'innanhusshonnun': {
    q: 'Hvað felst í heildrænni hönnun á heimili?',
    a:
      'Skipulag, innréttingar, efnisval og lýsing eru hönnuð saman, sem ein heild. Það á jafnt við um nýbyggingu og eldra hús sem er tekið í gegn.',
  },
  'gistiheimili-og-hotel': {
    q: 'Hvers konar gistirými hefur Katrín hannað?',
    a:
      'Gistiíbúðir, gistiheimili og hótel, allt frá einni íbúð upp í heilt hótel. Meðal þeirra eru Freyja gistiheimili, Freyja lúxusíbúð, Svala Apartments, Sólvallagata, Old Charm Reykjavik Apartment og Hótel Hekla.',
  },
  'atvinnuhusnaedi': {
    q: 'Hvers konar atvinnuhúsnæði hefur Katrín hannað?',
    a:
      'Skrifstofur og tannlæknastofu. Rýmin eru hönnuð í anda þeirra fyrirtækja sem þar starfa, hlýleg og vel skipulögð með góðu flæði. Meðal þeirra eru Lánasjóður sveitarfélaga, Samkennd Heilsusetur, Alfreð Atvinnuleit, Digido, Múr & Mál og Tannlæknastofan á Garðatorgi.',
  },
}
