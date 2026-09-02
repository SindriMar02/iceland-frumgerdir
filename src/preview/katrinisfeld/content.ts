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
import { STUDIO, CV, ADDRESS_LINE, BRANDS, HOURS_DAYS_IS } from './facts'
import { byCategory } from './projects'

export const SERVICES = [
  {
    name: 'Heildarhönnun innanhúss',
    desc: 'Húsið eða íbúðin öll: skipulag rýma, innréttingar, efnisval, litir, lýsing og húsgögn, teiknað sem ein heild frá byrjun.',
  },
  {
    name: 'Eldhús og baðherbergi',
    desc: 'Einstök rými þar sem sérsmíðuð innrétting skilar mestu. Teikning, efnisval og innréttingar frá Arrital og Altamarea.',
  },
  {
    name: 'Gistiheimili og hótel',
    desc: 'Gistirými sem þola stöðuga umgengni, haldast samræmd á milli herbergja og standast samanburð á bókunarsíðum.',
  },
  {
    name: 'Atvinnuhúsnæði',
    desc: 'Móttökur, biðstofur og skrifstofurými þar sem hönnunin er hluti af þjónustunni sem fyrirtækið veitir.',
  },
  {
    name: 'Ráðgjöf um efni, liti og húsgögn',
    desc: 'Afmörkuð ráðgjöf fyrir þá sem eru komnir af stað en vantar að láta valið ganga upp saman.',
  },
] as const

/** Her own process, from katrinisfeld.is/hafa-samband. */
export const PROCESS = [
  {
    title: 'Þú sendir stutta verklýsingu',
    body: 'Nokkrar línur um rýmið, hvað stendur til og hvenær. Sími eða tölvupóstur, hvort sem hentar betur.',
  },
  {
    title: 'Katrín kemur á staðinn',
    body: 'Verkefnið er tekið út á staðnum í samráði við eigendur, því ekkert af því sem skiptir máli sést á ljósmynd.',
  },
  {
    title: 'Tilboð í verkið',
    body: 'Í framhaldi af úttektinni færðu tilboð í verkið, miðað við umfangið eins og það liggur fyrir.',
  },
  {
    title: 'Hönnun og eftirfylgni',
    body: 'Teikningar, efnisval og innréttingar, og eftirfylgni með þeim sem smíða og setja upp.',
  },
] as const

export const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Hvað gerir innanhússarkitekt?',
    a:
      'Innanhússarkitekt hannar rýmið sjálft, ekki bara það sem sett er inn í það: skipulag, innréttingar, efni, liti, lýsingu og húsgögn sem ein heild. ' +
      `Katrín er með ${CV.degree} frá ${CV.school} í Flórída og er félagi í Félagi húsgagna- og innanhússarkitekta (FHI).`,
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
      'Verðið ræðst af umfangi verkefnisins og er ekki gefið upp fyrirfram. Katrín tekur verkefnið út á staðnum og gerir tilboð í það, svo verðið sé miðað við raunverulegt umfang en ekki ágiskun.',
  },
  {
    q: 'Hannar hún gistiheimili og hótel?',
    a:
      `Já. ${byCategory('gistiheimili-og-hotel').length} af verkefnunum í skránni eru gistirými, allt frá einstökum gistiíbúðum í eldri húsum upp í hótel: Freyja gistiheimili, Freyja lúxusíbúð, Svala Apartments, Sólvallagata, Old Charm Reykjavik Apartment og Hótel Hekla.`,
  },
  {
    q: 'Hvaða innréttingar er hægt að fá hjá henni?',
    a:
      `Ítalskar innréttingar frá ${BRANDS.map((b) => b.name).join(' fyrir eldhús og ')} fyrir baðherbergi fást hjá Katrín Ísfeld Hönnunar Studio, og eru teiknaðar inn í hvert verkefni fyrir sig.`,
  },
  {
    q: 'Hvar er stúdíóið og hvenær er opið?',
    a: `Stúdíóið er á ${ADDRESS_LINE}. Opnunartími er frá ${STUDIO.opens} til ${STUDIO.closes} ${HOURS_DAYS_IS}, og best er að hafa samband fyrirfram til að bóka tíma. Sími ${STUDIO.phoneDisplay}, netfang ${STUDIO.email}.`,
  },
  {
    q: 'Vinnur hún utan höfuðborgarsvæðisins?',
    a:
      'Já. Flest verkefnin eru á höfuðborgarsvæðinu, í Reykjavík, Kópavogi og Garðabæ, en meðal þeirra er líka sumarhús í Fljótshlíðinni.',
  },
]

/* ── English ───────────────────────────────────────────────────────────
   One page, not a mirror. The English-speaking demand here is specific:
   guesthouse and hotel owners, and people who have moved to Iceland and are
   renovating. They need who she is, what she does, proof, and how to reach
   her, in that order. A full translation of twenty-six pages would be a
   different project and is noted as such in KATRIN-SEO.md. */
export const EN = {
  title: 'Katrín Ísfeld — interior architect in Reykjavík, Iceland',
  desc:
    'Katrín Ísfeld is an interior architect in Reykjavík designing homes, guesthouses, hotels and commercial interiors, and the Icelandic stockist for Arrital kitchens and Altamarea bathrooms.',
  lead: 'An interior architect in Reykjavík who designs a space as a whole, from the plan to the last light fitting.',
  paras: [
    `Katrín Ísfeld holds a BSc in interior architecture from the ${CV.school} in Florida, where she graduated with honours and took second place in a national design competition. She worked as an interior architect at an architecture practice in Fort Lauderdale designing luxury villas, and at the practice of Margreed Van der Hooven in the Netherlands, before opening her own studio in Reykjavík.`,
    'She is a member of FHI, the Icelandic association of furniture and interior architects. Her published record runs to twenty-three projects across four categories: private homes and summer houses, guesthouses and hotels, commercial and healthcare interiors, and smaller single-room commissions.',
    'For owners of guesthouses and short-stay apartments, the work is specific: rooms that stay consistent with each other so every unit sells at the same rate, materials that survive constant turnover, and interiors that photograph well enough to compete on Booking and Airbnb.',
    'The studio is also the Icelandic stockist for Arrital, the Italian kitchen manufacturer, and Altamarea, which makes made-to-measure bathroom furniture. Both are drawn into each project rather than picked from a catalogue.',
  ],
  how: {
    title: 'How a project starts',
    body: 'Send a short description of the space and what you have in mind. Katrín visits the site and assesses the project together with the owners, then quotes for the work. No job is too large or too small.',
  },
  contactTitle: 'Get in touch',
} as const
