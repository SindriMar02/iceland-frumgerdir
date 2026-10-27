import { CONTACT } from './vorur'



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
  
  contactEither?: boolean
  fields: Reitur[]
}

const o = (v: string, t: string): Valkostur => ({ v, t })

const person: Reitur[] = [
  { id: 'person', kind: 'text', label: 'Nafn', required: true, auto: 'name' },
  { id: 'phone', kind: 'tel', label: 'Sími', auto: 'tel' },
  { id: 'email', kind: 'email', label: 'Netfang', auto: 'email' },
]


export const PONTUN: Eydublad = {
  key: 'pontun',
  to: CONTACT.emailOrders,
  ref: 'HB',
  title: 'Hver pantar?',
  subject: 'Pöntun',
  subjectField: 'company',
  brief: 'Pöntun til H-Berg',
  submit: 'Skoða pöntunina',
  contactEither: true,
  fields: [
    { id: 'company', kind: 'text', label: 'Verslun eða fyrirtæki', required: true, auto: 'organization' },
    { id: 'kt', kind: 'text', label: 'Kennitala' },
    { id: 'type', kind: 'select', label: 'Tegund rekstrar', options: [
      o('Verslun', 'Verslun'), o('Söluturn eða bensínstöð', 'Söluturn eða bensínstöð'), o('Veitingastaður eða kaffihús', 'Veitingastaður eða kaffihús'),
      o('Hótel eða gistiheimili', 'Hótel eða gistiheimili'), o('Heildsali eða dreifingaraðili', 'Heildsali eða dreifingaraðili'), o('Annað', 'Annað'),
    ], heild: true },
    { id: 'town', kind: 'text', label: 'Staður eða afhendingarheimilisfang', heild: true },
    { id: 'when', kind: 'text', label: 'Hvenær þarf að afhenda', heild: true, placeholder: 'Til dæmis fyrir lok mánaðarins…' },
    ...person,
    { id: 'message', kind: 'textarea', label: 'Annað', rows: 3 },
  ],
}

export const SPYRJA: Eydublad = {
  key: 'spyrja',
  to: CONTACT.email,
  ref: 'HB',
  title: 'Skilaboð til H-Berg',
  subject: 'Fyrirspurn',
  subjectField: 'topic',
  brief: 'Fyrirspurn til H-Berg (H-Berg)',
  submit: 'Skoða skilaboðin',
  contactEither: true,
  fields: [
    { id: 'topic', kind: 'select', label: 'Um hvað er spurt', required: true, heild: true, options: [
      o('Spurning um vöru', 'Spurning um vöru'), o('Ofnæmi eða innihald', 'Ofnæmi eða innihald'), o('Verslun eða heildsala', 'Verslun eða heildsala'),
      o('Annað', 'Annað'),
    ] },
    ...person,
    { id: 'message', kind: 'textarea', label: 'Skilaboð', required: true, rows: 5 },
  ],
}


export const STAERRA:Eydublad={...SPYRJA,key:'staerra',to:CONTACT.emailOrders,title:'Stærri pakkningar',subject:'Fyrirspurn um stærri pakkningar',lead:'Við pökkum í stærri einingar fyrir matvælafyrirtæki, matsölustaði og stóreldhús.'}
