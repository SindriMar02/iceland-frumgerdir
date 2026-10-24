import { CONTACT } from './vorur'

/* Every form on the page, as data. The visitor fills a few honest fields,
   reviews a finished brief and opens it in their own mail program or copies
   it. Nothing is sent from the prototype; a live build posts to Kaldi's inbox
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

/** the keg list: the beers sit above the form in the drawer */
export const PONTUN: Eydublad = {
  key: 'kutar',
  to: CONTACT.email,
  ref: 'KK',
  title: 'Fyrir hvaða viðburð?',
  subject: 'Kútar og dæla',
  subjectField: 'event',
  brief: 'Fyrirspurn um bjórkúta og dælu til Bruggsmiðjunnar Kalda',
  submit: 'Skoða fyrirspurnina',
  contactEither: true,
  fields: [
    { id: 'event', kind: 'select', label: 'Viðburður', required: true, heild: true, options: [
      o('Brúðkaup', 'Brúðkaup'), o('Afmæli', 'Afmæli'), o('Fyrirtæki eða árshátíð', 'Fyrirtæki eða árshátíð'), o('Annað', 'Annað'),
    ] },
    { id: 'when', kind: 'text', label: 'Dagsetning', heild: true, placeholder: 'Til dæmis 14. nóvember…' },
    { id: 'where', kind: 'text', label: 'Staður', heild: true },
    ...person,
    { id: 'message', kind: 'textarea', label: 'Annað', rows: 3 },
  ],
}

export const KYNNING: Eydublad = {
  key: 'kynning',
  to: CONTACT.email,
  ref: 'KY',
  title: 'Bóka kynningu',
  lead: 'Kynningar eru almennt 60 mínútur. Verð á mann er 3.500 kr. og hægt er að fá tilboð fyrir stærri hópa.',
  subject: 'Kynning',
  subjectField: 'group',
  brief: 'Beiðni um kynningu hjá Bruggsmiðjunni Kalda',
  submit: 'Skoða beiðnina',
  contactEither: true,
  fields: [
    { id: 'group', kind: 'text', label: 'Hópur eða fyrirtæki', required: true, auto: 'organization' },
    { id: 'size', kind: 'qty', label: 'Fjöldi í hópnum' },
    { id: 'when', kind: 'text', label: 'Óskadagur og tími', required: true, placeholder: 'Til dæmis föstudagur 6. nóvember kl. 16…' },
    ...person,
    { id: 'message', kind: 'textarea', label: 'Annað', rows: 3 },
  ],
}

export const SERMERKING: Eydublad = {
  key: 'sermerking',
  to: CONTACT.emailSermerking,
  ref: 'KS',
  title: 'Um tilefnið',
  lead: 'Segðu okkur frá tilefninu. Jói svarar öllum spurningum og fer yfir hönnun, magn og afhendingu með þér.',
  subject: 'Sérmerking',
  subjectField: 'occasion',
  brief: 'Fyrirspurn um sérmerkingu til Bruggsmiðjunnar Kalda',
  submit: 'Skoða fyrirspurnina',
  contactEither: true,
  fields: [
    { id: 'vessel', kind: 'select', label: 'Umbúðir', required: true, options: [o('Flöskur', 'Flöskur'), o('Dósir', 'Dósir'), o('Ekki ákveðið', 'Ekki ákveðið')] },
    { id: 'occasion', kind: 'select', label: 'Tilefni', required: true, options: [
      o('Brúðkaup', 'Brúðkaup'), o('Veisla eða afmæli', 'Veisla eða afmæli'), o('Fyrirtæki', 'Fyrirtæki'), o('Annað', 'Annað'),
    ] },
    { id: 'label', kind: 'text', label: 'Texti á miðann', heild: true, placeholder: 'Til dæmis Anna og Jón, 12.6.2027…' },
    { id: 'qty', kind: 'qty', label: 'Áætlaður fjöldi' },
    { id: 'when', kind: 'text', label: 'Hvenær þarf að afhenda' },
    ...person,
    { id: 'logo', kind: 'files', label: 'Merki eða mynd (valfrjálst)' },
    { id: 'message', kind: 'textarea', label: 'Annað', rows: 3 },
  ],
}

export const SPYRJA: Eydublad = {
  key: 'spyrja',
  to: CONTACT.email,
  ref: 'KF',
  title: 'Skilaboð til Kalda',
  subject: 'Fyrirspurn',
  subjectField: 'topic',
  brief: 'Fyrirspurn til Bruggsmiðjunnar Kalda',
  submit: 'Skoða skilaboðin',
  contactEither: true,
  fields: [
    { id: 'topic', kind: 'select', label: 'Um hvað er spurt', required: true, heild: true, options: [
      o('Spurning um bjór', 'Spurning um bjór'), o('Kynningar', 'Kynningar'), o('Sérmerking', 'Sérmerking'), o('Kútar og dæla', 'Kútar og dæla'),
      o('Veitingastaður eða verslun', 'Veitingastaður eða verslun'), o('Annað', 'Annað'),
    ] },
    ...person,
    { id: 'message', kind: 'textarea', label: 'Skilaboð', required: true, rows: 5 },
  ],
}
