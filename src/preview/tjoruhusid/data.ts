/**
 * Sample content for the Tjöruhúsið redesign concept.
 * Dishes, voices and details are illustrative sample copy — disclaimed in the
 * shared PreviewFooter. The menu genuinely changes nightly with the catch.
 */

const U = 'https://images.unsplash.com/'
/** Build a card-sized Unsplash URL from a bare photo id. */
export const card = (id: string) => `${U}${id}?q=80&w=1200&auto=format&fit=crop`
/** Build a hero-sized Unsplash URL from a bare photo id. */
export const hero = (id: string) => `${U}${id}?q=80&w=2000&auto=format&fit=crop`
/** Build a single responsive variant for a srcSet entry. */
export const variant = (id: string, w: number) =>
  `${U}${id}?q=80&w=${w}&auto=format&fit=crop ${w}w`

export const HERO_ID = 'photo-1510130387422-82bed34b37e9'
export const ROOM_ID = 'photo-1537047902294-62a40c20a6ae'
export const PLACE_ID = 'photo-1519092437326-bfd121eb53ae'

export interface Dish {
  id: string
  name: string
  icelandic: string
  note: string
  imageId: string
}

export const DISHES: Dish[] = [
  {
    id: 'cod',
    name: 'Pan-fried cod',
    icelandic: 'Þorskur',
    note: 'Thick loins from this morning’s line-caught fish, finished in butter in the iron pan it’s served in.',
    imageId: 'photo-1580476262798-bddd9f4b7369',
  },
  {
    id: 'wolffish',
    name: 'Wolffish',
    icelandic: 'Steinbítur',
    note: 'Sweet, dense and local to these waters — the Westfjords’ quiet favourite when the boats land it.',
    imageId: 'photo-1580476262798-bddd9f4b7369',
  },
  {
    id: 'langoustine',
    name: 'Langoustine',
    icelandic: 'Humar',
    note: 'When the season gives them, they come to the table whole and barely touched — only when they come.',
    imageId: 'photo-1559737558-2f5a35f4523b',
  },
  {
    id: 'prawns',
    name: 'Garlic prawns',
    icelandic: 'Rækjur',
    note: 'Cooked in the pan with herbs and the day’s broth — the bowl that always empties first.',
    imageId: 'photo-1625943553852-781c6dd46faa',
  },
]

export interface Voice {
  quote: string
  name: string
  origin: string
}

export const VOICES: Voice[] = [
  {
    quote:
      'We drove four hours into the Westfjords for one dinner. Pans kept arriving until we surrendered. Worth every kilometre.',
    name: 'Marta',
    origin: 'Berlin',
  },
  {
    quote:
      'No menu, no choosing — just whatever the boats brought in, cooked perfectly, in the warmest old room in Iceland.',
    name: 'James',
    origin: 'Edinburgh',
  },
  {
    quote:
      'The fish was caught that morning and you can taste it. We came back the next night and ordered nothing again.',
    name: 'Sofie',
    origin: 'Copenhagen',
  },
]
