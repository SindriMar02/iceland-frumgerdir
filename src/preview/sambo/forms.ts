import { CONTACT } from './vorur'

/* Every form on the page, as data. The visitor fills a few honest fields,
   reviews a finished brief and opens it in their own mail program or copies
   it. Nothing is sent from the prototype; a live build posts to Kólus' inbox
   and shows the reference only once delivery has succeeded. */

export type Valkostur = { v: string; t: string }
export type Reitur =
  | { id: string; kind: 'text' | 'email' | 'tel' | 'textarea'; label: string; required?: boolean; auto?: string; rows?: number; heild?: boolean; placeholder?: string }
  | { id: string; kind: 'select'; label: string; options: Valkostur[]; required?: boolean; heild?: boolean }
  | { id: string; kind: 'qty'; label: string }
  | { id: string; kind: 'files'; label: string }

export interface Eydublad {
  key: string
  to: string
  ref: string
  title: string
  lead?: string
  subject: string
  subjectField?: string
  brief: string
  submit: string
  /** the visitor must give a phone number or an email */
  contactEither?: boolean
  fields: Reitur[]
}

const o = (v: string, t: string): Valkostur => ({ v, t })

const person: Reitur[] = [
  { id: 'person', kind: 'text', label: 'Nafn', required: true, auto: 'name' },
  { id: 'phone', kind: 'tel', label: 'Sími', auto: 'tel' },
  { id: 'email', kind: 'email', label: 'Netfang', auto: 'email' },
]

/** the trade order: the product list sits above the form in the drawer */
export const PONTUN: Eydublad = {
  key: 'pontun',
  to: CONTACT.email,
  ref: 'SB',
  title: 'Hver pantar?',
  subject: 'Pöntun',
  subjectField: 'company',
  brief: 'Pöntun eða fyrirspurn til Kólus (Sambó)',
  submit: 'Skoða pöntunina',
  contactEither: true,
  fields: [
    { id: 'company', kind: 'text', label: 'Fyrirtæki', required: true, auto: 'organization' },
    { id: 'kt', kind: 'text', label: 'Kennitala' },
    { id: 'type', kind: 'select', label: 'Tegund rekstrar', options: [
      o('Verslun', 'Verslun'), o('Söluturn eða bensínstöð', 'Söluturn eða bensínstöð'), o('Veitingastaður eða kaffihús', 'Veitingastaður eða kaffihús'),
      o('Hótel eða gistiheimili', 'Hótel eða gistiheimili'), o('Heildsali eða dreifingaraðili', 'Heildsali eða dreifingaraðili'), o('Annað', 'Annað'),
    ], heild: true },
    { id: 'town', kind: 'text', label: 'Staður eða afhendingarheimilisfang', heild: true },
    { id: 'when', kind: 'text', label: 'Hvenær þarf að afhenda', heild: true, placeholder: 'Til dæmis fyrir lok mánaðarins' },
    ...person,
    { id: 'message', kind: 'textarea', label: 'Annað', rows: 3 },
  ],
}

export const FJAROFLUN: Eydublad = {
  key: 'fjarofloun',
  to: CONTACT.emailFundraise,
  ref: 'SP',
  title: 'Páskapöntun fyrir félag',
  lead: 'Páskanammið er framleitt eftir pöntun. Segðu okkur fyrir hvaða félag, hvað á að panta og hvenær og hvert á að afhenda.',
  subject: 'Páskafjáröflun',
  subjectField: 'org',
  brief: 'Páskapöntun fyrir félag til Kólus (Sambó)',
  submit: 'Skoða beiðnina',
  contactEither: true,
  fields: [
    { id: 'org', kind: 'text', label: 'Félag eða samtök', required: true, auto: 'organization' },
    { id: 'orgkt', kind: 'text', label: 'Kennitala félags', required: true },
    { id: 'egg', kind: 'qty', label: 'Sambó páskaegg, fjöldi' },
    { id: 'ball', kind: 'qty', label: 'Páskaboltar, fjöldi' },
    { id: 'thrista', kind: 'qty', label: 'Þrista páskaegg, fjöldi' },
    { id: 'when', kind: 'text', label: 'Hvenær þarf að afhenda', placeholder: 'Til dæmis vikuna fyrir páska' },
    { id: 'where', kind: 'text', label: 'Afhendingarstaður', heild: true, auto: 'street-address' },
    ...person,
    { id: 'message', kind: 'textarea', label: 'Annað', rows: 3 },
  ],
}

export const STARF: Eydublad = {
  key: 'starf',
  to: CONTACT.email,
  ref: 'SS',
  title: 'Starfsumsókn',
  lead: 'Segðu okkur í stuttu máli frá þér. Þú getur sett ferilskrá með.',
  subject: 'Starfsumsókn',
  subjectField: 'person',
  brief: 'Starfsumsókn til Kólus (Sambó)',
  submit: 'Skoða umsóknina',
  contactEither: true,
  fields: [
    ...person,
    { id: 'role', kind: 'text', label: 'Hvaða starf', heild: true, placeholder: 'Til dæmis framleiðsla, pökkun, akstur' },
    { id: 'message', kind: 'textarea', label: 'Um þig', required: true, rows: 5 },
    { id: 'cv', kind: 'files', label: 'Ferilskrá' },
  ],
}

export const SPYRJA: Eydublad = {
  key: 'spyrja',
  to: CONTACT.email,
  ref: 'SK',
  title: 'Skilaboð til Sambó',
  subject: 'Fyrirspurn',
  subjectField: 'topic',
  brief: 'Fyrirspurn til Kólus (Sambó)',
  submit: 'Skoða skilaboðin',
  contactEither: true,
  fields: [
    { id: 'topic', kind: 'select', label: 'Um hvað er spurt', required: true, heild: true, options: [
      o('Spurning um vöru', 'Spurning um vöru'), o('Ofnæmi eða innihald', 'Ofnæmi eða innihald'), o('Verslun eða heildsala', 'Verslun eða heildsala'),
      o('Útflutningur', 'Útflutningur'), o('Annað', 'Annað'),
    ] },
    ...person,
    { id: 'message', kind: 'textarea', label: 'Skilaboð', required: true, rows: 5 },
  ],
}

export const VERSLUN: Eydublad = {
  key: 'verslun',
  to: CONTACT.email,
  ref: 'SL',
  title: 'Viltu Sambó í þinni verslun?',
  lead: 'Segðu okkur hvaða verslun og hvar, við komum því áfram.',
  subject: 'Óskað eftir Sambó í verslun',
  subjectField: 'store',
  brief: 'Ósk um að Sambó fáist í verslun',
  submit: 'Skoða skilaboðin',
  contactEither: true,
  fields: [
    { id: 'store', kind: 'text', label: 'Verslun', required: true },
    { id: 'town', kind: 'text', label: 'Staður', required: true },
    ...person,
  ],
}
