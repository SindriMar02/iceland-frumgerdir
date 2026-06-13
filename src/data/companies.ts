/**
 * Central company/page data for all five redesign prototypes.
 *
 * The Icelandic outreach emails live in src/data/outreach.ts — kept in a
 * separate module that is only loaded when the send-preview modal opens,
 * so the pitch text is not part of the bundle an owner downloads.
 */

export interface Company {
  slug: string
  route: string
  name: string
  location: string
  currentUrl: string
  concept: string
  mood: string
  cardImage: string
  cardDescription: string
  preview: {
    previewUrlPlaceholder: string
  }
}

export const companies: Company[] = [
  {
    slug: 'ice-tourism',
    route: '/ice-tourism',
    name: 'Ice Tourism',
    location: 'Reykjavík',
    currentUrl: 'https://icetourism.com',
    concept: 'Arctic Expedition',
    mood: 'Cold · dramatic · expert-led',
    cardImage:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    cardDescription:
      'A licensed Reykjavík DMC repositioned as a premium private expedition operator — cinematic ice, glass surfaces, quiet confidence.',
    preview: {
      previewUrlPlaceholder: 'https://sindrimar02.github.io/iceland-frumgerdir/ice-tourism',
    },
  },
  {
    slug: 'daeli-farm',
    route: '/daeli-farm',
    name: 'Dæli Farm',
    location: 'Víðidalur, Norðurland vestra',
    currentUrl: 'https://daeli.is',
    concept: 'The Slow Valley',
    mood: 'Warm · honest · peaceful',
    cardImage:
      'https://images.unsplash.com/photo-1598208083114-991498347e6d?q=80&w=1200&auto=format&fit=crop',
    cardDescription:
      'A family farm stay told like a storybook — cream paper, warm serifs, polaroid moments. You feel the valley before you book it.',
    preview: {
      previewUrlPlaceholder: 'https://sindrimar02.github.io/iceland-frumgerdir/daeli-farm',
    },
  },
  {
    slug: 'eldhestar',
    route: '/eldhestar',
    name: 'Eldhestar',
    location: 'Hveragerði',
    currentUrl: 'https://eldhestar.is',
    concept: 'Fire & Hoofbeats',
    mood: 'Earthy · cinematic · heritage',
    cardImage:
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200&auto=format&fit=crop',
    cardDescription:
      'Iceland’s volcano horses as a once-in-a-lifetime ride — poster typography, ember accents, a thousand years of breed heritage.',
    preview: {
      previewUrlPlaceholder: 'https://sindrimar02.github.io/iceland-frumgerdir/eldhestar',
    },
  },
  {
    slug: 'guesthouse-carina',
    route: '/guesthouse-carina',
    name: 'Guesthouse Carina',
    location: 'Vík í Mýrdal',
    currentUrl: 'https://guesthousecarina.is',
    concept: 'The Vík Basecamp',
    mood: 'Clean · warm · boutique',
    cardImage:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop',
    cardDescription:
      'A 14-room guesthouse five minutes from the black beach, repositioned as a boutique stay that out-converts its own OTA listings.',
    preview: {
      previewUrlPlaceholder: 'https://sindrimar02.github.io/iceland-frumgerdir/guesthouse-carina',
    },
  },
  {
    slug: 'gj-travel',
    route: '/gj-travel',
    name: 'GJ Travel',
    location: 'Kópavogur',
    currentUrl: 'https://gjtravel.is',
    concept: 'Ninety Years North',
    mood: 'Professional · Nordic · polished',
    cardImage:
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200&auto=format&fit=crop',
    cardDescription:
      'Nine decades of Icelandic touring, redesigned with Swiss-grid confidence — a legacy operator that finally looks like one.',
    preview: {
      previewUrlPlaceholder: 'https://sindrimar02.github.io/iceland-frumgerdir/gj-travel',
    },
  },
]

export function getCompany(slug: string): Company {
  const company = companies.find((c) => c.slug === slug)
  if (!company) throw new Error(`Unknown company slug: ${slug}`)
  return company
}
