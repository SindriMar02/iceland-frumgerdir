/**
 * Pólar Hestar — the "Everything for your visit" cards as questions and answers.
 *
 * The owners' practical cards (booking, payment, children, equipment, arrival,
 * cancellation, pickup) live in the CMS as a title and a body per language,
 * each tagged short rides / long tours / both. They are the answers to the
 * questions guests actually ask, so the page shows them under a question and
 * the structured data (FAQPage, one set per audience) repeats exactly what the
 * page shows.
 *
 * The question wording is ours (the CMS holds only the owners' short titles,
 * which stay visible as the card's label). A card whose English title is not
 * in QUESTIONS (one the owners added in the CMS) simply shows its own title as
 * the heading and is still part of the FAQ set. The answer is always the
 * owners' text, untouched.
 */
import type { GoodToKnowData, GtkItem, L3, Lang } from './data'

export type FaqSet = 'short' | 'long'

const QUESTIONS: Record<string, L3> = {
  'personal booking': {
    is: 'Hvernig bóka ég reiðtúr eða ferð?',
    en: 'How do I book a ride or a tour?',
    de: 'Wie buche ich einen Ausritt oder eine Tour?',
  },
  payment: {
    is: 'Hvernig er greitt?',
    en: 'How does payment work?',
    de: 'Wie funktioniert die Bezahlung?',
  },
  children: {
    is: 'Mega börn koma með og hvað borga þau?',
    en: 'Can children ride, and what do they pay?',
    de: 'Dürfen Kinder mitreiten, und was zahlen sie?',
  },
  equipment: {
    is: 'Hvaða búnað fæ ég og hvað á ég að taka með?',
    en: 'What equipment do you provide, and what should I bring?',
    de: 'Welche Ausrüstung stellen Sie, und was soll ich mitbringen?',
  },
  arrival: {
    is: 'Hvenær á ég að mæta?',
    en: 'When should I arrive?',
    de: 'Wann sollte ich ankommen?',
  },
  cancellation: {
    is: 'Hverjar eru afbókunarreglurnar?',
    en: 'What is the cancellation policy?',
    de: 'Wie sind die Stornierungsbedingungen?',
  },
  pickup: {
    is: 'Sækið þið gesti á Akureyri?',
    en: 'Do you pick guests up in Akureyri?',
    de: 'Holen Sie Gäste in Akureyri ab?',
  },
}

export interface FaqEntry {
  /** Stable id for anchors and keys: faq-short-2 */
  id: string
  /** The owners' own card title, shown small above the question; '' when the title is the heading itself. */
  label: string
  question: string
  /** The owners' text. */
  answer: string
}

const forSet = (it: GtkItem, set: FaqSet) => !it.audience || it.audience === 'both' || it.audience === set

export function faqEntries(gtk: GoodToKnowData, set: FaqSet, lang: Lang): FaqEntry[] {
  return gtk.items
    .filter((it) => forSet(it, set))
    .map((it, i) => {
      const asked = QUESTIONS[(it.title.en || '').trim().toLowerCase()]?.[lang]
      const title = (it.title[lang] || it.title.en || '').trim()
      return {
        id: `faq-${set}-${i}`,
        label: asked ? title : '',
        question: asked ?? title,
        answer: (it.body[lang] || it.body.en || '').trim(),
      }
    })
    .filter((e) => e.question && e.answer)
}
